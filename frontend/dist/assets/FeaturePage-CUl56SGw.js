import{A as y,a as oe,s as Fe}from"./index-B0Gd1vZv.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const ae="farm_001",re=.042,se=1.1,de=.04,x={water:{low:40,high:70},light:{low:40,high:70},nutrient:{low:40,high:70}},D={dry:2.5,mid:1.5,wet:.8},R={dark:10,mid:8,bright:6},M={low:1.5,mid:1,high:.7},b={temp:28,humid:68,light:82,water:45,nutrient:78},L=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function Ce(){var e;try{const n=JSON.parse(localStorage.getItem("user_farms")||"[]"),t=y.currentFarm||n.find(i=>i.id===y.currentFarmId)||(()=>{var i;return n.length>1&&console.warn("[WhatIf] currentFarmId not set — falling back to last farm:",(i=n[n.length-1])==null?void 0:i.id),n[n.length-1]})();return(e=t==null?void 0:t.plants)!=null&&e.length?t.plants:null}catch{return null}}function ke(e){const n={tomato:{kg:.32,units:4,readyIn:60,color:"#D85A30"},carrot:{kg:.24,units:6,readyIn:70,color:"#BA7517"},cabbage:{kg:.41,units:2,readyIn:80,color:"#639922"},eggplant:{kg:.28,units:3,readyIn:75,color:"#534AB7"},basil:{kg:.09,units:10,readyIn:28,color:"#1D9E75"},green_onion:{kg:.11,units:8,readyIn:50,color:"#3B6D11"},lettuce:{kg:.2,units:4,readyIn:35,color:"#639922"},spinach:{kg:.15,units:5,readyIn:40,color:"#2E7D32"},strawberry:{kg:.3,units:3,readyIn:90,color:"#C62828"},pepper:{kg:.25,units:3,readyIn:80,color:"#E65100"},mint:{kg:.08,units:8,readyIn:25,color:"#1B5E20"},chili:{kg:.1,units:6,readyIn:90,color:"#B71C1C"},cucumber:{kg:.35,units:3,readyIn:55,color:"#33691E"},banana:{kg:1.2,units:1,readyIn:270,color:"#F9A825"},mango:{kg:.8,units:1,readyIn:180,color:"#FF8F00"}},t=new Map;for(const i of e){const o=i.species;if(t.has(o)){const a=t.get(o);a.totalSlots+=i.slots||1}else t.set(o,{species:i.species,name:i.name,emoji:i.emoji||"🌱",totalSlots:i.slots||1})}return Array.from(t.values()).map(i=>{const o=n[i.species]||{kg:.2,readyIn:45,color:"#639922"};return{id:i.species,name:i.name,emoji:i.emoji||"🌱",days:o.readyIn,kg:parseFloat((o.kg*i.totalSlots).toFixed(2)),units:i.totalSlots,readyIn:o.readyIn,color:o.color,slots:i.totalSlots}})}async function le(){var t,i,o,a,s,d,g,r,l,u;const e=y.currentFarmId||ae,n={temp:((i=(t=y.sensors)==null?void 0:t.temp)==null?void 0:i.val)??b.temp,humid:((a=(o=y.sensors)==null?void 0:o.humid)==null?void 0:a.val)??b.humid,light:((d=(s=y.sensors)==null?void 0:s.light)==null?void 0:d.val)??b.light,water:((r=(g=y.sensors)==null?void 0:g.water)==null?void 0:r.val)??b.water,nutrient:((u=(l=y.sensors)==null?void 0:l.nutrient)==null?void 0:u.val)??b.nutrient};try{const c=await(await fetch(`${L}/api/sensors/latest?deviceId=${e}`)).json();return{temp:c.temperature??c.temp??n.temp,humid:c.humidity??c.humid??n.humid,light:c.light??c.lux??n.light,water:c.soilMoisture??c.water??n.water,nutrient:c.nutrient??c.ec??n.nutrient}}catch{return n}}async function ce(){const e=y.currentFarmId||ae;try{const t=await(await fetch(`${L}/api/sensors/weekly-avg?deviceId=${e}`)).json(),i=t.avg||{};return{temp:i.temperature??b.temp,humid:i.humidity??b.humid,light:i.light??b.light,water:i.soilMoisture??b.water,nutrient:i.nutrient??b.nutrient,days:t.days,source:t.source}}catch{return le()}}const $=[{id:"tomato",name:"Tomato",emoji:"🍅",days:60,kg:.32,units:4,readyIn:60,color:"#D85A30"},{id:"carrot",name:"Carrot",emoji:"🥕",days:70,kg:.24,units:6,readyIn:70,color:"#BA7517"},{id:"cabbage",name:"Cabbage",emoji:"🥬",days:80,kg:.41,units:2,readyIn:80,color:"#639922"},{id:"eggplant",name:"Eggplant",emoji:"🍆",days:75,kg:.28,units:3,readyIn:75,color:"#534AB7"},{id:"basil",name:"Basil",emoji:"🌿",days:28,kg:.09,units:10,readyIn:28,color:"#1D9E75"},{id:"green_onion",name:"Green Onion",emoji:"🧅",days:50,kg:.11,units:8,readyIn:50,color:"#3B6D11"}],Ie=[{name:"Bolognese Pasta",emoji:"🍝",ingr:["tomato","carrot","basil"]},{name:"ABC Soup",emoji:"🍲",ingr:["cabbage","carrot","tomato","green_onion"]},{name:"Grilled Eggplant",emoji:"🍽️",ingr:["eggplant","basil"]},{name:"Spring Green Salad",emoji:"🥗",ingr:["green_onion","basil","cabbage"]}],Ae={lettuce:{mktPrice:4.8,perRowKgWk:.35,waterSave:3.2,energySave:1.1,fertilizer:.8,note:"Lettuce grows fast — your rows beat supermarket prices by 2× this month."},tomato:{mktPrice:7.2,perRowKgWk:.22,waterSave:2.1,energySave:.9,fertilizer:1.1,note:"Tomatoes fetched RM 7.20/kg at Pasar Borong this week. Yours cost much less."},carrot:{mktPrice:3.5,perRowKgWk:.18,waterSave:1.8,energySave:.7,fertilizer:.6,note:"Carrots are low-maintenance and high-value for home growing."},basil:{mktPrice:12,perRowKgWk:.12,waterSave:.9,energySave:.5,fertilizer:.4,note:"Fresh basil at supermarkets is expensive. Your rows are a gold mine."},eggplant:{mktPrice:5.5,perRowKgWk:.2,waterSave:2.4,energySave:1.3,fertilizer:.9,note:"Eggplant uses more water but market price makes it worthwhile."}},P={spinach:{emoji:"🥬",readyDays:5,readyZone:"Zone B lettuce",space:"1.2m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+0.5°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+3%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"-0.5h",dir:"down"},{name:"Fertilizer",emoji:"🧫",change:"+8%",dir:"up"}],ai:"Spinach thrives alongside lettuce. Humidity increase is within safe range (≤85%)."},mint:{emoji:"🌿",readyDays:3,readyZone:"Zone A chives",space:"0.6m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"No change",dir:"ok"},{name:"Humidity",emoji:"💧",change:"+5%",dir:"up"},{name:"pH value",emoji:"🧪",change:"-0.2",dir:"down"},{name:"Light (h/d)",emoji:"☀️",change:"No change",dir:"ok"},{name:"Fertilizer",emoji:"🧫",change:"+5%",dir:"up"}],ai:"Mint can be aggressive — consider a physical divider from neighbouring herbs."},chili:{emoji:"🌶️",readyDays:12,readyZone:"Zone C eggplant",space:"2.1m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1.5°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"-4%",dir:"down"},{name:"pH value",emoji:"🧪",change:"+0.3",dir:"up"},{name:"Light (h/d)",emoji:"☀️",change:"+2h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+15%",dir:"up"}],ai:"Chili needs more heat and light. You may need to adjust Zone C lighting before planting."},cucumber:{emoji:"🥒",readyDays:8,readyZone:"Zone D tomato",space:"1.8m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+6%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+12%",dir:"up"}],ai:"Cucumbers are water-heavy. Ensure your pump schedule scales with the new plant count."},strawberry:{emoji:"🍓",readyDays:14,readyZone:"Zone E herbs",space:"0.9m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"-1°C",dir:"down"},{name:"Humidity",emoji:"💧",change:"+2%",dir:"up"},{name:"pH value",emoji:"🧪",change:"-0.4",dir:"down"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+10%",dir:"up"}],ai:"Strawberries prefer cooler temps. Place them away from the heat lamp cluster for best results."},tomato:{emoji:"🍅",readyDays:9,readyZone:"Zone D",space:"1.5m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+4%",dir:"up"},{name:"pH value",emoji:"🧪",change:"+0.1",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+10%",dir:"up"}],ai:"Tomatoes do best with deep watering every 2–3 days."},basil:{emoji:"🌿",readyDays:4,readyZone:"Zone E herbs",space:"0.5m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"No change",dir:"ok"},{name:"Humidity",emoji:"💧",change:"+2%",dir:"ok"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+4%",dir:"up"}],ai:"Basil is low-impact. Great companion plant for tomatoes and peppers."}},Se=[{zone:"Zone A",crop:"Chives",fill:90},{zone:"Zone B",crop:"Lettuce",fill:75},{zone:"Zone C",crop:"Eggplant",fill:95},{zone:"Zone D",crop:"Tomato",fill:60},{zone:"Zone E",crop:"Herbs",fill:82}],H=Object.entries(P).map(([e,n])=>({id:e,name:e.charAt(0).toUpperCase()+e.slice(1),emoji:n.emoji}));let F=new Set,z=4,C=5,T="spinach",S=null;function Be(){return`
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
  `}function $e(){var o;const e=document.getElementById("wif-cost-plant");if(!e)return;const n=window._WIF_DYNAMIC_CROPS||$,t=new Set,i=n.filter(a=>t.has(a.id)?!1:(t.add(a.id),!0));i.length===0?e.innerHTML='<option value="lettuce">Lettuce</option><option value="tomato">Tomato</option>':e.innerHTML=i.map(a=>`<option value="${a.id}">${a.emoji} ${a.name}</option>`).join(""),e.value=((o=i[0])==null?void 0:o.id)||"lettuce",setTimeout(ge,0)}function Te(){F=new Set,z=4,C=5,T="spinach",window.wifSwitchTab=De,window.wifUpdateHarvest=Q,window.wifUpdateCost=B,window.wifUpdateNewPlant=k,window.wifToggleCrop=Re,window.wifChangeQty=Oe,window.wifChangeRows=ze,window.wifNpFilterSuggestions=_e,window.wifSelectNp=He,window.wifSelectSpecies=me,window.wifNpShowSuggestions=Ne,window.wifNpHideSuggestions=U,window.wifTriggerCostAi=ge;const e=Ce();e!=null&&e.length?window._WIF_DYNAMIC_CROPS=ke(e):window._WIF_DYNAMIC_CROPS=null,S&&(S.destroy(),S=null);const n=document.getElementById("wif-np-input");n&&(n.value="Spinach"),$e(),Q(),ce().then(t=>{window._wif_lastSensors=t,B()}).catch(()=>B()),k()}function De(e,n){document.querySelectorAll(".wif-section").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".wif-tab-btn").forEach(t=>t.classList.remove("active")),document.getElementById("wif-"+e).classList.add("active"),n.classList.add("active"),e==="cost"&&B(),e==="newplant"&&k()}function Q(){const e=window._WIF_DYNAMIC_CROPS||$,n=parseInt(document.getElementById("wif-sl-days").value);document.getElementById("wif-v-days").textContent=n+(n===1?" day":" days");const t=e.filter(a=>a.readyIn<=n),i=t.reduce((a,s)=>a+s.kg,0),o=t.reduce((a,s)=>a+s.units,0);document.getElementById("wif-hm-items").textContent=t.length,document.getElementById("wif-hm-yield").textContent=i.toFixed(2)+" kg",document.getElementById("wif-hm-units").textContent=o,document.getElementById("wif-crop-timelines").innerHTML=e.map(a=>{const s=Math.min(100,Math.round(n/a.readyIn*100)),d=a.readyIn<=n;return`
      <div class="wif-tl-row">
        <span class="wif-tl-name">${a.emoji} ${a.name}</span>
        <div class="wif-tl-track">
          <div class="wif-tl-fill" style="width:${s}%;background:${d?"var(--accent,#639922)":"var(--amber-100,#FAC775)"};"></div>
        </div>
        ${d?`<span class="wif-tl-count">${a.units} units <span class="wif-badge wif-badge-green">Ready</span></span>`:`<span class="wif-tl-end" style="color:var(--text-secondary,#666)">Day ${a.readyIn}</span>`}
      </div>`}).join(""),pe(n),fe()}function pe(e){const n=window._WIF_DYNAMIC_CROPS||$,t=document.getElementById("wif-crop-select"),i=n.filter(o=>o.readyIn<=e);if(F.forEach(o=>{i.find(a=>a.id===o)||F.delete(o)}),i.length===0){t.innerHTML='<span style="font-size:12px;color:var(--text-secondary,#999);">No crops ready yet — move the slider forward.</span>';return}t.innerHTML=i.map(o=>`
    <div class="wif-pill ${F.has(o.id)?"selected":""}"
         onclick="wifToggleCrop('${o.id}')">
      ${o.emoji} ${o.name}
    </div>`).join("")}function Re(e){F.has(e)?F.delete(e):F.add(e);const n=parseInt(document.getElementById("wif-sl-days").value);pe(n),fe()}function fe(){const e=document.getElementById("wif-recipe-grid"),n=document.getElementById("wif-ai-recipe-note");if(F.size===0){e.innerHTML="",n.textContent="Select crops above to see recipe suggestions.";return}const t=Ie.map(i=>{const o=i.ingr.filter(a=>F.has(a)).length;return o===0?null:{...i,match:o,pct:Math.round(o/i.ingr.length*100)}}).filter(Boolean).sort((i,o)=>o.match-i.match);e.innerHTML=t.map(i=>`
    <div class="wif-recipe-card">
      <div class="wif-recipe-hero">${i.emoji}</div>
      <div class="wif-recipe-name">
        ${i.name}
        <span class="wif-badge ${i.pct===100?"wif-badge-green":"wif-badge-amber"}">${i.pct}%</span>
      </div>
      <div>
        ${i.ingr.map(o=>{const s=(window._WIF_DYNAMIC_CROPS||$).find(g=>g.id===o)||$.find(g=>g.id===o);return F.has(o)?`<span class="wif-ingr-tag">${s?s.emoji+" "+s.name:o}</span>`:`<span class="wif-ingr-tag" style="background:#f0f0f0;color:#999;border:0.5px dashed #ccc;">🛒 ${s?s.name:o}</span>`}).join("")}
      </div>
    </div>`).join(""),n.textContent=t.length>0?`${t.length} recipe${t.length>1?"s":""} match your harvest. Loading database...`:"No local matches. Loading database recipes...",Me([...F])}async function Me(e){const n=document.getElementById("wif-recipe-grid"),t=document.getElementById("wif-ai-recipe-note"),i={tomato:["tomato","tomatoes"],carrot:["carrot","carrots"],cabbage:["cabbage"],eggplant:["eggplant","aubergine","brinjal"],basil:["basil"],green_onion:["green onion","green onions","scallion"],lettuce:["lettuce"],spinach:["spinach"],strawberry:["strawberry","strawberries"],pepper:["bell pepper","green pepper","capsicum"]};try{const o=await Promise.all(e.map(r=>fetch(`${L}/api/whatif/recipes?species=${r}`).then(l=>l.ok?l.json():{recipes:[]}).catch(()=>({recipes:[]})))),a=new Set,s=o.flatMap(r=>r.recipes||[]).filter(r=>a.has(r.name)?!1:(a.add(r.name),!0));if(!s.length){t.textContent=t.textContent.replace("Loading database...","(No DB results)").replace("Loading database recipes...","(No DB results)");return}const d=s.map(r=>{const l=e.filter(c=>{const m=i[c]||[c];return r.ingredients.some(f=>m.some(w=>f.toLowerCase().includes(w.toLowerCase())))});if(l.length===0)return null;const u=e.flatMap(c=>i[c]||[c]),p=r.ingredients.filter(c=>{const m=c.toLowerCase();return!(u.some(w=>m.includes(w))||["salt","pepper","water","oil","sugar","flour","butter","egg","milk","sauce","mix","seasoning","powder","vinegar","cream","cheese","margarine"].some(w=>m.includes(w)))}).map(c=>c.replace(/^\d[\d\s\/]*(\(\d+[\s\w\.]+\))?\s*(lb|oz|c|pkg|tsp|tbsp|can|qt|pt|pkg|Tbsp|large|medium|small|fresh|dried|chopped|diced|sliced|cooked|frozen|thawed|drained|shredded|grated|minced|crushed|ground|boneless|skinless)\.?\s*/gi,"").replace(/^[\d\/\s\.]+/,"").trim()).filter(c=>c.length>2&&c.length<40).slice(0,4);return{recipe:r,grownMatches:l,otherIngredients:p}}).filter(Boolean).sort((r,l)=>l.grownMatches.length-r.grownMatches.length);if(!d.length){t.textContent="No database recipes matched your selected crops.";return}const g=d.map(({recipe:r,grownMatches:l,otherIngredients:u})=>{const p=l.map(m=>{const w=(window._WIF_DYNAMIC_CROPS||$).find(E=>E.id===m)||$.find(E=>E.id===m);return`<span class="wif-ingr-tag" style="background:var(--teal-50,#E1F5EE);color:var(--teal-600,#0F6E56);border:0.5px solid var(--teal-200,#7DD3BD);">${w?w.emoji+" "+w.name:m}</span>`}).join(""),c=u.map(m=>`<span class="wif-ingr-tag" style="background:#f0f0f0;color:#888;border:0.5px dashed #ccc;">🛒 ${m}</span>`).join("");return`
        <div class="wif-recipe-card" style="border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
          <div class="wif-recipe-hero">🍽️</div>
          <div class="wif-recipe-name">
            ${r.name.trim()}
            <span class="wif-badge wif-badge-teal">DB</span>
          </div>
          <div>${p}${c}</div>
        </div>`}).join("");n.innerHTML+=g,t.textContent=`${d.length} recipes found — green = your harvest, 🛒 = ingredients to buy.`}catch{t.textContent=t.textContent.replace("Loading database...","(Backend offline — local only)").replace("Loading database recipes...","(Backend offline — local only)")}}function ze(e){C=Math.max(1,Math.min(20,C+e));const n=document.getElementById("wif-rows-disp");n&&(n.textContent=C),B()}function B(){const e=document.getElementById("wif-cost-plant"),n=e==null?void 0:e.value,t=document.getElementById("wif-sl-weeks");if(!n||!t)return;const i=parseInt(t.value);document.getElementById("wif-v-weeks").textContent=i+(i===1?" wk":" wks");const o=Ae[n]||{mktPrice:5,perRowKgWk:.28,fertilizer:.6,note:"Analysing your crop with current sensor data..."},a=C*o.perRowKgWk*i,s=a*o.mktPrice,d=window._wif_lastSensors||b,g=d.water<x.water.low?D.dry:d.water>x.water.high?D.wet:D.mid,r=parseFloat((g*C*i*re).toFixed(2)),l=d.light>x.light.high?R.bright:d.light>x.light.low?R.mid:R.dark,u=parseFloat((l*de*i*7).toFixed(2)),p=parseFloat((u*se).toFixed(2)),c=d.nutrient<x.nutrient.low?M.low:d.nutrient>x.nutrient.high?M.high:M.mid,m=parseFloat((o.fertilizer*(i/4)*c).toFixed(2)),f=r+p+m,w=s-f;document.getElementById("wif-net-saving").textContent="RM "+w.toFixed(2),document.getElementById("wif-cost-breakdown").innerHTML=`
    <div class="wif-cost-row wif-cost-income">
      <span class="wif-cost-lbl">📦 Harvest value (${a.toFixed(1)} kg × RM ${o.mktPrice}/kg)</span>
      <span style="color:var(--green-600,#3B6D11);font-weight:500;">+RM ${s.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">💧 Water cost <span style="font-size:10px;opacity:.7;">(soil ${d.water}% → ${g}L/plant/wk)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${r.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">⚡ Energy cost <span style="font-size:10px;opacity:.7;">(light ${d.light}% → ${l}h lighting/day)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${p.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-expense">
      <span class="wif-cost-lbl">🧪 Fertilizer <span style="font-size:10px;opacity:.7;">(nutrient ${d.nutrient}% → ${c}× base)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-weight:500;">−RM ${m.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row wif-cost-net">
      <span>⭐ Net savings</span>
      <span style="color:var(--teal-600,#0F6E56);">RM ${w.toFixed(2)}</span>
    </div>`;const E=document.getElementById("wif-cost-ai-note");E&&!window._wif_aiNoteSet&&(E.textContent=o.note),je(i,o)}function je(e,n){const t=document.getElementById("wif-savings-chart");if(t)if(typeof Chart>"u"){const i=document.createElement("script");i.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",i.onload=()=>X(t,e,n),document.head.appendChild(i)}else X(t,e,n)}function X(e,n,t){S&&(S.destroy(),S=null);const i=window._wif_lastSensors||b,o=i.water<x.water.low?D.dry:i.water>x.water.high?D.wet:D.mid,a=i.light>x.light.high?R.bright:i.light>x.light.low?R.mid:R.dark,s=i.nutrient<x.nutrient.low?M.low:i.nutrient>x.nutrient.high?M.high:M.mid,d=[],g=[];for(let r=1;r<=n;r++){d.push("W"+r);const l=C*t.perRowKgWk*r*t.mktPrice,u=o*C*r*re,p=a*de*r*7*se,c=t.fertilizer*(r/4)*s;g.push(parseFloat((l-u-p-c).toFixed(2)))}S=new Chart(e,{type:"bar",data:{labels:d,datasets:[{label:"Net savings (RM)",data:g,backgroundColor:"#97C459",borderRadius:4,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:r=>"RM "+r.raw.toFixed(2)}}},scales:{y:{beginAtZero:!0,ticks:{callback:r=>"RM "+r,font:{size:10}},grid:{color:"rgba(128,128,128,0.08)"}},x:{grid:{display:!1},ticks:{font:{size:10}}}}}})}function ge(){var t,i,o;const e=(t=document.getElementById("wif-cost-plant"))==null?void 0:t.value,n=parseInt(((i=document.getElementById("wif-sl-weeks"))==null?void 0:i.value)||1);e&&(window._wif_aiNoteSet=!1,(o=document.getElementById("wif-ai-savings-detail"))==null||o.remove(),B(),Le(e,C,n))}async function Le(e,n,t){var a;const i=document.getElementById("wif-cost-ai-note");i.textContent="🤖 Analyzing your sensor data...";const o=await ce();window._wif_lastSensors=o,B(),(a=document.getElementById("wif-ai-savings-detail"))==null||a.remove();try{let s=100;(o.temp>32||o.temp<20)&&(s-=15),(o.humid>85||o.humid<40)&&(s-=10),o.water<35&&(s-=20),o.light<40&&(s-=15),o.nutrient<45&&(s-=15),s=Math.max(25,Math.min(100,s));let d="Excellent";s<90&&(d="Good"),s<70&&(d="Moderate"),s<50&&(d="Poor"),window._wif_dynamicCondition={score:s,label:d};const g=await fetch(`${L}/api/whatif/costsaving`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plant:e,units:n,weeks:t,sensors:o})});if(!g.ok)throw new Error("Server error");const r=await g.json();window._wif_aiNoteSet=!0,i.textContent=r.insight;const l=document.createElement("div");l.id="wif-ai-savings-detail",l.innerHTML=`
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
      </div>`;const u=document.getElementById("wif-cost"),p=u.querySelectorAll(":scope > .wif-card");p.length>=3?p[2].before(l):u.appendChild(l)}catch{i.textContent="AI analysis unavailable — showing calculated estimates only."}}let N=null;function _e(){const e=document.getElementById("wif-np-input"),n=document.getElementById("wif-np-suggestions");if(!e||!n)return;const t=e.value.trim().toLowerCase(),i=H.filter(a=>a.name.toLowerCase().includes(t)),o=i.find(a=>a.name.toLowerCase()===t);o&&(T=o.id,clearTimeout(N),N=setTimeout(k,400)),!o&&t.length>0&&(T=t,clearTimeout(N),N=setTimeout(k,600)),i.length===0?n.innerHTML=`
      <div class="wif-np-sug-item">
        🤖 Analyze "${t}"
      </div>
    `:n.innerHTML=i.map(a=>`
      <div class="wif-np-sug-item"
           onclick="wifSelectNp('${a.id}')">
        <span class="wif-np-sug-emoji">${a.emoji}</span>
        ${a.name}
      </div>
    `).join(""),n.style.display="block"}function Ne(){const e=document.getElementById("wif-np-input").value.toLowerCase(),n=e?H.filter(t=>t.name.toLowerCase().includes(e)):H;Pe(n)}function U(){const e=document.getElementById("wif-np-suggestions");e&&(e.style.display="none")}function Pe(e){const n=document.getElementById("wif-np-suggestions");if(n){if(!e.length){n.style.display="none";return}n.style.display="block",n.innerHTML=e.map(t=>`
    <div class="wif-np-sug-item" data-id="${t.id}" data-name="${t.name}">
      <span class="wif-np-sug-emoji">${t.emoji}</span>
      <span>${t.name}</span>
    </div>`).join(""),n.querySelectorAll(".wif-np-sug-item").forEach(t=>{t.addEventListener("click",()=>{me(t.dataset.id,t.dataset.name)})})}}function He(e){T=e.toLowerCase();const n=document.getElementById("wif-np-input");if(n){const t=H.find(i=>i.id===e);n.value=t?`${t.emoji} ${t.name}`:e}k(),U()}function me(e,n){T=e;const t=document.getElementById("wif-np-input");t&&(t.value=n),U(),k()}function Oe(e){z=Math.max(1,Math.min(20,z+e));const n=document.getElementById("wif-qty-disp");n&&(n.textContent=z),k()}function Y(){try{const e=JSON.parse(localStorage.getItem("user_farms")||"[]");if(!e.length)return null;const n=e.find(r=>{var l;return r.id===((l=y)==null?void 0:l.currentFarmId)})||e[e.length-1];if(!n)return null;const t=Array.isArray(n.plants)?n.plants:[];if(!t.length)return null;const o=(n.rackLabel||n.rackTypeId||"3-tier").match(/(\d+)/),a=o?parseInt(o[1]):3,s={};if(t.some(r=>r.tier!==void 0))t.forEach(r=>{const l=r.tier||1;s[l]||(s[l]=[]),s[l].push(r)});else{const r=Math.ceil(t.length/a);t.forEach((l,u)=>{const p=Math.floor(u/r)+1;s[p]||(s[p]=[]),s[p].push(l)})}const g=n.slotsPerTier||Math.max(...t.map(r=>r.position||1))||3;return Array.from({length:a},(r,l)=>{const u=l+1,p=s[u]||[],c=Math.round(p.length/g*100),m=[...new Set(p.map(f=>f.name))].join(", ")||"Empty";return{zone:`Tier ${u}`,crop:m,fill:Math.min(c,100)}})}catch(e){return console.warn("wifBuildFarmZones error:",e),null}}function We(){const e=document.getElementById("wif-zone-list");if(!e)return;const n=Y()||Se;e.innerHTML=n.map(t=>`
    <div class="wif-zone-row">
      <div>
        <div class="wif-zone-name">${t.zone} — ${t.crop}</div>
        <div class="wif-zone-meta">${t.fill}% capacity</div>
      </div>
      <span class="wif-badge ${t.fill>=90?"wif-badge-red":t.fill>=75?"wif-badge-amber":"wif-badge-green"}">
        ${t.fill>=90?"Full":t.fill>=75?"Near full":"Available"}
      </span>
    </div>`).join("")}function k(){var g;const e=document.getElementById("wif-impact-grid"),n=document.getElementById("wif-np-ai-note");if(!e||!n)return;const t=P[T],i=document.getElementById("wif-ready-title"),o=document.getElementById("wif-ready-sub"),a=Y();a&&a.some(r=>r.fill<90);const s=a==null?void 0:a.find(r=>r.fill<90);if((a?a.every(r=>r.fill>=90):!1)?(i&&(i.textContent="No space available"),o&&(o.textContent="All tiers are full. Harvest existing crops first to free up space.")):s?(i&&(i.textContent=`Space available in ${s.zone}`),o&&(o.textContent=`${s.zone} is ${s.fill}% full — has room for new plants.`)):t?(i&&(i.textContent=`You can plant in ${t.readyDays} days`),o&&(o.textContent=`${t.readyZone} harvests on Day ${t.readyDays} — freeing ${t.space} of space.`)):(i&&(i.textContent="Ready for planting"),o&&(o.textContent="Current farm conditions are suitable.")),We(),(g=t==null?void 0:t.impacts)!=null&&g.length){const r=Math.min(z/4,3);e.innerHTML=t.impacts.filter(l=>l.name!=="Temperature").map(l=>{let u=l.change;if(l.dir!=="ok"){const p=parseFloat(l.change);if(!isNaN(p)){const c=p*r,m=c>0?"+":"",f=l.change.includes("%")?"%":l.change.includes("°")?"°C":l.change.includes("h")?"h":"";u=m+c.toFixed(1).replace(/\.0$/,"")+f}}return`
        <div class="wif-impact-card ${l.dir}">
          <div class="wif-impact-emoji">${l.emoji}</div>
          <div class="wif-impact-name">${l.name}</div>
          <div class="wif-impact-val ${l.dir}">${u}</div>
        </div>`}).join("")}else e.innerHTML=`
      <div class="wif-impact-card ok" style="grid-column:1/-1;text-align:center;padding:18px;">
        <div class="wif-impact-emoji">🌱</div>
        <div class="wif-impact-name">Impact</div>
        <div class="wif-impact-val ok">Calculating...</div>
      </div>`;n.style.display="none",Ke(T,z)}async function Ke(e,n){var d,g,r,l,u,p,c;const t=document.getElementById("wif-np-ai-note"),i=document.getElementById("wif-np-advisor-card"),o=document.getElementById("wif-np-advisor-body");i&&(i.style.display="block",o.innerHTML=`
      <div class="wif-ai-note" style="margin:0;">
        <span>🤖</span><span>Analysing suitability for <strong>${e}</strong>...</span>
      </div>`);const a=await le(),s=window._WIF_DYNAMIC_CROPS?window._WIF_DYNAMIC_CROPS.map(m=>m.id):["lettuce","tomato","basil"];try{const m=await fetch(`${L}/api/whatif/newplant`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({species:e,quantity:n,currentCrops:s,sensors:a})});if(!m.ok)throw new Error("Server error");const f=await m.json(),w=f.analysis||{};if(f.unsuitable=w.suitable===!1||f.unsuitable===!0,f.insight=w.reason?`${w.reason} ${w.careAdvice||""}`.trim():f.insight||"Analysis complete.",f.warnings=w.warnings||f.warnings||[],f.supported=!f.unsuitable,f.score=w.compatibilityScore??f.score??0,o)if(f.unsuitable)o.innerHTML=`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;">
            <span style="font-size:28px;">⚠️</span>
            <div>
              <div style="font-size:13px;font-weight:500;color:var(--red-400,#E24B4A);margin-bottom:4px;">Not suitable for indoor vertical farming</div>
              <div style="font-size:12px;color:var(--text-secondary,#666);">${f.insight}</div>
            </div>
          </div>`;else{const I=(d=f.warnings)!=null&&d.length?`<div style="margin-top:8px;padding:8px 10px;background:var(--amber-50,#FAEEDA);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--amber-800,#633806);">
               ⚠️ ${f.warnings.join(" · ")}
             </div>`:`<div style="margin-top:8px;padding:8px 10px;background:var(--green-50,#EAF3DE);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--green-800,#27500A);">
               ✅ All projected values within safe range
             </div>`;o.innerHTML=`
          <div style="font-size:12px;color:var(--teal-600,#0F6E56);line-height:1.5;">${f.insight}</div>
          ${I}
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
            <span class="wif-badge wif-badge-green">Suitable Indoor Crop</span>
            <span class="wif-badge wif-badge-blue">AI Score: ${f.score}%</span>
          </div>`}if(t){const I=i&&i.style.display!=="none";t.style.display=I?"none":"flex",t.textContent=f.insight}const E=document.getElementById("wif-ready-title"),_=document.getElementById("wif-ready-sub"),q=Y(),he=q?q.every(I=>I.fill>=90):!1;f.supported?he&&(E&&(E.textContent="No space available"),_&&(_.textContent="All tiers are full. Harvest existing crops first to free up space.")):(E&&(E.textContent="Not recommended right now"),_&&(_.textContent=((g=f.warnings)==null?void 0:g[0])||"Check the AI advisor for details."));const V=document.getElementById("wif-impact-grid");if(V&&!f.unsuitable&&f.impacts){const I={Temperature:(r=f.impacts)==null?void 0:r.tempChange,Humidity:(l=f.impacts)==null?void 0:l.humidChange,"Light (h/d)":(u=f.impacts)==null?void 0:u.lightChange,Fertilizer:(p=f.impacts)==null?void 0:p.nutrientChange},J=(((c=P[e])==null?void 0:c.impacts)||[]).map(h=>{const A=I[h.name];if(A==null)return h;const ye=A>0?"+":"",xe=h.name.includes("Light")?"h":h.name.includes("Temp")?"°C":"%",be=A===0?"No change":`${ye}${A}${xe}`,Ee=A===0?"ok":A>0?"up":"down";return{...h,change:be,dir:Ee}}).filter(h=>h.name!=="Temperature");J.length>0&&(V.innerHTML=J.map(h=>`
          <div class="wif-impact-card ${h.dir||"ok"}">
            <div class="wif-impact-emoji">${h.emoji||"🌱"}</div>
            <div class="wif-impact-name">${h.name||"Unknown"}</div>
            <div class="wif-impact-val ${h.dir||"ok"}">${h.change||"No change"}</div>
          </div>`).join(""))}}catch{o&&(o.innerHTML=`
        <div class="wif-ai-note" style="margin:0;">
          <span>🤖</span><span>AI advisor unavailable — check your connection.</span>
        </div>`);const f=P[e];t&&(t.textContent=f?`${f.ai} (${n} plants)`:"AI prediction unavailable.")}}const K=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,Z=45,Ue=10,ue=20,we=250,G=.218;function Ye(){return`
    <div id="consumptionRoot" style="padding:16px; min-height:100%; background:#F0F4F8; color:#1A2B3C;">

      <!-- LOADING -->
      <div id="con-loading" style="text-align:center; padding:40px 0;">
        <div style="font-size:2rem; animation:spin 1s linear infinite; display:inline-block;">⚙️</div>
        <div style="margin-top:8px; color:#64748B; font-size:0.85rem;">Fetching farm data…</div>
      </div>

      <!-- MAIN CONTENT -->
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

        <!-- KPI CARDS -->
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

        <!-- WATER CHART -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#2563EB; font-weight:600; margin-bottom:12px;">💧 Water Level (last 24 readings)</div>
          <div style="position:relative; width:100%; height:220px;">
            <canvas id="con-water-chart" style="position:absolute; top:0; left:0; width:100% !important; height:100% !important;"></canvas>
          </div>
        </div>

        <!-- ENERGY CHART -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#D97706; font-weight:600; margin-bottom:12px;">⚡ Energy Usage (last 24 readings)</div>
          <div style="position:relative; width:100%; height:160px;">
            <canvas id="con-energy-chart" style="position:absolute; top:0; left:0; width:100% !important; height:100% !important;"></canvas>
          </div>
        </div>

        <!-- RESOURCE BREAKDOWN -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#1A2B3C; font-weight:600; margin-bottom:12px;">📊 Resource Breakdown</div>
          <div id="con-breakdown" style="display:flex; flex-direction:column; gap:10px;"></div>
        </div>

        <!-- ── AI TRADITIONAL FARMING COMPARISON (NEW) ── -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; margin-bottom:12px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <div style="color:#1A2B3C; font-weight:600;">🌾 vs Traditional Farming</div>
            <span style="font-size:0.65rem;color:#94A3B8;font-weight:500;">AI Analysis</span>
          </div>
          <div style="font-size:0.72rem;color:#64748B;margin-bottom:12px;">
            Real-world comparison based on your crop types
          </div>

          <!-- Comparison bars (populated by JS) -->
          <div id="con-trad-bars" style="display:flex;flex-direction:column;gap:12px;margin-bottom:14px;"></div>

          <!-- Monthly savings summary -->
          <div id="con-monthly-savings" style="
            background:linear-gradient(135deg,#f0fdf4,#eff6ff);
            border-radius:12px;padding:14px;margin-bottom:12px;
            border:1px solid #bbf7d0;display:none;
          "></div>

          <!-- AI Narrative (Groq) -->
          <div id="con-trad-ai" style="
            background:#F8FAFC;border-left:3px solid #2563EB;
            border-radius:0 12px 12px 0;padding:12px;
            border-top:1px solid #F1F5F9;border-right:1px solid #F1F5F9;border-bottom:1px solid #F1F5F9;
          ">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <span style="font-size:1rem;">🤖</span>
              <span style="font-weight:700;color:#2563EB;font-size:0.82rem;">AI Sustainability Insight</span>
              <div id="con-trad-spinner" style="
                width:14px;height:14px;border:2px solid #BFDBFE;
                border-top-color:#2563EB;border-radius:50%;
                animation:spin 0.8s linear infinite;display:none;
              "></div>
            </div>
            <div id="con-trad-text" style="color:#475569;font-size:0.78rem;line-height:1.5;">
              Analysing your farm's plants and sensor data…
            </div>
          </div>
        </div>

        <!-- AI ECO TIPS -->
        <div style="background:#FFFFFF; border-radius:16px; padding:16px; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div style="color:#1A2B3C; font-weight:600; margin-bottom:12px;">🤖 AI Eco Tips</div>
          <div id="con-ai-tips" style="display:flex; flex-direction:column; gap:8px;"></div>
        </div>

        <!-- LAST UPDATED -->
        <div id="con-last-updated" style="text-align:center; color:#94A3B8; font-size:0.7rem; margin-top:12px; padding-bottom:16px;"></div>

      </div><!-- end #con-content -->

      <!-- ERROR STATE -->
      <div id="con-error" style="display:none; text-align:center; padding:40px 16px;">
        <div style="font-size:2rem;">⚠️</div>
        <div style="color:#DC2626; margin-top:8px; font-size:0.9rem;">Could not connect to backend.</div>
        <div style="color:#64748B; font-size:0.75rem; margin-top:4px;">Using simulated data for demo.</div>
        <button id="con-retry-btn" style="margin-top:16px;padding:8px 20px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:12px;cursor:pointer;font-weight:600;">🔄 Retry</button>
      </div>

    </div>
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
      .con-progress-track { background:#E2E8F0;border-radius:100px;height:8px;flex:1;overflow:hidden; }
      .con-progress-fill  { height:100%;border-radius:100px;transition:width 0.6s ease; }
    </style>
  `}async function Ze(){var e;(e=document.getElementById("con-retry-btn"))==null||e.addEventListener("click",()=>ee()),await ee()}async function ee(){ve("loading");try{const e=y.currentFarmId||"farm_001",[n,t]=await Promise.all([fetch(`${K}/api/sensors/history?deviceId=${e}&limit=24`),fetch(`${K}/api/sensors/latest?deviceId=${e}`)]);if(!n.ok||!t.ok)throw new Error("API error");const i=await n.json(),o=await t.json(),a=i.readings||[],s=o.reading||null;a.length===0?O(te(),!0):O(a,!1,s)}catch(e){console.warn("[ConsumptionPage] Backend unreachable, using mock data:",e.message),O(te(),!0)}}function O(e,n=!1,t=null){var g,r;ve("content");const i=Ve(e);v("con-water-today").textContent=`${i.waterLiters.toFixed(1)} L`,v("con-energy-today").textContent=`${i.energyKwh.toFixed(2)} kWh`,v("con-co2").textContent=`${i.co2Saved.toFixed(2)} kg`,v("con-cost").textContent=`RM ${i.costRm.toFixed(2)}`;const o=Math.round((1-i.waterLiters/60)*100),a=Math.round((1-i.energyKwh/20)*100);o>0&&(v("con-water-vs").textContent=`↓ ${o}% vs traditional`),a>0&&(v("con-energy-vs").textContent=`↓ ${a}% vs traditional`);const s=Je(i);v("con-grade").textContent=s.letter,v("con-grade").style.color=s.color,v("con-grade-note").textContent=s.note,Qe(e),Xe(i),et(e,t,i),Ge(i);const d=((g=e[0])==null?void 0:g.createdAt)||((r=e[0])==null?void 0:r.timestamp)||new Date;v("con-last-updated").textContent=`${n?"⚡ Demo mode · ":""}Last updated: ${new Date(d).toLocaleString("en-MY")}`}async function Ge(e,n){const t=y.currentFarm,i=qe(t),o=60,a=3,s=2.5,d=Math.max(0,o-e.waterLiters),g=Math.max(0,a-e.energyKwh),r=(a-e.energyKwh)*G+d*.002,l=Math.max(0,r*30),u=[{label:"💧 Water",yours:e.waterLiters,trad:o,unit:"L",color:"#2563EB",saving:`${d.toFixed(1)} L saved`},{label:"⚡ Energy",yours:e.energyKwh,trad:a,unit:"kWh",color:"#D97706",saving:`${g.toFixed(2)} kWh saved`},{label:"🌿 CO₂",yours:Math.max(.1,s-e.co2Saved),trad:s,unit:"kg",color:"#16A34A",saving:`${e.co2Saved.toFixed(2)} kg offset`}];if(v("con-trad-bars").innerHTML=u.map(p=>{const c=Math.min(100,p.yours/p.trad*100),m=Math.round(100-c);return`
            <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
                    <span style="font-size:0.78rem;font-weight:600;color:#374151;">${p.label}</span>
                    <span style="font-size:0.72rem;color:#16A34A;font-weight:700;">↓ ${m}% · ${p.saving}</span>
                </div>
                <div style="display:flex;gap:4px;align-items:center;margin-bottom:3px;">
                    <span style="font-size:0.62rem;color:#94A3B8;width:56px;">Yours</span>
                    <div style="flex:1;background:#E2E8F0;border-radius:100px;height:8px;overflow:hidden;">
                        <div style="width:${c.toFixed(1)}%;height:100%;background:${p.color};border-radius:100px;transition:width 0.6s ease;"></div>
                    </div>
                    <span style="font-size:0.65rem;font-weight:700;color:${p.color};width:36px;text-align:right;">${p.yours.toFixed(1)}${p.unit}</span>
                </div>
                <div style="display:flex;gap:4px;align-items:center;">
                    <span style="font-size:0.62rem;color:#94A3B8;width:56px;">Traditional</span>
                    <div style="flex:1;background:#E2E8F0;border-radius:100px;height:8px;overflow:hidden;">
                        <div style="width:100%;height:100%;background:#CBD5E1;border-radius:100px;"></div>
                    </div>
                    <span style="font-size:0.65rem;font-weight:700;color:#94A3B8;width:36px;text-align:right;">${p.trad}${p.unit}</span>
                </div>
            </div>`}).join(""),l>0){const p=v("con-monthly-savings");p.style.display="block",p.innerHTML=`
            <div style="font-size:0.7rem;font-weight:700;color:#16A34A;letter-spacing:0.06em;margin-bottom:8px;">💚 ESTIMATED MONTHLY SAVINGS</div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                <div style="text-align:center;">
                    <div style="font-size:1.1rem;font-weight:800;color:#2563EB;">${(d*30).toFixed(0)}L</div>
                    <div style="font-size:0.62rem;color:#64748B;">water saved</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:1.1rem;font-weight:800;color:#D97706;">RM ${l.toFixed(2)}</div>
                    <div style="font-size:0.62rem;color:#64748B;">utility cost</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:1.1rem;font-weight:800;color:#16A34A;">${(e.co2Saved*30).toFixed(1)}kg</div>
                    <div style="font-size:0.62rem;color:#64748B;">CO₂ offset</div>
                </div>
            </div>
        `}v("con-trad-spinner").style.display="inline-block",v("con-trad-text").textContent="Generating plant-specific analysis…";try{const c=`You are an agricultural sustainability AI for SeedDown vertical farming.
Compare our vertical farm data against traditional outdoor soil farming for these crops: ${i.length>0?i.join(", "):"lettuce, herbs"}.

Our vertical farm today:
- Water used: ${e.waterLiters.toFixed(1)}L (traditional soil farm uses ~${o}L/day)
- Energy used: ${e.energyKwh.toFixed(2)}kWh (traditional uses ~${a}kWh/day for irrigation + transport)
- CO₂ offset: ${e.co2Saved.toFixed(2)}kg

Write 2-3 sentences (max 80 words) that:
1. Name the specific crops and explain why vertical farming saves more water/energy for THOSE crops specifically.
2. Give one surprising or memorable fact about the environmental benefit for the named plants.
3. Keep it positive and inspiring.
Do NOT use bullet points. Plain prose only.`,m=await fetch(`${K}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:c,history:[]})});if(m.ok){const f=await m.json(),w=f.reply||f.message||"";w?v("con-trad-text").textContent=w:v("con-trad-text").textContent=W(i,e,d)}else v("con-trad-text").textContent=W(i,e,d)}catch(p){console.warn("[ConsumptionPage] AI comparison fetch failed:",p),v("con-trad-text").textContent=W(i,e,d)}finally{v("con-trad-spinner").style.display="none"}}function W(e,n,t){const i=e.length>0?e[0]:"leafy greens";return`Your vertical ${i} farm uses ${t.toFixed(1)}L less water than traditional soil methods — a saving of up to ${Math.round(t/60*100)}% per day. Vertical farming produces the same yield in up to 95% less land area, making it one of the most resource-efficient ways to grow ${i} in urban Malaysia.`}function qe(e){if(!e)return[];const n=new Set;return e.targetPlant&&n.add(e.targetPlant.toLowerCase()),Array.isArray(e.plants)&&e.plants.forEach(t=>{const i=(t==null?void 0:t.name)||(t==null?void 0:t.species)||(t==null?void 0:t.type);i&&n.add(String(i).toLowerCase())}),[...n].slice(0,4)}function Ve(e){let n=0,t=0,i=0,o=0;e.forEach(l=>{const u=l.soilRaw??l.soilMoisture??1900,p=l.lightRaw??l.light??2e3,c=l.temperature??25;u<1800&&n++,p<1500&&(t++,o++),c>28&&i++});const a=n*we/1e3,d=(t*Z+i*ue+n*Ue)/1e3,g=d*G,r=(60-a)*.035;return{waterLiters:Math.max(a,.5),energyKwh:Math.max(d,.1),costRm:Math.max(g,.02),co2Saved:Math.max(r,.5),lightHours:t,fanHours:i,waterActivations:n,lowLightCount:o,totalReadings:e.length}}function Je(e){const n=(e.waterLiters<5?40:e.waterLiters<15?25:10)+(e.energyKwh<1?40:e.energyKwh<3?25:10)+(e.costRm<.5?20:e.costRm<1?10:5);return n>=90?{letter:"A+",color:"#00FF88",note:"Outstanding! Your farm is ultra-efficient."}:n>=75?{letter:"A",color:"#4ADE80",note:"Excellent efficiency. Minor tweaks possible."}:n>=55?{letter:"B",color:"#FFD966",note:"Good efficiency. Some room to optimise."}:n>=35?{letter:"C",color:"#FB923C",note:"Average. Consider AI-driven scheduling."}:{letter:"D",color:"#F87171",note:"High consumption detected. Review alerts."}}async function Qe(e){window.Chart||await new Promise((d,g)=>{const r=document.createElement("script");r.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js",r.onload=d,r.onerror=g,document.head.appendChild(r)});const n=e.map((d,g)=>{const r=new Date(d.createdAt||d.timestamp||Date.now()-(e.length-g)*36e5);return`${r.getHours().toString().padStart(2,"0")}:${r.getMinutes().toString().padStart(2,"0")}`}),t=e.map(d=>d.waterLevel??d.waterDistanceCm??70),i=e.map(d=>{const g=d.lightRaw??d.light??2e3,r=d.temperature??25;return((g<1500?Z:0)+(r>28?ue:0))/10}),o={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},layout:{padding:{top:8}},scales:{x:{ticks:{color:"#94A3B8",font:{size:9},maxRotation:45,minRotation:45},grid:{color:"#F1F5F9"},border:{color:"#E2E8F0"}},y:{ticks:{color:"#94A3B8",font:{size:9}},grid:{color:"#F1F5F9"},border:{color:"#E2E8F0"}}}},a=document.getElementById("con-water-chart");a&&(a._chart&&a._chart.destroy(),a._chart=new window.Chart(a,{type:"line",data:{labels:n,datasets:[{data:t,borderColor:"#2563EB",backgroundColor:d=>{const{ctx:g,chartArea:r}=d.chart;if(!r)return"rgba(37,99,235,0.08)";const l=g.createLinearGradient(0,r.top,0,r.bottom);return l.addColorStop(0,"rgba(37,99,235,0.18)"),l.addColorStop(1,"rgba(37,99,235,0.01)"),l},fill:!0,tension:.4,pointRadius:2,pointHoverRadius:5,pointBackgroundColor:"#2563EB",pointBorderColor:"#fff",pointBorderWidth:1.5,borderWidth:2}]},options:{...o}}));const s=document.getElementById("con-energy-chart");s&&(s._chart&&s._chart.destroy(),s._chart=new window.Chart(s,{type:"bar",data:{labels:n,datasets:[{data:i,backgroundColor:i.map(d=>d>5?"rgba(217,119,6,0.85)":"rgba(217,119,6,0.5)"),borderColor:i.map(d=>d>5?"#92400E":"#B45309"),borderWidth:1,borderRadius:6,borderSkipped:!1}]},options:{...o}}))}function Xe(e){const n=[{label:"💧 Water Pump",value:e.waterActivations,unit:"activations",pct:e.waterActivations/Math.max(e.totalReadings,1)*100,color:"#2563EB"},{label:"💡 Grow Lights",value:e.lightHours,unit:"hrs ON",pct:e.lightHours/Math.max(e.totalReadings,1)*100,color:"#D97706"},{label:"🌀 Cooling Fan",value:e.fanHours,unit:"hrs ON",pct:e.fanHours/Math.max(e.totalReadings,1)*100,color:"#16A34A"}];v("con-breakdown").innerHTML=n.map(t=>`
        <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.8rem;">
                <span style="color:#374151;font-weight:500;">${t.label}</span>
                <span style="color:#1A2B3C;font-weight:700;">${t.value} ${t.unit}</span>
            </div>
            <div class="con-progress-track">
                <div class="con-progress-fill" style="width:${Math.min(t.pct,100).toFixed(1)}%;background:${t.color};"></div>
            </div>
        </div>`).join("")}function et(e,n,t){var a;const i=[];if(t.lightHours>t.totalReadings*.6){const s=(t.lightHours*.5*Z/1e3*G).toFixed(2);i.push({icon:"💡",title:"Reduce grow light duration",desc:`Lights were ON for ${t.lightHours} intervals. Reducing by 2h/day saves ≈ RM ${s}/day.`,color:"#FFD966"})}if(t.waterActivations>8){const s=((t.waterActivations-6)*we/1e3).toFixed(1);i.push({icon:"💧",title:"Batch your watering cycles",desc:`${t.waterActivations} watering events detected. Consolidating to 6 cycles saves ≈ ${s} L/day.`,color:"#60A5FA"})}const o=(n==null?void 0:n.ph)??((a=e[0])==null?void 0:a.ph);o&&(o<5.8||o>6.5)&&i.push({icon:"🧪",title:`pH imbalance detected (${o.toFixed(1)})`,desc:"Optimal range 5.8–6.5. Out-of-range pH reduces nutrient uptake by up to 30%.",color:"#F87171"}),t.fanHours>t.totalReadings*.4&&i.push({icon:"🌡️",title:"High temperature periods detected",desc:`Fan active ${t.fanHours} intervals. Adjust light schedule to reduce heat buildup.`,color:"#FB923C"}),i.length===0&&i.push({icon:"✅",title:"Your farm is running efficiently!",desc:"All consumption metrics are within optimal range. Keep up the good work.",color:"#4ADE80"}),v("con-ai-tips").innerHTML=i.map(s=>`
        <div style="background:#F8FAFC;border-left:3px solid ${s.color};border-radius:0 12px 12px 0;padding:12px;border-top:1px solid #F1F5F9;border-right:1px solid #F1F5F9;border-bottom:1px solid #F1F5F9;">
            <div style="font-weight:600;color:${s.color};font-size:0.85rem;">${s.icon} ${s.title}</div>
            <div style="color:#475569;font-size:0.78rem;margin-top:4px;line-height:1.4;">${s.desc}</div>
        </div>`).join("")}function te(){const e=Date.now();return Array.from({length:24},(n,t)=>({deviceId:"farm_001",temperature:22+Math.sin(t/4)*4+Math.random()*2,humidity:60+Math.random()*15,soilRaw:1600+Math.floor(Math.random()*600),ph:5.9+Math.random()*.8,lightRaw:800+Math.floor(Math.random()*1200),waterLevel:70+Math.floor(Math.random()*20),gasRaw:800+Math.floor(Math.random()*300),createdAt:new Date(e-(23-t)*36e5).toISOString()}))}function v(e){return document.getElementById(e)}function ve(e){const n=v("con-loading"),t=v("con-content"),i=v("con-error");n&&(n.style.display=e==="loading"?"block":"none"),t&&(t.style.display=e==="content"?"block":"none"),i&&(i.style.display=e==="error"?"block":"none")}let j=45;function tt(){return`
        <div style="padding:20px; background:#F9FBF9; min-height:100vh; font-family:sans-serif;">
            <div style="background:#FFFFFF; border-radius:24px; padding:16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; border:1px solid #EDF2F0; box-shadow:0 4px 12px rgba(0,0,0,0.02);">
                <span style="font-size:0.9rem; font-weight:700; color:#064E3B;">Predict Window:</span>
                <select id="predictTimeSelect" style="border:none; background:#F0FDF4; color:#065F46; padding:8px 12px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                    <option value="30">30 Mins</option>
                    <option value="45" ${j===45?"selected":""}>45 Mins</option>
                    <option value="60">60 Mins</option>
                </select>
            </div>
            <div id="dynamicAlertsList">
                <div style="text-align:center; padding:60px; color:#94A3B8;">🛰️ AI engine analyzing trends...</div>
            </div>
        </div>
    `}async function it(){const e=document.getElementById("predictTimeSelect");e&&(e.onchange=n=>{j=parseInt(n.target.value),oe("success",`AI calibrating for ${j}m...`),ie()}),ie()}async function ie(){const e=document.getElementById("dynamicAlertsList");if(e)try{const n="farm_001",[t,i,o]=await Promise.all([fetch(`http://localhost:3000/api/sensors/latest?deviceId=${n}`),fetch(`http://localhost:3000/api/sensors/history?deviceId=${n}&limit=10`),fetch(`http://localhost:3000/api/sensors/preferences?deviceId=${n}`)]),a=await t.json(),s=await i.json(),d=await o.json(),g=a.reading||{temperature:24},r=s.readings?s.readings.map(m=>m.temperature).join(", "):"22, 23, 24",p=(await(await fetch("http://localhost:3000/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:`As an AI Farm Expert, analyze temp ${g.temperature}C and trend [${r}]. Limit: ${d.tempMax||30}C. 
                          If a risk exists in ${j}m, respond ONLY in this format: 
                          "TITLE: [Problem] | DESC: [Analysis]".
                          If stable, reply: "STABLE".`,history:[]})})).json()).reply||"";let c=[];if(p.includes("STABLE")||!p)c.push({title:"Heat Stress",desc:`The AI predicts a potential issue with heat stress for the next ${j} minutes, based on the rising temperature trend.`,btnText:"Pre-cool System"});else{const m=p.split("|"),f=m[0].replace("TITLE:","").trim(),w=m[1].replace("DESC:","").trim();c.push({title:f,desc:w,btnText:"Pre-cool System"})}ne(e,c)}catch{ne(e,[{title:"Heat Stress (Demo)",desc:"AI predicts a temperature spike in 45m. Immediate cooling suggested.",btnText:"Pre-cool System"}])}}function ne(e,n){e.innerHTML=n.map(t=>`
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
    `).join(""),e.querySelectorAll(".action-btn").forEach(t=>{t.onclick=()=>{t.style.backgroundColor="#064E3B",oe("success","AI intervention started. Pre-cooling system active.")}})}function dt(e={}){const{feature:n,from:t="home"}=e,i=document.getElementById("screenContainer");let o="";n==="whatif"?o=Be():n==="consumption"?o=Ye():n==="alerts"&&(o=tt()),i.innerHTML=`
        <div class="screen active" id="featureScreen">
            <div class="feat-topbar" style="display:flex; align-items:center; padding:12px 16px; background:var(--surface); gap:12px;">
                <button id="featureBackBtn" class="back-btn" aria-label="Back">←</button>
                <div style="font-weight:700;">${n==="whatif"?"🔮 What-If":n==="consumption"?"⚡ Eco Savings":"🚨 AI Alerts"}</div>
            </div>
            <div style="flex:1; overflow-y:auto;">${o}</div>
        </div>
    `,document.getElementById("featureBackBtn").addEventListener("click",()=>Fe(t)),n==="whatif"?Te():n==="consumption"?Ze():n==="alerts"&&it()}export{dt as render};
