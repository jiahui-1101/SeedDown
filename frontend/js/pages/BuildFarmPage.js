/**
 * BuildFarmPage.js
 * New Field wizard: Plant analysis setup -> photo capture -> 3D vertical preview.
 */

import { AppState } from '../store.js';
import { showToast } from '../utils/toast.js';
import { scanPlantsWithFirebaseAI } from '../services/firebaseAiLogic.js';
import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';


const FARMS_STORAGE_KEY = 'user_farms';
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

let step = 1;
let photoData = null;
let viewMode = 'realistic';
let threeCleanup = null;
let scanStarted = false;
let fieldInfo = {
    name: '',
    location: '',
    targetPlant: '',
    analysisGoal: 'yield',
    rackType: '3-tier',
};
let detectedPlants = [];

const RACK_OPTIONS = [
    { id: '2-tier', label: '2-Tier Starter Rack', icon: 'II', tiers: 2, slotsPerTier: 3, total: 6, shape: 'rack', desc: 'compact shelf for desk or balcony trials' },
    { id: '3-tier', label: '3-Tier Vertical Rack', icon: 'III', tiers: 3, slotsPerTier: 3, total: 9, shape: 'rack', desc: 'balanced demo rack with 9 plant slots' },
    { id: '4-tier', label: '4-Tier Grow Shelf', icon: 'IV', tiers: 4, slotsPerTier: 4, total: 16, shape: 'rack', desc: 'larger home rack for mixed greens' },
    { id: '5-tier', label: '5-Tier Tower Rack', icon: 'V', tiers: 5, slotsPerTier: 4, total: 20, shape: 'tower', desc: 'tall structure with dense stacking' },
    { id: 'wall', label: 'Wall Panel Grid', icon: 'GRID', tiers: 4, slotsPerTier: 5, total: 20, shape: 'wall', desc: 'flat wall-mounted grow panel' },
    { id: 'a-frame', label: 'A-Frame Pyramid', icon: 'A', tiers: 4, slotsPerTier: 4, total: 16, shape: 'aframe', desc: 'slanted frame for two-sided access' },
    { id: 'nft-channel', label: 'NFT Channel Rows', icon: 'NFT', tiers: 3, slotsPerTier: 6, total: 18, shape: 'channel', desc: 'hydroponic channel layout for leafy crops' },
    { id: 'hanging', label: 'Hanging Column Farm', icon: 'COL', tiers: 5, slotsPerTier: 3, total: 15, shape: 'column', desc: 'vertical column pots for herbs and vines' },
];

const ANALYSIS_GOALS = [
    { id: 'yield', label: 'Yield' },
    { id: 'health', label: 'Health' },
    { id: 'space', label: 'Space fit' },
];

const EMOJI_MAP = {
    lettuce: '🥬',
    spinach: '🌿',
    basil: '🌿',
    tomato: '🍅',
    carrot: '🥕',
    cabbage: '🥬',
    eggplant: '🍆',
    mint: '🌿',
    kale: '🥬',
    cucumber: '🥒',
    pepper: '🌶️',
    chili: '🌶️',
    strawberry: '🍓',
    bean: '🫘',
    pea: '🟢',
    chard: '🥬',
    arugula: '🌿',
    radish: '🌱',
    cilantro: '🌿',
    parsley: '🌿',
};

