/* ============================================================
   WhatIfPro.js  —  ES Module
   export render() → HTML string
   export init()   → wire up all interactivity after render()
   ============================================================ */
   import { showScreen } from '../utils/navigation.js';
/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const PRO_CROPS = [
  { id: 'lettuce',     name: 'Lettuce',     icon: '🥬', growDays: 35, yieldKgPerRow: 4.2,  pricePerKg: 4.8,  waterLpR: 18, energyKWhpR: 2.1, fertMLpR: 120 },
  { id: 'tomato',      name: 'Tomato',      icon: '🍅', growDays: 65, yieldKgPerRow: 8.5,  pricePerKg: 7.2,  waterLpR: 34, energyKWhpR: 3.8, fertMLpR: 220 },
  { id: 'carrot',      name: 'Carrot',      icon: '🥕', growDays: 70, yieldKgPerRow: 6.0,  pricePerKg: 3.5,  waterLpR: 22, energyKWhpR: 2.4, fertMLpR: 140 },
  { id: 'cabbage',     name: 'Cabbage',     icon: '🥦', growDays: 80, yieldKgPerRow: 9.0,  pricePerKg: 3.2,  waterLpR: 28, energyKWhpR: 2.9, fertMLpR: 160 },
  { id: 'basil',       name: 'Basil',       icon: '🌿', growDays: 28, yieldKgPerRow: 1.8,  pricePerKg: 12.0, waterLpR: 10, energyKWhpR: 1.4, fertMLpR:  80 },
  { id: 'eggplant',    name: 'Eggplant',    icon: '🍆', growDays: 75, yieldKgPerRow: 7.2,  pricePerKg: 5.5,  waterLpR: 30, energyKWhpR: 3.2, fertMLpR: 190 },
  { id: 'green_onion', name: 'Green Onion', icon: '🧅', growDays: 50, yieldKgPerRow: 3.5,  pricePerKg: 4.0,  waterLpR: 14, energyKWhpR: 1.8, fertMLpR:  90 },
  { id: 'spinach',     name: 'Spinach',     icon: '🍃', growDays: 40, yieldKgPerRow: 3.8,  pricePerKg: 5.0,  waterLpR: 16, energyKWhpR: 1.9, fertMLpR: 100 },
];

const AI_SAVINGS = { water: 0.28, energy: 0.22, fert: 0.18 };
const RATES      = { waterRM: 0.42, energyRM: 1.10, fertRM: 0.085 };

const NP_SPECIES_DB = [
  { id: 'spinach',    name: 'Spinach',    icon: '🍃', temp: '+0.5', hum: '+3',  ph: '0',    light: '-0.5', fert: '+8',  readyDays: 5,  zone: 'Zone B', area: '12m²', dir: ['up','up','ok','down','up'] },
  { id: 'mint',       name: 'Mint',       icon: '🌿', temp: '0',   hum: '+5',  ph: '-0.2', light: '0',    fert: '+5',  readyDays: 3,  zone: 'Zone A', area: '6m²',  dir: ['ok','up','down','ok','up'] },
  { id: 'chili',      name: 'Chili',      icon: '🌶️', temp: '+1.5',hum: '-4',  ph: '+0.3', light: '+2',   fert: '+15', readyDays: 12, zone: 'Zone C', area: '21m²', dir: ['warn','down','up','up','warn'] },
  { id: 'cucumber',   name: 'Cucumber',   icon: '🥒', temp: '+1',  hum: '+6',  ph: '0',    light: '+1',   fert: '+12', readyDays: 8,  zone: 'Zone D', area: '18m²', dir: ['up','up','ok','up','up'] },
  { id: 'strawberry', name: 'Strawberry', icon: '🍓', temp: '-1',  hum: '+2',  ph: '-0.4', light: '+1.5', fert: '+10', readyDays: 14, zone: 'Zone E', area: '9m²',  dir: ['down','ok','down','up','up'] },
  { id: 'kale',       name: 'Kale',       icon: '🥬', temp: '-0.5',hum: '+2',  ph: '-0.1', light: '0',    fert: '+6',  readyDays: 6,  zone: 'Zone B', area: '10m²', dir: ['down','ok','ok','ok','up'] },
  { id: 'broccoli',   name: 'Broccoli',   icon: '🥦', temp: '-1',  hum: '+3',  ph: '-0.2', light: '+0.5', fert: '+9',  readyDays: 9,  zone: 'Zone C', area: '14m²', dir: ['down','up','down','up','up'] },
  { id: 'celery',     name: 'Celery',     icon: '🌾', temp: '+0.5',hum: '+8',  ph: '+0.1', light: '+1',   fert: '+11', readyDays: 7,  zone: 'Zone A', area: '8m²',  dir: ['up','warn','up','up','up'] },
];

