<?php
/**
 * Checkout Form
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

do_action( 'woocommerce_before_checkout_form', $checkout );

// If checkout registration is disabled and not logged in, the user cannot checkout.
if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
	echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'aiman-collection' ) ) );
	return;
}
?>

<div class="container checkout-page-container" style="padding: 2.5rem 0 5rem 0;">

	<div style="text-align: center; margin-bottom: 2.5rem;">
		<span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.1em;"><?php esc_html_e( 'SECURE ENCRYPTED CHECKOUT', 'aiman-collection' ); ?></span>
		<h1 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.4rem; margin-top: 0.4rem;"><?php esc_html_e( 'Complete Your Bohra Couture Order', 'aiman-collection' ); ?></h1>
	</div>

	<form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">

		<?php if ( $checkout->get_checkout_fields() ) : ?>

			<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>

			<div class="col2-set" id="customer_details">
				<div class="col-1">
					<?php do_action( 'woocommerce_checkout_billing' ); ?>
				</div>

				<div class="col-2">
					<?php do_action( 'woocommerce_checkout_shipping' ); ?>
				</div>
			</div>

			<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>

		<?php endif; ?>
		
		<?php do_action( 'woocommerce_checkout_before_order_review_heading' ); ?>
		
		<h3 id="order_review_heading" style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.5rem; margin: 2rem 0 1.2rem 0;"><?php esc_html_e( 'Your Bohra Libas Order Summary', 'aiman-collection' ); ?></h3>
		
		<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>

		<div id="order_review" class="woocommerce-checkout-review-order">
			<?php do_action( 'woocommerce_checkout_order_review' ); ?>
		</div>

		<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>

	</form>

</div>

<?php do_action( 'woocommerce_after_checkout_form', $checkout ); ?>
