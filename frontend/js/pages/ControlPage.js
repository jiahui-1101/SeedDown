import { API_BASE } from '../utils/apiBase.js';
import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';
import { conciseAIText } from '../utils/aiFormat.js';

const PROFILE_KEY = 'farm_profile';
const FARMS_KEY = 'user_farms';

const MASCOT_VISIBILITY_KEY = 'seeddown_ai_mascot_enabled';
const DEMO_COMMERCIAL_ZONE_DEVICES = {
    zone_A: 'commercial-zone-node-1',
    zone_B: 'commercial-zone-node-2',
    zone_C: 'commercial-zone-node-3',
    zone_D: 'commercial-zone-node-4',
    zone_E: 'commercial-zone-node-5',
    zone_F: 'commercial-zone-node-6',
};
const SUPPORTED_MANUAL_COMMANDS = ['WATER_ON', 'FAN_ON', 'BUZZER_ON', 'GAS_ALERT', 'PH_WARNING', 'FERT_ALERT', 'CO2_LOW', 'NO_ACTION'];

function farmProfileKey(farmId) {
    return `farm_profile_${farmId}`;
}

function isMascotEnabled() {
    return localStorage.getItem(MASCOT_VISIBILITY_KEY) !== 'false';
}

function defaultControls() {
    return {
        name: 'UTM Farmer',
        email: 'farmer@seeddown.com',
        farmName: AppState.farmName || 'Commercial Farm',
        deviceId: '',
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
    const zones = commercialZonesForControl(farm);
    const farmThresholds = { ...(farm?.farmThresholds || {}), ...profile };

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
                            <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;">Commercial threshold control</div>
                            <div style="font-size:13px;color:var(--sub);line-height:1.4;">Farm Master and Zone thresholds match the New Field AI threshold setup.</div>
                        </div>
                    </div>
                    <div style="margin-top:12px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                        <label style="font-size:0.72rem;font-weight:800;color:var(--sub);display:block;margin-bottom:5px;">Device ID</label>
                        <input id="controlDeviceId" value="${escapeAttr(profile.deviceId)}" style="width:100%;border:none;background:transparent;color:var(--text);font-weight:800;outline:none;font-family:'DM Mono',monospace;">
                    </div>
                    <label style="margin-top:10px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#f8fffd;border:1px solid var(--border);border-radius:12px;padding:11px 12px;cursor:pointer;">
                        <span>
                            <b style="display:block;color:var(--text);font-size:13px;">SeedDown AI mascot</b>
                            <small style="display:block;color:var(--sub);font-size:11px;margin-top:2px;">Show the 3D guide on Commercial Digital Twin</small>
                        </span>
                        <input id="controlMascotToggle" type="checkbox" ${isMascotEnabled() ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--accent);">
                    </label>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:12px;">
                        <div>
                            <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;">LATEST COMMAND</div>
                            <div id="latestCommandText" style="font-size:1rem;font-weight:900;color:var(--text);margin-top:3px;">Loading...</div>
                            <div id="latestCommandReason" style="font-size:0.72rem;color:var(--sub);line-height:1.35;margin-top:2px;">Checking pending ESP32 command.</div>
                        </div>
                        <button id="refreshCommandBtn" title="Refresh command" aria-label="Refresh command" style="width:36px;height:36px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--accent);font-weight:900;cursor:pointer;">↻</button>
                    </div>
                </div>



                <div id="controlAiRecommendation" style="background:#F8FAFC;border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:16px;padding:14px 15px;box-shadow:var(--shadow-sm);">
                    <div style="display:flex;gap:10px;align-items:flex-start;">
                        <div id="controlAiIcon" style="width:34px;height:34px;border-radius:12px;background:var(--accent-l);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0;color:var(--accent);">AI</div>
                        <div style="flex:1;min-width:0;">
                            <div id="controlAiTitle" style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;">AI Threshold Check</div>
                            <div id="controlAiSummary" style="font-size:13px;color:var(--sub);line-height:1.4;margin-top:3px;">Settings look safe for commercial automation.</div>
                            <div id="controlAiList" style="display:none;margin-top:9px;flex-direction:column;gap:6px;"></div>
                        </div>
                    </div>
                </div>

                ${controlThresholdCardHtml({
                    id: 'farm_master',
                    title: 'Farm Master Node',
                    subtitle: 'Farm-level shared sensors and outputs',
                    scope: 'farm',
                    thresholds: farmThresholds,
                })}

                ${zones.map(zone => controlThresholdCardHtml({
                    id: zone.id,
                    title: zone.label,
                    subtitle: `${zone.crop || 'Mixed crops'} · zone-level sensor and output recipe`,
                    scope: 'zone',
                    thresholds: zone.thresholds || {},
                })).join('')}

                ${manualOverridePanelHtml(zones, farm, profile)}

                <button id="controlSyncBtn" style="width:100%;padding:14px;border:none;border-radius:var(--radius);background:var(--accent);color:white;flex-shrink:0;font-weight:800;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span id="controlSyncIcon">☁️</span> Sync Thresholds to IoT
                </button>

                <button id="controlLoadBtn" style="width:100%;padding:13px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--accent);font-weight:800;cursor:pointer;">Load Current Device Settings</button>

                <div style="height:10px;"></div>
            </div>
        </div>
    `;

    ensureControlStyles();
    bindEvents();
    fetchCurrentPreferences(false);
    fetchLatestCommand(false);
}

function ensureControlStyles() {
    if (document.getElementById('control-polish-style')) return;
    const style = document.createElement('style');
    style.id = 'control-polish-style';
    style.textContent = `
        #controlScreen {
            --accent: #0f766e;
            --accent-l: #ecfeff;
            --surface: #ffffff;
            --surface2: #f7fefe;
            --border: #ccfbf1;
            --text: #12312f;
            --sub: #4f6f6a;
            --muted: #78908b;
            --danger: #dc2626;
            --radius: 16px;
            --radius-sm: 12px;
            --shadow-sm: 0 10px 28px rgba(15, 118, 110, .08);
            background: #f5fffc !important;
            color: var(--text);
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
            letter-spacing: 0 !important;
        }
        #controlScreen *,
        #controlScreen button,
        #controlScreen input,
        #controlScreen select {
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
            letter-spacing: 0 !important;
        }
        #controlScreen .topbar {
            background: rgba(255, 255, 255, .94) !important;
            border-bottom: 1px solid var(--border) !important;
            box-shadow: 0 8px 28px rgba(15, 118, 110, .07) !important;
            backdrop-filter: blur(16px);
        }
        #controlScreen input,
        #controlScreen select {
            min-height: 42px;
            box-sizing: border-box;
        }
        #controlScreen #controlDeviceId {
            background: #ffffff !important;
            border: 1px solid var(--border) !important;
            border-radius: 12px !important;
            padding: 10px 12px !important;
            color: var(--accent) !important;
            font-size: 15px !important;
        }
        #controlScreen .control-threshold-card {
            border-radius: 18px !important;
            border-color: var(--border) !important;
            box-shadow: 0 12px 30px rgba(15, 118, 110, .07) !important;
        }
        #controlScreen .control-threshold-card > div:nth-child(2) {
            grid-template-columns: repeat(auto-fit, minmax(215px, 1fr)) !important;
            gap: 12px !important;
        }
        #controlScreen .control-threshold-card label {
            background: #f8fffd !important;
            border-color: var(--border) !important;
            border-radius: 14px !important;
            gap: 8px !important;
        }
        #controlScreen .control-threshold-input {
            width: 100% !important;
            min-height: 44px !important;
            background: #ffffff !important;
            border: 1px solid #99f6e4 !important;
            border-radius: 12px !important;
            padding: 9px 12px !important;
            color: var(--accent) !important;
            font-size: 17px !important;
            font-weight: 850 !important;
        }
        #controlScreen .manual-command-btn {
            min-height: 72px !important;
            background: #ecfeff !important;
            border-color: #99f6e4 !important;
            color: #0f766e !important;
            border-radius: 14px !important;
        }
        #controlScreen .manual-field {
            display:flex;
            flex-direction:column;
            gap:6px;
            background:#f8fffd;
            border:1px solid var(--border);
            border-radius:14px;
            padding:10px;
        }
        #controlScreen .manual-field span {
            color:var(--muted);
            font-size:10px;
            font-weight:950;
            text-transform:uppercase;
            letter-spacing:.06em;
        }
        #controlScreen .manual-field input,
        #controlScreen .manual-field select {
            width:100%;
            border:1px solid #99f6e4;
            border-radius:12px;
            background:#fff;
            color:var(--text);
            padding:9px 10px;
            font-weight:850;
            outline:none;
            min-width:0;
        }
        #controlScreen #controlSyncBtn,
        #controlScreen #controlSaveBtn {
            background: #0f766e !important;
            box-shadow: 0 12px 26px rgba(15, 118, 110, .18);
        }
        #controlScreen #controlLoadBtn,
        #controlScreen #refreshCommandBtn {
            background: #ffffff !important;
            border-color: var(--border) !important;
        }
        @media (max-width: 560px) {
            #controlScreen .control-threshold-card > div:nth-child(2) {
                grid-template-columns: 1fr !important;
            }
        }
    `;
    document.head.appendChild(style);
}

function bindEvents() {
    document.getElementById('controlBackBtn')?.addEventListener('click', () => showScreen('dash-c'));
    document.getElementById('controlSaveBtn')?.addEventListener('click', saveControls);
    document.getElementById('controlSyncBtn')?.addEventListener('click', syncControls);
    document.getElementById('controlLoadBtn')?.addEventListener('click', () => fetchCurrentPreferences(true));
    document.getElementById('refreshCommandBtn')?.addEventListener('click', () => fetchLatestCommand(true));
    document.getElementById('emergencyStopBtn')?.addEventListener('click', () => sendManualCommand('NO_ACTION', 'Emergency stop from dashboard'));
    document.getElementById('manualSendBtn')?.addEventListener('click', () => sendManualCommand());
    document.getElementById('manualScope')?.addEventListener('change', syncManualOverrideTarget);
    document.getElementById('manualZone')?.addEventListener('change', syncManualOverrideTarget);
    syncManualOverrideTarget();

    document.querySelectorAll('.manual-command-btn').forEach(button => {
        button.addEventListener('click', () => {
            const commandInput = document.getElementById('manualCommand');
            if (commandInput) commandInput.value = button.dataset.command;
            sendManualCommand(button.dataset.command, `${button.dataset.label} manual override from dashboard`);
        });
    });

    document.querySelectorAll('.control-threshold-input').forEach(input => {
        input.addEventListener('input', updateControlRecommendations);
    });
    document.getElementById('controlDeviceId')?.addEventListener('input', updateControlRecommendations);
    document.getElementById('controlMascotToggle')?.addEventListener('change', event => {
        const enabled = Boolean(event.target.checked);
        localStorage.setItem(MASCOT_VISIBILITY_KEY, enabled ? 'true' : 'false');
        window.dispatchEvent(new CustomEvent('seeddown:mascotVisibility', { detail: { enabled } }));
        showToast('success', enabled ? 'SeedDown AI mascot enabled' : 'SeedDown AI mascot hidden');
    });
    updateControlRecommendations();
}

async function fetchLatestCommand(showResult) {
    const deviceId = value('manualDeviceId') || value('controlDeviceId');
    if (!deviceId) {
        setText('latestCommandText', 'No device assigned');
        setText('latestCommandReason', 'Assign a Farm Master or Zone Node before polling commands.');
        if (showResult) showToast('warning', 'No device assigned yet');
        return;
    }
    try {
        const res = await fetch(`${API_BASE}/api/sensors/command?deviceId=${encodeURIComponent(deviceId)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const command = await res.json();
        setCommandStatus(command);
        if (showResult) showToast('success', 'Command status refreshed');
    } catch (err) {
        setText('latestCommandText', 'Unavailable');
        setText('latestCommandReason', 'Could not load pending command.');
        if (showResult) showToast('warning', `Command status unavailable: ${err.message}`);
    }
}

