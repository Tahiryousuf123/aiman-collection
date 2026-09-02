<?php
/**
 * The template for displaying product content in the single-product.php template
 *
 * @package Aiman_Collection
 */

defined( 'ABSPATH' ) || exit;

global $product;

/**
 * Hook: woocommerce_before_single_product.
 */
do_action( 'woocommerce_before_single_product' );

if ( post_password_required() ) {
	echo get_the_password_form(); // WPCS: XSS ok.
	return;
}

$product_id   = $product->get_id();
$fabric_type  = get_post_meta( $product_id, '_bohra_fabric_type', true );
$work_type    = get_post_meta( $product_id, '_bohra_work_type', true );
$custom_st    = get_post_meta( $product_id, '_bohra_custom_stitching', true );
?>

<div id="product-<?php the_ID(); ?>" <?php wc_product_class( 'single-product-wrap', $product ); ?>>

	<div class="single-product-layout">
		<!-- Left: Gallery Media -->
		<div class="single-product-gallery-wrap">
			<?php
			/**
			 * Hook: woocommerce_before_single_product_summary.
			 *
			 * @hooked woocommerce_show_product_sale_flash - 10
			 * @hooked woocommerce_show_product_images - 20
			 */
			do_action( 'woocommerce_before_single_product_summary' );
			?>
		</div>

		<!-- Right: Product Summary & Purchase CTAs -->
		<div class="single-product-summary">
			<div style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 700; letter-spacing: 0.08em; margin-bottom: 0.5rem;">
				<?php echo wc_get_product_category_list( $product_id ); ?>
			</div>

			<h1 class="product_title entry-title"><?php the_title(); ?></h1>

			<div class="woocommerce-product-rating">
				<?php
				if ( $product->get_rating_count() > 0 ) {
					echo wc_get_rating_html( $product->get_average_rating() );
					echo '<span style="color:var(--color-text-muted); font-size:0.85rem;">(' . esc_html( $product->get_review_count() ) . ' ' . esc_html__( 'reviews', 'aiman-collection' ) . ')</span>';
				} else {
					echo aiman_render_star_rating( 5 );
					echo '<span style="color:var(--color-text-muted); font-size:0.85rem;">(' . esc_html__( 'Verified Bohra Atelier Piece', 'aiman-collection' ) . ')</span>';
				}
				?>
				<span class="stock-badge" style="margin-left: auto; background: rgba(27, 77, 62, 0.4); border: 1px solid var(--color-accent-emerald); color: #4ade80; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: var(--radius-full);">
					<i class="fas fa-check"></i> <?php echo $product->is_in_stock() ? esc_html__( 'In Stock (Atelier Ready)', 'aiman-collection' ) : esc_html__( 'Made-to-Order', 'aiman-collection' ); ?>
				</span>
			</div>

			<div class="price" data-price-pkr="<?php echo esc_attr( $product->get_price() ); ?>">
				<?php echo $product->get_price_html(); ?>
			</div>

			<div class="woocommerce-product-details__short-description">
				<?php
				if ( $product->get_short_description() ) {
					echo wp_kses_post( $product->get_short_description() );
				} else {
					echo wp_kses_post( wp_trim_words( get_the_content(), 30 ) );
				}
				?>
			</div>

			<!-- Bohra Libas Custom Specification Box -->
			<?php if ( $fabric_type || $work_type || $custom_st === 'yes' ) : ?>
				<div class="bohra-custom-specs">
					<h4><i class="fas fa-gem"></i> <?php esc_html_e( 'Bohra Libas Specifications', 'aiman-collection' ); ?></h4>
					<ul>
						<?php if ( $fabric_type ) : ?>
							<li><i class="fas fa-feather text-gold"></i> <strong><?php esc_html_e( 'Fabric Composition:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $fabric_type ); ?></li>
						<?php endif; ?>
						<?php if ( $work_type ) : ?>
							<li><i class="fas fa-wand-magic-sparkles text-gold"></i> <strong><?php esc_html_e( 'Workmanship:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $work_type ); ?></li>
						<?php endif; ?>
						<li><i class="fas fa-scissors text-gold"></i> <strong><?php esc_html_e( 'Custom Stitching:', 'aiman-collection' ); ?></strong> <?php esc_html_e( 'Available (Pardi length & Ghagra naap tailored upon request)', 'aiman-collection' ); ?></li>
					</ul>
				</div>
			<?php endif; ?>

			<?php
			/**
			 * Hook: woocommerce_single_product_summary.
			 *
			 * @hooked woocommerce_template_single_add_to_cart - 30
			 * @hooked woocommerce_template_single_meta - 40
			 * @hooked woocommerce_template_single_sharing - 50
			 */
			woocommerce_template_single_add_to_cart();
			?>

			<!-- Trust Badges & TCS Delivery Guarantee -->
			<div style="background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.2rem; margin-top: 2rem;">
				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem; color: var(--color-text-secondary);">
					<div style="display: flex; align-items: center; gap: 0.6rem;">
						<i class="fas fa-truck-fast text-gold" style="font-size: 1.2rem;"></i>
						<div>
							<strong style="color: var(--color-gold-light); display: block;"><?php esc_html_e( 'TCS Express Delivery', 'aiman-collection' ); ?></strong>
							<span><?php esc_html_e( '24h Karachi / 2-4 Days Nationwide', 'aiman-collection' ); ?></span>
						</div>
					</div>
					<div style="display: flex; align-items: center; gap: 0.6rem;">
						<i class="fas fa-shield-check text-gold" style="font-size: 1.2rem;"></i>
						<div>
							<strong style="color: var(--color-gold-light); display: block;"><?php esc_html_e( 'Payment Flexibility', 'aiman-collection' ); ?></strong>
							<span><?php esc_html_e( 'COD, Meezan Raast, EasyPaisa', 'aiman-collection' ); ?></span>
						</div>
					</div>
				</div>
			</div>

			<div class="product-meta-extra" style="margin-top: 1.5rem;">
				<?php if ( wc_product_sku_enabled() && ( $product->get_sku() || $product->is_type( 'variable' ) ) ) : ?>
					<span><strong><?php esc_html_e( 'SKU:', 'aiman-collection' ); ?></strong> <?php echo ( $sku = $product->get_sku() ) ? esc_html( $sku ) : esc_html__( 'N/A', 'aiman-collection' ); ?></span>
				<?php endif; ?>
				<span><strong><?php esc_html_e( 'Category:', 'aiman-collection' ); ?></strong> <?php echo wc_get_product_category_list( $product_id ); ?></span>
			</div>
		</div>
	</div>

	<!-- Product Tabs (Specifications, Artisan Notes, Reviews) -->
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
