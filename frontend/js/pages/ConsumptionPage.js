/* ============================================================
   MODULE: FEATURE — ECO CONSUMPTION DASHBOARD
   ConsumptionPage.js — self-contained module
   Connects to: GET /api/sensors/history?deviceId=farm_001&limit=24
                GET /api/sensors/latest?deviceId=farm_001
   Export: { render, init }
   ============================================================ */

import { AppState } from '../store.js';

/* ── CONSTANTS ────────────────────────────────────────────── */
// Adjust BASE_URL to match your backend deployment
const BASE_URL = 'http://localhost:3000';

// Power consumption constants (adjust based on your actual hardware specs)
const WATTS_LIGHT        = 45;   // LED grow light per hour (W)
const WATTS_PUMP_WATER   = 10;   // Water pump per activation (W)
const WATTS_FAN          = 20;   // Cooling fan per hour (W)
const ML_PER_WATERING    = 250;  // mL dispensed per watering activation

// Malaysia electricity tariff (TNB domestic rate)
const RM_PER_KWH = 0.218;

/* ── RENDER ── returns HTML string (called by FeaturePage.js) */
export function render() {
  return `
    <div id="consumptionRoot" style="padding:16px; min-height:100%; background:#F0F4F8; color:#1A2B3C;">

      <!-- ── LOADING STATE ── -->
      <div id="con-loading" style="text-align:center; padding:40px 0;">
        <div style="font-size:2rem; animation:spin 1s linear infinite; display:inline-block;">⚙️</div>
        <div style="margin-top:8px; color:#64748B; font-size:0.85rem;">Fetching farm data…</div>
      </div>

      <!-- ── MAIN CONTENT (hidden until data loads) ── -->
      <div id="con-content" style="display:none;">

        <!-- ECO RATING HERO -->
        <div id="con-hero" style="
          background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%);
          border-radius:24px; padding:24px; text-align:center; margin-bottom:16px;
          position:relative; overflow:hidden;
          box-shadow: 0 4px 24px rgba(45,106,79,0.25);
        ">
          <div style="position:absolute;top:-20px;right:-20px;font-size:5rem;opacity:0.12;">🌱</div>
          <div id="con-grade" style="font-size:3rem; font-weight:900; color:#D8F3DC; line-height:1;">A+</div>
          <div style="color:#B7E4C7; font-size:0.85rem; margin-top:4px;">Eco Efficiency Rating</div>
          <div id="con-grade-note" style="font-size:0.75rem; color:#95D5B2; margin-top:8px;">
            Your farm is operating in the top efficiency range.
          </div>
        </div>

        <!-- KPI CARDS GRID -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
          <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div style="font-size:1.4rem;">💧</div>
            <div id="con-water-today" style="font-size:1.5rem; font-weight:700; color:#2563EB; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem;">Water Used Today</div>
            <div id="con-water-vs" style="color:#16A34A; font-size:0.7rem; margin-top:4px;"></div>
          </div>
          <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div style="font-size:1.4rem;">⚡</div>
            <div id="con-energy-today" style="font-size:1.5rem; font-weight:700; color:#D97706; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem;">Energy Used Today</div>
            <div id="con-energy-vs" style="color:#16A34A; font-size:0.7rem; margin-top:4px;"></div>
          </div>
          <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div style="font-size:1.4rem;">🌿</div>
            <div id="con-co2" style="font-size:1.5rem; font-weight:700; color:#16A34A; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem;">CO₂ Saved (vs. soil farm)</div>
          </div>
          <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div style="font-size:1.4rem;">💰</div>
            <div id="con-cost" style="font-size:1.5rem; font-weight:700; color:#B45309; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem;">Utility Cost Today</div>
          </div>
        </div>

     <!-- WATER USAGE CHART -->
<div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
  <div style="color:#2563EB; font-weight:600; margin-bottom:12px;">💧 Water Usage (last 24 readings)</div>
  <div style="position:relative; width:100%; height:220px;">
    <canvas id="con-water-chart" style="position:absolute; top:0; left:0; width:100% !important; height:100% !important;"></canvas>
  </div>
</div>

<!-- ENERGY USAGE CHART -->
<div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
  <div style="color:#D97706; font-weight:600; margin-bottom:12px;">⚡ Energy Usage (last 24 readings)</div>
  <div style="position:relative; width:100%; height:160px;">
    <canvas id="con-energy-chart" style="position:absolute; top:0; left:0; width:100% !important; height:100% !important;"></canvas>
  </div>
</div>

        <!-- RESOURCE BREAKDOWN TABLE -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#1A2B3C; font-weight:600; margin-bottom:12px;">📊 Resource Breakdown</div>
          <div id="con-breakdown" style="display:flex; flex-direction:column; gap:10px;">
            <!-- Populated by JS -->
          </div>
        </div>

        <!-- AI TIPS (dynamic) -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#1A2B3C; font-weight:600; margin-bottom:12px;">🤖 AI Eco Tips</div>
          <div id="con-ai-tips" style="display:flex; flex-direction:column; gap:8px;">
            <!-- Populated by JS based on real sensor data -->
          </div>
        </div>

        <!-- LAST UPDATED -->
        <div id="con-last-updated" style="text-align:center; color:#94A3B8; font-size:0.7rem; margin-top:12px; padding-bottom:16px;"></div>

      </div><!-- end #con-content -->

      <!-- ERROR STATE -->
      <div id="con-error" style="display:none; text-align:center; padding:40px 16px;">
        <div style="font-size:2rem;">⚠️</div>
        <div style="color:#DC2626; margin-top:8px; font-size:0.9rem;">Could not connect to backend.</div>
        <div style="color:#64748B; font-size:0.75rem; margin-top:4px;">Using simulated data for demo.</div>
        <button id="con-retry-btn" style="
          margin-top:16px; padding:8px 20px;
          background:#EFF6FF; color:#2563EB;
          border:1px solid #BFDBFE; border-radius:12px; cursor:pointer;
          font-weight:600;
        ">🔄 Retry</button>
      </div>

    </div>
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
      .con-progress-track {
        background: #E2E8F0;
        border-radius: 100px;
        height: 8px;
        flex: 1;
        overflow: hidden;
      }
      .con-progress-fill {
        height: 100%;
        border-radius: 100px;
        transition: width 0.6s ease;
      }
    </style>
  `;
}

