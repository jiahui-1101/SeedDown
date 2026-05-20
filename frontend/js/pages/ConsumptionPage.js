/* ============================================================
   MODULE: FEATURE — ECO CONSUMPTION DASHBOARD
   ConsumptionPage.js — FINAL CORRECTED VERSION
   ============================================================ */

import { AppState } from '../store.js';

const BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

/* ============================================================
   HARDWARE POWER
============================================================ */
const WATTS_LIGHT = 45;
const WATTS_FAN = 20;
const WATTS_PUMP = 10;

const ML_PER_WATERING = 250;
const RM_PER_KWH = 0.218;

let _showAllPlants = false;
let _lastReadings = [];
let _allPlantData = [];

/* ============================================================
   RENDER
============================================================ */
export function render() {
  return `
  <div id="consumptionRoot"
       style="padding:16px;min-height:100%;background:#F8FAFC;color:#0F172A;font-family:'Inter',system-ui,sans-serif;">

    <!-- LOADING -->
    <div id="con-loading" style="text-align:center;padding:60px 0;">
      <div style="font-size:2.5rem;animation:spin 1s linear infinite;display:inline-block;">
        ⚙️
      </div>

      <div style="margin-top:12px;color:#64748B;font-size:0.9rem;font-weight:500;">
        Fetching farm data…
      </div>
    </div>

    <!-- CONTENT -->
    <div id="con-content" style="display:none;">

      <!-- HERO -->
      <div style="
        background:linear-gradient(135deg,#DCFCE7,#F0FDF4);
        border:1px solid #BBF7D0;
        border-radius:24px;
        padding:24px;
        margin-bottom:16px;
        text-align:center;
        position:relative;
        overflow:hidden;
        box-shadow:0 4px 16px rgba(22,163,74,0.08);
      ">

        <div style="
          position:absolute;
          top:-20px;
          right:-20px;
          font-size:5rem;
          opacity:0.12;
        ">
          🌱
        </div>

        <div id="con-grade"
             style="
              font-size:3.4rem;
              font-weight:900;
              color:#16A34A;
              line-height:1;
             ">
          —
        </div>

        <div style="
          margin-top:6px;
          color:#15803D;
          font-size:0.85rem;
          font-weight:700;
        ">
          Eco Efficiency Rating
        </div>

        <div id="con-grade-note"
             style="
              margin-top:8px;
              color:#166534;
              font-size:0.75rem;
             ">
          Calculating…
        </div>

      </div>

      <!-- KPI -->
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:12px;
        margin-bottom:16px;
      ">

        <div class="kpi-card">
          <div>💧</div>

          <div id="con-water-today" class="kpi-value" style="color:#2563EB;">
            —
          </div>

          <div class="kpi-label">
            Water Used Today
          </div>

          <div id="con-water-vs" class="kpi-sub"></div>
        </div>

        <div class="kpi-card">
          <div>⚡</div>

          <div id="con-energy-today" class="kpi-value" style="color:#D97706;">
            —
          </div>

          <div class="kpi-label">
            Energy Used Today
          </div>

          <div id="con-energy-vs" class="kpi-sub"></div>
        </div>

        <div class="kpi-card">
          <div>🌿</div>

          <div id="con-co2" class="kpi-value" style="color:#16A34A;">
            —
          </div>

          <div class="kpi-label">
            CO₂ Offset Today
          </div>
        </div>

        <div class="kpi-card">
          <div>💰</div>

          <div id="con-cost-saved" class="kpi-value" style="color:#16A34A;">
            —
          </div>

          <div class="kpi-label">
            Saved vs Traditional
          </div>

          <div id="con-cost-sub"
               style="margin-top:2px;color:#64748B;font-size:0.65rem;">
          </div>
        </div>

      </div>

      <!-- WATER CHART -->
      <div class="section-card">

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
        ">

          <div style="font-weight:700;">
            💧 Water Level — Real vs Ideal
          </div>

          <div id="water-ideal-badge"
               style="
                display:none;
                font-size:0.65rem;
                background:#DCFCE7;
                color:#15803D;
                padding:4px 8px;
                border-radius:10px;
               ">
          </div>
        </div>

        <div style="position:relative;width:100%;height:220px;">
          <canvas id="con-water-chart"></canvas>
        </div>

        <div id="con-water-summary"
             style="
              display:none;
              margin-top:10px;
              padding:10px;
              background:#F8FAFC;
              border-radius:10px;
              font-size:0.74rem;
             ">
        </div>

      </div>

      <!-- ENERGY CHART -->
      <div class="section-card">

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
        ">

          <div style="font-weight:700;">
            ⚡ Energy Usage — Your Farm vs Traditional
          </div>

          <div id="energy-trad-badge"
               style="
                display:none;
                font-size:0.65rem;
                background:#FEF2F2;
                color:#B91C1C;
                padding:4px 8px;
                border-radius:10px;
               ">
          </div>

        </div>

        <div style="position:relative;width:100%;height:220px;">
          <canvas id="con-energy-chart"></canvas>
        </div>

        <div id="con-energy-summary"
             style="
              display:none;
              margin-top:10px;
              padding:10px;
              background:#F8FAFC;
              border-radius:10px;
              font-size:0.74rem;
             ">
        </div>

      </div>

      <!-- PLANTS -->
      <div class="section-card">

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:6px;
        ">

          <div style="font-weight:800;">
            🌾 Vertical vs Traditional Farming
          </div>

          <span style="font-size:0.65rem;color:#64748B;">
            FAO / USDA
          </span>

        </div>

        <div id="con-plant-cards"></div>

        <div id="con-view-all-wrap"
             style="display:none;text-align:center;margin-top:12px;">

          <button id="con-view-all-btn"
                  style="
                    padding:8px 18px;
                    border-radius:20px;
                    border:1px solid #2563EB;
                    background:#FFF;
                    color:#2563EB;
                    font-weight:700;
                    cursor:pointer;
                  ">
            View All
          </button>

        </div>

        <div id="con-trad-bars"
             style="
              display:flex;
              flex-direction:column;
              gap:14px;
              margin-top:16px;
             ">
        </div>

        <div id="con-monthly-savings"
             style="
              display:none;
              margin-top:14px;
              background:linear-gradient(135deg,#F0FDF4,#EFF6FF);
              padding:16px;
              border-radius:14px;
              border:1px solid #BBF7D0;
             ">
        </div>

      </div>

      <!-- AI -->
      <div class="section-card">

        <div style="
          display:flex;
          align-items:center;
          gap:8px;
          margin-bottom:10px;
        ">

          <span>🤖</span>

          <span style="font-weight:700;">
            Groq AI Sustainability Insight
          </span>

          <div id="con-ai-spinner"
               style="
                width:14px;
                height:14px;
                border:2px solid #BFDBFE;
                border-top-color:#2563EB;
                border-radius:50%;
                animation:spin 0.8s linear infinite;
               ">
          </div>

        </div>

        <div id="con-ai-text"
             style="
              color:#475569;
              font-size:0.82rem;
              line-height:1.6;
              font-style:italic;
             ">
          Requesting real agricultural analysis from Groq AI…
        </div>

        <div id="con-ai-source"
             style="
              display:none;
              margin-top:8px;
              font-size:0.65rem;
              color:#94A3B8;
              font-weight:600;
             ">
          Powered by Groq Llama 3.1
        </div>

      </div>

      <!-- BREAKDOWN -->
      <div class="section-card">

        <div style="font-weight:700;margin-bottom:12px;">
          📊 Equipment Usage
        </div>

        <div id="con-breakdown"></div>

      </div>

      <!-- ECO TIPS -->
      <div class="section-card">

        <div style="font-weight:700;margin-bottom:12px;">
          💡 Eco Tips
        </div>

        <div id="con-ai-tips"></div>

      </div>

      <div id="con-last-updated"
           style="
            text-align:center;
            color:#94A3B8;
            font-size:0.68rem;
            padding-bottom:16px;
           ">
      </div>

    </div>

    <!-- ERROR -->
    <div id="con-error"
         style="display:none;text-align:center;padding:40px 16px;">

      <div style="font-size:2.5rem;">⚠️</div>

      <div style="color:#DC2626;font-weight:700;margin-top:12px;">
        Could not connect to backend.
      </div>

      <button id="con-retry-btn"
              style="
                margin-top:20px;
                padding:10px 24px;
                background:#EFF6FF;
                color:#2563EB;
                border:1px solid #BFDBFE;
                border-radius:12px;
                font-weight:600;
                cursor:pointer;
              ">
        🔄 Retry
      </button>

    </div>

  </div>

  <style>

    @keyframes spin {
      to { transform:rotate(360deg); }
    }

    .section-card{
      background:#FFF;
      border-radius:16px;
      padding:16px;
      margin-bottom:12px;
      border:1px solid #E2E8F0;
    }

    .kpi-card{
      background:#FFF;
      border-radius:16px;
      padding:16px;
      border:1px solid #E2E8F0;
    }

    .kpi-value{
      margin:4px 0;
      font-size:1.5rem;
      font-weight:800;
    }

    .kpi-label{
      color:#64748B;
      font-size:0.75rem;
    }

    .kpi-sub{
      margin-top:4px;
      color:#16A34A;
      font-weight:700;
      font-size:0.7rem;
    }

    .cprog{
      background:#F1F5F9;
      border-radius:100px;
      height:9px;
      overflow:hidden;
    }

    .cprog-fill{
      height:100%;
      border-radius:100px;
      transition:width 0.7s ease;
    }

  </style>
  `;
}

