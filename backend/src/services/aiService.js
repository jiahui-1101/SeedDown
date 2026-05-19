const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GROQ_TEXT_MODEL = process.env.GROQ_TEXT_MODEL || 'llama-3.1-8b-instant';
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct';

function providerOrder() {
  return [
    { name: 'groq',   key: process.env.GROQ_API_KEY },
    { name: 'gemini', key: process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY },
  ].filter(p => Boolean(p.key));
}

function hasAIKey() { return providerOrder().length > 0; }

async function askText(system, userMsg, maxTokens = 1024) {
  const messages = [
    { role: 'system', content: system || 'You are a helpful agricultural AI for SeedDown.' },
    { role: 'user',   content: userMsg },
  ];
  return runTextMessages(messages, maxTokens);
}

async function runTextMessages(messages, maxTokens = 1024) {
  const providers = providerOrder();
  if (!providers.length) throw new Error('No GROQ_API_KEY, GEMINI_API_KEY_2, or GEMINI_API_KEY configured');
  const errors = [];
  for (const p of providers) {
    try {
      if (p.name === 'groq')   return await groqText(p.key, messages, maxTokens);
      if (p.name === 'gemini') return await geminiText(p.key, messages, maxTokens);
    } catch (err) { errors.push(`${p.name}: ${err.message}`); }
  }
  throw new Error(`All AI providers failed: ${errors.join(' | ')}`);
}

async function runVisionPrompt({ image, mediaType = 'image/jpeg', prompt, maxTokens = 1024 }) {
  const providers = providerOrder();
  if (!providers.length) throw new Error('No GROQ_API_KEY, GEMINI_API_KEY_2, or GEMINI_API_KEY configured');
  const errors = [];
  for (const p of providers) {
    try {
      if (p.name === 'groq')   return await groqVision(p.key, { image, mediaType, prompt, maxTokens });
      if (p.name === 'gemini') return await geminiVision(p.key, { image, mediaType, prompt, maxTokens });
    } catch (err) { errors.push(`${p.name}: ${err.message}`); }
  }
  throw new Error(`All vision providers failed: ${errors.join(' | ')}`);
}

async function groqText(apiKey, messages, maxTokens) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: GROQ_TEXT_MODEL, max_tokens: maxTokens, temperature: 0.35, messages }),
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
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: GROQ_VISION_MODEL,
      max_tokens: maxTokens,
      temperature: 0.2,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:${mediaType || 'image/jpeg'};base64,${image}` } },
        ],
      }],
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
  const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
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
      contents: [{
        role: 'user',
        parts: [
          { inline_data: { mime_type: mediaType || 'image/jpeg', data: image } },
          { text: prompt },
        ],
      }],
      generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens, responseMimeType: 'application/json' },
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
  return data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n').trim();
}

/* ─────────────────────────── Plant Recognition ─────────────────────────── */

async function analyzePlantImage({ image, mediaType, targetPlant }) {
  const rawText = await runVisionPrompt({
    image, mediaType,
    prompt: plantRecognitionPrompt(targetPlant),
    maxTokens: 900,
  });
  return parsePlantRecognition(rawText);
}

/* ─────────────────────────── Disease Analysis ─────────────────────────── */

async function analyzePlantDisease({ image, mediaType, plantName, plantSpecies, farmContext = {}, answers = {} }) {
  const hasImage  = Boolean(image && image.trim() !== '');
  const hasRefine = Object.keys(answers).length > 0;
  const prompt    = plantDiseasePrompt({ plantName, plantSpecies, farmContext, answers, hasImage, hasRefine });

  let rawText;
  if (hasImage) {
    rawText = await runVisionPrompt({ image, mediaType, prompt, maxTokens: 1400 });
  } else {
    const sys = "You are SeedDown's commercial vertical farming plant health analyst. Respond ONLY with valid JSON — no markdown, no preamble.";
    const usr = `[NO IMAGE PROVIDED — DIAGNOSE STRICTLY FROM CONTEXT & SYMPTOMS ONLY]\n\n${prompt}`;
    rawText = await askText(sys, usr, 1400);
  }

  return parseDiseaseAnalysis(rawText, plantName, !hasImage, hasRefine, answers);
}

function plantDiseasePrompt({ plantName, plantSpecies, farmContext, answers, hasImage, hasRefine }) {
  const ctx = JSON.stringify({ plantName, plantSpecies, farmContext }, null, 2);
  const answersBlock = Object.keys(answers).length
    ? `\nUser answers to follow-up questions:\n${JSON.stringify(answers, null, 2)}`
    : '';

  const noImageWarning = hasImage ? '' : `
