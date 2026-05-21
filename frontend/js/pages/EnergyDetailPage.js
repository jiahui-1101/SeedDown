import { API_BASE } from '../utils/apiBase.js';
import { showScreen } from '../utils/navigation.js';


// Matches CommercialPage's formula: light * 0.0002 + temp * 0.003 + water * 0.0015
// So dashboard and detail always show the same number.
const ENERGY_COEFFICIENTS = {
    lighting:    { field: 'lightRaw',        coeff: 0.0002,  label: 'Grow Lighting',   icon: '💡', desc: 'LED grow lights (lightRaw × 0.0002)' },
    climate:     { field: 'temperature',     coeff: 0.003,   label: 'Climate Control', icon: '❄️', desc: 'Cooling/heating (temp × 0.003)' },
    waterPump:   { field: 'waterDistanceCm', coeff: 0.0015,  label: 'Water Pump',      icon: '💧', desc: 'Irrigation pump (water × 0.0015)' },
    ventilation: { field: 'gasRaw',          coeff: 0.00005, label: 'Ventilation Fan', icon: '🌬️', desc: 'Air circulation (gas × 0.00005)' },
};

// Baseline kWh if running without smart control
const BASELINE_KWH = 2.5;

const FILTER_OPTIONS = [
    { label: 'Last 7',  limit: 7 },
    { label: 'Last 14', limit: 14 },
    { label: 'Last 30', limit: 30 },
];

let currentLimit = 7;

export async function render(params = {}) {
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
            '<button id="energyBackBtn" style="border:none; background:none; font-size:1.5rem; color:#065F46; cursor:pointer;">←</button>' +
            '<div style="font-weight:700; font-size:1.15rem; color:#065F46;">Energy Analysis</div>' +
        '</div>' +
        '<button id="openEnergyInfoBtn" style="background:#D1FAE5; color:#065F46; border:none; padding:8px 14px; border-radius:12px; font-size:0.75rem; font-weight:700; cursor:pointer;">ℹ️ How it works</button>' +
    '</div>' +

    '<div style="flex:1; overflow-y:auto; padding:0 20px 28px 20px;">' +

        // Top: Energy saved
        '<div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06); margin-bottom:16px;">' +
            '<div style="font-size:0.78rem; font-weight:700; color:#10B981; margin-bottom:8px; letter-spacing:1px;">ENERGY SAVED (SMART AUTOMATION)</div>' +
            '<div style="display:flex; align-items:baseline; gap:8px;">' +
                '<span id="energy-saved-val" style="font-size:2.8rem; font-weight:900; color:#065F46; line-height:1;">--</span>' +
                '<span style="font-size:1.2rem; font-weight:600; color:#94A3B8;">kWh</span>' +
            '</div>' +
            '<div id="energy-usage-lbl" style="font-size:0.8rem; color:#64748B; margin-top:8px; font-weight:500;">Calculating actual usage...</div>' +
        '</div>' +

        // AI Insight
        '<div style="background:#FFFFFF; border-radius:16px; padding:14px 18px; margin-bottom:16px; box-shadow:0 4px 12px rgba(5,150,105,0.04); display:flex; align-items:center; gap:10px; border:1px solid #D1FAE5;">' +
            '<span style="font-size:1rem; flex-shrink:0;">✨</span>' +
            '<div id="energy-ai-insight" style="font-size:0.82rem; color:#374151; line-height:1.5;">Calculating AI insight...</div>' +
        '</div>' +

        // Filter tabs
        '<div style="display:flex; gap:8px; margin-bottom:14px;">' +
            FILTER_OPTIONS.map((f, i) =>
                '<button class="energy-filter-btn" data-limit="' + f.limit + '" style="padding:7px 12px; border-radius:20px; border:none; font-size:0.72rem; font-weight:700; cursor:pointer; ' +
                (i === 0 ? 'background:#065F46; color:#fff;' : 'background:#ECFDF5; color:#065F46;') + '">' + f.label + '</button>'
            ).join('') +
        '</div>' +

        // Line chart
        '<div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06); margin-bottom:16px;">' +
            '<div style="font-size:0.85rem; font-weight:700; color:#065F46; margin-bottom:20px;">ENERGY USED TREND (kWh)</div>' +
            '<div style="width:min(100%, 720px); aspect-ratio:5 / 2; min-height:140px; position:relative; margin:0 auto;">' +
                '<svg id="energy-chart-svg" viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%; height:100%; overflow:visible; display:block;">' +
                    '<defs><linearGradient id="enerGrad" x1="0" y1="0" x2="0" y2="1">' +
                        '<stop offset="0%" stop-color="rgba(16,185,129,0.35)"/>' +
                        '<stop offset="100%" stop-color="rgba(16,185,129,0)"/>' +
                    '</linearGradient></defs>' +
                    '<text x="50" y="22" text-anchor="middle" fill="#94A3B8" font-size="4">Loading...</text>' +
                '</svg>' +
                '<div id="energy-tooltip" style="display:none; position:absolute; top:-10px; background:#065F46; color:#FFF; padding:6px 10px; border-radius:8px; font-size:0.78rem; font-weight:800; pointer-events:none; white-space:nowrap; transform:translateX(-50%); z-index:10;"></div>' +
            '</div>' +
        '</div>' +

        // Breakdown
        '<div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06);">' +
            '<div style="font-size:0.85rem; font-weight:700; color:#065F46; margin-bottom:6px;">ENERGY BY SYSTEM</div>' +
            '<div id="energy-total-sub" style="font-size:0.72rem; color:#94A3B8; margin-bottom:18px;">Latest reading breakdown</div>' +
            '<div id="energy-breakdown"></div>' +
        '</div>' +

    '</div>' +

    // Info modal
    '<div id="energyInfoModal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(6,95,70,0.45); z-index:999; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; backdrop-filter:blur(4px);">' +
        '<div style="background:white; width:100%; max-width:320px; border-radius:24px; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.15);">' +
            '<div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">' +
                '<div style="background:#D1FAE5; padding:8px; border-radius:50%;">⚡</div>' +
                '<div style="font-size:1.05rem; font-weight:800; color:#065F46;">How Energy is Calculated</div>' +
            '</div>' +
            '<div style="font-size:0.8rem; color:#64748B; line-height:1.7; margin-bottom:16px;">' +
                '<b style="color:#059669;">Actual Usage</b> = light × 0.0002 + temp × 0.003 + water × 0.0015<br>' +
                '<b style="color:#059669;">Energy Saved</b> = baseline (' + BASELINE_KWH + ' kWh) − actual usage.<br><br>' +
                'This matches the value shown on the dashboard. Smart automation reduces waste by only activating systems when sensors detect the need.' +
            '</div>' +
            '<button id="closeEnergyInfoBtn" style="width:100%; padding:13px; border:none; background:#10B981; color:white; border-radius:14px; font-weight:800; cursor:pointer;">Got it</button>' +
        '</div>' +
    '</div>' +

    '</div>';
}

