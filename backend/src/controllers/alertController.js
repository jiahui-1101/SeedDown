// backend/src/controllers/alertController.js
// ─────────────────────────────────────────────────────────────────
//  SeedDown Predictive Alert Engine
//  Two modes:
//     POST /api/alerts/predict-beginner   → Starter / Standard / Pro tiers
//     POST /api/alerts/predict-commercial → Farm Master + Zone Nodes
//
//  Every response includes:
//    generatedAt  — ISO timestamp of AI call
//    aiModel      — model identifier
//    promptHash   — short fingerprint so you can verify uniqueness
// ─────────────────────────────────────────────────────────────────
const ai = require('../services/aiService');

// ── Helpers ──────────────────────────────────────────────────────

/** Compute linear slope of an array of numbers using Least Squares. */
function slope(arr) {
  if (!arr || arr.length < 2) return 0;
  const n = arr.length;
  const sumX = (n * (n - 1)) / 2;
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
  let sumY = 0, sumXY = 0;
  arr.forEach((y, x) => { sumY += y; sumXY += x * y; });
  const denom = n * sumX2 - sumX * sumX;
  if (Math.abs(denom) < 1e-6) return 0;
  return (n * sumXY - sumX * sumY) / denom;
}

/** Pick numeric values for a field from an array of readings safely. */
function extractField(readings, field) {
  if (!Array.isArray(readings)) return [];
  return readings
    .map(r => parseFloat(r[field]))
    .filter(v => !isNaN(v));
}

/** Robust JSON parse that strips code fences and finds the first JSON structure. */
function safeJson(text, fallback) {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const isArray = cleaned.indexOf('[') !== -1 &&
      cleaned.indexOf('[') < (cleaned.indexOf('{') === -1 ? Infinity : cleaned.indexOf('{'));
    const start = isArray ? cleaned.indexOf('[') : cleaned.indexOf('{');
    const end   = isArray ? cleaned.lastIndexOf(']') : cleaned.lastIndexOf('}');
    if (start < 0 || end < start) return fallback;
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return fallback;
  }
}

/** Short fingerprint for a string (not cryptographic — just for display). */
function shortHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16).padStart(8, '0');
}

// ── Beginner Predictor ────────────────────────────────────────────

