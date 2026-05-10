import { showScreen } from '../utils/navigation.js';
import { AppState } from '../store.js';

export function render() {
    const container = document.getElementById('screenContainer');
    
    // 初始化默认公式
    if (!AppState.profitFormula) {
        AppState.profitFormula = "temp * 2.5";
    }

    container.innerHTML = `
        <style>
            /* 1. 折线图动画 */
            .trend-path {
                fill: none; stroke: #38BDF8; stroke-width: 3;
                stroke-dasharray: 1000; stroke-dashoffset: 1000;
                animation: drawLine 2s ease forwards;
            }
            @keyframes drawLine { to { stroke-dashoffset: 0; } }

            .chart-point {
                fill: #38BDF8; stroke: #050810; stroke-width: 2; cursor: pointer; transition: all 0.2s;
            }
            .chart-point:hover { r: 8; fill: #FFFFFF; filter: drop-shadow(0 0 10px #38BDF8); }

            /* 2. Hover Tooltip (显示钱的小框) */
            #chart-tooltip {
                position: absolute; background: #1E293B; color: #38BDF8;
                padding: 6px 12px; border-radius: 8px; font-size: 0.75rem;
                font-weight: bold; border: 1px solid #38BDF8;
                pointer-events: none; opacity: 0; transition: opacity 0.2s;
                z-index: 1000; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            }

            /* 3. Toast 成功提示弹窗 */
            #toast-msg {
                position: fixed; bottom: -60px; left: 50%; transform: translateX(-50%);
                background: #38BDF8; color: #050810; padding: 12px 24px;
                border-radius: 50px; font-weight: 800; font-size: 0.8rem;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 2000;
            }

            .formula-input {
                background: #161B2D; border: 1px solid #1E293B; color: #38BDF8;
                padding: 12px; border-radius: 12px; font-family: monospace; width: 100%; outline: none;
            }

            .record-card {
                background: rgba(22, 27, 45, 0.6); border: 1px solid #1E293B;
                padding: 16px; border-radius: 16px; margin-bottom: 12px;
                display: flex; justify-content: space-between; align-items: center;
            }
        </style>

        <div class="screen active" style="background:#050810; min-height:100vh; padding:20px; font-family:sans-serif; color:#E8F0FF; overflow-y:auto; position:relative;">
            
            <div style="text-align:center; margin-top:40px; margin-bottom:30px;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:2px; margin-bottom:8px;">TOTAL PROFIT</div>
                <div style="display:flex; align-items:baseline; justify-content:center;">
                    <span id="detail-total-val" style="font-size:3.8rem; font-weight:900; color:#38BDF8; line-height:1;">--</span>
                    <span style="font-size:1.5rem; color:#60A5FA; margin-left:12px; font-weight:bold;">RM</span>
                </div>
            </div>

            <div style="background:rgba(56,189,248,0.05); border:1px solid rgba(56,189,248,0.2); border-radius:20px; padding:16px; margin-bottom:24px;">
                <div id="ai-short-advice" style="font-size:0.8rem; color:#E8F0FF; text-align:center; opacity:0.9;">
                    ✨ Advisor: Fetching telemetry data...
                </div>
            </div>

            <div style="background:#161B2D; border-radius:28px; padding:24px; border:1px solid #1E293B; margin-bottom:24px; position:relative;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:1px; margin-bottom:20px;">HISTORICAL TREND</div>
                <div style="position:relative; height:160px; width:100%;">
                    <svg viewBox="0 0 400 150" style="width:100%; height:150px; overflow:visible;">
                        <path id="trend-line" class="trend-path" d="" />
                        <g id="trend-points"></g>
                    </svg>
                    <div id="chart-tooltip">RM 0.00</div>
                </div>
            </div>

            <div style="margin-bottom:30px;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:1px; margin-bottom:16px;">RECENT REVENUE RECORDS</div>
                <div id="revenue-list"></div>
            </div>

            <div style="background:#161B2D; border-radius:24px; padding:20px; border:1px dashed #232D45; margin-bottom:50px;">
                <div style="color:#60A5FA; font-weight:bold; font-size:0.7rem; margin-bottom:10px;">⚙️ CALCULATION FORMULA</div>
                <input type="text" id="formulaInput" class="formula-input" value="${AppState.profitFormula}">
                <button id="saveFormulaBtn" style="width:100%; margin-top:16px; background:#38BDF8; color:#050810; border:none; padding:12px; border-radius:12px; font-weight:900; cursor:pointer;">UPDATE FORMULA</button>
            </div>

            <div id="profitBackBtn" style="position:absolute; top:20px; left:20px; width:38px; height:38px; background:#161B2D; border-radius:10px; display:flex; align-items:center; justify-content:center; border:1px solid #1E293B; cursor:pointer; z-index:100;">
                <span style="color:#60A5FA; font-weight:bold;">←</span>
            </div>

            <div id="toast-msg">Update Successful! 🚀</div>
        </div>
    `;

    bindEvents();
    loadProfitDetail();
}

