import{A as k,s as ut}from"./index-BwcRKJkh.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const gt={apiKey:"AIzaSyBZzPlnCEvgSx-NEiza0Pcomb9UFhCOtos",authDomain:"nextlevelfarm.firebaseapp.com",projectId:"nextlevelfarm",storageBucket:"nextlevelfarm.firebasestorage.app",messagingSenderId:"326454162545",appId:"1:326454162545:web:0da9418c738f04986f97d0",measurementId:"G-26HSXPSK3H"};function we(e){return new Promise((t,o)=>{if(document.querySelector(`script[src="${e}"]`))return t();const r=document.createElement("script");r.src=e,r.onload=t,r.onerror=o,document.head.appendChild(r)})}async function Ie(){if(window._firebaseReady)return;await we("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"),await we("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"),await we("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js");const e=window.firebase;if(!e)throw new Error("Firebase SDK failed to load");e.apps.length||e.initializeApp(gt),window._firebaseReady=!0}function je(){if(!window.firebase)throw new Error("Firebase is not initialized. Call initFirebase() first.");return window.firebase.firestore()}async function mt(e){return await Ie(),je().collection("users").doc(e)}async function ft(e){try{const o=await(await mt(e)).get();return o.exists?o.data():null}catch(t){return console.warn("[Firebase] loadUserData error:",t),null}}const te=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,W={waterRM:.042,energyRM:1.1,fertRM:.009},le={"2-tier":{tiers:2,slotsPerTier:3,label:"2-Tier Starter Rack"},"3-tier":{tiers:3,slotsPerTier:3,label:"3-Tier Vertical Rack"},"4-tier":{tiers:4,slotsPerTier:4,label:"4-Tier Grow Shelf"},"5-tier":{tiers:5,slotsPerTier:4,label:"5-Tier Tower Rack"},wall:{tiers:4,slotsPerTier:5,label:"Wall Panel Grid"},"a-frame":{tiers:4,slotsPerTier:4,label:"A-Frame Pyramid"},"nft-channel":{tiers:3,slotsPerTier:6,label:"NFT Channel Rows"},hanging:{tiers:5,slotsPerTier:3,label:"Hanging Column Farm"},"commercial-multi-zone":{tiers:1,slotsPerTier:12,label:"Commercial Multi-Zone Farm"}},pe=[{label:"PriceCatcher transactional records",url:"https://data.gov.my/data-catalogue/pricecatcher",note:"Official Malaysia open-data price surveillance records by KPDN/DOSM."},{label:"FAMA Harga Pasaran Terkini",url:"https://www.fama.gov.my/harga-pasaran-terkini",note:"Official FAMA market-price reference."},{label:"Selina Wamucii Malaysia vegetables",url:"https://www.selinawamucii.com/insights/prices/malaysia/vegetables/",note:"Public export and wholesale market references."}],Pe=[{id:"lettuce",name:"Lettuce",icon:"🥬",growDays:45,yieldKgPerRow:4.2,pricePerKg:4.8,waterLpR:18,energyKWhpR:2.1,fertMLpR:120},{id:"tomato",name:"Tomato",icon:"🍅",growDays:70,yieldKgPerRow:8.5,pricePerKg:7.2,waterLpR:34,energyKWhpR:3.8,fertMLpR:220},{id:"basil",name:"Basil",icon:"🌿",growDays:30,yieldKgPerRow:1.8,pricePerKg:12,waterLpR:10,energyKWhpR:1.4,fertMLpR:80},{id:"spinach",name:"Spinach",icon:"🍃",growDays:40,yieldKgPerRow:3.8,pricePerKg:5,waterLpR:16,energyKWhpR:1.9,fertMLpR:100},{id:"chili",name:"Chili",icon:"🌶️",growDays:90,yieldKgPerRow:5,pricePerKg:10,waterLpR:22,energyKWhpR:2.8,fertMLpR:160},{id:"cucumber",name:"Cucumber",icon:"🥒",growDays:60,yieldKgPerRow:7.5,pricePerKg:4.5,waterLpR:30,energyKWhpR:3,fertMLpR:180},{id:"strawberry",name:"Strawberry",icon:"🍓",growDays:90,yieldKgPerRow:6,pricePerKg:12,waterLpR:25,energyKWhpR:2.5,fertMLpR:150},{id:"pepper",name:"Bell Pepper",icon:"🫑",growDays:80,yieldKgPerRow:6.4,pricePerKg:8,waterLpR:24,energyKWhpR:2.6,fertMLpR:155},{id:"mint",name:"Mint",icon:"🌿",growDays:30,yieldKgPerRow:1.6,pricePerKg:15,waterLpR:8,energyKWhpR:1.2,fertMLpR:60},{id:"carrot",name:"Carrot",icon:"🥕",growDays:75,yieldKgPerRow:6,pricePerKg:3.5,waterLpR:22,energyKWhpR:2.4,fertMLpR:140},{id:"eggplant",name:"Eggplant",icon:"🍆",growDays:80,yieldKgPerRow:7.2,pricePerKg:5.5,waterLpR:30,energyKWhpR:3.2,fertMLpR:190},{id:"cabbage",name:"Cabbage",icon:"🥦",growDays:90,yieldKgPerRow:9,pricePerKg:3.2,waterLpR:28,energyKWhpR:2.9,fertMLpR:160},{id:"kangkung",name:"Kangkung",icon:"🌱",growDays:45,yieldKgPerRow:3.5,pricePerKg:3,waterLpR:15,energyKWhpR:1.6,fertMLpR:90},{id:"petai",name:"Petai",icon:"🌱",growDays:45,yieldKgPerRow:3,pricePerKg:6,waterLpR:15,energyKWhpR:1.6,fertMLpR:90}],F=[{id:"spinach",name:"Spinach",icon:"🍃",growDays:40,pricePerKg:5,yieldKgPerRow:3.8,waterLpR:16,fertMLpR:100,temp:"+0.5",hum:"+3",ph:"0",light:"-0.5h",fert:"+8%",dir:["up","up","ok","down","up"]},{id:"mint",name:"Mint",icon:"🌿",growDays:30,pricePerKg:15,yieldKgPerRow:1.6,waterLpR:8,fertMLpR:60,temp:"0",hum:"+5",ph:"-0.2",light:"0",fert:"+5%",dir:["ok","up","down","ok","up"]},{id:"chili",name:"Chili",icon:"🌶️",growDays:90,pricePerKg:10,yieldKgPerRow:5,waterLpR:22,fertMLpR:160,temp:"+1.5",hum:"-4",ph:"+0.3",light:"+2h",fert:"+15%",dir:["warn","down","up","up","warn"]},{id:"cucumber",name:"Cucumber",icon:"🥒",growDays:60,pricePerKg:4.5,yieldKgPerRow:7.5,waterLpR:30,fertMLpR:180,temp:"+1",hum:"+6",ph:"0",light:"+1h",fert:"+12%",dir:["up","up","ok","up","up"]},{id:"strawberry",name:"Strawberry",icon:"🍓",growDays:90,pricePerKg:12,yieldKgPerRow:6,waterLpR:25,fertMLpR:150,temp:"-1",hum:"+2",ph:"-0.4",light:"+1.5h",fert:"+10%",dir:["down","ok","down","up","up"]},{id:"kale",name:"Kale",icon:"🥬",growDays:55,pricePerKg:6,yieldKgPerRow:4,waterLpR:18,fertMLpR:110,temp:"-0.5",hum:"+2",ph:"-0.1",light:"0",fert:"+6%",dir:["down","ok","ok","ok","up"]},{id:"broccoli",name:"Broccoli",icon:"🥦",growDays:70,pricePerKg:7,yieldKgPerRow:5.5,waterLpR:20,fertMLpR:130,temp:"-1",hum:"+3",ph:"-0.2",light:"+0.5h",fert:"+9%",dir:["down","up","down","up","up"]},{id:"celery",name:"Celery",icon:"🌾",growDays:85,pricePerKg:5.5,yieldKgPerRow:4.5,waterLpR:28,fertMLpR:140,temp:"+0.5",hum:"+8",ph:"+0.1",light:"+1h",fert:"+11%",dir:["up","warn","up","up","up"]},{id:"pepper",name:"Bell Pepper",icon:"🫑",growDays:80,pricePerKg:8,yieldKgPerRow:6.4,waterLpR:24,fertMLpR:155,temp:"+1",hum:"-2",ph:"0",light:"+1.5h",fert:"+8%",dir:["up","down","ok","up","up"]},{id:"tomato",name:"Tomato",icon:"🍅",growDays:70,pricePerKg:7.2,yieldKgPerRow:8.5,waterLpR:34,fertMLpR:220,temp:"+1",hum:"+4",ph:"+0.1",light:"+1.5h",fert:"+10%",dir:["up","up","ok","up","up"]},{id:"basil",name:"Basil",icon:"🌿",growDays:30,pricePerKg:12,yieldKgPerRow:1.8,waterLpR:10,fertMLpR:80,temp:"0",hum:"+2",ph:"0",light:"+1h",fert:"+4%",dir:["ok","ok","ok","up","up"]},{id:"kangkung",name:"Kangkung",icon:"🌱",growDays:45,pricePerKg:3,yieldKgPerRow:3.5,waterLpR:15,fertMLpR:90,temp:"+0.5",hum:"+3",ph:"0",light:"0",fert:"+5%",dir:["up","up","ok","ok","up"]},{id:"petai",name:"Petai",icon:"🌱",growDays:45,pricePerKg:6,yieldKgPerRow:3,waterLpR:15,fertMLpR:90,temp:"+0.5",hum:"+3",ph:"0",light:"0",fert:"+5%",dir:["up","up","ok","ok","up"]}];let ie=null,B=10,K=1,U=F[0],$e=[...F],ne=[],h=[],j=0,ue={},N=null,re=null,z=null,D="",ge=[...pe],A={loading:!1,error:null,generatedAt:null},v=null,M=null,me="",C=null,V=!1;function y(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function _(e,t=2){const o=Number(e);return Number.isFinite(o)?"RM "+o.toFixed(t):"—"}function Y(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")}function qe(e=[],t=[]){const o=new Map;return[...e,...t].forEach(r=>{if(!r)return;const i=r.id||r.farmId||r.backendFarmId||r.name||String(o.size);o.set(i,{...o.get(i)||{},...r})}),Array.from(o.values())}function bt(){let e=[];try{e=JSON.parse(localStorage.getItem("user_farms")||"[]")}catch{e=[]}return qe(k.currentFarm?[k.currentFarm]:[],e)}async function yt(){if(!k.uid||k.isGuest)return[];try{await Ie();const e=await ft(k.uid);return Array.isArray(e==null?void 0:e.farms)?e.farms:[]}catch(e){return console.warn("[WhatIfPro] Firestore farm load failed:",e),[]}}function R(e){if(!e.length)return null;const t=k.currentFarm,o=e[j]||e[0];return t&&(!o||t.id===o.id)?t:o}function ae(){const e=R(h);return(e==null?void 0:e.id)||(e==null?void 0:e.farmId)||(e==null?void 0:e.backendFarmId)||k.currentFarmId||null}function ht(e){var o;if(!((o=e==null?void 0:e.plants)!=null&&o.length))return[];const t=new Map;for(const r of e.plants){const i=Y(r.species||r.name);t.has(i)?t.get(i).slots+=r.slots||1:t.set(i,{...r,slots:r.slots||1})}return Array.from(t.values()).map(r=>{const i=Y(r.species||r.name),n=Pe.find(a=>a.id===i)||{growDays:60,yieldKgPerRow:4,pricePerKg:5,waterLpR:20,energyKWhpR:2,fertMLpR:120};return{id:i,name:r.name||n.name||i,icon:r.emoji||"🌱",slots:r.slots||1,growDays:n.growDays,yieldKgPerRow:n.yieldKgPerRow,pricePerKg:n.pricePerKg,waterLpR:n.waterLpR,energyKWhpR:n.energyKWhpR,fertMLpR:n.fertMLpR}})}function xt(e){if(!e)return[];const t=Array.isArray(e.plants)?e.plants:[];if(Array.isArray(e.zones)&&e.zones.length)return e.zones.map((a,d)=>{var w;const c=a.zone_id||a.id||`zone_${String.fromCharCode(65+d)}`,s=t.filter(m=>(m.zoneId||m.zone_id||m.zoneName)===c||m.zoneName===a.name),p=s.length?s:(a.plants||[]).map(m=>({name:m,species:m,slots:1})),g=Number(a.capacity||a.slots||a.totalSlots||12),l=p.reduce((m,x)=>m+(Number(x.slots)||1),0),u=Math.min(100,Math.round(l/Math.max(1,g)*100)),b=He(p);return{id:a.name||a.label||c,crop:a.crop||[...new Set(p.map(m=>m.name||m.species))].join(", ")||"Empty",emoji:((w=p[0])==null?void 0:w.emoji)||"🌱",rows:l,capacity:g,availableRows:Math.max(0,g-l),fill:u,harvIn:b}});const o=e.rackTypeId||e.rackType||"3-tier",r={...le[o]||le["3-tier"],...e.rackConfig||{}},i=Number(r.tiers||3),n=Number(r.slotsPerTier||3);return Array.from({length:i},(a,d)=>{var l;const c=d+1,s=t.filter((u,b)=>u.tier!==void 0?Number(u.tier)===c:Math.floor(b/n)+1===c),p=s.reduce((u,b)=>u+(Number(b.slots)||1),0),g=Math.min(100,Math.round(p/Math.max(1,n)*100));return{id:`Tier ${c}`,crop:[...new Set(s.map(u=>u.name||u.species))].join(", ")||"Empty",emoji:((l=s[0])==null?void 0:l.emoji)||"🌱",rows:p,capacity:n,availableRows:Math.max(0,n-p),fill:g,harvIn:He(s)}})}function be(e=R(h)){if(!e)return 1;const t=Number(e.unitsPerRow||e.slotsPerRow||e.slotsPerTier);if(Number.isFinite(t)&&t>0)return Math.round(t);if(Array.isArray(e.zones)&&e.zones.length){const n=e.zones.map(a=>Number(a.capacity||a.slots||a.totalSlots)).filter(a=>Number.isFinite(a)&&a>0);if(n.length)return Math.max(1,Math.round(n.reduce((a,d)=>a+d,0)/n.length))}const o=e.rackTypeId||e.rackType||"3-tier",r={...le[o]||le["3-tier"],...e.rackConfig||{}},i=Number(r.slotsPerTier||r.unitsPerRow);return Number.isFinite(i)&&i>0?Math.round(i):1}function ye(){const e=Math.max(1,Number(B)||1),t=Math.max(1,Number(K)||1);return{rows:e,unitsPerRow:t,totalUnits:e*t,baseUnitsPerRow:Math.max(1,be())}}function He(e=[]){const t=e.map(o=>{const r=Pe.find(i=>i.id===Y(o.species||o.name));return r?Math.max(7,Math.round(r.growDays*.6)):21});return t.length?Math.min(...t):0}function wt(){return null}const vt=new Set(["farm_001"]),J={zone_A:"commercial-zone-node-1",zone_B:"commercial-zone-node-2",zone_C:"commercial-zone-node-3",zone_D:"commercial-zone-node-4",zone_E:"commercial-zone-node-5",zone_F:"commercial-zone-node-6"},se="commercial-farm-master-1";function O(e){return e&&vt.has(String(e))}function q(e){const t=String(e||"").trim().toLowerCase();if(!t)return"";const o=t.match(/^([a-z])$/),r=t.match(/^zone[_ ]([a-z])$/),i=(o==null?void 0:o[1])||(r==null?void 0:r[1]);return i?`zone_${i.toUpperCase()}`:t.startsWith("zone_")?`zone_${t.slice(5).toUpperCase()}`:t}function he(e,t){const o=q(t);return o?(Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[]).find(i=>q(i.zoneId||i.zone)===o)||(q(e==null?void 0:e.zoneId)===o?e:null):null}function Qe(e=R(h)){var o,r,i,n;const t=((o=e==null?void 0:e.farmMaster)==null?void 0:o.deviceId)||(e==null?void 0:e.farmMasterDeviceId)||(e==null?void 0:e.masterDeviceId)||((i=(r=k.currentFarm)==null?void 0:r.farmMaster)==null?void 0:i.deviceId)||((n=k.currentFarm)==null?void 0:n.farmMasterDeviceId);return t||((e==null?void 0:e.id)==="farm_commercial_demo_001"||(e==null?void 0:e.farmId)==="farm_commercial_demo_001"||(e==null?void 0:e.backendFarmId)==="farm_commercial_demo_001"?se:"")}function kt(e=R(h)){const t=[],o=new Set,r=(i,n)=>{if(!n)return;const a=new URLSearchParams;a.set(i,n);const d=a.toString();o.has(d)||(o.add(d),t.push(a))};return r("deviceId",Qe(e)),r("deviceId",se),t}function Rt(e=R(h)){var a,d,c;const t=[],o=new Set,r=(s,p)=>{if(!p||s==="deviceId"&&O(p))return;const g=new URLSearchParams;g.set(s,p);const l=g.toString();o.has(l)||(o.add(l),t.push(g))},i=q(k.currentZoneId||(e==null?void 0:e.zoneId)),n=he(e,i);return r("deviceId",n==null?void 0:n.deviceId),r("deviceId",e==null?void 0:e.deviceId),r("deviceId",(a=e==null?void 0:e.farmMaster)==null?void 0:a.deviceId),r("deviceId",(d=k.currentFarm)==null?void 0:d.deviceId),r("zoneId",i),r("deviceId",J[i]),i==="farm_master"&&(r("deviceId",(c=e==null?void 0:e.farmMaster)==null?void 0:c.deviceId),r("deviceId",e==null?void 0:e.deviceId),r("deviceId",se)),Array.isArray(e==null?void 0:e.commercialDevices)&&e.commercialDevices.forEach(s=>r("deviceId",s==null?void 0:s.deviceId)),r("farmId",e==null?void 0:e.id),r("farmId",e==null?void 0:e.farmId),r("farmId",e==null?void 0:e.backendFarmId),r("fieldId",e==null?void 0:e.fieldId),r("fieldId",e==null?void 0:e.id),r("farmId","farm_commercial_demo_001"),i||Object.values(J).forEach(s=>r("deviceId",s)),t}function Me(e=R(h)){var i,n;const t=q(k.currentZoneId||(e==null?void 0:e.zoneId)),o=he(e,t),r=(o==null?void 0:o.deviceId)||(e==null?void 0:e.deviceId)||((i=e==null?void 0:e.farmMaster)==null?void 0:i.deviceId)||((n=k.currentFarm)==null?void 0:n.deviceId)||void 0;return{deviceId:O(r)?void 0:r,zoneId:t||void 0,farmId:(e==null?void 0:e.id)||(e==null?void 0:e.farmId)||(e==null?void 0:e.backendFarmId)||void 0,fieldId:(e==null?void 0:e.fieldId)||void 0}}function Ye(e=R(h)){const t=Me(e),o=Object.entries(t).filter(([,r])=>r);return o.length?o.map(([r,i])=>`${r}=${i}`).join(" · "):"No deviceId, farmId, fieldId, or zoneId available"}function Ge(){return!!(v||N&&N.totalReadings)}function ve(e={}){const t=e.reading||e;if(!t||e.reading===null||!Object.keys(t).length)return null;const o=Number(t.lightRaw),r=Number(t.soilRaw),i=Number(t.ecRaw),n=Number(t.ec),a=u=>Number.isFinite(u)?Math.max(0,Math.min(100,u/4095*100)):void 0,d=Number.isFinite(n)?Math.max(0,Math.min(100,n/2.2*100)):void 0,c=t.soilMoisture!==void 0,s=t.water!==void 0,p=a(r),g=t.moisture??t.soilMoisture??t.water??p??null,l=c?"Firebase soilMoisture percent":s?"Firebase water percent":Number.isFinite(r)?"Firebase soilRaw ADC (uncalibrated approx) — backend will recalibrate":"Firebase reading missing soil moisture field";return{temp:t.temperature??t.temp??null,humid:t.humidity??t.humid??null,light:t.light??t.lux??a(o)??null,water:g,moisture:g,soilMoisture:g,nutrient:t.nutrient??d??a(i)??null,ph:t.ph??null,soilRaw:Number.isFinite(r)?r:void 0,soilRawUnit:Number.isFinite(r)?"ADC count (0-4095)":void 0,moistureUnit:"%",soilMoistureUnit:Number.isFinite(r)?"uncalibrated approx from soilRaw ADC":"%",moistureBasis:Number.isFinite(r)&&!c&&!s?"soilRaw uncalibrated approximation — set dry/wet calibration in device settings":"explicit percent",moistureFormula:Number.isFinite(r)&&!c&&!s?"APPROX ONLY: soilRaw / 4095 × 100 — not scientifically valid without calibration":"soil moisture % = Firebase explicit percent reading",lightRaw:Number.isFinite(o)?o:void 0,ecRaw:Number.isFinite(i)?i:void 0,ec:Number.isFinite(n)?n:void 0,waterDistanceCm:t.waterDistanceCm,gasRaw:t.gasRaw,co2Raw:t.co2Raw,co2Ppm:t.co2Ppm,energyKwh:t.energyKwh,packageLevel:t.packageLevel,deviceId:t.deviceId,farmId:t.farmId,zoneId:t.zoneId,fieldId:t.fieldId,sourceQuery:t.sourceQuery,moistureSource:l,createdAt:ke(t.createdAt||t.updatedAt),source:"Firebase Cloud Firestore sensorReadings"}}function ke(e){return e?e instanceof Date?e:typeof e.toDate=="function"?e.toDate():Number.isFinite(e.seconds)?new Date(e.seconds*1e3):e:null}function It(e,t=""){const o=typeof e.data=="function"?e.data():e;return{id:e.id||o.id,...o,createdAt:ke(o.createdAt),updatedAt:ke(o.updatedAt),sourceQuery:t}}function Ze(e){return e?[e.temperature,e.temp,e.humidity,e.humid,e.soilMoisture,e.moisture,e.water,e.soilRaw,e.waterDistanceCm,e.ec,e.ecRaw,e.light,e.lightRaw].some(t=>t!=null):!1}async function Ve(e=R(h)){var r;let t=null;const o=Rt(e);for(const i of o)try{const n=await fetch(`${te}/api/sensors/latest?${i.toString()}`);if(!n.ok)throw new Error("sensor HTTP "+n.status);const a=await n.json(),d=ve({...a,reading:a!=null&&a.reading?{...a.reading,sourceQuery:`rest:${i.toString()}`}:a==null?void 0:a.reading});if(d)return d}catch(n){t=n}try{const i=await Xe(e,1),n=(r=i==null?void 0:i.readings)==null?void 0:r[0];if(n)return ve({...n,sourceQuery:`firebase:${i.usedQuery}`})}catch(i){t=i}return console.warn("[WhatIfPro] Firebase latest sensor unavailable:",(t==null?void 0:t.message)||"no matching sensorReadings"),null}async function Je(e=R(h)){let t=null;const o=kt(e);for(const r of o)try{const i=await fetch(`${te}/api/sensors/latest?${r.toString()}`);if(!i.ok)throw new Error("sensor HTTP "+i.status);const n=await i.json(),a=ve({...n,reading:n!=null&&n.reading?{...n.reading,sourceQuery:`farm-level:${r.toString()}`}:n==null?void 0:n.reading});if(a)return a}catch(i){t=i}return console.warn("[WhatIfPro] Farm-level sensor unavailable:",(t==null?void 0:t.message)||"no farm master reading"),null}function Pt(e=R(h)){var a,d,c;const t=new Set,o=[],r=(s,p)=>{if(!p||s==="deviceId"&&O(p))return;const g=new URLSearchParams;g.set(s,p),g.set("limit","200");const l=g.toString();t.has(l)||(t.add(l),o.push(g))},i=q(k.currentZoneId||(e==null?void 0:e.zoneId)),n=he(e,i);return r("deviceId",n==null?void 0:n.deviceId),r("deviceId",e==null?void 0:e.deviceId),r("deviceId",(a=e==null?void 0:e.farmMaster)==null?void 0:a.deviceId),r("deviceId",(d=k.currentFarm)==null?void 0:d.deviceId),r("zoneId",i),r("deviceId",J[i]),i==="farm_master"&&(r("deviceId",(c=e==null?void 0:e.farmMaster)==null?void 0:c.deviceId),r("deviceId",e==null?void 0:e.deviceId),r("deviceId",se)),Array.isArray(e==null?void 0:e.commercialDevices)&&e.commercialDevices.forEach(s=>r("deviceId",s==null?void 0:s.deviceId)),r("farmId",e==null?void 0:e.id),r("farmId",e==null?void 0:e.farmId),r("farmId",e==null?void 0:e.backendFarmId),r("fieldId",e==null?void 0:e.fieldId),r("fieldId",e==null?void 0:e.id),r("farmId","farm_commercial_demo_001"),i||Object.values(J).forEach(s=>r("deviceId",s)),o}async function Xe(e=R(h),t=200){var o,r;try{await Ie();const i=je();if(!i)throw new Error("Firebase Firestore is not initialized");const n=q(k.currentZoneId||(e==null?void 0:e.zoneId)),a=he(e,n),d=[["deviceId",a==null?void 0:a.deviceId],["deviceId",e==null?void 0:e.deviceId],["deviceId",(o=e==null?void 0:e.farmMaster)==null?void 0:o.deviceId],["deviceId",(r=k.currentFarm)==null?void 0:r.deviceId],["zoneId",n],["deviceId",J[n]],["deviceId",n==="farm_master"?se:null],...Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices.map(l=>["deviceId",l==null?void 0:l.deviceId]):[],["farmId",e==null?void 0:e.id],["farmId",e==null?void 0:e.farmId],["farmId",e==null?void 0:e.backendFarmId],["fieldId",e==null?void 0:e.fieldId],["fieldId",e==null?void 0:e.id],["farmId","farm_commercial_demo_001"],...n?[]:Object.values(J).map(l=>["deviceId",l])].filter(([l,u])=>!!u&&!(l==="deviceId"&&O(u))),c=new Set,s=d.filter(([l,u])=>{const b=`${l}:${u}`;return c.has(b)?!1:(c.add(b),!0)}),p=i.collection("sensorReadings"),g=Math.max(1,Math.min(500,Number(t)||200));for(const[l,u]of s)try{const b=await p.where(l,"==",u).orderBy("createdAt","desc").limit(g).get();if(!b.empty){const w=b.docs.map(m=>It(m,`${l}=${u}`)).filter(m=>Ze(m)&&!O(m.deviceId));if(w.length)return console.log(`[WhatIfPro] Firebase direct: ${w.length} readings via ${l}=${u}`),{readings:w,usedQuery:`${l}=${u}`}}}catch(b){console.warn(`[WhatIfPro] Firebase direct query failed (${l}=${u}):`,b.message)}return console.info("[WhatIfPro] Firebase direct: no sensorReadings documents found for known identifiers"),{readings:[],usedQuery:""}}catch(i){return console.warn("[WhatIfPro] Firebase direct history unavailable:",i.message),null}}async function et(e=R(h)){return N&&Date.now()-N.fetchedAt<5*60*1e3?N:re||(re=$t(e).finally(()=>{re=null}),re)}async function $t(e=R(h)){let t=[],o="";const r=await Xe(e);if(r&&r.readings.length>0&&(t=r.readings,o=`firebase:${r.usedQuery}`,console.log(`[WhatIfPro] History source: Firebase direct (${t.length} readings)`)),!t.length){console.log("[WhatIfPro] Falling back to REST API for history...");const s=Pt(e);for(const p of s)try{const g=await fetch(`${te}/api/sensors/history?${p}`);if(!g.ok)continue;const l=await g.json(),u=(Array.isArray(l.readings)?l.readings:Array.isArray(l)?l:[]).filter(b=>Ze(b)&&!O(b.deviceId));if(u.length>0){t=u,o=`rest:${p.toString()}`,console.log("[WhatIfPro] History loaded via REST "+p.toString()+" - "+u.length+" readings");break}}catch(g){console.warn("[WhatIfPro] REST history candidate failed:",p.toString(),g.message)}}if(!t.length)return console.info("[WhatIfPro] No Firebase sensor history found for active farm identifiers"),Q(),null;const i=t.map(s=>{const p=s.soilMoisture??s.moisture??s.water,g=Number.isFinite(Number(s.soilRaw))?Math.max(0,Math.min(100,Number(s.soilRaw)/4095*100)):null,l=p!=null?Number(p):g;return{ts:s.createdAt||s.timestamp,value:l,waterOn:String(s.command||"").includes("WATER_ON")}}).filter(s=>s.value!==null&&Number.isFinite(s.value)),n=t.map(s=>{const p=s.ec,g=Number.isFinite(Number(s.ecRaw))?Math.max(0,Math.min(100,Number(s.ecRaw)/4095*100)):null,l=p!=null?Number(p):g;return{ts:s.createdAt||s.timestamp,value:l,fertAlert:String(s.command||"").includes("FERT_ALERT")}}).filter(s=>s.value!==null&&Number.isFinite(s.value)),a=t.map(s=>Number(s.temperature??s.temp)).filter(Number.isFinite),d=t.map(s=>Number(s.humidity??s.humid)).filter(Number.isFinite),c=t.map(s=>Number(s.ph)).filter(Number.isFinite);return N={water:i,ec:n,temp:a,humid:d,ph:c,rawReadings:t.slice(0,200),totalReadings:t.length,usedQuery:o,fetchedAt:Date.now()},Q(),N}function fe(e=[]){if(!e.length)return null;const t=e.map(u=>u.value),o=t.reduce((u,b)=>u+b,0)/t.length,r=[...t].sort((u,b)=>u-b),i=r[Math.floor(r.length/2)],n=r[0],a=r[r.length-1],d=e.filter(u=>u.waterOn||u.fertAlert).length,c=Math.round(d/e.length*100),s=Math.max(1,Math.floor(e.length*.1)),p=t.slice(0,s).reduce((u,b)=>u+b,0)/s,l=t.slice(-s).reduce((u,b)=>u+b,0)/s-p;return{avg:o,median:i,min:n,max:a,alertCount:d,alertPct:c,trend:l,count:e.length}}function Mt(e,t=R(h)){var i;const o=Me(t),r=((i=e==null?void 0:e.rawReadings)==null?void 0:i.find(n=>n&&!O(n.deviceId)))||{};return{deviceId:r.deviceId||o.deviceId,zoneId:r.zoneId||o.zoneId,farmId:r.farmId||o.farmId,fieldId:r.fieldId||o.fieldId}}function Ft(e,t,o,r=""){const i=fe((o==null?void 0:o.water)||[]),n=fe((o==null?void 0:o.ec)||[]),a=e.waterLpR/Math.max(1,t.baseUnitsPerRow),d=e.fertMLpR/Math.max(1,t.baseUnitsPerRow),c=(e.energyKWhpR||0)/Math.max(1,t.baseUnitsPerRow),s=Number((i==null?void 0:i.alertPct)||0),p=Number((n==null?void 0:n.alertPct)||0),g=Number((i==null?void 0:i.trend)||0),l=Number((n==null?void 0:n.trend)||0),u=1+(s>30?.18:s>10?.08:0)+(g<-1?.08:g>1?-.04:0),b=1+(p>30?.16:p>10?.07:0)+(l<-.05?.08:l>.05?-.04:0);return{waterLitresPerWeek:Number((a*t.totalUnits*Math.max(.75,u)).toFixed(1)),waterTrend:g<-1||s>20?"up":g>1?"down":"stable",fertMLPerWeek:Number((d*t.totalUnits*Math.max(.75,b)).toFixed(0)),fertTrend:l<-.05||p>20?"up":l>.05?"down":"stable",energyKWhPerMonth:Number((c*t.totalUnits*4.33).toFixed(2)),energyTrend:"stable",topRisk:s>p?"Moisture demand may rise":"Nutrient demand may rise",confidence:(o==null?void 0:o.totalReadings)>=50?"medium":"low",insight:"Estimated from Firebase history and crop defaults.",source:`Firebase history (${(o==null?void 0:o.totalReadings)||0} readings)`}}async function Lt(e,t,o){var $,L,T,E;if(!o||!o.totalReadings)throw new Error("Sensor history is required for resource prediction");const r=o?fe(o.water):null,i=o?fe(o.ec):null,n=e.waterLpR/Math.max(1,t.baseUnitsPerRow),a=e.fertMLpR/Math.max(1,t.baseUnitsPerRow),d=P=>P&&P.length?(P.reduce((de,Z)=>de+Z,0)/P.length).toFixed(1):"N/A",c=P=>P>1?"rising":P<-1?"falling":"stable",p=`You are a precision vertical farming resource analyst for a Malaysian IoT farm.
Analyse the real sensor history and predict resource needs for a new planting.

