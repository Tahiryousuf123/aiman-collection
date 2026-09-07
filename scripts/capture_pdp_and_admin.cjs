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
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(__dirname, '../.tmp-chrome-profile-pdp')
  ]);

  try {
    let versionInfo = null;
    for (let i = 0; i < 20; i++) {
      await sleep(200);
      try {
        versionInfo = await fetchJson('http://localhost:9228/json/version');
        if (versionInfo) break;
      } catch (e) {}
    }

    const targets = await fetchJson('http://localhost:9228/json/list');
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

    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    // Directly open PDP via hash route #product-1
    await send('Page.navigate', { url: 'http://localhost:3000/#product-1' });
    await sleep(2000);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(__dirname, '../pdp_hash_view.png');
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: ${shotPath}`);

    // Also open admin modal and capture products tab
    await send('Runtime.evaluate', {
      expression: 'window.AimanStore.openAdminSuite(); window.AimanStore.authenticateAdmin("40461"); window.AimanStore.switchAdminTab("adminTabProducts");'
    });
    await sleep(1500);

    const adminShot = await send('Page.captureScreenshot', { format: 'png' });
    const adminPath = path.join(__dirname, '../admin_gallery_slots.png');
    fs.writeFileSync(adminPath, Buffer.from(adminShot.data, 'base64'));
    console.log(`Saved admin screenshot: ${adminPath}`);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
