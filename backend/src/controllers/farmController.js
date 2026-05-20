/**
 * farmController.js
 *
 * AI calls are backend-only. Provider order:
 * 1. GROQ_API_KEY
 * 2. GEMINI_API_KEY_2
 * 3. GEMINI_API_KEY
 */

const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
const { analyzePlantImage, analyzePlantDisease } = require('../services/aiService');
const { getDb } = require('../config/db'); // 确保引入 getDb 放在顶层方便使用

// ─────────────────────────────────────────────────────────────
// Scan Plants via backend AI provider chain
// ─────────────────────────────────────────────────────────────
async function scanPlants(req, res) {
    const { image, mediaType, targetPlant } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'No image provided', plants: [] });
    }

    try {
        const parsed = await analyzePlantImage({ image, mediaType, targetPlant });
        return res.json({ ...parsed, source: 'backend-ai' });
    } catch (err) {
        const message = err.message || 'Unknown AI error';
        const quotaIssue = /credit|quota|billing|prepayment|rate/i.test(message);
        console.warn('[farmController] scanPlants backend AI fallback:', message);

        return res.json({
            plants: fallbackPlants(targetPlant),
            source: 'fallback',
            warning: quotaIssue
                ? 'AI provider reached, but quota or billing is unavailable; using target plant fallback.'
                : `AI photo recognition unavailable: ${message}`,
        });
    }
}

// ─────────────────────────────────────────────────────────────
// Disease Analysis via backend AI provider chain
// ─────────────────────────────────────────────────────────────
async function analyzeDisease(req, res) {
    const { image, mediaType, plantName, plantSpecies, farmContext = {}, answers = {} } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'No image provided' });
    }

    try {
        const result = await analyzePlantDisease({ image, mediaType, plantName, plantSpecies, farmContext, answers });
        return res.json({ ...result, source: 'backend-ai' });
    } catch (err) {
        const message = err.message || 'Unknown AI error';
        console.warn('[farmController] analyzeDisease backend AI fallback:', message);
        return res.json({
            ...fallbackDisease(plantName, plantSpecies),
            source: 'fallback',
            warning: `AI disease analysis unavailable: ${message}`,
        });
    }
}

function fallbackDisease(plantName, plantSpecies) {
    const key = String(plantSpecies || plantName || '').toLowerCase();
    const base = {
        plant: plantName || 'Plant',
        severity: 'unknown',
        confidence: 0.46,
        confidenceExplanation: 'AI provider was unavailable, so this is a cautious rule-based estimate using plant type only.',
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
            evidence: ['Fruiting crop context suggests leaf spot or airflow-related stress'],
            likelyCauses: ['High humidity with weak ventilation', 'Water splashing on leaves', 'Nutrient imbalance'],
            solutions: ['Remove heavily affected leaves', 'Improve airflow', 'Avoid wetting leaves during watering'],
            prevention: ['Keep foliage dry', 'Space plants better', 'Check pH and nutrient EC regularly'],
        };
    }

    if (key.includes('lettuce') || key.includes('kale') || key.includes('spinach')) {
        return {
            ...base,
            condition: 'Possible tip burn, nutrient stress, or downy mildew',
            evidence: ['Leafy greens are sensitive to airflow, calcium movement, humidity, and pH'],
            likelyCauses: ['Poor airflow', 'High humidity', 'Nutrient or pH imbalance'],
            solutions: ['Check pH and nutrient concentration', 'Increase air circulation', 'Remove damaged outer leaves'],
            prevention: ['Maintain stable pH', 'Avoid overcrowding', 'Keep air moving between tiers'],
        };
    }

    return {
        ...base,
        condition: 'Possible environmental stress, disease not confirmed',
        evidence: ['Plant type is known but symptoms need clearer confirmation'],
        likelyCauses: ['Watering inconsistency', 'pH or nutrient imbalance', 'Low airflow or lighting stress'],
        solutions: ['Take a closer photo of affected leaves', 'Check pH, moisture, and light readings', 'Compare new and old leaves'],
        prevention: ['Record symptoms daily', 'Keep sensor thresholds within crop range', 'Avoid sudden changes in irrigation or light'],
    };
}

