import { showScreen } from '../utils/navigation.js';
import { AppState } from '../store.js';
import { FarmCanvas } from '../components/FarmCanvas.js';
import { SensorStrip } from '../components/SensorStrip.js';
import { NpcAdvisor } from '../components/NpcAdvisor.js';
import { openAddPlantModal } from '../components/AddPlantModal.js';
import { showToast } from '../utils/toast.js';

export function render() {
    console.log('[HomePage] render called');
    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="homeScreen">
            <div class="topbar">
                <button id="backToFarms" class="back-btn" style="background:transparent; border:none; font-size:20px;">←</button>
                <div class="topbar-brand"><span style="font-weight:700;">${AppState.farmName}</span></div>
                <div style="flex:1"></div>
                <div id="topbarPill"></div>

            </div>
            <div class="bottom-nav">
                <div class="nav-item active" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
            <div style="flex:1; overflow-y:auto;">
                <div class="farm-stage-wrap" style="margin:12px 16px; position:relative;">
                    <canvas id="farmCanvas" style="width:100%; height:clamp(280px, 40dvh, 520px); border-radius:24px; background:#EAF4FF; display:block;"></canvas>
                    <button id="fabPlant" style="position:absolute; bottom:12px; right:12px; background:var(--accent); border:none; width:44px; height:44px; border-radius:14px; color:white; font-size:24px;">+</button>
                </div>
                <div id="dashStrip" class="sensor-strip"></div>
                <div class="advisor-wrap" style="margin:12px 16px;">
                    <div class="advisor-card" style="background:var(--surface); border-radius:20px; padding:14px; display:flex; gap:12px;">
                        <div id="npcAvatar" style="font-size:36px;">🌿</div>
                        <div style="flex:1;">
                            <div id="npcName" style="font-weight:700; color:var(--accent);">SEEDDOWN AI ADVISOR</div>
                            <div id="npcText" style="font-size:0.8rem; color:var(--sub);">Loading farm context...</div>
                            <div style="display:flex; gap:8px; margin-top:8px;">
                                <button id="npcNext" class="advisor-btn primary">Next →</button>
                                <button id="npcDismiss" class="advisor-btn">Dismiss</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin:12px 16px;">
                    <div style="font-size:0.6rem; font-weight:700; color:var(--muted);">FEATURES</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
                        <div class="feat-card" data-feature="whatif" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">🔮</span><div>What-If</div><div style="font-size:0.7rem;">Simulate yield</div></div>
                        <div class="feat-card" data-feature="consumption" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">⚡</span><div>Eco Save</div><div style="font-size:0.7rem;">Track savings</div></div>
                        <div class="feat-card" data-feature="alerts" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">🚨</span><div>AI Alerts</div><div style="font-size:0.7rem;">Predict issues</div></div>
                        <div class="feat-card" data-feature="community" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">🏘️</span><div>Community</div><div style="font-size:0.7rem;">Trade & chat</div></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 确保 canvas 渲染后再初始化组件
    setTimeout(() => {
        console.log('[HomePage] Initializing canvas and sensors');
        FarmCanvas.init('farmCanvas');
        SensorStrip.init();
        NpcAdvisor.init();
    }, 100);
    
    // 绑定事件
    document.getElementById('backToFarms')?.addEventListener('click', () => showScreen('farmlist'));

    document.getElementById('fabPlant')?.addEventListener('click', openAddPlantModal);
    
    document.querySelectorAll('.feat-card').forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.getAttribute('data-feature');
            if (feature === 'community') showScreen('community');
            else showScreen('feature', { feature });
        });
    });
    
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.getAttribute('data-screen');
             if (screen === 'profile') {
                AppState.profileFrom = 'home';
                showScreen('profile');}
            else if (screen === 'home') showScreen('home');
        });
    });
}
