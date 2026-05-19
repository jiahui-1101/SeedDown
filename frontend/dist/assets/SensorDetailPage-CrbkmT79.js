import{A as u,s as v,a as f}from"./index-K6VIRzsI.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const x=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,g={temp:{field:"temperature",unit:"deg C",label:"Temperature",normal:t=>t>=18&&t<=35},humid:{field:"humidity",unit:"%",label:"Humidity",normal:t=>t>=35&&t<=80},ph:{field:"ph",unit:"pH",label:"pH",normal:t=>t>=5.5&&t<=7.5},light:{field:"lightRaw",unit:"raw",label:"Light",normal:t=>t>=1500},water:{field:"waterDistanceCm",unit:"cm",label:"Water",normal:t=>t>=3&&t<=30},nutrient:{field:"gasRaw",unit:"raw",label:"Gas",normal:t=>t<3e3},gas:{field:"gasRaw",unit:"raw",label:"Gas",normal:t=>t<3e3}};async function N(t={}){const s=t.key||t.sensor||"temp",a=g[s]||g.temp,d=t.name||a.label||"Sensor",i=t.from==="dash-c"||u.mode==="commercial",r=t.from||(i?"dash-c":"home"),l=document.getElementById("screenContainer"),o=await w(a,t),m=$(o),e=B(i);l.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:${e.page};height:100vh;position:relative;color:${e.text};">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="detailBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid ${e.border};background:${e.surface};box-shadow:${e.buttonShadow};font-size:1.25rem;font-weight:900;color:${e.text};cursor:pointer;flex-shrink:0;">←</button>
                    <div style="min-width:0;">
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:${e.accent};">${i?"Commercial Sensor":"Live Sensor"}</div>
                        <div style="font-weight:900;font-size:1.12rem;color:${e.text};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c(d)} Analysis</div>
                    </div>
                </div>
                <button id="openModalBtn" style="background:${e.soft};color:${e.accentDark};border:1px solid ${e.softBorder};padding:10px 14px;border-radius:14px;font-size:0.75rem;font-weight:900;cursor:pointer;white-space:nowrap;">
                    Set Preference
                </button>
            </div>

            <div style="flex:1;overflow-y:auto;padding:0 20px 20px 20px;">
                <div style="display:grid;grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);gap:16px;margin-bottom:16px;">
                    <section style="background:${e.surface};border:1px solid ${e.border};border-radius:24px;padding:22px;box-shadow:${e.shadow};">
                        <div style="font-size:0.72rem;font-weight:950;color:${e.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading</div>
                        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
                            <span style="font-size:2.45rem;font-weight:950;color:${e.accent};line-height:1;">${c(o[0].val)}</span>
                            <span style="font-size:1rem;font-weight:800;color:${e.muted};">${c(a.unit)}</span>
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
                                <path d="${m.areaPath}" fill="url(#sensorGrad)"></path>
                                <path d="${m.linePath}" fill="none" stroke="${e.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                ${m.interactiveSlices}
                            </svg>
                            <div id="chartTooltip" style="display:none;position:absolute;top:-10px;background:${e.tooltip};color:#fff;padding:6px 10px;border-radius:10px;font-size:0.78rem;pointer-events:none;white-space:nowrap;transform:translateX(-50%);z-index:10;text-align:center;"></div>
                        </div>
                    </section>
                </div>

                <section style="background:${e.surface};border:1px solid ${e.border};border-radius:24px;padding:22px;box-shadow:${e.shadow};">
                    <div style="font-size:0.72rem;font-weight:950;color:${e.muted};text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Historical Records</div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${o.map(p=>`
                            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:0.9rem;padding:13px 0;border-bottom:1px solid ${e.line};align-items:center;">
                                <span style="color:${e.muted};font-weight:700;">${c(p.time)}</span>
                                <span style="font-weight:950;color:${e.text};">${c(p.val)} <span style="font-size:0.72rem;color:${e.muted};font-weight:800;">${c(a.unit)}</span></span>
                                <span style="text-align:right;">
                                    <span style="background:${p.status==="Normal"?e.soft:"#fef2f2"};color:${p.status==="Normal"?e.accentDark:"#dc2626"};border:1px solid ${p.status==="Normal"?e.softBorder:"#fecaca"};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;white-space:nowrap;">${p.status}</span>
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
                    <div style="font-size:0.85rem;color:${e.muted};margin-bottom:18px;">Set record interval for ${c(d)} in hours.</div>
                    <input type="number" id="prefInput" value="2" min="1" style="width:100%;box-sizing:border-box;padding:14px;border:1px solid ${e.border};border-radius:16px;font-weight:900;margin-bottom:18px;background:#f8fafc;color:${e.text};">
                    <div style="display:flex;gap:12px;">
                        <button id="cancelModalBtn" style="flex:1;padding:13px;border:1px solid ${e.border};background:#f8fafc;color:${e.muted};border-radius:16px;font-weight:900;cursor:pointer;">Cancel</button>
                        <button id="saveModalBtn" style="flex:1;padding:13px;border:none;background:${e.accentDark};color:white;border-radius:16px;font-weight:900;cursor:pointer;">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `,k({backTarget:r,sensorKey:s,unit:a.unit})}async function w(t,s={}){try{const i=(await(await fetch(`${x}/api/sensors/history?deviceId=farm_001&limit=8`)).json()).readings;if(!Array.isArray(i)||i.length===0)throw new Error("No data");return i.map(r=>{const l=r[t.field],o=Number(l??0);return{time:r.createdAt?new Date(r.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"--:--",val:Number.isFinite(o)?S(o):"0",status:t.normal(o)?"Normal":"Check"}})}catch(a){return console.error("Sensor history fetch error:",a),[{time:"N/A",val:"0",status:"Offline"}]}}function $(t){const s=[...t].reverse(),a=s.map(n=>Number.parseFloat(n.val)||0),d=Math.max(...a,1),i=Math.min(...a,0),r=d-i||1,l=s.map((n,h)=>{const b=h/(s.length-1||1)*100,y=35-(Number.parseFloat(n.val)-i)/r*25;return{x:b.toFixed(1),y:y.toFixed(1),val:n.val,time:n.time}}),o=`M ${l.map(n=>`${n.x},${n.y}`).join(" L ")}`,m=`${o} L 100,40 L 0,40 Z`,e=100/(l.length-1||1),p=l.map(n=>`
        <circle cx="${n.x}" cy="${n.y}" r="1.5" fill="#FFFFFF" stroke="#10B981" stroke-width="1" pointer-events="none"></circle>
        <rect class="chart-slice" data-val="${c(n.val)}" data-time="${c(n.time)}" data-cx="${n.x}"
              x="${n.x-e/2}" y="0" width="${e}" height="40"
              fill="transparent" style="cursor:crosshair;pointer-events:all;outline:none;"></rect>
    `).join("");return{linePath:o,areaPath:m,interactiveSlices:p}}function k({backTarget:t,sensorKey:s,unit:a}){document.getElementById("detailBackBtn").onclick=()=>v(t);const d=document.getElementById("chartTooltip");document.querySelectorAll(".chart-slice").forEach(r=>{r.addEventListener("pointerenter",()=>{d.innerHTML=`<div style="font-size:0.7rem;opacity:.8;">${r.getAttribute("data-time")}</div><b>${r.getAttribute("data-val")} ${c(a)}</b>`,d.style.left=`${r.getAttribute("data-cx")}%`,d.style.display="block"}),r.addEventListener("pointerleave",()=>d.style.display="none")});const i=document.getElementById("customModal");document.getElementById("openModalBtn").onclick=()=>i.style.display="flex",document.getElementById("cancelModalBtn").onclick=()=>i.style.display="none",document.getElementById("saveModalBtn").onclick=async()=>{var l;const r=Number(document.getElementById("prefInput").value||1);try{if(!(await fetch(`${x}/api/sensors/preferences`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:params.deviceId||((l=F())==null?void 0:l.deviceId)||"farm_001",sensorIntervalSeconds:r*3600,sensorType:s})})).ok)throw new Error("Preference update failed");i.style.display="none",f("success",`Interval updated to ${r}h`)}catch{f("error","Update failed")}}}function F(){if(u.currentFarm)return u.currentFarm;try{const t=JSON.parse(localStorage.getItem("user_farms"))||[];return t.find(s=>s.id===u.currentFarmId)||t[t.length-1]||null}catch{return null}}function B(t){return t?{page:"#f8faf7",surface:"rgba(255,255,255,.94)",text:"#17231b",muted:"#64748b",accent:"#047857",accentDark:"#166534",soft:"#ecfdf5",softBorder:"#bbf7d0",border:"#e5e7eb",line:"#eef2f7",shadow:"0 16px 44px rgba(15,23,42,.08)",buttonShadow:"0 12px 30px rgba(15,23,42,.08)",chartFillTop:"rgba(16,185,129,.30)",tooltip:"#166534"}:{page:"#F0FDF4",surface:"#FFFFFF",text:"#065F46",muted:"#64748B",accent:"#10B981",accentDark:"#065F46",soft:"#D1FAE5",softBorder:"#A7F3D0",border:"#D1FAE5",line:"#F8FAFC",shadow:"0 8px 24px rgba(5,150,105,.06)",buttonShadow:"none",chartFillTop:"rgba(16,185,129,.40)",tooltip:"#065F46"}}function S(t){return Number.isFinite(t)?Math.abs(t)>=100?String(Math.round(t)):Number.isInteger(t)?String(t):t.toFixed(1).replace(/\.0$/,""):"0"}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{N as render};
