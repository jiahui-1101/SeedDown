import{A as l,a as m,s as f}from"./index-D2LiWf5T.js";const b="farm_profile",h="user_farms";function w(e){return`farm_profile_${e}`}function I(e){try{if(e){const r=localStorage.getItem(w(e));if(r)return JSON.parse(r)}const t=localStorage.getItem(b);return t?JSON.parse(t):null}catch{return null}}function k(e,t){try{t&&localStorage.setItem(w(t),JSON.stringify(e));const r={name:e.name,email:e.email};localStorage.setItem(b,JSON.stringify(r))}catch{}}function M(){return{name:"UTM Farmer",email:"farmer@seeddown.com",farmName:l.farmName||"Farm 1 — Rack Alpha",deviceId:"farm_001",sensorIntervalMinutes:60,soilDryThreshold:1800,phMin:5.5,phMax:6.5,lightThreshold:1500,wateringDuration:10,notifications:!0,autoWater:!0,ecoMode:!1}}function N(){const e=document.getElementById("screenContainer");let t=[];try{t=JSON.parse(localStorage.getItem(h))||[]}catch{t=[]}!l.currentFarmId&&t.length>0&&(l.currentFarmId=t[0].id,l.farmName=t[0].name);const r={...M(),...I(l.currentFarmId)||{}};e.innerHTML=`
        <div class="screen active" id="profileScreen">

            <div class="topbar">
                <button id="profileBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;">←</button>
                <div style="font-weight:700;">My Profile</div>
                <div style="flex:1;"></div>
                <button id="profileSaveBtn" style="
                    background:var(--accent); color:white; border:none;
                    padding:6px 14px; border-radius:10px;
                    font-size:0.75rem; font-weight:700; cursor:pointer;
                ">Save</button>
            </div>

            <div class="bottom-nav">
                <div class="nav-item" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item active" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>

            <div style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:16px;">

                <div style="background:var(--accent-l); border:1px solid var(--accent); border-radius:var(--radius); padding:14px; flex-shrink: 0;">
                    <label style="font-size:0.65rem; font-weight:700; color:var(--accent); display:block; margin-bottom:8px;">EDITING FARM:</label>
                    <select id="farmSelector" style="
                        width:100%; padding:10px; border-radius:10px; border:1px solid var(--accent);
                        background:white; color:var(--text); font-weight:600; outline:none; font-family:inherit;
                    ">
                        ${t.map(o=>`
                            <option value="${o.id}" ${o.id===l.currentFarmId?"selected":""}>
                                ${o.name} (Zone ${o.zone})
                            </option>
                        `).join("")}
                        ${t.length===0?"<option disabled>No farms available</option>":""}
                    </select>
                </div>

                <div style="
                    background:var(--surface);
                    border:1px solid var(--border);
                    border-radius:var(--radius-lg);
                    padding:24px 20px;
                    display:flex; align-items:center; gap:16px;
                    box-shadow:var(--shadow-sm);
                    position:relative; overflow:hidden;
                    flex-shrink: 0;
                ">
                    <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:var(--accent-s);border-radius:50%;"></div>

                    <div id="profileAvatar" style="
                        width:64px; height:64px; border-radius:20px;
                        background:var(--accent-l); border:2px solid var(--accent);
                        display:flex; align-items:center; justify-content:center;
                        font-size:2rem; flex-shrink:0; cursor:pointer;
                        transition:var(--transition);
                    " title="Tap to change avatar">🧑‍🌾</div>

                    <div style="flex:1; min-width:0; position:relative; z-index:1;">
                        <input id="profileName" value="${y(r.name)}" style="
                            font-size:1.1rem; font-weight:700; color:var(--text);
                            background:transparent; border:none; border-bottom:1px solid var(--border);
                            width:100%; padding:2px 0; outline:none; font-family:inherit;
                        " placeholder="Your name">
                        <input id="profileEmail" value="${y(r.email)}" style="
                            font-size:0.78rem; color:var(--sub);
                            background:transparent; border:none;
                            width:100%; padding:2px 0; outline:none; font-family:inherit; margin-top:4px;
                        " placeholder="email@example.com">
                        <div style="margin-top:8px;">
                            <span class="status-chip chip-ok">
                                ${l.mode==="commercial"?"🏭 Commercial":"🌱 Beginner"} Mode
                            </span>
                        </div>
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm); flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🌿 FARM IDENTITY</div>
                    ${x("Farm Name","profileFarmName",r.farmName,"text","e.g. Rack Alpha — Level 3")}
                    ${x("Device ID","profileDeviceId",r.deviceId,"text","e.g. farm_001")}
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm); flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">⚙️ SENSOR THRESHOLDS</div>

                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <label style="font-size:0.8rem;font-weight:600;color:var(--text);">📡 Sensor Interval</label>
                            <span id="intervalVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${r.sensorIntervalMinutes} min</span>
                        </div>
                        <input type="range" id="profileInterval" min="5" max="120" step="5" value="${r.sensorIntervalMinutes}" style="width:100%;accent-color:var(--accent);">
                        <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>5 min</span><span>120 min</span></div>
                    </div>

                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <label style="font-size:0.8rem;font-weight:600;color:var(--text);">💧 Soil Dry Threshold (raw)</label>
                            <span id="soilVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${r.soilDryThreshold}</span>
                        </div>
                        <input type="range" id="profileSoil" min="500" max="3000" step="100" value="${r.soilDryThreshold}" style="width:100%;accent-color:var(--accent);">
                        <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>Dry (500)</span><span>Wet (3000)</span></div>
                    </div>

                    <div style="margin-bottom:16px;">
                        <label style="font-size:0.8rem;font-weight:600;color:var(--text);">🧪 pH Range</label>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
                            <div>
                                <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Min pH</div>
                                <input type="number" id="profilePhMin" value="${r.phMin}" min="4.0" max="7.0" step="0.1" style="
                                    width:100%;padding:8px 10px;border:1px solid var(--border);
                                    border-radius:var(--radius-sm);background:var(--surface2);
                                    font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--text);outline:none;
                                ">
                            </div>
                            <div>
                                <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Max pH</div>
                                <input type="number" id="profilePhMax" value="${r.phMax}" min="4.0" max="8.0" step="0.1" style="
                                    width:100%;padding:8px 10px;border:1px solid var(--border);
                                    border-radius:var(--radius-sm);background:var(--surface2);
                                    font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--text);outline:none;
                                ">
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <label style="font-size:0.8rem;font-weight:600;color:var(--text);">☀️ Light Threshold (lux)</label>
                            <span id="lightVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${r.lightThreshold}</span>
                        </div>
                        <input type="range" id="profileLight" min="200" max="3000" step="100" value="${r.lightThreshold}" style="width:100%;accent-color:var(--accent);">
                        <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>Dark (200)</span><span>Bright (3000)</span></div>
                    </div>

                    <div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <label style="font-size:0.8rem;font-weight:600;color:var(--text);">🚿 Watering Duration</label>
                            <span id="waterDurVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${r.wateringDuration}s</span>
                        </div>
                        <input type="range" id="profileWaterDur" min="3" max="60" step="1" value="${r.wateringDuration}" style="width:100%;accent-color:var(--accent);">
                        <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>3 sec</span><span>60 sec</span></div>
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm); flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🤖 AUTOMATION</div>

                    ${v("Auto Watering","toggleAutoWater","💧 Automatically trigger pump when soil is dry",r.autoWater)}
                    ${v("AI Notifications","toggleNotifications","🔔 Get alerts for anomalies and harvest reminders",r.notifications)}
                    ${v("Eco Mode","toggleEcoMode","🌿 Prioritise energy saving over performance",r.ecoMode)}
                </div>

                <button id="profileSyncBtn" style="
                    width:100%; padding:14px; border:none; border-radius:var(--radius);
                    background:var(--accent-l); color:var(--accent); flex-shrink: 0;
                    font-weight:700; font-size:0.9rem; cursor:pointer;
                    transition:var(--transition); display:flex; align-items:center; justify-content:center; gap:8px;
                ">
                    <span id="syncBtnIcon">☁️</span> Sync Settings to Device
                </button>

                <div style="background:rgba(220,38,38,0.04);border:1px solid rgba(220,38,38,0.15);border-radius:var(--radius);padding:18px; flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--danger);letter-spacing:0.08em;margin-bottom:14px;">⚠️ DANGER ZONE</div>
                    <button id="profileLogoutBtn" style="
                        width:100%; padding:12px; border:1px solid var(--danger);
                        background:transparent; color:var(--danger);
                        border-radius:var(--radius-sm); font-weight:700; font-size:0.85rem; cursor:pointer;
                    ">🚪 Log Out</button>
                </div>

                <div style="height:8px; flex-shrink:0;"></div>

            </div>
        </div>
    `,S(r,t)}function S(e,t){const r=document.getElementById("farmSelector");r&&r.addEventListener("change",n=>{const d=n.target.value,c=t.find(i=>i.id===d);if(c){l.currentFarmId=d,l.farmName=c.name;const i={...M(),...I(d)||{},farmName:c.name};document.getElementById("profileFarmName").value=i.farmName,document.getElementById("profileDeviceId").value=i.deviceId,document.getElementById("profileInterval").value=i.sensorIntervalMinutes,document.getElementById("intervalVal").textContent=`${i.sensorIntervalMinutes} min`,document.getElementById("profileSoil").value=i.soilDryThreshold,document.getElementById("soilVal").textContent=i.soilDryThreshold,document.getElementById("profilePhMin").value=i.phMin,document.getElementById("profilePhMax").value=i.phMax,document.getElementById("profileLight").value=i.lightThreshold,document.getElementById("lightVal").textContent=i.lightThreshold,document.getElementById("profileWaterDur").value=i.wateringDuration,document.getElementById("waterDurVal").textContent=`${i.wateringDuration}s`,g("toggleAutoWater",i.autoWater),g("toggleNotifications",i.notifications),g("toggleEcoMode",i.ecoMode),m("info",`Switched to ${c.name}`)}}),p("profileBackBtn","click",()=>{f("farmlist")}),document.querySelectorAll(".bottom-nav .nav-item").forEach(n=>{n.addEventListener("click",()=>{n.getAttribute("data-screen")==="farmlist"&&f("farmlist")})});const o=["🧑‍🌾","👩‍🌾","🌱","🤖","🧪","🌿","🏭","👨‍💻"];let a=0;p("profileAvatar","click",()=>{a=(a+1)%o.length,document.getElementById("profileAvatar").textContent=o[a]}),u("profileInterval","intervalVal",n=>`${n} min`),u("profileSoil","soilVal",n=>n),u("profileLight","lightVal",n=>n),u("profileWaterDur","waterDurVal",n=>`${n}s`),document.querySelectorAll(".auto-toggle").forEach(n=>{const d=document.getElementById(`${n.id}_track`),c=document.getElementById(`${n.id}_thumb`);n.addEventListener("change",()=>{d.style.background=n.checked?"var(--accent)":"var(--border)",c.style.transform=n.checked?"translateX(20px)":"none"})}),p("profileSaveBtn","click",()=>$()),p("profileSyncBtn","click",()=>B()),p("profileLogoutBtn","click",()=>{m("info","👋 Logged out. See you next harvest!"),setTimeout(()=>f("login"),800)})}function $(){var r,o;const e=E(),t=l.currentFarmId;k(e,t),l.farmName=e.farmName,(o=(r=l).notify)==null||o.call(r);try{let a=JSON.parse(localStorage.getItem(h))||[];t&&(a=a.map(n=>n.id===t?{...n,name:e.farmName}:n),localStorage.setItem(h,JSON.stringify(a)),console.log(`[ProfilePage] Updated farm ID ${t} with name: ${e.farmName}`))}catch(a){console.error("Error updating farm list names:",a)}m("success","✅ Profile saved!"),setTimeout(()=>{f("farmlist")},400)}async function B(){const e=E();k(e,l.currentFarmId);const t=document.getElementById("syncBtnIcon"),r=document.getElementById("profileSyncBtn");r.disabled=!0,t.textContent="⏳";const o="http://localhost:3000",a={deviceId:e.deviceId||"farm_001",sensorIntervalSeconds:e.sensorIntervalMinutes*60,soilDryThreshold:e.soilDryThreshold,phMin:e.phMin,phMax:e.phMax,darkThreshold:e.lightThreshold,wateringDurationSeconds:e.wateringDuration,autoWater:e.autoWater,notifications:e.notifications,ecoMode:e.ecoMode};try{const n=await fetch(`${o}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!n.ok)throw new Error(`HTTP ${n.status}`);t.textContent="✅",m("success","☁️ Settings synced to device!")}catch(n){t.textContent="⚠️",m("error",`Sync failed: ${n.message}. Settings saved locally.`),console.warn("[ProfilePage] Sync error:",n)}finally{setTimeout(()=>{t.textContent="☁️",r.disabled=!1},2e3)}}function E(){var e,t,r;return{name:s("profileName"),email:s("profileEmail"),farmName:s("profileFarmName"),deviceId:s("profileDeviceId")||"farm_001",sensorIntervalMinutes:parseInt(s("profileInterval"))||60,soilDryThreshold:parseInt(s("profileSoil"))||1800,phMin:parseFloat(s("profilePhMin"))||5.5,phMax:parseFloat(s("profilePhMax"))||6.5,lightThreshold:parseInt(s("profileLight"))||1500,wateringDuration:parseInt(s("profileWaterDur"))||10,autoWater:((e=document.getElementById("toggleAutoWater"))==null?void 0:e.checked)??!0,notifications:((t=document.getElementById("toggleNotifications"))==null?void 0:t.checked)??!0,ecoMode:((r=document.getElementById("toggleEcoMode"))==null?void 0:r.checked)??!1}}function x(e,t,r,o="text",a=""){return`
        <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;font-weight:600;color:var(--sub);display:block;margin-bottom:6px;">${e}</label>
            <input type="${o}" id="${t}" value="${y(String(r))}" placeholder="${a}" style="
                width:100%; padding:10px 12px;
                border:1px solid var(--border); border-radius:var(--radius-sm);
                background:var(--surface2); color:var(--text);
                font-family:inherit; font-size:0.85rem; outline:none;
                transition:border-color 0.15s;
            " onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>
    `}function v(e,t,r,o){return`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
            <div>
                <div style="font-size:0.85rem;font-weight:600;color:var(--text);">${e}</div>
                <div style="font-size:0.7rem;color:var(--muted);margin-top:2px;">${r}</div>
            </div>
            <label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;margin-left:12px;">
                <input type="checkbox" id="${t}" class="auto-toggle" ${o?"checked":""} style="opacity:0;width:0;height:0;">
                <span style="
                    position:absolute;inset:0;
                    background:${o?"var(--accent)":"var(--border)"};border-radius:100px;cursor:pointer;
                    transition:background 0.2s;
                " id="${t}_track"></span>
                <span style="
                    position:absolute;top:3px;left:3px;
                    width:18px;height:18px;border-radius:50%;
                    background:white;box-shadow:0 1px 3px rgba(0,0,0,0.2);
                    transition:transform 0.2s;
                    transform:${o?"translateX(20px)":"none"};
                " id="${t}_thumb"></span>
            </label>
        </div>
    `}function p(e,t,r){var o;(o=document.getElementById(e))==null||o.addEventListener(t,r)}function s(e){var t;return((t=document.getElementById(e))==null?void 0:t.value)??""}function y(e){return String(e).replace(/"/g,"&quot;").replace(/</g,"&lt;")}function u(e,t,r){const o=document.getElementById(e),a=document.getElementById(t);!o||!a||o.addEventListener("input",()=>{a.textContent=r(o.value)})}function g(e,t){const r=document.getElementById(e),o=document.getElementById(`${e}_track`),a=document.getElementById(`${e}_thumb`);!r||!o||!a||(r.checked=t,o.style.background=t?"var(--accent)":"var(--border)",a.style.transform=t?"translateX(20px)":"none")}export{N as render};
