import{A as b,s as g}from"./index-gad9dhrQ.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const v=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,u={temp:{field:"temperature",unit:"deg C",label:"Temperature",normal:t=>t>=18&&t<=35},humid:{field:"humidity",unit:"%",label:"Humidity",normal:t=>t>=35&&t<=80},ph:{field:"ph",unit:"pH",label:"pH",normal:t=>t>=5.5&&t<=7.5},light:{field:"lightRaw",unit:"raw",label:"Light",normal:t=>t>=1500},water:{field:"waterDistanceCm",unit:"cm",label:"Water",normal:t=>t>=3&&t<=30},nutrient:{field:"gasRaw",unit:"raw",label:"Gas",normal:t=>t<3e3},gas:{field:"gasRaw",unit:"raw",label:"Gas",normal:t=>t<3e3}};async function N(t={}){const d=t.key||t.sensor||"temp",n=u[d]||u.temp;let i=n.label||"Sensor";t.zoneId==="overall"?i="Overall Farm":t.zoneId&&(i=t.zoneId.replace("_"," ").toUpperCase());const r=t.from==="dash-c"||t.from==="zone-detail"||b.mode==="commercial",l=t.from||(r?"dash-c":"home"),f=document.getElementById("screenContainer"),o=await $(n,t),c=w(o),e=z(r);f.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:${e.page};height:100vh;position:relative;color:${e.text};">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="detailBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid ${e.border};background:${e.surface};box-shadow:${e.buttonShadow};font-size:1.25rem;font-weight:900;color:${e.text};cursor:pointer;flex-shrink:0;">←</button>
                    <div style="min-width:0;">
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${e.accent};">${r?"Commercial Sensor":"Live Sensor"}</div>
                        <div style="font-weight:900;font-size:1.12rem;color:${e.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m(i)} Analysis</div>
                    </div>
                </div>
            </div>

            <div style="flex:1;overflow-y:auto;padding:0 20px 20px 20px;">
                <div style="display:grid;grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);gap:16px;margin-bottom:16px;">
                    <section style="background:${e.surface};border:1px solid ${e.border};border-radius:24px;padding:22px;box-shadow:${e.shadow};">
<div style="font-size:0.72rem;font-weight:950;color:${e.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Overall Status</div>
<div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
    <span style="font-size:2.45rem;font-weight:950;color:${o[0].status==="Normal"?e.accent:"#dc2626"};line-height:1;">${o[0].status==="Normal"?"Normal":"Unnormal"}</span>