IMPORTANT — NO IMAGE MODE:
  - Set "confidence" to at most 0.65 (hard ceiling; this is non-negotiable).
  - Set "needsMoreInfo" to true.
  - Provide at least 3 targeted follow-up questions for the grower to inspect manually.
  - Base ALL evidence on farmContext and symptoms text only.`;

  const refineBoost = hasRefine ? `
IMPORTANT — REFINEMENT MODE:
  - The user has answered your follow-up questions (see answers block above).
  - Use these answers to significantly narrow the diagnosis.
  - You MAY raise confidence above your previous estimate if answers are conclusive.
  - Reduce followUpQuestions to an empty array [] if confidence is now >= 0.80.` : '';

  return `You are SeedDown's commercial vertical farming plant health analyst.
Perform a clinical diagnostic assessment for a commercial grower.

Known context:
${ctx}${answersBlock}
${noImageWarning}${refineBoost}

Return ONLY valid JSON, no markdown fences, no preamble:
{
  "plant": "Plant name",
  "condition": "Most specific disease or stress condition you can determine",
  "severity": "low | medium | high | unknown",
  "confidence": 0.55,
  "confidenceExplanation": "1-2 sentences: why this score was chosen and what would raise it",
  "evidence": ["concrete symptom or clue observed"],
  "likelyCauses": ["pathogen, environmental or cultural cause"],
  "solutions": ["specific actionable treatment step"],
  "prevention": ["specific future prevention measure"],
  "treatmentDuration": "e.g. '5-7 days' or '2-3 weeks'",
  "needsMoreInfo": true,
  "followUpQuestions": []
}

Confidence scoring guide:
- Image provided, clear unambiguous symptoms         → 0.80-0.95
- Image provided, ambiguous or early-stage symptoms  → 0.55-0.79
- No image, rich symptoms/context text provided      → 0.45-0.65 (HARD MAX 0.65)
- No image, sparse context                           → 0.25-0.44
- Any "suspected"/"possibly"/"likely" in condition   → cap at 0.75

