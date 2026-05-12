import{A as o,s as l}from"./index-CIzUcNGo.js";import{CommercialFarmCanvas as k}from"./CommercialFarmCanvas-CRjbCp7r.js";import{o as I}from"./AddPlantModal-C4-RKA8-.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const m=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,d={"2-tier":{label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}};function R(){const e=document.getElementById("screenContainer"),t=g(),r=E(t),a=f(t);r.total&&Math.round(a/r.total*100),e.innerHTML=`
        <div class="screen active" id="commercialScreen" style="background:var(--bg); display:flex; flex-direction:column; height:100vh; color:var(--text); position:relative;">
            <div class="topbar">
                <button id="comBackBtn" class="back-btn" style="background:transparent;border:none;font-size:20px;color:var(--text);cursor:pointer;">←</button>
                <div class="topbar-brand" style="flex:1;min-width:0;">
                    <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${F((t==null?void 0:t.name)||o.farmName||"Commercial Farm")}</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Commercial control</div>
                </div>
            </div>

            <div style="flex:1; overflow-y:auto; padding-bottom:12px;">
                <div style="margin:12px 16px 10px 16px; position:relative;">
                    <canvas id="commercialFarmCanvas" style="width:100%; height:clamp(360px, 48dvh, 620px); border-radius:22px; background:#07110c; display:block;"></canvas>
                    <button id="fabPlant" title="Add plant" aria-label="Add plant" style="position:absolute; bottom:14px; left:14px; z-index:10; background:rgba(163,230,53,.14); border:1px solid rgba(163,230,53,.28); height:38px; border-radius:999px; color:#a3e635; font-size:11px;font-weight:900;letter-spacing:.08em;padding:0 14px;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.22);">ADD PLANT</button>
                </div>

                <div style="margin:0 16px 12px 16px;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:14px;box-shadow:var(--shadow-sm);display:flex;gap:12px;align-items:center;">
                    <div style="width:42px;height:42px;border-radius:14px;background:var(--accent-l);display:flex;align-items:center;justify-content:center;font-size:24px;">🧑‍🌾</div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:11px;color:var(--accent);font-weight:900;text-transform:uppercase;letter-spacing:.06em;">AI Farm Advisor</div>
                        <div id="ai-overview-text" style="font-size:13px;color:var(--sub);line-height:1.35;">Syncing commercial farm data...</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:0 16px 12px 16px;">
                    <button id="profit-card" style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px;text-align:left;cursor:pointer;box-shadow:var(--shadow-sm);">
                        <div style="display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;">Est. Profit <span>↗</span></div>
                        <div id="pro-profit" style="font-size:1.55rem;color:var(--ok);font-weight:900;margin-top:4px;">RM --</div>
                    </button>
                    <button id="energy-card" style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px;text-align:left;cursor:pointer;box-shadow:var(--shadow-sm);">
                        <div style="display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;">Energy Cost <span>⚡</span></div>
                        <div id="pro-energy" style="font-size:1.55rem;color:var(--warn);font-weight:900;margin-top:4px;">-- kWh</div>
                    </button>
                </div>

             <div style="margin:0 16px 12px 16px;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:16px;box-shadow:var(--shadow-sm);">
                    <div style="display:flex;align-items:center;margin-bottom:12px;">
                        <div style="width:4px;height:16px;background:var(--ok);border-radius:4px;margin-right:8px;"></div>
                        <div style="font-size:1.02rem;font-weight:800;color:var(--text);">Live Data</div>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
                        ${p("🌡️","Temp","pro-temp","--","var(--danger)","#FEE2E2","temp")}
                        ${p("💧","Humid","pro-humid","--","var(--accent)","var(--accent-l)","humid")}
                        ${p("☀️","Light","pro-light","--","var(--ok)","var(--ok-bg)","light")}
                        ${p("🧪","pH","pro-ph","--","var(--warn)","#FFFBEB","ph")}
                        ${p("💦","Water","pro-water","--","var(--accent)","var(--accent-l)","water")}
                        ${p("🧬","Gas","pro-gas","--","var(--ok)","var(--ok-bg)","nutrient")}
                    </div>
                </div>

                <div style="margin:0 16px 12px 16px;">
                    <div style="font-size:0.6rem;font-weight:800;color:var(--muted);text-transform:uppercase;margin-bottom:8px;">Commercial Tools</div>
                    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px;">
                        ${v("whatif","🔮","What-If")}
                        ${v("consumption","⚡","ESG")}
                        ${v("alerts","🚨","Alerts")}
                        ${v("control","🎛️","Control")}
                    </div>
                </div>
            </div>

            <div class="bottom-nav">
                <div class="nav-item active" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `,$(),T(),A()}function $(){var e,t,r,a;(e=document.getElementById("profit-card"))==null||e.addEventListener("click",()=>{clearInterval(o.proInterval),l("profit-detail")}),(t=document.getElementById("energy-card"))==null||t.addEventListener("click",()=>{clearInterval(o.proInterval),l("energy-detail")}),(r=document.getElementById("comBackBtn"))==null||r.addEventListener("click",()=>{clearInterval(o.proInterval),l("farmlist")}),(a=document.getElementById("fabPlant"))==null||a.addEventListener("click",I),document.querySelectorAll(".com-feat").forEach(i=>{i.addEventListener("click",()=>{const n=i.getAttribute("data-feature");n==="whatif"?l("whatif-pro"):n==="control"?l("control"):l("feature",{feature:n,from:"dash-c"})})}),document.querySelectorAll(".bottom-nav .nav-item").forEach(i=>{i.addEventListener("click",()=>{const n=i.getAttribute("data-screen");n==="profile"?(o.profileFrom="dash-c",l("profile")):n==="home"&&l("dash-c")})}),document.querySelectorAll(".pro-sensor-card").forEach(i=>{i.addEventListener("click",()=>{const n=i.getAttribute("data-key"),c=i.getAttribute("data-label");clearInterval(o.proInterval),l("sensor-detail",{key:n,name:c})})})}function T(){setTimeout(()=>k.init("commercialFarmCanvas"),80)}function A(){clearInterval(o.proInterval),o.aiConsulted=!1;const e=async()=>{try{const r=await(await fetch(`${m}/api/sensors/latest?deviceId=farm_001`)).json();if(!r||!r.reading)return;const a=r.reading,i=Number(a.temperature||0),n=Number(a.humidity||0),c=Number(a.lightRaw||0),x=Number(a.ph||0),h=Number(a.waterDistanceCm||0),b=Number(a.gasRaw||0),u=f(g()),y=Math.max(0,u*1.35+c*.012).toFixed(2),w=Math.max(0,i*.65+u*.18).toFixed(1);s("pro-profit",`RM ${y}`),s("pro-energy",`${w} kWh`),s("pro-temp",`${i.toFixed(1)}°C`),s("pro-humid",`${n}%`),s("pro-light",c),s("pro-ph",x),s("pro-water",`${h}cm`),s("pro-gas",b),o.aiConsulted||(C(a),o.aiConsulted=!0)}catch(t){console.error("Dashboard Sync Failed:",t),s("ai-overview-text","Live backend offline. Showing saved farm layout.")}};e(),o.proInterval=setInterval(e,5e3)}async function C(e){const t=`You are a farm owner's AI assistant. Current data: ${JSON.stringify(e)}. Briefly evaluate commercial farm profit and energy efficiency in one short English sentence.`;try{const a=await(await fetch(`${m}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t})})).json();s("ai-overview-text",a.reply||a.response||"Farm is operating normally.")}catch{s("ai-overview-text","AI Advisor offline. Sensor dashboard still available.")}}function p(e,t,r,a,i,n,c){return`
        <div class="pro-sensor-card" data-key="${c}" data-label="${t}" style="background:${n};border-radius:12px;padding:12px;min-height:90px;position:relative;overflow:hidden;cursor:pointer;">
            <div style="position:absolute;top:-5px;right:-5px;font-size:36px;opacity:.12;">${e}</div>
            <div style="font-size:14px;opacity:.7;">${e}</div>
            <div style="margin-top:14px;">
                <div id="${r}" style="font-size:1rem;font-weight:900;color:${i};word-break:break-word;">${a}</div>
                <div style="font-size:10px;font-weight:800;color:var(--muted);margin-top:2px;">${t}</div>
            </div>
        </div>`}function v(e,t,r){return`
        <button class="com-feat" data-feature="${e}" style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:12px 6px;text-align:center;cursor:pointer;box-shadow:var(--shadow-sm);color:var(--text);">
            <div style="font-size:24px;line-height:1;">${t}</div>
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-top:6px;text-transform:uppercase;">${r}</div>
        </button>`}function g(){const e=S();return o.currentFarm||e.find(t=>t.id===o.currentFarmId)||e[e.length-1]||null}function E(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?d["2-tier"]:t.includes("4")?d["4-tier"]:t.includes("5")?d["5-tier"]:t.includes("wall")||t.includes("grid")?d.wall:t.includes("frame")?d["a-frame"]:t.includes("nft")||t.includes("channel")?d["nft-channel"]:t.includes("hanging")||t.includes("column")?d.hanging:d["3-tier"]}function f(e){return Array.isArray(e==null?void 0:e.plants)?e.plants.length:Number.parseInt(e==null?void 0:e.plants,10)||Number.parseInt(e==null?void 0:e.plantSlots,10)||0}function S(){try{return JSON.parse(localStorage.getItem("user_farms"))||[]}catch{return[]}}function s(e,t){const r=document.getElementById(e);r&&(r.innerText=t)}function F(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{R as render};
