import{A as d,s as v}from"./index-CsAh1mPh.js";import{C}from"./CommercialFarmCanvas-W7x55oE1.js";import{o as de}from"./AddPlantModal-1CThvP5l.js";import me from"https://esm.sh/jsqr@1.4.0";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const E=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,y={"2-tier":{label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}};let S=[],h=null,F={},z=null;const Q="seeddown_commercial_live_cache",W="seeddown_last_camera_snapshot",pe=[{id:"zone_A",label:"Zone A",crop:"Leafy Greens"},{id:"zone_B",label:"Zone B",crop:"Fruit Crops"},{id:"zone_C",label:"Zone C",crop:"Herbs"},{id:"zone_D",label:"Zone D",crop:"Mixed Crops"},{id:"zone_E",label:"Zone E",crop:"Mixed Crops"},{id:"zone_F",label:"Zone F",crop:"Mixed Crops"}],ue={zone_A:"commercial-zone-node-1",zone_B:"commercial-zone-node-2",zone_C:"commercial-zone-node-3",zone_D:"commercial-zone-node-4",zone_E:"commercial-zone-node-5",zone_F:"commercial-zone-node-6"},M="commercial-farm-master-1",ge={sd_demo_commercial_zone_node_1:"SD-COM-ZON-01001",sd_demo_commercial_zone_node_2:"SD-COM-ZON-01002",sd_demo_commercial_zone_node_3:"SD-COM-ZON-01003",sd_demo_commercial_farm_master_1:"SD-COM-FRM-03001"};function Ge(){const e=document.getElementById("screenContainer"),t=b();d.currentFarm=t;const o=T(t),n=se(t,o),r=n.total?Math.min(100,Math.round(n.planted/n.total*100)):0;h||(h=Oe(t)),e.innerHTML=`
        <div class="screen active commercial-command-screen" id="commercialScreen">
            <canvas id="commercialFarmCanvas" class="commercial-command-canvas"></canvas>

            <div class="commercial-top-shell">
                <button id="comBackBtn" class="commercial-icon-btn" aria-label="Back to farms">←</button>
                <div class="commercial-title-card">
                    <div class="commercial-kicker">Commercial Digital Twin</div>
                    <div class="commercial-title-row">
                        <strong>${f((t==null?void 0:t.name)||d.farmName||"Commercial Farm")}</strong>
                        <span>${r}% occupied</span>
                    </div>
                    <small>${f(n.label)} · ${n.planted}/${n.total} planted</small>
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

    <!-- FARM MASTER OVERVIEW -->
    <section class="ops-section" id="farmMasterSection" style="border-left:4px solid #22c55e;">
        <div class="ops-section-title" style="color:#15803d;">🏭 Farm Master · Overall</div>
       <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
    <button class="fm-tile fm-drill" data-key="water" type="button">
        <span>Water Level</span>
        <strong id="fm-water">--</strong>
    </button>
    <button class="fm-tile fm-drill" data-key="gas" type="button">
        <span>Gas</span>
        <strong id="fm-gas">--</strong>
    </button>
    <button class="fm-tile fm-drill" data-key="co2" type="button">
        <span>CO₂</span>
        <strong id="fm-co2">--</strong>
    </button>
    <button class="fm-tile fm-drill" data-key="energy" type="button">
        <span>Energy</span>
        <strong id="fm-energy">--</strong>
    </button>
</div>
<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
    <div style="font-size:11px;color:#047857;font-weight:750;line-height:1.45;" id="fm-status-text">Syncing farm master...</div>
    <button id="farmMasterDetailBtn" type="button" style="font-size:10px;font-weight:950;color:#166534;background:#dcfce7;border:1px solid #bbf7d0;border-radius:999px;padding:5px 10px;cursor:pointer;">View All →</button>
</div>
    </section>
   

                    <section class="ops-section advisor-section">
                        <div class="ops-section-title">AI Farm Advisor</div>
                        <div id="ai-overview-text" class="advisor-text">Syncing commercial farm data...</div>
                    </section>

                    

                    <section class="ops-section">
<div class="ops-section-title">Zone Health · Tap to drill in</div>
                        <div class="zone-overview-grid">
                            ${re(t,o)}
                        </div>
                    </section>

                

                    <section class="ops-section">
                        <div class="ops-section-title">Tools</div>
                        <div class="ops-tool-grid">
                            ${I("whatif","🔮","What-If")}
                            ${I("control","🎛️","Control")}
                            ${I("disease","🧫","Disease")}
                            ${I("camera","📷","Camera")}
                            ${I("consumption","⚡","ESG")}
                            ${I("alerts","🚨","Alerts")}
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
    `,Qe(),fe(),be(),q()}function fe(){var e,t,o,n,r,i,c,a;(e=document.getElementById("comBackBtn"))==null||e.addEventListener("click",()=>{clearInterval(d.proInterval),v("farmlist")}),(t=document.getElementById("fabPlant"))==null||t.addEventListener("click",de),(o=document.getElementById("assignDeviceBtn"))==null||o.addEventListener("click",Se),(n=document.getElementById("panelToggleBtn"))==null||n.addEventListener("click",D),(r=document.getElementById("panelCloseBtn"))==null||r.addEventListener("click",D),(i=document.getElementById("commercialChatSend"))==null||i.addEventListener("click",O),(c=document.getElementById("commercialChatInput"))==null||c.addEventListener("keydown",s=>{s.key==="Enter"&&O()}),document.querySelectorAll(".fm-drill").forEach(s=>{s.addEventListener("click",()=>{clearInterval(d.proInterval),v("farm-master-detail",{key:s.getAttribute("data-key"),from:"dash-c"})})}),(a=document.getElementById("farmMasterDetailBtn"))==null||a.addEventListener("click",()=>{clearInterval(d.proInterval),v("farm-master-detail",{from:"dash-c"})}),document.querySelectorAll(".com-feat").forEach(s=>{s.addEventListener("click",()=>{const l=s.getAttribute("data-feature");clearInterval(d.proInterval),l==="whatif"?v("whatif-pro"):l==="control"?v("control"):l==="disease"?v("disease"):l==="camera"?(q(),te()):l==="alerts"?v("alert-commercial"):v("feature",{feature:l,from:"dash-c"})})})}function D(){const e=document.getElementById("commercialScreen"),t=document.getElementById("panelToggleBtn"),o=e==null?void 0:e.classList.toggle("panel-hidden");t&&(t.textContent=o?"Show Panel":"Hide Panel"),setTimeout(w,120)}function be(){setTimeout(()=>{var e,t;C.init("commercialFarmCanvas",b()),he(),w(),(t=(e=C).setCameraFrame)==null||t.call(e,!1),w(),requestAnimationFrame(w),setTimeout(w,120),setTimeout(w,350),window.addEventListener("resize",w)},80)}function Z(e,t){e&&Object.entries(t).forEach(([o,n])=>{const r=o.replace(/[A-Z]/g,i=>"-"+i.toLowerCase());e.style.setProperty(r,n,"important")})}function w(){const e=document.getElementById("commercialScreen"),t=document.getElementById("commercialFarmCanvas");if(e&&Z(e,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden"}),t&&Z(t,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",borderRadius:"0",display:"block"}),C.renderer&&C.camera){const o=window.innerWidth||document.documentElement.clientWidth||1280,n=window.innerHeight||document.documentElement.clientHeight||720;C.renderer.setSize(o,n,!1),C.camera.aspect=o/n,C.camera.updateProjectionMatrix()}}function he(){const e=document.getElementById("commercial-command-style");e&&document.head.appendChild(e)}function q(){clearInterval(d.proInterval),d.aiConsulted=!1;const e=async()=>{var t;try{const o=await K(`${E}/api/sensors/latest?deviceId=${M}`,{},4500).catch(()=>null);let n=((t=Y("farm_master"))==null?void 0:t.reading)||null;if(o){const r=await o.json().catch(()=>null),i=r==null?void 0:r.reading;i&&(n=G("farm_master",i,"deviceId="+M).reading)}if(n){const r=(l,u,p)=>{const g=document.getElementById(l);g&&(g.innerText=u,g.style.color=p?"#14532d":"#dc2626")},i=n.waterDistanceCm!=null?Number(n.waterDistanceCm):null,c=n.gasRaw!=null?Number(n.gasRaw):null,a=n.co2Ppm!=null?Number(n.co2Ppm):null,s=n.energyKwh!=null?Number(n.energyKwh):null;r("fm-water",i!=null?`${i.toFixed(1)} cm`:"--",i==null||i>=3&&i<=30),r("fm-gas",c!=null?String(Math.round(c)):"--",c==null||c<3e3),r("fm-co2",a!=null?`${a} ppm`:"--",a==null||a<1500),r("fm-energy",s!=null?`${s.toFixed(2)} kWh`:"--",s==null||s>=0),k("fm-status-text",`Farm master ${X(n)}${n._stale?" · cached":""}`)}if(await we(),!d.aiConsulted){const r=L(b(),T(b()))[0],i=await U((r==null?void 0:r.id)||"zone_A");i!=null&&i.reading&&(Ce(i.reading),d.aiConsulted=!0)}}catch(o){console.error("Dashboard Sync Failed:",o),k("ai-overview-text","Live backend offline. Showing saved farm layout.")}};e(),d.proInterval=setInterval(e,8e3)}function xe(e=h){var c;const t=b(),o=x(e),n=[],r=a=>{const s=new URLSearchParams;if(a.forEach(([u,p])=>{p&&s.set(u,p)}),!s.toString())return;const l=s.toString();n.some(u=>u.toString()===l)||n.push(s)},i=Ze(t,o);return o==="farm_master"?(r([["deviceId",((c=t==null?void 0:t.farmMaster)==null?void 0:c.deviceId)||(t==null?void 0:t.deviceId)||M]]),n):i!=null&&i.deviceId?(r([["deviceId",i.deviceId],["zoneId",o]]),r([["zoneId",o]]),n):(r([["zoneId",o]]),r([["deviceId",ue[o]],["zoneId",o]]),n)}async function U(e=h){const t=xe(e);for(const o of t)try{const r=await(await K(`${E}/api/sensors/latest?${o.toString()}`,{},4500)).json();if(r!=null&&r.reading){const i=G(e,r.reading,o.toString());return{...r,reading:i.reading,sourceQuery:o.toString()}}}catch(n){console.warn("[CommercialPage] sensor query failed:",o.toString(),n.message)}return Y(e)||{reading:null}}async function K(e,t={},o=4500){const n=new AbortController,r=setTimeout(()=>n.abort(),o);try{return await fetch(e,{...t,signal:n.signal})}finally{clearTimeout(r)}}function V(e){const t=b();return`${(t==null?void 0:t.id)||(t==null?void 0:t.backendFarmId)||d.currentFarmId||"commercial_demo"}:${x(e)||e||"farm_master"}`}function J(){try{return JSON.parse(localStorage.getItem(Q))||{}}catch{return{}}}function ve(e){try{localStorage.setItem(Q,JSON.stringify(e))}catch(t){console.warn("[CommercialPage] could not save live reading cache:",t.message)}}function G(e,t,o=""){const n={...t,_sourceQuery:o,_fetchedAt:new Date().toISOString(),_stale:!1},r=J();return r[V(e)]=n,ve(r),{reading:n}}function Y(e){const t=J()[V(e)];return t?{reading:{...t,_stale:!0}}:null}function ye(e){if(!e)return null;if(e instanceof Date)return e;if(typeof e=="object"){if(typeof e.toDate=="function")return e.toDate();if(e._seconds)return new Date(e._seconds*1e3);if(e.seconds)return new Date(e.seconds*1e3)}const t=new Date(e);return Number.isNaN(t.getTime())?null:t}function X(e){const t=ye((e==null?void 0:e._fetchedAt)||(e==null?void 0:e.createdAt)||(e==null?void 0:e.updatedAt)||(e==null?void 0:e.timestamp));return t?`Last updated ${t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:"Last updated --"}async function we(){const e=b(),t=L(e,T(e)),o=await Promise.all(t.map(async n=>{try{const r=await U(n.id);return[n.id,r.reading||null]}catch{return[n.id,null]}}));F=Object.fromEntries(o),ie()}async function Ce(e){const t=`Current sensor data: ${JSON.stringify(e)}. Give one concise operations insight about risk, yield, energy, or automation.`;try{const n=await(await fetch(`${E}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,mode:"commercial"})})).json();k("ai-overview-text",n.reply||n.response||"Farm is operating normally.")}catch{k("ai-overview-text","AI Advisor offline. Sensor dashboard still available.")}}async function O(){const e=document.getElementById("commercialChatInput"),t=e==null?void 0:e.value.trim();if(t){e.value="",R("user",t),R("ai","Thinking...");try{const o=b(),r=await(await fetch(`${E}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,history:S.filter(i=>i.role!=="ai"||i.text!=="Thinking...").map(i=>({role:i.role==="ai"?"assistant":"user",content:i.text})).slice(-10),mode:"commercial",gardenState:{farm:o,sensors:d.sensors}})})).json();P(r.reply||r.response||"I could not generate a recommendation yet.")}catch{P("AI chat is offline, but sensor monitoring and tools still work.")}}}function R(e,t){S.push({role:e,text:t}),ee()}function P(e){const t=S[S.length-1];(t==null?void 0:t.role)==="ai"?t.text=e:S.push({role:"ai",text:e}),ee()}function ee(){const e=document.getElementById("commercialChatLog");e&&(e.innerHTML=S.length?S.map(t=>`<div class="chat-bubble ${t.role}">${f(t.text)}</div>`).join(""):'<div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>',e.scrollTop=e.scrollHeight)}function Se(){var o,n;const e=document.getElementById("assignDeviceOverlay");e&&e.remove();const t=document.createElement("div");t.id="assignDeviceOverlay",t.style.cssText="position:fixed;inset:0;z-index:80;background:rgba(15,23,42,.38);display:flex;align-items:center;justify-content:center;padding:18px;",t.innerHTML=`
        <div style="width:min(430px,100%);background:#fff;border-radius:22px;padding:18px;box-shadow:0 26px 80px rgba(15,23,42,.25);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;">
                <div>
                    <div style="font-size:10px;font-weight:950;color:#15803d;text-transform:uppercase;letter-spacing:.1em;">Commercial Device</div>
                    <strong style="font-size:18px;">Assign Zone Device</strong>
                </div>
                <button id="assignClose" style="width:34px;height:34px;border:none;border-radius:12px;background:#f1f5f9;font-size:18px;font-weight:900;cursor:pointer;">×</button>
            </div>
            <div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;margin-bottom:12px;">
                <label style="display:block;">
                    <span style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">Serial</span>
                    <input id="assignSerial" value="SD-COM-ZON-01001" style="width:100%;padding:12px;border:1px solid #d7eef0;border-radius:14px;outline:none;background:#f7feff;">
                </label>
                <button id="assignScanQr" type="button" style="height:42px;padding:0 13px;border:1px solid #99f6e4;border-radius:14px;background:#ecfeff;color:#0f766e;font-weight:950;cursor:pointer;">Scan QR</button>
                <input id="assignQrInput" type="file" accept="image/*" capture="environment" style="display:none;">
            </div>
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">Zone</label>
            <select id="assignZone" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
                <option value="farm_master">Farm Master</option>
                <option value="zone_A">Zone A</option>
                <option value="zone_B">Zone B</option>
                <option value="zone_C">Zone C</option>
            </select>
            <label style="display:block;margin-bottom:10px;font-size:11px;font-weight:900;color:#64748b;">WiFi SSID</label>
            <input id="assignWifi" placeholder="Farm WiFi" style="width:100%;padding:12px;border:1px solid #e5e7eb;border-radius:14px;margin-bottom:12px;outline:none;">
            <button id="assignSubmit" style="width:100%;padding:13px;border:none;border-radius:14px;background:#0f766e;color:white;font-weight:950;cursor:pointer;">Reassign Active Device</button>
            <div id="assignStatus" style="font-size:12px;color:#64748b;line-height:1.45;margin-top:10px;">Scan a replacement QR or enter a serial. The selected target keeps one active device; the old device is preserved as replaced.</div>
        </div>
    `,document.body.appendChild(t),document.getElementById("assignClose").addEventListener("click",()=>t.remove()),t.addEventListener("click",r=>{r.target===t&&t.remove()}),document.getElementById("assignSubmit").addEventListener("click",Ie),(o=document.getElementById("assignScanQr"))==null||o.addEventListener("click",()=>{var r;return(r=document.getElementById("assignQrInput"))==null?void 0:r.click()}),(n=document.getElementById("assignQrInput"))==null||n.addEventListener("change",async r=>{var c;const i=(c=r.target.files)==null?void 0:c[0];if(i)try{const a=await Me(i),s=ne(a);document.getElementById("assignSerial").value=s,document.getElementById("assignZone").value=Te(s),document.getElementById("assignStatus").style.color="#0f766e",document.getElementById("assignStatus").textContent=`QR scanned: ${s}`}catch(a){document.getElementById("assignStatus").style.color="#dc2626",document.getElementById("assignStatus").textContent=a.message||"Could not read QR code"}finally{r.target.value=""}})}async function Ie(){var i,c,a,s;const e=(i=document.getElementById("assignSerial"))==null?void 0:i.value.trim(),t=(c=document.getElementById("assignZone"))==null?void 0:c.value,o=(a=document.getElementById("assignWifi"))==null?void 0:a.value.trim(),n=document.getElementById("assignStatus"),r=document.getElementById("assignSubmit");if(e){r.disabled=!0,r.textContent="Assigning...";try{const l=t==="farm_master"?"farm_master":"zone_node",u=await fetch(`${E}/api/devices/reassign`,{method:"POST",headers:Be(),body:JSON.stringify({serial:e,wifi_ssid:o,accountType:$e(e,l),farmId:d.currentFarmId||"farm_commercial_001",targetId:t,role:l,zoneId:t})}),p=await u.json();if(!u.ok||!p.ok)throw new Error(p.error||"Device assignment failed");const g=b()||{};g.commercialDevices=Fe(g.commercialDevices||[],p.device,p.replacedDevices||[],t),t==="farm_master"?g.farmMaster=p.device:g.zoneId=t,d.currentFarm=g,oe(g),h=t,d.currentZoneId=h,requestAnimationFrame(()=>{ie(),ae()}),n.style.color="#047857",n.textContent=`Active device: ${p.device.deviceId}. Replaced ${((s=p.replacedDevices)==null?void 0:s.length)||0} old device(s).`}catch(l){n.style.color="#dc2626",n.textContent=l.message}finally{r.disabled=!1,r.textContent="Reassign Active Device"}}}function te(){var s,l,u,p,g;const e=document.getElementById("zoneCameraOverlay");e&&e.remove();const t=b(),o=$(t),n=o.find(m=>m.id===h)||o[0],r=Ee(t,n==null?void 0:n.id)||(t==null?void 0:t.photoPreview)||(t==null?void 0:t.image)||(t==null?void 0:t.thumbnail)||"",i=F[n==null?void 0:n.id]||null,c=document.createElement("div");c.id="zoneCameraOverlay",c.style.cssText="position:fixed;inset:0;z-index:95;background:rgba(15,23,42,.48);display:flex;align-items:center;justify-content:center;padding:18px;",c.innerHTML=`
        <div style="width:min(780px,100%);max-height:92vh;overflow:hidden;background:#fff;border-radius:24px;box-shadow:0 28px 90px rgba(15,23,42,.32);display:flex;flex-direction:column;">
            <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;padding:16px 18px;border-bottom:1px solid #e5e7eb;">
                <div>
                    <div style="font-size:10px;font-weight:950;color:#15803d;text-transform:uppercase;letter-spacing:.1em;">Zone camera live view</div>
                    <strong id="cameraZoneTitle" style="font-size:19px;color:#17231b;">${f((n==null?void 0:n.label)||"Zone Camera")}</strong>
                    <div id="cameraTimestamp" style="font-size:12px;color:#64748b;margin-top:4px;">Live snapshot · ${new Date().toLocaleTimeString()}</div>
                </div>
                <button id="cameraClose" style="width:36px;height:36px;border:none;border-radius:12px;background:#f1f5f9;font-size:18px;font-weight:900;cursor:pointer;">×</button>
            </div>

            <div style="padding:16px;overflow:auto;">
                <div style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(220px,.65fr);gap:14px;">
                    <div id="cameraFeed" style="position:relative;min-height:360px;border-radius:20px;overflow:hidden;background:${r?`url(${r}) center/cover`:"linear-gradient(135deg,#dcfce7,#f8fafc)"};border:1px solid #dbe7dc;">
                        <video id="zoneCameraVideo" autoplay playsinline muted style="display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#0f172a;"></video>
                        <canvas id="zoneCameraCanvas" style="display:none;"></canvas>
                        ${r?"":je(n)}
                        <div style="position:absolute;left:12px;top:12px;display:flex;gap:7px;align-items:center;background:rgba(15,23,42,.66);color:#fff;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900;">
                            <span style="width:7px;height:7px;background:#22c55e;border-radius:50%;box-shadow:0 0 12px #22c55e;"></span>
                            LIVE CAMERA
                        </div>
                        <div style="position:absolute;right:12px;bottom:12px;background:rgba(255,255,255,.86);border:1px solid rgba(255,255,255,.7);border-radius:14px;padding:9px 10px;color:#17231b;font-size:12px;font-weight:900;">
                            ${f((n==null?void 0:n.crop)||"Mixed crops")}
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:10px;">
                        <label style="display:block;">
                            <span style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">Select zone</span>
                            <select id="cameraZoneSelect" style="width:100%;margin-top:6px;padding:12px;border:1px solid #e5e7eb;border-radius:14px;background:#f8fafc;outline:none;font-weight:900;color:#17231b;">
                                ${o.map(m=>`<option value="${He(m.id)}" ${m.id===(n==null?void 0:n.id)?"selected":""}>${f(m.label)} · ${f(m.crop)}</option>`).join("")}
                            </select>
                        </label>
                        ${A("Temp",(i==null?void 0:i.temperature)!==void 0?`${Number(i.temperature).toFixed(1)}C`:"--")}
                        ${A("Humidity",(i==null?void 0:i.humidity)!==void 0?`${i.humidity}%`:"--")}
                        ${A("Light",(i==null?void 0:i.lightRaw)??"--")}
                        ${A("Plant count",`${(n==null?void 0:n.planted)??ce(t)} plants`)}
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px;">
                            <button id="cameraStartBtn" style="padding:13px;border:1px solid #99f6e4;border-radius:14px;background:#ecfeff;color:#0f766e;font-weight:950;cursor:pointer;">Start camera</button>
                            <button id="cameraCaptureBtn" style="padding:13px;border:none;border-radius:14px;background:#166534;color:#fff;font-weight:950;cursor:pointer;">Capture frame</button>
                        </div>
                        <button id="cameraStopBtn" style="padding:12px;border:1px solid #dbe7dc;border-radius:14px;background:#fff;color:#64748b;font-weight:900;cursor:pointer;">Stop camera</button>
                        <div id="cameraStatus" style="font-size:12px;color:#64748b;line-height:1.45;">Use browser camera for the demo, or keep the latest farm photo/captured snapshot as fallback. Captured frames are saved to the selected zone for disease analysis context.</div>
                    </div>
                </div>
            </div>
        </div>
    `,document.body.appendChild(c);const a=()=>{B(),c.remove()};(s=document.getElementById("cameraClose"))==null||s.addEventListener("click",a),c.addEventListener("click",m=>{m.target===c&&a()}),(l=document.getElementById("cameraStartBtn"))==null||l.addEventListener("click",()=>ze()),(u=document.getElementById("cameraCaptureBtn"))==null||u.addEventListener("click",ke),(p=document.getElementById("cameraStopBtn"))==null||p.addEventListener("click",()=>{B(),document.getElementById("cameraStatus").textContent="Browser camera stopped. The latest saved snapshot is still available for this zone."}),(g=document.getElementById("cameraZoneSelect"))==null||g.addEventListener("change",m=>{h=m.target.value,d.currentZoneId=h,B(),c.remove(),ae(),te()})}async function ze(){var o,n;const e=document.getElementById("cameraStatus"),t=document.getElementById("zoneCameraVideo");if(!((o=navigator.mediaDevices)!=null&&o.getUserMedia)){e&&(e.textContent="This browser does not support direct camera preview. Using saved snapshot/photo fallback.");return}B();try{z=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1}),t&&(t.srcObject=z,t.style.display="block",await t.play().catch(()=>{})),(n=document.querySelector("[data-camera-placeholder]"))==null||n.setAttribute("style","display:none;"),e&&(e.textContent="Browser camera is live. Capture a frame to save it as this zone camera snapshot.")}catch(r){e&&(e.textContent=`Camera unavailable: ${r.message}. Saved snapshot/photo fallback is still available.`)}}function B(){z&&(z.getTracks().forEach(t=>t.stop()),z=null);const e=document.getElementById("zoneCameraVideo");e&&(e.pause(),e.srcObject=null,e.style.display="none")}function ke(){var c;const e=document.getElementById("cameraStatus"),t=document.getElementById("zoneCameraVideo"),o=document.getElementById("zoneCameraCanvas"),n=((c=document.getElementById("cameraZoneSelect"))==null?void 0:c.value)||h;if(!t||!o||!z||!t.videoWidth){document.getElementById("cameraTimestamp").textContent=`Live snapshot · ${new Date().toLocaleTimeString()}`,e&&(e.textContent="No browser camera frame is active yet. Start camera first, or continue using the saved snapshot/photo fallback.");return}o.width=t.videoWidth,o.height=t.videoHeight,o.getContext("2d").drawImage(t,0,0,o.width,o.height);const i=o.toDataURL("image/jpeg",.88);_e(n,i),Ae(i),document.getElementById("cameraTimestamp").textContent=`Captured · ${new Date().toLocaleTimeString()}`,e&&(e.textContent="Frame saved to this zone. Disease Analysis can use the latest captured snapshot as context.")}function Ee(e,t){var n;if(!t)return"";const o=(e==null?void 0:e.id)||d.currentFarmId||"commercial_demo";if((n=e==null?void 0:e.zoneCameraSnapshots)!=null&&n[t])return e.zoneCameraSnapshots[t];try{const r=JSON.parse(localStorage.getItem(W)||"{}");return(r==null?void 0:r.farmKey)===o&&(r==null?void 0:r.zoneId)===t?r.dataUrl:""}catch{return""}}function _e(e,t){const o=b()||{},n={...o,zoneCameraSnapshots:{...o.zoneCameraSnapshots||{},[e]:t},lastCameraZoneId:e,lastCameraSnapshotAt:new Date().toISOString()};d.currentFarm=n,oe(n);try{localStorage.setItem(W,JSON.stringify({farmKey:n.id||d.currentFarmId||"commercial_demo",zoneId:e,dataUrl:t,capturedAt:n.lastCameraSnapshotAt}))}catch(r){console.warn("[CommercialPage] could not save camera snapshot:",r.message)}}function Ae(e){var n;const t=document.getElementById("cameraFeed"),o=document.getElementById("zoneCameraVideo");t&&(t.style.background=`url(${e}) center/cover`),o&&(o.style.display="none"),(n=document.querySelector("[data-camera-placeholder]"))==null||n.setAttribute("style","display:none;")}function Be(){const e=localStorage.getItem("token");return{"Content-Type":"application/json",...e?{Authorization:`Bearer ${e}`}:{}}}function $e(e="",t="zone_node"){const o=String(e).toUpperCase();return t==="farm_master"||o.includes("FRM")||o.includes("MST")?"commercial_farm_master":o.includes("FZK")?"commercial_farm_zone":o.includes("ZNP")?"commercial_zone_pro":o.includes("ZNB")?"commercial_zone_basic":"commercial_zone"}function Te(e=""){const t=String(e).toUpperCase();return t.includes("FRM")||t.includes("MST")?"farm_master":"zone_A"}function j(e){const t=String(e||"").trim(),o=ge[t.toLowerCase()];return String(o||t).trim().toUpperCase()}function ne(e){if(typeof e=="string")try{const o=JSON.parse(e);return ne(o)}catch{return j(e)}const t=(e==null?void 0:e.serial)||(e==null?void 0:e.deviceSerial)||(e==null?void 0:e.qrSerial)||(e==null?void 0:e.token)||(e==null?void 0:e.deviceToken)||(e==null?void 0:e.id);if(!t)throw new Error("QR does not contain a SeedDown serial");return j(t)}function Me(e){return new Promise((t,o)=>{const n=new FileReader;n.onerror=()=>o(new Error("Could not read QR image")),n.onload=()=>{const r=new Image;r.onerror=()=>o(new Error("Could not load QR image")),r.onload=()=>{const i=document.createElement("canvas");i.width=r.naturalWidth||r.width,i.height=r.naturalHeight||r.height;const c=i.getContext("2d",{willReadFrequently:!0});c.drawImage(r,0,0,i.width,i.height);const a=c.getImageData(0,0,i.width,i.height),s=me(a.data,a.width,a.height);s!=null&&s.data?t(s.data):o(new Error("No QR code found in image"))},r.src=n.result},n.readAsDataURL(e)})}function Fe(e,t,o=[],n=(t==null?void 0:t.targetId)||(t==null?void 0:t.zoneId)){const r=x(n),i=new Set(o.map(a=>a.deviceId)),c={...t,targetId:n,role:n==="farm_master"?"farm_master":t.role||"zone_node",active:!0,status:"assigned",assignedAt:new Date().toISOString()};return[...e.map(a=>{const s=x(a.targetId||a.zoneId||a.zone)===r;return a.deviceId===t.deviceId?null:i.has(a.deviceId)||s?{...a,active:!1,status:"replaced",replacedBy:t.deviceId,replacedAt:new Date().toISOString()}:a}).filter(Boolean),c]}function oe(e){const t=le(),o=t.findIndex(n=>n.id===e.id);o>=0?t[o]={...t[o],...e}:t.push(e),localStorage.setItem("user_farms",JSON.stringify(t))}function re(e,t){return L(e,t).map(o=>Le(o)).join("")}function Le(e){var i;const t=F[e.id],o=Pe(t,((i=b())==null?void 0:i.thresholds)||{}),n=e.deviceId?e.deviceId.replace(/^dev_/,""):"unassigned",r=t?`${H(t.temperature,"°C")} · ${H(t.humidity,"%")} · pH ${t.ph!=null?Number(t.ph).toFixed(1):"--"} · ${X(t)}${t._stale?" · cached":""}`:"waiting for first reading";return`
        <button class="commercial-zone-card ${o.level}" data-zone="${e.id}" type="button">
            <div class="zone-card-head">
                <span>${f(e.label)}</span>
                <b>${o.label}</b>
            </div>
            <strong>${f(e.crop)}</strong>
            <div class="zone-card-meta">${e.planted}/${e.capacity} slots · ${f(n)}</div>
            <div class="zone-meter"><i style="width:${e.occupied}%"></i></div>
            <small>${f(r)}</small>
            <div style="margin-top:8px;font-size:10px;font-weight:900;color:#047857;">→ Tap to drill into zone</div>
        </button>
    `}function ie(){const e=document.querySelector(".zone-overview-grid");e&&(e.innerHTML=re(b(),T(b())),Ne())}function Ne(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.addEventListener("click",()=>{clearInterval(d.proInterval),v("zone-detail",{zoneId:e.getAttribute("data-zone"),from:"dash-c"})})})}function ae(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-zone")===h)}),k("liveSensorTitle",`Live Sensors · ${Re(h)}`)}function L(e,t){const o=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=$(e),r=se(e,t),i=Math.max(1,Math.ceil((r.total||(t==null?void 0:t.total)||9)/n.length)),c=Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[];return n.map((a,s)=>{const l=o.filter((m,_)=>{const N=x(m.zoneId||m.zone||m.area);return N?N===a.id:_%n.length===s}),u=c.find(m=>m.status!=="replaced"&&m.active!==!1&&x(m.targetId||m.zoneId||m.zone)===a.id),p=De(l)||a.crop,g=l.reduce((m,_)=>m+(Number.parseInt(_.slots||_.count||1,10)||1),0);return{...a,crop:p,planted:g,capacity:i,occupied:Math.min(100,Math.round(g/i*100)),deviceId:(u==null?void 0:u.deviceId)||((e==null?void 0:e.zoneId)===a.id?e.deviceId:null)}})}function se(e,t){var s;const o=Array.isArray((s=e==null?void 0:e.commercialStructure)==null?void 0:s.zones)?e.commercialStructure.zones:Array.isArray(e==null?void 0:e.zones)?e.zones:[],n=ce(e);if(!o.length){const l=Number.parseInt(e==null?void 0:e.plantSlots,10)||(t==null?void 0:t.total)||n||0;return{label:(t==null?void 0:t.label)||"Commercial Farm",planted:n,total:Math.max(l,n)}}const r=o.length,i=o.reduce((l,u)=>{const p=Number.parseInt(u.capacity??u.slots??u.plantSlots??u.count??0,10);return l+(Number.isFinite(p)&&p>0?p:0)},0),c=Number.parseInt(e==null?void 0:e.plantSlots,10)||Number.parseInt(e==null?void 0:e.capacity,10)||0,a=Math.max(i,c,n,r*12);return{label:`${r}-Zone Commercial Farm`,planted:n,total:a}}function $(e){var o;const t=Array.isArray((o=e==null?void 0:e.commercialStructure)==null?void 0:o.zones)?e.commercialStructure.zones:Array.isArray(e==null?void 0:e.zones)?e.zones:[];return t.length?t.map((n,r)=>({id:x(n.zone_id||n.id||`zone_${String.fromCharCode(65+r)}`),label:n.name||`Zone ${String.fromCharCode(65+r)}`,crop:n.crop||(Array.isArray(n.plants)?n.plants.join(", "):"")||"Mixed Crops"})):pe}function De(e){var o;if(!e.length)return"";const t=e.reduce((n,r)=>{const i=r.name||r.species||"Mixed Crops";return n[i]=(n[i]||0)+1,n},{});return((o=Object.entries(t).sort((n,r)=>r[1]-n[1])[0])==null?void 0:o[0])||""}function Ze(e,t){return t?(Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[]).find(n=>n.status!=="replaced"&&n.active!==!1&&x(n.targetId||n.zoneId||n.zone)===t)||(x(e==null?void 0:e.zoneId)===t?e:null):null}function x(e){const t=String(e||"").trim().toLowerCase();if(!t)return"";const o=t.match(/^([a-z])$/),n=t.match(/^zone[_ ]([a-z])$/),r=(o==null?void 0:o[1])||(n==null?void 0:n[1]);return r?`zone_${r.toUpperCase()}`:t.startsWith("zone_")?`zone_${t.slice(5).toUpperCase()}`:t}function Oe(e){var o;const t=((o=$(e)[0])==null?void 0:o.id)||"zone_A";return x(d.currentZoneId||(e==null?void 0:e.zoneId))||t}function Re(e){var t;return((t=$(b()).find(o=>o.id===e))==null?void 0:t.label)||"Farm"}function Pe(e,t={}){if(!e)return{level:"idle",label:"No Data"};const o=Number(t.gasDangerThreshold??3e3),n=Number(t.tempMin??18),r=Number(t.tempMax??35),i=Number(t.phMin??5.5),c=Number(t.phMax??6.8),a=Number(t.darkThreshold??1500),s=Number(t.waterLowCm??20);return Number(e.gasRaw)>o||Number(e.temperature)>r+3?{level:"critical",label:"Critical"}:Number(e.temperature)<n||Number(e.temperature)>r||Number(e.ph)<i||Number(e.ph)>c||Number(e.lightRaw)<a||Number(e.waterDistanceCm)>s?{level:"warning",label:"Warning"}:{level:"healthy",label:"Healthy"}}function H(e,t=""){const o=Number(e);return Number.isFinite(o)?`${o.toFixed(o%1?1:0)}${t}`:`--${t}`}function I(e,t,o){return'<button class="com-feat ops-tool-btn" data-feature="'+e+'" type="button"><span>'+t+"</span><strong>"+o+"</strong></button>"}function A(e,t){return`
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:11px 12px;">
            <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">${f(e)}</div>
            <strong style="display:block;margin-top:4px;color:#047857;font-size:16px;">${f(t)}</strong>
        </div>
    `}function je(e){const t=(e==null?void 0:e.crop)||"Mixed crops";return`
        <div data-camera-placeholder style="position:absolute;inset:0;display:grid;place-items:center;padding:28px;">
            <div style="width:min(420px,92%);aspect-ratio:4/3;border-radius:22px;background:linear-gradient(180deg,#ecfdf5,#dbeafe);border:1px solid rgba(22,101,52,.16);box-shadow:inset 0 0 0 8px rgba(255,255,255,.38);display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:24px;">
                ${Array.from({length:12},(o,n)=>`
                    <div style="border-radius:999px;background:${n%3===0?"#22c55e":n%3===1?"#16a34a":"#84cc16"};box-shadow:0 12px 24px rgba(22,101,52,.18);"></div>
                `).join("")}
            </div>
            <div style="position:absolute;bottom:22px;left:22px;right:22px;text-align:center;color:#166534;font-size:13px;font-weight:900;">Simulated live field frame · ${f(t)}</div>
        </div>
    `}function b(){const e=le();return d.currentFarm||e.find(t=>t.id===d.currentFarmId)||e[e.length-1]||null}function T(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?y["2-tier"]:t.includes("4")?y["4-tier"]:t.includes("5")?y["5-tier"]:t.includes("wall")||t.includes("grid")?y.wall:t.includes("frame")?y["a-frame"]:t.includes("nft")||t.includes("channel")?y["nft-channel"]:t.includes("hanging")||t.includes("column")?y.hanging:y["3-tier"]}function ce(e){return Array.isArray(e==null?void 0:e.plants)?e.plants.reduce((t,o)=>t+(Number.parseInt(o.slots||o.count||1,10)||1),0):Number.parseInt(e==null?void 0:e.plants,10)||Number.parseInt(e==null?void 0:e.plantSlots,10)||0}function le(){try{return JSON.parse(localStorage.getItem("user_farms"))||[]}catch{return[]}}function k(e,t){const o=document.getElementById(e);o&&(o.innerText=t)}function f(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function He(e){return f(e)}function Qe(){if(document.getElementById("commercial-command-style"))return;const e=document.createElement("style");e.id="commercial-command-style",e.textContent=`
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
.fm-tile {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 14px;
    padding: 10px 12px;
    text-align: left;
    cursor: pointer;
    transition: background .15s, border-color .15s, transform .15s;
}
.fm-tile:hover {
    background: #dcfce7;
    border-color: #86efac;
    transform: translateY(-1px);
}
.fm-tile span {
    display: block;
    font-size: 9px;
    font-weight: 950;
    color: #15803d;
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-bottom: 6px;
}
.fm-tile strong {
    display: block;
    font-size: 16px;
    font-weight: 950;
    color: #14532d;
}

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
            top: 148px !important;
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
            .commercial-command-screen .cf-info-panel {
                top: 164px !important;
                left: 12px !important;
                width: calc(100vw - 24px) !important;
                min-width: 0 !important;
                max-width: 360px !important;
            }
            .commercial-panel-toggle { top: auto; bottom: 16px; right: 16px; }
            .commercial-ops-panel { top: 94px; left: 12px; right: 12px; bottom: 70px; width: auto; }
            .commercial-command-screen.panel-hidden .commercial-ops-panel { transform: translateY(calc(100% + 90px)); }
            .ops-sensor-grid { grid-template-columns: repeat(2, 1fr); }
            .ops-tool-grid { grid-template-columns: repeat(2, 1fr); }
        }
    `,document.head.appendChild(e)}export{Ge as render};
