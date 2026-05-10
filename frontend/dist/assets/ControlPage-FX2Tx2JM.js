import{A as a,s as k,a as l}from"./index-JYAZ7EKD.js";import"https://esm.sh/three@0.160.0";const T="farm_profile",B="user_farms",M=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function I(e){return`farm_profile_${e}`}function y(){return{name:"UTM Farmer",email:"farmer@seeddown.com",farmName:a.farmName||"Commercial Farm",deviceId:"farm_001",sensorIntervalMinutes:60,soilDryThreshold:1800,gasDangerThreshold:2500,tempMin:18,tempMax:35,phMin:5.5,phMax:6.5,lightThreshold:1500,wateringDuration:10,notifications:!0,autoWater:!0,ecoMode:!1}}function R(){const e=document.getElementById("screenContainer"),r=z(),t={...y(),...x(a.currentFarmId)||{}};e.innerHTML=`
        <div class="screen active" id="controlScreen">
            <div class="topbar">
                <button id="controlBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;color:var(--text);">←</button>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">IoT Control</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.06em;">${E((r==null?void 0:r.name)||a.farmName||"Commercial Farm")}</div>
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
                        <input id="controlDeviceId" value="${O(t.deviceId)}" style="width:100%;border:none;background:transparent;color:var(--text);font-weight:800;outline:none;font-family:'DM Mono',monospace;">
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">WATER + ROOT ZONE</div>
                    ${m("Soil Dry Threshold","controlSoil","soilVal",t.soilDryThreshold,500,3e3,100,"raw","Lower means easier to trigger WATER_ON")}
                    ${b("pH Range","controlPhMin","controlPhMax",t.phMin,t.phMax,4,8,.1,"pH outside this range creates PH_WARNING")}
                    ${m("Watering Duration","controlWaterDur","waterDurVal",t.wateringDuration,3,60,1,"s","Duration sent with WATER_ON command")}
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">ENVIRONMENT LIMITS</div>
                    ${b("Temperature Range","controlTempMin","controlTempMax",t.tempMin,t.tempMax,0,60,.5,"Temperature outside this range creates BUZZER_ON")}
                    ${m("Light Dark Threshold","controlLight","lightVal",t.lightThreshold,200,4e3,100,"raw","Light below this value creates LIGHT_ON")}
                    ${m("Gas Danger Threshold","controlGas","gasVal",t.gasDangerThreshold,500,4095,100,"raw","Gas above this value creates BUZZER_ON")}
                </div>

                <button id="controlSyncBtn" style="width:100%;padding:14px;border:none;border-radius:var(--radius);background:var(--accent);color:white;flex-shrink:0;font-weight:800;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span id="controlSyncIcon">☁️</span> Sync Thresholds to IoT
                </button>

                <button id="controlLoadBtn" style="width:100%;padding:13px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--accent);font-weight:800;cursor:pointer;">Load Current Device Settings</button>

                <div style="height:10px;"></div>
            </div>
        </div>
    `,C(),$(!1)}function C(){var e,r,t,n;(e=document.getElementById("controlBackBtn"))==null||e.addEventListener("click",()=>k("dash-c")),(r=document.getElementById("controlSaveBtn"))==null||r.addEventListener("click",L),(t=document.getElementById("controlSyncBtn"))==null||t.addEventListener("click",P),(n=document.getElementById("controlLoadBtn"))==null||n.addEventListener("click",()=>$(!0)),p("controlSoil","soilVal",o=>`${o} raw`),p("controlWaterDur","waterDurVal",o=>`${o}s`),p("controlLight","lightVal",o=>`${o} raw`),p("controlGas","gasVal",o=>`${o} raw`)}async function $(e){const r=s("controlDeviceId")||"farm_001";try{const t=await fetch(`${M}/api/sensors/preferences?deviceId=${encodeURIComponent(r)}`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const n=await t.json();N(n),e&&l("success","Loaded current device settings")}catch(t){e&&l("warning",`Could not load device settings: ${t.message}`),console.warn("[ControlPage] Load preferences failed:",t)}}function N(e){e&&(i("controlSoil",e.soilDryThreshold),h("soilVal",`${e.soilDryThreshold??s("controlSoil")} raw`),i("controlGas",e.gasDangerThreshold),h("gasVal",`${e.gasDangerThreshold??s("controlGas")} raw`),i("controlTempMin",e.tempMin),i("controlTempMax",e.tempMax),i("controlPhMin",e.phMin),i("controlPhMax",e.phMax),i("controlLight",e.darkThreshold),h("lightVal",`${e.darkThreshold??s("controlLight")} raw`),i("controlWaterDur",e.wateringDurationSeconds),h("waterDurVal",`${e.wateringDurationSeconds??s("controlWaterDur")}s`))}function L(){const e={...y(),...x(a.currentFarmId)||{},...D()};S(e,a.currentFarmId),l("success","Control thresholds saved locally")}async function P(){const e=D(),r=document.getElementById("controlSyncIcon"),t=document.getElementById("controlSyncBtn");t.disabled=!0,r.textContent="⏳",S({...y(),...x(a.currentFarmId)||{},...e},a.currentFarmId);const n={deviceId:e.deviceId,soilDryThreshold:e.soilDryThreshold,gasDangerThreshold:e.gasDangerThreshold,tempMin:e.tempMin,tempMax:e.tempMax,phMin:e.phMin,phMax:e.phMax,darkThreshold:e.lightThreshold,wateringDurationSeconds:e.wateringDuration};try{const o=await fetch(`${M}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!o.ok)throw new Error(`HTTP ${o.status}`);r.textContent="✅",l("success","Thresholds synced. ESP32 will use them next cycle.")}catch(o){r.textContent="⚠️",l("error",`Sync failed: ${o.message}. Saved locally.`),console.warn("[ControlPage] Sync failed:",o)}finally{setTimeout(()=>{r.textContent="☁️",t.disabled=!1},2e3)}}function D(){return{deviceId:s("controlDeviceId")||"farm_001",soilDryThreshold:g("controlSoil",1800),gasDangerThreshold:g("controlGas",2500),tempMin:v("controlTempMin",18),tempMax:v("controlTempMax",35),phMin:v("controlPhMin",5.5),phMax:v("controlPhMax",6.5),lightThreshold:g("controlLight",1500),wateringDuration:g("controlWaterDur",10)}}function m(e,r,t,n,o,c,d,u,f){return`
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px;">
                <label style="font-size:0.8rem;font-weight:700;color:var(--text);">${e}</label>
                <span id="${t}" style="font-size:0.8rem;font-weight:800;color:var(--accent);font-family:'DM Mono',monospace;">${n} ${u}</span>
            </div>
            <input type="range" id="${r}" min="${o}" max="${c}" step="${d}" value="${n}" style="width:100%;accent-color:var(--accent);">
            <div style="font-size:0.67rem;color:var(--muted);margin-top:4px;">${f}</div>
        </div>`}function b(e,r,t,n,o,c,d,u,f){return`
        <div style="margin-bottom:16px;">
            <label style="font-size:0.8rem;font-weight:700;color:var(--text);">${e}</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
                <div>
                    <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Min</div>
                    <input type="number" id="${r}" value="${n}" min="${c}" max="${d}" step="${u}" style="${w()}">
                </div>
                <div>
                    <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Max</div>
                    <input type="number" id="${t}" value="${o}" min="${c}" max="${d}" step="${u}" style="${w()}">
                </div>
            </div>
            <div style="font-size:0.67rem;color:var(--muted);margin-top:4px;">${f}</div>
        </div>`}function w(){return"width:100%;padding:9px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--text);outline:none;"}function z(){const e=F();return a.currentFarm||e.find(r=>r.id===a.currentFarmId)||e[e.length-1]||null}function F(){try{return JSON.parse(localStorage.getItem(B))||[]}catch{return[]}}function x(e){try{if(e){const t=localStorage.getItem(I(e));if(t)return JSON.parse(t)}const r=localStorage.getItem(T);return r?JSON.parse(r):null}catch{return null}}function S(e,r){try{r&&localStorage.setItem(I(r),JSON.stringify(e)),localStorage.setItem(T,JSON.stringify({name:e.name,email:e.email}))}catch{}}function p(e,r,t){const n=document.getElementById(e),o=document.getElementById(r);!n||!o||n.addEventListener("input",()=>{o.textContent=t(n.value)})}function i(e,r){const t=document.getElementById(e);t&&r!==void 0&&r!==null&&(t.value=r)}function h(e,r){const t=document.getElementById(e);t&&(t.textContent=r)}function s(e){var r;return((r=document.getElementById(e))==null?void 0:r.value)??""}function g(e,r){const t=Number.parseInt(s(e),10);return Number.isFinite(t)?t:r}function v(e,r){const t=Number.parseFloat(s(e));return Number.isFinite(t)?t:r}function E(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function O(e){return E(e).replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{R as render};
