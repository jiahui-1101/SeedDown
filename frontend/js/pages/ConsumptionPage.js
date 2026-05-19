/* ============================================================
   MODULE: FEATURE — ECO CONSUMPTION DASHBOARD
   ConsumptionPage.js — FINAL VERSION
   - Real Groq AI narrative (via /api/consumption/analysis)
   - Water chart: ideal zone band + real data line
   - Energy chart: vertical bar vs traditional flat line
   - Real RM savings from actual sensor data + FAO benchmarks
   - Per-crop cards: first 3 shown + "View All" button
   - Plants sourced from AppState.currentFarm (real user farm data)
   ============================================================ */

import { AppState } from '../store.js';

const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : window.location.origin;

const WATTS_LIGHT      = 45;
const WATTS_FAN        = 20;
const WATTS_PUMP       = 10;
const ML_PER_WATERING  = 250;
const RM_PER_KWH       = 0.218;

/* ── Module-level state for view-all ── */
let _showAllPlants = false;
let _allPlantData  = [];

/* ══════════════════════════════════════════════
   RENDER
══════════════════════════════════════════════ */
export function render() {
  return `
  <div id="consumptionRoot" style="padding:16px;min-height:100%;background:#F8FAFC;color:#0F172A;font-family:'Inter',system-ui,sans-serif;">

    <div id="con-loading" style="text-align:center;padding:60px 0;">
      <div style="font-size:2.5rem;animation:spin 1s linear infinite;display:inline-block;">⚙️</div>
      <div style="margin-top:12px;color:#64748B;font-size:0.9rem;font-weight:500;">Fetching farm data…</div>
    </div>

    <div id="con-content" style="display:none;">

      <div id="con-hero" style="background:linear-gradient(135deg,#DCFCE7,#F0FDF4);border:1px solid #BBF7D0;border-radius:24px;padding:24px;text-align:center;margin-bottom:16px;position:relative;overflow:hidden;box-shadow:0 4px 16px rgba(22,163,74,0.1);">
        <div style="position:absolute;top:-16px;right:-16px;font-size:5rem;opacity:0.12;">🌱</div>
        <div id="con-grade" style="font-size:3.5rem;font-weight:900;color:#16A34A;line-height:1;">—</div>
        <div style="color:#15803D;font-size:0.85rem;font-weight:700;margin-top:6px;">Eco Efficiency Rating</div>
        <div id="con-grade-note" style="font-size:0.75rem;color:#166534;margin-top:8px;">Calculating…</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div>💧</div>
          <div id="con-water-today" style="font-size:1.5rem;font-weight:800;color:#2563EB;margin:4px 0;">—</div>
          <div style="color:#64748B;font-size:0.75rem;font-weight:500;">Water Used Today</div>
          <div id="con-water-vs" style="color:#16A34A;font-weight:700;font-size:0.7rem;margin-top:4px;"></div>
        </div>
        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div>⚡</div>
          <div id="con-energy-today" style="font-size:1.5rem;font-weight:800;color:#D97706;margin:4px 0;">—</div>
          <div style="color:#64748B;font-size:0.75rem;font-weight:500;">Energy Used Today</div>
          <div id="con-energy-vs" style="color:#16A34A;font-weight:700;font-size:0.7rem;margin-top:4px;"></div>
        </div>
        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div>🌿</div>
          <div id="con-co2" style="font-size:1.5rem;font-weight:800;color:#16A34A;margin:4px 0;">—</div>
          <div style="color:#64748B;font-size:0.75rem;font-weight:500;">CO₂ Offset Today</div>
        </div>
        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div>💰</div>
          <div id="con-cost-saved" style="font-size:1.5rem;font-weight:800;color:#16A34A;margin:4px 0;">—</div>
          <div style="color:#64748B;font-size:0.75rem;font-weight:500;">Saved vs Traditional</div>
          <div id="con-cost-sub" style="color:#64748B;font-size:0.65rem;margin-top:2px;"></div>
        </div>
      </div>

      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div>
            <div style="color:#1E293B;font-weight:700;font-size:0.9rem;">💧 Water Level — Real vs Ideal</div>
            <div style="font-size:0.65rem;color:#94A3B8;margin-top:2px;">Green band = crop-specific ideal zone from your plant data</div>
          </div>
          <div id="water-ideal-badge" style="display:none;font-size:0.62rem;background:#DCFCE7;color:#15803D;padding:4px 8px;border-radius:10px;font-weight:700;border:1px solid #BBF7D0;white-space:nowrap;"></div>
        </div>
        <div style="display:flex;gap:14px;margin-bottom:8px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:5px;font-size:0.65rem;color:#374151;font-weight:600;">
            <div style="width:20px;height:3px;background:#2563EB;border-radius:2px;"></div> Your Farm
          </div>
          <div style="display:flex;align-items:center;gap:5px;font-size:0.65rem;color:#374151;font-weight:600;">
            <div style="width:20px;height:8px;background:rgba(22,163,74,0.2);border-radius:2px;border:1px dashed #16A34A;"></div> Ideal Zone
          </div>
        </div>
        <div style="position:relative;width:100%;height:200px;">
          <canvas id="con-water-chart" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;"></canvas>
        </div>
        <div id="con-water-summary" style="margin-top:10px;padding:10px;background:#F8FAFC;border-radius:10px;font-size:0.74rem;color:#475569;line-height:1.5;border:1px solid #F1F5F9;display:none;"></div>
      </div>

      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div>
            <div style="color:#1E293B;font-weight:700;font-size:0.9rem;">⚡ Energy: Your Farm vs Traditional</div>
            <div style="font-size:0.65rem;color:#94A3B8;margin-top:2px;">Red line = traditional farm daily energy (FAO benchmark)</div>
          </div>
          <div id="energy-trad-badge" style="display:none;font-size:0.62rem;background:#FEE2E2;color:#B91C1C;padding:4px 8px;border-radius:10px;font-weight:700;border:1px solid #FECACA;white-space:nowrap;"></div>
        </div>
        <div style="display:flex;gap:14px;margin-bottom:8px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:5px;font-size:0.65rem;color:#374151;font-weight:600;">
            <div style="width:20px;height:10px;background:rgba(217,119,6,0.7);border-radius:3px;"></div> Your kWh (per hour)
          </div>
          <div style="display:flex;align-items:center;gap:5px;font-size:0.65rem;color:#374151;font-weight:600;">
            <div style="width:20px;height:3px;background:#DC2626;border-radius:2px;border-top:2px dashed #DC2626;"></div> Traditional avg/hr
          </div>
        </div>
        <div style="position:relative;width:100%;height:180px;">
          <canvas id="con-energy-chart" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;"></canvas>
        </div>
        <div id="con-energy-summary" style="margin-top:10px;padding:10px;background:#F8FAFC;border-radius:10px;font-size:0.74rem;color:#475569;line-height:1.5;border:1px solid #F1F5F9;display:none;"></div>
      </div>

      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
          <div style="color:#1E293B;font-weight:800;font-size:1rem;">🌾 Vertical vs Traditional Farming</div>
          <span style="font-size:0.6rem;color:#64748B;background:#F1F5F9;padding:3px 8px;border-radius:8px;font-weight:600;">FAO / USDA Data</span>
        </div>
        <div style="font-size:0.7rem;color:#94A3B8;margin-bottom:14px;">Based on the plants in your rack right now</div>

        <div id="con-plant-cards" style="display:flex;flex-direction:column;gap:10px;margin-bottom:10px;">
          <div style="background:#F8FAFC;border-radius:12px;padding:14px;border:1px solid #E2E8F0;">
            <div style="color:#94A3B8;font-size:0.8rem;text-align:center;">Analysing your plants…</div>
          </div>
        </div>

        <div id="con-view-all-wrap" style="display:none;text-align:center;margin-bottom:14px;">
          <button id="con-view-all-btn" style="
            padding:8px 20px;border:1.5px solid #2563EB;border-radius:20px;
            background:transparent;color:#2563EB;font-weight:700;font-size:0.78rem;
            cursor:pointer;
          ">View All Plants →</button>
        </div>

        <div id="con-trad-bars" style="display:flex;flex-direction:column;gap:14px;margin-bottom:14px;"></div>

        <div id="con-monthly-savings" style="background:linear-gradient(135deg,#F0FDF4,#EFF6FF);border-radius:14px;padding:16px;margin-bottom:14px;border:1px solid #BBF7D0;display:none;"></div>

        <div style="background:#F8FAFC;border-left:4px solid #2563EB;border-radius:0 12px 12px 0;padding:14px;border:1px solid #E2E8F0;border-left:4px solid #2563EB;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span>🤖</span>
            <span style="font-weight:700;color:#1E293B;font-size:0.85rem;">Groq AI Sustainability Insight</span>
            <div id="con-ai-spinner" style="width:13px;height:13px;border:2px solid #BFDBFE;border-top-color:#2563EB;border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0;"></div>
          </div>
          <div id="con-ai-text" style="color:#475569;font-size:0.8rem;line-height:1.65;font-style:italic;">
            Requesting real agricultural analysis from Groq AI…
          </div>
        </div>
      </div>

      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="color:#1E293B;font-weight:700;margin-bottom:12px;">📊 Equipment Usage</div>
        <div id="con-breakdown"></div>
      </div>

      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="color:#1E293B;font-weight:700;margin-bottom:12px;">💡 Eco Tips</div>
        <div id="con-ai-tips"></div>
      </div>

      <div id="con-last-updated" style="text-align:center;color:#94A3B8;font-size:0.68rem;padding-bottom:16px;font-weight:500;"></div>
    </div>

    <div id="con-error" style="display:none;text-align:center;padding:40px 16px;">
      <div style="font-size:2.5rem;">⚠️</div>
      <div style="color:#DC2626;font-weight:700;margin-top:12px;">Could not connect to backend.</div>
      <div style="color:#64748B;font-size:0.8rem;margin-top:4px;">Showing demo data.</div>
      <button id="con-retry-btn" style="margin-top:20px;padding:10px 24px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:12px;font-weight:600;cursor:pointer;">🔄 Retry</button>
    </div>
  </div>
  <style>
    @keyframes spin { to { transform:rotate(360deg); } }
    .cprog { background:#F1F5F9;border-radius:100px;height:9px;flex:1;overflow:hidden; }
    .cprog-fill { height:100%;border-radius:100px;transition:width 0.7s ease; }
  </style>`;
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
export async function init() {
  _showAllPlants = false;
  _allPlantData  = [];
  document.getElementById('con-retry-btn')?.addEventListener('click', _loadData);
  await _loadData();
}

/* ── LOAD SENSOR DATA ── */
async function _loadData() {
  _show('loading');
  try {
    const deviceId = AppState.currentFarmId || 'farm_001';
    const hRes = await fetch(`${BASE_URL}/api/sensors/history?deviceId=${deviceId}&limit=24`);
    const hData = hRes.ok ? await hRes.json() : {};
    const readings = hData.readings?.length > 0 ? hData.readings : _mockReadings();
    await _processData(readings, !hRes.ok || !hData.readings?.length);
  } catch {
    await _processData(_mockReadings(), true);
  }
}

/* ── PROCESS ── */
async function _processData(readings, isMock) {
  _show('content');
  const metrics = _calcMetrics(readings);

  /* Basic KPIs */
  _el('con-water-today').textContent  = `${metrics.waterLiters.toFixed(1)} L`;
  _el('con-energy-today').textContent = `${metrics.energyKwh.toFixed(3)} kWh`;
  _el('con-co2').textContent          = `${metrics.co2Saved.toFixed(2)} kg`;

  _renderBreakdown(metrics);
  _renderEcoTips(readings, metrics);

  const ts = readings[0]?.createdAt || new Date();
  _el('con-last-updated').textContent =
    `${isMock ? '⚡ Demo mode · ' : ''}Last updated: ${new Date(ts).toLocaleString('en-MY')}`;

  /* Load charts first with fallback */
  await _loadChartLib();
  _renderCharts(readings, metrics, { min: 65, max: 80, mid: 72 }, 3.0 / 24);

  /* Fetch REAL AI Data */
  await _fetchAI(metrics, readings);
}

/* ══════════════════════════════════════════════
   FETCH AI ANALYSIS (Real Backend Route)
══════════════════════════════════════════════ */
async function _fetchAI(metrics, readings) {
  /* GET PLANTS DIRECTLY FROM USER'S RACK */
  const plants = _getPlants();

  try {
    const res = await fetch(`${BASE_URL}/api/consumption/analysis`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plants, metrics }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const rb    = data.ruleBasedSummary;
    const pd    = data.plantData || [];
    const iz    = data.idealWaterZone || { min: 65, max: 80, mid: 72 };
    const tradE = data.traditionalEnergyPerDay || 3.0;

    /* ── Update KPIs ── */
    _el('con-water-vs').textContent   = `↓ ${rb.waterSavePct}% vs traditional`;
    _el('con-energy-vs').textContent  = pd[0] ? `↓ ${pd[0].energySavePct || 0}% vs traditional` : '';
    _el('con-co2').textContent        = `${metrics.co2Saved.toFixed(2)} kg`;

    /* ── Cost saved ── */
    _el('con-cost-saved').textContent = `RM ${rb.dailySavingsRm.toFixed(2)}/day`;
    _el('con-cost-sub').textContent   = `RM ${rb.monthlySavingsRm}/mo · trad costs RM ${rb.todayTradCost.toFixed(2)}/day`;

    /* ── Eco grade ── */
    const gradeMap = {
      excellent:    { l:'A+', c:'#16A34A', n:'Ultra-efficient — top 10% of vertical farms.' },
      good:         { l:'A',  c:'#2563EB', n:'Great efficiency, performing well above average.' },
      average:      { l:'B',  c:'#D97706', n:'Good, but room to optimise water scheduling.' },
      above_target: { l:'C',  c:'#DC2626', n:'High consumption detected — check pump cycles.' },
    };
    const g = gradeMap[rb.waterStatus] || gradeMap.good;
    _el('con-grade').textContent      = g.l;
    _el('con-grade').style.color      = g.c;
    _el('con-grade-note').textContent = g.n;
    _el('con-grade-note').style.color = g.c;

    /* ── Update Charts ── */
    _renderCharts(readings, metrics, iz, tradE / 24);

    /* ── Plant Comparison Cards (Top 3 + View All) ── */
    _allPlantData = pd;
    _renderPlantCards(pd, false);
    _renderCompBars(pd, metrics, rb);
    _renderMonthlySavings(rb);

    /* ── AI narrative ── */
    _el('con-ai-spinner').style.display = 'none';
    _el('con-ai-text').textContent      = data.aiNarrative || '—';
    _el('con-ai-text').style.fontStyle  = 'normal';
    _el('con-ai-source').style.display  = 'block';

  } catch (err) {
    console.warn('[ConsumptionPage] AI fetch failed:', err.message);
    _el('con-ai-spinner').style.display = 'none';
    _el('con-ai-text').textContent      = 'AI analysis unavailable — showing estimated data.';
    _el('con-ai-text').style.fontStyle  = 'italic';

    /* Fallback estimates */
    const tradWater = 320;
    const saved     = Math.max(0, tradWater - metrics.waterLiters);
    const rmSaved   = ((saved * 0.002) + ((3.0 - metrics.energyKwh) * RM_PER_KWH)).toFixed(2);
    _el('con-cost-saved').textContent = `RM ${rmSaved}/day`;
    _el('con-cost-sub').textContent   = 'Estimated vs traditional';
    _el('con-water-vs').textContent   = `↓ ${Math.round(saved / tradWater * 100)}% est. vs traditional`;

    const fallbackPd = plants.map(_fallbackCard);
    _allPlantData = fallbackPd;
    _renderPlantCards(fallbackPd, false);
  }
}

/* ══════════════════════════════════════════════
   PLANT CARDS — first 3 + view all logic
══════════════════════════════════════════════ */
function _renderPlantCards(plantData, showAll) {
  const toShow  = showAll ? plantData : plantData.slice(0, 3);
  const hasMore = plantData.length > 3;

  _el('con-plant-cards').innerHTML = toShow.length > 0
    ? toShow.map(p => _plantCardHtml(p)).join('')
    : `<div style="background:#F8FAFC;border-radius:12px;padding:14px;border:1px solid #E2E8F0;color:#94A3B8;font-size:0.8rem;text-align:center;">
        No plants found in this farm. Add plants in the Farm Builder to see comparisons.
       </div>`;

  const wrap = _el('con-view-all-wrap');
  const btn  = _el('con-view-all-btn');
  if (hasMore) {
    wrap.style.display = 'block';
    btn.textContent    = showAll ? '↑ Show Less' : `View All ${plantData.length} Plants →`;
    btn.onclick = () => {
      _showAllPlants = !_showAllPlants;
      _renderPlantCards(_allPlantData, _showAllPlants);
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
  } else {
    wrap.style.display = 'none';
  }
}

function _plantCardHtml(p) {
  const vertWater  = p.vertical?.waterPerDayL     != null ? Number(p.vertical.waterPerDayL).toFixed(2)        : '—';
  const vertEnergy = p.vertical?.energyKwhPerDay  != null ? (Number(p.vertical.energyKwhPerDay) * 1000).toFixed(0) : '—';
  const vertGrow   = p.vertical?.growthDays       != null ? p.vertical.growthDays                             : '—';
  const tradWater  = p.traditional?.waterPerDayL  != null ? Number(p.traditional.waterPerDayL).toFixed(2)     : '—';
  const tradEnergy = p.traditional?.energyKwhPerDay!= null ? (Number(p.traditional.energyKwhPerDay) * 1000).toFixed(0) : '—';
  const tradGrow   = p.traditional?.growthDays    != null ? p.traditional.growthDays                          : '—';
  const source     = p.traditional?.source        ?? 'FAO AQUASTAT';

  const waterSavePct      = p.waterSavePct      != null ? p.waterSavePct      : '—';
  const waterSavedLPerDay = p.waterSavedLPerDay != null ? p.waterSavedLPerDay : '—';
  const growDaysFaster    = p.growDaysFaster    != null ? p.growDaysFaster    : (tradGrow !== '—' && vertGrow !== '—' ? tradGrow - vertGrow : '—');
  const landReductionPct  = p.landReductionPct  != null ? p.landReductionPct  : 93;

  return `
    <div style="background:#F8FAFC;border-radius:14px;padding:14px;border:1px solid #E2E8F0;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="font-size:1.6rem;">${p.emoji ?? '🌱'}</span>
        <div style="flex:1;">
          <div style="font-weight:800;font-size:0.9rem;color:#0F172A;">${p.name}</div>
          <div style="font-size:0.6rem;color:#94A3B8;margin-top:1px;">${source}${p.hasCropData === false ? ' · estimated' : ''}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.1rem;font-weight:900;color:#16A34A;">↓${waterSavePct}%</div>
          <div style="font-size:0.6rem;color:#64748B;">water saved</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div style="background:#EFF6FF;border-radius:10px;padding:10px;border:1px solid #BFDBFE;">
          <div style="font-size:0.6rem;font-weight:800;color:#1D4ED8;letter-spacing:0.06em;margin-bottom:6px;">🏭 VERTICAL FARM</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${vertWater}L/day</div>
          <div style="font-size:0.6rem;color:#64748B;margin-bottom:4px;">Water (hydroponic)</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${vertEnergy}Wh/day</div>
          <div style="font-size:0.6rem;color:#64748B;margin-bottom:4px;">Energy (LED grow)</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${vertGrow} days</div>
          <div style="font-size:0.6rem;color:#64748B;">Grow cycle</div>
        </div>
        <div style="background:#FEF2F2;border-radius:10px;padding:10px;border:1px solid #FECACA;">
          <div style="font-size:0.6rem;font-weight:800;color:#B91C1C;letter-spacing:0.06em;margin-bottom:6px;">🌾 TRADITIONAL</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${tradWater}L/day</div>
          <div style="font-size:0.6rem;color:#64748B;margin-bottom:4px;">Water (soil/field)</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${tradEnergy}Wh/day</div>
          <div style="font-size:0.6rem;color:#64748B;margin-bottom:4px;">Energy (irrigation)</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${tradGrow} days</div>
          <div style="font-size:0.6rem;color:#64748B;">Grow cycle</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <span style="background:#DCFCE7;color:#15803D;font-size:0.65rem;font-weight:700;padding:4px 10px;border-radius:20px;">💧 ${waterSavedLPerDay}L/day saved</span>
        <span style="background:#FEF3C7;color:#92400E;font-size:0.65rem;font-weight:700;padding:4px 10px;border-radius:20px;">⏱ ${growDaysFaster} days faster</span>
        <span style="background:#DBEAFE;color:#1E40AF;font-size:0.65rem;font-weight:700;padding:4px 10px;border-radius:20px;">🌍 ${landReductionPct}% less land</span>
      </div>
    </div>`;
}

function _fallbackCard(plantName) {
  const EMOJI_MAP = { tomato:'🍅', lettuce:'🥬', basil:'🌿', spinach:'🍃', mint:'🌱', chili:'🌶️' };
  const key   = String(plantName).toLowerCase();
  const emoji = EMOJI_MAP[key] || Object.entries(EMOJI_MAP).find(([k]) => key.includes(k))?.[1] || '🌱';
  const name  = key.charAt(0).toUpperCase() + key.slice(1);
  return {
    name, emoji, species: key, hasCropData: false,
    vertical:    { waterPerDayL: 0.15, energyKwhPerDay: 0.36,  growthDays: 45 },
    traditional: { waterPerDayL: 1.0,  energyKwhPerDay: 0.792, growthDays: 60, source: 'Estimate' },
    waterSavedLPerDay: 0.85, waterSavePct: 85, energySavePct: 54, growDaysFaster: 15, landReductionPct: 93,
  };
}

/* ══════════════════════════════════════════════
   EXTRACT PLANTS FROM USER'S REAL FARM
══════════════════════════════════════════════ */
function _getPlants() {
  const names = new Set();
  const farm  = AppState.currentFarm;

  if (Array.isArray(farm?.plants)) {
    farm.plants.forEach(p => {
      const n = p?.name || p?.species;
      if (n) names.add(String(n).toLowerCase().trim());
    });
  }

  if (farm?.targetPlant) {
    String(farm.targetPlant).split(/[,;\n]+/).map(s => s.trim().toLowerCase()).filter(Boolean).forEach(n => names.add(n));
  }

  return names.size > 0 ? [...names] : ['lettuce'];
}

/* ══════════════════════════════════════════════
   CHARTS (Water + Energy Limits)
══════════════════════════════════════════════ */
async function _loadChartLib() {
  if (window.Chart) return;
  await new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src   = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
    s.onload = ok; s.onerror = fail;
    document.head.appendChild(s);
  });
}

