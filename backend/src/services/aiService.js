function hasAIKey() {
  return Boolean(
    process.env.GROQ_API_KEY ||
    process.env.GEMINI_API_KEY_2 ||
    process.env.GEMINI_API_KEY
  );
}

function stripJson(raw = '', open = '{') {
  const close = open === '[' ? ']' : '}';
  const clean = String(raw || '').replace(/```json|```/g, '').trim();
  const start = clean.indexOf(open);
  const end = clean.lastIndexOf(close);
  if (start >= 0 && end > start) return clean.slice(start, end + 1);
  return clean;
}

function sanitizeStringList(value = []) {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 8);
}

async function askText(systemPrompt = '', userPrompt = '', maxTokens = 700) {
  if (!hasAIKey()) throw new Error('No GROQ_API_KEY, GEMINI_API_KEY_2, or GEMINI_API_KEY configured');

  const errors = [];
  if (process.env.GROQ_API_KEY) {
    try {
      return await callGroqText(systemPrompt, userPrompt, maxTokens);
    } catch (err) {
      errors.push(`Groq: ${err.message}`);
    }
  }

  const geminiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      return await callGeminiText(geminiKey, systemPrompt, userPrompt, maxTokens);
    } catch (err) {
      errors.push(`Gemini: ${err.message}`);
    }
  }

  throw new Error(`All AI providers failed: ${errors.join(' | ')}`);
}

async function callGroqText(systemPrompt, userPrompt, maxTokens) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      messages: [
        systemPrompt ? { role: 'system', content: systemPrompt } : null,
        { role: 'user', content: userPrompt },
      ].filter(Boolean),
      max_tokens: maxTokens,
      temperature: 0.35,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) throw new Error(data.error?.message || `Groq API error ${response.status}`);
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('No text from Groq');
  return text;
}

async function callGeminiText(apiKey, systemPrompt, userPrompt, maxTokens) {
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.35 },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) throw new Error(data.error?.message || `Gemini API error ${response.status}`);
  const text = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
  if (!text) throw new Error('No text from Gemini');
  return text;
}

async function runTextMessages(messages = [], maxTokens = 700) {
  const system = messages.find(message => message.role === 'system')?.content || '';
  const user = messages
    .filter(message => message.role !== 'system')
    .map(message => `${message.role === 'assistant' ? 'Assistant' : 'User'}: ${message.content}`)
    .join('\n');
  return askText(system, user, maxTokens);
}

async function runVisionPrompt({ image, mediaType = 'image/jpeg', prompt, maxTokens = 900 }) {
  if (!image) throw new Error('Image is required for vision analysis');
  const dataUrl = image.startsWith('data:')
    ? image
    : `data:${mediaType};base64,${image}`;

  if (process.env.GROQ_API_KEY) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_VISION_MODEL || 'llama-3.2-11b-vision-preview',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        }],
        max_tokens: maxTokens,
        temperature: 0.25,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) throw new Error(data.error?.message || `Groq vision API error ${response.status}`);
    const text = data.choices?.[0]?.message?.content?.trim();
    if (text) return text;
  }

  const geminiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY;
  if (!geminiKey) throw new Error('No vision AI provider configured');
  const model = process.env.GEMINI_VISION_MODEL || 'gemini-1.5-flash';
  const base64 = dataUrl.split(',').pop();
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: mediaType, data: base64 } },
        ],
      }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.25 },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) throw new Error(data.error?.message || `Gemini vision API error ${response.status}`);
  const text = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
  if (!text) throw new Error('No vision text from Gemini');
  return text;
}

async function forecastYieldAndRecipes(virtualCrop, cropSpec, recipes = [], days = 30) {
  const growDays = Number(cropSpec?.requirements?.growthDays || cropSpec?.growDays || 45);
  const quantity = Number(virtualCrop?.quantity || 1);
  const avgGrams = Number(cropSpec?.yield?.avgGramsPerPlant || 200);
  const harvests = Math.max(0, Math.floor(Number(days || 30) / Math.max(1, growDays)));
  const estimatedKg = Number(((avgGrams * quantity * Math.max(1, harvests)) / 1000).toFixed(2));
  return {
    harvests,
    estimatedKg,
    estimatedHarvestDays: growDays,
    summary: `${virtualCrop?.species || cropSpec?.species || 'Crop'} can produce about ${estimatedKg} kg in this window under stable conditions.`,
    recipeIdeas: recipes.slice(0, 5).map(recipe => recipe.name),
  };
}

function plantRecognitionPrompt(targetPlant) {
  return `Identify visible plants and vertical farm structure. Target plant: ${targetPlant || 'unknown'}.
Return only JSON with rackType, structure, and plants.`;
}

