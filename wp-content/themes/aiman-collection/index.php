<?php
/**
 * The main template file
 *
 * @package Aiman_Collection
 */

get_header();
?>

<div class="page-header" style="background: radial-gradient(circle at center top, rgba(197, 168, 128, 0.12) 0%, rgba(11, 13, 17, 0.98) 70%); border-bottom: 1px solid var(--color-border); padding: 3.5rem 0;">
	<div class="container" style="text-align: center;">
		<span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.1em;"><?php esc_html_e( 'ATELIER JOURNAL & JOURNAL', 'aiman-collection' ); ?></span>
		<h1 class="page-title" style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.4rem; margin: 0.4rem 0 0.8rem 0;">
			<?php single_post_title( '', true ); ?>
		</h1>
	</div>
</div>

<div class="container" style="padding: 3.5rem 0 5rem 0;">
	<div class="blog-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem;">
		<?php
		if ( have_posts() ) :
			while ( have_posts() ) :
				the_post();
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class( 'blog-card' ); ?> style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; display: flex; flex-direction: column;">
					<?php if ( has_post_thumbnail() ) : ?>
						<div class="blog-card-media" style="aspect-ratio: 16/9; overflow: hidden; background: #080a0e;">
							<a href="<?php the_permalink(); ?>">
								<?php the_post_thumbnail( 'medium_large', array( 'style' => 'width:100%; height:100%; object-fit:cover;' ) ); ?>
							</a>
						</div>
					<?php endif; ?>

					<div class="blog-card-body" style="padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column;">
						<div class="blog-meta" style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 0.6rem; display: flex; gap: 1rem;">
							<?php aiman_posted_on(); ?>
							<?php aiman_posted_by(); ?>
						</div>

						<h2 class="blog-title" style="font-family: var(--font-subheading); font-size: 1.3rem; margin: 0 0 0.8rem 0;">
							<a href="<?php the_permalink(); ?>" style="color: var(--color-text-primary); text-decoration: none;">
								<?php the_title(); ?>
							</a>
						</h2>

						<div class="blog-excerpt" style="color: var(--color-text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.2rem;">
							<?php the_excerpt(); ?>
						</div>

						<a href="<?php the_permalink(); ?>" class="read-more-link" style="margin-top: auto; color: var(--color-gold-primary); font-weight: 700; font-size: 0.88rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
							<?php esc_html_e( 'Read Article', 'aiman-collection' ); ?> <i class="fas fa-arrow-right"></i>
						</a>
					</div>
				</article>
				<?php
			endwhile;

			the_posts_navigation();

		else :
			?>
			<div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--color-text-muted);">
				<i class="fas fa-feather text-gold" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
				<h3><?php esc_html_e( 'No Articles Found', 'aiman-collection' ); ?></h3>
			</div>
			<?php
		endif;
		?>
	</div>
</div>

<?php
get_footer();
