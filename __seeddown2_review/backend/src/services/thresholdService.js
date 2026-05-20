const aiService = require('./aiService');
const { defaultPreferences } = require('./sensorService');

const SAFETY_LIMITS = {
  gasDangerThreshold: 3000,
  waterLowCm: 20,
};

const CROP_MATRIX = {
  lettuce: { tempMin: 15, tempMax: 24, humidityMin: 55, humidityMax: 80, phMin: 6.0, phMax: 7.0, ecMin: 1.2, ecMax: 1.6, co2MinPpm: 800, soilDryThreshold: 2600 },
  spinach: { tempMin: 15, tempMax: 24, humidityMin: 55, humidityMax: 80, phMin: 6.0, phMax: 7.2, ecMin: 1.4, ecMax: 1.8, co2MinPpm: 800, soilDryThreshold: 2600 },
  tomato: { tempMin: 18, tempMax: 28, humidityMin: 50, humidityMax: 75, phMin: 5.8, phMax: 6.8, ecMin: 2.0, ecMax: 3.5, co2MinPpm: 900, soilDryThreshold: 2400 },
  cucumber: { tempMin: 20, tempMax: 29, humidityMin: 60, humidityMax: 85, phMin: 5.8, phMax: 6.8, ecMin: 1.7, ecMax: 2.5, co2MinPpm: 900, soilDryThreshold: 2400 },
  basil: { tempMin: 20, tempMax: 29, humidityMin: 50, humidityMax: 75, phMin: 5.8, phMax: 6.8, ecMin: 1.0, ecMax: 1.6, co2MinPpm: 800, soilDryThreshold: 2500 },
  kale: { tempMin: 15, tempMax: 24, humidityMin: 50, humidityMax: 75, phMin: 6.0, phMax: 7.5, ecMin: 1.6, ecMax: 2.4, co2MinPpm: 800, soilDryThreshold: 2600 },
  strawberry: { tempMin: 16, tempMax: 26, humidityMin: 55, humidityMax: 75, phMin: 5.5, phMax: 6.5, ecMin: 1.4, ecMax: 2.0, co2MinPpm: 800, soilDryThreshold: 2500 },
  default: { tempMin: 18, tempMax: 28, humidityMin: 50, humidityMax: 80, phMin: 5.8, phMax: 6.8, ecMin: 1.2, ecMax: 2.0, co2MinPpm: 800, soilDryThreshold: 2500 },
};

const GOAL_ADJUSTMENTS = {
  eco_save: { darkThreshold: 1200, wateringDurationSeconds: 8, fanDurationSeconds: 8, soilDryThreshold: 2300 },
  healthy_growth: { darkThreshold: 1600, wateringDurationSeconds: 12, fanDurationSeconds: 10 },
  low_maintenance: { darkThreshold: 1400, wateringDurationSeconds: 14, sensorIntervalSeconds: 7200 },
  fast_harvest: { darkThreshold: 1800, wateringDurationSeconds: 12, co2MinPpm: 900 },
  cost_efficient: { darkThreshold: 1100, wateringDurationSeconds: 8, fanDurationSeconds: 8 },
  beginner_safe: { darkThreshold: 1500, wateringDurationSeconds: 10, fanDurationSeconds: 10 },
};

