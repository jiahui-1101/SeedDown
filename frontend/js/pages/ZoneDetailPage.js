import { showScreen } from '../utils/navigation.js';
import { AppState } from '../store.js';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

const SENSOR_META = {
    temp:     { field: 'temperature',    unit: '°C',  label: 'Temp',   normal: v => v >= 18 && v <= 35 },
    humid:    { field: 'humidity',       unit: '%',   label: 'Humid',  normal: v => v >= 35 && v <= 80 },
    light:    { field: 'lightRaw',       unit: 'raw', label: 'Light',  normal: v => v >= 1500 },
    ph:       { field: 'ph',             unit: 'pH',  label: 'pH',     normal: v => v >= 5.5 && v <= 7.5 },
    water:    { field: 'waterDistanceCm',unit: 'cm',  label: 'Water',  normal: v => v >= 3 && v <= 30 },
    nutrient: { field: 'gasRaw',         unit: 'raw', label: 'Gas',    normal: v => v < 3000 },
    ec:       { field: 'ec',             unit: 'mS',  label: 'EC',     normal: v => v >= 0.5 && v <= 3.5 },
    co2:      { field: 'co2Ppm',         unit: 'ppm', label: 'CO2',    normal: v => v < 1500 },
};

const SENSOR_KEYS = ['temp', 'humid', 'light', 'ph', 'water', 'nutrient', 'ec', 'co2'];

export async function render(params = {}) {
    const zoneId   = params.zoneId || 'zone_A';
    const zoneLabel = zoneId.replace('_', ' ').toUpperCase();
    const backTarget = params.from || 'dash-c';
    const container = document.getElementById('screenContainer');

    // Show loading state
    container.innerHTML = `
        <div class="screen active" style="display:flex;flex-direction:column;background:#f8faf7;height:100vh;align-items:center;justify-content:center;color:#64748b;font-size:0.95rem;font-weight:700;">
            Loading ${zoneLabel}...
        </div>
    `;

    // Fetch latest sensor reading for this zone
    const reading = await fetchZoneReading(zoneId, params);

    // Build sensor cards data
    const sensors = SENSOR_KEYS.map(key => {
        const meta = SENSOR_META[key];
        const raw = reading ? Number(reading[meta.field] ?? null) : null;
        const hasData = raw !== null && Number.isFinite(raw);
        const status = hasData ? (meta.normal(raw) ? 'Normal' : 'Check') : 'No Data';
        const value = hasData ? formatValue(raw) : '--';
        return { key, meta, value, status };
    });

    const overallStatus = sensors.some(s => s.status === 'Check') ? 'Check' : 'Normal';

    container.innerHTML = `
        <div class="screen active" style="display:flex;flex-direction:column;background:#f8faf7;height:100vh;position:relative;color:#17231b;">

            <!-- Header -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;background:rgba(255,255,255,.92);border-bottom:1px solid #e5e7eb;backdrop-filter:blur(12px);">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="zoneBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid #e5e7eb;background:#fff;font-size:1.25rem;font-weight:900;color:#17231b;cursor:pointer;flex-shrink:0;">←</button>
                    <div>
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:#047857;">Production Zone</div>
                        <div style="font-weight:900;font-size:1.2rem;color:#17231b;">${escapeHTML(zoneLabel)} Overview</div>
                    </div>
                </div>
                <div style="display:inline-flex;align-items:center;gap:8px;background:${overallStatus === 'Normal' ? '#ecfdf5' : '#fef2f2'};color:${overallStatus === 'Normal' ? '#047857' : '#dc2626'};border:1px solid ${overallStatus === 'Normal' ? '#bbf7d0' : '#fecaca'};padding:8px 14px;border-radius:999px;font-size:0.78rem;font-weight:900;">
                    <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>
                    ${overallStatus === 'Normal' ? 'All Normal' : 'Anomaly Detected'}
                </div>
            </div>

            <!-- Sensor Grid -->
            <div style="flex:1;overflow-y:auto;padding:20px;">
                <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Tap a sensor to view history</div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
    ${sensors.map(s => sensorCard(s)).join('')}
</div>

<div style="display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:16px;margin-bottom:16px;">
    <section style="background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(15,23,42,.08);">
        <div style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading · Temp</div>
        <div style="font-size:2.45rem;font-weight:950;color:${sensors[0].status === 'Normal' ? '#047857' : '#dc2626'};line-height:1;">${sensors[0].value}<span style="font-size:1rem;font-weight:800;color:#64748b;margin-left:6px;">${sensors[0].meta.unit}</span></div>
        <div style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:${sensors[0].status === 'Normal' ? '#ecfdf5' : '#fef2f2'};color:${sensors[0].status === 'Normal' ? '#166534' : '#dc2626'};border:1px solid ${sensors[0].status === 'Normal' ? '#bbf7d0' : '#fecaca'};padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${sensors[0].status}
        </div>
    </section>
    <section style="background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(15,23,42,.08);">
        <div style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Trend History</div>
        <div id="zoneTrendChart" style="width:100%;aspect-ratio:5/2;min-height:120px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.8rem;">Loading...</div>
    </section>
</div>

<section style="background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(15,23,42,.08);">
    <div style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Historical Records · Temp</div>
    <div id="zoneHistoryLog" style="display:flex;flex-direction:column;gap:8px;">
        <div style="color:#94a3b8;font-size:0.85rem;">Loading...</div>
    </div>
</section>
            </div>
        </div>
    `;

    bindEvents({ backTarget, zoneId, params });
}

