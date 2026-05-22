import { API_BASE } from '../utils/apiBase.js';
/**
 * BuildFarmPage.js
 * New Field wizard: Plant analysis setup -> photo capture -> 3D vertical preview.
 */

import { AppState } from '../store.js';
// (如果你的项目中其他地方还需要用到 saveFarmsToFirestore，保留 import 无妨，但这里已经不需要调用了)
import { saveFarmsToFirestore } from '../utils/firebase.js'; 
import { showToast } from '../utils/toast.js';
import { CommercialFarmCanvas } from '../components/CommercialFarmCanvas.js?v=commercial-polish-1';
import jsQR from 'https://esm.sh/jsqr@1.4.0';
import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const FARMS_STORAGE_KEY = 'user_farms';


// ─── 【新增】JWT 认证 Header 助手函数 ───
function getAuthHeaders(extraHeaders = {}) {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...extraHeaders
    };
}
// ──────────────────────────────────────────

let step = 1;
let photoData = null;
let viewMode = 'realistic';
let threeCleanup = null;
let scanStarted = false;
let deviceSetup = { serial: 'SD-BGN-STD-00456', wifiSsid: '', wifiPassword: '', accountType: 'beginner_standard' };
let registeredDevice = null;
let goalPriority = ['beginner_safe'];
let generatedThresholds = null;
let fieldInfo = {
    name: '',
    location: '',
    description: '',
    targetPlant: '',
    analysisGoal: 'yield',
    rackType: '3-tier',
    customRack: null,
};
let detectedPlants = [];
let commercialStructure = null;
let commercialGoals = ['maximum_yield'];
let commercialFarmThresholds = null;
let commercialZoneThresholds = {};
let commercialDeviceAssignments = [];
let commercialPendingDevice = null;
let commercialDraftFarmId = null;
let beginnerDraftFarmId = null;

const COMMERCIAL_GOAL_OPTIONS = [
    { id: 'maximum_yield', label: 'Maximum Yield' },
    { id: 'profit_optimisation', label: 'Profit Optimisation' },
    { id: 'crop_safety_first', label: 'Crop Safety First' },
    { id: 'research_testing', label: 'Research & Testing' },
    { id: 'automation_first', label: 'Automation First' },
    { id: 'compliance_audit', label: 'Compliance & Audit' },
];

const DEFAULT_COMMERCIAL_ZONES = [
    { zone_id: 'zone_A', name: 'Zone A', recommended_type: 'zone_node', crop: 'Tomato / Chili / Basil', plants: ['tomato', 'chili', 'basil'], confidence: 0.88, notes: 'High-value crop area detected' },
    { zone_id: 'zone_B', name: 'Zone B', recommended_type: 'zone_node', crop: 'Lettuce', plants: ['lettuce'], confidence: 0.82, notes: 'Leafy green rack area detected' },
    { zone_id: 'zone_C', name: 'Zone C', recommended_type: 'zone_node', crop: 'Spinach', plants: ['spinach'], confidence: 0.79, notes: 'Standard greens area detected' },
];

const COMMERCIAL_SIZE_OPTIONS = [
    { id: 'small', label: 'Small Farm', standard: '1 grow room or pilot rack area', zones: '2 zones', area: 'up to 30 m2', use: 'SME trial, school lab, restaurant greens' },
    { id: 'medium', label: 'Medium Farm', standard: 'several rack rows in one site', zones: '3 zones', area: '30-120 m2', use: 'urban farm operator or institution' },
    { id: 'large', label: 'Large Farm', standard: 'multi-room or high-density production floor', zones: '4 zones', area: '120+ m2', use: 'commercial production with separate crop zones' },
];

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

const GOAL_OPTIONS = [
    { id: 'healthy_growth', label: 'Healthy Growth' },
    { id: 'eco_save', label: 'Eco Save' },
    { id: 'low_maintenance', label: 'Low Maintenance' },
    { id: 'fast_harvest', label: 'Fast Harvest' },
    { id: 'cost_efficient', label: 'Cost Efficient' },
    { id: 'beginner_safe', label: 'Beginner Safe' },
];
const PACKAGE_QR_OPTIONS = [
    { id: 'beginner_starter', label: 'Beginner Starter', serial: 'SD-BGN-STR-00123', accountType: 'beginner_starter', packageLevel: 'starter', deviceType: 'beginner', desc: 'basic home sensor kit' },
    { id: 'beginner_standard', label: 'Beginner Standard', serial: 'SD-BGN-STD-00456', accountType: 'beginner_standard', packageLevel: 'standard', deviceType: 'beginner', desc: 'balanced home vertical farm kit' },
    { id: 'beginner_pro', label: 'Beginner Pro', serial: 'SD-BGN-PRO-00789', accountType: 'beginner_pro', packageLevel: 'pro', deviceType: 'beginner', desc: 'advanced home kit with more automation' },
    { id: 'commercial_farm_master_1', label: 'Commercial Farm Master Node 1', serial: 'SD-COM-FRM-03001', accountType: 'commercial_farm_master', packageLevel: 'farm_master', deviceType: 'commercial', desc: 'farm-level controller, one per commercial farm' },
    { id: 'commercial_farm_master_2', label: 'Commercial Farm Master Node 2', serial: 'SD-COM-FRM-03002', accountType: 'commercial_farm_master', packageLevel: 'farm_master', deviceType: 'commercial', desc: 'spare farm-level controller for demo or second farm' },
    { id: 'commercial_farm_master_3', label: 'Commercial Farm Master Node 3', serial: 'SD-COM-FRM-03003', accountType: 'commercial_farm_master', packageLevel: 'farm_master', deviceType: 'commercial', desc: 'spare farm-level controller for demo or second farm' },
    { id: 'commercial_farm_zone_1', label: 'Commercial Farm + Zone Combo 1', serial: 'SD-COM-FZK-02001', accountType: 'commercial_farm_zone', packageLevel: 'farm_zone', deviceType: 'commercial', desc: 'combo commercial node for farm or zone assignment' },
    { id: 'commercial_farm_zone_2', label: 'Commercial Farm + Zone Combo 2', serial: 'SD-COM-FZK-02002', accountType: 'commercial_farm_zone', packageLevel: 'farm_zone', deviceType: 'commercial', desc: 'combo commercial node for farm or zone assignment' },
    { id: 'commercial_farm_zone_3', label: 'Commercial Farm + Zone Combo 3', serial: 'SD-COM-FZK-02003', accountType: 'commercial_farm_zone', packageLevel: 'farm_zone', deviceType: 'commercial', desc: 'combo commercial node for farm or zone assignment' },
    { id: 'commercial_zone_1', label: 'Commercial Zone Node 1', serial: 'SD-COM-ZON-01001', accountType: 'commercial_zone', packageLevel: 'zone_node', deviceType: 'commercial', desc: 'zone-level sensor and actuator node' },
    { id: 'commercial_zone_2', label: 'Commercial Zone Node 2', serial: 'SD-COM-ZON-01002', accountType: 'commercial_zone', packageLevel: 'zone_node', deviceType: 'commercial', desc: 'zone-level sensor and actuator node' },
    { id: 'commercial_zone_3', label: 'Commercial Zone Node 3', serial: 'SD-COM-ZON-01003', accountType: 'commercial_zone', packageLevel: 'zone_node', deviceType: 'commercial', desc: 'zone-level sensor and actuator node' },
    { id: 'commercial_zone_4', label: 'Commercial Zone Node 4', serial: 'SD-COM-ZON-01004', accountType: 'commercial_zone', packageLevel: 'zone_node', deviceType: 'commercial', desc: 'zone-level sensor and actuator node' },
    { id: 'commercial_zone_5', label: 'Commercial Zone Node 5', serial: 'SD-COM-ZON-01005', accountType: 'commercial_zone', packageLevel: 'zone_node', deviceType: 'commercial', desc: 'zone-level sensor and actuator node' },
    { id: 'commercial_zone_basic', label: 'Legacy Commercial Zone Node', serial: 'SD-COM-ZNB-01001', accountType: 'commercial_zone_basic', packageLevel: 'zone_basic', deviceType: 'commercial', desc: 'legacy zone-level node, still supported' },
    { id: 'commercial_zone_pro', label: 'Legacy Commercial Zone Node Pro', serial: 'SD-COM-ZNP-02001', accountType: 'commercial_zone_pro', packageLevel: 'zone_pro', deviceType: 'commercial', desc: 'legacy expanded zone-level node, still supported' },
    { id: 'commercial_master', label: 'Legacy Commercial Farm Master', serial: 'SD-COM-MST-03001', accountType: 'commercial_master', packageLevel: 'farm_master', deviceType: 'commercial', desc: 'legacy master node for multi-zone farms' },
];

const DEMO_DEVICE_BY_SERIAL = {
    'SD-COM-FRM-03001': { deviceId: 'commercial-farm-master-1', deviceToken: 'sd_demo_commercial_farm_master_1' },
    'SD-COM-MST-03001': { deviceId: 'commercial-farm-master-1', deviceToken: 'sd_demo_commercial_farm_master_1' },
    'SD-COM-ZON-01001': { deviceId: 'commercial-zone-node-1', deviceToken: 'sd_demo_commercial_zone_node_1' },
    'SD-COM-ZON-01002': { deviceId: 'commercial-zone-node-2', deviceToken: 'sd_demo_commercial_zone_node_2' },
    'SD-COM-ZON-01003': { deviceId: 'commercial-zone-node-3', deviceToken: 'sd_demo_commercial_zone_node_3' },
};

const PACKAGE_CAPABILITIES = {
    starter: {
        label: 'Starter',
        thresholdKeys: ['tempMin', 'tempMax', 'humidityMin', 'humidityMax', 'soilDryThreshold', 'darkThreshold', 'wateringDurationSeconds', 'sensorIntervalSeconds'],
        lockedText: 'Unlock with Standard / Pro',
    },
    standard: {
        label: 'Standard',
        thresholdKeys: ['tempMin', 'tempMax', 'humidityMin', 'humidityMax', 'soilDryThreshold', 'darkThreshold', 'phMin', 'phMax', 'gasDangerThreshold', 'wateringDurationSeconds', 'fanDurationSeconds', 'sensorIntervalSeconds'],
        lockedText: 'Unlock with Pro',
    },
    pro: {
        label: 'Pro',
        thresholdKeys: ['tempMin', 'tempMax', 'humidityMin', 'humidityMax', 'soilDryThreshold', 'darkThreshold', 'phMin', 'phMax', 'ecMin', 'ecMax', 'co2MinPpm', 'gasDangerThreshold', 'waterLowCm', 'wateringDurationSeconds', 'fanDurationSeconds', 'sensorIntervalSeconds'],
        lockedText: '',
    },
};

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
    const commercial = isCommercialFlow();
    deviceSetup = commercial
        ? { serial: 'SD-COM-FRM-03001', wifiSsid: '', wifiPassword: '', accountType: 'commercial_farm_master' }
        : { serial: 'SD-BGN-STD-00456', wifiSsid: '', wifiPassword: '', accountType: 'beginner_standard' };
    registeredDevice = null;
    goalPriority = commercial ? ['maximum_yield'] : ['beginner_safe'];
    generatedThresholds = null;
    beginnerDraftFarmId = null;
    fieldInfo = {
        name: '',
        location: '',
        description: '',
        targetPlant: '',
        analysisGoal: 'yield',
        rackType: commercial ? 'medium' : '3-tier',
        customRack: null,
    };
    detectedPlants = [];
    commercialStructure = null;
    commercialGoals = ['maximum_yield'];
    commercialFarmThresholds = null;
    commercialZoneThresholds = {};
    commercialDeviceAssignments = [];
    commercialPendingDevice = null;
    commercialDraftFarmId = commercial ? `farm_com_${Date.now()}` : null;
    dispose3D();
    CommercialFarmCanvas.destroy?.();

    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="buildFarmScreen"
             style="display:flex;flex-direction:column;height:100vh;overflow:hidden;background:var(--bg);">
            <div class="topbar" style="flex-shrink:0;">
                <button id="bfBack" aria-label="Back"
                    style="background:none;border:none;font-size:22px;cursor:pointer;padding:4px 8px;color:var(--text);line-height:1;">←</button>
                <div>
                    <div style="font-weight:800;font-size:16px;">${isCommercialFlow() ? 'New Commercial Farm' : 'New Beginner Field'}</div>
                    <div style="font-size:11px;color:var(--muted);margin-top:1px;">${isCommercialFlow() ? 'AI zoning to device assignment and launch' : 'single-field QR setup, photo structure scan, and 3D preview'}</div>
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
    if (isCommercialFlow()) {
        drawCommercialStep();
        return;
    }

    renderStepDots();
    const content = document.getElementById('bfContent');
    const cancelBtn = document.getElementById('bfCancel');
    const btn = document.getElementById('bfNext');

    content.innerHTML = '';
    dispose3D();
    CommercialFarmCanvas.destroy?.();

    if (step === 1) {
        renderDeviceStep(content);
        cancelBtn.textContent = 'Cancel';
        btn.textContent = registeredDevice ? 'Next: Field Info' : 'Scan QR';
    }
    if (step === 2) {
        renderStep1(content);
        cancelBtn.textContent = 'Back';
        btn.textContent = 'Next: Add Photo';
    }
    if (step === 3) {
        renderStep2(content);
        cancelBtn.textContent = 'Back';
        btn.textContent = 'Next: AI Thresholds';
    }
    if (step === 4) {
        renderThresholdStep(content);
        cancelBtn.textContent = 'Back';
        btn.textContent = generatedThresholds ? 'Next: 3D Preview' : 'Generate Thresholds';
    }
    if (step === 5) {
        renderStep3(content);
        cancelBtn.textContent = 'Preview Only';
        btn.textContent = 'Create Field';
    }
}

