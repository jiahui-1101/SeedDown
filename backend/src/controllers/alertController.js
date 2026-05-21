// backend/src/controllers/alertController.js
// ─────────────────────────────────────────────────────────────────
//  SeedDown Predictive Alert Engine (Gemini Optimized Version)
//  Two modes:
//     POST /api/alerts/predict-beginner   → Starter / Standard / Pro tiers
//     POST /api/alerts/predict-commercial → Farm Master + Zone Nodes
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
  
  // 💡 优化：引入安全 Epsilon 误差范围，彻底杜绝浮点数除以 0 的极低概率物理崩溃
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

/** Robust JSON parse ensuring it extracts only the valid bracket boundaries. */
function safeJson(text, fallback) {
  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    const start = cleaned.indexOf('[') !== -1 &&
      (cleaned.indexOf('[') < (cleaned.indexOf('{') === -1 ? Infinity : cleaned.indexOf('{')))
      ? cleaned.indexOf('[') : cleaned.indexOf('{');
    const isArray = cleaned.indexOf('[') !== -1 &&
      cleaned.indexOf('[') < (cleaned.indexOf('{') === -1 ? Infinity : cleaned.indexOf('{'));
    const end = isArray ? cleaned.lastIndexOf(']') : cleaned.lastIndexOf('}');
    if (start < 0 || end < start) return fallback;
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return fallback;
  }
}

// ── Beginner Predictor ────────────────────────────────────────────

