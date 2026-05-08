import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';

export function render(params = {}) {
    const sensorKey = params.key || 'temp';
    const sensorName = params.name || 'Sensor';
    const container = document.getElementById('screenContainer');

    const units = { temp: '°C', humid: '%rh', light: '%', ph: 'pH', water: '%', nutrient: '%' };
    const unit = units[sensorKey] || '';

    // 1. 唯一数据源 (你的原版数据)
    const historyRows = [
        { time: '16:00', val: '34.2', status: 'Danger' },
        { time: '15:55', val: '33.8', status: 'Warning' },
        { time: '15:50', val: '31.5', status: 'Normal' },
        { time: '15:45', val: '29.8', status: 'Normal' },
        { time: '15:40', val: '28.5', status: 'Normal' }
    ];

    // 2. 算坐标 (数据联动)
    const chartData = [...historyRows].reverse();
    const values = chartData.map(d => parseFloat(d.val));
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;

    const pointsData = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 40 - 5 - ((parseFloat(d.val) - minVal) / range) * (40 - 10);
        return { x: x.toFixed(1), y: y.toFixed(1), val: d.val, time: d.time };
    });

    const linePath = `M ${pointsData.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaPath = `${linePath} L 100,40 L 0,40 Z`;

    // 3. 生成透明的“垂直切片”，这是完美触发 Hover 的秘诀
    const sliceWidth = 100 / (pointsData.length - 1 || 1);
    const interactiveSlices = pointsData.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="1.5" fill="#FFFFFF" stroke="#10B981" stroke-width="1" pointer-events="none"></circle>
        <rect class="chart-slice" data-val="${p.val}" data-time="${p.time}" data-cx="${p.x}" 
              x="${p.x - sliceWidth/2}" y="0" width="${sliceWidth}" height="40" 
              fill="transparent" style="cursor:crosshair; pointer-events:all; outline:none;"></rect>
    `).join('');

    // 🌟 原汁原味的 UI 设计
    container.innerHTML = `
        <div class="screen active" style="display:flex; flex-direction:column; background:#F0FDF4; height:100vh; position:relative;">
            
            <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; background:transparent;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <button id="detailBackBtn" style="border:none; background:none; font-size:1.5rem; color:#065F46; cursor:pointer;">←</button>
                    <div style="font-weight:700; font-size:1.15rem; color:#065F46;">${sensorName} Analysis</div>
                </div>
                <button id="openModalBtn" style="background:#D1FAE5; color:#065F46; border:none; padding:8px 14px; border-radius:12px; font-size:0.75rem; font-weight:700; cursor:pointer; box-shadow:0 2px 8px rgba(5,150,105,0.15);">
                    ⚙️ Set Preference
                </button>
            </div>

            <div style="flex:1; overflow-y:auto; padding:0 20px 20px 20px;">
                
                <div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06); margin-bottom:20px;">
                    <div style="font-size:0.8rem; font-weight:700; color:#10B981; margin-bottom:8px;">CURRENT READING</div>
                    <div style="display:flex; align-items:baseline; gap:8px;">
                        <span style="font-size:2.5rem; font-weight:800; color:#065F46;">${historyRows[0].val}</span>
                        <span style="font-size:1.2rem; font-weight:600; color:#94A3B8;">${unit}</span>
                    </div>
                </div>

                <div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06); margin-bottom:20px;">
                    <div style="font-size:0.85rem; font-weight:700; color:#065F46; margin-bottom:20px;">24-HOUR TREND</div>
                    
                    <div style="height:140px; width:100%; position:relative;">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%; height:100%; overflow:visible;">
                            <defs>
                                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="rgba(16, 185, 129, 0.4)"/>
                                    <stop offset="100%" stop-color="rgba(16, 185, 129, 0)"/>
                                </linearGradient>
                            </defs>
                            <path d="${areaPath}" fill="url(#greenGrad)"></path>
                            <path d="${linePath}" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            
                            ${interactiveSlices}
                        </svg>

                        <div id="chartTooltip" style="display:none; position:absolute; top:-10px; background:#065F46; color:#FFF; padding:6px 10px; border-radius:8px; font-size:0.8rem; pointer-events:none; white-space:nowrap; box-shadow:0 4px 12px rgba(0,0,0,0.15); transform: translateX(-50%); z-index:10; text-align:center;">
                        </div>
                    </div>
                </div>

                <div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06);">
                    <div style="font-size:0.85rem; font-weight:700; color:#065F46; margin-bottom:16px;">HISTORICAL RECORDS</div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; font-size:0.75rem; font-weight:700; color:#10B981; border-bottom:2px solid #F0FDF4; padding-bottom:10px;">
                            <span>TIME</span><span>READING</span><span style="text-align:right;">STATUS</span>
                        </div>
                        ${historyRows.map(row => `
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; font-size:0.9rem; padding:14px 0; border-bottom:1px solid #F8FAFC; align-items:center;">
                                <span style="color:#64748B; font-weight:500;">${row.time}</span>
                                <span style="font-weight:800; color:#065F46;">${row.val} <span style="font-size:0.7rem; color:#94A3B8; font-weight:600;">${unit}</span></span>
                                <span style="text-align:right;">
                                    <span style="background:${row.status === 'Normal' ? '#ECFDF5' : (row.status === 'Warning' ? '#FFFBEB' : '#FEE2E2')}; 
                                                 color:${row.status === 'Normal' ? '#059669' : (row.status === 'Warning' ? '#D97706' : '#DC2626')}; 
                                                 padding:6px 12px; border-radius:12px; font-size:0.7rem; font-weight:700;">
                                        ${row.status === 'Normal' ? '● ' : ''}${row.status}
                                    </span>
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div id="customModal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(6, 95, 70, 0.4); z-index:999; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(3px);">
                <div style="background:white; width:100%; max-width:320px; border-radius:24px; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.15); transform: translateY(-20px);">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                        <div style="background:#D1FAE5; padding:8px; border-radius:50%;">⚙️</div>
                        <div style="font-size:1.1rem; font-weight:800; color:#065F46;">Set Preference</div>
                    </div>
                    <div style="font-size:0.85rem; color:#64748B; margin-bottom:20px; line-height:1.4;">
                        How often should we record <strong style="color:#065F46;">${sensorName}</strong> data?
                    </div>
                    <div style="position:relative; margin-bottom:24px;">
                        <input type="number" id="prefInput" value="2" min="1" max="24" 
                               style="width:100%; padding:14px 16px; padding-right:60px; border:2px solid #D1FAE5; border-radius:16px; font-size:1.2rem; font-weight:700; color:#065F46; outline:none; box-sizing:border-box; transition:border 0.2s;" 
                               onfocus="this.style.borderColor='#10B981'" 
                               onblur="this.style.borderColor='#D1FAE5'">
                        <span style="position:absolute; right:16px; top:50%; transform:translateY(-50%); color:#94A3B8; font-size:0.9rem; font-weight:600;">Hours</span>
                    </div>
                    <div style="display:flex; gap:12px;">
                        <button id="cancelModalBtn" style="flex:1; padding:14px; border:none; background:#F1F5F9; color:#64748B; border-radius:16px; font-weight:700; font-size:0.9rem; cursor:pointer;">Cancel</button>
                        <button id="saveModalBtn" style="flex:1; padding:14px; border:none; background:#10B981; color:white; border-radius:16px; font-weight:700; font-size:0.9rem; cursor:pointer; box-shadow:0 4px 12px rgba(16,185,129,0.3);">Save</button>
                    </div>
                </div>
            </div>

        </div>
    `;

    document.getElementById('detailBackBtn').onclick = () => showScreen('home');
    
    // 🌟 绑定 Hover 逻辑 (兼容鼠标和触摸)
    const tooltip = document.getElementById('chartTooltip');
    document.querySelectorAll('.chart-slice').forEach(slice => {
        slice.addEventListener('pointerenter', (e) => {
            const val = slice.getAttribute('data-val');
            const time = slice.getAttribute('data-time');
            const cx = slice.getAttribute('data-cx');
            
            tooltip.innerHTML = `
                <div style="font-size:0.7rem; opacity:0.8;">${time}</div>
                <div style="font-weight:bold; font-size:1rem;">${val} <span style="font-size:0.7rem; font-weight:normal;">${unit}</span></div>
            `;
            tooltip.style.left = `${cx}%`;
            tooltip.style.display = 'block';
        });

        slice.addEventListener('pointerleave', () => {
            tooltip.style.display = 'none';
        });
    });
    
    const modal = document.getElementById('customModal');
    document.getElementById('openModalBtn').onclick = () => modal.style.display = 'flex';
    document.getElementById('cancelModalBtn').onclick = () => modal.style.display = 'none';
    document.getElementById('saveModalBtn').onclick = () => {
        const hours = document.getElementById('prefInput').value;
        if (hours) {
            modal.style.display = 'none';
            window.showToast?.('success', `Recording set to every ${hours} hours`);
        }
    };
}