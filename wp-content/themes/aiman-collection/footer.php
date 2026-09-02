<?php
/**
 * AIMAN COLLECTION — Theme Footer & Modals
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$phone        = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
$phone_disp   = get_theme_mod( 'aiman_whatsapp_display', '+92 345 2439196' );
$shop_url     = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' );
$cart_url     = function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/cart/' );
$checkout_url = function_exists( 'wc_get_checkout_url' ) ? wc_get_checkout_url() : home_url( '/checkout/' );
?>

<!-- 4. LUXURY ROYAL FOOTER -->
<footer class="site-footer" id="siteFooter">
	<div class="container footer-container">
		<div class="footer-grid">
			<!-- Col 1: Brand & Bohra Atelier Heritage -->
			<div class="footer-col footer-brand-col">
				<div class="footer-logo">
					<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/aiman_logo.png' ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="footer-logo-img">
					<div class="footer-logo-text">
						<span class="footer-logo-main">AIMAN <span class="accent">COLLECTION</span></span>
						<span class="footer-logo-tagline"><?php esc_html_e( 'DAWOODI BOHRA HAUTE COUTURE', 'aiman-collection' ); ?></span>
					</div>
				</div>
				<p class="footer-about-text">
					<?php esc_html_e( "Pakistan's premier bespoke Dawoodi Bohra couture house. Handcrafted ceremonial bridal ridas, everyday pastel cotton pret, matching designer batwas, and luxury accessories tailored with authentic modesty and regal elegance.", 'aiman-collection' ); ?>
				</p>
				<div class="footer-social-links">
					<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>" target="_blank" rel="noopener noreferrer" class="social-icon wa-social" title="WhatsApp Concierge"><i class="fab fa-whatsapp"></i></a>
					<a href="#" class="social-icon" title="Instagram"><i class="fab fa-instagram"></i></a>
					<a href="#" class="social-icon" title="Facebook"><i class="fab fa-facebook-f"></i></a>
					<a href="#" class="social-icon" title="YouTube"><i class="fab fa-youtube"></i></a>
				</div>
			</div>

			<!-- Col 2: Quick Links -->
			<div class="footer-col">
				<h4 class="footer-heading"><?php esc_html_e( 'Atelier Collections', 'aiman-collection' ); ?></h4>
				<ul class="footer-links">
					<li><a href="<?php echo esc_url( $shop_url ); ?>"><i class="fas fa-chevron-right"></i> <?php esc_html_e( 'Bridal Silk Ridas', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( $shop_url ); ?>"><i class="fas fa-chevron-right"></i> <?php esc_html_e( 'Pastel Cotton Pret', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( $shop_url ); ?>"><i class="fas fa-chevron-right"></i> <?php esc_html_e( 'Matching Rida Batwas', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( $shop_url ); ?>"><i class="fas fa-chevron-right"></i> <?php esc_html_e( 'Topi & Cosmetic Pouches', 'aiman-collection' ); ?></a></li>
					<li><a href="javascript:void(0)" onclick="window.AimanStore.openLookbookModal()"><i class="fas fa-chevron-right"></i> <?php esc_html_e( 'Festive Lookbook', 'aiman-collection' ); ?></a></li>
				</ul>
			</div>

			<!-- Col 3: Customer Care & Sizing -->
			<div class="footer-col">
				<h4 class="footer-heading"><?php esc_html_e( 'Bespoke Concierge', 'aiman-collection' ); ?></h4>
				<ul class="footer-links">
					<li><a href="javascript:void(0)" onclick="window.AimanStore.openSizeGuideModal()"><i class="fas fa-ruler-combined text-gold"></i> <?php esc_html_e( 'Pardi & Ghagra Size Guide', 'aiman-collection' ); ?></a></li>
					<li><a href="javascript:void(0)" onclick="window.AimanStore.sendWhatsAppAIMessage('Track my order')"><i class="fas fa-truck-fast text-gold"></i> <?php esc_html_e( 'Track TCS Shipment', 'aiman-collection' ); ?></a></li>
					<li><a href="javascript:void(0)" onclick="window.AimanStore.toggleWhatsAppAI()"><i class="fas fa-comments text-gold"></i> <?php esc_html_e( '24/7 Bohra AI Stylist', 'aiman-collection' ); ?></a></li>
					<li><a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode( 'Assalam-o-Alaikum! I want custom made-to-measure stitching naap for my rida.' ); ?>" target="_blank" rel="noopener noreferrer"><i class="fas fa-scissors text-gold"></i> <?php esc_html_e( 'Custom Stitching Inquiry', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( $cart_url ); ?>"><i class="fas fa-shopping-bag text-gold"></i> <?php esc_html_e( 'Shopping Bag', 'aiman-collection' ); ?></a></li>
				</ul>
			</div>

			<!-- Col 4: Trust Badges & Contact -->
			<div class="footer-col">
				<h4 class="footer-heading"><?php esc_html_e( 'Karachi Atelier Studio', 'aiman-collection' ); ?></h4>
				<p style="color:var(--color-text-secondary); font-size:0.9rem; line-height:1.6; margin-bottom:1rem;">
					<i class="fas fa-location-dot text-gold"></i> <?php esc_html_e( 'Clifton / Saddar, Karachi, Pakistan', 'aiman-collection' ); ?><br>
					<i class="fab fa-whatsapp text-gold"></i> <a href="https://wa.me/<?php echo esc_attr( $phone ); ?>" target="_blank" style="color:var(--color-gold-light); font-weight:700;"><?php echo esc_html( $phone_disp ); ?></a>
				</p>
				<div class="footer-trust-box" style="background:var(--color-bg-elevated); border:1px solid var(--color-border); border-radius:var(--radius-sm); padding:0.9rem;">
					<div style="font-size:0.75rem; text-transform:uppercase; color:var(--color-gold-primary); font-weight:800; margin-bottom:0.4rem; letter-spacing:0.06em;">
						<i class="fas fa-shield-check"></i> <?php esc_html_e( 'Verified Payment Modes', 'aiman-collection' ); ?>
					</div>
					<div style="font-size:0.8rem; color:var(--color-text-muted); line-height:1.5;">
						<?php esc_html_e( 'Meezan Bank Raast • EasyPaisa • JazzCash • Cash on Delivery (COD) Nationwide via TCS Express', 'aiman-collection' ); ?>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer Bottom Copyright -->
		<div class="footer-bottom">
			<div class="footer-bottom-text">
				&copy; <?php echo esc_html( date( 'Y' ) ); ?> <strong><?php bloginfo( 'name' ); ?> Atelier</strong>. <?php esc_html_e( 'All Rights Reserved. Handcrafted for the Dawoodi Bohra Community.', 'aiman-collection' ); ?>
			</div>
			<div class="footer-bottom-tagline">
				<span><i class="fas fa-sparkles text-gold"></i> <?php esc_html_e( '100% Pure Silk & Egyptian Cotton', 'aiman-collection' ); ?></span>
			</div>
		</div>
	</div>
</footer>

<!-- 5. SLIDING MINI-CART DRAWER -->
<div class="cart-drawer-backdrop" id="cartDrawerBackdrop" onclick="if(event.target===this) window.AimanStore.closeCart();">
	<div class="aiman-cart-drawer">
		<div class="aiman-cart-drawer-header">
			<h3><i class="fas fa-shopping-bag text-gold"></i> <?php esc_html_e( 'Your Shopping Bag', 'aiman-collection' ); ?></h3>
			<button type="button" class="aiman-cart-drawer-close" onclick="window.AimanStore.closeCart()">&times;</button>
		</div>

		<div class="aiman-cart-drawer-body">
			<?php
			if ( function_exists( 'woocommerce_mini_cart' ) ) {
				woocommerce_mini_cart();
			} else {
				?>
				<div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
					<i class="fas fa-shopping-cart text-gold" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
					<p><?php esc_html_e( 'Your shopping bag is currently empty.', 'aiman-collection' ); ?></p>
					<a href="<?php echo esc_url( $shop_url ); ?>" class="btn btn-primary" style="margin-top: 1rem; display: inline-flex;">
						<?php esc_html_e( 'Explore Rida Catalog', 'aiman-collection' ); ?>
					</a>
				</div>
				<?php
			}
			?>
		</div>

		<div class="aiman-cart-drawer-footer">
			<div class="aiman-cart-drawer-subtotal">
				<span><?php esc_html_e( 'Subtotal:', 'aiman-collection' ); ?></span>
				<span class="amount" id="drawerSubtotalAmount"><?php echo ( function_exists( 'WC' ) && WC()->cart ) ? wp_kses_post( WC()->cart->get_cart_subtotal() ) : 'Rs. 0'; ?></span>
			</div>
			<div class="aiman-cart-drawer-actions">
				<a href="<?php echo esc_url( $cart_url ); ?>" class="btn-view-cart"><?php esc_html_e( 'View Bag', 'aiman-collection' ); ?></a>
				<a href="<?php echo esc_url( $checkout_url ); ?>" class="btn-checkout"><?php esc_html_e( 'Checkout 🔒', 'aiman-collection' ); ?></a>
			</div>
		</div>
	</div>
</div>

<!-- 6. QUICK VIEW MODAL CONTAINER -->
<div class="modal-overlay" id="quickViewModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 10005; align-items: center; justify-content: center; padding: 1.5rem;" onclick="if(event.target===this) window.AimanStore.closeQuickView();">
	<div class="modal-content quick-view-container" id="quickViewContainer" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem; position: relative;">
		<!-- Populated via AJAX -->
	</div>
</div>

<!-- 7. FESTIVE LOOKBOOK MODAL -->
<div class="modal-overlay" id="lookbookModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 10005; align-items: center; justify-content: center; padding: 1.5rem;" onclick="if(event.target===this) window.AimanStore.closeLookbookModal();">
	<div class="modal-content" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2.5rem; position: relative;">
		<button type="button" class="modal-close" onclick="window.AimanStore.closeLookbookModal()" style="position: absolute; top: 15px; right: 15px; background: var(--color-bg-elevated); border: 1px solid var(--color-border); color: #fff; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;">&times;</button>
		
		<div style="text-align: center; margin-bottom: 2rem;">
			<span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.1em;"><?php esc_html_e( 'HAUTE COUTURE EDIT', 'aiman-collection' ); ?></span>
			<h2 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2rem; margin-top: 0.4rem;"><?php esc_html_e( 'Dawoodi Bohra Festive & Bridal Lookbook', 'aiman-collection' ); ?></h2>
			<p style="color: var(--color-text-secondary); max-width: 600px; margin: 0.5rem auto 0 auto;"><?php esc_html_e( 'Explore our curated ceremonial masterpieces crafted with pure silk, delicate crystal boti, and handcrafted matching batwas.', 'aiman-collection' ); ?></p>
		</div>

		<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
			<div style="background: #080a0e; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border);">
				<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/aiman_logo.png' ); ?>" alt="Royal Bridal Rida" style="width: 100%; aspect-ratio: 4/5; object-fit: cover;">
				<div style="padding: 1rem;">
					<h4 style="font-family: var(--font-heading); color: var(--color-text-primary); margin: 0 0 0.3rem 0;"><?php esc_html_e( 'Royal Crimson Zardozi Bridal Rida', 'aiman-collection' ); ?></h4>
					<p style="font-size: 0.85rem; color: var(--color-gold-light); margin: 0;"><?php esc_html_e( 'Pure Raw Silk with Gold Resham Work', 'aiman-collection' ); ?></p>
				</div>
			</div>

			<div style="background: #080a0e; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border);">
				<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/aiman_logo.png' ); ?>" alt="Emerald Festive Rida" style="width: 100%; aspect-ratio: 4/5; object-fit: cover;">
				<div style="padding: 1rem;">
					<h4 style="font-family: var(--font-heading); color: var(--color-text-primary); margin: 0 0 0.3rem 0;"><?php esc_html_e( 'Emerald Velvet Boti Milad Rida', 'aiman-collection' ); ?></h4>
					<p style="font-size: 0.85rem; color: var(--color-gold-light); margin: 0;"><?php esc_html_e( 'Chiffon Silk with Handcrafted Lace Trims', 'aiman-collection' ); ?></p>
				</div>
			</div>

			<div style="background: #080a0e; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border);">
				<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/aiman_logo.png' ); ?>" alt="Pastel Pret Rida" style="width: 100%; aspect-ratio: 4/5; object-fit: cover;">
				<div style="padding: 1rem;">
					<h4 style="font-family: var(--font-heading); color: var(--color-text-primary); margin: 0 0 0.3rem 0;"><?php esc_html_e( 'Pastel Lavender Everyday Pret Rida', 'aiman-collection' ); ?></h4>
					<p style="font-size: 0.85rem; color: var(--color-gold-light); margin: 0;"><?php esc_html_e( 'Breathable Mercerized Cotton', 'aiman-collection' ); ?></p>
				</div>
			</div>
		</div>

		<div style="text-align: center; margin-top: 2rem;">
			<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode( 'Assalam-o-Alaikum! I loved the Festive Lookbook and want to inquire about custom stitching and pricing.' ); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
				<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'Request Custom Bridal Consultation on WhatsApp', 'aiman-collection' ); ?>
			</a>
		</div>
	</div>
</div>

<!-- 8. DAWOODI BOHRA LIBAS SIZING GUIDE MODAL -->
<div class="modal-overlay" id="sizeGuideModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 10005; align-items: center; justify-content: center; padding: 1.5rem;" onclick="if(event.target===this) window.AimanStore.closeSizeGuideModal();">
	<div class="modal-content" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); max-width: 750px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2.5rem; position: relative;">
		<button type="button" class="modal-close" onclick="window.AimanStore.closeSizeGuideModal()" style="position: absolute; top: 15px; right: 15px; background: var(--color-bg-elevated); border: 1px solid var(--color-border); color: #fff; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;">&times;</button>
		
		<h2 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.8rem; margin-bottom: 0.6rem;">
			<i class="fas fa-ruler-combined text-gold"></i> <?php esc_html_e( 'Dawoodi Bohra Libas Sizing & Naap Guide', 'aiman-collection' ); ?>
		</h2>
		<p style="color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
			<?php esc_html_e( 'Our ridas are designed according to traditional Bohra craftsmanship. Below are standard sizes, and we also provide 100% bespoke made-to-measure stitching.', 'aiman-collection' ); ?>
		</p>

		<table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.95rem;">
			<thead>
				<tr style="background: var(--color-bg-elevated); color: var(--color-gold-light); border-bottom: 1px solid var(--color-border);">
					<th style="padding: 0.8rem; text-align: left;"><?php esc_html_e( 'Size', 'aiman-collection' ); ?></th>
					<th style="padding: 0.8rem; text-align: left;"><?php esc_html_e( 'Pardi Length', 'aiman-collection' ); ?></th>
					<th style="padding: 0.8rem; text-align: left;"><?php esc_html_e( 'Ghagra Length', 'aiman-collection' ); ?></th>
					<th style="padding: 0.8rem; text-align: left;"><?php esc_html_e( 'Ghagra Gher (Flair)', 'aiman-collection' ); ?></th>
				</tr>
			</thead>
			<tbody style="color: var(--color-text-primary);">
				<tr style="border-bottom: 1px solid var(--color-border-subtle);">
					<td style="padding: 0.8rem; font-weight: 700; color: var(--color-gold-primary);">Small (S)</td>
					<td style="padding: 0.8rem;">38 - 40 Inches</td>
					<td style="padding: 0.8rem;">36 - 38 Inches</td>
					<td style="padding: 0.8rem;">110 Inches</td>
				</tr>
				<tr style="border-bottom: 1px solid var(--color-border-subtle);">
					<td style="padding: 0.8rem; font-weight: 700; color: var(--color-gold-primary);">Medium (M)</td>
					<td style="padding: 0.8rem;">41 - 43 Inches</td>
					<td style="padding: 0.8rem;">38 - 40 Inches</td>
					<td style="padding: 0.8rem;">120 Inches</td>
				</tr>
				<tr style="border-bottom: 1px solid var(--color-border-subtle);">
					<td style="padding: 0.8rem; font-weight: 700; color: var(--color-gold-primary);">Large (L)</td>
					<td style="padding: 0.8rem;">44 - 46 Inches</td>
					<td style="padding: 0.8rem;">40 - 42 Inches</td>
					<td style="padding: 0.8rem;">130 Inches</td>
				</tr>
				<tr>
					<td style="padding: 0.8rem; font-weight: 700; color: var(--color-gold-primary);">Custom Naap</td>
					<td colspan="3" style="padding: 0.8rem; color: var(--color-text-secondary);">Exact bespoke measurements tailored to your height and preference.</td>
				</tr>
			</tbody>
		</table>

		<div style="text-align: center; margin-top: 1.5rem;">
			<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode( 'Assalam-o-Alaikum! I need help with my Bohra Rida measurements and custom stitching naap.' ); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
				<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'Send Measurements on WhatsApp', 'aiman-collection' ); ?>
			</a>
		</div>
	</div>
</div>

<!-- 9. BOHRA AI STYLIST / WHATSAPP CHAT WIDGET -->
<div class="wa-ai-widget" id="waAiWidget">
	<!-- Prompt Bubble -->
	<div class="wa-ai-prompt-bubble" id="waAiPromptBubble" onclick="window.AimanStore.toggleWhatsAppAI()">
		<i class="fas fa-sparkles text-gold"></i> <?php esc_html_e( 'Need help choosing a Bohra Rida or custom size?', 'aiman-collection' ); ?>
	</div>

	<!-- Floating Circular Button -->
	<button type="button" class="wa-ai-floating-btn" id="waAiFloatingBtn" onclick="window.AimanStore.toggleWhatsAppAI()" aria-label="<?php esc_attr_e( 'Bohra AI Stylist', 'aiman-collection' ); ?>">
		<i class="fab fa-whatsapp"></i>
		<span class="pulse-ring"></span>
	</button>

	<!-- Chat Box Simulator -->
	<div class="wa-ai-chat-box" id="waAiChatBox" style="display: none;">
		<div class="wa-ai-header">
			<div style="display: flex; align-items: center; gap: 0.75rem;">
				<div class="wa-ai-avatar">
					<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/aiman_logo.png' ); ?>" alt="Aiman AI Stylist">
					<span class="online-indicator"></span>
				</div>
				<div>
					<div class="wa-ai-title">Aiman Bohra AI Stylist <i class="fas fa-badge-check text-gold" style="font-size:0.8rem;"></i></div>
					<div class="wa-ai-status">Verified Dawoodi Bohra Atelier • Online</div>
				</div>
			</div>
			<button type="button" class="wa-ai-close" onclick="window.AimanStore.toggleWhatsAppAI()">&times;</button>
		</div>

		<div class="wa-ai-body" id="waAiBody">
			<div class="wa-ai-message wa-ai-bot">
				<div class="wa-ai-bubble">
					✨ <strong>Assalam-o-Alaikum!</strong> Welcome to Aiman Collection Atelier. Main aapki 24/7 AI Bohra Fashion Stylist hoon. Pardi drape, Ghagra flair, custom stitching ya matching batwa ke baare mein aap kya dekhna pasand karengi?
				</div>
			</div>

			<!-- Suggestion Chips -->
			<div class="wa-ai-chips">
				<button type="button" class="wa-chip" onclick="window.AimanStore.sendWhatsAppAIMessage('What are your Rida prices and discounts?')">💰 Rida Prices</button>
				<button type="button" class="wa-chip" onclick="window.AimanStore.sendWhatsAppAIMessage('How does custom stitching and naap work?')">🧵 Custom Sizing</button>
				<button type="button" class="wa-chip" onclick="window.AimanStore.sendWhatsAppAIMessage('What payment methods and bank details do you accept?')">💳 Bank & COD</button>
				<button type="button" class="wa-chip" onclick="window.AimanStore.sendWhatsAppAIMessage('How long does TCS delivery take?')">📦 TCS Delivery</button>
			</div>
		</div>

		<div class="wa-ai-footer">
			<input type="text" id="waAiInput" placeholder="<?php esc_attr_e( 'Type your question in Urdu or English...', 'aiman-collection' ); ?>" onkeydown="if(event.key==='Enter') window.AimanStore.sendWhatsAppAIMessage();">
			<button type="button" class="wa-ai-send" onclick="window.AimanStore.sendWhatsAppAIMessage()" aria-label="<?php esc_attr_e( 'Send', 'aiman-collection' ); ?>">
				<i class="fas fa-paper-plane"></i>
			</button>
		</div>
	</div>
</div>

<?php wp_footer(); ?>
</body>
</html>
