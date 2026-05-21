import{s as v}from"./index-kXpGLROK.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const E={heat_stress:{color:"#EF4444",unit:"°C",icon:"🌡️",label:"Temperature"},wilting:{color:"#F59E0B",unit:"%",icon:"🍂",label:"Soil Moisture"},pump_cavitation:{color:"#3B82F6",unit:"cm",icon:"💧",label:"Water Clearance"},nutrient_burn:{color:"#8B5CF6",unit:"mS/cm",icon:"🧪",label:"EC Level"},nutrient_deficient:{color:"#10B981",unit:"mS/cm",icon:"🌿",label:"EC Level"},co2_crisis:{color:"#06B6D4",unit:"ppm",icon:"💨",label:"CO₂"},water_depletion:{color:"#3B82F6",unit:"cm",icon:"🚰",label:"Water Clearance"},zone_heat:{color:"#EF4444",unit:"°C",icon:"🌡️",label:"Zone Temperature"},zone_rot:{color:"#8B5CF6",unit:"%",icon:"🍄",label:"Zone Humidity"},zone_ec_burn:{color:"#8B5CF6",unit:"mS/cm",icon:"🧪",label:"Zone EC"},zone_ec_deficient:{color:"#10B981",unit:"mS/cm",icon:"🌿",label:"Zone EC"},zone_clog:{color:"#6B7280",unit:"",icon:"🔧",label:"Irrigation"},energy_overload:{color:"#F59E0B",unit:"kWh",icon:"⚡",label:"Energy Draw"},co2_crisis_comm:{color:"#06B6D4",unit:"ppm",icon:"💨",label:"CO₂"}},$={critical:"#EF4444",warning:"#F59E0B",info:"#3B82F6",stable:"#22C55E"};function D(e={}){var x,r;const p=document.getElementById("screenContainer");if(!p)return"";const i=y(e.title)||"Alert Detail",s=y(e.prediction)||"No prediction data available.",d=y(e.projectedValue)||"–",h=parseFloat(e.confidence)||.8,g=e.risk||"default",m=e.mode||"beginner",c=e.scope||"farm",f=e.zoneId||null,o=E[g]||{color:"#064E3B",icon:"⚠️",label:"Sensor"},n=Math.round(h*100);$[e.severity]||o.color;const b=parseFloat(((x=d.match(/[\d.]+/))==null?void 0:x[0])||"0");let l=[];try{l=JSON.parse(decodeURIComponent(e.history||"[]"))}catch{l=[]}const a=k(g,b,o.color,l),t=m==="commercial"?`<span style="background:#EFF6FF; color:#1D4ED8; padding:4px 10px; border-radius:8px; font-size:0.72rem; font-weight:800; border:1px solid #BFDBFE; margin-right:8px;">
               ${c==="zone"?`🗺️ Zone ${f||""}`:"🏭 Farm Level"}
           </span>`:"";return p.innerHTML=`<div class="screen active" id="alert-detailScreen">
    <div style="background:#F9FBF9; min-height:100vh; font-family:sans-serif; color:#1E293B;">

        <!-- Header -->
        <div style="display:flex; align-items:center; padding:16px 20px; background:#fff; border-bottom:1px solid #EDF2F0; position:sticky; top:0; z-index:10;">
            <button id="alertDetailBack" style="background:#F0FDF4; border:none; border-radius:12px; width:40px; height:40px; cursor:pointer; font-size:1.2rem; color:#064E3B; display:flex; align-items:center; justify-content:center;">←</button>
            <div style="margin-left:12px; flex:1;">
                <div style="font-weight:800; font-size:1rem; color:#0F172A;">Detailed Analysis</div>
                <div style="font-size:0.7rem; color:#94A3B8;">SeedDown AI · ${m==="commercial"?"Commercial":"Home"} Risk Engine</div>
            </div>
            <div style="background:${o.color}22; color:${o.color}; padding:6px 12px; border-radius:10px; font-size:0.72rem; font-weight:800; border:1px solid ${o.color}44;">
                ${o.icon} ${o.label}
            </div>
        </div>

        <div style="padding:20px;">

            <!-- Projected value hero card -->
            <div style="background:#fff; border-radius:24px; padding:24px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow:0 4px 20px rgba(0,0,0,0.04); text-align:center;">
                ${t?`<div style="margin-bottom:10px;">${t}</div>`:""}
                <div style="font-size:0.72rem; font-weight:800; color:#94A3B8; letter-spacing:1px; margin-bottom:6px;">PROJECTED RISK VALUE</div>
                <div style="font-size:3rem; font-weight:900; color:${o.color}; line-height:1.1;">${d}</div>
                <div style="font-size:0.82rem; color:#6B7280; margin-top:8px;">AI-calculated from your live Firebase sensor trend</div>
            </div>

            <!-- Trend chart -->
            <div style="background:#fff; border-radius:24px; padding:20px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <div style="font-size:0.72rem; font-weight:800; color:#94A3B8; letter-spacing:1px; margin-bottom:14px;">📈 TREND PROJECTION</div>
                ${a}
                <div style="display:flex; justify-content:space-between; font-size:0.68rem; color:#CBD5E1; margin-top:6px;">
                    <span>10 readings ago</span>
                    <span>Now</span>
                    <span>+${((r=d.match(/\d+ min/))==null?void 0:r[0])||"45 min"}</span>
                </div>
            </div>

            <!-- AI Confidence -->
            <div style="background:#fff; border-radius:20px; padding:18px 20px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <div style="font-size:0.72rem; font-weight:800; color:#94A3B8; letter-spacing:1px; margin-bottom:10px;">🎯 AI CONFIDENCE SCORE</div>
                <div style="display:flex; align-items:center; gap:14px;">
                    <div style="flex:1; height:10px; background:#F1F5F9; border-radius:6px; overflow:hidden;">
                        <div style="height:100%; width:${n}%; background:linear-gradient(90deg, ${o.color}88, ${o.color}); border-radius:6px; transition:width 0.6s ease;"></div>
                    </div>
                    <div style="font-size:1.4rem; font-weight:900; color:${o.color}; min-width:48px;">${n}%</div>
                </div>
                <div style="font-size:0.75rem; color:#94A3B8; margin-top:8px;">
                    ${n>=85?"🔴 High confidence — act now":n>=70?"🟡 Moderate confidence — monitor closely":"🟢 Lower confidence — keep an eye on it"}
                </div>
            </div>

            <!-- AI Prediction text -->
            <div style="background:#fff; border-radius:20px; padding:18px 20px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <div style="font-size:0.72rem; font-weight:800; color:#94A3B8; letter-spacing:1px; margin-bottom:10px;">🧠 AI PREDICTION</div>
                <p style="color:#334155; font-size:0.9rem; line-height:1.65; margin:0;">${s}</p>
            </div>

            <!-- Title / alert context -->
            <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:20px; padding:16px 20px; margin-bottom:20px;">
                <div style="font-size:0.72rem; font-weight:800; color:#166534; letter-spacing:1px; margin-bottom:6px;">📋 ALERT CONTEXT</div>
                <div style="font-size:0.9rem; color:#064E3B; font-weight:700;">${i}</div>
                <div style="font-size:0.75rem; color:#6B7280; margin-top:4px;">
                    Mode: ${m==="commercial"?"🏭 Commercial Grid":"🌱 Home Grower"} · Risk type: <code style="background:#E2E8F0; padding:2px 6px; border-radius:4px;">${g}</code>
                </div>
            </div>

            <!-- Back button -->
            <button id="alertDetailBackBottom"
                style="width:100%; background:#064E3B; color:#fff; border:none; padding:16px; border-radius:18px; font-weight:800; cursor:pointer; font-size:1rem;">
                ← Back to Alerts
            </button>

        </div>
    </div>
    </div>`,""}function I(e={}){setTimeout(()=>{console.log("[AlertDetail] params:",e);const p=(e==null?void 0:e.mode)||"beginner",i=document.getElementById("alertDetailBack"),s=document.getElementById("alertDetailBackBottom"),d=()=>{p==="commercial"?v("alert-commercial",{returnScope:e.scope||"all"}):v("alert-beginner")};i&&(i.onclick=d),s&&(s.onclick=d)},50)}function y(e){if(!e)return"";try{return decodeURIComponent(e)}catch{return e}}function k(e,p,i,s=[]){const m={heat_stress:"temperature",zone_heat:"temperature",wilting:"waterDistanceCm",pump_cavitation:"waterDistanceCm",water_depletion:"waterDistanceCm",nutrient_burn:"ph",nutrient_deficient:"ph",co2_crisis:"gasRaw",zone_rot:"humidity",zone_ec_burn:"ec",zone_ec_deficient:"ec",zone_clog:"waterDistanceCm"}[e]||"temperature",c=s.map(t=>parseFloat(t[m])).filter(t=>!isNaN(t)).slice(-10),f=["heat_stress","zone_heat","nutrient_burn","energy_overload"].includes(e),o=["wilting","pump_cavitation","water_depletion","nutrient_deficient","co2_crisis"].includes(e);let n=[];if(c.length>=2){const t=Math.min(...c)*.95,r=Math.max(...c)*1.05-t||1;n=c.map((u,F)=>{const w=F/(c.length-1)*300,B=100-(u-t)/r*100*.8-100*.1;return`${w.toFixed(1)},${B.toFixed(1)}`})}else for(let t=0;t<12;t++){const x=t/11*300;let r;if(t<7)r=100*.5+Math.sin(t*1.3)*6;else{const u=(t-7)/4;f?r=100*.5-u*100*.38:o?r=100*.5+u*100*.38:r=100*.5+Math.sin(t*1.3)*6}n.push(`${x.toFixed(1)},${r.toFixed(1)}`)}const b=n.join(" "),l=n[n.length-1].split(","),a=f?100*.12:o?100*.88:null;return`
    <svg viewBox="0 0 300 100" style="width:100%; height:130px; overflow:visible;">
        <line x1="0" y1="25" x2="300" y2="25" stroke="#F1F5F9" stroke-width="1"/>
        <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" stroke-width="1"/>
        <line x1="0" y1="75" x2="300" y2="75" stroke="#F1F5F9" stroke-width="1"/>
        ${a!=null?`
        <line x1="0" y1="${a}" x2="300" y2="${a}"
              stroke="${i}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.5"/>
        <text x="302" y="${a+4}" font-size="9" fill="${i}" opacity="0.8">threshold</text>
        `:""}
        <polyline points="${b}" fill="none" stroke="${i}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="${l[0]}" cy="${l[1]}" r="5" fill="${i}" opacity="0.9"/>
        <circle cx="${l[0]}" cy="${l[1]}" r="9" fill="${i}" opacity="0.15"/>
        <text x="4" y="12" font-size="9" fill="#94A3B8">HISTORY (${c.length>0?"live":"demo"})</text>
        <text x="${parseFloat(l[0])-10}" y="12" font-size="9" fill="${i}">NOW</text>
    </svg>`}export{I as init,D as render};