const FARM_ZONES = [
  { id: 'A', crop: 'Chives',   rows: 12, fill: 90, harvIn: 4  },
  { id: 'B', crop: 'Lettuce',  rows: 20, fill: 75, harvIn: 7  },
  { id: 'C', crop: 'Eggplant', rows: 8,  fill: 95, harvIn: 14 },
  { id: 'D', crop: 'Tomato',   rows: 15, fill: 60, harvIn: 21 },
  { id: 'E', crop: 'Herbs',    rows: 10, fill: 82, harvIn: 10 },
];

const NP_AI_NOTES = {
  spinach:    'Spinach co-exists well with leafy crops. No special zone separation needed.',
  mint:       'Mint spreads aggressively. Use root barriers to protect neighbouring zones.',
  chili:      'Chili requires dedicated lighting adjustment in Zone C before introduction.',
  cucumber:   'Scale water pump duty cycle proportionally with new row count.',
  strawberry: 'Position away from heat lamp clusters — Zone E end-row preferred.',
  kale:       'Kale is cold-tolerant. Ideal companion for Zone B lettuce rows.',
  broccoli:   'Space 30 cm apart for airflow. Monitor for aphids in high-humidity zones.',
  celery:     'High water demand — prioritise pump schedule before adding rows.',
};

/* ─────────────────────────────────────────────
   MODULE STATE  (reset on every init() call)
───────────────────────────────────────────── */
let _chart      = null;
let _npQty      = 10;
let _npSpecies  = NP_SPECIES_DB[0];
let _npFiltered = [...NP_SPECIES_DB];

