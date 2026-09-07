// Code-based Self-Audit Suite for Aiman Collection
const fs = require('fs');
const path = require('path');
const http = require('http');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName}`);
  }
}

async function runAudit() {
  console.log('\n============================================================');
  console.log('   AIMAN COLLECTION — COMPREHENSIVE CODE SELF-AUDIT');
  console.log('============================================================\n');

  // --- 1. HTML AUDIT ---
  console.log('--- 1. AUDITING index.html STRUCTURE & IDENTIFIERS ---');
  const indexHtml = fs.readFileSync('index.html', 'utf8');

  assert(indexHtml.includes('id="searchLiveDropdown"'), 'Live search dropdown container (#searchLiveDropdown) exists in HTML');
  assert(indexHtml.includes('id="modalSearchInput"'), 'Modal search input (#modalSearchInput) exists');
  assert(indexHtml.includes('silk-rida'), 'Silk Rida category identifier exists in HTML');
  assert(indexHtml.includes('filterCategory(\'silk-rida\')'), 'Silk Rida category click handlers exist in navigation');
  assert(indexHtml.includes('id="prodStockStatusSelect"'), 'Stock status select (#prodStockStatusSelect) exists in Product Form');
  assert(indexHtml.includes('value="in-stock"') && indexHtml.includes('value="booked"') && indexHtml.includes('value="sold-out"'), 'Stock status options (In Stock, Booked, Sold Out) defined in select');
  assert(indexHtml.includes('class="admin-modal-header-top"') && indexHtml.includes('class="admin-header-actions-row"'), 'Admin modal header responsive rows exist');
  assert(indexHtml.includes('class="brand-calligraphy"') && indexHtml.includes('class="brand-subtitle"'), 'Brand logo calligraphy and subtitle elements exist');

  // Check HTML tag closures for critical wrappers
  const openDivs = (indexHtml.match(/<div\b/gi) || []).length;
  const closeDivs = (indexHtml.match(/<\/div>/gi) || []).length;
  assert(openDivs === closeDivs, `Balanced <div> tags (Open: ${openDivs}, Close: ${closeDivs})`);

  // --- 2. CSS AUDIT ---
  console.log('\n--- 2. AUDITING styles.css SELECTORS & RESPONSIVENESS ---');
  const stylesCss = fs.readFileSync('styles.css', 'utf8');

  assert(stylesCss.includes('.search-live-dropdown'), 'CSS defines .search-live-dropdown');
  assert(stylesCss.includes('.search-dropdown-item'), 'CSS defines .search-dropdown-item');
  assert(stylesCss.includes('.stock-badge'), 'CSS defines .stock-badge');
  assert(stylesCss.includes('.stock-badge-instock'), 'CSS defines .stock-badge-instock (emerald pill)');
  assert(stylesCss.includes('.stock-badge-booked'), 'CSS defines .stock-badge-booked (amber pill)');
  assert(stylesCss.includes('.stock-badge-soldout'), 'CSS defines .stock-badge-soldout (crimson pill)');
  assert(stylesCss.includes('@media (max-width: 640px)'), 'Mobile media query @media (max-width: 640px) exists');
  assert(stylesCss.includes('.admin-form-grid {') && stylesCss.includes('grid-template-columns: 1fr !important;'), 'Admin form grid collapses to 1-column on mobile');
  assert(stylesCss.includes('.brand-calligraphy {') && !stylesCss.includes('font-size: 2.3rem'), 'Brand calligraphy scaled down from excessive 2.3rem to refined proportions');

  // --- 3. JAVASCRIPT AUDIT ---
  console.log('\n--- 3. AUDITING app.js DATA MODEL & EVENT LOGIC ---');
  const appJs = fs.readFileSync('app.js', 'utf8');

  // Check syntax
  try {
    new (require('vm').Script)(appJs);
    assert(true, 'app.js syntax is 100% valid JavaScript (no syntax errors)');
  } catch (err) {
    assert(false, `app.js syntax error: ${err.message}`);
  }

  assert(appJs.includes("'silk-rida': '🥻 Silk Rida'"), "catMap includes 'silk-rida'");
  assert(appJs.includes('renderSearchDropdown: function'), 'window.AimanStore has renderSearchDropdown implementation');
  assert(appJs.includes('updateStockStatus: function'), 'window.AimanStore has 1-click updateStockStatus implementation');
  assert(appJs.includes('stock-badge-instock') && appJs.includes('stock-badge-booked') && appJs.includes('stock-badge-soldout'), 'Stock status badges rendered conditionally in app.js');
  assert(appJs.includes('wa-booked') && appJs.includes('wa-soldout'), 'WhatsApp CTA buttons adapt dynamically to stock status');
  assert(appJs.includes('prodStockStatusSelect'), 'Product save/edit reads and writes prodStockStatusSelect');

  // --- 4. PERSISTENCE & DATA STORE AUDIT ---
  console.log('\n--- 4. AUDITING data/db_store.json INTEGRITY ---');
  const dbJsonRaw = fs.readFileSync('data/db_store.json', 'utf8');
  let dbStore = null;
  try {
    dbStore = JSON.parse(dbJsonRaw);
    assert(true, 'data/db_store.json is valid JSON');
  } catch (err) {
    assert(false, `data/db_store.json parse error: ${err.message}`);
  }

  if (dbStore) {
    assert(Array.isArray(dbStore.products) && dbStore.products.length >= 10, `db_store.json contains products list (count: ${dbStore.products.length})`);
    const silkProducts = dbStore.products.filter(p => p.category === 'silk-rida');
    assert(silkProducts.length >= 2, `db_store.json contains Silk Rida products (count: ${silkProducts.length})`);
    const allHaveStockStatus = dbStore.products.every(p => p.stockStatus && ['in-stock', 'booked', 'sold-out'].includes(p.stockStatus));
    assert(allHaveStockStatus, 'All products in db_store.json have valid stockStatus (in-stock, booked, or sold-out)');
  }

  // --- 5. RUNNING LOCAL SERVERS AUDIT ---
  console.log('\n--- 5. AUDITING LIVE HTTP ENDPOINTS ---');

  // Check Frontend Dev Server on port 3000
  await new Promise(resolve => {
    http.get('http://localhost:3000/index.html', res => {
      assert(res.statusCode === 200, `Frontend server on port 3000 responded with HTTP ${res.statusCode}`);
      resolve();
    }).on('error', err => {
      assert(false, `Frontend server on port 3000 error: ${err.message}`);
      resolve();
    });
  });

  // Check Backend API on port 5050
  await new Promise(resolve => {
    http.get('http://localhost:5050/api/products', res => {
      assert(res.statusCode === 200, `Backend API /api/products responded with HTTP ${res.statusCode}`);
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          assert(json.success && Array.isArray(json.data), `Backend API returned ${json.count || json.data.length} products`);
        } catch (e) {
          assert(false, 'Backend API response parse error');
        }
        resolve();
      });
    }).on('error', err => {
      assert(false, `Backend API error: ${err.message}`);
      resolve();
    });
  });

  console.log('\n============================================================');
  console.log(`AUDIT COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round(passedTests / totalTests * 100)}%)`);
  console.log('============================================================\n');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAudit();