Keep advice practical for indoor vertical farming. Return raw JSON only.`;
}

/* ═══════════════════════════════════════════════════════════════
   HYBRID CONFIDENCE ENGINE
   Step 1 — Clamp AI raw score
   Step 2 — Rule-based corrections (deterministic guardrails)
   Step 3 — Derive needsMoreInfo + questions
═══════════════════════════════════════════════════════════════ */
function parseDiseaseAnalysis(rawText, fallbackPlant = 'Plant', isNoImage = false, isRefine = false, answers = {}) {
  const parsed = JSON.parse(stripJson(rawText, '{}'));

  /* Step 1 — Clamp raw AI score */
  let confidence = Math.min(1, Math.max(0, parseFloat(parsed.confidence) || 0));

  /* Step 2 — Rule-based corrections */

  // Rule A — No-image hard ceiling at 69% (< 70% as requested)
  // Without visual confirmation we can never be fully certain.
  if (isNoImage) {
    confidence = Math.min(confidence, 0.69);
  }

  // Rule B — Hedged/vague condition language: cap at 75%
  const condLower = String(parsed.condition || '').toLowerCase();
  const vague = condLower.includes('suspected') || condLower.includes('possibly') ||
                condLower.includes('likely')    || condLower.includes('potential');
  if (vague) {
    confidence = Math.min(confidence, 0.75);
  }

  // Rule C — Model says needsMoreInfo but gave a high score (self-contradiction)
  if (parsed.needsMoreInfo === true && confidence >= 0.80) {
    confidence = 0.79;
  }

  // Rule D — Refine bonus: user provided answers → +0.18, capped at 0.96
  // This ensures a successful refine almost always crosses 0.80 to unlock IoT.
  if (isRefine && Object.keys(answers).length > 0) {
    confidence = Math.min(0.96, confidence + 0.18);
  }

  /* Step 3 — Derive status */
  const needsMoreInfo = confidence < 0.80 || isNoImage;

  let finalQuestions = sanitizeStringList(parsed.followUpQuestions).slice(0, 4);

  // Fallback: if the model returned an empty question array but we still need more info
  if (needsMoreInfo && finalQuestions.length === 0) {
    if (isNoImage) {
      finalQuestions.push('Could you please provide a clear photo of the affected leaves or stems?');
    }
    finalQuestions.push(
      'Do the affected spots eventually dry out, become brittle, and crack to form small holes (shot-hole effect)?',
      'Do the spots feature concentric rings on their surface (similar to tree rings)?',
      'Did symptoms first appear on older bottom leaves, or throughout the whole plant including new growth?'
    );
  }

  // Build explanation if model did not provide one
  let confidenceExplanation = parsed.confidenceExplanation || '';
  if (!confidenceExplanation) {
    if (isNoImage) {
      confidenceExplanation = 'Diagnosis based on symptoms and context only — no image available. Uploading a photo would significantly raise confidence.';
    } else if (confidence >= 0.80) {
      confidenceExplanation = 'Visual symptoms are clear and consistent with the diagnosed condition.';
    } else {
      confidenceExplanation = 'Symptom clarity or image quality was insufficient for a definitive diagnosis. Answer the follow-up questions to refine the result.';
    }
  }

  return {
    plant:                parsed.plant || fallbackPlant || 'Plant',
    condition:            parsed.condition || 'Unable to confirm plant disease from available data',
    severity:             ['low', 'medium', 'high', 'unknown'].includes(parsed.severity) ? parsed.severity : 'unknown',
    confidence,
    confidenceExplanation,
    evidence:             sanitizeStringList(parsed.evidence),
    likelyCauses:         sanitizeStringList(parsed.likelyCauses),
    solutions:            sanitizeStringList(parsed.solutions),
    prevention:           sanitizeStringList(parsed.prevention),
    treatmentDuration:    parsed.treatmentDuration || 'Undetermined',
    needsMoreInfo,
    followUpQuestions:    finalQuestions,
    _meta: {
      isNoImage,
      isRefine,
      rulesApplied: [
        isNoImage                            ? 'A:no-image-cap≤0.69' : null,
        vague                                ? 'B:vague-language-cap≤0.75' : null,
        parsed.needsMoreInfo                 ? 'C:model-self-doubt-cap≤0.79' : null,
        (isRefine && Object.keys(answers).length) ? 'D:refine-bonus+0.18' : null,
      ].filter(Boolean),
    },
  };
}

/* ──────────────────────── Chat & Forecast ──────────────────────── */

async function chatWithAdvisor(messages, gardenState) {
  const system = `You are Sprout, the AI garden advisor for SeedDown.
Help with crop care, harvest timing, recipes, sensor readings, and vertical farming.
Be friendly, concise, and practical. Use 2-3 sentences.
Current garden: ${JSON.stringify(gardenState)}`;

  const normalized = [
    { role: 'system', content: system },
    ...messages.map(m => ({
      role:    m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content || m.message || '',
    })),
  ];

  return runTextMessages(normalized, 512);
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
- Matched recipes: ${recipes.slice(0, 3).map(r => r.name).join(', ')}

Return exactly:
{"summary":"2 sentences","estimatedYieldGrams":0,"harvestDate":"YYYY-MM-DD","confidence":"medium","tips":["tip1","tip2"]}`;

  const text = await askText('Respond only with valid JSON, no markdown.', prompt, 512);
  try   { return JSON.parse(stripJson(text)); }
  catch { return { error: 'Parse failed', raw: text }; }
}

/* ──────────────────────── Shared Utilities ──────────────────────── */

