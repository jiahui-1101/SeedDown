import{a as x,A as d,F as L,S as O,N as _,s as g}from"./index-CyZBRtAv.js";import"https://esm.sh/three@0.160.0";const k="user_farms",G=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,p={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},y=[{emoji:"🥬",name:"Lettuce",species:"lettuce",days:45,price:"RM 1.20"},{emoji:"🌿",name:"Spinach",species:"spinach",days:40,price:"RM 0.90"},{emoji:"🌱",name:"Basil",species:"basil",days:30,price:"RM 2.50"},{emoji:"🍅",name:"Tomato",species:"tomato",days:70,price:"RM 3.00"},{emoji:"🥒",name:"Cucumber",species:"cucumber",days:55,price:"RM 2.10"},{emoji:"🥕",name:"Carrot",species:"carrot",days:75,price:"RM 1.50"},{emoji:"🥬",name:"Cabbage",species:"cabbage",days:90,price:"RM 1.80"},{emoji:"🍆",name:"Eggplant",species:"eggplant",days:80,price:"RM 2.20"}];let m=null,v=null,w=!1;function C(){const e=document.getElementById("modalContainer");if(!e)return;const t=D(),n=U(t),r=K(t,n);e.innerHTML=`
    <div class="modal-overlay" id="addPlantModalOverlay">
      <div class="modal-sheet">
        <div style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-weight:700;">🌱 Add New Plant</span>
            <button id="closeAddPlantModal" style="background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
          </div>

          <div style="margin-bottom:12px;">
            <div style="font-size:0.7rem;color:var(--text-secondary,#666);margin-bottom:6px;">SEARCH OR ADD CUSTOM SPECIES</div>
            <div style="display:flex;gap:8px;">
              <input id="speciesSearchInput" type="text" placeholder="e.g. kale, mint, cucumber..."
                style="flex:1;padding:8px 12px;border:1px solid var(--border-color,#ddd);border-radius:8px;font-size:13px;background:var(--bg-secondary,#f5f5f5);">
              <button id="speciesSearchBtn" style="background:var(--accent,#639922);color:white;border:none;border-radius:8px;padding:8px 14px;font-size:13px;cursor:pointer;">
                🔍 Add
              </button>
            </div>
            <div id="speciesSearchStatus" style="font-size:11px;color:var(--text-secondary,#666);margin-top:4px;min-height:16px;"></div>
          </div>

          <div style="font-size:0.7rem;color:var(--text-secondary,#666);margin-bottom:6px;">SELECT CROP</div>
          <div id="cropGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;max-height:200px;overflow-y:auto;"></div>

          <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:6px;gap:8px;">
            <div>
              <div style="font-size:0.7rem;color:var(--text-secondary,#666);font-weight:700;">SELECT POSITION</div>
              <div style="font-size:11px;color:var(--text-secondary,#666);">${n.label} · tap any slot to plant or replace</div>
            </div>
            <div id="positionStatus" style="font-size:11px;color:var(--accent,#639922);font-weight:700;"></div>
          </div>
          <div id="slotGrid" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;"></div>

          <button id="confirmPlantBtn" class="btn-primary" style="width:100%;">Plant Now →</button>
        </div>
      </div>
    </div>`;const i=document.getElementById("addPlantModalOverlay");i.classList.add("open"),z(y),B(n,r),document.getElementById("closeAddPlantModal").addEventListener("click",P),i.addEventListener("click",s=>{s.target===i&&P()}),document.getElementById("speciesSearchBtn").addEventListener("click",A),document.getElementById("speciesSearchInput").addEventListener("keypress",s=>{s.key==="Enter"&&A()}),document.getElementById("confirmPlantBtn").addEventListener("click",()=>{if(!m){x("warning","Select a crop first");return}if(v===null){x("warning","Select a rack position");return}q(m),H(m,v,n),x("success",`${m.emoji} ${m.name} planted at ${$(v,n)}`),P(),d.notify(),document.getElementById("farmCanvas")&&L.init("farmCanvas")})}async function A(){var i;if(w)return;const e=document.getElementById("speciesSearchInput"),t=document.getElementById("speciesSearchStatus"),n=e.value.trim().toLowerCase();if(!n){x("warning","Enter a species name");return}const r=y.find(s=>s.species===n||s.name.toLowerCase()===n);if(r){T(r),t.textContent=`✅ ${r.name} is already in your crop list — selected!`,e.value="";return}w=!0,t.textContent="🤖 Looking up species data...",document.getElementById("speciesSearchBtn").textContent="...";try{const a=await(await fetch(`${G}/api/crops/species/${encodeURIComponent(n)}`)).json();if(a.error)throw new Error(a.error);const o={emoji:a.crop.emoji||h(n),name:a.crop.commonName||N(n),species:a.crop.species||b(n),days:((i=a.crop.requirements)==null?void 0:i.growthDays)||30,price:"Custom"};F(o),t.textContent=a.crop.aiGenerated?`✨ AI estimated data for "${o.name}" and saved to database!`:`✅ Found "${o.name}" in database — selected!`,e.value=""}catch(s){const a=W(n);F(a),t.textContent=`✅ Added "${a.name}" locally — choose position and Plant Now`,e.value="",console.warn("Species search fallback:",s.message)}finally{w=!1,document.getElementById("speciesSearchBtn").textContent="🔍 Add"}}function F(e){y.find(t=>t.species===e.species)||(y.push(e),z(y)),T(e)}function H(e,t,n){var I;const r=Math.floor(t/n.slotsPerTier)+1,i=t%n.slotsPerTier+1,s={name:e.name,emoji:e.emoji,species:e.species,slots:1,slotIndex:t,tier:r,position:i,status:"healthy",source:"manual"},a=j(),o=d.currentFarmId||((I=d.currentFarm)==null?void 0:I.id),l=a.findIndex(f=>f.id===o),c=l>=0?a[l]:d.currentFarm;if(!c)return;const u=M(c,n).filter(f=>Number(f.slotIndex)!==t);u.push(s),u.sort((f,R)=>Number(f.slotIndex??9999)-Number(R.slotIndex??9999));const S={...c,plants:u,plantSlots:u.length,targetPlant:c.targetPlant||e.name};l>=0&&(a[l]=S,localStorage.setItem(k,JSON.stringify(a))),d.currentFarm=S,d.currentFarmId=S.id||d.currentFarmId}function z(e){const t=document.getElementById("cropGrid");t&&(t.innerHTML=e.map(n=>`
    <div class="crop-option" data-species="${n.species}"
      style="background:var(--surface,#fff);border-radius:12px;padding:8px;text-align:center;cursor:pointer;border:2px solid transparent;transition:border .15s;">
      <div style="font-size:28px;">${n.emoji}</div>
      <div style="font-weight:600;font-size:11px;">${n.name}</div>
      <div style="font-size:10px;color:#999;">${n.days}d</div>
    </div>`).join(""),document.querySelectorAll(".crop-option").forEach(n=>{n.addEventListener("click",()=>{const r=e.find(i=>i.species===n.dataset.species);r&&T(r)})}))}function B(e,t){const n=document.getElementById("slotGrid");n&&(n.innerHTML=Array.from({length:e.tiers},(r,i)=>{const s=Array.from({length:e.slotsPerTier},(a,o)=>{const l=i*e.slotsPerTier+o,c=t[l],u=v===l;return`
        <button class="slot-option" data-slot-index="${l}"
          style="min-height:54px;border-radius:12px;border:2px solid ${u?"var(--accent,#639922)":"var(--border-color,#ddd)"};background:${u?"var(--accent-l,#eef8e7)":"var(--surface,#fff)"};cursor:pointer;padding:6px;text-align:center;">
          <div style="font-size:20px;line-height:1;">${(c==null?void 0:c.emoji)||"◻️"}</div>
          <div style="font-size:10px;font-weight:800;margin-top:4px;color:${c?"var(--text,#111)":"var(--text-secondary,#666)"};">${c?Y(c.name):`Slot ${o+1}`}</div>
        </button>`}).join("");return`
      <div>
        <div style="font-size:11px;font-weight:800;color:var(--text-secondary,#666);margin-bottom:5px;">Tier ${i+1}</div>
        <div style="display:grid;grid-template-columns:repeat(${e.slotsPerTier},minmax(44px,1fr));gap:6px;">${s}</div>
      </div>`}).join(""),n.querySelectorAll(".slot-option").forEach(r=>{r.addEventListener("click",()=>{v=Number(r.dataset.slotIndex),document.getElementById("positionStatus").textContent=$(v,e),B(e,t)})}))}function T(e){m=e,document.querySelectorAll(".crop-option").forEach(t=>{t.style.border=t.dataset.species===e.species?"2px solid var(--accent,#639922)":"2px solid transparent"})}function q(e){const t=d.tiles.find(n=>n.status==="empty"||!n.plant);t&&(t.plant=e.emoji,t.name=e.name,t.status="healthy",t.growth=0,t.days=e.days,t.species=e.species)}function D(){const e=j();return d.currentFarm||e.find(t=>t.id===d.currentFarmId)||d.newFarm||e[e.length-1]||null}function U(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?p["2-tier"]:t.includes("4")?p["4-tier"]:t.includes("5")?p["5-tier"]:t.includes("wall")||t.includes("grid")?p.wall:t.includes("frame")?p["a-frame"]:t.includes("nft")||t.includes("channel")?p["nft-channel"]:t.includes("hanging")||t.includes("column")?p.hanging:p["3-tier"]}function K(e,t){const n=Array(t.total).fill(null);return M(e,t).forEach(r=>{const i=Number(r.slotIndex);Number.isInteger(i)&&i>=0&&i<t.total&&(n[i]=r)}),n}function M(e,t){const n=Array.isArray(e==null?void 0:e.plants)?e.plants:V(e,t),r=[],i=new Set;return n.forEach(s=>{if(s.slotIndex!==void 0&&s.slotIndex!==null){const o=Number(s.slotIndex);Number.isInteger(o)&&o>=0&&o<t.total&&!i.has(o)&&(r.push(E(s,o,t)),i.add(o));return}const a=Math.max(1,Number.parseInt(s.slots||s.count||1,10)||1);for(let o=0;o<a;o++){const l=J(i,t.total);if(l===-1)return;r.push(E(s,l,t)),i.add(l)}}),r}function E(e,t,n){return{name:e.name||"Plant",emoji:e.emoji||h(e.name||e.species),species:e.species||b(e.name),slots:1,slotIndex:t,tier:Math.floor(t/n.slotsPerTier)+1,position:t%n.slotsPerTier+1,status:e.status||"healthy",source:e.source||"existing"}}function J(e,t){for(let n=0;n<t;n++)if(!e.has(n))return n;return-1}function V(e,t){const n=Math.max(0,Math.min(t.total,Number.parseInt((e==null?void 0:e.plantSlots)||(e==null?void 0:e.plants)||0,10)||0)),r=(e==null?void 0:e.targetPlant)||"Plant";return Array.from({length:n},(i,s)=>E({name:r,emoji:h(r),species:b(r),status:"healthy"},s,t))}function j(){try{return JSON.parse(localStorage.getItem(k))||[]}catch{return[]}}function W(e){return{emoji:h(e),name:N(e),species:b(e),days:30,price:"Custom"}}function $(e,t){return`Tier ${Math.floor(e/t.slotsPerTier)+1} · Slot ${e%t.slotsPerTier+1}`}function N(e){const t=String(e||"Plant").trim();return t.charAt(0).toUpperCase()+t.slice(1)}function b(e){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function h(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("cabbage")||t.includes("kale")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("strawberry")?"🍓":t.includes("cucumber")?"🥒":t.includes("carrot")?"🥕":t.includes("eggplant")||t.includes("aubergine")||t.includes("brinjal")?"🍆":t.includes("basil")||t.includes("mint")||t.includes("spinach")||t.includes("cilantro")||t.includes("parsley")?"🌿":"🌱"}function Y(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function P(){m=null,v=null;const e=document.getElementById("addPlantModalOverlay");e&&e.remove()}function Z(){var t,n,r;console.log("[HomePage] render called");const e=document.getElementById("screenContainer");e.innerHTML=`
        <div class="screen active" id="homeScreen">
            <div class="topbar">
                <button id="backToFarms" class="back-btn" style="background:transparent; border:none; font-size:20px;">←</button>
                <div class="topbar-brand"><span style="font-weight:700;">${d.farmName}</span></div>
                <div style="flex:1"></div>
                <div id="topbarPill"></div>
                <button id="addPlantTopBtn" class="topbar-btn" style="margin-left:8px;">+ Plant</button>
            </div>
            <div class="bottom-nav">
                <div class="nav-item active" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
            <div style="flex:1; overflow-y:auto;">
                <div class="farm-stage-wrap" style="margin:12px 16px; position:relative;">
                    <canvas id="farmCanvas" style="width:100%; height:220px; border-radius:24px; background:#EAF4FF;"></canvas>
                    <button id="fabPlant" style="position:absolute; bottom:12px; right:12px; background:var(--accent); border:none; width:44px; height:44px; border-radius:14px; color:white; font-size:24px;">+</button>
                </div>
                <div id="dashStrip" class="sensor-strip"></div>
                <div class="advisor-wrap" style="margin:12px 16px;">
                    <div class="advisor-card" style="background:var(--surface); border-radius:20px; padding:14px; display:flex; gap:12px;">
                        <div id="npcAvatar" style="font-size:36px;">🧑‍🌾</div>
                        <div style="flex:1;">
                            <div id="npcName" style="font-weight:700; color:var(--accent);">FARM ADVISOR</div>
                            <div id="npcText" style="font-size:0.8rem; color:var(--sub);">Loading insights...</div>
                            <div style="display:flex; gap:8px; margin-top:8px;">
                                <button id="npcNext" class="advisor-btn primary">Next →</button>
                                <button id="npcDismiss" class="advisor-btn">Dismiss</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin:12px 16px;">
                    <div style="font-size:0.6rem; font-weight:700; color:var(--muted);">FEATURES</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
                        <div class="feat-card" data-feature="whatif" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">🔮</span><div>What-If</div><div style="font-size:0.7rem;">Simulate yield</div></div>
                        <div class="feat-card" data-feature="consumption" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">⚡</span><div>Eco Save</div><div style="font-size:0.7rem;">Track savings</div></div>
                        <div class="feat-card" data-feature="alerts" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">🚨</span><div>AI Alerts</div><div style="font-size:0.7rem;">Predict issues</div></div>
                        <div class="feat-card" data-feature="community" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">🏘️</span><div>Community</div><div style="font-size:0.7rem;">Trade & chat</div></div>
                    </div>
                </div>
            </div>
        </div>
    `,setTimeout(()=>{console.log("[HomePage] Initializing canvas and sensors"),L.init("farmCanvas"),O.init(),_.init()},100),(t=document.getElementById("backToFarms"))==null||t.addEventListener("click",()=>g("farmlist")),(n=document.getElementById("addPlantTopBtn"))==null||n.addEventListener("click",C),(r=document.getElementById("fabPlant"))==null||r.addEventListener("click",C),document.querySelectorAll(".feat-card").forEach(i=>{i.addEventListener("click",()=>{const s=i.getAttribute("data-feature");s==="community"?g("community"):g("feature",{feature:s})})}),document.querySelectorAll(".bottom-nav .nav-item").forEach(i=>{i.addEventListener("click",()=>{const s=i.getAttribute("data-screen");s==="profile"?(d.profileFrom="home",g("profile")):s==="home"&&g("home")})})}export{Z as render};
