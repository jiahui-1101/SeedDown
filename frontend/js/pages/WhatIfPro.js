/* ============================================================
   WhatIfPro.js  —  ES Module
   export render()       → HTML string (call first)
   export init()         → wire interactivity after render() is in DOM
   export renderScreen() → full-page mount helper

   CHANGES vs original:
   ─ Forecast tab now uses ONLY the user's planted crops (from localStorage)
     instead of the hardcoded PRO_CROPS list.
   ─ Forecast adds 30 / 60 / 90-day horizon quick-picks and a "best time
     to sell" recommendation per crop based on yield maturity.
   ─ FARM_ZONES is removed. Zone data is built live from the current farm's
     plants; random fill% replaced with slot-occupancy calculation.
   ─ Cost tab crop selector is now populated from planted crops, not
     PRO_CROPS. Falls back gracefully to PRO_CROPS if farm is empty.
   ─ New Plant tab: hardcoded NP_AI_NOTES replaced with a real Anthropic
     API call that receives live sensor data and returns a proper advisor
     response. Loading state + error fallback included.
   ─ New Plant tab: added economic impact summary (est. yield kg + value
     + extra monthly resource cost) below the impact grid.
   ─ Multi-farm selector added at the top — if user has multiple farms in
     localStorage they can switch between them; KPIs update instantly.
   ─ Duplicate finance tab removed; this screen now focuses on production
     planning and new-plant future profit.
   ============================================================ */

import { AppState } from '../store.js';
import { showScreen } from '../utils/navigation.js';
import { initFirebase, loadUserData } from '../utils/firebase.js';

/* ─────────────────────────────────────────────
   CONSTANTS & RATES
───────────────────────────────────────────── */
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000' : window.location.origin;

// Malaysian utility rates (2024)
const RATES = {
  waterRM:  0.042,  // RM/litre — Syabas domestic block 1
  energyRM: 1.10,   // RM/kWh  — TNB domestic block 1
  fertRM:   0.085,  // RM/mL   — hydroponic nutrient solution avg
};

const RACK_LAYOUTS = {
  '2-tier': { tiers: 2, slotsPerTier: 3, label: '2-Tier Starter Rack' },
  '3-tier': { tiers: 3, slotsPerTier: 3, label: '3-Tier Vertical Rack' },
  '4-tier': { tiers: 4, slotsPerTier: 4, label: '4-Tier Grow Shelf' },
  '5-tier': { tiers: 5, slotsPerTier: 4, label: '5-Tier Tower Rack' },
  wall: { tiers: 4, slotsPerTier: 5, label: 'Wall Panel Grid' },
  'a-frame': { tiers: 4, slotsPerTier: 4, label: 'A-Frame Pyramid' },
  'nft-channel': { tiers: 3, slotsPerTier: 6, label: 'NFT Channel Rows' },
  hanging: { tiers: 5, slotsPerTier: 3, label: 'Hanging Column Farm' },
  'commercial-multi-zone': { tiers: 1, slotsPerTier: 12, label: 'Commercial Multi-Zone Farm' },
};

const MARKET_SOURCE_LINKS = [
  {
    label: 'PriceCatcher transactional records',
    url: 'https://data.gov.my/data-catalogue/pricecatcher',
    note: 'Official Malaysia open-data price surveillance records by KPDN/DOSM.',
  },
  {
    label: 'FAMA Harga Pasaran Terkini',
    url: 'https://www.fama.gov.my/harga-pasaran-terkini',
    note: 'Official FAMA market-price reference.',
  },
  {
    label: 'Selina Wamucii Malaysia vegetables',
    url: 'https://www.selinawamucii.com/insights/prices/malaysia/vegetables/',
    note: 'Public export and wholesale market references.',
  },
];

const VERTICAL_FARMING_RESOURCE_LINKS = [
  {
    label: 'Cornell Controlled Environment Agriculture',
    url: 'https://cea.cals.cornell.edu/',
  },
  {
    label: 'FAO protected cultivation / vertical farming reference',
    url: 'https://www.fao.org/climate-smart-agriculture-sourcebook/production-resources/module-b1-crops/chapter-b1-3/en/',
  },
  {
    label: 'UKY greens and microgreens labor/post-harvest profile',
    url: 'https://ccd.uky.edu/resources/crops/vegetables/greens',
  },
];

// Fallback crop catalog — used ONLY when no farm is planted yet.
// When a real farm exists, planted crops override this entirely.
const PRO_CROPS_FALLBACK = [
  { id: 'lettuce',     name: 'Lettuce',     icon: '🥬', growDays: 45,  yieldKgPerRow: 4.2,  pricePerKg: 4.8,  waterLpR: 18, energyKWhpR: 2.1, fertMLpR: 120 },
  { id: 'tomato',      name: 'Tomato',      icon: '🍅', growDays: 70,  yieldKgPerRow: 8.5,  pricePerKg: 7.2,  waterLpR: 34, energyKWhpR: 3.8, fertMLpR: 220 },
  { id: 'basil',       name: 'Basil',       icon: '🌿', growDays: 30,  yieldKgPerRow: 1.8,  pricePerKg: 12.0, waterLpR: 10, energyKWhpR: 1.4, fertMLpR:  80 },
  { id: 'spinach',     name: 'Spinach',     icon: '🍃', growDays: 40,  yieldKgPerRow: 3.8,  pricePerKg: 5.0,  waterLpR: 16, energyKWhpR: 1.9, fertMLpR: 100 },
  { id: 'chili',       name: 'Chili',       icon: '🌶️', growDays: 90,  yieldKgPerRow: 5.0,  pricePerKg: 10.0, waterLpR: 22, energyKWhpR: 2.8, fertMLpR: 160 },
  { id: 'cucumber',    name: 'Cucumber',    icon: '🥒', growDays: 60,  yieldKgPerRow: 7.5,  pricePerKg: 4.5,  waterLpR: 30, energyKWhpR: 3.0, fertMLpR: 180 },
  { id: 'strawberry',  name: 'Strawberry',  icon: '🍓', growDays: 90,  yieldKgPerRow: 6.0,  pricePerKg: 12.0, waterLpR: 25, energyKWhpR: 2.5, fertMLpR: 150 },
  { id: 'pepper',      name: 'Bell Pepper', icon: '🫑', growDays: 80,  yieldKgPerRow: 6.4,  pricePerKg: 8.0,  waterLpR: 24, energyKWhpR: 2.6, fertMLpR: 155 },
  { id: 'mint',        name: 'Mint',        icon: '🌿', growDays: 30,  yieldKgPerRow: 1.6,  pricePerKg: 15.0, waterLpR:  8, energyKWhpR: 1.2, fertMLpR:  60 },
  { id: 'carrot',      name: 'Carrot',      icon: '🥕', growDays: 75,  yieldKgPerRow: 6.0,  pricePerKg: 3.5,  waterLpR: 22, energyKWhpR: 2.4, fertMLpR: 140 },
  { id: 'eggplant',    name: 'Eggplant',    icon: '🍆', growDays: 80,  yieldKgPerRow: 7.2,  pricePerKg: 5.5,  waterLpR: 30, energyKWhpR: 3.2, fertMLpR: 190 },
  { id: 'cabbage',     name: 'Cabbage',     icon: '🥦', growDays: 90,  yieldKgPerRow: 9.0,  pricePerKg: 3.2,  waterLpR: 28, energyKWhpR: 2.9, fertMLpR: 160 },
  { id: 'kangkung',    name: 'Kangkung',    icon: '🌱', growDays: 45,  yieldKgPerRow: 3.5,  pricePerKg: 3.0,  waterLpR: 15, energyKWhpR: 1.6, fertMLpR:  90 },
  { id: 'petai',       name: 'Petai',       icon: '🌱', growDays: 45,  yieldKgPerRow: 3.0,  pricePerKg: 6.0,  waterLpR: 15, energyKWhpR: 1.6, fertMLpR:  90 },
];

// New Plant impact data — covers common addable species.
// Each crop's impact values are sourced from crops_data.json impacts block.
const NP_SPECIES_DB = [
  { id: 'spinach',    name: 'Spinach',    icon: '🍃', growDays: 40,  pricePerKg: 5.0,  yieldKgPerRow: 3.8, waterLpR: 16, fertMLpR: 100, temp: '+0.5', hum: '+3',  ph: '0',    light: '-0.5h', fert: '+8%',  dir: ['up','up','ok','down','up'] },
  { id: 'mint',       name: 'Mint',       icon: '🌿', growDays: 30,  pricePerKg: 15.0, yieldKgPerRow: 1.6, waterLpR:  8, fertMLpR:  60, temp: '0',   hum: '+5',  ph: '-0.2', light: '0',     fert: '+5%',  dir: ['ok','up','down','ok','up'] },
  { id: 'chili',      name: 'Chili',      icon: '🌶️', growDays: 90,  pricePerKg: 10.0, yieldKgPerRow: 5.0, waterLpR: 22, fertMLpR: 160, temp: '+1.5',hum: '-4',  ph: '+0.3', light: '+2h',   fert: '+15%', dir: ['warn','down','up','up','warn'] },
  { id: 'cucumber',   name: 'Cucumber',   icon: '🥒', growDays: 60,  pricePerKg: 4.5,  yieldKgPerRow: 7.5, waterLpR: 30, fertMLpR: 180, temp: '+1',  hum: '+6',  ph: '0',    light: '+1h',   fert: '+12%', dir: ['up','up','ok','up','up'] },
  { id: 'strawberry', name: 'Strawberry', icon: '🍓', growDays: 90,  pricePerKg: 12.0, yieldKgPerRow: 6.0, waterLpR: 25, fertMLpR: 150, temp: '-1',  hum: '+2',  ph: '-0.4', light: '+1.5h', fert: '+10%', dir: ['down','ok','down','up','up'] },
  { id: 'kale',       name: 'Kale',       icon: '🥬', growDays: 55,  pricePerKg: 6.0,  yieldKgPerRow: 4.0, waterLpR: 18, fertMLpR: 110, temp: '-0.5',hum: '+2',  ph: '-0.1', light: '0',     fert: '+6%',  dir: ['down','ok','ok','ok','up'] },
  { id: 'broccoli',   name: 'Broccoli',   icon: '🥦', growDays: 70,  pricePerKg: 7.0,  yieldKgPerRow: 5.5, waterLpR: 20, fertMLpR: 130, temp: '-1',  hum: '+3',  ph: '-0.2', light: '+0.5h', fert: '+9%',  dir: ['down','up','down','up','up'] },
  { id: 'celery',     name: 'Celery',     icon: '🌾', growDays: 85,  pricePerKg: 5.5,  yieldKgPerRow: 4.5, waterLpR: 28, fertMLpR: 140, temp: '+0.5',hum: '+8',  ph: '+0.1', light: '+1h',   fert: '+11%', dir: ['up','warn','up','up','up'] },
  { id: 'pepper',     name: 'Bell Pepper',icon: '🫑', growDays: 80,  pricePerKg: 8.0,  yieldKgPerRow: 6.4, waterLpR: 24, fertMLpR: 155, temp: '+1',  hum: '-2',  ph: '0',    light: '+1.5h', fert: '+8%',  dir: ['up','down','ok','up','up'] },
  { id: 'tomato',     name: 'Tomato',     icon: '🍅', growDays: 70,  pricePerKg: 7.2,  yieldKgPerRow: 8.5, waterLpR: 34, fertMLpR: 220, temp: '+1',  hum: '+4',  ph: '+0.1', light: '+1.5h', fert: '+10%', dir: ['up','up','ok','up','up'] },
  { id: 'basil',      name: 'Basil',      icon: '🌿', growDays: 30,  pricePerKg: 12.0, yieldKgPerRow: 1.8, waterLpR: 10, fertMLpR:  80, temp: '0',   hum: '+2',  ph: '0',    light: '+1h',   fert: '+4%',  dir: ['ok','ok','ok','up','up'] },
  { id: 'kangkung',   name: 'Kangkung',   icon: '🌱', growDays: 45,  pricePerKg: 3.0,  yieldKgPerRow: 3.5, waterLpR: 15, fertMLpR:  90, temp: '+0.5',hum: '+3',  ph: '0',    light: '0',     fert: '+5%',  dir: ['up','up','ok','ok','up'] },
  { id: 'petai',      name: 'Petai',      icon: '🌱', growDays: 45,  pricePerKg: 6.0,  yieldKgPerRow: 3.0, waterLpR: 15, fertMLpR:  90, temp: '+0.5',hum: '+3',  ph: '0',    light: '0',     fert: '+5%',  dir: ['up','up','ok','ok','up'] },
];

