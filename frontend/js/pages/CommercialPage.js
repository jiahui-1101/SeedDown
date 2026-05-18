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

let chatMessages = [];

export function render() {
    const container = document.getElementById('screenContainer');
    const farm = getCurrentFarm();
    const rack = resolveRack(farm);
    const plantTotal = plantCount(farm);
    const occupancy = rack.total ? Math.min(100, Math.round((plantTotal / rack.total) * 100)) : 0;

    container.innerHTML = `
        <div class="screen active commercial-command-screen" id="commercialScreen">
            <canvas id="commercialFarmCanvas" class="commercial-command-canvas"></canvas>

            <div class="commercial-top-shell">
                <button id="comBackBtn" class="commercial-icon-btn" aria-label="Back to farms">←</button>
                <div class="commercial-title-card">
                    <div class="commercial-kicker">Commercial Digital Twin</div>
                    <div class="commercial-title-row">
                        <strong>${escapeHTML(farm?.name || AppState.farmName || 'Commercial Farm')}</strong>
                        <span>${occupancy}% occupied</span>
                    </div>
                    <small>${escapeHTML(rack.label)} · ${plantTotal}/${rack.total} planted</small>
                </div>
            </div>

            <button id="panelToggleBtn" class="commercial-panel-toggle" aria-label="Hide operations panel">Hide Panel</button>

            <aside id="commercialOpsPanel" class="commercial-ops-panel">
                <div class="ops-panel-header">
                    <div>
                        <div class="commercial-kicker">Operations</div>
                        <strong>Farm Command Center</strong>
                    </div>
                    <button id="panelCloseBtn" class="commercial-icon-btn small" aria-label="Hide panel">×</button>
                </div>

                <div class="ops-scroll">
                    <section class="ops-section advisor-section">
                        <div class="ops-section-title">AI Farm Advisor</div>
                        <div id="ai-overview-text" class="advisor-text">Syncing commercial farm data...</div>
                    </section>

                    <section class="ops-section">
                        <div class="ops-section-title">Live Sensors</div>
                        <div class="ops-sensor-grid">
                            ${sensorCard('Temp', 'pro-temp', '--', 'temp')}
                            ${sensorCard('Humid', 'pro-humid', '--', 'humid')}
                            ${sensorCard('Light', 'pro-light', '--', 'light')}
                            ${sensorCard('pH', 'pro-ph', '--', 'ph')}
                            ${sensorCard('Water', 'pro-water', '--', 'water')}
                            ${sensorCard('Gas', 'pro-gas', '--', 'nutrient')}
                        </div>
                    </section>

                    <section class="ops-section ops-metrics">
                        <button id="profit-card" class="metric-tile">
                            <span>Est. Profit</span>
                            <strong id="pro-profit">RM --</strong>
                        </button>
                        <button id="energy-card" class="metric-tile">
                            <span>Energy Cost</span>
                            <strong id="pro-energy">-- kWh</strong>
                        </button>
                    </section>

                    <section class="ops-section">
                        <div class="ops-section-title">Tools</div>
                        <div class="ops-tool-grid">
                            ${featureButton('whatif', '🔮', 'What-If')}
                            ${featureButton('control', '🎛️', 'Control')}
                            ${featureButton('disease', '🧫', 'Disease')}
                            ${featureButton('consumption', '⚡', 'ESG')}
                            ${featureButton('alerts', '🚨', 'Alerts')}
                            <button id="assignDeviceBtn" class="ops-tool-btn" type="button"><span>📡</span><strong>Assign Device</strong></button>
                            <button id="fabPlant" class="ops-tool-btn" type="button"><span>🌱</span><strong>Add Plant</strong></button>
                        </div>
                    </section>

                    <section class="ops-section chat-section">
                        <div class="ops-section-title">AI Chat</div>
                        <div id="commercialChatLog" class="commercial-chat-log">
                            <div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>
                        </div>
                        <div class="commercial-chat-input-row">
                            <input id="commercialChatInput" placeholder="Ask SeedDown AI..." autocomplete="off">
                            <button id="commercialChatSend" type="button">Send</button>
                        </div>
                    </section>
                </div>
            </aside>
        </div>
    `;

    ensureCommercialCommandStyles();
    bindEvents();
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
    document.getElementById('assignDeviceBtn')?.addEventListener('click', openAssignDeviceModal);
    document.getElementById('panelToggleBtn')?.addEventListener('click', toggleOpsPanel);
    document.getElementById('panelCloseBtn')?.addEventListener('click', toggleOpsPanel);
    document.getElementById('commercialChatSend')?.addEventListener('click', sendCommercialChat);
    document.getElementById('commercialChatInput')?.addEventListener('keydown', event => {
        if (event.key === 'Enter') sendCommercialChat();
    });

    document.querySelectorAll('.com-feat').forEach(el => {
        el.addEventListener('click', () => {
            const feature = el.getAttribute('data-feature');
            clearInterval(AppState.proInterval);
            if (feature === 'whatif') showScreen('whatif-pro');
            else if (feature === 'control') showScreen('control');
            else if (feature === 'disease') showScreen('disease');
            else showScreen('feature', { feature, from: 'dash-c' });
        });
    });

    document.querySelectorAll('.pro-sensor-card').forEach(card => {
        card.addEventListener('click', () => {
            clearInterval(AppState.proInterval);
            showScreen('sensor-detail', {
                key: card.getAttribute('data-key'),
                name: card.getAttribute('data-label'),
                from: 'dash-c',
            });
        });
    });
}

