/**
 * AIMAN COLLECTION — Client Application Script
 * Features:
 * - Moving Kashaf.pk Hero Section Slider
 * - Requested Bohra Categories (Heavy Rida, New Arrivals, Cotton Pret, Bags & Batwas, Vanity Pouches)
 * - Full Merchant & Sales Dashboard (Record Sold Ridas, Total Revenue, Ledger)
 * - Inventory & Product Manager (Add, Edit, Delete, Mark as Sold)
 * - Hero Slider Editor (Change titles, banners, announcement marquee)
 * - 1-Click WhatsApp Ordering (Zero Add to Cart clutter)
 */

(function () {
  'use strict';

  const defaultPhone = '923452439196';

  // Firebase Cloud Real-Time Engine (Single Source of Truth)
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAYHwV9Pdbvqg7Yk9hcgp5XDiWCpEZTOoE",
    authDomain: "aiman-collecion.firebaseapp.com",
    projectId: "aiman-collecion",
    appId: "1:820035584701:web:c9cca04bd175c0f2f2edd4"
  };

  let firestoreDb = null;
  function getDb() {
    if (!firestoreDb && typeof window !== 'undefined' && window.firebase) {
      try {
        const fbApp = window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(FIREBASE_CONFIG);
        firestoreDb = window.firebase.firestore(fbApp);
        console.log('⚡ [AimanStore] Firebase Real-Time Engine Active');
      } catch (err) {
        console.warn('Firebase init note:', err.message);
      }
    }
    return firestoreDb;
  }

  function ensureFirestore(callback) {
    const db = getDb();
    if (db) {
      if (callback) callback(db);
      return;
    }
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      const activeDb = getDb();
      if (activeDb) {
        clearInterval(timer);
        if (callback) callback(activeDb);
      } else if (attempts > 60) {
        clearInterval(timer);
        console.warn('⚡ [Firebase] Connection retry timeout');
      }
    }, 100);
  }

  // Luxury Brand Placeholder SVG (Data URI - Never 404s, Zero External Requests)
  const FALLBACK_PRODUCT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%2320080d'/%3E%3Ctext x='50%25' y='46%25' dominant-baseline='middle' text-anchor='middle' fill='%23d4af37' font-family='sans-serif' font-size='22' font-weight='700'%3EAiman Collection%3C/text%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%23cbd5e1' font-family='sans-serif' font-size='13' letter-spacing='0.1em'%3ELUXURY BOHRA ATELIER%3C/text%3E%3C/svg%3E";

  // Default Category Slides (7 Bohra Fashion Categories)
  const defaultCategoryCards = [
    { id: 'heavy-rida', name: '👑 Heavy Rida / Bridal', image: '', style: '' },
    { id: 'silk-rida', name: '🥻 Silk Rida', image: '', style: '' },
    { id: 'new-arrivals', name: '✨ New Arrivals', image: '', style: '' },
    { id: 'cotton-pret', name: '🌸 Cotton Pret', image: '', style: '' },
    { id: 'boski-fabric', name: '🧵 Boski Fabric', image: '', style: '' },
    { id: 'bags-batwas', name: '👜 Bags & Batwas', image: '', style: '' },
    { id: 'pouches', name: '💄 Vanity & Topi Pouches', image: '', style: '' }
  ];

  // Pure Cloud First State (no mock products or mock sales)
  let products = JSON.parse(localStorage.getItem('aiman_products')) || [];
  let salesLedger = JSON.parse(localStorage.getItem('aiman_sales')) || [];
  let heroSettings = JSON.parse(localStorage.getItem('aiman_hero_settings')) || null;
  let categoryCards = (function () {
    try {
      const stored = JSON.parse(localStorage.getItem('aiman_category_cards'));
      if (Array.isArray(stored) && stored.length > 0) {
        // Sanitize out old mock file paths
        return stored.map(c => ({
          ...c,
          image: (c.image && c.image.startsWith('images/') && !c.image.startsWith('images/uploads')) ? '' : (c.image || '')
        }));
      }
    } catch (e) {}
    return defaultCategoryCards;
  })();
  let cartItems = JSON.parse(localStorage.getItem('aiman_cart')) || [];
  let productReviews = JSON.parse(localStorage.getItem('aiman_reviews')) || {};

  // High-performance Canvas Image Compressor for Mobile Phone Cameras
  function compressImageFile(file, maxWidth = 1000, quality = 0.78) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Invalid image file'));
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = function (e) {
        const img = new Image();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.onload = function () {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Universal Category Normalizer for MongoDB Atlas Sync across all devices
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

  let currentCategory = 'all';
  let currentSort = 'featured';
  let searchQuery = '';

  // PDP State
  let currentPdpProduct = null;
  let currentPdpQty = 1;
  let currentPdpGalleryImages = [];
  let currentPdpImageIndex = 0;

  function updateHeaderCartBadge() {
    const countEl = document.getElementById('headerCartCount');
    const drawerCountEl = document.getElementById('cartDrawerItemCount');
    const totalQty = cartItems.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
    if (countEl) countEl.textContent = totalQty;
    if (drawerCountEl) drawerCountEl.textContent = totalQty;
  }

  function buildProductGallery(p) {
    if (!p) return [];
    const imgs = [];
    if (p.image) imgs.push(p.image);

    // Check if product has custom uploaded extra gallery pictures
    if (Array.isArray(p.gallery) && p.gallery.length > 0) {
      p.gallery.forEach(g => {
        if (g && typeof g === 'string' && g.trim() && !imgs.includes(g.trim())) {
          imgs.push(g.trim());
        }
      });
    } else if (Array.isArray(p.images) && p.images.length > 1) {
      p.images.slice(1).forEach(g => {
        if (g && typeof g === 'string' && g.trim() && !imgs.includes(g.trim())) {
          imgs.push(g.trim());
        }
      });
    }

    return imgs;
  }

  function getProductReviews(pId) {
    if (productReviews[pId] && Array.isArray(productReviews[pId])) {
      return productReviews[pId];
    }
    return [];
  }

  function getRelatedProducts(currentId, category) {
    let sameCat = products.filter(x => String(x.id) !== String(currentId) && x.category === category);
    if (sameCat.length < 4) {
      const others = products.filter(x => String(x.id) !== String(currentId) && x.category !== category);
      sameCat = sameCat.concat(others);
    }
    return sameCat.slice(0, 4);
  }

  // Pure Boutique Fashion Hero Banners (No Mock Images)
  const defaultBannerSlides = [
    {
      id: 'slide-1',
      title: 'Royal Dawoodi Bohra Libas Atelier',
      desktopImg: '',
      mobileImg: '',
      category: 'all'
    }
  ];

  // Slider State
  let currentSlideIndex = 0;
  let slideInterval = null;

  function getActiveBannerSlides() {
    if (heroSettings && Array.isArray(heroSettings.bannerSlides) && heroSettings.bannerSlides.length > 0) {
      // Cleanse out old mock images
      return heroSettings.bannerSlides.map(s => ({
        ...s,
        desktopImg: (s.desktopImg && s.desktopImg.startsWith('images/') && !s.desktopImg.startsWith('images/uploads')) ? '' : (s.desktopImg || ''),
        mobileImg: (s.mobileImg && s.mobileImg.startsWith('images/') && !s.mobileImg.startsWith('images/uploads')) ? '' : (s.mobileImg || '')
      }));
    }
    return defaultBannerSlides;
  }

  /* --------------------------------------------------------------------------
     1. HERO SLIDER AUTO-MOVING CAROUSEL (KASHAF STYLE)
     -------------------------------------------------------------------------- */
  function renderHeroSlider() {
    const track = document.getElementById('heroSliderTrack');
    const dotsContainer = document.getElementById('heroSliderDots');
    if (!track) return;

    const slides = getActiveBannerSlides();

    if (!slides || slides.length === 0) {
      track.innerHTML = `
        <div class="hero-slide-item active" style="background: radial-gradient(circle at 50% 50%, #2a080d 0%, #150305 100%); display:flex; align-items:center; justify-content:center; text-align:center; padding:40px 20px; min-height:320px;">
          <div style="max-width:750px; color:#fff;">
            <div style="font-size:0.85rem; letter-spacing:0.25em; text-transform:uppercase; color:#d4af37; margin-bottom:12px; font-weight:700;">👑 Dawoodi Bohra Haute Couture Atelier</div>
            <h1 style="font-family:'Cormorant Garamond',serif; font-size:clamp(1.8rem, 4vw, 3rem); font-weight:700; line-height:1.2; margin-bottom:14px; color:#fff;">Aiman Collection Atelier</h1>
            <p style="color:#e2e8f0; font-size:0.95rem; margin-bottom:20px;">Handcrafted Dawoodi Bohra Bridal Ridas, Luxury Pret &amp; Matching Ensembles</p>
            <a href="#catalog" class="admin-btn" style="background:#d4af37; color:#1e1b18; font-weight:700; padding:10px 24px; border-radius:4px; display:inline-block; text-decoration:none;">View Collection ↗</a>
          </div>
        </div>
      `;
      if (dotsContainer) dotsContainer.innerHTML = '';
      return;
    }

    track.innerHTML = slides.map((s, idx) => {
      const cat = s.category || 'all';
      const desktop = s.desktopImg || s.img || '';
      const mobile = s.mobileImg || desktop;
      const isActive = idx === currentSlideIndex;

      if (desktop) {
        return `
          <a href="#catalog" class="hero-slide-item ${isActive ? 'active' : ''}" onclick="window.AimanStore.filterCategory('${cat}'); return true;" title="${s.title || 'Aiman Collection'}">
            <picture>
              ${mobile && mobile !== desktop ? `<source media="(max-width: 768px)" srcset="${mobile}">` : ''}
              <img src="${desktop}" alt="${s.title || 'Aiman Collection'}" class="hero-slide-img" loading="${idx === 0 ? 'eager' : 'lazy'}">
            </picture>
          </a>
        `;
      } else {
        return `
          <div class="hero-slide-item ${isActive ? 'active' : ''}" style="background: radial-gradient(circle at 50% 50%, #2a080d 0%, #150305 100%); display:flex; align-items:center; justify-content:center; text-align:center; padding:40px 20px; min-height:320px;">
            <div style="max-width:750px; color:#fff;">
              <div style="font-size:0.85rem; letter-spacing:0.25em; text-transform:uppercase; color:#d4af37; margin-bottom:12px; font-weight:700;">👑 Dawoodi Bohra Haute Couture Atelier</div>
              <h1 style="font-family:'Cormorant Garamond',serif; font-size:clamp(1.8rem, 4vw, 3rem); font-weight:700; line-height:1.2; margin-bottom:14px; color:#fff;">${s.title || 'Aiman Collection Atelier'}</h1>
              <p style="color:#e2e8f0; font-size:0.95rem; margin-bottom:20px;">Handcrafted Dawoodi Bohra Bridal Ridas, Luxury Pret &amp; Matching Ensembles</p>
              <a href="#catalog" class="admin-btn" style="background:#d4af37; color:#1e1b18; font-weight:700; padding:10px 24px; border-radius:4px; display:inline-block; text-decoration:none;">View Collection ↗</a>
            </div>
          </div>
        `;
      }
    }).join('');

    if (dotsContainer) {
      dotsContainer.innerHTML = slides.length > 1 ? slides.map((_, idx) => `
        <span class="hero-dot ${idx === currentSlideIndex ? 'active' : ''}" onclick="window.AimanStore.goToSlide(${idx})"></span>
      `).join('') : '';
    }

    updateSliderDisplay();
  }

  function startHeroSlider() {
    stopHeroSlider();
    const slides = getActiveBannerSlides();
    if (slides.length <= 1) return;
    slideInterval = setInterval(() => {
      window.AimanStore.nextSlide();
    }, 4800);
  }

  function stopHeroSlider() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  function updateSliderDisplay() {
    const track = document.getElementById('heroSliderTrack');
    if (!track) return;
    const slides = getActiveBannerSlides();
    if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    const dots = document.querySelectorAll('#heroSliderDots .hero-dot, #heroSliderDots .slider-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });

    const slideElements = document.querySelectorAll('.hero-slide, .hero-slide-item');
    slideElements.forEach((el, idx) => {
      el.classList.toggle('active', idx === currentSlideIndex);
    });
  }

  /* --------------------------------------------------------------------------
     2. CATALOG PRODUCTS RENDERING
     -------------------------------------------------------------------------- */
  function renderProducts() {
    const container = document.getElementById('productGridContainer');
    if (!container) return;

    let filtered = products.filter(p => {
      const matchCat = currentCategory === 'all' || p.category === currentCategory;
      const matchSearch = searchQuery === '' || (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (currentSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'best-selling') {
      filtered.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    } else if (currentSort === 'date') {
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    const countLabel = document.getElementById('productCountLabel');
    if (countLabel) {
      countLabel.textContent = `Showing ${filtered.length} Ensembles`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <li style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #777;">
          <i class="fas fa-box-open" style="font-size: 2.5rem; margin-bottom: 15px; color: #ccc;"></i>
          <h3 style="font-size: 1.3rem; margin-bottom: 8px;">No items found in this category</h3>
          <p style="font-size: 0.9rem;">Select another category or view all products.</p>
        </li>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => {
      const title = p.title || p.name || 'Bohra Libas Ensemble';
      const status = p.stockStatus || 'in-stock';
      let statusBadgeHtml = '';
      let waClass = '';
      let btnText = 'Order on WhatsApp';
      let waMsg = `✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI want to order:\n👑 *Product:* ${title}\n💰 *Price:* Rs. ${p.price.toLocaleString()}\n\nPlease confirm availability, size naap, and delivery timeline.`;

      if (status === 'sold-out') {
        statusBadgeHtml = `<span class="stock-badge stock-badge-soldout"><i class="fas fa-circle-xmark"></i> Sold Out</span>`;
        waClass = 'wa-soldout';
        btnText = 'Sold Out • Inquire Restock';
        waMsg = `✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI saw that *${title}* is currently Sold Out. Could you please inform me when this design will be restocked, or if a similar piece can be tailored?`;
      } else if (status === 'booked') {
        statusBadgeHtml = `<span class="stock-badge stock-badge-booked"><i class="fas fa-clock"></i> Booked</span>`;
        waClass = 'wa-booked';
        btnText = 'Booked • Custom Naap Order';
        waMsg = `✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI saw that *${title}* is Booked. I would love to place a custom stitching naap order for this design (Rs. ${p.price.toLocaleString()}).`;
      } else {
        statusBadgeHtml = `<span class="stock-badge stock-badge-instock"><i class="fas fa-circle-check"></i> In Stock</span>`;
        waClass = '';
        btnText = 'Order on WhatsApp';
      }

      const waLink = `https://wa.me/${defaultPhone}?text=${encodeURIComponent(waMsg)}`;

      return `
        <li class="product-card">
          <div class="product-img-box">
            ${p.discount > 0 ? `<span class="kashaf-sale-badge">-${p.discount}%</span>` : ''}
            <div class="product-stock-badge">${statusBadgeHtml}</div>
            <a href="javascript:void(0)" onclick="window.AimanStore.openProductPage('${p.id}')">
              <img src="${p.image || FALLBACK_PRODUCT_IMAGE}" onerror="this.onerror=null; this.src=FALLBACK_PRODUCT_IMAGE;" style="${p.imageStyle || ''}" alt="${title}" loading="lazy">
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
            <!-- Direct 1-Click WhatsApp Order Button with Dynamic Status -->
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="product-wa-order-link ${waClass}" title="${btnText}">
              <i class="fab fa-whatsapp"></i> ${btnText}
            </a>
          </div>
        </li>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     3. SALES DASHBOARD & METRICS
     -------------------------------------------------------------------------- */
  function updateSalesDashboard() {
    const totalRev = salesLedger.reduce((sum, s) => sum + Number(s.amount || 0), 0);
    const totalCount = salesLedger.length;
    const pendingCount = salesLedger.filter(s => s.status && s.status.includes('Dispatched') || s.status.includes('Stitching')).length;
    const deliveredCount = salesLedger.filter(s => s.status && s.status.includes('Delivered')).length;

    const revElem = document.getElementById('statTotalRevenue');
    if (revElem) revElem.textContent = `Rs. ${totalRev.toLocaleString()}`;

    const soldElem = document.getElementById('statTotalSold');
    if (soldElem) soldElem.textContent = totalCount;

    const pendElem = document.getElementById('statPendingOrders');
    if (pendElem) pendElem.textContent = pendingCount;

    const delivElem = document.getElementById('statCompletedOrders');
    if (delivElem) delivElem.textContent = deliveredCount;

    // Render Sales Table
    const tbody = document.getElementById('salesTableBody');
    if (tbody) {
      if (salesLedger.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:25px; color:#888;">No sales recorded yet. Record your first sale above!</td></tr>`;
      } else {
        tbody.innerHTML = salesLedger.map((s, idx) => {
          let statusClass = 'status-sold';
          if (s.status.includes('Delivered')) statusClass = 'status-delivered';
          else if (s.status.includes('Dispatched')) statusClass = 'status-shipped';

          return `
            <tr>
              <td><strong>${s.date || new Date().toISOString().split('T')[0]}</strong></td>
              <td><strong>${s.productName}</strong></td>
              <td>${s.customerName}</td>
              <td>${s.phone || '-'}</td>
              <td><strong style="color:#16a34a;">Rs. ${Number(s.amount).toLocaleString()}</strong></td>
              <td>${s.paymentMethod}</td>
              <td><span class="status-tag ${statusClass}">${s.status}</span></td>
              <td>
                <button type="button" class="admin-btn admin-btn-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="window.AimanStore.deleteSale(${idx})">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Populate Sale Product dropdown
    const prodSelect = document.getElementById('saleProductSelect');
    if (prodSelect) {
      prodSelect.innerHTML = `<option value="">-- Select Sold Rida / Item --</option>` + 
        products.map(p => `<option value="${p.id}" data-price="${p.price}">${p.title} (Rs. ${p.price.toLocaleString()})</option>`).join('');
    }
  }

  /* --------------------------------------------------------------------------
     4. ADMIN PRODUCTS LIST
     -------------------------------------------------------------------------- */
  function renderAdminProducts() {
    const tbody = document.getElementById('adminProductsTableBody');
    const countBadge = document.getElementById('totalProductsCount');
    if (countBadge) countBadge.textContent = products.length;

    if (!tbody) return;

    tbody.innerHTML = products.map(p => {
      let catLabel = p.category;
      if (p.category === 'heavy-rida') catLabel = '👑 Heavy Rida / Bridal';
      else if (p.category === 'silk-rida') catLabel = '🥻 Silk Rida';
      else if (p.category === 'new-arrivals') catLabel = '✨ New Arrivals';
      else if (p.category === 'cotton-pret') catLabel = '🌸 Cotton Pret';
      else if (p.category === 'boski-fabric') catLabel = '🧵 Boski Fabric';
      else if (p.category === 'bags-batwas') catLabel = '👜 Bags & Batwas';
      else if (p.category === 'pouches') catLabel = '💄 Vanity & Topi Pouches';

      const curStatus = p.stockStatus || 'in-stock';
      let statusBg = '#ecfdf5';
      let statusColor = '#047857';
      if (curStatus === 'booked') {
        statusBg = '#fffbeb';
        statusColor = '#b45309';
      } else if (curStatus === 'sold-out') {
        statusBg = '#fef2f2';
        statusColor = '#b91c1c';
      }

      return `
        <tr>
          <td><img src="${p.image || FALLBACK_PRODUCT_IMAGE}" onerror="this.onerror=null; this.src=FALLBACK_PRODUCT_IMAGE;" style="${p.imageStyle || ''} width:42px; height:50px; object-fit:cover; border-radius:3px;"></td>
          <td><strong>${p.title}</strong></td>
          <td><span style="font-size:0.8rem; color:#666;">${catLabel}</span></td>
          <td>
            <select onchange="window.AimanStore.updateStockStatus('${p.id}', this.value)" style="padding:4px 8px; border-radius:20px; font-size:0.75rem; font-weight:700; border:1px solid #cbd5e1; outline:none; background:${statusBg}; color:${statusColor}; cursor:pointer;">
              <option value="in-stock" ${curStatus === 'in-stock' ? 'selected' : ''}>🟢 In Stock</option>
              <option value="booked" ${curStatus === 'booked' ? 'selected' : ''}>🟡 Booked</option>
              <option value="sold-out" ${curStatus === 'sold-out' ? 'selected' : ''}>🔴 Sold Out</option>
            </select>
          </td>
          <td><strong>Rs. ${p.price.toLocaleString()}</strong></td>
          <td><span class="status-tag status-sold">-${p.discount || 0}%</span></td>
          <td style="white-space:nowrap;">
            <button type="button" class="admin-btn admin-btn-success" style="padding:4px 8px; font-size:0.75rem;" onclick="window.AimanStore.quickMarkSold('${p.id}')" title="Record as Sold">
              <i class="fas fa-check"></i> Sold
            </button>
            <button type="button" class="admin-btn admin-btn-primary" style="padding:4px 8px; font-size:0.75rem;" onclick="window.AimanStore.editProduct('${p.id}')" title="Edit Product">
              <i class="fas fa-pen"></i> Edit
            </button>
            <button type="button" class="admin-btn admin-btn-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="window.AimanStore.deleteProduct('${p.id}')" title="Delete Product">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     5. LOAD HERO SLIDER SETTINGS
     -------------------------------------------------------------------------- */
  function applyHeroSettings() {
    if (!heroSettings) {
      renderHeroSlider();
      return;
    }

    if (heroSettings.announcement) {
      const marquee = document.getElementById('marqueeTrack');
      if (marquee) {
        marquee.innerHTML = `<div class="marquee-item">${heroSettings.announcement}</div>`.repeat(5);
      }
      const annInput = document.getElementById('announcementTextInput');
      if (annInput) annInput.value = heroSettings.announcement;
      const annBadge = document.getElementById('announcementLiveBadge');
      if (annBadge) annBadge.textContent = heroSettings.announcement;
    }

    renderHeroSlider();
  }

  /* --------------------------------------------------------------------------
     5b. ADMIN HERO BANNERS MANAGER
     -------------------------------------------------------------------------- */
  function renderAdminHeroSlides() {
    const listEl = document.getElementById('adminHeroBannersList');
    if (!listEl) return;

    const slides = getActiveBannerSlides();
    const categories = [
      { id: 'all', label: 'All Products (Full Catalog)' },
      { id: 'heavy-rida', label: '👑 Heavy Rida / Bridal' },
      { id: 'silk-rida', label: '🥻 Silk Rida' },
      { id: 'new-arrivals', label: '✨ New Arrivals' },
      { id: 'cotton-pret', label: '🌸 Cotton Pret' },
      { id: 'boski-fabric', label: '🧵 Boski Fabric' },
      { id: 'bags-batwas', label: '👜 Bags & Batwas' },
      { id: 'pouches', label: '💄 Vanity & Topi Pouches' }
    ];

    listEl.innerHTML = slides.map((s, idx) => {
      const cat = s.category || 'all';
      const desktop = s.desktopImg || s.img || '';
      const mobile = s.mobileImg || desktop;
      const title = s.title || `Slide ${idx + 1}`;

      const catOptions = categories.map(c => `
        <option value="${c.id}" ${c.id === cat ? 'selected' : ''}>${c.label}</option>
      `).join('');

      return `
        <div class="admin-slide-card" id="adminSlideCard_${idx}">
          <div class="admin-slide-card-header">
            <h4><i class="fas fa-image" style="color:#7a0b1a;"></i> Slide ${idx + 1}: <span id="adminSlideHeaderTitle_${idx}" style="font-weight:600; color:#334155;">${title}</span></h4>
            ${slides.length > 1 ? `
              <button type="button" class="admin-btn admin-btn-danger" style="padding:4px 10px; font-size:0.75rem;" onclick="window.AimanStore.deleteHeroBanner(${idx})">
                <i class="fas fa-trash"></i> Delete Slide
              </button>
            ` : ''}
          </div>

          <!-- Live Visual Preview of Slide -->
          <div style="display:flex; flex-direction:column; margin-bottom:14px;">
            <label style="font-size:0.8rem; font-weight:700; color:#475569; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.04em;">Live Banner Preview (2.4 : 1 Panoramic Ratio):</label>
            <div class="admin-slide-preview-box">
              ${desktop ? `<img id="adminSlidePreview_${idx}" src="${desktop}" alt="Slide ${idx + 1} Preview">` : `<div id="adminSlidePreview_${idx}" style="display:flex; align-items:center; justify-content:center; height:100%; min-height:160px; background:#1e1b18; color:#d4af37; font-size:0.9rem; font-weight:600;"><i class="fas fa-image" style="margin-right:8px;"></i> Koi banner photo upload nahi hai (Abhi upload karein)</div>`}
            </div>
          </div>

          <!-- Upload from device / laptop -->
          <div style="margin-bottom:14px; padding:12px 16px; background:#f0fdfa; border:1.5px dashed #0f766e; border-radius:8px;">
            <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <input type="file" id="slideFileInput_${idx}" accept="image/*" style="display:none;" onchange="window.AimanStore.handleSlideFileUpload(${idx}, event)">
              <button type="button" class="admin-btn" onclick="document.getElementById('slideFileInput_${idx}').click()" style="background:#0f766e; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-size:0.85rem; font-weight:600; cursor:pointer;">
                <i class="fas fa-camera"></i> Laptop / Phone se Banner Upload karein
              </button>
              <span id="slideFileName_${idx}" style="font-size:0.82rem; color:#334155; font-weight:500;">${desktop ? '✅ Photo set (Upload new to replace)' : 'Koi bhi custom banner photo select karein (Real-time Cloud Sync)'}</span>
            </div>
          </div>

          <!-- Inputs Grid -->
          <div class="admin-form-grid" style="gap:12px;">
            <div class="form-group" style="grid-column: span 2;">
              <label style="font-weight:600; font-size:0.85rem;">Banner Title / Heading *</label>
              <input type="text" id="slideTitle_${idx}" value="${title}" required placeholder="e.g. Summer Collection Luxury Editorial" oninput="const h = document.getElementById('adminSlideHeaderTitle_${idx}'); if(h) h.textContent = this.value">
            </div>

            <div class="form-group">
              <label style="font-weight:600; font-size:0.85rem;">Desktop Banner Image URL / Path</label>
              <input type="text" id="slideDesktop_${idx}" value="${desktop}" placeholder="Upload image above or paste image URL" oninput="window.AimanStore.updateSlidePreview(${idx}, this.value)">
            </div>

            <div class="form-group">
              <label style="font-weight:600; font-size:0.85rem;">Mobile Banner Image URL (Optional)</label>
              <input type="text" id="slideMobile_${idx}" value="${mobile}" placeholder="Optional mobile image URL">
            </div>

            <div class="form-group" style="grid-column: span 2;">
              <label style="font-weight:600; font-size:0.85rem;">Click Destination (Jab customer banner pe click kare to konsi category khule):</label>
              <select id="slideCategory_${idx}">
                ${catOptions}
              </select>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     5c. CATEGORY MARQUEE SLIDES & ADMIN CATEGORY PICTURES EDITOR
     -------------------------------------------------------------------------- */
  function renderCategoryCards() {
    const track = document.getElementById('categoryMarqueeTrack');
    if (!track) return;

    const cards = (categoryCards && categoryCards.length > 0) ? categoryCards : defaultCategoryCards;

    const generateCardsHtml = (setNum) => cards.map(c => `
      <div class="kashaf-cat-card" onclick="window.AimanStore.filterCategory('${c.id}')">
        ${c.image ? `
          <img src="${c.image}" style="${c.style || ''}" alt="${c.name}" loading="${setNum === 1 ? 'eager' : 'lazy'}">
        ` : `
          <div style="width:100%; height:100%; background: linear-gradient(145deg, #2a0b12, #140508); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#d4af37; padding:10px; text-align:center;">
            <span style="font-size:2rem; margin-bottom:6px;">${c.name.split(' ')[0]}</span>
            <span style="font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:#f1f5f9;">${c.name.replace(c.name.split(' ')[0], '').trim()}</span>
          </div>
        `}
        <div class="kashaf-cat-overlay">
          <span class="kashaf-cat-name">${c.name}</span>
          <span class="kashaf-cat-arrow">↗</span>
        </div>
      </div>
    `).join('');

    // Render Set 1 and Set 2 (cloned for seamless infinite loop marquee animation)
    track.innerHTML = generateCardsHtml(1) + generateCardsHtml(2);
  }

  function renderAdminCategoryCards() {
    const listEl = document.getElementById('adminCategoryCardsList');
    if (!listEl) return;

    const cards = (categoryCards && categoryCards.length > 0) ? categoryCards : defaultCategoryCards;

    listEl.innerHTML = cards.map((c, idx) => `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; display:flex; gap:12px; align-items:center;">
        <div style="width:75px; height:85px; flex-shrink:0; border-radius:6px; overflow:hidden; border:1px solid #cbd5e1; background:#1e1b18;">
          ${c.image ? `
            <img id="catCardPreview_${idx}" src="${c.image}" style="width:100%; height:100%; object-fit:cover; ${c.style || ''}">
          ` : `
            <div id="catCardPreview_${idx}" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#d4af37; font-size:1.5rem;">
              ${c.name.split(' ')[0]}
            </div>
          `}
        </div>
        <div style="flex:1; min-width:0;">
          <span style="display:block; font-size:0.85rem; font-weight:700; color:#1e293b; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${c.name}
          </span>
          <div style="display:flex; gap:6px; align-items:center; margin-bottom:6px;">
            <input type="file" id="catCardFileInput_${idx}" accept="image/*" style="display:none;" onchange="window.AimanStore.handleCategoryCardUpload(${idx}, event)">
            <button type="button" class="admin-btn" onclick="document.getElementById('catCardFileInput_${idx}').click()" style="background:#0f766e; color:#fff; padding:5px 10px; font-size:0.75rem; border:none; border-radius:4px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
              <i class="fas fa-camera"></i> Change Picture
            </button>
            <span id="catCardFileName_${idx}" style="font-size:0.72rem; color:#64748b; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:110px;">${c.image ? 'Photo set' : 'Select file'}</span>
          </div>
          <input type="text" id="catCardImgInput_${idx}" value="${c.image || ''}" placeholder="Upload photo or paste URL" style="width:100%; font-size:0.75rem; padding:5px 8px; border:1px solid #cbd5e1; border-radius:4px;" oninput="window.AimanStore.previewCategoryCard(${idx})">
        </div>
      </div>
    `).join('');
  }

  /* --------------------------------------------------------------------------
     WINDOW.AIMANSTORE PUBLIC API
     -------------------------------------------------------------------------- */
  window.AimanStore = {
    // Category Carousel Scroll Navigation
    scrollCatTrack: function (direction) {
      const track = document.getElementById('categoryMarqueeTrack');
      const container = document.getElementById('categoryMarqueeContainer');
      if (!container) return;
      const amount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: amount, behavior: 'smooth' });
    },

    // Category Filtering
    filterCategory: function (cat) {
      currentCategory = cat;
      const navLinks = document.querySelectorAll('#headerNavMenu li');
      navLinks.forEach(li => li.classList.remove('active'));

      const catMap = {
        'all': 'All Products',
        'heavy-rida': '👑 Heavy Rida / Bridal',
        'silk-rida': '🥻 Silk Rida',
        'new-arrivals': '✨ New Arrivals',
        'cotton-pret': '🌸 Cotton Pret',
        'boski-fabric': '🧵 Boski Fabric',
        'bags-batwas': '👜 Bags & Batwas',
        'pouches': '💄 Vanity & Topi Pouches'
      };

      navLinks.forEach(li => {
        if (li.textContent.trim().includes(catMap[cat] || '')) {
          li.classList.add('active');
        }
      });

      renderProducts();
      const catSec = document.getElementById('catalog');
      if (catSec) catSec.scrollIntoView({ behavior: 'smooth' });
    },

    handleSortChange: function (val) {
      currentSort = val;
      renderProducts();
    },

    // Instant Live Search with Real-time Dropdown
    handleSearchInput: function (val) {
      searchQuery = val || '';
      renderProducts();
      window.AimanStore.renderSearchDropdown(val);
    },

    showSearchDropdown: function () {
      const input = document.getElementById('modalSearchInput');
      window.AimanStore.renderSearchDropdown(input ? input.value : '');
    },

    renderSearchDropdown: function (query) {
      const dropdown = document.getElementById('searchLiveDropdown');
      if (!dropdown) return;

      const q = (query || '').trim().toLowerCase();
      dropdown.style.display = 'block';

      if (!q) {
        // Show Popular Suggestions & Categories
        dropdown.innerHTML = `
          <div class="search-suggestions-box">
            <div class="search-suggestions-title"><i class="fas fa-sparkles"></i> Popular Bohra Collections</div>
            <div class="search-suggestions-chips">
              <span class="search-chip" onclick="window.AimanStore.selectSearchCategory('heavy-rida')">👑 Heavy Bridal Rida</span>
              <span class="search-chip" onclick="window.AimanStore.selectSearchCategory('silk-rida')">🥻 Silk Rida</span>
              <span class="search-chip" onclick="window.AimanStore.selectSearchCategory('new-arrivals')">✨ New Arrivals</span>
              <span class="search-chip" onclick="window.AimanStore.selectSearchCategory('cotton-pret')">🌸 Cotton Pret</span>
              <span class="search-chip" onclick="window.AimanStore.selectSearchCategory('boski-fabric')">🧵 Boski Fabric</span>
              <span class="search-chip" onclick="window.AimanStore.selectSearchCategory('bags-batwas')">👜 Bags &amp; Batwas</span>
            </div>
          </div>
        `;
        return;
      }

      // Filter products by title or category
      const matches = products.filter(p => {
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        return titleMatch || catMatch;
      });

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 24px; text-align: center; color: #64748b;">
            <i class="fas fa-magnifying-glass" style="font-size: 1.8rem; color: #cbd5e1; margin-bottom: 8px; display: block;"></i>
            <p style="font-size: 0.95rem; font-weight: 600; color: #334155; margin-bottom: 4px;">Koi matching rida ya product nahi mila.</p>
            <p style="font-size: 0.82rem; margin-bottom: 12px;">Custom size naap ya bespoke stitching k liye direct WhatsApp par contact karein.</p>
            <a href="https://wa.me/${defaultPhone}?text=${encodeURIComponent('Assalam-o-Alaikum! I am searching for: ' + query + '. Can you assist me with availability or custom order?')}" target="_blank" rel="noopener noreferrer" class="search-dropdown-btn search-dropdown-btn-wa" style="display: inline-flex; margin: 0 auto;">
              <i class="fab fa-whatsapp"></i> Ask Atelier on WhatsApp
            </a>
          </div>
        `;
        return;
      }

      const itemsHtml = matches.slice(0, 6).map(p => {
        const status = p.stockStatus || 'in-stock';
        let statusBadge = `<span class="stock-badge stock-badge-instock" style="font-size:0.65rem; padding:2px 7px;"><i class="fas fa-circle-check"></i> In Stock</span>`;
        let waText = 'Order';
        let waMsg = `Assalam-o-Alaikum! I want to order: ${p.title} (Rs. ${p.price.toLocaleString()})`;

        if (status === 'booked') {
          statusBadge = `<span class="stock-badge stock-badge-booked" style="font-size:0.65rem; padding:2px 7px;"><i class="fas fa-clock"></i> Booked</span>`;
          waText = 'Custom Naap';
          waMsg = `Assalam-o-Alaikum! I saw that ${p.title} is Booked. I want to order custom stitching naap for this design.`;
        } else if (status === 'sold-out') {
          statusBadge = `<span class="stock-badge stock-badge-soldout" style="font-size:0.65rem; padding:2px 7px;"><i class="fas fa-circle-xmark"></i> Sold Out</span>`;
          waText = 'Inquire';
          waMsg = `Assalam-o-Alaikum! When will ${p.title} be restocked?`;
        }

        const waLink = `https://wa.me/${defaultPhone}?text=${encodeURIComponent(waMsg)}`;

        let catDisplay = 'Rida';
        if (p.category === 'heavy-rida') catDisplay = 'Heavy Bridal';
        else if (p.category === 'silk-rida') catDisplay = 'Silk Rida';
        else if (p.category === 'new-arrivals') catDisplay = 'New Arrival';
        else if (p.category === 'cotton-pret') catDisplay = 'Cotton Pret';
        else if (p.category === 'boski-fabric') catDisplay = 'Boski Fabric';
        else if (p.category === 'bags-batwas') catDisplay = 'Batwa';
        else if (p.category === 'pouches') catDisplay = 'Pouch';

        return `
          <div class="search-dropdown-item" onclick="window.AimanStore.openProductPage('${p.id}'); window.AimanStore.closeSearchModal();">
            <img src="${p.image || FALLBACK_PRODUCT_IMAGE}" onerror="this.onerror=null; this.src=FALLBACK_PRODUCT_IMAGE;" class="search-dropdown-thumb" alt="${p.title}" style="${p.imageStyle || ''}">
            <div class="search-dropdown-info">
              <div class="search-dropdown-title" title="${p.title}">${p.title}</div>
              <div class="search-dropdown-meta">
                <span class="search-dropdown-price">Rs. ${p.price.toLocaleString()}</span>
                ${p.regularPrice ? `<span class="search-dropdown-strike">Rs. ${p.regularPrice.toLocaleString()}</span>` : ''}
                <span class="search-dropdown-cat">${catDisplay}</span>
                ${statusBadge}
              </div>
            </div>
            <div class="search-dropdown-actions" onclick="event.stopPropagation()">
              <button type="button" class="search-dropdown-btn search-dropdown-btn-view" onclick="window.AimanStore.openProductPage('${p.id}'); window.AimanStore.closeSearchModal();" title="View Product Page">
                <i class="fas fa-bag-shopping"></i> View
              </button>
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="search-dropdown-btn search-dropdown-btn-wa" title="WhatsApp Order">
                <i class="fab fa-whatsapp"></i> ${waText}
              </a>
            </div>
          </div>
        `;
      }).join('');

      dropdown.innerHTML = `
        <div class="search-dropdown-header">
          <span>Matching Ensembles (${matches.length})</span>
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: normal; cursor: pointer;" onclick="window.AimanStore.triggerSearch()">View all in catalog &rarr;</span>
        </div>
        ${itemsHtml}
      `;
    },

    selectSearchCategory: function (cat) {
      window.AimanStore.filterCategory(cat);
      window.AimanStore.closeSearchModal();
    },

    triggerSearch: function () {
      const input = document.getElementById('modalSearchInput');
      searchQuery = input ? input.value : '';
      renderProducts();
      window.AimanStore.closeSearchModal();
      const catSec = document.getElementById('catalog');
      if (catSec) catSec.scrollIntoView({ behavior: 'smooth' });
    },

    openSearchModal: function () {
      const modal = document.getElementById('searchModal');
      if (modal) {
        modal.style.display = 'flex';
        const input = document.getElementById('modalSearchInput');
        if (input) {
          input.focus();
          window.AimanStore.renderSearchDropdown(input.value);
        }
      }
    },
    closeSearchModal: function () {
      const modal = document.getElementById('searchModal');
      if (modal) modal.style.display = 'none';
      const dropdown = document.getElementById('searchLiveDropdown');
      if (dropdown) dropdown.style.display = 'none';
    },

    toggleMobileMenu: function () {
      const drawer = document.getElementById('mobileDrawer');
      if (drawer) drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
    },

    // 1-Click Stock Status Switcher for Admin
    updateStockStatus: function (id, newStatus) {
      const p = products.find(x => String(x.id) === String(id));
      if (!p) return;
      p.stockStatus = newStatus;
      try {
        localStorage.setItem('aiman_products', JSON.stringify(products));
      } catch (e) {}

      // Update directly in Firebase Firestore
      const db = getDb();
      if (db) {
        db.collection('products').doc(String(id)).update({
          stockStatus: newStatus,
          isSoldOut: newStatus === 'sold-out',
          isBooked: newStatus === 'booked',
          inStock: newStatus === 'in-stock',
          updatedAt: new Date().toISOString()
        }).catch(err => console.warn('Firestore stock update note:', err));
      }

      renderProducts();
      renderAdminProducts();
    },

    // Product Detail Page & Cart Navigation
    openProductPage: function (id, pushHistory = true) {
      const p = products.find(x => String(x.id) === String(id));
      if (!p) return;

      currentPdpProduct = p;
      currentPdpQty = 1;
      currentPdpGalleryImages = buildProductGallery(p);
      currentPdpImageIndex = 0;

      let catName = '👑 Heavy Rida / Bridal';
      if (p.category === 'silk-rida') catName = '🥻 Silk Rida';
      else if (p.category === 'new-arrivals') catName = '✨ New Arrivals';
      else if (p.category === 'cotton-pret') catName = '🌸 Cotton Pret';
      else if (p.category === 'boski-fabric') catName = '🧵 Boski Fabric';
      else if (p.category === 'bags-batwas') catName = '👜 Bags & Batwas';
      else if (p.category === 'pouches') catName = '💄 Vanity & Topi Pouches';

      const curStatus = p.stockStatus || 'in-stock';
      let statusBadgeHtml = '<span class="stock-badge stock-badge-instock"><i class="fas fa-circle-check"></i> In Stock</span>';
      if (curStatus === 'booked') {
        statusBadgeHtml = '<span class="stock-badge stock-badge-booked"><i class="fas fa-clock"></i> Booked</span>';
      } else if (curStatus === 'sold-out') {
        statusBadgeHtml = '<span class="stock-badge stock-badge-soldout"><i class="fas fa-circle-xmark"></i> Sold Out</span>';
      }

      const reviews = getProductReviews(p.id);
      const reviewsHtml = reviews.length > 0 ? reviews.map(r => `
        <div class="pdp-review-card">
          <div class="pdp-review-top">
            <strong>${r.author}</strong>
            <span style="color:#f59e0b; font-size:0.85rem;">${'★'.repeat(r.rating || 5)}</span>
          </div>
          <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:6px;">${r.date || 'Verified Purchase'}</div>
          <div class="pdp-review-text">${r.text}</div>
        </div>
      `).join('') : `
        <div style="text-align:center; padding:24px 16px; color:#64748b; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1; margin-top:14px;">
          <i class="far fa-comments" style="font-size:1.6rem; color:#d4af37; margin-bottom:8px; display:block;"></i>
          <span style="font-size:0.9rem; font-weight:600; color:#334155; display:block;">Abhi tak is rida par koi customer review darj nahi hua.</span>
          <span style="font-size:0.8rem; color:#64748b;">Apna keemti experience share karne ke liye upar 'Write a review' button dabayein!</span>
        </div>
      `;

      const related = getRelatedProducts(p.id, p.category);
      const relatedHtml = related.map(item => `
        <li class="pdp-related-card" onclick="window.AimanStore.openProductPage('${item.id}')">
          <div class="pdp-related-img-box">
            ${item.discount > 0 ? `<span class="pdp-discount-badge" style="font-size:0.7rem; padding:2px 6px;">-${item.discount}%</span>` : ''}
            <img src="${item.image || FALLBACK_PRODUCT_IMAGE}" onerror="this.onerror=null; this.src=FALLBACK_PRODUCT_IMAGE;" style="${item.imageStyle || ''}" alt="${item.title}" loading="lazy">
            <button type="button" class="pdp-related-bag-btn" onclick="event.stopPropagation(); window.AimanStore.openProductPage('${item.id}')" title="View Product Details">
              <i class="fas fa-eye"></i>
            </button>
          </div>
          <div class="pdp-related-details">
            <div class="pdp-related-title-text" title="${item.title}">${item.title}</div>
            <div class="pdp-related-price-row">
              ${item.regularPrice ? `<span class="pdp-related-strike">Rs.${item.regularPrice.toLocaleString()}</span>` : ''}
              <span class="pdp-related-sale">Rs.${item.price.toLocaleString()}</span>
            </div>
          </div>
        </li>
      `).join('');

      const thumbnailsHtml = currentPdpGalleryImages.map((img, idx) => `
        <div class="pdp-thumb-item ${idx === 0 ? 'active' : ''}" id="pdpThumb_${idx}" onclick="window.AimanStore.selectGalleryImage(${idx})">
          <img src="${img || FALLBACK_PRODUCT_IMAGE}" onerror="this.onerror=null; this.src=FALLBACK_PRODUCT_IMAGE;" alt="Angle ${idx + 1}">
        </div>
      `).join('');

      const pdpEl = document.getElementById('productDetailPage');
      if (pdpEl) {
        pdpEl.innerHTML = `
          <div class="container pdp-container">
            <!-- 1. Breadcrumbs (Matching Screenshot 1) -->
            <nav class="pdp-breadcrumbs" aria-label="Breadcrumbs">
              <a href="javascript:void(0)" onclick="window.AimanStore.closeProductPage()">Home</a>
              <span class="pdp-crumb-sep">&gt;</span>
              <a href="javascript:void(0)" onclick="window.AimanStore.closeProductPage(); window.AimanStore.filterCategory('${p.category}');">Products</a>
              <span class="pdp-crumb-sep">&gt;</span>
              <span class="pdp-crumb-cat">${catName}</span>
              <span class="pdp-crumb-sep">&gt;</span>
              <span class="pdp-crumb-current">${p.title}</span>
            </nav>

            <!-- 2. Main Two-Column Layout (Desktop 2-Col, Mobile 1-Col) -->
            <div class="pdp-layout-grid">
              <!-- Left Column: Gallery (Matching Screenshot 1) -->
              <div class="pdp-gallery-col">
                <div class="pdp-main-image-wrap">
                  ${p.discount > 0 ? `<span class="pdp-discount-badge">-${p.discount}%</span>` : ''}
                  <button type="button" class="pdp-expand-btn" onclick="window.AimanStore.zoomPdpImage()" aria-label="Zoom Image" title="Fullscreen View">
                    <i class="fas fa-expand"></i>
                  </button>
                  ${currentPdpGalleryImages.length > 1 ? `
                  <div class="pdp-nav-arrows">
                    <button type="button" class="pdp-arrow-btn" onclick="window.AimanStore.prevGalleryImage()" aria-label="Previous Image">
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <button type="button" class="pdp-arrow-btn" onclick="window.AimanStore.nextGalleryImage()" aria-label="Next Image">
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>` : ''}
                  <img id="pdpMainImage" src="${currentPdpGalleryImages[0] || FALLBACK_PRODUCT_IMAGE}" onerror="this.onerror=null; this.src=FALLBACK_PRODUCT_IMAGE;" alt="${p.title}" class="pdp-main-img">
                </div>

                ${currentPdpGalleryImages.length > 1 ? `
                <div class="pdp-thumbnails-strip" id="pdpThumbnailsStrip">
                  ${thumbnailsHtml}
                </div>` : ''}
              </div>

              <!-- Right Column: Info & Purchase Actions (Matching Screenshot 2) -->
              <div class="pdp-info-col">
                <h1 class="pdp-title">${p.title}</h1>
                <div class="pdp-sku-row">
                  <span>Code: <strong>AIMAN-${p.category.toUpperCase().slice(0, 3)}-KP${p.id}</strong></span>
                  ${statusBadgeHtml}
                </div>

                <div class="pdp-price-row">
                  ${p.regularPrice ? `<span class="pdp-price-regular">Rs.${p.regularPrice.toLocaleString()}.00</span>` : ''}
                  <span class="pdp-price-sale">Rs.${p.price.toLocaleString()}.00</span>
                </div>

                <div class="pdp-quantity-block">
                  <label class="pdp-qty-label">Quantity:</label>
                  <div class="pdp-qty-stepper">
                    <button type="button" class="pdp-qty-btn" onclick="window.AimanStore.changePdpQty(-1)">-</button>
                    <span class="pdp-qty-val" id="pdpQtyDisplay">1</span>
                    <button type="button" class="pdp-qty-btn" onclick="window.AimanStore.changePdpQty(1)">+</button>
                  </div>
                </div>

                <!-- 2 High-Converting Direct Purchase Buttons (Zero Add to Cart Clutter) -->
                <div class="pdp-actions-stack">
                  <button type="button" class="pdp-btn pdp-btn-buynow" onclick="window.AimanStore.buyNowPdp()">
                    BUY IT NOW
                  </button>
                  <button type="button" class="pdp-btn pdp-btn-whatsapp" onclick="window.AimanStore.orderWhatsAppPdp()">
                    <i class="fab fa-whatsapp"></i> ORDER VIA WHATSAPP
                  </button>
                </div>

                <!-- Cash on Delivery & Nationwide Trust Box (Exact Match to Screenshot 2) -->
                <div class="pdp-trust-box">
                  <div class="pdp-trust-top">
                    <div class="pdp-check-circle"><i class="fas fa-check"></i></div>
                    <div class="pdp-trust-top-text">
                      <strong>Cash on Delivery available nationwide</strong>
                      <span>Pay when you receive your order</span>
                    </div>
                  </div>
                  <div class="pdp-trust-features-row">
                    <div class="pdp-trust-feature">
                      <div class="pdp-feat-icon"><i class="fas fa-truck-fast"></i></div>
                      <strong>2-4 Days</strong>
                      <span>Pakistan-wide</span>
                    </div>
                    <div class="pdp-trust-feature">
                      <div class="pdp-feat-icon"><i class="fas fa-rotate-left"></i></div>
                      <strong>7-Day Exchange</strong>
                      <span>Hassle-free</span>
                    </div>
                    <div class="pdp-trust-feature">
                      <div class="pdp-feat-icon"><i class="fas fa-box-open"></i></div>
                      <strong>Free delivery</strong>
                      <span>all across Pakistan</span>
                    </div>
                  </div>
                </div>

                <!-- Collapsible Accordions (Exact Match to Screenshot 2) -->
                <div class="pdp-accordions-wrap">
                  <div class="pdp-accordion-item active" id="accProductDetails">
                    <button type="button" class="pdp-accordion-header" onclick="window.AimanStore.togglePdpAccordion('accProductDetails')">
                      <span>Product Details</span>
                      <span class="acc-indicator">-</span>
                    </button>
                    <div class="pdp-accordion-content">
                      <div class="pdp-specs-table">
                        <p><strong>Fabric:</strong> Premium Luxury Cotton Lawn / Pure Silk / Boski</p>
                        <p><strong>Craftsmanship:</strong> Bespoke Dawoodi Bohra Needlework, Detailed Pardi, Matching Borders</p>
                        <p><strong>Includes:</strong> Complete Libas / Rida with matching accessories &amp; custom naap tailoring</p>
                        <p><strong>Delivery:</strong> Free Nationwide TCS Express with live parcel tracking</p>
                      </div>
                    </div>
                  </div>

                  <div class="pdp-accordion-item" id="accDeliveryShipping">
                    <button type="button" class="pdp-accordion-header" onclick="window.AimanStore.togglePdpAccordion('accDeliveryShipping')">
                      <span>Delivery &amp; TCS Shipping</span>
                      <span class="acc-indicator">+</span>
                    </button>
                    <div class="pdp-accordion-content">
                      <p>Orders within Karachi are delivered within 24–48 hours. Nationwide deliveries to Lahore, Rawalpindi, Islamabad, Faisalabad, Multan, Hyderabad and other cities are dispatched via TCS Express within 2–4 business days with zero shipping fee.</p>
                    </div>
                  </div>

                  <div class="pdp-accordion-item" id="accCareInstructions">
                    <button type="button" class="pdp-accordion-header" onclick="window.AimanStore.togglePdpAccordion('accCareInstructions')">
                      <span>Care Instructions</span>
                      <span class="acc-indicator">+</span>
                    </button>
                    <div class="pdp-accordion-content">
                      <p>Dry clean recommended for heavy bridal and zardozi ridas. For everyday cotton pret, gentle hand wash in mild detergent with cold water. Iron on reverse at moderate temperature.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Customer Reviews Section (Exact Match to Screenshot 3) -->
            <section class="pdp-reviews-section">
              <h2 class="pdp-reviews-title">Customer Reviews</h2>
              <div class="pdp-rating-stars-row">
                <span class="pdp-stars">⭐⭐⭐⭐⭐</span>
              </div>
              <p class="pdp-reviews-lead">${reviews.length} Verified Client Reviews</p>
              <button type="button" class="pdp-btn-review" onclick="window.AimanStore.openReviewModal()">
                Write a review
              </button>

              <div class="pdp-reviews-list" id="pdpReviewsList">
                ${reviewsHtml}
              </div>
            </section>

            <!-- 4. Related Products Section (Exact Match to Screenshot 3 & 4) -->
            <section class="pdp-related-section">
              <h2 class="pdp-related-title">Related Products</h2>
              <ul class="pdp-related-grid">
                ${relatedHtml}
              </ul>
            </section>
          </div>
        `;
      }

      const home = document.getElementById('homePageView');
      const pdp = document.getElementById('productDetailPage');
      if (home) home.style.display = 'none';
      if (pdp) pdp.style.display = 'block';

      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (pushHistory) {
        history.pushState({ productId: p.id }, '', '#product-' + p.id);
      }
    },

    closeProductPage: function (pushHistory = true) {
      const home = document.getElementById('homePageView');
      const pdp = document.getElementById('productDetailPage');
      if (home) home.style.display = 'block';
      if (pdp) pdp.style.display = 'none';

      if (pushHistory) {
        history.pushState({}, '', window.location.pathname);
      }
    },

    selectGalleryImage: function (idx) {
      currentPdpImageIndex = idx;
      const mainImg = document.getElementById('pdpMainImage');
      if (mainImg && currentPdpGalleryImages[idx]) {
        mainImg.style.opacity = '0.3';
        setTimeout(() => {
          mainImg.src = currentPdpGalleryImages[idx];
          mainImg.style.opacity = '1';
        }, 120);
      }
      document.querySelectorAll('.pdp-thumb-item').forEach((el, i) => {
        el.classList.toggle('active', i === idx);
      });
    },

    nextGalleryImage: function () {
      if (currentPdpGalleryImages.length <= 1) return;
      currentPdpImageIndex = (currentPdpImageIndex + 1) % currentPdpGalleryImages.length;
      window.AimanStore.selectGalleryImage(currentPdpImageIndex);
    },

    prevGalleryImage: function () {
      if (currentPdpGalleryImages.length <= 1) return;
      currentPdpImageIndex = (currentPdpImageIndex - 1 + currentPdpGalleryImages.length) % currentPdpGalleryImages.length;
      window.AimanStore.selectGalleryImage(currentPdpImageIndex);
    },

    zoomPdpImage: function () {
      const modal = document.getElementById('imageZoomModal');
      const img = document.getElementById('zoomModalImg');
      if (modal && img && currentPdpGalleryImages[currentPdpImageIndex]) {
        img.src = currentPdpGalleryImages[currentPdpImageIndex];
        modal.style.display = 'flex';
      }
    },

    changePdpQty: function (delta) {
      currentPdpQty = Math.max(1, currentPdpQty + delta);
      const disp = document.getElementById('pdpQtyDisplay');
      if (disp) disp.textContent = currentPdpQty;
    },

    addToCartPdp: function () {
      if (!currentPdpProduct) return;
      const p = currentPdpProduct;
      const existing = cartItems.find(x => String(x.id) === String(p.id));
      if (existing) {
        existing.qty = (Number(existing.qty) || 1) + currentPdpQty;
      } else {
        cartItems.push({
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.image,
          qty: currentPdpQty
        });
      }
      localStorage.setItem('aiman_cart', JSON.stringify(cartItems));
      updateHeaderCartBadge();

      const toast = document.getElementById('cartNotificationToast');
      const msg = document.getElementById('cartToastMessage');
      if (toast && msg) {
        msg.textContent = `"${p.title}" added to shopping bag! (Qty: ${currentPdpQty})`;
        toast.style.display = 'flex';
        clearTimeout(window._cartToastTimer);
        window._cartToastTimer = setTimeout(() => {
          toast.style.display = 'none';
        }, 3500);
      }
    },

    quickAddToCart: function (id) {
      const p = products.find(x => String(x.id) === String(id));
      if (!p) return;
      const existing = cartItems.find(x => String(x.id) === String(p.id));
      if (existing) {
        existing.qty = (Number(existing.qty) || 1) + 1;
      } else {
        cartItems.push({
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.image,
          qty: 1
        });
      }
      localStorage.setItem('aiman_cart', JSON.stringify(cartItems));
      updateHeaderCartBadge();

      const toast = document.getElementById('cartNotificationToast');
      const msg = document.getElementById('cartToastMessage');
      if (toast && msg) {
        msg.textContent = `"${p.title}" added to shopping bag!`;
        toast.style.display = 'flex';
        clearTimeout(window._cartToastTimer);
        window._cartToastTimer = setTimeout(() => {
          toast.style.display = 'none';
        }, 3500);
      }
    },

    buyNowPdp: function () {
      if (!currentPdpProduct) return;
      const p = currentPdpProduct;
      const totalAmount = p.price * currentPdpQty;
      const msg = `✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI want to *BUY IT NOW* with Cash on Delivery:\n👑 *Product:* ${p.title}\n🔖 *Code:* AIMAN-${p.category.toUpperCase().slice(0, 3)}-KP${p.id}\n🔢 *Quantity:* ${currentPdpQty}\n💰 *Unit Price:* Rs. ${p.price.toLocaleString()}\n💎 *Total Amount:* Rs. ${totalAmount.toLocaleString()}\n🚚 *Shipping:* Free Nationwide TCS Delivery\n\nPlease confirm order dispatch.`;
      window.open(`https://wa.me/${defaultPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    },

    orderWhatsAppPdp: function () {
      if (!currentPdpProduct) return;
      const p = currentPdpProduct;
      const totalAmount = p.price * currentPdpQty;
      const msg = `✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI am inquiring about:\n👑 *Product:* ${p.title}\n🔖 *Code:* AIMAN-${p.category.toUpperCase().slice(0, 3)}-KP${p.id}\n🔢 *Quantity:* ${currentPdpQty}\n💰 *Price:* Rs. ${totalAmount.toLocaleString()}\n\nCould you please share custom naap details, fabric feel, and delivery schedule?`;
      window.open(`https://wa.me/${defaultPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    },

    togglePdpAccordion: function (id) {
      const item = document.getElementById(id);
      if (!item) return;
      const isActive = item.classList.contains('active');
      item.classList.toggle('active', !isActive);
      const ind = item.querySelector('.acc-indicator');
      if (ind) ind.textContent = isActive ? '+' : '-';
    },

    openCartDrawer: function () {
      const overlay = document.getElementById('cartDrawerOverlay');
      const list = document.getElementById('cartDrawerItemsList');
      const subtotalEl = document.getElementById('cartSubtotalDisplay');
      if (!overlay || !list) return;

      if (cartItems.length === 0) {
        list.innerHTML = `
          <div style="text-align:center; padding:50px 20px; color:#64748b;">
            <i class="fas fa-bag-shopping" style="font-size:2.8rem; color:#cbd5e1; margin-bottom:12px; display:block;"></i>
            <h4 style="color:#1e293b; margin-bottom:6px;">Your Shopping Bag is Empty</h4>
            <p style="font-size:0.85rem; margin-bottom:18px;">Discover our handcrafted Bohra bridal ridas and festive pret.</p>
            <button type="button" class="admin-btn admin-btn-primary" onclick="window.AimanStore.closeCartDrawer(); window.AimanStore.closeProductPage();">
              Explore Collections
            </button>
          </div>
        `;
        if (subtotalEl) subtotalEl.textContent = 'Rs. 0.00';
      } else {
        const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * (Number(item.qty) || 1)), 0);
        if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}.00`;

        list.innerHTML = cartItems.map(item => `
          <div class="cart-drawer-item">
            <img src="${item.image || FALLBACK_PRODUCT_IMAGE}" onerror="this.onerror=null; this.src=FALLBACK_PRODUCT_IMAGE;" class="cart-drawer-thumb" alt="${item.title}">
            <div class="cart-drawer-info">
              <div class="cart-drawer-title" title="${item.title}">${item.title}</div>
              <div class="cart-drawer-price">Rs. ${Number(item.price).toLocaleString()}</div>
              <div class="cart-drawer-qty-row">
                <div class="pdp-qty-stepper" style="height:28px; width:80px;">
                  <button type="button" class="pdp-qty-btn" style="width:24px; font-size:0.9rem;" onclick="window.AimanStore.changeCartItemQty('${item.id}', -1)">-</button>
                  <span class="pdp-qty-val" style="font-size:0.85rem;">${item.qty}</span>
                  <button type="button" class="pdp-qty-btn" style="width:24px; font-size:0.9rem;" onclick="window.AimanStore.changeCartItemQty('${item.id}', 1)">+</button>
                </div>
                <button type="button" class="cart-drawer-del-btn" onclick="window.AimanStore.removeCartItem('${item.id}')" title="Remove item">
                  <i class="fas fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('');
      }

      updateHeaderCartBadge();
      overlay.style.display = 'flex';
    },

    closeCartDrawer: function () {
      const overlay = document.getElementById('cartDrawerOverlay');
      if (overlay) overlay.style.display = 'none';
    },

    changeCartItemQty: function (id, delta) {
      const item = cartItems.find(x => String(x.id) === String(id));
      if (!item) return;
      item.qty = (Number(item.qty) || 1) + delta;
      if (item.qty <= 0) {
        cartItems = cartItems.filter(x => String(x.id) !== String(id));
      }
      localStorage.setItem('aiman_cart', JSON.stringify(cartItems));
      window.AimanStore.openCartDrawer();
    },

    removeCartItem: function (id) {
      cartItems = cartItems.filter(x => String(x.id) !== String(id));
      localStorage.setItem('aiman_cart', JSON.stringify(cartItems));
      window.AimanStore.openCartDrawer();
    },

    checkoutCartWhatsApp: function () {
      if (cartItems.length === 0) return;
      const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * (Number(item.qty) || 1)), 0);
      let itemsList = cartItems.map((item, i) => `${i + 1}. *${item.title}* (Qty: ${item.qty}) — Rs. ${(item.price * item.qty).toLocaleString()}`).join('\n');
      const msg = `✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI want to place an order for my shopping bag:\n\n${itemsList}\n\n💰 *Total Amount:* Rs. ${subtotal.toLocaleString()}\n🚚 *Shipping:* Free Nationwide TCS Delivery\n\nPlease confirm availability and payment details.`;
      window.open(`https://wa.me/${defaultPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    },

    checkoutCartCOD: function () {
      if (cartItems.length === 0) return;
      const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * (Number(item.qty) || 1)), 0);
      const name = prompt('Cash on Delivery Order:\nApna Naam Darj Karein:', 'Bohra Customer');
      if (!name) return;
      const phone = prompt('WhatsApp / Contact Number:', '03001234567') || '';
      const address = prompt('Complete Delivery Address & City (Pakistan):', 'Karachi') || '';

      const newSale = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString().split('T')[0],
        productName: cartItems.map(x => `${x.title} (x${x.qty})`).join(', '),
        customerName: `${name} (${address})`,
        phone: phone,
        amount: subtotal,
        totalRevenue: subtotal,
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Sold - In Stitching'
      };

      salesLedger.unshift(newSale);
      try {
        localStorage.setItem('aiman_sales', JSON.stringify(salesLedger));
      } catch (e) {}

      // Save directly to Firebase Firestore
      ensureFirestore(async (db) => {
        try {
          await db.collection('sales').doc(newSale.id).set(newSale);
          console.log('⚡ [Firebase] Storefront order saved to Firestore:', newSale.id);
        } catch (err) {
          console.warn('Firestore sale note:', err);
        }
      });

      cartItems = [];
      localStorage.setItem('aiman_cart', JSON.stringify(cartItems));
      updateHeaderCartBadge();
      window.AimanStore.closeCartDrawer();
      updateSalesDashboard();

      alert(`🎉 Shukriya ${name}!\nAapka Cash on Delivery order kamyabi se darj ho chuka hai (Total: Rs. ${subtotal.toLocaleString()}). TCS parcel dispatch details aapko WhatsApp par bhej di jaengi.`);
    },

    openReviewModal: function () {
      if (!currentPdpProduct) return;
      const modal = document.getElementById('writeReviewModal');
      const label = document.getElementById('reviewProductTitleLabel');
      if (label) label.textContent = `Product: ${currentPdpProduct.title}`;
      if (modal) modal.style.display = 'flex';
    },

    closeReviewModal: function () {
      const modal = document.getElementById('writeReviewModal');
      if (modal) modal.style.display = 'none';
    },

    setReviewRating: function (stars) {
      const valInput = document.getElementById('reviewRatingVal');
      if (valInput) valInput.value = stars;
      const starSpans = document.querySelectorAll('#starRatingPicker .star-pick');
      starSpans.forEach((s, idx) => {
        s.classList.toggle('active', idx < stars);
      });
    },

    submitReview: function (e) {
      e.preventDefault();
      if (!currentPdpProduct) return;
      const rating = Number(document.getElementById('reviewRatingVal').value) || 5;
      const author = document.getElementById('reviewAuthorInput').value.trim();
      const text = document.getElementById('reviewTextInput').value.trim();

      const pId = currentPdpProduct.id;
      if (!productReviews[pId]) {
        productReviews[pId] = [...getProductReviews(pId)];
      }
      productReviews[pId].unshift({
        author: author + ' (Verified Client)',
        rating: rating,
        date: 'Just now',
        text: text
      });

      try {
        localStorage.setItem('aiman_reviews', JSON.stringify(productReviews));
      } catch (e) {}

      // Save directly to Firebase Firestore
      ensureFirestore(async (db) => {
        try {
          await db.collection('reviews').doc(String(pId)).set({
            reviews: productReviews[pId],
            updatedAt: new Date().toISOString()
          }, { merge: true });
          console.log('⚡ [Firebase] Customer review saved to Firestore for product:', pId);
        } catch (err) {
          console.warn('Firestore review save note:', err);
        }
      });

      window.AimanStore.closeReviewModal();
      e.target.reset();
      window.AimanStore.setReviewRating(5);

      const list = document.getElementById('pdpReviewsList');
      if (list) {
        list.innerHTML = productReviews[pId].map(r => `
          <div class="pdp-review-card">
            <div class="pdp-review-top">
              <strong>${r.author}</strong>
              <span style="color:#f59e0b; font-size:0.85rem;">${'★'.repeat(r.rating || 5)}</span>
            </div>
            <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:6px;">${r.date || 'Verified Purchase'}</div>
            <div class="pdp-review-text">${r.text}</div>
          </div>
        `).join('');
      }

      alert('⭐ Shukriya! Aapka review kamyabi se submit ho gaya.');
    },

    // Backward compatibility for quick view
    openQuickView: function (id) {
      window.AimanStore.openProductPage(id);
    },

    closeQuickView: function () {
      window.AimanStore.closeProductPage();
    },

    // Admin Suite Navigation & Actions
    openAdminSuite: function () {
      const auth = sessionStorage.getItem('aiman_admin_auth');
      if (auth === '40461') {
        const modal = document.getElementById('adminSuiteModal');
        if (modal) {
          modal.style.display = 'flex';
          setupFirestoreRealtimeSync();
          if (window.AimanStore && window.AimanStore.syncCloudNow) window.AimanStore.syncCloudNow();
          updateSalesDashboard();
          renderAdminProducts();
          renderAdminHeroSlides();
          renderAdminCategoryCards();
        }
      } else {
        const authModal = document.getElementById('adminAuthModal');
        if (authModal) {
          authModal.style.display = 'flex';
          const input = document.getElementById('adminPasscodeInput');
          if (input) {
            input.value = '';
            setTimeout(() => input.focus(), 120);
          }
        }
      }
    },

    submitAdminPasscode: function (e) {
      e.preventDefault();
      const input = document.getElementById('adminPasscodeInput');
      const err = document.getElementById('adminAuthError');
      const val = (input.value || '').trim();
      if (val === '40461') {
        sessionStorage.setItem('aiman_admin_auth', '40461');
        input.value = '';
        if (err) err.style.display = 'none';
        const authModal = document.getElementById('adminAuthModal');
        if (authModal) authModal.style.display = 'none';
        const modal = document.getElementById('adminSuiteModal');
        if (modal) {
          modal.style.display = 'flex';
          setupFirestoreRealtimeSync();
          if (window.AimanStore && window.AimanStore.syncCloudNow) window.AimanStore.syncCloudNow();
          updateSalesDashboard();
          renderAdminProducts();
          renderAdminHeroSlides();
          renderAdminCategoryCards();
        }
      } else {
        if (err) {
          err.textContent = '❌ Galat password! Barahe mehrbani sahi password (40461) darj karein.';
          err.style.display = 'block';
        }
        input.value = '';
        input.focus();
      }
    },

    closeAdminAuthModal: function () {
      const modal = document.getElementById('adminAuthModal');
      if (modal) modal.style.display = 'none';
      const err = document.getElementById('adminAuthError');
      if (err) err.style.display = 'none';
    },

    lockAdminSuite: function () {
      sessionStorage.removeItem('aiman_admin_auth');
      window.AimanStore.closeAdminSuite();
      alert('🔒 Admin console locked successfully.');
    },

    closeAdminSuite: function () {
      const modal = document.getElementById('adminSuiteModal');
      if (modal) modal.style.display = 'none';
    },

    switchAdminTab: function (tabName) {
      document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.style.display = 'none');

      if (tabName === 'sales') {
        document.getElementById('tabBtnSales').classList.add('active');
        document.getElementById('adminTabSales').style.display = 'block';
        updateSalesDashboard();
      } else if (tabName === 'products') {
        document.getElementById('tabBtnProducts').classList.add('active');
        document.getElementById('adminTabProducts').style.display = 'block';
        renderAdminProducts();
      } else if (tabName === 'hero') {
        document.getElementById('tabBtnHero').classList.add('active');
        document.getElementById('adminTabHero').style.display = 'block';
        renderAdminHeroSlides();
        renderAdminCategoryCards();
      }
    },

    // Sales Recording
    onSaleProductChange: function (prodId) {
      const p = products.find(x => String(x.id) === String(prodId));
      if (p) {
        document.getElementById('saleAmountInput').value = p.price;
      }
    },

    recordSale: function (e) {
      e.preventDefault();
      const prodSelect = document.getElementById('saleProductSelect');
      const selectedOption = prodSelect.options[prodSelect.selectedIndex];
      const prodTitle = selectedOption ? selectedOption.text.split(' (Rs.')[0] : 'Bespoke Rida';
      const amount = Number(document.getElementById('saleAmountInput').value) || 0;
      const customer = document.getElementById('saleCustomerInput').value.trim();
      const phone = document.getElementById('salePhoneInput').value.trim();
      const payment = document.getElementById('salePaymentSelect').value;
      const status = document.getElementById('saleStatusSelect').value;

      const newSale = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString().split('T')[0],
        productName: prodTitle,
        customerName: customer,
        phone: phone,
        amount: amount,
        totalRevenue: amount,
        paymentMethod: payment,
        status: status
      };

      salesLedger.unshift(newSale);
      try {
        localStorage.setItem('aiman_sales', JSON.stringify(salesLedger));
      } catch (e) {}

      // Persist directly to Firebase Firestore
      ensureFirestore(async (db) => {
        try {
          await db.collection('sales').doc(newSale.id).set(newSale);
          console.log('⚡ [Firebase] Custom sale saved to Firestore:', newSale.id);
        } catch (err) {
          console.warn('Firestore sale save note:', err);
        }
      });

      alert(`✅ Sale recorded successfully!\nProduct: ${prodTitle}\nAmount: Rs. ${amount.toLocaleString()}`);
      e.target.reset();
      updateSalesDashboard();
    },

    quickMarkSold: function (prodId) {
      const p = products.find(x => String(x.id) === String(prodId));
      if (!p) return;

      const customer = prompt(`Mark "${p.title}" as Sold.\nEnter Customer Name:`, 'Bohra Customer');
      if (!customer) return;

      const phone = prompt('Enter Customer WhatsApp/Phone:', '03001234567') || '';
      const newSale = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        date: new Date().toISOString().split('T')[0],
        productName: p.title,
        customerName: customer,
        phone: phone,
        amount: p.price,
        totalRevenue: p.price,
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Sold - In Stitching'
      };

      salesLedger.unshift(newSale);
      try {
        localStorage.setItem('aiman_sales', JSON.stringify(salesLedger));
      } catch (e) {}

      p.stockStatus = 'sold-out';
      try {
        localStorage.setItem('aiman_products', JSON.stringify(products));
      } catch (e) {}

      // Persist directly to Firebase Firestore
      ensureFirestore(async (db) => {
        try {
          await db.collection('sales').doc(newSale.id).set(newSale);
          await db.collection('products').doc(String(p.id)).update({
            stockStatus: 'sold-out',
            isSoldOut: true,
            inStock: false,
            updatedAt: new Date().toISOString()
          });
          console.log('⚡ [Firebase] Quick sold and status synced to Firestore');
        } catch (err) {
          console.warn('Firestore product sold note:', err);
        }
      });

      renderProducts();
      renderAdminProducts();

      alert(`🎉 Sale added to Ledger! Total atelier revenue updated.`);
      updateSalesDashboard();
      window.AimanStore.switchAdminTab('sales');
    },

    deleteSale: async function (index) {
      const item = salesLedger[index];
      if (!item) return;

      if (confirm(`Delete sale record for "${item.productName}" (Rs. ${Number(item.amount).toLocaleString()})?`)) {
        const saleId = String(item.id);
        salesLedger.splice(index, 1);
        try {
          localStorage.setItem('aiman_sales', JSON.stringify(salesLedger));
        } catch (e) {}

        updateSalesDashboard();

        // Delete from Firestore Real-Time Cloud (instant sync across all other devices)
        ensureFirestore(async (db) => {
          if (saleId) {
            try {
              await db.collection('sales').doc(saleId).delete();
              console.log('⚡ [Firebase] Deleted sale from Firestore:', saleId);
            } catch (err) {
              console.warn('Firestore sale delete note:', err);
            }
          }
        });
      }
    },

    clearSalesHistory: async function () {
      if (confirm('Are you sure you want to clear the entire sales ledger from all devices?')) {
        salesLedger = [];
        try { localStorage.setItem('aiman_sales', JSON.stringify([])); } catch (e) {}
        updateSalesDashboard();

        // Delete all from Firestore Real-Time Cloud
        ensureFirestore(async (db) => {
          try {
            const snap = await db.collection('sales').get();
            const batch = db.batch();
            snap.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            console.log('⚡ [Firebase] All sales records deleted from Firestore');
          } catch (err) {
            console.warn('Firestore clear sales note:', err);
          }
        });
      }
    },

    exportSalesCSV: function () {
      if (salesLedger.length === 0) {
        alert('No sales data to export.');
        return;
      }
      let csv = 'Order ID,Date,Product,Customer,Phone,Amount (PKR),Payment Method,Status\n';
      salesLedger.forEach(s => {
        csv += `"${s.id}","${s.date}","${s.productName.replace(/"/g, '""')}","${s.customerName.replace(/"/g, '""')}","${s.phone}","${s.amount}","${s.paymentMethod}","${s.status}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `aiman_sales_ledger_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // Laptop & Mobile Camera Image File Upload (Auto-compressed for mobile phones)
    handleProductImageUpload: async function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const nameLabel = document.getElementById('prodUploadFileName');
      if (nameLabel) nameLabel.textContent = file.name;

      const preview = document.getElementById('prodImagePreview');
      const wrap = document.getElementById('prodImagePreviewWrap');
      const input = document.getElementById('prodImageInput');
      const status = document.getElementById('prodUploadStatus');

      if (wrap) wrap.style.display = 'flex';
      if (status) status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing mobile camera image...';

      try {
        const compressedBase64 = await compressImageFile(file, 1000, 0.78);

        if (preview) preview.src = compressedBase64;
        if (input) input.value = compressedBase64;
        if (status) status.innerHTML = `<i class="fas fa-circle-check" style="color:#0f766e;"></i> Photo ready to save live`;
      } catch (err) {
        console.error('Image compression error:', err);
        if (status) status.innerHTML = `<span style="color:#dc2626;">Error loading photo: ${err.message}</span>`;
      }
    },

    // Laptop / Mobile Gallery Image Upload (Angles 2, 3, 4)
    handleGalleryImageUpload: async function (e, slotNum) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const preview = document.getElementById(`galPreview${slotNum}`);
      const wrap = document.getElementById(`galPreviewWrap${slotNum}`);
      const input = document.getElementById(`galInput${slotNum}`);

      try {
        const compressedBase64 = await compressImageFile(file, 900, 0.78);

        if (preview) preview.src = compressedBase64;
        if (wrap) wrap.style.display = 'block';
        if (input) input.value = compressedBase64;
      } catch (err) {
        console.error('Gallery image error:', err);
      }
    },

    previewGallerySlot: function (slotNum) {
      const input = document.getElementById(`galInput${slotNum}`);
      const preview = document.getElementById(`galPreview${slotNum}`);
      const wrap = document.getElementById(`galPreviewWrap${slotNum}`);
      if (input && preview && wrap) {
        const val = input.value.trim();
        if (val) {
          preview.src = val;
          wrap.style.display = 'block';
        } else {
          wrap.style.display = 'none';
        }
      }
    },

    removeGallerySlot: function (slotNum) {
      const input = document.getElementById(`galInput${slotNum}`);
      const preview = document.getElementById(`galPreview${slotNum}`);
      const wrap = document.getElementById(`galPreviewWrap${slotNum}`);
      const fileInput = document.getElementById(`galFileInput${slotNum}`);
      if (input) input.value = '';
      if (preview) preview.src = '';
      if (wrap) wrap.style.display = 'none';
      if (fileInput) fileInput.value = '';
    },

    // Product Management (Syncs to MongoDB Atlas Cloud & local disk)
    saveProduct: async function (e) {
      e.preventDefault();
      const btn = document.getElementById('btnSubmitProduct');
      const origBtnText = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving to Cloud & Catalog...';
      }

      try {
        const editId = document.getElementById('editProductId').value;
        const title = document.getElementById('prodTitleInput').value.trim();
        const category = document.getElementById('prodCategorySelect').value;
        const stockStatus = document.getElementById('prodStockStatusSelect') ? document.getElementById('prodStockStatusSelect').value : 'in-stock';
        const price = Number(document.getElementById('prodPriceInput').value);
        const regPrice = Number(document.getElementById('prodRegPriceInput').value) || (price * 1.5);
        const discount = Number(document.getElementById('prodDiscountInput').value) || Math.round(((regPrice - price) / regPrice) * 100);
        const image = document.getElementById('prodImageInput').value.trim();
        if (!image) {
          alert('Baraye meharbani product ki picture upload karein ya image URL paste karein.');
          return;
        }
        const gal1 = document.getElementById('galInput1') ? document.getElementById('galInput1').value.trim() : '';
        const gal2 = document.getElementById('galInput2') ? document.getElementById('galInput2').value.trim() : '';
        const gal3 = document.getElementById('galInput3') ? document.getElementById('galInput3').value.trim() : '';
        const gallery = [gal1, gal2, gal3].filter(Boolean);

        let productPayload = null;

        if (editId) {
          const item = products.find(x => String(x.id) === String(editId));
          if (item) {
            item.title = title;
            item.name = title;
            item.category = category;
            item.stockStatus = stockStatus;
            item.price = price;
            item.regularPrice = regPrice;
            item.discount = discount;
            item.image = image;
            item.gallery = gallery;
            productPayload = { ...item };
          }
        } else {
          const newProduct = {
            id: 'prod-' + Date.now(),
            title: title,
            name: title,
            category: category,
            stockStatus: stockStatus,
            price: price,
            regularPrice: regPrice,
            discount: discount,
            image: image,
            gallery: gallery,
            isNew: true,
            isSale: true,
            bestSeller: false
          };
          products.unshift(newProduct);
          productPayload = newProduct;
        }

        try {
          localStorage.setItem('aiman_products', JSON.stringify(products));
        } catch (storageErr) {
          console.warn('localStorage quota warning:', storageErr);
        }

        // Instant Real-Time Cloud Sync to Firebase Firestore (syncs all phones & laptops live)
        if (productPayload) {
          ensureFirestore(async (db) => {
            try {
              const docId = String(productPayload.id);
              await db.collection('products').doc(docId).set({
                id: docId,
                name: productPayload.title,
                title: productPayload.title,
                category: productPayload.category,
                price: Number(productPayload.price) || 0,
                originalPrice: Number(productPayload.regularPrice) || (Number(productPayload.price) * 1.5),
                regularPrice: Number(productPayload.regularPrice) || (Number(productPayload.price) * 1.5),
                discount: Number(productPayload.discount) || 0,
                image: productPayload.image || '',
                gallery: productPayload.gallery || [],
                isSoldOut: productPayload.stockStatus === 'sold-out',
                isBooked: productPayload.stockStatus === 'booked',
                inStock: productPayload.stockStatus === 'in-stock',
                stockStatus: productPayload.stockStatus,
                isNewArrival: Boolean(productPayload.isNew),
                onSale: Boolean(productPayload.isSale),
                isFeatured: Boolean(productPayload.bestSeller),
                updatedAt: new Date().toISOString()
              }, { merge: true });
              console.log('⚡ [Firebase] Product synced to Firestore:', docId);
            } catch (fsErr) {
              console.warn('Firestore set error:', fsErr);
            }
          });
        }

        window.AimanStore.resetProductForm();
        renderProducts();
        renderAdminProducts();
        updateSalesDashboard();

        alert(editId ? '✅ Product updated successfully on all devices!' : '🎉 New product added successfully! Amma ke mobile aur laptop sab par live ho gaya.');
      } catch (err) {
        console.error('Save product error:', err);
        alert('Product save karte waqt masla: ' + err.message);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = origBtnText;
        }
      }
    },

    editProduct: function (id) {
      const p = products.find(x => String(x.id) === String(id));
      if (!p) return;

      document.getElementById('editProductId').value = p.id;
      document.getElementById('prodTitleInput').value = p.title;
      document.getElementById('prodCategorySelect').value = p.category;
      if (document.getElementById('prodStockStatusSelect')) {
        document.getElementById('prodStockStatusSelect').value = p.stockStatus || 'in-stock';
      }
      document.getElementById('prodPriceInput').value = p.price;
      document.getElementById('prodRegPriceInput').value = p.regularPrice || '';
      document.getElementById('prodDiscountInput').value = p.discount || '';
      document.getElementById('prodImageInput').value = p.image;

      const preview = document.getElementById('prodImagePreview');
      const wrap = document.getElementById('prodImagePreviewWrap');
      if (preview && wrap && p.image) {
        preview.src = p.image;
        wrap.style.display = 'flex';
      }

      // Populate Extra Gallery Slots
      const gal = Array.isArray(p.gallery) ? p.gallery : (Array.isArray(p.images) ? p.images.slice(1) : []);
      [1, 2, 3].forEach(slotNum => {
        const imgVal = gal[slotNum - 1] || '';
        const input = document.getElementById(`galInput${slotNum}`);
        const prev = document.getElementById(`galPreview${slotNum}`);
        const w = document.getElementById(`galPreviewWrap${slotNum}`);
        if (input) input.value = imgVal;
        if (prev && w) {
          if (imgVal) {
            prev.src = imgVal;
            w.style.display = 'block';
          } else {
            w.style.display = 'none';
          }
        }
      });

      document.getElementById('productFormTitle').innerHTML = `<i class="fas fa-pen"></i> Edit Product: ${p.title}`;
      document.getElementById('btnSubmitProduct').innerHTML = `<i class="fas fa-check"></i> Update Product`;
      document.getElementById('btnResetProductForm').style.display = 'inline-flex';

      document.getElementById('prodTitleInput').focus();
    },

    resetProductForm: function () {
      document.getElementById('editProductId').value = '';
      document.getElementById('prodTitleInput').value = '';
      if (document.getElementById('prodStockStatusSelect')) {
        document.getElementById('prodStockStatusSelect').value = 'in-stock';
      }
      document.getElementById('prodPriceInput').value = '';
      document.getElementById('prodRegPriceInput').value = '';
      document.getElementById('prodDiscountInput').value = '';
      document.getElementById('prodImageInput').value = '';
      const wrap = document.getElementById('prodImagePreviewWrap');
      if (wrap) wrap.style.display = 'none';
      const fileLabel = document.getElementById('prodUploadFileName');
      if (fileLabel) fileLabel.textContent = 'No file selected';
      const fileInput = document.getElementById('prodFileInput');
      if (fileInput) fileInput.value = '';

      // Reset Extra Gallery Slots
      [1, 2, 3].forEach(slotNum => {
        const input = document.getElementById(`galInput${slotNum}`);
        const prev = document.getElementById(`galPreview${slotNum}`);
        const w = document.getElementById(`galPreviewWrap${slotNum}`);
        const fileIn = document.getElementById(`galFileInput${slotNum}`);
        if (input) input.value = '';
        if (prev) prev.src = '';
        if (w) w.style.display = 'none';
        if (fileIn) fileIn.value = '';
      });

      document.getElementById('productFormTitle').innerHTML = `<i class="fas fa-plus"></i> Add New Product to Website`;
      document.getElementById('btnSubmitProduct').innerHTML = `<i class="fas fa-floppy-disk"></i> Save Product to Catalog`;
      document.getElementById('btnResetProductForm').style.display = 'none';
    },

    deleteProduct: async function (id) {
      if (confirm('Are you sure you want to delete this product from the website?')) {
        products = products.filter(x => String(x.id) !== String(id));
        try {
          localStorage.setItem('aiman_products', JSON.stringify(products));
        } catch (e) {}

        renderProducts();
        renderAdminProducts();
        updateSalesDashboard();

        // Delete from Firestore Real-Time Cloud (syncs all connected devices)
        ensureFirestore(async (db) => {
          try {
            await db.collection('products').doc(String(id)).delete();
            console.log('⚡ [Firebase] Deleted from Firestore:', id);
          } catch (err) {
            console.warn('Firestore delete note:', err.message);
          }
        });
      }
    },

    // Hero Slider & Announcement Management
    updateSlidePreview: function (idx, url) {
      const preview = document.getElementById(`adminSlidePreview_${idx}`);
      if (preview && url) {
        preview.src = url;
      }
    },

    setSlidePreset: function (idx, desktopUrl, mobileUrl, title) {
      const dInput = document.getElementById(`slideDesktop_${idx}`);
      const mInput = document.getElementById(`slideMobile_${idx}`);
      const tInput = document.getElementById(`slideTitle_${idx}`);
      const hTitle = document.getElementById(`adminSlideHeaderTitle_${idx}`);
      const preview = document.getElementById(`adminSlidePreview_${idx}`);

      if (dInput) dInput.value = desktopUrl;
      if (mInput) mInput.value = mobileUrl || desktopUrl;
      if (tInput && title) tInput.value = title;
      if (hTitle && title) hTitle.textContent = title;
      if (preview) preview.src = desktopUrl;
    },

    handleSlideFileUpload: async function (idx, e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const nameLabel = document.getElementById(`slideFileName_${idx}`);
      if (nameLabel) nameLabel.innerHTML = `<i class="fas fa-spinner fa-spin" style="color:#0f766e;"></i> Compressing & Cloud Uploading...`;

      const dInput = document.getElementById(`slideDesktop_${idx}`);
      const mInput = document.getElementById(`slideMobile_${idx}`);
      const preview = document.getElementById(`adminSlidePreview_${idx}`);

      try {
        // High quality yet lightweight compression: 1200px max width, 0.72 quality (~45-70KB)
        const compressedBase64 = await compressImageFile(file, 1200, 0.72);

        if (dInput) dInput.value = compressedBase64;
        if (mInput) mInput.value = compressedBase64;
        if (preview) {
          if (preview.tagName === 'IMG') {
            preview.src = compressedBase64;
          } else {
            preview.outerHTML = `<img id="adminSlidePreview_${idx}" src="${compressedBase64}" alt="Slide ${idx + 1} Preview">`;
          }
        }

        // Auto-save immediately to Firestore so it NEVER gets lost on refresh!
        const currentSlides = [...getActiveBannerSlides()];
        if (currentSlides && currentSlides[idx]) {
          const slide = currentSlides[idx];
          slide.id = slide.id || ('slide-' + (idx + 1));
          slide.desktopImg = compressedBase64;
          slide.mobileImg = compressedBase64;
          slide.order = idx;

          heroSettings = heroSettings || {};
          heroSettings.bannerSlides = currentSlides;
          try { localStorage.setItem('aiman_hero_settings', JSON.stringify(heroSettings)); } catch (e) {}

          ensureFirestore((db) => {
            // 1. Save to dedicated hero_slides collection doc (never hits 1MB document limit)
            db.collection('hero_slides').doc(slide.id).set({
              id: slide.id,
              title: slide.title || `Slide ${idx + 1}`,
              desktopImg: compressedBase64,
              mobileImg: compressedBase64,
              category: slide.category || 'all',
              order: idx,
              updatedAt: new Date().toISOString()
            }, { merge: true })
              .then(() => {
                console.log(`⚡ [Firebase] Hero slide ${slide.id} uploaded live to Firestore`);
                if (nameLabel) nameLabel.innerHTML = `<i class="fas fa-circle-check" style="color:#10b981;"></i> Cloud Synced: ${file.name}`;
              })
              .catch(err => {
                console.warn('Firestore hero_slides save error:', err);
                if (nameLabel) nameLabel.innerHTML = `<i class="fas fa-circle-exclamation" style="color:#ef4444;"></i> Save note: ${err.message}`;
              });

            // 2. Also mirror to settings/hero doc
            db.collection('settings').doc('hero').set({ bannerSlides: currentSlides }, { merge: true })
              .catch(e => console.warn('settings/hero sync note:', e));
          });

          renderHeroSlider();
        }
      } catch (err) {
        console.error('Slide upload error:', err);
        if (nameLabel) nameLabel.innerHTML = `<i class="fas fa-circle-exclamation" style="color:#ef4444;"></i> Upload failed`;
      }
    },

    addNewHeroBanner: function () {
      const currentSlides = [...getActiveBannerSlides()];
      const newId = 'slide-' + Date.now();
      const newSlide = {
        id: newId,
        title: 'New Bohra Couture Showcase',
        desktopImg: '',
        mobileImg: '',
        category: 'all',
        order: currentSlides.length
      };
      currentSlides.push(newSlide);

      heroSettings = heroSettings || {};
      heroSettings.bannerSlides = currentSlides;
      try { localStorage.setItem('aiman_hero_settings', JSON.stringify(heroSettings)); } catch (e) {}

      ensureFirestore((db) => {
        db.collection('hero_slides').doc(newId).set(newSlide)
          .then(() => console.log(`⚡ [Firebase] New hero slide ${newId} created in Firestore`))
          .catch(err => console.warn('Firestore hero banner add note:', err));
        db.collection('settings').doc('hero').set({ bannerSlides: currentSlides }, { merge: true })
          .catch(() => {});
      });

      renderAdminHeroSlides();
      renderHeroSlider();
      startHeroSlider();
      alert('✨ Naya slide add ho gaya! Aap iski image, title, aur category abhi upload/set kar sakte hain.');
    },

    deleteHeroBanner: function (idx) {
      const currentSlides = [...getActiveBannerSlides()];
      if (currentSlides.length <= 1) {
        alert('Kam se kam 1 hero banner slide website par hona lazmi hai.');
        return;
      }
      if (confirm(`Slide ${idx + 1} ko delete karna chahte hain?`)) {
        const deletedSlide = currentSlides.splice(idx, 1)[0];
        heroSettings = heroSettings || {};
        heroSettings.bannerSlides = currentSlides;
        try { localStorage.setItem('aiman_hero_settings', JSON.stringify(heroSettings)); } catch (e) {}

        ensureFirestore((db) => {
          if (deletedSlide && deletedSlide.id) {
            db.collection('hero_slides').doc(deletedSlide.id).delete()
              .then(() => console.log(`⚡ [Firebase] Hero slide ${deletedSlide.id} deleted from Firestore`))
              .catch(err => console.warn('Firestore hero banner delete note:', err));
          }
          db.collection('settings').doc('hero').set({ bannerSlides: currentSlides }, { merge: true })
            .catch(() => {});
        });

        currentSlideIndex = 0;
        renderAdminHeroSlides();
        renderHeroSlider();
        startHeroSlider();
      }
    },

    saveHeroBanners: function (e) {
      e.preventDefault();
      const currentSlides = getActiveBannerSlides();
      const newSlides = [];

      for (let i = 0; i < currentSlides.length; i++) {
        const titleEl = document.getElementById(`slideTitle_${i}`);
        const dEl = document.getElementById(`slideDesktop_${i}`);
        const mEl = document.getElementById(`slideMobile_${i}`);
        const cEl = document.getElementById(`slideCategory_${i}`);

        const id = currentSlides[i].id || ('slide-' + (i + 1));
        const title = titleEl ? titleEl.value.trim() : `Slide ${i + 1}`;
        const desktopImg = dEl ? dEl.value.trim() : '';
        const mobileImg = (mEl && mEl.value.trim()) ? mEl.value.trim() : desktopImg;
        const category = cEl ? cEl.value : 'all';

        newSlides.push({
          id,
          title,
          desktopImg,
          mobileImg,
          category,
          order: i,
          updatedAt: new Date().toISOString()
        });
      }

      heroSettings = heroSettings || {};
      heroSettings.bannerSlides = newSlides;
      try { localStorage.setItem('aiman_hero_settings', JSON.stringify(heroSettings)); } catch (e) {}

      // Save directly to Firebase Firestore
      ensureFirestore((db) => {
        newSlides.forEach(s => {
          db.collection('hero_slides').doc(s.id).set(s, { merge: true })
            .catch(err => console.warn(`Slide ${s.id} save note:`, err));
        });
        db.collection('settings').doc('hero').set({ bannerSlides: newSlides }, { merge: true })
          .then(() => console.log('⚡ [Firebase] Hero banners saved to Firestore'))
          .catch(err => console.warn('Firestore hero banners save note:', err));
      });

      currentSlideIndex = 0;
      renderHeroSlider();
      startHeroSlider();
      renderAdminHeroSlides();

      alert('🎉 Hero Banners saved & published live successfully on website!');
    },

    resetHeroBannersToDefault: function () {
      if (confirm('Hero Banners ko initial clean atelier banner par reset karein?')) {
        heroSettings = heroSettings || {};
        heroSettings.bannerSlides = [...defaultBannerSlides];
        try { localStorage.setItem('aiman_hero_settings', JSON.stringify(heroSettings)); } catch (e) {}

        ensureFirestore((db) => {
          db.collection('hero_slides').get().then(snap => {
            snap.forEach(d => d.ref.delete());
            db.collection('hero_slides').doc('slide-1').set(defaultBannerSlides[0]);
          }).catch(() => {});
          db.collection('settings').doc('hero').set({ bannerSlides: defaultBannerSlides }, { merge: true })
            .catch(err => console.warn('Firestore reset hero banners note:', err));
        });

        currentSlideIndex = 0;
        renderHeroSlider();
        startHeroSlider();
        renderAdminHeroSlides();

        alert('✅ Hero Banners reset to clean atelier template.');
      }
    },

    saveAnnouncement: function (e) {
      e.preventDefault();
      const text = document.getElementById('announcementTextInput').value.trim();
      heroSettings = heroSettings || {};
      heroSettings.announcement = text;
      try { localStorage.setItem('aiman_hero_settings', JSON.stringify(heroSettings)); } catch (e) {}

      const marquee = document.getElementById('marqueeTrack');
      if (marquee) {
        marquee.innerHTML = `<div class="marquee-item">${text}</div>`.repeat(5);
      }
      const badge = document.getElementById('announcementLiveBadge');
      if (badge) badge.textContent = text;

      // Save directly to Firebase Firestore
      ensureFirestore((db) => {
        db.collection('settings').doc('hero').set({ announcement: text }, { merge: true })
          .then(() => console.log('⚡ [Firebase] Announcement saved to Firestore'))
          .catch(err => console.warn('Firestore announcement save note:', err));
      });

      alert('✅ Top Red Announcement Bar updated live!');
    },

    // Shop By Category — Moving Cards Pictures Management
    handleCategoryCardUpload: async function (idx, e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const nameLabel = document.getElementById(`catCardFileName_${idx}`);
      if (nameLabel) nameLabel.textContent = file.name;

      try {
        const compressedBase64 = await compressImageFile(file, 900, 0.78);
        const preview = document.getElementById(`catCardPreview_${idx}`);
        const input = document.getElementById(`catCardImgInput_${idx}`);
        if (preview) preview.src = compressedBase64;
        if (input) input.value = compressedBase64;

        // Auto-save immediately to Firestore so it NEVER gets lost if user refreshes!
        const currentCards = (categoryCards && categoryCards.length > 0) ? categoryCards : defaultCategoryCards;
        if (currentCards && currentCards[idx]) {
          currentCards[idx].image = compressedBase64;
          categoryCards = currentCards;
          try { localStorage.setItem('aiman_category_cards', JSON.stringify(categoryCards)); } catch (e) {}
          ensureFirestore((db) => {
            db.collection('settings').doc('category_cards').set({ cards: currentCards }, { merge: true })
              .then(() => console.log(`⚡ [Firebase] Category card ${idx + 1} picture auto-saved live to Firestore`))
              .catch(err => console.warn('Firestore cat card auto-save note:', err));
          });
          renderCategoryCards();
        }
      } catch (err) {
        alert('Error reading image: ' + err.message);
      }
    },

    previewCategoryCard: function (idx) {
      const input = document.getElementById(`catCardImgInput_${idx}`);
      const preview = document.getElementById(`catCardPreview_${idx}`);
      if (input && preview) {
        const val = input.value.trim();
        if (val) preview.src = val;
      }
    },

    saveCategoryCards: function (e) {
      if (e) e.preventDefault();
      const currentCards = (categoryCards && categoryCards.length > 0) ? categoryCards : defaultCategoryCards;
      const updated = currentCards.map((c, idx) => {
        const input = document.getElementById(`catCardImgInput_${idx}`);
        return {
          ...c,
          image: (input && input.value.trim()) ? input.value.trim() : c.image
        };
      });

      categoryCards = updated;
      try {
        localStorage.setItem('aiman_category_cards', JSON.stringify(categoryCards));
      } catch (storageErr) {
        console.warn('localStorage quota note:', storageErr);
      }

      // Save directly to Firebase Firestore
      ensureFirestore((db) => {
        db.collection('settings').doc('category_cards').set({ cards: updated }, { merge: true })
          .then(() => console.log('⚡ [Firebase] Category cards saved to Firestore'))
          .catch(err => console.warn('Firestore category cards save note:', err));
      });

      renderCategoryCards();
      renderAdminCategoryCards();
      alert('🎉 Shop By Category ki pictures kamyabi se update aur publish ho gayin!');
    },

    resetCategoryCardsToDefault: function () {
      if (confirm('Shop By Category ki pictures ko default par reset karna chahte hain?')) {
        categoryCards = JSON.parse(JSON.stringify(defaultCategoryCards));
        try {
          localStorage.setItem('aiman_category_cards', JSON.stringify(categoryCards));
        } catch (e) {}

        ensureFirestore((db) => {
          db.collection('settings').doc('category_cards').set({ cards: defaultCategoryCards }, { merge: true })
            .catch(err => console.warn('Firestore reset category cards note:', err));
        });

        renderCategoryCards();
        renderAdminCategoryCards();
        alert('✅ Category pictures default par reset ho gayin.');
      }
    },

    nextSlide: function () {
      const slides = getActiveBannerSlides();
      if (slides.length <= 1) return;
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSliderDisplay();
    },

    prevSlide: function () {
      const slides = getActiveBannerSlides();
      if (slides.length <= 1) return;
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSliderDisplay();
    },

    goToSlide: function (idx) {
      const slides = getActiveBannerSlides();
      if (slides.length === 0) return;
      currentSlideIndex = Number(idx) % slides.length;
      updateSliderDisplay();
      startHeroSlider();
    },

    syncCloudNow: async function () {
      const badge = document.getElementById('adminCloudSyncBadge');
      if (badge) badge.innerHTML = `<i class="fas fa-spinner fa-spin" style="color:#eab308;"></i> Cloud Syncing...`;
      try {
        const db = getDb();
        if (!db) {
          if (badge) badge.innerHTML = `<i class="fas fa-circle-exclamation" style="color:#ef4444;"></i> Cloud connecting...`;
          setupFirestoreRealtimeSync();
          return;
        }

        // 1. Fetch products
        const pSnap = await db.collection('products').get();
        const firestoreList = [];
        pSnap.forEach(doc => {
          const d = doc.data();
          if (d && (d.title || d.name)) {
            firestoreList.push({
              id: d.id || doc.id,
              title: d.title || d.name || 'Bohra Libas Ensemble',
              name: d.title || d.name || 'Bohra Libas Ensemble',
              category: normalizeCategory(d.category),
              price: Number(d.price) || 0,
              regularPrice: Number(d.regularPrice || d.originalPrice) || 0,
              discount: Number(d.discount) || 0,
              image: d.image || FALLBACK_PRODUCT_IMAGE,
              imageStyle: d.imageStyle || '',
              gallery: Array.isArray(d.gallery) ? d.gallery : (Array.isArray(d.galleryImages) ? d.galleryImages : []),
              stockStatus: d.stockStatus || (d.isSoldOut ? 'sold-out' : (d.isBooked ? 'booked' : 'in-stock')),
              isNew: Boolean(d.isNew ?? d.isNewArrival),
              isSale: Boolean(d.isSale ?? d.onSale),
              bestSeller: Boolean(d.bestSeller ?? d.isFeatured)
            });
          }
        });
        if (firestoreList.length > 0) {
          products = firestoreList;
          try { localStorage.setItem('aiman_products', JSON.stringify(products)); } catch (e) {}
          renderProducts();
          renderAdminProducts();
        }

        // 2. Fetch sales
        const sSnap = await db.collection('sales').get();
        const fsSales = [];
        sSnap.forEach(doc => {
          const s = doc.data();
          if (s) {
            fsSales.push({
              id: s.id || doc.id,
              date: s.date || new Date().toISOString().split('T')[0],
              productName: s.productName || 'Bohra Rida',
              customerName: s.customerName || 'Customer',
              phone: s.customerPhone || s.phone || '',
              amount: Number(s.totalRevenue ?? s.amount ?? s.sellingPrice) || 0,
              paymentMethod: s.paymentMethod || 'Cash on Delivery (COD)',
              status: s.status || 'Delivered'
            });
          }
        });
        fsSales.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        salesLedger = fsSales;
        try { localStorage.setItem('aiman_sales', JSON.stringify(salesLedger)); } catch (e) {}
        updateSalesDashboard();

        // 3. Category cards
        const catDoc = await db.collection('settings').doc('category_cards').get();
        if (catDoc && catDoc.exists) {
          const cd = catDoc.data();
          if (cd && Array.isArray(cd.cards) && cd.cards.length > 0) {
            categoryCards = cd.cards;
            try { localStorage.setItem('aiman_category_cards', JSON.stringify(categoryCards)); } catch (e) {}
            renderCategoryCards();
            renderAdminCategoryCards();
          }
        }

        // 4. Hero slides & settings
        const slidesSnap = await db.collection('hero_slides').get();
        if (!slidesSnap.empty) {
          const fsSlides = [];
          slidesSnap.forEach(d => {
            const s = d.data();
            if (s) {
              fsSlides.push({
                id: s.id || d.id,
                title: s.title || 'Aiman Collection',
                desktopImg: (s.desktopImg && s.desktopImg.startsWith('images/') && !s.desktopImg.startsWith('images/uploads')) ? '' : (s.desktopImg || ''),
                mobileImg: (s.mobileImg && s.mobileImg.startsWith('images/') && !s.mobileImg.startsWith('images/uploads')) ? '' : (s.mobileImg || ''),
                category: s.category || 'all',
                order: (typeof s.order === 'number') ? s.order : 999
              });
            }
          });
          if (fsSlides.length > 0) {
            fsSlides.sort((a, b) => a.order - b.order);
            heroSettings = heroSettings || {};
            heroSettings.bannerSlides = fsSlides;
          }
        }

        const heroDoc = await db.collection('settings').doc('hero').get();
        if (heroDoc && heroDoc.exists) {
          const hd = heroDoc.data();
          if (hd) {
            heroSettings = heroSettings || {};
            if ((!heroSettings.bannerSlides || heroSettings.bannerSlides.length === 0) && Array.isArray(hd.bannerSlides) && hd.bannerSlides.length > 0) {
              heroSettings.bannerSlides = hd.bannerSlides;
            }
            if (hd.announcement) heroSettings.announcement = hd.announcement;
            try { localStorage.setItem('aiman_hero_settings', JSON.stringify(heroSettings)); } catch (e) {}
            applyHeroSettings();
            renderAdminHeroSlides();
          }
        }

        if (badge) {
          badge.innerHTML = `<i class="fas fa-circle-check" style="color:#10b981;"></i> Cloud Synced (${products.length} items, ${salesLedger.length} sales)`;
        }
      } catch (err) {
        console.warn('Manual syncCloudNow error:', err);
        if (badge) badge.innerHTML = `<i class="fas fa-circle-exclamation" style="color:#ef4444;"></i> Cloud Sync Retry`;
      }
    }
  };

  // Keyboard and hover controls
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      window.AimanStore.closeSearchModal();
      window.AimanStore.closeQuickView();
      window.AimanStore.closeAdminSuite();
      window.AimanStore.closeCartDrawer();
      window.AimanStore.closeReviewModal();
      const zoom = document.getElementById('imageZoomModal');
      if (zoom) zoom.style.display = 'none';
    }
  });

  // URL Hash & History Routing for Product Detail Page
  window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#product-')) {
      const id = hash.replace('#product-', '');
      window.AimanStore.openProductPage(id, false);
    } else {
      window.AimanStore.closeProductPage(false);
    }
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#product-')) {
      const id = hash.replace('#product-', '');
      window.AimanStore.openProductPage(id, false);
    } else if (!hash || hash === '#' || hash === '#catalog') {
      window.AimanStore.closeProductPage(false);
    }
  });

  const catMarquee = document.getElementById('categoryMarqueeContainer');
  if (catMarquee) {
    let isDown = false;
    let startX;
    let scrollLeft;

    catMarquee.addEventListener('mousedown', e => {
      isDown = true;
      catMarquee.classList.add('active');
      startX = e.pageX - catMarquee.offsetLeft;
      scrollLeft = catMarquee.scrollLeft;
    });

    catMarquee.addEventListener('mouseleave', () => {
      isDown = false;
    });

    catMarquee.addEventListener('mouseup', () => {
      isDown = false;
    });

    catMarquee.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - catMarquee.offsetLeft;
      const walk = (x - startX) * 1.6;
      catMarquee.scrollLeft = scrollLeft - walk;
    });
  }

  /* --------------------------------------------------------------------------
     FIREBASE FIRESTORE REAL-TIME SYNCHRONIZATION (SINGLE SOURCE OF TRUTH)
     Live listeners: Real-time update across all devices without page refresh!
     -------------------------------------------------------------------------- */
  let unsubscribeFirestore = null;
  function setupFirestoreRealtimeSync() {
    ensureFirestore(db => {
      // Detach previous listeners if already attached to prevent duplicates
      if (typeof unsubscribeFirestore === 'function') {
        try { unsubscribeFirestore(); } catch (e) {}
      }

      const unsubs = [];

      try {
        // 1. Real-time Products Listener (Pure Source of Truth)
        const unsubProd = db.collection('products').onSnapshot(snapshot => {
          if (!snapshot) return;
          const firestoreList = [];
          snapshot.forEach(doc => {
            const d = doc.data();
            if (d && (d.title || d.name)) {
              firestoreList.push({
                id: d.id || doc.id,
                title: d.title || d.name || 'Bohra Libas Ensemble',
                name: d.title || d.name || 'Bohra Libas Ensemble',
                category: normalizeCategory(d.category),
                price: Number(d.price) || 0,
                regularPrice: Number(d.regularPrice || d.originalPrice) || 0,
                discount: Number(d.discount) || 0,
                image: d.image || FALLBACK_PRODUCT_IMAGE,
                imageStyle: d.imageStyle || '',
                gallery: Array.isArray(d.gallery) ? d.gallery : (Array.isArray(d.galleryImages) ? d.galleryImages : []),
                stockStatus: d.stockStatus || (d.isSoldOut ? 'sold-out' : (d.isBooked ? 'booked' : 'in-stock')),
                isNew: Boolean(d.isNew ?? d.isNewArrival),
                isSale: Boolean(d.isSale ?? d.onSale),
                bestSeller: Boolean(d.bestSeller ?? d.isFeatured)
              });
            }
          });

          // Firestore is the single source of truth - replace directly, never merge deleted/old items!
          products = firestoreList;
          try {
            localStorage.setItem('aiman_products', JSON.stringify(products));
          } catch (storageErr) {}

          renderProducts();
          renderAdminProducts();
          updateSalesDashboard();
          console.log(`⚡ [Real-Time Sync] ${firestoreList.length} products synced live from Firebase Firestore`);
        }, err => {
          console.warn('Firestore products onSnapshot notice:', err.message);
        });
        unsubs.push(unsubProd);

        // 2. Real-time Category Cards Listener
        const unsubCats = db.collection('settings').doc('category_cards').onSnapshot(doc => {
          if (doc && doc.exists) {
            const data = doc.data();
            if (data && Array.isArray(data.cards) && data.cards.length > 0) {
              categoryCards = data.cards;
              try {
                localStorage.setItem('aiman_category_cards', JSON.stringify(categoryCards));
              } catch (e) {}
              renderCategoryCards();
              renderAdminCategoryCards();
              console.log('⚡ [Real-Time Sync] Category cards updated from Firestore');
            }
          }
        }, err => console.warn('Firestore category_cards notice:', err.message));
        unsubs.push(unsubCats);

        // 3a. Real-time Hero Slides Collection Listener (Dedicated Collection - Instant Sync)
        const unsubHeroSlides = db.collection('hero_slides').onSnapshot(snapshot => {
          if (!snapshot || snapshot.empty) return;
          const fsSlides = [];
          snapshot.forEach(doc => {
            const s = doc.data();
            if (s) {
              fsSlides.push({
                id: s.id || doc.id,
                title: s.title || 'Aiman Collection',
                desktopImg: (s.desktopImg && s.desktopImg.startsWith('images/') && !s.desktopImg.startsWith('images/uploads')) ? '' : (s.desktopImg || ''),
                mobileImg: (s.mobileImg && s.mobileImg.startsWith('images/') && !s.mobileImg.startsWith('images/uploads')) ? '' : (s.mobileImg || ''),
                category: s.category || 'all',
                order: (typeof s.order === 'number') ? s.order : 999
              });
            }
          });

          if (fsSlides.length > 0) {
            fsSlides.sort((a, b) => a.order - b.order);
            heroSettings = heroSettings || {};
            heroSettings.bannerSlides = fsSlides;
            try {
              localStorage.setItem('aiman_hero_settings', JSON.stringify(heroSettings));
            } catch (e) {}
            renderHeroSlider();
            renderAdminHeroSlides();
            console.log(`⚡ [Real-Time Sync] ${fsSlides.length} hero slides updated live from Firestore`);
          }
        }, err => console.warn('Firestore hero_slides notice:', err.message));
        unsubs.push(unsubHeroSlides);

        // 3b. Real-time Hero Settings Listener (Announcement Bar & fallback)
        const unsubHero = db.collection('settings').doc('hero').onSnapshot(doc => {
          if (doc && doc.exists) {
            const data = doc.data();
            if (data) {
              heroSettings = heroSettings || {};
              let updated = false;
              if (data.announcement && data.announcement !== heroSettings.announcement) {
                heroSettings.announcement = data.announcement;
                updated = true;
              }
              if ((!heroSettings.bannerSlides || heroSettings.bannerSlides.length === 0) && Array.isArray(data.bannerSlides) && data.bannerSlides.length > 0) {
                heroSettings.bannerSlides = data.bannerSlides.map(s => ({
                  ...s,
                  desktopImg: (s.desktopImg && s.desktopImg.startsWith('images/') && !s.desktopImg.startsWith('images/uploads')) ? '' : (s.desktopImg || ''),
                  mobileImg: (s.mobileImg && s.mobileImg.startsWith('images/') && !s.mobileImg.startsWith('images/uploads')) ? '' : (s.mobileImg || '')
                }));
                updated = true;
              }
              if (updated) {
                try {
                  localStorage.setItem('aiman_hero_settings', JSON.stringify(heroSettings));
                } catch (e) {}
                applyHeroSettings();
                renderAdminHeroSlides();
                console.log('⚡ [Real-Time Sync] Hero announcement updated from Firestore');
              }
            }
          }
        }, err => console.warn('Firestore hero notice:', err.message));
        unsubs.push(unsubHero);

        // 4. Real-time Sales Ledger Listener (Exact Reflection: Syncs deletes everywhere!)
        const unsubSales = db.collection('sales').onSnapshot(snapshot => {
          if (!snapshot) return;
          const fsSales = [];
          snapshot.forEach(doc => {
            const s = doc.data();
            if (s) {
              fsSales.push({
                id: s.id || doc.id,
                date: s.date || new Date().toISOString().split('T')[0],
                productName: s.productName || 'Bohra Rida',
                customerName: s.customerName || 'Customer',
                phone: s.customerPhone || s.phone || '',
                amount: Number(s.totalRevenue ?? s.amount ?? s.sellingPrice) || 0,
                paymentMethod: s.paymentMethod || 'Cash on Delivery (COD)',
                status: s.status || 'Delivered'
              });
            }
          });

          // Sort latest first
          fsSales.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

          // Exact cloud sync: whether 10 items or 0 items (when deleted), sync cleanly!
          salesLedger = fsSales;
          try {
            localStorage.setItem('aiman_sales', JSON.stringify(salesLedger));
          } catch (e) {}
          updateSalesDashboard();
          console.log(`⚡ [Real-Time Sync] ${fsSales.length} sales synced live from Firebase Firestore`);
        }, err => console.warn('Firestore sales notice:', err.message));
        unsubs.push(unsubSales);

        // 5. Real-time Customer Reviews Listener
        const unsubReviews = db.collection('reviews').onSnapshot(snapshot => {
          if (!snapshot) return;
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data && Array.isArray(data.reviews)) {
              productReviews[doc.id] = data.reviews;
            }
          });
          try {
            localStorage.setItem('aiman_reviews', JSON.stringify(productReviews));
          } catch (e) {}
        }, err => console.warn('Firestore reviews notice:', err.message));
        unsubs.push(unsubReviews);

        unsubscribeFirestore = () => {
          unsubs.forEach(fn => { try { if (typeof fn === 'function') fn(); } catch (e) {} });
        };

        const syncBadge = document.getElementById('adminCloudSyncBadge');
        if (syncBadge) {
          syncBadge.innerHTML = `<i class="fas fa-circle-check" style="color:#10b981;"></i> Cloud Sync: Live Connected`;
        }

      } catch (e) {
        console.warn('setupFirestoreRealtimeSync error:', e);
      }
    });
  }

  // Strict Zero Horizontal Drift Lock for Mobile
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  function lockZeroHorizontalScroll() {
    if (window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY);
    }
    if (document.documentElement.scrollLeft !== 0) {
      document.documentElement.scrollLeft = 0;
    }
    if (document.body && document.body.scrollLeft !== 0) {
      document.body.scrollLeft = 0;
    }
  }
  window.addEventListener('scroll', lockZeroHorizontalScroll, { passive: true });
  window.addEventListener('resize', lockZeroHorizontalScroll);
  window.addEventListener('orientationchange', lockZeroHorizontalScroll);

  // Initial Boot — guaranteed to run even if DOMContentLoaded already fired
  function initStore() {
    lockZeroHorizontalScroll();
    applyHeroSettings();
    renderCategoryCards();
    renderProducts();
    updateHeaderCartBadge();
    startHeroSlider();
    setupFirestoreRealtimeSync();

    // Auto-sync across devices whenever user tabs back or focuses browser
    window.addEventListener('focus', () => {
      setupFirestoreRealtimeSync();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        setupFirestoreRealtimeSync();
      }
    });

    // Check URL routing on load
    const initHash = window.location.hash;
    if (initHash && initHash.startsWith('#product-')) {
      const id = initHash.replace('#product-', '');
      window.AimanStore.openProductPage(id, false);
    }

    const sliderEl = document.getElementById('mainHeroSlider');
    if (sliderEl) {
      sliderEl.addEventListener('mouseenter', stopHeroSlider);
      sliderEl.addEventListener('mouseleave', startHeroSlider);

      let touchStartX = 0;
      sliderEl.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        stopHeroSlider();
      }, { passive: true });

      sliderEl.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) window.AimanStore.nextSlide();
          else window.AimanStore.prevSlide();
        }
        startHeroSlider();
      }, { passive: true });
    }

    setTimeout(lockZeroHorizontalScroll, 50);
    setTimeout(lockZeroHorizontalScroll, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStore);
  } else {
    initStore();
  }

})();
