<?php
/**
 * AIMAN COLLECTION — Header Template
 * Inspired by Kashaf.pk Luxury Minimalist Aesthetic
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$shop_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/shop/' );
$phone    = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- 1. TOP ANNOUNCEMENT BAR (KASHAF SIGNATURE MAROON MARQUEE) -->
<div class="top-announcement">
	<div class="marquee-track">
		<div class="marquee-item"><?php echo esc_html( get_theme_mod( 'aiman_announcement_text', 'Summer Sale Live now – Flat 50% off – Free shipping Nationwide' ) ); ?></div>
		<div class="marquee-item"><?php echo esc_html( get_theme_mod( 'aiman_announcement_text', 'Summer Sale Live now – Flat 50% off – Free shipping Nationwide' ) ); ?></div>
		<div class="marquee-item"><?php echo esc_html( get_theme_mod( 'aiman_announcement_text', 'Summer Sale Live now – Flat 50% off – Free shipping Nationwide' ) ); ?></div>
		<div class="marquee-item"><?php echo esc_html( get_theme_mod( 'aiman_announcement_text', 'Summer Sale Live now – Flat 50% off – Free shipping Nationwide' ) ); ?></div>
	</div>
</div>

<!-- 2. MAIN CLEAN WHITE HEADER -->
<header class="site-header" id="siteHeader">
	<div class="container">
		<!-- Top Row: Mobile Toggle, Centered Calligraphy Logo, Admin Suite & Login -->
		<div class="header-top-row">
			<div class="header-top-left">
				<button type="button" class="mobile-menu-btn" onclick="window.AimanStore.toggleMobileMenu()" aria-label="<?php esc_attr_e( 'Toggle Menu', 'aiman-collection' ); ?>">
					<i class="fas fa-bars"></i>
				</button>
			</div>

			<!-- Elegant Brand Logo -->
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="header-brand-logo" rel="home">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<span class="brand-calligraphy">ایمن کلیکشن</span>
					<span class="brand-subtitle">AIMAN COLLECTION • KARACHI ATELIER</span>
				<?php endif; ?>
			</a>

			<!-- Right: Clean (NO login button, NO cart icon) -->
			<div class="header-top-right" style="display:none;"></div>
		</div>

		<!-- Bottom Nav Row: Requested Bohra Categories & Search -->
		<div class="header-nav-row">
			<nav class="header-nav-container" aria-label="<?php esc_attr_e( 'Main Navigation', 'aiman-collection' ); ?>">
				<ul class="header-nav-menu">
					<li><a href="<?php echo esc_url( $shop_url ); ?>"><?php esc_html_e( 'All Products', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'heavy-rida', $shop_url ) ); ?>"><?php esc_html_e( '👑 Heavy Rida / Bridal', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'silk-rida', $shop_url ) ); ?>"><?php esc_html_e( '🥻 Silk Rida', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'new-arrivals', $shop_url ) ); ?>"><?php esc_html_e( '✨ New Arrivals', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'cotton-pret', $shop_url ) ); ?>"><?php esc_html_e( '🌸 Cotton Pret', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'boski-fabric', $shop_url ) ); ?>"><?php esc_html_e( '🧵 Boski Fabric', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'bags-batwas', $shop_url ) ); ?>"><?php esc_html_e( '👜 Bags & Batwas', 'aiman-collection' ); ?></a></li>
					<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'pouches', $shop_url ) ); ?>"><?php esc_html_e( '💄 Vanity & Topi Pouches', 'aiman-collection' ); ?></a></li>
				</ul>
			</nav>

			<!-- Search Button -->
			<div class="header-search-wrap" onclick="window.AimanStore.openSearchModal()">
				<span><?php esc_html_e( 'Search', 'aiman-collection' ); ?></span>
				<i class="fas fa-search"></i>
			</div>
		</div>
	</div>
</header>

<!-- 3. SEARCH OVERLAY MODAL -->
<div class="kashaf-search-overlay" id="searchModal" onclick="if(event.target===this) window.AimanStore.closeSearchModal();">
	<div class="kashaf-search-box">
		<button type="button" class="close-btn" onclick="window.AimanStore.closeSearchModal()">&times;</button>
		<h4 style="font-size: 1.1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;"><?php esc_html_e( 'Search Collection', 'aiman-collection' ); ?></h4>
		<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="kashaf-search-form">
			<div class="kashaf-search-input-wrap">
				<input type="text" name="s" id="modalSearchInput" placeholder="<?php esc_attr_e( 'Search bridal ridas, silk rida, cotton pret, batwas...', 'aiman-collection' ); ?>" autocomplete="off" value="<?php echo get_search_query(); ?>" oninput="if(window.AimanStore&&window.AimanStore.handleSearchInput) window.AimanStore.handleSearchInput(this.value);">
				<input type="hidden" name="post_type" value="product">
				<button type="submit" aria-label="<?php esc_attr_e( 'Search', 'aiman-collection' ); ?>"><i class="fas fa-search"></i></button>

				<!-- Live Search Dropdown -->
				<div id="searchLiveDropdown" class="search-live-dropdown"></div>
			</div>
		</form>
	</div>
</div>

<!-- 4. MOBILE DRAWER NAVIGATION -->
<div class="mobile-drawer-overlay" id="mobileDrawer" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:10002;" onclick="if(event.target===this) window.AimanStore.toggleMobileMenu();">
	<div class="mobile-drawer-content" style="background:#ffffff; width:300px; max-width:85vw; height:100%; padding:25px; display:flex; flex-direction:column; box-shadow:0 0 20px rgba(0,0,0,0.2);">
		<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f0f0f0; padding-bottom:15px; margin-bottom:20px;">
			<span class="brand-calligraphy" style="font-size:1.35rem;">ایمن کلیکشن</span>
			<button type="button" onclick="window.AimanStore.toggleMobileMenu()" style="background:none; border:none; font-size:1.6rem; cursor:pointer;">&times;</button>
		</div>
		<ul style="list-style:none; padding:0; margin:0; line-height:2.6;">
			<li><a href="<?php echo esc_url( $shop_url ); ?>" style="font-weight:600; font-size:0.92rem;"><?php esc_html_e( 'All Products', 'aiman-collection' ); ?></a></li>
			<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'heavy-rida', $shop_url ) ); ?>" style="font-weight:600; font-size:0.92rem;"><?php esc_html_e( '👑 Heavy Rida / Bridal', 'aiman-collection' ); ?></a></li>
			<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'silk-rida', $shop_url ) ); ?>" style="font-weight:600; font-size:0.92rem;"><?php esc_html_e( '🥻 Silk Rida', 'aiman-collection' ); ?></a></li>
			<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'new-arrivals', $shop_url ) ); ?>" style="font-weight:600; font-size:0.92rem;"><?php esc_html_e( '✨ New Arrivals', 'aiman-collection' ); ?></a></li>
			<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'cotton-pret', $shop_url ) ); ?>" style="font-weight:600; font-size:0.92rem;"><?php esc_html_e( '🌸 Cotton Pret', 'aiman-collection' ); ?></a></li>
			<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'boski-fabric', $shop_url ) ); ?>" style="font-weight:600; font-size:0.92rem;"><?php esc_html_e( '🧵 Boski Fabric', 'aiman-collection' ); ?></a></li>
			<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'bags-batwas', $shop_url ) ); ?>" style="font-weight:600; font-size:0.92rem;"><?php esc_html_e( '👜 Bags & Batwas', 'aiman-collection' ); ?></a></li>
			<li><a href="<?php echo esc_url( add_query_arg( 'product_cat', 'pouches', $shop_url ) ); ?>" style="font-weight:600; font-size:0.92rem;"><?php esc_html_e( '💄 Vanity & Topi Pouches', 'aiman-collection' ); ?></a></li>
		</ul>
		<div style="margin-top:auto; padding-top:20px; border-top:1px solid #f0f0f0;">
			<a href="<?php echo esc_url( home_url( '/merchant/' ) ); ?>" class="admin-btn admin-btn-primary" style="width:100%; justify-content:center; margin-bottom:12px; text-decoration:none;">
				<i class="fas fa-lock"></i> <?php esc_html_e( 'Admin & Sales Console', 'aiman-collection' ); ?>
			</a>
			<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap:8px; color:#25D366; font-weight:700;">
				<i class="fab fa-whatsapp" style="font-size:1.3rem;"></i> <?php esc_html_e( 'Chat on WhatsApp', 'aiman-collection' ); ?>
			</a>
		</div>
	</div>
</div>
