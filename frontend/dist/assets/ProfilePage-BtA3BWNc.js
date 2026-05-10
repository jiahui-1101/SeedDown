import{A as i,a as m,s as f}from"./index-DEjNUr0y.js";import{a as S,s as $,b as B}from"./firebase-CFo32-pk.js";import"https://esm.sh/three@0.160.0";const b="farm_profile",h="user_farms";function w(e){return`farm_profile_${e}`}function I(e){try{if(e){const t=localStorage.getItem(w(e));if(t)return JSON.parse(t)}const r=localStorage.getItem(b);return r?JSON.parse(r):null}catch{return null}}function k(e,r){try{r&&localStorage.setItem(w(r),JSON.stringify(e));const t={name:e.name,email:e.email};localStorage.setItem(b,JSON.stringify(t))}catch{}}function M(){return{name:"UTM Farmer",email:"farmer@seeddown.com",farmName:i.farmName||"Farm 1 — Rack Alpha",deviceId:"farm_001",sensorIntervalMinutes:60,soilDryThreshold:1800,phMin:5.5,phMax:6.5,lightThreshold:1500,wateringDuration:10,notifications:!0,autoWater:!0,ecoMode:!1}}function A(){const e=document.getElementById("screenContainer");let r=[];try{r=JSON.parse(localStorage.getItem(h))||[]}catch{r=[]}!i.currentFarmId&&r.length>0&&(i.currentFarmId=r[0].id,i.farmName=r[0].name);const t={...M(),...I(i.currentFarmId)||{}};e.innerHTML=`
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
                        ${r.map(n=>`
                            <option value="${n.id}" ${n.id===i.currentFarmId?"selected":""}>
                                ${n.name} (Zone ${n.zone})
                            </option>
                        `).join("")}
                        ${r.length===0?"<option disabled>No farms available</option>":""}
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
                        <input id="profileName" value="${y(t.name)}" style="
                            font-size:1.1rem; font-weight:700; color:var(--text);
                            background:transparent; border:none; border-bottom:1px solid var(--border);
                            width:100%; padding:2px 0; outline:none; font-family:inherit;
                        " placeholder="Your name">
                        <input id="profileEmail" value="${y(t.email)}" style="
                            font-size:0.78rem; color:var(--sub);
                            background:transparent; border:none;
                            width:100%; padding:2px 0; outline:none; font-family:inherit; margin-top:4px;
                        " placeholder="email@example.com">
                        <div style="margin-top:8px;">
                            <span class="status-chip chip-ok">
                                ${i.mode==="commercial"?"🏭 Commercial":"🌱 Beginner"} Mode
                            </span>
                        </div>
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm); flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🌿 FARM IDENTITY</div>
                    ${x("Farm Name","profileFarmName",t.farmName,"text","e.g. Rack Alpha — Level 3")}
                    ${x("Device ID","profileDeviceId",t.deviceId,"text","e.g. farm_001")}
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm); flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">⚙️ SENSOR THRESHOLDS</div>

                    <div style="margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <label style="font-size:0.8rem;font-weight:600;color:var(--text);">📡 Sensor Interval</label>
                            <span id="intervalVal" style="font-size:0.8rem;font-weight:700;color:var(--accent);font-family:'DM Mono',monospace;">${t.sensorIntervalMinutes} min</span>
                        </div>
                        <input type="range" id="profileInterval" min="5" max="120" step="5" value="${t.sensorIntervalMinutes}" style="width:100%;accent-color:var(--accent);">
                        <div style="display:flex;justify-content:space-between;font-size:0.65rem;color:var(--muted);margin-top:2px;"><span>5 min</span><span>120 min</span></div>
                    </div>

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
                            <div>
                                <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Min pH</div>
                                <input type="number" id="profilePhMin" value="${t.phMin}" min="4.0" max="7.0" step="0.1" style="
                                    width:100%;padding:8px 10px;border:1px solid var(--border);
                                    border-radius:var(--radius-sm);background:var(--surface2);
                                    font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--text);outline:none;
                                ">
                            </div>
                            <div>
                                <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Max pH</div>
                                <input type="number" id="profilePhMax" value="${t.phMax}" min="4.0" max="8.0" step="0.1" style="
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
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm); flex-shrink: 0;">
                    <div style="font-size:0.6rem;font-weight:700;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">🤖 AUTOMATION</div>

                    ${v("Auto Watering","toggleAutoWater","💧 Automatically trigger pump when soil is dry",t.autoWater)}
                    ${v("AI Notifications","toggleNotifications","🔔 Get alerts for anomalies and harvest reminders",t.notifications)}
                    ${v("Eco Mode","toggleEcoMode","🌿 Prioritise energy saving over performance",t.ecoMode)}
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
    `,D(t,r)}function D(e,r){const t=document.getElementById("farmSelector");t&&t.addEventListener("change",o=>{const s=o.target.value,c=r.find(a=>a.id===s);if(c){i.currentFarmId=s,i.farmName=c.name;const a={...M(),...I(s)||{},farmName:c.name};document.getElementById("profileFarmName").value=a.farmName,document.getElementById("profileDeviceId").value=a.deviceId,document.getElementById("profileInterval").value=a.sensorIntervalMinutes,document.getElementById("intervalVal").textContent=`${a.sensorIntervalMinutes} min`,document.getElementById("profileSoil").value=a.soilDryThreshold,document.getElementById("soilVal").textContent=a.soilDryThreshold,document.getElementById("profilePhMin").value=a.phMin,document.getElementById("profilePhMax").value=a.phMax,document.getElementById("profileLight").value=a.lightThreshold,document.getElementById("lightVal").textContent=a.lightThreshold,document.getElementById("profileWaterDur").value=a.wateringDuration,document.getElementById("waterDurVal").textContent=`${a.wateringDuration}s`,g("toggleAutoWater",a.autoWater),g("toggleNotifications",a.notifications),g("toggleEcoMode",a.ecoMode),m("info",`Switched to ${c.name}`)}}),p("profileBackBtn","click",()=>{f(i.profileFrom||"home")}),document.querySelectorAll(".bottom-nav .nav-item").forEach(o=>{o.addEventListener("click",()=>{o.getAttribute("data-screen")==="farmlist"&&f(i.profileFrom||"home")})});const n=["🧑‍🌾","👩‍🌾","🌱","🤖","🧪","🌿","🏭","👨‍💻"];let l=0;p("profileAvatar","click",()=>{l=(l+1)%n.length,document.getElementById("profileAvatar").textContent=n[l]}),u("profileInterval","intervalVal",o=>`${o} min`),u("profileSoil","soilVal",o=>o),u("profileLight","lightVal",o=>o),u("profileWaterDur","waterDurVal",o=>`${o}s`),document.querySelectorAll(".auto-toggle").forEach(o=>{const s=document.getElementById(`${o.id}_track`),c=document.getElementById(`${o.id}_thumb`);o.addEventListener("change",()=>{s.style.background=o.checked?"var(--accent)":"var(--border)",c.style.transform=o.checked?"translateX(20px)":"none"})}),p("profileSaveBtn","click",()=>T()),p("profileSyncBtn","click",()=>N()),p("profileLogoutBtn","click",()=>{m("info","👋 Logged out. See you next harvest!"),setTimeout(()=>f("login"),800)})}function T(){var n,l;const e=E(),r=i.currentFarmId,t=i.uid;k(e,r),i.farmName=e.farmName,(l=(n=i).notify)==null||l.call(n);try{let o=JSON.parse(localStorage.getItem(h))||[];r&&(o=o.map(s=>s.id===r?{...s,name:e.farmName}:s),localStorage.setItem(h,JSON.stringify(o)),t&&(S(t,r,e),$(t,o),B(t,{name:e.name,email:e.email})))}catch(o){console.error("Error updating farm list names:",o)}m("success","✅ Profile saved!"),setTimeout(()=>{f(i.profileFrom||"home")},400)}async function N(){const e=E();k(e,i.currentFarmId);const r=document.getElementById("syncBtnIcon"),t=document.getElementById("profileSyncBtn");t.disabled=!0,r.textContent="⏳";const n="http://localhost:3000",l={deviceId:e.deviceId||"farm_001",sensorIntervalSeconds:e.sensorIntervalMinutes*60,soilDryThreshold:e.soilDryThreshold,phMin:e.phMin,phMax:e.phMax,darkThreshold:e.lightThreshold,wateringDurationSeconds:e.wateringDuration,autoWater:e.autoWater,notifications:e.notifications,ecoMode:e.ecoMode};try{const o=await fetch(`${n}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)});if(!o.ok)throw new Error(`HTTP ${o.status}`);r.textContent="✅",m("success","☁️ Settings synced to device!")}catch(o){r.textContent="⚠️",m("error",`Sync failed: ${o.message}. Settings saved locally.`),console.warn("[ProfilePage] Sync error:",o)}finally{setTimeout(()=>{r.textContent="☁️",t.disabled=!1},2e3)}}function E(){var e,r,t;return{name:d("profileName"),email:d("profileEmail"),farmName:d("profileFarmName"),deviceId:d("profileDeviceId")||"farm_001",sensorIntervalMinutes:parseInt(d("profileInterval"))||60,soilDryThreshold:parseInt(d("profileSoil"))||1800,phMin:parseFloat(d("profilePhMin"))||5.5,phMax:parseFloat(d("profilePhMax"))||6.5,lightThreshold:parseInt(d("profileLight"))||1500,wateringDuration:parseInt(d("profileWaterDur"))||10,autoWater:((e=document.getElementById("toggleAutoWater"))==null?void 0:e.checked)??!0,notifications:((r=document.getElementById("toggleNotifications"))==null?void 0:r.checked)??!0,ecoMode:((t=document.getElementById("toggleEcoMode"))==null?void 0:t.checked)??!1}}function x(e,r,t,n="text",l=""){return`
        <div style="margin-bottom:14px;">
            <label style="font-size:0.75rem;font-weight:600;color:var(--sub);display:block;margin-bottom:6px;">${e}</label>
            <input type="${n}" id="${r}" value="${y(String(t))}" placeholder="${l}" style="
                width:100%; padding:10px 12px;
                border:1px solid var(--border); border-radius:var(--radius-sm);
                background:var(--surface2); color:var(--text);
                font-family:inherit; font-size:0.85rem; outline:none;
                transition:border-color 0.15s;
            " onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'">
        </div>
    `}function v(e,r,t,n){return`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);">
            <div>
                <div style="font-size:0.85rem;font-weight:600;color:var(--text);">${e}</div>
                <div style="font-size:0.7rem;color:var(--muted);margin-top:2px;">${t}</div>
            </div>
            <label style="position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;margin-left:12px;">
                <input type="checkbox" id="${r}" class="auto-toggle" ${n?"checked":""} style="opacity:0;width:0;height:0;">
                <span style="
                    position:absolute;inset:0;
                    background:${n?"var(--accent)":"var(--border)"};border-radius:100px;cursor:pointer;
                    transition:background 0.2s;
                " id="${r}_track"></span>
                <span style="
                    position:absolute;top:3px;left:3px;
                    width:18px;height:18px;border-radius:50%;
                    background:white;box-shadow:0 1px 3px rgba(0,0,0,0.2);
                    transition:transform 0.2s;
                    transform:${n?"translateX(20px)":"none"};
                " id="${r}_thumb"></span>
            </label>
        </div>
    `}function p(e,r,t){var n;(n=document.getElementById(e))==null||n.addEventListener(r,t)}function d(e){var r;return((r=document.getElementById(e))==null?void 0:r.value)??""}function y(e){return String(e).replace(/"/g,"&quot;").replace(/</g,"&lt;")}function u(e,r,t){const n=document.getElementById(e),l=document.getElementById(r);!n||!l||n.addEventListener("input",()=>{l.textContent=t(n.value)})}function g(e,r){const t=document.getElementById(e),n=document.getElementById(`${e}_track`),l=document.getElementById(`${e}_thumb`);!t||!n||!l||(t.checked=r,n.style.background=r?"var(--accent)":"var(--border)",l.style.transform=r?"translateX(20px)":"none")}export{A as render};
