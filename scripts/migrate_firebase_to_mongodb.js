import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Product, Sale } from '../apps/api/src/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const uploadsDir = path.join(rootDir, 'images', 'uploads');
const dbStorePath = path.join(rootDir, 'data', 'db_store.json');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

dotenv.config({ path: path.join(rootDir, '.env') });

function parseFirestoreValue(val) {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map(parseFirestoreValue);
  }
  if ('mapValue' in val) {
    const res = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      res[k] = parseFirestoreValue(v);
    }
    return res;
  }
  return null;
}

function parseFirestoreDoc(doc) {
  const id = doc.name.split('/').pop();
  const fields = {};
  for (const [k, v] of Object.entries(doc.fields || {})) {
    fields[k] = parseFirestoreValue(v);
  }
  fields.id = fields.id || id;
  return fields;
}

async function fetchAllFirestore(collection) {
  const items = [];
  let url = `https://firestore.googleapis.com/v1/projects/aiman-collecion/databases/(default)/documents/${collection}?pageSize=100`;

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed to fetch ${collection} from Firestore: HTTP ${res.status}`);
      break;
    }
    const data = await res.json();
    if (data.documents) {
      for (const d of data.documents) {
        items.push(parseFirestoreDoc(d));
      }
    }
    if (data.nextPageToken) {
      url = `https://firestore.googleapis.com/v1/projects/aiman-collecion/databases/(default)/documents/${collection}?pageSize=100&pageToken=${data.nextPageToken}`;
    } else {
      url = null;
    }
  }
  return items;
}

function normalizeCategory(cat) {
  if (!cat) return 'heavy-rida';
  const c = String(cat).toLowerCase().trim();
  if (c === 'ridas' || c === 'rida' || c === 'bridal' || c.includes('heavy') || c.includes('bridal')) return 'heavy-rida';
  if (c.includes('silk')) return 'silk-rida';
  if (c.includes('arrival') || c.includes('new')) return 'new-arrivals';
  if (c.includes('pret') || c.includes('cotton') || c === 'dresses') return 'cotton-pret';
  if (c.includes('boski') || c.includes('fabric')) return 'boski-fabric';
  if (c.includes('bag') || c.includes('batwa')) return 'bags-batwas';
  if (c.includes('pouch') || c.includes('vanity') || c.includes('topi')) return 'pouches';
  return 'heavy-rida';
}

async function run() {
  console.log('🚀 Starting Full Firebase to MongoDB Atlas Migration...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB Atlas Cloud');

  // 1. Fetch all products from Firebase
  console.log('Fetching products from Firebase Firestore...');
  const fbProducts = await fetchAllFirestore('products');
  console.log(`✓ Fetched ${fbProducts.length} products from Firebase Firestore!`);

  const processedProducts = [];

  for (const p of fbProducts) {
    const id = String(p.id);
    const title = p.title || p.name || 'Bohra Libas Ensemble';
    let imagePath = '';

    if (p.image && typeof p.image === 'string') {
      if (p.image.startsWith('data:image')) {
        // Extract base64 to a clean file
        const matches = p.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1].includes('png') ? 'png' : 'jpg';
          const filename = `${id}.${ext}`;
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
          imagePath = `images/uploads/${filename}`;
        }
      } else if (p.image.startsWith('images/uploads/')) {
        imagePath = p.image;
      } else {
        imagePath = p.image;
      }
    }

    const price = Number(p.price) || 0;
    const costPrice = Number(p.costPrice) || 0;
    const regPrice = Number(p.regularPrice || p.originalPrice) || (price * 1.5);
    const discount = Number(p.discount) || (regPrice > price ? Math.round(((regPrice - price) / regPrice) * 100) : 0);

    const productDoc = {
      id: id,
      title: title,
      name: title,
      slug: (p.slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: normalizeCategory(p.category),
      price: price,
      costPrice: costPrice,
      regularPrice: regPrice,
      discount: discount,
      image: imagePath,
      imageStyle: p.imageStyle || '',
      gallery: Array.isArray(p.gallery) ? p.gallery : (Array.isArray(p.galleryImages) ? p.galleryImages : []),
      stockStatus: p.stockStatus || (p.isSoldOut ? 'sold-out' : (p.isBooked ? 'booked' : 'in-stock')),
      isNew: Boolean(p.isNew ?? p.isNewArrival),
      isSale: Boolean(p.isSale ?? p.onSale),
      bestSeller: Boolean(p.bestSeller ?? p.isFeatured)
    };

    processedProducts.push(productDoc);

    // Upsert into MongoDB Atlas
    await Product.findOneAndUpdate({ id: id }, productDoc, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
  }

  console.log(`✅ Upserted ${processedProducts.length} products into MongoDB Atlas!`);

  // 2. Fetch all sales from Firebase
  console.log('\nFetching sales ledger records from Firebase Firestore...');
  const fbSales = await fetchAllFirestore('sales');
  console.log(`✓ Fetched ${fbSales.length} sales from Firebase Firestore!`);

  const processedSales = [];

  for (const s of fbSales) {
    const id = String(s.id);
    const qty = Math.max(1, Number(s.quantity) || 1);
    const sellPrice = Number(s.sellingPrice ?? s.unitPrice ?? s.amount ?? s.price) || 0;
    const costPrice = Number(s.costPrice ?? s.unitCost) || 0;
    const totalRev = Number(s.totalRevenue ?? s.amount) || (sellPrice * qty);
    const totalCost = Number(s.totalCost) || (costPrice * qty);
    const profit = s.netProfit !== undefined ? Number(s.netProfit) : (s.profit !== undefined ? Number(s.profit) : (totalRev - totalCost));

    const saleDoc = {
      id: id,
      date: s.date || new Date().toISOString().split('T')[0],
      orderNumber: s.orderNumber || id,
      productName: s.productName || 'Bohra Libas',
      customerName: s.customerName || 'Customer',
      customerPhone: s.customerPhone || s.phone || '',
      phone: s.customerPhone || s.phone || '',
      customerCity: s.customerCity || s.city || 'Karachi',
      category: s.category || 'Ridas',
      quantity: qty,
      unitPrice: sellPrice,
      sellingPrice: sellPrice,
      amount: totalRev,
      totalRevenue: totalRev,
      unitCost: costPrice,
      costPrice: totalCost,
      totalCost: totalCost,
      netProfit: profit,
      profit: profit,
      profitMargin: totalRev > 0 ? Number(((profit / totalRev) * 100).toFixed(1)) : 0,
      paymentMethod: s.paymentMethod || 'Cash on Delivery (COD)',
      status: s.status || 'Delivered',
      notes: s.notes || ''
    };

    processedSales.push(saleDoc);

    await Sale.findOneAndUpdate({ id: id }, saleDoc, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
  }

  console.log(`✅ Upserted ${processedSales.length} sales records into MongoDB Atlas!`);

  // 3. Save both to local data/db_store.json
  const dbData = {
    products: processedProducts,
    sales: processedSales,
    settings: {}
  };
  fs.writeFileSync(dbStorePath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log('✓ Saved complete catalog & sales to data/db_store.json');

  await mongoose.disconnect();
  console.log('\n🎉 ALL FIREBASE DATA SUCCESSFULLY MIGRATED TO MONGODB ATLAS!');
}

run().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
