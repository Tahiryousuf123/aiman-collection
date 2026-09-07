const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // 1. Check Mobile Header (390px iPhone viewport)
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(__dirname, '../header_mobile_no_cart.png'),
      clip: { x: 0, y: 0, width: 390, height: 200 }
    });
    console.log('✓ Captured header_mobile_no_cart.png');

    // 2. Open Mobile Drawer and check Admin Portal button
    await page.click('.mobile-menu-btn');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(__dirname, '../drawer_mobile_admin.png'),
      clip: { x: 0, y: 0, width: 390, height: 844 }
    });
    console.log('✓ Captured drawer_mobile_admin.png');

    // Close drawer
    await page.evaluate(() => window.AimanStore.toggleMobileMenu());
    await new Promise(r => setTimeout(r, 500));

    // 3. Open Product Detail Page and verify NO Add to Cart
    await page.evaluate(() => window.AimanStore.openProductPage(1));
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(__dirname, '../pdp_mobile_no_cart.png'),
      clip: { x: 0, y: 0, width: 390, height: 900 }
    });
    console.log('✓ Captured pdp_mobile_no_cart.png');

    // 4. Check Desktop View (1200px)
    await page.setViewport({ width: 1200, height: 900 });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(__dirname, '../pdp_desktop_no_cart.png'),
      clip: { x: 0, y: 0, width: 1200, height: 800 }
    });
    console.log('✓ Captured pdp_desktop_no_cart.png');

    // Check text contents to confirm no "Add to Cart" or "Login"
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasAddToCart = /add to cart/i.test(bodyText);
    const hasAddBag = /add to bag/i.test(bodyText);
    console.log('Has "Add to Cart":', hasAddToCart);
    console.log('Has "Add to Bag":', hasAddBag);

  } catch (err) {
    console.error('Error during verification:', err.message);
  } finally {
    await browser.close();
  }
})();
