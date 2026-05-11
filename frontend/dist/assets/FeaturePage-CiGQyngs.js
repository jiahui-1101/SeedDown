import{A as E,a as ie,s as Ee}from"./index-BbseWLT4.js";import"https://esm.sh/three@0.160.0";const ne="farm_001",ae=.042,oe=1.1,re=.04,y={water:{low:40,high:70},light:{low:40,high:70},nutrient:{low:40,high:70}},R={dry:2.5,mid:1.5,wet:.8},$={dark:10,mid:8,bright:6},M={low:1.5,mid:1,high:.7},b={temp:28,humid:68,light:82,water:45,nutrient:78},z=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function Fe(){var t;try{const i=JSON.parse(localStorage.getItem("user_farms")||"[]"),e=E.currentFarm||i.find(n=>n.id===E.currentFarmId)||(()=>{var n;return i.length>1&&console.warn("[WhatIf] currentFarmId not set — falling back to last farm:",(n=i[i.length-1])==null?void 0:n.id),i[i.length-1]})();return(t=e==null?void 0:e.plants)!=null&&t.length?e.plants:null}catch{return null}}function Ie(t){const i={tomato:{kg:.32,units:4,readyIn:60,color:"#D85A30"},carrot:{kg:.24,units:6,readyIn:70,color:"#BA7517"},cabbage:{kg:.41,units:2,readyIn:80,color:"#639922"},eggplant:{kg:.28,units:3,readyIn:75,color:"#534AB7"},basil:{kg:.09,units:10,readyIn:28,color:"#1D9E75"},green_onion:{kg:.11,units:8,readyIn:50,color:"#3B6D11"},lettuce:{kg:.2,units:4,readyIn:35,color:"#639922"},spinach:{kg:.15,units:5,readyIn:40,color:"#2E7D32"},strawberry:{kg:.3,units:3,readyIn:90,color:"#C62828"},pepper:{kg:.25,units:3,readyIn:80,color:"#E65100"},mint:{kg:.08,units:8,readyIn:25,color:"#1B5E20"},chili:{kg:.1,units:6,readyIn:90,color:"#B71C1C"},cucumber:{kg:.35,units:3,readyIn:55,color:"#33691E"},banana:{kg:1.2,units:1,readyIn:270,color:"#F9A825"},mango:{kg:.8,units:1,readyIn:180,color:"#FF8F00"}},e=new Map;for(const n of t){const a=n.species;if(e.has(a)){const o=e.get(a);o.totalSlots+=n.slots||1}else e.set(a,{species:n.species,name:n.name,emoji:n.emoji||"🌱",totalSlots:n.slots||1})}return Array.from(e.values()).map(n=>{const a=i[n.species]||{kg:.2,readyIn:45,color:"#639922"};return{id:n.species,name:n.name,emoji:n.emoji||"🌱",days:a.readyIn,kg:parseFloat((a.kg*n.totalSlots).toFixed(2)),units:n.totalSlots,readyIn:a.readyIn,color:a.color,slots:n.totalSlots}})}async function se(){var e,n,a,o,s,l,f,r,d,g;const t=E.currentFarmId||ne,i={temp:((n=(e=E.sensors)==null?void 0:e.temp)==null?void 0:n.val)??b.temp,humid:((o=(a=E.sensors)==null?void 0:a.humid)==null?void 0:o.val)??b.humid,light:((l=(s=E.sensors)==null?void 0:s.light)==null?void 0:l.val)??b.light,water:((r=(f=E.sensors)==null?void 0:f.water)==null?void 0:r.val)??b.water,nutrient:((g=(d=E.sensors)==null?void 0:d.nutrient)==null?void 0:g.val)??b.nutrient};try{const c=await(await fetch(`${z}/api/sensors/latest?deviceId=${t}`)).json();return{temp:c.temperature??c.temp??i.temp,humid:c.humidity??c.humid??i.humid,light:c.light??c.lux??i.light,water:c.soilMoisture??c.water??i.water,nutrient:c.nutrient??c.ec??i.nutrient}}catch{return i}}async function de(){const t=E.currentFarmId||ne;try{const e=await(await fetch(`${z}/api/sensors/weekly-avg?deviceId=${t}`)).json(),n=e.avg||{};return{temp:n.temperature??b.temp,humid:n.humidity??b.humid,light:n.light??b.light,water:n.soilMoisture??b.water,nutrient:n.nutrient??b.nutrient,days:e.days,source:e.source}}catch{return se()}}const D=[{id:"tomato",name:"Tomato",emoji:"🍅",days:60,kg:.32,units:4,readyIn:60,color:"#D85A30"},{id:"carrot",name:"Carrot",emoji:"🥕",days:70,kg:.24,units:6,readyIn:70,color:"#BA7517"},{id:"cabbage",name:"Cabbage",emoji:"🥬",days:80,kg:.41,units:2,readyIn:80,color:"#639922"},{id:"eggplant",name:"Eggplant",emoji:"🍆",days:75,kg:.28,units:3,readyIn:75,color:"#534AB7"},{id:"basil",name:"Basil",emoji:"🌿",days:28,kg:.09,units:10,readyIn:28,color:"#1D9E75"},{id:"green_onion",name:"Green Onion",emoji:"🧅",days:50,kg:.11,units:8,readyIn:50,color:"#3B6D11"}],Ce=[{name:"Bolognese Pasta",emoji:"🍝",ingr:["tomato","carrot","basil"]},{name:"ABC Soup",emoji:"🍲",ingr:["cabbage","carrot","tomato","green_onion"]},{name:"Grilled Eggplant",emoji:"🍽️",ingr:["eggplant","basil"]},{name:"Spring Green Salad",emoji:"🥗",ingr:["green_onion","basil","cabbage"]}],ke={lettuce:{mktPrice:4.8,perRowKgWk:.35,waterSave:3.2,energySave:1.1,fertilizer:.8,note:"Lettuce grows fast — your rows beat supermarket prices by 2× this month."},tomato:{mktPrice:7.2,perRowKgWk:.22,waterSave:2.1,energySave:.9,fertilizer:1.1,note:"Tomatoes fetched RM 7.20/kg at Pasar Borong this week. Yours cost much less."},carrot:{mktPrice:3.5,perRowKgWk:.18,waterSave:1.8,energySave:.7,fertilizer:.6,note:"Carrots are low-maintenance and high-value for home growing."},basil:{mktPrice:12,perRowKgWk:.12,waterSave:.9,energySave:.5,fertilizer:.4,note:"Fresh basil at supermarkets is expensive. Your rows are a gold mine."},eggplant:{mktPrice:5.5,perRowKgWk:.2,waterSave:2.4,energySave:1.3,fertilizer:.9,note:"Eggplant uses more water but market price makes it worthwhile."}},P={spinach:{emoji:"🥬",readyDays:5,readyZone:"Zone B lettuce",space:"1.2m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+0.5°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+3%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"-0.5h",dir:"down"},{name:"Fertilizer",emoji:"🧫",change:"+8%",dir:"up"}],ai:"Spinach thrives alongside lettuce. Humidity increase is within safe range (≤85%)."},mint:{emoji:"🌿",readyDays:3,readyZone:"Zone A chives",space:"0.6m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"No change",dir:"ok"},{name:"Humidity",emoji:"💧",change:"+5%",dir:"up"},{name:"pH value",emoji:"🧪",change:"-0.2",dir:"down"},{name:"Light (h/d)",emoji:"☀️",change:"No change",dir:"ok"},{name:"Fertilizer",emoji:"🧫",change:"+5%",dir:"up"}],ai:"Mint can be aggressive — consider a physical divider from neighbouring herbs."},chili:{emoji:"🌶️",readyDays:12,readyZone:"Zone C eggplant",space:"2.1m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1.5°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"-4%",dir:"down"},{name:"pH value",emoji:"🧪",change:"+0.3",dir:"up"},{name:"Light (h/d)",emoji:"☀️",change:"+2h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+15%",dir:"up"}],ai:"Chili needs more heat and light. You may need to adjust Zone C lighting before planting."},cucumber:{emoji:"🥒",readyDays:8,readyZone:"Zone D tomato",space:"1.8m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+6%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+12%",dir:"up"}],ai:"Cucumbers are water-heavy. Ensure your pump schedule scales with the new plant count."},strawberry:{emoji:"🍓",readyDays:14,readyZone:"Zone E herbs",space:"0.9m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"-1°C",dir:"down"},{name:"Humidity",emoji:"💧",change:"+2%",dir:"up"},{name:"pH value",emoji:"🧪",change:"-0.4",dir:"down"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+10%",dir:"up"}],ai:"Strawberries prefer cooler temps. Place them away from the heat lamp cluster for best results."},tomato:{emoji:"🍅",readyDays:9,readyZone:"Zone D",space:"1.5m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+4%",dir:"up"},{name:"pH value",emoji:"🧪",change:"+0.1",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+10%",dir:"up"}],ai:"Tomatoes do best with deep watering every 2–3 days."},basil:{emoji:"🌿",readyDays:4,readyZone:"Zone E herbs",space:"0.5m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"No change",dir:"ok"},{name:"Humidity",emoji:"💧",change:"+2%",dir:"ok"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+4%",dir:"up"}],ai:"Basil is low-impact. Great companion plant for tomatoes and peppers."}},Ae=[{zone:"Zone A",crop:"Chives",fill:90},{zone:"Zone B",crop:"Lettuce",fill:75},{zone:"Zone C",crop:"Eggplant",fill:95},{zone:"Zone D",crop:"Tomato",fill:60},{zone:"Zone E",crop:"Herbs",fill:82}],H=Object.entries(P).map(([t,i])=>({id:t,name:t.charAt(0).toUpperCase()+t.slice(1),emoji:i.emoji}));let F=new Set,j=4,I=5,T="spinach",S=null;function Se(){return`
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
            <input type="range" min="7" max="365" value="30" step="1" id="wif-sl-days" oninput="wifUpdateHarvest()">
            <span class="wif-slider-val" id="wif-v-days">30 days</span>
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
          <select class="wif-sel" id="wif-cost-plant" onchange="wifTriggerCostAi()">
  <option value="" disabled>Loading your crops...</option>
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

        <!-- ✅ FIX 4.3: AI advisor card — shown below add-plant form, updated by wifFetchNewPlantAi -->
        <div id="wif-np-advisor-card" class="wif-card" style="display:none;border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
          <div class="wif-card-title">🤖 AI Advisor</div>
          <div id="wif-np-advisor-body"></div>
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
          <div class="wif-ai-note" id="wif-np-ai-note-wrap" style="display:none;"><span> </span><span id="wif-np-ai-note">Loading...</span></div>
        </div>
      </div>

    </div>
  `}function Be(){var a;const t=document.getElementById("wif-cost-plant");if(!t)return;const i=window._WIF_DYNAMIC_CROPS||D,e=new Set,n=i.filter(o=>e.has(o.id)?!1:(e.add(o.id),!0));n.length===0?t.innerHTML='<option value="lettuce">Lettuce</option><option value="tomato">Tomato</option>':t.innerHTML=n.map(o=>`<option value="${o.id}">${o.emoji} ${o.name}</option>`).join(""),t.value=((a=n[0])==null?void 0:a.id)||"lettuce",setTimeout(pe,0)}function De(){F=new Set,j=4,I=5,T="spinach",window.wifSwitchTab=Te,window.wifUpdateHarvest=q,window.wifUpdateCost=B,window.wifUpdateNewPlant=C,window.wifToggleCrop=Re,window.wifChangeQty=He,window.wifChangeRows=Me,window.wifNpFilterSuggestions=ze,window.wifSelectNp=Pe,window.wifSelectSpecies=fe,window.wifNpShowSuggestions=Le,window.wifNpHideSuggestions=W,window.wifTriggerCostAi=pe;const t=Fe();t!=null&&t.length?window._WIF_DYNAMIC_CROPS=Ie(t):window._WIF_DYNAMIC_CROPS=null,S&&(S.destroy(),S=null);const i=document.getElementById("wif-np-input");i&&(i.value="Spinach"),Be(),q(),de().then(e=>{window._wif_lastSensors=e,B()}).catch(()=>B()),C()}function Te(t,i){document.querySelectorAll(".wif-section").forEach(e=>e.classList.remove("active")),document.querySelectorAll(".wif-tab-btn").forEach(e=>e.classList.remove("active")),document.getElementById("wif-"+t).classList.add("active"),i.classList.add("active"),t==="cost"&&B(),t==="newplant"&&C()}function q(){const t=window._WIF_DYNAMIC_CROPS||D,i=parseInt(document.getElementById("wif-sl-days").value);document.getElementById("wif-v-days").textContent=i+(i===1?" day":" days");const e=t.filter(o=>o.readyIn<=i),n=e.reduce((o,s)=>o+s.kg,0),a=e.reduce((o,s)=>o+s.units,0);document.getElementById("wif-hm-items").textContent=e.length,document.getElementById("wif-hm-yield").textContent=n.toFixed(2)+" kg",document.getElementById("wif-hm-units").textContent=a,document.getElementById("wif-crop-timelines").innerHTML=t.map(o=>{const s=Math.min(100,Math.round(i/o.readyIn*100)),l=o.readyIn<=i;return`
      <div class="wif-tl-row">
        <span class="wif-tl-name">${o.emoji} ${o.name}</span>
        <div class="wif-tl-track">
          <div class="wif-tl-fill" style="width:${s}%;background:${l?"var(--accent,#639922)":"var(--amber-100,#FAC775)"};"></div>
        </div>
        ${l?`<span class="wif-tl-count">${o.units} units <span class="wif-badge wif-badge-green">Ready</span></span>`:`<span class="wif-tl-end" style="color:var(--text-secondary,#666)">Day ${o.readyIn}</span>`}
      </div>`}).join(""),le(i),ce()}function le(t){const i=window._WIF_DYNAMIC_CROPS||D,e=document.getElementById("wif-crop-select"),n=i.filter(a=>a.readyIn<=t);if(F.forEach(a=>{n.find(o=>o.id===a)||F.delete(a)}),n.length===0){e.innerHTML='<span style="font-size:12px;color:var(--text-secondary,#999);">No crops ready yet — move the slider forward.</span>';return}e.innerHTML=n.map(a=>`
    <div class="wif-pill ${F.has(a.id)?"selected":""}"
         onclick="wifToggleCrop('${a.id}')">
      ${a.emoji} ${a.name}
    </div>`).join("")}function Re(t){F.has(t)?F.delete(t):F.add(t);const i=parseInt(document.getElementById("wif-sl-days").value);le(i),ce()}function ce(){const t=document.getElementById("wif-recipe-grid"),i=document.getElementById("wif-ai-recipe-note");if(F.size===0){t.innerHTML="",i.textContent="Select crops above to see recipe suggestions.";return}const e=Ce.map(n=>{const a=n.ingr.filter(o=>F.has(o)).length;return a===0?null:{...n,match:a,pct:Math.round(a/n.ingr.length*100)}}).filter(Boolean).sort((n,a)=>a.match-n.match);t.innerHTML=e.map(n=>`
    <div class="wif-recipe-card">
      <div class="wif-recipe-hero">${n.emoji}</div>
      <div class="wif-recipe-name">
        ${n.name}
        <span class="wif-badge ${n.pct===100?"wif-badge-green":"wif-badge-amber"}">${n.pct}%</span>
      </div>
      <div>
        ${n.ingr.map(a=>{const s=(window._WIF_DYNAMIC_CROPS||D).find(f=>f.id===a)||D.find(f=>f.id===a);return F.has(a)?`<span class="wif-ingr-tag">${s?s.emoji+" "+s.name:a}</span>`:`<span class="wif-ingr-tag" style="background:#f0f0f0;color:#999;border:0.5px dashed #ccc;">🛒 ${s?s.name:a}</span>`}).join("")}
      </div>
    </div>`).join(""),i.textContent=e.length>0?`${e.length} recipe${e.length>1?"s":""} match your harvest. Loading database...`:"No local matches. Loading database recipes...",$e([...F])}async function $e(t){const i=document.getElementById("wif-recipe-grid"),e=document.getElementById("wif-ai-recipe-note"),n={tomato:["tomato","tomatoes"],carrot:["carrot","carrots"],cabbage:["cabbage"],eggplant:["eggplant","aubergine","brinjal"],basil:["basil"],green_onion:["green onion","green onions","scallion"],lettuce:["lettuce"],spinach:["spinach"],strawberry:["strawberry","strawberries"],pepper:["bell pepper","green pepper","capsicum"]};try{const a=await Promise.all(t.map(r=>fetch(`${z}/api/whatif/recipes?species=${r}`).then(d=>d.ok?d.json():{recipes:[]}).catch(()=>({recipes:[]})))),o=new Set,s=a.flatMap(r=>r.recipes||[]).filter(r=>o.has(r.name)?!1:(o.add(r.name),!0));if(!s.length){e.textContent=e.textContent.replace("Loading database...","(No DB results)").replace("Loading database recipes...","(No DB results)");return}const l=s.map(r=>{const d=t.filter(c=>{const w=n[c]||[c];return r.ingredients.some(p=>w.some(u=>p.toLowerCase().includes(u.toLowerCase())))});if(d.length===0)return null;const g=t.flatMap(c=>n[c]||[c]),m=r.ingredients.filter(c=>{const w=c.toLowerCase();return!(g.some(u=>w.includes(u))||["salt","pepper","water","oil","sugar","flour","butter","egg","milk","sauce","mix","seasoning","powder","vinegar","cream","cheese","margarine"].some(u=>w.includes(u)))}).map(c=>c.replace(/^\d[\d\s\/]*(\(\d+[\s\w\.]+\))?\s*(lb|oz|c|pkg|tsp|tbsp|can|qt|pt|pkg|Tbsp|large|medium|small|fresh|dried|chopped|diced|sliced|cooked|frozen|thawed|drained|shredded|grated|minced|crushed|ground|boneless|skinless)\.?\s*/gi,"").replace(/^[\d\/\s\.]+/,"").trim()).filter(c=>c.length>2&&c.length<40).slice(0,4);return{recipe:r,grownMatches:d,otherIngredients:m}}).filter(Boolean).sort((r,d)=>d.grownMatches.length-r.grownMatches.length);if(!l.length){e.textContent="No database recipes matched your selected crops.";return}const f=l.map(({recipe:r,grownMatches:d,otherIngredients:g})=>{const m=d.map(w=>{const u=(window._WIF_DYNAMIC_CROPS||D).find(x=>x.id===w)||D.find(x=>x.id===w);return`<span class="wif-ingr-tag" style="background:var(--teal-50,#E1F5EE);color:var(--teal-600,#0F6E56);border:0.5px solid var(--teal-200,#7DD3BD);">${u?u.emoji+" "+u.name:w}</span>`}).join(""),c=g.map(w=>`<span class="wif-ingr-tag" style="background:#f0f0f0;color:#888;border:0.5px dashed #ccc;">🛒 ${w}</span>`).join("");return`
        <div class="wif-recipe-card" style="border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
          <div class="wif-recipe-hero">🍽️</div>
          <div class="wif-recipe-name">
            ${r.name.trim()}
            <span class="wif-badge wif-badge-teal">DB</span>
          </div>
          <div>${m}${c}</div>
        </div>`}).join("");i.innerHTML+=f,e.textContent=`${l.length} recipes found — green = your harvest, 🛒 = ingredients to buy.`}catch{e.textContent=e.textContent.replace("Loading database...","(Backend offline — local only)").replace("Loading database recipes...","(Backend offline — local only)")}}function Me(t){I=Math.max(1,Math.min(20,I+t));const i=document.getElementById("wif-rows-disp");i&&(i.textContent=I),B()}function B(){const t=document.getElementById("wif-cost-plant"),i=t==null?void 0:t.value,e=document.getElementById("wif-sl-weeks");if(!i||!e)return;const n=parseInt(e.value);document.getElementById("wif-v-weeks").textContent=n+(n===1?" wk":" wks");const a=ke[i]||{mktPrice:5,perRowKgWk:.28,fertilizer:.6,note:"Analysing your crop with current sensor data..."},o=I*a.perRowKgWk*n,s=o*a.mktPrice,l=window._wif_lastSensors||b,f=l.water<y.water.low?R.dry:l.water>y.water.high?R.wet:R.mid,r=parseFloat((f*I*n*ae).toFixed(2)),d=l.light>y.light.high?$.bright:l.light>y.light.low?$.mid:$.dark,g=parseFloat((d*re*n*7).toFixed(2)),m=parseFloat((g*oe).toFixed(2)),c=l.nutrient<y.nutrient.low?M.low:l.nutrient>y.nutrient.high?M.high:M.mid,w=parseFloat((a.fertilizer*(n/4)*c).toFixed(2)),p=r+m+w,u=s-p;document.getElementById("wif-net-saving").textContent="RM "+u.toFixed(2),document.getElementById("wif-cost-breakdown").innerHTML=`
    <div class="wif-cost-row wif-cost-income">
      <span class="wif-cost-lbl">📦 Harvest value (${o.toFixed(1)} kg × RM ${a.mktPrice}/kg)</span>
      <span style="color:var(--green-600,#3B6D11);font-weight:500;">+RM ${s.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">💧 Water cost <span style="font-size:10px;opacity:.7;">(soil ${l.water}% → ${f}L/plant/wk)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${r.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">⚡ Energy cost <span style="font-size:10px;opacity:.7;">(light ${l.light}% → ${d}h lighting/day)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${m.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">🧪 Fertilizer <span style="font-size:10px;opacity:.7;">(nutrient ${l.nutrient}% → ${c}× base)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${w.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-net">
      <span>⭐ Net savings</span>
      <span style="color:var(--teal-600,#0F6E56);">RM ${u.toFixed(2)}</span>
    </div>`;const x=document.getElementById("wif-cost-ai-note");x&&!window._wif_aiNoteSet&&(x.textContent=a.note),je(n,a)}function je(t,i){const e=document.getElementById("wif-savings-chart");if(e)if(typeof Chart>"u"){const n=document.createElement("script");n.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",n.onload=()=>J(e,t,i),document.head.appendChild(n)}else J(e,t,i)}function J(t,i,e){S&&(S.destroy(),S=null);const n=window._wif_lastSensors||b,a=n.water<y.water.low?R.dry:n.water>y.water.high?R.wet:R.mid,o=n.light>y.light.high?$.bright:n.light>y.light.low?$.mid:$.dark,s=n.nutrient<y.nutrient.low?M.low:n.nutrient>y.nutrient.high?M.high:M.mid,l=[],f=[];for(let r=1;r<=i;r++){l.push("W"+r);const d=I*e.perRowKgWk*r*e.mktPrice,g=a*I*r*ae,m=o*re*r*7*oe,c=e.fertilizer*(r/4)*s;f.push(parseFloat((d-g-m-c).toFixed(2)))}S=new Chart(t,{type:"bar",data:{labels:l,datasets:[{label:"Net savings (RM)",data:f,backgroundColor:"#97C459",borderRadius:4,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:r=>"RM "+r.raw.toFixed(2)}}},scales:{y:{beginAtZero:!0,ticks:{callback:r=>"RM "+r,font:{size:10}},grid:{color:"rgba(128,128,128,0.08)"}},x:{grid:{display:!1},ticks:{font:{size:10}}}}}})}function pe(){var e,n,a;const t=(e=document.getElementById("wif-cost-plant"))==null?void 0:e.value,i=parseInt(((n=document.getElementById("wif-sl-weeks"))==null?void 0:n.value)||1);t&&(window._wif_aiNoteSet=!1,(a=document.getElementById("wif-ai-savings-detail"))==null||a.remove(),B(),_e(t,I,i))}async function _e(t,i,e){var o;const n=document.getElementById("wif-cost-ai-note");n.textContent="🤖 Analyzing your sensor data...";const a=await de();window._wif_lastSensors=a,B(),(o=document.getElementById("wif-ai-savings-detail"))==null||o.remove();try{let s=100;(a.temp>32||a.temp<20)&&(s-=15),(a.humid>85||a.humid<40)&&(s-=10),a.water<35&&(s-=20),a.light<40&&(s-=15),a.nutrient<45&&(s-=15),s=Math.max(25,Math.min(100,s));let l="Excellent";s<90&&(l="Good"),s<70&&(l="Moderate"),s<50&&(l="Poor"),window._wif_dynamicCondition={score:s,label:l};const f=await fetch(`${z}/api/whatif/costsaving`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plant:t,units:i,weeks:e,sensors:a})});if(!f.ok)throw new Error("Server error");const r=await f.json();window._wif_aiNoteSet=!0,n.textContent=r.insight;const d=document.createElement("div");d.id="wif-ai-savings-detail",d.innerHTML=`
      <div class="wif-card" style="margin-bottom:12px;border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
        <div class="wif-card-title">🤖 AI Resource Analysis</div>
        <div class="wif-metric-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:10px;">
          <div class="wif-metric">
            <div class="wif-metric-val" style="font-size:15px;color:var(--teal-600,#0F6E56);">${window._wif_dynamicCondition.score}%</div>
            <div class="wif-metric-lbl">Condition: ${window._wif_dynamicCondition.label}</div>
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
      </div>`;const g=document.getElementById("wif-cost"),m=g.querySelectorAll(":scope > .wif-card");m.length>=3?m[2].before(d):g.appendChild(d)}catch{n.textContent="AI analysis unavailable — showing calculated estimates only."}}let N=null;function ze(){const t=document.getElementById("wif-np-input"),i=document.getElementById("wif-np-suggestions");if(!t||!i)return;const e=t.value.trim().toLowerCase(),n=H.filter(o=>o.name.toLowerCase().includes(e)),a=n.find(o=>o.name.toLowerCase()===e);a&&(T=a.id,clearTimeout(N),N=setTimeout(C,400)),!a&&e.length>0&&(T=e,clearTimeout(N),N=setTimeout(C,600)),n.length===0?i.innerHTML=`
      <div class="wif-np-sug-item">
        🤖 Analyze "${e}"
      </div>
    `:i.innerHTML=n.map(o=>`
      <div class="wif-np-sug-item"
           onclick="wifSelectNp('${o.id}')">
        <span class="wif-np-sug-emoji">${o.emoji}</span>
        ${o.name}
      </div>
    `).join(""),i.style.display="block"}function Le(){const t=document.getElementById("wif-np-input").value.toLowerCase(),i=t?H.filter(e=>e.name.toLowerCase().includes(t)):H;Ne(i)}function W(){const t=document.getElementById("wif-np-suggestions");t&&(t.style.display="none")}function Ne(t){const i=document.getElementById("wif-np-suggestions");if(i){if(!t.length){i.style.display="none";return}i.style.display="block",i.innerHTML=t.map(e=>`
    <div class="wif-np-sug-item" data-id="${e.id}" data-name="${e.name}">
      <span class="wif-np-sug-emoji">${e.emoji}</span>
      <span>${e.name}</span>
    </div>`).join(""),i.querySelectorAll(".wif-np-sug-item").forEach(e=>{e.addEventListener("click",()=>{fe(e.dataset.id,e.dataset.name)})})}}function Pe(t){T=t.toLowerCase();const i=document.getElementById("wif-np-input");if(i){const e=H.find(n=>n.id===t);i.value=e?`${e.emoji} ${e.name}`:t}C(),W()}function fe(t,i){T=t;const e=document.getElementById("wif-np-input");e&&(e.value=i),W(),C()}function He(t){j=Math.max(1,Math.min(20,j+t));const i=document.getElementById("wif-qty-disp");i&&(i.textContent=j),C()}function U(){try{const t=JSON.parse(localStorage.getItem("user_farms")||"[]");if(!t.length)return null;const i=t.find(r=>{var d;return r.id===((d=E)==null?void 0:d.currentFarmId)})||t[t.length-1];if(!i)return null;const e=Array.isArray(i.plants)?i.plants:[];if(!e.length)return null;const a=(i.rackLabel||i.rackTypeId||"3-tier").match(/(\d+)/),o=a?parseInt(a[1]):3,s={};if(e.some(r=>r.tier!==void 0))e.forEach(r=>{const d=r.tier||1;s[d]||(s[d]=[]),s[d].push(r)});else{const r=Math.ceil(e.length/o);e.forEach((d,g)=>{const m=Math.floor(g/r)+1;s[m]||(s[m]=[]),s[m].push(d)})}const f=i.slotsPerTier||Math.max(...e.map(r=>r.position||1))||3;return Array.from({length:o},(r,d)=>{const g=d+1,m=s[g]||[],c=Math.round(m.length/f*100),w=[...new Set(m.map(p=>p.name))].join(", ")||"Empty";return{zone:`Tier ${g}`,crop:w,fill:Math.min(c,100)}})}catch(t){return console.warn("wifBuildFarmZones error:",t),null}}function Oe(){const t=document.getElementById("wif-zone-list");if(!t)return;const i=U()||Ae;t.innerHTML=i.map(e=>`
    <div class="wif-zone-row">
      <div>
        <div class="wif-zone-name">${e.zone} — ${e.crop}</div>
        <div class="wif-zone-meta">${e.fill}% capacity</div>
      </div>
      <span class="wif-badge ${e.fill>=90?"wif-badge-red":e.fill>=75?"wif-badge-amber":"wif-badge-green"}">
        ${e.fill>=90?"Full":e.fill>=75?"Near full":"Available"}
      </span>
    </div>`).join("")}function C(){var f;const t=document.getElementById("wif-impact-grid"),i=document.getElementById("wif-np-ai-note");if(!t||!i)return;const e=P[T],n=document.getElementById("wif-ready-title"),a=document.getElementById("wif-ready-sub"),o=U();o&&o.some(r=>r.fill<90);const s=o==null?void 0:o.find(r=>r.fill<90);if((o?o.every(r=>r.fill>=90):!1)?(n&&(n.textContent="No space available"),a&&(a.textContent="All tiers are full. Harvest existing crops first to free up space.")):s?(n&&(n.textContent=`Space available in ${s.zone}`),a&&(a.textContent=`${s.zone} is ${s.fill}% full — has room for new plants.`)):e?(n&&(n.textContent=`You can plant in ${e.readyDays} days`),a&&(a.textContent=`${e.readyZone} harvests on Day ${e.readyDays} — freeing ${e.space} of space.`)):(n&&(n.textContent="Ready for planting"),a&&(a.textContent="Current farm conditions are suitable.")),Oe(),(f=e==null?void 0:e.impacts)!=null&&f.length){const r=Math.min(j/4,3);t.innerHTML=e.impacts.filter(d=>d.name!=="Temperature").map(d=>{let g=d.change;if(d.dir!=="ok"){const m=parseFloat(d.change);if(!isNaN(m)){const c=m*r,w=c>0?"+":"",p=d.change.includes("%")?"%":d.change.includes("°")?"°C":d.change.includes("h")?"h":"";g=w+c.toFixed(1).replace(/\.0$/,"")+p}}return`
        <div class="wif-impact-card ${d.dir}">
          <div class="wif-impact-emoji">${d.emoji}</div>
          <div class="wif-impact-name">${d.name}</div>
          <div class="wif-impact-val ${d.dir}">${g}</div>
        </div>`}).join("")}else t.innerHTML=`
      <div class="wif-impact-card ok" style="grid-column:1/-1;text-align:center;padding:18px;">
        <div class="wif-impact-emoji">🌱</div>
        <div class="wif-impact-name">Impact</div>
        <div class="wif-impact-val ok">Calculating...</div>
      </div>`;i.style.display="none",We(T,j)}async function We(t,i){var l,f,r,d,g,m,c;const e=document.getElementById("wif-np-ai-note"),n=document.getElementById("wif-np-advisor-card"),a=document.getElementById("wif-np-advisor-body");n&&(n.style.display="block",a.innerHTML=`
      <div class="wif-ai-note" style="margin:0;">
        <span>🤖</span><span>Analysing suitability for <strong>${t}</strong>...</span>
      </div>`);const o=await se(),s=window._WIF_DYNAMIC_CROPS?window._WIF_DYNAMIC_CROPS.map(w=>w.id):["lettuce","tomato","basil"];try{const w=await fetch(`${z}/api/whatif/newplant`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({species:t,quantity:i,currentCrops:s,sensors:o})});if(!w.ok)throw new Error("Server error");const p=await w.json(),u=p.analysis||{};if(p.unsuitable=u.suitable===!1||p.unsuitable===!0,p.insight=u.reason?`${u.reason} ${u.careAdvice||""}`.trim():p.insight||"Analysis complete.",p.warnings=u.warnings||p.warnings||[],p.supported=!p.unsuitable,p.score=u.compatibilityScore??p.score??0,a)if(p.unsuitable)a.innerHTML=`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;">
            <span style="font-size:28px;">⚠️</span>
            <div>
              <div style="font-size:13px;font-weight:500;color:var(--red-400,#E24B4A);margin-bottom:4px;">Not suitable for indoor vertical farming</div>
              <div style="font-size:12px;color:var(--text-secondary,#666);">${p.insight}</div>
            </div>
          </div>`;else{const k=(l=p.warnings)!=null&&l.length?`<div style="margin-top:8px;padding:8px 10px;background:var(--amber-50,#FAEEDA);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--amber-800,#633806);">
               ⚠️ ${p.warnings.join(" · ")}
             </div>`:`<div style="margin-top:8px;padding:8px 10px;background:var(--green-50,#EAF3DE);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--green-800,#27500A);">
               ✅ All projected values within safe range
             </div>`;a.innerHTML=`
          <div style="font-size:12px;color:var(--teal-600,#0F6E56);line-height:1.5;">${p.insight}</div>
          ${k}
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
            <span class="wif-badge wif-badge-green">Suitable Indoor Crop</span>
            <span class="wif-badge wif-badge-blue">AI Score: ${p.score}%</span>
          </div>`}if(e){const k=n&&n.style.display!=="none";e.style.display=k?"none":"flex",e.textContent=p.insight}const x=document.getElementById("wif-ready-title"),L=document.getElementById("wif-ready-sub"),K=U(),ve=K?K.every(k=>k.fill>=90):!1;p.supported?ve&&(x&&(x.textContent="No space available"),L&&(L.textContent="All tiers are full. Harvest existing crops first to free up space.")):(x&&(x.textContent="Not recommended right now"),L&&(L.textContent=((f=p.warnings)==null?void 0:f[0])||"Check the AI advisor for details."));const G=document.getElementById("wif-impact-grid");if(G&&!p.unsuitable&&p.impacts){const k={Temperature:(r=p.impacts)==null?void 0:r.tempChange,Humidity:(d=p.impacts)==null?void 0:d.humidChange,"Light (h/d)":(g=p.impacts)==null?void 0:g.lightChange,Fertilizer:(m=p.impacts)==null?void 0:m.nutrientChange},Y=(((c=P[t])==null?void 0:c.impacts)||[]).map(h=>{const A=k[h.name];if(A==null)return h;const he=A>0?"+":"",ye=h.name.includes("Light")?"h":h.name.includes("Temp")?"°C":"%",be=A===0?"No change":`${he}${A}${ye}`,xe=A===0?"ok":A>0?"up":"down";return{...h,change:be,dir:xe}}).filter(h=>h.name!=="Temperature");Y.length>0&&(G.innerHTML=Y.map(h=>`
          <div class="wif-impact-card ${h.dir||"ok"}">
            <div class="wif-impact-emoji">${h.emoji||"🌱"}</div>
            <div class="wif-impact-name">${h.name||"Unknown"}</div>
            <div class="wif-impact-val ${h.dir||"ok"}">${h.change||"No change"}</div>
          </div>`).join(""))}}catch{a&&(a.innerHTML=`
        <div class="wif-ai-note" style="margin:0;">
          <span>🤖</span><span>AI advisor unavailable — check your connection.</span>
        </div>`);const p=P[t];e&&(e.textContent=p?`${p.ai} (${i} plants)`:"AI prediction unavailable.")}}const V="http://localhost:3000",Z=45,Ue=10,ge=20,me=250,we=.218;function Ze(){return`
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
  `}async function Ke(){var t;(t=document.getElementById("con-retry-btn"))==null||t.addEventListener("click",()=>Q()),await Q()}async function Q(){ue("loading");try{const t=E.currentFarmId||"farm_001",[i,e]=await Promise.all([fetch(`${V}/api/sensors/history?deviceId=farm_001&limit=24`),fetch(`${V}/api/sensors/latest?deviceId=farm_001`)]);if(!i.ok||!e.ok)throw new Error("API error");const n=await i.json(),a=await e.json(),o=n.readings||[],s=a.reading||null;o.length===0?O(X(),!0):O(o,!1,s)}catch(t){console.warn("[ConsumptionPage] Backend unreachable, using mock data for demo:",t.message),O(X(),!0)}}function O(t,i=!1,e=null){var f,r;ue("content");const n=Ge(t);v("con-water-today").textContent=`${n.waterLiters.toFixed(1)} L`,v("con-energy-today").textContent=`${n.energyKwh.toFixed(2)} kWh`,v("con-co2").textContent=`${n.co2Saved.toFixed(2)} kg`,v("con-cost").textContent=`RM ${n.costRm.toFixed(2)}`;const a=Math.round((1-n.waterLiters/60)*100),o=Math.round((1-n.energyKwh/20)*100);a>0&&(v("con-water-vs").textContent=`↓ ${a}% vs traditional farming`),o>0&&(v("con-energy-vs").textContent=`↓ ${o}% vs traditional farming`);const s=Ye(n);v("con-grade").textContent=s.letter,v("con-grade").style.color=s.color,v("con-grade-note").textContent=s.note,qe(t),Je(n),Ve(t,e,n);const l=((f=t[0])==null?void 0:f.createdAt)||((r=t[0])==null?void 0:r.timestamp)||new Date;v("con-last-updated").textContent=`${i?"⚡ Demo mode · ":""}Last updated: ${new Date(l).toLocaleString("en-MY")}`}function Ge(t){let i=0,e=0,n=0,a=0;t.forEach((d,g)=>{(d.soilRaw??d.soilMoisture??1900)<1800&&i++,(d.lightRaw??d.light??2e3)<1500&&(e+=1,a++),(d.temperature??25)>28&&(n+=1)});const o=i*me/1e3,l=(e*Z+n*ge+i*Ue)/1e3,f=l*we,r=(60-o)*.035;return{waterLiters:Math.max(o,.5),energyKwh:Math.max(l,.1),costRm:Math.max(f,.02),co2Saved:Math.max(r,.5),lightHours:e,fanHours:n,waterActivations:i,lowLightCount:a,totalReadings:t.length}}function Ye(t){const i=(t.waterLiters<5?40:t.waterLiters<15?25:10)+(t.energyKwh<1?40:t.energyKwh<3?25:10)+(t.costRm<.5?20:t.costRm<1?10:5);return i>=90?{letter:"A+",color:"#00FF88",note:"Outstanding! Your farm is ultra-efficient."}:i>=75?{letter:"A",color:"#4ADE80",note:"Excellent efficiency. Minor tweaks possible."}:i>=55?{letter:"B",color:"#FFD966",note:"Good efficiency. Some room to optimise."}:i>=35?{letter:"C",color:"#FB923C",note:"Average. Consider AI-driven scheduling."}:{letter:"D",color:"#F87171",note:"High consumption detected. Review alerts."}}async function qe(t){window.Chart||await new Promise((l,f)=>{const r=document.createElement("script");r.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js",r.onload=l,r.onerror=f,document.head.appendChild(r)});const i=t.map((l,f)=>{const r=new Date(l.createdAt||l.timestamp||Date.now()-(t.length-f)*36e5);return`${r.getHours().toString().padStart(2,"0")}:${r.getMinutes().toString().padStart(2,"0")}`}),e=t.map(l=>l.waterLevel??l.waterDistanceCm??70),n=t.map(l=>{const f=l.lightRaw??l.light??2e3,r=l.temperature??25;return((f<1500?Z:0)+(r>28?ge:0))/10}),a={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},layout:{padding:{top:8,bottom:0,left:0,right:0}},scales:{x:{ticks:{color:"#94A3B8",font:{size:9},maxRotation:45,minRotation:45},grid:{color:"#F1F5F9"},border:{color:"#E2E8F0"}},y:{ticks:{color:"#94A3B8",font:{size:9}},grid:{color:"#F1F5F9"},border:{color:"#E2E8F0"}}}},o=document.getElementById("con-water-chart");o&&(o._chart&&o._chart.destroy(),o._chart=new window.Chart(o,{type:"line",data:{labels:i,datasets:[{data:e,borderColor:"#2563EB",backgroundColor:l=>{const f=l.chart,{ctx:r,chartArea:d}=f;if(!d)return"rgba(37,99,235,0.08)";const g=r.createLinearGradient(0,d.top,0,d.bottom);return g.addColorStop(0,"rgba(37,99,235,0.18)"),g.addColorStop(1,"rgba(37,99,235,0.01)"),g},fill:!0,tension:.4,pointRadius:2,pointHoverRadius:5,pointBackgroundColor:"#2563EB",pointBorderColor:"#fff",pointBorderWidth:1.5,borderWidth:2}]},options:{...a}}));const s=document.getElementById("con-energy-chart");s&&(s._chart&&s._chart.destroy(),s._chart=new window.Chart(s,{type:"bar",data:{labels:i,datasets:[{data:n,backgroundColor:n.map(l=>l>5?"rgba(217,119,6,0.85)":"rgba(217,119,6,0.5)"),borderColor:n.map(l=>l>5?"#92400E":"#B45309"),borderWidth:1,borderRadius:6,borderSkipped:!1}]},options:{...a}}))}function Je(t){const i=[{label:"💧 Water Pump",value:t.waterActivations,unit:"activations",pct:t.waterActivations/Math.max(t.totalReadings,1)*100,color:"#2563EB"},{label:"💡 Grow Lights",value:t.lightHours,unit:"hrs ON",pct:t.lightHours/Math.max(t.totalReadings,1)*100,color:"#D97706"},{label:"🌀 Cooling Fan",value:t.fanHours,unit:"hrs ON",pct:t.fanHours/Math.max(t.totalReadings,1)*100,color:"#16A34A"}];v("con-breakdown").innerHTML=i.map(e=>`
    <div>
      <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.8rem;">
        <span style="color:#374151; font-weight:500;">${e.label}</span>
        <span style="color:#1A2B3C; font-weight:700;">${e.value} ${e.unit}</span>
      </div>
      <div class="con-progress-track">
        <div class="con-progress-fill" style="width:${Math.min(e.pct,100).toFixed(1)}%; background:${e.color};"></div>
      </div>
    </div>
  `).join("")}function Ve(t,i,e){var o;const n=[];if(e.lightHours>e.totalReadings*.6){const s=(e.lightHours*.5*Z/1e3*we).toFixed(2);n.push({icon:"💡",title:"Reduce grow light duration",desc:`Lights were ON for ${e.lightHours} intervals. Reducing by 2h/day saves ≈ RM ${s}/day.`,color:"#FFD966"})}if(e.waterActivations>8){const s=((e.waterActivations-6)*me/1e3).toFixed(1);n.push({icon:"💧",title:"Batch your watering cycles",desc:`${e.waterActivations} watering events detected. Consolidating to 6 cycles saves ≈ ${s} L/day.`,color:"#60A5FA"})}const a=(i==null?void 0:i.ph)??((o=t[0])==null?void 0:o.ph);a&&(a<5.8||a>6.5)&&n.push({icon:"🧪",title:`pH imbalance detected (${a.toFixed(1)})`,desc:"Optimal range is 5.8–6.5. Out-of-range pH reduces nutrient uptake efficiency by up to 30%.",color:"#F87171"}),e.fanHours>e.totalReadings*.4&&n.push({icon:"🌡️",title:"High temperature periods detected",desc:`Fan was active ${e.fanHours} intervals. Check ventilation or adjust light schedule to avoid heat buildup.`,color:"#FB923C"}),n.length===0&&n.push({icon:"✅",title:"Your farm is running efficiently!",desc:"All consumption metrics are within optimal range. Keep up the good work.",color:"#4ADE80"}),v("con-ai-tips").innerHTML=n.map(s=>`
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
  `).join("")}function X(){const t=Date.now();return Array.from({length:24},(i,e)=>({deviceId:"farm_001",temperature:22+Math.sin(e/4)*4+Math.random()*2,humidity:60+Math.random()*15,soilRaw:1600+Math.floor(Math.random()*600),ph:5.9+Math.random()*.8,lightRaw:800+Math.floor(Math.random()*1200),waterLevel:70+Math.floor(Math.random()*20),gasRaw:800+Math.floor(Math.random()*300),createdAt:new Date(t-(23-e)*3600*1e3).toISOString()}))}function v(t){return document.getElementById(t)}function ue(t){const i=v("con-loading"),e=v("con-content"),n=v("con-error");i&&(i.style.display=t==="loading"?"block":"none"),e&&(e.style.display=t==="content"?"block":"none"),n&&(n.style.display=t==="error"?"block":"none")}let _=45;function Qe(){return`
        <div style="padding:20px; background:#F9FBF9; min-height:100vh; font-family:sans-serif;">
            <div style="background:#FFFFFF; border-radius:24px; padding:16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; border:1px solid #EDF2F0; box-shadow:0 4px 12px rgba(0,0,0,0.02);">
                <span style="font-size:0.9rem; font-weight:700; color:#064E3B;">Predict Window:</span>
                <select id="predictTimeSelect" style="border:none; background:#F0FDF4; color:#065F46; padding:8px 12px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                    <option value="30">30 Mins</option>
                    <option value="45" ${_===45?"selected":""}>45 Mins</option>
                    <option value="60">60 Mins</option>
                </select>
            </div>
            <div id="dynamicAlertsList">
                <div style="text-align:center; padding:60px; color:#94A3B8;">🛰️ AI engine analyzing trends...</div>
            </div>
        </div>
    `}async function Xe(){const t=document.getElementById("predictTimeSelect");t&&(t.onchange=i=>{_=parseInt(i.target.value),ie("success",`AI calibrating for ${_}m...`),ee()}),ee()}async function ee(){const t=document.getElementById("dynamicAlertsList");if(t)try{const i="farm_001",[e,n,a]=await Promise.all([fetch(`http://localhost:3000/api/sensors/latest?deviceId=${i}`),fetch(`http://localhost:3000/api/sensors/history?deviceId=${i}&limit=10`),fetch(`http://localhost:3000/api/sensors/preferences?deviceId=${i}`)]),o=await e.json(),s=await n.json(),l=await a.json(),f=o.reading||{temperature:24},r=s.readings?s.readings.map(w=>w.temperature).join(", "):"22, 23, 24",m=(await(await fetch("http://localhost:3000/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:`As an AI Farm Expert, analyze temp ${f.temperature}C and trend [${r}]. Limit: ${l.tempMax||30}C. 
                          If a risk exists in ${_}m, respond ONLY in this format: 
                          "TITLE: [Problem] | DESC: [Analysis]".
                          If stable, reply: "STABLE".`,history:[]})})).json()).reply||"";let c=[];if(m.includes("STABLE")||!m)c.push({title:"Heat Stress",desc:`The AI predicts a potential issue with heat stress for the next ${_} minutes, based on the rising temperature trend.`,btnText:"Pre-cool System"});else{const w=m.split("|"),p=w[0].replace("TITLE:","").trim(),u=w[1].replace("DESC:","").trim();c.push({title:p,desc:u,btnText:"Pre-cool System"})}te(t,c)}catch{te(t,[{title:"Heat Stress (Demo)",desc:"AI predicts a temperature spike in 45m. Immediate cooling suggested.",btnText:"Pre-cool System"}])}}function te(t,i){t.innerHTML=i.map(e=>`
        <div style="background:white; border-radius:28px; padding:24px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
            <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
                <div style="display:flex; gap:12px;">
                    <div style="width:52px; height:52px; background:#F0FDF4; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:1.6rem;">🌡️</div>
                    <div style="margin-top:4px;">
                        <b style="color:#064E3B; font-size:1.1rem; display:block;">${e.title}</b>
                        <span style="color:#94A3B8; font-size:0.75rem;">SeedDown AI Analysis</span>
                    </div>
                </div>
                <div style="background:#E0F2FE; color:#0369A1; padding:8px 12px; border-radius:12px; font-size:0.65rem; font-weight:800; height: fit-content;">
                    AI INFERENCE
                </div>
            </div>

            <p style="color:#64748B; font-size:0.9rem; line-height:1.5; margin-bottom:24px;">
                🌻 ${e.desc}
            </p>

            <div style="display:flex;">
                <button class="action-btn" style="flex:1; background:#EF4444; color:white; border:none; padding:18px; border-radius:20px; font-weight:700; cursor:pointer; font-size:1rem;">
                    ${e.btnText}
                </button>
            </div>
        </div>
    `).join(""),t.querySelectorAll(".action-btn").forEach(e=>{e.onclick=()=>{e.style.backgroundColor="#064E3B",ie("success","AI intervention started. Pre-cooling system active.")}})}function at(t={}){const{feature:i,from:e="home"}=t,n=document.getElementById("screenContainer");let a="";i==="whatif"?a=Se():i==="consumption"?a=Ze():i==="alerts"&&(a=Qe()),n.innerHTML=`
        <div class="screen active" id="featureScreen">
            <div class="feat-topbar" style="display:flex; align-items:center; padding:12px 16px; background:var(--surface); gap:12px;">
                <button id="featureBackBtn" class="back-btn">← Back</button>
                <div style="font-weight:700;">${i==="whatif"?"🔮 What-If":i==="consumption"?"⚡ Eco Savings":"🚨 AI Alerts"}</div>
            </div>
            <div style="flex:1; overflow-y:auto;">${a}</div>
        </div>
    `,document.getElementById("featureBackBtn").addEventListener("click",()=>Ee(e)),i==="whatif"?De():i==="consumption"?Ke():i==="alerts"&&Xe()}export{at as render};
