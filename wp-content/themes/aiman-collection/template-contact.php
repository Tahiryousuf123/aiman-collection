<?php
/**
 * Template Name: Contact & Concierge
 *
 * @package Aiman_Collection
 */

get_header();

$phone      = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
$phone_disp = get_theme_mod( 'aiman_whatsapp_display', '+92 345 2439196' );
$bank_name  = get_theme_mod( 'aiman_bank_name', 'Meezan Bank Ltd (Islamic Banking)' );
$bank_title = get_theme_mod( 'aiman_bank_title', 'Tahir' );
$bank_acc   = get_theme_mod( 'aiman_bank_account', '0102-0105849201' );
$bank_iban  = get_theme_mod( 'aiman_bank_iban', 'PK45MEZN0001020105849201' );
$easypaisa  = get_theme_mod( 'aiman_easypaisa', '0342-8301490 (Title: Tahir)' );
$jazzcash   = get_theme_mod( 'aiman_jazzcash', '0325-2005028 (Title: Tahir)' );
?>

<div class="page-header" style="background: radial-gradient(circle at center top, rgba(197, 168, 128, 0.15) 0%, rgba(11, 13, 17, 0.98) 70%); border-bottom: 1px solid var(--color-border); padding: 4.5rem 0; text-align: center;">
	<div class="container">
		<span style="font-size: 0.85rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.12em;"><?php esc_html_e( 'BESPOKE CLIENT CARE', 'aiman-collection' ); ?></span>
		<h1 class="page-title" style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.8rem; margin: 0.5rem 0 1rem 0;">
			<?php esc_html_e( 'Contact Our Karachi Atelier', 'aiman-collection' ); ?>
		</h1>
		<p style="color: var(--color-text-secondary); max-width: 650px; margin: 0 auto; font-size: 1.1rem; line-height: 1.7;">
			<?php esc_html_e( 'Connect with our master artisans and 24/7 Bohra fashion stylist for custom rida stitching, wedding orders, and order inquiries.', 'aiman-collection' ); ?>
		</p>
	</div>
</div>

<div class="container" style="padding: 4rem 0 6rem 0;">
	<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem;">
		
		<!-- Left: Direct Channels & Atelier Info -->
		<div>
			<div style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-sm); margin-bottom: 2rem;">
				<h3 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.5rem; margin-bottom: 1.5rem;">
					<i class="fas fa-headset text-gold"></i> <?php esc_html_e( 'WhatsApp Concierge & Support', 'aiman-collection' ); ?>
				</h3>
				<p style="color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1.8rem;">
					<?php esc_html_e( 'We provide instant support on WhatsApp for Dawoodi Bohra community members worldwide. Message us for photos, fabric swatches, or naap consultations.', 'aiman-collection' ); ?>
				</p>

				<div style="display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 2rem;">
					<div style="display: flex; align-items: center; gap: 1rem;">
						<div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(37, 211, 102, 0.15); border: 1px solid var(--color-accent-whatsapp); display: flex; align-items: center; justify-content: center; color: var(--color-accent-whatsapp); font-size: 1.2rem;">
							<i class="fab fa-whatsapp"></i>
						</div>
						<div>
							<strong style="color: var(--color-gold-light); display: block;"><?php esc_html_e( 'WhatsApp AI Stylist & Orders', 'aiman-collection' ); ?></strong>
							<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>" target="_blank" style="color: var(--color-text-primary); text-decoration: none; font-size: 1.05rem; font-weight: 700;"><?php echo esc_html( $phone_disp ); ?></a>
						</div>
					</div>

					<div style="display: flex; align-items: center; gap: 1rem;">
						<div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(197, 168, 128, 0.15); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; color: var(--color-gold-primary); font-size: 1.2rem;">
							<i class="fas fa-location-dot"></i>
						</div>
						<div>
							<strong style="color: var(--color-gold-light); display: block;"><?php esc_html_e( 'Atelier Location', 'aiman-collection' ); ?></strong>
							<span style="color: var(--color-text-secondary);"><?php esc_html_e( 'Clifton / Saddar, Karachi, Pakistan', 'aiman-collection' ); ?></span>
						</div>
					</div>
				</div>

				<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode( 'Assalam-o-Alaikum! I want to consult with Aiman Collection Atelier.' ); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg" style="width: 100%; justify-content: center; text-align: center; border-radius: var(--radius-full); padding: 0.85rem; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 0.6rem;">
					<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'Open WhatsApp AI Chat Now', 'aiman-collection' ); ?>
				</a>
			</div>
		</div>

		<!-- Right: Bank Transfer & Payment Details -->
		<div>
			<div style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-sm);">
				<h3 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.5rem; margin-bottom: 1.5rem;">
					<i class="fas fa-university text-gold"></i> <?php esc_html_e( 'Bank & Payment Accounts', 'aiman-collection' ); ?>
				</h3>
				<p style="color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
					<?php esc_html_e( 'For direct bank transfers and advance payments on custom bridal orders, please use the verified accounts below and share your screenshot on WhatsApp.', 'aiman-collection' ); ?>
				</p>

				<div style="background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem; line-height: 1.9; font-size: 0.95rem; color: var(--color-text-secondary);">
					<div><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'Bank:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $bank_name ); ?></div>
					<div><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'Account Title:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $bank_title ); ?></div>
					<div><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'Account Number:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $bank_acc ); ?></div>
					<div><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'IBAN:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $bank_iban ); ?></div>
					<div style="margin-top: 0.6rem; border-top: 1px solid var(--color-border-subtle); padding-top: 0.6rem;">
						<div><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'EasyPaisa:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $easypaisa ); ?></div>
						<div><strong style="color: var(--color-gold-primary);"><?php esc_html_e( 'JazzCash:', 'aiman-collection' ); ?></strong> <?php echo esc_html( $jazzcash ); ?></div>
					</div>
				</div>

				<div style="background: rgba(27, 77, 62, 0.25); border: 1px solid var(--color-accent-emerald); border-radius: var(--radius-sm); padding: 0.9rem; font-size: 0.85rem; color: #4ade80;">
					<i class="fas fa-shield-check"></i> <?php esc_html_e( 'Cash on Delivery (COD) is also available nationwide across Pakistan via TCS Express.', 'aiman-collection' ); ?>
				</div>
			</div>
		</div>

	</div>
</div>

<?php
get_footer();
