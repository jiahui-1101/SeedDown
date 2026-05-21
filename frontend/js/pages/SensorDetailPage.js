import { API_BASE } from '../utils/apiBase.js';
import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';
import { readMetric, toFiniteNumber } from '../utils/sensorReading.js';


const SENSOR_META = {
    temp: { field: 'temperature', unit: 'deg C', label: 'Temperature', normal: value => value >= 18 && value <= 35 },
    humid: { field: 'humidity', unit: '%', label: 'Humidity', normal: value => value >= 35 && value <= 80 },
    ph: { field: 'ph', unit: 'pH', label: 'pH', normal: value => value >= 5.5 && value <= 7.5 },
    light: { field: 'lightRaw', unit: 'raw', label: 'Light', normal: value => value >= 1500 },
    water: { field: 'waterDistanceCm', unit: 'cm', label: 'Water', normal: value => value >= 3 && value <= 30 },
    nutrient: { field: 'gasRaw', unit: 'raw', label: 'Gas', normal: value => value < 3000 },
    gas: { field: 'gasRaw', unit: 'raw', label: 'Gas', normal: value => value < 3000 },
};

export async function render(params = {}) {
    const sensorKey = params.key || params.sensor || 'temp';
    const meta = SENSOR_META[sensorKey] || SENSOR_META.temp;
    const sensorName = params.name || meta.label || 'Sensor';
    const isCommercial = params.from === 'dash-c' || AppState.mode === 'commercial';
    const backTarget = params.from || (isCommercial ? 'dash-c' : 'home');
    const container = document.getElementById('screenContainer');
    if (!container) {
        console.error('SensorDetailPage cannot render: #screenContainer not found');
        return;
    }

    const historyRows = await fetchHistory(meta, params);
const chart = buildChart(historyRows);
    const theme = getTheme(isCommercial);

    container.innerHTML = `
        <div class="screen active" style="display:flex;flex-direction:column;background:${theme.page};height:100vh;position:relative;color:${theme.text};">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="detailBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid ${theme.border};background:${theme.surface};box-shadow:${theme.buttonShadow};font-size:1.25rem;font-weight:900;color:${theme.text};cursor:pointer;flex-shrink:0;">←</button>
                    <div style="min-width:0;">
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${theme.accent};">${isCommercial ? 'Commercial Sensor' : 'Live Sensor'}</div>
                        <div style="font-weight:900;font-size:1.12rem;color:${theme.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(sensorName)} Analysis</div>
                    </div>
                </div>
            </div>

            <div style="flex:1;overflow-y:auto;padding:0 20px 20px 20px;">
                <div style="display:grid;grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);gap:16px;margin-bottom:16px;">
                    <section style="background:${theme.surface};border:1px solid ${theme.border};border-radius:24px;padding:22px;box-shadow:${theme.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:${theme.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading</div>
                        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
                            <span style="font-size:2.45rem;font-weight:950;color:${theme.accent};line-height:1;">${escapeHTML(historyRows[0].val)}</span>
                            <span style="font-size:1rem;font-weight:800;color:${theme.muted};">${escapeHTML(meta.unit)}</span>
                        </div>
                        <div style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:${historyRows[0].status === 'Normal' ? theme.soft : '#fef2f2'};color:${historyRows[0].status === 'Normal' ? theme.accentDark : '#dc2626'};border:1px solid ${historyRows[0].status === 'Normal' ? theme.softBorder : '#fecaca'};padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
                            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${historyRows[0].status}
                        </div>
                    </section>

                    <section style="background:${theme.surface};border:1px solid ${theme.border};border-radius:24px;padding:22px;box-shadow:${theme.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:${theme.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Trend History</div>
                        <div style="width:100%;aspect-ratio:5 / 2;min-height:150px;position:relative;margin:0 auto;">
                            ${chart.empty ? `<div style="height:100%;display:flex;align-items:center;justify-content:center;color:${theme.muted};font-size:0.85rem;font-weight:800;">Waiting for live data</div>` : `<svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible;display:block;">
                                <defs>
                                    <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="${theme.chartFillTop}"/>
                                        <stop offset="100%" stop-color="rgba(16,185,129,0)"/>
                                    </linearGradient>
                                </defs>
                                <path d="${chart.areaPath}" fill="url(#sensorGrad)"></path>
                                <path d="${chart.linePath}" fill="none" stroke="${theme.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                ${chart.interactiveSlices}
                            </svg>`}
                            <div id="chartTooltip" style="display:none;position:absolute;top:-10px;background:${theme.tooltip};color:#fff;padding:6px 10px;border-radius:10px;font-size:0.78rem;pointer-events:none;white-space:nowrap;transform:translateX(-50%);z-index:10;text-align:center;"></div>
                        </div>
                    </section>
                </div>

                <section style="background:${theme.surface};border:1px solid ${theme.border};border-radius:24px;padding:22px;box-shadow:${theme.shadow};">
                    <div style="font-size:0.72rem;font-weight:950;color:${theme.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Historical Records</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${historyRows.map(row => `
                            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:0.9rem;padding:13px 0;border-bottom:1px solid ${theme.line};align-items:center;">
                                <span style="color:${theme.muted};font-weight:700;">${escapeHTML(row.time)}</span>
                                <span style="font-weight:950;color:${theme.text};">${escapeHTML(row.val)} <span style="font-size:0.72rem;color:${theme.muted};font-weight:800;">${escapeHTML(meta.unit)}</span></span>
                                <span style="text-align:right;">
                                    <span style="background:${row.status === 'Normal' ? theme.soft : '#fef2f2'};color:${row.status === 'Normal' ? theme.accentDark : '#dc2626'};border:1px solid ${row.status === 'Normal' ? theme.softBorder : '#fecaca'};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;white-space:nowrap;">${row.status}</span>
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </section>
            </div>

        </div>
    `;

    bindEvents({ backTarget, sensorKey, unit: meta.unit, params });
}

const DEMO_BEGINNER_DEVICES = {
    starter:          'beginner_starter',
    beginner_starter: 'beginner_starter',
    standard:         'beginner_standard',
    beginner_standard:'beginner_standard',
    pro:              'beginner_pro',
    beginner_pro:     'beginner_pro',
};

function resolveDeviceId(params = {}) {
    if (params.deviceId && params.deviceId !== 'farm_001' && !String(params.deviceId).startsWith('dev_')) {
        return params.deviceId;
    }
    const farm = getCurrentFarm();
    const stored = farm?.deviceId;
    if (stored && stored !== 'farm_001' && !String(stored).startsWith('dev_')) return stored;
    const level = String(farm?.packageLevel || '').toLowerCase();
    return DEMO_BEGINNER_DEVICES[level] || 'beginner_standard';
}

async function fetchHistory(meta, params = {}) {
    try {
        const deviceId = resolveDeviceId(params);
        const response = await fetch(`${API_BASE}/api/sensors/history?deviceId=${deviceId}&limit=8`);
        
        const result = await response.json();
        const readings = result.readings;
        if (!Array.isArray(readings) || readings.length === 0) throw new Error('No data');

        return readings.map(item => {
            const numeric = readSensorField(item, meta.field);
            return {
                time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
                numeric,
                val: numeric !== null ? formatValue(numeric) : '--',
                status: numeric === null ? 'No Data' : meta.normal(numeric) ? 'Normal' : 'Check',
            };
        });
    } catch (err) {
        console.error('Sensor history fetch error:', err);
        return [{ time: 'N/A', numeric: null, val: '--', status: 'Offline' }];
    }
}

function buildChart(historyRows) {
    const chartData = [...historyRows].reverse().filter(d => toFiniteNumber(d.numeric) !== null);
    if (!chartData.length) return { empty: true, linePath: '', areaPath: '', interactiveSlices: '' };
    const values = chartData.map(d => d.numeric);
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values, 0);
    const range = maxVal - minVal || 1;

    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1 || 1)) * 100;
        const y = 35 - ((d.numeric - minVal) / range) * 25;
        return { x: x.toFixed(1), y: y.toFixed(1), val: d.val, time: d.time };
    });

    const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaPath = `${linePath} L 100,40 L 0,40 Z`;
    const sliceWidth = 100 / (points.length - 1 || 1);
    const interactiveSlices = points.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="1.5" fill="#FFFFFF" stroke="#10B981" stroke-width="1" pointer-events="none"></circle>
        <rect class="chart-slice" data-val="${escapeHTML(p.val)}" data-time="${escapeHTML(p.time)}" data-cx="${p.x}"
              x="${p.x - sliceWidth / 2}" y="0" width="${sliceWidth}" height="40"
              fill="transparent" style="cursor:crosshair;pointer-events:all;outline:none;"></rect>
    `).join('');

    return { linePath, areaPath, interactiveSlices };
}

