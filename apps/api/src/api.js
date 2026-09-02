/**
 * AIMAN COLLECTION — Backend API Service & Reactive State Engine
 * Integrated with Netlify Live Database, Firebase Cloud Sync, Accounting & Payments
 */

import {
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_BOT_RULES,
  INITIAL_EXPENSES,
  BANK_DETAILS,
  CONTACT_CONFIG,
  FIREBASE_CONFIG
} from '../../../packages/mock-data/mock-data.js';

const STORAGE_KEYS = {
  PRODUCTS: 'aiman_products',
  SALES: 'aiman_sales',
  REVIEWS: 'aiman_reviews_db_v2',
  ORDERS: 'aiman_orders_db_v2',
  LEADS: 'aiman_leads_db_v2',
  BOT_RULES: 'aiman_bot_rules_db_v2',
  EMAILS: 'aiman_dispatched_emails_v2',
  TRANSACTIONS: 'aiman_transactions_db_v2',
  EXPENSES: 'aiman_expenses_db_v2',
  HERO_IMAGE: 'aiman_hero_image'
};

class AimanApiEngine {
  constructor() {
    this.listeners = [];
    this.isFirebaseActive = false;
    this.db = null;
    this.initDatabase();
    this.initFirebase();
  }

  /* --------------------------------------------------------------------------
     1. Database Initialization & Local Persistence
     -------------------------------------------------------------------------- */
  initDatabase() {
    const DATA_VERSION_KEY = 'aiman_data_version_v20_zero_financial_mock';
    const currentVersion = typeof localStorage !== 'undefined' ? localStorage.getItem(DATA_VERSION_KEY) : null;
    if (!currentVersion || currentVersion !== '20.0') {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
        localStorage.setItem(DATA_VERSION_KEY, '20.0');
      }
      this.products = [...INITIAL_PRODUCTS];
      this.sales = [...INITIAL_SALES];
      this.reviews = [...INITIAL_REVIEWS];
      this.orders = [...INITIAL_ORDERS];
      this.botRules = [...INITIAL_BOT_RULES];
      this.expenses = [...INITIAL_EXPENSES];
      this.leads = [];
      this.emails = [];
      this.transactions = [];

      this.save(STORAGE_KEYS.PRODUCTS, this.products);
      this.save(STORAGE_KEYS.SALES, this.sales);
      this.save(STORAGE_KEYS.REVIEWS, this.reviews);
      this.save(STORAGE_KEYS.ORDERS, this.orders);
      this.save(STORAGE_KEYS.BOT_RULES, this.botRules);
      this.save(STORAGE_KEYS.EXPENSES, this.expenses);
      return;
    }