function fallbackPlants(targetPlant) {
    const seen = new Set();
    const names = String(targetPlant || '')
        .split(/[,;\n]+/)
        .map((name) => name.trim())
        .filter(Boolean)
        .filter((name) => {
            const key = name.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

    return sanitizePlants(names.map((name) => ({
        name,
        emoji: emojiForPlant(name),
        species: name,
        confidence: 0.45,
        slots: 3,
    })));
}

function sanitizePlants(plants) {
    return plants.map((p) => ({
        name: p.name || 'Unknown Plant',
        emoji: p.emoji || emojiForPlant(p.name),
        species: (p.species || p.name || 'unknown')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, ''),
        confidence: Math.min(1, Math.max(0, parseFloat(p.confidence) || 0)),
        slots: Math.max(1, Math.min(50, parseInt(p.slots, 10) || 3)),
    }));
}

function emojiForPlant(name = '') {
    const key = String(name).toLowerCase();
    if (key.includes('lettuce') || key.includes('cabbage') || key.includes('kale')) return '🥬';
    if (key.includes('tomato')) return '🍅';
    if (key.includes('chili') || key.includes('pepper')) return '🌶️';
    if (key.includes('strawberry')) return '🍓';
    if (key.includes('cucumber')) return '🥒';
    if (key.includes('carrot')) return '🥕';
    if (key.includes('bean')) return '🫘';
    if (key.includes('pea')) return '🟢';
    if (key.includes('basil') || key.includes('mint') || key.includes('spinach') || key.includes('cilantro') || key.includes('parsley')) return '🌿';
    return '🌱';
}

// ─────────────────────────────────────────────────────────────
// Generate 3D (DA3 Proxy)
// ─────────────────────────────────────────────────────────────
async function generate3D(req, res) {
    const { image, mediaType } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'No image provided' });
    }

    const DA3_URL = process.env.DA3_SERVICE_URL || 'http://localhost:8008';

    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 3000);
        const statusRes = await fetch(`${DA3_URL}/status`, { signal: controller.signal });
        if (!statusRes.ok) throw new Error('DA3 unhealthy');
    } catch (err) {
        return res.status(503).json({
            error: 'DA3 service not reachable',
            hint: [
                'Install: pip install depth-anything-3',
                'Start: da3 backend --model-dir depth-anything/DA3NESTED-GIANT-LARGE-1.1 --port 8008',
                'License: CC BY-NC 4.0 (non-commercial only)',
            ].join('\n'),
        });
    }

    try {
        const imgBuffer = Buffer.from(image, 'base64');
        const boundary = `----NLFBoundary${Date.now()}`;
        const parts = [
            `--${boundary}\r\n`,
            `Content-Disposition: form-data; name="image"; filename="farm.jpg"\r\n`,
            `Content-Type: ${mediaType || 'image/jpeg'}\r\n\r\n`,
        ];
        const partsAfter = [
            `\r\n--${boundary}\r\n`,
            `Content-Disposition: form-data; name="export_format"\r\n\r\nglb`,
            `\r\n--${boundary}--\r\n`,
        ];
        const preamble = Buffer.from(parts.join(''), 'utf8');
        const postamble = Buffer.from(partsAfter.join(''), 'utf8');
        const body = Buffer.concat([preamble, imgBuffer, postamble]);

        const controller = new AbortController();
        setTimeout(() => controller.abort(), 90000);

        const inferRes = await fetch(`${DA3_URL}/infer`, {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': body.length.toString(),
            },
            body,
            signal: controller.signal,
        });

        if (!inferRes.ok) {
            const txt = await inferRes.text();
            throw new Error(`DA3 inference failed: ${inferRes.status} — ${txt}`);
        }

        const arrayBuf = await inferRes.arrayBuffer();
        const glbBuffer = Buffer.from(arrayBuf);

        res.set({
            'Content-Type': 'model/gltf-binary',
            'Content-Disposition': 'inline; filename="farm_3d.glb"',
            'Content-Length': glbBuffer.length,
        });

        return res.send(glbBuffer);
    } catch (err) {
        console.error('[farmController] generate3D error:', err.message);
        return res.status(500).json({ error: err.message });
    }
}

