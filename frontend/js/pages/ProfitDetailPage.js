import { API_BASE } from '../utils/apiBase.js';
import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';


// Price per plant per day (RM). Based on avg Malaysian hydroponic market prices.
// Lettuce: ~RM 3-4, Spinach: ~RM 2-3, Basil: ~RM 4-5
const PRICE_PER_PLANT_DAY = 3.50;

// Filter options
const FILTER_OPTIONS = [
    { label: 'Last 7 readings', limit: 7 },
    { label: 'Last 14 readings', limit: 14 },
    { label: 'Last 30 readings', limit: 30 },
];

let currentLimit = 7;

export async function render(params = {}) {
    if (!AppState.profitFormula) AppState.profitFormula = 'plants * 3.50 * lightBonus';
    await renderPage();
}

async function renderPage() {
    const container = document.getElementById('screenContainer');
    container.innerHTML = buildSkeleton();
    bindStaticEvents();
    await loadData();
}

function buildSkeleton() {
    return '<div class="screen active" style="display:flex; flex-direction:column; background:#F0FDF4; height:100vh; position:relative;">' +

    // Header
    '<div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; flex-shrink:0;">' +
        '<div style="display:flex; align-items:center; gap:12px;">' +
            '<button id="profitBackBtn" style="border:none; background:none; font-size:1.5rem; color:#065F46; cursor:pointer;">←</button>' +
            '<div style="font-weight:700; font-size:1.15rem; color:#065F46;">Profit Analysis</div>' +
        '</div>' +
        '<button id="openFormulaBtn" style="background:#D1FAE5; color:#065F46; border:none; padding:8px 14px; border-radius:12px; font-size:0.75rem; font-weight:700; cursor:pointer;">⚙️ Formula</button>' +
    '</div>' +

    // Body
    '<div style="flex:1; overflow-y:auto; padding:0 20px 28px 20px;">' +

        // Top card: total profit
        '<div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06); margin-bottom:16px;">' +
            '<div style="font-size:0.78rem; font-weight:700; color:#10B981; margin-bottom:8px; letter-spacing:1px;">TOTAL PROFIT EARNED TODAY</div>' +
            '<div style="display:flex; align-items:baseline; gap:8px;">' +
                '<span id="profit-total-val" style="font-size:2.8rem; font-weight:900; color:#065F46; line-height:1;">--</span>' +
                '<span style="font-size:1.2rem; font-weight:600; color:#94A3B8;">RM</span>' +
            '</div>' +
            '<div id="profit-trend-lbl" style="font-size:0.8rem; color:#10B981; margin-top:8px; font-weight:600;">Calculating...</div>' +
        '</div>' +

        // AI Insight — one short line
        '<div style="background:#FFFFFF; border-radius:16px; padding:14px 18px; margin-bottom:16px; box-shadow:0 4px 12px rgba(5,150,105,0.04); display:flex; align-items:center; gap:10px; border:1px solid #D1FAE5;">' +
            '<span style="font-size:1rem; flex-shrink:0;">✨</span>' +
            '<div id="profit-ai-insight" style="font-size:0.82rem; color:#374151; line-height:1.5;">Calculating AI insight...</div>' +
        '</div>' +

        // Filter tabs
        '<div style="display:flex; gap:8px; margin-bottom:14px;">' +
            FILTER_OPTIONS.map((f, i) =>
                '<button class="profit-filter-btn" data-limit="' + f.limit + '" style="padding:7px 12px; border-radius:20px; border:none; font-size:0.72rem; font-weight:700; cursor:pointer; ' +
                (i === 0 ? 'background:#065F46; color:#fff;' : 'background:#ECFDF5; color:#065F46;') + '">' + f.label + '</button>'
            ).join('') +
        '</div>' +

        // Line chart card
        '<div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06); margin-bottom:16px;">' +
            '<div style="font-size:0.85rem; font-weight:700; color:#065F46; margin-bottom:20px;">PROFIT TREND (RM)</div>' +
            '<div style="width:min(100%, 720px); aspect-ratio:5 / 2; min-height:140px; position:relative; margin:0 auto;">' +
                '<svg id="profit-chart-svg" viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%; height:100%; overflow:visible; display:block;">' +
                    '<defs><linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">' +
                        '<stop offset="0%" stop-color="rgba(16,185,129,0.35)"/>' +
                        '<stop offset="100%" stop-color="rgba(16,185,129,0)"/>' +
                    '</linearGradient></defs>' +
                    '<text x="50" y="22" text-anchor="middle" fill="#94A3B8" font-size="4">Loading...</text>' +
                '</svg>' +
                '<div id="profit-tooltip" style="display:none; position:absolute; top:-10px; background:#065F46; color:#FFF; padding:6px 10px; border-radius:8px; font-size:0.78rem; font-weight:800; pointer-events:none; white-space:nowrap; transform:translateX(-50%); z-index:10;"></div>' +
            '</div>' +
        '</div>' +

        // Breakdown card
        '<div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06);">' +
            '<div style="font-size:0.85rem; font-weight:700; color:#065F46; margin-bottom:18px;">WHERE PROFIT COMES FROM</div>' +
            '<div id="profit-breakdown"></div>' +
        '</div>' +

    '</div>' +

    // Formula modal
    '<div id="formulaModal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(6,95,70,0.45); z-index:999; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; backdrop-filter:blur(4px);">' +
        '<div style="background:white; width:100%; max-width:320px; border-radius:24px; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.15);">' +
            '<div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">' +
                '<div style="background:#D1FAE5; padding:8px; border-radius:50%;">⚙️</div>' +
                '<div style="font-size:1.05rem; font-weight:800; color:#065F46;">Profit Formula</div>' +
            '</div>' +
            '<div style="font-size:0.78rem; color:#64748B; margin-bottom:4px;">Variables: <code style="color:#059669;">plants, light, temp, humid, ph, water, gas</code></div>' +
            '<div style="font-size:0.72rem; color:#94A3B8; margin-bottom:14px;">e.g. <code>plants * 3.50 * lightBonus</code> or <code>light * 0.05 + plants * 2</code></div>' +
            '<textarea id="formulaInput" rows="2" style="width:100%; padding:12px; border:2px solid #D1FAE5; border-radius:12px; color:#065F46; font-family:monospace; font-size:0.85rem; resize:none; box-sizing:border-box; outline:none;">' + AppState.profitFormula + '</textarea>' +
            '<div style="display:flex; gap:12px; margin-top:16px;">' +
                '<button id="cancelFormulaBtn" style="flex:1; padding:13px; border:none; background:#F1F5F9; color:#64748B; border-radius:14px; font-weight:700; cursor:pointer;">Cancel</button>' +
                '<button id="saveFormulaBtn" style="flex:1; padding:13px; border:none; background:#10B981; color:white; border-radius:14px; font-weight:800; cursor:pointer;">Save & Apply</button>' +
            '</div>' +
        '</div>' +
    '</div>' +

    '</div>';
}

