import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectMongoDB, getMongoStatus } from './db/mongodb.js';
import {
  Product,
  Order,
  Sale,
  Expense,
  Review,
  Lead,
  BotRule,
  Setting,
  CustomStitching
} from './models/index.js';
import {
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_BOT_RULES,
  INITIAL_EXPENSES
} from '../../../packages/mock-data/mock-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

dotenv.config({ path: path.join(rootDir, '.env') });

// Local JSON persistent database (guarantees data survival across laptop reboots)
const localDataDir = path.join(rootDir, 'data');
const localDbFile = path.join(localDataDir, 'db_store.json');
if (!fs.existsSync(localDataDir)) {
  try { fs.mkdirSync(localDataDir, { recursive: true }); } catch (e) {}
}

export function readLocalDb() {
  try {
    if (fs.existsSync(localDbFile)) {
      return JSON.parse(fs.readFileSync(localDbFile, 'utf8'));
    }
  } catch (e) {
    console.warn('⚠️ Error reading local db:', e.message);
  }
  return { products: [], sales: [], settings: {} };
}

export function writeLocalDb(data) {
  try {
    fs.writeFileSync(localDbFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn('⚠️ Error writing local db:', e.message);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

/* --------------------------------------------------------------------------
   1. System Health & MongoDB Status
   -------------------------------------------------------------------------- */
app.get('/api/health', (req, res) => {
  const status = getMongoStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AIMAN COLLECTION Engine',
    database: 'MongoDB Atlas',
    mongo: status
  });
});

/* --------------------------------------------------------------------------
   2. Seed Engine (Populate MongoDB Atlas with Initial Catalog if empty)
   -------------------------------------------------------------------------- */
async function autoSeedDatabase() {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 [MongoDB] Seeding initial products into MongoDB Atlas...');
      await Product.insertMany(INITIAL_PRODUCTS);
      console.log(`✓ Seeded ${INITIAL_PRODUCTS.length} products`);
    }

    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log('🌱 [MongoDB] Seeding initial customer reviews...');
      await Review.insertMany(INITIAL_REVIEWS);
      console.log(`✓ Seeded ${INITIAL_REVIEWS.length} reviews`);
    }

    const botCount = await BotRule.countDocuments();
    if (botCount === 0) {
      console.log('🌱 [MongoDB] Seeding initial bot rules...');
      await BotRule.insertMany(INITIAL_BOT_RULES);
      console.log(`✓ Seeded ${INITIAL_BOT_RULES.length} bot rules`);
    }

    const salesCount = await Sale.countDocuments();
    if (salesCount === 0) {
      console.log('🌱 [MongoDB] Seeding initial sales ledger records...');
      await Sale.insertMany(INITIAL_SALES);
      console.log(`✓ Seeded ${INITIAL_SALES.length} sales`);
    }

    const expenseCount = await Expense.countDocuments();
    if (expenseCount === 0) {
      console.log('🌱 [MongoDB] Seeding initial expense ledger records...');
      await Expense.insertMany(INITIAL_EXPENSES);
      console.log(`✓ Seeded ${INITIAL_EXPENSES.length} expenses`);
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0 && INITIAL_ORDERS.length > 0) {
      console.log('🌱 [MongoDB] Seeding initial orders...');
      await Order.insertMany(INITIAL_ORDERS);
      console.log(`✓ Seeded ${INITIAL_ORDERS.length} orders`);
    }
  } catch (err) {
    console.error('⚠️ [MongoDB] Auto-seeding warning:', err.message);
  }
}

