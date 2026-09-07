/**
 * AIMAN COLLECTION — Main Client-Side JavaScript
 * Kashaf.pk Minimalist Setup: Zero Cart Dependency, 1-Click WhatsApp Ordering
 */

(function ($) {
  'use strict';

  const defaultPhone = (typeof aiman_ajax_object !== 'undefined' && aiman_ajax_object.whatsapp_number) 
    ? aiman_ajax_object.whatsapp_number 
    : '923452439196';

  let currentSelectedSize = 'Medium (M)';

  window.AimanStore = {
    /**
     * Search Modal
     */
    openSearchModal: function () {
      $('#searchModal').css('display', 'flex').hide().fadeIn(200);
      $('#modalSearchInput').focus();
    },

    closeSearchModal: function () {
      $('#searchModal').fadeOut(200);
    },

    /**
     * Mobile Menu Drawer
     */
    toggleMobileMenu: function () {
      $('#mobileDrawer').fadeToggle(200);
    },

    /**
     * Size Selection on Single Product Page
     */
    selectSize: function (size, btn) {
      currentSelectedSize = size;
      $('#selectedSizeLabel').text(size);
      $('.size-btn').removeClass('active');
      $(btn).addClass('active');

      // Update WhatsApp link with new size
      const currentWaHref = $('#singleProductWaBtn').attr('href');
      if (currentWaHref && currentWaHref.includes('wa.me')) {
        const title = $('.single-product-title').text().trim();
        const price = $('.single-price-current').text().trim();
        const url = window.location.href;
        const msg = `✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI want to order:\n👗 *Product:* ${title}\n💰 *Price:* ${price}\n📏 *Size:* ${size}\n🔗 *Link:* ${url}\n\nPlease confirm availability and delivery.`;
        $('#singleProductWaBtn').attr('href', `https://wa.me/${defaultPhone}?text=${encodeURIComponent(msg)}`);
      }
    },

    /**
     * Quick View Modal for Demo Products
     */
    openDemoModal: function (title, price, regularPrice, imgSrc) {
      const waMsg = `✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI want to order:\n👗 *Product:* ${title}\n💰 *Price:* ${price}\n📏 *Size:* Medium (M)\n\nPlease confirm availability and delivery.`;
      const waLink = `https://wa.me/${defaultPhone}?text=${encodeURIComponent(waMsg)}`;

      const html = `
        <div style="aspect-ratio: 3/4; overflow: hidden; border-radius: 4px; background: #f5f5f5;">
          <img src="${imgSrc}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #777; letter-spacing: 0.1em; display: block; margin-bottom: 6px;">Atelier Collection</span>
          <h2 style="font-size: 1.4rem; font-weight: 600; line-height: 1.3; margin-bottom: 10px;">${title}</h2>
          <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 14px;">
            <span style="font-size: 1.3rem; font-weight: 700; color: #111;">${price}</span>
            <span style="font-size: 0.95rem; color: #888; text-decoration: line-through;">${regularPrice}</span>
          </div>
          <p style="font-size: 0.88rem; color: #555; line-height: 1.6; margin-bottom: 20px;">
            Handcrafted luxury designer pret ensemble featuring delicate borders, breathable fabric, and comfortable drapery. Free TCS shipping nationwide.
          </p>
          <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="whatsapp-order-cta-btn">
            <i class="fab fa-whatsapp"></i>
            <span>Order on WhatsApp</span>
          </a>
        </div>
      `;

      $('#quickViewContent').html(html);
      $('#quickViewModal').css('display', 'flex').hide().fadeIn(200);
    },

    openQuickView: function (productId) {
      if (typeof aiman_ajax_object === 'undefined') return;

      $.ajax({
        url: aiman_ajax_object.ajax_url,
        type: 'POST',
        data: {
          action: 'aiman_quick_view',
          product_id: productId,
          nonce: aiman_ajax_object.nonce
        },
        beforeSend: function () {
          $('#quickViewContent').html('<div style="text-align:center; padding:3rem; grid-column:span 2;"><i class="fas fa-spinner fa-spin" style="font-size:2rem;"></i></div>');
          $('#quickViewModal').css('display', 'flex').hide().fadeIn(200);
        },
        success: function (res) {
          if (res.success && res.data) {
            $('#quickViewContent').html(res.data);
          } else {
            $('#quickViewModal').fadeOut(200);
          }
        },
        error: function () {
          $('#quickViewModal').fadeOut(200);
        }
      });
    },

    closeQuickView: function () {
      $('#quickViewModal').fadeOut(200);
    },

    /**
     * Homepage Sort Change
     */
    handleSortChange: function (val) {
      const grid = $('.products-grid');
      const items = grid.children('.product-card').get();

      if (val === 'price-asc') {
        items.sort(function (a, b) {
          const pA = parseInt($(a).find('.price-current').text().replace(/[^0-9]/g, '')) || 0;
          const pB = parseInt($(b).find('.price-current').text().replace(/[^0-9]/g, '')) || 0;
          return pA - pB;
        });
      } else if (val === 'price-desc') {
        items.sort(function (a, b) {
          const pA = parseInt($(a).find('.price-current').text().replace(/[^0-9]/g, '')) || 0;
          const pB = parseInt($(b).find('.price-current').text().replace(/[^0-9]/g, '')) || 0;
          return pB - pA;
        });
      }

      $.each(items, function (idx, itm) {
        grid.append(itm);
      });
    },

    /**
     * Moving Category Carousel Scroll Controls
     */
    scrollCatTrack: function (direction) {
      const container = document.getElementById('categoryMarqueeContainer');
      if (!container) return;
      const amount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Mouse Drag / Touch Swipe for Category Marquee
  const catMarquee = document.getElementById('categoryMarqueeContainer');
  if (catMarquee) {
    let isDown = false;
    let startX;
    let scrollLeft;

    catMarquee.addEventListener('mousedown', function (e) {
      isDown = true;
      startX = e.pageX - catMarquee.offsetLeft;
      scrollLeft = catMarquee.scrollLeft;
    });

    catMarquee.addEventListener('mouseleave', function () {
      isDown = false;
    });

    catMarquee.addEventListener('mouseup', function () {
      isDown = false;
    });

    catMarquee.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - catMarquee.offsetLeft;
      const walk = (x - startX) * 1.6;
      catMarquee.scrollLeft = scrollLeft - walk;
    });
  }

  // Close modals on Escape key
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      window.AimanStore.closeSearchModal();
      window.AimanStore.closeQuickView();
    }
  });

})(jQuery);
