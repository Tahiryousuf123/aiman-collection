<?php
/**
 * AIMAN COLLECTION — WooCommerce Custom Hooks & Helpers
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 1. Declare WooCommerce Support
 */
function aiman_woocommerce_setup() {
	add_theme_support( 'woocommerce', array(
		'thumbnail_image_width' => 600,
		'single_image_width'    => 1000,
		'product_grid'          => array(
			'default_rows'    => 4,
			'min_rows'        => 2,
			'max_rows'        => 8,
			'default_columns' => 4,
			'min_columns'     => 2,
			'max_columns'     => 5,
		),
	) );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'aiman_woocommerce_setup' );

/**
 * 2. Custom Product Badges
 */
function aiman_custom_product_badges() {
	global $product;
	if ( ! $product ) return;

	// Sale Badge
	if ( $product->is_on_sale() ) {
		$regular_price = (float) $product->get_regular_price();
		$sale_price    = (float) $product->get_sale_price();
		$discount      = $regular_price > 0 ? round( ( ( $regular_price - $sale_price ) / $regular_price ) * 100 ) : 0;
		if ( $discount > 0 ) {
			echo '<span class="onsale">-' . esc_html( $discount ) . '% OFF</span>';
		} else {
			echo '<span class="onsale">' . esc_html__( 'SALE', 'aiman-collection' ) . '</span>';
		}
	}

	// New Arrival Badge (Products created within last 30 days)
	$post_date = strtotime( $product->get_date_created() );
	if ( ( time() - $post_date ) < ( 30 * 24 * 60 * 60 ) ) {
		echo '<span class="product-badge-new">' . esc_html__( 'NEW', 'aiman-collection' ) . '</span>';
	}
}
remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );
add_action( 'woocommerce_before_shop_loop_item_title', 'aiman_custom_product_badges', 10 );

/**
 * 3. Add WhatsApp 1-Click Order Button to Single Product Page
 */
function aiman_add_whatsapp_order_button() {
	global $product;
	if ( ! $product ) return;

	$phone       = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
	$title       = $product->get_name();
	$price       = html_entity_decode( wp_strip_all_tags( $product->get_price_html() ) );
	$product_url = get_permalink( $product->get_id() );

	$msg = "✨ *Assalam-o-Alaikum Aiman Collection Atelier!* ✨\n\nI would like to order this Dawoodi Bohra Libas:\n👑 *Product:* " . $title . "\n💰 *Price:* " . $price . "\n🔗 *Link:* " . $product_url . "\n\nPlease confirm availability, stitching customisation (Pardi length/Ghagra flair), and delivery timeline. Thank you!";
	$encoded_msg = rawurlencode( $msg );
	$wa_link     = "https://wa.me/{$phone}?text={$encoded_msg}";

	echo '<a href="' . esc_url( $wa_link ) . '" target="_blank" rel="noopener noreferrer" class="single_wa_order_btn" title="' . esc_attr__( 'Order directly on WhatsApp with AI Concierge', 'aiman-collection' ) . '">';
	echo '<i class="fab fa-whatsapp"></i> ' . esc_html__( '1-Click WhatsApp Order', 'aiman-collection' );
	echo '</a>';
}
add_action( 'woocommerce_after_add_to_cart_button', 'aiman_add_whatsapp_order_button', 15 );

/**
 * 4. Add Bohra Libas Size Guide Trigger on Single Product Page
 */
function aiman_add_size_guide_trigger() {
	echo '<div style="margin: 1rem 0;">';
	echo '<button type="button" class="btn btn-glass btn-sm" onclick="window.AimanStore.openSizeGuideModal()" style="display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 6px 14px; border-radius: 20px; color: var(--color-gold-light);">';
	echo '<i class="fas fa-ruler-combined text-gold"></i> ' . esc_html__( 'Dawoodi Bohra Libas Sizing Guide (Pardi & Ghagra)', 'aiman-collection' );
	echo '</button>';
	echo '</div>';
}
add_action( 'woocommerce_single_product_summary', 'aiman_add_size_guide_trigger', 25 );

/**
 * 5. Add Custom Bohra Specifications Tab
 */
function aiman_custom_bohra_product_tabs( $tabs ) {
	$tabs['aiman_artisan_notes'] = array(
		'title'    => __( '👑 Artisan & Heritage Notes', 'aiman-collection' ),
		'priority' => 20,
		'callback' => 'aiman_artisan_notes_tab_content',
	);
	$tabs['aiman_care_guide'] = array(
		'title'    => __( '✨ Care & Preservation', 'aiman-collection' ),
		'priority' => 30,
		'callback' => 'aiman_care_guide_tab_content',
	);
	return $tabs;
}
add_filter( 'woocommerce_product_tabs', 'aiman_custom_bohra_product_tabs' );

