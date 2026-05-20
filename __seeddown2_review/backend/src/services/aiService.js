const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GROQ_TEXT_MODEL = process.env.GROQ_TEXT_MODEL || 'llama-3.1-8b-instant';
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';

function providerOrder() {
  return [
    { name: 'groq', key: process.env.GROQ_API_KEY },
    { name: 'gemini', key: process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY },
  ].filter(provider => Boolean(provider.key));
}

function hasAIKey() {
  return providerOrder().length > 0;
}

async function askText(system, userMsg, maxTokens = 1024) {
  const messages = [
    { role: 'system', content: system || 'You are a helpful agricultural AI for SeedDown.' },
    { role: 'user', content: userMsg },
  ];
  return runTextMessages(messages, maxTokens);
}

async function runTextMessages(messages, maxTokens = 1024) {
  const providers = providerOrder();
  if (!providers.length) throw new Error('No GROQ_API_KEY, GEMINI_API_KEY_2, or GEMINI_API_KEY configured');

  const errors = [];
  for (const provider of providers) {
    try {
      if (provider.name === 'groq') return await groqText(provider.key, messages, maxTokens);
      if (provider.name === 'gemini') return await geminiText(provider.key, messages, maxTokens);
    } catch (error) {
      errors.push(`${provider.name}: ${error.message}`);
    }
  }
  throw new Error(`All AI providers failed: ${errors.join(' | ')}`);
}

async function runVisionPrompt({ image, mediaType = 'image/jpeg', prompt, maxTokens = 1024 }) {
  const providers = providerOrder();
  if (!providers.length) throw new Error('No GROQ_API_KEY, GEMINI_API_KEY_2, or GEMINI_API_KEY configured');

  const errors = [];
  for (const provider of providers) {
    try {
      if (provider.name === 'groq') return await groqVision(provider.key, { image, mediaType, prompt, maxTokens });
      if (provider.name === 'gemini') return await geminiVision(provider.key, { image, mediaType, prompt, maxTokens });
    } catch (error) {
      errors.push(`${provider.name}: ${error.message}`);
    }
  }
  throw new Error(`All vision providers failed: ${errors.join(' | ')}`);
}

async function groqText(apiKey, messages, maxTokens) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_TEXT_MODEL,
      max_tokens: maxTokens,
      temperature: 0.35,
      messages,
    }),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error?.message || `Groq API error ${response.status}`);
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('No text from Groq');
  return text;
}

async function groqVision(apiKey, { image, mediaType, prompt, maxTokens }) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_VISION_MODEL,
      max_tokens: maxTokens,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mediaType || 'image/jpeg'};base64,${image}` } },
          ],
        },
      ],
    }),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error?.message || `Groq vision API error ${response.status}`);
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('No vision text from Groq');
  return text;
}

async function geminiText(apiKey, messages, maxTokens) {
  const url = geminiUrl(apiKey);
  const text = messages.map(message => `${message.role.toUpperCase()}: ${message.content}`).join('\n\n');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: { temperature: 0.35, maxOutputTokens: maxTokens },
    }),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error?.message || `Gemini API error ${response.status}`);
  const output = safeGeminiText(data);
  if (!output) throw new Error('No text from Gemini');
  return output;
}

async function geminiVision(apiKey, { image, mediaType, prompt, maxTokens }) {
  const response = await fetch(geminiUrl(apiKey), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { inline_data: { mime_type: mediaType || 'image/jpeg', data: image } },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: maxTokens,
        responseMimeType: 'application/json',
      },
    }),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error?.message || `Gemini vision API error ${response.status}`);
  const output = safeGeminiText(data);
  if (!output) throw new Error('No vision text from Gemini');
  return output;
}

function geminiUrl(apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
}

function safeGeminiText(data) {
  return data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('\n').trim();
}

async function analyzePlantImage({ image, mediaType, targetPlant }) {
  const rawText = await runVisionPrompt({
    image,
    mediaType,
    prompt: plantRecognitionPrompt(targetPlant),
    maxTokens: 900,
  });
  return parsePlantRecognition(rawText);
}

async function chatWithAdvisor(messages, gardenState, mode = 'beginner') {
  const system = mode === 'commercial'
    ? `You are SeedDown's commercial vertical farming operations AI.
