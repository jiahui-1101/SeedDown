import { showScreen } from '../utils/navigation.js';
import { AppState } from '../store.js';
import { CommercialFarmCanvas } from '../components/CommercialFarmCanvas.js?v=commercial-polish-1';
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
let selectedZoneId = null;
let zoneSnapshots = {};

const DEFAULT_COMMERCIAL_ZONES = [
    { id: 'zone_A', label: 'Zone A', crop: 'Leafy Greens' },
    { id: 'zone_B', label: 'Zone B', crop: 'Fruit Crops' },
    { id: 'zone_C', label: 'Zone C', crop: 'Herbs' },
];

export function render() {
    const container = document.getElementById('screenContainer');
    const farm = getCurrentFarm();
    const rack = resolveRack(farm);
    const plantTotal = plantCount(farm);
    const occupancy = rack.total ? Math.min(100, Math.round((plantTotal / rack.total) * 100)) : 0;
    if (!selectedZoneId) selectedZoneId = resolveDefaultZone(farm);

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
                        <div class="ops-section-title">Farm Master / Zones</div>
                        <div class="zone-overview-grid">
                            ${zoneOverviewCards(farm, rack)}
                        </div>
                    </section>

                    <section class="ops-section">
                        <div class="ops-section-title" id="liveSensorTitle">Live Sensors · ${zoneLabel(selectedZoneId)}</div>
                        <div class="ops-sensor-grid">
                            ${sensorCard('Temp', 'pro-temp', '--', 'temp')}
                            ${sensorCard('Humid', 'pro-humid', '--', 'humid')}
                            ${sensorCard('Light', 'pro-light', '--', 'light')}
                            ${sensorCard('pH', 'pro-ph', '--', 'ph')}
                            ${sensorCard('Water', 'pro-water', '--', 'water')}
                            ${sensorCard('Gas', 'pro-gas', '--', 'nutrient')}
                            ${sensorCard('EC', 'pro-ec', '--', 'ec')}
                            ${sensorCard('CO2', 'pro-co2', '--', 'co2')}
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
                            ${featureButton('camera', '📷', 'Camera')}
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
            else if (feature === 'camera') {
                initProDashboard();
                openZoneCameraModal();
            }
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
                zoneId: selectedZoneId,
            });
        });
    });

    document.querySelectorAll('.commercial-zone-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedZoneId = card.getAttribute('data-zone');
            AppState.currentZoneId = selectedZoneId;
            updateZoneSelectionUI();
            syncSelectedZoneData();
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
        CommercialFarmCanvas.init('commercialFarmCanvas', getCurrentFarm());
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
            await updateZoneOverview();
            const res = await fetch(`${API_BASE}/api/sensors/latest?${buildSensorQuery().toString()}`);
            const data = await res.json();
            if (!data || !data.reading) return;
            const r = data.reading;

            const temp = Number(r.temperature || 0);
            const humid = Number(r.humidity || 0);
            const light = Number(r.lightRaw || 0);
            const ph = Number(r.ph || 0);
            const water = Number(r.waterDistanceCm || 0);
            const gas = Number(r.gasRaw || 0);
            const ec = Number(r.ec || 0);
            const co2 = Number(r.co2Ppm || 0);
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
            setText('pro-ec', ec ? ec.toFixed(2) + ' mS' : '--');
            setText('pro-co2', co2 ? co2 + ' ppm' : '--');

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

function buildSensorQuery() {
    const farm = getCurrentFarm();
    const query = new URLSearchParams();
    const zoneDevice = findDeviceForZone(farm, selectedZoneId);
    if (zoneDevice?.deviceId) query.set('deviceId', zoneDevice.deviceId);
    else if (selectedZoneId) query.set('zoneId', selectedZoneId);
    else if (farm?.deviceId) query.set('deviceId', farm.deviceId);
    else if (farm?.zoneId) query.set('zoneId', farm.zoneId);
    else if (farm?.id) query.set('fieldId', farm.id);
    else query.set('deviceId', 'farm_001');
    return query;
}

async function updateZoneOverview() {
    const farm = getCurrentFarm();
    const zones = buildCommercialZones(farm, resolveRack(farm));
    const entries = await Promise.all(zones.map(async zone => {
        const query = new URLSearchParams();
        const device = findDeviceForZone(farm, zone.id);
        if (device?.deviceId) query.set('deviceId', device.deviceId);
        else query.set('zoneId', zone.id);

        try {
            const response = await fetch(`${API_BASE}/api/sensors/latest?${query.toString()}`);
            const data = await response.json();
            return [zone.id, data.reading || null];
        } catch (error) {
            return [zone.id, null];
        }
    }));

    zoneSnapshots = Object.fromEntries(entries);
    renderZoneOverview();
}

async function syncSelectedZoneData() {
    try {
        const res = await fetch(`${API_BASE}/api/sensors/latest?${buildSensorQuery().toString()}`);
        const data = await res.json();
        if (data?.reading) {
            applySensorReading(data.reading);
            fetchAIGlobalAdvice(data.reading);
        }
    } catch (error) {
        setText('ai-overview-text', `${zoneLabel(selectedZoneId)} is waiting for live data.`);
    }
}

function applySensorReading(r) {
    const temp = Number(r.temperature || 0);
    const humid = Number(r.humidity || 0);
    const light = Number(r.lightRaw || 0);
    const ph = Number(r.ph || 0);
    const water = Number(r.waterDistanceCm || 0);
    const gas = Number(r.gasRaw || 0);
    const ec = Number(r.ec || 0);
    const co2 = Number(r.co2Ppm || 0);
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
    setText('pro-ec', ec ? ec.toFixed(2) + ' mS' : '--');
    setText('pro-co2', co2 ? co2 + ' ppm' : '--');
}
async function fetchAIGlobalAdvice(currentData) {
    const prompt = `Current sensor data: ${JSON.stringify(currentData)}. Give one concise operations insight about risk, yield, energy, or automation.`;
    try {
        const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt, mode: 'commercial' }),
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
        const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                history: chatMessages
                    .filter(m => m.role !== 'ai' || m.text !== 'Thinking...')
                    .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
                    .slice(-10),
                mode: 'commercial',
                gardenState: { farm, sensors: AppState.sensors },
            }),
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
        farm.commercialDevices = upsertCommercialDevice(farm.commercialDevices || [], data.device);
        farm.zoneId = zoneId;
        AppState.currentFarm = farm;
        persistCurrentFarm(farm);
        selectedZoneId = zoneId;
        AppState.currentZoneId = selectedZoneId;
        // FIX: defer one frame so the overlay has closed and the zone grid is in DOM
        // before renderZoneOverview -> bindZoneCards runs querySelectorAll
        requestAnimationFrame(() => {
            renderZoneOverview();
            updateZoneSelectionUI();
        });
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

