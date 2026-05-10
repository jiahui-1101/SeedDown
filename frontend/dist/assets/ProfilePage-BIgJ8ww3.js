import{A as a,a as u,s as y}from"./index-BV0a85ms.js";import{a as z,s as B,b as _}from"./firebase-CFo32-pk.js";import"https://esm.sh/three@0.160.0";const M="farm_profile",k="user_farms",A=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function D(t){return`farm_profile_${t}`}function w(t){try{if(t){const r=localStorage.getItem(D(t));if(r)return JSON.parse(r)}const e=localStorage.getItem(M);return e?JSON.parse(e):null}catch{return null}}function E(t,e){try{e&&localStorage.setItem(D(e),JSON.stringify(t)),localStorage.setItem(M,JSON.stringify({name:t.name,email:t.email}))}catch{}}function I(){return{name:"UTM Farmer",email:"farmer@seeddown.com",farmName:a.farmName||"Farm 1 - Rack Alpha",deviceId:"farm_001",sensorIntervalMinutes:60,soilDryThreshold:1800,phMin:5.5,phMax:6.5,lightThreshold:1500,wateringDuration:10,notifications:!0,autoWater:!0,ecoMode:!1}}function K(){const t=document.getElementById("screenContainer");let e=N();!a.currentFarmId&&e.length>0&&(a.currentFarmId=e[0].id,a.currentFarm=e[0],a.farmName=e[0].name);const r={...I(),...w(a.currentFarmId)||{}},o=a.mode==="commercial";t.innerHTML=`
        <div class="screen active" id="profileScreen">
            <div class="topbar">
                <button id="profileBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;">←</button>
                <div style="font-weight:700;">${o?"Commercial Controls":"Profile"}</div>
                <div style="flex:1;"></div>
                <button id="profileSaveBtn" style="background:var(--accent);color:white;border:none;padding:6px 14px;border-radius:10px;font-size:0.75rem;font-weight:700;cursor:pointer;">Save</button>
            </div>

            <div class="bottom-nav">
                <div class="nav-item" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item active" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>

            <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px;">
                ${W(e)}
                ${O(r,o)}
                ${o?V(r):""}
                ${j(r,o)}
                ${o?J(r):""}

                <button id="profileSyncBtn" style="width:100%;padding:14px;border:none;border-radius:var(--radius);background:var(--accent-l);color:var(--accent);flex-shrink:0;font-weight:700;font-size:0.9rem;cursor:pointer;transition:var(--transition);display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span id="syncBtnIcon">☁️</span> ${o?"Sync Controls to Device":"Sync Interval to Device"}
                </button>

                <div style="background:rgba(220,38,38,0.04);border:1px solid rgba(220,38,38,0.15);border-radius:var(--radius);padding:18px;flex-shrink:0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--danger);letter-spacing:0.08em;margin-bottom:14px;">⚠️ DANGER ZONE</div>
                    <button id="profileLogoutBtn" style="width:100%;padding:12px;border:1px solid var(--danger);background:transparent;color:var(--danger);border-radius:var(--radius-sm);font-weight:700;font-size:0.85rem;cursor:pointer;">🚪 Log Out</button>
                </div>

                <div style="height:8px;flex-shrink:0;"></div>
            </div>
        </div>
    `,P(e,o),a.profileFocus==="controls"&&(a.profileFocus=null,setTimeout(()=>{var i;return(i=document.getElementById("sensorSettingsCard"))==null?void 0:i.scrollIntoView({block:"start",behavior:"smooth"})},120))}function P(t,e){const r=document.getElementById("farmSelector");r&&r.addEventListener("change",n=>{const l=n.target.value,c=t.find(F=>F.id===l);if(!c)return;a.currentFarmId=l,a.currentFarm=c,a.farmName=c.name;const s={...I(),...w(l)||{},farmName:c.name};p("profileFarmName",s.farmName),p("profileDeviceId",s.deviceId),p("profileInterval",s.sensorIntervalMinutes),v("intervalVal",`${s.sensorIntervalMinutes} min`),p("profileSoil",s.soilDryThreshold),v("soilVal",s.soilDryThreshold),p("profilePhMin",s.phMin),p("profilePhMax",s.phMax),p("profileLight",s.lightThreshold),v("lightVal",s.lightThreshold),p("profileWaterDur",s.wateringDuration),v("waterDurVal",`${s.wateringDuration}s`),h("toggleAutoWater",s.autoWater),h("toggleNotifications",s.notifications),h("toggleEcoMode",s.ecoMode),u("info",`Switched to ${c.name}`)}),m("profileBackBtn","click",()=>y(a.profileFrom||"home")),document.querySelectorAll(".bottom-nav .nav-item").forEach(n=>{n.addEventListener("click",()=>{n.dataset.screen==="farmlist"&&y(a.profileFrom||"home")})});const o=["🧑‍🌾","👩‍🌾","🌱","🤖","🧪","🌿","🏭","👨‍💻"];let i=0;m("profileAvatar","click",()=>{i=(i+1)%o.length,document.getElementById("profileAvatar").textContent=o[i]}),g("profileInterval","intervalVal",n=>`${n} min`),g("profileSoil","soilVal",n=>n),g("profileLight","lightVal",n=>n),g("profileWaterDur","waterDurVal",n=>`${n}s`),document.querySelectorAll(".auto-toggle").forEach(n=>{n.addEventListener("change",()=>h(n.id,n.checked))}),m("profileSaveBtn","click",()=>L(e)),m("profileSyncBtn","click",()=>C(e)),m("profileLogoutBtn","click",()=>{u("info","👋 Logged out. See you next harvest!"),setTimeout(()=>y("login"),800)})}function L(t){var i,n;const e=T(t),r=a.currentFarmId,o=a.uid;E(e,r),a.farmName=e.farmName,(n=(i=a).notify)==null||n.call(i);try{let l=N();r&&(l=l.map(c=>c.id===r?{...c,name:e.farmName}:c),localStorage.setItem(k,JSON.stringify(l)),o&&(z(o,r,e),B(o,l),_(o,{name:e.name,email:e.email})))}catch(l){console.error("Error updating farm list names:",l)}u("success",t?"✅ Commercial controls saved!":"✅ Interval saved!"),setTimeout(()=>y(a.profileFrom||"home"),400)}async function C(t){const e=T(t);E(e,a.currentFarmId);const r=document.getElementById("syncBtnIcon"),o=document.getElementById("profileSyncBtn");o.disabled=!0,r.textContent="⏳";const i=t?{deviceId:e.deviceId||"farm_001",sensorIntervalSeconds:e.sensorIntervalMinutes*60,soilDryThreshold:e.soilDryThreshold,phMin:e.phMin,phMax:e.phMax,darkThreshold:e.lightThreshold,wateringDurationSeconds:e.wateringDuration,autoWater:e.autoWater,notifications:e.notifications,ecoMode:e.ecoMode}:{deviceId:e.deviceId||"farm_001",sensorIntervalSeconds:e.sensorIntervalMinutes*60};try{const n=await fetch(`${A}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!n.ok)throw new Error(`HTTP ${n.status}`);r.textContent="✅",u("success",t?"☁️ Controls synced to device!":"☁️ Interval synced to device!")}catch(n){r.textContent="⚠️",u("error",`Sync failed: ${n.message}. Saved locally.`),console.warn("[ProfilePage] Sync error:",n)}finally{setTimeout(()=>{r.textContent="☁️",o.disabled=!1},2e3)}}function T(t){var o,i,n;const e={...I(),...w(a.currentFarmId)||{}},r={...e,name:d("profileName")||e.name,email:d("profileEmail")||e.email,farmName:d("profileFarmName")||a.farmName||e.farmName,deviceId:d("profileDeviceId")||e.deviceId||"farm_001",sensorIntervalMinutes:parseInt(d("profileInterval"),10)||e.sensorIntervalMinutes||60};return t?{...r,soilDryThreshold:parseInt(d("profileSoil"),10)||e.soilDryThreshold||1800,phMin:parseFloat(d("profilePhMin"))||e.phMin||5.5,phMax:parseFloat(d("profilePhMax"))||e.phMax||6.5,lightThreshold:parseInt(d("profileLight"),10)||e.lightThreshold||1500,wateringDuration:parseInt(d("profileWaterDur"),10)||e.wateringDuration||10,autoWater:((o=document.getElementById("toggleAutoWater"))==null?void 0:o.checked)??e.autoWater??!0,notifications:((i=document.getElementById("toggleNotifications"))==null?void 0:i.checked)??e.notifications??!0,ecoMode:((n=document.getElementById("toggleEcoMode"))==null?void 0:n.checked)??e.ecoMode??!1}:r}function W(t){return`
        <div style="background:var(--accent-l);border:1px solid var(--accent);border-radius:var(--radius);padding:14px;flex-shrink:0;">
            <label style="font-size:0.65rem;font-weight:700;color:var(--accent);display:block;margin-bottom:8px;">EDITING FARM</label>
            <select id="farmSelector" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--accent);background:white;color:var(--text);font-weight:600;outline:none;font-family:inherit;">
                ${t.map(e=>`<option value="${f(e.id)}" ${e.id===a.currentFarmId?"selected":""}>${x(e.name)} (${x(e.zone||e.location||"Field")})</option>`).join("")}
                ${t.length===0?"<option disabled>No farms available</option>":""}
            </select>
        </div>`}function O(t,e){return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px 20px;display:flex;align-items:center;gap:16px;box-shadow:var(--shadow-sm);position:relative;overflow:hidden;flex-shrink:0;">
            <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:var(--accent-s);border-radius:50%;"></div>
            <div id="profileAvatar" style="width:64px;height:64px;border-radius:20px;background:var(--accent-l);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0;cursor:pointer;transition:var(--transition);" title="Tap to change avatar">🧑‍🌾</div>
            <div style="flex:1;min-width:0;position:relative;z-index:1;">
                <input id="profileName" value="${f(t.name)}" style="font-size:1.1rem;font-weight:700;color:var(--text);background:transparent;border:none;border-bottom:1px solid var(--border);width:100%;padding:2px 0;outline:none;font-family:inherit;" placeholder="Your name">
                <input id="profileEmail" value="${f(t.email)}" style="font-size:0.78rem;color:var(--sub);background:transparent;border:none;width:100%;padding:2px 0;outline:none;font-family:inherit;margin-top:4px;" placeholder="email@example.com">
                <div style="margin-top:8px;"><span class="status-chip chip-ok">${e?"🏭 Commercial":"🌱 Beginner"} Mode</span></div>
            </div>
        </div>`}function V(t){return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🌿 FARM IDENTITY</div>
            ${S("Farm Name","profileFarmName",t.farmName,"text","e.g. Rack Alpha - Level 3")}
            ${S("Device ID","profileDeviceId",t.deviceId,"text","e.g. farm_001")}
        </div>`}function j(t,e){return`
        <div id="sensorSettingsCard" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">${e?"🎛️ SENSOR THRESHOLDS":"📡 SENSOR INTERVAL"}</div>
            ${R(t)}
            ${e?H(t):""}
        </div>`}function R(t){return`
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <label style="font-size:0.8rem;font-weight:600;color:var(--text);">📡 Sensor Interval</label>
                <span id="intervalVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${t.sensorIntervalMinutes} min</span>
            </div>
            <input type="range" id="profileInterval" min="5" max="120" step="5" value="${t.sensorIntervalMinutes}" style="width:100%;accent-color:var(--accent);">
            <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>5 min</span><span>120 min</span></div>
        </div>`}function H(t){return`
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <label style="font-size:0.8rem;font-weight:600;color:var(--text);">💧 Soil Dry Threshold (raw)</label>
                <span id="soilVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${t.soilDryThreshold}</span>
            </div>
            <input type="range" id="profileSoil" min="500" max="3000" step="100" value="${t.soilDryThreshold}" style="width:100%;accent-color:var(--accent);">
            <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>Dry (500)</span><span>Wet (3000)</span></div>
        </div>
        <div style="margin-bottom:16px;">
            <label style="font-size:0.8rem;font-weight:600;color:var(--text);">🧪 pH Range</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
                <div><div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Min pH</div><input type="number" id="profilePhMin" value="${t.phMin}" min="4.0" max="7.0" step="0.1" style="${$()}"></div>
                <div><div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Max pH</div><input type="number" id="profilePhMax" value="${t.phMax}" min="4.0" max="8.0" step="0.1" style="${$()}"></div>
            </div>
        </div>
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <label style="font-size:0.8rem;font-weight:600;color:var(--text);">☀️ Light Threshold (raw)</label>
                <span id="lightVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${t.lightThreshold}</span>
            </div>
            <input type="range" id="profileLight" min="200" max="3000" step="100" value="${t.lightThreshold}" style="width:100%;accent-color:var(--accent);">
            <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>Dark (200)</span><span>Bright (3000)</span></div>
        </div>
        <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <label style="font-size:0.8rem;font-weight:600;color:var(--text);">🚿 Watering Duration</label>
                <span id="waterDurVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${t.wateringDuration}s</span>
            </div>
            <input type="range" id="profileWaterDur" min="3" max="60" step="1" value="${t.wateringDuration}" style="width:100%;accent-color:var(--accent);">
            <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>3 sec</span><span>60 sec</span></div>
        </div>`}function J(t){return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🤖 AUTOMATION</div>
            ${b("Auto Watering","toggleAutoWater","💧 Automatically trigger pump when soil is dry",t.autoWater)}
            ${b("AI Notifications","toggleNotifications","🔔 Get alerts for anomalies and harvest reminders",t.notifications)}
            ${b("Eco Mode","toggleEcoMode","🌿 Prioritise energy saving over performance",t.ecoMode)}
        </div>`}function S(t,e,r,o="text",i=""){return`
        <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;font-weight:600;color:var(--sub);display:block;margin-bottom:6px;">${t}</label>
            <input type="${o}" id="${e}" value="${f(String(r))}" placeholder="${f(i)}" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);color:var(--text);font-family:inherit;font-size:0.85rem;outline:none;transition:border-color 0.15s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>`}function b(t,e,r,o){return`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
            <div><div style="font-size:0.85rem;font-weight:600;color:var(--text);">${t}</div><div style="font-size:0.7rem;color:var(--muted);margin-top:2px;">${r}</div></div>
            <label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;margin-left:12px;">
                <input type="checkbox" id="${e}" class="auto-toggle" ${o?"checked":""} style="opacity:0;width:0;height:0;">
                <span style="position:absolute;inset:0;background:${o?"var(--accent)":"var(--border)"};border-radius:100px;cursor:pointer;transition:background 0.2s;" id="${e}_track"></span>
                <span style="position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:transform 0.2s;transform:${o?"translateX(20px)":"none"};" id="${e}_thumb"></span>
            </label>
        </div>`}function $(){return"width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--text);outline:none;"}function N(){try{return JSON.parse(localStorage.getItem(k))||[]}catch{return[]}}function p(t,e){const r=document.getElementById(t);r&&(r.value=e)}function v(t,e){const r=document.getElementById(t);r&&(r.textContent=e)}function m(t,e,r){var o;(o=document.getElementById(t))==null||o.addEventListener(e,r)}function d(t){var e;return((e=document.getElementById(t))==null?void 0:e.value)??""}function x(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function f(t){return x(t).replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function g(t,e,r){const o=document.getElementById(t),i=document.getElementById(e);!o||!i||o.addEventListener("input",()=>{i.textContent=r(o.value)})}function h(t,e){const r=document.getElementById(t),o=document.getElementById(`${t}_track`),i=document.getElementById(`${t}_thumb`);!r||!o||!i||(r.checked=e,o.style.background=e?"var(--accent)":"var(--border)",i.style.transform=e?"translateX(20px)":"none")}export{K as render};
