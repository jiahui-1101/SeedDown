import{A as d,s as x}from"./index-ChKLPXxY.js";import{C}from"./CommercialFarmCanvas-q04PgcgO.js";import{o as X}from"./AddPlantModal-B6frRo4T.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";import"./firebase-CzYD7I4u.js";const S=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,h={"2-tier":{label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}};let I=[],m=null,N={};const ee=[{id:"zone_A",label:"Zone A",crop:"Leafy Greens"},{id:"zone_B",label:"Zone B",crop:"Fruit Crops"},{id:"zone_C",label:"Zone C",crop:"Herbs"}];function Ie(){const e=document.getElementById("screenContainer"),t=b(),o=F(t),n=B(t),r=o.total?Math.min(100,Math.round(n/o.total*100)):0;m||(m=ue(t)),e.innerHTML=`
        <div class="screen active commercial-command-screen" id="commercialScreen">
            <canvas id="commercialFarmCanvas" class="commercial-command-canvas"></canvas>

            <div class="commercial-top-shell">
                <button id="comBackBtn" class="commercial-icon-btn" aria-label="Back to farms">←</button>
                <div class="commercial-title-card">
                    <div class="commercial-kicker">Commercial Digital Twin</div>
                    <div class="commercial-title-row">
                        <strong>${g((t==null?void 0:t.name)||d.farmName||"Commercial Farm")}</strong>
                        <span>${r}% occupied</span>
                    </div>
                    <small>${g(o.label)} · ${n}/${o.total} planted</small>
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
                            ${U(t,o)}
                        </div>
                    </section>

                    <section class="ops-section">
                        <div class="ops-section-title" id="liveSensorTitle">Live Sensors · ${M(m)}</div>
                        <div class="ops-sensor-grid">
                            ${v("Temp","pro-temp","--","temp")}
                            ${v("Humid","pro-humid","--","humid")}
                            ${v("Light","pro-light","--","light")}
                            ${v("pH","pro-ph","--","ph")}
                            ${v("Water","pro-water","--","water")}
                            ${v("Gas","pro-gas","--","nutrient")}
                            ${v("EC","pro-ec","--","ec")}
                            ${v("CO2","pro-co2","--","co2")}
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
                            ${$("whatif","🔮","What-If")}
                            ${$("control","🎛️","Control")}
                            ${$("disease","🧫","Disease")}
                            ${$("camera","📷","Camera")}
                            ${$("consumption","⚡","ESG")}
                            ${$("alerts","🚨","Alerts")}
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
    `,xe(),te(),oe(),R()}function te(){var e,t,o,n,r,i,a,u,p;(e=document.getElementById("profit-card"))==null||e.addEventListener("click",()=>{clearInterval(d.proInterval),x("profit-detail")}),(t=document.getElementById("energy-card"))==null||t.addEventListener("click",()=>{clearInterval(d.proInterval),x("energy-detail")}),(o=document.getElementById("comBackBtn"))==null||o.addEventListener("click",()=>{clearInterval(d.proInterval),x("farmlist")}),(n=document.getElementById("fabPlant"))==null||n.addEventListener("click",X),(r=document.getElementById("assignDeviceBtn"))==null||r.addEventListener("click",ae),(i=document.getElementById("panelToggleBtn"))==null||i.addEventListener("click",Z),(a=document.getElementById("panelCloseBtn"))==null||a.addEventListener("click",Z),(u=document.getElementById("commercialChatSend"))==null||u.addEventListener("click",D),(p=document.getElementById("commercialChatInput"))==null||p.addEventListener("keydown",s=>{s.key==="Enter"&&D()}),document.querySelectorAll(".com-feat").forEach(s=>{s.addEventListener("click",()=>{const c=s.getAttribute("data-feature");clearInterval(d.proInterval),c==="whatif"?x("whatif-pro"):c==="control"?x("control"):c==="disease"?x("disease"):c==="camera"?(R(),J()):x("feature",{feature:c,from:"dash-c"})})}),document.querySelectorAll(".pro-sensor-card").forEach(s=>{s.addEventListener("click",()=>{clearInterval(d.proInterval),x("sensor-detail",{key:s.getAttribute("data-key"),name:s.getAttribute("data-label"),from:"dash-c",zoneId:m})})}),document.querySelectorAll(".commercial-zone-card").forEach(s=>{s.addEventListener("click",()=>{m=s.getAttribute("data-zone"),d.currentZoneId=m,T(),W()})})}function Z(){const e=document.getElementById("commercialScreen"),t=document.getElementById("panelToggleBtn"),o=e==null?void 0:e.classList.toggle("panel-hidden");t&&(t.textContent=o?"Show Panel":"Hide Panel"),setTimeout(k,120)}function oe(){setTimeout(()=>{var e,t;C.init("commercialFarmCanvas",b()),ne(),k(),(t=(e=C).setCameraFrame)==null||t.call(e,!1),k(),requestAnimationFrame(k),setTimeout(k,120),setTimeout(k,350),window.addEventListener("resize",k)},80)}function P(e,t){e&&Object.entries(t).forEach(([o,n])=>{const r=o.replace(/[A-Z]/g,i=>"-"+i.toLowerCase());e.style.setProperty(r,n,"important")})}function k(){const e=document.getElementById("commercialScreen"),t=document.getElementById("commercialFarmCanvas");if(e&&P(e,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden"}),t&&P(t,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",borderRadius:"0",display:"block"}),C.renderer&&C.camera){const o=window.innerWidth||document.documentElement.clientWidth||1280,n=window.innerHeight||document.documentElement.clientHeight||720;C.renderer.setSize(o,n,!1),C.camera.aspect=o/n,C.camera.updateProjectionMatrix()}}function ne(){const e=document.getElementById("commercial-command-style");e&&document.head.appendChild(e)}function R(){clearInterval(d.proInterval),d.aiConsulted=!1;const e=async()=>{try{await ie();const o=await(await fetch(`${S}/api/sensors/latest?${H().toString()}`)).json();if(!o||!o.reading)return;const n=o.reading,r=Number(n.temperature||0),i=Number(n.humidity||0),a=Number(n.lightRaw||0),u=Number(n.ph||0),p=Number(n.waterDistanceCm||0),s=Number(n.gasRaw||0),c=Number(n.ec||0),w=Number(n.co2Ppm||0),f=B(b()),z=Math.max(0,f*1.35+a*.012).toFixed(2),E=Math.max(0,r*.65+f*.18).toFixed(1);l("pro-profit",`RM ${z}`),l("pro-energy",`${E} kWh`),l("pro-temp",`${r.toFixed(1)}°C`),l("pro-humid",`${i}%`),l("pro-light",a),l("pro-ph",u||"--"),l("pro-water",`${p}cm`),l("pro-gas",s),l("pro-ec",c?c.toFixed(2)+" mS":"--"),l("pro-co2",w?w+" ppm":"--"),d.aiConsulted||(q(n),d.aiConsulted=!0)}catch(t){console.error("Dashboard Sync Failed:",t),l("ai-overview-text","Live backend offline. Showing saved farm layout.")}};e(),d.proInterval=setInterval(e,5e3)}function H(){const e=b(),t=new URLSearchParams,o=Y(e,m);return o!=null&&o.deviceId?t.set("deviceId",o.deviceId):m?t.set("zoneId",m):e!=null&&e.deviceId?t.set("deviceId",e.deviceId):e!=null&&e.zoneId?t.set("zoneId",e.zoneId):e!=null&&e.id?t.set("fieldId",e.id):t.set("deviceId","farm_001"),t}async function ie(){const e=b(),t=V(e,F(e)),o=await Promise.all(t.map(async n=>{const r=new URLSearchParams,i=Y(e,n.id);i!=null&&i.deviceId?r.set("deviceId",i.deviceId):r.set("zoneId",n.id);try{const u=await(await fetch(`${S}/api/sensors/latest?${r.toString()}`)).json();return[n.id,u.reading||null]}catch{return[n.id,null]}}));N=Object.fromEntries(o),K()}async function W(){try{const t=await(await fetch(`${S}/api/sensors/latest?${H().toString()}`)).json();t!=null&&t.reading&&(re(t.reading),q(t.reading))}catch{l("ai-overview-text",`${M(m)} is waiting for live data.`)}}function re(e){const t=Number(e.temperature||0),o=Number(e.humidity||0),n=Number(e.lightRaw||0),r=Number(e.ph||0),i=Number(e.waterDistanceCm||0),a=Number(e.gasRaw||0),u=Number(e.ec||0),p=Number(e.co2Ppm||0),s=B(b()),c=Math.max(0,s*1.35+n*.012).toFixed(2),w=Math.max(0,t*.65+s*.18).toFixed(1);l("pro-profit",`RM ${c}`),l("pro-energy",`${w} kWh`),l("pro-temp",`${t.toFixed(1)}°C`),l("pro-humid",`${o}%`),l("pro-light",n),l("pro-ph",r||"--"),l("pro-water",`${i}cm`),l("pro-gas",a),l("pro-ec",u?u.toFixed(2)+" mS":"--"),l("pro-co2",p?p+" ppm":"--")}async function q(e){const t=`Current sensor data: ${JSON.stringify(e)}. Give one concise operations insight about risk, yield, energy, or automation.`;try{const n=await(await fetch(`${S}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,mode:"commercial"})})).json();l("ai-overview-text",n.reply||n.response||"Farm is operating normally.")}catch{l("ai-overview-text","AI Advisor offline. Sensor dashboard still available.")}}async function D(){const e=document.getElementById("commercialChatInput"),t=e==null?void 0:e.value.trim();if(t){e.value="",_("user",t),_("ai","Thinking...");try{const o=b(),r=await(await fetch(`${S}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,history:I.filter(i=>i.role!=="ai"||i.text!=="Thinking...").map(i=>({role:i.role==="ai"?"assistant":"user",content:i.text})).slice(-10),mode:"commercial",gardenState:{farm:o,sensors:d.sensors}})})).json();O(r.reply||r.response||"I could not generate a recommendation yet.")}catch{O("AI chat is offline, but sensor monitoring and tools still work.")}}}function _(e,t){I.push({role:e,text:t}),G()}function O(e){const t=I[I.length-1];(t==null?void 0:t.role)==="ai"?t.text=e:I.push({role:"ai",text:e}),G()}function G(){const e=document.getElementById("commercialChatLog");e&&(e.innerHTML=I.length?I.map(t=>`<div class="chat-bubble ${t.role}">${g(t.text)}</div>`).join(""):'<div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>',e.scrollTop=e.scrollHeight)}function ae(){const e=document.getElementById("assignDeviceOverlay");e&&e.remove();const t=document.createElement("div");t.id="assignDeviceOverlay",t.style.cssText="position:fixed;inset:0;z-index:80;background:rgba(15,23,42,.38);display:flex;align-items:center;justify-content:center;padding:18px;",t.innerHTML=`
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
    `,document.body.appendChild(t),document.getElementById("assignClose").addEventListener("click",()=>t.remove()),t.addEventListener("click",o=>{o.target===t&&t.remove()}),document.getElementById("assignSubmit").addEventListener("click",ce)}async function ce(){var i,a,u;const e=(i=document.getElementById("assignSerial"))==null?void 0:i.value.trim(),t=(a=document.getElementById("assignZone"))==null?void 0:a.value,o=(u=document.getElementById("assignWifi"))==null?void 0:u.value.trim(),n=document.getElementById("assignStatus"),r=document.getElementById("assignSubmit");if(e){r.disabled=!0,r.textContent="Assigning...";try{const p=await fetch(`${S}/api/devices/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serial:e,wifi_ssid:o,accountType:e.includes("MST")?"commercial_master":e.includes("ZNP")?"commercial_zone_pro":"commercial_zone_basic",farmId:d.currentFarmId||"farm_commercial_001",zoneId:t})}),s=await p.json();if(!p.ok||!s.ok)throw new Error(s.error||"Device assignment failed");const c=b()||{};c.commercialDevices=se(c.commercialDevices||[],s.device),c.zoneId=t,d.currentFarm=c,le(c),m=t,d.currentZoneId=m,requestAnimationFrame(()=>{K(),T()}),n.style.color="#047857",n.textContent=`Assigned ${s.device.deviceId} to ${t}`}catch(p){n.style.color="#dc2626",n.textContent=p.message}finally{r.disabled=!1,r.textContent="Register and Assign"}}}function J(){var u,p,s;const e=document.getElementById("zoneCameraOverlay");e&&e.remove();const t=b(),o=L(t),n=o.find(c=>c.id===m)||o[0],r=(t==null?void 0:t.photoPreview)||(t==null?void 0:t.image)||(t==null?void 0:t.thumbnail)||"",i=N[n==null?void 0:n.id]||null,a=document.createElement("div");a.id="zoneCameraOverlay",a.style.cssText="position:fixed;inset:0;z-index:95;background:rgba(15,23,42,.48);display:flex;align-items:center;justify-content:center;padding:18px;",a.innerHTML=`
        <div style="width:min(780px,100%);max-height:92vh;overflow:hidden;background:#fff;border-radius:24px;box-shadow:0 28px 90px rgba(15,23,42,.32);display:flex;flex-direction:column;">
            <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;padding:16px 18px;border-bottom:1px solid #e5e7eb;">
                <div>
                    <div style="font-size:10px;font-weight:950;color:#15803d;text-transform:uppercase;letter-spacing:.1em;">Zone camera live view</div>
                    <strong id="cameraZoneTitle" style="font-size:19px;color:#17231b;">${g((n==null?void 0:n.label)||"Zone Camera")}</strong>
                    <div id="cameraTimestamp" style="font-size:12px;color:#64748b;margin-top:4px;">Live snapshot · ${new Date().toLocaleTimeString()}</div>
                </div>
                <button id="cameraClose" style="width:36px;height:36px;border:none;border-radius:12px;background:#f1f5f9;font-size:18px;font-weight:900;cursor:pointer;">×</button>
            </div>

            <div style="padding:16px;overflow:auto;">
                <div style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(220px,.65fr);gap:14px;">
                    <div id="cameraFeed" style="position:relative;min-height:360px;border-radius:20px;overflow:hidden;background:${r?`url(${r}) center/cover`:"linear-gradient(135deg,#dcfce7,#f8fafc)"};border:1px solid #dbe7dc;">
                        ${r?"":be(n)}
                        <div style="position:absolute;left:12px;top:12px;display:flex;gap:7px;align-items:center;background:rgba(15,23,42,.66);color:#fff;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900;">
                            <span style="width:7px;height:7px;background:#22c55e;border-radius:50%;box-shadow:0 0 12px #22c55e;"></span>
                            LIVE CAMERA
                        </div>
                        <div style="position:absolute;right:12px;bottom:12px;background:rgba(255,255,255,.86);border:1px solid rgba(255,255,255,.7);border-radius:14px;padding:9px 10px;color:#17231b;font-size:12px;font-weight:900;">
                            ${g((n==null?void 0:n.crop)||"Mixed crops")}
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:10px;">
                        <label style="display:block;">
                            <span style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">Select zone</span>
                            <select id="cameraZoneSelect" style="width:100%;margin-top:6px;padding:12px;border:1px solid #e5e7eb;border-radius:14px;background:#f8fafc;outline:none;font-weight:900;color:#17231b;">
                                ${o.map(c=>`<option value="${fe(c.id)}" ${c.id===(n==null?void 0:n.id)?"selected":""}>${g(c.label)} · ${g(c.crop)}</option>`).join("")}
                            </select>
                        </label>
                        ${A("Temp",(i==null?void 0:i.temperature)!==void 0?`${Number(i.temperature).toFixed(1)}C`:"--")}
                        ${A("Humidity",(i==null?void 0:i.humidity)!==void 0?`${i.humidity}%`:"--")}
                        ${A("Light",(i==null?void 0:i.lightRaw)??"--")}
                        ${A("Plant count",`${(n==null?void 0:n.planted)??B(t)} plants`)}
                        <button id="cameraCaptureBtn" style="margin-top:4px;padding:13px;border:none;border-radius:14px;background:#166534;color:#fff;font-weight:950;cursor:pointer;">Capture latest frame</button>
                        <div id="cameraStatus" style="font-size:12px;color:#64748b;line-height:1.45;">Camera feed uses the latest farm photo / camera snapshot attached to this commercial farm. Each zone camera can be checked before running disease analysis.</div>
                    </div>
                </div>
            </div>
        </div>
    `,document.body.appendChild(a),(u=document.getElementById("cameraClose"))==null||u.addEventListener("click",()=>a.remove()),a.addEventListener("click",c=>{c.target===a&&a.remove()}),(p=document.getElementById("cameraCaptureBtn"))==null||p.addEventListener("click",()=>{document.getElementById("cameraTimestamp").textContent=`Live snapshot · ${new Date().toLocaleTimeString()}`,document.getElementById("cameraStatus").textContent="Latest camera frame captured for review. Use Disease Analysis if this zone looks unhealthy."}),(s=document.getElementById("cameraZoneSelect"))==null||s.addEventListener("change",c=>{m=c.target.value,d.currentZoneId=m,a.remove(),T(),J()})}function se(e,t){return[...e.filter(o=>o.deviceId!==t.deviceId&&y(o.zoneId||o.zone)!==y(t.zoneId||t.zone)),t]}function le(e){const t=Q(),o=t.findIndex(n=>n.id===e.id);o>=0?t[o]={...t[o],...e}:t.push(e),localStorage.setItem("user_farms",JSON.stringify(t))}function v(e,t,o,n){return`
        <button class="pro-sensor-card" data-key="${n}" data-label="${e}" type="button">
            <span>${e}</span>
            <strong id="${t}">${o}</strong>
        </button>`}function U(e,t){return V(e,t).map(o=>de(o)).join("")}function de(e){var a;const t=N[e.id],o=ge(t,((a=b())==null?void 0:a.thresholds)||{}),n=e.id===m?"selected":"",r=e.deviceId?e.deviceId.replace(/^dev_/,""):"unassigned",i=t?`${j(t.temperature,"°C")} · ${j(t.humidity,"%")} · gas ${t.gasRaw??"--"}`:"waiting for first reading";return`
        <button class="commercial-zone-card ${n} ${o.level}" data-zone="${e.id}" type="button">
            <div class="zone-card-head">
                <span>${g(e.label)}</span>
                <b>${o.label}</b>
            </div>
            <strong>${g(e.crop)}</strong>
            <div class="zone-card-meta">${e.planted}/${e.capacity} slots · ${g(r)}</div>
            <div class="zone-meter"><i style="width:${e.occupied}%"></i></div>
            <small>${g(i)}</small>
        </button>
    `}function K(){const e=document.querySelector(".zone-overview-grid");e&&(e.innerHTML=U(b(),F(b())),pe())}function pe(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.addEventListener("click",()=>{m=e.getAttribute("data-zone"),d.currentZoneId=m,T(),W()})})}function T(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-zone")===m)}),l("liveSensorTitle",`Live Sensors · ${M(m)}`)}function V(e,t){const o=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=L(e),r=Math.max(1,Math.ceil(((t==null?void 0:t.total)||9)/n.length)),i=Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[];return n.map((a,u)=>{const p=o.filter((f,z)=>{const E=y(f.zoneId||f.zone||f.area);return E?E===a.id:z%n.length===u}),s=i.find(f=>y(f.zoneId||f.zone)===a.id),c=me(p)||a.crop,w=p.reduce((f,z)=>f+(Number.parseInt(z.slots||z.count||1,10)||1),0);return{...a,crop:c,planted:w,capacity:r,occupied:Math.min(100,Math.round(w/r*100)),deviceId:(s==null?void 0:s.deviceId)||((e==null?void 0:e.zoneId)===a.id?e.deviceId:null)}})}function L(e){var o;const t=Array.isArray(e==null?void 0:e.zones)?e.zones:Array.isArray((o=e==null?void 0:e.commercialStructure)==null?void 0:o.zones)?e.commercialStructure.zones:[];return t.length?t.map((n,r)=>({id:y(n.zone_id||n.id||`zone_${String.fromCharCode(65+r)}`),label:n.name||`Zone ${String.fromCharCode(65+r)}`,crop:n.crop||(Array.isArray(n.plants)?n.plants.join(", "):"")||"Mixed Crops"})):ee}function me(e){var o;if(!e.length)return"";const t=e.reduce((n,r)=>{const i=r.name||r.species||"Mixed Crops";return n[i]=(n[i]||0)+1,n},{});return((o=Object.entries(t).sort((n,r)=>r[1]-n[1])[0])==null?void 0:o[0])||""}function Y(e,t){return t?(Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[]).find(n=>y(n.zoneId||n.zone)===t)||(y(e==null?void 0:e.zoneId)===t?e:null):null}function y(e){const t=String(e||"").trim().toLowerCase();return t?t==="a"||t==="zone a"||t==="zone_a"?"zone_A":t==="b"||t==="zone b"||t==="zone_b"?"zone_B":t==="c"||t==="zone c"||t==="zone_c"?"zone_C":t.startsWith("zone_")?`zone_${t.slice(5).toUpperCase()}`:t:""}function ue(e){var o;const t=((o=L(e)[0])==null?void 0:o.id)||"zone_A";return y(d.currentZoneId||(e==null?void 0:e.zoneId))||t}function M(e){var t;return((t=L(b()).find(o=>o.id===e))==null?void 0:t.label)||"Farm"}function ge(e,t={}){if(!e)return{level:"idle",label:"No Data"};const o=Number(t.gasDangerThreshold??3e3),n=Number(t.tempMin??18),r=Number(t.tempMax??35),i=Number(t.phMin??5.5),a=Number(t.phMax??6.8),u=Number(t.darkThreshold??1500),p=Number(t.waterLowCm??20);return Number(e.gasRaw)>o||Number(e.temperature)>r+3?{level:"critical",label:"Critical"}:Number(e.temperature)<n||Number(e.temperature)>r||Number(e.ph)<i||Number(e.ph)>a||Number(e.lightRaw)<u||Number(e.waterDistanceCm)>p?{level:"warning",label:"Warning"}:{level:"healthy",label:"Healthy"}}function j(e,t=""){const o=Number(e);return Number.isFinite(o)?`${o.toFixed(o%1?1:0)}${t}`:`--${t}`}function $(e,t,o){return'<button class="com-feat ops-tool-btn" data-feature="'+e+'" type="button"><span>'+t+"</span><strong>"+o+"</strong></button>"}function A(e,t){return`
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:11px 12px;">
            <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">${g(e)}</div>
            <strong style="display:block;margin-top:4px;color:#047857;font-size:16px;">${g(t)}</strong>
        </div>
    `}function be(e){const t=(e==null?void 0:e.crop)||"Mixed crops";return`
        <div style="position:absolute;inset:0;display:grid;place-items:center;padding:28px;">
            <div style="width:min(420px,92%);aspect-ratio:4/3;border-radius:22px;background:linear-gradient(180deg,#ecfdf5,#dbeafe);border:1px solid rgba(22,101,52,.16);box-shadow:inset 0 0 0 8px rgba(255,255,255,.38);display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:24px;">
                ${Array.from({length:12},(o,n)=>`
                    <div style="border-radius:999px;background:${n%3===0?"#22c55e":n%3===1?"#16a34a":"#84cc16"};box-shadow:0 12px 24px rgba(22,101,52,.18);"></div>
                `).join("")}
            </div>
            <div style="position:absolute;bottom:22px;left:22px;right:22px;text-align:center;color:#166534;font-size:13px;font-weight:900;">Simulated live field frame · ${g(t)}</div>
        </div>
    `}function b(){const e=Q();return d.currentFarm||e.find(t=>t.id===d.currentFarmId)||e[e.length-1]||null}function F(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?h["2-tier"]:t.includes("4")?h["4-tier"]:t.includes("5")?h["5-tier"]:t.includes("wall")||t.includes("grid")?h.wall:t.includes("frame")?h["a-frame"]:t.includes("nft")||t.includes("channel")?h["nft-channel"]:t.includes("hanging")||t.includes("column")?h.hanging:h["3-tier"]}function B(e){return Array.isArray(e==null?void 0:e.plants)?e.plants.reduce((t,o)=>t+(Number.parseInt(o.slots||o.count||1,10)||1),0):Number.parseInt(e==null?void 0:e.plants,10)||Number.parseInt(e==null?void 0:e.plantSlots,10)||0}function Q(){try{return JSON.parse(localStorage.getItem("user_farms"))||[]}catch{return[]}}function l(e,t){const o=document.getElementById(e);o&&(o.innerText=t)}function g(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function fe(e){return g(e)}function xe(){if(document.getElementById("commercial-command-style"))return;const e=document.createElement("style");e.id="commercial-command-style",e.textContent=`
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
    `,document.head.appendChild(e)}export{Ie as render};