=== CURRENT FARM SENSOR HISTORY ===
`+[`Farm sensor history (${o.totalReadings} readings, source: ${o.usedQuery}):`,r?`- Soil moisture: avg ${r.avg.toFixed(1)}%, median ${r.median.toFixed(1)}%, min ${r.min.toFixed(1)}%, max ${r.max.toFixed(1)}%, WATER_ON triggered ${r.alertPct}% of the time, trend ${c(r.trend)} (delta ${r.trend.toFixed(1)}%)`:"- Soil moisture: no data",i?`- EC / nutrient: avg ${i.avg.toFixed(2)} mS/cm, FERT_ALERT triggered ${i.alertPct}% of the time, trend ${c(i.trend)}`:"- EC / nutrient: no data",($=o.temp)!=null&&$.length?`- Temperature: avg ${d(o.temp)}C (${o.temp.length} readings)`:"- Temperature: no data",(L=o.humid)!=null&&L.length?`- Humidity: avg ${d(o.humid)}%`:"- Humidity: no data",(T=o.ph)!=null&&T.length?`- pH: avg ${d(o.ph)} (${o.ph.length} readings)`:"- pH: no data"].join(`
`)+`

=== NEW PLANTING TO EVALUATE ===
Species: ${e.name}
Rows to add: ${t.rows}
Units per row: ${t.unitsPerRow}
Total new units: ${t.totalUnits}
Species base water need: ${n.toFixed(1)} L per unit per week
Species base fertilizer need: ${a.toFixed(1)} mL per unit per week
Species grow days: ${e.growDays}

