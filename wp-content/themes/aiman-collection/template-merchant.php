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

<div class="merchant-page-wrapper" style="min-height: 85vh; background: #fafafa; color: #111111; padding: 2.5rem 1rem;">
	<div class="container" style="max-width: 1400px; margin: 0 auto;">
		
		<!-- Security & Brand Header Banner -->
		<div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 1.5rem 2rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
			<div style="display: flex; align-items: center; gap: 1rem;">
				<div style="width: 50px; height: 50px; border-radius: 50%; background: #fff5f5; border: 1.5px solid #7a0b1a; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: #7a0b1a;">
					<i class="fas fa-crown"></i>
				</div>
				<div>
					<h1 style="font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #111; margin: 0; line-height: 1.2; font-weight: 700;">
						<?php esc_html_e( 'Aiman Atelier Merchant & Sales Console', 'aiman-collection' ); ?>
					</h1>
					<p style="font-size: 0.85rem; color: #666; margin: 0.25rem 0 0 0;">
						<?php esc_html_e( 'Dawoodi Bohra Haute Couture — Store Inventory, Orders & Financial Ledger', 'aiman-collection' ); ?>
					</p>
				</div>
			</div>
			<div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
				<span class="status-pill delivered" style="background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; font-size: 0.8rem; padding: 5px 12px; border-radius: 20px; font-weight: 600;">
					<i class="fas fa-check-circle"></i> <?php esc_html_e( 'Storefront Synchronized', 'aiman-collection' ); ?>
				</span>
				<button type="button" class="admin-btn admin-btn-primary" onclick="if(window.AimanStore){ window.AimanStore.openAdminSuite(); } else { alert('Admin Suite console active.'); }" style="background:#111; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px;">
					<i class="fas fa-window-maximize"></i> <?php esc_html_e( 'Open Fullscreen Suite', 'aiman-collection' ); ?>
				</button>
			</div>
		</div>		<!-- Dashboard Metrics Grid -->
		<div class="admin-stats-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
			<div style="background:#fff; border:1px solid #eee; border-radius:10px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div>
					<p style="font-size:0.8rem; text-transform:uppercase; color:#777; margin:0 0 5px 0; font-weight:600;"><?php esc_html_e( 'Total Sales Revenue', 'aiman-collection' ); ?></p>
					<h3 id="statTotalRevenuePage" style="font-size:1.5rem; color:#16a34a; margin:0; font-weight:700;">Rs. 0</h3>
				</div>
				<div style="width:44px; height:44px; border-radius:10px; background:#f0fdf4; color:#16a34a; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
					<i class="fas fa-wallet"></i>
				</div>
			</div>
			<div style="background:#fff; border:1px solid #eee; border-radius:10px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div>
					<p style="font-size:0.8rem; text-transform:uppercase; color:#777; margin:0 0 5px 0; font-weight:600;"><?php esc_html_e( 'Total Making Cost', 'aiman-collection' ); ?></p>
					<h3 id="statTotalCostPage" style="font-size:1.5rem; color:#64748b; margin:0; font-weight:700;">Rs. 0</h3>
				</div>
				<div style="width:44px; height:44px; border-radius:10px; background:#f8fafc; color:#64748b; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
					<i class="fas fa-receipt"></i>
				</div>
			</div>
			<div style="background:#fff; border:1px solid #eee; border-radius:10px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div>
					<div style="display:flex; align-items:center; gap:6px; margin-bottom:5px;">
						<p style="font-size:0.8rem; text-transform:uppercase; color:#777; margin:0; font-weight:600;"><?php esc_html_e( 'Total Net Profit', 'aiman-collection' ); ?></p>
						<span id="statProfitMarginBadgePage" style="font-size:0.7rem; font-weight:700; background:#dcfce7; color:#15803d; padding:2px 6px; border-radius:10px;">0%</span>
					</div>
					<h3 id="statTotalProfitPage" style="font-size:1.5rem; color:#059669; margin:0; font-weight:700;">Rs. 0</h3>
				</div>
				<div style="width:44px; height:44px; border-radius:10px; background:#ecfdf5; color:#059669; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
					<i class="fas fa-chart-line"></i>
				</div>
			</div>
			<div style="background:#fff; border:1px solid #eee; border-radius:10px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div>
					<p style="font-size:0.8rem; text-transform:uppercase; color:#777; margin:0 0 5px 0; font-weight:600;"><?php esc_html_e( 'Avg Profit / Rida', 'aiman-collection' ); ?></p>
					<h3 id="statAvgProfitPage" style="font-size:1.5rem; color:#b45309; margin:0; font-weight:700;">Rs. 0</h3>
				</div>
				<div style="width:44px; height:44px; border-radius:10px; background:#fffbeb; color:#b45309; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
					<i class="fas fa-coins"></i>
				</div>
			</div>
			<div style="background:#fff; border:1px solid #eee; border-radius:10px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div>
					<p style="font-size:0.8rem; text-transform:uppercase; color:#777; margin:0 0 5px 0; font-weight:600;"><?php esc_html_e( 'Ridas Sold', 'aiman-collection' ); ?></p>
					<h3 id="statTotalSoldPage" style="font-size:1.5rem; color:#111; margin:0; font-weight:700;">0</h3>
				</div>
				<div style="width:44px; height:44px; border-radius:10px; background:#eff6ff; color:#2563eb; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
					<i class="fas fa-crown"></i>
				</div>
			</div>
			<div style="background:#fff; border:1px solid #eee; border-radius:10px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div>
					<p style="font-size:0.8rem; text-transform:uppercase; color:#777; margin:0 0 5px 0; font-weight:600;"><?php esc_html_e( 'Delivery Status', 'aiman-collection' ); ?></p>
					<h3 style="font-size:1.1rem; color:#111; margin:0; font-weight:700;">
						<span id="statCompletedOrdersPage" style="color:#0f766e;">0</span> <span style="font-size:0.75rem; font-weight:normal; color:#64748b;">Delivered</span> /
						<span id="statPendingOrdersPage" style="color:#f59e0b;">0</span> <span style="font-size:0.75rem; font-weight:normal; color:#64748b;">Pending</span>
					</h3>
				</div>
				<div style="width:44px; height:44px; border-radius:10px; background:#f0fdfa; color:#0f766e; display:flex; align-items:center; justify-content:center; font-size:1.1rem;">
					<i class="fas fa-truck"></i>
				</div>
			</div>
		</div>

		<!-- Main 2-Column Responsive Layout -->
		<div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap: 1.5rem; margin-bottom: 2rem;">
			
			<!-- Left: Record New Sale Form -->
			<div style="background:#fff; border:1px solid #e5e5e5; border-radius:10px; padding:1.5rem; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:12px; margin-bottom:15px;">
					<h3 style="font-size:1.1rem; font-weight:700; margin:0; display:flex; align-items:center; gap:8px;">
						<i class="fas fa-plus-circle" style="color:#16a34a;"></i> <?php esc_html_e( 'Record New Sale (Rida Sold)', 'aiman-collection' ); ?>
					</h3>
					<span style="font-size:0.8rem; color:#666;"><?php esc_html_e( 'Direct Entry to Atelier Ledger', 'aiman-collection' ); ?></span>
				</div>
				<form onsubmit="handleMerchantSaleSubmit(event)">
					<div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
						<div style="grid-column: span 2;">
							<label style="display:block; font-size:0.8rem; font-weight:600; text-transform:uppercase; margin-bottom:4px; color:#555;">Rida / Product Sold *</label>
							<input type="text" id="merchantSaleProduct" required placeholder="e.g. Royal Crimson Heavy Zardozi Bridal Silk Rida" style="width:100%; padding:9px 12px; border:1px solid #ddd; border-radius:6px; font-size:0.9rem;">
						</div>
						<div>
							<label style="display:block; font-size:0.8rem; font-weight:600; text-transform:uppercase; margin-bottom:4px; color:#555;">Sale Price (PKR) *</label>
							<input type="number" id="merchantSaleAmount" required min="1" placeholder="e.g. 15500" oninput="calcMerchantProfit()" style="width:100%; padding:9px 12px; border:1px solid #ddd; border-radius:6px; font-size:0.9rem;">
						</div>
						<div>
							<label style="display:block; font-size:0.8rem; font-weight:600; text-transform:uppercase; margin-bottom:4px; color:#555;">Cost / Making Price (PKR) <span style="font-size:0.75rem; color:#64748b; font-weight:normal;">(Kapra + Karigari)</span></label>
							<input type="number" id="merchantSaleCost" min="0" placeholder="e.g. 8500" oninput="calcMerchantProfit()" style="width:100%; padding:9px 12px; border:1px solid #ddd; border-radius:6px; font-size:0.9rem;">
						</div>
						<div>
							<label style="display:block; font-size:0.8rem; font-weight:600; text-transform:uppercase; margin-bottom:4px; color:#555;">Customer Name *</label>
							<input type="text" id="merchantSaleCustomer" required placeholder="e.g. Fatema Bhen Shabbir" style="width:100%; padding:9px 12px; border:1px solid #ddd; border-radius:6px; font-size:0.9rem;">
						</div>
						<div>
							<label style="display:block; font-size:0.8rem; font-weight:600; text-transform:uppercase; margin-bottom:4px; color:#555;">Customer Phone / WhatsApp</label>
							<input type="text" id="merchantSalePhone" placeholder="e.g. 03452281923" style="width:100%; padding:9px 12px; border:1px solid #ddd; border-radius:6px; font-size:0.9rem;">
						</div>
						<div>
							<label style="display:block; font-size:0.8rem; font-weight:600; text-transform:uppercase; margin-bottom:4px; color:#555;">Payment Method</label>
							<select id="merchantSalePayment" style="width:100%; padding:9px 12px; border:1px solid #ddd; border-radius:6px; font-size:0.9rem;">
								<option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
								<option value="Meezan Raast">Meezan Bank Raast</option>
								<option value="EasyPaisa">EasyPaisa</option>
								<option value="JazzCash">JazzCash</option>
								<option value="Direct Bank Transfer">Direct Bank Transfer</option>
							</select>
						</div>
						<div style="grid-column: span 2;">
							<label style="display:block; font-size:0.8rem; font-weight:600; text-transform:uppercase; margin-bottom:4px; color:#555;">Order Status</label>
							<select id="merchantSaleStatus" style="width:100%; padding:9px 12px; border:1px solid #ddd; border-radius:6px; font-size:0.9rem;">
								<option value="Sold - In Stitching">Sold - In Stitching</option>
								<option value="Dispatched TCS">Dispatched via TCS</option>
								<option value="Delivered & Paid">Delivered &amp; Paid</option>
							</select>
						</div>
					</div>
					<!-- Live Profit Preview -->
					<div id="merchantProfitPreview" style="display:flex; align-items:center; justify-content:space-between; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:9px 14px; margin-bottom:12px; flex-wrap:wrap; gap:6px;">
						<div style="display:flex; align-items:center; gap:7px;">
							<i class="fas fa-calculator" style="color:#16a34a;"></i>
							<span style="font-size:0.82rem; font-weight:600; color:#166534;">Profit Per Rida:</span>
							<span id="merchantProfitText" style="font-size:0.92rem; font-weight:700; color:#15803d;">Rs. 0 (0% margin)</span>
						</div>
						<span id="merchantProfitPill" style="font-size:0.72rem; color:#15803d; background:#dcfce7; padding:2px 9px; border-radius:10px; font-weight:700;">Live Net Profit</span>
					</div>
					<div style="display:flex; justify-content:flex-end;">
						<button type="submit" style="background:#16a34a; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px;">
							<i class="fas fa-check"></i> <?php esc_html_e( 'Record Sold Rida', 'aiman-collection' ); ?>
						</button>
					</div>
				</form>
			</div>

			<!-- Right: Bank Accounts & Concierge -->
			<div style="background:#fff; border:1px solid #e5e5e5; border-radius:10px; padding:1.5rem; box-shadow:0 2px 8px rgba(0,0,0,0.03); display:flex; flex-direction:column; justify-content:space-between;">
				<div>
					<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:12px; margin-bottom:15px;">
						<h3 style="font-size:1.1rem; font-weight:700; margin:0; display:flex; align-items:center; gap:8px;">
							<i class="fas fa-wallet" style="color:#7a0b1a;"></i> <?php esc_html_e( 'Official Settlement Accounts', 'aiman-collection' ); ?>
						</h3>
						<a href="https://wa.me/<?php echo esc_attr( $phone ); ?>" target="_blank" style="background:#25D366; color:#fff; padding:6px 12px; border-radius:20px; font-size:0.75rem; font-weight:600; text-decoration:none; display:flex; align-items:center; gap:4px;">
							<i class="fab fa-whatsapp"></i> <?php esc_html_e( 'Concierge', 'aiman-collection' ); ?>
						</a>
					</div>
					
					<div style="display:flex; flex-direction:column; gap:10px;">
						<div style="background:#fafafa; border:1px solid #eee; border-radius:8px; padding:12px;">
							<div style="font-size:0.75rem; text-transform:uppercase; color:#7a0b1a; font-weight:700;">Meezan Bank Raast & Direct Transfer</div>
							<div style="font-size:1rem; font-weight:700; color:#111; margin-top:2px;">0345-2439196 <span style="font-size:0.8rem; font-weight:normal; color:#666;">(Title: Tahir)</span></div>
						</div>
						<div style="background:#fafafa; border:1px solid #eee; border-radius:8px; padding:12px;">
							<div style="font-size:0.75rem; text-transform:uppercase; color:#16a34a; font-weight:700;">EasyPaisa Merchant Account</div>
							<div style="font-size:1rem; font-weight:700; color:#111; margin-top:2px;">0342-8301490 <span style="font-size:0.8rem; font-weight:normal; color:#666;">(Title: Tahir)</span></div>
						</div>
						<div style="background:#fafafa; border:1px solid #eee; border-radius:8px; padding:12px;">
							<div style="font-size:0.75rem; text-transform:uppercase; color:#ea580c; font-weight:700;">JazzCash Merchant Account</div>
							<div style="font-size:1rem; font-weight:700; color:#111; margin-top:2px;">0325-2005028 <span style="font-size:0.8rem; font-weight:normal; color:#666;">(Title: Tahir)</span></div>
						</div>
					</div>
				</div>

				<div style="margin-top:1.5rem; text-align:center; padding-top:1rem; border-top:1px solid #f0f0f0;">
					<p style="font-size:0.82rem; color:#777; margin:0;">
						<?php esc_html_e( 'Press Ctrl + Shift + A on the storefront anytime to access the full merchant console.', 'aiman-collection' ); ?>
					</p>
				</div>
			</div>

		</div>

		<!-- Atelier Sales Ledger Table -->
		<div style="background:#fff; border:1px solid #e5e5e5; border-radius:10px; padding:1.5rem; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
			<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:12px; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
				<h3 style="font-size:1.1rem; font-weight:700; margin:0; display:flex; align-items:center; gap:8px;">
					<i class="fas fa-table-list"></i> <?php esc_html_e( 'Atelier Sales Ledger (All Orders)', 'aiman-collection' ); ?>
				</h3>
				<div style="display:flex; gap:8px;">
					<button type="button" onclick="exportMerchantCSV()" style="background:#0f766e; color:#fff; border:none; padding:6px 14px; border-radius:6px; font-size:0.82rem; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px;">
						<i class="fas fa-file-excel"></i> <?php esc_html_e( 'Export CSV', 'aiman-collection' ); ?>
					</button>
				</div>
			</div>
			<div style="overflow-x:auto;">
				<table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
					<thead>
						<tr style="border-bottom:2px solid #eee; background:#fafafa;">
							<th style="padding:10px 12px; font-weight:600; color:#555;">Date</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Rida / Libas</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Customer</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Phone</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Sale Price</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Cost Price</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Net Profit</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Payment</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Status</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Action</th>
						</tr>
					</thead>
					<tbody id="merchantLedgerTableBody">
						<!-- Injected dynamically via JS below -->
					</tbody>
				</table>
			</div>
		</div>

	</div>
