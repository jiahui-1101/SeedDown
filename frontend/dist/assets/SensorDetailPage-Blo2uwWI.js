import{s as k,a as v}from"./index-DEjNUr0y.js";import"https://esm.sh/three@0.160.0";async function z(c={}){const a=c.key||"temp",g=c.name||"Sensor",f=document.getElementById("screenContainer"),m={temp:"temperature",humid:"humidity",ph:"ph",light:"lightRaw",water:"waterDistanceCm",nutrient:"gasRaw"}[a]||"value",s={temp:"°C",humid:"%rh",light:"%",ph:"pH",water:"%",nutrient:"%"}[a]||"";let i=[];try{const o=(await(await fetch("http://localhost:3000/api/sensors/history?deviceId=farm_001&limit=5")).json()).readings;if(Array.isArray(o)&&o.length>0)i=o.map(t=>({time:t.createdAt?new Date(t.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"--:--",val:t[m]!==void 0?t[m].toString():"0.0",status:"Normal"}));else throw new Error("No data")}catch(e){console.error("Firebase Fetch Error:",e),i=[{time:"N/A",val:"0.0",status:"Offline"}]}const d=[...i].reverse(),u=d.map(e=>parseFloat(e.val)),b=Math.max(...u),x=Math.min(...u),F=b-x||1,l=d.map((e,n)=>{const o=n/(d.length-1||1)*100,t=35-(parseFloat(e.val)-x)/F*30;return{x:o.toFixed(1),y:t.toFixed(1),val:e.val,time:e.time}}),y=`M ${l.map(e=>`${e.x},${e.y}`).join(" L ")}`,w=`${y} L 100,40 L 0,40 Z`,h=100/(l.length-1||1),$=l.map(e=>`
        <circle cx="${e.x}" cy="${e.y}" r="1.5" fill="#FFFFFF" stroke="#10B981" stroke-width="1" pointer-events="none"></circle>
        <rect class="chart-slice" data-val="${e.val}" data-time="${e.time}" data-cx="${e.x}" 
              x="${e.x-h/2}" y="0" width="${h}" height="40" 
              fill="transparent" style="cursor:crosshair; pointer-events:all; outline:none;"></rect>
    `).join("");f.innerHTML=`
        <div class="screen active" style="display:flex; flex-direction:column; background:#F0FDF4; height:100vh; position:relative;">
            
            <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <button id="detailBackBtn" style="border:none; background:none; font-size:1.5rem; color:#065F46; cursor:pointer;">←</button>
                    <div style="font-weight:700; font-size:1.15rem; color:#065F46;">${g} Analysis</div>
                </div>
                <button id="openModalBtn" style="background:#D1FAE5; color:#065F46; border:none; padding:8px 14px; border-radius:12px; font-size:0.75rem; font-weight:700; cursor:pointer;">
                    ⚙️ Set Preference
                </button>
            </div>

            <div style="flex:1; overflow-y:auto; padding:0 20px 20px 20px;">
                <div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06); margin-bottom:20px;">
                    <div style="font-size:0.8rem; font-weight:700; color:#10B981; margin-bottom:8px;">CURRENT READING</div>
                    <div style="display:flex; align-items:baseline; gap:8px;">
                        <span style="font-size:2.5rem; font-weight:800; color:#065F46;">${i[0].val}</span>
                        <span style="font-size:1.2rem; font-weight:600; color:#94A3B8;">${s}</span>
                    </div>
                </div>

                <div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06); margin-bottom:20px;">
                    <div style="font-size:0.85rem; font-weight:700; color:#065F46; margin-bottom:20px;">TREND HISTORY</div>
                    <div style="height:140px; width:100%; position:relative;">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%; height:100%; overflow:visible;">
                            <defs>
                                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="rgba(16, 185, 129, 0.4)"/>
                                    <stop offset="100%" stop-color="rgba(16, 185, 129, 0)"/>
                                </linearGradient>
                            </defs>
                            <path d="${w}" fill="url(#greenGrad)"></path>
                            <path d="${y}" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            ${$}
                        </svg>
                        <div id="chartTooltip" style="display:none; position:absolute; top:-10px; background:#065F46; color:#FFF; padding:6px 10px; border-radius:8px; font-size:0.8rem; pointer-events:none; white-space:nowrap; transform: translateX(-50%); z-index:10; text-align:center;"></div>
                    </div>
                </div>

                <div style="background:#FFFFFF; border-radius:24px; padding:24px; box-shadow:0 8px 24px rgba(5,150,105,0.06);">
                    <div style="font-size:0.85rem; font-weight:700; color:#065F46; margin-bottom:16px;">HISTORICAL RECORDS</div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${i.map(e=>`
                            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; font-size:0.9rem; padding:14px 0; border-bottom:1px solid #F8FAFC; align-items:center;">
                                <span style="color:#64748B; font-weight:500;">${e.time}</span>
                                <span style="font-weight:800; color:#065F46;">${e.val} <span style="font-size:0.7rem; color:#94A3B8; font-weight:600;">${s}</span></span>
                                <span style="text-align:right;">
                                    <span style="background:${e.status==="Normal"?"#ECFDF5":"#FEE2E2"}; color:${e.status==="Normal"?"#059669":"#DC2626"}; padding:6px 12px; border-radius:12px; font-size:0.7rem; font-weight:700;">
                                        ${e.status==="Normal"?"● ":""}${e.status}
                                    </span>
                                </span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>

            <div id="customModal" style="display:none; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(6, 95, 70, 0.4); z-index:999; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(3px);">
                <div style="background:white; width:100%; max-width:320px; border-radius:24px; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.15);">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                        <div style="background:#D1FAE5; padding:8px; border-radius:50%;">⚙️</div>
                        <div style="font-size:1.1rem; font-weight:800; color:#065F46;">Set Preference</div>
                    </div>
                    <div style="font-size:0.85rem; color:#64748B; margin-bottom:20px;">Set record interval for ${g} (hours)</div>
                    <input type="number" id="prefInput" value="2" min="1" style="width:100%; padding:14px; border:2px solid #D1FAE5; border-radius:16px; font-weight:bold; margin-bottom:20px;">
                    <div style="display:flex; gap:12px;">
                        <button id="cancelModalBtn" style="flex:1; padding:14px; border:none; background:#F1F5F9; color:#64748B; border-radius:16px; font-weight:700; cursor:pointer;">Cancel</button>
                        <button id="saveModalBtn" style="flex:1; padding:14px; border:none; background:#10B981; color:white; border-radius:16px; font-weight:700; cursor:pointer;">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `,document.getElementById("detailBackBtn").onclick=()=>k("home");const r=document.getElementById("chartTooltip");document.querySelectorAll(".chart-slice").forEach(e=>{e.addEventListener("pointerenter",()=>{const n=e.getAttribute("data-val"),o=e.getAttribute("data-time"),t=e.getAttribute("data-cx");r.innerHTML=`<div style="font-size:0.7rem;">${o}</div><b>${n} ${s}</b>`,r.style.left=`${t}%`,r.style.display="block"}),e.addEventListener("pointerleave",()=>r.style.display="none")});const p=document.getElementById("customModal");document.getElementById("openModalBtn").onclick=()=>p.style.display="flex",document.getElementById("cancelModalBtn").onclick=()=>p.style.display="none",document.getElementById("saveModalBtn").onclick=async()=>{const e=document.getElementById("prefInput").value;try{(await fetch("http://localhost:3000/api/sensors/preferences",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:"farm_001",sensorIntervalSeconds:e*3600,sensorType:a})})).ok&&(p.style.display="none",v("success",`Interval updated to ${e}h`))}catch{v("error","Update failed")}}}export{z as render};
