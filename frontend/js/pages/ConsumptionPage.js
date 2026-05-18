/* ============================================================
   MODULE: FEATURE — ECO CONSUMPTION DASHBOARD
   ConsumptionPage.js — Connects to Backend AI Route (Light Theme)
   ============================================================ */

import { AppState } from '../store.js';

/* ── CONSTANTS ────────────────────────────────────────────── */
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

const WATTS_LIGHT      = 45;
const WATTS_PUMP_WATER = 10;
const WATTS_FAN        = 20;
const ML_PER_WATERING  = 250;
const RM_PER_KWH       = 0.218;

/* ── RENDER ── */
export function render() {
  return `
    <div id="consumptionRoot" style="padding:16px; min-height:100%; background:#F8FAFC; color:#0F172A; font-family: 'Inter', system-ui, sans-serif;">

      <div id="con-loading" style="text-align:center; padding:40px 0;">
        <div style="font-size:2rem; animation:spin 1s linear infinite; display:inline-block;">⚙️</div>
        <div style="margin-top:8px; color:#64748B; font-size:0.85rem;">Fetching farm data…</div>
      </div>

      <div id="con-content" style="display:none;">

        <div id="con-hero" style="
          background: linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%);
          border: 1px solid #BBF7D0;
          border-radius:24px; padding:24px; text-align:center; margin-bottom:16px; position:relative; overflow:hidden;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.08);
        ">
          <div style="position:absolute;top:-20px;right:-20px;font-size:5rem;opacity:0.15;">🌱</div>
          <div id="con-grade" style="font-size:3.5rem; font-weight:900; color:#16A34A; line-height:1;">A+</div>
          <div style="color:#15803D; font-size:0.85rem; font-weight:600; margin-top:6px;">Eco Efficiency Rating</div>
          <div id="con-grade-note" style="font-size:0.75rem; color:#166534; margin-top:8px;">Analyzing efficiency...</div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
          <div class="card" style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:1.4rem;">💧</div>
            <div id="con-water-today" style="font-size:1.5rem; font-weight:800; color:#2563EB; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem; font-weight:500;">Water Used Today</div>
            <div id="con-water-vs" style="color:#16A34A; font-weight:600; font-size:0.7rem; margin-top:4px;"></div>
          </div>
          <div class="card" style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:1.4rem;">⚡</div>
            <div id="con-energy-today" style="font-size:1.5rem; font-weight:800; color:#D97706; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem; font-weight:500;">Energy Used Today</div>
            <div id="con-energy-vs" style="color:#16A34A; font-weight:600; font-size:0.7rem; margin-top:4px;"></div>
          </div>
          <div class="card" style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:1.4rem;">🌿</div>
            <div id="con-co2" style="font-size:1.5rem; font-weight:800; color:#16A34A; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem; font-weight:500;">CO₂ Saved (vs. soil)</div>
          </div>
          <div class="card" style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div style="font-size:1.4rem;">💰</div>
            <div id="con-cost" style="font-size:1.5rem; font-weight:800; color:#DC2626; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem; font-weight:500;">Utility Cost Today</div>
          </div>
        </div>

        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
             <div style="color:#1E293B; font-weight:700;">💧 Water Level Status</div>
             <div id="ideal-zone-badge" style="display:none; font-size:0.65rem; background:#DCFCE7; color:#15803D; padding:4px 8px; border-radius:12px; font-weight:700; border:1px solid #BBF7D0;"></div>
          </div>
          <div style="position:relative; width:100%; height:220px;">
            <canvas id="con-water-chart" style="position:absolute; top:0; left:0; width:100% !important; height:100% !important;"></canvas>
          </div>
        </div>

        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="color:#1E293B; font-weight:700; margin-bottom:12px;">⚡ Energy Usage (last 24h)</div>
          <div style="position:relative; width:100%; height:160px;">
            <canvas id="con-energy-chart" style="position:absolute; top:0; left:0; width:100% !important; height:100% !important;"></canvas>
          </div>
        </div>

        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <div style="color:#1E293B; font-weight:700;">🌾 vs Traditional Farming</div>
            <span style="font-size:0.65rem;color:#64748B;font-weight:600; background:#F1F5F9; padding:2px 8px; border-radius:8px;">FAO/USDA Benchmark</span>
          </div>

          <div id="con-monthly-savings" style="
            background:linear-gradient(135deg, #F0FDF4, #EFF6FF); border-radius:12px; padding:16px; margin-top:12px; margin-bottom:12px;
            border:1px solid #BBF7D0; display:none;
          "></div>

          <div id="con-trad-ai" style="
            background:#F8FAFC; border-left:4px solid #2563EB; border-radius:8px; padding:14px;
            border-top:1px solid #E2E8F0; border-right:1px solid #E2E8F0; border-bottom:1px solid #E2E8F0;
          ">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span style="font-size:1.1rem;">🤖</span>
              <span style="font-weight:700;color:#1E293B;font-size:0.85rem;">AI Sustainability Insight</span>
              <div id="con-trad-spinner" style="width:14px;height:14px;border:2px solid #BFDBFE; border-top-color:#2563EB;border-radius:50%; animation:spin 0.8s linear infinite;"></div>
            </div>
            <div id="con-trad-text" style="color:#475569;font-size:0.8rem;line-height:1.6;">
              Requesting agricultural analysis from backend...
            </div>
          </div>
        </div>

        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="color:#1E293B; font-weight:700; margin-bottom:12px;">📊 Equipment Usage</div>
          <div id="con-breakdown" style="display:flex; flex-direction:column; gap:12px;"></div>
        </div>

        <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="color:#1E293B; font-weight:700; margin-bottom:12px;">💡 AI Eco Tips</div>
          <div id="con-ai-tips" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>

        <div id="con-last-updated" style="text-align:center; color:#94A3B8; font-size:0.7rem; margin-top:12px; padding-bottom:16px; font-weight:500;"></div>

      </div>

      <div id="con-error" style="display:none; text-align:center; padding:40px 16px;">
        <div style="font-size:2.5rem;">⚠️</div>
        <div style="color:#DC2626; font-weight:700; margin-top:12px; font-size:1rem;">Could not connect to backend.</div>
        <div style="color:#64748B; font-size:0.8rem; margin-top:4px;">Using simulated data for demo.</div>
        <button id="con-retry-btn" style="margin-top:20px; padding:10px 24px; background:#EFF6FF; color:#2563EB; border:1px solid #BFDBFE; border-radius:12px; font-weight:600; cursor:pointer;">🔄 Retry Connection</button>
      </div>

    </div>
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
      .con-progress-track { background: #F1F5F9; border-radius: 100px; height: 8px; flex: 1; overflow: hidden; }
      .con-progress-fill { height: 100%; border-radius: 100px; transition: width 0.6s ease; }
    </style>
  `;
}

