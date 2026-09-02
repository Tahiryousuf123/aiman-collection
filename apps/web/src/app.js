// MediSync AI Web Application Router & Responsive Controller

import { apiEngine } from '/apps/api/src/api.js';

let chartInstance = null;

// Initialize app when module loads
initApp();

function initApp() {
  initMobileDrawer();
  initRouter();
  initDashboard();
  initScribeView();
  initReceptionistView();
  initBillingView();
  initPatientsView();
  initAnalyticsView();
  initSettingsView();
  initModals();

  // Subscribe to reactive API state updates
  apiEngine.subscribe(state => {
    updateDashboardUI(state);
    updatePatientsUI(state);
    updateBillingUI(state);
    updateSettingsUI(state);
  });
}

/* ==========================================================================
   0. MOBILE NAVIGATION DRAWER CONTROLLER
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  function openDrawer() {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
  }

  function closeDrawer() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   1. ROUTER & NAVIGATION
   ========================================================================== */
function initRouter() {
  const titlesMap = {
    'dashboard': 'Doctor Overview Dashboard',
    'ai-scribe': 'Progressive Ambient AI Clinical Scribe',
    'receptionist': '24/7 AI Voice & Text Receptionist',
    'billing': 'Prior Authorization & Billing Optimizer',
    'patients': 'Patient Directory & Lifecycle Journey',
    'analytics': 'Practice Analytics & Financial ROI Calculator',
    'settings': 'Admin Settings & AI Provider Abstractions'
  };

  window.switchView = function(viewName) {
    const targetView = viewName || 'dashboard';

    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('current-view-title');

    navItems.forEach(item => {
      const v = item.getAttribute('data-view');
      if (v === targetView) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    viewSections.forEach(section => {
      if (section.id === `view-${targetView}`) {
        section.classList.add('active-view');
      } else {
        section.classList.remove('active-view');
      }
    });

    if (pageTitle && titlesMap[targetView]) {
      pageTitle.textContent = titlesMap[targetView];
    }
  };

  // Delegate click events globally for any [data-view] link/button
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-view]');
    if (target) {
      e.preventDefault();
      const view = target.getAttribute('data-view');
      window.location.hash = view;
      window.switchView(view);
    }
  });

  // Handle direct hash changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) window.switchView(hash);
  });

  // Check initial URL hash
  if (window.location.hash) {
    window.switchView(window.location.hash.replace('#', ''));
  } else {
    window.switchView('dashboard');
  }
}

/* ==========================================================================
   2. DASHBOARD VIEW
   ========================================================================== */
function initDashboard() {
  updateDashboardUI(apiEngine.state);
  renderDashboardChart();
}

function updateDashboardUI(state) {
  const m = state.dashboardMetrics;
  if (!m) return;

  const elPatients = document.getElementById('val-today-patients');
  const elNotes = document.getElementById('val-notes-generated');
  const elHours = document.getElementById('val-hours-saved');
  const elAuth = document.getElementById('val-pending-auth');
  const elCalls = document.getElementById('val-missed-calls');
  const elRev = document.getElementById('val-revenue-recovered');

  if (elPatients) elPatients.textContent = m.todayPatients;
  if (elNotes) elNotes.textContent = m.aiNotesGenerated;
  if (elHours) elHours.textContent = m.hoursSavedToday;
  if (elAuth) elAuth.textContent = m.pendingPriorAuths;
  if (elCalls) elCalls.textContent = m.missedCallsHandled;
  if (elRev) elRev.textContent = `$${m.revenueRecoveredToday.toLocaleString()}`;

  renderActivityFeed();
}

function renderDashboardChart() {
  const ctx = document.getElementById('dashboardChart');
  if (!ctx) return;

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Charting Time Saved (Hours)',
          data: [2.1, 2.8, 3.4, 3.8, 4.2, 1.5, 3.8],
          borderColor: '#00f2fe',
          backgroundColor: 'rgba(0, 242, 254, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Patient Capacity Unlocked',
          data: [3, 4, 4, 5, 6, 2, 5],
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8' } }
      },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