exports.predictBeginner = async (req, res) => {
  try {
    const {
      deviceId = 'farm_001',
      packageLevel = 'pro',   // starter | standard | pro
      predictMinutes = 45,
      latestReading = {},
      historyReadings = [],
    } = req.body;

    // Extract trends
    const temps   = extractField(historyReadings, 'temperature');
    const humids  = extractField(historyReadings, 'humidity');
    const soils   = extractField(historyReadings, 'soilMoisture');
    const waters  = extractField(historyReadings, 'waterDistanceCm');
    const ecs     = extractField(historyReadings, 'ec');
    const phs     = extractField(historyReadings, 'ph');
    const co2s    = extractField(historyReadings, 'co2Ppm');

    const tempSlope  = slope(temps);
    const soilSlope  = slope(soils);
    const waterSlope = slope(waters);
    const ecSlope    = slope(ecs);
    const phSlope    = slope(phs);
    const co2Slope   = slope(co2s);

    // Projected mathematical targets
    const steps = predictMinutes / 5;
    const projTemp  = (latestReading.temperature || temps.at(-1) || 25) + tempSlope * steps;
    const projSoil  = (latestReading.soilMoisture  || soils.at(-1)  || 50) + soilSlope * steps;
    const projWater = (latestReading.waterDistanceCm || waters.at(-1) || 10) + waterSlope * steps;
    const projEc    = (latestReading.ec || ecs.at(-1) || 1.5)  + ecSlope * steps;
    const projCo2   = (latestReading.co2Ppm || co2s.at(-1) || 800) + co2Slope * steps;

    // ── Build telemetry matrix payload for AI context ────────────
    let sensorSummary = `
Hardware Package Profile: ${packageLevel}
Forecast Window: Next ${predictMinutes} minutes

Current Sensor Stream:
  Temperature: ${latestReading.temperature ?? 'N/A'} °C (delta speed: ${tempSlope.toFixed(3)} °C/step)
  Humidity:    ${latestReading.humidity    ?? 'N/A'} %
  Soil Moisture: ${latestReading.soilMoisture ?? 'N/A'} % (delta speed: ${soilSlope.toFixed(3)}/step)
`;

    if (packageLevel === 'standard' || packageLevel === 'pro') {
      sensorSummary += `  Water Tank Clearance: ${latestReading.waterDistanceCm ?? 'N/A'} cm (delta speed: ${waterSlope.toFixed(3)}/step)\n`;
    }
    if (packageLevel === 'pro') {
      sensorSummary += `  Electrical Conductivity (EC): ${latestReading.ec ?? 'N/A'} mS/cm (delta speed: ${ecSlope.toFixed(3)}/step)\n`;
      sensorSummary += `  Potential Hydrogen (pH): ${latestReading.ph ?? 'N/A'} (delta speed: ${phSlope.toFixed(3)}/step)\n`;
      sensorSummary += `  Carbon Dioxide (CO2): ${latestReading.co2Ppm ?? 'N/A'} ppm (delta speed: ${co2Slope.toFixed(3)}/step)\n`;
    }

    sensorSummary += `
Mathematical Interpolation in ${predictMinutes} min:
  Projected Temp: ${projTemp.toFixed(1)} °C
  Projected Soil Moisture: ${projSoil.toFixed(1)} %`;

    if (packageLevel !== 'starter') {
      sensorSummary += `\n  Projected Water Clearance: ${projWater.toFixed(1)} cm`;
    }
    if (packageLevel === 'pro') {
      sensorSummary += `\n  Projected EC: ${projEc.toFixed(2)} mS/cm | Projected CO2: ${projCo2.toFixed(0)} ppm`;
    }

    const THRESHOLDS = {
      tempCritical: 32,
      soilDryMin: 20,
      waterEmptyCm: 20, 
      ecBurnHigh: 3.5,
      ecDeficientLow: 0.8,
      co2Low: 400,
      co2High: 2000,
    };

    const systemPrompt = `You are SeedDown's embedded predictive risk engine for home growers (${packageLevel} package).
Your primary directive is PROACTIVE risk mitigation. Focus strictly on whether the mathematical projections provided by the server will cross the safety thresholds within the next ${predictMinutes} minutes.
Do NOT output planning, auditing, or scheduling tips. Generate zero alerts if the system remains within thresholds.`;

    const userPrompt = `${sensorSummary}

Safety Boundary Configurations:
  Temp Critical Max: ${THRESHOLDS.tempCritical}°C
  Soil Moisture Minimum: ${THRESHOLDS.soilDryMin}%
  Water Reservoir Dry Out Trigger: distance > ${THRESHOLDS.waterEmptyCm} cm (Note: higher distance means lower water level)
  Nutrient EC Excess Burn: > ${THRESHOLDS.ecBurnHigh} mS/cm
  Nutrient EC Starvation: < ${THRESHOLDS.ecDeficientLow} mS/cm
  Carbon Dioxide Safe Bounds: ${THRESHOLDS.co2Low} ppm to ${THRESHOLDS.co2High} ppm

[OUTPUT MANDATE]
Return a JSON array containing risk objects ONLY when a threshold is mathematically expected to be violated.
If everything is stable, return an empty array: []
Do not surround with backticks or provide conversational preambles. Output valid JSON array syntax only.

[
  {
    "risk": "heat_stress" | "wilting" | "pump_cavitation" | "nutrient_burn" | "nutrient_deficient" | "co2_crisis",
    "severity": "critical" | "warning" | "info",
    "emoji": "🌡️" | "🍂" | "💧" | "🧪" | "💨",
    "title": "Friendly beginner title (English)",
    "prediction": "Clear, plain explanation of the trend projection and the risk timeline.",
    "action": "Immediate tactical instruction for a home user (e.g. 'Tap the cooling button or open vents').",
    "projectedValue": "e.g. 33.4°C in 45 min",
    "confidence": 0.85
  }
]`;

    const raw = await ai.askText(systemPrompt, userPrompt, 900);
    const alerts = safeJson(raw, []);

    res.json({ ok: true, deviceId, packageLevel, predictMinutes, alerts, rawAI: raw });

  } catch (err) {
    console.error('[alertController.predictBeginner]', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ── Commercial Predictor ──────────────────────────────────────────

exports.predictCommercial = async (req, res) => {
  try {
    const {
      deviceId = 'commercial-farm-master-1',
      predictMinutes = 60,
      masterReading = {},
      masterHistory = [],
      zones = [],          // [{ zoneId, latestReading, historyReadings }]
    } = req.body;

    // ── FARM-LEVEL analysis (master central telemetry) ───────────
    const mTemps  = extractField(masterHistory, 'temperature');
    const mWaters = extractField(masterHistory, 'waterDistanceCm');
    const mEnergy = extractField(masterHistory, 'energyKwh');
    const mCo2s   = extractField(masterHistory, 'co2Ppm');

    const mWaterSlope  = slope(mWaters);
    const mEnergySlope = slope(mEnergy);
    const mCo2Slope    = slope(mCo2s);

    const steps = predictMinutes / 5;
    const projMasterWater  = (masterReading.waterDistanceCm || mWaters.at(-1) || 5) + mWaterSlope * steps;
    const projMasterEnergy = (masterReading.energyKwh || mEnergy.at(-1) || 10) + mEnergySlope * steps;
    const projMasterCo2    = (masterReading.co2Ppm || mCo2s.at(-1) || 800) + mCo2Slope * steps;

    // ── ZONE-LEVEL analysis (distributed modular nodes) ──────────
    const zoneSummaries = zones.map(z => {
      const zTemps   = extractField(z.historyReadings || [], 'temperature');
      const zHumids  = extractField(z.historyReadings || [], 'humidity');
      const zSoils   = extractField(z.historyReadings || [], 'soilMoisture');
      const zEcs     = extractField(z.historyReadings || [], 'ec');
      const zPhs     = extractField(z.historyReadings || [], 'ph');

      const zTempSlope  = slope(zTemps);
      const zHumidSlope = slope(zHumids);
      const zEcSlope    = slope(zEcs);

      const zProjTemp  = (z.latestReading?.temperature  || zTemps.at(-1)  || 25) + zTempSlope * steps;
      const zProjHumid = (z.latestReading?.humidity     || zHumids.at(-1) || 65) + zHumidSlope * steps;
      const zProjEc    = (z.latestReading?.ec           || zEcs.at(-1)    || 1.8) + zEcSlope * steps;

      return `Zone/Rack Node ${z.zoneId}: temp=${z.latestReading?.temperature ?? 'N/A'}°C (slope ${zTempSlope.toFixed(3)}) humid=${z.latestReading?.humidity ?? 'N/A'}% (slope ${zHumidSlope.toFixed(3)}) ec=${z.latestReading?.ec ?? 'N/A'} (slope ${zEcSlope.toFixed(3)}) | Projected Output → temp:${zProjTemp.toFixed(1)}°C humid:${zProjHumid.toFixed(1)}% ec:${zProjEc.toFixed(2)}`;
    });

    const systemPrompt = `You are the Commercial Grid Enterprise AI Agronomist Operations Engine for SeedDown.
Your target audience is a professional factory farm manager. Output analytical, precise, and technical industrial descriptions.
Differentiate between 'farm' level resource depletiom (central reservoir levels, energy usage load) and 'zone' level rack micro-climate breakdowns (localized humidity mold risk, EC nutrient line failure).`;

    const userPrompt = `FACILITY CENTRAL MASTER METRIC (${deviceId}):
  Central Reservoir Clearance: ${masterReading.waterDistanceCm ?? 'N/A'} cm (slope: ${mWaterSlope.toFixed(3)}/step → Proj T+${predictMinutes}: ${projMasterWater.toFixed(1)} cm)
  Energy Cumulative Draw:   ${masterReading.energyKwh ?? 'N/A'} kWh (slope: ${mEnergySlope.toFixed(3)}/step → Proj T+${predictMinutes}: ${projMasterEnergy.toFixed(2)} kWh)
  Atmospheric CO2 Level:     ${masterReading.co2Ppm ?? 'N/A'} ppm (slope: ${mCo2Slope.toFixed(3)}/step → Proj T+${predictMinutes}: ${projMasterCo2.toFixed(0)} ppm)

DISTRIBUTED ACTIVE RACK NODES (${zones.length} units):
${zoneSummaries.length ? zoneSummaries.join('\n') : '  No modular grid telemetry received.'}

Enterprise Critical Tolerances:
  Facility Central Water Depletion: distance > 25 cm
  Racking Thermal Threat: > 32°C
  Racking Relative Humidity Rot (Fungal Threat): > 85%
  Racking Nutrient EC Drip Line Overdose: > 3.5 mS/cm
  Racking Nutrient EC Drip Line Starvation: < 0.8 mS/cm
  Macro CO2 Starvation: < 400 ppm

[OUTPUT MANDATE]
Analyze the telemetry gradients. Return exclusively a valid JSON array containing mapped risk assets. If no thresholds are projected to be violated, output an empty bracket: []
No commentary or backtick wrappers allowed.

[
  {
    "scope": "farm" | "zone",
    "zoneId": number or null,
    "risk": "water_depletion" | "energy_overload" | "co2_crisis" | "zone_heat" | "zone_rot" | "zone_ec_burn" | "zone_ec_deficient" | "zone_clog",
    "severity": "critical" | "warning" | "info",
    "emoji": "🛑" | "⚡" | "💨" | "🌡️" | "🍄" | "🧪" | "💧",
    "title": "Industrial Notification Header (SOP style)",
    "prediction": "Rigorous engineering evaluation detailing exact slope speed and time to failure bounds.",
    "action": "Standard Operating Procedure (SOP) mitigation directive for on-site facility technicians.",
    "projectedValue": "e.g. Rack 3 Humidity > 87% in 60m",
    "confidence": 0.91
  }
]`;

    const raw = await ai.askText(systemPrompt, userPrompt, 1200);
    const alerts = safeJson(raw, []);

    res.json({ ok: true, deviceId, predictMinutes, alerts, zoneCount: zones.length, rawAI: raw });

  } catch (err) {
    console.error('[alertController.predictCommercial]', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};