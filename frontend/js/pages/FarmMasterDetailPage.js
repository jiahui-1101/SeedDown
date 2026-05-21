import { API_BASE } from '../utils/apiBase.js';
import { showScreen } from '../utils/navigation.js';
import { AppState } from '../store.js';


const DEMO_FARM_MASTER_DEVICE = 'commercial-farm-master-1';

const SENSOR_META = {
    water:  { field: 'waterDistanceCm', unit: 'cm',  label: 'Water Level', normal: v => v >= 3 && v <= 30 },
    gas:    { field: 'gasRaw',          unit: 'raw', label: 'Gas',         normal: v => v < 3000 },
    co2:    { field: 'co2Ppm',          unit: 'ppm', label: 'CO₂',         normal: v => v < 1500 },
    energy: { field: 'energyKwh',       unit: 'kWh', label: 'Energy',      normal: v => v >= 0 },
};

const SENSOR_KEYS = ['water', 'gas', 'co2', 'energy'];

export async function render(params = {}) {
    const defaultKey = params.key || 'water';
    const backTarget = params.from || 'dash-c';
    const container = document.getElementById('screenContainer');

    container.innerHTML = `
        <div class="screen active" style="display:flex;flex-direction:column;background:#f0fdf4;height:100vh;align-items:center;justify-content:center;color:#047857;font-size:0.95rem;font-weight:700;">
            Loading Farm Master...
        </div>
    `;

    const reading = await fetchFarmMasterReading();

    const sensors = SENSOR_KEYS.map(key => {
        const meta = SENSOR_META[key];
        const raw = reading ? Number(reading[meta.field] ?? null) : null;
        const hasData = raw !== null && Number.isFinite(raw);
        const status = hasData ? (meta.normal(raw) ? 'Normal' : 'Check') : 'No Data';
        const value = hasData ? formatValue(raw) : '--';
        return { key, meta, value, status };
    });

    const overallStatus = sensors.some(s => s.status === 'Check') ? 'Check'
        : sensors.some(s => s.status === 'Normal') ? 'Normal' : 'Offline';

    container.innerHTML = `
        <div class="screen active" style="display:flex;flex-direction:column;background:#f0f9ff;height:100vh;position:relative;color:#17231b;">

            <!-- Header -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;background:rgba(255,255,255,.94);border-bottom:1px solid #bbf7d0;backdrop-filter:blur(12px);">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="fmBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid #bbf7d0;background:#fff;font-size:1.25rem;font-weight:900;color:#17231b;cursor:pointer;flex-shrink:0;">←</button>
                    <div>
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:#047857;">Farm Master · ${escapeHTML(DEMO_FARM_MASTER_DEVICE)}</div>
                        <div style="font-weight:900;font-size:1.2rem;color:#17231b;">Overall Farm Sensors</div>
                    </div>
                </div>
                <div style="display:inline-flex;align-items:center;gap:8px;background:${overallStatus === 'Normal' ? '#ecfdf5' : overallStatus === 'Offline' ? '#f1f5f9' : '#fef2f2'};color:${overallStatus === 'Normal' ? '#047857' : overallStatus === 'Offline' ? '#64748b' : '#dc2626'};border:1px solid ${overallStatus === 'Normal' ? '#bbf7d0' : overallStatus === 'Offline' ? '#e2e8f0' : '#fecaca'};padding:8px 14px;border-radius:999px;font-size:0.78rem;font-weight:900;flex-shrink:0;">
                    <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>
                    ${overallStatus === 'Normal' ? 'All Normal' : overallStatus === 'Offline' ? 'Offline' : 'Alert'}
                </div>
            </div>

            <!-- Body -->
            <div style="flex:1;overflow-y:auto;padding:20px;">

                <!-- What farm master monitors -->
                <div style="background:#ecfdf5;border:1px solid #bbf7d0;border-radius:16px;padding:12px 14px;margin-bottom:16px;font-size:12px;color:#14532d;line-height:1.5;">
                    <strong style="display:block;margin-bottom:3px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#047857;">📡 Farm Master monitors</strong>
                    Overall farm infrastructure: water reservoir, ambient gas safety, CO₂ concentration, and energy consumption. Does not monitor individual zone crops.
                </div>

                <!-- Sensor cards -->
                <div style="font-size:10px;font-weight:950;color:#047857;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Tap a sensor to view history</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px;">
                    ${sensors.map(s => sensorCard(s)).join('')}
                </div>

                <!-- Spotlight -->
                <div style="display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:16px;margin-bottom:16px;">
                    <section style="background:#fff;border:1px solid #bbf7d0;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(5,150,105,.08);">
                        <div id="fmSpotlightLabel" style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading</div>
                        <div id="fmSpotlightValue" style="font-size:2.45rem;font-weight:950;color:#047857;line-height:1;">--<span id="fmSpotlightUnit" style="font-size:1rem;font-weight:800;color:#64748b;margin-left:6px;"></span></div>
                        <div id="fmSpotlightBadge" style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0;padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
                            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>Loading
                        </div>
                    </section>
                    <section style="background:#fff;border:1px solid #bbf7d0;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(5,150,105,.08);">
                        <div id="fmTrendLabel" style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Trend History</div>
                        <div id="fmTrendChart" style="width:100%;aspect-ratio:5/2;min-height:120px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.8rem;">Loading...</div>
                    </section>
                </div>

                <!-- History log -->
                <section style="background:#fff;border:1px solid #bbf7d0;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(3,105,161,.08);">
                    <div id="fmHistoryLabel" style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Historical Records</div>
                    <div id="fmHistoryLog" style="display:flex;flex-direction:column;gap:8px;">
                        <div style="color:#94a3b8;font-size:0.85rem;">Loading...</div>
                    </div>
                </section>
            </div>
        </div>
    `;

    bindEvents({ backTarget, sensors, defaultKey });
}