</div>
                        
                        <div style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:${o[0].status==="Normal"?e.soft:"#fef2f2"};color:${o[0].status==="Normal"?e.accentDark:"#dc2626"};border:1px solid ${o[0].status==="Normal"?e.softBorder:"#fecaca"};padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
                            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${o[0].status}
                        </div>
                    </section>

                    <section style="background:${e.surface};border:1px solid ${e.border};border-radius:24px;padding:22px;box-shadow:${e.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:${e.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Trend History</div>
                        <div style="width:100%;aspect-ratio:5 / 2;min-height:150px;position:relative;margin:0 auto;">
                            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible;display:block;">
                                <defs>
                                    <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="${e.chartFillTop}"/>
                                        <stop offset="100%" stop-color="rgba(16,185,129,0)"/>
                                    </linearGradient>
                                </defs>
                                <path d="${c.areaPath}" fill="url(#sensorGrad)"></path>
                                <path d="${c.linePath}" fill="none" stroke="${e.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                ${c.interactiveSlices}
                            </svg>
                            <div id="chartTooltip" style="display:none;position:absolute;top:-10px;background:${e.tooltip};color:#fff;padding:6px 10px;border-radius:10px;font-size:0.78rem;pointer-events:none;white-space:nowrap;transform:translateX(-50%);z-index:10;text-align:center;"></div>
                        </div>
                    </section>
                </div>

                <section style="background:${e.surface};border:1px solid ${e.border};border-radius:24px;padding:22px;box-shadow:${e.shadow};margin-bottom:16px;">
                    ${o[0].status==="Normal"?`
                        <div style="font-size:0.72rem;font-weight:950;color:#16a34a;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px;display:flex;align-items:center;gap:6px;">
                            <span style="width:8px;height:8px;border-radius:50%;background:#16a34a;display:inline-block;"></span> All Zones Nominal · Select to Inspect
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
                            ${x().map(a=>`
    <button class="drill-zone-btn" data-zone="${a.id}" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;border-radius:16px;border:1px solid ${e.border};background:#f8fafc;cursor:pointer;transition:all 0.2s;gap:6px;outline:none;">
        <span style="font-size:0.9rem;font-weight:900;color:${e.text};">${a.label}</span>
        <span style="background:${e.soft};color:${e.accentDark};padding:2px 8px;border-radius:999px;font-size:0.65rem;font-weight:900;">Normal</span>
    </button>
`).join("")}
                        </div>
                    `:`
                        <div style="font-size:0.72rem;font-weight:950;color:#dc2626;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
                            <span style="width:8px;height:8px;border-radius:50%;background:#dc2626;display:inline-block;"></span> Anomaly Root-Cause Isolation
                        </div>
                        <div style="font-size:0.8rem;color:${e.muted};margin-bottom:14px;font-weight:700;">Overall variance breached. Locate the anomalous sub-node below:</div>
                        
                        <div style="display:flex;flex-direction:column;gap:10px;">
                            ${x().map((a,s)=>{const p=s===1;return`
        <div class="drill-zone-btn" data-zone="${a.id}" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-radius:16px;border:1px solid ${p?"#fecaca":e.border};background:${p?"#fff5f5":"#f8fafc"};cursor:pointer;transition:all 0.2s;">
            <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:0.95rem;font-weight:900;color:${e.text};">${a.label}</span>
                ${p?'<span style="font-size:0.75rem;color:#ef4444;font-weight:950;letter-spacing:0.5px;">[ Culprit Node ]</span>':""}
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="background:${p?"#fef2f2":e.soft};color:${p?"#dc2626":e.accentDark};border:1px solid ${p?"#fecaca":e.softBorder};padding:4px 10px;border-radius:999px;font-size:0.7rem;font-weight:900;">
                    ${p?"Check ⚠️":"Normal"}
                </span>
                <span style="font-size:1.2rem;color:${p?"#dc2626":e.accent};font-weight:bold;">→</span>
            </div>
        </div>
    `}).join("")}
                        </div>
                    `}
                </section>

                <section style="background:${e.surface};border:1px solid ${e.border};border-radius:24px;padding:22px;box-shadow:${e.shadow};">
                    <div style="font-size:0.72rem;font-weight:950;color:${e.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Macro Timeline Log</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${o.map(a=>`
                            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:0.9rem;padding:13px 0;border-bottom:1px solid ${e.line};align-items:center;">
                                <span style="color:${e.muted};font-weight:700;">${m(a.time)}</span>
                                <span style="font-weight:950;color:${e.text};">${m(a.val)} <span style="font-size:0.72rem;color:${e.muted};font-weight:800;">${m(n.unit)}</span></span>
                                <span style="text-align:right;">
                                    <span style="background:${a.status==="Normal"?e.soft:"#fef2f2"};color:${a.status==="Normal"?e.accentDark:"#dc2626"};border:1px solid ${a.status==="Normal"?e.softBorder:"#fecaca"};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;white-space:nowrap;">${a.status}</span>
                                </span>
                            </div>
                        `).join("")}
                    </div>
                </section>
            </div>

            <div id="customModal" style="display:none;position:absolute;inset:0;background:rgba(15,23,42,.22);z-index:999;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px);">
                <div style="background:${e.surface};width:100%;max-width:340px;border-radius:24px;padding:24px;box-shadow:0 24px 70px rgba(15,23,42,.18);border:1px solid ${e.border};">
                    <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${e.accent};margin-bottom:6px;">Preference</div>
                    <div style="font-size:1.1rem;font-weight:950;color:${e.text};margin-bottom:8px;">Set Record Interval</div>
                    <div style="font-size:0.85rem;color:${e.muted};margin-bottom:18px;">Set record interval for ${m(i)} in hours.</div>
                    <input type="number" id="prefInput" value="2" min="1" style="width:100%;box-sizing:border-box;padding:14px;border:1px solid ${e.border};border-radius:16px;font-weight:900;margin-bottom:18px;background:#f8fafc;color:${e.text};">
                    <div style="display:flex;gap:12px;">
                        <button id="cancelModalBtn" style="flex:1;padding:13px;border:1px solid ${e.border};background:#f8fafc;color:${e.muted};border-radius:16px;font-weight:900;cursor:pointer;">Cancel</button>
                        <button id="saveModalBtn" style="flex:1;padding:13px;border:none;background:${e.accentDark};color:white;border-radius:16px;font-weight:900;cursor:pointer;">Save</button>
                    </div>
                </div>
            </div>

            <div id="zoneBreakdownModal" style="display:none;position:absolute;inset:0;background:rgba(15,23,42,.3);z-index:999;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px);">
                <div style="background:${e.surface};width:100%;max-width:360px;border-radius:24px;padding:24px;box-shadow:0 24px 70px rgba(15,23,42,.18);border:1px solid ${e.border};">
                    <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${e.accent};margin-bottom:6px;">Time Slice Breakdown</div>
                    <div style="font-size:1.1rem;font-weight:950;color:${e.text};margin-bottom:4px;" id="breakdownModalTime">At --:--</div>
                    <div style="font-size:0.85rem;color:${e.muted};margin-bottom:18px;">Overall Average: <span id="breakdownModalVal" style="font-weight:900;color:${e.accent};">--</span></div>
                    
                    <div style="font-size:0.72rem;font-weight:950;color:${e.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">Select Zone to inspect:</div>
                    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
                        ${["zone_A","zone_B","zone_C"].map(a=>`
                            <button class="drill-to-zone-btn" data-zone="${a}" style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:14px;border-radius:14px;border:1px solid ${e.border};background:#f8fafc;cursor:pointer;transition:all 0.15s;">
                                <span style="font-weight:900;color:${e.text};">${a.replace("_"," ").toUpperCase()}</span>
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <span style="background:${e.soft};color:${e.accentDark};padding:4px 8px;border-radius:999px;font-size:0.7rem;font-weight:900;">Normal</span>
                                    <span style="color:${e.accent};font-weight:bold;">→</span>
                                </div>
                            </button>
                        `).join("")}
                    </div>
                    <button id="closeBreakdownBtn" style="width:100%;padding:13px;border:1px solid ${e.border};background:#f1f5f9;color:${e.muted};border-radius:16px;font-weight:900;cursor:pointer;">Cancel</button>
                </div>
            </div>
        </div>
    `,k({backTarget:l,sensorKey:d,unit:n.unit,params:t})}async function $(t,d={}){try{const r=(await(await fetch(`${v}/api/sensors/history?deviceId=farm_001&limit=8`)).json()).readings;if(!Array.isArray(r)||r.length===0)throw new Error("No data");return r.map(l=>{const f=l[t.field],o=Number(f??0);return{time:l.createdAt?new Date(l.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"--:--",val:Number.isFinite(o)?S(o):"0",status:t.normal(o)?"Normal":"Check"}})}catch(n){return console.error("Sensor history fetch error:",n),[{time:"N/A",val:"0",status:"Offline"}]}}function w(t){const d=[...t].reverse(),n=d.map(s=>Number.parseFloat(s.val)||0),i=Math.max(...n,1),r=Math.min(...n,0),l=i-r||1,f=d.map((s,p)=>{const h=p/(d.length-1||1)*100,y=35-(Number.parseFloat(s.val)-r)/l*25;return{x:h.toFixed(1),y:y.toFixed(1),val:s.val,time:s.time}}),o=`M ${f.map(s=>`${s.x},${s.y}`).join(" L ")}`,c=`${o} L 100,40 L 0,40 Z`,e=100/(f.length-1||1),a=f.map(s=>`
        <circle cx="${s.x}" cy="${s.y}" r="1.5" fill="#FFFFFF" stroke="#10B981" stroke-width="1" pointer-events="none"></circle>
        <rect class="chart-slice" data-val="${m(s.val)}" data-time="${m(s.time)}" data-cx="${s.x}"
              x="${s.x-e/2}" y="0" width="${e}" height="40"
              fill="transparent" style="cursor:crosshair;pointer-events:all;outline:none;"></rect>
    `).join("");return{linePath:o,areaPath:c,interactiveSlices:a}}function k({backTarget:t,sensorKey:d,unit:n,params:i}){document.getElementById("detailBackBtn").onclick=()=>{i!=null&&i.returnParams?g("zone-detail",i.returnParams):g(t)};const r=document.getElementById("chartTooltip");document.querySelectorAll(".chart-slice").forEach(o=>{o.addEventListener("pointerenter",()=>{r.innerHTML=`<div style="font-size:0.7rem;opacity:.8;">${o.getAttribute("data-time")}</div><b>${o.getAttribute("data-val")} ${m(n)}</b>`,r.style.left=`${o.getAttribute("data-cx")}%`,r.style.display="block"}),o.addEventListener("pointerleave",()=>r.style.display="none")});const l=document.getElementById("zoneBreakdownModal");l&&(document.querySelectorAll(".overall-history-row").forEach(o=>{o.addEventListener("click",()=>{const c=o.getAttribute("data-time"),e=o.getAttribute("data-val");document.getElementById("breakdownModalTime").innerText=`Snapshot at ${c}`,document.getElementById("breakdownModalVal").innerText=`${e} ${n}`,l.style.display="flex"})}),document.getElementById("closeBreakdownBtn").onclick=()=>{l.style.display="none"},document.querySelectorAll(".drill-to-zone-btn").forEach(o=>{o.addEventListener("click",()=>{const c=o.getAttribute("data-zone");l.style.display="none",g("sensor-detail",{...i,zoneId:c})})})),document.querySelectorAll(".drill-zone-btn").forEach(o=>{o.addEventListener("click",()=>{const c=o.getAttribute("data-zone");g("zone-detail",{zoneId:c,from:"overall-farm",returnParams:i})})});const f=["light","water","soil"];document.querySelectorAll(".ops-sensor-grid .sensor-card").forEach(o=>{o.addEventListener("click",c=>{const e=o.getAttribute("data-type");f.includes(e)?g("zone-overview",{targetSensor:e}):g("sensor-detail",{sensor:e,deviceId:"farm_001"})})})}function z(t){return t?{page:"#f8faf7",surface:"rgba(255,255,255,.94)",text:"#17231b",muted:"#64748b",accent:"#047857",accentDark:"#166534",soft:"#ecfdf5",softBorder:"#bbf7d0",border:"#e5e7eb",line:"#eef2f7",shadow:"0 16px 44px rgba(15,23,42,.08)",buttonShadow:"0 12px 30px rgba(15,23,42,.08)",chartFillTop:"rgba(16,185,129,.30)",tooltip:"#166534"}:{page:"#F0FDF4",surface:"#FFFFFF",text:"#065F46",muted:"#64748B",accent:"#10B981",accentDark:"#065F46",soft:"#D1FAE5",softBorder:"#A7F3D0",border:"#D1FAE5",line:"#F8FAFC",shadow:"0 8px 24px rgba(5,150,105,.06)",buttonShadow:"none",chartFillTop:"rgba(16,185,129,.40)",tooltip:"#065F46"}}function S(t){return Number.isFinite(t)?Math.abs(t)>=100?String(Math.round(t)):Number.isInteger(t)?String(t):t.toFixed(1).replace(/\.0$/,""):"0"}function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function x(){var t;try{const d=JSON.parse(localStorage.getItem("user_farms"))||[],n=d.find(r=>r.id===b.currentFarmId)||d[d.length-1],i=(n==null?void 0:n.zones)||((t=n==null?void 0:n.commercialStructure)==null?void 0:t.zones)||[];if(i.length)return i.map(r=>({id:r.zone_id||r.id,label:r.name||(r.zone_id||r.id||"").replace("_"," ").toUpperCase()}))}catch{}return[{id:"zone_A",label:"Zone A"},{id:"zone_B",label:"Zone B"},{id:"zone_C",label:"Zone C"}]}export{N as render};
