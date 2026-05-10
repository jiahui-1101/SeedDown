import { AppState } from '../store.js';
import { FarmCanvas } from './FarmCanvas.js';
import { showToast } from '../utils/toast.js';

const FARMS_STORAGE_KEY = 'user_farms';
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'
  : window.location.origin;

const RACK_OPTIONS = {
  '2-tier': { id: '2-tier', label: '2-Tier Starter Rack', tiers: 2, slotsPerTier: 3, total: 6 },
  '3-tier': { id: '3-tier', label: '3-Tier Vertical Rack', tiers: 3, slotsPerTier: 3, total: 9 },
  '4-tier': { id: '4-tier', label: '4-Tier Grow Shelf', tiers: 4, slotsPerTier: 4, total: 16 },
  '5-tier': { id: '5-tier', label: '5-Tier Tower Rack', tiers: 5, slotsPerTier: 4, total: 20 },
  wall: { id: 'wall', label: 'Wall Panel Grid', tiers: 4, slotsPerTier: 5, total: 20 },
  'a-frame': { id: 'a-frame', label: 'A-Frame Pyramid', tiers: 4, slotsPerTier: 4, total: 16 },
  'nft-channel': { id: 'nft-channel', label: 'NFT Channel Rows', tiers: 3, slotsPerTier: 6, total: 18 },
  hanging: { id: 'hanging', label: 'Hanging Column Farm', tiers: 5, slotsPerTier: 3, total: 15 },
};

const BASE_CROPS = [
  { emoji:'🥬', name:'Lettuce',  species:'lettuce',  days:45, price:'RM 1.20' },
  { emoji:'🌿', name:'Spinach',  species:'spinach',  days:40, price:'RM 0.90' },
  { emoji:'🌱', name:'Basil',    species:'basil',    days:30, price:'RM 2.50' },
  { emoji:'🍅', name:'Tomato',   species:'tomato',   days:70, price:'RM 3.00' },
  { emoji:'🥒', name:'Cucumber', species:'cucumber', days:55, price:'RM 2.10' },
  { emoji:'🥕', name:'Carrot',   species:'carrot',   days:75, price:'RM 1.50' },
  { emoji:'🥬', name:'Cabbage',  species:'cabbage',  days:90, price:'RM 1.80' },
  { emoji:'🍆', name:'Eggplant', species:'eggplant', days:80, price:'RM 2.20' },
];

let selectedCrop = null;
let selectedSlotIndex = null;
let activeRack = null;
let activeSlotPlants = [];
let isLoadingSpecies = false;

