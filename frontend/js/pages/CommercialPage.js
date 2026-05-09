import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import * as WhatIfPro from './WhatIfPro.js';   // ← Pro What-If module
import { AppState } from '../store.js'; 

export function render() {
    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="commercialScreen">
            <div class="topbar" style="background:#0D1221; color:#E8F0FF;">
                <button id="comBackBtn" style="background:transparent; border:none; color:#60A5FA;">← Back</button>
                <div class="topbar-brand"><span style="background:#1E3A5F; padding:6px 10px; border-radius:12px;">⚙</span><span style="margin-left:8px;">NexusGrow PRO</span><span style="margin-left:8px; font-size:0.6rem;">Commercial</span></div>
                <div style="flex:1"></div>
                <div class="live-pill">🔴 Live</div>
            </div>
            <div class="bottom-nav">
                <div class="nav-item active" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
            <div style="flex:1; overflow-y:auto; padding:16px;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div class="kpi-card" style="background:#0D1221; border-radius:16px; padding:16px;"><div style="color:#4A6A9A;">PROFIT</div><div style="font-size:1.8rem; color:#00FF88;">RM 348</div></div>
                    <div class="kpi-card" style="background:#0D1221; border-radius:16px; padding:16px;"><div style="color:#4A6A9A;">ENERGY</div><div style="font-size:1.8rem; color:#FFD966;">24 kWh</div></div>
                </div>
                <div style="background:#0D1221; border-radius:16px; padding:16px; margin-top:12px;">
                    <div style="color:#60A5FA;">📈 Profit Trend</div>
                    <div style="height:80px; background:rgba(26,86,219,0.1); border-radius:12px; margin-top:12px; display:flex; align-items:center; justify-content:center; color:#4A6A9A;">[Chart Placeholder]</div>
                </div>
                <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-top:12px;">
                    <div class="com-feat" data-feature="whatif" style="background:#C9D8F5; border-radius:12px; padding:12px; text-align:center;">🔮<div style="font-size:0.6rem;">What-If</div></div>
                    <div class="com-feat" data-feature="consumption" style="background:#C9D8F5; border-radius:12px; padding:12px; text-align:center;">⚡<div style="font-size:0.6rem;">ESG Data</div></div>
                    <div class="com-feat" data-feature="alerts" style="background:#C9D8F5; border-radius:12px; padding:12px; text-align:center;">🚨<div style="font-size:0.6rem;">Alerts</div></div>
                    <div class="com-feat" style="background:#C9D8F5; border-radius:12px; padding:12px; text-align:center;">🎛️<div style="font-size:0.6rem;">Control</div></div>
                </div>

                <!-- What-If Pro panel: hidden until tile is clicked -->
                <div id="com-whatif-panel" style="display:none; margin-top:12px;"></div>
            </div>
        </div>
    `;

    document.getElementById('comBackBtn').addEventListener('click', () => showScreen('farmlist'));

    document.querySelectorAll('.com-feat[data-feature]').forEach(el => {
        el.addEventListener('click', () => {
            const feature = el.getAttribute('data-feature');
            if (feature === 'whatif') {
                showScreen('whatif-pro');
            } else {
                showScreen('feature', { feature, from: 'dash-c' });
            }
        });
    });

    // Bottom nav
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.getAttribute('data-screen');
             if (screen === 'profile') {
                AppState.profileFrom = 'dash-c';
                showScreen('profile');
             }
            else if (screen === 'home') showScreen('dash-c');
        });
    });
}