export function render() {
    step = 1;
    photoData = null;
    viewMode = 'realistic';
    scanStarted = false;
    fieldInfo = {
        name: '',
        location: '',
        targetPlant: '',
        analysisGoal: 'yield',
        rackType: '3-tier',
    };
    detectedPlants = [];
    dispose3D();

    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="buildFarmScreen"
             style="display:flex;flex-direction:column;height:100vh;overflow:hidden;background:var(--bg);">
            <div class="topbar" style="flex-shrink:0;">
                <button id="bfBack" aria-label="Back"
                    style="background:none;border:none;font-size:22px;cursor:pointer;padding:4px 8px;color:var(--text);line-height:1;">←</button>
                <div>
                    <div style="font-weight:800;font-size:16px;">New Field</div>
                    <div style="font-size:11px;color:var(--muted);margin-top:1px;">analysis photo to 3D vertical preview</div>
                </div>
                <div style="width:40px;"></div>
            </div>

            <div id="bfSteps" style="flex-shrink:0;padding:12px 20px 0;"></div>
            <div id="bfContent" style="flex:1;overflow-y:auto;padding:16px;-webkit-overflow-scrolling:touch;"></div>
                        <div style="flex-shrink:0;padding:12px 16px 32px;background:var(--bg);border-top:1px solid var(--border);display:grid;grid-template-columns:0.82fr 1.18fr;gap:10px;">
                <button id="bfCancel"
                    style="padding:15px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface2);color:var(--text);font-size:14px;font-weight:800;cursor:pointer;">
                    Cancel
                </button>
                <button id="bfNext"
                    style="padding:15px;border:none;border-radius:12px;background:var(--accent);color:#fff;font-size:15px;font-weight:800;cursor:pointer;">
                    Continue
                </button>
            </div>
        </div>
    `;

    document.getElementById('bfBack').addEventListener('click', handleBack);
    document.getElementById('bfCancel').addEventListener('click', handleCancel);
    document.getElementById('bfNext').addEventListener('click', handleNext);
    drawStep();
}

function drawStep() {
    renderStepDots();
    const content = document.getElementById('bfContent');
    const cancelBtn = document.getElementById('bfCancel');
    const btn = document.getElementById('bfNext');

    content.innerHTML = '';
    dispose3D();

    if (step === 1) {
        renderStep1(content);
        cancelBtn.textContent = 'Cancel';
        btn.textContent = 'Next: Add Photo';
    }
    if (step === 2) {
        renderStep2(content);
        cancelBtn.textContent = 'Exit';
        btn.textContent = 'Generate 3D Preview';
    }
    if (step === 3) {
        renderStep3(content);
        cancelBtn.textContent = 'Preview Only';
        btn.textContent = 'Create Field';
    }
}
function renderStepDots() {
    const labels = ['Plant', 'Photo', '3D'];
    document.getElementById('bfSteps').innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-bottom:10px;">
            ${labels.map((label, index) => {
                const active = index + 1 <= step;
                return `
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${active ? 'var(--accent)' : 'var(--border)'};
                                    color:${active ? '#fff' : 'var(--muted)'};
                                    font-size:11px;font-weight:800;flex-shrink:0;">
                            ${index + 1 < step ? '✓' : index + 1}
                        </div>
                        <div style="font-size:11px;font-weight:800;color:${index + 1 === step ? 'var(--accent)' : 'var(--muted)'};">
                            ${label}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderStep1(content) {
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">FIELD SETUP</div>
                ${fieldInput('fieldNameInput', 'Field name', 'e.g. Balcony Mint Trial', fieldInfo.name)}
                ${fieldInput('fieldLocationInput', 'Location / zone', 'e.g. Rack A, balcony, lab corner', fieldInfo.location)}
                ${fieldInput('targetPlantInput', 'Plants for analysis', 'e.g. basil, lettuce, tomato', fieldInfo.targetPlant)}
                ${plantTargetSummary()}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS GOAL</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${ANALYSIS_GOALS.map(goal => `
                        <button class="analysis-goal" data-id="${goal.id}"
                            style="padding:10px 8px;border-radius:10px;border:1.5px solid ${fieldInfo.analysisGoal === goal.id ? 'var(--accent)' : 'var(--border)'};
                                   background:${fieldInfo.analysisGoal === goal.id ? 'var(--accent-l)' : 'var(--surface2)'};
                                   color:${fieldInfo.analysisGoal === goal.id ? 'var(--accent)' : 'var(--text)'};
                                   font-size:12px;font-weight:800;cursor:pointer;">
                            ${goal.label}
                        </button>
                    `).join('')}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">VERTICAL STRUCTURE</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${RACK_OPTIONS.map(rack => rackOption(rack)).join('')}
                </div>
            </section>
        </div>
    `;

    bindTextInput('fieldNameInput', value => { fieldInfo.name = value; });
    bindTextInput('fieldLocationInput', value => { fieldInfo.location = value; });
    bindTextInput('targetPlantInput', value => {
        fieldInfo.targetPlant = value;
        syncTargetPlants(value);
        renderTargetPlantChips();
    });

    document.querySelectorAll('.analysis-goal').forEach(button => {
        button.addEventListener('click', () => {
            fieldInfo.analysisGoal = button.dataset.id;
            renderStep1(content);
        });
    });

    document.querySelectorAll('.rack-opt').forEach(option => {
        option.addEventListener('click', () => {
            fieldInfo.rackType = option.dataset.id;
            renderStep1(content);
        });
    });
}

function fieldInput(id, label, placeholder, value) {
    return `
        <label style="display:block;margin-bottom:10px;">
            <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">${label}</span>
            <input id="${id}" type="text" value="${escapeHTML(value)}" placeholder="${placeholder}"
                style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;
                       background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
        </label>
    `;
}

function targetPlantChipsHtml() {
    const plants = parseTargetPlants(fieldInfo.targetPlant);
    if (!plants.length) {
        return '<div style="font-size:11px;color:var(--muted);line-height:1.4;">Add one or many plants. Use commas, semicolons, or new lines.</div>';
    }

    return plants.map(name => `
        <span style="display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:11px;font-weight:800;">
            <span>${escapeHTML(emojiForName(name))}</span>${escapeHTML(name)}
        </span>
    `).join('');
}

function plantTargetSummary() {
    return `
        <div id="targetPlantChips" style="display:flex;flex-wrap:wrap;gap:6px;margin:-2px 0 10px;">
            ${targetPlantChipsHtml()}
        </div>
    `;
}

function renderTargetPlantChips() {
    const chips = document.getElementById('targetPlantChips');
    if (chips) chips.innerHTML = targetPlantChipsHtml();
}
function rackOption(rack) {
    const selected = fieldInfo.rackType === rack.id;
    return `
        <button class="rack-opt" data-id="${rack.id}"
            style="width:100%;display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;cursor:pointer;
                   text-align:left;border:1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'};
                   background:${selected ? 'var(--accent-l)' : 'var(--surface2)'};color:var(--text);">
            <span style="width:42px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;
                         background:${selected ? 'var(--accent)' : 'var(--surface)'};color:${selected ? '#fff' : 'var(--sub)'};
                         font-size:10px;font-weight:900;letter-spacing:.03em;flex-shrink:0;">${rack.icon}</span>
            <span style="flex:1;">
                <span style="display:block;font-size:13px;font-weight:800;">${rack.label}</span>
                <span style="display:block;font-size:11px;color:var(--muted);margin-top:2px;">${rack.tiers} tiers · ${rack.total} plant slots</span>
                <span style="display:block;font-size:10px;color:var(--sub);margin-top:3px;line-height:1.25;">${escapeHTML(rack.desc || '')}</span>
            </span>
            <span style="font-size:18px;color:${selected ? 'var(--accent)' : 'var(--muted)'};">${selected ? '✓' : '+'}</span>
        </button>
    `;
}

function renderStep2(content) {
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FIELD PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture the vertical setup so the preview can match the real field.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${photoData ? 'READY' : 'NEEDED'}</div>
                </div>

                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${photoData ? 'var(--accent)' : 'var(--border)'};
                            background:${photoData ? `url(${photoData.dataUrl}) center/cover` : 'var(--surface2)'};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${photoData ? `
                        <div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.58);color:white;
                                    padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;">Photo loaded</div>
                    ` : `
                        <div style="text-align:center;color:var(--muted);">
                            <div style="font-size:36px;margin-bottom:8px;">▣</div>
                            <div style="font-size:13px;font-weight:800;">Tap to add field photo</div>
                            <div style="font-size:11px;margin-top:4px;">front-facing rack photo works best</div>
                        </div>
                    `}
                </div>
                <input type="file" id="photoInput" accept="image/*" style="display:none;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
                    <button id="cameraBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);font-weight:800;color:var(--text);cursor:pointer;">Camera</button>
                    <button id="galleryBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);font-weight:800;color:var(--text);cursor:pointer;">Gallery</button>
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">PLANTS FOR ANALYSIS</div>
                        <div id="scanStatus" style="font-size:11px;color:var(--muted);margin-top:3px;">${photoData ? 'Ready to scan or edit manually' : 'Add a photo, or continue with manual plants'}</div>
                    </div>
                    <button id="scanBtn" ${!photoData ? 'disabled' : ''}
                        style="padding:7px 10px;border-radius:20px;border:1px solid ${photoData ? 'var(--accent)' : 'var(--border)'};
                               background:${photoData ? 'var(--accent-l)' : 'var(--surface2)'};
                               color:${photoData ? 'var(--accent)' : 'var(--muted)'};
                               font-size:11px;font-weight:800;cursor:${photoData ? 'pointer' : 'not-allowed'};">
                        Scan Photo
                    </button>
                </div>
                <div id="plantList" style="display:flex;flex-direction:column;gap:8px;"></div>
                <div style="display:flex;gap:8px;margin-top:12px;">
                    <input id="manualPlantInput" type="text" placeholder="Add plant, e.g. kale"
                        style="flex:1;padding:10px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:13px;outline:none;">
                    <button id="manualAddBtn" style="padding:10px 14px;border:none;border-radius:10px;background:var(--accent);color:white;font-weight:800;cursor:pointer;">Add</button>
                </div>
            </section>
        </div>
    `;

    renderPlantList();
    bindPhotoInput(content);
    document.getElementById('scanBtn').addEventListener('click', scanPlantsFromPhoto);
    document.getElementById('manualAddBtn').addEventListener('click', handleManualAdd);
    document.getElementById('manualPlantInput').addEventListener('keypress', event => {
        if (event.key === 'Enter') handleManualAdd();
    });

    if (photoData && !scanStarted) {
        scanStarted = true;
        scanPlantsFromPhoto();
    }
}