function setCommandStatus(command) {
    if (!command) {
        setText('latestCommandText', 'NO_ACTION');
        setText('latestCommandReason', 'No pending command.');
        return;
    }
    const status = command.executed ? 'Executed' : 'Pending';
    setText('latestCommandText', `${command.command || 'NO_ACTION'} · ${status}`);
    setText('latestCommandReason', command.reason || 'No reason provided.');
}

async function sendManualCommand(command = '', reason = '') {
    const target = resolveManualTarget();
    const selectedCommand = command || value('manualCommand') || 'NO_ACTION';
    const selectedReason = reason || value('manualReason') || `${selectedCommand} manual override from Control page`;
    const durationSeconds = Math.max(0, Number(value('manualDuration')) || 0);
    const deviceId = target.deviceId || value('controlDeviceId');
    if (!deviceId) {
        showToast('warning', 'Choose a target with an assigned device before sending a command.');
        return;
    }
    const isStop = selectedCommand === 'NO_ACTION';
    try {
        const res = await fetch(`${API_BASE}/api/sensors/command`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                deviceId,
                command: selectedCommand,
                reason: selectedReason,
                durationSeconds,
                scope: target.scope,
                zoneId: target.zoneId || undefined,
                targetId: target.zoneId || target.scope,
            }),
        });
        const data = await res.json();
        if (!res.ok || data.ok === false) throw new Error(data.error || `HTTP ${res.status}`);
        setCommandStatus(data.command);
        showToast('success', isStop ? 'Emergency stop queued for ESP32' : `${selectedCommand} queued for ${target.label}`);
    } catch (err) {
        showToast('error', `Manual command failed: ${err.message}`);
    }
}

