<?php
/**
 * The template for displaying all pages
 *
 * @package Aiman_Collection
 */

get_header();
?>

<div class="page-header" style="background: radial-gradient(circle at center top, rgba(197, 168, 128, 0.12) 0%, rgba(11, 13, 17, 0.98) 70%); border-bottom: 1px solid var(--color-border); padding: 3.5rem 0;">
	<div class="container" style="text-align: center;">
		<h1 class="page-title" style="font-family: var(--font-heading); color: var(--color-gold-light); font-size: 2.4rem; margin: 0;">
			<?php the_title(); ?>
		</h1>
	</div>
</div>

<div class="container" style="padding: 3.5rem 0 5rem 0; max-width: 960px;">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<div class="entry-content" style="background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-sm);">
				<?php
				the_content();

				wp_link_pages( array(
					'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'aiman-collection' ),
					'after'  => '</div>',
				) );
				?>
			</div>
		</article>

		<?php
		if ( comments_open() || get_comments_number() ) :
			comments_template();
		endif;

	endwhile;
	?>
</div>

<?php
get_footer();