function bindEvents({ backTarget, sensorKey, unit, params = {} }) {
   document.getElementById('detailBackBtn').onclick = () => {
    if (params?.from === 'zone-detail') {
        showScreen('zone-detail', params.returnParams || {});
    } else {
        showScreen(backTarget);
    }
};

    const tooltip = document.getElementById('chartTooltip');
    document.querySelectorAll('.chart-slice').forEach(slice => {
        slice.addEventListener('pointerenter', () => {
            tooltip.innerHTML = `<div style="font-size:0.7rem;opacity:.8;">${slice.getAttribute('data-time')}</div><b>${slice.getAttribute('data-val')} ${escapeHTML(unit)}</b>`;
            tooltip.style.left = `${slice.getAttribute('data-cx')}%`;
            tooltip.style.display = 'block';
        });
        slice.addEventListener('pointerleave', () => tooltip.style.display = 'none');
    });
}


    
function buildSensorQuery(params = {}) {
    const query = new URLSearchParams();
    const deviceId = resolveDeviceId(params);
    query.set('deviceId', deviceId);
    return query;
}


function getCurrentFarm() {
    if (AppState.currentFarm) return AppState.currentFarm;
    try {
        const farms = JSON.parse(localStorage.getItem('user_farms')) || [];
        return farms.find(farm => farm.id === AppState.currentFarmId) || farms[farms.length - 1] || null;
    } catch {
        return null;
    }
}
function getTheme(isCommercial) {
    if (isCommercial) {
        return {
            page: '#f8faf7', surface: 'rgba(255,255,255,.94)', text: '#17231b', muted: '#64748b',
            accent: '#047857', accentDark: '#166534', soft: '#ecfdf5', softBorder: '#bbf7d0',
            border: '#e5e7eb', line: '#eef2f7', shadow: '0 16px 44px rgba(15,23,42,.08)',
            buttonShadow: '0 12px 30px rgba(15,23,42,.08)', chartFillTop: 'rgba(16,185,129,.30)', tooltip: '#166534',
        };
    }
    return {
        page: '#F0FDF4', surface: '#FFFFFF', text: '#065F46', muted: '#64748B',
        accent: '#10B981', accentDark: '#065F46', soft: '#D1FAE5', softBorder: '#A7F3D0',
        border: '#D1FAE5', line: '#F8FAFC', shadow: '0 8px 24px rgba(5,150,105,.06)',
        buttonShadow: 'none', chartFillTop: 'rgba(16,185,129,.40)', tooltip: '#065F46',
    };
}

function formatValue(value) {
    if (!Number.isFinite(value)) return '--';
    if (Math.abs(value) >= 100) return String(Math.round(value));
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(1).replace(/\.0$/, '');
}

function readSensorField(reading, field) {
    if (field === 'temperature') return readMetric(reading, ['temperature', 'temp']);
    if (field === 'humidity') return readMetric(reading, ['humidity', 'humid', 'hum']);
    return toFiniteNumber(reading?.[field]);
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
