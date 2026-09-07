<?php
/**
 * The template for displaying product content in the single-product.php template
 * Clean Minimalist Layout with Direct WhatsApp Order (No Add to Cart)
 *
 * @package Aiman_Collection
 */

defined( 'ABSPATH' ) || exit;

global $product;

do_action( 'woocommerce_before_single_product' );

if ( post_password_required() ) {
	echo get_the_password_form();
	return;
}

$product_id    = $product->get_id();
$phone         = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
$title         = $product->get_name();
$price_html    = $product->get_price_html();
$product_url   = get_permalink( $product_id );
$regular_price = (float) $product->get_regular_price();
$sale_price    = (float) $product->get_sale_price();
$discount      = ( $product->is_on_sale() && $regular_price > 0 ) ? round( ( ( $regular_price - $sale_price ) / $regular_price ) * 100 ) : 0;
$fabric_type   = get_post_meta( $product_id, '_bohra_fabric_type', true );
$work_type     = get_post_meta( $product_id, '_bohra_work_type', true );

$wa_default_msg = "✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI want to order:\n👗 *Product:* " . $title . "\n💰 *Price:* " . html_entity_decode( wp_strip_all_tags( $price_html ) ) . "\n📏 *Size:* Standard\n🔗 *Link:* " . $product_url . "\n\nPlease confirm availability and delivery.";
$wa_link = "https://wa.me/{$phone}?text=" . rawurlencode( $wa_default_msg );
?>

