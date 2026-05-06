/* ============================================================
   MODULE: FEATURE - WHAT IF
   WhatIf.js — self-contained module, no external dependencies except Chart.js (lazy-loaded)
   Export: { render, init }
   ============================================================ */

/* ---------- DATA ---------- */
const WIF_CROPS = [
  { id: 'tomato',      name: 'Tomato',      icon: 'ti-fish',    days: 5,  kg: 0.32, readyIn: 5,  color: '#D85A30' },
  { id: 'carrot',      name: 'Carrot',      icon: 'ti-carrot',  days: 8,  kg: 0.24, readyIn: 8,  color: '#BA7517' },
  { id: 'cabbage',     name: 'Cabbage',     icon: 'ti-leaf',    days: 7,  kg: 0.41, readyIn: 7,  color: '#639922' },
  { id: 'eggplant',    name: 'Eggplant',    icon: 'ti-bulb',    days: 11, kg: 0.28, readyIn: 11, color: '#534AB7' },
  { id: 'basil',       name: 'Basil',       icon: 'ti-herb',    days: 4,  kg: 0.09, readyIn: 4,  color: '#1D9E75' },
  { id: 'green_onion', name: 'Green Onion', icon: 'ti-plant-2', days: 6,  kg: 0.11, readyIn: 6,  color: '#3B6D11' },
];

const WIF_RECIPES = [
  { name: 'Bolognese Pasta',    ingr: ['tomato', 'carrot', 'basil'] },
  { name: 'ABC Soup',           ingr: ['cabbage', 'carrot', 'tomato', 'green_onion'] },
  { name: 'Grilled Eggplant',   ingr: ['eggplant', 'basil'] },
  { name: 'Spring Green Salad', ingr: ['green_onion', 'basil', 'cabbage'] },
];

const WIF_COST_DATA = {
  lettuce:  { mktPrice: 4.8,  rows: 5, waterSave: 3.2, energySave: 1.1, fertilizer: 0.8, note: 'Lettuce grows fast — your 5 rows beat supermarket prices by 2× this month.' },
  tomato:   { mktPrice: 7.2,  rows: 3, waterSave: 2.1, energySave: 0.9, fertilizer: 1.1, note: 'Tomatoes fetched RM 7.20/kg at Pasar Borong this week. Yours cost much less.' },
  carrot:   { mktPrice: 3.5,  rows: 4, waterSave: 1.8, energySave: 0.7, fertilizer: 0.6, note: 'Carrots are low-maintenance and high-value for home growing.' },
  basil:    { mktPrice: 12.0, rows: 6, waterSave: 0.9, energySave: 0.5, fertilizer: 0.4, note: 'Fresh basil at supermarkets is expensive. Your 6 rows are a gold mine.' },
  eggplant: { mktPrice: 5.5,  rows: 2, waterSave: 2.4, energySave: 1.3, fertilizer: 0.9, note: 'Eggplant uses more water but market price makes it worthwhile.' },
};

