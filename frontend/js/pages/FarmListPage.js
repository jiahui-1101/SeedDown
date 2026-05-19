import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';
import { saveFarmsToFirestore } from '../utils/firebase.js';

const FARMS_STORAGE_KEY = 'user_farms';
const COMMERCIAL_ACCOUNT_KEY = 'commercial_account';
const COMMERCIAL_TERMS_KEY = 'commercial_terms_accepted';

export function render() {
    console.log('[FarmListPage] render called');
    const container = document.getElementById('screenContainer');
    let savedFarms = loadSavedFarms();

    if (savedFarms.length === 0) {
        savedFarms = [
            {
                id: `farm_${Date.now()}`,
                name: 'Farm 1 - Rack Alpha',
                plants: 6,
                plantSlots: 6,
                zone: 'A',
                location: 'Zone A',
                targetPlant: 'Lettuce',
                rackLabel: '3-Tier Vertical Rack',
                createdAt: new Date().toISOString(),
            },
        ];
        saveFarms(savedFarms);
    }

    const isCommercial = currentMode() === 'commercial';
    AppState.mode = isCommercial ? 'commercial' : 'beginner';

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
                    <div style="position:relative; width:48px; height:26px; background:${isCommercial ? 'var(--accent)' : 'var(--border)'}; border-radius:100px; transition:background 0.25s;">
                        <div style="position:absolute; top:3px; left:${isCommercial ? '25px' : '3px'}; width:20px; height:20px; border-radius:50%; background:white; box-shadow:0 1px 4px rgba(0,0,0,0.25); transition:left 0.25s;"></div>
                    </div>
                    <span style="font-size:0.72rem; font-weight:700; color:${isCommercial ? 'var(--accent)' : 'var(--muted)'};">🏭</span>
                </div>
            </div>

            <div style="padding:16px; flex:1; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="font-size:0.7rem; font-weight:700; color:var(--sub);">SELECT FIELD (${savedFarms.length})</div>
                    <button id="buildFarmBtn" class="btn-outline" style="padding:6px 12px;">${isCommercial ? '+ New Farm' : '+ New Field'}</button>
                </div>

                <div id="farmList" style="display:flex; flex-direction:column; gap:10px;">
                    ${savedFarms.map(farmCard).join('')}
                </div>
            </div>

            <div class="bottom-nav">
                <div class="nav-item active" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `;

    bindEvents(savedFarms);
}

function bindEvents(savedFarms) {
    document.querySelectorAll('.farm-card').forEach(card => {
        card.addEventListener('click', () => {
            const farm = savedFarms.find(item => item.id === card.dataset.farmId);
            if (farm) enterFarm(farm);
        });
    });

    document.querySelectorAll('.farm-details-btn').forEach(button => {
        button.addEventListener('click', event => {
            event.stopPropagation();
            const farm = savedFarms.find(item => item.id === button.dataset.farmId);
            if (farm) openFarmDetails(farm);
        });
    });

    document.querySelectorAll('.farm-delete-btn').forEach(button => {
        button.addEventListener('click', event => {
            event.stopPropagation();
            const farm = savedFarms.find(item => item.id === button.dataset.farmId);
            if (farm) openDeleteFarmConfirm(farm, savedFarms);
        });
    });

    document.getElementById('buildFarmBtn').onclick = () => {
        const mode = currentMode();
        AppState.mode = mode;
        localStorage.setItem('seeddown_mode', mode);
        localStorage.setItem('seeddown_build_flow', mode);
        showScreen('buildfarm');
    };

    document.getElementById('switchModeBtn').onclick = () => {
        if (AppState.mode === 'beginner') {
            openCommercialGate();
            return;
        }

        AppState.mode = 'beginner';
        localStorage.setItem('seeddown_mode', 'beginner');
        AppState.isGuest = true;
        showToast('info', 'Switched to 🌱 Beginner mode');
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

function currentMode() {
    try {
        return localStorage.getItem('seeddown_mode') === 'commercial' ? 'commercial' : 'beginner';
    } catch {
        return AppState.mode === 'commercial' ? 'commercial' : 'beginner';
    }
}

function openCommercialGate() {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) return;

    const account = getCommercialAccount();
    const hasAccount = Boolean(account?.password);

    modalContainer.innerHTML = `
        <div class="modal-overlay open" id="commercialGateModal">
            <div class="modal-sheet">
                <div style="padding:18px;">
                    <div style="font-size:11px;font-weight:800;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px;">Commercial Access</div>
                    <div style="font-size:18px;font-weight:900;margin-bottom:6px;">Switch to Commercial mode</div>
                    <div style="font-size:13px;color:var(--sub);line-height:1.45;margin-bottom:14px;">
                        ${hasAccount ? 'Enter the same password/key used during Commercial Register.' : 'Create a commercial password/key for this device before entering Commercial mode.'}
                    </div>

                    <label style="display:block;font-size:0.7rem;font-weight:800;margin-bottom:6px;">Password / Access Key</label>
                    <input id="commercialGatePassword" type="password" placeholder="Minimum 6 characters" style="width:100%;box-sizing:border-box;padding:12px;border-radius:12px;border:1px solid var(--border);margin-bottom:12px;">

                    <label style="display:flex;gap:10px;align-items:flex-start;font-size:0.76rem;color:var(--muted);line-height:1.4;margin-bottom:12px;">
                        <input id="commercialGateTerms" type="checkbox" style="margin-top:2px;">
                        <span>I agree to the Commercial Terms & Conditions and understand this mode can affect automation controls.</span>
                    </label>

                    <div id="commercialGateError" style="display:none;color:var(--danger);font-size:0.76rem;margin-bottom:12px;"></div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <button id="cancelCommercialGate" style="padding:13px;border:1px solid var(--border);border-radius:12px;background:var(--surface2);font-weight:800;cursor:pointer;color:var(--text);">Cancel</button>
                        <button id="confirmCommercialGate" class="btn-primary" style="padding:13px;">Enter</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const showError = (message) => {
        const error = document.getElementById('commercialGateError');
        error.textContent = message;
        error.style.display = message ? 'block' : 'none';
    };

    document.getElementById('cancelCommercialGate').onclick = closeFarmModal;
    document.getElementById('commercialGateModal').addEventListener('click', event => {
        if (event.target.id === 'commercialGateModal') closeFarmModal();
    });

    document.getElementById('confirmCommercialGate').onclick = () => {
        const password = document.getElementById('commercialGatePassword').value;
        const termsAccepted = document.getElementById('commercialGateTerms').checked;

        if (password.length < 6) {
            showError('Password/key must be at least 6 characters.');
            return;
        }
        if (!termsAccepted) {
            showError('Please tick the Commercial Terms & Conditions first.');
            return;
        }
        if (hasAccount && password !== account.password) {
            showError('Wrong commercial password/key. Use the same one from Commercial Register.');
            return;
        }

        if (!hasAccount) {
            saveCommercialAccount({
                email: AppState.userEmail || 'commercial@seeddown.local',
                password,
                createdAt: new Date().toISOString(),
            });
        } else {
            localStorage.setItem(COMMERCIAL_TERMS_KEY, 'true');
        }

        AppState.mode = 'commercial';
        localStorage.setItem('seeddown_mode', 'commercial');
        AppState.isGuest = false;
        closeFarmModal();
        showToast('success', 'Switched to 🏭 Commercial mode');
        render();
    };
}

