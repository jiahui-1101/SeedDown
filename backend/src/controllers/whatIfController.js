const path = require('path');
const fs = require('fs');
const { forecastYieldAndRecipes, askText } = require('../services/aiService');
const { getMarketPricesForCrops } = require('../services/marketPriceService');
const sensorService = require('../services/sensorService');

// ── Historical sensor data fetcher ────────────────────────────────────────────────
async function fetchHistoricalStats(body = {}) {
  const seen = new Set();
  const candidates = [];
  const push = (key, value) => {
    if (!value || value === 'farm_001') return;
    const sig = key + '=' + value;
    if (seen.has(sig)) return;
    seen.add(sig);
    candidates.push({ key, value });
  };

  push('deviceId', body.deviceId);
  push('deviceId', body.sensors && body.sensors.deviceId);
  push('zoneId',   body.zoneId   || (body.sensors && body.sensors.zoneId));
  push('farmId',   body.farmId   || (body.sensors && body.sensors.farmId));
  push('fieldId',  body.fieldId  || (body.sensors && body.sensors.fieldId));

  let readings = [];
  for (const cand of candidates) {
    try {
      const batch = await sensorService.getReadings({ [cand.key]: cand.value }, 200);
      if (Array.isArray(batch) && batch.length > 0) {
        readings = batch;
        console.log('[WhatIf] Historical data via ' + cand.key + '=' + cand.value + ' - ' + batch.length + ' readings');
        break;
      }
    } catch (err) {
      console.warn('[WhatIf] History candidate ' + cand.key + '=' + cand.value + ' failed:', err.message);
    }
  }

  if (!readings.length) return null;

  const avg = function(arr) { return arr.length ? arr.reduce(function(s, v) { return s + v; }, 0) / arr.length : null; };
  const trendDir = function(arr) {
    if (arr.length < 4) return 'stable';
    const chunk = Math.max(1, Math.floor(arr.length * 0.1));
    const early = avg(arr.slice(0, chunk));
    const late  = avg(arr.slice(-chunk));
    const delta = late - early;
    return delta > 1 ? 'rising' : delta < -1 ? 'falling' : 'stable';
  };
  const extract = function(field, rawField) {
    return readings.map(function(r) {
      const v = r[field];
      if (v !== undefined && v !== null && Number.isFinite(Number(v))) return Number(v);
      const raw = r[rawField];
      if (raw !== undefined && raw !== null && Number.isFinite(Number(raw)))
        return Math.max(0, Math.min(100, Number(raw) / 4095 * 100));
      return null;
    }).filter(function(v) { return v !== null; });
  };
  const alertPct = function(cmd) {
    const triggered = readings.filter(function(r) { return String(r.command || '').includes(cmd); }).length;
    return readings.length ? Math.round(triggered / readings.length * 100) : 0;
  };

  const moisture = extract('soilMoisture', 'soilRaw');
  const ec       = extract('ec', 'ecRaw');
  const temp     = extract('temperature', 'temp');
  const humid    = extract('humidity', 'humid');
  const ph       = extract('ph');

  return {
    totalReadings: readings.length,
    moisture: moisture.length ? {
      avg:              parseFloat(avg(moisture).toFixed(1)),
      min:              parseFloat(Math.min.apply(null, moisture).toFixed(1)),
      max:              parseFloat(Math.max.apply(null, moisture).toFixed(1)),
      trend:            trendDir(moisture),
      waterOnAlertPct:  alertPct('WATER_ON'),
    } : null,
    ec: ec.length ? {
      avg:              parseFloat(avg(ec).toFixed(2)),
      trend:            trendDir(ec),
      fertAlertPct:     alertPct('FERT_ALERT'),
    } : null,
    temp:  temp.length  ? { avg: parseFloat(avg(temp).toFixed(1)),  trend: trendDir(temp)  } : null,
    humid: humid.length ? { avg: parseFloat(avg(humid).toFixed(1)), trend: trendDir(humid) } : null,
    ph:    ph.length    ? { avg: parseFloat(avg(ph).toFixed(2)),    trend: trendDir(ph)    } : null,
  };
}

// ── Data helpers ──────────────────────────────────────────────────────────────

const CROPS_FILE   = path.join(__dirname, '../../crops_data.json');
const RECIPES_FILE = path.join(__dirname, '../../garden_recipes.json');
const DEFAULT_ENV_PROFILE = {
  tempIdeal: [18, 28],
  humidityIdeal: [50, 75],
  moistureIdeal: [45, 65],
  phIdeal: [5.8, 6.5],
  ecIdeal: [1.2, 2.0],
  waterDemand: 'moderate',
};

