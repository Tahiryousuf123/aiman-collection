const { spawn } = require('child_process');
const http = require('http');
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
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(__dirname, '../.tmp-chrome-profile-2')
  ]);

  try {
    let versionInfo = null;
    for (let i = 0; i < 20; i++) {
      await sleep(200);
      try {
        versionInfo = await fetchJson('http://localhost:9223/json/version');
        if (versionInfo) break;
      } catch (e) {}
    }

    const targets = await fetchJson('http://localhost:9223/json/list');
    let target = targets.find(t => t.type === 'page');

    const WS = globalThis.WebSocket;
    const ws = new WS(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = event => {
          const msg = JSON.parse(event.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:3000' });
    await sleep(2000);

    const testRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const initialScrollX = window.scrollX;
          window.scrollTo(100, 0);
          const afterScrollX = window.scrollX;

          // Try scrolling documentElement
          document.documentElement.scrollLeft = 100;
          const htmlScrollLeft = document.documentElement.scrollLeft;

          // Try scrolling body
          document.body.scrollLeft = 100;
          const bodyScrollLeft = document.body.scrollLeft;

          // Check all root / top level containers
          const roots = [
            document.documentElement,
            document.body,
            document.querySelector('.top-announcement'),
            document.querySelector('.site-header'),
            document.querySelector('.kashaf-moving-category-section'),
            document.querySelector('.hero-slider-section'),
            document.querySelector('#catalog'),
            document.querySelector('footer')
          ].filter(Boolean);

          const rootData = roots.map(el => {
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              cls: el.className,
              id: el.id,
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth,
              offsetWidth: el.offsetWidth,
              rectW: r.width,
              rectL: r.left,
              rectR: r.right,
              overflowX: window.getComputedStyle(el).overflowX
            };
          });

          return {
            windowInnerWidth: window.innerWidth,
            initialScrollX,
            afterScrollX,
            htmlScrollLeft,
            bodyScrollLeft,
            docScrollWidth: document.documentElement.scrollWidth,
            docClientWidth: document.documentElement.clientWidth,
            bodyScrollWidth: document.body.scrollWidth,
            bodyClientWidth: document.body.clientWidth,
            rootData
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Horizontal Scroll Test Result:', JSON.stringify(testRes.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
