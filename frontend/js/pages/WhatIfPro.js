import { API_BASE } from '../utils/apiBase.js';
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
import { initFirebase, loadUserData, getDb } from '../utils/firebase.js';

/* ─────────────────────────────────────────────
   CONSTANTS & RATES
───────────────────────────────────────────── */


// Malaysian utility rates (2024)
const RATES = {
  waterRM:  0.042,  // RM/litre — Syabas domestic block 1
  energyRM: 1.10,   // RM/kWh  — TNB domestic block 1
  fertRM:   0.009,  // RM/mL   — hydroponic A+B concentrate avg
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
let _npUnitsPerRow = 1;
let _npSpecies   = NP_SPECIES_DB[0];
let _npFiltered  = [...NP_SPECIES_DB];
let _farmCrops   = [];   // active farm's planted crops mapped to PRO_CROPS shape
let _allFarms    = [];   // all farms from localStorage
let _activeFarmIdx = 0;  // index into _allFarms
let _marketPrices = {};
let _historicalResourceData = null;  // { water: [...], ec: [...], fetchedAt: ts }
let _historicalResourcePromise = null;
let _resourcePrediction = null;      // { waterPrediction, fertPrediction, confidence, source }
let _resourcePredictionKey = '';     // cache key to avoid redundant AI calls
let _marketSources = [...MARKET_SOURCE_LINKS];
let _marketStatus = { loading: false, error: null, generatedAt: null };
let _sensorSnapshot = null;
let _farmLevelSensorSnapshot = null;
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
    // Resource values are kept as per-row (per-slot) figures — NOT pre-multiplied
    // by slots. _renderNpEconomics divides by baseUnitsPerRow to get a per-unit
    // figure and then scales by totalUnits. Pre-multiplying here and then
    // dividing by baseUnitsPerRow (which ≠ slots) produced wrong per-unit values.
    return {
      id:           speciesId,
      name:         p.name || fallback.name || speciesId,
      icon:         p.emoji || '🌱',
      slots:        p.slots || 1,
      growDays:     fallback.growDays,
      yieldKgPerRow: fallback.yieldKgPerRow,
      pricePerKg:   fallback.pricePerKg,
      waterLpR:     fallback.waterLpR,
      energyKWhpR:  fallback.energyKWhpR,
      fertMLpR:     fallback.fertMLpR,
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

function _unitsPerRowForFarm(farm = _getActiveFarm(_allFarms)) {
  if (!farm) return 1;
  const direct = Number(farm.unitsPerRow || farm.slotsPerRow || farm.slotsPerTier);
  if (Number.isFinite(direct) && direct > 0) return Math.round(direct);

  if (Array.isArray(farm.zones) && farm.zones.length) {
    const capacities = farm.zones
      .map(zone => Number(zone.capacity || zone.slots || zone.totalSlots))
      .filter(value => Number.isFinite(value) && value > 0);
    if (capacities.length) {
      return Math.max(1, Math.round(capacities.reduce((sum, value) => sum + value, 0) / capacities.length));
    }
  }

  const rackId = farm.rackTypeId || farm.rackType || '3-tier';
  const layout = {
    ...(RACK_LAYOUTS[rackId] || RACK_LAYOUTS['3-tier']),
    ...(farm.rackConfig || {}),
  };
  const fromLayout = Number(layout.slotsPerTier || layout.unitsPerRow);
  if (Number.isFinite(fromLayout) && fromLayout > 0) return Math.round(fromLayout);

  return 1;
}

function _npPlanting() {
  const rows = Math.max(1, Number(_npQty) || 1);
  const unitsPerRow = Math.max(1, Number(_npUnitsPerRow) || 1);
  return {
    rows,
    unitsPerRow,
    totalUnits: rows * unitsPerRow,
    baseUnitsPerRow: Math.max(1, _unitsPerRowForFarm()),
  };
}

function _zoneHarvestDays(plants = []) {
  const days = plants.map(p => {
    const fallback = PRO_CROPS_FALLBACK.find(f => f.id === _normaliseCropId(p.species || p.name));
    return fallback ? Math.max(7, Math.round(fallback.growDays * 0.6)) : 21;
  });
  return days.length ? Math.min(...days) : 0;
}

function _sensorFallback() {
  return null;
}

const DEMO_SENSOR_DEVICE_IDS = new Set(['farm_001']);
const DEMO_COMMERCIAL_ZONE_DEVICES = {
  zone_A: 'commercial-zone-node-1',
  zone_B: 'commercial-zone-node-2',
  zone_C: 'commercial-zone-node-3',
  zone_D: 'commercial-zone-node-4',
  zone_E: 'commercial-zone-node-5',
  zone_F: 'commercial-zone-node-6',
};
const DEMO_COMMERCIAL_FARM_MASTER = 'commercial-farm-master-1';

function _isDemoSensorDevice(value) {
  return value && DEMO_SENSOR_DEVICE_IDS.has(String(value));
}

function _sensorQueryForFarm(farm) {
  return _latestSensorQueryCandidates(farm)[0]?.toString() || '';
}

function _normaliseCommercialZoneId(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  const singleLetter = raw.match(/^([a-z])$/);
  const zoneWord = raw.match(/^zone[_ ]([a-z])$/);
  const letter = singleLetter?.[1] || zoneWord?.[1];
  if (letter) return `zone_${letter.toUpperCase()}`;
  return raw.startsWith('zone_') ? `zone_${raw.slice(5).toUpperCase()}` : raw;
}

function _findCommercialDeviceForZone(farm, zoneId) {
  const normalizedZone = _normaliseCommercialZoneId(zoneId);
  if (!normalizedZone) return null;
  const devices = Array.isArray(farm?.commercialDevices) ? farm.commercialDevices : [];
  return devices.find(item => _normaliseCommercialZoneId(item.zoneId || item.zone) === normalizedZone)
    || (_normaliseCommercialZoneId(farm?.zoneId) === normalizedZone ? farm : null);
}

function _farmLevelDeviceId(farm = _getActiveFarm(_allFarms)) {
  const explicit =
    farm?.farmMaster?.deviceId ||
    farm?.farmMasterDeviceId ||
    farm?.masterDeviceId ||
    AppState.currentFarm?.farmMaster?.deviceId ||
    AppState.currentFarm?.farmMasterDeviceId;
  if (explicit) return explicit;
  if (
    farm?.id === 'farm_commercial_demo_001' ||
    farm?.farmId === 'farm_commercial_demo_001' ||
    farm?.backendFarmId === 'farm_commercial_demo_001'
  ) {
    return DEMO_COMMERCIAL_FARM_MASTER;
  }
  return '';
}

function _farmLevelSensorQueryCandidates(farm = _getActiveFarm(_allFarms)) {
  const candidates = [];
  const seen = new Set();
  const push = (key, value) => {
    if (!value) return;
    const query = new URLSearchParams();
    query.set(key, value);
    const signature = query.toString();
    if (seen.has(signature)) return;
    seen.add(signature);
    candidates.push(query);
  };

  push('deviceId', _farmLevelDeviceId(farm));
  push('deviceId', DEMO_COMMERCIAL_FARM_MASTER);
  return candidates;
}

function _latestSensorQueryCandidates(farm = _getActiveFarm(_allFarms)) {
  const candidates = [];
  const seen = new Set();
  const push = (key, value) => {
    if (!value) return;
    if (key === 'deviceId' && _isDemoSensorDevice(value)) return;
    const query = new URLSearchParams();
    query.set(key, value);
    const signature = query.toString();
    if (seen.has(signature)) return;
    seen.add(signature);
    candidates.push(query);
  };

  const zoneId = _normaliseCommercialZoneId(AppState.currentZoneId || farm?.zoneId);
  const zoneDevice = _findCommercialDeviceForZone(farm, zoneId);

  push('deviceId', zoneDevice?.deviceId);
  push('deviceId', farm?.deviceId);
  push('deviceId', farm?.farmMaster?.deviceId);
  push('deviceId', AppState.currentFarm?.deviceId);
  push('zoneId', zoneId);
  push('deviceId', DEMO_COMMERCIAL_ZONE_DEVICES[zoneId]);

  if (zoneId === 'farm_master') {
    push('deviceId', farm?.farmMaster?.deviceId);
    push('deviceId', farm?.deviceId);
    push('deviceId', DEMO_COMMERCIAL_FARM_MASTER);
  }

  if (Array.isArray(farm?.commercialDevices)) {
    farm.commercialDevices.forEach(device => push('deviceId', device?.deviceId));
  }

  push('farmId', farm?.id);
  push('farmId', farm?.farmId);
  push('farmId', farm?.backendFarmId);
  push('fieldId', farm?.fieldId);
  push('fieldId', farm?.id);
  push('farmId', 'farm_commercial_demo_001');

  if (!zoneId) {
    Object.values(DEMO_COMMERCIAL_ZONE_DEVICES).forEach(deviceId => push('deviceId', deviceId));
  }

  return candidates;
}

function _sensorFilterPayloadForFarm(farm = _getActiveFarm(_allFarms)) {
  const zoneId = _normaliseCommercialZoneId(AppState.currentZoneId || farm?.zoneId);
  const zoneDevice = _findCommercialDeviceForZone(farm, zoneId);
  const deviceId = zoneDevice?.deviceId || farm?.deviceId || farm?.farmMaster?.deviceId || AppState.currentFarm?.deviceId || undefined;
  return {
    deviceId: _isDemoSensorDevice(deviceId) ? undefined : deviceId,
    zoneId: zoneId || undefined,
    farmId: farm?.id || farm?.farmId || farm?.backendFarmId || undefined,
    fieldId: farm?.fieldId || undefined,
  };
}

function _sensorIdentifierSummary(farm = _getActiveFarm(_allFarms)) {
  const filters = _sensorFilterPayloadForFarm(farm);
  const entries = Object.entries(filters).filter(([, value]) => value);
  return entries.length
    ? entries.map(([key, value]) => `${key}=${value}`).join(' · ')
    : 'No deviceId, farmId, fieldId, or zoneId available';
}

function _hasFirebaseSensorProof() {
  return Boolean(_sensorSnapshot || (_historicalResourceData && _historicalResourceData.totalReadings));
}

function _normaliseSensorPayload(payload = {}) {
  const reading = payload.reading || payload;
  if (!reading || payload.reading === null || !Object.keys(reading).length) return null;
  const lightRaw = Number(reading.lightRaw);
  const soilRaw  = Number(reading.soilRaw);
  const ecRaw    = Number(reading.ecRaw);
  const ec       = Number(reading.ec);

  // NOTE: soilRaw / 4095 * 100 is NOT a calibrated moisture reading.
  // It is only a rough approximation used as a last resort when no explicit
  // percent is available from Firebase. The backend (whatIfController) will
  // re-calibrate using dry/wet calibration constants if soilRaw is forwarded.
  // Do NOT use this value as a scientific "soil moisture %" in AI prompts.
  const rawPctUncalibrated = (value) => Number.isFinite(value)
    ? Math.max(0, Math.min(100, value / 4095 * 100))
    : undefined;

  const ecPct = Number.isFinite(ec) ? Math.max(0, Math.min(100, ec / 2.2 * 100)) : undefined;
  const hasSoilMoisture = reading.soilMoisture !== undefined;
  const hasWaterPercent = reading.water       !== undefined;

  // Prefer explicit Firebase percent fields; only fall back to uncalibrated rawPct
  // as a rough approximation — backend will recalibrate when soilRaw is present.
  const soilRawApproxPct = rawPctUncalibrated(soilRaw);
  const moistureValue    = reading.moisture ?? reading.soilMoisture ?? reading.water ?? soilRawApproxPct ?? null;
  const moistureSource   = hasSoilMoisture
    ? 'Firebase soilMoisture percent'
    : hasWaterPercent
      ? 'Firebase water percent'
      : Number.isFinite(soilRaw)
        ? 'Firebase soilRaw ADC (uncalibrated approx) — backend will recalibrate'
        : 'Firebase reading missing soil moisture field';
  return {
    temp:     reading.temperature  ?? reading.temp     ?? null,
    humid:    reading.humidity     ?? reading.humid    ?? null,
    light:    reading.light        ?? reading.lux      ?? rawPctUncalibrated(lightRaw) ?? null,
    water:    moistureValue,
    moisture: moistureValue,
    soilMoisture: moistureValue,
    nutrient: reading.nutrient     ?? ecPct            ?? rawPctUncalibrated(ecRaw)    ?? null,
    ph:       reading.ph           ?? null,
    soilRaw:  Number.isFinite(soilRaw) ? soilRaw : undefined,
    soilRawUnit: Number.isFinite(soilRaw) ? 'ADC count (0-4095)' : undefined,
    moistureUnit: '%',
    soilMoistureUnit: Number.isFinite(soilRaw) ? 'uncalibrated approx from soilRaw ADC' : '%',
    moistureBasis: Number.isFinite(soilRaw) && !hasSoilMoisture && !hasWaterPercent
      ? 'soilRaw uncalibrated approximation — set dry/wet calibration in device settings'
      : 'explicit percent',
    moistureFormula: Number.isFinite(soilRaw) && !hasSoilMoisture && !hasWaterPercent
      ? 'APPROX ONLY: soilRaw / 4095 × 100 — not scientifically valid without calibration'
      : 'soil moisture % = Firebase explicit percent reading',
    lightRaw: Number.isFinite(lightRaw) ? lightRaw : undefined,
    ecRaw:    Number.isFinite(ecRaw) ? ecRaw : undefined,
    ec:       Number.isFinite(ec) ? ec : undefined,
    waterDistanceCm: reading.waterDistanceCm,
    gasRaw: reading.gasRaw,
    co2Raw: reading.co2Raw,
    co2Ppm: reading.co2Ppm,
    energyKwh: reading.energyKwh,
    packageLevel: reading.packageLevel,
    deviceId: reading.deviceId,
    farmId: reading.farmId,
    zoneId: reading.zoneId,
    fieldId: reading.fieldId,
    sourceQuery: reading.sourceQuery,
    moistureSource,
    createdAt: _normaliseFirebaseTimestamp(reading.createdAt || reading.updatedAt),
    source:   'Firebase Cloud Firestore sensorReadings',
  };
}

function _normaliseFirebaseTimestamp(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  if (Number.isFinite(value.seconds)) return new Date(value.seconds * 1000);
  return value;
}

function _firebaseDocToReading(doc, sourceQuery = '') {
  const data = typeof doc.data === 'function' ? doc.data() : doc;
  return {
    id: doc.id || data.id,
    ...data,
    createdAt: _normaliseFirebaseTimestamp(data.createdAt),
    updatedAt: _normaliseFirebaseTimestamp(data.updatedAt),
    sourceQuery,
  };
}

function _looksLikeSensorReading(reading) {
  if (!reading) return false;
  return [
    reading.temperature,
    reading.temp,
    reading.humidity,
    reading.humid,
    reading.soilMoisture,
    reading.moisture,
    reading.water,
    reading.soilRaw,
    reading.waterDistanceCm,
    reading.ec,
    reading.ecRaw,
    reading.light,
    reading.lightRaw,
  ].some(value => value !== undefined && value !== null);
}

async function fetchSensorData(farm = _getActiveFarm(_allFarms)) {
  let lastError = null;
  const candidates = _latestSensorQueryCandidates(farm);

  for (const query of candidates) {
    try {
      const res = await fetch(`${API_BASE}/api/sensors/latest?${query.toString()}`);
      if (!res.ok) throw new Error('sensor HTTP ' + res.status);
      const data = await res.json();
      const normalised = _normaliseSensorPayload({
        ...data,
        reading: data?.reading ? { ...data.reading, sourceQuery: `rest:${query.toString()}` } : data?.reading,
      });
      if (normalised) return normalised;
    } catch (err) {
      lastError = err;
    }
  }

  try {
    const fbResult = await _fetchHistoricalReadingsFromFirebase(farm, 1);
    const reading = fbResult?.readings?.[0];
    if (reading) return _normaliseSensorPayload({ ...reading, sourceQuery: `firebase:${fbResult.usedQuery}` });
  } catch (err) {
    lastError = err;
  }

  console.warn('[WhatIfPro] Firebase latest sensor unavailable:', lastError?.message || 'no matching sensorReadings');
  return null;
}

async function fetchFarmLevelSensorData(farm = _getActiveFarm(_allFarms)) {
  let lastError = null;
  const candidates = _farmLevelSensorQueryCandidates(farm);

  for (const query of candidates) {
    try {
      const res = await fetch(`${API_BASE}/api/sensors/latest?${query.toString()}`);
      if (!res.ok) throw new Error('sensor HTTP ' + res.status);
      const data = await res.json();
      const normalised = _normaliseSensorPayload({
        ...data,
        reading: data?.reading ? { ...data.reading, sourceQuery: `farm-level:${query.toString()}` } : data?.reading,
      });
      if (normalised) return normalised;
    } catch (err) {
      lastError = err;
    }
  }

  console.warn('[WhatIfPro] Farm-level sensor unavailable:', lastError?.message || 'no farm master reading');
  return null;
}

/* ─────────────────────────────────────────────
   HISTORICAL SENSOR DATA + AI RESOURCE PREDICTION
───────────────────────────────────────────── */

// Mirrors CommercialPage.js commercialSensorQueryCandidates():
// builds every possible query in priority order so we never miss
// data just because one identifier is not set.
function _historyCandidates(farm = _getActiveFarm(_allFarms)) {
  const seen = new Set();
  const candidates = [];

  const push = (key, value) => {
    if (!value) return;
    if (key === 'deviceId' && _isDemoSensorDevice(value)) return;
    const q = new URLSearchParams();
    q.set(key, value);
    q.set('limit', '200');
    const sig = q.toString();
    if (seen.has(sig)) return;
    seen.add(sig);
    candidates.push(q);
  };

  const zoneId = _normaliseCommercialZoneId(AppState.currentZoneId || farm?.zoneId);
  const zoneDevice = _findCommercialDeviceForZone(farm, zoneId);

  // 1. Explicit zone/farm deviceId (highest priority, same as CommercialPage)
  push('deviceId', zoneDevice?.deviceId);
  push('deviceId', farm?.deviceId);
  push('deviceId', farm?.farmMaster?.deviceId);
  push('deviceId', AppState.currentFarm?.deviceId);

  // 2. Zone-level identifiers
  push('zoneId', zoneId);
  push('deviceId', DEMO_COMMERCIAL_ZONE_DEVICES[zoneId]);

  if (zoneId === 'farm_master') {
    push('deviceId', farm?.farmMaster?.deviceId);
    push('deviceId', farm?.deviceId);
    push('deviceId', DEMO_COMMERCIAL_FARM_MASTER);
  }

  if (Array.isArray(farm?.commercialDevices)) {
    farm.commercialDevices.forEach(device => push('deviceId', device?.deviceId));
  }

  // 3. Farm / field level (broader, catches more readings)
  push('farmId',  farm?.id);
  push('farmId',  farm?.farmId);
  push('farmId',  farm?.backendFarmId);
  push('fieldId', farm?.fieldId);
  push('fieldId', farm?.id);
  push('farmId', 'farm_commercial_demo_001');

  if (!zoneId) {
    Object.values(DEMO_COMMERCIAL_ZONE_DEVICES).forEach(deviceId => push('deviceId', deviceId));
  }

  return candidates;
}

/* ─────────────────────────────────────────────
   FIREBASE DIRECT HISTORY FETCH
   Queries Firestore `sensorReadings` collection directly, ordered by
   createdAt descending. Tries identifiers in priority order:
     1. deviceId  (most specific — matches your document schema)
     2. zoneId
     3. farmId / fieldId
   Returns raw document data array, or [] if nothing found / not authed.
─────────────────────────────────────────────── */
async function _fetchHistoricalReadingsFromFirebase(farm = _getActiveFarm(_allFarms), limitCount = 200) {
  try {
    await initFirebase();
    const db = getDb();
    if (!db) throw new Error('Firebase Firestore is not initialized');

    // Build ordered list of (field, value) pairs to try — mirrors _historyCandidates()
    const zoneId = _normaliseCommercialZoneId(AppState.currentZoneId || farm?.zoneId);
    const zoneDevice = _findCommercialDeviceForZone(farm, zoneId);
    const idCandidates = [
      ['deviceId', zoneDevice?.deviceId],
      ['deviceId', farm?.deviceId],
      ['deviceId', farm?.farmMaster?.deviceId],
      ['deviceId', AppState.currentFarm?.deviceId],
      ['zoneId',   zoneId],
      ['deviceId', DEMO_COMMERCIAL_ZONE_DEVICES[zoneId]],
      ['deviceId', zoneId === 'farm_master' ? DEMO_COMMERCIAL_FARM_MASTER : null],
      ...(Array.isArray(farm?.commercialDevices)
        ? farm.commercialDevices.map(device => ['deviceId', device?.deviceId])
        : []),
      ['farmId',   farm?.id],
      ['farmId',   farm?.farmId],
      ['farmId',   farm?.backendFarmId],
      ['fieldId',  farm?.fieldId],
      ['fieldId',  farm?.id],
      ['farmId',   'farm_commercial_demo_001'],
      ...(!zoneId
        ? Object.values(DEMO_COMMERCIAL_ZONE_DEVICES).map(deviceId => ['deviceId', deviceId])
        : []),
    ].filter(([field, v]) => Boolean(v) && !(field === 'deviceId' && _isDemoSensorDevice(v)));

    // Deduplicate so we don't repeat the same (field, value) pair
    const seen = new Set();
    const uniqueCandidates = idCandidates.filter(([field, value]) => {
      const key = `${field}:${value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const col = db.collection('sensorReadings');
    const maxDocs = Math.max(1, Math.min(500, Number(limitCount) || 200));

    for (const [field, value] of uniqueCandidates) {
      try {
        const snapshot = await col
          .where(field, '==', value)
          .orderBy('createdAt', 'desc')
          .limit(maxDocs)
          .get();
        if (!snapshot.empty) {
          const readings = snapshot.docs
            .map(doc => _firebaseDocToReading(doc, `${field}=${value}`))
            .filter(reading => _looksLikeSensorReading(reading) && !_isDemoSensorDevice(reading.deviceId));
          if (readings.length) {
            console.log(`[WhatIfPro] Firebase direct: ${readings.length} readings via ${field}=${value}`);
            return { readings, usedQuery: `${field}=${value}` };
          }
        }
      } catch (innerErr) {
        // A missing index or permission error on one field shouldn't abort — try next
        console.warn(`[WhatIfPro] Firebase direct query failed (${field}=${value}):`, innerErr.message);
      }
    }

    console.info('[WhatIfPro] Firebase direct: no sensorReadings documents found for known identifiers');
    return { readings: [], usedQuery: '' };
  } catch (err) {
    console.warn('[WhatIfPro] Firebase direct history unavailable:', err.message);
    return null; // signals caller to fall back to REST API
  }
}

// Fetches up to 200 historical readings.
// Strategy:
//   1. Try Firestore directly (fastest, no backend hop, works if SDK is configured)
//   2. Fall back to REST API /api/sensors/history (legacy path, kept for compatibility)
async function _fetchHistoricalReadings(farm = _getActiveFarm(_allFarms)) {
  // Return cached data if still fresh (< 5 min)
  if (_historicalResourceData && (Date.now() - _historicalResourceData.fetchedAt) < 5 * 60 * 1000) {
    return _historicalResourceData;
  }
  if (_historicalResourcePromise) return _historicalResourcePromise;

  _historicalResourcePromise = _fetchHistoricalReadingsFresh(farm).finally(() => {
    _historicalResourcePromise = null;
  });
  return _historicalResourcePromise;
}

async function _fetchHistoricalReadingsFresh(farm = _getActiveFarm(_allFarms)) {
  let rawReadings = [];
  let usedQuery   = '';

  // ── Strategy 1: Direct Firestore SDK query ──────────────────────────────
  const fbResult = await _fetchHistoricalReadingsFromFirebase(farm);
  if (fbResult && fbResult.readings.length > 0) {
    rawReadings = fbResult.readings;
    usedQuery   = `firebase:${fbResult.usedQuery}`;
    console.log(`[WhatIfPro] History source: Firebase direct (${rawReadings.length} readings)`);
  }

  // ── Strategy 2: REST API fallback ───────────────────────────────────────
  if (!rawReadings.length) {
    console.log('[WhatIfPro] Falling back to REST API for history...');
    const candidates = _historyCandidates(farm);
    for (const q of candidates) {
      try {
        const res = await fetch(`${API_BASE}/api/sensors/history?${q}`);
        if (!res.ok) continue;
        const data = await res.json();
        const batch = (Array.isArray(data.readings) ? data.readings
                    : Array.isArray(data)           ? data
                    : [])
          .filter(reading => _looksLikeSensorReading(reading) && !_isDemoSensorDevice(reading.deviceId));
        if (batch.length > 0) {
          rawReadings = batch;
          usedQuery   = `rest:${q.toString()}`;
          console.log('[WhatIfPro] History loaded via REST ' + q.toString() + ' - ' + batch.length + ' readings');
          break;
        }
      } catch (err) {
        console.warn('[WhatIfPro] REST history candidate failed:', q.toString(), err.message);
      }
    }
  }

  if (!rawReadings.length) {
    console.info('[WhatIfPro] No Firebase sensor history found for active farm identifiers');
    _renderSensorProofCard();
    return null;
  }

  // Parse water (soil moisture) series
  const waterSeries = rawReadings.map(r => {
    const explicit = r.soilMoisture ?? r.moisture ?? r.water;
    // soilRaw / 4095 is an uncalibrated approximation — acceptable for trend
    // analysis of historical data, but labelled clearly for any display context.
    const fromRaw  = Number.isFinite(Number(r.soilRaw))
      ? Math.max(0, Math.min(100, Number(r.soilRaw) / 4095 * 100)) : null;
    const value = (explicit !== undefined && explicit !== null) ? Number(explicit) : fromRaw;
    return {
      ts:      r.createdAt || r.timestamp,
      value,
      waterOn: String(r.command || '').includes('WATER_ON'),
    };
  }).filter(r => r.value !== null && Number.isFinite(r.value));

  // Parse EC / fertilizer series
  const ecSeries = rawReadings.map(r => {
    const explicit = r.ec;
    const fromRaw  = Number.isFinite(Number(r.ecRaw))
      ? Math.max(0, Math.min(100, Number(r.ecRaw) / 4095 * 100)) : null;
    const value = (explicit !== undefined && explicit !== null) ? Number(explicit) : fromRaw;
    return {
      ts:        r.createdAt || r.timestamp,
      value,
      fertAlert: String(r.command || '').includes('FERT_ALERT'),
    };
  }).filter(r => r.value !== null && Number.isFinite(r.value));

  // Parse temperature series (context for AI)
  const tempSeries  = rawReadings.map(r => Number(r.temperature ?? r.temp)).filter(Number.isFinite);
  const humidSeries = rawReadings.map(r => Number(r.humidity ?? r.humid)).filter(Number.isFinite);
  const phSeries    = rawReadings.map(r => Number(r.ph)).filter(Number.isFinite);

  _historicalResourceData = {
    water: waterSeries,
    ec:    ecSeries,
    temp:  tempSeries,
    humid: humidSeries,
    ph:    phSeries,
    rawReadings: rawReadings.slice(0, 200),
    totalReadings: rawReadings.length,
    usedQuery,
    fetchedAt: Date.now(),
  };
  _renderSensorProofCard();
  return _historicalResourceData;
}

// Derives simple statistics from a time series.
function _seriesStats(series = []) {
  if (!series.length) return null;
  const values = series.map(r => r.value);
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Count how many readings triggered an alert (WATER_ON or FERT_ALERT)
  const alertCount = series.filter(r => r.waterOn || r.fertAlert).length;
  const alertPct = Math.round((alertCount / series.length) * 100);

  // Simple linear trend: compare last 10% of readings vs first 10%
  const chunk = Math.max(1, Math.floor(series.length * 0.1));
  const early = values.slice(0, chunk).reduce((s, v) => s + v, 0) / chunk;
  const late  = values.slice(-chunk).reduce((s, v) => s + v, 0) / chunk;
  const trend = late - early; // positive = rising, negative = falling

  return { avg, median, min, max, alertCount, alertPct, trend, count: series.length };
}

function _sensorFiltersFromHistory(histData, farm = _getActiveFarm(_allFarms)) {
  const base = _sensorFilterPayloadForFarm(farm);
  const reading = histData?.rawReadings?.find(r => r && !_isDemoSensorDevice(r.deviceId)) || {};
  return {
    deviceId: reading.deviceId || base.deviceId,
    zoneId:   reading.zoneId   || base.zoneId,
    farmId:   reading.farmId   || base.farmId,
    fieldId:  reading.fieldId  || base.fieldId,
  };
}

function _predictResourcesFromHistory(sp, planting, histData, reason = '') {
  const waterStats = _seriesStats(histData?.water || []);
  const ecStats = _seriesStats(histData?.ec || []);
  const waterPerUnit = sp.waterLpR / Math.max(1, planting.baseUnitsPerRow);
  const fertPerUnit = sp.fertMLpR / Math.max(1, planting.baseUnitsPerRow);
  const energyPerUnit = (sp.energyKWhpR || 0) / Math.max(1, planting.baseUnitsPerRow);
  const moistureAlertPct = Number(waterStats?.alertPct || 0);
  const fertAlertPct = Number(ecStats?.alertPct || 0);
  const moistureTrend = Number(waterStats?.trend || 0);
  const ecTrend = Number(ecStats?.trend || 0);
  const waterMultiplier = 1
    + (moistureAlertPct > 30 ? 0.18 : moistureAlertPct > 10 ? 0.08 : 0)
    + (moistureTrend < -1 ? 0.08 : moistureTrend > 1 ? -0.04 : 0);
  const fertMultiplier = 1
    + (fertAlertPct > 30 ? 0.16 : fertAlertPct > 10 ? 0.07 : 0)
    + (ecTrend < -0.05 ? 0.08 : ecTrend > 0.05 ? -0.04 : 0);

  return {
    waterLitresPerWeek: Number((waterPerUnit * planting.totalUnits * Math.max(0.75, waterMultiplier)).toFixed(1)),
    waterTrend: moistureTrend < -1 || moistureAlertPct > 20 ? 'up' : moistureTrend > 1 ? 'down' : 'stable',
    fertMLPerWeek: Number((fertPerUnit * planting.totalUnits * Math.max(0.75, fertMultiplier)).toFixed(0)),
    fertTrend: ecTrend < -0.05 || fertAlertPct > 20 ? 'up' : ecTrend > 0.05 ? 'down' : 'stable',
    energyKWhPerMonth: Number((energyPerUnit * planting.totalUnits * 4.33).toFixed(2)),
    energyTrend: 'stable',
    topRisk: moistureAlertPct > fertAlertPct ? 'Moisture demand may rise' : 'Nutrient demand may rise',
    confidence: histData?.totalReadings >= 50 ? 'medium' : 'low',
    insight: 'Estimated from Firebase history and crop defaults.',
    source: `Firebase history (${histData?.totalReadings || 0} readings)`,
  };
}

// Builds AI prompt from real historical sensor stats + new planting parameters.
// Now includes temp/humid/pH context and richer analysis tasks.
async function _predictResourcesWithAI(sp, planting, histData) {
  if (!histData || !histData.totalReadings) {
    throw new Error('Sensor history is required for resource prediction');
  }

  const waterStats = histData ? _seriesStats(histData.water) : null;
  const ecStats    = histData ? _seriesStats(histData.ec)    : null;

  const currentWaterLPerUnit = sp.waterLpR / Math.max(1, planting.baseUnitsPerRow);
  const currentFertMLPerUnit = sp.fertMLpR / Math.max(1, planting.baseUnitsPerRow);

  const avgOf = arr => arr && arr.length
    ? (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1)
    : 'N/A';
  const trendLabel = delta => delta > 1 ? 'rising' : delta < -1 ? 'falling' : 'stable';

  const histSummary = [
        `Farm sensor history (${histData.totalReadings} readings, source: ${histData.usedQuery}):`,
        waterStats
          ? `- Soil moisture: avg ${waterStats.avg.toFixed(1)}%, median ${waterStats.median.toFixed(1)}%, ` +
            `min ${waterStats.min.toFixed(1)}%, max ${waterStats.max.toFixed(1)}%, ` +
            `WATER_ON triggered ${waterStats.alertPct}% of the time, trend ${trendLabel(waterStats.trend)} (delta ${waterStats.trend.toFixed(1)}%)`
          : '- Soil moisture: no data',
        ecStats
          ? `- EC / nutrient: avg ${ecStats.avg.toFixed(2)} mS/cm, ` +
            `FERT_ALERT triggered ${ecStats.alertPct}% of the time, trend ${trendLabel(ecStats.trend)}`
          : '- EC / nutrient: no data',
        histData.temp?.length
          ? `- Temperature: avg ${avgOf(histData.temp)}C (${histData.temp.length} readings)`
          : '- Temperature: no data',
        histData.humid?.length
          ? `- Humidity: avg ${avgOf(histData.humid)}%`
          : '- Humidity: no data',
        histData.ph?.length
          ? `- pH: avg ${avgOf(histData.ph)} (${histData.ph.length} readings)`
          : '- pH: no data',
      ].join('\n');

  const prompt =
    `You are a precision vertical farming resource analyst for a Malaysian IoT farm.\n` +
    `Analyse the real sensor history and predict resource needs for a new planting.\n\n` +
    `=== CURRENT FARM SENSOR HISTORY ===\n` +
    histSummary + `\n\n` +
    `=== NEW PLANTING TO EVALUATE ===\n` +
    `Species: ${sp.name}\n` +
    `Rows to add: ${planting.rows}\n` +
    `Units per row: ${planting.unitsPerRow}\n` +
    `Total new units: ${planting.totalUnits}\n` +
    `Species base water need: ${currentWaterLPerUnit.toFixed(1)} L per unit per week\n` +
    `Species base fertilizer need: ${currentFertMLPerUnit.toFixed(1)} mL per unit per week\n` +
    `Species grow days: ${sp.growDays}\n\n` +
    `=== YOUR TASKS ===\n` +
    `1. WATER: Estimate the ADDITIONAL weekly water (litres) for this new planting.\n` +
    `   - If soil moisture trend is falling or WATER_ON alerts are frequent, increase estimate.\n` +
    `   - If moisture is stable and alerts are rare, use the species base as-is.\n` +
    `2. FERTILIZER: Estimate the ADDITIONAL weekly fertilizer (mL) for this new planting.\n` +
    `   - If EC trend is falling or FERT_ALERTs are frequent, increase estimate.\n` +
    `   - Consider whether pH is within optimal range for ${sp.name} (typical 5.5-6.5).\n` +
    `3. ENERGY: Estimate the ADDITIONAL monthly lighting energy (kWh) for this new planting.\n` +
    `4. RISK: Identify the single biggest resource risk for adding ${sp.name} to this farm.\n` +
    `5. CONFIDENCE: Rate your confidence as high / medium / low based on data quality.\n` +
    `6. INSIGHT: One actionable sentence (max 20 words) the farmer should know.\n\n` +
    `Return ONLY a JSON object, no markdown, no preamble:\n` +
    `{\n` +
    `  "waterLitresPerWeek": <number>,\n` +
    `  "waterTrend": "up" | "stable" | "down",\n` +
    `  "fertMLPerWeek": <number>,\n` +
    `  "fertTrend": "up" | "stable" | "down",\n` +
    `  "energyKWhPerMonth": <number>,\n` +
    `  "energyTrend": "up" | "stable" | "down",\n` +
    `  "topRisk": "<string, max 15 words>",\n` +
    `  "confidence": "high" | "medium" | "low",\n` +
    `  "insight": "<string, max 20 words>"\n` +
    `}`;

  const response = await fetch(`${API_BASE}/api/ai/predict-resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      sensorFilters: _sensorFiltersFromHistory(histData),
    }),
  });

  if (!response.ok) throw new Error('Resource forecast request failed');
  const data = await response.json();
  const raw = data.text ?? data.content?.map(b => b.text || '').join('') ?? '';
  const clean = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);
  if (parsed.error) {
    throw new Error(parsed.insight || 'Resource forecast unavailable');
  }
  const waterLitresPerWeek = Number(parsed.waterLitresPerWeek);
  const fertMLPerWeek = Number(parsed.fertMLPerWeek);
  const energyKWhPerMonth = Number(parsed.energyKWhPerMonth);
  const fallbackEnergy = ((sp.energyKWhpR || 0) / Math.max(1, planting.baseUnitsPerRow)) * planting.totalUnits * 4.33;
  if (!Number.isFinite(waterLitresPerWeek) || !Number.isFinite(fertMLPerWeek)) {
    throw new Error('Resource forecast missing water or fertilizer number');
  }

  return {
    waterLitresPerWeek,
    waterTrend:   parsed.waterTrend   || 'stable',
    fertMLPerWeek,
    fertTrend:    parsed.fertTrend    || 'stable',
    energyKWhPerMonth: Number((Number.isFinite(energyKWhPerMonth) ? energyKWhPerMonth : fallbackEnergy).toFixed(2)),
    energyTrend: parsed.energyTrend || 'stable',
    topRisk:      parsed.topRisk      || '',
    confidence:   parsed.confidence   || 'low',
    insight:      parsed.insight      || '',
    source: `Sensor forecast (${histData.totalReadings} Firebase readings)`,
  };
}