/* ─────────────────────────────────────────────
   STYLES  (injected once into <head>)
───────────────────────────────────────────── */
function _injectStyles() {
  if (document.getElementById('pro-wif-styles')) return;
  const s = document.createElement('style');
  s.id = 'pro-wif-styles';
  s.textContent = `
    .pro-wif{font-family:'DM Mono','Courier New',monospace;background:#080E1A;color:#C9D8F5;padding:0 0 100px;min-height:100%;}
    .pro-tabs{display:flex;border-bottom:1px solid #1C2D4A;background:#080E1A;position:sticky;top:0;z-index:10;}
    .pro-tab{flex:1;padding:14px 6px 12px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#3D5A80;border:none;background:transparent;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px;}
    .pro-tab .pro-tab-ico{font-size:18px;}
    .pro-tab.active{color:#60C0FF;border-bottom-color:#60C0FF;}
    .pro-tab:hover:not(.active){color:#7AB0D8;}
    .pro-sec{display:none;padding:16px;}
    .pro-sec.active{display:block;}
    .pro-card{background:#0D1627;border:1px solid #1C2D4A;border-radius:10px;padding:16px;margin-bottom:12px;}
    .pro-card-hd{font-size:9px;font-weight:700;letter-spacing:.18em;color:#3D5A80;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:6px;}
    .pro-card-hd::before{content:'';display:inline-block;width:3px;height:12px;background:#60C0FF;border-radius:2px;}
    .pro-sel{width:100%;padding:9px 12px;border:1px solid #1C2D4A;border-radius:8px;background:#060C18;color:#C9D8F5;font-family:inherit;font-size:12px;margin-bottom:10px;}
    .pro-slider-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
    .pro-slider-row label{font-size:10px;color:#3D5A80;min-width:80px;letter-spacing:.05em;}
    .pro-slider-row input[type=range]{flex:1;accent-color:#60C0FF;}
    .pro-slider-val{font-size:12px;font-weight:700;color:#60C0FF;min-width:60px;text-align:right;}
    .pro-input{background:#060C18;border:1px solid #1C2D4A;border-radius:8px;color:#C9D8F5;font-family:inherit;font-size:12px;padding:9px 12px;width:100%;}
    .pro-input:focus{outline:none;border-color:#60C0FF;}
    .pro-kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
    .pro-kpi{background:#060C18;border:1px solid #1C2D4A;border-radius:8px;padding:12px;text-align:center;}
    .pro-kpi-val{font-size:20px;font-weight:700;color:#60C0FF;}
    .pro-kpi-lbl{font-size:9px;letter-spacing:.1em;color:#3D5A80;margin-top:3px;text-transform:uppercase;}
    .pro-table{width:100%;border-collapse:collapse;font-size:11px;}
    .pro-table th{color:#3D5A80;font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:6px 8px;border-bottom:1px solid #1C2D4A;text-align:left;font-weight:700;}
    .pro-table td{padding:9px 8px;border-bottom:1px solid #0D1627;color:#C9D8F5;}
    .pro-table tr:last-child td{border-bottom:none;}
    .pro-table tr:hover td{background:#0D1E36;}
    .pro-badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:.06em;}
    .pro-badge-green{background:#0A2E1A;color:#2C9A5C;border:1px solid #1A5C35;}
    .pro-badge-amber{background:#2A1E06;color:#D4A017;border:1px solid #5C3D0A;}
    .pro-badge-red{background:#2A0A0A;color:#E24B4A;border:1px solid #5C1A1A;}
    .pro-badge-blue{background:#0A1E3A;color:#60C0FF;border:1px solid #1A4070;}
    .pro-bar-track{height:4px;background:#0D1627;border-radius:2px;overflow:hidden;}
    .pro-bar-fill{height:100%;border-radius:2px;transition:width .5s;}
    .pro-breakdown{display:flex;flex-direction:column;gap:6px;}
    .pro-brow{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:8px;font-size:12px;}
    .pro-brow-income{background:#071C10;border:1px solid #1A5C35;}
    .pro-brow-expense{background:#1A0A0A;border:1px solid #3D1515;}
    .pro-brow-ai{background:#071530;border:1px solid #1A3A6A;}
    .pro-brow-net{background:#061528;border:1px solid #60C0FF;}
    .pro-brow-lbl{font-size:10px;color:#3D5A80;}
    .pro-savings-hl{text-align:center;padding:18px 0 10px;}
    .pro-savings-num{font-size:44px;font-weight:700;color:#00FF88;letter-spacing:-.02em;line-height:1;}
    .pro-savings-lbl{font-size:10px;letter-spacing:.15em;color:#3D5A80;margin-top:6px;text-transform:uppercase;}
    .pro-savings-sub{font-size:11px;color:#2C9A5C;margin-top:8px;}
    .pro-impact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px;}
    .pro-impact-card{border-radius:8px;padding:12px;text-align:center;}
    .pro-impact-card.up{background:#1E1400;border:1px solid #4A3200;}
    .pro-impact-card.down{background:#00101E;border:1px solid #003055;}
    .pro-impact-card.ok{background:#001A0E;border:1px solid #003520;}
    .pro-impact-card.warn{background:#1E0000;border:1px solid #5A0000;}
    .pro-impact-icon{font-size:20px;margin-bottom:4px;}
    .pro-impact-name{font-size:9px;letter-spacing:.1em;color:#3D5A80;text-transform:uppercase;margin-bottom:4px;}
    .pro-impact-val{font-size:15px;font-weight:700;}
    .pro-impact-val.up{color:#D4A017;}.pro-impact-val.down{color:#60C0FF;}.pro-impact-val.ok{color:#2C9A5C;}.pro-impact-val.warn{color:#E24B4A;}
    .pro-qty-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
    .pro-qty-row label{font-size:10px;color:#3D5A80;min-width:80px;letter-spacing:.05em;}
    .pro-qty-ctrl{display:flex;align-items:center;gap:8px;}
    .pro-qty-btn{width:28px;height:28px;border:1px solid #1C2D4A;border-radius:6px;background:#060C18;color:#C9D8F5;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
    .pro-qty-btn:hover{border-color:#60C0FF;color:#60C0FF;}
    .pro-qty-num{width:40px;text-align:center;font-size:14px;font-weight:700;color:#60C0FF;}
    .pro-search-wrap{position:relative;margin-bottom:10px;}
    .pro-search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#3D5A80;font-size:14px;}
    .pro-suggest-list{background:#0D1627;border:1px solid #1C2D4A;border-radius:8px;overflow:hidden;margin-bottom:10px;}
    .pro-suggest-item{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;font-size:12px;transition:background .1s;}
    .pro-suggest-item:hover,.pro-suggest-item.selected{background:#0D1E36;color:#60C0FF;}
    .pro-suggest-item .sp-ico{font-size:18px;}
    .pro-zone-row{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#060C18;border-radius:8px;margin-bottom:6px;border:1px solid #1C2D4A;}
    .pro-zone-id{width:28px;height:28px;border-radius:6px;background:#1C2D4A;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#60C0FF;flex-shrink:0;}
    .pro-zone-info{flex:1;}
    .pro-zone-name{font-size:12px;font-weight:700;}
    .pro-zone-meta{font-size:10px;color:#3D5A80;margin-top:2px;}
    .pro-zone-meter{margin-top:5px;}
    .pro-ai-note{background:#06101E;border-left:3px solid #60C0FF;border-radius:0 8px 8px 0;padding:10px 14px;font-size:11px;color:#7AB0D8;margin-top:12px;display:flex;gap:8px;align-items:flex-start;}
    .pro-ai-note .ai-ico{flex-shrink:0;font-size:16px;}
    .pro-hr{border:none;border-top:1px solid #1C2D4A;margin:12px 0;}
    .pro-week-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
    .pro-week-lbl{font-size:9px;letter-spacing:.08em;color:#3D5A80;min-width:48px;text-transform:uppercase;}
    .pro-week-dots{display:flex;gap:3px;flex:1;}
    .pro-week-dot{width:10px;height:10px;border-radius:2px;background:#1C2D4A;}
    .pro-week-dot.done{background:#2C9A5C;}
    .pro-week-dot.active{background:#60C0FF;}
    .pro-week-dot.harvest{background:#D4A017;}
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

      <div class="pro-tabs">
        <button class="pro-tab active" data-pro-tab="forecast">
          <span class="pro-tab-ico">📊</span>HARVEST<br>FORECAST
        </button>
        <button class="pro-tab" data-pro-tab="cost">
          <span class="pro-tab-ico">💰</span>COST &amp;<br>SAVINGS
        </button>
        <button class="pro-tab" data-pro-tab="newplant">
          <span class="pro-tab-ico">➕</span>NEW PLANT<br>IMPACT
        </button>
      </div>

      <!-- TAB 1: HARVEST FORECAST -->
      <div id="pro-forecast" class="pro-sec active">
        <div class="pro-card">
          <div class="pro-card-hd">Forecast period</div>
          <div class="pro-slider-row">
            <label>Days ahead</label>
            <input type="range" min="7" max="120" value="30" step="1" id="pro-sl-days">
            <span class="pro-slider-val" id="pro-v-days">30 days</span>
          </div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Summary KPIs</div>
          <div class="pro-kpi-grid">
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-rows">—</div><div class="pro-kpi-lbl">Rows ready</div></div>
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-kg">—</div><div class="pro-kpi-lbl">Total yield</div></div>
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-rev">—</div><div class="pro-kpi-lbl">Est. Revenue</div></div>
          </div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Crop-by-crop forecast</div>
          <table class="pro-table">
            <thead><tr><th>Crop</th><th>Rows</th><th>Yield (kg)</th><th>Revenue</th><th>Status</th></tr></thead>
            <tbody id="pro-forecast-rows"></tbody>
          </table>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Harvest readiness timeline</div>
          <div id="pro-tl-bars"></div>
        </div>
      </div>

      <!-- TAB 2: COST & SAVINGS -->
      <div id="pro-cost" class="pro-sec">
        <div class="pro-card">
          <div class="pro-card-hd">Configure crop</div>
          <select class="pro-sel" id="pro-cost-plant">
            ${PRO_CROPS.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}
          </select>
          <div class="pro-slider-row">
            <label>Rows planted</label>
            <input type="range" min="5" max="200" value="50" step="5" id="pro-cost-rows">
            <span class="pro-slider-val" id="pro-v-rows">50</span>
          </div>
          <div class="pro-slider-row">
            <label>Cycle (weeks)</label>
            <input type="range" min="1" max="16" value="4" step="1" id="pro-cost-weeks">
            <span class="pro-slider-val" id="pro-v-weeks">4 wk</span>
          </div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Grow cycle timeline</div>
          <div id="pro-cycle-timeline"></div>
        </div>
        <div class="pro-card">
          <div class="pro-savings-hl">
            <div class="pro-savings-num" id="pro-net-saving">RM 0</div>
            <div class="pro-savings-lbl">Net profit this cycle</div>
            <div class="pro-savings-sub" id="pro-ai-saved-lbl">AI guidance saved: calculating…</div>
          </div>
          <hr class="pro-hr">
          <div class="pro-breakdown" id="pro-cost-breakdown"></div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">AI-guided resource savings vs manual</div>
          <div id="pro-ai-savings-grid"></div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Weekly profit trend</div>
          <div style="position:relative;height:160px;">
            <canvas id="pro-savings-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- TAB 3: NEW PLANT IMPACT -->
      <div id="pro-newplant" class="pro-sec">
        <div class="pro-card">
          <div class="pro-card-hd">Species search</div>
          <div class="pro-search-wrap">
            <span class="pro-search-ico">🔍</span>
            <input class="pro-input" id="pro-np-search" placeholder="Type to search species…" style="padding-left:32px;">
          </div>
          <div class="pro-suggest-list" id="pro-np-suggestions"></div>
          <div class="pro-qty-row">
            <label>Plant rows</label>
            <div class="pro-qty-ctrl">
              <button class="pro-qty-btn" id="pro-qty-dec">−</button>
              <span class="pro-qty-num" id="pro-qty-disp">10</span>
              <button class="pro-qty-btn" id="pro-qty-inc">+</button>
            </div>
          </div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Planting readiness</div>
          <div id="pro-readiness-block"></div>
          <div class="pro-card-hd" style="margin-top:14px;">Zone utilisation</div>
          <div id="pro-zone-list"></div>
        </div>
        <div class="pro-card">
          <div class="pro-card-hd">Predicted resource delta</div>
          <div class="pro-impact-grid" id="pro-impact-grid"></div>
          <div class="pro-ai-note"><span class="ai-ico">🤖</span><span id="pro-np-ai"></span></div>
        </div>
      </div>

    </div>
  `;
}

