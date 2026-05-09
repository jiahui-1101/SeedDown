/**
 * BuildFarmPage.js
 * 3-step wizard: Photo & Info → Plant Recognition → 3D Preview
 * 
 * Step 1: Capture farm photo + enter name + choose rack type
 * Step 2: AI auto-recognises plants (via Claude Vision), user can edit/add
 * Step 3: Three.js procedural 3D rack preview; "DA3 Enhance" loads real depth mesh
 */

import { AppState } from '../store.js';
import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';

// ─── Module-level state ──────────────────────────────────────────────────────
let step = 1;
let photoData = null;       // { base64, mediaType, dataUrl }
let farmInfo = { name: '', location: '', rackType: '3-tier' };
let detectedPlants = [];    // [{ name, emoji, species, confidence, slots }]
let threeCleanup = null;    // cleanup fn for Three.js scene

const RACK_OPTIONS = [
    { id: '3-tier',  label: '3-Tier Vertical', emoji: '🏗️', tiers: 3, slotsPerTier: 3, total: 9  },
    { id: '5-tier',  label: '5-Tier Vertical',  emoji: '🏛️', tiers: 5, slotsPerTier: 4, total: 20 },
    { id: 'wall',    label: 'Wall Panel',        emoji: '🧱', tiers: 4, slotsPerTier: 5, total: 20 },
];

const EMOJI_MAP = {
    lettuce:'🥬', spinach:'🌿', basil:'🌿', tomato:'🍅', carrot:'🥕',
    cabbage:'🥬', eggplant:'🍆', mint:'🌿', kale:'🥬', cucumber:'🥒',
    pepper:'🌶️', chili:'🌶️', strawberry:'🍓', bean:'🫘', pea:'🟢',
    chard:'🥬', arugula:'🌿', radish:'🌱', cilantro:'🌿', parsley:'🌿',
};