// Orchestrates history fetch + AI prediction, then re-renders the impact grid.
async function _loadAndRenderResourcePrediction(sp, planting) {
  const cacheKey = `${sp.id}|${planting.rows}|${planting.unitsPerRow}|${_activeFarmId() || ''}`;
  const backendPrediction = _predictionFromBackendDemand(sp, planting, _npServerData(sp));
  if (backendPrediction) {
    _resourcePrediction = backendPrediction;
    _resourcePredictionKey = cacheKey;
    _renderResourceDelta(sp, planting, backendPrediction);
    return;
  }
  if (cacheKey === _resourcePredictionKey && _resourcePrediction) {
    _renderResourceDelta(sp, planting, _resourcePrediction);
    return;
  }

  // Show loading state immediately
  _renderResourceDelta(sp, planting, null);

  try {
    const histData = _historicalResourceData || await _fetchHistoricalReadings();
    if (!histData || !histData.totalReadings) {
      _resourcePrediction = {
        error: true,
        confidence: 'low',
        insight: 'Connect farm sensor history to calculate resource demand from live operating data.',
        source: '',
      };
      _resourcePredictionKey = cacheKey;
      _renderResourceDelta(sp, planting, _resourcePrediction);
      return;
    }
    const prediction = await _predictResourcesWithAI(sp, planting, histData);
    _resourcePrediction = prediction;
    _resourcePredictionKey = cacheKey;
    _renderResourceDelta(sp, planting, prediction);
  } catch (err) {
    const histData = _historicalResourceData;
    _resourcePrediction = histData?.totalReadings
      ? _predictResourcesFromHistory(sp, planting, histData)
      : {
          error: true,
          confidence: 'low',
          insight: 'Resource forecast is unavailable until the farm has sensor history.',
          source: '',
        };
    _resourcePredictionKey = cacheKey;
    _renderResourceDelta(sp, planting, _resourcePrediction);
  }
}

