const path = require('path');
const fs = require('fs');
const { forecastYieldAndRecipes, askText } = require('../services/aiService');
const { getMarketPricesForCrops } = require('../services/marketPriceService');

// ── Data helpers (JSON files only — no MongoDB) ──────────────────────────────

const CROPS_FILE   = path.join(__dirname, '../../crops_data.json');
const RECIPES_FILE = path.join(__dirname, '../../garden_recipes.json');
const VERTICAL_FARMING_RESOURCE_LINKS = [
  {
    label: 'Cornell Controlled Environment Agriculture',
    url: 'https://cea.cals.cornell.edu/',
  },
  {
    label: 'FAO protected cultivation and vertical farming reference',
    url: 'https://www.fao.org/climate-smart-agriculture-sourcebook/production-resources/module-b1-crops/chapter-b1-3/en/',
  },
  {
    label: 'UKY greens and microgreens labor/post-harvest profile',
    url: 'https://ccd.uky.edu/resources/crops/vegetables/greens',
  },
];

const DEFAULT_ENV_PROFILE = {
  tempIdeal: [18, 28],
  humidityIdeal: [50, 75],
  moistureIdeal: [45, 65],
  phIdeal: [5.8, 6.5],
  ecIdeal: [1.2, 2.0],
  waterDemand: 'moderate',
};

function loadCrops() {
  return JSON.parse(fs.readFileSync(CROPS_FILE, 'utf8'));
}

function findCrop(species) {
  return loadCrops().find(c => c.species === String(species).toLowerCase()) || null;
}

function cropKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function finiteNumber(value, fallback = null) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round1(value) {
  return Number.parseFloat(Number(value).toFixed(1));
}

function firstNumber(...values) {
  for (const value of values) {
    const n = finiteNumber(value, null);
    if (n !== null) return n;
  }
  return null;
}

function rangeMid(range) {
  return (range[0] + range[1]) / 2;
}

function signed(value, unit = '') {
  if (!Number.isFinite(value)) return `0${unit}`;
  if (Math.abs(value) < 0.05) return `0${unit}`;
  return `${value > 0 ? '+' : ''}${round1(value)}${unit}`;
}

function parseAiJson(raw) {
  const clean = String(raw || '').replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(clean);
  } catch {
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(clean.slice(start, end + 1));
    throw new Error('AI did not return valid JSON');
  }
}

function normaliseRange(value, fallback) {
  if (!Array.isArray(value) || value.length < 2) return fallback;
  const a = finiteNumber(value[0], null);
  const b = finiteNumber(value[1], null);
  if (a === null || b === null) return fallback;
  return [Math.min(a, b), Math.max(a, b)];
}

function normaliseImpact(value = {}, fallback = {}) {
  return {
    tempChange: finiteNumber(value.tempChange, fallback.tempChange ?? 0),
    humidChange: finiteNumber(value.humidChange, fallback.humidChange ?? 3),
    lightChange: finiteNumber(value.lightChange, fallback.lightChange ?? 1),
    waterChange: finiteNumber(value.waterChange, fallback.waterChange ?? 6),
    nutrientChange: finiteNumber(value.nutrientChange, fallback.nutrientChange ?? 5),
  };
}

