/* ============================================================
   MODULE: FEATURE - WHAT IF
   WhatIf.js — self-contained module, no external dependencies except Chart.js (lazy-loaded)
   Export: { render, init }
   ============================================================ */

import { AppState } from '../store.js';

/* ---------- DATA ---------- */
// MODIFIED: added `emoji` field to each crop; added `units` field for exact harvest count display
const WIF_CROPS = [
  { id: 'tomato',      name: 'Tomato',      emoji: '🍅', days: 5,  kg: 0.32, units: 4,  readyIn: 5,  color: '#D85A30' },
  { id: 'carrot',      name: 'Carrot',      emoji: '🥕', days: 8,  kg: 0.24, units: 6,  readyIn: 8,  color: '#BA7517' },
  { id: 'cabbage',     name: 'Cabbage',     emoji: '🥬', days: 7,  kg: 0.41, units: 2,  readyIn: 7,  color: '#639922' },
  { id: 'eggplant',    name: 'Eggplant',    emoji: '🍆', days: 11, kg: 0.28, units: 3,  readyIn: 11, color: '#534AB7' },
  { id: 'basil',       name: 'Basil',       emoji: '🌿', days: 4,  kg: 0.09, units: 10, readyIn: 4,  color: '#1D9E75' },
  { id: 'green_onion', name: 'Green Onion', emoji: '🧅', days: 6,  kg: 0.11, units: 8,  readyIn: 6,  color: '#3B6D11' },
];

// MODIFIED: added `emoji` field to each recipe for food-appealing visual presentation
const WIF_RECIPES = [
  { name: 'Bolognese Pasta',    emoji: '🍝', ingr: ['tomato', 'carrot', 'basil'] },
  { name: 'ABC Soup',           emoji: '🍲', ingr: ['cabbage', 'carrot', 'tomato', 'green_onion'] },
  { name: 'Grilled Eggplant',   emoji: '🍽️', ingr: ['eggplant', 'basil'] },
  { name: 'Spring Green Salad', emoji: '🥗', ingr: ['green_onion', 'basil', 'cabbage'] },
];

