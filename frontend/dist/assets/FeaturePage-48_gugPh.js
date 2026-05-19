import{A as b,a as re,s as Ie}from"./index-K6VIRzsI.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const se="farm_001",de=.042,le=1.1,ce=.04,E={water:{low:40,high:70},light:{low:40,high:70},nutrient:{low:40,high:70}},R={dry:2.5,mid:1.5,wet:.8},L={dark:10,mid:8,bright:6},j={low:1.5,mid:1,high:.7},F={temp:28,humid:68,light:82,water:45,nutrient:78},N=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function Be(){var e;try{const i=JSON.parse(localStorage.getItem("user_farms")||"[]"),t=b.currentFarm||i.find(n=>n.id===b.currentFarmId)||(()=>{var n;return i.length>1&&console.warn("[WhatIf] currentFarmId not set — falling back to last farm:",(n=i[i.length-1])==null?void 0:n.id),i[i.length-1]})();return(e=t==null?void 0:t.plants)!=null&&e.length?t.plants:null}catch{return null}}function Se(e){const i={tomato:{kg:.32,units:4,readyIn:60,color:"#D85A30"},carrot:{kg:.24,units:6,readyIn:70,color:"#BA7517"},cabbage:{kg:.41,units:2,readyIn:80,color:"#639922"},eggplant:{kg:.28,units:3,readyIn:75,color:"#534AB7"},basil:{kg:.09,units:10,readyIn:28,color:"#1D9E75"},green_onion:{kg:.11,units:8,readyIn:50,color:"#3B6D11"},lettuce:{kg:.2,units:4,readyIn:35,color:"#639922"},spinach:{kg:.15,units:5,readyIn:40,color:"#2E7D32"},strawberry:{kg:.3,units:3,readyIn:90,color:"#C62828"},pepper:{kg:.25,units:3,readyIn:80,color:"#E65100"},mint:{kg:.08,units:8,readyIn:25,color:"#1B5E20"},chili:{kg:.1,units:6,readyIn:90,color:"#B71C1C"},cucumber:{kg:.35,units:3,readyIn:55,color:"#33691E"},banana:{kg:1.2,units:1,readyIn:270,color:"#F9A825"},mango:{kg:.8,units:1,readyIn:180,color:"#FF8F00"}},t=new Map;for(const n of e){const a=n.species;if(t.has(a)){const o=t.get(a);o.totalSlots+=n.slots||1}else t.set(a,{species:n.species,name:n.name,emoji:n.emoji||"🌱",totalSlots:n.slots||1})}return Array.from(t.values()).map(n=>{const a=i[n.species]||{kg:.2,readyIn:45,color:"#639922"};return{id:n.species,name:n.name,emoji:n.emoji||"🌱",days:a.readyIn,kg:parseFloat((a.kg*n.totalSlots).toFixed(2)),units:n.totalSlots,readyIn:a.readyIn,color:a.color,slots:n.totalSlots}})}async function pe(){var t,n,a,o,r,l,f,s,d,u;const e=b.currentFarmId||se,i={temp:((n=(t=b.sensors)==null?void 0:t.temp)==null?void 0:n.val)??F.temp,humid:((o=(a=b.sensors)==null?void 0:a.humid)==null?void 0:o.val)??F.humid,light:((l=(r=b.sensors)==null?void 0:r.light)==null?void 0:l.val)??F.light,water:((s=(f=b.sensors)==null?void 0:f.water)==null?void 0:s.val)??F.water,nutrient:((u=(d=b.sensors)==null?void 0:d.nutrient)==null?void 0:u.val)??F.nutrient};try{const c=await(await fetch(`${N}/api/sensors/latest?deviceId=${e}`)).json();return{temp:c.temperature??c.temp??i.temp,humid:c.humidity??c.humid??i.humid,light:c.light??c.lux??i.light,water:c.soilMoisture??c.water??i.water,nutrient:c.nutrient??c.ec??i.nutrient}}catch{return i}}async function ge(){const e=b.currentFarmId||se;try{const t=await(await fetch(`${N}/api/sensors/weekly-avg?deviceId=${e}`)).json(),n=t.avg||{};return{temp:n.temperature??F.temp,humid:n.humidity??F.humid,light:n.light??F.light,water:n.soilMoisture??F.water,nutrient:n.nutrient??F.nutrient,days:t.days,source:t.source}}catch{return pe()}}const z=[{id:"tomato",name:"Tomato",emoji:"🍅",days:60,kg:.32,units:4,readyIn:60,color:"#D85A30"},{id:"carrot",name:"Carrot",emoji:"🥕",days:70,kg:.24,units:6,readyIn:70,color:"#BA7517"},{id:"cabbage",name:"Cabbage",emoji:"🥬",days:80,kg:.41,units:2,readyIn:80,color:"#639922"},{id:"eggplant",name:"Eggplant",emoji:"🍆",days:75,kg:.28,units:3,readyIn:75,color:"#534AB7"},{id:"basil",name:"Basil",emoji:"🌿",days:28,kg:.09,units:10,readyIn:28,color:"#1D9E75"},{id:"green_onion",name:"Green Onion",emoji:"🧅",days:50,kg:.11,units:8,readyIn:50,color:"#3B6D11"}],De=[{name:"Bolognese Pasta",emoji:"🍝",ingr:["tomato","carrot","basil"]},{name:"ABC Soup",emoji:"🍲",ingr:["cabbage","carrot","tomato","green_onion"]},{name:"Grilled Eggplant",emoji:"🍽️",ingr:["eggplant","basil"]},{name:"Spring Green Salad",emoji:"🥗",ingr:["green_onion","basil","cabbage"]}],$e={lettuce:{mktPrice:4.8,perRowKgWk:.35,waterSave:3.2,energySave:1.1,fertilizer:.8,note:"Lettuce grows fast — your rows beat supermarket prices by 2× this month."},tomato:{mktPrice:7.2,perRowKgWk:.22,waterSave:2.1,energySave:.9,fertilizer:1.1,note:"Tomatoes fetched RM 7.20/kg at Pasar Borong this week. Yours cost much less."},carrot:{mktPrice:3.5,perRowKgWk:.18,waterSave:1.8,energySave:.7,fertilizer:.6,note:"Carrots are low-maintenance and high-value for home growing."},basil:{mktPrice:12,perRowKgWk:.12,waterSave:.9,energySave:.5,fertilizer:.4,note:"Fresh basil at supermarkets is expensive. Your rows are a gold mine."},eggplant:{mktPrice:5.5,perRowKgWk:.2,waterSave:2.4,energySave:1.3,fertilizer:.9,note:"Eggplant uses more water but market price makes it worthwhile."}},O={spinach:{emoji:"🥬",readyDays:5,readyZone:"Zone B lettuce",space:"1.2m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+0.5°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+3%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"-0.5h",dir:"down"},{name:"Fertilizer",emoji:"🧫",change:"+8%",dir:"up"}],ai:"Spinach thrives alongside lettuce. Humidity increase is within safe range (≤85%)."},mint:{emoji:"🌿",readyDays:3,readyZone:"Zone A chives",space:"0.6m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"No change",dir:"ok"},{name:"Humidity",emoji:"💧",change:"+5%",dir:"up"},{name:"pH value",emoji:"🧪",change:"-0.2",dir:"down"},{name:"Light (h/d)",emoji:"☀️",change:"No change",dir:"ok"},{name:"Fertilizer",emoji:"🧫",change:"+5%",dir:"up"}],ai:"Mint can be aggressive — consider a physical divider from neighbouring herbs."},chili:{emoji:"🌶️",readyDays:12,readyZone:"Zone C eggplant",space:"2.1m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1.5°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"-4%",dir:"down"},{name:"pH value",emoji:"🧪",change:"+0.3",dir:"up"},{name:"Light (h/d)",emoji:"☀️",change:"+2h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+15%",dir:"up"}],ai:"Chili needs more heat and light. You may need to adjust Zone C lighting before planting."},cucumber:{emoji:"🥒",readyDays:8,readyZone:"Zone D tomato",space:"1.8m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+6%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+12%",dir:"up"}],ai:"Cucumbers are water-heavy. Ensure your pump schedule scales with the new plant count."},strawberry:{emoji:"🍓",readyDays:14,readyZone:"Zone E herbs",space:"0.9m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"-1°C",dir:"down"},{name:"Humidity",emoji:"💧",change:"+2%",dir:"up"},{name:"pH value",emoji:"🧪",change:"-0.4",dir:"down"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+10%",dir:"up"}],ai:"Strawberries prefer cooler temps. Place them away from the heat lamp cluster for best results."},tomato:{emoji:"🍅",readyDays:9,readyZone:"Zone D",space:"1.5m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+4%",dir:"up"},{name:"pH value",emoji:"🧪",change:"+0.1",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+10%",dir:"up"}],ai:"Tomatoes do best with deep watering every 2–3 days."},basil:{emoji:"🌿",readyDays:4,readyZone:"Zone E herbs",space:"0.5m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"No change",dir:"ok"},{name:"Humidity",emoji:"💧",change:"+2%",dir:"ok"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+4%",dir:"up"}],ai:"Basil is low-impact. Great companion plant for tomatoes and peppers."}},ze=[{zone:"Zone A",crop:"Chives",fill:90},{zone:"Zone B",crop:"Lettuce",fill:75},{zone:"Zone C",crop:"Eggplant",fill:95},{zone:"Zone D",crop:"Tomato",fill:60},{zone:"Zone E",crop:"Herbs",fill:82}],Z=Object.entries(O).map(([e,i])=>({id:e,name:e.charAt(0).toUpperCase()+e.slice(1),emoji:i.emoji}));let k=new Set,_=4,A=5,T="spinach",D=null;function Te(){return`
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
  `}function Me(){var a;const e=document.getElementById("wif-cost-plant");if(!e)return;const i=window._WIF_DYNAMIC_CROPS||z,t=new Set,n=i.filter(o=>t.has(o.id)?!1:(t.add(o.id),!0));n.length===0?e.innerHTML='<option value="lettuce">Lettuce</option><option value="tomato">Tomato</option>':e.innerHTML=n.map(o=>`<option value="${o.id}">${o.emoji} ${o.name}</option>`).join(""),e.value=((a=n[0])==null?void 0:a.id)||"lettuce",setTimeout(we,0)}function Re(){k=new Set,_=4,A=5,T="spinach",window.wifSwitchTab=Le,window.wifUpdateHarvest=X,window.wifUpdateCost=$,window.wifUpdateNewPlant=I,window.wifToggleCrop=je,window.wifChangeQty=Ke,window.wifChangeRows=Pe,window.wifNpFilterSuggestions=We,window.wifSelectNp=Ue,window.wifSelectSpecies=ue,window.wifNpShowSuggestions=Oe,window.wifNpHideSuggestions=q,window.wifTriggerCostAi=we;const e=Be();e!=null&&e.length?window._WIF_DYNAMIC_CROPS=Se(e):window._WIF_DYNAMIC_CROPS=null,D&&(D.destroy(),D=null);const i=document.getElementById("wif-np-input");i&&(i.value="Spinach"),Me(),X(),ge().then(t=>{window._wif_lastSensors=t,$()}).catch(()=>$()),I()}function Le(e,i){document.querySelectorAll(".wif-section").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".wif-tab-btn").forEach(t=>t.classList.remove("active")),document.getElementById("wif-"+e).classList.add("active"),i.classList.add("active"),e==="cost"&&$(),e==="newplant"&&I()}function X(){const e=window._WIF_DYNAMIC_CROPS||z,i=parseInt(document.getElementById("wif-sl-days").value);document.getElementById("wif-v-days").textContent=i+(i===1?" day":" days");const t=e.filter(o=>o.readyIn<=i),n=t.reduce((o,r)=>o+r.kg,0),a=t.reduce((o,r)=>o+r.units,0);document.getElementById("wif-hm-items").textContent=t.length,document.getElementById("wif-hm-yield").textContent=n.toFixed(2)+" kg",document.getElementById("wif-hm-units").textContent=a,document.getElementById("wif-crop-timelines").innerHTML=e.map(o=>{const r=Math.min(100,Math.round(i/o.readyIn*100)),l=o.readyIn<=i;return`
      <div class="wif-tl-row">
        <span class="wif-tl-name">${o.emoji} ${o.name}</span>
        <div class="wif-tl-track">
          <div class="wif-tl-fill" style="width:${r}%;background:${l?"var(--accent,#639922)":"var(--amber-100,#FAC775)"};"></div>
        </div>
        ${l?`<span class="wif-tl-count">${o.units} units <span class="wif-badge wif-badge-green">Ready</span></span>`:`<span class="wif-tl-end" style="color:var(--text-secondary,#666)">Day ${o.readyIn}</span>`}
      </div>`}).join(""),fe(i),me()}function fe(e){const i=window._WIF_DYNAMIC_CROPS||z,t=document.getElementById("wif-crop-select"),n=i.filter(a=>a.readyIn<=e);if(k.forEach(a=>{n.find(o=>o.id===a)||k.delete(a)}),n.length===0){t.innerHTML='<span style="font-size:12px;color:var(--text-secondary,#999);">No crops ready yet — move the slider forward.</span>';return}t.innerHTML=n.map(a=>`
    <div class="wif-pill ${k.has(a.id)?"selected":""}"
         onclick="wifToggleCrop('${a.id}')">
      ${a.emoji} ${a.name}
    </div>`).join("")}function je(e){k.has(e)?k.delete(e):k.add(e);const i=parseInt(document.getElementById("wif-sl-days").value);fe(i),me()}function me(){const e=document.getElementById("wif-recipe-grid"),i=document.getElementById("wif-ai-recipe-note");if(k.size===0){e.innerHTML="",i.textContent="Select crops above to see recipe suggestions.";return}const t=De.map(n=>{const a=n.ingr.filter(o=>k.has(o)).length;return a===0?null:{...n,match:a,pct:Math.round(a/n.ingr.length*100)}}).filter(Boolean).sort((n,a)=>a.match-n.match);e.innerHTML=t.map(n=>`
    <div class="wif-recipe-card">
      <div class="wif-recipe-hero">${n.emoji}</div>
      <div class="wif-recipe-name">
        ${n.name}
        <span class="wif-badge ${n.pct===100?"wif-badge-green":"wif-badge-amber"}">${n.pct}%</span>
      </div>
      <div>
        ${n.ingr.map(a=>{const r=(window._WIF_DYNAMIC_CROPS||z).find(f=>f.id===a)||z.find(f=>f.id===a);return k.has(a)?`<span class="wif-ingr-tag">${r?r.emoji+" "+r.name:a}</span>`:`<span class="wif-ingr-tag" style="background:#f0f0f0;color:#999;border:0.5px dashed #ccc;">🛒 ${r?r.name:a}</span>`}).join("")}
      </div>
    </div>`).join(""),i.textContent=t.length>0?`${t.length} recipe${t.length>1?"s":""} match your harvest. Loading database...`:"No local matches. Loading database recipes...",_e([...k])}async function _e(e){const i=document.getElementById("wif-recipe-grid"),t=document.getElementById("wif-ai-recipe-note"),n={tomato:["tomato","tomatoes"],carrot:["carrot","carrots"],cabbage:["cabbage"],eggplant:["eggplant","aubergine","brinjal"],basil:["basil"],green_onion:["green onion","green onions","scallion"],lettuce:["lettuce"],spinach:["spinach"],strawberry:["strawberry","strawberries"],pepper:["bell pepper","green pepper","capsicum"]};try{const a=await Promise.all(e.map(s=>fetch(`${N}/api/whatif/recipes?species=${s}`).then(d=>d.ok?d.json():{recipes:[]}).catch(()=>({recipes:[]})))),o=new Set,r=a.flatMap(s=>s.recipes||[]).filter(s=>o.has(s.name)?!1:(o.add(s.name),!0));if(!r.length){t.textContent=t.textContent.replace("Loading database...","(No DB results)").replace("Loading database recipes...","(No DB results)");return}const l=r.map(s=>{const d=e.filter(c=>{const m=n[c]||[c];return s.ingredients.some(g=>m.some(v=>g.toLowerCase().includes(v.toLowerCase())))});if(d.length===0)return null;const u=e.flatMap(c=>n[c]||[c]),p=s.ingredients.filter(c=>{const m=c.toLowerCase();return!(u.some(v=>m.includes(v))||["salt","pepper","water","oil","sugar","flour","butter","egg","milk","sauce","mix","seasoning","powder","vinegar","cream","cheese","margarine"].some(v=>m.includes(v)))}).map(c=>c.replace(/^\d[\d\s\/]*(\(\d+[\s\w\.]+\))?\s*(lb|oz|c|pkg|tsp|tbsp|can|qt|pt|pkg|Tbsp|large|medium|small|fresh|dried|chopped|diced|sliced|cooked|frozen|thawed|drained|shredded|grated|minced|crushed|ground|boneless|skinless)\.?\s*/gi,"").replace(/^[\d\/\s\.]+/,"").trim()).filter(c=>c.length>2&&c.length<40).slice(0,4);return{recipe:s,grownMatches:d,otherIngredients:p}}).filter(Boolean).sort((s,d)=>d.grownMatches.length-s.grownMatches.length);if(!l.length){t.textContent="No database recipes matched your selected crops.";return}const f=l.map(({recipe:s,grownMatches:d,otherIngredients:u})=>{const p=d.map(m=>{const v=(window._WIF_DYNAMIC_CROPS||z).find(y=>y.id===m)||z.find(y=>y.id===m);return`<span class="wif-ingr-tag" style="background:var(--teal-50,#E1F5EE);color:var(--teal-600,#0F6E56);border:0.5px solid var(--teal-200,#7DD3BD);">${v?v.emoji+" "+v.name:m}</span>`}).join(""),c=u.map(m=>`<span class="wif-ingr-tag" style="background:#f0f0f0;color:#888;border:0.5px dashed #ccc;">🛒 ${m}</span>`).join("");return`
        <div class="wif-recipe-card" style="border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
          <div class="wif-recipe-hero">🍽️</div>
          <div class="wif-recipe-name">
            ${s.name.trim()}
            <span class="wif-badge wif-badge-teal">DB</span>
          </div>
          <div>${p}${c}</div>
        </div>`}).join("");i.innerHTML+=f,t.textContent=`${l.length} recipes found — green = your harvest, 🛒 = ingredients to buy.`}catch{t.textContent=t.textContent.replace("Loading database...","(Backend offline — local only)").replace("Loading database recipes...","(Backend offline — local only)")}}function Pe(e){A=Math.max(1,Math.min(20,A+e));const i=document.getElementById("wif-rows-disp");i&&(i.textContent=A),$()}function $(){const e=document.getElementById("wif-cost-plant"),i=e==null?void 0:e.value,t=document.getElementById("wif-sl-weeks");if(!i||!t)return;const n=parseInt(t.value);document.getElementById("wif-v-weeks").textContent=n+(n===1?" wk":" wks");const a=$e[i]||{mktPrice:5,perRowKgWk:.28,fertilizer:.6,note:"Analysing your crop with current sensor data..."},o=A*a.perRowKgWk*n,r=o*a.mktPrice,l=window._wif_lastSensors||F,f=l.water<E.water.low?R.dry:l.water>E.water.high?R.wet:R.mid,s=parseFloat((f*A*n*de).toFixed(2)),d=l.light>E.light.high?L.bright:l.light>E.light.low?L.mid:L.dark,u=parseFloat((d*ce*n*7).toFixed(2)),p=parseFloat((u*le).toFixed(2)),c=l.nutrient<E.nutrient.low?j.low:l.nutrient>E.nutrient.high?j.high:j.mid,m=parseFloat((a.fertilizer*(n/4)*c).toFixed(2)),g=s+p+m,v=r-g;document.getElementById("wif-net-saving").textContent="RM "+v.toFixed(2),document.getElementById("wif-cost-breakdown").innerHTML=`
    <div class="wif-cost-row wif-cost-income">
      <span class="wif-cost-lbl">📦 Harvest value (${o.toFixed(1)} kg × RM ${a.mktPrice}/kg)</span>
      <span style="color:var(--green-600,#3B6D11);font-weight:500;">+RM ${r.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">💧 Water cost <span style="font-size:10px;opacity:.7;">(soil ${l.water}% → ${f}L/plant/wk)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${s.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">⚡ Energy cost <span style="font-size:10px;opacity:.7;">(light ${l.light}% → ${d}h lighting/day)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${p.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">🧪 Fertilizer <span style="font-size:10px;opacity:.7;">(nutrient ${l.nutrient}% → ${c}× base)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${m.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-net">
      <span>⭐ Net savings</span>
      <span style="color:var(--teal-600,#0F6E56);">RM ${v.toFixed(2)}</span>
    </div>`;const y=document.getElementById("wif-cost-ai-note");y&&!window._wif_aiNoteSet&&(y.textContent=a.note),Ne(n,a)}function Ne(e,i){const t=document.getElementById("wif-savings-chart");if(t)if(typeof Chart>"u"){const n=document.createElement("script");n.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",n.onload=()=>ee(t,e,i),document.head.appendChild(n)}else ee(t,e,i)}function ee(e,i,t){D&&(D.destroy(),D=null);const n=window._wif_lastSensors||F,a=n.water<E.water.low?R.dry:n.water>E.water.high?R.wet:R.mid,o=n.light>E.light.high?L.bright:n.light>E.light.low?L.mid:L.dark,r=n.nutrient<E.nutrient.low?j.low:n.nutrient>E.nutrient.high?j.high:j.mid,l=[],f=[];for(let s=1;s<=i;s++){l.push("W"+s);const d=A*t.perRowKgWk*s*t.mktPrice,u=a*A*s*de,p=o*ce*s*7*le,c=t.fertilizer*(s/4)*r;f.push(parseFloat((d-u-p-c).toFixed(2)))}D=new Chart(e,{type:"bar",data:{labels:l,datasets:[{label:"Net savings (RM)",data:f,backgroundColor:"#97C459",borderRadius:4,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:s=>"RM "+s.raw.toFixed(2)}}},scales:{y:{beginAtZero:!0,ticks:{callback:s=>"RM "+s,font:{size:10}},grid:{color:"rgba(128,128,128,0.08)"}},x:{grid:{display:!1},ticks:{font:{size:10}}}}}})}function we(){var t,n,a;const e=(t=document.getElementById("wif-cost-plant"))==null?void 0:t.value,i=parseInt(((n=document.getElementById("wif-sl-weeks"))==null?void 0:n.value)||1);e&&(window._wif_aiNoteSet=!1,(a=document.getElementById("wif-ai-savings-detail"))==null||a.remove(),$(),He(e,A,i))}async function He(e,i,t){var o;const n=document.getElementById("wif-cost-ai-note");n.textContent="🤖 Analyzing your sensor data...";const a=await ge();window._wif_lastSensors=a,$(),(o=document.getElementById("wif-ai-savings-detail"))==null||o.remove();try{let r=100;(a.temp>32||a.temp<20)&&(r-=15),(a.humid>85||a.humid<40)&&(r-=10),a.water<35&&(r-=20),a.light<40&&(r-=15),a.nutrient<45&&(r-=15),r=Math.max(25,Math.min(100,r));let l="Excellent";r<90&&(l="Good"),r<70&&(l="Moderate"),r<50&&(l="Poor"),window._wif_dynamicCondition={score:r,label:l};const f=await fetch(`${N}/api/whatif/costsaving`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plant:e,units:i,weeks:t,sensors:a})});if(!f.ok)throw new Error("Server error");const s=await f.json();window._wif_aiNoteSet=!0,n.textContent=s.insight;const d=document.createElement("div");d.id="wif-ai-savings-detail",d.innerHTML=`
      <div class="wif-card" style="margin-bottom:12px;border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
        <div class="wif-card-title">🤖 AI Resource Analysis</div>
        <div class="wif-metric-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:10px;">
          <div class="wif-metric">
            <div class="wif-metric-val" style="font-size:15px;color:var(--teal-600,#0F6E56);">${window._wif_dynamicCondition.score}%</div>
            <div class="wif-metric-lbl">Condition: ${window._wif_dynamicCondition.label}</div>
          </div>
          <div class="wif-metric">
            <div class="wif-metric-val" style="font-size:15px;color:var(--accent,#639922);">RM ${(s.totalSavedRM??0).toFixed(2)}</div>
            <div class="wif-metric-lbl">AI Est. Saved</div>
          </div>
        </div>
        <div class="wif-cost-row wif-cost-income">
          <span class="wif-cost-lbl">💧 Water saved</span>
          <span style="color:var(--green-600,#3B6D11);">${(s.waterSavedLiters??0).toFixed(1)}L · RM ${(s.waterCostSaved??0).toFixed(2)}</span>
        </div>
        <div class="wif-cost-row wif-cost-income">
          <span class="wif-cost-lbl">⚡ Energy saved</span>
          <span style="color:var(--green-600,#3B6D11);">${(s.energySavedkWh??0).toFixed(2)}kWh · RM ${(s.energyCostSaved??0).toFixed(2)}</span>
        </div>
      </div>`;const u=document.getElementById("wif-cost"),p=u.querySelectorAll(":scope > .wif-card");p.length>=3?p[2].before(d):u.appendChild(d)}catch{n.textContent="AI analysis unavailable — showing calculated estimates only."}}let H=null;function We(){const e=document.getElementById("wif-np-input"),i=document.getElementById("wif-np-suggestions");if(!e||!i)return;const t=e.value.trim().toLowerCase(),n=Z.filter(o=>o.name.toLowerCase().includes(t)),a=n.find(o=>o.name.toLowerCase()===t);a&&(T=a.id,clearTimeout(H),H=setTimeout(I,400)),!a&&t.length>0&&(T=t,clearTimeout(H),H=setTimeout(I,600)),n.length===0?i.innerHTML=`
      <div class="wif-np-sug-item">
        🤖 Analyze "${t}"
      </div>
    `:i.innerHTML=n.map(o=>`
      <div class="wif-np-sug-item"
           onclick="wifSelectNp('${o.id}')">
        <span class="wif-np-sug-emoji">${o.emoji}</span>
        ${o.name}
      </div>
    `).join(""),i.style.display="block"}function Oe(){const e=document.getElementById("wif-np-input").value.toLowerCase(),i=e?Z.filter(t=>t.name.toLowerCase().includes(e)):Z;Ze(i)}function q(){const e=document.getElementById("wif-np-suggestions");e&&(e.style.display="none")}function Ze(e){const i=document.getElementById("wif-np-suggestions");if(i){if(!e.length){i.style.display="none";return}i.style.display="block",i.innerHTML=e.map(t=>`
    <div class="wif-np-sug-item" data-id="${t.id}" data-name="${t.name}">
      <span class="wif-np-sug-emoji">${t.emoji}</span>
      <span>${t.name}</span>
    </div>`).join(""),i.querySelectorAll(".wif-np-sug-item").forEach(t=>{t.addEventListener("click",()=>{ue(t.dataset.id,t.dataset.name)})})}}function Ue(e){T=e.toLowerCase();const i=document.getElementById("wif-np-input");if(i){const t=Z.find(n=>n.id===e);i.value=t?`${t.emoji} ${t.name}`:e}I(),q()}function ue(e,i){T=e;const t=document.getElementById("wif-np-input");t&&(t.value=i),q(),I()}function Ke(e){_=Math.max(1,Math.min(20,_+e));const i=document.getElementById("wif-qty-disp");i&&(i.textContent=_),I()}function Y(){try{const e=JSON.parse(localStorage.getItem("user_farms")||"[]");if(!e.length)return null;const i=e.find(s=>{var d;return s.id===((d=b)==null?void 0:d.currentFarmId)})||e[e.length-1];if(!i)return null;const t=Array.isArray(i.plants)?i.plants:[];if(!t.length)return null;const a=(i.rackLabel||i.rackTypeId||"3-tier").match(/(\d+)/),o=a?parseInt(a[1]):3,r={};if(t.some(s=>s.tier!==void 0))t.forEach(s=>{const d=s.tier||1;r[d]||(r[d]=[]),r[d].push(s)});else{const s=Math.ceil(t.length/o);t.forEach((d,u)=>{const p=Math.floor(u/s)+1;r[p]||(r[p]=[]),r[p].push(d)})}const f=i.slotsPerTier||Math.max(...t.map(s=>s.position||1))||3;return Array.from({length:o},(s,d)=>{const u=d+1,p=r[u]||[],c=Math.round(p.length/f*100),m=[...new Set(p.map(g=>g.name))].join(", ")||"Empty";return{zone:`Tier ${u}`,crop:m,fill:Math.min(c,100)}})}catch(e){return console.warn("wifBuildFarmZones error:",e),null}}function qe(){const e=document.getElementById("wif-zone-list");if(!e)return;const i=Y()||ze;e.innerHTML=i.map(t=>`
    <div class="wif-zone-row">
      <div>
        <div class="wif-zone-name">${t.zone} — ${t.crop}</div>
        <div class="wif-zone-meta">${t.fill}% capacity</div>
      </div>
      <span class="wif-badge ${t.fill>=90?"wif-badge-red":t.fill>=75?"wif-badge-amber":"wif-badge-green"}">
        ${t.fill>=90?"Full":t.fill>=75?"Near full":"Available"}
      </span>
    </div>`).join("")}function I(){var f;const e=document.getElementById("wif-impact-grid"),i=document.getElementById("wif-np-ai-note");if(!e||!i)return;const t=O[T],n=document.getElementById("wif-ready-title"),a=document.getElementById("wif-ready-sub"),o=Y();o&&o.some(s=>s.fill<90);const r=o==null?void 0:o.find(s=>s.fill<90);if((o?o.every(s=>s.fill>=90):!1)?(n&&(n.textContent="No space available"),a&&(a.textContent="All tiers are full. Harvest existing crops first to free up space.")):r?(n&&(n.textContent=`Space available in ${r.zone}`),a&&(a.textContent=`${r.zone} is ${r.fill}% full — has room for new plants.`)):t?(n&&(n.textContent=`You can plant in ${t.readyDays} days`),a&&(a.textContent=`${t.readyZone} harvests on Day ${t.readyDays} — freeing ${t.space} of space.`)):(n&&(n.textContent="Ready for planting"),a&&(a.textContent="Current farm conditions are suitable.")),qe(),(f=t==null?void 0:t.impacts)!=null&&f.length){const s=Math.min(_/4,3);e.innerHTML=t.impacts.filter(d=>d.name!=="Temperature").map(d=>{let u=d.change;if(d.dir!=="ok"){const p=parseFloat(d.change);if(!isNaN(p)){const c=p*s,m=c>0?"+":"",g=d.change.includes("%")?"%":d.change.includes("°")?"°C":d.change.includes("h")?"h":"";u=m+c.toFixed(1).replace(/\.0$/,"")+g}}return`
        <div class="wif-impact-card ${d.dir}">
          <div class="wif-impact-emoji">${d.emoji}</div>
          <div class="wif-impact-name">${d.name}</div>
          <div class="wif-impact-val ${d.dir}">${u}</div>
        </div>`}).join("")}else e.innerHTML=`
      <div class="wif-impact-card ok" style="grid-column:1/-1;text-align:center;padding:18px;">
        <div class="wif-impact-emoji">🌱</div>
        <div class="wif-impact-name">Impact</div>
        <div class="wif-impact-val ok">Calculating...</div>
      </div>`;i.style.display="none",Ye(T,_)}async function Ye(e,i){var l,f,s,d,u,p,c;const t=document.getElementById("wif-np-ai-note"),n=document.getElementById("wif-np-advisor-card"),a=document.getElementById("wif-np-advisor-body");n&&(n.style.display="block",a.innerHTML=`
      <div class="wif-ai-note" style="margin:0;">
        <span>🤖</span><span>Analysing suitability for <strong>${e}</strong>...</span>
      </div>`);const o=await pe(),r=window._WIF_DYNAMIC_CROPS?window._WIF_DYNAMIC_CROPS.map(m=>m.id):["lettuce","tomato","basil"];try{const m=await fetch(`${N}/api/whatif/newplant`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({species:e,quantity:i,currentCrops:r,sensors:o})});if(!m.ok)throw new Error("Server error");const g=await m.json(),v=g.analysis||{};if(g.unsuitable=v.suitable===!1||g.unsuitable===!0,g.insight=v.reason?`${v.reason} ${v.careAdvice||""}`.trim():g.insight||"Analysis complete.",g.warnings=v.warnings||g.warnings||[],g.supported=!g.unsuitable,g.score=v.compatibilityScore??g.score??0,a)if(g.unsuitable)a.innerHTML=`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;">
            <span style="font-size:28px;">⚠️</span>
            <div>
              <div style="font-size:13px;font-weight:500;color:var(--red-400,#E24B4A);margin-bottom:4px;">Not suitable for indoor vertical farming</div>
              <div style="font-size:12px;color:var(--text-secondary,#666);">${g.insight}</div>
            </div>
          </div>`;else{const B=(l=g.warnings)!=null&&l.length?`<div style="margin-top:8px;padding:8px 10px;background:var(--amber-50,#FAEEDA);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--amber-800,#633806);">
               ⚠️ ${g.warnings.join(" · ")}
             </div>`:`<div style="margin-top:8px;padding:8px 10px;background:var(--green-50,#EAF3DE);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--green-800,#27500A);">
               ✅ All projected values within safe range
             </div>`;a.innerHTML=`
          <div style="font-size:12px;color:var(--teal-600,#0F6E56);line-height:1.5;">${g.insight}</div>
          ${B}
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
            <span class="wif-badge wif-badge-green">Suitable Indoor Crop</span>
            <span class="wif-badge wif-badge-blue">AI Score: ${g.score}%</span>
          </div>`}if(t){const B=n&&n.style.display!=="none";t.style.display=B?"none":"flex",t.textContent=g.insight}const y=document.getElementById("wif-ready-title"),h=document.getElementById("wif-ready-sub"),M=Y(),C=M?M.every(B=>B.fill>=90):!1;g.supported?C&&(y&&(y.textContent="No space available"),h&&(h.textContent="All tiers are full. Harvest existing crops first to free up space.")):(y&&(y.textContent="Not recommended right now"),h&&(h.textContent=((f=g.warnings)==null?void 0:f[0])||"Check the AI advisor for details."));const J=document.getElementById("wif-impact-grid");if(J&&!g.unsuitable&&g.impacts){const B={Temperature:(s=g.impacts)==null?void 0:s.tempChange,Humidity:(d=g.impacts)==null?void 0:d.humidChange,"Light (h/d)":(u=g.impacts)==null?void 0:u.lightChange,Fertilizer:(p=g.impacts)==null?void 0:p.nutrientChange},Q=(((c=O[e])==null?void 0:c.impacts)||[]).map(x=>{const S=B[x.name];if(S==null)return x;const Fe=S>0?"+":"",Ce=x.name.includes("Light")?"h":x.name.includes("Temp")?"°C":"%",ke=S===0?"No change":`${Fe}${S}${Ce}`,Ae=S===0?"ok":S>0?"up":"down";return{...x,change:ke,dir:Ae}}).filter(x=>x.name!=="Temperature");Q.length>0&&(J.innerHTML=Q.map(x=>`
          <div class="wif-impact-card ${x.dir||"ok"}">
            <div class="wif-impact-emoji">${x.emoji||"🌱"}</div>
            <div class="wif-impact-name">${x.name||"Unknown"}</div>
            <div class="wif-impact-val ${x.dir||"ok"}">${x.change||"No change"}</div>
          </div>`).join(""))}}catch{a&&(a.innerHTML=`
        <div class="wif-ai-note" style="margin:0;">
          <span>🤖</span><span>AI advisor unavailable — check your connection.</span>
        </div>`);const g=O[e];t&&(t.textContent=g?`${g.ai} (${i} plants)`:"AI prediction unavailable.")}}const ve=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,G=45,ye=20,he=10,xe=250,V=.218;let W=!1,U=[];function Ge(){return`
  <div id="consumptionRoot" style="padding:16px;min-height:100%;background:#F8FAFC;color:#0F172A;font-family:'Inter',system-ui,sans-serif;">

    <div id="con-loading" style="text-align:center;padding:60px 0;">
      <div style="font-size:2.5rem;animation:spin 1s linear infinite;display:inline-block;">⚙️</div>
      <div style="margin-top:12px;color:#64748B;font-size:0.9rem;font-weight:500;">Fetching farm data…</div>
    </div>

    <div id="con-content" style="display:none;">

      <div id="con-hero" style="background:linear-gradient(135deg,#DCFCE7,#F0FDF4);border:1px solid #BBF7D0;border-radius:24px;padding:24px;text-align:center;margin-bottom:16px;position:relative;overflow:hidden;box-shadow:0 4px 16px rgba(22,163,74,0.1);">
        <div style="position:absolute;top:-16px;right:-16px;font-size:5rem;opacity:0.12;">🌱</div>
        <div id="con-grade" style="font-size:3.5rem;font-weight:900;color:#16A34A;line-height:1;">—</div>
        <div style="color:#15803D;font-size:0.85rem;font-weight:700;margin-top:6px;">Eco Efficiency Rating</div>
        <div id="con-grade-note" style="font-size:0.75rem;color:#166534;margin-top:8px;">Calculating…</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div>💧</div>
          <div id="con-water-today" style="font-size:1.5rem;font-weight:800;color:#2563EB;margin:4px 0;">—</div>
          <div style="color:#64748B;font-size:0.75rem;font-weight:500;">Water Used Today</div>
          <div id="con-water-vs" style="color:#16A34A;font-weight:700;font-size:0.7rem;margin-top:4px;"></div>
        </div>
        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div>⚡</div>
          <div id="con-energy-today" style="font-size:1.5rem;font-weight:800;color:#D97706;margin:4px 0;">—</div>
          <div style="color:#64748B;font-size:0.75rem;font-weight:500;">Energy Used Today</div>
          <div id="con-energy-vs" style="color:#16A34A;font-weight:700;font-size:0.7rem;margin-top:4px;"></div>
        </div>
        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div>🌿</div>
          <div id="con-co2" style="font-size:1.5rem;font-weight:800;color:#16A34A;margin:4px 0;">—</div>
          <div style="color:#64748B;font-size:0.75rem;font-weight:500;">CO₂ Offset Today</div>
        </div>
        <div style="background:#FFF;border-radius:16px;padding:16px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div>💰</div>
          <div id="con-cost-saved" style="font-size:1.5rem;font-weight:800;color:#16A34A;margin:4px 0;">—</div>
          <div style="color:#64748B;font-size:0.75rem;font-weight:500;">Saved vs Traditional</div>
          <div id="con-cost-sub" style="color:#64748B;font-size:0.65rem;margin-top:2px;"></div>
        </div>
      </div>

      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div>
            <div style="color:#1E293B;font-weight:700;font-size:0.9rem;">💧 Water Level — Real vs Ideal</div>
            <div style="font-size:0.65rem;color:#94A3B8;margin-top:2px;">Green band = crop-specific ideal zone from your plant data</div>
          </div>
          <div id="water-ideal-badge" style="display:none;font-size:0.62rem;background:#DCFCE7;color:#15803D;padding:4px 8px;border-radius:10px;font-weight:700;border:1px solid #BBF7D0;white-space:nowrap;"></div>
        </div>
        <div style="display:flex;gap:14px;margin-bottom:8px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:5px;font-size:0.65rem;color:#374151;font-weight:600;">
            <div style="width:20px;height:3px;background:#2563EB;border-radius:2px;"></div> Your Farm
          </div>
          <div style="display:flex;align-items:center;gap:5px;font-size:0.65rem;color:#374151;font-weight:600;">
            <div style="width:20px;height:8px;background:rgba(22,163,74,0.2);border-radius:2px;border:1px dashed #16A34A;"></div> Ideal Zone
          </div>
        </div>
        <div style="position:relative;width:100%;height:200px;">
          <canvas id="con-water-chart" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;"></canvas>
        </div>
        <div id="con-water-summary" style="margin-top:10px;padding:10px;background:#F8FAFC;border-radius:10px;font-size:0.74rem;color:#475569;line-height:1.5;border:1px solid #F1F5F9;display:none;"></div>
      </div>

      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div>
            <div style="color:#1E293B;font-weight:700;font-size:0.9rem;">⚡ Energy: Your Farm vs Traditional</div>
            <div style="font-size:0.65rem;color:#94A3B8;margin-top:2px;">Red line = traditional farm daily energy (FAO benchmark)</div>
          </div>
          <div id="energy-trad-badge" style="display:none;font-size:0.62rem;background:#FEE2E2;color:#B91C1C;padding:4px 8px;border-radius:10px;font-weight:700;border:1px solid #FECACA;white-space:nowrap;"></div>
        </div>
        <div style="display:flex;gap:14px;margin-bottom:8px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:5px;font-size:0.65rem;color:#374151;font-weight:600;">
            <div style="width:20px;height:10px;background:rgba(217,119,6,0.7);border-radius:3px;"></div> Your kWh (per hour)
          </div>
          <div style="display:flex;align-items:center;gap:5px;font-size:0.65rem;color:#374151;font-weight:600;">
            <div style="width:20px;height:3px;background:#DC2626;border-radius:2px;border-top:2px dashed #DC2626;"></div> Traditional avg/hr
          </div>
        </div>
        <div style="position:relative;width:100%;height:180px;">
          <canvas id="con-energy-chart" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;"></canvas>
        </div>
        <div id="con-energy-summary" style="margin-top:10px;padding:10px;background:#F8FAFC;border-radius:10px;font-size:0.74rem;color:#475569;line-height:1.5;border:1px solid #F1F5F9;display:none;"></div>
      </div>

      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
          <div style="color:#1E293B;font-weight:800;font-size:1rem;">🌾 Vertical vs Traditional Farming</div>
          <span style="font-size:0.6rem;color:#64748B;background:#F1F5F9;padding:3px 8px;border-radius:8px;font-weight:600;">FAO / USDA Data</span>
        </div>
        <div style="font-size:0.7rem;color:#94A3B8;margin-bottom:14px;">Based on the plants in your rack right now</div>

        <div id="con-plant-cards" style="display:flex;flex-direction:column;gap:10px;margin-bottom:10px;">
          <div style="background:#F8FAFC;border-radius:12px;padding:14px;border:1px solid #E2E8F0;">
            <div style="color:#94A3B8;font-size:0.8rem;text-align:center;">Analysing your plants…</div>
          </div>
        </div>

        <div id="con-view-all-wrap" style="display:none;text-align:center;margin-bottom:14px;">
          <button id="con-view-all-btn" style="
            padding:8px 20px;border:1.5px solid #2563EB;border-radius:20px;
            background:transparent;color:#2563EB;font-weight:700;font-size:0.78rem;
            cursor:pointer;
          ">View All Plants →</button>
        </div>

        <div id="con-trad-bars" style="display:flex;flex-direction:column;gap:14px;margin-bottom:14px;"></div>

        <div id="con-monthly-savings" style="background:linear-gradient(135deg,#F0FDF4,#EFF6FF);border-radius:14px;padding:16px;margin-bottom:14px;border:1px solid #BBF7D0;display:none;"></div>

        <div style="background:#F8FAFC;border-left:4px solid #2563EB;border-radius:0 12px 12px 0;padding:14px;border:1px solid #E2E8F0;border-left:4px solid #2563EB;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span>🤖</span>
            <span style="font-weight:700;color:#1E293B;font-size:0.85rem;">Groq AI Sustainability Insight</span>
            <div id="con-ai-spinner" style="width:13px;height:13px;border:2px solid #BFDBFE;border-top-color:#2563EB;border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0;"></div>
          </div>
          <div id="con-ai-text" style="color:#475569;font-size:0.8rem;line-height:1.65;font-style:italic;">
            Requesting real agricultural analysis from Groq AI…
          </div>
        </div>
      </div>

      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="color:#1E293B;font-weight:700;margin-bottom:12px;">📊 Equipment Usage</div>
        <div id="con-breakdown"></div>
      </div>

      <div style="background:#FFF;border-radius:16px;padding:16px;margin-bottom:12px;border:1px solid #E2E8F0;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="color:#1E293B;font-weight:700;margin-bottom:12px;">💡 Eco Tips</div>
        <div id="con-ai-tips"></div>
      </div>

      <div id="con-last-updated" style="text-align:center;color:#94A3B8;font-size:0.68rem;padding-bottom:16px;font-weight:500;"></div>
    </div>

    <div id="con-error" style="display:none;text-align:center;padding:40px 16px;">
      <div style="font-size:2.5rem;">⚠️</div>
      <div style="color:#DC2626;font-weight:700;margin-top:12px;">Could not connect to backend.</div>
      <div style="color:#64748B;font-size:0.8rem;margin-top:4px;">Showing demo data.</div>
      <button id="con-retry-btn" style="margin-top:20px;padding:10px 24px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:12px;font-weight:600;cursor:pointer;">🔄 Retry</button>
    </div>
  </div>
  <style>
    @keyframes spin { to { transform:rotate(360deg); } }
    .cprog { background:#F1F5F9;border-radius:100px;height:9px;flex:1;overflow:hidden; }
    .cprog-fill { height:100%;border-radius:100px;transition:width 0.7s ease; }
  </style>`}async function Ve(){var e;W=!1,U=[],(e=document.getElementById("con-retry-btn"))==null||e.addEventListener("click",te),await te()}async function te(){var e,i;Ee("loading");try{const t=b.currentFarmId||"farm_001",n=await fetch(`${ve}/api/sensors/history?deviceId=${t}&limit=24`),a=n.ok?await n.json():{},o=((e=a.readings)==null?void 0:e.length)>0?a.readings:ne();await ie(o,!n.ok||!((i=a.readings)!=null&&i.length))}catch{await ie(ne(),!0)}}async function ie(e,i){var a;Ee("content");const t=rt(e);w("con-water-today").textContent=`${t.waterLiters.toFixed(1)} L`,w("con-energy-today").textContent=`${t.energyKwh.toFixed(3)} kWh`,w("con-co2").textContent=`${t.co2Saved.toFixed(2)} kg`,at(t),ot(e,t);const n=((a=e[0])==null?void 0:a.createdAt)||new Date;w("con-last-updated").textContent=`${i?"⚡ Demo mode · ":""}Last updated: ${new Date(n).toLocaleString("en-MY")}`,await tt(),be(e,t,{min:65,max:80},3/24),await Je(t,e)}async function Je(e,i){const t=et();try{const n=await fetch(`${ve}/api/consumption/analysis`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plants:t,metrics:e})});if(!n.ok)throw new Error(`HTTP ${n.status}`);const a=await n.json(),o=a.ruleBasedSummary,r=a.plantData||[],l=a.idealWaterZone||{min:65,max:80,mid:72},f=a.traditionalEnergyPerDay||3;w("con-water-vs").textContent=`↓ ${o.waterSavePct}% vs traditional`,w("con-energy-vs").textContent=r[0]?`↓ ${r[0].energySavePct||0}% vs traditional`:"",w("con-co2").textContent=`${e.co2Saved.toFixed(2)} kg`,w("con-cost-saved").textContent=`RM ${o.dailySavingsRm.toFixed(2)}/day`,w("con-cost-sub").textContent=`RM ${o.monthlySavingsRm}/mo · trad costs RM ${o.todayTradCost.toFixed(2)}/day`;const s={excellent:{l:"A+",c:"#16A34A",n:"Ultra-efficient — top 10% of vertical farms."},good:{l:"A",c:"#2563EB",n:"Great efficiency, performing well above average."},average:{l:"B",c:"#D97706",n:"Good, but room to optimise water scheduling."},above_target:{l:"C",c:"#DC2626",n:"High consumption detected — check pump cycles."}},d=s[o.waterStatus]||s.good;w("con-grade").textContent=d.l,w("con-grade").style.color=d.c,w("con-grade-note").textContent=d.n,w("con-grade-note").style.color=d.c,be(i,e,l,f/24),U=r,K(r,!1),it(r,e,o),nt(o),w("con-ai-spinner").style.display="none",w("con-ai-text").textContent=a.aiNarrative||"—",w("con-ai-text").style.fontStyle="normal",w("con-ai-source").style.display="block"}catch(n){console.warn("[ConsumptionPage] AI fetch failed:",n.message),w("con-ai-spinner").style.display="none",w("con-ai-text").textContent="AI analysis unavailable — showing estimated data.",w("con-ai-text").style.fontStyle="italic";const a=320,o=Math.max(0,a-e.waterLiters),r=(o*.002+(3-e.energyKwh)*V).toFixed(2);w("con-cost-saved").textContent=`RM ${r}/day`,w("con-cost-sub").textContent="Estimated vs traditional",w("con-water-vs").textContent=`↓ ${Math.round(o/a*100)}% est. vs traditional`;const l=t.map(Xe);U=l,K(l,!1)}}function K(e,i){const t=i?e:e.slice(0,3),n=e.length>3;w("con-plant-cards").innerHTML=t.length>0?t.map(r=>Qe(r)).join(""):`<div style="background:#F8FAFC;border-radius:12px;padding:14px;border:1px solid #E2E8F0;color:#94A3B8;font-size:0.8rem;text-align:center;">
        No plants found in this farm. Add plants in the Farm Builder to see comparisons.
       </div>`;const a=w("con-view-all-wrap"),o=w("con-view-all-btn");n?(a.style.display="block",o.textContent=i?"↑ Show Less":`View All ${e.length} Plants →`,o.onclick=()=>{W=!W,K(U,W),o.scrollIntoView({behavior:"smooth",block:"nearest"})}):a.style.display="none"}function Qe(e){var p,c,m,g,v,y,h;const i=((p=e.vertical)==null?void 0:p.waterPerDayL)!=null?Number(e.vertical.waterPerDayL).toFixed(2):"—",t=((c=e.vertical)==null?void 0:c.energyKwhPerDay)!=null?(Number(e.vertical.energyKwhPerDay)*1e3).toFixed(0):"—",n=((m=e.vertical)==null?void 0:m.growthDays)!=null?e.vertical.growthDays:"—",a=((g=e.traditional)==null?void 0:g.waterPerDayL)!=null?Number(e.traditional.waterPerDayL).toFixed(2):"—",o=((v=e.traditional)==null?void 0:v.energyKwhPerDay)!=null?(Number(e.traditional.energyKwhPerDay)*1e3).toFixed(0):"—",r=((y=e.traditional)==null?void 0:y.growthDays)!=null?e.traditional.growthDays:"—",l=((h=e.traditional)==null?void 0:h.source)??"FAO AQUASTAT",f=e.waterSavePct!=null?e.waterSavePct:"—",s=e.waterSavedLPerDay!=null?e.waterSavedLPerDay:"—",d=e.growDaysFaster!=null?e.growDaysFaster:r!=="—"&&n!=="—"?r-n:"—",u=e.landReductionPct!=null?e.landReductionPct:93;return`
    <div style="background:#F8FAFC;border-radius:14px;padding:14px;border:1px solid #E2E8F0;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="font-size:1.6rem;">${e.emoji??"🌱"}</span>
        <div style="flex:1;">
          <div style="font-weight:800;font-size:0.9rem;color:#0F172A;">${e.name}</div>
          <div style="font-size:0.6rem;color:#94A3B8;margin-top:1px;">${l}${e.hasCropData===!1?" · estimated":""}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.1rem;font-weight:900;color:#16A34A;">↓${f}%</div>
          <div style="font-size:0.6rem;color:#64748B;">water saved</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
        <div style="background:#EFF6FF;border-radius:10px;padding:10px;border:1px solid #BFDBFE;">
          <div style="font-size:0.6rem;font-weight:800;color:#1D4ED8;letter-spacing:0.06em;margin-bottom:6px;">🏭 VERTICAL FARM</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${i}L/day</div>
          <div style="font-size:0.6rem;color:#64748B;margin-bottom:4px;">Water (hydroponic)</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${t}Wh/day</div>
          <div style="font-size:0.6rem;color:#64748B;margin-bottom:4px;">Energy (LED grow)</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${n} days</div>
          <div style="font-size:0.6rem;color:#64748B;">Grow cycle</div>
        </div>
        <div style="background:#FEF2F2;border-radius:10px;padding:10px;border:1px solid #FECACA;">
          <div style="font-size:0.6rem;font-weight:800;color:#B91C1C;letter-spacing:0.06em;margin-bottom:6px;">🌾 TRADITIONAL</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${a}L/day</div>
          <div style="font-size:0.6rem;color:#64748B;margin-bottom:4px;">Water (soil/field)</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${o}Wh/day</div>
          <div style="font-size:0.6rem;color:#64748B;margin-bottom:4px;">Energy (irrigation)</div>
          <div style="font-size:0.8rem;font-weight:700;color:#1E293B;">${r} days</div>
          <div style="font-size:0.6rem;color:#64748B;">Grow cycle</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <span style="background:#DCFCE7;color:#15803D;font-size:0.65rem;font-weight:700;padding:4px 10px;border-radius:20px;">💧 ${s}L/day saved</span>
        <span style="background:#FEF3C7;color:#92400E;font-size:0.65rem;font-weight:700;padding:4px 10px;border-radius:20px;">⏱ ${d} days faster</span>
        <span style="background:#DBEAFE;color:#1E40AF;font-size:0.65rem;font-weight:700;padding:4px 10px;border-radius:20px;">🌍 ${u}% less land</span>
      </div>
    </div>`}function Xe(e){var o;const i={tomato:"🍅",lettuce:"🥬",basil:"🌿",spinach:"🍃",mint:"🌱",chili:"🌶️"},t=String(e).toLowerCase(),n=i[t]||((o=Object.entries(i).find(([r])=>t.includes(r)))==null?void 0:o[1])||"🌱";return{name:t.charAt(0).toUpperCase()+t.slice(1),emoji:n,species:t,hasCropData:!1,vertical:{waterPerDayL:.15,energyKwhPerDay:.36,growthDays:45},traditional:{waterPerDayL:1,energyKwhPerDay:.792,growthDays:60,source:"Estimate"},waterSavedLPerDay:.85,waterSavePct:85,energySavePct:54,growDaysFaster:15,landReductionPct:93}}function et(){const e=new Set,i=b.currentFarm;return Array.isArray(i==null?void 0:i.plants)&&i.plants.forEach(t=>{const n=(t==null?void 0:t.name)||(t==null?void 0:t.species);n&&e.add(String(n).toLowerCase().trim())}),i!=null&&i.targetPlant&&String(i.targetPlant).split(/[,;\n]+/).map(t=>t.trim().toLowerCase()).filter(Boolean).forEach(t=>e.add(t)),e.size>0?[...e]:["lettuce"]}async function tt(){window.Chart||await new Promise((e,i)=>{const t=document.createElement("script");t.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js",t.onload=e,t.onerror=i,document.head.appendChild(t)})}function be(e,i,t,n){const a=e.map((p,c)=>{const m=new Date(p.createdAt||p.timestamp||Date.now()-(e.length-c)*36e5);return`${String(m.getHours()).padStart(2,"0")}:${String(m.getMinutes()).padStart(2,"0")}`}).reverse(),o=e.map(p=>p.waterLevel??70).reverse(),r=e.map(p=>{const c=p.lightRaw??p.light??2e3,m=p.temperature??25;return((c<1500?G:0)+(m>28?ye:0)+he*.1)/1e3}).reverse(),{min:l,max:f}=t,s=a.length,d=document.getElementById("con-water-chart");if(d){d._chart&&d._chart.destroy();const p=o.filter(C=>C<l).length,c=o.filter(C=>C>f).length,m=s-p-c,g=Math.round(m/s*100),v=w("water-ideal-badge");v.style.display="block",v.textContent=`Ideal: ${l}–${f}% · ${g}% in range`;const y=o.map(C=>C<l?"#DC2626":C>f?"#F59E0B":"#2563EB");d._chart=new window.Chart(d,{type:"line",data:{labels:a,datasets:[{label:"Ideal Max",data:Array(s).fill(f),borderColor:"rgba(22,163,74,0.35)",borderDash:[5,4],borderWidth:1,pointRadius:0,fill:"+1",backgroundColor:"rgba(22,163,74,0.13)",order:3},{label:"Ideal Min",data:Array(s).fill(l),borderColor:"rgba(22,163,74,0.35)",borderDash:[5,4],borderWidth:1,pointRadius:0,fill:!1,order:3},{label:"Your Farm",data:o,borderColor:"#2563EB",borderWidth:2.5,tension:.35,pointRadius:o.map(C=>C<l||C>f?5:2),pointBackgroundColor:y,pointBorderColor:"#fff",pointBorderWidth:1.5,fill:!1,order:1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{ticks:{color:"#94A3B8",font:{size:9}},grid:{color:"#F1F5F9"}},y:{min:0,max:100,ticks:{color:"#94A3B8",font:{size:9}},grid:{color:"#F1F5F9"}}}}});const h=w("con-water-summary");h.style.display="block";const M=g>=70?"#16A34A":g>=50?"#D97706":"#DC2626";h.innerHTML=`<span style="font-weight:700;color:${M};">${g}% of readings within ideal zone (${l}–${f}%)</span>
      &nbsp;·&nbsp;${p} below · ${c} above
      ${p>3?'<br><strong style="color:#DC2626;">⚠ Check water reservoir</strong>':""}`}const u=document.getElementById("con-energy-chart");if(u){u._chart&&u._chart.destroy();const p=n||3/24,c=w("energy-trad-badge");c.style.display="block",c.textContent=`Traditional limit: ${(p*1e3).toFixed(0)} Wh/hr`,u._chart=new window.Chart(u,{data:{labels:a,datasets:[{type:"line",label:"Traditional Baseline",data:Array(s).fill(p),borderColor:"#DC2626",borderWidth:2.5,borderDash:[6,4],pointRadius:0,fill:!1,order:1},{type:"bar",label:"Your Farm (kWh)",data:r,backgroundColor:r.map(h=>h>p?"rgba(220,38,38,0.75)":"rgba(217,119,6,0.75)"),borderColor:r.map(h=>h>p?"#991B1B":"#B45309"),borderWidth:1,borderRadius:4,order:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{ticks:{color:"#94A3B8",font:{size:9}},grid:{color:"#F1F5F9"}},y:{ticks:{color:"#94A3B8",font:{size:9}},grid:{color:"#F1F5F9"}}}}});const m=w("con-energy-summary");m.style.display="block";const g=r.reduce((h,M)=>h+M,0),v=p*s,y=Math.round((1-g/v)*100);m.innerHTML=`<span style="font-weight:700;color:#16A34A;">${Math.max(0,y)}% less energy than traditional farm today</span>`}}function it(e,i,t){var o,r;const n=e[0];if(!n)return;const a=[{label:"💧 Water/Day",yours:i.waterLiters,trad:((o=n.traditional)==null?void 0:o.waterPerDayL)||.98,unit:"L",color:"#2563EB",saved:t.waterSavedL},{label:"⚡ Energy/Day",yours:i.energyKwh,trad:((r=n.traditional)==null?void 0:r.energyKwhPerDay)||.79,unit:"kWh",color:"#D97706",saved:0},{label:"💰 Cost/Day",yours:t.todayVertCost,trad:t.todayTradCost,unit:"RM",color:"#16A34A",saved:t.dailySavingsRm}];w("con-trad-bars").innerHTML=a.map(l=>{const f=Math.min(100,l.yours/l.trad*100),s=Math.max(0,Math.round(100-f));return`
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:0.82rem;font-weight:700;color:#374151;">${l.label}</span>
          <span style="font-size:0.75rem;color:#16A34A;font-weight:800;">↓ ${s}% saved</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
          <span style="font-size:0.62rem;color:#64748B;width:68px;flex-shrink:0;">🏭 Your Farm</span>
          <div class="cprog"><div class="cprog-fill" style="width:${f.toFixed(1)}%;background:${l.color};"></div></div>
          <span style="font-size:0.7rem;font-weight:800;color:${l.color};width:48px;text-align:right;">${Number(l.yours).toFixed(2)}${l.unit}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <span style="font-size:0.62rem;color:#64748B;width:68px;flex-shrink:0;">🌾 Traditional</span>
          <div class="cprog"><div class="cprog-fill" style="width:100%;background:#CBD5E1;"></div></div>
          <span style="font-size:0.7rem;font-weight:800;color:#94A3B8;width:48px;text-align:right;">${Number(l.trad).toFixed(2)}${l.unit}</span>
        </div>
      </div>`}).join("")}function nt(e){const i=w("con-monthly-savings");!i||e.dailySavingsRm<=0||(i.style.display="block",i.innerHTML=`
    <div style="font-size:0.68rem;font-weight:800;color:#15803D;letter-spacing:0.07em;margin-bottom:12px;">📈 PROJECTION VS TRADITIONAL FARMING</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
      <div><div style="font-size:1.3rem;font-weight:900;color:#2563EB;">${e.monthlySavingsL}L</div><div style="font-size:0.62rem;color:#64748B;margin-top:2px;">water/mo</div></div>
      <div><div style="font-size:1.3rem;font-weight:900;color:#16A34A;">RM${e.monthlySavingsRm}</div><div style="font-size:0.62rem;color:#64748B;margin-top:2px;">saved/mo</div></div>
      <div><div style="font-size:1.3rem;font-weight:900;color:#0D9488;">RM${e.yearlySavingsRm}</div><div style="font-size:0.62rem;color:#64748B;margin-top:2px;">saved/yr</div></div>
    </div>`)}function at(e){const i=[{label:"💧 Water Pump",value:e.waterActivations,unit:"activations",pct:e.waterActivations/Math.max(e.totalReadings,1)*100,color:"#2563EB"},{label:"💡 Grow Lights",value:e.lightHours,unit:"hrs ON",pct:e.lightHours/Math.max(e.totalReadings,1)*100,color:"#F59E0B"},{label:"🌀 Cooling Fan",value:e.fanHours,unit:"hrs ON",pct:e.fanHours/Math.max(e.totalReadings,1)*100,color:"#16A34A"}];w("con-breakdown").innerHTML=i.map(t=>`
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.8rem;">
        <span style="color:#475569;font-weight:600;">${t.label}</span>
        <span style="color:#1E293B;font-weight:800;">${t.value} ${t.unit}</span>
      </div>
      <div class="cprog"><div class="cprog-fill" style="width:${Math.min(t.pct,100).toFixed(1)}%;background:${t.color};"></div></div>
    </div>`).join("")}function ot(e,i){const t=[];if(i.lightHours>i.totalReadings*.6){const n=(i.lightHours*.5*G/1e3*V).toFixed(2);t.push({icon:"💡",title:"Reduce grow light duration",desc:`Lights ON for ${i.lightHours} intervals. Cutting 2h/day saves ≈ RM ${n}/day.`,c:"#D97706",bg:"#FEF3C7"})}if(i.waterActivations>8){const n=((i.waterActivations-6)*xe/1e3).toFixed(1);t.push({icon:"💧",title:"Batch watering cycles",desc:`${i.waterActivations} pump activations. Consolidating to 6 saves ≈ ${n}L.`,c:"#2563EB",bg:"#DBEAFE"})}t.length===0&&t.push({icon:"✅",title:"Farm running efficiently!",desc:"All metrics within optimal range.",c:"#16A34A",bg:"#DCFCE7"}),w("con-ai-tips").innerHTML=t.map(n=>`
    <div style="background:#F8FAFC;border-left:4px solid ${n.c};border-radius:8px;padding:12px;border:1px solid #E2E8F0;">
      <div style="font-weight:700;color:#1E293B;font-size:0.85rem;display:flex;align-items:center;gap:6px;">
        <span style="background:${n.bg};padding:4px;border-radius:6px;">${n.icon}</span>${n.title}
      </div>
      <div style="color:#475569;font-size:0.78rem;margin-top:6px;line-height:1.5;">${n.desc}</div>
    </div>`).join("")}function rt(e){let i=0,t=0,n=0;e.forEach(r=>{(r.soilRaw??r.soilMoisture??1900)<1800&&i++,(r.lightRaw??r.light??2e3)<1500&&t++,(r.temperature??25)>28&&n++});const a=i*xe/1e3,o=(t*G+n*ye+i*he)/1e3;return{waterLiters:Math.max(a,.05),energyKwh:Math.max(o,.01),costRm:Math.max(o*V,.002),co2Saved:Math.max((60-a)*.035,.5),waterActivations:i,lightHours:t,fanHours:n,totalReadings:e.length}}function ne(){const e=Date.now();return Array.from({length:24},(i,t)=>({deviceId:"farm_001",temperature:22+Math.sin(t/4)*4+Math.random()*2,soilRaw:1550+Math.floor(Math.random()*650),lightRaw:700+Math.floor(Math.random()*1300),waterLevel:63+Math.floor(Math.random()*25),ph:5.85+Math.random()*.9,createdAt:new Date(e-(23-t)*36e5).toISOString()}))}function w(e){return document.getElementById(e)}function Ee(e){["loading","content","error"].forEach(i=>{const t=w(`con-${i}`);t&&(t.style.display=i===e?"block":"none")})}let P=45;function st(){return`
        <div style="padding:20px; background:#F9FBF9; min-height:100vh; font-family:sans-serif;">
            <div style="background:#FFFFFF; border-radius:24px; padding:16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; border:1px solid #EDF2F0; box-shadow:0 4px 12px rgba(0,0,0,0.02);">
                <span style="font-size:0.9rem; font-weight:700; color:#064E3B;">Predict Window:</span>
                <select id="predictTimeSelect" style="border:none; background:#F0FDF4; color:#065F46; padding:8px 12px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                    <option value="30">30 Mins</option>
                    <option value="45" ${P===45?"selected":""}>45 Mins</option>
                    <option value="60">60 Mins</option>
                </select>
            </div>
            <div id="dynamicAlertsList">
                <div style="text-align:center; padding:60px; color:#94A3B8;">🛰️ AI engine analyzing trends...</div>
            </div>
        </div>
    `}async function dt(){const e=document.getElementById("predictTimeSelect");e&&(e.onchange=i=>{P=parseInt(i.target.value),re("success",`AI calibrating for ${P}m...`),ae()}),ae()}async function ae(){const e=document.getElementById("dynamicAlertsList");if(e)try{const i="farm_001",[t,n,a]=await Promise.all([fetch(`http://localhost:3000/api/sensors/latest?deviceId=${i}`),fetch(`http://localhost:3000/api/sensors/history?deviceId=${i}&limit=10`),fetch(`http://localhost:3000/api/sensors/preferences?deviceId=${i}`)]),o=await t.json(),r=await n.json(),l=await a.json(),f=o.reading||{temperature:24},s=r.readings?r.readings.map(m=>m.temperature).join(", "):"22, 23, 24",p=(await(await fetch("http://localhost:3000/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:`As an AI Farm Expert, analyze temp ${f.temperature}C and trend [${s}]. Limit: ${l.tempMax||30}C. 
                          If a risk exists in ${P}m, respond ONLY in this format: 
                          "TITLE: [Problem] | DESC: [Analysis]".
                          If stable, reply: "STABLE".`,history:[]})})).json()).reply||"";let c=[];if(p.includes("STABLE")||!p)c.push({title:"Heat Stress",desc:`The AI predicts a potential issue with heat stress for the next ${P} minutes, based on the rising temperature trend.`,btnText:"Pre-cool System"});else{const m=p.split("|"),g=m[0].replace("TITLE:","").trim(),v=m[1].replace("DESC:","").trim();c.push({title:g,desc:v,btnText:"Pre-cool System"})}oe(e,c)}catch{oe(e,[{title:"Heat Stress (Demo)",desc:"AI predicts a temperature spike in 45m. Immediate cooling suggested.",btnText:"Pre-cool System"}])}}function oe(e,i){e.innerHTML=i.map(t=>`
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
    `).join(""),e.querySelectorAll(".action-btn").forEach(t=>{t.onclick=()=>{t.style.backgroundColor="#064E3B",re("success","AI intervention started. Pre-cooling system active.")}})}function mt(e={}){const{feature:i,from:t="home"}=e,n=document.getElementById("screenContainer");let a="";i==="whatif"?a=Te():i==="consumption"?a=Ge():i==="alerts"&&(a=st()),n.innerHTML=`
        <div class="screen active" id="featureScreen">
            <div class="feat-topbar" style="display:flex; align-items:center; padding:12px 16px; background:var(--surface); gap:12px;">
                <button id="featureBackBtn" class="back-btn" aria-label="Back">←</button>
                <div style="font-weight:700;">${i==="whatif"?"🔮 What-If":i==="consumption"?"⚡ Eco Savings":"🚨 AI Alerts"}</div>
            </div>
            <div style="flex:1; overflow-y:auto;">${a}</div>
        </div>
    `,document.getElementById("featureBackBtn").addEventListener("click",()=>Ie(t)),i==="whatif"?Re():i==="consumption"?Ve():i==="alerts"&&dt()}export{mt as render};