function toggleOpsPanel() {
    const screen = document.getElementById('commercialScreen');
    const button = document.getElementById('panelToggleBtn');
    const hidden = screen?.classList.toggle('panel-hidden');
    if (button) button.textContent = hidden ? 'Show Panel' : 'Hide Panel';
    setTimeout(forceCommercialCanvasFullScreen, 120);
}

function initCommercialFarm() {
    setTimeout(() => {
        CommercialFarmCanvas.init('commercialFarmCanvas');
        moveCommercialCommandStyleToTop();
        forceCommercialCanvasFullScreen();
        CommercialFarmCanvas.setCameraFrame?.(false);
        forceCommercialCanvasFullScreen();
        requestAnimationFrame(forceCommercialCanvasFullScreen);
        setTimeout(forceCommercialCanvasFullScreen, 120);
        setTimeout(forceCommercialCanvasFullScreen, 350);
        window.addEventListener('resize', forceCommercialCanvasFullScreen);
    }, 80);
}

function setImportant(node, styles) {
    if (!node) return;
    Object.entries(styles).forEach(([key, value]) => {
        const cssKey = key.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
        node.style.setProperty(cssKey, value, 'important');
    });
}

function forceCommercialCanvasFullScreen() {
    const screen = document.getElementById('commercialScreen');
    const canvas = document.getElementById('commercialFarmCanvas');
    if (screen) {
        setImportant(screen, {
            position: 'fixed',
            inset: '0',
            width: '100vw',
            height: '100vh',
            minHeight: '100vh',
            overflow: 'hidden',
        });
    }
    if (canvas) {
        setImportant(canvas, {
            position: 'fixed',
            inset: '0',
            width: '100vw',
            height: '100vh',
            minHeight: '100vh',
            borderRadius: '0',
            display: 'block',
        });
    }
    if (CommercialFarmCanvas.renderer && CommercialFarmCanvas.camera) {
        const width = window.innerWidth || document.documentElement.clientWidth || 1280;
        const height = window.innerHeight || document.documentElement.clientHeight || 720;
        CommercialFarmCanvas.renderer.setSize(width, height, false);
        CommercialFarmCanvas.camera.aspect = width / height;
        CommercialFarmCanvas.camera.updateProjectionMatrix();
    }
}

function moveCommercialCommandStyleToTop() {
    const style = document.getElementById('commercial-command-style');
    if (style) document.head.appendChild(style);
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
            setText('pro-ph', ph || '--');
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
    const prompt = `You are SeedDown's commercial farm AI. Current sensor data: ${JSON.stringify(currentData)}. Give one concise operations insight about risk, yield, energy, or automation.`;
    try {
        const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt }),
        });
        const result = await res.json();
        setText('ai-overview-text', result.reply || result.response || 'Farm is operating normally.');
    } catch (e) {
        setText('ai-overview-text', 'AI Advisor offline. Sensor dashboard still available.');
    }
}

async function sendCommercialChat() {
    const input = document.getElementById('commercialChatInput');
    const message = input?.value.trim();
    if (!message) return;
    input.value = '';
    appendChat('user', message);
    appendChat('ai', 'Thinking...');

    try {
        const farm = getCurrentFarm();
        const prompt = `SeedDown commercial farm context: ${JSON.stringify({ farm, sensors: AppState.sensors })}\nUser question: ${message}`;
        const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt }),
        });
        const result = await res.json();
        replaceLastAi(result.reply || result.response || 'I could not generate a recommendation yet.');
    } catch (error) {
        replaceLastAi('AI chat is offline, but sensor monitoring and tools still work.');
    }
}