function renderActivityFeed() {
  const container = document.getElementById('activity-feed-list');
  if (!container) return;

  const activities = apiEngine.getDashboardData().recentActivity;
  container.innerHTML = activities.map(act => `
    <div style="display: flex; gap: 12px; font-size: 12.5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
      <span style="color: var(--accent-cyan); font-size: 16px;">✨</span>
      <div>
        <div style="color: #fff; font-weight: 500;">${act.text}</div>
        <div style="color: var(--text-dim); font-size: 11px;">${act.time}</div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   3. AMBIENT AI SCRIBE VIEW
   ========================================================================== */
function initScribeView() {
  const btnRun = document.getElementById('btn-run-full-scribe');
  const btnStart = document.getElementById('btn-start-scribe');
  const selectScenario = document.getElementById('scribe-scenario-select');
  const statusLabel = document.getElementById('scribe-status-label');
  const soapDisplay = document.getElementById('soap-note-display');
  const stepItems = document.querySelectorAll('.step-item');
  const btnExport = document.getElementById('btn-export-ehr');

  let isRunning = false;

  async function startProgressiveScribe() {
    if (isRunning) return;
    isRunning = true;
    btnRun.disabled = true;
    btnRun.textContent = "Processing AI Scribe...";

    stepItems.forEach(el => {
      el.className = 'step-item';
    });

    const scenarioId = selectScenario.value;

    await apiEngine.runScribeWorkflow(scenarioId, (stepData) => {
      statusLabel.textContent = stepData.label;

      stepItems.forEach(el => {
        const stepNum = parseInt(el.getAttribute('data-step'));
        if (stepNum < stepData.step) {
          el.className = 'step-item completed-step';
        } else if (stepNum === stepData.step) {
          el.className = 'step-item active-step';
        }
      });
    });

    const scenario = apiEngine.state.scribeScenarios.find(s => s.id === scenarioId) || apiEngine.state.scribeScenarios[0];
    soapDisplay.innerHTML = `
      <div style="color: var(--accent-cyan); font-weight: 700; font-size: 14px; margin-bottom: 12px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span>SOAP CLINICAL NOTE • ${scenario.title}</span>
        <span style="color: var(--status-success);">[APPROVED FOR EHR SYNC]</span>
      </div>

      <div style="margin-bottom: 12px;"><strong style="color:#fff;">SUBJECTIVE:</strong><br>${scenario.soapNote.subjective}</div>
      <div style="margin-bottom: 12px;"><strong style="color:#fff;">OBJECTIVE:</strong><br>${scenario.soapNote.objective}</div>
      <div style="margin-bottom: 12px;"><strong style="color:#fff;">ASSESSMENT:</strong><br>${scenario.soapNote.assessment.replace(/\n/g, '<br>')}</div>
      <div style="margin-bottom: 16px;"><strong style="color:#fff;">PLAN:</strong><br>${scenario.soapNote.plan.replace(/\n/g, '<br>')}</div>

      <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 16px 0;">

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <strong style="color: var(--accent-teal);">RECOMMENDED ICD-10 CODES:</strong>
          <ul style="margin-top: 6px; padding-left: 18px;">
            ${scenario.icd10.map(i => `<li><strong>${i.code}</strong>: ${i.description} (${i.confidence})</li>`).join('')}
          </ul>
        </div>
        <div>
          <strong style="color: var(--accent-teal);">RECOMMENDED CPT BILLING CODES:</strong>
          <ul style="margin-top: 6px; padding-left: 18px;">
            ${scenario.cpt.map(c => `<li><strong>CPT ${c.code}</strong> - ${c.fee} (${c.rvu} RVUs)</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    isRunning = false;
    btnRun.disabled = false;
    btnRun.textContent = "Run AI Scribe Process";
  }

  if (btnRun) btnRun.addEventListener('click', startProgressiveScribe);
  if (btnStart) btnStart.addEventListener('click', startProgressiveScribe);

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      alert("✅ Encrypted SOAP Note, ICD-10 Codes, and CPT Billing data exported to Epic FHIR portal successfully!");
    });
  }
}

/* ==========================================================================
   4. 24/7 AI RECEPTIONIST VIEW
   ========================================================================== */
let activeFlowId = "flow_booking";
let currentStepIdx = 0;

function initReceptionistView() {
  renderFlowList();
  loadReceptionistFlow(activeFlowId);

  const btnNext = document.getElementById('btn-next-chat-step');
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentStepIdx++;
      loadReceptionistFlow(activeFlowId, currentStepIdx);
    });
  }
}

function renderFlowList() {
  const container = document.getElementById('receptionist-flow-list');
  if (!container) return;

  const flows = apiEngine.state.receptionistFlows;
  container.innerHTML = flows.map(flow => `
    <button class="btn-secondary flow-select-btn ${flow.id === activeFlowId ? 'active-flow' : ''}" data-flow="${flow.id}" style="width: 100%; text-align: left; padding: 12px 16px;">
      <div style="font-weight: 600; font-size: 13px;">${flow.title}</div>
      <div style="font-size: 11px; color: var(--text-muted); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">"${flow.patientQuery}"</div>
    </button>
  `).join('');

  document.querySelectorAll('.flow-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFlowId = btn.getAttribute('data-flow');
      currentStepIdx = 0;
      renderFlowList();
      loadReceptionistFlow(activeFlowId, currentStepIdx);
    });
  });
}

function loadReceptionistFlow(flowId, stepIndex = 0) {
  const result = apiEngine.runReceptionistStep(flowId, stepIndex);
  if (!result) return;

  const flowTitle = document.getElementById('active-flow-title');
  const chatMessages = document.getElementById('chat-messages-box');

  if (flowTitle) flowTitle.textContent = result.flow.title;

  chatMessages.innerHTML = result.visibleSteps.map(step => `
    <div class="chat-bubble ${step.sender === 'Patient' ? 'patient' : 'ai'}">
      <div style="font-size: 10px; opacity: 0.7; margin-bottom: 2px;">${step.sender}</div>
      <div>${step.text}</div>
    </div>
  `).join('');

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ==========================================================================
   5. PRIOR AUTH & BILLING VIEW
   ========================================================================== */
function initBillingView() {
  updateBillingUI(apiEngine.state);

  const btnNewPA = document.getElementById('btn-new-pa');
  if (btnNewPA) {
    btnNewPA.addEventListener('click', () => {
      apiEngine.submitPriorAuth("pat_004", "Cardiac MRI with Contrast (CPT 75561)", "Cigna Health Care");
      alert("✨ Prior Authorization request submitted to Cigna Health Care API. Real-time Approval Likelihood: 98.4%");
    });
  }
}

function updateBillingUI(state) {
  const container = document.getElementById('pa-cards-list');
  if (!container) return;

  container.innerHTML = state.priorAuths.map(pa => `
    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div style="font-weight: 700; font-size: 14px; color: #fff;">${pa.patientName} (${pa.mrn})</div>
        <span style="font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; ${pa.status === 'APPROVED' ? 'background: rgba(16,185,129,0.15); color: #10b981;' : 'background: rgba(245,158,11,0.15); color: #f59e0b;'}">${pa.status}</span>
      </div>
      <div style="font-size: 12.5px; color: var(--accent-cyan); font-weight: 600;">${pa.procedure}</div>
      <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">Payer: ${pa.payer} • AI Approval Score: <strong style="color: #10b981;">${pa.likelihoodScore}%</strong></div>
      <div style="font-size: 11px; color: var(--text-dim); margin-top: 6px;">${pa.notes}</div>
    </div>
  `).join('');
}

/* ==========================================================================
   6. PATIENT JOURNEY VIEW
   ========================================================================== */
let activePatientId = "pat_001";

function initPatientsView() {
  updatePatientsUI(apiEngine.state);

  const btnChen = document.getElementById('btn-patient-chen');
  const btnElena = document.getElementById('btn-patient-elena');

  if (btnChen) btnChen.addEventListener('click', () => { activePatientId = "pat_001"; updatePatientsUI(apiEngine.state); });
  if (btnElena) btnElena.addEventListener('click', () => { activePatientId = "pat_002"; updatePatientsUI(apiEngine.state); });
}

function updatePatientsUI(state) {
  const patient = state.patients.find(p => p.id === activePatientId) || state.patients[0];
  const progressBar = document.getElementById('journey-progress-bar');
  const nodes = document.querySelectorAll('.timeline-node');
  const detailsCard = document.getElementById('patient-details-card');

  if (progressBar) {
    const pct = Math.round((patient.journeyStep / 8) * 100);
    progressBar.style.width = `${pct}%`;
  }

  nodes.forEach(node => {
    const step = parseInt(node.getAttribute('data-step'));
    if (step <= patient.journeyStep) {
      node.classList.add('active');
    } else {
      node.classList.remove('active');
    }
  });

  if (detailsCard) {
    detailsCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <h4 style="font-size: 16px;">${patient.firstName} ${patient.lastName} (${patient.mrn})</h4>
        <span class="status-pill">${patient.insurance}</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 12.5px; color: var(--text-muted);">
        <div><strong>DOB:</strong> ${patient.dob}</div>
        <div><strong>Phone:</strong> ${patient.phone}</div>
        <div><strong>EHR Status:</strong> <span style="color: #10b981;">Connected (Epic)</span></div>
        <div><strong>Active Meds:</strong> ${patient.activeMeds.join(', ')}</div>
        <div><strong>Allergies:</strong> ${patient.allergies.join(', ')}</div>
        <div><strong>Next Appointment:</strong> ${patient.nextVisit}</div>
      </div>
    `;
  }
}

/* ==========================================================================
   7. ANALYTICS & DYNAMIC ROI CALCULATOR
   ========================================================================== */
function initAnalyticsView() {
  const sliderDoctors = document.getElementById('slider-doctors');
  const sliderPatients = document.getElementById('slider-patients');
  const sliderRate = document.getElementById('slider-rate');

  function updateROICalculation() {
    if (!sliderDoctors || !sliderPatients || !sliderRate) return;

    const docs = sliderDoctors.value;
    const pts = sliderPatients.value;
    const rate = sliderRate.value;

    document.getElementById('lbl-num-doctors').textContent = `${docs} Doctor${docs > 1 ? 's' : ''}`;
    document.getElementById('lbl-patients-day').textContent = `${pts} Patients`;
    document.getElementById('lbl-hourly-rate').textContent = `$${rate} / hr`;

    const res = apiEngine.calculateROI(docs, pts, rate);

    document.getElementById('calc-hours-saved').textContent = `${res.hoursSavedPerMonth} hrs`;
    document.getElementById('calc-net-savings').textContent = `$${res.netAnnualSavings.toLocaleString()}`;
    document.getElementById('calc-extra-capacity').textContent = `+${res.additionalPatientCapacityPerMonth} pts / mo`;
    document.getElementById('calc-roi-pct').textContent = `${res.roiPercentage.toLocaleString()}% ROI`;
  }

  if (sliderDoctors) sliderDoctors.addEventListener('input', updateROICalculation);
  if (sliderPatients) sliderPatients.addEventListener('input', updateROICalculation);
  if (sliderRate) sliderRate.addEventListener('input', updateROICalculation);

  updateROICalculation();
  renderAIInsights();
}

function renderAIInsights() {
  const container = document.getElementById('ai-insights-list');
  if (!container) return;

  const insights = apiEngine.state.aiInsights;
  container.innerHTML = insights.map(ins => `
    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="font-weight: 700; font-size: 14px; color: #fff;">${ins.metric}</span>
        <span style="color: var(--accent-cyan); font-weight: 800;">${ins.impact}</span>
      </div>
      <p style="font-size: 12.5px; color: var(--text-muted); margin-bottom: 10px;">${ins.description}</p>
      <div style="font-size: 11.5px; color: var(--status-success); background: rgba(16,185,129,0.08); padding: 8px 12px; border-radius: 6px;">
        💡 <strong>Action:</strong> ${ins.recommendation}
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   8. ADMIN SETTINGS VIEW
   ========================================================================== */
function initSettingsView() {
  updateSettingsUI(apiEngine.state);

  const selectProvider = document.getElementById('select-ai-provider');
  if (selectProvider) {
    selectProvider.addEventListener('change', (e) => {
      apiEngine.updateSettings('aiProvider', e.target.value);
    });
  }
}

function updateSettingsUI(state) {
  const boxProvider = document.getElementById('ai-provider-status-box');
  const boxEhr = document.getElementById('ehr-list-box');

  if (boxProvider) {
    const activeProvider = state.aiProviders.find(p => p.status.includes('Active')) || state.aiProviders[0];
    boxProvider.innerHTML = `
      <div style="font-weight: 700; font-size: 14px; color: var(--accent-cyan); margin-bottom: 6px;">${activeProvider.name}</div>
      <div style="font-size: 12px; color: var(--text-muted);">Status: <strong style="color: #10b981;">${activeProvider.status}</strong></div>
      <div style="font-size: 12px; color: var(--text-muted);">API Latency: <strong>${activeProvider.latency}</strong></div>
      <div style="font-size: 12px; color: var(--text-muted);">Security Standard: <strong>${activeProvider.security}</strong></div>
    `;
  }

  if (boxEhr) {
    boxEhr.innerHTML = state.ehrIntegrations.map(ehr => `
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 16px; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="font-weight: 600; font-size: 13px; color: #fff;">${ehr.name}</div>
          <div style="font-size: 11px; color: var(--text-dim);">Sync Rate: ${ehr.syncRate} • Last synced: ${ehr.lastSync}</div>
        </div>
        <span style="font-size: 11px; font-weight: 700; color: #10b981; background: rgba(16,185,129,0.1); padding: 4px 10px; border-radius: 99px;">${ehr.status}</span>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   9. MODALS
   ========================================================================== */
function initModals() {
  const modalTrial = document.getElementById('trial-modal');
  const btnStartTrial = document.getElementById('btn-start-trial');
  const btnCloseTrial = document.getElementById('btn-close-trial-modal');
  const btnSubmitTrial = document.getElementById('btn-submit-trial');

  if (btnStartTrial) {
    btnStartTrial.addEventListener('click', () => {
      if (modalTrial) modalTrial.classList.add('active-modal');
    });
  }

  if (btnCloseTrial) {
    btnCloseTrial.addEventListener('click', () => {
      if (modalTrial) modalTrial.classList.remove('active-modal');
    });
  }

  if (btnSubmitTrial) {
    btnSubmitTrial.addEventListener('click', () => {
      const docName = document.getElementById('trial-input-name').value;
      alert(`🎉 Congratulations ${docName}! Your 14-Day MediSync AI Enterprise Trial is active. EHR integration token has been generated.`);
      if (modalTrial) modalTrial.classList.remove('active-modal');
    });
  }
}
