import { AppState } from '../store.js';
import { showToast } from '../utils/toast.js';

// Base crops always available (no backend needed)
const BASE_CROPS = [
  { emoji:'🥬', name:'Lettuce',  species:'lettuce',  days:45, price:'RM 1.20' },
  { emoji:'🌿', name:'Spinach',  species:'spinach',  days:40, price:'RM 0.90' },
  { emoji:'🌱', name:'Basil',    species:'basil',    days:30, price:'RM 2.50' },
  { emoji:'🍅', name:'Tomato',   species:'tomato',   days:70, price:'RM 3.00' },
  { emoji:'🥕', name:'Carrot',   species:'carrot',   days:75, price:'RM 1.50' },
  { emoji:'🥬', name:'Cabbage',  species:'cabbage',  days:90, price:'RM 1.80' },
  { emoji:'🍆', name:'Eggplant', species:'eggplant', days:80, price:'RM 2.20' },
];

let selectedCrop = null; // { emoji, name, species, days }
let selectedTile = null;
let isLoadingSpecies = false;

export function openAddPlantModal() {
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = `
    <div class="modal-overlay" id="addPlantModalOverlay">
      <div class="modal-sheet">
        <div style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-weight:700;">🌱 Add New Plant</span>
            <button id="closeAddPlantModal" style="background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
          </div>

          <!-- Search / Custom Species -->
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

          <!-- Crop Grid -->
          <div style="font-size:0.7rem;color:var(--text-secondary,#666);margin-bottom:6px;">SELECT CROP</div>
          <div id="cropGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;max-height:200px;overflow-y:auto;"></div>

          <!-- Tile Grid -->
          <div style="font-size:0.7rem;color:var(--text-secondary,#666);margin-bottom:6px;">SELECT EMPTY TILE</div>
          <div id="tileGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;"></div>

          <button id="confirmPlantBtn" class="btn-primary" style="width:100%;">Plant Now →</button>
        </div>
      </div>
    </div>`;

  const overlay = document.getElementById('addPlantModalOverlay');
  overlay.classList.add('open');

  renderCropGrid(BASE_CROPS);
  renderTileGrid();

  // Close handlers
  document.getElementById('closeAddPlantModal').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  // Search handler
  document.getElementById('speciesSearchBtn').addEventListener('click', handleSpeciesSearch);
  document.getElementById('speciesSearchInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleSpeciesSearch();
  });

  // Confirm plant
  document.getElementById('confirmPlantBtn').addEventListener('click', () => {
    if (!selectedCrop) { showToast('warning', 'Select a crop first'); return; }
    if (selectedTile === null) { showToast('warning', 'Select an empty tile'); return; }

    const tile = AppState.tiles[selectedTile];
    tile.plant  = selectedCrop.emoji;
    tile.name   = selectedCrop.name;
    tile.status = 'healthy';
    tile.growth = 0;
    tile.days   = selectedCrop.days;
    tile.species = selectedCrop.species;

    showToast('success', `${selectedCrop.emoji} ${selectedCrop.name} planted!`);
    closeModal();
    AppState.notify();
  });
}

async function handleSpeciesSearch() {
  if (isLoadingSpecies) return;
  const input = document.getElementById('speciesSearchInput');
  const status = document.getElementById('speciesSearchStatus');
  const query = input.value.trim().toLowerCase();

  if (!query) { showToast('warning', 'Enter a species name'); return; }

  // Check if already in base crops
  const existing = BASE_CROPS.find(c => c.species === query || c.name.toLowerCase() === query);
  if (existing) {
    highlightCrop(existing);
    status.textContent = `✅ ${existing.name} is already in your crop list — selected!`;
    input.value = '';
    return;
  }

  // Fetch from backend (checks DB + AI generates if unknown)
  isLoadingSpecies = true;
  status.textContent = '🤖 Looking up species data...';
  document.getElementById('speciesSearchBtn').textContent = '...';

  try {
    const res = await fetch(`http://localhost:3000/api/crops/species/${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    const newCrop = {
      emoji:   data.crop.emoji   || '🌱',
      name:    data.crop.commonName || query,
      species: data.crop.species,
      days:    data.crop.requirements?.growthDays || 30,
      price:   'Custom'
    };

    // Add to crop grid if not already there
    if (!BASE_CROPS.find(c => c.species === newCrop.species)) {
      BASE_CROPS.push(newCrop);
      renderCropGrid(BASE_CROPS);
    }

    highlightCrop(newCrop);
    status.textContent = data.crop.aiGenerated
      ? `✨ AI estimated data for "${newCrop.name}" and saved to database!`
      : `✅ Found "${newCrop.name}" in database — selected!`;
    input.value = '';

  } catch (err) {
    status.textContent = `❌ Could not find "${query}" — try a different name`;
    console.error('Species search error:', err);
  } finally {
    isLoadingSpecies = false;
    document.getElementById('speciesSearchBtn').textContent = '🔍 Add';
  }
}

function highlightCrop(crop) {
  selectedCrop = crop;
  document.querySelectorAll('.crop-option').forEach(el => {
    el.style.border = el.dataset.species === crop.species
      ? '2px solid var(--accent,#639922)'
      : 'none';
  });
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

function renderTileGrid() {
  const grid = document.getElementById('tileGrid');
  if (!grid) return;
  grid.innerHTML = AppState.tiles.map((t, idx) => `
    <div class="tile-option" data-idx="${idx}"
      style="background:${t.status === 'empty' ? 'var(--surface,#fff)' : '#eee'};border-radius:12px;padding:12px;text-align:center;cursor:${t.status === 'empty' ? 'pointer' : 'not-allowed'};border:2px solid transparent;">
      ${t.status === 'empty' ? '◻️' : (t.plant || '🌱')}
    </div>`).join('');

  document.querySelectorAll('.tile-option').forEach(el => {
    const idx = parseInt(el.dataset.idx);
    if (AppState.tiles[idx].status !== 'empty') return;
    el.addEventListener('click', () => {
      document.querySelectorAll('.tile-option').forEach(e => e.style.border = '2px solid transparent');
      el.style.border = '2px solid var(--accent,#639922)';
      selectedTile = idx;
    });
  });
}

function closeModal() {
  selectedCrop = null;
  selectedTile = null;
  const overlay = document.getElementById('addPlantModalOverlay');
  if (overlay) overlay.remove();
}