function drawCommercialStep() {
    renderStepDots();
    const content = document.getElementById('bfContent');
    const cancelBtn = document.getElementById('bfCancel');
    const btn = document.getElementById('bfNext');

    content.innerHTML = '';
    dispose3D();

    if (step === 1) {
        renderCommercialFarmInfoStep(content);
        cancelBtn.textContent = 'Cancel';
        btn.textContent = 'Next: Analyze Farm';
    }
    if (step === 2) {
        renderCommercialPhotoZoneStep(content);
        cancelBtn.textContent = 'Back';
        btn.textContent = commercialStructure ? 'Confirm Structure' : 'Analyze Zones';
    }
    if (step === 3) {
        renderCommercialGoalStep(content);
        cancelBtn.textContent = 'Back';
        btn.textContent = 'Next: Zone Thresholds';
    }
    if (step === 4) {
        renderCommercialZoneThresholdStep(content);
        cancelBtn.textContent = 'Back';
        btn.textContent = commercialThresholdsReady() ? 'Next: Assign Devices' : 'Generate Zone Thresholds';
    }
    if (step === 5) {
        renderCommercialDeviceStep(content);
        cancelBtn.textContent = 'Back';
        btn.textContent = commercialDevicesReady() ? 'Next: Farm Overview' : 'Scan Device QR';
    }
    if (step === 6) {
        renderCommercialOverviewStep(content);
        cancelBtn.textContent = 'Back';
        btn.textContent = 'Launch Farm';
    }
}