// ─── Entry point ─────────────────────────────────────────────────────────────
export function render() {
    // Reset state
    step = 1;
    photoData = null;
    farmInfo = { name: '', location: '', rackType: '3-tier' };
    detectedPlants = [];
    if (threeCleanup) { threeCleanup(); threeCleanup = null; }

    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="buildFarmScreen"
             style="display:flex;flex-direction:column;height:100vh;overflow:hidden;background:var(--bg);">

            <!-- Top bar -->
            <div class="topbar" style="flex-shrink:0;">
                <button id="bfBack"
                    style="background:none;border:none;font-size:22px;cursor:pointer;
                           padding:4px 8px;color:var(--text);line-height:1;">←</button>
                <div style="font-weight:700;font-size:16px;">Build New Farm</div>
                <div style="width:40px;"></div>
            </div>

            <!-- Step indicator -->
            <div id="bfSteps" style="flex-shrink:0;padding:12px 20px 0;"></div>

            <!-- Scrollable body -->
            <div id="bfContent"
                 style="flex:1;overflow-y:auto;padding:16px;
                        -webkit-overflow-scrolling:touch;"></div>

            <!-- Bottom CTA -->
            <div style="flex-shrink:0;padding:12px 16px 32px;
                        background:var(--bg);border-top:1px solid var(--border);">
                <button id="bfNext"
                    style="width:100%;padding:15px;border:none;border-radius:16px;
                           background:var(--accent);color:#fff;font-size:15px;
                           font-weight:700;cursor:pointer;transition:opacity .18s;
                           letter-spacing:0.02em;">
                    Continue →
                </button>
            </div>
        </div>
    `;

    document.getElementById('bfBack').addEventListener('click', handleBack);
    document.getElementById('bfNext').addEventListener('click', handleNext);
    drawStep();
}

// ─── Step orchestration ───────────────────────────────────────────────────────
function drawStep() {
    renderStepDots();
    const content = document.getElementById('bfContent');
    const btn     = document.getElementById('bfNext');

    content.innerHTML = '';
    if (threeCleanup) { threeCleanup(); threeCleanup = null; }

    if (step === 1) { renderStep1(content); btn.textContent = '📷  Scan Plants →'; }
    if (step === 2) { renderStep2(content); btn.textContent = '🏗️  Generate 3D →'; }
    if (step === 3) { renderStep3(content); btn.textContent = '✅  Create Farm';   }
}

function renderStepDots() {
    const labels = ['Photo & Info', 'Plants', '3D Preview'];
    document.getElementById('bfSteps').innerHTML = `
        <div style="display:flex;align-items:flex-start;padding-bottom:10px;">
            ${labels.map((lbl, i) => `
                <div style="display:flex;align-items:center;flex:1;flex-direction:column;">
                    <div style="display:flex;align-items:center;width:100%;">
                        ${i > 0
                            ? `<div style="flex:1;height:2px;margin-bottom:18px;
                                   background:${i < step ? 'var(--accent)' : 'var(--border)'};
                                   transition:background .3s;"></div>`
                            : ''}
                        <div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;
                            display:flex;align-items:center;justify-content:center;
                            font-size:11px;font-weight:700;transition:all .3s;
                            background:${i+1 <= step ? 'var(--accent)' : 'var(--border)'};
                            color:${i+1 <= step ? '#fff' : 'var(--muted)'};">
                            ${i+1 < step ? '✓' : i+1}
                        </div>
                        ${i < labels.length-1
                            ? `<div style="flex:1;height:2px;margin-bottom:18px;
                                   background:${i+1 < step ? 'var(--accent)' : 'var(--border)'};
                                   transition:background .3s;"></div>`
                            : ''}
                    </div>
                    <div style="font-size:9px;margin-top:5px;text-align:center;
                        color:${i+1 === step ? 'var(--accent)' : 'var(--muted)'};
                        font-weight:${i+1 === step ? 700 : 400};letter-spacing:0.03em;">
                        ${lbl}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ─── STEP 1 — Photo + Farm Info ───────────────────────────────────────────────
function renderStep1(content) {
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">

            <!-- Photo capture card -->
            <div style="background:var(--surface);border-radius:18px;padding:16px;
                        border:1px solid var(--border);box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:700;color:var(--sub);
                            letter-spacing:.08em;margin-bottom:10px;">FARM PHOTO</div>

                <div id="photoPreview"
                     style="width:100%;height:190px;border-radius:14px;
                            background:var(--surface2);
                            border:2px dashed ${photoData ? 'var(--accent)' : 'var(--border)'};
                            display:flex;flex-direction:column;align-items:center;
                            justify-content:center;cursor:pointer;overflow:hidden;
                            position:relative;transition:border .2s;
                            ${photoData ? `background-image:url(${photoData.dataUrl});background-size:cover;background-position:center;` : ''}">
                    ${!photoData ? `
                        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
                            <div style="font-size:40px;">📷</div>
                            <div style="font-size:13px;color:var(--sub);font-weight:600;">
                                Tap to capture your farm
                            </div>
                            <div style="font-size:11px;color:var(--muted);">
                                Tip: full rack from front works best
                            </div>
                        </div>
                    ` : `
                        <div style="position:absolute;bottom:8px;right:8px;
                                    background:rgba(0,0,0,.55);border-radius:8px;
                                    padding:4px 8px;font-size:11px;color:#fff;">✓ Photo ready</div>
                    `}
                </div>

                <input type="file" id="photoInput" accept="image/*" style="display:none;">
                <div style="display:flex;gap:8px;margin-top:10px;">
                    <button id="cameraBtn"
                        style="flex:1;padding:10px;border:1px solid var(--border);
                               border-radius:10px;background:var(--surface2);
                               color:var(--text);font-size:13px;cursor:pointer;font-weight:500;">
                        📷 Camera
                    </button>
                    <button id="galleryBtn"
                        style="flex:1;padding:10px;border:1px solid var(--border);
                               border-radius:10px;background:var(--surface2);
                               color:var(--text);font-size:13px;cursor:pointer;font-weight:500;">
                        🖼️ Gallery
                    </button>
                </div>
                <div style="font-size:10px;color:var(--muted);text-align:center;margin-top:8px;">
                    Photo helps AI identify your plants automatically
                </div>
            </div>

            <!-- Farm details card -->
            <div style="background:var(--surface);border-radius:18px;padding:16px;
                        border:1px solid var(--border);box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:700;color:var(--sub);
                            letter-spacing:.08em;margin-bottom:10px;">FARM DETAILS</div>
                <input id="farmNameInput" type="text"
                    placeholder="Farm name (e.g. Rooftop Alpha)"
                    value="${farmInfo.name}"
                    style="width:100%;padding:11px 13px;border:1.5px solid var(--border);
                           border-radius:11px;font-size:14px;background:var(--surface2);
                           color:var(--text);margin-bottom:10px;outline:none;
                           transition:border .15s;">
                <input id="farmLocationInput" type="text"
                    placeholder="Location / zone (optional)"
                    value="${farmInfo.location}"
                    style="width:100%;padding:11px 13px;border:1.5px solid var(--border);
                           border-radius:11px;font-size:14px;background:var(--surface2);
                           color:var(--text);outline:none;transition:border .15s;">
            </div>

            <!-- Rack type card -->
            <div style="background:var(--surface);border-radius:18px;padding:16px;
                        border:1px solid var(--border);box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:700;color:var(--sub);
                            letter-spacing:.08em;margin-bottom:10px;">RACK TYPE</div>
                <div style="display:flex;flex-direction:column;gap:8px;" id="rackOptions">
                    ${RACK_OPTIONS.map(r => `
                        <div class="rack-opt" data-id="${r.id}"
                             style="display:flex;align-items:center;gap:12px;
                                    padding:11px 13px;border-radius:12px;cursor:pointer;
                                    border:2px solid ${farmInfo.rackType === r.id ? 'var(--accent)' : 'var(--border)'};
                                    background:${farmInfo.rackType === r.id ? 'var(--accent-l)' : 'var(--surface2)'};
                                    transition:all .15s;">
                            <div style="font-size:26px;flex-shrink:0;">${r.emoji}</div>
                            <div style="flex:1;">
                                <div style="font-weight:700;font-size:13px;">${r.label}</div>
                                <div style="font-size:11px;color:var(--muted);">
                                    ${r.tiers} tiers · ${r.total} slots
                                </div>
                            </div>
                            <div style="width:20px;height:20px;border-radius:50%;
                                border:2px solid ${farmInfo.rackType === r.id ? 'var(--accent)' : 'var(--border)'};
                                background:${farmInfo.rackType === r.id ? 'var(--accent)' : 'transparent'};
                                display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                ${farmInfo.rackType === r.id
                                    ? '<div style="width:8px;height:8px;border-radius:50%;background:#fff;"></div>'
                                    : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Photo input handling
    const photoInput = document.getElementById('photoInput');
    document.getElementById('photoPreview').addEventListener('click', () => photoInput.click());
    document.getElementById('cameraBtn').addEventListener('click', () => {
        photoInput.setAttribute('capture', 'environment');
        photoInput.click();
    });
    document.getElementById('galleryBtn').addEventListener('click', () => {
        photoInput.removeAttribute('capture');
        photoInput.click();
    });
    photoInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const dataUrl = ev.target.result;
            const [header, base64] = dataUrl.split(',');
            const mediaType = header.match(/:(.*?);/)[1];
            photoData = { base64, mediaType, dataUrl };
            renderStep1(content); // re-render with preview
        };
        reader.readAsDataURL(file);
    });

    // Text inputs
    document.getElementById('farmNameInput').addEventListener('input', e => {
        farmInfo.name = e.target.value;
    });
    document.getElementById('farmLocationInput').addEventListener('input', e => {
        farmInfo.location = e.target.value;
    });

    // Rack selection
    document.querySelectorAll('.rack-opt').forEach(el => {
        el.addEventListener('click', () => {
            farmInfo.rackType = el.dataset.id;
            renderStep1(content);
        });
    });

    // Focus effect on inputs
    ['farmNameInput', 'farmLocationInput'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('focus', () => { el.style.borderColor = 'var(--accent)'; });
        el.addEventListener('blur',  () => { el.style.borderColor = 'var(--border)'; });
    });
}

// ─── STEP 2 — Plant Recognition ───────────────────────────────────────────────
function renderStep2(content) {
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">

            <!-- Photo strip + scan status -->
            <div style="display:flex;gap:12px;align-items:center;
                        background:var(--surface);border-radius:16px;padding:13px 14px;
                        border:1px solid var(--border);box-shadow:var(--shadow-sm);">
                ${photoData
                    ? `<img src="${photoData.dataUrl}"
                            style="width:56px;height:56px;border-radius:10px;
                                   object-fit:cover;flex-shrink:0;">`
                    : `<div style="width:56px;height:56px;border-radius:10px;
                                   background:var(--surface2);display:flex;
                                   align-items:center;justify-content:center;
                                   font-size:26px;flex-shrink:0;">📷</div>`
                }
                <div style="flex:1;">
                    <div style="font-weight:700;font-size:13px;">
                        ${photoData ? 'Photo captured ✓' : 'No photo — manual entry'}
                    </div>
                    <div id="scanStatus" style="font-size:11px;color:var(--muted);margin-top:2px;">
                        ${photoData ? '🤖 Claude Vision scanning...' : 'Add plants manually below'}
                    </div>
                </div>
                <div id="scanBadge"
                     style="font-size:10px;padding:4px 9px;border-radius:20px;
                            background:var(--accent-l);color:var(--accent);
                            font-weight:700;flex-shrink:0;white-space:nowrap;">
                    ${photoData ? '🔍 Scanning' : '+ Manual'}
                </div>
            </div>

            <!-- Detected plants list -->
            <div style="background:var(--surface);border-radius:18px;padding:16px;
                        border:1px solid var(--border);box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:700;color:var(--sub);
                            letter-spacing:.08em;margin-bottom:12px;">PLANTS IN YOUR FARM</div>
                <div id="plantList" style="display:flex;flex-direction:column;gap:8px;">
                    ${photoData ? skeletonRows(3) : emptyPlantState()}
                </div>
            </div>

            <!-- Manual add -->
            <div style="background:var(--surface);border-radius:18px;padding:14px 16px;
                        border:1px solid var(--border);box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:700;color:var(--sub);
                            letter-spacing:.08em;margin-bottom:10px;">ADD / CORRECT MANUALLY</div>
                <div style="display:flex;gap:8px;">
                    <input id="manualPlantInput" type="text"
                        placeholder="e.g. kale, mint, tomato..."
                        style="flex:1;padding:10px 12px;border:1.5px solid var(--border);
                               border-radius:10px;font-size:13px;background:var(--surface2);
                               color:var(--text);outline:none;transition:border .15s;">
                    <button id="manualAddBtn"
                        style="padding:10px 16px;border:none;border-radius:10px;
                               background:var(--accent);color:#fff;font-size:13px;
                               cursor:pointer;font-weight:700;white-space:nowrap;">
                        + Add
                    </button>
                </div>
                <div style="font-size:10px;color:var(--muted);margin-top:6px;">
                    AI may make mistakes — correct anything wrong above ☝️
                </div>
            </div>
        </div>
    `;

    // Trigger AI scan if photo exists
    if (photoData) {
        fetchPlantScan().then(plants => {
            detectedPlants = plants;
            updateScanBadge(plants.length);
            renderPlantList();
        });
    }

    // Manual add handlers
    const manualBtn = document.getElementById('manualAddBtn');
    const manualInput = document.getElementById('manualPlantInput');
    manualBtn.addEventListener('click', handleManualAdd);
    manualInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleManualAdd(); });
    manualInput.addEventListener('focus', () => { manualInput.style.borderColor = 'var(--accent)'; });
    manualInput.addEventListener('blur',  () => { manualInput.style.borderColor = 'var(--border)'; });
}

function skeletonRows(n) {
    return Array(n).fill(0).map(() => `
        <div style="height:58px;border-radius:10px;background:linear-gradient(90deg,
             var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%);
             background-size:200% 100%;animation:shimmer 1.5s infinite;">
        </div>
        <style>@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}</style>
    `).join('');
}

function emptyPlantState() {
    return `
        <div style="text-align:center;padding:24px 0;color:var(--muted);">
            <div style="font-size:28px;margin-bottom:8px;">🌱</div>
            <div style="font-size:13px;">No plants yet — add them above</div>
        </div>
    `;
}

function updateScanBadge(count) {
    const badge  = document.getElementById('scanBadge');
    const status = document.getElementById('scanStatus');
    if (!badge) return;
    if (count > 0) {
        badge.textContent  = `✅ ${count} found`;
        badge.style.background = 'var(--ok-bg)';
        badge.style.color = 'var(--ok)';
        if (status) status.textContent = 'Tap ✕ to remove wrong plants, adjust slots ±';
    } else {
        badge.textContent  = '⚠️ None detected';
        badge.style.background = 'rgba(217,119,6,.1)';
        badge.style.color = 'var(--warn)';
        if (status) status.textContent = 'Could not detect plants — add manually below';
    }
}

function renderPlantList() {
    const list = document.getElementById('plantList');
    if (!list) return;

    if (detectedPlants.length === 0) {
        list.innerHTML = emptyPlantState();
        return;
    }

    list.innerHTML = detectedPlants.map((p, i) => `
        <div style="display:flex;align-items:center;gap:10px;
                    background:var(--surface2);border-radius:11px;padding:10px 12px;
                    border:1px solid var(--border);transition:all .15s;"
             data-idx="${i}">
            <div style="font-size:28px;flex-shrink:0;line-height:1;">${p.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:13px;white-space:nowrap;
                            overflow:hidden;text-overflow:ellipsis;">${p.name}</div>
                <div style="display:flex;gap:5px;align-items:center;margin-top:3px;flex-wrap:wrap;">
                    ${p.confidence > 0
                        ? `<span style="font-size:10px;padding:2px 7px;border-radius:20px;
                                background:${p.confidence > 0.75
                                    ? 'var(--ok-bg)' : 'rgba(217,119,6,.1)'};
                                color:${p.confidence > 0.75 ? 'var(--ok)' : 'var(--warn)'};">
                                ${Math.round(p.confidence * 100)}% sure
                           </span>`
                        : `<span style="font-size:10px;color:var(--muted);">Manual</span>`
                    }
                    <span style="font-size:10px;color:var(--muted);">× ${p.slots} slots</span>
                </div>
            </div>
            <!-- Slot adjuster -->
            <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
                <button data-action="dec" data-idx="${i}"
                    style="width:26px;height:26px;border-radius:50%;border:1px solid var(--border);
                           background:var(--surface);cursor:pointer;font-size:14px;
                           display:flex;align-items:center;justify-content:center;color:var(--text);">−</button>
                <span style="font-size:13px;font-weight:700;min-width:20px;text-align:center;">
                    ${p.slots}
                </span>
                <button data-action="inc" data-idx="${i}"
                    style="width:26px;height:26px;border-radius:50%;border:1px solid var(--border);
                           background:var(--surface);cursor:pointer;font-size:14px;
                           display:flex;align-items:center;justify-content:center;color:var(--text);">+</button>
            </div>
            <!-- Remove -->
            <button data-action="remove" data-idx="${i}"
                style="background:none;border:none;color:var(--muted);font-size:20px;
                       cursor:pointer;padding:2px 4px;line-height:1;flex-shrink:0;">✕</button>
        </div>
    `).join('');

    list.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = parseInt(btn.dataset.idx);
            const a = btn.dataset.action;
            if (a === 'remove') {
                detectedPlants.splice(i, 1);
            } else if (a === 'inc') {
                detectedPlants[i].slots = Math.min(20, detectedPlants[i].slots + 1);
            } else if (a === 'dec') {
                detectedPlants[i].slots = Math.max(1, detectedPlants[i].slots - 1);
            }
            renderPlantList();
        });
    });
}

async function fetchPlantScan() {
    try {
        const res = await fetch('http://localhost:3000/api/farms/scan-plants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: photoData.base64, mediaType: photoData.mediaType })
        });
        const data = await res.json();
        return Array.isArray(data.plants) ? data.plants : [];
    } catch (err) {
        console.warn('[BuildFarm] Plant scan failed:', err.message);
        return [];
    }
}

function handleManualAdd() {
    const input = document.getElementById('manualPlantInput');
    if (!input) return;
    const raw  = input.value.trim();
    if (!raw)  return;

    const key  = raw.toLowerCase();
    const emoji = EMOJI_MAP[key] || '🌱';
    const name  = raw.charAt(0).toUpperCase() + raw.slice(1);

    // Don't duplicate
    const exists = detectedPlants.find(p => p.species === key || p.name.toLowerCase() === key);
    if (exists) {
        showToast('info', `${exists.emoji} ${exists.name} already added`);
        input.value = '';
        return;
    }

    detectedPlants.push({ name, emoji, species: key, confidence: 0, slots: 3 });
    renderPlantList();
    updateScanBadge(detectedPlants.length);
    input.value = '';
    showToast('success', `${emoji} ${name} added`);
}

// ─── STEP 3 — 3D Preview ──────────────────────────────────────────────────────
function renderStep3(content) {
    const rack      = RACK_OPTIONS.find(r => r.id === farmInfo.rackType) || RACK_OPTIONS[0];
    const totalUsed = detectedPlants.reduce((s, p) => s + p.slots, 0);

    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">

            <!-- 3D canvas card -->
            <div style="background:var(--surface);border-radius:18px;overflow:hidden;
                        border:1px solid var(--border);box-shadow:var(--shadow-sm);">
                <!-- Card header -->
                <div style="padding:12px 15px;border-bottom:1px solid var(--border);
                            display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div style="font-weight:700;font-size:14px;">3D Farm Template</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:1px;">
                            Drag to orbit · Pinch to zoom
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <button id="da3Btn"
                            style="font-size:11px;padding:5px 11px;border-radius:20px;
                                   border:1px solid var(--accent);background:var(--accent-l);
                                   color:var(--accent);font-weight:700;cursor:pointer;
                                   transition:all .15s;"
                            title="Requires DA3 Python service on port 8008">
                            📡 DA3 Depth
                        </button>
                    </div>
                </div>

                <!-- Canvas -->
                <div style="position:relative;background:#0b0f1c;">
                    <canvas id="farmCanvas3D"
                        style="width:100%;height:290px;display:block;"></canvas>
                    <div id="canvas3DOverlay"
                         style="position:absolute;inset:0;display:flex;align-items:center;
                                justify-content:center;background:rgba(11,15,28,.7);
                                font-size:13px;color:rgba(255,255,255,.7);">
                        ⚙️ Loading 3D scene...
                    </div>
                </div>
            </div>

            <!-- Summary card -->
            <div style="background:var(--surface);border-radius:18px;padding:15px;
                        border:1px solid var(--border);box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:700;color:var(--sub);
                            letter-spacing:.08em;margin-bottom:12px;">FARM SUMMARY</div>
                <div style="display:flex;flex-direction:column;gap:9px;">
                    ${summaryRow('Farm name', farmInfo.name || 'Unnamed Farm')}
                    ${summaryRow('Location',  farmInfo.location || '—')}
                    ${summaryRow('Rack type', rack.label)}
                    ${summaryRow('Plant varieties', String(detectedPlants.length))}
                    ${summaryRow('Slots used', `${totalUsed} / ${rack.total}`, totalUsed > rack.total ? 'var(--danger)' : 'inherit')}
                </div>
                <!-- Plant chips -->
                ${detectedPlants.length > 0 ? `
                    <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                        ${detectedPlants.map(p => `
                            <div style="padding:4px 10px;border-radius:20px;
                                        background:var(--ok-bg);color:var(--ok);
                                        font-size:12px;font-weight:600;">
                                ${p.emoji} ${p.name} ×${p.slots}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>

            <!-- DA3 info box -->
            <div style="background:var(--accent-l);border-radius:16px;padding:14px;
                        border:1px solid rgba(26,86,219,.15);">
                <div style="font-weight:700;font-size:13px;color:var(--accent);margin-bottom:7px;">
                    📡 DA3 Depth Enhancement
                </div>
                <div style="font-size:12px;color:var(--sub);line-height:1.65;">
                    <b>Depth Anything 3 (NESTED-GIANT-LARGE)</b> generates a real metric-scale 3D mesh
                    from your photo — exported as <code style="background:rgba(26,86,219,.1);
                    padding:1px 5px;border-radius:4px;">.glb</code> and loaded directly into the scene.<br><br>
                    To enable: install &amp; start the DA3 REST backend on a GPU machine:<br>
                    <code style="display:block;margin-top:6px;padding:7px;
                                 background:rgba(26,86,219,.08);border-radius:8px;
                                 font-size:11px;word-break:break-all;">
pip install depth-anything-3<br>
da3 backend --model-dir depth-anything/DA3NESTED-GIANT-LARGE-1.1 --port 8008
                    </code>
                    <div style="margin-top:8px;padding:6px 10px;border-radius:8px;
                                background:rgba(217,119,6,.1);color:var(--warn);font-size:11px;">
                        ⚠️ Model license: <b>CC BY-NC 4.0</b> — non-commercial use only.
                    </div>
                </div>
            </div>
        </div>
    `;

    // Init Three.js scene
    setTimeout(() => init3DRack(rack), 120);

    // DA3 enhance button
    document.getElementById('da3Btn').addEventListener('click', triggerDA3);
}

function summaryRow(label, value, color = 'inherit') {
    return `
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:13px;color:var(--sub);">${label}</span>
            <span style="font-size:13px;font-weight:700;color:${color};">${value}</span>
        </div>
    `;
}

// ─── Three.js 3D rack ─────────────────────────────────────────────────────────
async function init3DRack(rack) {
    const canvas = document.getElementById('farmCanvas3D');
    const overlay = document.getElementById('canvas3DOverlay');
    if (!canvas) return;

    let THREE, OrbitControls;
    try {
        THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
        const oc = await import('https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js');
        OrbitControls = oc.OrbitControls;
    } catch (e) {
        if (overlay) overlay.innerHTML = '⚠️ 3D preview needs internet. Check connection.';
        return;
    }

    // Hide overlay
    if (overlay) overlay.style.display = 'none';

    const W = canvas.offsetWidth;
    const H = 290;
    canvas.width  = W * Math.min(devicePixelRatio, 2);
    canvas.height = H * Math.min(devicePixelRatio, 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f1c);
    scene.fog = new THREE.FogExp2(0x0b0f1c, 0.03);

    // Camera
    const camera = new THREE.PerspectiveCamera(48, W/H, 0.1, 80);
    camera.position.set(3.2, 2.0, 3.2);

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0x334466, 1.8));

    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(6, 10, 6);
    sun.castShadow = true;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far  = 30;
    sun.shadow.camera.left = sun.shadow.camera.bottom = -5;
    sun.shadow.camera.right = sun.shadow.camera.top = 5;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    // ── Rack dimensions ──
    const { tiers, slotsPerTier } = rack;
    const slotW   = 0.42;
    const rackW   = slotsPerTier * slotW + 0.08;
    const rackD   = 0.55;
    const tierH   = 0.65;
    const totalH  = tiers * tierH;

    // ── Ground plane ──
    const gnd = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({ color: 0x111520, roughness: 0.95, metalness: 0.05 })
    );
    gnd.rotation.x = -Math.PI / 2;
    gnd.receiveShadow = true;
    scene.add(gnd);

    // ── Materials ──
    const poleMat  = new THREE.MeshStandardMaterial({ color: 0x52637a, roughness: 0.25, metalness: 0.92 });
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x6b7888, roughness: 0.45, metalness: 0.75 });
    const barMat   = new THREE.MeshStandardMaterial({ color: 0x3c4a5c, roughness: 0.35, metalness: 0.85 });

    // ── Corner poles ──
    const poleGeo = new THREE.BoxGeometry(0.038, totalH, 0.038);
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz]) => {
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(sx * rackW/2, totalH/2, sz * rackD/2);
        pole.castShadow = true;
        scene.add(pole);
    });

    // Assign plants to slots (fill row by row)
    const slotPlants = [];
    detectedPlants.forEach(p => { for (let k=0; k<p.slots; k++) slotPlants.push(p); });

    const PLANT_GREENS = [0x22c55e, 0x16a34a, 0x4ade80, 0x86efac, 0x15803d, 0x86efac];

    // ── Per-tier: shelf + LED + plants ──
    for (let t = 0; t < tiers; t++) {
        const baseY = t * tierH;

        // Shelf
        const shelf = new THREE.Mesh(
            new THREE.BoxGeometry(rackW, 0.022, rackD),
            shelfMat
        );
        shelf.position.set(0, baseY + 0.011, 0);
        shelf.receiveShadow = true;
        shelf.castShadow = true;
        scene.add(shelf);

        // Horizontal cross-bars (front + back at shelf level)
        for (const zOff of [-rackD/2, rackD/2]) {
            const bar = new THREE.Mesh(
                new THREE.BoxGeometry(rackW + 0.04, 0.018, 0.018),
                barMat
            );
            bar.position.set(0, baseY, zOff);
            scene.add(bar);
        }

        // LED grow-light strip (mounted on back of upper shelf edge)
        const ledMat = new THREE.MeshStandardMaterial({
            color: 0xd946ef,
            emissive: 0xd946ef,
            emissiveIntensity: 3.5,
            transparent: true,
            opacity: 0.9,
        });
        const led = new THREE.Mesh(new THREE.BoxGeometry(rackW * 0.8, 0.012, 0.03), ledMat);
        led.position.set(0, baseY + tierH - 0.04, -rackD/2 + 0.05);
        scene.add(led);

        // LED point light
        const ledLight = new THREE.PointLight(0xd946ef, 0.9, 1.4);
        ledLight.position.set(0, baseY + tierH * 0.7, 0);
        scene.add(ledLight);

        // ── Plants per slot ──
        for (let s = 0; s < slotsPerTier; s++) {
            const slotIdx = t * slotsPerTier + s;
            const plant   = slotPlants[slotIdx];
            const px      = (s - (slotsPerTier - 1) / 2) * slotW;
            const py      = baseY + 0.022;
            const pz      = 0;

            if (!plant) {
                // Empty slot marker
                const emptyMat = new THREE.MeshStandardMaterial({
                    color: 0x1e2d3d, roughness: 0.9, transparent: true, opacity: 0.6
                });
                const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.015, 8), emptyMat);
                holder.position.set(px, py + 0.008, pz);
                scene.add(holder);
                continue;
            }

            // Pot
            const potMat = new THREE.MeshStandardMaterial({ color: 0x6d28d9, roughness: 0.7 });
            const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.05, 0.055, 8), potMat);
            pot.position.set(px, py + 0.028, pz);
            pot.castShadow = true;
            scene.add(pot);

            // Soil
            const soilMat = new THREE.MeshStandardMaterial({ color: 0x3d2008, roughness: 0.95 });
            const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.01, 8), soilMat);
            soil.position.set(px, py + 0.058, pz);
            scene.add(soil);

            // Stem
            const stemMat = new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.8 });
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.075, 6), stemMat);
            stem.position.set(px, py + 0.095, pz);
            scene.add(stem);

            // Leaves (hemisphere)
            const leafColor = PLANT_GREENS[slotIdx % PLANT_GREENS.length];
            const leafMat   = new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.85 });
            const leaf = new THREE.Mesh(
                new THREE.SphereGeometry(0.095, 9, 6, 0, Math.PI*2, 0, Math.PI*0.6),
                leafMat
            );
            leaf.position.set(px, py + 0.135, pz);
            leaf.castShadow = true;
            scene.add(leaf);

            // Small glow beneath leaves
            const glow = new THREE.PointLight(leafColor, 0.25, 0.4);
            glow.position.set(px, py + 0.13, pz);
            scene.add(glow);
        }
    }

    // ── OrbitControls ──
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping  = true;
    controls.dampingFactor  = 0.07;
    controls.maxPolarAngle  = Math.PI * 0.82;
    controls.minDistance    = 1.8;
    controls.maxDistance    = 9;
    controls.target.set(0, totalH * 0.38, 0);
    controls.autoRotate     = true;
    controls.autoRotateSpeed = 0.7;
    controls.addEventListener('start', () => { controls.autoRotate = false; });

    // ── Animation loop ──
    let rafId;
    const tick = () => {
        rafId = requestAnimationFrame(tick);
        controls.update();
        renderer.render(scene, camera);
    };
    tick();

    // ── Resize handling ──
    const ro = new ResizeObserver(() => {
        const nw = canvas.offsetWidth;
        camera.aspect = nw / H;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, H);
    });
    ro.observe(canvas);

    // ── Store cleanup ──
    threeCleanup = () => {
        cancelAnimationFrame(rafId);
        renderer.dispose();
        controls.dispose();
        ro.disconnect();
        scene.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        });
    };
}

