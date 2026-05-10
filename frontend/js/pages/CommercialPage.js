import { showScreen } from '../utils/navigation.js';
import { AppState } from '../store.js';

export function render() {
    const container = document.getElementById('screenContainer');
    
    container.innerHTML = `
        <div class="screen active" id="commercialScreen" style="background:#050810; display:flex; flex-direction:column; height:100vh; color:#E8F0FF; position:relative;">
            
            <div class="topbar" style="background:#0D1221; color:#E8F0FF; padding:16px; border-bottom:1px solid #1E293B; display:flex; align-items:center;">
                <button id="comBackBtn" style="background:transparent; border:none; color:#60A5FA; cursor:pointer;">← Back</button>
                <div class="topbar-brand" style="margin-left:12px; flex:1;">
                    <span style="background:#1E3A5F; padding:4px 8px; border-radius:8px;">⚙</span>
                    <span style="margin-left:8px; font-weight:bold;">NexusGrow PRO</span>
                </div>
                <div class="live-pill" style="background:rgba(239,68,68,0.2); color:#EF4444; padding:4px 10px; border-radius:12px; font-size:0.7rem;">🔴 Live</div>
            </div>

            <div style="flex:1; overflow-y:auto; padding:16px;">
                
                <div id="pro-3d-rack" style="background: linear-gradient(180deg, #161B2D 0%, #0D1221 100%); border-radius:16px; height:200px; margin-bottom:16px; border:1px solid #1E293B; display:flex; justify-content:center; align-items:center; position:relative; overflow:hidden;">
                    <div style="color:#4A6A9A; font-size:0.8rem;">[ 3D Rack Visualizer (Three.js) ]</div>
                    <button style="position:absolute; bottom:12px; right:12px; background:#4F46E5; color:white; border:none; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer; box-shadow:0 4px 10px rgba(79,70,229,0.4);">+</button>
                </div>

                <div style="background:rgba(56,189,248,0.05); border:1px solid rgba(56,189,248,0.2); border-radius:16px; padding:12px; margin-bottom:16px; display:flex; align-items:center; gap:12px;">
                    <div style="font-size:1.5rem;">✨</div>
                    <div style="flex:1;">
                        <div style="color:#38BDF8; font-size:0.6rem; font-weight:bold; letter-spacing:1px;">AI FARM ADVISOR</div>
                        <div id="ai-overview-text" style="font-size:0.75rem; color:#E8F0FF; opacity:0.8;">Syncing with farm Brain...</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
                    <div id="profit-card" style="background:#161B2D; border-radius:16px; padding:16px; border:1px solid #60A5FA; cursor:pointer; box-shadow: 0 0 15px rgba(96,165,250,0.1);">
                        <div style="color:#60A5FA; font-size:0.7rem; font-weight:bold; display:flex; justify-content:space-between;">
                            EST. PROFIT <span>🔍 Trend</span>
                        </div>
                        <div id="pro-profit" style="font-size:1.8rem; color:#00FF88; font-weight:bold; margin-top:4px;">RM --</div>
                    </div>
                    <div id="energy-card" style="background:#161B2D; border-radius:16px; padding:16px; border:1px solid #1E293B; cursor:pointer;">
                        <div style="color:#4A6A9A; font-size:0.7rem; font-weight:bold; display:flex; justify-content:space-between;">
                            ENERGY COST <span>🔍 Detail</span>
                        </div>
                        <div id="pro-energy" style="font-size:1.8rem; color:#FFD966; font-weight:bold; margin-top:4px;">-- kWh</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px;">
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">TEMP</div><div id="pro-temp" style="color:#EF4444; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">HUMID</div><div id="pro-humid" style="color:#60A5FA; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">LIGHT</div><div id="pro-light" style="color:#FBBF24; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">PH</div><div id="pro-ph" style="color:#34D399; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">WATER</div><div id="pro-water" style="color:#818CF8; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                    <div style="background:#161B2D; border-radius:12px; padding:12px; text-align:center; border:1px solid #1E293B;"><div style="font-size:0.6rem; color:#4A6A9A;">GAS</div><div id="pro-gas" style="color:#A78BFA; font-weight:bold; font-size:1.2rem; margin-top:4px;">--</div></div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px;">
                    <div class="com-feat" data-feature="whatif" style="background:#1E293B; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">🔮<div style="font-size:0.6rem; color:#94A3B8; margin-top:4px;">What-If</div></div>
                    <div class="com-feat" data-feature="consumption" style="background:#1E293B; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">⚡<div style="font-size:0.6rem; color:#94A3B8; margin-top:4px;">ESG</div></div>
                    <div class="com-feat" data-feature="alerts" style="background:#1E293B; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">🚨<div style="font-size:0.6rem; color:#94A3B8; margin-top:4px;">Alerts</div></div>
                    <div class="com-feat" data-feature="control" style="background:#1E293B; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">🎛️<div style="font-size:0.6rem; color:#94A3B8; margin-top:4px;">Control</div></div>
                </div>
            </div>

            <div class="bottom-nav" style="background:#0D1221; padding:12px; border-top:1px solid #1E293B; display:flex; justify-content:space-around;">
                <div class="nav-item active" data-screen="home" style="text-align:center; color:#60A5FA; cursor:pointer;"><div style="font-size:1.2rem;">🏠</div><div style="font-size:0.6rem; font-weight:bold; margin-top:2px;">HOME</div></div>
                <div class="nav-item" data-screen="profile" style="text-align:center; color:#4A6A9A; cursor:pointer;"><div style="font-size:1.2rem;">👤</div><div style="font-size:0.6rem; font-weight:bold; margin-top:2px;">PROFILE</div></div>
            </div>

        </div>
    `;

    bindEvents();
    initProDashboard();
}