function getCommercialAccount() {
    try {
        return JSON.parse(localStorage.getItem(COMMERCIAL_ACCOUNT_KEY)) || null;
    } catch (error) {
        return null;
    }
}

function saveCommercialAccount(account) {
    localStorage.setItem(COMMERCIAL_ACCOUNT_KEY, JSON.stringify(account));
    localStorage.setItem(COMMERCIAL_TERMS_KEY, 'true');
}
function farmCard(f) {
    return `
        <div class="farm-card" data-farm-id="${escapeAttr(f.id)}" style="background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:14px; display:flex; align-items:center; gap:12px; cursor:pointer;">
            <div style="width:44px; height:44px; background:var(--accent-l); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px;">🏗️</div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(f.name)}</div>
                <div style="font-size:0.7rem; color:var(--muted);">${farmMeta(f)}</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
                <button class="farm-details-btn" data-farm-id="${escapeAttr(f.id)}" title="Field details" aria-label="View field details"
                    style="width:32px;height:32px;border:1px solid var(--border);background:var(--surface2);color:var(--accent);border-radius:10px;font-size:15px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;">i</button>
                <button class="farm-delete-btn" data-farm-id="${escapeAttr(f.id)}" title="Delete field" aria-label="Delete field"
                    style="width:32px;height:32px;border:1px solid rgba(220,38,38,.24);background:rgba(220,38,38,.08);color:var(--danger);border-radius:10px;font-size:15px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
            </div>
        </div>
    `;
}

function openFarmDetails(farm) {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
        <div class="modal-overlay open" id="farmDetailsModal">
            <div class="modal-sheet">
                <div style="padding:18px;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px;">
                        <div>
                            <div style="font-size:11px;font-weight:800;color:var(--muted);letter-spacing:.08em;">FIELD DETAILS</div>
                            <div style="font-size:18px;font-weight:900;margin-top:2px;">${escapeHTML(farm.name)}</div>
                        </div>
                        <button id="closeFarmDetails" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text);">×</button>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
                        ${detailBox('Created', formatDate(farm.createdAt))}
                        ${detailBox('Location', farm.location || farm.zone || 'Not set')}
                        ${detailBox('Rack', farm.rackLabel || farm.rackType || farm.rackTypeId || '3-tier')}
                        ${detailBox('Plants', `${plantCount(farm)} plants`)}
                        ${detailBox('Slots', `${slotCount(farm)} slots`)}
                        ${detailBox('Goal', farm.analysisGoal || 'Not set')}
                    </div>

                    <div style="font-size:11px;font-weight:800;color:var(--muted);letter-spacing:.08em;margin-bottom:8px;">PLANT MAP</div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">${plantChips(farm)}</div>

                    <button id="detailsEnterFarm" class="btn-primary" style="width:100%;">Open Field</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('closeFarmDetails').onclick = closeFarmModal;
    document.getElementById('farmDetailsModal').addEventListener('click', event => {
        if (event.target.id === 'farmDetailsModal') closeFarmModal();
    });
    document.getElementById('detailsEnterFarm').onclick = () => {
        closeFarmModal();
        enterFarm(farm);
    };
}

