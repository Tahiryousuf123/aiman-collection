import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbStorePath = path.join(__dirname, '../data/db_store.json');
const appJsPath = path.join(__dirname, '../app.js');

const dbStore = JSON.parse(fs.readFileSync(dbStorePath, 'utf8'));
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Update CACHE_KEY_VERSION
appJs = appJs.replace(
  /const CACHE_KEY_VERSION = 'aiman_v11_clean_mongo';/,
  "const CACHE_KEY_VERSION = 'aiman_v12_all_43_firebase_migrated';"
);

// Map products from dbStore
const catalog = dbStore.products.map(p => ({
  id: p.id,
  title: p.title || p.name || 'Bohra Libas Ensemble',
  name: p.title || p.name || 'Bohra Libas Ensemble',
  category: p.category || 'heavy-rida',
  price: Number(p.price) || 0,
  costPrice: Number(p.costPrice) || 0,
  regularPrice: Number(p.regularPrice || p.originalPrice) || 0,
  discount: Number(p.discount) || 0,
  image: p.image || '',
  imageStyle: p.imageStyle || '',
  stockStatus: p.stockStatus || 'in-stock',
  isNew: Boolean(p.isNew),
  isSale: Boolean(p.isSale),
  bestSeller: Boolean(p.bestSeller)
}));

const formattedCatalog = '  const DEFAULT_PRODUCTS = ' + JSON.stringify(catalog, null, 2) + ';';

const startMarker = '  // Bundled Default Catalog for Instant 0ms Paint\n  const DEFAULT_PRODUCTS = [';
const endMarker = '  ];\n\n  const knownImageMap = {';

const startIndex = appJs.indexOf(startMarker);
const endIndex = appJs.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  appJs = appJs.substring(0, startIndex) +
    '  // Bundled Default Catalog for Instant 0ms Paint (All 43 Migrated Firebase Products)\n' +
    formattedCatalog + '\n\n' +
    appJs.substring(endIndex + 5);
  fs.writeFileSync(appJsPath, appJs, 'utf8');
  console.log('✅ app.js DEFAULT_PRODUCTS updated with all', catalog.length, 'products!');
} else {
  console.error('❌ Marker not found:', { startIndex, endIndex });
}
