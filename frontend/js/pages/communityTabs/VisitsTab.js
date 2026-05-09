// 文件路径: /frontend/js/pages/communityTabs/VisitsTab.js
import { showToast } from '../../utils/toast.js';

let neighborsData = [];
let currentContainerId = '';

export async function renderVisitsTab(containerId) {
    currentContainerId = containerId;
    const area = document.getElementById(containerId);
    
    area.innerHTML = `
        <div style="margin-top:15px; margin-bottom:15px;">
            <h3 style="margin:0 0 5px 0; color:#1f2937;">🏡 Neighborhood Farms</h3>
            <p style="margin:0; font-size:0.8rem; color:gray;">Visit neighbors, help out, and earn coins!</p>
        </div>
        
        <!-- 列表容器 -->
        <div id="neighborsListArea" style="display:flex; flex-direction:column; gap:12px;">
            <div style="text-align:center; padding:20px; color:gray;">Scouting neighborhood...</div>
        </div>
    `;

    await loadNeighbors();
}

// 1. 去后端拉取邻居数据
async function loadNeighbors() {
    try {
        const res = await fetch('http://localhost:3000/api/community/visits/neighbors');
        neighborsData = await res.json();
        renderNeighborsList();
    } catch (e) {
        document.getElementById('neighborsListArea').innerHTML = '<div style="color:red; text-align:center;">Failed to connect to neighborhood.</div>';
    }
}

// 2. 渲染邻居列表
function renderNeighborsList() {
    const listArea = document.getElementById('neighborsListArea');
    
    listArea.innerHTML = neighborsData.map(farm => {
        const isThirsty = farm.moisture < 30;
        
        return `
        <div class="card" style="display:flex; align-items:center; padding:15px; border-radius:16px; border: 1px solid #f0f0f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); cursor:pointer; transition: transform 0.2s;" onclick="window.visitFarm('${farm.id}')">
            <div style="font-size:35px; margin-right:15px; background:#f9fafb; border-radius:50%; width:60px; height:60px; display:flex; justify-content:center; align-items:center;">
                ${farm.avatar}
            </div>
            
            <div style="flex:1;">
                <h4 style="margin:0 0 4px 0; font-size:1.05rem;">${farm.name}</h4>
                <div style="font-size:0.8rem; color:gray;">Growing: ${farm.plant}</div>
            </div>
            
            <!-- 状态图标 -->
            <div style="text-align:right;">
                ${farm.hasBug ? `<div style="font-size:1.2rem; animation: wiggle 1s infinite;">🐛</div>` : ''}
                ${isThirsty ? 
                    `<div style="background:#FEF08A; color:#854D0E; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:bold; margin-top:5px;">💧 Needs Water</div>` : 
                    `<div style="background:#D1FAE5; color:#065F46; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:bold; margin-top:5px;">🌿 Healthy</div>`
                }
            </div>
        </div>
    `}).join('');
}