function appendChat(role, text) {
    chatMessages.push({ role, text });
    renderChat();
}

function replaceLastAi(text) {
    const last = chatMessages[chatMessages.length - 1];
    if (last?.role === 'ai') last.text = text;
    else chatMessages.push({ role: 'ai', text });
    renderChat();
}

function renderChat() {
    const log = document.getElementById('commercialChatLog');
    if (!log) return;
    log.innerHTML = chatMessages.length
        ? chatMessages.map(item => `<div class="chat-bubble ${item.role}">${escapeHTML(item.text)}</div>`).join('')
        : '<div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>';
    log.scrollTop = log.scrollHeight;
}

function openAssignDeviceModal() {
    const existing = document.getElementById('assignDeviceOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'assignDeviceOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:80;background:rgba(15,23,42,.38);display:flex;align-items:center;justify-content:center;padding:18px;';
    overlay.innerHTML = `
        <div style="width:min(430px,100%);background:#fff;border-radius:22px;padding:18px;box-shadow:0 26px 80px rgba(15,23,42,.25);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;">
                <div>
                    <div style="font-size:10px;font-weight:950;color:#15803d;text-transform:uppercase;letter-spacing:.1em;">Commercial Device</div>
                    <strong style="font-size:18px;">Assign Zone Device</strong>
                </div>
                <button id="assignClose" style="width:34px;height:34px;border:none;border-radius:12px;background:#f1f5f9;font-size:18px;font-weight:900;cursor:pointer;">×</button>
            </div>
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">Serial</label>
            <input id="assignSerial" value="SD-COM-ZNB-00001" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">Zone</label>
            <select id="assignZone" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
                <option value="zone_A">Zone A</option>
                <option value="zone_B">Zone B</option>
                <option value="zone_C">Zone C</option>
            </select>
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">WiFi SSID</label>
            <input id="assignWifi" placeholder="Farm WiFi" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
            <button id="assignSubmit" style="width:100%;padding:13px;border:none;border-radius:14px;background:#166534;color:white;font-weight:950;cursor:pointer;">Register and Assign</button>
            <div id="assignStatus" style="font-size:12px;color:#64748b;line-height:1.45;margin-top:10px;">Commercial serials: SD-COM-ZNB, SD-COM-ZNP, SD-COM-MST.</div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('assignClose').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', event => { if (event.target === overlay) overlay.remove(); });
    document.getElementById('assignSubmit').addEventListener('click', assignCommercialDevice);
}

async function assignCommercialDevice() {
    const serial = document.getElementById('assignSerial')?.value.trim();
    const zoneId = document.getElementById('assignZone')?.value;
    const wifi = document.getElementById('assignWifi')?.value.trim();
    const status = document.getElementById('assignStatus');
    const button = document.getElementById('assignSubmit');
    if (!serial) return;

    button.disabled = true;
    button.textContent = 'Assigning...';
    try {
        const response = await fetch(`${API_BASE}/api/devices/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serial,
                wifi_ssid: wifi,
                accountType: serial.includes('MST') ? 'commercial_master' : serial.includes('ZNP') ? 'commercial_zone_pro' : 'commercial_zone_basic',
                farmId: AppState.currentFarmId || 'farm_commercial_001',
                zoneId,
            }),
        });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || 'Device assignment failed');
        const farm = getCurrentFarm() || {};
        farm.commercialDevices = [...(farm.commercialDevices || []), data.device];
        AppState.currentFarm = farm;
        status.style.color = '#047857';
        status.textContent = `Assigned ${data.device.deviceId} to ${zoneId}`;
    } catch (error) {
        status.style.color = '#dc2626';
        status.textContent = error.message;
    } finally {
        button.disabled = false;
        button.textContent = 'Register and Assign';
    }
}
function sensorCard(label, id, value, key) {
    return `
        <button class="pro-sensor-card" data-key="${key}" data-label="${label}" type="button">
            <span>${label}</span>
            <strong id="${id}">${value}</strong>
        </button>`;
}