function bindStaticEvents() {
    document.getElementById('profitBackBtn').onclick = () => showScreen('dash-c');

    const modal = document.getElementById('formulaModal');
    document.getElementById('openFormulaBtn').onclick = () => { modal.style.display = 'flex'; };
    document.getElementById('cancelFormulaBtn').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('saveFormulaBtn').onclick = () => {
        const val = document.getElementById('formulaInput').value.trim();
        if (!val) return;
        AppState.profitFormula = val;
        modal.style.display = 'none';
        showToast('success', 'Formula updated!');
        loadData();
    };

    document.querySelectorAll('.profit-filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.profit-filter-btn').forEach(b => {
                b.style.background = '#ECFDF5'; b.style.color = '#065F46';
            });
            btn.style.background = '#065F46'; btn.style.color = '#fff';
            currentLimit = parseInt(btn.getAttribute('data-limit'));
            loadData();
        };
    });
}

async function loadData() {
    let readings = [];
    try {
        const urls = [
            `${API_BASE}/api/sensors/history?deviceId=farm_001&limit=${currentLimit}`,
            `${API_BASE}/api/sensors?deviceId=farm_001&limit=${currentLimit}`
        ];
        for (const url of urls) {
            try {
                const res = await fetch(url);
                const data = await res.json();
                readings = data.readings || data.history || (Array.isArray(data) ? data : []);
                if (readings.length > 0) break;
            } catch (_) {}
        }
    } catch (e) { console.error('Profit load error:', e); }

    const plantTotal = getPlantCount();
    const rows = readings.map(item => ({
        time:   item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
        profit: calcProfit(item, plantTotal),
        raw:    item
    }));

    if (rows.length === 0) {
        rows.push({ time: 'N/A', profit: 0, raw: {} });
    }

    // Top value
    const latestProfit = rows[0]?.profit || 0;
    const prevProfit   = rows[1]?.profit || latestProfit;
    const changePct    = prevProfit > 0 ? (((latestProfit - prevProfit) / prevProfit) * 100).toFixed(1) : '0.0';
    const changeDir    = latestProfit >= prevProfit ? '↑' : '↓';
    const changeColor  = latestProfit >= prevProfit ? '#10B981' : '#EF4444';

    setText('profit-total-val', latestProfit.toFixed(2));
    const trendEl = document.getElementById('profit-trend-lbl');
    if (trendEl) {
        trendEl.innerText = `${changeDir} ${Math.abs(changePct)}% vs previous reading`;
        trendEl.style.color = changeColor;
    }

    // Chart
    renderChart(rows);

    // Breakdown
    renderBreakdown(rows[0]?.raw || {}, plantTotal, latestProfit);

    // AI (non-blocking)
    getAIInsight(rows.slice(0, 3).map(r => r.raw), 'profit-ai-insight',
        `You are a farm revenue advisor. Based on sensor readings: ${JSON.stringify(rows.slice(0,3).map(r=>r.raw))}. Give ONE short sentence (max 12 words) about profit outlook.`
    );
}

