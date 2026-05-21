import{A as p,s as h}from"./index-BtjAULjs.js";import{C as I}from"./CommercialFarmCanvas-B-ZSqVKM.js";import{o as X}from"./AddPlantModal-B-zGZsP2.js";import ee from"https://esm.sh/jsqr@1.4.0";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const k=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,y={"2-tier":{label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}};let z=[],x=null,B={};const te=[{id:"zone_A",label:"Zone A",crop:"Leafy Greens"},{id:"zone_B",label:"Zone B",crop:"Fruit Crops"},{id:"zone_C",label:"Zone C",crop:"Herbs"},{id:"zone_D",label:"Zone D",crop:"Mixed Crops"},{id:"zone_E",label:"Zone E",crop:"Mixed Crops"},{id:"zone_F",label:"Zone F",crop:"Mixed Crops"}],ne={zone_A:"commercial-zone-node-1",zone_B:"commercial-zone-node-2",zone_C:"commercial-zone-node-3",zone_D:"commercial-zone-node-4",zone_E:"commercial-zone-node-5",zone_F:"commercial-zone-node-6"},O="commercial-farm-master-1";function Me(){const e=document.getElementById("screenContainer"),t=f();p.currentFarm=t;const o=T(t),n=V(t,o),i=n.total?Math.min(100,Math.round(n.planted/n.total*100)):0;x||(x=we(t)),e.innerHTML=`
        <div class="screen active commercial-command-screen" id="commercialScreen">
            <canvas id="commercialFarmCanvas" class="commercial-command-canvas"></canvas>

            <div class="commercial-top-shell">
                <button id="comBackBtn" class="commercial-icon-btn" aria-label="Back to farms">←</button>
                <div class="commercial-title-card">
                    <div class="commercial-kicker">Commercial Digital Twin</div>
                    <div class="commercial-title-row">
                        <strong>${u((t==null?void 0:t.name)||p.farmName||"Commercial Farm")}</strong>
                        <span>${i}% occupied</span>
                    </div>
                    <small>${u(n.label)} · ${n.planted}/${n.total} planted</small>
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
                            ${U(t,o)}
                        </div>
                    </section>

                

                    <section class="ops-section">
                        <div class="ops-section-title">Tools</div>
                        <div class="ops-tool-grid">
                            ${C("whatif","🔮","What-If")}
                            ${C("control","🎛️","Control")}
                            ${C("disease","🧫","Disease")}
                            ${C("camera","📷","Camera")}
                            ${C("consumption","⚡","ESG")}
                            ${C("alerts","🚨","Alerts")}
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
    `,Se(),oe(),ie(),P()}function oe(){var e,t,o,n,i,r,c,a;(e=document.getElementById("comBackBtn"))==null||e.addEventListener("click",()=>{clearInterval(p.proInterval),h("farmlist")}),(t=document.getElementById("fabPlant"))==null||t.addEventListener("click",X),(o=document.getElementById("assignDeviceBtn"))==null||o.addEventListener("click",le),(n=document.getElementById("panelToggleBtn"))==null||n.addEventListener("click",F),(i=document.getElementById("panelCloseBtn"))==null||i.addEventListener("click",F),(r=document.getElementById("commercialChatSend"))==null||r.addEventListener("click",N),(c=document.getElementById("commercialChatInput"))==null||c.addEventListener("keydown",s=>{s.key==="Enter"&&N()}),document.querySelectorAll(".fm-drill").forEach(s=>{s.addEventListener("click",()=>{clearInterval(p.proInterval),h("farm-master-detail",{key:s.getAttribute("data-key"),from:"dash-c"})})}),(a=document.getElementById("farmMasterDetailBtn"))==null||a.addEventListener("click",()=>{clearInterval(p.proInterval),h("farm-master-detail",{from:"dash-c"})}),document.querySelectorAll(".com-feat").forEach(s=>{s.addEventListener("click",()=>{const l=s.getAttribute("data-feature");clearInterval(p.proInterval),l==="whatif"?h("whatif-pro"):l==="control"?h("control"):l==="disease"?h("disease"):l==="camera"?(P(),W()):l==="alerts"?h("alert-commercial"):h("feature",{feature:l,from:"dash-c"})})})}function F(){const e=document.getElementById("commercialScreen"),t=document.getElementById("panelToggleBtn"),o=e==null?void 0:e.classList.toggle("panel-hidden");t&&(t.textContent=o?"Show Panel":"Hide Panel"),setTimeout(w,120)}function ie(){setTimeout(()=>{var e,t;I.init("commercialFarmCanvas",f()),re(),w(),(t=(e=I).setCameraFrame)==null||t.call(e,!1),w(),requestAnimationFrame(w),setTimeout(w,120),setTimeout(w,350),window.addEventListener("resize",w)},80)}function L(e,t){e&&Object.entries(t).forEach(([o,n])=>{const i=o.replace(/[A-Z]/g,r=>"-"+r.toLowerCase());e.style.setProperty(i,n,"important")})}function w(){const e=document.getElementById("commercialScreen"),t=document.getElementById("commercialFarmCanvas");if(e&&L(e,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",overflow:"hidden"}),t&&L(t,{position:"fixed",inset:"0",width:"100vw",height:"100vh",minHeight:"100vh",borderRadius:"0",display:"block"}),I.renderer&&I.camera){const o=window.innerWidth||document.documentElement.clientWidth||1280,n=window.innerHeight||document.documentElement.clientHeight||720;I.renderer.setSize(o,n,!1),I.camera.aspect=o/n,I.camera.updateProjectionMatrix()}}function re(){const e=document.getElementById("commercial-command-style");e&&document.head.appendChild(e)}function P(){clearInterval(p.proInterval),p.aiConsulted=!1;const e=async()=>{try{const t=await H(`${k}/api/sensors/latest?deviceId=${O}`,{},4500).catch(()=>null);if(t){const o=await t.json().catch(()=>null),n=o==null?void 0:o.reading;if(n){const i=(l,d,m)=>{const g=document.getElementById(l);g&&(g.innerText=d,g.style.color=m?"#14532d":"#dc2626")},r=n.waterDistanceCm!=null?Number(n.waterDistanceCm):null,c=n.gasRaw!=null?Number(n.gasRaw):null,a=n.co2Ppm!=null?Number(n.co2Ppm):null,s=n.energyKwh!=null?Number(n.energyKwh):null;i("fm-water",r!=null?`${r.toFixed(1)} cm`:"--",r==null||r>=3&&r<=30),i("fm-gas",c!=null?String(Math.round(c)):"--",c==null||c<3e3),i("fm-co2",a!=null?`${a} ppm`:"--",a==null||a<1500),i("fm-energy",s!=null?`${s.toFixed(2)} kWh`:"--",s==null||s>=0)}}if(await se(),!p.aiConsulted){const o=_(f(),T(f()))[0],n=await j((o==null?void 0:o.id)||"zone_A");n!=null&&n.reading&&(ce(n.reading),p.aiConsulted=!0)}}catch(t){console.error("Dashboard Sync Failed:",t),A("ai-overview-text","Live backend offline. Showing saved farm layout.")}};e(),p.proInterval=setInterval(e,8e3)}function ae(e=x){var c;const t=f(),o=v(e),n=[],i=(a,s)=>{if(!s)return;const l=new URLSearchParams;l.set(a,s);const d=l.toString();n.some(m=>m.toString()===d)||n.push(l)},r=ye(t,o);return i("deviceId",r==null?void 0:r.deviceId),i("zoneId",o),i("deviceId",ne[o]),o==="farm_master"&&(i("deviceId",(c=t==null?void 0:t.farmMaster)==null?void 0:c.deviceId),i("deviceId",t==null?void 0:t.deviceId),i("deviceId",O)),i("farmId",t==null?void 0:t.id),i("farmId",t==null?void 0:t.backendFarmId),i("farmId","farm_commercial_demo_001"),i("deviceId","farm_001"),n}async function j(e=x){const t=ae(e);for(const o of t)try{const i=await(await H(`${k}/api/sensors/latest?${o.toString()}`,{},4500)).json();if(i!=null&&i.reading)return{...i,sourceQuery:o.toString()}}catch(n){console.warn("[CommercialPage] sensor query failed:",o.toString(),n.message)}return{reading:null}}async function H(e,t={},o=4500){const n=new AbortController,i=setTimeout(()=>n.abort(),o);try{return await fetch(e,{...t,signal:n.signal})}finally{clearTimeout(i)}}async function se(){const e=f(),t=_(e,T(e)),o=await Promise.all(t.map(async n=>{try{const i=await j(n.id);return[n.id,i.reading||null]}catch{return[n.id,null]}}));B=Object.fromEntries(o),G()}async function ce(e){const t=`Current sensor data: ${JSON.stringify(e)}. Give one concise operations insight about risk, yield, energy, or automation.`;try{const n=await(await fetch(`${k}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,mode:"commercial"})})).json();A("ai-overview-text",n.reply||n.response||"Farm is operating normally.")}catch{A("ai-overview-text","AI Advisor offline. Sensor dashboard still available.")}}async function N(){const e=document.getElementById("commercialChatInput"),t=e==null?void 0:e.value.trim();if(t){e.value="",Z("user",t),Z("ai","Thinking...");try{const o=f(),i=await(await fetch(`${k}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,history:z.filter(r=>r.role!=="ai"||r.text!=="Thinking...").map(r=>({role:r.role==="ai"?"assistant":"user",content:r.text})).slice(-10),mode:"commercial",gardenState:{farm:o,sensors:p.sensors}})})).json();R(i.reply||i.response||"I could not generate a recommendation yet.")}catch{R("AI chat is offline, but sensor monitoring and tools still work.")}}}function Z(e,t){z.push({role:e,text:t}),Q()}function R(e){const t=z[z.length-1];(t==null?void 0:t.role)==="ai"?t.text=e:z.push({role:"ai",text:e}),Q()}function Q(){const e=document.getElementById("commercialChatLog");e&&(e.innerHTML=z.length?z.map(t=>`<div class="chat-bubble ${t.role}">${u(t.text)}</div>`).join(""):'<div class="chat-bubble ai">Ask about yield, disease risk, energy, crop planning, or sensor readings.</div>',e.scrollTop=e.scrollHeight)}function le(){var o,n;const e=document.getElementById("assignDeviceOverlay");e&&e.remove();const t=document.createElement("div");t.id="assignDeviceOverlay",t.style.cssText="position:fixed;inset:0;z-index:80;background:rgba(15,23,42,.38);display:flex;align-items:center;justify-content:center;padding:18px;",t.innerHTML=`
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
    `,document.body.appendChild(t),document.getElementById("assignClose").addEventListener("click",()=>t.remove()),t.addEventListener("click",i=>{i.target===t&&t.remove()}),document.getElementById("assignSubmit").addEventListener("click",de),(o=document.getElementById("assignScanQr"))==null||o.addEventListener("click",()=>{var i;return(i=document.getElementById("assignQrInput"))==null?void 0:i.click()}),(n=document.getElementById("assignQrInput"))==null||n.addEventListener("change",async i=>{var c;const r=(c=i.target.files)==null?void 0:c[0];if(r)try{const a=await ge(r),s=q(a);document.getElementById("assignSerial").value=s,document.getElementById("assignZone").value=ue(s),document.getElementById("assignStatus").style.color="#0f766e",document.getElementById("assignStatus").textContent=`QR scanned: ${s}`}catch(a){document.getElementById("assignStatus").style.color="#dc2626",document.getElementById("assignStatus").textContent=a.message||"Could not read QR code"}finally{i.target.value=""}})}async function de(){var r,c,a,s;const e=(r=document.getElementById("assignSerial"))==null?void 0:r.value.trim(),t=(c=document.getElementById("assignZone"))==null?void 0:c.value,o=(a=document.getElementById("assignWifi"))==null?void 0:a.value.trim(),n=document.getElementById("assignStatus"),i=document.getElementById("assignSubmit");if(e){i.disabled=!0,i.textContent="Assigning...";try{const l=t==="farm_master"?"farm_master":"zone_node",d=await fetch(`${k}/api/devices/reassign`,{method:"POST",headers:pe(),body:JSON.stringify({serial:e,wifi_ssid:o,accountType:me(e,l),farmId:p.currentFarmId||"farm_commercial_001",targetId:t,role:l,zoneId:t})}),m=await d.json();if(!d.ok||!m.ok)throw new Error(m.error||"Device assignment failed");const g=f()||{};g.commercialDevices=fe(g.commercialDevices||[],m.device,m.replacedDevices||[],t),t==="farm_master"?g.farmMaster=m.device:g.zoneId=t,p.currentFarm=g,be(g),x=t,p.currentZoneId=x,requestAnimationFrame(()=>{G(),J()}),n.style.color="#047857",n.textContent=`Active device: ${m.device.deviceId}. Replaced ${((s=m.replacedDevices)==null?void 0:s.length)||0} old device(s).`}catch(l){n.style.color="#dc2626",n.textContent=l.message}finally{i.disabled=!1,i.textContent="Reassign Active Device"}}}function W(){var a,s,l;const e=document.getElementById("zoneCameraOverlay");e&&e.remove();const t=f(),o=$(t),n=o.find(d=>d.id===x)||o[0],i=(t==null?void 0:t.photoPreview)||(t==null?void 0:t.image)||(t==null?void 0:t.thumbnail)||"",r=B[n==null?void 0:n.id]||null,c=document.createElement("div");c.id="zoneCameraOverlay",c.style.cssText="position:fixed;inset:0;z-index:95;background:rgba(15,23,42,.48);display:flex;align-items:center;justify-content:center;padding:18px;",c.innerHTML=`
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
                    <div id="cameraFeed" style="position:relative;min-height:360px;border-radius:20px;overflow:hidden;background:${i?`url(${i}) center/cover`:"linear-gradient(135deg,#dcfce7,#f8fafc)"};border:1px solid #dbe7dc;">
                        ${i?"":Ce(n)}
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
                                ${o.map(d=>`<option value="${ke(d.id)}" ${d.id===(n==null?void 0:n.id)?"selected":""}>${u(d.label)} · ${u(d.crop)}</option>`).join("")}
                            </select>
                        </label>
                        ${E("Temp",(r==null?void 0:r.temperature)!==void 0?`${Number(r.temperature).toFixed(1)}C`:"--")}
                        ${E("Humidity",(r==null?void 0:r.humidity)!==void 0?`${r.humidity}%`:"--")}
                        ${E("Light",(r==null?void 0:r.lightRaw)??"--")}
                        ${E("Plant count",`${(n==null?void 0:n.planted)??K(t)} plants`)}
                        <button id="cameraCaptureBtn" style="margin-top:4px;padding:13px;border:none;border-radius:14px;background:#166534;color:#fff;font-weight:950;cursor:pointer;">Capture latest frame</button>
                        <div id="cameraStatus" style="font-size:12px;color:#64748b;line-height:1.45;">Camera feed uses the latest farm photo / camera snapshot attached to this commercial farm. Each zone camera can be checked before running disease analysis.</div>
                    </div>
                </div>
            </div>
        </div>
    `,document.body.appendChild(c),(a=document.getElementById("cameraClose"))==null||a.addEventListener("click",()=>c.remove()),c.addEventListener("click",d=>{d.target===c&&c.remove()}),(s=document.getElementById("cameraCaptureBtn"))==null||s.addEventListener("click",()=>{document.getElementById("cameraTimestamp").textContent=`Live snapshot · ${new Date().toLocaleTimeString()}`,document.getElementById("cameraStatus").textContent="Latest camera frame captured for review. Use Disease Analysis if this zone looks unhealthy."}),(l=document.getElementById("cameraZoneSelect"))==null||l.addEventListener("change",d=>{x=d.target.value,p.currentZoneId=x,c.remove(),J(),W()})}function pe(){const e=localStorage.getItem("token");return{"Content-Type":"application/json",...e?{Authorization:`Bearer ${e}`}:{}}}function me(e="",t="zone_node"){const o=String(e).toUpperCase();return t==="farm_master"||o.includes("FRM")||o.includes("MST")?"commercial_farm_master":o.includes("FZK")?"commercial_farm_zone":o.includes("ZNP")?"commercial_zone_pro":o.includes("ZNB")?"commercial_zone_basic":"commercial_zone"}function ue(e=""){const t=String(e).toUpperCase();return t.includes("FRM")||t.includes("MST")?"farm_master":"zone_A"}function q(e){if(typeof e=="string")try{const o=JSON.parse(e);return q(o)}catch{return e.trim().toUpperCase()}const t=(e==null?void 0:e.serial)||(e==null?void 0:e.deviceSerial)||(e==null?void 0:e.qrSerial)||(e==null?void 0:e.id);if(!t)throw new Error("QR does not contain a SeedDown serial");return String(t).trim().toUpperCase()}function ge(e){return new Promise((t,o)=>{const n=new FileReader;n.onerror=()=>o(new Error("Could not read QR image")),n.onload=()=>{const i=new Image;i.onerror=()=>o(new Error("Could not load QR image")),i.onload=()=>{const r=document.createElement("canvas");r.width=i.naturalWidth||i.width,r.height=i.naturalHeight||i.height;const c=r.getContext("2d",{willReadFrequently:!0});c.drawImage(i,0,0,r.width,r.height);const a=c.getImageData(0,0,r.width,r.height),s=ee(a.data,a.width,a.height);s!=null&&s.data?t(s.data):o(new Error("No QR code found in image"))},i.src=n.result},n.readAsDataURL(e)})}function fe(e,t,o=[],n=(t==null?void 0:t.targetId)||(t==null?void 0:t.zoneId)){const i=v(n),r=new Set(o.map(a=>a.deviceId)),c={...t,targetId:n,role:n==="farm_master"?"farm_master":t.role||"zone_node",active:!0,status:"assigned",assignedAt:new Date().toISOString()};return[...e.map(a=>{const s=v(a.targetId||a.zoneId||a.zone)===i;return a.deviceId===t.deviceId?null:r.has(a.deviceId)||s?{...a,active:!1,status:"replaced",replacedBy:t.deviceId,replacedAt:new Date().toISOString()}:a}).filter(Boolean),c]}function be(e){const t=Y(),o=t.findIndex(n=>n.id===e.id);o>=0?t[o]={...t[o],...e}:t.push(e),localStorage.setItem("user_farms",JSON.stringify(t))}function U(e,t){return _(e,t).map(o=>xe(o)).join("")}function xe(e){var r;const t=B[e.id],o=ze(t,((r=f())==null?void 0:r.thresholds)||{}),n=e.deviceId?e.deviceId.replace(/^dev_/,""):"unassigned",i=t?`${D(t.temperature,"°C")} · ${D(t.humidity,"%")} · pH ${t.ph!=null?Number(t.ph).toFixed(1):"--"}`:"waiting for first reading";return`
        <button class="commercial-zone-card ${o.level}" data-zone="${e.id}" type="button">
            <div class="zone-card-head">
                <span>${u(e.label)}</span>
                <b>${o.label}</b>
            </div>
            <strong>${u(e.crop)}</strong>
            <div class="zone-card-meta">${e.planted}/${e.capacity} slots · ${u(n)}</div>
            <div class="zone-meter"><i style="width:${e.occupied}%"></i></div>
            <small>${u(i)}</small>
            <div style="margin-top:8px;font-size:10px;font-weight:900;color:#047857;">→ Tap to drill into zone</div>
        </button>
    `}function G(){const e=document.querySelector(".zone-overview-grid");e&&(e.innerHTML=U(f(),T(f())),he())}function he(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.addEventListener("click",()=>{clearInterval(p.proInterval),h("zone-detail",{zoneId:e.getAttribute("data-zone"),from:"dash-c"})})})}function J(){document.querySelectorAll(".commercial-zone-card").forEach(e=>{e.classList.toggle("selected",e.getAttribute("data-zone")===x)}),A("liveSensorTitle",`Live Sensors · ${Ie(x)}`)}function _(e,t){const o=Array.isArray(e==null?void 0:e.plants)?e.plants:[],n=$(e),i=V(e,t),r=Math.max(1,Math.ceil((i.total||(t==null?void 0:t.total)||9)/n.length)),c=Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[];return n.map((a,s)=>{const l=o.filter((b,S)=>{const M=v(b.zoneId||b.zone||b.area);return M?M===a.id:S%n.length===s}),d=c.find(b=>b.status!=="replaced"&&b.active!==!1&&v(b.targetId||b.zoneId||b.zone)===a.id),m=ve(l)||a.crop,g=l.reduce((b,S)=>b+(Number.parseInt(S.slots||S.count||1,10)||1),0);return{...a,crop:m,planted:g,capacity:r,occupied:Math.min(100,Math.round(g/r*100)),deviceId:(d==null?void 0:d.deviceId)||((e==null?void 0:e.zoneId)===a.id?e.deviceId:null)}})}function V(e,t){var s;const o=Array.isArray((s=e==null?void 0:e.commercialStructure)==null?void 0:s.zones)?e.commercialStructure.zones:Array.isArray(e==null?void 0:e.zones)?e.zones:[],n=K(e);if(!o.length){const l=Number.parseInt(e==null?void 0:e.plantSlots,10)||(t==null?void 0:t.total)||n||0;return{label:(t==null?void 0:t.label)||"Commercial Farm",planted:n,total:Math.max(l,n)}}const i=o.length,r=o.reduce((l,d)=>{const m=Number.parseInt(d.capacity??d.slots??d.plantSlots??d.count??0,10);return l+(Number.isFinite(m)&&m>0?m:0)},0),c=Number.parseInt(e==null?void 0:e.plantSlots,10)||Number.parseInt(e==null?void 0:e.capacity,10)||0,a=Math.max(r,c,n,i*12);return{label:`${i}-Zone Commercial Farm`,planted:n,total:a}}function $(e){var o;const t=Array.isArray((o=e==null?void 0:e.commercialStructure)==null?void 0:o.zones)?e.commercialStructure.zones:Array.isArray(e==null?void 0:e.zones)?e.zones:[];return t.length?t.map((n,i)=>({id:v(n.zone_id||n.id||`zone_${String.fromCharCode(65+i)}`),label:n.name||`Zone ${String.fromCharCode(65+i)}`,crop:n.crop||(Array.isArray(n.plants)?n.plants.join(", "):"")||"Mixed Crops"})):te}function ve(e){var o;if(!e.length)return"";const t=e.reduce((n,i)=>{const r=i.name||i.species||"Mixed Crops";return n[r]=(n[r]||0)+1,n},{});return((o=Object.entries(t).sort((n,i)=>i[1]-n[1])[0])==null?void 0:o[0])||""}function ye(e,t){return t?(Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[]).find(n=>n.status!=="replaced"&&n.active!==!1&&v(n.targetId||n.zoneId||n.zone)===t)||(v(e==null?void 0:e.zoneId)===t?e:null):null}function v(e){const t=String(e||"").trim().toLowerCase();if(!t)return"";const o=t.match(/^([a-z])$/),n=t.match(/^zone[_ ]([a-z])$/),i=(o==null?void 0:o[1])||(n==null?void 0:n[1]);return i?`zone_${i.toUpperCase()}`:t.startsWith("zone_")?`zone_${t.slice(5).toUpperCase()}`:t}function we(e){var o;const t=((o=$(e)[0])==null?void 0:o.id)||"zone_A";return v(p.currentZoneId||(e==null?void 0:e.zoneId))||t}function Ie(e){var t;return((t=$(f()).find(o=>o.id===e))==null?void 0:t.label)||"Farm"}function ze(e,t={}){if(!e)return{level:"idle",label:"No Data"};const o=Number(t.gasDangerThreshold??3e3),n=Number(t.tempMin??18),i=Number(t.tempMax??35),r=Number(t.phMin??5.5),c=Number(t.phMax??6.8),a=Number(t.darkThreshold??1500),s=Number(t.waterLowCm??20);return Number(e.gasRaw)>o||Number(e.temperature)>i+3?{level:"critical",label:"Critical"}:Number(e.temperature)<n||Number(e.temperature)>i||Number(e.ph)<r||Number(e.ph)>c||Number(e.lightRaw)<a||Number(e.waterDistanceCm)>s?{level:"warning",label:"Warning"}:{level:"healthy",label:"Healthy"}}function D(e,t=""){const o=Number(e);return Number.isFinite(o)?`${o.toFixed(o%1?1:0)}${t}`:`--${t}`}function C(e,t,o){return'<button class="com-feat ops-tool-btn" data-feature="'+e+'" type="button"><span>'+t+"</span><strong>"+o+"</strong></button>"}function E(e,t){return`
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:11px 12px;">
            <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">${u(e)}</div>
            <strong style="display:block;margin-top:4px;color:#047857;font-size:16px;">${u(t)}</strong>
        </div>
    `}function Ce(e){const t=(e==null?void 0:e.crop)||"Mixed crops";return`
        <div style="position:absolute;inset:0;display:grid;place-items:center;padding:28px;">
            <div style="width:min(420px,92%);aspect-ratio:4/3;border-radius:22px;background:linear-gradient(180deg,#ecfdf5,#dbeafe);border:1px solid rgba(22,101,52,.16);box-shadow:inset 0 0 0 8px rgba(255,255,255,.38);display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:24px;">
                ${Array.from({length:12},(o,n)=>`
                    <div style="border-radius:999px;background:${n%3===0?"#22c55e":n%3===1?"#16a34a":"#84cc16"};box-shadow:0 12px 24px rgba(22,101,52,.18);"></div>
                `).join("")}
            </div>
            <div style="position:absolute;bottom:22px;left:22px;right:22px;text-align:center;color:#166534;font-size:13px;font-weight:900;">Simulated live field frame · ${u(t)}</div>
        </div>
    `}function f(){const e=Y();return p.currentFarm||e.find(t=>t.id===p.currentFarmId)||e[e.length-1]||null}function T(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?y["2-tier"]:t.includes("4")?y["4-tier"]:t.includes("5")?y["5-tier"]:t.includes("wall")||t.includes("grid")?y.wall:t.includes("frame")?y["a-frame"]:t.includes("nft")||t.includes("channel")?y["nft-channel"]:t.includes("hanging")||t.includes("column")?y.hanging:y["3-tier"]}function K(e){return Array.isArray(e==null?void 0:e.plants)?e.plants.reduce((t,o)=>t+(Number.parseInt(o.slots||o.count||1,10)||1),0):Number.parseInt(e==null?void 0:e.plants,10)||Number.parseInt(e==null?void 0:e.plantSlots,10)||0}function Y(){try{return JSON.parse(localStorage.getItem("user_farms"))||[]}catch{return[]}}function A(e,t){const o=document.getElementById(e);o&&(o.innerText=t)}function u(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function ke(e){return u(e)}function Se(){if(document.getElementById("commercial-command-style"))return;const e=document.createElement("style");e.id="commercial-command-style",e.textContent=`
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
    `,document.head.appendChild(e)}export{Me as render};