const WIF_NP_DATA = {
  spinach: {
    readyDays: 5, readyZone: 'Zone B lettuce', space: '1.2m²',
    impacts: [
      { name: 'Temperature', icon: 'ti-thermometer', change: '+0.5°C', dir: 'up' },
      { name: 'Humidity',    icon: 'ti-droplet',     change: '+3%',    dir: 'up' },
      { name: 'pH value',    icon: 'ti-flask',       change: 'No change', dir: 'ok' },
      { name: 'Light (h/d)', icon: 'ti-sun',         change: '-0.5h',  dir: 'down' },
      { name: 'Fertilizer',  icon: 'ti-test-pipe',   change: '+8%',    dir: 'up' },
    ],
    ai: 'Spinach thrives alongside lettuce. Humidity increase is within safe range (≤85%).',
  },
  mint: {
    readyDays: 3, readyZone: 'Zone A chives', space: '0.6m²',
    impacts: [
      { name: 'Temperature', icon: 'ti-thermometer', change: 'No change', dir: 'ok' },
      { name: 'Humidity',    icon: 'ti-droplet',     change: '+5%',    dir: 'up' },
      { name: 'pH value',    icon: 'ti-flask',       change: '-0.2',   dir: 'down' },
      { name: 'Light (h/d)', icon: 'ti-sun',         change: 'No change', dir: 'ok' },
      { name: 'Fertilizer',  icon: 'ti-test-pipe',   change: '+5%',    dir: 'up' },
    ],
    ai: 'Mint can be aggressive — consider a physical divider from neighbouring herbs.',
  },
  chili: {
    readyDays: 12, readyZone: 'Zone C eggplant', space: '2.1m²',
    impacts: [
      { name: 'Temperature', icon: 'ti-thermometer', change: '+1.5°C', dir: 'warn' },
      { name: 'Humidity',    icon: 'ti-droplet',     change: '-4%',    dir: 'down' },
      { name: 'pH value',    icon: 'ti-flask',       change: '+0.3',   dir: 'up' },
      { name: 'Light (h/d)', icon: 'ti-sun',         change: '+2h',    dir: 'up' },
      { name: 'Fertilizer',  icon: 'ti-test-pipe',   change: '+15%',   dir: 'warn' },
    ],
    ai: 'Chili needs more heat and light. You may need to adjust Zone C lighting before planting.',
  },
  cucumber: {
    readyDays: 8, readyZone: 'Zone D tomato', space: '1.8m²',
    impacts: [
      { name: 'Temperature', icon: 'ti-thermometer', change: '+1°C',      dir: 'up' },
      { name: 'Humidity',    icon: 'ti-droplet',     change: '+6%',       dir: 'up' },
      { name: 'pH value',    icon: 'ti-flask',       change: 'No change', dir: 'ok' },
      { name: 'Light (h/d)', icon: 'ti-sun',         change: '+1h',       dir: 'up' },
      { name: 'Fertilizer',  icon: 'ti-test-pipe',   change: '+12%',      dir: 'up' },
    ],
    ai: 'Cucumbers are water-heavy. Ensure your pump schedule scales with the new plant count.',
  },
  strawberry: {
    readyDays: 14, readyZone: 'Zone E herbs', space: '0.9m²',
    impacts: [
      { name: 'Temperature', icon: 'ti-thermometer', change: '-1°C',   dir: 'down' },
      { name: 'Humidity',    icon: 'ti-droplet',     change: '+2%',    dir: 'ok' },
      { name: 'pH value',    icon: 'ti-flask',       change: '-0.4',   dir: 'down' },
      { name: 'Light (h/d)', icon: 'ti-sun',         change: '+1.5h',  dir: 'up' },
      { name: 'Fertilizer',  icon: 'ti-test-pipe',   change: '+10%',   dir: 'up' },
    ],
    ai: 'Strawberries prefer cooler temps. Place them away from the heat lamp cluster for best results.',
  },
};

const WIF_ZONES = [
  { zone: 'Zone A', crop: 'Chives',   fill: 90 },
  { zone: 'Zone B', crop: 'Lettuce',  fill: 75 },
  { zone: 'Zone C', crop: 'Eggplant', fill: 95 },
  { zone: 'Zone D', crop: 'Tomato',   fill: 60 },
  { zone: 'Zone E', crop: 'Herbs',    fill: 82 },
];

/* ---------- STATE (module-scoped) ---------- */
let wif_selectedCrops = new Set(['tomato', 'carrot', 'cabbage', 'basil', 'green_onion']);
let wif_qty = 4;
let wif_savingsChart = null;

/* ============================================================
   render() — returns the full HTML string for the What-If feature
   ============================================================ */