/* ── INIT — called after render() HTML is in DOM ── */
export async function init() {
  // Retry button
  document.getElementById('con-retry-btn')?.addEventListener('click', () => _loadData());
  await _loadData();
}

/* ── PRIVATE: LOAD DATA ── */
async function _loadData() {
  _showState('loading');

  try {
    // Attempt to fetch real backend data
    const deviceId = AppState.currentFarmId || 'farm_001';
    const [historyRes, latestRes] = await Promise.all([
      //fetch(`${BASE_URL}/api/sensors/history?deviceId=${deviceId}&limit=24`), 
      //fetch(`${BASE_URL}/api/sensors/latest?deviceId=${deviceId}`)  ,          
     fetch(`${BASE_URL}/api/sensors/history?deviceId=farm_001&limit=24`),
     fetch(`${BASE_URL}/api/sensors/latest?deviceId=farm_001`)
    ]);

    if (!historyRes.ok || !latestRes.ok) throw new Error('API error');

    const historyData = await historyRes.json();
    const latestData  = await latestRes.json();

    const readings = historyData.readings || [];
    const latest   = latestData.reading || null;

    if (readings.length === 0) {
      // No real data yet — use mock data for Demo
      _renderWithData(_mockReadings(), true);
    } else {
      _renderWithData(readings, false, latest);
    }

  } catch (err) {
    console.warn('[ConsumptionPage] Backend unreachable, using mock data for demo:', err.message);
    // DEMO MODE: use simulated data so the page still looks great
    _renderWithData(_mockReadings(), true);
  }
}

