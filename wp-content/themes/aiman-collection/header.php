<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- TOAST NOTIFICATION CONTAINER -->
<div class="toast-container" id="toastContainer"></div>

<!-- 1. TOP UTILITY ANNOUNCEMENT BAR -->
<div class="top-announcement">
	<div class="container announcement-content">
		<div class="announcement-ticker">
			<span class="pulse-dot"></span>
			<span id="announcementTextDisplay">
				<?php 
				$announcement_text = get_theme_mod( 'aiman_announcement_text', '✨ Bohra Festive Sale: Flat 25% Off with code AIMAN25 | Free Nationwide TCS Delivery' );
				$promo_code        = get_theme_mod( 'aiman_promo_code', 'AIMAN25' );
				echo wp_kses_post( $announcement_text ); 
				?>
				<?php if ( $promo_code ) : ?>
					<strong style="color:var(--color-gold-light); cursor:pointer; margin-left:4px;" onclick="navigator.clipboard.writeText('<?php echo esc_js( $promo_code ); ?>'); window.AimanStore.showToast('Promo code <?php echo esc_js( $promo_code ); ?> copied!','success');" title="<?php esc_attr_e( 'Click to copy promo code', 'aiman-collection' ); ?>"><?php echo esc_html( $promo_code ); ?> 📋</strong>
				<?php endif; ?>
			</span>
		</div>

		<div class="announcement-actions">
			<a href="javascript:void(0)" onclick="window.AimanStore.openLookbookModal()" class="top-nav-link" style="color:var(--color-gold-light); font-weight:700;"><i class="fas fa-book-open"></i> <span data-i18n="lookbook"><?php esc_html_e( 'Festive Lookbook', 'aiman-collection' ); ?></span></a>
			<a href="javascript:void(0)" onclick="window.AimanStore.sendWhatsAppAIMessage('Track my order')" class="top-nav-link"><i class="fas fa-truck-fast"></i> <span data-i18n="track_order"><?php esc_html_e( 'Track Order', 'aiman-collection' ); ?></span></a>
			<a href="javascript:void(0)" onclick="window.AimanStore.toggleWhatsAppAI()" class="top-nav-link"><i class="fas fa-headset"></i> <span data-i18n="customer_care"><?php esc_html_e( 'Customer Care', 'aiman-collection' ); ?></span></a>
			
			<!-- Bilingual Language Switcher -->
			<div class="bilingual-switcher" style="display: flex; align-items: center; background: rgba(0,0,0,0.4); border: 1px solid var(--color-gold-primary); border-radius: 20px; padding: 2px 4px; gap: 2px;">
				<button id="langBtnEN" class="lang-btn active" onclick="window.AimanStore.setLanguage('en')" style="border: none; background: var(--color-gold-primary); color: #000; font-size: 0.68rem; font-weight: 800; border-radius: 12px; padding: 1px 7px; cursor: pointer;">EN 🇬🇧</button>
				<button id="langBtnUR" class="lang-btn" onclick="window.AimanStore.setLanguage('ur')" style="border: none; background: transparent; color: var(--color-gold-light); font-size: 0.68rem; font-weight: 700; border-radius: 12px; padding: 1px 7px; cursor: pointer;">اردو 🇵🇰</button>
			</div>

			<!-- Multi-Currency Selector -->
			<div style="display: flex; align-items: center; gap: 0.3rem;">
				<i class="fas fa-coins" style="font-size: 0.75rem; color: var(--color-gold-primary);"></i>
				<select class="currency-select" id="currencySelector" aria-label="<?php esc_attr_e( 'Select Currency', 'aiman-collection' ); ?>">
					<option value="PKR">PKR (₨)</option>
					<option value="USD">USD ($)</option>
					<option value="AED">AED (د.إ)</option>
					<option value="GBP">GBP (£)</option>
					<option value="SAR">SAR (﷼)</option>
				</select>
			</div>
		</div>
	</div>
</div>

