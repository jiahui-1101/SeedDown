import { API_BASE } from '../utils/apiBase.js';
/* ============================================================
   MODULE: PROFILE PAGE
   ProfilePage.js — User profile + sensor interval + notifications
   Automation toggles (autoWater, ecoMode) removed — set in BuildFarmPage.
   Notifications: real browser push via Notification API.
   ============================================================ */

import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';

const PROFILE_KEY = 'farm_profile';
const FARMS_KEY   = 'user_farms';


/* ── JWT HEADER HELPER ── */
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

/* ── PER-FARM KEY ── */
function farmProfileKey(farmId) { return `farm_profile_${farmId}`; }

/* ── LOAD / SAVE ── */
function loadProfile(farmId) {
    try {
        if (farmId) {
            const perFarm = localStorage.getItem(farmProfileKey(farmId));
            if (perFarm) return JSON.parse(perFarm);
        }
        const saved = localStorage.getItem(PROFILE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch { return null; }
}

function saveProfile(data, farmId) {
    try {
        if (farmId) localStorage.setItem(farmProfileKey(farmId), JSON.stringify(data));
        localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: data.name, email: data.email }));
    } catch {}
}

function getDefaultProfile() {
    return {
        name:                  'UTM Farmer',
        email:                 'farmer@seeddown.com',
        farmName:              AppState.farmName || 'Farm 1 - Rack Alpha',
        deviceId:              '',
        sensorIntervalMinutes: 60,
        soilDryThreshold:      1800,
        phMin:                 5.5,
        phMax:                 6.5,
        lightThreshold:        1500,
        wateringDuration:      10,
        notifications:         true,  // only toggle kept
    };
}

/* ============================================================
   RENDER
============================================================ */
export function render() {
    const container  = document.getElementById('screenContainer');
    const savedFarms = loadSavedFarms();

    if (!AppState.currentFarmId && savedFarms.length > 0) {
        AppState.currentFarmId = savedFarms[0].id;
        AppState.currentFarm   = savedFarms[0];
        AppState.farmName      = savedFarms[0].name;
    }

    const selectedFarm = AppState.currentFarm || savedFarms.find(f => f.id === AppState.currentFarmId) || null;
    const profile      = {
        ...getDefaultProfile(),
        farmName: selectedFarm?.name || AppState.farmName || getDefaultProfile().farmName,
        deviceId: selectedFarm?.deviceId || selectedFarm?.farmMaster?.deviceId || '',
        ...(loadProfile(AppState.currentFarmId) || {}),
    };
    const isCommercial = AppState.mode === 'commercial';

    // Reflect real browser notification permission in the toggle
    const notifPermission  = ('Notification' in window) ? Notification.permission : 'default';
    const notifGranted     = notifPermission === 'granted';
    const notifBlocked     = notifPermission === 'denied';
    // If browser blocked, show disabled toggle regardless of saved pref
    const notifChecked     = notifBlocked ? false : (profile.notifications && notifGranted ? true : profile.notifications);

    container.innerHTML = `
        <div class="screen active" id="profileScreen">
            <div class="topbar">
                <button id="profileBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;">←</button>
                <div style="font-weight:700;">Profile</div>
                <div style="flex:1;"></div>
                <button id="profileSaveBtn" style="background:var(--accent);color:white;border:none;padding:6px 14px;border-radius:10px;font-size:0.75rem;font-weight:700;cursor:pointer;">Save</button>
            </div>

            <div class="bottom-nav">
                <div class="nav-item" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item active" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>

            <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px;">

                ${_farmSelectorSection(savedFarms)}
                ${_profileCard(profile, isCommercial)}
                ${isCommercial ? _farmIdentitySection(profile) : _hiddenIdentityFields(profile)}
                ${_intervalSection(profile)}
                ${_notificationSection(notifChecked, notifBlocked)}

                <button id="profileSyncBtn" style="width:100%;padding:14px;border:none;border-radius:var(--radius);background:var(--accent-l);color:var(--accent);flex-shrink:0;font-weight:700;font-size:0.9rem;cursor:pointer;transition:var(--transition);display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span id="syncBtnIcon">☁️</span> Sync Profile Settings to Device
                </button>

                <div style="background:rgba(220,38,38,0.04);border:1px solid rgba(220,38,38,0.15);border-radius:var(--radius);padding:18px;flex-shrink:0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--danger);letter-spacing:0.08em;margin-bottom:14px;">⚠️ DANGER ZONE</div>
                    <button id="profileLogoutBtn" style="width:100%;padding:12px;border:1px solid var(--danger);background:transparent;color:var(--danger);border-radius:var(--radius-sm);font-weight:700;font-size:0.85rem;cursor:pointer;">🚪 Log Out</button>
                </div>

                <div style="height:8px;flex-shrink:0;"></div>
            </div>
        </div>
    `;

    _bindEvents(savedFarms);
    _fetchFreshProfileData(); // 異步從後端拉取最新用戶資料
}