function featureButton(feature, icon, label) {
    return '<button class="com-feat ops-tool-btn" data-feature="' + feature + '" type="button"><span>' + icon + '</span><strong>' + label + '</strong></button>';
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

function ensureCommercialCommandStyles() {
    if (document.getElementById('commercial-command-style')) return;
    const style = document.createElement('style');
    style.id = 'commercial-command-style';
    style.textContent = `
        .commercial-command-screen,
        .commercial-command-screen.commercial-farm-host {
            position: relative !important;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            overflow: hidden !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #f8faf7 !important;
            color: #17231b;
        }
        .commercial-command-canvas,
        .commercial-command-screen .commercial-farm-canvas {
            position: absolute !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            display: block !important;
            border-radius: 0 !important;
            background: #f8faf7 !important;
        }
        .commercial-top-shell {
            position: absolute;
            top: 16px;
            left: 16px;
            z-index: 15;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .commercial-title-card,
        .commercial-ops-panel,
        .commercial-panel-toggle,
        .commercial-icon-btn {
            background: rgba(255, 255, 255, .9);
            border: 1px solid rgba(22, 101, 52, .12);
            box-shadow: 0 18px 48px rgba(15, 23, 42, .12);
            backdrop-filter: blur(18px);
        }
        .commercial-title-card {
            min-width: min(360px, calc(100vw - 112px));
            border-radius: 22px;
            padding: 14px 16px;
        }
        .commercial-kicker {
            font-size: 10px;
            color: #15803d;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .1em;
        }
        .commercial-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-top: 4px;
        }
        .commercial-title-row strong { font-size: 18px; }
        .commercial-title-row span {
            padding: 5px 9px;
            border-radius: 999px;
            background: #ecfdf5;
            color: #047857;
            font-size: 11px;
            font-weight: 900;
            white-space: nowrap;
        }
        .commercial-title-card small {
            display: block;
            color: #64748b;
            font-size: 12px;
            font-weight: 750;
            margin-top: 3px;
        }
        .commercial-icon-btn {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            color: #17231b;
            font-size: 20px;
            font-weight: 900;
            cursor: pointer;
        }
        .commercial-icon-btn.small {
            width: 34px;
            height: 34px;
            font-size: 18px;
            box-shadow: none;
        }
        .commercial-panel-toggle {
            position: absolute;
            top: 16px;
            right: 16px;
            z-index: 18;
            border-radius: 999px;
            padding: 10px 14px;
            color: #166534;
            font-size: 11px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .08em;
            cursor: pointer;
        }
        .commercial-ops-panel {
            position: absolute;
            top: 62px;
            right: 16px;
            bottom: 16px;
            z-index: 16;
            width: min(410px, calc(100vw - 32px));
            border-radius: 26px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform .28s ease, opacity .28s ease;
        }
        .commercial-command-screen.panel-hidden .commercial-ops-panel {
            transform: translateX(calc(100% + 26px));
            opacity: 0;
            pointer-events: none;
        }
        .ops-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 16px 16px 12px;
            border-bottom: 1px solid rgba(15, 23, 42, .08);
        }
        .ops-panel-header strong { display:block; font-size: 17px; margin-top: 3px; }
        .ops-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .ops-section {
            background: #ffffff;
            border: 1px solid rgba(15, 23, 42, .08);
            border-radius: 20px;
            padding: 14px;
            box-shadow: 0 8px 26px rgba(15, 23, 42, .06);
        }
        .ops-section-title {
            color: #64748b;
            font-size: 10px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .1em;
            margin-bottom: 10px;
        }
        .advisor-section { border-left: 4px solid #22c55e; }
        .advisor-text { color: #334155; font-size: 13px; line-height: 1.45; }
        .ops-sensor-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .pro-sensor-card {
            min-height: 74px;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            background: #f8fafc;
            color: #17231b;
            padding: 10px;
            text-align: left;
            cursor: pointer;
        }
        .pro-sensor-card span {
            display:block;
            color:#64748b;
            font-size:10px;
            font-weight:900;
            text-transform:uppercase;
            letter-spacing:.06em;
        }
        .pro-sensor-card strong {
            display:block;
            color:#059669;
            font-size:16px;
            font-weight:950;
            margin-top:12px;
            word-break:break-word;
        }
        .ops-metrics { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .metric-tile {
            min-height:78px;
            border:1px solid #e5e7eb;
            border-radius:16px;
            background:#f8fafc;
            text-align:left;
            padding:12px;
            cursor:pointer;
        }
        .metric-tile span { display:block; color:#64748b; font-size:10px; font-weight:950; text-transform:uppercase; }
        .metric-tile strong { display:block; margin-top:10px; color:#047857; font-size:18px; font-weight:950; }
        .ops-tool-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; }
        .ops-tool-btn {
            border:1px solid #dbe7dc;
            border-radius:16px;
            background:#f0fdf4;
            color:#166534;
            min-height:74px;
            font-size:12px;
            font-weight:950;
            cursor:pointer;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:7px;
        }
        .ops-tool-btn span { font-size:23px; line-height:1; }
        .ops-tool-btn strong { font-size:11px; font-weight:950; }
        .commercial-chat-log {
            height: 180px;
            overflow-y: auto;
            display:flex;
            flex-direction:column;
            gap:8px;
            padding:10px;
            border-radius:16px;
            background:#f8fafc;
            border:1px solid #e5e7eb;
        }
        .chat-bubble {
            max-width: 88%;
            padding: 9px 11px;
            border-radius: 14px;
            font-size: 12px;
            line-height: 1.35;
        }
        .chat-bubble.ai { background:#ecfdf5; color:#14532d; align-self:flex-start; }
        .chat-bubble.user { background:#166534; color:white; align-self:flex-end; }
        .commercial-chat-input-row { display:flex; gap:8px; margin-top:10px; }
        .commercial-chat-input-row input {
            flex:1;
            min-width:0;
            border:1px solid #e5e7eb;
            border-radius:14px;
            padding:11px 12px;
            background:#fff;
            outline:none;
        }
        .commercial-chat-input-row button {
            border:none;
            border-radius:14px;
            background:#166534;
            color:white;
            padding:0 14px;
            font-weight:950;
            cursor:pointer;
        }
        .commercial-command-screen .cf-legend,
        .commercial-command-screen .cf-expand-btn,
        .commercial-command-screen .cf-zoom-controls {
            display: none !important;
        }
        .commercial-command-screen .cf-info-panel {
            display: block !important;
            top: 132px !important;
            left: 18px !important;
            width: min(360px, calc(100vw - 470px)) !important;
            min-width: 280px !important;
            color: #17231b !important;
            background: rgba(255,255,255,.92) !important;
            border: 1px solid rgba(22,101,52,.12) !important;
            box-shadow: 0 18px 48px rgba(15,23,42,.12) !important;
            backdrop-filter: blur(18px) !important;
        }
        .commercial-command-screen .cf-panel-title,
        .commercial-command-screen .cf-mini-metric strong {
            color: #17231b !important;
        }
        .commercial-command-screen .cf-panel-kicker,
        .commercial-command-screen .cf-plant-list b,
        .commercial-command-screen .cf-tooltip strong {
            color: #047857 !important;
        }
        .commercial-command-screen .cf-panel-sub,
        .commercial-command-screen .cf-mini-metric span,
        .commercial-command-screen .cf-plant-list span,
        .commercial-command-screen .cf-tooltip small {
            color: #64748b !important;
        }
        .commercial-command-screen .cf-mini-metric,
        .commercial-command-screen .cf-plant-list span {
            background: #f8fafc !important;
            border: 1px solid #e5e7eb !important;
        }
        .commercial-command-screen .cf-tooltip {
            display: flex !important;
            bottom: 18px !important;
            left: 50% !important;
            color: #17231b !important;
            background: rgba(255,255,255,.9) !important;
            border: 1px solid rgba(22,101,52,.12) !important;
            box-shadow: 0 12px 34px rgba(15,23,42,.1) !important;
        }
        @media (max-width: 760px) {
            .commercial-top-shell { left: 12px; top: 12px; }
            .commercial-title-card { min-width: 0; width: calc(100vw - 120px); }
            .commercial-title-row { align-items:flex-start; flex-direction:column; }
            .commercial-panel-toggle { top: auto; bottom: 16px; right: 16px; }
            .commercial-ops-panel { top: 94px; left: 12px; right: 12px; bottom: 70px; width: auto; }
            .commercial-command-screen.panel-hidden .commercial-ops-panel { transform: translateY(calc(100% + 90px)); }
            .ops-sensor-grid { grid-template-columns: repeat(2, 1fr); }
            .ops-tool-grid { grid-template-columns: repeat(2, 1fr); }
        }
    `;
    document.head.appendChild(style);
}

