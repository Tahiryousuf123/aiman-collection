import mongoose from 'mongoose';

// 1. PRODUCT SCHEMA
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  slug: { type: String, index: true },
  name: { type: String, required: true },
  title: { type: String },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  costPrice: { type: Number, default: 0 },
  regularPrice: { type: Number },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  onSale: { type: Boolean, default: false },
  salePrice: { type: Number },
  image: { type: String, required: true },
  gallery: { type: [String], default: [] },
  galleryImages: { type: [String], default: [] },
  badge: { type: String },
  badgeClass: { type: String, default: 'new' },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  description: { type: String, default: '' },
  fabric: { type: String, default: '' },
  sizes: { type: [String], default: ['Standard'] },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 50 },
  stockStatus: { type: String, default: 'in-stock' },
  status: { type: String, default: 'available' },
  isNew: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false }
}, { timestamps: true, strict: false });

// 2. ORDER SCHEMA
const OrderItemSchema = new mongoose.Schema({
  productId: { type: String },
  productName: { type: String, required: true },
  productImage: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  size: { type: String, default: 'Standard' },
  customMeasurements: { type: mongoose.Schema.Types.Mixed }
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  orderNumber: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, default: '' },
  country: { type: String, default: 'Pakistan' },
  currency: { type: String, default: 'PKR' },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'CASH_ON_DELIVERY' },
  paymentStatus: { type: String, default: 'UNPAID' },
  orderStatus: { type: String, default: 'PENDING' },
  trackingNumber: { type: String, default: '' },
  courier: { type: String, default: 'TCS' },
  notes: { type: String, default: '' },
  paymentSlipUrl: { type: String, default: '' },
  emailSent: { type: Boolean, default: false },
  items: [OrderItemSchema]
}, { timestamps: true });

// 3. SALE TRANSACTION / ACCOUNTING LEDGER SCHEMA
const SaleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  date: { type: String, required: true },
  orderNumber: { type: String, default: '' },
  customerName: { type: String, default: 'Walk-in / Direct Client' },
  customerPhone: { type: String, default: '' },
  customerCity: { type: String, default: 'Karachi' },
  productName: { type: String, required: true },
  category: { type: String, default: 'Ridas' },
  quantity: { type: Number, default: 1 },
  costPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  unitCost: { type: Number, default: 0 },
  unitPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  netProfit: { type: Number, default: 0 },
  profitMargin: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'CASH_ON_DELIVERY' },
  status: { type: String, default: 'Delivered' },
  notes: { type: String, default: '' }
}, { timestamps: true, strict: false });

// 4. EXPENSE SCHEMA
const ExpenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  date: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'CASH' },
  notes: { type: String, default: '' },
  receiptUrl: { type: String, default: '' },
  recordedBy: { type: String, default: 'Aiman Atelier Admin' }
}, { timestamps: true });

// 5. REVIEW SCHEMA
const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  productId: { type: String, index: true },
  productName: { type: String, default: '' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  headline: { type: String, default: '' },
  comment: { type: String, required: true },
  photos: { type: [String], default: [] },
  fitRating: { type: String, default: 'True to size' },
  isVerifiedBuyer: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  likesCount: { type: Number, default: 0 }
}, { timestamps: true });

// 6. LEAD SCHEMA
const LeadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  channel: { type: String, default: 'WHATSAPP_AI' },
  productInterest: { type: String, default: '' },
  intentCategory: { type: String, default: 'GENERAL' },
  lastMessage: { type: String, default: '' },
  status: { type: String, default: 'HOT_LEAD' },
  notes: { type: String, default: '' }
}, { timestamps: true });

// 7. BOT RULE SCHEMA
const BotRuleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  keywords: { type: [String], default: [] },
  responseEnglish: { type: String, required: true },
  responseUrdu: { type: String, default: '' },
  intentCategory: { type: String, default: 'GENERAL' },
  quickActions: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 1 }
}, { timestamps: true });

// 8. SETTINGS & BRANDING SCHEMA
const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

// 9. CUSTOM STITCHING INQUIRY SCHEMA
const CustomStitchingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  garmentType: { type: String, required: true },
  fabricOption: { type: String, required: true },
  embroideryType: { type: String, default: '' },
  bust: { type: Number },
  waist: { type: Number },
  hips: { type: Number },
  length: { type: Number },
  shoulder: { type: Number },
  notes: { type: String, default: '' },
  estimatedPrice: { type: Number, default: 0 },
  status: { type: String, default: 'PENDING_CONSULTATION' }
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const Sale = mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
export const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
export const BotRule = mongoose.models.BotRule || mongoose.model('BotRule', BotRuleSchema);
export const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
export const CustomStitching = mongoose.models.CustomStitching || mongoose.model('CustomStitching', CustomStitchingSchema);
