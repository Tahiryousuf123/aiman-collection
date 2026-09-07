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
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(__dirname, '../.tmp-chrome-profile-verify')
  ]);

  try {
    let versionInfo = null;
    for (let i = 0; i < 25; i++) {
      await sleep(200);
      try {
        versionInfo = await fetchJson('http://localhost:9230/json/version');
        if (versionInfo) break;
      } catch (e) {}
    }

    if (!versionInfo) throw new Error('Chrome did not start');

    const targets = await fetchJson('http://localhost:9230/json/list');
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
      width: 500,
      height: 900,
      deviceScaleFactor: 2,
      mobile: true
    });

    console.log('Navigating to http://localhost:3000...');
    await send('Page.navigate', { url: 'http://localhost:3000' });
    await sleep(1500);

    // Test 1: Check hero slider renders
    const heroSliderCheck = await send('Runtime.evaluate', {
      expression: `(function() {
        const slider = document.getElementById('mainHeroSlider');
        const track = document.getElementById('heroSliderTrack');
        const slides = track ? track.querySelectorAll('.hero-slide-item') : [];
        const dots = document.querySelectorAll('#heroSliderDots .hero-dot');
        return {
          sliderExists: !!slider,
          slidesCount: slides.length,
          dotsCount: dots.length,
          sliderWidth: slider ? slider.offsetWidth : 0,
          sliderHeight: slider ? slider.offsetHeight : 0
        };
      })()`,
      returnByValue: true
    });
    console.log('Hero Slider Check:', heroSliderCheck.result.value);

    // Test 2: Unlock and open Admin Suite
    const adminOpenCheck = await send('Runtime.evaluate', {
      expression: `(function() {
        sessionStorage.setItem('aiman_admin_auth', '40461');
        window.AimanStore.openAdminSuite();
        window.AimanStore.switchAdminTab('hero');
        const modal = document.getElementById('adminSuiteModal');
        const heroTab = document.getElementById('adminTabHero');
        const list = document.getElementById('adminHeroBannersList');
        const cards = list ? list.querySelectorAll('.admin-slide-card') : [];
        return {
          modalDisplay: modal ? modal.style.display : null,
          heroTabDisplay: heroTab ? heroTab.style.display : null,
          bannerCardsCount: cards.length
        };
      })()`,
      returnByValue: true
    });
    console.log('Admin Hero Tab Check:', adminOpenCheck.result.value);

    // Test 3: Add new hero banner
    const addBannerCheck = await send('Runtime.evaluate', {
      expression: `(function() {
        // Mock alert to not block
        window.alert = function(msg) {};
        window.AimanStore.addNewHeroBanner();
        const list = document.getElementById('adminHeroBannersList');
        const cards = list ? list.querySelectorAll('.admin-slide-card') : [];
        const track = document.getElementById('heroSliderTrack');
        const slides = track ? track.querySelectorAll('.hero-slide-item') : [];
        return {
          cardsCountAfterAdd: cards.length,
          slidesCountAfterAdd: slides.length
        };
      })()`,
      returnByValue: true
    });
    console.log('Add Banner Check:', addBannerCheck.result.value);

    // Test 4: Delete the added banner (index 3)
    const deleteBannerCheck = await send('Runtime.evaluate', {
      expression: `(function() {
        window.confirm = function() { return true; };
        window.AimanStore.deleteHeroBanner(3);
        const list = document.getElementById('adminHeroBannersList');
        const cards = list ? list.querySelectorAll('.admin-slide-card') : [];
        const track = document.getElementById('heroSliderTrack');
        const slides = track ? track.querySelectorAll('.hero-slide-item') : [];
        return {
          cardsCountAfterDelete: cards.length,
          slidesCountAfterDelete: slides.length
        };
      })()`,
      returnByValue: true
    });
    console.log('Delete Banner Check:', deleteBannerCheck.result.value);

    // Scroll admin modal content down to show slide 1 controls clearly
    await send('Runtime.evaluate', {
      expression: `
        const modal = document.querySelector('.admin-modal-card');
        const card = document.getElementById('adminSlideCard_0');
        if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await sleep(400);

    // Capture screenshot of Admin Hero section to verify mobile responsiveness
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const ssPath = path.join(__dirname, '../screenshot_admin_hero_mobile.png');
    fs.writeFileSync(ssPath, Buffer.from(ss.data, 'base64'));
    console.log('✓ Captured screenshot to screenshot_admin_hero_mobile.png');

    // Close admin modal and screenshot main hero on mobile
    await send('Runtime.evaluate', {
      expression: `window.AimanStore.closeAdminSuite(); window.scrollTo(0, 0);`
    });
    await sleep(500);

    const ssHero = await send('Page.captureScreenshot', { format: 'png' });
    const ssHeroPath = path.join(__dirname, '../screenshot_hero_responsive_mobile.png');
    fs.writeFileSync(ssHeroPath, Buffer.from(ssHero.data, 'base64'));
    console.log('✓ Captured screenshot to screenshot_hero_responsive_mobile.png');

    ws.close();
  } catch (err) {
    console.error('Error in verification:', err);
  } finally {
    try { chromeProc.kill(); } catch (e) {}
  }
}

main();
