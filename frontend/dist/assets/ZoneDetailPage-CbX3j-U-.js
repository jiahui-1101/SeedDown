import{s as b,A as x}from"./index-Bs4kLmpj.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const h=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,y={temp:{field:"temperature",unit:"°C",label:"Temp",normal:e=>e>=18&&e<=35},humid:{field:"humidity",unit:"%",label:"Humid",normal:e=>e>=35&&e<=80},light:{field:"lightRaw",unit:"raw",label:"Light",normal:e=>e>=1500},ph:{field:"ph",unit:"pH",label:"pH",normal:e=>e>=5.5&&e<=7.5},water:{field:"waterDistanceCm",unit:"cm",label:"Water",normal:e=>e>=3&&e<=30},nutrient:{field:"gasRaw",unit:"raw",label:"Gas",normal:e=>e<3e3},ec:{field:"ec",unit:"mS",label:"EC",normal:e=>e>=.5&&e<=3.5},co2:{field:"co2Ppm",unit:"ppm",label:"CO2",normal:e=>e<1500}},v=["temp","humid","light","ph","water","nutrient","ec","co2"];async function B(e={}){const t=e.zoneId||"zone_A",n=t.replace("_"," ").toUpperCase(),o=e.from||"dash-c",r=document.getElementById("screenContainer");r.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:#f8faf7;height:100vh;align-items:center;justify-content:center;color:#64748b;font-size:0.95rem;font-weight:700;">
            Loading ${n}...
        </div>
    `;const i=await $(t,e),a=v.map(l=>{const c=y[l],p=i?Number(i[c.field]??null):null,f=p!==null&&Number.isFinite(p),g=f?c.normal(p)?"Normal":"Check":"No Data",s=f?C(p):"--";return{key:l,meta:c,value:s,status:g}}),d=a.some(l=>l.status==="Check")?"Check":"Normal";r.innerHTML=`
        <div class="screen active" style="display:flex;flex-direction:column;background:#f8faf7;height:100vh;position:relative;color:#17231b;">

            <!-- Header -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;gap:12px;background:rgba(255,255,255,.92);border-bottom:1px solid #e5e7eb;backdrop-filter:blur(12px);">
                <div style="display:flex;align-items:center;gap:12px;min-width:0;">
                    <button id="zoneBackBtn" style="width:42px;height:42px;border-radius:14px;border:1px solid #e5e7eb;background:#fff;font-size:1.25rem;font-weight:900;color:#17231b;cursor:pointer;flex-shrink:0;">←</button>
                    <div>
                        <div style="font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:#047857;">Production Zone</div>
                        <div style="font-weight:900;font-size:1.2rem;color:#17231b;">${I(n)} Overview</div>
                    </div>
                </div>
                <div style="display:inline-flex;align-items:center;gap:8px;background:${d==="Normal"?"#ecfdf5":"#fef2f2"};color:${d==="Normal"?"#047857":"#dc2626"};border:1px solid ${d==="Normal"?"#bbf7d0":"#fecaca"};padding:8px 14px;border-radius:999px;font-size:0.78rem;font-weight:900;">
                    <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>
                    ${d==="Normal"?"All Normal":"Anomaly Detected"}
                </div>
            </div>

            <!-- Sensor Grid -->
            <div style="flex:1;overflow-y:auto;padding:20px;">
                <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Tap a sensor to view history</div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
    ${a.map(l=>w(l)).join("")}
</div>

<div style="display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:16px;margin-bottom:16px;">
    <section style="background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(15,23,42,.08);">
        <div style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Current Reading · Temp</div>
        <div style="font-size:2.45rem;font-weight:950;color:${a[0].status==="Normal"?"#047857":"#dc2626"};line-height:1;">${a[0].value}<span style="font-size:1rem;font-weight:800;color:#64748b;margin-left:6px;">${a[0].meta.unit}</span></div>
        <div style="margin-top:14px;display:inline-flex;align-items:center;gap:8px;background:${a[0].status==="Normal"?"#ecfdf5":"#fef2f2"};color:${a[0].status==="Normal"?"#166534":"#dc2626"};border:1px solid ${a[0].status==="Normal"?"#bbf7d0":"#fecaca"};padding:7px 11px;border-radius:999px;font-size:0.75rem;font-weight:900;">
            <span style="width:7px;height:7px;border-radius:999px;background:currentColor;display:inline-block;"></span>${a[0].status}
        </div>
    </section>
    <section style="background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(15,23,42,.08);">
        <div style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Trend History</div>
        <div id="zoneTrendChart" style="width:100%;aspect-ratio:5/2;min-height:120px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:0.8rem;">Loading...</div>
    </section>
</div>

<section style="background:#fff;border:1px solid #e5e7eb;border-radius:24px;padding:22px;box-shadow:0 16px 44px rgba(15,23,42,.08);">
    <div style="font-size:0.72rem;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Historical Records · Temp</div>
    <div id="zoneHistoryLog" style="display:flex;flex-direction:column;gap:8px;">
        <div style="color:#94a3b8;font-size:0.85rem;">Loading...</div>
    </div>