/* ============================================================
   INIT
============================================================ */
export async function init() {

  _showAllPlants = false;
  _allPlantData = [];

  document
    .getElementById('con-retry-btn')
    ?.addEventListener('click', _loadData);

  await _loadData();
}

/* ============================================================
   LOAD DATA
============================================================ */
async function _loadData() {

  _show('loading');

  try {

    const deviceId =
      AppState.currentFarmId || 'farm_001';

    const hRes = await fetch(
      `${BASE_URL}/api/sensors/history?deviceId=${deviceId}&limit=24`
    );

    const hData =
      hRes.ok ? await hRes.json() : {};

    const readings =
      hData.readings?.length > 0
        ? hData.readings
        : _mockReadings();

    await _processData(readings, !hRes.ok);

  } catch {

    await _processData(_mockReadings(), true);
  }
}

/* ============================================================
   PROCESS DATA
============================================================ */
async function _processData(readings, isMock) {
 
  _show('content');
  _lastReadings = readings;
 
  const metrics = _calcMetrics(readings);
 
  _el('con-water-today').textContent  = `${metrics.waterLiters.toFixed(2)} L`;
  _el('con-energy-today').textContent = `${metrics.energyKwh.toFixed(3)} kWh`;
  _el('con-co2').textContent          = `${metrics.co2Saved.toFixed(2)} kg`;
 
  _renderBreakdown(metrics);
  _renderEcoTips(readings, metrics);
 
  const ts = readings[0]?.createdAt || new Date();
  _el('con-last-updated').textContent =
    `${isMock ? '⚡ Demo mode · ' : ''}Last updated: ${new Date(ts).toLocaleString('en-MY')}`;
 
  await _loadChartLib();
 
  _renderCharts(readings, metrics, { min: 65, max: 80, mid: 72 }, 3.0);
 
  _fetchAI(metrics, readings, isMock);
}

