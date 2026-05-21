import{s as B,A as h}from"./index-BcV22NKw.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const b=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,k={temp:{field:"temperature",unit:"°C",label:"Temp",normal:e=>e>=18&&e<=35},humid:{field:"humidity",unit:"%",label:"Humid",normal:e=>e>=35&&e<=80},light:{field:"lightRaw",unit:"raw",label:"Light",normal:e=>e>=1500},ph:{field:"ph",unit:"pH",label:"pH",normal:e=>e>=5.5&&e<=7.5},water:{field:"waterDistanceCm",unit:"cm",label:"Water",normal:e=>e>=3&&e<=30},nutrient:{field:"gasRaw",unit:"raw",label:"Gas",normal:e=>e<3e3},ec:{field:"ec",unit:"mS",label:"EC",normal:e=>e>=.5&&e<=3.5},co2:{field:"co2Ppm",unit:"ppm",label:"CO2",normal:e=>e<1500}},_=["temp","humid","light","ph","water","nutrient","ec","co2"];async function O(e={}){const t=e.zoneId||"zone_A",r=t.replace("_"," ").toUpperCase(),a=e.from||"dash-c",o=document.getElementById("screenContainer");o.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:#f8faf7;height:100vh;align-items:center;justify-content:center;color:#64748b;font-size:0.95rem;font-weight:700;">
            Loading ${r}...
        </div>
    `;const n=await T(t,e),l=_.map(d=>{const i=k[d],c=n?Number(n[i.field]??null):null,f=c!==null&&Number.isFinite(c),x=f?i.normal(c)?"Normal":"Check":"No Data",m=f?L(c):"--";return{key:d,meta:i,value:m,status:x}}),s=l.some(d=>d.status==="Check")?"Check":"Normal";o.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:#f8faf7;height:100vh;position:relative;color:#17231b;">

            <!-- Header -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;background:rgba(255,255,255,.92);border-bottom:1px solid #e5e7eb;backdrop-filter:blur(12px);">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="zoneBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid #e5e7eb;background:#fff;font-size:1.25rem;font-weight:900;color:#17231b;cursor:pointer;flex-shrink:0;">←</button>
                    <div>
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:#047857;">Production Zone</div>
                        <div style="font-weight:900;font-size:1.2rem;color:#17231b;">${S(r)} Overview</div>
                    </div>
                </div>
                <div style="display:inline-flex;align-items:center;gap:8px;background:${s==="Normal"?"#ecfdf5":"#fef2f2"};color:${s==="Normal"?"#047857":"#dc2626"};border:1px solid ${s==="Normal"?"#bbf7d0":"#fecaca"};padding:8px 14px;border-radius:999px;font-size:0.78rem;font-weight:900;">
                    <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>
                    ${s==="Normal"?"All Normal":"Anomaly Detected"}
                </div>
            </div>

            <!-- Sensor Grid -->
            <div style="flex:1;overflow-y:auto;padding:20px;">
                <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Tap a sensor to view history</div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
    ${l.map(d=>D(d)).join("")}
</div>

<div style="display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:16px;margin-bottom:16px;">
    <section style="background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(15,23,42,.08);">
        <div id="spotlightLabel" style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading</div>
        <div id="spotlightValue" style="font-size:2.45rem;font-weight:950;color:#047857;line-height:1;">--<span id="spotlightUnit" style="font-size:1rem;font-weight:800;color:#64748b;margin-left:6px;"></span></div>
        <div id="spotlightBadge" style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0;padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>Loading
        </div>
    </section>
    <section style="background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(15,23,42,.08);">
        <div id="trendLabel" style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Trend History</div>
        <div id="zoneTrendChart" style="width:100%;aspect-ratio:5/2;min-height:120px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.8rem;">Loading...</div>
    </section>
</div>

<section style="background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(15,23,42,.08);">
    <div id="historyLabel" style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Historical Records</div>
    <div id="zoneHistoryLog" style="display:flex;flex-direction:column;gap:8px;">
        <div style="color:#94a3b8;font-size:0.85rem;">Loading...</div>
    </div>
</section>
            </div>
        </div>
    `,H({backTarget:a,zoneId:t,params:e,sensors:l})}function D({key:e,meta:t,value:r,status:a}){const o=a==="Check",n=a==="No Data",l=o?"#fff5f5":"#ffffff",s=o?"#fecaca":"#e5e7eb",d=o?"#dc2626":"#047857",i=o?"#fef2f2":n?"#f1f5f9":"#ecfdf5",c=o?"#dc2626":n?"#94a3b8":"#047857",f=o?"#fecaca":n?"#e2e8f0":"#bbf7d0";return`
        <button class="zone-sensor-card" data-key="${e}" data-label="${t.label}"
            style="width:calc(25% - 6px);min-width:70px;background:${l};border:1px solid ${s};border-radius:16px;padding:12px 10px;text-align:left;cursor:pointer;transition:all 0.18s;outline:none;box-shadow:0 4px 16px rgba(15,23,42,.06);">
            <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${t.label}</div>
            <div style="font-size:1.9rem;font-weight:950;color:${d};line-height:1;margin-bottom:10px;">
                ${r}<span style="font-size:0.75rem;font-weight:800;color:#94a3b8;margin-left:4px;">${r!=="--"?t.unit:""}</span>
            </div>
            <div style="display:inline-flex;align-items:center;gap:5px;background:${i};color:${c};border:1px solid ${f};padding:4px 9px;border-radius:999px;font-size:0.68rem;font-weight:900;">
                <span style="width:5px;height:5px;border-radius:999px;background:currentColor;display:inline-block;"></span>${a}
            </div>
        </button>
    `}function H({backTarget:e,zoneId:t,params:r,sensors:a}){document.getElementById("zoneBackBtn").onclick=()=>B(e),document.querySelectorAll(".zone-sensor-card").forEach(n=>{n.addEventListener("click",()=>{const l=n.getAttribute("data-key");document.querySelectorAll(".zone-sensor-card").forEach(s=>s.style.outline=s===n?"2px solid #047857":"none"),$(l,a,t,r)})});const o=a.find(n=>n.status!=="No Data")||a[0];document.querySelectorAll(".zone-sensor-card").forEach(n=>{n.style.outline=n.getAttribute("data-key")===o.key?"2px solid #047857":"none"}),$(o.key,a,t,r)}const C={zone_A:"commercial-zone-node-1",zone_B:"commercial-zone-node-2",zone_C:"commercial-zone-node-3"};async function T(e,t={}){const r=N(),o=(Array.isArray(r==null?void 0:r.commercialDevices)?r.commercialDevices:[]).find(s=>I(s.zoneId||s.zone)===e),n=(o==null?void 0:o.deviceId)||t.deviceId||C[e],l=[n&&`${b}/api/sensors/latest?deviceId=${encodeURIComponent(n)}`,`${b}/api/sensors/latest?zoneId=${encodeURIComponent(e)}`].filter(Boolean);for(const s of l)try{const i=await(await fetch(s)).json();if(i!=null&&i.reading)return i.reading}catch{}return null}function N(){if(h.currentFarm)return h.currentFarm;try{const e=JSON.parse(localStorage.getItem("user_farms"))||[];return e.find(t=>t.id===h.currentFarmId)||e[e.length-1]||null}catch{return null}}function I(e){const t=String(e||"").trim().toLowerCase();return t?t==="a"||t==="zone a"||t==="zone_a"?"zone_A":t==="b"||t==="zone b"||t==="zone_b"?"zone_B":t==="c"||t==="zone c"||t==="zone_c"?"zone_C":t.startsWith("zone_")?`zone_${t.slice(5).toUpperCase()}`:t:""}function L(e){return Number.isFinite(e)?Math.abs(e)>=100?String(Math.round(e)):Number.isInteger(e)?String(e):e.toFixed(1).replace(/\.0$/,""):"0"}function S(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function $(e,t,r,a){const o=t.find(i=>i.key===e)||t[0];if(!o)return;const n=o.meta.label,l=(i,c)=>{const f=document.getElementById(i);f&&(f.textContent=c)};l("spotlightLabel",`Current Reading · ${n}`),l("trendLabel",`Trend History · ${n}`),l("historyLabel",`Historical Records · ${n}`),l("spotlightUnit",o.value!=="--"?o.meta.unit:"");const s=document.getElementById("spotlightValue");if(s){const i=document.getElementById("spotlightUnit");s.childNodes[0].textContent=o.value,s.style.color=o.status==="Normal"?"#047857":o.status==="No Data"?"#94a3b8":"#dc2626",i&&(i.textContent=o.value!=="--"?o.meta.unit:"")}const d=document.getElementById("spotlightBadge");if(d){const i=o.status==="Normal",c=o.status==="No Data";d.style.background=i?"#ecfdf5":c?"#f1f5f9":"#fef2f2",d.style.color=i?"#166534":c?"#64748b":"#dc2626",d.style.border=`1px solid ${i?"#bbf7d0":c?"#e2e8f0":"#fecaca"}`,d.innerHTML=`<span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${o.status}`}R(r,a,o.meta)}async function R(e,t={},r=k.temp){try{const a=N(),n=(Array.isArray(a==null?void 0:a.commercialDevices)?a.commercialDevices:[]).find(p=>I(p.zoneId||p.zone)===e),l=(n==null?void 0:n.deviceId)||t.deviceId||C[e],s=l?`${b}/api/sensors/history?deviceId=${encodeURIComponent(l)}&limit=8`:`${b}/api/sensors/history?zoneId=${encodeURIComponent(e)}&limit=8`,c=(await(await fetch(s)).json()).readings||[];if(!c.length)return;const f=c.map(p=>Number(p[r.field]??0)).reverse(),x=Math.max(...f,1),m=Math.min(...f,0),E=x-m||1,y=f.map((p,g)=>({x:(g/(f.length-1||1)*100).toFixed(1),y:(35-(p-m)/E*25).toFixed(1)})),v=`M ${y.map(p=>`${p.x},${p.y}`).join(" L ")}`,A=`${v} L 100,40 L 0,40 Z`,w=document.getElementById("zoneTrendChart");w&&(w.innerHTML=`
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
                <defs>
                    <linearGradient id="zoneGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="rgba(16,185,129,.30)"/>
                        <stop offset="100%" stop-color="rgba(16,185,129,0)"/>
                    </linearGradient>
                </defs>
                <path d="${A}" fill="url(#zoneGrad)"/>
                <path d="${v}" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${y.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="1.5" fill="#fff" stroke="#10B981" stroke-width="1"/>`).join("")}
            </svg>`);const z=document.getElementById("zoneHistoryLog");z&&(z.innerHTML=c.map(p=>{const g=Number(p[r.field]??0),u=r.normal(g)?"Normal":"Check";return`
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:13px 0;border-bottom:1px solid #eef2f7;align-items:center;">
                    <span style="color:#64748b;font-weight:700;">${p.createdAt?new Date(p.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"--:--"}</span>
                    <span style="font-weight:950;color:#17231b;">${L(g)} <span style="font-size:0.72rem;color:#64748b;">${S(r.unit)}</span></span>
                    <span style="text-align:right;"><span style="background:${u==="Normal"?"#ecfdf5":"#fef2f2"};color:${u==="Normal"?"#166534":"#dc2626"};border:1px solid ${u==="Normal"?"#bbf7d0":"#fecaca"};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;">${u}</span></span>
                </div>`}).join(""))}catch(a){console.error("Zone history load failed:",a)}}export{O as render};
