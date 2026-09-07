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
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(__dirname, '../.tmp-chrome-profile-3')
  ]);

  try {
    let versionInfo = null;
    for (let i = 0; i < 20; i++) {
      await sleep(200);
      try {
        versionInfo = await fetchJson('http://localhost:9224/json/version');
        if (versionInfo) break;
      } catch (e) {}
    }

    const targets = await fetchJson('http://localhost:9224/json/list');
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
      width: 500,
      height: 693,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:3000' });
    await sleep(2000);

    const checkRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const winW = window.innerWidth;
          const problems = [];
          const all = document.querySelectorAll('*');

          for (const el of all) {
            if (el.tagName === 'HTML' || el.tagName === 'BODY' || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;

            const rect = el.getBoundingClientRect();
            const cs = window.getComputedStyle(el);

            // Is it wider than window?
            const isWider = rect.width > winW;
            // Does it stick out to the right?
            const sticksOutRight = rect.right > winW + 1;
            // Does it stick out to the left?
            const sticksOutLeft = rect.left < -1;
            // Does its parent have overflow: hidden?
            let parent = el.parentElement;
            let clippedByParent = false;
            while (parent && parent !== document.body && parent !== document.documentElement) {
              const pcs = window.getComputedStyle(parent);
              if (pcs.overflowX === 'hidden' || pcs.overflow === 'hidden' || pcs.overflowX === 'clip') {
                clippedByParent = true;
                break;
              }
              parent = parent.parentElement;
            }

            if ((isWider || sticksOutRight || sticksOutLeft) && !clippedByParent) {
              problems.push({
                tag: el.tagName,
                id: el.id,
                className: el.className,
                rectW: Math.round(rect.width),
                rectL: Math.round(rect.left),
                rectR: Math.round(rect.right),
                display: cs.display,
                overflowX: cs.overflowX,
                parentTag: el.parentElement ? el.parentElement.tagName : null,
                parentClass: el.parentElement ? el.parentElement.className : null
              });
            }
          }

          return {
            winW,
            unclippedProblemsCount: problems.length,
            problems
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Unclipped Overflowing Elements:', JSON.stringify(checkRes.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
