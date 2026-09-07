<?php
/**
 * AIMAN COLLECTION — Front Page Template
 * Inspired by Kashaf.pk Minimalist Luxury Boutique Layout
 * Features Moving Hero Carousel & Bohra Atelier Categories
 *
 * @package Aiman_Collection
 */

get_header();

$phone     = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
$shop_url  = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/shop/' );
$theme_uri = get_template_directory_uri();
?>

<main id="primary" class="site-main">

	<!-- 1. KASHAF-STYLE MOVING HERO SECTION SLIDER -->
	<!-- 1. KASHAF.PK MOVING CATEGORY HERO SECTION (EXACT MATCH TO USER'S SCREENSHOT) -->
	<section class="kashaf-moving-category-section" id="categoryHeroSection">
		<div class="category-hero-layout">
			<!-- Left: Title -->
			<div class="category-hero-left">
				<h2 class="category-hero-title"><?php esc_html_e( 'Shop By', 'aiman-collection' ); ?><br><?php esc_html_e( 'Category', 'aiman-collection' ); ?></h2>
			</div>

			<!-- Right: Moving / Sliding Category Cards Carousel -->
			<div class="category-hero-right">
				<!-- Navigation Arrows -->
				<button type="button" class="cat-arrow-btn cat-prev-btn" onclick="window.AimanStore.scrollCatTrack('left')" aria-label="<?php esc_attr_e( 'Previous Categories', 'aiman-collection' ); ?>">
					<i class="fas fa-chevron-left"></i>
				</button>
				<button type="button" class="cat-arrow-btn cat-next-btn" onclick="window.AimanStore.scrollCatTrack('right')" aria-label="<?php esc_attr_e( 'Next Categories', 'aiman-collection' ); ?>">
					<i class="fas fa-chevron-right"></i>
				</button>

				<div class="category-marquee-container" id="categoryMarqueeContainer">
					<div class="category-marquee-track" id="categoryMarqueeTrack">
						<!-- Set 1 of Cards -->
						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'heavy-rida', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/black_formal.jpg' ); ?>" alt="Heavy Rida / Bridal" loading="eager">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '👑 Heavy Rida / Bridal', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'new-arrivals', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/summer_collection.jpg' ); ?>" alt="New Arrivals" loading="eager">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '✨ New Arrivals', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'cotton-pret', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/mauve_pret.jpg' ); ?>" alt="Cotton Pret" loading="eager">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '🌸 Cotton Pret', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'boski-fabric', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/boski_fabric.jpg' ); ?>" alt="Boski Fabric" loading="eager">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '🧵 Boski Fabric', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'bags-batwas', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/summer_collection.jpg' ); ?>" style="filter: hue-rotate(330deg);" alt="Bags & Batwas" loading="eager">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '👜 Bags & Batwas', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'pouches', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/mauve_pret.jpg' ); ?>" style="filter: hue-rotate(270deg);" alt="Vanity & Topi Pouches" loading="eager">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '💄 Vanity & Topi Pouches', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<!-- Set 2 (Cloned for seamless infinite smooth loop) -->
						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'heavy-rida', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/black_formal.jpg' ); ?>" alt="Heavy Rida / Bridal" loading="lazy">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '👑 Heavy Rida / Bridal', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'new-arrivals', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/summer_collection.jpg' ); ?>" alt="New Arrivals" loading="lazy">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '✨ New Arrivals', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'cotton-pret', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/mauve_pret.jpg' ); ?>" alt="Cotton Pret" loading="lazy">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '🌸 Cotton Pret', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'boski-fabric', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/boski_fabric.jpg' ); ?>" alt="Boski Fabric" loading="lazy">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '🧵 Boski Fabric', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'bags-batwas', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/summer_collection.jpg' ); ?>" style="filter: hue-rotate(330deg);" alt="Bags & Batwas" loading="lazy">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '👜 Bags & Batwas', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>

						<a href="<?php echo esc_url( add_query_arg( 'product_cat', 'pouches', $shop_url ) ); ?>" class="kashaf-cat-card">
							<img src="<?php echo esc_url( $theme_uri . '/assets/images/mauve_pret.jpg' ); ?>" style="filter: hue-rotate(270deg);" alt="Vanity & Topi Pouches" loading="lazy">
							<div class="kashaf-cat-overlay">
								<span class="kashaf-cat-name"><?php esc_html_e( '💄 Vanity & Topi Pouches', 'aiman-collection' ); ?></span>
								<span class="kashaf-cat-arrow">↗</span>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 3. FEATURED COLLECTION & 4-COLUMN PRODUCT GRID (KASHAF SCREENSHOT 2) -->
	<section class="collection-section" id="catalog" style="padding: 20px 0 60px 0;">
		<div class="container">
			<!-- Toolbar: Sort By Bar -->
			<div class="collection-toolbar">
				<div class="toolbar-left">
					<span class="sort-label"><?php esc_html_e( 'SORT BY', 'aiman-collection' ); ?></span>
					<select class="kashaf-sort-select" onchange="window.AimanStore.handleSortChange(this.value)">
						<option value="featured"><?php esc_html_e( 'Featured', 'aiman-collection' ); ?></option>
						<option value="best-selling"><?php esc_html_e( 'Best Selling', 'aiman-collection' ); ?></option>
						<option value="date"><?php esc_html_e( 'Date, new to old', 'aiman-collection' ); ?></option>
						<option value="price-asc"><?php esc_html_e( 'Price, low to high', 'aiman-collection' ); ?></option>
						<option value="price-desc"><?php esc_html_e( 'Price, high to low', 'aiman-collection' ); ?></option>
					</select>
				</div>

				<div class="toolbar-right">
					<span><?php esc_html_e( 'Showing Featured Ensembles', 'aiman-collection' ); ?></span>
				</div>
			</div>

			<!-- 4-Column Product Grid (NO Add to Cart anywhere!) -->
			<div class="products-grid-container">
				<?php
				if ( class_exists( 'WooCommerce' ) ) {
					$args = array(
						'post_type'      => 'product',
						'posts_per_page' => 8,
						'orderby'        => 'date',
						'order'          => 'DESC',
					);
					$loop = new WP_Query( $args );

					if ( $loop->have_posts() ) {
						echo '<ul class="products-grid">';
						while ( $loop->have_posts() ) {
							$loop->the_post();
							wc_get_template_part( 'content', 'product' );
						}
						echo '</ul>';
						wp_reset_postdata();
					} else {
						// Demo Products display if WooCommerce products are not created yet
						?>
						<ul class="products-grid">
							<!-- Demo Item 1: Heavy Bridal Rida -->
							<li class="product-card">
								<div class="product-img-box">
									<span class="kashaf-sale-badge">-35%</span>
									<a href="<?php echo esc_url( $shop_url ); ?>">
										<img src="<?php echo esc_url( $theme_uri . '/assets/images/black_formal.jpg' ); ?>" alt="Royal Crimson Heavy Zardozi Bridal Rida">
									</a>
									<button type="button" class="product-quick-view-btn" onclick="window.AimanStore.openDemoModal('Royal Crimson Heavy Zardozi Bridal Silk Rida', 'Rs. 15,500', 'Rs. 24,000', '<?php echo esc_url( $theme_uri . '/assets/images/black_formal.jpg' ); ?>')">
										<i class="fas fa-eye"></i> Quick View
									</button>
								</div>
								<div class="product-details">
									<h3 class="product-title"><a href="<?php echo esc_url( $shop_url ); ?>">Royal Crimson Heavy Zardozi Ceremonial Bridal Silk Rida</a></h3>
									<div class="product-price-row">
										<span class="price-current">Rs. 15,500</span>
										<span class="price-regular-strike">Rs. 24,000</span>
									</div>
									<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode('Assalam-o-Alaikum Aiman Collection! I want to order Royal Crimson Heavy Zardozi Bridal Rida (Rs. 15,500). Please confirm availability.'); ?>" target="_blank" rel="noopener noreferrer" class="product-wa-order-link">
										<i class="fab fa-whatsapp"></i> Order on WhatsApp
									</a>
								</div>
							</li>

							<!-- Demo Item 2: Cotton Pret -->
							<li class="product-card">
								<div class="product-img-box">
									<span class="kashaf-sale-badge">-38%</span>
									<a href="<?php echo esc_url( $shop_url ); ?>">
										<img src="<?php echo esc_url( $theme_uri . '/assets/images/mauve_pret.jpg' ); ?>" alt="Dusty Rose Mauve Pret">
									</a>
									<button type="button" class="product-quick-view-btn" onclick="window.AimanStore.openDemoModal('Dusty Rose Mauve Scalloped 3-Piece Pret', 'Rs. 5,850', 'Rs. 9,450', '<?php echo esc_url( $theme_uri . '/assets/images/mauve_pret.jpg' ); ?>')">
										<i class="fas fa-eye"></i> Quick View
									</button>
								</div>
								<div class="product-details">
									<h3 class="product-title"><a href="<?php echo esc_url( $shop_url ); ?>">Dusty Rose Mauve Scalloped Cutwork 3-Piece Pret Suit</a></h3>
									<div class="product-price-row">
										<span class="price-current">Rs. 5,850</span>
										<span class="price-regular-strike">Rs. 9,450</span>
									</div>
									<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode('Assalam-o-Alaikum Aiman Collection! I want to order Dusty Rose Mauve 3-Piece Pret (Rs. 5,850). Please confirm availability.'); ?>" target="_blank" rel="noopener noreferrer" class="product-wa-order-link">
										<i class="fab fa-whatsapp"></i> Order on WhatsApp
									</a>
								</div>
							</li>

							<!-- Demo Item 3: New Arrivals -->
							<li class="product-card">
								<div class="product-img-box">
									<span class="kashaf-sale-badge">-50%</span>
									<a href="<?php echo esc_url( $shop_url ); ?>">
										<img src="<?php echo esc_url( $theme_uri . '/assets/images/black_formal.jpg' ); ?>" style="filter: hue-rotate(90deg);" alt="Emerald Velvet Boti Festive Rida">
									</a>
									<button type="button" class="product-quick-view-btn" onclick="window.AimanStore.openDemoModal('Emerald Velvet Boti Festive Milad Rida', 'Rs. 11,900', 'Rs. 19,500', '<?php echo esc_url( $theme_uri . '/assets/images/black_formal.jpg' ); ?>')">
										<i class="fas fa-eye"></i> Quick View
									</button>
								</div>
								<div class="product-details">
									<h3 class="product-title"><a href="<?php echo esc_url( $shop_url ); ?>">Emerald Velvet Boti Festive Milad Libas &amp; Matching Batwa</a></h3>
									<div class="product-price-row">
										<span class="price-current">Rs. 11,900</span>
										<span class="price-regular-strike">Rs. 19,500</span>
									</div>
									<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode('Assalam-o-Alaikum Aiman Collection! I want to order Emerald Velvet Boti Rida (Rs. 11,900). Please confirm availability.'); ?>" target="_blank" rel="noopener noreferrer" class="product-wa-order-link">
										<i class="fab fa-whatsapp"></i> Order on WhatsApp
									</a>
								</div>
							</li>

							<!-- Demo Item 4: Summer Cotton Mint -->
							<li class="product-card">
								<div class="product-img-box">
									<span class="kashaf-sale-badge">-43%</span>
									<a href="<?php echo esc_url( $shop_url ); ?>">
										<img src="<?php echo esc_url( $theme_uri . '/assets/images/summer_collection.jpg' ); ?>" alt="Pastel Mint Summer Pret">
									</a>
									<button type="button" class="product-quick-view-btn" onclick="window.AimanStore.openDemoModal('Pastel Mint Chiffon Dupatta Summer Cotton Pret', 'Rs. 4,850', 'Rs. 8,500', '<?php echo esc_url( $theme_uri . '/assets/images/summer_collection.jpg' ); ?>')">
										<i class="fas fa-eye"></i> Quick View
									</button>
								</div>
								<div class="product-details">
									<h3 class="product-title"><a href="<?php echo esc_url( $shop_url ); ?>">Pastel Mint Chiffon Dupatta Summer Cotton Pret Rida</a></h3>
									<div class="product-price-row">
										<span class="price-current">Rs. 4,850</span>
										<span class="price-regular-strike">Rs. 8,500</span>
									</div>
									<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode('Assalam-o-Alaikum Aiman Collection! I want to order Pastel Mint Summer Pret (Rs. 4,850). Please confirm availability.'); ?>" target="_blank" rel="noopener noreferrer" class="product-wa-order-link">
										<i class="fab fa-whatsapp"></i> Order on WhatsApp
									</a>
								</div>
							</li>
						</ul>
						<?php
					}
				}
				?>
			</div>
		</div>
	</section>

	<!-- 4. BRAND COMMITMENT & TCS GUARANTEE -->
	<section style="background-color: var(--color-bg-light); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 40px 0;">
		<div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; text-align: center;">
			<div style="padding: 15px;">
				<i class="fas fa-truck-fast" style="font-size: 2rem; color: #7a0b1a; margin-bottom: 12px; display: inline-block;"></i>
				<h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 5px;"><?php esc_html_e( 'Free Express Shipping', 'aiman-collection' ); ?></h4>
				<p style="font-size: 0.85rem; color: var(--color-muted);"><?php esc_html_e( 'Free Delivery nationwide across Pakistan via TCS Courier.', 'aiman-collection' ); ?></p>
			</div>

			<div style="padding: 15px;">
				<i class="fas fa-hand-holding-dollar" style="font-size: 2rem; color: #7a0b1a; margin-bottom: 12px; display: inline-block;"></i>
				<h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 5px;"><?php esc_html_e( 'Cash on Delivery (COD)', 'aiman-collection' ); ?></h4>
				<p style="font-size: 0.85rem; color: var(--color-muted);"><?php esc_html_e( 'Pay safely at your doorstep or instant Raast transfer.', 'aiman-collection' ); ?></p>
			</div>

			<div style="padding: 15px;">
				<i class="fab fa-whatsapp" style="font-size: 2rem; color: #25D366; margin-bottom: 12px; display: inline-block;"></i>
				<h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 5px;"><?php esc_html_e( 'WhatsApp Concierge', 'aiman-collection' ); ?></h4>
				<p style="font-size: 0.85rem; color: var(--color-muted);"><?php esc_html_e( 'Direct 1-on-1 assistance for custom sizing and inquiries.', 'aiman-collection' ); ?></p>
			</div>

			<div style="padding: 15px;">
				<i class="fas fa-shield-halved" style="font-size: 2rem; color: #7a0b1a; margin-bottom: 12px; display: inline-block;"></i>
				<h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 5px;"><?php esc_html_e( '100% Authentic Quality', 'aiman-collection' ); ?></h4>
				<p style="font-size: 0.85rem; color: var(--color-muted);"><?php esc_html_e( 'Finest lawn, pure silk, and durable artisan needlework.', 'aiman-collection' ); ?></p>
			</div>
		</div>
	</section>

</main>

<?php
get_footer();
