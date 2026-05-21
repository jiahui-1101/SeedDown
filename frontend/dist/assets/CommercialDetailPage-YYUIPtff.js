import{s as p}from"./index-BwcRKJkh.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const c={temp:{field:"temperature",unit:"deg C",label:"Temperature",normal:t=>t>=18&&t<=35},humid:{field:"humidity",unit:"%",label:"Humidity",normal:t=>t>=35&&t<=80},ph:{field:"ph",unit:"pH",label:"pH",normal:t=>{const a=JSON.parse(localStorage.getItem("farm_profile")||"{}");return t>=Number(a.phMin||5.5)&&t<=Number(a.phMax||6.5)}},light:{field:"lightRaw",unit:"raw",label:"Light",normal:t=>{const a=JSON.parse(localStorage.getItem("farm_profile")||"{}");return t>=Number(a.lightThreshold||1500)}},water:{field:"waterDistanceCm",unit:"cm",label:"Water",normal:t=>t>=3&&t<=30},nutrient:{field:"gasRaw",unit:"raw",label:"Gas",normal:t=>t<3e3},gas:{field:"gasRaw",unit:"raw",label:"Gas",normal:t=>t<3e3}};async function u(t={}){const a=t.key||t.sensor||"temp",n=c[a]||c.temp;let s=n.label||"Sensor";t.zoneId==="overall"?s="Overall Farm":t.zoneId&&(s=t.zoneId.replace("_"," ").toUpperCase());const f=document.getElementById("screenContainer"),i=await fetchHistory(n,t),l=buildChart(i),e={page:"#f8faf7",surface:"rgba(255,255,255,.94)",text:"#17231b",muted:"#64748b",accent:"#047857",accentDark:"#166534",soft:"#ecfdf5",softBorder:"#bbf7d0",border:"#e5e7eb",line:"#eef2f7",shadow:"0 16px 44px rgba(15,23,42,.08)",buttonShadow:"0 12px 30px rgba(15,23,42,.08)",chartFillTop:"rgba(16,185,129,.30)"};f.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:${e.page};height:100vh;position:relative;color:${e.text};">
            
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="comDetailBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid ${e.border};background:${e.surface};box-shadow:${e.buttonShadow};font-size:1.25rem;font-weight:900;color:${e.text};cursor:pointer;flex-shrink:0;">←</button>
                    <div style="min-width:0;">
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${e.accent};">Commercial Sensor</div>
                        <div style="font-weight:900;font-size:1.12rem;color:${e.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(s)} Analysis</div>
                    </div>
                </div>
                <div style="width: 42px;"></div> </div>

            <div style="flex:1;overflow-y:auto;padding:0 20px 20px 20px;">
                <div style="display:grid;grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);gap:16px;margin-bottom:16px;">
                    
                    <section style="background:${e.surface};border:1px solid ${e.border};border-radius:24px;padding:22px;box-shadow:${e.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading</div>
                        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
                            <span style="font-size:2.45rem;font-weight:950;color:${e.accent};line-height:1;">${escapeHTML(i[0].val)}</span>
                            <span style="font-size:1rem;font-weight:800;color:${e.muted};">${escapeHTML(n.unit)}</span>
                        </div>
                        <div style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:${i[0].status==="Normal"?e.soft:"#fef2f2"};color:${i[0].status==="Normal"?e.accentDark:"#dc2626"};border:1px solid ${i[0].status==="Normal"?e.softBorder:"#fecaca"};padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
                            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${i[0].status}
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
                                <path d="${l.areaPath}" fill="url(#sensorGrad)"></path>
                                <path d="${l.linePath}" fill="none" stroke="${e.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                ${l.interactiveSlices}
                            </svg>
                        </div>
                    </section>
                </div>

                <section style="background:${e.surface};border:1px solid ${e.border};border-radius:24px;padding:22px;box-shadow:${e.shadow};margin-bottom:16px;">
                    ${i[0].status==="Normal"?`
                        <div style="font-size:0.72rem;font-weight:950;color:#16a34a;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px;display:flex;align-items:center;gap:6px;">
                            <span style="width:8px;height:8px;border-radius:50%;background:#16a34a;display:inline-block;"></span> All Zones Nominal · Select to Inspect
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
                            ${["zone_A","zone_B","zone_C"].map(o=>`
                                <button class="com-drill-zone-btn" data-zone="${o}" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;border-radius:16px;border:1px solid ${e.border};background:#f8fafc;cursor:pointer;gap:6px;outline:none;">
                                    <span style="font-size:0.9rem;font-weight:900;color:${e.text};">${o.replace("_"," ").toUpperCase()}</span>
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
                            ${["zone_A","zone_B","zone_C"].map((o,d)=>{const r=d===1;return`
                                    <div class="com-drill-zone-btn" data-zone="${o}" style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-radius:16px;border:1px solid ${r?"#fecaca":e.border};background:${r?"#fff5f5":"#f8fafc"};cursor:pointer;">
                                        <div style="display:flex;align-items:center;gap:10px;">
                                            <span style="font-size:0.95rem;font-weight:900;color:${e.text};">${o.replace("_"," ").toUpperCase()}</span>
                                            ${r?'<span style="font-size:0.75rem;color:#ef4444;font-weight:950;letter-spacing:0.5px;">[ Culprit Node ]</span>':""}
                                        </div>
                                        <div style="display:flex;align-items:center;gap:12px;">
                                            <span style="background:${r?"#fef2f2":e.soft};color:${r?"#dc2626":e.accentDark};border:1px solid ${r?"#fecaca":e.softBorder};padding:4px 10px;border-radius:999px;font-size:0.7rem;font-weight:900;">
                                                ${r?"Check ⚠️":"Normal"}
                                            </span>
                                            <span style="font-size:1.2rem;color:${r?"#dc2626":e.accent};font-weight:bold;">→</span>
                                        </div>
                                    </div>
                                `}).join("")}
                        </div>
                    `}
                </section>

                <section style="background:${e.surface};border:1px solid ${e.border};border-radius:24px;padding:22px;box-shadow:${e.shadow};">
                    <div style="font-size:0.72rem;font-weight:950;color:${e.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Macro Timeline Log</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${i.map(o=>`
                            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:0.9rem;padding:13px 0;border-bottom:1px solid ${e.line};align-items:center;">
                                <span style="color:${e.muted};font-weight:700;">${escapeHTML(o.time)}</span>
                                <span style="font-weight:950;color:${e.text};">${escapeHTML(o.val)} <span style="font-size:0.72rem;color:${e.muted};font-weight:800;">${escapeHTML(n.unit)}</span></span>
                                <span style="text-align:right;">
                                    <span style="background:${o.status==="Normal"?e.soft:"#fef2f2"};color:${o.status==="Normal"?e.accentDark:"#dc2626"};border:1px solid ${o.status==="Normal"?e.softBorder:"#fecaca"};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;">${o.status}</span>
                                </span>
                            </div>
                        `).join("")}
                    </div>
                </section>
            </div>
        </div>
    `,document.getElementById("comDetailBackBtn").addEventListener("click",()=>{p("dash-c")}),document.querySelectorAll(".com-drill-zone-btn").forEach(o=>{o.addEventListener("click",()=>{const d=o.getAttribute("data-zone");p("commercial-detail",{sensor:a,zoneId:d})})})}export{u as render};
