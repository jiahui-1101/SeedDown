import{A as p,s as P,a as m}from"./index-iCFplLzP.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const k="farm_profile",F="user_farms",w=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function B(e){return`farm_profile_${e}`}function M(){return{name:"UTM Farmer",email:"farmer@seeddown.com",farmName:p.farmName||"Commercial Farm",deviceId:"farm_001",sensorIntervalMinutes:60,soilDryThreshold:1800,gasDangerThreshold:2500,tempMin:18,tempMax:35,phMin:5.5,phMax:6.5,lightThreshold:1500,wateringDuration:10,notifications:!0,autoWater:!0,ecoMode:!1}}function K(){const e=document.getElementById("screenContainer"),r=G(),t={...M(),...$(p.currentFarmId)||{}};e.innerHTML=`
        <div class="screen active" id="controlScreen">
            <div class="topbar">
                <button id="controlBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;color:var(--text);">←</button>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">IoT Control</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.06em;">${D((r==null?void 0:r.name)||p.farmName||"Commercial Farm")}</div>
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
                        <input id="controlDeviceId" value="${U(t.deviceId)}" style="width:100%;border:none;background:transparent;color:var(--text);font-weight:800;outline:none;font-family:'DM Mono',monospace;">
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



                <div id="controlAiRecommendation" style="background:#F8FAFC;border:1px solid var(--border);border-left:4px solid var(--accent);border-radius:16px;padding:14px 15px;box-shadow:var(--shadow-sm);">
                    <div style="display:flex;gap:10px;align-items:flex-start;">
                        <div id="controlAiIcon" style="width:34px;height:34px;border-radius:12px;background:var(--accent-l);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0;color:var(--accent);">AI</div>
                        <div style="flex:1;min-width:0;">
                            <div id="controlAiTitle" style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;">AI Threshold Check</div>
                            <div id="controlAiSummary" style="font-size:13px;color:var(--sub);line-height:1.4;margin-top:3px;">Settings look safe for commercial automation.</div>
                            <div id="controlAiList" style="display:none;margin-top:9px;flex-direction:column;gap:6px;"></div>
                        </div>
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:12px;">PRESETS</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        ${v("leafy","🥬","Leafy Greens")}
                        ${v("fruiting","🍅","Fruiting Crops")}
                        ${v("energy","⚡","Energy Saver")}
                        ${v("safety","🛡️","High Safety")}
                    </div>
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">WATER + ROOT ZONE</div>
                    ${f("Soil Dry Threshold","controlSoil","soilVal",t.soilDryThreshold,500,3e3,100,"raw","Lower means easier to trigger WATER_ON")}
                    ${S("pH Range","controlPhMin","controlPhMax",t.phMin,t.phMax,4,8,.1,"pH outside this range creates PH_WARNING")}
                    ${f("Watering Duration","controlWaterDur","waterDurVal",t.wateringDuration,3,60,1,"s","Duration sent with WATER_ON command")}
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:14px;">ENVIRONMENT LIMITS</div>
                    ${S("Temperature Range","controlTempMin","controlTempMax",t.tempMin,t.tempMax,0,60,.5,"Temperature outside this range creates BUZZER_ON")}
                    ${f("Light Dark Threshold","controlLight","lightVal",t.lightThreshold,200,4e3,100,"raw","Light below this value creates LIGHT_ON")}
                    ${f("Gas Danger Threshold","controlGas","gasVal",t.gasDangerThreshold,500,4095,100,"raw","Gas above this value creates BUZZER_ON")}
                </div>

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:12px;">MANUAL OVERRIDE</div>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px;">
                        ${T("WATER_ON","💦","Pump")}
                        ${T("LIGHT_ON","💡","Light")}
                        ${T("BUZZER_ON","🔔","Buzzer")}
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
    `,O(),N(!1),L(!1)}function O(){var e,r,t,n,a,i;(e=document.getElementById("controlBackBtn"))==null||e.addEventListener("click",()=>P("dash-c")),(r=document.getElementById("controlSaveBtn"))==null||r.addEventListener("click",V),(t=document.getElementById("controlSyncBtn"))==null||t.addEventListener("click",H),(n=document.getElementById("controlLoadBtn"))==null||n.addEventListener("click",()=>N(!0)),(a=document.getElementById("refreshCommandBtn"))==null||a.addEventListener("click",()=>L(!0)),(i=document.getElementById("emergencyStopBtn"))==null||i.addEventListener("click",()=>E("NO_ACTION","Emergency stop from dashboard")),document.querySelectorAll(".preset-btn").forEach(o=>{o.addEventListener("click",()=>R(o.dataset.preset))}),document.querySelectorAll(".manual-command-btn").forEach(o=>{o.addEventListener("click",()=>E(o.dataset.command,`${o.dataset.label} manual override from dashboard`))}),y("controlSoil","soilVal",o=>`${o} raw`),y("controlWaterDur","waterDurVal",o=>`${o}s`),y("controlLight","lightVal",o=>`${o} raw`),y("controlGas","gasVal",o=>`${o} raw`),["controlDeviceId","controlTempMin","controlTempMax","controlPhMin","controlPhMax"].forEach(o=>{var l;(l=document.getElementById(o))==null||l.addEventListener("input",h)}),h()}async function L(e){const r=g("controlDeviceId")||"farm_001";try{const t=await fetch(`${w}/api/sensors/command?deviceId=${encodeURIComponent(r)}`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const n=await t.json();A(n),e&&m("success","Command status refreshed")}catch(t){d("latestCommandText","Unavailable"),d("latestCommandReason","Could not load pending command."),e&&m("warning",`Command status unavailable: ${t.message}`)}}function A(e){if(!e){d("latestCommandText","NO_ACTION"),d("latestCommandReason","No pending command.");return}const r=e.executed?"Executed":"Pending";d("latestCommandText",`${e.command||"NO_ACTION"} · ${r}`),d("latestCommandReason",e.reason||"No reason provided.")}async function E(e,r){const t=g("controlDeviceId")||"farm_001",n=e==="NO_ACTION";try{const a=await fetch(`${w}/api/sensors/command`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:t,command:e,reason:r,durationSeconds:0})}),i=await a.json();if(!a.ok||i.ok===!1)throw new Error(i.error||`HTTP ${a.status}`);A(i.command),m("success",n?"Emergency stop queued for ESP32":`${e} queued for ESP32`)}catch(a){m("error",`Manual command failed: ${a.message}`)}}function R(e){const t={leafy:{soilDryThreshold:1900,gasDangerThreshold:2500,tempMin:18,tempMax:28,phMin:5.8,phMax:6.5,lightThreshold:1400,wateringDuration:8},fruiting:{soilDryThreshold:1700,gasDangerThreshold:2500,tempMin:20,tempMax:32,phMin:6,phMax:6.8,lightThreshold:2200,wateringDuration:12},energy:{soilDryThreshold:1600,gasDangerThreshold:2800,tempMin:18,tempMax:35,phMin:5.5,phMax:6.8,lightThreshold:1e3,wateringDuration:6},safety:{soilDryThreshold:2e3,gasDangerThreshold:1800,tempMin:18,tempMax:30,phMin:5.8,phMax:6.5,lightThreshold:1600,wateringDuration:8}}[e];t&&(s("controlSoil",t.soilDryThreshold),d("soilVal",`${t.soilDryThreshold} raw`),s("controlGas",t.gasDangerThreshold),d("gasVal",`${t.gasDangerThreshold} raw`),s("controlTempMin",t.tempMin),s("controlTempMax",t.tempMax),s("controlPhMin",t.phMin),s("controlPhMax",t.phMax),s("controlLight",t.lightThreshold),d("lightVal",`${t.lightThreshold} raw`),s("controlWaterDur",t.wateringDuration),d("waterDurVal",`${t.wateringDuration}s`),h(),m("info","Preset applied. Press Sync to send it to IoT."))}async function N(e){const r=g("controlDeviceId")||"farm_001";try{const t=await fetch(`${w}/api/sensors/preferences?deviceId=${encodeURIComponent(r)}`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const n=await t.json();_(n),e&&m("success","Loaded current device settings")}catch(t){e&&m("warning",`Could not load device settings: ${t.message}`),console.warn("[ControlPage] Load preferences failed:",t)}}function _(e){e&&(s("controlSoil",e.soilDryThreshold),d("soilVal",`${e.soilDryThreshold??g("controlSoil")} raw`),s("controlGas",e.gasDangerThreshold),d("gasVal",`${e.gasDangerThreshold??g("controlGas")} raw`),s("controlTempMin",e.tempMin),s("controlTempMax",e.tempMax),s("controlPhMin",e.phMin),s("controlPhMax",e.phMax),s("controlLight",e.darkThreshold),d("lightVal",`${e.darkThreshold??g("controlLight")} raw`),s("controlWaterDur",e.wateringDurationSeconds),d("waterDurVal",`${e.wateringDurationSeconds??g("controlWaterDur")}s`),h())}function V(){const e=I(),r=h(),t={...M(),...$(p.currentFarmId)||{},...e};z(t,p.currentFarmId),m(r.level==="danger"?"warning":"success",r.level==="danger"?"Saved locally, but AI recommends adjusting risky thresholds.":"Control thresholds saved locally")}async function H(){const e=I();h().level==="danger"&&m("warning","AI warning: thresholds are risky. Review the recommendation before syncing.");const t=document.getElementById("controlSyncIcon"),n=document.getElementById("controlSyncBtn");n.disabled=!0,t.textContent="⏳",z({...M(),...$(p.currentFarmId)||{},...e},p.currentFarmId);const a={deviceId:e.deviceId,soilDryThreshold:e.soilDryThreshold,gasDangerThreshold:e.gasDangerThreshold,tempMin:e.tempMin,tempMax:e.tempMax,phMin:e.phMin,phMax:e.phMax,darkThreshold:e.lightThreshold,wateringDurationSeconds:e.wateringDuration};try{const i=await fetch(`${w}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!i.ok)throw new Error(`HTTP ${i.status}`);t.textContent="✅",m("success","Thresholds synced. ESP32 will use them next cycle.")}catch(i){t.textContent="⚠️",m("error",`Sync failed: ${i.message}. Saved locally.`),console.warn("[ControlPage] Sync failed:",i)}finally{setTimeout(()=>{t.textContent="☁️",n.disabled=!1},2e3)}}function I(){return{deviceId:g("controlDeviceId")||"farm_001",soilDryThreshold:x("controlSoil",1800),gasDangerThreshold:x("controlGas",2500),tempMin:b("controlTempMin",18),tempMax:b("controlTempMax",35),phMin:b("controlPhMin",5.5),phMax:b("controlPhMax",6.5),lightThreshold:x("controlLight",1500),wateringDuration:x("controlWaterDur",10)}}function h(){const e=I(),r=W(e),t=r.some(u=>u.level==="danger")?"danger":r.some(u=>u.level==="warning")?"warning":"safe",n=document.getElementById("controlAiRecommendation"),a=document.getElementById("controlAiIcon"),i=document.getElementById("controlAiTitle"),o=document.getElementById("controlAiSummary"),l=document.getElementById("controlAiList");if(!n||!a||!i||!o||!l)return{level:t,findings:r};const c={safe:{border:"var(--accent)",bg:"#F8FAFC",iconBg:"var(--accent-l)",color:"var(--accent)",icon:"AI",title:"AI Threshold Check"},warning:{border:"#D97706",bg:"#FFFBEB",iconBg:"#FEF3C7",color:"#B45309",icon:"!",title:"AI Recommendation"},danger:{border:"var(--danger)",bg:"#FEF2F2",iconBg:"#FEE2E2",color:"var(--danger)",icon:"!!",title:"AI Safety Warning"}}[t];return n.style.borderLeftColor=c.border,n.style.background=c.bg,a.style.background=c.iconBg,a.style.color=c.color,a.textContent=c.icon,i.textContent=c.title,i.style.color=c.color,r.length?(o.textContent=t==="danger"?"Some settings can delay emergency actions or make automation unstable.":"AI found settings that may cause false alarms or inefficient device response.",l.style.display="flex",l.innerHTML=r.slice(0,4).map(u=>`
        <div style="display:flex;gap:7px;align-items:flex-start;font-size:11px;line-height:1.35;color:${u.level==="danger"?"var(--danger)":"#92400E"};font-weight:800;">
            <span>${u.level==="danger"?"!":"-"}</span>
            <span>${D(u.message)}</span>
        </div>
    `).join(""),{level:t,findings:r}):(o.textContent="Settings look safe for commercial automation.",l.style.display="none",l.innerHTML="",{level:t,findings:r})}function W(e){const r=[],t=(n,a)=>r.push({level:n,message:a});return e.deviceId.trim()||t("danger","Device ID is empty, so ESP32 preferences cannot sync correctly."),e.tempMin>=e.tempMax?t("danger","Temperature min must be lower than max. Recommended range: 18C to 35C."):(e.tempMin<10&&t("warning","Temperature min is very low; cold stress may be ignored too long. Consider 18C."),e.tempMax>42&&t("danger","Temperature max is too high; buzzer/fan may react too late. Keep it near 35C."),e.tempMax-e.tempMin<5&&t("warning","Temperature range is too narrow and may create frequent false alerts."),e.tempMax-e.tempMin>25&&t("warning","Temperature range is too wide and may miss crop stress.")),e.phMin>=e.phMax?t("danger","pH min must be lower than pH max. Recommended range: 5.5 to 6.5."):(e.phMin<4.8&&t("warning","pH min is too acidic for most crops. Consider 5.5."),e.phMax>7.2&&t("warning","pH max is too alkaline for nutrient uptake. Consider 6.5."),e.phMax-e.phMin>1.8&&t("warning","pH range is too wide; nutrient issues may be detected late.")),e.gasDangerThreshold>3300&&t("danger","Gas danger threshold is very high; buzzer may trigger too late. Consider 2500 or lower."),e.gasDangerThreshold<900&&t("warning","Gas danger threshold is very sensitive and may cause frequent buzzer alerts."),e.soilDryThreshold<900&&t("warning","Soil threshold is very low; watering may wait until plants are too dry."),e.soilDryThreshold>2700&&t("warning","Soil threshold is very high; pump may run too often and waste water."),e.lightThreshold<700&&t("warning","Light threshold is very low; plants may stay under-lit before action triggers."),e.lightThreshold>3200&&t("warning","Light threshold is very high; lighting/fan simulation may trigger too often and waste energy."),e.wateringDuration>30&&t("warning","Watering duration is long; risk of overwatering. Try 8-15 seconds first."),e.wateringDuration<4&&t("warning","Watering duration is very short; pump may not deliver enough water."),r}function v(e,r,t){return`
        <button class="preset-btn" data-preset="${e}" style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:12px 8px;text-align:left;cursor:pointer;color:var(--text);">
            <div style="font-size:22px;line-height:1;">${r}</div>
            <div style="font-size:12px;font-weight:900;margin-top:7px;">${t}</div>
        </button>`}function T(e,r,t){return`
        <button class="manual-command-btn" data-command="${e}" data-label="${t}" style="background:var(--accent-l);border:1px solid var(--accent);border-radius:14px;padding:12px 6px;text-align:center;cursor:pointer;color:var(--accent);font-weight:900;">
            <div style="font-size:24px;line-height:1;">${r}</div>
            <div style="font-size:11px;margin-top:6px;">${t}</div>
        </button>`}function f(e,r,t,n,a,i,o,l,c){return`
        <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px;">
                <label style="font-size:0.8rem;font-weight:700;color:var(--text);">${e}</label>
                <span id="${t}" style="font-size:0.8rem;font-weight:800;color:var(--accent);font-family:'DM Mono',monospace;">${n} ${l}</span>
            </div>
            <input type="range" id="${r}" min="${a}" max="${i}" step="${o}" value="${n}" style="width:100%;accent-color:var(--accent);">
            <div style="font-size:0.67rem;color:var(--muted);margin-top:4px;">${c}</div>
        </div>`}function S(e,r,t,n,a,i,o,l,c){return`
        <div style="margin-bottom:16px;">
            <label style="font-size:0.8rem;font-weight:700;color:var(--text);">${e}</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
                <div>
                    <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Min</div>
                    <input type="number" id="${r}" value="${n}" min="${i}" max="${o}" step="${l}" style="${C()}">
                </div>
                <div>
                    <div style="font-size:0.65rem;color:var(--muted);margin-bottom:4px;">Max</div>
                    <input type="number" id="${t}" value="${a}" min="${i}" max="${o}" step="${l}" style="${C()}">
                </div>
            </div>
            <div style="font-size:0.67rem;color:var(--muted);margin-top:4px;">${c}</div>
        </div>`}function C(){return"width:100%;padding:9px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);font-family:'DM Mono',monospace;font-size:0.85rem;color:var(--text);outline:none;"}function G(){const e=j();return p.currentFarm||e.find(r=>r.id===p.currentFarmId)||e[e.length-1]||null}function j(){try{return JSON.parse(localStorage.getItem(F))||[]}catch{return[]}}function $(e){try{if(e){const t=localStorage.getItem(B(e));if(t)return JSON.parse(t)}const r=localStorage.getItem(k);return r?JSON.parse(r):null}catch{return null}}function z(e,r){try{r&&localStorage.setItem(B(r),JSON.stringify(e)),localStorage.setItem(k,JSON.stringify({name:e.name,email:e.email}))}catch{}}function y(e,r,t){const n=document.getElementById(e),a=document.getElementById(r);!n||!a||n.addEventListener("input",()=>{a.textContent=t(n.value),h()})}function s(e,r){const t=document.getElementById(e);t&&r!==void 0&&r!==null&&(t.value=r)}function d(e,r){const t=document.getElementById(e);t&&(t.textContent=r)}function g(e){var r;return((r=document.getElementById(e))==null?void 0:r.value)??""}function x(e,r){const t=Number.parseInt(g(e),10);return Number.isFinite(t)?t:r}function b(e,r){const t=Number.parseFloat(g(e));return Number.isFinite(t)?t:r}function D(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function U(e){return D(e).replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{K as render};
