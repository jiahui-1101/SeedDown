import{A as p,s as x}from"./index-BwcRKJkh.js";import{C as w}from"./CommercialFarmCanvas-BQmtFGEX.js";import{o as K}from"./AddPlantModal-CYfjVda2.js";import Y from"https://esm.sh/jsqr@1.4.0";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const k=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,v={"2-tier":{label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}};let I=[],b=null,T={};const X=[{id:"zone_A",label:"Zone A",crop:"Leafy Greens"},{id:"zone_B",label:"Zone B",crop:"Fruit Crops"},{id:"zone_C",label:"Zone C",crop:"Herbs"},{id:"zone_D",label:"Zone D",crop:"Mixed Crops"},{id:"zone_E",label:"Zone E",crop:"Mixed Crops"},{id:"zone_F",label:"Zone F",crop:"Mixed Crops"}],ee={zone_A:"commercial-zone-node-1",zone_B:"commercial-zone-node-2",zone_C:"commercial-zone-node-3",zone_D:"commercial-zone-node-4",zone_E:"commercial-zone-node-5",zone_F:"commercial-zone-node-6"},D="commercial-farm-master-1";function Be(){const e=document.getElementById("screenContainer"),t=f();p.currentFarm=t;const o=$(t),n=J(t),r=o.total?Math.min(100,Math.round(n/o.total*100)):0;b||(b=ve(t)),e.innerHTML=`
        <div class="screen active commercial-command-screen" id="commercialScreen">
            <canvas id="commercialFarmCanvas" class="commercial-command-canvas"></canvas>

            <div class="commercial-top-shell">
                <button id="comBackBtn" class="commercial-icon-btn" aria-label="Back to farms">←</button>
                <div class="commercial-title-card">
                    <div class="commercial-kicker">Commercial Digital Twin</div>
                    <div class="commercial-title-row">
                        <strong>${u((t==null?void 0:t.name)||p.farmName||"Commercial Farm")}</strong>
                        <span>${r}% occupied</span>
                    </div>
                    <small>${u(o.label)} · ${n}/${o.total} planted</small>
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
                            ${q(t,o)}
                        </div>
                    </section>

                

                    <section class="ops-section">
                        <div class="ops-section-title">Tools</div>
                        <div class="ops-tool-grid">
                            ${z("whatif","🔮","What-If")}
                            ${z("control","🎛️","Control")}
                            ${z("disease","🧫","Disease")}
                            ${z("camera","📷","Camera")}
                            ${z("consumption","⚡","ESG")}
                            ${z("alerts","🚨","Alerts")}
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
    `,ke(),te(),ne(),O()}function te(){var e,t,o,n,r,i,a,s;(e=document.getElementById("comBackBtn"))==null||e.addEventListener("click",()=>{clearInterval(p.proInterval),x("farmlist")}),(t=document.getElementById("fabPlant"))==null||t.addEventListener("click",K),(o=document.getElementById("assignDeviceBtn"))==null||o.addEventListener("click",se),(n=document.getElementById("panelToggleBtn"))==null||n.addEventListener("click",M),(r=document.getElementById("panelCloseBtn"))==null||r.addEventListener("click",M),(i=document.getElementById("commercialChatSend"))==null||i.addEventListener("click",F),(a=document.getElementById("commercialChatInput"))==null||a.addEventListener("keydown",c=>{c.key==="Enter"&&F()}),document.querySelectorAll(".fm-drill").forEach(c=>{c.addEventListener("click",()=>{clearInterval(p.proInterval),x("farm-master-detail",{key:c.getAttribute("data-key"),from:"dash-c"})})}),(s=document.getElementById("farmMasterDetailBtn"))==null||s.addEventListener("click",()=>{clearInterval(p.proInterval),x("farm-master-detail",{from:"dash-c"})}),document.querySelectorAll(".com-feat").forEach(c=>{c.addEventListener("click",()=>{const l=c.getAttribute("data-feature");clearInterval(p.proInterval),l==="whatif"?x("whatif-pro"):l==="control"?x("control"):l==="disease"?x("disease"):l==="camera"?(O(),Q()):l==="alerts"?x("alert-commercial"):x("feature",{feature:l,from:"dash-c"})})})}function M(){const e=document.getElementById("commercialScreen"),t=document.getElementById("panelToggleBtn"),o=e==null?void 0:e.classList.toggle("panel-hidden");t&&(t.textContent=o?"Show Panel":"Hide Panel"),setTimeout(y,120)}function ne(){setTimeout(()=>{var e,t;w.init("commercialFarmCanvas",f()),oe(),y(),(t=(e=w).setCameraFrame)==null||t.call(e,!1),y(),requestAnimationFrame(y),setTimeout(y,120),setTimeout(y,350),window.addEventListener("resize",y)},80)}function L(e,t){e&&Object.entries(t).forEach(([o,n])=>{const r=o.replace(/[A-Z]/g,i=>"-"+i.toLowerCase());e.style.setProperty(r,n,"important")})}function y(){const e=document.getElementById("commercialScreen"),t=document.getElementById("commercialFarmCanvas");if(e&&L(e,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden"}),t&&L(t,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",borderRadius:"0",display:"block"}),w.renderer&&w.camera){const o=window.innerWidth||document.documentElement.clientWidth||1280,n=window.innerHeight||document.documentElement.clientHeight||720;w.renderer.setSize(o,n,!1),w.camera.aspect=o/n,w.camera.updateProjectionMatrix()}}function oe(){const e=document.getElementById("commercial-command-style");e&&document.head.appendChild(e)}function O(){clearInterval(p.proInterval),p.aiConsulted=!1;const e=async()=>{try{const t=await j(`${k}/api/sensors/latest?deviceId=${D}`,{},4500).catch(()=>null);if(t){const o=await t.json().catch(()=>null),n=o==null?void 0:o.reading;if(n){const r=(l,m,g)=>{const d=document.getElementById(l);d&&(d.innerText=m,d.style.color=g?"#14532d":"#dc2626")},i=n.waterDistanceCm!=null?Number(n.waterDistanceCm):null,a=n.gasRaw!=null?Number(n.gasRaw):null,s=n.co2Ppm!=null?Number(n.co2Ppm):null,c=n.energyKwh!=null?Number(n.energyKwh):null;r("fm-water",i!=null?`${i.toFixed(1)} cm`:"--",i==null||i>=3&&i<=30),r("fm-gas",a!=null?String(Math.round(a)):"--",a==null||a<3e3),r("fm-co2",s!=null?`${s} ppm`:"--",s==null||s<1500),r("fm-energy",c!=null?`${c.toFixed(2)} kWh`:"--",c==null||c>=0)}}if(await ie(),!p.aiConsulted){const o=B(f(),$(f()))[0],n=await P((o==null?void 0:o.id)||"zone_A");n!=null&&n.reading&&(ae(n.reading),p.aiConsulted=!0)}}catch(t){console.error("Dashboard Sync Failed:",t),E("ai-overview-text","Live backend offline. Showing saved farm layout.")}};e(),p.proInterval=setInterval(e,8e3)}function re(e=b){var a;const t=f(),o=h(e),n=[],r=(s,c)=>{if(!c)return;const l=new URLSearchParams;l.set(s,c);const m=l.toString();n.some(g=>g.toString()===m)||n.push(l)},i=he(t,o);return r("deviceId",i==null?void 0:i.deviceId),r("zoneId",o),r("deviceId",ee[o]),o==="farm_master"&&(r("deviceId",(a=t==null?void 0:t.farmMaster)==null?void 0:a.deviceId),r("deviceId",t==null?void 0:t.deviceId),r("deviceId",D)),r("farmId",t==null?void 0:t.id),r("farmId",t==null?void 0:t.backendFarmId),r("farmId","farm_commercial_demo_001"),r("deviceId","farm_001"),n}async function P(e=b){const t=re(e);for(const o of t)try{const r=await(await j(`${k}/api/sensors/latest?${o.toString()}`,{},4500)).json();if(r!=null&&r.reading)return{...r,sourceQuery:o.toString()}}catch(n){console.warn("[CommercialPage] sensor query failed:",o.toString(),n.message)}return{reading:null}}async function j(e,t={},o=4500){const n=new AbortController,r=setTimeout(()=>n.abort(),o);try{return await fetch(e,{...t,signal:n.signal})}finally{clearTimeout(r)}}async function ie(){const e=f(),t=B(e,$(e)),o=await Promise.all(t.map(async n=>{try{const r=await P(n.id);return[n.id,r.reading||null]}catch{return[n.id,null]}}));T=Object.fromEntries(o),U()}async function ae(e){const t=`Current sensor data: ${JSON.stringify(e)}. Give one concise operations insight about risk, yield, energy, or automation.`;try{const n=await(await fetch(`${k}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,mode:"commercial"})})).json();E("ai-overview-text",n.reply||n.response||"Farm is operating normally.")}catch{E("ai-overview-text","AI Advisor offline. Sensor dashboard still available.")}}async function F(){const e=document.getElementById("commercialChatInput"),t=e==null?void 0:e.value.trim();if(t){e.value="",N("user",t),N("ai","Thinking...");try{const o=f(),r=await(await fetch(`${k}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,history:I.filter(i=>i.role!=="ai"||i.text!=="Thinking...").map(i=>({role:i.role==="ai"?"assistant":"user",content:i.text})).slice(-10),mode:"commercial",gardenState:{farm:o,sensors:p.sensors}})})).json();Z(r.reply||r.response||"I could not generate a recommendation yet.")}catch{Z("AI chat is offline, but sensor monitoring and tools still work.")}}}function N(e,t){I.push({role:e,text:t}),H()}function Z(e){const t=I[I.length-1];(t==null?void 0:t.role)==="ai"?t.text=e:I.push({role:"ai",text:e}),H()}function H(){const e=document.getElementById("commercialChatLog");e&&(e.innerHTML=I.length?I.map(t=>`<div class="chat-bubble ${t.role}">${u(t.text)}</div>`).join(""):'<div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>',e.scrollTop=e.scrollHeight)}function se(){var o,n;const e=document.getElementById("assignDeviceOverlay");e&&e.remove();const t=document.createElement("div");t.id="assignDeviceOverlay",t.style.cssText="position:fixed;inset:0;z-index:80;background:rgba(15,23,42,.38);display:flex;align-items:center;justify-content:center;padding:18px;",t.innerHTML=`
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
    `,document.body.appendChild(t),document.getElementById("assignClose").addEventListener("click",()=>t.remove()),t.addEventListener("click",r=>{r.target===t&&t.remove()}),document.getElementById("assignSubmit").addEventListener("click",ce),(o=document.getElementById("assignScanQr"))==null||o.addEventListener("click",()=>{var r;return(r=document.getElementById("assignQrInput"))==null?void 0:r.click()}),(n=document.getElementById("assignQrInput"))==null||n.addEventListener("change",async r=>{var a;const i=(a=r.target.files)==null?void 0:a[0];if(i)try{const s=await me(i),c=W(s);document.getElementById("assignSerial").value=c,document.getElementById("assignZone").value=pe(c),document.getElementById("assignStatus").style.color="#0f766e",document.getElementById("assignStatus").textContent=`QR scanned: ${c}`}catch(s){document.getElementById("assignStatus").style.color="#dc2626",document.getElementById("assignStatus").textContent=s.message||"Could not read QR code"}finally{r.target.value=""}})}async function ce(){var i,a,s,c;const e=(i=document.getElementById("assignSerial"))==null?void 0:i.value.trim(),t=(a=document.getElementById("assignZone"))==null?void 0:a.value,o=(s=document.getElementById("assignWifi"))==null?void 0:s.value.trim(),n=document.getElementById("assignStatus"),r=document.getElementById("assignSubmit");if(e){r.disabled=!0,r.textContent="Assigning...";try{const l=t==="farm_master"?"farm_master":"zone_node",m=await fetch(`${k}/api/devices/reassign`,{method:"POST",headers:le(),body:JSON.stringify({serial:e,wifi_ssid:o,accountType:de(e,l),farmId:p.currentFarmId||"farm_commercial_001",targetId:t,role:l,zoneId:t})}),g=await m.json();if(!m.ok||!g.ok)throw new Error(g.error||"Device assignment failed");const d=f()||{};d.commercialDevices=ue(d.commercialDevices||[],g.device,g.replacedDevices||[],t),t==="farm_master"?d.farmMaster=g.device:d.zoneId=t,p.currentFarm=d,ge(d),b=t,p.currentZoneId=b,requestAnimationFrame(()=>{U(),G()}),n.style.color="#047857",n.textContent=`Active device: ${g.device.deviceId}. Replaced ${((c=g.replacedDevices)==null?void 0:c.length)||0} old device(s).`}catch(l){n.style.color="#dc2626",n.textContent=l.message}finally{r.disabled=!1,r.textContent="Reassign Active Device"}}}function Q(){var s,c,l;const e=document.getElementById("zoneCameraOverlay");e&&e.remove();const t=f(),o=A(t),n=o.find(m=>m.id===b)||o[0],r=(t==null?void 0:t.photoPreview)||(t==null?void 0:t.image)||(t==null?void 0:t.thumbnail)||"",i=T[n==null?void 0:n.id]||null,a=document.createElement("div");a.id="zoneCameraOverlay",a.style.cssText="position:fixed;inset:0;z-index:95;background:rgba(15,23,42,.48);display:flex;align-items:center;justify-content:center;padding:18px;",a.innerHTML=`
        <div style="width:min(780px,100%);max-height:92vh;overflow:hidden;background:#fff;border-radius:24px;box-shadow:0 28px 90px rgba(15,23,42,.32);display:flex;flex-direction:column;">
            <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;padding:16px 18px;border-bottom:1px solid #e5e7eb;">
                <div>
                    <div style="font-size:10px;font-weight:950;color:#15803d;text-transform:uppercase;letter-spacing:.1em;">Zone camera live view</div>
                    <strong id="cameraZoneTitle" style="font-size:19px;color:#17231b;">${u((n==null?void 0:n.label)||"Zone Camera")}</strong>
                    <div id="cameraTimestamp" style="font-size:12px;color:#64748b;margin-top:4px;">Live snapshot · ${new Date().toLocaleTimeString()}</div>
                </div>
                <button id="cameraClose" style="width:36px;height:36px;border:none;border-radius:12px;background:#f1f5f9;font-size:18px;font-weight:900;cursor:pointer;">×</button>
            </div>

            <div style="padding:16px;overflow:auto;">
                <div style="display:grid;grid-template-columns:minmax(0,1.35fr) minmax(220px,.65fr);gap:14px;">
                    <div id="cameraFeed" style="position:relative;min-height:360px;border-radius:20px;overflow:hidden;background:${r?`url(${r}) center/cover`:"linear-gradient(135deg,#dcfce7,#f8fafc)"};border:1px solid #dbe7dc;">
                        ${r?"":Ie(n)}
                        <div style="position:absolute;left:12px;top:12px;display:flex;gap:7px;align-items:center;background:rgba(15,23,42,.66);color:#fff;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900;">
                            <span style="width:7px;height:7px;background:#22c55e;border-radius:50%;box-shadow:0 0 12px #22c55e;"></span>
                            LIVE CAMERA
                        </div>
                        <div style="position:absolute;right:12px;bottom:12px;background:rgba(255,255,255,.86);border:1px solid rgba(255,255,255,.7);border-radius:14px;padding:9px 10px;color:#17231b;font-size:12px;font-weight:900;">
                            ${u((n==null?void 0:n.crop)||"Mixed crops")}
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;gap:10px;">
                        <label style="display:block;">
                            <span style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">Select zone</span>
                            <select id="cameraZoneSelect" style="width:100%;margin-top:6px;padding:12px;border:1px solid #e5e7eb;border-radius:14px;background:#f8fafc;outline:none;font-weight:900;color:#17231b;">
                                ${o.map(m=>`<option value="${ze(m.id)}" ${m.id===(n==null?void 0:n.id)?"selected":""}>${u(m.label)} · ${u(m.crop)}</option>`).join("")}
                            </select>
                        </label>
                        ${S("Temp",(i==null?void 0:i.temperature)!==void 0?`${Number(i.temperature).toFixed(1)}C`:"--")}
                        ${S("Humidity",(i==null?void 0:i.humidity)!==void 0?`${i.humidity}%`:"--")}
                        ${S("Light",(i==null?void 0:i.lightRaw)??"--")}
                        ${S("Plant count",`${(n==null?void 0:n.planted)??J(t)} plants`)}
                        <button id="cameraCaptureBtn" style="margin-top:4px;padding:13px;border:none;border-radius:14px;background:#166534;color:#fff;font-weight:950;cursor:pointer;">Capture latest frame</button>
                        <div id="cameraStatus" style="font-size:12px;color:#64748b;line-height:1.45;">Camera feed uses the latest farm photo / camera snapshot attached to this commercial farm. Each zone camera can be checked before running disease analysis.</div>
                    </div>
                </div>
            </div>
        </div>
    `,document.body.appendChild(a),(s=document.getElementById("cameraClose"))==null||s.addEventListener("click",()=>a.remove()),a.addEventListener("click",m=>{m.target===a&&a.remove()}),(c=document.getElementById("cameraCaptureBtn"))==null||c.addEventListener("click",()=>{document.getElementById("cameraTimestamp").textContent=`Live snapshot · ${new Date().toLocaleTimeString()}`,document.getElementById("cameraStatus").textContent="Latest camera frame captured for review. Use Disease Analysis if this zone looks unhealthy."}),(l=document.getElementById("cameraZoneSelect"))==null||l.addEventListener("change",m=>{b=m.target.value,p.currentZoneId=b,a.remove(),G(),Q()})}function le(){const e=localStorage.getItem("token");return{"Content-Type":"application/json",...e?{Authorization:`Bearer ${e}`}:{}}}function de(e="",t="zone_node"){const o=String(e).toUpperCase();return t==="farm_master"||o.includes("FRM")||o.includes("MST")?"commercial_farm_master":o.includes("FZK")?"commercial_farm_zone":o.includes("ZNP")?"commercial_zone_pro":o.includes("ZNB")?"commercial_zone_basic":"commercial_zone"}function pe(e=""){const t=String(e).toUpperCase();return t.includes("FRM")||t.includes("MST")?"farm_master":"zone_A"}function W(e){if(typeof e=="string")try{const o=JSON.parse(e);return W(o)}catch{return e.trim().toUpperCase()}const t=(e==null?void 0:e.serial)||(e==null?void 0:e.deviceSerial)||(e==null?void 0:e.qrSerial)||(e==null?void 0:e.id);if(!t)throw new Error("QR does not contain a SeedDown serial");return String(t).trim().toUpperCase()}function me(e){return new Promise((t,o)=>{const n=new FileReader;n.onerror=()=>o(new Error("Could not read QR image")),n.onload=()=>{const r=new Image;r.onerror=()=>o(new Error("Could not load QR image")),r.onload=()=>{const i=document.createElement("canvas");i.width=r.naturalWidth||r.width,i.height=r.naturalHeight||r.height;const a=i.getContext("2d",{willReadFrequently:!0});a.drawImage(r,0,0,i.width,i.height);const s=a.getImageData(0,0,i.width,i.height),c=Y(s.data,s.width,s.height);c!=null&&c.data?t(c.data):o(new Error("No QR code found in image"))},r.src=n.result},n.readAsDataURL(e)})}function ue(e,t,o=[],n=(t==null?void 0:t.targetId)||(t==null?void 0:t.zoneId)){const r=h(n),i=new Set(o.map(s=>s.deviceId)),a={...t,targetId:n,role:n==="farm_master"?"farm_master":t.role||"zone_node",active:!0,status:"assigned",assignedAt:new Date().toISOString()};return[...e.map(s=>{const c=h(s.targetId||s.zoneId||s.zone)===r;return s.deviceId===t.deviceId?null:i.has(s.deviceId)||c?{...s,active:!1,status:"replaced",replacedBy:t.deviceId,replacedAt:new Date().toISOString()}:s}).filter(Boolean),a]}function ge(e){const t=V(),o=t.findIndex(n=>n.id===e.id);o>=0?t[o]={...t[o],...e}:t.push(e),localStorage.setItem("user_farms",JSON.stringify(t))}function q(e,t){return B(e,t).map(o=>fe(o)).join("")}function fe(e){var i;const t=T[e.id],o=we(t,((i=f())==null?void 0:i.thresholds)||{}),n=e.deviceId?e.deviceId.replace(/^dev_/,""):"unassigned",r=t?`${R(t.temperature,"°C")} · ${R(t.humidity,"%")} · pH ${t.ph!=null?Number(t.ph).toFixed(1):"--"}`:"waiting for first reading";return`
        <button class="commercial-zone-card ${o.level}" data-zone="${e.id}" type="button">
            <div class="zone-card-head">
                <span>${u(e.label)}</span>
                <b>${o.label}</b>
            </div>
            <strong>${u(e.crop)}</strong>
            <div class="zone-card-meta">${e.planted}/${e.capacity} slots · ${u(n)}</div>
            <div class="zone-meter"><i style="width:${e.occupied}%"></i></div>
            <small>${u(r)}</small>
            <div style="margin-top:8px;font-size:10px;font-weight:900;color:#047857;">→ Tap to drill into zone</div>
        </button>
    `}function U(){const e=document.querySelector(".zone-overview-grid");e&&(e.innerHTML=q(f(),$(f())),be())}function be(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.addEventListener("click",()=>{clearInterval(p.proInterval),x("zone-detail",{zoneId:e.getAttribute("data-zone"),from:"dash-c"})})})}function G(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-zone")===b)}),E("liveSensorTitle",`Live Sensors · ${ye(b)}`)}function B(e,t){const o=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=A(e),r=Math.max(1,Math.ceil(((t==null?void 0:t.total)||9)/n.length)),i=Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[];return n.map((a,s)=>{const c=o.filter((d,C)=>{const _=h(d.zoneId||d.zone||d.area);return _?_===a.id:C%n.length===s}),l=i.find(d=>d.status!=="replaced"&&d.active!==!1&&h(d.targetId||d.zoneId||d.zone)===a.id),m=xe(c)||a.crop,g=c.reduce((d,C)=>d+(Number.parseInt(C.slots||C.count||1,10)||1),0);return{...a,crop:m,planted:g,capacity:r,occupied:Math.min(100,Math.round(g/r*100)),deviceId:(l==null?void 0:l.deviceId)||((e==null?void 0:e.zoneId)===a.id?e.deviceId:null)}})}function A(e){var o;const t=Array.isArray((o=e==null?void 0:e.commercialStructure)==null?void 0:o.zones)?e.commercialStructure.zones:Array.isArray(e==null?void 0:e.zones)?e.zones:[];return t.length?t.map((n,r)=>({id:h(n.zone_id||n.id||`zone_${String.fromCharCode(65+r)}`),label:n.name||`Zone ${String.fromCharCode(65+r)}`,crop:n.crop||(Array.isArray(n.plants)?n.plants.join(", "):"")||"Mixed Crops"})):X}function xe(e){var o;if(!e.length)return"";const t=e.reduce((n,r)=>{const i=r.name||r.species||"Mixed Crops";return n[i]=(n[i]||0)+1,n},{});return((o=Object.entries(t).sort((n,r)=>r[1]-n[1])[0])==null?void 0:o[0])||""}function he(e,t){return t?(Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[]).find(n=>n.status!=="replaced"&&n.active!==!1&&h(n.targetId||n.zoneId||n.zone)===t)||(h(e==null?void 0:e.zoneId)===t?e:null):null}function h(e){const t=String(e||"").trim().toLowerCase();if(!t)return"";const o=t.match(/^([a-z])$/),n=t.match(/^zone[_ ]([a-z])$/),r=(o==null?void 0:o[1])||(n==null?void 0:n[1]);return r?`zone_${r.toUpperCase()}`:t.startsWith("zone_")?`zone_${t.slice(5).toUpperCase()}`:t}function ve(e){var o;const t=((o=A(e)[0])==null?void 0:o.id)||"zone_A";return h(p.currentZoneId||(e==null?void 0:e.zoneId))||t}function ye(e){var t;return((t=A(f()).find(o=>o.id===e))==null?void 0:t.label)||"Farm"}function we(e,t={}){if(!e)return{level:"idle",label:"No Data"};const o=Number(t.gasDangerThreshold??3e3),n=Number(t.tempMin??18),r=Number(t.tempMax??35),i=Number(t.phMin??5.5),a=Number(t.phMax??6.8),s=Number(t.darkThreshold??1500),c=Number(t.waterLowCm??20);return Number(e.gasRaw)>o||Number(e.temperature)>r+3?{level:"critical",label:"Critical"}:Number(e.temperature)<n||Number(e.temperature)>r||Number(e.ph)<i||Number(e.ph)>a||Number(e.lightRaw)<s||Number(e.waterDistanceCm)>c?{level:"warning",label:"Warning"}:{level:"healthy",label:"Healthy"}}function R(e,t=""){const o=Number(e);return Number.isFinite(o)?`${o.toFixed(o%1?1:0)}${t}`:`--${t}`}function z(e,t,o){return'<button class="com-feat ops-tool-btn" data-feature="'+e+'" type="button"><span>'+t+"</span><strong>"+o+"</strong></button>"}function S(e,t){return`
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:11px 12px;">
            <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">${u(e)}</div>
            <strong style="display:block;margin-top:4px;color:#047857;font-size:16px;">${u(t)}</strong>
        </div>
    `}function Ie(e){const t=(e==null?void 0:e.crop)||"Mixed crops";return`
        <div style="position:absolute;inset:0;display:grid;place-items:center;padding:28px;">
            <div style="width:min(420px,92%);aspect-ratio:4/3;border-radius:22px;background:linear-gradient(180deg,#ecfdf5,#dbeafe);border:1px solid rgba(22,101,52,.16);box-shadow:inset 0 0 0 8px rgba(255,255,255,.38);display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:24px;">
                ${Array.from({length:12},(o,n)=>`
                    <div style="border-radius:999px;background:${n%3===0?"#22c55e":n%3===1?"#16a34a":"#84cc16"};box-shadow:0 12px 24px rgba(22,101,52,.18);"></div>
                `).join("")}
            </div>
            <div style="position:absolute;bottom:22px;left:22px;right:22px;text-align:center;color:#166534;font-size:13px;font-weight:900;">Simulated live field frame · ${u(t)}</div>
        </div>
    `}function f(){const e=V();return p.currentFarm||e.find(t=>t.id===p.currentFarmId)||e[e.length-1]||null}function $(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?v["2-tier"]:t.includes("4")?v["4-tier"]:t.includes("5")?v["5-tier"]:t.includes("wall")||t.includes("grid")?v.wall:t.includes("frame")?v["a-frame"]:t.includes("nft")||t.includes("channel")?v["nft-channel"]:t.includes("hanging")||t.includes("column")?v.hanging:v["3-tier"]}function J(e){return Array.isArray(e==null?void 0:e.plants)?e.plants.reduce((t,o)=>t+(Number.parseInt(o.slots||o.count||1,10)||1),0):Number.parseInt(e==null?void 0:e.plants,10)||Number.parseInt(e==null?void 0:e.plantSlots,10)||0}function V(){try{return JSON.parse(localStorage.getItem("user_farms"))||[]}catch{return[]}}function E(e,t){const o=document.getElementById(e);o&&(o.innerText=t)}function u(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function ze(e){return u(e)}function ke(){if(document.getElementById("commercial-command-style"))return;const e=document.createElement("style");e.id="commercial-command-style",e.textContent=`
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
    `,document.head.appendChild(e)}export{Be as render};
