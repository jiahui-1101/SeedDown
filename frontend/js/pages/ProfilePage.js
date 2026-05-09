/* ============================================================
   MODULE: PROFILE PAGE
   ProfilePage.js — User profile + farm settings
   Export: { render }
   ============================================================ */

import { showScreen } from '../utils/navigation.js';
import { showToast }  from '../utils/toast.js';
import { AppState }   from '../store.js';

/* ── LOCAL STORAGE KEYS ── */
const PROFILE_KEY = 'farm_profile';
const FARMS_KEY = 'user_farms'; 

/* ── LOAD / SAVE PROFILE ── */
function loadProfile() {
    try {
        const saved = localStorage.getItem(PROFILE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch { return null; }
}

function saveProfile(data) {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(data)); } catch {}
}

/* ── DEFAULT PROFILE ── */
function getDefaultProfile() {
    return {
        name:       'UTM Farmer',
        email:      'farmer@seeddown.com',
        farmName:   AppState.farmName || 'Farm 1 — Rack Alpha',
        deviceId:   'farm_001',
        sensorIntervalMinutes: 60,
        soilDryThreshold:      1800,
        phMin:                 5.5,
        phMax:                 6.5,
        lightThreshold:        1500,
        wateringDuration:      10,
        notifications:         true,
        autoWater:             true,
        ecoMode:               false,
    };
}