<div id="product-<?php the_ID(); ?>" <?php wc_product_class( 'single-product-container', $product ); ?>>
	<div class="single-product-layout">
		<!-- Left: Gallery Media -->
		<div class="single-gallery-wrap">
			<div class="single-main-img">
				<?php if ( $discount > 0 ) : ?>
					<span class="kashaf-sale-badge" style="position: absolute; top: 15px; left: 15px; font-size: 0.9rem; padding: 4px 10px; z-index: 5;">-<?php echo esc_html( $discount ); ?>%</span>
				<?php endif; ?>

				<?php
				if ( has_post_thumbnail( $product_id ) ) {
					echo get_the_post_thumbnail( $product_id, 'full', array( 'id' => 'singleMainImg' ) );
				} else {
					echo '<img id="singleMainImg" src="' . esc_url( get_template_directory_uri() . '/assets/images/summer_collection.jpg' ) . '" alt="' . esc_attr( $title ) . '">';
				}
				?>
			</div>
		</div>

		<!-- Right: Product Information & 1-Click WhatsApp Ordering (NO Add to Cart) -->
		<div class="single-product-info">
			<div class="single-cat-breadcrumb">
				<?php echo wc_get_product_category_list( $product_id ); ?>
			</div>

			<h1 class="single-product-title"><?php the_title(); ?></h1>

			<div class="single-rating-row">
				<span class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></span>
				<span>(<?php echo $product->get_review_count() > 0 ? esc_html( $product->get_review_count() ) : '18'; ?> <?php esc_html_e( 'customer reviews', 'aiman-collection' ); ?>)</span>
				<span style="color: #10843d; font-weight: 600; margin-left: auto;"><i class="fas fa-check-circle"></i> <?php esc_html_e( 'In Stock', 'aiman-collection' ); ?></span>
			</div>

			<div class="single-price-box">
				<span class="single-price-current"><?php echo $product->get_price_html(); ?></span>
				<?php if ( $discount > 0 ) : ?>
					<span class="single-save-badge"><?php echo esc_html( $discount ); ?>% OFF</span>
				<?php endif; ?>
			</div>

			<div class="single-short-desc" style="font-size: 0.95rem; color: #555; line-height: 1.7; margin-bottom: 20px;">
				<?php
				if ( $product->get_short_description() ) {
					echo wp_kses_post( $product->get_short_description() );
				} else {
					echo esc_html__( 'Handcrafted luxury designer pret ensemble featuring delicate craftsmanship, breathable fabric, and comfortable graceful drapery.', 'aiman-collection' );
				}
				?>
			</div>

			<!-- Size Selection -->
			<div class="size-selector-wrap">
				<div class="size-selector-title"><?php esc_html_e( 'Select Size:', 'aiman-collection' ); ?> <span id="selectedSizeLabel" style="color:#7a0b1a; font-weight:700;">Medium (M)</span></div>
				<div class="size-options">
					<button type="button" class="size-btn" onclick="window.AimanStore.selectSize('Small (S)', this)">Small (S)</button>
					<button type="button" class="size-btn active" onclick="window.AimanStore.selectSize('Medium (M)', this)">Medium (M)</button>
					<button type="button" class="size-btn" onclick="window.AimanStore.selectSize('Large (L)', this)">Large (L)</button>
					<button type="button" class="size-btn" onclick="window.AimanStore.selectSize('Custom Naap', this)">Custom Naap</button>
				</div>
			</div>

			<!-- PRIMARY CALL TO ACTION: DIRECT WHATSAPP ORDER (NO ADD TO CART) -->
			<div style="margin: 15px 0 25px 0;">
				<a href="<?php echo esc_url( $wa_link ); ?>" id="singleProductWaBtn" target="_blank" rel="noopener noreferrer" class="whatsapp-order-cta-btn">
					<i class="fab fa-whatsapp"></i>
					<span><?php esc_html_e( 'Order on WhatsApp', 'aiman-collection' ); ?></span>
				</a>
			</div>

			<!-- Trust & Delivery Guarantees -->
			<div class="product-trust-features">
				<div class="trust-item">
					<i class="fas fa-truck-fast"></i>
					<div>
						<strong><?php esc_html_e( 'Free Express Delivery', 'aiman-collection' ); ?></strong>
						<span style="display:block; font-size:0.75rem; color:#777;"><?php esc_html_e( 'TCS Courier Nationwide', 'aiman-collection' ); ?></span>
					</div>
				</div>
				<div class="trust-item">
					<i class="fas fa-hand-holding-dollar"></i>
					<div>
						<strong><?php esc_html_e( 'Cash on Delivery', 'aiman-collection' ); ?></strong>
						<span style="display:block; font-size:0.75rem; color:#777;"><?php esc_html_e( 'Pay at doorstep or Raast', 'aiman-collection' ); ?></span>
					</div>
				</div>
				<div class="trust-item">
					<i class="fas fa-arrow-rotate-left"></i>
					<div>
						<strong><?php esc_html_e( 'Easy Exchange', 'aiman-collection' ); ?></strong>
						<span style="display:block; font-size:0.75rem; color:#777;"><?php esc_html_e( '7 days hassle-free', 'aiman-collection' ); ?></span>
					</div>
				</div>
				<div class="trust-item">
					<i class="fas fa-shield-check"></i>
					<div>
						<strong><?php esc_html_e( '100% Original', 'aiman-collection' ); ?></strong>
						<span style="display:block; font-size:0.75rem; color:#777;"><?php esc_html_e( 'Karachi Atelier Masterpiece', 'aiman-collection' ); ?></span>
					</div>
				</div>
			</div>

			<!-- Sizing & Fabric Specs -->
			<?php if ( $fabric_type || $work_type ) : ?>
				<div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--color-border-subtle); font-size: 0.88rem; color: #444;">
					<?php if ( $fabric_type ) : ?>
						<p style="margin-bottom: 6px;"><strong><?php esc_html_e( 'Fabric Composition:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $fabric_type ); ?></p>
					<?php endif; ?>
					<?php if ( $work_type ) : ?>
						<p style="margin-bottom: 6px;"><strong><?php esc_html_e( 'Craftsmanship:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $work_type ); ?></p>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>

	<!-- Reviews & Related Products -->
	<?php
	/**
	 * Hook: woocommerce_after_single_product_summary.
	 *
	 * @hooked woocommerce_output_product_data_tabs - 10
	 * @hooked woocommerce_upsell_display - 15
	 * @hooked woocommerce_output_related_products - 20
	 */
	do_action( 'woocommerce_after_single_product_summary' );
	?>
</div>

<?php do_action( 'woocommerce_after_single_product' ); ?>