/* ─────────────────────────────────────────────
   EXPORT: init()
   Call immediately after render() HTML is in the DOM.
───────────────────────────────────────────── */
export function init() {
  // Reset state on every open so re-mounts are clean
  _chart      = null;
  _npQty      = 10;
  _npSpecies  = NP_SPECIES_DB[0];
  _npFiltered = [...NP_SPECIES_DB];

  _bindTabs();
  _bindForecast();
  _bindCost();
  _bindNewPlant();

  _updateForecast();
  _updateCost();
  _npRenderSuggestions();
  _npRender();
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
      if (id === 'cost') _updateCost(); // re-draw chart when tab becomes visible
    });
  });
}

/* ─────────────────────────────────────────────
   TAB 1 — HARVEST FORECAST
───────────────────────────────────────────── */
function _bindForecast() {
  document.getElementById('pro-sl-days')?.addEventListener('input', _updateForecast);
}

function _updateForecast() {
  const days = parseInt(document.getElementById('pro-sl-days')?.value || 30);
  document.getElementById('pro-v-days').textContent = days + ' days';

  let totalRows = 0, totalKg = 0, totalRev = 0;
  const rows = PRO_CROPS.map(c => {
    const cyclesDone = Math.floor(days / c.growDays);
    const partialPct = ((days % c.growDays) / c.growDays * 100).toFixed(0);
    const isReady    = days >= c.growDays;
    const rowCount   = isReady ? Math.max(1, cyclesDone * 8) : 0;
    const kg         = rowCount * c.yieldKgPerRow;
    const rev        = kg * c.pricePerKg;
    if (isReady) { totalRows += rowCount; totalKg += kg; totalRev += rev; }
    return { c, rowCount, kg, rev, isReady, cyclesDone, partialPct };
  });

  document.getElementById('pro-kpi-rows').textContent = totalRows;
  document.getElementById('pro-kpi-kg').textContent   = totalKg.toFixed(0) + ' kg';
  document.getElementById('pro-kpi-rev').textContent  = 'RM ' + totalRev.toFixed(0);

  document.getElementById('pro-forecast-rows').innerHTML = rows.map(r => `
    <tr>
      <td>${r.c.icon} ${r.c.name}</td>
      <td style="color:#60C0FF;font-weight:700;">${r.isReady ? r.rowCount : '—'}</td>
      <td>${r.isReady ? r.kg.toFixed(1) + ' kg' : '—'}</td>
      <td>${r.isReady ? '<span style="color:#00FF88;">RM ' + r.rev.toFixed(0) + '</span>' : '—'}</td>
      <td>${r.isReady
        ? `<span class="pro-badge pro-badge-green">READY ×${r.cyclesDone}</span>`
        : `<span class="pro-badge pro-badge-amber">${r.partialPct}%</span>`}
      </td>
    </tr>`).join('');

  document.getElementById('pro-tl-bars').innerHTML = rows.map(r => {
    const pct  = Math.min(100, (days / r.c.growDays) * 100);
    const fill = r.isReady ? '#00FF88' : '#D4A017';
    return `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="font-size:11px;min-width:90px;color:#3D5A80;">${r.c.name}</span>
        <div class="pro-bar-track" style="flex:1;">
          <div class="pro-bar-fill" style="width:${pct.toFixed(0)}%;background:${fill};"></div>
        </div>
        <span style="font-size:10px;min-width:54px;text-align:right;">
          ${r.isReady
            ? `<span class="pro-badge pro-badge-green">Day ${r.c.growDays}</span>`
            : `Day ${r.c.growDays}`}
        </span>
      </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   TAB 2 — COST & SAVINGS
───────────────────────────────────────────── */
function _bindCost() {
  document.getElementById('pro-cost-plant')?.addEventListener('change', _updateCost);
  document.getElementById('pro-cost-rows')?.addEventListener('input',  _updateCost);
  document.getElementById('pro-cost-weeks')?.addEventListener('input', _updateCost);
}

function _updateCost() {
  const cropId = document.getElementById('pro-cost-plant')?.value || 'lettuce';
  const rows   = parseInt(document.getElementById('pro-cost-rows')?.value  || 50);
  const weeks  = parseInt(document.getElementById('pro-cost-weeks')?.value || 4);

  document.getElementById('pro-v-rows').textContent  = rows;
  document.getElementById('pro-v-weeks').textContent = weeks + ' wk';

  const d = PRO_CROPS.find(c => c.id === cropId) || PRO_CROPS[0];

  // Grow cycle timeline
  const growWeeks = Math.ceil(d.growDays / 7);
  document.getElementById('pro-cycle-timeline').innerHTML = ['Seedling','Vegetative','Harvest'].map((phase, pi) => {
    const phaseStart = Math.round(pi * growWeeks / 3);
    const phaseEnd   = Math.round((pi + 1) * growWeeks / 3);
    const dots = Array.from({ length: Math.min(weeks, 16) }, (_, i) => {
      const cls = i < phaseStart ? 'done'
                : i < phaseEnd && i < weeks ? (i === Math.min(weeks, growWeeks) - 1 ? 'harvest' : 'active')
                : '';
      return `<div class="pro-week-dot ${cls}" title="Week ${i + 1}"></div>`;
    }).join('');
    return `
      <div class="pro-week-row">
        <span class="pro-week-lbl">${phase.substring(0, 8)}</span>
        <div class="pro-week-dots">${dots}</div>
        <span style="font-size:9px;color:#3D5A80;min-width:24px;">W${phaseEnd}</span>
      </div>`;
  }).join('');

  // Financials
  const harvestKg    = rows * d.yieldKgPerRow * (weeks / (d.growDays / 7));
  const income       = harvestKg * d.pricePerKg;
  const waterManual  = rows * d.waterLpR    * weeks * RATES.waterRM  / 1000;
  const energyManual = rows * d.energyKWhpR * weeks * RATES.energyRM;
  const fertManual   = rows * d.fertMLpR    * weeks * RATES.fertRM;
  const waterAI      = waterManual  * (1 - AI_SAVINGS.water);
  const energyAI     = energyManual * (1 - AI_SAVINGS.energy);
  const fertAI       = fertManual   * (1 - AI_SAVINGS.fert);
  const aiSaved      = (waterManual - waterAI) + (energyManual - energyAI) + (fertManual - fertAI);
  const net          = income - (waterAI + energyAI + fertAI);

  document.getElementById('pro-net-saving').textContent   = 'RM ' + net.toFixed(0);
  document.getElementById('pro-ai-saved-lbl').textContent = `AI guidance saved: RM ${aiSaved.toFixed(2)} vs manual farming`;

  document.getElementById('pro-cost-breakdown').innerHTML = `
    <div class="pro-brow pro-brow-income">
      <span class="pro-brow-lbl">📦 Harvest revenue (${harvestKg.toFixed(0)} kg × RM ${d.pricePerKg}/kg)</span>
      <span style="color:#00FF88;font-weight:700;">+RM ${income.toFixed(2)}</span>
    </div>
    <div class="pro-brow pro-brow-expense">
      <span class="pro-brow-lbl">💧 Water — AI-optimised (${(rows * d.waterLpR * weeks / 1000 * (1 - AI_SAVINGS.water)).toFixed(1)} m³)</span>
      <span style="color:#E24B4A;font-weight:700;">−RM ${waterAI.toFixed(2)}</span>
    </div>
    <div class="pro-brow pro-brow-expense">
      <span class="pro-brow-lbl">⚡ Energy — AI-optimised (${(rows * d.energyKWhpR * weeks * (1 - AI_SAVINGS.energy)).toFixed(1)} kWh)</span>
      <span style="color:#E24B4A;font-weight:700;">−RM ${energyAI.toFixed(2)}</span>
    </div>
    <div class="pro-brow pro-brow-expense">
      <span class="pro-brow-lbl">🧪 Fertilizer — AI-optimised</span>
      <span style="color:#E24B4A;font-weight:700;">−RM ${fertAI.toFixed(2)}</span>
    </div>
    <div class="pro-brow pro-brow-ai">
      <span class="pro-brow-lbl">🤖 AI guidance total savings vs manual</span>
      <span style="color:#60C0FF;font-weight:700;">+RM ${aiSaved.toFixed(2)}</span>
    </div>
    <div class="pro-brow pro-brow-net">
      <span style="font-weight:700;">⭐ NET PROFIT</span>
      <span style="color:#00FF88;font-weight:700;font-size:15px;">RM ${net.toFixed(2)}</span>
    </div>`;

  document.getElementById('pro-ai-savings-grid').innerHTML = [
    { icon:'💧', label:'Water saved',      unit:'m³',  manual:(rows*d.waterLpR*weeks/1000).toFixed(2),    ai:(rows*d.waterLpR*weeks/1000*(1-AI_SAVINGS.water)).toFixed(2),    saved:waterManual-waterAI,   pct:(AI_SAVINGS.water*100).toFixed(0),  how:`Smart irrigation pulses vs constant flow — ${(AI_SAVINGS.water*100).toFixed(0)}% reduction` },
    { icon:'⚡', label:'Energy saved',     unit:'kWh', manual:(rows*d.energyKWhpR*weeks).toFixed(1),       ai:(rows*d.energyKWhpR*weeks*(1-AI_SAVINGS.energy)).toFixed(1),      saved:energyManual-energyAI, pct:(AI_SAVINGS.energy*100).toFixed(0), how:`Adaptive LED spectrum scheduling — ${(AI_SAVINGS.energy*100).toFixed(0)}% reduction` },
    { icon:'🧪', label:'Fertilizer saved', unit:'mL',  manual:(rows*d.fertMLpR*weeks).toFixed(0),          ai:(rows*d.fertMLpR*weeks*(1-AI_SAVINGS.fert)).toFixed(0),           saved:fertManual-fertAI,     pct:(AI_SAVINGS.fert*100).toFixed(0),   how:`EC/pH closed-loop dosing — ${(AI_SAVINGS.fert*100).toFixed(0)}% reduction` },
  ].map(item => `
    <div style="background:#060C18;border:1px solid #1C2D4A;border-radius:8px;padding:12px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:12px;font-weight:700;">${item.icon} ${item.label}</span>
        <span class="pro-badge pro-badge-green">−${item.pct}%</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px;">
        <div style="text-align:center;"><div style="font-size:9px;color:#3D5A80;text-transform:uppercase;letter-spacing:.08em;">Manual</div><div style="font-size:13px;font-weight:700;color:#E24B4A;">${item.manual} ${item.unit}</div></div>
        <div style="text-align:center;"><div style="font-size:9px;color:#3D5A80;text-transform:uppercase;letter-spacing:.08em;">AI-guided</div><div style="font-size:13px;font-weight:700;color:#00FF88;">${item.ai} ${item.unit}</div></div>
        <div style="text-align:center;"><div style="font-size:9px;color:#3D5A80;text-transform:uppercase;letter-spacing:.08em;">Saved</div><div style="font-size:13px;font-weight:700;color:#60C0FF;">RM ${item.saved.toFixed(2)}</div></div>
      </div>
      <div style="font-size:9px;color:#3D5A80;letter-spacing:.04em;">${item.how}</div>
    </div>`).join('');

  _drawSavingsChart(d, rows, weeks);
}

function _drawSavingsChart(d, rows, weeks) {
  const canvas = document.getElementById('pro-savings-chart');
  if (!canvas) return;
  const draw = () => {
    if (_chart) { _chart.destroy(); _chart = null; }
    const labels = Array.from({ length: weeks }, (_, i) => 'W' + (i + 1));
    const data   = labels.map((_, i) => {
      const m    = i + 1;
      const inc  = rows * d.yieldKgPerRow * (m / (d.growDays / 7)) * d.pricePerKg;
      const cost = (rows * d.waterLpR    * m / 1000 * RATES.waterRM  * (1 - AI_SAVINGS.water))
                 + (rows * d.energyKWhpR * m         * RATES.energyRM * (1 - AI_SAVINGS.energy))
                 + (rows * d.fertMLpR    * m          * RATES.fertRM   * (1 - AI_SAVINGS.fert));
      return parseFloat((inc - cost).toFixed(2));
    });
    _chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Net profit (RM)',
          data,
          backgroundColor: data.map(v => v >= 0 ? '#00FF8844' : '#E24B4A44'),
          borderColor:      data.map(v => v >= 0 ? '#00FF88'   : '#E24B4A'),
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { callback: v => 'RM ' + v, color: '#3D5A80', font: { family: 'DM Mono,monospace', size: 10 } }, grid: { color: '#1C2D4A' } },
          x: { ticks: { color: '#3D5A80', font: { family: 'DM Mono,monospace', size: 10 } }, grid: { display: false } },
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
   TAB 3 — NEW PLANT IMPACT
───────────────────────────────────────────── */
function _bindNewPlant() {
  document.getElementById('pro-np-search')?.addEventListener('input', () => {
    const q = (document.getElementById('pro-np-search').value || '').toLowerCase().trim();
    _npFiltered = q
      ? NP_SPECIES_DB.filter(s => s.name.toLowerCase().includes(q) || s.id.includes(q))
      : [...NP_SPECIES_DB];
    _npRenderSuggestions();
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
  el.innerHTML = _npFiltered.slice(0, 6).map(s => `
    <div class="pro-suggest-item ${s.id === _npSpecies.id ? 'selected' : ''}" data-np-id="${s.id}">
      <span class="sp-ico">${s.icon}</span>
      <span>${s.name}</span>
      <span style="margin-left:auto;font-size:9px;color:#3D5A80;">Ready in ${s.readyDays}d</span>
    </div>`).join('');

  el.querySelectorAll('.pro-suggest-item').forEach(item => {
    item.addEventListener('click', () => {
      _npSpecies = NP_SPECIES_DB.find(s => s.id === item.getAttribute('data-np-id')) || NP_SPECIES_DB[0];
      _npRenderSuggestions();
      _npRender();
    });
  });
}

function _npRender() {
  const sp = _npSpecies;

  const rb = document.getElementById('pro-readiness-block');
  if (rb) rb.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#06101E;border:1px solid #1A3A6A;border-radius:8px;margin-bottom:12px;">
      <span style="font-size:28px;">${sp.icon}</span>
      <div>
        <div style="font-size:13px;font-weight:700;color:#60C0FF;">Plant ${_npQty} rows of ${sp.name} in ${sp.readyDays} days</div>
        <div style="font-size:10px;color:#3D5A80;margin-top:3px;">${sp.zone} becomes available — ${sp.area} freed after current cycle ends</div>
      </div>
    </div>`;

  const zl = document.getElementById('pro-zone-list');
  if (zl) zl.innerHTML = FARM_ZONES.map(z => {
    const cls       = z.fill >= 90 ? 'pro-badge-red' : z.fill >= 75 ? 'pro-badge-amber' : 'pro-badge-green';
    const lbl       = z.fill >= 90 ? 'FULL' : z.fill >= 75 ? 'NEAR FULL' : 'AVAILABLE';
    const fillColor = z.fill >= 90 ? '#E24B4A' : z.fill >= 75 ? '#D4A017' : '#2C9A5C';
    return `
      <div class="pro-zone-row">
        <div class="pro-zone-id">${z.id}</div>
        <div class="pro-zone-info">
          <div class="pro-zone-name">${z.crop} <span style="font-size:10px;color:#3D5A80;">· ${z.rows} rows</span></div>
          <div class="pro-zone-meta">Harvest in ${z.harvIn} days</div>
          <div class="pro-zone-meter">
            <div class="pro-bar-track"><div class="pro-bar-fill" style="width:${z.fill}%;background:${fillColor};"></div></div>
          </div>
        </div>
        <span class="pro-badge ${cls}" style="margin-left:8px;">${lbl}</span>
      </div>`;
  }).join('');

  const scale = _npQty / 10;
  const RESOURCES = [
    { name: 'Temperature', icon: '🌡️', unit: '°C',  raw: sp.temp  },
    { name: 'Humidity',    icon: '💧', unit: '%',   raw: sp.hum   },
    { name: 'pH Level',    icon: '⚗️',  unit: '',    raw: sp.ph    },
    { name: 'Light',       icon: '☀️',  unit: 'h/d', raw: sp.light },
    { name: 'Fertilizer',  icon: '🧪', unit: '%',   raw: sp.fert  },
  ];
  const DIR_ICONS = { up: '▲', down: '▼', ok: '●', warn: '⚠' };

  const ig = document.getElementById('pro-impact-grid');
  if (ig) ig.innerHTML = RESOURCES.map((r, i) => {
    const dir = sp.dir[i];
    const num = parseFloat(r.raw);
    let display = r.raw === '0' ? 'No Δ' : r.raw + r.unit;
    if (!isNaN(num) && r.raw !== '0') {
      const scaled = num * scale;
      display = (scaled > 0 ? '+' : '') + scaled.toFixed(1).replace('.0', '') + r.unit;
    }
    return `
      <div class="pro-impact-card ${dir}">
        <div class="pro-impact-icon">${r.icon}</div>
        <div class="pro-impact-name">${r.name}</div>
        <div class="pro-impact-val ${dir}">${DIR_ICONS[dir]} ${display}</div>
      </div>`;
  }).join('');

  const aiNote = document.getElementById('pro-np-ai');
  if (aiNote) {
    const warnings = sp.dir.filter(d => d === 'warn').length;
    const note     = NP_AI_NOTES[sp.id] || 'Monitor environment for 48h after introduction.';
    aiNote.textContent = warnings > 0
      ? `⚠ Adding ${_npQty} rows of ${sp.name} triggers ${warnings} resource warning(s). Review flagged parameters before planting. ${note}`
      : `✅ ${_npQty} rows of ${sp.name} — resource impact within acceptable range. ${note}`;
  }
}

export function renderScreen() {
  const container = document.getElementById('screenContainer');
  container.innerHTML = `
      <div class="screen active" id="whatifProScreen">
          <div style="display:flex; align-items:center; padding:12px 16px; background:#080E1A; gap:12px; border-bottom:1px solid #1C2D4A;">
              <button id="whatifProBackBtn" style="background:transparent; border:none; color:#60A5FA; font-size:16px; cursor:pointer;">← Back</button>
              <div style="font-weight:700; color:#C9D8F5;">🔮 What-If Pro</div>
          </div>
          <div style="flex:1; overflow-y:auto;">${render()}</div>
      </div>
  `;
  document.getElementById('whatifProBackBtn').addEventListener('click', () => showScreen('dash-c'));
  init();
}