function bindStaticEvents() {
    document.getElementById('energyBackBtn').onclick = () => showScreen('dash-c');

    const modal = document.getElementById('energyInfoModal');
    document.getElementById('openEnergyInfoBtn').onclick = () => { modal.style.display = 'flex'; };
    document.getElementById('closeEnergyInfoBtn').onclick = () => { modal.style.display = 'none'; };

    document.querySelectorAll('.energy-filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.energy-filter-btn').forEach(b => {
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
                const res  = await fetch(url);
                const data = await res.json();
                readings = data.readings || data.history || (Array.isArray(data) ? data : []);
                if (readings.length > 0) break;
            } catch (_) {}
        }
    } catch (e) { console.error('Energy load error:', e); }

    const rows = readings.map(item => ({
        time:  item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
        kwh:   calcEnergy(item),
        saved: Math.max(0, BASELINE_KWH - calcEnergy(item)),
        raw:   item
    }));

    if (rows.length === 0) rows.push({ time: 'N/A', kwh: 0, saved: BASELINE_KWH, raw: {} });

    const latestKwh   = rows[0]?.kwh   || 0;
    const latestSaved = rows[0]?.saved || 0;

    setText('energy-saved-val', latestSaved.toFixed(3));
    const usageLbl = document.getElementById('energy-usage-lbl');
    if (usageLbl) usageLbl.innerText = 'Actual usage: ' + latestKwh.toFixed(4) + ' kWh  ·  Baseline: ' + BASELINE_KWH + ' kWh';

    renderChart(rows);
    renderBreakdown(rows[0]?.raw || {}, latestKwh);

    getAIInsight(rows.slice(0, 3).map(r => r.raw), 'energy-ai-insight',
        `You are a smart farm energy advisor. Based on sensor readings: ${JSON.stringify(rows.slice(0,3).map(r=>r.raw))}. Give ONE short sentence (max 12 words) about energy efficiency.`
    );
}