function stripJson(rawText, fallback = '{}') {
  const cleaned = String(rawText || fallback).replace(/```json/g, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end   = cleaned.lastIndexOf('}');
  return start >= 0 && end >= start ? cleaned.slice(start, end + 1) : fallback;
}

function sanitizeStringList(list) {
  return Array.isArray(list)
    ? list.map(item => String(item || '').trim()).filter(Boolean).slice(0, 6)
    : [];
}

function sanitizePlants(plants) {
  return plants.map(p => ({
    name:       p.name || 'Unknown Plant',
    emoji:      p.emoji || emojiForPlant(p.name),
    species:    (p.species || p.name || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''),
    confidence: Math.min(1, Math.max(0, parseFloat(p.confidence) || 0)),
    slots:      Math.max(1, Math.min(50, parseInt(p.slots, 10) || 3)),
  }));
}

function emojiForPlant(name = '') {
  const k = String(name).toLowerCase();
  if (k.includes('lettuce') || k.includes('cabbage') || k.includes('kale')) return '🥬';
  if (k.includes('tomato'))    return '🍅';
  if (k.includes('chili') || k.includes('pepper')) return '🌶️';
  if (k.includes('strawberry')) return '🍓';
  if (k.includes('cucumber'))   return '🥒';
  if (k.includes('carrot'))     return '🥕';
  if (k.includes('bean'))       return '🫘';
  if (k.includes('pea'))        return '🟢';
  if (k.includes('basil') || k.includes('mint') || k.includes('spinach') ||
      k.includes('cilantro')  || k.includes('parsley')) return '🌿';
  return '🌱';
}

/* ──────────────────────── Plant Recognition ──────────────────────── */

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
  parsed.plants    = sanitizePlants(parsed.plants || []);
  parsed.structure = sanitizeStructure(parsed.structure || parsed.rack || parsed.layout);
  return parsed;
}

function sanitizeStructure(structure = {}) {
  const allowed  = new Set(['2-tier','3-tier','4-tier','5-tier','wall','a-frame','nft-channel','hanging']);
  const rawType  = String(structure.rackType || structure.type || structure.id || '').toLowerCase();
  const rackType = allowed.has(rawType) ? rawType : inferRackType(structure);
  return {
    rackType,
    label:        structure.label || labelRackType(rackType),
    tiers:        Math.max(1, Math.min(8,  parseInt(structure.tiers        || structure.tierCount, 10) || defaultTiers(rackType))),
    slotsPerTier: Math.max(1, Math.min(12, parseInt(structure.slotsPerTier || structure.columns,   10) || defaultSlotsPerTier(rackType))),
    confidence:   Math.min(1, Math.max(0,  parseFloat(structure.confidence) || 0.45)),
  };
}

function inferRackType(s = {}) {
  const text  = `${s.label || ''} ${s.description || ''} ${s.structureType || ''}`.toLowerCase();
  const tiers = parseInt(s.tiers || s.tierCount, 10) || 0;
  if (text.includes('wall')  || text.includes('panel')   || text.includes('grid'))   return 'wall';
  if (text.includes('a-frame')|| text.includes('pyramid') || text.includes('slant'))  return 'a-frame';
  if (text.includes('nft')   || text.includes('channel') || text.includes('row'))    return 'nft-channel';
  if (text.includes('hanging')|| text.includes('column'))                             return 'hanging';
  if (tiers >= 5) return '5-tier';
  if (tiers === 4) return '4-tier';
  if (tiers === 2) return '2-tier';
  return '3-tier';
}

function defaultTiers(r)        { return {'2-tier':2,'3-tier':3,'4-tier':4,'5-tier':5,wall:4,'a-frame':4,'nft-channel':3,hanging:5}[r]||3; }
function defaultSlotsPerTier(r) { return {'2-tier':3,'3-tier':3,'4-tier':4,'5-tier':4,wall:5,'a-frame':4,'nft-channel':6,hanging:3}[r]||3; }
function labelRackType(r) {
  return {'2-tier':'2-Tier Starter Rack','3-tier':'3-Tier Vertical Rack','4-tier':'4-Tier Grow Shelf',
          '5-tier':'5-Tier Tower Rack',wall:'Wall Panel Grid','a-frame':'A-Frame Pyramid',
          'nft-channel':'NFT Channel Rows',hanging:'Hanging Column Farm'}[r]||'3-Tier Vertical Rack';
}

module.exports = { hasAIKey, askText, chatWithAdvisor, forecastYieldAndRecipes, analyzePlantImage, analyzePlantDisease };
