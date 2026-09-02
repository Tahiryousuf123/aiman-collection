<?php
/**
 * Cart Page
 *
 * @package Aiman_Collection
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_cart' ); ?>

<div class="container cart-page-container" style="padding: 2.5rem 0 5rem 0;">

	<div style="text-align: center; margin-bottom: 2.5rem;">
		<span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.1em;"><?php esc_html_e( 'YOUR SHOPPING ATELIER', 'aiman-collection' ); ?></span>
		<h1 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.4rem; margin-top: 0.4rem;"><?php esc_html_e( 'Shopping Bag Review', 'aiman-collection' ); ?></h1>
	</div>

	<form class="woocommerce-cart-form" action="<?php echo esc_url( wc_get_cart_url() ); ?>" method="post">
		<?php do_action( 'woocommerce_before_cart_table' ); ?>

		<table class="shop_table shop_table_responsive cart woocommerce-cart-form__contents" cellspacing="0">
			<thead>
				<tr>
					<th class="product-remove"><span class="screen-reader-text"><?php esc_html_e( 'Remove item', 'aiman-collection' ); ?></span></th>
					<th class="product-thumbnail"><span class="screen-reader-text"><?php esc_html_e( 'Thumbnail image', 'aiman-collection' ); ?></span></th>
					<th class="product-name"><?php esc_html_e( 'Product', 'aiman-collection' ); ?></th>
					<th class="product-price"><?php esc_html_e( 'Price', 'aiman-collection' ); ?></th>
					<th class="product-quantity"><?php esc_html_e( 'Quantity', 'aiman-collection' ); ?></th>
					<th class="product-subtotal"><?php esc_html_e( 'Subtotal', 'aiman-collection' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php do_action( 'woocommerce_before_cart_contents' ); ?>

				<?php
				foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
					$_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
					$product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

					if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
						$product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
						?>
						<tr class="woocommerce-cart-form__cart-item <?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?>">

							<td class="product-remove">
								<?php
								echo apply_filters( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									'woocommerce_cart_item_remove_link',
									sprintf(
										'<a href="%s" class="remove" aria-label="%s" data-product_id="%s" data-product_sku="%s">&times;</a>',
										esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
										/* translators: %s is the product name */
										esc_attr( sprintf( __( 'Remove %s from cart', 'aiman-collection' ), wp_strip_all_tags( $_product->get_name() ) ) ),
										esc_attr( $product_id ),
										esc_attr( $_product->get_sku() )
									),
									$cart_item_key
								);
								?>
							</td>

							<td class="product-thumbnail">
								<?php
								$thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );

								if ( ! $product_permalink ) {
									echo $thumbnail; // PHPCS: XSS ok.
								} else {
									printf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $thumbnail ); // PHPCS: XSS ok.
								}
								?>
							</td>

							<td class="product-name" data-title="<?php esc_attr_e( 'Product', 'aiman-collection' ); ?>">
								<?php
								if ( ! $product_permalink ) {
									echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) . '&nbsp;' );
								} else {
									echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', sprintf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $_product->get_name() ), $cart_item, $cart_item_key ) );
								}

								do_action( 'woocommerce_after_cart_item_name', $cart_item, $cart_item_key );

								// Meta data.
								echo wc_get_formatted_cart_item_data( $cart_item ); // PHPCS: XSS ok.

								// Backorder notification.
								if ( $_product->backorders_require_notification() && $_product->is_on_backorder( $cart_item['quantity'] ) ) {
									echo wp_kses_post( apply_filters( 'woocommerce_cart_item_backorder_notification', '<p class="backorder_notification">' . esc_html__( 'Available on backorder', 'aiman-collection' ) . '</p>', $product_id ) );
								}
								?>
							</td>

							<td class="product-price" data-title="<?php esc_attr_e( 'Price', 'aiman-collection' ); ?>">
								<?php
									echo apply_filters( 'woocommerce_cart_item_price', WC()->cart->get_product_price( $_product ), $cart_item, $cart_item_key ); // PHPCS: XSS ok.
								?>
							</td>

							<td class="product-quantity" data-title="<?php esc_attr_e( 'Quantity', 'aiman-collection' ); ?>">
								<?php
								if ( $_product->is_sold_individually() ) {
									$min_quantity = 1;
									$max_quantity = 1;
								} else {
									$min_quantity = 0;
									$max_quantity = $_product->get_max_purchase_quantity();
								}

								$product_quantity = woocommerce_quantity_input(
									array(
										'input_name'   => "cart[{$cart_item_key}][qty]",
										'input_value'  => $cart_item['quantity'],
										'max_value'    => $max_quantity,
										'min_value'    => $min_quantity,
										'product_name' => $_product->get_name(),
									),
									$_product,
									false
								);

								echo apply_filters( 'woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item ); // PHPCS: XSS ok.
								?>
							</td>

							<td class="product-subtotal" data-title="<?php esc_attr_e( 'Subtotal', 'aiman-collection' ); ?>">
								<?php
									echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key ); // PHPCS: XSS ok.
								?>
							</td>
						</tr>
						<?php
					}
				}
				?>

				<?php do_action( 'woocommerce_cart_contents' ); ?>

				<tr>
					<td colspan="6" class="actions" style="padding: 1.5rem 1rem; background: var(--color-bg-elevated);">

						<?php if ( wc_coupons_enabled() ) { ?>
							<div class="coupon" style="display: inline-flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
								<label for="coupon_code" class="screen-reader-text"><?php esc_html_e( 'Coupon:', 'aiman-collection' ); ?></label>
								<input type="text" name="coupon_code" class="input-text" id="coupon_code" value="" placeholder="<?php esc_attr_e( 'Promo Code (e.g. AIMAN25)', 'aiman-collection' ); ?>" style="background: var(--color-bg-main); border: 1px solid var(--color-border); color: #fff; padding: 0.6rem 1rem; border-radius: var(--radius-full); font-size: 0.9rem;" />
								<button type="submit" class="button" name="apply_coupon" value="<?php esc_attr_e( 'Apply coupon', 'aiman-collection' ); ?>" style="background: linear-gradient(135deg, var(--color-gold-primary), var(--color-gold-dark)); color: #0b0d11; font-weight: 800; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; border: none; cursor: pointer; text-transform: uppercase; font-size: 0.8rem;"><?php esc_attr_e( 'Apply Coupon', 'aiman-collection' ); ?></button>
								<?php do_action( 'woocommerce_cart_coupon' ); ?>
							</div>
						<?php } ?>

						<button type="submit" class="button" name="update_cart" value="<?php esc_attr_e( 'Update cart', 'aiman-collection' ); ?>" style="float: right; background: transparent; border: 1px solid var(--color-border); color: var(--color-gold-light); font-weight: 700; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; cursor: pointer; text-transform: uppercase; font-size: 0.8rem;"><?php esc_html_e( 'Update Bag', 'aiman-collection' ); ?></button>

						<?php do_action( 'woocommerce_cart_actions' ); ?>

						<?php wp_nonce_field( 'woocommerce-cart', 'woocommerce-cart-nonce' ); ?>
					</td>
				</tr>

				<?php do_action( 'woocommerce_after_cart_contents' ); ?>
			</tbody>
		</table>
		<?php do_action( 'woocommerce_after_cart_table' ); ?>
	</form>

	<?php do_action( 'woocommerce_before_cart_collaterals' ); ?>

	<div class="cart-collaterals">
		<?php
			/**
			 * Cart collaterals hook.
			 *
			 * @hooked woocommerce_cross_sell_display
			 * @hooked woocommerce_cart_totals - 10
			 */
			do_action( 'woocommerce_cart_collaterals' );
		?>
	</div>

</div>

<?php do_action( 'woocommerce_after_cart' ); ?>
