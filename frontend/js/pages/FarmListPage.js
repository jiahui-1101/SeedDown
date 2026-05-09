import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';

export function render() {
    console.log('[FarmListPage] render called');
    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="farmlistScreen">
            <div class="topbar">
                <div class="topbar-brand"><span style="font-size:24px;">🌿</span><span style="font-weight:700;">SeedDown</span><span style="margin-left:8px; color:var(--muted);">Farms</span></div>
                <div style="flex:1"></div>
                <button id="switchModeBtn" class="topbar-btn" style="background:transparent; border:1px solid var(--border); padding:6px 12px; border-radius:12px;">⇄ Switch</button>
            </div>
            <div style="padding:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="font-size:0.7rem; font-weight:700; color:var(--sub);">SELECT FARM</div>
                    <button id="buildFarmBtn" class="btn-outline" style="padding:6px 12px;">+ Build New</button>
                </div>
                <div id="farmList" style="display:flex; flex-direction:column; gap:10px;"></div>
            </div>
            <div class="bottom-nav">
                <div class="nav-item active" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `;
    
    const farms = [
        { name: 'Farm 1 — Rack Alpha', plants: 6, zone: 'A', status: 'ok' },
        { name: 'Farm 2 — Rooftop Beta', plants: 4, zone: 'B', status: 'ok' }
    ];
    const listContainer = document.getElementById('farmList');
    listContainer.innerHTML = farms.map(f => `
        <div class="farm-card" data-farm-name="${f.name}" style="background:var(--surface); border-radius:16px; padding:14px; display:flex; align-items:center; gap:12px; cursor:pointer;">
            <div style="width:44px; height:44px; background:var(--accent-l); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px;">🏗️</div>
            <div style="flex:1;"><div style="font-weight:700;">${f.name}</div><div style="font-size:0.7rem; color:var(--muted);">${f.plants} plants · Zone ${f.zone}</div></div>
            <div style="color:var(--accent);">→</div>
        </div>
    `).join('');
    
    // 绑定卡片点击事件
    document.querySelectorAll('.farm-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const farmName = card.getAttribute('data-farm-name') || 
                             card.querySelector('div:first-child + div > div:first-child')?.innerText || 
                             'Unknown Farm';
            console.log(`[FarmListPage] Clicked farm: ${farmName}`);
            AppState.farmName = farmName;
            const targetScreen = AppState.mode === 'beginner' ? 'home' : 'dash-c';
            console.log(`[FarmListPage] Switching to screen: ${targetScreen}`);
            showScreen(targetScreen);
        });
    });
    
    document.getElementById('switchModeBtn').addEventListener('click', () => {
        AppState.mode = AppState.mode === 'beginner' ? 'commercial' : 'beginner';
        showToast('info', `Switched to ${AppState.mode === 'beginner' ? 'Beginner 🌱' : 'Commercial 🏭'} mode`);
    });
    document.getElementById('buildFarmBtn').addEventListener('click', () => showToast('info', 'Build new farm feature coming soon'));
}