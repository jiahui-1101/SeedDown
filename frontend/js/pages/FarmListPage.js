import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';

const FARMS_STORAGE_KEY = 'user_farms';

export function render() {
    console.log('[FarmListPage] render called');
    const container = document.getElementById('screenContainer');

    let savedFarms = [];
    try {
        savedFarms = JSON.parse(localStorage.getItem(FARMS_STORAGE_KEY)) || [];
    } catch (e) { savedFarms = []; }


    if (savedFarms.length === 0) {
        savedFarms = [
            { id: 'farm_' + Date.now(), name: 'Farm 1 — Rack Alpha', plants: 6, plantSlots: 6, zone: 'A', targetPlant: 'Lettuce' }
        ];
        localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(savedFarms));
    }

    const isCommercial = AppState.mode === 'commercial';

    container.innerHTML = `
        <div class="screen active" id="farmlistScreen">
            <div class="topbar">
                <div class="topbar-brand">
                    <span style="font-size:24px;">🌿</span>
                    <span style="font-weight:700;">SeedDown</span>
                    <span style="margin-left:8px; color:var(--muted);">Farms</span>
                </div>
                <div style="flex:1"></div>
                <div id="switchModeBtn" style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <span style="font-size:0.72rem; font-weight:700; color:${!isCommercial ? 'var(--accent)' : 'var(--muted)'};">🌱</span>
                    <div style="
                        position:relative; width:48px; height:26px;
                        background:${isCommercial ? 'var(--accent)' : 'var(--border)'};
                        border-radius:100px; transition:background 0.25s;
                    ">
                        <div style="
                            position:absolute; top:3px;
                            left:${isCommercial ? '25px' : '3px'};
                            width:20px; height:20px; border-radius:50%;
                            background:white; box-shadow:0 1px 4px rgba(0,0,0,0.25);
                            transition:left 0.25s;
                        "></div>
                    </div>
                    <span style="font-size:0.72rem; font-weight:700; color:${isCommercial ? 'var(--accent)' : 'var(--muted)'};">🏭</span>
                </div>
            </div>

            <div style="padding:16px; flex:1; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="font-size:0.7rem; font-weight:700; color:var(--sub);">SELECT FIELD (${savedFarms.length})</div>
                    <button id="buildFarmBtn" class="btn-outline" style="padding:6px 12px;">+ New Field</button>
                </div>
                
                <div id="farmList" style="display:flex; flex-direction:column; gap:10px;">
                    ${savedFarms.map(f => `
                        <div class="farm-card" data-farm-id="${f.id}" data-farm-name="${f.name}" style="background:var(--surface); border-radius:16px; padding:14px; display:flex; align-items:center; gap:12px; cursor:pointer;">
                            <div style="width:44px; height:44px; background:var(--accent-l); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px;">🏗️</div>
                            <div style="flex:1;">
                                <div style="font-weight:700;">${f.name}</div>
                                <div style="font-size:0.7rem; color:var(--muted);">${farmMeta(f)}</div>
                            </div>
                            <div style="color:var(--accent);">→</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="bottom-nav">
                <div class="nav-item active" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `;

    _bindEvents(savedFarms);
}

function _bindEvents(savedFarms) {

    document.querySelectorAll('.farm-card').forEach(card => {
        card.addEventListener('click', () => {
            const farmId = card.getAttribute('data-farm-id');
            const farmName = card.getAttribute('data-farm-name');

            AppState.currentFarmId = farmId; 
            AppState.farmName = farmName;

            console.log(`[FarmListPage] Entering Farm ID: ${farmId}`);
            
            const target = AppState.mode === 'beginner' ? 'home' : 'dash-c';
            showScreen(target);
        });
    });


    document.getElementById('buildFarmBtn').onclick = () => {
        showScreen('buildfarm');
    };

    document.getElementById('switchModeBtn').onclick = () => {
        AppState.mode = AppState.mode === 'beginner' ? 'commercial' : 'beginner';
        showToast('info', `Switched to ${AppState.mode === 'commercial' ? '🏭 Commercial' : '🌱 Beginner'} mode`);
        render();
    };

    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.onclick = () => {
            if (item.dataset.screen === 'profile') {
                AppState.profileFrom = 'farmlist';
                showScreen('profile');
            }
        };
    });
}

function farmMeta(f) {
    const plantCount = typeof f.plants === 'number' ? f.plants : (Array.isArray(f.plants) ? f.plants.length : 0);
    const target = f.targetPlant ? `${f.targetPlant} · ` : '';
    const slots = f.plantSlots ? `${f.plantSlots} slots` : `${plantCount} plants`;
    return `${target}${slots} · Zone ${f.zone || 'A'}`;
}
