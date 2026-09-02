<?php
/**
 * The Template for displaying product archives, including the main shop page which is a post type archive
 *
 * @package Aiman_Collection
 */

defined( 'ABSPATH' ) || exit;

get_header( 'shop' );
?>

<div class="shop-archive-header" style="background: radial-gradient(circle at center top, rgba(197, 168, 128, 0.12) 0%, rgba(11, 13, 17, 0.98) 70%); border-bottom: 1px solid var(--color-border); padding: 3rem 0;">
	<div class="container" style="text-align: center;">
		<span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.1em;"><?php esc_html_e( 'HAUTE COUTURE CATALOG', 'aiman-collection' ); ?></span>
		<h1 class="woocommerce-products-header__title page-title" style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.4rem; margin: 0.4rem 0 0.8rem 0;">
			<?php woocommerce_page_title(); ?>
		</h1>
		<div class="archive-description" style="color: var(--color-text-secondary); max-width: 650px; margin: 0 auto;">
			<?php do_action( 'woocommerce_archive_description' ); ?>
		</div>
	</div>
</div>

<div class="container" style="padding: 2.5rem 0 5rem 0;">
	<?php
	/**
	 * Hook: woocommerce_before_main_content.
	 */
	do_action( 'woocommerce_before_main_content' );
	?>

	<div class="shop-toolbar" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--color-border-subtle); padding-bottom: 1rem;">
		<?php
		/**
		 * Hook: woocommerce_before_shop_loop.
		 *
		 * @hooked woocommerce_result_count - 20
		 * @hooked woocommerce_catalog_ordering - 30
		 */
		do_action( 'woocommerce_before_shop_loop' );
		?>
	</div>

	<?php
	if ( woocommerce_product_loop() ) {

		woocommerce_product_loop_start();

		if ( wc_get_loop_prop( 'total' ) ) {
			while ( have_posts() ) {
				the_post();

				/**
				 * Hook: woocommerce_shop_loop.
				 */
				do_action( 'woocommerce_shop_loop' );

				wc_get_template_part( 'content', 'product' );
			}
		}

		woocommerce_product_loop_end();

		/**
		 * Hook: woocommerce_after_shop_loop.
		 *
		 * @hooked woocommerce_pagination - 10
		 */
		do_action( 'woocommerce_after_shop_loop' );
	} else {
		/**
		 * Hook: woocommerce_no_products_found.
		 *
		 * @hooked wc_no_products_found - 10
		 */
		do_action( 'woocommerce_no_products_found' );
	}

	/**
	 * Hook: woocommerce_after_main_content.
	 */
	do_action( 'woocommerce_after_main_content' );
	?>
</div>

<?php
get_footer( 'shop' );
