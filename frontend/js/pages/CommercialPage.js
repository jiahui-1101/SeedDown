import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import * as WhatIfPro from './WhatIfPro.js'; 
import { AppState } from '../store.js'; 

export function render() {
    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="commercialScreen">
            <div class="topbar" style="background:#0D1221; color:#E8F0FF;">
                <button id="comBackBtn" style="background:transparent; border:none; color:#60A5FA;">← Back</button>
                <div class="topbar-brand">
                    <span style="background:#1E3A5F; padding:6px 10px; border-radius:12px;">⚙</span>
                    <span style="margin-left:8px;">NexusGrow PRO</span>
                    <span style="margin-left:8px; font-size:0.6rem; color:#94A3B8;">Commercial</span>
                </div>
                <div style="flex:1"></div>
                <div class="live-pill" style="background:rgba(0,255,136,0.1); color:#00FF88; border:1px solid #00FF88;">🔴 Live</div>
            </div>

            <div class="bottom-nav" style="background:#0D1221; border-top:1px solid #1E293B;">
                <div class="nav-item active" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>

            <div style="flex:1; overflow-y:auto; padding:16px; background:#020617;">
                <!-- KPI 概览 -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div class="kpi-card" style="background:#0D1221; border-radius:16px; padding:16px; border:1px solid #1E293B;">
                        <div style="color:#4A6A9A; font-size:0.7rem;">PROFIT</div>
                        <div style="font-size:1.8rem; color:#00FF88;">RM 348</div>
                    </div>
                    <div class="kpi-card" style="background:#0D1221; border-radius:16px; padding:16px; border:1px solid #1E293B;">
                        <div style="color:#4A6A9A; font-size:0.7rem;">ENERGY</div>
                        <div style="font-size:1.8rem; color:#FFD966;">24 kWh</div>
                    </div>
                </div>

                <!-- 图表区 -->
                <div style="background:#0D1221; border-radius:16px; padding:16px; margin-top:12px; border:1px solid #1E293B;">
                    <div style="color:#60A5FA; font-size:0.8rem; font-weight:700;">📈 Profit Trend</div>
                    <div style="height:80px; background:rgba(96,165,250,0.05); border-radius:12px; margin-top:12px; display:flex; align-items:center; justify-content:center; color:#4A6A9A; font-size:0.7rem; border:1px dashed #1E293B;">
                        Real-time Data Stream Analysis...
                    </div>
                </div>

                <!-- 功能网格 -->
                <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-top:12px;">
                    <div class="com-feat" data-feature="whatif" style="background:#1E293B; color:white; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">
                        <div style="font-size:1.2rem;">🔮</div>
                        <div style="font-size:0.6rem; margin-top:4px;">What-If</div>
                    </div>
                    <div class="com-feat" data-feature="consumption" style="background:#1E293B; color:white; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">
                        <div style="font-size:1.2rem;">⚡</div>
                        <div style="font-size:0.6rem; margin-top:4px;">ESG Data</div>
                    </div>
                    <div class="com-feat" data-feature="alerts" style="background:#1E293B; color:white; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">
                        <div style="font-size:1.2rem;">🚨</div>
                        <div style="font-size:0.6rem; margin-top:4px;">Alerts</div>
                    </div>
                    <!-- 新增：Mall 入口 -->
                    <!-- 修改后的代码 (和其他按钮保持统一的深灰色) -->
<div class="com-feat" data-feature="mall" style="background:#1E293B; color:white; border-radius:12px; padding:12px; text-align:center; cursor:pointer;">
    <div style="font-size:1.2rem;">🛒</div>
    <div style="font-size:0.6rem; margin-top:4px;">Mall</div>
</div>
                </div>

                <!-- 底部控制模块 -->
                <div style="background:#0D1221; border-radius:16px; padding:16px; margin-top:12px; border:1px solid #1E293B; display:flex; align-items:center; gap:12px;">
                    <div style="font-size:24px;">🎛️</div>
                    <div style="flex:1;">
                        <div style="color:white; font-size:0.8rem; font-weight:700;">Master Control Panel</div>
                        <div style="color:#4A6A9A; font-size:0.6rem;">8 nodes active · System optimized</div>
                    </div>
                    <button style="background:#1E293B; border:none; color:#60A5FA; padding:6px 12px; border-radius:8px; font-size:0.7rem;">Manage</button>
                </div>

                <div id="com-whatif-panel" style="display:none; margin-top:12px;"></div>
            </div>
        </div>
    `;

    // 返回 Farm List
    document.getElementById('comBackBtn').addEventListener('click', () => showScreen('farmlist'));

    // 功能点击事件处理
    document.querySelectorAll('.com-feat[data-feature]').forEach(el => {
        el.addEventListener('click', () => {
            const feature = el.getAttribute('data-feature');
            
            if (feature === 'whatif') {
                showScreen('whatif-pro');
            } else {
                // 🚀 这里是关键：如果是 mall 或其他，带上 from: 'dash-c'
                // 这样从 Mall 返回时就会回到 CommercialPage 而不是普通首页
                showScreen('feature', { feature, from: 'dash-c' });
            }
        });
    });

    // 底部导航切换
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.getAttribute('data-screen');
            if (screen === 'profile') {
                AppState.profileFrom = 'dash-c';
                showScreen('profile');
            } else if (screen === 'home') {
                showScreen('dash-c');
            }
        });
    });
}