// Malaysian utility rates (2024)
const RATES = {
  waterRM:  0.042,   // RM / litre  — Syabas domestic block 1
  energyRM: 1.10,    // RM / kWh    — TNB domestic block 1
  fertRM:   0.085,   // RM / mL     — hydroponic nutrient solution avg
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

function roundTo(value, digits = 1, fallback = 0) {
  const n = finiteNumber(value, fallback);
  return Number.parseFloat(n.toFixed(digits));
}

function firstNumber(...values) {
  for (const value of values) {
    const n = finiteNumber(value, null);
    if (n !== null) return n;
  }
  return null;
}

function normalizePlantingScale(body = {}) {
  const rowCount = Math.max(1, Math.round(finiteNumber(body.rowCount ?? body.rows ?? body.quantity, 1)));
  const unitsPerRow = Math.max(1, Math.round(finiteNumber(body.unitsPerRow, 1)));
  const totalUnits = Math.max(1, Math.round(finiteNumber(body.totalUnits, rowCount * unitsPerRow)));
  return {
    rowCount,
    unitsPerRow,
    totalUnits,
    label: `${rowCount} ${rowCount === 1 ? 'row' : 'rows'} × ${unitsPerRow} ${unitsPerRow === 1 ? 'unit' : 'units'}/row = ${totalUnits} total ${totalUnits === 1 ? 'unit' : 'units'}`,
  };
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
  const raw = firstNumber(sensors.soilRaw);
  const explicit = firstNumber(sensors.moisture, sensors.soilMoisture, sensors.water);

  if (explicit !== null) {
    return {
      value: round1(clamp(explicit, 0, 100)),
      source: sensors.moistureSource || sensors.source || 'sensor moisture percent',
      basis: sensors.moistureBasis || (raw !== null ? 'soilRaw normalized percent' : 'explicit percent'),
      unit: sensors.moistureUnit || '%',
      rawValue: raw,
      rawUnit: sensors.soilRawUnit || sensors.sensorRawUnit || (raw !== null ? 'ADC count (0-4095)' : null),
      normalizedFormula: sensors.moistureFormula || (raw !== null
        ? 'soil moisture % = clamp(soilRaw / 4095 x 100, 0, 100)'
        : 'soil moisture % = Firebase percent reading'),
      calibrated: false, // explicit % from Firebase — no ADC calibration needed
    };
  }

  if (raw !== null) {
    // ── Calibrated conversion ─────────────────────────────────────────────────
    // Prefer calibration constants forwarded from the frontend (farm.sensorCalibration).
    // Fall back to sensor-level fields, then a safe uncalibrated approximation.
    const calibration = sensors.calibration || {};
    const dryRaw = firstNumber(
      sensors.soilDryRaw, sensors.dryRaw,
      calibration.soilDryRaw, calibration.dryRaw,
      calibration.dry,
    );
    const wetRaw = firstNumber(
      sensors.soilWetRaw, sensors.wetRaw,
      calibration.soilWetRaw, calibration.wetRaw,
      calibration.wet,
    );
    const hasCalibration = dryRaw !== null && wetRaw !== null;
    const dryVal = dryRaw ?? 0;
    const wetVal = wetRaw ?? 4095;
    const span   = wetVal - dryVal;
    const pct    = span === 0 ? raw / 4095 * 100 : (raw - dryVal) / span * 100;

    return {
      value: round1(clamp(pct, 0, 100)),
      source: hasCalibration && span !== 0
        ? `soilRaw calibrated (dry=${dryVal}, wet=${wetVal})`
        : 'soilRaw uncalibrated approx (0-4095) — set dry/wet calibration in device settings',
      basis: 'soilRaw',
      unit: '%',
      rawValue: raw,
      rawUnit: 'ADC count (0-4095)',
      normalizedFormula: !hasCalibration || span === 0
        ? 'APPROX ONLY: soil moisture % = clamp(soilRaw / 4095 × 100, 0, 100)'
        : `soil moisture % = clamp((soilRaw - ${dryVal}) / (${wetVal} - ${dryVal}) × 100, 0, 100)`,
      calibrated: hasCalibration && span !== 0,
    };
  }

  return {
    value: 45,
    source: 'fallback default',
    basis: 'fallback',
    unit: '%',
    rawValue: null,
    rawUnit: null,
    normalizedFormula: 'soil moisture % = fallback default — no Firebase moisture field available',
    calibrated: false,
  };
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
    moistureUnit: moisture.unit,
    moistureCalibrated: moisture.calibrated,
    soilRaw: moisture.rawValue,
    sensorRawUnit: moisture.rawUnit,
    normalizedMoistureFormula: moisture.normalizedFormula,
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

  return { key, label, current: value, idealMin: min, idealMax: max, target, adjustment, unit, status, action, severe };
}

function environmentPlan({ species, quantity, planting, cropSpec, aiSuitability, sensors, impacts }) {
  const profile = cropEnvironmentProfile(species, cropSpec, aiSuitability);
  const current = normalizeSensorState(sensors);
  const moisture = metricPlan({
    key: 'moisture', label: 'Root moisture', current: current.water,
    ideal: profile.moistureIdeal, unit: '%',
    lowAction: 'increase irrigation',
    highAction: 'reduce irrigation and improve drainage/airflow',
    maintainAction: 'maintain current irrigation', hardMargin: 15,
  });
  const temp = metricPlan({
    key: 'temp', label: 'Temperature', current: current.temp,
    ideal: profile.tempIdeal, unit: 'C',
    lowAction: 'raise zone temperature',
    highAction: 'increase cooling or move the crop away from heat sources',
    maintainAction: 'maintain current temperature', hardMargin: 5,
  });
  const humidity = metricPlan({
    key: 'humidity', label: 'Humidity', current: current.humid,
    ideal: profile.humidityIdeal, unit: '%',
    lowAction: 'raise humidity gradually',
    highAction: 'increase airflow or dehumidification',
    maintainAction: 'maintain current humidity', hardMargin: 12,
  });
  const ph = current.ph === null ? null : metricPlan({
    key: 'ph', label: 'pH', current: current.ph,
    ideal: profile.phIdeal, unit: '',
    lowAction: 'raise pH before planting',
    highAction: 'lower pH before planting',
    maintainAction: 'maintain current pH', hardMargin: 0.6,
  });
  const ec = current.ec === null ? null : metricPlan({
    key: 'ec', label: 'EC', current: current.ec,
    ideal: profile.ecIdeal, unit: 'mS/cm',
    lowAction: 'increase nutrient strength',
    highAction: 'dilute nutrient strength',
    maintainAction: 'maintain current EC', hardMargin: 0.7,
  });

  const metrics = [moisture, temp, humidity, ph, ec].filter(Boolean);
  const warnings = metrics
    .filter(m => m.status !== 'ideal')
    .map(m => `${m.label} is ${m.status}: ${m.current}${m.unit} vs ideal ${m.idealMin}-${m.idealMax}${m.unit}`);

  if (impacts.nutrientChange > 20) warnings.push(`nutrient demand increases significantly (+${impacts.nutrientChange}%)`);
  if (impacts.waterChange > 20)    warnings.push(`water demand increases significantly (+${impacts.waterChange}%)`);

  const blockingIssues = metrics.filter(m => m.severe).map(m => `${m.label} too far outside ideal band`);

  return {
    species, quantity, planting,
    safeToPlant: blockingIssues.length === 0,
    blockingIssues, profile, current,
    moisture, temp, humidity, ph, ec,
    warnings,
    calculation: {
      moistureFormula: moisture.status === 'ideal'
        ? 'target = current moisture because current is inside the crop ideal band'
        : 'target = midpoint of crop ideal moisture band; adjustment = target - normalized current moisture',
      currentMoisture: moisture.current,
      idealMoistureMin: moisture.idealMin,
      idealMoistureMax: moisture.idealMax,
      targetMoisture: moisture.target,
      adjustmentPctPoints: moisture.adjustment,
      moistureSource: current.moistureSource,
      moistureUnit: current.moistureUnit,
      moistureBasis: current.moistureBasis,
      moistureCalibrated: current.moistureCalibrated,
      soilRaw: current.soilRaw,
      sensorRawUnit: current.sensorRawUnit,
      normalizedMoistureFormula: current.normalizedMoistureFormula,
      rowCount: planting?.rowCount,
      unitsPerRow: planting?.unitsPerRow,
      totalUnits: planting?.totalUnits,
      resourceWaterDemandDelta: impacts.waterChange,
    },
    sources: profile.sources || [],
  };
}

/**
 * Translates the environmentPlan + normalizeSensorState result into the
 * sensorGap shape consumed by WhatIfPro.js _sensorGapHtml().
 *
 * Shape per entry:
 *   { label, current, idealMin, idealMax, target, delta, action, status, unit, calibrated? }
 *
 * action values: 'increase' | 'reduce' | 'maintain' | 'unknown'
 * status values: 'ok' | 'below' | 'above' | 'no_data'
 */
function buildSensorGap(plan) {
  const mapStatus = (s) => s === 'ideal' ? 'ok' : s === 'low' ? 'below' : s === 'high' ? 'above' : 'unknown';
  const mapAction = (a = '') => {
    if (!a) return 'unknown';
    const l = a.toLowerCase();
    if (l.startsWith('increase') || l.startsWith('raise')) return 'increase';
    if (l.startsWith('reduce') || l.startsWith('lower') || l.startsWith('dilute')) return 'reduce';
    if (l.startsWith('maintain')) return 'maintain';
    return 'maintain';
  };

  const toGap = (m, labelOverride, unitOverride, calibrated) => {
    if (!m) return null;
    return {
      label:    labelOverride || m.label,
      current:  m.current,
      idealMin: m.idealMin,
      idealMax: m.idealMax,
      target:   m.target,
      delta:    round1(m.target - m.current),
      action:   mapAction(m.action),
      status:   mapStatus(m.status),
      unit:     unitOverride || m.unit || '',
      ...(calibrated !== undefined ? { calibrated } : {}),
    };
  };

  const gap = {
    moisture:    toGap(plan.moisture,  'Soil Moisture', '%', plan.current?.moistureCalibrated),
    temperature: toGap(plan.temp,      'Temperature',   '°C'),
    humidity:    toGap(plan.humidity,  'Humidity',      '%'),
  };
  if (plan.ph) gap.ph   = toGap(plan.ph,  'pH', '');
  if (plan.ec) gap.ec   = toGap(plan.ec,  'EC', ' mS/cm');

  return gap;
}

/**
 * Builds the demand summary consumed by WhatIfPro.js _sensorGapHtml().
 * Uses planting scale + crop profile data — never sensor readings.
 *
 * Shape: { waterLPerDay, waterLPerMonth, waterCostPerMonth,
 *          fertMLPerWeek, fertCostPerMonth,
 *          lightKWhPerMonth, lightCostPerMonth,
 *          totalMonthlyCostRM, totalCycleRM }
 */
function buildDemand(planting, cropSpec, aiSuitability) {
  const req          = cropSpec?.requirements || {};
  const rows         = Math.max(1, planting.rowCount || 1);
  const plantsPerRow = Math.max(1, planting.unitsPerRow || 1);
  const growDays     = finiteNumber(req.growthDays || aiSuitability?.estimatedHarvestDays, 60);
  const weeksPerMonth = 4.33;

  // Water: waterPerDay is mL/plant/day
  const waterMLPerDayPerPlant  = finiteNumber(req.waterPerDay, 150);
  const waterLPerDay           = parseFloat(((waterMLPerDayPerPlant * plantsPerRow * rows) / 1000).toFixed(2));
  const waterLPerMonth         = parseFloat((waterLPerDay * 30).toFixed(1));
  const waterCostPerMonth      = parseFloat((waterLPerMonth * RATES.waterRM).toFixed(2));

  // Fertilizer: fertilizerPerWeek is g/plant
  const fertMLPerWeekPerPlant  = finiteNumber(req.fertilizerPerWeek, 3);
  const fertMLPerWeek          = parseFloat((fertMLPerWeekPerPlant * plantsPerRow * rows).toFixed(1));
  const fertCostPerMonth       = parseFloat((fertMLPerWeek * weeksPerMonth * RATES.fertRM).toFixed(2));

  // Light: lightHours/day, assume 40W LED per row
  const lightHoursPerDay       = finiteNumber(req.lightHours, 6);
  const lightWattsPerRow       = 40;
  const lightKWhPerMonth       = parseFloat((lightHoursPerDay * lightWattsPerRow * rows / 1000 * 30).toFixed(2));
  const lightCostPerMonth      = parseFloat((lightKWhPerMonth * RATES.energyRM).toFixed(2));

  const totalMonthlyCostRM     = parseFloat((waterCostPerMonth + fertCostPerMonth + lightCostPerMonth).toFixed(2));
  const totalCycleRM           = parseFloat((totalMonthlyCostRM * (growDays / 30)).toFixed(2));

  return {
    rows,
    plantsPerRow,
    waterLPerDay,
    waterLPerMonth,
    waterCostPerMonth,
    fertMLPerWeek,
    fertCostPerMonth,
    lightKWhPerMonth,
    lightCostPerMonth,
    totalMonthlyCostRM,
    totalCycleRM,
  };
}

function advisorInsight(species, planting, plan) {
  const count = Number(planting?.rowCount) || Number(plan.quantity) || 1;
  const unit = count === 1 ? 'row' : 'rows';
  const unitText = planting?.unitsPerRow
    ? ` (${planting.unitsPerRow} ${planting.unitsPerRow === 1 ? 'unit' : 'units'}/row, ${planting.totalUnits} total ${planting.totalUnits === 1 ? 'unit' : 'units'})`
    : '';
  const moisture = plan.moisture;
  const safety = plan.safeToPlant ? 'Safe' : 'Not ready';
  const ideal = `${moisture.idealMin}-${moisture.idealMax}${moisture.unit}`;
  const current = `${moisture.current}${moisture.unit}`;
  const target = `${moisture.target}${moisture.unit}`;
  const adjustment = signed(moisture.adjustment, moisture.unit === '%' ? ' percentage points' : ' points');

  if (moisture.status === 'ideal') {
    return `${safety} to add ${count} ${species} ${unit}${unitText}: current root moisture is ${current}, inside the ${ideal} ideal band, so ${moisture.action} near ${target}.`;
  }
  return `${safety} to add ${count} ${species} ${unit}${unitText}: current root moisture is ${current}, outside the ${ideal} ideal band, so ${moisture.action} toward ${target} (${adjustment}).`;
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

async function askAiCropProfile({ species, quantity, planting, currentCrops, sensors, cropSpec, historicalStats }) {
  const cropContext = cropSpec ? {
    species: cropSpec.species,
    commonName: cropSpec.commonName,
    requirements: cropSpec.requirements,
    yield: cropSpec.yield,
    storedImpacts: cropSpec.impacts,
  } : null;

  const histSection = historicalStats
    ? [
        '=== REAL 30-DAY FIREBASE SENSOR HISTORY (' + historicalStats.totalReadings + ' readings) ===',
        historicalStats.moisture
          ? 'Soil moisture: avg ' + historicalStats.moisture.avg + '%, min ' + historicalStats.moisture.min + '%, max ' + historicalStats.moisture.max + '%, trend ' + historicalStats.moisture.trend + ', WATER_ON alerts ' + historicalStats.moisture.waterOnAlertPct + '% of readings'
          : 'Soil moisture: no data',
        historicalStats.ec
          ? 'EC (nutrient): avg ' + historicalStats.ec.avg + ' mS/cm, trend ' + historicalStats.ec.trend + ', FERT_ALERT ' + historicalStats.ec.fertAlertPct + '% of readings'
          : 'EC: no data',
        historicalStats.temp
          ? 'Temperature: avg ' + historicalStats.temp.avg + 'C, trend ' + historicalStats.temp.trend
          : 'Temperature: no data',
        historicalStats.humid
          ? 'Humidity: avg ' + historicalStats.humid.avg + '%, trend ' + historicalStats.humid.trend
          : 'Humidity: no data',
        historicalStats.ph
          ? 'pH: avg ' + historicalStats.ph.avg + ', trend ' + historicalStats.ph.trend
          : 'pH: no data',
        '',
        'Use this real history to:',
        '- Assess whether current farm conditions actually suit this species (not just the latest reading)',
        '- Adjust moistureIdeal and ecIdeal targets based on observed trends',
        '- Add historically-grounded warnings (e.g. if moisture trend is falling, warn about dry conditions)',
        '- Set waterChange and nutrientChange impacts higher if history shows frequent alerts',
      ].join('\n')
    : '=== NO HISTORICAL DATA AVAILABLE — base assessment on latest sensor snapshot only ===';

  const prompt =
    'You are SeedDown crop suitability engine for an indoor vertical farm.\n' +
    'Use agricultural reasoning and public crop references. Do not assume every crop is suitable.\n' +
    'Assess the requested species and return only valid JSON, no markdown.\n\n' +
    histSection + '\n\n' +
    '=== CURRENT FARM CONTEXT ===\n' +
    JSON.stringify({ species, quantity, planting, currentCrops: currentCrops || [], latestSensorSnapshot: sensors, cropContext }, null, 2) + '\n\n' +
    'Return exactly this JSON shape:\n' +
    '{\n' +
    '  "suitable": true,\n' +
    '  "suitableForVerticalFarm": true,\n' +
    '  "reason": "4-6 practical sentences. Reference the historical sensor data where relevant. If unsuitable, explain rack/shelf, root, canopy, crop-cycle, light, and commercial practicality details.",\n' +
    '  "estimatedHarvestDays": 60,\n' +
    '  "impacts": { "tempChange": 0, "humidChange": 0, "lightChange": 0, "waterChange": 0, "nutrientChange": 0 },\n' +
    '  "environmentProfile": {\n' +
    '    "tempIdeal": [18, 28],\n' +
    '    "humidityIdeal": [50, 75],\n' +
    '    "moistureIdeal": [45, 65],\n' +
    '    "moistureBasis": "Explain whether this is a direct source range or an inferred sensor target. Reference historical avg if available.",\n' +
    '    "phIdeal": [5.8, 6.5],\n' +
    '    "ecIdeal": [1.2, 2.0],\n' +
    '    "waterDemand": "low | moderate | high | very high"\n' +
    '  },\n' +
    '  "warnings": ["specific operational warning grounded in historical data if available"],\n' +
    '  "resourceLinks": [{ "label": "source name", "url": "https://example.com", "note": "what this source supports" }]\n' +
    '}\n\n' +
    'Rules:\n' +
    '- For species that are impractical for rack/shelf vertical farming, set suitable and suitableForVerticalFarm to false.\n' +
    '- resourceLinks must be real public URLs from credible sources (university extension, FAO, government, reputable crop guides).\n' +
    '- If you cannot identify credible source links, return an empty resourceLinks array rather than inventing URLs.\n' +
    '- Firebase soil moisture usually arrives as soilRaw ADC counts; the app normalizes that to a 0-100 root-moisture percentage.\n' +
    '- moistureIdeal is a SeedDown target range for the normalized root-moisture percentage; say so in moistureBasis.\n' +
    '- If historical moisture trend is falling, increase waterChange impact and add a drying-conditions warning.\n' +
    '- If historical EC trend is falling, increase nutrientChange impact and add a nutrient-depletion warning.';

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

// ── GET /api/whatif/market-prices ─────────────────────────────────────────────

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

// ── POST /api/whatif/forecast ─────────────────────────────────────────────────

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
      plantedDate: plantedDate || new Date(),
    };

    const analysis = await forecastYieldAndRecipes(virtualCrop, cropSpec, recipes, days);

    res.json({
      cropSpec,
      matchedRecipes: recipes.slice(0, 5).map(r => ({
        name:        r.name,
        ingredients: r.ingredients.slice(0, 4),
      })),
      aiAnalysis: analysis,
    });
  } catch (err) {
    console.error('Forecast error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/whatif/recipes ───────────────────────────────────────────────────

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

// ── POST /api/whatif/costsaving ───────────────────────────────────────────────

exports.getCostAnalysis = async (req, res) => {
  try {
    const { plant, units, weeks, sensors } = req.body;

    const state     = normalizeSensorState(sensors || {});
    const temp      = state.temp;
    const humid     = state.humid;
    const light     = state.light;
    const water     = state.water;
    const nutrient  = state.nutrient;
    const unitCount = Math.max(1, finiteNumber(units, 1));
    const weekCount = Math.max(1, finiteNumber(weeks, 4));

    // ── Deterministic calculations ──────────────────────────────────────────
    const tempScore     = temp  >= 18 && temp  <= 28 ? 100 : temp  < 18 ? (temp  / 18)  * 100 : ((40 - temp)   / 12) * 100;
    const humidScore    = humid >= 50 && humid <= 80 ? 100 : humid < 50 ? (humid / 50)  * 100 : ((100 - humid) / 20) * 100;
    const moistureScore = water >= 40 && water <= 70 ? 100 : water < 40 ? (water / 40)  * 100 : 80;
    const nutrientScore = nutrient >= 60 ? 100 : (nutrient / 60) * 100;
    const conditionScore = Math.round((tempScore + humidScore + moistureScore + nutrientScore) / 4);
    const conditionLabel = conditionScore >= 85 ? 'Optimal' : conditionScore >= 70 ? 'Good' : conditionScore >= 50 ? 'Fair' : 'Poor';

    const manualWaterPerPlantPerWeek = 3.5;
    const autoWaterPerPlantPerWeek   = water < 40 ? 2.5 : water > 70 ? 0.8 : 1.5;
    const manualWaterLiters = parseFloat((manualWaterPerPlantPerWeek * unitCount * weekCount).toFixed(1));
    const autoWaterLiters   = parseFloat((autoWaterPerPlantPerWeek   * unitCount * weekCount).toFixed(1));
    const waterSavedLiters  = parseFloat((manualWaterLiters - autoWaterLiters).toFixed(1));
    const waterCostSaved    = parseFloat((waterSavedLiters * RATES.waterRM).toFixed(2));

    const manualLightHrs  = 12;
    const autoLightHrs    = light > 70 ? 6 : light > 40 ? 8 : 10;
    const energySavedkWh  = parseFloat(((manualLightHrs - autoLightHrs) * 0.04 * weekCount * 7).toFixed(2));
    const energyCostSaved = parseFloat((energySavedkWh * RATES.energyRM).toFixed(2));
    const totalSavedRM    = parseFloat((waterCostSaved + energyCostSaved).toFixed(2));

    // ── AI explains the result only — no number invention ──────────────────
    const prompt =
      `Agricultural AI for SeedDown. Write exactly 2 complete sentences about ${plant} garden conditions.\n` +
      `Temp ${temp}°C ${temp > 30 ? '(too hot)' : temp < 18 ? '(too cold)' : '(optimal)'}, ` +
      `Humidity ${humid}% ${humid < 50 ? '(too dry)' : humid > 80 ? '(too humid)' : '(good)'}, ` +
      `Moisture ${water}% ${water < 40 ? '(needs watering)' : '(good)'}, ` +
      `Nutrients ${nutrient}% ${nutrient < 60 ? '(low)' : '(ok)'}.\n` +
      `Condition: ${conditionScore}/100 (${conditionLabel}). Automation saved ${waterSavedLiters}L water + ${energySavedkWh}kWh energy = RM ${totalSavedRM}.\n` +
      `Sentence 1: describe current ${plant} conditions. Sentence 2: mention RM ${totalSavedRM} saved by automation.`;

    const raw     = await askText('', prompt, 200);
    const insight = raw.replace(/```/g, '').trim();

    res.json({
      conditionScore, conditionLabel,
      manualWaterLiters, autoWaterLiters, waterSavedLiters,
      manualEnergykWh: parseFloat((manualLightHrs * 0.04 * weekCount * 7).toFixed(2)),
      autoEnergykWh:   parseFloat((autoLightHrs   * 0.04 * weekCount * 7).toFixed(2)),
      energySavedkWh, waterCostSaved, energyCostSaved, totalSavedRM, insight,
    });
  } catch (err) {
    console.error('Cost analysis error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/whatif/newplant ─────────────────────────────────────────────────

exports.getNewPlantImpact = async (req, res) => {
  try {
    const { species, quantity, currentCrops } = req.body;

    if (!species) {
      return res.status(400).json({ error: 'species is required' });
    }

    const planting = normalizePlantingScale(req.body);

    // ── 1. Fetch live sensor data ─────────────────────────────────────────────
    let sensors = req.body.sensors;
    if (!sensors || !Object.keys(sensors).length) {
      try {
        sensors = await sensorService.getLatestReading({
          deviceId: req.body.deviceId || req.query.deviceId || 'farm_001',
          farmId:   req.body.farmId   || req.query.farmId,
          fieldId:  req.body.fieldId  || req.query.fieldId,
          zoneId:   req.body.zoneId   || req.query.zoneId,
        });
      } catch (err) {
        console.warn('[WhatIf] Firebase sensor fetch failed:', err.message);
        sensors = {};
      }
    }
    sensors = sensors || {};

    // ── 2. Merge calibration constants from frontend (farm.sensorCalibration) ─
    // The frontend sends these so normalizeMoisture() can convert soilRaw to
    // a calibrated moisture % instead of using the uncalibrated soilRaw / 4095.
    const calibration = req.body.calibration || {};
    if (Object.keys(calibration).length) {
      sensors = { ...sensors, calibration };
    }

    // ── 3. Fetch 30-day historical stats from Firebase ───────────────────────
    let historicalStats = null;
    try {
      historicalStats = await fetchHistoricalStats(req.body);
      if (historicalStats) {
        console.log('[WhatIf] Historical stats loaded:', historicalStats.totalReadings, 'readings');
      }
    } catch (err) {
      console.warn('[WhatIf] Historical stats fetch failed (non-fatal):', err.message);
    }

    // ── 4. AI crop profile ────────────────────────────────────────────────────
    const cropSpec = findCrop(species);
    let aiSuitability = null;

    try {
      aiSuitability = await askAiCropProfile({ species, quantity, planting, currentCrops, sensors, cropSpec, historicalStats });
    } catch (err) {
      console.warn('[WhatIf] AI species profile failed:', err.message);
      return res.status(503).json({
        error: 'AI crop profile unavailable',
        message: 'New plant suitability needs an AI-generated crop profile with source links. Configure GROQ_API_KEY, GEMINI_API_KEY_2, or GEMINI_API_KEY and try again.',
      });
    }

    // ── 5. Unsuitable → return early with AI explanation ─────────────────────
    if (aiSuitability && aiSuitability.suitable === false) {
      const current = normalizeSensorState(sensors);
      const profile = cropEnvironmentProfile(species, cropSpec, aiSuitability);
      return res.json({
        unsuitable: true,
        impacts: aiSuitability.impacts || { tempChange: 0, humidChange: 0, lightChange: 0, waterChange: 0, nutrientChange: 0 },
        projected: {
          temp: current.temp, humid: current.humid,
          light: current.light, water: current.water, nutrient: current.nutrient,
        },
        sensorGap: null,
        demand: null,
        warnings: aiSuitability.warnings || [`"${species}" is not suitable for indoor vertical farming`],
        insight: aiSuitability.reason || `${species} is not a practical crop for compact indoor vertical farming.`,
        planting,
        analysis: { ...aiSuitability, environmentProfile: profile },
        resourceLinks: normaliseResourceLinks(aiSuitability.resourceLinks),
      });
    }

    // ── 6. Deterministic impact + plan ────────────────────────────────────────
    const base = normaliseImpact(
      aiSuitability?.impacts || cropSpec?.impacts,
      { tempChange: 0, humidChange: 3, lightChange: 1, waterChange: 6, nutrientChange: 5 }
    );

    const impacts = {
      tempChange:     roundTo(Math.min(base.tempChange     * (planting.totalUnits / 4),  8)),
      humidChange:    roundTo(Math.min(base.humidChange    * (planting.totalUnits / 4), 30)),
      lightChange:    roundTo(base.lightChange             * (planting.totalUnits / 4)),
      waterChange:    roundTo(Math.min(base.waterChange    * (planting.totalUnits / 4), 40)),
      nutrientChange: roundTo(Math.min(base.nutrientChange * (planting.totalUnits / 4), 30)),
    };

    const plan = environmentPlan({ species, quantity, planting, cropSpec, aiSuitability, sensors, impacts });

    // ── 7. Translate plan → sensorGap + demand for the frontend ──────────────
    // sensorGap: deterministic current vs ideal band comparison (no AI numbers)
    // demand: extra resource cost from adding these rows (crop profile only)
    const sensorGap = buildSensorGap(plan);
    const demand    = buildDemand(planting, cropSpec, aiSuitability);

    const projected = {
      temp:     plan.temp.target,
      humid:    plan.humidity.target,
      light:    roundTo(plan.current.light + impacts.lightChange, 1, plan.current.light),
      water:    plan.moisture.target,
      nutrient: roundTo(plan.current.nutrient + impacts.nutrientChange, 1, plan.current.nutrient),
    };

    // ── 8. AI advisory prose (uses only pre-calculated plan — no invention) ───
    const deterministicInsight = advisorInsight(species, planting, plan);
    const aiPrompt =
      `SeedDown indoor vertical farm advisor.\n` +
      `The backend has already calculated the sensor target. Do not invent any numbers or percentages.\n` +
      `Current crops: ${currentCrops?.join(', ') || 'mixed vegetables'}\n` +
      `Adding: ${planting.label} of ${species}\n` +
      `Calculated plan JSON:\n` +
      JSON.stringify({
        safeToPlant: plan.safeToPlant,
        planting,
        rootMoisture: plan.moisture,
        rootMoistureCalculation: plan.calculation,
        temperature: plan.temp,
        humidity: plan.humidity,
        ph: plan.ph,
        ec: plan.ec,
        waterDemand: plan.profile.waterDemand,
        warnings: plan.warnings,
      }, null, 2) + '\n' +
      `Write one short operational care sentence only. Do not include any numbers, percentages, ranges, or target values.`;

    let aiCare = '';
    try {
      const raw = await askText('', aiPrompt, 260);
      aiCare = cleanAiCareSentence(raw);
    } catch {
      aiCare = '';
    }

    const insight = `${deterministicInsight} ${aiCare || defaultAdvisorAction(plan)}`;

    // ── 9. Respond ────────────────────────────────────────────────────────────
    res.json({
      impacts,
      resourceDelta: impacts,
      projected,
      targets: {
        temp:     plan.temp,
        humidity: plan.humidity,
        moisture: plan.moisture,
        ph:       plan.ph,
        ec:       plan.ec,
      },
      // sensorGap and demand are consumed by WhatIfPro.js _sensorGapHtml()
      sensorGap,
      demand,
      environmentPlan: plan,
      planting,
      warnings: plan.warnings,
      insight,
      analysis: aiSuitability,
      historicalStats: historicalStats || null,
      resourceLinks: normaliseResourceLinks(aiSuitability?.resourceLinks || plan.sources),
    });

  } catch (err) {
    console.error('New plant impact error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/whatif/newplant-ai ──────────────────────────────────────────────

exports.newPlantAiAnalysis = async (req, res) => {
  try {
    const { species, quantity, currentCrops, sensors } = req.body;

    if (!species) {
      return res.status(400).json({ error: 'species is required' });
    }

    const cropSpec = findCrop(species);
    const planting = normalizePlantingScale(req.body);
    const parsed   = await askAiCropProfile({ species, quantity, planting, currentCrops, sensors, cropSpec });

    res.json({
      species,
      quantity: quantity || 1,
      planting,
      cropSpec: cropSpec || null,
      analysis: parsed,
    });
  } catch (err) {
    console.error('New plant AI analysis error:', err);
    res.status(500).json({ error: err.message });
  }
};