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
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(__dirname, '../.tmp-chrome-profile-4')
  ]);

  try {
    let versionInfo = null;
    for (let i = 0; i < 20; i++) {
      await sleep(200);
      try {
        versionInfo = await fetchJson('http://localhost:9225/json/version');
        if (versionInfo) break;
      } catch (e) {}
    }

    const targets = await fetchJson('http://localhost:9225/json/list');
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
      mobile: true,
      hasTouch: true
    });

    await send('Page.navigate', { url: 'http://localhost:3000' });
    await sleep(2000);

    // Simulate touch swipe from right to left (swiping left, which scrolls right!)
    await send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: 400, y: 300 }]
    });
    for (let x = 380; x >= 50; x -= 30) {
      await send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x, y: 300 }]
      });
      await sleep(20);
    }
    await send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: []
    });
    await sleep(500);

    const afterSwipe = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            scrollX: window.scrollX,
            docScrollLeft: document.documentElement.scrollLeft,
            bodyScrollLeft: document.body.scrollLeft,
            catMarqueeScrollLeft: document.getElementById('categoryMarqueeContainer') ? document.getElementById('categoryMarqueeContainer').scrollLeft : null
          };
        })()
      `,
      returnByValue: true
    });

    console.log('After Touch Swipe:', JSON.stringify(afterSwipe.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