/* ============================================================
   FETCH AI (WITH TIMEOUT & MOCK FALLBACK)
============================================================ */
async function _fetchAI(metrics, readings, isMock) {
  const allPlants = _getPlants(); // No more hardcoded lettuce, strictly reads from AppState

  // Helper for applying fallback UI
  const applyFallback = (msg) => {
    _el('con-ai-spinner').style.display = 'none';
    _el('con-ai-text').textContent = msg;
    
    const fallbackPd = allPlants.map(name => _benchmarkFallback(name.toLowerCase().trim()));
    _allPlantData = fallbackPd;
    _renderPlantCards(fallbackPd, false);
    _renderCompBars(fallbackPd, metrics);
    
    // Check if we actually have plants before accessing [0]
    _el('con-water-vs').textContent   = fallbackPd[0] ? `↓ ${fallbackPd[0].waterSavePct}% vs traditional` : `vs traditional`;
    _el('con-energy-vs').textContent  = fallbackPd[0] ? `↓ ${fallbackPd[0].energySavePct}% vs traditional` : `vs traditional`;
    _el('con-cost-saved').textContent = `RM 0.00/day`;
    _el('con-cost-sub').textContent   = `RM 0.00/mo`;
  };

  // If Demo Data -> Don't Call AI, direct fallback
  if (isMock) {
    console.log('[ConsumptionPage] Demo mode detected, skipping AI.');
    applyFallback('Demo mode active — showing benchmark data.');
    return;
  }

  const aiPlants = allPlants.slice(0, 3);
  const restPlants = allPlants.slice(3);

  try {
    // 8 Seconds Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${BASE_URL}/api/consumption/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plants: aiPlants, 
        metrics,
        sensorHistory: readings,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // Combine AI results with mock data for remaining plants
    const mockPd = restPlants.map(name => _benchmarkFallback(name.toLowerCase().trim()));
    const combinedPd = [...(data.plantData || []), ...mockPd];

    const rb    = data.ruleBasedSummary || {};
    const iz    = data.idealWaterZone || { min: 65, max: 80, mid: 72 };
    const tradE = data.traditionalEnergyPerDay || 3.0;

    _el('con-water-vs').textContent   = rb.waterSavePct ? `↓ ${rb.waterSavePct}% vs traditional` : 'vs traditional';
    _el('con-energy-vs').textContent  = combinedPd[0] ? `↓ ${combinedPd[0].energySavePct || 0}% vs traditional` : 'vs traditional';
    _el('con-cost-saved').textContent = rb.dailySavingsRm ? `RM ${rb.dailySavingsRm.toFixed(2)}/day` : 'RM 0.00/day';
    _el('con-cost-sub').textContent   = rb.monthlySavingsRm ? `RM ${rb.monthlySavingsRm}/mo` : 'RM 0.00/mo';

    _renderCharts(readings, metrics, iz, tradE);
    _allPlantData = combinedPd;
    _renderPlantCards(combinedPd, false);
    _renderCompBars(combinedPd, metrics);
    _renderMonthlySavings(rb);

    if (data.aiGrowDaysComputed && data.sensorStats) {
      _renderSensorStatsBanner(data.sensorStats);
    }

    _el('con-ai-spinner').style.display = 'none';
    _el('con-ai-text').textContent      = data.aiNarrative || '—';
    _el('con-ai-text').style.fontStyle  = 'normal';
    _el('con-ai-source').style.display  = 'block';

  } catch (err) {
    console.warn('[ConsumptionPage] AI fetch failed:', err.message);
    const isTimeout = err.name === 'AbortError';
    applyFallback(isTimeout ? 'AI analysis timed out — showing benchmark data.' : 'AI analysis unavailable — showing benchmark data.');
  }
}

/* ============================================================
   CHART LIB
============================================================ */
async function _loadChartLib() {

  if (window.Chart) return;

  await new Promise((ok, fail) => {

    const s =
      document.createElement('script');

    s.src =
      'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';

    s.onload = ok;
    s.onerror = fail;

    document.head.appendChild(s);
  });
}

