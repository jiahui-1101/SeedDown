import { API_BASE } from '../utils/apiBase.js';
/* ============================================================
   MODULE: FEATURE - WHAT IF
   WhatIf.js — self-contained module, no external dependencies except Chart.js (lazy-loaded)
   Export: { render, init }
   ============================================================ */

import { AppState } from '../store.js';

// ── Shared constants ──────────────────────────────────────────────────────────
// Centralise all magic numbers so they are named, documented, and easy to update.

// Device identifier — read from AppState when available, fall back to the beginner demo.
const DEFAULT_DEVICE_ID = 'beginner_starter';
const LEGACY_DEVICE_ID = 'farm_001';
const BEGINNER_DEMO_FARM_ID = 'farm_beginner_demo_001';
const BEGINNER_DEMO_FIELD_ID = 'field_beginner_starter';

// Water tariff (RM per litre) — Malaysian avg domestic rate
const WATER_RATE_RM_PER_LITRE = 0.042;

// Electricity tariff (RM per kWh) — TNB domestic Block 1 rate
const ELECTRICITY_RATE_RM_PER_KWH = 1.10;

// Hydroponic A+B nutrient estimate from live retail checks, RM per ml.
const FERTILIZER_RATE_RM_PER_ML = 0.009;

// Panel draw (kW) for a single grow-light strip — used in energy cost calc
const LIGHT_KW_PER_STRIP = 0.04;

// Baseline plant count that produces a scale factor of 1.0 in impact calculation.
// Impact values in WIF_NP_DATA are calibrated for this quantity.
const IMPACT_BASELINE_PLANTS = 4;

// Sensor band thresholds — low/high boundaries used across cost & impact logic.
// Aligned with whatIfController.js server-side thresholds.
const SENSOR_BANDS = {
  water:    { low: 40, high: 70 },  // % soil moisture
  light:    { low: 40, high: 70 },  // % ambient light
  nutrient: { low: 40, high: 70 },  // % nutrient level
};

// Water consumption (L/plant/week) depending on current soil moisture band
const WATER_L_PER_PLANT_WK = { dry: 2.5, mid: 1.5, wet: 0.8 };

// Artificial lighting hours per day depending on ambient light band
const LIGHT_HRS_PER_DAY = { dark: 10, mid: 8, bright: 6 };

// Fertilizer multiplier depending on nutrient band
const FERT_MULTIPLIER = { low: 1.5, mid: 1.0, high: 0.7 };

// Legacy display defaults only. Sensor calculations must come from Firebase.
const DEFAULT_SENSORS = { temp: 28, humid: 68, light: 82, water: 45, nutrient: 78 };

// ── Farm data helpers ──────────────────────────────────────────


function wifEscapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);
}

function wifNumber(...values) {
  for (const value of values) {
    if (value === undefined || value === null || value === '') continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function wifClamp(value, min = 0, max = 100) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(min, Math.min(max, n));
}

function wifReadSavedFarms() {
  try {
    const farms = JSON.parse(localStorage.getItem('user_farms') || '[]');
    return Array.isArray(farms) ? farms : [];
  } catch {
    return [];
  }
}

function wifGetCurrentFarm() {
  const farms = wifReadSavedFarms();
  const currentFarm = AppState.currentFarm
    || farms.find(f => f.id === AppState.currentFarmId)
    || farms.find(f => f.farmId === AppState.currentFarmId || f.backendFarmId === AppState.currentFarmId)
    || (() => {
         if (farms.length > 1) console.warn('[WhatIf] currentFarmId not set - falling back to last farm:', farms[farms.length - 1]?.id);
         return farms[farms.length - 1] || null;
       })();
  return currentFarm || null;
}

function getPlantedCrops() {
  const currentFarm = wifGetCurrentFarm();
  if (!currentFarm?.plants?.length) return null;
  return currentFarm.plants; // [{name, emoji, species, slots}]
}

function wifPushSensorCandidate(candidates, seen, key, value) {
  if (value === undefined || value === null || value === '') return;
  const clean = String(value).trim();
  if (!clean) return;
  const id = `${key}:${clean}`;
  if (seen.has(id)) return;
  seen.add(id);
  candidates.push({ [key]: clean });
}

function wifSensorQueryCandidates(farm = wifGetCurrentFarm()) {
  const candidates = [];
  const seen = new Set();

  const zoneDeviceId = farm?.deviceId || farm?.sensorDeviceId || farm?.zoneDeviceId || farm?.iotDeviceId;
  const masterDeviceId = farm?.farmMaster?.deviceId || farm?.masterDeviceId || farm?.farmDeviceId;

  wifPushSensorCandidate(candidates, seen, 'deviceId', zoneDeviceId);
  wifPushSensorCandidate(candidates, seen, 'zoneId', farm?.zoneId || farm?.currentZoneId);
  wifPushSensorCandidate(candidates, seen, 'farmId', farm?.backendFarmId || farm?.farmId || farm?.id || AppState.currentFarmId);
  wifPushSensorCandidate(candidates, seen, 'fieldId', farm?.fieldId);
  wifPushSensorCandidate(candidates, seen, 'deviceId', masterDeviceId);
  wifPushSensorCandidate(candidates, seen, 'deviceId', DEFAULT_DEVICE_ID);
  wifPushSensorCandidate(candidates, seen, 'farmId', BEGINNER_DEMO_FARM_ID);
  wifPushSensorCandidate(candidates, seen, 'fieldId', BEGINNER_DEMO_FIELD_ID);
  wifPushSensorCandidate(candidates, seen, 'deviceId', LEGACY_DEVICE_ID);

  return candidates;
}

function wifQueryString(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value);
  });
  return params.toString();
}

async function wifFetchJsonWithTimeout(url, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res.ok ? res.json() : null;
  } finally {
    clearTimeout(timer);
  }
}

