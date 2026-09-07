<?php
/**
 * The template for displaying product content within loops
 * Styled in Kashaf.pk minimalist fashion aesthetic
 *
 * @package Aiman_Collection
 */

defined( 'ABSPATH' ) || exit;

global $product;

// Ensure visibility.
if ( empty( $product ) || ! $product->is_visible() ) {
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

$wa_msg = "✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI want to order this item:\n👗 *Product:* " . $title . "\n💰 *Price:* " . html_entity_decode( wp_strip_all_tags( $price_html ) ) . "\n🔗 *Link:* " . $product_url . "\n\nPlease confirm availability and delivery.";
$wa_link = "https://wa.me/{$phone}?text=" . rawurlencode( $wa_msg );
?>
<li <?php wc_product_class( 'product-card', $product ); ?>>
	<!-- Product Media Box -->
	<div class="product-img-box">
		<?php if ( $discount > 0 ) : ?>
			<span class="kashaf-sale-badge">-<?php echo esc_html( $discount ); ?>%</span>
		<?php elseif ( $product->is_on_sale() ) : ?>
			<span class="kashaf-sale-badge"><?php esc_html_e( 'SALE', 'aiman-collection' ); ?></span>
		<?php endif; ?>

		<a href="<?php echo esc_url( $product_url ); ?>">
			<?php
			if ( has_post_thumbnail( $product_id ) ) {
				echo get_the_post_thumbnail( $product_id, 'aiman-product-card' );
			} else {
				// Fallback image
				echo '<img src="' . esc_url( get_template_directory_uri() . '/assets/images/summer_collection.jpg' ) . '" alt="' . esc_attr( $title ) . '">';
			}
			?>
		</a>

		<!-- Quick View Button -->
		<button type="button" class="product-quick-view-btn" onclick="window.AimanStore.openQuickView(<?php echo esc_attr( $product_id ); ?>)">
			<i class="fas fa-eye"></i> <?php esc_html_e( 'Quick View', 'aiman-collection' ); ?>
		</button>
	</div>

	<!-- Product Details (Title, Price & WhatsApp Order - NO Add to Cart) -->
	<div class="product-details">
		<h3 class="product-title">
			<a href="<?php echo esc_url( $product_url ); ?>">
				<?php echo esc_html( $title ); ?>
			</a>
		</h3>

		<div class="product-price-row">
			<span class="price-current"><?php echo $product->get_price_html(); ?></span>
		</div>

		<!-- Direct 1-Click WhatsApp Order (Replaces Add to Cart) -->
		<a href="<?php echo esc_url( $wa_link ); ?>" target="_blank" rel="noopener noreferrer" class="product-wa-order-link" title="<?php esc_attr_e( 'Order on WhatsApp', 'aiman-collection' ); ?>">
			<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'Order on WhatsApp', 'aiman-collection' ); ?>
		</a>
	</div>
</li>