export function render() {
  return `
    <style>
      .wif-root { padding: 0 0 80px; }
      .wif-tab-bar { display:flex; gap:8px; padding:0 0 20px; border-bottom:0.5px solid var(--border-color,#e0e0e0); margin-bottom:20px; }
      .wif-tab-btn { flex:1; padding:10px 6px; border:1px solid var(--border-color,#ddd); border-radius:10px; background:var(--bg-secondary,#f5f5f5); color:var(--text-secondary,#666); font-size:12px; font-weight:500; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px; transition:all .15s; }
      .wif-tab-btn .wif-tab-icon { font-size:20px; }
      .wif-tab-btn.active { background:var(--bg-primary,#fff); border-color:var(--accent,#639922); color:var(--text-primary,#111); }
      .wif-section { display:none; }
      .wif-section.active { display:block; }
      .wif-card { background:var(--bg-primary,#fff); border:0.5px solid var(--border-color,#e0e0e0); border-radius:12px; padding:16px 18px; margin-bottom:14px; }
      .wif-card-title { font-size:12px; font-weight:500; color:var(--text-secondary,#666); margin-bottom:12px; display:flex; align-items:center; gap:6px; }
      .wif-metric-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:14px; }
      .wif-metric { background:var(--bg-secondary,#f5f5f5); border-radius:8px; padding:12px; text-align:center; }
      .wif-metric-val { font-size:20px; font-weight:500; color:var(--text-primary,#111); }
      .wif-metric-lbl { font-size:11px; color:var(--text-secondary,#666); margin-top:2px; }
      .wif-slider-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
      .wif-slider-row label { font-size:12px; color:var(--text-secondary,#666); min-width:70px; }
      .wif-slider-row input[type=range] { flex:1; }
      .wif-slider-val { font-size:13px; font-weight:500; min-width:60px; text-align:right; }
      .wif-badge { display:inline-flex; align-items:center; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:500; }
      .wif-badge-green  { background:#EAF3DE; color:#27500A; }
      .wif-badge-amber  { background:#FAEEDA; color:#854F0B; }
      .wif-badge-teal   { background:#E1F5EE; color:#0F6E56; }
      .wif-badge-red    { background:#FCEBEB; color:#A32D2D; }
      .wif-tl-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
      .wif-tl-name { font-size:12px; min-width:88px; color:var(--text-secondary,#666); }
      .wif-tl-track { flex:1; height:8px; background:var(--bg-secondary,#f0f0f0); border-radius:4px; overflow:hidden; }
      .wif-tl-fill { height:100%; border-radius:4px; transition:width .4s; }
      .wif-tl-end { font-size:11px; min-width:52px; text-align:right; }
      .wif-crop-pills { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
      .wif-pill { display:flex; align-items:center; gap:5px; padding:6px 12px; border:0.5px solid var(--border-color,#ddd); border-radius:20px; font-size:12px; background:var(--bg-primary,#fff); cursor:pointer; transition:all .12s; }
      .wif-pill.selected { background:#EAF3DE; border-color:#639922; color:#27500A; }
      .wif-recipe-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      .wif-recipe-card { background:var(--bg-secondary,#f5f5f5); border-radius:8px; padding:12px; }
      .wif-recipe-name { font-size:13px; font-weight:500; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; }
      .wif-ingr-tag { display:inline-block; background:#EAF3DE; color:#27500A; border-radius:3px; padding:1px 5px; margin:2px; font-size:10px; }
      .wif-ingr-tag.missing { background:var(--bg-secondary,#eee); color:#aaa; text-decoration:line-through; }
      .wif-ai-note { background:#E1F5EE; border-left:3px solid #1D9E75; border-radius:0 10px 10px 0; padding:10px 14px; font-size:12px; color:#0F6E56; margin-top:12px; display:flex; gap:8px; align-items:flex-start; }
      .wif-sel { width:100%; padding:8px 10px; border:0.5px solid var(--border-color,#ddd); border-radius:8px; background:var(--bg-secondary,#f5f5f5); color:var(--text-primary,#111); font-size:13px; margin-bottom:10px; }
      .wif-savings-big { text-align:center; padding:16px 0; }
      .wif-savings-num { font-size:38px; font-weight:500; color:#3B6D11; }
      .wif-savings-lbl { font-size:12px; color:var(--text-secondary,#666); margin-top:4px; }
      .wif-cost-row { display:flex; justify-content:space-between; align-items:center; padding:8px 12px; border-radius:8px; font-size:13px; margin-bottom:6px; }
      .wif-cost-income { background:#EAF3DE; }
      .wif-cost-expense { background:#FCEBEB; }
      .wif-cost-net { background:#E1F5EE; font-weight:500; }
      .wif-cost-lbl { color:var(--text-secondary,#666); font-size:12px; }
      .wif-divider { border:none; border-top:0.5px solid var(--border-color,#e0e0e0); margin:12px 0; }
      .wif-readiness { display:flex; align-items:center; gap:12px; padding:12px; background:#E1F5EE; border-radius:8px; margin-bottom:14px; }
      .wif-readiness-title { font-size:13px; font-weight:500; color:#0F6E56; }
      .wif-readiness-sub { font-size:11px; color:var(--text-secondary,#666); margin-top:2px; }
      .wif-zone-row { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:var(--bg-secondary,#f5f5f5); border-radius:8px; margin-bottom:6px; }
      .wif-zone-name { font-size:13px; font-weight:500; }
      .wif-zone-meta { font-size:11px; color:var(--text-secondary,#666); }
      .wif-impact-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:10px; }
      .wif-impact-card { border-radius:8px; padding:12px; text-align:center; }
      .wif-impact-card.up   { background:#FAEEDA; }
      .wif-impact-card.down { background:#E6F1FB; }
      .wif-impact-card.ok   { background:#EAF3DE; }
      .wif-impact-card.warn { background:#FCEBEB; }
      .wif-impact-name { font-size:10px; color:var(--text-secondary,#666); margin:6px 0 4px; }
      .wif-impact-val { font-size:14px; font-weight:500; }
      .wif-impact-val.up   { color:#BA7517; }
      .wif-impact-val.down { color:#185FA5; }
      .wif-impact-val.ok   { color:#3B6D11; }
      .wif-impact-val.warn { color:#A32D2D; }
      .wif-qty-ctrl { display:flex; align-items:center; gap:8px; }
      .wif-qty-btn { width:26px; height:26px; border:0.5px solid var(--border-color,#ddd); border-radius:6px; background:var(--bg-secondary,#f5f5f5); color:var(--text-primary,#111); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; line-height:1; }
      .wif-qty-num { width:32px; text-align:center; font-size:13px; font-weight:500; }
      .wif-num-row { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
      .wif-num-row label { font-size:12px; color:var(--text-secondary,#666); min-width:80px; }
    </style>

    <div class="wif-root">

      <!-- TAB BAR -->
      <div class="wif-tab-bar">
        <button class="wif-tab-btn active" onclick="wifSwitchTab('harvest',this)">
          <span class="wif-tab-icon">🌿</span><span>Harvest Predict</span>
        </button>
        <button class="wif-tab-btn" onclick="wifSwitchTab('cost',this)">
          <span class="wif-tab-icon">💰</span><span>Cost Savings</span>
        </button>
        <button class="wif-tab-btn" onclick="wifSwitchTab('newplant',this)">
          <span class="wif-tab-icon">🌱</span><span>New Plant</span>
        </button>
      </div>

      <!-- ===== TAB 1: HARVEST PREDICT ===== -->
      <div id="wif-harvest" class="wif-section active">
        <div class="wif-card">
          <div class="wif-card-title">📅 Harvest timeline</div>
          <div class="wif-slider-row">
            <label>Forecast</label>
            <input type="range" min="3" max="30" value="7" step="1" id="wif-sl-days" oninput="wifUpdateHarvest()">
            <span class="wif-slider-val" id="wif-v-days">7 days</span>
          </div>
          <div class="wif-metric-grid">
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-items">6</div><div class="wif-metric-lbl">Crops ready</div></div>
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-yield">1.45 kg</div><div class="wif-metric-lbl">Est. yield</div></div>
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-days">7</div><div class="wif-metric-lbl">Days left</div></div>
          </div>
          <div id="wif-crop-timelines"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">✅ Select harvested crops</div>
          <div class="wif-crop-pills" id="wif-crop-select"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">👨‍🍳 Suggested recipes</div>
          <div class="wif-recipe-grid" id="wif-recipe-grid"></div>
          <div class="wif-ai-note">🤖 <span id="wif-ai-recipe-note">Select crops above to see recipe suggestions.</span></div>
        </div>
      </div>

      <!-- ===== TAB 2: COST SAVINGS ===== -->
      <div id="wif-cost" class="wif-section">
        <div class="wif-card">
          <div class="wif-card-title">🪴 Choose plant to analyse</div>
          <select class="wif-sel" id="wif-cost-plant" onchange="wifUpdateCost()">
            <option value="lettuce">Lettuce (5 rows)</option>
            <option value="tomato">Tomato (3 rows)</option>
            <option value="carrot">Carrot (4 rows)</option>
            <option value="basil">Basil (6 rows)</option>
            <option value="eggplant">Eggplant (2 rows)</option>
          </select>
          <div class="wif-slider-row">
            <label>Cycle (months)</label>
            <input type="range" min="1" max="6" value="1" step="1" id="wif-sl-months" oninput="wifUpdateCost()">
            <span class="wif-slider-val" id="wif-v-months">1 month</span>
          </div>
        </div>
        <div class="wif-card">
          <div class="wif-savings-big">
            <div class="wif-savings-num" id="wif-net-saving">RM 0.00</div>
            <div class="wif-savings-lbl">Net savings this cycle</div>
          </div>
          <hr class="wif-divider">
          <div id="wif-cost-breakdown"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">📊 Monthly savings trend</div>
          <div style="position:relative;height:180px;">
            <canvas id="wif-savings-chart"></canvas>
          </div>
        </div>
        <div class="wif-ai-note" style="margin-top:0;border-radius:12px;padding:14px 16px;">
          🤖 <span id="wif-cost-ai-note">Loading...</span>
        </div>
      </div>

      <!-- ===== TAB 3: NEW PLANT ===== -->
      <div id="wif-newplant" class="wif-section">
        <div class="wif-card">
          <div class="wif-card-title">🌱 Add new plant</div>
          <select class="wif-sel" id="wif-np-species" onchange="wifUpdateNewPlant()">
            <option value="spinach">Spinach</option>
            <option value="mint">Mint</option>
            <option value="chili">Chili</option>
            <option value="cucumber">Cucumber</option>
            <option value="strawberry">Strawberry</option>
          </select>
          <div class="wif-num-row">
            <label>Plants count</label>
            <div class="wif-qty-ctrl">
              <button class="wif-qty-btn" onclick="wifChangeQty(-1)">−</button>
              <span class="wif-qty-num" id="wif-qty-disp">4</span>
              <button class="wif-qty-btn" onclick="wifChangeQty(1)">+</button>
            </div>
          </div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">⏰ Planting readiness</div>
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
          <div class="wif-card-title">📈 Predicted resource impact</div>
          <div class="wif-impact-grid" id="wif-impact-grid"></div>
          <div class="wif-ai-note" style="margin-top:14px;">🤖 <span id="wif-np-ai-note">Loading...</span></div>
        </div>
      </div>

    </div>
  `;
}

