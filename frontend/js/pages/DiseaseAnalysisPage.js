import { showScreen } from '../utils/navigation.js';
import { AppState } from '../store.js';
import { showToast } from '../utils/toast.js';
import { scanPlantDiseaseWithFirebaseAI } from '../services/firebaseAiLogic.js';

const FARMS_KEY = 'user_farms';
const REPORTS_KEY = 'seeddown_disease_reports';

let selectedImage = null;
let selectedMediaType = 'image/jpeg';
let selectedPlant = null;
let currentFarm = null;
let lastResult = null;

export function render() {
    currentFarm = getCurrentFarm();
    const plants = getPlants(currentFarm);
    selectedPlant = chooseInitialPlant(plants);
    selectedImage = null;
    selectedMediaType = 'image/jpeg';
    lastResult = null;

    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="diseaseScreen" style="background:var(--bg);display:flex;flex-direction:column;height:100vh;color:var(--text);">
            <div class="topbar">
                <button id="diseaseBackBtn" class="back-btn" style="background:transparent;border:none;font-size:20px;cursor:pointer;color:var(--text);">←</button>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Plant Disease Analysis</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:900;text-transform:uppercase;letter-spacing:.06em;">${escapeHTML(currentFarm?.name || AppState.farmName || 'Commercial Farm')}</div>
                </div>
                <button id="diseaseHistoryBtn" style="border:1px solid var(--border);background:var(--surface);color:var(--accent);border-radius:10px;padding:8px 11px;font-size:11px;font-weight:900;cursor:pointer;">History</button>
            </div>

            <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px;">
                <section class="disease-hero">
                    <div class="disease-hero-icon">AI</div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.08em;">Known plant + new photo</div>
                        <div style="font-size:20px;font-weight:950;line-height:1.1;margin-top:3px;">Diagnose suspected plant disease</div>
                        <div style="font-size:13px;color:var(--sub);line-height:1.4;margin-top:6px;">SeedDown uses the plant remembered during field creation, checks the new photo, then explains likely cause, confidence, and treatment steps.</div>
                    </div>
                </section>

                <section class="disease-card">
                    <div class="disease-section-title">1. Select suspected plant</div>
                    <div id="plantSelector" class="plant-selector">
                        ${plantOptionsHTML(plants)}
                    </div>
                    <div id="plantContext" class="plant-context">${plantContextHTML(selectedPlant)}</div>
                </section>

                <section class="disease-card">
                    <div class="disease-section-title">2. Capture or upload symptom photo</div>
                    <label class="photo-drop" for="diseasePhotoInput">
                        <div id="photoPreview" class="photo-preview-empty">
                            <span style="font-size:26px;">📷</span>
                            <strong>Add leaf / stem / fruit photo</strong>
                            <small>Use a close-up photo with clear lighting</small>
                        </div>
                    </label>
                    <input id="diseasePhotoInput" type="file" accept="image/*" capture="environment" style="display:none;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">
                        <button id="choosePhotoBtn" class="disease-secondary-btn">Choose Photo</button>
                        <button id="runDiseaseBtn" class="disease-primary-btn">Run Analysis</button>
                    </div>
                </section>

                <section id="analysisState" class="disease-card disease-muted-card">
                    <div style="display:flex;gap:10px;align-items:flex-start;">
                        <div class="disease-mini-icon">?</div>
                        <div>
                            <div style="font-size:14px;font-weight:900;">Waiting for plant photo</div>
                            <div style="font-size:12px;color:var(--sub);line-height:1.4;margin-top:3px;">Choose the plant and upload a symptom photo. If confidence is low, SeedDown will ask extra questions before making a final recommendation.</div>
                        </div>
                    </div>
                </section>

                <section id="analysisResult" style="display:none;"></section>

                <div style="height:10px;"></div>
            </div>
        </div>
    `;

    ensureDiseaseStyles();
    bindEvents(plants);
}

function bindEvents(plants) {
    document.getElementById('diseaseBackBtn')?.addEventListener('click', () => showScreen('dash-c'));
    document.getElementById('diseaseHistoryBtn')?.addEventListener('click', showHistory);
    document.getElementById('choosePhotoBtn')?.addEventListener('click', () => document.getElementById('diseasePhotoInput')?.click());
    document.getElementById('diseasePhotoInput')?.addEventListener('change', onPhotoSelected);
    document.getElementById('runDiseaseBtn')?.addEventListener('click', () => runAnalysis());

    document.querySelectorAll('.plant-choice').forEach(button => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.index);
            selectedPlant = plants[index] || selectedPlant;
            document.querySelectorAll('.plant-choice').forEach(node => node.classList.remove('selected'));
            button.classList.add('selected');
            const context = document.getElementById('plantContext');
            if (context) context.innerHTML = plantContextHTML(selectedPlant);
        });
    });
}

async function onPhotoSelected(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    selectedMediaType = file.type || 'image/jpeg';
    const dataUrl = await fileToDataURL(file);
    selectedImage = dataUrl.split(',')[1] || '';
    const preview = document.getElementById('photoPreview');
    if (preview) {
        preview.className = 'photo-preview-filled';
        preview.innerHTML = `<img src="${dataUrl}" alt="Selected plant symptom photo"><div><strong>${escapeHTML(file.name || 'Plant photo')}</strong><small>${Math.round(file.size / 1024)} KB - ready for analysis</small></div>`;
    }
}

async function runAnalysis(extraAnswers = {}) {
    if (!selectedPlant) {
        showToast('warning', 'Select a plant first');
        return;
    }
    if (!selectedImage) {
        showToast('warning', 'Upload or capture a plant photo first');
        return;
    }

    setLoading(true);
    try {
        const farmContext = buildFarmContext(currentFarm, selectedPlant);
        const aiResult = await scanPlantDiseaseWithFirebaseAI({
            image: selectedImage,
            mediaType: selectedMediaType,
            plantName: selectedPlant.name,
            plantSpecies: selectedPlant.species,
            farmContext,
            answers: extraAnswers,
        });
        lastResult = normalizeResult(aiResult || fallbackDiagnosis(selectedPlant, farmContext), selectedPlant);
        saveReport(lastResult, selectedPlant, currentFarm);
        renderResult(lastResult);
        showToast(aiResult ? 'success' : 'warning', aiResult ? 'AI disease analysis completed' : 'AI unavailable, using safe fallback analysis');
    } catch (error) {
        console.warn('[DiseaseAnalysis] AI failed, using fallback:', error);
        const farmContext = buildFarmContext(currentFarm, selectedPlant);
        lastResult = normalizeResult(fallbackDiagnosis(selectedPlant, farmContext, true), selectedPlant);
        saveReport(lastResult, selectedPlant, currentFarm);
        renderResult(lastResult);
        showToast('warning', 'AI unavailable. Showing cautious fallback analysis.');
    } finally {
        setLoading(false);
    }
}

function renderResult(result) {
    const state = document.getElementById('analysisState');
    const target = document.getElementById('analysisResult');
    if (state) state.style.display = 'none';
    if (!target) return;

    const confidencePercent = Math.round((result.confidence || 0) * 100);
    target.style.display = 'block';
    target.innerHTML = `
        <section class="disease-result-card severity-${escapeHTML(result.severity)}">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                <div>
                    <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.08em;">Most likely diagnosis</div>
                    <div style="font-size:22px;font-weight:950;line-height:1.15;margin-top:5px;">${escapeHTML(result.condition)}</div>
                    <div style="font-size:13px;color:var(--sub);margin-top:5px;">${escapeHTML(result.plant)} - Severity: ${escapeHTML(result.severity)}</div>
                </div>
                <button id="confidenceToggle" class="confidence-pill" type="button">
                    <span>${confidencePercent}%</span>
                    <small>confidence</small>
                </button>
            </div>
            <div id="confidenceExplain" class="confidence-explain" style="display:none;">${escapeHTML(result.confidenceExplanation)}</div>
        </section>

        ${result.needsMoreInfo ? followUpHTML(result.followUpQuestions) : ''}

        <section class="disease-grid">
            ${listCard('Evidence', result.evidence, 'Observed clues from photo/context')}
            ${listCard('Likely Causes', result.likelyCauses, 'What may be triggering it')}
            ${listCard('Solution', result.solutions, 'Action steps for the grower')}
            ${listCard('Prevention', result.prevention, 'Avoid recurrence')}
        </section>
    `;

    document.getElementById('confidenceToggle')?.addEventListener('click', () => {
        const explain = document.getElementById('confidenceExplain');
        if (explain) explain.style.display = explain.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('submitFollowUpBtn')?.addEventListener('click', () => {
        const answers = {};
        document.querySelectorAll('.follow-answer').forEach((input, index) => {
            answers[`answer_${index + 1}`] = input.value.trim();
        });
        runAnalysis(answers);
    });
}

function followUpHTML(questions) {
    const safeQuestions = questions.length ? questions : [
        'Are the spots powdery, watery, or dry?',
        'Which plant part changed first: older leaves, new leaves, stem, or fruit?',
        'Did humidity, watering, or airflow change recently?',
    ];
    return `
        <section class="disease-card follow-card">
            <div class="disease-section-title">Need more context</div>
            <div style="font-size:13px;color:var(--sub);line-height:1.4;margin-bottom:10px;">Confidence is low, so SeedDown asks follow-up questions before making a stronger recommendation.</div>
            ${safeQuestions.map((q, index) => `
                <label style="display:block;margin-top:10px;">
                    <span style="display:block;font-size:12px;font-weight:900;margin-bottom:5px;">${escapeHTML(q)}</span>
                    <textarea class="follow-answer" rows="2" placeholder="Type answer ${index + 1}" style="width:100%;resize:vertical;border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);color:var(--text);outline:none;"></textarea>
                </label>
            `).join('')}
            <button id="submitFollowUpBtn" class="disease-primary-btn" style="margin-top:12px;width:100%;">Refine Analysis</button>
        </section>
    `;
}

function listCard(title, items, empty) {
    const list = items?.length ? items : [empty];
    return `
        <section class="disease-card small">
            <div class="disease-section-title">${escapeHTML(title)}</div>
            <ul style="margin:10px 0 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;">
                ${list.map(item => `<li class="disease-list-item">${escapeHTML(item)}</li>`).join('')}
            </ul>
        </section>
    `;
}

function setLoading(loading) {
    const button = document.getElementById('runDiseaseBtn');
    if (!button) return;
    button.disabled = loading;
    button.textContent = loading ? 'Analysing...' : 'Run Analysis';
}

function showHistory() {
    const reports = loadReports().slice(0, 5);
    const state = document.getElementById('analysisState');
    const target = document.getElementById('analysisResult');
    if (state) state.style.display = 'none';
    if (!target) return;
    target.style.display = 'block';
    target.innerHTML = `
        <section class="disease-card">
            <div class="disease-section-title">Recent disease reports</div>
            ${reports.length ? reports.map(report => `
                <div class="history-row">
                    <div>
                        <strong>${escapeHTML(report.plantName)}</strong>
                        <small>${escapeHTML(report.condition)} - ${Math.round((report.confidence || 0) * 100)}% confidence</small>
                    </div>
                    <span>${escapeHTML(new Date(report.createdAt).toLocaleDateString())}</span>
                </div>
            `).join('') : '<div style="font-size:13px;color:var(--sub);">No disease reports yet.</div>'}
        </section>
    `;
}

function plantOptionsHTML(plants) {
    if (!plants.length) {
        return `<button class="plant-choice selected" data-index="0"><span>🌱</span><strong>Unknown Plant</strong><small>Add plants first</small></button>`;
    }
    return plants.map((plant, index) => `
        <button class="plant-choice ${plant === selectedPlant ? 'selected' : ''}" data-index="${index}" type="button">
            <span>${escapeHTML(plant.emoji || '🌱')}</span>
            <strong>${escapeHTML(plant.name || 'Plant')}</strong>
            <small>${escapeHTML(positionLabel(plant))}</small>
        </button>
    `).join('');
}

function plantContextHTML(plant) {
    return `
        <div><strong>Plant</strong><span>${escapeHTML(plant?.name || 'Unknown Plant')}</span></div>
        <div><strong>Species</strong><span>${escapeHTML(plant?.species || 'unknown')}</span></div>
        <div><strong>Status</strong><span>${escapeHTML(plant?.status || 'suspected')}</span></div>
        <div><strong>Location</strong><span>${escapeHTML(positionLabel(plant))}</span></div>
    `;
}

function getCurrentFarm() {
    const farms = loadFarms();
    return AppState.currentFarm
        || farms.find(farm => farm.id === AppState.currentFarmId)
        || farms[farms.length - 1]
        || null;
}

function getPlants(farm) {
    const plants = Array.isArray(farm?.plants) ? farm.plants : [];
    if (plants.length) return plants.map((plant, index) => ({
        name: plant.name || plant.species || farm?.targetPlant || 'Plant',
        species: plant.species || speciesKey(plant.name || farm?.targetPlant),
        emoji: plant.emoji || emojiForName(plant.name || farm?.targetPlant),
        status: plant.status || 'healthy',
        tier: plant.tier,
        position: plant.position,
        slotIndex: plant.slotIndex ?? index,
    }));
    return [{
        name: farm?.targetPlant || 'Unknown Plant',
        species: speciesKey(farm?.targetPlant || 'unknown'),
        emoji: emojiForName(farm?.targetPlant),
        status: 'suspected',
        tier: farm?.rackType || 'unknown',
        position: 1,
        slotIndex: 0,
    }];
}

function chooseInitialPlant(plants) {
    return plants.find(plant => ['warning', 'critical', 'danger', 'suspected'].includes(String(plant.status).toLowerCase())) || plants[0] || null;
}

function buildFarmContext(farm, plant) {
    return {
        farmName: farm?.name || AppState.farmName || 'Commercial Farm',
        location: farm?.location || 'not provided',
        targetPlant: farm?.targetPlant || plant?.name || 'Plant',
        rackType: farm?.rackType || farm?.rackTypeId || farm?.rackLabel || 'vertical rack',
        analysisGoal: farm?.analysisGoal || farm?.goal || 'plant health',
        selectedPlant: plant,
        latestSensors: AppState.sensors || {},
    };
}

function fallbackDiagnosis(plant, context, aiFailed = false) {
    const key = String(plant?.species || plant?.name || '').toLowerCase();
    const base = {
        plant: plant?.name || 'Plant',
        severity: aiFailed ? 'unknown' : 'medium',
        confidence: aiFailed ? 0.48 : 0.58,
        confidenceExplanation: aiFailed
            ? 'AI vision was unavailable, so this is a cautious rule-based estimate using plant type and farm context only.'
            : 'Confidence is moderate because the system has plant context, but the fallback cannot inspect symptoms as deeply as vision AI.',
        needsMoreInfo: true,
        followUpQuestions: [
            'Are the marks powdery, watery, dry, or yellow?',
            'Did symptoms start on older leaves, new leaves, stem, or fruit?',
            'Has humidity, airflow, watering, or nutrient mix changed recently?',
        ],
    };

    if (key.includes('tomato') || key.includes('chili') || key.includes('pepper')) {
        return {
            ...base,
            condition: 'Possible leaf spot or early blight stress',
            evidence: ['Fruiting crops commonly show spots under high humidity or poor airflow', 'Known crop context points to tomato or pepper disease family'],
            likelyCauses: ['High humidity with weak ventilation', 'Water splashing on leaves', 'Nutrient imbalance or infected older foliage'],
            solutions: ['Remove heavily affected leaves', 'Improve airflow around the rack', 'Avoid wetting leaves during watering', 'Isolate the plant if spots spread quickly'],
            prevention: ['Keep foliage dry', 'Space plants better', 'Check pH and nutrient EC regularly'],
        };
    }

    if (key.includes('lettuce') || key.includes('kale') || key.includes('spinach')) {
        return {
            ...base,
            condition: 'Possible tip burn, nutrient stress, or downy mildew',
            evidence: ['Leafy greens are sensitive to airflow, calcium movement, and humidity', 'Vertical farms can trap moisture between leaves'],
            likelyCauses: ['Poor airflow', 'High humidity', 'Nutrient or pH imbalance'],
            solutions: ['Check pH and nutrient concentration', 'Increase air circulation', 'Remove damaged outer leaves', 'Reduce leaf wetness'],
            prevention: ['Maintain stable pH', 'Avoid overcrowding', 'Keep air moving between tiers'],
        };
    }

    if (key.includes('cucumber')) {
        return {
            ...base,
            condition: 'Possible powdery mildew or water stress',
            evidence: ['Cucumber is prone to mildew under humid indoor conditions', 'Symptoms often need close photo confirmation'],
            likelyCauses: ['High humidity', 'Low airflow', 'Irregular watering'],
            solutions: ['Improve ventilation', 'Remove infected leaves', 'Keep leaves dry', 'Monitor spread daily'],
            prevention: ['Avoid crowding vines', 'Use consistent irrigation', 'Inspect leaves weekly'],
        };
    }

    return {
        ...base,
        condition: 'Possible environmental stress, disease not confirmed',
        evidence: ['The plant type is known, but symptoms need clearer confirmation'],
        likelyCauses: ['Watering inconsistency', 'pH or nutrient imbalance', 'Low airflow or lighting stress'],
        solutions: ['Take a closer photo of affected leaves', 'Check pH, moisture, and light readings', 'Compare new and old leaves'],
        prevention: ['Record symptoms daily', 'Keep sensor thresholds within crop range', 'Avoid sudden changes in irrigation or light'],
    };
}

function normalizeResult(result, plant) {
    const confidence = Math.min(1, Math.max(0, Number(result?.confidence) || 0));
    return {
        plant: result?.plant || plant?.name || 'Plant',
        condition: result?.condition || 'Unable to confirm disease',
        severity: ['low', 'medium', 'high', 'unknown'].includes(result?.severity) ? result.severity : 'unknown',
        confidence,
        confidenceExplanation: result?.confidenceExplanation || 'Confidence is based on visible symptoms, image clarity, and known plant context.',
        evidence: arrayOfText(result?.evidence),
        likelyCauses: arrayOfText(result?.likelyCauses),
        solutions: arrayOfText(result?.solutions),
        prevention: arrayOfText(result?.prevention),
        needsMoreInfo: Boolean(result?.needsMoreInfo) || confidence < 0.55,
        followUpQuestions: arrayOfText(result?.followUpQuestions).slice(0, 4),
    };
}

function saveReport(result, plant, farm) {
    const reports = loadReports();
    reports.unshift({
        id: `disease_${Date.now()}`,
        createdAt: new Date().toISOString(),
        farmId: farm?.id || AppState.currentFarmId || null,
        farmName: farm?.name || AppState.farmName || 'Commercial Farm',
        plantName: plant?.name || result.plant,
        condition: result.condition,
        confidence: result.confidence,
        severity: result.severity,
    });
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports.slice(0, 20)));
}

function loadReports() {
    try { return JSON.parse(localStorage.getItem(REPORTS_KEY)) || []; }
    catch { return []; }
}

function loadFarms() {
    try { return JSON.parse(localStorage.getItem(FARMS_KEY)) || []; }
    catch { return []; }
}

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function arrayOfText(value) {
    return Array.isArray(value) ? value.map(item => String(item || '').trim()).filter(Boolean) : [];
}

function positionLabel(plant) {
    if (!plant) return 'Unknown slot';
    if (plant.tier && plant.position) return `Tier ${plant.tier} - Slot ${plant.position}`;
    if (plant.slotIndex !== undefined) return `Slot ${Number(plant.slotIndex) + 1}`;
    return 'Farm slot';
}

function speciesKey(name = '') {
    return String(name || 'plant').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'plant';
}

function emojiForName(name = '') {
    const key = String(name).toLowerCase();
    if (key.includes('lettuce') || key.includes('kale') || key.includes('cabbage')) return '🥬';
    if (key.includes('tomato')) return '🍅';
    if (key.includes('chili') || key.includes('pepper')) return '🌶️';
    if (key.includes('cucumber')) return '🥒';
    if (key.includes('basil') || key.includes('mint') || key.includes('spinach')) return '🌿';
    return '🌱';
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function ensureDiseaseStyles() {
    if (document.getElementById('disease-analysis-style')) return;
    const style = document.createElement('style');
    style.id = 'disease-analysis-style';
    style.textContent = `
        .disease-hero,
        .disease-card,
        .disease-result-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            box-shadow: var(--shadow-sm);
        }
        .disease-hero { display:flex; gap:14px; align-items:flex-start; padding:16px; }
        .disease-hero-icon,
        .disease-mini-icon {
            width:44px; height:44px; border-radius:15px; background:var(--accent-l); color:var(--accent);
            display:flex; align-items:center; justify-content:center; font-weight:950; flex-shrink:0;
        }
        .disease-mini-icon { width:34px; height:34px; border-radius:12px; }
        .disease-card { padding:16px; }
        .disease-card.small { min-height:150px; }
        .disease-muted-card { background:#f8fafc; }
        .disease-section-title { font-size:11px; color:var(--muted); font-weight:950; text-transform:uppercase; letter-spacing:.08em; }
        .plant-selector { display:grid; grid-template-columns:repeat(auto-fit,minmax(118px,1fr)); gap:10px; margin-top:12px; }
        .plant-choice { border:1px solid var(--border); background:var(--surface2); border-radius:16px; padding:12px; text-align:left; color:var(--text); cursor:pointer; }
        .plant-choice.selected { border-color:var(--accent); background:var(--accent-l); box-shadow:0 0 0 2px rgba(16,185,129,.08); }
        .plant-choice span { display:block; font-size:24px; line-height:1; }
        .plant-choice strong { display:block; margin-top:8px; font-size:13px; }
        .plant-choice small { display:block; margin-top:3px; color:var(--muted); font-size:10px; font-weight:800; }
        .plant-context { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-top:12px; }
        .plant-context div { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:10px; }
        .plant-context strong { display:block; font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; }
        .plant-context span { display:block; font-size:13px; font-weight:850; margin-top:3px; }
        .photo-drop { display:block; margin-top:12px; border:1px dashed rgba(16,185,129,.45); border-radius:18px; background:linear-gradient(135deg, rgba(236,253,245,.9), rgba(255,255,255,.8)); cursor:pointer; overflow:hidden; }
        .photo-preview-empty { min-height:150px; display:flex; flex-direction:column; gap:6px; align-items:center; justify-content:center; color:var(--sub); text-align:center; padding:16px; }
        .photo-preview-empty strong { color:var(--text); }
        .photo-preview-empty small { color:var(--muted); font-weight:700; }
        .photo-preview-filled { display:flex; gap:12px; align-items:center; padding:10px; }
        .photo-preview-filled img { width:96px; height:96px; border-radius:14px; object-fit:cover; border:1px solid var(--border); }
        .photo-preview-filled strong { display:block; font-size:13px; }
        .photo-preview-filled small { display:block; color:var(--muted); margin-top:4px; }
        .disease-primary-btn,
        .disease-secondary-btn { border:none; border-radius:14px; padding:13px 12px; font-weight:950; cursor:pointer; }
        .disease-primary-btn { background:var(--accent); color:white; }
        .disease-primary-btn:disabled { opacity:.55; cursor:wait; }
        .disease-secondary-btn { background:var(--surface2); border:1px solid var(--border); color:var(--accent); }
        .disease-result-card { padding:16px; border-left:5px solid var(--accent); }
        .severity-high { border-left-color:var(--danger); }
        .severity-medium { border-left-color:var(--warn); }
        .severity-low { border-left-color:var(--ok); }
        .confidence-pill { width:76px; height:62px; border:1px solid var(--border); border-radius:18px; background:var(--surface2); color:var(--text); cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; }
        .confidence-pill span { font-size:20px; font-weight:950; color:var(--accent); }
        .confidence-pill small { font-size:9px; color:var(--muted); font-weight:900; text-transform:uppercase; }
        .confidence-explain { margin-top:12px; padding:12px; border-radius:14px; background:var(--surface2); color:var(--sub); font-size:13px; line-height:1.45; }
        .disease-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-top:12px; }
        .disease-list-item { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:9px 10px; font-size:13px; color:var(--sub); line-height:1.35; }
        .follow-card { margin-top:12px; border-color:rgba(245,158,11,.35); background:#fffbeb; }
        .history-row { display:flex; justify-content:space-between; gap:10px; align-items:center; border:1px solid var(--border); border-radius:14px; padding:11px; margin-top:10px; background:var(--surface2); }
        .history-row strong, .history-row small { display:block; }
        .history-row small { color:var(--muted); margin-top:3px; }
        .history-row span { font-size:11px; color:var(--muted); font-weight:800; }
        @media (max-width: 620px) {
            .disease-grid { grid-template-columns:1fr; }
            .plant-context { grid-template-columns:1fr; }
        }
    `;
    document.head.appendChild(style);
}
