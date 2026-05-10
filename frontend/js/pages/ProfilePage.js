/* ============================================================
   MODULE: PROFILE PAGE
   ProfilePage.js — User profile + farm/device settings
   ============================================================ */

import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';
import { saveFarmsToFirestore, saveFarmProfileToFirestore, saveGlobalProfileToFirestore } from '../utils/firebase.js';

const PROFILE_KEY = 'farm_profile';
const FARMS_KEY = 'user_farms';
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

function farmProfileKey(farmId) {
    return `farm_profile_${farmId}`;
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

function getDefaultProfile() {
    return {
        name: 'UTM Farmer',
        email: 'farmer@seeddown.com',
        farmName: AppState.farmName || 'Farm 1 - Rack Alpha',
        deviceId: 'farm_001',
        sensorIntervalMinutes: 60,
        soilDryThreshold: 1800,
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
    let savedFarms = loadSavedFarms();

    if (!AppState.currentFarmId && savedFarms.length > 0) {
        AppState.currentFarmId = savedFarms[0].id;
        AppState.currentFarm = savedFarms[0];
        AppState.farmName = savedFarms[0].name;
    }

    const profile = { ...getDefaultProfile(), ...(loadProfile(AppState.currentFarmId) || {}) };
    const isCommercial = AppState.mode === 'commercial';

    container.innerHTML = `
        <div class="screen active" id="profileScreen">
            <div class="topbar">
                <button id="profileBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;">←</button>
                <div style="font-weight:700;">${isCommercial ? 'Commercial Controls' : 'Profile'}</div>
                <div style="flex:1;"></div>
                <button id="profileSaveBtn" style="background:var(--accent);color:white;border:none;padding:6px 14px;border-radius:10px;font-size:0.75rem;font-weight:700;cursor:pointer;">Save</button>
            </div>

            <div class="bottom-nav">
                <div class="nav-item" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item active" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>

            <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px;">
                ${farmSelectorSection(savedFarms)}
                ${profileCard(profile, isCommercial)}
                ${isCommercial ? farmIdentitySection(profile) : ''}
                ${sensorSettingsSection(profile, isCommercial)}
                ${isCommercial ? automationSection(profile) : ''}

                <button id="profileSyncBtn" style="width:100%;padding:14px;border:none;border-radius:var(--radius);background:var(--accent-l);color:var(--accent);flex-shrink:0;font-weight:700;font-size:0.9rem;cursor:pointer;transition:var(--transition);display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span id="syncBtnIcon">☁️</span> ${isCommercial ? 'Sync Controls to Device' : 'Sync Interval to Device'}
                </button>

                <div style="background:rgba(220,38,38,0.04);border:1px solid rgba(220,38,38,0.15);border-radius:var(--radius);padding:18px;flex-shrink:0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--danger);letter-spacing:0.08em;margin-bottom:14px;">⚠️ DANGER ZONE</div>
                    <button id="profileLogoutBtn" style="width:100%;padding:12px;border:1px solid var(--danger);background:transparent;color:var(--danger);border-radius:var(--radius-sm);font-weight:700;font-size:0.85rem;cursor:pointer;">🚪 Log Out</button>
                </div>

                <div style="height:8px;flex-shrink:0;"></div>
            </div>
        </div>
    `;

    _bindEvents(savedFarms, isCommercial);

    if (AppState.profileFocus === 'controls') {
        AppState.profileFocus = null;
        setTimeout(() => document.getElementById('sensorSettingsCard')?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 120);
    }
}

function _bindEvents(savedFarms, isCommercial) {
    const selector = document.getElementById('farmSelector');
    if (selector) {
        selector.addEventListener('change', (e) => {
            const selectedId = e.target.value;
            const selectedFarm = savedFarms.find(f => f.id === selectedId);
            if (!selectedFarm) return;

            AppState.currentFarmId = selectedId;
            AppState.currentFarm = selectedFarm;
            AppState.farmName = selectedFarm.name;

            const farmProfile = {
                ...getDefaultProfile(),
                ...(loadProfile(selectedId) || {}),
                farmName: selectedFarm.name,
            };

            setInputValue('profileFarmName', farmProfile.farmName);
            setInputValue('profileDeviceId', farmProfile.deviceId);
            setInputValue('profileInterval', farmProfile.sensorIntervalMinutes);
            setText('intervalVal', `${farmProfile.sensorIntervalMinutes} min`);
            setInputValue('profileSoil', farmProfile.soilDryThreshold);
            setText('soilVal', farmProfile.soilDryThreshold);
            setInputValue('profilePhMin', farmProfile.phMin);
            setInputValue('profilePhMax', farmProfile.phMax);
            setInputValue('profileLight', farmProfile.lightThreshold);
            setText('lightVal', farmProfile.lightThreshold);
            setInputValue('profileWaterDur', farmProfile.wateringDuration);
            setText('waterDurVal', `${farmProfile.wateringDuration}s`);

            _setToggle('toggleAutoWater', farmProfile.autoWater);
            _setToggle('toggleNotifications', farmProfile.notifications);
            _setToggle('toggleEcoMode', farmProfile.ecoMode);

            showToast('info', `Switched to ${selectedFarm.name}`);
        });
    }

    _on('profileBackBtn', 'click', () => showScreen(AppState.profileFrom || 'home'));

    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.dataset.screen === 'farmlist') showScreen(AppState.profileFrom || 'home');
        });
    });

    const avatars = ['🧑‍🌾', '👩‍🌾', '🌱', '🤖', '🧪', '🌿', '🏭', '👨‍💻'];
    let avatarIdx = 0;
    _on('profileAvatar', 'click', () => {
        avatarIdx = (avatarIdx + 1) % avatars.length;
        document.getElementById('profileAvatar').textContent = avatars[avatarIdx];
    });

    _slider('profileInterval', 'intervalVal', v => `${v} min`);
    _slider('profileSoil', 'soilVal', v => v);
    _slider('profileLight', 'lightVal', v => v);
    _slider('profileWaterDur', 'waterDurVal', v => `${v}s`);

    document.querySelectorAll('.auto-toggle').forEach(cb => {
        cb.addEventListener('change', () => _setToggle(cb.id, cb.checked));
    });

    _on('profileSaveBtn', 'click', () => _doSave(isCommercial));
    _on('profileSyncBtn', 'click', () => _doSync(isCommercial));
    _on('profileLogoutBtn', 'click', () => {
        showToast('info', '👋 Logged out. See you next harvest!');
        setTimeout(() => showScreen('login'), 800);
    });
}