/* ─────────────────────────────────────────────
   MODULE STATE  (reset on every init() call)
───────────────────────────────────────────── */
let _productionChart = null;
let _npQty       = 10;
let _npSpecies   = NP_SPECIES_DB[0];
let _npFiltered  = [...NP_SPECIES_DB];
let _farmCrops   = [];   // active farm's planted crops mapped to PRO_CROPS shape
let _allFarms    = [];   // all farms from localStorage
let _activeFarmIdx = 0;  // index into _allFarms
let _marketPrices = {};
let _marketSources = [...MARKET_SOURCE_LINKS];
let _marketStatus = { loading: false, error: null, generatedAt: null };
let _sensorSnapshot = null;
let _npAdvisorKey = '';
let _npAiAnalysis = null;
let _npAiUnsuitable = false;

/* ─────────────────────────────────────────────
   FARM DATA HELPERS
───────────────────────────────────────────── */

function _esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function _fmtRM(value, digits = 2) {
  const n = Number(value);
  return Number.isFinite(n) ? 'RM ' + n.toFixed(digits) : '—';
}

function _normaliseCropId(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function _mergeFarms(primary = [], secondary = []) {
  const map = new Map();
  [...primary, ...secondary].forEach(farm => {
    if (!farm) return;
    const key = farm.id || farm.farmId || farm.backendFarmId || farm.name || String(map.size);
    map.set(key, { ...(map.get(key) || {}), ...farm });
  });
  return Array.from(map.values());
}

// Returns all farms from localStorage/AppState first, then Firestore refreshes it.
function _loadAllFarms() {
  let local = [];
  try {
    local = JSON.parse(localStorage.getItem('user_farms') || '[]');
  } catch { local = []; }

  return _mergeFarms(AppState.currentFarm ? [AppState.currentFarm] : [], local);
}

async function _loadFarmsFromFirestore() {
  if (!AppState.uid || AppState.isGuest) return [];
  try {
    await initFirebase();
    const data = await loadUserData(AppState.uid);
    return Array.isArray(data?.farms) ? data.farms : [];
  } catch (err) {
    console.warn('[WhatIfPro] Firestore farm load failed:', err);
    return [];
  }
}

// Returns the active farm object (respects AppState.currentFarm).
function _getActiveFarm(farms) {
  if (!farms.length) return null;
  const fromState = AppState.currentFarm;
  const selected = farms[_activeFarmIdx] || farms[0];
  if (fromState && (!selected || fromState.id === selected.id)) return fromState;
  return selected;
}

function _activeFarmId() {
  const farm = _getActiveFarm(_allFarms);
  return farm?.id || farm?.farmId || farm?.backendFarmId || AppState.currentFarmId || null;
}

// Maps a farm's planted crops to the PRO_CROPS shape so all
// financial and forecast calculations work on real data.
// Falls back to PRO_CROPS_FALLBACK entry if species is unknown.
function _mapFarmCrops(farm) {
  if (!farm?.plants?.length) return [];

  // Deduplicate by species, summing slots.
  const speciesMap = new Map();
  for (const p of farm.plants) {
    const key = _normaliseCropId(p.species || p.name);
    if (speciesMap.has(key)) {
      speciesMap.get(key).slots += (p.slots || 1);
    } else {
      speciesMap.set(key, { ...p, slots: p.slots || 1 });
    }
  }

  return Array.from(speciesMap.values()).map(p => {
    const speciesId = _normaliseCropId(p.species || p.name);
    const fallback = PRO_CROPS_FALLBACK.find(f => f.id === speciesId) || {
      growDays: 60, yieldKgPerRow: 4.0, pricePerKg: 5.0,
      waterLpR: 20, energyKWhpR: 2.0, fertMLpR: 120,
    };
    return {
      id:           speciesId,
      name:         p.name || fallback.name || speciesId,
      icon:         p.emoji || '🌱',
      slots:        p.slots || 1,
      growDays:     fallback.growDays,
      yieldKgPerRow: fallback.yieldKgPerRow * (p.slots || 1),
      pricePerKg:   fallback.pricePerKg,
      waterLpR:     fallback.waterLpR * (p.slots || 1),
      energyKWhpR:  fallback.energyKWhpR * (p.slots || 1),
      fertMLpR:     fallback.fertMLpR * (p.slots || 1),
    };
  });
}

// Builds zone list from the active farm's plants.
// fill% = usedSlots / maxSlots (no randomness).
// harvIn = estimated days until next harvest based on growDays.
function _buildFarmZones(farm) {
  if (!farm) return [];
  const plants = Array.isArray(farm.plants) ? farm.plants : [];

  if (Array.isArray(farm.zones) && farm.zones.length) {
    return farm.zones.map((zone, i) => {
      const zoneId = zone.zone_id || zone.id || `zone_${String.fromCharCode(65 + i)}`;
      const zonePlants = plants.filter(p => (p.zoneId || p.zone_id || p.zoneName) === zoneId || p.zoneName === zone.name);
      const zoneSpecies = zonePlants.length ? zonePlants : (zone.plants || []).map(name => ({ name, species: name, slots: 1 }));
      const capacity = Number(zone.capacity || zone.slots || zone.totalSlots || 12);
      const usedSlots = zoneSpecies.reduce((sum, p) => sum + (Number(p.slots) || 1), 0);
      const fill = Math.min(100, Math.round((usedSlots / Math.max(1, capacity)) * 100));
      const harvIn = _zoneHarvestDays(zoneSpecies);
      return {
        id: zone.name || zone.label || zoneId,
        crop: zone.crop || [...new Set(zoneSpecies.map(p => p.name || p.species))].join(', ') || 'Empty',
        emoji: zoneSpecies[0]?.emoji || '🌱',
        rows: usedSlots,
        capacity,
        availableRows: Math.max(0, capacity - usedSlots),
        fill,
        harvIn,
      };
    });
  }

  const rackId = farm.rackTypeId || farm.rackType || '3-tier';
  const layout = {
    ...(RACK_LAYOUTS[rackId] || RACK_LAYOUTS['3-tier']),
    ...(farm.rackConfig || {}),
  };
  const tiers = Number(layout.tiers || 3);
  const slotsPerTier = Number(layout.slotsPerTier || 3);

  return Array.from({ length: tiers }, (_, i) => {
    const tier = i + 1;
    const tierPlants = plants.filter((p, index) => {
      if (p.tier !== undefined) return Number(p.tier) === tier;
      return Math.floor(index / slotsPerTier) + 1 === tier;
    });
    const usedSlots = tierPlants.reduce((sum, p) => sum + (Number(p.slots) || 1), 0);
    const fill = Math.min(100, Math.round((usedSlots / Math.max(1, slotsPerTier)) * 100));
    return {
      id: `Tier ${tier}`,
      crop: [...new Set(tierPlants.map(p => p.name || p.species))].join(', ') || 'Empty',
      emoji: tierPlants[0]?.emoji || '🌱',
      rows: usedSlots,
      capacity: slotsPerTier,
      availableRows: Math.max(0, slotsPerTier - usedSlots),
      fill,
      harvIn: _zoneHarvestDays(tierPlants),
    };
  });
}

function _zoneHarvestDays(plants = []) {
  const days = plants.map(p => {
    const fallback = PRO_CROPS_FALLBACK.find(f => f.id === _normaliseCropId(p.species || p.name));
    return fallback ? Math.max(7, Math.round(fallback.growDays * 0.6)) : 21;
  });
  return days.length ? Math.min(...days) : 0;
}

function _sensorFallback() {
  return {
    temp:     AppState.sensors?.temp?.val     ?? 28,
    humid:    AppState.sensors?.humid?.val    ?? 68,
    light:    AppState.sensors?.light?.val    ?? 82,
    water:    AppState.sensors?.water?.val    ?? 45,
    nutrient: AppState.sensors?.nutrient?.val ?? 78,
    source:   AppState.latestReading ? 'AppState live cache' : 'local fallback',
  };
}

function _sensorQueryForFarm(farm) {
  const deviceId = farm?.deviceId || farm?.farmMaster?.deviceId || AppState.currentFarm?.deviceId || 'farm_001';
  const params = new URLSearchParams();
  if (deviceId) params.set('deviceId', deviceId);
  return params.toString();
}

function _normaliseSensorPayload(payload = {}) {
  const reading = payload.reading || payload;
  const fallback = _sensorFallback();
  const lightRaw = Number(reading.lightRaw);
  const soilRaw = Number(reading.soilRaw);
  const ecRaw = Number(reading.ecRaw);
  const ec = Number(reading.ec);
  const rawPct = (value) => Number.isFinite(value)
    ? Math.max(0, Math.min(100, value / 4095 * 100))
    : undefined;
  const ecPct = Number.isFinite(ec) ? Math.max(0, Math.min(100, ec / 2.2 * 100)) : undefined;
  return {
    temp:     reading.temperature  ?? reading.temp     ?? fallback.temp,
    humid:    reading.humidity     ?? reading.humid    ?? fallback.humid,
    light:    reading.light        ?? reading.lux      ?? rawPct(lightRaw) ?? fallback.light,
    water:    reading.soilMoisture ?? reading.water    ?? rawPct(soilRaw)  ?? fallback.water,
    nutrient: reading.nutrient     ?? ecPct            ?? rawPct(ecRaw)    ?? fallback.nutrient,
    ph:       reading.ph           ?? fallback.ph,
    soilRaw:  Number.isFinite(soilRaw) ? soilRaw : undefined,
    lightRaw: Number.isFinite(lightRaw) ? lightRaw : undefined,
    ecRaw:    Number.isFinite(ecRaw) ? ecRaw : undefined,
    ec:       Number.isFinite(ec) ? ec : undefined,
    waterDistanceCm: reading.waterDistanceCm,
    moistureSource: reading.soilMoisture !== undefined
      ? 'sensor soilMoisture percent'
      : reading.water !== undefined
        ? 'sensor water percent'
        : Number.isFinite(soilRaw)
          ? 'soilRaw scaled from 0-4095'
          : fallback.source,
    createdAt: reading.createdAt || reading.updatedAt || null,
    source:   'Firebase Cloud Firestore sensorReadings',
  };
}

async function fetchSensorData(farm = _getActiveFarm(_allFarms)) {
  try {
    const query = _sensorQueryForFarm(farm);
    const res  = await fetch(`${API_BASE}/api/sensors/latest?${query}`);
    if (!res.ok) throw new Error('sensor HTTP ' + res.status);
    const data = await res.json();
    return _normaliseSensorPayload(data);
  } catch {
    return _sensorFallback();
  }
}

function _yieldMultiplier(sensors = _sensorSnapshot) {
  if (!sensors) return 1;
  let score = 100;
  if (sensors.temp < 18 || sensors.temp > 32) score -= 14;
  if (sensors.humid < 45 || sensors.humid > 85) score -= 10;
  if (sensors.light < 45) score -= 12;
  if (sensors.water < 35 || sensors.water > 85) score -= 14;
  if (sensors.nutrient < 45) score -= 12;
  return Math.max(0.72, Math.min(1.12, score / 100));
}

function _marketForCrop(crop) {
  const id = _normaliseCropId(crop?.id || crop?.name);
  const live = _marketPrices[id];
  const fallbackPrice = crop?.pricePerKg || PRO_CROPS_FALLBACK.find(c => c.id === id)?.pricePerKg || 5;

  if (live?.channels) {
    const channels = live.channels;
    const bestKey = live.bestChannel || Object.entries(channels)
      .filter(([, channel]) => Number.isFinite(channel?.price))
      .sort((a, b) => b[1].price - a[1].price)[0]?.[0];
    const best = bestKey ? channels[bestKey] : null;
    return {
      live: live.live,
      asOf: live.asOf,
      channels,
      bestKey: bestKey || 'pasar',
      bestLabel: best?.label || 'Pasar',
      bestPrice: best?.price || fallbackPrice,
      scope: live.locationScope || 'national',
    };
  }

  return {
    live: false,
    asOf: null,
    bestKey: 'pasar',
    bestLabel: 'Pasar',
    bestPrice: fallbackPrice,
    scope: 'fallback',
    channels: {
      pasar: { label: 'Pasar', price: fallbackPrice, source: 'Fallback estimate' },
      supermarket: { label: 'Supermarket', price: fallbackPrice * 1.1, source: 'Fallback estimate' },
      export: { label: 'Export ref.', price: fallbackPrice * 1.2, source: 'Fallback estimate' },
    },
  };
}

/* ─────────────────────────────────────────────
   STYLES  (injected once into <head>)
───────────────────────────────────────────── */
function _injectStyles() {
  if (document.getElementById('pro-wif-styles')) return;
  const s = document.createElement('style');
  s.id = 'pro-wif-styles';
  s.textContent = `
    .pro-wif{font-family:Inter,system-ui,sans-serif;background:#f8faf7;color:#17231b;padding:0 0 80px;min-height:100%;}
    .pro-farm-bar{display:flex;align-items:center;gap:8px;padding:10px 16px;background:rgba(255,255,255,.95);border-bottom:1px solid #e5e7eb;overflow-x:auto;flex-wrap:nowrap;}
    .pro-farm-lbl{font-size:10px;font-weight:600;letter-spacing:.08em;color:#64748b;text-transform:uppercase;white-space:nowrap;margin-right:4px;}
    .pro-farm-chip{padding:5px 12px;border-radius:20px;border:1px solid #e5e7eb;background:#f8fafc;font-size:11px;cursor:pointer;white-space:nowrap;color:#475569;transition:all .15s;}
    .pro-farm-chip.active{background:#166534;color:#fff;border-color:#166534;}
    .pro-tabs{display:flex;border-bottom:1px solid #e5e7eb;background:rgba(255,255,255,.92);position:sticky;top:0;z-index:10;box-shadow:0 4px 12px rgba(15,23,42,.05);backdrop-filter:blur(14px);}
    .pro-tab{flex:1;padding:14px 6px 12px;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748b;border:none;background:transparent;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px;}
    .pro-tab .pro-tab-ico{font-size:18px;}
    .pro-tab.active{color:#166534;border-bottom-color:#22c55e;background:#ecfdf5;}
    .pro-tab:hover:not(.active){color:#334155;}
    .pro-sec{display:none;padding:16px;}
    .pro-sec.active{display:block;}
    .pro-card{background:#fff;border:1px solid #e5e7eb;border-radius:20px;box-shadow:0 6px 20px rgba(15,23,42,.06);padding:16px;margin-bottom:12px;}
    .pro-card-hd{font-size:9px;font-weight:700;letter-spacing:.16em;color:#64748b;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:6px;}
    .pro-card-hd::before{content:'';display:inline-block;width:3px;height:12px;background:#22c55e;border-radius:2px;}
    .pro-empty{text-align:center;padding:32px 16px;color:#94a3b8;font-size:13px;}
    .pro-empty-ico{font-size:32px;margin-bottom:8px;}
    .pro-horizon-row{display:flex;gap:6px;margin-bottom:14px;}
    .pro-hz-btn{flex:1;padding:7px 4px;border-radius:8px;border:1px solid #e5e7eb;background:#f8fafc;font-size:11px;font-weight:600;cursor:pointer;color:#475569;transition:all .15s;text-align:center;}
    .pro-hz-btn.active{background:#166534;color:#fff;border-color:#166534;}
    .pro-sell-banner{padding:12px 14px;border-radius:12px;background:#ecfdf5;border:1px solid #bbf7d0;margin-bottom:14px;font-size:12px;color:#166534;display:flex;gap:8px;align-items:flex-start;}
    .pro-sell-banner .sb-ico{font-size:18px;flex-shrink:0;}
    .pro-sel{width:100%;padding:9px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#f8fafc;color:#17231b;font-family:inherit;font-size:12px;margin-bottom:10px;}
    .pro-slider-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
    .pro-slider-row label{font-size:10px;color:#64748b;min-width:100px;letter-spacing:.04em;}
    .pro-slider-row input[type=range]{flex:1;accent-color:#22c55e;}
    .pro-slider-val{font-size:12px;font-weight:700;color:#047857;min-width:60px;text-align:right;}
    .pro-input{background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;color:#17231b;font-family:inherit;font-size:12px;padding:9px 12px;width:100%;}
    .pro-input:focus{outline:none;border-color:#22c55e;}
    .pro-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px;margin-bottom:14px;}
    .pro-kpi{background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:12px;text-align:center;}
    .pro-kpi-val{font-size:20px;font-weight:700;color:#047857;}
    .pro-kpi-lbl{font-size:9px;letter-spacing:.08em;color:#64748b;margin-top:3px;text-transform:uppercase;}
    .pro-table{width:100%;border-collapse:collapse;font-size:11px;}
    .pro-table th{color:#64748b;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:left;font-weight:700;}
    .pro-table td{padding:9px 8px;border-bottom:1px solid #f1f5f9;color:#17231b;}
    .pro-table tr:last-child td{border-bottom:none;}
    .pro-table tr:hover td{background:#f8fafc;}
    .pro-badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:.06em;}
    .pro-badge-green{background:#dcfce7;color:#166534;border:1px solid #bbf7d0;}
    .pro-badge-amber{background:#fef9c3;color:#854d0e;border:1px solid #fde68a;}
    .pro-badge-red{background:#fee2e2;color:#991b1b;border:1px solid #fecaca;}
    .pro-badge-blue{background:#dbeafe;color:#1d4ed8;border:1px solid #bfdbfe;}
    .pro-badge-gray{background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;}
    .pro-bar-track{height:5px;background:#f1f5f9;border-radius:3px;overflow:hidden;}
    .pro-bar-fill{height:100%;border-radius:3px;transition:width .5s;}
    .pro-breakdown{display:flex;flex-direction:column;gap:6px;}
    .pro-brow{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:10px;font-size:12px;}
    .pro-brow-income{background:#f0fdf4;border:1px solid #bbf7d0;}
    .pro-brow-expense{background:#fff1f2;border:1px solid #fecdd3;}
    .pro-brow-ai{background:#eff6ff;border:1px solid #bfdbfe;}
    .pro-brow-net{background:#ecfdf5;border:2px solid #22c55e;}
    .pro-brow-lbl{font-size:10px;color:#64748b;}
    .pro-impact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px;}
    .pro-impact-card{border-radius:10px;padding:12px;text-align:center;}
    .pro-impact-card.up{background:#fefce8;border:1px solid #fde68a;}
    .pro-impact-card.down{background:#eff6ff;border:1px solid #bfdbfe;}
    .pro-impact-card.ok{background:#f0fdf4;border:1px solid #bbf7d0;}
    .pro-impact-card.warn{background:#fff1f2;border:1px solid #fecdd3;}
    .pro-impact-icon{font-size:20px;margin-bottom:4px;}
    .pro-impact-name{font-size:9px;letter-spacing:.08em;color:#64748b;text-transform:uppercase;margin-bottom:4px;}
    .pro-impact-val{font-size:15px;font-weight:700;}
    .pro-impact-val.up{color:#854d0e;}
    .pro-impact-val.down{color:#1d4ed8;}
    .pro-impact-val.ok{color:#166534;}
    .pro-impact-val.warn{color:#991b1b;}
    .pro-eco-summary{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:12px 14px;margin-top:12px;}
    .pro-eco-title{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#166534;margin-bottom:8px;}
    .pro-eco-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(82px,1fr));gap:6px;}
    .pro-eco-item{text-align:center;}
    .pro-eco-val{font-size:15px;font-weight:700;color:#047857;}
    .pro-eco-lbl{font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;letter-spacing:.06em;}
    .pro-qty-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
    .pro-qty-row label{font-size:10px;color:#64748b;min-width:80px;letter-spacing:.04em;}
    .pro-qty-ctrl{display:flex;align-items:center;gap:8px;}
    .pro-qty-btn{width:28px;height:28px;border:1px solid #e5e7eb;border-radius:6px;background:#f8fafc;color:#17231b;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
    .pro-qty-btn:hover{border-color:#22c55e;color:#166534;}
    .pro-qty-num{width:40px;text-align:center;font-size:14px;font-weight:700;color:#047857;}
    .pro-search-wrap{position:relative;margin-bottom:10px;}
    .pro-search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:14px;}
    .pro-suggest-list{background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:10px;}
    .pro-suggest-item{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;font-size:12px;transition:background .1s;color:#17231b;}
    .pro-suggest-item:hover,.pro-suggest-item.selected{background:#f0fdf4;color:#166534;}
    .pro-suggest-item .sp-ico{font-size:18px;}
    .pro-zone-row{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#f8fafc;border-radius:10px;margin-bottom:6px;border:1px solid #e5e7eb;}
    .pro-zone-id{width:28px;height:28px;border-radius:6px;background:#dcfce7;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#166534;flex-shrink:0;}
    .pro-zone-info{flex:1;}
    .pro-zone-name{font-size:12px;font-weight:700;color:#17231b;}
    .pro-zone-meta{font-size:10px;color:#64748b;margin-top:2px;}
    .pro-zone-meter{margin-top:5px;}
    .pro-ai-note{background:#ecfdf5;border-left:3px solid #22c55e;border-radius:0 10px 10px 0;padding:10px 14px;font-size:11px;color:#166534;margin-top:12px;display:flex;gap:8px;align-items:flex-start;line-height:1.5;}
    .pro-ai-note .ai-ico{flex-shrink:0;font-size:16px;}
    .pro-ai-loading{opacity:.6;font-style:italic;}
    .pro-hr{border:none;border-top:1px solid #e5e7eb;margin:12px 0;}
    .pro-week-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
    .pro-week-lbl{font-size:9px;letter-spacing:.06em;color:#64748b;min-width:56px;text-transform:uppercase;}
    .pro-week-dots{display:flex;gap:3px;flex:1;}
    .pro-week-dot{width:10px;height:10px;border-radius:2px;background:#e2e8f0;}
    .pro-week-dot.done{background:#22c55e;}
    .pro-week-dot.active{background:#3b82f6;}
    .pro-week-dot.harvest{background:#f59e0b;}
    .pro-meta-source{font-size:9px;color:#94a3b8;margin-top:6px;letter-spacing:.03em;}
    .pro-live-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:8px;}
    .pro-live-tile{background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:10px;text-align:center;}
    .pro-live-val{font-size:16px;font-weight:700;color:#047857;}
    .pro-live-lbl{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-top:3px;}
    .pro-source-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}
    .pro-source-link{font-size:10px;color:#1d4ed8;text-decoration:none;background:#eff6ff;border:1px solid #bfdbfe;border-radius:999px;padding:4px 8px;}
    .pro-market-status{font-size:11px;color:#64748b;margin-bottom:10px;line-height:1.45;}
    .pro-market-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;}
    .pro-market-card{background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:12px;}
    .pro-market-title{display:flex;justify-content:space-between;gap:8px;font-size:12px;font-weight:700;color:#17231b;margin-bottom:8px;}
    .pro-market-prices{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
    .pro-market-price{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:8px;text-align:center;}
    .pro-market-price.best{border-color:#22c55e;background:#f0fdf4;}
    .pro-market-price .lbl{font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;}
    .pro-market-price .val{font-size:12px;font-weight:800;color:#047857;margin-top:2px;}
    .pro-best-plant{background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:12px 14px;margin-bottom:12px;color:#9a3412;font-size:12px;line-height:1.5;}
    .pro-horizon-sticky{position:sticky;top:72px;z-index:9;background:rgba(255,255,255,.96);border-bottom:1px solid #e5e7eb;margin:-16px -16px 12px;padding:10px 16px;backdrop-filter:blur(14px);}
    .pro-plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;}
    .pro-plan-item{background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:12px;}
    .pro-plan-val{font-size:18px;font-weight:800;color:#047857;}
    .pro-plan-lbl{font-size:9px;letter-spacing:.07em;color:#64748b;text-transform:uppercase;margin-top:3px;}
    .pro-ai-inline{background:#f8fafc;border:1px solid #e5e7eb;border-left:3px solid #22c55e;border-radius:0 10px 10px 0;padding:10px 12px;font-size:11px;color:#166534;line-height:1.5;margin:10px 0 12px;}
    .pro-ai-inline.warn{background:#fff7ed;border-color:#fed7aa;border-left-color:#f97316;color:#9a3412;}
    .pro-ai-inline.bad{background:#fff1f2;border-color:#fecdd3;border-left-color:#ef4444;color:#991b1b;}
    .pro-ai-calc{margin-top:10px;padding-top:10px;border-top:1px solid rgba(15,23,42,.12);color:#334155;}
    .pro-ai-calc-title{font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#047857;margin-bottom:6px;}
    .pro-ai-calc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:6px;margin-bottom:6px;}
    .pro-ai-calc-item{background:rgba(255,255,255,.72);border:1px solid rgba(15,23,42,.08);border-radius:8px;padding:7px 8px;}
    .pro-ai-calc-val{font-size:12px;font-weight:800;color:#17231b;}
    .pro-ai-calc-lbl{font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-top:2px;}
    .pro-ai-calc-formula{font-size:10px;color:#64748b;line-height:1.4;}
    .pro-ai-calc-formula a{color:#1d4ed8;text-decoration:none;font-weight:700;}
    .pro-hidden{display:none!important;}
  `;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────
   EXPORT: render() → HTML string
───────────────────────────────────────────── */
export function render() {
  _injectStyles();
  return `
    <div class="pro-wif">

      <!-- MULTI-FARM SELECTOR -->
      <div class="pro-farm-bar" id="pro-farm-bar">
        <span class="pro-farm-lbl">Farm</span>
        <div id="pro-farm-chips"></div>
      </div>

      <div class="pro-tabs">
        <button class="pro-tab active" data-pro-tab="forecast">
          <span class="pro-tab-ico">📊</span>HARVEST<br>FORECAST
        </button>
        <button class="pro-tab" data-pro-tab="newplant">
          <span class="pro-tab-ico">➕</span>NEW PLANT<br>PROFIT
        </button>
      </div>

      <!-- ═══════════════════════════════════════
           TAB 1: HARVEST FORECAST
      ═══════════════════════════════════════ -->
      <div id="pro-forecast" class="pro-sec active">

        <div class="pro-horizon-sticky">
          <div class="pro-horizon-row">
            <button class="pro-hz-btn active" data-hz="30">30 days</button>
            <button class="pro-hz-btn" data-hz="60">60 days</button>
            <button class="pro-hz-btn" data-hz="90">90 days</button>
            <button class="pro-hz-btn" data-hz="custom">Custom</button>
          </div>
          <div id="pro-custom-slider" style="display:none;">
            <div class="pro-slider-row">
              <label>Days ahead</label>
              <input type="range" min="7" max="180" value="30" step="1" id="pro-sl-days">
              <span class="pro-slider-val" id="pro-v-days">30 days</span>
            </div>
          </div>
          <div id="pro-sell-banner" class="pro-sell-banner" style="display:none;">
            <span class="sb-ico">💡</span>
            <span id="pro-sell-text"></span>
          </div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Live farm inputs</div>
          <div class="pro-live-grid" id="pro-live-inputs"></div>
          <div class="pro-meta-source" id="pro-live-source">Loading Firebase sensor snapshot…</div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Summary KPIs</div>
          <div class="pro-kpi-grid">
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-rows">—</div><div class="pro-kpi-lbl">Rows ready</div></div>
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-kg">—</div><div class="pro-kpi-lbl">Total yield</div></div>
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-rev">—</div><div class="pro-kpi-lbl">Est. revenue</div></div>
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-people">—</div><div class="pro-kpi-lbl">People needed</div></div>
          </div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Production over time</div>
          <div style="position:relative;height:190px;">
            <canvas id="pro-production-chart"></canvas>
          </div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Logistics &amp; people planning</div>
          <div class="pro-plan-grid" id="pro-hr-plan"></div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Current market price comparison</div>
          <div class="pro-market-status" id="pro-market-status">Loading online market prices…</div>
          <div class="pro-market-grid" id="pro-market-grid"></div>
          <div class="pro-source-row" id="pro-market-sources"></div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Crop-by-crop forecast</div>
          <div id="pro-forecast-empty" class="pro-empty" style="display:none;">
            <div class="pro-empty-ico">🌱</div>
            No crops planted yet. Go to your farm and add some plants first.
          </div>
          <table class="pro-table" id="pro-forecast-table">
            <thead><tr><th>Crop</th><th>Rows</th><th>Yield</th><th>Best price</th><th>Revenue</th><th>Status</th></tr></thead>
            <tbody id="pro-forecast-rows"></tbody>
          </table>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Harvest readiness timeline</div>
          <div id="pro-tl-bars"></div>
        </div>

      </div>

      <!-- ═══════════════════════════════════════
           TAB 2: NEW PLANT PROFIT
      ═══════════════════════════════════════ -->
      <div id="pro-newplant" class="pro-sec">

        <div class="pro-card" style="background:#fff7ed;border-color:#fed7aa;">
          <div style="font-size:15px;font-weight:800;color:#9a3412;">Maximized yields. Optimized profits.</div>
          <div style="font-size:11px;color:#9a3412;margin-top:4px;">Test species, rows, space, resource expansion, cost and future profit before planting.</div>
        </div>

        <div class="pro-best-plant" id="pro-best-plant-banner">
          Calculating the most profitable crop to plant now…
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Species search</div>
          <div class="pro-search-wrap">
            <span class="pro-search-ico">🔍</span>
            <input class="pro-input" id="pro-np-search" placeholder="Type any species name…" style="padding-left:32px;">
          </div>
          <div class="pro-suggest-list" id="pro-np-suggestions"></div>
          <div class="pro-ai-inline" id="pro-np-ai-box">
            <span id="pro-np-ai" class="pro-ai-loading">Choose or type a species to run suitability analysis.</span>
          </div>
          <div class="pro-qty-row">
            <label>Plant rows</label>
            <div class="pro-qty-ctrl">
              <button class="pro-qty-btn" id="pro-qty-dec">−</button>
              <span class="pro-qty-num" id="pro-qty-disp">10</span>
              <button class="pro-qty-btn" id="pro-qty-inc">+</button>
            </div>
          </div>
        </div>

        <div class="pro-card" id="pro-readiness-card">
          <div class="pro-card-hd">Planting readiness</div>
          <div id="pro-readiness-block"></div>
          <div class="pro-card-hd" style="margin-top:14px;">Zone utilisation</div>
          <div id="pro-zone-list"></div>
        </div>

        <div class="pro-card" id="pro-impact-card">
          <div class="pro-card-hd">Predicted resource delta</div>
          <div class="pro-impact-grid" id="pro-impact-grid"></div>

          <!-- Economic impact summary -->
          <div class="pro-eco-summary" id="pro-eco-summary">
            <div class="pro-eco-title">Economic impact of adding these rows</div>
            <div class="pro-eco-grid">
              <div class="pro-eco-item">
                <div class="pro-eco-val" id="pro-eco-yield">—</div>
                <div class="pro-eco-lbl">Est. yield (kg)</div>
              </div>
              <div class="pro-eco-item">
                <div class="pro-eco-val" id="pro-eco-value">—</div>
                <div class="pro-eco-lbl">Market value</div>
              </div>
              <div class="pro-eco-item">
                <div class="pro-eco-val" id="pro-eco-cost">—</div>
                <div class="pro-eco-lbl">Extra cost/mo</div>
              </div>
              <div class="pro-eco-item">
                <div class="pro-eco-val" id="pro-eco-profit">—</div>
                <div class="pro-eco-lbl">Est. profit</div>
              </div>
              <div class="pro-eco-item">
                <div class="pro-eco-val" id="pro-eco-harvest-date">—</div>
                <div class="pro-eco-lbl">Sell window</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

/* ─────────────────────────────────────────────
   EXPORT: init()
───────────────────────────────────────────── */
export function init() {
  _productionChart = null;
  _npQty       = 10;
  _npSpecies   = NP_SPECIES_DB[0];
  _npFiltered  = [...NP_SPECIES_DB];
  _marketPrices = {};
  _marketSources = [...MARKET_SOURCE_LINKS];
  _marketStatus = { loading: true, error: null, generatedAt: null };
  _sensorSnapshot = _sensorFallback();
  _npAdvisorKey = '';
  _npAiAnalysis = null;
  _npAiUnsuitable = false;

  // Load all farms and set active farm
  _allFarms      = _loadAllFarms();
  _activeFarmIdx = 0;

  // If AppState has a currentFarm, find its index
  const currentId = AppState.currentFarm?.id || AppState.currentFarmId;
  if (currentId) {
    const idx = _allFarms.findIndex(f => f.id === currentId);
    if (idx >= 0) _activeFarmIdx = idx;
  }

  _refreshFarmData();
  _renderFarmChips();

  _bindTabs();
  _bindForecast();
  _bindNewPlant();

  _updateForecast();
  _renderLiveInputs();
  _renderMarketPanel();
  _renderBestPlantRecommendation();
  _npRenderSuggestions();
  _npRender();

  _hydrateLiveData();
}

// Rebuilds _farmCrops from the currently active farm.
function _refreshFarmData() {
  const farm = _getActiveFarm(_allFarms);
  _farmCrops = _mapFarmCrops(farm);
}

async function _hydrateLiveData() {
  const firestoreFarms = await _loadFarmsFromFirestore();
  if (firestoreFarms.length) {
    const activeId = _activeFarmId();
    _allFarms = _mergeFarms(firestoreFarms, _allFarms);
    const nextIdx = _allFarms.findIndex(f => f.id === activeId);
    if (nextIdx >= 0) _activeFarmIdx = nextIdx;
    _refreshFarmData();
    _renderFarmChips();
  }

  await _refreshSensorSnapshot();
  await _loadMarketPrices();
}

async function _refreshSensorSnapshot() {
  _sensorSnapshot = await fetchSensorData(_getActiveFarm(_allFarms));
  _renderLiveInputs();
  _updateForecast();
  _npRender();
}

async function _loadMarketPrices() {
  const crops = [..._farmCrops, ...NP_SPECIES_DB]
    .map(c => _normaliseCropId(c.id || c.name))
    .filter(Boolean);
  const uniqueCrops = [...new Set(crops)];
  if (!uniqueCrops.length) return;

  const farm = _getActiveFarm(_allFarms) || {};
  const params = new URLSearchParams({ crops: uniqueCrops.join(',') });
  const state = farm.state || farm.negeri || farm.location || '';
  const district = farm.district || farm.daerah || '';
  if (state) params.set('state', state);
  if (district) params.set('district', district);

  _marketStatus = { loading: true, error: null, generatedAt: null };
  _renderMarketPanel();

  try {
    const res = await fetch(`${API_BASE}/api/whatif/market-prices?${params}`);
    if (!res.ok) throw new Error('market HTTP ' + res.status);
    const data = await res.json();
    _marketPrices = data.prices || {};
    _marketSources = data.sources?.length ? data.sources : MARKET_SOURCE_LINKS;
    _marketStatus = {
      loading: false,
      error: null,
      generatedAt: data.generatedAt,
      pricecatcherMonth: data.pricecatcherMonth,
    };
  } catch (err) {
    console.warn('[WhatIfPro] Market price load failed:', err);
    _marketPrices = {};
    _marketSources = [...MARKET_SOURCE_LINKS];
    _marketStatus = { loading: false, error: err.message, generatedAt: null };
  }

  _renderMarketPanel();
  _renderBestPlantRecommendation();
  _updateForecast();
  _npRenderSuggestions();
  _npRender();
}

function _renderLiveInputs() {
  const el = document.getElementById('pro-live-inputs');
  const sourceEl = document.getElementById('pro-live-source');
  if (!el) return;

  const s = _sensorSnapshot || _sensorFallback();
  const tiles = [
    { label: 'Temp', value: `${Number(s.temp).toFixed(1)}°C` },
    { label: 'Humidity', value: `${Number(s.humid).toFixed(0)}%` },
    { label: 'Light', value: `${Number(s.light).toFixed(0)}` },
    { label: 'Water', value: `${Number(s.water).toFixed(0)}` },
    { label: 'Nutrient', value: `${Number(s.nutrient).toFixed(1)}` },
    { label: 'Yield factor', value: `${(_yieldMultiplier(s) * 100).toFixed(0)}%` },
  ];

  el.innerHTML = tiles.map(tile => `
    <div class="pro-live-tile">
      <div class="pro-live-val">${_esc(tile.value)}</div>
      <div class="pro-live-lbl">${_esc(tile.label)}</div>
    </div>`).join('');

  if (sourceEl) {
    const when = s.createdAt ? ` · ${new Date(s.createdAt).toLocaleString()}` : '';
    sourceEl.textContent = `${s.source || 'Firebase Cloud Firestore sensorReadings'}${when}`;
  }
}

function _renderMarketPanel() {
  const statusEl = document.getElementById('pro-market-status');
  const gridEl = document.getElementById('pro-market-grid');
  const sourceEl = document.getElementById('pro-market-sources');
  if (!statusEl || !gridEl || !sourceEl) return;

  if (_marketStatus.loading) {
    statusEl.textContent = 'Fetching live pasar, supermarket, and export references from online public sources…';
  } else if (_marketStatus.error) {
    statusEl.textContent = `Online price fetch failed (${_marketStatus.error}). Showing clearly labeled fallback estimates until the backend can reach the sources.`;
  } else {
    const stamp = _marketStatus.generatedAt ? new Date(_marketStatus.generatedAt).toLocaleString() : 'latest available';
    statusEl.textContent = `Live market data refreshed ${stamp}. PriceCatcher month: ${_marketStatus.pricecatcherMonth || 'latest available'}.`;
  }

  const crops = _farmCrops.length ? _farmCrops : NP_SPECIES_DB.slice(0, 6);
  gridEl.innerHTML = crops.map(crop => {
    const market = _marketForCrop(crop);
    const entries = [
      ['pasar', 'Pasar'],
      ['supermarket', 'Supermarket'],
      ['export', 'Export'],
    ];

    return `
      <div class="pro-market-card">
        <div class="pro-market-title">
          <span>${crop.icon || '🌱'} ${_esc(crop.name)}</span>
          <span class="pro-badge ${market.live ? 'pro-badge-green' : 'pro-badge-gray'}">${market.live ? 'LIVE' : 'EST.'}</span>
        </div>
        <div class="pro-market-prices">
          ${entries.map(([key, label]) => {
            const channel = market.channels[key] || {};
            const isBest = key === market.bestKey;
            return `
              <div class="pro-market-price ${isBest ? 'best' : ''}" title="${_esc(channel.source || '')}">
                <div class="lbl">${_esc(label)}</div>
                <div class="val">${_fmtRM(channel.price, 2)}</div>
              </div>`;
          }).join('')}
        </div>
        <div style="font-size:9px;color:#64748b;margin-top:8px;">
          Best: ${_esc(market.bestLabel)} · ${_esc(market.scope)}${market.asOf ? ' · ' + _esc(market.asOf) : ''}
        </div>
      </div>`;
  }).join('');

  sourceEl.innerHTML = _marketSources.map(source => `
    <a class="pro-source-link" href="${_esc(source.url)}" target="_blank" rel="noopener noreferrer" title="${_esc(source.note || '')}">
      ${_esc(source.label)}
    </a>`).join('');
}

function _bestPlantCandidate() {
  const sensorFactor = _yieldMultiplier();
  const scored = NP_SPECIES_DB.map(sp => {
    const market = _marketForCrop(sp);
    const cycles90 = 90 / Math.max(1, sp.growDays);
    const revenue90 = sp.yieldKgPerRow * sensorFactor * market.bestPrice * cycles90;
    const weeks90 = 90 / 7;
    const cost90 = (sp.waterLpR / 1000 * RATES.waterRM * weeks90)
      + (sp.fertMLpR * RATES.fertRM * weeks90);
    return { sp, market, profit90: revenue90 - cost90 };
  }).sort((a, b) => b.profit90 - a.profit90);

  return scored[0] || null;
}

function _renderBestPlantRecommendation() {
  const el = document.getElementById('pro-best-plant-banner');
  if (!el) return;
  const best = _bestPlantCandidate();
  if (!best) {
    el.textContent = 'Plant recommendation unavailable until crop and market data loads.';
    return;
  }

  el.innerHTML = `
    <strong>Most profitable to plant now:</strong>
    ${best.sp.icon} ${_esc(best.sp.name)}
    at ${_fmtRM(best.market.bestPrice, 2)}/kg via ${_esc(best.market.bestLabel)}.
    Estimated ${_fmtRM(best.profit90, 0)} profit per row over 90 days after live sensor adjustment.
  `;
}

function _customSpecies(name) {
  const clean = String(name || '').trim();
  const id = _normaliseCropId(clean);
  const label = clean.replace(/\b\w/g, ch => ch.toUpperCase()) || 'Custom Species';
  return {
    id,
    name: label,
    icon: '🌱',
    growDays: 60,
    pricePerKg: _marketForCrop({ id, name: label }).bestPrice || 5,
    yieldKgPerRow: 4.0,
    waterLpR: 20,
    fertMLpR: 120,
    temp: '+0.5',
    hum: '+3',
    ph: '0',
    light: '+1h',
    fert: '+8%',
    dir: ['ok','up','ok','up','up'],
    custom: true,
  };
}

function _selectNpSpecies(species) {
  _npSpecies = species || NP_SPECIES_DB[0];
  _npAiAnalysis = null;
  _npAiUnsuitable = false;
  _npAdvisorKey = '';
}

/* ─────────────────────────────────────────────
   MULTI-FARM SELECTOR
───────────────────────────────────────────── */
function _renderFarmChips() {
  const bar = document.getElementById('pro-farm-chips');
  if (!bar) return;

  if (!_allFarms.length) {
    bar.innerHTML = `<span style="font-size:11px;color:#94a3b8;">No farms found</span>`;
    return;
  }

  bar.innerHTML = _allFarms.map((f, i) => `
    <button class="pro-farm-chip ${i === _activeFarmIdx ? 'active' : ''}" data-farm-idx="${i}">
      ${_esc(f.name || f.id || 'Farm ' + (i + 1))}
    </button>`).join('');

  bar.querySelectorAll('.pro-farm-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      _activeFarmIdx = parseInt(chip.getAttribute('data-farm-idx'));
      const selected = _allFarms[_activeFarmIdx];
      if (selected) {
        AppState.currentFarm = selected;
        AppState.currentFarmId = selected.id || AppState.currentFarmId;
      }
      _refreshFarmData();
      _renderFarmChips();
      _updateForecast();
      _npRender();
      _refreshSensorSnapshot();
      _loadMarketPrices();
    });
  });
}

/* ─────────────────────────────────────────────
   TABS
───────────────────────────────────────────── */
function _bindTabs() {
  document.querySelectorAll('.pro-tab[data-pro-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-pro-tab');
      document.querySelectorAll('.pro-sec').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.pro-tab').forEach(b => b.classList.remove('active'));
      document.getElementById('pro-' + id)?.classList.add('active');
      btn.classList.add('active');
      if (id === 'newplant') _renderBestPlantRecommendation();
    });
  });
}

/* ─────────────────────────────────────────────
   TAB 1 — HARVEST FORECAST
───────────────────────────────────────────── */
function _bindForecast() {
  // Horizon quick-picks
  document.querySelectorAll('.pro-hz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pro-hz-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const hz = btn.getAttribute('data-hz');
      const customSlider = document.getElementById('pro-custom-slider');
      if (hz === 'custom') {
        customSlider.style.display = 'block';
      } else {
        customSlider.style.display = 'none';
        document.getElementById('pro-sl-days').value = hz;
        document.getElementById('pro-v-days').textContent = hz + ' days';
      }
      _updateForecast();
    });
  });

  document.getElementById('pro-sl-days')?.addEventListener('input', () => {
    const v = document.getElementById('pro-sl-days').value;
    document.getElementById('pro-v-days').textContent = v + ' days';
    _updateForecast();
  });
}

function _getForecastDays() {
  const activeBtn = document.querySelector('.pro-hz-btn.active');
  const hz = activeBtn?.getAttribute('data-hz');
  if (hz === 'custom') {
    return parseInt(document.getElementById('pro-sl-days')?.value || 30);
  }
  return parseInt(hz || 30);
}

// Returns a sell-timing recommendation string given forecast results.
function _sellRecommendation(rows, days) {
  const ready = rows.filter(r => r.isReady);
  if (!ready.length) return null;

  // Find the crop with the highest revenue in this window.
  const best = ready.reduce((a, b) => (a.rev > b.rev ? a : b));
  const sellDay = best.c.growDays;
  const channel = best.market?.bestLabel || 'best market channel';

  // Simple heuristic: if a crop completes multiple cycles, the first
  // complete cycle is always the best time to sell (freshest, no storage cost).
  if (best.cyclesDone >= 2) {
    return `Best sell window: sell ${best.c.name} at day ${sellDay} through ${channel}. ` +
           `At the current linked price (${_fmtRM(best.market.bestPrice, 2)}/kg), waiting past the first complete cycle adds freshness risk without a better price signal.`;
  }
  return `${best.c.name} is the best sale in this ${days}-day view: sell at day ${sellDay} through ${channel}, ` +
         `projected revenue ${_fmtRM(best.rev, 0)} at ${_fmtRM(best.market.bestPrice, 2)}/kg.`;
}

function _productionSeries(crops, days, sensorFactor) {
  return Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    let cumulativeKg = 0;
    let dailyKg = 0;

    crops.forEach(crop => {
      const cycles = Math.floor(day / crop.growDays);
      const prevCycles = Math.floor((day - 1) / crop.growDays);
      const cycleKg = crop.yieldKgPerRow * sensorFactor;
      cumulativeKg += cycles * cycleKg;
      if (cycles > prevCycles) dailyKg += (cycles - prevCycles) * cycleKg;
    });

    return {
      day,
      cumulativeKg: Number(cumulativeKg.toFixed(2)),
      dailyKg: Number(dailyKg.toFixed(2)),
    };
  });
}

function _hrPlan(totalKg, totalRows, series) {
  if (!totalKg || totalKg <= 0) {
    return {
      people: 0,
      pickers: 0,
      packers: 0,
      logistics: 0,
      peakKg: 0,
      peakDay: null,
      note: 'No harvest is ready inside this horizon.',
    };
  }

  const peak = series.reduce((best, item) => item.dailyKg > best.dailyKg ? item : best, series[0] || { day: 0, dailyKg: 0 });
  const pickers = Math.max(1, Math.ceil(peak.dailyKg / 80));
  const packers = Math.max(1, Math.ceil(peak.dailyKg / 60));
  const logistics = Math.max(1, Math.ceil(peak.dailyKg / 180));

  return {
    people: pickers + packers + logistics,
    pickers,
    packers,
    logistics,
    peakKg: peak.dailyKg,
    peakDay: peak.day,
    note: `${Math.round(totalRows)} rows ready in this horizon. Staffing is based on the peak harvest day, not the whole period.`,
  };
}

function _renderHrPlan(plan) {
  const el = document.getElementById('pro-hr-plan');
  if (!el) return;
  el.innerHTML = [
    { val: plan.people, label: 'Total people' },
    { val: plan.pickers, label: 'Pickers' },
    { val: plan.packers, label: 'Packers' },
    { val: plan.logistics, label: 'Pickup/logistics' },
    { val: plan.peakKg ? plan.peakKg.toFixed(1) + ' kg' : '—', label: plan.peakDay ? `Peak day ${plan.peakDay}` : 'Peak harvest' },
  ].map(item => `
    <div class="pro-plan-item">
      <div class="pro-plan-val">${_esc(item.val)}</div>
      <div class="pro-plan-lbl">${_esc(item.label)}</div>
    </div>`).join('') + `
    <div style="grid-column:1/-1;font-size:10px;color:#64748b;line-height:1.45;">
      ${_esc(plan.note)} Assumption: 1 picker handles ~80 kg/day, 1 packer ~60 kg/day, 1 logistics person ~180 kg/day.
    </div>`;
}

function _updateForecast() {
  const days = _getForecastDays();

  // Use only the active farm's crops
  const crops = _farmCrops;

  const isEmpty = !crops.length;
  document.getElementById('pro-forecast-empty').style.display  = isEmpty ? 'block' : 'none';
  document.getElementById('pro-forecast-table').style.display  = isEmpty ? 'none'  : 'table';

  const sensorFactor = _yieldMultiplier();
  const production = _productionSeries(crops, days, sensorFactor);
  let totalRows = 0, totalKg = 0, totalRev = 0;
  const rows = crops.map(c => {
    const cyclesDone = Math.floor(days / c.growDays);
    const partialPct = ((days % c.growDays) / c.growDays * 100).toFixed(0);
    const isReady    = days >= c.growDays;
    const rowCount   = isReady ? Math.max(c.slots || 1, cyclesDone * (c.slots || 1)) : 0;
    const market     = _marketForCrop(c);
    const kg         = isReady ? cyclesDone * c.yieldKgPerRow * sensorFactor : 0;
    const rev        = kg * market.bestPrice;
    if (isReady) { totalRows += rowCount; totalKg += kg; totalRev += rev; }
    return { c, rowCount, kg, rev, isReady, cyclesDone, partialPct, market };
  });

  document.getElementById('pro-kpi-rows').textContent = totalRows;
  document.getElementById('pro-kpi-kg').textContent   = totalKg.toFixed(0) + ' kg';
  document.getElementById('pro-kpi-rev').textContent  = 'RM ' + totalRev.toFixed(0);
  const hrPlan = _hrPlan(totalKg, totalRows, production);
  document.getElementById('pro-kpi-people').textContent = hrPlan.people;
  _renderHrPlan(hrPlan);
  _drawProductionChart(production);

  // Sell recommendation banner
  const rec     = _sellRecommendation(rows, days);
  const banner  = document.getElementById('pro-sell-banner');
  const bannerT = document.getElementById('pro-sell-text');
  if (rec && banner && bannerT) {
    banner.style.display = 'flex';
    bannerT.textContent  = rec;
  } else if (banner) {
    banner.style.display = 'none';
  }

  document.getElementById('pro-forecast-rows').innerHTML = rows.map(r => {
    // Lifecycle status
    let statusBadge;
    if (!r.isReady) {
      statusBadge = `<span class="pro-badge pro-badge-amber">${r.partialPct}% grown</span>`;
    } else {
      const daysAfter = days - r.c.growDays;
      if (daysAfter <= 3)       statusBadge = `<span class="pro-badge pro-badge-green">✅ Ready</span>`;
      else if (daysAfter <= 10) statusBadge = `<span class="pro-badge pro-badge-green">🌟 Ripe ×${r.cyclesDone}</span>`;
      else if (daysAfter <= 20) statusBadge = `<span class="pro-badge pro-badge-amber">⚠ Overripe</span>`;
      else                      statusBadge = `<span class="pro-badge pro-badge-red">🔴 Rotting</span>`;
    }
    return `
      <tr>
        <td>${r.c.icon} ${r.c.name}</td>
        <td style="font-weight:700;color:#047857;">${r.isReady ? r.rowCount : '—'}</td>
        <td>${r.isReady ? r.kg.toFixed(1) + ' kg' : '—'}</td>
        <td>${r.isReady ? `${_fmtRM(r.market.bestPrice, 2)}/kg <span style="font-size:9px;color:#64748b;">${_esc(r.market.bestLabel)}</span>` : '—'}</td>
        <td>${r.isReady ? '<span style="color:#166534;font-weight:700;">RM ' + r.rev.toFixed(0) + '</span>' : '—'}</td>
        <td>${statusBadge}</td>
      </tr>`;
  }).join('');

  document.getElementById('pro-tl-bars').innerHTML = rows.map(r => {
    const pct  = Math.min(100, (days / r.c.growDays) * 100);
    const daysAfter = days - r.c.growDays;
    const fill = !r.isReady        ? '#f59e0b'
               : daysAfter <= 10   ? '#22c55e'
               : daysAfter <= 20   ? '#f59e0b'
               :                     '#ef4444';
    return `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="font-size:11px;min-width:90px;color:#64748b;">${r.c.icon} ${r.c.name}</span>
        <div class="pro-bar-track" style="flex:1;">
          <div class="pro-bar-fill" style="width:${pct.toFixed(0)}%;background:${fill};"></div>
        </div>
        <span style="font-size:10px;min-width:54px;text-align:right;color:#64748b;">
          Day ${r.c.growDays}
        </span>
      </div>`;
  }).join('');
}

function _drawProductionChart(series) {
  const canvas = document.getElementById('pro-production-chart');
  if (!canvas) return;

  const draw = () => {
    if (_productionChart) { _productionChart.destroy(); _productionChart = null; }
    const labels = series.map(item => 'D' + item.day);
    const showEvery = Math.max(1, Math.ceil(labels.length / 8));

    _productionChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Cumulative production (kg)',
          data: series.map(item => item.cumulativeKg),
          borderColor: '#047857',
          backgroundColor: 'rgba(34,197,94,.14)',
          borderWidth: 2,
          fill: true,
          tension: .25,
          pointRadius: series.map(item => item.dailyKg > 0 ? 3 : 0),
          pointBackgroundColor: '#f59e0b',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => v + ' kg', color: '#64748b', font: { size: 10 } },
            grid: { color: '#f1f5f9' },
          },
          x: {
            ticks: {
              color: '#64748b',
              font: { size: 10 },
              callback: function(value, index) {
                return index % showEvery === 0 ? this.getLabelForValue(value) : '';
              },
            },
            grid: { display: false },
          },
        },
      },
    });
  };

  if (typeof Chart === 'undefined') {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = draw;
    document.head.appendChild(s);
  } else {
    draw();
  }
}

/* ─────────────────────────────────────────────
   TAB 2 — NEW PLANT PROFIT
───────────────────────────────────────────── */
function _bindNewPlant() {
  document.getElementById('pro-np-search')?.addEventListener('input', () => {
    const q = (document.getElementById('pro-np-search').value || '').toLowerCase().trim();
    _npFiltered = q
      ? NP_SPECIES_DB.filter(s => s.name.toLowerCase().includes(q) || s.id.includes(q))
      : [...NP_SPECIES_DB];
    _npRenderSuggestions();
  });

  document.getElementById('pro-np-search')?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const raw = document.getElementById('pro-np-search').value || '';
    const q = raw.toLowerCase().trim();
    if (!q) return;
    _selectNpSpecies(NP_SPECIES_DB.find(s => s.name.toLowerCase() === q || s.id === q)
      || _customSpecies(raw));
    _npRenderSuggestions();
    _npRender();
  });

  document.getElementById('pro-qty-dec')?.addEventListener('click', () => {
    _npQty = Math.max(1, _npQty - 5);
    document.getElementById('pro-qty-disp').textContent = _npQty;
    _npRender();
  });

  document.getElementById('pro-qty-inc')?.addEventListener('click', () => {
    _npQty = Math.min(500, _npQty + 5);
    document.getElementById('pro-qty-disp').textContent = _npQty;
    _npRender();
  });
}

function _npRenderSuggestions() {
  const el = document.getElementById('pro-np-suggestions');
  if (!el) return;
  const rawQ = document.getElementById('pro-np-search')?.value || '';
  const q = rawQ.toLowerCase().trim();
  const customAllowed = q && !NP_SPECIES_DB.some(s => s.name.toLowerCase() === q || s.id === q);
  const suggestions = _npFiltered.slice(0, customAllowed ? 7 : 8);

  el.innerHTML = suggestions.map(s => {
    const market = _marketForCrop(s);
    return `
    <div class="pro-suggest-item ${s.id === _npSpecies.id ? 'selected' : ''}" data-np-id="${s.id}">
      <span class="sp-ico">${s.icon}</span>
      <span>${s.name}</span>
      <span style="margin-left:auto;font-size:9px;color:#94a3b8;">${s.growDays}d · ${_fmtRM(market.bestPrice, 1)}/kg</span>
    </div>`;
  }).join('') + (customAllowed ? `
    <div class="pro-suggest-item ${_npSpecies.id === _normaliseCropId(rawQ) ? 'selected' : ''}" data-np-custom="${_esc(rawQ)}">
      <span class="sp-ico">🌱</span>
      <span>Analyze "${_esc(rawQ)}" with AI</span>
      <span style="margin-left:auto;font-size:9px;color:#94a3b8;">any species</span>
    </div>` : '');

  el.querySelectorAll('.pro-suggest-item').forEach(item => {
    item.addEventListener('click', () => {
      const custom = item.getAttribute('data-np-custom');
      _selectNpSpecies(custom
        ? _customSpecies(custom)
        : NP_SPECIES_DB.find(s => s.id === item.getAttribute('data-np-id')) || NP_SPECIES_DB[0]);
      _npRenderSuggestions();
      _npRender();
    });
  });
}

function _applyNpSuitabilityVisibility(sp) {
  const hideDetails = _npAiUnsuitable && _npAiAnalysis?.species === sp.id;
  document.getElementById('pro-readiness-card')?.classList.toggle('pro-hidden', hideDetails);
  document.getElementById('pro-impact-card')?.classList.toggle('pro-hidden', hideDetails);
}

function _resourceLinksHtml(links = VERTICAL_FARMING_RESOURCE_LINKS) {
  return `
    <div class="pro-source-row" style="margin-top:8px;">
      ${links.map(link => `
        <a class="pro-source-link" href="${_esc(link.url)}" target="_blank" rel="noopener noreferrer">
          ${_esc(link.label)}
        </a>`).join('')}
    </div>`;
}

function _advisorCalcHtml(plan) {
  const calc = plan?.calculation;
  const moisture = plan?.moisture;
  if (!calc || !moisture) return '';
  const unit = moisture.unit || '%';
  const adjustment = Number(calc.adjustmentPctPoints || 0);
  const adjustmentUnit = unit === '%' ? 'percentage points' : `${unit} points`;
  const adjustmentText = Math.abs(adjustment) < 0.05
    ? `0 ${adjustmentUnit}`
    : `${adjustment > 0 ? '+' : ''}${adjustment.toFixed(1)} ${adjustmentUnit}`;
  const sourceLinks = (plan.sources || []).slice(0, 3);
  return `
    <div class="pro-ai-calc">
      <div class="pro-ai-calc-title">Advisor calculation</div>
      <div class="pro-ai-calc-grid">
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${_esc(calc.currentMoisture)}${unit}</div>
          <div class="pro-ai-calc-lbl">Current</div>
        </div>
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${_esc(calc.idealMoistureMin)}-${_esc(calc.idealMoistureMax)}${unit}</div>
          <div class="pro-ai-calc-lbl">Crop ideal</div>
        </div>
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${_esc(calc.targetMoisture)}${unit}</div>
          <div class="pro-ai-calc-lbl">Target</div>
        </div>
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${_esc(adjustmentText)}</div>
          <div class="pro-ai-calc-lbl">Adjustment</div>
        </div>
      </div>
      <div class="pro-ai-calc-formula">
        ${_esc(calc.moistureFormula)}. Source: ${_esc(calc.moistureSource || 'sensor snapshot')}.
        ${sourceLinks.length ? `<div class="pro-source-row" style="margin-top:7px;">${sourceLinks.map(link => `
          <a class="pro-source-link" href="${_esc(link.url)}" target="_blank" rel="noopener noreferrer">${_esc(link.label)}</a>
        `).join('')}</div>` : ''}
      </div>
    </div>`;
}

function _npRender() {
  const sp      = _npSpecies;
  const farm    = _getActiveFarm(_allFarms);
  const zones   = _buildFarmZones(farm);
  const availableRows = zones.reduce((sum, z) => sum + (z.availableRows || 0), 0);
  const allFull = zones.length > 0 && availableRows <= 0;
  const canPlantNow = availableRows >= _npQty;
  const nextPlantDays = zones.filter(z => z.harvIn > 0).sort((a, b) => a.harvIn - b.harvIn)[0]?.harvIn || sp.growDays;
  const market  = _marketForCrop(sp);
  const sensorFactor = _yieldMultiplier();
  _renderBestPlantRecommendation();
  _applyNpSuitabilityVisibility(sp);

  // Readiness block
  const rb = document.getElementById('pro-readiness-block');
  if (rb) {
    if (allFull) {
      rb.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#fff1f2;border:1px solid #fecdd3;border-radius:10px;margin-bottom:12px;">
          <span style="font-size:24px;">⚠️</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:#991b1b;">No space available</div>
            <div style="font-size:11px;color:#64748b;margin-top:3px;">All layout zones are full. Earliest space is estimated in ${nextPlantDays} days after harvest.</div>
          </div>
        </div>`;
    } else {
      rb.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:${canPlantNow ? '#eff6ff' : '#fff7ed'};border:1px solid ${canPlantNow ? '#bfdbfe' : '#fed7aa'};border-radius:10px;margin-bottom:12px;">
          <span style="font-size:28px;">${sp.icon}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:${canPlantNow ? '#1d4ed8' : '#9a3412'};">
              ${canPlantNow ? `Ready to plant ${_npQty} rows of ${sp.name}` : `Only ${availableRows} rows free now`}
            </div>
            <div style="font-size:10px;color:#64748b;margin-top:3px;">
              ${canPlantNow ? `You can plant up to ${availableRows} rows now.` : `Plant ${Math.min(_npQty, availableRows)} rows now, or wait ~${nextPlantDays} days for more space.`}
              Harvest in ~${sp.growDays} days · ${_fmtRM(market.bestPrice, 2)}/kg via ${_esc(market.bestLabel)}
            </div>
          </div>
        </div>`;
    }
  }

  // Zone list — from real farm data
  const zl = document.getElementById('pro-zone-list');
  if (zl) {
    if (!zones.length) {
      zl.innerHTML = `<div style="font-size:12px;color:#94a3b8;padding:8px 0;">No zone data — select a farm first.</div>`;
    } else {
      zl.innerHTML = zones.map(z => {
        const cls       = z.fill >= 90 ? 'pro-badge-red' : z.fill >= 75 ? 'pro-badge-amber' : 'pro-badge-green';
        const lbl       = z.fill >= 90 ? 'FULL' : z.fill >= 75 ? 'NEAR FULL' : 'AVAILABLE';
        const fillColor = z.fill >= 90 ? '#ef4444' : z.fill >= 75 ? '#f59e0b' : '#22c55e';
        return `
          <div class="pro-zone-row">
            <div class="pro-zone-id">${z.id}</div>
            <div class="pro-zone-info">
              <div class="pro-zone-name">${z.emoji} ${z.crop} <span style="font-size:10px;color:#94a3b8;">· ${z.rows}/${z.capacity} rows</span></div>
              <div class="pro-zone-meta">${z.availableRows} rows free · ${z.harvIn ? `est. harvest in ${z.harvIn} days` : 'empty now'}</div>
              <div class="pro-zone-meter">
                <div class="pro-bar-track">
                  <div class="pro-bar-fill" style="width:${z.fill}%;background:${fillColor};"></div>
                </div>
              </div>
            </div>
            <span class="pro-badge ${cls}" style="margin-left:8px;">${lbl} ${z.fill}%</span>
          </div>`;
      }).join('');
    }
  }

  // Impact grid — scaled by quantity
  const scale = _npQty / 10;
  const DIR_ICONS = { up: '▲', down: '▼', ok: '●', warn: '⚠' };
  const RESOURCES = [
    { name: 'Temperature', icon: '🌡️', unit: '°C',  raw: sp.temp  },
    { name: 'Humidity',    icon: '💧', unit: '%',   raw: sp.hum   },
    { name: 'pH Level',    icon: '⚗️',  unit: '',    raw: sp.ph    },
    { name: 'Light',       icon: '☀️',  unit: '',    raw: sp.light },
    { name: 'Fertilizer',  icon: '🧪', unit: '',    raw: sp.fert  },
  ];

  const ig = document.getElementById('pro-impact-grid');
  if (ig) ig.innerHTML = RESOURCES.map((r, i) => {
    const dir = sp.dir[i];
    const num = parseFloat(r.raw);
    let display = r.raw === '0' ? 'No Δ' : r.raw;
    if (!isNaN(num) && r.raw !== '0') {
      const scaled = num * scale;
      display = (scaled > 0 ? '+' : '') + scaled.toFixed(1).replace(/\.0$/, '') + r.unit;
    }
    return `
      <div class="pro-impact-card ${dir}">
        <div class="pro-impact-icon">${r.icon}</div>
        <div class="pro-impact-name">${r.name}</div>
        <div class="pro-impact-val ${dir}">${DIR_ICONS[dir]} ${display}</div>
      </div>`;
  }).join('');

  // Economic impact summary — real calculation from NP_SPECIES_DB
  const harvestsPerCycle = 3; // conservative estimate for most crops
  const estYieldKg = (sp.yieldKgPerRow * _npQty * harvestsPerCycle * sensorFactor).toFixed(1);
  const estValue   = (parseFloat(estYieldKg) * market.bestPrice).toFixed(0);
  const weeksPerMonth = 4.33;
  const extraCostPerMo = (
    (_npQty * sp.waterLpR / 1000 * RATES.waterRM * weeksPerMonth) +
    (_npQty * sp.fertMLpR        * RATES.fertRM   * weeksPerMonth)
  ).toFixed(2);
  const costToHarvest = parseFloat(extraCostPerMo) * (sp.growDays / 30);
  const estProfit = parseFloat(estValue) - costToHarvest;
  const harvestDate = new Date(Date.now() + sp.growDays * 24 * 60 * 60 * 1000);

  const yieldEl = document.getElementById('pro-eco-yield');
  const valueEl = document.getElementById('pro-eco-value');
  const costEl  = document.getElementById('pro-eco-cost');
  const profitEl = document.getElementById('pro-eco-profit');
  const harvestEl = document.getElementById('pro-eco-harvest-date');
  if (yieldEl) yieldEl.textContent = estYieldKg + ' kg';
  if (valueEl) valueEl.textContent = 'RM ' + estValue;
  if (costEl)  costEl.textContent  = 'RM ' + extraCostPerMo;
  if (profitEl) profitEl.textContent = _fmtRM(estProfit, 0);
  if (harvestEl) harvestEl.textContent = harvestDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  // Fetch real AI advisor response
  const advisorKey = `${sp.id}|${_npQty}|${_activeFarmId() || ''}|${_sensorSnapshot?.createdAt || ''}|${_sensorSnapshot?.temp}|${_sensorSnapshot?.humid}|${_sensorSnapshot?.water}`;
  if (advisorKey !== _npAdvisorKey) {
    _npAdvisorKey = advisorKey;
    _fetchNpAdvisor(sp, _npQty, zones);
  }
}

// Calls the backend AI route with real sensor data and farm context.
// Falls back to a rule-based message if the API is unreachable.
async function _fetchNpAdvisor(sp, qty, zones) {
  const aiEl = document.getElementById('pro-np-ai');
  const aiBox = document.getElementById('pro-np-ai-box');
  if (!aiEl) return;
  if (aiBox) aiBox.className = 'pro-ai-inline';
  aiEl.className    = 'pro-ai-loading';
  aiEl.textContent  = `Analysing ${qty} rows of ${sp.name} against your current farm conditions…`;

  const sensors   = _sensorSnapshot || await fetchSensorData();
  const zoneNames = zones.map(z => `${z.crop} (${z.fill}% full)`).join(', ');
  const warnings  = sp.dir.filter(d => d === 'warn').length;

  try {
    const res = await fetch(`${API_BASE}/api/whatif/newplant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        species: sp.custom ? sp.name : sp.id,
        quantity: qty,
        currentCrops: zoneNames ? zones.map(z => z.crop) : [],
        sensors,
      }),
    });

    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    const text = data.insight || data.analysis?.reason || '';
    const unsuitable = Boolean(data.unsuitable || data.analysis?.suitable === false);
    _npAiAnalysis = { species: sp.id, data };
    _npAiUnsuitable = unsuitable;
    if (aiBox) aiBox.className = `pro-ai-inline ${unsuitable ? 'bad' : data.warnings?.length ? 'warn' : ''}`;

    aiEl.className   = '';
    const calcHtml = unsuitable ? '' : _advisorCalcHtml(data.environmentPlan);
    aiEl.innerHTML = _esc(text || _fallbackAdvisorNote(sp, warnings))
      + calcHtml
      + (unsuitable ? _resourceLinksHtml(data.resourceLinks || VERTICAL_FARMING_RESOURCE_LINKS) : '');
    _applyNpSuitabilityVisibility(sp);
  } catch {
    _npAiAnalysis = { species: sp.id, data: null };
    _npAiUnsuitable = false;
    if (aiBox) aiBox.className = 'pro-ai-inline warn';
    aiEl.className   = '';
    aiEl.textContent = _fallbackAdvisorNote(sp, warnings);
    _applyNpSuitabilityVisibility(sp);
  }
}