function syncManualOverrideTarget() {
    const scope = value('manualScope') || 'farm';
    const farm = getCurrentFarm();
    const profile = { ...defaultControls(), ...(loadProfile(AppState.currentFarmId) || {}) };
    const zoneWrap = document.getElementById('manualZoneWrap');
    const deviceInput = document.getElementById('manualDeviceId');
    if (zoneWrap) zoneWrap.style.display = scope === 'zone' ? 'flex' : 'none';
    if (deviceInput) {
        deviceInput.value = scope === 'zone'
            ? resolveZoneDeviceId(farm, value('manualZone') || 'zone_A')
            : resolveFarmMasterDeviceId(farm, profile);
    }
}

function resolveManualTarget() {
    const farm = getCurrentFarm();
    const profile = { ...defaultControls(), ...(loadProfile(AppState.currentFarmId) || {}) };
    const scope = value('manualScope') || 'farm';
    if (scope === 'zone') {
        const zoneId = normalizeControlZoneId(value('manualZone') || 'zone_A');
        return {
            scope: 'zone',
            zoneId,
            label: zoneId.replace('_', ' '),
            deviceId: value('manualDeviceId') || resolveZoneDeviceId(farm, zoneId),
        };
    }
    return {
        scope: 'farm',
        zoneId: '',
        label: 'Farm Level',
        deviceId: value('manualDeviceId') || resolveFarmMasterDeviceId(farm, profile),
    };
}