function parsePlantRecognition(rawText) {
  const parsed = JSON.parse(stripJson(rawText, '{'));
  return {
    rackType: parsed.rackType || parsed.structure?.rackType || '3-tier',
    structure: parsed.structure || {},
    plants: Array.isArray(parsed.plants) ? parsed.plants : [],
    confidence: Number(parsed.confidence || 0.7),
  };
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

/* ─────────────────────────── Disease Analysis ─────────────────────────── */

async function analyzePlantDisease({
  image,
  mediaType,
  plantName,
  plantSpecies,
  farmContext = {},
  answers = {},
}) {
  const hasImage = Boolean(image && image.trim() !== '');
  const hasRefine = Object.keys(answers).length > 0;

  const prompt = plantDiseasePrompt({
    plantName,
    plantSpecies,
    farmContext,
    answers,
    hasImage,
    hasRefine,
  });

  let rawText;

  if (hasImage) {
    rawText = await runVisionPrompt({
      image,
      mediaType,
      prompt,
      maxTokens: 1400,
    });
  } else {
    const system =
      "You are SeedDown's commercial vertical farming plant health analyst. Respond ONLY with valid JSON — no markdown, no preamble.";
    const user =
      `[NO IMAGE PROVIDED — DIAGNOSE STRICTLY FROM CONTEXT & SYMPTOMS ONLY]\n\n${prompt}`;

    rawText = await askText(system, user, 1400);
  }

  return parseDiseaseAnalysis(
    rawText,
    plantName,
    !hasImage,
    hasRefine,
    answers
  );
}

function plantDiseasePrompt({
  plantName,
  plantSpecies,
  farmContext,
  answers,
  hasImage,
  hasRefine,
}) {
  const ctx = JSON.stringify(
    { plantName, plantSpecies, farmContext },
    null,
    2
  );

  const answersBlock = Object.keys(answers).length
    ? `\nUser answers to follow-up questions:\n${JSON.stringify(
        answers,
        null,
        2
      )}`
    : '';

  const noImageWarning = hasImage
    ? ''
    : `
IMPORTANT — NO IMAGE MODE:
  - Set "confidence" to at most 0.65 (hard ceiling; this is non-negotiable).
  - Set "needsMoreInfo" to true.
  - Provide at least 3 targeted follow-up questions for the grower to inspect manually.
  - Base ALL evidence on farmContext and symptoms text only.`;

  const refineBoost = hasRefine
    ? `
IMPORTANT — REFINEMENT MODE:
  - The user has answered your follow-up questions (see answers block above).
  - Use these answers to significantly narrow the diagnosis.
  - You MAY raise confidence above your previous estimate if answers are conclusive.
  - Reduce followUpQuestions to an empty array [] if confidence is now >= 0.80.`
    : '';

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
function parseDiseaseAnalysis(
  rawText,
  fallbackPlant = 'Plant',
  isNoImage = false,
  isRefine = false,
  answers = {}
) {
  const parsed = JSON.parse(stripJson(rawText, '{}'));

  /* Step 1 — Clamp raw AI score */
  let confidence = Math.min(
    1,
    Math.max(0, parseFloat(parsed.confidence) || 0)
  );

  /* Step 2 — Rule-based corrections */

  // Rule A — No-image hard ceiling at 69%
  if (isNoImage) {
    confidence = Math.min(confidence, 0.69);
  }

  // Rule B — Hedged/vague condition language
  const condLower = String(parsed.condition || '').toLowerCase();
  const vague =
    condLower.includes('suspected') ||
    condLower.includes('possibly') ||
    condLower.includes('likely') ||
    condLower.includes('potential');

  if (vague) {
    confidence = Math.min(confidence, 0.75);
  }

  // Rule C — Model says needsMoreInfo but score is too high
  if (parsed.needsMoreInfo === true && confidence >= 0.80) {
    confidence = 0.79;
  }

  // Rule D — Refine bonus after follow-up answers
  if (isRefine && Object.keys(answers).length > 0) {
    confidence = Math.min(0.96, confidence + 0.18);
  }

  /* Step 3 — Determine whether more info is needed */
  const needsMoreInfo = confidence < 0.80 || isNoImage;

  let finalQuestions = sanitizeStringList(
    parsed.followUpQuestions
  ).slice(0, 4);

  if (needsMoreInfo && finalQuestions.length === 0) {
    if (isNoImage) {
      finalQuestions.push(
        'Could you please provide a clear photo of the affected leaves or stems?'
      );
    }

    finalQuestions.push(
      'Do the affected spots eventually dry out, become brittle, and crack to form small holes (shot-hole effect)?',
      'Do the spots feature concentric rings on their surface (similar to tree rings)?',
      'Did symptoms first appear on older bottom leaves, or throughout the whole plant including new growth?'
    );
  }

  let confidenceExplanation = parsed.confidenceExplanation || '';

  if (!confidenceExplanation) {
    if (isNoImage) {
      confidenceExplanation =
        'Diagnosis based on symptoms and context only — no image available. Uploading a photo would significantly raise confidence.';
    } else if (confidence >= 0.80) {
      confidenceExplanation =
        'Visual symptoms are clear and consistent with the diagnosed condition.';
    } else {
      confidenceExplanation =
        'Symptom clarity or image quality was insufficient for a definitive diagnosis. Answer the follow-up questions to refine the result.';
    }
  }

  return {
    plant: parsed.plant || fallbackPlant || 'Plant',
    condition:
      parsed.condition ||
      'Unable to confirm plant disease from available data',
    severity: ['low', 'medium', 'high', 'unknown'].includes(
      parsed.severity
    )
      ? parsed.severity
      : 'unknown',
    confidence,
    confidenceExplanation,
    evidence: sanitizeStringList(parsed.evidence),
    likelyCauses: sanitizeStringList(parsed.likelyCauses),
    solutions: sanitizeStringList(parsed.solutions),
    prevention: sanitizeStringList(parsed.prevention),
    treatmentDuration:
      parsed.treatmentDuration || 'Undetermined',
    needsMoreInfo,
    followUpQuestions: finalQuestions,
    _meta: {
      isNoImage,
      isRefine,
      rulesApplied: [
        isNoImage ? 'A:no-image-cap≤0.69' : null,
        vague ? 'B:vague-language-cap≤0.75' : null,
        parsed.needsMoreInfo
          ? 'C:model-self-doubt-cap≤0.79'
          : null,
        isRefine && Object.keys(answers).length
          ? 'D:refine-bonus+0.18'
          : null,
      ].filter(Boolean),
    },
  };
}

/* ──────────────────────── Chat & Forecast ──────────────────────── */

async function chatWithAdvisor(
  messages,
  gardenState,
  mode = 'beginner'
) {
  const system =
    mode === 'commercial'
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
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content || m.message || '',
    })),
  ];

  return runTextMessages(
    normalized,
    mode === 'commercial' ? 768 : 512
  );
}