</div>

<script>
(function() {
	function getSales() {
		return JSON.parse(localStorage.getItem('aiman_sales')) || [
			{ id: 'ORD-1091', date: '2026-09-06', productName: 'Royal Crimson Heavy Zardozi Bridal Silk Rida', customerName: 'Fatema Bhen Shabbir', phone: '03452281923', amount: 15500, costPrice: 9000, paymentMethod: 'Cash on Delivery (COD)', status: 'Delivered & Paid' },
			{ id: 'ORD-1090', date: '2026-09-05', productName: 'Pastel Mint Chiffon Dupatta Summer Cotton Pret', customerName: 'Sakina Bhen Burhanuddin', phone: '03332194821', amount: 4850, costPrice: 2500, paymentMethod: 'Meezan Raast', status: 'Delivered & Paid' },
			{ id: 'ORD-1089', date: '2026-09-04', productName: 'Handcrafted Gold Zardozi Matching Bridal Batwa', customerName: 'Zainab Bhen Mustafa', phone: '03219984723', amount: 2450, costPrice: 0, paymentMethod: 'EasyPaisa', status: 'Dispatched TCS' }
		];
	}

	window.calcMerchantProfit = function() {
		const amt = Number(document.getElementById('merchantSaleAmount').value) || 0;
		const cost = Number(document.getElementById('merchantSaleCost').value) || 0;
		const profit = amt - cost;
		const margin = amt > 0 ? ((profit / amt) * 100).toFixed(1) : '0.0';
		const text = document.getElementById('merchantProfitText');
		const pill = document.getElementById('merchantProfitPill');
		if (!text) return;
		const isPos = profit >= 0;
		text.textContent = `${isPos ? '+' : ''}Rs. ${profit.toLocaleString()} (${margin}% margin)`;
		text.style.color = isPos ? '#15803d' : '#b91c1c';
		if (pill) { pill.textContent = isPos ? 'Net Profit / Rida' : 'Loss Warning'; pill.style.background = isPos ? '#dcfce7' : '#fee2e2'; pill.style.color = isPos ? '#15803d' : '#b91c1c'; }
	};

	function renderSalesPage() {
		const sales = getSales();
		const tbody = document.getElementById('merchantLedgerTableBody');
		if (!tbody) return;

		let totalRev = 0, totalCost = 0, pending = 0, completed = 0;

		tbody.innerHTML = '';
		if (sales.length === 0) {
			tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; padding:30px; color:#999;">No sales recorded yet. Use the form above to record sold ridas.</td></tr>';
		} else {
			sales.forEach((s, idx) => {
				const amt = Number(s.amount || s.totalRevenue || s.sellingPrice || 0);
				const cost = Number(s.costPrice || s.unitCost || s.totalCost || 0);
				const profit = (s.netProfit !== undefined && s.netProfit !== null && !isNaN(Number(s.netProfit)))
					? Number(s.netProfit) : (s.profit !== undefined && !isNaN(Number(s.profit))) ? Number(s.profit) : (amt - cost);
				const margin = amt > 0 ? Math.round((profit / amt) * 100) : 0;

				totalRev += amt;
				totalCost += cost;
				if (s.status && (s.status.includes('Stitching') || s.status.includes('Dispatched'))) pending++;
				if (s.status && s.status.includes('Delivered')) completed++;

				const tr = document.createElement('tr');
				tr.style.borderBottom = '1px solid #f0f0f0';

				let statusColor = '#16a34a', statusBg = '#f0fdf4';
				if (s.status && s.status.includes('Stitching')) { statusColor = '#f59e0b'; statusBg = '#fffbeb'; }
				else if (s.status && s.status.includes('Dispatched')) { statusColor = '#2563eb'; statusBg = '#eff6ff'; }

				const isPos = profit >= 0;

				tr.innerHTML = `
					<td style="padding:9px 12px; color:#777; font-size:0.82rem;">${s.date || 'Today'}</td>
					<td style="padding:9px 12px; font-weight:600; color:#111;">${s.productName || 'Bohra Rida'}</td>
					<td style="padding:9px 12px;">${s.customerName || 'Customer'}</td>
					<td style="padding:9px 12px; font-size:0.82rem; color:#555;">${s.phone || '—'}</td>
					<td style="padding:9px 12px; font-weight:700; color:#1e293b;">Rs. ${amt.toLocaleString()}</td>
					<td style="padding:9px 12px; color:#64748b; font-weight:600;">Rs. ${cost.toLocaleString()}</td>
					<td style="padding:9px 12px;">
						<span style="background:${isPos ? '#ecfdf5' : '#fef2f2'}; color:${isPos ? '#059669' : '#dc2626'}; padding:3px 8px; border-radius:6px; font-size:0.8rem; font-weight:700; border:1px solid ${isPos ? '#a7f3d0' : '#fecaca'};">
							${isPos ? '+' : ''}Rs. ${profit.toLocaleString()}
						</span>
						<small style="display:block; color:#64748b; font-size:0.72rem; margin-top:2px;">${margin}% margin</small>
					</td>
					<td style="padding:9px 12px; font-size:0.82rem;">${s.paymentMethod || 'COD'}</td>
					<td style="padding:9px 12px;">
						<span style="background:${statusBg}; color:${statusColor}; padding:3px 10px; border-radius:15px; font-size:0.78rem; font-weight:600;">${s.status || 'Delivered'}</span>
					</td>
					<td style="padding:9px 12px;">
						<div style="display:flex; gap:5px; align-items:center;">
							<button type="button" onclick="editMerchantSaleCost(${idx})" style="background:#eff6ff; border:1px solid #bfdbfe; color:#2563eb; padding:3px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;" title="Edit Cost"><i class="fas fa-pen"></i> Cost</button>
							<button type="button" onclick="deleteMerchantSale(${idx})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.85rem;" title="Delete Record"><i class="fas fa-trash-alt"></i></button>
						</div>
					</td>
				`;
				tbody.appendChild(tr);
			});
		}

		const totalProfit = totalRev - totalCost;
		const profitMargin = totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : '0.0';
		const avgProfit = sales.length > 0 ? Math.round(totalProfit / sales.length) : 0;

		document.getElementById('statTotalRevenuePage').textContent = 'Rs. ' + totalRev.toLocaleString();

		const costEl = document.getElementById('statTotalCostPage');
		if (costEl) costEl.textContent = 'Rs. ' + totalCost.toLocaleString();

		const profitEl = document.getElementById('statTotalProfitPage');
		if (profitEl) { profitEl.textContent = (totalProfit >= 0 ? '' : '-') + 'Rs. ' + Math.abs(totalProfit).toLocaleString(); profitEl.style.color = totalProfit >= 0 ? '#059669' : '#dc2626'; }

		const marginEl = document.getElementById('statProfitMarginBadgePage');
		if (marginEl) { marginEl.textContent = profitMargin + '% margin'; marginEl.style.background = totalProfit >= 0 ? '#dcfce7' : '#fee2e2'; marginEl.style.color = totalProfit >= 0 ? '#15803d' : '#b91c1c'; }

		const avgEl = document.getElementById('statAvgProfitPage');
		if (avgEl) { avgEl.textContent = (avgProfit >= 0 ? '' : '-') + 'Rs. ' + Math.abs(avgProfit).toLocaleString(); avgEl.style.color = avgProfit >= 0 ? '#b45309' : '#dc2626'; }

		document.getElementById('statTotalSoldPage').textContent = sales.length;
		const pendEl = document.getElementById('statPendingOrdersPage');
		if (pendEl) pendEl.textContent = pending;
		const compEl = document.getElementById('statCompletedOrdersPage');
		if (compEl) compEl.textContent = completed;
	}

	window.handleMerchantSaleSubmit = function(e) {
		e.preventDefault();
		const prod = document.getElementById('merchantSaleProduct').value.trim();
		const amt = Number(document.getElementById('merchantSaleAmount').value);
		const cost = Number(document.getElementById('merchantSaleCost').value) || 0;
		const cust = document.getElementById('merchantSaleCustomer').value.trim();
		const phone = document.getElementById('merchantSalePhone').value.trim();
		const pay = document.getElementById('merchantSalePayment').value;
		const status = document.getElementById('merchantSaleStatus').value;

		if (!prod || !amt || !cust) return;

		const netProfit = amt - cost;
		const profitMargin = amt > 0 ? Number(((netProfit / amt) * 100).toFixed(1)) : 0;

		const sales = getSales();
		sales.unshift({
			id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
			date: new Date().toISOString().split('T')[0],
			productName: prod,
			customerName: cust,
			phone: phone,
			amount: amt,
			sellingPrice: amt,
			totalRevenue: amt,
			costPrice: cost,
			unitCost: cost,
			totalCost: cost,
			netProfit: netProfit,
			profit: netProfit,
			profitMargin: profitMargin,
			paymentMethod: pay,
			status: status
		});

		localStorage.setItem('aiman_sales', JSON.stringify(sales));
		e.target.reset();
		calcMerchantProfit();
		renderSalesPage();
		alert('Sale successfully recorded to Atelier Ledger!\nNet Profit: Rs. ' + netProfit.toLocaleString() + ' (' + profitMargin + '% margin)');
	};

	window.editMerchantSaleCost = function(idx) {
		const sales = getSales();
		const s = sales[idx];
		if (!s) return;
		const currentCost = Number(s.costPrice || s.unitCost || s.totalCost || 0);
		const sellPrice = Number(s.amount || s.totalRevenue || s.sellingPrice || 0);
		const input = prompt('Update Cost Price (PKR) for:\n"' + s.productName + '"\n\nSelling Price: Rs. ' + sellPrice.toLocaleString() + '\nCurrent Cost: Rs. ' + currentCost.toLocaleString(), String(currentCost));
		if (input === null) return;
		const newCost = Math.max(0, Number(input) || 0);
		const newProfit = sellPrice - newCost;
		const newMargin = sellPrice > 0 ? Number(((newProfit / sellPrice) * 100).toFixed(1)) : 0;
		s.costPrice = newCost; s.unitCost = newCost; s.totalCost = newCost;
		s.netProfit = newProfit; s.profit = newProfit; s.profitMargin = newMargin;
		localStorage.setItem('aiman_sales', JSON.stringify(sales));
		renderSalesPage();
		alert('Cost updated!\nNew Net Profit: Rs. ' + newProfit.toLocaleString() + ' (' + newMargin + '% margin)');
	};

	window.deleteMerchantSale = function(idx) {
		if (!confirm('Are you sure you want to remove this sale record?')) return;
		const sales = getSales();
		sales.splice(idx, 1);
		localStorage.setItem('aiman_sales', JSON.stringify(sales));
		renderSalesPage();
	};

	window.exportMerchantCSV = function() {
		const sales = getSales();
		if (!sales.length) { alert('No sales to export.'); return; }
		let csv = 'ID,Date,Product,Customer,Phone,Sale Price (PKR),Cost Price (PKR),Net Profit (PKR),Margin %,Payment,Status\n';
		sales.forEach(s => {
			const amt = Number(s.amount || s.totalRevenue || s.sellingPrice || 0);
			const cost = Number(s.costPrice || s.unitCost || s.totalCost || 0);
			const profit = (s.netProfit !== undefined && !isNaN(Number(s.netProfit))) ? Number(s.netProfit) : (amt - cost);
			const margin = amt > 0 ? Math.round((profit / amt) * 100) : 0;
			csv += `"${s.id}","${s.date}","${(s.productName||'').replace(/"/g,'""')}","${(s.customerName||'').replace(/"/g,'""')}","${s.phone||''}","${amt}","${cost}","${profit}","${margin}%","${s.paymentMethod||''}","${s.status||''}"\n`;
		});
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url; a.download = `Aiman_Sales_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
		a.click(); URL.revokeObjectURL(url);
	};

	document.addEventListener('DOMContentLoaded', renderSalesPage);
	renderSalesPage();
})();
</script>

<?php get_footer(); ?>