function bindPhotoInput(content) {
    const input = document.getElementById('photoInput');
    document.getElementById('photoPreview').addEventListener('click', () => input.click());
    document.getElementById('cameraBtn').addEventListener('click', () => {
        input.setAttribute('capture', 'environment');
        input.click();
    });
    document.getElementById('galleryBtn').addEventListener('click', () => {
        input.removeAttribute('capture');
        input.click();
    });
    input.addEventListener('change', event => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const dataUrl = ev.target.result;
            const [header, base64] = dataUrl.split(',');
            const mediaType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
            photoData = { base64, mediaType, dataUrl };
            scanStarted = false;
            renderStep2(content);
        };
        reader.readAsDataURL(file);
    });
}

function renderPlantList() {
    const list = document.getElementById('plantList');
    if (!list) return;

    if (detectedPlants.length === 0) {
        list.innerHTML = `
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;">
                No plants yet. Add the target plant or scan a photo.
            </div>
        `;
        return;
    }

    list.innerHTML = detectedPlants.map((plant, index) => `
        <div style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:26px;line-height:1;flex-shrink:0;">${plant.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(plant.name)}</div>
                <div style="font-size:10px;color:var(--muted);margin-top:3px;">
                    ${plant.confidence ? `${Math.round(plant.confidence * 100)}% photo match · ` : ''}${plant.species}
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:5px;">
                <button data-action="dec" data-idx="${index}" style="width:26px;height:26px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;">−</button>
                <span style="font-size:13px;font-weight:900;min-width:22px;text-align:center;">${plant.slots}</span>
                <button data-action="inc" data-idx="${index}" style="width:26px;height:26px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;">+</button>
            </div>
            <button data-action="remove" data-idx="${index}" aria-label="Remove plant"
                style="border:none;background:transparent;color:var(--muted);font-size:18px;cursor:pointer;padding:2px 4px;">×</button>
        </div>
    `).join('');

    list.querySelectorAll('button[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.idx);
            const action = button.dataset.action;
            if (action === 'inc') detectedPlants[index].slots = Math.min(40, detectedPlants[index].slots + 1);
            if (action === 'dec') detectedPlants[index].slots = Math.max(1, detectedPlants[index].slots - 1);
            if (action === 'remove') detectedPlants.splice(index, 1);
            renderPlantList();
        });
    });
}