/* ── PRIVATE: RENDER WITH DATA ── */
function _renderWithData(readings, isMock = false, latest = null) {
  _showState('content');

  // ── Step 1: Calculate metrics from sensor readings ──
  const metrics = _calculateMetrics(readings);

  // ── Step 2: Update KPI cards ──
  _el('con-water-today').textContent  = `${metrics.waterLiters.toFixed(1)} L`;
  _el('con-energy-today').textContent = `${metrics.energyKwh.toFixed(2)} kWh`;
  _el('con-co2').textContent          = `${metrics.co2Saved.toFixed(2)} kg`;
  _el('con-cost').textContent         = `RM ${metrics.costRm.toFixed(2)}`;

  // vs baseline comparison (traditional farm uses ~60L water & ~20kWh per day)
  const waterSavePct  = Math.round((1 - metrics.waterLiters / 60)  * 100);
  const energySavePct = Math.round((1 - metrics.energyKwh / 20) * 100);
  if (waterSavePct > 0)  _el('con-water-vs').textContent  = `↓ ${waterSavePct}% vs traditional farming`;
  if (energySavePct > 0) _el('con-energy-vs').textContent = `↓ ${energySavePct}% vs traditional farming`;

  // ── Step 3: Eco grade ──
  const grade = _calcGrade(metrics);
  _el('con-grade').textContent      = grade.letter;
  _el('con-grade').style.color      = grade.color;
  _el('con-grade-note').textContent = grade.note;

  // ── Step 4: Render charts ──
  _renderCharts(readings);

  // ── Step 5: Resource breakdown bars ──
  _renderBreakdown(metrics);

  // ── Step 6: AI Tips (logic-driven, based on actual data) ──
  _renderAiTips(readings, latest, metrics);

  // ── Step 7: Last updated timestamp ──
  const latestTimestamp = readings[0]?.createdAt || readings[0]?.timestamp || new Date();
  _el('con-last-updated').textContent =
    `${isMock ? '⚡ Demo mode · ' : ''}Last updated: ${new Date(latestTimestamp).toLocaleString('en-MY')}`;
}

/* ── PRIVATE: CALCULATE METRICS from raw sensor readings ── */
function _calculateMetrics(readings) {
  let waterActivations = 0;
  let lightHours       = 0;
  let fanHours         = 0;
  let lowLightCount    = 0;

  readings.forEach((r, i) => {
    // Count how many watering activations happened (soil moisture low)
    // soilRaw < 1800 means dry (from sensorService.js logic)
    const soilRaw = r.soilRaw ?? r.soilMoisture ?? 1900;
    if (soilRaw < 1800) waterActivations++;

    // Count intervals where grow light was likely ON (lightRaw < 1500 = dark)
    const lightRaw = r.lightRaw ?? r.light ?? 2000;
    if (lightRaw < 1500) { lightHours += 1; lowLightCount++; }

    // Count intervals where fan was ON (temperature > 28°C)
    const temp = r.temperature ?? 25;
    if (temp > 28) fanHours += 1;
  });

  // Water: each activation = ML_PER_WATERING mL
  const waterLiters = (waterActivations * ML_PER_WATERING) / 1000;

  // Energy: (lightHours * 45W) + (fanHours * 20W) + (waterActivations * 10Wh) → kWh
  const energyWh  = (lightHours * WATTS_LIGHT) + (fanHours * WATTS_FAN) + (waterActivations * WATTS_PUMP_WATER);
  const energyKwh = energyWh / 1000;

  // Cost: RM per kWh (TNB rate)
  const costRm = energyKwh * RM_PER_KWH;

  // CO2 saved: traditional soil farm uses ~0.5kg CO2 per litre of water pumped from river
  const co2Saved = (60 - waterLiters) * 0.035; // rough estimate vs conventional

  return {
    waterLiters: Math.max(waterLiters, 0.5), // at least 0.5L shown
    energyKwh:   Math.max(energyKwh, 0.1),
    costRm:      Math.max(costRm, 0.02),
    co2Saved:    Math.max(co2Saved, 0.5),
    lightHours,
    fanHours,
    waterActivations,
    lowLightCount,
    totalReadings: readings.length,
  };
}