function sensorCard({ key, meta, value, status }) {
    const isCheck = status === 'Check';
    const isNoData = status === 'No Data';
    const bg     = isCheck ? '#fff5f5' : '#ffffff';
    const border = isCheck ? '#fecaca' : '#e5e7eb';
    const valColor = isCheck ? '#dc2626' : '#047857';
    const badgeBg  = isCheck ? '#fef2f2' : isNoData ? '#f1f5f9' : '#ecfdf5';
    const badgeColor = isCheck ? '#dc2626' : isNoData ? '#94a3b8' : '#047857';
    const badgeBorder = isCheck ? '#fecaca' : isNoData ? '#e2e8f0' : '#bbf7d0';

    return `
        <button class="zone-sensor-card" data-key="${key}" data-label="${meta.label}"
            style="width:calc(25% - 6px);min-width:70px;background:${bg};border:1px solid ${border};border-radius:16px;padding:12px 10px;text-align:left;cursor:pointer;transition:all 0.18s;outline:none;box-shadow:0 4px 16px rgba(15,23,42,.06);">
            <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${meta.label}</div>
            <div style="font-size:1.9rem;font-weight:950;color:${valColor};line-height:1;margin-bottom:10px;">
                ${value}<span style="font-size:0.75rem;font-weight:800;color:#94a3b8;margin-left:4px;">${value !== '--' ? meta.unit : ''}</span>
            </div>
            <div style="display:inline-flex;align-items:center;gap:5px;background:${badgeBg};color:${badgeColor};border:1px solid ${badgeBorder};padding:4px 9px;border-radius:999px;font-size:0.68rem;font-weight:900;">
                <span style="width:5px;height:5px;border-radius:999px;background:currentColor;display:inline-block;"></span>${status}
            </div>
        </button>
    `;
}

function bindEvents({ backTarget, zoneId, params }) {
    document.getElementById('zoneBackBtn').onclick = () => {
    if (params?.from === 'overall-farm') {
        showScreen('sensor-detail', params.returnParams || { key: 'temp', from: 'dash-c', zoneId: 'overall' });
    } else {
        showScreen(backTarget);
    }
};

    document.querySelectorAll('.zone-sensor-card').forEach(card => {
        card.addEventListener('click', () => {
            const key   = card.getAttribute('data-key');
            const label = card.getAttribute('data-label');
            showScreen('sensor-detail', {
    key,
    name: label,
    from: 'zone-detail',
    zoneId,
    returnParams: { zoneId, from: 'zone-detail', returnParams: params },
});
        });
    });

    loadZoneHistory(zoneId);
}

async function fetchZoneReading(zoneId, params) {
    try {
        const query = new URLSearchParams();
        const farm = getCurrentFarm();
        const devices = Array.isArray(farm?.commercialDevices) ? farm.commercialDevices : [];
        const device = devices.find(d => normalizeZoneId(d.zoneId || d.zone) === zoneId);
        if (device?.deviceId)      query.set('deviceId', device.deviceId);
        else if (params.deviceId)  query.set('deviceId', params.deviceId);
        else                       query.set('deviceId', 'farm_001');

        const res = await fetch(`${API_BASE}/api/sensors/latest?${query.toString()}`);
        const data = await res.json();
        return data?.reading || null;
    } catch {
        return null;
    }
}

