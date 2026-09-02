<?php
/**
 * The template for displaying all single posts
 *
 * @package Aiman_Collection
 */

get_header();
?>

<div class="page-header" style="background: radial-gradient(circle at center top, rgba(197, 168, 128, 0.12) 0%, rgba(11, 13, 17, 0.98) 70%); border-bottom: 1px solid var(--color-border); padding: 3.5rem 0;">
	<div class="container" style="text-align: center; max-width: 800px;">
		<div class="entry-meta" style="margin-bottom: 0.8rem; font-size: 0.85rem; color: var(--color-gold-primary); display: flex; gap: 1rem; justify-content: center;">
			<?php aiman_posted_on(); ?>
			<?php aiman_posted_by(); ?>
		</div>
		<h1 class="entry-title" style="font-family: var(--font-heading); color: var(--color-text-primary); font-size: 2.4rem; margin: 0; line-height: 1.25;">
			<?php the_title(); ?>
		</h1>
	</div>
</div>

<div class="container" style="padding: 3.5rem 0 5rem 0; max-width: 880px;">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<?php if ( has_post_thumbnail() ) : ?>
				<div class="post-featured-image" style="border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 2.5rem; border: 1px solid var(--color-border);">
					<?php the_post_thumbnail( 'large', array( 'style' => 'width:100%; height:auto; display:block;' ) ); ?>
				</div>
			<?php endif; ?>

			<div class="entry-content" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-sm); line-height: 1.85;">
				<?php
				the_content();

				wp_link_pages( array(
					'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'aiman-collection' ),
					'after'  => '</div>',
				) );
				?>
			</div>

			<div class="post-navigation" style="display: flex; justify-content: space-between; margin: 2.5rem 0; font-size: 0.95rem;">
				<div><?php previous_post_link( '<i class="fas fa-arrow-left text-gold"></i> %link' ); ?></div>
				<div><?php next_post_link( '%link <i class="fas fa-arrow-right text-gold"></i>' ); ?></div>
			</div>

			<?php
			if ( comments_open() || get_comments_number() ) :
				comments_template();
			endif;
			?>
		</article>
	<?php endwhile; ?>
</div>

<?php
get_footer();
