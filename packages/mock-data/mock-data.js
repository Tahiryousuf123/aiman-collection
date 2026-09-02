/**
 * AIMAN COLLECTION — DAWOODI BOHRA LIBAS & ACCESSORIES
 * Exclusive Handcrafted Ridas, Matching Designer Bags, Batwas & Cosmetic Pouches
 * Sourced & Tailored specifically for the Dawoodi Bohra Community
 */

export const CONTACT_CONFIG = {
  whatsappNumber: '923452439196',
  whatsappDisplay: '+92 345 2439196',
  easypaisaNumber: '03452439196',
  jazzcashNumber: '03452439196',
  jazzcashDisplay: '0345-2439196',
  accountTitle: 'AIMAN COLLECTION',
  city: 'Karachi, Pakistan'
};

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAYHwV9Pdbvqg7Yk9hcgp5XDiWCpEZTOoE",
  authDomain: "aiman-collecion.firebaseapp.com",
  projectId: "aiman-collecion",
  appId: "1:820035584701:web:c9cca04bd175c0f2f2edd4"
};

export const BANK_DETAILS = {
  bankName: 'Meezan Bank Ltd (Islamic Banking)',
  accountTitle: 'AIMAN COLLECTION',
  accountNumber: '0102-0105849201',
  iban: 'PK45MEZN0001020105849201',
  branch: 'Clifton / Saddar Branch, Karachi',
  easypaisa: '03452439196 (AIMAN COLLECTION)',
  jazzcash: '03452439196 (AIMAN COLLECTION)',
  raastId: '03452439196'
};

export const INITIAL_PRODUCTS = [];

export const INITIAL_SALES = [];

export const INITIAL_REVIEWS = [];

export const INITIAL_ORDERS = [];

export const INITIAL_BOT_RULES = [
  {
    id: 'rule-01',
    keywords: ['price', 'cost', 'kitne ka', 'rate', 'discount', 'sale', 'rida price'],
    responseEnglish: "✨ Khush Amdeed! Hamari Bohra Ridas start from Rs. 3,600 (Cotton daily wear), Luxury Silk Ridas from Rs. 5,200, matching Rida Bags from Rs. 4,800, and Topi/Cosmetic Pouches from Rs. 1,800. Use promo code *AIMAN25* for 25% discount!",
    intentCategory: 'PRICING',
    isActive: true,
    priority: 1
  },
  {
    id: 'rule-02',
    keywords: ['custom', 'stitching', 'measurement', 'size', 'fitting', 'pardi', 'ghagra', 'darzi'],
    responseEnglish: "🧵 Hum pure Dawoodi Bohra Libas ki Made-to-Measure custom stitching karte hain! Pardi length, Gher, Ghagra waist aur length aapki exact naap ke mutabiq tayar hoti hai. WhatsApp karein: 03452439196.",
    intentCategory: 'CUSTOM_STITCHING',
    isActive: true,
    priority: 2
  },
  {
    id: 'rule-03',
    keywords: ['payment', 'easypaisa', 'jazzcash', 'meezan', 'bank transfer', 'cod', 'paisa'],
    responseEnglish: "💳 EasyPaisa: *03452439196* | JazzCash: *03452439196* | Meezan Bank Raast: *03452439196* (Title: AIMAN COLLECTION). Cash on Delivery (COD) bhi available hai!",
    intentCategory: 'PAYMENT',
    isActive: true,
    priority: 3
  },
  {
    id: 'rule-04',
    keywords: ['track', 'order', 'status', 'kahan hai', 'delivery time', 'courier', 'tcs'],
    responseEnglish: "📦 Karachi mein 24 ghante mein delivery aur nationwide 2-4 days via TCS Express. Track karne ke liye apna Order Number (e.g. AC-2026-XXXX) type karein ya WhatsApp karein: 03452439196.",
    intentCategory: 'ORDER_TRACKING',
    isActive: true,
    priority: 4
  }
];

export const INITIAL_EXPENSES = [];