// MODIFIED: removed `rows` from data (now user-controlled via stepper); renamed to `perRowKgWk` for week-based calculation
const WIF_COST_DATA = {
  lettuce:  { mktPrice: 4.8,  perRowKgWk: 0.28, waterSave: 3.2, energySave: 1.1, fertilizer: 0.8, note: 'Lettuce grows fast — your rows beat supermarket prices by 2× this month.' },
  tomato:   { mktPrice: 7.2,  perRowKgWk: 0.28, waterSave: 2.1, energySave: 0.9, fertilizer: 1.1, note: 'Tomatoes fetched RM 7.20/kg at Pasar Borong this week. Yours cost much less.' },
  carrot:   { mktPrice: 3.5,  perRowKgWk: 0.28, waterSave: 1.8, energySave: 0.7, fertilizer: 0.6, note: 'Carrots are low-maintenance and high-value for home growing.' },
  basil:    { mktPrice: 12.0, perRowKgWk: 0.28, waterSave: 0.9, energySave: 0.5, fertilizer: 0.4, note: 'Fresh basil at supermarkets is expensive. Your rows are a gold mine.' },
  eggplant: { mktPrice: 5.5,  perRowKgWk: 0.28, waterSave: 2.4, energySave: 1.3, fertilizer: 0.9, note: 'Eggplant uses more water but market price makes it worthwhile.' },
};

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
      { name: 'Temperature', emoji: '🌡️', change: '+1.5°C', dir: 'warn' },
      { name: 'Humidity',    emoji: '💧',  change: '-4%',    dir: 'down' },
      { name: 'pH value',    emoji: '🧪',  change: '+0.3',   dir: 'up'   },
      { name: 'Light (h/d)', emoji: '☀️',  change: '+2h',    dir: 'up'   },
      { name: 'Fertilizer',  emoji: '🧫',  change: '+15%',   dir: 'warn' },
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
      { name: 'Humidity',    emoji: '💧',  change: '+2%',    dir: 'ok'   },
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
          <span class="wif-tab-icon">🌿</span><span>Harvest</span>
        </button>
        <button class="wif-tab-btn" onclick="wifSwitchTab('cost',this)">
          <span class="wif-tab-icon">💰</span><span>Savings</span>
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
          <!-- MODIFIED: replaced "Days left" metric with "Total units" to show exact harvest count -->
          <div class="wif-metric-grid">
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-items">0</div><div class="wif-metric-lbl">Crops ready</div></div>
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-yield">0.00 kg</div><div class="wif-metric-lbl">Est. yield</div></div>
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-units">0</div><div class="wif-metric-lbl">Total units</div></div>
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
          <div class="wif-ai-note"><span>🤖</span><span id="wif-ai-recipe-note">Select crops above to see recipe suggestions.</span></div>
        </div>
      </div>

      <!-- ===== TAB 2: COST SAVINGS ===== -->
      <div id="wif-cost" class="wif-section">
        <div class="wif-card">
          <div class="wif-card-title">🪴 Choose plant to analyse</div>
          <!-- MODIFIED: rows count removed from option labels; controlled by stepper below -->
          <select class="wif-sel" id="wif-cost-plant" onchange="wifUpdateCost()">
            <option value="lettuce">Lettuce</option>
            <option value="tomato">Tomato</option>
            <option value="carrot">Carrot</option>
            <option value="basil">Basil</option>
            <option value="eggplant">Eggplant</option>
          </select>
          <!-- MODIFIED: new +/− stepper for rows count, separate from plant type -->
          <div class="wif-num-row">
            <label>Units planted</label>
            <div class="wif-qty-ctrl">
              <button class="wif-qty-btn" onclick="wifChangeRows(-1)">−</button>
              <span class="wif-qty-num" id="wif-rows-disp">5</span>
              <button class="wif-qty-btn" onclick="wifChangeRows(1)">+</button>
            </div>
          </div>
          <!-- MODIFIED: cycle slider changed from months (1–6) to weeks (1–24) -->
          <div class="wif-slider-row">
            <label>Cycle</label>
            <input type="range" min="1" max="24" value="1" step="1" id="wif-sl-weeks" oninput="wifUpdateCost()">
            <span class="wif-slider-val" id="wif-v-weeks">1 wk</span>
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
          <!-- MODIFIED: label changed from "Monthly savings trend" to "Weekly savings trend" -->
          <div class="wif-card-title">📊 Weekly savings trend</div>
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
          <div class="wif-card-title">🌱 Add new plant</div>
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
            <label>Unit count</label>
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
          <!-- MODIFIED: grid is now 2-col instead of auto-fit 3-col -->
          <div class="wif-impact-grid" id="wif-impact-grid"></div>
          <div class="wif-ai-note" style="margin-top:14px;"><span>🤖</span><span id="wif-np-ai-note">Loading...</span></div>
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
  wif_selectedCrops = new Set(); // reset to empty on re-mount
  wif_qty     = 4;
  wif_cosRows = 5;
  wif_curNp   = 'spinach';
  if (wif_savingsChart) { wif_savingsChart.destroy(); wif_savingsChart = null; }

  // Set initial search input value to match default species
  const npInput = document.getElementById('wif-np-input');
  if (npInput) npInput.value = 'Spinach';

  wifUpdateHarvest();
  wifUpdateCost();
  wifUpdateNewPlant();

  // Expose interactive handlers to the global scope so inline onclick="" works
  window.wifSwitchTab          = wifSwitchTab;
  window.wifUpdateHarvest      = wifUpdateHarvest;
  window.wifUpdateCost         = wifUpdateCost;
  window.wifUpdateNewPlant     = wifUpdateNewPlant;
  window.wifToggleCrop         = wifToggleCrop;
  window.wifChangeQty          = wifChangeQty;
  window.wifChangeRows         = wifChangeRows;          // MODIFIED: new export
  window.wifNpFilterSuggestions = wifNpFilterSuggestions; // MODIFIED: new export
  window.wifNpShowSuggestions  = wifNpShowSuggestions;   // MODIFIED: new export
  window.wifNpHideSuggestions  = wifNpHideSuggestions;   // MODIFIED: new export
  window.wifSelectSpecies      = wifSelectSpecies;        // MODIFIED: new export
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
  const days = parseInt(document.getElementById('wif-sl-days').value);
  document.getElementById('wif-v-days').textContent = days + (days === 1 ? ' day' : ' days');

  const ready    = WIF_CROPS.filter(c => c.readyIn <= days);
  const totalKg  = ready.reduce((a, c) => a + c.kg, 0);
  // MODIFIED: calculate total units across all ready crops
  const totalUnits = ready.reduce((a, c) => a + c.units, 0);

  document.getElementById('wif-hm-items').textContent = ready.length;
  document.getElementById('wif-hm-yield').textContent = totalKg.toFixed(2) + ' kg';
  // MODIFIED: display total units instead of days remaining
  document.getElementById('wif-hm-units').textContent = totalUnits;

  document.getElementById('wif-crop-timelines').innerHTML = WIF_CROPS.map(c => {
    const pct = Math.min(100, Math.round((days / c.readyIn) * 100));
    const rdy = c.readyIn <= days;
    return `
      <div class="wif-tl-row">
        <span class="wif-tl-name">${c.emoji} ${c.name}</span>
        <div class="wif-tl-track">
          <div class="wif-tl-fill" style="width:${pct}%;background:${rdy ? 'var(--accent,#639922)' : 'var(--amber-100,#FAC775)'};"></div>
        </div>
        ${rdy
          // MODIFIED: show exact unit count alongside Ready badge
          ? `<span class="wif-tl-count">${c.units} units <span class="wif-badge wif-badge-green">Ready</span></span>`
          : `<span class="wif-tl-end" style="color:var(--text-secondary,#666)">Day ${c.readyIn}</span>`}
      </div>`;
  }).join('');

  wifRenderCropSelect(days);
  wifRenderRecipes();
}