async function wifPostJsonWithTimeout(url, body, ms = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || `Server error ${res.status}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function wifNormalizeSensorPayload(payload, sourceQuery = null) {
  const reading = payload?.reading || payload;
  if (!reading || typeof reading !== 'object') return null;

  const lightRaw = wifNumber(reading.lightRaw);
  const soilRaw = wifNumber(reading.soilRaw);
  const ec = wifNumber(reading.ec, reading.nutrientEc);
  const ecRaw = wifNumber(reading.ecRaw);

  const normalized = {
    temp: wifNumber(reading.temp, reading.temperature),
    humid: wifNumber(reading.humid, reading.humidity),
    light: wifNumber(reading.light, reading.lux, lightRaw !== null ? wifClamp((lightRaw / 4095) * 100) : null),
    water: wifNumber(
      reading.water,
      reading.moisture,
      reading.soilMoisture,
      soilRaw !== null ? wifClamp(((4095 - soilRaw) / 4095) * 100) : null
    ),
    nutrient: wifNumber(
      reading.nutrient,
      ec !== null ? wifClamp((ec / 2.4) * 100) : null,
      ecRaw !== null ? wifClamp((ecRaw / 4095) * 100) : null
    ),
    ph: wifNumber(reading.ph),
    ec,
    soilRaw,
    lightRaw,
    ecRaw,
    waterDistanceCm: wifNumber(reading.waterDistanceCm),
    waterFlowLpm: wifNumber(reading.waterFlowLpm),
    energyKwh: wifNumber(reading.energyKwh, reading.powerKwh),
    intervalSeconds: wifNumber(reading.intervalSeconds),
    fertilizerML: wifNumber(reading.fertilizerML, reading.fertilizerMl, reading.nutrientDoseMl, reading.dosingMl),
    harvestKg: wifNumber(reading.harvestKg, reading.yieldKg),
    marketPricePerKg: wifNumber(reading.marketPricePerKg, reading.pricePerKg),
    createdAt: reading.createdAt || reading.timestamp || null,
    source: sourceQuery ? `Firebase sensorReadings ${wifQueryString(sourceQuery)}` : (reading.source || 'Firebase sensorReadings'),
    deviceId: payload?.deviceId || reading.deviceId || sourceQuery?.deviceId || null,
    farmId: payload?.farmId || reading.farmId || sourceQuery?.farmId || null,
    fieldId: payload?.fieldId || reading.fieldId || sourceQuery?.fieldId || null,
    zoneId: payload?.zoneId || reading.zoneId || sourceQuery?.zoneId || null,
  };

  return Object.values({
    temp: normalized.temp,
    humid: normalized.humid,
    light: normalized.light,
    water: normalized.water,
    nutrient: normalized.nutrient,
    ph: normalized.ph,
    ec: normalized.ec,
    waterDistanceCm: normalized.waterDistanceCm,
    waterFlowLpm: normalized.waterFlowLpm,
    energyKwh: normalized.energyKwh,
    intervalSeconds: normalized.intervalSeconds,
    fertilizerML: normalized.fertilizerML,
    harvestKg: normalized.harvestKg,
    marketPricePerKg: normalized.marketPricePerKg,
  }).some(value => value !== null)
    ? normalized
    : null;
}

function wifAverageSensors(readings, sourceQuery) {
  const normalized = readings
    .map(reading => wifNormalizeSensorPayload(reading, sourceQuery))
    .filter(Boolean);
  if (!normalized.length) return null;

  const avg = key => {
    const values = normalized.map(r => r[key]).filter(value => value !== null);
    if (!values.length) return null;
    return parseFloat((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
  };

  return {
    ...normalized[0],
    temp: avg('temp'),
    humid: avg('humid'),
    light: avg('light'),
    water: avg('water'),
    nutrient: avg('nutrient'),
    ph: avg('ph'),
    ec: avg('ec'),
    waterFlowLpm: avg('waterFlowLpm'),
    energyKwh: avg('energyKwh'),
    fertilizerML: avg('fertilizerML'),
    harvestKg: avg('harvestKg'),
    marketPricePerKg: avg('marketPricePerKg'),
    waterUsedLiters: (() => {
      const values = normalized
        .map(r => (r.waterFlowLpm !== null && r.intervalSeconds !== null) ? r.waterFlowLpm * (r.intervalSeconds / 60) : null)
        .filter(value => value !== null);
      return values.length ? parseFloat(values.reduce((sum, value) => sum + value, 0).toFixed(2)) : null;
    })(),
    energyUsedKwh: (() => {
      const values = normalized.map(r => r.energyKwh).filter(value => value !== null);
      if (values.length >= 2) return parseFloat(Math.max(0, values[0] - values[values.length - 1]).toFixed(3));
      return values.length === 1 ? parseFloat(values[0].toFixed(3)) : null;
    })(),
    fertilizerUsedML: (() => {
      const values = normalized.map(r => r.fertilizerML).filter(value => value !== null);
      return values.length ? parseFloat(values.reduce((sum, value) => sum + value, 0).toFixed(1)) : null;
    })(),
    days: normalized.length,
    source: `Firebase sensorReadings ${wifQueryString(sourceQuery)} (${normalized.length} readings avg)`,
  };
}

function plantedToWifCrops(plantedCrops) {
  // Convert farm plants to WIF_CROPS format
  // AI-estimated days to harvest — realistic grow times for vertical farming
  const crops_data_map = {
    tomato:      { kg: 0.32, units: 4, readyIn: 60, color: '#D85A30' },
    carrot:      { kg: 0.24, units: 6, readyIn: 70, color: '#BA7517' },
    cabbage:     { kg: 0.41, units: 2, readyIn: 80, color: '#639922' },
    eggplant:    { kg: 0.28, units: 3, readyIn: 75, color: '#534AB7' },
    basil:       { kg: 0.09, units: 10, readyIn: 28, color: '#1D9E75' },
    green_onion: { kg: 0.11, units: 8, readyIn: 50, color: '#3B6D11' },
    lettuce:     { kg: 0.20, units: 4, readyIn: 35, color: '#639922' },
    spinach:     { kg: 0.15, units: 5, readyIn: 40, color: '#2E7D32' },
    strawberry:  { kg: 0.30, units: 3, readyIn: 90, color: '#C62828' },
    pepper:      { kg: 0.25, units: 3, readyIn: 80, color: '#E65100' },
    mint:        { kg: 0.08, units: 8, readyIn: 25, color: '#1B5E20' },
    chili:       { kg: 0.10, units: 6, readyIn: 90, color: '#B71C1C' },
    cucumber:    { kg: 0.35, units: 3, readyIn: 55, color: '#33691E' },
    banana:      { kg: 1.20, units: 1, readyIn: 270, color: '#F9A825' },
    mango:       { kg: 0.80, units: 1, readyIn: 180, color: '#FF8F00' },
    kangkung:    { kg: 0.12, units: 6, readyIn: 21,  color: '#2E7D32' },
    pandan:      { kg: 0.05, units: 4, readyIn: 90,  color: '#1B5E20' },
    ulam_raja:   { kg: 0.10, units: 5, readyIn: 45,  color: '#388E3C' },
    curry_leaf:  { kg: 0.06, units: 4, readyIn: 60,  color: '#558B2F' },
    cili_padi:   { kg: 0.08, units: 6, readyIn: 90,  color: '#C62828' },
  };

  // ✅ FIX: deduplicate by species — merge slots/units from duplicate entries
  const speciesMap = new Map();
  for (const p of plantedCrops) {
    const key = p.species;
    if (speciesMap.has(key)) {
      // Merge: add slots to existing entry
      const existing = speciesMap.get(key);
      existing.totalSlots += (p.slots || 1);
    } else {
      speciesMap.set(key, {
        species:    p.species,
        name:       p.name,
        emoji:      p.emoji || '🌱',
        totalSlots: p.slots || 1,
      });
    }
  }

  return Array.from(speciesMap.values()).map(p => {
    const defaults = crops_data_map[p.species] || { kg: 0.20, units: 4, readyIn: 45, color: '#639922' };
    return {
      id:      p.species,
      name:    p.name,
      emoji:   p.emoji || '🌱',
      days:    defaults.readyIn,
      kg:      parseFloat((defaults.kg * p.totalSlots).toFixed(2)),
      units:   p.totalSlots,
      readyIn: defaults.readyIn,
      color:   defaults.color,
      slots:   p.totalSlots,
    };
  });
}

async function fetchSensorData() {
  const candidates = wifSensorQueryCandidates();
  let lastError = null;

  for (const filters of candidates) {
    const qs = wifQueryString(filters);
    if (!qs) continue;

    try {
      const data = await wifFetchJsonWithTimeout(`${API_BASE}/api/sensors/latest?${qs}`, 5000);
      if (!data) throw new Error('sensor timeout or empty response');
      const sensors = wifNormalizeSensorPayload(data, filters);
      if (sensors) return sensors;
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError) console.warn('[WhatIf] Firebase latest sensor unavailable:', lastError.message);
  return null;
}

async function fetchWeeklyAvgSensors() {
  const candidates = wifSensorQueryCandidates();
  let lastError = null;

  for (const filters of candidates) {
    const qs = wifQueryString({ ...filters, limit: 200 });
    if (!qs) continue;

    try {
      const data = await wifFetchJsonWithTimeout(`${API_BASE}/api/sensors/history?${qs}`, 7000);
      if (!data) throw new Error('history timeout or empty response');
      const readings = Array.isArray(data.readings) ? data.readings : [];
      const avg = wifAverageSensors(readings, filters);
      if (avg) return avg;
    } catch (err) {
      lastError = err;
    }
  }

  if (lastError) console.warn('[WhatIf] Firebase history average unavailable:', lastError.message);
  return fetchSensorData(); // fallback to latest reading
}

async function fetchFarmLevelSensorData() {
  const farm = wifGetCurrentFarm();
  const masterDeviceId = farm?.farmMaster?.deviceId || farm?.masterDeviceId || farm?.farmDeviceId;
  const farmId = farm?.backendFarmId || farm?.farmId || farm?.id || AppState.currentFarmId;
  const candidates = [];
  const seen = new Set();
  wifPushSensorCandidate(candidates, seen, 'deviceId', masterDeviceId);
  wifPushSensorCandidate(candidates, seen, 'farmId', farmId);

  for (const filters of candidates) {
    const qs = wifQueryString(filters);
    if (!qs) continue;

    try {
      const data = await wifFetchJsonWithTimeout(`${API_BASE}/api/sensors/latest?${qs}`, 5000);
      if (!data) continue;
      const sensors = wifNormalizeSensorPayload(data, filters);
      if (sensors) return sensors;
    } catch {
      // Best-effort context for the AI endpoint.
    }
  }

  return null;
}

function wifBuildAiSensorContext(zoneSensors, farmLevelSensors = null) {
  const farm = wifGetCurrentFarm();
  const context = {
    sensors: zoneSensors || null,
    zoneSensors: zoneSensors || null,
    farmLevelSensors: farmLevelSensors || null,
    calibration: farm?.sensorCalibration || farm?.calibration || {},
  };

  const pushId = (key, ...values) => {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== '') {
        context[key] = value;
        return;
      }
    }
  };

  pushId('deviceId', zoneSensors?.deviceId, farm?.deviceId, farm?.sensorDeviceId, DEFAULT_DEVICE_ID);
  pushId('zoneId', zoneSensors?.zoneId, farm?.zoneId, farm?.currentZoneId);
  pushId('farmId', zoneSensors?.farmId, farm?.backendFarmId, farm?.farmId, farm?.id, AppState.currentFarmId);
  pushId('fieldId', zoneSensors?.fieldId, farm?.fieldId);

  return context;
}

/* ---------- DATA ---------- */
// Realistic grow times for vertical farming — aligned with crops_data_map above
const WIF_CROPS = [
  { id: 'tomato',      name: 'Tomato',      emoji: '🍅', days: 60, kg: 0.32, units: 4,  readyIn: 60, color: '#D85A30' },
  { id: 'carrot',      name: 'Carrot',      emoji: '🥕', days: 70, kg: 0.24, units: 6,  readyIn: 70, color: '#BA7517' },
  { id: 'cabbage',     name: 'Cabbage',     emoji: '🥬', days: 80, kg: 0.41, units: 2,  readyIn: 80, color: '#639922' },
  { id: 'eggplant',    name: 'Eggplant',    emoji: '🍆', days: 75, kg: 0.28, units: 3,  readyIn: 75, color: '#534AB7' },
  { id: 'basil',       name: 'Basil',       emoji: '🌿', days: 28, kg: 0.09, units: 10, readyIn: 28, color: '#1D9E75' },
  { id: 'green_onion', name: 'Green Onion', emoji: '🧅', days: 50, kg: 0.11, units: 8,  readyIn: 50, color: '#3B6D11' },
];

// MODIFIED: added `emoji` field to each recipe for food-appealing visual presentation
const WIF_RECIPES = [
  { name: 'Bolognese Pasta',    emoji: '🍝', ingr: ['tomato', 'carrot', 'basil'] },
  { name: 'ABC Soup',           emoji: '🍲', ingr: ['cabbage', 'carrot', 'tomato', 'green_onion'] },
  { name: 'Grilled Eggplant',   emoji: '🍽️', ingr: ['eggplant', 'basil'] },
  { name: 'Spring Green Salad', emoji: '🥗', ingr: ['green_onion', 'basil', 'cabbage'] },
];

const WIF_COST_REFERENCE = {
  lettuce:  { price: 4.8,  yieldKgCycle: 0.60, growthDays: 45, waterMLDay: 150, fertMLWeek: 3, lightHours: 6 },
  tomato:   { price: 7.2,  yieldKgCycle: 4.00, growthDays: 70, waterMLDay: 250, fertMLWeek: 5, lightHours: 8 },
  carrot:   { price: 3.5,  yieldKgCycle: 0.60, growthDays: 75, waterMLDay: 180, fertMLWeek: 3, lightHours: 6 },
  basil:    { price: 12.0, yieldKgCycle: 0.50, growthDays: 35, waterMLDay: 120, fertMLWeek: 2, lightHours: 6 },
  eggplant: { price: 5.5,  yieldKgCycle: 1.80, growthDays: 80, waterMLDay: 260, fertMLWeek: 5, lightHours: 8 },
  cabbage:  { price: 3.2,  yieldKgCycle: 1.20, growthDays: 90, waterMLDay: 200, fertMLWeek: 4, lightHours: 6 },
  spinach:  { price: 6.0,  yieldKgCycle: 0.45, growthDays: 40, waterMLDay: 120, fertMLWeek: 3, lightHours: 5 },
  mint:     { price: 10.0, yieldKgCycle: 0.35, growthDays: 28, waterMLDay: 120, fertMLWeek: 2, lightHours: 5 },
  chili:    { price: 9.0,  yieldKgCycle: 0.60, growthDays: 90, waterMLDay: 220, fertMLWeek: 5, lightHours: 8 },
  kangkung:   { price: 3.0,  yieldKgCycle: 0.40, growthDays: 21, waterMLDay: 180, fertMLWeek: 3, lightHours: 5 },
  pandan:     { price: 5.0,  yieldKgCycle: 0.10, growthDays: 90, waterMLDay: 100, fertMLWeek: 2, lightHours: 5 },
  ulam_raja:  { price: 6.0,  yieldKgCycle: 0.30, growthDays: 45, waterMLDay: 130, fertMLWeek: 2, lightHours: 6 },
  curry_leaf: { price: 8.0,  yieldKgCycle: 0.15, growthDays: 60, waterMLDay: 120, fertMLWeek: 2, lightHours: 7 },
  cili_padi:  { price: 15.0, yieldKgCycle: 0.25, growthDays: 90, waterMLDay: 200, fertMLWeek: 4, lightHours: 8 },
};

function wifMeasuredCostLine(value, rate) {
  if (value === null || value === undefined) return { value: null, cost: null };
  return { value, cost: parseFloat((value * rate).toFixed(2)) };
}

function wifCropProfileFromSpec(plant, cropSpec = null) {
  const fallback = WIF_COST_REFERENCE[plant] || WIF_COST_REFERENCE.lettuce;
  const req = cropSpec?.requirements || {};
  const y = cropSpec?.yield || {};
  const cost = cropSpec?.cost || {};
  const harvests = Math.max(1, wifNumber(y.harvestsPerCycle, 1));

  return {
    plant,
    name: cropSpec?.commonName || plant,
    price: wifNumber(cost.mktPricePerKg, fallback.price),
    yieldKgCycle: wifNumber(y.avgGramsPerPlant, fallback.yieldKgCycle * 1000 / harvests) / 1000 * harvests,
    growthDays: wifNumber(req.growthDays, fallback.growthDays),
    waterMLDay: wifNumber(req.waterPerDay, fallback.waterMLDay),
    fertMLWeek: wifNumber(req.fertilizerPerWeek, fallback.fertMLWeek),
    lightHours: wifNumber(req.lightHours, fallback.lightHours),
    profileSource: cropSpec ? 'crop database / AI crop profile' : 'built-in crop reference',
  };
}

function wifGetCostAssumptions(plant) {
  const cropSpec = window._wif_cropProfiles?.[plant];
  const profile = wifCropProfileFromSpec(plant, cropSpec);
  const market = window._wif_marketPrices?.[plant];
  const livePrice = wifNumber(market?.bestPrice);

  return {
    ...profile,
    price: livePrice ?? profile.price,
    priceSource: livePrice !== null ? `${market?.bestChannel || 'market'} live market lookup` : profile.profileSource,
    market,
  };
}

function wifCalculateSavings(plant, weeks, sensors = {}, units = wif_cosRows) {
  const profile = wifGetCostAssumptions(plant);
  const weekCount = Math.max(1, wifNumber(weeks, 1));
  const unitCount = Math.max(1, wifNumber(units, 1));
  const days = weekCount * 7;

  const measuredHarvestKg = wifNumber(sensors.harvestKg);
  const harvestKg = measuredHarvestKg ?? parseFloat((profile.yieldKgCycle * unitCount * Math.min(days / profile.growthDays, 1)).toFixed(2));
  const measuredPrice = wifNumber(sensors.marketPricePerKg);
  const marketPricePerKg = measuredPrice ?? profile.price;
  const income = parseFloat((harvestKg * marketPricePerKg).toFixed(2));

  const measuredWater = wifNumber(sensors.waterUsedLiters);
  const moisture = wifNumber(sensors.water);
  const waterFactor = moisture === null ? 1 : moisture < 35 ? 1.15 : moisture > 70 ? 0.8 : 1;
  const waterLiters = measuredWater ?? parseFloat((profile.waterMLDay * unitCount * days * waterFactor / 1000).toFixed(2));
  const waterCost = parseFloat((waterLiters * WATER_RATE_RM_PER_LITRE).toFixed(2));

  const measuredEnergy = wifNumber(sensors.energyUsedKwh, sensors.energyKwh);
  const light = wifNumber(sensors.light);
  const lightFactor = light === null ? 1 : light < 40 ? 1.2 : light > 70 ? 0.75 : 1;
  const energyKWh = measuredEnergy ?? parseFloat((profile.lightHours * lightFactor * LIGHT_KW_PER_STRIP * unitCount * days).toFixed(2));
  const energyCost = parseFloat((energyKWh * ELECTRICITY_RATE_RM_PER_KWH).toFixed(2));

  const measuredFert = wifNumber(sensors.fertilizerUsedML, sensors.fertilizerML);
  const ec = wifNumber(sensors.ec);
  const fertFactor = ec === null ? 1 : ec < 1.2 ? 1.25 : ec > 2.2 ? 0.8 : 1;
  const fertilizerML = measuredFert ?? parseFloat((profile.fertMLWeek * unitCount * weekCount * fertFactor).toFixed(1));
  const fertCost = parseFloat((fertilizerML * FERTILIZER_RATE_RM_PER_ML).toFixed(2));

  const expenses = parseFloat((waterCost + energyCost + fertCost).toFixed(2));
  const net = parseFloat((income - expenses).toFixed(2));

  const assumptions = [];
  assumptions.push(measuredHarvestKg === null ? 'Harvest weight estimated from crop yield profile' : 'Harvest weight measured in Firebase');
  assumptions.push(measuredPrice === null ? `Market price from ${profile.priceSource}` : 'Market price measured in Firebase');
  assumptions.push(measuredWater === null ? 'Water estimated from crop water need and Firebase soil moisture' : 'Water measured from Firebase flow sensor');
  assumptions.push(measuredEnergy === null ? 'Energy estimated from crop light hours and Firebase light level' : 'Energy measured from Firebase energy meter');
  assumptions.push(measuredFert === null ? 'Fertilizer estimated from crop nutrient need and Firebase EC' : 'Fertilizer measured from Firebase dosing sensor');

  return {
    plant,
    unitCount,
    weekCount,
    readingCount: sensors.days || null,
    source: sensors.source || 'Firebase sensorReadings',
    profile,
    harvestKg,
    marketPricePerKg,
    income,
    waterLiters,
    waterCost,
    energyKWh,
    energyCost,
    fertilizerML,
    fertCost,
    expenses,
    net,
    assumptions,
    measured: {
      harvest: measuredHarvestKg !== null,
      price: measuredPrice !== null,
      water: measuredWater !== null,
      energy: measuredEnergy !== null,
      fertilizer: measuredFert !== null,
    },
    note: `Savings use Firebase conditions plus clearly labeled market/crop assumptions where meters are missing.`,
  };
}

async function wifFetchCostAssumptions(plant) {
  const requestId = ++wif_costAssumptionRequestId;
  window._wif_cropProfiles = window._wif_cropProfiles || {};
  window._wif_marketPrices = window._wif_marketPrices || {};

  const cropReq = wifFetchJsonWithTimeout(`${API_BASE}/api/crops/species/${encodeURIComponent(plant)}`, 8000)
    .catch(() => null);
  const marketReq = wifFetchJsonWithTimeout(`${API_BASE}/api/whatif/market-prices?crops=${encodeURIComponent(plant)}`, 8000)
    .catch(() => null);

  const [cropData, marketData] = await Promise.all([cropReq, marketReq]);
  if (requestId !== wif_costAssumptionRequestId) return;
  if (cropData?.crop) window._wif_cropProfiles[plant] = cropData.crop;
  if (marketData?.prices?.[plant]) window._wif_marketPrices[plant] = marketData.prices[plant];
  wifUpdateCost();
}

// MODIFIED: replaced icon string with emoji per impact resource; removed icon field entirely
const WIF_NP_DATA = {
  spinach: {
    emoji: '🥬', readyDays: 5, readyZone: 'Zone B lettuce', space: '1.2m²',
    impacts: [
      { name: 'Temperature', emoji: '🌡️', change: '+0.5°C',    dir: 'up'   },
      { name: 'Humidity',    emoji: '💧',  change: '+3%',       dir: 'up'   },
      { name: 'pH value',    emoji: '🧪',  change: 'No change', dir: 'ok'   },
      { name: 'Light (h/d)', emoji: '☀️',  change: '-0.5h',     dir: 'down' },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+8%',       dir: 'up'   },
    ],
    ai: 'Spinach thrives alongside lettuce. Humidity increase is within safe range (≤85%).',
  },
  mint: {
    emoji: '🌿', readyDays: 3, readyZone: 'Zone A chives', space: '0.6m²',
    impacts: [
      { name: 'Temperature', emoji: '🌡️', change: 'No change', dir: 'ok'   },
      { name: 'Humidity',    emoji: '💧',  change: '+5%',       dir: 'up'   },
      { name: 'pH value',    emoji: '🧪',  change: '-0.2',      dir: 'down' },
      { name: 'Light (h/d)', emoji: '☀️',  change: 'No change', dir: 'ok'   },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+5%',       dir: 'up'   },
    ],
    ai: 'Mint can be aggressive — consider a physical divider from neighbouring herbs.',
  },
  chili: {
    emoji: '🌶️', readyDays: 12, readyZone: 'Zone C eggplant', space: '2.1m²',
    impacts: [
      { name: 'Temperature', emoji: '🌡️', change: '+1.5°C', dir: 'up'   },
      { name: 'Humidity',    emoji: '💧',  change: '-4%',    dir: 'down' },
      { name: 'pH value',    emoji: '🧪',  change: '+0.3',   dir: 'up'   },
      { name: 'Light (h/d)', emoji: '☀️',  change: '+2h',    dir: 'up'   },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+15%',   dir: 'up'   },
    ],
    ai: 'Chili needs more heat and light. You may need to adjust Zone C lighting before planting.',
  },
  cucumber: {
    emoji: '🥒', readyDays: 8, readyZone: 'Zone D tomato', space: '1.8m²',
    impacts: [
      { name: 'Temperature', emoji: '🌡️', change: '+1°C',      dir: 'up' },
      { name: 'Humidity',    emoji: '💧',  change: '+6%',       dir: 'up' },
      { name: 'pH value',    emoji: '🧪',  change: 'No change', dir: 'ok' },
      { name: 'Light (h/d)', emoji: '☀️',  change: '+1h',       dir: 'up' },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+12%',      dir: 'up' },
    ],
    ai: 'Cucumbers are water-heavy. Ensure your pump schedule scales with the new plant count.',
  },
  strawberry: {
    emoji: '🍓', readyDays: 14, readyZone: 'Zone E herbs', space: '0.9m²',
    impacts: [
      { name: 'Temperature', emoji: '🌡️', change: '-1°C',   dir: 'down' },
      { name: 'Humidity',    emoji: '💧',  change: '+2%',    dir: 'up'   },
      { name: 'pH value',    emoji: '🧪',  change: '-0.4',   dir: 'down' },
      { name: 'Light (h/d)', emoji: '☀️',  change: '+1.5h',  dir: 'up'   },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+10%',   dir: 'up'   },
    ],
    ai: 'Strawberries prefer cooler temps. Place them away from the heat lamp cluster for best results.',
  },
  tomato: {
    emoji: '🍅', readyDays: 9, readyZone: 'Zone D', space: '1.5m²',
    impacts: [
      { name: 'Temperature', emoji: '🌡️', change: '+1°C',      dir: 'up' },
      { name: 'Humidity',    emoji: '💧',  change: '+4%',       dir: 'up' },
      { name: 'pH value',    emoji: '🧪',  change: '+0.1',      dir: 'ok' },
      { name: 'Light (h/d)', emoji: '☀️',  change: '+1.5h',     dir: 'up' },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+10%',      dir: 'up' },
    ],
    ai: 'Tomatoes do best with deep watering every 2–3 days.',
  },
  basil: {
    emoji: '🌿', readyDays: 4, readyZone: 'Zone E herbs', space: '0.5m²',
    impacts: [
      { name: 'Temperature', emoji: '🌡️', change: 'No change', dir: 'ok' },
      { name: 'Humidity',    emoji: '💧',  change: '+2%',       dir: 'ok' },
      { name: 'pH value',    emoji: '🧪',  change: 'No change', dir: 'ok' },
      { name: 'Light (h/d)', emoji: '☀️',  change: '+1h',       dir: 'up' },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+4%',       dir: 'up' },
    ],
    ai: 'Basil is low-impact. Great companion plant for tomatoes and peppers.',
  },
  kangkung: {
    emoji: '🥬', readyDays: 3, readyZone: 'Zone B herbs', space: '0.8m²',
    impacts: [
      { name: 'Humidity',    emoji: '💧',  change: '+4%',       dir: 'up'   },
      { name: 'pH value',    emoji: '🧪',  change: 'No change', dir: 'ok'   },
      { name: 'Light (h/d)', emoji: '☀️',  change: '-1h',       dir: 'down' },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+6%',       dir: 'up'   },
    ],
    ai: 'Kangkung is one of the easiest greens to grow indoors — ready in 3 weeks, low light needed. Great for beginners.',
  },
  pandan: {
    emoji: '🌿', readyDays: 14, readyZone: 'Zone A herbs', space: '0.6m²',
    impacts: [
      { name: 'Humidity',    emoji: '💧',  change: '+5%',       dir: 'up' },
      { name: 'pH value',    emoji: '🧪',  change: '-0.1',      dir: 'ok' },
      { name: 'Light (h/d)', emoji: '☀️',  change: 'No change', dir: 'ok' },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+3%',       dir: 'up' },
    ],
    ai: 'Pandan grows slowly but needs minimal care. Harvest individual leaves from the outer layer — do not uproot.',
  },
  ulam_raja: {
    emoji: '🌱', readyDays: 21, readyZone: 'Zone B herbs', space: '1.0m²',
    impacts: [
      { name: 'Humidity',    emoji: '💧',  change: '+3%',       dir: 'up' },
      { name: 'pH value',    emoji: '🧪',  change: 'No change', dir: 'ok' },
      { name: 'Light (h/d)', emoji: '☀️',  change: '+0.5h',     dir: 'up' },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+5%',       dir: 'up' },
    ],
    ai: 'Ulam raja is hardy and grows well in Malaysian indoor conditions. Good for salads and ulam.',
  },
  curry_leaf: {
    emoji: '🌿', readyDays: 30, readyZone: 'Zone C herbs', space: '0.7m²',
    impacts: [
      { name: 'Humidity',    emoji: '💧',  change: '-2%',       dir: 'down' },
      { name: 'pH value',    emoji: '🧪',  change: '+0.2',      dir: 'ok'   },
      { name: 'Light (h/d)', emoji: '☀️',  change: '+1.5h',     dir: 'up'   },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+4%',       dir: 'up'   },
    ],
    ai: 'Curry leaf needs more light than other herbs. Place near the top tier for best results. Harvest sparingly at first.',
  },
  cili_padi: {
    emoji: '🌶️', readyDays: 14, readyZone: 'Zone C', space: '1.0m²',
    impacts: [
      { name: 'Humidity',    emoji: '💧',  change: '-3%',       dir: 'down' },
      { name: 'pH value',    emoji: '🧪',  change: '+0.2',      dir: 'up'   },
      { name: 'Light (h/d)', emoji: '☀️',  change: '+2h',       dir: 'up'   },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+12%',      dir: 'up'   },
    ],
    ai: 'Cili padi needs bright light and warm temps — same conditions as your other chili plants. Prune the base leaves to improve airflow.',
  },
};

const WIF_ZONES = [
  { zone: 'Zone A', crop: 'Chives',   fill: 90 },
  { zone: 'Zone B', crop: 'Lettuce',  fill: 75 },
  { zone: 'Zone C', crop: 'Eggplant', fill: 95 },
  { zone: 'Zone D', crop: 'Tomato',   fill: 60 },
  { zone: 'Zone E', crop: 'Herbs',    fill: 82 },
];

// MODIFIED: derived from WIF_NP_DATA keys so the search suggestion list is always in sync with data
const WIF_NP_SPECIES = Object.entries(WIF_NP_DATA).map(([k, v]) => ({
  id: k,
  name: k.charAt(0).toUpperCase() + k.slice(1),
  emoji: v.emoji,
}));

/* ---------- STATE (module-scoped) ---------- */
let wif_selectedCrops = new Set(); // starts empty — user picks from what's ready
let wif_qty     = 4;
// MODIFIED: split rows out of data into its own mutable state variable
let wif_cosRows = 5;
// MODIFIED: track currently selected new-plant species as state (was implicit via <select>)
let wif_curNp   = 'spinach';
let wif_savingsChart = null;
let wif_npAiRequestId = 0;
let wif_costAssumptionRequestId = 0;

/* ============================================================
   render() — returns the full HTML string for the What-If feature
   ============================================================ */
export function render() {
  return `
    <style>
      /* ---- LAYOUT ---- */
      .wif-root { padding: 0 0 80px; }
      .wif-tab-bar { display:flex; gap:8px; padding:0 0 16px; border-bottom:0.5px solid var(--border-color,#e0e0e0); margin-bottom:18px; }

      /* MODIFIED: tab button style aligned to design system — uses CSS variable colours, consistent border */
      .wif-tab-btn { flex:1; padding:10px 4px 8px; border:0.5px solid var(--border-color,#ddd); border-radius:var(--radius-sm,8px); background:var(--bg-secondary,#f5f5f5); color:var(--text-secondary,#666); font-size:11px; font-weight:500; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px; transition:all .15s; }
      .wif-tab-btn .wif-tab-icon { font-size:18px; }
      .wif-tab-btn.active { background:var(--bg-primary,#fff); border-color:var(--accent,#639922); color:var(--accent,#639922); }

      .wif-section { display:none; }
      .wif-section.active { display:block; }

      /* ---- CARD ---- */
      .wif-card { background:var(--bg-primary,#fff); border:0.5px solid var(--border-color,#e0e0e0); border-radius:var(--radius,12px); padding:16px; margin-bottom:12px; }

      /* MODIFIED: card title unified — uppercase, letter-spaced, smaller; matches .card-label from global CSS */
      .wif-card-title { font-size:11px; font-weight:500; color:var(--text-secondary,#666); margin-bottom:12px; display:flex; align-items:center; gap:6px; text-transform:uppercase; letter-spacing:.05em; }

      /* ---- METRICS ---- */
      .wif-metric-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
      .wif-metric { background:var(--bg-secondary,#f5f5f5); border-radius:var(--radius-sm,8px); padding:10px 8px; text-align:center; }
      .wif-metric-val { font-size:19px; font-weight:500; color:var(--text-primary,#111); }
      .wif-metric-lbl { font-size:10px; color:var(--text-secondary,#666); margin-top:2px; }

      /* ---- SLIDER ---- */
      .wif-slider-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
      .wif-slider-row label { font-size:12px; color:var(--text-secondary,#666); min-width:72px; }
      .wif-row-label { font-size:12px; color:var(--text-secondary,#666); min-width:80px; }
      .wif-slider-row input[type=range] { flex:1; }
      .wif-slider-val { font-size:13px; font-weight:500; min-width:56px; text-align:right; }

      /* ---- BADGES ---- */
      .wif-badge { display:inline-flex; align-items:center; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:500; }
      /* MODIFIED: badge colours now use CSS variable ramps instead of hardcoded hex */
      .wif-badge-green { background:var(--green-50,#EAF3DE); color:var(--green-800,#27500A); }
      .wif-badge-amber { background:var(--amber-50,#FAEEDA); color:var(--amber-800,#633806); }
      .wif-badge-teal  { background:var(--teal-50,#E1F5EE);  color:var(--teal-600,#0F6E56); }
      .wif-badge-red   { background:var(--red-50,#FCEBEB);   color:var(--red-800,#501313); }
      .wif-badge-blue  { background:var(--blue-50,#E6F1FB);  color:var(--blue-600,#185FA5); }

      /* ---- HARVEST TIMELINE ---- */
      .wif-tl-row { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
      .wif-tl-name { font-size:12px; min-width:100px; color:var(--text-secondary,#666); }
      .wif-tl-track { flex:1; height:7px; background:var(--bg-secondary,#f0f0f0); border-radius:4px; overflow:hidden; }
      .wif-tl-fill { height:100%; border-radius:4px; transition:width .4s; }
      .wif-tl-end { font-size:11px; min-width:52px; text-align:right; }
      /* MODIFIED: new class for ready state showing unit count + badge inline */
      .wif-tl-count { font-size:11px; font-weight:500; color:var(--accent,#639922); min-width:110px; text-align:right; display:flex; align-items:center; gap:4px; justify-content:flex-end; }

      /* ---- CROP PILLS ---- */
      .wif-crop-pills { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:14px; }
      .wif-pill { display:flex; align-items:center; gap:5px; padding:6px 12px; border:0.5px solid var(--border-color,#ddd); border-radius:20px; font-size:12px; background:var(--bg-primary,#fff); cursor:pointer; transition:all .12s; }
      .wif-pill.selected { background:var(--green-50,#EAF3DE); border-color:var(--accent,#639922); color:var(--green-800,#27500A); }

      /* ---- RECIPES ---- */
      .wif-recipe-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      .wif-recipe-card { background:var(--bg-secondary,#f5f5f5); border-radius:var(--radius-sm,8px); padding:12px; border:0.5px solid var(--border-color,#e0e0e0); }
      /* MODIFIED: new hero emoji above recipe name for appealing food presentation */
      .wif-recipe-hero { font-size:20px; margin-bottom:6px; }
      .wif-recipe-name { font-size:13px; font-weight:500; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; color:var(--text-primary,#111); }
      .wif-ingr-tag { display:inline-block; background:var(--green-50,#EAF3DE); color:var(--green-800,#27500A); border-radius:3px; padding:2px 5px; margin:2px; font-size:10px; }
      .wif-ingr-tag.missing { background:var(--bg-secondary,#eee); color:#aaa; text-decoration:line-through; }

      /* ---- AI NOTE ---- */
      .wif-ai-note { background:var(--teal-50,#E1F5EE); border-left:3px solid var(--teal-400,#1D9E75); border-radius:0 var(--radius-sm,8px) var(--radius-sm,8px) 0; padding:10px 14px; font-size:12px; color:var(--teal-600,#0F6E56); margin-top:12px; display:flex; gap:8px; align-items:flex-start; }
      .wif-ai-note.standalone { border-radius:var(--radius,12px); margin-top:0; }

      /* ---- SELECTS / INPUTS ---- */
      .wif-sel { width:100%; padding:8px 10px; border:0.5px solid var(--border-color,#ddd); border-radius:var(--radius-sm,8px); background:var(--bg-secondary,#f5f5f5); color:var(--text-primary,#111); font-size:13px; margin-bottom:10px; }

      /* ---- COST SAVINGS ---- */
      .wif-num-row { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
      .wif-num-row label { font-size:12px; color:var(--text-secondary,#666); min-width:80px; }
      .wif-qty-ctrl { display:flex; align-items:center; gap:8px; }
      .wif-qty-btn { width:28px; height:28px; border:0.5px solid var(--border-color,#ddd); border-radius:var(--radius-sm,8px); background:var(--bg-secondary,#f5f5f5); color:var(--text-primary,#111); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; line-height:1; }
      .wif-qty-num { width:32px; text-align:center; font-size:13px; font-weight:500; }
      .wif-savings-big { text-align:center; padding:16px 0; }
      .wif-savings-num { font-size:38px; font-weight:500; color:var(--accent,#3B6D11); }
      .wif-savings-lbl { font-size:12px; color:var(--text-secondary,#666); margin-top:4px; }
      .wif-cost-row { display:flex; justify-content:space-between; align-items:center; padding:8px 12px; border-radius:var(--radius-sm,8px); font-size:13px; margin-bottom:6px; }
      .wif-cost-income  { background:var(--green-50,#EAF3DE); }
      .wif-cost-expense { background:var(--red-50,#FCEBEB); }
      .wif-cost-net     { background:var(--teal-50,#E1F5EE); font-weight:500; }
      .wif-cost-lbl { color:var(--text-secondary,#666); font-size:12px; }
      .wif-divider { border:none; border-top:0.5px solid var(--border-color,#e0e0e0); margin:12px 0; }

      /* ---- NEW PLANT — SEARCH INPUT (replaces plain <select>) ---- */
      /* MODIFIED: entirely new component — search box with icon + suggestion dropdown */
      .wif-np-search-wrap { position:relative; margin-bottom:10px; }
      .wif-np-search { width:100%; padding:8px 10px 8px 34px; border:0.5px solid var(--border-color,#ddd); border-radius:var(--radius-sm,8px); background:var(--bg-secondary,#f5f5f5); color:var(--text-primary,#111); font-size:13px; }
      .wif-np-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:16px; color:var(--text-secondary,#666); pointer-events:none; }
      .wif-np-suggestions { background:var(--bg-primary,#fff); border:0.5px solid var(--border-color,#ddd); border-radius:var(--radius-sm,8px); overflow:hidden; margin-top:4px; }
      .wif-np-sug-item { padding:9px 12px; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:8px; border-bottom:0.5px solid var(--border-color,#eee); color:var(--text-primary,#111); transition:background .1s; }
      .wif-np-sug-item:last-child { border-bottom:none; }
      .wif-np-sug-item:hover { background:var(--bg-secondary,#f5f5f5); }
      .wif-np-sug-emoji { font-size:16px; }

      /* ---- NEW PLANT — READINESS + ZONES ---- */
      .wif-readiness { display:flex; align-items:center; gap:12px; padding:12px; background:var(--teal-50,#E1F5EE); border-radius:var(--radius-sm,8px); margin-bottom:12px; }
      .wif-readiness-title { font-size:13px; font-weight:500; color:var(--teal-600,#0F6E56); }
      .wif-readiness-sub   { font-size:11px; color:var(--text-secondary,#666); margin-top:2px; }
      .wif-zone-row { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; background:var(--bg-secondary,#f5f5f5); border-radius:var(--radius-sm,8px); margin-bottom:6px; }
      .wif-zone-name { font-size:13px; font-weight:500; color:var(--text-primary,#111); }
      .wif-zone-meta { font-size:11px; color:var(--text-secondary,#666); }

      /* MODIFIED: impact grid changed from 3-col auto-fit to 2-col fixed — safer for 380px mobile viewport */
      .wif-impact-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
      .wif-impact-card { border-radius:var(--radius-sm,8px); padding:14px 12px; text-align:center; border:0.5px solid transparent; }
      /* MODIFIED: impact card colours now use CSS variable ramps with border accent */
      .wif-impact-card.up   { background:var(--amber-50,#FAEEDA); border-color:var(--amber-100,#FAC775); }
      .wif-impact-card.down { background:var(--blue-50,#E6F1FB);  border-color:var(--blue-200,#85B7EB);  }
      .wif-impact-card.ok   { background:var(--green-50,#EAF3DE); border-color:var(--green-100,#C0DD97); }
      .wif-impact-card.warn { background:var(--red-50,#FCEBEB);   border-color:var(--red-200,#F09595);   }
      /* MODIFIED: new emoji element replaces Tabler icon */
      .wif-impact-emoji { font-size:22px; margin-bottom:4px; }
      .wif-impact-name { font-size:10px; color:var(--text-secondary,#666); margin:4px 0 3px; text-transform:uppercase; letter-spacing:.04em; }
      .wif-impact-val { font-size:15px; font-weight:500; }
      .wif-impact-val.up   { color:var(--amber-400,#BA7517); }
      .wif-impact-val.down { color:var(--blue-400,#378ADD);  }
      .wif-impact-val.ok   { color:var(--green-600,#3B6D11); }
      .wif-impact-val.warn { color:var(--red-400,#E24B4A);   }
    </style>

    <div class="wif-root">

      <!-- TAB BAR -->
      <div class="wif-tab-bar">
        <button class="wif-tab-btn active" onclick="wifSwitchTab('harvest',this)">
          <span class="wif-tab-icon">🌿</span><span>This Week</span>
        </button>
        <button class="wif-tab-btn" onclick="wifSwitchTab('cost',this)">
          <span class="wif-tab-icon">🏷️</span><span>Savings</span>
        </button>
        <button class="wif-tab-btn" onclick="wifSwitchTab('newplant',this)">
          <span class="wif-tab-icon">❓</span><span>Can I Grow?</span>
        </button>
      </div>

      <!-- ===== TAB 1: HARVEST PREDICT ===== -->
      <div id="wif-harvest" class="wif-section active">
        <div class="wif-card">
          <div class="wif-card-title">📅 What can I pick?</div>
          <div class="wif-slider-row">
            <label for="wif-sl-days">In the next</label>
            <input type="range" min="7" max="365" value="30" step="1" id="wif-sl-days" oninput="wifUpdateHarvest()">
            <span class="wif-slider-val" id="wif-v-days">30 days</span>
          </div>
          <!-- Units first — mum counts individual plants/stalks/heads, not kg -->
          <div class="wif-metric-grid">
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-units">0</div><div class="wif-metric-lbl">Units ready</div></div>
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-items">0</div><div class="wif-metric-lbl">Crop types</div></div>
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-yield">0.00 kg</div><div class="wif-metric-lbl">Est. weight</div></div>
          </div>
          <div id="wif-crop-timelines"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">✅ Select what you picked</div>
          <div class="wif-crop-pills" id="wif-crop-select"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">👨‍🍳 Suggested recipes</div>
          <div class="wif-recipe-grid" id="wif-recipe-grid"></div>
          <div class="wif-ai-note"><span>🤖</span><span id="wif-ai-recipe-note">Select crops above to see recipe suggestions.</span></div>
        </div>
      </div>

      <!-- ===== TAB 2: COST SAVINGS ===== -->
      <div id="wif-cost" class="wif-section">
        <div class="wif-card">
          <div class="wif-card-title">🪴 Choose crop to review</div>
          <!-- MODIFIED: rows count removed from option labels; controlled by stepper below -->
          <select class="wif-sel" id="wif-cost-plant" onchange="wifTriggerCostAi()">
  <option value="" disabled>Loading your crops...</option>
          </select>
          <!-- MODIFIED: new +/− stepper for rows count, separate from plant type -->
          <div class="wif-num-row">
            <span class="wif-row-label" id="wif-rows-label">Units</span>
            <div class="wif-qty-ctrl" role="group" aria-labelledby="wif-rows-label">
              <button type="button" class="wif-qty-btn" aria-label="Decrease units" onclick="wifChangeRows(-1)">−</button>
              <span class="wif-qty-num" id="wif-rows-disp">5</span>
              <button type="button" class="wif-qty-btn" aria-label="Increase units" onclick="wifChangeRows(1)">+</button>
            </div>
          </div>
          <!-- Period is only used for display/chart grouping. Costs come from Firebase measurements. -->
          <div class="wif-slider-row">
            <label for="wif-sl-weeks">View</label>
            <input type="range" min="1" max="24" value="1" step="1" id="wif-sl-weeks" oninput="wifUpdateCost()">
            <span class="wif-slider-val" id="wif-v-weeks">1 wk</span>
          </div>
        </div>
        <div class="wif-card">
          <div class="wif-savings-big">
            <div class="wif-savings-num" id="wif-net-saving">RM 0.00</div>
            <div class="wif-savings-lbl">saved vs buying at pasar</div>
          </div>
          <hr class="wif-divider">
          <div id="wif-cost-breakdown"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">📊 Savings trend when complete</div>
          <div style="position:relative;height:160px;">
            <canvas id="wif-savings-chart"></canvas>
          </div>
        </div>
        <div class="wif-ai-note standalone" style="border-radius:var(--radius,12px);padding:14px 16px;">
          <span>🤖</span><span id="wif-cost-ai-note">Loading...</span>
        </div>
      </div>

      <!-- ===== TAB 3: NEW PLANT ===== -->
      <div id="wif-newplant" class="wif-section">
        <div class="wif-card">
          <div class="wif-card-title">🔍 Can I grow this?</div>
          <!-- MODIFIED: replaced <select> with smart-search input + suggestion dropdown -->
          <div class="wif-np-search-wrap">
            <span class="wif-np-search-icon">🔍</span>
            <input
              class="wif-np-search"
              id="wif-np-input"
              placeholder="Type to search or select species..."
              oninput="wifNpFilterSuggestions()"
              onfocus="wifNpShowSuggestions()"
              onblur="setTimeout(wifNpHideSuggestions, 150)"
              autocomplete="off"
            >
          </div>
          <div class="wif-np-suggestions" id="wif-np-suggestions" style="display:none;"></div>
          <div class="wif-num-row" style="margin-top:8px;">
            <span class="wif-row-label" id="wif-np-qty-label">Unit count</span>
            <div class="wif-qty-ctrl" role="group" aria-labelledby="wif-np-qty-label">
              <button type="button" class="wif-qty-btn" aria-label="Decrease new plant unit count" onclick="wifChangeQty(-1)">−</button>
              <span class="wif-qty-num" id="wif-qty-disp">4</span>
              <button type="button" class="wif-qty-btn" aria-label="Increase new plant unit count" onclick="wifChangeQty(1)">+</button>
            </div>
          </div>
        </div>

        <!-- ✅ FIX 4.3: AI advisor card — shown below add-plant form, updated by wifFetchNewPlantAi -->
        <div id="wif-np-advisor-card" class="wif-card" style="display:none;border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
          <div class="wif-card-title">🌱 Grow verdict</div>
          <div id="wif-np-advisor-body"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">🪴 Space available?</div>
          <div class="wif-readiness" id="wif-readiness">
            <span style="font-size:24px;">📅</span>
            <div>
              <div class="wif-readiness-title" id="wif-ready-title">You can plant in 5 days</div>
              <div class="wif-readiness-sub" id="wif-ready-sub">Zone B lettuce harvests on Day 5 — freeing 1.2m² of space.</div>
            </div>
          </div>
          <div class="wif-card-title" style="margin-top:4px;">🗺️ Current zones</div>
          <div id="wif-zone-list"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">📋 What this plant needs</div>
          <!-- MODIFIED: grid is now 2-col instead of auto-fit 3-col -->
          <div class="wif-impact-grid" id="wif-impact-grid"></div>
          <div class="wif-ai-note" id="wif-np-ai-note-wrap" style="display:none;"><span> </span><span id="wif-np-ai-note">Loading...</span></div>
        </div>
      </div>

    </div>
  `;
}

// new function after using sensor data
function wifPopulateCostDropdown() {
  const sel = document.getElementById('wif-cost-plant');
  if (!sel) return;

  const CROPS = window._WIF_DYNAMIC_CROPS || WIF_CROPS;

  // ✅ FIX: deduplicate by id (species) — plantedToWifCrops already deduplicates,
  // but guard here too in case WIF_CROPS fallback has duplicates
  const seen = new Set();
  const unique = CROPS.filter(c => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  if (unique.length === 0) {
    sel.innerHTML = '<option value="lettuce">Lettuce</option><option value="tomato">Tomato</option>';
  } else {
    sel.innerHTML = unique.map(c =>
      `<option value="${c.id}">${c.emoji} ${c.name}</option>`
    ).join('');
  }
  sel.value = unique[0]?.id || 'lettuce';
  // Trigger analysis for the auto-selected first plant
  setTimeout(wifTriggerCostAi, 0);
}


/* ============================================================
   init() — call AFTER render() HTML has been injected into the DOM
   ============================================================ */
export function init() {
  wif_selectedCrops = new Set();
  wif_qty     = 4;
  wif_cosRows = 5;
  wif_curNp   = 'spinach';

  // ← MOVE ALL WINDOW EXPORTS HERE FIRST
  window.wifSwitchTab           = wifSwitchTab;
  window.wifUpdateHarvest       = wifUpdateHarvest;
  window.wifUpdateCost          = wifUpdateCost;
  window.wifUpdateNewPlant      = wifUpdateNewPlant;
  window.wifToggleCrop          = wifToggleCrop;
  window.wifChangeQty           = wifChangeQty;
  window.wifChangeRows          = wifChangeRows;
  window.wifNpFilterSuggestions = wifNpFilterSuggestions;
  window.wifSelectNp            = wifSelectNp;
  window.wifSelectSpecies       = wifSelectSpecies;
  window.wifNpShowSuggestions   = wifNpShowSuggestions;
  window.wifNpHideSuggestions   = wifNpHideSuggestions;
  window.wifTriggerCostAi       = wifTriggerCostAi;

  // Load real planted crops from farm
  const planted = getPlantedCrops();
  if (planted?.length) {
    window._WIF_DYNAMIC_CROPS = plantedToWifCrops(planted);
  } else {
    window._WIF_DYNAMIC_CROPS = null;
  }

  if (wif_savingsChart) { wif_savingsChart.destroy(); wif_savingsChart = null; }

  const npInput = document.getElementById('wif-np-input');
  if (npInput) npInput.value = 'Spinach';

  wifPopulateCostDropdown();
  wifUpdateHarvest();

  // ✅ FIX: prefetch weekly sensor avg so cost tab uses real data from first render
  // wifTriggerCostAi is called inside wifPopulateCostDropdown via setTimeout(0),
  // so we only re-render cost (not re-call AI) once sensors arrive.
  fetchWeeklyAvgSensors().then(s => {
    window._wif_lastSensors = s;
    wifUpdateCost(); // re-render cost numbers with real sensor values (no extra AI call)
  }).catch(() => wifUpdateCost());

  wifUpdateNewPlant();
}

/* ---------- TAB SWITCH ---------- */
function wifSwitchTab(id, btn) {
  document.querySelectorAll('.wif-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.wif-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('wif-' + id).classList.add('active');
  btn.classList.add('active');
  if (id === 'cost')     wifUpdateCost();
  if (id === 'newplant') wifUpdateNewPlant();
}

/* ============================================================
   TAB 1 — HARVEST PREDICT
   ============================================================ */
function wifUpdateHarvest() {
  // Use real planted crops if available, fallback to static
  const CROPS = window._WIF_DYNAMIC_CROPS || WIF_CROPS;
  const days = parseInt(document.getElementById('wif-sl-days').value);
  document.getElementById('wif-v-days').textContent = days + (days === 1 ? ' day' : ' days');

  const ready      = CROPS.filter(c => c.readyIn <= days);
  const totalKg    = ready.reduce((a, c) => a + c.kg, 0);
  const totalUnits = ready.reduce((a, c) => a + c.units, 0);

  document.getElementById('wif-hm-units').textContent = totalUnits;
  document.getElementById('wif-hm-items').textContent = ready.length;
  document.getElementById('wif-hm-yield').textContent = totalKg.toFixed(2) + ' kg';

  document.getElementById('wif-crop-timelines').innerHTML = CROPS.map(c => {
    const pct = Math.min(100, Math.round((days / c.readyIn) * 100));
    const rdy = c.readyIn <= days;
    return `
      <div class="wif-tl-row">
        <span class="wif-tl-name">${c.emoji} ${c.name}</span>
        <div class="wif-tl-track">
          <div class="wif-tl-fill" style="width:${pct}%;background:${rdy ? 'var(--accent,#639922)' : 'var(--amber-100,#FAC775)'};"></div>
        </div>
        ${rdy
          ? `<span class="wif-tl-count">${c.units} unit${c.units !== 1 ? 's' : ''} <span class="wif-badge wif-badge-green">Ready</span></span>`
          : `<span class="wif-tl-end" style="color:var(--text-secondary,#666)">Day ${c.readyIn}</span>`}
      </div>`;
  }).join('');

  wifRenderCropSelect(days);
  wifRenderRecipes();
}

function wifRenderCropSelect(days) {
  const CROPS = window._WIF_DYNAMIC_CROPS || WIF_CROPS;
  const el = document.getElementById('wif-crop-select');
  const visible = CROPS.filter(c => c.readyIn <= days);

  wif_selectedCrops.forEach(id => {
    if (!visible.find(c => c.id === id)) wif_selectedCrops.delete(id);
  });

  if (visible.length === 0) {
    el.innerHTML = '<span style="font-size:12px;color:var(--text-secondary,#999);">No crops ready yet — move the slider forward.</span>';
    return;
  }

  el.innerHTML = visible.map(c => `
    <div class="wif-pill ${wif_selectedCrops.has(c.id) ? 'selected' : ''}"
         onclick="wifToggleCrop('${c.id}')">
      ${c.emoji} ${c.name}
    </div>`).join('');
}

function wifToggleCrop(id) {
  if (wif_selectedCrops.has(id)) wif_selectedCrops.delete(id);
  else wif_selectedCrops.add(id);
  const days = parseInt(document.getElementById('wif-sl-days').value);
  wifRenderCropSelect(days);
  wifRenderRecipes();
}

function wifRenderRecipes() {
  const el   = document.getElementById('wif-recipe-grid');
  const note = document.getElementById('wif-ai-recipe-note');

  if (wif_selectedCrops.size === 0) {
    el.innerHTML = '';
    note.textContent = 'Select crops above to see recipe suggestions.';
    return;
  }

  // Static recipes — only show if at least 1 selected crop is in it
  const scored = WIF_RECIPES.map(r => {
    const match = r.ingr.filter(i => wif_selectedCrops.has(i)).length;
    if (match === 0) return null;
    return { ...r, match, pct: Math.round((match / r.ingr.length) * 100) };
  }).filter(Boolean).sort((a, b) => b.match - a.match);

  el.innerHTML = scored.map(r => `
    <div class="wif-recipe-card">
      <div class="wif-recipe-hero">${r.emoji}</div>
      <div class="wif-recipe-name">
        ${r.name}
        <span class="wif-badge ${r.pct === 100 ? 'wif-badge-green' : 'wif-badge-amber'}">${r.pct}%</span>
      </div>
      <div>
        ${r.ingr.map(i => {
          // Prefer dynamic farm crops so emoji/name reflect what the user actually planted
          const allCrops = window._WIF_DYNAMIC_CROPS || WIF_CROPS;
          const crop = allCrops.find(c => c.id === i) || WIF_CROPS.find(c => c.id === i);
          const have = wif_selectedCrops.has(i);
          return have
            ? `<span class="wif-ingr-tag">${crop ? crop.emoji + ' ' + crop.name : i}</span>`
            : `<span class="wif-ingr-tag" style="background:#f0f0f0;color:#999;border:0.5px dashed #ccc;">🛒 ${crop ? crop.name : i}</span>`;
        }).join('')}
      </div>
    </div>`).join('');

  note.textContent = scored.length > 0
    ? `${scored.length} recipe${scored.length > 1 ? 's' : ''} match your harvest. Loading database...`
    : 'No local matches. Loading database recipes...';

  wifFetchDbRecipes([...wif_selectedCrops]);
}

async function wifFetchDbRecipes(selectedIds) {
  const el   = document.getElementById('wif-recipe-grid');
  const note = document.getElementById('wif-ai-recipe-note');

  const keywordMap = {
    tomato:      ['tomato', 'tomatoes'],
    carrot:      ['carrot', 'carrots'],
    cabbage:     ['cabbage'],
    eggplant:    ['eggplant', 'aubergine', 'brinjal'],
    basil:       ['basil'],
    green_onion: ['green onion', 'green onions', 'scallion'],
    lettuce:     ['lettuce'],
    spinach:     ['spinach'],
    strawberry:  ['strawberry', 'strawberries'],
    pepper:      ['bell pepper', 'green pepper', 'capsicum'],
  };

  try {
    // Fetch ALL selected crops in parallel
    const results = await Promise.all(
      selectedIds.map(id =>
        fetch(`${API_BASE}/api/whatif/recipes?species=${id}`)
          .then(r => r.ok ? r.json() : { recipes: [] })
          .catch(() => ({ recipes: [] }))
      )
    );

    // Deduplicate by recipe name
    const seen = new Set();
    const allRecipes = results
      .flatMap(r => r.recipes || [])
      .filter(r => {
        if (seen.has(r.name)) return false;
        seen.add(r.name);
        return true;
      });

    if (!allRecipes.length) {
      note.textContent = note.textContent
        .replace('Loading database...', '(No DB results)')
        .replace('Loading database recipes...', '(No DB results)');
      return;
    }

    // For EACH recipe, determine:
    // A) which selected crops appear → green badges (you grow these)
    // B) which raw ingredients are NOT selected crops → grey 🛒 badges (need to buy)
    const enriched = allRecipes.map(recipe => {
      // Which of YOUR selected crops are in this recipe
      const grownMatches = selectedIds.filter(id => {
        const kws = keywordMap[id] || [id];
        return recipe.ingredients.some(ing =>
          kws.some(kw => ing.toLowerCase().includes(kw.toLowerCase()))
        );
      });

      if (grownMatches.length === 0) return null; // skip — none of your crops

      // All other "interesting" ingredients (not quantities/seasonings)
      const allSelectedKws = selectedIds.flatMap(id => keywordMap[id] || [id]);
      const otherIngredients = recipe.ingredients
        .filter(ing => {
          const low = ing.toLowerCase();
          // Skip if it's already a grown crop match
          if (allSelectedKws.some(kw => low.includes(kw))) return false;
          // Skip pure seasonings/basics
          const skip = ['salt','pepper','water','oil','sugar','flour','butter','egg','milk','sauce','mix','seasoning','powder','vinegar','cream','cheese','margarine'];
          if (skip.some(s => low.includes(s))) return false;
          return true;
        })
        .map(ing => {
          // Strip quantity prefix like "1 lb.", "2 Tbsp.", "1 (16 oz.) can"
          return ing
            .replace(/^\d[\d\s\/]*(\(\d+[\s\w\.]+\))?\s*(lb|oz|c|pkg|tsp|tbsp|can|qt|pt|pkg|Tbsp|large|medium|small|fresh|dried|chopped|diced|sliced|cooked|frozen|thawed|drained|shredded|grated|minced|crushed|ground|boneless|skinless)\.?\s*/gi, '')
            .replace(/^[\d\/\s\.]+/, '')
            .trim();
        })
        .filter(ing => ing.length > 2 && ing.length < 40)
        .slice(0, 4); // max 4 "buy" ingredients shown

      return { recipe, grownMatches, otherIngredients };
    }).filter(Boolean)
      .sort((a, b) => b.grownMatches.length - a.grownMatches.length);

    if (!enriched.length) {
      note.textContent = 'No database recipes matched your selected crops.';
      return;
    }

    // NO slice limit — show ALL matched recipes
    const dbCards = enriched.map(({ recipe, grownMatches, otherIngredients }) => {
      const grownBadges = grownMatches.map(id => {
        const allCrops = window._WIF_DYNAMIC_CROPS || WIF_CROPS;
        const crop = allCrops.find(c => c.id === id) || WIF_CROPS.find(c => c.id === id);
        return `<span class="wif-ingr-tag" style="background:var(--teal-50,#E1F5EE);color:var(--teal-600,#0F6E56);border:0.5px solid var(--teal-200,#7DD3BD);">${crop ? crop.emoji + ' ' + crop.name : id}</span>`;
      }).join('');

      const buyBadges = otherIngredients.map(ing =>
        `<span class="wif-ingr-tag" style="background:#f0f0f0;color:#888;border:0.5px dashed #ccc;">🛒 ${ing}</span>`
      ).join('');

      return `
        <div class="wif-recipe-card" style="border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
          <div class="wif-recipe-hero">🍽️</div>
          <div class="wif-recipe-name">
            ${recipe.name.trim()}
            <span class="wif-badge wif-badge-teal">DB</span>
          </div>
          <div>${grownBadges}${buyBadges}</div>
        </div>`;
    }).join('');

    el.innerHTML += dbCards;
    note.textContent = `${enriched.length} recipes found — green = your harvest, 🛒 = ingredients to buy.`;

  } catch (err) {
    note.textContent = note.textContent
      .replace('Loading database...', '(Backend offline — local only)')
      .replace('Loading database recipes...', '(Backend offline — local only)');
  }
}

/* ============================================================
   TAB 2 — COST SAVINGS
   ============================================================ */

// MODIFIED: new function — controls rows count independently of plant type
function wifChangeRows(delta) {
  wif_cosRows = Math.max(1, Math.min(20, wif_cosRows + delta));
  const el = document.getElementById('wif-rows-disp');
  if (el) el.textContent = wif_cosRows;
  wifUpdateCost();
}

function wifUpdateCost() {
  const plantEl = document.getElementById('wif-cost-plant');
  const plant   = plantEl?.value;
  const weeksEl = document.getElementById('wif-sl-weeks');
  if (!plant || !weeksEl) return;

  const weeks = parseInt(weeksEl.value);
  document.getElementById('wif-v-weeks').textContent = weeks + (weeks === 1 ? ' wk' : ' wks');

  const sensors = window._wif_lastSensors || {};
  const calc = wifCalculateSavings(plant, weeks, sensors);
  window._wif_lastCostProjection = calc;

  const netClass = calc.net === null ? 'var(--text-secondary,#666)' : calc.net >= 0 ? 'var(--accent,#3B6D11)' : 'var(--red-400,#E24B4A)';
  document.getElementById('wif-net-saving').textContent = 'RM ' + calc.net.toFixed(2);
  document.getElementById('wif-net-saving').style.color = netClass;

  const assumptionNote = `<div class="wif-cost-row" style="background:var(--amber-50,#FAEEDA);align-items:flex-start;">
    <span class="wif-cost-lbl">Assumptions: ${calc.assumptions.map(wifEscapeHtml).join('; ')}</span>
  </div>`;
  const badge = isMeasured => `<span class="wif-badge ${isMeasured ? 'wif-badge-green' : 'wif-badge-amber'}" style="margin-left:6px;">${isMeasured ? 'Measured' : 'Estimated'}</span>`;

  // Resource costs collapsed by default — beginner sees the win first
  document.getElementById('wif-cost-breakdown').innerHTML = `
    <div class="wif-cost-row wif-cost-income">
      <span class="wif-cost-lbl">🛒 Pasar price for same amount ${badge(calc.measured.harvest && calc.measured.price)}<span style="font-size:10px;opacity:.7;"> (${calc.harvestKg.toFixed(2)} kg @ RM ${calc.marketPricePerKg.toFixed(2)}/kg)</span></span>
      <span style="color:var(--green-600,#3B6D11);font-weight:500;">RM ${calc.income.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row" style="background:var(--bg-secondary,#f5f5f5);cursor:pointer;" onclick="document.getElementById('wif-cost-detail').style.display=document.getElementById('wif-cost-detail').style.display==='none'?'block':'none'">
      <span class="wif-cost-lbl" style="color:var(--text-secondary,#666);font-size:11px;">💧⚡🧪 Your growing cost — RM ${calc.expenses.toFixed(2)} <span style="font-size:10px;opacity:.7;">(tap to see breakdown)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-size:12px;">−RM ${calc.expenses.toFixed(2)}</span>
    </div>
    <div id="wif-cost-detail" style="display:none;">
      <div class="wif-cost-row wif-cost-expense">
        <span class="wif-cost-lbl">💧 Water ${badge(calc.measured.water)}<span style="font-size:10px;opacity:.7;"> (${calc.waterLiters.toFixed(2)} L × RM ${WATER_RATE_RM_PER_LITRE}/L)</span></span>
        <span style="color:var(--red-400,#E24B4A);">−RM ${calc.waterCost.toFixed(2)}</span>
      </div>
      <div class="wif-cost-row wif-cost-expense">
        <span class="wif-cost-lbl">⚡ Electricity ${badge(calc.measured.energy)}<span style="font-size:10px;opacity:.7;"> (${calc.energyKWh.toFixed(2)} kWh × RM ${ELECTRICITY_RATE_RM_PER_KWH}/kWh)</span></span>
        <span style="color:var(--red-400,#E24B4A);">−RM ${calc.energyCost.toFixed(2)}</span>
      </div>
      <div class="wif-cost-row wif-cost-expense">
        <span class="wif-cost-lbl">🧪 Fertilizer ${badge(calc.measured.fertilizer)}<span style="font-size:10px;opacity:.7;"> (${calc.fertilizerML.toFixed(1)} mL × RM ${FERTILIZER_RATE_RM_PER_ML}/mL)</span></span>
        <span style="color:var(--red-400,#E24B4A);">−RM ${calc.fertCost.toFixed(2)}</span>
      </div>
      ${assumptionNote}
    </div>
    <div class="wif-cost-row wif-cost-net">
      <span>⭐ You saved</span>
      <span style="color:${netClass};font-weight:500;">RM ${calc.net.toFixed(2)}</span>
    </div>`;

  // Only set the note if AI hasn't already filled it with a real response
  const noteEl = document.getElementById('wif-cost-ai-note');
  if (noteEl && !window._wif_aiNoteSet) noteEl.textContent = calc.note;
  wifRenderSavingsChart(weeks, plant);
  if (window._wif_lastCostAiData) wifRenderCostAiDetail(window._wif_lastCostAiData);
  // ✅ NO AI call here — AI fires once on plant-change only, via wifTriggerCostAi()
}

function wifRenderSavingsChart(weeks, plant) {
  const canvas = document.getElementById('wif-savings-chart');
  if (!canvas) return;

  if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    script.onload = () => wifDrawChart(canvas, weeks, plant);
    document.head.appendChild(script);
  } else {
    wifDrawChart(canvas, weeks, plant);
  }
}

function wifDrawChart(canvas, weeks, plant) {
  if (wif_savingsChart) { wif_savingsChart.destroy(); wif_savingsChart = null; }

  const labels = [];
  const data   = [];
  for (let w = 1; w <= weeks; w++) {
    labels.push('W' + w);
    data.push(wifCalculateSavings(plant, w, window._wif_lastSensors || {}).net);
  }

  wif_savingsChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Net savings (RM)',
        data,
        backgroundColor: '#97C459',
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: v => 'RM ' + v.raw.toFixed(2) } },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => 'RM ' + v, font: { size: 10 } },
          grid: { color: 'rgba(128,128,128,0.08)' },
        },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      },
    },
  });
}

/* ============================================================
   TAB 2 — AI COST ANALYSIS
   Called ONCE per plant selection change — not on every slider move
   ============================================================ */

// Called only when the plant dropdown changes
function wifTriggerCostAi() {
  const plant = document.getElementById('wif-cost-plant')?.value;
  const weeks = parseInt(document.getElementById('wif-sl-weeks')?.value || 1);
  if (!plant) return;

  // Reset so the note shows fresh for the new plant
  window._wif_aiNoteSet = false;
  window._wif_lastCostAiData = null;
  document.getElementById('wif-ai-savings-detail')?.remove();

  wifUpdateCost(); // re-render numbers for new plant
  wifFetchCostAssumptions(plant);
  wifFetchCostAi(plant, wif_cosRows, weeks); // call AI once
}

function wifRenderCostAiDetail(data = {}) {
  const calc = window._wif_lastCostProjection;
  if (!calc) return;

  document.getElementById('wif-ai-savings-detail')?.remove();

  const score = wifNumber(data.conditionScore, window._wif_dynamicCondition?.score);
  const label = data.conditionLabel || window._wif_dynamicCondition?.label || 'Unknown';
  const waterHistory = data.waterUsedLiters !== null && data.waterUsedLiters !== undefined
    ? `${Number(data.waterUsedLiters).toFixed(2)} L recorded`
    : 'No flow reading';
  const energyHistory = data.energyUsedKwh !== null && data.energyUsedKwh !== undefined
    ? `${Number(data.energyUsedKwh).toFixed(2)} kWh recorded`
    : 'No energy meter reading';
  const historyCount = data.historicalStats?.totalReadings || 0;
  const netColour = calc.net === null ? 'var(--text-secondary,#666)' : calc.net >= 0 ? 'var(--accent,#639922)' : 'var(--red-400,#E24B4A)';
  const money = value => value === null || value === undefined ? '--' : `RM ${value.toFixed(2)}`;

  const detail = document.createElement('div');
  detail.id = 'wif-ai-savings-detail';
  detail.innerHTML = `
    <div class="wif-card" style="margin-bottom:12px;border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
      <div class="wif-card-title">🤖 AI Savings Analysis</div>
      <div class="wif-metric-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:10px;">
        <div class="wif-metric">
          <div class="wif-metric-val" style="font-size:15px;color:var(--teal-600,#0F6E56);">${score !== null ? `${Math.round(score)}%` : '—'}</div>
          <div class="wif-metric-lbl">Farm condition: ${wifEscapeHtml(label)}</div>
        </div>
        <div class="wif-metric">
          <div class="wif-metric-val" style="font-size:15px;color:${netColour};">${money(calc.net)}</div>
          <div class="wif-metric-lbl">Saved vs pasar</div>
        </div>
      </div>
      <div class="wif-cost-row wif-cost-expense">
        <span class="wif-cost-lbl">💧⚡🧪 Resource cost breakdown</span>
        <span style="color:var(--red-400,#E24B4A);">${calc.expenses === null ? '--' : `−${money(calc.expenses)}`}</span>
      </div>
      <div class="wif-cost-row" style="background:var(--bg-secondary,#f5f5f5);">
        <span class="wif-cost-lbl">Firebase history (${historyCount} readings)</span>
        <span style="font-size:11px;color:var(--text-secondary,#666);">${wifEscapeHtml(waterHistory)} · ${wifEscapeHtml(energyHistory)}</span>
      </div>
    </div>`;

  const costSection = document.getElementById('wif-cost');
  const cards = costSection?.querySelectorAll(':scope > .wif-card');
  if (cards?.length >= 3) {
    cards[2].before(detail);
  } else {
    costSection?.appendChild(detail);
  }
}

async function wifFetchCostAi(plant, units, weeks) {
  const noteEl = document.getElementById('wif-cost-ai-note');
  if (noteEl) noteEl.textContent = '🤖 Analyzing your sensor data...';

  const sensors = await fetchWeeklyAvgSensors();
  if (!sensors) {
    window._wif_lastSensors = null;
    wifUpdateCost();
    if (noteEl) noteEl.textContent = 'Firebase sensor readings are required before AI cost analysis.';
    return;
  }

  // Cache sensors and re-render cost breakdown once with real values
  window._wif_lastSensors = sensors;
  wifUpdateCost();

  // Remove stale AI card before inserting a fresh one
  document.getElementById('wif-ai-savings-detail')?.remove();

  try {
    // Dynamic AI scoring from live sensors
let score = 100;

if (sensors.temp !== null && (sensors.temp > 32 || sensors.temp < 20)) score -= 15;
if (sensors.humid !== null && (sensors.humid > 85 || sensors.humid < 40)) score -= 10;
if (sensors.water !== null && sensors.water < 35) score -= 20;
if (sensors.light !== null && sensors.light < 40) score -= 15;
if (sensors.nutrient !== null && sensors.nutrient < 45) score -= 15;

score = Math.max(25, Math.min(100, score));

let label = 'Excellent';

if (score < 90) label = 'Good';
if (score < 70) label = 'Moderate';
if (score < 50) label = 'Poor';

window._wif_dynamicCondition = {
  score,
  label
};

    const res = await fetch(`${API_BASE}/api/whatif/costsaving`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plant,
        units,
        weeks,
        ...wifBuildAiSensorContext(sensors),
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || `Server error ${res.status}`);

    window._wif_aiNoteSet = true; // prevent wifUpdateCost from overwriting this
    if (noteEl) noteEl.textContent = data.insight || 'AI analysis complete.';
    window._wif_lastCostAiData = data;
    wifRenderCostAiDetail(data);

  } catch (err) {
    if (noteEl) noteEl.textContent = `AI analysis unavailable - ${err.message}. Showing calculated estimates only.`;
  }
}

/* ============================================================
   TAB 3 — NEW PLANT
   ============================================================ */

// MODIFIED: three new functions drive the smart-search input/suggestion UI
let _wifNpDebounceTimer = null;
function wifNpFilterSuggestions() {
  const input = document.getElementById('wif-np-input');
  const box = document.getElementById('wif-np-suggestions');

  if (!input || !box) return;

  const q = input.value.trim().toLowerCase();

  // Show matching known plants
  const matches = WIF_NP_SPECIES.filter(p =>
    p.name.toLowerCase().includes(q)
  );

  // If exact known species
  const exact = matches.find(m =>
    m.name.toLowerCase() === q
  );

  if (exact) {
    wif_curNp = exact.id;
    clearTimeout(_wifNpDebounceTimer);
    _wifNpDebounceTimer = setTimeout(wifUpdateNewPlant, 400);
  }

  // Unknown plant typed manually
  if (!exact && q.length > 0) {
    wif_curNp = q;
    clearTimeout(_wifNpDebounceTimer);
    _wifNpDebounceTimer = setTimeout(wifUpdateNewPlant, 600);
  }

  // Render suggestions
  if (matches.length === 0) {
    box.innerHTML = `
      <div class="wif-np-sug-item">
        🤖 Analyze "${q}"
      </div>
    `;
  } else {
    box.innerHTML = matches.map(p => `
      <div class="wif-np-sug-item"
           onclick="wifSelectNp('${p.id}')">
        <span class="wif-np-sug-emoji">${p.emoji}</span>
        ${p.name}
      </div>
    `).join('');
  }

  box.style.display = 'block';
}

function wifNpShowSuggestions() {
  const q = document.getElementById('wif-np-input').value.toLowerCase();
  const list = q
    ? WIF_NP_SPECIES.filter(s => s.name.toLowerCase().includes(q))
    : WIF_NP_SPECIES;
  wifRenderNpSuggestions(list);
}

function wifNpHideSuggestions() {
  const el = document.getElementById('wif-np-suggestions');
  if (el) el.style.display = 'none';
}

function wifRenderNpSuggestions(list) {
  const el = document.getElementById('wif-np-suggestions');
  if (!el) return;
  if (!list.length) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  el.innerHTML = list.map(s => `
    <div class="wif-np-sug-item" data-id="${s.id}" data-name="${s.name}">
      <span class="wif-np-sug-emoji">${s.emoji}</span>
      <span>${s.name}</span>
    </div>`).join('');
  
el.querySelectorAll('.wif-np-sug-item').forEach(item => {
  item.addEventListener('click', () => {
    wifSelectSpecies(item.dataset.id, item.dataset.name);
  });
});
}

function wifSelectNp(species) {
  wif_curNp = species.toLowerCase();

  const input = document.getElementById('wif-np-input');
  if (input) {
    const item = WIF_NP_SPECIES.find(s => s.id === species);
    input.value = item ? `${item.emoji} ${item.name}` : species;
  }

  wifUpdateNewPlant();
  wifNpHideSuggestions();
}

function wifSelectSpecies(id, name) {
  wif_curNp = id;
  const inp = document.getElementById('wif-np-input');
  if (inp) inp.value = name;
  wifNpHideSuggestions();
  wifUpdateNewPlant();
}

function wifChangeQty(delta) {
  wif_qty = Math.max(1, Math.min(20, wif_qty + delta));
  const el = document.getElementById('wif-qty-disp');
  if (el) el.textContent = wif_qty;
  wifUpdateNewPlant();
}

// Build real tier zones from the farm's rack config and planted crops.
// Falls back to WIF_ZONES static data if farm state is unavailable.
function wifBuildFarmZones() {
  try {
    const currentFarm = wifGetCurrentFarm();
    if (!currentFarm) return null;

    const plants = Array.isArray(currentFarm.plants) ? currentFarm.plants : [];
    if (!plants.length) return null;

    // Detect tier count from rackLabel or rackTypeId
    const rackStr = currentFarm.rackLabel || currentFarm.rackTypeId || '3-tier';
    const tierMatch = rackStr.match(/(\d+)/);
    const totalTiers = tierMatch ? parseInt(tierMatch[1]) : 3;

    // Group plants by their tier field (new format) or by index (old format)
    const tierMap = {};
    const hasTierField = plants.some(p => p.tier !== undefined);

    if (hasTierField) {
      // New format: each plant has a `tier` field
      plants.forEach(p => {
        const t = p.tier || 1;
        if (!tierMap[t]) tierMap[t] = [];
        tierMap[t].push(p);
      });
    } else {
      // Old format: distribute plants evenly across tiers
      const slotsPerTier = Math.ceil(plants.length / totalTiers);
      plants.forEach((p, i) => {
        const t = Math.floor(i / slotsPerTier) + 1;
        if (!tierMap[t]) tierMap[t] = [];
        tierMap[t].push(p);
      });
    }

    // Get slots per tier from first plant's position data or assume 3
    const slotsPerTier = currentFarm.slotsPerTier
      || Math.max(...plants.map(p => p.position || 1))
      || 3;

    return Array.from({ length: totalTiers }, (_, i) => {
      const tier = i + 1;
      const tierPlants = tierMap[tier] || [];
      const fillPct = Math.round((tierPlants.length / slotsPerTier) * 100);
      const cropLabel = [...new Set(tierPlants.map(p => p.name))].join(', ') || 'Empty';
      return {
        zone: `Tier ${tier}`,
        crop: cropLabel,
        fill: Math.min(fillPct, 100)
      };
    });
  } catch (err) {
    console.warn('wifBuildFarmZones error:', err);
    return null;
  }
}

function wifRenderZones() {
  const zoneList = document.getElementById('wif-zone-list');
  if (!zoneList) return;

  const zones = wifBuildFarmZones() || WIF_ZONES;

  zoneList.innerHTML = zones.map(z => `
    <div class="wif-zone-row">
      <div>
        <div class="wif-zone-name">${z.zone} — ${z.crop}</div>
        <div class="wif-zone-meta">${z.fill}% capacity</div>
      </div>
      <span class="wif-badge ${z.fill >= 90 ? 'wif-badge-red' : z.fill >= 75 ? 'wif-badge-amber' : 'wif-badge-green'}">
        ${z.fill >= 90 ? 'Full' : z.fill >= 75 ? 'Near full' : 'Available'}
      </span>
    </div>`).join('');
}

// Synchronous — renders immediately from static data + fires AI in background.
// Zones and impact cards are always visible; AI updates readiness + advisor card when it resolves.
function wifUpdateNewPlant() {
  const impactGrid = document.getElementById('wif-impact-grid');
  const noteEl     = document.getElementById('wif-np-ai-note');
  if (!impactGrid || !noteEl) return;

  const d = WIF_NP_DATA[wif_curNp];

  // ===== READINESS — from static data if available =====
  const readyTitleEl = document.getElementById('wif-ready-title');
  const readySubEl   = document.getElementById('wif-ready-sub');
  // Check real zone availability first
  const zones = wifBuildFarmZones();
  const hasSpace = zones ? zones.some(z => z.fill < 90) : true;
  const availableZone = zones?.find(z => z.fill < 90);
  const allFull = zones ? zones.every(z => z.fill >= 90) : false;

  if (allFull) {
    if (readyTitleEl) readyTitleEl.textContent = 'No space available';
    if (readySubEl)   readySubEl.textContent   = 'All tiers are full. Harvest existing crops first to free up space.';
  } else if (availableZone) {
    if (readyTitleEl) readyTitleEl.textContent = `Space available in ${availableZone.zone}`;
    if (readySubEl)   readySubEl.textContent   =
      `${availableZone.zone} is ${availableZone.fill}% full — has room for new plants.`;
  } else if (d) {
    if (readyTitleEl) readyTitleEl.textContent = `You can plant in ${d.readyDays} days`;
    if (readySubEl)   readySubEl.textContent   =
      `${d.readyZone} harvests on Day ${d.readyDays} — freeing ${d.space} of space.`;
  } else {
    if (readyTitleEl) readyTitleEl.textContent = 'Ready for planting';
    if (readySubEl)   readySubEl.textContent   = 'Current farm conditions are suitable.';
  }

  // ===== ZONES — built from real farm rack tiers =====
  wifRenderZones();

  // ===== IMPACT CARDS — scaled by qty from static data =====
  if (d?.impacts?.length) {
    const scale = Math.min(wif_qty / 4, 3); // cap at 3× to prevent extreme values
    impactGrid.innerHTML = d.impacts.filter(imp => imp.name !== 'Temperature').map(imp => {
      let display = imp.change;
      if (imp.dir !== 'ok') {
        const num = parseFloat(imp.change);
        if (!isNaN(num)) {
          const scaled = num * scale;
          const sign   = scaled > 0 ? '+' : '';
          const unit   = imp.change.includes('%') ? '%'
                       : imp.change.includes('°') ? '°C'
                       : imp.change.includes('h') ? 'h' : '';
          display = sign + scaled.toFixed(1).replace(/\.0$/, '') + unit;
        }
      }
      return `
        <div class="wif-impact-card ${imp.dir}">
          <div class="wif-impact-emoji">${imp.emoji}</div>
          <div class="wif-impact-name">${imp.name}</div>
          <div class="wif-impact-val ${imp.dir}">${display}</div>
        </div>`;
    }).join('');
  } else {
    impactGrid.innerHTML = `
      <div class="wif-impact-card ok" style="grid-column:1/-1;text-align:center;padding:18px;">
        <div class="wif-impact-emoji">🌱</div>
        <div class="wif-impact-name">Impact</div>
        <div class="wif-impact-val ok">Calculating...</div>
      </div>`;
  }

  // ===== AI NOTE + ADVISOR — async, fires in background =====
noteEl.style.display = 'none'; // hidden while advisor card loads
  wifFetchNewPlantAi(wif_curNp, wif_qty);
}

function wifLocalVerticalFarmBlocker(species) {
  const s = String(species || '').toLowerCase();
  const blocked = ['apple', 'mango', 'durian', 'coconut', 'avocado', 'pear', 'orange', 'lemon', 'lime', 'grapefruit', 'rambutan', 'lychee'];
  const smallForm = /sprout|microgreen|seedling|dwarf/.test(s);
  return blocked.some(crop => s.includes(crop)) && !smallForm;
}

function wifRenderNewPlantFallback({ species, quantity, sensors, reason }) {
  const advisorCard = document.getElementById('wif-np-advisor-card');
  const advisorBody = document.getElementById('wif-np-advisor-body');
  const impactGrid  = document.getElementById('wif-impact-grid');
  const readyTitleEl = document.getElementById('wif-ready-title');
  const readySubEl   = document.getElementById('wif-ready-sub');
  const profile = wifGetCostAssumptions(species);
  const blocked = wifLocalVerticalFarmBlocker(species);
  const currentTemp = wifNumber(sensors?.temp);
  const currentHumid = wifNumber(sensors?.humid);
  const currentMoisture = wifNumber(sensors?.water);
  const currentEc = wifNumber(sensors?.ec);
  const waterLMonth = parseFloat((profile.waterMLDay * quantity * 30 / 1000).toFixed(1));
  const fertMLWeek = parseFloat((profile.fertMLWeek * quantity).toFixed(1));
  const energyKWhMonth = parseFloat((profile.lightHours * LIGHT_KW_PER_STRIP * quantity * 30).toFixed(2));
  const resourceCost = parseFloat((
    waterLMonth * WATER_RATE_RM_PER_LITRE +
    fertMLWeek * 4.33 * FERTILIZER_RATE_RM_PER_ML +
    energyKWhMonth * ELECTRICITY_RATE_RM_PER_KWH
  ).toFixed(2));

  const warnings = [];
  if (blocked) warnings.push(`${species} is a tree/orchard crop and is not practical for compact indoor vertical farming.`);
  if (currentTemp !== null && (currentTemp < 18 || currentTemp > 30)) warnings.push(`Temperature is ${currentTemp}C; many indoor crops prefer roughly 18-30C.`);
  if (currentHumid !== null && (currentHumid < 45 || currentHumid > 85)) warnings.push(`Humidity is ${currentHumid}%; check ventilation before planting.`);
  if (currentMoisture !== null && currentMoisture < 30) warnings.push(`Root moisture is low at ${currentMoisture.toFixed(1)}%.`);
  if (currentEc !== null && (currentEc < 1.0 || currentEc > 2.5)) warnings.push(`EC is ${currentEc}; adjust nutrient strength before scaling.`);

  if (advisorCard) advisorCard.style.display = 'block';
  if (advisorBody) {
    const source = sensors?.source || 'Firebase sensorReadings';
    const warningHtml = warnings.length
      ? `<div style="margin-top:8px;padding:8px 10px;background:var(--amber-50,#FAEEDA);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--amber-800,#633806);">⚠️ ${warnings.map(wifEscapeHtml).join(' · ')}</div>`
      : `<div style="margin-top:8px;padding:8px 10px;background:var(--green-50,#EAF3DE);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--green-800,#27500A);">✅ Firebase conditions look workable for a beginner trial.</div>`;
    advisorBody.innerHTML = `
      <div style="font-size:12px;color:var(--teal-600,#0F6E56);line-height:1.5;">
        ${blocked
          ? `${wifEscapeHtml(species)} is not recommended for this vertical farm format.`
          : `Fast estimate for ${wifEscapeHtml(species)} using Firebase readings while the full AI advisor is slow.`}
      </div>
      ${warningHtml}
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
        <span class="wif-badge ${blocked ? 'wif-badge-red' : 'wif-badge-green'}">${blocked ? '😟 Not suitable' : '😊 Worth trying'}</span>
        <span class="wif-badge wif-badge-blue">AI timed out</span>
      </div>
      <div style="font-size:10px;color:var(--text-secondary,#777);margin-top:8px;">Reason: ${wifEscapeHtml(reason)} · Source: ${wifEscapeHtml(source)}</div>`;
  }

  if (readyTitleEl) readyTitleEl.textContent = blocked ? 'Not recommended' : 'Estimated suitable';
  if (readySubEl) readySubEl.textContent = blocked
    ? 'Choose compact leafy greens, herbs, or fruiting vegetables instead.'
    : 'This is a fast estimate from Firebase conditions and crop resource references.';

  if (impactGrid) {
    impactGrid.innerHTML = blocked ? `
      <div class="wif-impact-card warn" style="grid-column:1/-1;">
        <div class="wif-impact-emoji">⚠️</div>
        <div class="wif-impact-name">Vertical farming fit</div>
        <div class="wif-impact-val warn">Not suitable</div>
      </div>` : `
      <div class="wif-impact-card up">
        <div class="wif-impact-emoji">💧</div>
        <div class="wif-impact-name">Water needed</div>
        <div class="wif-impact-val up">${waterLMonth} L/mo</div>
      </div>
      <div class="wif-impact-card up">
        <div class="wif-impact-emoji">🧪</div>
        <div class="wif-impact-name">Fertilizer needed</div>
        <div class="wif-impact-val up">${fertMLWeek} mL/wk</div>
      </div>
      <div class="wif-impact-card up">
        <div class="wif-impact-emoji">⚡</div>
        <div class="wif-impact-name">Energy needed</div>
        <div class="wif-impact-val up">${energyKWhMonth} kWh/mo</div>
      </div>
      <div class="wif-impact-card up">
        <div class="wif-impact-emoji">💵</div>
        <div class="wif-impact-name">Extra resource cost</div>
        <div class="wif-impact-val up">RM ${resourceCost.toFixed(2)}/mo</div>
      </div>`;
  }
}

async function wifFetchNewPlantAi(species, quantity) {
  const noteEl      = document.getElementById('wif-np-ai-note');
  const advisorCard = document.getElementById('wif-np-advisor-card');
  const advisorBody = document.getElementById('wif-np-advisor-body');
  const requestId   = ++wif_npAiRequestId;
  const speciesName = wifEscapeHtml(species);

  // Show advisor card in loading state immediately
  if (advisorCard) {
    advisorCard.style.display = 'block';
    advisorBody.innerHTML = `
      <div class="wif-ai-note" style="margin:0;">
        <span>🤖</span><span>Analysing <strong>${speciesName}</strong> with Firebase history. If the AI is slow, a fast estimate will appear automatically.</span>
      </div>`;
  }

  const [sensors, farmLevelSensors] = await Promise.all([
    fetchSensorData(),
    fetchFarmLevelSensorData(),
  ]);
  if (requestId !== wif_npAiRequestId) return;

  // Use real planted crops as context; fall back to sensible defaults
  const currentCrops = window._WIF_DYNAMIC_CROPS
    ? window._WIF_DYNAMIC_CROPS.map(c => c.id)
    : ['lettuce', 'tomato', 'basil'];

  try {
    const sensorContext = wifBuildAiSensorContext(sensors, farmLevelSensors);
    const data = await wifPostJsonWithTimeout(`${API_BASE}/api/whatif/newplant`, {
      species, quantity, currentCrops, ...sensorContext
    }, 12000);
    if (requestId !== wif_npAiRequestId) return;

    // Normalise response — handles both /newplant and /newplant-ai server shapes
    const analysis  = data.analysis || {};
    data.unsuitable = analysis.suitable === false || data.unsuitable === true;
    data.insight    = analysis.reason
      ? `${analysis.reason} ${analysis.careAdvice || ''}`.trim()
      : (data.insight || 'Analysis complete.');
    data.warnings   = analysis.warnings || data.warnings || [];
    data.supported  = !data.unsuitable;
    data.score      = wifNumber(analysis.compatibilityScore, data.score);

    // ===== ADVISOR CARD =====
    if (advisorBody) {
      if (data.unsuitable) {
        advisorBody.innerHTML = `
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;">
            <span style="font-size:28px;">⚠️</span>
            <div>
              <div style="font-size:13px;font-weight:500;color:var(--red-400,#E24B4A);margin-bottom:4px;">Not suitable for indoor vertical farming</div>
              <div style="font-size:12px;color:var(--text-secondary,#666);">${wifEscapeHtml(data.insight)}</div>
            </div>
          </div>`;
      } else {
        const warningHtml = data.warnings?.length
          ? `<div style="margin-top:8px;padding:8px 10px;background:var(--amber-50,#FAEEDA);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--amber-800,#633806);">
               ⚠️ ${data.warnings.map(wifEscapeHtml).join(' · ')}
             </div>`
          : `<div style="margin-top:8px;padding:8px 10px;background:var(--green-50,#EAF3DE);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--green-800,#27500A);">
               ✅ All projected values within the crop-specific safe range
             </div>`;
        const gapRows = Object.values(data.sensorGap || {})
          .filter(Boolean)
          .slice(0, 4)
          .map(g => {
            const unit = g.unit || '';
            const current = g.current === null || g.current === undefined ? 'No data' : `${g.current}${unit}`;
            const ideal = g.idealMin === undefined || g.idealMax === undefined ? 'n/a' : `${g.idealMin}-${g.idealMax}${unit}`;
            const action = g.action === 'increase' ? 'Raise' : g.action === 'reduce' ? 'Reduce' : g.action === 'maintain' ? 'Maintain' : 'Check';
            return `<div class="wif-cost-row" style="background:var(--bg-secondary,#f5f5f5);margin-bottom:4px;">
              <span class="wif-cost-lbl">${wifEscapeHtml(g.label)}: ${wifEscapeHtml(current)} / ideal ${wifEscapeHtml(ideal)}</span>
              <span style="font-size:11px;color:var(--teal-600,#0F6E56);">${action}</span>
            </div>`;
          }).join('');
        const diffEmoji = data.score === null ? '🌱'
          : data.score >= 75 ? '😊'
          : data.score >= 50 ? '😐'
          : '😟';
        const diffLabel = data.score === null ? 'Checking...'
          : data.score >= 75 ? 'Easy to grow'
          : data.score >= 50 ? 'Needs some care'
          : 'Needs attention';
        const scoreBadge = `<span class="wif-badge wif-badge-green" style="font-size:11px;">${diffEmoji} ${diffLabel}</span>`;
        const sourceText = data.sensorSource || sensors?.source || 'Firebase sensorReadings';
        advisorBody.innerHTML = `
          <div style="font-size:12px;color:var(--teal-600,#0F6E56);line-height:1.5;">${wifEscapeHtml(data.insight)}</div>
          ${warningHtml}
          ${gapRows ? `<div style="margin-top:10px;">${gapRows}</div>` : ''}
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
            <span class="wif-badge wif-badge-green">✅ Good for your farm</span>
            ${scoreBadge}
          </div>
          <div style="font-size:10px;color:var(--text-secondary,#777);margin-top:8px;">Source: ${wifEscapeHtml(sourceText)}</div>`;
      }
    }

// ===== AI NOTE — hide it when advisor card is visible =====
    if (noteEl) {
      const hasAdvisorCard = advisorCard && advisorCard.style.display !== 'none';
      noteEl.style.display = hasAdvisorCard ? 'none' : 'flex';
      noteEl.textContent = data.insight;
    }

    // ===== READINESS — only update if AI says unsuitable, keep zone message otherwise =====
    const readyTitleEl = document.getElementById('wif-ready-title');
    const readySubEl   = document.getElementById('wif-ready-sub');
    const zones = wifBuildFarmZones();
    const allFull = zones ? zones.every(z => z.fill >= 90) : false;

    if (!data.supported) {
      // AI says unsuitable — always show this
      if (readyTitleEl) readyTitleEl.textContent = 'Not recommended right now';
      if (readySubEl)   readySubEl.textContent   = data.warnings?.[0] || 'Check the AI advisor for details.';
    } else if (allFull) {
      // Farm full — keep the zone message, don't overwrite with "Ready for planting"
      if (readyTitleEl) readyTitleEl.textContent = 'No space available';
      if (readySubEl)   readySubEl.textContent   = 'All tiers are full. Harvest existing crops first to free up space.';
    }
    // If supported + space available, keep whatever wifUpdateNewPlant already set

    // ===== IMPACT GRID — enrich static cards with API numeric deltas if provided =====
    const impactGrid = document.getElementById('wif-impact-grid');
    if (impactGrid && data.unsuitable) {
      impactGrid.innerHTML = `
        <div class="wif-impact-card warn" style="grid-column:1/-1;">
          <div class="wif-impact-emoji">⚠️</div>
          <div class="wif-impact-name">Vertical farming fit</div>
          <div class="wif-impact-val warn">Not suitable</div>
        </div>`;
    }
    if (impactGrid && !data.unsuitable && data.demand) {
      const d = data.demand;
      impactGrid.innerHTML = `
        <div class="wif-impact-card up">
          <div class="wif-impact-emoji">💧</div>
          <div class="wif-impact-name">Water needed</div>
          <div class="wif-impact-val up">${wifNumber(d.waterLPerMonth) ?? 0} L/mo</div>
        </div>
        <div class="wif-impact-card up">
          <div class="wif-impact-emoji">🧪</div>
          <div class="wif-impact-name">Fertilizer needed</div>
          <div class="wif-impact-val up">${wifNumber(d.fertMLPerWeek) ?? 0} mL/wk</div>
        </div>
        <div class="wif-impact-card up">
          <div class="wif-impact-emoji">⚡</div>
          <div class="wif-impact-name">Energy needed</div>
          <div class="wif-impact-val up">${wifNumber(d.lightKWhPerMonth) ?? 0} kWh/mo</div>
        </div>
        <div class="wif-impact-card up">
          <div class="wif-impact-emoji">💵</div>
          <div class="wif-impact-name">Extra resource cost</div>
          <div class="wif-impact-val up">RM ${(wifNumber(d.totalMonthlyCostRM) ?? 0).toFixed(2)}/mo</div>
        </div>`;
    } else
    if (impactGrid && !data.unsuitable && data.impacts) {
      const apiDeltas = {
        'Temperature': data.impacts?.tempChange,
        'Humidity':    data.impacts?.humidChange,
        'Light (h/d)': data.impacts?.lightChange,
        'Fertilizer':  data.impacts?.nutrientChange,
      };
      const staticImpacts = WIF_NP_DATA[species]?.impacts || [];
      const merged = staticImpacts.map(i => {
        const apiVal = apiDeltas[i.name];
        if (apiVal === undefined || apiVal === null) return i;
        const sign   = apiVal > 0 ? '+' : '';
        const unit   = i.name.includes('Light') ? 'h' : i.name.includes('Temp') ? '°C' : '%';
        const change = apiVal === 0 ? 'No change' : `${sign}${apiVal}${unit}`;
        const dir    = apiVal === 0 ? 'ok' : apiVal > 0 ? 'up' : 'down';
        return { ...i, change, dir };
      });
      const filteredMerged = merged.filter(i => i.name !== 'Temperature');
      if (filteredMerged.length > 0) {
        impactGrid.innerHTML = filteredMerged.map(i => `
          <div class="wif-impact-card ${i.dir || 'ok'}">
            <div class="wif-impact-emoji">${i.emoji || '🌱'}</div>
            <div class="wif-impact-name">${i.name || 'Unknown'}</div>
            <div class="wif-impact-val ${i.dir || 'ok'}">${i.change || 'No change'}</div>
          </div>`).join('');
      }
    }

  } catch (err) {
    if (requestId !== wif_npAiRequestId) return;
    wifRenderNewPlantFallback({
      species,
      quantity,
      sensors,
      reason: err.name === 'AbortError' ? 'full AI advisor took more than 12 seconds' : err.message,
    });
    if (noteEl) noteEl.textContent = `Fast estimate shown because AI advisor is slow.`;
  }
}