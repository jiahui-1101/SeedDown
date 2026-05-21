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
    
    // 💡 动态决定页面顶部的标题名字
    let displayName = meta.label || 'Sensor';
    if (params.zoneId === 'overall') displayName = 'Overall Farm';
    else if (params.zoneId) displayName = params.zoneId.replace('_', ' ').toUpperCase();

    const isCommercial = params.from === 'dash-c' || params.from === 'zone-detail' || AppState.mode === 'commercial';
    const backTarget = params.from || (isCommercial ? 'dash-c' : 'home');
    const container = document.getElementById('screenContainer');

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
                        <div style="font-weight:900;font-size:1.12rem;color:${theme.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(displayName)} Analysis</div>
                    </div>
                </div>
            </div>

            <div style="flex:1;overflow-y:auto;padding:0 20px 20px 20px;">
                <div style="display:grid;grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);gap:16px;margin-bottom:16px;">
                    <section style="background:${theme.surface};border:1px solid ${theme.border};border-radius:24px;padding:22px;box-shadow:${theme.shadow};">
<div style="font-size:0.72rem;font-weight:950;color:${theme.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Overall Status</div>
<div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
    <span style="font-size:2.45rem;font-weight:950;color:${historyRows[0].status === 'Normal' ? theme.accent : '#dc2626'};line-height:1;">${historyRows[0].status === 'Normal' ? 'Normal' : 'Unnormal'}</span>
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

                <section style="background:${theme.surface};border:1px solid ${theme.border};border-radius:24px;padding:22px;box-shadow:${theme.shadow};margin-bottom:16px;">
                    ${historyRows[0].status === 'Normal' ? `
                        <div style="font-size:0.72rem;font-weight:950;color:#16a34a;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px;display:flex;align-items:center;gap:6px;">
                            <span style="width:8px;height:8px;border-radius:50%;background:#16a34a;display:inline-block;"></span> All Zones Nominal · Select to Inspect
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
                            ${getCommercialZones().map(z => `
    <button class="drill-zone-btn" data-zone="${z.id}" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;border-radius:16px;border:1px solid ${theme.border};background:#f8fafc;cursor:pointer;transition:all 0.2s;gap:6px;outline:none;">
        <span style="font-size:0.9rem;font-weight:900;color:${theme.text};">${z.label}</span>
        <span style="background:${theme.soft};color:${theme.accentDark};padding:2px 8px;border-radius:999px;font-size:0.65rem;font-weight:900;">Normal</span>
    </button>
`).join('')}
                        </div>
                    ` : `
                        <div style="font-size:0.72rem;font-weight:950;color:#dc2626;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
                            <span style="width:8px;height:8px;border-radius:50%;background:#dc2626;display:inline-block;"></span> Anomaly Root-Cause Isolation
                        </div>
                        <div style="font-size:0.8rem;color:${theme.muted};margin-bottom:14px;font-weight:700;">Overall variance breached. Locate the anomalous sub-node below:</div>
                        
                        <div style="display:flex;flex-direction:column;gap:10px;">
                            ${getCommercialZones().map((z, idx) => {
    const isCulprit = idx === 1;
    return `
        <div class="drill-zone-btn" data-zone="${z.id}" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-radius:16px;border:1px solid ${isCulprit ? '#fecaca' : theme.border};background:${isCulprit ? '#fff5f5' : '#f8fafc'};cursor:pointer;transition:all 0.2s;">
            <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:0.95rem;font-weight:900;color:${theme.text};">${z.label}</span>
                ${isCulprit ? `<span style="font-size:0.75rem;color:#ef4444;font-weight:950;letter-spacing:0.5px;">[ Culprit Node ]</span>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="background:${isCulprit ? '#fef2f2' : theme.soft};color:${isCulprit ? '#dc2626' : theme.accentDark};border:1px solid ${isCulprit ? '#fecaca' : theme.softBorder};padding:4px 10px;border-radius:999px;font-size:0.7rem;font-weight:900;">
                    ${isCulprit ? 'Check ⚠️' : 'Normal'}
                </span>
                <span style="font-size:1.2rem;color:${isCulprit ? '#dc2626' : theme.accent};font-weight:bold;">→</span>
            </div>
        </div>
    `;
}).join('')}
                        </div>
                    `}
                </section>

                <section style="background:${theme.surface};border:1px solid ${theme.border};border-radius:24px;padding:22px;box-shadow:${theme.shadow};">
                    <div style="font-size:0.72rem;font-weight:950;color:${theme.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Macro Timeline Log</div>
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

            <div id="customModal" style="display:none;position:absolute;inset:0;background:rgba(15,23,42,.22);z-index:999;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px);">
                <div style="background:${theme.surface};width:100%;max-width:340px;border-radius:24px;padding:24px;box-shadow:0 24px 70px rgba(15,23,42,.18);border:1px solid ${theme.border};">
                    <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${theme.accent};margin-bottom:6px;">Preference</div>
                    <div style="font-size:1.1rem;font-weight:950;color:${theme.text};margin-bottom:8px;">Set Record Interval</div>
                    <div style="font-size:0.85rem;color:${theme.muted};margin-bottom:18px;">Set record interval for ${escapeHTML(displayName)} in hours.</div>
                    <input type="number" id="prefInput" value="2" min="1" style="width:100%;box-sizing:border-box;padding:14px;border:1px solid ${theme.border};border-radius:16px;font-weight:900;margin-bottom:18px;background:#f8fafc;color:${theme.text};">
                    <div style="display:flex;gap:12px;">
                        <button id="cancelModalBtn" style="flex:1;padding:13px;border:1px solid ${theme.border};background:#f8fafc;color:${theme.muted};border-radius:16px;font-weight:900;cursor:pointer;">Cancel</button>
                        <button id="saveModalBtn" style="flex:1;padding:13px;border:none;background:${theme.accentDark};color:white;border-radius:16px;font-weight:900;cursor:pointer;">Save</button>
                    </div>
                </div>
            </div>

            <div id="zoneBreakdownModal" style="display:none;position:absolute;inset:0;background:rgba(15,23,42,.3);z-index:999;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px);">
                <div style="background:${theme.surface};width:100%;max-width:360px;border-radius:24px;padding:24px;box-shadow:0 24px 70px rgba(15,23,42,.18);border:1px solid ${theme.border};">
                    <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${theme.accent};margin-bottom:6px;">Time Slice Breakdown</div>
                    <div style="font-size:1.1rem;font-weight:950;color:${theme.text};margin-bottom:4px;" id="breakdownModalTime">At --:--</div>
                    <div style="font-size:0.85rem;color:${theme.muted};margin-bottom:18px;">Overall Average: <span id="breakdownModalVal" style="font-weight:900;color:${theme.accent};">--</span></div>
                    
                    <div style="font-size:0.72rem;font-weight:950;color:${theme.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">Select Zone to inspect:</div>
                    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
                        ${['zone_A', 'zone_B', 'zone_C'].map(z => `
                            <button class="drill-to-zone-btn" data-zone="${z}" style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:14px;border-radius:14px;border:1px solid ${theme.border};background:#f8fafc;cursor:pointer;transition:all 0.15s;">
                                <span style="font-weight:900;color:${theme.text};">${z.replace('_', ' ').toUpperCase()}</span>
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <span style="background:${theme.soft};color:${theme.accentDark};padding:4px 8px;border-radius:999px;font-size:0.7rem;font-weight:900;">Normal</span>
                                    <span style="color:${theme.accent};font-weight:bold;">→</span>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                    <button id="closeBreakdownBtn" style="width:100%;padding:13px;border:1px solid ${theme.border};background:#f1f5f9;color:${theme.muted};border-radius:16px;font-weight:900;cursor:pointer;">Cancel</button>
                </div>
            </div>
        </div>
    `;

    // 💡 记得把 params 传给 bindEvents
    bindEvents({ backTarget, sensorKey, unit: meta.unit, params });
}

async function fetchHistory(meta, params = {}) {
    try {
        const response = await fetch(`${API_BASE}/api/sensors/history?deviceId=farm_001&limit=8`);
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

function bindEvents({ backTarget, sensorKey, unit, params }) {
 document.getElementById('detailBackBtn').onclick = () => {
    if (params?.returnParams) {
        showScreen('zone-detail', params.returnParams);
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

    
    

    

    // 💡 核心交互：如果是 Overall 页面，点击任何一行历史记录，弹出 Zone 细分选择
    const breakdownModal = document.getElementById('zoneBreakdownModal');
    if (breakdownModal) {
        document.querySelectorAll('.overall-history-row').forEach(row => {
            row.addEventListener('click', () => {
                const time = row.getAttribute('data-time');
                const val = row.getAttribute('data-val');
                
                // 把点击的时间和数据动态塞进弹窗的文本里
                document.getElementById('breakdownModalTime').innerText = `Snapshot at ${time}`;
                document.getElementById('breakdownModalVal').innerText = `${val} ${unit}`;
                
                // 展现弹窗
                breakdownModal.style.display = 'flex';
            });
        });

        // 点击取消按钮关闭弹窗
        document.getElementById('closeBreakdownBtn').onclick = () => {
            breakdownModal.style.display = 'none';
        };

        // 在弹窗里点击具体的 Zone A / B / C 按钮，真正跳转进入该 Zone 的独立历史页面
        document.querySelectorAll('.drill-to-zone-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetZone = btn.getAttribute('data-zone');
                breakdownModal.style.display = 'none'; // 关闭弹窗
                
                // 层层钻取：刷新成对应 Zone 的专属详情
                showScreen('sensor-detail', { 
                    ...params, 
                    zoneId: targetZone
                });
            });
        });
    }

    // 💡 动态绑定所有生成的 drill-zone-btn 按钮的点击事件，实现真正的逐层深钻
  document.querySelectorAll('.drill-zone-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetZone = btn.getAttribute('data-zone');
        showScreen('zone-detail', { 
            zoneId: targetZone,
            from: 'overall-farm',
            returnParams: params,
        });
    });
});

    // 💡 1. 提前定义好哪些传感器是跟着 Zone 走的
const ZONED_SENSORS = ['light', 'water', 'soil']; 

// 💡 2. 给大屏上的所有卡片绑定点击事件
document.querySelectorAll('.ops-sensor-grid .sensor-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // 假设你的卡片上绑定了传感器的类型，比如 data-type="water"
        const sensorType = card.getAttribute('data-type'); 

        if (ZONED_SENSORS.includes(sensorType)) {
            // 🔴 路线 2：如果是区域传感器 (Light, Water, Soil)
            // 跳转到一个专门显示“所有区域状态”的中转页面（比如叫 zone-overview）
            // 并把当前想看的传感器类型传过去
            showScreen('zone-overview', { targetSensor: sensorType });
            
        } else {
            // 🟢 路线 1：如果是全局单点传感器 (Temp, Gas 等)
            // 直接跳转到历史详情页，查主设备 farm_001 的数据
            showScreen('sensor-detail', { 
                sensor: sensorType, 
                deviceId: 'farm_001' 
            });
        }
    });
});
}

function buildSensorQuery(params = {}) {
    const farm = getCurrentFarm();
    const query = new URLSearchParams();
    if (params.deviceId) query.set('deviceId', params.deviceId);
    else if (farm?.deviceId) query.set('deviceId', farm.deviceId);
    else if (farm?.zoneId) query.set('zoneId', farm.zoneId);
    else if (farm?.id) query.set('fieldId', farm.id);
    else query.set('deviceId', 'farm_001');
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

