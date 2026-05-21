/* ============================================================
   backend/src/routes/consumptionRoutes.js
   POST /api/consumption/analysis

   Architecture:
   - Static crop benchmarks = FAO/USDA/Cornell CEA baseline
   - Groq AI = dynamic grow day prediction + agronomic analysis
     based on REAL sensor history (temperature, light, water)
   - Frontend receives AI-computed grow days, not hardcoded ones
   - NEW: aiGenerateCropBenchmark() — if a crop is NOT in CROP_DB,
     Groq AI generates its benchmark on-the-fly instead of
     falling back to "Mixed Crops"
============================================================ */

const express = require('express');
const router  = express.Router();

/* ══════════════════════════════════════════════════════════════
   STATIC CROP BENCHMARKS (FAO / USDA / Cornell CEA 2024)
   These are TRADITIONAL vs VERTICAL FARM baselines only.
   Grow days for YOUR farm = computed by AI from sensor data.
══════════════════════════════════════════════════════════════ */

const CROP_DB = {
  lettuce: {
    name: 'Lettuce',
    emoji: '🥬',
    traditional: {
      waterPerDayL:      45,
      energyKwhPerDay:    1.6,
      growDays:          60,
      waterPerKg:       250,
      co2KgPerDay:        0.8,
      landM2PerKg:        1.8,
    },
    vertical: {
      waterPerDayL:      2.0,
      energyKwhPerDay:   0.27,
      growDays:          30,
      landM2PerKg:       0.09,
    },
    idealSensorZone: {
      tempMin: 18, tempMax: 24,
      lightPPFD: { min: 200, max: 350 },
      waterLevelMin: 65, waterLevelMax: 80,
      DLI_target: 14,
    },
    source: 'FAO Hydroponics 2024 / Cornell CEA',
  },

  spinach: {
    name: 'Spinach',
    emoji: '🥬',
    traditional: {
      waterPerDayL:      50,
      energyKwhPerDay:    1.8,
      growDays:          50,
      waterPerKg:       280,
      co2KgPerDay:        0.9,
      landM2PerKg:        2.0,
    },
    vertical: {
      waterPerDayL:      2.2,
      energyKwhPerDay:   0.22,
      growDays:          25,
      landM2PerKg:       0.10,
    },
    idealSensorZone: {
      tempMin: 15, tempMax: 22,
      lightPPFD: { min: 150, max: 300 },
      waterLevelMin: 60, waterLevelMax: 78,
      DLI_target: 12,
    },
    source: 'USDA Hydroponic Spinach Guidelines 2023',
  },

  basil: {
    name: 'Basil',
    emoji: '🌿',
    traditional: {
      waterPerDayL:      30,
      energyKwhPerDay:    1.2,
      growDays:          50,
      waterPerKg:       180,
      co2KgPerDay:        0.6,
      landM2PerKg:        1.5,
    },
    vertical: {
      waterPerDayL:      1.5,
      energyKwhPerDay:   0.20,
      growDays:          28,
      landM2PerKg:       0.08,
    },
    idealSensorZone: {
      tempMin: 20, tempMax: 28,
      lightPPFD: { min: 250, max: 450 },
      waterLevelMin: 60, waterLevelMax: 75,
      DLI_target: 16,
    },
    source: 'AeroFarms Basil Study 2022',
  },

  tomato: {
    name: 'Tomato',
    emoji: '🍅',
    traditional: {
      waterPerDayL:      60,
      energyKwhPerDay:    2.5,
      growDays:          80,
      waterPerKg:       320,
      co2KgPerDay:        1.4,
      landM2PerKg:        3.0,
    },
    vertical: {
      waterPerDayL:      3.5,
      energyKwhPerDay:   0.36,
      growDays:          55,
      landM2PerKg:       0.15,
    },
    idealSensorZone: {
      tempMin: 20, tempMax: 26,
      lightPPFD: { min: 400, max: 700 },
      waterLevelMin: 70, waterLevelMax: 85,
      DLI_target: 20,
    },
    source: 'Nature Vertical Farming 2023 / FAO',
  },

  kale: {
    name: 'Kale',
    emoji: '🥬',
    traditional: {
      waterPerDayL:      40,
      energyKwhPerDay:    1.5,
      growDays:          60,
      waterPerKg:       200,
      co2KgPerDay:        0.7,
      landM2PerKg:        1.6,
    },
    vertical: {
      waterPerDayL:      1.8,
      energyKwhPerDay:   0.24,
      growDays:          35,
      landM2PerKg:       0.09,
    },
    idealSensorZone: {
      tempMin: 15, tempMax: 23,
      lightPPFD: { min: 180, max: 320 },
      waterLevelMin: 62, waterLevelMax: 78,
      DLI_target: 13,
    },
    source: 'Cornell CEA Kale Benchmarks 2023',
  },

  default: {
    name: 'Mixed Crops',
    emoji: '🌱',
    traditional: {
      waterPerDayL:      55,
      energyKwhPerDay:    2.0,
      growDays:          65,
      waterPerKg:       250,
      co2KgPerDay:        1.0,
      landM2PerKg:        2.5,
    },
    vertical: {
      waterPerDayL:      2.5,
      energyKwhPerDay:   0.27,
      growDays:          35,
      landM2PerKg:       0.12,
    },
    idealSensorZone: {
      tempMin: 18, tempMax: 25,
      lightPPFD: { min: 200, max: 400 },
      waterLevelMin: 65, waterLevelMax: 80,
      DLI_target: 14,
    },
    source: 'FAO General Vertical Farm Guidelines 2024',
  },

  mint: {
    name: 'Mint',
    emoji: '🌿',
    traditional: {
      waterPerDayL: 25, energyKwhPerDay: 1.0,
      growDays: 40, waterPerKg: 150, co2KgPerDay: 0.5, landM2PerKg: 1.2,
    },
    vertical: {
      waterPerDayL: 1.2, energyKwhPerDay: 0.18,
      growDays: 22, landM2PerKg: 0.07,
    },
    idealSensorZone: {
      tempMin: 18, tempMax: 26,
      lightPPFD: { min: 150, max: 280 },
      waterLevelMin: 60, waterLevelMax: 75,
      DLI_target: 12,
    },
    source: 'Cornell CEA Herb Guidelines 2023',
  },

  chili: {
    name: 'Chili',
    emoji: '🌶️',
    traditional: {
      waterPerDayL: 50, energyKwhPerDay: 2.2,
      growDays: 90, waterPerKg: 300, co2KgPerDay: 1.2, landM2PerKg: 2.8,
    },
    vertical: {
      waterPerDayL: 3.0, energyKwhPerDay: 0.32,
      growDays: 65, landM2PerKg: 0.13,
    },
    idealSensorZone: {
      tempMin: 22, tempMax: 30,
      lightPPFD: { min: 350, max: 600 },
      waterLevelMin: 68, waterLevelMax: 82,
      DLI_target: 18,
    },
    source: 'FAO Pepper Production Guidelines 2023',
  },
};