function _npServerData(sp = _npSpecies) {
  return _npAiAnalysis?.species === sp.id ? _npAiAnalysis.data : null;
}

function _predictionFromBackendDemand(sp, planting, data) {
  const demand = data?.demand;
  if (!demand) return null;
  return {
    waterLitresPerWeek: Number((Number(demand.waterLPerDay || 0) * 7).toFixed(1)),
    waterTrend: 'stable',
    fertMLPerWeek: Number(demand.fertMLPerWeek || 0),
    fertTrend: 'stable',
    energyKWhPerMonth: Number(demand.lightKWhPerMonth || 0),
    energyTrend: 'stable',
    topRisk: data.warnings?.[0] || '',
    confidence: data.analysis?.source === 'ai' ? 'medium' : 'low',
    insight: data.cropResourceProfile?.sourceBasis
      ? `Crop-specific resource profile: ${data.cropResourceProfile.sourceBasis}`
      : 'Crop-specific resource needs from suitability analysis.',
    source: data.resourceLinks?.length ? 'Crop profile + Firebase history' : 'Crop defaults + Firebase history',
  };
}

function _fmtSensorValue(value, suffix = '') {
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toFixed(Math.abs(n) >= 100 ? 0 : 1)}${suffix}` : 'missing';
}

function _renderSensorProofCard() {
  const el = document.getElementById('pro-sensor-proof');
  if (!el) return;

  const latest = _sensorSnapshot;
  const farmLevel = _farmLevelSensorSnapshot;
  const hist = _historicalResourceData;
  const idText = latest
    ? [latest.deviceId && `deviceId=${latest.deviceId}`, latest.farmId && `farmId=${latest.farmId}`, latest.zoneId && `zoneId=${latest.zoneId}`]
      .filter(Boolean)
      .join(' · ') || 'Firebase latest reading'
    : _sensorIdentifierSummary();

  const status = latest || hist
    ? 'Firebase sensorReadings connected'
    : 'No Firebase sensor reading loaded';

  el.innerHTML = `
    <div class="pro-sensor-proof-title">Firebase sensor proof</div>
    <div><strong>${_esc(status)}</strong></div>
    <div style="margin-top:3px;color:#475569;">${_esc(idText)}</div>
    <div style="margin-top:3px;color:#64748b;">
      Latest: ${_esc(latest?.createdAt ? new Date(latest.createdAt).toLocaleString() : 'not available')}
      ${farmLevel ? ` · Farm level: ${_esc(farmLevel.deviceId || 'loaded')}` : ' · Farm level: not loaded'}
      ${hist ? ` · History: ${hist.totalReadings} readings via ${_esc(hist.usedQuery)}` : ' · History: not loaded'}
    </div>
    <div class="pro-sensor-proof-grid">
      <div class="pro-sensor-proof-stat"><b>${_esc(_fmtSensorValue(latest?.temp, '°C'))}</b><span>temperature</span></div>
      <div class="pro-sensor-proof-stat"><b>${_esc(_fmtSensorValue(latest?.humid, '%'))}</b><span>humidity</span></div>
      <div class="pro-sensor-proof-stat"><b>${_esc(_fmtSensorValue(latest?.soilMoisture, '%'))}</b><span>soil moisture</span></div>
      <div class="pro-sensor-proof-stat"><b>${_esc(latest?.soilRaw !== undefined ? `${latest.soilRaw} ADC` : 'missing')}</b><span>soil raw unit</span></div>
      <div class="pro-sensor-proof-stat"><b>${_esc(_fmtSensorValue(latest?.light, '%'))}</b><span>light</span></div>
      <div class="pro-sensor-proof-stat"><b>${_esc(_fmtSensorValue(latest?.nutrient, '%'))}</b><span>nutrient</span></div>
    </div>
    ${hist?.usedQuery?.includes('farm_001') || latest?.deviceId === 'farm_001'
      ? '<div style="margin-top:8px;color:#b45309;"><strong>Warning:</strong> this is the demo device farm_001, not a real selected farm device.</div>'
      : ''}
  `;
}

// Renders only water + fertilizer delta cards based on AI prediction.
function _renderResourceDelta(sp, planting, prediction) {
  const ig = document.getElementById('pro-impact-grid');
  if (!ig) return;

  if (!prediction) {
    // Loading state
    ig.innerHTML = `
        <div class="pro-resource-loading" style="grid-column:1/-1;padding:20px 12px;text-align:center;color:#64748b;font-size:12px;font-style:italic;">
          <div style="font-size:22px;margin-bottom:6px;">⏳</div>
        Fetching sensor history and preparing forecast…
      </div>`;
    return;
  }

  if (prediction.error) {
    ig.innerHTML = `
      <div class="pro-resource-loading" style="grid-column:1/-1;padding:16px 12px;color:#9a3412;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:11px;line-height:1.45;">
        <strong>Resource forecast needs more sensor history.</strong><br>
        ${_esc(prediction.insight)}
        ${prediction.source ? `<span style="display:block;margin-top:6px;color:#c2410c;font-size:9px;">${_esc(prediction.source)}</span>` : ''}
      </div>`;
    return;
  }

  const CONF_BADGE = {
    high:   { cls: 'pro-badge-green', label: 'HIGH CONFIDENCE' },
    medium: { cls: 'pro-badge-amber', label: 'MEDIUM CONFIDENCE' },
    low:    { cls: 'pro-badge-gray',  label: 'LOW CONFIDENCE'  },
  };
  const badge = CONF_BADGE[prediction.confidence] || CONF_BADGE.low;

  const waterRM = (prediction.waterLitresPerWeek * 4.33 * RATES.waterRM).toFixed(2);
  const fertRM  = (prediction.fertMLPerWeek * 4.33 * RATES.fertRM).toFixed(2);
  const energyKWh = Number(prediction.energyKWhPerMonth || 0);
  const energyRM = (energyKWh * RATES.energyRM).toFixed(2);
  const trendNote = (label, trend) => trend && trend !== 'stable'
    ? `<div style="font-size:8px;color:#64748b;margin-top:3px;">Firebase trend suggests ${label} may ${trend === 'up' ? 'increase' : 'ease'}.</div>`
    : '';

  const riskHtml = prediction.topRisk
    ? `<div style="grid-column:1/-1;margin-top:4px;padding:8px 10px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:10px;color:#9a3412;display:flex;align-items:flex-start;gap:7px;">
        <span style="flex-shrink:0;">⚠️</span>
        <span><strong>Top risk:</strong> ${_esc(prediction.topRisk)}</span>
       </div>`
    : '';

  ig.innerHTML = `
    <div class="pro-impact-card up" style="min-width:0;">
      <div class="pro-impact-icon">💧</div>
      <div class="pro-impact-name">Additional water needed</div>
      <div class="pro-impact-val up">+${prediction.waterLitresPerWeek.toFixed(1)} L/week</div>
      <div style="font-size:9px;color:#64748b;margin-top:4px;">≈ RM ${waterRM}/mo</div>
      ${trendNote('water demand', prediction.waterTrend)}
    </div>
    <div class="pro-impact-card up" style="min-width:0;">
      <div class="pro-impact-icon">🧪</div>
      <div class="pro-impact-name">Additional fertilizer needed</div>
      <div class="pro-impact-val up">+${prediction.fertMLPerWeek.toFixed(0)} mL/week</div>
      <div style="font-size:9px;color:#64748b;margin-top:4px;">≈ RM ${fertRM}/mo</div>
      ${trendNote('fertilizer demand', prediction.fertTrend)}
    </div>
    <div class="pro-impact-card up" style="min-width:0;">
      <div class="pro-impact-icon">⚡</div>
      <div class="pro-impact-name">Additional light energy</div>
      <div class="pro-impact-val up">+${energyKWh.toFixed(2)} kWh/mo</div>
      <div style="font-size:9px;color:#64748b;margin-top:4px;">≈ RM ${energyRM}/mo</div>
      ${trendNote('energy demand', prediction.energyTrend)}
    </div>
    ${riskHtml}
    <div style="grid-column:1/-1;margin-top:4px;padding:8px 10px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;font-size:10px;color:#475569;line-height:1.5;display:flex;align-items:flex-start;gap:8px;">
      <span style="flex-shrink:0;">📊</span>
      <span>
        ${_esc(prediction.insight)}
        <span class="pro-badge ${badge.cls}" style="margin-left:4px;vertical-align:middle;">${badge.label}</span>
        <span style="margin-left:4px;color:#94a3b8;font-size:9px;">${_esc(prediction.source)}</span>
      </span>
    </div>`;
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
    .pro-eco-formula{font-size:10px;color:#64748b;line-height:1.45;margin-top:10px;}
    .pro-sensor-proof{margin-top:10px;border:1px solid #bfdbfe;background:#eff6ff;border-radius:10px;padding:10px 12px;color:#1e3a8a;font-size:10px;line-height:1.45;}
    .pro-sensor-proof-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#1d4ed8;margin-bottom:6px;}
    .pro-sensor-proof-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:6px;margin-top:8px;}
    .pro-sensor-proof-stat{background:rgba(255,255,255,.72);border:1px solid rgba(147,197,253,.7);border-radius:8px;padding:7px;}
    .pro-sensor-proof-stat b{display:block;font-size:12px;color:#0f172a;}
    .pro-sensor-proof-stat span{display:block;font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-top:2px;}
    .pro-qty-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
    .pro-qty-row label{font-size:10px;color:#64748b;min-width:80px;letter-spacing:.04em;}
    .pro-qty-ctrl{display:flex;align-items:center;gap:8px;}
    .pro-qty-btn{width:28px;height:28px;border:1px solid #e5e7eb;border-radius:6px;background:#f8fafc;color:#17231b;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
    .pro-qty-btn:hover{border-color:#22c55e;color:#166534;}
    .pro-qty-num{width:40px;text-align:center;font-size:14px;font-weight:700;color:#047857;}
    .pro-qty-note{font-size:10px;color:#64748b;margin-top:-4px;margin-bottom:12px;}
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
          <div class="pro-qty-row">
            <label>Units / row</label>
            <div class="pro-qty-ctrl">
              <button class="pro-qty-btn" id="pro-unit-dec">−</button>
              <span class="pro-qty-num" id="pro-unit-disp">1</span>
              <button class="pro-qty-btn" id="pro-unit-inc">+</button>
            </div>
          </div>
          <div class="pro-qty-note" id="pro-qty-total">10 total units</div>
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
            <div class="pro-eco-formula" id="pro-eco-formula"></div>
          </div>
          <div class="pro-sensor-proof" id="pro-sensor-proof"></div>
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
  _npUnitsPerRow = 1;
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
  _npUnitsPerRow = _unitsPerRowForFarm(_getActiveFarm(_allFarms));
  _resourcePrediction = null;
  _resourcePredictionKey = '';
  _historicalResourceData = null;
  _renderFarmChips();

  _bindTabs();
  _bindForecast();
  _bindNewPlant();

  _updateForecast();
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
    _npUnitsPerRow = _unitsPerRowForFarm(_getActiveFarm(_allFarms));
    _renderFarmChips();
  }

  await _refreshSensorSnapshot();
  await _loadMarketPrices();
  _fetchHistoricalReadings().catch(() => {}); // prefetch; errors are silent
}

async function _refreshSensorSnapshot() {
  _sensorSnapshot = await fetchSensorData(_getActiveFarm(_allFarms));
  _farmLevelSensorSnapshot = await fetchFarmLevelSensorData(_getActiveFarm(_allFarms));
  _renderSensorProofCard();
  _updateForecast();
  _npRender();
}

async function _loadMarketPrices() {
  const crops = [..._farmCrops, ...NP_SPECIES_DB, _npSpecies]
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
  const planting = _npPlanting();
  const scored = NP_SPECIES_DB.map(sp => {
    const market = _marketForCrop(sp);
    const yieldKgPerUnit = sp.yieldKgPerRow / planting.baseUnitsPerRow;
    const waterLPerUnit = sp.waterLpR / planting.baseUnitsPerRow;
    const fertMLPerUnit = sp.fertMLpR / planting.baseUnitsPerRow;
    const cycles90 = 90 / Math.max(1, sp.growDays);
    const unitsPerRow = planting.unitsPerRow;
    const revenue90 = yieldKgPerUnit * unitsPerRow * sensorFactor * market.bestPrice * cycles90;
    const weeks90 = 90 / 7;
    const cost90 = (waterLPerUnit * unitsPerRow * RATES.waterRM * weeks90)
      + (fertMLPerUnit * unitsPerRow * RATES.fertRM * weeks90);
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
    Estimated ${_fmtRM(best.profit90, 0)} profit per row (${_npPlanting().unitsPerRow} units) over 90 days after live sensor adjustment.
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
  _marketStatus = { loading: true, error: null, generatedAt: null };
  _loadMarketPrices().then(() => {
    _npRenderSuggestions();
    _renderNpEconomics(_npSpecies, _npPlanting());
  }).catch(() => {});
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
      _npUnitsPerRow = _unitsPerRowForFarm(selected);
      _resourcePrediction = null;
      _resourcePredictionKey = '';
      _historicalResourceData = null;
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

// origin = farm.createdAt (Day 0 = planting date from Firebase).
function _productionSeries(crops, days, sensorFactor, origin) {
  const base = new Date(origin || Date.now());
  base.setHours(0, 0, 0, 0);

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

    // Day 1 = farm.createdAt; Day N = base + (N-1) calendar days
    const actualDate = new Date(base.getTime() + (day - 1) * 86400000);

    return {
      day,
      actualDate,
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
  // Farm.createdAt (Firebase) = Day 0; falls back to today if absent
  const _farm = _getActiveFarm(_allFarms);
  const _rawOrig = _farm && (_farm.createdAt || _farm.created_at);
  const _farmOrigin = _rawOrig ? new Date(_rawOrig) : new Date();
  if (isNaN(_farmOrigin.getTime())) _farmOrigin.setTime(Date.now());
  _farmOrigin.setHours(0, 0, 0, 0);
  const production = _productionSeries(crops, days, sensorFactor, _farmOrigin);
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

    const fmtShort = d => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const fmtFull  = d => d.toLocaleDateString(undefined,
      { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const labels = series.map(item => fmtShort(item.actualDate));
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
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: ctx => {
                const item = series[ctx[0].dataIndex];
                return fmtFull(item.actualDate) + ' (Day ' + item.day + ')';
              },
              label: ctx => {
                const item = series[ctx.dataIndex];
                const lines = ['Cumulative: ' + item.cumulativeKg.toFixed(2) + ' kg'];
                if (item.dailyKg > 0)
                  lines.push('Harvest: +' + item.dailyKg.toFixed(2) + ' kg');
                return lines;
              },
            },
          },
        },
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
              maxRotation: 35,
              minRotation: 0,
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
    _npQty = Math.max(1, _npQty - 1);
    document.getElementById('pro-qty-disp').textContent = _npQty;
    _npRender();
  });

  document.getElementById('pro-qty-inc')?.addEventListener('click', () => {
    _npQty = Math.min(500, _npQty + 1);
    document.getElementById('pro-qty-disp').textContent = _npQty;
    _npRender();
  });

  document.getElementById('pro-unit-dec')?.addEventListener('click', () => {
    _npUnitsPerRow = Math.max(1, _npUnitsPerRow - 1);
    document.getElementById('pro-unit-disp').textContent = _npUnitsPerRow;
    _npRender();
  });

  document.getElementById('pro-unit-inc')?.addEventListener('click', () => {
    _npUnitsPerRow = Math.min(50, _npUnitsPerRow + 1);
    document.getElementById('pro-unit-disp').textContent = _npUnitsPerRow;
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
      <span>Assess "${_esc(rawQ)}"</span>
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

function _renderNpEconomics(sp, planting) {
  const market = _marketForCrop(sp);
  const sensorFactor = _yieldMultiplier();
  const serverData = _npServerData(sp);
  const demand = serverData?.demand;
  const resourceProfile = serverData?.cropResourceProfile || demand?.cropResourceProfile || null;
  const fallbackYieldKgPerUnit = sp.yieldKgPerRow / planting.baseUnitsPerRow;
  const profileYieldKgPerPlant = Number(resourceProfile?.yieldKgPerPlant);
  const profileHarvests = Number(resourceProfile?.harvestsPerCycle);
  const safeProfileHarvests = Number.isFinite(profileHarvests) && profileHarvests > 0
    ? Math.round(profileHarvests)
    : 1;
  const profileCycleYieldKgPerUnit = Number.isFinite(profileYieldKgPerPlant) && profileYieldKgPerPlant > 0
    ? profileYieldKgPerPlant * safeProfileHarvests
    : null;
  const maxProfileYieldKgPerUnit = Math.max(2, fallbackYieldKgPerUnit * 2);
  const useProfileYield = Boolean(sp.custom
    && profileCycleYieldKgPerUnit
    && profileCycleYieldKgPerUnit <= maxProfileYieldKgPerUnit);
  // Known crop yields in NP_SPECIES_DB are already per row for the sell window.
  // Do not multiply them by harvestsPerCycle again; tomato 2 kg x 8 harvests
  // produced unrealistic 300 kg+ projections for a small rack.
  const yieldKgPerUnit = useProfileYield
    ? profileCycleYieldKgPerUnit
    : fallbackYieldKgPerUnit;
  // cycleGrowDays = full grow cycle used for cost-period and harvest-date projection.
  // Prefer the species default; only fall back to AI's estimatedHarvestDays if no
  // species value is available, because estimatedHarvestDays can mean "days to first
  // pick" which is shorter than the full cycle and would understate costToHarvest.
  const cycleGrowDays = Number(sp.growDays || serverData?.analysis?.estimatedHarvestDays || 60);
  const growDays = cycleGrowDays; // alias kept for readability below
  const estYieldKgRaw = yieldKgPerUnit * planting.totalUnits * sensorFactor;
  const estValueRaw = estYieldKgRaw * market.bestPrice;
  const weeksPerMonth = 4.33;
  const waterLPerUnit = sp.waterLpR / planting.baseUnitsPerRow;
  const fertMLPerUnit = sp.fertMLpR / planting.baseUnitsPerRow;
  // energyKWhpR is already a per-month value (not per-week), so do NOT multiply
  // by weeksPerMonth — doing so inflated energy cost by ~4.33×.
  const energyKWhPerUnit = (sp.energyKWhpR || 0) / planting.baseUnitsPerRow;
  // Compute fallback costs first so they can be reused in both extraCostPerMoRaw
  // and the individual breakdown variables — this keeps the formula text consistent
  // with the displayed total (Bug 4 fix).
  const fallbackWaterCost  = planting.totalUnits * waterLPerUnit  * RATES.waterRM  * weeksPerMonth;
  const fallbackFertCost   = planting.totalUnits * fertMLPerUnit  * RATES.fertRM   * weeksPerMonth;
  const fallbackEnergyCost = planting.totalUnits * energyKWhPerUnit * RATES.energyRM; // monthly, no weeksPerMonth
  const extraCostPerMoRaw = demand
    ? Number(demand.totalMonthlyCostRM || 0)
    : fallbackWaterCost + fallbackFertCost + fallbackEnergyCost;
  const waterCostMo  = Number(demand?.waterCostPerMonth  ?? fallbackWaterCost);
  const fertCostMo   = Number(demand?.fertCostPerMonth   ?? fallbackFertCost);
  const energyCostMo = Number(demand?.lightCostPerMonth  ?? fallbackEnergyCost);
  const costToHarvest = extraCostPerMoRaw * (growDays / 30);
  const estProfit = estValueRaw - costToHarvest;
  const harvestDate = new Date(Date.now() + growDays * 24 * 60 * 60 * 1000);

  const yieldEl = document.getElementById('pro-eco-yield');
  const valueEl = document.getElementById('pro-eco-value');
  const costEl  = document.getElementById('pro-eco-cost');
  const profitEl = document.getElementById('pro-eco-profit');
  const harvestEl = document.getElementById('pro-eco-harvest-date');
  const formulaEl = document.getElementById('pro-eco-formula');
  if (yieldEl) yieldEl.textContent = estYieldKgRaw.toFixed(1) + ' kg';
  if (valueEl) valueEl.textContent = 'RM ' + estValueRaw.toFixed(0);
  if (costEl)  costEl.textContent  = 'RM ' + extraCostPerMoRaw.toFixed(2);
  if (profitEl) profitEl.textContent = _fmtRM(estProfit, 0);
  if (harvestEl) harvestEl.textContent = harvestDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (formulaEl) {
    const sensorFactorText = _hasFirebaseSensorProof()
      ? `${Math.round(sensorFactor * 100)}% Firebase sensor factor`
      : 'no Firebase sensor factor applied';
    const costText = demand
      ? `Extra cost/mo = water RM ${waterCostMo.toFixed(2)} + fertilizer RM ${fertCostMo.toFixed(2)} + light energy RM ${energyCostMo.toFixed(2)} = RM ${extraCostPerMoRaw.toFixed(2)}.`
      : `Extra cost/mo = fallback water RM ${waterCostMo.toFixed(2)} + fertilizer RM ${fertCostMo.toFixed(2)} + light energy RM ${energyCostMo.toFixed(2)} = RM ${extraCostPerMoRaw.toFixed(2)}.`;
    const yieldBasisText = useProfileYield
      ? `${yieldKgPerUnit.toFixed(2)} kg/plant/cycle from crop resource profile`
      : `${yieldKgPerUnit.toFixed(2)} kg/plant/cycle from SeedDown crop table`;
    formulaEl.textContent = `Yield = ${planting.totalUnits} units x ${yieldBasisText} x ${sensorFactorText}. Market value = yield x ${_fmtRM(market.bestPrice, 2)}/kg via ${market.bestLabel}. ${costText} Profit = market value RM ${estValueRaw.toFixed(0)} - harvest-period cost RM ${costToHarvest.toFixed(2)}.`;
  }
}

function _resourceLinksHtml(links = []) {
  return `
    <div class="pro-source-row" style="margin-top:8px;">
      ${links.map(link => `
        <a class="pro-source-link" href="${_esc(link.url)}" target="_blank" rel="noopener noreferrer">
          ${_esc(link.label)}
        </a>`).join('')}
    </div>`;
}

function _advisorCalcHtml(plan, historicalStats) {
  const calc = plan?.calculation;
  const moisture = plan?.moisture;
  if (!calc || !moisture) return '';
  const unit = moisture.unit || '%';
  const adjustment = Number(calc.adjustmentPctPoints || 0);
  const adjustmentUnit = unit === '%' ? 'percentage points' : `${unit} points`;
  const rawText = calc.soilRaw !== undefined
    ? ` Firebase soilRaw: ${calc.soilRaw} ${calc.sensorRawUnit || 'ADC count'}.`
    : '';
  const adjustmentText = Math.abs(adjustment) < 0.05
    ? `0 ${adjustmentUnit}`
    : `${adjustment > 0 ? '+' : ''}${adjustment.toFixed(1)} ${adjustmentUnit}`;
  const sourceLinks = (plan.sources || []).slice(0, 3);

  // Historical stats panel — shown only when Firebase returned real history
  const TREND_ARROW = { rising: '▲', falling: '▼', stable: '●' };
  const histHtml = historicalStats ? `
    <div class="pro-ai-calc" style="margin-top:8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:10px;">
      <div class="pro-ai-calc-title" style="color:#166534;">📊 Based on ${historicalStats.totalReadings} real Firebase readings</div>
      <div class="pro-ai-calc-grid" style="grid-template-columns:repeat(auto-fit,minmax(100px,1fr));">
        ${historicalStats.moisture ? `
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${historicalStats.moisture.avg}%</div>
          <div class="pro-ai-calc-lbl">Avg moisture ${TREND_ARROW[historicalStats.moisture.trend] || '●'}</div>
        </div>
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val" style="color:${historicalStats.moisture.waterOnAlertPct > 30 ? '#dc2626' : '#047857'}">${historicalStats.moisture.waterOnAlertPct}%</div>
          <div class="pro-ai-calc-lbl">WATER_ON alerts</div>
        </div>` : ''}
        ${historicalStats.ec ? `
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${historicalStats.ec.avg} mS</div>
          <div class="pro-ai-calc-lbl">Avg EC ${TREND_ARROW[historicalStats.ec.trend] || '●'}</div>
        </div>
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val" style="color:${historicalStats.ec.fertAlertPct > 30 ? '#dc2626' : '#047857'}">${historicalStats.ec.fertAlertPct}%</div>
          <div class="pro-ai-calc-lbl">FERT_ALERT</div>
        </div>` : ''}
        ${historicalStats.temp ? `
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${historicalStats.temp.avg}°C</div>
          <div class="pro-ai-calc-lbl">Avg temp ${TREND_ARROW[historicalStats.temp.trend] || '●'}</div>
        </div>` : ''}
        ${historicalStats.ph ? `
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${historicalStats.ph.avg}</div>
          <div class="pro-ai-calc-lbl">Avg pH ${TREND_ARROW[historicalStats.ph.trend] || '●'}</div>
        </div>` : ''}
      </div>
    </div>` : '';

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
        ${_esc(calc.moistureFormula)}. ${_esc(calc.normalizedMoistureFormula || '')}${_esc(rawText)}
        Source: ${_esc(calc.moistureSource || 'sensor snapshot')}.
        ${sourceLinks.length ? `<div class="pro-source-row" style="margin-top:7px;">${sourceLinks.map(link => `
          <a class="pro-source-link" href="${_esc(link.url)}" target="_blank" rel="noopener noreferrer">${_esc(link.label)}</a>
        `).join('')}</div>` : ''}
      </div>
    </div>
    ${histHtml}`;
}

