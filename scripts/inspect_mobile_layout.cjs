const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class SimpleCDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    const WS = globalThis.WebSocket;
    this.ws = new WS(this.wsUrl);
    await new Promise((res, rej) => {
      this.ws.onopen = res;
      this.ws.onerror = rej;
    });

    this.ws.onmessage = event => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(__dirname, '../.tmp-chrome-profile')
  ]);

  try {
    let versionInfo = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        versionInfo = await fetchJson('http://localhost:9222/json/version');
        if (versionInfo) break;
      } catch (e) {}
    }

    if (!versionInfo) {
      console.error('Could not connect to Chrome debugging port.');
      return;
    }

    const targets = await fetchJson('http://localhost:9222/json/list');
    let target = targets.find(t => t.type === 'page');
    if (!target) {
      const newTarget = await fetchJson('http://localhost:9222/json/new?http://localhost:3000');
      target = newTarget;
    }

    const cdp = new SimpleCDP(target.webSocketDebuggerUrl);
    await cdp.connect();

    console.log('Connected to Chrome CDP!');
    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');

    // Test at 360px and 500px width
    const viewports = [
      { width: 360, height: 740, name: '360px-mobile' },
      { width: 375, height: 667, name: '375px-iphone' },
      { width: 500, height: 693, name: '500px-user' }
    ];

    for (const vp of viewports) {
      console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: true
      });

      await cdp.send('Page.navigate', { url: 'http://localhost:3000' });
      await sleep(1500);

      // Scroll to catalog
      await cdp.send('Runtime.evaluate', {
        expression: `
          const cat = document.getElementById('catalog');
          if (cat) cat.scrollIntoView();
        `
      });
      await sleep(500);

      const evalResult = await cdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            try {
              const catalog = document.getElementById('catalog');
              const container = catalog ? catalog.querySelector('.container') : null;
              const grid = document.getElementById('productGridContainer');
              const firstCard = grid ? grid.querySelector('.product-card') : null;
              const price = firstCard ? firstCard.querySelector('.price-current') : null;
              const title = firstCard ? firstCard.querySelector('.product-title') : null;
              const waBtn = firstCard ? firstCard.querySelector('.product-wa-order-link') : null;

              function getBox(el) {
                if (!el) return null;
                const r = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                return {
                  left: r.left,
                  right: r.right,
                  width: r.width,
                  paddingLeft: style.paddingLeft,
                  paddingRight: style.paddingRight,
                  marginLeft: style.marginLeft,
                  marginRight: style.marginRight
                };
              }

              // Group overflowing elements by selector
              const allElements = document.querySelectorAll('*');
              const overflowSummary = {};
              for (const el of allElements) {
                const r = el.getBoundingClientRect();
                if (r.left < -1 || r.right > window.innerWidth + 1) {
                  if (el.tagName !== 'HTML' && el.tagName !== 'BODY') {
                    const tag = el.tagName.toLowerCase();
                    const id = el.id ? '#' + el.id : '';
                    const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).join('.') : '';
                    const key = tag + id + cls;
                    if (!overflowSummary[key]) {
                      overflowSummary[key] = { count: 0, minLeft: Math.round(r.left), maxRight: Math.round(r.right), maxW: Math.round(r.width) };
                    }
                    overflowSummary[key].count++;
                    overflowSummary[key].minLeft = Math.min(overflowSummary[key].minLeft, Math.round(r.left));
                    overflowSummary[key].maxRight = Math.max(overflowSummary[key].maxRight, Math.round(r.right));
                    overflowSummary[key].maxW = Math.max(overflowSummary[key].maxW, Math.round(r.width));
                  }
                }
              }

              return {
                windowWidth: window.innerWidth,
                docScrollWidth: document.documentElement.scrollWidth,
                bodyScrollWidth: document.body.scrollWidth,
                scrollX: window.scrollX,
                catalog: getBox(catalog),
                container: getBox(container),
                grid: getBox(grid),
                firstCard: getBox(firstCard),
                price: getBox(price),
                title: getBox(title),
                waBtn: getBox(waBtn),
                overflowSummary
              };
            } catch (err) {
              return { error: err.message, stack: err.stack };
            }
          })()
        `,
        returnByValue: true
      });

      console.log('Layout Analysis:', JSON.stringify(evalResult.result ? evalResult.result.value : evalResult, null, 2));

      // Take screenshot
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const shotPath = path.join(__dirname, `../screenshot_${vp.name}.png`);
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${shotPath}`);
    }

    cdp.close();
  } catch (err) {
    console.error('CDP Error:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