function aiman_artisan_notes_tab_content() {
	?>
	<div class="bohra-artisan-content">
		<h3 style="color: var(--color-gold-light); font-family: var(--font-heading); margin-bottom: 0.8rem;"><?php esc_html_e( 'Handcrafted for the Dawoodi Bohra Community', 'aiman-collection' ); ?></h3>
		<p style="line-height: 1.8; color: var(--color-text-secondary);"><?php esc_html_e( 'Each rida and accessory from Aiman Collection is meticulously crafted by master Bohra artisans in Karachi. We use pure Egyptian cotton, premium silk blends, imported laces, and handcrafted Zardozi & Boti needlework designed specifically for ceremonial and everyday modesty.', 'aiman-collection' ); ?></p>
		<ul style="margin-top: 1rem; color: var(--color-text-secondary); line-height: 1.8;">
			<li><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'Pardi Drapery:', 'aiman-collection' ); ?></strong> <?php esc_html_e( 'Tailored with optimal pleat structure and comfortable head-fit.', 'aiman-collection' ); ?></li>
			<li><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'Ghagra Gher:', 'aiman-collection' ); ?></strong> <?php esc_html_e( 'Full flowing silhouette with authentic border panels.', 'aiman-collection' ); ?></li>
			<li><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'Matching Sets:', 'aiman-collection' ); ?></strong> <?php esc_html_e( 'Custom coordinated batwas, cosmetic pouches, and safra covers available upon request.', 'aiman-collection' ); ?></li>
		</ul>
	</div>
	<?php
}

function aiman_care_guide_tab_content() {
	?>
	<div class="bohra-care-content">
		<h3 style="color: var(--color-gold-light); font-family: var(--font-heading); margin-bottom: 0.8rem;"><?php esc_html_e( 'Preserving Your Luxury Rida', 'aiman-collection' ); ?></h3>
		<ul style="line-height: 1.8; color: var(--color-text-secondary);">
			<li><?php esc_html_e( 'Dry clean recommended for Heavy Zardozi and Pure Silk Ridas.', 'aiman-collection' ); ?></li>
			<li><?php esc_html_e( 'Hand wash gently in cold water with mild detergent for Everyday Cotton Pret.', 'aiman-collection' ); ?></li>
			<li><?php esc_html_e( 'Steam iron on reverse side to protect delicate lace borders and metallic threads.', 'aiman-collection' ); ?></li>
			<li><?php esc_html_e( 'Store handcrafted batwas and ridas in the breathable cotton dust bags provided.', 'aiman-collection' ); ?></li>
		</ul>
	</div>
	<?php
}

/**
 * 6. Mini-Cart Fragments Update for Live Cart Drawer & Badges
 */
function aiman_cart_fragments( $fragments ) {
	// Badge Count
	$count = WC()->cart->get_cart_contents_count();
	$fragments['#cartBadge'] = '<span class="badge-count" id="cartBadge"' . ( $count > 0 ? '' : ' style="display: none;"' ) . '>' . esc_html( $count ) . '</span>';

	// Header Total Label
	$total = WC()->cart->get_cart_subtotal();
	$fragments['#darazCartTotalLabel'] = '<span class="daraz-cart-label" id="darazCartTotalLabel">' . wp_kses_post( $total ) . '</span>';

	// Mini-Cart Drawer Subtotal
	$fragments['#drawerSubtotalAmount'] = '<span class="amount" id="drawerSubtotalAmount">' . wp_kses_post( $total ) . '</span>';

	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'aiman_cart_fragments' );

/**
 * 7. Bohra Libas Custom Fields in WooCommerce Product Admin
 */
function aiman_add_bohra_product_custom_fields() {
	global $woocommerce, $post;

	echo '<div class="options_group">';
	woocommerce_wp_text_input( array(
		'id'          => '_bohra_fabric_type',
		'label'       => __( 'Fabric Material', 'aiman-collection' ),
		'placeholder' => 'e.g. Pure Silk, Egyptian Cotton, Chiffon Georgette',
		'desc_tip'    => 'true',
		'description' => __( 'Specify the fabric composition for Bohra Libas specifications.', 'aiman-collection' ),
	) );
	woocommerce_wp_text_input( array(
		'id'          => '_bohra_work_type',
		'label'       => __( 'Embroidery / Work', 'aiman-collection' ),
		'placeholder' => 'e.g. Handcrafted Zardozi, Boti, Pearl Lace',
		'desc_tip'    => 'true',
		'description' => __( 'Details of craftsmanship on borders and pardi.', 'aiman-collection' ),
	) );
	woocommerce_wp_checkbox( array(
		'id'          => '_bohra_custom_stitching',
		'label'       => __( 'Custom Made-to-Measure Stitching Available', 'aiman-collection' ),
		'description' => __( 'Check if customer can order custom Pardi/Ghagra sizing on WhatsApp.', 'aiman-collection' ),
	) );
	echo '</div>';
}
add_action( 'woocommerce_product_options_general_product_data', 'aiman_add_bohra_product_custom_fields' );

function aiman_save_bohra_product_custom_fields( $post_id ) {
	if ( isset( $_POST['_bohra_fabric_type'] ) ) {
		update_post_meta( $post_id, '_bohra_fabric_type', sanitize_text_field( $_POST['_bohra_fabric_type'] ) );
	}
	if ( isset( $_POST['_bohra_work_type'] ) ) {
		update_post_meta( $post_id, '_bohra_work_type', sanitize_text_field( $_POST['_bohra_work_type'] ) );
	}
	$custom_stitching = isset( $_POST['_bohra_custom_stitching'] ) ? 'yes' : 'no';
	update_post_meta( $post_id, '_bohra_custom_stitching', $custom_stitching );
}
add_action( 'woocommerce_process_product_meta', 'aiman_save_bohra_product_custom_fields' );