// ─── Sensor card ─────────────────────────────────────────────────────────────

function sensorCard({ key, meta, value, status }) {
    const isCheck  = status === 'Check';
    const isNoData = status === 'No Data';
    const bg           = isCheck ? '#fff5f5' : '#ffffff';
    const border       = isCheck ? '#fecaca' : '#bae6fd';
    const valColor    = isCheck ? '#dc2626' : isNoData ? '#94a3b8' : '#047857';
const badgeBg     = isCheck ? '#fef2f2' : isNoData ? '#f1f5f9' : '#ecfdf5';
const badgeColor  = isCheck ? '#dc2626' : isNoData ? '#94a3b8' : '#047857';
const badgeBorder = isCheck ? '#fecaca' : isNoData ? '#e2e8f0' : '#bbf7d0';

    return `
        <button class="fm-sensor-card" data-key="${key}"
            style="background:${bg};border:1px solid ${border};border-radius:18px;padding:16px 14px;text-align:left;cursor:pointer;outline:none;box-shadow:0 4px 16px rgba(3,105,161,.07);transition:all .15s;">
            <div style="font-size:10px;font-weight:950;color:#047857;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${meta.label}</div>
            <div style="font-size:2rem;font-weight:950;color:${valColor};line-height:1;margin-bottom:10px;">
                ${value}<span style="font-size:0.75rem;font-weight:800;color:#94a3b8;margin-left:4px;">${value !== '--' ? meta.unit : ''}</span>
            </div>
            <div style="display:inline-flex;align-items:center;gap:5px;background:${badgeBg};color:${badgeColor};border:1px solid ${badgeBorder};padding:5px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;">
                <span style="width:5px;height:5px;border-radius:999px;background:currentColor;display:inline-block;"></span>${status}
            </div>
        </button>
    `;
}

// ─── Events ───────────────────────────────────────────────────────────────────

function bindEvents({ backTarget, sensors, defaultKey }) {
    document.getElementById('fmBackBtn').onclick = () => showScreen(backTarget);

    document.querySelectorAll('.fm-sensor-card').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-key');
            document.querySelectorAll('.fm-sensor-card').forEach(c =>
                c.style.outline = c === card ? '2px solid #047857' : 'none'
            );
            updateSpotlight(key, sensors);
        });
    });

    // Default selection
    const def = sensors.find(s => s.key === defaultKey && s.status !== 'No Data')
        || sensors.find(s => s.status !== 'No Data')
        || sensors[0];
    document.querySelectorAll('.fm-sensor-card').forEach(c => {
        c.style.outline = c.getAttribute('data-key') === def.key ? '2px solid #047857' : 'none';
    });
    updateSpotlight(def.key, sensors);
}