function openDeleteFarmConfirm(farm, savedFarms) {
    const modalContainer = document.getElementById('modalContainer');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
        <div class="modal-overlay open" id="deleteFarmModal">
            <div class="modal-sheet">
                <div style="padding:18px;">
                    <div style="font-size:18px;font-weight:900;margin-bottom:6px;">Delete field?</div>
                    <div style="font-size:13px;color:var(--sub);line-height:1.45;margin-bottom:14px;">${escapeHTML(farm.name)} will be removed from this device. This cannot be undone.</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <button id="cancelDeleteFarm" style="padding:13px;border:1px solid var(--border);border-radius:12px;background:var(--surface2);font-weight:800;cursor:pointer;color:var(--text);">Cancel</button>
                        <button id="confirmDeleteFarm" style="padding:13px;border:none;border-radius:12px;background:var(--danger);font-weight:800;cursor:pointer;color:#fff;">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('cancelDeleteFarm').onclick = closeFarmModal;
    document.getElementById('deleteFarmModal').addEventListener('click', event => {
        if (event.target.id === 'deleteFarmModal') closeFarmModal();
    });
    document.getElementById('confirmDeleteFarm').onclick = () => deleteFarm(farm.id, savedFarms);
}

function deleteFarm(farmId, savedFarms) {
    const nextFarms = savedFarms.filter(farm => farm.id !== farmId);
    saveFarms(nextFarms);

    if (AppState.currentFarmId === farmId) {
        AppState.currentFarmId = nextFarms[0]?.id || null;
        AppState.currentFarm = nextFarms[0] || null;
        AppState.farmName = nextFarms[0]?.name || 'My Farm';
    }

    closeFarmModal();
    showToast('success', 'Field deleted');
    render();
}

function enterFarm(farm) {
    AppState.currentFarmId = farm.id;
    AppState.currentFarm = farm;
    AppState.farmName = farm.name;
    console.log(`[FarmListPage] Entering Farm ID: ${farm.id}`);
    const target = AppState.mode === 'beginner' ? 'home' : 'dash-c';
    showScreen(target);
}

function saveFarms(farms) {
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(farms));
    if (AppState.uid) saveFarmsToFirestore(AppState.uid, farms);
}

function loadSavedFarms() {
    try {
        return JSON.parse(localStorage.getItem(FARMS_STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function closeFarmModal() {
    const modalContainer = document.getElementById('modalContainer');
    if (modalContainer) modalContainer.innerHTML = '';
}

function farmMeta(f) {
    const target = f.targetPlant ? `${escapeHTML(f.targetPlant)} · ` : '';
    const rack = f.rackLabel || f.rackType || f.rackTypeId || 'Rack';
    return `${target}${slotCount(f)} slots · ${escapeHTML(rack)}`;
}

function detailBox(label, value) {
    return `
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase;">${escapeHTML(label)}</div>
            <div style="font-size:13px;font-weight:800;color:var(--text);margin-top:3px;word-break:break-word;">${escapeHTML(value)}</div>
        </div>
    `;
}

function plantChips(farm) {
    const plants = Array.isArray(farm.plants) ? farm.plants : [];
    if (!plants.length) {
        const target = farm.targetPlant || 'Plant';
        return `<span style="padding:7px 10px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:12px;font-weight:800;">${escapeHTML(target)}</span>`;
    }

    return plants.map(plant => {
        const position = plant.tier && plant.position ? ` · T${plant.tier} S${plant.position}` : '';
        return `<span style="padding:7px 10px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:12px;font-weight:800;">${escapeHTML(plant.emoji || '🌱')} ${escapeHTML(plant.name || plant.species || 'Plant')}${position}</span>`;
    }).join('');
}

function plantCount(farm) {
    if (Array.isArray(farm.plants)) return farm.plants.length;
    return Number.parseInt(farm.plants, 10) || Number.parseInt(farm.plantSlots, 10) || 0;
}

function slotCount(farm) {
    return Number.parseInt(farm.plantSlots, 10) || plantCount(farm);
}

function formatDate(value) {
    if (!value) return 'Not set';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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
    return escapeHTML(value).replace(/`/g, '&#096;');
}