function wifRenderCropSelect(days) {
  const el = document.getElementById('wif-crop-select');
  const visible = WIF_CROPS.filter(c => c.readyIn <= days);

  // Auto-remove any selected crops that are no longer ready
  wif_selectedCrops.forEach(id => {
    if (!visible.find(c => c.id === id)) {
      wif_selectedCrops.delete(id);
    }
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
          const crop = WIF_CROPS.find(c => c.id === i);
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
        fetch(`http://localhost:3000/api/whatif/recipes?species=${id}`)
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
      note.textContent = note.textContent.replace('Loading database...', '(No DB results)');
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
        const crop = WIF_CROPS.find(c => c.id === id);
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
    note.textContent = note.textContent.replace('Loading database...', '(Backend offline — local only)');
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
  const plant  = document.getElementById('wif-cost-plant')?.value;
  const weeksEl = document.getElementById('wif-sl-weeks');
  if (!plant || !weeksEl) return;

  // MODIFIED: now reads weeks instead of months
  const weeks = parseInt(weeksEl.value);
  document.getElementById('wif-v-weeks').textContent = weeks + (weeks === 1 ? ' wk' : ' wks');

  const d = WIF_COST_DATA[plant];
  // MODIFIED: calculation uses wif_cosRows (user-controlled) and perRowKgWk × weeks
  const harvestKg  = wif_cosRows * d.perRowKgWk * weeks;
  const income     = harvestKg * d.mktPrice;
  // MODIFIED: expenses scaled by weeks/4 to keep per-month rate consistent with week-based slider
  const waterCost  = d.waterSave  * (weeks / 4) * 0.42;
  const energyCost = d.energySave * (weeks / 4) * 1.10;
  const fertCost   = d.fertilizer * (weeks / 4);
  const expenses   = waterCost + energyCost + fertCost;
  const net        = income - expenses;

  document.getElementById('wif-net-saving').textContent = 'RM ' + net.toFixed(2);

  document.getElementById('wif-cost-breakdown').innerHTML = `
    <div class="wif-cost-row wif-cost-income">
      <span class="wif-cost-lbl">📦 Harvest value (${harvestKg.toFixed(1)} kg × RM ${d.mktPrice}/kg)</span>
      <span style="color:var(--green-600,#3B6D11);font-weight:500;">+RM ${income.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">💧 Water cost</span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${waterCost.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">⚡ Energy cost</span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${energyCost.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">🧪 Fertilizer</span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${fertCost.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-net">
      <span>⭐ Net savings</span>
      <span style="color:var(--teal-600,#0F6E56);">RM ${net.toFixed(2)}</span>
    </div>`;

  document.getElementById('wif-cost-ai-note').textContent = d.note;
  wifRenderSavingsChart(weeks, d);
  wifFetchCostAi(plant, wif_cosRows, weeks);
}

function wifRenderSavingsChart(weeks, d) {
  const canvas = document.getElementById('wif-savings-chart');
  if (!canvas) return;

  if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    script.onload = () => wifDrawChart(canvas, weeks, d);
    document.head.appendChild(script);
  } else {
    wifDrawChart(canvas, weeks, d);
  }
}

function wifDrawChart(canvas, weeks, d) {
  if (wif_savingsChart) { wif_savingsChart.destroy(); wif_savingsChart = null; }

  // MODIFIED: labels are W1, W2... instead of M1, M2...; loop runs per-week not per-month
  const labels = [];
  const data   = [];
  for (let w = 1; w <= weeks; w++) {
    labels.push('W' + w);
    const inc = wif_cosRows * d.perRowKgWk * w * d.mktPrice;
    const exp = (d.waterSave * (w / 4) * 0.42) + (d.energySave * (w / 4) * 1.10) + (d.fertilizer * (w / 4));
    data.push(parseFloat((inc - exp).toFixed(2)));
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
   ============================================================ */

async function wifFetchCostAi(plant, units, weeks) {
  const noteEl = document.getElementById('wif-cost-ai-note');
  noteEl.textContent = '🤖 Analyzing your sensor data...';

  const sensors = {
    temp:     AppState.sensors.temp.val,
    humid:    AppState.sensors.humid.val,
    light:    AppState.sensors.light.val,
    water:    AppState.sensors.water.val,
    nutrient: AppState.sensors.nutrient.val,
  };

    // Remove old card immediately so user sees it's refreshing
  document.getElementById('wif-ai-savings-detail')?.remove();
  noteEl.textContent = '🤖 Analyzing your sensor data...';

  try {
    const res = await fetch('http://localhost:3000/api/whatif/costsaving', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plant, units, weeks, sensors })
    });

    if (!res.ok) throw new Error('Server error');
    const data = await res.json();

    noteEl.textContent = data.insight;

    const detail = document.createElement('div');
    detail.id = 'wif-ai-savings-detail';

    detail.innerHTML = `
      <div class="wif-card" style="margin-bottom:12px;border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
        <div class="wif-card-title">🤖 AI Resource Analysis</div>
        <div class="wif-metric-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:10px;">
          <div class="wif-metric">
            <div class="wif-metric-val" style="font-size:15px;color:var(--teal-600,#0F6E56);">${data.conditionScore}%</div>
            <div class="wif-metric-lbl">Condition: ${data.conditionLabel}</div>
          </div>
          <div class="wif-metric">
            <div class="wif-metric-val" style="font-size:15px;color:var(--accent,#639922);">RM ${(data.totalSavedRM ?? 0).toFixed(2)}</div>
            <div class="wif-metric-lbl">AI Est. Saved</div>
          </div>
        </div>
        <div class="wif-cost-row wif-cost-income">
          <span class="wif-cost-lbl">💧 Water saved</span>
          <span style="color:var(--green-600,#3B6D11);">${(data.waterSavedLiters ?? 0).toFixed(1)}L · RM ${(data.waterCostSaved ?? 0).toFixed(2)}</span>
        </div>
        <div class="wif-cost-row wif-cost-income">
          <span class="wif-cost-lbl">⚡ Energy saved</span>
          <span style="color:var(--green-600,#3B6D11);">${(data.energySavedkWh ?? 0).toFixed(2)}kWh · RM ${(data.energyCostSaved ?? 0).toFixed(2)}</span>
        </div>
      </div>`;

    // Insert before the chart card (3rd card in #wif-cost)
    const costSection = document.getElementById('wif-cost');
    const cards = costSection.querySelectorAll(':scope > .wif-card');
    if (cards.length >= 3) {
      cards[2].before(detail);
    } else {
      costSection.appendChild(detail);
    }

  } catch (err) {
    noteEl.textContent = 'AI analysis unavailable — showing calculated estimates only.';
  }
}