function _doSave(isCommercial) {
    const profile = _collectForm(isCommercial);
    const currentId = AppState.currentFarmId;
    const uid = AppState.uid;

    saveProfile(profile, currentId);
    AppState.farmName = profile.farmName;
    AppState.notify?.();

    try {
        let savedFarms = loadSavedFarms();
        if (currentId) {
            savedFarms = savedFarms.map(f => f.id === currentId ? { ...f, name: profile.farmName } : f);
            localStorage.setItem(FARMS_KEY, JSON.stringify(savedFarms));
            if (uid) {
                saveFarmProfileToFirestore(uid, currentId, profile);
                saveFarmsToFirestore(uid, savedFarms);
                saveGlobalProfileToFirestore(uid, { name: profile.name, email: profile.email });
            }
        }
    } catch (e) {
        console.error('Error updating farm list names:', e);
    }

    showToast('success', isCommercial ? '✅ Commercial controls saved!' : '✅ Interval saved!');
    setTimeout(() => showScreen(AppState.profileFrom || 'home'), 400);
}

async function _doSync(isCommercial) {
    const profile = _collectForm(isCommercial);
    saveProfile(profile, AppState.currentFarmId);

    const icon = document.getElementById('syncBtnIcon');
    const btn = document.getElementById('profileSyncBtn');
    btn.disabled = true;
    icon.textContent = '⏳';

    const payload = isCommercial
        ? {
            deviceId: profile.deviceId || 'farm_001',
            sensorIntervalSeconds: profile.sensorIntervalMinutes * 60,
            soilDryThreshold: profile.soilDryThreshold,
            phMin: profile.phMin,
            phMax: profile.phMax,
            darkThreshold: profile.lightThreshold,
            wateringDurationSeconds: profile.wateringDuration,
            autoWater: profile.autoWater,
            notifications: profile.notifications,
            ecoMode: profile.ecoMode,
        }
        : {
            deviceId: profile.deviceId || 'farm_001',
            sensorIntervalSeconds: profile.sensorIntervalMinutes * 60,
        };

    try {
        const res = await fetch(`${API_BASE}/api/sensors/preferences`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        icon.textContent = '✅';
        showToast('success', isCommercial ? '☁️ Controls synced to device!' : '☁️ Interval synced to device!');
    } catch (err) {
        icon.textContent = '⚠️';
        showToast('error', `Sync failed: ${err.message}. Saved locally.`);
        console.warn('[ProfilePage] Sync error:', err);
    } finally {
        setTimeout(() => {
            icon.textContent = '☁️';
            btn.disabled = false;
        }, 2000);
    }
}

function _collectForm(isCommercial) {
    const existing = { ...getDefaultProfile(), ...(loadProfile(AppState.currentFarmId) || {}) };
    const base = {
        ...existing,
        name: _val('profileName') || existing.name,
        email: _val('profileEmail') || existing.email,
        farmName: _val('profileFarmName') || AppState.farmName || existing.farmName,
        deviceId: _val('profileDeviceId') || existing.deviceId || 'farm_001',
        sensorIntervalMinutes: parseInt(_val('profileInterval'), 10) || existing.sensorIntervalMinutes || 60,
    };

    if (!isCommercial) return base;

    return {
        ...base,
        soilDryThreshold: parseInt(_val('profileSoil'), 10) || existing.soilDryThreshold || 1800,
        phMin: parseFloat(_val('profilePhMin')) || existing.phMin || 5.5,
        phMax: parseFloat(_val('profilePhMax')) || existing.phMax || 6.5,
        lightThreshold: parseInt(_val('profileLight'), 10) || existing.lightThreshold || 1500,
        wateringDuration: parseInt(_val('profileWaterDur'), 10) || existing.wateringDuration || 10,
        autoWater: document.getElementById('toggleAutoWater')?.checked ?? existing.autoWater ?? true,
        notifications: document.getElementById('toggleNotifications')?.checked ?? existing.notifications ?? true,
        ecoMode: document.getElementById('toggleEcoMode')?.checked ?? existing.ecoMode ?? false,
    };
}

function farmSelectorSection(savedFarms) {
    return `
        <div style="background:var(--accent-l);border:1px solid var(--accent);border-radius:var(--radius);padding:14px;flex-shrink:0;">
            <label style="font-size:0.65rem;font-weight:700;color:var(--accent);display:block;margin-bottom:8px;">EDITING FARM</label>
            <select id="farmSelector" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--accent);background:white;color:var(--text);font-weight:600;outline:none;font-family:inherit;">
                ${savedFarms.map(f => `<option value="${_escAttr(f.id)}" ${f.id === AppState.currentFarmId ? 'selected' : ''}>${_esc(f.name)} (${_esc(f.zone || f.location || 'Field')})</option>`).join('')}
                ${savedFarms.length === 0 ? '<option disabled>No farms available</option>' : ''}
            </select>
        </div>`;
}

function profileCard(profile, isCommercial) {
    return `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px 20px;display:flex;align-items:center;gap:16px;box-shadow:var(--shadow-sm);position:relative;overflow:hidden;flex-shrink:0;">
            <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:var(--accent-s);border-radius:50%;"></div>
            <div id="profileAvatar" style="width:64px;height:64px;border-radius:20px;background:var(--accent-l);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0;cursor:pointer;transition:var(--transition);" title="Tap to change avatar">🧑‍🌾</div>
            <div style="flex:1;min-width:0;position:relative;z-index:1;">
                <input id="profileName" value="${_escAttr(profile.name)}" style="font-size:1.1rem;font-weight:700;color:var(--text);background:transparent;border:none;border-bottom:1px solid var(--border);width:100%;padding:2px 0;outline:none;font-family:inherit;" placeholder="Your name">
                <input id="profileEmail" value="${_escAttr(profile.email)}" style="font-size:0.78rem;color:var(--sub);background:transparent;border:none;width:100%;padding:2px 0;outline:none;font-family:inherit;margin-top:4px;" placeholder="email@example.com">
                <div style="margin-top:8px;"><span class="status-chip chip-ok">${isCommercial ? '🏭 Commercial' : '🌱 Beginner'} Mode</span></div>
            </div>
        </div>`;
}

function farmIdentitySection(profile) {
    return `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🌿 FARM IDENTITY</div>
            ${_settingInput('Farm Name', 'profileFarmName', profile.farmName, 'text', 'e.g. Rack Alpha - Level 3')}
            ${_settingInput('Device ID', 'profileDeviceId', profile.deviceId, 'text', 'e.g. farm_001')}
        </div>`;
}

function sensorSettingsSection(profile, isCommercial) {
    return `
        <div id="sensorSettingsCard" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">${isCommercial ? '🎛️ SENSOR THRESHOLDS' : '📡 SENSOR INTERVAL'}</div>
            ${intervalControl(profile)}
            ${isCommercial ? thresholdControls(profile) : ''}
        </div>`;
}

function intervalControl(profile) {
    return `
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <label style="font-size:0.8rem;font-weight:600;color:var(--text);">📡 Sensor Interval</label>
                <span id="intervalVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${profile.sensorIntervalMinutes} min</span>
            </div>
            <input type="range" id="profileInterval" min="5" max="120" step="5" value="${profile.sensorIntervalMinutes}" style="width:100%;accent-color:var(--accent);">
            <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>5 min</span><span>120 min</span></div>
        </div>`;
}

function thresholdControls(profile) {
    return `
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <label style="font-size:0.8rem;font-weight:600;color:var(--text);">💧 Soil Dry Threshold (raw)</label>
                <span id="soilVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${profile.soilDryThreshold}</span>
            </div>
            <input type="range" id="profileSoil" min="500" max="3000" step="100" value="${profile.soilDryThreshold}" style="width:100%;accent-color:var(--accent);">
            <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>Dry (500)</span><span>Wet (3000)</span></div>
        </div>
        <div style="margin-bottom:16px;">
            <label style="font-size:0.8rem;font-weight:600;color:var(--text);">🧪 pH Range</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
                <div><div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Min pH</div><input type="number" id="profilePhMin" value="${profile.phMin}" min="4.0" max="7.0" step="0.1" style="${numberInputStyle()}"></div>
                <div><div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Max pH</div><input type="number" id="profilePhMax" value="${profile.phMax}" min="4.0" max="8.0" step="0.1" style="${numberInputStyle()}"></div>
            </div>
        </div>
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <label style="font-size:0.8rem;font-weight:600;color:var(--text);">☀️ Light Threshold (raw)</label>
                <span id="lightVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${profile.lightThreshold}</span>
            </div>
            <input type="range" id="profileLight" min="200" max="3000" step="100" value="${profile.lightThreshold}" style="width:100%;accent-color:var(--accent);">
            <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>Dark (200)</span><span>Bright (3000)</span></div>
        </div>
        <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <label style="font-size:0.8rem;font-weight:600;color:var(--text);">🚿 Watering Duration</label>
                <span id="waterDurVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${profile.wateringDuration}s</span>
            </div>
            <input type="range" id="profileWaterDur" min="3" max="60" step="1" value="${profile.wateringDuration}" style="width:100%;accent-color:var(--accent);">
            <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>3 sec</span><span>60 sec</span></div>
        </div>`;
}

function automationSection(profile) {
    return `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🤖 AUTOMATION</div>
            ${_toggle('Auto Watering', 'toggleAutoWater', '💧 Automatically trigger pump when soil is dry', profile.autoWater)}
            ${_toggle('AI Notifications', 'toggleNotifications', '🔔 Get alerts for anomalies and harvest reminders', profile.notifications)}
            ${_toggle('Eco Mode', 'toggleEcoMode', '🌿 Prioritise energy saving over performance', profile.ecoMode)}
        </div>`;
}

function _settingInput(label, id, value, type = 'text', placeholder = '') {
    return `
        <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;font-weight:600;color:var(--sub);display:block;margin-bottom:6px;">${label}</label>
            <input type="${type}" id="${id}" value="${_escAttr(String(value))}" placeholder="${_escAttr(placeholder)}" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);color:var(--text);font-family:inherit;font-size:0.85rem;outline:none;transition:border-color 0.15s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>`;
}

function _toggle(label, id, desc, checked) {
    return `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
            <div><div style="font-size:0.85rem;font-weight:600;color:var(--text);">${label}</div><div style="font-size:0.7rem;color:var(--muted);margin-top:2px;">${desc}</div></div>
            <label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;margin-left:12px;">
                <input type="checkbox" id="${id}" class="auto-toggle" ${checked ? 'checked' : ''} style="opacity:0;width:0;height:0;">
                <span style="position:absolute;inset:0;background:${checked ? 'var(--accent)' : 'var(--border)'};border-radius:100px;cursor:pointer;transition:background 0.2s;" id="${id}_track"></span>
                <span style="position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:transform 0.2s;transform:${checked ? 'translateX(20px)' : 'none'};" id="${id}_thumb"></span>
            </label>
        </div>`;
}

function numberInputStyle() {
    return 'width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);font-family:\'DM Mono\',monospace;font-size:0.85rem;color:var(--text);outline:none;';
}

function loadSavedFarms() {
    try {
        return JSON.parse(localStorage.getItem(FARMS_KEY)) || [];
    } catch {
        return [];
    }
}

function setInputValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function _on(id, evt, fn) { document.getElementById(id)?.addEventListener(evt, fn); }
function _val(id) { return document.getElementById(id)?.value ?? ''; }
function _esc(s) {
    return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
function _escAttr(s) {
    return _esc(s).replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function _slider(sliderId, labelId, fmt) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(labelId);
    if (!slider || !label) return;
    slider.addEventListener('input', () => { label.textContent = fmt(slider.value); });
}

function _setToggle(id, checked) {
    const cb = document.getElementById(id);
    const track = document.getElementById(`${id}_track`);
    const thumb = document.getElementById(`${id}_thumb`);
    if (!cb || !track || !thumb) return;
    cb.checked = checked;
    track.style.background = checked ? 'var(--accent)' : 'var(--border)';
    thumb.style.transform = checked ? 'translateX(20px)' : 'none';
}


