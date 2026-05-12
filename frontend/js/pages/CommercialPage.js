import { showScreen } from '../utils/navigation.js';
import { AppState } from '../store.js';
import { CommercialFarmCanvas } from '../components/CommercialFarmCanvas.js';
import { openAddPlantModal } from '../components/AddPlantModal.js';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

const RACK_OPTIONS = {
    '2-tier': { label: '2-Tier Starter Rack', tiers: 2, slotsPerTier: 3, total: 6 },
    '3-tier': { label: '3-Tier Vertical Rack', tiers: 3, slotsPerTier: 3, total: 9 },
    '4-tier': { label: '4-Tier Grow Shelf', tiers: 4, slotsPerTier: 4, total: 16 },
    '5-tier': { label: '5-Tier Tower Rack', tiers: 5, slotsPerTier: 4, total: 20 },
    wall: { label: 'Wall Panel Grid', tiers: 4, slotsPerTier: 5, total: 20 },
    'a-frame': { label: 'A-Frame Pyramid', tiers: 4, slotsPerTier: 4, total: 16 },
    'nft-channel': { label: 'NFT Channel Rows', tiers: 3, slotsPerTier: 6, total: 18 },
    hanging: { label: 'Hanging Column Farm', tiers: 5, slotsPerTier: 3, total: 15 },
};

export function render() {
    const container = document.getElementById('screenContainer');
    const farm = getCurrentFarm();
    const rack = resolveRack(farm);
    const plantTotal = plantCount(farm);
    const occupancy = rack.total ? Math.round((plantTotal / rack.total) * 100) : 0;

    container.innerHTML = `
        <div class="screen active" id="commercialScreen" style="background:var(--bg); display:flex; flex-direction:column; height:100vh; color:var(--text); position:relative;">
            <div class="topbar">
                <button id="comBackBtn" class="back-btn" style="background:transparent;border:none;font-size:20px;color:var(--text);cursor:pointer;">←</button>
                <div class="topbar-brand" style="flex:1;min-width:0;">
                    <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(farm?.name || AppState.farmName || 'Commercial Farm')}</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Commercial control</div>
                </div>
            </div>

            <div style="flex:1; overflow-y:auto; padding-bottom:12px;">
                <div style="margin:12px 16px 10px 16px; position:relative;">
                    <canvas id="commercialFarmCanvas" style="width:100%; height:clamp(360px, 48dvh, 620px); border-radius:22px; background:#07110c; display:block;"></canvas>
                    <button id="fabPlant" title="Add plant" aria-label="Add plant" style="position:absolute; bottom:14px; left:14px; z-index:10; background:rgba(163,230,53,.14); border:1px solid rgba(163,230,53,.28); height:38px; border-radius:999px; color:#a3e635; font-size:11px;font-weight:900;letter-spacing:.08em;padding:0 14px;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.22);">ADD PLANT</button>
                </div>

                <div style="margin:0 16px 12px 16px;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:14px;box-shadow:var(--shadow-sm);display:flex;gap:12px;align-items:center;">
                    <div style="width:42px;height:42px;border-radius:14px;background:var(--accent-l);display:flex;align-items:center;justify-content:center;font-size:24px;">🧑‍🌾</div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:11px;color:var(--accent);font-weight:900;text-transform:uppercase;letter-spacing:.06em;">AI Farm Advisor</div>
                        <div id="ai-overview-text" style="font-size:13px;color:var(--sub);line-height:1.35;">Syncing commercial farm data...</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:0 16px 12px 16px;">
                    <button id="profit-card" style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px;text-align:left;cursor:pointer;box-shadow:var(--shadow-sm);">
                        <div style="display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;">Est. Profit <span>↗</span></div>
                        <div id="pro-profit" style="font-size:1.55rem;color:var(--ok);font-weight:900;margin-top:4px;">RM --</div>
                    </button>
                    <button id="energy-card" style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px;text-align:left;cursor:pointer;box-shadow:var(--shadow-sm);">
                        <div style="display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;">Energy Cost <span>⚡</span></div>
                        <div id="pro-energy" style="font-size:1.55rem;color:var(--warn);font-weight:900;margin-top:4px;">-- kWh</div>
                    </button>
                </div>

             <div style="margin:0 16px 12px 16px;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="display:flex;align-items:center;margin-bottom:12px;">
                        <div style="width:4px;height:16px;background:var(--ok);border-radius:4px;margin-right:8px;"></div>
                        <div style="font-size:1.02rem;font-weight:800;color:var(--text);">Live Data</div>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
                        ${sensorCard('🌡️', 'Temp', 'pro-temp', '--', 'var(--danger)', '#FEE2E2', 'temp')}
                        ${sensorCard('💧', 'Humid', 'pro-humid', '--', 'var(--accent)', 'var(--accent-l)', 'humid')}
                        ${sensorCard('☀️', 'Light', 'pro-light', '--', 'var(--ok)', 'var(--ok-bg)', 'light')}
                        ${sensorCard('🧪', 'pH', 'pro-ph', '--', 'var(--warn)', '#FFFBEB', 'ph')}
                        ${sensorCard('💦', 'Water', 'pro-water', '--', 'var(--accent)', 'var(--accent-l)', 'water')}
                        ${sensorCard('🧬', 'Gas', 'pro-gas', '--', 'var(--ok)', 'var(--ok-bg)', 'nutrient')}
                    </div>
                </div>

                <div style="margin:0 16px 12px 16px;">
                    <div style="font-size:0.6rem;font-weight:800;color:var(--muted);text-transform:uppercase;margin-bottom:8px;">Commercial Tools</div>
                    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px;">
                        ${featureButton('whatif', '🔮', 'What-If')}
                        ${featureButton('consumption', '⚡', 'ESG')}
                        ${featureButton('alerts', '🚨', 'Alerts')}
                        ${featureButton('control', '🎛️', 'Control')}
                    </div>
                </div>
            </div>

            <div class="bottom-nav">
                <div class="nav-item active" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `;

    bindEvents()
    initCommercialFarm();
    initProDashboard();
}

