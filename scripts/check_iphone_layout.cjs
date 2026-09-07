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
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(__dirname, '../.tmp-chrome-profile-6')
  ]);

  try {
    let versionInfo = null;
    for (let i = 0; i < 20; i++) {
      await sleep(200);
      try {
        versionInfo = await fetchJson('http://localhost:9227/json/version');
        if (versionInfo) break;
      } catch (e) {}
    }

    const targets = await fetchJson('http://localhost:9227/json/list');
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
    // iPhone 14 Pro Max dimensions: 430 x 932
    await send('Emulation.setDeviceMetricsOverride', {
      width: 430,
      height: 932,
      deviceScaleFactor: 3,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:3000' });
    await sleep(2000);

    const check = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const docScroll = document.documentElement.scrollWidth;
          const bodyScroll = document.body.scrollWidth;
          const winW = window.innerWidth;

          const wideElements = [];
          for (const el of document.querySelectorAll('*')) {
            if (el.tagName === 'HTML' || el.tagName === 'BODY' || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
            const r = el.getBoundingClientRect();
            // Check if element extends past right edge or left edge of 430px
            if (r.right > winW + 1 || r.width > winW + 1) {
              // check if it is clipped by an ancestor
              let p = el.parentElement;
              let isClipped = false;
              while (p && p !== document.body) {
                const s = window.getComputedStyle(p);
                if (s.overflowX === 'hidden' || s.overflowX === 'clip') {
                  isClipped = true;
                  break;
                }
                p = p.parentElement;
              }
              if (!isClipped) {
                wideElements.push({
                  tag: el.tagName,
                  id: el.id,
                  cls: el.className,
                  width: Math.round(r.width),
                  left: Math.round(r.left),
                  right: Math.round(r.right),
                  scrollWidth: el.scrollWidth
                });
              }
            }
          }

          return {
            winW,
            docScroll,
            bodyScroll,
            wideElements
          };
        })()
      `,
      returnByValue: true
    });

    console.log('iPhone 14 Pro Max Layout Check:', JSON.stringify(check.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chromeProc.kill();
  }
}

main();