function showToast(text) {
    const toast = document.getElementById('toast-msg');
    toast.innerText = text; toast.style.opacity = '1'; toast.style.bottom = '40px';
    setTimeout(() => { toast.style.opacity = '0'; toast.style.bottom = '-60px'; }, 2000);
}

function bindEvents() {
    document.getElementById('profitBackBtn').onclick = () => showScreen('dash-c');
    document.getElementById('saveFormulaBtn').onclick = () => {
        AppState.profitFormula = document.getElementById('formulaInput').value;
        showToast("Update Successful! 🚀");
        loadProfitDetail();
    };
}

function calculateProfit(d, formulaStr) {
    try {
        const temp = d.temperature || d.temp || 0;
        const light = d.light || d.lightRaw || 0;
        const humid = d.humidity || d.humid || 0;
        const ph = d.ph || 0;
        const water = d.waterLevel || d.waterDistanceCm || 0;
        const gas = d.gasValue || d.gasRaw || 0;

        const result = new Function('temp', 'light', 'humid', 'ph', 'water', 'gas', `return ${formulaStr}`)(temp, light, humid, ph, water, gas);
        return parseFloat(result).toFixed(2);
    } catch (e) { return "0.00"; }
}

async function loadProfitDetail() {
    try {
        // 使用你主页成功的路径逻辑
        const urls = [
            'http://localhost:3000/api/sensors?limit=7&deviceId=farm_001',
            'http://localhost:3000/api/sensors/history?limit=7&deviceId=farm_001'
        ];

        let history = [];
        for (let url of urls) {
            try {
                const res = await fetch(url);
                const data = await res.json();
                history = data.readings || data.history || (Array.isArray(data) ? data : []);
                if (history.length > 0) break;
            } catch (e) { }
        }

        if (history.length > 0) {
            // 1. 更新顶部大数字
            const latest = history[0];
            document.getElementById('detail-total-val').innerText = calculateProfit(latest, AppState.profitFormula);

            // 2. 渲染折线图
            const trendLine = document.getElementById('trend-line');
            const pointsGroup = document.getElementById('trend-points');
            const tooltip = document.getElementById('chart-tooltip');
            const displayHistory = [...history].reverse();
            
            let pathD = "";
            let pointsHTML = "";

            displayHistory.forEach((d, i) => {
                const profit = calculateProfit(d, AppState.profitFormula);
                const x = i * (400 / (displayHistory.length - 1));
                const y = 150 - (Math.min(parseFloat(profit), 200) / 200) * 120;
                
                pathD += (i === 0 ? "M " : " L ") + `${x} ${y}`;
                pointsHTML += `<circle cx="${x}" cy="${y}" r="4" class="chart-point" data-val="RM ${profit}" />`;
            });

            trendLine.setAttribute('d', pathD);
            pointsGroup.innerHTML = pointsHTML;

            // 💡 修复：确保 Hover 事件成功绑定
            document.querySelectorAll('.chart-point').forEach(pt => {
                pt.addEventListener('mouseenter', (e) => {
                    tooltip.innerText = e.target.getAttribute('data-val');
                    tooltip.style.opacity = '1';
                    // 相对 SVG 容器定位
                    const cx = parseFloat(e.target.getAttribute('cx'));
                    const cy = parseFloat(e.target.getAttribute('cy'));
                    tooltip.style.left = (cx - 30) + "px";
                    tooltip.style.top = (cy - 45) + "px";
                });
                pt.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                });
            });

            // 3. 渲染历史列表
            document.getElementById('revenue-list').innerHTML = history.map(d => {
                const time = new Date(d.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const p = calculateProfit(d, AppState.profitFormula);
                return `
                    <div class="record-card">
                        <div><div style="font-weight:bold; font-size:0.9rem;">Revenue Record</div><div style="color:#4A6A9A; font-size:0.65rem;">Today, ${time}</div></div>
                        <div style="color:#38BDF8; font-weight:900; font-size:1.1rem;">+ RM ${p}</div>
                    </div>`;
            }).join('');

            getAIAdvice(history);
        }
    } catch (e) { 
        console.error("Fetch Error", e);
    }
}

async function getAIAdvice(historyData) {
    const prompt = `Evaluate these 7 farm readings: ${JSON.stringify(historyData)}. 1 short English sentence about yield status.`;
    try {
        const res = await fetch('http://localhost:3000/api/chat', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt }) 
        });
        const result = await res.json();
        document.getElementById('ai-short-advice').innerText = "✨ Advisor: " + (result.reply || result.response);
    } catch (e) { 
        document.getElementById('ai-short-advice').innerText = "✨ Advisor: System status optimal.";
    }
}