function bindEvents() {
    document.getElementById('profit-card')?.addEventListener('click', () => {
        clearInterval(AppState.proInterval);
        showScreen('profit-detail');
    });

    document.getElementById('energy-card')?.addEventListener('click', () => {
        clearInterval(AppState.proInterval);
        showScreen('energy-detail');
    });

    document.getElementById('comBackBtn')?.addEventListener('click', () => {
        clearInterval(AppState.proInterval);
        showScreen('farmlist');
    });

    document.getElementById('fabPlant')?.addEventListener('click', openAddPlantModal);

    document.querySelectorAll('.com-feat').forEach(el => {
        el.addEventListener('click', () => {
            const feature = el.getAttribute('data-feature');
            if (feature === 'whatif') {
                showScreen('whatif-pro');
            } else if (feature === 'control') {
                showScreen('control');
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
            } else if (screen === 'home') {
                showScreen('dash-c');
            }
        });
    });

   document.querySelectorAll('.pro-sensor-card').forEach(card => {
        card.addEventListener('click', () => {
            const sk = card.getAttribute('data-key');
            const sl = card.getAttribute('data-label');
            clearInterval(AppState.proInterval);
            // 传入 key 和 name，对齐 sensor-detail 的参数
            showScreen('sensor-detail', { key: sk, name: sl });
        });
    });
}

function initCommercialFarm() {
    setTimeout(() => CommercialFarmCanvas.init('commercialFarmCanvas'), 80);
}

