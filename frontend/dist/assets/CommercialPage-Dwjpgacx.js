import{A as l,s as f}from"./index-G-Ja4GjB.js";import{C as z}from"./CommercialFarmCanvas-LQLCzS89.js";import{o as K}from"./AddPlantModal-B8rVNYcu.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";import"./firebase-BieXTIEc.js";const k=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,h={"2-tier":{label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}};let C=[],m=null,O={};const Q=[{id:"zone_A",label:"Zone A",crop:"Leafy Greens"},{id:"zone_B",label:"Zone B",crop:"Fruit Crops"},{id:"zone_C",label:"Zone C",crop:"Herbs"}];function ye(){const e=document.getElementById("screenContainer"),t=g(),o=B(t),n=L(t),i=o.total?Math.min(100,Math.round(n/o.total*100)):0;m||(m=pe(t)),e.innerHTML=`
        <div class="screen active commercial-command-screen" id="commercialScreen">
            <canvas id="commercialFarmCanvas" class="commercial-command-canvas"></canvas>

            <div class="commercial-top-shell">
                <button id="comBackBtn" class="commercial-icon-btn" aria-label="Back to farms">←</button>
                <div class="commercial-title-card">
                    <div class="commercial-kicker">Commercial Digital Twin</div>
                    <div class="commercial-title-row">
                        <strong>${I((t==null?void 0:t.name)||l.farmName||"Commercial Farm")}</strong>
                        <span>${i}% occupied</span>
                    </div>
                    <small>${I(o.label)} · ${n}/${o.total} planted</small>
                </div>
            </div>

            <button id="panelToggleBtn" class="commercial-panel-toggle" aria-label="Hide operations panel">Hide Panel</button>

            <aside id="commercialOpsPanel" class="commercial-ops-panel">
                <div class="ops-panel-header">
                    <div>
                        <div class="commercial-kicker">Operations</div>
                        <strong>Farm Command Center</strong>
                    </div>
                    <button id="panelCloseBtn" class="commercial-icon-btn small" aria-label="Hide panel">×</button>
                </div>

                <div class="ops-scroll">
                    <section class="ops-section advisor-section">
                        <div class="ops-section-title">AI Farm Advisor</div>
                        <div id="ai-overview-text" class="advisor-text">Syncing commercial farm data...</div>
                    </section>

                    <section class="ops-section">
                        <div class="ops-section-title">Farm Master / Zones</div>
                        <div class="zone-overview-grid">
                            ${q(t,o)}
                        </div>
                    </section>

                    <section class="ops-section">
                        <div class="ops-section-title" id="liveSensorTitle">Live Sensors · ${N(m)}</div>
                        <div class="ops-sensor-grid">
                            ${x("Temp","pro-temp","--","temp")}
                            ${x("Humid","pro-humid","--","humid")}
                            ${x("Light","pro-light","--","light")}
                            ${x("pH","pro-ph","--","ph")}
                            ${x("Water","pro-water","--","water")}
                            ${x("Gas","pro-gas","--","nutrient")}
                            ${x("EC","pro-ec","--","ec")}
                            ${x("CO2","pro-co2","--","co2")}
                        </div>
                    </section>

                    <section class="ops-section ops-metrics">
                        <button id="profit-card" class="metric-tile">
                            <span>Est. Profit</span>
                            <strong id="pro-profit">RM --</strong>
                        </button>
                        <button id="energy-card" class="metric-tile">
                            <span>Energy Cost</span>
                            <strong id="pro-energy">-- kWh</strong>
                        </button>
                    </section>

                    <section class="ops-section">
                        <div class="ops-section-title">Tools</div>
                        <div class="ops-tool-grid">
                            ${S("whatif","🔮","What-If")}
                            ${S("control","🎛️","Control")}
                            ${S("disease","🧫","Disease")}
                            ${S("consumption","⚡","ESG")}
                            ${S("alerts","🚨","Alerts")}
                            <button id="assignDeviceBtn" class="ops-tool-btn" type="button"><span>📡</span><strong>Assign Device</strong></button>
                            <button id="fabPlant" class="ops-tool-btn" type="button"><span>🌱</span><strong>Add Plant</strong></button>
                        </div>
                    </section>

                    <section class="ops-section chat-section">
                        <div class="ops-section-title">AI Chat</div>
                        <div id="commercialChatLog" class="commercial-chat-log">
                            <div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>
                        </div>
                        <div class="commercial-chat-input-row">
                            <input id="commercialChatInput" placeholder="Ask SeedDown AI..." autocomplete="off">
                            <button id="commercialChatSend" type="button">Send</button>
                        </div>
                    </section>
                </div>
            </aside>
        </div>
    `,ue(),V(),X(),te()}function V(){var e,t,o,n,i,r,s,u,d;(e=document.getElementById("profit-card"))==null||e.addEventListener("click",()=>{clearInterval(l.proInterval),f("profit-detail")}),(t=document.getElementById("energy-card"))==null||t.addEventListener("click",()=>{clearInterval(l.proInterval),f("energy-detail")}),(o=document.getElementById("comBackBtn"))==null||o.addEventListener("click",()=>{clearInterval(l.proInterval),f("farmlist")}),(n=document.getElementById("fabPlant"))==null||n.addEventListener("click",K),(i=document.getElementById("assignDeviceBtn"))==null||i.addEventListener("click",ie),(r=document.getElementById("panelToggleBtn"))==null||r.addEventListener("click",F),(s=document.getElementById("panelCloseBtn"))==null||s.addEventListener("click",F),(u=document.getElementById("commercialChatSend"))==null||u.addEventListener("click",P),(d=document.getElementById("commercialChatInput"))==null||d.addEventListener("keydown",a=>{a.key==="Enter"&&P()}),document.querySelectorAll(".com-feat").forEach(a=>{a.addEventListener("click",()=>{const p=a.getAttribute("data-feature");clearInterval(l.proInterval),p==="whatif"?f("whatif-pro"):p==="control"?f("control"):p==="disease"?f("disease"):f("feature",{feature:p,from:"dash-c"})})}),document.querySelectorAll(".pro-sensor-card").forEach(a=>{a.addEventListener("click",()=>{clearInterval(l.proInterval),f("sensor-detail",{key:a.getAttribute("data-key"),name:a.getAttribute("data-label"),from:"dash-c",zoneId:m})})}),document.querySelectorAll(".commercial-zone-card").forEach(a=>{a.addEventListener("click",()=>{m=a.getAttribute("data-zone"),l.currentZoneId=m,A(),j()})})}function F(){const e=document.getElementById("commercialScreen"),t=document.getElementById("panelToggleBtn"),o=e==null?void 0:e.classList.toggle("panel-hidden");t&&(t.textContent=o?"Show Panel":"Hide Panel"),setTimeout(w,120)}function X(){setTimeout(()=>{var e,t;z.init("commercialFarmCanvas"),ee(),w(),(t=(e=z).setCameraFrame)==null||t.call(e,!1),w(),requestAnimationFrame(w),setTimeout(w,120),setTimeout(w,350),window.addEventListener("resize",w)},80)}function M(e,t){e&&Object.entries(t).forEach(([o,n])=>{const i=o.replace(/[A-Z]/g,r=>"-"+r.toLowerCase());e.style.setProperty(i,n,"important")})}function w(){const e=document.getElementById("commercialScreen"),t=document.getElementById("commercialFarmCanvas");if(e&&M(e,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden"}),t&&M(t,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",borderRadius:"0",display:"block"}),z.renderer&&z.camera){const o=window.innerWidth||document.documentElement.clientWidth||1280,n=window.innerHeight||document.documentElement.clientHeight||720;z.renderer.setSize(o,n,!1),z.camera.aspect=o/n,z.camera.updateProjectionMatrix()}}function ee(){const e=document.getElementById("commercial-command-style");e&&document.head.appendChild(e)}function te(){clearInterval(l.proInterval),l.aiConsulted=!1;const e=async()=>{try{await oe();const o=await(await fetch(`${k}/api/sensors/latest?${R().toString()}`)).json();if(!o||!o.reading)return;const n=o.reading,i=Number(n.temperature||0),r=Number(n.humidity||0),s=Number(n.lightRaw||0),u=Number(n.ph||0),d=Number(n.waterDistanceCm||0),a=Number(n.gasRaw||0),p=Number(n.ec||0),y=Number(n.co2Ppm||0),b=L(g()),E=Math.max(0,b*1.35+s*.012).toFixed(2),$=Math.max(0,i*.65+b*.18).toFixed(1);c("pro-profit",`RM ${E}`),c("pro-energy",`${$} kWh`),c("pro-temp",`${i.toFixed(1)}°C`),c("pro-humid",`${r}%`),c("pro-light",s),c("pro-ph",u||"--"),c("pro-water",`${d}cm`),c("pro-gas",a),c("pro-ec",p?p.toFixed(2)+" mS":"--"),c("pro-co2",y?y+" ppm":"--"),l.aiConsulted||(H(n),l.aiConsulted=!0)}catch(t){console.error("Dashboard Sync Failed:",t),c("ai-overview-text","Live backend offline. Showing saved farm layout.")}};e(),l.proInterval=setInterval(e,5e3)}function R(){const e=g(),t=new URLSearchParams,o=U(e,m);return o!=null&&o.deviceId?t.set("deviceId",o.deviceId):m?t.set("zoneId",m):e!=null&&e.deviceId?t.set("deviceId",e.deviceId):e!=null&&e.zoneId?t.set("zoneId",e.zoneId):e!=null&&e.id?t.set("fieldId",e.id):t.set("deviceId","farm_001"),t}async function oe(){const e=g(),t=J(e,B(e)),o=await Promise.all(t.map(async n=>{const i=new URLSearchParams,r=U(e,n.id);r!=null&&r.deviceId?i.set("deviceId",r.deviceId):i.set("zoneId",n.id);try{const u=await(await fetch(`${k}/api/sensors/latest?${i.toString()}`)).json();return[n.id,u.reading||null]}catch{return[n.id,null]}}));O=Object.fromEntries(o),G()}async function j(){try{const t=await(await fetch(`${k}/api/sensors/latest?${R().toString()}`)).json();t!=null&&t.reading&&(ne(t.reading),H(t.reading))}catch{c("ai-overview-text",`${N(m)} is waiting for live data.`)}}function ne(e){const t=Number(e.temperature||0),o=Number(e.humidity||0),n=Number(e.lightRaw||0),i=Number(e.ph||0),r=Number(e.waterDistanceCm||0),s=Number(e.gasRaw||0),u=Number(e.ec||0),d=Number(e.co2Ppm||0),a=L(g()),p=Math.max(0,a*1.35+n*.012).toFixed(2),y=Math.max(0,t*.65+a*.18).toFixed(1);c("pro-profit",`RM ${p}`),c("pro-energy",`${y} kWh`),c("pro-temp",`${t.toFixed(1)}°C`),c("pro-humid",`${o}%`),c("pro-light",n),c("pro-ph",i||"--"),c("pro-water",`${r}cm`),c("pro-gas",s),c("pro-ec",u?u.toFixed(2)+" mS":"--"),c("pro-co2",d?d+" ppm":"--")}async function H(e){const t=`You are SeedDown's commercial farm AI. Current sensor data: ${JSON.stringify(e)}. Give one concise operations insight about risk, yield, energy, or automation.`;try{const n=await(await fetch(`${k}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t})})).json();c("ai-overview-text",n.reply||n.response||"Farm is operating normally.")}catch{c("ai-overview-text","AI Advisor offline. Sensor dashboard still available.")}}async function P(){const e=document.getElementById("commercialChatInput"),t=e==null?void 0:e.value.trim();if(t){e.value="",Z("user",t),Z("ai","Thinking...");try{const o=g(),n=`SeedDown commercial farm context: ${JSON.stringify({farm:o,sensors:l.sensors})}
User question: ${t}`,r=await(await fetch(`${k}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:n})})).json();D(r.reply||r.response||"I could not generate a recommendation yet.")}catch{D("AI chat is offline, but sensor monitoring and tools still work.")}}}function Z(e,t){C.push({role:e,text:t}),W()}function D(e){const t=C[C.length-1];(t==null?void 0:t.role)==="ai"?t.text=e:C.push({role:"ai",text:e}),W()}function W(){const e=document.getElementById("commercialChatLog");e&&(e.innerHTML=C.length?C.map(t=>`<div class="chat-bubble ${t.role}">${I(t.text)}</div>`).join(""):'<div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>',e.scrollTop=e.scrollHeight)}function ie(){const e=document.getElementById("assignDeviceOverlay");e&&e.remove();const t=document.createElement("div");t.id="assignDeviceOverlay",t.style.cssText="position:fixed;inset:0;z-index:80;background:rgba(15,23,42,.38);display:flex;align-items:center;justify-content:center;padding:18px;",t.innerHTML=`
        <div style="width:min(430px,100%);background:#fff;border-radius:22px;padding:18px;box-shadow:0 26px 80px rgba(15,23,42,.25);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;">
                <div>
                    <div style="font-size:10px;font-weight:950;color:#15803d;text-transform:uppercase;letter-spacing:.1em;">Commercial Device</div>
                    <strong style="font-size:18px;">Assign Zone Device</strong>
                </div>
                <button id="assignClose" style="width:34px;height:34px;border:none;border-radius:12px;background:#f1f5f9;font-size:18px;font-weight:900;cursor:pointer;">×</button>
            </div>
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">Serial</label>
            <input id="assignSerial" value="SD-COM-ZNB-00001" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">Zone</label>
            <select id="assignZone" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
                <option value="zone_A">Zone A</option>
                <option value="zone_B">Zone B</option>
                <option value="zone_C">Zone C</option>
            </select>
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">WiFi SSID</label>
            <input id="assignWifi" placeholder="Farm WiFi" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
            <button id="assignSubmit" style="width:100%;padding:13px;border:none;border-radius:14px;background:#166534;color:white;font-weight:950;cursor:pointer;">Register and Assign</button>
            <div id="assignStatus" style="font-size:12px;color:#64748b;line-height:1.45;margin-top:10px;">Commercial serials: SD-COM-ZNB, SD-COM-ZNP, SD-COM-MST.</div>
        </div>
    `,document.body.appendChild(t),document.getElementById("assignClose").addEventListener("click",()=>t.remove()),t.addEventListener("click",o=>{o.target===t&&t.remove()}),document.getElementById("assignSubmit").addEventListener("click",re)}async function re(){var r,s,u;const e=(r=document.getElementById("assignSerial"))==null?void 0:r.value.trim(),t=(s=document.getElementById("assignZone"))==null?void 0:s.value,o=(u=document.getElementById("assignWifi"))==null?void 0:u.value.trim(),n=document.getElementById("assignStatus"),i=document.getElementById("assignSubmit");if(e){i.disabled=!0,i.textContent="Assigning...";try{const d=await fetch(`${k}/api/devices/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serial:e,wifi_ssid:o,accountType:e.includes("MST")?"commercial_master":e.includes("ZNP")?"commercial_zone_pro":"commercial_zone_basic",farmId:l.currentFarmId||"farm_commercial_001",zoneId:t})}),a=await d.json();if(!d.ok||!a.ok)throw new Error(a.error||"Device assignment failed");const p=g()||{};p.commercialDevices=ae(p.commercialDevices||[],a.device),p.zoneId=t,l.currentFarm=p,ce(p),m=t,l.currentZoneId=m,G(),A(),n.style.color="#047857",n.textContent=`Assigned ${a.device.deviceId} to ${t}`}catch(d){n.style.color="#dc2626",n.textContent=d.message}finally{i.disabled=!1,i.textContent="Register and Assign"}}}function ae(e,t){return[...e.filter(o=>o.deviceId!==t.deviceId&&v(o.zoneId||o.zone)!==v(t.zoneId||t.zone)),t]}function ce(e){const t=Y(),o=t.findIndex(n=>n.id===e.id);o>=0?t[o]={...t[o],...e}:t.push(e),localStorage.setItem("user_farms",JSON.stringify(t))}function x(e,t,o,n){return`
        <button class="pro-sensor-card" data-key="${n}" data-label="${e}" type="button">
            <span>${e}</span>
            <strong id="${t}">${o}</strong>
        </button>`}function q(e,t){return J(e,t).map(o=>se(o)).join("")}function se(e){var s;const t=O[e.id],o=me(t,((s=g())==null?void 0:s.thresholds)||{}),n=e.id===m?"selected":"",i=e.deviceId?e.deviceId.replace(/^dev_/,""):"unassigned",r=t?`${_(t.temperature,"°C")} · ${_(t.humidity,"%")} · gas ${t.gasRaw??"--"}`:"waiting for first reading";return`
        <button class="commercial-zone-card ${n} ${o.level}" data-zone="${e.id}" type="button">
            <div class="zone-card-head">
                <span>${I(e.label)}</span>
                <b>${o.label}</b>
            </div>
            <strong>${I(e.crop)}</strong>
            <div class="zone-card-meta">${e.planted}/${e.capacity} slots · ${I(i)}</div>
            <div class="zone-meter"><i style="width:${e.occupied}%"></i></div>
            <small>${I(r)}</small>
        </button>
    `}function G(){const e=document.querySelector(".zone-overview-grid");e&&(e.innerHTML=q(g(),B(g())),le())}function le(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.addEventListener("click",()=>{m=e.getAttribute("data-zone"),l.currentZoneId=m,A(),j()})})}function A(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-zone")===m)}),c("liveSensorTitle",`Live Sensors · ${N(m)}`)}function J(e,t){const o=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=T(e),i=Math.max(1,Math.ceil(((t==null?void 0:t.total)||9)/n.length)),r=Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[];return n.map((s,u)=>{const d=o.filter((b,E)=>{const $=v(b.zoneId||b.zone||b.area);return $?$===s.id:E%n.length===u}),a=r.find(b=>v(b.zoneId||b.zone)===s.id),p=de(d)||s.crop,y=d.length;return{...s,crop:p,planted:y,capacity:i,occupied:Math.min(100,Math.round(y/i*100)),deviceId:(a==null?void 0:a.deviceId)||((e==null?void 0:e.zoneId)===s.id?e.deviceId:null)}})}function T(e){var o;const t=Array.isArray(e==null?void 0:e.zones)?e.zones:Array.isArray((o=e==null?void 0:e.commercialStructure)==null?void 0:o.zones)?e.commercialStructure.zones:[];return t.length?t.map((n,i)=>({id:v(n.zone_id||n.id||`zone_${String.fromCharCode(65+i)}`),label:n.name||`Zone ${String.fromCharCode(65+i)}`,crop:n.crop||(Array.isArray(n.plants)?n.plants.join(", "):"")||"Mixed Crops"})):Q}function de(e){var o;if(!e.length)return"";const t=e.reduce((n,i)=>{const r=i.name||i.species||"Mixed Crops";return n[r]=(n[r]||0)+1,n},{});return((o=Object.entries(t).sort((n,i)=>i[1]-n[1])[0])==null?void 0:o[0])||""}function U(e,t){return t?(Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[]).find(n=>v(n.zoneId||n.zone)===t)||(v(e==null?void 0:e.zoneId)===t?e:null):null}function v(e){const t=String(e||"").trim().toLowerCase();return t?t==="a"||t==="zone a"||t==="zone_a"?"zone_A":t==="b"||t==="zone b"||t==="zone_b"?"zone_B":t==="c"||t==="zone c"||t==="zone_c"?"zone_C":t.startsWith("zone_")?`zone_${t.slice(5).toUpperCase()}`:t:""}function pe(e){var o;const t=((o=T(e)[0])==null?void 0:o.id)||"zone_A";return v(l.currentZoneId||(e==null?void 0:e.zoneId))||t}function N(e){var t;return((t=T(g()).find(o=>o.id===e))==null?void 0:t.label)||"Farm"}function me(e,t={}){if(!e)return{level:"idle",label:"No Data"};const o=Number(t.gasDangerThreshold??3e3),n=Number(t.tempMin??18),i=Number(t.tempMax??35),r=Number(t.phMin??5.5),s=Number(t.phMax??6.8),u=Number(t.darkThreshold??1500),d=Number(t.waterLowCm??20);return Number(e.gasRaw)>o||Number(e.temperature)>i+3?{level:"critical",label:"Critical"}:Number(e.temperature)<n||Number(e.temperature)>i||Number(e.ph)<r||Number(e.ph)>s||Number(e.lightRaw)<u||Number(e.waterDistanceCm)>d?{level:"warning",label:"Warning"}:{level:"healthy",label:"Healthy"}}function _(e,t=""){const o=Number(e);return Number.isFinite(o)?`${o.toFixed(o%1?1:0)}${t}`:`--${t}`}function S(e,t,o){return'<button class="com-feat ops-tool-btn" data-feature="'+e+'" type="button"><span>'+t+"</span><strong>"+o+"</strong></button>"}function g(){const e=Y();return l.currentFarm||e.find(t=>t.id===l.currentFarmId)||e[e.length-1]||null}function B(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?h["2-tier"]:t.includes("4")?h["4-tier"]:t.includes("5")?h["5-tier"]:t.includes("wall")||t.includes("grid")?h.wall:t.includes("frame")?h["a-frame"]:t.includes("nft")||t.includes("channel")?h["nft-channel"]:t.includes("hanging")||t.includes("column")?h.hanging:h["3-tier"]}function L(e){return Array.isArray(e==null?void 0:e.plants)?e.plants.length:Number.parseInt(e==null?void 0:e.plants,10)||Number.parseInt(e==null?void 0:e.plantSlots,10)||0}function Y(){try{return JSON.parse(localStorage.getItem("user_farms"))||[]}catch{return[]}}function c(e,t){const o=document.getElementById(e);o&&(o.innerText=t)}function I(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function ue(){if(document.getElementById("commercial-command-style"))return;const e=document.createElement("style");e.id="commercial-command-style",e.textContent=`
        .commercial-command-screen,
        .commercial-command-screen.commercial-farm-host {
            position: relative !important;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            overflow: hidden !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #f8faf7 !important;
            color: #17231b;
        }
        .commercial-command-canvas,
        .commercial-command-screen .commercial-farm-canvas {
            position: absolute !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            display: block !important;
            border-radius: 0 !important;
            background: #f8faf7 !important;
        }
        .commercial-top-shell {
            position: absolute;
            top: 16px;
            left: 16px;
            z-index: 15;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .commercial-title-card,
        .commercial-ops-panel,
        .commercial-panel-toggle,
        .commercial-icon-btn {
            background: rgba(255, 255, 255, .9);
            border: 1px solid rgba(22, 101, 52, .12);
            box-shadow: 0 18px 48px rgba(15, 23, 42, .12);
            backdrop-filter: blur(18px);
        }
        .commercial-title-card {
            min-width: min(360px, calc(100vw - 112px));
            border-radius: 22px;
            padding: 14px 16px;
        }
        .commercial-kicker {
            font-size: 10px;
            color: #15803d;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .1em;
        }
        .commercial-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-top: 4px;
        }
        .commercial-title-row strong { font-size: 18px; }
        .commercial-title-row span {
            padding: 5px 9px;
            border-radius: 999px;
            background: #ecfdf5;
            color: #047857;
            font-size: 11px;
            font-weight: 900;
            white-space: nowrap;
        }
        .commercial-title-card small {
            display: block;
            color: #64748b;
            font-size: 12px;
            font-weight: 750;
            margin-top: 3px;
        }
        .commercial-icon-btn {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            color: #17231b;
            font-size: 20px;
            font-weight: 900;
            cursor: pointer;
        }
        .commercial-icon-btn.small {
            width: 34px;
            height: 34px;
            font-size: 18px;
            box-shadow: none;
        }
        .commercial-panel-toggle {
            position: absolute;
            top: 16px;
            right: 16px;
            z-index: 18;
            border-radius: 999px;
            padding: 10px 14px;
            color: #166534;
            font-size: 11px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .08em;
            cursor: pointer;
        }
        .commercial-ops-panel {
            position: absolute;
            top: 62px;
            right: 16px;
            bottom: 16px;
            z-index: 16;
            width: min(410px, calc(100vw - 32px));
            border-radius: 26px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform .28s ease, opacity .28s ease;
        }
        .commercial-command-screen.panel-hidden .commercial-ops-panel {
            transform: translateX(calc(100% + 26px));
            opacity: 0;
            pointer-events: none;
        }
        .ops-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 16px 16px 12px;
            border-bottom: 1px solid rgba(15, 23, 42, .08);
        }
        .ops-panel-header strong { display:block; font-size: 17px; margin-top: 3px; }
        .ops-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .ops-section {
            background: #ffffff;
            border: 1px solid rgba(15, 23, 42, .08);
            border-radius: 20px;
            padding: 14px;
            box-shadow: 0 8px 26px rgba(15, 23, 42, .06);
        }
        .ops-section-title {
            color: #64748b;
            font-size: 10px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .1em;
            margin-bottom: 10px;
        }
        .advisor-section { border-left: 4px solid #22c55e; }
        .advisor-text { color: #334155; font-size: 13px; line-height: 1.45; }
        .zone-overview-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
        }
        .commercial-zone-card {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            background: #f8fafc;
            color: #17231b;
            padding: 11px;
            text-align: left;
            cursor: pointer;
            transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
        }
        .commercial-zone-card:hover,
        .commercial-zone-card.selected {
            border-color: #22c55e;
            box-shadow: 0 10px 24px rgba(34, 197, 94, .12);
            transform: translateY(-1px);
        }
        .zone-card-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 7px;
        }
        .zone-card-head span {
            color: #64748b;
            font-size: 10px;
            font-weight: 950;
            text-transform: uppercase;
            letter-spacing: .08em;
        }
        .zone-card-head b {
            border-radius: 999px;
            padding: 4px 8px;
            background: #eef2f7;
            color: #64748b;
            font-size: 9px;
            font-weight: 950;
            text-transform: uppercase;
            white-space: nowrap;
        }
        .commercial-zone-card.healthy .zone-card-head b { background: #dcfce7; color: #047857; }
        .commercial-zone-card.warning .zone-card-head b { background: #fef3c7; color: #b45309; }
        .commercial-zone-card.critical .zone-card-head b { background: #fee2e2; color: #b91c1c; }
        .commercial-zone-card strong {
            display: block;
            font-size: 14px;
            font-weight: 950;
        }
        .zone-card-meta {
            margin-top: 4px;
            color: #64748b;
            font-size: 11px;
            font-weight: 750;
        }
        .zone-meter {
            height: 7px;
            border-radius: 999px;
            overflow: hidden;
            background: #e5e7eb;
            margin: 9px 0 7px;
        }
        .zone-meter i {
            display: block;
            height: 100%;
            min-width: 8px;
            border-radius: inherit;
            background: linear-gradient(90deg, #22c55e, #84cc16);
        }
        .commercial-zone-card.warning .zone-meter i { background: linear-gradient(90deg, #f59e0b, #facc15); }
        .commercial-zone-card.critical .zone-meter i { background: linear-gradient(90deg, #ef4444, #fb7185); }
        .commercial-zone-card small {
            display: block;
            color: #64748b;
            font-size: 11px;
            line-height: 1.35;
        }
        .ops-sensor-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .pro-sensor-card {
            min-height: 74px;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            background: #f8fafc;
            color: #17231b;
            padding: 10px;
            text-align: left;
            cursor: pointer;
        }
        .pro-sensor-card span {
            display:block;
            color:#64748b;
            font-size:10px;
            font-weight:900;
            text-transform:uppercase;
            letter-spacing:.06em;
        }
        .pro-sensor-card strong {
            display:block;
            color:#059669;
            font-size:16px;
            font-weight:950;
            margin-top:12px;
            word-break:break-word;
        }
        .ops-metrics { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .metric-tile {
            min-height:78px;
            border:1px solid #e5e7eb;
            border-radius:16px;
            background:#f8fafc;
            text-align:left;
            padding:12px;
            cursor:pointer;
        }
        .metric-tile span { display:block; color:#64748b; font-size:10px; font-weight:950; text-transform:uppercase; }
        .metric-tile strong { display:block; margin-top:10px; color:#047857; font-size:18px; font-weight:950; }
        .ops-tool-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; }
        .ops-tool-btn {
            border:1px solid #dbe7dc;
            border-radius:16px;
            background:#f0fdf4;
            color:#166534;
            min-height:74px;
            font-size:12px;
            font-weight:950;
            cursor:pointer;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:7px;
        }
        .ops-tool-btn span { font-size:23px; line-height:1; }
        .ops-tool-btn strong { font-size:11px; font-weight:950; }
        .commercial-chat-log {
            height: 180px;
            overflow-y: auto;
            display:flex;
            flex-direction:column;
            gap:8px;
            padding:10px;
            border-radius:16px;
            background:#f8fafc;
            border:1px solid #e5e7eb;
        }
        .chat-bubble {
            max-width: 88%;
            padding: 9px 11px;
            border-radius: 14px;
            font-size: 12px;
            line-height: 1.35;
        }
        .chat-bubble.ai { background:#ecfdf5; color:#14532d; align-self:flex-start; }
        .chat-bubble.user { background:#166534; color:white; align-self:flex-end; }
        .commercial-chat-input-row { display:flex; gap:8px; margin-top:10px; }
        .commercial-chat-input-row input {
            flex:1;
            min-width:0;
            border:1px solid #e5e7eb;
            border-radius:14px;
            padding:11px 12px;
            background:#fff;
            outline:none;
        }
        .commercial-chat-input-row button {
            border:none;
            border-radius:14px;
            background:#166534;
            color:white;
            padding:0 14px;
            font-weight:950;
            cursor:pointer;
        }
        .commercial-command-screen .cf-legend,
        .commercial-command-screen .cf-expand-btn,
        .commercial-command-screen .cf-zoom-controls {
            display: none !important;
        }
        .commercial-command-screen .cf-info-panel {
            display: block !important;
            top: 132px !important;
            left: 18px !important;
            width: min(360px, calc(100vw - 470px)) !important;
            min-width: 280px !important;
            color: #17231b !important;
            background: rgba(255,255,255,.92) !important;
            border: 1px solid rgba(22,101,52,.12) !important;
            box-shadow: 0 18px 48px rgba(15,23,42,.12) !important;
            backdrop-filter: blur(18px) !important;
        }
        .commercial-command-screen .cf-panel-title,
        .commercial-command-screen .cf-mini-metric strong {
            color: #17231b !important;
        }
        .commercial-command-screen .cf-panel-kicker,
        .commercial-command-screen .cf-plant-list b,
        .commercial-command-screen .cf-tooltip strong {
            color: #047857 !important;
        }
        .commercial-command-screen .cf-panel-sub,
        .commercial-command-screen .cf-mini-metric span,
        .commercial-command-screen .cf-plant-list span,
        .commercial-command-screen .cf-tooltip small {
            color: #64748b !important;
        }
        .commercial-command-screen .cf-mini-metric,
        .commercial-command-screen .cf-plant-list span {
            background: #f8fafc !important;
            border: 1px solid #e5e7eb !important;
        }
        .commercial-command-screen .cf-tooltip {
            display: flex !important;
            bottom: 18px !important;
            left: 50% !important;
            color: #17231b !important;
            background: rgba(255,255,255,.9) !important;
            border: 1px solid rgba(22,101,52,.12) !important;
            box-shadow: 0 12px 34px rgba(15,23,42,.1) !important;
        }
        @media (max-width: 760px) {
            .commercial-top-shell { left: 12px; top: 12px; }
            .commercial-title-card { min-width: 0; width: calc(100vw - 120px); }
            .commercial-title-row { align-items:flex-start; flex-direction:column; }
            .commercial-panel-toggle { top: auto; bottom: 16px; right: 16px; }
            .commercial-ops-panel { top: 94px; left: 12px; right: 12px; bottom: 70px; width: auto; }
            .commercial-command-screen.panel-hidden .commercial-ops-panel { transform: translateY(calc(100% + 90px)); }
            .ops-sensor-grid { grid-template-columns: repeat(2, 1fr); }
            .ops-tool-grid { grid-template-columns: repeat(2, 1fr); }
        }
    `,document.head.appendChild(e)}export{ye as render};