/* ============================================================
   CHARTS
============================================================ */
function _renderCharts(
  readings,
  metrics,
  idealZone,
  traditionalEnergyPerDay
) {

  const labels =
    readings.map((_, i) => `${i}:00`);

  /* ============================================================
     WATER DATA (%)
  ============================================================ */

  const waterData =
    readings.map(r =>
      Number(r.waterLevel ?? 70)
    );

  const izMin =
    idealZone.min;

  const izMax =
    idealZone.max;

  const inRange =
    waterData.filter(
      v => v >= izMin && v <= izMax
    ).length;

  const pct =
    Math.round(
      (inRange / waterData.length) * 100
    );

  /* ============================================================
     ENERGY DATA (kWh PER HOUR)
  ============================================================ */

  const energyData =
    readings.map(r => {

      const lr =
        r.lightRaw ?? 2000;

      const t =
        r.temperature ?? 25;

      const watts =
        (lr < 1500 ? WATTS_LIGHT : 0) +
        (t > 28 ? WATTS_FAN : 0) +
        WATTS_PUMP * 0.1;

      return Number(
        (watts / 1000).toFixed(3)
      );
    });

  const traditionalPerHour =
    Number(
      (traditionalEnergyPerDay / 24).toFixed(3)
    );

  const totalEnergy = energyData.reduce((a, b) => a + b, 0);
  const traditionalTotal = traditionalPerHour * labels.length;
  
  const energySavePct = Math.max(
    0,
    Math.round((1 - (totalEnergy / (traditionalTotal || 1))) * 100)
  );

  /* ============================================================
     WATER CHART
  ============================================================ */

  const wEl =
    _el('con-water-chart');

  if (wEl) {

    try {
      wEl._chart?.destroy();
    } catch {}

    _el('water-ideal-badge').style.display =
      'block';

    _el('water-ideal-badge').textContent =
      `Ideal ${izMin}%–${izMax}%`;

    wEl._chart =
      new window.Chart(wEl, {

        type:'line',

        data:{
          labels,

          datasets:[

            {
              label:'Ideal Max (%)',

              data:Array(labels.length).fill(izMax),

              borderColor:'rgba(22,163,74,0.45)',
              borderDash:[5,4],
              borderWidth:1.5,

              pointRadius:0,

              fill:'+1',
              backgroundColor:'rgba(22,163,74,0.10)',
            },

            {
              label:'Ideal Min (%)',

              data:Array(labels.length).fill(izMin),

              borderColor:'rgba(22,163,74,0.45)',
              borderDash:[5,4],
              borderWidth:1.5,

              pointRadius:0,
              fill:false,
            },

            {
              label:'Your Farm (%)',

              data:waterData,

              borderColor:'#2563EB',
              borderWidth:2.5,
              tension:0.35,

              pointRadius:3,

              pointBackgroundColor:
                waterData.map(v =>
                  v < izMin
                    ? '#DC2626'
                    : v > izMax
                      ? '#F59E0B'
                      : '#2563EB'
                ),

              pointBorderColor:'#FFF',
              pointBorderWidth:1.5,
            },
          ],
        },

        options:{

          responsive:true,
          maintainAspectRatio:false,

          plugins:{
            legend:{
              display:true,
            },

            tooltip:{
              callbacks:{
                label(ctx){
                  return `${ctx.dataset.label}: ${ctx.parsed.y}%`;
                },
              },
            },
          },

          scales:{

            x:{
              title:{
                display:true,
                text:'Hour',
              },

              grid:{
                color:'#F1F5F9',
              },

              ticks:{
                color:'#94A3B8',
                font:{
                  size:9,
                },
              },
            },

            y:{
              min:0,
              max:100,

              title:{
                display:true,
                text:'Water Level (%)',
              },

              grid:{
                color:'#F1F5F9',
              },

              ticks:{
                callback:v => `${v}%`,
                color:'#94A3B8',
                font:{
                  size:9,
                },
              },
            },
          },
        },
      });

    const ws =
      _el('con-water-summary');

    ws.style.display = 'block';

    ws.innerHTML = `
      <span style="font-weight:700;color:#16A34A;">
        ${pct}% of readings stayed in ideal range
      </span>
      · Recommended zone:
      ${izMin}%–${izMax}%
    `;
  }

  /* ============================================================
     ENERGY CHART
  ============================================================ */

  const eEl =
    _el('con-energy-chart');

  if (eEl) {

    try {
      eEl._chart?.destroy();
    } catch {}

    _el('energy-trad-badge').style.display =
      'block';

    _el('energy-trad-badge').textContent =
      `↓ ${energySavePct}% vs traditional`;

    eEl._chart =
      new window.Chart(eEl, {

        data:{
          labels,

          datasets:[

            {
              type:'line',

              label:'Traditional Farm (kWh/hr)',

              data:Array(labels.length).fill(traditionalPerHour),

              borderColor:'#DC2626',
              borderDash:[6,4],
              borderWidth:2,

              pointRadius:0,

              tension:0,
            },

            {
              type:'bar',

              label:'Your Farm (kWh/hr)',

              data:energyData,

              borderRadius:6,
            },
          ],
        },

        options:{

          responsive:true,
          maintainAspectRatio:false,

          plugins:{

            legend:{
              display:true,
            },

            tooltip:{
              callbacks:{
                label(ctx){
                  return `${ctx.dataset.label}: ${ctx.parsed.y} kWh`;
                },
              },
            },
          },

          scales:{

            x:{
              title:{
                display:true,
                text:'Hour',
              },

              grid:{
                color:'#F8FAFC',
              },

              ticks:{
                color:'#94A3B8',
                font:{
                  size:9,
                },
              },
            },

            y:{
              beginAtZero:true,

              title:{
                display:true,
                text:'Energy (kWh per hour)',
              },

              grid:{
                color:'#F1F5F9',
              },

              ticks:{
                callback:v => `${v} kWh`,
                color:'#94A3B8',
                font:{
                  size:9,
                },
              },
            },
          },
        },
      });

    const es =
      _el('con-energy-summary');

    es.style.display = 'block';

    es.innerHTML = `
      <span style="font-weight:700;color:#D97706;">
        ${totalEnergy.toFixed(2)} kWh used today
      </span>
      · Traditional farm estimate:
      ${traditionalTotal.toFixed(2)} kWh/day
    `;
  }

  /* ============================================================
     ECO GRADE
  ============================================================ */

  // 5 dimensions, each 0-20 points = 100 max
  let score = 0;
  const breakdown = [];

  // 1. Water stability (how often in ideal zone)
  const waterScore = Math.round((pct / 100) * 20);
  score += waterScore;
  breakdown.push({ label: '💧 Water Stability', score: waterScore, max: 20, detail: `${pct}% readings in ideal zone` });

  // 2. Energy efficiency vs traditional
  const energyRatio = totalEnergy / (traditionalTotal || 1);
  const energyScore = Math.round(Math.max(0, (1 - energyRatio)) * 20);
  score += energyScore;
  breakdown.push({ label: '⚡ Energy Efficiency', score: energyScore, max: 20, detail: `${energySavePct}% less than traditional` });

  // 3. Water usage vs traditional
  const waterUsed = metrics.waterLiters;
  const tradWaterPerDay = traditionalEnergyPerDay > 0 ? 55 : 55; // avg traditional
  const waterSaveRatio = Math.max(0, 1 - (waterUsed / tradWaterPerDay));
  const waterUsageScore = Math.round(waterSaveRatio * 20);
  score += waterUsageScore;
  breakdown.push({ label: '🌿 Water Conservation', score: waterUsageScore, max: 20, detail: `${waterUsed.toFixed(1)}L used vs ~${tradWaterPerDay}L traditional` });

  // 4. Light hours (more consistent = better)
  const lightScore = Math.round(Math.min(metrics.lightHours / 12, 1) * 20);
  score += lightScore;
  breakdown.push({ label: '☀️ Light Consistency', score: lightScore, max: 20, detail: `${metrics.lightHours}h grow light detected` });

  // 5. Temperature control (fewer fan activations = more stable)
  const tempScore = Math.round(Math.max(0, 1 - (metrics.fanHours / 24)) * 20);
  score += tempScore;
  breakdown.push({ label: '🌡️ Temp Control', score: tempScore, max: 20, detail: `${metrics.fanHours}h cooling needed` });

  // Grade
  let grade, gradeColor, note;
  if      (score >= 88) { grade = 'A+'; gradeColor = '#16A34A'; note = 'Excellent — your farm is operating at peak sustainability'; }
  else if (score >= 75) { grade = 'A';  gradeColor = '#16A34A'; note = 'Very efficient — minor improvements possible'; }
  else if (score >= 62) { grade = 'B+'; gradeColor = '#2563EB'; note = 'Good performance — a few areas to optimise'; }
  else if (score >= 50) { grade = 'B';  gradeColor = '#2563EB'; note = 'Average — review water and energy usage'; }
  else if (score >= 38) { grade = 'C';  gradeColor = '#D97706'; note = 'Below average — action recommended'; }
  else                  { grade = 'D';  gradeColor = '#DC2626'; note = 'Poor — significant inefficiencies detected'; }

  _el('con-grade').textContent = grade;
  _el('con-grade').style.color = gradeColor;
  _el('con-grade-note').textContent = `${note} · Score: ${score}/100`;

  // Render breakdown bars inside hero card
  const heroCard = _el('con-grade')?.closest('div[style*="linear-gradient"]');
  let breakdownEl = document.getElementById('con-grade-breakdown');
  if (!breakdownEl && heroCard) {
    breakdownEl = document.createElement('div');
    breakdownEl.id = 'con-grade-breakdown';
    breakdownEl.style.cssText = 'margin-top:16px;display:flex;flex-direction:column;gap:8px;text-align:left;';
    heroCard.appendChild(breakdownEl);
  }

  if (breakdownEl) {
    breakdownEl.innerHTML = breakdown.map(b => `
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.68rem;margin-bottom:3px;">
          <span style="font-weight:600;color:#166534;">${b.label}</span>
          <span style="color:#15803D;font-weight:700;">${b.score}/${b.max}</span>
        </div>
        <div style="background:rgba(255,255,255,0.5);border-radius:100px;height:6px;overflow:hidden;">
          <div style="
            width:${(b.score/b.max)*100}%;
            height:100%;
            background:#16A34A;
            border-radius:100px;
            transition:width 0.8s ease;
          "></div>
        </div>
        <div style="font-size:0.6rem;color:#166534;margin-top:2px;">${b.detail}</div>
      </div>
    `).join('');
  }
}

