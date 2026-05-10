import{A as o,s as c,F as $}from"./index-Cn7ZkA1z.js";import{o as m}from"./AddPlantModal-DrE_lQul.js";import"https://esm.sh/three@0.160.0";const f=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,d={"2-tier":{label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}};function L(){const e=document.getElementById("screenContainer"),t=b(),r=C(t),a=h(t),n=r.total?Math.round(a/r.total*100):0;e.innerHTML=`
        <div class="screen active" id="commercialScreen" style="background:var(--bg); display:flex; flex-direction:column; height:100vh; color:var(--text); position:relative;">
            <div class="topbar">
                <button id="comBackBtn" class="back-btn" style="background:transparent;border:none;font-size:20px;color:var(--text);cursor:pointer;">←</button>
                <div class="topbar-brand" style="flex:1;min-width:0;">
                    <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${x((t==null?void 0:t.name)||o.farmName||"Commercial Farm")}</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.06em;">Commercial control</div>
                </div>
                <button id="addPlantTopBtn" class="topbar-btn" style="border:1px solid var(--accent);background:var(--accent);color:white;border-radius:10px;padding:8px 10px;cursor:pointer;">+ Plant</button>
            </div>

            <div style="flex:1; overflow-y:auto; padding-bottom:12px;">
                <div style="margin:12px 16px 10px 16px; position:relative;">
                    <canvas id="commercialFarmCanvas" style="width:100%; height:300px; border-radius:24px; background:#EAF4FF; display:block;"></canvas>
                    <button id="fabPlant" title="Add plant" aria-label="Add plant" style="position:absolute; bottom:12px; right:12px; background:var(--accent); border:none; width:48px; height:48px; border-radius:16px; color:white; font-size:26px;cursor:pointer;box-shadow:var(--shadow-sm);">+</button>
                    <div style="position:absolute;left:12px;bottom:12px;background:rgba(255,255,255,.88);border:1px solid var(--border);border-radius:12px;padding:8px 10px;box-shadow:var(--shadow-sm);">
                        <div style="font-size:10px;color:var(--muted);font-weight:900;text-transform:uppercase;letter-spacing:.06em;">${x(r.label)}</div>
                        <div style="font-size:13px;font-weight:900;color:var(--text);">${a}/${r.total} plants · ${n}% filled</div>
                    </div>
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
                        ${p("🌡️","TEMP","pro-temp","--","var(--danger)","#FEE2E2")}
                        ${p("💧","HUMID","pro-humid","--","var(--accent)","var(--accent-l)")}
                        ${p("☀️","LIGHT","pro-light","--","var(--ok)","var(--ok-bg)")}
                        ${p("🧪","PH","pro-ph","--","var(--warn)","#FFFBEB")}
                        ${p("💦","WATER","pro-water","--","var(--accent)","var(--accent-l)")}
                        ${p("🧬","GAS","pro-gas","--","var(--ok)","var(--ok-bg)")}
                    </div>
                </div>

                <div style="margin:0 16px 12px 16px;">
                    <div style="font-size:0.6rem;font-weight:800;color:var(--muted);text-transform:uppercase;margin-bottom:8px;">Commercial Tools</div>
                    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px;">
                        ${u("whatif","🔮","What-If")}
                        ${u("consumption","⚡","ESG")}
                        ${u("alerts","🚨","Alerts")}
                        ${u("control","🎛️","Control")}
                    </div>
                </div>
            </div>

            <div class="bottom-nav">
                <div class="nav-item active" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `,I(),E(),F()}function I(){var e,t,r,a,n;(e=document.getElementById("profit-card"))==null||e.addEventListener("click",()=>{clearInterval(o.proInterval),c("profit-detail")}),(t=document.getElementById("energy-card"))==null||t.addEventListener("click",()=>{clearInterval(o.proInterval),c("energy-detail")}),(r=document.getElementById("comBackBtn"))==null||r.addEventListener("click",()=>{clearInterval(o.proInterval),c("farmlist")}),(a=document.getElementById("addPlantTopBtn"))==null||a.addEventListener("click",m),(n=document.getElementById("fabPlant"))==null||n.addEventListener("click",m),document.querySelectorAll(".com-feat").forEach(s=>{s.addEventListener("click",()=>{var v;const l=s.getAttribute("data-feature");l==="whatif"?c("whatif-pro"):l==="control"?(v=window.showToast)==null||v.call(window,"info","Control panel coming soon"):c("feature",{feature:l,from:"dash-c"})})}),document.querySelectorAll(".bottom-nav .nav-item").forEach(s=>{s.addEventListener("click",()=>{const l=s.getAttribute("data-screen");l==="profile"?(o.profileFrom="dash-c",c("profile")):l==="home"&&c("dash-c")})})}function E(){setTimeout(()=>$.init("commercialFarmCanvas"),80)}function F(){clearInterval(o.proInterval),o.aiConsulted=!1;const e=async()=>{try{const r=await(await fetch(`${f}/api/sensors/latest?deviceId=farm_001`)).json();if(!r||!r.reading)return;const a=r.reading,n=Number(a.temperature||0),s=Number(a.humidity||0),l=Number(a.lightRaw||0),v=Number(a.ph||0),y=Number(a.waterDistanceCm||0),w=Number(a.gasRaw||0),g=h(b()),k=Math.max(0,g*1.35+l*.012).toFixed(2),T=Math.max(0,n*.65+g*.18).toFixed(1);i("pro-profit",`RM ${k}`),i("pro-energy",`${T} kWh`),i("pro-temp",`${n.toFixed(1)}°C`),i("pro-humid",`${s}%`),i("pro-light",l),i("pro-ph",v),i("pro-water",`${y}cm`),i("pro-gas",w),o.aiConsulted||(A(a),o.aiConsulted=!0)}catch(t){console.error("Dashboard Sync Failed:",t),i("ai-overview-text","Live backend offline. Showing saved farm layout.")}};e(),o.proInterval=setInterval(e,5e3)}async function A(e){const t=`You are a farm owner's AI assistant. Current data: ${JSON.stringify(e)}. Briefly evaluate commercial farm profit and energy efficiency in one short English sentence.`;try{const a=await(await fetch(`${f}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t})})).json();i("ai-overview-text",a.reply||a.response||"Farm is operating normally.")}catch{i("ai-overview-text","AI Advisor offline. Sensor dashboard still available.")}}function p(e,t,r,a,n,s){return`
        <div style="background:${s};border-radius:12px;padding:12px;min-height:90px;position:relative;overflow:hidden;">
            <div style="position:absolute;top:-5px;right:-5px;font-size:36px;opacity:.12;">${e}</div>
            <div style="font-size:14px;opacity:.7;">${e}</div>
            <div style="margin-top:14px;">
                <div id="${r}" style="font-size:1rem;font-weight:900;color:${n};word-break:break-word;">${a}</div>
                <div style="font-size:10px;font-weight:800;color:var(--muted);margin-top:2px;">${t}</div>
            </div>
        </div>`}function u(e,t,r){return`
        <button class="com-feat" data-feature="${e}" style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:12px 6px;text-align:center;cursor:pointer;box-shadow:var(--shadow-sm);color:var(--text);">
            <div style="font-size:24px;line-height:1;">${t}</div>
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-top:6px;text-transform:uppercase;">${r}</div>
        </button>`}function b(){const e=P();return o.currentFarm||e.find(t=>t.id===o.currentFarmId)||e[e.length-1]||null}function C(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?d["2-tier"]:t.includes("4")?d["4-tier"]:t.includes("5")?d["5-tier"]:t.includes("wall")||t.includes("grid")?d.wall:t.includes("frame")?d["a-frame"]:t.includes("nft")||t.includes("channel")?d["nft-channel"]:t.includes("hanging")||t.includes("column")?d.hanging:d["3-tier"]}function h(e){return Array.isArray(e==null?void 0:e.plants)?e.plants.length:Number.parseInt(e==null?void 0:e.plants,10)||Number.parseInt(e==null?void 0:e.plantSlots,10)||0}function P(){try{return JSON.parse(localStorage.getItem("user_farms"))||[]}catch{return[]}}function i(e,t){const r=document.getElementById(e);r&&(r.innerText=t)}function x(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{L as render};