function normalizePlantName(value = '') {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function normalizeGoals(value = []) {
  const list = Array.isArray(value) ? value : [value];
  const normalized = list
    .map(goal => String(goal || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''))
    .filter(Boolean)
    .slice(0, 2);
  return normalized.length ? normalized : ['beginner_safe'];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

function deterministicThresholds({ plants = [], goal_priority = [], packageLevel = 'standard' } = {}) {
  const goals = normalizeGoals(goal_priority);
  const plantKeys = plants.map(plant => normalizePlantName(plant.plant_type || plant.name || plant.species)).filter(Boolean);
  const profiles = plantKeys.length
    ? plantKeys.map(key => CROP_MATRIX[key] || CROP_MATRIX.default)
    : [CROP_MATRIX.default];

  const avg = (field) => profiles.reduce((sum, profile) => sum + Number(profile[field] || CROP_MATRIX.default[field]), 0) / profiles.length;

  const thresholds = {
    tempMin: Math.floor(avg('tempMin')),
    tempMax: Math.ceil(avg('tempMax')),
    humidityMin: Math.floor(avg('humidityMin')),
    humidityMax: Math.ceil(avg('humidityMax')),
    soilDryThreshold: Math.round(avg('soilDryThreshold')),
    darkThreshold: 1500,
    phMin: Number(avg('phMin').toFixed(1)),
    phMax: Number(avg('phMax').toFixed(1)),
    ecMin: Number(avg('ecMin').toFixed(1)),
    ecMax: Number(avg('ecMax').toFixed(1)),
    co2MinPpm: Math.round(avg('co2MinPpm')),
    gasDangerThreshold: SAFETY_LIMITS.gasDangerThreshold,
    waterLowCm: SAFETY_LIMITS.waterLowCm,
    wateringDurationSeconds: 10,
    fanDurationSeconds: 10,
    sensorIntervalSeconds: packageLevel === 'starter' ? 7200 : 3600,
  };

  goals.forEach(goal => Object.assign(thresholds, GOAL_ADJUSTMENTS[goal] || {}));

  thresholds.tempMin = clamp(thresholds.tempMin, 12, 24);
  thresholds.tempMax = clamp(thresholds.tempMax, thresholds.tempMin + 4, 35);
  thresholds.humidityMin = clamp(thresholds.humidityMin, 35, 75);
  thresholds.humidityMax = clamp(thresholds.humidityMax, thresholds.humidityMin + 10, 90);
  thresholds.phMin = clamp(thresholds.phMin, 5.0, 7.0);
  thresholds.phMax = clamp(thresholds.phMax, thresholds.phMin + 0.5, 7.8);
  thresholds.ecMin = clamp(thresholds.ecMin, 0.8, 2.4);
  thresholds.ecMax = clamp(thresholds.ecMax, thresholds.ecMin + 0.3, 3.8);
  thresholds.co2MinPpm = clamp(thresholds.co2MinPpm, 650, 1200);
  thresholds.gasDangerThreshold = SAFETY_LIMITS.gasDangerThreshold;
  thresholds.waterLowCm = SAFETY_LIMITS.waterLowCm;

  return {
    thresholds,
    notes: `${goals.map(labelGoal).join(' + ')} fallback recipe for ${plantKeys.join(', ') || 'mixed greens'}. Safety limits for gas and water level are fixed.`,
    source: 'fallback',
  };
}

function labelGoal(goal) {
  return goal.replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
}

function stripJson(text) {
  const cleaned = String(text || '').replace(/```json/g, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  return start >= 0 && end >= start ? cleaned.slice(start, end + 1) : '{}';
}

function sanitizeAiThresholds(parsed, fallback) {
  const raw = parsed.thresholds || parsed || {};
  const thresholds = { ...fallback.thresholds };
  Object.keys(thresholds).forEach(key => {
    if (raw[key] !== undefined && Number.isFinite(Number(raw[key]))) thresholds[key] = Number(raw[key]);
  });

  thresholds.gasDangerThreshold = SAFETY_LIMITS.gasDangerThreshold;
  thresholds.waterLowCm = SAFETY_LIMITS.waterLowCm;
  thresholds.tempMax = Math.max(thresholds.tempMin + 4, thresholds.tempMax);
  thresholds.humidityMax = Math.max(thresholds.humidityMin + 10, thresholds.humidityMax);
  thresholds.phMax = Math.max(thresholds.phMin + 0.5, thresholds.phMax);
  thresholds.ecMax = Math.max(thresholds.ecMin + 0.3, thresholds.ecMax);

  return {
    thresholds,
    notes: parsed.notes || fallback.notes,
    source: 'ai',
  };
}

async function generateThresholds(input = {}) {
  const normalizedInput = {
    plants: Array.isArray(input.plants) ? input.plants : [],
    goal_priority: normalizeGoals(input.goal_priority || input.goalPriority),
    packageLevel: input.packageLevel || 'standard',
  };

  const fallback = deterministicThresholds(normalizedInput);

  try {
    const prompt = `You are SeedDown's vertical farming threshold engine.
Return ONLY valid JSON, no markdown.

Plants: ${JSON.stringify(normalizedInput.plants)}
Goal priority: ${JSON.stringify(normalizedInput.goal_priority)}
Package level: ${normalizedInput.packageLevel}

Generate safe indoor vertical farm thresholds. Never relax safety thresholds: gasDangerThreshold must be ${SAFETY_LIMITS.gasDangerThreshold}, waterLowCm must be ${SAFETY_LIMITS.waterLowCm}.

Return exactly:
{"thresholds":{"tempMin":0,"tempMax":0,"humidityMin":0,"humidityMax":0,"soilDryThreshold":0,"darkThreshold":0,"phMin":0,"phMax":0,"ecMin":0,"ecMax":0,"co2MinPpm":0,"gasDangerThreshold":${SAFETY_LIMITS.gasDangerThreshold},"waterLowCm":${SAFETY_LIMITS.waterLowCm},"wateringDurationSeconds":0,"fanDurationSeconds":0,"sensorIntervalSeconds":0},"notes":"one practical sentence"}`;

    const text = await aiService.askText('Respond only with valid JSON for SeedDown IoT thresholds.', prompt, 700);
    const parsed = JSON.parse(stripJson(text));
    return sanitizeAiThresholds(parsed, fallback);
  } catch (error) {
    console.warn('[thresholdService] AI threshold fallback:', error.message);
    return fallback;
  }
}

module.exports = {
  generateThresholds,
  deterministicThresholds,
};