function _renderCharts(readings, metrics, idealZone, tradEnergyPerHour) {
  const labels = readings.map((r, i) => {
    const d = new Date(r.createdAt || r.timestamp || Date.now() - (readings.length - i) * 3600000);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }).reverse();

  const waterData  = readings.map(r => r.waterLevel ?? 70).reverse();
  const energyData = readings.map(r => {
    const lr = r.lightRaw ?? r.light ?? 2000;
    const t  = r.temperature ?? 25;
    return ((lr < 1500 ? WATTS_LIGHT : 0) + (t > 28 ? WATTS_FAN : 0) + WATTS_PUMP * 0.1) / 1000;
  }).reverse();

  const { min: izMin, max: izMax } = idealZone;
  const n = labels.length;

  /* WATER CHART */
  const wEl = document.getElementById('con-water-chart');
  if (wEl) {
    if (wEl._chart) wEl._chart.destroy();
    const belowCount = waterData.filter(v => v < izMin).length;
    const aboveCount = waterData.filter(v => v > izMax).length;
    const inCount    = n - belowCount - aboveCount;
    const inPct      = Math.round((inCount / n) * 100);
    
    const badge = _el('water-ideal-badge');
    badge.style.display = 'block';
    badge.textContent   = `Ideal: ${izMin}–${izMax}% · ${inPct}% in range`;

    const ptColors = waterData.map(v => v < izMin ? '#DC2626' : v > izMax ? '#F59E0B' : '#2563EB');
    wEl._chart = new window.Chart(wEl, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label:'Ideal Max', data:Array(n).fill(izMax), borderColor:'rgba(22,163,74,0.35)', borderDash:[5,4], borderWidth:1, pointRadius:0, fill:'+1', backgroundColor:'rgba(22,163,74,0.13)', order:3 },
          { label:'Ideal Min', data:Array(n).fill(izMin), borderColor:'rgba(22,163,74,0.35)', borderDash:[5,4], borderWidth:1, pointRadius:0, fill:false, order:3 },
          { label:'Your Farm', data:waterData, borderColor:'#2563EB', borderWidth:2.5, tension:0.35,
            pointRadius:waterData.map(v => (v < izMin || v > izMax) ? 5 : 2),
            pointBackgroundColor:ptColors, pointBorderColor:'#fff', pointBorderWidth:1.5, fill:false, order:1 },
        ],
      },
      options: {
        responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
        scales:{ x:{ ticks:{ color:'#94A3B8', font:{ size:9 } }, grid:{ color:'#F1F5F9' } },
                 y:{ min:0, max:100, ticks:{ color:'#94A3B8', font:{ size:9 } }, grid:{ color:'#F1F5F9' } } },
      },
    });

    const ws = _el('con-water-summary');
    ws.style.display = 'block';
    const sc = inPct >= 70 ? '#16A34A' : inPct >= 50 ? '#D97706' : '#DC2626';
    ws.innerHTML = `<span style="font-weight:700;color:${sc};">${inPct}% of readings within ideal zone (${izMin}–${izMax}%)</span>
      &nbsp;·&nbsp;${belowCount} below · ${aboveCount} above
      ${belowCount > 3 ? '<br><strong style="color:#DC2626;">⚠ Check water reservoir</strong>' : ''}`;
  }

  /* ENERGY CHART */
  const eEl = document.getElementById('con-energy-chart');
  if (eEl) {
    if (eEl._chart) eEl._chart.destroy();
    const tradPerHour = tradEnergyPerHour || 3.0 / 24;
    
    const eBadge = _el('energy-trad-badge');
    eBadge.style.display = 'block';
    eBadge.textContent   = `Traditional limit: ${(tradPerHour * 1000).toFixed(0)} Wh/hr`;

    eEl._chart = new window.Chart(eEl, {
      data: {
        labels,
        datasets: [
          { type:'line', label:'Traditional Baseline', data:Array(n).fill(tradPerHour), borderColor:'#DC2626', borderWidth:2.5, borderDash:[6,4], pointRadius:0, fill:false, order:1 },
          { type:'bar',  label:'Your Farm (kWh)', data:energyData,
            backgroundColor:energyData.map(v => v > tradPerHour ? 'rgba(220,38,38,0.75)' : 'rgba(217,119,6,0.75)'),
            borderColor:energyData.map(v => v > tradPerHour ? '#991B1B' : '#B45309'),
            borderWidth:1, borderRadius:4, order:2 },
        ],
      },
      options: {
        responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } },
        scales:{ x:{ ticks:{ color:'#94A3B8', font:{ size:9 } }, grid:{ color:'#F1F5F9' } },
                 y:{ ticks:{ color:'#94A3B8', font:{ size:9 } }, grid:{ color:'#F1F5F9' } } },
      },
    });

    const es = _el('con-energy-summary');
    es.style.display = 'block';
    const vertTotal = energyData.reduce((a, b) => a + b, 0);
    const tradTotal = tradPerHour * n;
    const energySavePct = Math.round((1 - vertTotal / tradTotal) * 100);
    es.innerHTML = `<span style="font-weight:700;color:#16A34A;">${Math.max(0, energySavePct)}% less energy than traditional farm today</span>`;
  }
}

