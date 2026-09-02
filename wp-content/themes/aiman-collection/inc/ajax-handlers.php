<?php
/**
 * AIMAN COLLECTION — AJAX Endpoints
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * 1. Live Search Autocomplete Endpoint
 */
function aiman_ajax_live_search() {
	$query = isset( $_POST['query'] ) ? sanitize_text_field( $_POST['query'] ) : '';

	if ( strlen( $query ) < 2 ) {
		wp_send_json_error( array( 'message' => __( 'Query too short', 'aiman-collection' ) ) );
	}

	$args = array(
		'post_type'      => 'product',
		'post_status'    => 'publish',
		's'              => $query,
		'posts_per_page' => 8,
	);

	$search_query = new WP_Query( $args );
	$results      = array();

	if ( $search_query->have_posts() ) {
		while ( $search_query->have_posts() ) {
			$search_query->the_post();
			$product = wc_get_product( get_the_ID() );
			if ( ! $product ) continue;

			$categories = wc_get_product_category_list( $product->get_id() );
			$image_url  = wp_get_attachment_image_url( $product->get_image_id(), 'thumbnail' );
			if ( ! $image_url ) {
				$image_url = get_template_directory_uri() . '/assets/images/aiman_logo.png';
			}

			$results[] = array(
				'id'         => $product->get_id(),
				'title'      => $product->get_name(),
				'url'        => get_permalink( $product->get_id() ),
				'image'      => $image_url,
				'price'      => $product->get_price(),
				'price_html' => $product->get_price_html(),
				'category'   => wp_strip_all_tags( $categories ),
			);
		}
		wp_reset_postdata();
	}

	wp_send_json_success( $results );
}
add_action( 'wp_ajax_aiman_live_search', 'aiman_ajax_live_search' );
add_action( 'wp_ajax_nopriv_aiman_live_search', 'aiman_ajax_live_search' );

/**
 * 2. Quick View Modal Endpoint
 */
function aiman_ajax_quick_view() {
	$product_id = isset( $_POST['product_id'] ) ? absint( $_POST['product_id'] ) : 0;
	if ( ! $product_id ) {
		wp_send_json_error( array( 'message' => __( 'Invalid Product ID', 'aiman-collection' ) ) );
	}

	$product = wc_get_product( $product_id );
	if ( ! $product ) {
		wp_send_json_error( array( 'message' => __( 'Product not found', 'aiman-collection' ) ) );
	}

	$fabric_type     = get_post_meta( $product_id, '_bohra_fabric_type', true );
	$work_type       = get_post_meta( $product_id, '_bohra_work_type', true );
	$custom_stitch   = get_post_meta( $product_id, '_bohra_custom_stitching', true );
	$phone           = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
	$product_url     = get_permalink( $product_id );
	$price_plain     = html_entity_decode( wp_strip_all_tags( $product->get_price_html() ) );
	$image_url       = wp_get_attachment_image_url( $product->get_image_id(), 'large' );
	if ( ! $image_url ) {
		$image_url = get_template_directory_uri() . '/assets/images/aiman_logo.png';
	}

	$wa_msg = "✨ *Assalam-o-Alaikum Aiman Collection Atelier!* ✨\n\nI am inquiring about this Dawoodi Bohra Libas:\n👑 *Product:* " . $product->get_name() . "\n💰 *Price:* " . $price_plain . "\n🔗 *Link:* " . $product_url . "\n\nPlease confirm availability and custom stitching details.";
	$wa_link = "https://wa.me/{$phone}?text=" . rawurlencode( $wa_msg );

	ob_start();
	?>
	<div class="quick-view-inner" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; position: relative;">
		<button type="button" class="modal-close" onclick="window.AimanStore.closeQuickView()" style="position: absolute; top: -10px; right: -10px; background: var(--color-bg-elevated); border: 1px solid var(--color-border); color: #fff; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1.1rem; z-index: 10;">&times;</button>

		<div class="quick-view-media" style="border-radius: var(--radius-md); overflow: hidden; background: #080a0e; border: 1px solid var(--color-border);">
			<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $product->get_name() ); ?>" style="width: 100%; height: 100%; object-fit: cover; aspect-ratio: 4/5;">
		</div>

		<div class="quick-view-details" style="display: flex; flex-direction: column;">
			<div style="font-size: 0.78rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 700; letter-spacing: 0.08em; margin-bottom: 0.4rem;">
				<?php echo wc_get_product_category_list( $product_id ); ?>
			</div>

			<h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--color-text-primary); margin: 0 0 0.6rem 0;">
				<?php echo esc_html( $product->get_name() ); ?>
			</h3>

			<div class="price" style="font-size: 1.4rem; color: var(--color-gold-light); font-weight: 700; margin-bottom: 1rem;">
				<?php echo $product->get_price_html(); ?>
			</div>

			<div style="color: var(--color-text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.2rem;">
				<?php echo wp_kses_post( $product->get_short_description() ? $product->get_short_description() : wp_trim_words( $product->get_description(), 25 ) ); ?>
			</div>

			<?php if ( $fabric_type || $work_type ) : ?>
				<div style="background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0.8rem; margin-bottom: 1.2rem; font-size: 0.85rem;">
					<?php if ( $fabric_type ) : ?>
						<div style="margin-bottom: 0.3rem;"><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'Fabric:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $fabric_type ); ?></div>
					<?php endif; ?>
					<?php if ( $work_type ) : ?>
						<div><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'Workmanship:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $work_type ); ?></div>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<div style="display: flex; gap: 0.8rem; margin-top: auto; flex-wrap: wrap;">
				<a href="<?php echo esc_url( $product_url ); ?>" class="btn btn-primary" style="flex: 1; text-align: center; justify-content: center; padding: 0.8rem;">
					<i class="fas fa-eye"></i> <?php esc_html_e( 'Full Product Page', 'aiman-collection' ); ?>
				</a>
				<a href="<?php echo esc_url( $wa_link ); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="flex: 1; text-align: center; justify-content: center; padding: 0.8rem;">
					<i class="fab fa-whatsapp"></i> <?php esc_html_e( '1-Click WhatsApp', 'aiman-collection' ); ?>
				</a>
			</div>
		</div>
	</div>
	<?php
	$html = ob_get_clean();
	wp_send_json_success( $html );
}
add_action( 'wp_ajax_aiman_quick_view', 'aiman_ajax_quick_view' );
add_action( 'wp_ajax_nopriv_aiman_quick_view', 'aiman_ajax_quick_view' );

/**
 * 3. Set Active Currency Endpoint
 */
function aiman_ajax_set_currency() {
	$currency = isset( $_POST['currency'] ) ? sanitize_text_field( $_POST['currency'] ) : 'PKR';
	$allowed  = array( 'PKR', 'USD', 'AED', 'GBP', 'SAR' );
	if ( in_array( $currency, $allowed, true ) ) {
		if ( ! headers_sent() ) {
			setcookie( 'aiman_currency', $currency, time() + ( 86400 * 30 ), '/' );
		}
		wp_send_json_success( array( 'currency' => $currency ) );
	}
	wp_send_json_error();
}
add_action( 'wp_ajax_aiman_set_currency', 'aiman_ajax_set_currency' );
add_action( 'wp_ajax_nopriv_aiman_set_currency', 'aiman_ajax_set_currency' );