function bindEvents() {
    const profitCard = document.getElementById('profit-card');
    if (profitCard) {
        profitCard.addEventListener('click', () => {
            clearInterval(AppState.proInterval);
            showScreen('profit-detail');
        });
    }

    const energyCard = document.getElementById('energy-card');
    if (energyCard) {
        energyCard.addEventListener('click', () => {
            clearInterval(AppState.proInterval);
            showScreen('energy-detail');
        });
    }

    document.getElementById('comBackBtn').addEventListener('click', () => {
        clearInterval(AppState.proInterval); 
        showScreen('farmlist');
    });

    // 💡 修正了 Feature 按钮的识别，现在包括 Control 按钮在内的四个都能按了
    document.querySelectorAll('.com-feat').forEach(el => {
        el.addEventListener('click', () => {
            const feature = el.getAttribute('data-feature');
            if (feature === 'whatif') {
                showScreen('whatif-pro');
            } else if (feature === 'control') {
                alert("Control panel coming soon!"); // Control 的逻辑
            } else {
                showScreen('feature', { feature, from: 'dash-c' });
            }
        });
    });

    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.getAttribute('data-screen');
            if (screen === 'profile') {
                AppState.profileFrom = 'dash-c';
                showScreen('profile');
            } else if (screen === 'home') showScreen('dash-c');
        });
    });
}

function initProDashboard() {
    // 💡 增加一个变量防止 AI 重复呼叫
    AppState.aiConsulted = false;

    const syncData = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/sensors/latest?deviceId=farm_001');
            const data = await res.json();
            if (!data || !data.reading) return;
            const r = data.reading;

            const temp = r.temperature || 0;
            const humid = r.humidity || 0;
            const light = r.lightRaw || 0; 
            const ph = r.ph || 0;
            const water = r.waterDistanceCm || 0;
            const gas = r.gasRaw || 0;

            const estProfit = (light * 0.05).toFixed(2); 
            const energyCost = (temp * 0.9).toFixed(1);

            document.getElementById('pro-profit').innerText = `RM ${estProfit}`;
            document.getElementById('pro-energy').innerText = `${energyCost} kWh`;
            document.getElementById('pro-temp').innerText = `${temp}°C`;
            document.getElementById('pro-humid').innerText = `${humid}%`;
            document.getElementById('pro-light').innerText = `${light}`;
            document.getElementById('pro-ph').innerText = ph;
            document.getElementById('pro-water').innerText = `${water}cm`;
            document.getElementById('pro-gas').innerText = gas;

            // 💡 核心新增：调用 AI 全局评估（只在第一次进入页面时执行）
            if (!AppState.aiConsulted) {
                fetchAIGlobalAdvice(r);
                AppState.aiConsulted = true;
            }

        } catch (e) {
            console.error("Dashboard Sync Failed:", e);
        }
    };

    syncData();
    AppState.proInterval = setInterval(syncData, 3000);
}

// 💡 补回刚才给你的 AI 评估函数（已改成英文回答）
async function fetchAIGlobalAdvice(currentData) {
    const prompt = `You are a farm owner's AI assistant. Current data: ${JSON.stringify(currentData)}. 
                    Briefly evaluate the current Profit and Energy efficiency in 1 very easy and short sentence (English).`;
    try {
        const res = await fetch('http://localhost:3000/api/chat', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt }) 
        });
        const result = await res.json();
        document.getElementById('ai-overview-text').innerText = result.reply || result.response;
    } catch (e) {
        document.getElementById('ai-overview-text').innerText = "AI Advisor offline.";
    }
}