<!-- 2. MAIN E-COMMERCE HEADER -->
<header class="site-header" id="siteHeader">
	<div class="container daraz-header-container">
		<!-- Brand & Action Row -->
		<div class="header-brand-row">
			<!-- Brand Logo -->
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="brand-logo" rel="home">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/aiman_logo.png' ); ?>" alt="<?php bloginfo( 'name' ); ?>" class="brand-logo-img">
					<div class="brand-logo-text">
						<span class="logo-main">AIMAN <span class="accent">COLLECTION</span></span>
						<span class="logo-tagline"><?php bloginfo( 'description' ) ? bloginfo( 'description' ) : esc_html_e( 'DAWOODI BOHRA LIBAS & RIDAS', 'aiman-collection' ); ?></span>
					</div>
				<?php endif; ?>
			</a>

			<!-- Right Action Icons -->
			<div class="nav-actions">
				<!-- WhatsApp Bohra AI Button -->
				<button type="button" class="btn btn-whatsapp daraz-wa-btn" onclick="window.AimanStore.toggleWhatsAppAI()" title="<?php esc_attr_e( 'Talk to Bohra AI Stylist', 'aiman-collection' ); ?>">
					<i class="fab fa-whatsapp"></i> <span class="wa-btn-text"><?php esc_html_e( 'Bohra AI', 'aiman-collection' ); ?></span>
				</button>

				<!-- Wishlist Icon -->
				<a href="<?php echo esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' ) ); ?>" class="action-btn" aria-label="<?php esc_attr_e( 'View Collection', 'aiman-collection' ); ?>" title="<?php esc_attr_e( 'Wishlist', 'aiman-collection' ); ?>">
					<i class="far fa-heart"></i>
				</a>

				<!-- Sliding Mini-Cart Drawer Trigger -->
				<?php 
				$cart_count = ( function_exists( 'WC' ) && WC()->cart ) ? WC()->cart->get_cart_contents_count() : 0;
				$cart_total = ( function_exists( 'WC' ) && WC()->cart ) ? WC()->cart->get_cart_subtotal() : 'Rs. 0';
				?>
				<button type="button" class="action-btn daraz-cart-btn" onclick="window.AimanStore.openCart()" aria-label="<?php esc_attr_e( 'View Shopping Bag', 'aiman-collection' ); ?>" title="<?php esc_attr_e( 'Shopping Bag', 'aiman-collection' ); ?>">
					<div class="cart-icon-wrap">
						<i class="fas fa-shopping-cart"></i>
						<span class="badge-count" id="cartBadge" <?php echo $cart_count > 0 ? '' : 'style="display: none;"'; ?>><?php echo esc_html( $cart_count ); ?></span>
					</div>
					<span class="daraz-cart-label" id="darazCartTotalLabel"><?php echo wp_kses_post( $cart_total ); ?></span>
				</button>
			</div>
		</div>

		<!-- Center Search Bar (Daraz Style) -->
		<div class="daraz-search-wrap">
			<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="daraz-search-form" onsubmit="window.AimanStore.executeGlobalSearch(); return false;">
				<div class="daraz-search-bar">
					<input type="text" id="darazSearchInput" name="s" placeholder="<?php esc_attr_e( 'Search in Aiman Collection (e.g. Silk Rida, Matching Batwa, Velvet Pouch...)', 'aiman-collection' ); ?>" oninput="window.AimanStore.handleGlobalSearchInput(this.value)" autocomplete="off" value="<?php echo get_search_query(); ?>">
					<input type="hidden" name="post_type" value="product">
					<button type="submit" class="daraz-search-btn" aria-label="<?php esc_attr_e( 'Search', 'aiman-collection' ); ?>">
						<i class="fas fa-search"></i>
					</button>
				</div>
			</form>
			<!-- Live Autocomplete Suggestion Dropdown -->
			<div class="search-dropdown" id="globalSearchDropdown" style="display: none;"></div>
		</div>
	</div>

	<!-- 3. CATEGORIES RIBBON -->
	<div class="daraz-category-ribbon">
		<div class="container ribbon-inner">
			<?php
			$shop_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' );
			?>
			<a href="<?php echo esc_url( $shop_url ); ?>" class="ribbon-item active">
				<i class="fas fa-border-all text-gold"></i> <span data-i18n="cat_all"><?php esc_html_e( 'All Products', 'aiman-collection' ); ?></span>
			</a>

			<a href="<?php echo esc_url( home_url( '/#superDealsSection' ) ); ?>" class="ribbon-item" style="background: linear-gradient(135deg, rgba(212,175,55,0.25), rgba(184,134,11,0.25)); border-color: var(--color-gold-primary);">
				<i class="fas fa-fire text-danger"></i> <strong style="color:var(--color-gold-light);" data-i18n="cat_deals"><?php esc_html_e( 'SUPER DEALS 🔥', 'aiman-collection' ); ?></strong>
			</a>

			<?php
			if ( taxonomy_exists( 'product_cat' ) ) {
				$terms = get_terms( array(
					'taxonomy'   => 'product_cat',
					'hide_empty' => false,
					'number'     => 6,
				) );
				if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
					foreach ( $terms as $term ) {
						if ( $term->slug === 'uncategorized' ) continue;
						$icon = aiman_get_category_icon( $term->slug );
						echo '<a href="' . esc_url( get_term_link( $term ) ) . '" class="ribbon-item">';
						echo '<i class="fas ' . esc_attr( $icon ) . ' text-gold"></i> ';
						echo '<span>' . esc_html( $term->name ) . '</span>';
						echo '</a>';
					}
				}
			} else {
				?>
				<a href="<?php echo esc_url( $shop_url ); ?>" class="ribbon-item">
					<i class="fas fa-crown text-gold"></i> <span data-i18n="cat_ridas"><?php esc_html_e( 'Ridas', 'aiman-collection' ); ?></span>
				</a>
				<a href="<?php echo esc_url( $shop_url ); ?>" class="ribbon-item">
					<i class="fas fa-bag-shopping text-gold"></i> <span data-i18n="cat_bags"><?php esc_html_e( 'Handbags & Batwas', 'aiman-collection' ); ?></span>
				</a>
				<a href="<?php echo esc_url( $shop_url ); ?>" class="ribbon-item">
					<i class="fas fa-wand-magic-sparkles text-gold"></i> <span data-i18n="cat_pouches"><?php esc_html_e( 'Cosmetics & Pouches', 'aiman-collection' ); ?></span>
				</a>
				<?php
			}
			?>
		</div>
	</div>
</header>