// ─────────────────────────────────────────────────────────────
// Create Farm
// ─────────────────────────────────────────────────────────────
async function createFarm(req, res) {
    const {
        name, location, rackType, plants, targetPlant, analysisGoal, viewMode,
        photoPreview, description, fieldId, deviceId, serial, packageLevel,
        goalPriority, thresholds, thresholdSource, thresholdNotes, zoneId,
        accountMode, farmId, farmSize, zones, commercialDevices, farmMaster,
        commercialStructure, rackTypeId, rackLabel, rackConfig, plantSlots,
    } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Farm name required' });
    }

    // ✨ 这里的 req.user.userId 是从 Middleware 解析出来的
    const currentUserId = req.user.userId;

    const farmDoc = {
        name: name.trim(),
        location: location || '',
        description: description || '',
        farmId: farmId || null,
        accountMode: accountMode || 'beginner',
        farmSize: farmSize || '',
        fieldId: fieldId || null,
        zoneId: zoneId || null,
        zones: Array.isArray(zones) ? zones : [],
        commercialDevices: Array.isArray(commercialDevices) ? commercialDevices : [],
        farmMaster: farmMaster || null,
        commercialStructure: commercialStructure || null,
        rackType: rackType || rackTypeId || '3-tier',
        rackTypeId: rackTypeId || rackType || '3-tier',
        rackLabel: rackLabel || rackConfig?.label || rackType || rackTypeId || '3-tier',
        rackConfig: rackConfig || null,
        plants: plants || [],
        plantSlots: plantSlots || (Array.isArray(plants) ? plants.reduce((sum, plant) => sum + (Number.parseInt(plant.slots || plant.count || 1, 10) || 1), 0) : 0),
        targetPlant: targetPlant || '',
        analysisGoal: analysisGoal || 'yield',
        deviceId: deviceId || null,
        serial: serial || '',
        packageLevel: packageLevel || 'standard',
        goalPriority: Array.isArray(goalPriority) ? goalPriority : [],
        thresholds: thresholds || {},
        thresholdSource: thresholdSource || '',
        thresholdNotes: thresholdNotes || '',
        viewMode: viewMode || 'realistic',
        hasPhoto: Boolean(photoPreview),
        status: 'active',
        
        ownerId: currentUserId, // <--- 【最重要的一步，绑定主人！】
        createdAt: new Date().toISOString(),
    };

    try {
        // ─── 修改了這裡！使用 .set({ merge: true }) 覆蓋/更新同一個農場 ───
        const newFarmId = farmDoc.farmId || farmDoc.fieldId || `farm_${Date.now()}`;
        await getDb().collection('farms').doc(newFarmId).set(farmDoc, { merge: true });

        return res.json({
            success: true,
            ok: true, // 保持给前端的接口兼容性
            farmId: newFarmId,
            farm: farmDoc,
        });
    } catch (err) {
        console.warn('[farmController] Firestore save skipped:', err.message);
        return res.json({
            success: true,
            ok: true,
            farmId: `local_${Date.now()}`,
            farm: farmDoc,
        });
    }
}

// ─────────────────────────────────────────────────────────────
// 获取属于当前用户的 Farm
// ─────────────────────────────────────────────────────────────
async function getFarms(req, res) {
    try {
        const currentUserId = req.user.userId;
        const snapshot = await getDb().collection('farms').where('ownerId', '==', currentUserId).get();
        
        const farms = [];
        snapshot.forEach(doc => farms.push({ id: doc.id, ...doc.data() }));

        res.status(200).json({ ok: true, farms });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
}

module.exports = {
    scanPlants,
    analyzeDisease,
    generate3D,
    createFarm,
    getFarms // 导出 getFarms 给 routes 用
};