    this.products = this.load(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    this.sales = this.load(STORAGE_KEYS.SALES, INITIAL_SALES);
    this.reviews = this.load(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    this.orders = this.load(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    this.leads = this.load(STORAGE_KEYS.LEADS, []);
    this.botRules = this.load(STORAGE_KEYS.BOT_RULES, INITIAL_BOT_RULES);
    this.emails = this.load(STORAGE_KEYS.EMAILS, []);
    this.transactions = this.load(STORAGE_KEYS.TRANSACTIONS, []);
    this.expenses = this.load(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  }

  load(key, fallback) {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return fallback;
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data);
    } catch (e) {
      console.warn(`[AimanApi] Storage load failed for ${key}:`, e);
      return fallback;
    }
  }

  resetDatabase() {
    this.products = [];
    this.sales = [];
    this.reviews = [];
    this.orders = [];
    this.botRules = [...INITIAL_BOT_RULES];
    this.expenses = [];
    this.leads = [];
    this.emails = [];
    this.transactions = [];

    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.save(STORAGE_KEYS.SALES, this.sales);
    this.save(STORAGE_KEYS.REVIEWS, this.reviews);
    this.save(STORAGE_KEYS.ORDERS, this.orders);
    this.save(STORAGE_KEYS.BOT_RULES, this.botRules);
    this.save(STORAGE_KEYS.EXPENSES, this.expenses);

    if (this.isFirebaseActive && this.db) {
      try {
        this.db.collection('products').get().then(snap => {
          const b = this.db.batch();
          snap.forEach(d => b.delete(d.ref));
          b.commit().catch(console.error);
        });
        this.db.collection('sales').get().then(snap => {
          const b = this.db.batch();
          snap.forEach(d => b.delete(d.ref));
          b.commit().catch(console.error);
        });
      } catch (err) {
        console.warn('Firebase batch reset fallback:', err);
      }
    }

    this.notify('DATA_RESET', null);
  }

  save(key, data) {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`[AimanApi] Storage save failed for ${key}:`, e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event, payload) {
    this.listeners.forEach(fn => fn({ event, payload, state: this.getState() }));
  }

  getState() {
    return {
      products: this.products,
      sales: this.sales,
      reviews: this.reviews,
      orders: this.orders,
      leads: this.leads,
      botRules: this.botRules,
      emails: this.emails,
      transactions: this.transactions,
      expenses: this.expenses,
      bankDetails: BANK_DETAILS,
      contact: CONTACT_CONFIG,
      firebaseActive: this.isFirebaseActive
    };
  }

  /* --------------------------------------------------------------------------
     2. Firebase Firestore Real-Time Cloud Synchronization
     -------------------------------------------------------------------------- */
  initFirebase() {
    if (typeof window === 'undefined' || !window.firebase) return;

    try {
      const app = window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(FIREBASE_CONFIG);
      this.db = window.firebase.firestore(app);
      this.db.enablePersistence().catch(() => {});
      this.isFirebaseActive = true;

      // Unconditionally purge any leftover mock products and mock sales from Firestore
      this.db.collection('products').get().then(snap => {
        const mockDocs = snap.docs.filter(d => d.id.startsWith('prod-') || d.data().slug === 'tea-time-safra' || d.data().name === 'Tea time safra');
        if (mockDocs.length > 0) {
          console.log('[AimanApi] Purging old mock products from Firestore cloud...');
          const b = this.db.batch();
          mockDocs.forEach(d => b.delete(d.ref));
          b.commit().catch(console.error);
        }
      }).catch(console.error);

      this.db.collection('sales').get().then(snap => {
        const mockSales = snap.docs.filter(d => d.id.startsWith('sale-') && parseInt(d.id.replace('sale-', '')) <= 25);
        if (mockSales.length > 0) {
          console.log('[AimanApi] Purging old mock sales from Firestore cloud...');
          const b = this.db.batch();
          mockSales.forEach(d => b.delete(d.ref));
          b.commit().catch(console.error);
        }
      }).catch(console.error);

      // Subscribe to real-time products collection (ignoring any legacy mock docs)
      this.db.collection('products').onSnapshot(snapshot => {
        const cloudProducts = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (!doc.id.startsWith('prod-') && data.name !== 'Tea time safra' && data.name !== 'Cusmetic organizer') {
            cloudProducts.push({ ...data, id: doc.id });
          }
        });
        this.products = cloudProducts;
        this.save(STORAGE_KEYS.PRODUCTS, this.products);
        this.notify('PRODUCTS_SYNCED', this.products);
      }, err => {
        console.warn('Firestore Products Sync fallback:', err);
      });

      // Subscribe to real-time sales collection
      this.db.collection('sales').onSnapshot(snapshot => {
        const cloudSales = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (doc.id.length > 10 || isNaN(parseInt(doc.id.replace('sale-', '')))) {
            cloudSales.push({ ...data, id: doc.id });
          }
        });
        this.sales = cloudSales.sort((a, b) => new Date(a.date) - new Date(b.date));
        this.save(STORAGE_KEYS.SALES, this.sales);
        this.notify('SALES_SYNCED', this.sales);
      }, err => {
        console.warn('Firestore Sales Sync fallback:', err);
      });

    } catch (err) {
      console.warn('Firebase init fallback to local storage:', err);
      this.isFirebaseActive = false;
    }
  }

  /* --------------------------------------------------------------------------
     3. Products Management API
     -------------------------------------------------------------------------- */
  normalizeCategory(cat) {
    if (!cat) return 'all';
    const c = cat.toLowerCase().trim();
    if (c === 'rida' || c === 'ridas' || c === 'all bohra libas') return 'ridas';
    if (c === 'bag' || c === 'bags' || c === 'handbag' || c === 'handbags') return 'handbags';
    if (c === 'cosmetic' || c === 'cosmetics' || c === 'accessories' || c === 'accessory') return 'accessories';
    if (c === 'pret') return 'pret';
    if (c === 'bridal') return 'bridal';
    return c;
  }

  getProducts(filter = {}) {
    let list = [...this.products];
    if (filter.category && filter.category !== 'all') {
      const target = filter.category.toLowerCase().trim();
      list = list.filter(p => {
        const pCat = (p.category || '').toLowerCase().trim();
        const pSub = (p.subCategory || '').toLowerCase().trim();
        const pName = (p.name || '').toLowerCase();
        const pFab = (p.fabric || '').toLowerCase();
        const pBadge = (p.badge || '').toLowerCase();

        if (target === 'all') return true;
        if (target === 'new-arrivals' || target === 'new' || target === 'new_arrivals') {
          return Boolean(p.isNewArrival) || pBadge.includes('new') || p.badgeClass === 'new';
        }
        if (target === 'heavy-rida' || target === 'heavy-ridas' || target === 'heavy' || target === 'bridal-ridas' || target === 'bridal') {
          return pSub === 'bridal-ridas' || pSub === 'heavy-rida' || pCat === 'bridal' || pCat === 'heavy-rida' || pName.includes('heavy') || pName.includes('bridal') || pName.includes('zardozi') || pFab.includes('zardozi') || pBadge.includes('heavy') || pBadge.includes('bridal');
        }
        if (target === pCat || target === pSub) return true;
        if (target === 'ridas' || target === 'rida') return pCat === 'ridas' || pCat === 'rida' || pSub.includes('rida');
        if (target === 'silk-ridas') {
          return pSub === 'silk-ridas' || (pCat === 'ridas' && (pFab.includes('silk') || pName.includes('silk') || pFab.includes('zari')));
        }
        if (target === 'cotton-ridas' || target === 'cotton-pret' || target === 'cotton') {
          return pSub === 'cotton-ridas' || pCat === 'cotton-pret' || (pCat === 'ridas' && (pFab.includes('cotton') || pFab.includes('lawn') || pName.includes('cotton') || pName.includes('chikankari')));
        }
        if (target === 'handbags' || target === 'bags' || target === 'bag') {
          return pCat === 'handbags' || pSub === 'bags' || pCat === 'bags' || pName.includes('bag') || pName.includes('batwa');
        }
        if (target === 'accessories' || target === 'cosmetics' || target === 'pouches') {
          return pCat === 'accessories' || pSub === 'cosmetics' || pName.includes('pouch') || pName.includes('vanity') || pName.includes('topi');
        }
        return pCat === target || pSub === target;
      });
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.fabric && p.fabric.toLowerCase().includes(q)) || 
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getProductById(id) {
    return this.products.find(p => String(p.id) === String(id)) || null;
  }

  createProduct(productData) {
    const isNew = productData.isNewArrival !== undefined ? 
      Boolean(productData.isNewArrival) : 
      (productData.badgeClass === 'new' || Boolean(productData.badge && productData.badge.toLowerCase().includes('new')));

    const defaultBadge = isNew ? 'New Arrival' : (productData.badge || 'Essential');
    const defaultBadgeClass = isNew ? 'new' : (productData.badgeClass || 'bestseller');

    const newProduct = {
      id: productData.id || 'prod-' + Date.now(),
      slug: (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      badge: productData.badge || defaultBadge,
      badgeClass: productData.badgeClass || defaultBadgeClass,
      isNewArrival: isNew,
      rating: 5.0,
      reviewsCount: 0,
      galleryImages: productData.galleryImages || [productData.image],
      inStock: true,
      stockQuantity: productData.stockQuantity !== undefined ? parseInt(productData.stockQuantity) : 25,
      isFeatured: productData.isFeatured !== undefined ? Boolean(productData.isFeatured) : true,
      isBooked: false,
      onSale: false,
      salePrice: null,
      saleTag: '',
      costPrice: productData.costPrice || (productData.price * 0.5),
      ...productData
    };

    // Ensure isNewArrival is definitely set
    newProduct.isNewArrival = isNew;

    if (this.isFirebaseActive && this.db) {
      this.db.collection('products').doc(newProduct.id).set(newProduct).catch(console.error);
    }

    this.products.unshift(newProduct);
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify('PRODUCT_CREATED', newProduct);
    return { success: true, product: newProduct };
  }

  updateProduct(id, updatedData) {
    const p = this.products.find(prod => prod.id === id);
    if (!p) return { success: false, error: 'Product not found' };

    const isNew = updatedData.isNewArrival !== undefined ? Boolean(updatedData.isNewArrival) : p.isNewArrival;

    Object.assign(p, {
      ...updatedData,
      isNewArrival: isNew,
      badge: updatedData.badge !== undefined ? updatedData.badge : (isNew ? 'New Arrival' : p.badge),
      badgeClass: updatedData.badgeClass !== undefined ? updatedData.badgeClass : (isNew ? 'new' : p.badgeClass),
      price: updatedData.price !== undefined ? parseFloat(updatedData.price) : p.price,
      costPrice: updatedData.costPrice !== undefined ? parseFloat(updatedData.costPrice) : p.costPrice,
      stockQuantity: updatedData.stockQuantity !== undefined ? parseInt(updatedData.stockQuantity) : p.stockQuantity,
      updatedAt: new Date().toISOString()
    });

    if (this.isFirebaseActive && this.db) {
      this.db.collection('products').doc(id).set(p, { merge: true }).catch(console.error);
    }

    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify('PRODUCT_UPDATED', p);
    return { success: true, product: p };
  }

  toggleProductNewArrival(id) {
    const p = this.products.find(prod => prod.id === id);
    if (!p) return { success: false, error: 'Product not found' };
    p.isNewArrival = !Boolean(p.isNewArrival);
    if (p.isNewArrival) {
      p.badge = 'New Arrival';
      p.badgeClass = 'new';
    } else {
      if (p.badge === 'New Arrival') {
        p.badge = 'Silk Pret';
        p.badgeClass = 'bestseller';
      }
    }
    if (this.isFirebaseActive && this.db) {
      this.db.collection('products').doc(id).set({ 
        isNewArrival: p.isNewArrival,
        badge: p.badge,
        badgeClass: p.badgeClass 
      }, { merge: true }).catch(console.error);
    }
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify('PRODUCT_UPDATED', p);
    return { success: true, isNewArrival: p.isNewArrival, product: p };
  }

  setProductStatus(id, status) {
    const p = this.products.find(prod => prod.id === id);
    if (!p) return { success: false, error: 'Product not found' };

    const normalizedStatus = (status || 'available').toLowerCase();
    p.status = normalizedStatus;
    
    if (normalizedStatus === 'booked') {
      p.isBooked = true;
      p.isSoldOut = false;
      p.inStock = false;
    } else if (normalizedStatus === 'soldout') {
      p.isSoldOut = true;
      p.isBooked = false;
      p.inStock = false;
    } else {
      p.status = 'available';
      p.isBooked = false;
      p.isSoldOut = false;
      p.inStock = true;
    }

    if (this.isFirebaseActive && this.db) {
      this.db.collection('products').doc(id).set({
        status: p.status,
        isBooked: p.isBooked,
        isSoldOut: p.isSoldOut,
        inStock: p.inStock
      }, { merge: true }).catch(console.error);
    }
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify('PRODUCT_STATUS_UPDATED', p);
    return { success: true, status: p.status, isBooked: p.isBooked, isSoldOut: p.isSoldOut, product: p };
  }

  toggleProductBooked(id) {
    const p = this.products.find(prod => prod.id === id);
    if (!p) return { success: false, error: 'Product not found' };
    
    if (p.isBooked) {
      p.isBooked = false;
      p.status = 'available';
      p.inStock = true;
    } else {
      p.isBooked = true;
      p.isSoldOut = false;
      p.status = 'booked';
      p.inStock = false;
    }

    if (this.isFirebaseActive && this.db) {
      this.db.collection('products').doc(id).set({
        status: p.status,
        isBooked: p.isBooked,
        isSoldOut: p.isSoldOut,
        inStock: p.inStock
      }, { merge: true }).catch(console.error);
    }
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify('PRODUCT_BOOKED_TOGGLED', p);
    return { success: true, isBooked: p.isBooked, status: p.status, product: p };
  }

  toggleProductSoldOut(id) {
    const p = this.products.find(prod => prod.id === id);
    if (!p) return { success: false, error: 'Product not found' };

    if (p.isSoldOut) {
      p.isSoldOut = false;
      p.status = 'available';
      p.inStock = true;
    } else {
      p.isSoldOut = true;
      p.isBooked = false;
      p.status = 'soldout';
      p.inStock = false;
    }

    if (this.isFirebaseActive && this.db) {
      this.db.collection('products').doc(id).set({
        status: p.status,
        isBooked: p.isBooked,
        isSoldOut: p.isSoldOut,
        inStock: p.inStock
      }, { merge: true }).catch(console.error);
    }
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify('PRODUCT_SOLDOUT_TOGGLED', p);
    return { success: true, isSoldOut: p.isSoldOut, status: p.status, product: p };
  }

  setProductSale(id, { onSale, salePrice, saleTag }) {
    const p = this.products.find(prod => prod.id === id);
    if (!p) return { success: false, error: 'Product not found' };
    p.onSale = Boolean(onSale);
    if (p.onSale && salePrice !== undefined && salePrice !== null && salePrice !== '') {
      p.salePrice = parseFloat(salePrice);
      p.originalPrice = p.originalPrice || p.price;
    } else {
      p.salePrice = null;
    }
    p.saleTag = saleTag || (p.onSale ? 'SALE' : '');
    if (this.isFirebaseActive && this.db) {
      this.db.collection('products').doc(id).set({
        onSale: p.onSale,
        salePrice: p.salePrice,
        originalPrice: p.originalPrice || p.price,
        saleTag: p.saleTag
      }, { merge: true }).catch(console.error);
    }
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify('PRODUCT_SALE_UPDATED', p);
    return { success: true, product: p };
  }

  updateProductStock(id, newQty) {
    const p = this.products.find(prod => prod.id === id);
    if (!p) return { success: false, error: 'Product not found' };
    p.stockQuantity = Math.max(0, parseInt(newQty) || 0);
    p.inStock = p.stockQuantity > 0;
    if (this.isFirebaseActive && this.db) {
      this.db.collection('products').doc(id).set({
        stockQuantity: p.stockQuantity,
        inStock: p.inStock
      }, { merge: true }).catch(console.error);
    }
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify('PRODUCT_STOCK_UPDATED', p);
    return { success: true, product: p };
  }

  deleteProduct(id) {
    if (this.isFirebaseActive && this.db) {
      this.db.collection('products').doc(id).delete().catch(console.error);
    }
    this.products = this.products.filter(p => p.id !== id);
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    this.notify('PRODUCT_DELETED', { id });
    return { success: true };
  }

  /* --------------------------------------------------------------------------
     4. Sales & Operating Expenses Logging & P&L Accounting
     -------------------------------------------------------------------------- */
  logSale(saleData) {
    const qty = parseInt(saleData.quantity) || 1;
    const cost = parseFloat(saleData.costPrice) || 0;
    const price = parseFloat(saleData.sellingPrice) || 0;
    const profit = (price - cost) * qty;

    const newSale = {
      id: 'sale-' + Date.now(),
      productId: saleData.productId || 'custom',
      productName: saleData.productName || 'Direct Sale Item',
      category: saleData.category || 'ridas',
      quantity: qty,
      costPrice: cost,
      sellingPrice: price,
      profit,
      date: saleData.date || new Date().toISOString().split('T')[0]
    };

    if (this.isFirebaseActive && this.db) {
      this.db.collection('sales').doc(newSale.id).set(newSale).catch(console.error);
    }

    this.sales.push(newSale);
    this.sales.sort((a, b) => new Date(a.date) - new Date(b.date));
    this.save(STORAGE_KEYS.SALES, this.sales);
    this.notify('SALE_LOGGED', newSale);
    return { success: true, sale: newSale };
  }

  updateSale(id, updatedData) {
    const s = this.sales.find(sale => sale.id === id);
    if (!s) return { success: false, error: 'Sale record not found' };

    const qty = updatedData.quantity !== undefined ? parseInt(updatedData.quantity) : s.quantity;
    const cost = updatedData.costPrice !== undefined ? parseFloat(updatedData.costPrice) : s.costPrice;
    const price = updatedData.sellingPrice !== undefined ? parseFloat(updatedData.sellingPrice) : s.sellingPrice;
    const profit = (price - cost) * qty;

    Object.assign(s, {
      ...updatedData,
      quantity: qty,
      costPrice: cost,
      sellingPrice: price,
      profit,
      date: updatedData.date || s.date,
      updatedAt: new Date().toISOString()
    });

    if (this.isFirebaseActive && this.db) {
      this.db.collection('sales').doc(id).set(s, { merge: true }).catch(console.error);
    }

    this.sales.sort((a, b) => new Date(a.date) - new Date(b.date));
    this.save(STORAGE_KEYS.SALES, this.sales);
    this.notify('SALE_UPDATED', s);
    return { success: true, sale: s };
  }

  deleteSale(id) {
    if (this.isFirebaseActive && this.db) {
      this.db.collection('sales').doc(id).delete().catch(console.error);
    }
    this.sales = this.sales.filter(s => s.id !== id);
    this.save(STORAGE_KEYS.SALES, this.sales);
    this.notify('SALE_DELETED', { id });
    return { success: true };
  }

  logExpense(expenseData) {
    const amount = parseFloat(expenseData.amount) || 0;
    const newExp = {
      id: 'exp-' + Date.now(),
      title: expenseData.title || 'General Business Expense',
      category: expenseData.category || 'Fabric Sourcing',
      amount,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      vendor: expenseData.vendor || 'Local Market Vendor',
      notes: expenseData.notes || ''
    };
    this.expenses.unshift(newExp);
    this.save(STORAGE_KEYS.EXPENSES, this.expenses);
    this.notify('EXPENSE_LOGGED', newExp);
    return { success: true, expense: newExp };
  }

  deleteExpense(id) {
    this.expenses = this.expenses.filter(e => e.id !== id);
    this.save(STORAGE_KEYS.EXPENSES, this.expenses);
    this.notify('EXPENSE_DELETED', { id });
    return { success: true };
  }

  calculateFinancials() {
    let totalRev = 0;
    let totalCost = 0;

    this.sales.forEach(s => {
      totalRev += s.sellingPrice * s.quantity;
      totalCost += s.costPrice * s.quantity;
    });

    let totalExpenses = 0;
    (this.expenses || []).forEach(e => {
      totalExpenses += parseFloat(e.amount) || 0;
    });

    const grossProfit = totalRev - totalCost;
    const netProfit = grossProfit - totalExpenses;
    const margin = totalRev > 0 ? ((netProfit / totalRev) * 100).toFixed(1) : 0;

    return {
      totalRevenue: totalRev,
      totalCost,
      totalExpenses,
      grossProfit,
      netProfit,
      margin
    };
  }

  /* --------------------------------------------------------------------------
     CSV Report Exporters
     -------------------------------------------------------------------------- */
  downloadCSV(filename, csvContent) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  exportSalesCSV() {
    const headers = ['Sale ID', 'Date', 'Product Name', 'Category', 'Quantity', 'Cost Price (PKR)', 'Selling Price (PKR)', 'Net Profit (PKR)'];
    const rows = this.sales.map(s => [
      s.id,
      s.date,
      `"${(s.productName || '').replace(/"/g, '""')}"`,
      s.category,
      s.quantity,
      s.costPrice,
      s.sellingPrice,
      s.profit
    ]);
    const csvStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    this.downloadCSV(`aiman_sales_ledger_${new Date().toISOString().split('T')[0]}.csv`, csvStr);
  }

  exportExpensesCSV() {
    const headers = ['Expense ID', 'Date', 'Category', 'Title / Description', 'Vendor / Market', 'Amount (PKR)', 'Notes'];
    const rows = (this.expenses || []).map(e => [
      e.id,
      e.date,
      e.category,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${(e.vendor || '').replace(/"/g, '""')}"`,
      e.amount,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    this.downloadCSV(`aiman_expenses_report_${new Date().toISOString().split('T')[0]}.csv`, csvStr);
  }

  exportInventoryCSV() {
    const headers = ['Product ID', 'Title', 'Category', 'Fabric / Details', 'Cost Price (PKR)', 'Selling Price (PKR)', 'Stock Qty', 'Availability Status', 'On Sale', 'Sale Price'];
    const rows = this.products.map(p => [
      p.id,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      p.category,
      `"${(p.fabric || '').replace(/"/g, '""')}"`,
      p.costPrice || 0,
      p.price || 0,
      p.stockQuantity || 0,
      p.isSoldOut ? 'SOLD OUT' : (p.isBooked ? 'BOOKED' : (p.stockQuantity > 0 ? 'AVAILABLE' : 'OUT OF STOCK')),
      p.onSale ? 'YES' : 'NO',
      p.salePrice || '-'
    ]);
    const csvStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    this.downloadCSV(`aiman_inventory_report_${new Date().toISOString().split('T')[0]}.csv`, csvStr);
  }

  /* --------------------------------------------------------------------------
     5. Payment Gateway Processors
     -------------------------------------------------------------------------- */
  async processStripeCardPayment({ orderId, amount, currency, cardHolder, cardNumber, expMonth, expYear, cvc }) {
    await new Promise(r => setTimeout(r, 1200));
    const cleanNum = (cardNumber || '').replace(/\s+/g, '');
    if (cleanNum.length < 15) {
      return { success: false, error: 'Invalid card number length. Please check your card details.' };
    }
    if (!cvc || cvc.length < 3) {
      return { success: false, error: 'Invalid CVC security code.' };
    }

    const txnRef = 'ch_stripe_' + Math.random().toString(36).substring(2, 12);
    const txn = {
      id: 'txn_' + Date.now(),
      orderId,
      gateway: 'STRIPE_CARD',
      transactionRef: txnRef,
      amount,
      currency: currency || 'PKR',
      accountNumber: '•••• •••• •••• ' + cleanNum.slice(-4),
      cardHolder,
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    this.transactions.unshift(txn);
    this.save(STORAGE_KEYS.TRANSACTIONS, this.transactions);
    return { success: true, transaction: txn };
  }

  async processJazzCashPayment({ orderId, amount, mobileNumber }) {
    await new Promise(r => setTimeout(r, 1400));
    if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Please enter a valid 11-digit JazzCash mobile number.' };
    }

    const txnRef = 'JC-' + Math.floor(10000000 + Math.random() * 90000000);
    const txn = {
      id: 'txn_' + Date.now(),
      orderId,
      gateway: 'JAZZCASH',
      transactionRef: txnRef,
      amount,
      currency: 'PKR',
      accountNumber: mobileNumber,
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    this.transactions.unshift(txn);
    this.save(STORAGE_KEYS.TRANSACTIONS, this.transactions);
    return { success: true, transaction: txn };
  }

  async processEasyPaisaPayment({ orderId, amount, mobileNumber }) {
    await new Promise(r => setTimeout(r, 1300));
    if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Please enter a valid EasyPaisa mobile number.' };
    }

    const txnRef = 'EP-' + Math.floor(10000000 + Math.random() * 90000000);
    const txn = {
      id: 'txn_' + Date.now(),
      orderId,
      gateway: 'EASYPAISA',
      transactionRef: txnRef,
      amount,
      currency: 'PKR',
      accountNumber: mobileNumber,
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    this.transactions.unshift(txn);
    this.save(STORAGE_KEYS.TRANSACTIONS, this.transactions);
    return { success: true, transaction: txn };
  }

  async processBankTransferPayment({ orderId, amount, senderName, bankName, receiptDataUrl, referenceNumber }) {
    await new Promise(r => setTimeout(r, 800));
    const txnRef = referenceNumber || ('BT-' + Math.floor(100000 + Math.random() * 900000));
    const txn = {
      id: 'txn_' + Date.now(),
      orderId,
      gateway: 'BANK_TRANSFER',
      transactionRef: txnRef,
      amount,
      currency: 'PKR',
      senderName,
      bankName: bankName || 'Meezan Bank / Raast',
      receiptUrl: receiptDataUrl || null,
      status: 'PENDING_VERIFICATION',
      createdAt: new Date().toISOString()
    };

    this.transactions.unshift(txn);
    this.save(STORAGE_KEYS.TRANSACTIONS, this.transactions);
    return { success: true, transaction: txn };
  }

  /* --------------------------------------------------------------------------
     6. Orders & Checkout Engine
     -------------------------------------------------------------------------- */
  async createOrder(orderPayload) {
    const orderNumber = 'AC-2026-' + Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = (orderPayload.courier || 'TCS').slice(0, 3).toUpperCase() + '-' + Math.floor(10000000 + Math.random() * 90000000);

    let paymentStatus = 'PENDING_VERIFICATION';
    if (orderPayload.paymentMethod === 'STRIPE_CARD' || orderPayload.paymentMethod === 'JAZZCASH' || orderPayload.paymentMethod === 'EASYPAISA') {
      paymentStatus = 'PAID';
    } else if (orderPayload.paymentMethod === 'CASH_ON_DELIVERY') {
      paymentStatus = 'UNPAID';
    }

    const newOrder = {
      id: 'ord-' + Date.now(),
      orderNumber,
      customerName: orderPayload.customerName,
      customerEmail: orderPayload.customerEmail,
      customerPhone: orderPayload.customerPhone,
      shippingAddress: orderPayload.shippingAddress,
      city: orderPayload.city || 'Karachi',
      country: orderPayload.country || 'Pakistan',
      currency: orderPayload.currency || 'PKR',
      subtotal: orderPayload.subtotal,
      discount: orderPayload.discount || 0,
      shippingFee: orderPayload.shippingFee || 0,
      total: orderPayload.total,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus,
      orderStatus: 'PROCESSING',
      trackingNumber,
      courier: orderPayload.courier || 'TCS Express',
      notes: orderPayload.notes || '',
      paymentSlipUrl: orderPayload.paymentSlipUrl || null,
      items: orderPayload.items || [],
      emailSent: true,
      createdAt: new Date().toISOString()
    };

    if (this.isFirebaseActive && this.db) {
      this.db.collection('orders').doc(newOrder.id).set(newOrder).catch(console.error);
    }

    this.orders.unshift(newOrder);
    this.save(STORAGE_KEYS.ORDERS, this.orders);

    // Also auto-log sale for accounting
    newOrder.items.forEach(item => {
      const prod = this.getProductById(item.id);
      this.logSale({
        productId: item.id,
        productName: item.name,
        category: prod ? prod.category : 'ridas',
        quantity: item.quantity,
        costPrice: prod ? (prod.costPrice || prod.price * 0.5) : item.price * 0.5,
        sellingPrice: item.price,
        date: new Date().toISOString().split('T')[0]
      });
    });

    // Auto-generate and queue confirmation email
    this.sendOrderConfirmationEmail(newOrder);

    this.notify('ORDER_CREATED', newOrder);
    return { success: true, order: newOrder };
  }

  updateOrderStatus(orderId, orderStatus, paymentStatus) {
    const order = this.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return { success: false, error: 'Order not found' };

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    if (this.isFirebaseActive && this.db) {
      this.db.collection('orders').doc(order.id).update({
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }).catch(console.error);
    }

    this.save(STORAGE_KEYS.ORDERS, this.orders);
    this.notify('ORDER_UPDATED', order);
    return { success: true, order };
  }

  /* --------------------------------------------------------------------------
     7. Luxury HTML Email Service
     -------------------------------------------------------------------------- */
  generateOrderEmailHTML(order) {
    const itemsRows = (order.items || []).map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #2A2F3A;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td width="60" style="vertical-align: top;">
                <img src="${item.image}" alt="${item.name}" width="50" height="60" style="border-radius: 6px; object-fit: cover; border: 1px solid #C5A880;">
              </td>
              <td style="padding-left: 12px; vertical-align: top;">
                <div style="font-size: 14px; font-weight: 600; color: #FAF9F6; font-family: 'Playfair Display', Georgia, serif;">${item.name}</div>
                <div style="font-size: 12px; color: #C5A880; margin-top: 4px;">Size: ${item.size || 'Standard'} &bull; Qty: ${item.quantity}</div>
              </td>
              <td align="right" style="vertical-align: top; font-size: 14px; font-weight: 600; color: #FAF9F6;">
                Rs. ${(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation - Aiman Collection</title>
</head>
<body style="margin:0; padding:0; background-color:#0B0D11; font-family:'Plus Jakarta Sans', Arial, sans-serif; color:#FAF9F6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B0D11; padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#13161C; border-radius:14px; border:1px solid #C5A880; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.8);">
          <tr>
            <td style="background: linear-gradient(135deg, #1B212D 0%, #0B0D11 100%); padding: 36px 30px; text-align: center; border-bottom: 2px solid #C5A880;">
              <div style="font-family:'Cinzel', Georgia, serif; font-size:24px; font-weight:700; letter-spacing:0.1em; color:#C5A880;">AIMAN COLLECTION</div>
              <div style="font-size:11px; letter-spacing:0.2em; color:#E0A96D; margin-top:4px;">HAUTE COUTURE & LUXURY PRET</div>
              <div style="margin-top:20px; display:inline-block; padding:6px 18px; border-radius:30px; background:rgba(197,168,128,0.15); border:1px solid #C5A880; font-size:13px; color:#FAF9F6;">
                ✨ Order Confirmed &bull; <strong>${order.orderNumber}</strong>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #FAF9F6; margin: 0 0 12px 0;">Dearest <strong>${order.customerName}</strong>,</p>
              <p style="font-size: 14px; color: #C8CDD6; line-height: 1.6; margin: 0 0 24px 0;">
                Thank you for choosing Aiman Collection. Your bespoke order has been successfully placed and is now entering our haute couture finishing atelier.
              </p>
              <table width="100%" cellpadding="14" cellspacing="0" border="0" style="background:#1A1E26; border-radius:8px; border-left:4px solid #25D366; margin-bottom:24px;">
                <tr>
                  <td>
                    <div style="font-size:12px; color:#858D9D; text-transform:uppercase;">Courier & Tracking Information</div>
                    <div style="font-size:15px; color:#FAF9F6; font-weight:600; margin-top:4px;">
                      ${order.courier} &bull; <span style="color:#25D366; font-family:monospace;">${order.trackingNumber}</span>
                    </div>
                    <div style="font-size:12px; color:#C5A880; margin-top:4px;">Estimated Nationwide Delivery: 2-4 Business Days</div>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                ${itemsRows}
              </table>
              <table width="100%" cellpadding="4" cellspacing="0" border="0" style="border-top: 1px solid #2A2F3A; padding-top: 12px; font-size: 14px;">
                <tr>
                  <td style="color:#858D9D;">Subtotal</td>
                  <td align="right" style="color:#FAF9F6;">Rs. ${order.subtotal.toLocaleString()}</td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                  <td style="color:#E0A96D;">Festive Coupon Discount</td>
                  <td align="right" style="color:#E0A96D;">- Rs. ${order.discount.toLocaleString()}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="color:#858D9D;">Express Shipping</td>
                  <td align="right" style="color:#25D366;">FREE</td>
                </tr>
                <tr>
                  <td style="color:#C5A880; font-size: 16px; font-weight: 700; padding-top: 10px;">Total Amount</td>
                  <td align="right" style="color:#C5A880; font-size: 18px; font-weight: 700; padding-top: 10px;">
                    ${order.currency} ${order.total.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td style="color:#858D9D; font-size: 12px;">Payment Method</td>
                  <td align="right" style="color:#FAF9F6; font-size: 12px; font-weight: 600;">
                    ${order.paymentMethod.replace(/_/g, ' ')} (${order.paymentStatus})
                  </td>
                </tr>
              </table>
              <div style="margin-top:24px; padding:16px; background:#1A1E26; border-radius:8px;">
                <div style="font-size:12px; color:#858D9D; text-transform:uppercase;">Delivery Address:</div>
                <div style="font-size:14px; color:#FAF9F6; margin-top:4px;">${order.shippingAddress}, ${order.city}, ${order.country}</div>
                <div style="font-size:13px; color:#C8CDD6; margin-top:2px;">Phone: ${order.customerPhone}</div>
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=Hi%20Aiman%20Collection,%20I%20am%20inquiring%20about%20Order%20${order.orderNumber}" 
                   style="display:inline-block; background:linear-gradient(135deg, #25D366 0%, #128C7E 100%); color:#FFFFFF; text-decoration:none; padding:12px 28px; border-radius:30px; font-weight:600; font-size:14px;">
                  💬 Chat on WhatsApp (${CONTACT_CONFIG.whatsappDisplay})
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#0E1015; padding:20px; text-align:center; border-top:1px solid #222630; font-size:12px; color:#858D9D;">
              Aiman Collection &bull; Dawoodi Bohra Libas, Luxury Ridas & Matching Accessories &bull; ${CONTACT_CONFIG.city}<br>
              EasyPaisa: 03428301490 (Tahir) | JazzCash: 03252005028 (Tahir) | WhatsApp: 03452439196
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  sendOrderConfirmationEmail(order) {
    const emailRecord = {
      id: 'eml-' + Date.now(),
      orderId: order.id,
      orderNumber: order.orderNumber,
      recipient: order.customerEmail,
      subject: `✨ Order Confirmation & Receipt — ${order.orderNumber} | Aiman Collection`,
      dispatchedAt: new Date().toISOString(),
      status: 'DELIVERED',
      html: this.generateOrderEmailHTML(order)
    };

    this.emails.unshift(emailRecord);
    this.save(STORAGE_KEYS.EMAILS, this.emails);
    this.notify('EMAIL_DISPATCHED', emailRecord);
    return emailRecord;
  }

  /* --------------------------------------------------------------------------
     8. Customer Photo Reviews Engine
     -------------------------------------------------------------------------- */
  getReviews(filter = {}) {
    let list = [...this.reviews];
    if (filter.productId) {
      list = list.filter(r => r.productId === filter.productId);
    }
    if (filter.onlyPhotos) {
      list = list.filter(r => r.photos && r.photos.length > 0);
    }
    if (filter.rating) {
      list = list.filter(r => r.rating >= filter.rating);
    }
    if (filter.onlyVerified) {
      list = list.filter(r => r.isVerifiedBuyer);
    }
    return list;
  }

  createReview(reviewData) {
    const newReview = {
      id: 'rev-' + Date.now(),
      rating: parseInt(reviewData.rating) || 5,
      headline: reviewData.headline || 'Exquisite craft and stunning finish',
      comment: reviewData.comment,
      customerName: reviewData.customerName,
      customerEmail: reviewData.customerEmail || '',
      productId: reviewData.productId || 'prod-1',
      productName: reviewData.productName || 'Emerald Garden Silk Rida',
      photos: reviewData.photos || [],
      fitRating: reviewData.fitRating || 'True to Size',
      isVerifiedBuyer: reviewData.isVerifiedBuyer !== undefined ? reviewData.isVerifiedBuyer : true,
      isFeatured: true,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };

    if (this.isFirebaseActive && this.db) {
      this.db.collection('reviews').doc(newReview.id).set(newReview).catch(console.error);
    }

    this.reviews.unshift(newReview);
    this.save(STORAGE_KEYS.REVIEWS, this.reviews);

    const product = this.products.find(p => p.id === newReview.productId);
    if (product) {
      product.reviewsCount = (product.reviewsCount || 0) + 1;
      this.save(STORAGE_KEYS.PRODUCTS, this.products);
    }

    this.notify('REVIEW_CREATED', newReview);
    return { success: true, review: newReview };
  }

  updateReview(id, updatedData) {
    const rev = this.reviews.find(r => r.id === id);
    if (!rev) return { success: false, error: 'Review not found' };

    if (updatedData.customerName !== undefined) rev.customerName = updatedData.customerName;
    if (updatedData.customerEmail !== undefined) rev.customerEmail = updatedData.customerEmail;
    if (updatedData.productId !== undefined) rev.productId = updatedData.productId;
    if (updatedData.productName !== undefined) rev.productName = updatedData.productName;
    if (updatedData.rating !== undefined) rev.rating = parseInt(updatedData.rating) || 5;
    if (updatedData.headline !== undefined) rev.headline = updatedData.headline;
    if (updatedData.comment !== undefined) rev.comment = updatedData.comment;
    if (updatedData.fitRating !== undefined) rev.fitRating = updatedData.fitRating;
    if (updatedData.isVerifiedBuyer !== undefined) rev.isVerifiedBuyer = Boolean(updatedData.isVerifiedBuyer);
    if (updatedData.photos !== undefined) rev.photos = updatedData.photos;
    rev.updatedAt = new Date().toISOString();

    if (this.isFirebaseActive && this.db) {
      this.db.collection('reviews').doc(id).set(rev, { merge: true }).catch(console.error);
    }

    this.save(STORAGE_KEYS.REVIEWS, this.reviews);
    this.notify('REVIEW_UPDATED', rev);
    return { success: true, review: rev };
  }

  deleteReview(id) {
    if (this.isFirebaseActive && this.db) {
      this.db.collection('reviews').doc(id).delete().catch(console.error);
    }
    this.reviews = this.reviews.filter(r => r.id !== id);
    this.save(STORAGE_KEYS.REVIEWS, this.reviews);
    this.notify('REVIEW_DELETED', { id });
    return { success: true };
  }

  likeReview(reviewId) {
    const rev = this.reviews.find(r => r.id === reviewId);
    if (rev) {
      rev.likesCount = (rev.likesCount || 0) + 1;
      this.save(STORAGE_KEYS.REVIEWS, this.reviews);
      this.notify('REVIEW_LIKED', rev);
      return { success: true, likesCount: rev.likesCount };
    }
    return { success: false };
  }

  /* --------------------------------------------------------------------------
     9. WhatsApp AI Leads Engine & Bot Rules
     -------------------------------------------------------------------------- */
  captureLead(leadData) {
    const newLead = {
      id: 'lead-' + Date.now(),
      name: leadData.name || 'Website Guest',
      phone: leadData.phone || CONTACT_CONFIG.whatsappDisplay,
      email: leadData.email || null,
      channel: 'WHATSAPP_AI',
      productInterest: leadData.productInterest || 'General Inquiry',
      intentCategory: leadData.intentCategory || 'GENERAL',
      lastMessage: leadData.message || '',
      status: 'HOT_LEAD',
      notes: leadData.notes || 'Automated WhatsApp AI styler lead capture',
      createdAt: new Date().toISOString()
    };

    if (this.isFirebaseActive && this.db) {
      this.db.collection('leads').doc(newLead.id).set(newLead).catch(console.error);
    }

    this.leads.unshift(newLead);
    this.save(STORAGE_KEYS.LEADS, this.leads);
    this.notify('LEAD_CAPTURED', newLead);
    return { success: true, lead: newLead };
  }

  addBotRule(rule) {
    const newRule = {
      id: rule.id || 'rule-' + Date.now(),
      keywords: rule.keywords || ['help'],
      responseEnglish: rule.responseEnglish || 'Thank you for reaching out to Aiman Collection!',
      isActive: true,
      priority: rule.priority || 1
    };
    this.botRules.unshift(newRule);
    this.save(STORAGE_KEYS.BOT_RULES, this.botRules);
    this.notify('BOT_RULES_UPDATED', this.botRules);
    return { success: true, rule: newRule };
  }

  updateBotRule(idx, updatedRule) {
    if (idx >= 0 && idx < this.botRules.length) {
      Object.assign(this.botRules[idx], {
        ...updatedRule,
        keywords: updatedRule.keywords || this.botRules[idx].keywords,
        responseEnglish: updatedRule.responseEnglish || this.botRules[idx].responseEnglish,
        isActive: updatedRule.isActive !== undefined ? updatedRule.isActive : this.botRules[idx].isActive
      });
      this.save(STORAGE_KEYS.BOT_RULES, this.botRules);
      this.notify('BOT_RULES_UPDATED', this.botRules);
      return { success: true, rule: this.botRules[idx] };
    }
    return { success: false, error: 'Rule index out of range' };
  }

  deleteBotRule(idx) {
    if (idx >= 0 && idx < this.botRules.length) {
      this.botRules.splice(idx, 1);
      this.save(STORAGE_KEYS.BOT_RULES, this.botRules);
      this.notify('BOT_RULES_UPDATED', this.botRules);
      return { success: true };
    }
    return { success: false };
  }

  updateLead(id, updatedData) {
    const l = this.leads.find(lead => lead.id === id);
    if (!l) return { success: false, error: 'Lead not found' };

    Object.assign(l, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });

    if (this.isFirebaseActive && this.db) {
      this.db.collection('leads').doc(id).set(l, { merge: true }).catch(console.error);
    }

    this.save(STORAGE_KEYS.LEADS, this.leads);
    this.notify('LEAD_UPDATED', l);
    return { success: true, lead: l };
  }

  deleteLead(id) {
    if (this.isFirebaseActive && this.db) {
      this.db.collection('leads').doc(id).delete().catch(console.error);
    }
    this.leads = this.leads.filter(l => l.id !== id);
    this.save(STORAGE_KEYS.LEADS, this.leads);
    this.notify('LEAD_DELETED', { id });
    return { success: true };
  }

  /* --------------------------------------------------------------------------
     10. Analytics & Admin Metrics
     -------------------------------------------------------------------------- */
  getAnalytics() {
    const financials = this.calculateFinancials();
    return {
      totalRevenue: financials.totalRevenue,
      totalCost: financials.totalCost,
      netProfit: financials.netProfit,
      margin: financials.margin,
      totalOrders: this.orders.length,
      totalSalesCount: this.sales.length,
      totalReviews: this.reviews.length,
      photoReviews: this.reviews.filter(r => r.photos && r.photos.length > 0).length,
      totalProducts: this.products.length,
      emailsSent: this.emails.length,
      isFirebaseActive: this.isFirebaseActive
    };
  }
}

export const apiEngine = new AimanApiEngine();
if (typeof window !== 'undefined') {
  window.AimanApiEngine = apiEngine;
}
