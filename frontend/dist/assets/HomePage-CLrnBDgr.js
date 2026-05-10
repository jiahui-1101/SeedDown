import{a as f,A as c,F as R,S as U,N as K,s as x}from"./index-CdCCAZ2S.js";import"https://esm.sh/three@0.160.0";const O="user_farms",J=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,v={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},b=[{emoji:"🥬",name:"Lettuce",species:"lettuce",days:45,price:"RM 1.20"},{emoji:"🌿",name:"Spinach",species:"spinach",days:40,price:"RM 0.90"},{emoji:"🌱",name:"Basil",species:"basil",days:30,price:"RM 2.50"},{emoji:"🍅",name:"Tomato",species:"tomato",days:70,price:"RM 3.00"},{emoji:"🥒",name:"Cucumber",species:"cucumber",days:55,price:"RM 2.10"},{emoji:"🥕",name:"Carrot",species:"carrot",days:75,price:"RM 1.50"},{emoji:"🥬",name:"Cabbage",species:"cabbage",days:90,price:"RM 1.80"},{emoji:"🍆",name:"Eggplant",species:"eggplant",days:80,price:"RM 2.20"}];let u=null,d=null,h=null,w=[],I=!1;function k(){const e=document.getElementById("modalContainer");if(!e)return;const t=Q(),n=X(t),i=Z(t,n);h=n,w=i,e.innerHTML=`
    <div class="modal-overlay" id="addPlantModalOverlay">
      <div class="modal-sheet">
        <div style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-weight:700;">🌱 Manage Plants</span>
            <button id="closeAddPlantModal" style="background:none;border:none;font-size:20px;cursor:pointer;" aria-label="Close plant manager">✕</button>
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
              <div style="font-size:11px;color:var(--text-secondary,#666);">${n.label} · select a slot to add, change, or remove</div>
            </div>
            <div id="positionStatus" style="font-size:11px;color:var(--accent,#639922);font-weight:700;"></div>
          </div>
          <div id="slotGrid" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;"></div>
          <div id="slotActionPanel" style="border:1px solid var(--border-color,#e7e7e7);border-radius:12px;padding:10px;margin-bottom:12px;background:var(--bg-secondary,#f7f7f7);font-size:12px;color:var(--text-secondary,#666);"></div>

          <div style="display:grid;grid-template-columns:0.9fr 1.1fr;gap:8px;">
            <button id="removePlantBtn" style="width:100%;border:1px solid #efb2b2;background:#fff5f5;color:#c83a3a;border-radius:10px;padding:11px 8px;font-weight:800;cursor:pointer;">Remove</button>
            <button id="confirmPlantBtn" class="btn-primary" style="width:100%;">Plant Now →</button>
          </div>
        </div>
      </div>
    </div>`;const r=document.getElementById("addPlantModalOverlay");r.classList.add("open"),_(b),G(n,i),$(n,i),A(n,i),document.getElementById("closeAddPlantModal").addEventListener("click",P),r.addEventListener("click",s=>{s.target===r&&P()}),document.getElementById("speciesSearchBtn").addEventListener("click",z),document.getElementById("speciesSearchInput").addEventListener("keypress",s=>{s.key==="Enter"&&z()}),document.getElementById("removePlantBtn").addEventListener("click",()=>{if(d===null){f("warning","Select a planted slot first");return}const s=i[d];if(!s){f("warning","That slot is already empty");return}W(d,n),f("success",`${s.emoji} ${s.name} removed from ${g(d,n)}`),P(),N()}),document.getElementById("confirmPlantBtn").addEventListener("click",()=>{if(!u){f("warning","Select a crop first");return}if(d===null){f("warning","Select a rack position");return}const s=i[d];Y(u),V(u,d,n);const a=s?"changed to":"planted at";f("success",`${u.emoji} ${u.name} ${a} ${g(d,n)}`),P(),N()})}async function z(){var r;if(I)return;const e=document.getElementById("speciesSearchInput"),t=document.getElementById("speciesSearchStatus"),n=e.value.trim().toLowerCase();if(!n){f("warning","Enter a species name");return}const i=b.find(s=>s.species===n||s.name.toLowerCase()===n);if(i){B(i),t.textContent=`✅ ${i.name} is already in your crop list — selected!`,e.value="";return}I=!0,t.textContent="🤖 Looking up species data...",document.getElementById("speciesSearchBtn").textContent="...";try{const a=await(await fetch(`${J}/api/crops/species/${encodeURIComponent(n)}`)).json();if(a.error)throw new Error(a.error);const o={emoji:a.crop.emoji||T(n),name:a.crop.commonName||q(n),species:a.crop.species||E(n),days:((r=a.crop.requirements)==null?void 0:r.growthDays)||30,price:"Custom"};j(o),t.textContent=a.crop.aiGenerated?`✨ AI estimated data for "${o.name}" and saved to database!`:`✅ Found "${o.name}" in database — selected!`,e.value=""}catch(s){const a=ne(n);j(a),t.textContent=`✅ Added "${a.name}" locally — choose position and Plant Now`,e.value="",console.warn("Species search fallback:",s.message)}finally{I=!1,document.getElementById("speciesSearchBtn").textContent="🔍 Add"}}function j(e){b.find(t=>t.species===e.species)||(b.push(e),_(b)),B(e)}function V(e,t,n){var M;const i=Math.floor(t/n.slotsPerTier)+1,r=t%n.slotsPerTier+1,s={name:e.name,emoji:e.emoji,species:e.species,slots:1,slotIndex:t,tier:i,position:r,status:"healthy",source:"manual"},a=L(),o=c.currentFarmId||((M=c.currentFarm)==null?void 0:M.id),p=a.findIndex(y=>y.id===o),l=p>=0?a[p]:c.currentFarm;if(!l)return;const m=F(l,n).filter(y=>Number(y.slotIndex)!==t);m.push(s),m.sort((y,D)=>Number(y.slotIndex??9999)-Number(D.slotIndex??9999)),H(l,m,p,a,e.name)}function W(e,t){var o,p;const n=L(),i=c.currentFarmId||((o=c.currentFarm)==null?void 0:o.id),r=n.findIndex(l=>l.id===i),s=r>=0?n[r]:c.currentFarm;if(!s)return;const a=F(s,t).filter(l=>Number(l.slotIndex)!==e).sort((l,m)=>Number(l.slotIndex??9999)-Number(m.slotIndex??9999));H(s,a,r,n,((p=a[0])==null?void 0:p.name)||s.targetPlant||"Plant")}function H(e,t,n,i,r){var a;const s={...e,plants:t,plantSlots:t.length,targetPlant:((a=t[0])==null?void 0:a.name)||r};n>=0&&(i[n]=s,localStorage.setItem(O,JSON.stringify(i))),c.currentFarm=s,c.currentFarmId=s.id||c.currentFarmId}function _(e){const t=document.getElementById("cropGrid");t&&(t.innerHTML=e.map(n=>`
    <div class="crop-option" data-species="${n.species}"
      style="background:var(--surface,#fff);border-radius:12px;padding:8px;text-align:center;cursor:pointer;border:2px solid transparent;transition:border .15s;">
      <div style="font-size:28px;">${n.emoji}</div>
      <div style="font-weight:600;font-size:11px;">${n.name}</div>
      <div style="font-size:10px;color:#999;">${n.days}d</div>
    </div>`).join(""),document.querySelectorAll(".crop-option").forEach(n=>{n.addEventListener("click",()=>{const i=e.find(r=>r.species===n.dataset.species);i&&B(i)})}))}function G(e,t){const n=document.getElementById("slotGrid");n&&(n.innerHTML=Array.from({length:e.tiers},(i,r)=>{const s=Array.from({length:e.slotsPerTier},(a,o)=>{const p=r*e.slotsPerTier+o,l=t[p],m=d===p;return`
        <button class="slot-option" data-slot-index="${p}"
          aria-label="${l?`Change or remove ${S(l.name)}`:`Plant slot ${o+1}`}"
          style="min-height:54px;border-radius:12px;border:2px solid ${m?"var(--accent,#639922)":"var(--border-color,#ddd)"};background:${m?"var(--accent-l,#eef8e7)":"var(--surface,#fff)"};cursor:pointer;padding:6px;text-align:center;">
          <div style="font-size:20px;line-height:1;">${(l==null?void 0:l.emoji)||"◻️"}</div>
          <div style="font-size:10px;font-weight:800;margin-top:4px;color:${l?"var(--text,#111)":"var(--text-secondary,#666)"};">${l?S(l.name):`Slot ${o+1}`}</div>
        </button>`}).join("");return`
      <div>
        <div style="font-size:11px;font-weight:800;color:var(--text-secondary,#666);margin-bottom:5px;">Tier ${r+1}</div>
        <div style="display:grid;grid-template-columns:repeat(${e.slotsPerTier},minmax(44px,1fr));gap:6px;">${s}</div>
      </div>`}).join(""),n.querySelectorAll(".slot-option").forEach(i=>{i.addEventListener("click",()=>{d=Number(i.dataset.slotIndex);const r=t[d];document.getElementById("positionStatus").textContent=r?`${g(d,e)} · ${r.name}`:g(d,e),G(e,t),$(e,t),A(e,t)})}))}function $(e,t){const n=document.getElementById("slotActionPanel");if(!n)return;if(d===null){n.innerHTML="Choose a slot first. Empty slots can be planted; occupied slots can be changed or removed.";return}const i=t[d],r=u?`${u.emoji} ${u.name}`:"a crop";if(i){n.innerHTML=`
      <div style="font-weight:800;color:var(--text,#111);margin-bottom:4px;">${g(d,e)}</div>
      <div>Current: <strong>${i.emoji} ${S(i.name)}</strong></div>
      <div style="margin-top:3px;">Select ${S(r)} and press Change, or remove this plant.</div>`;return}n.innerHTML=`
    <div style="font-weight:800;color:var(--text,#111);margin-bottom:4px;">${g(d,e)}</div>
    <div>Empty slot. Select ${S(r)} and press Plant Now.</div>`}function A(e,t){const n=document.getElementById("confirmPlantBtn"),i=document.getElementById("removePlantBtn");if(!n||!i)return;const r=d===null?null:t[d];n.textContent=r?"Change Plant →":"Plant Now →",n.disabled=d===null||!u,n.style.opacity=n.disabled?"0.55":"1",n.style.cursor=n.disabled?"not-allowed":"pointer",i.disabled=!r,i.style.opacity=r?"1":"0.45",i.style.cursor=r?"pointer":"not-allowed"}function B(e){u=e,document.querySelectorAll(".crop-option").forEach(t=>{t.style.border=t.dataset.species===e.species?"2px solid var(--accent,#639922)":"2px solid transparent"}),h&&($(h,w),A(h,w))}function Y(e){const t=c.tiles.find(n=>n.status==="empty"||!n.plant);t&&(t.plant=e.emoji,t.name=e.name,t.status="healthy",t.growth=0,t.days=e.days,t.species=e.species)}function N(){c.notify(),document.getElementById("farmCanvas")&&R.init("farmCanvas")}function Q(){const e=L();return c.currentFarm||e.find(t=>t.id===c.currentFarmId)||c.newFarm||e[e.length-1]||null}function X(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?v["2-tier"]:t.includes("4")?v["4-tier"]:t.includes("5")?v["5-tier"]:t.includes("wall")||t.includes("grid")?v.wall:t.includes("frame")?v["a-frame"]:t.includes("nft")||t.includes("channel")?v["nft-channel"]:t.includes("hanging")||t.includes("column")?v.hanging:v["3-tier"]}function Z(e,t){const n=Array(t.total).fill(null);return F(e,t).forEach(i=>{const r=Number(i.slotIndex);Number.isInteger(r)&&r>=0&&r<t.total&&(n[r]=i)}),n}function F(e,t){const n=Array.isArray(e==null?void 0:e.plants)?e.plants:te(e,t),i=[],r=new Set;return n.forEach(s=>{if(s.slotIndex!==void 0&&s.slotIndex!==null){const o=Number(s.slotIndex);Number.isInteger(o)&&o>=0&&o<t.total&&!r.has(o)&&(i.push(C(s,o,t)),r.add(o));return}const a=Math.max(1,Number.parseInt(s.slots||s.count||1,10)||1);for(let o=0;o<a;o++){const p=ee(r,t.total);if(p===-1)return;i.push(C(s,p,t)),r.add(p)}}),i}function C(e,t,n){return{name:e.name||"Plant",emoji:e.emoji||T(e.name||e.species),species:e.species||E(e.name),slots:1,slotIndex:t,tier:Math.floor(t/n.slotsPerTier)+1,position:t%n.slotsPerTier+1,status:e.status||"healthy",source:e.source||"existing"}}function ee(e,t){for(let n=0;n<t;n++)if(!e.has(n))return n;return-1}function te(e,t){const n=Math.max(0,Math.min(t.total,Number.parseInt((e==null?void 0:e.plantSlots)||(e==null?void 0:e.plants)||0,10)||0)),i=(e==null?void 0:e.targetPlant)||"Plant";return Array.from({length:n},(r,s)=>C({name:i,emoji:T(i),species:E(i),status:"healthy"},s,t))}function L(){try{return JSON.parse(localStorage.getItem(O))||[]}catch{return[]}}function ne(e){return{emoji:T(e),name:q(e),species:E(e),days:30,price:"Custom"}}function g(e,t){return`Tier ${Math.floor(e/t.slotsPerTier)+1} · Slot ${e%t.slotsPerTier+1}`}function q(e){const t=String(e||"Plant").trim();return t.charAt(0).toUpperCase()+t.slice(1)}function E(e){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function T(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("cabbage")||t.includes("kale")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("strawberry")?"🍓":t.includes("cucumber")?"🥒":t.includes("carrot")?"🥕":t.includes("eggplant")||t.includes("aubergine")||t.includes("brinjal")?"🍆":t.includes("basil")||t.includes("mint")||t.includes("spinach")||t.includes("cilantro")||t.includes("parsley")?"🌿":"🌱"}function S(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function P(){u=null,d=null,h=null,w=[];const e=document.getElementById("addPlantModalOverlay");e&&e.remove()}function se(){var t,n,i;console.log("[HomePage] render called");const e=document.getElementById("screenContainer");e.innerHTML=`
        <div class="screen active" id="homeScreen">
            <div class="topbar">
                <button id="backToFarms" class="back-btn" style="background:transparent; border:none; font-size:20px;">←</button>
                <div class="topbar-brand"><span style="font-weight:700;">${c.farmName}</span></div>
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
    `,setTimeout(()=>{console.log("[HomePage] Initializing canvas and sensors"),R.init("farmCanvas"),U.init(),K.init()},100),(t=document.getElementById("backToFarms"))==null||t.addEventListener("click",()=>x("farmlist")),(n=document.getElementById("addPlantTopBtn"))==null||n.addEventListener("click",k),(i=document.getElementById("fabPlant"))==null||i.addEventListener("click",k),document.querySelectorAll(".feat-card").forEach(r=>{r.addEventListener("click",()=>{const s=r.getAttribute("data-feature");s==="community"?x("community"):x("feature",{feature:s})})}),document.querySelectorAll(".bottom-nav .nav-item").forEach(r=>{r.addEventListener("click",()=>{const s=r.getAttribute("data-screen");s==="profile"?(c.profileFrom="home",x("profile")):s==="home"&&x("home")})})}export{se as render};
