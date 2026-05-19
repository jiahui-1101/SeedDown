import{A as o,a as s,s as v}from"./index-Ds7gPiVF.js";import{saveFarmProfileToFirestore as _,saveFarmsToFirestore as B,saveGlobalProfileToFirestore as T}from"./firebase-BieXTIEc.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const N="farm_profile",I="user_farms",z=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function S(e){return`farm_profile_${e}`}function y(e){try{if(e){const i=localStorage.getItem(S(e));if(i)return JSON.parse(i)}const t=localStorage.getItem(N);return t?JSON.parse(t):null}catch{return null}}function k(e,t){try{t&&localStorage.setItem(S(t),JSON.stringify(e)),localStorage.setItem(N,JSON.stringify({name:e.name,email:e.email}))}catch{}}function x(){return{name:"UTM Farmer",email:"farmer@seeddown.com",farmName:o.farmName||"Farm 1 - Rack Alpha",deviceId:"farm_001",sensorIntervalMinutes:60,soilDryThreshold:1800,phMin:5.5,phMax:6.5,lightThreshold:1500,wateringDuration:10,notifications:!0}}function X(){const e=document.getElementById("screenContainer"),t=E();!o.currentFarmId&&t.length>0&&(o.currentFarmId=t[0].id,o.currentFarm=t[0],o.farmName=t[0].name);const i={...x(),...y(o.currentFarmId)||{}},n=o.mode==="commercial",r="Notification"in window?Notification.permission:"default",a=r==="granted",l=r==="denied",d=l?!1:i.notifications&&a?!0:i.notifications;e.innerHTML=`
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

                ${L(t)}
                ${R(i,n)}
                ${n?j(i):J(i)}
                ${Y(i)}
                ${A(d,l)}

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
    `,P(t)}function A(e,t){return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🔔 NOTIFICATIONS</div>

            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
                <div>
                    <div style="font-size:0.85rem;font-weight:600;color:var(--text);">Farm Alerts</div>
                    <div style="font-size:0.7rem;color:var(--muted);margin-top:2px;">Anomaly alerts, harvest reminders, pH warnings</div>
                    <div style="font-size:0.68rem;color:${t?"#dc2626":e?"#16a34a":"#64748b"};margin-top:4px;font-weight:600;">${t?"⚠️ Blocked by browser — enable in site settings":e?"✅ Active — you will receive farm alerts":"🔕 Off — enable to get anomaly & harvest alerts"}</div>
                </div>
                <label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;margin-left:12px;">
                    <input type="checkbox" id="toggleNotifications" class="auto-toggle"
                        ${e?"checked":""}
                        ${t?"disabled":""}
                        style="opacity:0;width:0;height:0;">
                    <span style="position:absolute;inset:0;background:${e&&!t?"var(--accent)":"var(--border)"};border-radius:100px;cursor:${t?"not-allowed":"pointer"};transition:background 0.2s;opacity:${t?"0.5":"1"};" id="toggleNotifications_track"></span>
                    <span style="position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.2);transition:transform 0.2s;transform:${e&&!t?"translateX(20px)":"none"};" id="toggleNotifications_thumb"></span>
                </label>
            </div>

            ${t?`
                <div style="margin-top:12px;padding:10px;background:#fef2f2;border-radius:8px;font-size:0.75rem;color:#dc2626;line-height:1.4;">
                    🚫 Notifications are blocked for this site. To enable:<br>
                    Click the 🔒 icon in your browser address bar → Site settings → Notifications → Allow
                </div>
            `:""}

            <button id="testNotifBtn" style="
                margin-top:12px;width:100%;padding:9px;border:1px solid var(--border);
                border-radius:10px;background:var(--surface2);color:var(--text);
                font-size:0.78rem;font-weight:600;cursor:pointer;
                ${t?"opacity:0.4;pointer-events:none;":""}
            ">🔔 Send Test Notification</button>
        </div>`}function P(e){const t=document.getElementById("farmSelector");t&&t.addEventListener("change",a=>{const l=a.target.value,d=e.find(F=>F.id===l);if(!d)return;o.currentFarmId=l,o.currentFarm=d,o.farmName=d.name;const p={...x(),...y(l)||{},farmName:d.name};g("profileFarmName",p.farmName),g("profileDeviceId",p.deviceId),g("profileInterval",p.sensorIntervalMinutes),G("intervalVal",`${p.sensorIntervalMinutes} min`),c("toggleNotifications",p.notifications),s("info",`Switched to ${d.name}`)}),m("profileBackBtn","click",()=>v(o.profileFrom||"home")),document.querySelectorAll(".bottom-nav .nav-item").forEach(a=>{a.addEventListener("click",()=>{a.dataset.screen==="farmlist"&&v(o.profileFrom||"home")})});const i=["🧑‍🌾","👩‍🌾","🌱","🤖","🧪","🌿","🏭","👨‍💻"];let n=0;m("profileAvatar","click",()=>{n=(n+1)%i.length,document.getElementById("profileAvatar").textContent=i[n]}),H("profileInterval","intervalVal",a=>`${a} min`);const r=document.getElementById("toggleNotifications");r&&r.addEventListener("change",async()=>{if(r.checked)if("Notification"in window){const a=await Notification.requestPermission();a==="granted"?(c("toggleNotifications",!0),s("success","🔔 Notifications enabled!"),C()):a==="denied"?(c("toggleNotifications",!1),s("error","🚫 Notifications blocked — change in browser settings"),r.disabled=!0,document.getElementById("toggleNotifications_track").style.opacity="0.5",document.getElementById("toggleNotifications_track").style.cursor="not-allowed"):c("toggleNotifications",!1)}else s("error","⚠️ Your browser does not support notifications"),c("toggleNotifications",!1);else c("toggleNotifications",!1),s("info","🔕 Notifications disabled")}),m("testNotifBtn","click",async()=>{if(!("Notification"in window)){s("error","Notifications not supported");return}if(Notification.permission!=="granted"){if(await Notification.requestPermission()!=="granted"){s("error","🚫 Permission denied");return}c("toggleNotifications",!0)}h("🌱 SeedDown Test Alert",`Farm "${o.farmName}" notifications are working!`,"✅"),s("success","🔔 Test notification sent!")}),m("profileSaveBtn","click",M),m("profileSyncBtn","click",D),m("profileLogoutBtn","click",O)}function h(e,t,i="🌿"){if(!(!("Notification"in window)||Notification.permission!=="granted"))try{new Notification(e,{body:t,icon:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">'+i+"</text></svg>",badge:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌿</text></svg>',tag:"seeddown-farm-alert"})}catch(n){console.warn("[ProfilePage] Notification error:",n)}}function C(){setTimeout(()=>{h("🌿 SeedDown Notifications Active",`You'll now receive alerts for ${o.farmName}. Happy farming!`,"🌱")},3e3)}function Z(e,t){h(e,t)}function M(){var n,r;const e=$(),t=o.currentFarmId,i=o.uid;k(e,t),o.farmName=e.farmName,(r=(n=o).notify)==null||r.call(n);try{let a=E();t&&(a=a.map(l=>l.id===t?{...l,name:e.farmName}:l),localStorage.setItem(I,JSON.stringify(a)),i&&(_(i,t,e),B(i,a),T(i,{name:e.name,email:e.email})))}catch(a){console.error("Error updating farm list:",a)}s("success","✅ Profile saved!"),setTimeout(()=>v(o.profileFrom||"home"),400)}async function D(){const e=$();k(e,o.currentFarmId);const t=document.getElementById("syncBtnIcon"),i=document.getElementById("profileSyncBtn");i.disabled=!0,t.textContent="⏳";const n={deviceId:e.deviceId||"farm_001",sensorIntervalSeconds:e.sensorIntervalMinutes*60,notifications:e.notifications};try{const r=await fetch(`${z}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!r.ok)throw new Error(`HTTP ${r.status}`);t.textContent="✅",s("success","☁️ Settings synced to device!")}catch(r){t.textContent="⚠️",s("error",`Sync failed: ${r.message}. Saved locally.`)}finally{setTimeout(()=>{t.textContent="☁️",i.disabled=!1},2e3)}}function O(){if(window._firebaseReady&&typeof firebase<"u")try{firebase.auth().signOut()}catch{}o.uid=null,o.userEmail="",o.userName="",o.isGuest=!1,s("info","👋 Logged out. See you next harvest!"),setTimeout(()=>v("login"),800)}function $(){var t;const e={...x(),...y(o.currentFarmId)||{}};return{...e,name:u("profileName")||e.name,email:u("profileEmail")||e.email,farmName:u("profileFarmName")||o.farmName||e.farmName,deviceId:u("profileDeviceId")||e.deviceId||"farm_001",sensorIntervalMinutes:parseInt(u("profileInterval"),10)||e.sensorIntervalMinutes||60,notifications:((t=document.getElementById("toggleNotifications"))==null?void 0:t.checked)??e.notifications??!0}}function L(e){return`
        <div style="background:var(--accent-l);border:1px solid var(--accent);border-radius:var(--radius);padding:14px;flex-shrink:0;">
            <label style="font-size:0.65rem;font-weight:700;color:var(--accent);display:block;margin-bottom:8px;">EDITING FARM</label>
            <select id="farmSelector" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--accent);background:white;color:var(--text);font-weight:600;outline:none;font-family:inherit;">
                ${e.map(t=>`<option value="${f(t.id)}" ${t.id===o.currentFarmId?"selected":""}>${b(t.name)} (${b(t.zone||t.location||"Field")})</option>`).join("")}
                ${e.length===0?"<option disabled>No farms available</option>":""}
            </select>
        </div>`}function R(e,t){return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px 20px;display:flex;align-items:center;gap:16px;box-shadow:var(--shadow-sm);position:relative;overflow:hidden;flex-shrink:0;">
            <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:var(--accent-s);border-radius:50%;"></div>
            <div id="profileAvatar" style="width:64px;height:64px;border-radius:20px;background:var(--accent-l);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0;cursor:pointer;transition:var(--transition);" title="Tap to change avatar">🧑‍🌾</div>
            <div style="flex:1;min-width:0;position:relative;z-index:1;">
                <input id="profileName" value="${f(e.name)}" style="font-size:1.1rem;font-weight:700;color:var(--text);background:transparent;border:none;border-bottom:1px solid var(--border);width:100%;padding:2px 0;outline:none;font-family:inherit;" placeholder="Your name">
                <input id="profileEmail" value="${f(e.email)}" style="font-size:0.78rem;color:var(--sub);background:transparent;border:none;width:100%;padding:2px 0;outline:none;font-family:inherit;margin-top:4px;" placeholder="email@example.com">
                <div style="margin-top:8px;"><span class="status-chip chip-ok">${t?"🏭 Commercial":"🌱 Beginner"} Mode</span></div>
            </div>
        </div>`}function j(e){return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🌿 FARM IDENTITY</div>
            ${w("Farm Name","profileFarmName",e.farmName,"text","e.g. Rack Alpha - Level 3")}
            ${w("Device ID","profileDeviceId",e.deviceId,"text","e.g. farm_001")}
        </div>`}function J(e){return`
        <input type="hidden" id="profileFarmName" value="${f(e.farmName)}">
        <input type="hidden" id="profileDeviceId"  value="${f(e.deviceId)}">
    `}function Y(e){return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);flex-shrink:0;">
            <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">📡 SENSOR INTERVAL</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <label style="font-size:0.8rem;font-weight:600;color:var(--text);">ESP32 report interval</label>
                <span id="intervalVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${e.sensorIntervalMinutes} min</span>
            </div>
            <input type="range" id="profileInterval" min="5" max="120" step="5" value="${e.sensorIntervalMinutes}" style="width:100%;accent-color:var(--accent);">
            <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>5 min</span><span>120 min</span></div>
        </div>`}function w(e,t,i,n="text",r=""){return`
        <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;font-weight:600;color:var(--sub);display:block;margin-bottom:6px;">${e}</label>
            <input type="${n}" id="${t}" value="${f(String(i))}" placeholder="${f(r)}" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);color:var(--text);font-family:inherit;font-size:0.85rem;outline:none;transition:border-color 0.15s;" onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>`}function E(){try{return JSON.parse(localStorage.getItem(I))||[]}catch{return[]}}function m(e,t,i){var n;(n=document.getElementById(e))==null||n.addEventListener(t,i)}function u(e){var t;return((t=document.getElementById(e))==null?void 0:t.value)??""}function b(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function f(e){return b(e).replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function g(e,t){const i=document.getElementById(e);i&&(i.value=t)}function G(e,t){const i=document.getElementById(e);i&&(i.textContent=t)}function H(e,t,i){const n=document.getElementById(e),r=document.getElementById(t);!n||!r||n.addEventListener("input",()=>{r.textContent=i(n.value)})}function c(e,t){const i=document.getElementById(e),n=document.getElementById(`${e}_track`),r=document.getElementById(`${e}_thumb`);!i||!n||!r||(i.checked=t,n.style.background=t?"var(--accent)":"var(--border)",r.style.transform=t?"translateX(20px)":"none")}export{X as render,Z as sendFarmNotification};