function initProDashboard() {
    clearInterval(AppState.proInterval);
    AppState.aiConsulted = false;

    const syncData = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/sensors/latest?deviceId=farm_001`);
            const data = await res.json();
            if (!data || !data.reading) return;
            const r = data.reading;

            const temp = Number(r.temperature || 0);
            const humid = Number(r.humidity || 0);
            const light = Number(r.lightRaw || 0);
            const ph = Number(r.ph || 0);
            const water = Number(r.waterDistanceCm || 0);
            const gas = Number(r.gasRaw || 0);
            const plantTotal = plantCount(getCurrentFarm());
            const estProfit = Math.max(0, plantTotal * 1.35 + light * 0.012).toFixed(2);
            const energyCost = Math.max(0, temp * 0.65 + plantTotal * 0.18).toFixed(1);

            setText('pro-profit', `RM ${estProfit}`);
            setText('pro-energy', `${energyCost} kWh`);
            setText('pro-temp', `${temp.toFixed(1)}°C`);
            setText('pro-humid', `${humid}%`);
            setText('pro-light', light);
            setText('pro-ph', ph);
            setText('pro-water', `${water}cm`);
            setText('pro-gas', gas);

            if (!AppState.aiConsulted) {
                fetchAIGlobalAdvice(r);
                AppState.aiConsulted = true;
            }
        } catch (e) {
            console.error('Dashboard Sync Failed:', e);
            setText('ai-overview-text', 'Live backend offline. Showing saved farm layout.');
        }
    };

    syncData();
    AppState.proInterval = setInterval(syncData, 5000);
}

async function fetchAIGlobalAdvice(currentData) {
    const prompt = `You are a farm owner's AI assistant. Current data: ${JSON.stringify(currentData)}. Briefly evaluate commercial farm profit and energy efficiency in one short English sentence.`;
    try {
        const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt })
        });
        const result = await res.json();
        setText('ai-overview-text', result.reply || result.response || 'Farm is operating normally.');
    } catch (e) {
        setText('ai-overview-text', 'AI Advisor offline. Sensor dashboard still available.');
    }
}

function sensorCard(icon, label, id, value, color, bg, key) {
    return `
        <div class="pro-sensor-card" data-key="${key}" data-label="${label}" style="background:${bg};border-radius:12px;padding:12px;min-height:90px;position:relative;overflow:hidden;cursor:pointer;">
            <div style="position:absolute;top:-5px;right:-5px;font-size:36px;opacity:.12;">${icon}</div>
            <div style="font-size:14px;opacity:.7;">${icon}</div>
            <div style="margin-top:14px;">
                <div id="${id}" style="font-size:1rem;font-weight:900;color:${color};word-break:break-word;">${value}</div>
                <div style="font-size:10px;font-weight:800;color:var(--muted);margin-top:2px;">${label}</div>
            </div>
        </div>`;
}

function featureButton(feature, icon, label) {
    return `
        <button class="com-feat" data-feature="${feature}" style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:12px 6px;text-align:center;cursor:pointer;box-shadow:var(--shadow-sm);color:var(--text);">
            <div style="font-size:24px;line-height:1;">${icon}</div>
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-top:6px;text-transform:uppercase;">${label}</div>
        </button>`;
}

function getCurrentFarm() {
    const saved = loadSavedFarms();
    return AppState.currentFarm
        || saved.find(farm => farm.id === AppState.currentFarmId)
        || saved[saved.length - 1]
        || null;
}

function resolveRack(farm) {
    const raw = String(farm?.rackTypeId || farm?.rackType || farm?.rackLabel || '').toLowerCase();
    if (raw.includes('2')) return RACK_OPTIONS['2-tier'];
    if (raw.includes('4')) return RACK_OPTIONS['4-tier'];
    if (raw.includes('5')) return RACK_OPTIONS['5-tier'];
    if (raw.includes('wall') || raw.includes('grid')) return RACK_OPTIONS.wall;
    if (raw.includes('frame')) return RACK_OPTIONS['a-frame'];
    if (raw.includes('nft') || raw.includes('channel')) return RACK_OPTIONS['nft-channel'];
    if (raw.includes('hanging') || raw.includes('column')) return RACK_OPTIONS.hanging;
    return RACK_OPTIONS['3-tier'];
}

function plantCount(farm) {
    if (Array.isArray(farm?.plants)) return farm.plants.length;
    return Number.parseInt(farm?.plants, 10) || Number.parseInt(farm?.plantSlots, 10) || 0;
}

function loadSavedFarms() {
    try {
        return JSON.parse(localStorage.getItem('user_farms')) || [];
    } catch (error) {
        return [];
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}