/* ── COMPARISON BARS ── */
function _renderCompBars(plantData, metrics, rb) {
  const p = plantData[0];
  if (!p) return;
  const bars = [
    { label:'💧 Water/Day',  yours:metrics.waterLiters, trad:p.traditional?.waterPerDayL    || 0.98, unit:'L',   color:'#2563EB', saved:rb.waterSavedL },
    { label:'⚡ Energy/Day', yours:metrics.energyKwh,   trad:p.traditional?.energyKwhPerDay || 0.79, unit:'kWh', color:'#D97706', saved:0 },
    { label:'💰 Cost/Day',   yours:rb.todayVertCost,    trad:rb.todayTradCost,                       unit:'RM',  color:'#16A34A', saved:rb.dailySavingsRm },
  ];
  _el('con-trad-bars').innerHTML = bars.map(b => {
    const pct = Math.min(100, (b.yours / b.trad) * 100);
    const savePct = Math.max(0, Math.round(100 - pct));
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:0.82rem;font-weight:700;color:#374151;">${b.label}</span>
          <span style="font-size:0.75rem;color:#16A34A;font-weight:800;">↓ ${savePct}% saved</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
          <span style="font-size:0.62rem;color:#64748B;width:68px;flex-shrink:0;">🏭 Your Farm</span>
          <div class="cprog"><div class="cprog-fill" style="width:${pct.toFixed(1)}%;background:${b.color};"></div></div>
          <span style="font-size:0.7rem;font-weight:800;color:${b.color};width:48px;text-align:right;">${Number(b.yours).toFixed(2)}${b.unit}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <span style="font-size:0.62rem;color:#64748B;width:68px;flex-shrink:0;">🌾 Traditional</span>
          <div class="cprog"><div class="cprog-fill" style="width:100%;background:#CBD5E1;"></div></div>
          <span style="font-size:0.7rem;font-weight:800;color:#94A3B8;width:48px;text-align:right;">${Number(b.trad).toFixed(2)}${b.unit}</span>
        </div>
      </div>`;
  }).join('');
}

/* ── MONTHLY SAVINGS ── */
function _renderMonthlySavings(rb) {
  const el = _el('con-monthly-savings');
  if (!el || rb.dailySavingsRm <= 0) return;
  el.style.display = 'block';
  el.innerHTML = `
    <div style="font-size:0.68rem;font-weight:800;color:#15803D;letter-spacing:0.07em;margin-bottom:12px;">📈 PROJECTION VS TRADITIONAL FARMING</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
      <div><div style="font-size:1.3rem;font-weight:900;color:#2563EB;">${rb.monthlySavingsL}L</div><div style="font-size:0.62rem;color:#64748B;margin-top:2px;">water/mo</div></div>
      <div><div style="font-size:1.3rem;font-weight:900;color:#16A34A;">RM${rb.monthlySavingsRm}</div><div style="font-size:0.62rem;color:#64748B;margin-top:2px;">saved/mo</div></div>
      <div><div style="font-size:1.3rem;font-weight:900;color:#0D9488;">RM${rb.yearlySavingsRm}</div><div style="font-size:0.62rem;color:#64748B;margin-top:2px;">saved/yr</div></div>
    </div>`;
}

/* ── EQUIPMENT BREAKDOWN ── */
function _renderBreakdown(m) {
  const items = [
    { label:'💧 Water Pump',  value:m.waterActivations, unit:'activations', pct:m.waterActivations/Math.max(m.totalReadings,1)*100, color:'#2563EB' },
    { label:'💡 Grow Lights', value:m.lightHours,       unit:'hrs ON',      pct:m.lightHours/Math.max(m.totalReadings,1)*100,       color:'#F59E0B' },
    { label:'🌀 Cooling Fan', value:m.fanHours,         unit:'hrs ON',      pct:m.fanHours/Math.max(m.totalReadings,1)*100,         color:'#16A34A' },
  ];
  _el('con-breakdown').innerHTML = items.map(i => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.8rem;">
        <span style="color:#475569;font-weight:600;">${i.label}</span>
        <span style="color:#1E293B;font-weight:800;">${i.value} ${i.unit}</span>
      </div>
      <div class="cprog"><div class="cprog-fill" style="width:${Math.min(i.pct,100).toFixed(1)}%;background:${i.color};"></div></div>
    </div>`).join('');
}

/* ── ECO TIPS ── */
function _renderEcoTips(readings, m) {
  const tips = [];
  if (m.lightHours > m.totalReadings * 0.6) {
    const s = (m.lightHours * 0.5 * WATTS_LIGHT / 1000 * RM_PER_KWH).toFixed(2);
    tips.push({ icon:'💡', title:'Reduce grow light duration', desc:`Lights ON for ${m.lightHours} intervals. Cutting 2h/day saves ≈ RM ${s}/day.`, c:'#D97706', bg:'#FEF3C7' });
  }
  if (m.waterActivations > 8) {
    const ws = ((m.waterActivations - 6) * ML_PER_WATERING / 1000).toFixed(1);
    tips.push({ icon:'💧', title:'Batch watering cycles', desc:`${m.waterActivations} pump activations. Consolidating to 6 saves ≈ ${ws}L.`, c:'#2563EB', bg:'#DBEAFE' });
  }
  if (tips.length === 0) tips.push({ icon:'✅', title:'Farm running efficiently!', desc:'All metrics within optimal range.', c:'#16A34A', bg:'#DCFCE7' });

  _el('con-ai-tips').innerHTML = tips.map(t => `
    <div style="background:#F8FAFC;border-left:4px solid ${t.c};border-radius:8px;padding:12px;border:1px solid #E2E8F0;">
      <div style="font-weight:700;color:#1E293B;font-size:0.85rem;display:flex;align-items:center;gap:6px;">
        <span style="background:${t.bg};padding:4px;border-radius:6px;">${t.icon}</span>${t.title}
      </div>
      <div style="color:#475569;font-size:0.78rem;margin-top:6px;line-height:1.5;">${t.desc}</div>
    </div>`).join('');
}

/* ── CALC METRICS ── */
function _calcMetrics(readings) {
  let waterAct = 0, lightH = 0, fanH = 0;
  readings.forEach(r => {
    if ((r.soilRaw ?? r.soilMoisture ?? 1900) < 1800) waterAct++;
    if ((r.lightRaw ?? r.light ?? 2000) < 1500) lightH++;
    if ((r.temperature ?? 25) > 28) fanH++;
  });
  const wL  = (waterAct * ML_PER_WATERING) / 1000;
  const kWh = ((lightH * WATTS_LIGHT) + (fanH * WATTS_FAN) + (waterAct * WATTS_PUMP)) / 1000;
  return {
    waterLiters:      Math.max(wL, 0.05),
    energyKwh:        Math.max(kWh, 0.01),
    costRm:           Math.max(kWh * RM_PER_KWH, 0.002),
    co2Saved:         Math.max((60 - wL) * 0.035, 0.5),
    waterActivations: waterAct,
    lightHours:       lightH,
    fanHours:         fanH,
    totalReadings:    readings.length,
  };
}

/* ── MOCK DATA ── */
function _mockReadings() {
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => ({
    deviceId: 'farm_001',
    temperature:  22 + Math.sin(i / 4) * 4 + Math.random() * 2,
    soilRaw:      1550 + Math.floor(Math.random() * 650),
    lightRaw:     700  + Math.floor(Math.random() * 1300),
    waterLevel:   63   + Math.floor(Math.random() * 25),
    ph:           5.85 + Math.random() * 0.9,
    createdAt:    new Date(now - (23 - i) * 3600000).toISOString(),
  }));
}

function _el(id) { return document.getElementById(id); }
function _show(s) {
  ['loading','content','error'].forEach(k => {
    const e = _el(`con-${k}`);
    if (e) e.style.display = k === s ? 'block' : 'none';
  });
}