export function openAddPlantModal() {
  const modalContainer = document.getElementById('modalContainer');
  if (!modalContainer) return;

  const farm = getCurrentFarm();
  const rack = resolveRack(farm);
  const slotPlants = resolveSlotPlants(farm, rack);
  activeRack = rack;
  activeSlotPlants = slotPlants;

  modalContainer.innerHTML = `
    <div class="modal-overlay" id="addPlantModalOverlay">
      <div class="modal-sheet">
        <div style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-weight:700;">🌱 Manage Plants</span>
            <button id="closeAddPlantModal" style="background:none;border:none;font-size:20px;cursor:pointer;" aria-label="Close plant manager">✕</button>
          </div>

          <div style="margin-bottom:12px;">
            <div style="font-size:0.7rem;color:var(--text-secondary,#666);margin-bottom:6px;">SEARCH OR ADD CUSTOM SPECIES</div>
            <div style="display:flex;gap:8px;">
              <input id="speciesSearchInput" type="text" placeholder="e.g. kale, mint, cucumber..."
                style="flex:1;padding:8px 12px;border:1px solid var(--border-color,#ddd);border-radius:8px;font-size:13px;background:var(--bg-secondary,#f5f5f5);">
              <button id="speciesSearchBtn" style="background:var(--accent,#639922);color:white;border:none;border-radius:8px;padding:8px 14px;font-size:13px;cursor:pointer;">
                🔍 Add
              </button>
            </div>
            <div id="speciesSearchStatus" style="font-size:11px;color:var(--text-secondary,#666);margin-top:4px;min-height:16px;"></div>
          </div>

          <div style="font-size:0.7rem;color:var(--text-secondary,#666);margin-bottom:6px;">SELECT CROP</div>
          <div id="cropGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;max-height:200px;overflow-y:auto;"></div>

          <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:6px;gap:8px;">
            <div>
              <div style="font-size:0.7rem;color:var(--text-secondary,#666);font-weight:700;">SELECT POSITION</div>
              <div style="font-size:11px;color:var(--text-secondary,#666);">${rack.label} · select a slot to add, change, or remove</div>
            </div>
            <div id="positionStatus" style="font-size:11px;color:var(--accent,#639922);font-weight:700;"></div>
          </div>
          <div id="slotGrid" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;"></div>
          <div id="slotActionPanel" style="border:1px solid var(--border-color,#e7e7e7);border-radius:12px;padding:10px;margin-bottom:12px;background:var(--bg-secondary,#f7f7f7);font-size:12px;color:var(--text-secondary,#666);"></div>

          <div style="display:grid;grid-template-columns:0.9fr 1.1fr;gap:8px;">
            <button id="removePlantBtn" style="width:100%;border:1px solid #efb2b2;background:#fff5f5;color:#c83a3a;border-radius:10px;padding:11px 8px;font-weight:800;cursor:pointer;">Remove</button>
            <button id="confirmPlantBtn" class="btn-primary" style="width:100%;">Plant Now →</button>
          </div>
        </div>
      </div>
    </div>`;

  const overlay = document.getElementById('addPlantModalOverlay');
  overlay.classList.add('open');

  renderCropGrid(BASE_CROPS);
  renderSlotGrid(rack, slotPlants);
  renderSlotActionPanel(rack, slotPlants);
  updateActionButtons(rack, slotPlants);

  document.getElementById('closeAddPlantModal').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  document.getElementById('speciesSearchBtn').addEventListener('click', handleSpeciesSearch);
  document.getElementById('speciesSearchInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSpeciesSearch();
  });

  document.getElementById('removePlantBtn').addEventListener('click', () => {
    if (selectedSlotIndex === null) { showToast('warning', 'Select a planted slot first'); return; }
    const existingPlant = slotPlants[selectedSlotIndex];
    if (!existingPlant) { showToast('warning', 'That slot is already empty'); return; }

    removePlantFromCurrentFarm(selectedSlotIndex, rack);
    showToast('success', `${existingPlant.emoji} ${existingPlant.name} removed from ${positionLabel(selectedSlotIndex, rack)}`);
    closeModal();
    refreshHomeFarmCanvas();
  });

  document.getElementById('confirmPlantBtn').addEventListener('click', () => {
    if (!selectedCrop) { showToast('warning', 'Select a crop first'); return; }
    if (selectedSlotIndex === null) { showToast('warning', 'Select a rack position'); return; }

    const existingPlant = slotPlants[selectedSlotIndex];
    syncLegacyTile(selectedCrop);
    persistPlantToCurrentFarm(selectedCrop, selectedSlotIndex, rack);
    const action = existingPlant ? 'changed to' : 'planted at';
    showToast('success', `${selectedCrop.emoji} ${selectedCrop.name} ${action} ${positionLabel(selectedSlotIndex, rack)}`);
    closeModal();
    refreshHomeFarmCanvas();
  });
}

