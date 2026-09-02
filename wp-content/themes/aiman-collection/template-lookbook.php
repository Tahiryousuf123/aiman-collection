<?php
/**
 * Template Name: Festive Lookbook
 *
 * @package Aiman_Collection
 */

get_header();

$phone = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
?>

<div class="page-header" style="background: radial-gradient(circle at center top, rgba(197, 168, 128, 0.15) 0%, rgba(11, 13, 17, 0.98) 70%); border-bottom: 1px solid var(--color-border); padding: 4.5rem 0; text-align: center;">
	<div class="container">
		<span style="font-size: 0.85rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.12em;"><?php esc_html_e( 'HAUTE COUTURE EDIT', 'aiman-collection' ); ?></span>
		<h1 class="page-title" style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.8rem; margin: 0.5rem 0 1rem 0;">
			<?php esc_html_e( 'Dawoodi Bohra Festive & Bridal Lookbook', 'aiman-collection' ); ?>
		</h1>
		<p style="color: var(--color-text-secondary); max-width: 650px; margin: 0 auto; font-size: 1.1rem; line-height: 1.7;">
			<?php esc_html_e( 'Immerse yourself in our premier collection of ceremonial bridal ridas, heavy zardozi needlework, and artisanal matching accessories.', 'aiman-collection' ); ?>
		</p>
	</div>
</div>

<div class="container" style="padding: 4rem 0 6rem 0;">
	<div class="lookbook-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.5rem;">
		
		<!-- Look 1 -->
		<div class="lookbook-item" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);">
			<div style="position: relative; aspect-ratio: 4/5; overflow: hidden; background: #080a0e;">
				<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/aiman_logo.png' ); ?>" alt="Royal Crimson Bridal Rida" style="width: 100%; height: 100%; object-fit: cover;">
				<span style="position: absolute; top: 15px; left: 15px; background: linear-gradient(135deg, var(--color-accent-burgundy), #991b1b); color: #fff; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: var(--radius-full); text-transform: uppercase;">
					<?php esc_html_e( 'BRIDAL COUTURE', 'aiman-collection' ); ?>
				</span>
			</div>
			<div style="padding: 1.8rem;">
				<h3 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.35rem; margin: 0 0 0.5rem 0;">
					<?php esc_html_e( 'Royal Crimson Zardozi Bridal Rida', 'aiman-collection' ); ?>
				</h3>
				<p style="color: var(--color-text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.2rem;">
					<?php esc_html_e( 'Pure raw silk base with handcrafted gold metallic zardozi on the pardi border and flowing Ghagra gher.', 'aiman-collection' ); ?>
				</p>
				<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode( 'Assalam-o-Alaikum! I am interested in the Royal Crimson Zardozi Bridal Rida from your Lookbook.' ); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="width: 100%; justify-content: center; text-align: center; border-radius: var(--radius-full); padding: 0.7rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
					<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'Inquire Bridal Availability', 'aiman-collection' ); ?>
				</a>
			</div>
		</div>

		<!-- Look 2 -->
		<div class="lookbook-item" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);">
			<div style="position: relative; aspect-ratio: 4/5; overflow: hidden; background: #080a0e;">
				<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/aiman_logo.png' ); ?>" alt="Emerald Velvet Boti Rida" style="width: 100%; height: 100%; object-fit: cover;">
				<span style="position: absolute; top: 15px; left: 15px; background: linear-gradient(135deg, var(--color-accent-emerald), #059669); color: #fff; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: var(--radius-full); text-transform: uppercase;">
					<?php esc_html_e( 'CEREMONIAL MILAD', 'aiman-collection' ); ?>
				</span>
			</div>
			<div style="padding: 1.8rem;">
				<h3 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.35rem; margin: 0 0 0.5rem 0;">
					<?php esc_html_e( 'Emerald Velvet Boti Festive Rida', 'aiman-collection' ); ?>
				</h3>
				<p style="color: var(--color-text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.2rem;">
					<?php esc_html_e( 'Chiffon georgette with deep emerald velvet borders and crystal lace embellishments for festive occasions.', 'aiman-collection' ); ?>
				</p>
				<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode( 'Assalam-o-Alaikum! I am interested in the Emerald Velvet Boti Festive Rida from your Lookbook.' ); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="width: 100%; justify-content: center; text-align: center; border-radius: var(--radius-full); padding: 0.7rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
					<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'Inquire Bridal Availability', 'aiman-collection' ); ?>
				</a>
			</div>
		</div>

		<!-- Look 3 -->
		<div class="lookbook-item" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md);">
			<div style="position: relative; aspect-ratio: 4/5; overflow: hidden; background: #080a0e;">
				<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/aiman_logo.png' ); ?>" alt="Pastel Lavender Pret Rida" style="width: 100%; height: 100%; object-fit: cover;">
				<span style="position: absolute; top: 15px; left: 15px; background: rgba(197, 168, 128, 0.3); border: 1px solid var(--color-gold-primary); color: #fff; font-size: 0.75rem; font-weight: 800; padding: 4px 12px; border-radius: var(--radius-full); text-transform: uppercase;">
					<?php esc_html_e( 'EVERYDAY PRET', 'aiman-collection' ); ?>
				</span>
			</div>
			<div style="padding: 1.8rem;">
				<h3 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 1.35rem; margin: 0 0 0.5rem 0;">
					<?php esc_html_e( 'Pastel Lavender Cotton Everyday Rida', 'aiman-collection' ); ?>
				</h3>
				<p style="color: var(--color-text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.2rem;">
					<?php esc_html_e( 'Lightweight, breathable pure Egyptian cotton featuring delicate floral scalloped borders and lightweight pardi.', 'aiman-collection' ); ?>
				</p>
				<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>?text=<?php echo rawurlencode( 'Assalam-o-Alaikum! I am interested in the Pastel Lavender Cotton Everyday Rida from your Lookbook.' ); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="width: 100%; justify-content: center; text-align: center; border-radius: var(--radius-full); padding: 0.7rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
					<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'Inquire Pret Availability', 'aiman-collection' ); ?>
				</a>
			</div>
		</div>

	</div>
</div>

<?php
get_footer();