function _npRender() {
  const sp      = _npSpecies;
  const farm    = _getActiveFarm(_allFarms);
  const zones   = _buildFarmZones(farm);
  const planting = _npPlanting();
  const availableUnits = zones.reduce((sum, z) => sum + (z.availableRows || 0), 0);
  const availableRows = Math.floor(availableUnits / planting.unitsPerRow);
  const allFull = zones.length > 0 && availableUnits <= 0;
  const canPlantNow = availableUnits >= planting.totalUnits;
  const nextPlantDays = zones.filter(z => z.harvIn > 0).sort((a, b) => a.harvIn - b.harvIn)[0]?.harvIn || sp.growDays;
  const market  = _marketForCrop(sp);
  const qtyDisp = document.getElementById('pro-qty-disp');
  const unitDisp = document.getElementById('pro-unit-disp');
  const totalDisp = document.getElementById('pro-qty-total');
  if (qtyDisp) qtyDisp.textContent = planting.rows;
  if (unitDisp) unitDisp.textContent = planting.unitsPerRow;
  if (totalDisp) totalDisp.textContent = `${planting.totalUnits} total units (${planting.rows} rows × ${planting.unitsPerRow} units/row)`;
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
              ${canPlantNow ? `Ready to plant ${planting.rows} rows of ${sp.name}` : `Only ${availableUnits} units free now`}
            </div>
            <div style="font-size:10px;color:#64748b;margin-top:3px;">
              ${canPlantNow ? `This uses ${planting.totalUnits} units; up to ${availableRows} rows fit at ${planting.unitsPerRow} units/row.` : `Plant ${Math.min(planting.rows, availableRows)} rows now at ${planting.unitsPerRow} units/row, or wait ~${nextPlantDays} days for more space.`}
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
              <div class="pro-zone-name">${z.emoji} ${z.crop} <span style="font-size:10px;color:#94a3b8;">· ${z.rows}/${z.capacity} units</span></div>
              <div class="pro-zone-meta">${z.availableRows} units free · ${z.harvIn ? `est. harvest in ${z.harvIn} days` : 'empty now'}</div>
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

  // Impact grid — water and fertilizer predicted from Firebase history + AI.
  // Invalidate cache when species or planting changes.
  const newPredKey = `${sp.id}|${planting.rows}|${planting.unitsPerRow}|${_activeFarmId() || ''}`;
  if (newPredKey !== _resourcePredictionKey) {
    _resourcePrediction = null;
  }
  _loadAndRenderResourcePrediction(sp, planting);

  _renderNpEconomics(sp, planting);
  _renderSensorProofCard();

  // Fetch real AI advisor response
  const advisorKey = `${sp.id}|${planting.rows}|${planting.unitsPerRow}|${planting.totalUnits}|${_activeFarmId() || ''}|${_sensorSnapshot?.createdAt || ''}|${_farmLevelSensorSnapshot?.createdAt || ''}|${_sensorSnapshot?.temp}|${_sensorSnapshot?.humid}|${_sensorSnapshot?.water}|${_sensorSnapshot?.soilRaw}|${_farmLevelSensorSnapshot?.waterDistanceCm}|${_farmLevelSensorSnapshot?.co2Ppm}`;
  if (advisorKey !== _npAdvisorKey) {
    _npAdvisorKey = advisorKey;
    _fetchNpAdvisor(sp, planting, zones);
  }
}