async function handleSpeciesSearch() {
  if (isLoadingSpecies) return;
  const input = document.getElementById('speciesSearchInput');
  const status = document.getElementById('speciesSearchStatus');
  const query = input.value.trim().toLowerCase();

  if (!query) { showToast('warning', 'Enter a species name'); return; }

  const existing = BASE_CROPS.find(c => c.species === query || c.name.toLowerCase() === query);
  if (existing) {
    highlightCrop(existing);
    status.textContent = `✅ ${existing.name} is already in your crop list — selected!`;
    input.value = '';
    return;
  }

  isLoadingSpecies = true;
  status.textContent = '🤖 Looking up species data...';
  document.getElementById('speciesSearchBtn').textContent = '...';

  try {
    const res = await fetch(`${API_BASE}/api/crops/species/${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const newCrop = {
      emoji: data.crop.emoji || emojiForName(query),
      name: data.crop.commonName || titleCase(query),
      species: data.crop.species || speciesKey(query),
      days: data.crop.requirements?.growthDays || 30,
      price: 'Custom'
    };

    addCropToGrid(newCrop);
    status.textContent = data.crop.aiGenerated
      ? `✨ AI estimated data for "${newCrop.name}" and saved to database!`
      : `✅ Found "${newCrop.name}" in database — selected!`;
    input.value = '';
  } catch (err) {
    const fallbackCrop = cropFromName(query);
    addCropToGrid(fallbackCrop);
    status.textContent = `✅ Added "${fallbackCrop.name}" locally — choose position and Plant Now`;
    input.value = '';
    console.warn('Species search fallback:', err.message);
  } finally {
    isLoadingSpecies = false;
    document.getElementById('speciesSearchBtn').textContent = '🔍 Add';
  }
}

function addCropToGrid(crop) {
  if (!BASE_CROPS.find(c => c.species === crop.species)) {
    BASE_CROPS.push(crop);
    renderCropGrid(BASE_CROPS);
  }
  highlightCrop(crop);
}

function persistPlantToCurrentFarm(crop, slotIndex, rack) {
  const tier = Math.floor(slotIndex / rack.slotsPerTier) + 1;
  const position = (slotIndex % rack.slotsPerTier) + 1;
  const plant = {
    name: crop.name,
    emoji: crop.emoji,
    species: crop.species,
    slots: 1,
    slotIndex,
    tier,
    position,
    status: 'healthy',
    source: 'manual',
  };

  const saved = loadSavedFarms();
  const farmId = AppState.currentFarmId || AppState.currentFarm?.id;
  const index = saved.findIndex(farm => farm.id === farmId);
  const current = index >= 0 ? saved[index] : AppState.currentFarm;
  if (!current) return;

  const plants = expandPlantsToPositions(current, rack)
    .filter(item => Number(item.slotIndex) !== slotIndex);

  plants.push(plant);
  plants.sort((a, b) => Number(a.slotIndex ?? 9999) - Number(b.slotIndex ?? 9999));

  saveUpdatedFarm(current, plants, index, saved, crop.name);
}

function removePlantFromCurrentFarm(slotIndex, rack) {
  const saved = loadSavedFarms();
  const farmId = AppState.currentFarmId || AppState.currentFarm?.id;
  const index = saved.findIndex(farm => farm.id === farmId);
  const current = index >= 0 ? saved[index] : AppState.currentFarm;
  if (!current) return;

  const plants = expandPlantsToPositions(current, rack)
    .filter(item => Number(item.slotIndex) !== slotIndex)
    .sort((a, b) => Number(a.slotIndex ?? 9999) - Number(b.slotIndex ?? 9999));

  saveUpdatedFarm(current, plants, index, saved, plants[0]?.name || current.targetPlant || 'Plant');
}

function saveUpdatedFarm(current, plants, index, saved, fallbackTargetPlant) {
  const updated = {
    ...current,
    plants,
    plantSlots: plants.length,
    targetPlant: plants[0]?.name || fallbackTargetPlant,
  };

  if (index >= 0) {
    saved[index] = updated;
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(saved));
  }

  AppState.currentFarm = updated;
  AppState.currentFarmId = updated.id || AppState.currentFarmId;
}

function renderCropGrid(crops) {
  const grid = document.getElementById('cropGrid');
  if (!grid) return;
  grid.innerHTML = crops.map(c => `
    <div class="crop-option" data-species="${c.species}"
      style="background:var(--surface,#fff);border-radius:12px;padding:8px;text-align:center;cursor:pointer;border:2px solid transparent;transition:border .15s;">
      <div style="font-size:28px;">${c.emoji}</div>
      <div style="font-weight:600;font-size:11px;">${c.name}</div>
      <div style="font-size:10px;color:#999;">${c.days}d</div>
    </div>`).join('');

  document.querySelectorAll('.crop-option').forEach(el => {
    el.addEventListener('click', () => {
      const crop = crops.find(c => c.species === el.dataset.species);
      if (crop) highlightCrop(crop);
    });
  });
}

function renderSlotGrid(rack, slotPlants) {
  const grid = document.getElementById('slotGrid');
  if (!grid) return;

  grid.innerHTML = Array.from({ length: rack.tiers }, (_, tierIndex) => {
    const slots = Array.from({ length: rack.slotsPerTier }, (_, posIndex) => {
      const slotIndex = tierIndex * rack.slotsPerTier + posIndex;
      const plant = slotPlants[slotIndex];
      const selected = selectedSlotIndex === slotIndex;
      return `
        <button class="slot-option" data-slot-index="${slotIndex}"
          aria-label="${plant ? `Change or remove ${escapeHTML(plant.name)}` : `Plant slot ${posIndex + 1}`}"
          style="min-height:54px;border-radius:12px;border:2px solid ${selected ? 'var(--accent,#639922)' : 'var(--border-color,#ddd)'};background:${selected ? 'var(--accent-l,#eef8e7)' : 'var(--surface,#fff)'};cursor:pointer;padding:6px;text-align:center;">
          <div style="font-size:20px;line-height:1;">${plant?.emoji || '◻️'}</div>
          <div style="font-size:10px;font-weight:800;margin-top:4px;color:${plant ? 'var(--text,#111)' : 'var(--text-secondary,#666)'};">${plant ? escapeHTML(plant.name) : `Slot ${posIndex + 1}`}</div>
        </button>`;
    }).join('');

    return `
      <div>
        <div style="font-size:11px;font-weight:800;color:var(--text-secondary,#666);margin-bottom:5px;">Tier ${tierIndex + 1}</div>
        <div style="display:grid;grid-template-columns:repeat(${rack.slotsPerTier},minmax(44px,1fr));gap:6px;">${slots}</div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.slot-option').forEach(button => {
    button.addEventListener('click', () => {
      selectedSlotIndex = Number(button.dataset.slotIndex);
      const selectedPlant = slotPlants[selectedSlotIndex];
      document.getElementById('positionStatus').textContent = selectedPlant
        ? `${positionLabel(selectedSlotIndex, rack)} · ${selectedPlant.name}`
        : positionLabel(selectedSlotIndex, rack);
      renderSlotGrid(rack, slotPlants);
      renderSlotActionPanel(rack, slotPlants);
      updateActionButtons(rack, slotPlants);
    });
  });
}

