import{A as p,s as H,a as m,d as C}from"./index-Bza452zz.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const F="farm_profile",Z="user_farms",S=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,B="seeddown_ai_mascot_enabled",j={zone_A:"commercial-zone-node-1",zone_B:"commercial-zone-node-2",zone_C:"commercial-zone-node-3",zone_D:"commercial-zone-node-4",zone_E:"commercial-zone-node-5",zone_F:"commercial-zone-node-6"},W=["WATER_ON","FAN_ON","BUZZER_ON","GAS_ALERT","PH_WARNING","FERT_ALERT","CO2_LOW","NO_ACTION"];function _(e){return`farm_profile_${e}`}function U(){return localStorage.getItem(B)!=="false"}function w(){return{name:"UTM Farmer",email:"farmer@seeddown.com",farmName:p.farmName||"Commercial Farm",deviceId:"farm_001",sensorIntervalMinutes:60,soilDryThreshold:1800,gasDangerThreshold:2500,tempMin:18,tempMax:35,phMin:5.5,phMax:6.5,lightThreshold:1500,wateringDuration:10,notifications:!0,autoWater:!0,ecoMode:!1}}function ce(){const e=document.getElementById("screenContainer"),t=$(),n={...w(),...I(p.currentFarmId)||{}},o=ae(t),r={...(t==null?void 0:t.farmThresholds)||{},...n};e.innerHTML=`
        <div class="screen active" id="controlScreen">
            <div class="topbar">
                <button id="controlBackBtn" style="background:transparent;border:none;font-size:20px;cursor:pointer;color:var(--text);">←</button>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">IoT Control</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.06em;">${g((t==null?void 0:t.name)||p.farmName||"Commercial Farm")}</div>
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
                        <input id="controlDeviceId" value="${c(n.deviceId)}" style="width:100%;border:none;background:transparent;color:var(--text);font-weight:800;outline:none;font-family:'DM Mono',monospace;">
                    </div>
                    <label style="margin-top:10px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#f8fffd;border:1px solid var(--border);border-radius:12px;padding:11px 12px;cursor:pointer;">
                        <span>
                            <b style="display:block;color:var(--text);font-size:13px;">SeedDown AI mascot</b>
                            <small style="display:block;color:var(--sub);font-size:11px;margin-top:2px;">Show the 3D guide on Commercial Digital Twin</small>
                        </span>
                        <input id="controlMascotToggle" type="checkbox" ${U()?"checked":""} style="width:18px;height:18px;accent-color:var(--accent);">
                    </label>
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

                ${A({id:"farm_master",title:"Farm Master Node",subtitle:"Farm-level shared sensors and outputs",scope:"farm",thresholds:r})}

                ${o.map(a=>A({id:a.id,title:a.label,subtitle:`${a.crop||"Mixed crops"} · zone-level sensor and output recipe`,scope:"zone",thresholds:a.thresholds||{}})).join("")}

                ${X(o,t,n)}

                <button id="controlSyncBtn" style="width:100%;padding:14px;border:none;border-radius:var(--radius);background:var(--accent);color:white;flex-shrink:0;font-weight:800;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span id="controlSyncIcon">☁️</span> Sync Thresholds to IoT
                </button>

                <button id="controlLoadBtn" style="width:100%;padding:13px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--accent);font-weight:800;cursor:pointer;">Load Current Device Settings</button>

                <div style="height:10px;"></div>
            </div>
        </div>
    `,G(),q(),R(!1),L(!1)}function G(){if(document.getElementById("control-polish-style"))return;const e=document.createElement("style");e.id="control-polish-style",e.textContent=`
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
        #controlScreen .manual-field {
            display:flex;
            flex-direction:column;
            gap:6px;
            background:#f8fffd;
            border:1px solid var(--border);
            border-radius:14px;
            padding:10px;
        }
        #controlScreen .manual-field span {
            color:var(--muted);
            font-size:10px;
            font-weight:950;
            text-transform:uppercase;
            letter-spacing:.06em;
        }
        #controlScreen .manual-field input,
        #controlScreen .manual-field select {
            width:100%;
            border:1px solid #99f6e4;
            border-radius:12px;
            background:#fff;
            color:var(--text);
            padding:9px 10px;
            font-weight:850;
            outline:none;
            min-width:0;
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
    `,document.head.appendChild(e)}function q(){var e,t,n,o,r,a,i,u,l,d,D;(e=document.getElementById("controlBackBtn"))==null||e.addEventListener("click",()=>H("dash-c")),(t=document.getElementById("controlSaveBtn"))==null||t.addEventListener("click",J),(n=document.getElementById("controlSyncBtn"))==null||n.addEventListener("click",Y),(o=document.getElementById("controlLoadBtn"))==null||o.addEventListener("click",()=>R(!0)),(r=document.getElementById("refreshCommandBtn"))==null||r.addEventListener("click",()=>L(!0)),(a=document.getElementById("emergencyStopBtn"))==null||a.addEventListener("click",()=>k("NO_ACTION","Emergency stop from dashboard")),(i=document.getElementById("manualSendBtn"))==null||i.addEventListener("click",()=>k()),(u=document.getElementById("manualScope"))==null||u.addEventListener("change",M),(l=document.getElementById("manualZone"))==null||l.addEventListener("change",M),M(),document.querySelectorAll(".manual-command-btn").forEach(h=>{h.addEventListener("click",()=>{const y=document.getElementById("manualCommand");y&&(y.value=h.dataset.command),k(h.dataset.command,`${h.dataset.label} manual override from dashboard`)})}),document.querySelectorAll(".control-threshold-input").forEach(h=>{h.addEventListener("input",b)}),(d=document.getElementById("controlDeviceId"))==null||d.addEventListener("input",b),(D=document.getElementById("controlMascotToggle"))==null||D.addEventListener("change",h=>{const y=!!h.target.checked;localStorage.setItem(B,y?"true":"false"),window.dispatchEvent(new CustomEvent("seeddown:mascotVisibility",{detail:{enabled:y}})),m("success",y?"SeedDown AI mascot enabled":"SeedDown AI mascot hidden")}),b()}async function L(e){const t=s("manualDeviceId")||s("controlDeviceId")||"farm_001";try{const n=await fetch(`${S}/api/sensors/command?deviceId=${encodeURIComponent(t)}`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const o=await n.json();O(o),e&&m("success","Command status refreshed")}catch(n){f("latestCommandText","Unavailable"),f("latestCommandReason","Could not load pending command."),e&&m("warning",`Command status unavailable: ${n.message}`)}}function O(e){if(!e){f("latestCommandText","NO_ACTION"),f("latestCommandReason","No pending command.");return}const t=e.executed?"Executed":"Pending";f("latestCommandText",`${e.command||"NO_ACTION"} · ${t}`),f("latestCommandReason",e.reason||"No reason provided.")}async function k(e="",t=""){const n=K(),o=e||s("manualCommand")||"NO_ACTION",r=t||s("manualReason")||`${o} manual override from Control page`,a=Math.max(0,Number(s("manualDuration"))||0),i=n.deviceId||s("controlDeviceId")||"farm_001",u=o==="NO_ACTION";try{const l=await fetch(`${S}/api/sensors/command`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:i,command:o,reason:r,durationSeconds:a,scope:n.scope,zoneId:n.zoneId||void 0,targetId:n.zoneId||n.scope})}),d=await l.json();if(!l.ok||d.ok===!1)throw new Error(d.error||`HTTP ${l.status}`);O(d.command),m("success",u?"Emergency stop queued for ESP32":`${o} queued for ${n.label}`)}catch(l){m("error",`Manual command failed: ${l.message}`)}}function M(){const e=s("manualScope")||"farm",t=$(),n={...w(),...I(p.currentFarmId)||{}},o=document.getElementById("manualZoneWrap"),r=document.getElementById("manualDeviceId");o&&(o.style.display=e==="zone"?"flex":"none"),r&&(r.value=e==="zone"?N(t,s("manualZone")||"zone_A"):E(t,n))}function K(){const e=$(),t={...w(),...I(p.currentFarmId)||{}};if((s("manualScope")||"farm")==="zone"){const o=T(s("manualZone")||"zone_A");return{scope:"zone",zoneId:o,label:o.replace("_"," "),deviceId:s("manualDeviceId")||N(e,o)}}return{scope:"farm",zoneId:"",label:"Farm Level",deviceId:s("manualDeviceId")||E(e,t)}}function E(e,t={}){var n;return((n=e==null?void 0:e.farmMaster)==null?void 0:n.deviceId)||(e==null?void 0:e.deviceId)||t.deviceId||"farm_001"}function N(e,t){const n=T(t),r=(Array.isArray(e==null?void 0:e.commercialDevices)?e.commercialDevices:[]).find(a=>(a==null?void 0:a.active)!==!1&&(a==null?void 0:a.status)!=="replaced"&&T(a.targetId||a.zoneId||a.zone)===n);return(r==null?void 0:r.deviceId)||j[n]||n||"farm_001"}function T(e){const t=String(e||"").trim().toLowerCase();if(!t)return"";const n=t.match(/^zone[_ ]?([a-z])$/)||t.match(/^([a-z])$/);return n?`zone_${n[1].toUpperCase()}`:t.startsWith("zone_")?`zone_${t.slice(5).toUpperCase()}`:t}async function R(e){const t=s("controlDeviceId")||"farm_001";try{const n=await fetch(`${S}/api/sensors/preferences?deviceId=${encodeURIComponent(t)}`);if(!n.ok)throw new Error(`HTTP ${n.status}`);const o=await n.json();V(o),e&&m("success","Loaded current device settings")}catch(n){e&&m("warning",`Could not load device settings: ${n.message}`),console.warn("[ControlPage] Load preferences failed:",n)}}function V(e){e&&(x("controlSoil",e.soilDryThreshold),f("soilVal",`${e.soilDryThreshold??s("controlSoil")} raw`),x("controlGas",e.gasDangerThreshold),f("gasVal",`${e.gasDangerThreshold??s("controlGas")} raw`),x("controlTempMin",e.tempMin),x("controlTempMax",e.tempMax),x("controlPhMin",e.phMin),x("controlPhMax",e.phMax),x("controlLight",e.darkThreshold),f("lightVal",`${e.darkThreshold??s("controlLight")} raw`),x("controlWaterDur",e.wateringDurationSeconds),f("waterDurVal",`${e.wateringDurationSeconds??s("controlWaterDur")}s`),b())}function J(){const e=z(),t=b(),n={...w(),...I(p.currentFarmId)||{},...e};P(n,p.currentFarmId),m(t.level==="danger"?"warning":"success",t.level==="danger"?"Saved locally, but AI recommends adjusting risky thresholds.":"Control thresholds saved locally")}async function Y(){const e=z();b().level==="danger"&&m("warning","AI warning: thresholds are risky. Review the recommendation before syncing.");const n=document.getElementById("controlSyncIcon"),o=document.getElementById("controlSyncBtn");o.disabled=!0,n.textContent="⏳",P({...w(),...I(p.currentFarmId)||{},...e},p.currentFarmId);const r={deviceId:e.deviceId,...e,byScope:void 0};try{const a=await fetch(`${S}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!a.ok)throw new Error(`HTTP ${a.status}`);n.textContent="✅",m("success","Thresholds synced. ESP32 will use them next cycle.")}catch(a){n.textContent="⚠️",m("error",`Sync failed: ${a.message}. Saved locally.`),console.warn("[ControlPage] Sync failed:",a)}finally{setTimeout(()=>{n.textContent="☁️",o.disabled=!1},2e3)}}function z(){const e={deviceId:s("controlDeviceId")||"farm_001"};return document.querySelectorAll(".control-threshold-input").forEach(t=>{const n=t.dataset.key,o=t.dataset.scope||"zone",r=t.dataset.zone||o,a=Number(t.value);!n||!Number.isFinite(a)||(e[n]=a,e.byScope||(e.byScope={}),e.byScope[r]||(e.byScope[r]={}),e.byScope[r][n]=a)}),e.lightThreshold=e.darkThreshold??1500,e.wateringDuration=e.wateringDurationSeconds??10,e}function b(){const e=z(),t=Q(e),n=t.some(d=>d.level==="danger")?"danger":t.some(d=>d.level==="warning")?"warning":"safe",o=document.getElementById("controlAiRecommendation"),r=document.getElementById("controlAiIcon"),a=document.getElementById("controlAiTitle"),i=document.getElementById("controlAiSummary"),u=document.getElementById("controlAiList");if(!o||!r||!a||!i||!u)return{level:n,findings:t};const l={safe:{border:"var(--accent)",bg:"#F8FAFC",iconBg:"var(--accent-l)",color:"var(--accent)",icon:"AI",title:"AI Threshold Check"},warning:{border:"#D97706",bg:"#FFFBEB",iconBg:"#FEF3C7",color:"#B45309",icon:"!",title:"AI Recommendation"},danger:{border:"var(--danger)",bg:"#FEF2F2",iconBg:"#FEE2E2",color:"var(--danger)",icon:"!!",title:"AI Safety Warning"}}[n];return o.style.borderLeftColor=l.border,o.style.background=l.bg,r.style.background=l.iconBg,r.style.color=l.color,r.textContent=l.icon,a.textContent=l.title,a.style.color=l.color,t.length?(i.textContent=C(n==="danger"?"Some settings can delay emergency actions or make automation unstable.":"AI found settings that may cause false alarms or inefficient device response.",130),u.style.display="flex",u.innerHTML=t.slice(0,4).map(d=>`
        <div style="display:flex;gap:7px;align-items:flex-start;font-size:11px;line-height:1.35;color:${d.level==="danger"?"var(--danger)":"#92400E"};font-weight:800;">
            <span>${d.level==="danger"?"!":"-"}</span>
            <span>${g(C(d.message,110))}</span>
        </div>
    `).join(""),{level:n,findings:t}):(i.textContent=C("Settings look safe for commercial automation.",130),u.style.display="none",u.innerHTML="",{level:n,findings:t})}function Q(e){const t=[],n=(o,r)=>t.push({level:o,message:r});return e.deviceId.trim()||n("danger","Device ID is empty, so ESP32 preferences cannot sync correctly."),e.tempMin!==void 0&&e.tempMax!==void 0&&e.tempMin>=e.tempMax?n("danger","Temperature min must be lower than max. Recommended range: 18C to 35C."):(e.tempMin!==void 0&&e.tempMin<10&&n("warning","Temperature min is very low; cold stress may be ignored too long. Consider 18C."),e.tempMax!==void 0&&e.tempMax>42&&n("danger","Temperature max is too high; buzzer/fan may react too late. Keep it near 35C."),e.tempMin!==void 0&&e.tempMax!==void 0&&e.tempMax-e.tempMin<5&&n("warning","Temperature range is too narrow and may create frequent false alerts."),e.tempMin!==void 0&&e.tempMax!==void 0&&e.tempMax-e.tempMin>25&&n("warning","Temperature range is too wide and may miss crop stress.")),e.phMin!==void 0&&e.phMax!==void 0&&e.phMin>=e.phMax?n("danger","pH min must be lower than pH max. Recommended range: 5.5 to 6.5."):(e.phMin!==void 0&&e.phMin<4.8&&n("warning","pH min is too acidic for most crops. Consider 5.5."),e.phMax!==void 0&&e.phMax>7.2&&n("warning","pH max is too alkaline for nutrient uptake. Consider 6.5."),e.phMin!==void 0&&e.phMax!==void 0&&e.phMax-e.phMin>1.8&&n("warning","pH range is too wide; nutrient issues may be detected late.")),e.gasDangerThreshold!==void 0&&e.gasDangerThreshold>3300&&n("danger","Gas danger threshold is very high; emergency buzzer may trigger too late. Consider 3000 or lower."),e.gasDangerThreshold!==void 0&&e.gasDangerThreshold<900&&n("warning","Gas danger threshold is very sensitive and may cause frequent buzzer alerts."),e.soilDryThreshold!==void 0&&e.soilDryThreshold<900&&n("warning","Soil threshold is very low; watering may wait until plants are too dry."),e.soilDryThreshold!==void 0&&e.soilDryThreshold>3e3&&n("warning","Soil threshold is very high; pump may run too often and waste water."),e.darkThreshold!==void 0&&e.darkThreshold<700&&n("warning","Light threshold is very low; plants may stay under-lit before action triggers."),e.darkThreshold!==void 0&&e.darkThreshold>3200&&n("warning","Light threshold is very high; LED grow light may trigger too often and waste energy."),e.wateringDurationSeconds!==void 0&&e.wateringDurationSeconds>30&&n("warning","Pump duration is long; risk of overwatering. Try 8-15 seconds first."),e.wateringDurationSeconds!==void 0&&e.wateringDurationSeconds<4&&n("warning","Pump duration is very short; pump may not deliver enough water."),e.co2MaxPpm!==void 0&&e.co2MinPpm!==void 0&&e.co2MinPpm>=e.co2MaxPpm&&n("danger","CO2 min must be lower than CO2 max."),e.energyDailyLimitKwh!==void 0&&e.energyDailyLimitKwh>80&&n("warning","Energy limit is very high; Eco Save analysis may become meaningless."),e.cameraScanIntervalMinutes!==void 0&&e.cameraScanIntervalMinutes>1440&&n("warning","Camera scan interval is longer than one day; disease detection may be late."),t}function v(e,t,n){return`
        <button class="manual-command-btn" data-command="${e}" data-label="${n}" style="background:var(--accent-l);border:1px solid var(--accent);border-radius:14px;padding:12px 6px;text-align:center;cursor:pointer;color:var(--accent);font-weight:900;">
            <div style="font-size:24px;line-height:1;">${t}</div>
            <div style="font-size:11px;margin-top:6px;">${n}</div>
        </button>`}function X(e,t,n){var a;const o=((a=e[0])==null?void 0:a.id)||"zone_A",r=E(t,n);return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow-sm);">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:12px;">
                <div>
                    <div style="font-size:0.6rem;font-weight:900;color:var(--muted);letter-spacing:0.08em;">MANUAL OVERRIDE</div>
                    <div style="font-size:12px;color:var(--sub);font-weight:750;margin-top:3px;">Choose farm-level or zone-level control before sending a command.</div>
                </div>
                <button id="emergencyStopBtn" style="padding:9px 11px;border:none;border-radius:12px;background:var(--danger);color:white;font-weight:900;cursor:pointer;">Stop</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:10px;">
                <label class="manual-field"><span>Target scope</span><select id="manualScope"><option value="farm">Farm Level</option><option value="zone">Zone</option></select></label>
                <label class="manual-field" id="manualZoneWrap"><span>Zone</span><select id="manualZone">${e.map(i=>`<option value="${c(i.id)}">${g(i.label)}</option>`).join("")||`<option value="${c(o)}">Zone A</option>`}</select></label>
                <label class="manual-field"><span>Device ID</span><input id="manualDeviceId" value="${c(r)}"></label>
                <label class="manual-field"><span>Command</span><select id="manualCommand">${W.map(i=>`<option value="${i}">${i}</option>`).join("")}</select></label>
                <label class="manual-field"><span>Duration seconds</span><input id="manualDuration" type="number" min="0" max="600" step="1" value="10"></label>
                <label class="manual-field"><span>Reason</span><input id="manualReason" value="Operator manual override from Control page"></label>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:10px;">
                ${v("WATER_ON","💦","Water")}
                ${v("FAN_ON","🌀","Fan")}
                ${v("BUZZER_ON","🔔","Buzzer")}
                ${v("PH_WARNING","pH","pH Warn")}
                ${v("FERT_ALERT","NPK","Fert")}
                ${v("CO2_LOW","CO2","CO2")}
                ${v("GAS_ALERT","MQ","Gas")}
                ${v("NO_ACTION","×","Clear")}
            </div>
            <button id="manualSendBtn" style="width:100%;padding:13px;border:none;border-radius:var(--radius);background:var(--accent);color:white;font-weight:900;cursor:pointer;">Send Override</button>
        </div>`}function A({id:e,title:t,subtitle:n,scope:o,thresholds:r}){const a=String(e||o||"threshold").replace(/[^a-zA-Z0-9_-]/g,"_"),i=o==="farm";return`
        <div class="control-threshold-card" data-threshold-scope="${c(o)}" data-threshold-id="${c(a)}" style="background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:16px;box-shadow:var(--shadow-sm);">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                <div style="min-width:0;">
                    <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.06em;">${i?"Farm level threshold":"Zone level threshold"}</div>
                    <div style="font-size:17px;font-weight:900;color:var(--text);margin-top:3px;">${g(t)}</div>
                    <div style="font-size:12px;color:var(--sub);line-height:1.35;margin-top:3px;">${g(n)}</div>
                </div>
                <span style="background:${i?"#ECFDF5":"#EFF6FF"};color:${i?"var(--accent)":"#2563EB"};border-radius:999px;padding:7px 10px;font-size:10px;font-weight:900;text-transform:uppercase;white-space:nowrap;">${i?"shared":"per zone"}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;">
                ${ee(o,a,r)}
            </div>
            <div style="margin-top:12px;background:#F8FAFC;border:1px solid var(--border);border-radius:14px;padding:11px 12px;color:var(--sub);font-size:12px;line-height:1.45;">
                <b style="color:var(--text);">AI reason:</b> ${g(re(o,t,r))}
            </div>
        </div>
    `}function ee(e,t,n){return(e==="farm"?te():oe()).map(r=>ne(r,e,t,n)).join("")}function ne(e,t,n,o){const r=(o==null?void 0:o[e.key])??e.default;return`
        <label style="display:flex;flex-direction:column;gap:6px;background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:11px 12px;min-width:0;">
            <span style="font-size:10px;font-weight:900;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;">${g(e.label)}</span>
            <input class="control-threshold-input" data-key="${c(e.key)}" data-scope="${c(t)}" data-zone="${c(n)}" type="number" value="${c(r)}" min="${c(e.min)}" max="${c(e.max)}" step="${c(e.step)}" style="border:none;background:transparent;outline:none;color:var(--accent);font-size:18px;font-weight:900;font-family:'DM Mono',monospace;width:100%;">
            <span style="font-size:11px;color:var(--sub);line-height:1.3;">${g(e.unit)} · ${g(e.hint)}</span>
        </label>
    `}function te(){return[{key:"co2MinPpm",label:"CO2 minimum",default:700,min:300,max:1500,step:10,unit:"ppm",hint:"farm air baseline"},{key:"co2MaxPpm",label:"CO2 maximum",default:1200,min:600,max:2500,step:10,unit:"ppm",hint:"upper ventilation guard"},{key:"waterLowCm",label:"Reservoir low",default:18,min:1,max:80,step:1,unit:"cm",hint:"HC-SR04 refill alert"},{key:"waterCriticalCm",label:"Reservoir critical",default:6,min:1,max:40,step:1,unit:"cm",hint:"emergency pump lockout"},{key:"gasDangerThreshold",label:"MQ-2 danger",default:2500,min:500,max:4095,step:50,unit:"raw",hint:"safety buzzer threshold"},{key:"energyDailyLimitKwh",label:"Power limit",default:8,min:1,max:120,step:.5,unit:"kWh/day",hint:"energy budget"},{key:"fanDurationSeconds",label:"Main fan duration",default:20,min:3,max:180,step:1,unit:"sec",hint:"facility ventilation output"},{key:"farmPollIntervalSeconds",label:"Farm poll interval",default:300,min:5,max:3600,step:5,unit:"sec",hint:"master node sync rate"}]}function oe(){return[{key:"tempMin",label:"Temp minimum",default:18,min:0,max:35,step:.5,unit:"C",hint:"DHT11 lower guard"},{key:"tempMax",label:"Temp maximum",default:35,min:15,max:55,step:.5,unit:"C",hint:"fan or buzzer trigger"},{key:"humidityMin",label:"Humidity minimum",default:50,min:20,max:95,step:1,unit:"%",hint:"DHT11 humidity floor"},{key:"humidityMax",label:"Humidity maximum",default:85,min:40,max:100,step:1,unit:"%",hint:"mold prevention"},{key:"soilDryThreshold",label:"Soil dry",default:1800,min:200,max:4095,step:50,unit:"raw",hint:"water pump trigger"},{key:"darkThreshold",label:"LDR dark",default:1500,min:100,max:4095,step:50,unit:"raw",hint:"grow light trigger"},{key:"phMin",label:"pH minimum",default:5.5,min:3,max:8,step:.1,unit:"pH",hint:"acidic warning"},{key:"phMax",label:"pH maximum",default:6.5,min:4,max:9,step:.1,unit:"pH",hint:"alkaline warning"},{key:"ecMin",label:"EC minimum",default:1.2,min:0,max:4,step:.1,unit:"mS/cm",hint:"fertilizer low alert"},{key:"ecMax",label:"EC maximum",default:2.2,min:.5,max:6,step:.1,unit:"mS/cm",hint:"fertilizer excess alert"},{key:"flowMinLpm",label:"Flow minimum",default:.3,min:0,max:5,step:.1,unit:"L/min",hint:"YF-S201 pump health"},{key:"wateringDurationSeconds",label:"Pump duration",default:10,min:1,max:90,step:1,unit:"sec",hint:"irrigation output"},{key:"growLightDurationMinutes",label:"Grow light pulse",default:20,min:1,max:240,step:1,unit:"min",hint:"LED output duration"},{key:"zoneFanDurationSeconds",label:"Zone fan duration",default:15,min:1,max:180,step:1,unit:"sec",hint:"zone airflow output"},{key:"cameraScanIntervalMinutes",label:"Camera scan",default:720,min:10,max:2880,step:10,unit:"min",hint:"disease analysis cadence"},{key:"diseaseConfidenceMin",label:"Disease confidence",default:70,min:30,max:99,step:1,unit:"%",hint:"AI asks questions below this"}]}function re(e,t,n={}){if(e==="farm")return"Farm Master thresholds protect shared infrastructure first: CO2, reservoir level, gas safety, energy budget, main ventilation and emergency buzzer. These values are intentionally conservative because one farm-level failure can affect every zone.";const o=`${n.tempMin??18}-${n.tempMax??35}C`,r=`${n.phMin??5.5}-${n.phMax??6.5}`;return`${t} uses independent zone thresholds because each crop tray can have different temperature, root moisture, pH, EC, lighting and camera disease-risk needs. AI keeps the safe range around ${o}, pH ${r}, then lets operators tune pump, grow light and fan outputs without changing the whole farm.`}function ae(e){var o;const t=((o=e==null?void 0:e.commercialStructure)==null?void 0:o.zones)||(e==null?void 0:e.zones)||[],n=Array.isArray(t)?t:[];return n.length?n.map((r,a)=>({id:r.id||r.zone_id||`zone_${String.fromCharCode(65+a)}`,label:r.name||r.label||`Zone ${String.fromCharCode(65+a)}`,crop:r.crop||(Array.isArray(r.plants)?r.plants.join(", "):"")||"Mixed crops",thresholds:r.thresholds||r.aiThresholds||{}})):["A","B","C"].map(r=>({id:`zone_${r}`,label:`Zone ${r}`,crop:"Mixed crops",thresholds:{}}))}function $(){const e=ie();return p.currentFarm||e.find(t=>t.id===p.currentFarmId)||e[e.length-1]||null}function ie(){try{return JSON.parse(localStorage.getItem(Z))||[]}catch{return[]}}function I(e){try{if(e){const n=localStorage.getItem(_(e));if(n)return JSON.parse(n)}const t=localStorage.getItem(F);return t?JSON.parse(t):null}catch{return null}}function P(e,t){try{t&&localStorage.setItem(_(t),JSON.stringify(e)),localStorage.setItem(F,JSON.stringify({name:e.name,email:e.email}))}catch{}}function x(e,t){const n=document.getElementById(e);n&&t!==void 0&&t!==null&&(n.value=t)}function f(e,t){const n=document.getElementById(e);n&&(n.textContent=t)}function s(e){var t;return((t=document.getElementById(e))==null?void 0:t.value)??""}function g(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function c(e){return g(e).replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{ce as render};