function resolveFarmMasterDeviceId(farm, profile = {}) {
    return farm?.farmMaster?.deviceId || farm?.deviceId || profile.deviceId || '';
}

function resolveZoneDeviceId(farm, zoneId) {
    const normalized = normalizeControlZoneId(zoneId);
    const devices = Array.isArray(farm?.commercialDevices) ? farm.commercialDevices : [];
    const active = devices.find(device =>
        device?.active !== false
        && device?.status !== 'replaced'
        && normalizeControlZoneId(device.targetId || device.zoneId || device.zone) === normalized
    );
    return active?.deviceId || DEMO_COMMERCIAL_ZONE_DEVICES[normalized] || normalized || '';
}

function normalizeControlZoneId(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';
    const match = raw.match(/^zone[_ ]?([a-z])$/) || raw.match(/^([a-z])$/);
    if (match) return `zone_${match[1].toUpperCase()}`;
    return raw.startsWith('zone_') ? `zone_${raw.slice(5).toUpperCase()}` : raw;
}

function applyPreset(name) {
    const presets = {
        leafy: {
            soilDryThreshold: 1900,
            gasDangerThreshold: 2500,
            tempMin: 18,
            tempMax: 28,
            phMin: 5.8,
            phMax: 6.5,
            lightThreshold: 1400,
            wateringDuration: 8,
        },
        fruiting: {
            soilDryThreshold: 1700,
            gasDangerThreshold: 2500,
            tempMin: 20,
            tempMax: 32,
            phMin: 6.0,
            phMax: 6.8,
            lightThreshold: 2200,
            wateringDuration: 12,
        },
        energy: {
            soilDryThreshold: 1600,
            gasDangerThreshold: 2800,
            tempMin: 18,
            tempMax: 35,
            phMin: 5.5,
            phMax: 6.8,
            lightThreshold: 1000,
            wateringDuration: 6,
        },
        safety: {
            soilDryThreshold: 2000,
            gasDangerThreshold: 1800,
            tempMin: 18,
            tempMax: 30,
            phMin: 5.8,
            phMax: 6.5,
            lightThreshold: 1600,
            wateringDuration: 8,
        },
    };

    const preset = presets[name];
    if (!preset) return;
    setInput('controlSoil', preset.soilDryThreshold);
    setText('soilVal', `${preset.soilDryThreshold} raw`);
    setInput('controlGas', preset.gasDangerThreshold);
    setText('gasVal', `${preset.gasDangerThreshold} raw`);
    setInput('controlTempMin', preset.tempMin);
    setInput('controlTempMax', preset.tempMax);
    setInput('controlPhMin', preset.phMin);
    setInput('controlPhMax', preset.phMax);
    setInput('controlLight', preset.lightThreshold);
    setText('lightVal', `${preset.lightThreshold} raw`);
    setInput('controlWaterDur', preset.wateringDuration);
    setText('waterDurVal', `${preset.wateringDuration}s`);
    updateControlRecommendations();
    showToast('info', 'Preset applied. Press Sync to send it to IoT.');
}
async function fetchCurrentPreferences(showResult) {
    const deviceId = value('controlDeviceId');
    if (!deviceId) {
        if (showResult) showToast('warning', 'No device assigned yet');
        return;
    }
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
    updateControlRecommendations();
}

function saveControls() {
    const controls = collectControls();
    const recommendation = updateControlRecommendations();
    const profile = { ...defaultControls(), ...(loadProfile(AppState.currentFarmId) || {}), ...controls };
    saveProfile(profile, AppState.currentFarmId);
    showToast(recommendation.level === 'danger' ? 'warning' : 'success', recommendation.level === 'danger' ? 'Saved locally, but AI recommends adjusting risky thresholds.' : 'Control thresholds saved locally');
}