/* Keep your existing forecastYieldAndRecipes(), utility functions,
   plantRecognitionPrompt(), parsePlantRecognition(),
   sanitizeStructure(), inferRackType(), defaultTiers(),
   defaultSlotsPerTier(), and labelRackType() exactly as they are. */

/* ──────────────────────── Resource Prediction ──────────────────────── */

// Deterministic fallback — parses numbers directly from the prompt string
// so we always return something usable even when all AI providers are down.
function _resourceFallback(prompt = '') {
  const waterMatch = prompt.match(/base water need:\s*([\d.]+)\s*L per unit per week/i);
  const fertMatch  = prompt.match(/base fertilizer need:\s*([\d.]+)\s*mL per unit per week/i);
  const unitsMatch = prompt.match(/Total new units:\s*(\d+)/i);

  const waterPerUnit = parseFloat(waterMatch?.[1] || '1');
  const fertPerUnit  = parseFloat(fertMatch?.[1]  || '10');
  const units        = parseInt(unitsMatch?.[1]   || '10', 10);

  return {
    waterLitresPerWeek: parseFloat((waterPerUnit * units).toFixed(1)),
    waterTrend:         'stable',
    fertMLPerWeek:      parseFloat((fertPerUnit  * units).toFixed(0)),
    fertTrend:          'stable',
    confidence:         'low',
    insight:            'Estimate based on species defaults — AI unavailable.',
  };
}

async function predictResources(prompt = '') {
  if (!prompt) throw new Error('prompt is required');

  const system = `You are a precision vertical farming resource analyst.
Return ONLY a valid JSON object with these exact keys — no markdown, no preamble:
{
  "waterLitresPerWeek": <number>,
  "waterTrend": "up" | "stable" | "down",
  "fertMLPerWeek": <number>,
  "fertTrend": "up" | "stable" | "down",
  "confidence": "high" | "medium" | "low",
  "insight": "<string, max 20 words>"
}`;

  let raw;
  try {
    raw = await askText(system, prompt, 400);
  } catch {
    return _resourceFallback(prompt);
  }

  try {
    const cleaned = stripJson(raw, '{');
    const parsed  = JSON.parse(cleaned);
    // Validate required numeric fields; fall back if AI hallucinated garbage
    if (!Number.isFinite(Number(parsed.waterLitresPerWeek)) ||
        !Number.isFinite(Number(parsed.fertMLPerWeek))) {
      throw new Error('Invalid numeric fields');
    }
    return {
      waterLitresPerWeek: Number(Number(parsed.waterLitresPerWeek).toFixed(1)),
      waterTrend:         ['up','stable','down'].includes(parsed.waterTrend) ? parsed.waterTrend : 'stable',
      fertMLPerWeek:      Number(Number(parsed.fertMLPerWeek).toFixed(0)),
      fertTrend:          ['up','stable','down'].includes(parsed.fertTrend)  ? parsed.fertTrend  : 'stable',
      confidence:         ['high','medium','low'].includes(parsed.confidence) ? parsed.confidence : 'low',
      insight:            String(parsed.insight || '').slice(0, 120),
    };
  } catch {
    return _resourceFallback(prompt);
  }
}

module.exports = {
  hasAIKey,
  askText,
  chatWithAdvisor,
  forecastYieldAndRecipes,
  analyzePlantImage,
  analyzePlantDisease,
  predictResources,
};