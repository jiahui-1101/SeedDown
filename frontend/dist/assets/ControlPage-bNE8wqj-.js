import{A as p,s as F,a as c}from"./index-kXpGLROK.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const I="farm_profile",z="user_farms",x=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function M(e){return`farm_profile_${e}`}function b(){return{name:"UTM Farmer",email:"farmer@seeddown.com",farmName:p.farmName||"Commercial Farm",deviceId:"farm_001",sensorIntervalMinutes:60,soilDryThreshold:1800,gasDangerThreshold:2500,tempMin:18,tempMax:35,phMin:5.5,phMax:6.5,lightThreshold:1500,wateringDuration:10,notifications:!0,autoWater:!0,ecoMode:!1}}function V(){const e=document.getElementById("screenContainer"),n=U(),t={...b(),...S(p.currentFarmId)||{}},o=q(n),r={...(n==null?void 0:n.farmThresholds)||{},...t};e.innerHTML=`
        <div class="screen active" id="controlScreen">
            <div class="topbar">
                <button id="controlBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;color:var(--text);">←</button>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">IoT Control</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.06em;">${m((n==null?void 0:n.name)||p.farmName||"Commercial Farm")}</div>
                </div>
                <button id="controlSaveBtn" style="background:var(--accent);color:white;border:none;padding:8px 12px;border-radius:10px;font-size:0.75rem;font-weight:800;cursor:pointer;">Save</button>
            </div>

            <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px;">
                <div style="background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="display:flex;gap:12px;align-items:center;">
                        <div style="width:44px;height:44px;border-radius:14px;background:var(--accent-l);display:flex;align-items:center;justify-content:center;font-size:24px;">🎛️</div>
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;">Commercial threshold control</div>
                            <div style="font-size:13px;color:var(--sub);line-height:1.4;">Farm Master and Zone thresholds match the New Field AI threshold setup.</div>
                        </div>
                    </div>
                    <div style="margin-top:12px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
                        <label style="font-size:0.72rem;font-weight:800;color:var(--sub);display:block;margin-bottom:5px;">Device ID</label>
                        <input id="controlDeviceId" value="${d(t.deviceId)}" style="width:100%;border:none;background:transparent;color:var(--text);font-weight:800;outline:none;font-family:'DM Mono',monospace;">
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

                ${C({id:"farm_master",title:"Farm Master Node",subtitle:"Farm-level shared sensors and outputs",scope:"farm",thresholds:r})}

                ${o.map(a=>C({id:a.id,title:a.label,subtitle:`${a.crop||"Mixed crops"} · zone-level sensor and output recipe`,scope:"zone",thresholds:a.thresholds||{}})).join("")}

                <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;margin-bottom:12px;">MANUAL OVERRIDE</div>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px;">
                        ${v("WATER_ON","💦","Pump")}
                        ${v("LIGHT_ON","💡","Light")}
                        ${v("BUZZER_ON","🔔","Buzzer")}
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
    `,B(),A(),$(!1),T(!1)}function B(){if(document.getElementById("control-polish-style"))return;const e=document.createElement("style");e.id="control-polish-style",e.textContent=`
        #controlScreen {
            --accent: #0f766e;
            --accent-l: #ecfeff;
            --surface: #ffffff;
            --surface2: #f7fefe;
            --border: #ccfbf1;
            --text: #12312f;
            --sub: #4f6f6a;
            --muted: #78908b;
            --danger: #dc2626;
            --radius: 16px;
            --radius-sm: 12px;
            --shadow-sm: 0 10px 28px rgba(15, 118, 110, .08);
            background: #f5fffc !important;
            color: var(--text);
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
            letter-spacing: 0 !important;
        }
        #controlScreen *,
        #controlScreen button,
        #controlScreen input,
        #controlScreen select {
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
            letter-spacing: 0 !important;
        }
        #controlScreen .topbar {
            background: rgba(255, 255, 255, .94) !important;
            border-bottom: 1px solid var(--border) !important;
            box-shadow: 0 8px 28px rgba(15, 118, 110, .07) !important;
            backdrop-filter: blur(16px);
        }
        #controlScreen input,
        #controlScreen select {
            min-height: 42px;
            box-sizing: border-box;
        }
        #controlScreen #controlDeviceId {
            background: #ffffff !important;
            border: 1px solid var(--border) !important;
            border-radius: 12px !important;
            padding: 10px 12px !important;
            color: var(--accent) !important;
            font-size: 15px !important;
        }
        #controlScreen .control-threshold-card {
            border-radius: 18px !important;
            border-color: var(--border) !important;
            box-shadow: 0 12px 30px rgba(15, 118, 110, .07) !important;
        }
        #controlScreen .control-threshold-card > div:nth-child(2) {
            grid-template-columns: repeat(auto-fit, minmax(215px, 1fr)) !important;
            gap: 12px !important;
        }
        #controlScreen .control-threshold-card label {
            background: #f8fffd !important;
            border-color: var(--border) !important;
            border-radius: 14px !important;
            gap: 8px !important;
        }
        #controlScreen .control-threshold-input {
            width: 100% !important;
            min-height: 44px !important;
            background: #ffffff !important;
            border: 1px solid #99f6e4 !important;
            border-radius: 12px !important;
            padding: 9px 12px !important;
            color: var(--accent) !important;
            font-size: 17px !important;
            font-weight: 850 !important;
        }
        #controlScreen .manual-command-btn {
            min-height: 72px !important;
            background: #ecfeff !important;
            border-color: #99f6e4 !important;
            color: #0f766e !important;
            border-radius: 14px !important;
        }
        #controlScreen #controlSyncBtn,
        #controlScreen #controlSaveBtn {
            background: #0f766e !important;
            box-shadow: 0 12px 26px rgba(15, 118, 110, .18);
        }
        #controlScreen #controlLoadBtn,
        #controlScreen #refreshCommandBtn {
            background: #ffffff !important;
            border-color: var(--border) !important;
        }
        @media (max-width: 560px) {
            #controlScreen .control-threshold-card > div:nth-child(2) {
                grid-template-columns: 1fr !important;
            }
        }
    `,document.head.appendChild(e)}function A(){var e,n,t,o,r,a,i;(e=document.getElementById("controlBackBtn"))==null||e.addEventListener("click",()=>F("dash-c")),(n=document.getElementById("controlSaveBtn"))==null||n.addEventListener("click",P),(t=document.getElementById("controlSyncBtn"))==null||t.addEventListener("click",N),(o=document.getElementById("controlLoadBtn"))==null||o.addEventListener("click",()=>$(!0)),(r=document.getElementById("refreshCommandBtn"))==null||r.addEventListener("click",()=>T(!0)),(a=document.getElementById("emergencyStopBtn"))==null||a.addEventListener("click",()=>k("NO_ACTION","Emergency stop from dashboard")),document.querySelectorAll(".manual-command-btn").forEach(s=>{s.addEventListener("click",()=>k(s.dataset.command,`${s.dataset.label} manual override from dashboard`))}),document.querySelectorAll(".control-threshold-input").forEach(s=>{s.addEventListener("input",y)}),(i=document.getElementById("controlDeviceId"))==null||i.addEventListener("input",y),y()}async function T(e){const n=f("controlDeviceId")||"farm_001";try{const t=await fetch(`${x}/api/sensors/command?deviceId=${encodeURIComponent(n)}`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const o=await t.json();E(o),e&&c("success","Command status refreshed")}catch(t){l("latestCommandText","Unavailable"),l("latestCommandReason","Could not load pending command."),e&&c("warning",`Command status unavailable: ${t.message}`)}}function E(e){if(!e){l("latestCommandText","NO_ACTION"),l("latestCommandReason","No pending command.");return}const n=e.executed?"Executed":"Pending";l("latestCommandText",`${e.command||"NO_ACTION"} · ${n}`),l("latestCommandReason",e.reason||"No reason provided.")}async function k(e,n){const t=f("controlDeviceId")||"farm_001",o=e==="NO_ACTION";try{const r=await fetch(`${x}/api/sensors/command`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:t,command:e,reason:n,durationSeconds:0})}),a=await r.json();if(!r.ok||a.ok===!1)throw new Error(a.error||`HTTP ${r.status}`);E(a.command),c("success",o?"Emergency stop queued for ESP32":`${e} queued for ESP32`)}catch(r){c("error",`Manual command failed: ${r.message}`)}}async function $(e){const n=f("controlDeviceId")||"farm_001";try{const t=await fetch(`${x}/api/sensors/preferences?deviceId=${encodeURIComponent(n)}`);if(!t.ok)throw new Error(`HTTP ${t.status}`);const o=await t.json();L(o),e&&c("success","Loaded current device settings")}catch(t){e&&c("warning",`Could not load device settings: ${t.message}`),console.warn("[ControlPage] Load preferences failed:",t)}}function L(e){e&&(u("controlSoil",e.soilDryThreshold),l("soilVal",`${e.soilDryThreshold??f("controlSoil")} raw`),u("controlGas",e.gasDangerThreshold),l("gasVal",`${e.gasDangerThreshold??f("controlGas")} raw`),u("controlTempMin",e.tempMin),u("controlTempMax",e.tempMax),u("controlPhMin",e.phMin),u("controlPhMax",e.phMax),u("controlLight",e.darkThreshold),l("lightVal",`${e.darkThreshold??f("controlLight")} raw`),u("controlWaterDur",e.wateringDurationSeconds),l("waterDurVal",`${e.wateringDurationSeconds??f("controlWaterDur")}s`),y())}function P(){const e=w(),n=y(),t={...b(),...S(p.currentFarmId)||{},...e};D(t,p.currentFarmId),c(n.level==="danger"?"warning":"success",n.level==="danger"?"Saved locally, but AI recommends adjusting risky thresholds.":"Control thresholds saved locally")}async function N(){const e=w();y().level==="danger"&&c("warning","AI warning: thresholds are risky. Review the recommendation before syncing.");const t=document.getElementById("controlSyncIcon"),o=document.getElementById("controlSyncBtn");o.disabled=!0,t.textContent="⏳",D({...b(),...S(p.currentFarmId)||{},...e},p.currentFarmId);const r={deviceId:e.deviceId,...e,byScope:void 0};try{const a=await fetch(`${x}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!a.ok)throw new Error(`HTTP ${a.status}`);t.textContent="✅",c("success","Thresholds synced. ESP32 will use them next cycle.")}catch(a){t.textContent="⚠️",c("error",`Sync failed: ${a.message}. Saved locally.`),console.warn("[ControlPage] Sync failed:",a)}finally{setTimeout(()=>{t.textContent="☁️",o.disabled=!1},2e3)}}function w(){const e={deviceId:f("controlDeviceId")||"farm_001"};return document.querySelectorAll(".control-threshold-input").forEach(n=>{const t=n.dataset.key,o=n.dataset.scope||"zone",r=n.dataset.zone||o,a=Number(n.value);!t||!Number.isFinite(a)||(e[t]=a,e.byScope||(e.byScope={}),e.byScope[r]||(e.byScope[r]={}),e.byScope[r][t]=a)}),e.lightThreshold=e.darkThreshold??1500,e.wateringDuration=e.wateringDurationSeconds??10,e}function y(){const e=w(),n=H(e),t=n.some(g=>g.level==="danger")?"danger":n.some(g=>g.level==="warning")?"warning":"safe",o=document.getElementById("controlAiRecommendation"),r=document.getElementById("controlAiIcon"),a=document.getElementById("controlAiTitle"),i=document.getElementById("controlAiSummary"),s=document.getElementById("controlAiList");if(!o||!r||!a||!i||!s)return{level:t,findings:n};const h={safe:{border:"var(--accent)",bg:"#F8FAFC",iconBg:"var(--accent-l)",color:"var(--accent)",icon:"AI",title:"AI Threshold Check"},warning:{border:"#D97706",bg:"#FFFBEB",iconBg:"#FEF3C7",color:"#B45309",icon:"!",title:"AI Recommendation"},danger:{border:"var(--danger)",bg:"#FEF2F2",iconBg:"#FEE2E2",color:"var(--danger)",icon:"!!",title:"AI Safety Warning"}}[t];return o.style.borderLeftColor=h.border,o.style.background=h.bg,r.style.background=h.iconBg,r.style.color=h.color,r.textContent=h.icon,a.textContent=h.title,a.style.color=h.color,n.length?(i.textContent=t==="danger"?"Some settings can delay emergency actions or make automation unstable.":"AI found settings that may cause false alarms or inefficient device response.",s.style.display="flex",s.innerHTML=n.slice(0,4).map(g=>`
        <div style="display:flex;gap:7px;align-items:flex-start;font-size:11px;line-height:1.35;color:${g.level==="danger"?"var(--danger)":"#92400E"};font-weight:800;">
            <span>${g.level==="danger"?"!":"-"}</span>
            <span>${m(g.message)}</span>
        </div>
    `).join(""),{level:t,findings:n}):(i.textContent="Settings look safe for commercial automation.",s.style.display="none",s.innerHTML="",{level:t,findings:n})}function H(e){const n=[],t=(o,r)=>n.push({level:o,message:r});return e.deviceId.trim()||t("danger","Device ID is empty, so ESP32 preferences cannot sync correctly."),e.tempMin!==void 0&&e.tempMax!==void 0&&e.tempMin>=e.tempMax?t("danger","Temperature min must be lower than max. Recommended range: 18C to 35C."):(e.tempMin!==void 0&&e.tempMin<10&&t("warning","Temperature min is very low; cold stress may be ignored too long. Consider 18C."),e.tempMax!==void 0&&e.tempMax>42&&t("danger","Temperature max is too high; buzzer/fan may react too late. Keep it near 35C."),e.tempMin!==void 0&&e.tempMax!==void 0&&e.tempMax-e.tempMin<5&&t("warning","Temperature range is too narrow and may create frequent false alerts."),e.tempMin!==void 0&&e.tempMax!==void 0&&e.tempMax-e.tempMin>25&&t("warning","Temperature range is too wide and may miss crop stress.")),e.phMin!==void 0&&e.phMax!==void 0&&e.phMin>=e.phMax?t("danger","pH min must be lower than pH max. Recommended range: 5.5 to 6.5."):(e.phMin!==void 0&&e.phMin<4.8&&t("warning","pH min is too acidic for most crops. Consider 5.5."),e.phMax!==void 0&&e.phMax>7.2&&t("warning","pH max is too alkaline for nutrient uptake. Consider 6.5."),e.phMin!==void 0&&e.phMax!==void 0&&e.phMax-e.phMin>1.8&&t("warning","pH range is too wide; nutrient issues may be detected late.")),e.gasDangerThreshold!==void 0&&e.gasDangerThreshold>3300&&t("danger","Gas danger threshold is very high; emergency buzzer may trigger too late. Consider 3000 or lower."),e.gasDangerThreshold!==void 0&&e.gasDangerThreshold<900&&t("warning","Gas danger threshold is very sensitive and may cause frequent buzzer alerts."),e.soilDryThreshold!==void 0&&e.soilDryThreshold<900&&t("warning","Soil threshold is very low; watering may wait until plants are too dry."),e.soilDryThreshold!==void 0&&e.soilDryThreshold>3e3&&t("warning","Soil threshold is very high; pump may run too often and waste water."),e.darkThreshold!==void 0&&e.darkThreshold<700&&t("warning","Light threshold is very low; plants may stay under-lit before action triggers."),e.darkThreshold!==void 0&&e.darkThreshold>3200&&t("warning","Light threshold is very high; LED grow light may trigger too often and waste energy."),e.wateringDurationSeconds!==void 0&&e.wateringDurationSeconds>30&&t("warning","Pump duration is long; risk of overwatering. Try 8-15 seconds first."),e.wateringDurationSeconds!==void 0&&e.wateringDurationSeconds<4&&t("warning","Pump duration is very short; pump may not deliver enough water."),e.co2MaxPpm!==void 0&&e.co2MinPpm!==void 0&&e.co2MinPpm>=e.co2MaxPpm&&t("danger","CO2 min must be lower than CO2 max."),e.energyDailyLimitKwh!==void 0&&e.energyDailyLimitKwh>80&&t("warning","Energy limit is very high; Eco Save analysis may become meaningless."),e.cameraScanIntervalMinutes!==void 0&&e.cameraScanIntervalMinutes>1440&&t("warning","Camera scan interval is longer than one day; disease detection may be late."),n}function v(e,n,t){return`
        <button class="manual-command-btn" data-command="${e}" data-label="${t}" style="background:var(--accent-l);border:1px solid var(--accent);border-radius:14px;padding:12px 6px;text-align:center;cursor:pointer;color:var(--accent);font-weight:900;">
            <div style="font-size:24px;line-height:1;">${n}</div>
            <div style="font-size:11px;margin-top:6px;">${t}</div>
        </button>`}function C({id:e,title:n,subtitle:t,scope:o,thresholds:r}){const a=String(e||o||"threshold").replace(/[^a-zA-Z0-9_-]/g,"_"),i=o==="farm";return`
        <div class="control-threshold-card" data-threshold-scope="${d(o)}" data-threshold-id="${d(a)}" style="background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:16px;box-shadow:var(--shadow-sm);">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                <div style="min-width:0;">
                    <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;">${i?"Farm level threshold":"Zone level threshold"}</div>
                    <div style="font-size:17px;font-weight:900;color:var(--text);margin-top:3px;">${m(n)}</div>
                    <div style="font-size:12px;color:var(--sub);line-height:1.35;margin-top:3px;">${m(t)}</div>
                </div>
                <span style="background:${i?"#ECFDF5":"#EFF6FF"};color:${i?"var(--accent)":"#2563EB"};border-radius:999px;padding:7px 10px;font-size:10px;font-weight:900;text-transform:uppercase;white-space:nowrap;">${i?"shared":"per zone"}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;">
                ${O(o,a,r)}
            </div>
            <div style="margin-top:12px;background:#F8FAFC;border:1px solid var(--border);border-radius:14px;padding:11px 12px;color:var(--sub);font-size:12px;line-height:1.45;">
                <b style="color:var(--text);">AI reason:</b> ${m(Z(o,n,r))}
            </div>
        </div>
    `}function O(e,n,t){return(e==="farm"?_():j()).map(r=>R(r,e,n,t)).join("")}function R(e,n,t,o){const r=(o==null?void 0:o[e.key])??e.default;return`
        <label style="display:flex;flex-direction:column;gap:6px;background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:11px 12px;min-width:0;">
            <span style="font-size:10px;font-weight:900;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;">${m(e.label)}</span>
            <input class="control-threshold-input" data-key="${d(e.key)}" data-scope="${d(n)}" data-zone="${d(t)}" type="number" value="${d(r)}" min="${d(e.min)}" max="${d(e.max)}" step="${d(e.step)}" style="border:none;background:transparent;outline:none;color:var(--accent);font-size:18px;font-weight:900;font-family:'DM Mono',monospace;width:100%;">
            <span style="font-size:11px;color:var(--sub);line-height:1.3;">${m(e.unit)} · ${m(e.hint)}</span>
        </label>
    `}function _(){return[{key:"co2MinPpm",label:"CO2 minimum",default:700,min:300,max:1500,step:10,unit:"ppm",hint:"farm air baseline"},{key:"co2MaxPpm",label:"CO2 maximum",default:1200,min:600,max:2500,step:10,unit:"ppm",hint:"upper ventilation guard"},{key:"waterLowCm",label:"Reservoir low",default:18,min:1,max:80,step:1,unit:"cm",hint:"HC-SR04 refill alert"},{key:"waterCriticalCm",label:"Reservoir critical",default:6,min:1,max:40,step:1,unit:"cm",hint:"emergency pump lockout"},{key:"gasDangerThreshold",label:"MQ-2 danger",default:2500,min:500,max:4095,step:50,unit:"raw",hint:"safety buzzer threshold"},{key:"energyDailyLimitKwh",label:"Power limit",default:8,min:1,max:120,step:.5,unit:"kWh/day",hint:"energy budget"},{key:"fanDurationSeconds",label:"Main fan duration",default:20,min:3,max:180,step:1,unit:"sec",hint:"facility ventilation output"},{key:"farmPollIntervalSeconds",label:"Farm poll interval",default:300,min:5,max:3600,step:5,unit:"sec",hint:"master node sync rate"}]}function j(){return[{key:"tempMin",label:"Temp minimum",default:18,min:0,max:35,step:.5,unit:"C",hint:"DHT11 lower guard"},{key:"tempMax",label:"Temp maximum",default:35,min:15,max:55,step:.5,unit:"C",hint:"fan or buzzer trigger"},{key:"humidityMin",label:"Humidity minimum",default:50,min:20,max:95,step:1,unit:"%",hint:"DHT11 humidity floor"},{key:"humidityMax",label:"Humidity maximum",default:85,min:40,max:100,step:1,unit:"%",hint:"mold prevention"},{key:"soilDryThreshold",label:"Soil dry",default:1800,min:200,max:4095,step:50,unit:"raw",hint:"water pump trigger"},{key:"darkThreshold",label:"LDR dark",default:1500,min:100,max:4095,step:50,unit:"raw",hint:"grow light trigger"},{key:"phMin",label:"pH minimum",default:5.5,min:3,max:8,step:.1,unit:"pH",hint:"acidic warning"},{key:"phMax",label:"pH maximum",default:6.5,min:4,max:9,step:.1,unit:"pH",hint:"alkaline warning"},{key:"ecMin",label:"EC minimum",default:1.2,min:0,max:4,step:.1,unit:"mS/cm",hint:"fertilizer low alert"},{key:"ecMax",label:"EC maximum",default:2.2,min:.5,max:6,step:.1,unit:"mS/cm",hint:"fertilizer excess alert"},{key:"flowMinLpm",label:"Flow minimum",default:.3,min:0,max:5,step:.1,unit:"L/min",hint:"YF-S201 pump health"},{key:"wateringDurationSeconds",label:"Pump duration",default:10,min:1,max:90,step:1,unit:"sec",hint:"irrigation output"},{key:"growLightDurationMinutes",label:"Grow light pulse",default:20,min:1,max:240,step:1,unit:"min",hint:"LED output duration"},{key:"zoneFanDurationSeconds",label:"Zone fan duration",default:15,min:1,max:180,step:1,unit:"sec",hint:"zone airflow output"},{key:"cameraScanIntervalMinutes",label:"Camera scan",default:720,min:10,max:2880,step:10,unit:"min",hint:"disease analysis cadence"},{key:"diseaseConfidenceMin",label:"Disease confidence",default:70,min:30,max:99,step:1,unit:"%",hint:"AI asks questions below this"}]}function Z(e,n,t={}){if(e==="farm")return"Farm Master thresholds protect shared infrastructure first: CO2, reservoir level, gas safety, energy budget, main ventilation and emergency buzzer. These values are intentionally conservative because one farm-level failure can affect every zone.";const o=`${t.tempMin??18}-${t.tempMax??35}C`,r=`${t.phMin??5.5}-${t.phMax??6.5}`;return`${n} uses independent zone thresholds because each crop tray can have different temperature, root moisture, pH, EC, lighting and camera disease-risk needs. AI keeps the safe range around ${o}, pH ${r}, then lets operators tune pump, grow light and fan outputs without changing the whole farm.`}function q(e){var o;const n=((o=e==null?void 0:e.commercialStructure)==null?void 0:o.zones)||(e==null?void 0:e.zones)||[],t=Array.isArray(n)?n:[];return t.length?t.map((r,a)=>({id:r.id||r.zone_id||`zone_${String.fromCharCode(65+a)}`,label:r.name||r.label||`Zone ${String.fromCharCode(65+a)}`,crop:r.crop||(Array.isArray(r.plants)?r.plants.join(", "):"")||"Mixed crops",thresholds:r.thresholds||r.aiThresholds||{}})):["A","B","C"].map(r=>({id:`zone_${r}`,label:`Zone ${r}`,crop:"Mixed crops",thresholds:{}}))}function U(){const e=J();return p.currentFarm||e.find(n=>n.id===p.currentFarmId)||e[e.length-1]||null}function J(){try{return JSON.parse(localStorage.getItem(z))||[]}catch{return[]}}function S(e){try{if(e){const t=localStorage.getItem(M(e));if(t)return JSON.parse(t)}const n=localStorage.getItem(I);return n?JSON.parse(n):null}catch{return null}}function D(e,n){try{n&&localStorage.setItem(M(n),JSON.stringify(e)),localStorage.setItem(I,JSON.stringify({name:e.name,email:e.email}))}catch{}}function u(e,n){const t=document.getElementById(e);t&&n!==void 0&&n!==null&&(t.value=n)}function l(e,n){const t=document.getElementById(e);t&&(t.textContent=n)}function f(e){var n;return((n=document.getElementById(e))==null?void 0:n.value)??""}function m(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function d(e){return m(e).replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{V as render};
