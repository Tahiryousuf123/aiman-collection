import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dbFile = path.join(rootDir, 'data', 'db_store.json');
const indexHtmlFile = path.join(rootDir, 'index.html');

const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
let indexHtml = fs.readFileSync(indexHtmlFile, 'utf8');

const defaultPhone = '923452439196';
const FALLBACK_PRODUCT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%2320080d'/%3E%3Ctext x='50%25' y='46%25' dominant-baseline='middle' text-anchor='middle' fill='%23d4af37' font-family='sans-serif' font-size='22' font-weight='700'%3EAiman Collection%3C/text%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%23cbd5e1' font-family='sans-serif' font-size='13' letter-spacing='0.1em'%3ELUXURY BOHRA ATELIER%3C/text%3E%3C/svg%3E";

const cardsHtml = db.products.map((p, idx) => {
  const title = p.title || p.name || 'Bohra Libas Ensemble';
  const status = p.stockStatus || 'in-stock';
  let badgeHtml = '';
  let waClass = '';
  let btnText = 'Order on WhatsApp';
  let waMsg = `✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI want to order:\n👑 *Product:* ${title}\n💰 *Price:* Rs. ${p.price.toLocaleString()}\n\nPlease confirm availability, size naap, and delivery timeline.`;

  if (status === 'sold-out') {
    badgeHtml = `<span class="stock-badge stock-badge-soldout"><i class="fas fa-circle-xmark"></i> Sold Out</span>`;
    waClass = 'wa-soldout';
    btnText = 'Sold Out • Inquire Restock';
  } else if (status === 'booked') {
    badgeHtml = `<span class="stock-badge stock-badge-booked"><i class="fas fa-clock"></i> Booked</span>`;
    waClass = 'wa-booked';
    btnText = 'Booked • Custom Naap Order';
  } else {
    badgeHtml = `<span class="stock-badge stock-badge-instock"><i class="fas fa-circle-check"></i> In Stock</span>`;
    waClass = '';
    btnText = 'Order on WhatsApp';
  }

  const waLink = `https://wa.me/${defaultPhone}?text=${encodeURIComponent(waMsg)}`;
  const priorityAttr = idx < 4 ? 'fetchpriority="high"' : 'loading="lazy"';
  const imgSrc = p.image || FALLBACK_PRODUCT_IMAGE;

  return `        <li class="product-card">
          <div class="product-img-box">
            ${p.discount > 0 ? `<span class="kashaf-sale-badge">-${p.discount}%</span>` : ''}
            <div class="product-stock-badge">${badgeHtml}</div>
            <a href="javascript:void(0)" onclick="window.AimanStore.openProductPage('${p.id}')">
              <img src="${imgSrc}" onerror="this.onerror=null; this.src=FALLBACK_PRODUCT_IMAGE;" alt="${title}" ${priorityAttr} decoding="async">
            </a>
            <button type="button" class="product-quick-view-btn" onclick="window.AimanStore.openProductPage('${p.id}')">
              <i class="fas fa-eye"></i> View Details
            </button>
          </div>
          <div class="product-details">
            <h3 class="product-title">
              <a href="javascript:void(0)" onclick="window.AimanStore.openProductPage('${p.id}')">
                ${title}
              </a>
            </h3>
            <div class="product-price-row">
              <span class="price-current">Rs. ${p.price.toLocaleString()}</span>
              ${p.regularPrice ? `<span class="price-regular-strike">Rs. ${p.regularPrice.toLocaleString()}</span>` : ''}
            </div>
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="product-wa-order-link ${waClass}" title="${btnText}">
              <i class="fab fa-whatsapp"></i> ${btnText}
            </a>
          </div>
        </li>`;
}).join('\n');

const gridRegex = /<ul class="products-grid" id="productGridContainer">[\s\S]*?<\/ul>/;
const newGridHtml = `<ul class="products-grid" id="productGridContainer">\n${cardsHtml}\n      </ul>`;

indexHtml = indexHtml.replace(gridRegex, newGridHtml);

fs.writeFileSync(indexHtmlFile, indexHtml, 'utf8');
console.log('✅ Successfully pre-rendered product catalog directly into index.html!');