You are embedded inside a professional Farm Command Center dashboard used by farm managers and agronomists.
Your role: deliver precise, data-driven insights on yield optimisation, zone-level sensor anomalies, energy efficiency, ROI, disease risk, and crop scheduling.
Be direct and technical. Prioritise actionable recommendations. Use concise bullet points or short paragraphs. Avoid casual tone.
Do not explain basic concepts unless asked. Assume the user understands farming terminology.
Current farm state: ${JSON.stringify(gardenState)}`
    : `You are Sprout, the friendly AI garden advisor for SeedDown.
You help home growers and beginners with crop care, watering schedules, harvest timing, recipe ideas, and reading their sensor data.
Be warm, encouraging, and easy to understand. Avoid jargon. Use simple language and 2-3 short sentences per reply.
Celebrate small wins and keep the user motivated. If something is wrong, explain it gently and tell them exactly what to do.
Current garden: ${JSON.stringify(gardenState)}`;

  const normalized = [
    { role: 'system', content: system },
    ...messages.map(message => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content || message.message || '',
    })),
  ];

  return runTextMessages(normalized, mode === 'commercial' ? 768 : 512);
}

async function forecastYieldAndRecipes(plantedCrop, cropSpec, recipes, days) {
  const prompt = `You are an agricultural AI for SeedDown indoor garden.
Respond ONLY with valid JSON, no markdown.

Forecast harvest:
- Species: ${plantedCrop.species}
- Plants: ${plantedCrop.quantity}
- Forecast: ${days} days
- Growth cycle: ${cropSpec.requirements?.growthDays} days
- Yield per plant: ${cropSpec.yield?.avgGramsPerPlant}g
- Matched recipes: ${recipes.slice(0, 3).map(recipe => recipe.name).join(', ')}

Return exactly:
{"summary":"2 sentences","estimatedYieldGrams":0,"harvestDate":"YYYY-MM-DD","confidence":"medium","tips":["tip1","tip2"]}`;

  const text = await askText('Respond only with valid JSON, no markdown.', prompt, 512);
  try {
    return JSON.parse(stripJson(text));
  } catch {
    return { error: 'Parse failed', raw: text };
  }
}

function plantRecognitionPrompt(targetPlant) {
  const hint = targetPlant
    ? `\nUser says the intended plant is: ${targetPlant}. Use this as a hint, but only return it if it matches the photo or the photo is unclear.`
    : '';

  return `You are a vertical farm expert. Analyse this indoor or vertical farm photo.${hint}

Identify every plant species you can see, estimate how many slots or pots each occupies, and recognise the visible vertical farming structure.

Return ONLY valid JSON, no markdown fences, no preamble:

{
  "structure": {
    "rackType": "2-tier | 3-tier | 4-tier | 5-tier | wall | a-frame | nft-channel | hanging",
    "label": "short structure name",
    "tiers": 3,
    "slotsPerTier": 3,
    "confidence": 0.82
  },
  "plants": [
    {
      "name": "Common Name",
      "emoji": "plant emoji",
      "species": "species_slug",
      "confidence": 0.92,
      "slots": 4
    }
  ]
}

