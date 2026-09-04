/**
 * AIMAN COLLECTION — LUXURY HAUTE COUTURE, RIDAS & ACCOUNTING SUITE
 * Client-Side Engine with Firebase Cloud Sync, Chart.js Analytics, Payments & WhatsApp AI
 * Sourced & Enhanced from Netlify Live Database (https://frabjous-bubblegum-e30f7d.netlify.app/)
 */

import { apiEngine } from './apps/api/src/api.js';

(function () {
  'use strict';

  /* ==========================================================================
     1. GLOBAL APPLICATION STATE & ENGINE CONNECTION
     ========================================================================== */
  let WHATSAPP_NUMBER = '923452439196';

  const AppState = {
    currency: 'PKR',
    currencyRates: {
      PKR: { symbol: 'Rs. ', rate: 1, label: 'PKR (₨)' },
      USD: { symbol: '$', rate: 0.0036, label: 'USD ($)' },
      AED: { symbol: 'AED ', rate: 0.0132, label: 'AED (د.إ)' },
      GBP: { symbol: '£', rate: 0.0028, label: 'GBP (£)' },
      SAR: { symbol: 'SAR ', rate: 0.0135, label: 'SAR (﷼)' }
    },
    cart: [],
    wishlist: [],
    appliedCoupon: null,
    discountPercent: 0,
    selectedPaymentMethod: 'STRIPE_CARD',
    uploadedReceiptBase64: null,
    uploadedReviewPhotos: [],
    currentReviewRating: 5,
    lastCreatedOrder: null,
    reviewFilter: 'all',
    activeProductCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    salesChartInstance: null,
    activeChartPeriod: 'daily',
    chatHistory: [
      {
        sender: 'ai',
        text: 'Assalam-o-Alaikum! ✨ Welcome to Aiman Collection — Exclusive Dawoodi Bohra Libas, Ridas & Accessories. Main aapki 24/7 AI Bohra Fashion Stylist hoon. Pardi drape, Ghagra flair, custom stitching ya matching batwa ke baare mein aap kya dekhna pasand karengi?',
        time: 'Just now'
      }
    ]
  };

  /* Initialize Local Storage for Cart & Wishlist */
  function loadLocalState() {
    try {
      const savedCart = localStorage.getItem('aiman_cart_v2');
      if (savedCart) AppState.cart = JSON.parse(savedCart);
      const savedWishlist = localStorage.getItem('aiman_wishlist_v2');
      if (savedWishlist) AppState.wishlist = JSON.parse(savedWishlist);
      const savedCurrency = localStorage.getItem('aiman_currency_v2');
      if (savedCurrency && AppState.currencyRates[savedCurrency]) AppState.currency = savedCurrency;

      const savedHero = localStorage.getItem('aiman_hero_image');
      if (savedHero) {
        const heroImg = document.getElementById('heroVisualImg') || document.getElementById('hero-img');
        if (heroImg) heroImg.src = savedHero;
        const bannerInp = document.getElementById('admin_hero_img') || document.getElementById('heroBannerUrlInput');
        if (bannerInp) bannerInp.value = savedHero;
      }
    } catch (e) {
      console.warn('Could not load local cart/wishlist:', e);
    }
  }

  function saveLocalState() {
    try {
      localStorage.setItem('aiman_cart_v2', JSON.stringify(AppState.cart));
      localStorage.setItem('aiman_wishlist_v2', JSON.stringify(AppState.wishlist));
      localStorage.setItem('aiman_currency_v2', AppState.currency);
    } catch (e) {
      console.warn('Could not save local state:', e);
    }
  }

  /* Format Price in Active Currency */
  function formatPrice(amountInPKR) {
    const curr = AppState.currencyRates[AppState.currency] || AppState.currencyRates.PKR;
    const converted = amountInPKR * curr.rate;
    if (AppState.currency === 'PKR') {
      return curr.symbol + Math.round(converted).toLocaleString();
    }
    return curr.symbol + converted.toFixed(2);
  }

  /* ==========================================================================
     2. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(message, type = 'info', duration = 3800) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fas fa-info-circle';
    if (type === 'success') icon = 'fas fa-check-circle';
    if (type === 'error' || type === 'danger') icon = 'fas fa-exclamation-circle';
    if (type === 'whatsapp') icon = 'fab fa-whatsapp';

    toast.innerHTML = `
      <i class="${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ==========================================================================
     3. PRODUCT CATALOG RENDERING & FILTERING
     ========================================================================== */
  function renderProductsCatalog() {
    const grid = document.getElementById('productGrid') || document.getElementById('productsGrid') || document.getElementById('product-grid');
    if (!grid) return;

    let products = apiEngine.getProducts({
      category: AppState.activeProductCategory,
      search: AppState.searchQuery
    });

    // Sorting
    if (AppState.sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (AppState.sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (AppState.sortBy === 'rating') {
      products.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4.5rem 1.5rem; background: var(--color-bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--color-border-subtle); margin: 2rem 0;">
          <i class="fas fa-sparkles text-gold" style="font-size: 2.8rem; margin-bottom: 1.2rem; display: block;"></i>
          <h3 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.8rem; margin-bottom: 0.6rem;">New Collection Coming Soon</h3>
          <p style="color: var(--color-text-muted); max-width: 540px; margin: 0 auto 1.8rem auto; line-height: 1.6;">Our artisans are curating exclusive Dawoodi Bohra Haute Couture Ridas, bespoke matching batwas, and luxury vanity pouches.</p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="https://wa.me/923452439196?text=Hello%20Aiman%20Collection!%20I%20would%20like%20to%20inquire%20about%20custom%20rida%20stitching%20and%20catalogue." target="_blank" class="btn btn-whatsapp btn-lg">
              <i class="fab fa-whatsapp"></i> Inquire on WhatsApp
            </a>
            <button class="btn btn-secondary btn-lg" onclick="window.AimanStore.openAdminLoginModal()">
              <i class="fas fa-plus-circle text-gold"></i> Merchant Portal / Add Products
            </button>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(prod => {
      const inWishlist = AppState.wishlist.includes(prod.id);
      
      // Calculate display price and badges for Booked, Sold Out and Sale options
      const activePrice = (prod.onSale && prod.salePrice) ? prod.salePrice : prod.price;
      const displayOriginalPrice = (prod.onSale && prod.salePrice) ? prod.price : prod.originalPrice;

      const isNew = Boolean(prod.isNewArrival) || prod.badgeClass === 'new' || (prod.badge && prod.badge.toLowerCase().includes('new'));
      const isSoldOut = Boolean(prod.isSoldOut) || prod.status === 'soldout' || (prod.stockQuantity !== undefined && prod.stockQuantity <= 0 && !prod.isBooked);
      const isBooked = !isSoldOut && (Boolean(prod.isBooked) || prod.status === 'booked');

      let badgeTag = '';
      let imgWrapClass = 'product-image-wrap';
      let actionsHTML = '';

      if (isSoldOut) {
        badgeTag = `<span class="product-badge badge-soldout"><i class="fas fa-ban"></i> SOLD OUT</span>`;
        imgWrapClass = 'product-image-wrap soldout-overlay';
        actionsHTML = `
          <div class="product-card-actions">
            <button class="btn btn-secondary btn-sm btn-soldout" style="width: 100%; font-weight:700;" onclick="window.AimanStore.orderOnWhatsAppDirect('${prod.id}', 'Inquiry for Sold Out item (Custom Order / Restock Request)')">
              <i class="fab fa-whatsapp"></i> SOLD OUT (Inquire Restock)
            </button>
          </div>
        `;
      } else if (isBooked) {
        badgeTag = `<span class="product-badge badge-booked"><i class="fas fa-lock"></i> BOOKED</span>`;
        imgWrapClass = 'product-image-wrap booked-overlay';
        actionsHTML = `
          <div class="product-card-actions">
            <button class="btn btn-secondary btn-sm btn-booked" style="width: 100%; font-weight:700;" onclick="window.AimanStore.orderOnWhatsAppDirect('${prod.id}', 'Inquiry for Booked Piece')">
              <i class="fas fa-bookmark text-gold"></i> BOOKED (Inquire Piece)
            </button>
          </div>
        `;
      } else {
        if (prod.onSale) {
          const pct = (prod.salePrice && prod.price) ? Math.round((1 - prod.salePrice / prod.price) * 100) : 20;
          badgeTag = `<span class="product-badge badge-sale">${escapeHtml(prod.saleTag || ('SALE -' + pct + '%'))}</span>`;
        } else if (isNew) {
          badgeTag = `<span class="product-badge badge-new"><i class="fas fa-sparkles"></i> ${escapeHtml(prod.badge || 'NEW ARRIVAL')}</span>`;
        } else if (prod.badge) {
          badgeTag = `<span class="product-badge badge-${prod.badgeClass || 'bestseller'}">${escapeHtml(prod.badge)}</span>`;
        } else if (displayOriginalPrice && displayOriginalPrice > activePrice) {
          const pct = Math.round((1 - activePrice / displayOriginalPrice) * 100);
          badgeTag = `<span class="product-badge badge-sale">-${pct}%</span>`;
        }

        actionsHTML = `
          <div class="product-card-actions">
            <button class="btn btn-primary btn-sm" onclick="window.AimanStore.addToCart('${prod.id}')">
              <i class="fas fa-shopping-bag"></i> Add to Bag
            </button>
            <button class="btn btn-whatsapp btn-sm" onclick="window.AimanStore.orderOnWhatsAppDirect('${prod.id}')" title="1-Click WhatsApp Order">
              <i class="fab fa-whatsapp"></i> Buy Now
            </button>
          </div>
        `;
      }

      return `
        <article class="product-card" data-category="${prod.category}" data-product-id="${prod.id}">
          <div class="${imgWrapClass}">
            ${badgeTag}
            <img src="${prod.image}" alt="${escapeHtml(prod.name)}" loading="lazy" class="product-img">
            
            <div class="product-overlay-actions">
              <button class="action-circle-btn ${inWishlist ? 'active' : ''}" onclick="window.AimanStore.toggleWishlist('${prod.id}')" title="Save to Wishlist">
                <i class="${inWishlist ? 'fas' : 'far'} fa-heart text-gold"></i>
              </button>
              <button class="action-circle-btn" onclick="window.AimanStore.openQuickView('${prod.id}')" title="Quick View">
                <i class="fas fa-eye text-gold"></i>
              </button>
            </div>
          </div>

          <div class="product-info">
            <span class="product-category-tag">${prod.category.toUpperCase()} &bull; ${prod.fabric ? prod.fabric.split(' ')[0] : 'LUXURY'}</span>
            <h3 class="product-title" onclick="window.AimanStore.openQuickView('${prod.id}')">${escapeHtml(prod.name)}</h3>

            <div class="product-price-row">
              <span class="price-current ${prod.onSale ? 'sale-price-highlight' : ''}">${formatPrice(activePrice)}</span>
              ${(prod.onSale && prod.salePrice && prod.price) ? `<span class="price-original price-strikethrough">${formatPrice(prod.price)}</span>` : ''}
            </div>

            ${actionsHTML}
          </div>
        </article>
      `;
    }).join('');
  }

  function setCategory(cat) {
    AppState.activeProductCategory = cat;
    document.querySelectorAll('.category-chip, .filter-btn, .filter-pills button, .ribbon-item').forEach(btn => {
      const bCat = btn.getAttribute('data-category') || btn.getAttribute('data-cat');
      btn.classList.toggle('active', bCat === cat);
    });
    renderProductsCatalog();
    const catSection = document.getElementById('catalog') || document.getElementById('shop');
    if (catSection) {
      catSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function setSortBy(sortBy) {
    AppState.sortBy = sortBy;
    renderProductsCatalog();
  }

  function setSort(sortBy) {
    setSortBy(sortBy);
  }

  /* ==========================================================================
     4. SHOPPING BAG & WISHLIST LOGIC
     ========================================================================== */
  function addToCart(productId, size = 'Standard', customProduct = null) {
    const product = customProduct || apiEngine.getProductById(productId);
    if (!product) return;

    const existingIndex = AppState.cart.findIndex(item => item.id === productId && item.size === size);
    if (existingIndex > -1) {
      AppState.cart[existingIndex].quantity += 1;
    } else {
      AppState.cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: (product.onSale && product.salePrice) ? product.salePrice : product.price,
        size: size || (product.sizes ? product.sizes[0] : 'Standard'),
        quantity: 1
      });
    }

    saveLocalState();
    updateCartUI();
    showToast(`✨ Added "${product.name}" to your shopping bag!`, 'success');
    openCart();
  }

  function updateCartQuantity(index, delta) {
    if (!AppState.cart[index]) return;
    AppState.cart[index].quantity += delta;
    if (AppState.cart[index].quantity <= 0) {
      AppState.cart.splice(index, 1);
    }
    saveLocalState();
    updateCartUI();
  }

  function removeFromCart(index) {
    if (!AppState.cart[index]) return;
    const item = AppState.cart[index];
    AppState.cart.splice(index, 1);
    saveLocalState();
    updateCartUI();
    showToast(`Removed "${item.name}" from bag.`, 'info');
  }

  function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const totalCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);

    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    const mobBadge = document.getElementById('mobileCartBadge');
    if (mobBadge) {
      mobBadge.textContent = totalCount;
      mobBadge.style.display = totalCount > 0 ? 'inline-block' : 'none';
    }

    const itemsContainer = document.getElementById('cartItemsList');
    if (!itemsContainer) return;

    if (AppState.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <i class="fas fa-shopping-bag" style="font-size: 3.5rem; color: var(--color-gold-primary); opacity: 0.3; margin-bottom: 1rem;"></i>
          <h4 style="color: var(--color-gold-light);">Your Bag is Empty</h4>
          <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-top: 0.5rem;">Explore our ridas, bags and accessories to fill your bag.</p>
        </div>
      `;
      if (document.getElementById('cartSubtotal')) document.getElementById('cartSubtotal').textContent = formatPrice(0);
      if (document.getElementById('cartTotal')) document.getElementById('cartTotal').textContent = formatPrice(0);
      const darazTotalEl = document.getElementById('darazCartTotalLabel') || document.getElementById('darazCartTotal');
      if (darazTotalEl) darazTotalEl.textContent = formatPrice(0);
      return;
    }

    let subtotal = 0;
    itemsContainer.innerHTML = AppState.cart.map((item, idx) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      return `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span class="cart-item-size">Size: ${item.size}</span>
            <div class="cart-item-price-row">
              <span class="cart-price">${formatPrice(item.price)}</span>
              <div class="quantity-controller">
                <button onclick="window.AimanStore.updateCartQuantity(${idx}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="window.AimanStore.updateCartQuantity(${idx}, 1)">+</button>
              </div>
            </div>
          </div>
          <button class="cart-item-remove" onclick="window.AimanStore.removeFromCart(${idx})" title="Remove item">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
    }).join('');

    const discountAmount = (subtotal * AppState.discountPercent) / 100;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    if (document.getElementById('cartSubtotal')) document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
    if (document.getElementById('cartTotal')) document.getElementById('cartTotal').textContent = formatPrice(finalTotal);
    const darazTotalEl = document.getElementById('darazCartTotalLabel') || document.getElementById('darazCartTotal');
    if (darazTotalEl) darazTotalEl.textContent = formatPrice(finalTotal);

    // Free delivery progress (over Rs. 4,000)
    const threshold = 4000;
    const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
    const fill = document.getElementById('shippingProgressFill');
    const text = document.getElementById('freeShippingText');
    if (fill) fill.style.width = progress + '%';
    if (text) {
      if (subtotal >= threshold) {
        text.innerHTML = `<span>🎉 <strong>Congratulations!</strong> You qualified for FREE Nationwide Delivery</span>`;
      } else {
        text.innerHTML = `<span>Add <strong>${formatPrice(threshold - subtotal)}</strong> more for FREE Delivery</span>`;
      }
    }
  }

  function toggleWishlist(productId) {
    const idx = AppState.wishlist.indexOf(productId);
    const product = apiEngine.getProductById(productId);
    if (idx > -1) {
      AppState.wishlist.splice(idx, 1);
      showToast(`Removed from Wishlist.`, 'info');
    } else {
      AppState.wishlist.push(productId);
      showToast(`❤️ Saved "${product ? product.name : 'Item'}" to Wishlist!`, 'success');
    }
    saveLocalState();
    updateWishlistUI();
    renderProductsCatalog();
  }

  function updateWishlistUI() {
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
      badge.textContent = AppState.wishlist.length;
      badge.style.display = AppState.wishlist.length > 0 ? 'flex' : 'none';
    }

    const mobBadge = document.getElementById('mobileWishlistBadge');
    if (mobBadge) {
      mobBadge.textContent = AppState.wishlist.length;
      mobBadge.style.display = AppState.wishlist.length > 0 ? 'inline-block' : 'none';
    }

    const container = document.getElementById('wishlistItemsList');
    if (!container) return;

    if (AppState.wishlist.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <i class="far fa-heart" style="font-size: 3.5rem; color: var(--color-gold-primary); opacity: 0.3; margin-bottom: 1rem;"></i>
          <h4 style="color: var(--color-gold-light);">No Saved Outfits</h4>
          <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-top: 0.5rem;">Click the heart icon on any outfit to save it for later.</p>
        </div>
      `;
      return;
    }

    const wishlistProducts = AppState.wishlist.map(id => apiEngine.getProductById(id)).filter(Boolean);
    container.innerHTML = wishlistProducts.map(prod => `
      <div class="cart-item-row">
        <img src="${prod.image}" alt="${prod.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4>${prod.name}</h4>
          <span class="cart-price">${formatPrice(prod.price)}</span>
          <div style="margin-top: 0.5rem;">
            <button class="btn btn-primary btn-sm" onclick="window.AimanStore.addToCart('${prod.id}')">
              <i class="fas fa-shopping-bag"></i> Move to Bag
            </button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="window.AimanStore.toggleWishlist('${prod.id}')" title="Remove">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }

  function applyPromoCode() {
    const input = document.getElementById('cartPromoInput');
    if (!input) return;
    const code = input.value.trim().toUpperCase();

    if (code === 'AIMAN25' || code === 'EID25') {
      AppState.appliedCoupon = code;
      AppState.discountPercent = 25;
      showToast('✨ Promo Code AIMAN25 Applied! 25% Discount Added.', 'success');
      updateCartUI();
    } else if (code === 'VIP10') {
      AppState.appliedCoupon = code;
      AppState.discountPercent = 10;
      showToast('✨ VIP10 Applied! 10% Discount Added.', 'success');
      updateCartUI();
    } else {
      showToast('Invalid or expired promo code.', 'error');
    }
  }

  /* Drawers Helpers */
  function openCart() {
    closeDrawers();
    document.getElementById('cartDrawer')?.classList.add('active');
    document.getElementById('drawerBackdrop')?.classList.add('active');
  }

  function closeCart() {
    document.getElementById('cartDrawer')?.classList.remove('active');
    document.getElementById('drawerBackdrop')?.classList.remove('active');
  }

  function openWishlist() {
    closeDrawers();
    document.getElementById('wishlistDrawer')?.classList.add('active');
    document.getElementById('drawerBackdrop')?.classList.add('active');
  }

  function closeWishlist() {
    document.getElementById('wishlistDrawer')?.classList.remove('active');
    document.getElementById('drawerBackdrop')?.classList.remove('active');
  }

  function closeDrawers() {
    document.getElementById('cartDrawer')?.classList.remove('active');
    document.getElementById('wishlistDrawer')?.classList.remove('active');
    document.getElementById('drawerBackdrop')?.classList.remove('active');
  }

  function openModal(modalId) {
    if (!modalId) return;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
      modal.classList.add('show');
    }
  }

  function closeModal(modalId) {
    if (!modalId) return;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  /* ==========================================================================
     5. MULTI-GATEWAY SECURE CHECKOUT
     ========================================================================== */
  function openCheckoutModal() {
    if (AppState.cart.length === 0) {
      showToast('Your shopping bag is empty! Add items first.', 'error');
      return;
    }
    closeDrawers();

    let subtotal = AppState.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    let discount = (subtotal * AppState.discountPercent) / 100;
    let total = Math.max(0, subtotal - discount);

    const totalEl = document.getElementById('checkoutTotalAmount');
    if (totalEl) totalEl.textContent = formatPrice(total);

    document.getElementById('checkoutModal')?.classList.add('active');
  }

  function selectPaymentTab(tabKey, btn) {
    document.querySelectorAll('.payment-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.payment-method-panel').forEach(p => p.classList.remove('active'));

    if (btn) btn.classList.add('active');
    const panel = document.getElementById(`payPanel_${tabKey}`);
    if (panel) panel.classList.add('active');

    const methodMap = {
      stripe: 'STRIPE_CARD',
      jazzcash: 'JAZZCASH',
      easypaisa: 'EASYPAISA',
      bank: 'BANK_TRANSFER',
      cod: 'CASH_ON_DELIVERY'
    };
    AppState.selectedPaymentMethod = methodMap[tabKey] || 'STRIPE_CARD';
  }

  function updateCardPreview() {
    const name = document.getElementById('card_name_input')?.value || 'YOUR NAME';
    const number = document.getElementById('card_number_input')?.value || '•••• •••• •••• ••••';
    const month = document.getElementById('card_month_input')?.value || 'MM';
    const year = document.getElementById('card_year_input')?.value || 'YY';

    const cardHolderEl = document.getElementById('cardHolderDisplay');
    const cardNumEl = document.getElementById('cardNumDisplay');
    const cardExpEl = document.getElementById('cardExpDisplay');
    const cardBrandEl = document.getElementById('cardBrandLogo');

    if (cardHolderEl) cardHolderEl.textContent = name.toUpperCase();
    if (cardNumEl) cardNumEl.textContent = number || '•••• •••• •••• ••••';
    if (cardExpEl) cardExpEl.textContent = `${month}/${year}`;

    if (cardBrandEl) {
      if (number.startsWith('4')) {
        cardBrandEl.textContent = 'VISA';
      } else if (number.startsWith('5')) {
        cardBrandEl.textContent = 'MASTERCARD';
      } else {
        cardBrandEl.textContent = 'PREMIER';
      }
    }
  }

  function handleReceiptUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      AppState.uploadedReceiptBase64 = e.target.result;
      const previewBox = document.getElementById('receiptPreviewContainer');
      if (previewBox) {
        previewBox.innerHTML = `
          <div class="receipt-preview-box">
            <img src="${e.target.result}" alt="Receipt Preview" class="receipt-preview-img">
            <button type="button" class="receipt-remove-btn" onclick="window.AimanStore.removeReceiptUpload(event)">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
      }
      showToast('Payment receipt slip attached successfully.', 'success');
    };
    reader.readAsDataURL(file);
  }

  function removeReceiptUpload(event) {
    if (event) event.stopPropagation();
    AppState.uploadedReceiptBase64 = null;
    const previewBox = document.getElementById('receiptPreviewContainer');
    if (previewBox) previewBox.innerHTML = '';
    const fileInput = document.getElementById('receiptFileInput');
    if (fileInput) fileInput.value = '';
  }

  async function processSecureCheckout(event) {
    event.preventDefault();
    const btn = document.getElementById('btnSubmitPayment');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing Secure Payment...`;
    }

    const name = document.getElementById('chk_name').value.trim();
    const phone = document.getElementById('chk_phone').value.trim();
    const email = document.getElementById('chk_email').value.trim();
    const city = document.getElementById('chk_city').value;
    const address = document.getElementById('chk_address').value.trim();

    let subtotal = AppState.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    let discount = (subtotal * AppState.discountPercent) / 100;
    let total = Math.max(0, subtotal - discount);

    try {
      let gatewayResult = { success: true };
      if (AppState.selectedPaymentMethod === 'STRIPE_CARD') {
        const cardNum = document.getElementById('card_number_input').value.trim();
        const cardHolder = document.getElementById('card_name_input').value.trim() || name;
        const month = document.getElementById('card_month_input').value.trim();
        const year = document.getElementById('card_year_input').value.trim();
        const cvc = document.getElementById('card_cvc_input').value.trim();

        gatewayResult = await apiEngine.processStripeCardPayment({
          orderId: 'pending',
          amount: total,
          currency: AppState.currency,
          cardHolder,
          cardNumber: cardNum || '4242424242424242',
          expMonth: month || '12',
          expYear: year || '28',
          cvc: cvc || '123'
        });
      } else if (AppState.selectedPaymentMethod === 'JAZZCASH') {
        const mob = document.getElementById('jazzcash_mobile')?.value || phone;
        gatewayResult = await apiEngine.processJazzCashPayment({
          orderId: 'pending',
          amount: total,
          mobileNumber: mob
        });
      } else if (AppState.selectedPaymentMethod === 'EASYPAISA') {
        const mob = document.getElementById('easypaisa_mobile')?.value || phone;
        gatewayResult = await apiEngine.processEasyPaisaPayment({
          orderId: 'pending',
          amount: total,
          mobileNumber: mob
        });
      } else if (AppState.selectedPaymentMethod === 'BANK_TRANSFER') {
        const ref = document.getElementById('bank_ref_input')?.value;
        gatewayResult = await apiEngine.processBankTransferPayment({
          orderId: 'pending',
          amount: total,
          senderName: name,
          receiptDataUrl: AppState.uploadedReceiptBase64,
          referenceNumber: ref
        });
      }

      if (!gatewayResult.success) {
        showToast(gatewayResult.error || 'Payment authorization failed.', 'error');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<i class="fas fa-shield-alt"></i> Complete Order & Authorize Payment`;
        }
        return;
      }

      // Create official order in API Engine
      const orderPayload = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        city,
        country: 'Pakistan',
        currency: AppState.currency,
        subtotal,
        discount,
        shippingFee: 0,
        total,
        paymentMethod: AppState.selectedPaymentMethod,
        courier: city.toLowerCase() === 'karachi' ? 'TCS Express (Same-Day)' : 'TCS Express Nationwide',
        paymentSlipUrl: AppState.uploadedReceiptBase64,
        items: [...AppState.cart]
      };

      const orderRes = await apiEngine.createOrder(orderPayload);
      if (orderRes.success) {
        AppState.lastCreatedOrder = orderRes.order;
        
        AppState.cart = [];
        saveLocalState();
        updateCartUI();

        closeModal('checkoutModal');

        document.getElementById('successOrderNum').textContent = orderRes.order.orderNumber;
        document.getElementById('successCourier').textContent = orderRes.order.courier;
        document.getElementById('successTracking').textContent = orderRes.order.trackingNumber;
        document.getElementById('successPayMethod').textContent = `${orderRes.order.paymentMethod.replace(/_/g, ' ')} (${orderRes.order.paymentStatus})`;

        document.getElementById('orderSuccessModal')?.classList.add('active');
        showToast(`✨ Order ${orderRes.order.orderNumber} confirmed! Receipt emailed.`, 'success');
      }

    } catch (err) {
      console.error('Checkout error:', err);
      showToast('An unexpected error occurred during checkout. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fas fa-shield-alt"></i> Complete Order & Authorize Payment`;
      }
    }
  }

  /* WhatsApp 1-Click Order Direct for Single Product */
  function orderOnWhatsAppDirect(productId) {
    const product = apiEngine.getProductById(productId);
    if (!product) return;
    const isNew = Boolean(product.isNewArrival) || product.badgeClass === 'new' || (product.badge && product.badge.toLowerCase().includes('new'));
    const dropTag = isNew ? `\n🌟 *Collection:* ✨ NEW ARRIVAL DROP` : '';
    const text = `Assalam-o-Alaikum Aiman Collection! ✨\n\nI want to place an order for:\n💎 *Item:* ${product.name}${dropTag}\n💰 *Price:* ${formatPrice(product.price)}\n🧵 *Fabric:* ${product.fabric || 'Standard Fine Fabric'}\n\nPlease confirm availability and delivery to my city.`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  }

  /* WhatsApp 1-Click Checkout for Full Cart */
  function checkoutCartOnWhatsApp() {
    if (AppState.cart.length === 0) {
      showToast('Your shopping bag is empty!', 'error');
      return;
    }

    let subtotal = AppState.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    let discount = (subtotal * AppState.discountPercent) / 100;
    let total = Math.max(0, subtotal - discount);

    let itemsText = AppState.cart.map((item, i) => `${i + 1}. *${item.name}* (Size: ${item.size}) × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`).join('\n');

    const msg = `Assalam-o-Alaikum Aiman Collection! ✨\n\nI would like to confirm my shopping bag order:\n\n${itemsText}\n\n💵 *Total Amount:* ${formatPrice(total)}\n🚚 *Delivery:* FREE Express\n\nPlease send me payment details & delivery time!`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  function confirmOrderOnWhatsAppDirect() {
    const order = AppState.lastCreatedOrder;
    if (!order) return;
    const msg = `Assalam-o-Alaikum! ✨ I just placed Order *${order.orderNumber}* on your website for *${order.customerName}*. Tracking: ${order.trackingNumber}. Please confirm receipt!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  /* ==========================================================================
     6. LUXURY HTML EMAIL PREVIEW SYSTEM
     ========================================================================== */
  function previewCurrentOrderEmail() {
    const order = AppState.lastCreatedOrder || apiEngine.orders[0];
    if (!order) {
      showToast('No order found to preview email.', 'info');
      return;
    }
    previewOrderEmailById(order.id);
  }

  function previewOrderEmailById(orderId) {
    const order = apiEngine.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return;

    const emailHTML = apiEngine.generateOrderEmailHTML(order);
    const iframe = document.getElementById('emailPreviewIframe');
    const subj = document.getElementById('emailPreviewSubject');

    if (subj) subj.textContent = `Dispatched to ${order.customerEmail} (${order.orderNumber})`;
    if (iframe) {
      iframe.srcdoc = emailHTML;
    }

    document.getElementById('emailPreviewModal')?.classList.add('active');
  }

  function printEmailReceipt() {
    const iframe = document.getElementById('emailPreviewIframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } else {
      window.print();
    }
  }

  /* ==========================================================================
     7. CUSTOMER PHOTO REVIEWS SYSTEM & LIGHTBOX
     ========================================================================== */
  function renderPhotoReviews() {
    const container = document.getElementById('customerReviewsGrid');
    if (!container) return;

    let filter = {};
    if (AppState.reviewFilter === 'photos') filter.onlyPhotos = true;
    if (AppState.reviewFilter === '5stars') filter.rating = 5;
    if (AppState.reviewFilter === 'verified') filter.onlyVerified = true;

    const reviews = apiEngine.getReviews(filter);

    const countAll = document.getElementById('countReviewsAll');
    const countPhotos = document.getElementById('countReviewsPhotos');
    if (countAll) countAll.textContent = apiEngine.reviews.length;
    if (countPhotos) countPhotos.textContent = apiEngine.reviews.filter(r => r.photos && r.photos.length > 0).length;

    if (reviews.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; background: var(--color-bg-card); border: 1px dashed var(--color-border); border-radius: var(--radius-md);">
          <i class="far fa-star text-gold" style="font-size: 2rem; margin-bottom: 0.8rem; display: block;"></i>
          <h4 style="font-family: var(--font-heading); color: var(--color-gold-light); margin-bottom: 0.4rem;">No Client Reviews Yet</h4>
          <p style="color: var(--color-text-muted); font-size: 0.88rem; max-width: 450px; margin: 0 auto 1.2rem;">Be the first to share your experience with Aiman Collection and get featured on our boutique page!</p>
          <button class="btn btn-primary btn-sm" onclick="window.AimanStore.openWriteReviewModal()">
            <i class="fas fa-camera-retro"></i> Write First Photo Review
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = reviews.map(rev => {
      const photosHTML = (rev.photos && rev.photos.length > 0) ? `
        <div class="review-photos-strip">
          ${rev.photos.map(p => `
            <div class="review-photo-thumb" onclick="window.AimanStore.openLightbox('${p}', '${escapeHtml((rev.customerName || rev.name || 'Client') + ' wearing ' + (rev.productName || 'Aiman Collection'))}')">
              <img src="${p}" alt="Review Photo" loading="lazy">
              <div class="photo-zoom-icon"><i class="fas fa-search-plus"></i></div>
            </div>
          `).join('')}
        </div>
      ` : '';

      const custName = rev.customerName || rev.name || 'Anonymous Client';
      const stars = '★'.repeat(rev.rating || 5) + '☆'.repeat(5 - (rev.rating || 5));
      const initials = custName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AC';

      return `
        <div class="photo-review-card">
          <div>
            <div class="review-card-top">
              <div class="reviewer-meta">
                <div class="reviewer-avatar">${initials}</div>
                <div class="reviewer-details">
                  <h4>${escapeHtml(custName)} ${rev.isVerifiedBuyer || rev.verified ? '<span class="verified-badge-pill"><i class="fas fa-check-circle"></i> Verified</span>' : ''}</h4>
                  <div class="review-product-tag">${escapeHtml(rev.productName || 'Haute Couture')} &bull; <span style="color:var(--color-gold-primary); font-size:0.75rem;">${rev.fitRating || rev.fit || 'True to Size'}</span></div>
                </div>
              </div>
              <div class="review-stars-gold">${stars}</div>
            </div>

            <div class="review-headline">"${escapeHtml(rev.headline || 'Exquisite quality')}"</div>
            <p class="review-body-text">${escapeHtml(rev.comment)}</p>
            ${photosHTML}
          </div>

          <div class="review-card-footer">
            <span>${rev.createdAt ? new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : (rev.date || 'Recent')}</span>
            <button class="review-like-btn" onclick="window.AimanStore.likeReview('${rev.id}')">
              <i class="far fa-heart"></i> Helpful (${rev.likesCount || 0})
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function filterReviews(filterType, btn) {
    AppState.reviewFilter = filterType;
    document.querySelectorAll('.review-filter-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderPhotoReviews();
  }

  function likeReview(reviewId) {
    apiEngine.likeReview(reviewId);
    renderPhotoReviews();
    showToast('Thank you for your feedback! 👍', 'info');
  }

  function openLightbox(imageUrl, caption = '') {
    const modal = document.getElementById('photoLightboxModal');
    const img = document.getElementById('lightboxMainImg');
    const cap = document.getElementById('lightboxCaption');
    if (img) img.src = imageUrl;
    if (cap) cap.textContent = caption;
    if (modal) modal.classList.add('active');
  }

  function closeLightbox() {
    document.getElementById('photoLightboxModal')?.classList.remove('active');
  }

  function openWriteReviewModal(productId) {
    const select = document.getElementById('rev_product_select');
    if (select) {
      select.innerHTML = apiEngine.products.map(p => `
        <option value="${p.id}" ${productId && p.id === productId ? 'selected' : ''}>${p.name} (${formatPrice(p.price)})</option>
      `).join('');
    }
    setStarRating(5);
    AppState.uploadedReviewPhotos = [];
    const previewGrid = document.getElementById('reviewPhotosPreviewGrid');
    if (previewGrid) previewGrid.innerHTML = '';
    document.getElementById('writeReviewModal')?.classList.add('active');
  }

  function setStarRating(rating) {
    AppState.currentReviewRating = rating;
    const picker = document.getElementById('starRatingPicker');
    if (!picker) return;
    const stars = picker.querySelectorAll('i');
    stars.forEach((s, idx) => {
      if (idx < rating) {
        s.className = 'fas fa-star selected';
      } else {
        s.className = 'far fa-star';
      }
    });
    const hidden = document.getElementById('rev_rating_val');
    if (hidden) hidden.value = rating;
  }

  function handleReviewPhotosUpload(input) {
    if (!input.files || input.files.length === 0) return;
    const grid = document.getElementById('reviewPhotosPreviewGrid');

    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function (e) {
        AppState.uploadedReviewPhotos.push(e.target.result);
        if (grid) {
          const wrapper = document.createElement('div');
          wrapper.className = 'uploaded-thumb-wrapper';
          wrapper.innerHTML = `
            <img src="${e.target.result}" alt="Upload Preview">
            <button type="button" class="remove-thumb-btn" onclick="this.parentElement.remove()">×</button>
          `;
          grid.appendChild(wrapper);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast('Photo attached for review!', 'success');
  }

  function submitCustomerReview(event) {
    event.preventDefault();
    const prodId = document.getElementById('rev_product_select').value;
    const product = apiEngine.getProductById(prodId);
    const name = document.getElementById('rev_name').value.trim();
    const email = document.getElementById('rev_email').value.trim();
    const headline = document.getElementById('rev_headline').value.trim();
    const fit = document.getElementById('rev_fit').value;
    const comment = document.getElementById('rev_comment').value.trim();

    const reviewRes = apiEngine.createReview({
      productId: prodId,
      productName: product ? product.name : 'Haute Couture Ensemble',
      customerName: name,
      customerEmail: email,
      rating: AppState.currentReviewRating,
      headline,
      fitRating: fit,
      comment,
      photos: AppState.uploadedReviewPhotos
    });

    if (reviewRes.success) {
      closeModal('writeReviewModal');
      renderPhotoReviews();
      renderProductsCatalog();
      showToast('✨ Thank you! Your photo review has been published.', 'success');
    }
  }

  /* ==========================================================================
     8. PRODUCT QUICK VIEW MODAL
     ========================================================================== */
  function openQuickView(productId) {
    const product = apiEngine.getProductById(productId);
    if (!product) return;

    const content = document.getElementById('quickViewContent');
    if (!content) return;

    const gallery = product.galleryImages || [product.image];

    const isSoldOut = Boolean(product.isSoldOut) || product.status === 'soldout' || (product.stockQuantity !== undefined && product.stockQuantity <= 0 && !product.isBooked);
    const isBooked = !isSoldOut && (Boolean(product.isBooked) || product.status === 'booked');

    let quickViewActions = '';
    if (isSoldOut) {
      quickViewActions = `
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          <button class="btn btn-secondary btn-lg btn-soldout" style="width: 100%; font-weight:700;" onclick="window.AimanStore.orderOnWhatsAppDirect('${product.id}', 'Inquiry for Sold Out item (Custom Order / Restock Request)'); window.AimanStore.closeModal('quickViewModal');">
            <i class="fab fa-whatsapp"></i> SOLD OUT — Order Bespoke / Custom Stitch
          </button>
        </div>
      `;
    } else if (isBooked) {
      quickViewActions = `
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          <button class="btn btn-secondary btn-lg btn-booked" style="width: 100%; font-weight:700;" onclick="window.AimanStore.orderOnWhatsAppDirect('${product.id}', 'Inquiry for Booked Piece'); window.AimanStore.closeModal('quickViewModal');">
            <i class="fas fa-bookmark text-gold"></i> BOOKED — Contact Atelier on WhatsApp
          </button>
        </div>
      `;
    } else {
      quickViewActions = `
        <div style="display: flex; gap: 0.8rem;">
          <button class="btn btn-primary btn-lg" style="flex: 1;" onclick="window.AimanStore.addToCart('${product.id}', document.getElementById('qv_size_select').value); window.AimanStore.closeModal('quickViewModal');">
            <i class="fas fa-shopping-bag"></i> Add to Bag
          </button>
          <button class="btn btn-whatsapp btn-lg" onclick="window.AimanStore.orderOnWhatsAppDirect('${product.id}')">
            <i class="fab fa-whatsapp"></i> Buy on WhatsApp
          </button>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="quickview-layout">
        <div class="quickview-gallery">
          <div class="quickview-main-image">
            <img id="qvMainImg" src="${product.image}" alt="${product.name}">
          </div>
          <div class="quickview-thumbs">
            ${gallery.map((img, idx) => `
              <div class="quickview-thumb ${idx === 0 ? 'active' : ''}" onclick="document.getElementById('qvMainImg').src='${img}'; document.querySelectorAll('.quickview-thumb').forEach(t=>t.classList.remove('active')); this.classList.add('active');">
                <img src="${img}" alt="Thumbnail">
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.4rem;">
            <span class="section-tag" style="margin-bottom: 0;">${product.category.toUpperCase()}</span>
            ${isSoldOut ? `<span class="badge-tag" style="position: static; background: #7F1D1D; color: #FEE2E2; font-weight: 700; padding: 0.25rem 0.65rem; font-size: 0.7rem; border: 1px solid #DC2626;"><i class="fas fa-ban"></i> SOLD OUT</span>` : ''}
            ${isBooked ? `<span class="badge-tag" style="position: static; background: #C5A880; color: #0B0D11; font-weight: 700; padding: 0.25rem 0.65rem; font-size: 0.7rem;"><i class="fas fa-lock"></i> BOOKED</span>` : ''}
            ${(!isSoldOut && !isBooked && (product.isNewArrival || product.badgeClass === 'new' || (product.badge && product.badge.toLowerCase().includes('new')))) ? 
              `<span class="badge-tag new" style="position: static; padding: 0.25rem 0.65rem; font-size: 0.7rem;"><i class="fas fa-sparkles"></i> NEW ARRIVAL</span>` : ''}
            ${(!isSoldOut && !isBooked && product.onSale) ? `<span class="badge-tag sale" style="position: static; padding: 0.25rem 0.65rem; font-size: 0.7rem;">ON SALE</span>` : ''}
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--color-gold-light); margin: 0.4rem 0;">${product.name}</h2>
          
          <div class="product-rating" style="margin-bottom: 0.8rem;">
            <span class="stars" style="color: #FFC107;">★★★★★</span>
            <span style="font-size: 0.82rem; color: var(--color-text-muted);">(${product.reviewsCount || 12} Verified Client Reviews)</span>
          </div>

          <div style="font-size: 1.4rem; font-weight: 700; color: var(--color-gold-primary); margin-bottom: 1rem;">
            ${formatPrice(product.price)}
            ${product.originalPrice ? `<span style="font-size: 0.95rem; text-decoration: line-through; color: var(--color-text-muted); margin-left: 0.5rem;">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>

          <p style="font-size: 0.88rem; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 1.2rem;">
            ${product.description}
          </p>

          <div style="font-size: 0.82rem; color: var(--color-gold-light); margin-bottom: 1.2rem; background: rgba(197,168,128,0.1); padding: 0.6rem 0.8rem; border-radius: var(--radius-sm);">
            <strong>Fabric:</strong> ${product.fabric || 'Pure Silk Velvet with Zardozi Work'}
          </div>

          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label style="font-size: 0.82rem; color: var(--color-text-muted);">Select Size</label>
            <select id="qv_size_select">
              ${(product.sizes || ['Standard', 'Custom Measurement']).map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>

          ${quickViewActions}

          <button class="btn btn-secondary btn-sm" style="width: 100%; margin-top: 0.8rem;" onclick="window.AimanStore.closeModal('quickViewModal'); window.AimanStore.openWriteReviewModal('${product.id}');">
            <i class="fas fa-camera-retro"></i> Write a Customer Photo Review for this Product
          </button>
        </div>
      </div>
    `;

    document.getElementById('quickViewModal')?.classList.add('active');
  }

  /* ==========================================================================
     9. WHATSAPP AI AGENT & INTENT ENGINE
     ========================================================================== */
  function toggleWhatsAppAI() {
    const chatWin = document.getElementById('whatsappChatWindow');
    const promptBubble = document.getElementById('waPromptBubble');
    if (!chatWin) return;

    if (chatWin.classList.contains('active')) {
      chatWin.classList.remove('active');
    } else {
      chatWin.classList.add('active');
      if (promptBubble) promptBubble.style.display = 'none';
      renderWhatsAppMessages();
      document.getElementById('waChatInput')?.focus();
    }
  }

  function renderWhatsAppMessages() {
    const body = document.getElementById('waChatBody');
    if (!body) return;

    body.innerHTML = AppState.chatHistory.map(msg => `
      <div class="wa-msg-row ${msg.sender === 'user' ? 'wa-msg-user' : 'wa-msg-ai'}">
        <div class="wa-bubble">
          <p>${formatWhatsAppText(msg.text)}</p>
          <span class="wa-time">${msg.time || 'Just now'}</span>
        </div>
      </div>
    `).join('');

    body.scrollTop = body.scrollHeight;
  }

  function formatWhatsAppText(txt) {
    return txt
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  function sendWhatsAppAIMessage(customText) {
    const input = document.getElementById('waChatInput');
    const text = customText || (input ? input.value.trim() : '');
    if (!text) return;

    if (input) input.value = '';

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    AppState.chatHistory.push({ sender: 'user', text, time });
    renderWhatsAppMessages();

    // AI Intent Recognition Simulator
    setTimeout(() => {
      const response = processAIIntent(text);
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      AppState.chatHistory.push({ sender: 'ai', text: response, time: aiTime });
      renderWhatsAppMessages();

      // Lead capture
      apiEngine.captureLead({
        name: 'Website Guest',
        phone: 'WhatsApp AI Chat',
        message: text,
        intentCategory: 'GENERAL'
      });
    }, 600);
  }

  function processAIIntent(query) {
    const q = query.toLowerCase();

    for (const rule of apiEngine.botRules) {
      if (rule.isActive && rule.keywords.some(k => q.includes(k.toLowerCase()))) {
        return rule.responseEnglish;
      }
    }

    if (q.includes('track') || q.includes('ac-') || q.includes('order status') || q.includes('kahan hai')) {
      const match = query.match(/ac-\d+/i);
      if (match) {
        const orderId = match[0].toUpperCase();
        const found = apiEngine.orders.find(o => o.orderNumber.toUpperCase().includes(orderId));
        if (found) {
          return `📦 *Order Found: ${found.orderNumber}*\n\n👤 *Client:* ${found.customerName}\n🚚 *Courier:* ${found.courier}\n🔖 *Tracking #:* ${found.trackingNumber}\n📍 *Status:* ${found.orderStatus}\n💵 *Total:* Rs. ${found.total.toLocaleString()}\n\nYour parcel is dispatched and scheduled for delivery within 48 hours!`;
        }
      }
      return "📦 To track your order, please provide your Order Number (e.g. *Track AC-2026-8491*) or type your phone number!";
    }

    if (q.includes('best') || q.includes('popular') || q.includes('recommend') || q.includes('collection')) {
      return "✨ Our top customer favorites are:\n1. *Emerald Garden Silk Rida* (Rs. 5,200)\n2. *Premium Suede Leather Tote* (Rs. 4,800)\n3. *Satin Dual-Deck Cosmetics Pouch* (Rs. 1,800)\n4. *Royal Velvet Embroidered Rida* (Rs. 18,500)\n\nWould you like me to add any of these to your bag or show full details?";
    }

    return "✨ Thank you for contacting Aiman Collection! Our stylists in Karachi are available to assist you with custom sizes, orders, and immediate dispatch. You can also tap below to chat directly on WhatsApp at +92-345-2439196!";
  }

  function openWhatsAppDirect() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Assalam-o-Alaikum%20Aiman%20Collection,%20I%20need%20assistance`, '_blank');
  }

  function submitCustomMeasurement(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const name = data.get('cust_name');
    const phone = data.get('cust_phone');
    const length = data.get('meas_length') || '-';
    const chest = data.get('meas_chest') || '-';
    const waist = data.get('meas_waist') || '-';
    const hips = data.get('meas_hips') || '-';
    const notes = data.get('meas_notes') || 'None';

    const msg = `Assalam-o-Alaikum! ✨ Custom Stitching Measurements for *${name}*:\n\n📱 Phone: ${phone}\n📏 Length: ${length}"\n📏 Chest/Bust: ${chest}"\n📏 Waist: ${waist}"\n📏 Hips: ${hips}"\n📝 Notes: ${notes}\n\nPlease confirm stitch timeline.`;

    closeModal('measurementModal');
    showToast('Measurements captured! Opening WhatsApp...', 'success');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  /* ==========================================================================
     10. ACCOUNTING ANALYTICS & CHART.JS ENGINE
     ========================================================================== */
  function renderSalesChart(period = 'daily', btn) {
    AppState.activeChartPeriod = period;
    document.querySelectorAll('.period-btn, #chartPeriodDaily, #chartPeriodWeekly, #chartPeriodMonthly').forEach(b => {
      b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    const canvas = document.getElementById('salesChart');
    if (!canvas || !window.Chart) return;

    const ctx = canvas.getContext('2d');
    if (AppState.salesChartInstance) {
      AppState.salesChartInstance.destroy();
    }

    const sales = apiEngine.sales;
    const labels = [];
    const revenueData = [];
    const profitData = [];

    if (period === 'daily') {
      const dayMap = {};
      sales.forEach(s => {
        const d = s.date;
        if (!dayMap[d]) dayMap[d] = { rev: 0, profit: 0 };
        dayMap[d].rev += s.sellingPrice * s.quantity;
        dayMap[d].profit += s.profit;
      });

      Object.keys(dayMap).sort().forEach(d => {
        labels.push(d.slice(5)); // MM-DD
        revenueData.push(dayMap[d].rev);
        profitData.push(dayMap[d].profit);
      });
    } else if (period === 'weekly') {
      labels.push('Week 1', 'Week 2', 'Week 3', 'Week 4');
      const revTotal = sales.reduce((sum, s) => sum + (s.sellingPrice * s.quantity), 0);
      const profTotal = sales.reduce((sum, s) => sum + s.profit, 0);
      revenueData.push(Math.round(revTotal * 0.2), Math.round(revTotal * 0.3), Math.round(revTotal * 0.25), Math.round(revTotal * 0.25));
      profitData.push(Math.round(profTotal * 0.2), Math.round(profTotal * 0.3), Math.round(profTotal * 0.25), Math.round(profTotal * 0.25));
    } else {
      labels.push('June', 'July', 'August');
      const revTotal = sales.reduce((sum, s) => sum + (s.sellingPrice * s.quantity), 0);
      const profTotal = sales.reduce((sum, s) => sum + s.profit, 0);
      revenueData.push(Math.round(revTotal * 0.28), Math.round(revTotal * 0.34), Math.round(revTotal * 0.38));
      profitData.push(Math.round(profTotal * 0.28), Math.round(profTotal * 0.34), Math.round(profTotal * 0.38));
    }

    AppState.salesChartInstance = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Revenue (Rs.)',
            data: revenueData,
            borderColor: '#C5A880',
            backgroundColor: 'rgba(197, 168, 128, 0.15)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#C5A880'
          },
          {
            label: 'Net Profit (Rs.)',
            data: profitData,
            borderColor: '#25D366',
            backgroundColor: 'rgba(37, 211, 102, 0.15)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#25D366'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#FAF9F6', font: { family: 'Plus Jakarta Sans', size: 12 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#858D9D' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#858D9D' }
          }
        }
      }
    });
  }

  /* ==========================================================================
     11. ADMIN PORTAL CONTROLLER, PIN VERIFICATION (7860) & FRONTEND EDITORS
     ========================================================================== */

  function openAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
      modal.classList.add('show');
      const pinInput = document.getElementById('adminPinInput');
      if (pinInput) {
        pinInput.value = '';
        setTimeout(() => pinInput.focus(), 150);
      }
    }
  }

  function verifyAdminLogin(event) {
    if (event && event.preventDefault) event.preventDefault();
    const pinInput = document.getElementById('adminPinInput');
    const pin = pinInput ? pinInput.value.trim() : '';
    if (pin === '7860' || pin.toLowerCase() === 'admin' || pin === 'admin123' || pin === 'aiman786') {
      closeModal('adminLoginModal');
      openAdmin();
      showToast('✅ Merchant Access Granted!', 'success');
    } else {
      showToast('❌ Incorrect Security PIN/Password! (Enter 7860 or admin123)', 'error');
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
    }
  }

  function openAdmin() {
    renderAdminMetrics();
    renderSalesChart(AppState.activeChartPeriod);
    renderAdminSales();
    renderAdminExpenses();
    renderAdminOrders();
    renderAdminProducts();
    populateLogSaleProductDropdown();
    renderAdminTransactions();
    renderAdminEmailLogs();
    renderAdminReviewsMod();
    renderAdminFaqs();
    renderAdminLeads();
    populateAdminEditorInputs();
    generateWhatsAppQR();

    document.body.classList.add('admin-open');
    document.body.style.overflow = 'hidden';

    const adminModal = document.getElementById('adminPortalModal');
    if (adminModal) {
      adminModal.style.display = 'block';
      adminModal.classList.add('active');
      adminModal.classList.add('show');
    }

    const bottomNav = document.querySelector('.mobile-bottom-nav');
    if (bottomNav) bottomNav.style.display = 'none';

    const wrap = document.querySelector('.admin-content-wrap');
    if (wrap) wrap.scrollTop = 0;
  }

  function closeAdmin() {
    document.body.classList.remove('admin-open');
    document.body.style.overflow = '';

    const adminModal = document.getElementById('adminPortalModal');
    if (adminModal) {
      adminModal.style.display = 'none';
      adminModal.classList.remove('active');
      adminModal.classList.remove('show');
    }

    const bottomNav = document.querySelector('.mobile-bottom-nav');
    if (bottomNav) bottomNav.style.display = '';

    if (window.location.hash === '#admin' || window.location.hash === '#adminPanel') {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {}
    }
  }

  function toggleAdminMobileMenu() {
    const sidebar = document.getElementById('wpAdminSidebar');
    if (sidebar) sidebar.classList.toggle('mobile-open');
    const backdrop = document.getElementById('wpAdminBackdrop');
    if (backdrop) backdrop.classList.toggle('active');
  }

  function switchAdminTab(tabName) {
    const titlesMap = {
      'dashboard': 'Analytics & Financial Profit',
      'products': 'Products & Stock Inventory',
      'orders': 'Customer Orders & Shipments',
      'sales': 'Sales Ledger & Invoices',
      'expenses': 'Expenses & Cost of Goods (COGS)',
      'frontend-editor': 'Storefront Customizer & Banners',
      'payment-settings': 'Payment Gateways & Accounts',
      'reviews-mod': 'Verified Customer Reviews',
      'ai-agent': 'WhatsApp AI Bot Stylist',
      'backup-sync': 'Cloud Sync & Data Backup',
      'leads': 'Customer Leads & Inquiries'
    };

    document.querySelectorAll('.admin-tab-btn, .wp-nav-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.admin-tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `adminTab_${tabName}`);
    });

    const breadcrumb = document.getElementById('adminBreadcrumbTitle');
    if (breadcrumb && titlesMap[tabName]) {
      breadcrumb.textContent = titlesMap[tabName];
    }

    const sidebar = document.getElementById('wpAdminSidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    const backdrop = document.getElementById('wpAdminBackdrop');
    if (backdrop) backdrop.classList.remove('active');

    const tabs = document.getElementById('adminNavTabs');
    if (tabs) tabs.classList.remove('mobile-open');

    const wrap = document.querySelector('.admin-content-wrap');
    if (wrap) wrap.scrollTop = 0;

    if (tabName === 'dashboard') {
      setTimeout(() => renderSalesChart(AppState.activeChartPeriod), 100);
    }
    if (tabName === 'ai-agent') {
      generateWhatsAppQR();
    }
  }

  function handleImageUploadToInput(input, targetInputId, targetPreviewImgId) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const target = document.getElementById(targetInputId);
      if (target) {
        target.value = e.target.result;
      }
      if (targetPreviewImgId) {
        const prev = document.getElementById(targetPreviewImgId);
        if (prev) prev.src = e.target.result;
      }
      showToast('Image uploaded and preview set! Click "Save" to apply.', 'success');
    };
    reader.readAsDataURL(input.files[0]);
  }

  function populateAdminEditorInputs() {
    const frontSettings = JSON.parse(localStorage.getItem('aiman_frontend_settings') || '{}');
    
    // Hero & Announcements
    if (document.getElementById('admin_announcement_text')) {
      document.getElementById('admin_announcement_text').value = frontSettings.announcement || '✨ Bohra Festive Sale: Flat 25% Off with code AIMAN25 | Free Nationwide TCS Delivery';
    }
    if (document.getElementById('admin_hero_pill')) {
      document.getElementById('admin_hero_pill').value = frontSettings.heroPill || 'DAWOODI BOHRA TRADITIONAL & MODERN LIBAS';
    }
    if (document.getElementById('admin_flash_heading')) {
      document.getElementById('admin_flash_heading').value = frontSettings.flashHeading || 'Bohra Community Festive Deals';
    }
    if (document.getElementById('admin_hero_title')) {
      document.getElementById('admin_hero_title').value = frontSettings.heroTitle || 'Elegance in Every Bohra Stitch.';
    }
    if (document.getElementById('admin_hero_subtitle')) {
      document.getElementById('admin_hero_subtitle').value = frontSettings.heroSubtitle || 'Discover our handpicked collection of exquisite Dawoodi Bohra Ridas, matching luxury leather bags, formal batwas, and custom cosmetic pouches. Perfect pardi drape and ghagra flair for miqaats, majalis, and celebrations.';
    }
    if (document.getElementById('admin_hero_img')) {
      document.getElementById('admin_hero_img').value = frontSettings.heroImg || 'images/luxury_rida.png';
    }
    if (document.getElementById('admin_hero_card_tag')) {
      document.getElementById('admin_hero_card_tag').value = frontSettings.heroCardTag || 'Signature Bohra Rida';
    }
    if (document.getElementById('admin_hero_card_name')) {
      document.getElementById('admin_hero_card_name').value = frontSettings.heroCardName || 'Emerald Garden Silk Rida';
    }
    if (document.getElementById('admin_hero_card_price')) {
      document.getElementById('admin_hero_card_price').value = frontSettings.heroCardPrice || 'Rs. 5,200';
    }

    // Categories Cards
    if (document.getElementById('admin_cat1_title')) document.getElementById('admin_cat1_title').value = frontSettings.cat1Title || 'Silk & Formal Ridas';
    if (document.getElementById('admin_cat1_sub')) document.getElementById('admin_cat1_sub').value = frontSettings.cat1Sub || 'Heavy Zari & Gold Lace';
    if (document.getElementById('admin_cat1_img')) document.getElementById('admin_cat1_img').value = frontSettings.cat1Img || 'images/luxury_rida.png';

    if (document.getElementById('admin_cat2_title')) document.getElementById('admin_cat2_title').value = frontSettings.cat2Title || 'Cotton Daily Ridas';
    if (document.getElementById('admin_cat2_sub')) document.getElementById('admin_cat2_sub').value = frontSettings.cat2Sub || 'Floral Panels & Crochet Lace';
    if (document.getElementById('admin_cat2_img')) document.getElementById('admin_cat2_img').value = frontSettings.cat2Img || 'images/luxury_rida.png';

    if (document.getElementById('admin_cat3_title')) document.getElementById('admin_cat3_title').value = frontSettings.cat3Title || 'Rida Bags & Batwas';
    if (document.getElementById('admin_cat3_sub')) document.getElementById('admin_cat3_sub').value = frontSettings.cat3Sub || 'Suede Totes & Clutches';
    if (document.getElementById('admin_cat3_img')) document.getElementById('admin_cat3_img').value = frontSettings.cat3Img || 'images/designer_handbag.png';

    if (document.getElementById('admin_cat4_title')) document.getElementById('admin_cat4_title').value = frontSettings.cat4Title || 'Cosmetic & Topi Pouches';
    if (document.getElementById('admin_cat4_sub')) document.getElementById('admin_cat4_sub').value = frontSettings.cat4Sub || 'Dual-Deck Satin Vanity Organizers';
    if (document.getElementById('admin_cat4_img')) document.getElementById('admin_cat4_img').value = frontSettings.cat4Img || 'images/cosmetic_bag.png';

    // Bespoke Custom Stitching Banner
    if (document.getElementById('admin_custom_tag')) document.getElementById('admin_custom_tag').value = frontSettings.customTag || 'Bespoke Tailoring';
    if (document.getElementById('admin_custom_title')) document.getElementById('admin_custom_title').value = frontSettings.customTitle || 'Made-to-Measure Custom Stitching';
    if (document.getElementById('admin_custom_desc')) document.getElementById('admin_custom_desc').value = frontSettings.customDesc || 'Har insaan ka size unique hota hai. Aiman Collection provide karti hai personalized custom stitching services. Hamare master tailors aapki exact measurement ke mutabiq piece tayar karte hain.';
    if (document.getElementById('admin_custom_f1')) document.getElementById('admin_custom_f1').value = frontSettings.customF1 || 'Custom Rida Length & Gher';
    if (document.getElementById('admin_custom_f2')) document.getElementById('admin_custom_f2').value = frontSettings.customF2 || 'Neckline & Sleeves Customization';
    if (document.getElementById('admin_custom_f3')) document.getElementById('admin_custom_f3').value = frontSettings.customF3 || 'Pure Lining & Fine Pico Borders';
    if (document.getElementById('admin_custom_f4')) document.getElementById('admin_custom_f4').value = frontSettings.customF4 || 'Direct WhatsApp Tailor Consultation';
    if (document.getElementById('admin_custom_img')) document.getElementById('admin_custom_img').value = frontSettings.customImg || 'images/luxury_rida.png';

    // Deals 1, 2, 3
    if (document.getElementById('admin_deal1_title')) document.getElementById('admin_deal1_title').value = frontSettings.deal1Title || 'Bohra Bridal Royale Combo';
    if (document.getElementById('admin_deal1_price')) document.getElementById('admin_deal1_price').value = frontSettings.deal1Price || '9999';
    if (document.getElementById('admin_deal1_orig_price')) document.getElementById('admin_deal1_orig_price').value = frontSettings.deal1OrigPrice || '12500';
    if (document.getElementById('admin_deal1_img')) document.getElementById('admin_deal1_img').value = frontSettings.deal1Img || 'images/luxury_rida.png';

    if (document.getElementById('admin_deal2_title')) document.getElementById('admin_deal2_title').value = frontSettings.deal2Title || 'Twin Festive Silk Rida Duo';
    if (document.getElementById('admin_deal2_price')) document.getElementById('admin_deal2_price').value = frontSettings.deal2Price || '7200';
    if (document.getElementById('admin_deal2_orig_price')) document.getElementById('admin_deal2_orig_price').value = frontSettings.deal2OrigPrice || '8800';
    if (document.getElementById('admin_deal2_img')) document.getElementById('admin_deal2_img').value = frontSettings.deal2Img || 'images/lavender_rida.png';

    if (document.getElementById('admin_deal3_title')) document.getElementById('admin_deal3_title').value = frontSettings.deal3Title || 'Dawoodi Bohra Vanity Trio';
    if (document.getElementById('admin_deal3_price')) document.getElementById('admin_deal3_price').value = frontSettings.deal3Price || '2499';
    if (document.getElementById('admin_deal3_orig_price')) document.getElementById('admin_deal3_orig_price').value = frontSettings.deal3OrigPrice || '3300';
    if (document.getElementById('admin_deal3_img')) document.getElementById('admin_deal3_img').value = frontSettings.deal3Img || 'images/cosmetic_bag.png';

    // Promo & Delivery
    if (document.getElementById('admin_free_shipping_limit')) document.getElementById('admin_free_shipping_limit').value = frontSettings.freeShippingLimit || '4000';
    if (document.getElementById('admin_promo_code')) document.getElementById('admin_promo_code').value = frontSettings.promoCode || 'AIMAN25';
    if (document.getElementById('admin_promo_percent')) document.getElementById('admin_promo_percent').value = frontSettings.promoPercent || '25';

    // Payment Accounts
    const paySettings = JSON.parse(localStorage.getItem('aiman_payment_settings') || '{}');
    if (document.getElementById('admin_whatsapp_num')) {
      document.getElementById('admin_whatsapp_num').value = paySettings.whatsapp || '03452439196';
    }
    if (document.getElementById('admin_easypaisa_num')) {
      document.getElementById('admin_easypaisa_num').value = paySettings.easypaisa || '03428301490';
    }
    if (document.getElementById('admin_jazzcash_num')) {
      document.getElementById('admin_jazzcash_num').value = paySettings.jazzcash || '03252005028';
    }
    if (document.getElementById('admin_raast_num')) {
      document.getElementById('admin_raast_num').value = paySettings.raast || '03452439196';
    }
    if (document.getElementById('admin_account_title')) {
      document.getElementById('admin_account_title').value = paySettings.title || 'Tahir';
    }

    // WhatsApp AI Bot & Gateway Settings
    const botSettings = JSON.parse(localStorage.getItem('aiman_bot_settings') || '{}');
    if (document.getElementById('set_phone')) document.getElementById('set_phone').value = botSettings.phone || '923452439196';
    if (document.getElementById('set_botname')) document.getElementById('set_botname').value = botSettings.botName || 'Aiman AI Stylist';
    if (document.getElementById('set_meta_phone_id')) document.getElementById('set_meta_phone_id').value = botSettings.phoneId || '';
    if (document.getElementById('set_meta_token')) document.getElementById('set_meta_token').value = botSettings.token || '';
    if (document.getElementById('set_meta_verify_token')) document.getElementById('set_meta_verify_token').value = botSettings.verifyToken || 'AIMAN_WHATSAPP_SECRET_7860';
    if (document.getElementById('set_welcome')) document.getElementById('set_welcome').value = botSettings.welcome || 'Assalam-o-Alaikum! ✨ Welcome to Aiman Collection. Main aapki AI Personal Fashion Stylist hoon. Main aapko collections, sizing, order status ya custom rida stitching mein help kar sakti hoon. Aap kya dekhna pasand karengi?';
  }

  function saveFrontendSettings(event) {
    event.preventDefault();
    const settings = {
      // Hero
      announcement: document.getElementById('admin_announcement_text')?.value || '',
      heroPill: document.getElementById('admin_hero_pill')?.value || '',
      flashHeading: document.getElementById('admin_flash_heading')?.value || '',
      heroTitle: document.getElementById('admin_hero_title')?.value || '',
      heroSubtitle: document.getElementById('admin_hero_subtitle')?.value || '',
      heroImg: document.getElementById('admin_hero_img')?.value || 'images/luxury_rida.png',
      heroCardTag: document.getElementById('admin_hero_card_tag')?.value || 'Signature Bohra Rida',
      heroCardName: document.getElementById('admin_hero_card_name')?.value || 'Emerald Garden Silk Rida',
      heroCardPrice: document.getElementById('admin_hero_card_price')?.value || 'Rs. 5,200',

      // Categories
      cat1Title: document.getElementById('admin_cat1_title')?.value || 'Silk & Formal Ridas',
      cat1Sub: document.getElementById('admin_cat1_sub')?.value || 'Heavy Zari & Gold Lace',
      cat1Img: document.getElementById('admin_cat1_img')?.value || 'images/luxury_rida.png',

      cat2Title: document.getElementById('admin_cat2_title')?.value || 'Cotton Daily Ridas',
      cat2Sub: document.getElementById('admin_cat2_sub')?.value || 'Floral Panels & Crochet Lace',
      cat2Img: document.getElementById('admin_cat2_img')?.value || 'images/luxury_rida.png',

      cat3Title: document.getElementById('admin_cat3_title')?.value || 'Rida Bags & Batwas',
      cat3Sub: document.getElementById('admin_cat3_sub')?.value || 'Suede Totes & Clutches',
      cat3Img: document.getElementById('admin_cat3_img')?.value || 'images/designer_handbag.png',

      cat4Title: document.getElementById('admin_cat4_title')?.value || 'Cosmetic & Topi Pouches',
      cat4Sub: document.getElementById('admin_cat4_sub')?.value || 'Dual-Deck Satin Vanity Organizers',
      cat4Img: document.getElementById('admin_cat4_img')?.value || 'images/cosmetic_bag.png',

      // Bespoke Tailoring Banner
      customTag: document.getElementById('admin_custom_tag')?.value || 'Bespoke Tailoring',
      customTitle: document.getElementById('admin_custom_title')?.value || 'Made-to-Measure Custom Stitching',
      customDesc: document.getElementById('admin_custom_desc')?.value || '',
      customF1: document.getElementById('admin_custom_f1')?.value || 'Custom Rida Length & Gher',
      customF2: document.getElementById('admin_custom_f2')?.value || 'Neckline & Sleeves Customization',
      customF3: document.getElementById('admin_custom_f3')?.value || 'Pure Lining & Fine Pico Borders',
      customF4: document.getElementById('admin_custom_f4')?.value || 'Direct WhatsApp Tailor Consultation',
      customImg: document.getElementById('admin_custom_img')?.value || 'images/luxury_rida.png',

      // Deals
      deal1Title: document.getElementById('admin_deal1_title')?.value || 'Bohra Bridal Royale Combo',
      deal1Price: document.getElementById('admin_deal1_price')?.value || '9999',
      deal1OrigPrice: document.getElementById('admin_deal1_orig_price')?.value || '12500',
      deal1Img: document.getElementById('admin_deal1_img')?.value || 'images/luxury_rida.png',

      deal2Title: document.getElementById('admin_deal2_title')?.value || 'Twin Festive Silk Rida Duo',
      deal2Price: document.getElementById('admin_deal2_price')?.value || '7200',
      deal2OrigPrice: document.getElementById('admin_deal2_orig_price')?.value || '8800',
      deal2Img: document.getElementById('admin_deal2_img')?.value || 'images/lavender_rida.png',

      deal3Title: document.getElementById('admin_deal3_title')?.value || 'Dawoodi Bohra Vanity Trio',
      deal3Price: document.getElementById('admin_deal3_price')?.value || '2499',
      deal3OrigPrice: document.getElementById('admin_deal3_orig_price')?.value || '3300',
      deal3Img: document.getElementById('admin_deal3_img')?.value || 'images/cosmetic_bag.png',

      // Delivery & Promo
      freeShippingLimit: document.getElementById('admin_free_shipping_limit')?.value || '4000',
      promoCode: document.getElementById('admin_promo_code')?.value || 'AIMAN25',
      promoPercent: document.getElementById('admin_promo_percent')?.value || '25'
    };

    localStorage.setItem('aiman_frontend_settings', JSON.stringify(settings));
    applyFrontendSettings(settings);
    showToast('✨ All homepage visuals, deals & settings updated live!', 'success');
  }

  function applyFrontendSettings(saved) {
    const settings = saved || JSON.parse(localStorage.getItem('aiman_frontend_settings') || '{}');
    
    // Hero
    if (settings.announcement) {
      const el = document.getElementById('announcementTextDisplay');
      if (el) el.innerHTML = settings.announcement;
    }
    if (settings.heroTitle) {
      const el = document.getElementById('heroTitleDisplay');
      if (el) el.innerHTML = settings.heroTitle;
    }
    if (settings.heroSubtitle) {
      const el = document.getElementById('heroSubtitleDisplay');
      if (el) el.textContent = settings.heroSubtitle;
    }
    if (settings.flashHeading) {
      const el = document.querySelector('.flash-heading');
      if (el) el.textContent = settings.flashHeading;
    }
    if (settings.heroPill) {
      const el = document.getElementById('heroPillText');
      if (el) el.textContent = settings.heroPill;
    }
    if (settings.heroImg) {
      const el = document.getElementById('heroVisualImg');
      if (el) el.src = settings.heroImg;
    }
    if (settings.heroCardTag) {
      const el = document.getElementById('heroCardTag');
      if (el) el.textContent = settings.heroCardTag;
    }
    if (settings.heroCardName) {
      const el = document.getElementById('heroCardName');
      if (el) el.textContent = settings.heroCardName;
    }
    if (settings.heroCardPrice) {
      const el = document.getElementById('heroCardPrice');
      if (el) el.textContent = settings.heroCardPrice;
    }

    // Categories
    if (settings.cat1Title && document.getElementById('catCardTitle1')) document.getElementById('catCardTitle1').textContent = settings.cat1Title;
    if (settings.cat1Sub && document.getElementById('catCardSubtitle1')) document.getElementById('catCardSubtitle1').textContent = settings.cat1Sub;
    if (settings.cat1Img && document.getElementById('catCardImg1')) document.getElementById('catCardImg1').src = settings.cat1Img;

    if (settings.cat2Title && document.getElementById('catCardTitle2')) document.getElementById('catCardTitle2').textContent = settings.cat2Title;
    if (settings.cat2Sub && document.getElementById('catCardSubtitle2')) document.getElementById('catCardSubtitle2').textContent = settings.cat2Sub;
    if (settings.cat2Img && document.getElementById('catCardImg2')) document.getElementById('catCardImg2').src = settings.cat2Img;

    if (settings.cat3Title && document.getElementById('catCardTitle3')) document.getElementById('catCardTitle3').textContent = settings.cat3Title;
    if (settings.cat3Sub && document.getElementById('catCardSubtitle3')) document.getElementById('catCardSubtitle3').textContent = settings.cat3Sub;
    if (settings.cat3Img && document.getElementById('catCardImg3')) document.getElementById('catCardImg3').src = settings.cat3Img;

    if (settings.cat4Title && document.getElementById('catCardTitle4')) document.getElementById('catCardTitle4').textContent = settings.cat4Title;
    if (settings.cat4Sub && document.getElementById('catCardSubtitle4')) document.getElementById('catCardSubtitle4').textContent = settings.cat4Sub;
    if (settings.cat4Img && document.getElementById('catCardImg4')) document.getElementById('catCardImg4').src = settings.cat4Img;

    // Bespoke Tailoring Banner
    if (settings.customTag && document.getElementById('customBannerTag')) document.getElementById('customBannerTag').textContent = settings.customTag;
    if (settings.customTitle && document.getElementById('customBannerTitle')) document.getElementById('customBannerTitle').textContent = settings.customTitle;
    if (settings.customDesc && document.getElementById('customBannerDesc')) document.getElementById('customBannerDesc').textContent = settings.customDesc;
    if (settings.customF1 && document.getElementById('customFeature1')) document.getElementById('customFeature1').textContent = settings.customF1;
    if (settings.customF2 && document.getElementById('customFeature2')) document.getElementById('customFeature2').textContent = settings.customF2;
    if (settings.customF3 && document.getElementById('customFeature3')) document.getElementById('customFeature3').textContent = settings.customF3;
    if (settings.customF4 && document.getElementById('customFeature4')) document.getElementById('customFeature4').textContent = settings.customF4;
    if (settings.customImg && document.getElementById('customBannerImg')) document.getElementById('customBannerImg').src = settings.customImg;
  }

  function savePaymentSettings(event) {
    event.preventDefault();
    const payment = {
      whatsapp: document.getElementById('admin_whatsapp_num')?.value.trim() || '03452439196',
      easypaisa: document.getElementById('admin_easypaisa_num')?.value.trim() || '03428301490',
      jazzcash: document.getElementById('admin_jazzcash_num')?.value.trim() || '03252005028',
      raast: document.getElementById('admin_raast_num')?.value.trim() || '03452439196',
      title: document.getElementById('admin_account_title')?.value.trim() || 'Tahir'
    };
    localStorage.setItem('aiman_payment_settings', JSON.stringify(payment));
    applyPaymentSettings(payment);
    showToast('💳 Merchant payment accounts saved & updated!', 'success');
  }

  function applyPaymentSettings(saved) {
    const p = saved || JSON.parse(localStorage.getItem('aiman_payment_settings') || '{}');
    if (p.whatsapp) {
      WHATSAPP_NUMBER = p.whatsapp.replace(/\D/g, '');
    }
  }

  function handleGlobalSearchFocus() {
    const input = document.getElementById('darazSearchInput');
    const dropdown = document.getElementById('globalSearchDropdown');
    if (!dropdown) return;
    
    const q = input ? input.value.trim().toLowerCase() : '';
    if (q) {
      handleGlobalSearchInput(q);
      return;
    }

    // When empty, show Trending & Quick Recommendations
    const trending = apiEngine.products.slice(0, 4);
    dropdown.innerHTML = `
      <div style="padding: 0.8rem 1rem 0.4rem 1rem; border-bottom: 1px solid var(--color-border-subtle);">
        <div style="font-size: 0.72rem; font-weight: 700; color: var(--color-gold-primary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem;">
          <i class="fas fa-fire-alt"></i> Popular Bohra Searches
        </div>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <span class="search-tag-chip" onclick="window.AimanStore.quickSearchTag('Silk')">Silk Rida</span>
          <span class="search-tag-chip" onclick="window.AimanStore.quickSearchTag('Cotton')">Cotton Rida</span>
          <span class="search-tag-chip" onclick="window.AimanStore.quickSearchTag('Bridal')">Bridal Zari</span>
          <span class="search-tag-chip" onclick="window.AimanStore.quickSearchTag('Batwa')">Matching Batwa</span>
          <span class="search-tag-chip" onclick="window.AimanStore.quickSearchTag('Pouch')">Cosmetic Pouch</span>
        </div>
      </div>
      <div style="padding: 0.6rem 1rem 0.3rem 1rem; font-size: 0.72rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">
        Featured Bohra Collection
      </div>
      ${trending.map(p => `
        <div class="search-suggestion-item" onclick="window.AimanStore.selectSearchSuggestion('${p.id}')">
          <img src="${p.image}" alt="${p.name}">
          <div style="flex: 1; min-width: 0;">
            <div class="search-suggestion-name">${escapeHtml(p.name)}</div>
            <div class="search-suggestion-meta">${p.category.toUpperCase()} • ${p.badge || 'Featured'}</div>
          </div>
          <div class="search-suggestion-price">Rs. ${p.price.toLocaleString()}</div>
        </div>
      `).join('')}
    `;
    dropdown.style.display = 'block';
  }

  function quickSearchTag(tag) {
    const input = document.getElementById('darazSearchInput');
    if (input) {
      input.value = tag;
      handleGlobalSearchInput(tag);
      executeGlobalSearch();
    }
  }

  function handleGlobalSearchInput(val) {
    const dropdown = document.getElementById('globalSearchDropdown');
    if (!dropdown) return;
    const q = val.trim().toLowerCase();
    if (!q) {
      handleGlobalSearchFocus();
      return;
    }
    const matches = apiEngine.products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.fabric && p.fabric.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    ).slice(0, 6);

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--color-text-muted); font-size: 0.85rem;">
          <i class="fas fa-search" style="font-size: 1.5rem; opacity: 0.4; margin-bottom: 0.5rem; display: block;"></i>
          No products found for "<strong>${escapeHtml(val)}</strong>"<br>
          <span style="font-size: 0.75rem; color: var(--color-gold-light); cursor: pointer;" onclick="window.AimanStore.setCategory('all')">View all items</span>
        </div>
      `;
      dropdown.style.display = 'block';
      return;
    }

    dropdown.innerHTML = `
      <div style="padding: 0.6rem 1rem 0.3rem 1rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border-subtle);">
        <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-gold-primary); text-transform: uppercase;">Matching Items (${matches.length})</span>
        <span style="font-size: 0.75rem; color: var(--color-text-muted); cursor: pointer;" onclick="window.AimanStore.executeGlobalSearch()">View all results &rarr;</span>
      </div>
      ${matches.map(p => `
        <div class="search-suggestion-item" onclick="window.AimanStore.selectSearchSuggestion('${p.id}')">
          <img src="${p.image}" alt="${p.name}">
          <div style="flex: 1; min-width: 0;">
            <div class="search-suggestion-name">${escapeHtml(p.name)}</div>
            <div class="search-suggestion-meta">${p.category.toUpperCase()} • ${p.badge || 'In Stock'}</div>
          </div>
          <div class="search-suggestion-price">Rs. ${p.price.toLocaleString()}</div>
        </div>
      `).join('')}
    `;
    dropdown.style.display = 'block';
  }

  function selectSearchSuggestion(prodId) {
    const dropdown = document.getElementById('globalSearchDropdown');
    if (dropdown) dropdown.style.display = 'none';
    openQuickView(prodId);
  }

  function executeGlobalSearch() {
    const input = document.getElementById('darazSearchInput');
    if (!input) return;
    const q = input.value.trim().toLowerCase();
    AppState.searchQuery = q;
    renderProductsCatalog();
    const dropdown = document.getElementById('globalSearchDropdown');
    if (dropdown) dropdown.style.display = 'none';
    const catSection = document.getElementById('catalog');
    if (catSection) catSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleMobileMenu() {
    const ribbon = document.querySelector('.daraz-category-ribbon');
    if (ribbon) {
      ribbon.classList.toggle('mobile-open');
    }
  }

  function renderAdminMetrics() {
    const metrics = apiEngine.getAnalytics();
    document.getElementById('adminMetricRevenue').textContent = 'Rs. ' + metrics.totalRevenue.toLocaleString();
    document.getElementById('adminMetricCost').textContent = 'Rs. ' + metrics.totalCost.toLocaleString();
    document.getElementById('adminMetricProfit').textContent = 'Rs. ' + metrics.netProfit.toLocaleString();
    document.getElementById('adminMetricMargin').textContent = metrics.margin + '%';
    document.getElementById('summaryActiveProducts').textContent = metrics.totalProducts + ' Products';

    const todayDate = new Date().toISOString().split('T')[0];
    const todaySales = apiEngine.sales.filter(s => s.date === todayDate);
    const todayItems = todaySales.reduce((sum, s) => sum + s.quantity, 0);
    const todayProfit = todaySales.reduce((sum, s) => sum + s.profit, 0);

    const itemsEl = document.getElementById('summaryTodayItems');
    const profEl = document.getElementById('summaryTodayProfit');
    if (itemsEl) itemsEl.textContent = todayItems + ' Items';
    if (profEl) profEl.textContent = 'Rs. ' + todayProfit.toLocaleString();

    const badge = document.getElementById('firebase-connection-badge');
    if (badge) {
      if (apiEngine.isFirebaseActive) {
        badge.textContent = '☁️ Connected to Cloud (Real-Time Sync ON)';
        badge.style.color = '#25D366';
      } else {
        badge.textContent = '💾 Local Storage Active';
        badge.style.color = '#C5A880';
      }
    }
  }

  function renderAdminSales() {
    const tbody = document.getElementById('adminSalesTbody');
    if (!tbody) return;

    const salesDesc = [...apiEngine.sales].reverse();
    tbody.innerHTML = salesDesc.map(s => `
      <tr>
        <td>${s.date}</td>
        <td><strong>${escapeHtml(s.productName)}</strong></td>
        <td><span class="badge badge-primary">${s.category}</span></td>
        <td>${s.quantity}</td>
        <td>Rs. ${s.costPrice.toLocaleString()}</td>
        <td>Rs. ${s.sellingPrice.toLocaleString()}</td>
        <td style="color:var(--color-accent-whatsapp); font-weight:700;">Rs. ${s.profit.toLocaleString()}</td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-primary btn-sm" onclick="window.AimanStore.openAdminEditSaleModal('${s.id}')" title="Edit Sale Record">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="window.AimanStore.deleteSale('${s.id}')" title="Delete Sale">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function openAdminEditSaleModal(saleId) {
    const sale = apiEngine.sales.find(s => String(s.id) === String(saleId));
    if (!sale) return;

    if (document.getElementById('edit_sale_id')) document.getElementById('edit_sale_id').value = sale.id;
    if (document.getElementById('edit_sale_prod_name')) document.getElementById('edit_sale_prod_name').value = sale.productName;
    if (document.getElementById('edit_sale_qty')) document.getElementById('edit_sale_qty').value = sale.quantity;
    if (document.getElementById('edit_sale_date')) document.getElementById('edit_sale_date').value = sale.date;
    if (document.getElementById('edit_sale_cost')) document.getElementById('edit_sale_cost').value = sale.costPrice;
    if (document.getElementById('edit_sale_price')) document.getElementById('edit_sale_price').value = sale.sellingPrice;

    openModal('adminEditSaleModal');
  }

  function saveAdminSaleForm(event) {
    event.preventDefault();
    const id = document.getElementById('edit_sale_id')?.value;
    if (!id) return;

    const qty = parseInt(document.getElementById('edit_sale_qty')?.value) || 1;
    const cost = parseFloat(document.getElementById('edit_sale_cost')?.value) || 0;
    const price = parseFloat(document.getElementById('edit_sale_price')?.value) || 0;
    const date = document.getElementById('edit_sale_date')?.value || new Date().toISOString().split('T')[0];
    const productName = document.getElementById('edit_sale_prod_name')?.value || 'Item';

    apiEngine.updateSale(id, {
      productName,
      quantity: qty,
      costPrice: cost,
      sellingPrice: price,
      date
    });

    closeModal('adminEditSaleModal');
    renderAdminSales();
    renderSalesChart(AppState.activeChartPeriod);
    showToast('✨ Sales record updated & profit recalculated!', 'success');
  }

  function populateLogSaleProductDropdown() {
    const select = document.getElementById('logSaleProductSelect');
    if (!select) return;

    select.innerHTML = `<option value="" disabled selected>Choose product...</option>` +
      apiEngine.products.map(p => `
        <option value="${p.id}" data-cost="${p.costPrice || (p.price * 0.5)}" data-price="${p.price}" data-category="${p.category}">
          ${p.name} (Selling: Rs. ${p.price.toLocaleString()} | Cost: Rs. ${(p.costPrice || p.price * 0.5).toLocaleString()})
        </option>
      `).join('');

    const dateInput = document.getElementById('logSaleDate');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  }

  function updateSaleFormPrices() {
    const select = document.getElementById('logSaleProductSelect');
    const costInput = document.getElementById('logSaleCost');
    const priceInput = document.getElementById('logSalePrice');
    const qtyInput = document.getElementById('logSaleQty');

    if (select && select.selectedOptions[0]) {
      const opt = select.selectedOptions[0];
      if (opt.dataset.cost && (!costInput.value || costInput.dataset.auto === 'true')) {
        costInput.value = opt.dataset.cost;
        costInput.dataset.auto = 'true';
      }
      if (opt.dataset.price && (!priceInput.value || priceInput.dataset.auto === 'true')) {
        priceInput.value = opt.dataset.price;
        priceInput.dataset.auto = 'true';
      }
    }

    const qty = parseInt(qtyInput?.value) || 1;
    const cost = parseFloat(costInput?.value) || 0;
    const price = parseFloat(priceInput?.value) || 0;
    const profit = (price - cost) * qty;
    const margin = price > 0 ? (((price - cost) / price) * 100).toFixed(1) : 0;

    const profEl = document.getElementById('logSaleProfitDisplay');
    const margEl = document.getElementById('logSaleMarginDisplay');
    if (profEl) profEl.textContent = 'Rs. ' + profit.toLocaleString();
    if (margEl) margEl.textContent = margin + '%';
  }

  function handleManualSaleLog(event) {
    event.preventDefault();
    const select = document.getElementById('logSaleProductSelect');
    const opt = select.selectedOptions[0];
    const qty = parseInt(document.getElementById('logSaleQty').value) || 1;
    const date = document.getElementById('logSaleDate').value;
    const cost = parseFloat(document.getElementById('logSaleCost').value);
    const price = parseFloat(document.getElementById('logSalePrice').value);

    apiEngine.logSale({
      productId: select.value,
      productName: opt ? opt.text.split(' (')[0] : 'Direct Sale',
      category: opt ? opt.dataset.category : 'ridas',
      quantity: qty,
      costPrice: cost,
      sellingPrice: price,
      date
    });

    renderAdminMetrics();
    renderAdminSales();
    renderSalesChart(AppState.activeChartPeriod);
    showToast('✨ Sale transaction recorded and financials updated!', 'success');
  }

  function deleteSale(id) {
    if (confirm('Delete this transaction record?')) {
      apiEngine.deleteSale(id);
      renderAdminMetrics();
      renderAdminSales();
      renderSalesChart(AppState.activeChartPeriod);
      showToast('Sale record deleted.', 'info');
    }
  }

  function renderAdminOrders() {
    const tbody = document.getElementById('adminOrdersTbody');
    if (!tbody) return;

    if (!apiEngine.orders || apiEngine.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--color-text-muted);"><i class="fas fa-shopping-bag" style="font-size:1.5rem; margin-bottom:0.5rem; display:block; opacity:0.4;"></i>No customer orders yet. Live orders placed on storefront or via WhatsApp will appear here automatically.</td></tr>`;
      return;
    }

    tbody.innerHTML = apiEngine.orders.map(o => {
      const orderNum = o.orderNumber || o.id || 'AC-2026-01';
      const cName = o.customerName || o.name || 'Client';
      const city = o.city || 'Karachi';
      const itemCount = o.items ? o.items.length : 1;
      const totalVal = Number(o.total !== undefined ? o.total : (o.totalAmount !== undefined ? o.totalAmount : (o.amount !== undefined ? o.amount : 0)));
      const payMethod = (o.paymentMethod || 'CASH_ON_DELIVERY').replace(/_/g, ' ');
      const payStatus = o.paymentStatus || 'PENDING';
      const isPaid = payStatus === 'PAID' || payStatus === 'COMPLETED';

      return `
        <tr>
          <td><strong>${orderNum}</strong><br><span style="font-size:0.75rem; color:var(--color-text-muted);">${o.courier || o.tcsTracking || 'TCS'}</span></td>
          <td>${escapeHtml(cName)}<br><span style="font-size:0.75rem; color:var(--color-text-muted);">${city}</span></td>
          <td>${itemCount} items</td>
          <td style="color:var(--color-gold-light); font-weight:700;">Rs. ${totalVal.toLocaleString()}</td>
          <td>
            <span class="badge badge-${isPaid ? 'success' : 'warning'}">${payMethod} (${payStatus})</span>
          </td>
          <td>
            <select onchange="window.AimanStore.updateOrderStatus('${o.id}', this.value)" style="padding:0.25rem 0.5rem; font-size:0.8rem; background:#12151B; color:#FFF; border:1px solid #C5A880; border-radius:4px;">
              <option value="PROCESSING" ${o.orderStatus === 'PROCESSING' ? 'selected' : ''}>PROCESSING</option>
              <option value="SHIPPED" ${o.orderStatus === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
              <option value="DELIVERED" ${o.orderStatus === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
              <option value="CANCELLED" ${o.orderStatus === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
            </select>
          </td>
          <td>
            <div style="display:flex; gap:0.4rem;">
              <button class="btn btn-secondary btn-sm" onclick="window.AimanStore.previewOrderEmailById('${o.id}')" title="Preview Email Receipt">
                <i class="fas fa-envelope"></i>
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.AimanStore.printInvoice('${o.id}')" title="Print Invoice">
                <i class="fas fa-print"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function formatCategoryBadge(cat, subCat) {
    const c = (cat || '').toLowerCase();
    const sub = (subCat || '').toLowerCase();

    if (sub === 'silk-ridas' || (c === 'ridas' && sub.includes('silk'))) return '<span class="badge badge-primary" style="background:rgba(197,168,128,0.2); color:#C5A880; border:1px solid #C5A880;">Silk Rida</span>';
    if (sub === 'cotton-ridas' || (c === 'ridas' && sub.includes('cotton'))) return '<span class="badge badge-secondary" style="background:rgba(100,181,246,0.2); color:#64B5F6; border:1px solid #64B5F6;">Cotton Rida</span>';
    if (sub === 'bridal-ridas' || (c === 'ridas' && sub.includes('bridal'))) return '<span class="badge badge-danger" style="background:rgba(224,169,109,0.2); color:#E0A96D; border:1px solid #E0A96D;">Bridal Rida</span>';
    if (c === 'handbags' || sub === 'bags' || c === 'bags') return '<span class="badge badge-warning" style="background:rgba(255,176,32,0.2); color:#FFB020; border:1px solid #FFB020;">Bag / Batwa</span>';
    if (c === 'accessories' || sub === 'cosmetics') return '<span class="badge badge-info" style="background:rgba(186,104,200,0.2); color:#BA68C8; border:1px solid #BA68C8;">Cosmetic Pouch</span>';
    return `<span class="badge badge-primary">${(cat || 'PRODUCT').toUpperCase()}</span>`;
  }

  function renderAdminProducts() {
    const tbody = document.getElementById('adminProductsTbody');
    if (!tbody) return;

    tbody.innerHTML = apiEngine.products.map(p => {
      const cost = p.costPrice || (p.price * 0.5);
      const stock = p.stockQuantity !== undefined ? p.stockQuantity : 25;
      const isLowStock = stock < 5;

      const categoryBadge = formatCategoryBadge(p.category, p.subCategory);

      const stockBadge = isLowStock ? 
        `<span style="background:rgba(229,57,53,0.2); color:#E53935; padding:2px 6px; border-radius:4px; font-size:0.72rem; font-weight:700; display:block; margin-top:2px;">⚠️ Low Stock</span>` : '';

      const isNew = Boolean(p.isNewArrival) || p.badgeClass === 'new' || (p.badge && p.badge.toLowerCase().includes('new'));
      const newArrivalBtn = isNew ? 
        `<button class="btn btn-sm btn-new-arrival active" onclick="window.AimanStore.toggleProductNewArrival('${p.id}')" title="Click to remove New Arrival status"><i class="fas fa-sparkles"></i> NEW ARRIVAL</button>` :
        `<button class="btn btn-secondary btn-sm" onclick="window.AimanStore.toggleProductNewArrival('${p.id}')" title="Click to mark as New Arrival"><i class="far fa-star"></i> Mark New</button>`;

      const isSoldOut = Boolean(p.isSoldOut) || p.status === 'soldout' || (p.stockQuantity !== undefined && p.stockQuantity <= 0 && !p.isBooked);
      const isBooked = !isSoldOut && (Boolean(p.isBooked) || p.status === 'booked');
      const currentStatus = isSoldOut ? 'soldout' : (isBooked ? 'booked' : 'available');

      const statusSelector = `
        <div style="display:flex; flex-direction:column; gap:0.35rem; min-width:140px;">
          <select class="admin-status-select" onchange="window.AimanStore.setProductStatus('${p.id}', this.value)" style="padding:0.35rem 0.6rem; font-size:0.8rem; font-weight:700; border-radius:6px; background:${isSoldOut ? '#3B0D0C' : (isBooked ? '#3D2F1B' : '#122B1E')}; color:${isSoldOut ? '#FF6B6B' : (isBooked ? '#F5D77F' : '#4ADE80')}; border:1px solid ${isSoldOut ? '#DC2626' : (isBooked ? '#C5A880' : '#22C55E')}; cursor:pointer;">
            <option value="available" ${currentStatus === 'available' ? 'selected' : ''}>🟢 In Stock (Available)</option>
            <option value="booked" ${currentStatus === 'booked' ? 'selected' : ''}>🔒 BOOKED (Reserved)</option>
            <option value="soldout" ${currentStatus === 'soldout' ? 'selected' : ''}>🚫 SOLD OUT</option>
          </select>
          <div style="display:flex; gap:0.25rem;">
            <button class="btn btn-sm" style="flex:1; padding:2px 4px; font-size:0.72rem; ${isBooked ? 'background:#C5A880; color:#0B0D11; font-weight:700;' : 'background:rgba(255,255,255,0.06); color:#C5A880; border:1px solid rgba(197,168,128,0.3);'}" onclick="window.AimanStore.toggleProductBooked('${p.id}')" title="1-Click Toggle Booked">
              <i class="fas fa-lock"></i> ${isBooked ? 'Booked' : 'Book'}
            </button>
            <button class="btn btn-sm" style="flex:1; padding:2px 4px; font-size:0.72rem; ${isSoldOut ? 'background:#DC2626; color:#FFF; font-weight:700;' : 'background:rgba(255,255,255,0.06); color:#FF6B6B; border:1px solid rgba(220,38,38,0.3);'}" onclick="window.AimanStore.toggleProductSoldOut('${p.id}')" title="1-Click Toggle Sold Out">
              <i class="fas fa-ban"></i> ${isSoldOut ? 'Sold' : 'SoldOut'}
            </button>
          </div>
        </div>
      `;

      const saleBtn = p.onSale ? 
        `<button class="btn btn-secondary btn-sm" style="background:#661826; color:#FFF; border:1px solid #FF4D4D;" onclick="window.AimanStore.openSaleModal('${p.id}')"><i class="fas fa-fire text-gold"></i> ${p.salePrice ? ('Rs. ' + p.salePrice.toLocaleString()) : 'ON SALE'}</button>` :
        `<button class="btn btn-secondary btn-sm" onclick="window.AimanStore.openSaleModal('${p.id}')"><i class="fas fa-percent"></i> Put on Sale</button>`;

      const priceDisplay = (p.onSale && p.salePrice) ? 
        `<div><span style="text-decoration:line-through; color:var(--color-text-muted); font-size:0.8rem;">Rs. ${p.price.toLocaleString()}</span> <strong style="color:#FF4D4D;">Rs. ${p.salePrice.toLocaleString()}</strong><br><span style="font-size:0.75rem; color:var(--color-text-muted);">Cost: Rs. ${cost.toLocaleString()}</span></div>` :
        `<div><strong>Rs. ${p.price.toLocaleString()}</strong><br><span style="font-size:0.75rem; color:var(--color-text-muted);">Cost: Rs. ${cost.toLocaleString()}</span></div>`;

      return `
        <tr>
          <td><img src="${p.image}" alt="${escapeHtml(p.name)}" style="width:40px; height:48px; object-fit:cover; border-radius:4px;"></td>
          <td>
            <strong>${escapeHtml(p.name)}</strong>
            <br><span style="font-size:0.75rem; color:var(--color-text-muted);">${escapeHtml(p.fabric || 'Standard')}</span>
          </td>
          <td>${categoryBadge}</td>
          <td>${priceDisplay}</td>
          <td>
            <div style="display:flex; align-items:center; gap:0.3rem;">
              <button class="btn btn-secondary btn-sm" style="padding:1px 6px;" onclick="window.AimanStore.adjustStock('${p.id}', -1)">-</button>
              <strong style="min-width:24px; text-align:center;">${stock}</strong>
              <button class="btn btn-secondary btn-sm" style="padding:1px 6px;" onclick="window.AimanStore.adjustStock('${p.id}', 1)">+</button>
            </div>
            ${stockBadge}
          </td>
          <td>${newArrivalBtn}</td>
          <td>${statusSelector}</td>
          <td>${saleBtn}</td>
          <td>
            <div style="display:flex; gap:0.4rem;">
              <button class="btn btn-primary btn-sm" onclick="window.AimanStore.openAdminEditProductModal('${p.id}')" title="Edit Product">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-sm" onclick="window.AimanStore.deleteProduct('${p.id}')" title="Delete Product">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function addNewProduct(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const name = (formData.get('prod_name') || form.querySelector('[name=prod_name]')?.value || '').trim();
    if (!name) {
      showToast('⚠️ Please enter a product title!', 'error');
      return;
    }

    const rawCategory = formData.get('prod_category') || form.querySelector('[name=prod_category]')?.value || 'ridas';
    const price = parseFloat(formData.get('prod_price') || form.querySelector('[name=prod_price]')?.value) || 0;
    const costPrice = parseFloat(formData.get('prod_cost_price') || form.querySelector('[name=prod_cost_price]')?.value) || (price * 0.5);
    const image = (formData.get('prod_image') || form.querySelector('[name=prod_image]')?.value || '').trim() || 'images/luxury_rida.png';
    const fabric = (formData.get('prod_fabric') || form.querySelector('[name=prod_fabric]')?.value || '').trim() || 'Standard Fine Fabric';
    const description = (formData.get('prod_desc') || form.querySelector('[name=prod_desc]')?.value || '').trim();
    const isNewArrival = form.querySelector('#add_prod_is_new')?.checked ?? true;
    const customBadge = (formData.get('prod_badge') || form.querySelector('[name=prod_badge]')?.value || '').trim();
    const stockQuantity = parseInt(formData.get('prod_stock') || form.querySelector('[name=prod_stock]')?.value) || 25;
    const initialStatus = formData.get('prod_status') || form.querySelector('[name=prod_status]')?.value || 'available';

    let category = 'ridas';
    let subCategory = rawCategory;
    if (rawCategory === 'heavy-rida' || rawCategory === 'bridal-ridas') {
      category = 'bridal';
      subCategory = 'bridal-ridas';
    } else if (rawCategory === 'cotton-ridas' || rawCategory === 'cotton-pret') {
      category = 'cotton-pret';
      subCategory = 'cotton-ridas';
    } else if (rawCategory === 'handbags' || rawCategory === 'bags') {
      category = 'handbags';
      subCategory = 'bags';
    } else if (rawCategory === 'accessories' || rawCategory === 'cosmetics') {
      category = 'accessories';
      subCategory = 'cosmetics';
    }

    const badge = customBadge || (isNewArrival ? 'New Arrival' : 'Silk Pret');
    const badgeClass = isNewArrival ? 'new' : 'bestseller';

    const res = apiEngine.createProduct({
      name,
      category,
      subCategory,
      price,
      costPrice,
      originalPrice: Math.round(price * 1.25),
      image,
      fabric,
      description,
      stockQuantity,
      inStock: initialStatus === 'available',
      isNewArrival,
      isBooked: initialStatus === 'booked',
      isSoldOut: initialStatus === 'soldout',
      status: initialStatus,
      badge,
      badgeClass
    });

    if (res.success) {
      form.reset();
      const prevImg = document.getElementById('addProdPreviewImg');
      if (prevImg) prevImg.src = 'images/luxury_rida.png';
      renderAdminProducts();
      renderProductsCatalog();
      renderAdminMetrics();
      populateLogSaleProductDropdown();
      showToast(`✨ "${name}" successfully published to catalog!`, 'success');
    }
  }

  function toggleProductNewArrival(productId) {
    const res = apiEngine.toggleProductNewArrival(productId);
    if (res.success) {
      renderAdminProducts();
      renderProductsCatalog();
      showToast(res.isNewArrival ? '✨ Marked product as NEW ARRIVAL!' : 'Removed New Arrival status.', 'success');
    }
  }

  function deleteProduct(id) {
    if (confirm('Delete this product from catalog?')) {
      apiEngine.deleteProduct(id);
      renderAdminProducts();
      renderProductsCatalog();
      renderAdminMetrics();
      populateLogSaleProductDropdown();
      showToast('Product deleted from catalog.', 'info');
    }
  }

  function setProductStatus(productId, status) {
    const res = apiEngine.setProductStatus(productId, status);
    if (res.success) {
      renderAdminProducts();
      renderProductsCatalog();
      const msg = status === 'soldout' ? '🚫 Marked as SOLD OUT on storefront!' :
                  (status === 'booked' ? '🔒 Marked as BOOKED (Reserved) on storefront!' : '🟢 Marked as IN STOCK & Available!');
      showToast(msg, 'success');
    }
  }

  function toggleProductBooked(productId) {
    const res = apiEngine.toggleProductBooked(productId);
    if (res.success) {
      renderAdminProducts();
      renderProductsCatalog();
      showToast(res.isBooked ? '🔒 Product marked as BOOKED on storefront!' : '🟢 Product unbooked & available!', 'success');
    }
  }

  function toggleProductSoldOut(productId) {
    const res = apiEngine.toggleProductSoldOut(productId);
    if (res.success) {
      renderAdminProducts();
      renderProductsCatalog();
      showToast(res.isSoldOut ? '🚫 Product marked as SOLD OUT on storefront!' : '🟢 Product marked as available!', 'success');
    }
  }

  function openSaleModal(productId) {
    const p = apiEngine.getProductById(productId);
    if (!p) return;

    if (document.getElementById('sale_product_id')) document.getElementById('sale_product_id').value = p.id;
    if (document.getElementById('adminSaleProductName')) document.getElementById('adminSaleProductName').textContent = p.name;
    if (document.getElementById('sale_on_sale_toggle')) document.getElementById('sale_on_sale_toggle').checked = Boolean(p.onSale);
    if (document.getElementById('sale_original_price_display')) document.getElementById('sale_original_price_display').value = 'Rs. ' + p.price.toLocaleString();
    if (document.getElementById('sale_discounted_price')) document.getElementById('sale_discounted_price').value = p.salePrice || Math.round(p.price * 0.8);
    if (document.getElementById('sale_tag_input')) document.getElementById('sale_tag_input').value = p.saleTag || 'Bohra Festive Sale';

    openModal('adminSaleModal');
  }

  function saveProductSaleForm(event) {
    event.preventDefault();
    const id = document.getElementById('sale_product_id')?.value;
    if (!id) return;

    const onSale = document.getElementById('sale_on_sale_toggle')?.checked;
    const salePrice = document.getElementById('sale_discounted_price')?.value;
    const saleTag = document.getElementById('sale_tag_input')?.value;

    apiEngine.setProductSale(id, { onSale, salePrice, saleTag });
    closeModal('adminSaleModal');
    renderAdminProducts();
    renderProductsCatalog();
    showToast(onSale ? '🔥 Rida put on SALE / DISCOUNT!' : 'Sale status updated.', 'success');
  }

  function adjustStock(productId, delta) {
    const p = apiEngine.getProductById(productId);
    if (!p) return;
    const newQty = (p.stockQuantity !== undefined ? p.stockQuantity : 25) + delta;
    apiEngine.updateProductStock(productId, newQty);
    renderAdminProducts();
    renderAdminMetrics();
    renderProductsCatalog();
    showToast(`Stock updated to ${newQty} units.`, 'info');
  }

  function renderAdminExpenses() {
    const tbody = document.getElementById('adminExpensesTbody');
    if (!tbody) return;

    const expenses = apiEngine.expenses || [];
    tbody.innerHTML = expenses.map(e => `
      <tr>
        <td>${e.date}</td>
        <td><span class="badge badge-primary">${e.category}</span></td>
        <td><strong>${escapeHtml(e.title)}</strong><br><span style="font-size:0.75rem; color:var(--color-text-muted);">${escapeHtml(e.notes || '')}</span></td>
        <td>${escapeHtml(e.vendor || '-')}</td>
        <td style="color:#FFB020; font-weight:700;">Rs. ${(e.amount || 0).toLocaleString()}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="window.AimanStore.deleteExpense('${e.id}')" title="Delete Expense">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function handleManualExpenseLog(event) {
    event.preventDefault();
    const category = document.getElementById('logExpCategory').value;
    const title = document.getElementById('logExpTitle').value;
    const amount = parseFloat(document.getElementById('logExpAmount').value);
    const date = document.getElementById('logExpDate').value;
    const vendor = document.getElementById('logExpVendor').value;
    const notes = document.getElementById('logExpNotes').value;

    apiEngine.logExpense({ category, title, amount, date, vendor, notes });
    renderAdminExpenses();
    renderAdminMetrics();
    renderSalesChart(AppState.activeChartPeriod);
    showToast('✨ Business Expense logged and Net Operating Profit updated!', 'success');
  }

  function deleteExpense(id) {
    if (confirm('Delete this expense record?')) {
      apiEngine.deleteExpense(id);
      renderAdminExpenses();
      renderAdminMetrics();
      renderSalesChart(AppState.activeChartPeriod);
      showToast('Expense record deleted.', 'info');
    }
  }

  function openAdminEditProductModal(productId) {
    const product = apiEngine.getProductById(productId);
    if (!product) return;

    if (document.getElementById('edit_prod_id')) document.getElementById('edit_prod_id').value = product.id;
    if (document.getElementById('edit_prod_name')) document.getElementById('edit_prod_name').value = product.name;
    if (document.getElementById('edit_prod_category')) document.getElementById('edit_prod_category').value = product.category || 'silk-ridas';
    if (document.getElementById('edit_prod_cost_price')) document.getElementById('edit_prod_cost_price').value = product.costPrice || (product.price * 0.5);
    if (document.getElementById('edit_prod_price')) document.getElementById('edit_prod_price').value = product.price;
    if (document.getElementById('edit_prod_stock')) document.getElementById('edit_prod_stock').value = product.stockQuantity || 25;
    if (document.getElementById('edit_prod_fabric')) document.getElementById('edit_prod_fabric').value = product.fabric || '';
    if (document.getElementById('edit_prod_badge')) document.getElementById('edit_prod_badge').value = product.badge || '';
    if (document.getElementById('edit_prod_image')) document.getElementById('edit_prod_image').value = product.image || 'images/luxury_rida.png';
    if (document.getElementById('edit_prod_desc')) document.getElementById('edit_prod_desc').value = product.description || '';

    if (document.getElementById('edit_prod_status')) {
      const status = product.isSoldOut ? 'soldout' : (product.isBooked ? 'booked' : 'available');
      document.getElementById('edit_prod_status').value = status;
    }

    if (document.getElementById('edit_prod_is_new')) {
      document.getElementById('edit_prod_is_new').checked = Boolean(product.isNewArrival) || product.badgeClass === 'new' || Boolean(product.badge && product.badge.toLowerCase().includes('new'));
    }

    openModal('adminEditProductModal');
  }

  function saveAdminProductForm(event) {
    event.preventDefault();
    const id = document.getElementById('edit_prod_id')?.value;
    if (!id) return;

    const name = document.getElementById('edit_prod_name')?.value;
    const category = document.getElementById('edit_prod_category')?.value;
    const costPrice = parseFloat(document.getElementById('edit_prod_cost_price')?.value) || 0;
    const price = parseFloat(document.getElementById('edit_prod_price')?.value) || 0;
    const stockQuantity = parseInt(document.getElementById('edit_prod_stock')?.value) || 25;
    const status = document.getElementById('edit_prod_status')?.value || 'available';
    const isSoldOut = status === 'soldout';
    const isBooked = status === 'booked';
    const inStock = status === 'available' && stockQuantity > 0;
    const fabric = document.getElementById('edit_prod_fabric')?.value || '';
    const isNewArrival = document.getElementById('edit_prod_is_new') ? document.getElementById('edit_prod_is_new').checked : false;
    const customBadge = document.getElementById('edit_prod_badge')?.value?.trim();
    const badge = customBadge || (isNewArrival ? 'New Arrival' : 'Silk Pret');
    const badgeClass = isNewArrival ? 'new' : (badge.toLowerCase().includes('sale') ? 'sale' : 'bestseller');
    const image = document.getElementById('edit_prod_image')?.value || 'images/luxury_rida.png';
    const description = document.getElementById('edit_prod_desc')?.value || '';

    let subCategory = category;
    let mainCategory = category;
    if (category === 'heavy-rida' || category === 'bridal-ridas') {
      mainCategory = 'bridal';
      subCategory = 'bridal-ridas';
    } else if (category === 'cotton-ridas' || category === 'cotton-pret') {
      mainCategory = 'cotton-pret';
      subCategory = 'cotton-ridas';
    } else if (category === 'handbags' || category === 'bags') {
      mainCategory = 'handbags';
      subCategory = 'bags';
    } else if (category === 'accessories' || category === 'cosmetics') {
      mainCategory = 'accessories';
      subCategory = 'cosmetics';
    }

    apiEngine.updateProduct(id, {
      name,
      category: mainCategory,
      subCategory,
      costPrice,
      price,
      stockQuantity,
      status,
      isSoldOut,
      isBooked,
      inStock,
      fabric,
      isNewArrival,
      badge,
      badgeClass,
      image,
      description
    });

    closeModal('adminEditProductModal');
    renderAdminProducts();
    populateLogSaleProductDropdown();
    renderProductsCatalog();
    showToast('✨ Product updated live across website & admin!', 'success');
  }

  function renderAdminTransactions() {
    const tbody = document.getElementById('adminTransactionsTbody');
    if (!tbody) return;

    if (!apiEngine.transactions || apiEngine.transactions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--color-text-muted);"><i class="fas fa-receipt" style="font-size:1.5rem; margin-bottom:0.5rem; display:block; opacity:0.4;"></i>No payment transactions recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = apiEngine.transactions.map(t => `
      <tr>
        <td><code>${t.transactionRef}</code></td>
        <td>${t.orderId}</td>
        <td><span class="badge badge-primary">${t.gateway}</span></td>
        <td>Rs. ${t.amount.toLocaleString()}</td>
        <td>${t.accountNumber || t.senderName || 'Direct'}</td>
        <td>
          ${t.receiptUrl ? `<button class="btn btn-secondary btn-sm" onclick="window.AimanStore.openLightbox('${t.receiptUrl}', 'Payment Slip ${t.transactionRef}')"><i class="fas fa-image"></i> View Slip</button>` : '<span style="color:var(--color-text-muted); font-size:0.8rem;">Auto Verified</span>'}
        </td>
        <td><span class="badge badge-${t.status === 'PAID' ? 'success' : 'warning'}">${t.status}</span></td>
      </tr>
    `).join('');
  }

  function renderAdminEmailLogs() {
    const tbody = document.getElementById('adminEmailLogsTbody');
    if (!tbody) return;

    if (!apiEngine.emails || apiEngine.emails.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--color-text-muted);"><i class="fas fa-envelope-open" style="font-size:1.5rem; margin-bottom:0.5rem; display:block; opacity:0.4;"></i>No dispatched email receipts yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = apiEngine.emails.map(e => `
      <tr>
        <td><code>${e.id}</code></td>
        <td>${e.orderNumber}</td>
        <td>${escapeHtml(e.recipient)}</td>
        <td style="font-size:0.82rem;">${escapeHtml(e.subject)}</td>
        <td style="font-size:0.8rem; color:var(--color-text-muted);">${new Date(e.dispatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="window.AimanStore.previewOrderEmailById('${e.orderId}')">
            <i class="fas fa-eye"></i> View
          </button>
        </td>
      </tr>
    `).join('');
  }

  function renderAdminReviewsMod() {
    const tbody = document.getElementById('adminReviewsTbody');
    if (!tbody) return;

    if (!apiEngine.reviews || apiEngine.reviews.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--color-text-muted);"><i class="far fa-star" style="font-size:1.5rem; margin-bottom:0.5rem; display:block; opacity:0.4;"></i>No customer reviews submitted yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = apiEngine.reviews.map(r => `
      <tr>
        <td>
          <strong>${escapeHtml(r.customerName)}</strong>
          ${r.isVerifiedBuyer ? '<span class="verified-badge-pill" style="font-size:0.68rem; margin-left:4px;"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
          <br><span style="font-size:0.75rem; color:var(--color-text-muted);">${escapeHtml(r.customerEmail || 'Client Review')}</span>
        </td>
        <td style="font-size:0.82rem;">${escapeHtml(r.productName || 'General')}</td>
        <td style="color:#FFC107;">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</td>
        <td style="font-size:0.82rem;"><strong>"${escapeHtml(r.headline || '')}"</strong><br>${escapeHtml((r.comment || '').substring(0, 65))}...</td>
        <td>
          ${(r.photos && r.photos.length > 0) ? `<button class="btn btn-secondary btn-sm" onclick="window.AimanStore.openLightbox('${r.photos[0]}', '${escapeHtml(r.customerName)}')"><i class="fas fa-image"></i> ${r.photos.length} photo(s)</button>` : '<span style="color:var(--color-text-muted); font-size:0.75rem;">No Photo</span>'}
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-primary btn-sm" onclick="window.AimanStore.openAdminEditReviewModal('${r.id}')" title="Edit Review">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="window.AimanStore.deleteReview('${r.id}')" title="Delete Review">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function openAdminAddReviewModal() {
    const titleEl = document.getElementById('adminReviewModalTitle');
    if (titleEl) titleEl.textContent = 'Add New Customer Review';
    const form = document.getElementById('adminReviewForm');
    if (form) form.reset();
    const idInp = document.getElementById('admin_rev_id');
    if (idInp) idInp.value = '';

    const pSelect = document.getElementById('admin_rev_product');
    if (pSelect) {
      pSelect.innerHTML = apiEngine.products.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('');
    }

    const verifiedCheck = document.getElementById('admin_rev_verified');
    if (verifiedCheck) verifiedCheck.checked = true;

    openModal('adminEditReviewModal');
  }

  function openAdminEditReviewModal(reviewId) {
    const rev = apiEngine.reviews.find(r => String(r.id) === String(reviewId));
    if (!rev) return;

    const titleEl = document.getElementById('adminReviewModalTitle');
    if (titleEl) titleEl.textContent = 'Edit Client Review';

    const idInp = document.getElementById('admin_rev_id');
    if (idInp) idInp.value = rev.id;

    const pSelect = document.getElementById('admin_rev_product');
    if (pSelect) {
      pSelect.innerHTML = apiEngine.products.map(p => `
        <option value="${p.id}" ${p.id === rev.productId ? 'selected' : ''}>${escapeHtml(p.name)}</option>
      `).join('');
    }

    if (document.getElementById('admin_rev_name')) document.getElementById('admin_rev_name').value = rev.customerName || '';
    if (document.getElementById('admin_rev_email')) document.getElementById('admin_rev_email').value = rev.customerEmail || '';
    if (document.getElementById('admin_rev_rating')) document.getElementById('admin_rev_rating').value = rev.rating || 5;
    if (document.getElementById('admin_rev_headline')) document.getElementById('admin_rev_headline').value = rev.headline || '';
    if (document.getElementById('admin_rev_fit')) document.getElementById('admin_rev_fit').value = rev.fitRating || '';
    if (document.getElementById('admin_rev_comment')) document.getElementById('admin_rev_comment').value = rev.comment || '';
    if (document.getElementById('admin_rev_verified')) document.getElementById('admin_rev_verified').checked = Boolean(rev.isVerifiedBuyer);
    if (document.getElementById('admin_rev_photos')) document.getElementById('admin_rev_photos').value = (rev.photos || []).join(', ');

    openModal('adminEditReviewModal');
  }

  function handleAdminReviewPhotoUpload(input) {
    if (!input.files || input.files.length === 0) return;
    const targetInput = document.getElementById('admin_rev_photos');
    if (!targetInput) return;

    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const current = targetInput.value.trim();
        targetInput.value = current ? current + ', ' + e.target.result : e.target.result;
      };
      reader.readAsDataURL(file);
    });
    showToast('Photos loaded into review form!', 'success');
  }

  function saveAdminReviewForm(event) {
    event.preventDefault();
    const id = document.getElementById('admin_rev_id')?.value;
    const prodId = document.getElementById('admin_rev_product')?.value;
    const product = apiEngine.products.find(p => p.id === prodId);

    const rawPhotos = document.getElementById('admin_rev_photos')?.value || '';
    const photos = rawPhotos.split(',').map(p => p.trim()).filter(Boolean);

    const reviewData = {
      customerName: document.getElementById('admin_rev_name')?.value.trim() || 'Client',
      customerEmail: document.getElementById('admin_rev_email')?.value.trim() || '',
      productId: prodId,
      productName: product ? product.name : 'General Collection',
      rating: parseInt(document.getElementById('admin_rev_rating')?.value) || 5,
      headline: document.getElementById('admin_rev_headline')?.value.trim() || '',
      fitRating: document.getElementById('admin_rev_fit')?.value.trim() || 'True to Size',
      comment: document.getElementById('admin_rev_comment')?.value.trim() || '',
      isVerifiedBuyer: document.getElementById('admin_rev_verified')?.checked || false,
      photos: photos.length > 0 ? photos : ['images/luxury_rida.png']
    };

    if (id) {
      apiEngine.updateReview(id, reviewData);
      showToast('✨ Review updated and published!', 'success');
    } else {
      apiEngine.createReview(reviewData);
      showToast('✨ New review added and published!', 'success');
    }

    closeModal('adminEditReviewModal');
    renderAdminReviewsMod();
    renderPhotoReviews();
  }

  function deleteReview(id) {
    if (!confirm('Are you sure you want to remove this review?')) return;
    apiEngine.deleteReview(id);
    renderAdminReviewsMod();
    renderPhotoReviews();
    showToast('Review removed.', 'info');
  }

  function renderAdminFaqs() {
    const container = document.getElementById('adminFaqList');
    if (!container) return;

    const countLabel = document.getElementById('faqCountLabel');
    if (countLabel) countLabel.textContent = apiEngine.botRules.length;

    container.innerHTML = apiEngine.botRules.map((rule, idx) => `
      <div style="background:var(--color-bg-elevated); padding:1rem; border-radius:var(--radius-sm); border:1px solid var(--color-border-subtle); margin-bottom:0.8rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem;">
          <span style="font-size:0.78rem; color:var(--color-gold-primary); font-weight:700;">Keywords: ${rule.keywords.join(', ')}</span>
          <div style="display:flex; gap:0.4rem;">
            <button class="copy-btn-mini" style="background:var(--color-gold-primary); color:#000;" onclick="window.AimanStore.openAdminEditFaqModal(${idx})">Edit</button>
            <button class="copy-btn-mini" style="background:rgba(239,68,68,0.2); color:#EF4444; border-color:rgba(239,68,68,0.4);" onclick="window.AimanStore.deleteFaq(${idx})">Delete</button>
          </div>
        </div>
        <p style="font-size:0.82rem; color:var(--color-text-secondary); margin:0;">${rule.responseEnglish}</p>
      </div>
    `).join('');
  }

  function saveBotSettings(event) {
    event.preventDefault();
    const phone = document.getElementById('set_phone')?.value.trim() || '923452439196';
    const botName = document.getElementById('set_botname')?.value.trim() || 'Aiman AI Stylist';
    const phoneId = document.getElementById('set_meta_phone_id')?.value.trim() || '';
    const token = document.getElementById('set_meta_token')?.value.trim() || '';
    const verifyToken = document.getElementById('set_meta_verify_token')?.value.trim() || 'AIMAN_WHATSAPP_SECRET_7860';
    const welcome = document.getElementById('set_welcome')?.value.trim() || '';

    const botConfig = {
      phone,
      botName,
      phoneId,
      token,
      verifyToken,
      welcome
    };

    localStorage.setItem('aiman_bot_settings', JSON.stringify(botConfig));
    WHATSAPP_NUMBER = phone.replace(/\D/g, '');

    showToast('🟢 Website Owner WhatsApp & Meta Bot Gateway Saved!', 'success');
  }

  function generateWhatsAppQR() {
    const qrContainer = document.getElementById('waQrCodeBox');
    const statusBadge = document.getElementById('waPairStatusBadge');
    if (!qrContainer) return;

    const isPaired = localStorage.getItem('aiman_whatsapp_paired') === 'true';
    if (isPaired) {
      confirmDevicePairing();
      return;
    }

    const pairingCode = 'AIMAN_ATELIER_' + Math.random().toString(36).substring(2, 8).toUpperCase() + '_' + Date.now();
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=0B141A&bgcolor=FFFFFF&data=${encodeURIComponent('https://wa.me/' + WHATSAPP_NUMBER + '?text=AIMAN_CONNECT_AGENT_' + pairingCode)}`;

    qrContainer.innerHTML = `
      <div style="position: relative; width: 190px; height: 190px; margin: 0 auto; background: #FFF; padding: 10px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
        <img src="${qrUrl}" alt="WhatsApp Pairing QR Code" style="width: 100%; height: 100%; object-fit: contain;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid #FFF;">
          <i class="fab fa-whatsapp" style="font-size: 22px; color: #FFF;"></i>
        </div>
      </div>
      <div style="margin-top: 0.8rem; font-size: 0.8rem; color: var(--color-gold-light);">
        <i class="fas fa-qrcode"></i> Scan with WhatsApp Camera
      </div>
    `;

    if (statusBadge) {
      statusBadge.className = 'badge badge-warning';
      statusBadge.textContent = '🟡 Ready to Scan';
    }
  }

  function confirmDevicePairing() {
    const qrContainer = document.getElementById('waQrCodeBox');
    const statusBadge = document.getElementById('waPairStatusBadge');
    const pairDetails = document.getElementById('waPairDetails');

    if (statusBadge) {
      statusBadge.className = 'badge badge-success';
      statusBadge.textContent = '🟢 Connected & Active';
    }

    if (qrContainer) {
      qrContainer.innerHTML = `
        <div style="padding: 1.2rem 1rem; background: rgba(37, 211, 102, 0.12); border: 1px solid rgba(37, 211, 102, 0.3); border-radius: var(--radius-md); text-align: center; max-width: 220px; margin: 0 auto;">
          <div style="width: 52px; height: 52px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.8rem; font-size: 1.5rem; color: #FFF; box-shadow: 0 4px 12px rgba(37,211,102,0.4);">
            <i class="fas fa-check"></i>
          </div>
          <h4 style="color: #25D366; font-size: 0.95rem; margin-bottom: 0.3rem;">Mobile Linked!</h4>
          <span style="font-size: 0.78rem; color: var(--color-text-secondary); display: block; margin-bottom: 0.4rem;">
            Owner WhatsApp <strong>+${WHATSAPP_NUMBER}</strong> is active.
          </span>
          <span style="font-size: 0.72rem; color: var(--color-gold-light); display: block;">
            🤖 AI Auto-Reply Enabled 24/7
          </span>
        </div>
      `;
    }

    if (pairDetails) {
      pairDetails.style.display = 'block';
    }

    localStorage.setItem('aiman_whatsapp_paired', 'true');
  }

  function disconnectWhatsAppDevice() {
    localStorage.removeItem('aiman_whatsapp_paired');
    const statusBadge = document.getElementById('waPairStatusBadge');
    if (statusBadge) {
      statusBadge.className = 'badge badge-danger';
      statusBadge.textContent = '🔴 Disconnected';
    }
    generateWhatsAppQR();
    showToast('WhatsApp Device Disconnected.', 'info');
  }

  function exportWhatsAutoCSV() {
    const rules = apiEngine.botRules;
    let csvContent = 'Incoming,Reply\n';

    // Add standard AI responses
    csvContent += `"price, rate, catalog, silk, rida, designs","✨ Khush Amdeed! Hamari Bohra Ridas start from Rs. 3,600 (Cotton daily wear), Luxury Silk Ridas from Rs. 5,200, matching Rida Bags from Rs. 4,800, and Topi/Cosmetic Pouches from Rs. 1,800. Use promo code AIMAN25 for 25% discount!"\n`;
    csvContent += `"custom, stitch, measurement, size, naap","✨ Aiman Collection Bespoke Stitching: Hum Dawoodi Bohra Libas & Ridas ki custom stitching exact naap ke mutabiq karte hain. Please provide Pardi Length, Ghagra Length, and Bust size."\n`;
    csvContent += `"pay, account, easypaisa, jazzcash, bank, raast","💳 Official Accounts: EasyPaisa 03428301490 (Title: Tahir) | JazzCash 03252005028 (Title: Tahir) | Meezan Bank Raast 03452439196 (Title: Tahir) | COD Nationwide Available via TCS."\n`;
    csvContent += `"track, order, status, parcel","📦 Please provide your Order Number (e.g. AC-2026-8491) to track your delivery."\n`;

    rules.forEach(r => {
      const incoming = r.keywords.join(', ');
      const reply = r.responseEnglish.replace(/"/g, '""');
      csvContent += `"${incoming}","${reply}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aiman_WhatsAuto_Rules_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('📥 WhatsAuto CSV downloaded! Import it into WhatsAuto > Custom Reply.', 'success');
  }

  function simulateAdminWhatsAppTest() {
    const input = document.getElementById('adminTestMsgInput');
    const output = document.getElementById('adminTestReplyOutput');
    if (!input || !output) return;

    const msg = input.value.trim();
    if (!msg) {
      showToast('Please type a test message first.', 'info');
      return;
    }

    output.innerHTML = '<span style="color:var(--color-gold-primary);"><i class="fas fa-spinner fa-spin"></i> AI Stylist generating WhatsApp response...</span>';

    setTimeout(() => {
      const reply = processAIIntent(msg);
      output.innerHTML = `<strong>Customer Message:</strong> "${escapeHtml(msg)}"\n\n<strong>🤖 AI Auto-Reply (Sent to WhatsApp):</strong>\n${formatWhatsAppText(reply)}`;
      showToast('AI Auto-Reply simulated successfully!', 'success');
    }, 400);
  }

  function openAdminEditFaqModal(idx) {
    const rule = apiEngine.botRules[idx];
    if (!rule) return;

    if (document.getElementById('edit_faq_idx')) document.getElementById('edit_faq_idx').value = idx;
    if (document.getElementById('edit_faq_keywords')) document.getElementById('edit_faq_keywords').value = rule.keywords.join(', ');
    if (document.getElementById('edit_faq_response')) document.getElementById('edit_faq_response').value = rule.responseEnglish;

    openModal('adminEditFaqModal');
  }

  function saveAdminFaqForm(event) {
    event.preventDefault();
    const idx = parseInt(document.getElementById('edit_faq_idx')?.value);
    const keywords = document.getElementById('edit_faq_keywords')?.value.split(',').map(k => k.trim()).filter(Boolean);
    const responseEnglish = document.getElementById('edit_faq_response')?.value.trim();

    apiEngine.updateBotRule(idx, {
      keywords,
      responseEnglish
    });

    closeModal('adminEditFaqModal');
    renderAdminFaqs();
    showToast('✨ WhatsApp Auto-Reply trigger updated!', 'success');
  }

  function renderAdminLeads() {
    const container = document.getElementById('adminLeadsList');
    if (!container) return;

    if (apiEngine.leads.length === 0) {
      container.innerHTML = `<p style="color:var(--color-text-muted); font-size:0.85rem;">No active leads yet.</p>`;
      return;
    }

    container.innerHTML = apiEngine.leads.map(l => `
      <div style="background:var(--color-bg-elevated); padding:1rem; border-radius:var(--radius-sm); border-left:3px solid var(--color-accent-whatsapp); margin-bottom:0.8rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <strong style="color:#FFF;">${escapeHtml(l.name)} (${escapeHtml(l.phone)})</strong>
            <span class="badge badge-success" style="margin-left:6px;">${l.status}</span>
          </div>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-primary btn-sm" onclick="window.AimanStore.openAdminEditLeadModal('${l.id}')" title="Edit Lead">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="window.AimanStore.deleteLead('${l.id}')" title="Delete Lead">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
        <p style="font-size:0.85rem; color:var(--color-text-secondary); margin:0.4rem 0;">"${escapeHtml(l.lastMessage || '')}"</p>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--color-text-muted);">
          <span>Interest: ${escapeHtml(l.productInterest || 'General')}</span>
          <span>${new Date(l.createdAt).toLocaleDateString()}</span>
        </div>
        ${l.notes ? `<div style="font-size:0.75rem; color:var(--color-gold-light); margin-top:4px;"><strong>Notes:</strong> ${escapeHtml(l.notes)}</div>` : ''}
      </div>
    `).join('');
  }

  function openAdminEditLeadModal(leadId) {
    const lead = apiEngine.leads.find(l => String(l.id) === String(leadId));
    if (!lead) return;

    if (document.getElementById('edit_lead_id')) document.getElementById('edit_lead_id').value = lead.id;
    if (document.getElementById('edit_lead_name')) document.getElementById('edit_lead_name').value = lead.name;
    if (document.getElementById('edit_lead_phone')) document.getElementById('edit_lead_phone').value = lead.phone;
    if (document.getElementById('edit_lead_status')) document.getElementById('edit_lead_status').value = lead.status || 'HOT_LEAD';
    if (document.getElementById('edit_lead_interest')) document.getElementById('edit_lead_interest').value = lead.productInterest || '';
    if (document.getElementById('edit_lead_notes')) document.getElementById('edit_lead_notes').value = lead.notes || '';

    openModal('adminEditLeadModal');
  }

  function saveAdminLeadForm(event) {
    event.preventDefault();
    const id = document.getElementById('edit_lead_id')?.value;
    if (!id) return;

    const name = document.getElementById('edit_lead_name')?.value;
    const phone = document.getElementById('edit_lead_phone')?.value;
    const status = document.getElementById('edit_lead_status')?.value;
    const productInterest = document.getElementById('edit_lead_interest')?.value;
    const notes = document.getElementById('edit_lead_notes')?.value;

    apiEngine.updateLead(id, {
      name,
      phone,
      status,
      productInterest,
      notes
    });

    closeModal('adminEditLeadModal');
    renderAdminLeads();
    showToast('✨ Customer lead status and notes updated!', 'success');
  }

  function deleteLead(id) {
    if (confirm('Delete this customer lead?')) {
      apiEngine.deleteLead(id);
      renderAdminLeads();
      showToast('Lead removed.', 'info');
    }
  }


  function updateOrderStatus(orderId, newStatus) {
    apiEngine.updateOrderStatus(orderId, newStatus);
    renderAdminOrders();
    showToast(`Order status updated to ${newStatus}.`, 'success');
  }

  function printInvoice(orderId) {
    previewOrderEmailById(orderId);
    setTimeout(() => printEmailReceipt(), 500);
  }

  function updateHeroBanner(event) {
    if (event) event.preventDefault();
    const inputEl = document.getElementById('heroBannerUrlInput') || document.getElementById('admin_hero_img');
    const url = inputEl ? inputEl.value.trim() : '';
    if (!url) return;

    localStorage.setItem('aiman_hero_image', url);
    const heroImg = document.getElementById('heroVisualImg') || document.getElementById('hero-img');
    if (heroImg) heroImg.src = url;
    showToast('Hero banner image updated!', 'success');
  }

  function handleBannerUpload(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const inputEl = document.getElementById('heroBannerUrlInput') || document.getElementById('admin_hero_img');
      if (inputEl) inputEl.value = e.target.result;
      const heroImg = document.getElementById('heroVisualImg') || document.getElementById('hero-img');
      if (heroImg) heroImg.src = e.target.result;
      localStorage.setItem('aiman_hero_image', e.target.result);
      showToast('Custom banner uploaded and applied!', 'success');
    };
    reader.readAsDataURL(input.files[0]);
  }

  function exportBackupJSON() {
    const backup = {
      products: apiEngine.products,
      sales: apiEngine.sales,
      orders: apiEngine.orders,
      reviews: apiEngine.reviews,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aiman_collection_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON exported successfully.', 'success');
  }

  function importBackupJSON(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const backup = JSON.parse(e.target.result);
        if (backup.products) apiEngine.products = backup.products;
        if (backup.sales) apiEngine.sales = backup.sales;
        if (backup.orders) apiEngine.orders = backup.orders;
        if (backup.reviews) apiEngine.reviews = backup.reviews;

        apiEngine.save('aiman_products', apiEngine.products);
        apiEngine.save('aiman_sales', apiEngine.sales);
        apiEngine.save('aiman_orders_db_v2', apiEngine.orders);
        apiEngine.save('aiman_reviews_db_v2', apiEngine.reviews);

        renderAdminMetrics();
        renderAdminProducts();
        renderAdminSales();
        renderAdminOrders();
        renderProductsCatalog();
        renderPhotoReviews();
        showToast('Backup restored successfully!', 'success');
      } catch (err) {
        showToast('Invalid backup JSON file.', 'error');
      }
    };
    reader.readAsText(input.files[0]);
  }

  function addNewFaq(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const keywords = data.get('faq_keywords').split(',').map(k => k.trim());
    const responseEnglish = data.get('faq_response');

    apiEngine.addBotRule({
      keywords,
      responseEnglish,
      isActive: true,
      priority: 1
    });

    form.reset();
    renderAdminFaqs();
    showToast('WhatsApp Auto-Reply Trigger added!', 'success');
  }

  function deleteFaq(idx) {
    apiEngine.deleteBotRule(idx);
    renderAdminFaqs();
    showToast('Bot rule deleted.', 'info');
  }



  const BLOG_ARTICLES = {
    'guide-1': {
      title: 'The Ultimate Dawoodi Bohra Rida Style Guide: Modern Trends & Timeless Traditions',
      tag: 'Bohra Fashion & Heritage',
      readTime: '4 min read',
      date: 'August 2026',
      author: 'Aiman Stylist Team',
      image: 'images/luxury_rida.png',
      content: `
        <p style="margin-bottom:1rem;">The Dawoodi Bohra Rida is more than just modest attire; it is an artistic expression of grace, cultural heritage, and refined craftsmanship. Over decades, Rida fashion has evolved from classical single-color cottons to intricate multi-panel artworks featuring French laces, digital florals, crochet borders, and hand-embroidered zari motifs.</p>
        
        <h4 style="color:var(--color-gold-light); margin:1.2rem 0 0.6rem 0;">1. The Anatomy of an Authentic Bohra Rida</h4>
        <p style="margin-bottom:1rem;">A traditional Rida consists of two harmoniously balanced components:
        <ul style="list-style:disc; margin-left:1.5rem; margin-top:0.4rem;">
          <li style="margin-bottom:0.4rem;"><strong>The Pardi (Top Drape):</strong> Designed with a tailored headpiece, flap, and front paneling that frames the face with delicate organza or crochet trims.</li>
          <li><strong>The Ghagra (Skirt):</strong> A voluminous flared skirt adorned with matching border laces, ribbon work, or contrasting panel borders (patti).</li>
        </ul>
        </p>

        <h4 style="color:var(--color-gold-light); margin:1.2rem 0 0.6rem 0;">2. Fabric Choices: From Daily Wear to Miqaat Couture</h4>
        <p style="margin-bottom:1rem;">For daily wear, breathable 100% Egyptian Cotton and soft Lawn fabrics are ideal for summer comfort. For formal miqaats, majalis, and wedding celebrations, Pure Silk Velvet, Raw Silk, and Chiffon with metallic gold zari work create an undeniable aura of regal sophistication.</p>

        <h4 style="color:var(--color-gold-light); margin:1.2rem 0 0.6rem 0;">3. Styling Advice from Aiman Collection</h4>
        <p>Pair your pastel ridas with soft gold or silver metallic batwas. When wearing darker tones like Emerald Green, Midnight Navy, or Burgundy, coordinate with matching velvet cosmetic pouches and handcrafted leather totes from our bespoke boutique.</p>
      `
    },
    'guide-2': {
      title: 'How to Care for Your Heavy Zari & Pure Silk Ridas at Home',
      tag: 'Fabric Care & Preservation',
      readTime: '3 min read',
      date: 'August 2026',
      author: 'Master Artisan',
      image: 'images/luxury_rida.png',
      content: `
        <p style="margin-bottom:1rem;">A handcrafted luxury Rida with genuine zari laces and delicate applique work requires mindful care to preserve its lustrous shine and fabric integrity over generations.</p>

        <h4 style="color:var(--color-gold-light); margin:1.2rem 0 0.6rem 0;">1. Cleaning Guidelines</h4>
        <p style="margin-bottom:1rem;">Never machine-wash heavy zari or silk ridas. Always opt for professional gentle dry cleaning. For daily cotton ridas, hand wash in cold water with mild detergent and dry in the shade to maintain vibrant color saturation.</p>

        <h4 style="color:var(--color-gold-light); margin:1.2rem 0 0.6rem 0;">2. Safe Ironing & Steaming</h4>
        <p style="margin-bottom:1rem;">Always steam or iron on the reverse side of the fabric using a low to medium silk temperature setting. Place a thin cotton cloth over zari laces to protect metallic threads from heat oxidation.</p>

        <h4 style="color:var(--color-gold-light); margin:1.2rem 0 0.6rem 0;">3. Proper Storage</h4>
        <p>Store your festive ridas in breathable muslin cloth bags rather than plastic polybags. Add natural cedar balls or dried lavender sachets to protect against humidity without damaging delicate laces.</p>
      `
    },
    'guide-3': {
      title: 'The Art of Coordinating Ridas with Matching Batwas & Pouches',
      tag: 'Accessories & Styling',
      readTime: '3 min read',
      date: 'August 2026',
      author: 'Fashion Editorial',
      image: 'images/designer_handbag.png',
      content: `
        <p style="margin-bottom:1rem;">An exquisite Bohra outfit is never complete without coordinated accessories. At Aiman Collection, each rida is thoughtfully designed alongside complementary batwas, vanity boxes, and prayer topi cases.</p>

        <h4 style="color:var(--color-gold-light); margin:1.2rem 0 0.6rem 0;">1. Matching Batwas for Formal Gatherings</h4>
        <p style="margin-bottom:1rem;">For weddings and auspicious miqaats, our gold-threaded velvet batwas and pearl-embellished pouches effortlessly elevate your formal ensemble while comfortably holding your daily essentials.</p>

        <h4 style="color:var(--color-gold-light); margin:1.2rem 0 0.6rem 0;">2. Dual-Deck Vanity & Topi Organizers</h4>
        <p>Keep your cosmetic essentials and embellished topis organized in our luxury satin-lined cases. Featuring wipe-clean waterproof linings, sturdy gold zippers, and dedicated compartments for jewelry and perfumes.</p>
      `
    }
  };

  function openBlogModal(guideId) {
    const article = BLOG_ARTICLES[guideId] || BLOG_ARTICLES['guide-1'];
    const container = document.getElementById('blogArticleModalContent');
    if (!container) return;

    container.innerHTML = `
      <div style="margin-bottom: 1.2rem;">
        <span class="badge badge-primary" style="margin-bottom: 0.5rem; display: inline-block;">${article.tag}</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--color-gold-light); line-height: 1.3; margin-bottom: 0.5rem;">${article.title}</h2>
        <div style="font-size: 0.8rem; color: var(--color-text-muted); display: flex; gap: 1rem;">
          <span><i class="far fa-calendar-alt"></i> ${article.date}</span>
          <span><i class="far fa-clock"></i> ${article.readTime}</span>
          <span><i class="fas fa-user-edit"></i> ${article.author}</span>
        </div>
      </div>
      <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 220px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1.2rem;">
      <div style="font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.7;">
        ${article.content}
      </div>
      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <span style="font-size: 0.82rem; color: var(--color-gold-light); font-weight: 700;">Explore matching collections at Aiman Collection</span>
        <button class="btn btn-primary btn-sm" onclick="window.AimanStore.closeModal('blogArticleModal'); window.AimanStore.setCategory('all');">
          <i class="fas fa-shopping-bag"></i> Shop This Style
        </button>
      </div>
    `;

    document.getElementById('blogArticleModal')?.classList.add('active');
  }

  function openMeasurementModal() {
    document.getElementById('measurementModal')?.classList.add('active');
  }

  /* Utility escape HTML */
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  /* ==========================================================================
     12. FESTIVE COUNTDOWN TIMER & EVENT LISTENERS
     ========================================================================== */
  function initCountdownTimer() {
    const hEl = document.getElementById('flashHours');
    const mEl = document.getElementById('flashMinutes');
    const sEl = document.getElementById('flashSeconds');
    if (!hEl && !mEl && !sEl) return;

    let totalSeconds = 2 * 3600 + 45 * 60 + 18;
    setInterval(() => {
      if (totalSeconds > 0) totalSeconds--;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      if (hEl) hEl.textContent = String(h).padStart(2, '0');
      if (mEl) mEl.textContent = String(m).padStart(2, '0');
      if (sEl) sEl.textContent = String(s).padStart(2, '0');
    }, 1000);
  }

  function initListeners() {
    // Currency Selector
    const currSelect = document.getElementById('currencySelector');
    if (currSelect) {
      currSelect.value = AppState.currency;
      currSelect.addEventListener('change', (e) => {
        AppState.currency = e.target.value;
        saveLocalState();
        renderProductsCatalog();
        updateCartUI();
        showToast(`Currency converted to ${AppState.currency}`, 'info');
      });
    }

    // Category Tabs in Hero / Catalog
    document.querySelectorAll('.category-chip, .filter-btn, .filter-pills button, .ribbon-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = btn.getAttribute('data-category') || btn.getAttribute('data-cat') || 'all';
        setCategory(cat);
      });
    });

    // Catalog Search & Sort
    const searchInput = document.getElementById('catalogSearchInput') || document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        AppState.searchQuery = e.target.value;
        renderProductsCatalog();
      });
    }

    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        AppState.sortBy = e.target.value;
        renderProductsCatalog();
      });
    }

    // Mobile nav toggle
    const navToggle = document.getElementById('mobileNavToggle');
    const mainNav = document.getElementById('mainNavMenu');
    if (navToggle && mainNav) {
      navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('mobile-open');
      });
    }

    // Chat enter key
    const chatInp = document.getElementById('waChatInput');
    if (chatInp) {
      chatInp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendWhatsAppAIMessage();
        }
      });
    }

    // Daraz Search input enter key & outside click dismiss
    const darazInput = document.getElementById('darazSearchInput');
    if (darazInput) {
      darazInput.addEventListener('focus', () => {
        handleGlobalSearchFocus();
      });
      darazInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeGlobalSearch();
        }
      });
    }

    // Dismiss search dropdown on clicking outside
    document.addEventListener('click', (e) => {
      const searchWrap = document.querySelector('.daraz-search-wrap');
      const dropdown = document.getElementById('globalSearchDropdown');
      if (dropdown && searchWrap && !searchWrap.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });

    // Global Admin Keyboard Shortcut (Ctrl+Shift+A or Cmd+Shift+A)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        openAdminLoginModal();
      }
    });
  }

  /* ==========================================================================
     12.1 BILINGUAL (URDU / ENGLISH) TRANSLATION ENGINE & DEALS (HYDERI STYLE)
     ========================================================================== */
  const I18N_DICTIONARY = {
    en: {
      lookbook: "Festive Lookbook",
      track_order: "Track Order",
      customer_care: "Customer Care",
      cat_all: "All Products",
      cat_deals: "SUPER DEALS 🔥",
      cat_ridas: "Ridas",
      cat_bags: "Bags",
      cat_cosmetics: "Cosmetic Bags",
      cat_other: "Other",
      cat_lookbook: "Lookbook",
      cat_stitching: "Custom Stitching",
      super_deals_tag: "EXCLUSIVE FESTIVE BOHRA COMBOS",
      deals_heading: "Bachat Super Deals & Combos",
      deals_subheading: "Pre-matched Rida, Bag & Vanity Bundles with special festive savings",
      deal_ends_in: "Ends In:",
      deal1_title: "Bohra Bridal Royale Combo",
      deal1_desc: "Includes: Heavy Zardozi Boti Bridal Silk Rida + Matching Designer Suede Leather Handbag + Velvet Jewelry Batwa.",
      deal2_title: "Twin Festive Silk Rida Duo",
      deal2_desc: "Includes: Emerald Luxury Silk Rida + Pastel Lavender Cotton Rida with intricate gold lace & tailored pardi.",
      deal3_title: "Dawoodi Bohra Vanity Trio",
      deal3_desc: "Includes: Tea Time Table Safra + Dual-Deck Cosmetic Organizer Pouch + Velvet Topi & Tasbeeh Batwa.",
      add_deal_btn: "Grab Combo Deal",
      lookbook_title: "Dawoodi Bohra Festive Lookbook",
      lookbook_subtitle: "Flip through our signature bespoke collection of ceremonial Ridas, handmade leather bags, and vanity accessories."
    },
    ur: {
      lookbook: "ڈیجیٹل بروشر / لک بک",
      track_order: "آرڈر ٹریک کریں",
      customer_care: "کسٹمر کیئر",
      cat_all: "تمام پراڈکٹس",
      cat_deals: "بچت ڈیلز 🔥",
      cat_ridas: "ردائیں (لباس)",
      cat_bags: "بیگز اور بٹوے",
      cat_cosmetics: "کاسمیٹک بیگز",
      cat_other: "دیگر اشیاء",
      cat_lookbook: "بروشر",
      cat_stitching: "درزی ناپ گائیڈ",
      super_deals_tag: "داؤدی بوہرہ اسپیشل بچت ڈیلز",
      deals_heading: "اسپیشل فیسٹیو کمبو ڈیلز",
      deals_subheading: "ردائیں، ہینڈ بیگز اور کاسمیٹک پاؤچز کا مکمل کمبو پیکج",
      deal_ends_in: "ڈیل ختم ہونے میں:",
      deal1_title: "بوہرہ برائیڈل رائل کمبو",
      deal1_desc: "شامل ہے: زردوزی بوٹی برائیڈل سلک ردا + میچنگ سوئیڈ لیدر ہینڈ بیگ + مخصوس جیولری بٹوہ۔",
      deal2_title: "ٹوئن فیسٹیو سلک ردا جوڑی",
      deal2_desc: "شامل ہے: ایمرلڈ گرین لگژری سلک ردا + پیسٹل لیونڈر کاٹن ردا مع باریک زری پردی۔",
      deal3_title: "داؤدی بوہرہ مکمل وینٹی ٹریو",
      deal3_desc: "شامل ہے: ٹی ٹائم دسترخوان سفرا + ڈوئل ڈیک کاسمیٹک آرگنائزر + مخملی ٹوپی و تسبیح بٹوہ۔",
      add_deal_btn: "کمبو ڈیل حاصل کریں 🛒",
      lookbook_title: "داؤدی بوہرہ فیسٹیو لک بک",
      lookbook_subtitle: "شاندار اور نفیس ہاتھ کے کام والی ردائیں، میچنگ بیگز اور بروشر کلیکشن دیکھیں۔"
    }
  };

  let currentLanguage = localStorage.getItem('aiman_lang') || 'en';

  function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('aiman_lang', lang);
    document.documentElement.lang = lang;
    
    const enBtn = document.getElementById('langBtnEN');
    const urBtn = document.getElementById('langBtnUR');

    if (lang === 'ur') {
      document.body.classList.add('lang-urdu');
      if (enBtn) {
        enBtn.style.background = 'transparent';
        enBtn.style.color = 'var(--color-gold-light)';
      }
      if (urBtn) {
        urBtn.style.background = 'var(--color-gold-primary)';
        urBtn.style.color = '#000';
      }
    } else {
      document.body.classList.remove('lang-urdu');
      if (enBtn) {
        enBtn.style.background = 'var(--color-gold-primary)';
        enBtn.style.color = '#000';
      }
      if (urBtn) {
        urBtn.style.background = 'transparent';
        urBtn.style.color = 'var(--color-gold-light)';
      }
    }

    // Update all i18n tagged elements
    const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  function initDealCountdown() {
    const el = document.getElementById('dealCountdown');
    if (!el) return;
    let seconds = 8 * 3600 + 42 * 60 + 15;
    setInterval(() => {
      if (seconds > 0) seconds--;
      const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      el.textContent = `${h}h : ${m}m : ${s}s`;
    }, 1000);
  }

  function addComboDealToCart(dealType) {
    let dealProduct = null;
    if (dealType === 'deal-bridal') {
      dealProduct = {
        id: 'deal-bridal-combo',
        name: 'Bohra Bridal Royale Combo (3-Pc)',
        price: 9999,
        originalPrice: 12500,
        image: 'images/luxury_rida.png',
        fabric: 'Zardozi Silk Rida + Suede Handbag + Batwa',
        badge: 'Super Combo',
        badgeClass: 'bestseller'
      };
    } else if (dealType === 'deal-twin') {
      dealProduct = {
        id: 'deal-twin-silk',
        name: 'Twin Festive Silk Rida Duo (2-Pc)',
        price: 7200,
        originalPrice: 8800,
        image: 'images/lavender_rida.png',
        fabric: 'Emerald Silk Rida + Pastel Lavender Rida',
        badge: 'Festive Duo',
        badgeClass: 'bestseller'
      };
    } else {
      dealProduct = {
        id: 'deal-vanity-trio',
        name: 'Dawoodi Bohra Vanity Trio (3-Pc)',
        price: 2499,
        originalPrice: 3300,
        image: 'images/cosmetic_bag.png',
        fabric: 'Tea Safra + Cosmetic Organizer + Velvet Batwa',
        badge: 'Vanity Bundle',
        badgeClass: 'bestseller'
      };
    }

    addToCart(dealProduct.id, 'Standard', dealProduct);
    openCart();

        // Trigger Celebration Confetti (disabled on mobile or reduced motion)
    if (!window.matchMedia('(max-width: 480px), (prefers-reduced-motion: reduce)').matches) {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }

    showToast(`🎉 ${dealProduct.name} added to your bag with combo savings!`, 'success');
  }

  function openLookbookModal() {
    openModal('lookbookModal');
  }

  /* ==========================================================================
     13. APPLICATION BOOTSTRAP
     ========================================================================== */
  function init() {
    loadLocalState();
    renderProductsCatalog();
    renderPhotoReviews();
    updateCartUI();
    updateWishlistUI();
    applyFrontendSettings();
    applyPaymentSettings();
    initCountdownTimer();
    initDealCountdown();
    initListeners();
    setLanguage(currentLanguage);
    checkMongoAtlasHealth();

    function checkAdminHash() {
      const hash = window.location.hash || '';
      const isSearchAdmin = window.location.search && window.location.search.includes('admin=true');
      if (hash.startsWith('#admin') || isSearchAdmin) {
        openAdmin();
        if (hash === '#admin-sales') switchAdminTab('sales');
        else if (hash === '#admin-expenses') switchAdminTab('expenses');
        else if (hash === '#admin-products') switchAdminTab('products');
        else if (hash === '#admin-frontend-editor') switchAdminTab('frontend-editor');
        else if (hash === '#admin-orders') switchAdminTab('orders');
        else if (hash === '#admin-ai-assistant') switchAdminTab('ai-assistant');
        else if (hash === '#admin-reviews') switchAdminTab('reviews');
        else if (hash === '#admin' || hash === '#admin-dashboard') switchAdminTab('dashboard');
      }
    }
    checkAdminHash();
    window.addEventListener('hashchange', checkAdminHash);

    apiEngine.subscribe(({ event, payload }) => {
      console.log(`[Aiman Engine Event]: ${event}`, payload);
      renderAdminMetrics();
      if (event === 'PRODUCTS_SYNCED') {
        renderProductsCatalog();
        renderAdminProducts();
        populateLogSaleProductDropdown();
      }
      if (event === 'SALES_SYNCED') {
        renderAdminSales();
        renderSalesChart(AppState.activeChartPeriod);
      }
      if (event === 'EXPENSES_SYNCED') {
        renderAdminExpenses();
      }
      if (event === 'REVIEWS_SYNCED') {
        renderPhotoReviews();
        renderAdminReviewsMod();
      }
      if (event === 'ORDERS_SYNCED') {
        renderAdminOrders();
      }
    });
  }

  function checkMongoAtlasHealth() {
    const statusPill = document.getElementById('adminTopMongoStatus');
    const statusText = document.getElementById('adminMongoStatusText');
    if (typeof fetch === 'undefined') return;

    fetch('/api/health')
      .then(r => {
        const ct = r.headers.get('content-type') || '';
        if (!r.ok || !ct.includes('application/json')) throw new Error('Not JSON');
        return r.json();
      })
      .then(data => {
        if (data && data.mongo && data.mongo.isConnected) {
          if (statusPill) {
            statusPill.style.borderColor = '#25D366';
            statusPill.style.color = '#25D366';
            statusPill.title = `Connected to ${data.mongo.type} (${data.mongo.database})`;
          }
          if (statusText) {
            statusText.innerHTML = `<i class="fas fa-database"></i> MongoDB Atlas (Live)`;
          }
        } else {
          if (statusPill) {
            statusPill.style.borderColor = '#F59E0B';
            statusPill.style.color = '#F59E0B';
          }
          if (statusText) {
            statusText.innerHTML = `<i class="fas fa-database"></i> MongoDB: Standalone`;
          }
        }
      })
      .catch(() => {
        if (statusPill) {
          statusPill.style.borderColor = '#F59E0B';
          statusPill.style.color = '#F59E0B';
        }
        if (statusText) {
          statusText.innerHTML = `<i class="fas fa-database"></i> Standalone Static`;
        }
      });
  }

  function resetStoreData() {
    if (confirm('Reload store database back to your Real Business Ledger & Products?')) {
      apiEngine.resetDatabase();
      renderProductsCatalog();
      renderAdminProducts();
      renderAdminSales();
      renderAdminExpenses();
      renderAdminMetrics();
      populateLogSaleProductDropdown();
      showToast('✨ Store database reloaded with your Real Business Ledger!', 'success');
    }
  }

  // Export public store API
  window.AimanStore = {
    setLanguage,
    addComboDealToCart,
    openLookbookModal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    openCart,
    closeCart,
    openWishlist,
    closeWishlist,
    closeDrawers,
    openModal,
    closeModal,
    checkMongoAtlasHealth,
    applyPromoCode,
    openCheckoutModal,
    selectPaymentTab,
    updateCardPreview,
    handleReceiptUpload,
    removeReceiptUpload,
    processSecureCheckout,
    orderOnWhatsAppDirect,
    checkoutCartOnWhatsApp,
    confirmOrderOnWhatsAppDirect,
    previewCurrentOrderEmail,
    previewOrderEmailById,
    printEmailReceipt,
    openQuickView,
    openWriteReviewModal,
    setStarRating,
    handleReviewPhotosUpload,
    submitCustomerReview,
    filterReviews,
    likeReview,
    openLightbox,
    closeLightbox,
    toggleWhatsAppAI,
    sendWhatsAppAIMessage,
    openWhatsAppDirect,
    openMeasurementModal,
    openBlogModal,
    submitCustomMeasurement,
    openAdminLoginModal,
    verifyAdminLogin,
    openAdmin,
    closeAdmin,
    switchAdminTab,
    toggleAdminMobileMenu,
    saveFrontendSettings,
    savePaymentSettings,
    handleGlobalSearchInput,
    handleGlobalSearchFocus,
    quickSearchTag,
    selectSearchSuggestion,
    executeGlobalSearch,
    toggleMobileMenu,
    renderSalesChart,
    handleManualSaleLog,
    updateSaleFormPrices,
    deleteSale,
    addNewProduct,
    openAdminEditProductModal,
    saveAdminProductForm,
    deleteProduct,
    openAdminEditSaleModal,
    saveAdminSaleForm,
    updateOrderStatus,
    printInvoice,
    updateHeroBanner,
    handleBannerUpload,
    exportBackupJSON,
    importBackupJSON,
    addNewFaq,
    openAdminEditFaqModal,
    saveAdminFaqForm,
    deleteFaq,
    openAdminEditLeadModal,
    saveAdminLeadForm,
    deleteLead,
    saveBotSettings,
    generateWhatsAppQR,
    confirmDevicePairing,
    disconnectWhatsAppDevice,
    exportWhatsAutoCSV,
    simulateAdminWhatsAppTest,
    deleteReview,
    openAdminAddReviewModal,
    openAdminEditReviewModal,
    handleAdminReviewPhotoUpload,
    saveAdminReviewForm,
    handleImageUploadToInput,
    setCategory,
    showToast,
    setSortBy,
    setSort,
    setProductStatus,
    toggleProductBooked,
    toggleProductSoldOut,
    toggleProductNewArrival,
    openSaleModal,
    saveProductSaleForm,
    adjustStock,
    renderAdminExpenses,
    handleManualExpenseLog,
    deleteExpense,
    resetStoreData,
    exportSalesCSV: () => apiEngine.exportSalesCSV(),
    exportExpensesCSV: () => apiEngine.exportExpensesCSV(),
    exportInventoryCSV: () => apiEngine.exportInventoryCSV()
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
