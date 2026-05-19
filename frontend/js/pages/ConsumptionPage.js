/* ============================================================
   MODULE: FEATURE — ECO CONSUMPTION DASHBOARD
   ConsumptionPage.js — FIXED FINAL VERSION
   ============================================================ */

import { AppState } from '../store.js';

const BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

const WATTS_LIGHT = 45;
const WATTS_FAN = 20;
const WATTS_PUMP = 10;

const ML_PER_WATERING = 250;
const RM_PER_KWH = 0.218;

let _showAllPlants = false;
let _allPlantData = [];

/* ══════════════════════════════════════════════
   RENDER
══════════════════════════════════════════════ */
export function render() {
  return `
  <div id="consumptionRoot"
       style="padding:16px;min-height:100%;background:#F8FAFC;color:#0F172A;font-family:'Inter',system-ui,sans-serif;">

    <!-- LOADING -->
    <div id="con-loading" style="text-align:center;padding:60px 0;">
      <div style="font-size:2.5rem;animation:spin 1s linear infinite;display:inline-block;">⚙️</div>
      <div style="margin-top:12px;color:#64748B;font-size:0.9rem;font-weight:500;">
        Fetching farm data…
      </div>
    </div>

    <!-- CONTENT -->
    <div id="con-content" style="display:none;">

      <!-- HERO -->
      <div id="con-hero"
           style="background:linear-gradient(135deg,#DCFCE7,#F0FDF4);
                  border:1px solid #BBF7D0;
                  border-radius:24px;
                  padding:24px;
                  text-align:center;
                  margin-bottom:16px;
                  position:relative;
                  overflow:hidden;
                  box-shadow:0 4px 16px rgba(22,163,74,0.1);">

        <div style="position:absolute;top:-16px;right:-16px;font-size:5rem;opacity:0.12;">
          🌱
        </div>

        <div id="con-grade"
             style="font-size:3.5rem;font-weight:900;color:#16A34A;line-height:1;">
          —
        </div>

        <div style="color:#15803D;font-size:0.85rem;font-weight:700;margin-top:6px;">
          Eco Efficiency Rating
        </div>

        <div id="con-grade-note"
             style="font-size:0.75rem;color:#166534;margin-top:8px;">
          Calculating…
        </div>
      </div>

      <!-- KPI GRID -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">

        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;">
          <div>💧</div>
          <div id="con-water-today"
               style="font-size:1.5rem;font-weight:800;color:#2563EB;margin:4px 0;">
            —
          </div>
          <div style="color:#64748B;font-size:0.75rem;">Water Used Today</div>
          <div id="con-water-vs"
               style="color:#16A34A;font-weight:700;font-size:0.7rem;margin-top:4px;"></div>
        </div>

        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;">
          <div>⚡</div>
          <div id="con-energy-today"
               style="font-size:1.5rem;font-weight:800;color:#D97706;margin:4px 0;">
            —
          </div>
          <div style="color:#64748B;font-size:0.75rem;">Energy Used Today</div>
          <div id="con-energy-vs"
               style="color:#16A34A;font-weight:700;font-size:0.7rem;margin-top:4px;"></div>
        </div>

        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;">
          <div>🌿</div>
          <div id="con-co2"
               style="font-size:1.5rem;font-weight:800;color:#16A34A;margin:4px 0;">
            —
          </div>
          <div style="color:#64748B;font-size:0.75rem;">CO₂ Offset Today</div>
        </div>

        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;">
          <div>💰</div>
          <div id="con-cost-saved"
               style="font-size:1.5rem;font-weight:800;color:#16A34A;margin:4px 0;">
            —
          </div>
          <div style="color:#64748B;font-size:0.75rem;">Saved vs Traditional</div>
          <div id="con-cost-sub"
               style="color:#64748B;font-size:0.65rem;margin-top:2px;"></div>
        </div>

      </div>

      <!-- WATER CHART -->
      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div style="font-weight:700;">💧 Water Level — Real vs Ideal</div>
          <div id="water-ideal-badge"
               style="display:none;font-size:0.65rem;background:#DCFCE7;color:#15803D;padding:4px 8px;border-radius:10px;"></div>
        </div>

        <div style="position:relative;width:100%;height:200px;">
          <canvas id="con-water-chart"></canvas>
        </div>

        <div id="con-water-summary"
             style="display:none;margin-top:10px;padding:10px;background:#F8FAFC;border-radius:10px;font-size:0.74rem;"></div>
      </div>

      <!-- ENERGY CHART -->
      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;">

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div style="font-weight:700;">⚡ Energy: Your Farm vs Traditional</div>
          <div id="energy-trad-badge"
               style="display:none;font-size:0.65rem;background:#FEE2E2;color:#B91C1C;padding:4px 8px;border-radius:10px;"></div>
        </div>

        <div style="position:relative;width:100%;height:180px;">
          <canvas id="con-energy-chart"></canvas>
        </div>

        <div id="con-energy-summary"
             style="display:none;margin-top:10px;padding:10px;background:#F8FAFC;border-radius:10px;font-size:0.74rem;"></div>
      </div>

      <!-- PLANTS -->
      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;">

        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <div style="font-weight:800;">🌾 Vertical vs Traditional Farming</div>
          <span style="font-size:0.65rem;color:#64748B;">
            FAO / USDA
          </span>
        </div>

        <div id="con-plant-cards"></div>

        <div id="con-view-all-wrap"
             style="display:none;text-align:center;margin-top:12px;">
          <button id="con-view-all-btn"
                  style="padding:8px 18px;border-radius:20px;border:1px solid #2563EB;background:#FFF;color:#2563EB;font-weight:700;cursor:pointer;">
            View All
          </button>
        </div>

        <div id="con-trad-bars"
             style="display:flex;flex-direction:column;gap:14px;margin-top:16px;"></div>

        <div id="con-monthly-savings"
             style="display:none;margin-top:14px;background:linear-gradient(135deg,#F0FDF4,#EFF6FF);padding:16px;border-radius:14px;border:1px solid #BBF7D0;"></div>

      </div>

      <!-- AI -->
      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;">

        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <span>🤖</span>
          <span style="font-weight:700;">Groq AI Sustainability Insight</span>

          <div id="con-ai-spinner"
               style="width:14px;height:14px;border:2px solid #BFDBFE;border-top-color:#2563EB;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        </div>

        <div id="con-ai-text"
             style="color:#475569;font-size:0.82rem;line-height:1.6;font-style:italic;">
          Requesting real agricultural analysis from Groq AI…
        </div>

        <div id="con-ai-source"
             style="display:none;margin-top:8px;font-size:0.65rem;color:#94A3B8;font-weight:600;">
          Powered by Groq Llama 3.1
        </div>

      </div>

      <!-- BREAKDOWN -->
      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;">
        <div style="font-weight:700;margin-bottom:12px;">📊 Equipment Usage</div>
        <div id="con-breakdown"></div>
      </div>

      <!-- ECO TIPS -->
      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;">
        <div style="font-weight:700;margin-bottom:12px;">💡 Eco Tips</div>
        <div id="con-ai-tips"></div>
      </div>

      <div id="con-last-updated"
           style="text-align:center;color:#94A3B8;font-size:0.68rem;padding-bottom:16px;"></div>

    </div>

    <!-- ERROR -->
    <div id="con-error"
         style="display:none;text-align:center;padding:40px 16px;">

      <div style="font-size:2.5rem;">⚠️</div>

      <div style="color:#DC2626;font-weight:700;margin-top:12px;">
        Could not connect to backend.
      </div>

      <button id="con-retry-btn"
              style="margin-top:20px;padding:10px 24px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:12px;font-weight:600;cursor:pointer;">
        🔄 Retry
      </button>

    </div>

  </div>

  <style>
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .cprog {
      background:#F1F5F9;
      border-radius:100px;
      height:9px;
      flex:1;
      overflow:hidden;
    }

    .cprog-fill {
      height:100%;
      border-radius:100px;
      transition:width 0.7s ease;
    }
  </style>
  `;
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
export async function init() {
  _showAllPlants = false;
  _allPlantData = [];

  document
    .getElementById('con-retry-btn')
    ?.addEventListener('click', _loadData);

  await _loadData();
}

/* ══════════════════════════════════════════════
   LOAD DATA
══════════════════════════════════════════════ */
async function _loadData() {
  _show('loading');

  try {
    const deviceId = AppState.currentFarmId || 'farm_001';

    const hRes = await fetch(
      `${BASE_URL}/api/sensors/history?deviceId=${deviceId}&limit=24`
    );

    const hData = hRes.ok ? await hRes.json() : {};

    const readings =
      hData.readings?.length > 0
        ? hData.readings
        : _mockReadings();

    await _processData(readings, !hRes.ok);

  } catch {
    await _processData(_mockReadings(), true);
  }
}

/* ══════════════════════════════════════════════
   PROCESS DATA
══════════════════════════════════════════════ */
async function _processData(readings, isMock) {
  _show('content');

  const metrics = _calcMetrics(readings);

  _el('con-water-today').textContent =
    `${metrics.waterLiters.toFixed(1)} L`;

  _el('con-energy-today').textContent =
    `${metrics.energyKwh.toFixed(3)} kWh`;

  _el('con-co2').textContent =
    `${metrics.co2Saved.toFixed(2)} kg`;

  _renderBreakdown(metrics);
  _renderEcoTips(readings, metrics);

  const ts = readings[0]?.createdAt || new Date();

  _el('con-last-updated').textContent =
    `${isMock ? '⚡ Demo mode · ' : ''}Last updated: ${new Date(ts).toLocaleString('en-MY')}`;

  await _loadChartLib();

  _renderCharts(
    readings,
    metrics,
    { min: 65, max: 80, mid: 72 },
    3.0 / 24
  );

  await _fetchAI(metrics, readings);
}

/* ══════════════════════════════════════════════
   FETCH AI
══════════════════════════════════════════════ */
async function _fetchAI(metrics, readings) {
  const plants = _getPlants();

  try {
    const res = await fetch(`${BASE_URL}/api/consumption/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plants, metrics }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    const rb = data.ruleBasedSummary;
    const pd = data.plantData || [];

    const iz =
      data.idealWaterZone || {
        min: 65,
        max: 80,
        mid: 72,
      };

    const tradE = data.traditionalEnergyPerDay || 3.0;

    _el('con-water-vs').textContent =
      `↓ ${rb.waterSavePct}% vs traditional`;

    _el('con-energy-vs').textContent =
      `↓ ${pd[0]?.energySavePct || 0}% vs traditional`;

    _el('con-cost-saved').textContent =
      `RM ${rb.dailySavingsRm.toFixed(2)}/day`;

    _el('con-cost-sub').textContent =
      `RM ${rb.monthlySavingsRm}/mo`;

    _renderCharts(readings, metrics, iz, tradE / 24);

    _allPlantData = pd;

    _renderPlantCards(pd, false);

    _renderCompBars(pd, metrics, rb);

    _renderMonthlySavings(rb);

    _el('con-ai-spinner').style.display = 'none';

    _el('con-ai-text').textContent =
      data.aiNarrative || '—';

    _el('con-ai-text').style.fontStyle = 'normal';

    _el('con-ai-source').style.display = 'block';

  } catch (err) {
    console.warn('[ConsumptionPage] AI fetch failed:', err.message);

    _el('con-ai-spinner').style.display = 'none';

    _el('con-ai-text').textContent =
      'AI analysis unavailable — showing estimated data.';

    const fallbackPd = plants.map(_fallbackCard);

    _allPlantData = fallbackPd;

    _renderPlantCards(fallbackPd, false);
  }
}

/* ══════════════════════════════════════════════
   PLANT CARDS
══════════════════════════════════════════════ */
function _renderPlantCards(plantData, showAll) {
  const toShow =
    showAll
      ? plantData
      : plantData.slice(0, 3);

  const hasMore = plantData.length > 3;

  _el('con-plant-cards').innerHTML =
    toShow.map(_plantCardHtml).join('');

  const wrap = _el('con-view-all-wrap');
  const btn = _el('con-view-all-btn');

  if (hasMore) {
    wrap.style.display = 'block';

    btn.textContent =
      showAll
        ? '↑ Show Less'
        : `View All ${plantData.length} Plants →`;

    btn.onclick = () => {
      _showAllPlants = !_showAllPlants;
      _renderPlantCards(_allPlantData, _showAllPlants);
    };

  } else {
    wrap.style.display = 'none';
  }
}

function _plantCardHtml(p) {

  const vertGrow =
    p.vertical?.growDays ?? '—';

  const tradGrow =
    p.traditional?.growDays ?? '—';

  return `
    <div style="background:#F8FAFC;border-radius:14px;padding:14px;border:1px solid #E2E8F0;margin-bottom:10px;">

      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="font-size:1.5rem;">${p.emoji || '🌱'}</span>

        <div style="flex:1;">
          <div style="font-weight:800;">
            ${p.name}
          </div>
        </div>

        <div style="font-size:1.1rem;font-weight:900;color:#16A34A;">
          ↓${p.waterSavePct || 0}%
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">

        <div style="background:#EFF6FF;padding:10px;border-radius:10px;">
          <div style="font-size:0.7rem;font-weight:800;color:#1D4ED8;margin-bottom:6px;">
            🏭 Vertical
          </div>

          <div>${p.vertical?.waterPerDayL || 0}L/day</div>
          <div>${p.vertical?.energyKwhPerDay || 0}kWh/day</div>
          <div>${vertGrow} days</div>
        </div>

        <div style="background:#FEF2F2;padding:10px;border-radius:10px;">
          <div style="font-size:0.7rem;font-weight:800;color:#B91C1C;margin-bottom:6px;">
            🌾 Traditional
          </div>

          <div>${p.traditional?.waterPerDayL || 0}L/day</div>
          <div>${p.traditional?.energyKwhPerDay || 0}kWh/day</div>
          <div>${tradGrow} days</div>
        </div>

      </div>

    </div>
  `;
}

/* ══════════════════════════════════════════════
   FALLBACK CARD
══════════════════════════════════════════════ */
function _fallbackCard(name) {
  return {
    name,
    emoji: '🌱',

    vertical: {
      waterPerDayL: 0.15,
      energyKwhPerDay: 0.36,
      growDays: 45,
    },

    traditional: {
      waterPerDayL: 1.0,
      energyKwhPerDay: 0.792,
      growDays: 60,
      source: 'Estimate',
    },

    waterSavePct: 85,
  };
}

/* ══════════════════════════════════════════════
   GET PLANTS
══════════════════════════════════════════════ */
function _getPlants() {
  const names = new Set();

  const farm = AppState.currentFarm;

  if (Array.isArray(farm?.plants)) {
    farm.plants.forEach(p => {
      const n = p?.name || p?.species;
      if (n) {
        names.add(String(n).toLowerCase().trim());
      }
    });
  }

  return names.size > 0
    ? [...names]
    : ['lettuce'];
}

/* ══════════════════════════════════════════════
   CHARTS
══════════════════════════════════════════════ */
async function _loadChartLib() {
  if (window.Chart) return;

  await new Promise((ok, fail) => {
    const s = document.createElement('script');

    s.src =
      'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';

    s.onload = ok;
    s.onerror = fail;

    document.head.appendChild(s);
  });
}

function _renderCharts(readings, metrics, idealZone, tradEnergyPerHour) {

  const labels = readings.map((_, i) => `${i}`);

  const waterData =
    readings.map(r => r.waterLevel ?? 70);

  const energyData =
    readings.map(r => {
      const lr = r.lightRaw ?? 2000;
      const t = r.temperature ?? 25;

      return (
        ((lr < 1500 ? WATTS_LIGHT : 0) +
          (t > 28 ? WATTS_FAN : 0) +
          WATTS_PUMP * 0.1) / 1000
      );
    });

 const wEl = _el('con-water-chart');

if (wEl) {

  try {
    wEl._chart?.destroy();
  } catch {}

  const izMin = idealZone.min;
  const izMax = idealZone.max;

  const inRange =
    waterData.filter(v => v >= izMin && v <= izMax).length;

  const pct =
    Math.round((inRange / waterData.length) * 100);

  const badge = _el('water-ideal-badge');

  badge.style.display = 'block';
  badge.textContent =
    `Ideal: ${izMin}%–${izMax}% · ${pct}% in range`;

  wEl._chart = new window.Chart(wEl, {

    type: 'line',

    data: {
      labels,

      datasets: [

        /* IDEAL MAX */
        {
          label: 'Ideal Max',
          data: Array(labels.length).fill(izMax),

          borderColor: 'rgba(22,163,74,0.45)',
          borderDash: [5, 4],
          borderWidth: 1.5,

          pointRadius: 0,

          fill: '+1',
          backgroundColor: 'rgba(22,163,74,0.12)',
        },

        /* IDEAL MIN */
        {
          label: 'Ideal Min',
          data: Array(labels.length).fill(izMin),

          borderColor: 'rgba(22,163,74,0.45)',
          borderDash: [5, 4],
          borderWidth: 1.5,

          pointRadius: 0,

          fill: false,
        },

        /* YOUR FARM */
        {
          label: 'Your Farm',

          data: waterData,

          borderColor: '#2563EB',
          borderWidth: 2.5,

          tension: 0.35,

          pointRadius: 3,

          pointBackgroundColor:
            waterData.map(v =>
              v < izMin
                ? '#DC2626'
                : v > izMax
                  ? '#F59E0B'
                  : '#2563EB'
            ),

          pointBorderColor: '#FFF',
          pointBorderWidth: 1.5,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {

        x: {
          grid: {
            color: '#F1F5F9',
          },

          ticks: {
            color: '#94A3B8',
            font: {
              size: 9,
            },
          },
        },

        y: {
          min: 0,
          max: 100,

          grid: {
            color: '#F1F5F9',
          },

          ticks: {
            color: '#94A3B8',
            font: {
              size: 9,
            },
          },
        },
      },
    },
  });

  const ws = _el('con-water-summary');

  ws.style.display = 'block';

  ws.innerHTML = `
    <span style="font-weight:700;color:#16A34A;">
      ${pct}% of readings inside ideal range
    </span>
    · Ideal zone: ${izMin}%–${izMax}%
  `;
}

  const eEl = _el('con-energy-chart');

  if (eEl) {

    try {
      eEl._chart?.destroy();
    } catch {}

    eEl._chart = new window.Chart(eEl, {
      data: {
        labels,
        datasets: [
          {
            type: 'line',
            label: 'Traditional farm (avg/hr)',
            data: Array(labels.length).fill(tradEnergyPerHour),
            borderColor: '#DC2626',
            borderDash: [6, 4],
          },
          {
            type: 'bar',
            label: 'Your Farm',
            data: energyData,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}

/* ══════════════════════════════════════════════
   COMPARISON BARS
══════════════════════════════════════════════ */
function _renderCompBars(plantData, metrics, rb) {

  const p = plantData[0];

  if (!p) return;

  const bars = [
    {
      label: '💧 Water',
      yours: metrics.waterLiters,
      trad: p.traditional?.waterPerDayL || 1,
      unit: 'L',
      color: '#2563EB',
    },
    {
      label: '⚡ Energy',
      yours: metrics.energyKwh,
      trad: p.traditional?.energyKwhPerDay || 1,
      unit: 'kWh',
      color: '#D97706',
    },
  ];

  _el('con-trad-bars').innerHTML =
    bars.map(b => {

      const pct =
        b.trad > 0
          ? Math.min(100, (b.yours / b.trad) * 100)
          : 0;

      return `
        <div>

          <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
            <span>${b.label}</span>
            <span>${b.yours.toFixed(2)}${b.unit}</span>
          </div>

          <div class="cprog">
            <div class="cprog-fill"
                 style="width:${pct}%;background:${b.color};"></div>
          </div>

        </div>
      `;
    }).join('');
}

/* ══════════════════════════════════════════════
   MONTHLY SAVINGS
══════════════════════════════════════════════ */
function _renderMonthlySavings(rb) {

  const el = _el('con-monthly-savings');

  if (!rb || !el) return;

  el.style.display = 'block';

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">

      <div>
        <div style="font-size:1.2rem;font-weight:900;color:#2563EB;">
          ${rb.monthlySavingsL || 0}L
        </div>
        <div style="font-size:0.65rem;">water/mo</div>
      </div>

      <div>
        <div style="font-size:1.2rem;font-weight:900;color:#16A34A;">
          RM${rb.monthlySavingsRm || 0}
        </div>
        <div style="font-size:0.65rem;">saved/mo</div>
      </div>

      <div>
        <div style="font-size:1.2rem;font-weight:900;color:#0D9488;">
          RM${rb.yearlySavingsRm || 0}
        </div>
        <div style="font-size:0.65rem;">saved/yr</div>
      </div>

    </div>
  `;
}

/* ══════════════════════════════════════════════
   BREAKDOWN
══════════════════════════════════════════════ */
function _renderBreakdown(m) {

  _el('con-breakdown').innerHTML = `
    <div>💧 Water Pump: ${m.waterActivations}</div>
    <div>💡 Grow Lights: ${m.lightHours}</div>
    <div>🌀 Cooling Fan: ${m.fanHours}</div>
  `;
}

/* ══════════════════════════════════════════════
   ECO TIPS
══════════════════════════════════════════════ */
function _renderEcoTips(readings, m) {

  _el('con-ai-tips').innerHTML = `
    <div style="background:#F8FAFC;padding:12px;border-radius:10px;">
      Farm running efficiently.
    </div>
  `;
}

/* ══════════════════════════════════════════════
   METRICS
══════════════════════════════════════════════ */
function _calcMetrics(readings) {

  let waterAct = 0;
  let lightH = 0;
  let fanH = 0;

  readings.forEach(r => {

    if ((r.soilRaw ?? 1900) < 1800) {
      waterAct++;
    }

    if ((r.lightRaw ?? 2000) < 1500) {
      lightH++;
    }

    if ((r.temperature ?? 25) > 28) {
      fanH++;
    }
  });

  const wL =
    (waterAct * ML_PER_WATERING) / 1000;

  const kWh =
    ((lightH * WATTS_LIGHT) +
      (fanH * WATTS_FAN) +
      (waterAct * WATTS_PUMP)) / 1000;

  return {
    waterLiters: Math.max(wL, 0.05),
    energyKwh: Math.max(kWh, 0.01),
    co2Saved: Math.max((60 - wL) * 0.035, 0.5),

    waterActivations: waterAct,
    lightHours: lightH,
    fanHours: fanH,

    totalReadings: readings.length,
  };
}

/* ══════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════ */
function _mockReadings() {

  const now = Date.now();

  return Array.from({ length: 24 }, (_, i) => ({
    temperature: 22 + Math.sin(i / 4) * 4,
    soilRaw: 1550 + Math.random() * 650,
    lightRaw: 700 + Math.random() * 1300,
    waterLevel: 63 + Math.random() * 25,
    createdAt: new Date(now - (23 - i) * 3600000).toISOString(),
  }));
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function _el(id) {
  return document.getElementById(id);
}

function _show(state) {

  ['loading', 'content', 'error'].forEach(k => {

    const e = _el(`con-${k}`);

    if (e) {
      e.style.display =
        k === state
          ? 'block'
          : 'none';
    }
  });
}