/* ══════════════════════════════════════════════
   RENDER
══════════════════════════════════════════════ */
export function render() {
    const container = document.getElementById('screenContainer');
    const profile = { ...getDefaultProfile(), ...(loadProfile() || {}) };

    let savedFarms = [];
    try {
        savedFarms = JSON.parse(localStorage.getItem(FARMS_KEY)) || [];
    } catch (e) { savedFarms = []; }

    if (!AppState.currentFarmId && savedFarms.length > 0) {
        AppState.currentFarmId = savedFarms[0].id;
        AppState.farmName = savedFarms[0].name;
    }

    container.innerHTML = `
        <div class="screen active" id="profileScreen">

            <div class="topbar">
                <button id="profileBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;">←</button>
                <div style="font-weight:700;">My Profile</div>
                <div style="flex:1;"></div>
                <button id="profileSaveBtn" style="
                    background:var(--accent); color:white; border:none;
                    padding:6px 14px; border-radius:10px;
                    font-size:0.75rem; font-weight:700; cursor:pointer;
                ">Save</button>
            </div>

            <div class="bottom-nav">
                <div class="nav-item" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item active" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>

            <div style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:16px;">

                <div style="background:var(--accent-l); border:1px solid var(--accent); border-radius:var(--radius); padding:14px; flex-shrink: 0;">
                    <label style="font-size:0.65rem; font-weight:700; color:var(--accent); display:block; margin-bottom:8px;">EDITING FARM:</label>
                    <select id="farmSelector" style="
                        width:100%; padding:10px; border-radius:10px; border:1px solid var(--accent);
                        background:white; color:var(--text); font-weight:600; outline:none; font-family:inherit;
                    ">
                        ${savedFarms.map(f => `
                            <option value="${f.id}" ${f.id === AppState.currentFarmId ? 'selected' : ''}>
                                ${f.name} (Zone ${f.zone})
                            </option>
                        `).join('')}
                        ${savedFarms.length === 0 ? '<option disabled>No farms available</option>' : ''}
                    </select>
                </div>

                <div style="
                    background:var(--surface);
                    border:1px solid var(--border);
                    border-radius:var(--radius-lg);
                    padding:24px 20px;
                    display:flex; align-items:center; gap:16px;
                    box-shadow:var(--shadow-sm);
                    position:relative; overflow:hidden;
                    flex-shrink: 0;
                ">
                    <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:var(--accent-s);border-radius:50%;"></div>

                    <div id="profileAvatar" style="
                        width:64px; height:64px; border-radius:20px;
                        background:var(--accent-l); border:2px solid var(--accent);
                        display:flex; align-items:center; justify-content:center;
                        font-size:2rem; flex-shrink:0; cursor:pointer;
                        transition:var(--transition);
                    " title="Tap to change avatar">🧑‍🌾</div>

                    <div style="flex:1; min-width:0; position:relative; z-index:1;">
                        <input id="profileName" value="${_esc(profile.name)}" style="
                            font-size:1.1rem; font-weight:700; color:var(--text);
                            background:transparent; border:none; border-bottom:1px solid var(--border);
                            width:100%; padding:2px 0; outline:none; font-family:inherit;
                        " placeholder="Your name">
                        <input id="profileEmail" value="${_esc(profile.email)}" style="
                            font-size:0.78rem; color:var(--sub);
                            background:transparent; border:none;
                            width:100%; padding:2px 0; outline:none; font-family:inherit; margin-top:4px;
                        " placeholder="email@example.com">
                        <div style="margin-top:8px;">
                            <span class="status-chip chip-ok">
                                ${AppState.mode === 'commercial' ? '🏭 Commercial' : '🌱 Beginner'} Mode
                            </span>
                        </div>
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm); flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🌿 FARM IDENTITY</div>
                    ${_settingInput('Farm Name', 'profileFarmName', profile.farmName, 'text', 'e.g. Rack Alpha — Level 3')}
                    ${_settingInput('Device ID', 'profileDeviceId', profile.deviceId, 'text', 'e.g. farm_001')}
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm); flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">⚙️ SENSOR THRESHOLDS</div>

                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <label style="font-size:0.8rem;font-weight:600;color:var(--text);">📡 Sensor Interval</label>
                            <span id="intervalVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${profile.sensorIntervalMinutes} min</span>
                        </div>
                        <input type="range" id="profileInterval" min="5" max="120" step="5" value="${profile.sensorIntervalMinutes}" style="width:100%;accent-color:var(--accent);">
                        <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>5 min</span><span>120 min</span></div>
                    </div>

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
                            <div>
                                <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Min pH</div>
                                <input type="number" id="profilePhMin" value="${profile.phMin}" min="4.0" max="7.0" step="0.1" style="
                                    width:100%;padding:8px 10px;border:1px solid var(--border);
                                    border-radius:var(--radius-sm);background:var(--surface2);
                                    font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--text);outline:none;
                                ">
                            </div>
                            <div>
                                <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Max pH</div>
                                <input type="number" id="profilePhMax" value="${profile.phMax}" min="4.0" max="8.0" step="0.1" style="
                                    width:100%;padding:8px 10px;border:1px solid var(--border);
                                    border-radius:var(--radius-sm);background:var(--surface2);
                                    font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--text);outline:none;
                                ">
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <label style="font-size:0.8rem;font-weight:600;color:var(--text);">☀️ Light Threshold (lux)</label>
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
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm); flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🤖 AUTOMATION</div>

                    ${_toggle('Auto Watering', 'toggleAutoWater', '💧 Automatically trigger pump when soil is dry', profile.autoWater)}
                    ${_toggle('AI Notifications', 'toggleNotifications', '🔔 Get alerts for anomalies and harvest reminders', profile.notifications)}
                    ${_toggle('Eco Mode', 'toggleEcoMode', '🌿 Prioritise energy saving over performance', profile.ecoMode)}
                </div>

                <button id="profileSyncBtn" style="
                    width:100%; padding:14px; border:none; border-radius:var(--radius);
                    background:var(--accent-l); color:var(--accent); flex-shrink: 0;
                    font-weight:700; font-size:0.9rem; cursor:pointer;
                    transition:var(--transition); display:flex; align-items:center; justify-content:center; gap:8px;
                ">
                    <span id="syncBtnIcon">☁️</span> Sync Settings to Device
                </button>

                <div style="background:rgba(220,38,38,0.04);border:1px solid rgba(220,38,38,0.15);border-radius:var(--radius);padding:18px; flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--danger);letter-spacing:0.08em;margin-bottom:14px;">⚠️ DANGER ZONE</div>
                    <button id="profileLogoutBtn" style="
                        width:100%; padding:12px; border:1px solid var(--danger);
                        background:transparent; color:var(--danger);
                        border-radius:var(--radius-sm); font-weight:700; font-size:0.85rem; cursor:pointer;
                    ">🚪 Log Out</button>
                </div>

                <div style="height:8px; flex-shrink:0;"></div>

            </div>
        </div>
    `;

    _bindEvents(profile, savedFarms);
}

