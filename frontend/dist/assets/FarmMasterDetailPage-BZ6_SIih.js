import{s as w}from"./index-BtjAULjs.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const y=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,u="commercial-farm-master-1",k={water:{field:"waterDistanceCm",unit:"cm",label:"Water Level",normal:e=>e>=3&&e<=30},gas:{field:"gasRaw",unit:"raw",label:"Gas",normal:e=>e<3e3},co2:{field:"co2Ppm",unit:"ppm",label:"CO₂",normal:e=>e<1500},energy:{field:"energyKwh",unit:"kWh",label:"Energy",normal:e=>e>=0}},$=["water","gas","co2","energy"];async function T(e={}){const a=e.key||"water",n=e.from||"dash-c",r=document.getElementById("screenContainer");r.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:#f0fdf4;height:100vh;align-items:center;justify-content:center;color:#047857;font-size:0.95rem;font-weight:700;">
            Loading Farm Master...
        </div>
    `;const t=await C(),i=$.map(s=>{const d=k[s],c=t?Number(t[d.field]??null):null,f=c!==null&&Number.isFinite(c),p=f?d.normal(c)?"Normal":"Check":"No Data",m=f?h(c):"--";return{key:s,meta:d,value:m,status:p}}),o=i.some(s=>s.status==="Check")?"Check":i.some(s=>s.status==="Normal")?"Normal":"Offline";r.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:#f0f9ff;height:100vh;position:relative;color:#17231b;">

            <!-- Header -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;background:rgba(255,255,255,.94);border-bottom:1px solid #bbf7d0;backdrop-filter:blur(12px);">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="fmBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid #bbf7d0;background:#fff;font-size:1.25rem;font-weight:900;color:#17231b;cursor:pointer;flex-shrink:0;">←</button>
                    <div>
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:#047857;">Farm Master · ${v(u)}</div>
                        <div style="font-weight:900;font-size:1.2rem;color:#17231b;">Overall Farm Sensors</div>
                    </div>
                </div>
                <div style="display:inline-flex;align-items:center;gap:8px;background:${o==="Normal"?"#ecfdf5":o==="Offline"?"#f1f5f9":"#fef2f2"};color:${o==="Normal"?"#047857":o==="Offline"?"#64748b":"#dc2626"};border:1px solid ${o==="Normal"?"#bbf7d0":o==="Offline"?"#e2e8f0":"#fecaca"};padding:8px 14px;border-radius:999px;font-size:0.78rem;font-weight:900;flex-shrink:0;">
                    <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>
                    ${o==="Normal"?"All Normal":o==="Offline"?"Offline":"Alert"}
                </div>
            </div>

            <!-- Body -->
            <div style="flex:1;overflow-y:auto;padding:20px;">

                <!-- What farm master monitors -->
                <div style="background:#ecfdf5;border:1px solid #bbf7d0;border-radius:16px;padding:12px 14px;margin-bottom:16px;font-size:12px;color:#14532d;line-height:1.5;">
                    <strong style="display:block;margin-bottom:3px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#047857;">📡 Farm Master monitors</strong>
                    Overall farm infrastructure: water reservoir, ambient gas safety, CO₂ concentration, and energy consumption. Does not monitor individual zone crops.
                </div>

                <!-- Sensor cards -->
                <div style="font-size:10px;font-weight:950;color:#047857;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Tap a sensor to view history</div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px;">
                    ${i.map(s=>N(s)).join("")}
                </div>

                <!-- Spotlight -->
                <div style="display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:16px;margin-bottom:16px;">
                    <section style="background:#fff;border:1px solid #bbf7d0;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(5,150,105,.08);">
                        <div id="fmSpotlightLabel" style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading</div>
                        <div id="fmSpotlightValue" style="font-size:2.45rem;font-weight:950;color:#047857;line-height:1;">--<span id="fmSpotlightUnit" style="font-size:1rem;font-weight:800;color:#64748b;margin-left:6px;"></span></div>
                        <div id="fmSpotlightBadge" style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0;padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
                            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>Loading
                        </div>
                    </section>
                    <section style="background:#fff;border:1px solid #bbf7d0;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(5,150,105,.08);">
                        <div id="fmTrendLabel" style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Trend History</div>
                        <div id="fmTrendChart" style="width:100%;aspect-ratio:5/2;min-height:120px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.8rem;">Loading...</div>
                    </section>
                </div>

                <!-- History log -->
                <section style="background:#fff;border:1px solid #bbf7d0;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(3,105,161,.08);">
                    <div id="fmHistoryLabel" style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Historical Records</div>
                    <div id="fmHistoryLog" style="display:flex;flex-direction:column;gap:8px;">
                        <div style="color:#94a3b8;font-size:0.85rem;">Loading...</div>
                    </div>
                </section>
            </div>
        </div>
    `,S({backTarget:n,sensors:i,defaultKey:a})}function N({key:e,meta:a,value:n,status:r}){const t=r==="Check",i=r==="No Data",o=t?"#fff5f5":"#ffffff",s=t?"#fecaca":"#bae6fd",d=t?"#dc2626":i?"#94a3b8":"#047857",c=t?"#fef2f2":i?"#f1f5f9":"#ecfdf5",f=t?"#dc2626":i?"#94a3b8":"#047857",p=t?"#fecaca":i?"#e2e8f0":"#bbf7d0";return`
        <button class="fm-sensor-card" data-key="${e}"
            style="background:${o};border:1px solid ${s};border-radius:18px;padding:16px 14px;text-align:left;cursor:pointer;outline:none;box-shadow:0 4px 16px rgba(3,105,161,.07);transition:all .15s;">
            <div style="font-size:10px;font-weight:950;color:#047857;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${a.label}</div>
            <div style="font-size:2rem;font-weight:950;color:${d};line-height:1;margin-bottom:10px;">
                ${n}<span style="font-size:0.75rem;font-weight:800;color:#94a3b8;margin-left:4px;">${n!=="--"?a.unit:""}</span>
            </div>
            <div style="display:inline-flex;align-items:center;gap:5px;background:${c};color:${f};border:1px solid ${p};padding:5px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;">
                <span style="width:5px;height:5px;border-radius:999px;background:currentColor;display:inline-block;"></span>${r}
            </div>
        </button>
    `}function S({backTarget:e,sensors:a,defaultKey:n}){document.getElementById("fmBackBtn").onclick=()=>w(e),document.querySelectorAll(".fm-sensor-card").forEach(t=>{t.addEventListener("click",()=>{const i=t.getAttribute("data-key");document.querySelectorAll(".fm-sensor-card").forEach(o=>o.style.outline=o===t?"2px solid #047857":"none"),x(i,a)})});const r=a.find(t=>t.key===n&&t.status!=="No Data")||a.find(t=>t.status!=="No Data")||a[0];document.querySelectorAll(".fm-sensor-card").forEach(t=>{t.style.outline=t.getAttribute("data-key")===r.key?"2px solid #047857":"none"}),x(r.key,a)}function x(e,a){const n=a.find(o=>o.key===e)||a[0];if(!n)return;const r=(o,s)=>{const d=document.getElementById(o);d&&(d.textContent=s)};r("fmSpotlightLabel",`Current · ${n.meta.label}`),r("fmTrendLabel",`Trend History · ${n.meta.label}`),r("fmHistoryLabel",`Historical Records · ${n.meta.label}`),r("fmSpotlightUnit",n.value!=="--"?n.meta.unit:"");const t=document.getElementById("fmSpotlightValue");t&&(t.childNodes[0].textContent=n.value,t.style.color=n.status==="Normal"?"#047857":n.status==="No Data"?"#94a3b8":"#dc2626");const i=document.getElementById("fmSpotlightBadge");if(i){const o=n.status==="Normal",s=n.status==="No Data";i.style.background=o?"#ecfdf5":s?"#f1f5f9":"#fef2f2",i.style.color=o?"#166534":s?"#64748b":"#dc2626",i.style.border=`1px solid ${o?"#bbf7d0":s?"#e2e8f0":"#fecaca"}`,i.innerHTML=`<span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${n.status}`}L(n.meta)}async function C(){const e=[`${y}/api/sensors/latest?deviceId=${u}`];for(const a of e)try{const r=await(await fetch(a)).json();if(r!=null&&r.reading)return r.reading}catch{}return null}async function L(e){try{const r=(await(await fetch(`${y}/api/sensors/history?deviceId=${u}&limit=8`)).json()).readings||[];if(!r.length)return;const t=r.map(l=>Number(l[e.field]??0)).reverse(),i=Math.max(...t,1),o=Math.min(...t,0),s=i-o||1,d=t.map((l,g)=>({x:(g/(t.length-1||1)*100).toFixed(1),y:(35-(l-o)/s*25).toFixed(1)})),c=`M ${d.map(l=>`${l.x},${l.y}`).join(" L ")}`,f=`${c} L 100,40 L 0,40 Z`,p=document.getElementById("fmTrendChart");p&&(p.innerHTML=`
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
                <defs>
                    <linearGradient id="fmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="rgba(5,150,105,.25)"/>
                        <stop offset="100%" stop-color="rgba(3,105,161,0)"/>
                    </linearGradient>
                </defs>
                <path d="${f}" fill="url(#fmGrad)"/>
                <path d="${c}" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${d.map(l=>`<circle cx="${l.x}" cy="${l.y}" r="1.5" fill="#fff" stroke="#10B981" stroke-width="1"/>`).join("")}
            </svg>`);const m=document.getElementById("fmHistoryLog");m&&(m.innerHTML=r.map(l=>{const g=Number(l[e.field]??0),b=e.normal(g)?"Normal":"Check";return`
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:13px 0;border-bottom:1px solid #ecfdf5;align-items:center;">
                    <span style="color:#64748b;font-weight:700;">${l.createdAt?new Date(l.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"--:--"}</span>
                    <span style="font-weight:950;color:#17231b;">${h(g)} <span style="font-size:0.72rem;color:#64748b;">${v(e.unit)}</span></span>
                    <span style="text-align:right;"><span style="background:${b==="Normal"?"#ecfdf5":"#fef2f2"};color:${b==="Normal"?"#166534":"#dc2626"};border:1px solid ${b==="Normal"?"#bbf7d0":"#fecaca"};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;">${b}</span></span>
                </div>`}).join(""))}catch(a){console.error("Farm master history load failed:",a)}}function h(e){return Number.isFinite(e)?Math.abs(e)>=100?String(Math.round(e)):Number.isInteger(e)?String(e):e.toFixed(1).replace(/\.0$/,""):"0"}function v(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{T as render};