/* ── INIT ── */
export async function init() {
  document.getElementById('con-retry-btn')?.addEventListener('click', () => _loadData());
  await _loadData();
}

/* ── LOAD DATA ── */
async function _loadData() {
  _showState('loading');
  try {
    const deviceId = AppState.currentFarmId || 'farm_001';
    const [historyRes, latestRes] = await Promise.all([
      fetch(`${BASE_URL}/api/sensors/history?deviceId=${deviceId}&limit=24`),
      fetch(`${BASE_URL}/api/sensors/latest?deviceId=${deviceId}`)
    ]);
    if (!historyRes.ok) throw new Error('API error');
    
    const historyData = await historyRes.json();
    const readings = historyData.readings || [];
    
    if (readings.length === 0) {
      _processData(_mockReadings());
    } else {
      _processData(readings);
    }
  } catch (err) {
    console.warn('[ConsumptionPage] Backend unreachable, using mock data:', err);
    _processData(_mockReadings()); // Fallback demo
  }
}

/* ── PROCESS & RENDER DATA ── */
async function _processData(readings) {
  _showState('content');
  const metrics = _calculateMetrics(readings);

  _el('con-water-today').textContent  = `${metrics.waterLiters.toFixed(1)} L`;
  _el('con-energy-today').textContent = `${metrics.energyKwh.toFixed(2)} kWh`;
  _el('con-co2').textContent          = `${metrics.co2Saved.toFixed(2)} kg`;
  _el('con-cost').textContent         = `RM ${metrics.costRm.toFixed(2)}`;

  _renderBreakdown(metrics);
  _renderAiTips(readings, null, metrics);

  await _fetchBackendAnalysis(metrics, readings);

  const ts = readings[0]?.createdAt || readings[0]?.timestamp || new Date();
  _el('con-last-updated').textContent = `Last updated: ${new Date(ts).toLocaleString('en-MY')}`;
}