</section>
            </div>
        </div>
    `,z({backTarget:o,zoneId:t,params:e})}function w({key:e,meta:t,value:n,status:o}){const r=o==="Check",i=o==="No Data",a=r?"#fff5f5":"#ffffff",d=r?"#fecaca":"#e5e7eb",l=r?"#dc2626":"#047857",c=r?"#fef2f2":i?"#f1f5f9":"#ecfdf5",p=r?"#dc2626":i?"#94a3b8":"#047857",f=r?"#fecaca":i?"#e2e8f0":"#bbf7d0";return`
        <button class="zone-sensor-card" data-key="${e}" data-label="${t.label}"
            style="width:calc(25% - 6px);min-width:70px;background:${a};border:1px solid ${d};border-radius:16px;padding:12px 10px;text-align:left;cursor:pointer;transition:all 0.18s;outline:none;box-shadow:0 4px 16px rgba(15,23,42,.06);">
            <div style="font-size:10px;font-weight:950;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${t.label}</div>
            <div style="font-size:1.9rem;font-weight:950;color:${l};line-height:1;margin-bottom:10px;">
                ${n}<span style="font-size:0.75rem;font-weight:800;color:#94a3b8;margin-left:4px;">${n!=="--"?t.unit:""}</span>
            </div>
            <div style="display:inline-flex;align-items:center;gap:5px;background:${c};color:${p};border:1px solid ${f};padding:4px 9px;border-radius:999px;font-size:0.68rem;font-weight:900;">
                <span style="width:5px;height:5px;border-radius:999px;background:currentColor;display:inline-block;"></span>${o}
            </div>
        </button>
    `}function z({backTarget:e,zoneId:t,params:n}){document.getElementById("zoneBackBtn").onclick=()=>{(n==null?void 0:n.from)==="overall-farm"?b("sensor-detail",n.returnParams||{key:"temp",from:"dash-c",zoneId:"overall"}):b(e)},document.querySelectorAll(".zone-sensor-card").forEach(o=>{o.addEventListener("click",()=>{const r=o.getAttribute("data-key"),i=o.getAttribute("data-label");b("sensor-detail",{key:r,name:i,from:"zone-detail",zoneId:t,returnParams:{zoneId:t,from:"zone-detail",returnParams:n}})})}),S()}async function $(e,t){try{const n=new URLSearchParams,o=k(),i=(Array.isArray(o==null?void 0:o.commercialDevices)?o.commercialDevices:[]).find(l=>N(l.zoneId||l.zone)===e);i!=null&&i.deviceId?n.set("deviceId",i.deviceId):t.deviceId?n.set("deviceId",t.deviceId):n.set("deviceId","farm_001");const d=await(await fetch(`${h}/api/sensors/latest?${n.toString()}`)).json();return(d==null?void 0:d.reading)||null}catch{return null}}function k(){if(x.currentFarm)return x.currentFarm;try{const e=JSON.parse(localStorage.getItem("user_farms"))||[];return e.find(t=>t.id===x.currentFarmId)||e[e.length-1]||null}catch{return null}}function N(e){const t=String(e||"").trim().toLowerCase();return t?t==="a"||t==="zone a"||t==="zone_a"?"zone_A":t==="b"||t==="zone b"||t==="zone_b"?"zone_B":t==="c"||t==="zone c"||t==="zone_c"?"zone_C":t.startsWith("zone_")?`zone_${t.slice(5).toUpperCase()}`:t:""}function C(e){return Number.isFinite(e)?Math.abs(e)>=100?String(Math.round(e)):Number.isInteger(e)?String(e):e.toFixed(1).replace(/\.0$/,""):"0"}function I(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}async function S(e){try{const o=(await(await fetch(`${h}/api/sensors/history?deviceId=farm_001&limit=8`)).json()).readings||[];if(!o.length)return;const r=o.map(s=>Number(s.temperature??0)).reverse(),i=Math.max(...r,1),a=Math.min(...r,0),d=i-a||1,l=r.map((s,m)=>({x:(m/(r.length-1||1)*100).toFixed(1),y:(35-(s-a)/d*25).toFixed(1)})),c=`M ${l.map(s=>`${s.x},${s.y}`).join(" L ")}`,p=`${c} L 100,40 L 0,40 Z`,f=document.getElementById("zoneTrendChart");f&&(f.innerHTML=`
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
                <defs>
                    <linearGradient id="zoneGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="rgba(16,185,129,.30)"/>
                        <stop offset="100%" stop-color="rgba(16,185,129,0)"/>
                    </linearGradient>
                </defs>
                <path d="${p}" fill="url(#zoneGrad)"/>
                <path d="${c}" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                ${l.map(s=>`<circle cx="${s.x}" cy="${s.y}" r="1.5" fill="#fff" stroke="#10B981" stroke-width="1"/>`).join("")}
            </svg>`);const g=document.getElementById("zoneHistoryLog");g&&(g.innerHTML=o.map(s=>{const m=Number(s.temperature??0),u=m>=18&&m<=35?"Normal":"Check";return`
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:13px 0;border-bottom:1px solid #eef2f7;align-items:center;">
                    <span style="color:#64748b;font-weight:700;">${s.createdAt?new Date(s.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"--:--"}</span>
                    <span style="font-weight:950;color:#17231b;">${m.toFixed(1)} <span style="font-size:0.72rem;color:#64748b;">°C</span></span>
                    <span style="text-align:right;"><span style="background:${u==="Normal"?"#ecfdf5":"#fef2f2"};color:${u==="Normal"?"#166534":"#dc2626"};border:1px solid ${u==="Normal"?"#bbf7d0":"#fecaca"};padding:6px 10px;border-radius:999px;font-size:0.68rem;font-weight:900;">${u}</span></span>
                </div>`}).join(""))}catch(t){console.error("Zone history load failed:",t)}}export{B as render};
