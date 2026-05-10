import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';

const PROFILE_KEY = 'farm_profile';
const FARMS_KEY = 'user_farms';
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

function farmProfileKey(farmId) {
    return `farm_profile_${farmId}`;
}

function defaultControls() {
    return {
        name: 'UTM Farmer',
        email: 'farmer@seeddown.com',
        farmName: AppState.farmName || 'Commercial Farm',
        deviceId: 'farm_001',
        sensorIntervalMinutes: 60,
        soilDryThreshold: 1800,
        gasDangerThreshold: 2500,
        tempMin: 18,
        tempMax: 35,
        phMin: 5.5,
        phMax: 6.5,
        lightThreshold: 1500,
        wateringDuration: 10,
        notifications: true,
        autoWater: true,
        ecoMode: false,
    };
}

export function render() {
    const container = document.getElementById('screenContainer');
    const farm = getCurrentFarm();
    const profile = { ...defaultControls(), ...(loadProfile(AppState.currentFarmId) || {}) };

    container.innerHTML = `
        <div class="screen active" id="controlScreen">
            <div class="topbar">
                <button id="controlBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;color:var(--text);">←</button>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">IoT Control</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.06em;">${escapeHTML(farm?.name || AppState.farmName || 'Commercial Farm')}</div>
                </div>
                <button id="controlSaveBtn" style="background:var(--accent);color:white;border:none;padding:8px 12px;border-radius:10px;font-size:0.75rem;font-weight:800;cursor:pointer;">Save</button>
            </div>

            <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px;">
                <div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="display:flex;gap:12px;align-items:center;">
                        <div style="width:44px;height:44px;border-radius:14px;background:var(--accent-l);display:flex;align-items:center;justify-content:center;font-size:24px;">🎛️</div>
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;">Device thresholds</div>
                            <div style="font-size:13px;color:var(--sub);line-height:1.4;">These values change how the backend creates ESP32 commands on the next sensor cycle.</div>
                        </div>
                    </div>
                    <div style="margin-top:12px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                        <label style="font-size:0.72rem;font-weight:800;color:var(--sub);display:block;margin-bottom:5px;">Device ID</label>
                        <input id="controlDeviceId" value="${escapeAttr(profile.deviceId)}" style="width:100%;border:none;background:transparent;color:var(--text);font-weight:800;outline:none;font-family:'DM Mono',monospace;">
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">WATER + ROOT ZONE</div>
                    ${rangeControl('Soil Dry Threshold', 'controlSoil', 'soilVal', profile.soilDryThreshold, 500, 3000, 100, 'raw', 'Lower means easier to trigger WATER_ON')}
                    ${numberPair('pH Range', 'controlPhMin', 'controlPhMax', profile.phMin, profile.phMax, 4.0, 8.0, 0.1, 'pH outside this range creates PH_WARNING')}
                    ${rangeControl('Watering Duration', 'controlWaterDur', 'waterDurVal', profile.wateringDuration, 3, 60, 1, 's', 'Duration sent with WATER_ON command')}
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">ENVIRONMENT LIMITS</div>
                    ${numberPair('Temperature Range', 'controlTempMin', 'controlTempMax', profile.tempMin, profile.tempMax, 0, 60, 0.5, 'Temperature outside this range creates BUZZER_ON')}
                    ${rangeControl('Light Dark Threshold', 'controlLight', 'lightVal', profile.lightThreshold, 200, 4000, 100, 'raw', 'Light below this value creates LIGHT_ON')}
                    ${rangeControl('Gas Danger Threshold', 'controlGas', 'gasVal', profile.gasDangerThreshold, 500, 4095, 100, 'raw', 'Gas above this value creates BUZZER_ON')}
                </div>

                <button id="controlSyncBtn" style="width:100%;padding:14px;border:none;border-radius:var(--radius);background:var(--accent);color:white;flex-shrink:0;font-weight:800;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span id="controlSyncIcon">☁️</span> Sync Thresholds to IoT
                </button>

                <button id="controlLoadBtn" style="width:100%;padding:13px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--accent);font-weight:800;cursor:pointer;">Load Current Device Settings</button>

                <div style="height:10px;"></div>
            </div>
        </div>
    `;

    bindEvents();
    fetchCurrentPreferences(false);
}

function bindEvents() {
    document.getElementById('controlBackBtn')?.addEventListener('click', () => showScreen('dash-c'));
    document.getElementById('controlSaveBtn')?.addEventListener('click', saveControls);
    document.getElementById('controlSyncBtn')?.addEventListener('click', syncControls);
    document.getElementById('controlLoadBtn')?.addEventListener('click', () => fetchCurrentPreferences(true));

    slider('controlSoil', 'soilVal', v => `${v} raw`);
    slider('controlWaterDur', 'waterDurVal', v => `${v}s`);
    slider('controlLight', 'lightVal', v => `${v} raw`);
    slider('controlGas', 'gasVal', v => `${v} raw`);
}