/* ── 異步向後端請求真實的用戶資料 (替換原本寫死的 LocalStorage) ── */
async function _fetchFreshProfileData() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok && data.ok && data.user) {
            _setInputValue('profileEmail', data.user.email);
            // 如果後端有提供 Name，就在這更新
            if (data.user.name) _setInputValue('profileName', data.user.name);
        }
    } catch (err) {
        console.warn('[ProfilePage] Failed to fetch fresh profile data:', err);
    }
}

/* ── NOTIFICATION SECTION with real browser push UI ── */
function _notificationSection(checked, blocked) {
    const statusText = blocked
        ? '⚠️ Blocked by browser — enable in site settings'
        : checked
            ? '✅ Active — you will receive farm alerts'
            : '🔕 Off — enable to get anomaly & harvest alerts';

    const statusColor = blocked ? '#dc2626' : checked ? '#16a34a' : '#64748b';

    return `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🔔 NOTIFICATIONS</div>

            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
                <div>
                    <div style="font-size:0.85rem;font-weight:600;color:var(--text);">Farm Alerts</div>
                    <div style="font-size:0.7rem;color:var(--muted);margin-top:2px;">Anomaly alerts, harvest reminders, pH warnings</div>
                    <div style="font-size:0.68rem;color:${statusColor};margin-top:4px;font-weight:600;">${statusText}</div>
                </div>
                <label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;margin-left:12px;">
                    <input type="checkbox" id="toggleNotifications" class="auto-toggle"
                        ${checked ? 'checked' : ''}
                        ${blocked ? 'disabled' : ''}
                        style="opacity:0;width:0;height:0;">
                    <span style="position:absolute;inset:0;background:${checked && !blocked ? 'var(--accent)' : 'var(--border)'};border-radius:100px;cursor:${blocked ? 'not-allowed' : 'pointer'};transition:background 0.2s;opacity:${blocked ? '0.5' : '1'};" id="toggleNotifications_track"></span>
                    <span style="position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:transform 0.2s;transform:${checked && !blocked ? 'translateX(20px)' : 'none'};" id="toggleNotifications_thumb"></span>
                </label>
            </div>

            ${blocked ? `
                <div style="margin-top:12px;padding:10px;background:#fef2f2;border-radius:8px;font-size:0.75rem;color:#dc2626;line-height:1.4;">
                    🚫 Notifications are blocked for this site. To enable:<br>
                    Click the 🔒 icon in your browser address bar → Site settings → Notifications → Allow
                </div>
            ` : ''}

            <button id="testNotifBtn" style="
                margin-top:12px;width:100%;padding:9px;border:1px solid var(--border);
                border-radius:10px;background:var(--surface2);color:var(--text);
                font-size:0.78rem;font-weight:600;cursor:pointer;
                ${blocked ? 'opacity:0.4;pointer-events:none;' : ''}
            ">🔔 Send Test Notification</button>
        </div>`;
}