function calcEnergy(d) {
    return Object.values(ENERGY_COEFFICIENTS).reduce((sum, cfg) => {
        return sum + ((d[cfg.field] || 0) * cfg.coeff);
    }, 0);
}

function renderChart(rows) {
    const chartData = [...rows].reverse();
    const values    = chartData.map(r => r.kwh);
    const maxVal    = Math.max(...values, 0.01);
    const minVal    = Math.min(...values, 0);
    const range     = maxVal - minVal || 0.01;

    const pts = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1 || 1)) * 100;
        const y = 40 - 5 - ((d.kwh - minVal) / range) * 30;
        return { x: x.toFixed(1), y: y.toFixed(1), val: d.kwh.toFixed(4), time: d.time };
    });

    const linePath = 'M ' + pts.map(p => p.x + ',' + p.y).join(' L ');
    const areaPath = linePath + ' L 100,40 L 0,40 Z';
    const sw       = 100 / (pts.length - 1 || 1);

    const slices = pts.map(p =>
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="1.5" fill="#FFF" stroke="#10B981" stroke-width="1" pointer-events="none"/>' +
        '<rect class="energy-slice" data-val="' + p.val + '" data-time="' + p.time + '" data-cx="' + p.x + '"' +
        ' x="' + (parseFloat(p.x) - sw / 2) + '" y="0" width="' + sw + '" height="40"' +
        ' fill="transparent" style="cursor:crosshair;pointer-events:all;"/>'
    ).join('');

    const svg = document.getElementById('energy-chart-svg');
    if (!svg) return;
    svg.innerHTML =
        '<defs><linearGradient id="enerGrad" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="rgba(16,185,129,0.35)"/>' +
            '<stop offset="100%" stop-color="rgba(16,185,129,0)"/>' +
        '</linearGradient></defs>' +
        '<path d="' + areaPath + '" fill="url(#enerGrad)"/>' +
        '<path d="' + linePath + '" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        slices;

    const tooltip = document.getElementById('energy-tooltip');
    document.querySelectorAll('.energy-slice').forEach(s => {
        s.addEventListener('pointerenter', () => {
            tooltip.innerHTML = '<div style="font-size:0.65rem;">' + s.getAttribute('data-time') + '</div><b>' + s.getAttribute('data-val') + ' kWh</b>';
            tooltip.style.left    = s.getAttribute('data-cx') + '%';
            tooltip.style.display = 'block';
        });
        s.addEventListener('pointerleave', () => { tooltip.style.display = 'none'; });
    });
}

function renderBreakdown(raw, totalKwh) {
    const breakdown = Object.entries(ENERGY_COEFFICIENTS).map(([, cfg]) => {
        const kwh = (raw[cfg.field] || 0) * cfg.coeff;
        return { ...cfg, kwh };
    });
    const bTotal = breakdown.reduce((s, b) => s + b.kwh, 0) || 0.0001;

    const sub = document.getElementById('energy-total-sub');
    if (sub) sub.innerText = 'Total actual: ' + totalKwh.toFixed(4) + ' kWh this reading';

    const el = document.getElementById('energy-breakdown');
    if (!el) return;
    el.innerHTML = breakdown.map(b => {
        const pct = Math.round((b.kwh / bTotal) * 100);
        return '<div style="margin-bottom:14px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">' +
                '<div style="display:flex; align-items:center; gap:8px;">' +
                    '<span style="font-size:1rem;">' + b.icon + '</span>' +
                    '<div>' +
                        '<div style="font-weight:700; font-size:0.88rem; color:#065F46;">' + b.label + '</div>' +
                        '<div style="font-size:0.68rem; color:#94A3B8;">' + b.desc + '</div>' +
                    '</div>' +
                '</div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-weight:900; color:#10B981; font-size:0.95rem;">' + b.kwh.toFixed(4) + ' kWh</div>' +
                    '<div style="font-size:0.68rem; color:#94A3B8;">' + pct + '%</div>' +
                '</div>' +
            '</div>' +
            '<div style="height:4px; background:#F0FDF4; border-radius:4px; overflow:hidden;">' +
                '<div style="height:100%; width:' + pct + '%; background:linear-gradient(90deg,#10B981,#34D399); border-radius:4px;"></div>' +
            '</div>' +
        '</div>';
    }).join('');
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
        if (el) el.innerText = result.reply || result.response || 'Smart automation is reducing energy consumption effectively.';
    } catch (e) {
        const el = document.getElementById(elId);
        if (el) el.innerText = 'Dim grow lights during off-peak hours to save energy.';
    }
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}
