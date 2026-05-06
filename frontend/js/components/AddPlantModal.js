import { AppState } from '../store.js';
import { showToast } from '../utils/toast.js';

const crops = [
    { emoji:'🥬', name:'Lettuce', days:7, price:'RM 1.20' },
    { emoji:'🌿', name:'Spinach', days:12, price:'RM 0.90' },
    { emoji:'🌱', name:'Basil', days:10, price:'RM 2.50' },
    { emoji:'🍅', name:'Tomato', days:20, price:'RM 3.00' }
];

let selectedCrop = null;
let selectedTile = null;

export function openAddPlantModal() {
    const modalHtml = `
        <div class="modal-overlay" id="addPlantModalOverlay">
            <div class="modal-sheet">
                <div style="padding:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:700;">🌱 Add New Plant</span>
                        <button id="closeAddPlantModal" style="background:none; border:none; font-size:20px; cursor:pointer;">✕</button>
                    </div>
                    <div style="margin-top:16px;">
                        <div style="font-size:0.7rem;">Select Crop</div>
                        <div id="cropGrid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-top:8px;"></div>
                    </div>
                    <div style="margin-top:16px;">
                        <div style="font-size:0.7rem;">Select Empty Tile</div>
                        <div id="tileGrid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-top:8px;"></div>
                    </div>
                    <button id="confirmPlantBtn" class="btn-primary" style="margin-top:16px; width:100%;">Plant Now →</button>
                </div>
            </div>
        </div>
    `;
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = modalHtml;
    const overlay = document.getElementById('addPlantModalOverlay');
    overlay.classList.add('open');
    
    renderCropGrid();
    renderTileGrid();
    
    document.getElementById('closeAddPlantModal').addEventListener('click', () => closeModal());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.getElementById('confirmPlantBtn').addEventListener('click', () => {
        if (selectedCrop === null) { showToast('warning', 'Select a crop'); return; }
        if (selectedTile === null) { showToast('warning', 'Select an empty tile'); return; }
        const tile = AppState.tiles[selectedTile];
        tile.plant = crops[selectedCrop].emoji;
        tile.name = crops[selectedCrop].name;
        tile.status = 'healthy';
        tile.growth = 0;
        tile.days = crops[selectedCrop].days;
        showToast('success', `${crops[selectedCrop].emoji} ${crops[selectedCrop].name} planted!`);
        closeModal();
        AppState.notify(); // Refresh UI
    });
}

function closeModal() {
    const overlay = document.getElementById('addPlantModalOverlay');
    if (overlay) overlay.remove();
}

function renderCropGrid() {
    const grid = document.getElementById('cropGrid');
    if (!grid) return;
    grid.innerHTML = crops.map((c, idx) => `
        <div class="crop-option" data-idx="${idx}" style="background:var(--surface); border-radius:12px; padding:8px; text-align:center; cursor:pointer;">
            <div style="font-size:28px;">${c.emoji}</div>
            <div style="font-weight:600;">${c.name}</div>
            <div style="font-size:0.6rem;">${c.days}d</div>
        </div>
    `).join('');
    document.querySelectorAll('.crop-option').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.crop-option').forEach(e => e.style.border = 'none');
            el.style.border = '2px solid var(--accent)';
            selectedCrop = parseInt(el.getAttribute('data-idx'));
        });
    });
}

function renderTileGrid() {
    const grid = document.getElementById('tileGrid');
    if (!grid) return;
    grid.innerHTML = AppState.tiles.map((t, idx) => `
        <div class="tile-option" data-idx="${idx}" style="background:${t.status === 'empty' ? 'var(--surface)' : '#ccc'}; border-radius:12px; padding:12px; text-align:center; cursor:${t.status === 'empty' ? 'pointer' : 'not-allowed'};">
            ${t.status === 'empty' ? '◻️' : t.plant || '🌱'}
        </div>
    `).join('');
    document.querySelectorAll('.tile-option').forEach(el => {
        const idx = parseInt(el.getAttribute('data-idx'));
        if (AppState.tiles[idx].status !== 'empty') return;
        el.addEventListener('click', () => {
            document.querySelectorAll('.tile-option').forEach(e => e.style.border = 'none');
            el.style.border = '2px solid var(--accent)';
            selectedTile = idx;
        });
    });
}