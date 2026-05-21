import{A as f,t as x,s as m,r as g}from"./index-Cib2v6Mx.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const $=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,h={temp:{field:"temperature",unit:"deg C",label:"Temperature",normal:e=>e>=18&&e<=35},humid:{field:"humidity",unit:"%",label:"Humidity",normal:e=>e>=35&&e<=80},ph:{field:"ph",unit:"pH",label:"pH",normal:e=>e>=5.5&&e<=7.5},light:{field:"lightRaw",unit:"raw",label:"Light",normal:e=>e>=1500},water:{field:"waterDistanceCm",unit:"cm",label:"Water",normal:e=>e>=3&&e<=30},nutrient:{field:"gasRaw",unit:"raw",label:"Gas",normal:e=>e<3e3},gas:{field:"gasRaw",unit:"raw",label:"Gas",normal:e=>e<3e3}};async function C(e={}){const r=e.key||e.sensor||"temp",n=h[r]||h.temp,l=e.name||n.label||"Sensor",s=e.from==="dash-c"||f.mode==="commercial",a=e.from||(s?"dash-c":"home"),d=document.getElementById("screenContainer");if(!d){console.error("SensorDetailPage cannot render: #screenContainer not found");return}const o=await k(n,e),u=S(o),t=z(s);d.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:${t.page};height:100vh;position:relative;color:${t.text};">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="detailBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid ${t.border};background:${t.surface};box-shadow:${t.buttonShadow};font-size:1.25rem;font-weight:900;color:${t.text};cursor:pointer;flex-shrink:0;">←</button>
                    <div style="min-width:0;">
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${t.accent};">${s?"Commercial Sensor":"Live Sensor"}</div>
                        <div style="font-weight:900;font-size:1.12rem;color:${t.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c(l)} Analysis</div>
                    </div>
                </div>
            </div>

            <div style="flex:1;overflow-y:auto;padding:0 20px 20px 20px;">
                <div style="display:grid;grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);gap:16px;margin-bottom:16px;">
                    <section style="background:${t.surface};border:1px solid ${t.border};border-radius:24px;padding:22px;box-shadow:${t.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:${t.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading</div>
                        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
                            <span style="font-size:2.45rem;font-weight:950;color:${t.accent};line-height:1;">${c(o[0].val)}</span>
                            <span style="font-size:1rem;font-weight:800;color:${t.muted};">${c(n.unit)}</span>
                        </div>
                        <div style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:${o[0].status==="Normal"?t.soft:"#fef2f2"};color:${o[0].status==="Normal"?t.accentDark:"#dc2626"};border:1px solid ${o[0].status==="Normal"?t.softBorder:"#fecaca"};padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
                            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${o[0].status}
                        </div>
                    </section>

                    <section style="background:${t.surface};border:1px solid ${t.border};border-radius:24px;padding:22px;box-shadow:${t.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:${t.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Trend History</div>
                        <div style="width:100%;aspect-ratio:5 / 2;min-height:150px;position:relative;margin:0 auto;">
                            ${u.empty?`<div style="height:100%;display:flex;align-items:center;justify-content:center;color:${t.muted};font-size:0.85rem;font-weight:800;">Waiting for live data</div>`:`<svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible;display:block;">
                                <defs>
                                    <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="${t.chartFillTop}"/>
                                        <stop offset="100%" stop-color="rgba(16,185,129,0)"/>
                                    </linearGradient>
                                </defs>
                                <path d="${u.areaPath}" fill="url(#sensorGrad)"></path>
                                <path d="${u.linePath}" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                ${u.interactiveSlices}
                            </svg>`}
                            <div id="chartTooltip" style="display:none;position:absolute;top:-10px;background:${t.tooltip};color:#fff;padding:6px 10px;border-radius:10px;font-size:0.78rem;pointer-events:none;white-space:nowrap;transform:translateX(-50%);z-index:10;text-align:center;"></div>
                        </div>
                    </section>
                </div>

                <section style="background:${t.surface};border:1px solid ${t.border};border-radius:24px;padding:22px;box-shadow:${t.shadow};">
                    <div style="font-size:0.72rem;font-weight:950;color:${t.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Historical Records</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${o.map(p=>`
                            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:0.9rem;padding:13px 0;border-bottom:1px solid ${t.line};align-items:center;">
                                <span style="color:${t.muted};font-weight:700;">${c(p.time)}</span>
                                <span style="font-weight:950;color:${t.text};">${c(p.val)} <span style="font-size:0.72rem;color:${t.muted};font-weight:800;">${c(n.unit)}</span></span>
                                <span style="text-align:right;">
                                    <span style="background:${p.status==="Normal"?t.soft:"#fef2f2"};color:${p.status==="Normal"?t.accentDark:"#dc2626"};border:1px solid ${p.status==="Normal"?t.softBorder:"#fecaca"};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;white-space:nowrap;">${p.status}</span>
                                </span>
                            </div>
                        `).join("")}
                    </div>
                </section>
            </div>

        </div>
    `,A({backTarget:a,sensorKey:r,unit:n.unit,params:e})}const w={starter:"beginner_starter",beginner_starter:"beginner_starter",standard:"beginner_standard",beginner_standard:"beginner_standard",pro:"beginner_pro",beginner_pro:"beginner_pro"};function F(e={}){if(e.deviceId&&e.deviceId!=="farm_001"&&!String(e.deviceId).startsWith("dev_"))return e.deviceId;const r=_(),n=r==null?void 0:r.deviceId;if(n&&n!=="farm_001"&&!String(n).startsWith("dev_"))return n;const l=String((r==null?void 0:r.packageLevel)||"").toLowerCase();return w[l]||"beginner_standard"}async function k(e,r={}){try{const n=F(r),a=(await(await fetch(`${$}/api/sensors/history?deviceId=${n}&limit=8`)).json()).readings;if(!Array.isArray(a)||a.length===0)throw new Error("No data");return a.map(d=>{const o=N(d,e.field);return{time:d.createdAt?new Date(d.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"--:--",numeric:o,val:o!==null?E(o):"--",status:o===null?"No Data":e.normal(o)?"Normal":"Check"}})}catch(n){return console.error("Sensor history fetch error:",n),[{time:"N/A",numeric:null,val:"--",status:"Offline"}]}}function S(e){const r=[...e].reverse().filter(i=>x(i.numeric)!==null);if(!r.length)return{empty:!0,linePath:"",areaPath:"",interactiveSlices:""};const n=r.map(i=>i.numeric),l=Math.max(...n,1),s=Math.min(...n,0),a=l-s||1,d=r.map((i,b)=>{const y=b/(r.length-1||1)*100,v=35-(i.numeric-s)/a*25;return{x:y.toFixed(1),y:v.toFixed(1),val:i.val,time:i.time}}),o=`M ${d.map(i=>`${i.x},${i.y}`).join(" L ")}`,u=`${o} L 100,40 L 0,40 Z`,t=100/(d.length-1||1),p=d.map(i=>`
        <circle cx="${i.x}" cy="${i.y}" r="1.5" fill="#FFFFFF" stroke="#10B981" stroke-width="1" pointer-events="none"></circle>
        <rect class="chart-slice" data-val="${c(i.val)}" data-time="${c(i.time)}" data-cx="${i.x}"
              x="${i.x-t/2}" y="0" width="${t}" height="40"
              fill="transparent" style="cursor:crosshair;pointer-events:all;outline:none;"></rect>
    `).join("");return{linePath:o,areaPath:u,interactiveSlices:p}}function A({backTarget:e,sensorKey:r,unit:n,params:l={}}){document.getElementById("detailBackBtn").onclick=()=>{(l==null?void 0:l.from)==="zone-detail"?m("zone-detail",l.returnParams||{}):m(e)};const s=document.getElementById("chartTooltip");document.querySelectorAll(".chart-slice").forEach(a=>{a.addEventListener("pointerenter",()=>{s.innerHTML=`<div style="font-size:0.7rem;opacity:.8;">${a.getAttribute("data-time")}</div><b>${a.getAttribute("data-val")} ${c(n)}</b>`,s.style.left=`${a.getAttribute("data-cx")}%`,s.style.display="block"}),a.addEventListener("pointerleave",()=>s.style.display="none")})}function _(){if(f.currentFarm)return f.currentFarm;try{const e=JSON.parse(localStorage.getItem("user_farms"))||[];return e.find(r=>r.id===f.currentFarmId)||e[e.length-1]||null}catch{return null}}function z(e){return e?{page:"#f8faf7",surface:"rgba(255,255,255,.94)",text:"#17231b",muted:"#64748b",accent:"#047857",accentDark:"#166534",soft:"#ecfdf5",softBorder:"#bbf7d0",border:"#e5e7eb",line:"#eef2f7",shadow:"0 16px 44px rgba(15,23,42,.08)",buttonShadow:"0 12px 30px rgba(15,23,42,.08)",chartFillTop:"rgba(16,185,129,.30)",tooltip:"#166534"}:{page:"#F0FDF4",surface:"#FFFFFF",text:"#065F46",muted:"#64748B",accent:"#10B981",accentDark:"#065F46",soft:"#D1FAE5",softBorder:"#A7F3D0",border:"#D1FAE5",line:"#F8FAFC",shadow:"0 8px 24px rgba(5,150,105,.06)",buttonShadow:"none",chartFillTop:"rgba(16,185,129,.40)",tooltip:"#065F46"}}function E(e){return Number.isFinite(e)?Math.abs(e)>=100?String(Math.round(e)):Number.isInteger(e)?String(e):e.toFixed(1).replace(/\.0$/,""):"--"}function N(e,r){return r==="temperature"?g(e,["temperature","temp"]):r==="humidity"?g(e,["humidity","humid","hum"]):x(e==null?void 0:e[r])}function c(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{C as render};