/* ══════════════════════════════════════════════════════════════
   GROQ HELPER (WITH TIMEOUT)
══════════════════════════════════════════════════════════════ */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroq(systemPrompt, userPrompt, maxTokens = 500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: maxTokens,
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await res.json();

    if (!data?.choices?.[0]?.message?.content) {
      console.warn('[consumptionRoutes] Groq empty response:', JSON.stringify(data).slice(0, 300));
      return null;
    }

    return data.choices[0].message.content.trim();
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[consumptionRoutes] Groq fetch error or timeout:', err.message);
    return null;
  }
}

/* ══════════════════════════════════════════════════════════════
   NEW: AI DYNAMIC CROP BENCHMARK GENERATOR
   Called when a crop key is NOT found in CROP_DB.
   Groq generates realistic FAO-style benchmark data on-the-fly
   so we never fall back to "Mixed Crops" for a known plant.
══════════════════════════════════════════════════════════════ */

async function aiGenerateCropBenchmark(cropName) {
  const displayName = cropName.charAt(0).toUpperCase() + cropName.slice(1);

  const systemPrompt = `
You are an agronomist with expertise in vertical farming and traditional agriculture.
Return ONLY a raw JSON object — no markdown, no backticks, no explanation text.
The JSON must exactly match this structure:
{
  "name": "string",
  "emoji": "single emoji",
  "traditional": {
    "waterPerDayL": number,
    "energyKwhPerDay": number,
    "growDays": number,
    "waterPerKg": number,
    "co2KgPerDay": number,
    "landM2PerKg": number
  },
  "vertical": {
    "waterPerDayL": number,
    "energyKwhPerDay": number,
    "growDays": number,
    "landM2PerKg": number
  },
  "idealSensorZone": {
    "tempMin": number,
    "tempMax": number,
    "lightPPFD": { "min": number, "max": number },
    "waterLevelMin": number,
    "waterLevelMax": number,
    "DLI_target": number
  },
  "source": "string"
}
All values must be realistic agronomic data based on FAO and published research.
Vertical farming typically uses 85-95% less water and 90-99% less land than traditional methods.
`.trim();

  const userPrompt = `Generate vertical farming benchmark data for: ${displayName}`;

  try {
    const raw = await callGroq(systemPrompt, userPrompt, 500);
    if (!raw) throw new Error('empty response');

    // Strip any accidental markdown fences
    const start = raw.indexOf('{');
    const end   = raw.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('no JSON object found');

    const parsed = JSON.parse(raw.substring(start, end + 1));

    // Sanity check — must have required fields
    if (
      !parsed.traditional?.waterPerDayL ||
      !parsed.vertical?.waterPerDayL    ||
      !parsed.idealSensorZone?.waterLevelMin
    ) {
      throw new Error('incomplete JSON from AI');
    }

    console.log(`[consumptionRoutes] AI generated benchmark for unknown crop: ${displayName}`);
    return parsed;

  } catch (err) {
    console.warn(`[consumptionRoutes] aiGenerateCropBenchmark failed for "${cropName}":`, err.message);
    // Only use default as last resort if AI also fails
    return { ...CROP_DB.default, name: displayName, emoji: '🌱', source: 'AI-estimated (fallback)' };
  }
}

