const FIREBASE_VERSION = '12.12.0';
const FIREBASE_APP_CDN = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`;
const FIREBASE_AI_CDN = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-ai.js`;

let modelPromise = null;

export async function scanPlantsWithFirebaseAI({ image, mediaType, targetPlant }) {
    if (!hasFirebaseAIConfig()) {
        return null;
    }

    const model = await getFirebaseAIModel();
    const result = await model.generateContent([
        {
            inlineData: {
                data: image,
                mimeType: mediaType || 'image/jpeg',
            },
        },
        { text: plantRecognitionPrompt(targetPlant) },
    ]);

    const text = typeof result.response?.text === 'function'
        ? result.response.text()
        : extractText(result.response);

    return parsePlantRecognition(text);
}

export async function scanPlantDiseaseWithFirebaseAI({ image, mediaType, plantName, plantSpecies, farmContext = {}, answers = {} }) {
    if (!hasFirebaseAIConfig()) {
        return null;
    }

    const model = await getFirebaseAIModel();
    const result = await model.generateContent([
        {
            inlineData: {
                data: image,
                mimeType: mediaType || 'image/jpeg',
            },
        },
        { text: plantDiseasePrompt({ plantName, plantSpecies, farmContext, answers }) },
    ]);

    const text = typeof result.response?.text === 'function'
        ? result.response.text()
        : extractText(result.response);

    return parseDiseaseAnalysis(text, plantName);
}

function hasFirebaseAIConfig() {
    return Boolean(
        import.meta.env.VITE_FIREBASE_API_KEY
        && import.meta.env.VITE_FIREBASE_PROJECT_ID
        && import.meta.env.VITE_FIREBASE_APP_ID
    );
}

async function getFirebaseAIModel() {
    if (modelPromise) return modelPromise;

    modelPromise = (async () => {
        const [{ initializeApp, getApps }, { getAI, getGenerativeModel, GoogleAIBackend }] = await Promise.all([
            import(/* @vite-ignore */ FIREBASE_APP_CDN),
            import(/* @vite-ignore */ FIREBASE_AI_CDN),
        ]);

        const firebaseConfig = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        };

        const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
        const ai = getAI(app, { backend: new GoogleAIBackend() });
        return getGenerativeModel(ai, {
            model: import.meta.env.VITE_FIREBASE_AI_MODEL || 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 900,
                responseMimeType: 'application/json',
            },
        });
    })();

    return modelPromise;
}

function plantDiseasePrompt({ plantName, plantSpecies, farmContext, answers }) {
    const context = JSON.stringify({ plantName, plantSpecies, farmContext, answers }, null, 2);
    return [
        'You are SeedDown\'s commercial vertical farming plant health analyst.',
        'Analyse the uploaded plant photo using the known plant context below.',
        '',
        'Known context:',
        context,
        '',
        'Return ONLY valid JSON, no markdown fences, no preamble:',
        '',
        '{',
        '  \"plant\": \"Plant name\",',
        '  \"condition\": \"Most likely disease or stress condition\",',
        '  \"severity\": \"low | medium | high | unknown\",',
        '  \"confidence\": 0.78,',
        '  \"confidenceExplanation\": \"Short explanation of why this confidence was selected\",',
        '  \"evidence\": [\"visible symptom or contextual clue\"],',
        '  \"likelyCauses\": [\"cause 1\", \"cause 2\"],',
        '  \"solutions\": [\"specific action 1\", \"specific action 2\", \"specific action 3\"],',
        '  \"prevention\": [\"future prevention step 1\", \"future prevention step 2\"],',
        '  \"needsMoreInfo\": false,',
        '  \"followUpQuestions\": []',
        '}',
        '',
        'Rules:',
        '- Use the known plant species strongly, because recognition happened earlier.',
        '- If the photo is unclear, symptoms are not visible, or multiple diseases look similar, set confidence below 0.55, needsMoreInfo true, and ask 3 concise follow-up questions.',
        '- If it looks like environmental stress instead of infection, say so clearly.',
        '- Do not claim certainty. Keep recommendations practical for indoor vertical farming.',
        '- confidence must be from 0.0 to 1.0.',
        '- return raw JSON only.',
    ].join('\n');
}

function plantRecognitionPrompt(targetPlant) {
    const hint = targetPlant
        ? `\nUser says the intended plant is: ${targetPlant}. Use this as a hint, but only return it if it matches the photo or the photo is unclear.`
        : '';

    return `
You are a vertical farm expert. Analyse this indoor/vertical farm photo.${hint}

Identify every plant species you can see and estimate how many slots/pots each occupies.

Return ONLY valid JSON, no markdown fences, no preamble:

{
  "plants": [
    {
      "name": "Common Name",
      "emoji": "🥬",
      "species": "species_slug",
      "confidence": 0.92,
      "slots": 4
    }
  ]
}

Rules:
- confidence: 0.0-1.0
- slots: integer, estimated pot/slot count for this species visible
- species: lowercase, underscores for spaces
- use realistic vegetable / herb emojis
- if photo is unclear but the target plant hint is useful, return one plant using the hint with lower confidence
- if no plants are visible and no hint is useful, return {"plants":[]}
- do NOT wrap in markdown
- return raw JSON only
`;
}

function extractText(response) {
    return response?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('\n') || '{"plants":[]}';
}

function parseDiseaseAnalysis(rawText, fallbackPlant = 'Plant') {
    const cleaned = String(rawText || '{}')
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    const jsonText = start >= 0 && end >= start ? cleaned.slice(start, end + 1) : '{}';
    const parsed = JSON.parse(jsonText);
    const confidence = Math.min(1, Math.max(0, parseFloat(parsed.confidence) || 0));
    return {
        plant: parsed.plant || fallbackPlant || 'Plant',
        condition: parsed.condition || 'Unable to confirm plant disease from this image',
        severity: ['low', 'medium', 'high', 'unknown'].includes(parsed.severity) ? parsed.severity : 'unknown',
        confidence,
        confidenceExplanation: parsed.confidenceExplanation || 'Confidence is based on image clarity, visible symptoms, and match with the known plant profile.',
        evidence: sanitizeStringList(parsed.evidence),
        likelyCauses: sanitizeStringList(parsed.likelyCauses),
        solutions: sanitizeStringList(parsed.solutions),
        prevention: sanitizeStringList(parsed.prevention),
        needsMoreInfo: Boolean(parsed.needsMoreInfo) || confidence < 0.55,
        followUpQuestions: sanitizeStringList(parsed.followUpQuestions).slice(0, 4),
    };
}

function sanitizeStringList(list) {
    return Array.isArray(list)
        ? list.map(item => String(item || '').trim()).filter(Boolean).slice(0, 6)
        : [];
}

function parsePlantRecognition(rawText) {
    const cleaned = String(rawText || '{"plants":[]}')
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    const jsonText = start >= 0 && end >= start ? cleaned.slice(start, end + 1) : '{"plants":[]}';
    const parsed = JSON.parse(jsonText);
    parsed.plants = sanitizePlants(parsed.plants || []);
    return parsed;
}

function sanitizePlants(plants) {
    return plants.map((plant) => ({
        name: plant.name || 'Unknown Plant',
        emoji: plant.emoji || emojiForPlant(plant.name),
        species: (plant.species || plant.name || 'unknown')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, ''),
        confidence: Math.min(1, Math.max(0, parseFloat(plant.confidence) || 0)),
        slots: Math.max(1, Math.min(50, parseInt(plant.slots, 10) || 3)),
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