function calcProfit(d, plantTotal) {
    try {
        const temp  = d.temperature     || 0;
        const light = d.lightRaw        || 0;
        const humid = d.humidity        || 0;
        const ph    = d.ph              || 0;
        const water = d.waterDistanceCm || 0;
        const gas   = d.gasRaw          || 0;
        const plants = plantTotal;
        // lightBonus: good light (>2000) gives 15% boost
        const lightBonus = light > 2000 ? 1.15 : light > 1000 ? 1.05 : 1.0;

        const formula = AppState.profitFormula || 'plants * 3.50 * lightBonus';
        const result = new Function('plants','light','temp','humid','ph','water','gas','lightBonus',
            'return ' + formula)(plants, light, temp, humid, ph, water, gas, lightBonus);
        return Math.max(0, parseFloat(result));
    } catch (e) { return 0; }
}

function renderChart(rows) {
    const chartData = [...rows].reverse();
    const values    = chartData.map(r => r.profit);
    const maxVal    = Math.max(...values, 1);
    const minVal    = Math.min(...values, 0);
    const range     = maxVal - minVal || 1;

    const pts = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1 || 1)) * 100;
        const y = 40 - 5 - ((d.profit - minVal) / range) * 30;
        return { x: x.toFixed(1), y: y.toFixed(1), val: d.profit.toFixed(2), time: d.time };
    });

    const linePath = 'M ' + pts.map(p => p.x + ',' + p.y).join(' L ');
    const areaPath = linePath + ' L 100,40 L 0,40 Z';
    const sw       = 100 / (pts.length - 1 || 1);

    const slices = pts.map(p =>
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="1.5" fill="#FFF" stroke="#10B981" stroke-width="1" pointer-events="none"/>' +
        '<rect class="profit-slice" data-val="' + p.val + '" data-time="' + p.time + '" data-cx="' + p.x + '"' +
        ' x="' + (parseFloat(p.x) - sw / 2) + '" y="0" width="' + sw + '" height="40"' +
        ' fill="transparent" style="cursor:crosshair;pointer-events:all;"/>'
    ).join('');

    const svg = document.getElementById('profit-chart-svg');
    if (!svg) return;
    svg.innerHTML =
        '<defs><linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="rgba(16,185,129,0.35)"/>' +
            '<stop offset="100%" stop-color="rgba(16,185,129,0)"/>' +
        '</linearGradient></defs>' +
        '<path d="' + areaPath + '" fill="url(#profGrad)"/>' +
        '<path d="' + linePath + '" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        slices;

    const tooltip = document.getElementById('profit-tooltip');
    document.querySelectorAll('.profit-slice').forEach(s => {
        s.addEventListener('pointerenter', () => {
            tooltip.innerHTML = '<div style="font-size:0.65rem;">' + s.getAttribute('data-time') + '</div><b>RM ' + s.getAttribute('data-val') + '</b>';
            tooltip.style.left    = s.getAttribute('data-cx') + '%';
            tooltip.style.display = 'block';
        });
        s.addEventListener('pointerleave', () => { tooltip.style.display = 'none'; });
    });
}