function getCurrentFarm() {
    if (AppState.currentFarm) return AppState.currentFarm;
    try {
        const farms = JSON.parse(localStorage.getItem('user_farms')) || [];
        return farms.find(f => f.id === AppState.currentFarmId) || farms[farms.length - 1] || null;
    } catch { return null; }
}

function normalizeZoneId(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';
    if (raw === 'a' || raw === 'zone a' || raw === 'zone_a') return 'zone_A';
    if (raw === 'b' || raw === 'zone b' || raw === 'zone_b') return 'zone_B';
    if (raw === 'c' || raw === 'zone c' || raw === 'zone_c') return 'zone_C';
    return raw.startsWith('zone_') ? `zone_${raw.slice(5).toUpperCase()}` : raw;
}

function formatValue(value) {
    if (!Number.isFinite(value)) return '0';
    if (Math.abs(value) >= 100)  return String(Math.round(value));
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(1).replace(/\.0$/, '');
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

async function loadZoneHistory(zoneId) {
    try {
        const res = await fetch(`${API_BASE}/api/sensors/history?deviceId=farm_001&limit=8`);
        const result = await res.json();
        const readings = result.readings || [];
        if (!readings.length) return;

        const values = readings.map(r => Number(r.temperature ?? 0)).reverse();
        const max = Math.max(...values, 1);
        const min = Math.min(...values, 0);
        const range = max - min || 1;
        const points = values.map((v, i) => ({
            x: ((i / (values.length - 1 || 1)) * 100).toFixed(1),
            y: (35 - ((v - min) / range) * 25).toFixed(1),
        }));
        const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
        const areaPath = `${linePath} L 100,40 L 0,40 Z`;

        const chart = document.getElementById('zoneTrendChart');
        if (chart) chart.innerHTML = `
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
                <defs>
                    <linearGradient id="zoneGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="rgba(16,185,129,.30)"/>
                        <stop offset="100%" stop-color="rgba(16,185,129,0)"/>
                    </linearGradient>
                </defs>
                <path d="${areaPath}" fill="url(#zoneGrad)"/>
                <path d="${linePath}" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="1.5" fill="#fff" stroke="#10B981" stroke-width="1"/>`).join('')}
            </svg>`;

        const log = document.getElementById('zoneHistoryLog');
        if (log) log.innerHTML = readings.map(r => {
            const val = Number(r.temperature ?? 0);
            const status = val >= 18 && val <= 35 ? 'Normal' : 'Check';
            const time = r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
            return `
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:13px 0;border-bottom:1px solid #eef2f7;align-items:center;">
                    <span style="color:#64748b;font-weight:700;">${time}</span>
                    <span style="font-weight:950;color:#17231b;">${val.toFixed(1)} <span style="font-size:0.72rem;color:#64748b;">°C</span></span>
                    <span style="text-align:right;"><span style="background:${status === 'Normal' ? '#ecfdf5' : '#fef2f2'};color:${status === 'Normal' ? '#166534' : '#dc2626'};border:1px solid ${status === 'Normal' ? '#bbf7d0' : '#fecaca'};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;">${status}</span></span>
                </div>`;
        }).join('');
    } catch (e) {
        console.error('Zone history load failed:', e);
    }
}
function getCommercialZones() {
    try {
        const farms = JSON.parse(localStorage.getItem('user_farms')) || [];
        const farm = farms.find(f => f.id === AppState.currentFarmId) || farms[farms.length - 1];
        const zones = farm?.zones || farm?.commercialStructure?.zones || [];
        if (zones.length) return zones.map(z => ({
            id: z.zone_id || z.id,
            label: z.name || (z.zone_id || z.id || '').replace('_', ' ').toUpperCase(),
        }));
    } catch {}
    return [
        { id: 'zone_A', label: 'Zone A' },
        { id: 'zone_B', label: 'Zone B' },
        { id: 'zone_C', label: 'Zone C' },
    ];
}