/* ============================================================
   BIND EVENTS
============================================================ */
function _bindEvents(savedFarms) {
    const selector = document.getElementById('farmSelector');
    if (selector) {
        selector.addEventListener('change', (e) => {
            const selectedId   = e.target.value;
            const selectedFarm = savedFarms.find(f => f.id === selectedId);
            if (!selectedFarm) return;

            AppState.currentFarmId = selectedId;
            AppState.currentFarm   = selectedFarm;
            AppState.farmName      = selectedFarm.name;

            const farmProfile = {
                ...getDefaultProfile(),
                deviceId: selectedFarm.deviceId || selectedFarm.farmMaster?.deviceId || '',
                ...(loadProfile(selectedId) || {}),
                farmName: selectedFarm.name,
            };

            _setInputValue('profileFarmName', farmProfile.farmName);
            _setInputValue('profileDeviceId', farmProfile.deviceId);
            _setInputValue('profileInterval',  farmProfile.sensorIntervalMinutes);
            _setText('intervalVal', `${farmProfile.sensorIntervalMinutes} min`);
            _setToggle('toggleNotifications', farmProfile.notifications);

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

    /* ── Notification toggle — requests browser permission ── */
    const notifToggle = document.getElementById('toggleNotifications');
    if (notifToggle) {
        notifToggle.addEventListener('change', async () => {
            if (notifToggle.checked) {
                // Request browser permission
                if ('Notification' in window) {
                    const perm = await Notification.requestPermission();
                    if (perm === 'granted') {
                        _setToggle('toggleNotifications', true);
                        showToast('success', '🔔 Notifications enabled!');
                        _scheduleTestNotification();
                    } else if (perm === 'denied') {
                        _setToggle('toggleNotifications', false);
                        showToast('error', '🚫 Notifications blocked — change in browser settings');
                        notifToggle.disabled = true;
                        document.getElementById('toggleNotifications_track').style.opacity = '0.5';
                        document.getElementById('toggleNotifications_track').style.cursor  = 'not-allowed';
                    } else {
                        // dismissed
                        _setToggle('toggleNotifications', false);
                    }
                } else {
                    showToast('error', '⚠️ Your browser does not support notifications');
                    _setToggle('toggleNotifications', false);
                }
            } else {
                _setToggle('toggleNotifications', false);
                showToast('info', '🔕 Notifications disabled');
            }
        });
    }

    /* ── Test notification button ── */
    _on('testNotifBtn', 'click', async () => {
        if (!('Notification' in window)) {
            showToast('error', 'Notifications not supported'); return;
        }
        if (Notification.permission !== 'granted') {
            const perm = await Notification.requestPermission();
            if (perm !== 'granted') {
                showToast('error', '🚫 Permission denied'); return;
            }
            _setToggle('toggleNotifications', true);
        }
        _fireNotification(
            '🌱 SeedDown Test Alert',
            `Farm "${AppState.farmName}" notifications are working!`,
            '✅'
        );
        showToast('success', '🔔 Test notification sent!');
    });

    _on('profileSaveBtn', 'click', _doSave);
    _on('profileSyncBtn', 'click', _doSync);
    _on('profileLogoutBtn', 'click', _doLogout);
}

/* ── FIRE BROWSER NOTIFICATION ── */
function _fireNotification(title, body, icon = '🌿') {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
        new Notification(title, {
            body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">' + icon + '</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌿</text></svg>',
            tag:   'seeddown-farm-alert',
        });
    } catch (e) {
        console.warn('[ProfilePage] Notification error:', e);
    }
}

/* ── Schedule a gentle welcome notification 3 seconds after enabling ── */
function _scheduleTestNotification() {
    setTimeout(() => {
        _fireNotification(
            '🌿 SeedDown Notifications Active',
            `You'll now receive alerts for ${AppState.farmName}. Happy farming!`,
            '🌱'
        );
    }, 3000);
}

/* ── Export notification helper so other pages can fire alerts ── */
export function sendFarmNotification(title, body) {
    _fireNotification(title, body);
}

/* ── SAVE ── */
function _doSave() {
    const profile   = _collectForm();
    const currentId = AppState.currentFarmId;

    saveProfile(profile, currentId);
    AppState.farmName = profile.farmName;
    AppState.notify?.();

    try {
        let savedFarms = loadSavedFarms();
        if (currentId) {
            savedFarms = savedFarms.map(f => f.id === currentId ? { ...f, name: profile.farmName } : f);
            localStorage.setItem(FARMS_KEY, JSON.stringify(savedFarms));
            
            // ─── 替換掉了原本的 Firebase SDK，改為呼叫後端 API 來更新資料（若後端有對應接口） ───
            const token = localStorage.getItem('token');
            if (token) {
                fetch(`${API_BASE}/api/auth/profile`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ name: profile.name, email: profile.email })
                }).catch(() => {});
            }
        }
    } catch (e) {
        console.error('Error updating farm list:', e);
    }

    showToast('success', '✅ Profile saved!');
    setTimeout(() => showScreen(AppState.profileFrom || 'home'), 400);
}

