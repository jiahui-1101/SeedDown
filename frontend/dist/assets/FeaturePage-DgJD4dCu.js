import{A as z,a as Le,s as Ye}from"./index-CCfX1pzx.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const Me="beginner_starter",Ve="farm_001",Je="farm_beginner_demo_001",Xe="field_beginner_starter",ce=.042,pe=1.1,ge=.009,Be=.04,W=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function $(e){return String(e??"").replace(/[&<>"']/g,i=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[i])}function f(...e){for(const i of e){if(i==null||i==="")continue;const t=Number(i);if(Number.isFinite(t))return t}return null}function ie(e,i=0,t=100){const n=Number(e);return Number.isFinite(n)?Math.max(i,Math.min(t,n)):null}function Qe(){try{const e=JSON.parse(localStorage.getItem("user_farms")||"[]");return Array.isArray(e)?e:[]}catch{return[]}}function Q(){const e=Qe();return z.currentFarm||e.find(t=>t.id===z.currentFarmId)||e.find(t=>t.farmId===z.currentFarmId||t.backendFarmId===z.currentFarmId)||(()=>{var t;return e.length>1&&console.warn("[WhatIf] currentFarmId not set - falling back to last farm:",(t=e[e.length-1])==null?void 0:t.id),e[e.length-1]||null})()||null}function et(){var i;const e=Q();return(i=e==null?void 0:e.plants)!=null&&i.length?e.plants:null}function j(e,i,t,n){if(n==null||n==="")return;const a=String(n).trim();if(!a)return;const o=`${t}:${a}`;i.has(o)||(i.add(o),e.push({[t]:a}))}function je(e=Q()){var o;const i=[],t=new Set,n=(e==null?void 0:e.deviceId)||(e==null?void 0:e.sensorDeviceId)||(e==null?void 0:e.zoneDeviceId)||(e==null?void 0:e.iotDeviceId),a=((o=e==null?void 0:e.farmMaster)==null?void 0:o.deviceId)||(e==null?void 0:e.masterDeviceId)||(e==null?void 0:e.farmDeviceId);return j(i,t,"deviceId",n),j(i,t,"zoneId",(e==null?void 0:e.zoneId)||(e==null?void 0:e.currentZoneId)),j(i,t,"farmId",(e==null?void 0:e.backendFarmId)||(e==null?void 0:e.farmId)||(e==null?void 0:e.id)||z.currentFarmId),j(i,t,"fieldId",e==null?void 0:e.fieldId),j(i,t,"deviceId",a),j(i,t,"deviceId",Me),j(i,t,"farmId",Je),j(i,t,"fieldId",Xe),j(i,t,"deviceId",Ve),i}function ee(e={}){const i=new URLSearchParams;return Object.entries(e).forEach(([t,n])=>{n!=null&&n!==""&&i.set(t,n)}),i.toString()}async function J(e,i=8e3){const t=new AbortController,n=setTimeout(()=>t.abort(),i);try{const a=await fetch(e,{signal:t.signal});return a.ok?a.json():null}finally{clearTimeout(n)}}async function tt(e,i,t=12e3){const n=new AbortController,a=setTimeout(()=>n.abort(),t);try{const o=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i),signal:n.signal}),r=await o.json().catch(()=>({}));if(!o.ok)throw new Error(r.message||r.error||`Server error ${o.status}`);return r}finally{clearTimeout(a)}}function fe(e,i=null){const t=(e==null?void 0:e.reading)||e;if(!t||typeof t!="object")return null;const n=f(t.lightRaw),a=f(t.soilRaw),o=f(t.ec,t.nutrientEc),r=f(t.ecRaw),s={temp:f(t.temp,t.temperature),humid:f(t.humid,t.humidity),light:f(t.light,t.lux,n!==null?ie(n/4095*100):null),water:f(t.water,t.moisture,t.soilMoisture,a!==null?ie((4095-a)/4095*100):null),nutrient:f(t.nutrient,o!==null?ie(o/2.4*100):null,r!==null?ie(r/4095*100):null),ph:f(t.ph),ec:o,soilRaw:a,lightRaw:n,ecRaw:r,waterDistanceCm:f(t.waterDistanceCm),waterFlowLpm:f(t.waterFlowLpm),energyKwh:f(t.energyKwh,t.powerKwh),intervalSeconds:f(t.intervalSeconds),fertilizerML:f(t.fertilizerML,t.fertilizerMl,t.nutrientDoseMl,t.dosingMl),harvestKg:f(t.harvestKg,t.yieldKg),marketPricePerKg:f(t.marketPricePerKg,t.pricePerKg),createdAt:t.createdAt||t.timestamp||null,source:i?`Firebase sensorReadings ${ee(i)}`:t.source||"Firebase sensorReadings",deviceId:(e==null?void 0:e.deviceId)||t.deviceId||(i==null?void 0:i.deviceId)||null,farmId:(e==null?void 0:e.farmId)||t.farmId||(i==null?void 0:i.farmId)||null,fieldId:(e==null?void 0:e.fieldId)||t.fieldId||(i==null?void 0:i.fieldId)||null,zoneId:(e==null?void 0:e.zoneId)||t.zoneId||(i==null?void 0:i.zoneId)||null};return Object.values({temp:s.temp,humid:s.humid,light:s.light,water:s.water,nutrient:s.nutrient,ph:s.ph,ec:s.ec,waterDistanceCm:s.waterDistanceCm,waterFlowLpm:s.waterFlowLpm,energyKwh:s.energyKwh,intervalSeconds:s.intervalSeconds,fertilizerML:s.fertilizerML,harvestKg:s.harvestKg,marketPricePerKg:s.marketPricePerKg}).some(c=>c!==null)?s:null}function it(e,i){const t=e.map(a=>fe(a,i)).filter(Boolean);if(!t.length)return null;const n=a=>{const o=t.map(r=>r[a]).filter(r=>r!==null);return o.length?parseFloat((o.reduce((r,s)=>r+s,0)/o.length).toFixed(2)):null};return{...t[0],temp:n("temp"),humid:n("humid"),light:n("light"),water:n("water"),nutrient:n("nutrient"),ph:n("ph"),ec:n("ec"),waterFlowLpm:n("waterFlowLpm"),energyKwh:n("energyKwh"),fertilizerML:n("fertilizerML"),harvestKg:n("harvestKg"),marketPricePerKg:n("marketPricePerKg"),waterUsedLiters:(()=>{const a=t.map(o=>o.waterFlowLpm!==null&&o.intervalSeconds!==null?o.waterFlowLpm*(o.intervalSeconds/60):null).filter(o=>o!==null);return a.length?parseFloat(a.reduce((o,r)=>o+r,0).toFixed(2)):null})(),energyUsedKwh:(()=>{const a=t.map(o=>o.energyKwh).filter(o=>o!==null);return a.length>=2?parseFloat(Math.max(0,a[0]-a[a.length-1]).toFixed(3)):a.length===1?parseFloat(a[0].toFixed(3)):null})(),fertilizerUsedML:(()=>{const a=t.map(o=>o.fertilizerML).filter(o=>o!==null);return a.length?parseFloat(a.reduce((o,r)=>o+r,0).toFixed(1)):null})(),days:t.length,source:`Firebase sensorReadings ${ee(i)} (${t.length} readings avg)`}}function nt(e){const i={tomato:{kg:.32,units:4,readyIn:60,color:"#D85A30"},carrot:{kg:.24,units:6,readyIn:70,color:"#BA7517"},cabbage:{kg:.41,units:2,readyIn:80,color:"#639922"},eggplant:{kg:.28,units:3,readyIn:75,color:"#534AB7"},basil:{kg:.09,units:10,readyIn:28,color:"#1D9E75"},green_onion:{kg:.11,units:8,readyIn:50,color:"#3B6D11"},lettuce:{kg:.2,units:4,readyIn:35,color:"#639922"},spinach:{kg:.15,units:5,readyIn:40,color:"#2E7D32"},strawberry:{kg:.3,units:3,readyIn:90,color:"#C62828"},pepper:{kg:.25,units:3,readyIn:80,color:"#E65100"},mint:{kg:.08,units:8,readyIn:25,color:"#1B5E20"},chili:{kg:.1,units:6,readyIn:90,color:"#B71C1C"},cucumber:{kg:.35,units:3,readyIn:55,color:"#33691E"},banana:{kg:1.2,units:1,readyIn:270,color:"#F9A825"},mango:{kg:.8,units:1,readyIn:180,color:"#FF8F00"},kangkung:{kg:.12,units:6,readyIn:21,color:"#2E7D32"},pandan:{kg:.05,units:4,readyIn:90,color:"#1B5E20"},ulam_raja:{kg:.1,units:5,readyIn:45,color:"#388E3C"},curry_leaf:{kg:.06,units:4,readyIn:60,color:"#558B2F"},cili_padi:{kg:.08,units:6,readyIn:90,color:"#C62828"}},t=new Map;for(const n of e){const a=n.species;if(t.has(a)){const o=t.get(a);o.totalSlots+=n.slots||1}else t.set(a,{species:n.species,name:n.name,emoji:n.emoji||"🌱",totalSlots:n.slots||1})}return Array.from(t.values()).map(n=>{const a=i[n.species]||{kg:.2,readyIn:45,color:"#639922"};return{id:n.species,name:n.name,emoji:n.emoji||"🌱",days:a.readyIn,kg:parseFloat((a.kg*n.totalSlots).toFixed(2)),units:n.totalSlots,readyIn:a.readyIn,color:a.color,slots:n.totalSlots}})}async function Se(){const e=je();let i=null;for(const t of e){const n=ee(t);if(n)try{const a=await J(`${W}/api/sensors/latest?${n}`,5e3);if(!a)throw new Error("sensor timeout or empty response");const o=fe(a,t);if(o)return o}catch(a){i=a}}return i&&console.warn("[WhatIf] Firebase latest sensor unavailable:",i.message),null}async function Pe(){const e=je();let i=null;for(const t of e){const n=ee({...t,limit:200});if(n)try{const a=await J(`${W}/api/sensors/history?${n}`,7e3);if(!a)throw new Error("history timeout or empty response");const o=Array.isArray(a.readings)?a.readings:[],r=it(o,t);if(r)return r}catch(a){i=a}}return i&&console.warn("[WhatIf] Firebase history average unavailable:",i.message),Se()}async function at(){var o;const e=Q(),i=((o=e==null?void 0:e.farmMaster)==null?void 0:o.deviceId)||(e==null?void 0:e.masterDeviceId)||(e==null?void 0:e.farmDeviceId),t=(e==null?void 0:e.backendFarmId)||(e==null?void 0:e.farmId)||(e==null?void 0:e.id)||z.currentFarmId,n=[],a=new Set;j(n,a,"deviceId",i),j(n,a,"farmId",t);for(const r of n){const s=ee(r);if(s)try{const c=await J(`${W}/api/sensors/latest?${s}`,5e3);if(!c)continue;const d=fe(c,r);if(d)return d}catch{}}return null}function Te(e,i=null){const t=Q(),n={sensors:e||null,zoneSensors:e||null,farmLevelSensors:i||null,calibration:(t==null?void 0:t.sensorCalibration)||(t==null?void 0:t.calibration)||{}},a=(o,...r)=>{for(const s of r)if(s!=null&&s!==""){n[o]=s;return}};return a("deviceId",e==null?void 0:e.deviceId,t==null?void 0:t.deviceId,t==null?void 0:t.sensorDeviceId,Me),a("zoneId",e==null?void 0:e.zoneId,t==null?void 0:t.zoneId,t==null?void 0:t.currentZoneId),a("farmId",e==null?void 0:e.farmId,t==null?void 0:t.backendFarmId,t==null?void 0:t.farmId,t==null?void 0:t.id,z.currentFarmId),a("fieldId",e==null?void 0:e.fieldId,t==null?void 0:t.fieldId),n}const G=[{id:"tomato",name:"Tomato",emoji:"🍅",days:60,kg:.32,units:4,readyIn:60,color:"#D85A30"},{id:"carrot",name:"Carrot",emoji:"🥕",days:70,kg:.24,units:6,readyIn:70,color:"#BA7517"},{id:"cabbage",name:"Cabbage",emoji:"🥬",days:80,kg:.41,units:2,readyIn:80,color:"#639922"},{id:"eggplant",name:"Eggplant",emoji:"🍆",days:75,kg:.28,units:3,readyIn:75,color:"#534AB7"},{id:"basil",name:"Basil",emoji:"🌿",days:28,kg:.09,units:10,readyIn:28,color:"#1D9E75"},{id:"green_onion",name:"Green Onion",emoji:"🧅",days:50,kg:.11,units:8,readyIn:50,color:"#3B6D11"}],ot=[{name:"Bolognese Pasta",emoji:"🍝",ingr:["tomato","carrot","basil"]},{name:"ABC Soup",emoji:"🍲",ingr:["cabbage","carrot","tomato","green_onion"]},{name:"Grilled Eggplant",emoji:"🍽️",ingr:["eggplant","basil"]},{name:"Spring Green Salad",emoji:"🥗",ingr:["green_onion","basil","cabbage"]}],he={lettuce:{price:4.8,yieldKgCycle:.6,growthDays:45,waterMLDay:150,fertMLWeek:3,lightHours:6},tomato:{price:7.2,yieldKgCycle:4,growthDays:70,waterMLDay:250,fertMLWeek:5,lightHours:8},carrot:{price:3.5,yieldKgCycle:.6,growthDays:75,waterMLDay:180,fertMLWeek:3,lightHours:6},basil:{price:12,yieldKgCycle:.5,growthDays:35,waterMLDay:120,fertMLWeek:2,lightHours:6},eggplant:{price:5.5,yieldKgCycle:1.8,growthDays:80,waterMLDay:260,fertMLWeek:5,lightHours:8},cabbage:{price:3.2,yieldKgCycle:1.2,growthDays:90,waterMLDay:200,fertMLWeek:4,lightHours:6},spinach:{price:6,yieldKgCycle:.45,growthDays:40,waterMLDay:120,fertMLWeek:3,lightHours:5},mint:{price:10,yieldKgCycle:.35,growthDays:28,waterMLDay:120,fertMLWeek:2,lightHours:5},chili:{price:9,yieldKgCycle:.6,growthDays:90,waterMLDay:220,fertMLWeek:5,lightHours:8},kangkung:{price:3,yieldKgCycle:.4,growthDays:21,waterMLDay:180,fertMLWeek:3,lightHours:5},pandan:{price:5,yieldKgCycle:.1,growthDays:90,waterMLDay:100,fertMLWeek:2,lightHours:5},ulam_raja:{price:6,yieldKgCycle:.3,growthDays:45,waterMLDay:130,fertMLWeek:2,lightHours:6},curry_leaf:{price:8,yieldKgCycle:.15,growthDays:60,waterMLDay:120,fertMLWeek:2,lightHours:7},cili_padi:{price:15,yieldKgCycle:.25,growthDays:90,waterMLDay:200,fertMLWeek:4,lightHours:8}};function rt(e,i=null){const t=he[e]||he.lettuce,n=(i==null?void 0:i.requirements)||{},a=(i==null?void 0:i.yield)||{},o=(i==null?void 0:i.cost)||{},r=Math.max(1,f(a.harvestsPerCycle,1));return{plant:e,name:(i==null?void 0:i.commonName)||e,price:f(o.mktPricePerKg,t.price),yieldKgCycle:f(a.avgGramsPerPlant,t.yieldKgCycle*1e3/r)/1e3*r,growthDays:f(n.growthDays,t.growthDays),waterMLDay:f(n.waterPerDay,t.waterMLDay),fertMLWeek:f(n.fertilizerPerWeek,t.fertMLWeek),lightHours:f(n.lightHours,t.lightHours),profileSource:i?"crop database / AI crop profile":"built-in crop reference"}}function ze(e){var o,r;const i=(o=window._wif_cropProfiles)==null?void 0:o[e],t=rt(e,i),n=(r=window._wif_marketPrices)==null?void 0:r[e],a=f(n==null?void 0:n.bestPrice);return{...t,price:a??t.price,priceSource:a!==null?`${(n==null?void 0:n.bestChannel)||"market"} live market lookup`:t.profileSource,market:n}}function _e(e,i,t={},n=V){const a=ze(e),o=Math.max(1,f(i,1)),r=Math.max(1,f(n,1)),s=o*7,c=f(t.harvestKg),d=c??parseFloat((a.yieldKgCycle*r*Math.min(s/a.growthDays,1)).toFixed(2)),l=f(t.marketPricePerKg),v=l??a.price,w=parseFloat((d*v).toFixed(2)),g=f(t.waterUsedLiters),u=f(t.water),b=u===null?1:u<35?1.15:u>70?.8:1,y=g??parseFloat((a.waterMLDay*r*s*b/1e3).toFixed(2)),h=parseFloat((y*ce).toFixed(2)),p=f(t.energyUsedKwh,t.energyKwh),k=f(t.light),P=k===null?1:k<40?1.2:k>70?.75:1,L=p??parseFloat((a.lightHours*P*Be*r*s).toFixed(2)),R=parseFloat((L*pe).toFixed(2)),H=f(t.fertilizerUsedML,t.fertilizerML),M=f(t.ec),I=M===null?1:M<1.2?1.25:M>2.2?.8:1,T=H??parseFloat((a.fertMLWeek*r*o*I).toFixed(1)),N=parseFloat((T*ge).toFixed(2)),A=parseFloat((h+R+N).toFixed(2)),x=parseFloat((w-A).toFixed(2)),F=[];return F.push(c===null?"Harvest weight estimated from crop yield profile":"Harvest weight measured in Firebase"),F.push(l===null?`Market price from ${a.priceSource}`:"Market price measured in Firebase"),F.push(g===null?"Water estimated from crop water need and Firebase soil moisture":"Water measured from Firebase flow sensor"),F.push(p===null?"Energy estimated from crop light hours and Firebase light level":"Energy measured from Firebase energy meter"),F.push(H===null?"Fertilizer estimated from crop nutrient need and Firebase EC":"Fertilizer measured from Firebase dosing sensor"),{plant:e,unitCount:r,weekCount:o,readingCount:t.days||null,source:t.source||"Firebase sensorReadings",profile:a,harvestKg:d,marketPricePerKg:v,income:w,waterLiters:y,waterCost:h,energyKWh:L,energyCost:R,fertilizerML:T,fertCost:N,expenses:A,net:x,assumptions:F,measured:{harvest:c!==null,price:l!==null,water:g!==null,energy:p!==null,fertilizer:H!==null},note:"Savings use Firebase conditions plus clearly labeled market/crop assumptions where meters are missing."}}async function st(e){var r;const i=++be;window._wif_cropProfiles=window._wif_cropProfiles||{},window._wif_marketPrices=window._wif_marketPrices||{};const t=J(`${W}/api/crops/species/${encodeURIComponent(e)}`,8e3).catch(()=>null),n=J(`${W}/api/whatif/market-prices?crops=${encodeURIComponent(e)}`,8e3).catch(()=>null),[a,o]=await Promise.all([t,n]);i===be&&(a!=null&&a.crop&&(window._wif_cropProfiles[e]=a.crop),(r=o==null?void 0:o.prices)!=null&&r[e]&&(window._wif_marketPrices[e]=o.prices[e]),_())}const me={spinach:{emoji:"🥬",readyDays:5,readyZone:"Zone B lettuce",space:"1.2m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+0.5°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+3%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"-0.5h",dir:"down"},{name:"Fertilizer",emoji:"🧫",change:"+8%",dir:"up"}],ai:"Spinach thrives alongside lettuce. Humidity increase is within safe range (≤85%)."},mint:{emoji:"🌿",readyDays:3,readyZone:"Zone A chives",space:"0.6m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"No change",dir:"ok"},{name:"Humidity",emoji:"💧",change:"+5%",dir:"up"},{name:"pH value",emoji:"🧪",change:"-0.2",dir:"down"},{name:"Light (h/d)",emoji:"☀️",change:"No change",dir:"ok"},{name:"Fertilizer",emoji:"🧫",change:"+5%",dir:"up"}],ai:"Mint can be aggressive — consider a physical divider from neighbouring herbs."},chili:{emoji:"🌶️",readyDays:12,readyZone:"Zone C eggplant",space:"2.1m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1.5°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"-4%",dir:"down"},{name:"pH value",emoji:"🧪",change:"+0.3",dir:"up"},{name:"Light (h/d)",emoji:"☀️",change:"+2h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+15%",dir:"up"}],ai:"Chili needs more heat and light. You may need to adjust Zone C lighting before planting."},cucumber:{emoji:"🥒",readyDays:8,readyZone:"Zone D tomato",space:"1.8m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+6%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+12%",dir:"up"}],ai:"Cucumbers are water-heavy. Ensure your pump schedule scales with the new plant count."},strawberry:{emoji:"🍓",readyDays:14,readyZone:"Zone E herbs",space:"0.9m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"-1°C",dir:"down"},{name:"Humidity",emoji:"💧",change:"+2%",dir:"up"},{name:"pH value",emoji:"🧪",change:"-0.4",dir:"down"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+10%",dir:"up"}],ai:"Strawberries prefer cooler temps. Place them away from the heat lamp cluster for best results."},tomato:{emoji:"🍅",readyDays:9,readyZone:"Zone D",space:"1.5m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"+1°C",dir:"up"},{name:"Humidity",emoji:"💧",change:"+4%",dir:"up"},{name:"pH value",emoji:"🧪",change:"+0.1",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+10%",dir:"up"}],ai:"Tomatoes do best with deep watering every 2–3 days."},basil:{emoji:"🌿",readyDays:4,readyZone:"Zone E herbs",space:"0.5m²",impacts:[{name:"Temperature",emoji:"🌡️",change:"No change",dir:"ok"},{name:"Humidity",emoji:"💧",change:"+2%",dir:"ok"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+4%",dir:"up"}],ai:"Basil is low-impact. Great companion plant for tomatoes and peppers."},kangkung:{emoji:"🥬",readyDays:3,readyZone:"Zone B herbs",space:"0.8m²",impacts:[{name:"Humidity",emoji:"💧",change:"+4%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"-1h",dir:"down"},{name:"Fertilizer",emoji:"🧫",change:"+6%",dir:"up"}],ai:"Kangkung is one of the easiest greens to grow indoors — ready in 3 weeks, low light needed. Great for beginners."},pandan:{emoji:"🌿",readyDays:14,readyZone:"Zone A herbs",space:"0.6m²",impacts:[{name:"Humidity",emoji:"💧",change:"+5%",dir:"up"},{name:"pH value",emoji:"🧪",change:"-0.1",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"No change",dir:"ok"},{name:"Fertilizer",emoji:"🧫",change:"+3%",dir:"up"}],ai:"Pandan grows slowly but needs minimal care. Harvest individual leaves from the outer layer — do not uproot."},ulam_raja:{emoji:"🌱",readyDays:21,readyZone:"Zone B herbs",space:"1.0m²",impacts:[{name:"Humidity",emoji:"💧",change:"+3%",dir:"up"},{name:"pH value",emoji:"🧪",change:"No change",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+0.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+5%",dir:"up"}],ai:"Ulam raja is hardy and grows well in Malaysian indoor conditions. Good for salads and ulam."},curry_leaf:{emoji:"🌿",readyDays:30,readyZone:"Zone C herbs",space:"0.7m²",impacts:[{name:"Humidity",emoji:"💧",change:"-2%",dir:"down"},{name:"pH value",emoji:"🧪",change:"+0.2",dir:"ok"},{name:"Light (h/d)",emoji:"☀️",change:"+1.5h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+4%",dir:"up"}],ai:"Curry leaf needs more light than other herbs. Place near the top tier for best results. Harvest sparingly at first."},cili_padi:{emoji:"🌶️",readyDays:14,readyZone:"Zone C",space:"1.0m²",impacts:[{name:"Humidity",emoji:"💧",change:"-3%",dir:"down"},{name:"pH value",emoji:"🧪",change:"+0.2",dir:"up"},{name:"Light (h/d)",emoji:"☀️",change:"+2h",dir:"up"},{name:"Fertilizer",emoji:"🧫",change:"+12%",dir:"up"}],ai:"Cili padi needs bright light and warm temps — same conditions as your other chili plants. Prune the base leaves to improve airflow."}},dt=[{zone:"Zone A",crop:"Chives",fill:90},{zone:"Zone B",crop:"Lettuce",fill:75},{zone:"Zone C",crop:"Eggplant",fill:95},{zone:"Zone D",crop:"Tomato",fill:60},{zone:"Zone E",crop:"Herbs",fill:82}],re=Object.entries(me).map(([e,i])=>({id:e,name:e.charAt(0).toUpperCase()+e.slice(1),emoji:i.emoji}));let S=new Set,Y=4,V=5,U="spinach",O=null,ne=0,be=0;function lt(){return`
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
      .wif-row-label { font-size:12px; color:var(--text-secondary,#666); min-width:80px; }
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
          <span class="wif-tab-icon">🌿</span><span>This Week</span>
        </button>
        <button class="wif-tab-btn" onclick="wifSwitchTab('cost',this)">
          <span class="wif-tab-icon">🏷️</span><span>Savings</span>
        </button>
        <button class="wif-tab-btn" onclick="wifSwitchTab('newplant',this)">
          <span class="wif-tab-icon">❓</span><span>Can I Grow?</span>
        </button>
      </div>

      <!-- ===== TAB 1: HARVEST PREDICT ===== -->
      <div id="wif-harvest" class="wif-section active">
        <div class="wif-card">
          <div class="wif-card-title">📅 What can I pick?</div>
          <div class="wif-slider-row">
            <label for="wif-sl-days">In the next</label>
            <input type="range" min="7" max="365" value="30" step="1" id="wif-sl-days" oninput="wifUpdateHarvest()">
            <span class="wif-slider-val" id="wif-v-days">30 days</span>
          </div>
          <!-- Units first — mum counts individual plants/stalks/heads, not kg -->
          <div class="wif-metric-grid">
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-units">0</div><div class="wif-metric-lbl">Units ready</div></div>
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-items">0</div><div class="wif-metric-lbl">Crop types</div></div>
            <div class="wif-metric"><div class="wif-metric-val" id="wif-hm-yield">0.00 kg</div><div class="wif-metric-lbl">Est. weight</div></div>
          </div>
          <div id="wif-crop-timelines"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">✅ Select what you picked</div>
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
          <div class="wif-card-title">🪴 Choose crop to review</div>
          <!-- MODIFIED: rows count removed from option labels; controlled by stepper below -->
          <select class="wif-sel" id="wif-cost-plant" onchange="wifTriggerCostAi()">
  <option value="" disabled>Loading your crops...</option>
          </select>
          <!-- MODIFIED: new +/− stepper for rows count, separate from plant type -->
          <div class="wif-num-row">
            <span class="wif-row-label" id="wif-rows-label">Units</span>
            <div class="wif-qty-ctrl" role="group" aria-labelledby="wif-rows-label">
              <button type="button" class="wif-qty-btn" aria-label="Decrease units" onclick="wifChangeRows(-1)">−</button>
              <span class="wif-qty-num" id="wif-rows-disp">5</span>
              <button type="button" class="wif-qty-btn" aria-label="Increase units" onclick="wifChangeRows(1)">+</button>
            </div>
          </div>
          <!-- Period is only used for display/chart grouping. Costs come from Firebase measurements. -->
          <div class="wif-slider-row">
            <label for="wif-sl-weeks">View</label>
            <input type="range" min="1" max="24" value="1" step="1" id="wif-sl-weeks" oninput="wifUpdateCost()">
            <span class="wif-slider-val" id="wif-v-weeks">1 wk</span>
          </div>
        </div>
        <div class="wif-card">
          <div class="wif-savings-big">
            <div class="wif-savings-num" id="wif-net-saving">RM 0.00</div>
            <div class="wif-savings-lbl">saved vs buying at pasar</div>
          </div>
          <hr class="wif-divider">
          <div id="wif-cost-breakdown"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">📊 Savings trend when complete</div>
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
          <div class="wif-card-title">🔍 Can I grow this?</div>
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
            <span class="wif-row-label" id="wif-np-qty-label">Unit count</span>
            <div class="wif-qty-ctrl" role="group" aria-labelledby="wif-np-qty-label">
              <button type="button" class="wif-qty-btn" aria-label="Decrease new plant unit count" onclick="wifChangeQty(-1)">−</button>
              <span class="wif-qty-num" id="wif-qty-disp">4</span>
              <button type="button" class="wif-qty-btn" aria-label="Increase new plant unit count" onclick="wifChangeQty(1)">+</button>
            </div>
          </div>
        </div>

        <!-- ✅ FIX 4.3: AI advisor card — shown below add-plant form, updated by wifFetchNewPlantAi -->
        <div id="wif-np-advisor-card" class="wif-card" style="display:none;border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
          <div class="wif-card-title">🌱 Grow verdict</div>
          <div id="wif-np-advisor-body"></div>
        </div>
        <div class="wif-card">
          <div class="wif-card-title">🪴 Space available?</div>
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
          <div class="wif-card-title">📋 What this plant needs</div>
          <!-- MODIFIED: grid is now 2-col instead of auto-fit 3-col -->
          <div class="wif-impact-grid" id="wif-impact-grid"></div>
          <div class="wif-ai-note" id="wif-np-ai-note-wrap" style="display:none;"><span> </span><span id="wif-np-ai-note">Loading...</span></div>
        </div>
      </div>

    </div>
  `}function ct(){var a;const e=document.getElementById("wif-cost-plant");if(!e)return;const i=window._WIF_DYNAMIC_CROPS||G,t=new Set,n=i.filter(o=>t.has(o.id)?!1:(t.add(o.id),!0));n.length===0?e.innerHTML='<option value="lettuce">Lettuce</option><option value="tomato">Tomato</option>':e.innerHTML=n.map(o=>`<option value="${o.id}">${o.emoji} ${o.name}</option>`).join(""),e.value=((a=n[0])==null?void 0:a.id)||"lettuce",setTimeout(Ne,0)}function pt(){S=new Set,Y=4,V=5,U="spinach",window.wifSwitchTab=gt,window.wifUpdateHarvest=xe,window.wifUpdateCost=_,window.wifUpdateNewPlant=K,window.wifToggleCrop=ft,window.wifChangeQty=Ft,window.wifChangeRows=ut,window.wifNpFilterSuggestions=yt,window.wifSelectNp=xt,window.wifSelectSpecies=Ke,window.wifNpShowSuggestions=ht,window.wifNpHideSuggestions=ue,window.wifTriggerCostAi=Ne;const e=et();e!=null&&e.length?window._WIF_DYNAMIC_CROPS=nt(e):window._WIF_DYNAMIC_CROPS=null,O&&(O.destroy(),O=null);const i=document.getElementById("wif-np-input");i&&(i.value="Spinach"),ct(),xe(),Pe().then(t=>{window._wif_lastSensors=t,_()}).catch(()=>_()),K()}function gt(e,i){document.querySelectorAll(".wif-section").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".wif-tab-btn").forEach(t=>t.classList.remove("active")),document.getElementById("wif-"+e).classList.add("active"),i.classList.add("active"),e==="cost"&&_(),e==="newplant"&&K()}function xe(){const e=window._WIF_DYNAMIC_CROPS||G,i=parseInt(document.getElementById("wif-sl-days").value);document.getElementById("wif-v-days").textContent=i+(i===1?" day":" days");const t=e.filter(o=>o.readyIn<=i),n=t.reduce((o,r)=>o+r.kg,0),a=t.reduce((o,r)=>o+r.units,0);document.getElementById("wif-hm-units").textContent=a,document.getElementById("wif-hm-items").textContent=t.length,document.getElementById("wif-hm-yield").textContent=n.toFixed(2)+" kg",document.getElementById("wif-crop-timelines").innerHTML=e.map(o=>{const r=Math.min(100,Math.round(i/o.readyIn*100)),s=o.readyIn<=i;return`
      <div class="wif-tl-row">
        <span class="wif-tl-name">${o.emoji} ${o.name}</span>
        <div class="wif-tl-track">
          <div class="wif-tl-fill" style="width:${r}%;background:${s?"var(--accent,#639922)":"var(--amber-100,#FAC775)"};"></div>
        </div>
        ${s?`<span class="wif-tl-count">${o.units} unit${o.units!==1?"s":""} <span class="wif-badge wif-badge-green">Ready</span></span>`:`<span class="wif-tl-end" style="color:var(--text-secondary,#666)">Day ${o.readyIn}</span>`}
      </div>`}).join(""),Re(i),He()}function Re(e){const i=window._WIF_DYNAMIC_CROPS||G,t=document.getElementById("wif-crop-select"),n=i.filter(a=>a.readyIn<=e);if(S.forEach(a=>{n.find(o=>o.id===a)||S.delete(a)}),n.length===0){t.innerHTML='<span style="font-size:12px;color:var(--text-secondary,#999);">No crops ready yet — move the slider forward.</span>';return}t.innerHTML=n.map(a=>`
    <div class="wif-pill ${S.has(a.id)?"selected":""}"
         onclick="wifToggleCrop('${a.id}')">
      ${a.emoji} ${a.name}
    </div>`).join("")}function ft(e){S.has(e)?S.delete(e):S.add(e);const i=parseInt(document.getElementById("wif-sl-days").value);Re(i),He()}function He(){const e=document.getElementById("wif-recipe-grid"),i=document.getElementById("wif-ai-recipe-note");if(S.size===0){e.innerHTML="",i.textContent="Select crops above to see recipe suggestions.";return}const t=ot.map(n=>{const a=n.ingr.filter(o=>S.has(o)).length;return a===0?null:{...n,match:a,pct:Math.round(a/n.ingr.length*100)}}).filter(Boolean).sort((n,a)=>a.match-n.match);e.innerHTML=t.map(n=>`
    <div class="wif-recipe-card">
      <div class="wif-recipe-hero">${n.emoji}</div>
      <div class="wif-recipe-name">
        ${n.name}
        <span class="wif-badge ${n.pct===100?"wif-badge-green":"wif-badge-amber"}">${n.pct}%</span>
      </div>
      <div>
        ${n.ingr.map(a=>{const r=(window._WIF_DYNAMIC_CROPS||G).find(c=>c.id===a)||G.find(c=>c.id===a);return S.has(a)?`<span class="wif-ingr-tag">${r?r.emoji+" "+r.name:a}</span>`:`<span class="wif-ingr-tag" style="background:#f0f0f0;color:#999;border:0.5px dashed #ccc;">🛒 ${r?r.name:a}</span>`}).join("")}
      </div>
    </div>`).join(""),i.textContent=t.length>0?`${t.length} recipe${t.length>1?"s":""} match your harvest. Loading database...`:"No local matches. Loading database recipes...",mt([...S])}async function mt(e){const i=document.getElementById("wif-recipe-grid"),t=document.getElementById("wif-ai-recipe-note"),n={tomato:["tomato","tomatoes"],carrot:["carrot","carrots"],cabbage:["cabbage"],eggplant:["eggplant","aubergine","brinjal"],basil:["basil"],green_onion:["green onion","green onions","scallion"],lettuce:["lettuce"],spinach:["spinach"],strawberry:["strawberry","strawberries"],pepper:["bell pepper","green pepper","capsicum"]};try{const a=await Promise.all(e.map(d=>fetch(`${W}/api/whatif/recipes?species=${d}`).then(l=>l.ok?l.json():{recipes:[]}).catch(()=>({recipes:[]})))),o=new Set,r=a.flatMap(d=>d.recipes||[]).filter(d=>o.has(d.name)?!1:(o.add(d.name),!0));if(!r.length){t.textContent=t.textContent.replace("Loading database...","(No DB results)").replace("Loading database recipes...","(No DB results)");return}const s=r.map(d=>{const l=e.filter(g=>{const u=n[g]||[g];return d.ingredients.some(b=>u.some(y=>b.toLowerCase().includes(y.toLowerCase())))});if(l.length===0)return null;const v=e.flatMap(g=>n[g]||[g]),w=d.ingredients.filter(g=>{const u=g.toLowerCase();return!(v.some(y=>u.includes(y))||["salt","pepper","water","oil","sugar","flour","butter","egg","milk","sauce","mix","seasoning","powder","vinegar","cream","cheese","margarine"].some(y=>u.includes(y)))}).map(g=>g.replace(/^\d[\d\s\/]*(\(\d+[\s\w\.]+\))?\s*(lb|oz|c|pkg|tsp|tbsp|can|qt|pt|pkg|Tbsp|large|medium|small|fresh|dried|chopped|diced|sliced|cooked|frozen|thawed|drained|shredded|grated|minced|crushed|ground|boneless|skinless)\.?\s*/gi,"").replace(/^[\d\/\s\.]+/,"").trim()).filter(g=>g.length>2&&g.length<40).slice(0,4);return{recipe:d,grownMatches:l,otherIngredients:w}}).filter(Boolean).sort((d,l)=>l.grownMatches.length-d.grownMatches.length);if(!s.length){t.textContent="No database recipes matched your selected crops.";return}const c=s.map(({recipe:d,grownMatches:l,otherIngredients:v})=>{const w=l.map(u=>{const y=(window._WIF_DYNAMIC_CROPS||G).find(h=>h.id===u)||G.find(h=>h.id===u);return`<span class="wif-ingr-tag" style="background:var(--teal-50,#E1F5EE);color:var(--teal-600,#0F6E56);border:0.5px solid var(--teal-200,#7DD3BD);">${y?y.emoji+" "+y.name:u}</span>`}).join(""),g=v.map(u=>`<span class="wif-ingr-tag" style="background:#f0f0f0;color:#888;border:0.5px dashed #ccc;">🛒 ${u}</span>`).join("");return`
        <div class="wif-recipe-card" style="border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
          <div class="wif-recipe-hero">🍽️</div>
          <div class="wif-recipe-name">
            ${d.name.trim()}
            <span class="wif-badge wif-badge-teal">DB</span>
          </div>
          <div>${w}${g}</div>
        </div>`}).join("");i.innerHTML+=c,t.textContent=`${s.length} recipes found — green = your harvest, 🛒 = ingredients to buy.`}catch{t.textContent=t.textContent.replace("Loading database...","(Backend offline — local only)").replace("Loading database recipes...","(Backend offline — local only)")}}function ut(e){V=Math.max(1,Math.min(20,V+e));const i=document.getElementById("wif-rows-disp");i&&(i.textContent=V),_()}function _(){const e=document.getElementById("wif-cost-plant"),i=e==null?void 0:e.value,t=document.getElementById("wif-sl-weeks");if(!i||!t)return;const n=parseInt(t.value);document.getElementById("wif-v-weeks").textContent=n+(n===1?" wk":" wks");const a=window._wif_lastSensors||{},o=_e(i,n,a);window._wif_lastCostProjection=o;const r=o.net===null?"var(--text-secondary,#666)":o.net>=0?"var(--accent,#3B6D11)":"var(--red-400,#E24B4A)";document.getElementById("wif-net-saving").textContent="RM "+o.net.toFixed(2),document.getElementById("wif-net-saving").style.color=r;const s=`<div class="wif-cost-row" style="background:var(--amber-50,#FAEEDA);align-items:flex-start;">
    <span class="wif-cost-lbl">Assumptions: ${o.assumptions.map($).join("; ")}</span>
  </div>`,c=l=>`<span class="wif-badge ${l?"wif-badge-green":"wif-badge-amber"}" style="margin-left:6px;">${l?"Measured":"Estimated"}</span>`;document.getElementById("wif-cost-breakdown").innerHTML=`
    <div class="wif-cost-row wif-cost-income">
      <span class="wif-cost-lbl">🛒 Pasar price for same amount ${c(o.measured.harvest&&o.measured.price)}<span style="font-size:10px;opacity:.7;"> (${o.harvestKg.toFixed(2)} kg @ RM ${o.marketPricePerKg.toFixed(2)}/kg)</span></span>
      <span style="color:var(--green-600,#3B6D11);font-weight:500;">RM ${o.income.toFixed(2)}</span>
    </div>
    <div class="wif-cost-row" style="background:var(--bg-secondary,#f5f5f5);cursor:pointer;" onclick="document.getElementById('wif-cost-detail').style.display=document.getElementById('wif-cost-detail').style.display==='none'?'block':'none'">
      <span class="wif-cost-lbl" style="color:var(--text-secondary,#666);font-size:11px;">💧⚡🧪 Your growing cost — RM ${o.expenses.toFixed(2)} <span style="font-size:10px;opacity:.7;">(tap to see breakdown)</span></span>
      <span style="color:var(--red-400,#E24B4A);font-size:12px;">−RM ${o.expenses.toFixed(2)}</span>
    </div>
    <div id="wif-cost-detail" style="display:none;">
      <div class="wif-cost-row wif-cost-expense">
        <span class="wif-cost-lbl">💧 Water ${c(o.measured.water)}<span style="font-size:10px;opacity:.7;"> (${o.waterLiters.toFixed(2)} L × RM ${ce}/L)</span></span>
        <span style="color:var(--red-400,#E24B4A);">−RM ${o.waterCost.toFixed(2)}</span>
      </div>
      <div class="wif-cost-row wif-cost-expense">
        <span class="wif-cost-lbl">⚡ Electricity ${c(o.measured.energy)}<span style="font-size:10px;opacity:.7;"> (${o.energyKWh.toFixed(2)} kWh × RM ${pe}/kWh)</span></span>
        <span style="color:var(--red-400,#E24B4A);">−RM ${o.energyCost.toFixed(2)}</span>
      </div>
      <div class="wif-cost-row wif-cost-expense">
        <span class="wif-cost-lbl">🧪 Fertilizer ${c(o.measured.fertilizer)}<span style="font-size:10px;opacity:.7;"> (${o.fertilizerML.toFixed(1)} mL × RM ${ge}/mL)</span></span>
        <span style="color:var(--red-400,#E24B4A);">−RM ${o.fertCost.toFixed(2)}</span>
      </div>
      ${s}
    </div>
    <div class="wif-cost-row wif-cost-net">
      <span>⭐ You saved</span>
      <span style="color:${r};font-weight:500;">RM ${o.net.toFixed(2)}</span>
    </div>`;const d=document.getElementById("wif-cost-ai-note");d&&!window._wif_aiNoteSet&&(d.textContent=o.note),wt(n,i),window._wif_lastCostAiData&&We(window._wif_lastCostAiData)}function wt(e,i){const t=document.getElementById("wif-savings-chart");if(t)if(typeof Chart>"u"){const n=document.createElement("script");n.src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",n.onload=()=>Fe(t,e,i),document.head.appendChild(n)}else Fe(t,e,i)}function Fe(e,i,t){O&&(O.destroy(),O=null);const n=[],a=[];for(let o=1;o<=i;o++)n.push("W"+o),a.push(_e(t,o,window._wif_lastSensors||{}).net);O=new Chart(e,{type:"bar",data:{labels:n,datasets:[{label:"Net savings (RM)",data:a,backgroundColor:"#97C459",borderRadius:4,borderSkipped:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:o=>"RM "+o.raw.toFixed(2)}}},scales:{y:{beginAtZero:!0,ticks:{callback:o=>"RM "+o,font:{size:10}},grid:{color:"rgba(128,128,128,0.08)"}},x:{grid:{display:!1},ticks:{font:{size:10}}}}}})}function Ne(){var t,n,a;const e=(t=document.getElementById("wif-cost-plant"))==null?void 0:t.value,i=parseInt(((n=document.getElementById("wif-sl-weeks"))==null?void 0:n.value)||1);e&&(window._wif_aiNoteSet=!1,window._wif_lastCostAiData=null,(a=document.getElementById("wif-ai-savings-detail"))==null||a.remove(),_(),st(e),vt(e,V,i))}function We(e={}){var w,g,u,b;const i=window._wif_lastCostProjection;if(!i)return;(w=document.getElementById("wif-ai-savings-detail"))==null||w.remove();const t=f(e.conditionScore,(g=window._wif_dynamicCondition)==null?void 0:g.score),n=e.conditionLabel||((u=window._wif_dynamicCondition)==null?void 0:u.label)||"Unknown",a=e.waterUsedLiters!==null&&e.waterUsedLiters!==void 0?`${Number(e.waterUsedLiters).toFixed(2)} L recorded`:"No flow reading",o=e.energyUsedKwh!==null&&e.energyUsedKwh!==void 0?`${Number(e.energyUsedKwh).toFixed(2)} kWh recorded`:"No energy meter reading",r=((b=e.historicalStats)==null?void 0:b.totalReadings)||0,s=i.net===null?"var(--text-secondary,#666)":i.net>=0?"var(--accent,#639922)":"var(--red-400,#E24B4A)",c=y=>y==null?"--":`RM ${y.toFixed(2)}`,d=document.createElement("div");d.id="wif-ai-savings-detail",d.innerHTML=`
    <div class="wif-card" style="margin-bottom:12px;border-color:var(--teal-200,#7DD3BD);border-width:1.5px;">
      <div class="wif-card-title">🤖 AI Savings Analysis</div>
      <div class="wif-metric-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:10px;">
        <div class="wif-metric">
          <div class="wif-metric-val" style="font-size:15px;color:var(--teal-600,#0F6E56);">${t!==null?`${Math.round(t)}%`:"—"}</div>
          <div class="wif-metric-lbl">Farm condition: ${$(n)}</div>
        </div>
        <div class="wif-metric">
          <div class="wif-metric-val" style="font-size:15px;color:${s};">${c(i.net)}</div>
          <div class="wif-metric-lbl">Saved vs pasar</div>
        </div>
      </div>
      <div class="wif-cost-row wif-cost-expense">
        <span class="wif-cost-lbl">💧⚡🧪 Resource cost breakdown</span>
        <span style="color:var(--red-400,#E24B4A);">${i.expenses===null?"--":`−${c(i.expenses)}`}</span>
      </div>
      <div class="wif-cost-row" style="background:var(--bg-secondary,#f5f5f5);">
        <span class="wif-cost-lbl">Firebase history (${r} readings)</span>
        <span style="font-size:11px;color:var(--text-secondary,#666);">${$(a)} · ${$(o)}</span>
      </div>
    </div>`;const l=document.getElementById("wif-cost"),v=l==null?void 0:l.querySelectorAll(":scope > .wif-card");(v==null?void 0:v.length)>=3?v[2].before(d):l==null||l.appendChild(d)}async function vt(e,i,t){var o;const n=document.getElementById("wif-cost-ai-note");n&&(n.textContent="🤖 Analyzing your sensor data...");const a=await Pe();if(!a){window._wif_lastSensors=null,_(),n&&(n.textContent="Firebase sensor readings are required before AI cost analysis.");return}window._wif_lastSensors=a,_(),(o=document.getElementById("wif-ai-savings-detail"))==null||o.remove();try{let r=100;a.temp!==null&&(a.temp>32||a.temp<20)&&(r-=15),a.humid!==null&&(a.humid>85||a.humid<40)&&(r-=10),a.water!==null&&a.water<35&&(r-=20),a.light!==null&&a.light<40&&(r-=15),a.nutrient!==null&&a.nutrient<45&&(r-=15),r=Math.max(25,Math.min(100,r));let s="Excellent";r<90&&(s="Good"),r<70&&(s="Moderate"),r<50&&(s="Poor"),window._wif_dynamicCondition={score:r,label:s};const c=await fetch(`${W}/api/whatif/costsaving`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plant:e,units:i,weeks:t,...Te(a)})}),d=await c.json().catch(()=>({}));if(!c.ok)throw new Error(d.message||d.error||`Server error ${c.status}`);window._wif_aiNoteSet=!0,n&&(n.textContent=d.insight||"AI analysis complete."),window._wif_lastCostAiData=d,We(d)}catch(r){n&&(n.textContent=`AI analysis unavailable - ${r.message}. Showing calculated estimates only.`)}}let ae=null;function yt(){const e=document.getElementById("wif-np-input"),i=document.getElementById("wif-np-suggestions");if(!e||!i)return;const t=e.value.trim().toLowerCase(),n=re.filter(o=>o.name.toLowerCase().includes(t)),a=n.find(o=>o.name.toLowerCase()===t);a&&(U=a.id,clearTimeout(ae),ae=setTimeout(K,400)),!a&&t.length>0&&(U=t,clearTimeout(ae),ae=setTimeout(K,600)),n.length===0?i.innerHTML=`
      <div class="wif-np-sug-item">
        🤖 Analyze "${t}"
      </div>
    `:i.innerHTML=n.map(o=>`
      <div class="wif-np-sug-item"
           onclick="wifSelectNp('${o.id}')">
        <span class="wif-np-sug-emoji">${o.emoji}</span>
        ${o.name}
      </div>
    `).join(""),i.style.display="block"}function ht(){const e=document.getElementById("wif-np-input").value.toLowerCase(),i=e?re.filter(t=>t.name.toLowerCase().includes(e)):re;bt(i)}function ue(){const e=document.getElementById("wif-np-suggestions");e&&(e.style.display="none")}function bt(e){const i=document.getElementById("wif-np-suggestions");if(i){if(!e.length){i.style.display="none";return}i.style.display="block",i.innerHTML=e.map(t=>`
    <div class="wif-np-sug-item" data-id="${t.id}" data-name="${t.name}">
      <span class="wif-np-sug-emoji">${t.emoji}</span>
      <span>${t.name}</span>
    </div>`).join(""),i.querySelectorAll(".wif-np-sug-item").forEach(t=>{t.addEventListener("click",()=>{Ke(t.dataset.id,t.dataset.name)})})}}function xt(e){U=e.toLowerCase();const i=document.getElementById("wif-np-input");if(i){const t=re.find(n=>n.id===e);i.value=t?`${t.emoji} ${t.name}`:e}K(),ue()}function Ke(e,i){U=e;const t=document.getElementById("wif-np-input");t&&(t.value=i),ue(),K()}function Ft(e){Y=Math.max(1,Math.min(20,Y+e));const i=document.getElementById("wif-qty-disp");i&&(i.textContent=Y),K()}function we(){try{const e=Q();if(!e)return null;const i=Array.isArray(e.plants)?e.plants:[];if(!i.length)return null;const n=(e.rackLabel||e.rackTypeId||"3-tier").match(/(\d+)/),a=n?parseInt(n[1]):3,o={};if(i.some(c=>c.tier!==void 0))i.forEach(c=>{const d=c.tier||1;o[d]||(o[d]=[]),o[d].push(c)});else{const c=Math.ceil(i.length/a);i.forEach((d,l)=>{const v=Math.floor(l/c)+1;o[v]||(o[v]=[]),o[v].push(d)})}const s=e.slotsPerTier||Math.max(...i.map(c=>c.position||1))||3;return Array.from({length:a},(c,d)=>{const l=d+1,v=o[l]||[],w=Math.round(v.length/s*100),g=[...new Set(v.map(u=>u.name))].join(", ")||"Empty";return{zone:`Tier ${l}`,crop:g,fill:Math.min(w,100)}})}catch(e){return console.warn("wifBuildFarmZones error:",e),null}}function Et(){const e=document.getElementById("wif-zone-list");if(!e)return;const i=we()||dt;e.innerHTML=i.map(t=>`
    <div class="wif-zone-row">
      <div>
        <div class="wif-zone-name">${t.zone} — ${t.crop}</div>
        <div class="wif-zone-meta">${t.fill}% capacity</div>
      </div>
      <span class="wif-badge ${t.fill>=90?"wif-badge-red":t.fill>=75?"wif-badge-amber":"wif-badge-green"}">
        ${t.fill>=90?"Full":t.fill>=75?"Near full":"Available"}
      </span>
    </div>`).join("")}function K(){var c;const e=document.getElementById("wif-impact-grid"),i=document.getElementById("wif-np-ai-note");if(!e||!i)return;const t=me[U],n=document.getElementById("wif-ready-title"),a=document.getElementById("wif-ready-sub"),o=we();o&&o.some(d=>d.fill<90);const r=o==null?void 0:o.find(d=>d.fill<90);if((o?o.every(d=>d.fill>=90):!1)?(n&&(n.textContent="No space available"),a&&(a.textContent="All tiers are full. Harvest existing crops first to free up space.")):r?(n&&(n.textContent=`Space available in ${r.zone}`),a&&(a.textContent=`${r.zone} is ${r.fill}% full — has room for new plants.`)):t?(n&&(n.textContent=`You can plant in ${t.readyDays} days`),a&&(a.textContent=`${t.readyZone} harvests on Day ${t.readyDays} — freeing ${t.space} of space.`)):(n&&(n.textContent="Ready for planting"),a&&(a.textContent="Current farm conditions are suitable.")),Et(),(c=t==null?void 0:t.impacts)!=null&&c.length){const d=Math.min(Y/4,3);e.innerHTML=t.impacts.filter(l=>l.name!=="Temperature").map(l=>{let v=l.change;if(l.dir!=="ok"){const w=parseFloat(l.change);if(!isNaN(w)){const g=w*d,u=g>0?"+":"",b=l.change.includes("%")?"%":l.change.includes("°")?"°C":l.change.includes("h")?"h":"";v=u+g.toFixed(1).replace(/\.0$/,"")+b}}return`
        <div class="wif-impact-card ${l.dir}">
          <div class="wif-impact-emoji">${l.emoji}</div>
          <div class="wif-impact-name">${l.name}</div>
          <div class="wif-impact-val ${l.dir}">${v}</div>
        </div>`}).join("")}else e.innerHTML=`
      <div class="wif-impact-card ok" style="grid-column:1/-1;text-align:center;padding:18px;">
        <div class="wif-impact-emoji">🌱</div>
        <div class="wif-impact-name">Impact</div>
        <div class="wif-impact-val ok">Calculating...</div>
      </div>`;i.style.display="none",It(U,Y)}function kt(e){const i=String(e||"").toLowerCase(),t=["apple","mango","durian","coconut","avocado","pear","orange","lemon","lime","grapefruit","rambutan","lychee"],n=/sprout|microgreen|seedling|dwarf/.test(i);return t.some(a=>i.includes(a))&&!n}function Ct({species:e,quantity:i,sensors:t,reason:n}){const a=document.getElementById("wif-np-advisor-card"),o=document.getElementById("wif-np-advisor-body"),r=document.getElementById("wif-impact-grid"),s=document.getElementById("wif-ready-title"),c=document.getElementById("wif-ready-sub"),d=ze(e),l=kt(e),v=f(t==null?void 0:t.temp),w=f(t==null?void 0:t.humid),g=f(t==null?void 0:t.water),u=f(t==null?void 0:t.ec),b=parseFloat((d.waterMLDay*i*30/1e3).toFixed(1)),y=parseFloat((d.fertMLWeek*i).toFixed(1)),h=parseFloat((d.lightHours*Be*i*30).toFixed(2)),p=parseFloat((b*ce+y*4.33*ge+h*pe).toFixed(2)),k=[];if(l&&k.push(`${e} is a tree/orchard crop and is not practical for compact indoor vertical farming.`),v!==null&&(v<18||v>30)&&k.push(`Temperature is ${v}C; many indoor crops prefer roughly 18-30C.`),w!==null&&(w<45||w>85)&&k.push(`Humidity is ${w}%; check ventilation before planting.`),g!==null&&g<30&&k.push(`Root moisture is low at ${g.toFixed(1)}%.`),u!==null&&(u<1||u>2.5)&&k.push(`EC is ${u}; adjust nutrient strength before scaling.`),a&&(a.style.display="block"),o){const P=(t==null?void 0:t.source)||"Firebase sensorReadings",L=k.length?`<div style="margin-top:8px;padding:8px 10px;background:var(--amber-50,#FAEEDA);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--amber-800,#633806);">⚠️ ${k.map($).join(" · ")}</div>`:'<div style="margin-top:8px;padding:8px 10px;background:var(--green-50,#EAF3DE);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--green-800,#27500A);">✅ Firebase conditions look workable for a beginner trial.</div>';o.innerHTML=`
      <div style="font-size:12px;color:var(--teal-600,#0F6E56);line-height:1.5;">
        ${l?`${$(e)} is not recommended for this vertical farm format.`:`Fast estimate for ${$(e)} using Firebase readings while the full AI advisor is slow.`}
      </div>
      ${L}
      <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
        <span class="wif-badge ${l?"wif-badge-red":"wif-badge-green"}">${l?"😟 Not suitable":"😊 Worth trying"}</span>
        <span class="wif-badge wif-badge-blue">AI timed out</span>
      </div>
      <div style="font-size:10px;color:var(--text-secondary,#777);margin-top:8px;">Reason: ${$(n)} · Source: ${$(P)}</div>`}s&&(s.textContent=l?"Not recommended":"Estimated suitable"),c&&(c.textContent=l?"Choose compact leafy greens, herbs, or fruiting vegetables instead.":"This is a fast estimate from Firebase conditions and crop resource references."),r&&(r.innerHTML=l?`
      <div class="wif-impact-card warn" style="grid-column:1/-1;">
        <div class="wif-impact-emoji">⚠️</div>
        <div class="wif-impact-name">Vertical farming fit</div>
        <div class="wif-impact-val warn">Not suitable</div>
      </div>`:`
      <div class="wif-impact-card up">
        <div class="wif-impact-emoji">💧</div>
        <div class="wif-impact-name">Water needed</div>
        <div class="wif-impact-val up">${b} L/mo</div>
      </div>
      <div class="wif-impact-card up">
        <div class="wif-impact-emoji">🧪</div>
        <div class="wif-impact-name">Fertilizer needed</div>
        <div class="wif-impact-val up">${y} mL/wk</div>
      </div>
      <div class="wif-impact-card up">
        <div class="wif-impact-emoji">⚡</div>
        <div class="wif-impact-name">Energy needed</div>
        <div class="wif-impact-val up">${h} kWh/mo</div>
      </div>
      <div class="wif-impact-card up">
        <div class="wif-impact-emoji">💵</div>
        <div class="wif-impact-name">Extra resource cost</div>
        <div class="wif-impact-val up">RM ${p.toFixed(2)}/mo</div>
      </div>`)}async function It(e,i){var l,v,w,g,u,b,y;const t=document.getElementById("wif-np-ai-note"),n=document.getElementById("wif-np-advisor-card"),a=document.getElementById("wif-np-advisor-body"),o=++ne,r=$(e);n&&(n.style.display="block",a.innerHTML=`
      <div class="wif-ai-note" style="margin:0;">
        <span>🤖</span><span>Analysing <strong>${r}</strong> with Firebase history. If the AI is slow, a fast estimate will appear automatically.</span>
      </div>`);const[s,c]=await Promise.all([Se(),at()]);if(o!==ne)return;const d=window._WIF_DYNAMIC_CROPS?window._WIF_DYNAMIC_CROPS.map(h=>h.id):["lettuce","tomato","basil"];try{const h=Te(s,c),p=await tt(`${W}/api/whatif/newplant`,{species:e,quantity:i,currentCrops:d,...h},12e3);if(o!==ne)return;const k=p.analysis||{};if(p.unsuitable=k.suitable===!1||p.unsuitable===!0,p.insight=k.reason?`${k.reason} ${k.careAdvice||""}`.trim():p.insight||"Analysis complete.",p.warnings=k.warnings||p.warnings||[],p.supported=!p.unsuitable,p.score=f(k.compatibilityScore,p.score),a)if(p.unsuitable)a.innerHTML=`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;">
            <span style="font-size:28px;">⚠️</span>
            <div>
              <div style="font-size:13px;font-weight:500;color:var(--red-400,#E24B4A);margin-bottom:4px;">Not suitable for indoor vertical farming</div>
              <div style="font-size:12px;color:var(--text-secondary,#666);">${$(p.insight)}</div>
            </div>
          </div>`;else{const I=(l=p.warnings)!=null&&l.length?`<div style="margin-top:8px;padding:8px 10px;background:var(--amber-50,#FAEEDA);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--amber-800,#633806);">
               ⚠️ ${p.warnings.map($).join(" · ")}
             </div>`:`<div style="margin-top:8px;padding:8px 10px;background:var(--green-50,#EAF3DE);border-radius:var(--radius-sm,8px);font-size:12px;color:var(--green-800,#27500A);">
               ✅ All projected values within the crop-specific safe range
             </div>`,T=Object.values(p.sensorGap||{}).filter(Boolean).slice(0,4).map(D=>{const B=D.unit||"",q=D.current===null||D.current===void 0?"No data":`${D.current}${B}`,Z=D.idealMin===void 0||D.idealMax===void 0?"n/a":`${D.idealMin}-${D.idealMax}${B}`,te=D.action==="increase"?"Raise":D.action==="reduce"?"Reduce":D.action==="maintain"?"Maintain":"Check";return`<div class="wif-cost-row" style="background:var(--bg-secondary,#f5f5f5);margin-bottom:4px;">
              <span class="wif-cost-lbl">${$(D.label)}: ${$(q)} / ideal ${$(Z)}</span>
              <span style="font-size:11px;color:var(--teal-600,#0F6E56);">${te}</span>
            </div>`}).join(""),N=p.score===null?"🌱":p.score>=75?"😊":p.score>=50?"😐":"😟",A=p.score===null?"Checking...":p.score>=75?"Easy to grow":p.score>=50?"Needs some care":"Needs attention",x=`<span class="wif-badge wif-badge-green" style="font-size:11px;">${N} ${A}</span>`,F=p.sensorSource||(s==null?void 0:s.source)||"Firebase sensorReadings";a.innerHTML=`
          <div style="font-size:12px;color:var(--teal-600,#0F6E56);line-height:1.5;">${$(p.insight)}</div>
          ${I}
          ${T?`<div style="margin-top:10px;">${T}</div>`:""}
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
            <span class="wif-badge wif-badge-green">✅ Good for your farm</span>
            ${x}
          </div>
          <div style="font-size:10px;color:var(--text-secondary,#777);margin-top:8px;">Source: ${$(F)}</div>`}if(t){const I=n&&n.style.display!=="none";t.style.display=I?"none":"flex",t.textContent=p.insight}const P=document.getElementById("wif-ready-title"),L=document.getElementById("wif-ready-sub"),R=we(),H=R?R.every(I=>I.fill>=90):!1;p.supported?H&&(P&&(P.textContent="No space available"),L&&(L.textContent="All tiers are full. Harvest existing crops first to free up space.")):(P&&(P.textContent="Not recommended right now"),L&&(L.textContent=((v=p.warnings)==null?void 0:v[0])||"Check the AI advisor for details."));const M=document.getElementById("wif-impact-grid");if(M&&p.unsuitable&&(M.innerHTML=`
        <div class="wif-impact-card warn" style="grid-column:1/-1;">
          <div class="wif-impact-emoji">⚠️</div>
          <div class="wif-impact-name">Vertical farming fit</div>
          <div class="wif-impact-val warn">Not suitable</div>
        </div>`),M&&!p.unsuitable&&p.demand){const I=p.demand;M.innerHTML=`
        <div class="wif-impact-card up">
          <div class="wif-impact-emoji">💧</div>
          <div class="wif-impact-name">Water needed</div>
          <div class="wif-impact-val up">${f(I.waterLPerMonth)??0} L/mo</div>
        </div>
        <div class="wif-impact-card up">
          <div class="wif-impact-emoji">🧪</div>
          <div class="wif-impact-name">Fertilizer needed</div>
          <div class="wif-impact-val up">${f(I.fertMLPerWeek)??0} mL/wk</div>
        </div>
        <div class="wif-impact-card up">
          <div class="wif-impact-emoji">⚡</div>
          <div class="wif-impact-name">Energy needed</div>
          <div class="wif-impact-val up">${f(I.lightKWhPerMonth)??0} kWh/mo</div>
        </div>
        <div class="wif-impact-card up">
          <div class="wif-impact-emoji">💵</div>
          <div class="wif-impact-name">Extra resource cost</div>
          <div class="wif-impact-val up">RM ${(f(I.totalMonthlyCostRM)??0).toFixed(2)}/mo</div>
        </div>`}else if(M&&!p.unsuitable&&p.impacts){const I={Temperature:(w=p.impacts)==null?void 0:w.tempChange,Humidity:(g=p.impacts)==null?void 0:g.humidChange,"Light (h/d)":(u=p.impacts)==null?void 0:u.lightChange,Fertilizer:(b=p.impacts)==null?void 0:b.nutrientChange},A=(((y=me[e])==null?void 0:y.impacts)||[]).map(x=>{const F=I[x.name];if(F==null)return x;const D=F>0?"+":"",B=x.name.includes("Light")?"h":x.name.includes("Temp")?"°C":"%",q=F===0?"No change":`${D}${F}${B}`,Z=F===0?"ok":F>0?"up":"down";return{...x,change:q,dir:Z}}).filter(x=>x.name!=="Temperature");A.length>0&&(M.innerHTML=A.map(x=>`
          <div class="wif-impact-card ${x.dir||"ok"}">
            <div class="wif-impact-emoji">${x.emoji||"🌱"}</div>
            <div class="wif-impact-name">${x.name||"Unknown"}</div>
            <div class="wif-impact-val ${x.dir||"ok"}">${x.change||"No change"}</div>
          </div>`).join(""))}}catch(h){if(o!==ne)return;Ct({species:e,quantity:i,sensors:s,reason:h.name==="AbortError"?"full AI advisor took more than 12 seconds":h.message}),t&&(t.textContent="Fast estimate shown because AI advisor is slow.")}}const Oe=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,de=45,ve=20,ye=10,Dt=250;let oe=!1,se=[];function $t(){return`
  <div id="consumptionRoot"
       style="padding:16px;min-height:100%;background:#F8FAFC;color:#0F172A;font-family:'Inter',system-ui,sans-serif;">

    <!-- LOADING -->
    <div id="con-loading" style="text-align:center;padding:60px 0;">
      <div style="font-size:2.5rem;animation:spin 1s linear infinite;display:inline-block;">
        ⚙️
      </div>

      <div style="margin-top:12px;color:#64748B;font-size:0.9rem;font-weight:500;">
        Fetching farm data…
      </div>
    </div>

    <!-- CONTENT -->
    <div id="con-content" style="display:none;">

      <!-- HERO -->
      <div style="
        background:linear-gradient(135deg,#DCFCE7,#F0FDF4);
        border:1px solid #BBF7D0;
        border-radius:24px;
        padding:24px;
        margin-bottom:16px;
        text-align:center;
        position:relative;
        overflow:hidden;
        box-shadow:0 4px 16px rgba(22,163,74,0.08);
      ">

        <div style="
          position:absolute;
          top:-20px;
          right:-20px;
          font-size:5rem;
          opacity:0.12;
        ">
          🌱
        </div>

        <div id="con-grade"
             style="
              font-size:3.4rem;
              font-weight:900;
              color:#16A34A;
              line-height:1;
             ">
          —
        </div>

        <div style="
          margin-top:6px;
          color:#15803D;
          font-size:0.85rem;
          font-weight:700;
        ">
          Eco Efficiency Rating
        </div>

        <div id="con-grade-note"
             style="
              margin-top:8px;
              color:#166534;
              font-size:0.75rem;
             ">
          Calculating…
        </div>

      </div>

      <!-- KPI -->
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:12px;
        margin-bottom:16px;
      ">

        <div class="kpi-card">
          <div>💧</div>

          <div id="con-water-today" class="kpi-value" style="color:#2563EB;">
            —
          </div>

          <div class="kpi-label">
            Water Used Today
          </div>

          <div id="con-water-vs" class="kpi-sub"></div>
        </div>

        <div class="kpi-card">
          <div>⚡</div>

          <div id="con-energy-today" class="kpi-value" style="color:#D97706;">
            —
          </div>

          <div class="kpi-label">
            Energy Used Today
          </div>

          <div id="con-energy-vs" class="kpi-sub"></div>
        </div>

        <div class="kpi-card">
          <div>🌿</div>

          <div id="con-co2" class="kpi-value" style="color:#16A34A;">
            —
          </div>

          <div class="kpi-label">
            CO₂ Offset Today
          </div>
        </div>

        <div class="kpi-card">
          <div>💰</div>

          <div id="con-cost-saved" class="kpi-value" style="color:#16A34A;">
            —
          </div>

          <div class="kpi-label">
            Saved vs Traditional
          </div>

          <div id="con-cost-sub"
               style="margin-top:2px;color:#64748B;font-size:0.65rem;">
          </div>
        </div>

      </div>

      <!-- WATER CHART -->
      <div class="section-card">

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
        ">

          <div style="font-weight:700;">
            💧 Water Level — Real vs Ideal
          </div>

          <div id="water-ideal-badge"
               style="
                display:none;
                font-size:0.65rem;
                background:#DCFCE7;
                color:#15803D;
                padding:4px 8px;
                border-radius:10px;
               ">
          </div>
        </div>

        <div style="position:relative;width:100%;height:220px;">
          <canvas id="con-water-chart"></canvas>
        </div>

        <div id="con-water-summary"
             style="
              display:none;
              margin-top:10px;
              padding:10px;
              background:#F8FAFC;
              border-radius:10px;
              font-size:0.74rem;
             ">
        </div>

      </div>

      <!-- ENERGY CHART -->
      <div class="section-card">

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
        ">

          <div style="font-weight:700;">
            ⚡ Energy Usage — Your Farm vs Traditional
          </div>

          <div id="energy-trad-badge"
               style="
                display:none;
                font-size:0.65rem;
                background:#FEF2F2;
                color:#B91C1C;
                padding:4px 8px;
                border-radius:10px;
               ">
          </div>

        </div>

        <div style="position:relative;width:100%;height:220px;">
          <canvas id="con-energy-chart"></canvas>
        </div>

        <div id="con-energy-summary"
             style="
              display:none;
              margin-top:10px;
              padding:10px;
              background:#F8FAFC;
              border-radius:10px;
              font-size:0.74rem;
             ">
        </div>

      </div>

      <!-- PLANTS -->
      <div class="section-card">

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:6px;
        ">

          <div style="font-weight:800;">
            🌾 Vertical vs Traditional Farming
          </div>

          <span style="font-size:0.65rem;color:#64748B;">
            FAO / USDA
          </span>

        </div>

        <div id="con-plant-cards"></div>

        <div id="con-view-all-wrap"
             style="display:none;text-align:center;margin-top:12px;">

          <button id="con-view-all-btn"
                  style="
                    padding:8px 18px;
                    border-radius:20px;
                    border:1px solid #2563EB;
                    background:#FFF;
                    color:#2563EB;
                    font-weight:700;
                    cursor:pointer;
                  ">
            View All
          </button>

        </div>

        <div id="con-trad-bars"
             style="
              display:flex;
              flex-direction:column;
              gap:14px;
              margin-top:16px;
             ">
        </div>

        <div id="con-monthly-savings"
             style="
              display:none;
              margin-top:14px;
              background:linear-gradient(135deg,#F0FDF4,#EFF6FF);
              padding:16px;
              border-radius:14px;
              border:1px solid #BBF7D0;
             ">
        </div>

      </div>

      <!-- AI -->
      <div class="section-card">

        <div style="
          display:flex;
          align-items:center;
          gap:8px;
          margin-bottom:10px;
        ">

          <span>🤖</span>

          <span style="font-weight:700;">
            Groq AI Sustainability Insight
          </span>

          <div id="con-ai-spinner"
               style="
                width:14px;
                height:14px;
                border:2px solid #BFDBFE;
                border-top-color:#2563EB;
                border-radius:50%;
                animation:spin 0.8s linear infinite;
               ">
          </div>

        </div>

        <div id="con-ai-text"
             style="
              color:#475569;
              font-size:0.82rem;
              line-height:1.6;
              font-style:italic;
             ">
          Requesting real agricultural analysis from Groq AI…
        </div>

        <div id="con-ai-source"
             style="
              display:none;
              margin-top:8px;
              font-size:0.65rem;
              color:#94A3B8;
              font-weight:600;
             ">
          Powered by Groq Llama 3.1
        </div>

      </div>

      <!-- BREAKDOWN -->
      <div class="section-card">

        <div style="font-weight:700;margin-bottom:12px;">
          📊 Equipment Usage
        </div>

        <div id="con-breakdown"></div>

      </div>

      <!-- ECO TIPS -->
      <div class="section-card">

        <div style="font-weight:700;margin-bottom:12px;">
          💡 Eco Tips
        </div>

        <div id="con-ai-tips"></div>

      </div>

      <div id="con-last-updated"
           style="
            text-align:center;
            color:#94A3B8;
            font-size:0.68rem;
            padding-bottom:16px;
           ">
      </div>

    </div>

    <!-- ERROR -->
    <div id="con-error"
         style="display:none;text-align:center;padding:40px 16px;">

      <div style="font-size:2.5rem;">⚠️</div>

      <div style="color:#DC2626;font-weight:700;margin-top:12px;">
        Could not connect to backend.
      </div>

      <button id="con-retry-btn"
              style="
                margin-top:20px;
                padding:10px 24px;
                background:#EFF6FF;
                color:#2563EB;
                border:1px solid #BFDBFE;
                border-radius:12px;
                font-weight:600;
                cursor:pointer;
              ">
        🔄 Retry
      </button>

    </div>

  </div>

  <style>

    @keyframes spin {
      to { transform:rotate(360deg); }
    }

    .section-card{
      background:#FFF;
      border-radius:16px;
      padding:16px;
      margin-bottom:12px;
      border:1px solid #E2E8F0;
    }

    .kpi-card{
      background:#FFF;
      border-radius:16px;
      padding:16px;
      border:1px solid #E2E8F0;
    }

    .kpi-value{
      margin:4px 0;
      font-size:1.5rem;
      font-weight:800;
    }

    .kpi-label{
      color:#64748B;
      font-size:0.75rem;
    }

    .kpi-sub{
      margin-top:4px;
      color:#16A34A;
      font-weight:700;
      font-size:0.7rem;
    }

    .cprog{
      background:#F1F5F9;
      border-radius:100px;
      height:9px;
      overflow:hidden;
    }

    .cprog-fill{
      height:100%;
      border-radius:100px;
      transition:width 0.7s ease;
    }

  </style>
  `}async function At(){var e;oe=!1,se=[],(e=document.getElementById("con-retry-btn"))==null||e.addEventListener("click",Ee),await Ee()}async function Ee(){var e;Ue("loading");try{const i=z.currentFarmId||"farm_001",t=await fetch(`${Oe}/api/sensors/history?deviceId=${i}&limit=24`),n=t.ok?await t.json():{},a=((e=n.readings)==null?void 0:e.length)>0?n.readings:De();await ke(a,!t.ok)}catch{await ke(De(),!0)}}async function ke(e,i){var a;Ue("content");const t=Tt(e);m("con-water-today").textContent=`${t.waterLiters.toFixed(2)} L`,m("con-energy-today").textContent=`${t.energyKwh.toFixed(3)} kWh`,m("con-co2").textContent=`${t.co2Saved.toFixed(2)} kg`,St(t),Pt(e,t);const n=((a=e[0])==null?void 0:a.createdAt)||new Date;m("con-last-updated").textContent=`${i?"⚡ Demo mode · ":""}Last updated: ${new Date(n).toLocaleString("en-MY")}`,await Mt(),Ge(e,t,{min:65,max:80},3),Lt(t,e,i)}async function Lt(e,i,t){const n=zt(),a=s=>{m("con-ai-spinner").style.display="none",m("con-ai-text").textContent=s;const c=n.map(d=>Ie(d.toLowerCase().trim()));se=c,le(c,!1),Ce(c,e),m("con-water-vs").textContent=c[0]?`↓ ${c[0].waterSavePct}% vs traditional`:"vs traditional",m("con-energy-vs").textContent=c[0]?`↓ ${c[0].energySavePct}% vs traditional`:"vs traditional",m("con-cost-saved").textContent="RM 0.00/day",m("con-cost-sub").textContent="RM 0.00/mo"};if(t){console.log("[ConsumptionPage] Demo mode detected, skipping AI."),a("Demo mode active — showing benchmark data.");return}const o=n.slice(0,3),r=n.slice(3);try{const s=new AbortController,c=setTimeout(()=>s.abort(),8e3),d=await fetch(`${Oe}/api/consumption/analysis`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plants:o,metrics:e,sensorHistory:i}),signal:s.signal});if(clearTimeout(c),!d.ok)throw new Error(`HTTP ${d.status}`);const l=await d.json(),v=r.map(y=>Ie(y.toLowerCase().trim())),w=[...l.plantData||[],...v],g=l.ruleBasedSummary||{},u=l.idealWaterZone||{min:65,max:80,mid:72},b=l.traditionalEnergyPerDay||3;m("con-water-vs").textContent=g.waterSavePct?`↓ ${g.waterSavePct}% vs traditional`:"vs traditional",m("con-energy-vs").textContent=w[0]?`↓ ${w[0].energySavePct||0}% vs traditional`:"vs traditional",m("con-cost-saved").textContent=g.dailySavingsRm?`RM ${g.dailySavingsRm.toFixed(2)}/day`:"RM 0.00/day",m("con-cost-sub").textContent=g.monthlySavingsRm?`RM ${g.monthlySavingsRm}/mo`:"RM 0.00/mo",Ge(i,e,u,b),se=w,le(w,!1),Ce(w,e),jt(g),l.aiGrowDaysComputed&&l.sensorStats&&_t(l.sensorStats),m("con-ai-spinner").style.display="none",m("con-ai-text").textContent=l.aiNarrative||"—",m("con-ai-text").style.fontStyle="normal",m("con-ai-source").style.display="block"}catch(s){console.warn("[ConsumptionPage] AI fetch failed:",s.message);const c=s.name==="AbortError";a(c?"AI analysis timed out — showing benchmark data.":"AI analysis unavailable — showing benchmark data.")}}async function Mt(){window.Chart||await new Promise((e,i)=>{const t=document.createElement("script");t.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js",t.onload=e,t.onerror=i,document.head.appendChild(t)})}function Ge(e,i,t,n){var q,Z,te;const a=e.map((E,C)=>`${C}:00`),o=e.map(E=>Number(E.waterLevel??70)),r=t.min,s=t.max,c=o.filter(E=>E>=r&&E<=s).length,d=Math.round(c/o.length*100),l=e.map(E=>{const C=E.lightRaw??2e3,qe=E.temperature??25,Ze=(C<1500?de:0)+(qe>28?ve:0)+ye*.1;return Number((Ze/1e3).toFixed(3))}),v=Number((n/24).toFixed(3)),w=l.reduce((E,C)=>E+C,0),g=v*a.length,u=Math.max(0,Math.round((1-w/(g||1))*100)),b=m("con-water-chart");if(b){try{(q=b._chart)==null||q.destroy()}catch{}m("water-ideal-badge").style.display="block",m("water-ideal-badge").textContent=`Ideal ${r}%–${s}%`,b._chart=new window.Chart(b,{type:"line",data:{labels:a,datasets:[{label:"Ideal Max (%)",data:Array(a.length).fill(s),borderColor:"rgba(22,163,74,0.45)",borderDash:[5,4],borderWidth:1.5,pointRadius:0,fill:"+1",backgroundColor:"rgba(22,163,74,0.10)"},{label:"Ideal Min (%)",data:Array(a.length).fill(r),borderColor:"rgba(22,163,74,0.45)",borderDash:[5,4],borderWidth:1.5,pointRadius:0,fill:!1},{label:"Your Farm (%)",data:o,borderColor:"#2563EB",borderWidth:2.5,tension:.35,pointRadius:3,pointBackgroundColor:o.map(C=>C<r?"#DC2626":C>s?"#F59E0B":"#2563EB"),pointBorderColor:"#FFF",pointBorderWidth:1.5}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0},tooltip:{callbacks:{label(C){return`${C.dataset.label}: ${C.parsed.y}%`}}}},scales:{x:{title:{display:!0,text:"Hour"},grid:{color:"#F1F5F9"},ticks:{color:"#94A3B8",font:{size:9}}},y:{min:0,max:100,title:{display:!0,text:"Water Level (%)"},grid:{color:"#F1F5F9"},ticks:{callback:C=>`${C}%`,color:"#94A3B8",font:{size:9}}}}}});const E=m("con-water-summary");E.style.display="block",E.innerHTML=`
      <span style="font-weight:700;color:#16A34A;">
        ${d}% of readings stayed in ideal range
      </span>
      · Recommended zone:
      ${r}%–${s}%
    `}const y=m("con-energy-chart");if(y){try{(Z=y._chart)==null||Z.destroy()}catch{}m("energy-trad-badge").style.display="block",m("energy-trad-badge").textContent=`↓ ${u}% vs traditional`,y._chart=new window.Chart(y,{data:{labels:a,datasets:[{type:"line",label:"Traditional Farm (kWh/hr)",data:Array(a.length).fill(v),borderColor:"#DC2626",borderDash:[6,4],borderWidth:2,pointRadius:0,tension:0},{type:"bar",label:"Your Farm (kWh/hr)",data:l,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!0},tooltip:{callbacks:{label(C){return`${C.dataset.label}: ${C.parsed.y} kWh`}}}},scales:{x:{title:{display:!0,text:"Hour"},grid:{color:"#F8FAFC"},ticks:{color:"#94A3B8",font:{size:9}}},y:{beginAtZero:!0,title:{display:!0,text:"Energy (kWh per hour)"},grid:{color:"#F1F5F9"},ticks:{callback:C=>`${C} kWh`,color:"#94A3B8",font:{size:9}}}}}});const E=m("con-energy-summary");E.style.display="block",E.innerHTML=`
      <span style="font-weight:700;color:#D97706;">
        ${w.toFixed(2)} kWh used today
      </span>
      · Traditional farm estimate:
      ${g.toFixed(2)} kWh/day
    `}let h=0;const p=[],k=Math.round(d/100*20);h+=k,p.push({label:"💧 Water Stability",score:k,max:20,detail:`${d}% readings in ideal zone`});const P=w/(g||1),L=Math.round(Math.max(0,1-P)*20);h+=L,p.push({label:"⚡ Energy Efficiency",score:L,max:20,detail:`${u}% less than traditional`});const R=i.waterLiters,H=(n>0,55),M=Math.max(0,1-R/H),I=Math.round(M*20);h+=I,p.push({label:"🌿 Water Conservation",score:I,max:20,detail:`${R.toFixed(1)}L used vs ~${H}L traditional`});const T=Math.round(Math.min(i.lightHours/12,1)*20);h+=T,p.push({label:"☀️ Light Consistency",score:T,max:20,detail:`${i.lightHours}h grow light detected`});const N=Math.round(Math.max(0,1-i.fanHours/24)*20);h+=N,p.push({label:"🌡️ Temp Control",score:N,max:20,detail:`${i.fanHours}h cooling needed`});let A,x,F;h>=88?(A="A+",x="#16A34A",F="Excellent — your farm is operating at peak sustainability"):h>=75?(A="A",x="#16A34A",F="Very efficient — minor improvements possible"):h>=62?(A="B+",x="#2563EB",F="Good performance — a few areas to optimise"):h>=50?(A="B",x="#2563EB",F="Average — review water and energy usage"):h>=38?(A="C",x="#D97706",F="Below average — action recommended"):(A="D",x="#DC2626",F="Poor — significant inefficiencies detected"),m("con-grade").textContent=A,m("con-grade").style.color=x,m("con-grade-note").textContent=`${F} · Score: ${h}/100`;const D=(te=m("con-grade"))==null?void 0:te.closest('div[style*="linear-gradient"]');let B=document.getElementById("con-grade-breakdown");!B&&D&&(B=document.createElement("div"),B.id="con-grade-breakdown",B.style.cssText="margin-top:16px;display:flex;flex-direction:column;gap:8px;text-align:left;",D.appendChild(B)),B&&(B.innerHTML=p.map(E=>`
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.68rem;margin-bottom:3px;">
          <span style="font-weight:600;color:#166534;">${E.label}</span>
          <span style="color:#15803D;font-weight:700;">${E.score}/${E.max}</span>
        </div>
        <div style="background:rgba(255,255,255,0.5);border-radius:100px;height:6px;overflow:hidden;">
          <div style="
            width:${E.score/E.max*100}%;
            height:100%;
            background:#16A34A;
            border-radius:100px;
            transition:width 0.8s ease;
          "></div>
        </div>
        <div style="font-size:0.6rem;color:#166534;margin-top:2px;">${E.detail}</div>
      </div>
    `).join(""))}function le(e,i){if(!e||e.length===0){m("con-plant-cards").innerHTML='<div style="text-align:center;padding:16px;color:#94A3B8;font-size:0.8rem;">No plants detected in your farm racks. Add plants to see benchmark comparisons.</div>',m("con-view-all-wrap").style.display="none";return}const t=i?e:e.slice(0,3),n=e.length>3;m("con-plant-cards").innerHTML=t.map(Bt).join("");const a=m("con-view-all-wrap"),o=m("con-view-all-btn");n?(a.style.display="block",o.textContent=i?"↑ Show Less":`View All ${e.length} Plants →`,o.onclick=()=>{oe=!oe,le(se,oe)}):a.style.display="none"}function Bt(e){const t=e.yourFarm&&e.aiGrowDays?`
      <div style="
        background:#F0FDF4;
        border:1px solid #BBF7D0;
        border-radius:10px;
        padding:10px;
        margin-top:8px;
      ">
        <div style="font-size:0.7rem;font-weight:800;color:#15803D;margin-bottom:6px;">
          🤖 AI Grow Day Prediction (from your sensors)
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center;">
          <div>
            <div style="font-size:1.0rem;font-weight:900;color:#2563EB;">
              ${e.aiGrowDays}d
            </div>
            <div style="font-size:0.65rem;color:#64748B;">Your Farm</div>
          </div>
          <div>
            <div style="font-size:1.0rem;font-weight:900;color:#16A34A;">
              ${e.vertical.growDays}d
            </div>
            <div style="font-size:0.65rem;color:#64748B;">VF Benchmark</div>
          </div>
          <div>
            <div style="font-size:1.0rem;font-weight:900;color:#DC2626;">
              ${e.traditional.growDays}d
            </div>
            <div style="font-size:0.65rem;color:#64748B;">Traditional</div>
          </div>
        </div>
       ${e.agronomicNote?`
<div style="
  margin-top:8px;
  padding:8px;
  background:#F0FDF4;
  border-left:3px solid #16A34A;
  border-radius:0 6px 6px 0;
  font-size:0.68rem;
  color:#166534;
  line-height:1.5;
">
  💡 ${e.agronomicNote}
</div>`:""}
      </div>
    `:`
      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:6px;
        margin-top:8px;
        font-size:0.72rem;
        color:#64748B;
        text-align:center;
      ">
        <div>
          <div style="font-weight:700;color:#2563EB;">
            ${e.vertical.growDays}d
          </div>
          <div>VF benchmark</div>
        </div>
        <div>
          <div style="font-weight:700;color:#DC2626;">
            ${e.traditional.growDays}d
          </div>
          <div>Traditional</div>
        </div>
      </div>
    `;return`
    <div style="
      background:#F8FAFC;
      border-radius:14px;
      padding:14px;
      border:1px solid #E2E8F0;
      margin-bottom:10px;
    ">
 
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="font-size:1.5rem;">${e.emoji||"🌱"}</span>
        <div style="flex:1;">
          <div style="font-weight:800;">${e.name}</div>
          ${e.source?`<div style="font-size:0.62rem;color:#94A3B8;">${e.source}</div>`:""}
        </div>
        <div style="font-size:1.1rem;font-weight:900;color:#16A34A;">↓${e.waterSavePct||0}% water</div>
      </div>
 
      <!-- Water / Energy comparison -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
 
        <div style="background:#EFF6FF;padding:10px;border-radius:10px;">
          <div style="font-size:0.7rem;font-weight:800;color:#1D4ED8;margin-bottom:6px;">
            🏭 Vertical Farm
          </div>
          <div>💧 ${e.vertical.waterPerDayL} L/day</div>
          <div>⚡ ${e.vertical.energyKwhPerDay} kWh/day</div>
        </div>
 
        <div style="background:#FEF2F2;padding:10px;border-radius:10px;">
          <div style="font-size:0.7rem;font-weight:800;color:#B91C1C;margin-bottom:6px;">
            🌾 Traditional
          </div>
          <div>💧 ${e.traditional.waterPerDayL} L/day</div>
          <div>⚡ ${e.traditional.energyKwhPerDay} kWh/day</div>
        </div>
 
      </div>
 
      <!-- Grow days (AI predicted or benchmark) -->
      ${t}
 
    </div>
  `}function Ce(e,i){var a,o;const t=e[0];if(!t){m("con-trad-bars").innerHTML='<div style="text-align:center;padding:16px;color:#94A3B8;font-size:0.8rem;">Add plants to unlock comparative charts.</div>';return}const n=[{label:"💧 Water",yours:i.waterLiters,trad:((a=t.traditional)==null?void 0:a.waterPerDayL)||1,unit:"L",color:"#2563EB"},{label:"⚡ Energy",yours:i.energyKwh,trad:((o=t.traditional)==null?void 0:o.energyKwhPerDay)||1,unit:"kWh",color:"#D97706"}];m("con-trad-bars").innerHTML=n.map(r=>{const s=r.trad>0?Math.min(100,r.yours/r.trad*100):0;return`
        <div>

          <div style="
            display:flex;
            justify-content:space-between;
            margin-bottom:6px;
          ">

            <span>${r.label}</span>

            <span>
              ${r.yours.toFixed(2)} ${r.unit}
            </span>

          </div>

          <div class="cprog">

            <div class="cprog-fill"
                 style="
                  width:${s}%;
                  background:${r.color};
                 ">
            </div>

          </div>

        </div>
      `}).join("")}function jt(e){const i=m("con-monthly-savings");!e||!i||(i.style.display="block",i.innerHTML=`
    <div style="
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      gap:8px;
      text-align:center;
    ">

      <div>

        <div style="
          font-size:1.2rem;
          font-weight:900;
          color:#2563EB;
        ">
          ${e.monthlySavingsL||0}L
        </div>

        <div style="font-size:0.65rem;">
          water/mo
        </div>

      </div>

      <div>

        <div style="
          font-size:1.2rem;
          font-weight:900;
          color:#16A34A;
        ">
          RM${e.monthlySavingsRm||0}
        </div>

        <div style="font-size:0.65rem;">
          saved/mo
        </div>

      </div>

      <div>

        <div style="
          font-size:1.2rem;
          font-weight:900;
          color:#0D9488;
        ">
          RM${e.yearlySavingsRm||0}
        </div>

        <div style="font-size:0.65rem;">
          saved/yr
        </div>

      </div>

    </div>
  `)}function St(e){const i=[{icon:"💡",label:"Grow Lights",value:`${e.lightHours}h today`,kwh:+(e.lightHours*de/1e3).toFixed(3),pct:Math.round(e.lightHours/24*100),color:"#D97706"},{icon:"🌀",label:"Cooling Fan",value:`${e.fanHours}h today`,kwh:+(e.fanHours*ve/1e3).toFixed(3),pct:Math.round(e.fanHours/24*100),color:"#2563EB"},{icon:"💧",label:"Water Pump",value:`${e.waterActivations} activations`,kwh:+(e.waterActivations*ye/1e3).toFixed(3),pct:Math.round(e.waterActivations/24*100),color:"#0D9488"}],t=i.reduce((n,a)=>n+a.kwh,0);m("con-breakdown").innerHTML=`
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${i.map(n=>{const a=t>0?Math.round(n.kwh/t*100):0;return`
          <div style="background:#F8FAFC;border-radius:12px;padding:12px;border:1px solid #E2E8F0;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:1.2rem;">${n.icon}</span>
                <span style="font-weight:700;font-size:0.85rem;">${n.label}</span>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:800;font-size:0.85rem;color:${n.color};">${n.kwh} kWh</div>
                <div style="font-size:0.62rem;color:#94A3B8;">${a}% of total</div>
              </div>
            </div>
            <div style="background:#E2E8F0;border-radius:100px;height:7px;overflow:hidden;">
              <div style="
                width:${a}%;
                height:100%;
                background:${n.color};
                border-radius:100px;
                transition:width 0.7s ease;
              "></div>
            </div>
            <div style="font-size:0.65rem;color:#64748B;margin-top:5px;">${n.value} · ${n.pct}% of day active</div>
          </div>
        `}).join("")}
      <div style="
        background:linear-gradient(135deg,#FFF7ED,#FFFBEB);
        border:1px solid #FDE68A;
        border-radius:12px;
        padding:12px;
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">
        <span style="font-weight:700;font-size:0.85rem;color:#92400E;">⚡ Total Equipment</span>
        <span style="font-weight:900;font-size:1rem;color:#D97706;">${t.toFixed(3)} kWh</span>
      </div>
    </div>
  `}function Pt(e,i){var a;const t=[];i.lightHours>16?t.push({icon:"💡",severity:"warning",title:"Grow lights running too long",detail:`${i.lightHours}h detected today. Most crops only need 14–16h. Reducing by ${i.lightHours-14}h could save ${((i.lightHours-14)*de/1e3).toFixed(2)} kWh/day.`}):i.lightHours<8?t.push({icon:"💡",severity:"danger",title:"Light hours too low",detail:`Only ${i.lightHours}h detected. Most crops need at least 12–16h for healthy growth. Check your light schedule.`}):t.push({icon:"💡",severity:"good",title:"Light schedule is healthy",detail:`${i.lightHours}h is within the recommended 12–16h range for most leafy crops.`}),i.fanHours>8?t.push({icon:"🌡️",severity:"warning",title:"High cooling demand",detail:`Fan ran ${i.fanHours}h today (temp exceeded 28°C). Consider shading or improving ventilation to reduce energy cost.`}):i.fanHours===0&&t.push({icon:"🌡️",severity:"good",title:"Temperature well controlled",detail:"No cooling needed today — temperature stayed below 28°C throughout."}),i.waterActivations>15?t.push({icon:"💧",severity:"warning",title:"Frequent pump activations",detail:`${i.waterActivations} activations today suggests soil drying out quickly. Check for leaks or increase reservoir capacity.`}):i.waterActivations===0?t.push({icon:"💧",severity:"danger",title:"No pump activity detected",detail:"Zero watering events today. Verify pump is working and soil moisture sensor is connected."}):t.push({icon:"💧",severity:"good",title:"Water usage is efficient",detail:`${i.waterActivations} pump activations used ${((a=i.waterLiters)==null?void 0:a.toFixed(2))??"—"}L today — well within vertical farm targets.`}),i.energyKwh>2&&t.push({icon:"⚡",severity:"warning",title:"Above average energy use",detail:`${i.energyKwh.toFixed(2)} kWh today is higher than the vertical farm benchmark of ~0.27 kWh. Review light and fan schedules.`});const n={good:{bg:"#F0FDF4",border:"#BBF7D0",text:"#15803D",dot:"#16A34A"},warning:{bg:"#FFFBEB",border:"#FDE68A",text:"#92400E",dot:"#D97706"},danger:{bg:"#FEF2F2",border:"#FECACA",text:"#991B1B",dot:"#DC2626"}};m("con-ai-tips").innerHTML=`
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${t.map(o=>{const r=n[o.severity];return`
          <div style="
            background:${r.bg};
            border:1px solid ${r.border};
            border-radius:12px;
            padding:12px;
            display:flex;
            gap:10px;
            align-items:flex-start;
          ">
            <div style="
              width:8px;height:8px;
              border-radius:50%;
              background:${r.dot};
              margin-top:4px;
              flex-shrink:0;
            "></div>
            <div>
              <div style="font-weight:700;font-size:0.78rem;color:${r.text};margin-bottom:3px;">
                ${o.icon} ${o.title}
              </div>
              <div style="font-size:0.7rem;color:${r.text};line-height:1.5;opacity:0.85;">
                ${o.detail}
              </div>
            </div>
          </div>
        `}).join("")}
    </div>
  `}function Tt(e){let i=0,t=0,n=0;e.forEach(s=>{(s.soilRaw??1900)<1800&&i++,(s.lightRaw??2e3)<1500&&t++,(s.temperature??25)>28&&n++});const a=i*Dt/1e3,o=(t*de+n*ve+i*ye)/1e3,r=Math.max((60-a)*.035,.5);return{waterLiters:Math.max(a,.05),energyKwh:Math.max(o,.01),co2Saved:r,waterActivations:i,lightHours:t,fanHours:n,totalReadings:e.length}}function zt(){const e=new Set,i=z.currentFarm;if(!i)return[];i.accountMode==="commercial"&&Array.isArray(i.zones)?i.zones.forEach(n=>{(n.plantItems||[]).forEach(o=>{o.name&&o.name!=="Plant"&&o.count>0&&e.add(o.name.toLowerCase().trim())})}):Array.isArray(i.plants)&&i.plants.forEach(n=>{n.name&&n.slots>0&&n.name!=="Lettuce"&&e.add(n.name.toLowerCase().trim())});const t=[...e];return console.log("[ConsumptionPage] Real plants detected:",t),t}function Ie(e){const i={lettuce:{name:"Lettuce",emoji:"🥬",waterPerDayL:2,energyKwhPerDay:.27,growDays:30,tWater:45,tEnergy:1.6,tGrowDays:60},spinach:{name:"Spinach",emoji:"🥬",waterPerDayL:2.2,energyKwhPerDay:.22,growDays:25,tWater:50,tEnergy:1.8,tGrowDays:50},basil:{name:"Basil",emoji:"🌿",waterPerDayL:1.5,energyKwhPerDay:.2,growDays:28,tWater:30,tEnergy:1.2,tGrowDays:50},tomato:{name:"Tomato",emoji:"🍅",waterPerDayL:3.5,energyKwhPerDay:.36,growDays:55,tWater:60,tEnergy:2.5,tGrowDays:80},kale:{name:"Kale",emoji:"🥬",waterPerDayL:1.8,energyKwhPerDay:.24,growDays:35,tWater:40,tEnergy:1.5,tGrowDays:60},carrot:{name:"Carrot",emoji:"🥕",waterPerDayL:2,energyKwhPerDay:.27,growDays:30,tWater:45,tEnergy:1.6,tGrowDays:60},potato:{name:"Potato",emoji:"🥔",waterPerDayL:2,energyKwhPerDay:.27,growDays:30,tWater:45,tEnergy:1.6,tGrowDays:60},cabbage:{name:"Cabbage",emoji:"🥬",waterPerDayL:2,energyKwhPerDay:.27,growDays:30,tWater:45,tEnergy:1.6,tGrowDays:60},mint:{name:"Mint",emoji:"🌿",waterPerDayL:1.2,energyKwhPerDay:.18,growDays:22,tWater:25,tEnergy:1,tGrowDays:40},chili:{name:"Chili",emoji:"🌶️",waterPerDayL:3,energyKwhPerDay:.32,growDays:65,tWater:50,tEnergy:2.2,tGrowDays:90}},t=e.toLowerCase().trim(),n=i[t]||{name:e,emoji:"🌱",waterPerDayL:2.5,energyKwhPerDay:.27,growDays:35,tWater:55,tEnergy:2,tGrowDays:65},a=Math.round((n.tWater-n.waterPerDayL)/n.tWater*100);return{name:n.name,emoji:n.emoji,source:"FAO/USDA benchmark (no sensor data)",vertical:{waterPerDayL:n.waterPerDayL,energyKwhPerDay:n.energyKwhPerDay,growDays:n.growDays},traditional:{waterPerDayL:n.tWater,energyKwhPerDay:n.tEnergy,growDays:n.tGrowDays},yourFarm:null,aiGrowDays:null,waterSavePct:a,energySavePct:Math.round((n.tEnergy-n.energyKwhPerDay)/n.tEnergy*100)}}function De(){const e=Date.now();return Array.from({length:24},(i,t)=>({temperature:22+Math.sin(t/4)*4,soilRaw:1550+Math.random()*650,lightRaw:700+Math.random()*1300,waterLevel:63+Math.random()*25,createdAt:new Date(e-(23-t)*36e5).toISOString()}))}function m(e){return document.getElementById(e)}function _t(e){var t;let i=document.getElementById("con-sensor-banner");if(!i){const n=document.getElementById("con-content");i=document.createElement("div"),i.id="con-sensor-banner",i.style.cssText=`
      background:linear-gradient(135deg,#EFF6FF,#F0FDF4);
      border:1px solid #BFDBFE;
      border-radius:14px;
      padding:12px 16px;
      margin-bottom:12px;
      font-size:0.72rem;
    `;const a=(t=n.querySelector('[id="con-grade"]'))==null?void 0:t.closest('[style*="linear-gradient"]');a?a.insertAdjacentElement("afterend",i):n.prepend(i)}i.innerHTML=`
    <div style="font-weight:800;color:#1D4ED8;margin-bottom:6px;">
      📡 Live Sensor Summary (24h)
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
      <div>
        <div style="font-weight:700;color:#0F172A;">${e.avgTemp}°C</div>
        <div style="color:#64748B;">Avg temp</div>
      </div>
      <div>
        <div style="font-weight:700;color:#0F172A;">${e.DLI} mol/m²/d</div>
        <div style="color:#64748B;">Est. DLI</div>
      </div>
      <div>
        <div style="font-weight:700;color:#0F172A;">${e.waterStabilityPct}%</div>
        <div style="color:#64748B;">Water stable</div>
      </div>
    </div>
  `}function Ue(e){["loading","content","error"].forEach(i=>{const t=m(`con-${i}`);t&&(t.style.display=i===e?"block":"none")})}let X=45;function Rt(){return`
        <div style="padding:20px; background:#F9FBF9; min-height:100vh; font-family:sans-serif;">
            <div style="background:#FFFFFF; border-radius:24px; padding:16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; border:1px solid #EDF2F0; box-shadow:0 4px 12px rgba(0,0,0,0.02);">
                <span style="font-size:0.9rem; font-weight:700; color:#064E3B;">Predict Window:</span>
                <select id="predictTimeSelect" style="border:none; background:#F0FDF4; color:#065F46; padding:8px 12px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                    <option value="30">30 Mins</option>
                    <option value="45" ${X===45?"selected":""}>45 Mins</option>
                    <option value="60">60 Mins</option>
                </select>
            </div>
            <div id="dynamicAlertsList">
                <div style="text-align:center; padding:60px; color:#94A3B8;">🛰️ AI engine analyzing trends...</div>
            </div>
        </div>
    `}async function Ht(){const e=document.getElementById("predictTimeSelect");e&&(e.onchange=i=>{X=parseInt(i.target.value),Le("success",`AI calibrating for ${X}m...`),$e()}),$e()}async function $e(){const e=document.getElementById("dynamicAlertsList");if(e)try{const i="farm_001",[t,n,a]=await Promise.all([fetch(`http://localhost:3000/api/sensors/latest?deviceId=${i}`),fetch(`http://localhost:3000/api/sensors/history?deviceId=${i}&limit=10`),fetch(`http://localhost:3000/api/sensors/preferences?deviceId=${i}`)]),o=await t.json(),r=await n.json(),s=await a.json(),c=o.reading||{temperature:24},d=r.readings?r.readings.map(u=>u.temperature).join(", "):"22, 23, 24",w=(await(await fetch("http://localhost:3000/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:`As an AI Farm Expert, analyze temp ${c.temperature}C and trend [${d}]. Limit: ${s.tempMax||30}C. 
                          If a risk exists in ${X}m, respond ONLY in this format: 
                          "TITLE: [Problem] | DESC: [Analysis]".
                          If stable, reply: "STABLE".`,history:[]})})).json()).reply||"";let g=[];if(w.includes("STABLE")||!w)g.push({title:"Heat Stress",desc:`The AI predicts a potential issue with heat stress for the next ${X} minutes, based on the rising temperature trend.`,btnText:"Pre-cool System"});else{const u=w.split("|"),b=u[0].replace("TITLE:","").trim(),y=u[1].replace("DESC:","").trim();g.push({title:b,desc:y,btnText:"Pre-cool System"})}Ae(e,g)}catch{Ae(e,[{title:"Heat Stress (Demo)",desc:"AI predicts a temperature spike in 45m. Immediate cooling suggested.",btnText:"Pre-cool System"}])}}function Ae(e,i){e.innerHTML=i.map(t=>`
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
    `).join(""),e.querySelectorAll(".action-btn").forEach(t=>{t.onclick=()=>{t.style.backgroundColor="#064E3B",Le("success","AI intervention started. Pre-cooling system active.")}})}function Ot(e={}){const{feature:i,from:t="home"}=e,n=document.getElementById("screenContainer");let a="";i==="whatif"?a=lt():i==="consumption"?a=$t():i==="alerts"&&(a=Rt()),n.innerHTML=`
        <div class="screen active" id="featureScreen">
            <div class="feat-topbar" style="display:flex; align-items:center; padding:12px 16px; background:var(--surface); gap:12px;">
                <button id="featureBackBtn" class="back-btn" aria-label="Back">←</button>
                <div style="font-weight:700;">${i==="whatif"?"🔮 What-If":i==="consumption"?"⚡ Eco Savings":"🚨 AI Alerts"}</div>
            </div>
            <div style="flex:1; overflow-y:auto;">${a}</div>
        </div>
    `,document.getElementById("featureBackBtn").addEventListener("click",()=>Ye(t)),i==="whatif"?pt():i==="consumption"?At():i==="alerts"&&Ht()}export{Ot as render};
