<?php
/**
 * AIMAN COLLECTION — Demo Catalog Seeder
 *
 * Provides a 1-click sample Dawoodi Bohra Libas catalog importer
 * for store owners setting up a fresh WooCommerce store.
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function aiman_add_demo_importer_menu() {
	add_theme_page(
		__( 'Aiman Demo Importer', 'aiman-collection' ),
		__( '👑 Import Bohra Catalog', 'aiman-collection' ),
		'manage_options',
		'aiman-demo-importer',
		'aiman_render_demo_importer_page'
	);
}
add_action( 'admin_menu', 'aiman_add_demo_importer_menu' );

function aiman_render_demo_importer_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$imported = false;
	if ( isset( $_POST['aiman_import_demo_nonce'] ) && wp_verify_nonce( $_POST['aiman_import_demo_nonce'], 'aiman_import_demo_action' ) ) {
		if ( class_exists( 'WooCommerce' ) ) {
			aiman_execute_demo_import();
			$imported = true;
		}
	}
	?>
	<div class="wrap" style="max-width: 850px; background: #13161C; color: #FAF9F6; padding: 2rem; border-radius: 14px; border: 1px solid rgba(197, 168, 128, 0.3); margin-top: 2rem;">
		<h1 style="color: #DFCAAB; font-family: 'Cinzel', serif; font-size: 2rem; margin-bottom: 1rem;">👑 AIMAN COLLECTION — 1-Click Bohra Catalog Importer</h1>
		
		<?php if ( $imported ) : ?>
			<div style="background: #1B4D3E; border: 1px solid #25D366; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; color: #fff;">
				<strong>✨ Success!</strong> Sample Dawoodi Bohra Ridas, Bags, Batwas, and Categories have been imported to your WooCommerce store.
			</div>
		<?php endif; ?>

		<p style="font-size: 1.05rem; line-height: 1.7; color: #C8CDD6;">
			Populate your store with curated luxury Dawoodi Bohra Haute Couture demo products, categories, pricing, and custom specifications with one click.
		</p>

		<div style="background: #1E232D; border: 1px solid rgba(255,255,255,0.08); padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0;">
			<h3 style="color: #DFCAAB; margin-top: 0;">What will be imported:</h3>
			<ul style="line-height: 1.8; color: #C8CDD6; list-style: disc; margin-left: 1.5rem;">
				<li><strong>Categories:</strong> Bohra Ridas, Designer Handbags & Batwas, Topi & Cosmetic Pouches, Super Deals</li>
				<li><strong>Products:</strong> Royal Crimson Bridal Zardozi Silk Rida, Emerald Velvet Boti Festive Rida, Pastel Lavender Cotton Everyday Rida, Handcrafted Floral Batwa, Velvet Vanity Bag</li>
				<li><strong>Custom Meta:</strong> Fabric types, Embroidery specifications, Made-to-measure stitching tags</li>
			</ul>
		</div>

		<?php if ( class_exists( 'WooCommerce' ) ) : ?>
			<form method="post" action="">
				<?php wp_nonce_field( 'aiman_import_demo_action', 'aiman_import_demo_nonce' ); ?>
				<button type="submit" class="button button-primary" style="background: linear-gradient(135deg, #C5A880, #9A7B56); border: none; color: #000; font-weight: 800; font-size: 1.05rem; padding: 0.6rem 2rem; border-radius: 30px; cursor: pointer;">
					🚀 Import Sample Bohra Catalog Now
				</button>
			</form>
		<?php else : ?>
			<div style="background: #661826; border: 1px solid #ef4444; padding: 1rem; border-radius: 8px; color: #fff;">
				⚠️ <strong>WooCommerce is not active!</strong> Please install and activate the free <strong>WooCommerce</strong> plugin first before importing demo products.
			</div>
		<?php endif; ?>
	</div>
	<?php
}

function aiman_execute_demo_import() {
	if ( ! class_exists( 'WC_Product_Simple' ) ) return;

	$categories = array(
		'ridas'    => 'Dawoodi Bohra Ridas',
		'bags'     => 'Handbags & Matching Batwas',
		'pouches'  => 'Topi & Cosmetic Pouches',
		'deals'    => 'Super Deals'
	);

	$cat_ids = array();
	foreach ( $categories as $slug => $name ) {
		$term = term_exists( $name, 'product_cat' );
		if ( ! $term ) {
			$term = wp_insert_term( $name, 'product_cat', array( 'slug' => $slug ) );
		}
		if ( ! is_wp_error( $term ) ) {
			$cat_ids[ $slug ] = (int) $term['term_id'];
		}
	}

	$demo_products = array(
		array(
			'name'        => 'Royal Crimson Heavy Zardozi Bridal Silk Rida',
			'cat'         => 'ridas',
			'price'       => 18500,
			'regular'     => 22000,
			'sale'        => 18500,
			'desc'        => 'Masterpiece Dawoodi Bohra ceremonial bridal rida handcrafted in Karachi. Pure raw silk base adorned with authentic gold zardozi needlework, intricate boti motifs on the pardi, and high-density border paneling.',
			'fabric'      => 'Pure Raw Silk (100% Khaddi)',
			'work'        => 'Heavy Zardozi, Resham Boti & Metallic Cutwork',
			'stitching'   => 'yes'
		),
		array(
			'name'        => 'Emerald Velvet Boti Festive Bohra Rida',
			'cat'         => 'ridas',
			'price'       => 14200,
			'regular'     => 16500,
			'sale'        => 14200,
			'desc'        => 'Deep emerald green festive rida featuring micro velvet borders, delicate crystal lace trimming, and graceful pardi drape designed for Bohra ceremonial milad and weddings.',
			'fabric'      => 'Micro Silk Chiffon with Velvet Borders',
			'work'        => 'Crystal Lace, Pearl Beading & Boti Work',
			'stitching'   => 'yes'
		),
		array(
			'name'        => 'Pastel Lavender Everyday Cotton Pret Rida',
			'cat'         => 'ridas',
			'price'       => 4800,
			'regular'     => 5800,
			'sale'        => 4800,
			'desc'        => 'Breezy and lightweight summer everyday rida crafted from breathable Egyptian cotton. Soft pastel lavender hue with floral scalloped lace finish.',
			'fabric'      => 'Pure Egyptian Mercerized Cotton',
			'work'        => 'Scalloped Cotton Lace & Minimalist Panels',
			'stitching'   => 'yes'
		),
		array(
			'name'        => 'Handcrafted Gold Zardozi Matching Bridal Batwa',
			'cat'         => 'bags',
			'price'       => 3800,
			'regular'     => 4500,
			'sale'        => 3800,
			'desc'        => 'Bespoke Dawoodi Bohra ceremonial batwa with drawstring closure, ornate gold tassels, and matching embroidery designed to pair seamlessly with your bridal rida.',
			'fabric'      => 'Raw Silk with Velvet Lining',
			'work'        => 'Zardozi Embroidery with Handmade Tassels',
			'stitching'   => 'no'
		),
		array(
			'name'        => 'Luxury Velvet Topi & Cosmetic Vanity Pouch',
			'cat'         => 'pouches',
			'price'       => 2200,
			'regular'     => 2800,
			'sale'        => 2200,
			'desc'        => 'Premium quilted velvet organizer pouch featuring gold metal zipper and satin lining. Perfect for safeguarding Bohra topis, jewelry, and cosmetics during travel.',
			'fabric'      => 'Quilted Royal Velvet',
			'work'        => 'Gold Monogram & Metal Hardware',
			'stitching'   => 'no'
		)
	);

	foreach ( $demo_products as $pdata ) {
		// Check if product already exists
		$existing = get_page_by_title( $pdata['name'], OBJECT, 'product' );
		if ( $existing ) continue;

		$product = new WC_Product_Simple();
		$product->set_name( $pdata['name'] );
		$product->set_status( 'publish' );
		$product->set_catalog_visibility( 'visible' );
		$product->set_description( $pdata['desc'] );
		$product->set_short_description( wp_trim_words( $pdata['desc'], 18 ) );
		$product->set_sku( 'AC-' . rand( 1000, 9999 ) );
		$product->set_price( $pdata['price'] );
		$product->set_regular_price( $pdata['regular'] );
		if ( ! empty( $pdata['sale'] ) ) {
			$product->set_sale_price( $pdata['sale'] );
		}
		$product->set_manage_stock( true );
		$product->set_stock_quantity( rand( 5, 20 ) );
		$product->set_stock_status( 'instock' );

		if ( isset( $cat_ids[ $pdata['cat'] ] ) ) {
			$product->set_category_ids( array( $cat_ids[ $pdata['cat'] ] ) );
		}

		$product_id = $product->save();

		if ( $product_id ) {
			update_post_meta( $product_id, '_bohra_fabric_type', $pdata['fabric'] );
			update_post_meta( $product_id, '_bohra_work_type', $pdata['work'] );
			update_post_meta( $product_id, '_bohra_custom_stitching', $pdata['stitching'] );
		}
	}
}
