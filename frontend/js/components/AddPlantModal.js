import { API_BASE } from '../utils/apiBase.js';
import { AppState } from '../store.js';
import { FarmCanvas } from './FarmCanvas.js';
import { showToast } from '../utils/toast.js';

const FARMS_STORAGE_KEY = 'user_farms';


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
  const commercial = isCommercialContext();
  ensurePlantModalStyles();
  activeRack = rack;
  activeSlotPlants = slotPlants;

  modalContainer.innerHTML = `
    <div class="modal-overlay ${commercial ? 'commercial-plant-overlay' : ''}" id="addPlantModalOverlay">
      <div class="modal-sheet ${commercial ? 'commercial-plant-sheet' : ''}">
        <div style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <div style="font-size:${commercial ? '10px' : '13px'};font-weight:900;letter-spacing:${commercial ? '.16em' : '0'};text-transform:${commercial ? 'uppercase' : 'none'};color:${commercial ? '#047857' : 'var(--text,#111)'};">${commercial ? 'Production Slot Manager' : '🌱 Manage Plants'}</div>
              ${commercial ? `<div style="font-size:11px;color:#64748b;font-weight:700;margin-top:3px;">Assign crop species to rack zones and production slots</div>` : ''}
            </div>
            <button id="closeAddPlantModal" class="${commercial ? 'commercial-plant-close' : ''}" style="background:none;border:none;font-size:20px;cursor:pointer;" aria-label="Close plant manager">✕</button>
          </div>

          <div style="margin-bottom:12px;">
            <div style="font-size:0.7rem;color:${commercial ? '#64748b' : 'var(--text-secondary,#666)'};margin-bottom:6px;font-weight:800;letter-spacing:.08em;">SEARCH OR ADD CUSTOM SPECIES</div>
            <div style="display:flex;gap:8px;">
              <input id="speciesSearchInput" type="text" placeholder="e.g. kale, mint, cucumber..."
                style="flex:1;padding:10px 12px;border:1px solid ${commercial ? '#dbe7dc' : 'var(--border-color,#ddd)'};border-radius:10px;font-size:13px;background:${commercial ? '#f8fafc' : 'var(--bg-secondary,#f5f5f5)'};color:${commercial ? '#17231b' : 'inherit'};">
              <button id="speciesSearchBtn" class="${commercial ? 'commercial-plant-action' : ''}" style="background:var(--accent,#639922);color:white;border:none;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:900;cursor:pointer;">
                ${commercial ? 'ADD' : '🔍 Add'}
              </button>
            </div>
            <div id="speciesSearchStatus" style="font-size:11px;color:${commercial ? '#64748b' : 'var(--text-secondary,#666)'};margin-top:4px;min-height:16px;"></div>
          </div>

          <div style="font-size:0.7rem;color:${commercial ? '#64748b' : 'var(--text-secondary,#666)'};margin-bottom:6px;font-weight:800;letter-spacing:.08em;">${commercial ? 'SPECIES CATALOG' : 'SELECT CROP'}</div>
          <div id="cropGrid" class="${commercial ? 'commercial-crop-grid' : ''}" style="display:grid;grid-template-columns:repeat(${commercial ? 2 : 4},1fr);gap:8px;margin-bottom:16px;max-height:${commercial ? '220px' : '200px'};overflow-y:auto;"></div>

          <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:6px;gap:8px;">
            <div>
              <div style="font-size:0.7rem;color:${commercial ? '#64748b' : 'var(--text-secondary,#666)'};font-weight:800;letter-spacing:.08em;">${commercial ? 'ZONE / SLOT ASSIGNMENT' : 'SELECT POSITION'}</div>
              <div style="font-size:11px;color:${commercial ? '#94a3b8' : 'var(--text-secondary,#666)'};">${rack.label} · select a slot to add, change, or remove</div>
            </div>
            <div id="positionStatus" style="font-size:11px;color:${commercial ? '#047857' : 'var(--accent,#639922)'};font-weight:800;"></div>
          </div>
          <div id="slotGrid" class="${commercial ? 'commercial-slot-grid' : ''}" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;"></div>
          <div id="slotActionPanel" class="${commercial ? 'commercial-slot-panel' : ''}" style="border:1px solid ${commercial ? '#e5e7eb' : 'var(--border-color,#e7e7e7)'};border-radius:12px;padding:10px;margin-bottom:12px;background:${commercial ? '#f8fafc' : 'var(--bg-secondary,#f7f7f7)'};font-size:12px;color:${commercial ? '#475569' : 'var(--text-secondary,#666)'};"></div>

          <div style="display:grid;grid-template-columns:0.9fr 1.1fr;gap:8px;">
            <button id="removePlantBtn" class="${commercial ? 'commercial-remove-btn' : ''}" style="width:100%;border:1px solid #efb2b2;background:#fff5f5;color:#c83a3a;border-radius:10px;padding:11px 8px;font-weight:800;cursor:pointer;">${commercial ? 'CLEAR SLOT' : 'Remove'}</button>
            <button id="confirmPlantBtn" class="btn-primary ${commercial ? 'commercial-confirm-btn' : ''}" style="width:100%;">${commercial ? 'ASSIGN CROP' : 'Plant Now →'}</button>
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
    document.getElementById('speciesSearchBtn').textContent = isCommercialContext() ? 'ADD' : '🔍 Add';
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

async function saveUpdatedFarm(current, plants, index, saved, fallbackTargetPlant) {
  const updated = {
    ...current,
    plants,
    plantSlots: plants.length,
    targetPlant: plants[0]?.name || fallbackTargetPlant,
  };

  // 1. 保存到 LocalStorage 以供畫面即時渲染
  if (index >= 0) {
    saved[index] = updated;
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(saved));
  }

  // 2. 替換舊 Firebase SDK，改為呼叫後端 API (JWT Bearer)
  const token = localStorage.getItem('token');
  if (token) {
      try {
          await fetch(`${API_BASE}/api/farms/create`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              // 帶上 farmId 以確保後端的 .set() 會覆蓋並更新同一個農場
              body: JSON.stringify({ ...updated, farmId: updated.id })
          });
          console.log('✅ Plant synced to Backend successfully');
      } catch (err) {
          console.error('❌ Failed to sync plant to Backend:', err);
      }
  }

  AppState.currentFarm = updated;
  AppState.currentFarmId = updated.id || AppState.currentFarmId;
}

function renderCropGrid(crops) {
  const grid = document.getElementById('cropGrid');
  if (!grid) return;
  const commercial = isCommercialContext();
  grid.innerHTML = crops.map(c => commercial ? `
    <div class="crop-option commercial-crop-option" data-species="${c.species}">
      <div class="commercial-crop-code">${speciesCode(c.name)}</div>
      <div style="min-width:0;">
        <div class="commercial-crop-name">${escapeHTML(c.name)}</div>
        <div class="commercial-crop-meta">${escapeHTML(c.species)} · ${c.days}d cycle</div>
      </div>
    </div>` : `
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
  const commercial = isCommercialContext();

  grid.innerHTML = Array.from({ length: rack.tiers }, (_, tierIndex) => {
    const slots = Array.from({ length: rack.slotsPerTier }, (_, posIndex) => {
      const slotIndex = tierIndex * rack.slotsPerTier + posIndex;
      const plant = slotPlants[slotIndex];
      const selected = selectedSlotIndex === slotIndex;
      if (commercial) {
        return `
          <button class="slot-option commercial-slot-option ${selected ? 'selected' : ''} ${plant ? 'filled' : 'empty'}" data-slot-index="${slotIndex}"
            aria-label="${plant ? `Change or remove ${escapeHTML(plant.name)}` : `Plant slot ${posIndex + 1}`}">
            <span class="commercial-slot-id">S${String(posIndex + 1).padStart(2, '0')}</span>
            <span class="commercial-slot-name">${plant ? escapeHTML(plant.name) : 'Available'}</span>
            <span class="commercial-slot-state">${plant ? escapeHTML(plant.status || 'healthy') : 'empty'}</span>
          </button>`;
      }
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
        <div style="font-size:11px;font-weight:800;color:${commercial ? '#64748b' : 'var(--text-secondary,#666)'};margin-bottom:5px;">${commercial ? `Zone ${String.fromCharCode(65 + tierIndex)} · Tier ${tierIndex + 1}` : `Tier ${tierIndex + 1}`}</div>
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
  const commercial = isCommercialContext();
  confirmBtn.textContent = existingPlant
    ? (commercial ? 'UPDATE SLOT' : 'Change Plant →')
    : (commercial ? 'ASSIGN CROP' : 'Plant Now →');
  confirmBtn.disabled = selectedSlotIndex === null || !selectedCrop;
  confirmBtn.style.opacity = confirmBtn.disabled ? '0.55' : '1';
  confirmBtn.style.cursor = confirmBtn.disabled ? 'not-allowed' : 'pointer';

  removeBtn.disabled = !existingPlant;
  removeBtn.style.opacity = existingPlant ? '1' : '0.45';
  removeBtn.style.cursor = existingPlant ? 'pointer' : 'not-allowed';
}

function highlightCrop(crop) {
  selectedCrop = crop;
  const commercial = isCommercialContext();
  document.querySelectorAll('.crop-option').forEach(el => {
    if (commercial) {
      el.classList.toggle('selected', el.dataset.species === crop.species);
    } else {
      el.style.border = el.dataset.species === crop.species
        ? '2px solid var(--accent,#639922)'
        : '2px solid transparent';
    }
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
  if (document.getElementById('commercialFarmCanvas')) {
    import('./CommercialFarmCanvas.js')
      .then(({ CommercialFarmCanvas }) => CommercialFarmCanvas.init('commercialFarmCanvas'))
      .catch(() => FarmCanvas.init('commercialFarmCanvas'));
    return;
  }
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

function isCommercialContext() {
  return AppState.mode === 'commercial' || !!document.getElementById('commercialFarmCanvas');
}

function speciesCode(name = '') {
  const cleaned = String(name || 'Plant').trim().replace(/[^a-zA-Z0-9 ]/g, '');
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const raw = parts.length > 1 ? parts.map(part => part[0]).join('') : cleaned.slice(0, 3);
  return raw.toUpperCase() || 'PL';
}

function ensurePlantModalStyles() {
  if (document.getElementById('commercial-plant-modal-style')) return;
  const style = document.createElement('style');
  style.id = 'commercial-plant-modal-style';
  style.textContent = `
    .commercial-plant-overlay {
      background: rgba(15, 23, 42, .22) !important;
      backdrop-filter: blur(10px);
    }
    .commercial-plant-sheet {
      background: rgba(255,255,255,.97) !important;
      color: #17231b !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 26px !important;
      box-shadow: 0 24px 70px rgba(15,23,42,.18) !important;
      backdrop-filter: blur(18px) !important;
    }
    .commercial-plant-sheet input::placeholder { color: #94a3b8 !important; }
    .commercial-plant-close {
      color: #64748b !important;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1px solid #e5e7eb !important;
      background: #f8fafc !important;
    }
    .commercial-plant-close:hover { background: #ecfdf5 !important; color: #047857 !important; }
    .commercial-plant-action,
    .commercial-confirm-btn {
      background: #166534 !important;
      border: 1px solid #166534 !important;
      color: #ffffff !important;
      border-radius: 12px !important;
      letter-spacing: .08em;
      box-shadow: 0 10px 26px rgba(22,101,52,.16) !important;
    }
    .commercial-remove-btn {
      background: #fef2f2 !important;
      border-color: #fecaca !important;
      color: #dc2626 !important;
      border-radius: 12px !important;
      letter-spacing: .06em;
    }
    .commercial-crop-grid::-webkit-scrollbar,
    .commercial-slot-grid::-webkit-scrollbar { width: 5px; }
    .commercial-crop-grid::-webkit-scrollbar-thumb,
    .commercial-slot-grid::-webkit-scrollbar-thumb { background: #bbf7d0; border-radius: 999px; }
    .commercial-crop-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      cursor: pointer;
      min-width: 0;
      transition: border .18s, background .18s, transform .18s, box-shadow .18s;
    }
    .commercial-crop-option:hover,
    .commercial-crop-option.selected {
      border-color: #86efac;
      background: #ecfdf5;
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(22,101,52,.08);
    }
    .commercial-crop-code {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: #dcfce7;
      color: #047857;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 950;
      letter-spacing: .06em;
      flex-shrink: 0;
    }
    .commercial-crop-name {
      color: #17231b;
      font-size: 12px;
      font-weight: 950;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .commercial-crop-meta {
      margin-top: 3px;
      color: #64748b;
      font-size: 10px;
      font-weight: 750;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .commercial-slot-option {
      min-height: 52px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      color: #475569;
      cursor: pointer;
      padding: 8px;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 2px;
      transition: border .18s, background .18s, box-shadow .18s;
    }
    .commercial-slot-option.filled { border-color: #bbf7d0; background: #f0fdf4; }
    .commercial-slot-option:hover { border-color: #86efac; }
    .commercial-slot-option.selected {
      border-color: #0ea5e9;
      background: #eff6ff;
      box-shadow: 0 8px 20px rgba(14,165,233,.12);
    }
    .commercial-slot-id {
      color: #047857;
      font-size: 9px;
      font-weight: 950;
      letter-spacing: .08em;
    }
    .commercial-slot-name {
      color: #17231b;
      font-size: 10px;
      font-weight: 950;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .commercial-slot-state {
      color: #64748b;
      font-size: 8px;
      font-weight: 950;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .commercial-slot-panel { color: #475569 !important; }
    .commercial-slot-panel strong,
    .commercial-slot-panel b { color: #17231b !important; }
  `;
  document.head.appendChild(style);
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