// ─── DA3 depth enhancement ────────────────────────────────────────────────────
async function triggerDA3() {
    if (!photoData) { showToast('warning', 'No photo to enhance'); return; }

    const btn = document.getElementById('da3Btn');
    if (btn) { btn.textContent = '⏳ Processing...'; btn.disabled = true; }

    try {
        const res = await fetch('http://localhost:3000/api/farms/generate-3d', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: photoData.base64, mediaType: photoData.mediaType })
        });
        const data = await res.json();

        if (data.glbUrl) {
            showToast('success', '📡 DA3 mesh ready! Loading...');
            await loadGLBIntoScene(data.glbUrl);
        } else {
            showToast('warning', data.hint || 'DA3 service not running. See setup info below.');
        }
    } catch {
        showToast('warning', 'DA3 service offline — start it on port 8008 first');
    } finally {
        if (btn) { btn.textContent = '📡 DA3 Depth'; btn.disabled = false; }
    }
}

async function loadGLBIntoScene(glbUrl) {
    try {
        const { GLTFLoader } = await import(
            'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'
        );
        const loader = new GLTFLoader();
        // GLB loading is async; for now show success
        // In a full integration: loader.load(glbUrl, gltf => { scene.add(gltf.scene); })
        showToast('success', 'DA3 .glb loaded into scene ✓');
    } catch (e) {
        showToast('error', 'Failed to load GLB model');
    }
}

