import { showScreen } from '../utils/navigation.js';

export function render() {
    const container = document.getElementById('screenContainer');
    
    container.innerHTML = `
        <style>
            /* 柱状图基础样式 */
            .chart-bar {
                width: 10%;
                background: rgba(56, 189, 248, 0.2); 
                border-radius: 6px 6px 0 0;
                transition: height 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s;
                position: relative;
                cursor: pointer;
            }
            .chart-bar:hover {
                background: #38BDF8;
                box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
            }
            /* 柱状图顶部的数值提示 */
            .chart-bar::after {
                content: attr(data-value);
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 0.6rem;
                color: #38BDF8;
                font-weight: bold;
                opacity: 0;
                transition: opacity 0.3s;
            }
            .chart-bar:hover::after { opacity: 1; }
        </style>

        <div class="screen active" style="background:#050810; min-height:100vh; padding:20px; font-family:sans-serif; color:#E8F0FF; overflow-y:auto;">
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                <div style="display:flex; align-items:center; cursor:pointer;" id="profitBackBtn">
                    <span style="font-size:1.2rem; margin-right:12px; color:#60A5FA;">←</span>
                    <h2 style="margin:0; font-size:1.3rem; color:#E8F0FF;">Profit Analysis</h2>
                </div>
            </div>

            <div style="background:rgba(56,189,248,0.1); border:1px solid #38BDF8; border-radius:24px; padding:20px; margin-bottom:20px; box-shadow: 0 0 20px rgba(56,189,248,0.05);">
                <div style="display:flex; align-items:center; margin-bottom:10px;">
                    <span style="font-size:1.2rem; margin-right:8px;">✨</span>
                    <div style="color:#38BDF8; font-weight:800; font-size:0.75rem; letter-spacing:1px;">AI PROFIT INSIGHT</div>
                </div>
                <div id="ai-profit-text" style="font-size:0.85rem; line-height:1.6; color:#E8F0FF; opacity:0.9;">
                    AI is calculating your revenue potential...
                </div>
            </div>

            <div style="background:#161B2D; border-radius:24px; padding:24px; margin-bottom:20px; border:1px solid #1E293B;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:1px; margin-bottom:8px;">TOTAL PROFIT (MAY 2026)</div>
                <div style="display:flex; align-items:baseline;">
                    <span id="detail-total-profit" style="font-size:3rem; font-weight:900; color:#38BDF8; line-height:1;">--</span>
                    <span style="font-size:1.2rem; color:#60A5FA; margin-left:8px; font-weight:bold;">RM</span>
                </div>
                <div id="profit-trend-label" style="font-size:0.8rem; color:#FFFFFF; font-weight:bold; margin-top:12px;">Syncing with Firebase...</div>
            </div>

            <div style="background:#161B2D; border-radius:24px; padding:24px; margin-bottom:20px; border:1px solid #1E293B;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:1px; margin-bottom:25px;">WEEKLY PROFIT TREND</div>
                
                <div id="profit-bars-container" style="height:140px; display:flex; align-items:flex-end; justify-content:space-between; padding-bottom:10px; border-bottom:1px dashed #1E293B; margin-bottom:10px;">
                    </div>
                
                <div style="display:flex; justify-content:space-between; color:#4A6A9A; font-size:0.65rem; font-weight:bold;">
                    <span>Past Readings (Latest 7)</span>
                </div>
            </div>

            <div style="background:#161B2D; border-radius:24px; padding:24px; border:1px solid #1E293B;">
                <div style="color:#4A6A9A; font-weight:800; font-size:0.75rem; letter-spacing:1px; margin-bottom:20px;">HISTORICAL LOG</div>
                <div id="profit-list-container" style="display:flex; flex-direction:column; gap:16px;">
                    </div>
            </div>

        </div>
    `;

    bindEvents();
    loadProfitDetail();
}

function bindEvents() {
    document.getElementById('profitBackBtn').onclick = () => showScreen('dash-c');
}

// --- 核心业务逻辑 ---

async function loadProfitDetail() {
    try {
        // 1. 从后端获取最近 7 条传感器记录
        // 我们利用 lightRaw 来模拟利润 (光照充足通常意味着产出更好)
        const res = await fetch('http://localhost:3000/api/sensors/history?limit=7');
        const data = await res.json();
        const history = data.history || [];

        if (history.length > 0) {
            // A. 更新总利润 (模拟计算：过去 7 条记录的平均 lightRaw * 系数)
            const totalLight = history.reduce((sum, r) => sum + (r.lightRaw || 0), 0);
            const simulatedTotal = (totalLight * 0.05).toFixed(2);
            document.getElementById('detail-total-profit').innerText = Number(simulatedTotal).toLocaleString();
            document.getElementById('profit-trend-label').innerText = "↑ +12.5% from last period";

            // B. 渲染动态柱状图
            const barsContainer = document.getElementById('profit-bars-container');
            barsContainer.innerHTML = history.map(d => {
                const profit = (d.lightRaw * 0.05).toFixed(0);
                const heightPercentage = Math.min((d.lightRaw / 4000) * 100, 100); // 假设最高 4000
                return `<div class="chart-bar" style="height: ${heightPercentage}%" data-value="RM ${profit}"></div>`;
            }).join('');

            // C. 渲染历史列表
            const listContainer = document.getElementById('profit-list-container');
            listContainer.innerHTML = history.map(d => {
                const date = new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                const profit = (d.lightRaw * 0.05).toFixed(2);
                return `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px solid #1E293B;">
                        <div>
                            <div style="color:#E8F0FF; font-weight:bold; font-size:0.85rem;">${date}</div>
                            <div style="color:#4A6A9A; font-size:0.65rem;">Sensor Sync</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="color:#38BDF8; font-weight:900;">+ RM ${profit}</div>
                        </div>
                    </div>
                `;
            }).join('');

            // D. 呼叫 AI 进行利润分析
            await getAIProfitInsight(history);
        }
    } catch (e) {
        console.error("Profit data sync failed:", e);
        document.getElementById('ai-profit-text').innerText = "System offline. Check backend connection.";
    }
}

async function getAIProfitInsight(historyData) {
    // 构造给 AI 的指令
    const prompt = `
        You are a farm business analyst. 
        Based on these latest 7 sensor readings (lightRaw focus): ${JSON.stringify(historyData)}.
        Predict the profit trend and give one specific advice to increase yield.
        Answer in Chinese in 2 short sentences.
    `;

    try {
        const res = await fetch('http://localhost:3000/api/chat', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt }) 
        });
        
        const result = await res.json();
        // 渲染 AI 的回复
        document.getElementById('ai-profit-text').innerText = result.reply || result.response || "AI Analysis complete.";
    } catch (e) {
        document.getElementById('ai-profit-text').innerText = "AI Insight is currently unavailable.";
    }
}