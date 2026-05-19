import{A as x,s as Me}from"./index-Dfiw7Fhj.js";import{i as Ee,l as Ke}from"./firebase-CzYD7I4u.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const te=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,W={waterRM:.042,fertRM:.085},fe={"2-tier":{tiers:2,slotsPerTier:3,label:"2-Tier Starter Rack"},"3-tier":{tiers:3,slotsPerTier:3,label:"3-Tier Vertical Rack"},"4-tier":{tiers:4,slotsPerTier:4,label:"4-Tier Grow Shelf"},"5-tier":{tiers:5,slotsPerTier:4,label:"5-Tier Tower Rack"},wall:{tiers:4,slotsPerTier:5,label:"Wall Panel Grid"},"a-frame":{tiers:4,slotsPerTier:4,label:"A-Frame Pyramid"},"nft-channel":{tiers:3,slotsPerTier:6,label:"NFT Channel Rows"},hanging:{tiers:5,slotsPerTier:3,label:"Hanging Column Farm"},"commercial-multi-zone":{tiers:1,slotsPerTier:12,label:"Commercial Multi-Zone Farm"}},U=[{label:"PriceCatcher transactional records",url:"https://data.gov.my/data-catalogue/pricecatcher",note:"Official Malaysia open-data price surveillance records by KPDN/DOSM."},{label:"FAMA Harga Pasaran Terkini",url:"https://www.fama.gov.my/harga-pasaran-terkini",note:"Official FAMA market-price reference."},{label:"Selina Wamucii Malaysia vegetables",url:"https://www.selinawamucii.com/insights/prices/malaysia/vegetables/",note:"Public export and wholesale market references."}],re=[{id:"lettuce",name:"Lettuce",icon:"🥬",growDays:45,yieldKgPerRow:4.2,pricePerKg:4.8,waterLpR:18,energyKWhpR:2.1,fertMLpR:120},{id:"tomato",name:"Tomato",icon:"🍅",growDays:70,yieldKgPerRow:8.5,pricePerKg:7.2,waterLpR:34,energyKWhpR:3.8,fertMLpR:220},{id:"basil",name:"Basil",icon:"🌿",growDays:30,yieldKgPerRow:1.8,pricePerKg:12,waterLpR:10,energyKWhpR:1.4,fertMLpR:80},{id:"spinach",name:"Spinach",icon:"🍃",growDays:40,yieldKgPerRow:3.8,pricePerKg:5,waterLpR:16,energyKWhpR:1.9,fertMLpR:100},{id:"chili",name:"Chili",icon:"🌶️",growDays:90,yieldKgPerRow:5,pricePerKg:10,waterLpR:22,energyKWhpR:2.8,fertMLpR:160},{id:"cucumber",name:"Cucumber",icon:"🥒",growDays:60,yieldKgPerRow:7.5,pricePerKg:4.5,waterLpR:30,energyKWhpR:3,fertMLpR:180},{id:"strawberry",name:"Strawberry",icon:"🍓",growDays:90,yieldKgPerRow:6,pricePerKg:12,waterLpR:25,energyKWhpR:2.5,fertMLpR:150},{id:"pepper",name:"Bell Pepper",icon:"🫑",growDays:80,yieldKgPerRow:6.4,pricePerKg:8,waterLpR:24,energyKWhpR:2.6,fertMLpR:155},{id:"mint",name:"Mint",icon:"🌿",growDays:30,yieldKgPerRow:1.6,pricePerKg:15,waterLpR:8,energyKWhpR:1.2,fertMLpR:60},{id:"carrot",name:"Carrot",icon:"🥕",growDays:75,yieldKgPerRow:6,pricePerKg:3.5,waterLpR:22,energyKWhpR:2.4,fertMLpR:140},{id:"eggplant",name:"Eggplant",icon:"🍆",growDays:80,yieldKgPerRow:7.2,pricePerKg:5.5,waterLpR:30,energyKWhpR:3.2,fertMLpR:190},{id:"cabbage",name:"Cabbage",icon:"🥦",growDays:90,yieldKgPerRow:9,pricePerKg:3.2,waterLpR:28,energyKWhpR:2.9,fertMLpR:160},{id:"kangkung",name:"Kangkung",icon:"🌱",growDays:45,yieldKgPerRow:3.5,pricePerKg:3,waterLpR:15,energyKWhpR:1.6,fertMLpR:90},{id:"petai",name:"Petai",icon:"🌱",growDays:45,yieldKgPerRow:3,pricePerKg:6,waterLpR:15,energyKWhpR:1.6,fertMLpR:90}],k=[{id:"spinach",name:"Spinach",icon:"🍃",growDays:40,pricePerKg:5,yieldKgPerRow:3.8,waterLpR:16,fertMLpR:100,temp:"+0.5",hum:"+3",ph:"0",light:"-0.5h",fert:"+8%",dir:["up","up","ok","down","up"]},{id:"mint",name:"Mint",icon:"🌿",growDays:30,pricePerKg:15,yieldKgPerRow:1.6,waterLpR:8,fertMLpR:60,temp:"0",hum:"+5",ph:"-0.2",light:"0",fert:"+5%",dir:["ok","up","down","ok","up"]},{id:"chili",name:"Chili",icon:"🌶️",growDays:90,pricePerKg:10,yieldKgPerRow:5,waterLpR:22,fertMLpR:160,temp:"+1.5",hum:"-4",ph:"+0.3",light:"+2h",fert:"+15%",dir:["warn","down","up","up","warn"]},{id:"cucumber",name:"Cucumber",icon:"🥒",growDays:60,pricePerKg:4.5,yieldKgPerRow:7.5,waterLpR:30,fertMLpR:180,temp:"+1",hum:"+6",ph:"0",light:"+1h",fert:"+12%",dir:["up","up","ok","up","up"]},{id:"strawberry",name:"Strawberry",icon:"🍓",growDays:90,pricePerKg:12,yieldKgPerRow:6,waterLpR:25,fertMLpR:150,temp:"-1",hum:"+2",ph:"-0.4",light:"+1.5h",fert:"+10%",dir:["down","ok","down","up","up"]},{id:"kale",name:"Kale",icon:"🥬",growDays:55,pricePerKg:6,yieldKgPerRow:4,waterLpR:18,fertMLpR:110,temp:"-0.5",hum:"+2",ph:"-0.1",light:"0",fert:"+6%",dir:["down","ok","ok","ok","up"]},{id:"broccoli",name:"Broccoli",icon:"🥦",growDays:70,pricePerKg:7,yieldKgPerRow:5.5,waterLpR:20,fertMLpR:130,temp:"-1",hum:"+3",ph:"-0.2",light:"+0.5h",fert:"+9%",dir:["down","up","down","up","up"]},{id:"celery",name:"Celery",icon:"🌾",growDays:85,pricePerKg:5.5,yieldKgPerRow:4.5,waterLpR:28,fertMLpR:140,temp:"+0.5",hum:"+8",ph:"+0.1",light:"+1h",fert:"+11%",dir:["up","warn","up","up","up"]},{id:"pepper",name:"Bell Pepper",icon:"🫑",growDays:80,pricePerKg:8,yieldKgPerRow:6.4,waterLpR:24,fertMLpR:155,temp:"+1",hum:"-2",ph:"0",light:"+1.5h",fert:"+8%",dir:["up","down","ok","up","up"]},{id:"tomato",name:"Tomato",icon:"🍅",growDays:70,pricePerKg:7.2,yieldKgPerRow:8.5,waterLpR:34,fertMLpR:220,temp:"+1",hum:"+4",ph:"+0.1",light:"+1.5h",fert:"+10%",dir:["up","up","ok","up","up"]},{id:"basil",name:"Basil",icon:"🌿",growDays:30,pricePerKg:12,yieldKgPerRow:1.8,waterLpR:10,fertMLpR:80,temp:"0",hum:"+2",ph:"0",light:"+1h",fert:"+4%",dir:["ok","ok","ok","up","up"]},{id:"kangkung",name:"Kangkung",icon:"🌱",growDays:45,pricePerKg:3,yieldKgPerRow:3.5,waterLpR:15,fertMLpR:90,temp:"+0.5",hum:"+3",ph:"0",light:"0",fert:"+5%",dir:["up","up","ok","ok","up"]},{id:"petai",name:"Petai",icon:"🌱",growDays:45,pricePerKg:6,yieldKgPerRow:3,waterLpR:15,fertMLpR:90,temp:"+0.5",hum:"+3",ph:"0",light:"0",fert:"+5%",dir:["up","up","ok","ok","up"]}];let T=null,h=10,_=k[0],oe=[...k],N=[],R=[],K=0,V={},Y=[...U],P={loading:!1,error:null,generatedAt:null},y=null,G="",z=null,j=!1;function c(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function $(e,t=2){const r=Number(e);return Number.isFinite(r)?"RM "+r.toFixed(t):"—"}function I(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")}function ve(e=[],t=[]){const r=new Map;return[...e,...t].forEach(o=>{if(!o)return;const a=o.id||o.farmId||o.backendFarmId||o.name||String(r.size);r.set(a,{...r.get(a)||{},...o})}),Array.from(r.values())}function ze(){let e=[];try{e=JSON.parse(localStorage.getItem("user_farms")||"[]")}catch{e=[]}return ve(x.currentFarm?[x.currentFarm]:[],e)}async function Ie(){if(!x.uid||x.isGuest)return[];try{await Ee();const e=await Ke(x.uid);return Array.isArray(e==null?void 0:e.farms)?e.farms:[]}catch(e){return console.warn("[WhatIfPro] Firestore farm load failed:",e),[]}}function A(e){if(!e.length)return null;const t=x.currentFarm,r=e[K]||e[0];return t&&(!r||t.id===r.id)?t:r}function xe(){const e=A(R);return(e==null?void 0:e.id)||(e==null?void 0:e.farmId)||(e==null?void 0:e.backendFarmId)||x.currentFarmId||null}function Fe(e){var r;if(!((r=e==null?void 0:e.plants)!=null&&r.length))return[];const t=new Map;for(const o of e.plants){const a=I(o.species||o.name);t.has(a)?t.get(a).slots+=o.slots||1:t.set(a,{...o,slots:o.slots||1})}return Array.from(t.values()).map(o=>{const a=I(o.species||o.name),i=re.find(n=>n.id===a)||{growDays:60,yieldKgPerRow:4,pricePerKg:5,waterLpR:20,energyKWhpR:2,fertMLpR:120};return{id:a,name:o.name||i.name||a,icon:o.emoji||"🌱",slots:o.slots||1,growDays:i.growDays,yieldKgPerRow:i.yieldKgPerRow*(o.slots||1),pricePerKg:i.pricePerKg,waterLpR:i.waterLpR*(o.slots||1),energyKWhpR:i.energyKWhpR*(o.slots||1),fertMLpR:i.fertMLpR*(o.slots||1)}})}function Ce(e){if(!e)return[];const t=Array.isArray(e.plants)?e.plants:[];if(Array.isArray(e.zones)&&e.zones.length)return e.zones.map((n,s)=>{var w;const l=n.zone_id||n.id||`zone_${String.fromCharCode(65+s)}`,d=t.filter(f=>(f.zoneId||f.zone_id||f.zoneName)===l||f.zoneName===n.name),g=d.length?d:(n.plants||[]).map(f=>({name:f,species:f,slots:1})),b=Number(n.capacity||n.slots||n.totalSlots||12),v=g.reduce((f,M)=>f+(Number(M.slots)||1),0),p=Math.min(100,Math.round(v/Math.max(1,b)*100)),u=be(g);return{id:n.name||n.label||l,crop:n.crop||[...new Set(g.map(f=>f.name||f.species))].join(", ")||"Empty",emoji:((w=g[0])==null?void 0:w.emoji)||"🌱",rows:v,capacity:b,availableRows:Math.max(0,b-v),fill:p,harvIn:u}});const r=e.rackTypeId||e.rackType||"3-tier",o={...fe[r]||fe["3-tier"],...e.rackConfig||{}},a=Number(o.tiers||3),i=Number(o.slotsPerTier||3);return Array.from({length:a},(n,s)=>{var v;const l=s+1,d=t.filter((p,u)=>p.tier!==void 0?Number(p.tier)===l:Math.floor(u/i)+1===l),g=d.reduce((p,u)=>p+(Number(u.slots)||1),0),b=Math.min(100,Math.round(g/Math.max(1,i)*100));return{id:`Tier ${l}`,crop:[...new Set(d.map(p=>p.name||p.species))].join(", ")||"Empty",emoji:((v=d[0])==null?void 0:v.emoji)||"🌱",rows:g,capacity:i,availableRows:Math.max(0,i-g),fill:b,harvIn:be(d)}})}function be(e=[]){const t=e.map(r=>{const o=re.find(a=>a.id===I(r.species||r.name));return o?Math.max(7,Math.round(o.growDays*.6)):21});return t.length?Math.min(...t):0}function Z(){var e,t,r,o,a,i,n,s,l,d;return{temp:((t=(e=x.sensors)==null?void 0:e.temp)==null?void 0:t.val)??28,humid:((o=(r=x.sensors)==null?void 0:r.humid)==null?void 0:o.val)??68,light:((i=(a=x.sensors)==null?void 0:a.light)==null?void 0:i.val)??82,water:((s=(n=x.sensors)==null?void 0:n.water)==null?void 0:s.val)??45,nutrient:((d=(l=x.sensors)==null?void 0:l.nutrient)==null?void 0:d.val)??78,source:x.latestReading?"AppState live cache":"local fallback"}}function Ae(e){var o,a;const t=(e==null?void 0:e.deviceId)||((o=e==null?void 0:e.farmMaster)==null?void 0:o.deviceId)||((a=x.currentFarm)==null?void 0:a.deviceId)||"farm_001",r=new URLSearchParams;return r.set("deviceId",t),r.toString()}function Se(e={}){const t=e.reading||e,r=Z(),o=Number(t.lightRaw),a=Number(t.soilRaw),i=Number(t.ecRaw),n=Number(t.ec),s=d=>Number.isFinite(d)?Math.max(0,Math.min(100,d/4095*100)):void 0,l=Number.isFinite(n)?Math.max(0,Math.min(100,n/2.2*100)):void 0;return{temp:t.temperature??t.temp??r.temp,humid:t.humidity??t.humid??r.humid,light:t.light??t.lux??s(o)??r.light,water:t.soilMoisture??t.water??s(a)??r.water,nutrient:t.nutrient??l??s(i)??r.nutrient,ph:t.ph??r.ph,soilRaw:Number.isFinite(a)?a:void 0,lightRaw:Number.isFinite(o)?o:void 0,ecRaw:Number.isFinite(i)?i:void 0,ec:Number.isFinite(n)?n:void 0,waterDistanceCm:t.waterDistanceCm,moistureSource:t.soilMoisture!==void 0?"sensor soilMoisture percent":t.water!==void 0?"sensor water percent":Number.isFinite(a)?"soilRaw scaled from 0-4095":r.source,createdAt:t.createdAt||t.updatedAt||null,source:"Firebase Cloud Firestore sensorReadings"}}async function ye(e=A(R)){try{const t=Ae(e),r=await fetch(`${te}/api/sensors/latest?${t}`);if(!r.ok)throw new Error("sensor HTTP "+r.status);const o=await r.json();return Se(o)}catch{return Z()}}function Q(e=y){if(!e)return 1;let t=100;return(e.temp<18||e.temp>32)&&(t-=14),(e.humid<45||e.humid>85)&&(t-=10),e.light<45&&(t-=12),(e.water<35||e.water>85)&&(t-=14),e.nutrient<45&&(t-=12),Math.max(.72,Math.min(1.12,t/100))}function S(e){var a,i;const t=I((e==null?void 0:e.id)||(e==null?void 0:e.name)),r=V[t],o=(e==null?void 0:e.pricePerKg)||((a=re.find(n=>n.id===t))==null?void 0:a.pricePerKg)||5;if(r!=null&&r.channels){const n=r.channels,s=r.bestChannel||((i=Object.entries(n).filter(([,d])=>Number.isFinite(d==null?void 0:d.price)).sort((d,g)=>g[1].price-d[1].price)[0])==null?void 0:i[0]),l=s?n[s]:null;return{live:r.live,asOf:r.asOf,channels:n,bestKey:s||"pasar",bestLabel:(l==null?void 0:l.label)||"Pasar",bestPrice:(l==null?void 0:l.price)||o,scope:r.locationScope||"national"}}return{live:!1,asOf:null,bestKey:"pasar",bestLabel:"Pasar",bestPrice:o,scope:"fallback",channels:{pasar:{label:"Pasar",price:o,source:"Fallback estimate"},supermarket:{label:"Supermarket",price:o*1.1,source:"Fallback estimate"},export:{label:"Export ref.",price:o*1.2,source:"Fallback estimate"}}}}function De(){if(document.getElementById("pro-wif-styles"))return;const e=document.createElement("style");e.id="pro-wif-styles",e.textContent=`
    .pro-wif{font-family:Inter,system-ui,sans-serif;background:#f8faf7;color:#17231b;padding:0 0 80px;min-height:100%;}
    .pro-farm-bar{display:flex;align-items:center;gap:8px;padding:10px 16px;background:rgba(255,255,255,.95);border-bottom:1px solid #e5e7eb;overflow-x:auto;flex-wrap:nowrap;}
    .pro-farm-lbl{font-size:10px;font-weight:600;letter-spacing:.08em;color:#64748b;text-transform:uppercase;white-space:nowrap;margin-right:4px;}
    .pro-farm-chip{padding:5px 12px;border-radius:20px;border:1px solid #e5e7eb;background:#f8fafc;font-size:11px;cursor:pointer;white-space:nowrap;color:#475569;transition:all .15s;}
    .pro-farm-chip.active{background:#166534;color:#fff;border-color:#166534;}
    .pro-tabs{display:flex;border-bottom:1px solid #e5e7eb;background:rgba(255,255,255,.92);position:sticky;top:0;z-index:10;box-shadow:0 4px 12px rgba(15,23,42,.05);backdrop-filter:blur(14px);}
    .pro-tab{flex:1;padding:14px 6px 12px;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#64748b;border:none;background:transparent;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px;}
    .pro-tab .pro-tab-ico{font-size:18px;}
    .pro-tab.active{color:#166534;border-bottom-color:#22c55e;background:#ecfdf5;}
    .pro-tab:hover:not(.active){color:#334155;}
    .pro-sec{display:none;padding:16px;}
    .pro-sec.active{display:block;}
    .pro-card{background:#fff;border:1px solid #e5e7eb;border-radius:20px;box-shadow:0 6px 20px rgba(15,23,42,.06);padding:16px;margin-bottom:12px;}
    .pro-card-hd{font-size:9px;font-weight:700;letter-spacing:.16em;color:#64748b;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:6px;}
    .pro-card-hd::before{content:'';display:inline-block;width:3px;height:12px;background:#22c55e;border-radius:2px;}
    .pro-empty{text-align:center;padding:32px 16px;color:#94a3b8;font-size:13px;}
    .pro-empty-ico{font-size:32px;margin-bottom:8px;}
    .pro-horizon-row{display:flex;gap:6px;margin-bottom:14px;}
    .pro-hz-btn{flex:1;padding:7px 4px;border-radius:8px;border:1px solid #e5e7eb;background:#f8fafc;font-size:11px;font-weight:600;cursor:pointer;color:#475569;transition:all .15s;text-align:center;}
    .pro-hz-btn.active{background:#166534;color:#fff;border-color:#166534;}
    .pro-sell-banner{padding:12px 14px;border-radius:12px;background:#ecfdf5;border:1px solid #bbf7d0;margin-bottom:14px;font-size:12px;color:#166534;display:flex;gap:8px;align-items:flex-start;}
    .pro-sell-banner .sb-ico{font-size:18px;flex-shrink:0;}
    .pro-sel{width:100%;padding:9px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#f8fafc;color:#17231b;font-family:inherit;font-size:12px;margin-bottom:10px;}
    .pro-slider-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
    .pro-slider-row label{font-size:10px;color:#64748b;min-width:100px;letter-spacing:.04em;}
    .pro-slider-row input[type=range]{flex:1;accent-color:#22c55e;}
    .pro-slider-val{font-size:12px;font-weight:700;color:#047857;min-width:60px;text-align:right;}
    .pro-input{background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;color:#17231b;font-family:inherit;font-size:12px;padding:9px 12px;width:100%;}
    .pro-input:focus{outline:none;border-color:#22c55e;}
    .pro-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px;margin-bottom:14px;}
    .pro-kpi{background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:12px;text-align:center;}
    .pro-kpi-val{font-size:20px;font-weight:700;color:#047857;}
    .pro-kpi-lbl{font-size:9px;letter-spacing:.08em;color:#64748b;margin-top:3px;text-transform:uppercase;}
    .pro-table{width:100%;border-collapse:collapse;font-size:11px;}
    .pro-table th{color:#64748b;font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:left;font-weight:700;}
    .pro-table td{padding:9px 8px;border-bottom:1px solid #f1f5f9;color:#17231b;}
    .pro-table tr:last-child td{border-bottom:none;}
    .pro-table tr:hover td{background:#f8fafc;}
    .pro-badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:9px;font-weight:700;letter-spacing:.06em;}
    .pro-badge-green{background:#dcfce7;color:#166534;border:1px solid #bbf7d0;}
    .pro-badge-amber{background:#fef9c3;color:#854d0e;border:1px solid #fde68a;}
    .pro-badge-red{background:#fee2e2;color:#991b1b;border:1px solid #fecaca;}
    .pro-badge-blue{background:#dbeafe;color:#1d4ed8;border:1px solid #bfdbfe;}
    .pro-badge-gray{background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;}
    .pro-bar-track{height:5px;background:#f1f5f9;border-radius:3px;overflow:hidden;}
    .pro-bar-fill{height:100%;border-radius:3px;transition:width .5s;}
    .pro-breakdown{display:flex;flex-direction:column;gap:6px;}
    .pro-brow{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:10px;font-size:12px;}
    .pro-brow-income{background:#f0fdf4;border:1px solid #bbf7d0;}
    .pro-brow-expense{background:#fff1f2;border:1px solid #fecdd3;}
    .pro-brow-ai{background:#eff6ff;border:1px solid #bfdbfe;}
    .pro-brow-net{background:#ecfdf5;border:2px solid #22c55e;}
    .pro-brow-lbl{font-size:10px;color:#64748b;}
    .pro-impact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px;}
    .pro-impact-card{border-radius:10px;padding:12px;text-align:center;}
    .pro-impact-card.up{background:#fefce8;border:1px solid #fde68a;}
    .pro-impact-card.down{background:#eff6ff;border:1px solid #bfdbfe;}
    .pro-impact-card.ok{background:#f0fdf4;border:1px solid #bbf7d0;}
    .pro-impact-card.warn{background:#fff1f2;border:1px solid #fecdd3;}
    .pro-impact-icon{font-size:20px;margin-bottom:4px;}
    .pro-impact-name{font-size:9px;letter-spacing:.08em;color:#64748b;text-transform:uppercase;margin-bottom:4px;}
    .pro-impact-val{font-size:15px;font-weight:700;}
    .pro-impact-val.up{color:#854d0e;}
    .pro-impact-val.down{color:#1d4ed8;}
    .pro-impact-val.ok{color:#166534;}
    .pro-impact-val.warn{color:#991b1b;}
    .pro-eco-summary{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:12px 14px;margin-top:12px;}
    .pro-eco-title{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#166534;margin-bottom:8px;}
    .pro-eco-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(82px,1fr));gap:6px;}
    .pro-eco-item{text-align:center;}
    .pro-eco-val{font-size:15px;font-weight:700;color:#047857;}
    .pro-eco-lbl{font-size:9px;color:#64748b;margin-top:2px;text-transform:uppercase;letter-spacing:.06em;}
    .pro-qty-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
    .pro-qty-row label{font-size:10px;color:#64748b;min-width:80px;letter-spacing:.04em;}
    .pro-qty-ctrl{display:flex;align-items:center;gap:8px;}
    .pro-qty-btn{width:28px;height:28px;border:1px solid #e5e7eb;border-radius:6px;background:#f8fafc;color:#17231b;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
    .pro-qty-btn:hover{border-color:#22c55e;color:#166534;}
    .pro-qty-num{width:40px;text-align:center;font-size:14px;font-weight:700;color:#047857;}
    .pro-search-wrap{position:relative;margin-bottom:10px;}
    .pro-search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:14px;}
    .pro-suggest-list{background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:10px;}
    .pro-suggest-item{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;font-size:12px;transition:background .1s;color:#17231b;}
    .pro-suggest-item:hover,.pro-suggest-item.selected{background:#f0fdf4;color:#166534;}
    .pro-suggest-item .sp-ico{font-size:18px;}
    .pro-zone-row{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#f8fafc;border-radius:10px;margin-bottom:6px;border:1px solid #e5e7eb;}
    .pro-zone-id{width:28px;height:28px;border-radius:6px;background:#dcfce7;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#166534;flex-shrink:0;}
    .pro-zone-info{flex:1;}
    .pro-zone-name{font-size:12px;font-weight:700;color:#17231b;}
    .pro-zone-meta{font-size:10px;color:#64748b;margin-top:2px;}
    .pro-zone-meter{margin-top:5px;}
    .pro-ai-note{background:#ecfdf5;border-left:3px solid #22c55e;border-radius:0 10px 10px 0;padding:10px 14px;font-size:11px;color:#166534;margin-top:12px;display:flex;gap:8px;align-items:flex-start;line-height:1.5;}
    .pro-ai-note .ai-ico{flex-shrink:0;font-size:16px;}
    .pro-ai-loading{opacity:.6;font-style:italic;}
    .pro-hr{border:none;border-top:1px solid #e5e7eb;margin:12px 0;}
    .pro-week-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
    .pro-week-lbl{font-size:9px;letter-spacing:.06em;color:#64748b;min-width:56px;text-transform:uppercase;}
    .pro-week-dots{display:flex;gap:3px;flex:1;}
    .pro-week-dot{width:10px;height:10px;border-radius:2px;background:#e2e8f0;}
    .pro-week-dot.done{background:#22c55e;}
    .pro-week-dot.active{background:#3b82f6;}
    .pro-week-dot.harvest{background:#f59e0b;}
    .pro-meta-source{font-size:9px;color:#94a3b8;margin-top:6px;letter-spacing:.03em;}
    .pro-live-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:8px;}
    .pro-live-tile{background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:10px;text-align:center;}
    .pro-live-val{font-size:16px;font-weight:700;color:#047857;}
    .pro-live-lbl{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-top:3px;}
    .pro-source-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}
    .pro-source-link{font-size:10px;color:#1d4ed8;text-decoration:none;background:#eff6ff;border:1px solid #bfdbfe;border-radius:999px;padding:4px 8px;}
    .pro-market-status{font-size:11px;color:#64748b;margin-bottom:10px;line-height:1.45;}
    .pro-market-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;}
    .pro-market-card{background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:12px;}
    .pro-market-title{display:flex;justify-content:space-between;gap:8px;font-size:12px;font-weight:700;color:#17231b;margin-bottom:8px;}
    .pro-market-prices{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
    .pro-market-price{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:8px;text-align:center;}
    .pro-market-price.best{border-color:#22c55e;background:#f0fdf4;}
    .pro-market-price .lbl{font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;}
    .pro-market-price .val{font-size:12px;font-weight:800;color:#047857;margin-top:2px;}
    .pro-best-plant{background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:12px 14px;margin-bottom:12px;color:#9a3412;font-size:12px;line-height:1.5;}
    .pro-horizon-sticky{position:sticky;top:72px;z-index:9;background:rgba(255,255,255,.96);border-bottom:1px solid #e5e7eb;margin:-16px -16px 12px;padding:10px 16px;backdrop-filter:blur(14px);}
    .pro-plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;}
    .pro-plan-item{background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:12px;}
    .pro-plan-val{font-size:18px;font-weight:800;color:#047857;}
    .pro-plan-lbl{font-size:9px;letter-spacing:.07em;color:#64748b;text-transform:uppercase;margin-top:3px;}
    .pro-ai-inline{background:#f8fafc;border:1px solid #e5e7eb;border-left:3px solid #22c55e;border-radius:0 10px 10px 0;padding:10px 12px;font-size:11px;color:#166534;line-height:1.5;margin:10px 0 12px;}
    .pro-ai-inline.warn{background:#fff7ed;border-color:#fed7aa;border-left-color:#f97316;color:#9a3412;}
    .pro-ai-inline.bad{background:#fff1f2;border-color:#fecdd3;border-left-color:#ef4444;color:#991b1b;}
    .pro-ai-calc{margin-top:10px;padding-top:10px;border-top:1px solid rgba(15,23,42,.12);color:#334155;}
    .pro-ai-calc-title{font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#047857;margin-bottom:6px;}
    .pro-ai-calc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:6px;margin-bottom:6px;}
    .pro-ai-calc-item{background:rgba(255,255,255,.72);border:1px solid rgba(15,23,42,.08);border-radius:8px;padding:7px 8px;}
    .pro-ai-calc-val{font-size:12px;font-weight:800;color:#17231b;}
    .pro-ai-calc-lbl{font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-top:2px;}
    .pro-ai-calc-formula{font-size:10px;color:#64748b;line-height:1.4;}
    .pro-ai-calc-formula a{color:#1d4ed8;text-decoration:none;font-weight:700;}
    .pro-hidden{display:none!important;}
  `,document.head.appendChild(e)}function Be(){return De(),`
    <div class="pro-wif">

      <!-- MULTI-FARM SELECTOR -->
      <div class="pro-farm-bar" id="pro-farm-bar">
        <span class="pro-farm-lbl">Farm</span>
        <div id="pro-farm-chips"></div>
      </div>

      <div class="pro-tabs">
        <button class="pro-tab active" data-pro-tab="forecast">
          <span class="pro-tab-ico">📊</span>HARVEST<br>FORECAST
        </button>
        <button class="pro-tab" data-pro-tab="newplant">
          <span class="pro-tab-ico">➕</span>NEW PLANT<br>PROFIT
        </button>
      </div>

      <!-- ═══════════════════════════════════════
           TAB 1: HARVEST FORECAST
      ═══════════════════════════════════════ -->
      <div id="pro-forecast" class="pro-sec active">

        <div class="pro-horizon-sticky">
          <div class="pro-horizon-row">
            <button class="pro-hz-btn active" data-hz="30">30 days</button>
            <button class="pro-hz-btn" data-hz="60">60 days</button>
            <button class="pro-hz-btn" data-hz="90">90 days</button>
            <button class="pro-hz-btn" data-hz="custom">Custom</button>
          </div>
          <div id="pro-custom-slider" style="display:none;">
            <div class="pro-slider-row">
              <label>Days ahead</label>
              <input type="range" min="7" max="180" value="30" step="1" id="pro-sl-days">
              <span class="pro-slider-val" id="pro-v-days">30 days</span>
            </div>
          </div>
          <div id="pro-sell-banner" class="pro-sell-banner" style="display:none;">
            <span class="sb-ico">💡</span>
            <span id="pro-sell-text"></span>
          </div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Live farm inputs</div>
          <div class="pro-live-grid" id="pro-live-inputs"></div>
          <div class="pro-meta-source" id="pro-live-source">Loading Firebase sensor snapshot…</div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Summary KPIs</div>
          <div class="pro-kpi-grid">
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-rows">—</div><div class="pro-kpi-lbl">Rows ready</div></div>
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-kg">—</div><div class="pro-kpi-lbl">Total yield</div></div>
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-rev">—</div><div class="pro-kpi-lbl">Est. revenue</div></div>
            <div class="pro-kpi"><div class="pro-kpi-val" id="pro-kpi-people">—</div><div class="pro-kpi-lbl">People needed</div></div>
          </div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Production over time</div>
          <div style="position:relative;height:190px;">
            <canvas id="pro-production-chart"></canvas>
          </div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Logistics &amp; people planning</div>
          <div class="pro-plan-grid" id="pro-hr-plan"></div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Current market price comparison</div>
          <div class="pro-market-status" id="pro-market-status">Loading online market prices…</div>
          <div class="pro-market-grid" id="pro-market-grid"></div>
          <div class="pro-source-row" id="pro-market-sources"></div>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Crop-by-crop forecast</div>
          <div id="pro-forecast-empty" class="pro-empty" style="display:none;">
            <div class="pro-empty-ico">🌱</div>
            No crops planted yet. Go to your farm and add some plants first.
          </div>
          <table class="pro-table" id="pro-forecast-table">
            <thead><tr><th>Crop</th><th>Rows</th><th>Yield</th><th>Best price</th><th>Revenue</th><th>Status</th></tr></thead>
            <tbody id="pro-forecast-rows"></tbody>
          </table>
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Harvest readiness timeline</div>
          <div id="pro-tl-bars"></div>
        </div>

      </div>

      <!-- ═══════════════════════════════════════
           TAB 2: NEW PLANT PROFIT
      ═══════════════════════════════════════ -->
      <div id="pro-newplant" class="pro-sec">

        <div class="pro-card" style="background:#fff7ed;border-color:#fed7aa;">
          <div style="font-size:15px;font-weight:800;color:#9a3412;">Maximized yields. Optimized profits.</div>
          <div style="font-size:11px;color:#9a3412;margin-top:4px;">Test species, rows, space, resource expansion, cost and future profit before planting.</div>
        </div>

        <div class="pro-best-plant" id="pro-best-plant-banner">
          Calculating the most profitable crop to plant now…
        </div>

        <div class="pro-card">
          <div class="pro-card-hd">Species search</div>
          <div class="pro-search-wrap">
            <span class="pro-search-ico">🔍</span>
            <input class="pro-input" id="pro-np-search" placeholder="Type any species name…" style="padding-left:32px;">
          </div>
          <div class="pro-suggest-list" id="pro-np-suggestions"></div>
          <div class="pro-ai-inline" id="pro-np-ai-box">
            <span id="pro-np-ai" class="pro-ai-loading">Choose or type a species to run suitability analysis.</span>
          </div>
          <div class="pro-qty-row">
            <label>Plant rows</label>
            <div class="pro-qty-ctrl">
              <button class="pro-qty-btn" id="pro-qty-dec">−</button>
              <span class="pro-qty-num" id="pro-qty-disp">10</span>
              <button class="pro-qty-btn" id="pro-qty-inc">+</button>
            </div>
          </div>
        </div>

        <div class="pro-card" id="pro-readiness-card">
          <div class="pro-card-hd">Planting readiness</div>
          <div id="pro-readiness-block"></div>
          <div class="pro-card-hd" style="margin-top:14px;">Zone utilisation</div>
          <div id="pro-zone-list"></div>
        </div>

        <div class="pro-card" id="pro-impact-card">
          <div class="pro-card-hd">Predicted resource delta</div>
          <div class="pro-impact-grid" id="pro-impact-grid"></div>

          <!-- Economic impact summary -->
          <div class="pro-eco-summary" id="pro-eco-summary">
            <div class="pro-eco-title">Economic impact of adding these rows</div>
            <div class="pro-eco-grid">
              <div class="pro-eco-item">
                <div class="pro-eco-val" id="pro-eco-yield">—</div>
                <div class="pro-eco-lbl">Est. yield (kg)</div>
              </div>
              <div class="pro-eco-item">
                <div class="pro-eco-val" id="pro-eco-value">—</div>
                <div class="pro-eco-lbl">Market value</div>
              </div>
              <div class="pro-eco-item">
                <div class="pro-eco-val" id="pro-eco-cost">—</div>
                <div class="pro-eco-lbl">Extra cost/mo</div>
              </div>
              <div class="pro-eco-item">
                <div class="pro-eco-val" id="pro-eco-profit">—</div>
                <div class="pro-eco-lbl">Est. profit</div>
              </div>
              <div class="pro-eco-item">
                <div class="pro-eco-val" id="pro-eco-harvest-date">—</div>
                <div class="pro-eco-lbl">Sell window</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `}function Te(){var t;T=null,h=10,_=k[0],oe=[...k],V={},Y=[...U],P={loading:!0,error:null,generatedAt:null},y=Z(),G="",z=null,j=!1,R=ze(),K=0;const e=((t=x.currentFarm)==null?void 0:t.id)||x.currentFarmId;if(e){const r=R.findIndex(o=>o.id===e);r>=0&&(K=r)}ae(),ie(),je(),He(),Ge(),C(),ke(),X(),J(),H(),L(),_e()}function ae(){const e=A(R);N=Fe(e)}async function _e(){const e=await Ie();if(e.length){const t=xe();R=ve(e,R);const r=R.findIndex(o=>o.id===t);r>=0&&(K=r),ae(),ie()}await he(),await we()}async function he(){y=await ye(A(R)),ke(),C(),L()}async function we(){var n;const e=[...N,...k].map(s=>I(s.id||s.name)).filter(Boolean),t=[...new Set(e)];if(!t.length)return;const r=A(R)||{},o=new URLSearchParams({crops:t.join(",")}),a=r.state||r.negeri||r.location||"",i=r.district||r.daerah||"";a&&o.set("state",a),i&&o.set("district",i),P={loading:!0,error:null,generatedAt:null},X();try{const s=await fetch(`${te}/api/whatif/market-prices?${o}`);if(!s.ok)throw new Error("market HTTP "+s.status);const l=await s.json();V=l.prices||{},Y=(n=l.sources)!=null&&n.length?l.sources:U,P={loading:!1,error:null,generatedAt:l.generatedAt,pricecatcherMonth:l.pricecatcherMonth}}catch(s){console.warn("[WhatIfPro] Market price load failed:",s),V={},Y=[...U],P={loading:!1,error:s.message,generatedAt:null}}X(),J(),C(),H(),L()}function ke(){const e=document.getElementById("pro-live-inputs"),t=document.getElementById("pro-live-source");if(!e)return;const r=y||Z(),o=[{label:"Temp",value:`${Number(r.temp).toFixed(1)}°C`},{label:"Humidity",value:`${Number(r.humid).toFixed(0)}%`},{label:"Light",value:`${Number(r.light).toFixed(0)}`},{label:"Water",value:`${Number(r.water).toFixed(0)}`},{label:"Nutrient",value:`${Number(r.nutrient).toFixed(1)}`},{label:"Yield factor",value:`${(Q(r)*100).toFixed(0)}%`}];if(e.innerHTML=o.map(a=>`
    <div class="pro-live-tile">
      <div class="pro-live-val">${c(a.value)}</div>
      <div class="pro-live-lbl">${c(a.label)}</div>
    </div>`).join(""),t){const a=r.createdAt?` · ${new Date(r.createdAt).toLocaleString()}`:"";t.textContent=`${r.source||"Firebase Cloud Firestore sensorReadings"}${a}`}}function X(){const e=document.getElementById("pro-market-status"),t=document.getElementById("pro-market-grid"),r=document.getElementById("pro-market-sources");if(!e||!t||!r)return;if(P.loading)e.textContent="Fetching live pasar, supermarket, and export references from online public sources…";else if(P.error)e.textContent=`Online price fetch failed (${P.error}). Showing clearly labeled fallback estimates until the backend can reach the sources.`;else{const a=P.generatedAt?new Date(P.generatedAt).toLocaleString():"latest available";e.textContent=`Live market data refreshed ${a}. PriceCatcher month: ${P.pricecatcherMonth||"latest available"}.`}const o=N.length?N:k.slice(0,6);t.innerHTML=o.map(a=>{const i=S(a),n=[["pasar","Pasar"],["supermarket","Supermarket"],["export","Export"]];return`
      <div class="pro-market-card">
        <div class="pro-market-title">
          <span>${a.icon||"🌱"} ${c(a.name)}</span>
          <span class="pro-badge ${i.live?"pro-badge-green":"pro-badge-gray"}">${i.live?"LIVE":"EST."}</span>
        </div>
        <div class="pro-market-prices">
          ${n.map(([s,l])=>{const d=i.channels[s]||{};return`
              <div class="pro-market-price ${s===i.bestKey?"best":""}" title="${c(d.source||"")}">
                <div class="lbl">${c(l)}</div>
                <div class="val">${$(d.price,2)}</div>
              </div>`}).join("")}
        </div>
        <div style="font-size:9px;color:#64748b;margin-top:8px;">
          Best: ${c(i.bestLabel)} · ${c(i.scope)}${i.asOf?" · "+c(i.asOf):""}
        </div>
      </div>`}).join(""),r.innerHTML=Y.map(a=>`
    <a class="pro-source-link" href="${c(a.url)}" target="_blank" rel="noopener noreferrer" title="${c(a.note||"")}">
      ${c(a.label)}
    </a>`).join("")}function Ne(){const e=Q();return k.map(r=>{const o=S(r),a=90/Math.max(1,r.growDays),i=r.yieldKgPerRow*e*o.bestPrice*a,n=90/7,s=r.waterLpR/1e3*W.waterRM*n+r.fertMLpR*W.fertRM*n;return{sp:r,market:o,profit90:i-s}}).sort((r,o)=>o.profit90-r.profit90)[0]||null}function J(){const e=document.getElementById("pro-best-plant-banner");if(!e)return;const t=Ne();if(!t){e.textContent="Plant recommendation unavailable until crop and market data loads.";return}e.innerHTML=`
    <strong>Most profitable to plant now:</strong>
    ${t.sp.icon} ${c(t.sp.name)}
    at ${$(t.market.bestPrice,2)}/kg via ${c(t.market.bestLabel)}.
    Estimated ${$(t.profit90,0)} profit per row over 90 days after live sensor adjustment.
  `}function Re(e){const t=String(e||"").trim(),r=I(t),o=t.replace(/\b\w/g,a=>a.toUpperCase())||"Custom Species";return{id:r,name:o,icon:"🌱",growDays:60,pricePerKg:S({id:r,name:o}).bestPrice||5,yieldKgPerRow:4,waterLpR:20,fertMLpR:120,temp:"+0.5",hum:"+3",ph:"0",light:"+1h",fert:"+8%",dir:["ok","up","ok","up","up"],custom:!0}}function Pe(e){_=e||k[0],z=null,j=!1,G=""}function ie(){const e=document.getElementById("pro-farm-chips");if(e){if(!R.length){e.innerHTML='<span style="font-size:11px;color:#94a3b8;">No farms found</span>';return}e.innerHTML=R.map((t,r)=>`
    <button class="pro-farm-chip ${r===K?"active":""}" data-farm-idx="${r}">
      ${c(t.name||t.id||"Farm "+(r+1))}
    </button>`).join(""),e.querySelectorAll(".pro-farm-chip").forEach(t=>{t.addEventListener("click",()=>{K=parseInt(t.getAttribute("data-farm-idx"));const r=R[K];r&&(x.currentFarm=r,x.currentFarmId=r.id||x.currentFarmId),ae(),ie(),C(),L(),he(),we()})})}}function je(){document.querySelectorAll(".pro-tab[data-pro-tab]").forEach(e=>{e.addEventListener("click",()=>{var r;const t=e.getAttribute("data-pro-tab");document.querySelectorAll(".pro-sec").forEach(o=>o.classList.remove("active")),document.querySelectorAll(".pro-tab").forEach(o=>o.classList.remove("active")),(r=document.getElementById("pro-"+t))==null||r.classList.add("active"),e.classList.add("active"),t==="newplant"&&J()})})}function He(){var e;document.querySelectorAll(".pro-hz-btn").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".pro-hz-btn").forEach(a=>a.classList.remove("active")),t.classList.add("active");const r=t.getAttribute("data-hz"),o=document.getElementById("pro-custom-slider");r==="custom"?o.style.display="block":(o.style.display="none",document.getElementById("pro-sl-days").value=r,document.getElementById("pro-v-days").textContent=r+" days"),C()})}),(e=document.getElementById("pro-sl-days"))==null||e.addEventListener("input",()=>{const t=document.getElementById("pro-sl-days").value;document.getElementById("pro-v-days").textContent=t+" days",C()})}function qe(){var r;const e=document.querySelector(".pro-hz-btn.active"),t=e==null?void 0:e.getAttribute("data-hz");return parseInt(t==="custom"?((r=document.getElementById("pro-sl-days"))==null?void 0:r.value)||30:t||30)}function Oe(e,t){var n;const r=e.filter(s=>s.isReady);if(!r.length)return null;const o=r.reduce((s,l)=>s.rev>l.rev?s:l),a=o.c.growDays,i=((n=o.market)==null?void 0:n.bestLabel)||"best market channel";return o.cyclesDone>=2?`Best sell window: sell ${o.c.name} at day ${a} through ${i}. At the current linked price (${$(o.market.bestPrice,2)}/kg), waiting past the first complete cycle adds freshness risk without a better price signal.`:`${o.c.name} is the best sale in this ${t}-day view: sell at day ${a} through ${i}, projected revenue ${$(o.rev,0)} at ${$(o.market.bestPrice,2)}/kg.`}function We(e,t,r){return Array.from({length:t},(o,a)=>{const i=a+1;let n=0,s=0;return e.forEach(l=>{const d=Math.floor(i/l.growDays),g=Math.floor((i-1)/l.growDays),b=l.yieldKgPerRow*r;n+=d*b,d>g&&(s+=(d-g)*b)}),{day:i,cumulativeKg:Number(n.toFixed(2)),dailyKg:Number(s.toFixed(2))}})}function Ue(e,t,r){if(!e||e<=0)return{people:0,pickers:0,packers:0,logistics:0,peakKg:0,peakDay:null,note:"No harvest is ready inside this horizon."};const o=r.reduce((s,l)=>l.dailyKg>s.dailyKg?l:s,r[0]||{day:0,dailyKg:0}),a=Math.max(1,Math.ceil(o.dailyKg/80)),i=Math.max(1,Math.ceil(o.dailyKg/60)),n=Math.max(1,Math.ceil(o.dailyKg/180));return{people:a+i+n,pickers:a,packers:i,logistics:n,peakKg:o.dailyKg,peakDay:o.day,note:`${Math.round(t)} rows ready in this horizon. Staffing is based on the peak harvest day, not the whole period.`}}function Ve(e){const t=document.getElementById("pro-hr-plan");t&&(t.innerHTML=[{val:e.people,label:"Total people"},{val:e.pickers,label:"Pickers"},{val:e.packers,label:"Packers"},{val:e.logistics,label:"Pickup/logistics"},{val:e.peakKg?e.peakKg.toFixed(1)+" kg":"—",label:e.peakDay?`Peak day ${e.peakDay}`:"Peak harvest"}].map(r=>`
    <div class="pro-plan-item">
      <div class="pro-plan-val">${c(r.val)}</div>
      <div class="pro-plan-lbl">${c(r.label)}</div>
    </div>`).join("")+`
    <div style="grid-column:1/-1;font-size:10px;color:#64748b;line-height:1.45;">
      ${c(e.note)} Assumption: 1 picker handles ~80 kg/day, 1 packer ~60 kg/day, 1 logistics person ~180 kg/day.
    </div>`)}function C(){const e=qe(),t=N,r=!t.length;document.getElementById("pro-forecast-empty").style.display=r?"block":"none",document.getElementById("pro-forecast-table").style.display=r?"none":"table";const o=Q(),a=We(t,e,o);let i=0,n=0,s=0;const l=t.map(p=>{const u=Math.floor(e/p.growDays),w=(e%p.growDays/p.growDays*100).toFixed(0),f=e>=p.growDays,M=f?Math.max(p.slots||1,u*(p.slots||1)):0,D=S(p),F=f?u*p.yieldKgPerRow*o:0,q=F*D.bestPrice;return f&&(i+=M,n+=F,s+=q),{c:p,rowCount:M,kg:F,rev:q,isReady:f,cyclesDone:u,partialPct:w,market:D}});document.getElementById("pro-kpi-rows").textContent=i,document.getElementById("pro-kpi-kg").textContent=n.toFixed(0)+" kg",document.getElementById("pro-kpi-rev").textContent="RM "+s.toFixed(0);const d=Ue(n,i,a);document.getElementById("pro-kpi-people").textContent=d.people,Ve(d),Ye(a);const g=Oe(l,e),b=document.getElementById("pro-sell-banner"),v=document.getElementById("pro-sell-text");g&&b&&v?(b.style.display="flex",v.textContent=g):b&&(b.style.display="none"),document.getElementById("pro-forecast-rows").innerHTML=l.map(p=>{let u;if(!p.isReady)u=`<span class="pro-badge pro-badge-amber">${p.partialPct}% grown</span>`;else{const w=e-p.c.growDays;w<=3?u='<span class="pro-badge pro-badge-green">✅ Ready</span>':w<=10?u=`<span class="pro-badge pro-badge-green">🌟 Ripe ×${p.cyclesDone}</span>`:w<=20?u='<span class="pro-badge pro-badge-amber">⚠ Overripe</span>':u='<span class="pro-badge pro-badge-red">🔴 Rotting</span>'}return`
      <tr>
        <td>${p.c.icon} ${p.c.name}</td>
        <td style="font-weight:700;color:#047857;">${p.isReady?p.rowCount:"—"}</td>
        <td>${p.isReady?p.kg.toFixed(1)+" kg":"—"}</td>
        <td>${p.isReady?`${$(p.market.bestPrice,2)}/kg <span style="font-size:9px;color:#64748b;">${c(p.market.bestLabel)}</span>`:"—"}</td>
        <td>${p.isReady?'<span style="color:#166534;font-weight:700;">RM '+p.rev.toFixed(0)+"</span>":"—"}</td>
        <td>${u}</td>
      </tr>`}).join(""),document.getElementById("pro-tl-bars").innerHTML=l.map(p=>{const u=Math.min(100,e/p.c.growDays*100),w=e-p.c.growDays,f=p.isReady?w<=10?"#22c55e":w<=20?"#f59e0b":"#ef4444":"#f59e0b";return`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="font-size:11px;min-width:90px;color:#64748b;">${p.c.icon} ${p.c.name}</span>
        <div class="pro-bar-track" style="flex:1;">
          <div class="pro-bar-fill" style="width:${u.toFixed(0)}%;background:${f};"></div>
        </div>
        <span style="font-size:10px;min-width:54px;text-align:right;color:#64748b;">
          Day ${p.c.growDays}
        </span>
      </div>`}).join("")}function Ye(e){const t=document.getElementById("pro-production-chart");if(!t)return;const r=()=>{T&&(T.destroy(),T=null);const o=e.map(i=>"D"+i.day),a=Math.max(1,Math.ceil(o.length/8));T=new Chart(t,{type:"line",data:{labels:o,datasets:[{label:"Cumulative production (kg)",data:e.map(i=>i.cumulativeKg),borderColor:"#047857",backgroundColor:"rgba(34,197,94,.14)",borderWidth:2,fill:!0,tension:.25,pointRadius:e.map(i=>i.dailyKg>0?3:0),pointBackgroundColor:"#f59e0b"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,ticks:{callback:i=>i+" kg",color:"#64748b",font:{size:10}},grid:{color:"#f1f5f9"}},x:{ticks:{color:"#64748b",font:{size:10},callback:function(i,n){return n%a===0?this.getLabelForValue(i):""}},grid:{display:!1}}}}})};if(typeof Chart>"u"){const o=document.createElement("script");o.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",o.onload=r,document.head.appendChild(o)}else r()}function Ge(){var e,t,r,o;(e=document.getElementById("pro-np-search"))==null||e.addEventListener("input",()=>{const a=(document.getElementById("pro-np-search").value||"").toLowerCase().trim();oe=a?k.filter(i=>i.name.toLowerCase().includes(a)||i.id.includes(a)):[...k],H()}),(t=document.getElementById("pro-np-search"))==null||t.addEventListener("keydown",a=>{if(a.key!=="Enter")return;const i=document.getElementById("pro-np-search").value||"",n=i.toLowerCase().trim();n&&(Pe(k.find(s=>s.name.toLowerCase()===n||s.id===n)||Re(i)),H(),L())}),(r=document.getElementById("pro-qty-dec"))==null||r.addEventListener("click",()=>{h=Math.max(1,h-5),document.getElementById("pro-qty-disp").textContent=h,L()}),(o=document.getElementById("pro-qty-inc"))==null||o.addEventListener("click",()=>{h=Math.min(500,h+5),document.getElementById("pro-qty-disp").textContent=h,L()})}function H(){var i;const e=document.getElementById("pro-np-suggestions");if(!e)return;const t=((i=document.getElementById("pro-np-search"))==null?void 0:i.value)||"",r=t.toLowerCase().trim(),o=r&&!k.some(n=>n.name.toLowerCase()===r||n.id===r),a=oe.slice(0,o?7:8);e.innerHTML=a.map(n=>{const s=S(n);return`
    <div class="pro-suggest-item ${n.id===_.id?"selected":""}" data-np-id="${n.id}">
      <span class="sp-ico">${n.icon}</span>
      <span>${n.name}</span>
      <span style="margin-left:auto;font-size:9px;color:#94a3b8;">${n.growDays}d · ${$(s.bestPrice,1)}/kg</span>
    </div>`}).join("")+(o?`
    <div class="pro-suggest-item ${_.id===I(t)?"selected":""}" data-np-custom="${c(t)}">
      <span class="sp-ico">🌱</span>
      <span>Analyze "${c(t)}" with AI</span>
      <span style="margin-left:auto;font-size:9px;color:#94a3b8;">any species</span>
    </div>`:""),e.querySelectorAll(".pro-suggest-item").forEach(n=>{n.addEventListener("click",()=>{const s=n.getAttribute("data-np-custom");Pe(s?Re(s):k.find(l=>l.id===n.getAttribute("data-np-id"))||k[0]),H(),L()})})}function ee(e){var r,o;const t=j&&(z==null?void 0:z.species)===e.id;(r=document.getElementById("pro-readiness-card"))==null||r.classList.toggle("pro-hidden",t),(o=document.getElementById("pro-impact-card"))==null||o.classList.toggle("pro-hidden",t)}function Ze(e=[]){return`
    <div class="pro-source-row" style="margin-top:8px;">
      ${e.map(t=>`
        <a class="pro-source-link" href="${c(t.url)}" target="_blank" rel="noopener noreferrer">
          ${c(t.label)}
        </a>`).join("")}
    </div>`}function Qe(e){const t=e==null?void 0:e.calculation,r=e==null?void 0:e.moisture;if(!t||!r)return"";const o=r.unit||"%",a=Number(t.adjustmentPctPoints||0),i=o==="%"?"percentage points":`${o} points`,n=Math.abs(a)<.05?`0 ${i}`:`${a>0?"+":""}${a.toFixed(1)} ${i}`,s=(e.sources||[]).slice(0,3);return`
    <div class="pro-ai-calc">
      <div class="pro-ai-calc-title">Advisor calculation</div>
      <div class="pro-ai-calc-grid">
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${c(t.currentMoisture)}${o}</div>
          <div class="pro-ai-calc-lbl">Current</div>
        </div>
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${c(t.idealMoistureMin)}-${c(t.idealMoistureMax)}${o}</div>
          <div class="pro-ai-calc-lbl">Crop ideal</div>
        </div>
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${c(t.targetMoisture)}${o}</div>
          <div class="pro-ai-calc-lbl">Target</div>
        </div>
        <div class="pro-ai-calc-item">
          <div class="pro-ai-calc-val">${c(n)}</div>
          <div class="pro-ai-calc-lbl">Adjustment</div>
        </div>
      </div>
      <div class="pro-ai-calc-formula">
        ${c(t.moistureFormula)}. Source: ${c(t.moistureSource||"sensor snapshot")}.
        ${s.length?`<div class="pro-source-row" style="margin-top:7px;">${s.map(l=>`
          <a class="pro-source-link" href="${c(l.url)}" target="_blank" rel="noopener noreferrer">${c(l.label)}</a>
        `).join("")}</div>`:""}
      </div>
    </div>`}function L(){var me;const e=_,t=A(R),r=Ce(t),o=r.reduce((m,E)=>m+(E.availableRows||0),0),a=r.length>0&&o<=0,i=o>=h,n=((me=r.filter(m=>m.harvIn>0).sort((m,E)=>m.harvIn-E.harvIn)[0])==null?void 0:me.harvIn)||e.growDays,s=S(e),l=Q();J(),ee(e);const d=document.getElementById("pro-readiness-block");d&&(a?d.innerHTML=`
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#fff1f2;border:1px solid #fecdd3;border-radius:10px;margin-bottom:12px;">
          <span style="font-size:24px;">⚠️</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:#991b1b;">No space available</div>
            <div style="font-size:11px;color:#64748b;margin-top:3px;">All layout zones are full. Earliest space is estimated in ${n} days after harvest.</div>
          </div>
        </div>`:d.innerHTML=`
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:${i?"#eff6ff":"#fff7ed"};border:1px solid ${i?"#bfdbfe":"#fed7aa"};border-radius:10px;margin-bottom:12px;">
          <span style="font-size:28px;">${e.icon}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:${i?"#1d4ed8":"#9a3412"};">
              ${i?`Ready to plant ${h} rows of ${e.name}`:`Only ${o} rows free now`}
            </div>
            <div style="font-size:10px;color:#64748b;margin-top:3px;">
              ${i?`You can plant up to ${o} rows now.`:`Plant ${Math.min(h,o)} rows now, or wait ~${n} days for more space.`}
              Harvest in ~${e.growDays} days · ${$(s.bestPrice,2)}/kg via ${c(s.bestLabel)}
            </div>
          </div>
        </div>`);const g=document.getElementById("pro-zone-list");g&&(r.length?g.innerHTML=r.map(m=>{const E=m.fill>=90?"pro-badge-red":m.fill>=75?"pro-badge-amber":"pro-badge-green",B=m.fill>=90?"FULL":m.fill>=75?"NEAR FULL":"AVAILABLE",O=m.fill>=90?"#ef4444":m.fill>=75?"#f59e0b":"#22c55e";return`
          <div class="pro-zone-row">
            <div class="pro-zone-id">${m.id}</div>
            <div class="pro-zone-info">
              <div class="pro-zone-name">${m.emoji} ${m.crop} <span style="font-size:10px;color:#94a3b8;">· ${m.rows}/${m.capacity} rows</span></div>
              <div class="pro-zone-meta">${m.availableRows} rows free · ${m.harvIn?`est. harvest in ${m.harvIn} days`:"empty now"}</div>
              <div class="pro-zone-meter">
                <div class="pro-bar-track">
                  <div class="pro-bar-fill" style="width:${m.fill}%;background:${O};"></div>
                </div>
              </div>
            </div>
            <span class="pro-badge ${E}" style="margin-left:8px;">${B} ${m.fill}%</span>
          </div>`}).join(""):g.innerHTML='<div style="font-size:12px;color:#94a3b8;padding:8px 0;">No zone data — select a farm first.</div>');const b=h/10,v={up:"▲",down:"▼",ok:"●",warn:"⚠"},p=[{name:"Temperature",icon:"🌡️",unit:"°C",raw:e.temp},{name:"Humidity",icon:"💧",unit:"%",raw:e.hum},{name:"pH Level",icon:"⚗️",unit:"",raw:e.ph},{name:"Light",icon:"☀️",unit:"",raw:e.light},{name:"Fertilizer",icon:"🧪",unit:"",raw:e.fert}],u=document.getElementById("pro-impact-grid");u&&(u.innerHTML=p.map((m,E)=>{const B=e.dir[E],O=parseFloat(m.raw);let ue=m.raw==="0"?"No Δ":m.raw;if(!isNaN(O)&&m.raw!=="0"){const ge=O*b;ue=(ge>0?"+":"")+ge.toFixed(1).replace(/\.0$/,"")+m.unit}return`
      <div class="pro-impact-card ${B}">
        <div class="pro-impact-icon">${m.icon}</div>
        <div class="pro-impact-name">${m.name}</div>
        <div class="pro-impact-val ${B}">${v[B]} ${ue}</div>
      </div>`}).join(""));const f=(e.yieldKgPerRow*h*3*l).toFixed(1),M=(parseFloat(f)*s.bestPrice).toFixed(0),D=4.33,F=(h*e.waterLpR/1e3*W.waterRM*D+h*e.fertMLpR*W.fertRM*D).toFixed(2),q=parseFloat(F)*(e.growDays/30),$e=parseFloat(M)-q,Le=new Date(Date.now()+e.growDays*24*60*60*1e3),ne=document.getElementById("pro-eco-yield"),se=document.getElementById("pro-eco-value"),le=document.getElementById("pro-eco-cost"),pe=document.getElementById("pro-eco-profit"),de=document.getElementById("pro-eco-harvest-date");ne&&(ne.textContent=f+" kg"),se&&(se.textContent="RM "+M),le&&(le.textContent="RM "+F),pe&&(pe.textContent=$($e,0)),de&&(de.textContent=Le.toLocaleDateString(void 0,{month:"short",day:"numeric"}));const ce=`${e.id}|${h}|${xe()||""}|${(y==null?void 0:y.createdAt)||""}|${y==null?void 0:y.temp}|${y==null?void 0:y.humid}|${y==null?void 0:y.water}`;ce!==G&&(G=ce,Je(e,h,r))}async function Je(e,t,r){var s,l,d,g;const o=document.getElementById("pro-np-ai"),a=document.getElementById("pro-np-ai-box");if(!o)return;a&&(a.className="pro-ai-inline"),o.className="pro-ai-loading",o.textContent=`Analysing ${t} rows of ${e.name} against your current farm conditions…`;const i=y||await ye(),n=r.map(b=>`${b.crop} (${b.fill}% full)`).join(", ");try{const b=await fetch(`${te}/api/whatif/newplant`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({species:e.custom?e.name:e.id,quantity:t,currentCrops:n?r.map(f=>f.crop):[],sensors:i})});if(!b.ok)throw new Error("API error "+b.status);const v=await b.json(),p=v.insight||((s=v.analysis)==null?void 0:s.reason)||"",u=!!(v.unsuitable||((l=v.analysis)==null?void 0:l.suitable)===!1);z={species:e.id,data:v},j=u,a&&(a.className=`pro-ai-inline ${u?"bad":(d=v.warnings)!=null&&d.length?"warn":""}`),o.className="";const w=u?"":Qe(v.environmentPlan);o.innerHTML=c(p||"AI analysis complete.")+w+(u&&((g=v.resourceLinks)!=null&&g.length)?Ze(v.resourceLinks):""),ee(e)}catch{z={species:e.id,data:null},j=!1,a&&(a.className="pro-ai-inline warn"),o.className="",o.textContent="AI crop advisor is unavailable. Suitability, source links, and crop-specific ranges require the backend AI profile service.",ee(e)}}function ot(){const e=document.getElementById("screenContainer");e.innerHTML=`
    <div class="screen active" id="whatifProScreen">
      <div style="display:flex;align-items:center;padding:12px 16px;background:#fff;gap:12px;border-bottom:1px solid #e5e7eb;">
        <button id="whatifProBackBtn" class="back-btn" aria-label="Back" style="color:#166534;">←</button>
        <div style="font-weight:700;color:#17231b;">🔮 What-If Pro</div>
      </div>
      <div style="flex:1;overflow-y:auto;">${Be()}</div>
    </div>
  `,document.getElementById("whatifProBackBtn").addEventListener("click",()=>Me("dash-c")),Te()}export{Te as init,Be as render,ot as renderScreen};
