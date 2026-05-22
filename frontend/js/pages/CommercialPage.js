import { API_BASE } from '../utils/apiBase.js';
import { showScreen } from '../utils/navigation.js';
import { AppState } from '../store.js';
import { CommercialFarmCanvas } from '../components/CommercialFarmCanvas.js?v=radish-ai-1';
import { openAddPlantModal } from '../components/AddPlantModal.js';
import { aiAdvisorHTML, aiChatHTML } from '../utils/aiFormat.js';
import { formatMetric, hasRealSensorData, normalizeSensorReading, toFiniteNumber } from '../utils/sensorReading.js';
import jsQR from 'https://esm.sh/jsqr@1.4.0';


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
let activeZoneCameraStream = null;
const LIVE_READING_CACHE_KEY = 'seeddown_commercial_live_cache';
const LAST_CAMERA_SNAPSHOT_KEY = 'seeddown_last_camera_snapshot';

const DEFAULT_COMMERCIAL_ZONES = [
    { id: 'zone_A', label: 'Zone A', crop: 'Leafy Greens' },
    { id: 'zone_B', label: 'Zone B', crop: 'Fruit Crops' },
    { id: 'zone_C', label: 'Zone C', crop: 'Herbs' },
    { id: 'zone_D', label: 'Zone D', crop: 'Mixed Crops' },
    { id: 'zone_E', label: 'Zone E', crop: 'Mixed Crops' },
    { id: 'zone_F', label: 'Zone F', crop: 'Mixed Crops' },
];

const DEMO_COMMERCIAL_ZONE_DEVICES = {
    zone_A: 'commercial-zone-node-1',
    zone_B: 'commercial-zone-node-2',
    zone_C: 'commercial-zone-node-3',
    zone_D: 'commercial-zone-node-4',
    zone_E: 'commercial-zone-node-5',
    zone_F: 'commercial-zone-node-6',
    // D/E/F rely on zoneId query fallback — no dedicated demo device
};

const DEMO_COMMERCIAL_FARM_MASTER = 'commercial-farm-master-1';
const DEMO_QR_TOKEN_SERIALS = {
    sd_demo_commercial_zone_node_1: 'SD-COM-ZON-01001',
    sd_demo_commercial_zone_node_2: 'SD-COM-ZON-01002',
    sd_demo_commercial_zone_node_3: 'SD-COM-ZON-01003',
    sd_demo_commercial_farm_master_1: 'SD-COM-FRM-03001',
};

export function render() {
    const container = document.getElementById('screenContainer');
    const farm = getCurrentFarm();
    AppState.currentFarm = farm; 
    const rack = resolveRack(farm);
    const displaySummary = commercialDisplaySummary(farm, rack);
    const occupancy = displaySummary.total ? Math.min(100, Math.round((displaySummary.planted / displaySummary.total) * 100)) : 0;
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
                    <small>${escapeHTML(displaySummary.label)} · ${displaySummary.planted}/${displaySummary.total} planted</small>
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

    <!-- FARM MASTER OVERVIEW -->
    <section class="ops-section" id="farmMasterSection" style="border-left:4px solid #22c55e;">
        <div class="ops-section-title" style="color:#15803d;">🏭 Farm Master · Overall</div>
       <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
    <button class="fm-tile fm-drill" data-key="water" type="button">
        <span>Water Level</span>
        <strong id="fm-water">--</strong>
    </button>
    <button class="fm-tile fm-drill" data-key="gas" type="button">
        <span>Gas</span>
        <strong id="fm-gas">--</strong>
    </button>
    <button class="fm-tile fm-drill" data-key="co2" type="button">
        <span>CO₂</span>
        <strong id="fm-co2">--</strong>
    </button>
    <button class="fm-tile fm-drill" data-key="energy" type="button">
        <span>Energy</span>
        <strong id="fm-energy">--</strong>
    </button>
</div>
<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
    <div style="font-size:11px;color:#047857;font-weight:750;line-height:1.45;" id="fm-status-text">Syncing farm master...</div>
    <button id="farmMasterDetailBtn" type="button" style="font-size:10px;font-weight:950;color:#166534;background:#dcfce7;border:1px solid #bbf7d0;border-radius:999px;padding:5px 10px;cursor:pointer;">View All →</button>
</div>
    </section>
   

                    <section class="ops-section advisor-section">
                        <div class="ops-section-title">AI Farm Advisor</div>
                        <div id="ai-overview-text" class="advisor-text">Syncing commercial farm data...</div>
                    </section>

                    

                    <section class="ops-section">
<div class="ops-section-title">Zone Health · Tap to drill in</div>
                        <div class="zone-overview-grid">
                            ${zoneOverviewCards(farm, rack)}
                        </div>
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
    window.removeEventListener('seeddown:mascotAsk', handleMascotAsk);
    window.addEventListener('seeddown:mascotAsk', handleMascotAsk);

    // Farm master tiles → detail page
document.querySelectorAll('.fm-drill').forEach(tile => {
    tile.addEventListener('click', () => {
        clearInterval(AppState.proInterval);
        showScreen('farm-master-detail', {
            key: tile.getAttribute('data-key'),
            from: 'dash-c',
        });
    });
});

document.getElementById('farmMasterDetailBtn')?.addEventListener('click', () => {
    clearInterval(AppState.proInterval);
    showScreen('farm-master-detail', { from: 'dash-c' });
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
else if (feature === 'alerts') showScreen('alert-commercial');  // ← 加这行
else showScreen('feature', { feature, from: 'dash-c' });
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
        // ── Farm Master ──────────────────────────────────────
        const fmRes = await fetchWithTimeout(`${API_BASE}/api/sensors/latest?deviceId=${DEMO_COMMERCIAL_FARM_MASTER}`, {}, 4500).catch(() => null);
        let fmReading = getCachedCommercialReading('farm_master')?.reading || null;
        if (fmRes) {
            const fmData = await fmRes.json().catch(() => null);
            const r = fmData?.reading;
            if (hasRealSensorData(r)) {
    fmReading = rememberCommercialReading('farm_master', r, 'deviceId=' + DEMO_COMMERCIAL_FARM_MASTER).reading;
}
        }
        if (fmReading) {
    const setFmTile = (id, text, isNormal) => {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = text;
            el.style.color = isNormal ? '#14532d' : '#dc2626';
        }
    };
    const normalizedMaster = normalizeSensorReading(fmReading);
    const water = normalizedMaster.waterDistanceCm;
    const gas   = normalizedMaster.gasRaw;
    const co2   = normalizedMaster.co2Ppm;
    const energy = normalizedMaster.energyKwh;

    setFmTile('fm-water',  water  != null ? `${formatMetric(water, ' cm', 1)}`  : '--', water  == null || (water >= 3 && water <= 30));
    setFmTile('fm-gas',    gas    != null ? String(Math.round(gas))   : '--', gas    == null || gas < 3000);
    setFmTile('fm-co2',    co2    != null ? `${co2} ppm`              : '--', co2    == null || co2 < 1500);
    setFmTile('fm-energy', energy != null ? `${formatMetric(energy, ' kWh', 2)}`: '--', energy == null || energy >= 0);
    setText('fm-status-text', `Farm master ${formatReadingTime(fmReading)}${fmReading._stale ? ' · cached' : ''}`);
        }

        // ── Zone overview ─────────────────────────────────────
        await updateZoneOverview();

                // ── AI advice (once) ──────────────────────────────────
        if (!AppState.aiConsulted) {
            const firstZone = buildCommercialZones(getCurrentFarm(), resolveRack(getCurrentFarm()))[0];
            const data = await fetchLatestCommercialReading(firstZone?.id || 'zone_A');
            if (data?.reading) {
                fetchAIGlobalAdvice(data.reading);
                AppState.aiConsulted = true;
            }
        }
    } catch (e) {
        console.error('Dashboard Sync Failed:', e);
        setAiOverview('Live backend offline. Showing saved farm layout.');
    }
};

    syncData();
    AppState.proInterval = setInterval(syncData, 8000);
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
    return query;
}

