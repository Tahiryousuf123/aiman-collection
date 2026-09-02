<?php
/**
 * AIMAN COLLECTION — Custom Template Tags & UI Helpers
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get curated FontAwesome icon for product category slug
 */
function aiman_get_category_icon( $slug ) {
	$slug = strtolower( $slug );
	if ( strpos( $slug, 'rida' ) !== false ) {
		return 'fa-crown';
	} elseif ( strpos( $slug, 'bag' ) !== false || strpos( $slug, 'batwa' ) !== false ) {
		return 'fa-bag-shopping';
	} elseif ( strpos( $slug, 'cosmetic' ) !== false || strpos( $slug, 'pouch' ) !== false || strpos( $slug, 'topi' ) !== false ) {
		return 'fa-wand-magic-sparkles';
	} elseif ( strpos( $slug, 'deal' ) !== false || strpos( $slug, 'sale' ) !== false ) {
		return 'fa-fire text-danger';
	}
	return 'fa-gem';
}

/**
 * Render 5-star rating HTML
 */
function aiman_render_star_rating( $rating = 5 ) {
	$rating = min( 5, max( 1, floatval( $rating ) ) );
	$full   = floor( $rating );
	$half   = ( $rating - $full ) >= 0.5 ? 1 : 0;
	$empty  = 5 - $full - $half;

	$html = '<div class="star-rating-box" style="display: inline-flex; gap: 2px; color: #f59e0b; font-size: 0.82rem;">';
	for ( $i = 0; $i < $full; $i++ ) {
		$html .= '<i class="fas fa-star"></i>';
	}
	if ( $half ) {
		$html .= '<i class="fas fa-star-half-alt"></i>';
	}
	for ( $i = 0; $i < $empty; $i++ ) {
		$html .= '<i class="far fa-star"></i>';
	}
	$html .= '</div>';

	return $html;
}

/**
 * Display formatted post date
 */
function aiman_posted_on() {
	$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
	if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
		$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time>';
	}

	$time_string = sprintf(
		$time_string,
		esc_attr( get_the_date( DATE_W3C ) ),
		esc_html( get_the_date() )
	);

	echo '<span class="posted-on"><i class="far fa-calendar-alt text-gold" style="margin-right:4px;"></i> ' . $time_string . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

/**
 * Display post author
 */
function aiman_posted_by() {
	echo '<span class="byline"><i class="far fa-user text-gold" style="margin-right:4px;"></i> <a href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a></span>';
}
