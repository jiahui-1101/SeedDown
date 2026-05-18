/* ============================================================
   MODULE: FEATURE — ECO CONSUMPTION DASHBOARD
   ConsumptionPage.js — self-contained module
   Connects to: GET /api/sensors/history?deviceId=farm_001&limit=24
                GET /api/sensors/latest?deviceId=farm_001
                POST /api/chat  (Groq AI for traditional farming comparison)
   Export: { render, init }
   ============================================================ */

import { AppState } from '../store.js';

/* ── CONSTANTS ── */
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

const WATTS_LIGHT      = 45;
const WATTS_PUMP_WATER = 10;
const WATTS_FAN        = 20;
const ML_PER_WATERING  = 250;
const RM_PER_KWH       = 0.218;

/* ══════════════════════════════════════════════
   RENDER
══════════════════════════════════════════════ */
export function render() {
    return `
    <div id="consumptionRoot" style="padding:16px; min-height:100%; background:#F0F4F8; color:#1A2B3C;">

      <!-- LOADING -->
      <div id="con-loading" style="text-align:center; padding:40px 0;">
        <div style="font-size:2rem; animation:spin 1s linear infinite; display:inline-block;">⚙️</div>
        <div style="margin-top:8px; color:#64748B; font-size:0.85rem;">Fetching farm data…</div>
      </div>

      <!-- MAIN CONTENT -->
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

        <!-- KPI CARDS -->
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

        <!-- WATER CHART -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#2563EB; font-weight:600; margin-bottom:12px;">💧 Water Level (last 24 readings)</div>
          <div style="position:relative; width:100%; height:220px;">
            <canvas id="con-water-chart" style="position:absolute; top:0; left:0; width:100% !important; height:100% !important;"></canvas>
          </div>
        </div>

        <!-- ENERGY CHART -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#D97706; font-weight:600; margin-bottom:12px;">⚡ Energy Usage (last 24 readings)</div>
          <div style="position:relative; width:100%; height:160px;">
            <canvas id="con-energy-chart" style="position:absolute; top:0; left:0; width:100% !important; height:100% !important;"></canvas>
          </div>
        </div>

        <!-- RESOURCE BREAKDOWN -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#1A2B3C; font-weight:600; margin-bottom:12px;">📊 Resource Breakdown</div>
          <div id="con-breakdown" style="display:flex; flex-direction:column; gap:10px;"></div>
        </div>

        <!-- ── AI TRADITIONAL FARMING COMPARISON (NEW) ── -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <div style="color:#1A2B3C; font-weight:600;">🌾 vs Traditional Farming</div>
            <span style="font-size:0.65rem;color:#94A3B8;font-weight:500;">AI Analysis</span>
          </div>
          <div style="font-size:0.72rem;color:#64748B;margin-bottom:12px;">
            Real-world comparison based on your crop types
          </div>

          <!-- Comparison bars (populated by JS) -->
          <div id="con-trad-bars" style="display:flex;flex-direction:column;gap:12px;margin-bottom:14px;"></div>

          <!-- Monthly savings summary -->
          <div id="con-monthly-savings" style="
            background:linear-gradient(135deg,#f0fdf4,#eff6ff);
            border-radius:12px;padding:14px;margin-bottom:12px;
            border:1px solid #bbf7d0;display:none;
          "></div>

          <!-- AI Narrative (Groq) -->
          <div id="con-trad-ai" style="
            background:#F8FAFC;border-left:3px solid #2563EB;
            border-radius:0 12px 12px 0;padding:12px;
            border-top:1px solid #F1F5F9;border-right:1px solid #F1F5F9;border-bottom:1px solid #F1F5F9;
          ">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <span style="font-size:1rem;">🤖</span>
              <span style="font-weight:700;color:#2563EB;font-size:0.82rem;">AI Sustainability Insight</span>
              <div id="con-trad-spinner" style="
                width:14px;height:14px;border:2px solid #BFDBFE;
                border-top-color:#2563EB;border-radius:50%;
                animation:spin 0.8s linear infinite;display:none;
              "></div>
            </div>
            <div id="con-trad-text" style="color:#475569;font-size:0.78rem;line-height:1.5;">
              Analysing your farm's plants and sensor data…
            </div>
          </div>
        </div>

        <!-- AI ECO TIPS -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#1A2B3C; font-weight:600; margin-bottom:12px;">🤖 AI Eco Tips</div>
          <div id="con-ai-tips" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>

        <!-- LAST UPDATED -->
        <div id="con-last-updated" style="text-align:center; color:#94A3B8; font-size:0.7rem; margin-top:12px; padding-bottom:16px;"></div>

      </div><!-- end #con-content -->

      <!-- ERROR STATE -->
      <div id="con-error" style="display:none; text-align:center; padding:40px 16px;">
        <div style="font-size:2rem;">⚠️</div>
        <div style="color:#DC2626; margin-top:8px; font-size:0.9rem;">Could not connect to backend.</div>
        <div style="color:#64748B; font-size:0.75rem; margin-top:4px;">Using simulated data for demo.</div>
        <button id="con-retry-btn" style="margin-top:16px;padding:8px 20px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:12px;cursor:pointer;font-weight:600;">🔄 Retry</button>
      </div>

    </div>
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
      .con-progress-track { background:#E2E8F0;border-radius:100px;height:8px;flex:1;overflow:hidden; }
      .con-progress-fill  { height:100%;border-radius:100px;transition:width 0.6s ease; }
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
            fetch(`${BASE_URL}/api/sensors/latest?deviceId=${deviceId}`),
        ]);
        if (!historyRes.ok || !latestRes.ok) throw new Error('API error');
        const historyData = await historyRes.json();
        const latestData  = await latestRes.json();
        const readings    = historyData.readings || [];
        const latest      = latestData.reading   || null;

        if (readings.length === 0) {
            _renderWithData(_mockReadings(), true);
        } else {
            _renderWithData(readings, false, latest);
        }
    } catch (err) {
        console.warn('[ConsumptionPage] Backend unreachable, using mock data:', err.message);
        _renderWithData(_mockReadings(), true);
    }
}

/* ── RENDER WITH DATA ── */
function _renderWithData(readings, isMock = false, latest = null) {
    _showState('content');

    const metrics = _calculateMetrics(readings);

    _el('con-water-today').textContent  = `${metrics.waterLiters.toFixed(1)} L`;
    _el('con-energy-today').textContent = `${metrics.energyKwh.toFixed(2)} kWh`;
    _el('con-co2').textContent          = `${metrics.co2Saved.toFixed(2)} kg`;
    _el('con-cost').textContent         = `RM ${metrics.costRm.toFixed(2)}`;

    const waterSavePct  = Math.round((1 - metrics.waterLiters / 60)  * 100);
    const energySavePct = Math.round((1 - metrics.energyKwh / 20) * 100);
    if (waterSavePct > 0)  _el('con-water-vs').textContent  = `↓ ${waterSavePct}% vs traditional`;
    if (energySavePct > 0) _el('con-energy-vs').textContent = `↓ ${energySavePct}% vs traditional`;

    const grade = _calcGrade(metrics);
    _el('con-grade').textContent      = grade.letter;
    _el('con-grade').style.color      = grade.color;
    _el('con-grade-note').textContent = grade.note;

    _renderCharts(readings);
    _renderBreakdown(metrics);
    _renderAiTips(readings, latest, metrics);
    _renderTraditionalComparison(metrics, isMock);  // ← NEW

    const ts = readings[0]?.createdAt || readings[0]?.timestamp || new Date();
    _el('con-last-updated').textContent =
        `${isMock ? '⚡ Demo mode · ' : ''}Last updated: ${new Date(ts).toLocaleString('en-MY')}`;
}

/* ══════════════════════════════════════════════
   NEW: TRADITIONAL FARMING COMPARISON
══════════════════════════════════════════════ */
async function _renderTraditionalComparison(metrics, isMock) {
    // ── Get plant list from current farm ──
    const farm   = AppState.currentFarm;
    const plants = _extractPlantNames(farm);

    // ── Traditional farming benchmarks ──
    // Based on published research: ~60L water/day, ~3kWh/day, ~2.5kg CO₂/day per m² for outdoor
    const TRAD_WATER_L   = 60;   // L/day outdoor soil farm
    const TRAD_ENERGY_KWH = 3;   // kWh/day (irrigation pumps, transport)
    const TRAD_CO2_KG    = 2.5;  // kg CO₂/day

    const waterSaved  = Math.max(0, TRAD_WATER_L - metrics.waterLiters);
    const energySaved = Math.max(0, TRAD_ENERGY_KWH - metrics.energyKwh);
    const co2Saved    = Math.max(0, TRAD_CO2_KG - metrics.co2Saved * -1 + metrics.co2Saved);
    const costSaved   = ((TRAD_ENERGY_KWH - metrics.energyKwh) * RM_PER_KWH + waterSaved * 0.002);
    const monthlySavingsRm = Math.max(0, costSaved * 30);

    // ── Comparison bars ──
    const bars = [
        {
            label:  '💧 Water',
            yours:  metrics.waterLiters,
            trad:   TRAD_WATER_L,
            unit:   'L',
            color:  '#2563EB',
            saving: `${waterSaved.toFixed(1)} L saved`,
        },
        {
            label:  '⚡ Energy',
            yours:  metrics.energyKwh,
            trad:   TRAD_ENERGY_KWH,
            unit:   'kWh',
            color:  '#D97706',
            saving: `${energySaved.toFixed(2)} kWh saved`,
        },
        {
            label:  '🌿 CO₂',
            yours:  Math.max(0.1, TRAD_CO2_KG - metrics.co2Saved),
            trad:   TRAD_CO2_KG,
            unit:   'kg',
            color:  '#16A34A',
            saving: `${metrics.co2Saved.toFixed(2)} kg offset`,
        },
    ];

    _el('con-trad-bars').innerHTML = bars.map(b => {
        const yourPct = Math.min(100, (b.yours / b.trad) * 100);
        const savePct = Math.round(100 - yourPct);
        return `
            <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
                    <span style="font-size:0.78rem;font-weight:600;color:#374151;">${b.label}</span>
                    <span style="font-size:0.72rem;color:#16A34A;font-weight:700;">↓ ${savePct}% · ${b.saving}</span>
                </div>
                <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                    <span style="font-size:0.62rem;color:#94A3B8;width:56px;">Yours</span>
                    <div style="flex:1;background:#E2E8F0;border-radius:100px;height:8px;overflow:hidden;">
                        <div style="width:${yourPct.toFixed(1)}%;height:100%;background:${b.color};border-radius:100px;transition:width 0.6s ease;"></div>
                    </div>
                    <span style="font-size:0.65rem;font-weight:700;color:${b.color};width:36px;text-align:right;">${b.yours.toFixed(1)}${b.unit}</span>
                </div>
                <div style="display:flex;gap:4px;align-items:center;">
                    <span style="font-size:0.62rem;color:#94A3B8;width:56px;">Traditional</span>
                    <div style="flex:1;background:#E2E8F0;border-radius:100px;height:8px;overflow:hidden;">
                        <div style="width:100%;height:100%;background:#CBD5E1;border-radius:100px;"></div>
                    </div>
                    <span style="font-size:0.65rem;font-weight:700;color:#94A3B8;width:36px;text-align:right;">${b.trad}${b.unit}</span>
                </div>
            </div>`;
    }).join('');

    // ── Monthly savings summary ──
    if (monthlySavingsRm > 0) {
        const mSavEl = _el('con-monthly-savings');
        mSavEl.style.display = 'block';
        mSavEl.innerHTML = `
            <div style="font-size:0.7rem;font-weight:700;color:#16A34A;letter-spacing:0.06em;margin-bottom:8px;">💚 ESTIMATED MONTHLY SAVINGS</div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                <div style="text-align:center;">
                    <div style="font-size:1.1rem;font-weight:800;color:#2563EB;">${(waterSaved * 30).toFixed(0)}L</div>
                    <div style="font-size:0.62rem;color:#64748B;">water saved</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:1.1rem;font-weight:800;color:#D97706;">RM ${monthlySavingsRm.toFixed(2)}</div>
                    <div style="font-size:0.62rem;color:#64748B;">utility cost</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:1.1rem;font-weight:800;color:#16A34A;">${(metrics.co2Saved * 30).toFixed(1)}kg</div>
                    <div style="font-size:0.62rem;color:#64748B;">CO₂ offset</div>
                </div>
            </div>
        `;
    }

    // ── AI Narrative via Groq backend ──
    _el('con-trad-spinner').style.display = 'inline-block';
    _el('con-trad-text').textContent = 'Generating plant-specific analysis…';

    try {
        const plantStr = plants.length > 0 ? plants.join(', ') : 'lettuce, herbs';
        const prompt   = `You are an agricultural sustainability AI for SeedDown vertical farming.
Compare our vertical farm data against traditional outdoor soil farming for these crops: ${plantStr}.

Our vertical farm today:
- Water used: ${metrics.waterLiters.toFixed(1)}L (traditional soil farm uses ~${TRAD_WATER_L}L/day)
- Energy used: ${metrics.energyKwh.toFixed(2)}kWh (traditional uses ~${TRAD_ENERGY_KWH}kWh/day for irrigation + transport)
- CO₂ offset: ${metrics.co2Saved.toFixed(2)}kg

Write 2-3 sentences (max 80 words) that:
1. Name the specific crops and explain why vertical farming saves more water/energy for THOSE crops specifically.
2. Give one surprising or memorable fact about the environmental benefit for the named plants.
3. Keep it positive and inspiring.
Do NOT use bullet points. Plain prose only.`;

        const res = await fetch(`${BASE_URL}/api/chat`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ message: prompt, history: [] }),
        });

        if (res.ok) {
            const data = await res.json();
            const aiText = data.reply || data.message || '';
            if (aiText) {
                _el('con-trad-text').textContent = aiText;
            } else {
                _el('con-trad-text').textContent = _fallbackAiText(plants, metrics, waterSaved);
            }
        } else {
            _el('con-trad-text').textContent = _fallbackAiText(plants, metrics, waterSaved);
        }
    } catch (e) {
        console.warn('[ConsumptionPage] AI comparison fetch failed:', e);
        _el('con-trad-text').textContent = _fallbackAiText(plants, metrics, waterSaved);
    } finally {
        _el('con-trad-spinner').style.display = 'none';
    }
}

/* ── Fallback if AI unavailable ── */
function _fallbackAiText(plants, metrics, waterSaved) {
    const cropName = plants.length > 0 ? plants[0] : 'leafy greens';
    return `Your vertical ${cropName} farm uses ${waterSaved.toFixed(1)}L less water than traditional soil methods — a saving of up to ${Math.round((waterSaved / 60) * 100)}% per day. Vertical farming produces the same yield in up to 95% less land area, making it one of the most resource-efficient ways to grow ${cropName} in urban Malaysia.`;
}

/* ── Extract plant names from current farm ── */
function _extractPlantNames(farm) {
    if (!farm) return [];
    const names = new Set();

    if (farm.targetPlant) names.add(farm.targetPlant.toLowerCase());

    if (Array.isArray(farm.plants)) {
        farm.plants.forEach(p => {
            const n = p?.name || p?.species || p?.type;
            if (n) names.add(String(n).toLowerCase());
        });
    }

    return [...names].slice(0, 4); // max 4 for prompt brevity
}

/* ── CALCULATE METRICS ── */
function _calculateMetrics(readings) {
    let waterActivations = 0, lightHours = 0, fanHours = 0, lowLightCount = 0;

    readings.forEach(r => {
        const soilRaw  = r.soilRaw  ?? r.soilMoisture ?? 1900;
        const lightRaw = r.lightRaw ?? r.light         ?? 2000;
        const temp     = r.temperature ?? 25;

        if (soilRaw  < 1800) waterActivations++;
        if (lightRaw < 1500) { lightHours++; lowLightCount++; }
        if (temp     > 28)   fanHours++;
    });

    const waterLiters = (waterActivations * ML_PER_WATERING) / 1000;
    const energyWh    = (lightHours * WATTS_LIGHT) + (fanHours * WATTS_FAN) + (waterActivations * WATTS_PUMP_WATER);
    const energyKwh   = energyWh / 1000;
    const costRm      = energyKwh * RM_PER_KWH;
    const co2Saved    = (60 - waterLiters) * 0.035;

    return {
        waterLiters:      Math.max(waterLiters, 0.5),
        energyKwh:        Math.max(energyKwh, 0.1),
        costRm:           Math.max(costRm, 0.02),
        co2Saved:         Math.max(co2Saved, 0.5),
        lightHours,
        fanHours,
        waterActivations,
        lowLightCount,
        totalReadings:    readings.length,
    };
}

/* ── ECO GRADE ── */
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

/* ── CHARTS ── */
async function _renderCharts(readings) {
    if (!window.Chart) {
        await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
            s.onload = resolve; s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    const labels     = readings.map((r, i) => {
        const d = new Date(r.createdAt || r.timestamp || Date.now() - (readings.length - i) * 3600000);
        return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    });
    const waterData  = readings.map(r => r.waterLevel ?? r.waterDistanceCm ?? 70);
    const energyData = readings.map(r => {
        const lr = r.lightRaw ?? r.light ?? 2000;
        const t  = r.temperature ?? 25;
        return ((lr < 1500 ? WATTS_LIGHT : 0) + (t > 28 ? WATTS_FAN : 0)) / 10;
    });

    const defaults = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        layout:  { padding: { top: 8 } },
        scales: {
            x: { ticks: { color:'#94A3B8', font:{ size:9 }, maxRotation:45, minRotation:45 }, grid:{ color:'#F1F5F9' }, border:{ color:'#E2E8F0' } },
            y: { ticks: { color:'#94A3B8', font:{ size:9 } },                                 grid:{ color:'#F1F5F9' }, border:{ color:'#E2E8F0' } },
        },
    };

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
                    backgroundColor: ctx => {
                        const { ctx: c, chartArea } = ctx.chart;
                        if (!chartArea) return 'rgba(37,99,235,0.08)';
                        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                        g.addColorStop(0, 'rgba(37,99,235,0.18)');
                        g.addColorStop(1, 'rgba(37,99,235,0.01)');
                        return g;
                    },
                    fill: true, tension: 0.4, pointRadius: 2, pointHoverRadius: 5,
                    pointBackgroundColor: '#2563EB', pointBorderColor: '#fff', pointBorderWidth: 1.5, borderWidth: 2,
                }],
            },
            options: { ...defaults },
        });
    }

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
                    borderColor:     energyData.map(v => v > 5 ? '#92400E' : '#B45309'),
                    borderWidth: 1, borderRadius: 6, borderSkipped: false,
                }],
            },
            options: { ...defaults },
        });
    }
}

/* ── RESOURCE BREAKDOWN ── */
function _renderBreakdown(metrics) {
    const items = [
        { label:'💧 Water Pump',  value: metrics.waterActivations, unit:'activations', pct: metrics.waterActivations / Math.max(metrics.totalReadings, 1) * 100, color:'#2563EB' },
        { label:'💡 Grow Lights', value: metrics.lightHours,       unit:'hrs ON',      pct: metrics.lightHours       / Math.max(metrics.totalReadings, 1) * 100, color:'#D97706' },
        { label:'🌀 Cooling Fan', value: metrics.fanHours,         unit:'hrs ON',      pct: metrics.fanHours         / Math.max(metrics.totalReadings, 1) * 100, color:'#16A34A' },
    ];
    _el('con-breakdown').innerHTML = items.map(item => `
        <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.8rem;">
                <span style="color:#374151;font-weight:500;">${item.label}</span>
                <span style="color:#1A2B3C;font-weight:700;">${item.value} ${item.unit}</span>
            </div>
            <div class="con-progress-track">
                <div class="con-progress-fill" style="width:${Math.min(item.pct, 100).toFixed(1)}%;background:${item.color};"></div>
            </div>
        </div>`).join('');
}

/* ── AI ECO TIPS ── */
function _renderAiTips(readings, latest, metrics) {
    const tips = [];

    if (metrics.lightHours > metrics.totalReadings * 0.6) {
        const savings = (metrics.lightHours * 0.5 * WATTS_LIGHT / 1000 * RM_PER_KWH).toFixed(2);
        tips.push({ icon:'💡', title:'Reduce grow light duration', desc:`Lights were ON for ${metrics.lightHours} intervals. Reducing by 2h/day saves ≈ RM ${savings}/day.`, color:'#FFD966' });
    }
    if (metrics.waterActivations > 8) {
        const ws = ((metrics.waterActivations - 6) * ML_PER_WATERING / 1000).toFixed(1);
        tips.push({ icon:'💧', title:'Batch your watering cycles', desc:`${metrics.waterActivations} watering events detected. Consolidating to 6 cycles saves ≈ ${ws} L/day.`, color:'#60A5FA' });
    }
    const ph = latest?.ph ?? readings[0]?.ph;
    if (ph && (ph < 5.8 || ph > 6.5)) {
        tips.push({ icon:'🧪', title:`pH imbalance detected (${ph.toFixed(1)})`, desc:`Optimal range 5.8–6.5. Out-of-range pH reduces nutrient uptake by up to 30%.`, color:'#F87171' });
    }
    if (metrics.fanHours > metrics.totalReadings * 0.4) {
        tips.push({ icon:'🌡️', title:'High temperature periods detected', desc:`Fan active ${metrics.fanHours} intervals. Adjust light schedule to reduce heat buildup.`, color:'#FB923C' });
    }
    if (tips.length === 0) {
        tips.push({ icon:'✅', title:'Your farm is running efficiently!', desc:'All consumption metrics are within optimal range. Keep up the good work.', color:'#4ADE80' });
    }

    _el('con-ai-tips').innerHTML = tips.map(t => `
        <div style="background:#F8FAFC;border-left:3px solid ${t.color};border-radius:0 12px 12px 0;padding:12px;border-top:1px solid #F1F5F9;border-right:1px solid #F1F5F9;border-bottom:1px solid #F1F5F9;">
            <div style="font-weight:600;color:${t.color};font-size:0.85rem;">${t.icon} ${t.title}</div>
            <div style="color:#475569;font-size:0.78rem;margin-top:4px;line-height:1.4;">${t.desc}</div>
        </div>`).join('');
}

/* ── MOCK DATA ── */
function _mockReadings() {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => ({
        deviceId:    'farm_001',
        temperature:  22 + Math.sin(i / 4) * 4 + Math.random() * 2,
        humidity:     60 + Math.random() * 15,
        soilRaw:      1600 + Math.floor(Math.random() * 600),
        ph:           5.9 + Math.random() * 0.8,
        lightRaw:     800 + Math.floor(Math.random() * 1200),
        waterLevel:   70 + Math.floor(Math.random() * 20),
        gasRaw:       800 + Math.floor(Math.random() * 300),
        createdAt:    new Date(now - (23 - i) * 3600000).toISOString(),
    }));
}

/* ── HELPERS ── */
function _el(id) { return document.getElementById(id); }

function _showState(state) {
    const loading = _el('con-loading');
    const content = _el('con-content');
    const error   = _el('con-error');
    if (loading) loading.style.display = state === 'loading' ? 'block' : 'none';
    if (content) content.style.display = state === 'content' ? 'block' : 'none';
    if (error)   error.style.display   = state === 'error'   ? 'block' : 'none';
}