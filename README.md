# 👑 AIMAN COLLECTION — Luxury Dawoodi Bohra Haute Couture, Ridas & Pret

> **Pakistan's premier bespoke Dawoodi Bohra couture house, ceremonial bridal ridas, handmade designer leather handbags, vanity accessories, and accounting suite.**

[![Netlify Status](https://api.netlify.com/api/v1/badges/e8f9b9f9-5c12-4299-a99f-7a54a01c4c8d/deploy-status)](https://aimancollection.store/)
[![GitHub repo](https://img.shields.io/badge/GitHub-Tahiryousuf123%2Faimancollection-gold?logo=github)](https://github.com/Tahiryousuf123/aimancollection)
[![WhatsApp Concierge](https://img.shields.io/badge/WhatsApp-24%2F7%20AI%20Stylist-25D366?logo=whatsapp)](https://wa.me/923452439196)

---

## ✨ Key Highlights & Features

### 🛍️ 1. Ultra-Luxury E-Commerce Catalog
- **Exclusive Bohra Libas:** Signature Heavy Zardozi, Boti Bridal Silk Ridas, Pastel Cotton Everyday Ridas, and Ceremonial collections.
- **Handmade Accessories:** Premium vanity organizers, leather bags, batwas, safra table covers, and matching sets.
- **Smart Filtering & Real-Time Search:** Instant filtering by category (`Ridas`, `Handbags`, `Cosmetics`, `Deals`), price sorting, and live keyword search.
- **1-Click WhatsApp Ordering:** Direct order placement via WhatsApp with pre-formatted product specifications, price, and customer details.

### 🌐 2. Bilingual & Multi-Currency Engine
- **English & Urdu (اردو) Support:** Seamless switching with typography optimized for `Noto Nastaliq Urdu` & `Cinzel / Playfair Display`.
- **Global Currency Converter:** Instant conversion across **PKR (₨)**, **USD ($)**, **AED (د.إ)**, **GBP (£)**, and **SAR (﷼)** with automatic local storage persistence.

### ⚡ 3. 60 FPS Mobile Performance Engine
- Engineered specifically for mobile touch devices and lower-power smartphones.
- **Zero Blinking / Zero Layout Shift:** Hardware-accelerated transitions without heavy GPU compositing overhead or layout thrashing.
- **Battery-Friendly:** GPU-optimized rendering with automatic lazy loading for all images.

### 📊 4. Merchant Accounting & Admin Suite (Ctrl + Shift + A)
- **Real-Time Financial Dashboard:** Sales ledger, revenue tracking, and expense breakdown.
- **Chart.js Analytics:** Daily, weekly, and monthly interactive revenue graphs.
- **Inventory & Product Manager:** Add/edit products, toggle "New Arrival", "Booked", and "Sold Out" statuses in real time.
- **Automated Invoicing & CSV Export:** 1-click export of inventory, sales, and expense ledgers.
- **Cloud Real-Time Sync:** Firebase Firestore multi-device synchronization.

---

## 🏗️ Tech Stack

- **Frontend:** Semantic HTML5, Vanilla Modern CSS3 (Custom Design System tokens, Dark Theme, Hyderi Gold palette), Modular JavaScript ES6+.
- **Database & Sync:** Firebase Firestore Compat SDK + LocalStorage Offline Persistence.
- **Analytics & Visuals:** Chart.js, Canvas Confetti.
- **Hosting & CI/CD:** Netlify (`netlify.toml` + `_redirects` configuration), GitHub.

---

## 📁 Project Directory Structure

```text
Aiman Collection/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── api.js                # Core state engine & database service
│   │       └── whatsapp-bot-server.js
│   └── web/
│       └── src/
│           ├── app.js
│           └── styles/styles.css
├── packages/
│   └── mock-data/
│       └── mock-data.js              # Business constants & bank settings
├── images/                           # Logos, hero banners & product imagery
├── dist/                             # Production-ready Netlify build output
├── build.js                          # Production bundling script
├── index.html                        # Main storefront HTML
├── styles.css                        # Global luxury design system & responsive CSS
├── app.js                            # Storefront interactivity, cart, modals & admin
├── netlify.toml                      # Netlify build & deployment configuration
├── package.json                      # NPM configuration & scripts
└── README.md                         # Project documentation
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)

### 1. Clone the repository
```bash
git clone https://github.com/Tahiryousuf123/aimancollection.git
cd aimancollection
```

### 2. Install dependencies (Optional / Static Server)
```bash
npm install
```

### 3. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 📦 Production Build & Netlify Deployment

### Local Build
Generate the production-ready distribution package:
```bash
npm run build
```
This script bundles all static assets, scripts, images, and routes into the `dist/` directory and creates the necessary `_redirects` file for Netlify.

### Deploy to Netlify (Via Git)
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and authorize repository `Tahiryousuf123/aimancollection`.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
5. Click **"Deploy site"** — your live luxury store is ready!

---

## 🔐 Merchant Admin Access

Press `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac) anywhere on the storefront to open the Merchant Administration & Financial Ledger portal.

---

## 📞 Contact & Inquiries

- **Store:** Aiman Collection
- **WhatsApp Direct:** [+92 345 2439196](https://wa.me/923452439196)
- **Location:** Karachi, Pakistan
- **Storefront URL:** [aimancollection.store](https://aimancollection.store/)

---
*Crafted with elegance and precision for Dawoodi Bohra Haute Couture.*
