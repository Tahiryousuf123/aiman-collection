<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package Aiman_Collection
 */

get_header();
?>

<div class="container" style="padding: 6rem 1.5rem; text-align: center; max-width: 650px;">
	<div style="width: 90px; height: 90px; border-radius: 50%; background: rgba(197, 168, 128, 0.15); border: 1px solid var(--color-border); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--color-gold-primary); margin: 0 auto 1.5rem auto;">
		<i class="fas fa-crown"></i>
	</div>

	<h1 style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.8rem; margin: 0 0 0.8rem 0;">404</h1>
	<h2 style="font-family: var(--font-subheading); color: var(--color-text-primary); font-size: 1.6rem; margin: 0 0 1rem 0;"><?php esc_html_e( 'Page Not Found', 'aiman-collection' ); ?></h2>
	<p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 1.05rem; margin-bottom: 2rem;">
		<?php esc_html_e( 'The rida or page you are looking for may have been moved, updated, or is exclusively available on custom request.', 'aiman-collection' ); ?>
	</p>

	<div style="margin-bottom: 2.5rem;">
		<?php get_search_form(); ?>
	</div>

	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-primary btn-lg" style="background: linear-gradient(135deg, var(--color-gold-primary), var(--color-gold-dark)); color: #0b0d11; font-weight: 800; padding: 0.9rem 2.2rem; border-radius: var(--radius-full); text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; display: inline-flex; align-items: center; gap: 0.6rem;">
		<i class="fas fa-home"></i> <?php esc_html_e( 'Return to Atelier Home', 'aiman-collection' ); ?>
	</a>
</div>

<?php
get_footer();