async function syncControls() {
    const controls = collectControls();
    const recommendation = updateControlRecommendations();
    if (recommendation.level === 'danger') {
        showToast('warning', 'AI warning: thresholds are risky. Review the recommendation before syncing.');
    }
    const icon = document.getElementById('controlSyncIcon');
    const btn = document.getElementById('controlSyncBtn');
    btn.disabled = true;
    icon.textContent = '⏳';

    saveProfile({ ...defaultControls(), ...(loadProfile(AppState.currentFarmId) || {}), ...controls }, AppState.currentFarmId);
    if (!controls.deviceId) {
        icon.textContent = '⚠️';
        btn.disabled = false;
        showToast('warning', 'Assign a device before syncing thresholds.');
        return;
    }

    const payload = {
        deviceId: controls.deviceId,
        ...controls,
        byScope: undefined,
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
    const controls = {
        deviceId: value('controlDeviceId'),
    };
    document.querySelectorAll('.control-threshold-input').forEach(input => {
        const key = input.dataset.key;
        const scope = input.dataset.scope || 'zone';
        const zone = input.dataset.zone || scope;
        const value = Number(input.value);
        if (!key || !Number.isFinite(value)) return;
        controls[key] = value;
        if (!controls.byScope) controls.byScope = {};
        if (!controls.byScope[zone]) controls.byScope[zone] = {};
        controls.byScope[zone][key] = value;
    });
    controls.lightThreshold = controls.darkThreshold ?? 1500;
    controls.wateringDuration = controls.wateringDurationSeconds ?? 10;
    return controls;
}

function updateControlRecommendations() {
    const controls = collectControls();
    const findings = getControlRecommendations(controls);
    const level = findings.some(item => item.level === 'danger') ? 'danger' : findings.some(item => item.level === 'warning') ? 'warning' : 'safe';
    const box = document.getElementById('controlAiRecommendation');
    const icon = document.getElementById('controlAiIcon');
    const title = document.getElementById('controlAiTitle');
    const summary = document.getElementById('controlAiSummary');
    const list = document.getElementById('controlAiList');
    if (!box || !icon || !title || !summary || !list) return { level, findings };

    const style = {
        safe: { border: 'var(--accent)', bg: '#F8FAFC', iconBg: 'var(--accent-l)', color: 'var(--accent)', icon: 'AI', title: 'AI Threshold Check' },
        warning: { border: '#D97706', bg: '#FFFBEB', iconBg: '#FEF3C7', color: '#B45309', icon: '!', title: 'AI Recommendation' },
        danger: { border: 'var(--danger)', bg: '#FEF2F2', iconBg: '#FEE2E2', color: 'var(--danger)', icon: '!!', title: 'AI Safety Warning' },
    }[level];

    box.style.borderLeftColor = style.border;
    box.style.background = style.bg;
    icon.style.background = style.iconBg;
    icon.style.color = style.color;
    icon.textContent = style.icon;
    title.textContent = style.title;
    title.style.color = style.color;

    if (!findings.length) {
        summary.textContent = conciseAIText('Settings look safe for commercial automation.', 130);
        list.style.display = 'none';
        list.innerHTML = '';
        return { level, findings };
    }

    summary.textContent = conciseAIText(level === 'danger'
        ? 'Some settings can delay emergency actions or make automation unstable.'
        : 'AI found settings that may cause false alarms or inefficient device response.', 130);
    list.style.display = 'flex';
    list.innerHTML = findings.slice(0, 4).map(item => `
        <div style="display:flex;gap:7px;align-items:flex-start;font-size:11px;line-height:1.35;color:${item.level === 'danger' ? 'var(--danger)' : '#92400E'};font-weight:800;">
            <span>${item.level === 'danger' ? '!' : '-'}</span>
            <span>${escapeHTML(conciseAIText(item.message, 110))}</span>
        </div>
    `).join('');
    return { level, findings };
}

function getControlRecommendations(c) {
    const findings = [];
    const add = (level, message) => findings.push({ level, message });

    if (!c.deviceId.trim()) add('danger', 'Device ID is empty, so ESP32 preferences cannot sync correctly.');

    if (c.tempMin !== undefined && c.tempMax !== undefined && c.tempMin >= c.tempMax) add('danger', 'Temperature min must be lower than max. Recommended range: 18C to 35C.');
    else {
        if (c.tempMin !== undefined && c.tempMin < 10) add('warning', 'Temperature min is very low; cold stress may be ignored too long. Consider 18C.');
        if (c.tempMax !== undefined && c.tempMax > 42) add('danger', 'Temperature max is too high; buzzer/fan may react too late. Keep it near 35C.');
        if (c.tempMin !== undefined && c.tempMax !== undefined && c.tempMax - c.tempMin < 5) add('warning', 'Temperature range is too narrow and may create frequent false alerts.');
        if (c.tempMin !== undefined && c.tempMax !== undefined && c.tempMax - c.tempMin > 25) add('warning', 'Temperature range is too wide and may miss crop stress.');
    }

    if (c.phMin !== undefined && c.phMax !== undefined && c.phMin >= c.phMax) add('danger', 'pH min must be lower than pH max. Recommended range: 5.5 to 6.5.');
    else {
        if (c.phMin !== undefined && c.phMin < 4.8) add('warning', 'pH min is too acidic for most crops. Consider 5.5.');
        if (c.phMax !== undefined && c.phMax > 7.2) add('warning', 'pH max is too alkaline for nutrient uptake. Consider 6.5.');
        if (c.phMin !== undefined && c.phMax !== undefined && c.phMax - c.phMin > 1.8) add('warning', 'pH range is too wide; nutrient issues may be detected late.');
    }

    if (c.gasDangerThreshold !== undefined && c.gasDangerThreshold > 3300) add('danger', 'Gas danger threshold is very high; emergency buzzer may trigger too late. Consider 3000 or lower.');
    if (c.gasDangerThreshold !== undefined && c.gasDangerThreshold < 900) add('warning', 'Gas danger threshold is very sensitive and may cause frequent buzzer alerts.');
    if (c.soilDryThreshold !== undefined && c.soilDryThreshold < 900) add('warning', 'Soil threshold is very low; watering may wait until plants are too dry.');
    if (c.soilDryThreshold !== undefined && c.soilDryThreshold > 3000) add('warning', 'Soil threshold is very high; pump may run too often and waste water.');
    if (c.darkThreshold !== undefined && c.darkThreshold < 700) add('warning', 'Light threshold is very low; plants may stay under-lit before action triggers.');
    if (c.darkThreshold !== undefined && c.darkThreshold > 3200) add('warning', 'Light threshold is very high; LED grow light may trigger too often and waste energy.');
    if (c.wateringDurationSeconds !== undefined && c.wateringDurationSeconds > 30) add('warning', 'Pump duration is long; risk of overwatering. Try 8-15 seconds first.');
    if (c.wateringDurationSeconds !== undefined && c.wateringDurationSeconds < 4) add('warning', 'Pump duration is very short; pump may not deliver enough water.');
    if (c.co2MaxPpm !== undefined && c.co2MinPpm !== undefined && c.co2MinPpm >= c.co2MaxPpm) add('danger', 'CO2 min must be lower than CO2 max.');
    if (c.energyDailyLimitKwh !== undefined && c.energyDailyLimitKwh > 80) add('warning', 'Energy limit is very high; Eco Save analysis may become meaningless.');
    if (c.cameraScanIntervalMinutes !== undefined && c.cameraScanIntervalMinutes > 1440) add('warning', 'Camera scan interval is longer than one day; disease detection may be late.');

    return findings;
}

function presetButton(preset, icon, label) {
    return `
        <button class="preset-btn" data-preset="${preset}" style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:12px 8px;text-align:left;cursor:pointer;color:var(--text);">
            <div style="font-size:22px;line-height:1;">${icon}</div>
            <div style="font-size:12px;font-weight:900;margin-top:7px;">${label}</div>
        </button>`;
}

function manualButton(command, icon, label) {
    return `
        <button class="manual-command-btn" data-command="${command}" data-label="${label}" style="background:var(--accent-l);border:1px solid var(--accent);border-radius:14px;padding:12px 6px;text-align:center;cursor:pointer;color:var(--accent);font-weight:900;">
            <div style="font-size:24px;line-height:1;">${icon}</div>
            <div style="font-size:11px;margin-top:6px;">${label}</div>
        </button>`;
}

function manualOverridePanelHtml(zones, farm, profile) {
    const firstZone = zones[0]?.id || 'zone_A';
    const farmDevice = resolveFarmMasterDeviceId(farm, profile);
    return `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow-sm);">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:12px;">
                <div>
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;">MANUAL OVERRIDE</div>
                    <div style="font-size:12px;color:var(--sub);font-weight:750;margin-top:3px;">Choose farm-level or zone-level control before sending a command.</div>
                </div>
                <button id="emergencyStopBtn" style="padding:9px 11px;border:none;border-radius:12px;background:var(--danger);color:white;font-weight:900;cursor:pointer;">Stop</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:10px;">
                <label class="manual-field"><span>Target scope</span><select id="manualScope"><option value="farm">Farm Level</option><option value="zone">Zone</option></select></label>
                <label class="manual-field" id="manualZoneWrap"><span>Zone</span><select id="manualZone">${zones.map(zone => `<option value="${escapeAttr(zone.id)}">${escapeHTML(zone.label)}</option>`).join('') || `<option value="${escapeAttr(firstZone)}">Zone A</option>`}</select></label>
                <label class="manual-field"><span>Device ID</span><input id="manualDeviceId" value="${escapeAttr(farmDevice)}"></label>
                <label class="manual-field"><span>Command</span><select id="manualCommand">${SUPPORTED_MANUAL_COMMANDS.map(command => `<option value="${command}">${command}</option>`).join('')}</select></label>
                <label class="manual-field"><span>Duration seconds</span><input id="manualDuration" type="number" min="0" max="600" step="1" value="10"></label>
                <label class="manual-field"><span>Reason</span><input id="manualReason" value="Operator manual override from Control page"></label>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:10px;">
                ${manualButton('WATER_ON', '💦', 'Water')}
                ${manualButton('FAN_ON', '🌀', 'Fan')}
                ${manualButton('BUZZER_ON', '🔔', 'Buzzer')}
                ${manualButton('PH_WARNING', 'pH', 'pH Warn')}
                ${manualButton('FERT_ALERT', 'NPK', 'Fert')}
                ${manualButton('CO2_LOW', 'CO2', 'CO2')}
                ${manualButton('GAS_ALERT', 'MQ', 'Gas')}
                ${manualButton('NO_ACTION', '×', 'Clear')}
            </div>
            <button id="manualSendBtn" style="width:100%;padding:13px;border:none;border-radius:var(--radius);background:var(--accent);color:white;font-weight:900;cursor:pointer;">Send Override</button>
        </div>`;
}

function controlThresholdCardHtml({ id, title, subtitle, scope, thresholds }) {
    const safeId = String(id || scope || 'threshold').replace(/[^a-zA-Z0-9_-]/g, '_');
    const isFarm = scope === 'farm';
    return `
        <div class="control-threshold-card" data-threshold-scope="${escapeAttr(scope)}" data-threshold-id="${escapeAttr(safeId)}" style="background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:16px;box-shadow:var(--shadow-sm);">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                <div style="min-width:0;">
                    <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;">${isFarm ? 'Farm level threshold' : 'Zone level threshold'}</div>
                    <div style="font-size:17px;font-weight:900;color:var(--text);margin-top:3px;">${escapeHTML(title)}</div>
                    <div style="font-size:12px;color:var(--sub);line-height:1.35;margin-top:3px;">${escapeHTML(subtitle)}</div>
                </div>
                <span style="background:${isFarm ? '#ECFDF5' : '#EFF6FF'};color:${isFarm ? 'var(--accent)' : '#2563EB'};border-radius:999px;padding:7px 10px;font-size:10px;font-weight:900;text-transform:uppercase;white-space:nowrap;">${isFarm ? 'shared' : 'per zone'}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;">
                ${controlThresholdInputsHtml(scope, safeId, thresholds)}
            </div>
            <div style="margin-top:12px;background:#F8FAFC;border:1px solid var(--border);border-radius:14px;padding:11px 12px;color:var(--sub);font-size:12px;line-height:1.45;">
                <b style="color:var(--text);">AI reason:</b> ${escapeHTML(controlThresholdReason(scope, title, thresholds))}
            </div>
        </div>
    `;
}

function controlThresholdInputsHtml(scope, zoneId, thresholds) {
    const items = scope === 'farm' ? controlFarmThresholdItems() : controlZoneThresholdItems();
    return items.map(item => thresholdInputHtml(item, scope, zoneId, thresholds)).join('');
}

function thresholdInputHtml(item, scope, zoneId, thresholds) {
    const value = thresholds?.[item.key] ?? item.default;
    return `
        <label style="display:flex;flex-direction:column;gap:6px;background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:11px 12px;min-width:0;">
            <span style="font-size:10px;font-weight:900;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;">${escapeHTML(item.label)}</span>
            <input class="control-threshold-input" data-key="${escapeAttr(item.key)}" data-scope="${escapeAttr(scope)}" data-zone="${escapeAttr(zoneId)}" type="number" value="${escapeAttr(value)}" min="${escapeAttr(item.min)}" max="${escapeAttr(item.max)}" step="${escapeAttr(item.step)}" style="border:none;background:transparent;outline:none;color:var(--accent);font-size:18px;font-weight:900;font-family:'DM Mono',monospace;width:100%;">
            <span style="font-size:11px;color:var(--sub);line-height:1.3;">${escapeHTML(item.unit)} · ${escapeHTML(item.hint)}</span>
        </label>
    `;
}

function controlFarmThresholdItems() {
    return [
        { key: 'co2MinPpm', label: 'CO2 minimum', default: 700, min: 300, max: 1500, step: 10, unit: 'ppm', hint: 'farm air baseline' },
        { key: 'co2MaxPpm', label: 'CO2 maximum', default: 1200, min: 600, max: 2500, step: 10, unit: 'ppm', hint: 'upper ventilation guard' },
        { key: 'waterLowCm', label: 'Reservoir low', default: 18, min: 1, max: 80, step: 1, unit: 'cm', hint: 'HC-SR04 refill alert' },
        { key: 'waterCriticalCm', label: 'Reservoir critical', default: 6, min: 1, max: 40, step: 1, unit: 'cm', hint: 'emergency pump lockout' },
        { key: 'gasDangerThreshold', label: 'MQ-2 danger', default: 2500, min: 500, max: 4095, step: 50, unit: 'raw', hint: 'safety buzzer threshold' },
        { key: 'energyDailyLimitKwh', label: 'Power limit', default: 8, min: 1, max: 120, step: 0.5, unit: 'kWh/day', hint: 'energy budget' },
        { key: 'fanDurationSeconds', label: 'Main fan duration', default: 20, min: 3, max: 180, step: 1, unit: 'sec', hint: 'facility ventilation output' },
        { key: 'farmPollIntervalSeconds', label: 'Farm poll interval', default: 300, min: 5, max: 3600, step: 5, unit: 'sec', hint: 'master node sync rate' },
    ];
}

function controlZoneThresholdItems() {
    return [
        { key: 'tempMin', label: 'Temp minimum', default: 18, min: 0, max: 35, step: 0.5, unit: 'C', hint: 'DHT11 lower guard' },
        { key: 'tempMax', label: 'Temp maximum', default: 35, min: 15, max: 55, step: 0.5, unit: 'C', hint: 'fan or buzzer trigger' },
        { key: 'humidityMin', label: 'Humidity minimum', default: 50, min: 20, max: 95, step: 1, unit: '%', hint: 'DHT11 humidity floor' },
        { key: 'humidityMax', label: 'Humidity maximum', default: 85, min: 40, max: 100, step: 1, unit: '%', hint: 'mold prevention' },
        { key: 'soilDryThreshold', label: 'Soil dry', default: 1800, min: 200, max: 4095, step: 50, unit: 'raw', hint: 'water pump trigger' },
        { key: 'darkThreshold', label: 'LDR dark', default: 1500, min: 100, max: 4095, step: 50, unit: 'raw', hint: 'grow light trigger' },
        { key: 'phMin', label: 'pH minimum', default: 5.5, min: 3, max: 8, step: 0.1, unit: 'pH', hint: 'acidic warning' },
        { key: 'phMax', label: 'pH maximum', default: 6.5, min: 4, max: 9, step: 0.1, unit: 'pH', hint: 'alkaline warning' },
        { key: 'ecMin', label: 'EC minimum', default: 1.2, min: 0, max: 4, step: 0.1, unit: 'mS/cm', hint: 'fertilizer low alert' },
        { key: 'ecMax', label: 'EC maximum', default: 2.2, min: 0.5, max: 6, step: 0.1, unit: 'mS/cm', hint: 'fertilizer excess alert' },
        { key: 'flowMinLpm', label: 'Flow minimum', default: 0.3, min: 0, max: 5, step: 0.1, unit: 'L/min', hint: 'YF-S201 pump health' },
        { key: 'wateringDurationSeconds', label: 'Pump duration', default: 10, min: 1, max: 90, step: 1, unit: 'sec', hint: 'irrigation output' },
        { key: 'growLightDurationMinutes', label: 'Grow light pulse', default: 20, min: 1, max: 240, step: 1, unit: 'min', hint: 'LED output duration' },
        { key: 'zoneFanDurationSeconds', label: 'Zone fan duration', default: 15, min: 1, max: 180, step: 1, unit: 'sec', hint: 'zone airflow output' },
        { key: 'cameraScanIntervalMinutes', label: 'Camera scan', default: 720, min: 10, max: 2880, step: 10, unit: 'min', hint: 'disease analysis cadence' },
        { key: 'diseaseConfidenceMin', label: 'Disease confidence', default: 70, min: 30, max: 99, step: 1, unit: '%', hint: 'AI asks questions below this' },
    ];
}

function controlThresholdReason(scope, title, thresholds = {}) {
    if (scope === 'farm') {
        return 'Farm Master thresholds protect shared infrastructure first: CO2, reservoir level, gas safety, energy budget, main ventilation and emergency buzzer. These values are intentionally conservative because one farm-level failure can affect every zone.';
    }
    const temp = `${thresholds.tempMin ?? 18}-${thresholds.tempMax ?? 35}C`;
    const ph = `${thresholds.phMin ?? 5.5}-${thresholds.phMax ?? 6.5}`;
    return `${title} uses independent zone thresholds because each crop tray can have different temperature, root moisture, pH, EC, lighting and camera disease-risk needs. AI keeps the safe range around ${temp}, pH ${ph}, then lets operators tune pump, grow light and fan outputs without changing the whole farm.`;
}

function commercialZonesForControl(farm) {
    const source = farm?.commercialStructure?.zones || farm?.zones || [];
    const zones = Array.isArray(source) ? source : [];
    if (zones.length) {
        return zones.map((zone, index) => ({
            id: zone.id || zone.zone_id || `zone_${String.fromCharCode(65 + index)}`,
            label: zone.name || zone.label || `Zone ${String.fromCharCode(65 + index)}`,
            crop: zone.crop || (Array.isArray(zone.plants) ? zone.plants.join(', ') : '') || 'Mixed crops',
            thresholds: zone.thresholds || zone.aiThresholds || {},
        }));
    }
    return ['A', 'B', 'C'].map(letter => ({
        id: `zone_${letter}`,
        label: `Zone ${letter}`,
        crop: 'Mixed crops',
        thresholds: {},
    }));
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
    input.addEventListener('input', () => {
        label.textContent = format(input.value);
        updateControlRecommendations();
    });
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





