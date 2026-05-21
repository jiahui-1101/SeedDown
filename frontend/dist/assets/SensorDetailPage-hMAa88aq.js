import{A as u,s as g}from"./index-BwcRKJkh.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const y=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,m={temp:{field:"temperature",unit:"deg C",label:"Temperature",normal:e=>e>=18&&e<=35},humid:{field:"humidity",unit:"%",label:"Humidity",normal:e=>e>=35&&e<=80},ph:{field:"ph",unit:"pH",label:"pH",normal:e=>e>=5.5&&e<=7.5},light:{field:"lightRaw",unit:"raw",label:"Light",normal:e=>e>=1500},water:{field:"waterDistanceCm",unit:"cm",label:"Water",normal:e=>e>=3&&e<=30},nutrient:{field:"gasRaw",unit:"raw",label:"Gas",normal:e=>e<3e3},gas:{field:"gasRaw",unit:"raw",label:"Gas",normal:e=>e<3e3}};async function B(e={}){const n=e.key||e.sensor||"temp",r=m[n]||m.temp,l=e.name||r.label||"Sensor",a=e.from==="dash-c"||u.mode==="commercial",i=e.from||(a?"dash-c":"home"),d=document.getElementById("screenContainer");if(!d){console.error("SensorDetailPage cannot render: #screenContainer not found");return}const s=await $(r,e),c=F(s),t=A(a);d.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:${t.page};height:100vh;position:relative;color:${t.text};">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="detailBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid ${t.border};background:${t.surface};box-shadow:${t.buttonShadow};font-size:1.25rem;font-weight:900;color:${t.text};cursor:pointer;flex-shrink:0;">←</button>
                    <div style="min-width:0;">
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${t.accent};">${a?"Commercial Sensor":"Live Sensor"}</div>
                        <div style="font-weight:900;font-size:1.12rem;color:${t.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p(l)} Analysis</div>
                    </div>
                </div>
            </div>

            <div style="flex:1;overflow-y:auto;padding:0 20px 20px 20px;">
                <div style="display:grid;grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);gap:16px;margin-bottom:16px;">
                    <section style="background:${t.surface};border:1px solid ${t.border};border-radius:24px;padding:22px;box-shadow:${t.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:${t.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading</div>
                        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
                            <span style="font-size:2.45rem;font-weight:950;color:${t.accent};line-height:1;">${p(s[0].val)}</span>
                            <span style="font-size:1rem;font-weight:800;color:${t.muted};">${p(r.unit)}</span>
                        </div>
                        <div style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:${s[0].status==="Normal"?t.soft:"#fef2f2"};color:${s[0].status==="Normal"?t.accentDark:"#dc2626"};border:1px solid ${s[0].status==="Normal"?t.softBorder:"#fecaca"};padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
                            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${s[0].status}
                        </div>
                    </section>

                    <section style="background:${t.surface};border:1px solid ${t.border};border-radius:24px;padding:22px;box-shadow:${t.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:${t.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Trend History</div>
                        <div style="width:100%;aspect-ratio:5 / 2;min-height:150px;position:relative;margin:0 auto;">
                            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible;display:block;">
                                <defs>
                                    <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="${t.chartFillTop}"/>
                                        <stop offset="100%" stop-color="rgba(16,185,129,0)"/>
                                    </linearGradient>
                                </defs>
                                <path d="${c.areaPath}" fill="url(#sensorGrad)"></path>
                                <path d="${c.linePath}" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                ${c.interactiveSlices}
                            </svg>
                            <div id="chartTooltip" style="display:none;position:absolute;top:-10px;background:${t.tooltip};color:#fff;padding:6px 10px;border-radius:10px;font-size:0.78rem;pointer-events:none;white-space:nowrap;transform:translateX(-50%);z-index:10;text-align:center;"></div>
                        </div>
                    </section>
                </div>

                <section style="background:${t.surface};border:1px solid ${t.border};border-radius:24px;padding:22px;box-shadow:${t.shadow};">
                    <div style="font-size:0.72rem;font-weight:950;color:${t.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Historical Records</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${s.map(f=>`
                            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:0.9rem;padding:13px 0;border-bottom:1px solid ${t.line};align-items:center;">
                                <span style="color:${t.muted};font-weight:700;">${p(f.time)}</span>
                                <span style="font-weight:950;color:${t.text};">${p(f.val)} <span style="font-size:0.72rem;color:${t.muted};font-weight:800;">${p(r.unit)}</span></span>
                                <span style="text-align:right;">
                                    <span style="background:${f.status==="Normal"?t.soft:"#fef2f2"};color:${f.status==="Normal"?t.accentDark:"#dc2626"};border:1px solid ${f.status==="Normal"?t.softBorder:"#fecaca"};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;white-space:nowrap;">${f.status}</span>
                                </span>
                            </div>
                        `).join("")}
                    </div>
                </section>
            </div>

        </div>
    `,k({backTarget:i,sensorKey:n,unit:r.unit,params:e})}const v={starter:"beginner_starter",beginner_starter:"beginner_starter",standard:"beginner_standard",beginner_standard:"beginner_standard",pro:"beginner_pro",beginner_pro:"beginner_pro"};function w(e={}){if(e.deviceId&&e.deviceId!=="farm_001"&&!String(e.deviceId).startsWith("dev_"))return e.deviceId;const n=S(),r=n==null?void 0:n.deviceId;if(r&&r!=="farm_001"&&!String(r).startsWith("dev_"))return r;const l=String((n==null?void 0:n.packageLevel)||"").toLowerCase();return v[l]||"beginner_standard"}async function $(e,n={}){try{const r=w(n),i=(await(await fetch(`${y}/api/sensors/history?deviceId=${r}&limit=8`)).json()).readings;if(!Array.isArray(i)||i.length===0)throw new Error("No data");return i.map(d=>{const s=d[e.field],c=Number(s??0);return{time:d.createdAt?new Date(d.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"--:--",val:Number.isFinite(c)?N(c):"0",status:e.normal(c)?"Normal":"Check"}})}catch(r){return console.error("Sensor history fetch error:",r),[{time:"N/A",val:"0",status:"Offline"}]}}function F(e){const n=[...e].reverse(),r=n.map(o=>Number.parseFloat(o.val)||0),l=Math.max(...r,1),a=Math.min(...r,0),i=l-a||1,d=n.map((o,h)=>{const x=h/(n.length-1||1)*100,b=35-(Number.parseFloat(o.val)-a)/i*25;return{x:x.toFixed(1),y:b.toFixed(1),val:o.val,time:o.time}}),s=`M ${d.map(o=>`${o.x},${o.y}`).join(" L ")}`,c=`${s} L 100,40 L 0,40 Z`,t=100/(d.length-1||1),f=d.map(o=>`
        <circle cx="${o.x}" cy="${o.y}" r="1.5" fill="#FFFFFF" stroke="#10B981" stroke-width="1" pointer-events="none"></circle>
        <rect class="chart-slice" data-val="${p(o.val)}" data-time="${p(o.time)}" data-cx="${o.x}"
              x="${o.x-t/2}" y="0" width="${t}" height="40"
              fill="transparent" style="cursor:crosshair;pointer-events:all;outline:none;"></rect>
    `).join("");return{linePath:s,areaPath:c,interactiveSlices:f}}function k({backTarget:e,sensorKey:n,unit:r,params:l={}}){document.getElementById("detailBackBtn").onclick=()=>{(l==null?void 0:l.from)==="zone-detail"?g("zone-detail",l.returnParams||{}):g(e)};const a=document.getElementById("chartTooltip");document.querySelectorAll(".chart-slice").forEach(i=>{i.addEventListener("pointerenter",()=>{a.innerHTML=`<div style="font-size:0.7rem;opacity:.8;">${i.getAttribute("data-time")}</div><b>${i.getAttribute("data-val")} ${p(r)}</b>`,a.style.left=`${i.getAttribute("data-cx")}%`,a.style.display="block"}),i.addEventListener("pointerleave",()=>a.style.display="none")})}function S(){if(u.currentFarm)return u.currentFarm;try{const e=JSON.parse(localStorage.getItem("user_farms"))||[];return e.find(n=>n.id===u.currentFarmId)||e[e.length-1]||null}catch{return null}}function A(e){return e?{page:"#f8faf7",surface:"rgba(255,255,255,.94)",text:"#17231b",muted:"#64748b",accent:"#047857",accentDark:"#166534",soft:"#ecfdf5",softBorder:"#bbf7d0",border:"#e5e7eb",line:"#eef2f7",shadow:"0 16px 44px rgba(15,23,42,.08)",buttonShadow:"0 12px 30px rgba(15,23,42,.08)",chartFillTop:"rgba(16,185,129,.30)",tooltip:"#166534"}:{page:"#F0FDF4",surface:"#FFFFFF",text:"#065F46",muted:"#64748B",accent:"#10B981",accentDark:"#065F46",soft:"#D1FAE5",softBorder:"#A7F3D0",border:"#D1FAE5",line:"#F8FAFC",shadow:"0 8px 24px rgba(5,150,105,.06)",buttonShadow:"none",chartFillTop:"rgba(16,185,129,.40)",tooltip:"#065F46"}}function N(e){return Number.isFinite(e)?Math.abs(e)>=100?String(Math.round(e)):Number.isInteger(e)?String(e):e.toFixed(1).replace(/\.0$/,""):"0"}function p(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{B as render};