// 3. 进入具体的农场 (数字孪生视图)
window.visitFarm = function(farmId) {
    const farm = neighborsData.find(f => f.id === farmId);
    const area = document.getElementById(currentContainerId);
    
    const isThirsty = farm.moisture < 30;
    const bgColor = isThirsty ? '#FCEBEB' : '#EAF3DE';
    const plantEmoji = isThirsty ? '🥀' : '🌿';
    const filterStyle = isThirsty ? 'filter: grayscale(60%) sepia(40%); transform: rotate(10deg);' : '';
    const statusText = isThirsty ? 'Plant is thirsty!' : 'Healthy & Happy!';
    const statusColor = isThirsty ? '#DC2626' : '#059669';

    area.innerHTML = `
        <!-- 返回按钮 -->
        <button class="btn-outline" style="margin-bottom:15px; border:none; padding:0; color:#2563EB; font-weight:bold; cursor:pointer;" onclick="window.backToNeighbors()">
            ← Back to Neighborhood
        </button>

        <div class="card" style="padding:0; overflow:hidden; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
            <!-- 农场主信息 -->
            <div style="padding: 16px; display:flex; align-items:center; gap:12px; background:white;">
                <div style="font-size:35px;">${farm.avatar}</div>
                <div>
                    <div style="font-weight:900; font-size:1.1rem;">${farm.name}</div>
                    <div style="font-size:0.75rem; color:gray;">Sensor: Soil Moisture <span id="uiMoisture">${farm.moisture}</span>%</div>
                </div>
            </div>
            
            <!-- 数字孪生模型展示区 -->
            <div id="twinModel" style="height:250px; background:${bgColor}; display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative; transition: background-color 0.8s ease;">
                
                <!-- 随机生成的虫子 (如果有) -->
                ${farm.hasBug ? `<div id="uiBug" class="bug-emoji" style="top:40px; right:60px;" onclick="window.catchBug('${farm.id}')">🐛</div>` : ''}

                <div id="plantEmoji" style="font-size:100px; ${filterStyle} transition: all 0.8s ease;">${plantEmoji}</div>
                <div id="plantStatus" style="color:${statusColor}; font-weight:900; margin-top:15px; font-size:1.1rem; transition: color 0.8s ease;">${statusText}</div>
            </div>

            <!-- 互动按钮 -->
            <div style="padding:20px; display:flex; gap:12px; background:white;">
                <button id="btnWater" class="btn-primary" style="flex:1; display:flex; justify-content:center; align-items:center; gap:8px; font-size:1rem; padding:12px; background:#3B82F6;" onclick="window.helpWater('${farm.id}')" ${!isThirsty ? 'disabled' : ''}>
                    ${isThirsty ? '<span>💧</span> Water Plant (+5 🍃)' : '✅ Fully Watered'}
                </button>
            </div>
        </div>
    `;
};

// 返回列表页
window.backToNeighbors = function() {
    renderVisitsTab(currentContainerId);
};

// 4. 浇水动作 API
window.helpWater = async function(farmId) {
    const btn = document.getElementById('btnWater');
    btn.disabled = true;
    btn.innerHTML = 'Watering...';

    // 触发屏幕下雨动画
    createRainEffect();

    try {
        const res = await fetch(`http://localhost:3000/api/community/visits/water/${farmId}`, { method: 'POST' });
        const data = await res.json();
        
        if (res.ok) {
            // UI 动画：枯萎的植物变健康！
            document.getElementById('twinModel').style.background = '#EAF3DE';
            const emoji = document.getElementById('plantEmoji');
            emoji.innerText = '🌿';
            emoji.style.filter = 'none';
            emoji.style.transform = 'rotate(0deg)';
            
            const status = document.getElementById('plantStatus');
            status.innerText = 'Healthy & Happy!';
            status.style.color = '#059669';
            
            document.getElementById('uiMoisture').innerText = '85';

            btn.innerHTML = '✅ Fully Watered';
            btn.style.background = '#9CA3AF';

            showToast('success', `Thanks for helping! (+${data.earned} 🍃)`);
            updateTopNavCoins(data.newTotal);
        } else {
            showToast('warning', data.message);
            btn.disabled = false;
        }
    } catch (err) {
        showToast('error', 'Network error.');
        btn.disabled = false;
    }
};

// 5. 抓虫动作 API
window.catchBug = async function(farmId) {
    try {
        const res = await fetch(`http://localhost:3000/api/community/visits/catch-bug/${farmId}`, { method: 'POST' });
        const data = await res.json();
        
        if (res.ok) {
            // UI 动画：虫子消失
            const bug = document.getElementById('uiBug');
            bug.style.transform = 'scale(0)';
            bug.style.opacity = '0';
            setTimeout(() => bug.remove(), 300);

            showToast('success', `Gotcha! Bug caught. (+${data.earned} 🍃)`);
            updateTopNavCoins(data.newTotal);
        }
    } catch (err) {
        showToast('error', 'The bug escaped!');
    }
};

// --- 小工具函数 ---

// 飘落的雨滴特效
function createRainEffect() {
    const model = document.getElementById('twinModel');
    for(let i = 0; i < 15; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.innerText = '💧';
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 80 + 10 + '%';
            drop.style.fontSize = (Math.random() * 10 + 10) + 'px';
            model.appendChild(drop);
            setTimeout(() => drop.remove(), 800);
        }, i * 50);
    }
}

// 刷新顶部金币
function updateTopNavCoins(newAmount) {
    const coinsDisplay = document.getElementById('myCoinsDisplay');
    if(coinsDisplay) {
        coinsDisplay.innerText = `🍃 ${newAmount} Coins`;
    }
}