function renderStepDots() {
    const labels = isCommercialFlow()
        ? ['Farm', 'Zones', 'Goals', 'Thresholds', 'Devices', 'Launch']
        : ['Device', 'Field', 'Photo', 'Goals', '3D'];
    document.getElementById('bfSteps').innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(${labels.length},1fr);gap:6px;padding-bottom:10px;">
            ${labels.map((label, index) => {
                const active = index + 1 <= step;
                return `
                    <div style="display:flex;align-items:center;gap:6px;min-width:0;">
                        <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${active ? 'var(--accent)' : 'var(--border)'};
                                    color:${active ? '#fff' : 'var(--muted)'};
                                    font-size:10px;font-weight:800;flex-shrink:0;">
                            ${index + 1 < step ? '✓' : index + 1}
                        </div>
                        <div style="font-size:10px;font-weight:800;color:${index + 1 === step ? 'var(--accent)' : 'var(--muted)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${label}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderCommercialFarmInfoStep(content) {
    const selectedSize = commercialSizeOption();
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">COMMERCIAL FARM INFO</div>
                ${fieldInput('fieldNameInput', 'Farm name', 'e.g. SeedDown Commercial Farm 1', fieldInfo.name)}
                ${fieldInput('fieldLocationInput', 'Location', 'e.g. Johor Bahru Industrial Park', fieldInfo.location)}
                <div style="margin-bottom:10px;">
                    <div style="font-size:11px;font-weight:800;color:var(--sub);margin-bottom:8px;">Farm size standard</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${COMMERCIAL_SIZE_OPTIONS.map(size => commercialSizeCard(size)).join('')}
                    </div>
                    <div style="margin-top:9px;padding:10px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);font-size:11px;color:var(--muted);line-height:1.45;">
                        Selected: <strong style="color:var(--text);">${escapeHTML(selectedSize.label)}</strong> · ${escapeHTML(selectedSize.standard)} · ${escapeHTML(selectedSize.area)} · recommended ${escapeHTML(selectedSize.zones)}.
                    </div>
                </div>
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">Description</span>
                    <textarea id="fieldDescriptionInput" placeholder="Optional notes about this commercial farm"
                        style="width:100%;min-height:92px;resize:vertical;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;line-height:1.4;">${escapeHTML(fieldInfo.description)}</textarea>
                </label>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;">
                    Commercial setup analyzes the farm space first, then assigns QR devices to the right zones.
                </div>
            </section>
        </div>
    `;

    bindTextInput('fieldNameInput', value => { fieldInfo.name = value; });
    bindTextInput('fieldLocationInput', value => { fieldInfo.location = value; });
    bindTextInput('fieldDescriptionInput', value => { fieldInfo.description = value; });
    document.querySelectorAll('.commercial-size-card').forEach(button => {
        button.addEventListener('click', () => {
            fieldInfo.rackType = button.dataset.size || 'medium';
            commercialStructure = null;
            drawStep();
        });
    });
}

function commercialSizeCard(size) {
    const selected = (fieldInfo.rackType || 'medium') === size.id;
    return `
        <button type="button" class="commercial-size-card" data-size="${size.id}"
            style="text-align:left;padding:12px;border-radius:13px;border:1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'};background:${selected ? 'var(--accent-l)' : 'var(--surface2)'};color:var(--text);cursor:pointer;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
                <strong style="font-size:13px;color:${selected ? 'var(--accent)' : 'var(--text)'};">${escapeHTML(size.label)}</strong>
                <span style="font-size:10px;font-weight:900;color:${selected ? 'var(--accent)' : 'var(--muted)'};">${selected ? 'SELECTED' : escapeHTML(size.zones)}</span>
            </div>
            <div style="font-size:11px;color:var(--muted);line-height:1.4;margin-top:5px;">${escapeHTML(size.standard)} · ${escapeHTML(size.area)}</div>
            <div style="font-size:10px;color:var(--sub);line-height:1.35;margin-top:4px;">Best for: ${escapeHTML(size.use)}</div>
        </button>
    `;
}

function commercialSizeOption() {
    return COMMERCIAL_SIZE_OPTIONS.find(size => size.id === (fieldInfo.rackType || 'medium')) || COMMERCIAL_SIZE_OPTIONS[1];
}

function renderCommercialPhotoZoneStep(content) {
    const zones = commercialStructure?.zones || [];
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FULL FARM PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture all racks or visible production areas before QR assignment.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${photoData ? 'READY' : 'NEEDED'}</div>
                </div>
                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${photoData ? 'var(--accent)' : 'var(--border)'};
                            background:${photoData ? `url(${photoData.dataUrl}) center/cover` : 'var(--surface2)'};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${photoData ? '<div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.58);color:white;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;">Farm photo loaded</div>' : `
                        <div style="text-align:center;color:var(--muted);">
                            <div style="font-size:36px;margin-bottom:8px;">▣</div>
                            <div style="font-size:13px;font-weight:800;">Tap to add commercial farm photo</div>
                            <div style="font-size:11px;margin-top:4px;">wide photo works best</div>
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
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">AI ZONE STRUCTURE</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">AI recommends production zones and node assignment before QR scanning.</div>
                    </div>
                    <button id="analyzeCommercialZonesBtn" ${!photoData ? 'disabled' : ''}
                        style="padding:8px 10px;border-radius:999px;border:1px solid ${photoData ? 'var(--accent)' : 'var(--border)'};background:${photoData ? 'var(--accent-l)' : 'var(--surface2)'};color:${photoData ? 'var(--accent)' : 'var(--muted)'};font-size:11px;font-weight:900;cursor:${photoData ? 'pointer' : 'not-allowed'};">Analyze</button>
                </div>
                <div id="commercialZoneSummary">${commercialStructureHtml()}</div>
                ${zones.length ? `
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
                        <button id="addCommercialZoneBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-weight:800;cursor:pointer;">Add Zone</button>
                        <button id="removeCommercialZoneBtn" style="padding:11px;border:1px solid rgba(220,38,38,.24);border-radius:10px;background:rgba(220,38,38,.08);color:var(--danger);font-weight:800;cursor:pointer;">Remove Last</button>
                    </div>
                ` : ''}
            </section>
        </div>
    `;

    bindPhotoInput(content);
    document.getElementById('analyzeCommercialZonesBtn')?.addEventListener('click', analyzeCommercialZones);
    document.getElementById('addCommercialZoneBtn')?.addEventListener('click', () => {
        ensureCommercialStructure();
        const nextIndex = commercialStructure.zones.length;
        commercialStructure.zones.push({
            zone_id: `zone_${String.fromCharCode(65 + nextIndex)}`,
            name: `Zone ${String.fromCharCode(65 + nextIndex)}`,
            recommended_type: 'zone_node',
            crop: 'Mixed Crops',
            plants: ['lettuce'],
            confidence: 0.7,
            notes: 'Manually added zone',
        });
        commercialStructure.total_devices_needed = commercialStructure.farm_master_count + commercialStructure.zones.length;
        drawStep();
    });
    document.getElementById('removeCommercialZoneBtn')?.addEventListener('click', () => {
        if (commercialStructure?.zones?.length > 1) {
            commercialStructure.zones.pop();
            commercialStructure.total_devices_needed = commercialStructure.farm_master_count + commercialStructure.zones.length;
            drawStep();
        }
    });
}

function renderCommercialGoalStep(content) {
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">COMMERCIAL FARM GOALS</div>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;margin-bottom:12px;">Select up to three commercial priorities. These are applied per zone when generating thresholds.</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${COMMERCIAL_GOAL_OPTIONS.map(goal => {
                        const selected = commercialGoals.includes(goal.id);
                        return `<button class="commercial-goal-priority" data-id="${goal.id}"
                            style="padding:12px 8px;border-radius:12px;border:1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'};background:${selected ? 'var(--accent-l)' : 'var(--surface2)'};color:${selected ? 'var(--accent)' : 'var(--text)'};font-weight:900;font-size:12px;cursor:pointer;">${goal.label}</button>`;
                    }).join('')}
                </div>
            </section>
        </div>
    `;

    document.querySelectorAll('.commercial-goal-priority').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            if (commercialGoals.includes(id)) commercialGoals = commercialGoals.filter(item => item !== id);
            else if (commercialGoals.length < 3) commercialGoals = [...commercialGoals, id];
            else showToast('warning', 'Choose up to 3 commercial goals');
            commercialFarmThresholds = null;
            commercialZoneThresholds = {};
            renderCommercialGoalStep(content);
        });
    });
}

function renderCommercialZoneThresholdStep(content) {
    ensureCommercialStructure();
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">ZONE PLANTS + THRESHOLDS</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Farm Master gets safety thresholds. Each zone gets its own crop recipe.</div>
                    </div>
                    <button id="generateCommercialThresholdsBtn" style="padding:8px 10px;border-radius:999px;border:1px solid var(--accent);background:var(--accent-l);color:var(--accent);font-size:11px;font-weight:900;cursor:pointer;">Generate All</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    ${farmThresholdCardHtml()}
                    ${commercialStructure.zones.map(zoneThresholdCardHtml).join('')}
                </div>
            </section>
        </div>
    `;

    document.querySelectorAll('.zone-plant-input').forEach(input => {
        input.addEventListener('change', event => {
            const zone = commercialStructure.zones.find(item => item.zone_id === event.target.dataset.zone);
            if (!zone) return;
            syncCommercialZonePlantItems(zone, parseCommercialPlantItems(event.target.value));
            commercialFarmThresholds = null;
            delete commercialZoneThresholds[zone.zone_id];
            renderCommercialZoneThresholdStep(content);
        });
    });
    document.querySelectorAll('.commercial-threshold-input').forEach(input => {
        input.addEventListener('input', event => {
            const zoneId = event.target.dataset.zone;
            const key = event.target.dataset.key;
            const value = event.target.value === '' ? undefined : Number(event.target.value);
            if (!zoneId || !key || !Number.isFinite(value)) return;
            if (zoneId === 'farm_master') {
                if (!commercialFarmThresholds) {
                    commercialFarmThresholds = {
                        thresholds: {},
                        notes: 'Manual farm-level threshold adjustment',
                        source: 'manual',
                    };
                }
                commercialFarmThresholds.thresholds[key] = value;
                const warning = commercialSafetyWarning(key, value);
                const warningEl = document.getElementById('commercialSafety_farm_master');
                if (warningEl) {
                    warningEl.textContent = warning || '';
                    warningEl.style.display = warning ? 'block' : 'none';
                }
                if (warning) showToast('warning', warning);
                return;
            }
            if (!commercialZoneThresholds[zoneId]) {
                commercialZoneThresholds[zoneId] = {
                    thresholds: {},
                    notes: 'Manual commercial threshold adjustment',
                    source: 'manual',
                };
            }
            commercialZoneThresholds[zoneId].thresholds[key] = value;
            const warning = commercialSafetyWarning(key, value);
            const warningEl = document.getElementById(`commercialSafety_${zoneId}`);
            if (warningEl) {
                warningEl.textContent = warning || '';
                warningEl.style.display = warning ? 'block' : 'none';
            }
            if (warning) showToast('warning', warning);
        });
    });
    document.getElementById('generateCommercialThresholdsBtn')?.addEventListener('click', generateCommercialZoneThresholds);
}

function renderCommercialDeviceStep(content) {
    ensureCommercialStructure();
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ASSIGN QR DEVICES</div>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;margin-bottom:12px;">
                    Scan one package QR at a time. The app will only enable compatible assignment targets.
                </div>
                <button id="commercialScanQrBtn" type="button" style="width:100%;padding:13px;border:none;border-radius:14px;background:var(--accent);color:white;font-size:14px;font-weight:900;cursor:pointer;">
                    Scan Commercial Device QR
                </button>
                <input id="commercialDeviceQrInput" type="file" accept="image/*" capture="environment" style="display:none;">
                <div id="commercialPendingDevice" style="margin-top:12px;">${commercialPendingDeviceHtml()}</div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ASSIGNMENT PROGRESS</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${commercialAssignmentProgressHtml()}
                </div>
            </section>
        </div>
    `;

    const input = document.getElementById('commercialDeviceQrInput');
    document.getElementById('commercialScanQrBtn')?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (file) handleCommercialDeviceQrFile(file);
        event.target.value = '';
    });
    document.querySelectorAll('.commercial-assign-target').forEach(button => {
        button.addEventListener('click', () => assignPendingCommercialDevice(button.dataset.target));
    });
}

function renderCommercialOverviewStep(content) {
    ensureCommercialStructure();
    setTimeout(initCommercialPreviewCanvas, 80);
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);">
                    <div style="font-size:14px;font-weight:900;">Commercial Digital Twin Preview</div>
                    <div style="font-size:11px;color:var(--muted);margin-top:2px;">Farm Master + zone nodes mapped into the commercial 3D facility</div>
                </div>
                <div class="commercial-preview-host" style="height:min(58dvh,520px);min-height:360px;position:relative;background:#f8faf7;overflow:hidden;">
                    <canvas id="commercialPreviewCanvas" style="width:100%;height:100%;display:block;"></canvas>
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">LAUNCH SUMMARY</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    ${metricBlock('Farm', fieldInfo.name || 'Commercial Farm')}
                    ${metricBlock('Zones', `${commercialStructure.zones.length}`)}
                    ${metricBlock('Devices', `${commercialDeviceAssignments.length}/${commercialStructure.total_devices_needed}`)}
                    ${metricBlock('Goals', commercialGoals.map(labelCommercialGoal).join(', '))}
                </div>
            </section>
        </div>
    `;
}

function initCommercialPreviewCanvas() {
    const canvas = document.getElementById('commercialPreviewCanvas');
    if (!canvas) return;
    const previewFarm = buildCommercialPreviewFarm();
    AppState.currentFarm = previewFarm;
    AppState.currentFarmId = previewFarm.id;
    AppState.mode = 'commercial';
    CommercialFarmCanvas.init('commercialPreviewCanvas', previewFarm);
    CommercialFarmCanvas.setCameraFrame?.(false);
}

function buildCommercialPreviewFarm() {
    ensureCommercialStructure();
    const zones = commercialStructure.zones || [];
    const plants = [];
    zones.forEach((zone, zoneIndex) => {
        const zonePlants = commercialPlantItemsForZone(zone);
        zonePlants.forEach((item, plantIndex) => {
            plants.push({
                name: item.name,
                species: String(item.name).toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                slots: item.count,
                zoneId: zone.zone_id,
                zoneName: zone.name,
                slotIndex: zoneIndex + plantIndex * Math.max(1, zones.length),
                status: commercialZoneThresholds[zone.zone_id] ? 'healthy' : 'warning',
            });
        });
    });

    return {
        id: `commercial_preview_${Date.now()}`,
        name: fieldInfo.name || 'Commercial Farm Preview',
        accountMode: 'commercial',
        rackTypeId: '5-tier',
        rackType: 'Commercial Digital Twin',
        rackLabel: `${zones.length || 3}-Zone Commercial Facility`,
        targetPlant: zones.map(zone => zone.crop).filter(Boolean).join(', ') || 'Commercial crops',
        plantSlots: Math.max(20, plants.reduce((sum, plant) => sum + (plant.slots || 1), 0)),
        plants,
        zones,
        commercialStructure,
        commercialDevices: commercialDeviceAssignments,
        createdAt: new Date().toISOString(),
    };
}

function commercialStructureHtml() {
    if (!commercialStructure) {
        return `
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;line-height:1.45;">
                Add a farm photo, then run AI zone analysis. If AI is unavailable, SeedDown will use a safe commercial fallback.
            </div>
        `;
    }

    return `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
            ${metricBlock('Farm Master', commercialStructure.farm_master_count)}
            ${metricBlock('ESP32 Needed', commercialStructure.total_devices_needed)}
            ${metricBlock('Zones', commercialStructure.zones.length)}
            ${metricBlock('Confidence', `${Math.round((commercialStructure.confidence || 0.82) * 100)}%`)}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
            ${commercialStructure.zones.map(zone => `
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:13px;font-weight:900;">${escapeHTML(zone.name)} · ${escapeHTML(zone.crop || 'Mixed Crops')}</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:3px;">${escapeHTML(zone.notes || '')}</div>
                        <div style="font-size:10px;color:var(--sub);margin-top:5px;line-height:1.35;">${escapeHTML(commercialPlantItemsForZone(zone).map(item => `${item.name} x ${item.count}`).join(' · '))}</div>
                    </div>
                    <span style="padding:5px 8px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:10px;font-weight:900;white-space:nowrap;">${commercialZonePlantCount(zone)} plants</span>
                </div>
            `).join('')}
        </div>
    `;
}

function farmThresholdCardHtml() {
    const thresholds = commercialFarmThresholds?.thresholds || {};
    return `
        <div style="background:linear-gradient(135deg,var(--accent-l),#fff);border:1.5px solid rgba(22,163,74,.22);border-radius:14px;padding:12px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;color:var(--accent);">Farm Master Node</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Farm-level safety policy · shared emergency and monitoring thresholds</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${commercialFarmThresholds ? 'var(--accent)' : 'var(--muted)'};">${commercialFarmThresholds ? 'READY' : 'PENDING'}</span>
            </div>
            <div id="commercialSafety_farm_master" style="display:none;margin-bottom:10px;padding:8px 10px;border-radius:10px;background:rgba(245,158,11,.12);color:#b45309;font-size:11px;font-weight:800;line-height:1.35;"></div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">
                ${commercialThresholdInputsHtml({ zone_id: 'farm_master' }, thresholds, 'farm')}
            </div>
            <div style="padding:11px;border-radius:12px;background:rgba(255,255,255,.76);border:1px solid rgba(22,163,74,.14);">
                <div style="font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.08em;margin-bottom:6px;">AI ANALYSIS</div>
                <div style="font-size:11px;color:var(--muted);line-height:1.55;">
                    ${commercialThresholdAnalysis({ zone_id: 'farm_master', name: 'Farm Master Node', plants: allCommercialPlants(), crop: 'whole farm' }, commercialFarmThresholds, 'farm')}
                </div>
            </div>
        </div>
    `;
}

function zoneThresholdCardHtml(zone) {
    const threshold = commercialZoneThresholds[zone.zone_id];
    const plants = formatCommercialPlantItems(commercialPlantItemsForZone(zone));
    const thresholds = threshold?.thresholds || {};
    return `
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:12px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;">${escapeHTML(zone.name)}</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Zone-level recipe · editable sensor and output thresholds</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${threshold ? 'var(--accent)' : 'var(--muted)'};">${threshold ? 'READY' : 'PENDING'}</span>
            </div>
            <label style="display:block;margin-bottom:10px;">
                <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.06em;text-transform:uppercase;margin-bottom:5px;">Detected plants in this zone</span>
                <textarea class="zone-plant-input" data-zone="${zone.zone_id}" placeholder="tomato x 8&#10;lettuce x 12"
                    style="width:100%;min-height:82px;resize:vertical;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:var(--text);font-size:13px;outline:none;line-height:1.45;">${escapeHTML(plants)}</textarea>
                <span style="display:block;font-size:10px;color:var(--muted);margin-top:4px;">Use one line per plant. Example: cucumber x 6. The 3D twin uses these counts directly.</span>
            </label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                ${miniThreshold('Detected count', `${commercialZonePlantCount(zone)} plants`)}
                ${miniThreshold('3D source', 'zone scan')}
            </div>
            <div id="commercialSafety_${zone.zone_id}" style="display:none;margin-bottom:10px;padding:8px 10px;border-radius:10px;background:rgba(245,158,11,.12);color:#b45309;font-size:11px;font-weight:800;line-height:1.35;"></div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px;">
                ${commercialThresholdInputsHtml(zone, thresholds, 'zone')}
            </div>
            <div style="padding:11px;border-radius:12px;background:var(--surface);border:1px solid var(--border);">
                <div style="font-size:10px;font-weight:900;color:var(--sub);letter-spacing:.08em;margin-bottom:6px;">AI ANALYSIS</div>
                <div style="font-size:11px;color:var(--muted);line-height:1.5;">
                    ${commercialThresholdAnalysis(zone, threshold, 'zone')}
                </div>
            </div>
        </div>
    `;
}

function commercialThresholdInputsHtml(zone, thresholds = {}, scope = 'zone') {
    const items = scope === 'farm' ? commercialFarmThresholdItems() : commercialZoneThresholdItems();
    return items.map(({ key, label, unit, placeholder }) => `
        <label style="display:block;">
            <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);margin-bottom:4px;text-transform:uppercase;">${escapeHTML(label)}</span>
            <input class="commercial-threshold-input" data-zone="${zone.zone_id}" data-key="${key}" type="number"
                value="${thresholds[key] ?? ''}" placeholder="${thresholds[key] === undefined ? (placeholder || 'generate') : ''}"
                style="width:100%;padding:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface);font-size:13px;font-weight:800;color:var(--text);outline:none;">
            ${unit ? `<span style="display:block;font-size:9px;color:var(--muted);margin-top:3px;">${escapeHTML(unit)}</span>` : ''}
        </label>
    `).join('');
}

function commercialFarmThresholdItems() {
    return [
        { key: 'co2MinPpm', label: 'CO2 min', unit: 'CO2 Sensor · ppm', placeholder: '800' },
        { key: 'co2MaxPpm', label: 'CO2 max', unit: 'CO2 Sensor · ppm', placeholder: '1500' },
        { key: 'waterLowCm', label: 'Reservoir low', unit: 'HC-SR04 · cm distance', placeholder: '20' },
        { key: 'waterCriticalCm', label: 'Reservoir critical', unit: 'HC-SR04 · cm distance', placeholder: '35' },
        { key: 'gasDangerThreshold', label: 'Gas danger', unit: 'MQ-2 raw limit', placeholder: '3000' },
        { key: 'energyDailyLimitKwh', label: 'Energy limit', unit: 'Power Meter · kWh/day', placeholder: '8' },
        { key: 'mainFanDurationSeconds', label: 'Main fan sec', unit: 'Main Ventilation Fan output', placeholder: '20' },
        { key: 'emergencyBuzzerSeconds', label: 'Emergency buzz sec', unit: 'Emergency Buzzer output', placeholder: '10' },
        { key: 'sensorIntervalSeconds', label: 'Farm poll sec', unit: 'Farm master telemetry interval', placeholder: '300' },
    ];
}

function commercialZoneThresholdItems() {
    return [
        { key: 'tempMin', label: 'Temp min', unit: 'DHT11 · °C', placeholder: '18' },
        { key: 'tempMax', label: 'Temp max', unit: 'DHT11 · °C', placeholder: '28' },
        { key: 'humidityMin', label: 'Humid min', unit: 'DHT11 · %RH', placeholder: '50' },
        { key: 'humidityMax', label: 'Humid max', unit: 'DHT11 · %RH', placeholder: '80' },
        { key: 'soilDryThreshold', label: 'Soil dry', unit: 'Soil Moisture raw', placeholder: '2500' },
        { key: 'darkThreshold', label: 'Light dark', unit: 'LDR raw', placeholder: '1500' },
        { key: 'phMin', label: 'pH min', unit: 'pH Sensor', placeholder: '5.8' },
        { key: 'phMax', label: 'pH max', unit: 'pH Sensor', placeholder: '6.8' },
        { key: 'ecMin', label: 'EC min', unit: 'EC Sensor · mS/cm', placeholder: '1.2' },
        { key: 'ecMax', label: 'EC max', unit: 'EC Sensor · mS/cm', placeholder: '2.0' },
        { key: 'waterFlowMinLpm', label: 'Flow min', unit: 'YF-S201 · L/min', placeholder: '0.5' },
        { key: 'wateringDurationSeconds', label: 'Pump sec', unit: 'Water Pump output', placeholder: '10' },
        { key: 'growLightDurationSeconds', label: 'Grow light sec', unit: 'LED Grow Light output', placeholder: '30' },
        { key: 'zoneFanDurationSeconds', label: 'Zone fan sec', unit: 'Zone Fan output', placeholder: '15' },
        { key: 'activeBuzzerSeconds', label: 'Alert buzz sec', unit: 'Active Buzzer output', placeholder: '5' },
        { key: 'cameraScanIntervalMinutes', label: 'Camera scan min', unit: 'Camera analysis interval', placeholder: '60' },
        { key: 'diseaseConfidenceMin', label: 'Disease confidence', unit: 'Camera AI threshold · %', placeholder: '70' },
    ];
}

function commercialThresholdAnalysis(zone, threshold, scope = 'zone') {
    const goals = commercialGoals.map(labelCommercialGoal).join(', ') || 'Commercial optimisation';
    const plants = commercialPlantItemsForZone(zone).map(item => `${item.name} x ${item.count}`).join(', ') || zone.crop || 'mixed crops';
    const zoneLabel = scope === 'farm' ? 'the whole farm' : zone.name;
    if (!threshold) {
        return `Generate thresholds to explain recommended sensor ranges, safety limits, and actuator timing for ${escapeHTML(zoneLabel)}. SeedDown will use the selected commercial goals, detected crops, and available device package to decide which thresholds should be active. Plants: ${escapeHTML(plants)}. Goals: ${escapeHTML(goals)}.`;
    }
    const source = threshold.source === 'ai' ? 'AI provider' : threshold.source === 'fallback' ? 'deterministic fallback' : 'manual edit';
    const modeReason = commercialGoals.includes('profit_optimisation')
        ? 'Because profit optimisation is selected, the recipe avoids over-watering and long fan or light cycles unless readings show real risk.'
        : commercialGoals.includes('maximum_yield')
            ? 'Because maximum yield is selected, the recipe keeps the crop closer to its ideal growth band instead of only reacting at emergency levels.'
            : commercialGoals.includes('compliance_audit')
                ? 'Because compliance and audit is selected, the recipe keeps conservative sensor intervals and clearer safety boundaries for traceable operation.'
                : 'Because commercial operation is selected, the recipe balances crop health, automation cost, and operational safety.';
    const scopeReason = scope === 'farm'
        ? 'Farm-level thresholds only cover shared infrastructure: CO2, reservoir depth from HC-SR04, MQ-2 gas, power meter consumption, main ventilation fan, and the emergency buzzer. These values protect the whole site even when each zone has a different crop recipe.'
        : `Zone-level thresholds only cover independent growing zones: DHT11 temperature and humidity, soil moisture, LDR light, pH, EC, YF-S201 water flow, pump duration, grow light timing, zone fan timing, active buzzer warning, and camera scan confidence for ${escapeHTML(plants)}.`;
    const note = threshold.notes || (scope === 'farm' ? 'Farm-level thresholds generated for master safety control.' : 'Thresholds generated for this zone.');
    return `${escapeHTML(note)} Source: ${escapeHTML(source)}. ${scopeReason} ${modeReason} Plants considered: ${escapeHTML(plants)}. Goals considered: ${escapeHTML(goals)}. Safety guardrails are not relaxed for gas, abnormal temperature, pH, water level, or actuator duration, so manual edits outside a safe range will trigger warnings.`;
}

function allCommercialPlants() {
    ensureCommercialStructure();
    const plants = commercialStructure.zones.flatMap(zone => commercialPlantItemsForZone(zone).map(item => item.name));
    return [...new Set(plants.map(plant => String(plant).trim()).filter(Boolean))];
}

function commercialSafetyWarning(key, value) {
    const rules = {
        tempMin: value < 5 || value > 30 ? 'Temperature minimum is outside a safe commercial crop range.' : '',
        tempMax: value < 15 || value > 40 ? 'Temperature maximum is outside a safe commercial crop range.' : '',
        humidityMin: value < 25 || value > 90 ? 'Humidity minimum looks unsafe or unrealistic.' : '',
        humidityMax: value < 40 || value > 98 ? 'Humidity maximum may create disease risk or sensor error.' : '',
        phMin: value < 4.5 || value > 7.5 ? 'pH minimum is outside common hydroponic safety range.' : '',
        phMax: value < 5.0 || value > 8.5 ? 'pH maximum is outside common hydroponic safety range.' : '',
        gasDangerThreshold: value > 4000 ? 'Gas danger threshold is too high and may delay emergency alerts.' : '',
        waterLowCm: value < 1 || value > 35 ? 'Water-low distance may be unsafe for reservoir monitoring.' : '',
        waterCriticalCm: value < 5 || value > 60 ? 'Reservoir critical distance is outside practical HC-SR04 monitoring range.' : '',
        co2MaxPpm: value < 800 || value > 2500 ? 'CO2 maximum is outside safe commercial ventilation planning range.' : '',
        energyDailyLimitKwh: value < 0.5 || value > 80 ? 'Energy daily limit looks unrealistic for a commercial farm size.' : '',
        mainFanDurationSeconds: value > 600 ? 'Main ventilation fan duration is very long; check energy impact.' : '',
        emergencyBuzzerSeconds: value > 120 ? 'Emergency buzzer duration is too long for practical alerts.' : '',
        wateringDurationSeconds: value > 120 ? 'Watering duration is very long and may flood the zone.' : '',
        fanDurationSeconds: value > 300 ? 'Fan duration is very long; check energy and crop stress impact.' : '',
        growLightDurationSeconds: value > 14400 ? 'Grow light duration is very long and may waste energy.' : '',
        zoneFanDurationSeconds: value > 600 ? 'Zone fan duration is very long; check energy and crop stress impact.' : '',
        activeBuzzerSeconds: value > 120 ? 'Active buzzer duration is too long for a zone warning.' : '',
        waterFlowMinLpm: value < 0 || value > 10 ? 'Water flow threshold is outside practical YF-S201 range.' : '',
        cameraScanIntervalMinutes: value < 1 || value > 1440 ? 'Camera scan interval should stay between 1 minute and 24 hours.' : '',
        diseaseConfidenceMin: value < 40 || value > 95 ? 'Disease confidence threshold should stay practical to avoid false alarms or missed cases.' : '',
        sensorIntervalSeconds: value < 5 || value > 86400 ? 'Sensor interval is outside practical monitoring range.' : '',
        ecMin: value < 0.2 || value > 4 ? 'EC minimum is outside practical nutrient monitoring range.' : '',
        ecMax: value < 0.5 || value > 6 ? 'EC maximum is outside practical nutrient monitoring range.' : '',
        co2MinPpm: value < 250 || value > 2000 ? 'CO2 minimum is outside normal commercial monitoring range.' : '',
    };
    return rules[key] || '';
}

function miniThreshold(label, value) {
    return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:8px;">
        <div style="font-size:9px;font-weight:900;color:var(--sub);text-transform:uppercase;">${escapeHTML(label)}</div>
        <div style="font-size:12px;font-weight:900;color:var(--text);margin-top:3px;">${escapeHTML(value)}</div>
    </div>`;
}

function commercialPendingDeviceHtml() {
    if (!commercialPendingDevice) {
        return '<div style="font-size:12px;color:var(--muted);line-height:1.45;">No commercial QR scanned yet.</div>';
    }

    const targetOptions = commercialAssignmentTargets(commercialPendingDevice);
    return `
        <div style="border:1px solid var(--border);border-radius:14px;background:var(--surface2);padding:12px;">
            <div style="font-size:12px;font-weight:900;color:var(--text);">${escapeHTML(commercialPendingDevice.label || commercialPendingDevice.serial)}</div>
            <div style="font-size:10px;color:var(--muted);margin-top:3px;">${escapeHTML(commercialPendingDevice.serial)} · choose assignment target</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
                ${targetOptions.map(target => `
                    <button class="commercial-assign-target" data-target="${target.id}" ${target.disabled ? 'disabled' : ''}
                        style="padding:10px;border-radius:10px;border:1px solid ${target.disabled ? 'var(--border)' : 'var(--accent)'};background:${target.disabled ? 'var(--surface)' : 'var(--accent-l)'};color:${target.disabled ? 'var(--muted)' : 'var(--accent)'};font-weight:900;cursor:${target.disabled ? 'not-allowed' : 'pointer'};opacity:${target.disabled ? '.55' : '1'};">
                        ${escapeHTML(target.label)}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function commercialAssignmentProgressHtml() {
    ensureCommercialStructure();
    const targets = [
        { id: 'farm_master', label: 'Farm Master Node', required: 'farm_master' },
        ...commercialStructure.zones.map(zone => ({ id: zone.zone_id, label: zone.name, required: 'zone_node' })),
    ];

    return targets.map(target => {
        const assigned = commercialDeviceAssignments.find(item => item.targetId === target.id);
        return `
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                <div>
                    <div style="font-size:13px;font-weight:900;">${escapeHTML(target.label)}</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:3px;">Needs ${target.required === 'farm_master' ? 'Farm Master Node' : 'Zone Node'}</div>
                </div>
                <span style="font-size:10px;font-weight:900;color:${assigned ? 'var(--accent)' : 'var(--muted)'};">${assigned ? escapeHTML(assigned.serial) : 'UNASSIGNED'}</span>
            </div>
        `;
    }).join('');
}

function commercialOverviewTilesHtml() {
    const tiles = [
        { label: 'Farm Master', id: 'farm_master', crop: 'Online Control Node' },
        ...commercialStructure.zones.map(zone => ({ label: zone.name, id: zone.zone_id, crop: zone.crop })),
    ];

    return tiles.map(tile => {
        const assigned = commercialDeviceAssignments.find(item => item.targetId === tile.id);
        return `
            <div style="background:#fff;border:1px solid #dbe7dc;border-radius:16px;padding:14px;box-shadow:0 10px 24px rgba(15,23,42,.08);">
                <div style="font-size:10px;font-weight:900;color:#047857;text-transform:uppercase;letter-spacing:.08em;">${escapeHTML(tile.label)}</div>
                <div style="font-size:14px;font-weight:950;color:#17231b;margin-top:6px;">${escapeHTML(tile.crop)}</div>
                <div style="font-size:11px;color:#64748b;margin-top:5px;">${assigned ? `Device ${assigned.deviceId}` : 'Device pending'}</div>
            </div>
        `;
    }).join('');
}

async function analyzeCommercialZones() {
    if (!photoData) {
        showToast('warning', 'Add a commercial farm photo first');
        return null;
    }

    const button = document.getElementById('analyzeCommercialZonesBtn');
    if (button) {
        button.disabled = true;
        button.textContent = 'Analyzing...';
    }

    try {
        await scanPlantsFromPhoto();
    } catch {
        // scanPlantsFromPhoto already falls back visually.
    }

    commercialStructure = buildCommercialStructureFromPhoto();
    showToast('success', `${commercialStructure.zones.length} commercial zones recommended`);
    drawStep();
    return commercialStructure;
}

function buildCommercialStructureFromPhoto() {
    const size = fieldInfo.rackType || 'medium';
    const zoneCount = size === 'large' ? 4 : size === 'small' ? 2 : 3;
    const detectedItems = detectedPlants.length
        ? detectedPlants.map(plant => ({
            name: plant.name || plant.species || 'lettuce',
            count: Math.max(1, Number.parseInt(plant.slots, 10) || 3),
        }))
        : [
            { name: 'tomato', count: 8 },
            { name: 'lettuce', count: 12 },
            { name: 'spinach', count: 10 },
            { name: 'strawberry', count: 6 },
        ];

    const zones = Array.from({ length: zoneCount }, (_, index) => {
        const base = DEFAULT_COMMERCIAL_ZONES[index] || {
            zone_id: `zone_${String.fromCharCode(65 + index)}`,
            name: `Zone ${String.fromCharCode(65 + index)}`,
            recommended_type: 'zone_node',
            crop: detectedItems[index % detectedItems.length].name,
            plants: [detectedItems[index % detectedItems.length].name],
            confidence: 0.78,
            notes: 'AI fallback zone recommendation',
        };
        const assigned = detectedItems.filter((_, itemIndex) => itemIndex % zoneCount === index);
        const fallbackItem = detectedItems[index % detectedItems.length];
        const plantItems = assigned.length
            ? assigned
            : [{ ...fallbackItem, count: Math.max(1, Math.ceil(fallbackItem.count / zoneCount)) }];
        const crop = plantItems.map(item => `${item.name} x ${item.count}`).join(', ');
        return {
            ...base,
            zone_id: `zone_${String.fromCharCode(65 + index)}`,
            name: `Zone ${String.fromCharCode(65 + index)}`,
            crop,
            plantItems: plantItems.map(item => ({ name: item.name, count: item.count })),
            plants: plantItems.map(item => String(item.name).toLowerCase()),
            plantCount: plantItems.reduce((sum, item) => sum + item.count, 0),
        };
    });

    return {
        farm_master_count: 1,
        zones,
        total_devices_needed: zones.length + 1,
        confidence: 0.84,
        rack_count: zoneCount * 2,
        scale: size,
    };
}

function ensureCommercialStructure() {
    if (!commercialStructure) commercialStructure = buildCommercialStructureFromPhoto();
}

async function generateCommercialZoneThresholds() {
    ensureCommercialStructure();
    const button = document.getElementById('generateCommercialThresholdsBtn') || document.getElementById('bfNext');
    if (button) {
        button.disabled = true;
        button.textContent = 'Generating...';
    }

    try {
        const farmPlants = allCommercialPlants().map((plant, index) => ({ tier: index + 1, plant_type: plant }));
        const farmResponse = await fetch(`${API_BASE}/api/ai/generate-thresholds`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                plants: farmPlants,
                goal_priority: commercialGoals,
                packageLevel: 'farm_master',
            }),
        });
        const farmData = await safeJson(farmResponse);
        if (!farmResponse.ok || !farmData.ok) throw new Error(farmData.error || 'Farm-level threshold generation failed');
        commercialFarmThresholds = {
            thresholds: normalizeCommercialFarmThresholds(farmData.thresholds || {}),
            notes: farmData.notes,
            source: farmData.source,
        };

        for (const zone of commercialStructure.zones) {
            const plants = (zone.plants?.length ? zone.plants : ['lettuce'])
                .map((plant, index) => ({ tier: index + 1, plant_type: plant }));
            const response = await fetch(`${API_BASE}/api/ai/generate-thresholds`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    plants,
                    goal_priority: commercialGoals,
                    packageLevel: zone.recommended_type,
                }),
            });
            const data = await safeJson(response);
            if (!response.ok || !data.ok) throw new Error(data.error || `Threshold generation failed for ${zone.name}`);
            commercialZoneThresholds[zone.zone_id] = {
                thresholds: normalizeCommercialZoneThresholds(data.thresholds || {}, zone),
                notes: data.notes,
                source: data.source,
            };
        }
        showToast('success', 'Farm and zone thresholds generated');
        drawStep();
        return commercialZoneThresholds;
    } catch (error) {
        showToast('error', error.message);
        return null;
    } finally {
        if (button) button.disabled = false;
    }
}

function handleCommercialDeviceQrFile(file) {
    const reader = new FileReader();
    reader.onload = async event => {
        try {
            const payload = await decodeDeviceQr(event.target.result);
            const option = normalizeDeviceQrPayload(payload);
            if (option.deviceType !== 'commercial') {
                throw new Error('This QR is for Beginner. Commercial setup requires COM device QR.');
            }
            commercialPendingDevice = option;
            showToast('info', `Scanned ${option.label || option.serial}`);
            drawStep();
        } catch (error) {
            showToast('error', error.message || 'Could not read QR code');
        }
    };
    reader.readAsDataURL(file);
}

function commercialAssignmentTargets(device) {
    ensureCommercialStructure();
    const assignedTargets = new Set(commercialDeviceAssignments.map(item => item.targetId));
    const targets = [
        { id: 'farm_master', label: 'Farm Master Node', required: 'farm_master' },
        ...commercialStructure.zones.map(zone => ({
            id: zone.zone_id,
            label: zone.name,
            required: 'zone_node',
        })),
    ];

    return targets.map(target => {
        const compatible = commercialDeviceCompatible(device, target.required);
        const alreadyAssigned = assignedTargets.has(target.id);
        return {
            ...target,
            disabled: !compatible || alreadyAssigned,
        };
    });
}

function commercialDeviceCompatible(device, required) {
    const level = device.packageLevel || device.id || '';
    const serial = String(device.serial || '');
    if (required === 'farm_master') {
        return level === 'farm_master' || level === 'farm_zone' || serial.includes('FRM') || serial.includes('FZK') || serial.includes('MST');
    }
    if (required === 'zone_node') {
        return ['zone_node', 'farm_zone', 'zone_basic', 'zone_pro'].includes(level)
            || serial.includes('ZON')
            || serial.includes('FZK')
            || serial.includes('ZNB')
            || serial.includes('ZNP');
    }
    return false;
}

async function assignPendingCommercialDevice(targetId) {
    if (!commercialPendingDevice) return;
    ensureCommercialStructure();

    const target = targetId === 'farm_master'
        ? { id: 'farm_master', required: 'farm_master', zoneId: null }
        : commercialStructure.zones.find(zone => zone.zone_id === targetId);
    if (!target) return;

    const required = target.required || target.recommended_type || 'zone_node';
    if (!commercialDeviceCompatible(commercialPendingDevice, required)) {
        showToast('error', 'Device type does not match this target');
        return;
    }

    const farmId = commercialDraftFarmId || `farm_com_${Date.now()}`;
    const accountType = commercialPendingDevice.accountType || (
        commercialPendingDevice.packageLevel === 'farm_master' ? 'commercial_farm_master'
            : commercialPendingDevice.packageLevel === 'farm_zone' ? 'commercial_farm_zone'
                : commercialPendingDevice.packageLevel === 'zone_node' ? 'commercial_zone'
                    : commercialPendingDevice.packageLevel === 'zone_pro' ? 'commercial_zone_pro'
                        : 'commercial_zone_basic'
    );

    try {
        const response = await fetch(`${API_BASE}/api/devices/register`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                serial: commercialPendingDevice.serial,
                wifi_ssid: deviceSetup.wifiSsid.trim(),
                wifi_password: deviceSetup.wifiPassword,
                accountType,
                farmId,
                zoneId: targetId === 'farm_master' ? null : targetId,
            }),
        });
        const data = await safeJson(response);
        if (!response.ok || !data.ok) throw new Error(data.error || 'Device assignment failed');
        assignCommercialDeviceRecord(data.device, targetId);
        showToast('success', 'Device assigned');
    } catch (error) {
        const fallback = buildLocalCommercialDevice(commercialPendingDevice, targetId, farmId);
        assignCommercialDeviceRecord(fallback, targetId);
        showToast('warning', `Backend register failed, using demo device: ${error.message}`);
    }
    commercialPendingDevice = null;
    drawStep();
}

function normalizeCommercialFarmThresholds(thresholds = {}) {
    return {
        co2MinPpm: Number(thresholds.co2MinPpm ?? 800),
        co2MaxPpm: Number(thresholds.co2MaxPpm ?? 1500),
        waterLowCm: Number(thresholds.waterLowCm ?? 20),
        waterCriticalCm: Number(thresholds.waterCriticalCm ?? 35),
        gasDangerThreshold: Number(thresholds.gasDangerThreshold ?? 3000),
        energyDailyLimitKwh: Number(thresholds.energyDailyLimitKwh ?? commercialEnergyLimitBySize()),
        mainFanDurationSeconds: Number(thresholds.mainFanDurationSeconds ?? thresholds.fanDurationSeconds ?? 20),
        emergencyBuzzerSeconds: Number(thresholds.emergencyBuzzerSeconds ?? 10),
        sensorIntervalSeconds: Number(thresholds.sensorIntervalSeconds ?? 300),
    };
}

function normalizeCommercialZoneThresholds(thresholds = {}, zone = {}) {
    return {
        tempMin: Number(thresholds.tempMin ?? 18),
        tempMax: Number(thresholds.tempMax ?? 28),
        humidityMin: Number(thresholds.humidityMin ?? 50),
        humidityMax: Number(thresholds.humidityMax ?? 80),
        soilDryThreshold: Number(thresholds.soilDryThreshold ?? 2500),
        darkThreshold: Number(thresholds.darkThreshold ?? 1500),
        phMin: Number(thresholds.phMin ?? 5.8),
        phMax: Number(thresholds.phMax ?? 6.8),
        ecMin: Number(thresholds.ecMin ?? 1.2),
        ecMax: Number(thresholds.ecMax ?? 2.0),
        waterFlowMinLpm: Number(thresholds.waterFlowMinLpm ?? 0.5),
        wateringDurationSeconds: Number(thresholds.wateringDurationSeconds ?? 10),
        growLightDurationSeconds: Number(thresholds.growLightDurationSeconds ?? (String(zone.crop || '').toLowerCase().includes('lettuce') ? 45 : 30)),
        zoneFanDurationSeconds: Number(thresholds.zoneFanDurationSeconds ?? thresholds.fanDurationSeconds ?? 15),
        activeBuzzerSeconds: Number(thresholds.activeBuzzerSeconds ?? 5),
        cameraScanIntervalMinutes: Number(thresholds.cameraScanIntervalMinutes ?? 60),
        diseaseConfidenceMin: Number(thresholds.diseaseConfidenceMin ?? 70),
    };
}

function commercialPlantItemsForZone(zone = {}) {
    if (Array.isArray(zone.plantItems) && zone.plantItems.length) {
        return zone.plantItems.map(item => ({
            name: String(item.name || item.plant || item.species || 'Plant').trim() || 'Plant',
            count: Math.max(1, Math.min(999, Number.parseInt(item.count ?? item.slots ?? item.quantity ?? 1, 10) || 1)),
        }));
    }
    const names = Array.isArray(zone.plants) && zone.plants.length
        ? zone.plants
        : parseTargetPlants(zone.crop || 'lettuce');
    const fallbackCount = Math.max(1, Math.round(Number(zone.plantCount || zone.slots || 12) / Math.max(1, names.length)));
    return names.map(name => ({ name: String(name).trim() || 'Plant', count: fallbackCount }));
}

function commercialZonePlantCount(zone = {}) {
    return commercialPlantItemsForZone(zone).reduce((sum, item) => sum + item.count, 0);
}

function formatCommercialPlantItems(items = []) {
    return items.map(item => `${item.name} x ${item.count}`).join('\n');
}

function parseCommercialPlantItems(value) {
    const entries = String(value || '')
        .split(/[\n;]+/)
        .flatMap(line => line.split(/,(?=[^0-9]*[a-zA-Z])/))
        .map(line => line.trim())
        .filter(Boolean);
    return entries.map(entry => {
        const match = entry.match(/^(.+?)(?:\s*(?:x|\*)\s*|[:=]\s*|\s+)(\d+)$/i);
        const name = (match ? match[1] : entry).trim();
        const count = match ? Number.parseInt(match[2], 10) : 1;
        return {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            count: Math.max(1, Math.min(999, Number.isFinite(count) ? count : 1)),
        };
    });
}

function syncCommercialZonePlantItems(zone, items) {
    const safeItems = items.length ? items : [{ name: 'Lettuce', count: 1 }];
    zone.plantItems = safeItems;
    zone.plants = safeItems.map(item => item.name.toLowerCase());
    zone.plantCount = safeItems.reduce((sum, item) => sum + item.count, 0);
    zone.crop = safeItems.map(item => `${item.name} x ${item.count}`).join(', ');
}

function commercialEnergyLimitBySize() {
    const size = fieldInfo.rackType || 'medium';
    if (size === 'small') return 4;
    if (size === 'large') return 20;
    return 10;
}

function assignCommercialDeviceRecord(device, targetId) {
    const normalizedDevice = normalizeCommercialDemoDevice(device);
    commercialDeviceAssignments = [
        ...commercialDeviceAssignments.filter(item => item.targetId !== targetId && item.deviceId !== normalizedDevice.deviceId),
        {
            ...normalizedDevice,
            targetId,
            zoneId: targetId === 'farm_master' ? null : targetId,
            role: targetId === 'farm_master' ? 'farm_master' : 'zone_node',
        },
    ];
}

function normalizeCommercialDemoDevice(device = {}) {
    const serial = String(device.serial || '').toUpperCase();
    const demo = DEMO_DEVICE_BY_SERIAL[serial];
    if (!demo) return device;
    return {
        ...device,
        deviceId: demo.deviceId,
        deviceToken: demo.deviceToken,
        status: device.status || 'demo-assigned',
    };
}

function buildLocalCommercialDevice(option = {}, targetId, farmId) {
    const serial = String(option.serial || `SD-COM-DEMO-${Date.now()}`).toUpperCase();
    const suffix = serial.split('-').pop() || String(Date.now()).slice(-5);
    const packageLevel = option.packageLevel || (targetId === 'farm_master' ? 'farm_master' : 'zone_node');
    return {
        deviceId: `dev_commercial_${packageLevel}_${suffix}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        deviceToken: `demo_token_${suffix}`,
        serial,
        deviceType: 'commercial',
        packageLevel,
        farmId,
        zoneId: targetId === 'farm_master' ? null : targetId,
        nodeType: packageLevel,
        status: 'demo-assigned',
        isDemoFallback: true,
    };
}

function commercialThresholdsReady() {
    ensureCommercialStructure();
    return Boolean(commercialFarmThresholds) && commercialStructure.zones.every(zone => Boolean(commercialZoneThresholds[zone.zone_id]));
}

function commercialDevicesReady() {
    ensureCommercialStructure();
    const requiredTargets = ['farm_master', ...commercialStructure.zones.map(zone => zone.zone_id)];
    return requiredTargets.every(targetId => commercialDeviceAssignments.some(item => item.targetId === targetId));
}

function labelCommercialGoal(id) {
    return COMMERCIAL_GOAL_OPTIONS.find(goal => goal.id === id)?.label || String(id).replace(/_/g, ' ');
}

function renderDeviceStep(content) {
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">SCAN DEVICE QR</div>
                <div style="border:1.5px dashed var(--border);border-radius:18px;background:var(--surface2);padding:22px;text-align:center;">
                    <div style="width:92px;height:92px;border-radius:22px;margin:0 auto 14px;background:#fff;border:1px solid var(--border);display:grid;place-items:center;box-shadow:var(--shadow-sm);">
                        <span style="font-size:42px;line-height:1;">▦</span>
                    </div>
                    <div style="font-size:15px;font-weight:900;color:var(--text);">Scan SeedDown Device QR</div>
                    <div style="font-size:12px;color:var(--muted);line-height:1.45;margin:7px auto 16px;max-width:280px;">
                        Use the QR png from the device package. The QR contains the serial, package tier, and account type.
                    </div>
                    <button id="scanQrBtn" type="button" style="width:100%;max-width:260px;padding:13px;border:none;border-radius:14px;background:var(--accent);color:white;font-size:14px;font-weight:900;cursor:pointer;">
                        Scan QR
                    </button>
                    <input id="deviceQrInput" type="file" accept="image/*" capture="environment" style="display:none;">
                </div>
                <div id="deviceStatus" style="margin-top:12px;font-size:12px;color:${registeredDevice ? 'var(--accent)' : 'var(--muted)'};line-height:1.45;">
                    ${registeredDevice ? `Linked ${escapeHTML(registeredDevice.deviceId)} · ${escapeHTML(registeredDevice.packageLevel)} · ${escapeHTML(registeredDevice.serial || deviceSetup.serial)}` : 'No QR scanned yet.'}
                </div>
                ${registeredDevice ? packageCapabilitySummaryHtml() : ''}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">WIFI SETUP</div>
                ${fieldInput('wifiSsidInput', 'WiFi SSID', 'Your WiFi name', deviceSetup.wifiSsid)}
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">WiFi password</span>
                    <input id="wifiPasswordInput" type="password" value="${escapeHTML(deviceSetup.wifiPassword)}" placeholder="stored only for setup simulation"
                        style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
                </label>
            </section>
        </div>
    `;

    bindTextInput('wifiSsidInput', value => { deviceSetup.wifiSsid = value; registeredDevice = null; });
    bindTextInput('wifiPasswordInput', value => { deviceSetup.wifiPassword = value; registeredDevice = null; });

    const input = document.getElementById('deviceQrInput');
    document.getElementById('scanQrBtn')?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (file) handleDeviceQrFile(file);
        event.target.value = '';
    });
}
function packageQrCardsHtml() {
    return PACKAGE_QR_OPTIONS.map(option => {
        const selected = deviceSetup.serial === option.serial || registeredDevice?.serial === option.serial;
        return `
            <button class="qr-package-card" data-package-id="${option.id}" type="button"
                style="border:1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'};background:${selected ? 'var(--accent-l)' : 'var(--surface2)'};border-radius:14px;padding:10px;text-align:left;cursor:pointer;color:var(--text);display:grid;grid-template-columns:74px 1fr;gap:10px;align-items:center;min-height:96px;">
                <span aria-hidden="true" style="width:72px;height:72px;border-radius:10px;background:#fff;border:1px solid var(--border);padding:6px;display:grid;grid-template-columns:repeat(7,1fr);gap:2px;box-sizing:border-box;">
                    ${fakeQrGrid(option.serial)}
                </span>
                <span style="min-width:0;display:block;">
                    <strong style="display:block;font-size:12px;line-height:1.2;color:${selected ? 'var(--accent)' : 'var(--text)'};">${escapeHTML(option.label)}</strong>
                    <span style="display:block;font-size:10px;color:var(--muted);margin-top:4px;line-height:1.25;">${escapeHTML(option.desc)}</span>
                    <span style="display:block;font-size:9px;color:var(--sub);font-weight:800;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(option.serial)}</span>
                </span>
            </button>
        `;
    }).join('');
}

function packageCapabilitySummaryHtml() {
    const level = beginnerPackageLevel();
    const capability = packageCapability(level);
    const locks = thresholdItems()
        .filter(item => !capability.thresholdKeys.includes(item.key))
        .map(item => item.label)
        .slice(0, 4);

    return `
        <div style="margin-top:12px;padding:11px;border-radius:12px;background:var(--accent-l);border:1px solid rgba(22,163,74,.16);">
            <div style="font-size:11px;font-weight:900;color:var(--accent);margin-bottom:4px;">${escapeHTML(capability.label)} package detected</div>
            <div style="font-size:11px;color:var(--muted);line-height:1.45;">
                Threshold generation will only enable sensors included in this QR package.
                ${locks.length ? ` Locked: ${locks.join(', ')}${locks.length >= 4 ? '...' : ''}` : ' All threshold controls are unlocked.'}
            </div>
        </div>
    `;
}

function fakeQrGrid(serial) {
    const seed = String(serial).split('').reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 3), 0);
    return Array.from({ length: 49 }, (_, index) => {
        const row = Math.floor(index / 7);
        const col = index % 7;
        const isFinder = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
        const filled = isFinder || ((seed + index * 17 + row * 11 + col * 7) % 5 < 2);
        return `<i style="display:block;border-radius:1px;background:${filled ? '#111827' : '#ffffff'};"></i>`;
    }).join('');
}

async function scanPackageQr(packageId) {
    const option = PACKAGE_QR_OPTIONS.find(item => item.id === packageId) || PACKAGE_QR_OPTIONS[1];
    await applyScannedDevicePayload(option);
}

function handleDeviceQrFile(file) {
    const reader = new FileReader();
    reader.onload = async event => {
        try {
            const payload = await decodeDeviceQr(event.target.result);
            await applyScannedDevicePayload(payload);
        } catch (error) {
            showToast('error', error.message || 'Could not read QR code');
        }
    };
    reader.readAsDataURL(file);
}

function decodeDeviceQr(dataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth || image.width;
            canvas.height = image.naturalHeight || image.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (!code?.data) {
                reject(new Error('QR not detected. Try the generated SeedDown QR png.'));
                return;
            }
            try {
                resolve(parseDeviceQrPayload(code.data));
            } catch (error) {
                reject(error);
            }
        };
        image.onerror = () => reject(new Error('Unable to load QR image'));
        image.src = dataUrl;
    });
}

function parseDeviceQrPayload(raw) {
    const text = String(raw || '').trim();
    let payload;
    try {
        payload = JSON.parse(text);
    } catch {
        payload = { serial: text };
    }

    if (payload.type && payload.type !== 'seeddown_device_qr') {
        throw new Error('This is not a SeedDown device QR');
    }

    if (!payload.serial) throw new Error('QR does not contain a device serial');
    return normalizeDeviceQrPayload(payload);
}

async function applyScannedDevicePayload(payload) {
    const option = normalizeDeviceQrPayload(payload);
    deviceSetup.serial = option.serial;
    deviceSetup.accountType = option.accountType;
    registeredDevice = null;
    showToast('info', `Scanned ${option.label || option.serial}`);
    await registerDeviceFromStep(option);
}

function normalizeDeviceQrPayload(payload = {}) {
    const serial = String(payload.serial || '').trim().toUpperCase();
    const known = PACKAGE_QR_OPTIONS.find(option => option.serial === serial);
    if (known) return { ...known, ...payload, serial };
    const inferred = inferDeviceOptionFromSerial(serial);
    return { ...inferred, ...payload, serial };
}

function inferDeviceOptionFromSerial(serial) {
    if (serial.startsWith('SD-BGN-STR')) return { label: 'Beginner Starter', accountType: 'beginner_starter', packageLevel: 'starter', deviceType: 'beginner', desc: 'basic home sensor kit' };
    if (serial.startsWith('SD-BGN-STD')) return { label: 'Beginner Standard', accountType: 'beginner_standard', packageLevel: 'standard', deviceType: 'beginner', desc: 'balanced home vertical farm kit' };
    if (serial.startsWith('SD-BGN-PRO')) return { label: 'Beginner Pro', accountType: 'beginner_pro', packageLevel: 'pro', deviceType: 'beginner', desc: 'advanced home kit with more automation' };
    if (serial.startsWith('SD-COM-FRM') || serial.startsWith('SD-COM-MST')) return { label: 'Commercial Farm Master Node', accountType: 'commercial_farm_master', packageLevel: 'farm_master', deviceType: 'commercial', desc: 'farm-level controller' };
    if (serial.startsWith('SD-COM-FZK')) return { label: 'Commercial Farm + Zone Combo', accountType: 'commercial_farm_zone', packageLevel: 'farm_zone', deviceType: 'commercial', desc: 'farm or zone compatible node' };
    if (serial.startsWith('SD-COM-ZON') || serial.startsWith('SD-COM-ZNB') || serial.startsWith('SD-COM-ZNP')) return { label: 'Commercial Zone Node', accountType: 'commercial_zone', packageLevel: 'zone_node', deviceType: 'commercial', desc: 'zone-level sensor and actuator node' };
    return { label: serial || 'Unknown QR', accountType: '', packageLevel: '', deviceType: '', desc: 'unknown device QR' };
}
function renderStep1(content) {
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">FIELD INFO</div>
                ${fieldInput('fieldNameInput', 'Field name', 'e.g. Balcony Trial A', fieldInfo.name)}
                ${fieldInput('fieldLocationInput', 'Location / zone', 'e.g. Balcony, Lab Corner, Zone A', fieldInfo.location)}
                <label style="display:block;margin-bottom:10px;">
                    <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">Description</span>
                    <textarea id="fieldDescriptionInput" placeholder="Optional notes about this field"
                        style="width:100%;min-height:92px;resize:vertical;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:14px;outline:none;line-height:1.4;">${escapeHTML(fieldInfo.description)}</textarea>
                </label>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;">
                    Plant analysis, crop goals, and device thresholds are handled in the next steps after photo scanning.
                </div>
            </section>
        </div>
    `;

    bindTextInput('fieldNameInput', value => { fieldInfo.name = value; });
    bindTextInput('fieldLocationInput', value => { fieldInfo.location = value; });
    bindTextInput('fieldDescriptionInput', value => { fieldInfo.description = value; });
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

function bindRackOptions() {
    document.querySelectorAll('.rack-opt').forEach(button => {
        button.addEventListener('click', () => {
            fieldInfo.rackType = button.dataset.id || fieldInfo.rackType;
            fieldInfo.customRack = null;
            generatedThresholds = null;
            drawStep();
        });
    });
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

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">STRUCTURE RECOGNITION</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:3px;">AI can detect rack/tower/wall/channel layout from the photo, then you can adjust it.</div>
                    </div>
                    <span id="structureStatus" style="font-size:10px;font-weight:900;color:var(--accent);">${currentRack().label}</span>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;max-height:260px;overflow:auto;">
                    ${RACK_OPTIONS.map(rackOption).join('')}
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
    bindRackOptions();

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
            if (isCommercialFlow()) drawStep();
            else renderStep2(content);
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
        const res = await fetch(`${API_BASE}/api/farms/scan-plants`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                image: photoData.base64,
                mediaType: photoData.mediaType,
                targetPlant: fieldInfo.targetPlant,
            }),
        });
        const data = await res.json();
        const plants = Array.isArray(data.plants) ? data.plants : [];
        const recognizedStructure = data.structure || data.rack || data.layout;
        let structureChanged = applyRecognizedStructure(recognizedStructure);
        if (plants.length) {
            mergePlants(plants);
            structureChanged = autoFitStructureFromPhoto(recognizedStructure) || structureChanged;
            showToast('success', `${plants.length} plant type${plants.length > 1 ? 's' : ''} detected${structureChanged ? ' + structure matched' : ''}`);
            if (status) status.textContent = `Review plants and ${structureChanged ? 'detected structure' : 'structure'} before generating 3D.`;
        } else {
            if (status) status.textContent = structureChanged ? 'Structure detected. Add plants manually if needed.' : (data.warning || 'No clear plant detected. Manual list is still usable.');
            showToast('info', structureChanged ? 'Structure detected from photo' : 'No plant detected from photo yet');
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
        if (!isCommercialFlow() && step === 3) drawStep();
    }
}

function renderStep3(content) {
    autoFitStructureFromPhoto();
    const rack = currentRack();
    const totalUsed = totalSlotsUsed();
    const targetPlant = detectedPlants[0]?.name || 'Field';

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

function renderThresholdStep(content) {
    const plants = detectedPlants.length ? detectedPlants : [];
    content.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">GOAL PRIORITY</div>
                <div style="font-size:12px;color:var(--muted);line-height:1.45;margin-bottom:12px;">Choose up to two goals. SeedDown will generate thresholds for this device and crop mix.</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${GOAL_OPTIONS.map(goal => {
                        const selected = goalPriority.includes(goal.id);
                        return `<button class="goal-priority" data-id="${goal.id}"
                            style="padding:11px 8px;border-radius:12px;border:1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'};background:${selected ? 'var(--accent-l)' : 'var(--surface2)'};color:${selected ? 'var(--accent)' : 'var(--text)'};font-weight:900;font-size:12px;cursor:pointer;">
                            ${goal.label}
                        </button>`;
                    }).join('')}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">AI THRESHOLDS</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.45;">Plants: ${plants.map(p => escapeHTML(p.name)).join(', ') || 'mixed greens'} · Package: ${escapeHTML(packageCapability(beginnerPackageLevel()).label)}</div>
                    </div>
                    <button id="generateThresholdsBtn" style="padding:8px 10px;border-radius:999px;border:1px solid var(--accent);background:var(--accent-l);color:var(--accent);font-size:11px;font-weight:900;cursor:pointer;">Generate</button>
                </div>
                <div id="thresholdStatus" style="font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.45;">
                    ${generatedThresholds ? escapeHTML(generatedThresholds.notes || 'Thresholds ready') : 'No thresholds generated yet.'}
                </div>
                <div id="thresholdGrid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                    ${thresholdInputsHtml(generatedThresholds?.thresholds || {})}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:10px;">AI ANALYSIS</div>
                ${thresholdAnalysisHtml(plants)}
            </section>
        </div>
    `;

    document.querySelectorAll('.goal-priority').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            if (goalPriority.includes(id)) goalPriority = goalPriority.filter(item => item !== id);
            else if (goalPriority.length < 2) goalPriority = [...goalPriority, id];
            else showToast('warning', 'Choose up to 2 goals');
            generatedThresholds = null;
            renderThresholdStep(content);
        });
    });

    document.getElementById('generateThresholdsBtn').addEventListener('click', generateThresholdsForField);
    bindThresholdInputs();
}

function applyRecognizedStructure(structure) {
    if (!structure) return false;
    const rawType = String(structure.rackType || structure.type || structure.id || structure.structureType || '').toLowerCase();
    const tiers = Number(structure.tiers || structure.tierCount || 0);
    const slots = Number(structure.slotsPerTier || structure.columns || 0);
    const text = `${rawType} ${structure.label || ''} ${structure.description || ''}`.toLowerCase();

    let rackId = null;
    if (text.includes('wall') || text.includes('panel') || text.includes('grid')) rackId = 'wall';
    else if (text.includes('a-frame') || text.includes('pyramid') || text.includes('slant')) rackId = 'a-frame';
    else if (text.includes('nft') || text.includes('channel') || text.includes('row')) rackId = 'nft-channel';
    else if (text.includes('hanging') || text.includes('column') || text.includes('tower')) rackId = text.includes('tower') && tiers >= 5 ? '5-tier' : 'hanging';
    else if (tiers >= 5) rackId = '5-tier';
    else if (tiers === 4 && slots >= 5) rackId = 'wall';
    else if (tiers === 4) rackId = '4-tier';
    else if (tiers === 2) rackId = '2-tier';
    else if (tiers === 3) rackId = '3-tier';
    else if (rawType && RACK_OPTIONS.some(rack => rack.id === rawType)) rackId = rawType;

    if (!rackId || fieldInfo.rackType === rackId) return false;
    fieldInfo.rackType = rackId;
    fieldInfo.customRack = null;
    generatedThresholds = null;
    return true;
}

function autoFitStructureFromPhoto(structure = null) {
    const usedSlots = totalSlotsUsed();
    if (!usedSlots) return false;

    const current = currentRack();
    const structureSlots = Number(structure?.total || structure?.totalSlots || structure?.plantSlots || 0);
    const visibleTotal = Math.max(usedSlots, structureSlots);
    const knownEnough = current.total >= visibleTotal && !fieldInfo.customRack;
    if (knownEnough) return false;

    const structureTiers = Number(structure?.tiers || structure?.tierCount || 0);
    const structureSlotsPerTier = Number(structure?.slotsPerTier || structure?.columns || 0);
    const tiers = structureTiers > 0
        ? Math.max(1, Math.min(8, Math.round(structureTiers)))
        : Math.max(3, Math.min(7, Math.ceil(Math.sqrt(visibleTotal))));
    const slotsPerTier = structureSlotsPerTier > 0
        ? Math.max(1, Math.min(12, Math.round(structureSlotsPerTier)))
        : Math.max(3, Math.ceil(visibleTotal / tiers));
    const total = Math.max(visibleTotal, tiers * slotsPerTier);
    const shape = visibleTotal > 24 ? 'wall' : tiers >= 5 ? 'tower' : 'rack';

    fieldInfo.customRack = {
        id: 'photo-detected',
        label: structure?.label || structure?.name || 'Photo-detected Multi Rack',
        icon: 'AI',
        tiers,
        slotsPerTier,
        total,
        shape,
        desc: 'Auto-sized from photo analysis and visible plant slot count',
    };
    fieldInfo.rackType = 'photo-detected';
    generatedThresholds = null;
    return true;
}

function thresholdInputsHtml(thresholds = {}) {
    const capability = packageCapability(beginnerPackageLevel());
    return thresholdItems().map(({ key, label }) => {
        const unlocked = capability.thresholdKeys.includes(key);
        const value = unlocked ? (thresholds[key] ?? '') : capability.lockedText;
        return `
        <label style="display:block;opacity:${unlocked ? '1' : '.58'};">
            <span style="display:block;font-size:10px;font-weight:900;color:var(--sub);margin-bottom:4px;text-transform:uppercase;">${label}</span>
            <input class="threshold-input" data-key="${key}" type="${unlocked ? 'number' : 'text'}" value="${escapeAttr(value)}" placeholder="${unlocked ? 'generate first' : capability.lockedText}"
                disabled readonly
                title="Beginner thresholds are AI-managed to prevent unsafe sensor or actuator settings."
                style="width:100%;padding:10px;border:1px solid ${unlocked ? 'var(--border)' : 'rgba(148,163,184,.35)'};border-radius:10px;background:${unlocked ? '#F8FAFC' : 'rgba(148,163,184,.1)'};font-size:13px;font-weight:800;color:${unlocked ? 'var(--text)' : 'var(--muted)'};outline:none;cursor:not-allowed;">
            <span style="display:block;font-size:9px;color:${unlocked ? 'var(--muted)' : 'var(--sub)'};margin-top:4px;line-height:1.3;">${unlocked ? 'AI managed · locked for beginner safety' : 'Sensor not included in this package'}</span>
        </label>
    `;
    }).join('');
}
function thresholdItems() {
    return [
        { key: 'tempMin', label: 'Temp min' },
        { key: 'tempMax', label: 'Temp max' },
        { key: 'humidityMin', label: 'Humid min' },
        { key: 'humidityMax', label: 'Humid max' },
        { key: 'soilDryThreshold', label: 'Soil dry' },
        { key: 'darkThreshold', label: 'Light dark' },
        { key: 'phMin', label: 'pH min' },
        { key: 'phMax', label: 'pH max' },
        { key: 'ecMin', label: 'EC min' },
        { key: 'ecMax', label: 'EC max' },
        { key: 'co2MinPpm', label: 'CO2 min' },
        { key: 'gasDangerThreshold', label: 'Gas limit' },
        { key: 'waterLowCm', label: 'Water low' },
        { key: 'wateringDurationSeconds', label: 'Water sec' },
        { key: 'fanDurationSeconds', label: 'Fan sec' },
        { key: 'sensorIntervalSeconds', label: 'Interval sec' },
    ];
}

function thresholdAnalysisHtml(plants = []) {
    const rack = currentRack();
    const level = beginnerPackageLevel();
    const capability = packageCapability(level);
    const plantNames = plants.length ? plants.map(plant => plant.name).join(', ') : 'mixed greens';
    const goals = goalPriority.map(goal => GOAL_OPTIONS.find(item => item.id === goal)?.label || goal).join(', ') || 'Beginner Safe';
    const locked = thresholdItems().filter(item => !capability.thresholdKeys.includes(item.key)).map(item => item.label);
    const generated = Boolean(generatedThresholds?.thresholds);
    const sourceLabel = generatedThresholds?.source === 'ai' ? 'AI generated' : generatedThresholds?.source === 'fallback' ? 'Rule-based fallback' : generated ? 'AI managed locked recipe' : 'Waiting for generation';

    const reasons = [
        `Plant profile: ${plantNames}.`,
        `Structure: ${rack.label} with ${rack.tiers} tiers and ${rack.total} slots.`,
        `Goal priority: ${goals}.`,
        `Package logic: ${capability.label} only enables thresholds for available sensors. Beginner mode locks the values after generation so users cannot accidentally create unsafe pump, fan, buzzer, pH, or sensor settings.`,
    ];

    if (locked.length) {
        reasons.push(`Locked sensors: ${locked.slice(0, 5).join(', ')}${locked.length > 5 ? '...' : ''}.`);
    } else {
        reasons.push('All sensor thresholds are unlocked for this package.');
    }

    return `
        <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
                <strong style="font-size:13px;color:var(--text);">${escapeHTML(sourceLabel)}</strong>
                <span style="font-size:10px;font-weight:900;color:var(--accent);background:var(--accent-l);padding:5px 8px;border-radius:999px;">${escapeHTML(capability.label)}</span>
            </div>
            <div style="font-size:12px;color:var(--muted);line-height:1.55;">
                ${escapeHTML(generatedThresholds?.notes || 'Generate thresholds to see SeedDown’s full reasoning for this field.')}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
                ${reasons.map(reason => `
                    <div style="display:flex;gap:7px;align-items:flex-start;font-size:11px;color:var(--sub);line-height:1.45;">
                        <span style="color:var(--accent);font-weight:900;">•</span>
                        <span>${escapeHTML(reason)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function packageCapability(level) {
    return PACKAGE_CAPABILITIES[level] || PACKAGE_CAPABILITIES.standard;
}

function beginnerPackageLevel() {
    return registeredDevice?.packageLevel || PACKAGE_QR_OPTIONS.find(item => item.serial === deviceSetup.serial)?.packageLevel || 'standard';
}

function filterThresholdsForPackage(thresholds = {}, level = beginnerPackageLevel()) {
    const allowed = new Set(packageCapability(level).thresholdKeys);
    return Object.fromEntries(Object.entries(thresholds).filter(([key]) => allowed.has(key)));
}

function bindThresholdInputs() {
    document.querySelectorAll('.threshold-input').forEach(input => {
        input.addEventListener('click', () => {
            showToast('info', 'Beginner thresholds are locked. Use Generate so AI can keep the device settings safe.');
        });
    });
}
async function registerDeviceFromStep(scannedPackage = null) {
    if (!deviceSetup.serial.trim()) {
        showToast('warning', 'Enter device serial');
        return null;
    }

    const button = document.getElementById('registerDeviceBtn') || document.getElementById('bfNext');
    if (button) {
        button.disabled = true;
        button.textContent = 'Registering...';
    }

    try {
        const response = await fetch(`${API_BASE}/api/devices/register`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                serial: deviceSetup.serial.trim(),
                wifi_ssid: deviceSetup.wifiSsid.trim(),
                wifi_password: deviceSetup.wifiPassword,
                accountType: deviceSetup.accountType,
                farmId: draftBeginnerFarmId(),
                fieldId: draftBeginnerFarmId(),
            }),
        });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || 'Device registration failed');
        registeredDevice = data.device;
        showToast('success', 'Device registered');
        drawStep();
        return registeredDevice;
    } catch (error) {
        showToast('error', error.message);
        return null;
    } finally {
        if (button) button.disabled = false;
    }
}

function buildLocalDemoDevice(option = null) {
    const selected = option || PACKAGE_QR_OPTIONS.find(item => item.serial === deviceSetup.serial) || PACKAGE_QR_OPTIONS[1];
    const suffix = selected.serial.split('-').pop() || String(Date.now()).slice(-5);
    return {
        deviceId: `dev_${selected.deviceType}_${selected.packageLevel}_${suffix}`.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        deviceToken: `demo_token_${suffix}`,
        serial: selected.serial,
        deviceType: selected.deviceType,
        packageLevel: selected.packageLevel,
        fieldId: draftBeginnerFarmId(),
        farmId: draftBeginnerFarmId(),
        isDemoFallback: true,
    };
}

async function safeJson(response) {
    try {
        return await response.json();
    } catch (error) {
        return {};
    }
}

async function generateThresholdsForField() {
    const button = document.getElementById('generateThresholdsBtn') || document.getElementById('bfNext');
    if (button) {
        button.disabled = true;
        button.textContent = 'Generating...';
    }

    const plants = (detectedPlants.length ? detectedPlants : [])
        .map((plant, index) => ({ tier: Math.floor(index / (currentRack().slotsPerTier || 3)) + 1, plant_type: plant.species || plant.name }));

    try {
        const response = await fetch(`${API_BASE}/api/ai/generate-thresholds`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                plants,
                goal_priority: goalPriority,
                packageLevel: registeredDevice?.packageLevel || 'standard',
            }),
        });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || 'Threshold generation failed');
        const packageLevel = registeredDevice?.packageLevel || beginnerPackageLevel();
        generatedThresholds = {
            thresholds: filterThresholdsForPackage(data.thresholds || {}, packageLevel),
            notes: data.notes || `${packageCapability(packageLevel).label} package thresholds generated. Locked sensors require a higher package.`,
            source: data.source,
        };
        showToast('success', data.source === 'ai' ? 'AI thresholds generated' : 'Fallback thresholds generated');
        drawStep();
        return generatedThresholds;
    } catch (error) {
        showToast('error', error.message);
        return null;
    } finally {
        if (button) button.disabled = false;
    }
}

async function handleNext() {
    if (isCommercialFlow()) {
        await handleCommercialNext();
        return;
    }

    if (step === 1) {
        if (!registeredDevice) {
            document.getElementById('deviceQrInput')?.click();
            showToast('info', 'Scan the SeedDown package QR first');
            return;
        }
        step = 2;
        drawStep();
        return;
    }

    if (step === 2) {
        if (!fieldInfo.name.trim()) {
            showToast('warning', 'Enter a field name');
            return;
        }
        step = 3;
        drawStep();
        return;
    }

    if (step === 3) {
        if (!photoData) {
            showToast('warning', 'Add a field photo before generating 3D');
            return;
        }
        step = 4;
        drawStep();
        return;
    }

    if (step === 4) {
        if (!generatedThresholds) {
            const thresholds = await generateThresholdsForField();
            if (!thresholds) return;
        }
        step = 5;
        drawStep();
        return;
    }

    if (step === 5) {
        await createField();
    }
}

async function handleCommercialNext() {
    if (step === 1) {
        if (!fieldInfo.name.trim()) {
            showToast('warning', 'Enter a commercial farm name');
            return;
        }
        step = 2;
        drawStep();
        return;
    }

    if (step === 2) {
        if (!photoData) {
            showToast('warning', 'Add a full farm photo first');
            return;
        }
        if (!commercialStructure) {
            const structure = await analyzeCommercialZones();
            if (!structure) return;
        }
        step = 3;
        drawStep();
        return;
    }

    if (step === 3) {
        if (!commercialGoals.length) {
            showToast('warning', 'Choose at least one commercial goal');
            return;
        }
        step = 4;
        drawStep();
        return;
    }

    if (step === 4) {
        if (!commercialThresholdsReady()) {
            const thresholds = await generateCommercialZoneThresholds();
            if (!thresholds) return;
        }
        step = 5;
        drawStep();
        return;
    }

    if (step === 5) {
        if (!commercialDevicesReady()) {
            document.getElementById('commercialDeviceQrInput')?.click();
            showToast('info', 'Scan and assign all required commercial nodes');
            return;
        }
        step = 6;
        drawStep();
        return;
    }

    if (step === 6) {
        await createCommercialFarm();
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
    CommercialFarmCanvas.destroy?.();
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

async function syncDevicePreferences(thresholds = {}) {
    if (!registeredDevice?.deviceId) return { synced: false, reason: 'No registered device' };

    const headers = getAuthHeaders();
    if (registeredDevice.deviceToken && !registeredDevice.isDemoFallback) {
        headers['x-device-token'] = registeredDevice.deviceToken;
    }

    const response = await fetch(`${API_BASE}/api/sensors/preferences`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
            deviceId: registeredDevice.deviceId,
            fieldId: registeredDevice.fieldId || null,
            farmId: registeredDevice.farmId || AppState.currentFarmId || null,
            zoneId: registeredDevice.zoneId || fieldInfo.location.trim() || null,
            packageLevel: registeredDevice.packageLevel,
            goalPriority,
            thresholdSource: generatedThresholds?.source || 'manual',
            thresholdNotes: generatedThresholds?.notes || '',
            ...thresholds,
        }),
    });

    const data = await safeJson(response);
    if (!response.ok || data.ok === false) {
        throw new Error(data.error || 'Preference sync failed');
    }

    return { synced: true, preferences: data.preferences || data };
}

async function createField() {
    const button = document.getElementById('bfNext');
    if (button) {
        button.disabled = true;
        button.textContent = 'Creating...';
    }

    const rack = currentRack();
    const fieldId = registeredDevice?.fieldId || draftBeginnerFarmId();
    const fallbackDevice = registeredDevice || buildLocalDemoDevice();
    const thresholds = filterThresholdsForPackage(generatedThresholds?.thresholds || {}, registeredDevice?.packageLevel || beginnerPackageLevel());
    const payload = {
        name: fieldInfo.name.trim(),
        location: fieldInfo.location.trim(),
        description: fieldInfo.description.trim(),
        rackType: fieldInfo.rackType,
        rackTypeId: fieldInfo.rackType,
        rackLabel: currentRack().label,
        rackConfig: fieldInfo.customRack ? { ...fieldInfo.customRack } : null,
        targetPlant: detectedPlants.map(plant => plant.name).join(', '),
        analysisGoal: goalPriority.join(','),
        viewMode,
        photoPreview: photoData?.dataUrl || null,
        plants: detectedPlants,
        plantSlots: totalSlotsUsed(),
        deviceId: fallbackDevice.deviceId,
        serial: registeredDevice?.serial || deviceSetup.serial,
        packageLevel: registeredDevice?.packageLevel || 'standard',
        goalPriority,
        thresholds,
    };

    let backendFarmId = null;
    try {
        const response = await fetch(`${API_BASE}/api/farms/create`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                ...payload,
                fieldId,
                zoneId: fieldInfo.location.trim() || null,
                thresholdSource: generatedThresholds?.source || 'manual',
                thresholdNotes: generatedThresholds?.notes || '',
            }),
        });
        const data = await safeJson(response);
        if (response.ok && data?.farmId) backendFarmId = data.farmId;
    } catch (error) {
        console.warn('[BuildFarm] create field API unavailable:', error.message);
    }

    let preferenceSync = { synced: false };
    if (registeredDevice?.deviceId) {
        try {
            preferenceSync = await syncDevicePreferences(thresholds);
            showToast('success', 'Device thresholds synced');
        } catch (error) {
            console.warn('[BuildFarm] preference sync skipped:', error.message);
            showToast('warning', `Field saved, but thresholds not synced: ${error.message}`);
        }
    }

    const saved = loadSavedFarms();
    const farm = {
        id: fieldId,
        backendFarmId,
        name: payload.name,
        location: payload.location,
        description: payload.description,
        zone: fieldInfo.location.trim() || String.fromCharCode(65 + (saved.length % 26)),
        rackTypeId: fieldInfo.rackType,
        rackType: rack.label,
        rackLabel: rack.label,
        rackConfig: fieldInfo.customRack ? { ...fieldInfo.customRack } : null,
        targetPlant: payload.targetPlant,
        analysisGoal: payload.analysisGoal,
        deviceId: fallbackDevice.deviceId,
        deviceToken: fallbackDevice.deviceToken || null,
        serial: fallbackDevice.serial || deviceSetup.serial,
        packageLevel: fallbackDevice.packageLevel || 'standard',
        goalPriority: [...goalPriority],
        thresholds: { ...thresholds },
        thresholdSource: generatedThresholds?.source || 'manual',
        thresholdNotes: generatedThresholds?.notes || '',
        preferenceSynced: Boolean(preferenceSync.synced),
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

    // ── Close-loop: register this farm so it appears in Community Farm Visits ──
    const EMOJI_FALLBACK = { tomato:'🍅', mint:'🌿', basil:'🌿', chili:'🌶️', lettuce:'🥬', spinach:'🌿', carrot:'🥕', cucumber:'🥒', pepper:'🌶️', strawberry:'🍓', default:'🌱' };
    const farmLayout = Array(9).fill(null);
    detectedPlants.slice(0, 9).forEach((p, i) => {
        const key = (p.name || '').toLowerCase();
        farmLayout[i] = EMOJI_FALLBACK[key] || EMOJI_FALLBACK.default;
    });
    fetch(`${API_BASE}/api/community/visits/register-farm`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ farmLayout, displayName: farm.name, avatar: '🧑‍🌾' }),
    }).catch(() => {}); // fire-and-forget

    setTimeout(() => goToFarmList(), 500);
}

async function createCommercialFarm() {
    ensureCommercialStructure();
    const button = document.getElementById('bfNext');
    if (button) {
        button.disabled = true;
        button.textContent = 'Launching...';
    }

    const farmId = commercialDraftFarmId || `farm_com_${Date.now()}`;
    const zones = commercialStructure.zones.map(zone => {
        const assignment = commercialDeviceAssignments.find(item => item.targetId === zone.zone_id);
        const threshold = commercialZoneThresholds[zone.zone_id] || {};
        const plantItems = commercialPlantItemsForZone(zone);
        return {
            ...zone,
            plantItems,
            plants: plantItems.map(item => item.name.toLowerCase()),
            plantCount: plantItems.reduce((sum, item) => sum + item.count, 0),
            crop: plantItems.map(item => `${item.name} x ${item.count}`).join(', '),
            deviceId: assignment?.deviceId || null,
            deviceToken: assignment?.deviceToken || null,
            serial: assignment?.serial || null,
            packageLevel: assignment?.packageLevel || zone.recommended_type,
            thresholds: threshold.thresholds || {},
            thresholdNotes: threshold.notes || '',
            thresholdSource: threshold.source || 'manual',
        };
    });
    const masterDevice = commercialDeviceAssignments.find(item => item.targetId === 'farm_master') || null;

    const payload = {
        name: fieldInfo.name.trim(),
        location: fieldInfo.location.trim(),
        description: fieldInfo.description.trim(),
        farmSize: fieldInfo.rackType || 'medium',
        accountMode: 'commercial',
        farmId,
        zones,
        commercialDevices: commercialDeviceAssignments,
        farmMaster: masterDevice,
        farmThresholds: commercialFarmThresholds?.thresholds || {},
        farmThresholdNotes: commercialFarmThresholds?.notes || '',
        farmThresholdSource: commercialFarmThresholds?.source || 'manual',
        commercialStructure,
        goalPriority: commercialGoals,
        targetPlant: zones.map(zone => zone.crop).join(', '),
        analysisGoal: commercialGoals.join(','),
        photoPreview: photoData?.dataUrl || null,
        plants: zones.flatMap(zone => commercialPlantItemsForZone(zone).map((plant, index) => ({
            name: plant.name,
            species: String(plant.name).toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            emoji: emojiForName(plant.name),
            zoneId: zone.zone_id,
            zoneName: zone.name,
            tier: index + 1,
            slots: plant.count,
        }))),
        rackType: 'commercial-multi-zone',
        viewMode: 'commercial',
    };

    try {
        const response = await fetch(`${API_BASE}/api/farms/create`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        const data = await safeJson(response);
        if (response.ok && data?.farmId) payload.backendFarmId = data.farmId;
    } catch (error) {
        console.warn('[BuildFarm] commercial farm API unavailable:', error.message);
    }

    await syncCommercialFarmPreferences(farmId, masterDevice);
    await syncCommercialZonePreferences(farmId, zones);

    const saved = loadSavedFarms();
    const farm = {
        id: farmId,
        backendFarmId: payload.backendFarmId || null,
        name: payload.name,
        location: payload.location,
        description: payload.description,
        accountMode: 'commercial',
        farmSize: payload.farmSize,
        zones,
        commercialDevices: commercialDeviceAssignments.map(device => ({ ...device })),
        farmMaster: masterDevice,
        farmThresholds: payload.farmThresholds,
        farmThresholdNotes: payload.farmThresholdNotes,
        farmThresholdSource: payload.farmThresholdSource,
        commercialStructure,
        goalPriority: [...commercialGoals],
        analysisGoal: payload.analysisGoal,
        targetPlant: payload.targetPlant,
        rackTypeId: 'commercial-multi-zone',
        rackType: 'Commercial Multi-Zone Farm',
        rackLabel: `${zones.length}-Zone Commercial Layout`,
        plantSlots: zones.length * 12,
        plants: payload.plants,
        photoPreview: payload.photoPreview,
        createdAt: new Date().toISOString(),
    };

    saved.push(farm);
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(saved));

    AppState.currentFarm = farm;
    AppState.currentFarmId = farm.id;
    AppState.farmName = farm.name;
    AppState.mode = 'commercial';
    showToast('success', `"${farm.name}" commercial farm launched`);
    dispose3D();
    setTimeout(() => goToFarmList(), 500);
}

async function syncCommercialZonePreferences(farmId, zones) {
    for (const zone of zones) {
        if (!zone.deviceId) continue;
        const headers = getAuthHeaders();
        if (zone.deviceToken) headers['x-device-token'] = zone.deviceToken;
        try {
            const response = await fetch(`${API_BASE}/api/sensors/preferences`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    deviceId: zone.deviceId,
                    farmId,
                    zoneId: zone.zone_id,
                    packageLevel: zone.packageLevel,
                    goalPriority: commercialGoals,
                    thresholdSource: zone.thresholdSource,
                    thresholdNotes: zone.thresholdNotes,
                    ...zone.thresholds,
                }),
            });
            const data = await safeJson(response);
            if (!response.ok || data.ok === false) throw new Error(data.error || 'Preference sync failed');
        } catch (error) {
            console.warn(`[BuildFarm] commercial preference sync skipped for ${zone.zone_id}:`, error.message);
        }
    }
}

async function syncCommercialFarmPreferences(farmId, masterDevice) {
    if (!masterDevice?.deviceId) return;
    const headers = getAuthHeaders();
    if (masterDevice.deviceToken) headers['x-device-token'] = masterDevice.deviceToken;
    try {
        const response = await fetch(`${API_BASE}/api/sensors/preferences`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                deviceId: masterDevice.deviceId,
                farmId,
                zoneId: 'farm_master',
                packageLevel: masterDevice.packageLevel || 'farm_master',
                goalPriority: commercialGoals,
                thresholdSource: commercialFarmThresholds?.source || 'manual',
                thresholdNotes: commercialFarmThresholds?.notes || '',
                ...(commercialFarmThresholds?.thresholds || {}),
            }),
        });
        const data = await safeJson(response);
        if (!response.ok || data.ok === false) throw new Error(data.error || 'Farm master preference sync failed');
    } catch (error) {
        console.warn('[BuildFarm] farm master preference sync skipped:', error.message);
    }
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
    if (fieldInfo.rackType === 'photo-detected' && fieldInfo.customRack) {
        return fieldInfo.customRack;
    }
    return RACK_OPTIONS.find(rack => rack.id === fieldInfo.rackType) || RACK_OPTIONS[0];
}

function totalSlotsUsed() {
    return detectedPlants.reduce((sum, plant) => sum + plant.slots, 0);
}

function draftBeginnerFarmId() {
    if (AppState.currentFarmId) return AppState.currentFarmId;
    if (!beginnerDraftFarmId) beginnerDraftFarmId = `field_${Date.now()}`;
    return beginnerDraftFarmId;
}

function goalLabel(id) {
    return ANALYSIS_GOALS.find(goal => goal.id === id)?.label || id;
}

function isCommercialFlow() {
    try {
        const buildFlow = localStorage.getItem('seeddown_build_flow');
        if (buildFlow === 'beginner') {
            AppState.mode = 'beginner';
            return false;
        }
        if (buildFlow === 'commercial' || localStorage.getItem('seeddown_mode') === 'commercial') {
            AppState.mode = 'commercial';
            return true;
        }
    } catch {
        // Keep AppState as the fallback when storage is unavailable.
    }
    return AppState.mode === 'commercial';
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

function escapeAttr(value) {
    return escapeHTML(value);
}