async function scanPlantsFromPhoto() {
    if (!photoData) {
        showToast('warning', 'Add a field photo first');
        return;
    }

    const button = document.getElementById('scanBtn');
    const status = document.getElementById('scanStatus');
    if (button) {
        button.textContent = 'Scanning...';
        button.disabled = true;
    }
    if (status) status.textContent = 'AI is checking the field photo...';

    try {
        let data = null;
        try {
            data = await scanPlantsWithFirebaseAI({
                image: photoData.base64,
                mediaType: photoData.mediaType,
                targetPlant: fieldInfo.targetPlant,
            });
            if (data?.plants?.length) {
                console.log('[BuildFarm] Firebase AI Logic recognized plants');
            }
        } catch (firebaseError) {
            console.warn('[BuildFarm] Firebase AI Logic unavailable:', firebaseError.message);
        }

        if (!data) {
            const res = await fetch(`${API_BASE}/api/farms/scan-plants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: photoData.base64, mediaType: photoData.mediaType, targetPlant: fieldInfo.targetPlant }),
            });
            data = await res.json();
        }
        const plants = Array.isArray(data.plants) ? data.plants : [];
        if (plants.length) {
            mergePlants(plants);
            showToast('success', `${plants.length} plant type${plants.length > 1 ? 's' : ''} detected`);
            if (status) status.textContent = 'Review and adjust slots before generating 3D.';
        } else {
            if (status) status.textContent = data.warning || 'No clear plant detected. Manual list is still usable.';
            showToast('info', 'No plant detected from photo yet');
        }
    } catch (error) {
        if (status) status.textContent = 'Photo scan unavailable. Manual plant list is ready.';
        showToast('warning', 'AI scan unavailable, continue manually');
    } finally {
        if (button) {
            button.textContent = 'Scan Photo';
            button.disabled = false;
        }
        renderPlantList();
    }
}

function renderStep3(content) {
    const rack = currentRack();
    const totalUsed = totalSlotsUsed();
    const targetPlant = fieldInfo.targetPlant.trim() || detectedPlants[0]?.name || 'Plant';

    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px;font-weight:900;">${escapeHTML(targetPlant)} Vertical 3D</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:2px;">Drag to orbit · Toggle for gamified view</div>
                    </div>
                    <div style="display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:3px;flex-shrink:0;">
                        <button class="view-toggle" data-mode="realistic"
                            style="${toggleStyle(viewMode === 'realistic')}">Real</button>
                        <button class="view-toggle" data-mode="gamified"
                            style="${toggleStyle(viewMode === 'gamified')}">Game</button>
                    </div>
                </div>
                <div style="position:relative;background:#10141d;">
                    <canvas id="farmCanvas3D" style="width:100%;height:clamp(300px,44dvh,560px);display:block;"></canvas>
                    <div id="canvas3DOverlay"
                         style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                                background:rgba(16,20,29,.74);color:rgba(255,255,255,.78);font-size:13px;">
                        Building 3D field...
                    </div>
                    ${photoData ? `
                        <img src="${photoData.dataUrl}" alt="Field source photo"
                             style="position:absolute;right:10px;bottom:10px;width:70px;height:70px;border-radius:10px;
                                    object-fit:cover;border:2px solid rgba(255,255,255,.45);box-shadow:0 8px 20px rgba(0,0,0,.22);">
                    ` : ''}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS SNAPSHOT</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    ${metricBlock('Target plant', targetPlant)}
                    ${metricBlock('Goal', goalLabel(fieldInfo.analysisGoal))}
                    ${metricBlock('Structure', rack.label)}
                    ${metricBlock('Slots', `${totalUsed}/${rack.total}`, totalUsed > rack.total ? 'var(--danger)' : 'var(--ok)')}
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                    ${detectedPlants.map(plant => `
                        <span style="padding:5px 9px;border-radius:20px;background:var(--ok-bg);color:var(--ok);font-size:12px;font-weight:800;">
                            ${plant.emoji} ${escapeHTML(plant.name)} ×${plant.slots}
                        </span>
                    `).join('')}
                </div>
            </section>
        </div>
    `;

    document.querySelectorAll('.view-toggle').forEach(button => {
        button.addEventListener('click', () => {
            viewMode = button.dataset.mode;
            renderStep3(content);
        });
    });

    setTimeout(() => init3DField(rack), 100);
}

function toggleStyle(active) {
    return [
        'border:none',
        'border-radius:8px',
        'padding:7px 10px',
        'font-size:11px',
        'font-weight:900',
        'cursor:pointer',
        `background:${active ? 'var(--accent)' : 'transparent'}`,
        `color:${active ? '#fff' : 'var(--muted)'}`,
    ].join(';');
}

function metricBlock(label, value, color = 'var(--text)') {
    return `
        <div style="border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);min-height:62px;">
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-bottom:5px;">${label}</div>
            <div style="font-size:13px;color:${color};font-weight:900;line-height:1.25;">${escapeHTML(String(value))}</div>
        </div>
    `;
}

async function init3DField(rack) {
    const canvas = document.getElementById('farmCanvas3D');
    const overlay = document.getElementById('canvas3DOverlay');
    if (!canvas) return;

    if (overlay) overlay.style.display = 'none';

    const getCanvasSize = () => ({
        width: Math.max(240, canvas.clientWidth || canvas.offsetWidth || 360),
        height: Math.max(260, canvas.clientHeight || canvas.offsetHeight || 330),
    });
    const { width, height } = getCanvasSize();

    if (!hasWebGLSupport()) {
        draw3DFallbackCanvas(canvas, rack, width, height);
        showToast('warning', 'WebGL is disabled, showing 2D preview');
        return;
    }
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: true,
        });
    } catch (error) {
        console.warn('[BuildFarm] WebGL unavailable, using 2D fallback:', error.message);
        draw3DFallbackCanvas(canvas, rack, width, height);
        showToast('warning', 'WebGL is disabled, showing 2D preview');
        return;
    }
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(viewMode === 'gamified' ? 0x18223a : 0x10141d);
    scene.fog = new THREE.FogExp2(viewMode === 'gamified' ? 0x18223a : 0x10141d, 0.028);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 80);
    camera.position.set(3.3, 2.25, 3.7);

    scene.add(new THREE.AmbientLight(viewMode === 'gamified' ? 0x7894ff : 0x42516f, 1.55));
    const sun = new THREE.DirectionalLight(0xffffff, viewMode === 'gamified' ? 3.4 : 2.3);
    sun.position.set(5, 8, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const { tiers, slotsPerTier } = rack;
    const slotW = rack.shape === 'channel' ? 0.34 : rack.shape === 'wall' ? 0.36 : rack.shape === 'column' ? 0.46 : 0.42;
    const rackW = slotsPerTier * slotW + 0.1;
    const rackD = rack.shape === 'wall' ? 0.34 : rack.shape === 'column' ? 1.0 : viewMode === 'gamified' ? 0.72 : 0.58;
    const tierH = rack.tiers >= 5 ? 0.54 : 0.66;
    const totalH = tiers * tierH;

    const groundMat = new THREE.MeshStandardMaterial({
        color: viewMode === 'gamified' ? 0x1d2b52 : 0x161b24,
        roughness: 0.9,
        metalness: 0.02,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const poleMat = new THREE.MeshStandardMaterial({
        color: viewMode === 'gamified' ? 0x5b7cfa : 0x59687c,
        roughness: 0.3,
        metalness: 0.75,
    });
    const shelfMat = new THREE.MeshStandardMaterial({
        color: viewMode === 'gamified' ? 0x7dd3fc : 0x708090,
        roughness: 0.42,
        metalness: 0.55,
    });
    const accentMat = new THREE.MeshStandardMaterial({
        color: viewMode === 'gamified' ? 0xfacc15 : 0xa78bfa,
        emissive: viewMode === 'gamified' ? 0x854d0e : 0x5b21b6,
        emissiveIntensity: viewMode === 'gamified' ? 0.45 : 0.2,
        roughness: 0.5,
    });

    const poleGeo = new THREE.BoxGeometry(0.045, totalH, 0.045);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(sx * rackW / 2, totalH / 2, sz * rackD / 2);
        pole.castShadow = true;
        scene.add(pole);
    });

    const slotPlants = [];
    detectedPlants.forEach(plant => {
        for (let i = 0; i < plant.slots; i++) slotPlants.push(plant);
    });

    for (let tier = 0; tier < tiers; tier++) {
        const y = tier * tierH;
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(rackW, 0.035, rackD), shelfMat);
        shelf.position.set(0, y + 0.018, 0);
        shelf.castShadow = true;
        shelf.receiveShadow = true;
        scene.add(shelf);

        const lightBar = new THREE.Mesh(new THREE.BoxGeometry(rackW * 0.86, 0.018, 0.035), accentMat);
        lightBar.position.set(0, y + tierH - 0.07, -rackD / 2 + 0.06);
        scene.add(lightBar);

        const growLight = new THREE.PointLight(viewMode === 'gamified' ? 0xfacc15 : 0xa78bfa, 0.75, 1.4);
        growLight.position.set(0, y + tierH * 0.7, 0);
        scene.add(growLight);

        for (let slot = 0; slot < slotsPerTier; slot++) {
            const slotIndex = tier * slotsPerTier + slot;
            const plant = slotPlants[slotIndex];
            const x = (slot - (slotsPerTier - 1) / 2) * slotW;
            const z = 0;
            const baseY = y + 0.05;

            if (!plant) {
                const empty = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.07, 0.07, 0.018, viewMode === 'gamified' ? 6 : 16),
                    new THREE.MeshStandardMaterial({ color: 0x243044, transparent: true, opacity: 0.58, roughness: 0.9 })
                );
                empty.position.set(x, baseY, z);
                scene.add(empty);
                continue;
            }

            addPlantModel(THREE, scene, plant, x, baseY, z, slotIndex);
        }
    }

    if (viewMode === 'gamified') addGamifiedRewards(THREE, scene, rackW, totalH);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.target.set(0, totalH * 0.42, 0);
    controls.minDistance = 1.7;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI * 0.82;
    controls.autoRotate = true;
    controls.autoRotateSpeed = viewMode === 'gamified' ? 1.0 : 0.55;
    controls.addEventListener('start', () => { controls.autoRotate = false; });

    const resizeObserver = new ResizeObserver(() => {
        const { width: nextWidth, height: nextHeight } = getCanvasSize();
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(nextWidth, nextHeight, false);
    });
    resizeObserver.observe(canvas);

    let rafId;
    const tick = () => {
        rafId = requestAnimationFrame(tick);
        controls.update();
        renderer.render(scene, camera);
    };
    tick();

    threeCleanup = () => {
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        controls.dispose();
        scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) object.material.forEach(material => material.dispose());
                else object.material.dispose();
            }
        });
        renderer.dispose();
    };
}