/* ============================================================
   PLANT CARDS
============================================================ */
function _renderPlantCards(plantData, showAll) {

  if (!plantData || plantData.length === 0) {
    _el('con-plant-cards').innerHTML = '<div style="text-align:center;padding:16px;color:#94A3B8;font-size:0.8rem;">No plants detected in your farm racks. Add plants to see benchmark comparisons.</div>';
    _el('con-view-all-wrap').style.display = 'none';
    return;
  }

  const toShow =
    showAll
      ? plantData
      : plantData.slice(0, 3);

  const hasMore =
    plantData.length > 3;

  _el('con-plant-cards').innerHTML =
    toShow.map(_plantCardHtml).join('');

  const wrap =
    _el('con-view-all-wrap');

  const btn =
    _el('con-view-all-btn');

  if (hasMore) {

    wrap.style.display = 'block';

    btn.textContent =
      showAll
        ? '↑ Show Less'
        : `View All ${plantData.length} Plants →`;

    btn.onclick = () => {

      _showAllPlants =
        !_showAllPlants;

      _renderPlantCards(
        _allPlantData,
        _showAllPlants
      );
    };

  } else {

    wrap.style.display = 'none';
  }
}

function _plantCardHtml(p) {
 
  const hasAI = p.yourFarm && p.aiGrowDays;
 
  // Grow days comparison row
  const growDaysRow = hasAI
    ? `
      <div style="
        background:#F0FDF4;
        border:1px solid #BBF7D0;
        border-radius:10px;
        padding:10px;
        margin-top:8px;
      ">
        <div style="font-size:0.7rem;font-weight:800;color:#15803D;margin-bottom:6px;">
          🤖 AI Grow Day Prediction (from your sensors)
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center;">
          <div>
            <div style="font-size:1.0rem;font-weight:900;color:#2563EB;">
              ${p.aiGrowDays}d
            </div>
            <div style="font-size:0.65rem;color:#64748B;">Your Farm</div>
          </div>
          <div>
            <div style="font-size:1.0rem;font-weight:900;color:#16A34A;">
              ${p.vertical.growDays}d
            </div>
            <div style="font-size:0.65rem;color:#64748B;">VF Benchmark</div>
          </div>
          <div>
            <div style="font-size:1.0rem;font-weight:900;color:#DC2626;">
              ${p.traditional.growDays}d
            </div>
            <div style="font-size:0.65rem;color:#64748B;">Traditional</div>
          </div>
        </div>
       ${p.agronomicNote ? `
<div style="
  margin-top:8px;
  padding:8px;
  background:#F0FDF4;
  border-left:3px solid #16A34A;
  border-radius:0 6px 6px 0;
  font-size:0.68rem;
  color:#166534;
  line-height:1.5;
">
  💡 ${p.agronomicNote}
</div>` : ''}
      </div>
    `
    : `
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:6px;
        margin-top:8px;
        font-size:0.72rem;
        color:#64748B;
        text-align:center;
      ">
        <div>
          <div style="font-weight:700;color:#2563EB;">
            ${p.vertical.growDays}d
          </div>
          <div>VF benchmark</div>
        </div>
        <div>
          <div style="font-weight:700;color:#DC2626;">
            ${p.traditional.growDays}d
          </div>
          <div>Traditional</div>
        </div>
      </div>
    `;
 
  return `
    <div style="
      background:#F8FAFC;
      border-radius:14px;
      padding:14px;
      border:1px solid #E2E8F0;
      margin-bottom:10px;
    ">
 
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="font-size:1.5rem;">${p.emoji || '🌱'}</span>
        <div style="flex:1;">
          <div style="font-weight:800;">${p.name}</div>
          ${p.source ? `<div style="font-size:0.62rem;color:#94A3B8;">${p.source}</div>` : ''}
        </div>
        <div style="font-size:1.1rem;font-weight:900;color:#16A34A;">↓${p.waterSavePct || 0}% water</div>
      </div>
 
      <!-- Water / Energy comparison -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
 
        <div style="background:#EFF6FF;padding:10px;border-radius:10px;">
          <div style="font-size:0.7rem;font-weight:800;color:#1D4ED8;margin-bottom:6px;">
            🏭 Vertical Farm
          </div>
          <div>💧 ${p.vertical.waterPerDayL} L/day</div>
          <div>⚡ ${p.vertical.energyKwhPerDay} kWh/day</div>
        </div>
 
        <div style="background:#FEF2F2;padding:10px;border-radius:10px;">
          <div style="font-size:0.7rem;font-weight:800;color:#B91C1C;margin-bottom:6px;">
            🌾 Traditional
          </div>
          <div>💧 ${p.traditional.waterPerDayL} L/day</div>
          <div>⚡ ${p.traditional.energyKwhPerDay} kWh/day</div>
        </div>
 
      </div>
 
      <!-- Grow days (AI predicted or benchmark) -->
      ${growDaysRow}
 
    </div>
  `;
}