Rules:
- confidence: 0.0-1.0
- slots: integer, estimated pot or slot count for this species visible
- rackType must be one of the listed values; choose the closest match from visual structure
- tiers and slotsPerTier should match the visible rack/tower/channel when possible
- species: lowercase, underscores for spaces
- use realistic vegetable or herb emojis
- if photo is unclear but the target plant hint is useful, return one plant using the hint with lower confidence
- if no plants are visible and no hint is useful, still return structure if visible, with "plants":[]
- return raw JSON only`;
}

function parsePlantRecognition(rawText) {
  const parsed = JSON.parse(stripJson(rawText, '{"plants":[]}'));
  parsed.plants = sanitizePlants(parsed.plants || []);
  parsed.structure = sanitizeStructure(parsed.structure || parsed.rack || parsed.layout);
  return parsed;
}

function sanitizeStructure(structure = {}) {
  const allowed = new Set(['2-tier', '3-tier', '4-tier', '5-tier', 'wall', 'a-frame', 'nft-channel', 'hanging']);
  const rawType = String(structure.rackType || structure.type || structure.id || '').toLowerCase();
  const rackType = allowed.has(rawType) ? rawType : inferRackType(structure);
  return {
    rackType,
    label: structure.label || labelRackType(rackType),
    tiers: Math.max(1, Math.min(8, parseInt(structure.tiers || structure.tierCount, 10) || defaultTiers(rackType))),
    slotsPerTier: Math.max(1, Math.min(12, parseInt(structure.slotsPerTier || structure.columns, 10) || defaultSlotsPerTier(rackType))),
    confidence: Math.min(1, Math.max(0, parseFloat(structure.confidence) || 0.45)),
  };
}

function inferRackType(structure = {}) {
  const text = `${structure.label || ''} ${structure.description || ''} ${structure.structureType || ''}`.toLowerCase();
  const tiers = parseInt(structure.tiers || structure.tierCount, 10) || 0;
  const slots = parseInt(structure.slotsPerTier || structure.columns, 10) || 0;

  if (text.includes('wall') || text.includes('panel') || text.includes('grid')) return 'wall';
  if (text.includes('a-frame') || text.includes('pyramid') || text.includes('slant')) return 'a-frame';
  if (text.includes('nft') || text.includes('channel') || text.includes('row')) return 'nft-channel';
  if (text.includes('hanging') || text.includes('column')) return 'hanging';
  if (tiers >= 5) return '5-tier';
  if (tiers === 4 && slots >= 5) return 'wall';
  if (tiers === 4) return '4-tier';
  if (tiers === 2) return '2-tier';
  return '3-tier';
}

function defaultTiers(rackType) {
  return {
    '2-tier': 2,
    '3-tier': 3,
    '4-tier': 4,
    '5-tier': 5,
    wall: 4,
    'a-frame': 4,
    'nft-channel': 3,
    hanging: 5,
  }[rackType] || 3;
}

function defaultSlotsPerTier(rackType) {
  return {
    '2-tier': 3,
    '3-tier': 3,
    '4-tier': 4,
    '5-tier': 4,
    wall: 5,
    'a-frame': 4,
    'nft-channel': 6,
    hanging: 3,
  }[rackType] || 3;
}

function labelRackType(rackType) {
  return {
    '2-tier': '2-Tier Starter Rack',
    '3-tier': '3-Tier Vertical Rack',
    '4-tier': '4-Tier Grow Shelf',
    '5-tier': '5-Tier Tower Rack',
    wall: 'Wall Panel Grid',
    'a-frame': 'A-Frame Pyramid',
    'nft-channel': 'NFT Channel Rows',
    hanging: 'Hanging Column Farm',
  }[rackType] || '3-Tier Vertical Rack';
}

async function analyzePlantDisease({ image, mediaType, plantName, plantSpecies, farmContext = {}, answers = {} }) {
  const prompt = plantDiseasePrompt({ plantName, plantSpecies, farmContext, answers });

  let rawText;

  if (image && image.trim() !== '') {
    rawText = await runVisionPrompt({
      image,
      mediaType,
      prompt,
      maxTokens: 1200,
    });
  } else {
    const noImageSystemPrompt = "You are SeedDown's commercial vertical farming plant health analyst. Respond ONLY with valid JSON, no markdown.";
    const noImageUserMsg = `[NO IMAGE PROVIDED BY USER - DIAGNOSE BASED ON CONTEXT ONLY]\n\n${prompt}`;

    rawText = await askText(noImageSystemPrompt, noImageUserMsg, 1200);
  }

  return parseDiseaseAnalysis(rawText, plantName, !image);
}

function plantDiseasePrompt({ plantName, plantSpecies, farmContext, answers }) {
  const context = JSON.stringify({ plantName, plantSpecies, farmContext, answers }, null, 2);
  return `Analyse the plant health state using the known plant context below. 
