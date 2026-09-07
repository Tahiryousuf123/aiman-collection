<?php
/**
 * AIMAN COLLECTION — WooCommerce Custom Hooks & Helpers
 * Minimalist Boutique Setup: WhatsApp 1-Click Ordering (No Add to Cart)
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 1. Declare WooCommerce Support & Clean Image Dimensions
 */
function aiman_woocommerce_setup() {
	add_theme_support( 'woocommerce', array(
		'thumbnail_image_width' => 600,
		'single_image_width'    => 1000,
		'product_grid'          => array(
			'default_rows'    => 4,
			'min_rows'        => 2,
			'max_rows'        => 12,
			'default_columns' => 4,
			'min_columns'     => 2,
			'max_columns'     => 4,
		),
	) );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'aiman_woocommerce_setup' );

/**
 * 2. Remove ALL Default Add to Cart Functionality (As Explicitly Requested)
 */
// Remove Add to Cart from product archives / loops
remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );

// Remove Add to Cart form from single product page
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );

/**
 * 3. Custom Kashaf-Style Solid Black Sale Discount Badge
 */
function aiman_custom_sale_flash( $html, $post, $product ) {
	if ( ! $product || ! $product->is_on_sale() ) {
		return '';
	}

	$regular_price = (float) $product->get_regular_price();
	$sale_price    = (float) $product->get_sale_price();
	$discount      = $regular_price > 0 ? round( ( ( $regular_price - $sale_price ) / $regular_price ) * 100 ) : 0;

	if ( $discount > 0 ) {
		return '<span class="kashaf-sale-badge">-' . esc_html( $discount ) . '%</span>';
	}

	return '<span class="kashaf-sale-badge">' . esc_html__( 'SALE', 'aiman-collection' ) . '</span>';
}
add_filter( 'woocommerce_sale_flash', 'aiman_custom_sale_flash', 10, 3 );

/**
 * 4. Add 1-Click WhatsApp Order CTA on Single Product Page (Replaces Add to Cart)
 */
function aiman_add_single_whatsapp_cta() {
	global $product;
	if ( ! $product ) return;

	$phone       = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
	$title       = $product->get_name();
	$price       = html_entity_decode( wp_strip_all_tags( $product->get_price_html() ) );
	$product_url = get_permalink( $product->get_id() );

	$msg = "✨ *Assalam-o-Alaikum Aiman Collection!* ✨\n\nI would like to order this:\n👗 *Product:* " . $title . "\n💰 *Price:* " . $price . "\n🔗 *Link:* " . $product_url . "\n\nPlease confirm availability and delivery timeline. Thank you!";
	$wa_link = "https://wa.me/{$phone}?text=" . rawurlencode( $msg );

	echo '<div class="single-wa-cta-wrap" style="margin: 20px 0;">';
	echo '<a href="' . esc_url( $wa_link ) . '" target="_blank" rel="noopener noreferrer" class="whatsapp-order-cta-btn" title="' . esc_attr__( 'Order directly on WhatsApp', 'aiman-collection' ) . '">';
	echo '<i class="fab fa-whatsapp"></i> ' . esc_html__( 'Order on WhatsApp', 'aiman-collection' );
	echo '</a>';
	echo '</div>';
}
add_action( 'woocommerce_single_product_summary', 'aiman_add_single_whatsapp_cta', 30 );

/**
 * 5. Custom Catalog Ordering Options (Kashaf-Style)
 */
function aiman_customize_catalog_ordering( $options ) {
	$options = array(
		'menu_order' => __( 'Featured', 'aiman-collection' ),
		'popularity' => __( 'Best Selling', 'aiman-collection' ),
		'date'       => __( 'Date, new to old', 'aiman-collection' ),
		'price'      => __( 'Price, low to high', 'aiman-collection' ),
		'price-desc' => __( 'Price, high to low', 'aiman-collection' ),
	);
	return $options;
}
add_filter( 'woocommerce_catalog_orderby', 'aiman_customize_catalog_ordering' );
