# Aiman Collection — Figma Design System & Brand Specification

Official design system tokens, typography scales, interactive component states, WhatsApp AI conversational architecture, and store admin specifications for **Aiman Collection** (Luxury Haute Couture & Pret).

---

## 1. Brand Aesthetics & Visual Identity
- **Concept**: High-end Pakistani Haute Couture, Ridas, Designer Handbags, and Festive Pret Wear.
- **Tone**: Regal, Sophisticated, Modern, Trustworthy, Human-crafted.
- **Primary Color Palette**:
  - **Royal Gold Primary**: `#C5A880` (RGB: 197, 168, 128) — CTAs, accents, primary borders
  - **Rose Gold Accent**: `#E0A96D` (RGB: 224, 169, 109) — Discounts, trending badges
  - **Velvet Burgundy**: `#661826` (RGB: 102, 24, 38) — Sale tags, luxury banners
  - **Heritage Emerald**: `#1B4D3E` (RGB: 27, 77, 62) — Traditional elements
  - **Midnight Obsidian**: `#0B0D11` (RGB: 11, 13, 17) — Main dark surface
  - **Elevated Card BG**: `#13161C` (RGB: 19, 22, 28) — Product cards, modals
  - **Warm Pearl White**: `#FAF9F6` (RGB: 250, 249, 246) — Headings & body copy
  - **WhatsApp Green**: `#25D366` (RGB: 37, 211, 102) — Floating assistant, checkout

---

## 2. Typography Scale & Fonts
| Role | Font Family | Size | Weight | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `Cinzel` | 58px / 3.6rem | 700 (Bold) | -0.01em |
| **Section Title** | `Cinzel` | 40px / 2.5rem | 700 (Bold) | 0.02em |
| **Product Title** | `Playfair Display` | 20px / 1.25rem | 600 (SemiBold) | Normal |
| **Body Large** | `Plus Jakarta Sans` | 18px / 1.12rem | 400 (Regular) | Normal |
| **Body Regular**| `Plus Jakarta Sans` | 15px / 0.95rem | 400 / 500 | 0.01em |
| **Badges / Meta**| `Plus Jakarta Sans` | 12px / 0.75rem | 700 (Bold) | 0.08em (Uppercase)|

---

## 3. UI Component Library (Figma Components)

### A. Buttons & CTAs
- **Primary Gold Button**: Linear gradient `#D4B68F` to `#B8966C`, border-radius: 9999px, box-shadow: `0 4px 18px rgba(197, 168, 128, 0.35)`.
- **WhatsApp 1-Click Order**: Linear gradient `#25D366` to `#128C7E`, white text, icon + label.
- **Secondary Glass Button**: Background `rgba(255,255,255,0.06)`, border `1px solid rgba(197, 168, 128, 0.22)`.

### B. Product Card Component
- Aspect ratio: 4:5 image container with smooth hover zoom.
- Floating badge (Sale, Bestseller, New Arrival, Haute Couture).
- Quick View overlay trigger & Heart wishlist toggle button.
- Title, 5-star rating with review count, original price strikethrough, discounted price, and dual CTAs ("Add to Bag" + "WhatsApp 1-Click").

### C. WhatsApp AI Concierge Component
- Floating circular button with animated pulse wave and unread notification badge.
- Slide-up prompt bubble with auto-dismiss.
- Verified business profile header with avatar and online pulse indicator.
- Dynamic quick suggestion chips (`Best Sellers`, `Track Order`, `Size Guide`, `Delivery Info`).
- Multilingual intent recognition (Urdu, Roman Urdu, English).
- Live Order Tracker with simulated courier details (TCS / Leopard / DHL).
- Formatted deep-linking into native WhatsApp (`https://wa.me/923363925950`).

### D. Admin Portal Component
- Navigation tabs: `Dashboard Overview`, `Orders Manager`, `Products Inventory`, `WhatsApp AI Bot Rules`, `Live Leads`.
- Live stats metrics (Total Revenue, Total Orders, Active Leads, Total Inventory).
- Real-time product creation & catalog synchronization.
- Order status switcher & Instant Printable Invoice generator.

---

## 4. Exporting as PDF & Figma Import
1. Open [`design-system.html`](file:///c:/Users/Lenovo/Desktop/Aiman%20Collectiion/design-system.html) in your browser.
2. Click the top-right button **"Export / Save as PDF"** or press `Ctrl + P`.
3. Choose **"Save as PDF"** in the destination printer. The document is pre-styled with clean `@media print` rules for crisp, pagination-perfect vector presentation.
4. You can also import the HTML / PDF directly into Figma using the **HTML to Figma** or **PDF to Figma** plugins!