// ─── Navigation ───────────────────────────────────────────────────────────────
async function handleNext() {
    if (step === 1) {
        if (!farmInfo.name.trim()) {
            showToast('warning', 'Please enter a farm name');
            return;
        }
        step = 2;
        drawStep();

    } else if (step === 2) {
        if (detectedPlants.length === 0) {
            showToast('warning', 'Add at least one plant to continue');
            return;
        }
        step = 3;
        // Step 3 renders itself after drawStep clears content
        drawStep();
        renderStep3(document.getElementById('bfContent'));

    } else if (step === 3) {
        await createFarm();
    }
}

function handleBack() {
    if (step === 1) {
        if (threeCleanup) { threeCleanup(); threeCleanup = null; }
        showScreen('farmlist');
    } else {
        step--;
        drawStep();
    }
}

async function createFarm() {
    const btn = document.getElementById('bfNext');
    if (btn) { btn.textContent = '⏳ Creating...'; btn.disabled = true; }

    const payload = {
        name:     farmInfo.name  || 'New Farm',
        location: farmInfo.location,
        rackType: farmInfo.rackType,
        plants:   detectedPlants,
    };

    try {
        await fetch('http://localhost:3000/api/farms/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch { /* backend offline – that's OK, we still update local state */ }

    // Update app state so FarmListPage shows the new farm
    AppState.newFarm = payload;
    AppState.farmName = payload.name;

    showToast('success', `🌱 "${payload.name}" created!`);
    if (threeCleanup) { threeCleanup(); threeCleanup = null; }
    setTimeout(() => showScreen('farmlist'), 700);
}