/* ============================================================
   init() — call AFTER render() HTML has been injected into the DOM
   ============================================================ */
export function init() {
  // Reset module state on each mount so re-entry is clean
  wif_selectedCrops = new Set(['tomato', 'carrot', 'cabbage', 'basil', 'green_onion']);
  wif_qty = 4;
  if (wif_savingsChart) { wif_savingsChart.destroy(); wif_savingsChart = null; }

  wifUpdateHarvest();
  wifUpdateCost();
  wifUpdateNewPlant();

  // Expose interactive handlers to the global scope so inline onclick="" works
  window.wifSwitchTab    = wifSwitchTab;
  window.wifUpdateHarvest = wifUpdateHarvest;
  window.wifUpdateCost   = wifUpdateCost;
  window.wifUpdateNewPlant = wifUpdateNewPlant;
  window.wifToggleCrop   = wifToggleCrop;
  window.wifChangeQty    = wifChangeQty;
}

/* ---------- TAB SWITCH ---------- */
function wifSwitchTab(id, btn) {
  document.querySelectorAll('.wif-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.wif-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('wif-' + id).classList.add('active');
  btn.classList.add('active');
  if (id === 'cost') wifUpdateCost();
  if (id === 'newplant') wifUpdateNewPlant();
}

/* ============================================================
   TAB 1 — HARVEST PREDICT
   ============================================================ */
function wifUpdateHarvest() {
  const days = parseInt(document.getElementById('wif-sl-days').value);
  document.getElementById('wif-v-days').textContent = days + (days === 1 ? ' day' : ' days');

  const ready = WIF_CROPS.filter(c => c.readyIn <= days);
  const totalKg = ready.reduce((a, c) => a + c.kg, 0);

  document.getElementById('wif-hm-items').textContent = ready.length;
  document.getElementById('wif-hm-yield').textContent = totalKg.toFixed(2) + ' kg';
  document.getElementById('wif-hm-days').textContent = days;

  document.getElementById('wif-crop-timelines').innerHTML = WIF_CROPS.map(c => {
    const pct = Math.min(100, Math.round((days / c.readyIn) * 100));
    const rdy = c.readyIn <= days;
    return `
      <div class="wif-tl-row">
        <span class="wif-tl-name">${c.name}</span>
        <div class="wif-tl-track">
          <div class="wif-tl-fill" style="width:${pct}%;background:${rdy ? '#639922' : '#BA7517'};"></div>
        </div>
        <span class="wif-tl-end">${rdy
          ? '<span class="wif-badge wif-badge-green">Ready</span>'
          : 'Day ' + c.readyIn}</span>
      </div>`;
  }).join('');

  wifRenderCropSelect(days);
  wifRenderRecipes();
}

function wifRenderCropSelect(days) {
  const el = document.getElementById('wif-crop-select');
  const visible = WIF_CROPS.filter(c => c.readyIn <= days);
  if (visible.length === 0) {
    el.innerHTML = '<span style="font-size:12px;color:#999;">No crops ready yet — move the slider forward.</span>';
    return;
  }
  el.innerHTML = visible.map(c => `
    <div class="wif-pill ${wif_selectedCrops.has(c.id) ? 'selected' : ''}"
         onclick="wifToggleCrop('${c.id}')">
      ${c.name}
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
  const el = document.getElementById('wif-recipe-grid');
  const note = document.getElementById('wif-ai-recipe-note');

  if (wif_selectedCrops.size === 0) {
    el.innerHTML = '';
    note.textContent = 'Select crops above to see recipe suggestions.';
    return;
  }

  const scored = WIF_RECIPES.map(r => {
    const match = r.ingr.filter(i => wif_selectedCrops.has(i)).length;
    return { ...r, match, pct: Math.round((match / r.ingr.length) * 100) };
  }).sort((a, b) => b.match - a.match);

  el.innerHTML = scored.slice(0, 4).map(r => `
    <div class="wif-recipe-card">
      <div class="wif-recipe-name">
        ${r.name}
        <span class="wif-badge ${r.pct === 100 ? 'wif-badge-green' : 'wif-badge-amber'}">${r.pct}%</span>
      </div>
      <div>
        ${r.ingr.map(i => {
          const crop = WIF_CROPS.find(c => c.id === i);
          return `<span class="wif-ingr-tag ${wif_selectedCrops.has(i) ? '' : 'missing'}">${crop ? crop.name : i}</span>`;
        }).join('')}
      </div>
    </div>`).join('');

  const top = scored[0];
  note.textContent = top.pct === 100
    ? `All ingredients for ${top.name} are in your harvest — perfect timing!`
    : `${top.name} matches ${top.match}/${top.ingr.length} ingredients. Grow more to complete it.`;
}

/* ============================================================
   TAB 2 — COST SAVINGS
   ============================================================ */
function wifUpdateCost() {
  const plant = document.getElementById('wif-cost-plant')?.value;
  const monthsEl = document.getElementById('wif-sl-months');
  if (!plant || !monthsEl) return;

  const months = parseInt(monthsEl.value);
  document.getElementById('wif-v-months').textContent = months + (months === 1 ? ' month' : ' months');

  const d = WIF_COST_DATA[plant];
  const harvestKg   = d.rows * 0.28 * months;
  const income      = harvestKg * d.mktPrice;
  const waterCost   = d.waterSave * months * 0.42;
  const energyCost  = d.energySave * months * 1.10;
  const fertCost    = d.fertilizer * months;
  const expenses    = waterCost + energyCost + fertCost;
  const net         = income - expenses;

  document.getElementById('wif-net-saving').textContent = 'RM ' + net.toFixed(2);

  document.getElementById('wif-cost-breakdown').innerHTML = `
    <div class="wif-cost-row wif-cost-income">
      <span class="wif-cost-lbl">📦 Harvest value (${harvestKg.toFixed(1)} kg × RM ${d.mktPrice}/kg)</span>
      <span style="color:#3B6D11;font-weight:500;">+RM ${income.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">💧 Water cost (${(d.waterSave * months).toFixed(1)} m³)</span>
      <span style="color:#A32D2D;font-weight:500;">−RM ${waterCost.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">⚡ Energy cost (${(d.energySave * months).toFixed(1)} kWh)</span>
      <span style="color:#A32D2D;font-weight:500;">−RM ${energyCost.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">🧪 Fertilizer</span>
      <span style="color:#A32D2D;font-weight:500;">−RM ${fertCost.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-net">
      <span>⭐ Net savings</span>
      <span style="color:#0F6E56;">RM ${net.toFixed(2)}</span>
    </div>`;

  document.getElementById('wif-cost-ai-note').textContent = d.note;
  wifRenderSavingsChart(months, d);
}

function wifRenderSavingsChart(months, d) {
  const canvas = document.getElementById('wif-savings-chart');
  if (!canvas) return;

  if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    script.onload = () => wifDrawChart(canvas, months, d);
    document.head.appendChild(script);
  } else {
    wifDrawChart(canvas, months, d);
  }
}

function wifDrawChart(canvas, months, d) {
  if (wif_savingsChart) { wif_savingsChart.destroy(); wif_savingsChart = null; }

  const labels = Array.from({ length: months }, (_, i) => 'M' + (i + 1));
  const data = labels.map((_, i) => {
    const m = i + 1;
    const inc = d.rows * 0.28 * m * d.mktPrice;
    const exp = (d.waterSave * m * 0.42) + (d.energySave * m * 1.10) + (d.fertilizer * m);
    return parseFloat((inc - exp).toFixed(2));
  });

  wif_savingsChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Net savings (RM)',
        data,
        backgroundColor: '#639922',
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => 'RM ' + v },
          grid: { color: 'rgba(128,128,128,0.1)' },
        },
        x: { grid: { display: false } },
      },
    },
  });
}

/* ============================================================
   TAB 3 — NEW PLANT
   ============================================================ */
function wifChangeQty(delta) {
  wif_qty = Math.max(1, Math.min(20, wif_qty + delta));
  const el = document.getElementById('wif-qty-disp');
  if (el) el.textContent = wif_qty;
  wifUpdateNewPlant();
}

function wifUpdateNewPlant() {
  const spEl = document.getElementById('wif-np-species');
  if (!spEl) return;
  const sp = spEl.value;
  const d  = WIF_NP_DATA[sp];

  document.getElementById('wif-ready-title').textContent =
    `You can plant in ${d.readyDays} days`;
  document.getElementById('wif-ready-sub').textContent =
    `${d.readyZone} harvests on Day ${d.readyDays} — freeing ${d.space} of space.`;

  document.getElementById('wif-zone-list').innerHTML = WIF_ZONES.map(z => `
    <div class="wif-zone-row">
      <div>
        <div class="wif-zone-name">${z.zone} — ${z.crop}</div>
        <div class="wif-zone-meta">${z.fill}% capacity</div>
      </div>
      <span class="wif-badge ${z.fill >= 90 ? 'wif-badge-red' : z.fill >= 75 ? 'wif-badge-amber' : 'wif-badge-green'}">
        ${z.fill >= 90 ? 'Full' : z.fill >= 75 ? 'Near full' : 'Available'}
      </span>
    </div>`).join('');

  const scale = wif_qty / 4;
  document.getElementById('wif-impact-grid').innerHTML = d.impacts.map(imp => {
    let display = imp.change;
    if (imp.dir !== 'ok') {
      const num = parseFloat(imp.change);
      if (!isNaN(num)) {
        const scaled = num * scale;
        const sign   = scaled > 0 ? '+' : '';
        const unit   = imp.change.includes('%') ? '%'
                     : imp.change.includes('°') ? '°C'
                     : imp.change.includes('h') ? 'h' : '';
        display = sign + scaled.toFixed(1).replace('.0', '') + unit;
      }
    }
    const icons = { up: '🔺', down: '🔻', ok: '✅', warn: '⚠️' };
    return `
      <div class="wif-impact-card ${imp.dir}">
        <div style="font-size:20px;">${icons[imp.dir]}</div>
        <div class="wif-impact-name">${imp.name}</div>
        <div class="wif-impact-val ${imp.dir}">${display}</div>
      </div>`;
  }).join('');

  document.getElementById('wif-np-ai-note').textContent =
    d.ai + ` (${wif_qty} plants)`;
}