import{A as m,s as L,a as c}from"./index-CEjMjM4B.js";import"https://esm.sh/three@0.160.0";const S="farm_profile",O="user_farms",y=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function I(e){return`farm_profile_${e}`}function w(){return{name:"UTM Farmer",email:"farmer@seeddown.com",farmName:m.farmName||"Commercial Farm",deviceId:"farm_001",sensorIntervalMinutes:60,soilDryThreshold:1800,gasDangerThreshold:2500,tempMin:18,tempMax:35,phMin:5.5,phMax:6.5,lightThreshold:1500,wateringDuration:10,notifications:!0,autoWater:!0,ecoMode:!1}}function U(){const e=document.getElementById("screenContainer"),r=F(),t={...w(),...T(m.currentFarmId)||{}};e.innerHTML=`
        <div class="screen active" id="controlScreen">
            <div class="topbar">
                <button id="controlBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;color:var(--text);">←</button>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">IoT Control</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.06em;">${P((r==null?void 0:r.name)||m.farmName||"Commercial Farm")}</div>
                </div>
                <button id="controlSaveBtn" style="background:var(--accent);color:white;border:none;padding:8px 12px;border-radius:10px;font-size:0.75rem;font-weight:800;cursor:pointer;">Save</button>
            </div>

            <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px;">
                <div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="display:flex;gap:12px;align-items:center;">
                        <div style="width:44px;height:44px;border-radius:14px;background:var(--accent-l);display:flex;align-items:center;justify-content:center;font-size:24px;">🎛️</div>
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;">Device thresholds</div>
                            <div style="font-size:13px;color:var(--sub);line-height:1.4;">These values change how the backend creates ESP32 commands on the next sensor cycle.</div>
                        </div>
                    </div>
                    <div style="margin-top:12px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                        <label style="font-size:0.72rem;font-weight:800;color:var(--sub);display:block;margin-bottom:5px;">Device ID</label>
                        <input id="controlDeviceId" value="${G(t.deviceId)}" style="width:100%;border:none;background:transparent;color:var(--text);font-weight:800;outline:none;font-family:'DM Mono',monospace;">
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:12px;">
                        <div>
                            <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;">LATEST COMMAND</div>
                            <div id="latestCommandText" style="font-size:1rem;font-weight:900;color:var(--text);margin-top:3px;">Loading...</div>
                            <div id="latestCommandReason" style="font-size:0.72rem;color:var(--sub);line-height:1.35;margin-top:2px;">Checking pending ESP32 command.</div>
                        </div>
                        <button id="refreshCommandBtn" title="Refresh command" aria-label="Refresh command" style="width:36px;height:36px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--accent);font-weight:900;cursor:pointer;">↻</button>
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:12px;">PRESETS</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        ${p("leafy","🥬","Leafy Greens")}
                        ${p("fruiting","🍅","Fruiting Crops")}
                        ${p("energy","⚡","Energy Saver")}
                        ${p("safety","🛡️","High Safety")}
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">WATER + ROOT ZONE</div>
                    ${h("Soil Dry Threshold","controlSoil","soilVal",t.soilDryThreshold,500,3e3,100,"raw","Lower means easier to trigger WATER_ON")}
                    ${$("pH Range","controlPhMin","controlPhMax",t.phMin,t.phMax,4,8,.1,"pH outside this range creates PH_WARNING")}
                    ${h("Watering Duration","controlWaterDur","waterDurVal",t.wateringDuration,3,60,1,"s","Duration sent with WATER_ON command")}
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">ENVIRONMENT LIMITS</div>
                    ${$("Temperature Range","controlTempMin","controlTempMax",t.tempMin,t.tempMax,0,60,.5,"Temperature outside this range creates BUZZER_ON")}
                    ${h("Light Dark Threshold","controlLight","lightVal",t.lightThreshold,200,4e3,100,"raw","Light below this value creates LIGHT_ON")}
                    ${h("Gas Danger Threshold","controlGas","gasVal",t.gasDangerThreshold,500,4095,100,"raw","Gas above this value creates BUZZER_ON")}
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:12px;">MANUAL OVERRIDE</div>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px;">
                        ${b("WATER_ON","💦","Pump")}
                        ${b("LIGHT_ON","💡","Light")}
                        ${b("BUZZER_ON","🔔","Buzzer")}
                    </div>
                    <button id="emergencyStopBtn" style="width:100%;padding:13px;border:none;border-radius:var(--radius);background:var(--danger);color:white;font-weight:900;cursor:pointer;">Emergency Stop</button>
                </div>

                <button id="controlSyncBtn" style="width:100%;padding:14px;border:none;border-radius:var(--radius);background:var(--accent);color:white;flex-shrink:0;font-weight:800;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span id="controlSyncIcon">☁️</span> Sync Thresholds to IoT
                </button>

                <button id="controlLoadBtn" style="width:100%;padding:13px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--accent);font-weight:800;cursor:pointer;">Load Current Device Settings</button>

                <div style="height:10px;"></div>
            </div>
        </div>
    `,z(),k(!1),E(!1)}function z(){var e,r,t,n,o,d;(e=document.getElementById("controlBackBtn"))==null||e.addEventListener("click",()=>L("dash-c")),(r=document.getElementById("controlSaveBtn"))==null||r.addEventListener("click",A),(t=document.getElementById("controlSyncBtn"))==null||t.addEventListener("click",V),(n=document.getElementById("controlLoadBtn"))==null||n.addEventListener("click",()=>k(!0)),(o=document.getElementById("refreshCommandBtn"))==null||o.addEventListener("click",()=>E(!0)),(d=document.getElementById("emergencyStopBtn"))==null||d.addEventListener("click",()=>M("NO_ACTION","Emergency stop from dashboard")),document.querySelectorAll(".preset-btn").forEach(a=>{a.addEventListener("click",()=>_(a.dataset.preset))}),document.querySelectorAll(".manual-command-btn").forEach(a=>{a.addEventListener("click",()=>M(a.dataset.command,`${a.dataset.label} manual override from dashboard`))}),g("controlSoil","soilVal",a=>`${a} raw`),g("controlWaterDur","waterDurVal",a=>`${a}s`),g("controlLight","lightVal",a=>`${a} raw`),g("controlGas","gasVal",a=>`${a} raw`)}async function E(e){const r=l("controlDeviceId")||"farm_001";try{const t=await fetch(`${y}/api/sensors/command?deviceId=${encodeURIComponent(r)}`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const n=await t.json();C(n),e&&c("success","Command status refreshed")}catch(t){s("latestCommandText","Unavailable"),s("latestCommandReason","Could not load pending command."),e&&c("warning",`Command status unavailable: ${t.message}`)}}function C(e){if(!e){s("latestCommandText","NO_ACTION"),s("latestCommandReason","No pending command.");return}const r=e.executed?"Executed":"Pending";s("latestCommandText",`${e.command||"NO_ACTION"} · ${r}`),s("latestCommandReason",e.reason||"No reason provided.")}async function M(e,r){const t=l("controlDeviceId")||"farm_001",n=e==="NO_ACTION";try{const o=await fetch(`${y}/api/sensors/command`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:t,command:e,reason:r,durationSeconds:0})}),d=await o.json();if(!o.ok||d.ok===!1)throw new Error(d.error||`HTTP ${o.status}`);C(d.command),c("success",n?"Emergency stop queued for ESP32":`${e} queued for ESP32`)}catch(o){c("error",`Manual command failed: ${o.message}`)}}function _(e){const t={leafy:{soilDryThreshold:1900,gasDangerThreshold:2500,tempMin:18,tempMax:28,phMin:5.8,phMax:6.5,lightThreshold:1400,wateringDuration:8},fruiting:{soilDryThreshold:1700,gasDangerThreshold:2500,tempMin:20,tempMax:32,phMin:6,phMax:6.8,lightThreshold:2200,wateringDuration:12},energy:{soilDryThreshold:1600,gasDangerThreshold:2800,tempMin:18,tempMax:35,phMin:5.5,phMax:6.8,lightThreshold:1e3,wateringDuration:6},safety:{soilDryThreshold:2e3,gasDangerThreshold:1800,tempMin:18,tempMax:30,phMin:5.8,phMax:6.5,lightThreshold:1600,wateringDuration:8}}[e];t&&(i("controlSoil",t.soilDryThreshold),s("soilVal",`${t.soilDryThreshold} raw`),i("controlGas",t.gasDangerThreshold),s("gasVal",`${t.gasDangerThreshold} raw`),i("controlTempMin",t.tempMin),i("controlTempMax",t.tempMax),i("controlPhMin",t.phMin),i("controlPhMax",t.phMax),i("controlLight",t.lightThreshold),s("lightVal",`${t.lightThreshold} raw`),i("controlWaterDur",t.wateringDuration),s("waterDurVal",`${t.wateringDuration}s`),c("info","Preset applied. Press Sync to send it to IoT."))}async function k(e){const r=l("controlDeviceId")||"farm_001";try{const t=await fetch(`${y}/api/sensors/preferences?deviceId=${encodeURIComponent(r)}`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const n=await t.json();R(n),e&&c("success","Loaded current device settings")}catch(t){e&&c("warning",`Could not load device settings: ${t.message}`),console.warn("[ControlPage] Load preferences failed:",t)}}function R(e){e&&(i("controlSoil",e.soilDryThreshold),s("soilVal",`${e.soilDryThreshold??l("controlSoil")} raw`),i("controlGas",e.gasDangerThreshold),s("gasVal",`${e.gasDangerThreshold??l("controlGas")} raw`),i("controlTempMin",e.tempMin),i("controlTempMax",e.tempMax),i("controlPhMin",e.phMin),i("controlPhMax",e.phMax),i("controlLight",e.darkThreshold),s("lightVal",`${e.darkThreshold??l("controlLight")} raw`),i("controlWaterDur",e.wateringDurationSeconds),s("waterDurVal",`${e.wateringDurationSeconds??l("controlWaterDur")}s`))}function A(){const e={...w(),...T(m.currentFarmId)||{},...N()};B(e,m.currentFarmId),c("success","Control thresholds saved locally")}async function V(){const e=N(),r=document.getElementById("controlSyncIcon"),t=document.getElementById("controlSyncBtn");t.disabled=!0,r.textContent="⏳",B({...w(),...T(m.currentFarmId)||{},...e},m.currentFarmId);const n={deviceId:e.deviceId,soilDryThreshold:e.soilDryThreshold,gasDangerThreshold:e.gasDangerThreshold,tempMin:e.tempMin,tempMax:e.tempMax,phMin:e.phMin,phMax:e.phMax,darkThreshold:e.lightThreshold,wateringDurationSeconds:e.wateringDuration};try{const o=await fetch(`${y}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!o.ok)throw new Error(`HTTP ${o.status}`);r.textContent="✅",c("success","Thresholds synced. ESP32 will use them next cycle.")}catch(o){r.textContent="⚠️",c("error",`Sync failed: ${o.message}. Saved locally.`),console.warn("[ControlPage] Sync failed:",o)}finally{setTimeout(()=>{r.textContent="☁️",t.disabled=!1},2e3)}}function N(){return{deviceId:l("controlDeviceId")||"farm_001",soilDryThreshold:v("controlSoil",1800),gasDangerThreshold:v("controlGas",2500),tempMin:f("controlTempMin",18),tempMax:f("controlTempMax",35),phMin:f("controlPhMin",5.5),phMax:f("controlPhMax",6.5),lightThreshold:v("controlLight",1500),wateringDuration:v("controlWaterDur",10)}}function p(e,r,t){return`
        <button class="preset-btn" data-preset="${e}" style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:12px 8px;text-align:left;cursor:pointer;color:var(--text);">
            <div style="font-size:22px;line-height:1;">${r}</div>
            <div style="font-size:12px;font-weight:900;margin-top:7px;">${t}</div>
        </button>`}function b(e,r,t){return`
        <button class="manual-command-btn" data-command="${e}" data-label="${t}" style="background:var(--accent-l);border:1px solid var(--accent);border-radius:14px;padding:12px 6px;text-align:center;cursor:pointer;color:var(--accent);font-weight:900;">
            <div style="font-size:24px;line-height:1;">${r}</div>
            <div style="font-size:11px;margin-top:6px;">${t}</div>
        </button>`}function h(e,r,t,n,o,d,a,u,x){return`
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px;">
                <label style="font-size:0.8rem;font-weight:700;color:var(--text);">${e}</label>
                <span id="${t}" style="font-size:0.8rem;font-weight:800;color:var(--accent);font-family:'DM Mono',monospace;">${n} ${u}</span>
            </div>
            <input type="range" id="${r}" min="${o}" max="${d}" step="${a}" value="${n}" style="width:100%;accent-color:var(--accent);">
            <div style="font-size:0.67rem;color:var(--muted);margin-top:4px;">${x}</div>
        </div>`}function $(e,r,t,n,o,d,a,u,x){return`
        <div style="margin-bottom:16px;">
            <label style="font-size:0.8rem;font-weight:700;color:var(--text);">${e}</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
                <div>
                    <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Min</div>
                    <input type="number" id="${r}" value="${n}" min="${d}" max="${a}" step="${u}" style="${D()}">
                </div>
                <div>
                    <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Max</div>
                    <input type="number" id="${t}" value="${o}" min="${d}" max="${a}" step="${u}" style="${D()}">
                </div>
            </div>
            <div style="font-size:0.67rem;color:var(--muted);margin-top:4px;">${x}</div>
        </div>`}function D(){return"width:100%;padding:9px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--text);outline:none;"}function F(){const e=W();return m.currentFarm||e.find(r=>r.id===m.currentFarmId)||e[e.length-1]||null}function W(){try{return JSON.parse(localStorage.getItem(O))||[]}catch{return[]}}function T(e){try{if(e){const t=localStorage.getItem(I(e));if(t)return JSON.parse(t)}const r=localStorage.getItem(S);return r?JSON.parse(r):null}catch{return null}}function B(e,r){try{r&&localStorage.setItem(I(r),JSON.stringify(e)),localStorage.setItem(S,JSON.stringify({name:e.name,email:e.email}))}catch{}}function g(e,r,t){const n=document.getElementById(e),o=document.getElementById(r);!n||!o||n.addEventListener("input",()=>{o.textContent=t(n.value)})}function i(e,r){const t=document.getElementById(e);t&&r!==void 0&&r!==null&&(t.value=r)}function s(e,r){const t=document.getElementById(e);t&&(t.textContent=r)}function l(e){var r;return((r=document.getElementById(e))==null?void 0:r.value)??""}function v(e,r){const t=Number.parseInt(l(e),10);return Number.isFinite(t)?t:r}function f(e,r){const t=Number.parseFloat(l(e));return Number.isFinite(t)?t:r}function P(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function G(e){return P(e).replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{U as render};