function openZoneCameraModal() {
    const existing = document.getElementById('zoneCameraOverlay');
    if (existing) existing.remove();

    const farm = getCurrentFarm();
    const zones = commercialZonesForFarm(farm);
    const zone = zones.find(item => item.id === selectedZoneId) || zones[0];
    const image = farm?.photoPreview || farm?.image || farm?.thumbnail || '';
    const reading = zoneSnapshots[zone?.id] || null;

    const overlay = document.createElement('div');
    overlay.id = 'zoneCameraOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:95;background:rgba(15,23,42,.48);display:flex;align-items:center;justify-content:center;padding:18px;';
    overlay.innerHTML = `
        <div style="width:min(780px,100%);max-height:92vh;overflow:hidden;background:#fff;border-radius:24px;box-shadow:0 28px 90px rgba(15,23,42,.32);display:flex;flex-direction:column;">
            <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;padding:16px 18px;border-bottom:1px solid #e5e7eb;">
                <div>
                    <div style="font-size:10px;font-weight:950;color:#15803d;text-transform:uppercase;letter-spacing:.1em;">Zone camera live view</div>
                    <strong id="cameraZoneTitle" style="font-size:19px;color:#17231b;">${escapeHTML(zone?.label || 'Zone Camera')}</strong>
                    <div id="cameraTimestamp" style="font-size:12px;color:#64748b;margin-top:4px;">Live snapshot · ${new Date().toLocaleTimeString()}</div>
                </div>
                <button id="cameraClose" style="width:36px;height:36px;border:none;border-radius:12px;background:#f1f5f9;font-size:18px;font-weight:900;cursor:pointer;">×</button>
            </div>

            <div style="padding:16px;overflow:auto;">
                <div style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(220px,.65fr);gap:14px;">
                    <div id="cameraFeed" style="position:relative;min-height:360px;border-radius:20px;overflow:hidden;background:${image ? `url(${image}) center/cover` : 'linear-gradient(135deg,#dcfce7,#f8fafc)'};border:1px solid #dbe7dc;">
                        ${!image ? cameraPlaceholder(zone) : ''}
                        <div style="position:absolute;left:12px;top:12px;display:flex;gap:7px;align-items:center;background:rgba(15,23,42,.66);color:#fff;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900;">
                            <span style="width:7px;height:7px;background:#22c55e;border-radius:50%;box-shadow:0 0 12px #22c55e;"></span>
                            LIVE CAMERA
                        </div>
                        <div style="position:absolute;right:12px;bottom:12px;background:rgba(255,255,255,.86);border:1px solid rgba(255,255,255,.7);border-radius:14px;padding:9px 10px;color:#17231b;font-size:12px;font-weight:900;">
                            ${escapeHTML(zone?.crop || 'Mixed crops')}
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:10px;">
                        <label style="display:block;">
                            <span style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">Select zone</span>
                            <select id="cameraZoneSelect" style="width:100%;margin-top:6px;padding:12px;border:1px solid #e5e7eb;border-radius:14px;background:#f8fafc;outline:none;font-weight:900;color:#17231b;">
                                ${zones.map(item => `<option value="${escapeAttr(item.id)}" ${item.id === zone?.id ? 'selected' : ''}>${escapeHTML(item.label)} · ${escapeHTML(item.crop)}</option>`).join('')}
                            </select>
                        </label>
                        ${cameraMetric('Temp', reading?.temperature !== undefined ? `${Number(reading.temperature).toFixed(1)}C` : '--')}
                        ${cameraMetric('Humidity', reading?.humidity !== undefined ? `${reading.humidity}%` : '--')}
                        ${cameraMetric('Light', reading?.lightRaw ?? '--')}
                        ${cameraMetric('Plant count', `${zone?.planted ?? plantCount(farm)} plants`)}
                        <button id="cameraCaptureBtn" style="margin-top:4px;padding:13px;border:none;border-radius:14px;background:#166534;color:#fff;font-weight:950;cursor:pointer;">Capture latest frame</button>
                        <div id="cameraStatus" style="font-size:12px;color:#64748b;line-height:1.45;">Camera feed uses the latest farm photo / camera snapshot attached to this commercial farm. Each zone camera can be checked before running disease analysis.</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('cameraClose')?.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', event => { if (event.target === overlay) overlay.remove(); });
    document.getElementById('cameraCaptureBtn')?.addEventListener('click', () => {
        document.getElementById('cameraTimestamp').textContent = `Live snapshot · ${new Date().toLocaleTimeString()}`;
        document.getElementById('cameraStatus').textContent = 'Latest camera frame captured for review. Use Disease Analysis if this zone looks unhealthy.';
    });
    document.getElementById('cameraZoneSelect')?.addEventListener('change', event => {
        selectedZoneId = event.target.value;
        AppState.currentZoneId = selectedZoneId;
        overlay.remove();
        updateZoneSelectionUI();
        openZoneCameraModal();
    });
}

function upsertCommercialDevice(devices, nextDevice) {
    return [
        ...devices.filter(device =>
            device.deviceId !== nextDevice.deviceId &&
            normalizeZoneId(device.zoneId || device.zone) !== normalizeZoneId(nextDevice.zoneId || nextDevice.zone)
        ),
        nextDevice,
    ];
}

function persistCurrentFarm(farm) {
    const saved = loadSavedFarms();
    const index = saved.findIndex(item => item.id === farm.id);
    if (index >= 0) saved[index] = { ...saved[index], ...farm };
    else saved.push(farm);
    localStorage.setItem('user_farms', JSON.stringify(saved));
}
function sensorCard(label, id, value, key) {
    return `
        <button class="pro-sensor-card" data-key="${key}" data-label="${label}" type="button">
            <span>${label}</span>
            <strong id="${id}">${value}</strong>
        </button>`;
}

function zoneOverviewCards(farm, rack) {
    return buildCommercialZones(farm, rack).map(zone => zoneCardHtml(zone)).join('');
}

function zoneCardHtml(zone) {
    const reading = zoneSnapshots[zone.id];
    const health = zoneHealth(reading, getCurrentFarm()?.thresholds || {});
    const selected = zone.id === selectedZoneId ? 'selected' : '';
    const deviceLabel = zone.deviceId ? zone.deviceId.replace(/^dev_/, '') : 'unassigned';
    const latest = reading
        ? `${formatSensorMini(reading.temperature, '°C')} · ${formatSensorMini(reading.humidity, '%')} · gas ${reading.gasRaw ?? '--'}`
        : 'waiting for first reading';

    return `
        <button class="commercial-zone-card ${selected} ${health.level}" data-zone="${zone.id}" type="button">
            <div class="zone-card-head">
                <span>${escapeHTML(zone.label)}</span>
                <b>${health.label}</b>
            </div>
            <strong>${escapeHTML(zone.crop)}</strong>
            <div class="zone-card-meta">${zone.planted}/${zone.capacity} slots · ${escapeHTML(deviceLabel)}</div>
            <div class="zone-meter"><i style="width:${zone.occupied}%"></i></div>
            <small>${escapeHTML(latest)}</small>
        </button>
    `;
}

function renderZoneOverview() {
    const grid = document.querySelector('.zone-overview-grid');
    if (!grid) return;
    grid.innerHTML = zoneOverviewCards(getCurrentFarm(), resolveRack(getCurrentFarm()));
    bindZoneCards();
}

function bindZoneCards() {
    document.querySelectorAll('.commercial-zone-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedZoneId = card.getAttribute('data-zone');
            AppState.currentZoneId = selectedZoneId;
            updateZoneSelectionUI();
            syncSelectedZoneData();
        });
    });
}

function updateZoneSelectionUI() {
    document.querySelectorAll('.commercial-zone-card').forEach(card => {
        card.classList.toggle('selected', card.getAttribute('data-zone') === selectedZoneId);
    });
    setText('liveSensorTitle', `Live Sensors · ${zoneLabel(selectedZoneId)}`);
}

function buildCommercialZones(farm, rack) {
    const plants = Array.isArray(farm?.plants) ? farm.plants : [];
    const baseZones = commercialZonesForFarm(farm);
    const capacity = Math.max(1, Math.ceil((rack?.total || 9) / baseZones.length));
    const devices = Array.isArray(farm?.commercialDevices) ? farm.commercialDevices : [];

    return baseZones.map((base, index) => {
        const zonePlants = plants.filter((plant, plantIndex) => {
            const explicitZone = normalizeZoneId(plant.zoneId || plant.zone || plant.area);
            if (explicitZone) return explicitZone === base.id;
            return plantIndex % baseZones.length === index;
        });
        const device = devices.find(item => normalizeZoneId(item.zoneId || item.zone) === base.id);
        const crop = dominantCrop(zonePlants) || base.crop;
        const planted = zonePlants.reduce((sum, plant) => sum + (Number.parseInt(plant.slots || plant.count || 1, 10) || 1), 0);

        return {
            ...base,
            crop,
            planted,
            capacity,
            occupied: Math.min(100, Math.round((planted / capacity) * 100)),
            deviceId: device?.deviceId || (farm?.zoneId === base.id ? farm.deviceId : null),
        };
    });
}

function commercialZonesForFarm(farm) {
    const zones = Array.isArray(farm?.zones) ? farm.zones : Array.isArray(farm?.commercialStructure?.zones) ? farm.commercialStructure.zones : [];
    if (!zones.length) return DEFAULT_COMMERCIAL_ZONES;
    return zones.map((zone, index) => {
        const id = normalizeZoneId(zone.zone_id || zone.id || `zone_${String.fromCharCode(65 + index)}`);
        return {
            id,
            label: zone.name || `Zone ${String.fromCharCode(65 + index)}`,
            crop: zone.crop || (Array.isArray(zone.plants) ? zone.plants.join(', ') : '') || 'Mixed Crops',
        };
    });
}

function dominantCrop(plants) {
    if (!plants.length) return '';
    const counts = plants.reduce((acc, plant) => {
        const name = plant.name || plant.species || 'Mixed Crops';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

function findDeviceForZone(farm, zoneId) {
    if (!zoneId) return null;
    const devices = Array.isArray(farm?.commercialDevices) ? farm.commercialDevices : [];
    return devices.find(item => normalizeZoneId(item.zoneId || item.zone) === zoneId)
        || (normalizeZoneId(farm?.zoneId) === zoneId ? farm : null);
}

function normalizeZoneId(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';
    if (raw === 'a' || raw === 'zone a' || raw === 'zone_a') return 'zone_A';
    if (raw === 'b' || raw === 'zone b' || raw === 'zone_b') return 'zone_B';
    if (raw === 'c' || raw === 'zone c' || raw === 'zone_c') return 'zone_C';
    return raw.startsWith('zone_') ? `zone_${raw.slice(5).toUpperCase()}` : raw;
}

function resolveDefaultZone(farm) {
    const firstZone = commercialZonesForFarm(farm)[0]?.id || 'zone_A';
    return normalizeZoneId(AppState.currentZoneId || farm?.zoneId) || firstZone;
}

function zoneLabel(zoneId) {
    return commercialZonesForFarm(getCurrentFarm()).find(zone => zone.id === zoneId)?.label || 'Farm';
}

function zoneHealth(reading, thresholds = {}) {
    if (!reading) return { level: 'idle', label: 'No Data' };
    const gasLimit = Number(thresholds.gasDangerThreshold ?? 3000);
    const tempMin = Number(thresholds.tempMin ?? 18);
    const tempMax = Number(thresholds.tempMax ?? 35);
    const phMin = Number(thresholds.phMin ?? 5.5);
    const phMax = Number(thresholds.phMax ?? 6.8);
    const dark = Number(thresholds.darkThreshold ?? 1500);
    const waterLow = Number(thresholds.waterLowCm ?? 20);

    if (Number(reading.gasRaw) > gasLimit || Number(reading.temperature) > tempMax + 3) {
        return { level: 'critical', label: 'Critical' };
    }
    if (
        Number(reading.temperature) < tempMin ||
        Number(reading.temperature) > tempMax ||
        Number(reading.ph) < phMin ||
        Number(reading.ph) > phMax ||
        Number(reading.lightRaw) < dark ||
        Number(reading.waterDistanceCm) > waterLow
    ) {
        return { level: 'warning', label: 'Warning' };
    }
    return { level: 'healthy', label: 'Healthy' };
}

function formatSensorMini(value, suffix = '') {
    const number = Number(value);
    if (!Number.isFinite(number)) return `--${suffix}`;
    return `${number.toFixed(number % 1 ? 1 : 0)}${suffix}`;
}

function featureButton(feature, icon, label) {
    return '<button class="com-feat ops-tool-btn" data-feature="' + feature + '" type="button"><span>' + icon + '</span><strong>' + label + '</strong></button>';
}

function cameraMetric(label, value) {
    return `
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:11px 12px;">
            <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">${escapeHTML(label)}</div>
            <strong style="display:block;margin-top:4px;color:#047857;font-size:16px;">${escapeHTML(value)}</strong>
        </div>
    `;
}

function cameraPlaceholder(zone) {
    const crop = zone?.crop || 'Mixed crops';
    return `
        <div style="position:absolute;inset:0;display:grid;place-items:center;padding:28px;">
            <div style="width:min(420px,92%);aspect-ratio:4/3;border-radius:22px;background:linear-gradient(180deg,#ecfdf5,#dbeafe);border:1px solid rgba(22,101,52,.16);box-shadow:inset 0 0 0 8px rgba(255,255,255,.38);display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:24px;">
                ${Array.from({ length: 12 }, (_, index) => `
                    <div style="border-radius:999px;background:${index % 3 === 0 ? '#22c55e' : index % 3 === 1 ? '#16a34a' : '#84cc16'};box-shadow:0 12px 24px rgba(22,101,52,.18);"></div>
                `).join('')}
            </div>
            <div style="position:absolute;bottom:22px;left:22px;right:22px;text-align:center;color:#166534;font-size:13px;font-weight:900;">Simulated live field frame · ${escapeHTML(crop)}</div>
        </div>
    `;
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
    if (Array.isArray(farm?.plants)) {
        return farm.plants.reduce((sum, plant) => sum + (Number.parseInt(plant.slots || plant.count || 1, 10) || 1), 0);
    }
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

function escapeAttr(value) {
    return escapeHTML(value);
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
        .zone-overview-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
        }
        .commercial-zone-card {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            background: #f8fafc;
            color: #17231b;
            padding: 11px;
            text-align: left;
            cursor: pointer;
            transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
        }
        .commercial-zone-card:hover,
        .commercial-zone-card.selected {
            border-color: #22c55e;
            box-shadow: 0 10px 24px rgba(34, 197, 94, .12);
            transform: translateY(-1px);
        }
        .zone-card-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 7px;
        }
        .zone-card-head span {
            color: #64748b;
            font-size: 10px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .08em;
        }
        .zone-card-head b {
            border-radius: 999px;
            padding: 4px 8px;
            background: #eef2f7;
            color: #64748b;
            font-size: 9px;
            font-weight: 950;
            text-transform: uppercase;
            white-space: nowrap;
        }
        .commercial-zone-card.healthy .zone-card-head b { background: #dcfce7; color: #047857; }
        .commercial-zone-card.warning .zone-card-head b { background: #fef3c7; color: #b45309; }
        .commercial-zone-card.critical .zone-card-head b { background: #fee2e2; color: #b91c1c; }
        .commercial-zone-card strong {
            display: block;
            font-size: 14px;
            font-weight: 950;
        }
        .zone-card-meta {
            margin-top: 4px;
            color: #64748b;
            font-size: 11px;
            font-weight: 750;
        }
        .zone-meter {
            height: 7px;
            border-radius: 999px;
            overflow: hidden;
            background: #e5e7eb;
            margin: 9px 0 7px;
        }
        .zone-meter i {
            display: block;
            height: 100%;
            min-width: 8px;
            border-radius: inherit;
            background: linear-gradient(90deg, #22c55e, #84cc16);
        }
        .commercial-zone-card.warning .zone-meter i { background: linear-gradient(90deg, #f59e0b, #facc15); }
        .commercial-zone-card.critical .zone-meter i { background: linear-gradient(90deg, #ef4444, #fb7185); }
        .commercial-zone-card small {
            display: block;
            color: #64748b;
            font-size: 11px;
            line-height: 1.35;
        }
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