/* ── PRIVATE: CALC ECO GRADE ── */
function _calcGrade(metrics) {
  const score = (
    (metrics.waterLiters < 5  ? 40 : metrics.waterLiters < 15 ? 25 : 10) +
    (metrics.energyKwh < 1    ? 40 : metrics.energyKwh < 3    ? 25 : 10) +
    (metrics.costRm < 0.5     ? 20 : metrics.costRm < 1       ? 10 : 5)
  );

  if (score >= 90) return { letter:'A+', color:'#00FF88', note:'Outstanding! Your farm is ultra-efficient.' };
  if (score >= 75) return { letter:'A',  color:'#4ADE80', note:'Excellent efficiency. Minor tweaks possible.' };
  if (score >= 55) return { letter:'B',  color:'#FFD966', note:'Good efficiency. Some room to optimise.' };
  if (score >= 35) return { letter:'C',  color:'#FB923C', note:'Average. Consider AI-driven scheduling.' };
  return              { letter:'D',  color:'#F87171', note:'High consumption detected. Review alerts.' };
}

/* ── PRIVATE: RENDER CHARTS (Chart.js, lazy-loaded from CDN) ── */
async function _renderCharts(readings) {
  if (!window.Chart) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // ── 不 reverse，直接用原本順序（舊→新，左→右）──
  const labels = readings.map((r, i) => {
    const d = new Date(r.createdAt || r.timestamp || Date.now() - (readings.length - i) * 3600000);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  });

  const waterData  = readings.map(r => r.waterLevel ?? r.waterDistanceCm ?? 70);
  const energyData = readings.map(r => {
    const lightRaw = r.lightRaw ?? r.light ?? 2000;
    const temp     = r.temperature ?? 25;
    return ((lightRaw < 1500 ? WATTS_LIGHT : 0) + (temp > 28 ? WATTS_FAN : 0)) / 10;
  });

  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    layout: { padding: { top: 8, bottom: 0, left: 0, right: 0 } },
    scales: {
      x: {
        ticks: { color: '#94A3B8', font: { size: 9 }, maxRotation: 45, minRotation: 45 },
        grid:  { color: '#F1F5F9' },
        border: { color: '#E2E8F0' }
      },
      y: {
        ticks: { color: '#94A3B8', font: { size: 9 } },
        grid:  { color: '#F1F5F9' },
        border: { color: '#E2E8F0' }
      }
    }
  };

  // Water chart
  const wCtx = document.getElementById('con-water-chart');
  if (wCtx) {
    if (wCtx._chart) wCtx._chart.destroy();
    wCtx._chart = new window.Chart(wCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: waterData,
          borderColor: '#2563EB',
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return 'rgba(37,99,235,0.08)';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(37,99,235,0.18)');
            gradient.addColorStop(1, 'rgba(37,99,235,0.01)');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
          pointBackgroundColor: '#2563EB',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          borderWidth: 2,
        }]
      },
      options: { ...chartDefaults }
    });
  }

  // Energy chart — 加深顏色
  const eCtx = document.getElementById('con-energy-chart');
  if (eCtx) {
    if (eCtx._chart) eCtx._chart.destroy();
    eCtx._chart = new window.Chart(eCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: energyData,
          backgroundColor: energyData.map(v => v > 5 ? 'rgba(217,119,6,0.85)' : 'rgba(217,119,6,0.5)'),
          borderColor: energyData.map(v => v > 5 ? '#92400E' : '#B45309'),
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: { ...chartDefaults }
    });
  }
}

/* ── PRIVATE: RESOURCE BREAKDOWN BARS ── */
function _renderBreakdown(metrics) {
  const items = [
    { label:'💧 Water Pump',  value: metrics.waterActivations, unit:'activations', pct: metrics.waterActivations / Math.max(metrics.totalReadings, 1) * 100, color:'#2563EB' },
    { label:'💡 Grow Lights', value: metrics.lightHours,       unit:'hrs ON',      pct: metrics.lightHours / Math.max(metrics.totalReadings, 1) * 100,       color:'#D97706' },
    { label:'🌀 Cooling Fan', value: metrics.fanHours,         unit:'hrs ON',      pct: metrics.fanHours / Math.max(metrics.totalReadings, 1) * 100,         color:'#16A34A' },
  ];

  _el('con-breakdown').innerHTML = items.map(item => `
    <div>
      <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.8rem;">
        <span style="color:#374151; font-weight:500;">${item.label}</span>
        <span style="color:#1A2B3C; font-weight:700;">${item.value} ${item.unit}</span>
      </div>
      <div class="con-progress-track">
        <div class="con-progress-fill" style="width:${Math.min(item.pct, 100).toFixed(1)}%; background:${item.color};"></div>
      </div>
    </div>
  `).join('');
}