function commercialSensorQueryCandidates(zoneId = selectedZoneId) {
    const farm = getCurrentFarm();
    const normalizedZone = normalizeZoneId(zoneId);
    const candidates = [];
    const pushParams = pairs => {
        const query = new URLSearchParams();
        pairs.forEach(([key, value]) => {
            if (value) query.set(key, value);
        });
        if (!query.toString()) return;
        const signature = query.toString();
        if (!candidates.some(item => item.toString() === signature)) candidates.push(query);
    };

    const zoneDevice = findDeviceForZone(farm, normalizedZone);
    if (normalizedZone === 'farm_master') {
        pushParams([['deviceId', farm?.farmMaster?.deviceId || farm?.deviceId || DEMO_COMMERCIAL_FARM_MASTER]]);
        return candidates;
    }

    if (zoneDevice?.deviceId) {
        pushParams([['deviceId', zoneDevice.deviceId], ['zoneId', normalizedZone]]);
        pushParams([['zoneId', normalizedZone]]);
        return candidates;
    }

    pushParams([['zoneId', normalizedZone]]);
    pushParams([['deviceId', DEMO_COMMERCIAL_ZONE_DEVICES[normalizedZone]], ['zoneId', normalizedZone]]);
    return candidates;
}

async function fetchLatestCommercialReading(zoneId = selectedZoneId) {
    const candidates = commercialSensorQueryCandidates(zoneId);
    for (const query of candidates) {
        try {
            const res = await fetchWithTimeout(`${API_BASE}/api/sensors/latest?${query.toString()}`, {}, 4500);
            const data = await res.json();
            if (hasRealSensorData(data?.reading)) {
                const cached = rememberCommercialReading(zoneId, data.reading, query.toString());
                return { ...data, reading: cached.reading, sourceQuery: query.toString() };
            }
        } catch (error) {
            console.warn('[CommercialPage] sensor query failed:', query.toString(), error.message);
        }
    }
    return getCachedCommercialReading(zoneId) || { reading: null };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

function commercialCacheScope(zoneId) {
    const farm = getCurrentFarm();
    const farmKey = farm?.id || farm?.backendFarmId || AppState.currentFarmId || 'commercial_demo';
    return `${farmKey}:${normalizeZoneId(zoneId) || zoneId || 'farm_master'}`;
}

function readCommercialReadingCache() {
    try {
        return JSON.parse(localStorage.getItem(LIVE_READING_CACHE_KEY)) || {};
    } catch (error) {
        return {};
    }
}

function writeCommercialReadingCache(cache) {
    try {
        localStorage.setItem(LIVE_READING_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.warn('[CommercialPage] could not save live reading cache:', error.message);
    }
}

function rememberCommercialReading(zoneId, reading, sourceQuery = '') {
    const normalized = normalizeSensorReading(reading);
    if (!hasRealSensorData(normalized)) return getCachedCommercialReading(zoneId) || { reading: null };
    const enriched = {
        ...normalized,
        _sourceQuery: sourceQuery,
        _fetchedAt: new Date().toISOString(),
        _stale: false,
    };
    const cache = readCommercialReadingCache();
    cache[commercialCacheScope(zoneId)] = enriched;
    writeCommercialReadingCache(cache);
    return { reading: enriched };
}

function getCachedCommercialReading(zoneId) {
    const reading = readCommercialReadingCache()[commercialCacheScope(zoneId)];
    return reading ? { reading: { ...reading, _stale: true } } : null;
}

function parseReadingDate(raw) {
    if (!raw) return null;
    if (raw instanceof Date) return raw;
    if (typeof raw === 'object') {
        if (typeof raw.toDate === 'function') return raw.toDate();
        if (raw._seconds) return new Date(raw._seconds * 1000);
        if (raw.seconds) return new Date(raw.seconds * 1000);
    }
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatReadingTime(reading) {
    const date = parseReadingDate(reading?._fetchedAt || reading?.createdAt || reading?.updatedAt || reading?.timestamp);
    if (!date) return 'Last updated --';
    return `Last updated ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

async function updateZoneOverview() {
    const farm = getCurrentFarm();
    const zones = buildCommercialZones(farm, resolveRack(farm));
    const entries = await Promise.all(zones.map(async zone => {
        try {
            const data = await fetchLatestCommercialReading(zone.id);
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
        const data = await fetchLatestCommercialReading(selectedZoneId);
        if (data?.reading) {
            applySensorReading(data.reading);
            fetchAIGlobalAdvice(data.reading);
        }
    } catch (error) {
        setAiOverview(`${zoneLabel(selectedZoneId)} is waiting for live data.`);
    }
}

function applySensorReading(r) {
    const normalized = normalizeSensorReading(r);
    if (!hasRealSensorData(normalized)) return;
    const temp = normalized.temperature;
    const humid = normalized.humidity;
    const light = normalized.lightRaw;
    const ph = normalized.ph;
    const water = normalized.waterDistanceCm;
    const gas = normalized.gasRaw;
    const ec = normalized.ec;
    const co2 = normalized.co2Ppm;
    const liveReading = {
        ...normalized,
    };

    AppState.latestReading = liveReading;
    AppState.currentReading = liveReading;
    AppState.latestReadingMeta = {
        fetchedAt: r._fetchedAt || r.createdAt || r.updatedAt || r.timestamp || new Date().toISOString(),
        sourceQuery: r._sourceQuery || '',
        stale: Boolean(r._stale),
    };
    AppState.sensors = {
        ...(AppState.sensors || {}),
        temp: { val: temp ?? '--' },
        humid: { val: humid ?? '--' },
        light: { val: light ?? '--' },
        ph: { val: ph ?? '--' },
        water: { val: water ?? '--' },
        nutrient: { val: gas ?? '--' },
        ec: { val: ec ?? '--' },
        co2: { val: co2 ?? '--' },
        flow: { val: normalized.waterFlowLpm ?? '--' },
        energy: { val: normalized.energyKwh ?? '--' },
    };

    setText('pro-temp', formatMetric(temp, '°C', 1));
    setText('pro-humid', formatMetric(humid, '%', 0));
    setText('pro-light', formatMetric(light, '', 0));
    setText('pro-ph', formatMetric(ph, '', 1));
    setText('pro-water', formatMetric(water, 'cm', 0));
    setText('pro-gas', formatMetric(gas, '', 0));
    setText('pro-ec', ec !== null ? `${formatMetric(ec, '', 2)} mS` : '--');
    setText('pro-co2', co2 !== null ? `${formatMetric(co2, '', 0)} ppm` : '--');
    if (CommercialFarmCanvas?.showOverview && !CommercialFarmCanvas.selectedRoot) {
        CommercialFarmCanvas.sensorSnapshot = { ...(CommercialFarmCanvas.sensorSnapshot || {}), ...liveReading };
        CommercialFarmCanvas.showOverview();
    }
}
async function fetchAIGlobalAdvice(currentData) {
    const prompt = `Current sensor data: ${JSON.stringify(currentData)}. Give one concise operations insight about risk, yield, energy, or automation.`;
    try {
        const aiContext = getCommercialAIContext();
        const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: prompt,
                mode: 'commercial',
                gardenState: { ...aiContext, latestReading: currentData || aiContext.latestReading },
            }),
        });
        const result = await res.json();
        setAiOverview(result.reply || result.response || 'Farm is operating normally.');
    } catch (e) {
        setAiOverview('AI Advisor offline. Sensor dashboard still available.');
    }
}

async function sendCommercialChat(forcedMessage = '') {
    const input = document.getElementById('commercialChatInput');
    const message = String(forcedMessage || input?.value || '').trim();
    if (!message) return;
    if (input) input.value = '';
    appendChat('user', message);
    appendChat('ai', 'Thinking...');

    try {
        const aiContext = getCommercialAIContext();
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
                gardenState: aiContext,
            }),
        });
        const result = await res.json();
        replaceLastAi(result.reply || result.response || 'I could not generate a recommendation yet.');
    } catch (error) {
        replaceLastAi('AI chat is offline, but sensor monitoring and tools still work.');
    }
}

function handleMascotAsk(event) {
    const input = document.getElementById('commercialChatInput');
    const context = event.detail || CommercialFarmCanvas.getSelectedContext?.();
    const label = context?.label || 'this commercial farm';
    const prompt = `SeedDown AI, explain ${label} using the current live data.`;
    const screen = document.getElementById('commercialScreen');
    if (screen?.classList.contains('panel-hidden')) {
        screen.classList.remove('panel-hidden');
        const button = document.getElementById('panelToggleBtn');
        if (button) button.textContent = 'Hide Panel';
        setTimeout(forceCommercialCanvasFullScreen, 120);
    }
    if (input) input.value = prompt;
    document.querySelector('.chat-section')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    sendCommercialChat(prompt);
}

function getCommercialAIContext() {
    const farm = getCurrentFarm();
    const selected3DObject = CommercialFarmCanvas.getSelectedContext?.() || null;
    const selectedObjectZoneId = normalizeZoneId(selected3DObject?.zoneId || selected3DObject?.zone || '');
    const activeZoneId = selectedObjectZoneId || selectedZoneId || resolveDefaultZone(farm);
    const latestReading =
        (activeZoneId && zoneSnapshots[activeZoneId])
        || AppState.latestReading
        || AppState.currentReading
        || null;
    const zoneDevice = activeZoneId ? findDeviceForZone(farm, activeZoneId) : null;

    return {
        farm,
        mode: 'commercial',
        selectedZoneId: activeZoneId,
        selectedZoneLabel: zoneLabel(activeZoneId),
        selected3DObject,
        latestReading,
        latestReadingMeta: AppState.latestReadingMeta || null,
        thresholds: farm?.thresholds || farm?.commercialThresholds || farm?.preferences?.thresholds || null,
        sensors: AppState.sensors || {},
        deviceAssignment: zoneDevice ? {
            serial: zoneDevice.serial || zoneDevice.deviceSerial || '',
            deviceId: zoneDevice.deviceId || '',
            targetId: zoneDevice.targetId || zoneDevice.zoneId || zoneDevice.zone || '',
            status: zoneDevice.status || 'active',
            active: zoneDevice.active !== false,
        } : null,
        commercialDevices: Array.isArray(farm?.commercialDevices) ? farm.commercialDevices : [],
        recentChatHistory: chatMessages
            .filter(m => m.role !== 'ai' || m.text !== 'Thinking...')
            .slice(-8),
        responseInstruction: 'Answer based on the selected 3D object, selected zone, latestReading, thresholds, and device assignment. If live data is missing, say you are waiting for live data instead of guessing.',
    };
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
        ? chatMessages.map(item => `<div class="chat-bubble ${item.role}">${item.role === 'ai' ? aiChatHTML(item.text) : escapeHTML(item.text)}</div>`).join('')
        : '<div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>';
    log.scrollTop = log.scrollHeight;
}

function setAiOverview(text) {
    const el = document.getElementById('ai-overview-text');
    if (el) el.innerHTML = aiAdvisorHTML(text);
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
            <div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;margin-bottom:12px;">
                <label style="display:block;">
                    <span style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">Serial</span>
                    <input id="assignSerial" value="SD-COM-ZON-01001" style="width:100%;padding:12px;border:1px solid #d7eef0;border-radius:14px;outline:none;background:#f7feff;">
                </label>
                <div style="display:flex;flex-direction:column;gap:6px;">
                    <button id="assignScanQr" type="button" style="height:42px;padding:0 13px;border:1px solid #99f6e4;border-radius:14px;background:#ecfeff;color:#0f766e;font-weight:950;cursor:pointer;">Take QR Photo</button>
                    <button id="assignUploadQr" type="button" style="height:38px;padding:0 13px;border:1px solid #d7eef0;border-radius:14px;background:#fff;color:#0f766e;font-weight:900;cursor:pointer;">Upload QR Image</button>
                </div>
                <input id="assignQrInput" type="file" accept="image/*" style="display:none;">
                <input id="assignQrCameraInput" type="file" accept="image/*" capture="environment" style="display:none;">
            </div>
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">Zone</label>
            <select id="assignZone" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
                <option value="farm_master">Farm Master</option>
                <option value="zone_A">Zone A</option>
                <option value="zone_B">Zone B</option>
                <option value="zone_C">Zone C</option>
            </select>
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">WiFi SSID</label>
            <input id="assignWifi" placeholder="Farm WiFi" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
            <button id="assignSubmit" style="width:100%;padding:13px;border:none;border-radius:14px;background:#0f766e;color:white;font-weight:950;cursor:pointer;">Reassign Active Device</button>
            <div id="assignStatus" style="font-size:12px;color:#64748b;line-height:1.45;margin-top:10px;">Scan a replacement QR or enter a serial. The selected target keeps one active device; the old device is preserved as replaced.</div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('assignClose').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', event => { if (event.target === overlay) overlay.remove(); });
    document.getElementById('assignSubmit').addEventListener('click', assignCommercialDevice);
    document.getElementById('assignScanQr')?.addEventListener('click', () => document.getElementById('assignQrCameraInput')?.click());
    document.getElementById('assignUploadQr')?.addEventListener('click', () => document.getElementById('assignQrInput')?.click());
    const handleQrFile = async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const payload = await decodeAssignQrFile(file);
            const serial = normalizeQrSerial(payload);
            document.getElementById('assignSerial').value = serial;
            document.getElementById('assignZone').value = inferAssignTarget(serial);
            document.getElementById('assignStatus').style.color = '#0f766e';
            document.getElementById('assignStatus').textContent = `QR scanned: ${serial}`;
        } catch (error) {
            document.getElementById('assignStatus').style.color = '#dc2626';
            document.getElementById('assignStatus').textContent = error.message || 'Could not read QR code';
        } finally {
            event.target.value = '';
        }
    };
    document.getElementById('assignQrInput')?.addEventListener('change', handleQrFile);
    document.getElementById('assignQrCameraInput')?.addEventListener('change', handleQrFile);
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
        const role = zoneId === 'farm_master' ? 'farm_master' : 'zone_node';
        const response = await fetch(`${API_BASE}/api/devices/reassign`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                serial,
                wifi_ssid: wifi,
                accountType: inferCommercialAccountType(serial, role),
                farmId: AppState.currentFarmId || 'farm_commercial_001',
                targetId: zoneId,
                role,
                zoneId,
            }),
        });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || 'Device assignment failed');
        const farm = getCurrentFarm() || {};
        farm.commercialDevices = upsertCommercialDevice(farm.commercialDevices || [], data.device, data.replacedDevices || [], zoneId);
        if (zoneId === 'farm_master') farm.farmMaster = data.device;
        else farm.zoneId = zoneId;
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
        status.textContent = `Active device: ${data.device.deviceId}. Replaced ${data.replacedDevices?.length || 0} old device(s).`;
    } catch (error) {
        status.style.color = '#dc2626';
        status.textContent = error.message;
    } finally {
        button.disabled = false;
        button.textContent = 'Reassign Active Device';
    }
}

function openZoneCameraModal() {
    const existing = document.getElementById('zoneCameraOverlay');
    if (existing) existing.remove();

    const farm = getCurrentFarm();
    const zones = commercialZonesForFarm(farm);
    const zone = zones.find(item => item.id === selectedZoneId) || zones[0];
    const image = getZoneCameraSnapshot(farm, zone?.id) || farm?.photoPreview || farm?.image || farm?.thumbnail || '';
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
                        <video id="zoneCameraVideo" autoplay playsinline muted style="display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#0f172a;"></video>
                        <canvas id="zoneCameraCanvas" style="display:none;"></canvas>
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
                        ${cameraMetric('Temp', formatMetric(normalizeSensorReading(reading || {}).temperature, 'C', 1))}
                        ${cameraMetric('Humidity', formatMetric(normalizeSensorReading(reading || {}).humidity, '%', 0))}
                        ${cameraMetric('Light', formatMetric(normalizeSensorReading(reading || {}).lightRaw, '', 0))}
                        ${cameraMetric('Plant count', `${zone?.planted ?? plantCount(farm)} plants`)}
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;">
                            <button id="cameraStartBtn" style="padding:13px;border:1px solid #99f6e4;border-radius:14px;background:#ecfeff;color:#0f766e;font-weight:950;cursor:pointer;">Start camera</button>
                            <button id="cameraCaptureBtn" style="padding:13px;border:none;border-radius:14px;background:#166534;color:#fff;font-weight:950;cursor:pointer;">Capture frame</button>
                        </div>
                        <button id="cameraStopBtn" style="padding:12px;border:1px solid #dbe7dc;border-radius:14px;background:#fff;color:#64748b;font-weight:900;cursor:pointer;">Stop camera</button>
                        <div id="cameraStatus" style="font-size:12px;color:#64748b;line-height:1.45;">Use browser camera for the demo, or keep the latest farm photo/captured snapshot as fallback. Captured frames are saved to the selected zone for disease analysis context.</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const closeCamera = () => {
        stopZoneCameraStream();
        overlay.remove();
    };
    document.getElementById('cameraClose')?.addEventListener('click', closeCamera);
    overlay.addEventListener('click', event => { if (event.target === overlay) closeCamera(); });
    document.getElementById('cameraStartBtn')?.addEventListener('click', () => startZoneCamera());
    document.getElementById('cameraCaptureBtn')?.addEventListener('click', captureZoneCameraFrame);
    document.getElementById('cameraStopBtn')?.addEventListener('click', () => {
        stopZoneCameraStream();
        document.getElementById('cameraStatus').textContent = 'Browser camera stopped. The latest saved snapshot is still available for this zone.';
    });
    document.getElementById('cameraZoneSelect')?.addEventListener('change', event => {
        selectedZoneId = event.target.value;
        AppState.currentZoneId = selectedZoneId;
        stopZoneCameraStream();
        overlay.remove();
        updateZoneSelectionUI();
        openZoneCameraModal();
    });
}

async function startZoneCamera() {
    const status = document.getElementById('cameraStatus');
    const video = document.getElementById('zoneCameraVideo');
    if (!navigator.mediaDevices?.getUserMedia) {
        if (status) status.textContent = 'This browser does not support direct camera preview. Using saved snapshot/photo fallback.';
        return;
    }

    stopZoneCameraStream();
    try {
        activeZoneCameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
        });
        if (video) {
            video.srcObject = activeZoneCameraStream;
            video.style.display = 'block';
            await video.play().catch(() => {});
        }
        document.querySelector('[data-camera-placeholder]')?.setAttribute('style', 'display:none;');
        if (status) status.textContent = 'Browser camera is live. Capture a frame to save it as this zone camera snapshot.';
    } catch (error) {
        if (status) status.textContent = `Camera unavailable: ${error.message}. Saved snapshot/photo fallback is still available.`;
    }
}

function stopZoneCameraStream() {
    if (activeZoneCameraStream) {
        activeZoneCameraStream.getTracks().forEach(track => track.stop());
        activeZoneCameraStream = null;
    }
    const video = document.getElementById('zoneCameraVideo');
    if (video) {
        video.pause();
        video.srcObject = null;
        video.style.display = 'none';
    }
}

function captureZoneCameraFrame() {
    const status = document.getElementById('cameraStatus');
    const video = document.getElementById('zoneCameraVideo');
    const canvas = document.getElementById('zoneCameraCanvas');
    const zoneId = document.getElementById('cameraZoneSelect')?.value || selectedZoneId;
    if (!video || !canvas || !activeZoneCameraStream || !video.videoWidth) {
        document.getElementById('cameraTimestamp').textContent = `Live snapshot · ${new Date().toLocaleTimeString()}`;
        if (status) status.textContent = 'No browser camera frame is active yet. Start camera first, or continue using the saved snapshot/photo fallback.';
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    saveZoneCameraSnapshot(zoneId, dataUrl);
    updateCameraFeedSnapshot(dataUrl);
    document.getElementById('cameraTimestamp').textContent = `Captured · ${new Date().toLocaleTimeString()}`;
    if (status) status.textContent = 'Frame saved to this zone. Disease Analysis can use the latest captured snapshot as context.';
}

function getZoneCameraSnapshot(farm, zoneId) {
    if (!zoneId) return '';
    const farmKey = farm?.id || AppState.currentFarmId || 'commercial_demo';
    if (farm?.zoneCameraSnapshots?.[zoneId]) return farm.zoneCameraSnapshots[zoneId];
    try {
        const saved = JSON.parse(localStorage.getItem(LAST_CAMERA_SNAPSHOT_KEY) || '{}');
        return saved?.farmKey === farmKey && saved?.zoneId === zoneId ? saved.dataUrl : '';
    } catch {
        return '';
    }
}

function saveZoneCameraSnapshot(zoneId, dataUrl) {
    const farm = getCurrentFarm() || {};
    const nextFarm = {
        ...farm,
        zoneCameraSnapshots: {
            ...(farm.zoneCameraSnapshots || {}),
            [zoneId]: dataUrl,
        },
        lastCameraZoneId: zoneId,
        lastCameraSnapshotAt: new Date().toISOString(),
    };
    AppState.currentFarm = nextFarm;
    persistCurrentFarm(nextFarm);
    try {
        localStorage.setItem(LAST_CAMERA_SNAPSHOT_KEY, JSON.stringify({
            farmKey: nextFarm.id || AppState.currentFarmId || 'commercial_demo',
            zoneId,
            dataUrl,
            capturedAt: nextFarm.lastCameraSnapshotAt,
        }));
    } catch (error) {
        console.warn('[CommercialPage] could not save camera snapshot:', error.message);
    }
}

function updateCameraFeedSnapshot(dataUrl) {
    const feed = document.getElementById('cameraFeed');
    const video = document.getElementById('zoneCameraVideo');
    if (feed) feed.style.background = `url(${dataUrl}) center/cover`;
    if (video) video.style.display = 'none';
    document.querySelector('[data-camera-placeholder]')?.setAttribute('style', 'display:none;');
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

function inferCommercialAccountType(serial = '', role = 'zone_node') {
    const normalized = String(serial).toUpperCase();
    if (role === 'farm_master' || normalized.includes('FRM') || normalized.includes('MST')) return 'commercial_farm_master';
    if (normalized.includes('FZK')) return 'commercial_farm_zone';
    if (normalized.includes('ZNP')) return 'commercial_zone_pro';
    if (normalized.includes('ZNB')) return 'commercial_zone_basic';
    return 'commercial_zone';
}

function inferAssignTarget(serial = '') {
    const normalized = String(serial).toUpperCase();
    return normalized.includes('FRM') || normalized.includes('MST') ? 'farm_master' : 'zone_A';
}

function serialFromQrValue(value) {
    const raw = String(value || '').trim();
    const mapped = DEMO_QR_TOKEN_SERIALS[raw.toLowerCase()];
    return String(mapped || raw).trim().toUpperCase();
}

function normalizeQrSerial(payload) {
    if (typeof payload === 'string') {
        try {
            const parsed = JSON.parse(payload);
            return normalizeQrSerial(parsed);
        } catch {
            return serialFromQrValue(payload);
        }
    }
    const serial = payload?.serial || payload?.deviceSerial || payload?.qrSerial || payload?.token || payload?.deviceToken || payload?.id;
    if (!serial) throw new Error('QR does not contain a SeedDown serial');
    return serialFromQrValue(serial);
}

function decodeAssignQrFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read QR image'));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('Could not load QR image'));
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (!code?.data) reject(new Error('No QR code found in image'));
                else resolve(code.data);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

function upsertCommercialDevice(devices, nextDevice, replacedDevices = [], targetId = nextDevice?.targetId || nextDevice?.zoneId) {
    const normalizedTarget = normalizeZoneId(targetId);
    const replacedIds = new Set(replacedDevices.map(device => device.deviceId));
    const activeNext = {
        ...nextDevice,
        targetId,
        role: targetId === 'farm_master' ? 'farm_master' : (nextDevice.role || 'zone_node'),
        active: true,
        status: 'assigned',
        assignedAt: new Date().toISOString(),
    };
    return [
        ...devices.map(device => {
            const sameTarget = normalizeZoneId(device.targetId || device.zoneId || device.zone) === normalizedTarget;
            if (device.deviceId === nextDevice.deviceId) return null;
            if (replacedIds.has(device.deviceId) || sameTarget) {
                return {
                    ...device,
                    active: false,
                    status: 'replaced',
                    replacedBy: nextDevice.deviceId,
                    replacedAt: new Date().toISOString(),
                };
            }
            return device;
        }).filter(Boolean),
        activeNext,
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
    const reading = zoneSnapshots[zone.id] ? normalizeSensorReading(zoneSnapshots[zone.id]) : null;
    const health = zoneHealth(reading, getCurrentFarm()?.thresholds || {});
    const deviceLabel = zone.deviceId ? zone.deviceId.replace(/^dev_/, '') : 'unassigned';
    const latest = reading
        ? `${formatSensorMini(reading.temperature, '°C')} · ${formatSensorMini(reading.humidity, '%')} · pH ${formatSensorMini(reading.ph, '')} · ${formatReadingTime(reading)}${reading._stale ? ' · cached' : ''}`
        : 'waiting for first reading';

    return `
        <button class="commercial-zone-card ${health.level}" data-zone="${zone.id}" type="button">
            <div class="zone-card-head">
                <span>${escapeHTML(zone.label)}</span>
                <b>${health.label}</b>
            </div>
            <strong>${escapeHTML(zone.crop)}</strong>
            <div class="zone-card-meta">${zone.planted}/${zone.capacity} slots · ${escapeHTML(deviceLabel)}</div>
            <div class="zone-meter"><i style="width:${zone.occupied}%"></i></div>
            <small>${escapeHTML(latest)}</small>
            <div style="margin-top:8px;font-size:10px;font-weight:900;color:#047857;">→ Tap to drill into zone</div>
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
            clearInterval(AppState.proInterval);
            showScreen('zone-detail', {
                zoneId: card.getAttribute('data-zone'),
                from: 'dash-c',
            });
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
    const summary = commercialDisplaySummary(farm, rack);
    const capacity = Math.max(1, Math.ceil((summary.total || rack?.total || 9) / baseZones.length));
    const devices = Array.isArray(farm?.commercialDevices) ? farm.commercialDevices : [];

    return baseZones.map((base, index) => {
        const zonePlants = plants.filter((plant, plantIndex) => {
            const explicitZone = normalizeZoneId(plant.zoneId || plant.zone || plant.area);
            if (explicitZone) return explicitZone === base.id;
            return plantIndex % baseZones.length === index;
        });
        const device = devices.find(item =>
            item.status !== 'replaced' &&
            item.active !== false &&
            normalizeZoneId(item.targetId || item.zoneId || item.zone) === base.id
        );
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

function commercialDisplaySummary(farm, rack) {
    const explicitZones = Array.isArray(farm?.commercialStructure?.zones)
        ? farm.commercialStructure.zones
        : Array.isArray(farm?.zones)
        ? farm.zones
        : [];
    const planted = plantCount(farm);

    if (!explicitZones.length) {
        const total = Number.parseInt(farm?.plantSlots, 10) || rack?.total || planted || 0;
        return {
            label: rack?.label || 'Commercial Farm',
            planted,
            total: Math.max(total, planted),
        };
    }

    const zoneCount = explicitZones.length;
    const zoneCapacity = explicitZones.reduce((sum, zone) => {
        const count = Number.parseInt(zone.capacity ?? zone.slots ?? zone.plantSlots ?? zone.count ?? 0, 10);
        return sum + (Number.isFinite(count) && count > 0 ? count : 0);
    }, 0);
    const storedCapacity = Number.parseInt(farm?.plantSlots, 10) || Number.parseInt(farm?.capacity, 10) || 0;
    const total = Math.max(zoneCapacity, storedCapacity, planted, zoneCount * 12);

    return {
        label: `${zoneCount}-Zone Commercial Farm`,
        planted,
        total,
    };
}

function commercialZonesForFarm(farm) {
    const zones = Array.isArray(farm?.commercialStructure?.zones)
        ? farm.commercialStructure.zones
        : Array.isArray(farm?.zones)
        ? farm.zones
        : [];
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
    return devices.find(item =>
        item.status !== 'replaced' &&
        item.active !== false &&
        normalizeZoneId(item.targetId || item.zoneId || item.zone) === zoneId
    )
        || (normalizeZoneId(farm?.zoneId) === zoneId ? farm : null);
}

function normalizeZoneId(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';
    // Single letter or "zone X" format — covers A through Z
    const singleLetter = raw.match(/^([a-z])$/);
    const zoneWord = raw.match(/^zone[_ ]([a-z])$/);
    const letter = singleLetter?.[1] || zoneWord?.[1];
    if (letter) return `zone_${letter.toUpperCase()}`;
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
    if (!reading || !hasRealSensorData(reading)) return { level: 'idle', label: 'No Data' };
    const gasLimit = toFiniteNumber(thresholds.gasDangerThreshold) ?? 3000;
    const tempMin = toFiniteNumber(thresholds.tempMin) ?? 18;
    const tempMax = toFiniteNumber(thresholds.tempMax) ?? 35;
    const phMin = toFiniteNumber(thresholds.phMin) ?? 5.5;
    const phMax = toFiniteNumber(thresholds.phMax) ?? 6.8;
    const dark = toFiniteNumber(thresholds.darkThreshold) ?? 1500;
    const waterLow = toFiniteNumber(thresholds.waterLowCm) ?? 20;
    const r = normalizeSensorReading(reading);

    if ((r.gasRaw !== null && r.gasRaw > gasLimit) || (r.temperature !== null && r.temperature > tempMax + 3)) {
        return { level: 'critical', label: 'Critical' };
    }
    if (
        (r.temperature !== null && (r.temperature < tempMin || r.temperature > tempMax)) ||
        (r.ph !== null && (r.ph < phMin || r.ph > phMax)) ||
        (r.lightRaw !== null && r.lightRaw < dark) ||
        (r.waterDistanceCm !== null && r.waterDistanceCm > waterLow)
    ) {
        return { level: 'warning', label: 'Warning' };
    }
    return { level: 'healthy', label: 'Healthy' };
}

function formatSensorMini(value, suffix = '') {
    const number = toFiniteNumber(value);
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
        <div data-camera-placeholder style="position:absolute;inset:0;display:grid;place-items:center;padding:28px;">
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
.fm-tile {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 14px;
    padding: 10px 12px;
    text-align: left;
    cursor: pointer;
    transition: background .15s, border-color .15s, transform .15s;
}
.fm-tile:hover {
    background: #dcfce7;
    border-color: #86efac;
    transform: translateY(-1px);
}
.fm-tile span {
    display: block;
    font-size: 9px;
    font-weight: 950;
    color: #15803d;
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-bottom: 6px;
}
.fm-tile strong {
    display: block;
    font-size: 16px;
    font-weight: 950;
    color: #14532d;
}

        .advisor-text { color: #334155; font-size: 13px; line-height: 1.45; }
        .ai-frame-mini {
            border: 1px solid #ccfbf1;
            background: #f8fffd;
            border-radius: 14px;
            padding: 10px 11px;
        }
        .ai-frame-mini-title {
            color: #0f766e;
            font-size: 10px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .08em;
        }
        .ai-frame-mini-body {
            margin-top: 4px;
            color: #334155;
            font-size: 12px;
            font-weight: 750;
            line-height: 1.35;
        }
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
        .chat-bubble.ai .ai-frame {
            min-width: min(270px, 100%);
        }
        .ai-frame-head {
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:8px;
            margin-bottom:8px;
        }
        .ai-frame-head strong {
            color:#0f172a;
            font-size:12px;
            line-height:1.2;
        }
        .ai-frame-head span {
            flex-shrink:0;
            border-radius:999px;
            background:#ccfbf1;
            color:#0f766e;
            padding:3px 7px;
            font-size:9px;
            font-weight:950;
            text-transform:uppercase;
        }
        .ai-frame-metrics {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:6px;
            margin-bottom:8px;
        }
        .ai-frame-metrics div {
            border:1px solid #d7f7ef;
            border-radius:10px;
            background:#fff;
            padding:6px 7px;
        }
        .ai-frame-metrics b {
            display:block;
            color:#64748b;
            font-size:8px;
            font-weight:950;
            text-transform:uppercase;
        }
        .ai-frame-metrics span {
            display:block;
            margin-top:2px;
            color:#0f766e;
            font-size:11px;
            font-weight:900;
            word-break:break-word;
        }
        .ai-frame ul {
            margin:0;
            padding-left:16px;
            display:flex;
            flex-direction:column;
            gap:4px;
        }
        .ai-frame li {
            color:#334155;
            font-size:11px;
            line-height:1.32;
        }
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
            top: 148px !important;
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
        .commercial-command-screen .cf-mascot-bubble {
            z-index: 14 !important;
            left: 18px !important;
            right: auto !important;
            bottom: 82px !important;
            width: min(330px, calc(100vw - 470px)) !important;
            min-width: 260px !important;
        }
        @media (max-width: 760px) {
            .commercial-top-shell { left: 12px; top: 12px; }
            .commercial-title-card { min-width: 0; width: calc(100vw - 120px); }
            .commercial-title-row { align-items:flex-start; flex-direction:column; }
            .commercial-command-screen .cf-info-panel {
                top: 164px !important;
                left: 12px !important;
                width: calc(100vw - 24px) !important;
                min-width: 0 !important;
                max-width: 320px !important;
                max-height: 34dvh !important;
                overflow: auto !important;
                padding: 10px 11px !important;
                border-radius: 14px !important;
            }
            .commercial-command-screen .cf-panel-kicker {
                font-size: 8px !important;
                margin-bottom: 3px !important;
            }
            .commercial-command-screen .cf-panel-title {
                font-size: 14px !important;
                line-height: 1.05 !important;
            }
            .commercial-command-screen .cf-panel-sub {
                font-size: 10px !important;
                margin-top: 3px !important;
            }
            .commercial-command-screen .cf-mini-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                gap: 6px !important;
                margin-top: 8px !important;
            }
            .commercial-command-screen .cf-mini-metric {
                padding: 6px !important;
                border-radius: 10px !important;
            }
            .commercial-command-screen .cf-mini-metric span {
                font-size: 7px !important;
            }
            .commercial-command-screen .cf-mini-metric strong {
                font-size: 11px !important;
                margin-top: 2px !important;
            }
            .commercial-command-screen .cf-plant-list {
                gap: 5px !important;
                margin-top: 8px !important;
                max-height: 74px !important;
            }
            .commercial-command-screen .cf-plant-list span {
                padding: 6px 7px !important;
                font-size: 10px !important;
            }
            .commercial-command-screen .cf-mascot-bubble {
                left: 12px !important;
                right: 12px !important;
                bottom: 76px !important;
                width: auto !important;
                min-width: 0 !important;
            }
            .commercial-panel-toggle { top: auto; bottom: 16px; right: 16px; }
            .commercial-ops-panel { top: 94px; left: 12px; right: 12px; bottom: 70px; width: auto; }
            .commercial-command-screen.panel-hidden .commercial-ops-panel { transform: translateY(calc(100% + 90px)); }
            .ops-sensor-grid { grid-template-columns: repeat(2, 1fr); }
            .ops-tool-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 420px) {
            .commercial-command-screen .cf-info-panel {
                top: 154px !important;
                width: calc(100vw - 20px) !important;
                max-width: 286px !important;
                max-height: 30dvh !important;
            }
            .commercial-command-screen .cf-mini-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
        }
    `;
    document.head.appendChild(style);
}