// ─── Spotlight ────────────────────────────────────────────────────────────────

function updateSpotlight(key, sensors) {
    const s = sensors.find(x => x.key === key) || sensors[0];
    if (!s) return;

    const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    setTxt('fmSpotlightLabel', `Current · ${s.meta.label}`);
    setTxt('fmTrendLabel',     `Trend History · ${s.meta.label}`);
    setTxt('fmHistoryLabel',   `Historical Records · ${s.meta.label}`);
    setTxt('fmSpotlightUnit',  s.value !== '--' ? s.meta.unit : '');

    const valEl = document.getElementById('fmSpotlightValue');
    if (valEl) {
        valEl.childNodes[0].textContent = s.value;
        valEl.style.color = s.status === 'Normal' ? '#047857' : s.status === 'No Data' ? '#94a3b8' : '#dc2626';
    }

    const badge = document.getElementById('fmSpotlightBadge');
    if (badge) {
        const ok = s.status === 'Normal';
        const noData = s.status === 'No Data';
        badge.style.background = ok ? '#ecfdf5' : noData ? '#f1f5f9' : '#fef2f2';
        badge.style.color      = ok ? '#166534' : noData ? '#64748b' : '#dc2626';
        badge.style.border     = `1px solid ${ok ? '#bbf7d0' : noData ? '#e2e8f0' : '#fecaca'}`;
        badge.innerHTML = `<span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${s.status}`;
    }

    loadHistory(s.meta);
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchFarmMasterReading() {
    const urls = [
        `${API_BASE}/api/sensors/latest?deviceId=${DEMO_FARM_MASTER_DEVICE}`,
    ];
    for (const url of urls) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data?.reading) return data.reading;
        } catch { /* try next */ }
    }
    return null;
}

async function loadHistory(meta) {
    try {
        const res = await fetch(`${API_BASE}/api/sensors/history?deviceId=${DEMO_FARM_MASTER_DEVICE}&limit=8`);
        const result = await res.json();
        const readings = result.readings || [];
        if (!readings.length) return;

        const values = readings.map(r => Number(r[meta.field] ?? 0)).reverse();
        const maxV = Math.max(...values, 1);
        const minV = Math.min(...values, 0);
        const range = maxV - minV || 1;
        const points = values.map((v, i) => ({
            x: ((i / (values.length - 1 || 1)) * 100).toFixed(1),
            y: (35 - ((v - minV) / range) * 25).toFixed(1),
        }));
        const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
        const areaPath = `${linePath} L 100,40 L 0,40 Z`;

        const chart = document.getElementById('fmTrendChart');
        if (chart) chart.innerHTML = `
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
                <defs>
                    <linearGradient id="fmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="rgba(5,150,105,.25)"/>
                        <stop offset="100%" stop-color="rgba(3,105,161,0)"/>
                    </linearGradient>
                </defs>
                <path d="${areaPath}" fill="url(#fmGrad)"/>
                <path d="${linePath}" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="1.5" fill="#fff" stroke="#10B981" stroke-width="1"/>`).join('')}
            </svg>`;

        const log = document.getElementById('fmHistoryLog');
        if (log) log.innerHTML = readings.map(r => {
            const val    = Number(r[meta.field] ?? 0);
            const status = meta.normal(val) ? 'Normal' : 'Check';
            const time   = r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
            return `
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:13px 0;border-bottom:1px solid #ecfdf5;align-items:center;">
                    <span style="color:#64748b;font-weight:700;">${time}</span>
                    <span style="font-weight:950;color:#17231b;">${formatValue(val)} <span style="font-size:0.72rem;color:#64748b;">${escapeHTML(meta.unit)}</span></span>
                    <span style="text-align:right;"><span style="background:${status === 'Normal' ? '#ecfdf5' : '#fef2f2'};color:${status === 'Normal' ? '#166534' : '#dc2626'};border:1px solid ${status === 'Normal' ? '#bbf7d0' : '#fecaca'};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;">${status}</span></span>
                </div>`;
        }).join('');
    } catch (e) {
        console.error('Farm master history load failed:', e);
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatValue(value) {
    if (!Number.isFinite(value)) return '0';
    if (Math.abs(value) >= 100)  return String(Math.round(value));
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(1).replace(/\.0$/, '');
}

function escapeHTML(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}