exports.predictBeginner = async (req, res) => {
  try {
    const {
      deviceId       = 'farm_001',
      packageLevel   = 'pro',   // starter | standard | pro
      predictMinutes = 45,
      latestReading  = {},
      historyReadings = [],
    } = req.body;

    const generatedAt = new Date().toISOString();

    // Extract trends from real Firebase history
    const temps   = extractField(historyReadings, 'temperature');
    const humids  = extractField(historyReadings, 'humidity');
    const soils = extractField(historyReadings, 'waterDistanceCm');
    const waters  = extractField(historyReadings, 'waterDistanceCm');
    const ecs    = extractField(historyReadings, 'gasRaw'); 
    const phs     = extractField(historyReadings, 'ph');
    const co2s   = extractField(historyReadings, 'gasRaw');

    const tempSlope  = slope(temps);
    const soilSlope  = slope(soils);
    const waterSlope = slope(waters);
    const ecSlope    = slope(ecs);
    const phSlope    = slope(phs);
    const co2Slope   = slope(co2s);

    const steps = predictMinutes / 5;
    const projTemp  = (latestReading.temperature     || temps.at(-1)  || 25)  + tempSlope  * steps;
    const projSoil = (latestReading.waterDistanceCm || soils.at(-1) || 10) + soilSlope * steps;
    const projWater = (latestReading.waterDistanceCm || waters.at(-1) || 10)  + waterSlope * steps;
    const projEc    = (latestReading.gasRaw           || ecs.at(-1)    || 1.5) + ecSlope    * steps;
    const projCo2   = (latestReading.gasRaw           || co2s.at(-1)  || 800) + co2Slope   * steps;

    const dataReadingCount = historyReadings.length;
    const hasRealData = dataReadingCount > 0;

    // Build telemetry summary sent to AI
    let sensorSummary = `
Hardware Package Profile: ${packageLevel}
Forecast Window: Next ${predictMinutes} minutes
Data Source: Firebase Firestore — ${dataReadingCount} historical readings retrieved
Generated At: ${generatedAt}

Current Sensor Stream (from Firebase):
  Temperature: ${latestReading.temperature ?? 'N/A'} °C (trend: ${tempSlope.toFixed(3)} °C/step over ${temps.length} readings)
  Humidity:    ${latestReading.humidity    ?? 'N/A'} % (${humids.length} readings)
  Soil Moisture: ${latestReading.soilMoisture ?? 'N/A'} % (trend: ${soilSlope.toFixed(3)}/step over ${soils.length} readings)
`;

    if (packageLevel === 'standard' || packageLevel === 'pro') {
      sensorSummary += `  Water Tank Clearance: ${latestReading.waterDistanceCm ?? 'N/A'} cm (trend: ${waterSlope.toFixed(3)}/step over ${waters.length} readings)\n`;
    }
    if (packageLevel === 'pro') {
      sensorSummary += `  Electrical Conductivity (EC): ${latestReading.ec ?? 'N/A'} mS/cm (trend: ${ecSlope.toFixed(3)}/step over ${ecs.length} readings)\n`;
      sensorSummary += `  Potential Hydrogen (pH): ${latestReading.ph ?? 'N/A'} (trend: ${phSlope.toFixed(3)}/step over ${phs.length} readings)\n`;
      sensorSummary += `  Carbon Dioxide (CO2): ${latestReading.co2Ppm ?? 'N/A'} ppm (trend: ${co2Slope.toFixed(3)}/step over ${co2s.length} readings)\n`;
    }

    sensorSummary += `
Mathematical Projection in ${predictMinutes} min:
  Projected Temperature:    ${projTemp.toFixed(1)} °C
  Projected Soil Moisture:  ${projSoil.toFixed(1)} %`;

    if (packageLevel !== 'starter') {
      sensorSummary += `\n  Projected Water Clearance: ${projWater.toFixed(1)} cm`;
    }
    if (packageLevel === 'pro') {
      sensorSummary += `\n  Projected EC: ${projEc.toFixed(2)} mS/cm | Projected CO2: ${projCo2.toFixed(0)} ppm`;
    }

    if (!hasRealData) {
      sensorSummary += `\n\n⚠️ NOTE: Firebase returned 0 historical readings. Sensor device may be offline or deviceId "${deviceId}" may be incorrect. Return [] as no meaningful projection can be made.`;
    }

    const THRESHOLDS = {
      tempCritical:    32,
      soilDryMin:      20,
      waterEmptyCm:    20,
      ecBurnHigh:       3.5,
      ecDeficientLow:   0.8,
      co2Low:         400,
      co2High:       2000,
    };

    const systemPrompt = `You are SeedDown's embedded predictive risk engine for home growers (${packageLevel} package).
Your primary directive is PROACTIVE risk mitigation. Focus strictly on whether the mathematical projections provided will cross safety thresholds within the next ${predictMinutes} minutes.
Only raise an alert if a threshold will genuinely be breached based on the trend slope. If data is missing or all values are stable, return an empty array.
Do NOT output planning, auditing, or scheduling tips.`;

    const userPrompt = `${sensorSummary}

Safety Boundary Configurations:
  Temp Critical Max: ${THRESHOLDS.tempCritical}°C
  Soil Moisture Minimum: ${THRESHOLDS.soilDryMin}%
  Water Reservoir Dry Out Trigger: distance > ${THRESHOLDS.waterEmptyCm} cm (higher distance = lower water level)
  Nutrient EC Excess Burn: > ${THRESHOLDS.ecBurnHigh} mS/cm
  Nutrient EC Starvation: < ${THRESHOLDS.ecDeficientLow} mS/cm
  Carbon Dioxide Safe Bounds: ${THRESHOLDS.co2Low} ppm to ${THRESHOLDS.co2High} ppm

[OUTPUT MANDATE]
Return a JSON array of risk objects ONLY when a threshold is mathematically projected to be violated.
If everything is stable or data is insufficient, return an empty array: []
No backticks, no preamble — valid JSON array only.

[
  {
    "risk": "heat_stress" | "wilting" | "pump_cavitation" | "nutrient_burn" | "nutrient_deficient" | "co2_crisis",
    "severity": "critical" | "warning" | "info",
    "emoji": "🌡️" | "🍂" | "💧" | "🧪" | "💨",
    "title": "Friendly beginner title (English)",
    "prediction": "Clear, plain explanation of the trend and the risk timeline with actual numbers.",
    "action": "Immediate instruction for a home user (e.g. 'Tap the cooling button or open vents').",
    "projectedValue": "e.g. 33.4°C in 45 min",
    "confidence": 0.85
  }
]`;

    const raw = await ai.askText(systemPrompt, userPrompt, 900);
    const alerts = safeJson(raw, []);
    const promptHash = shortHash(userPrompt);

    res.json({
      ok: true,
      deviceId,
      packageLevel,
      predictMinutes,
      alerts,
      // ── AI provenance metadata (displayed in frontend) ──
      aiMeta: {
        generatedAt,
        promptHash,
        readingCount: dataReadingCount,
        hasRealData,
        slopeSummary: {
          temp: tempSlope.toFixed(4),
          soil: soilSlope.toFixed(4),
          water: waterSlope.toFixed(4),
          ec: ecSlope.toFixed(4),
          co2: co2Slope.toFixed(4),
        },
      },
      rawAI: raw,
    });

  } catch (err) {
    console.error('[alertController.predictBeginner]', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ── Commercial Predictor ──────────────────────────────────────────

exports.predictCommercial = async (req, res) => {
  try {
    const {
      deviceId       = 'commercial-farm-master-1',
      predictMinutes = 60,
      masterReading  = {},
      masterHistory  = [],
      zones          = [],   // [{ zoneId, latestReading, historyReadings }]
    } = req.body;

    const generatedAt = new Date().toISOString();

    // ── FARM-LEVEL analysis (master central telemetry) ───────────
    const mTemps  = extractField(masterHistory, 'temperature');
    const mWaters = extractField(masterHistory, 'waterDistanceCm');
    const mEnergy = extractField(masterHistory, 'energyKwh');
    const mCo2s   = extractField(masterHistory, 'co2Ppm');

    const mWaterSlope  = slope(mWaters);
    const mEnergySlope = slope(mEnergy);
    const mCo2Slope    = slope(mCo2s);

    const steps = predictMinutes / 5;
    const projMasterWater  = (masterReading.waterDistanceCm || mWaters.at(-1) || 5)  + mWaterSlope  * steps;
    const projMasterEnergy = (masterReading.energyKwh       || mEnergy.at(-1) || 10) + mEnergySlope * steps;
    const projMasterCo2    = (masterReading.co2Ppm          || mCo2s.at(-1)   || 800)+ mCo2Slope    * steps;

    const masterReadingCount = masterHistory.length;

    // ── ZONE-LEVEL analysis (distributed modular nodes) ──────────
    const zoneSummaries = zones.map(z => {
      const zTemps   = extractField(z.historyReadings || [], 'temperature');
      const zHumids  = extractField(z.historyReadings || [], 'humidity');
      const zEcs     = extractField(z.historyReadings || [], 'ec');

      const zTempSlope  = slope(zTemps);
      const zHumidSlope = slope(zHumids);
      const zEcSlope    = slope(zEcs);

      const zProjTemp  = (z.latestReading?.temperature || zTemps.at(-1)  || 25)  + zTempSlope  * steps;
      const zProjHumid = (z.latestReading?.humidity    || zHumids.at(-1) || 65)  + zHumidSlope * steps;
      const zProjEc    = (z.latestReading?.ec          || zEcs.at(-1)    || 1.8) + zEcSlope    * steps;

      const readCount = (z.historyReadings || []).length;
      return `Zone/Rack Node ${z.zoneId} (${readCount} readings from Firebase): ` +
        `temp=${z.latestReading?.temperature ?? 'N/A'}°C (slope ${zTempSlope.toFixed(3)}) ` +
        `humid=${z.latestReading?.humidity ?? 'N/A'}% (slope ${zHumidSlope.toFixed(3)}) ` +
        `ec=${z.latestReading?.ec ?? 'N/A'} (slope ${zEcSlope.toFixed(3)}) ` +
        `→ Projected T+${predictMinutes}min: temp:${zProjTemp.toFixed(1)}°C humid:${zProjHumid.toFixed(1)}% ec:${zProjEc.toFixed(2)}`;
    });

    const systemPrompt = `You are the Commercial Grid Enterprise AI Agronomist Operations Engine for SeedDown.
Your target audience is a professional factory farm manager. Output analytical, precise, and technical descriptions.
Differentiate between 'farm' level resource depletion (central reservoir, energy, CO2) and 'zone' level micro-climate issues (humidity mold risk, EC nutrient failure, heat stress).
Only raise an alert when a threshold projection is genuinely violated. Return [] if the facility is stable.`;

    const userPrompt = `ANALYSIS TIMESTAMP: ${generatedAt}
DATA SOURCE: Firebase Firestore — ${masterReadingCount} master readings, ${zones.length} active zone nodes

FACILITY CENTRAL MASTER (${deviceId}):
  Central Reservoir Clearance: ${masterReading.waterDistanceCm ?? 'N/A'} cm (slope: ${mWaterSlope.toFixed(3)}/step → Proj T+${predictMinutes}min: ${projMasterWater.toFixed(1)} cm) [${mWaters.length} readings]
  Energy Cumulative Draw:      ${masterReading.energyKwh ?? 'N/A'} kWh (slope: ${mEnergySlope.toFixed(3)}/step → Proj T+${predictMinutes}min: ${projMasterEnergy.toFixed(2)} kWh) [${mEnergy.length} readings]
  Atmospheric CO2:             ${masterReading.co2Ppm ?? 'N/A'} ppm (slope: ${mCo2Slope.toFixed(3)}/step → Proj T+${predictMinutes}min: ${projMasterCo2.toFixed(0)} ppm) [${mCo2s.length} readings]

DISTRIBUTED ZONE NODES (${zones.length} active zones from Firebase):
${zoneSummaries.length ? zoneSummaries.join('\n') : '  No zone telemetry available — zoneIds may not match Firebase records.'}

Enterprise Critical Tolerances:
  Facility Water Depletion Alert: distance > 25 cm
  Zone Thermal Threat: > 32°C
  Zone Humidity Rot Risk (Fungal): > 85%
  Zone Nutrient EC Overdose: > 3.5 mS/cm
  Zone Nutrient EC Starvation: < 0.8 mS/cm
  Macro CO2 Starvation: < 400 ppm

[OUTPUT MANDATE]
Analyze telemetry gradients from real Firebase sensor data. Return a valid JSON array of risk objects ONLY when a threshold will be breached.
If the facility is stable or data is insufficient, return: []
No markdown, no backticks, no commentary — raw JSON array only.

[
  {
    "scope": "farm" | "zone",
    "zoneId": number or null,
    "risk": "water_depletion" | "energy_overload" | "co2_crisis" | "zone_heat" | "zone_rot" | "zone_ec_burn" | "zone_ec_deficient" | "zone_clog",
    "severity": "critical" | "warning" | "info",
    "emoji": "🛑" | "⚡" | "💨" | "🌡️" | "🍄" | "🧪" | "💧",
    "title": "Industrial SOP-style notification header",
    "prediction": "Rigorous engineering evaluation with exact slope speeds, reading counts, and time-to-failure.",
    "action": "Standard Operating Procedure mitigation directive for on-site facility technicians.",
    "projectedValue": "e.g. Rack 3 Humidity > 87% in 60m",
    "confidence": 0.91
  }
]`;

    const raw = await ai.askText(systemPrompt, userPrompt, 1200);
    const alerts = safeJson(raw, []);
    const promptHash = shortHash(userPrompt);

    res.json({
      ok: true,
      deviceId,
      predictMinutes,
      alerts,
      zoneCount: zones.length,
      // ── AI provenance metadata ──
      aiMeta: {
        generatedAt,
        promptHash,
        masterReadingCount,
        zoneReadingCounts: zones.map(z => ({
          zoneId: z.zoneId,
          count: (z.historyReadings || []).length,
        })),
        masterSlopes: {
          water:  mWaterSlope.toFixed(4),
          energy: mEnergySlope.toFixed(4),
          co2:    mCo2Slope.toFixed(4),
        },
      },
      rawAI: raw,
    });

  } catch (err) {
    console.error('[alertController.predictCommercial]', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