function normaliseResourceLinks(links = []) {
  if (!Array.isArray(links)) return [];
  return links
    .map(link => ({
      label: String(link?.label || link?.title || link?.url || '').trim(),
      url: String(link?.url || '').trim(),
      note: link?.note ? String(link.note).trim() : undefined,
    }))
    .filter(link => /^https?:\/\//i.test(link.url))
    .slice(0, 5);
}

function cropWaterDemand(waterPerDay) {
  const water = finiteNumber(waterPerDay, null);
  if (water === null) return 'moderate';
  if (water >= 240) return 'high';
  if (water <= 130) return 'low';
  return 'moderate';
}

function moistureRangeFromWaterDemand(waterPerDay) {
  const demand = cropWaterDemand(waterPerDay);
  if (demand === 'high') return [50, 70];
  if (demand === 'low') return [38, 58];
  return [45, 65];
}

function cropEnvironmentProfile(species, cropSpec, aiSuitability) {
  const key = cropKey(species);
  const req = cropSpec?.requirements || {};
  const aiProfile = aiSuitability?.environmentProfile || {};
  const aiLinks = normaliseResourceLinks(aiSuitability?.resourceLinks || aiProfile.sources);
  const base = DEFAULT_ENV_PROFILE;

  return {
    cropKey: key,
    suitableForVerticalFarm: aiSuitability?.suitableForVerticalFarm ?? aiSuitability?.suitable,
    reason: aiSuitability?.reason || aiProfile.reason || null,
    moistureBasis: aiProfile.moistureBasis || aiSuitability?.moistureBasis || null,
    tempIdeal: normaliseRange(aiProfile.tempIdeal, (
      req.tempMin !== undefined && req.tempMax !== undefined ? [req.tempMin, req.tempMax] : base.tempIdeal
    )),
    humidityIdeal: normaliseRange(aiProfile.humidityIdeal, (
      req.humidityMin !== undefined && req.humidityMax !== undefined ? [req.humidityMin, req.humidityMax] : base.humidityIdeal
    )),
    moistureIdeal: normaliseRange(aiProfile.moistureIdeal, moistureRangeFromWaterDemand(req.waterPerDay)),
    phIdeal: normaliseRange(aiProfile.phIdeal, base.phIdeal),
    ecIdeal: normaliseRange(aiProfile.ecIdeal, base.ecIdeal),
    waterDemand: aiProfile.waterDemand || aiSuitability?.waterDemand || cropWaterDemand(req.waterPerDay),
    sources: aiLinks,
  };
}

function normalizeMoisture(sensors = {}) {
  const explicit = firstNumber(sensors.moisture, sensors.soilMoisture, sensors.water);
  if (explicit !== null) {
    return {
      value: round1(clamp(explicit, 0, 100)),
      source: sensors.moistureSource || sensors.source || 'sensor moisture percent',
      basis: 'explicit percent',
    };
  }

  const raw = firstNumber(sensors.soilRaw);
  if (raw !== null) {
    const calibration = sensors.calibration || {};
    const dryRaw = firstNumber(sensors.soilDryRaw, sensors.dryRaw, calibration.soilDryRaw, calibration.dryRaw, 0);
    const wetRaw = firstNumber(sensors.soilWetRaw, sensors.wetRaw, calibration.soilWetRaw, calibration.wetRaw, 4095);
    const span = wetRaw - dryRaw;
    const pct = span === 0 ? raw / 4095 * 100 : (raw - dryRaw) / span * 100;
    return {
      value: round1(clamp(pct, 0, 100)),
      source: span === 0 ? 'soilRaw scaled from 0-4095' : `soilRaw calibrated dry=${dryRaw}, wet=${wetRaw}`,
      basis: 'soilRaw',
    };
  }

  return { value: 45, source: 'fallback default', basis: 'fallback' };
}

function normalizeSensorState(sensors = {}) {
  const moisture = normalizeMoisture(sensors);
  const ec = firstNumber(sensors.ec, sensors.nutrientEc);
  const ecRaw = firstNumber(sensors.ecRaw);
  const nutrientFromEc = ec !== null ? clamp(ec / 2.4 * 100, 0, 100) : null;
  const nutrientFromRaw = ecRaw !== null ? clamp(ecRaw / 4095 * 100, 0, 100) : null;

  return {
    temp: finiteNumber(sensors.temp ?? sensors.temperature, 28),
    humid: finiteNumber(sensors.humid ?? sensors.humidity, 68),
    light: finiteNumber(sensors.light ?? sensors.lux, 82),
    water: moisture.value,
    moistureSource: moisture.source,
    moistureBasis: moisture.basis,
    nutrient: finiteNumber(sensors.nutrient, nutrientFromEc ?? nutrientFromRaw ?? 78),
    ph: firstNumber(sensors.ph),
    ec,
    createdAt: sensors.createdAt || null,
    source: sensors.source || moisture.source || 'sensor snapshot',
  };
}

function metricPlan({ key, label, current, ideal, unit = '', lowAction, highAction, maintainAction, hardMargin = 0 }) {
  const min = round1(Number(ideal[0]));
  const max = round1(Number(ideal[1]));
  const value = round1(current);
  const status = value < min ? 'low' : value > max ? 'high' : 'ideal';
  const target = status === 'ideal' ? value : round1(rangeMid([min, max]));
  const adjustment = round1(target - value);
  const action = status === 'low'
    ? lowAction
    : status === 'high'
      ? highAction
      : maintainAction;
  const severe = status === 'low'
    ? value < min - hardMargin
    : status === 'high'
      ? value > max + hardMargin
      : false;

  return {
    key,
    label,
    current: value,
    idealMin: min,
    idealMax: max,
    target,
    adjustment,
    unit,
    status,
    action,
    severe,
  };
}

function environmentPlan({ species, quantity, cropSpec, aiSuitability, sensors, impacts }) {
  const profile = cropEnvironmentProfile(species, cropSpec, aiSuitability);
  const current = normalizeSensorState(sensors);
  const moisture = metricPlan({
    key: 'moisture',
    label: 'Root moisture',
    current: current.water,
    ideal: profile.moistureIdeal,
    unit: '%',
    lowAction: 'increase irrigation',
    highAction: 'reduce irrigation and improve drainage/airflow',
    maintainAction: 'maintain current irrigation',
    hardMargin: 15,
  });
  const temp = metricPlan({
    key: 'temp',
    label: 'Temperature',
    current: current.temp,
    ideal: profile.tempIdeal,
    unit: 'C',
    lowAction: 'raise zone temperature',
    highAction: 'increase cooling or move the crop away from heat sources',
    maintainAction: 'maintain current temperature',
    hardMargin: 5,
  });
  const humidity = metricPlan({
    key: 'humidity',
    label: 'Humidity',
    current: current.humid,
    ideal: profile.humidityIdeal,
    unit: '%',
    lowAction: 'raise humidity gradually',
    highAction: 'increase airflow or dehumidification',
    maintainAction: 'maintain current humidity',
    hardMargin: 12,
  });
  const ph = current.ph === null ? null : metricPlan({
    key: 'ph',
    label: 'pH',
    current: current.ph,
    ideal: profile.phIdeal,
    unit: '',
    lowAction: 'raise pH before planting',
    highAction: 'lower pH before planting',
    maintainAction: 'maintain current pH',
    hardMargin: 0.6,
  });
  const ec = current.ec === null ? null : metricPlan({
    key: 'ec',
    label: 'EC',
    current: current.ec,
    ideal: profile.ecIdeal,
    unit: 'mS/cm',
    lowAction: 'increase nutrient strength',
    highAction: 'dilute nutrient strength',
    maintainAction: 'maintain current EC',
    hardMargin: 0.7,
  });

  const metrics = [moisture, temp, humidity, ph, ec].filter(Boolean);
  const warnings = metrics
    .filter(metric => metric.status !== 'ideal')
    .map(metric => `${metric.label} is ${metric.status}: ${metric.current}${metric.unit} vs ideal ${metric.idealMin}-${metric.idealMax}${metric.unit}`);

  if (impacts.nutrientChange > 20) {
    warnings.push(`nutrient demand increases significantly (+${impacts.nutrientChange}%)`);
  }
  if (impacts.waterChange > 20) {
    warnings.push(`water demand increases significantly (+${impacts.waterChange}%)`);
  }

  const blockingIssues = metrics
    .filter(metric => metric.severe)
    .map(metric => `${metric.label} too far outside ideal band`);

  return {
    species,
    quantity,
    safeToPlant: blockingIssues.length === 0,
    blockingIssues,
    profile,
    current,
    moisture,
    temp,
    humidity,
    ph,
    ec,
    warnings,
    calculation: {
      moistureFormula: moisture.status === 'ideal'
        ? 'target = current moisture because current is inside the crop ideal band'
        : 'target = midpoint of crop ideal moisture band; adjustment = target - current moisture',
      currentMoisture: moisture.current,
      idealMoistureMin: moisture.idealMin,
      idealMoistureMax: moisture.idealMax,
      targetMoisture: moisture.target,
      adjustmentPctPoints: moisture.adjustment,
      moistureSource: current.moistureSource,
      resourceWaterDemandDelta: impacts.waterChange,
    },
    sources: profile.sources || VERTICAL_FARMING_RESOURCE_LINKS,
  };
}

function advisorInsight(species, quantity, plan) {
  const count = Number(quantity) || 1;
  const unit = count === 1 ? 'row' : 'rows';
  const moisture = plan.moisture;
  const safety = plan.safeToPlant ? 'Safe' : 'Not ready';
  const ideal = `${moisture.idealMin}-${moisture.idealMax}${moisture.unit}`;
  const current = `${moisture.current}${moisture.unit}`;
  const target = `${moisture.target}${moisture.unit}`;
  const adjustment = signed(moisture.adjustment, moisture.unit === '%' ? ' percentage points' : ' points');

  if (moisture.status === 'ideal') {
    return `${safety} to add ${count} ${species} ${unit}: current root moisture is ${current}, inside the ${ideal} ideal band, so ${moisture.action} near ${target}.`;
  }
  return `${safety} to add ${count} ${species} ${unit}: current root moisture is ${current}, outside the ${ideal} ideal band, so ${moisture.action} toward ${target} (${adjustment}).`;
}

function defaultAdvisorAction(plan) {
  const moisture = plan.moisture;
  if (moisture.status === 'low') return 'Increase pump duration gradually and recheck the tray for 24-48 hours before adding more rows.';
  if (moisture.status === 'high') return 'Reduce watering first, improve airflow, and recheck the tray for 24-48 hours before adding more rows.';
  if (plan.humidity.status === 'high') return 'Keep airflow strong during the first two days to reduce mold risk.';
  if (plan.temp.status !== 'ideal') return 'Stabilize the zone temperature before scaling beyond this row count.';
  return 'Monitor the new row for 24-48 hours before scaling the planting plan.';
}

function cleanAiCareSentence(raw) {
  const clean = String(raw || '').replace(/```/g, '').replace(/\s+/g, ' ').trim();
  if (!clean || /[\d%]/.test(clean)) return '';
  const sentence = clean.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || clean;
  return sentence.length > 180 ? '' : sentence;
}

async function askAiCropProfile({ species, quantity, currentCrops, sensors, cropSpec }) {
  const cropContext = cropSpec ? {
    species: cropSpec.species,
    commonName: cropSpec.commonName,
    requirements: cropSpec.requirements,
    yield: cropSpec.yield,
    storedImpacts: cropSpec.impacts,
  } : null;
  const prompt = `You are SeedDown's crop suitability engine for an indoor vertical farm.
Use agricultural reasoning and public crop references. Do not assume every crop is suitable.
Assess the requested species and return only valid JSON, no markdown.

Farm context:
${JSON.stringify({
  species,
  quantity,
  currentCrops: currentCrops || [],
  sensors,
  cropContext,
}, null, 2)}

Return exactly this JSON shape:
{
  "suitable": true,
  "suitableForVerticalFarm": true,
  "reason": "4-6 practical sentences. If unsuitable, explain rack/shelf, root, canopy, crop-cycle, light, and commercial practicality details.",
  "estimatedHarvestDays": 60,
  "impacts": {
    "tempChange": 0,
    "humidChange": 0,
    "lightChange": 0,
    "waterChange": 0,
    "nutrientChange": 0
  },
  "environmentProfile": {
    "tempIdeal": [18, 28],
    "humidityIdeal": [50, 75],
    "moistureIdeal": [45, 65],
    "moistureBasis": "Explain whether this is a direct source range or an inferred sensor target.",
    "phIdeal": [5.8, 6.5],
    "ecIdeal": [1.2, 2.0],
    "waterDemand": "low | moderate | high | very high"
  },
  "warnings": ["specific operational warning"],
  "resourceLinks": [
    { "label": "source name", "url": "https://example.com", "note": "what this source supports" }
  ]
}

Rules:
- For species that are impractical for rack/shelf vertical farming, set suitable and suitableForVerticalFarm to false.
- resourceLinks must be real public URLs from credible sources such as university extension, FAO, government, or reputable crop guides.
- If you cannot identify credible source links, return an empty resourceLinks array rather than inventing URLs.
- moistureIdeal is a SeedDown target range for the app's normalized root-moisture percentage; say so in moistureBasis if it is inferred.`;

  const raw = await askText('Respond only with valid JSON, no markdown.', prompt, 900);
  const parsed = parseAiJson(raw);
  const fallbackImpact = cropSpec?.impacts || {};
  const profile = parsed.environmentProfile || {};
  return {
    suitable: parsed.suitable !== false && parsed.suitableForVerticalFarm !== false,
    suitableForVerticalFarm: parsed.suitableForVerticalFarm !== false && parsed.suitable !== false,
    reason: String(parsed.reason || '').trim(),
    estimatedHarvestDays: finiteNumber(parsed.estimatedHarvestDays, cropSpec?.requirements?.growthDays || 60),
    impacts: normaliseImpact(parsed.impacts, fallbackImpact),
    environmentProfile: {
      tempIdeal: normaliseRange(profile.tempIdeal, cropSpec?.requirements?.tempMin !== undefined ? [cropSpec.requirements.tempMin, cropSpec.requirements.tempMax] : DEFAULT_ENV_PROFILE.tempIdeal),
      humidityIdeal: normaliseRange(profile.humidityIdeal, cropSpec?.requirements?.humidityMin !== undefined ? [cropSpec.requirements.humidityMin, cropSpec.requirements.humidityMax] : DEFAULT_ENV_PROFILE.humidityIdeal),
      moistureIdeal: normaliseRange(profile.moistureIdeal, moistureRangeFromWaterDemand(cropSpec?.requirements?.waterPerDay)),
      moistureBasis: String(profile.moistureBasis || '').trim(),
      phIdeal: normaliseRange(profile.phIdeal, DEFAULT_ENV_PROFILE.phIdeal),
      ecIdeal: normaliseRange(profile.ecIdeal, DEFAULT_ENV_PROFILE.ecIdeal),
      waterDemand: String(profile.waterDemand || cropWaterDemand(cropSpec?.requirements?.waterPerDay)).trim(),
    },
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings.map(String).filter(Boolean).slice(0, 5) : [],
    resourceLinks: normaliseResourceLinks(parsed.resourceLinks),
    source: 'ai',
  };
}

function findRecipes(keywords, limit = 10) {
  const allRecipes = JSON.parse(fs.readFileSync(RECIPES_FILE, 'utf8'));
  const regex = new RegExp(keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
  return allRecipes
    .filter(r => r.ingredients.some(ing => regex.test(ing)))
    .slice(0, limit);
}

// ── GET /api/whatif/market-prices?crops=tomato,spinach ─────────────────────

exports.getMarketPrices = async (req, res) => {
  try {
    const cropList = String(req.query.crops || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => ({ id: item, name: item }));

    if (!cropList.length) {
      return res.status(400).json({ ok: false, error: 'crops query param required' });
    }

    const result = await getMarketPricesForCrops(cropList, {
      state: req.query.state || '',
      district: req.query.district || '',
    });

    res.json(result);
  } catch (err) {
    console.error('Market prices error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ── POST /api/whatif/forecast ────────────────────────────────────────────────

exports.getForecast = async (req, res) => {
  try {
    const { species, quantity = 1, days = 30, plantedDate } = req.body;

    const cropSpec = findCrop(species);
    if (!cropSpec) return res.status(404).json({ error: `Species "${species}" not found` });

    const keywords = cropSpec.recipeKeywords || [species];
    const recipes  = findRecipes(keywords, 10);

    const virtualCrop = {
      species,
      commonName:  cropSpec.commonName,
      quantity:    parseInt(quantity),
      plantedDate: plantedDate || new Date()
    };

    const analysis = await forecastYieldAndRecipes(virtualCrop, cropSpec, recipes, days);

    res.json({
      cropSpec,
      matchedRecipes: recipes.slice(0, 5).map(r => ({
        name:        r.name,
        ingredients: r.ingredients.slice(0, 4)
      })),
      aiAnalysis: analysis
    });

  } catch (err) {
    console.error('Forecast error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/whatif/recipes?species=tomato ───────────────────────────────────

exports.getRecipesBySpecies = async (req, res) => {
  try {
    const { species } = req.query;
    if (!species) return res.status(400).json({ error: 'species param required' });

    const cropSpec = findCrop(species);
    const keywords = cropSpec?.recipeKeywords || [species];
    const recipes  = findRecipes(keywords, 20);

    res.json({ species, count: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/whatif/costsaving ──────────────────────────────────────────────

exports.getCostAnalysis = async (req, res) => {
  try {
    const { plant, units, weeks, sensors } = req.body;

    const temp     = sensors?.temp     ?? 28;
    const humid    = sensors?.humid    ?? 68;
    const light    = sensors?.light    ?? 82;
    const water    = sensors?.water    ?? 45;
    const nutrient = sensors?.nutrient ?? 78;

    // Condition score (calculated, not AI)
    const tempScore     = temp >= 18 && temp <= 28 ? 100 : temp < 18 ? (temp / 18) * 100 : ((40 - temp) / 12) * 100;
    const humidScore    = humid >= 50 && humid <= 80 ? 100 : humid < 50 ? (humid / 50) * 100 : ((100 - humid) / 20) * 100;
    const moistureScore = water >= 40 && water <= 70 ? 100 : water < 40 ? (water / 40) * 100 : 80;
    const nutrientScore = nutrient >= 60 ? 100 : (nutrient / 60) * 100;
    const conditionScore = Math.round((tempScore + humidScore + moistureScore + nutrientScore) / 4);
    const conditionLabel = conditionScore >= 85 ? 'Optimal' : conditionScore >= 70 ? 'Good' : conditionScore >= 50 ? 'Fair' : 'Poor';

    // Water savings (calculated, not AI)
    const manualWaterPerPlantPerWeek = 3.5;
    const autoWaterPerPlantPerWeek   = water < 40 ? 2.5 : water > 70 ? 0.8 : 1.5;
    const manualWaterLiters = parseFloat((manualWaterPerPlantPerWeek * units * weeks).toFixed(1));
    const autoWaterLiters   = parseFloat((autoWaterPerPlantPerWeek   * units * weeks).toFixed(1));
    const waterSavedLiters  = parseFloat((manualWaterLiters - autoWaterLiters).toFixed(1));
    const waterCostSaved    = parseFloat((waterSavedLiters * 0.042).toFixed(2));

    // Energy savings (calculated, not AI)
    const manualLightHrs  = 12;
    const autoLightHrs    = light > 70 ? 6 : light > 40 ? 8 : 10;
    const energySavedkWh  = parseFloat(((manualLightHrs - autoLightHrs) * 0.04 * weeks * 7).toFixed(2));
    const energyCostSaved = parseFloat((energySavedkWh * 1.10).toFixed(2));
    const totalSavedRM    = parseFloat((waterCostSaved + energyCostSaved).toFixed(2));

    // AI writes insight only
    const prompt = `Agricultural AI for SeedDown. Write exactly 2 complete sentences about ${plant} garden conditions.
Temp ${temp}°C ${temp > 30 ? '(too hot)' : temp < 18 ? '(too cold)' : '(optimal)'}, Humidity ${humid}% ${humid < 50 ? '(too dry)' : humid > 80 ? '(too humid)' : '(good)'}, Moisture ${water}% ${water < 40 ? '(needs watering)' : '(good)'}, Nutrients ${nutrient}% ${nutrient < 60 ? '(low)' : '(ok)'}.
Condition: ${conditionScore}/100 (${conditionLabel}). Automation saved ${waterSavedLiters}L water + ${energySavedkWh}kWh energy = RM ${totalSavedRM}.
Sentence 1: describe current ${plant} conditions. Sentence 2: mention RM ${totalSavedRM} saved by automation.`;

    const raw     = await askText('', prompt, 200);
    const insight = raw.replace(/```/g, '').trim();

    res.json({
      conditionScore, conditionLabel,
      manualWaterLiters, autoWaterLiters, waterSavedLiters,
      manualEnergykWh: parseFloat((manualLightHrs * 0.04 * weeks * 7).toFixed(2)),
      autoEnergykWh:   parseFloat((autoLightHrs   * 0.04 * weeks * 7).toFixed(2)),
      energySavedkWh, waterCostSaved, energyCostSaved, totalSavedRM, insight
    });

  } catch (err) {
    console.error('Cost analysis error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/whatif/newplant ────────────────────────────────────────────────

exports.getNewPlantImpact = async (req, res) => {
  try {
    // ✅ FIX: destructure FIRST before using any variables
    const { species, quantity, currentCrops, sensors } = req.body;

    // ✅ FIX: guard against missing species
    if (!species) {
      return res.status(400).json({ error: 'species is required' });
    }

    const scale    = (quantity || 1) / 4;
    const cropSpec = findCrop(species);
    let aiSuitability = null;

    try {
      aiSuitability = await askAiCropProfile({ species, quantity, currentCrops, sensors, cropSpec });
    } catch (err) {
      console.warn('[WhatIf] AI species profile skipped:', err.message);
    }

    if (aiSuitability && aiSuitability.suitable === false) {
      const current = normalizeSensorState(sensors);
      const profile = cropEnvironmentProfile(species, cropSpec, aiSuitability);
      return res.json({
        unsuitable: true,
        impacts: aiSuitability.impacts || { tempChange:0, humidChange:0, lightChange:0, waterChange:0, nutrientChange:0 },
        projected: {
          temp: current.temp,
          humid: current.humid,
          light: current.light,
          water: current.water,
          nutrient: current.nutrient,
        },
        warnings: aiSuitability.warnings || [`"${species}" is not suitable for indoor vertical farming`],
        insight: aiSuitability.reason || `${species} is not a practical crop for compact indoor vertical farming.`,
        analysis: {
          ...aiSuitability,
          environmentProfile: profile,
        },
        resourceLinks: normaliseResourceLinks(aiSuitability.resourceLinks),
      });
    }

    const base     = aiSuitability?.impacts || cropSpec?.impacts || { tempChange:0, humidChange:3, lightChange:1, waterChange:6, nutrientChange:5 };

    const impacts = {
      tempChange:     parseFloat(Math.min((base.tempChange     || 0) * scale,  8).toFixed(1)),
      humidChange:    parseFloat(Math.min((base.humidChange    || 0) * scale, 30).toFixed(1)),
      lightChange:    parseFloat(((base.lightChange    || 0) * scale).toFixed(1)),
      waterChange:    parseFloat(Math.min((base.waterChange    || 0) * scale, 40).toFixed(1)),
      nutrientChange: parseFloat(Math.min((base.nutrientChange || 0) * scale, 30).toFixed(1)),
    };

    const plan = environmentPlan({ species, quantity, cropSpec, aiSuitability, sensors, impacts });
    const projected = {
      temp: plan.temp.target,
      humid: plan.humidity.target,
      light: parseFloat((plan.current.light + impacts.lightChange).toFixed(1)),
      water: plan.moisture.target,
      nutrient: parseFloat((plan.current.nutrient + impacts.nutrientChange).toFixed(1)),
    };
    const warnings = plan.warnings;
    const deterministicInsight = advisorInsight(species, quantity, plan);
    const prompt = `SeedDown indoor vertical farm advisor.
The backend has already calculated the sensor target. Do not invent any numbers or percentages.
Current crops: ${currentCrops?.join(', ') || 'mixed vegetables'}
Adding: ${quantity} ${species} rows
Calculated plan JSON:
${JSON.stringify({
  safeToPlant: plan.safeToPlant,
  rootMoisture: plan.moisture,
  temperature: plan.temp,
  humidity: plan.humidity,
  ph: plan.ph,
  ec: plan.ec,
  waterDemand: plan.profile.waterDemand,
  warnings: plan.warnings,
}, null, 2)}
Write one short operational care sentence only. Do not include any numbers, percentages, ranges, or target values.`;

    let aiCare = '';
    try {
      const raw = await askText('', prompt, 260);
      aiCare = cleanAiCareSentence(raw);
    } catch {
      aiCare = '';
    }
    const insight = `${deterministicInsight} ${aiCare || defaultAdvisorAction(plan)}`;

    res.json({
      impacts,
      resourceDelta: impacts,
      projected,
      targets: {
        temp: plan.temp,
        humidity: plan.humidity,
        moisture: plan.moisture,
        ph: plan.ph,
        ec: plan.ec,
      },
      environmentPlan: plan,
      warnings,
      insight,
      analysis: aiSuitability,
      resourceLinks: [...VERTICAL_FARMING_RESOURCE_LINKS, ...(plan.sources || [])],
    });

  } catch (err) {
    console.error('New plant impact error:', err);
    res.status(500).json({ error: err.message });
  }
};
// ── POST /api/whatif/newplant-ai ─────────────────────────────────────────────

exports.newPlantAiAnalysis = async (req, res) => {
  try {
    const { species, quantity, currentCrops, sensors } = req.body;

    if (!species) {
      return res.status(400).json({ error: 'species is required' });
    }

    const temp     = sensors?.temp     ?? 28;
    const humid    = sensors?.humid    ?? 68;
    const light    = sensors?.light    ?? 82;
    const water    = sensors?.water    ?? 45;
    const nutrient = sensors?.nutrient ?? 78;

    const cropSpec = findCrop(species);

    const prompt = `You are an agricultural AI expert for SeedDown indoor vertical farm.
Species requested: ${species} (${quantity || 1} plants)
Current crops in farm: ${currentCrops?.join(', ') || 'mixed vegetables'}
Current sensors: Humidity ${humid}%, Light ${light}%, Moisture ${water}%, Nutrients ${nutrient}%
Projected after adding: Humidity ${projected.humid}%, Moisture ${projected.water}%, Nutrients ${projected.nutrient}%
${cropSpec ? `Known crop data: growth days ${cropSpec.growthDays}, water needs ${cropSpec.waterNeeds}, light needs ${cropSpec.lightNeeds}` : `No crop data found for "${species}" in database — use general knowledge.`}

Respond in valid JSON only. No markdown, no explanation outside the JSON.
{
  "suitable": true or false,
  "compatibilityScore": 0-100,
  "reason": "one sentence why suitable or not",
  "careAdvice": "one sentence on how to care for this plant in this environment",
  "warnings": ["array of warning strings, empty array if none"],
  "estimatedHarvestDays": number or null
}`;

    const raw = await askText('', prompt, 300);

    let parsed;
    try {
      const clean = raw.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw });
    }

    res.json({
      species,
      quantity: quantity || 1,
      cropSpec: cropSpec || null,
      analysis: parsed
    });

  } catch (err) {
    console.error('New plant AI analysis error:', err);
    res.status(500).json({ error: err.message });
  }
};
