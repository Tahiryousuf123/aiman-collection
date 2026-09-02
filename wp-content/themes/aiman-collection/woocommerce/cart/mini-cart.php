<?php
/**
 * Mini-cart
 *
 * @package Aiman_Collection
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_mini_cart' ); ?>

<?php if ( ! WC()->cart->is_empty() ) : ?>

	<ul class="woocommerce-mini-cart cart_list product_list_widget <?php echo esc_attr( $args['list_class'] ); ?>" style="list-style: none; padding: 0; margin: 0;">
		<?php
		do_action( 'woocommerce_before_mini_cart_contents' );

		foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
			$_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
			$product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

			if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_widget_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
				$product_name      = apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key );
				$thumbnail         = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );
				$product_price     = apply_filters( 'woocommerce_cart_item_price', WC()->cart->get_product_price( $_product ), $cart_item, $cart_item_key );
				$product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
				?>
				<li class="woocommerce-mini-cart-item <?php echo esc_attr( apply_filters( 'woocommerce_mini_cart_item_class', 'mini_cart_item', $cart_item, $cart_item_key ) ); ?>" style="display: flex; gap: 1rem; align-items: center; padding: 0.9rem 0; border-bottom: 1px solid var(--color-border-subtle); position: relative;">
					<div class="mini-cart-thumb" style="width: 55px; height: 68px; flex-shrink: 0; border-radius: var(--radius-xs); overflow: hidden; border: 1px solid var(--color-border); background: #080a0e;">
						<?php echo $thumbnail; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</div>

					<div class="mini-cart-details" style="flex-grow: 1;">
						<a href="<?php echo esc_url( $product_permalink ); ?>" style="color: var(--color-text-primary); font-weight: 600; font-size: 0.92rem; text-decoration: none; display: block; line-height: 1.35; margin-bottom: 0.3rem;">
							<?php echo wp_kses_post( $product_name ); ?>
						</a>
						<?php echo wc_get_formatted_cart_item_data( $cart_item ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						<div style="font-size: 0.85rem; color: var(--color-gold-light); font-weight: 700;">
							<?php echo apply_filters( 'woocommerce_widget_cart_item_quantity', '<span class="quantity">' . sprintf( '%s &times; %s', $cart_item['quantity'], $product_price ) . '</span>', $cart_item, $cart_item_key ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</div>
					</div>

					<div class="mini-cart-remove">
						<?php
						echo apply_filters( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							'woocommerce_cart_item_remove_link',
							sprintf(
								'<a href="%s" class="remove remove_from_cart_button" aria-label="%s" data-product_id="%s" data-cart_item_key="%s" data-product_sku="%s" style="color: #ef4444; font-size: 1.2rem; text-decoration: none; padding: 4px;">&times;</a>',
								esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
								/* translators: %s is the product name */
								esc_attr( sprintf( __( 'Remove %s from cart', 'aiman-collection' ), wp_strip_all_tags( $product_name ) ) ),
								esc_attr( $product_id ),
								esc_attr( $cart_item_key ),
								esc_attr( $_product->get_sku() )
							),
							$cart_item_key
						);
						?>
					</div>
				</li>
				<?php
			}
		}

		do_action( 'woocommerce_mini_cart_contents' );
		?>
	</ul>

<?php else : ?>

	<div class="woocommerce-mini-cart__empty-message" style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
		<i class="fas fa-shopping-cart text-gold" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
		<h4 style="color: var(--color-gold-light); font-family: var(--font-heading); margin-bottom: 0.5rem;"><?php esc_html_e( 'Your Shopping Bag is Empty', 'aiman-collection' ); ?></h4>
		<p style="font-size: 0.9rem; line-height: 1.6; max-width: 280px; margin: 0 auto 1.5rem auto;"><?php esc_html_e( 'Explore our signature Dawoodi Bohra ridas and handcrafted batwas.', 'aiman-collection' ); ?></p>
		<a href="<?php echo esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' ) ); ?>" class="btn btn-primary" onclick="window.AimanStore.closeCart()" style="background: linear-gradient(135deg, var(--color-gold-primary), var(--color-gold-dark)); color: #0b0d11; font-weight: 800; font-size: 0.85rem; padding: 0.7rem 1.6rem; border-radius: var(--radius-full); text-transform: uppercase; text-decoration: none; display: inline-flex;">
			<?php esc_html_e( 'Explore Ridas Now', 'aiman-collection' ); ?>
		</a>
	</div>

<?php endif; ?>

<?php do_action( 'woocommerce_after_mini_cart' ); ?>