function renderSlotActionPanel(rack, slotPlants) {
  const panel = document.getElementById('slotActionPanel');
  if (!panel) return;

  if (selectedSlotIndex === null) {
    panel.innerHTML = 'Choose a slot first. Empty slots can be planted; occupied slots can be changed or removed.';
    return;
  }

  const existingPlant = slotPlants[selectedSlotIndex];
  const cropText = selectedCrop ? `${selectedCrop.emoji} ${selectedCrop.name}` : 'a crop';
  if (existingPlant) {
    panel.innerHTML = `
      <div style="font-weight:800;color:var(--text,#111);margin-bottom:4px;">${positionLabel(selectedSlotIndex, rack)}</div>
      <div>Current: <strong>${existingPlant.emoji} ${escapeHTML(existingPlant.name)}</strong></div>
      <div style="margin-top:3px;">Select ${escapeHTML(cropText)} and press Change, or remove this plant.</div>`;
    return;
  }

  panel.innerHTML = `
    <div style="font-weight:800;color:var(--text,#111);margin-bottom:4px;">${positionLabel(selectedSlotIndex, rack)}</div>
    <div>Empty slot. Select ${escapeHTML(cropText)} and press Plant Now.</div>`;
}

function updateActionButtons(rack, slotPlants) {
  const confirmBtn = document.getElementById('confirmPlantBtn');
  const removeBtn = document.getElementById('removePlantBtn');
  if (!confirmBtn || !removeBtn) return;

  const existingPlant = selectedSlotIndex === null ? null : slotPlants[selectedSlotIndex];
  confirmBtn.textContent = existingPlant ? 'Change Plant →' : 'Plant Now →';
  confirmBtn.disabled = selectedSlotIndex === null || !selectedCrop;
  confirmBtn.style.opacity = confirmBtn.disabled ? '0.55' : '1';
  confirmBtn.style.cursor = confirmBtn.disabled ? 'not-allowed' : 'pointer';

  removeBtn.disabled = !existingPlant;
  removeBtn.style.opacity = existingPlant ? '1' : '0.45';
  removeBtn.style.cursor = existingPlant ? 'pointer' : 'not-allowed';
}

function highlightCrop(crop) {
  selectedCrop = crop;
  document.querySelectorAll('.crop-option').forEach(el => {
    el.style.border = el.dataset.species === crop.species
      ? '2px solid var(--accent,#639922)'
      : '2px solid transparent';
  });
  if (activeRack) {
    renderSlotActionPanel(activeRack, activeSlotPlants);
    updateActionButtons(activeRack, activeSlotPlants);
  }
}

function syncLegacyTile(crop) {
  const emptyTile = AppState.tiles.find(tile => tile.status === 'empty' || !tile.plant);
  if (!emptyTile) return;
  emptyTile.plant = crop.emoji;
  emptyTile.name = crop.name;
  emptyTile.status = 'healthy';
  emptyTile.growth = 0;
  emptyTile.days = crop.days;
  emptyTile.species = crop.species;
}

function refreshHomeFarmCanvas() {
  AppState.notify();
  if (document.getElementById('farmCanvas')) FarmCanvas.init('farmCanvas');
}

function getCurrentFarm() {
  const saved = loadSavedFarms();
  return AppState.currentFarm
    || saved.find(farm => farm.id === AppState.currentFarmId)
    || AppState.newFarm
    || saved[saved.length - 1]
    || null;
}

