<?php
/**
 * The Template for displaying product archives, including the main shop page
 * Styled in Kashaf.pk Clean Minimalist Layout
 *
 * @package Aiman_Collection
 */

defined( 'ABSPATH' ) || exit;

get_header( 'shop' );
?>

<div class="container" style="padding-top: 30px; padding-bottom: 60px;">
	<!-- Collection Title Header -->
	<div style="text-align: center; margin-bottom: 25px;">
		<h1 class="page-title" style="font-size: 2rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">
			<?php woocommerce_page_title(); ?>
		</h1>
		<div class="archive-description" style="color: var(--color-muted); font-size: 0.92rem; max-width: 600px; margin: 0 auto;">
			<?php do_action( 'woocommerce_archive_description' ); ?>
		</div>
	</div>

	<!-- Toolbar: SORT BY dropdown (Matching Kashaf.pk Screenshot 2) -->
	<div class="collection-toolbar">
		<div class="toolbar-left">
			<span class="sort-label"><?php esc_html_e( 'SORT BY', 'aiman-collection' ); ?></span>
			<form class="woocommerce-ordering" method="get">
				<select name="orderby" class="kashaf-sort-select" aria-label="<?php esc_attr_e( 'Shop order', 'aiman-collection' ); ?>" onchange="this.form.submit()">
					<option value="menu_order" <?php selected( 'menu_order', isset( $_GET['orderby'] ) ? sanitize_text_field( $_GET['orderby'] ) : '' ); ?>><?php esc_html_e( 'Featured', 'aiman-collection' ); ?></option>
					<option value="popularity" <?php selected( 'popularity', isset( $_GET['orderby'] ) ? sanitize_text_field( $_GET['orderby'] ) : '' ); ?>><?php esc_html_e( 'Best Selling', 'aiman-collection' ); ?></option>
					<option value="date" <?php selected( 'date', isset( $_GET['orderby'] ) ? sanitize_text_field( $_GET['orderby'] ) : '' ); ?>><?php esc_html_e( 'Date, new to old', 'aiman-collection' ); ?></option>
					<option value="price" <?php selected( 'price', isset( $_GET['orderby'] ) ? sanitize_text_field( $_GET['orderby'] ) : '' ); ?>><?php esc_html_e( 'Price, low to high', 'aiman-collection' ); ?></option>
					<option value="price-desc" <?php selected( 'price-desc', isset( $_GET['orderby'] ) ? sanitize_text_field( $_GET['orderby'] ) : '' ); ?>><?php esc_html_e( 'Price, high to low', 'aiman-collection' ); ?></option>
				</select>
				<input type="hidden" name="paged" value="1">
				<?php wc_query_string_form_fields( null, array( 'orderby', 'submit', 'paged', 'product-page' ) ); ?>
			</form>
		</div>

		<div class="toolbar-right">
			<?php woocommerce_result_count(); ?>
		</div>
	</div>

	<!-- Products Loop (4 Columns • NO Add to Cart) -->
	<?php
	if ( woocommerce_product_loop() ) {
		woocommerce_product_loop_start();

		if ( wc_get_loop_prop( 'total' ) ) {
			while ( have_posts() ) {
				the_post();
				do_action( 'woocommerce_shop_loop' );
				wc_get_template_part( 'content', 'product' );
			}
		}

		woocommerce_product_loop_end();

		do_action( 'woocommerce_after_shop_loop' );
	} else {
		do_action( 'woocommerce_no_products_found' );
	}
	?>
</div>

<?php
get_footer( 'shop' );
