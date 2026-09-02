<?php
/**
 * The template for displaying product content within loops
 *
 * @package Aiman_Collection
 */

defined( 'ABSPATH' ) || exit;

global $product;

// Ensure visibility.
if ( empty( $product ) || ! $product->is_visible() ) {
	return;
}

$product_id   = $product->get_id();
$phone        = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
$title        = $product->get_name();
$price_plain  = html_entity_decode( wp_strip_all_tags( $product->get_price_html() ) );
$product_url  = get_permalink( $product_id );
$categories   = wc_get_product_category_list( $product_id );
$regular_price = (float) $product->get_regular_price();
$sale_price    = (float) $product->get_sale_price();
$discount      = ( $product->is_on_sale() && $regular_price > 0 ) ? round( ( ( $regular_price - $sale_price ) / $regular_price ) * 100 ) : 0;

$wa_msg = "✨ *Assalam-o-Alaikum Aiman Collection Atelier!* ✨\n\nI want to order this Dawoodi Bohra Libas:\n👑 *Product:* " . $title . "\n💰 *Price:* " . $price_plain . "\n🔗 *Link:* " . $product_url . "\n\nPlease confirm availability and custom stitching details.";
$wa_link = "https://wa.me/{$phone}?text=" . rawurlencode( $wa_msg );
?>
<li <?php wc_product_class( 'product-card-item', $product ); ?>>
	<div class="product-thumb-wrap">
		<?php if ( $discount > 0 ) : ?>
			<span class="onsale">-<?php echo esc_html( $discount ); ?>% OFF</span>
		<?php elseif ( $product->is_on_sale() ) : ?>
			<span class="onsale"><?php esc_html_e( 'SALE', 'aiman-collection' ); ?></span>
		<?php endif; ?>

		<a href="<?php echo esc_url( $product_url ); ?>" class="woocommerce-LoopProduct-link">
			<?php
			if ( has_post_thumbnail( $product_id ) ) {
				echo get_the_post_thumbnail( $product_id, 'aiman-product-card' );
			} else {
				echo '<img src="' . esc_url( get_template_directory_uri() . '/assets/images/aiman_logo.png' ) . '" alt="' . esc_attr( $title ) . '">';
			}
			?>
		</a>

		<!-- Quick View Floating Button -->
		<button type="button" class="quick-view-overlay-btn" onclick="window.AimanStore.openQuickView(<?php echo esc_attr( $product_id ); ?>)" title="<?php esc_attr_e( 'Quick View', 'aiman-collection' ); ?>" style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); background: rgba(19, 22, 28, 0.9); border: 1px solid var(--color-border); color: var(--color-gold-light); font-size: 0.78rem; font-weight: 700; padding: 6px 14px; border-radius: var(--radius-full); cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 0.4rem; z-index: 4;">
			<i class="fas fa-eye text-gold"></i> <?php esc_html_e( 'Quick View', 'aiman-collection' ); ?>
		</button>
	</div>

	<div class="product-card-body">
		<div class="product-category-meta">
			<?php echo wp_kses_post( $categories ? $categories : esc_html__( 'Dawoodi Bohra Libas', 'aiman-collection' ) ); ?>
		</div>

		<h2 class="woocommerce-loop-product__title">
			<a href="<?php echo esc_url( $product_url ); ?>" style="color: inherit; text-decoration: none;">
				<?php echo esc_html( $title ); ?>
			</a>
		</h2>

		<div style="margin-bottom: 0.5rem;">
			<?php
			if ( $product->get_rating_count() > 0 ) {
				echo wc_get_rating_html( $product->get_average_rating() );
			} else {
				echo aiman_render_star_rating( 5 );
			}
			?>
		</div>

		<span class="price" data-price-pkr="<?php echo esc_attr( $product->get_price() ); ?>">
			<?php echo $product->get_price_html(); ?>
		</span>

		<div class="product-actions-bar">
			<?php
			// WooCommerce Add to Cart button
			woocommerce_template_loop_add_to_cart();
			?>
			<a href="<?php echo esc_url( $wa_link ); ?>" target="_blank" rel="noopener noreferrer" class="btn-wa-direct" title="<?php esc_attr_e( 'Order on WhatsApp', 'aiman-collection' ); ?>">
				<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'WhatsApp', 'aiman-collection' ); ?>
			</a>
		</div>
	</div>
</li>
