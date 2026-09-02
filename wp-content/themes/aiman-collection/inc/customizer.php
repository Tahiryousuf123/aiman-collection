<?php
/**
 * AIMAN COLLECTION — Theme Customizer Settings
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function aiman_customize_register( $wp_customize ) {

	// 1. Panel: Aiman Theme Options
	$wp_customize->add_panel( 'aiman_theme_options', array(
		'title'       => __( '👑 Aiman Luxury Theme Settings', 'aiman-collection' ),
		'description' => __( 'Customize announcements, WhatsApp concierge, hero banners, and bank details.', 'aiman-collection' ),
		'priority'    => 30,
	) );

	// Section: Announcement Bar
	$wp_customize->add_section( 'aiman_announcement_section', array(
		'title'    => __( 'Top Announcement Ticker', 'aiman-collection' ),
		'panel'    => 'aiman_theme_options',
		'priority' => 10,
	) );

	$wp_customize->add_setting( 'aiman_announcement_text', array(
		'default'           => '✨ Bohra Festive Sale: Flat 25% Off with code AIMAN25 | Free Nationwide TCS Delivery',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'aiman_announcement_text', array(
		'label'    => __( 'Announcement Text', 'aiman-collection' ),
		'section'  => 'aiman_announcement_section',
		'type'     => 'textarea',
	) );

	$wp_customize->add_setting( 'aiman_promo_code', array(
		'default'           => 'AIMAN25',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_promo_code', array(
		'label'    => __( 'Promo Code (Click-to-Copy)', 'aiman-collection' ),
		'section'  => 'aiman_announcement_section',
		'type'     => 'text',
	) );

	// Section: WhatsApp & Concierge
	$wp_customize->add_section( 'aiman_whatsapp_section', array(
		'title'    => __( 'WhatsApp Concierge & AI Stylist', 'aiman-collection' ),
		'panel'    => 'aiman_theme_options',
		'priority' => 20,
	) );

	$wp_customize->add_setting( 'aiman_whatsapp_number', array(
		'default'           => '923452439196',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_whatsapp_number', array(
		'label'       => __( 'WhatsApp Number (with Country Code e.g. 923452439196)', 'aiman-collection' ),
		'description' => __( 'Orders and Bohra AI chat inquiries will be directed to this number.', 'aiman-collection' ),
		'section'     => 'aiman_whatsapp_section',
		'type'        => 'text',
	) );

	$wp_customize->add_setting( 'aiman_whatsapp_display', array(
		'default'           => '+92 345 2439196',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_whatsapp_display', array(
		'label'    => __( 'WhatsApp Display Text', 'aiman-collection' ),
		'section'  => 'aiman_whatsapp_section',
		'type'     => 'text',
	) );

	// Section: Hero Section
	$wp_customize->add_section( 'aiman_hero_section', array(
		'title'    => __( 'Homepage Hero Banner', 'aiman-collection' ),
		'panel'    => 'aiman_theme_options',
		'priority' => 30,
	) );

	$wp_customize->add_setting( 'aiman_hero_badge', array(
		'default'           => '👑 Karachi\'s Royal Atelier • Dawoodi Bohra Libas',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_hero_badge', array(
		'label'    => __( 'Hero Badge Tag', 'aiman-collection' ),
		'section'  => 'aiman_hero_section',
		'type'     => 'text',
	) );

	$wp_customize->add_setting( 'aiman_hero_title', array(
		'default'           => 'Haute Couture Ridas & Handcrafted Elegance',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_hero_title', array(
		'label'    => __( 'Hero Main Title', 'aiman-collection' ),
		'section'  => 'aiman_hero_section',
		'type'     => 'text',
	) );

	$wp_customize->add_setting( 'aiman_hero_subtitle', array(
		'default'           => 'Bespoke Dawoodi Bohra ceremonial bridal ridas, everyday pastel cotton pret, matching designer batwas, and luxury vanity accessories.',
		'sanitize_callback' => 'sanitize_textarea_field',
	) );
	$wp_customize->add_control( 'aiman_hero_subtitle', array(
		'label'    => __( 'Hero Subtitle Description', 'aiman-collection' ),
		'section'  => 'aiman_hero_section',
		'type'     => 'textarea',
	) );

	$wp_customize->add_setting( 'aiman_hero_image', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'aiman_hero_image', array(
		'label'    => __( 'Hero Banner Image', 'aiman-collection' ),
		'section'  => 'aiman_hero_section',
	) ) );

	// Section: Bank & Payment Instructions
	$wp_customize->add_section( 'aiman_bank_section', array(
		'title'    => __( 'Bank & Payment Details', 'aiman-collection' ),
		'panel'    => 'aiman_theme_options',
		'priority' => 40,
	) );

	$wp_customize->add_setting( 'aiman_bank_name', array(
		'default'           => 'Meezan Bank Ltd (Islamic Banking)',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_bank_name', array(
		'label'    => __( 'Bank Name', 'aiman-collection' ),
		'section'  => 'aiman_bank_section',
		'type'     => 'text',
	) );

	$wp_customize->add_setting( 'aiman_bank_title', array(
		'default'           => 'Tahir',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_bank_title', array(
		'label'    => __( 'Account Title', 'aiman-collection' ),
		'section'  => 'aiman_bank_section',
		'type'     => 'text',
	) );

	$wp_customize->add_setting( 'aiman_bank_account', array(
		'default'           => '0102-0105849201',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_bank_account', array(
		'label'    => __( 'Account Number', 'aiman-collection' ),
		'section'  => 'aiman_bank_section',
		'type'     => 'text',
	) );

	$wp_customize->add_setting( 'aiman_bank_iban', array(
		'default'           => 'PK45MEZN0001020105849201',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_bank_iban', array(
		'label'    => __( 'IBAN', 'aiman-collection' ),
		'section'  => 'aiman_bank_section',
		'type'     => 'text',
	) );

	$wp_customize->add_setting( 'aiman_easypaisa', array(
		'default'           => '0342-8301490 (Title: Tahir)',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_easypaisa', array(
		'label'    => __( 'EasyPaisa Details', 'aiman-collection' ),
		'section'  => 'aiman_bank_section',
		'type'     => 'text',
	) );

	$wp_customize->add_setting( 'aiman_jazzcash', array(
		'default'           => '0325-2005028 (Title: Tahir)',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'aiman_jazzcash', array(
		'label'    => __( 'JazzCash Details', 'aiman-collection' ),
		'section'  => 'aiman_bank_section',
		'type'     => 'text',
	) );
}
add_action( 'customize_register', 'aiman_customize_register' );