/* ── NEW BACKEND RAG ROUTE ── */
async function _fetchBackendAnalysis(metrics, readings) {
  const farm = AppState.currentFarm;
  const plants = farm?.plants ? farm.plants.map(p => p.name || p.type) : ['lettuce'];

  try {
    const res = await fetch(`${BASE_URL}/api/consumption/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plants, metrics })
    });
    
    if (!res.ok) throw new Error('Backend route failed');
    const data = await res.json();
    
    // 1. Update UI from Rule-Based Summary
    const summary = data.ruleBasedSummary;
    _el('con-water-vs').textContent  = `↓ ${summary.waterSavePct}% vs traditional`;
    _el('con-co2').textContent       = `${summary.waterSavedL} L saved`; 
    
    // Light theme optimized Grade Colors
    const gradeMap = {
      'excellent': { l: 'A+', c: '#16A34A', n: 'Ultra-efficient water usage.' },
      'good':      { l: 'A',  c: '#2563EB', n: 'Great efficiency, performing well.' },
      'average':   { l: 'B',  c: '#D97706', n: 'Average consumption, room to optimize.' },
      'above_target': { l: 'C', c: '#DC2626', n: 'High consumption detected.' }
    };
    const grade = gradeMap[summary.waterStatus] || gradeMap['good'];
    _el('con-grade').textContent = grade.l;
    _el('con-grade').style.color = grade.c;
    _el('con-grade-note').textContent = grade.n;
    _el('con-grade-note').style.color = grade.c;

    // 2. Update Monthly Savings
    if (summary.monthlySavingsL > 0) {
      const mSavEl = _el('con-monthly-savings');
      mSavEl.style.display = 'block';
      mSavEl.innerHTML = `
        <div style="font-size:0.7rem;font-weight:800;color:#15803D;letter-spacing:0.08em;margin-bottom:12px;">📈 MONTHLY PROJECTION</div>
        <div style="display:flex; justify-content:space-around;">
          <div style="text-align:center;">
            <div style="font-size:1.4rem;font-weight:800;color:#2563EB;">${summary.monthlySavingsL}L</div>
            <div style="font-size:0.65rem;font-weight:600;color:#64748B;margin-top:2px;">water saved</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:1.4rem;font-weight:800;color:#16A34A;">${summary.yearlyWaterSavedL}L</div>
            <div style="font-size:0.65rem;font-weight:600;color:#64748B;margin-top:2px;">yearly projection</div>
          </div>
        </div>
      `;
    }

    // 3. Render Chart WITH Ideal Zone from backend
    _renderCharts(readings, data.idealWaterZone);

    // 4. Update AI Narrative
    _el('con-trad-spinner').style.display = 'none';
    _el('con-trad-text').textContent = data.aiNarrative;

  } catch (err) {
    console.error('Failed to get analysis:', err);
    _el('con-trad-spinner').style.display = 'none';
    _el('con-trad-text').textContent = "Failed to load AI agricultural data.";
    _renderCharts(readings, { min: 60, max: 80 }); 
  }
}

/* ── UPDATED CHART FUNCTION (Includes Ideal Zone) ── */
async function _renderCharts(readings, idealZone) {
  if (!window.Chart) {
    await new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }

  const labels = readings.map((r, i) => {
    const d = new Date(r.createdAt || r.timestamp || Date.now() - (readings.length - i) * 3600000);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  }).reverse();

  const waterData = readings.map(r => r.waterLevel ?? r.waterDistanceCm ?? 70).reverse();
  const energyData = readings.map(r => {
    const lr = r.lightRaw ?? r.light ?? 2000;
    const t  = r.temperature ?? 25;
    return ((lr < 1500 ? WATTS_LIGHT : 0) + (t > 28 ? WATTS_FAN : 0)) / 10;
  }).reverse();

  // Light theme chart configs
  const chartDefaults = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#64748B', font: { size: 9 } }, grid: { color: '#F1F5F9' }, border: { color: '#E2E8F0' } },
      y: { ticks: { color: '#64748B', font: { size: 9 } }, grid: { color: '#F1F5F9' }, border: { color: '#E2E8F0' } }
    }
  };

  // Show Ideal Badge
  if (idealZone) {
    const badge = _el('ideal-zone-badge');
    badge.style.display = 'block';
    badge.textContent = `Ideal: ${idealZone.min}% - ${idealZone.max}%`;
  }

  // Water Chart with Ideal Background
  const wCtx = document.getElementById('con-water-chart');
  if (wCtx && wCtx._chart) wCtx._chart.destroy();
  
  const datasets = [{
    label: 'Actual Water Level',
    data: waterData,
    borderColor: '#2563EB',
    backgroundColor: 'transparent',
    tension: 0.4, pointRadius: 2, borderWidth: 2, zIndex: 10
  }];

  if (idealZone) {
    datasets.push({
      label: 'Ideal Max',
      data: Array(labels.length).fill(idealZone.max),
      borderColor: 'rgba(22, 163, 74, 0.4)',
      borderDash: [5, 5], borderWidth: 1, pointRadius: 0,
      fill: '+1', // Fill down to Ideal Min
      backgroundColor: 'rgba(22, 163, 74, 0.1)'
    });
    datasets.push({
      label: 'Ideal Min',
      data: Array(labels.length).fill(idealZone.min),
      borderColor: 'rgba(22, 163, 74, 0.4)',
      borderDash: [5, 5], borderWidth: 1, pointRadius: 0, fill: false
    });
  }

  wCtx._chart = new window.Chart(wCtx, {
    type: 'line',
    data: { labels, datasets },
    options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 0, max: 100 } } }
  });

  // Energy chart
  const eCtx = document.getElementById('con-energy-chart');
  if (eCtx) {
    if (eCtx._chart) eCtx._chart.destroy();
    eCtx._chart = new window.Chart(eCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: energyData,
          backgroundColor: energyData.map(v => v > 5 ? 'rgba(217, 119, 6, 0.8)' : 'rgba(251, 191, 36, 0.6)'),
          borderColor: energyData.map(v => v > 5 ? '#D97706' : '#F59E0B'),
          borderWidth: 1, borderRadius: 4,
        }]
      },
      options: { ...chartDefaults }
    });
  }
}

/* ── HELPER METRICS ── */
function _calculateMetrics(readings) {
  let waterActivations = 0, lightHours = 0, fanHours = 0;
  readings.forEach(r => {
    if ((r.soilRaw ?? 1900) < 1800) waterActivations++;
    if ((r.lightRaw ?? 2000) < 1500) lightHours++;
    if ((r.temperature ?? 25) > 28) fanHours++;
  });

  const waterLiters = (waterActivations * ML_PER_WATERING) / 1000;
  const energyKwh = ((lightHours * WATTS_LIGHT) + (fanHours * WATTS_FAN) + (waterActivations * WATTS_PUMP_WATER)) / 1000;

  return {
    waterLiters: Math.max(waterLiters, 0.5),
    energyKwh: Math.max(energyKwh, 0.1),
    costRm: Math.max(energyKwh * RM_PER_KWH, 0.02),
    co2Saved: (60 - waterLiters) * 0.035,
    waterActivations, lightHours, fanHours, totalReadings: readings.length
  };
}

function _renderBreakdown(metrics) {
  const items = [
    { label:'💧 Water Pump',  value: metrics.waterActivations, unit:'activations', pct: metrics.waterActivations / Math.max(metrics.totalReadings, 1) * 100, color:'#2563EB' },
    { label:'💡 Grow Lights', value: metrics.lightHours,       unit:'hrs ON',      pct: metrics.lightHours        / Math.max(metrics.totalReadings, 1) * 100, color:'#F59E0B' },
    { label:'🌀 Cooling Fan', value: metrics.fanHours,         unit:'hrs ON',      pct: metrics.fanHours          / Math.max(metrics.totalReadings, 1) * 100, color:'#16A34A' },
  ];
  _el('con-breakdown').innerHTML = items.map(item => `
    <div>
      <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.8rem;">
        <span style="color:#475569; font-weight:600;">${item.label}</span>
        <span style="color:#1E293B; font-weight:800;">${item.value} ${item.unit}</span>
      </div>
      <div class="con-progress-track">
        <div class="con-progress-fill" style="width:${Math.min(item.pct, 100).toFixed(1)}%; background:${item.color};"></div>
      </div>
    </div>
  `).join('');
}

function _renderAiTips(readings, latest, metrics) {
  const tips = [];
  if (metrics.lightHours > metrics.totalReadings * 0.6) {
    const savings = (metrics.lightHours * 0.5 * WATTS_LIGHT / 1000 * RM_PER_KWH).toFixed(2);
    tips.push({ icon:'💡', title:'Reduce grow light duration', desc:`Lights were ON for ${metrics.lightHours} intervals. Reducing by 2h/day saves ≈ RM ${savings}/day.`, color:'#D97706', bg:'#FEF3C7' });
  }
  if (metrics.waterActivations > 8) {
    const ws = ((metrics.waterActivations - 6) * ML_PER_WATERING / 1000).toFixed(1);
    tips.push({ icon:'💧', title:'Batch your watering cycles', desc:`${metrics.waterActivations} watering events detected. Consolidating saves ≈ ${ws} L/day.`, color:'#2563EB', bg:'#DBEAFE' });
  }
  if (tips.length === 0) {
    tips.push({ icon:'✅', title:'Your farm is running efficiently!', desc:'All consumption metrics are optimal.', color:'#16A34A', bg:'#DCFCE7' });
  }
  _el('con-ai-tips').innerHTML = tips.map(t => `
    <div style="background:#F8FAFC; border-left:4px solid ${t.color}; border-radius:8px; padding:12px; border-top:1px solid #E2E8F0; border-right:1px solid #E2E8F0; border-bottom:1px solid #E2E8F0;">
      <div style="font-weight:700; color:#1E293B; font-size:0.85rem; display:flex; align-items:center; gap:6px;">
        <span style="background:${t.bg}; padding:4px; border-radius:6px; font-size:1rem; line-height:1;">${t.icon}</span> 
        ${t.title}
      </div>
      <div style="color:#475569; font-size:0.8rem; margin-top:6px; line-height:1.5;">${t.desc}</div>
    </div>
  `).join('');
}

function _mockReadings() {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    deviceId: 'farm_001', temperature: 22 + Math.random() * 5,
    soilRaw: 1600 + Math.floor(Math.random() * 600), lightRaw: 800 + Math.floor(Math.random() * 1200),
    waterLevel: 65 + Math.floor(Math.random() * 20), createdAt: new Date(now - (23 - i) * 3600000).toISOString()
  }));
}

function _el(id) { return document.getElementById(id); }
function _showState(state) {
  ['loading', 'content', 'error'].forEach(s => {
    const el = _el(`con-${s}`);
    if (el) el.style.display = s === state ? 'block' : 'none';
  });
}