async function fetchCurrentPreferences(showResult) {
    const deviceId = value('controlDeviceId') || 'farm_001';
    try {
        const res = await fetch(`${API_BASE}/api/sensors/preferences?deviceId=${encodeURIComponent(deviceId)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const pref = await res.json();
        applyPreferences(pref);
        if (showResult) showToast('success', 'Loaded current device settings');
    } catch (err) {
        if (showResult) showToast('warning', `Could not load device settings: ${err.message}`);
        console.warn('[ControlPage] Load preferences failed:', err);
    }
}

function applyPreferences(pref) {
    if (!pref) return;
    setInput('controlSoil', pref.soilDryThreshold);
    setText('soilVal', `${pref.soilDryThreshold ?? value('controlSoil')} raw`);
    setInput('controlGas', pref.gasDangerThreshold);
    setText('gasVal', `${pref.gasDangerThreshold ?? value('controlGas')} raw`);
    setInput('controlTempMin', pref.tempMin);
    setInput('controlTempMax', pref.tempMax);
    setInput('controlPhMin', pref.phMin);
    setInput('controlPhMax', pref.phMax);
    setInput('controlLight', pref.darkThreshold);
    setText('lightVal', `${pref.darkThreshold ?? value('controlLight')} raw`);
    setInput('controlWaterDur', pref.wateringDurationSeconds);
    setText('waterDurVal', `${pref.wateringDurationSeconds ?? value('controlWaterDur')}s`);
}

function saveControls() {
    const profile = { ...defaultControls(), ...(loadProfile(AppState.currentFarmId) || {}), ...collectControls() };
    saveProfile(profile, AppState.currentFarmId);
    showToast('success', 'Control thresholds saved locally');
}

async function syncControls() {
    const controls = collectControls();
    const icon = document.getElementById('controlSyncIcon');
    const btn = document.getElementById('controlSyncBtn');
    btn.disabled = true;
    icon.textContent = '⏳';

    saveProfile({ ...defaultControls(), ...(loadProfile(AppState.currentFarmId) || {}), ...controls }, AppState.currentFarmId);

    const payload = {
        deviceId: controls.deviceId,
        soilDryThreshold: controls.soilDryThreshold,
        gasDangerThreshold: controls.gasDangerThreshold,
        tempMin: controls.tempMin,
        tempMax: controls.tempMax,
        phMin: controls.phMin,
        phMax: controls.phMax,
        darkThreshold: controls.lightThreshold,
        wateringDurationSeconds: controls.wateringDuration,
    };

    try {
        const res = await fetch(`${API_BASE}/api/sensors/preferences`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        icon.textContent = '✅';
        showToast('success', 'Thresholds synced. ESP32 will use them next cycle.');
    } catch (err) {
        icon.textContent = '⚠️';
        showToast('error', `Sync failed: ${err.message}. Saved locally.`);
        console.warn('[ControlPage] Sync failed:', err);
    } finally {
        setTimeout(() => {
            icon.textContent = '☁️';
            btn.disabled = false;
        }, 2000);
    }
}

function collectControls() {
    return {
        deviceId: value('controlDeviceId') || 'farm_001',
        soilDryThreshold: intValue('controlSoil', 1800),
        gasDangerThreshold: intValue('controlGas', 2500),
        tempMin: floatValue('controlTempMin', 18),
        tempMax: floatValue('controlTempMax', 35),
        phMin: floatValue('controlPhMin', 5.5),
        phMax: floatValue('controlPhMax', 6.5),
        lightThreshold: intValue('controlLight', 1500),
        wateringDuration: intValue('controlWaterDur', 10),
    };
}

function rangeControl(label, inputId, labelId, value, min, max, step, unit, hint) {
    return `
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px;">
                <label style="font-size:0.8rem;font-weight:700;color:var(--text);">${label}</label>
                <span id="${labelId}" style="font-size:0.8rem;font-weight:800;color:var(--accent);font-family:'DM Mono',monospace;">${value} ${unit}</span>
            </div>
            <input type="range" id="${inputId}" min="${min}" max="${max}" step="${step}" value="${value}" style="width:100%;accent-color:var(--accent);">
            <div style="font-size:0.67rem;color:var(--muted);margin-top:4px;">${hint}</div>
        </div>`;
}

function numberPair(label, minId, maxId, minValue, maxValue, min, max, step, hint) {
    return `
        <div style="margin-bottom:16px;">
            <label style="font-size:0.8rem;font-weight:700;color:var(--text);">${label}</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
                <div>
                    <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Min</div>
                    <input type="number" id="${minId}" value="${minValue}" min="${min}" max="${max}" step="${step}" style="${numberInputStyle()}">
                </div>
                <div>
                    <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Max</div>
                    <input type="number" id="${maxId}" value="${maxValue}" min="${min}" max="${max}" step="${step}" style="${numberInputStyle()}">
                </div>
            </div>
            <div style="font-size:0.67rem;color:var(--muted);margin-top:4px;">${hint}</div>
        </div>`;
}

function numberInputStyle() {
    return 'width:100%;padding:9px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);font-family:\'DM Mono\',monospace;font-size:0.85rem;color:var(--text);outline:none;';
}

function getCurrentFarm() {
    const saved = loadSavedFarms();
    return AppState.currentFarm
        || saved.find(farm => farm.id === AppState.currentFarmId)
        || saved[saved.length - 1]
        || null;
}

function loadSavedFarms() {
    try {
        return JSON.parse(localStorage.getItem(FARMS_KEY)) || [];
    } catch {
        return [];
    }
}

function loadProfile(farmId) {
    try {
        if (farmId) {
            const perFarm = localStorage.getItem(farmProfileKey(farmId));
            if (perFarm) return JSON.parse(perFarm);
        }
        const saved = localStorage.getItem(PROFILE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function saveProfile(data, farmId) {
    try {
        if (farmId) localStorage.setItem(farmProfileKey(farmId), JSON.stringify(data));
        localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: data.name, email: data.email }));
    } catch {}
}

function slider(inputId, labelId, format) {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    if (!input || !label) return;
    input.addEventListener('input', () => { label.textContent = format(input.value); });
}

function setInput(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.value = value;
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function value(id) {
    return document.getElementById(id)?.value ?? '';
}

function intValue(id, fallback) {
    const parsed = Number.parseInt(value(id), 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function floatValue(id, fallback) {
    const parsed = Number.parseFloat(value(id));
    return Number.isFinite(parsed) ? parsed : fallback;
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
    return escapeHTML(value).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