function addPlantModel(THREE, scene, plant, x, y, z, slotIndex) {
    const leafPalette = viewMode === 'gamified'
        ? [0x4ade80, 0x22d3ee, 0xfacc15, 0xfb7185, 0xa78bfa]
        : [0x22c55e, 0x16a34a, 0x65a30d, 0x15803d, 0x86efac];
    const leafColor = leafPalette[slotIndex % leafPalette.length];

    const potMat = new THREE.MeshStandardMaterial({
        color: viewMode === 'gamified' ? 0xf97316 : 0x7c3aed,
        roughness: 0.68,
    });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.058, 0.07, viewMode === 'gamified' ? 6 : 16), potMat);
    pot.position.set(x, y + 0.035, z);
    pot.castShadow = true;
    scene.add(pot);

    const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.095, 8),
        new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.82 })
    );
    stem.position.set(x, y + 0.105, z);
    scene.add(stem);

    const leafMat = new THREE.MeshStandardMaterial({
        color: leafColor,
        roughness: viewMode === 'gamified' ? 0.48 : 0.86,
        emissive: viewMode === 'gamified' ? leafColor : 0x000000,
        emissiveIntensity: viewMode === 'gamified' ? 0.12 : 0,
    });

    const leafCount = viewMode === 'gamified' ? 5 : 3;
    for (let i = 0; i < leafCount; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 8), leafMat);
        const angle = (Math.PI * 2 / leafCount) * i;
        leaf.scale.set(1.25, 0.42, 0.7);
        leaf.position.set(
            x + Math.cos(angle) * 0.05,
            y + 0.15 + (i % 2) * 0.016,
            z + Math.sin(angle) * 0.045
        );
        leaf.rotation.set(0.25, angle, -0.25);
        leaf.castShadow = true;
        scene.add(leaf);
    }
}

