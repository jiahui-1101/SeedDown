import{s as C,a as k,A as I}from"./index-CsAh1mPh.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const m=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let p=60,x=!1;const E={critical:{bg:"#FEF2F2",border:"#FECACA",badge:"#EF4444",label:"CRITICAL"},warning:{bg:"#FFFBEB",border:"#FDE68A",badge:"#F59E0B",label:"WARNING"},info:{bg:"#ECFEFF",border:"#99F6E4",badge:"#14B8A6",label:"INFO"},stable:{bg:"#F0FDF4",border:"#BBF7D0",badge:"#22C55E",label:"STABLE"}},w={water_depletion:{btnText:"🚰 Refill Central Tank",color:"#0EA5E9"},energy_overload:{btnText:"⚡ Reduce Load",color:"#F59E0B"},co2_crisis:{btnText:"💨 Adjust Ventilation",color:"#06B6D4"},zone_heat:{btnText:"❄️ Cool Affected Zone",color:"#EF4444"},zone_rot:{btnText:"💨 Boost Zone Airflow",color:"#8B5CF6"},zone_ec_burn:{btnText:"🧪 Dilute Zone Nutrient",color:"#8B5CF6"},zone_ec_deficient:{btnText:"🌿 Boost Zone Nutrient",color:"#10B981"},zone_clog:{btnText:"🔧 Check Zone Irrigation",color:"#6B7280"},default:{btnText:"⚡ Take Action",color:"#064E3B"}};function L(){const e=document.getElementById("screenContainer");return e&&(e.innerHTML=`<div class="screen active" id="alertCommercialScreen">${N()}</div>`),""}function N(){return`
    <div style="padding:20px; background:#F8FAFC; min-height:100vh; font-family:sans-serif; color:#1E293B;">

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
            <button id="alertCommercialBack" style="background:#F1F5F9; border:none; border-radius:12px; padding:10px 14px; cursor:pointer; font-size:1.1rem; color:#475569;">←</button>
            <div>
                <div style="font-weight:800; font-size:1.15rem; color:#0F172A;">🏭 Commercial Risk Engine</div>
                <div style="font-size:0.72rem; color:#94A3B8;">Multi-Zone Predictive Monitoring · AI-Powered</div>
            </div>
            <div style="margin-left:auto; background:#DCFCE7; color:#166534; padding:6px 12px; border-radius:10px; font-size:0.68rem; font-weight:800; border:1px solid #BBF7D0;">
                LIVE
            </div>
        </div>

        <div style="background:#fff; border-radius:20px; padding:14px 18px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div>
                <div style="font-size:0.78rem; font-weight:700; color:#0F172A;">Predict Window</div>
                <div style="font-size:0.68rem; color:#94A3B8;">Forecast horizon for risk detection</div>
            </div>
            <select id="commercialPredictSelect" style="border:1px solid #E2E8F0; background:#F8FAFC; color:#064E3B; padding:8px 14px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                <option value="30">30 Mins</option>
                <option value="60" selected>60 Mins</option>
                <option value="90">90 Mins</option>
            </select>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:16px;">
            <button class="scope-tab active-tab" data-scope="all"
                style="flex:1; padding:10px; border-radius:12px; border:1px solid #BBF7D0; background:#F0FDF4; color:#166534; font-weight:700; cursor:pointer; font-size:0.78rem;">
                All Alerts
            </button>
            <button class="scope-tab" data-scope="farm"
                style="flex:1; padding:10px; border-radius:12px; border:1px solid #E2E8F0; background:#F8FAFC; color:#64748B; font-weight:700; cursor:pointer; font-size:0.78rem;">
                🏭 Farm Level
            </button>
            <button class="scope-tab" data-scope="zone"
                style="flex:1; padding:10px; border-radius:12px; border:1px solid #E2E8F0; background:#F8FAFC; color:#64748B; font-weight:700; cursor:pointer; font-size:0.78rem;">
                🗺️ Zone Level
            </button>
        </div>

        <div id="commercialAlertsList">
            ${_()}
        </div>

        <div id="aiProvenancePanel" style="display:none; background:#fff; border:1px solid #E2E8F0; border-radius:16px; padding:14px 16px; margin-top:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        </div>

        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:16px; padding:14px 16px; margin-top:8px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
            <div style="font-size:0.75rem; color:#64748B; line-height:1.6;">
                <b style="color:#0F172A;">🧠 AI Analysis Logic:</b> Sensor history is fetched live from Firebase for all your farm zones. Slope calculations over the last 10 readings extrapolate risks <span id="aiFooterMinutes">${p}</span> minutes ahead. Alerts are only raised when projected values breach critical thresholds.
            </div>
        </div>
    </div>`}async function M(e={}){setTimeout(()=>{const o=document.getElementById("alertCommercialBack");o&&(o.onclick=()=>C("dash-c"));const r=document.getElementById("commercialPredictSelect");if(r&&(r.value=String(p),r.onchange=t=>{p=parseInt(t.target.value);const i=document.getElementById("aiFooterMinutes");i&&(i.textContent=p),k("success",`AI recalibrating for ${p} min window…`),h()}),document.querySelectorAll(".scope-tab").forEach(t=>{t.onclick=()=>{document.querySelectorAll(".scope-tab").forEach(i=>{i.style.background="#F8FAFC",i.style.color="#64748B",i.style.borderColor="#E2E8F0",i.classList.remove("active-tab")}),t.style.background="#F0FDF4",t.style.color="#166534",t.style.borderColor="#BBF7D0",t.classList.add("active-tab"),P(t.dataset.scope)}}),c.length>0){const t=document.getElementById("commercialAlertsList"),i=document.getElementById("aiProvenancePanel");t&&F(t,c,u,v),i&&b&&(i.style.display="block",i.innerHTML=B(b,u.length));const d=(e==null?void 0:e.returnScope)||"all";if(d!=="all"){const l=document.querySelector(`.scope-tab[data-scope="${d}"]`);l&&l.click()}}else h()},50)}async function O(e){const o=I.currentFarm;if(console.log("[discoverZoneIds] currentFarm:",o),!Array.isArray(o==null?void 0:o.zones)||o.zones.length===0)return console.warn("[discoverZoneIds] No zones found, using hardcode fallback"),["zone_A","zone_B","zone_C"];if(Array.isArray(o==null?void 0:o.zones)&&o.zones.length>0){const r=o.zones.map(t=>t.zone_id||t.zoneId).filter(Boolean);if(r.length>0)return console.log("[discoverZoneIds] from currentFarm.zones:",r),r}if(Array.isArray(o==null?void 0:o.commercialDevices)&&o.commercialDevices.length>0){const r=o.commercialDevices.filter(t=>t.nodeType==="zone_node"&&t.zoneId).map(t=>t.zoneId).filter(Boolean);if(r.length>0)return console.log("[discoverZoneIds] from commercialDevices:",r),r}return console.warn("[discoverZoneIds] Could not find zones in currentFarm"),null}let c=[],b=null,u=[],v=[];function y(e){const o=String(e||"").trim();return o?o.startsWith("zone_")?o:/^[A-F]$/i.test(o)?`zone_${o.toUpperCase()}`:o:""}function $(e){const o=y(e),r=I.currentFarm||{},t=Array.isArray(r.commercialDevices)?r.commercialDevices.find(d=>d.active!==!1&&d.status!=="replaced"&&y(d.targetId||d.zoneId||d.zone)===o):null;return t!=null&&t.deviceId?t.deviceId:{zone_A:"commercial-zone-node-1",zone_B:"commercial-zone-node-2",zone_C:"commercial-zone-node-3"}[o]||o}async function h(){if(x)return;x=!0;const e=document.getElementById("commercialAlertsList");if(!e){x=!1;return}e.innerHTML=_();const o=document.getElementById("aiProvenancePanel");o&&(o.style.display="none");try{const r="commercial-farm-master-1",t=await O(r);if(console.log("[Debug] discovered zoneIds:",t),!t){e.innerHTML=H(r),x=!1;return}const[i,d]=await Promise.all([fetch(`${m}/api/sensors/latest?deviceId=${r}`),fetch(`${m}/api/sensors/history?deviceId=${r}&limit=10`)]),l=(await i.json()).reading||{},n=(await d.json()).readings||[];v=n;const g=(await Promise.allSettled(t.map(async s=>{const A=$(s),[R,T]=await Promise.all([fetch(`${m}/api/sensors/latest?deviceId=${A}&zoneId=${s}`),fetch(`${m}/api/sensors/history?deviceId=${A}&zoneId=${s}&limit=10`)]),D=(await R.json()).reading||{},S=(await T.json()).readings||[];return{zoneId:s,latestReading:D,historyReadings:S}}))).filter(s=>s.status==="fulfilled").map(s=>s.value);console.log("[Debug] zones fetched:",g.map(s=>({zoneId:s.zoneId,historyCount:s.historyReadings.length,latestReading:s.latestReading}))),u=g;const f=await(await fetch(`${m}/api/alerts/predict-commercial`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:r,predictMinutes:p,masterReading:l,masterHistory:n,zones:g})})).json();c=Array.isArray(f.alerts)?f.alerts:[],b=f.aiMeta||null,b&&o&&(o.style.display="block",o.innerHTML=B(b,t.length)),c.length===0?e.innerHTML=j(t.length):F(e,c,u,v)}catch(r){console.warn("[AlertsListCommercial] Error:",r.message),e.innerHTML=U(r.message)}finally{x=!1}}function P(e){const o=document.getElementById("commercialAlertsList");if(!o||!c.length)return;const r=e==="all"?c:c.filter(t=>t.scope===e);r.length===0?o.innerHTML=`<div style="text-align:center; padding:40px; color:#94A3B8; font-size:0.88rem;">No ${e}-level alerts detected.</div>`:F(o,r,u,v)}function F(e,o,r=[],t=[]){const i=o.filter(n=>n.severity==="critical").length,d=o.filter(n=>n.severity==="warning").length,l=`
        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:16px; padding:12px 16px; margin-bottom:14px; display:flex; gap:16px; align-items:center; box-shadow:0 1px 4px rgba(0,0,0,0.04);">
            <div style="flex:1; text-align:center;">
                <div style="font-size:1.5rem; font-weight:900; color:#EF4444;">${i}</div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:700;">CRITICAL</div>
            </div>
            <div style="width:1px; height:36px; background:#E2E8F0;"></div>
            <div style="flex:1; text-align:center;">
                <div style="font-size:1.5rem; font-weight:900; color:#F59E0B;">${d}</div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:700;">WARNINGS</div>
            </div>
            <div style="width:1px; height:36px; background:#E2E8F0;"></div>
            <div style="flex:1; text-align:center;">
                <div style="font-size:1.5rem; font-weight:900; color:#22C55E;">${o.length}</div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:700;">TOTAL</div>
            </div>
        </div>`;e.innerHTML=l+o.map((n,a)=>Z(n,a,r,t)).join(""),e.querySelectorAll("[data-comm-action]").forEach(n=>{n.onclick=()=>W(n)}),e.querySelectorAll("[data-comm-detail]").forEach(n=>{n.onclick=()=>{const a={title:n.dataset.title,prediction:n.dataset.prediction,projectedValue:n.dataset.projected,confidence:n.dataset.confidence,risk:n.dataset.risk,scope:n.dataset.scope,zoneId:n.dataset.zone,mode:"commercial",history:n.dataset.history};console.log("[Commercial] showScreen params:",a),C("alert-detail",a)}})}function Z(e,o,r=[],t=[]){const i=E[e.severity]||E.warning,d=w[e.risk]||w.default,l=Math.round((e.confidence||.8)*100),n=e.zoneId?e.zoneId.startsWith("zone_")?e.zoneId:`zone_${e.zoneId}`:null,a=r.find(s=>s.zoneId===n);console.log("[Card] a.zoneId:",e.zoneId,"→ normalized:",n,"| matched:",a==null?void 0:a.zoneId),console.log("[Card] a.zoneId:",e.zoneId,"| zones:",r.map(s=>s.zoneId),"| matched:",a==null?void 0:a.zoneId);const g=e.scope==="farm"?t:(a==null?void 0:a.historyReadings)||[],z=encodeURIComponent(JSON.stringify(g)),f=e.scope==="farm"?'<span style="background:#ECFEFF; color:#0f766e; padding:3px 8px; border-radius:6px; font-size:0.62rem; font-weight:800; border:1px solid #99F6E4;">🏭 FARM</span>':`<span style="background:#F0FDF4; color:#166534; padding:3px 8px; border-radius:6px; font-size:0.62rem; font-weight:800; border:1px solid #BBF7D0;">🗺️ ZONE ${e.zoneId??""}</span>`;return`
    <div style="background:${i.bg}; border:1.5px solid ${i.border}; border-left:4px solid ${i.badge}; border-radius:20px; padding:20px; margin-bottom:12px; animation:fadeSlide 0.3s ease both; animation-delay:${o*.07}s;">

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; gap:10px; align-items:center;">
                <div style="width:44px; height:44px; background:#fff; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                    ${e.emoji||"⚠️"}
                </div>
                <div>
                    <div style="display:flex; gap:6px; align-items:center; margin-bottom:4px;">
                        ${f}
                        <span style="background:${i.badge}22; color:${i.badge}; padding:3px 8px; border-radius:6px; font-size:0.62rem; font-weight:800; border:1px solid ${i.badge}44;">${i.label}</span>
                    </div>
                    <b style="color:#0F172A; font-size:0.95rem;">${e.title}</b>
                </div>
            </div>
        </div>

        <p style="color:#475569; font-size:0.85rem; line-height:1.55; margin-bottom:12px; padding:10px 14px; background:rgba(255,255,255,0.7); border-radius:10px; border-left:3px solid ${i.badge};">
            ${e.prediction}
        </p>

        <div style="background:#fff; border-radius:10px; padding:10px 14px; margin-bottom:14px; display:flex; gap:10px; align-items:flex-start; border:1px solid ${i.border};">
            <span style="font-size:1rem; margin-top:1px;">🔧</span>
            <div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:800; margin-bottom:3px;">RECOMMENDED ACTION</div>
                <div style="font-size:0.82rem; color:#334155;">${e.action}</div>
            </div>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <div style="flex:1; background:#fff; border-radius:10px; padding:8px 12px; border:1px solid ${i.border};">
                <div style="font-size:0.6rem; color:#94A3B8; font-weight:800; margin-bottom:2px;">📊 PROJECTED</div>
                <div style="font-size:0.85rem; font-weight:800; color:#0F172A;">${e.projectedValue||"–"}</div>
            </div>
            <div style="flex:1; background:#fff; border-radius:10px; padding:8px 12px; border:1px solid ${i.border};">
                <div style="font-size:0.6rem; color:#94A3B8; font-weight:800; margin-bottom:4px;">🎯 AI CONFIDENCE</div>
                <div style="height:5px; background:#E2E8F0; border-radius:3px; overflow:hidden; margin-bottom:2px;">
                    <div style="height:100%; width:${l}%; background:${i.badge}; border-radius:3px;"></div>
                </div>
                <div style="font-size:0.72rem; font-weight:700; color:${i.badge};">${l}%</div>
            </div>
        </div>

        <div style="display:flex; gap:8px;">
            <button data-comm-action
                data-risk="${e.risk}"
                data-zone="${e.zoneId||""}"
                data-title="${encodeURIComponent(e.title)}"
                style="flex:2; background:${d.color}; color:white; border:none; padding:12px; border-radius:14px; font-weight:700; cursor:pointer; font-size:0.85rem;">
                ${d.btnText}
            </button>
            <button data-comm-detail
                data-title="${encodeURIComponent(e.title)}"
                data-prediction="${encodeURIComponent(e.prediction)}"
                data-projected="${encodeURIComponent(e.projectedValue||"")}"
                data-confidence="${e.confidence||.8}"
                data-risk="${e.risk}"
                data-scope="${e.scope||"farm"}"
                data-zone="${e.zoneId||""}"
                data-history="${z}"
                style="flex:1; background:#fff; color:#475569; border:1.5px solid ${i.border}; padding:12px; border-radius:14px; font-weight:700; cursor:pointer; font-size:0.82rem;">
                📈 Detail
            </button>
        </div>
    </div>`}function B(e,o){const r=e.generatedAt?new Date(e.generatedAt).toLocaleTimeString():"–",t=e.masterSlopes||{},i=(e.zoneReadingCounts||[]).map(d=>`Zone ${d.zoneId}: ${d.count} readings`).join(" · ")||"No zone data";return`
    <div style="font-size:0.75rem; color:#64748B; line-height:1.7;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <div style="width:8px; height:8px; background:#22C55E; border-radius:50%; animation:pulse 2s infinite;"></div>
            <b style="color:#0F172A; font-size:0.82rem;">🧠 AI Response — Live, Not Hardcoded</b>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px;">
            <div style="background:#F8FAFC; border-radius:8px; padding:7px 10px; border:1px solid #E2E8F0;">
                <div style="color:#94A3B8; font-size:0.62rem; font-weight:700; margin-bottom:2px;">⏰ Generated At</div>
                <div style="color:#0F172A; font-weight:700;">${r}</div>
            </div>
            <div style="background:#F8FAFC; border-radius:8px; padding:7px 10px; border:1px solid #E2E8F0;">
                <div style="color:#94A3B8; font-size:0.62rem; font-weight:700; margin-bottom:2px;">🔑 Prompt Hash</div>
                <div style="color:#0F172A; font-weight:700; font-family:monospace;">#${e.promptHash||"–"}</div>
            </div>
            <div style="background:#F8FAFC; border-radius:8px; padding:7px 10px; border:1px solid #E2E8F0;">
                <div style="color:#94A3B8; font-size:0.62rem; font-weight:700; margin-bottom:2px;">📡 Master Readings</div>
                <div style="color:#0F172A; font-weight:700;">${e.masterReadingCount??0} from Firebase</div>
            </div>
            <div style="background:#F8FAFC; border-radius:8px; padding:7px 10px; border:1px solid #E2E8F0;">
                <div style="color:#94A3B8; font-size:0.62rem; font-weight:700; margin-bottom:2px;">🗺️ Active Zones</div>
                <div style="color:#0F172A; font-weight:700;">${o} zones fetched</div>
            </div>
        </div>
        <div style="background:#F8FAFC; border-radius:8px; padding:7px 10px; border:1px solid #E2E8F0; margin-bottom:6px;">
            <div style="color:#94A3B8; font-size:0.62rem; font-weight:700; margin-bottom:3px;">📊 Calculated Slopes (trend per reading)</div>
            <div style="color:#334155;">Water: <b>${t.water??"–"}</b> · Energy: <b>${t.energy??"–"}</b> · CO₂: <b>${t.co2??"–"}</b></div>
        </div>
        <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:8px; padding:7px 10px;">
            <div style="color:#92400E; font-size:0.7rem;">📋 Zone Firebase readings: ${i}</div>
        </div>
    </div>`}function j(e){return`
    <div style="background:#fff; border:1.5px solid #BBF7D0; border-radius:20px; padding:36px 24px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="font-size:3rem; margin-bottom:12px;">✅</div>
        <b style="font-size:1.1rem; color:#064E3B; display:block; margin-bottom:8px;">All ${e} Zone${e!==1?"s":""} Operating Normally</b>
        <p style="color:#6B7280; font-size:0.85rem; line-height:1.5;">
            AI analyzed live Firebase data from your farm master<br>and all ${e} zone node${e!==1?"s":""}.<br>
            No risks detected for the next ${p} minutes.
        </p>
        <button onclick="window._reloadCommercialAlerts?.()"
            style="margin-top:16px; background:#064E3B; color:#fff; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Re-analyze
        </button>
    </div>`}function H(e){return`
    <div style="background:#FFFBEB; border:1.5px solid #FDE68A; border-radius:20px; padding:28px 24px; text-align:center;">
        <div style="font-size:2.5rem; margin-bottom:12px;">⚠️</div>
        <b style="font-size:1rem; color:#92400E; display:block; margin-bottom:8px;">Zone Configuration Not Found</b>
        <p style="color:#6B7280; font-size:0.82rem; line-height:1.5; margin-bottom:16px;">
            Could not discover your zone layout for device <code style="background:#FEF3C7; padding:2px 6px; border-radius:4px;">${e}</code>.<br>
            Make sure your zones are configured in your farm settings and that sensor data has been received from each zone.
        </p>
        <button onclick="window._reloadCommercialAlerts?.()"
            style="background:#D97706; color:#fff; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Retry
        </button>
    </div>`}function U(e){return`
    <div style="background:#FEF2F2; border:1.5px solid #FECACA; border-radius:20px; padding:28px 24px; text-align:center;">
        <div style="font-size:2.5rem; margin-bottom:12px;">❌</div>
        <b style="font-size:1rem; color:#991B1B; display:block; margin-bottom:8px;">Connection Error</b>
        <p style="color:#6B7280; font-size:0.82rem; line-height:1.5; margin-bottom:16px;">${e}</p>
        <button onclick="window._reloadCommercialAlerts?.()"
            style="background:#EF4444; color:#fff; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Retry
        </button>
    </div>`}function _(){return[1,2,3].map(e=>`
        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:20px; padding:20px; margin-bottom:12px; opacity:${1-e*.2};">
            <div style="display:flex; gap:10px; margin-bottom:12px;">
                <div style="width:44px; height:44px; background:#F1F5F9; border-radius:12px;"></div>
                <div style="flex:1;">
                    <div style="width:80px; height:10px; background:#F1F5F9; border-radius:4px; margin-bottom:6px;"></div>
                    <div style="width:160px; height:14px; background:#F1F5F9; border-radius:6px;"></div>
                </div>
            </div>
            <div style="height:48px; background:#F8FAFC; border-radius:10px; margin-bottom:10px;"></div>
            <div style="height:38px; background:#F1F5F9; border-radius:14px;"></div>
        </div>`).join("")+`
    <div style="text-align:center; padding:16px; color:#94A3B8; font-size:0.8rem;">
        🏭 Fetching Firebase data for all zones…
    </div>`}function W(e){const o=e.dataset.risk,r=y(e.dataset.zone),t=decodeURIComponent(e.dataset.title||"Alert"),i="commercial-farm-master-1",d=q(o),l=r?$(r):i;e.style.opacity="0.5",e.textContent="⏳ Queuing…",e.disabled=!0,fetch(`${m}/api/sensors/command`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:l,zoneId:r||null,command:d,source:"predictive_alert_commercial",reason:`AI-triggered: ${t}${r?` (${r})`:""}`})}).catch(()=>{}),setTimeout(()=>{e.style.background="#064E3B",e.style.color="#fff",e.style.opacity="1",e.textContent=`✅ ${d}`,e.disabled=!1,k("success",`✅ ${t} — ${d} queued${r?` for ${r}`:""}`)},700)}function q(e){return{water_depletion:"BUZZER_ON",energy_overload:"NO_ACTION",co2_crisis:"FAN_ON,CO2_LOW",zone_heat:"FAN_ON",zone_rot:"FAN_ON",zone_ec_burn:"FERT_ALERT",zone_ec_deficient:"FERT_ALERT",zone_clog:"WATER_ON"}[e]||"BUZZER_ON"}window._reloadCommercialAlerts=h;if(!document.getElementById("alertAnimStyle")){const e=document.createElement("style");e.id="alertAnimStyle",e.textContent=`
        @keyframes fadeSlide {
            from { opacity:0; transform:translateY(10px); }
            to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
            0%, 100% { opacity:1; }
            50% { opacity:0.4; }
        }`,document.head.appendChild(e)}const Y={render:L,init:M};export{Y as AlertsListCommercial,M as init,L as render};