/* ============================================================
   COMPARISON BARS
============================================================ */
function _renderCompBars(
  plantData,
  metrics
) {

  const p = plantData[0];

  if (!p) {
    _el('con-trad-bars').innerHTML = '<div style="text-align:center;padding:16px;color:#94A3B8;font-size:0.8rem;">Add plants to unlock comparative charts.</div>';
    return;
  }

  const bars = [

    {
      label:'💧 Water',
      yours:metrics.waterLiters,
      trad:p.traditional?.waterPerDayL || 1,
      unit:'L',
      color:'#2563EB',
    },

    {
      label:'⚡ Energy',
      yours:metrics.energyKwh,
      trad:p.traditional?.energyKwhPerDay || 1,
      unit:'kWh',
      color:'#D97706',
    },
  ];

  _el('con-trad-bars').innerHTML =
    bars.map(b => {

      const pct =
        b.trad > 0
          ? Math.min(
              100,
              (b.yours / b.trad) * 100
            )
          : 0;

      return `
        <div>

          <div style="
            display:flex;
            justify-content:space-between;
            margin-bottom:6px;
          ">

            <span>${b.label}</span>

            <span>
              ${b.yours.toFixed(2)} ${b.unit}
            </span>

          </div>

          <div class="cprog">

            <div class="cprog-fill"
                 style="
                  width:${pct}%;
                  background:${b.color};
                 ">
            </div>

          </div>

        </div>
      `;
    }).join('');
}

/* ============================================================
   MONTHLY SAVINGS
============================================================ */
function _renderMonthlySavings(rb) {

  const el =
    _el('con-monthly-savings');

  if (!rb || !el) return;

  el.style.display = 'block';

  el.innerHTML = `
    <div style="
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      gap:8px;
      text-align:center;
    ">

      <div>

        <div style="
          font-size:1.2rem;
          font-weight:900;
          color:#2563EB;
        ">
          ${rb.monthlySavingsL || 0}L
        </div>

        <div style="font-size:0.65rem;">
          water/mo
        </div>

      </div>

      <div>

        <div style="
          font-size:1.2rem;
          font-weight:900;
          color:#16A34A;
        ">
          RM${rb.monthlySavingsRm || 0}
        </div>

        <div style="font-size:0.65rem;">
          saved/mo
        </div>

      </div>

      <div>

        <div style="
          font-size:1.2rem;
          font-weight:900;
          color:#0D9488;
        ">
          RM${rb.yearlySavingsRm || 0}
        </div>

        <div style="font-size:0.65rem;">
          saved/yr
        </div>

      </div>

    </div>
  `;
}

