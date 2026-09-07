const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9230', '--disable-gpu', '--no-first-run', '--user-data-dir=.tmp-chrome-admin-2'
  ]);

  try {
    for (let i = 0; i < 20; i++) {
      await sleep(200);
      try {
        const v = await fetchJson('http://localhost:9230/json/version');
        if (v) break;
      } catch (e) {}
    }

    const list = await fetchJson('http://localhost:9230/json/list');
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((res, rej) => {
      const mid = id++;
      const h = e => {
        const m = JSON.parse(e.data);
        if (m.id === mid) { ws.removeEventListener('message', h); res(m.result); }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 500, height: 1000, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await sleep(1500);

    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('adminSuiteModal').style.display = 'flex';
        window.AimanStore.switchAdminTab('adminTabProducts');
        const sec = document.querySelector('.gallery-slot-box');
        if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await sleep(800);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('admin_products_tab_verified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved admin_products_tab_verified.png');
    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

main();