=== YOUR TASKS ===
1. WATER: Estimate the ADDITIONAL weekly water (litres) for this new planting.
   - If soil moisture trend is falling or WATER_ON alerts are frequent, increase estimate.
   - If moisture is stable and alerts are rare, use the species base as-is.
2. FERTILIZER: Estimate the ADDITIONAL weekly fertilizer (mL) for this new planting.
   - If EC trend is falling or FERT_ALERTs are frequent, increase estimate.
   - Consider whether pH is within optimal range for ${e.name} (typical 5.5-6.5).
3. ENERGY: Estimate the ADDITIONAL monthly lighting energy (kWh) for this new planting.
4. RISK: Identify the single biggest resource risk for adding ${e.name} to this farm.
5. CONFIDENCE: Rate your confidence as high / medium / low based on data quality.
6. INSIGHT: One actionable sentence (max 20 words) the farmer should know.

Return ONLY a JSON object, no markdown, no preamble:
{
  "waterLitresPerWeek": <number>,
  "waterTrend": "up" | "stable" | "down",
  "fertMLPerWeek": <number>,
  "fertTrend": "up" | "stable" | "down",
  "energyKWhPerMonth": <number>,
  "energyTrend": "up" | "stable" | "down",
  "topRisk": "<string, max 15 words>",
  "confidence": "high" | "medium" | "low",
  "insight": "<string, max 20 words>"
}`,g=await fetch(`${te}/api/ai/predict-resources`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:p,sensorFilters:Mt(o)})});if(!g.ok)throw new Error("Resource forecast request failed");const l=await g.json(),b=(l.text??((E=l.content)==null?void 0:E.map(P=>P.text||"").join(""))??"").replace(/```json|```/g,"").trim(),w=JSON.parse(b);if(w.error)throw new Error(w.insight||"Resource forecast unavailable");const m=Number(w.waterLitresPerWeek),x=Number(w.fertMLPerWeek),f=Number(w.energyKWhPerMonth),I=(e.energyKWhpR||0)/Math.max(1,t.baseUnitsPerRow)*t.totalUnits*4.33;if(!Number.isFinite(m)||!Number.isFinite(x))throw new Error("Resource forecast missing water or fertilizer number");return{waterLitresPerWeek:m,waterTrend:w.waterTrend||"stable",fertMLPerWeek:x,fertTrend:w.fertTrend||"stable",energyKWhPerMonth:Number((Number.isFinite(f)?f:I).toFixed(2)),energyTrend:w.energyTrend||"stable",topRisk:w.topRisk||"",confidence:w.confidence||"low",insight:w.insight||"",source:`Sensor forecast (${o.totalReadings} Firebase readings)`}}async function Et(e,t){const o=`${e.id}|${t.rows}|${t.unitsPerRow}|${ae()||""}`,r=rt(e,t,tt(e));if(r){z=r,D=o,H(e,t,r);return}if(o===D&&z){H(e,t,z);return}H(e,t,null);try{const i=N||await et();if(!i||!i.totalReadings){z={error:!0,confidence:"low",insight:"Connect farm sensor history to calculate resource demand from live operating data.",source:""},D=o,H(e,t,z);return}const n=await Lt(e,t,i);z=n,D=o,H(e,t,n)}catch{const n=N;z=n!=null&&n.totalReadings?Ft(e,t,n):{error:!0,confidence:"low",insight:"Resource forecast is unavailable until the farm has sensor history.",source:""},D=o,H(e,t,z)}}function tt(e=U){return(C==null?void 0:C.species)===e.id?C.data:null}function rt(e,t,o){var i,n,a,d;const r=o==null?void 0:o.demand;return r?{waterLitresPerWeek:Number((Number(r.waterLPerDay||0)*7).toFixed(1)),waterTrend:"stable",fertMLPerWeek:Number(r.fertMLPerWeek||0),fertTrend:"stable",energyKWhPerMonth:Number(r.lightKWhPerMonth||0),energyTrend:"stable",topRisk:((i=o.warnings)==null?void 0:i[0])||"",confidence:((n=o.analysis)==null?void 0:n.source)==="ai"?"medium":"low",insight:(a=o.cropResourceProfile)!=null&&a.sourceBasis?`Crop-specific resource profile: ${o.cropResourceProfile.sourceBasis}`:"Crop-specific resource needs from suitability analysis.",source:(d=o.resourceLinks)!=null&&d.length?"Crop profile + Firebase history":"Crop defaults + Firebase history"}:null}function oe(e,t=""){const o=Number(e);return Number.isFinite(o)?`${o.toFixed(Math.abs(o)>=100?0:1)}${t}`:"missing"}function Q(){var a;const e=document.getElementById("pro-sensor-proof");if(!e)return;const t=v,o=M,r=N,i=t?[t.deviceId&&`deviceId=${t.deviceId}`,t.farmId&&`farmId=${t.farmId}`,t.zoneId&&`zoneId=${t.zoneId}`].filter(Boolean).join(" · ")||"Firebase latest reading":Ye(),n=t||r?"Firebase sensorReadings connected":"No Firebase sensor reading loaded";e.innerHTML=`
    <div class="pro-sensor-proof-title">Firebase sensor proof</div>
    <div><strong>${y(n)}</strong></div>
    <div style="margin-top:3px;color:#475569;">${y(i)}</div>
    <div style="margin-top:3px;color:#64748b;">
      Latest: ${y(t!=null&&t.createdAt?new Date(t.createdAt).toLocaleString():"not available")}
      ${o?` · Farm level: ${y(o.deviceId||"loaded")}`:" · Farm level: not loaded"}
      ${r?` · History: ${r.totalReadings} readings via ${y(r.usedQuery)}`:" · History: not loaded"}
    </div>
    <div class="pro-sensor-proof-grid">
      <div class="pro-sensor-proof-stat"><b>${y(oe(t==null?void 0:t.temp,"°C"))}</b><span>temperature</span></div>
      <div class="pro-sensor-proof-stat"><b>${y(oe(t==null?void 0:t.humid,"%"))}</b><span>humidity</span></div>
      <div class="pro-sensor-proof-stat"><b>${y(oe(t==null?void 0:t.soilMoisture,"%"))}</b><span>soil moisture</span></div>
      <div class="pro-sensor-proof-stat"><b>${y((t==null?void 0:t.soilRaw)!==void 0?`${t.soilRaw} ADC`:"missing")}</b><span>soil raw unit</span></div>
      <div class="pro-sensor-proof-stat"><b>${y(oe(t==null?void 0:t.light,"%"))}</b><span>light</span></div>
      <div class="pro-sensor-proof-stat"><b>${y(oe(t==null?void 0:t.nutrient,"%"))}</b><span>nutrient</span></div>
    </div>
    ${(a=r==null?void 0:r.usedQuery)!=null&&a.includes("farm_001")||(t==null?void 0:t.deviceId)==="farm_001"?'<div style="margin-top:8px;color:#b45309;"><strong>Warning:</strong> this is the demo device farm_001, not a real selected farm device.</div>':""}
  `}function H(e,t,o){const r=document.getElementById("pro-impact-grid");if(!r)return;if(!o){r.innerHTML=`
        <div class="pro-resource-loading" style="grid-column:1/-1;padding:20px 12px;text-align:center;color:#64748b;font-size:12px;font-style:italic;">
          <div style="font-size:22px;margin-bottom:6px;">⏳</div>
        Fetching sensor history and preparing forecast…
      </div>`;return}if(o.error){r.innerHTML=`
      <div class="pro-resource-loading" style="grid-column:1/-1;padding:16px 12px;color:#9a3412;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:11px;line-height:1.45;">
        <strong>Resource forecast needs more sensor history.</strong><br>
        ${y(o.insight)}
        ${o.source?`<span style="display:block;margin-top:6px;color:#c2410c;font-size:9px;">${y(o.source)}</span>`:""}
      </div>`;return}const i={high:{cls:"pro-badge-green",label:"HIGH CONFIDENCE"},medium:{cls:"pro-badge-amber",label:"MEDIUM CONFIDENCE"},low:{cls:"pro-badge-gray",label:"LOW CONFIDENCE"}},n=i[o.confidence]||i.low,a=(o.waterLitresPerWeek*4.33*W.waterRM).toFixed(2),d=(o.fertMLPerWeek*4.33*W.fertRM).toFixed(2),c=Number(o.energyKWhPerMonth||0),s=(c*W.energyRM).toFixed(2),p=(l,u)=>u&&u!=="stable"?`<div style="font-size:8px;color:#64748b;margin-top:3px;">Firebase trend suggests ${l} may ${u==="up"?"increase":"ease"}.</div>`:"",g=o.topRisk?`<div style="grid-column:1/-1;margin-top:4px;padding:8px 10px;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:10px;color:#9a3412;display:flex;align-items:flex-start;gap:7px;">
        <span style="flex-shrink:0;">⚠️</span>
        <span><strong>Top risk:</strong> ${y(o.topRisk)}</span>
       </div>`:"";r.innerHTML=`
    <div class="pro-impact-card up" style="min-width:0;">
      <div class="pro-impact-icon">💧</div>
      <div class="pro-impact-name">Additional water needed</div>
      <div class="pro-impact-val up">+${o.waterLitresPerWeek.toFixed(1)} L/week</div>
      <div style="font-size:9px;color:#64748b;margin-top:4px;">≈ RM ${a}/mo</div>
      ${p("water demand",o.waterTrend)}
    </div>
    <div class="pro-impact-card up" style="min-width:0;">
      <div class="pro-impact-icon">🧪</div>
      <div class="pro-impact-name">Additional fertilizer needed</div>
      <div class="pro-impact-val up">+${o.fertMLPerWeek.toFixed(0)} mL/week</div>
      <div style="font-size:9px;color:#64748b;margin-top:4px;">≈ RM ${d}/mo</div>
      ${p("fertilizer demand",o.fertTrend)}
    </div>
    <div class="pro-impact-card up" style="min-width:0;">
      <div class="pro-impact-icon">⚡</div>
      <div class="pro-impact-name">Additional light energy</div>
      <div class="pro-impact-val up">+${c.toFixed(2)} kWh/mo</div>
      <div style="font-size:9px;color:#64748b;margin-top:4px;">≈ RM ${s}/mo</div>
      ${p("energy demand",o.energyTrend)}
    </div>
    ${g}
    <div style="grid-column:1/-1;margin-top:4px;padding:8px 10px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;font-size:10px;color:#475569;line-height:1.5;display:flex;align-items:flex-start;gap:8px;">
      <span style="flex-shrink:0;">📊</span>
      <span>
        ${y(o.insight)}
        <span class="pro-badge ${n.cls}" style="margin-left:4px;vertical-align:middle;">${n.label}</span>
        <span style="margin-left:4px;color:#94a3b8;font-size:9px;">${y(o.source)}</span>
      </span>
    </div>`}function Fe(e=v){if(!e)return 1;let t=100;return(e.temp<18||e.temp>32)&&(t-=14),(e.humid<45||e.humid>85)&&(t-=10),e.light<45&&(t-=12),(e.water<35||e.water>85)&&(t-=14),e.nutrient<45&&(t-=12),Math.max(.72,Math.min(1.12,t/100))}function G(e){var i,n;const t=Y((e==null?void 0:e.id)||(e==null?void 0:e.name)),o=ue[t],r=(e==null?void 0:e.pricePerKg)||((i=Pe.find(a=>a.id===t))==null?void 0:i.pricePerKg)||5;if(o!=null&&o.channels){const a=o.channels,d=o.bestChannel||((n=Object.entries(a).filter(([,s])=>Number.isFinite(s==null?void 0:s.price)).sort((s,p)=>p[1].price-s[1].price)[0])==null?void 0:n[0]),c=d?a[d]:null;return{live:o.live,asOf:o.asOf,channels:a,bestKey:d||"pasar",bestLabel:(c==null?void 0:c.label)||"Pasar",bestPrice:(c==null?void 0:c.price)||r,scope:o.locationScope||"national"}}return{live:!1,asOf:null,bestKey:"pasar",bestLabel:"Pasar",bestPrice:r,scope:"fallback",channels:{pasar:{label:"Pasar",price:r,source:"Fallback estimate"},supermarket:{label:"Supermarket",price:r*1.1,source:"Fallback estimate"},export:{label:"Export ref.",price:r*1.2,source:"Fallback estimate"}}}}function zt(){if(document.getElementById("pro-wif-styles"))return;const e=document.createElement("style");e.id="pro-wif-styles",e.textContent=`
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
    .pro-eco-formula{font-size:10px;color:#64748b;line-height:1.45;margin-top:10px;}
    .pro-sensor-proof{margin-top:10px;border:1px solid #bfdbfe;background:#eff6ff;border-radius:10px;padding:10px 12px;color:#1e3a8a;font-size:10px;line-height:1.45;}
    .pro-sensor-proof-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#1d4ed8;margin-bottom:6px;}
    .pro-sensor-proof-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:6px;margin-top:8px;}
    .pro-sensor-proof-stat{background:rgba(255,255,255,.72);border:1px solid rgba(147,197,253,.7);border-radius:8px;padding:7px;}
    .pro-sensor-proof-stat b{display:block;font-size:12px;color:#0f172a;}
    .pro-sensor-proof-stat span{display:block;font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-top:2px;}
    .pro-qty-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
    .pro-qty-row label{font-size:10px;color:#64748b;min-width:80px;letter-spacing:.04em;}
    .pro-qty-ctrl{display:flex;align-items:center;gap:8px;}
    .pro-qty-btn{width:28px;height:28px;border:1px solid #e5e7eb;border-radius:6px;background:#f8fafc;color:#17231b;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
    .pro-qty-btn:hover{border-color:#22c55e;color:#166534;}
    .pro-qty-num{width:40px;text-align:center;font-size:14px;font-weight:700;color:#047857;}
    .pro-qty-note{font-size:10px;color:#64748b;margin-top:-4px;margin-bottom:12px;}
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
  `,document.head.appendChild(e)}function Ct(){return zt(),`
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
          <div class="pro-qty-row">
            <label>Units / row</label>
            <div class="pro-qty-ctrl">
              <button class="pro-qty-btn" id="pro-unit-dec">−</button>
              <span class="pro-qty-num" id="pro-unit-disp">1</span>
              <button class="pro-qty-btn" id="pro-unit-inc">+</button>
            </div>
          </div>
          <div class="pro-qty-note" id="pro-qty-total">10 total units</div>
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
            <div class="pro-eco-formula" id="pro-eco-formula"></div>
          </div>
          <div class="pro-sensor-proof" id="pro-sensor-proof"></div>
        </div>

      </div>

    </div>
  `}function Nt(){var t;ie=null,B=10,K=1,U=F[0],$e=[...F],ue={},ge=[...pe],A={loading:!0,error:null,generatedAt:null},v=wt(),me="",C=null,V=!1,h=bt(),j=0;const e=((t=k.currentFarm)==null?void 0:t.id)||k.currentFarmId;if(e){const o=h.findIndex(r=>r.id===e);o>=0&&(j=o)}Le(),K=be(R(h)),z=null,D="",N=null,ze(),_t(),Tt(),Ht(),X(),Re(),xe(),ee(),S(),Kt()}function Le(){const e=R(h);ne=ht(e)}async function Kt(){const e=await yt();if(e.length){const t=ae();h=qe(e,h);const o=h.findIndex(r=>r.id===t);o>=0&&(j=o),Le(),K=be(R(h)),ze()}await ot(),await Ee(),et().catch(()=>{})}async function ot(){v=await Ve(R(h)),M=await Je(R(h)),Q(),X(),S()}async function Ee(){var a;const e=[...ne,...F,U].map(d=>Y(d.id||d.name)).filter(Boolean),t=[...new Set(e)];if(!t.length)return;const o=R(h)||{},r=new URLSearchParams({crops:t.join(",")}),i=o.state||o.negeri||o.location||"",n=o.district||o.daerah||"";i&&r.set("state",i),n&&r.set("district",n),A={loading:!0,error:null,generatedAt:null},Re();try{const d=await fetch(`${te}/api/whatif/market-prices?${r}`);if(!d.ok)throw new Error("market HTTP "+d.status);const c=await d.json();ue=c.prices||{},ge=(a=c.sources)!=null&&a.length?c.sources:pe,A={loading:!1,error:null,generatedAt:c.generatedAt,pricecatcherMonth:c.pricecatcherMonth}}catch(d){console.warn("[WhatIfPro] Market price load failed:",d),ue={},ge=[...pe],A={loading:!1,error:d.message,generatedAt:null}}Re(),xe(),X(),ee(),S()}function Re(){const e=document.getElementById("pro-market-status"),t=document.getElementById("pro-market-grid"),o=document.getElementById("pro-market-sources");if(!e||!t||!o)return;if(A.loading)e.textContent="Fetching live pasar, supermarket, and export references from online public sources…";else if(A.error)e.textContent=`Online price fetch failed (${A.error}). Showing clearly labeled fallback estimates until the backend can reach the sources.`;else{const i=A.generatedAt?new Date(A.generatedAt).toLocaleString():"latest available";e.textContent=`Live market data refreshed ${i}. PriceCatcher month: ${A.pricecatcherMonth||"latest available"}.`}const r=ne.length?ne:F.slice(0,6);t.innerHTML=r.map(i=>{const n=G(i),a=[["pasar","Pasar"],["supermarket","Supermarket"],["export","Export"]];return`
      <div class="pro-market-card">
        <div class="pro-market-title">
          <span>${i.icon||"🌱"} ${y(i.name)}</span>
          <span class="pro-badge ${n.live?"pro-badge-green":"pro-badge-gray"}">${n.live?"LIVE":"EST."}</span>
        </div>
        <div class="pro-market-prices">
          ${a.map(([d,c])=>{const s=n.channels[d]||{};return`
              <div class="pro-market-price ${d===n.bestKey?"best":""}" title="${y(s.source||"")}">
                <div class="lbl">${y(c)}</div>
                <div class="val">${_(s.price,2)}</div>
              </div>`}).join("")}
        </div>
        <div style="font-size:9px;color:#64748b;margin-top:8px;">
          Best: ${y(n.bestLabel)} · ${y(n.scope)}${n.asOf?" · "+y(n.asOf):""}
        </div>
      </div>`}).join(""),o.innerHTML=ge.map(i=>`
    <a class="pro-source-link" href="${y(i.url)}" target="_blank" rel="noopener noreferrer" title="${y(i.note||"")}">
      ${y(i.label)}
    </a>`).join("")}function At(){const e=Fe(),t=ye();return F.map(r=>{const i=G(r),n=r.yieldKgPerRow/t.baseUnitsPerRow,a=r.waterLpR/t.baseUnitsPerRow,d=r.fertMLpR/t.baseUnitsPerRow,c=90/Math.max(1,r.growDays),s=t.unitsPerRow,p=n*s*e*i.bestPrice*c,g=90/7,l=a*s*W.waterRM*g+d*s*W.fertRM*g;return{sp:r,market:i,profit90:p-l}}).sort((r,i)=>i.profit90-r.profit90)[0]||null}function xe(){const e=document.getElementById("pro-best-plant-banner");if(!e)return;const t=At();if(!t){e.textContent="Plant recommendation unavailable until crop and market data loads.";return}e.innerHTML=`
    <strong>Most profitable to plant now:</strong>
    ${t.sp.icon} ${y(t.sp.name)}
    at ${_(t.market.bestPrice,2)}/kg via ${y(t.market.bestLabel)}.
    Estimated ${_(t.profit90,0)} profit per row (${ye().unitsPerRow} units) over 90 days after live sensor adjustment.
  `}function it(e){const t=String(e||"").trim(),o=Y(t),r=t.replace(/\b\w/g,i=>i.toUpperCase())||"Custom Species";return{id:o,name:r,icon:"🌱",growDays:60,pricePerKg:G({id:o,name:r}).bestPrice||5,yieldKgPerRow:4,waterLpR:20,fertMLpR:120,temp:"+0.5",hum:"+3",ph:"0",light:"+1h",fert:"+8%",dir:["ok","up","ok","up","up"],custom:!0}}function nt(e){U=e||F[0],C=null,V=!1,me="",A={loading:!0,error:null,generatedAt:null},Ee().then(()=>{ee(),Ce(U,ye())}).catch(()=>{})}function ze(){const e=document.getElementById("pro-farm-chips");if(e){if(!h.length){e.innerHTML='<span style="font-size:11px;color:#94a3b8;">No farms found</span>';return}e.innerHTML=h.map((t,o)=>`
    <button class="pro-farm-chip ${o===j?"active":""}" data-farm-idx="${o}">
      ${y(t.name||t.id||"Farm "+(o+1))}
    </button>`).join(""),e.querySelectorAll(".pro-farm-chip").forEach(t=>{t.addEventListener("click",()=>{j=parseInt(t.getAttribute("data-farm-idx"));const o=h[j];o&&(k.currentFarm=o,k.currentFarmId=o.id||k.currentFarmId),Le(),K=be(o),z=null,D="",N=null,ze(),X(),S(),ot(),Ee()})})}}function _t(){document.querySelectorAll(".pro-tab[data-pro-tab]").forEach(e=>{e.addEventListener("click",()=>{var o;const t=e.getAttribute("data-pro-tab");document.querySelectorAll(".pro-sec").forEach(r=>r.classList.remove("active")),document.querySelectorAll(".pro-tab").forEach(r=>r.classList.remove("active")),(o=document.getElementById("pro-"+t))==null||o.classList.add("active"),e.classList.add("active"),t==="newplant"&&xe()})})}function Tt(){var e;document.querySelectorAll(".pro-hz-btn").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".pro-hz-btn").forEach(i=>i.classList.remove("active")),t.classList.add("active");const o=t.getAttribute("data-hz"),r=document.getElementById("pro-custom-slider");o==="custom"?r.style.display="block":(r.style.display="none",document.getElementById("pro-sl-days").value=o,document.getElementById("pro-v-days").textContent=o+" days"),X()})}),(e=document.getElementById("pro-sl-days"))==null||e.addEventListener("input",()=>{const t=document.getElementById("pro-sl-days").value;document.getElementById("pro-v-days").textContent=t+" days",X()})}function St(){var o;const e=document.querySelector(".pro-hz-btn.active"),t=e==null?void 0:e.getAttribute("data-hz");return parseInt(t==="custom"?((o=document.getElementById("pro-sl-days"))==null?void 0:o.value)||30:t||30)}function Dt(e,t){var a;const o=e.filter(d=>d.isReady);if(!o.length)return null;const r=o.reduce((d,c)=>d.rev>c.rev?d:c),i=r.c.growDays,n=((a=r.market)==null?void 0:a.bestLabel)||"best market channel";return r.cyclesDone>=2?`Best sell window: sell ${r.c.name} at day ${i} through ${n}. At the current linked price (${_(r.market.bestPrice,2)}/kg), waiting past the first complete cycle adds freshness risk without a better price signal.`:`${r.c.name} is the best sale in this ${t}-day view: sell at day ${i} through ${n}, projected revenue ${_(r.rev,0)} at ${_(r.market.bestPrice,2)}/kg.`}function Bt(e,t,o,r){const i=new Date(r||Date.now());return i.setHours(0,0,0,0),Array.from({length:t},(n,a)=>{const d=a+1;let c=0,s=0;e.forEach(g=>{const l=Math.floor(d/g.growDays),u=Math.floor((d-1)/g.growDays),b=g.yieldKgPerRow*o;c+=l*b,l>u&&(s+=(l-u)*b)});const p=new Date(i.getTime()+(d-1)*864e5);return{day:d,actualDate:p,cumulativeKg:Number(c.toFixed(2)),dailyKg:Number(s.toFixed(2))}})}function Wt(e,t,o){if(!e||e<=0)return{people:0,pickers:0,packers:0,logistics:0,peakKg:0,peakDay:null,note:"No harvest is ready inside this horizon."};const r=o.reduce((d,c)=>c.dailyKg>d.dailyKg?c:d,o[0]||{day:0,dailyKg:0}),i=Math.max(1,Math.ceil(r.dailyKg/80)),n=Math.max(1,Math.ceil(r.dailyKg/60)),a=Math.max(1,Math.ceil(r.dailyKg/180));return{people:i+n+a,pickers:i,packers:n,logistics:a,peakKg:r.dailyKg,peakDay:r.day,note:`${Math.round(t)} rows ready in this horizon. Staffing is based on the peak harvest day, not the whole period.`}}function Ut(e){const t=document.getElementById("pro-hr-plan");t&&(t.innerHTML=[{val:e.people,label:"Total people"},{val:e.pickers,label:"Pickers"},{val:e.packers,label:"Packers"},{val:e.logistics,label:"Pickup/logistics"},{val:e.peakKg?e.peakKg.toFixed(1)+" kg":"—",label:e.peakDay?`Peak day ${e.peakDay}`:"Peak harvest"}].map(o=>`
    <div class="pro-plan-item">
      <div class="pro-plan-val">${y(o.val)}</div>
      <div class="pro-plan-lbl">${y(o.label)}</div>
    </div>`).join("")+`
    <div style="grid-column:1/-1;font-size:10px;color:#64748b;line-height:1.45;">
      ${y(e.note)} Assumption: 1 picker handles ~80 kg/day, 1 packer ~60 kg/day, 1 logistics person ~180 kg/day.
    </div>`)}function X(){const e=St(),t=ne,o=!t.length;document.getElementById("pro-forecast-empty").style.display=o?"block":"none",document.getElementById("pro-forecast-table").style.display=o?"none":"table";const r=Fe(),i=R(h),n=i&&(i.createdAt||i.created_at),a=n?new Date(n):new Date;isNaN(a.getTime())&&a.setTime(Date.now()),a.setHours(0,0,0,0);const d=Bt(t,e,r,a);let c=0,s=0,p=0;const g=t.map(m=>{const x=Math.floor(e/m.growDays),f=(e%m.growDays/m.growDays*100).toFixed(0),I=e>=m.growDays,$=I?Math.max(m.slots||1,x*(m.slots||1)):0,L=G(m),T=I?x*m.yieldKgPerRow*r:0,E=T*L.bestPrice;return I&&(c+=$,s+=T,p+=E),{c:m,rowCount:$,kg:T,rev:E,isReady:I,cyclesDone:x,partialPct:f,market:L}});document.getElementById("pro-kpi-rows").textContent=c,document.getElementById("pro-kpi-kg").textContent=s.toFixed(0)+" kg",document.getElementById("pro-kpi-rev").textContent="RM "+p.toFixed(0);const l=Wt(s,c,d);document.getElementById("pro-kpi-people").textContent=l.people,Ut(l),Ot(d);const u=Dt(g,e),b=document.getElementById("pro-sell-banner"),w=document.getElementById("pro-sell-text");u&&b&&w?(b.style.display="flex",w.textContent=u):b&&(b.style.display="none"),document.getElementById("pro-forecast-rows").innerHTML=g.map(m=>{let x;if(!m.isReady)x=`<span class="pro-badge pro-badge-amber">${m.partialPct}% grown</span>`;else{const f=e-m.c.growDays;f<=3?x='<span class="pro-badge pro-badge-green">✅ Ready</span>':f<=10?x=`<span class="pro-badge pro-badge-green">🌟 Ripe ×${m.cyclesDone}</span>`:f<=20?x='<span class="pro-badge pro-badge-amber">⚠ Overripe</span>':x='<span class="pro-badge pro-badge-red">🔴 Rotting</span>'}return`
      <tr>
        <td>${m.c.icon} ${m.c.name}</td>
        <td style="font-weight:700;color:#047857;">${m.isReady?m.rowCount:"—"}</td>
        <td>${m.isReady?m.kg.toFixed(1)+" kg":"—"}</td>
        <td>${m.isReady?`${_(m.market.bestPrice,2)}/kg <span style="font-size:9px;color:#64748b;">${y(m.market.bestLabel)}</span>`:"—"}</td>
        <td>${m.isReady?'<span style="color:#166534;font-weight:700;">RM '+m.rev.toFixed(0)+"</span>":"—"}</td>
        <td>${x}</td>
      </tr>`}).join(""),document.getElementById("pro-tl-bars").innerHTML=g.map(m=>{const x=Math.min(100,e/m.c.growDays*100),f=e-m.c.growDays,I=m.isReady?f<=10?"#22c55e":f<=20?"#f59e0b":"#ef4444":"#f59e0b";return`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="font-size:11px;min-width:90px;color:#64748b;">${m.c.icon} ${m.c.name}</span>
        <div class="pro-bar-track" style="flex:1;">
          <div class="pro-bar-fill" style="width:${x.toFixed(0)}%;background:${I};"></div>
        </div>
        <span style="font-size:10px;min-width:54px;text-align:right;color:#64748b;">
          Day ${m.c.growDays}
        </span>
      </div>`}).join("")}function Ot(e){const t=document.getElementById("pro-production-chart");if(!t)return;const o=()=>{ie&&(ie.destroy(),ie=null);const r=d=>d.toLocaleDateString(void 0,{month:"short",day:"numeric"}),i=d=>d.toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric",year:"numeric"}),n=e.map(d=>r(d.actualDate)),a=Math.max(1,Math.ceil(n.length/8));ie=new Chart(t,{type:"line",data:{labels:n,datasets:[{label:"Cumulative production (kg)",data:e.map(d=>d.cumulativeKg),borderColor:"#047857",backgroundColor:"rgba(34,197,94,.14)",borderWidth:2,fill:!0,tension:.25,pointRadius:e.map(d=>d.dailyKg>0?3:0),pointBackgroundColor:"#f59e0b"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{title:d=>{const c=e[d[0].dataIndex];return i(c.actualDate)+" (Day "+c.day+")"},label:d=>{const c=e[d.dataIndex],s=["Cumulative: "+c.cumulativeKg.toFixed(2)+" kg"];return c.dailyKg>0&&s.push("Harvest: +"+c.dailyKg.toFixed(2)+" kg"),s}}}},scales:{y:{beginAtZero:!0,ticks:{callback:d=>d+" kg",color:"#64748b",font:{size:10}},grid:{color:"#f1f5f9"}},x:{ticks:{color:"#64748b",font:{size:10},maxRotation:35,minRotation:0,callback:function(d,c){return c%a===0?this.getLabelForValue(d):""}},grid:{display:!1}}}}})};if(typeof Chart>"u"){const r=document.createElement("script");r.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",r.onload=o,document.head.appendChild(r)}else o()}function Ht(){var e,t,o,r,i,n;(e=document.getElementById("pro-np-search"))==null||e.addEventListener("input",()=>{const a=(document.getElementById("pro-np-search").value||"").toLowerCase().trim();$e=a?F.filter(d=>d.name.toLowerCase().includes(a)||d.id.includes(a)):[...F],ee()}),(t=document.getElementById("pro-np-search"))==null||t.addEventListener("keydown",a=>{if(a.key!=="Enter")return;const d=document.getElementById("pro-np-search").value||"",c=d.toLowerCase().trim();c&&(nt(F.find(s=>s.name.toLowerCase()===c||s.id===c)||it(d)),ee(),S())}),(o=document.getElementById("pro-qty-dec"))==null||o.addEventListener("click",()=>{B=Math.max(1,B-1),document.getElementById("pro-qty-disp").textContent=B,S()}),(r=document.getElementById("pro-qty-inc"))==null||r.addEventListener("click",()=>{B=Math.min(500,B+1),document.getElementById("pro-qty-disp").textContent=B,S()}),(i=document.getElementById("pro-unit-dec"))==null||i.addEventListener("click",()=>{K=Math.max(1,K-1),document.getElementById("pro-unit-disp").textContent=K,S()}),(n=document.getElementById("pro-unit-inc"))==null||n.addEventListener("click",()=>{K=Math.min(50,K+1),document.getElementById("pro-unit-disp").textContent=K,S()})}function ee(){var n;const e=document.getElementById("pro-np-suggestions");if(!e)return;const t=((n=document.getElementById("pro-np-search"))==null?void 0:n.value)||"",o=t.toLowerCase().trim(),r=o&&!F.some(a=>a.name.toLowerCase()===o||a.id===o),i=$e.slice(0,r?7:8);e.innerHTML=i.map(a=>{const d=G(a);return`
    <div class="pro-suggest-item ${a.id===U.id?"selected":""}" data-np-id="${a.id}">
      <span class="sp-ico">${a.icon}</span>
      <span>${a.name}</span>
      <span style="margin-left:auto;font-size:9px;color:#94a3b8;">${a.growDays}d · ${_(d.bestPrice,1)}/kg</span>
    </div>`}).join("")+(r?`
    <div class="pro-suggest-item ${U.id===Y(t)?"selected":""}" data-np-custom="${y(t)}">
      <span class="sp-ico">🌱</span>
      <span>Assess "${y(t)}"</span>
      <span style="margin-left:auto;font-size:9px;color:#94a3b8;">any species</span>
    </div>`:""),e.querySelectorAll(".pro-suggest-item").forEach(a=>{a.addEventListener("click",()=>{const d=a.getAttribute("data-np-custom");nt(d?it(d):F.find(c=>c.id===a.getAttribute("data-np-id"))||F[0]),ee(),S()})})}function ce(e){var o,r;const t=V&&(C==null?void 0:C.species)===e.id;(o=document.getElementById("pro-readiness-card"))==null||o.classList.toggle("pro-hidden",t),(r=document.getElementById("pro-impact-card"))==null||r.classList.toggle("pro-hidden",t)}function Ce(e,t){var Oe;const o=G(e),r=Fe(),i=tt(e),n=i==null?void 0:i.demand,a=(i==null?void 0:i.cropResourceProfile)||(n==null?void 0:n.cropResourceProfile)||null,d=e.yieldKgPerRow/t.baseUnitsPerRow,c=Number(a==null?void 0:a.yieldKgPerPlant),s=Number(a==null?void 0:a.harvestsPerCycle),p=Number.isFinite(s)&&s>0?Math.round(s):1,g=Number.isFinite(c)&&c>0?c*p:null,l=Math.max(2,d*2),u=!!(e.custom&&g&&g<=l),b=u?g:d,m=Number(e.growDays||((Oe=i==null?void 0:i.analysis)==null?void 0:Oe.estimatedHarvestDays)||60),x=b*t.totalUnits*r,f=x*o.bestPrice,I=4.33,$=e.waterLpR/t.baseUnitsPerRow,L=e.fertMLpR/t.baseUnitsPerRow,T=(e.energyKWhpR||0)/t.baseUnitsPerRow,E=t.totalUnits*$*W.waterRM*I,P=t.totalUnits*L*W.fertRM*I,de=t.totalUnits*T*W.energyRM,Z=n?Number(n.totalMonthlyCostRM||0):E+P+de,Ne=Number((n==null?void 0:n.waterCostPerMonth)??E),Ke=Number((n==null?void 0:n.fertCostPerMonth)??P),Ae=Number((n==null?void 0:n.lightCostPerMonth)??de),_e=Z*(m/30),st=f-_e,dt=new Date(Date.now()+m*24*60*60*1e3),Te=document.getElementById("pro-eco-yield"),Se=document.getElementById("pro-eco-value"),De=document.getElementById("pro-eco-cost"),Be=document.getElementById("pro-eco-profit"),We=document.getElementById("pro-eco-harvest-date"),Ue=document.getElementById("pro-eco-formula");if(Te&&(Te.textContent=x.toFixed(1)+" kg"),Se&&(Se.textContent="RM "+f.toFixed(0)),De&&(De.textContent="RM "+Z.toFixed(2)),Be&&(Be.textContent=_(st,0)),We&&(We.textContent=dt.toLocaleDateString(void 0,{month:"short",day:"numeric"})),Ue){const ct=Ge()?`${Math.round(r*100)}% Firebase sensor factor`:"no Firebase sensor factor applied",lt=n?`Extra cost/mo = water RM ${Ne.toFixed(2)} + fertilizer RM ${Ke.toFixed(2)} + light energy RM ${Ae.toFixed(2)} = RM ${Z.toFixed(2)}.`:`Extra cost/mo = fallback water RM ${Ne.toFixed(2)} + fertilizer RM ${Ke.toFixed(2)} + light energy RM ${Ae.toFixed(2)} = RM ${Z.toFixed(2)}.`,pt=u?`${b.toFixed(2)} kg/plant/cycle from crop resource profile`:`${b.toFixed(2)} kg/plant/cycle from SeedDown crop table`;Ue.textContent=`Yield = ${t.totalUnits} units x ${pt} x ${ct}. Market value = yield x ${_(o.bestPrice,2)}/kg via ${o.bestLabel}. ${lt} Profit = market value RM ${f.toFixed(0)} - harvest-period cost RM ${_e.toFixed(2)}.`}}function at(e=[]){return`
    <div class="pro-source-row" style="margin-top:8px;">
      ${e.map(t=>`
        <a class="pro-source-link" href="${y(t.url)}" target="_blank" rel="noopener noreferrer">
          ${y(t.label)}
        </a>`).join("")}
    </div>`}function S(){var x;const e=U,t=R(h),o=xt(t),r=ye(),i=o.reduce((f,I)=>f+(I.availableRows||0),0),n=Math.floor(i/r.unitsPerRow),a=o.length>0&&i<=0,d=i>=r.totalUnits,c=((x=o.filter(f=>f.harvIn>0).sort((f,I)=>f.harvIn-I.harvIn)[0])==null?void 0:x.harvIn)||e.growDays,s=G(e),p=document.getElementById("pro-qty-disp"),g=document.getElementById("pro-unit-disp"),l=document.getElementById("pro-qty-total");p&&(p.textContent=r.rows),g&&(g.textContent=r.unitsPerRow),l&&(l.textContent=`${r.totalUnits} total units (${r.rows} rows × ${r.unitsPerRow} units/row)`),xe(),ce(e);const u=document.getElementById("pro-readiness-block");u&&(a?u.innerHTML=`
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#fff1f2;border:1px solid #fecdd3;border-radius:10px;margin-bottom:12px;">
          <span style="font-size:24px;">⚠️</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:#991b1b;">No space available</div>
            <div style="font-size:11px;color:#64748b;margin-top:3px;">All layout zones are full. Earliest space is estimated in ${c} days after harvest.</div>
          </div>
        </div>`:u.innerHTML=`
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:${d?"#eff6ff":"#fff7ed"};border:1px solid ${d?"#bfdbfe":"#fed7aa"};border-radius:10px;margin-bottom:12px;">
          <span style="font-size:28px;">${e.icon}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:${d?"#1d4ed8":"#9a3412"};">
              ${d?`Ready to plant ${r.rows} rows of ${e.name}`:`Only ${i} units free now`}
            </div>
            <div style="font-size:10px;color:#64748b;margin-top:3px;">
              ${d?`This uses ${r.totalUnits} units; up to ${n} rows fit at ${r.unitsPerRow} units/row.`:`Plant ${Math.min(r.rows,n)} rows now at ${r.unitsPerRow} units/row, or wait ~${c} days for more space.`}
              Harvest in ~${e.growDays} days · ${_(s.bestPrice,2)}/kg via ${y(s.bestLabel)}
            </div>
          </div>
        </div>`);const b=document.getElementById("pro-zone-list");b&&(o.length?b.innerHTML=o.map(f=>{const I=f.fill>=90?"pro-badge-red":f.fill>=75?"pro-badge-amber":"pro-badge-green",$=f.fill>=90?"FULL":f.fill>=75?"NEAR FULL":"AVAILABLE",L=f.fill>=90?"#ef4444":f.fill>=75?"#f59e0b":"#22c55e";return`
          <div class="pro-zone-row">
            <div class="pro-zone-id">${f.id}</div>
            <div class="pro-zone-info">
              <div class="pro-zone-name">${f.emoji} ${f.crop} <span style="font-size:10px;color:#94a3b8;">· ${f.rows}/${f.capacity} units</span></div>
              <div class="pro-zone-meta">${f.availableRows} units free · ${f.harvIn?`est. harvest in ${f.harvIn} days`:"empty now"}</div>
              <div class="pro-zone-meter">
                <div class="pro-bar-track">
                  <div class="pro-bar-fill" style="width:${f.fill}%;background:${L};"></div>
                </div>
              </div>
            </div>
            <span class="pro-badge ${I}" style="margin-left:8px;">${$} ${f.fill}%</span>
          </div>`}).join(""):b.innerHTML='<div style="font-size:12px;color:#94a3b8;padding:8px 0;">No zone data — select a farm first.</div>'),`${e.id}|${r.rows}|${r.unitsPerRow}|${ae()||""}`!==D&&(z=null),Et(e,r),Ce(e,r),Q();const m=`${e.id}|${r.rows}|${r.unitsPerRow}|${r.totalUnits}|${ae()||""}|${(v==null?void 0:v.createdAt)||""}|${(M==null?void 0:M.createdAt)||""}|${v==null?void 0:v.temp}|${v==null?void 0:v.humid}|${v==null?void 0:v.water}|${v==null?void 0:v.soilRaw}|${M==null?void 0:M.waterDistanceCm}|${M==null?void 0:M.co2Ppm}`;m!==me&&(me=m,jt(e,r,o))}async function jt(e,t,o){var l,u,b,w,m;const r=document.getElementById("pro-np-ai"),i=document.getElementById("pro-np-ai-box");if(!r)return;i&&(i.className="pro-ai-inline"),r.className="pro-ai-loading",r.textContent=`Analysing ${t.rows} rows (${t.totalUnits} units) of ${e.name} against your current farm conditions…`;const n=R(h),a=v||await Ve(n),d=M||await Je(n);if(d&&!M&&(M=d,Q()),a&&!v&&(v=a,Q()),!Ge()&&!a&&!d){C={species:e.id,data:null},V=!1,i&&(i.className="pro-ai-inline warn"),r.className="",r.textContent=`No sensor reading found for ${Ye(n)}. Connect this farm to live sensor data before running crop suitability.`,Q(),ce(e);return}const c=(n==null?void 0:n.sensorCalibration)||((l=k.currentFarm)==null?void 0:l.sensorCalibration)||{},s=Me(n),p=(d==null?void 0:d.deviceId)||Qe(n),g={...s,deviceId:a!=null&&a.deviceId&&!O(a.deviceId)?a.deviceId:s.deviceId,zoneId:(a==null?void 0:a.zoneId)||s.zoneId,farmId:(a==null?void 0:a.farmId)||(d==null?void 0:d.farmId)||s.farmId,fieldId:(a==null?void 0:a.fieldId)||(d==null?void 0:d.fieldId)||s.fieldId};try{const x=await fetch(`${te}/api/whatif/newplant`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({species:e.custom?e.name:e.id,quantity:t.rows,unitsPerRow:t.unitsPerRow,totalUnits:t.totalUnits,currentCrops:o.map(P=>P.crop).filter(Boolean),...g,sensors:a,farmLevelSensors:d,zoneSensors:a,farmLevelDeviceId:p,calibration:c})}),f=await x.json().catch(()=>({}));if(!x.ok){const P=f.message||f.error||`API error ${x.status}`;throw new Error(P)}const I=f.insight||((u=f.analysis)==null?void 0:u.reason)||"",$=!!(f.unsuitable||((b=f.analysis)==null?void 0:b.suitable)===!1);C={species:e.id,data:f},V=$;const L=$?"bad":(w=f.warnings)!=null&&w.length?"warn":"";i&&(i.className=`pro-ai-inline${L?" "+L:""}`),r.className="";const T=!$&&f.sensorGap?qt(f.sensorGap,f.demand,f.resourceLinks):"";r.innerHTML=y(I||"AI analysis complete.")+T+($&&((m=f.resourceLinks)!=null&&m.length)?at(f.resourceLinks):"");const E=rt(e,t,f);E&&(z=E,D=`${e.id}|${t.rows}|${t.unitsPerRow}|${ae()||""}`,H(e,t,E)),Ce(e,t),ce(e)}catch{C={species:e.id,data:null},V=!1,i&&(i.className="pro-ai-inline"),r.className="",r.textContent="Using crop defaults and sensor readings for this estimate.",ce(e)}}function qt(e,t,o=[]){if(!e)return"";const r={ok:"✅",below:"⬇",above:"⬆",unknown:"❓"},i={ok:"#166534",below:"#9a3412",above:"#1d4ed8",unknown:"#64748b"},n={increase:"Increase",reduce:"Reduce",maintain:"Maintain",unknown:"No data"},a=Object.values(e).map(s=>{if(s.current===null||s.current===void 0)return`
        <tr>
          <td style="padding:5px 8px;font-size:10px;color:#64748b;">${y(s.label)}</td>
          <td style="padding:5px 8px;font-size:10px;color:#94a3b8;" colspan="3">No sensor data</td>
        </tr>`;const p=r[s.status]||"❓",g=i[s.status]||"#64748b",l=n[s.action]||s.action,u=s.calibrated===!1&&s.label==="Soil Moisture"?' <span style="color:#f97316;font-size:9px;">(uncalibrated)</span>':"";return`
      <tr>
        <td style="padding:5px 8px;font-size:10px;color:#475569;">${y(s.label)}</td>
        <td style="padding:5px 8px;font-size:11px;font-weight:700;color:${g};">${p} ${s.current}${y(s.unit)}${u}</td>
        <td style="padding:5px 8px;font-size:10px;color:#64748b;">${s.idealMin}–${s.idealMax}${y(s.unit)}</td>
        <td style="padding:5px 8px;font-size:10px;font-weight:600;color:${g};">${l}${s.status!=="ok"?` → ${s.target}${y(s.unit)}`:""}</td>
      </tr>`}).join(""),d=t?`
    <div style="margin-top:8px;padding:8px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:10px;color:#166534;line-height:1.6;">
      <strong>Extra resource demand per month:</strong>
      Water +${t.waterLPerMonth} L (RM ${t.waterCostPerMonth}) ·
      Nutrients +${t.fertMLPerWeek} mL/week (RM ${t.fertCostPerMonth}) ·
      Light +${t.lightKWhPerMonth} kWh (RM ${t.lightCostPerMonth}) ·
      <strong>Total: RM ${t.totalMonthlyCostRM}/mo</strong>
    </div>`:"",c=o!=null&&o.length?at(o):"";return`
    <div class="pro-ai-calc" style="margin-top:10px;">
      <div class="pro-ai-calc-title">Sensor vs crop ideal band</div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:5px 8px;font-size:9px;letter-spacing:.06em;color:#64748b;text-align:left;text-transform:uppercase;">Sensor</th>
            <th style="padding:5px 8px;font-size:9px;letter-spacing:.06em;color:#64748b;text-align:left;text-transform:uppercase;">Current</th>
            <th style="padding:5px 8px;font-size:9px;letter-spacing:.06em;color:#64748b;text-align:left;text-transform:uppercase;">Ideal</th>
            <th style="padding:5px 8px;font-size:9px;letter-spacing:.06em;color:#64748b;text-align:left;text-transform:uppercase;">Action</th>
          </tr>
        </thead>
        <tbody>${a}</tbody>
      </table>
      ${d}
      ${c}
    </div>`}function Zt(){const e=document.getElementById("screenContainer");e.innerHTML=`
    <div class="screen active" id="whatifProScreen">
      <div style="display:flex;align-items:center;padding:12px 16px;background:#fff;gap:12px;border-bottom:1px solid #e5e7eb;">
        <button id="whatifProBackBtn" class="back-btn" aria-label="Back" style="color:#166534;">←</button>
        <div style="font-weight:700;color:#17231b;">🔮 What-If Pro</div>
      </div>
      <div style="flex:1;overflow-y:auto;">${Ct()}</div>
    </div>
  `,document.getElementById("whatifProBackBtn").addEventListener("click",()=>ut("dash-c")),Nt()}export{Nt as init,Ct as render,Zt as renderScreen};