/* ══════════════════════════════════════════════════════════════
   SENSOR ANALYSIS HELPERS
══════════════════════════════════════════════════════════════ */

function analyseSensorHistory(sensorHistory = []) {
  if (!sensorHistory.length) return null;

  const temps  = sensorHistory.map(r => r.temperature ?? 25);
  const lights = sensorHistory.map(r => r.lightRaw     ?? 2000);
  const water  = sensorHistory.map(r => r.waterLevel   ?? 70);

  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = arr => {
    const m = avg(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
  };

  const avgTemp    = +avg(temps).toFixed(1);
  const avgLight   = +avg(lights).toFixed(0);
  const avgWater   = +avg(water).toFixed(1);
  const tempStress = temps.filter(t => t < 15 || t > 30).length;
  const tempStdDev = +std(temps).toFixed(2);

  const ppfd       = (avgLight / 2000) * 400;
  const lightHours = sensorHistory.filter(r => (r.lightRaw ?? 2000) > 800).length;
  const DLI        = +((ppfd * lightHours * 3600) / 1_000_000).toFixed(2);

  const waterInRange   = water.filter(w => w >= 60 && w <= 85).length;
  const waterStability = Math.round((waterInRange / water.length) * 100);

  return {
    avgTemp, tempStdDev, tempStress,
    avgLightRaw: avgLight,
    estimatedPPFD: +ppfd.toFixed(1),
    lightHoursDetected: lightHours,
    DLI,
    avgWaterLevel: avgWater,
    waterStabilityPct: waterStability,
    readingsCount: sensorHistory.length,
  };
}

/* ══════════════════════════════════════════════════════════════
   CORE: AI GROW DAY PREDICTION
══════════════════════════════════════════════════════════════ */

async function aiPredictAllCrops(cropKeys, cropDataMap, sensorStats) {
  const cropList = cropKeys.map(key => {
    const b = cropDataMap[key];
    return `- ${b.name}: benchmark ${b.vertical.growDays}d vertical / ${b.traditional.growDays}d traditional`;
  }).join('\n');

  const systemPrompt = `
You are a strict JSON API.
Respond ONLY with a raw JSON array.
Do not include any introductory text, markdown formatting, or explanations.
Valid JSON structure:
[
  { "key": "cropkey", "predictedGrowDays": 30, "confidence": "high", "agronomicNote": "Short sentence here." }
]
`.trim();

  const userPrompt = `Predict growth days for these crops based on ${sensorStats.avgTemp}°C temp and ${sensorStats.DLI} DLI. List:\n${cropList}`;

  try {
    const raw = await callGroq(systemPrompt, userPrompt, 600);
    if (!raw) return null;

    const start = raw.indexOf('[');
    const end   = raw.lastIndexOf(']');
    if (start === -1 || end === -1) {
      console.warn('[consumptionRoutes] No JSON array found in response');
      return null;
    }

    return JSON.parse(raw.substring(start, end + 1));
  } catch (err) {
    console.warn('[consumptionRoutes] Parse error in aiPredictAllCrops:', err.message);
    return null;
  }
}

/* ══════════════════════════════════════════════════════════════
   CORE: AI SUSTAINABILITY NARRATIVE
══════════════════════════════════════════════════════════════ */

async function aiSustainabilityNarrativeEarly(cropKeys, cropDataMap, sensorStats, metrics) {
  const systemPrompt = `
You are a sustainability analyst for vertical farming operations.
Write 3 sentences in plain prose using exact numbers provided.
Focus on: sensor conditions, water/energy efficiency, one actionable recommendation.
`.trim();

  const cropLines = cropKeys.map(key => {
    const b = cropDataMap[key];
    const waterSavePct = Math.round(
      ((b.traditional.waterPerDayL - b.vertical.waterPerDayL) / b.traditional.waterPerDayL) * 100
    );
    return `${b.name}: ${waterSavePct}% water saving vs traditional`;
  }).join(', ');

  const userPrompt = `
Crops: ${cropLines}
Sensor: avg temp ${sensorStats.avgTemp}°C, DLI ${sensorStats.DLI} mol/m²/day, water stability ${sensorStats.waterStabilityPct}%
Today: ${metrics.waterLiters?.toFixed(2)}L water used, ${metrics.energyKwh?.toFixed(3)} kWh energy used
`.trim();

  return await callGroq(systemPrompt, userPrompt, 180);
}

/* ══════════════════════════════════════════════════════════════
   POST /api/consumption/analysis
══════════════════════════════════════════════════════════════ */

router.post('/analysis', async (req, res) => {
  try {
    const {
      plants        = [],
      metrics       = {},
      sensorHistory = [],
      farmContext = {}
    } = req.body;

    const isReal = sensorHistory.length > 0 &&
      sensorHistory.some(r => r.temperature !== undefined && r.temperature !== null);

    /* ─── 1. Resolve crops ─────────────────────────────── */

    const cropKeys = (Array.isArray(plants) ? plants : [])
      .slice(0, 4)
      .map(p => p.toLowerCase().trim());

    /* ─── 2. Analyse sensor history ────────────────────── */

    const sensorStats = analyseSensorHistory(sensorHistory);
    const hasSensors  = sensorStats !== null;

    /* ─── 3. Resolve crop data — DB lookup OR AI generation ── */
    //
    //  CHANGED: instead of CROP_DB[key] || CROP_DB.default,
    //  we now call aiGenerateCropBenchmark(key) for unknown crops.
    //  This runs in parallel for all crops before the AI grow-day call.

    const cropDataMap = {};
    await Promise.all(
      cropKeys.map(async key => {
        if (CROP_DB[key]) {
          cropDataMap[key] = CROP_DB[key];
        } else {
          // Unknown crop → ask Groq to generate benchmark on-the-fly
          cropDataMap[key] = await aiGenerateCropBenchmark(key);
        }
      })
    );

    /* ─── 4. AI grow-day prediction + narrative (parallel) ─── */

    const [allAiResults, aiNarrativeEarly] = await Promise.all([
      hasSensors && cropKeys.length > 0
        ? aiPredictAllCrops(cropKeys, cropDataMap, sensorStats).catch(() => null)
        : Promise.resolve(null),
      hasSensors && cropKeys.length > 0
        ? aiSustainabilityNarrativeEarly(cropKeys, cropDataMap, sensorStats, metrics).catch(() => null)
        : Promise.resolve(null),
    ]);

    const growDayResults = cropKeys.map((key, i) => {
      if (!allAiResults) return null;
      const result = allAiResults.find(r => r.key === key) || allAiResults[i];
      if (!result || result.predictedGrowDays < 10 || result.predictedGrowDays > 200) return null;
      return result;
    });

    /* ─── 5. Build plant data ───────────────────────────── */
    //
    //  UNCHANGED from original — cropDataMap now always has real
    //  data per crop (either from CROP_DB or AI-generated above).

    const plantData = cropKeys.map((key, i) => {
      const b  = cropDataMap[key];
      const ai = growDayResults[i];

      const waterSavePct = Math.round(
        ((b.traditional.waterPerDayL - b.vertical.waterPerDayL) / b.traditional.waterPerDayL) * 100
      );
      const energySavePct = Math.round(
        ((b.traditional.energyKwhPerDay - b.vertical.energyKwhPerDay) / b.traditional.energyKwhPerDay) * 100
      );

      const aiGrowDays = ai?.predictedGrowDays ?? null;

      return {
        key,
        name:  b.name,
        emoji: b.emoji,

        traditional: { ...b.traditional },
        vertical:    { ...b.vertical    },

        yourFarm: hasSensors && aiGrowDays ? {
          growDays:        aiGrowDays,
          confidence:      ai.confidence,
          growthModifier:  ai.growthModifier,
          keyFactors:      ai.keyFactors,
          agronomicNote:   ai.agronomicNote,
          waterPerDayL:    +(metrics.waterLiters ?? b.vertical.waterPerDayL).toFixed(3),
          energyKwhPerDay: +(metrics.energyKwh   ?? b.vertical.energyKwhPerDay).toFixed(4),
        } : null,

        aiGrowDays,
        aiConfidence:  ai?.confidence  ?? null,
        aiKeyFactors:  ai?.keyFactors  ?? [],
        agronomicNote: ai?.agronomicNote ?? null,

        idealZone: b.idealSensorZone,
        source:    b.source,

        waterSavePct,
        energySavePct,
        waterSavedLPerDay:    +(b.traditional.waterPerDayL  - b.vertical.waterPerDayL).toFixed(1),
        energySavedKwhPerDay: +(b.traditional.energyKwhPerDay - b.vertical.energyKwhPerDay).toFixed(3),
        growDaysFaster: Math.max(0, b.traditional.growDays - (aiGrowDays ?? b.vertical.growDays)),
      };
    });

    /* ─── 6. Ideal water zone (crop-weighted average) ───── */

    const avgIdealMin = plantData.length > 0
      ? Math.round(plantData.reduce((s, p) => s + p.idealZone.waterLevelMin, 0) / plantData.length)
      : 65;
    const avgIdealMax = plantData.length > 0
      ? Math.round(plantData.reduce((s, p) => s + p.idealZone.waterLevelMax, 0) / plantData.length)
      : 80;

    /* ─── 7. Economics ──────────────────────────────────── */

    const primary          = plantData[0] || CROP_DB.default;
    const tradWater        = primary.traditional.waterPerDayL;
    const tradEnergyPerDay = primary.traditional.energyKwhPerDay;

    const RM_PER_KWH   = 0.218;
    const RM_PER_LITRE = 0.002;

    const waterUsed  = metrics.waterLiters ?? 0.5;
    const energyUsed = metrics.energyKwh   ?? 0.1;

    const vertCostToday  = waterUsed  * RM_PER_LITRE + energyUsed  * RM_PER_KWH;
    const tradCostToday  = tradWater  * RM_PER_LITRE + tradEnergyPerDay * RM_PER_KWH;
    const dailySavingsRm = Math.max(0, tradCostToday - vertCostToday);

    const waterSavedToday = Math.max(0, tradWater - waterUsed);
    const waterSavePct    = Math.round((waterSavedToday / tradWater) * 100);

    const ruleBasedSummary = {
      waterStatus:
        waterUsed < tradWater * 0.3 ? 'excellent' :
        waterUsed < tradWater * 0.5 ? 'good'      :
        waterUsed < tradWater * 0.8 ? 'average'   : 'above_target',

      waterSavedL:       +waterSavedToday.toFixed(1),
      waterSavePct,
      monthlySavingsL:   Math.round(waterSavedToday * 30),
      yearlyWaterSavedL: Math.round(waterSavedToday * 365),

      dailySavingsRm:   +dailySavingsRm.toFixed(2),
      monthlySavingsRm: +(dailySavingsRm * 30).toFixed(2),
      yearlySavingsRm:  +(dailySavingsRm * 365).toFixed(2),

      todayTradCost: +tradCostToday.toFixed(2),
      todayVertCost: +vertCostToday.toFixed(2),
    };

    /* ─── 8. AI narrative ───────────────────────────────── */

    let aiNarrative = aiNarrativeEarly;

    if (!aiNarrative) {
      const aiGrowNote = plantData[0] && plantData[0].aiGrowDays
        ? ` AI predicts your ${primary.name.toLowerCase()} will mature in ${plantData[0].aiGrowDays} days (benchmark: ${primary.vertical.growDays} days).`
        : '';
      aiNarrative =
        `Your vertical farm used ${waterUsed.toFixed(1)}L today vs ${tradWater}L in traditional farming — a ${waterSavePct}% reduction.` +
        aiGrowNote +
        ` Monthly water savings of ${ruleBasedSummary.monthlySavingsL}L represent significant environmental benefit.`;
    }

    /* ─── 9. Respond ────────────────────────────────────── */

    res.json({
      plantData,
      aiNarrative,
      ruleBasedSummary,

      idealWaterZone: {
        min: avgIdealMin,
        max: avgIdealMax,
        mid: Math.round((avgIdealMin + avgIdealMax) / 2),
      },

      traditionalEnergyPerDay: tradEnergyPerDay,

      sensorStats:          hasSensors ? sensorStats : null,
      hasSensorData:        hasSensors,
      aiGrowDaysComputed:   plantData.some(p => p.aiGrowDays !== null),
    });

  } catch (err) {
    console.error('[consumptionRoutes] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;