function renderBreakdown(raw, plantTotal, totalProfit) {
    const light  = raw.lightRaw        || 0;
    const temp   = raw.temperature     || 0;
    const humid  = raw.humidity        || 0;

    // Light bonus calc
    const lightBonus = light > 2000 ? 1.15 : light > 1000 ? 1.05 : 1.0;
    const baseRevenue   = plantTotal * PRICE_PER_PLANT_DAY;
    const lightIncome   = baseRevenue * (lightBonus - 1);          // extra from good light
    const plantSales    = baseRevenue;
    const humidBonus    = humid > 60 && humid < 80 ? baseRevenue * 0.03 : 0;

    const sources = [
        { icon: '🌿', label: 'Plant Sales',    desc: plantTotal + ' plants × RM ' + PRICE_PER_PLANT_DAY, val: plantSales },
        { icon: '☀️', label: 'Light Bonus',    desc: 'Light intensity ' + light + ' → ' + ((lightBonus-1)*100).toFixed(0) + '% boost', val: lightIncome },
        { icon: '💧', label: 'Humidity Bonus', desc: humid > 60 && humid < 80 ? 'Optimal humidity range' : 'Humidity outside optimal range', val: humidBonus },
    ];
    const sTotal = sources.reduce((s, x) => s + x.val, 0) || 1;

    const el = document.getElementById('profit-breakdown');
    if (!el) return;
    el.innerHTML = sources.map(s => {
        const pct = Math.round((s.val / sTotal) * 100);
        return '<div style="margin-bottom:14px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
                '<div style="display:flex; align-items:center; gap:8px;">' +
                    '<span style="font-size:1rem;">' + s.icon + '</span>' +
                    '<div>' +
                        '<div style="font-weight:700; font-size:0.88rem; color:#065F46;">' + s.label + '</div>' +
                        '<div style="font-size:0.68rem; color:#94A3B8;">' + s.desc + '</div>' +
                    '</div>' +
                '</div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-weight:900; color:#10B981; font-size:0.95rem;">RM ' + s.val.toFixed(2) + '</div>' +
                    '<div style="font-size:0.68rem; color:#94A3B8;">' + pct + '%</div>' +
                '</div>' +
            '</div>' +
            '<div style="height:4px; background:#F0FDF4; border-radius:4px; overflow:hidden;">' +
                '<div style="height:100%; width:' + pct + '%; background:linear-gradient(90deg,#10B981,#34D399); border-radius:4px;"></div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function getPlantCount() {
    try {
        const farms = JSON.parse(localStorage.getItem('user_farms')) || [];
        const farm  = farms.find(f => f.id === AppState.currentFarmId) || farms[farms.length - 1];
        if (!farm) return 0;
        if (Array.isArray(farm.plants)) return farm.plants.length;
        return parseInt(farm.plants) || parseInt(farm.plantSlots) || 0;
    } catch { return 0; }
}

async function getAIInsight(historyData, elId, prompt) {
    try {
        const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt })
        });
        const result = await res.json();
        const el = document.getElementById(elId);
        if (el) el.innerText = result.reply || result.response || 'Farm profit trending stable based on current conditions.';
    } catch (e) {
        const el = document.getElementById(elId);
        if (el) el.innerText = 'Increase plant density to grow daily revenue.';
    }
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