/* ══════════════════════════════════════════════
   BIND EVENTS
══════════════════════════════════════════════ */
function _bindEvents(profile, savedFarms) {
    const selector = document.getElementById('farmSelector');
    if (selector) {
        selector.addEventListener('change', (e) => {
            const selectedId = e.target.value;
            const selectedFarm = savedFarms.find(f => f.id === selectedId);
            if (selectedFarm) {
                AppState.currentFarmId = selectedId;
                AppState.farmName = selectedFarm.name;
              
                document.getElementById('profileFarmName').value = selectedFarm.name;
                showToast('info', `Switched to ${selectedFarm.name}`);
            }
        });
    }

    _on('profileBackBtn', 'click', () => {
        showScreen('farmlist');
    });

    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.getAttribute('data-screen');
            if (screen === 'farmlist') showScreen('farmlist');
        });
    });

    // ── Avatar picker ──
    const AVATARS = ['🧑‍🌾','👩‍🌾','🌱','🤖','🧪','🌿','🏭','👨‍💻'];
    let avatarIdx = 0;
    _on('profileAvatar', 'click', () => {
        avatarIdx = (avatarIdx + 1) % AVATARS.length;
        document.getElementById('profileAvatar').textContent = AVATARS[avatarIdx];
    });

    // ── Sliders ──
    _slider('profileInterval',  'intervalVal',  v => `${v} min`);
    _slider('profileSoil',      'soilVal',      v => v);
    _slider('profileLight',     'lightVal',     v => v);
    _slider('profileWaterDur',  'waterDurVal',  v => `${v}s`);

    document.querySelectorAll('.auto-toggle').forEach(cb => {
        const track = document.getElementById(`${cb.id}_track`);
        const thumb = document.getElementById(`${cb.id}_thumb`);
        cb.addEventListener('change', () => {
            track.style.background = cb.checked ? 'var(--accent)' : 'var(--border)';
            thumb.style.transform  = cb.checked ? 'translateX(20px)' : 'none';
        });
    });

    // ── Save (local) ──
    _on('profileSaveBtn', 'click', () => _doSave());

    // ── Sync to backend ──
    _on('profileSyncBtn', 'click', () => _doSync());

    // ── Logout ──
    _on('profileLogoutBtn', 'click', () => {
        showToast('info', '👋 Logged out. See you next harvest!');
        setTimeout(() => showScreen('login'), 800);
    });
}

/* ── SAVE TO LOCALSTORAGE*/
function _doSave() {
    const profile = _collectForm();
    
    saveProfile(profile);

    AppState.farmName = profile.farmName;
    AppState.notify?.();

    try {
        let savedFarms = JSON.parse(localStorage.getItem(FARMS_KEY)) || [];
        const currentId = AppState.currentFarmId;

        if (currentId) {
            
            savedFarms = savedFarms.map(f => {
                if (f.id === currentId) {
                    return { ...f, name: profile.farmName };
                }
                return f;
            });
            localStorage.setItem(FARMS_KEY, JSON.stringify(savedFarms));
            console.log(`[ProfilePage] Updated farm ID ${currentId} with name: ${profile.farmName}`);
        }
    } catch (e) {
        console.error('Error updating farm list names:', e);
    }

    showToast('success', '✅ Profile saved!');

    setTimeout(() => {
        showScreen('farmlist');
    }, 400);
}

