import{A as f,s as u}from"./index-CCfX1pzx.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const y=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,g={temp:{field:"temperature",unit:"deg C",label:"Temperature",normal:e=>e>=18&&e<=35},humid:{field:"humidity",unit:"%",label:"Humidity",normal:e=>e>=35&&e<=80},ph:{field:"ph",unit:"pH",label:"pH",normal:e=>e>=5.5&&e<=7.5},light:{field:"lightRaw",unit:"raw",label:"Light",normal:e=>e>=1500},water:{field:"waterDistanceCm",unit:"cm",label:"Water",normal:e=>e>=3&&e<=30},nutrient:{field:"gasRaw",unit:"raw",label:"Gas",normal:e=>e<3e3},gas:{field:"gasRaw",unit:"raw",label:"Gas",normal:e=>e<3e3}};async function B(e={}){const a=e.key||e.sensor||"temp",r=g[a]||g.temp,s=e.name||r.label||"Sensor",i=e.from==="dash-c"||f.mode==="commercial",l=e.from||(i?"dash-c":"home"),d=document.getElementById("screenContainer");if(!d){console.error("SensorDetailPage cannot render: #screenContainer not found");return}const n=await v(r,e),m=w(n),t=k(i);d.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:${t.page};height:100vh;position:relative;color:${t.text};">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="detailBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid ${t.border};background:${t.surface};box-shadow:${t.buttonShadow};font-size:1.25rem;font-weight:900;color:${t.text};cursor:pointer;flex-shrink:0;">←</button>
                    <div style="min-width:0;">
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${t.accent};">${i?"Commercial Sensor":"Live Sensor"}</div>
                        <div style="font-weight:900;font-size:1.12rem;color:${t.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c(s)} Analysis</div>
                    </div>
                </div>
            </div>

            <div style="flex:1;overflow-y:auto;padding:0 20px 20px 20px;">
                <div style="display:grid;grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);gap:16px;margin-bottom:16px;">
                    <section style="background:${t.surface};border:1px solid ${t.border};border-radius:24px;padding:22px;box-shadow:${t.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:${t.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading</div>
                        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
                            <span style="font-size:2.45rem;font-weight:950;color:${t.accent};line-height:1;">${c(n[0].val)}</span>
                            <span style="font-size:1rem;font-weight:800;color:${t.muted};">${c(r.unit)}</span>
                        </div>
                        <div style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:${n[0].status==="Normal"?t.soft:"#fef2f2"};color:${n[0].status==="Normal"?t.accentDark:"#dc2626"};border:1px solid ${n[0].status==="Normal"?t.softBorder:"#fecaca"};padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
                            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${n[0].status}
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
                                <path d="${m.areaPath}" fill="url(#sensorGrad)"></path>
                                <path d="${m.linePath}" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                ${m.interactiveSlices}
                            </svg>
                            <div id="chartTooltip" style="display:none;position:absolute;top:-10px;background:${t.tooltip};color:#fff;padding:6px 10px;border-radius:10px;font-size:0.78rem;pointer-events:none;white-space:nowrap;transform:translateX(-50%);z-index:10;text-align:center;"></div>
                        </div>
                    </section>
                </div>

                <section style="background:${t.surface};border:1px solid ${t.border};border-radius:24px;padding:22px;box-shadow:${t.shadow};">
                    <div style="font-size:0.72rem;font-weight:950;color:${t.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Historical Records</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${n.map(p=>`
                            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:0.9rem;padding:13px 0;border-bottom:1px solid ${t.line};align-items:center;">
                                <span style="color:${t.muted};font-weight:700;">${c(p.time)}</span>
                                <span style="font-weight:950;color:${t.text};">${c(p.val)} <span style="font-size:0.72rem;color:${t.muted};font-weight:800;">${c(r.unit)}</span></span>
                                <span style="text-align:right;">
                                    <span style="background:${p.status==="Normal"?t.soft:"#fef2f2"};color:${p.status==="Normal"?t.accentDark:"#dc2626"};border:1px solid ${p.status==="Normal"?t.softBorder:"#fecaca"};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;white-space:nowrap;">${p.status}</span>
                                </span>
                            </div>
                        `).join("")}
                    </div>
                </section>
            </div>

        </div>
    `,$({backTarget:l,sensorKey:a,unit:r.unit,params:e})}async function v(e,a={}){try{const r=F(),s=a.deviceId||(r==null?void 0:r.deviceId)||"farm_001",d=(await(await fetch(`${y}/api/sensors/history?deviceId=${s}&limit=8`)).json()).readings;if(!Array.isArray(d)||d.length===0)throw new Error("No data");return d.map(n=>{const m=n[e.field],t=Number(m??0);return{time:n.createdAt?new Date(n.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"--:--",val:Number.isFinite(t)?S(t):"0",status:e.normal(t)?"Normal":"Check"}})}catch(r){return console.error("Sensor history fetch error:",r),[{time:"N/A",val:"0",status:"Offline"}]}}function w(e){const a=[...e].reverse(),r=a.map(o=>Number.parseFloat(o.val)||0),s=Math.max(...r,1),i=Math.min(...r,0),l=s-i||1,d=a.map((o,h)=>{const x=h/(a.length-1||1)*100,b=35-(Number.parseFloat(o.val)-i)/l*25;return{x:x.toFixed(1),y:b.toFixed(1),val:o.val,time:o.time}}),n=`M ${d.map(o=>`${o.x},${o.y}`).join(" L ")}`,m=`${n} L 100,40 L 0,40 Z`,t=100/(d.length-1||1),p=d.map(o=>`
        <circle cx="${o.x}" cy="${o.y}" r="1.5" fill="#FFFFFF" stroke="#10B981" stroke-width="1" pointer-events="none"></circle>
        <rect class="chart-slice" data-val="${c(o.val)}" data-time="${c(o.time)}" data-cx="${o.x}"
              x="${o.x-t/2}" y="0" width="${t}" height="40"
              fill="transparent" style="cursor:crosshair;pointer-events:all;outline:none;"></rect>
    `).join("");return{linePath:n,areaPath:m,interactiveSlices:p}}function $({backTarget:e,sensorKey:a,unit:r,params:s={}}){document.getElementById("detailBackBtn").onclick=()=>{(s==null?void 0:s.from)==="zone-detail"?u("zone-detail",s.returnParams||{}):u(e)};const i=document.getElementById("chartTooltip");document.querySelectorAll(".chart-slice").forEach(l=>{l.addEventListener("pointerenter",()=>{i.innerHTML=`<div style="font-size:0.7rem;opacity:.8;">${l.getAttribute("data-time")}</div><b>${l.getAttribute("data-val")} ${c(r)}</b>`,i.style.left=`${l.getAttribute("data-cx")}%`,i.style.display="block"}),l.addEventListener("pointerleave",()=>i.style.display="none")})}function F(){if(f.currentFarm)return f.currentFarm;try{const e=JSON.parse(localStorage.getItem("user_farms"))||[];return e.find(a=>a.id===f.currentFarmId)||e[e.length-1]||null}catch{return null}}function k(e){return e?{page:"#f8faf7",surface:"rgba(255,255,255,.94)",text:"#17231b",muted:"#64748b",accent:"#047857",accentDark:"#166534",soft:"#ecfdf5",softBorder:"#bbf7d0",border:"#e5e7eb",line:"#eef2f7",shadow:"0 16px 44px rgba(15,23,42,.08)",buttonShadow:"0 12px 30px rgba(15,23,42,.08)",chartFillTop:"rgba(16,185,129,.30)",tooltip:"#166534"}:{page:"#F0FDF4",surface:"#FFFFFF",text:"#065F46",muted:"#64748B",accent:"#10B981",accentDark:"#065F46",soft:"#D1FAE5",softBorder:"#A7F3D0",border:"#D1FAE5",line:"#F8FAFC",shadow:"0 8px 24px rgba(5,150,105,.06)",buttonShadow:"none",chartFillTop:"rgba(16,185,129,.40)",tooltip:"#065F46"}}function S(e){return Number.isFinite(e)?Math.abs(e)>=100?String(Math.round(e)):Number.isInteger(e)?String(e):e.toFixed(1).replace(/\.0$/,""):"0"}function c(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{B as render};
