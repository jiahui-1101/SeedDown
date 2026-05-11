import{A as a,a as p,s as f}from"./index-CDbG3aFg.js";import{a as F,s as B,b as M}from"./firebase-CFo32-pk.js";import"https://esm.sh/three@0.160.0";const I="farm_profile",w="user_farms",A=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function k(e){return`farm_profile_${e}`}function h(e){try{if(e){const r=localStorage.getItem(k(e));if(r)return JSON.parse(r)}const t=localStorage.getItem(I);return t?JSON.parse(t):null}catch{return null}}function S(e,t){try{t&&localStorage.setItem(k(t),JSON.stringify(e)),localStorage.setItem(I,JSON.stringify({name:e.name,email:e.email}))}catch{}}function y(){return{name:"UTM Farmer",email:"farmer@seeddown.com",farmName:a.farmName||"Farm 1 - Rack Alpha",deviceId:"farm_001",sensorIntervalMinutes:60,soilDryThreshold:1800,phMin:5.5,phMax:6.5,lightThreshold:1500,wateringDuration:10,notifications:!0,autoWater:!0,ecoMode:!1}}function Y(){const e=document.getElementById("screenContainer"),t=E();!a.currentFarmId&&t.length>0&&(a.currentFarmId=t[0].id,a.currentFarm=t[0],a.farmName=t[0].name);const r={...y(),...h(a.currentFarmId)||{}},o=a.mode==="commercial";e.innerHTML=`
        <div class="screen active" id="profileScreen">
            <div class="topbar">
                <button id="profileBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;">←</button>
                <div style="font-weight:700;">Profile</div>
                <div style="flex:1;"></div>
                <button id="profileSaveBtn" style="background:var(--accent);color:white;border:none;padding:6px 14px;border-radius:10px;font-size:0.75rem;font-weight:700;cursor:pointer;">Save</button>
            </div>

            <div class="bottom-nav">
                <div class="nav-item" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item active" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>

            <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:16px;">
                ${P(t)}
                ${C(r,o)}
                ${o?D(r):L(r)}
                ${O(r)}
                ${W(r)}

                <button id="profileSyncBtn" style="width:100%;padding:14px;border:none;border-radius:var(--radius);background:var(--accent-l);color:var(--accent);flex-shrink:0;font-weight:700;font-size:0.9rem;cursor:pointer;transition:var(--transition);display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span id="syncBtnIcon">☁️</span> Sync Profile Settings to Device
                </button>

                <div style="background:rgba(220,38,38,0.04);border:1px solid rgba(220,38,38,0.15);border-radius:var(--radius);padding:18px;flex-shrink:0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--danger);letter-spacing:0.08em;margin-bottom:14px;">⚠️ DANGER ZONE</div>
                    <button id="profileLogoutBtn" style="width:100%;padding:12px;border:1px solid var(--danger);background:transparent;color:var(--danger);border-radius:var(--radius-sm);font-weight:700;font-size:0.85rem;cursor:pointer;">🚪 Log Out</button>
                </div>

                <div style="height:8px;flex-shrink:0;"></div>
            </div>
        </div>
    `,T(t)}function T(e){const t=document.getElementById("farmSelector");t&&t.addEventListener("change",n=>{const i=n.target.value,s=e.find(N=>N.id===i);if(!s)return;a.currentFarmId=i,a.currentFarm=s,a.farmName=s.name;const l={...y(),...h(i)||{},farmName:s.name};g("profileFarmName",l.farmName),g("profileDeviceId",l.deviceId),g("profileInterval",l.sensorIntervalMinutes),R("intervalVal",`${l.sensorIntervalMinutes} min`),u("toggleAutoWater",l.autoWater),u("toggleNotifications",l.notifications),u("toggleEcoMode",l.ecoMode),p("info",`Switched to ${s.name}`)}),c("profileBackBtn","click",()=>f(a.profileFrom||"home")),document.querySelectorAll(".bottom-nav .nav-item").forEach(n=>{n.addEventListener("click",()=>{n.dataset.screen==="farmlist"&&f(a.profileFrom||"home")})});const r=["🧑‍🌾","👩‍🌾","🌱","🤖","🧪","🌿","🏭","👨‍💻"];let o=0;c("profileAvatar","click",()=>{o=(o+1)%r.length,document.getElementById("profileAvatar").textContent=r[o]}),j("profileInterval","intervalVal",n=>`${n} min`),document.querySelectorAll(".auto-toggle").forEach(n=>{n.addEventListener("change",()=>u(n.id,n.checked))}),c("profileSaveBtn","click",_),c("profileSyncBtn","click",z),c("profileLogoutBtn","click",()=>{p("info","👋 Logged out. See you next harvest!"),setTimeout(()=>f("login"),800)})}function _(){var o,n;const e=$(),t=a.currentFarmId,r=a.uid;S(e,t),a.farmName=e.farmName,(n=(o=a).notify)==null||n.call(o);try{let i=E();t&&(i=i.map(s=>s.id===t?{...s,name:e.farmName}:s),localStorage.setItem(w,JSON.stringify(i)),r&&(F(r,t,e),B(r,i),M(r,{name:e.name,email:e.email})))}catch(i){console.error("Error updating farm list names:",i)}p("success","✅ Profile settings saved!"),setTimeout(()=>f(a.profileFrom||"home"),400)}async function z(){const e=$();S(e,a.currentFarmId);const t=document.getElementById("syncBtnIcon"),r=document.getElementById("profileSyncBtn");r.disabled=!0,t.textContent="⏳";const o={deviceId:e.deviceId||"farm_001",sensorIntervalSeconds:e.sensorIntervalMinutes*60,autoWater:e.autoWater,notifications:e.notifications,ecoMode:e.ecoMode};try{const n=await fetch(`${A}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(!n.ok)throw new Error(`HTTP ${n.status}`);t.textContent="✅",p("success","☁️ Profile settings synced to device!")}catch(n){t.textContent="⚠️",p("error",`Sync failed: ${n.message}. Saved locally.`),console.warn("[ProfilePage] Sync error:",n)}finally{setTimeout(()=>{t.textContent="☁️",r.disabled=!1},2e3)}}function $(){var t,r,o;const e={...y(),...h(a.currentFarmId)||{}};return{...e,name:m("profileName")||e.name,email:m("profileEmail")||e.email,farmName:m("profileFarmName")||a.farmName||e.farmName,deviceId:m("profileDeviceId")||e.deviceId||"farm_001",sensorIntervalMinutes:parseInt(m("profileInterval"),10)||e.sensorIntervalMinutes||60,autoWater:((t=document.getElementById("toggleAutoWater"))==null?void 0:t.checked)??e.autoWater??!0,notifications:((r=document.getElementById("toggleNotifications"))==null?void 0:r.checked)??e.notifications??!0,ecoMode:((o=document.getElementById("toggleEcoMode"))==null?void 0:o.checked)??e.ecoMode??!1}}function P(e){return`
        <div style="background:var(--accent-l);border:1px solid var(--accent);border-radius:var(--radius);padding:14px;flex-shrink:0;">
            <label style="font-size:0.65rem;font-weight:700;color:var(--accent);display:block;margin-bottom:8px;">EDITING FARM</label>
            <select id="farmSelector" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--accent);background:white;color:var(--text);font-weight:600;outline:none;font-family:inherit;">
                ${e.map(t=>`<option value="${d(t.id)}" ${t.id===a.currentFarmId?"selected":""}>${b(t.name)} (${b(t.zone||t.location||"Field")})</option>`).join("")}
                ${e.length===0?"<option disabled>No farms available</option>":""}
            </select>
        </div>`}function C(e,t){return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px 20px;display:flex;align-items:center;gap:16px;box-shadow:var(--shadow-sm);position:relative;overflow:hidden;flex-shrink:0;">
            <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:var(--accent-s);border-radius:50%;"></div>
            <div id="profileAvatar" style="width:64px;height:64px;border-radius:20px;background:var(--accent-l);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0;cursor:pointer;transition:var(--transition);" title="Tap to change avatar">🧑‍🌾</div>
            <div style="flex:1;min-width:0;position:relative;z-index:1;">
                <input id="profileName" value="${d(e.name)}" style="font-size:1.1rem;font-weight:700;color:var(--text);background:transparent;border:none;border-bottom:1px solid var(--border);width:100%;padding:2px 0;outline:none;font-family:inherit;" placeholder="Your name">
                <input id="profileEmail" value="${d(e.email)}" style="font-size:0.78rem;color:var(--sub);background:transparent;border:none;width:100%;padding:2px 0;outline:none;font-family:inherit;margin-top:4px;" placeholder="email@example.com">
                <div style="margin-top:8px;"><span class="status-chip chip-ok">${t?"🏭 Commercial":"🌱 Beginner"} Mode</span></div>
            </div>
        </div>`}function D(e){return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🌿 FARM IDENTITY</div>
            ${x("Farm Name","profileFarmName",e.farmName,"text","e.g. Rack Alpha - Level 3")}
            ${x("Device ID","profileDeviceId",e.deviceId,"text","e.g. farm_001")}
        </div>`}function L(e){return`
        <input type="hidden" id="profileFarmName" value="${d(e.farmName)}">
        <input type="hidden" id="profileDeviceId" value="${d(e.deviceId)}">
    `}function O(e){return`
        <div id="profileIntervalCard" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">📡 SENSOR INTERVAL</div>
            <div style="margin-bottom:4px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <label style="font-size:0.8rem;font-weight:600;color:var(--text);">ESP32 report interval</label>
                    <span id="intervalVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${e.sensorIntervalMinutes} min</span>
                </div>
                <input type="range" id="profileInterval" min="5" max="120" step="5" value="${e.sensorIntervalMinutes}" style="width:100%;accent-color:var(--accent);">
                <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>5 min</span><span>120 min</span></div>
            </div>
        </div>`}function W(e){return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🤖 AUTOMATION</div>
            ${v("Auto Watering","toggleAutoWater","Automatically allow pump decisions from IoT thresholds",e.autoWater)}
            ${v("AI Notifications","toggleNotifications","Get alerts for anomalies and harvest reminders",e.notifications)}
            ${v("Eco Mode","toggleEcoMode","Prioritise energy saving over performance",e.ecoMode)}
        </div>`}function x(e,t,r,o="text",n=""){return`
        <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;font-weight:600;color:var(--sub);display:block;margin-bottom:6px;">${e}</label>
            <input type="${o}" id="${t}" value="${d(String(r))}" placeholder="${d(n)}" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);color:var(--text);font-family:inherit;font-size:0.85rem;outline:none;transition:border-color 0.15s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>`}function v(e,t,r,o){return`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
            <div><div style="font-size:0.85rem;font-weight:600;color:var(--text);">${e}</div><div style="font-size:0.7rem;color:var(--muted);margin-top:2px;">${r}</div></div>
            <label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;margin-left:12px;">
                <input type="checkbox" id="${t}" class="auto-toggle" ${o?"checked":""} style="opacity:0;width:0;height:0;">
                <span style="position:absolute;inset:0;background:${o?"var(--accent)":"var(--border)"};border-radius:100px;cursor:pointer;transition:background 0.2s;" id="${t}_track"></span>
                <span style="position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:transform 0.2s;transform:${o?"translateX(20px)":"none"};" id="${t}_thumb"></span>
            </label>
        </div>`}function E(){try{return JSON.parse(localStorage.getItem(w))||[]}catch{return[]}}function g(e,t){const r=document.getElementById(e);r&&(r.value=t)}function R(e,t){const r=document.getElementById(e);r&&(r.textContent=t)}function c(e,t,r){var o;(o=document.getElementById(e))==null||o.addEventListener(t,r)}function m(e){var t;return((t=document.getElementById(e))==null?void 0:t.value)??""}function b(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function d(e){return b(e).replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function j(e,t,r){const o=document.getElementById(e),n=document.getElementById(t);!o||!n||o.addEventListener("input",()=>{n.textContent=r(o.value)})}function u(e,t){const r=document.getElementById(e),o=document.getElementById(`${e}_track`),n=document.getElementById(`${e}_thumb`);!r||!o||!n||(r.checked=t,o.style.background=t?"var(--accent)":"var(--border)",n.style.transform=t?"translateX(20px)":"none")}export{Y as render};