// Calls the backend AI route with real sensor data and farm context.
// Sends soilRaw + calibration so the backend can produce a calibrated
// moisture reading instead of guessing from a raw ADC value.
async function _fetchNpAdvisor(sp, planting, zones) {
  const aiEl = document.getElementById('pro-np-ai');
  const aiBox = document.getElementById('pro-np-ai-box');
  if (!aiEl) return;
  if (aiBox) aiBox.className = 'pro-ai-inline';
  aiEl.className   = 'pro-ai-loading';
  aiEl.textContent = `Analysing ${planting.rows} rows (${planting.totalUnits} units) of ${sp.name} against your current farm conditions…`;

  const farm = _getActiveFarm(_allFarms);
  const sensors = _sensorSnapshot || await fetchSensorData(farm);
  const farmLevelSensors = _farmLevelSensorSnapshot || await fetchFarmLevelSensorData(farm);
  if (farmLevelSensors && !_farmLevelSensorSnapshot) {
    _farmLevelSensorSnapshot = farmLevelSensors;
    _renderSensorProofCard();
  }
  if (sensors && !_sensorSnapshot) {
    _sensorSnapshot = sensors;
    _renderSensorProofCard();
  }
  if (!_hasFirebaseSensorProof() && !sensors && !farmLevelSensors) {
    _npAiAnalysis   = { species: sp.id, data: null };
    _npAiUnsuitable = false;
    if (aiBox) aiBox.className = 'pro-ai-inline warn';
    aiEl.className = '';
    aiEl.textContent = `No sensor reading found for ${_sensorIdentifierSummary(farm)}. Connect this farm to live sensor data before running crop suitability.`;
    _renderSensorProofCard();
    _applyNpSuitabilityVisibility(sp);
    return;
  }

  // Forward the farm's calibration constants if stored in AppState/localStorage.
  // The backend uses these to convert soilRaw → calibrated moisture %.
  const calibration = farm?.sensorCalibration || AppState.currentFarm?.sensorCalibration || {};
  const baseSensorFilters = _sensorFilterPayloadForFarm(farm);
  const farmLevelDeviceId = farmLevelSensors?.deviceId || _farmLevelDeviceId(farm);
  const sensorFilters = {
    ...baseSensorFilters,
    deviceId: sensors?.deviceId && !_isDemoSensorDevice(sensors.deviceId) ? sensors.deviceId : baseSensorFilters.deviceId,
    zoneId:   sensors?.zoneId   || baseSensorFilters.zoneId,
    farmId:   sensors?.farmId   || farmLevelSensors?.farmId || baseSensorFilters.farmId,
    fieldId:  sensors?.fieldId  || farmLevelSensors?.fieldId || baseSensorFilters.fieldId,
  };

  try {
    const res = await fetch(`${API_BASE}/api/whatif/newplant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        species:      sp.custom ? sp.name : sp.id,
        quantity:     planting.rows,
        unitsPerRow:  planting.unitsPerRow,
        totalUnits:   planting.totalUnits,
        currentCrops: zones.map(z => z.crop).filter(Boolean),
        ...sensorFilters,
        sensors,
        farmLevelSensors,
        zoneSensors: sensors,
        farmLevelDeviceId,
        calibration,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data.message || data.error || `API error ${res.status}`;
      throw new Error(message);
    }

    const text       = data.insight || data.analysis?.reason || '';
    const unsuitable = Boolean(data.unsuitable || data.analysis?.suitable === false);
    _npAiAnalysis    = { species: sp.id, data };
    _npAiUnsuitable  = unsuitable;

    const boxCls = unsuitable ? 'bad' : (data.warnings?.length ? 'warn' : '');
    if (aiBox) aiBox.className = `pro-ai-inline${boxCls ? ' ' + boxCls : ''}`;

    aiEl.className = '';

    // Build the deterministic sensor-gap panel (replaces old environmentPlan shape)
    const gapHtml = (!unsuitable && data.sensorGap)
      ? _sensorGapHtml(data.sensorGap, data.demand, data.resourceLinks)
      : '';

    aiEl.innerHTML =
      _esc(text || 'AI analysis complete.')
      + gapHtml
      + (unsuitable && data.resourceLinks?.length ? _resourceLinksHtml(data.resourceLinks) : '');

    const backendPrediction = _predictionFromBackendDemand(sp, planting, data);
    if (backendPrediction) {
      _resourcePrediction = backendPrediction;
      _resourcePredictionKey = `${sp.id}|${planting.rows}|${planting.unitsPerRow}|${_activeFarmId() || ''}`;
      _renderResourceDelta(sp, planting, backendPrediction);
    }
    _renderNpEconomics(sp, planting);
    _applyNpSuitabilityVisibility(sp);
  } catch (err) {
    _npAiAnalysis   = { species: sp.id, data: null };
    _npAiUnsuitable = false;
    if (aiBox) aiBox.className = 'pro-ai-inline';
    aiEl.className  = '';
    aiEl.textContent = 'Using crop defaults and sensor readings for this estimate.';
    _applyNpSuitabilityVisibility(sp);
  }
}

// Renders the deterministic sensor-gap analysis returned by the backend.
// Each row shows: current reading vs crop ideal band → action required.
// This replaces the old _advisorCalcHtml() which consumed the stale
// environmentPlan / projected-moisture shape that no longer exists.
function _sensorGapHtml(sensorGap, demand, resourceLinks = []) {
  if (!sensorGap) return '';

  const STATUS_ICON  = { ok: '✅', below: '⬇', above: '⬆', unknown: '❓' };
  const STATUS_COLOR = { ok: '#166534', below: '#9a3412', above: '#1d4ed8', unknown: '#64748b' };
  const ACTION_LABEL = {
    increase: 'Increase',
    reduce:   'Reduce',
    maintain: 'Maintain',
    unknown:  'No data',
  };

  const rows = Object.values(sensorGap).map(g => {
    if (g.current === null || g.current === undefined) {
      return `
        <tr>
          <td style="padding:5px 8px;font-size:10px;color:#64748b;">${_esc(g.label)}</td>
          <td style="padding:5px 8px;font-size:10px;color:#94a3b8;" colspan="3">No sensor data</td>
        </tr>`;
    }
    const icon  = STATUS_ICON[g.status]  || '❓';
    const color = STATUS_COLOR[g.status] || '#64748b';
    const action = ACTION_LABEL[g.action] || g.action;
    const calNote = g.calibrated === false && g.label === 'Soil Moisture'
      ? ' <span style="color:#f97316;font-size:9px;">(uncalibrated)</span>' : '';
    return `
      <tr>
        <td style="padding:5px 8px;font-size:10px;color:#475569;">${_esc(g.label)}</td>
        <td style="padding:5px 8px;font-size:11px;font-weight:700;color:${color};">${icon} ${g.current}${_esc(g.unit)}${calNote}</td>
        <td style="padding:5px 8px;font-size:10px;color:#64748b;">${g.idealMin}–${g.idealMax}${_esc(g.unit)}</td>
        <td style="padding:5px 8px;font-size:10px;font-weight:600;color:${color};">${action}${g.status !== 'ok' ? ` → ${g.target}${_esc(g.unit)}` : ''}</td>
      </tr>`;
  }).join('');

  const demandHtml = demand ? `
    <div style="margin-top:8px;padding:8px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:10px;color:#166534;line-height:1.6;">
      <strong>Extra resource demand per month:</strong>
      Water +${demand.waterLPerMonth} L (RM ${demand.waterCostPerMonth}) ·
      Nutrients +${demand.fertMLPerWeek} mL/week (RM ${demand.fertCostPerMonth}) ·
      Light +${demand.lightKWhPerMonth} kWh (RM ${demand.lightCostPerMonth}) ·
      <strong>Total: RM ${demand.totalMonthlyCostRM}/mo</strong>
    </div>` : '';

  const linksHtml = resourceLinks?.length ? _resourceLinksHtml(resourceLinks) : '';

  return `
    <div class="pro-ai-calc" style="margin-top:10px;">
      <div class="pro-ai-calc-title">Sensor vs crop ideal band</div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:5px 8px;font-size:9px;letter-spacing:.06em;color:#64748b;text-align:left;text-transform:uppercase;">Sensor</th>
            <th style="padding:5px 8px;font-size:9px;letter-spacing:.06em;color:#64748b;text-align:left;text-transform:uppercase;">Current</th>
            <th style="padding:5px 8px;font-size:9px;letter-spacing:.06em;color:#64748b;text-align:left;text-transform:uppercase;">Ideal</th>
            <th style="padding:5px 8px;font-size:9px;letter-spacing:.06em;color:#64748b;text-align:left;text-transform:uppercase;">Action</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${demandHtml}
      ${linksHtml}
    </div>`;
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