/* ── SYNC PREFERENCES TO BACKEND ── */
async function _doSync() {
    const profile = _collectForm();
    saveProfile(profile);

    const icon = document.getElementById('syncBtnIcon');
    const btn  = document.getElementById('profileSyncBtn');
    btn.disabled = true;
    icon.textContent = '⏳';

    const BASE_URL = 'http://localhost:3000';
    const payload = {
        deviceId:               profile.deviceId || 'farm_001',
        sensorIntervalSeconds:  profile.sensorIntervalMinutes * 60,
        soilDryThreshold:       profile.soilDryThreshold,
        phMin:                  profile.phMin,
        phMax:                  profile.phMax,
        darkThreshold:          profile.lightThreshold,
        wateringDurationSeconds: profile.wateringDuration,
        autoWater:              profile.autoWater,
        notifications:          profile.notifications,
        ecoMode:                profile.ecoMode
    };

    try {
        const res = await fetch(`${BASE_URL}/api/sensors/preferences`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        icon.textContent = '✅';
        showToast('success', '☁️ Settings synced to device!');
    } catch (err) {
        icon.textContent = '⚠️';
        showToast('error', `Sync failed: ${err.message}. Settings saved locally.`);
        console.warn('[ProfilePage] Sync error:', err);
    } finally {
        setTimeout(() => {
            icon.textContent = '☁️';
            btn.disabled = false;
        }, 2000);
    }
}

/* ── COLLECT FORM VALUES ── */
function _collectForm() {
    return {
        name:                  _val('profileName'),
        email:                 _val('profileEmail'),
        farmName:              _val('profileFarmName'),
        deviceId:              _val('profileDeviceId') || 'farm_001',
        sensorIntervalMinutes: parseInt(_val('profileInterval'))  || 60,
        soilDryThreshold:      parseInt(_val('profileSoil'))      || 1800,
        phMin:                 parseFloat(_val('profilePhMin'))   || 5.5,
        phMax:                 parseFloat(_val('profilePhMax'))   || 6.5,
        lightThreshold:        parseInt(_val('profileLight'))     || 1500,
        wateringDuration:      parseInt(_val('profileWaterDur'))  || 10,
        autoWater:             document.getElementById('toggleAutoWater')?.checked ?? true,
        notifications:         document.getElementById('toggleNotifications')?.checked ?? true,
        ecoMode:               document.getElementById('toggleEcoMode')?.checked ?? false,
    };
}

/* ══════════════════════════════════════════════
   HTML HELPERS
══════════════════════════════════════════════ */
function _settingInput(label, id, value, type = 'text', placeholder = '') {
    return `
        <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;font-weight:600;color:var(--sub);display:block;margin-bottom:6px;">${label}</label>
            <input type="${type}" id="${id}" value="${_esc(String(value))}" placeholder="${placeholder}" style="
                width:100%; padding:10px 12px;
                border:1px solid var(--border); border-radius:var(--radius-sm);
                background:var(--surface2); color:var(--text);
                font-family:inherit; font-size:0.85rem; outline:none;
                transition:border-color 0.15s;
            " onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>
    `;
}

function _toggle(label, id, desc, checked) {
    return `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
            <div>
                <div style="font-size:0.85rem;font-weight:600;color:var(--text);">${label}</div>
                <div style="font-size:0.7rem;color:var(--muted);margin-top:2px;">${desc}</div>
            </div>
            <label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;margin-left:12px;">
                <input type="checkbox" id="${id}" class="auto-toggle" ${checked ? 'checked' : ''} style="opacity:0;width:0;height:0;">
                <span style="
                    position:absolute;inset:0;
                    background:${checked ? 'var(--accent)' : 'var(--border)'};border-radius:100px;cursor:pointer;
                    transition:background 0.2s;
                " id="${id}_track"></span>
                <span style="
                    position:absolute;top:3px;left:3px;
                    width:18px;height:18px;border-radius:50%;
                    background:white;box-shadow:0 1px 3px rgba(0,0,0,0.2);
                    transition:transform 0.2s;
                    transform:${checked ? 'translateX(20px)' : 'none'};
                " id="${id}_thumb"></span>
            </label>
        </div>
    `;
}

/* ── MICRO HELPERS ── */
function _on(id, evt, fn) { document.getElementById(id)?.addEventListener(evt, fn); }
function _val(id)         { return document.getElementById(id)?.value ?? ''; }
function _esc(s)          { return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

function _slider(sliderId, labelId, fmt) {
    const slider = document.getElementById(sliderId);
    const label  = document.getElementById(labelId);
    if (!slider || !label) return;
    slider.addEventListener('input', () => { label.textContent = fmt(slider.value); });
}