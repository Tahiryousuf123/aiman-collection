const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

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
    '--user-data-dir=' + path.join(__dirname, '../.tmp-chrome-profile-verify')
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
    await send('Runtime.enable');

    // 1. Mobile View (390px)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:3000' });
    await sleep(2000);

    let shot = await send('Page.captureScreenshot', { format: 'png' });
    let shotPath = path.join(__dirname, '../header_mobile_verified.png');
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: ${shotPath}`);

    // Open PDP for product 1
    await send('Runtime.evaluate', {
      expression: 'window.AimanStore.openProductPage(1)'
    });
    await sleep(1500);

    shot = await send('Page.captureScreenshot', { format: 'png' });
    shotPath = path.join(__dirname, '../pdp_mobile_verified.png');
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: ${shotPath}`);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
