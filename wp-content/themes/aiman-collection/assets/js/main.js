/**
 * AIMAN COLLECTION — LUXURY HAUTE COUTURE, RIDAS & WOOCOMMERCE SUITE
 * Client-Side JavaScript Engine for WordPress / WooCommerce
 */

(function () {
  'use strict';

  // Fallback localized object if running standalone
  const AJAX_CONFIG = window.aiman_ajax_object || {
    ajax_url: '/wp-admin/admin-ajax.php',
    nonce: '',
    whatsapp_number: '923452439196',
    currency_symbol: 'Rs. ',
    current_currency: 'PKR',
    site_url: window.location.origin
  };

  /* ==========================================================================
     1. GLOBAL APPLICATION STATE
     ========================================================================== */
  const AppState = {
    currency: localStorage.getItem('aiman_currency_v2') || AJAX_CONFIG.current_currency || 'PKR',
    language: localStorage.getItem('aiman_lang_v2') || 'en',
    currencyRates: {
      PKR: { symbol: 'Rs. ', rate: 1, label: 'PKR (₨)' },
      USD: { symbol: '$', rate: 0.0036, label: 'USD ($)' },
      AED: { symbol: 'AED ', rate: 0.0132, label: 'AED (د.إ)' },
      GBP: { symbol: '£', rate: 0.0028, label: 'GBP (£)' },
      SAR: { symbol: 'SAR ', rate: 0.0135, label: 'SAR (﷼)' }
    },
    whatsappNumber: AJAX_CONFIG.whatsapp_number || '923452439196',
    i18n: {
      en: {
        lookbook: 'Festive Lookbook',
        track_order: 'Track Order',
        customer_care: 'Customer Care',
        search_placeholder: 'Search in Aiman Collection (e.g. Silk Rida, Matching Batwa, Velvet Pouch...)',
        cat_all: 'All Products',
        cat_deals: 'SUPER DEALS 🔥',
        cat_ridas: 'Ridas',
        cat_bags: 'Handbags & Batwas',
        cat_pouches: 'Cosmetics & Pouches',
        add_to_bag: 'Add to Bag',
        wa_order: 'WhatsApp',
        quick_view: 'Quick View',
        size_guide: 'Size Guide',
        in_stock: 'In Stock (Atelier Ready)',
        custom_stitching: 'Custom Stitching Available'
      },
      ur: {
        lookbook: 'عید و شادی لک بک',
        track_order: 'آرڈر ٹریک کریں',
        customer_care: 'کسٹمر سپورٹ',
        search_placeholder: 'ایمن کلیکشن میں تلاش کریں (سلک ردا، میچنگ بٹوہ، ٹوپی کور...)',
        cat_all: 'تمام ملبوسات',
        cat_deals: 'خصوصی ڈیلز 🔥',
        cat_ridas: 'داؤدی بوہرہ ردائیں',
        cat_bags: 'ہینڈ بیگز اور بٹوے',
        cat_pouches: 'ٹوپی و کاسمیٹک پاؤچ',
        add_to_bag: 'جھولی میں ڈالیں',
        wa_order: 'واٹس ایپ آرڈر',
        quick_view: 'تفصیل دیکھیں',
        size_guide: 'سائز چارٹ',
        in_stock: 'دستیاب ہے (کراچی سٹوڈیو)',
        custom_stitching: 'کسٹم ناپ سلائی کی سہولت'
      }
    }
  };

  /* ==========================================================================
     2. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(message, type = 'info', duration = 3800) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

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
     3. CURRENCY CONVERTER
     ========================================================================== */
  function formatPrice(amountInPKR) {
    const curr = AppState.currencyRates[AppState.currency] || AppState.currencyRates.PKR;
    const converted = amountInPKR * curr.rate;
    if (AppState.currency === 'PKR') {
      return curr.symbol + Math.round(converted).toLocaleString();
    }
    return curr.symbol + converted.toFixed(2);
  }

  function setCurrency(currencyCode) {
    if (!AppState.currencyRates[currencyCode]) return;
    AppState.currency = currencyCode;
    localStorage.setItem('aiman_currency_v2', currencyCode);

    const selector = document.getElementById('currencySelector');
    if (selector) selector.value = currencyCode;

    // Convert data-price-pkr elements
    document.querySelectorAll('[data-price-pkr]').forEach(el => {
      const pkr = parseFloat(el.getAttribute('data-price-pkr'));
      if (!isNaN(pkr)) {
        el.textContent = formatPrice(pkr);
      }
    });

    // Notify backend
    if (window.jQuery && AJAX_CONFIG.ajax_url) {
      window.jQuery.post(AJAX_CONFIG.ajax_url, {
        action: 'aiman_set_currency',
        currency: currencyCode,
        nonce: AJAX_CONFIG.nonce
      });
    }

    showToast(`Currency switched to ${AppState.currencyRates[currencyCode].label}`, 'info', 2500);
  }

  /* ==========================================================================
     4. BILINGUAL LANGUAGE SWITCHER (EN / UR)
     ========================================================================== */
  function setLanguage(lang) {
    if (!AppState.i18n[lang]) return;
    AppState.language = lang;
    localStorage.setItem('aiman_lang_v2', lang);

    const btnEN = document.getElementById('langBtnEN');
    const btnUR = document.getElementById('langBtnUR');

    if (lang === 'ur') {
      document.body.classList.add('urdu-active');
      if (btnUR) {
        btnUR.classList.add('active');
        btnUR.style.background = 'var(--color-gold-primary)';
        btnUR.style.color = '#000';
      }
      if (btnEN) {
        btnEN.classList.remove('active');
        btnEN.style.background = 'transparent';
        btnEN.style.color = 'var(--color-gold-light)';
      }
    } else {
      document.body.classList.remove('urdu-active');
      if (btnEN) {
        btnEN.classList.add('active');
        btnEN.style.background = 'var(--color-gold-primary)';
        btnEN.style.color = '#000';
      }
      if (btnUR) {
        btnUR.classList.remove('active');
        btnUR.style.background = 'transparent';
        btnUR.style.color = 'var(--color-gold-light)';
      }
    }

    // Apply i18n text
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (AppState.i18n[lang][key]) {
        el.textContent = AppState.i18n[lang][key];
      }
    });

    const searchInp = document.getElementById('darazSearchInput');
    if (searchInp && AppState.i18n[lang].search_placeholder) {
      searchInp.placeholder = AppState.i18n[lang].search_placeholder;
    }
  }

  /* ==========================================================================
     5. LIVE SEARCH AUTOCOMPLETE WITH DEBOUNCE
     ========================================================================== */
  let searchDebounceTimer = null;

  function handleGlobalSearchInput(query) {
    clearTimeout(searchDebounceTimer);
    const dropdown = document.getElementById('globalSearchDropdown');
    if (!dropdown) return;

    query = (query || '').trim();
    if (query.length < 2) {
      dropdown.style.display = 'none';
      dropdown.innerHTML = '';
      return;
    }

    searchDebounceTimer = setTimeout(() => {
      if (window.jQuery && AJAX_CONFIG.ajax_url) {
        window.jQuery.ajax({
          url: AJAX_CONFIG.ajax_url,
          type: 'POST',
          dataType: 'json',
          data: {
            action: 'aiman_live_search',
            query: query,
            nonce: AJAX_CONFIG.nonce
          },
          success: function (res) {
            if (res.success && res.data && res.data.length > 0) {
              renderSearchDropdown(res.data);
            } else {
              dropdown.innerHTML = `
                <div class="search-item search-empty" style="padding: 1.2rem; text-align: center; color: var(--color-text-muted);">
                  <i class="fas fa-search text-gold" style="margin-right: 0.5rem;"></i> No ridas or accessories found for "<strong>${escapeHtml(query)}</strong>"
                </div>
              `;
              dropdown.style.display = 'block';
            }
          },
          error: function () {
            dropdown.style.display = 'none';
          }
        });
      }
    }, 280);
  }

  function renderSearchDropdown(items) {
    const dropdown = document.getElementById('globalSearchDropdown');
    if (!dropdown) return;

    let html = '';
    items.forEach(item => {
      html += `
        <a href="${item.url}" class="search-item" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; border-bottom: 1px solid var(--color-border-subtle); text-decoration: none; color: inherit; transition: background 0.2s;">
          <img src="${item.image || 'images/aiman_logo.png'}" alt="${escapeHtml(item.title)}" style="width: 48px; height: 58px; object-fit: cover; border-radius: var(--radius-xs); border: 1px solid var(--color-border);">
          <div style="flex-grow: 1;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 700;">${escapeHtml(item.category || 'Dawoodi Bohra Libas')}</div>
            <div style="font-weight: 600; color: var(--color-text-primary); font-size: 0.95rem;">${escapeHtml(item.title)}</div>
            <div style="color: var(--color-gold-light); font-weight: 700; font-size: 0.88rem; margin-top: 2px;">${item.price_html || formatPrice(item.price)}</div>
          </div>
          <i class="fas fa-arrow-right text-gold" style="font-size: 0.8rem;"></i>
        </a>
      `;
    });

    dropdown.innerHTML = html;
    dropdown.style.display = 'block';
  }

  function executeGlobalSearch() {
    const searchInp = document.getElementById('darazSearchInput');
    if (!searchInp || !searchInp.value.trim()) return;
    const q = encodeURIComponent(searchInp.value.trim());
    window.location.href = `${AJAX_CONFIG.site_url}/?s=${q}&post_type=product`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ==========================================================================
     6. SLIDING CART DRAWER (MINI-CART)
     ========================================================================== */
  function openCartDrawer() {
    let backdrop = document.getElementById('cartDrawerBackdrop');
    if (backdrop) {
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    let backdrop = document.getElementById('cartDrawerBackdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ==========================================================================
     7. AJAX QUICK VIEW MODAL
     ========================================================================== */
  function openQuickView(productId) {
    let modal = document.getElementById('quickViewModal');
    let container = document.getElementById('quickViewContainer');
    if (!modal || !container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem;">
        <i class="fas fa-spinner fa-spin text-gold" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
        <h4 style="color: var(--color-gold-light); font-family: var(--font-heading);">Loading Bohra Haute Couture...</h4>
      </div>
    `;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (window.jQuery && AJAX_CONFIG.ajax_url) {
      window.jQuery.ajax({
        url: AJAX_CONFIG.ajax_url,
        type: 'POST',
        data: {
          action: 'aiman_quick_view',
          product_id: productId,
          nonce: AJAX_CONFIG.nonce
        },
        success: function (res) {
          if (res.success && res.data) {
            container.innerHTML = res.data;
          } else {
            container.innerHTML = `<div style="padding: 2rem; color: #ef4444; text-align: center;">Unable to load product details.</div>`;
          }
        },
        error: function () {
          container.innerHTML = `<div style="padding: 2rem; color: #ef4444; text-align: center;">Error connecting to server.</div>`;
        }
      });
    }
  }

  function closeQuickView() {
    let modal = document.getElementById('quickViewModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  /* ==========================================================================
     8. 1-CLICK WHATSAPP ORDER BUILDER
     ========================================================================== */
  function orderOnWhatsApp(productName, price, productUrl) {
    const phone = AppState.whatsappNumber;
    const msg = `✨ *Assalam-o-Alaikum Aiman Collection Atelier!* ✨\n\nI would like to order this Dawoodi Bohra Libas:\n👑 *Product:* ${productName}\n💰 *Price:* ${price}\n🔗 *Link:* ${productUrl || window.location.href}\n\nPlease confirm availability, stitching customisation (Pardi length/Ghagra flair), and delivery timeline. Thank you!`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    showToast('Redirecting to 24/7 WhatsApp AI Concierge...', 'whatsapp', 3000);
  }

  /* ==========================================================================
     9. BOHRA AI STYLIST / WHATSAPP CHAT WIDGET
     ========================================================================== */
  function toggleWhatsAppAI() {
    const chatBox = document.getElementById('waAiChatBox');
    if (!chatBox) return;
    if (chatBox.style.display === 'none' || !chatBox.style.display) {
      chatBox.style.display = 'flex';
      const prompt = document.getElementById('waAiPromptBubble');
      if (prompt) prompt.style.display = 'none';
    } else {
      chatBox.style.display = 'none';
    }
  }

  function sendWhatsAppAIMessage(customText) {
    const input = document.getElementById('waAiInput');
    const text = (customText || (input ? input.value : '')).trim();
    if (!text) return;

    if (input) input.value = '';

    const body = document.getElementById('waAiBody');
    if (!body) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'wa-ai-message wa-ai-user';
    userMsg.innerHTML = `<div class="wa-ai-bubble">${escapeHtml(text)}</div>`;
    body.appendChild(userMsg);
    body.scrollTop = body.scrollHeight;

    // Simulate AI response
    setTimeout(() => {
      let replyText = "✨ Khush Amdeed! Hamari bespoke Bohra Ridas pure silk & luxury cotton mein available hain. Direct WhatsApp concierge par baat karne ke liye neeche button dabayein:";
      const lower = text.toLowerCase();

      if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('kitne')) {
        replyText = "💰 *Bohra Rida Pricing:* Daily Wear Cotton Ridas start from Rs. 3,600, Pure Silk Bridal Ridas from Rs. 5,200, and Matching Designer Batwas from Rs. 1,800. Use code *AIMAN25* for 25% Off!";
      } else if (lower.includes('size') || lower.includes('stitch') || lower.includes('naap') || lower.includes('pardi')) {
        replyText = "🧵 *Made-to-Measure Custom Stitching:* Pardi length, Gher, Ghagra waist aur matching rida batwa aapki exact naap ke mutabiq tayar hota hai!";
      } else if (lower.includes('track') || lower.includes('delivery') || lower.includes('tcs') || lower.includes('courier')) {
        replyText = "📦 *TCS Express Delivery:* Karachi mein 24-48 ghante aur nationwide 2-4 business days. Apna Order ID share karein for live status!";
      } else if (lower.includes('payment') || lower.includes('bank') || lower.includes('easypaisa') || lower.includes('jazzcash')) {
        replyText = "💳 *Payment Methods:* Meezan Islamic Bank, EasyPaisa, JazzCash, Raast, aur Cash on Delivery (COD) available hain!";
      }

      const aiMsg = document.createElement('div');
      aiMsg.className = 'wa-ai-message wa-ai-bot';
      aiMsg.innerHTML = `
        <div class="wa-ai-bubble">
          ${replyText}
          <div style="margin-top: 0.6rem;">
            <a href="https://wa.me/${AppState.whatsappNumber}?text=${encodeURIComponent('Inquiry: ' + text)}" target="_blank" class="btn btn-whatsapp" style="font-size: 0.78rem; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; color: #fff; text-decoration: none;">
              <i class="fab fa-whatsapp"></i> Chat on WhatsApp
            </a>
          </div>
        </div>
      `;
      body.appendChild(aiMsg);
      body.scrollTop = body.scrollHeight;
    }, 450);
  }

  /* ==========================================================================
     10. SUPER DEALS COUNTDOWN TIMER
     ========================================================================== */
  function initCountdownTimer() {
    const timerDays = document.getElementById('dealDays');
    const timerHours = document.getElementById('dealHours');
    const timerMinutes = document.getElementById('dealMinutes');
    const timerSeconds = document.getElementById('dealSeconds');

    if (!timerDays || !timerHours || !timerMinutes || !timerSeconds) return;

    // Default: 3 days rolling promo
    let endTime = new Date().getTime() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);

    function update() {
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        timerDays.textContent = '00';
        timerHours.textContent = '00';
        timerMinutes.textContent = '00';
        timerSeconds.textContent = '00';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      timerDays.textContent = String(d).padStart(2, '0');
      timerHours.textContent = String(h).padStart(2, '0');
      timerMinutes.textContent = String(m).padStart(2, '0');
      timerSeconds.textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ==========================================================================
     11. MODALS & POPUPS (LOOKBOOK & SIZE GUIDE)
     ========================================================================== */
  function openLookbookModal() {
    const modal = document.getElementById('lookbookModal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLookbookModal() {
    const modal = document.getElementById('lookbookModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function openSizeGuideModal() {
    const modal = document.getElementById('sizeGuideModal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSizeGuideModal() {
    const modal = document.getElementById('sizeGuideModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  /* ==========================================================================
     12. DOM INITIALIZATION
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    // Restore currency and language
    if (AppState.currency !== 'PKR') {
      setCurrency(AppState.currency);
    }
    if (AppState.language === 'ur') {
      setLanguage('ur');
    }

    // Currency Selector Listener
    const currSelect = document.getElementById('currencySelector');
    if (currSelect) {
      currSelect.value = AppState.currency;
      currSelect.addEventListener('change', function () {
        setCurrency(this.value);
      });
    }

    // Initialize Countdown Timer
    initCountdownTimer();

    // Close Dropdowns on outside click
    document.addEventListener('click', function (e) {
      const dropdown = document.getElementById('globalSearchDropdown');
      const searchWrap = document.querySelector('.daraz-search-wrap');
      if (dropdown && searchWrap && !searchWrap.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });

    // ESC key closes modals & drawers
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeCartDrawer();
        closeQuickView();
        closeLookbookModal();
        closeSizeGuideModal();
        const chatBox = document.getElementById('waAiChatBox');
        if (chatBox) chatBox.style.display = 'none';
      }
    });

    // Enter key triggers search
    const searchInp = document.getElementById('darazSearchInput');
    if (searchInp) {
      searchInp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          executeGlobalSearch();
        }
      });
    }

    // Listen for WooCommerce AJAX Cart updates
    if (window.jQuery) {
      window.jQuery(document.body).on('added_to_cart removed_from_cart', function () {
        showToast('Shopping bag updated ✨', 'success', 2500);
      });
    }
  });

  /* Expose Global Store API to window */
  window.AimanStore = {
    showToast: showToast,
    setCurrency: setCurrency,
    setLanguage: setLanguage,
    handleGlobalSearchInput: handleGlobalSearchInput,
    executeGlobalSearch: executeGlobalSearch,
    openCart: openCartDrawer,
    closeCart: closeCartDrawer,
    openQuickView: openQuickView,
    closeQuickView: closeQuickView,
    orderOnWhatsApp: orderOnWhatsApp,
    toggleWhatsAppAI: toggleWhatsAppAI,
    sendWhatsAppAIMessage: sendWhatsAppAIMessage,
    openLookbookModal: openLookbookModal,
    closeLookbookModal: closeLookbookModal,
    openSizeGuideModal: openSizeGuideModal,
    closeSizeGuideModal: closeSizeGuideModal
  };

})();