// Rule-based fallback when the API is unavailable.
function _fallbackAdvisorNote(sp, warnings) {
  const notes = {
    spinach:    'Spinach co-exists well with leafy crops. No special zone separation needed. Harvest outer leaves first to extend the crop window.',
    mint:       'Mint spreads aggressively — use physical root barriers between neighbouring zones. Harvest before flowering to maintain leaf quality.',
    chili:      'Chili needs more heat and light than most indoor crops. Raise your grow-light intensity in the target zone before introduction.',
    cucumber:   'Cucumbers are water-heavy. Scale your pump duty cycle proportionally and ensure good airflow to prevent powdery mildew.',
    strawberry: 'Strawberries prefer cooler temperatures — position away from heat lamp clusters. Use end-row positions in the coldest zone.',
    kale:       'Kale is cold-tolerant and a strong companion for lettuce rows. Harvest outer leaves regularly to encourage continuous growth.',
    broccoli:   'Space broccoli at least 30 cm apart for airflow. Monitor for aphids in high-humidity zones.',
    celery:     'Celery has very high water demand — schedule irrigation before adding rows to avoid moisture stress.',
    pepper:     'Bell peppers need consistent temperatures above 20°C. Avoid placing near air vents or cooling zones.',
    tomato:     'Tomatoes do best with deep watering every 2–3 days and benefit from calcium supplementation to prevent blossom end rot.',
    basil:      'Basil is low-impact and an excellent companion for tomatoes. Pinch flower heads to keep leaves productive longer.',
    kangkung:   'Kangkung is fast-growing and low-maintenance. Keep soil consistently moist and harvest young shoots for best flavour.',
    petai:      'Petai grows well in warm, humid conditions. Ensure good airflow to prevent fungal issues at the base.',
  };
  const base = notes[sp.id] || 'Monitor environment for 48 hours after introduction and adjust humidity if readings exceed safe thresholds.';
  return warnings > 0
    ? `⚠ Adding ${_npQty} rows of ${sp.name} triggers ${warnings} resource warning(s). Review flagged parameters before planting. ${base}`
    : `✅ ${_npQty} rows of ${sp.name} — resource impact within acceptable range. ${base}`;
}

/* ─────────────────────────────────────────────
   EXPORT: renderScreen() — full page mount
───────────────────────────────────────────── */
export function renderScreen() {
  const container = document.getElementById('screenContainer');
  container.innerHTML = `
    <div class="screen active" id="whatifProScreen">
      <div style="display:flex;align-items:center;padding:12px 16px;background:#fff;gap:12px;border-bottom:1px solid #e5e7eb;">
        <button id="whatifProBackBtn" class="back-btn" aria-label="Back" style="color:#166534;">←</button>
        <div style="font-weight:700;color:#17231b;">🔮 What-If Pro</div>
      </div>
      <div style="flex:1;overflow-y:auto;">${render()}</div>
    </div>
  `;
  document.getElementById('whatifProBackBtn').addEventListener('click', () => showScreen('dash-c'));
  init();
}
