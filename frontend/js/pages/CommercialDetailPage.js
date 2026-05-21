import { API_BASE } from '../utils/apiBase.js';
// CommercialDetailPage.js
import { showScreen } from '../utils/navigation.js';
import { AppState } from '../store.js';


// 💡 这里的阈值直接动态绑定 ProfilePage 保存的全局设置
const SENSOR_META = {
    temp: { 
        field: 'temperature', unit: 'deg C', label: 'Temperature', 
        normal: value => value >= 18 && value <= 35 
    },
    humid: { 
        field: 'humidity', unit: '%', label: 'Humidity', 
        normal: value => value >= 35 && value <= 80 
    },
    ph: { 
        field: 'ph', unit: 'pH', label: 'pH', 
        normal: value => {
            const profile = JSON.parse(localStorage.getItem('farm_profile') || '{}');
            return value >= Number(profile.phMin || 5.5) && value <= Number(profile.phMax || 6.5);
        } 
    },
    light: { 
        field: 'lightRaw', unit: 'raw', label: 'Light', 
        normal: value => {
            const profile = JSON.parse(localStorage.getItem('farm_profile') || '{}');
            return value >= Number(profile.lightThreshold || 1500);
        } 
    },
    water: { 
        field: 'waterDistanceCm', unit: 'cm', label: 'Water', 
        normal: value => value >= 3 && value <= 30 
    },
    nutrient: { field: 'gasRaw', unit: 'raw', label: 'Gas', normal: value => value < 3000 },
    gas: { field: 'gasRaw', unit: 'raw', label: 'Gas', normal: value => value < 3000 },
};

export async function render(params = {}) {
    const sensorKey = params.key || params.sensor || 'temp';
    const meta = SENSOR_META[sensorKey] || SENSOR_META.temp;
    
    let displayName = meta.label || 'Sensor';
    if (params.zoneId === 'overall') displayName = 'Overall Farm';
    else if (params.zoneId) displayName = params.zoneId.replace('_', ' ').toUpperCase();

    const container = document.getElementById('screenContainer');

    // 复用你原有的数据抓取和图表生成逻辑
    const historyRows = await fetchHistory(meta, params);
    const chart = buildChart(historyRows);
    
    // 固定使用 Commercial 的绿色高端主题
    const theme = {
        page: '#f8faf7', surface: 'rgba(255,255,255,.94)', text: '#17231b', muted: '#64748b',
        accent: '#047857', accentDark: '#166534', soft: '#ecfdf5', softBorder: '#bbf7d0',
        border: '#e5e7eb', line: '#eef2f7', shadow: '0 16px 44px rgba(15,23,42,.08)',
        buttonShadow: '0 12px 30px rgba(15,23,42,.08)', chartFillTop: 'rgba(16,185,129,.30)', tooltip: '#166534',
    };

    container.innerHTML = `
        <div class="screen active" style="display:flex;flex-direction:column;background:${theme.page};height:100vh;position:relative;color:${theme.text};">
            
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="comDetailBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid ${theme.border};background:${theme.surface};box-shadow:${theme.buttonShadow};font-size:1.25rem;font-weight:900;color:${theme.text};cursor:pointer;flex-shrink:0;">←</button>
                    <div style="min-width:0;">
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${theme.accent};">Commercial Sensor</div>
                        <div style="font-weight:900;font-size:1.12rem;color:${theme.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(displayName)} Analysis</div>
                    </div>
                </div>
                <div style="width: 42px;"></div> </div>

            <div style="flex:1;overflow-y:auto;padding:0 20px 20px 20px;">
                <div style="display:grid;grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);gap:16px;margin-bottom:16px;">
                    
                    <section style="background:${theme.surface};border:1px solid ${theme.border};border-radius:24px;padding:22px;box-shadow:${theme.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading</div>
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
                            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible;display:block;">
                                <defs>
                                    <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="${theme.chartFillTop}"/>
                                        <stop offset="100%" stop-color="rgba(16,185,129,0)"/>
                                    </linearGradient>
                                </defs>
                                <path d="${chart.areaPath}" fill="url(#sensorGrad)"></path>
                                <path d="${chart.linePath}" fill="none" stroke="${theme.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                ${chart.interactiveSlices}
                            </svg>
                        </div>
                    </section>
                </div>

                <section style="background:${theme.surface};border:1px solid ${theme.border};border-radius:24px;padding:22px;box-shadow:${theme.shadow};margin-bottom:16px;">
                    ${historyRows[0].status === 'Normal' ? `
                        <div style="font-size:0.72rem;font-weight:950;color:#16a34a;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px;display:flex;align-items:center;gap:6px;">
                            <span style="width:8px;height:8px;border-radius:50%;background:#16a34a;display:inline-block;"></span> All Zones Nominal · Select to Inspect
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
                            ${['zone_A', 'zone_B', 'zone_C'].map(z => `
                                <button class="com-drill-zone-btn" data-zone="${z}" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;border-radius:16px;border:1px solid ${theme.border};background:#f8fafc;cursor:pointer;gap:6px;outline:none;">
                                    <span style="font-size:0.9rem;font-weight:900;color:${theme.text};">${z.replace('_', ' ').toUpperCase()}</span>
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
                            ${['zone_A', 'zone_B', 'zone_C'].map((z, idx) => {
                                const isCulprit = idx === 1; // 模拟 Zone B 异常
                                return `
                                    <div class="com-drill-zone-btn" data-zone="${z}" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-radius:16px;border:1px solid ${isCulprit ? '#fecaca' : theme.border};background:${isCulprit ? '#fff5f5' : '#f8fafc'};cursor:pointer;">
                                        <div style="display:flex;align-items:center;gap:10px;">
                                            <span style="font-size:0.95rem;font-weight:900;color:${theme.text};">${z.replace('_', ' ').toUpperCase()}</span>
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
                                    <span style="background:${row.status === 'Normal' ? theme.soft : '#fef2f2'};color:${row.status === 'Normal' ? theme.accentDark : '#dc2626'};border:1px solid ${row.status === 'Normal' ? theme.softBorder : '#fecaca'};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;">${row.status}</span>
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </section>
            </div>
        </div>
    `;

    // 绑定专属事件
    document.getElementById('comDetailBackBtn').addEventListener('click', () => {
        showScreen('dash-c'); // 点击返回大屏
    });

    document.querySelectorAll('.com-drill-zone-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetZone = btn.getAttribute('data-zone');
            // 点击 Zone 重新加载当前页面，传入 ZoneId 钻取
            showScreen('commercial-detail', { sensor: sensorKey, zoneId: targetZone });
        });
    });
}

// 💡 保持你原有的辅助函数不变（fetchHistory, buildChart, escapeHTML...）
// [把原 sensordetail.txt 尾部的那些 fetchHistory 辅助函数原封不动抄过来即可]