/* ============================================================
   TAB 3 — NEW PLANT
   ============================================================ */

// MODIFIED: three new functions drive the smart-search input/suggestion UI
function wifNpFilterSuggestions() {
  const q = document.getElementById('wif-np-input').value.toLowerCase();
  const filtered = WIF_NP_SPECIES.filter(s =>
    s.name.toLowerCase().includes(q) || s.id.includes(q)
  );
  wifRenderNpSuggestions(filtered);
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
    <div class="wif-np-sug-item" onclick="wifSelectSpecies('${s.id}','${s.name}')">
      <span class="wif-np-sug-emoji">${s.emoji}</span>
      <span>${s.name}</span>
    </div>`).join('');
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

function wifUpdateNewPlant() {
  const d = WIF_NP_DATA[wif_curNp];
  if (!d) return;

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
    // MODIFIED: uses imp.emoji from data instead of a direction-based icon map
    return `
      <div class="wif-impact-card ${imp.dir}">
        <div class="wif-impact-emoji">${imp.emoji}</div>
        <div class="wif-impact-name">${imp.name}</div>
        <div class="wif-impact-val ${imp.dir}">${display}</div>
      </div>`;
  }).join('');

  document.getElementById('wif-np-ai-note').textContent = '🤖 Predicting impact...';
  wifFetchNewPlantAi(wif_curNp, wif_qty);
}

async function wifFetchNewPlantAi(species, quantity) {
  const noteEl = document.getElementById('wif-np-ai-note');

  const sensors = {
    temp:     AppState.sensors.temp.val,
    humid:    AppState.sensors.humid.val,
    light:    AppState.sensors.light.val,
    water:    AppState.sensors.water.val,
    nutrient: AppState.sensors.nutrient.val,
  };

  const currentCrops = [...(window._wif_selectedCrops || ['lettuce', 'tomato', 'basil'])];

  try {
    const res = await fetch('http://localhost:3000/api/whatif/newplant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ species, quantity, currentCrops, sensors })
    });

    if (!res.ok) throw new Error('Server error');
    const data = await res.json();

    // Update AI note
    noteEl.textContent = data.insight;

    // Show warnings if any
    if (data.warnings?.length) {
      noteEl.textContent += ' ⚠️ ' + data.warnings.join(' · ');
    }

    // Update impact cards with real calculated values
    const impactMap = {
      'Temperature': data.impacts.tempChange,
      'Humidity':    data.impacts.humidChange,
      'Light (h/d)': data.impacts.lightChange,
      'Fertilizer':  data.impacts.nutrientChange,
    };

    document.querySelectorAll('.wif-impact-card').forEach(card => {
      const nameEl = card.querySelector('.wif-impact-name');
      const valEl  = card.querySelector('.wif-impact-val');
      if (!nameEl || !valEl) return;

      const name = nameEl.textContent.trim();
      if (impactMap[name] !== undefined) {
        const val = impactMap[name];
        const sign = val > 0 ? '+' : '';
        const unit = name.includes('Light') ? 'h' : name.includes('Temp') ? '°C' : '%';
        valEl.textContent = val === 0 ? 'No change' : `${sign}${val}${unit}`;

        // Update card color based on direction
        card.className = 'wif-impact-card ' + (val === 0 ? 'ok' : val > 0 ? 'up' : 'down');
        valEl.className = 'wif-impact-val ' + (val === 0 ? 'ok' : val > 0 ? 'up' : 'down');
      }
    });

  } catch (err) {
    const d = WIF_NP_DATA[species];
    noteEl.textContent = d ? d.ai + ` (${quantity} plants)` : 'AI prediction unavailable.';
  }
}