app.post('/api/seed', async (req, res) => {
  try {
    await autoSeedDatabase();
    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   3. Products CRUD (Dual-Layer: MongoDB Atlas + Disk db_store.json)
   -------------------------------------------------------------------------- */
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (status) query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { description: regex }, { fabric: regex }, { badge: regex }];
    }

    let products = [];
    try {
      products = await Product.find(query).sort({ createdAt: -1 });
    } catch (dbErr) {
      console.warn('MongoDB query warning, using local disk db:', dbErr.message);
    }

    if (!products || products.length === 0) {
      const localData = readLocalDb();
      products = localData.products || [];
      if (category && category !== 'all') {
        products = products.filter(p => p.category === category);
      }
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    const localData = readLocalDb();
    res.json({ success: true, count: (localData.products || []).length, data: localData.products || [] });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.id) payload.id = 'prod-' + Date.now();
    if (!payload.slug && payload.title) {
      payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (!payload.name && payload.title) payload.name = payload.title;

    // Save to MongoDB if available
    let productDoc = null;
    try {
      productDoc = await Product.findOneAndUpdate({ id: payload.id }, payload, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      });
    } catch (e) {
      console.warn('MongoDB save warning:', e.message);
    }

    // Always save to local disk database (db_store.json)
    const localData = readLocalDb();
    localData.products = localData.products || [];
    const idx = localData.products.findIndex(p => String(p.id) === String(payload.id));
    if (idx >= 0) {
      localData.products[idx] = { ...localData.products[idx], ...payload };
    } else {
      localData.products.unshift(payload);
    }
    writeLocalDb(localData);

    res.json({ success: true, data: productDoc || payload });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let updated = null;
    try {
      updated = await Product.findOneAndUpdate({ id }, req.body, { new: true });
    } catch (e) {}

    const localData = readLocalDb();
    localData.products = localData.products || [];
    const idx = localData.products.findIndex(p => String(p.id) === String(id));
    if (idx >= 0) {
      localData.products[idx] = { ...localData.products[idx], ...req.body };
      writeLocalDb(localData);
    }

    res.json({ success: true, data: updated || req.body });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Product.findOneAndDelete({ id });
    } catch (e) {}

    const localData = readLocalDb();
    localData.products = (localData.products || []).filter(p => String(p.id) !== String(id));
    writeLocalDb(localData);

    res.json({ success: true, message: `Product ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   Image Upload API (Base64 -> Local Disk File)
   -------------------------------------------------------------------------- */
app.post('/api/upload', (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    const uploadsDir = path.join(rootDir, 'images', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Parse base64
    let buffer;
    let ext = 'jpg';
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], 'base64');
      const mime = matches[1];
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('gif')) ext = 'gif';
    } else {
      buffer = Buffer.from(image, 'base64');
    }

    const cleanName = (filename || 'item')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 25);
    const saveName = `${Date.now()}_${cleanName}.${ext}`;
    const filePath = path.join(uploadsDir, saveName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `images/uploads/${saveName}`;

    res.json({
      success: true,
      url: publicUrl,
      message: 'Image successfully saved to atelier storage'
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   4. Orders CRUD
   -------------------------------------------------------------------------- */
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.id) payload.id = 'ord-' + Date.now();
    if (!payload.orderNumber) {
      const year = new Date().getFullYear();
      const rand = Math.floor(1000 + Math.random() * 9000);
      payload.orderNumber = `AC-${year}-${rand}`;
    }

    const newOrder = new Order(payload);
    await newOrder.save();

    // Automatically create a corresponding Sale entry in financial ledger
    try {
      const saleEntry = new Sale({
        id: 'sale-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        orderNumber: payload.orderNumber,
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        customerCity: payload.city || 'Karachi',
        productName: (payload.items && payload.items.length > 0) ? payload.items.map(i => `${i.productName} (x${i.quantity || 1})`).join(', ') : 'Custom Order',
        category: 'Ridas',
        quantity: (payload.items && payload.items.length > 0) ? payload.items.reduce((sum, i) => sum + (i.quantity || 1), 0) : 1,
        unitCost: Math.round(payload.total * 0.45),
        unitPrice: payload.total,
        discount: payload.discount || 0,
        totalRevenue: payload.total,
        totalCost: Math.round(payload.total * 0.45),
        netProfit: Math.round(payload.total * 0.55),
        profitMargin: 55,
        paymentMethod: payload.paymentMethod || 'CASH_ON_DELIVERY',
        status: payload.orderStatus || 'Pending',
        notes: `Auto-logged from order #${payload.orderNumber}`
      });
      await saleEntry.save();
    } catch (saleErr) {
      console.warn('[MongoDB] Sale auto-log warning:', saleErr.message);
    }

    res.json({ success: true, data: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Order.findOneAndUpdate({ id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filter = {
      $or: [
        { id: String(id) },
        { _id: mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null }
      ].filter(f => Object.values(f)[0] !== null)
    };
    await Order.findOneAndDelete(filter);
    res.json({ success: true, message: `Order ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   5. Sales Ledger CRUD (Dual-Layer: MongoDB Atlas + Disk db_store.json)
   -------------------------------------------------------------------------- */
app.get('/api/sales', async (req, res) => {
  try {
    let sales = [];
    try {
      sales = await Sale.find().sort({ createdAt: -1 });
    } catch (e) {
      console.warn('MongoDB query warning, using local disk db for sales:', e.message);
    }

    if (!sales || sales.length === 0) {
      const localData = readLocalDb();
      sales = localData.sales || [];
    }

    res.json({ success: true, count: sales.length, data: sales });
  } catch (err) {
    const localData = readLocalDb();
    res.json({ success: true, count: (localData.sales || []).length, data: localData.sales || [] });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.id) payload.id = 'sale-' + Date.now();
    const qty = Math.max(1, Number(payload.quantity) || 1);
    const sellPrice = Number(payload.sellingPrice ?? payload.unitPrice ?? payload.amount ?? payload.price) || 0;
    const costPrice = Number(payload.costPrice ?? payload.unitCost) || 0;
    payload.sellingPrice = sellPrice;
    payload.unitPrice = sellPrice;
    payload.costPrice = costPrice;
    payload.unitCost = costPrice;
    payload.quantity = qty;
    payload.totalRevenue = Number(payload.totalRevenue ?? payload.amount) || (sellPrice * qty);
    payload.totalCost = Number(payload.totalCost) || (costPrice * qty);
    payload.netProfit = Number(payload.netProfit ?? payload.profit) || (payload.totalRevenue - payload.totalCost);
    payload.profit = payload.netProfit;
    if (payload.totalRevenue > 0) {
      payload.profitMargin = Number(((payload.netProfit / payload.totalRevenue) * 100).toFixed(1));
    }

    let saleDoc = null;
    try {
      saleDoc = await Sale.findOneAndUpdate({ id: payload.id }, payload, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      });
    } catch (e) {
      console.warn('MongoDB save warning for sale:', e.message);
    }

    // Always persist to local disk db_store.json
    const localData = readLocalDb();
    localData.sales = localData.sales || [];
    const idx = localData.sales.findIndex(s => String(s.id) === String(payload.id));
    if (idx >= 0) {
      localData.sales[idx] = { ...localData.sales[idx], ...payload };
    } else {
      localData.sales.unshift(payload);
    }
    writeLocalDb(localData);

    res.json({ success: true, data: saleDoc || payload });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/sales/:id', async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const filter = {
        $or: [
          { id: String(id) },
          { _id: mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null }
        ].filter(f => Object.values(f)[0] !== null)
      };
      await Sale.findOneAndDelete(filter);
    } catch (e) {}

    const localData = readLocalDb();
    localData.sales = (localData.sales || []).filter(s => String(s.id) !== String(id));
    writeLocalDb(localData);

    res.json({ success: true, message: `Sale ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   6. Expenses CRUD
   -------------------------------------------------------------------------- */
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.id) payload.id = 'exp-' + Date.now();
    const expense = await Expense.findOneAndUpdate({ id: payload.id }, payload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filter = {
      $or: [
        { id: String(id) },
        { _id: mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null }
      ].filter(f => Object.values(f)[0] !== null)
    };
    await Expense.findOneAndDelete(filter);
    res.json({ success: true, message: `Expense ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   7. Reviews CRUD
   -------------------------------------------------------------------------- */
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.id) payload.id = 'rev-' + Date.now();
    const review = await Review.findOneAndUpdate({ id: payload.id }, payload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reviews/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Review.findOneAndUpdate(
      { id },
      { $inc: { likesCount: 1 } },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findOneAndDelete({ id });
    res.json({ success: true, message: `Review ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   8. Leads & Inquiries
   -------------------------------------------------------------------------- */
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.id) payload.id = 'lead-' + Date.now();
    const lead = await Lead.findOneAndUpdate({ id: payload.id }, payload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   9. Bot Rules CRUD
   -------------------------------------------------------------------------- */
app.get('/api/bot-rules', async (req, res) => {
  try {
    const rules = await BotRule.find().sort({ priority: -1 });
    res.json({ success: true, count: rules.length, data: rules });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/bot-rules', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.id) payload.id = 'rule-' + Date.now();
    const rule = await BotRule.findOneAndUpdate({ id: payload.id }, payload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
    res.json({ success: true, data: rule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/bot-rules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await BotRule.findOneAndDelete({ id });
    res.json({ success: true, message: `Rule ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   10. Settings & Frontend Customization (Dual-Layer: MongoDB Atlas + Disk db_store.json)
   -------------------------------------------------------------------------- */
app.get('/api/settings', async (req, res) => {
  try {
    let map = {};
    try {
      const settings = await Setting.find();
      settings.forEach(s => { map[s.key] = s.value; });
    } catch (e) {}

    const localData = readLocalDb();
    map = { ...(localData.settings || {}), ...map };

    res.json({ success: true, data: map });
  } catch (err) {
    const localData = readLocalDb();
    res.json({ success: true, data: localData.settings || {} });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ success: false, error: 'Setting key is required' });

    let setting = null;
    try {
      setting = await Setting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
    } catch (e) {}

    // Persist to local disk db_store.json
    const localData = readLocalDb();
    localData.settings = localData.settings || {};
    localData.settings[key] = value;
    writeLocalDb(localData);

    res.json({ success: true, data: setting || { key, value } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   11. Custom Stitching Inquiries
   -------------------------------------------------------------------------- */
app.post('/api/custom-stitching', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.id) payload.id = 'stitch-' + Date.now();
    const inquiry = new CustomStitching(payload);
    await inquiry.save();
    res.json({ success: true, data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/custom-stitching', async (req, res) => {
  try {
    const items = await CustomStitching.find().sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* --------------------------------------------------------------------------
   12. Serve Static Frontend Files
   -------------------------------------------------------------------------- */
app.use(express.static(rootDir));

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'Endpoint not found' });
  }
  res.sendFile(path.join(rootDir, 'index.html'));
});

/* --------------------------------------------------------------------------
   13. Start Server & Connect Database
   -------------------------------------------------------------------------- */
async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`\n========================================================`);
    console.log(`🚀 AIMAN COLLECTION — Server Running on Port ${PORT}`);
    console.log(`🌐 Storefront: http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`========================================================\n`);
  });

  // Connect MongoDB Atlas in background
  connectMongoDB()
    .then(async () => {
      console.log(`🟢 [Database] MongoDB Atlas Connected successfully!`);
      await autoSeedDatabase();
    })
    .catch((err) => {
      console.warn('⚠️ [Database] MongoDB connection error:', err.message);
      console.log(`ℹ️ [Database] App running with Local Storage and Firebase fallback.`);
    });
if (!process.env.VERCEL) {
  startServer();
} else {
  connectMongoDB().catch(err => console.warn('⚠️ [Serverless] Mongo error:', err.message));
}

export default app;