function addGamifiedRewards(THREE, scene, rackW, totalH) {
    const coinMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0x854d0e,
        emissiveIntensity: 0.35,
        roughness: 0.35,
        metalness: 0.35,
    });
    for (let i = 0; i < 5; i++) {
        const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.014, 18), coinMat);
        coin.rotation.x = Math.PI / 2;
        coin.position.set((i - 2) * rackW / 5, totalH + 0.18 + (i % 2) * 0.08, -0.42);
        scene.add(coin);
    }
}

function hasWebGLSupport() {
    try {
        const testCanvas = document.createElement('canvas');
        return Boolean(
            window.WebGLRenderingContext
            && (testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
        );
    } catch (error) {
        return false;
    }
}

function draw3DFallbackCanvas(canvas, rack, width, height) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, viewMode === 'gamified' ? '#18223a' : '#10141d');
    gradient.addColorStop(1, viewMode === 'gamified' ? '#25345d' : '#1f2937');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const slotPlants = [];
    detectedPlants.forEach(plant => {
        for (let i = 0; i < plant.slots; i++) slotPlants.push(plant);
    });

    const pad = 34;
    const rackWidth = width - pad * 2;
    const rackHeight = height - 68;
    const tierGap = rackHeight / rack.tiers;
    const slotGap = rackWidth / rack.slotsPerTier;

    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height - 24, rackWidth * 0.43, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = viewMode === 'gamified' ? '#7dd3fc' : '#64748b';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(pad + 8, 32);
    ctx.lineTo(pad + 8, height - 45);
    ctx.moveTo(width - pad - 8, 32);
    ctx.lineTo(width - pad - 8, height - 45);
    ctx.stroke();

    for (let tier = 0; tier < rack.tiers; tier++) {
        const y = 42 + tier * tierGap;
        ctx.fillStyle = viewMode === 'gamified' ? '#7dd3fc' : '#708090';
        roundRect(ctx, pad, y + tierGap * 0.56, rackWidth, 9, 5);
        ctx.fill();

        ctx.fillStyle = viewMode === 'gamified' ? '#facc15' : '#a78bfa';
        roundRect(ctx, pad + rackWidth * 0.12, y + 7, rackWidth * 0.76, 5, 3);
        ctx.fill();

        for (let slot = 0; slot < rack.slotsPerTier; slot++) {
            const index = tier * rack.slotsPerTier + slot;
            const plant = slotPlants[index];
            const x = pad + slotGap * (slot + 0.5);
            const baseY = y + tierGap * 0.53;

            ctx.fillStyle = plant ? (viewMode === 'gamified' ? '#f97316' : '#7c3aed') : 'rgba(148,163,184,0.35)';
            ctx.beginPath();
            ctx.ellipse(x, baseY, 13, 7, 0, 0, Math.PI * 2);
            ctx.fill();

            if (plant) drawFallbackPlant(ctx, x, baseY, plant, index);
        }
    }

    if (viewMode === 'gamified') {
        ctx.fillStyle = '#facc15';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(width * 0.26 + i * 34, 28 + (i % 2) * 9, 7, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.fillStyle = 'rgba(255,255,255,0.86)';
    ctx.font = '700 12px Inter, system-ui, sans-serif';
    ctx.fillText(`${rack.tiers} tiers · ${Math.min(slotPlants.length, rack.total)}/${rack.total} plants`, 16, height - 16);
}

function drawFallbackPlant(ctx, x, y, plant, index) {
    const colors = viewMode === 'gamified'
        ? ['#4ade80', '#22d3ee', '#facc15', '#fb7185', '#a78bfa']
        : ['#22c55e', '#16a34a', '#65a30d', '#15803d', '#86efac'];
    const color = plant.emoji === '🍅' ? '#ef4444' : plant.emoji === '🌶️' ? '#dc2626' : colors[index % colors.length];

    ctx.strokeStyle = '#365314';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x, y - 25);
    ctx.stroke();

    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i;
        ctx.save();
        ctx.translate(x + Math.cos(angle) * 8, y - 24 + Math.sin(angle) * 5);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
async function handleNext() {
    if (step === 1) {
        if (!fieldInfo.name.trim()) {
            showToast('warning', 'Enter a field name');
            return;
        }
        if (parseTargetPlants(fieldInfo.targetPlant).length === 0) {
            showToast('warning', 'Enter at least one plant for analysis');
            return;
        }
        syncTargetPlants(fieldInfo.targetPlant);
        step = 2;
        drawStep();
        return;
    }

    if (step === 2) {
        if (!photoData) {
            showToast('warning', 'Add a field photo before generating 3D');
            return;
        }
        if (detectedPlants.length === 0) {
            syncTargetPlants(fieldInfo.targetPlant || 'Plant');
        }
        step = 3;
        drawStep();
        return;
    }

    if (step === 3) {
        await createField();
    }
}

function handleBack() {
    if (step === 1) {
        handleCancel();
        return;
    }
    step -= 1;
    drawStep();
}

async function goToFarmList(message) {
    dispose3D();
    if (message) showToast('info', message);

    try {
        const module = await import('./FarmListPage.js');
        module.render();
    } catch (error) {
        console.error('[BuildFarm] Direct FarmList fallback failed:', error);
        window.location.reload();
    }
}

function handleCancel() {
    goToFarmList('New field creation cancelled');
}
async function createField() {
    const button = document.getElementById('bfNext');
    if (button) {
        button.disabled = true;
        button.textContent = 'Creating...';
    }

    const rack = currentRack();
    const payload = {
        name: fieldInfo.name.trim(),
        location: fieldInfo.location.trim(),
        rackType: fieldInfo.rackType,
        targetPlant: fieldInfo.targetPlant.trim(),
        analysisGoal: fieldInfo.analysisGoal,
        viewMode,
        photoPreview: photoData?.dataUrl || null,
        plants: detectedPlants,
    };

    try {
        await fetch(`${API_BASE}/api/farms/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.warn('[BuildFarm] create field API unavailable:', error.message);
    }

    const saved = loadSavedFarms();
    const farm = {
        id: `field_${Date.now()}`,
        name: payload.name,
        location: payload.location,
        zone: fieldInfo.location.trim() || String.fromCharCode(65 + (saved.length % 26)),
        rackTypeId: fieldInfo.rackType,
        rackType: rack.label,
        rackLabel: rack.label,
        targetPlant: payload.targetPlant,
        analysisGoal: payload.analysisGoal,
        viewMode,
        photoPreview: payload.photoPreview,
        plants: detectedPlants.map(plant => ({ ...plant })),
        plantSlots: totalSlotsUsed(),
        createdAt: new Date().toISOString(),
    };
    saved.push(farm);
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(saved));

    AppState.newFarm = payload;
    AppState.currentFarm = farm;
    AppState.currentFarmId = farm.id;
    AppState.farmName = farm.name;
    showToast('success', `"${farm.name}" field created`);
    dispose3D();
    setTimeout(() => goToFarmList(), 500);
}

function handleManualAdd() {
    const input = document.getElementById('manualPlantInput');
    if (!input) return;
    const raw = input.value.trim();
    if (!raw) return;
    mergePlants([plantFromName(raw, 3, 0, 'manual')]);
    input.value = '';
    renderPlantList();
    showToast('success', `${raw} added`);
}

function parseTargetPlants(value) {
    const seen = new Set();
    return String(value || '')
        .split(/[,;\n]+/)
        .map(name => name.trim())
        .filter(Boolean)
        .filter(name => {
            const key = name.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

function syncTargetPlants(value) {
    const names = parseTargetPlants(value);
    const targetSpecies = new Set(names.map(name => name.toLowerCase().replace(/\s+/g, '_')));
    detectedPlants = detectedPlants.filter(plant => plant.source !== 'target' || targetSpecies.has(plant.species));

    names.slice().reverse().forEach(name => {
        const next = plantFromName(name, 4, 0, 'target');
        const existing = detectedPlants.find(plant => plant.species === next.species);
        if (!existing) detectedPlants.unshift(next);
    });
}

function mergePlants(plants) {
    plants.forEach(plant => {
        const normalized = normalizePlant(plant);
        const existing = detectedPlants.find(item => item.species === normalized.species);
        if (existing) {
            existing.slots = Math.max(existing.slots, normalized.slots);
            existing.confidence = Math.max(existing.confidence || 0, normalized.confidence || 0);
            existing.source = normalized.source || existing.source;
        } else {
            detectedPlants.push(normalized);
        }
    });
}

function plantFromName(name, slots = 3, confidence = 0, source = 'target') {
    const key = String(name || '').toLowerCase().trim();
    return normalizePlant({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        emoji: emojiForName(key),
        species: key.replace(/\s+/g, '_'),
        confidence,
        slots,
        source,
    });
}

function emojiForName(name = '') {
    const key = String(name).toLowerCase().replace(/_/g, ' ');
    if (EMOJI_MAP[key]) return EMOJI_MAP[key];
    const matched = Object.keys(EMOJI_MAP).find(item => key.includes(item));
    return matched ? EMOJI_MAP[matched] : '🌱';
}

function normalizePlant(plant) {
    const name = plant.name || 'Plant';
    const species = (plant.species || name).toLowerCase().trim().replace(/\s+/g, '_');
    return {
        name,
        emoji: plant.emoji || emojiForName(species),
        species,
        confidence: Math.max(0, Math.min(1, Number(plant.confidence) || 0)),
        slots: Math.max(1, Math.min(40, Number.parseInt(plant.slots, 10) || 3)),
        source: plant.source || 'ai',
    };
}
function currentRack() {
    return RACK_OPTIONS.find(rack => rack.id === fieldInfo.rackType) || RACK_OPTIONS[0];
}

function totalSlotsUsed() {
    return detectedPlants.reduce((sum, plant) => sum + plant.slots, 0);
}

function goalLabel(id) {
    return ANALYSIS_GOALS.find(goal => goal.id === id)?.label || id;
}

function bindTextInput(id, onInput) {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('input', event => onInput(event.target.value));
    input.addEventListener('focus', () => { input.style.borderColor = 'var(--accent)'; });
    input.addEventListener('blur', () => { input.style.borderColor = 'var(--border)'; });
}

function loadSavedFarms() {
    try {
        return JSON.parse(localStorage.getItem(FARMS_STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function dispose3D() {
    if (threeCleanup) {
        threeCleanup();
        threeCleanup = null;
    }
}

function escapeHTML(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}