function resolveRack(farm) {
  const raw = String(farm?.rackTypeId || farm?.rackType || farm?.rackLabel || '').toLowerCase();
  if (raw.includes('2')) return RACK_OPTIONS['2-tier'];
  if (raw.includes('4')) return RACK_OPTIONS['4-tier'];
  if (raw.includes('5')) return RACK_OPTIONS['5-tier'];
  if (raw.includes('wall') || raw.includes('grid')) return RACK_OPTIONS.wall;
  if (raw.includes('frame')) return RACK_OPTIONS['a-frame'];
  if (raw.includes('nft') || raw.includes('channel')) return RACK_OPTIONS['nft-channel'];
  if (raw.includes('hanging') || raw.includes('column')) return RACK_OPTIONS.hanging;
  return RACK_OPTIONS['3-tier'];
}

function resolveSlotPlants(farm, rack) {
  const slots = Array(rack.total).fill(null);
  expandPlantsToPositions(farm, rack).forEach(plant => {
    const index = Number(plant.slotIndex);
    if (Number.isInteger(index) && index >= 0 && index < rack.total) {
      slots[index] = plant;
    }
  });
  return slots;
}

function expandPlantsToPositions(farm, rack) {
  const sourcePlants = Array.isArray(farm?.plants) ? farm.plants : makeFallbackPlants(farm, rack);
  const placed = [];
  const used = new Set();

  sourcePlants.forEach(plant => {
    if (plant.slotIndex !== undefined && plant.slotIndex !== null) {
      const index = Number(plant.slotIndex);
      if (Number.isInteger(index) && index >= 0 && index < rack.total && !used.has(index)) {
        placed.push(normalizePlantForSlot(plant, index, rack));
        used.add(index);
      }
      return;
    }

    const count = Math.max(1, Number.parseInt(plant.slots || plant.count || 1, 10) || 1);
    for (let i = 0; i < count; i++) {
      const next = firstFreeSlot(used, rack.total);
      if (next === -1) return;
      placed.push(normalizePlantForSlot(plant, next, rack));
      used.add(next);
    }
  });

  return placed;
}

function normalizePlantForSlot(plant, slotIndex, rack) {
  return {
    name: plant.name || 'Plant',
    emoji: plant.emoji || emojiForName(plant.name || plant.species),
    species: plant.species || speciesKey(plant.name),
    slots: 1,
    slotIndex,
    tier: Math.floor(slotIndex / rack.slotsPerTier) + 1,
    position: (slotIndex % rack.slotsPerTier) + 1,
    status: plant.status || 'healthy',
    source: plant.source || 'existing',
  };
}

function firstFreeSlot(used, total) {
  for (let i = 0; i < total; i++) {
    if (!used.has(i)) return i;
  }
  return -1;
}

function makeFallbackPlants(farm, rack) {
  const count = Math.max(0, Math.min(rack.total, Number.parseInt(farm?.plantSlots || farm?.plants || 0, 10) || 0));
  const name = farm?.targetPlant || 'Plant';
  return Array.from({ length: count }, (_, index) => normalizePlantForSlot({
    name,
    emoji: emojiForName(name),
    species: speciesKey(name),
    status: 'healthy',
  }, index, rack));
}

function loadSavedFarms() {
  try {
    return JSON.parse(localStorage.getItem(FARMS_STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function cropFromName(name) {
  return {
    emoji: emojiForName(name),
    name: titleCase(name),
    species: speciesKey(name),
    days: 30,
    price: 'Custom',
  };
}

function positionLabel(slotIndex, rack) {
  return `Tier ${Math.floor(slotIndex / rack.slotsPerTier) + 1} · Slot ${(slotIndex % rack.slotsPerTier) + 1}`;
}

function titleCase(name) {
  const cleaned = String(name || 'Plant').trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function speciesKey(name) {
  return String(name || 'plant').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function emojiForName(name = '') {
  const key = String(name).toLowerCase();
  if (key.includes('lettuce') || key.includes('cabbage') || key.includes('kale')) return '🥬';
  if (key.includes('tomato')) return '🍅';
  if (key.includes('chili') || key.includes('pepper')) return '🌶️';
  if (key.includes('strawberry')) return '🍓';
  if (key.includes('cucumber')) return '🥒';
  if (key.includes('carrot')) return '🥕';
  if (key.includes('eggplant') || key.includes('aubergine') || key.includes('brinjal')) return '🍆';
  if (key.includes('basil') || key.includes('mint') || key.includes('spinach') || key.includes('cilantro') || key.includes('parsley')) return '🌿';
  return '🌱';
}

function escapeHTML(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function closeModal() {
  selectedCrop = null;
  selectedSlotIndex = null;
  activeRack = null;
  activeSlotPlants = [];
  const overlay = document.getElementById('addPlantModalOverlay');
  if (overlay) overlay.remove();
}
