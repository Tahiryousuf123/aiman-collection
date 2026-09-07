<?php
/**
 * AIMAN COLLECTION — Clean Minimalist Luxury Footer
 * Inspired by Kashaf.pk
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$phone      = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
$phone_disp = get_theme_mod( 'aiman_whatsapp_display', '+92 345 2439196' );
$shop_url   = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/shop/' );
?>

<!-- SITE FOOTER -->
<footer class="site-footer" id="siteFooter">
	<div class="container">
		<div class="footer-grid">
			<!-- Col 1: Brand -->
			<div class="footer-col footer-brand">
				<span class="brand-calligraphy" style="font-size: 2rem; margin-bottom: 8px;">ایمن کلیکشن</span>
				<p>
					<?php esc_html_e( 'Bespoke Pakistani luxury pret wear, handcrafted Dawoodi Bohra bridal ridas, festive lawn, and designer accessories tailored with graceful elegance.', 'aiman-collection' ); ?>
				</p>
				<div style="display: flex; gap: 14px; font-size: 1.15rem;">
					<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>" target="_blank" rel="noopener noreferrer" style="color: #25D366;"><i class="fab fa-whatsapp"></i></a>
					<a href="#" style="color: var(--color-primary);"><i class="fab fa-instagram"></i></a>
					<a href="#" style="color: var(--color-primary);"><i class="fab fa-facebook-f"></i></a>
				</div>
			</div>

			<!-- Col 2: Bohra Atelier Collections -->
			<div class="footer-col">
				<h4><?php esc_html_e( 'Atelier Collections', 'aiman-collection' ); ?></h4>
				<ul>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'heavy-rida', $shop_url ) ); ?>"><?php esc_html_e( '👑 Heavy Rida / Bridal', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'new-arrivals', $shop_url ) ); ?>"><?php esc_html_e( '✨ New Arrivals', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'cotton-pret', $shop_url ) ); ?>"><?php esc_html_e( '🌸 Cotton Pret', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'bags-batwas', $shop_url ) ); ?>"><?php esc_html_e( '👜 Bags & Batwas', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'pouches', $shop_url ) ); ?>"><?php esc_html_e( '💄 Vanity & Topi Pouches', 'aiman-collection' ); ?></a></li>
				</ul>
			</div>

			<!-- Col 3: Customer Care & Admin -->
			<div class="footer-col">
				<h4><?php esc_html_e( 'Customer Care', 'aiman-collection' ); ?></h4>
				<ul>
					<li><a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode('Assalam-o-Alaikum! I need help with sizing naap.'); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Sizing & Naap Guide', 'aiman-collection' ); ?></a></li>
					<li><a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode('Track my order'); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Track TCS Shipment', 'aiman-collection' ); ?></a></li>
					<li><a href="#"><?php esc_html_e( 'Exchange & Return Policy', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/merchant/' ) ); ?>" style="color:#7a0b1a; font-weight:700;"><i class="fas fa-lock"></i> <?php esc_html_e( 'Merchant & Sales Suite', 'aiman-collection' ); ?></a></li>
				</ul>
			</div>

			<!-- Col 4: Contact & Payment Info -->
			<div class="footer-col footer-contact-info">
				<h4><?php esc_html_e( 'Karachi Atelier', 'aiman-collection' ); ?></h4>
				<p><i class="fas fa-location-dot" style="color:#7a0b1a;"></i> <?php esc_html_e( 'Karachi, Sindh, Pakistan', 'aiman-collection' ); ?></p>
				<p><i class="fab fa-whatsapp" style="color:#25D366;"></i> <a href="https://wa.me/<?php echo esc_attr( $phone ); ?>" target="_blank" style="font-weight: 700;"><?php echo esc_html( $phone_disp ); ?></a></p>
				
				<div style="margin-top: 14px; padding: 12px; background: var(--color-light-gray); border-radius: var(--radius-xs);">
					<span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px; color: var(--color-primary);"><?php esc_html_e( 'Payment Methods', 'aiman-collection' ); ?></span>
					<span style="font-size: 0.8rem; color: var(--color-muted);"><?php esc_html_e( 'Cash on Delivery (COD) Nationwide • Meezan Raast • EasyPaisa', 'aiman-collection' ); ?></span>
				</div>
			</div>
		</div>

		<!-- Bottom Copyright Row -->
		<div class="footer-bottom-row">
			<div>
				&copy; <?php echo esc_html( date( 'Y' ) ); ?> <strong><?php bloginfo( 'name' ); ?></strong>. <?php esc_html_e( 'All Rights Reserved.', 'aiman-collection' ); ?>
			</div>
			<div style="display:flex; align-items:center; gap:16px;">
				<span><?php esc_html_e( 'Free Shipping Nationwide across Pakistan', 'aiman-collection' ); ?></span>
				<!-- Small corner admin button -->
				<a href="<?php echo esc_url( home_url( '/merchant/' ) ); ?>" class="footer-corner-admin-link" title="<?php esc_attr_e( 'Merchant & Sales Suite', 'aiman-collection' ); ?>">
					<i class="fas fa-lock"></i> <span><?php esc_html_e( 'Admin 🔐', 'aiman-collection' ); ?></span>
				</a>
			</div>
		</div>
	</div>
</footer>

<!-- FLOATING WHATSAPP BUTTON (EXACT KASHAF.PK STYLE IN SCREENSHOTS) -->
<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>" target="_blank" rel="noopener noreferrer" class="floating-whatsapp-btn" aria-label="<?php esc_attr_e( 'Chat with us on WhatsApp', 'aiman-collection' ); ?>" title="<?php esc_attr_e( 'Chat on WhatsApp', 'aiman-collection' ); ?>">
	<i class="fab fa-whatsapp"></i>
</a>

<!-- QUICK VIEW MODAL (NO ADD TO CART • DIRECT WHATSAPP ORDER) -->
<div class="kashaf-search-overlay" id="quickViewModal" onclick="if(event.target===this) window.AimanStore.closeQuickView();">
	<div class="kashaf-search-box" style="max-width: 760px; padding: 25px;">
		<button type="button" class="close-btn" onclick="window.AimanStore.closeQuickView()">&times;</button>
		<div id="quickViewContent" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; align-items: center;">
			<!-- Injected dynamically via JS -->
		</div>
	</div>
</div>

<?php wp_footer(); ?>
</body>
</html>
