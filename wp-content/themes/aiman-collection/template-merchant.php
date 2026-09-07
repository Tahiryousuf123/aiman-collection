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
		</div>

		<!-- Dashboard Metrics Grid -->
		<div class="admin-stats-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
			<div class="stat-metric-card" style="background:#fff; border:1px solid #eee; border-radius:10px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div>
					<p style="font-size:0.8rem; text-transform:uppercase; color:#777; margin:0 0 5px 0; font-weight:600;"><?php esc_html_e( 'Total Sales Revenue', 'aiman-collection' ); ?></p>
					<h3 id="statTotalRevenuePage" style="font-size:1.6rem; color:#16a34a; margin:0; font-weight:700;">Rs. 0</h3>
				</div>
				<div style="width:48px; height:48px; border-radius:10px; background:#f0fdf4; color:#16a34a; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
					<i class="fas fa-wallet"></i>
				</div>
			</div>
			<div class="stat-metric-card" style="background:#fff; border:1px solid #eee; border-radius:10px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div>
					<p style="font-size:0.8rem; text-transform:uppercase; color:#777; margin:0 0 5px 0; font-weight:600;"><?php esc_html_e( 'Ridas / Items Sold', 'aiman-collection' ); ?></p>
					<h3 id="statTotalSoldPage" style="font-size:1.6rem; color:#111; margin:0; font-weight:700;">0</h3>
				</div>
				<div style="width:48px; height:48px; border-radius:10px; background:#eff6ff; color:#2563eb; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
					<i class="fas fa-crown"></i>
				</div>
			</div>
			<div class="stat-metric-card" style="background:#fff; border:1px solid #eee; border-radius:10px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div>
					<p style="font-size:0.8rem; text-transform:uppercase; color:#777; margin:0 0 5px 0; font-weight:600;"><?php esc_html_e( 'Pending Dispatch', 'aiman-collection' ); ?></p>
					<h3 id="statPendingOrdersPage" style="font-size:1.6rem; color:#f59e0b; margin:0; font-weight:700;">0</h3>
				</div>
				<div style="width:48px; height:48px; border-radius:10px; background:#fffbeb; color:#f59e0b; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
					<i class="fas fa-truck"></i>
				</div>
			</div>
			<div class="stat-metric-card" style="background:#fff; border:1px solid #eee; border-radius:10px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
				<div>
					<p style="font-size:0.8rem; text-transform:uppercase; color:#777; margin:0 0 5px 0; font-weight:600;"><?php esc_html_e( 'Delivered & Paid', 'aiman-collection' ); ?></p>
					<h3 id="statCompletedOrdersPage" style="font-size:1.6rem; color:#0f766e; margin:0; font-weight:700;">0</h3>
				</div>
				<div style="width:48px; height:48px; border-radius:10px; background:#f0fdfa; color:#0f766e; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
					<i class="fas fa-box-archive"></i>
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
							<label style="display:block; font-size:0.8rem; font-weight:600; text-transform:uppercase; margin-bottom:4px; color:#555;">Sale Amount (PKR) *</label>
							<input type="number" id="merchantSaleAmount" required min="1" placeholder="e.g. 15500" style="width:100%; padding:9px 12px; border:1px solid #ddd; border-radius:6px; font-size:0.9rem;">
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
				<table style="width:100%; border-collapse:collapse; font-size:0.88rem; text-align:left;">
					<thead>
						<tr style="border-bottom:2px solid #eee; background:#fafafa;">
							<th style="padding:10px 12px; font-weight:600; color:#555;">Date</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Rida / Libas</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Customer</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Phone</th>
							<th style="padding:10px 12px; font-weight:600; color:#555;">Amount</th>
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
			{ id: 'ORD-1091', date: '2026-09-06', productName: 'Royal Crimson Heavy Zardozi Bridal Silk Rida', customerName: 'Fatema Bhen Shabbir', phone: '03452281923', amount: 15500, paymentMethod: 'Cash on Delivery (COD)', status: 'Delivered & Paid' },
			{ id: 'ORD-1090', date: '2026-09-05', productName: 'Pastel Mint Chiffon Dupatta Summer Cotton Pret', customerName: 'Sakina Bhen Burhanuddin', phone: '03332194821', amount: 4850, paymentMethod: 'Meezan Raast', status: 'Delivered & Paid' },
			{ id: 'ORD-1089', date: '2026-09-04', productName: 'Handcrafted Gold Zardozi Matching Bridal Batwa', customerName: 'Zainab Bhen Mustafa', phone: '03219984723', amount: 2450, paymentMethod: 'EasyPaisa', status: 'Dispatched TCS' }
		];
	}

	function renderSalesPage() {
		const sales = getSales();
		const tbody = document.getElementById('merchantLedgerTableBody');
		if (!tbody) return;

		let totalRev = 0;
		let pending = 0;
		let completed = 0;

		tbody.innerHTML = '';
		if (sales.length === 0) {
			tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:#999;">No sales recorded yet. Use the form above to record sold ridas.</td></tr>';
		} else {
			sales.forEach((s, idx) => {
				totalRev += Number(s.amount) || 0;
				if (s.status.includes('Stitching') || s.status.includes('Dispatched')) pending++;
				if (s.status.includes('Delivered')) completed++;

				const tr = document.createElement('tr');
				tr.style.borderBottom = '1px solid #f0f0f0';
				
				let statusColor = '#16a34a';
				let statusBg = '#f0fdf4';
				if (s.status.includes('Stitching')) { statusColor = '#f59e0b'; statusBg = '#fffbeb'; }
				else if (s.status.includes('Dispatched')) { statusColor = '#2563eb'; statusBg = '#eff6ff'; }

				tr.innerHTML = `
					<td style="padding:10px 12px; color:#777; font-size:0.84rem;">${s.date || 'Today'}</td>
					<td style="padding:10px 12px; font-weight:600; color:#111;">${s.productName}</td>
					<td style="padding:10px 12px;">${s.customerName}</td>
					<td style="padding:10px 12px; font-size:0.84rem; color:#555;">${s.phone || '—'}</td>
					<td style="padding:10px 12px; font-weight:700; color:#16a34a;">Rs. ${(Number(s.amount)||0).toLocaleString()}</td>
					<td style="padding:10px 12px; font-size:0.84rem;">${s.paymentMethod || 'COD'}</td>
					<td style="padding:10px 12px;">
						<span style="background:${statusBg}; color:${statusColor}; padding:3px 10px; border-radius:15px; font-size:0.78rem; font-weight:600;">
							${s.status}
						</span>
					</td>
					<td style="padding:10px 12px;">
						<button type="button" onclick="deleteMerchantSale(${idx})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.85rem;" title="Delete Record">
							<i class="fas fa-trash-alt"></i>
						</button>
					</td>
				`;
				tbody.appendChild(tr);
			});
		}

		document.getElementById('statTotalRevenuePage').textContent = 'Rs. ' + totalRev.toLocaleString();
		document.getElementById('statTotalSoldPage').textContent = sales.length;
		document.getElementById('statPendingOrdersPage').textContent = pending;
		document.getElementById('statCompletedOrdersPage').textContent = completed;
	}

	window.handleMerchantSaleSubmit = function(e) {
		e.preventDefault();
		const prod = document.getElementById('merchantSaleProduct').value.trim();
		const amt = Number(document.getElementById('merchantSaleAmount').value);
		const cust = document.getElementById('merchantSaleCustomer').value.trim();
		const phone = document.getElementById('merchantSalePhone').value.trim();
		const pay = document.getElementById('merchantSalePayment').value;
		const status = document.getElementById('merchantSaleStatus').value;

		if (!prod || !amt || !cust) return;

		const sales = getSales();
		sales.unshift({
			id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
			date: new Date().toISOString().split('T')[0],
			productName: prod,
			customerName: cust,
			phone: phone,
			amount: amt,
			paymentMethod: pay,
			status: status
		});

		localStorage.setItem('aiman_sales', JSON.stringify(sales));
		e.target.reset();
		renderSalesPage();
		alert('Sale successfully recorded to Atelier Ledger!');
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
		let csv = 'ID,Date,Product,Customer,Phone,Amount,Payment,Status\n';
		sales.forEach(s => {
			csv += `"${s.id}","${s.date}","${s.productName.replace(/"/g, '""')}","${s.customerName.replace(/"/g, '""')}","${s.phone}","${s.amount}","${s.paymentMethod}","${s.status}"\n`;
		});
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `Aiman_Sales_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	document.addEventListener('DOMContentLoaded', renderSalesPage);
	renderSalesPage();
})();
</script>

<?php get_footer(); ?>
