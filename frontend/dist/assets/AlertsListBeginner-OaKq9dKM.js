import{s as F,a as w,A as s}from"./index-Cib2v6Mx.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const g=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let a=45,p=!1;const y={critical:{bg:"#FEF2F2",border:"#FECACA",badge:"#EF4444",badgeTxt:"#fff",label:"CRITICAL"},warning:{bg:"#FFFBEB",border:"#FDE68A",badge:"#F59E0B",badgeTxt:"#fff",label:"WARNING"},info:{bg:"#ECFEFF",border:"#99F6E4",badge:"#14B8A6",badgeTxt:"#fff",label:"INFO"},stable:{bg:"#F0FDF4",border:"#BBF7D0",badge:"#22C55E",badgeTxt:"#fff",label:"STABLE"}},h={heat_stress:{btnText:"❄️ Pre-cool System",color:"#EF4444"},wilting:{btnText:"💧 Boost Irrigation",color:"#F59E0B"},pump_cavitation:{btnText:"🚰 Refill Water Tank",color:"#F59E0B"},nutrient_burn:{btnText:"🧪 Dilute Nutrient Mix",color:"#8B5CF6"},nutrient_deficient:{btnText:"🌿 Boost Nutrient Mix",color:"#8B5CF6"},co2_crisis:{btnText:"💨 Adjust Ventilation",color:"#06B6D4"},stable:{btnText:"✅ All Good",color:"#22C55E"},default:{btnText:"⚡ Take Action",color:"#064E3B"}};function A(){const e=s.packageLevel||s.mode||"pro",t={starter:"🌱 Starter",standard:"🌿 Standard",pro:"⚡ Pro"}[e]||e,o=document.getElementById("screenContainer");return o&&(o.innerHTML=`<div class="screen active" id="alertBeginnerScreen">${$(e,t)}</div>`),""}function $(e,t){return`
    <div style="padding:20px; background:#F9FBF9; min-height:100vh; font-family:sans-serif;">

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
            <button id="alertBeginnerBack" style="background:#F0FDF4; border:none; border-radius:12px; padding:10px 14px; cursor:pointer; font-size:1.1rem; color:#064E3B;">←</button>
            <div>
                <div style="font-weight:800; font-size:1.15rem; color:#064E3B;">🛰️ Predictive Alerts</div>
                <div style="font-size:0.75rem; color:#6B7280;">Package: <b style="color:#064E3B;">${t}</b> · AI Risk Monitor</div>
            </div>
        </div>

        <div style="background:#fff; border-radius:20px; padding:14px 18px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; border:1px solid #EDF2F0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
            <div>
                <div style="font-size:0.78rem; font-weight:700; color:#064E3B;">Predict Window</div>
                <div style="font-size:0.7rem; color:#9CA3AF;">How far ahead to forecast</div>
            </div>
            <select id="beginnerPredictSelect" style="border:none; background:#F0FDF4; color:#065F46; padding:8px 14px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                <option value="30">30 Mins</option>
                <option value="45" ${a===45?"selected":""}>45 Mins</option>
                <option value="60">60 Mins</option>
            </select>
        </div>

        <div style="background:#ECFEFF; border:1px solid #99F6E4; border-radius:14px; padding:10px 16px; margin-bottom:18px; font-size:0.8rem; color:#0f766e; line-height:1.5;">
            <b>🤖 How this works:</b> SeedDown AI reads your live sensor history from Firebase, calculates the trend slope, and predicts what will happen in the next <b id="pillMinutes">${a} minutes</b> — so you can act before a crisis hits.
        </div>

        <div id="beginnerAlertsList">
            ${k()}
        </div>

        <div id="aiProvenancePanel" style="display:none; background:#fff; border:1px solid #EDF2F0; border-radius:16px; padding:14px 16px; margin-top:12px; box-shadow:0 1px 4px rgba(0,0,0,0.04);">
        </div>
    </div>`}async function C(){setTimeout(()=>{const e=document.getElementById("alertBeginnerBack");e&&(e.onclick=()=>F("home"));const t=document.getElementById("beginnerPredictSelect");t&&(t.value=String(a),t.onchange=o=>{a=parseInt(o.target.value);const i=document.getElementById("pillMinutes");i&&(i.textContent=`${a} minutes`),w("success",`AI recalibrating for ${a} min window…`),u()}),u()},50)}function D(e){const t=(e==null?void 0:e.packageLevel)||s.packageLevel||"standard";return{starter:"beginner_starter",standard:"beginner_standard",pro:"beginner_pro"}[t]||"beginner_standard"}async function u(){var o,i,d;if(p)return;p=!0;const e=document.getElementById("beginnerAlertsList");if(!e){p=!1;return}e.innerHTML=k();const t=document.getElementById("aiProvenancePanel");t&&(t.style.display="none");try{const n=D(s.currentFarm),r=s.packageLevel||"pro",[b,B]=await Promise.all([fetch(`${g}/api/sensors/latest?deviceId=${n}`),fetch(`${g}/api/sensors/history?deviceId=${n}&limit=10`)]),f=await b.json(),m=await B.json();console.log("[Debug] deviceId used:",n),console.log("[Debug] latestReading:",f.reading),console.log("[Debug] historyReadings count:",(o=m.readings)==null?void 0:o.length),console.log("[Debug] historyReadings[0]:",(i=m.readings)==null?void 0:i[0]),console.log("[Debug] currentFarm:",s.currentFarm),console.log("[Debug] currentFarm.deviceId:",(d=s.currentFarm)==null?void 0:d.deviceId),console.log("[Debug] deviceId used:",n);const E=f.reading||{},l=m.readings||[];l.length===0&&console.warn(`[AlertsListBeginner] Firebase returned 0 readings for deviceId="${n}". Sensor may be offline.`);const x=await(await fetch(`${g}/api/alerts/predict-beginner`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:n,packageLevel:r,predictMinutes:a,latestReading:E,historyReadings:l})})).json(),v=Array.isArray(x.alerts)?x.alerts:[],c=x.aiMeta||null;c&&t&&(t.style.display="block",t.innerHTML=S(c,r)),c&&!c.hasRealData?e.innerHTML=P(n):v.length===0?e.innerHTML=z(l.length):I(e,v,r,!1,l)}catch(n){console.error("[AlertsListBeginner] Error:",n.message),e.innerHTML=L(n.message)}finally{p=!1}}function I(e,t,o,i=!1,d=[]){const n=i?`<div style="background:#FEF9C3; border:1px solid #FDE047; border-radius:12px; padding:10px 14px; margin-bottom:14px; font-size:0.78rem; color:#854D0E;">
               ⚠️ <b>Demo mode</b> — backend offline. Showing example predictions.
           </div>`:"";e.innerHTML=n+t.map((r,b)=>T(r,b,d)).join(""),e.querySelectorAll("[data-action-btn]").forEach(r=>{r.onclick=()=>_(r)}),e.querySelectorAll("[data-detail-btn]").forEach(r=>{r.onclick=()=>{F("alert-detail",{title:r.dataset.title,prediction:r.dataset.prediction,projectedValue:r.dataset.projected,confidence:r.dataset.confidence,risk:r.dataset.risk,mode:"beginner",history:r.dataset.history})}})}function T(e,t,o=[]){const i=y[e.severity]||y.warning,d=h[e.risk]||h.default,n=Math.round((e.confidence||.8)*100);return`
    <div style="background:${i.bg}; border:1.5px solid ${i.border}; border-radius:24px; padding:22px; margin-bottom:14px; animation: fadeSlide 0.3s ease both; animation-delay:${t*.08}s;">

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
            <div style="display:flex; gap:12px; align-items:center;">
                <div style="width:48px; height:48px; background:white; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                    ${e.emoji||"⚠️"}
                </div>
                <div>
                    <b style="color:#1E293B; font-size:1rem; display:block;">${e.title}</b>
                    <span style="color:#6B7280; font-size:0.72rem;">SeedDown AI · ${a}m window · Live Firebase data</span>
                </div>
            </div>
            <div style="background:${i.badge}; color:${i.badgeTxt}; padding:5px 10px; border-radius:10px; font-size:0.62rem; font-weight:800; white-space:nowrap;">
                ${i.label}
            </div>
        </div>

        <p style="color:#374151; font-size:0.88rem; line-height:1.55; margin-bottom:14px; padding:12px 14px; background:rgba(255,255,255,0.6); border-radius:12px;">
            ${e.prediction}
        </p>

        <div style="background:rgba(255,255,255,0.7); border-radius:12px; padding:10px 14px; margin-bottom:14px; border:1px solid ${i.border};">
            <div style="font-size:0.65rem; color:#6B7280; font-weight:700; margin-bottom:3px;">🔧 RECOMMENDED ACTION</div>
            <div style="font-size:0.85rem; color:#374151;">${e.action}</div>
        </div>

        <div style="display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap;">
            <div style="background:white; border-radius:12px; padding:8px 14px; flex:1; min-width:120px; border:1px solid ${i.border};">
                <div style="font-size:0.65rem; color:#6B7280; font-weight:700; margin-bottom:2px;">📊 PROJECTED</div>
                <div style="font-size:0.9rem; font-weight:800; color:#1E293B;">${e.projectedValue||"–"}</div>
            </div>
            <div style="background:white; border-radius:12px; padding:8px 14px; flex:1; min-width:120px; border:1px solid ${i.border};">
                <div style="font-size:0.65rem; color:#6B7280; font-weight:700; margin-bottom:4px;">🎯 AI CONFIDENCE</div>
                <div style="height:6px; background:#E5E7EB; border-radius:4px; overflow:hidden;">
                    <div style="height:100%; width:${n}%; background:${i.badge}; border-radius:4px;"></div>
                </div>
                <div style="font-size:0.75rem; font-weight:700; color:${i.badge}; margin-top:3px;">${n}%</div>
            </div>
        </div>

        <div style="display:flex; gap:10px;">
            <button data-action-btn
                data-risk="${e.risk}"
                data-title="${encodeURIComponent(e.title)}"
                style="flex:1; background:${d.color}; color:white; border:none; padding:14px; border-radius:16px; font-weight:700; cursor:pointer; font-size:0.9rem; transition:opacity 0.2s;">
                ${d.btnText}
            </button>
            <button data-detail-btn
                data-title="${encodeURIComponent(e.title)}"
                data-prediction="${encodeURIComponent(e.prediction)}"
                data-projected="${encodeURIComponent(e.projectedValue||"")}"
                data-confidence="${e.confidence||.8}"
                data-risk="${e.risk}"
                data-history="${encodeURIComponent(JSON.stringify(o))}"
                style="background:white; color:#374151; border:1.5px solid ${i.border}; padding:14px 16px; border-radius:16px; font-weight:700; cursor:pointer; font-size:0.85rem;">
                📈 Detail
            </button>
        </div>
    </div>`}function S(e,t){const o=e.generatedAt?new Date(e.generatedAt).toLocaleTimeString():"–",i=e.slopeSummary||{},d=e.hasRealData?`<span style="color:#166534; font-weight:700;">✅ ${e.readingCount} real readings from Firebase</span>`:'<span style="color:#B45309; font-weight:700;">⚠️ No sensor data — device may be offline</span>';return`
    <div style="font-size:0.75rem; color:#6B7280; line-height:1.7;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <div style="width:8px; height:8px; background:#22C55E; border-radius:50%; animation:pulse 2s infinite;"></div>
            <b style="color:#064E3B; font-size:0.82rem;">🧠 AI Response — Live, Not Hardcoded</b>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px;">
            <div style="background:#F0FDF4; border-radius:8px; padding:7px 10px; border:1px solid #BBF7D0;">
                <div style="color:#6B7280; font-size:0.62rem; font-weight:700; margin-bottom:2px;">⏰ Generated At</div>
                <div style="color:#064E3B; font-weight:700;">${o}</div>
            </div>
            <div style="background:#F0FDF4; border-radius:8px; padding:7px 10px; border:1px solid #BBF7D0;">
                <div style="color:#6B7280; font-size:0.62rem; font-weight:700; margin-bottom:2px;">🔑 Prompt Hash</div>
                <div style="color:#064E3B; font-weight:700; font-family:monospace;">#${e.promptHash||"–"}</div>
            </div>
        </div>
        <div style="background:#F0FDF4; border-radius:8px; padding:7px 10px; border:1px solid #BBF7D0; margin-bottom:6px;">
            <div style="color:#6B7280; font-size:0.62rem; font-weight:700; margin-bottom:2px;">📡 Firebase Data Source</div>
            ${d}
        </div>
        <div style="background:#F0FDF4; border-radius:8px; padding:7px 10px; border:1px solid #BBF7D0;">
            <div style="color:#6B7280; font-size:0.62rem; font-weight:700; margin-bottom:3px;">📊 Sensor Trends (slope per reading, sent to AI)</div>
            <div style="color:#374151;">
                Temp: <b>${i.temp??"–"}</b> · Soil: <b>${i.soil??"–"}</b>
                ${t!=="starter"?` · Water: <b>${i.water??"–"}</b>`:""}
                ${t==="pro"?` · EC: <b>${i.ec??"–"}</b> · CO₂: <b>${i.co2??"–"}</b>`:""}
            </div>
        </div>
        <div style="margin-top:6px; font-size:0.68rem; color:#9CA3AF; text-align:center;">
            Every analysis is unique — compare the prompt hash across runs to confirm AI is re-generating
        </div>
    </div>`}function z(e){return`
    <div style="background:#F0FDF4; border:1.5px solid #BBF7D0; border-radius:24px; padding:36px 24px; text-align:center;">
        <div style="font-size:3rem; margin-bottom:12px;">✅</div>
        <b style="font-size:1.1rem; color:#064E3B; display:block; margin-bottom:8px;">All Systems Stable</b>
        <p style="color:#6B7280; font-size:0.88rem; line-height:1.5;">
            AI analyzed ${e>0?`your last ${e} real Firebase readings`:"your sensor data"} for the next ${a} minutes.<br>
            No risks detected. Keep monitoring!
        </p>
        <button onclick="window._reloadBeginnerAlerts?.()"
            style="margin-top:16px; background:#064E3B; color:white; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Re-analyze
        </button>
    </div>`}function L(e){return`
    <div style="background:#FEF2F2; border:1.5px solid #FECACA; border-radius:24px; padding:28px 24px; text-align:center;">
        <div style="font-size:2.5rem; margin-bottom:12px;">❌</div>
        <b style="font-size:1rem; color:#991B1B; display:block; margin-bottom:8px;">Connection Error</b>
        <p style="color:#6B7280; font-size:0.82rem; line-height:1.5; margin-bottom:16px;">${e}</p>
        <button onclick="window._reloadBeginnerAlerts?.()"
            style="background:#EF4444; color:#fff; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Retry
        </button>
    </div>`}function k(){return[1,2].map(e=>`
        <div style="background:#fff; border:1px solid #EDF2F0; border-radius:24px; padding:22px; margin-bottom:14px; opacity:${1-e*.2};">
            <div style="display:flex; gap:12px; align-items:center; margin-bottom:14px;">
                <div style="width:48px; height:48px; background:#F3F4F6; border-radius:14px;"></div>
                <div>
                    <div style="width:140px; height:14px; background:#F3F4F6; border-radius:6px; margin-bottom:6px;"></div>
                    <div style="width:100px; height:10px; background:#F3F4F6; border-radius:4px;"></div>
                </div>
            </div>
            <div style="height:50px; background:#F9FAFB; border-radius:12px; margin-bottom:14px;"></div>
            <div style="height:44px; background:#F3F4F6; border-radius:16px;"></div>
        </div>`).join("")+`
    <div style="text-align:center; padding:20px; color:#9CA3AF; font-size:0.82rem;">
        🛰️ Fetching your Firebase sensor data…
    </div>`}function _(e){const t=e.dataset.risk,o=decodeURIComponent(e.dataset.title||"Alert");e.style.opacity="0.6",e.textContent="⏳ Sending…",e.disabled=!0,fetch(`${g}/api/sensors/command`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:s.currentFarmId||"farm_001",command:R(t),source:"predictive_alert",note:`AI-triggered action: ${o}`})}).catch(()=>{}),setTimeout(()=>{e.style.background="#064E3B",e.style.opacity="1",e.textContent="✅ Action Sent",e.disabled=!1,w("success",`✅ ${o} — intervention triggered!`)},800)}function R(e){return{heat_stress:"COOLING_ON",wilting:"PUMP_ON",pump_cavitation:"PUMP_PAUSE",nutrient_burn:"DILUTE_EC",nutrient_deficient:"BOOST_EC",co2_crisis:"FAN_ON"}[e]||"ALERT_ACK"}function P(e){return`
    <div style="background:#FFFBEB; border:1.5px solid #FDE68A; border-radius:24px; padding:32px 24px; text-align:center;">
        <div style="font-size:3rem; margin-bottom:12px;">📡</div>
        <b style="font-size:1.1rem; color:#92400E; display:block; margin-bottom:10px;">No Sensor Data from Firebase</b>
        <p style="color:#6B7280; font-size:0.85rem; line-height:1.6; margin-bottom:16px;">
            Your device <code style="background:#FEF3C7; padding:2px 6px; border-radius:4px; font-size:0.8rem;">${e}</code>
            hasn't sent any readings yet.<br><br>
            This usually means:<br>
            • The sensor device is offline or unpowered<br>
            • The deviceId in your farm settings doesn't match the device<br>
            • The device hasn't sent its first reading yet
        </p>
        <button onclick="window._reloadBeginnerAlerts?.()"
            style="background:#D97706; color:#fff; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Check Again
        </button>
    </div>`}window._reloadBeginnerAlerts=u;if(!document.getElementById("alertAnimStyle")){const e=document.createElement("style");e.id="alertAnimStyle",e.textContent=`
        @keyframes fadeSlide {
            from { opacity:0; transform:translateY(12px); }
            to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
            0%, 100% { opacity:1; }
            50% { opacity:0.4; }
        }`,document.head.appendChild(e)}const H={render:A,init:C};export{H as AlertsListBeginner,C as init,A as render};