/* ── PRIVATE: AI TIPS (data-driven, not hardcoded) ── */
function _renderAiTips(readings, latest, metrics) {
  const tips = [];

  // Tip based on light usage
  if (metrics.lightHours > metrics.totalReadings * 0.6) {
    const savings = (metrics.lightHours * 0.5 * WATTS_LIGHT / 1000 * RM_PER_KWH).toFixed(2);
    tips.push({
      icon:'💡',
      title:'Reduce grow light duration',
      desc:`Lights were ON for ${metrics.lightHours} intervals. Reducing by 2h/day saves ≈ RM ${savings}/day.`,
      color:'#FFD966'
    });
  }

  // Tip based on watering frequency
  if (metrics.waterActivations > 8) {
    const waterSaved = ((metrics.waterActivations - 6) * ML_PER_WATERING / 1000).toFixed(1);
    tips.push({
      icon:'💧',
      title:'Batch your watering cycles',
      desc:`${metrics.waterActivations} watering events detected. Consolidating to 6 cycles saves ≈ ${waterSaved} L/day.`,
      color:'#60A5FA'
    });
  }

  // Tip based on pH (from latest reading)
  const latestPh = latest?.ph ?? readings[0]?.ph;
  if (latestPh && (latestPh < 5.8 || latestPh > 6.5)) {
    tips.push({
      icon:'🧪',
      title:`pH imbalance detected (${latestPh.toFixed(1)})`,
      desc:`Optimal range is 5.8–6.5. Out-of-range pH reduces nutrient uptake efficiency by up to 30%.`,
      color:'#F87171'
    });
  }

  // Tip based on temperature (fan usage)
  if (metrics.fanHours > metrics.totalReadings * 0.4) {
    tips.push({
      icon:'🌡️',
      title:'High temperature periods detected',
      desc:`Fan was active ${metrics.fanHours} intervals. Check ventilation or adjust light schedule to avoid heat buildup.`,
      color:'#FB923C'
    });
  }

  // Default tip if all is well
  if (tips.length === 0) {
    tips.push({
      icon:'✅',
      title:'Your farm is running efficiently!',
      desc:'All consumption metrics are within optimal range. Keep up the good work.',
      color:'#4ADE80'
    });
  }

_el('con-ai-tips').innerHTML = tips.map(t => `
    <div style="
      background:#F8FAFC; border-left:3px solid ${t.color};
      border-radius:0 12px 12px 0; padding:12px;
      border-top: 1px solid #F1F5F9;
      border-right: 1px solid #F1F5F9;
      border-bottom: 1px solid #F1F5F9;
    ">
      <div style="font-weight:600; color:${t.color}; font-size:0.85rem;">${t.icon} ${t.title}</div>
      <div style="color:#475569; font-size:0.78rem; margin-top:4px; line-height:1.4;">${t.desc}</div>
    </div>
  `).join('');
}

/* ── PRIVATE: MOCK DATA for Demo / fallback ── */
function _mockReadings() {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    deviceId: 'farm_001',
    temperature:  22 + Math.sin(i / 4) * 4 + Math.random() * 2,
    humidity:     60 + Math.random() * 15,
    soilRaw:      1600 + Math.floor(Math.random() * 600),  // some below 1800 = watering triggered
    ph:           5.9 + Math.random() * 0.8,
    lightRaw:     800 + Math.floor(Math.random() * 1200),  // some below 1500 = light ON
    waterLevel:   70 + Math.floor(Math.random() * 20),
    gasRaw:       800 + Math.floor(Math.random() * 300),
    createdAt:    new Date(now - (23 - i) * 3600 * 1000).toISOString(),
  }));
}

/* ── PRIVATE HELPERS ── */
function _el(id) { return document.getElementById(id); }

function _showState(state) {
  const loading = _el('con-loading');
  const content = _el('con-content');
  const error   = _el('con-error');
  if (loading) loading.style.display = state === 'loading' ? 'block' : 'none';
  if (content) content.style.display = state === 'content' ? 'block' : 'none';
  if (error)   error.style.display   = state === 'error'   ? 'block' : 'none';
}