/* ── SYNC TO DEVICE ── */
async function _doSync() {
    const profile = _collectForm();
    if (!profile.deviceId) {
        showToast('warning', 'Assign or register a device before syncing settings.');
        return;
    }
    saveProfile(profile, AppState.currentFarmId);

    const icon = document.getElementById('syncBtnIcon');
    const btn  = document.getElementById('profileSyncBtn');
    btn.disabled     = true;
    icon.textContent = '⏳';

    const payload = {
        deviceId:              profile.deviceId,
        sensorIntervalSeconds: profile.sensorIntervalMinutes * 60,
        notifications:         profile.notifications,
    };

    try {
        const res = await fetch(`${API_BASE}/api/sensors/preferences`, {
            method:  'PUT',
            headers: getAuthHeaders(), // <--- 加上 Authorization Token
            body:    JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        icon.textContent = '✅';
        showToast('success', '☁️ Settings synced to device!');
    } catch (err) {
        icon.textContent = '⚠️';
        showToast('error', `Sync failed: ${err.message}. Saved locally.`);
    } finally {
        setTimeout(() => { icon.textContent = '☁️'; btn.disabled = false; }, 2000);
    }
}

/* ── LOGOUT ── */
function _doLogout() {
    // 徹底廢除 Firebase Logout，改為清除 JWT Token
    localStorage.removeItem('token');
    localStorage.removeItem('seeddown_mode');
    localStorage.removeItem('seeddown_user');
    localStorage.removeItem('user_farms');
    localStorage.removeItem('farm_profile');
    
    AppState.uid       = null;
    AppState.userEmail = '';
    AppState.userName  = '';
    AppState.isGuest   = false;
    AppState.currentFarmId = null;
    AppState.currentFarm = null;
    AppState.farmName = 'My Farm';
    
    showToast('info', '👋 Logged out. See you next harvest!');
    setTimeout(() => showScreen('login'), 800);
}

/* ── COLLECT FORM ── */
function _collectForm() {
    const existing = { ...getDefaultProfile(), ...(loadProfile(AppState.currentFarmId) || {}) };
    return {
        ...existing,
        name:                  _val('profileName')     || existing.name,
        email:                 _val('profileEmail')    || existing.email,
        farmName:              _val('profileFarmName') || AppState.farmName || existing.farmName,
        deviceId:              _val('profileDeviceId') || existing.deviceId || '',
        sensorIntervalMinutes: parseInt(_val('profileInterval'), 10) || existing.sensorIntervalMinutes || 60,
        notifications:         document.getElementById('toggleNotifications')?.checked ?? existing.notifications ?? true,
    };
}

/* ============================================================
   HTML HELPERS
============================================================ */
function _farmSelectorSection(savedFarms) {
    return `
        <div style="background:var(--accent-l);border:1px solid var(--accent);border-radius:var(--radius);padding:14px;flex-shrink:0;">
            <label style="font-size:0.65rem;font-weight:700;color:var(--accent);display:block;margin-bottom:8px;">EDITING FARM</label>
            <select id="farmSelector" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--accent);background:white;color:var(--text);font-weight:600;outline:none;font-family:inherit;">
                ${savedFarms.map(f => `<option value="${_escAttr(f.id)}" ${f.id === AppState.currentFarmId ? 'selected' : ''}>${_esc(f.name)} (${_esc(f.zone || f.location || 'Field')})</option>`).join('')}
                ${savedFarms.length === 0 ? '<option disabled>No farms available</option>' : ''}
            </select>
        </div>`;
}

function _profileCard(profile, isCommercial) {
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

function _farmIdentitySection(profile) {
    return `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🌿 FARM IDENTITY</div>
            ${_settingInput('Farm Name', 'profileFarmName', profile.farmName, 'text', 'e.g. Rack Alpha - Level 3')}
            ${_settingInput('Device ID',  'profileDeviceId',  profile.deviceId,  'text', 'Not assigned yet')}
        </div>`;
}

function _hiddenIdentityFields(profile) {
    return `
        <input type="hidden" id="profileFarmName" value="${_escAttr(profile.farmName)}">
        <input type="hidden" id="profileDeviceId"  value="${_escAttr(profile.deviceId)}">
    `;
}

function _intervalSection(profile) {
    return `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">📡 SENSOR INTERVAL</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <label style="font-size:0.8rem;font-weight:600;color:var(--text);">ESP32 report interval</label>
                <span id="intervalVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${profile.sensorIntervalMinutes} min</span>
            </div>
            <input type="range" id="profileInterval" min="5" max="120" step="5" value="${profile.sensorIntervalMinutes}" style="width:100%;accent-color:var(--accent);">
            <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>5 min</span><span>120 min</span></div>
        </div>`;
}

function _settingInput(label, id, value, type = 'text', placeholder = '') {
    return `
        <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;font-weight:600;color:var(--sub);display:block;margin-bottom:6px;">${label}</label>
            <input type="${type}" id="${id}" value="${_escAttr(String(value))}" placeholder="${_escAttr(placeholder)}" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);color:var(--text);font-family:inherit;font-size:0.85rem;outline:none;transition:border-color 0.15s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>`;
}

/* ── MICRO HELPERS ── */
function loadSavedFarms() {
    try { return JSON.parse(localStorage.getItem(FARMS_KEY)) || []; }
    catch { return []; }
}

function _on(id, evt, fn) { document.getElementById(id)?.addEventListener(evt, fn); }
function _val(id)         { return document.getElementById(id)?.value ?? ''; }
function _esc(s)          { return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function _escAttr(s)      { return _esc(s).replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }

function _setInputValue(id, value) { const el = document.getElementById(id); if (el) el.value = value; }
function _setText(id, value)       { const el = document.getElementById(id); if (el) el.textContent = value; }

function _slider(sliderId, labelId, fmt) {
    const slider = document.getElementById(sliderId);
    const label  = document.getElementById(labelId);
    if (!slider || !label) return;
    slider.addEventListener('input', () => { label.textContent = fmt(slider.value); });
}

function _setToggle(id, checked) {
    const cb    = document.getElementById(id);
    const track = document.getElementById(`${id}_track`);
    const thumb = document.getElementById(`${id}_thumb`);
    if (!cb || !track || !thumb) return;
    cb.checked             = checked;
    track.style.background = checked ? 'var(--accent)' : 'var(--border)';
    thumb.style.transform  = checked ? 'translateX(20px)' : 'none';
}
