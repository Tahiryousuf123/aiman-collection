<?php
/**
 * Template Name: Merchant Portal & Accounting Suite
 *
 * @package Aiman_Collection
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$phone      = get_theme_mod( 'aiman_whatsapp_number', '923452439196' );
$phone_disp = get_theme_mod( 'aiman_whatsapp_display', '+92 345 2439196' );
?>

<div class="merchant-page-wrapper" style="min-height: 85vh; background: #080A0F; color: #FAF9F6; padding: 2rem 1rem;">
	<div class="container" style="max-width: 1400px; margin: 0 auto;">
		
		<!-- Security Header Banner -->
		<div style="background: linear-gradient(135deg, #10141F 0%, #0A0D15 100%); border: 1px solid rgba(197, 168, 128, 0.25); border-radius: 14px; padding: 1.5rem 2rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
			<div style="display: flex; align-items: center; gap: 1rem;">
				<div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(197,168,128,0.15); border: 1.5px solid var(--color-gold-primary); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: var(--color-gold-light);">
					<i class="fas fa-crown"></i>
				</div>
				<div>
					<h1 style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--color-gold-light); margin: 0; line-height: 1.2;">
						<?php esc_html_e( 'Aiman Merchant Administration & Ledger', 'aiman-collection' ); ?>
					</h1>
					<p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0.25rem 0 0 0;">
						<?php esc_html_e( 'Dawoodi Bohra Haute Couture Atelier — Store Inventory, Orders & Financial Ledger', 'aiman-collection' ); ?>
					</p>
				</div>
			</div>
			<div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
				<span class="status-pill delivered" style="font-size: 0.75rem;">
					<i class="fas fa-check-circle"></i> <?php esc_html_e( 'WooCommerce Pro Connected', 'aiman-collection' ); ?>
				</span>
				<button type="button" class="btn btn-primary btn-sm" onclick="window.AimanStore ? window.AimanStore.openAdmin() : alert('Merchant console ready');">
					<i class="fas fa-terminal"></i> <?php esc_html_e( 'Launch Fullscreen Console', 'aiman-collection' ); ?>
				</button>
			</div>
		</div>

		<!-- Dashboard Metrics Grid -->
		<div class="admin-metrics-grid" style="margin-bottom: 2.5rem;">
			<div class="metric-card">
				<div>
					<p><?php esc_html_e( 'Total Atelier Revenue', 'aiman-collection' ); ?></p>
					<h3 id="wpMetricRevenue"><?php echo ( function_exists( 'wc_price' ) ) ? wc_price( 0 ) : 'Rs. 0'; ?></h3>
				</div>
				<div class="icon-box"><i class="fas fa-coins"></i></div>
			</div>
			<div class="metric-card">
				<div>
					<p><?php esc_html_e( 'Cost of Materials (COGS)', 'aiman-collection' ); ?></p>
					<h3 id="wpMetricCost" style="color: #FF6B6B;">Rs. 0</h3>
				</div>
				<div class="icon-box" style="background: rgba(255,107,107,0.12); color: #FF6B6B;"><i class="fas fa-chart-pie"></i></div>
			</div>
			<div class="metric-card">
				<div>
					<p><?php esc_html_e( 'Operating Expenses', 'aiman-collection' ); ?></p>
					<h3 id="wpMetricExpenses" style="color: #F59E0B;">Rs. 0</h3>
				</div>
				<div class="icon-box" style="background: rgba(245,158,11,0.12); color: #F59E0B;"><i class="fas fa-receipt"></i></div>
			</div>
			<div class="metric-card">
				<div>
					<p><?php esc_html_e( 'Net Profit (PKR)', 'aiman-collection' ); ?></p>
					<h3 id="wpMetricProfit" style="color: #22C55E;">Rs. 0</h3>
				</div>
				<div class="icon-box" style="background: rgba(34,197,94,0.12); color: #22C55E;"><i class="fas fa-arrow-trend-up"></i></div>
			</div>
		</div>

		<!-- Main 2-Column Responsive Layout -->
		<div class="admin-sales-grid">
			
			<!-- Left: Quick Order Processing & Ledger -->
			<div class="admin-table-card">
				<div class="admin-table-header">
					<h4><i class="fas fa-receipt text-gold"></i> <?php esc_html_e( 'Recent Atelier Orders & Shipments', 'aiman-collection' ); ?></h4>
					<span style="font-size: 0.8rem; color: var(--color-text-muted);"><?php esc_html_e( 'TCS Express Nationwide Delivery', 'aiman-collection' ); ?></span>
				</div>
				<div class="admin-table-responsive">
					<table class="admin-table">
						<thead>
							<tr>
								<th><?php esc_html_e( 'Order #', 'aiman-collection' ); ?></th>
								<th><?php esc_html_e( 'Customer', 'aiman-collection' ); ?></th>
								<th><?php esc_html_e( 'Design / Libas', 'aiman-collection' ); ?></th>
								<th><?php esc_html_e( 'Total', 'aiman-collection' ); ?></th>
								<th><?php esc_html_e( 'Status', 'aiman-collection' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><strong>#AC-9402</strong></td>
								<td>Fatima Bai</td>
								<td>Royal Crimson Silk Rida</td>
								<td style="color: var(--color-gold-light); font-weight: 700;">Rs. 18,500</td>
								<td><span class="status-pill delivered">Delivered</span></td>
							</tr>
							<tr>
								<td><strong>#AC-9403</strong></td>
								<td>Zainab Ben</td>
								<td>Emerald Velvet Boti Rida</td>
								<td style="color: var(--color-gold-light); font-weight: 700;">Rs. 14,200</td>
								<td><span class="status-pill processing">Stitching</span></td>
							</tr>
							<tr>
								<td><strong>#AC-9404</strong></td>
								<td>Sakina Bai</td>
								<td>Matching Gold Batwa & Topi</td>
								<td style="color: var(--color-gold-light); font-weight: 700;">Rs. 4,800</td>
								<td><span class="status-pill shipped">TCS Shipped</span></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Right: Merchant Concierge & Financial Summary -->
			<div class="admin-table-card">
				<div class="admin-table-header">
					<h4><i class="fas fa-wallet text-gold"></i> <?php esc_html_e( 'Bank & Settlement Accounts', 'aiman-collection' ); ?></h4>
					<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>" target="_blank" class="btn btn-whatsapp btn-sm">
						<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'WhatsApp Concierge', 'aiman-collection' ); ?>
					</a>
				</div>
				<div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
					<div style="background: rgba(197, 168, 128, 0.08); border: 1px solid rgba(197, 168, 128, 0.2); border-radius: 10px; padding: 1.2rem;">
						<div style="font-size: 0.78rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.08em; margin-bottom: 0.35rem;">
							Meezan Bank Raast & Direct Transfer
						</div>
						<div style="font-size: 1.1rem; color: #FFF; font-weight: 700;">
							0345-2439196 <span style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: normal;">(Title: Tahir)</span>
						</div>
					</div>

					<div style="background: rgba(197, 168, 128, 0.08); border: 1px solid rgba(197, 168, 128, 0.2); border-radius: 10px; padding: 1.2rem;">
						<div style="font-size: 0.78rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.08em; margin-bottom: 0.35rem;">
							EasyPaisa Merchant Account
						</div>
						<div style="font-size: 1.1rem; color: #FFF; font-weight: 700;">
							0342-8301490 <span style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: normal;">(Title: Tahir)</span>
						</div>
					</div>

					<div style="background: rgba(197, 168, 128, 0.08); border: 1px solid rgba(197, 168, 128, 0.2); border-radius: 10px; padding: 1.2rem;">
						<div style="font-size: 0.78rem; text-transform: uppercase; color: var(--color-gold-primary); font-weight: 800; letter-spacing: 0.08em; margin-bottom: 0.35rem;">
							JazzCash Merchant Account
						</div>
						<div style="font-size: 1.1rem; color: #FFF; font-weight: 700;">
							0325-2005028 <span style="font-size: 0.8rem; color: var(--color-text-muted); font-weight: normal;">(Title: Tahir)</span>
						</div>
					</div>

					<div style="margin-top: 0.5rem; text-align: center;">
						<p style="font-size: 0.84rem; color: var(--color-text-secondary); line-height: 1.6;">
							<?php esc_html_e( 'Press Ctrl + Shift + A anywhere on the storefront to unlock live product editor and real-time ledger.', 'aiman-collection' ); ?>
						</p>
					</div>
				</div>
			</div>

		</div>

	</div>
</div>

<?php get_footer(); ?>