If an image is available (queried via vision), inspect it. If NO image is provided, base your entire clinical judgment on the symptoms text and farm context parameters.

Known context:
${context}

Return ONLY valid JSON, no markdown fences, no preamble:
{
  "plant": "Plant name",
  "condition": "Most likely disease or stress condition",
  "severity": "low | medium | high | unknown",
  "confidence": 0.55,
  "confidenceExplanation": "Short explanation of why this confidence was selected",
  "evidence": ["visible symptom or contextual clue"],
  "likelyCauses": ["cause 1", "cause 2"],
  "solutions": ["specific action 1", "specific action 2", "specific action 3"],
  "prevention": ["future prevention step 1", "future prevention step 2"],
  "treatmentDuration": "Estimated time needed to cure (e.g., '5-7 days')",
  "needsMoreInfo": true,
  "followUpQuestions": []
}

Rules:
- If NO image is provided, your max confidence should not exceed 0.65 because you cannot visually confirm symptoms. Set needsMoreInfo to true and provide follow-up questions to help the user inspect the plant manually.
- Do not claim certainty. Keep recommendations practical for indoor vertical farming.
- return raw JSON only.`;
}

function parseDiseaseAnalysis(rawText, fallbackPlant = 'Plant', isNoImage = false) {
  const parsed = JSON.parse(stripJson(rawText, '{}'));
  let confidence = Math.min(1, Math.max(0, parseFloat(parsed.confidence) || 0));
  
  // No-image mode is capped because symptoms cannot be visually confirmed.
  if (isNoImage && confidence > 0.65) {
    confidence = 0.65;
  }

  // Ask follow-up questions when confidence is low or no image was provided.
  const needsMoreInfo = Boolean(parsed.needsMoreInfo) || confidence < 0.80 || isNoImage;

  // Use model questions first, then fill gaps with practical checks.
  let finalQuestions = sanitizeStringList(parsed.followUpQuestions).slice(0, 4);

  if (needsMoreInfo && finalQuestions.length === 0) {
    if (isNoImage) {
      finalQuestions.push("Could you please provide a photo of the affected area?");
    }

    finalQuestions.push(
      "Observe closely: do the spots eventually dry out, become brittle, and easily crack to form small holes (shot-holes)?",
      "Do the spots feature concentric rings on their surface, similar to the rings of a tree?",
      "Did these symptoms first appear on the older leaves at the bottom of the plant, or did they appear all over the plant (including new leaves and fruits) at the same time?"
    );
  }

  return {
    plant: parsed.plant || fallbackPlant || 'Plant',
    condition: parsed.condition || 'Unable to confirm plant disease from this image',
    severity: ['low', 'medium', 'high', 'unknown'].includes(parsed.severity) ? parsed.severity : 'unknown',
    confidence,
    confidenceExplanation: parsed.confidenceExplanation || (isNoImage ? 'Diagnosis made without image analysis; purely based on parameters.' : 'Confidence check.'),
    evidence: sanitizeStringList(parsed.evidence),
    likelyCauses: sanitizeStringList(parsed.likelyCauses),
    solutions: sanitizeStringList(parsed.solutions),
    prevention: sanitizeStringList(parsed.prevention),
    treatmentDuration: parsed.treatmentDuration || 'Undetermined duration',
    needsMoreInfo,
    followUpQuestions: finalQuestions,
  };
}

function stripJson(rawText, fallback = '{}') {
  const cleaned = String(rawText || fallback).replace(/```json/g, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  return start >= 0 && end >= start ? cleaned.slice(start, end + 1) : fallback;
}

function sanitizePlants(plants) {
  return plants.map(plant => ({
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

function sanitizeStringList(list) {
  return Array.isArray(list)
    ? list.map(item => String(item || '').trim()).filter(Boolean).slice(0, 6)
    : [];
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

module.exports = {
  hasAIKey,
  askText,
  chatWithAdvisor,
  forecastYieldAndRecipes,
  analyzePlantImage,
  analyzePlantDisease,
};
