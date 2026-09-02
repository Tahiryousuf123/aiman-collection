<?php
/**
 * AIMAN COLLECTION — Main Theme Functions & Setup
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'AIMAN_THEME_VERSION', '1.0.0' );
define( 'AIMAN_THEME_DIR', get_template_directory() );
define( 'AIMAN_THEME_URI', get_template_directory_uri() );

/**
 * 1. Theme Setup
 */
function aiman_theme_setup() {
	// Make theme available for translation
	load_theme_textdomain( 'aiman-collection', AIMAN_THEME_DIR . '/languages' );

	// Add default posts and comments RSS feed links to head
	add_theme_support( 'automatic-feed-links' );

	// Let WordPress manage the document title
	add_theme_support( 'title-tag' );

	// Enable support for Post Thumbnails
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 600, 750, true );
	add_image_size( 'aiman-product-card', 600, 750, true );
	add_image_size( 'aiman-hero-banner', 1920, 800, true );

	// Register Navigation Menus
	register_nav_menus( array(
		'primary-menu'    => __( 'Primary Navigation Menu', 'aiman-collection' ),
		'top-bar-menu'    => __( 'Top Announcement Bar Menu', 'aiman-collection' ),
		'category-ribbon' => __( 'Category Ribbon Menu', 'aiman-collection' ),
		'footer-menu'     => __( 'Footer Navigation Menu', 'aiman-collection' ),
	) );

	// HTML5 markup support
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	) );

	// Custom Logo Support
	add_theme_support( 'custom-logo', array(
		'height'      => 90,
		'width'       => 280,
		'flex-height' => true,
		'flex-width'  => true,
		'header-text' => array( 'site-title', 'site-description' ),
	) );

	// Responsive Embedded Content
	add_theme_support( 'responsive-embeds' );
}
add_action( 'after_setup_theme', 'aiman_theme_setup' );

/**
 * 2. Register Widget Sidebars
 */
function aiman_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Shop Sidebar', 'aiman-collection' ),
		'id'            => 'sidebar-shop',
		'description'   => __( 'Add widgets here to appear in WooCommerce product catalog filter sidebar.', 'aiman-collection' ),
		'before_widget' => '<div id="%1$s" class="widget shop-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="widget-title" style="color:var(--color-gold-light); font-family:var(--font-heading); margin-bottom:1rem; border-bottom:1px solid var(--color-border); padding-bottom:0.5rem;">',
		'after_title'   => '</h4>',
	) );

	register_sidebar( array(
		'name'          => __( 'Blog Sidebar', 'aiman-collection' ),
		'id'            => 'sidebar-blog',
		'description'   => __( 'Add widgets here to appear on blog posts and archives.', 'aiman-collection' ),
		'before_widget' => '<div id="%1$s" class="widget blog-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="widget-title">',
		'after_title'   => '</h4>',
	) );
}
add_action( 'widgets_init', 'aiman_widgets_init' );

/**
 * 3. Enqueue Scripts & Styles
 */
function aiman_enqueue_scripts() {
	// Google Fonts: Cinzel, Playfair Display, Plus Jakarta Sans, Noto Nastaliq Urdu
	wp_enqueue_style(
		'aiman-google-fonts',
		'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Noto+Nastaliq+Urdu:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
		array(),
		null
	);

	// FontAwesome 6 CDN
	wp_enqueue_style(
		'aiman-fontawesome',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
		array(),
		'6.4.0'
	);

	// Main Theme Stylesheet
	wp_enqueue_style(
		'aiman-main-style',
		get_stylesheet_uri(),
		array(),
		AIMAN_THEME_VERSION
	);

	// WooCommerce Luxury Stylesheet
	wp_enqueue_style(
		'aiman-woocommerce-style',
		AIMAN_THEME_URI . '/assets/css/woocommerce.css',
		array( 'aiman-main-style' ),
		AIMAN_THEME_VERSION
	);

	// Main Client-Side JavaScript Engine
	wp_enqueue_script(
		'aiman-main-js',
		AIMAN_THEME_URI . '/assets/js/main.js',
		array( 'jquery' ),
		AIMAN_THEME_VERSION,
		true
	);

	// Localize Script for AJAX & WhatsApp & Currency
	wp_localize_script( 'aiman-main-js', 'aiman_ajax_object', array(
		'ajax_url'         => admin_url( 'admin-ajax.php' ),
		'nonce'            => wp_create_nonce( 'aiman_ajax_nonce' ),
		'whatsapp_number'  => get_theme_mod( 'aiman_whatsapp_number', '923452439196' ),
		'currency_symbol'  => function_exists( 'get_woocommerce_currency_symbol' ) ? get_woocommerce_currency_symbol() : 'Rs. ',
		'current_currency' => function_exists( 'get_woocommerce_currency' ) ? get_woocommerce_currency() : 'PKR',
		'site_url'         => home_url(),
	) );

	// Comments reply script
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'aiman_enqueue_scripts' );

/**
 * 4. Include Modular Component Files
 */
require_once AIMAN_THEME_DIR . '/inc/template-tags.php';
require_once AIMAN_THEME_DIR . '/inc/customizer.php';
require_once AIMAN_THEME_DIR . '/inc/woocommerce-helpers.php';
require_once AIMAN_THEME_DIR . '/inc/ajax-handlers.php';
require_once AIMAN_THEME_DIR . '/inc/demo-importer.php';
