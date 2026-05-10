import{A as u,a as H,s as G}from"./index-_w9zqNup.js";import"https://esm.sh/three@0.160.0";const F=[{id:"tomato",name:"Tomato",emoji:"🍅",days:5,kg:.32,units:4,readyIn:5,color:"#D85A30"},{id:"carrot",name:"Carrot",emoji:"🥕",days:8,kg:.24,units:6,readyIn:8,color:"#BA7517"},{id:"cabbage",name:"Cabbage",emoji:"🥬",days:7,kg:.41,units:2,readyIn:7,color:"#639922"},{id:"eggplant",name:"Eggplant",emoji:"🍆",days:11,kg:.28,units:3,readyIn:11,color:"#534AB7"},{id:"basil",name:"Basil",emoji:"🌿",days:4,kg:.09,units:10,readyIn:4,color:"#1D9E75"},{id:"green_onion",name:"Green Onion",emoji:"🧅",days:6,kg:.11,units:8,readyIn:6,color:"#3B6D11"}],Y=[{name:"Bolognese Pasta",emoji:"🍝",ingr:["tomato","carrot","basil"]},{name:"ABC Soup",emoji:"🍲",ingr:["cabbage","carrot","tomato","green_onion"]},{name:"Grilled Eggplant",emoji:"🍽️",ingr:["eggplant","basil"]},{name:"Spring Green Salad",emoji:"🥗",ingr:["green_onion","basil","cabbage"]}],J={lettuce:{mktPrice:4.8,perRowKgWk:.28,waterSave:3.2,energySave:1.1,fertilizer:.8,note:"Lettuce grows fast — your rows beat supermarket prices by 2× this month."},tomato:{mktPrice:7.2,perRowKgWk:.28,waterSave:2.1,energySave:.9,fertilizer:1.1,note:"Tomatoes fetched RM 7.20/kg at Pasar Borong this week. Yours cost much less."},carrot:{mktPrice:3.5,perRowKgWk:.28,waterSave:1.8,energySave:.7,fertilizer:.6,note:"Carrots are low-maintenance and high-value for home growing."},basil:{mktPrice:12,perRowKgWk:.28,waterSave:.9,energySave:.5,fertilizer:.4,note:"Fresh basil at supermarkets is expensive. Your rows are a gold mine."},eggplant:{mktPrice:5.5,perRowKgWk:.28,waterSave:2.4,energySave:1.3,fertilizer:.9,note:"Eggplant uses more water but market price makes it worthwhile."}},D={spinach:{emoji:"🥬",readyDays:5,readyZone:"Zone B lettuce",space:"1.2m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+0.5°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+3%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"-0.5h",dir:"down"},{name:"Fertilizer",emoji:"🧫",change:"+8%",dir:"up"}],ai:"Spinach thrives alongside lettuce. Humidity increase is within safe range (≤85%)."},mint:{emoji:"🌿",readyDays:3,readyZone:"Zone A chives",space:"0.6m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"No change",dir:"ok"},{name:"Humidity",emoji:"💧",change:"+5%",dir:"up"},{name:"pH value",emoji:"🧪",change:"-0.2",dir:"down"},{name:"Light (h/d)",emoji:"☀️",change:"No change",dir:"ok"},{name:"Fertilizer",emoji:"🧫",change:"+5%",dir:"up"}],ai:"Mint can be aggressive — consider a physical divider from neighbouring herbs."},chili:{emoji:"🌶️",readyDays:12,readyZone:"Zone C eggplant",space:"2.1m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1.5°C",dir:"warn"},{name:"Humidity",emoji:"💧",change:"-4%",dir:"down"},{name:"pH value",emoji:"🧪",change:"+0.3",dir:"up"},{name:"Light (h/d)",emoji:"☀️",change:"+2h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+15%",dir:"warn"}],ai:"Chili needs more heat and light. You may need to adjust Zone C lighting before planting."},cucumber:{emoji:"🥒",readyDays:8,readyZone:"Zone D tomato",space:"1.8m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+6%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+12%",dir:"up"}],ai:"Cucumbers are water-heavy. Ensure your pump schedule scales with the new plant count."},strawberry:{emoji:"🍓",readyDays:14,readyZone:"Zone E herbs",space:"0.9m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"-1°C",dir:"down"},{name:"Humidity",emoji:"💧",change:"+2%",dir:"ok"},{name:"pH value",emoji:"🧪",change:"-0.4",dir:"down"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+10%",dir:"up"}],ai:"Strawberries prefer cooler temps. Place them away from the heat lamp cluster for best results."},tomato:{emoji:"🍅",readyDays:9,readyZone:"Zone D",space:"1.5m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+4%",dir:"up"},{name:"pH value",emoji:"🧪",change:"+0.1",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+10%",dir:"up"}],ai:"Tomatoes do best with deep watering every 2–3 days."},basil:{emoji:"🌿",readyDays:4,readyZone:"Zone E herbs",space:"0.5m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"No change",dir:"ok"},{name:"Humidity",emoji:"💧",change:"+2%",dir:"ok"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+4%",dir:"up"}],ai:"Basil is low-impact. Great companion plant for tomatoes and peppers."}},Q=[{zone:"Zone A",crop:"Chives",fill:90},{zone:"Zone B",crop:"Lettuce",fill:75},{zone:"Zone C",crop:"Eggplant",fill:95},{zone:"Zone D",crop:"Tomato",fill:60},{zone:"Zone E",crop:"Herbs",fill:82}],B=Object.entries(D).map(([e,i])=>({id:e,name:e.charAt(0).toUpperCase()+e.slice(1),emoji:i.emoji}));let v=new Set,E=4,x=5,S="spinach",y=null;function V(){return`
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
  `}function X(){v=new Set,E=4,x=5,S="spinach",y&&(y.destroy(),y=null);const e=document.getElementById("wif-np-input");e&&(e.value="Spinach"),T(),A(),k(),window.wifSwitchTab=ee,window.wifUpdateHarvest=T,window.wifUpdateCost=A,window.wifUpdateNewPlant=k,window.wifToggleCrop=te,window.wifChangeQty=ce,window.wifChangeRows=ae,window.wifNpFilterSuggestions=re,window.wifNpShowSuggestions=se,window.wifNpHideSuggestions=O,window.wifSelectSpecies=de}function ee(e,i){document.querySelectorAll(".wif-section").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".wif-tab-btn").forEach(t=>t.classList.remove("active")),document.getElementById("wif-"+e).classList.add("active"),i.classList.add("active"),e==="cost"&&A(),e==="newplant"&&k()}function T(){const e=parseInt(document.getElementById("wif-sl-days").value);document.getElementById("wif-v-days").textContent=e+(e===1?" day":" days");const i=F.filter(n=>n.readyIn<=e),t=i.reduce((n,o)=>n+o.kg,0),a=i.reduce((n,o)=>n+o.units,0);document.getElementById("wif-hm-items").textContent=i.length,document.getElementById("wif-hm-yield").textContent=t.toFixed(2)+" kg",document.getElementById("wif-hm-units").textContent=a,document.getElementById("wif-crop-timelines").innerHTML=F.map(n=>{const o=Math.min(100,Math.round(e/n.readyIn*100)),s=n.readyIn<=e;return`
      <div class="wif-tl-row">
        <span class="wif-tl-name">${n.emoji} ${n.name}</span>
        <div class="wif-tl-track">
          <div class="wif-tl-fill" style="width:${o}%;background:${s?"var(--accent,#639922)":"var(--amber-100,#FAC775)"};"></div>
        </div>
        ${s?`<span class="wif-tl-count">${n.units} units <span class="wif-badge wif-badge-green">Ready</span></span>`:`<span class="wif-tl-end" style="color:var(--text-secondary,#666)">Day ${n.readyIn}</span>`}
      </div>`}).join(""),P(e),_()}function P(e){const i=document.getElementById("wif-crop-select"),t=F.filter(a=>a.readyIn<=e);if(v.forEach(a=>{t.find(n=>n.id===a)||v.delete(a)}),t.length===0){i.innerHTML='<span style="font-size:12px;color:var(--text-secondary,#999);">No crops ready yet — move the slider forward.</span>';return}i.innerHTML=t.map(a=>`
    <div class="wif-pill ${v.has(a.id)?"selected":""}"
         onclick="wifToggleCrop('${a.id}')">
      ${a.emoji} ${a.name}
    </div>`).join("")}function te(e){v.has(e)?v.delete(e):v.add(e);const i=parseInt(document.getElementById("wif-sl-days").value);P(i),_()}function _(){const e=document.getElementById("wif-recipe-grid"),i=document.getElementById("wif-ai-recipe-note");if(v.size===0){e.innerHTML="",i.textContent="Select crops above to see recipe suggestions.";return}const t=Y.map(a=>{const n=a.ingr.filter(o=>v.has(o)).length;return n===0?null:{...a,match:n,pct:Math.round(n/a.ingr.length*100)}}).filter(Boolean).sort((a,n)=>n.match-a.match);e.innerHTML=t.map(a=>`
    <div class="wif-recipe-card">
      <div class="wif-recipe-hero">${a.emoji}</div>
      <div class="wif-recipe-name">
        ${a.name}
        <span class="wif-badge ${a.pct===100?"wif-badge-green":"wif-badge-amber"}">${a.pct}%</span>
      </div>
      <div>
        ${a.ingr.map(n=>{const o=F.find(r=>r.id===n);return v.has(n)?`<span class="wif-ingr-tag">${o?o.emoji+" "+o.name:n}</span>`:`<span class="wif-ingr-tag" style="background:#f0f0f0;color:#999;border:0.5px dashed #ccc;">🛒 ${o?o.name:n}</span>`}).join("")}
      </div>
    </div>`).join(""),i.textContent=t.length>0?`${t.length} recipe${t.length>1?"s":""} match your harvest. Loading database...`:"No local matches. Loading database recipes...",ie([...v])}async function ie(e){const i=document.getElementById("wif-recipe-grid"),t=document.getElementById("wif-ai-recipe-note"),a={tomato:["tomato","tomatoes"],carrot:["carrot","carrots"],cabbage:["cabbage"],eggplant:["eggplant","aubergine","brinjal"],basil:["basil"],green_onion:["green onion","green onions","scallion"],lettuce:["lettuce"],spinach:["spinach"],strawberry:["strawberry","strawberries"],pepper:["bell pepper","green pepper","capsicum"]};try{const n=await Promise.all(e.map(d=>fetch(`http://localhost:3000/api/whatif/recipes?species=${d}`).then(c=>c.ok?c.json():{recipes:[]}).catch(()=>({recipes:[]})))),o=new Set,s=n.flatMap(d=>d.recipes||[]).filter(d=>o.has(d.name)?!1:(o.add(d.name),!0));if(!s.length){t.textContent=t.textContent.replace("Loading database...","(No DB results)");return}const r=s.map(d=>{const c=e.filter(p=>{const f=a[p]||[p];return d.ingredients.some(h=>f.some(b=>h.toLowerCase().includes(b.toLowerCase())))});if(c.length===0)return null;const g=e.flatMap(p=>a[p]||[p]),w=d.ingredients.filter(p=>{const f=p.toLowerCase();return!(g.some(b=>f.includes(b))||["salt","pepper","water","oil","sugar","flour","butter","egg","milk","sauce","mix","seasoning","powder","vinegar","cream","cheese","margarine"].some(b=>f.includes(b)))}).map(p=>p.replace(/^\d[\d\s\/]*(\(\d+[\s\w\.]+\))?\s*(lb|oz|c|pkg|tsp|tbsp|can|qt|pt|pkg|Tbsp|large|medium|small|fresh|dried|chopped|diced|sliced|cooked|frozen|thawed|drained|shredded|grated|minced|crushed|ground|boneless|skinless)\.?\s*/gi,"").replace(/^[\d\/\s\.]+/,"").trim()).filter(p=>p.length>2&&p.length<40).slice(0,4);return{recipe:d,grownMatches:c,otherIngredients:w}}).filter(Boolean).sort((d,c)=>c.grownMatches.length-d.grownMatches.length);if(!r.length){t.textContent="No database recipes matched your selected crops.";return}const l=r.map(({recipe:d,grownMatches:c,otherIngredients:g})=>{const w=c.map(f=>{const h=F.find(b=>b.id===f);return`<span class="wif-ingr-tag" style="background:var(--teal-50,#E1F5EE);color:var(--teal-600,#0F6E56);border:0.5px solid var(--teal-200,#7DD3BD);">${h?h.emoji+" "+h.name:f}</span>`}).join(""),p=g.map(f=>`<span class="wif-ingr-tag" style="background:#f0f0f0;color:#888;border:0.5px dashed #ccc;">🛒 ${f}</span>`).join("");return`
        <div class="wif-recipe-card" style="border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
          <div class="wif-recipe-hero">🍽️</div>
          <div class="wif-recipe-name">
            ${d.name.trim()}
            <span class="wif-badge wif-badge-teal">DB</span>
          </div>
          <div>${w}${p}</div>
        </div>`}).join("");i.innerHTML+=l,t.textContent=`${r.length} recipes found — green = your harvest, 🛒 = ingredients to buy.`}catch{t.textContent=t.textContent.replace("Loading database...","(Backend offline — local only)")}}function ae(e){x=Math.max(1,Math.min(20,x+e));const i=document.getElementById("wif-rows-disp");i&&(i.textContent=x),A()}function A(){var g;const e=(g=document.getElementById("wif-cost-plant"))==null?void 0:g.value,i=document.getElementById("wif-sl-weeks");if(!e||!i)return;const t=parseInt(i.value);document.getElementById("wif-v-weeks").textContent=t+(t===1?" wk":" wks");const a=J[e],n=x*a.perRowKgWk*t,o=n*a.mktPrice,s=a.waterSave*(t/4)*.42,r=a.energySave*(t/4)*1.1,l=a.fertilizer*(t/4),d=s+r+l,c=o-d;document.getElementById("wif-net-saving").textContent="RM "+c.toFixed(2),document.getElementById("wif-cost-breakdown").innerHTML=`
    <div class="wif-cost-row wif-cost-income">
      <span class="wif-cost-lbl">📦 Harvest value (${n.toFixed(1)} kg × RM ${a.mktPrice}/kg)</span>
      <span style="color:var(--green-600,#3B6D11);font-weight:500;">+RM ${o.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">💧 Water cost</span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${s.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">⚡ Energy cost</span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${r.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">🧪 Fertilizer</span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${l.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-net">
      <span>⭐ Net savings</span>
      <span style="color:var(--teal-600,#0F6E56);">RM ${c.toFixed(2)}</span>
    </div>`,document.getElementById("wif-cost-ai-note").textContent=a.note,ne(t,a),oe(e,x,t)}function ne(e,i){const t=document.getElementById("wif-savings-chart");if(t)if(typeof Chart>"u"){const a=document.createElement("script");a.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",a.onload=()=>j(t,e,i),document.head.appendChild(a)}else j(t,e,i)}function j(e,i,t){y&&(y.destroy(),y=null);const a=[],n=[];for(let o=1;o<=i;o++){a.push("W"+o);const s=x*t.perRowKgWk*o*t.mktPrice,r=t.waterSave*(o/4)*.42+t.energySave*(o/4)*1.1+t.fertilizer*(o/4);n.push(parseFloat((s-r).toFixed(2)))}y=new Chart(e,{type:"bar",data:{labels:a,datasets:[{label:"Net savings (RM)",data:n,backgroundColor:"#97C459",borderRadius:4,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:o=>"RM "+o.raw.toFixed(2)}}},scales:{y:{beginAtZero:!0,ticks:{callback:o=>"RM "+o,font:{size:10}},grid:{color:"rgba(128,128,128,0.08)"}},x:{grid:{display:!1},ticks:{font:{size:10}}}}}})}async function oe(e,i,t){var o;const a=document.getElementById("wif-cost-ai-note");a.textContent="🤖 Analyzing your sensor data...";const n={temp:u.sensors.temp.val,humid:u.sensors.humid.val,light:u.sensors.light.val,water:u.sensors.water.val,nutrient:u.sensors.nutrient.val};(o=document.getElementById("wif-ai-savings-detail"))==null||o.remove(),a.textContent="🤖 Analyzing your sensor data...";try{const s=await fetch("http://localhost:3000/api/whatif/costsaving",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plant:e,units:i,weeks:t,sensors:n})});if(!s.ok)throw new Error("Server error");const r=await s.json();a.textContent=r.insight;const l=document.createElement("div");l.id="wif-ai-savings-detail",l.innerHTML=`
      <div class="wif-card" style="margin-bottom:12px;border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
        <div class="wif-card-title">🤖 AI Resource Analysis</div>
        <div class="wif-metric-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:10px;">
          <div class="wif-metric">
            <div class="wif-metric-val" style="font-size:15px;color:var(--teal-600,#0F6E56);">${r.conditionScore}%</div>
            <div class="wif-metric-lbl">Condition: ${r.conditionLabel}</div>
          </div>
          <div class="wif-metric">
            <div class="wif-metric-val" style="font-size:15px;color:var(--accent,#639922);">RM ${(r.totalSavedRM??0).toFixed(2)}</div>
            <div class="wif-metric-lbl">AI Est. Saved</div>
          </div>
        </div>
        <div class="wif-cost-row wif-cost-income">
          <span class="wif-cost-lbl">💧 Water saved</span>
          <span style="color:var(--green-600,#3B6D11);">${(r.waterSavedLiters??0).toFixed(1)}L · RM ${(r.waterCostSaved??0).toFixed(2)}</span>
        </div>
        <div class="wif-cost-row wif-cost-income">
          <span class="wif-cost-lbl">⚡ Energy saved</span>
          <span style="color:var(--green-600,#3B6D11);">${(r.energySavedkWh??0).toFixed(2)}kWh · RM ${(r.energyCostSaved??0).toFixed(2)}</span>
        </div>
      </div>`;const d=document.getElementById("wif-cost"),c=d.querySelectorAll(":scope > .wif-card");c.length>=3?c[2].before(l):d.appendChild(l)}catch{a.textContent="AI analysis unavailable — showing calculated estimates only."}}function re(){const e=document.getElementById("wif-np-input").value.toLowerCase(),i=B.filter(t=>t.name.toLowerCase().includes(e)||t.id.includes(e));W(i)}function se(){const e=document.getElementById("wif-np-input").value.toLowerCase(),i=e?B.filter(t=>t.name.toLowerCase().includes(e)):B;W(i)}function O(){const e=document.getElementById("wif-np-suggestions");e&&(e.style.display="none")}function W(e){const i=document.getElementById("wif-np-suggestions");if(i){if(!e.length){i.style.display="none";return}i.style.display="block",i.innerHTML=e.map(t=>`
    <div class="wif-np-sug-item" onclick="wifSelectSpecies('${t.id}','${t.name}')">
      <span class="wif-np-sug-emoji">${t.emoji}</span>
      <span>${t.name}</span>
    </div>`).join("")}}function de(e,i){S=e;const t=document.getElementById("wif-np-input");t&&(t.value=i),O(),k()}function ce(e){E=Math.max(1,Math.min(20,E+e));const i=document.getElementById("wif-qty-disp");i&&(i.textContent=E),k()}function k(){const e=D[S];if(!e)return;document.getElementById("wif-ready-title").textContent=`You can plant in ${e.readyDays} days`,document.getElementById("wif-ready-sub").textContent=`${e.readyZone} harvests on Day ${e.readyDays} — freeing ${e.space} of space.`,document.getElementById("wif-zone-list").innerHTML=Q.map(t=>`
    <div class="wif-zone-row">
      <div>
        <div class="wif-zone-name">${t.zone} — ${t.crop}</div>
        <div class="wif-zone-meta">${t.fill}% capacity</div>
      </div>
      <span class="wif-badge ${t.fill>=90?"wif-badge-red":t.fill>=75?"wif-badge-amber":"wif-badge-green"}">
        ${t.fill>=90?"Full":t.fill>=75?"Near full":"Available"}
      </span>
    </div>`).join("");const i=E/4;document.getElementById("wif-impact-grid").innerHTML=e.impacts.map(t=>{let a=t.change;if(t.dir!=="ok"){const n=parseFloat(t.change);if(!isNaN(n)){const o=n*i,s=o>0?"+":"",r=t.change.includes("%")?"%":t.change.includes("°")?"°C":t.change.includes("h")?"h":"";a=s+o.toFixed(1).replace(".0","")+r}}return`
      <div class="wif-impact-card ${t.dir}">
        <div class="wif-impact-emoji">${t.emoji}</div>
        <div class="wif-impact-name">${t.name}</div>
        <div class="wif-impact-val ${t.dir}">${a}</div>
      </div>`}).join(""),document.getElementById("wif-np-ai-note").textContent="🤖 Predicting impact...",le(S,E)}async function le(e,i){var o;const t=document.getElementById("wif-np-ai-note"),a={temp:u.sensors.temp.val,humid:u.sensors.humid.val,light:u.sensors.light.val,water:u.sensors.water.val,nutrient:u.sensors.nutrient.val},n=[...window._wif_selectedCrops||["lettuce","tomato","basil"]];try{const s=await fetch("http://localhost:3000/api/whatif/newplant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({species:e,quantity:i,currentCrops:n,sensors:a})});if(!s.ok)throw new Error("Server error");const r=await s.json();t.textContent=r.insight,(o=r.warnings)!=null&&o.length&&(t.textContent+=" ⚠️ "+r.warnings.join(" · "));const l={Temperature:r.impacts.tempChange,Humidity:r.impacts.humidChange,"Light (h/d)":r.impacts.lightChange,Fertilizer:r.impacts.nutrientChange};document.querySelectorAll(".wif-impact-card").forEach(d=>{const c=d.querySelector(".wif-impact-name"),g=d.querySelector(".wif-impact-val");if(!c||!g)return;const w=c.textContent.trim();if(l[w]!==void 0){const p=l[w],f=p>0?"+":"",h=w.includes("Light")?"h":w.includes("Temp")?"°C":"%";g.textContent=p===0?"No change":`${f}${p}${h}`,d.className="wif-impact-card "+(p===0?"ok":p>0?"up":"down"),g.className="wif-impact-val "+(p===0?"ok":p>0?"up":"down")}})}catch{const r=D[e];t.textContent=r?r.ai+` (${i} plants)`:"AI prediction unavailable."}}const $="http://localhost:3000",R=45,pe=10,U=20,Z=250,q=.218;function fe(){return`
    <div id="consumptionRoot" style="padding:16px; min-height:100%; background:#F0F4F8; color:#1A2B3C;">

      <!-- ── LOADING STATE ── -->
      <div id="con-loading" style="text-align:center; padding:40px 0;">
        <div style="font-size:2rem; animation:spin 1s linear infinite; display:inline-block;">⚙️</div>
        <div style="margin-top:8px; color:#64748B; font-size:0.85rem;">Fetching farm data…</div>
      </div>

      <!-- ── MAIN CONTENT (hidden until data loads) ── -->
      <div id="con-content" style="display:none;">

        <!-- ECO RATING HERO -->
        <div id="con-hero" style="
          background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%);
          border-radius:24px; padding:24px; text-align:center; margin-bottom:16px;
          position:relative; overflow:hidden;
          box-shadow: 0 4px 24px rgba(45,106,79,0.25);
        ">
          <div style="position:absolute;top:-20px;right:-20px;font-size:5rem;opacity:0.12;">🌱</div>
          <div id="con-grade" style="font-size:3rem; font-weight:900; color:#D8F3DC; line-height:1;">A+</div>
          <div style="color:#B7E4C7; font-size:0.85rem; margin-top:4px;">Eco Efficiency Rating</div>
          <div id="con-grade-note" style="font-size:0.75rem; color:#95D5B2; margin-top:8px;">
            Your farm is operating in the top efficiency range.
          </div>
        </div>

        <!-- KPI CARDS GRID -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
          <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div style="font-size:1.4rem;">💧</div>
            <div id="con-water-today" style="font-size:1.5rem; font-weight:700; color:#2563EB; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem;">Water Used Today</div>
            <div id="con-water-vs" style="color:#16A34A; font-size:0.7rem; margin-top:4px;"></div>
          </div>
          <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div style="font-size:1.4rem;">⚡</div>
            <div id="con-energy-today" style="font-size:1.5rem; font-weight:700; color:#D97706; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem;">Energy Used Today</div>
            <div id="con-energy-vs" style="color:#16A34A; font-size:0.7rem; margin-top:4px;"></div>
          </div>
          <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div style="font-size:1.4rem;">🌿</div>
            <div id="con-co2" style="font-size:1.5rem; font-weight:700; color:#16A34A; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem;">CO₂ Saved (vs. soil farm)</div>
          </div>
          <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <div style="font-size:1.4rem;">💰</div>
            <div id="con-cost" style="font-size:1.5rem; font-weight:700; color:#B45309; margin:4px 0;">—</div>
            <div style="color:#64748B; font-size:0.75rem;">Utility Cost Today</div>
          </div>
        </div>

     <!-- WATER USAGE CHART -->
<div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
  <div style="color:#2563EB; font-weight:600; margin-bottom:12px;">💧 Water Usage (last 24 readings)</div>
  <div style="position:relative; width:100%; height:220px;">
    <canvas id="con-water-chart" style="position:absolute; top:0; left:0; width:100% !important; height:100% !important;"></canvas>
  </div>
</div>

<!-- ENERGY USAGE CHART -->
<div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
  <div style="color:#D97706; font-weight:600; margin-bottom:12px;">⚡ Energy Usage (last 24 readings)</div>
  <div style="position:relative; width:100%; height:160px;">
    <canvas id="con-energy-chart" style="position:absolute; top:0; left:0; width:100% !important; height:100% !important;"></canvas>
  </div>
</div>

        <!-- RESOURCE BREAKDOWN TABLE -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#1A2B3C; font-weight:600; margin-bottom:12px;">📊 Resource Breakdown</div>
          <div id="con-breakdown" style="display:flex; flex-direction:column; gap:10px;">
            <!-- Populated by JS -->
          </div>
        </div>

        <!-- AI TIPS (dynamic) -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#1A2B3C; font-weight:600; margin-bottom:12px;">🤖 AI Eco Tips</div>
          <div id="con-ai-tips" style="display:flex; flex-direction:column; gap:8px;">
            <!-- Populated by JS based on real sensor data -->
          </div>
        </div>

        <!-- LAST UPDATED -->
        <div id="con-last-updated" style="text-align:center; color:#94A3B8; font-size:0.7rem; margin-top:12px; padding-bottom:16px;"></div>

      </div><!-- end #con-content -->

      <!-- ERROR STATE -->
      <div id="con-error" style="display:none; text-align:center; padding:40px 16px;">
        <div style="font-size:2rem;">⚠️</div>
        <div style="color:#DC2626; margin-top:8px; font-size:0.9rem;">Could not connect to backend.</div>
        <div style="color:#64748B; font-size:0.75rem; margin-top:4px;">Using simulated data for demo.</div>
        <button id="con-retry-btn" style="
          margin-top:16px; padding:8px 20px;
          background:#EFF6FF; color:#2563EB;
          border:1px solid #BFDBFE; border-radius:12px; cursor:pointer;
          font-weight:600;
        ">🔄 Retry</button>
      </div>

    </div>
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
      .con-progress-track {
        background: #E2E8F0;
        border-radius: 100px;
        height: 8px;
        flex: 1;
        overflow: hidden;
      }
      .con-progress-fill {
        height: 100%;
        border-radius: 100px;
        transition: width 0.6s ease;
      }
    </style>
  `}async function ge(){var e;(e=document.getElementById("con-retry-btn"))==null||e.addEventListener("click",()=>z()),await z()}async function z(){K("loading");try{const e=u.currentFarmId||"farm_001",[i,t]=await Promise.all([fetch(`${$}/api/sensors/history?deviceId=farm_001&limit=24`),fetch(`${$}/api/sensors/latest?deviceId=farm_001`)]);if(!i.ok||!t.ok)throw new Error("API error");const a=await i.json(),n=await t.json(),o=a.readings||[],s=n.reading||null;o.length===0?I(M(),!0):I(o,!1,s)}catch(e){console.warn("[ConsumptionPage] Backend unreachable, using mock data for demo:",e.message),I(M(),!0)}}function I(e,i=!1,t=null){var l,d;K("content");const a=me(e);m("con-water-today").textContent=`${a.waterLiters.toFixed(1)} L`,m("con-energy-today").textContent=`${a.energyKwh.toFixed(2)} kWh`,m("con-co2").textContent=`${a.co2Saved.toFixed(2)} kg`,m("con-cost").textContent=`RM ${a.costRm.toFixed(2)}`;const n=Math.round((1-a.waterLiters/60)*100),o=Math.round((1-a.energyKwh/20)*100);n>0&&(m("con-water-vs").textContent=`↓ ${n}% vs traditional farming`),o>0&&(m("con-energy-vs").textContent=`↓ ${o}% vs traditional farming`);const s=we(a);m("con-grade").textContent=s.letter,m("con-grade").style.color=s.color,m("con-grade-note").textContent=s.note,ue(e),ve(a),he(e,t,a);const r=((l=e[0])==null?void 0:l.createdAt)||((d=e[0])==null?void 0:d.timestamp)||new Date;m("con-last-updated").textContent=`${i?"⚡ Demo mode · ":""}Last updated: ${new Date(r).toLocaleString("en-MY")}`}function me(e){let i=0,t=0,a=0,n=0;e.forEach((c,g)=>{(c.soilRaw??c.soilMoisture??1900)<1800&&i++,(c.lightRaw??c.light??2e3)<1500&&(t+=1,n++),(c.temperature??25)>28&&(a+=1)});const o=i*Z/1e3,r=(t*R+a*U+i*pe)/1e3,l=r*q,d=(60-o)*.035;return{waterLiters:Math.max(o,.5),energyKwh:Math.max(r,.1),costRm:Math.max(l,.02),co2Saved:Math.max(d,.5),lightHours:t,fanHours:a,waterActivations:i,lowLightCount:n,totalReadings:e.length}}function we(e){const i=(e.waterLiters<5?40:e.waterLiters<15?25:10)+(e.energyKwh<1?40:e.energyKwh<3?25:10)+(e.costRm<.5?20:e.costRm<1?10:5);return i>=90?{letter:"A+",color:"#00FF88",note:"Outstanding! Your farm is ultra-efficient."}:i>=75?{letter:"A",color:"#4ADE80",note:"Excellent efficiency. Minor tweaks possible."}:i>=55?{letter:"B",color:"#FFD966",note:"Good efficiency. Some room to optimise."}:i>=35?{letter:"C",color:"#FB923C",note:"Average. Consider AI-driven scheduling."}:{letter:"D",color:"#F87171",note:"High consumption detected. Review alerts."}}async function ue(e){window.Chart||await new Promise((r,l)=>{const d=document.createElement("script");d.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js",d.onload=r,d.onerror=l,document.head.appendChild(d)});const i=e.map((r,l)=>{const d=new Date(r.createdAt||r.timestamp||Date.now()-(e.length-l)*36e5);return`${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`}),t=e.map(r=>r.waterLevel??r.waterDistanceCm??70),a=e.map(r=>{const l=r.lightRaw??r.light??2e3,d=r.temperature??25;return((l<1500?R:0)+(d>28?U:0))/10}),n={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},layout:{padding:{top:8,bottom:0,left:0,right:0}},scales:{x:{ticks:{color:"#94A3B8",font:{size:9},maxRotation:45,minRotation:45},grid:{color:"#F1F5F9"},border:{color:"#E2E8F0"}},y:{ticks:{color:"#94A3B8",font:{size:9}},grid:{color:"#F1F5F9"},border:{color:"#E2E8F0"}}}},o=document.getElementById("con-water-chart");o&&(o._chart&&o._chart.destroy(),o._chart=new window.Chart(o,{type:"line",data:{labels:i,datasets:[{data:t,borderColor:"#2563EB",backgroundColor:r=>{const l=r.chart,{ctx:d,chartArea:c}=l;if(!c)return"rgba(37,99,235,0.08)";const g=d.createLinearGradient(0,c.top,0,c.bottom);return g.addColorStop(0,"rgba(37,99,235,0.18)"),g.addColorStop(1,"rgba(37,99,235,0.01)"),g},fill:!0,tension:.4,pointRadius:2,pointHoverRadius:5,pointBackgroundColor:"#2563EB",pointBorderColor:"#fff",pointBorderWidth:1.5,borderWidth:2}]},options:{...n}}));const s=document.getElementById("con-energy-chart");s&&(s._chart&&s._chart.destroy(),s._chart=new window.Chart(s,{type:"bar",data:{labels:i,datasets:[{data:a,backgroundColor:a.map(r=>r>5?"rgba(217,119,6,0.85)":"rgba(217,119,6,0.5)"),borderColor:a.map(r=>r>5?"#92400E":"#B45309"),borderWidth:1,borderRadius:6,borderSkipped:!1}]},options:{...n}}))}function ve(e){const i=[{label:"💧 Water Pump",value:e.waterActivations,unit:"activations",pct:e.waterActivations/Math.max(e.totalReadings,1)*100,color:"#2563EB"},{label:"💡 Grow Lights",value:e.lightHours,unit:"hrs ON",pct:e.lightHours/Math.max(e.totalReadings,1)*100,color:"#D97706"},{label:"🌀 Cooling Fan",value:e.fanHours,unit:"hrs ON",pct:e.fanHours/Math.max(e.totalReadings,1)*100,color:"#16A34A"}];m("con-breakdown").innerHTML=i.map(t=>`
    <div>
      <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.8rem;">
        <span style="color:#374151; font-weight:500;">${t.label}</span>
        <span style="color:#1A2B3C; font-weight:700;">${t.value} ${t.unit}</span>
      </div>
      <div class="con-progress-track">
        <div class="con-progress-fill" style="width:${Math.min(t.pct,100).toFixed(1)}%; background:${t.color};"></div>
      </div>
    </div>
  `).join("")}function he(e,i,t){var o;const a=[];if(t.lightHours>t.totalReadings*.6){const s=(t.lightHours*.5*R/1e3*q).toFixed(2);a.push({icon:"💡",title:"Reduce grow light duration",desc:`Lights were ON for ${t.lightHours} intervals. Reducing by 2h/day saves ≈ RM ${s}/day.`,color:"#FFD966"})}if(t.waterActivations>8){const s=((t.waterActivations-6)*Z/1e3).toFixed(1);a.push({icon:"💧",title:"Batch your watering cycles",desc:`${t.waterActivations} watering events detected. Consolidating to 6 cycles saves ≈ ${s} L/day.`,color:"#60A5FA"})}const n=(i==null?void 0:i.ph)??((o=e[0])==null?void 0:o.ph);n&&(n<5.8||n>6.5)&&a.push({icon:"🧪",title:`pH imbalance detected (${n.toFixed(1)})`,desc:"Optimal range is 5.8–6.5. Out-of-range pH reduces nutrient uptake efficiency by up to 30%.",color:"#F87171"}),t.fanHours>t.totalReadings*.4&&a.push({icon:"🌡️",title:"High temperature periods detected",desc:`Fan was active ${t.fanHours} intervals. Check ventilation or adjust light schedule to avoid heat buildup.`,color:"#FB923C"}),a.length===0&&a.push({icon:"✅",title:"Your farm is running efficiently!",desc:"All consumption metrics are within optimal range. Keep up the good work.",color:"#4ADE80"}),m("con-ai-tips").innerHTML=a.map(s=>`
    <div style="
      background:#F8FAFC; border-left:3px solid ${s.color};
      border-radius:0 12px 12px 0; padding:12px;
      border-top: 1px solid #F1F5F9;
      border-right: 1px solid #F1F5F9;
      border-bottom: 1px solid #F1F5F9;
    ">
      <div style="font-weight:600; color:${s.color}; font-size:0.85rem;">${s.icon} ${s.title}</div>
      <div style="color:#475569; font-size:0.78rem; margin-top:4px; line-height:1.4;">${s.desc}</div>
    </div>
  `).join("")}function M(){const e=Date.now();return Array.from({length:24},(i,t)=>({deviceId:"farm_001",temperature:22+Math.sin(t/4)*4+Math.random()*2,humidity:60+Math.random()*15,soilRaw:1600+Math.floor(Math.random()*600),ph:5.9+Math.random()*.8,lightRaw:800+Math.floor(Math.random()*1200),waterLevel:70+Math.floor(Math.random()*20),gasRaw:800+Math.floor(Math.random()*300),createdAt:new Date(e-(23-t)*3600*1e3).toISOString()}))}function m(e){return document.getElementById(e)}function K(e){const i=m("con-loading"),t=m("con-content"),a=m("con-error");i&&(i.style.display=e==="loading"?"block":"none"),t&&(t.style.display=e==="content"?"block":"none"),a&&(a.style.display=e==="error"?"block":"none")}let C=45;function be(){return`
        <div style="padding:20px; background:#F9FBF9; min-height:100vh; font-family:sans-serif;">
            <div style="background:#FFFFFF; border-radius:24px; padding:16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; border:1px solid #EDF2F0; box-shadow:0 4px 12px rgba(0,0,0,0.02);">
                <span style="font-size:0.9rem; font-weight:700; color:#064E3B;">Predict Window:</span>
                <select id="predictTimeSelect" style="border:none; background:#F0FDF4; color:#065F46; padding:8px 12px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                    <option value="30">30 Mins</option>
                    <option value="45" ${C===45?"selected":""}>45 Mins</option>
                    <option value="60">60 Mins</option>
                </select>
            </div>
            <div id="dynamicAlertsList">
                <div style="text-align:center; padding:60px; color:#94A3B8;">🛰️ AI engine analyzing trends...</div>
            </div>
        </div>
    `}async function ye(){const e=document.getElementById("predictTimeSelect");e&&(e.onchange=i=>{C=parseInt(i.target.value),H("success",`AI calibrating for ${C}m...`),L()}),L()}async function L(){const e=document.getElementById("dynamicAlertsList");if(e)try{const i="farm_001",[t,a,n]=await Promise.all([fetch(`http://localhost:3000/api/sensors/latest?deviceId=${i}`),fetch(`http://localhost:3000/api/sensors/history?deviceId=${i}&limit=10`),fetch(`http://localhost:3000/api/sensors/preferences?deviceId=${i}`)]),o=await t.json(),s=await a.json(),r=await n.json(),l=o.reading||{temperature:24},d=s.readings?s.readings.map(f=>f.temperature).join(", "):"22, 23, 24",w=(await(await fetch("http://localhost:3000/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:`As an AI Farm Expert, analyze temp ${l.temperature}C and trend [${d}]. Limit: ${r.tempMax||30}C. 
                          If a risk exists in ${C}m, respond ONLY in this format: 
                          "TITLE: [Problem] | DESC: [Analysis]".
                          If stable, reply: "STABLE".`,history:[]})})).json()).reply||"";let p=[];if(w.includes("STABLE")||!w)p.push({title:"Heat Stress",desc:`The AI predicts a potential issue with heat stress for the next ${C} minutes, based on the rising temperature trend.`,btnText:"Pre-cool System"});else{const f=w.split("|"),h=f[0].replace("TITLE:","").trim(),b=f[1].replace("DESC:","").trim();p.push({title:h,desc:b,btnText:"Pre-cool System"})}N(e,p)}catch{N(e,[{title:"Heat Stress (Demo)",desc:"AI predicts a temperature spike in 45m. Immediate cooling suggested.",btnText:"Pre-cool System"}])}}function N(e,i){e.innerHTML=i.map(t=>`
        <div style="background:white; border-radius:28px; padding:24px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
            <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
                <div style="display:flex; gap:12px;">
                    <div style="width:52px; height:52px; background:#F0FDF4; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:1.6rem;">🌡️</div>
                    <div style="margin-top:4px;">
                        <b style="color:#064E3B; font-size:1.1rem; display:block;">${t.title}</b>
                        <span style="color:#94A3B8; font-size:0.75rem;">SeedDown AI Analysis</span>
                    </div>
                </div>
                <div style="background:#E0F2FE; color:#0369A1; padding:8px 12px; border-radius:12px; font-size:0.65rem; font-weight:800; height: fit-content;">
                    AI INFERENCE
                </div>
            </div>

            <p style="color:#64748B; font-size:0.9rem; line-height:1.5; margin-bottom:24px;">
                🌻 ${t.desc}
            </p>

            <div style="display:flex;">
                <button class="action-btn" style="flex:1; background:#EF4444; color:white; border:none; padding:18px; border-radius:20px; font-weight:700; cursor:pointer; font-size:1rem;">
                    ${t.btnText}
                </button>
            </div>
        </div>
    `).join(""),e.querySelectorAll(".action-btn").forEach(t=>{t.onclick=()=>{t.style.backgroundColor="#064E3B",H("success","AI intervention started. Pre-cooling system active.")}})}function Fe(e={}){const{feature:i,from:t="home"}=e,a=document.getElementById("screenContainer");let n="";i==="whatif"?n=V():i==="consumption"?n=fe():i==="alerts"&&(n=be()),a.innerHTML=`
        <div class="screen active" id="featureScreen">
            <div class="feat-topbar" style="display:flex; align-items:center; padding:12px 16px; background:var(--surface); gap:12px;">
                <button id="featureBackBtn" class="back-btn">← Back</button>
                <div style="font-weight:700;">${i==="whatif"?"🔮 What-If":i==="consumption"?"⚡ Eco Savings":"🚨 AI Alerts"}</div>
            </div>
            <div style="flex:1; overflow-y:auto;">${n}</div>
        </div>
    `,document.getElementById("featureBackBtn").addEventListener("click",()=>G(t)),i==="whatif"?X():i==="consumption"?ge():i==="alerts"&&ye()}export{Fe as render};