/* ============================================================
   BREAKDOWN
============================================================ */
function _renderBreakdown(m) {
  const items = [
    {
      icon: '💡',
      label: 'Grow Lights',
      value: `${m.lightHours}h today`,
      kwh: +((m.lightHours * WATTS_LIGHT) / 1000).toFixed(3),
      pct: Math.round((m.lightHours / 24) * 100),
      color: '#D97706',
    },
    {
      icon: '🌀',
      label: 'Cooling Fan',
      value: `${m.fanHours}h today`,
      kwh: +((m.fanHours * WATTS_FAN) / 1000).toFixed(3),
      pct: Math.round((m.fanHours / 24) * 100),
      color: '#2563EB',
    },
    {
      icon: '💧',
      label: 'Water Pump',
      value: `${m.waterActivations} activations`,
      kwh: +((m.waterActivations * WATTS_PUMP) / 1000).toFixed(3),
      pct: Math.round((m.waterActivations / 24) * 100),
      color: '#0D9488',
    },
  ];

  const totalKwh = items.reduce((s, i) => s + i.kwh, 0);

  _el('con-breakdown').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${items.map(item => {
        const sharePct = totalKwh > 0 ? Math.round((item.kwh / totalKwh) * 100) : 0;
        return `
          <div style="background:#F8FAFC;border-radius:12px;padding:12px;border:1px solid #E2E8F0;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:1.2rem;">${item.icon}</span>
                <span style="font-weight:700;font-size:0.85rem;">${item.label}</span>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:800;font-size:0.85rem;color:${item.color};">${item.kwh} kWh</div>
                <div style="font-size:0.62rem;color:#94A3B8;">${sharePct}% of total</div>
              </div>
            </div>
            <div style="background:#E2E8F0;border-radius:100px;height:7px;overflow:hidden;">
              <div style="
                width:${sharePct}%;
                height:100%;
                background:${item.color};
                border-radius:100px;
                transition:width 0.7s ease;
              "></div>
            </div>
            <div style="font-size:0.65rem;color:#64748B;margin-top:5px;">${item.value} · ${item.pct}% of day active</div>
          </div>
        `;
      }).join('')}
      <div style="
        background:linear-gradient(135deg,#FFF7ED,#FFFBEB);
        border:1px solid #FDE68A;
        border-radius:12px;
        padding:12px;
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">
        <span style="font-weight:700;font-size:0.85rem;color:#92400E;">⚡ Total Equipment</span>
        <span style="font-weight:900;font-size:1rem;color:#D97706;">${totalKwh.toFixed(3)} kWh</span>
      </div>
    </div>
  `;
}

/* ============================================================
   ECO TIPS
============================================================ */
function _renderEcoTips(readings, m) {
  const tips = [];

  // Light
  if (m.lightHours > 16) {
    tips.push({
      icon: '💡',
      severity: 'warning',
      title: 'Grow lights running too long',
      detail: `${m.lightHours}h detected today. Most crops only need 14–16h. Reducing by ${m.lightHours - 14}h could save ${(((m.lightHours - 14) * WATTS_LIGHT) / 1000).toFixed(2)} kWh/day.`,
    });
  } else if (m.lightHours < 8) {
    tips.push({
      icon: '💡',
      severity: 'danger',
      title: 'Light hours too low',
      detail: `Only ${m.lightHours}h detected. Most crops need at least 12–16h for healthy growth. Check your light schedule.`,
    });
  } else {
    tips.push({
      icon: '💡',
      severity: 'good',
      title: 'Light schedule is healthy',
      detail: `${m.lightHours}h is within the recommended 12–16h range for most leafy crops.`,
    });
  }

  // Temperature / fan
  if (m.fanHours > 8) {
    tips.push({
      icon: '🌡️',
      severity: 'warning',
      title: 'High cooling demand',
      detail: `Fan ran ${m.fanHours}h today (temp exceeded 28°C). Consider shading or improving ventilation to reduce energy cost.`,
    });
  } else if (m.fanHours === 0) {
    tips.push({
      icon: '🌡️',
      severity: 'good',
      title: 'Temperature well controlled',
      detail: 'No cooling needed today — temperature stayed below 28°C throughout.',
    });
  }

  // Water pump
  if (m.waterActivations > 15) {
    tips.push({
      icon: '💧',
      severity: 'warning',
      title: 'Frequent pump activations',
      detail: `${m.waterActivations} activations today suggests soil drying out quickly. Check for leaks or increase reservoir capacity.`,
    });
  } else if (m.waterActivations === 0) {
    tips.push({
      icon: '💧',
      severity: 'danger',
      title: 'No pump activity detected',
      detail: 'Zero watering events today. Verify pump is working and soil moisture sensor is connected.',
    });
  } else {
    tips.push({
      icon: '💧',
      severity: 'good',
      title: 'Water usage is efficient',
      detail: `${m.waterActivations} pump activations used ${m.waterLiters?.toFixed(2) ?? '—'}L today — well within vertical farm targets.`,
    });
  }

  // Energy total
  if (m.energyKwh > 2) {
    tips.push({
      icon: '⚡',
      severity: 'warning',
      title: 'Above average energy use',
      detail: `${m.energyKwh.toFixed(2)} kWh today is higher than the vertical farm benchmark of ~0.27 kWh. Review light and fan schedules.`,
    });
  }

  const colorMap = {
    good:    { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D', dot: '#16A34A' },
    warning: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', dot: '#D97706' },
    danger:  { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', dot: '#DC2626' },
  };

  _el('con-ai-tips').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${tips.map(t => {
        const c = colorMap[t.severity];
        return `
          <div style="
            background:${c.bg};
            border:1px solid ${c.border};
            border-radius:12px;
            padding:12px;
            display:flex;
            gap:10px;
            align-items:flex-start;
          ">
            <div style="
              width:8px;height:8px;
              border-radius:50%;
              background:${c.dot};
              margin-top:4px;
              flex-shrink:0;
            "></div>
            <div>
              <div style="font-weight:700;font-size:0.78rem;color:${c.text};margin-bottom:3px;">
                ${t.icon} ${t.title}
              </div>
              <div style="font-size:0.7rem;color:${c.text};line-height:1.5;opacity:0.85;">
                ${t.detail}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ============================================================
   METRICS
============================================================ */
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

  const waterLiters =
    (waterAct * ML_PER_WATERING) / 1000;

  const energyKwh =
    (
      (lightH * WATTS_LIGHT) +
      (fanH * WATTS_FAN) +
      (waterAct * WATTS_PUMP)
    ) / 1000;

  const co2Saved =
    Math.max(
      (60 - waterLiters) * 0.035,
      0.5
    );

  return {

    waterLiters:
      Math.max(waterLiters, 0.05),

    energyKwh:
      Math.max(energyKwh, 0.01),

    co2Saved,

    waterActivations:waterAct,
    lightHours:lightH,
    fanHours:fanH,

    totalReadings:readings.length,
  };
}

/* ============================================================
   GET PLANTS
============================================================ */
/*function _getPlants() {
  const names = new Set();

  const tiles = AppState.tiles || [];
  tiles.forEach(tile => {
    if (tile.name && tile.status !== 'empty') {
      names.add(tile.name.toLowerCase().trim());
    }
  });

  // NO MORE HARDCODED LETTUCE! Return exactly what's planted.
  return [...names];
}*/
/* ══════════════════════════════════════════════
   GET PLANTS (嚴格篩選版)
══════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   GET PLANTS (強化版過濾)
══════════════════════════════════════════════════════════════ */
function _getPlants() {
  const names = new Set();
  const tiles = AppState.tiles || [];

  // 定義一個無效名稱清單，過濾掉那些其實是空的佔位符
  const invalidNames = ['empty', 'none', 'placeholder', 'undefined', 'null', ''];

  tiles.forEach(tile => {
    const name = tile.name ? String(tile.name).toLowerCase().trim() : '';
    
    // 嚴格檢查：
    // 1. status 必須不是 empty
    // 2. name 必須存在且長度大於 0
    // 3. name 不能是我們定義的無效名稱
    if (tile.status !== 'empty' && name && !invalidNames.includes(name)) {
      names.add(name);
    }
  });

  const result = [...names];
  console.log('[ConsumptionPage] Final Filtered plants (Cleaned):', result);
  
  return result; 
}
/* ============================================================
   FALLBACK CARD
============================================================ */
function _benchmarkFallback(nameOrKey) {
  // Maps to actual crop DB benchmarks (not fake hardcoded numbers)
  const BENCHMARK_MAP = {
    lettuce: { name:'Lettuce', emoji:'🥬', waterPerDayL:2.0, energyKwhPerDay:0.27, growDays:30,
      tWater:45, tEnergy:1.6, tGrowDays:60 },
    spinach: { name:'Spinach', emoji:'🥬', waterPerDayL:2.2, energyKwhPerDay:0.22, growDays:25,
      tWater:50, tEnergy:1.8, tGrowDays:50 },
    basil:   { name:'Basil',   emoji:'🌿', waterPerDayL:1.5, energyKwhPerDay:0.20, growDays:28,
      tWater:30, tEnergy:1.2, tGrowDays:50 },
    tomato:  { name:'Tomato',  emoji:'🍅', waterPerDayL:3.5, energyKwhPerDay:0.36, growDays:55,
      tWater:60, tEnergy:2.5, tGrowDays:80 },
    kale:    { name:'Kale',    emoji:'🥬', waterPerDayL:1.8, energyKwhPerDay:0.24, growDays:35,
      tWater:40, tEnergy:1.5, tGrowDays:60 },
    carrot:  { name:'Carrot',  emoji:'🥕', waterPerDayL:2.0, energyKwhPerDay:0.27, growDays:30,
      tWater:45, tEnergy:1.6, tGrowDays:60 },
    potato:  { name:'Potato',  emoji:'🥔', waterPerDayL:2.0, energyKwhPerDay:0.27, growDays:30,
      tWater:45, tEnergy:1.6, tGrowDays:60 },
    cabbage: { name:'Cabbage', emoji:'🥬', waterPerDayL:2.0, energyKwhPerDay:0.27, growDays:30,
      tWater:45, tEnergy:1.6, tGrowDays:60 },
    mint:  { name:'Mint',  emoji:'🌿', waterPerDayL:1.2, energyKwhPerDay:0.18, growDays:22,
  tWater:25, tEnergy:1.0, tGrowDays:40 },
chili: { name:'Chili', emoji:'🌶️', waterPerDayL:3.0, energyKwhPerDay:0.32, growDays:65,
  tWater:50, tEnergy:2.2, tGrowDays:90 },
  };
 
  const key = nameOrKey.toLowerCase().trim();
  const b   = BENCHMARK_MAP[key] || {
    name: nameOrKey, emoji:'🌱',
    waterPerDayL:2.5, energyKwhPerDay:0.27, growDays:35,
    tWater:55, tEnergy:2.0, tGrowDays:65,
  };
 
  const waterSavePct = Math.round(((b.tWater - b.waterPerDayL) / b.tWater) * 100);
 
  return {
    name: b.name,
    emoji: b.emoji,
    source: 'FAO/USDA benchmark (no sensor data)',
    vertical: {
      waterPerDayL:    b.waterPerDayL,
      energyKwhPerDay: b.energyKwhPerDay,
      growDays:        b.growDays,
    },
    traditional: {
      waterPerDayL:    b.tWater,
      energyKwhPerDay: b.tEnergy,
      growDays:        b.tGrowDays,
    },
    yourFarm:   null,
    aiGrowDays: null,
    waterSavePct,
    energySavePct: Math.round(((b.tEnergy - b.energyKwhPerDay) / b.tEnergy) * 100),
  };
}

/* ============================================================
   MOCK DATA
============================================================ */
function _mockReadings() {

  const now =
    Date.now();

  return Array.from(
    { length:24 },
    (_, i) => ({

      temperature:
        22 + Math.sin(i / 4) * 4,

      soilRaw:
        1550 + Math.random() * 650,

      lightRaw:
        700 + Math.random() * 1300,

      waterLevel:
        63 + Math.random() * 25,

      createdAt:
        new Date(
          now - (23 - i) * 3600000
        ).toISOString(),
    })
  );
}

/* ============================================================
   HELPERS
============================================================ */
function _el(id) {
  return document.getElementById(id);
}

function _renderSensorStatsBanner(stats) {
  // Find or create banner element
  let banner = document.getElementById('con-sensor-banner');
  if (!banner) {
    const parent = document.getElementById('con-content');
    banner = document.createElement('div');
    banner.id = 'con-sensor-banner';
    banner.style.cssText = `
      background:linear-gradient(135deg,#EFF6FF,#F0FDF4);
      border:1px solid #BFDBFE;
      border-radius:14px;
      padding:12px 16px;
      margin-bottom:12px;
      font-size:0.72rem;
    `;
    // Insert after hero grade card
    const hero = parent.querySelector('[id="con-grade"]')?.closest('[style*="linear-gradient"]');
    if (hero) hero.insertAdjacentElement('afterend', banner);
    else parent.prepend(banner);
  }
 
  banner.innerHTML = `
    <div style="font-weight:800;color:#1D4ED8;margin-bottom:6px;">
      📡 Live Sensor Summary (24h)
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
      <div>
        <div style="font-weight:700;color:#0F172A;">${stats.avgTemp}°C</div>
        <div style="color:#64748B;">Avg temp</div>
      </div>
      <div>
        <div style="font-weight:700;color:#0F172A;">${stats.DLI} mol/m²/d</div>
        <div style="color:#64748B;">Est. DLI</div>
      </div>
      <div>
        <div style="font-weight:700;color:#0F172A;">${stats.waterStabilityPct}%</div>
        <div style="color:#64748B;">Water stable</div>
      </div>
    </div>
  `;
}

function _show(state) {

  ['loading','content','error']
    .forEach(k => {

      const e =
        _el(`con-${k}`);

      if (e) {

        e.style.display =
          k === state
            ? 'block'
            : 'none';
      }
    });
}