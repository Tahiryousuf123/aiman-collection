<?php
/**
 * AIMAN COLLECTION — Front Page / Homepage Template
 *
 * @package Aiman_Collection
 */

get_header();

$phone         = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
$hero_badge    = get_theme_mod( 'aiman_hero_badge', '👑 Karachi\'s Royal Atelier • Dawoodi Bohra Libas' );
$hero_title    = get_theme_mod( 'aiman_hero_title', 'Haute Couture Ridas & Handcrafted Elegance' );
$hero_subtitle = get_theme_mod( 'aiman_hero_subtitle', 'Bespoke Dawoodi Bohra ceremonial bridal ridas, everyday pastel cotton pret, matching designer batwas, and luxury vanity accessories.' );
$hero_image    = get_theme_mod( 'aiman_hero_image', '' );
if ( empty( $hero_image ) ) {
	$hero_image = get_template_directory_uri() . '/assets/images/aiman_logo.png';
}
$shop_url      = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/shop/' );
?>

<main id="primary" class="site-main">

	<!-- 1. LUXURY HERO BANNER -->
	<section class="hero-section" style="padding: 3.5rem 0; background: radial-gradient(circle at center top, rgba(197, 168, 128, 0.12) 0%, rgba(11, 13, 17, 0.98) 70%); border-bottom: 1px solid var(--color-border);">
		<div class="container hero-container" style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 3rem; align-items: center;">
			<div class="hero-content">
				<div class="hero-badge" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(197, 168, 128, 0.15); border: 1px solid var(--color-border); padding: 6px 16px; border-radius: var(--radius-full); font-size: 0.82rem; font-weight: 700; color: var(--color-gold-light); margin-bottom: 1.2rem; text-transform: uppercase; letter-spacing: 0.06em;">
					<span class="pulse-dot"></span> <?php echo esc_html( $hero_badge ); ?>
				</div>

				<h1 class="hero-title" style="font-family: var(--font-heading); font-size: clamp(2.2rem, 4vw, 3.4rem); color: var(--color-text-primary); line-height: 1.18; margin: 0 0 1.2rem 0;">
					<?php echo wp_kses_post( $hero_title ); ?>
				</h1>

				<p class="hero-description" style="font-size: 1.1rem; color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 2rem; max-width: 580px;">
					<?php echo esc_html( $hero_subtitle ); ?>
				</p>

				<div class="hero-actions" style="display: flex; gap: 1rem; flex-wrap: wrap;">
					<a href="<?php echo esc_url( $shop_url ); ?>" class="btn btn-primary btn-lg" style="background: linear-gradient(135deg, var(--color-gold-primary), var(--color-gold-dark)); color: #0b0d11; font-weight: 800; padding: 0.9rem 2.2rem; border-radius: var(--radius-full); text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; display: inline-flex; align-items: center; gap: 0.6rem; box-shadow: 0 6px 20px rgba(197, 168, 128, 0.35);">
						<i class="fas fa-crown"></i> <?php esc_html_e( 'Explore Rida Catalog', 'aiman-collection' ); ?>
					</a>
					<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode( 'Assalam-o-Alaikum Aiman Collection! I would like to inquire about custom Bohra Rida stitching and bespoke designs.' ); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg" style="background: linear-gradient(135deg, var(--color-accent-whatsapp), var(--color-accent-whatsapp-dark)); color: #fff; font-weight: 800; padding: 0.9rem 1.8rem; border-radius: var(--radius-full); text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; display: inline-flex; align-items: center; gap: 0.6rem; box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);">
						<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'Custom Stitching Naap', 'aiman-collection' ); ?>
					</a>
				</div>

				<div class="hero-features-row" style="display: flex; gap: 2rem; margin-top: 2.5rem; border-top: 1px solid var(--color-border-subtle); padding-top: 1.5rem; flex-wrap: wrap;">
					<div style="display: flex; align-items: center; gap: 0.6rem;">
						<i class="fas fa-sparkles text-gold" style="font-size: 1.2rem;"></i>
						<span style="font-size: 0.88rem; color: var(--color-text-secondary); font-weight: 600;"><?php esc_html_e( '100% Pure Silk & Cotton', 'aiman-collection' ); ?></span>
					</div>
					<div style="display: flex; align-items: center; gap: 0.6rem;">
						<i class="fas fa-truck-fast text-gold" style="font-size: 1.2rem;"></i>
						<span style="font-size: 0.88rem; color: var(--color-text-secondary); font-weight: 600;"><?php esc_html_e( 'TCS Express Nationwide', 'aiman-collection' ); ?></span>
					</div>
					<div style="display: flex; align-items: center; gap: 0.6rem;">
						<i class="fas fa-shield-check text-gold" style="font-size: 1.2rem;"></i>
						<span style="font-size: 0.88rem; color: var(--color-text-secondary); font-weight: 600;"><?php esc_html_e( 'COD & Bank Transfer', 'aiman-collection' ); ?></span>
					</div>
				</div>
			</div>

			<div class="hero-media-wrap" style="position: relative; text-align: center;">
				<div class="hero-image-frame" style="background: var(--color-bg-card); border: 2px solid var(--color-border); border-radius: var(--radius-lg); padding: 1rem; box-shadow: var(--shadow-lg), 0 0 35px rgba(197, 168, 128, 0.2); position: relative; overflow: hidden;">
					<img src="<?php echo esc_url( $hero_image ); ?>" alt="Aiman Collection Royal Bohra Libas" style="width: 100%; border-radius: var(--radius-md); object-fit: cover; aspect-ratio: 4/5;">
					<div style="position: absolute; bottom: 20px; left: 20px; right: 20px; background: rgba(19, 22, 28, 0.92); backdrop-filter: blur(8px); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.9rem 1.2rem; text-align: left;">
						<span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.08em;"><?php esc_html_e( 'HAUTE COUTURE ATELIER', 'aiman-collection' ); ?></span>
						<h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--color-text-primary); margin: 2px 0 0 0;"><?php esc_html_e( 'Handcrafted Bridal Ridas & Matching Sets', 'aiman-collection' ); ?></h4>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 2. CATEGORY SHOWCASE -->
	<section class="section category-showcase-section" style="padding: 4rem 0; background: var(--color-bg-main);">
		<div class="container">
			<div class="section-header" style="text-align: center; margin-bottom: 2.5rem;">
				<span class="section-tag" style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.1em;"><?php esc_html_e( 'EXCLUSIVE CURATIONS', 'aiman-collection' ); ?></span>
				<h2 class="section-title" style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.2rem; margin-top: 0.4rem;"><?php esc_html_e( 'Shop by Bohra Libas Category', 'aiman-collection' ); ?></h2>
			</div>

			<div class="category-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
				<!-- Cat 1: Ridas -->
				<a href="<?php echo esc_url( $shop_url ); ?>" class="category-card" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.8rem; text-decoration: none; color: inherit; text-align: center; transition: all var(--transition-normal); display: flex; flex-direction: column; align-items: center;">
					<div style="width: 65px; height: 65px; border-radius: 50%; background: rgba(197, 168, 128, 0.15); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--color-gold-primary); margin-bottom: 1.2rem;">
						<i class="fas fa-crown"></i>
					</div>
					<h3 style="font-family: var(--font-heading); color: var(--color-text-primary); font-size: 1.25rem; margin-bottom: 0.4rem;"><?php esc_html_e( 'Dawoodi Bohra Ridas', 'aiman-collection' ); ?></h3>
					<p style="font-size: 0.88rem; color: var(--color-text-secondary); margin: 0;"><?php esc_html_e( 'Bridal Silk, Heavy Zardozi & Pastel Cotton', 'aiman-collection' ); ?></p>
				</a>

				<!-- Cat 2: Bags & Batwas -->
				<a href="<?php echo esc_url( $shop_url ); ?>" class="category-card" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.8rem; text-decoration: none; color: inherit; text-align: center; transition: all var(--transition-normal); display: flex; flex-direction: column; align-items: center;">
					<div style="width: 65px; height: 65px; border-radius: 50%; background: rgba(197, 168, 128, 0.15); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--color-gold-primary); margin-bottom: 1.2rem;">
						<i class="fas fa-bag-shopping"></i>
					</div>
					<h3 style="font-family: var(--font-heading); color: var(--color-text-primary); font-size: 1.25rem; margin-bottom: 0.4rem;"><?php esc_html_e( 'Handbags & Batwas', 'aiman-collection' ); ?></h3>
					<p style="font-size: 0.88rem; color: var(--color-text-secondary); margin: 0;"><?php esc_html_e( 'Matching Handmade Rida Batwas & Clutches', 'aiman-collection' ); ?></p>
				</a>

				<!-- Cat 3: Pouches & Accessories -->
				<a href="<?php echo esc_url( $shop_url ); ?>" class="category-card" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.8rem; text-decoration: none; color: inherit; text-align: center; transition: all var(--transition-normal); display: flex; flex-direction: column; align-items: center;">
					<div style="width: 65px; height: 65px; border-radius: 50%; background: rgba(197, 168, 128, 0.15); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--color-gold-primary); margin-bottom: 1.2rem;">
						<i class="fas fa-wand-magic-sparkles"></i>
					</div>
					<h3 style="font-family: var(--font-heading); color: var(--color-text-primary); font-size: 1.25rem; margin-bottom: 0.4rem;"><?php esc_html_e( 'Topi & Vanity Pouches', 'aiman-collection' ); ?></h3>
					<p style="font-size: 0.88rem; color: var(--color-text-secondary); margin: 0;"><?php esc_html_e( 'Velvet Organizers & Quilted Travel Pouches', 'aiman-collection' ); ?></p>
				</a>

				<!-- Cat 4: Super Deals -->
				<a href="#superDealsSection" class="category-card" style="background: linear-gradient(135deg, rgba(102, 24, 38, 0.6), rgba(19, 22, 28, 0.95)); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.8rem; text-decoration: none; color: inherit; text-align: center; transition: all var(--transition-normal); display: flex; flex-direction: column; align-items: center;">
					<div style="width: 65px; height: 65px; border-radius: 50%; background: rgba(224, 169, 109, 0.2); border: 1px solid var(--color-gold-primary); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--color-rose-gold); margin-bottom: 1.2rem;">
						<i class="fas fa-fire"></i>
					</div>
					<h3 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.25rem; margin-bottom: 0.4rem;"><?php esc_html_e( 'Festive Super Deals 🔥', 'aiman-collection' ); ?></h3>
					<p style="font-size: 0.88rem; color: var(--color-text-secondary); margin: 0;"><?php esc_html_e( 'Flat 25% Off with Promo Code AIMAN25', 'aiman-collection' ); ?></p>
				</a>
			</div>
		</div>
	</section>

	<!-- 3. SUPER DEALS SECTION WITH LIVE COUNTDOWN TIMER -->
	<section id="superDealsSection" class="section deals-section" style="padding: 4rem 0; background: var(--color-bg-card); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
		<div class="container">
			<div class="deals-banner-wrap" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem; margin-bottom: 2.5rem; background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.8rem 2.2rem;">
				<div>
					<span style="background: linear-gradient(135deg, var(--color-accent-burgundy), #991b1b); color: #fff; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: var(--radius-full); text-transform: uppercase; letter-spacing: 0.08em; display: inline-block; margin-bottom: 0.6rem;">
						<i class="fas fa-bolt"></i> <?php esc_html_e( 'LIMITED TIME CLEARANCE', 'aiman-collection' ); ?>
					</span>
					<h2 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.8rem; margin: 0;"><?php esc_html_e( 'Dawoodi Bohra Festive Super Deals', 'aiman-collection' ); ?></h2>
					<p style="color: var(--color-text-secondary); margin: 0.3rem 0 0 0;"><?php esc_html_e( 'Enjoy exclusive savings on signature silk ridas and bridal sets. TCS Free Delivery Included.', 'aiman-collection' ); ?></p>
				</div>

				<!-- Countdown Timer -->
				<div class="deals-countdown-box" style="display: flex; gap: 0.8rem; align-items: center;">
					<div style="background: var(--color-bg-main); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.6rem 0.9rem; text-align: center; min-width: 60px;">
						<span id="dealDays" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--color-gold-primary); display: block;">03</span>
						<span style="font-size: 0.68rem; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700;"><?php esc_html_e( 'Days', 'aiman-collection' ); ?></span>
					</div>
					<span style="font-weight: 800; color: var(--color-gold-primary); font-size: 1.2rem;">:</span>
					<div style="background: var(--color-bg-main); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.6rem 0.9rem; text-align: center; min-width: 60px;">
						<span id="dealHours" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--color-gold-primary); display: block;">14</span>
						<span style="font-size: 0.68rem; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700;"><?php esc_html_e( 'Hours', 'aiman-collection' ); ?></span>
					</div>
					<span style="font-weight: 800; color: var(--color-gold-primary); font-size: 1.2rem;">:</span>
					<div style="background: var(--color-bg-main); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.6rem 0.9rem; text-align: center; min-width: 60px;">
						<span id="dealMinutes" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--color-gold-primary); display: block;">42</span>
						<span style="font-size: 0.68rem; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700;"><?php esc_html_e( 'Mins', 'aiman-collection' ); ?></span>
					</div>
					<span style="font-weight: 800; color: var(--color-gold-primary); font-size: 1.2rem;">:</span>
					<div style="background: var(--color-bg-main); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.6rem 0.9rem; text-align: center; min-width: 60px;">
						<span id="dealSeconds" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--color-rose-gold); display: block;">18</span>
						<span style="font-size: 0.68rem; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700;"><?php esc_html_e( 'Secs', 'aiman-collection' ); ?></span>
					</div>
				</div>
			</div>

			<!-- Deals Products Grid -->
			<div class="products-grid-container">
				<?php
				if ( class_exists( 'WooCommerce' ) ) {
					$deal_args = array(
						'post_type'      => 'product',
						'posts_per_page' => 4,
						'meta_query'     => WC()->query->get_meta_query(),
						'post__in'       => array_merge( array( 0 ), wc_get_product_ids_on_sale() ),
					);
					$deals_query = new WP_Query( $deal_args );

					if ( $deals_query->have_posts() ) {
						echo '<ul class="products">';
						while ( $deals_query->have_posts() ) {
							$deals_query->the_post();
							wc_get_template_part( 'content', 'product' );
						}
						echo '</ul>';
						wp_reset_postdata();
					} else {
						// Fallback query latest products
						$latest_args = array(
							'post_type'      => 'product',
							'posts_per_page' => 4,
						);
						$latest_query = new WP_Query( $latest_args );
						if ( $latest_query->have_posts() ) {
							echo '<ul class="products">';
							while ( $latest_query->have_posts() ) {
								$latest_query->the_post();
								wc_get_template_part( 'content', 'product' );
							}
							echo '</ul>';
							wp_reset_postdata();
						}
					}
				}
				?>
			</div>
		</div>
	</section>

	<!-- 4. FEATURED PRODUCTS CATALOG -->
	<section class="section catalog-section" style="padding: 4.5rem 0; background: var(--color-bg-main);">
		<div class="container">
			<div class="section-header" style="text-align: center; margin-bottom: 3rem;">
				<span class="section-tag" style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.1em;"><?php esc_html_e( 'ATELIER MASTERPIECES', 'aiman-collection' ); ?></span>
				<h2 class="section-title" style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.2rem; margin-top: 0.4rem;"><?php esc_html_e( 'Featured Dawoodi Bohra Libas', 'aiman-collection' ); ?></h2>
				<p style="color: var(--color-text-secondary); max-width: 600px; margin: 0.5rem auto 0 auto;"><?php esc_html_e( 'Authentic craftsmanship designed with pure silk, intricate zardozi, and comfortable pardi drapery.', 'aiman-collection' ); ?></p>
			</div>

			<div class="products-grid-container">
				<?php
				if ( class_exists( 'WooCommerce' ) ) {
					$featured_args = array(
						'post_type'      => 'product',
						'posts_per_page' => 8,
						'orderby'        => 'date',
						'order'          => 'DESC',
					);
					$featured_query = new WP_Query( $featured_args );

					if ( $featured_query->have_posts() ) {
						echo '<ul class="products">';
						while ( $featured_query->have_posts() ) {
							$featured_query->the_post();
							wc_get_template_part( 'content', 'product' );
						}
						echo '</ul>';
						wp_reset_postdata();
					} else {
						?>
						<div style="text-align: center; padding: 4.5rem 1.5rem; background: var(--color-bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--color-border); margin: 2rem 0;">
							<i class="fas fa-sparkles text-gold" style="font-size: 2.8rem; margin-bottom: 1.2rem; display: block;"></i>
							<h3 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.8rem; margin-bottom: 0.6rem;"><?php esc_html_e( 'New Collection Coming Soon', 'aiman-collection' ); ?></h3>
							<p style="color: var(--color-text-secondary); max-width: 540px; margin: 0 auto 1.8rem auto; line-height: 1.6;"><?php esc_html_e( 'Our artisans are curating exclusive Dawoodi Bohra Haute Couture Ridas, bespoke matching batwas, and luxury vanity pouches.', 'aiman-collection' ); ?></p>
							<div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
								<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode( 'Hello Aiman Collection! I would like to inquire about custom rida stitching and catalogue.' ); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
									<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'Inquire on WhatsApp Concierge', 'aiman-collection' ); ?>
								</a>
							</div>
						</div>
						<?php
					}
				}
				?>
			</div>

			<div style="text-align: center; margin-top: 3rem;">
				<a href="<?php echo esc_url( $shop_url ); ?>" class="btn btn-primary btn-lg" style="background: linear-gradient(135deg, var(--color-gold-primary), var(--color-gold-dark)); color: #0b0d11; font-weight: 800; padding: 0.9rem 2.5rem; border-radius: var(--radius-full); text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; display: inline-flex; align-items: center; gap: 0.6rem;">
					<?php esc_html_e( 'View Entire Bohra Collection', 'aiman-collection' ); ?> <i class="fas fa-arrow-right"></i>
				</a>
			</div>
		</div>
	</section>

	<!-- 5. ARTISANAL HERITAGE & CRAFTSMANSHIP BANNER -->
	<section class="section heritage-section" style="padding: 4.5rem 0; background: linear-gradient(135deg, #13161C 0%, #1A1E26 100%); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
		<div class="container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: center;">
			<div>
				<span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.1em;"><?php esc_html_e( 'KARACHI ATELIER HERITAGE', 'aiman-collection' ); ?></span>
				<h2 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.2rem; margin: 0.4rem 0 1.2rem 0; line-height: 1.25;">
					<?php esc_html_e( 'Bespoke Tailoring with Dawoodi Bohra Modesty', 'aiman-collection' ); ?>
				</h2>
				<p style="color: var(--color-text-secondary); line-height: 1.8; font-size: 1.05rem; margin-bottom: 1.5rem;">
					<?php esc_html_e( 'At Aiman Collection, every stitch is an ode to traditional Bohra elegance. From intricate metallic cutwork to flowing Ghagra panels, our artisans ensure your libas fits flawlessly with tailored pardi drapery.', 'aiman-collection' ); ?>
				</p>
				<ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; color: var(--color-text-secondary); line-height: 2;">
					<li><i class="fas fa-check-circle text-gold" style="margin-right: 0.6rem;"></i> <strong><?php esc_html_e( 'Pure Egyptian Cotton & Raw Silk Fabrics', 'aiman-collection' ); ?></strong></li>
					<li><i class="fas fa-check-circle text-gold" style="margin-right: 0.6rem;"></i> <strong><?php esc_html_e( 'Custom Pardi Length & Ghagra Gher Tailoring', 'aiman-collection' ); ?></strong></li>
					<li><i class="fas fa-check-circle text-gold" style="margin-right: 0.6rem;"></i> <strong><?php esc_html_e( 'Coordinated Handcrafted Batwas & Pouches', 'aiman-collection' ); ?></strong></li>
				</ul>
				<button type="button" class="btn btn-primary" onclick="window.AimanStore.openSizeGuideModal()" style="background: linear-gradient(135deg, var(--color-gold-primary), var(--color-gold-dark)); color: #0b0d11; font-weight: 800; padding: 0.8rem 2rem; border-radius: var(--radius-full); text-transform: uppercase; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;">
					<i class="fas fa-ruler-combined"></i> <?php esc_html_e( 'View Sizing & Naap Chart', 'aiman-collection' ); ?>
				</button>
			</div>

			<div style="background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-md);">
				<div style="font-size: 0.85rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; margin-bottom: 1rem; letter-spacing: 0.08em;">
					<i class="fas fa-star text-gold"></i> <?php esc_html_e( 'Bohra Community Testimonials', 'aiman-collection' ); ?>
				</div>
				<div style="border-left: 3px solid var(--color-gold-primary); padding-left: 1.2rem; margin-bottom: 1.5rem;">
					<p style="color: var(--color-text-primary); font-style: italic; font-size: 1.05rem; line-height: 1.6; margin-bottom: 0.6rem;">
						"<?php esc_html_e( 'The bridal rida I ordered for my daughter was absolutely breathtaking! The heavy zardozi pardi and matching batwa received endless compliments. Delivery to Karachi was within 24 hours.', 'aiman-collection' ); ?>"
					</p>
					<div style="display: flex; justify-content: space-between; align-items: center;">
						<div>
							<strong style="color: var(--color-gold-light); display: block;"><?php esc_html_e( 'Fatema Bhen Shabbir', 'aiman-collection' ); ?></strong>
							<span style="font-size: 0.8rem; color: var(--color-text-muted);"><?php esc_html_e( 'Hyderi / North Nazimabad, Karachi', 'aiman-collection' ); ?></span>
						</div>
						<div style="color: #f59e0b; font-size: 0.85rem;"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
					</div>
				</div>

				<div style="border-left: 3px solid var(--color-gold-primary); padding-left: 1.2rem;">
					<p style="color: var(--color-text-primary); font-style: italic; font-size: 1.05rem; line-height: 1.6; margin-bottom: 0.6rem;">
						"<?php esc_html_e( 'Everyday cotton ridas are so soft and breathable for Karachi weather. The lace finishing is durable even after multiple washes.', 'aiman-collection' ); ?>"
					</p>
					<div style="display: flex; justify-content: space-between; align-items: center;">
						<div>
							<strong style="color: var(--color-gold-light); display: block;"><?php esc_html_e( 'Sakina Bhen Burhanuddin', 'aiman-collection' ); ?></strong>
							<span style="font-size: 0.8rem; color: var(--color-text-muted);"><?php esc_html_e( 'Clifton, Karachi', 'aiman-collection' ); ?></span>
						</div>
						<div style="color: #f59e0b; font-size: 0.85rem;"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
					</div>
				</div>
			</div>
		</div>
	</section>

</main>

<?php
get_footer();
