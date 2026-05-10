import{a as m,A as o,F as E,S,N as w,s as l}from"./index-EcHkYwq1.js";import"https://esm.sh/three@0.160.0";const p=[{emoji:"🥬",name:"Lettuce",species:"lettuce",days:45,price:"RM 1.20"},{emoji:"🌿",name:"Spinach",species:"spinach",days:40,price:"RM 0.90"},{emoji:"🌱",name:"Basil",species:"basil",days:30,price:"RM 2.50"},{emoji:"🍅",name:"Tomato",species:"tomato",days:70,price:"RM 3.00"},{emoji:"🥕",name:"Carrot",species:"carrot",days:75,price:"RM 1.50"},{emoji:"🥬",name:"Cabbage",species:"cabbage",days:90,price:"RM 1.80"},{emoji:"🍆",name:"Eggplant",species:"eggplant",days:80,price:"RM 2.20"}];let r=null,v=null,u=!1;function g(){const a=document.getElementById("modalContainer");a.innerHTML=`
    <div class="modal-overlay" id="addPlantModalOverlay">
      <div class="modal-sheet">
        <div style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <span style="font-weight:700;">🌱 Add New Plant</span>
            <button id="closeAddPlantModal" style="background:none;border:none;font-size:20px;cursor:pointer;">✕</button>
          </div>

          <!-- Search / Custom Species -->
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

          <!-- Crop Grid -->
          <div style="font-size:0.7rem;color:var(--text-secondary,#666);margin-bottom:6px;">SELECT CROP</div>
          <div id="cropGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;max-height:200px;overflow-y:auto;"></div>

          <!-- Tile Grid -->
          <div style="font-size:0.7rem;color:var(--text-secondary,#666);margin-bottom:6px;">SELECT EMPTY TILE</div>
          <div id="tileGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;"></div>

          <button id="confirmPlantBtn" class="btn-primary" style="width:100%;">Plant Now →</button>
        </div>
      </div>
    </div>`;const t=document.getElementById("addPlantModalOverlay");t.classList.add("open"),b(p),C(),document.getElementById("closeAddPlantModal").addEventListener("click",y),t.addEventListener("click",e=>{e.target===t&&y()}),document.getElementById("speciesSearchBtn").addEventListener("click",x),document.getElementById("speciesSearchInput").addEventListener("keypress",e=>{e.key==="Enter"&&x()}),document.getElementById("confirmPlantBtn").addEventListener("click",()=>{if(!r){m("warning","Select a crop first");return}if(v===null){m("warning","Select an empty tile");return}const e=o.tiles[v];e.plant=r.emoji,e.name=r.name,e.status="healthy",e.growth=0,e.days=r.days,e.species=r.species,m("success",`${r.emoji} ${r.name} planted!`),y(),o.notify()})}async function x(){var s;if(u)return;const a=document.getElementById("speciesSearchInput"),t=document.getElementById("speciesSearchStatus"),e=a.value.trim().toLowerCase();if(!e){m("warning","Enter a species name");return}const i=p.find(n=>n.species===e||n.name.toLowerCase()===e);if(i){f(i),t.textContent=`✅ ${i.name} is already in your crop list — selected!`,a.value="";return}u=!0,t.textContent="🤖 Looking up species data...",document.getElementById("speciesSearchBtn").textContent="...";try{const d=await(await fetch(`http://localhost:3000/api/crops/species/${encodeURIComponent(e)}`)).json();if(d.error)throw new Error(d.error);const c={emoji:d.crop.emoji||"🌱",name:d.crop.commonName||e,species:d.crop.species,days:((s=d.crop.requirements)==null?void 0:s.growthDays)||30,price:"Custom"};p.find(h=>h.species===c.species)||(p.push(c),b(p)),f(c),t.textContent=d.crop.aiGenerated?`✨ AI estimated data for "${c.name}" and saved to database!`:`✅ Found "${c.name}" in database — selected!`,a.value=""}catch(n){t.textContent=`❌ Could not find "${e}" — try a different name`,console.error("Species search error:",n)}finally{u=!1,document.getElementById("speciesSearchBtn").textContent="🔍 Add"}}function f(a){r=a,document.querySelectorAll(".crop-option").forEach(t=>{t.style.border=t.dataset.species===a.species?"2px solid var(--accent,#639922)":"none"})}function b(a){const t=document.getElementById("cropGrid");t&&(t.innerHTML=a.map(e=>`
    <div class="crop-option" data-species="${e.species}"
      style="background:var(--surface,#fff);border-radius:12px;padding:8px;text-align:center;cursor:pointer;border:2px solid transparent;transition:border .15s;">
      <div style="font-size:28px;">${e.emoji}</div>
      <div style="font-weight:600;font-size:11px;">${e.name}</div>
      <div style="font-size:10px;color:#999;">${e.days}d</div>
    </div>`).join(""),document.querySelectorAll(".crop-option").forEach(e=>{e.addEventListener("click",()=>{const i=a.find(s=>s.species===e.dataset.species);i&&f(i)})}))}function C(){const a=document.getElementById("tileGrid");a&&(a.innerHTML=o.tiles.map((t,e)=>`
    <div class="tile-option" data-idx="${e}"
      style="background:${t.status==="empty"?"var(--surface,#fff)":"#eee"};border-radius:12px;padding:12px;text-align:center;cursor:${t.status==="empty"?"pointer":"not-allowed"};border:2px solid transparent;">
      ${t.status==="empty"?"◻️":t.plant||"🌱"}
    </div>`).join(""),document.querySelectorAll(".tile-option").forEach(t=>{const e=parseInt(t.dataset.idx);o.tiles[e].status==="empty"&&t.addEventListener("click",()=>{document.querySelectorAll(".tile-option").forEach(i=>i.style.border="2px solid transparent"),t.style.border="2px solid var(--accent,#639922)",v=e})}))}function y(){r=null,v=null;const a=document.getElementById("addPlantModalOverlay");a&&a.remove()}function A(){var t,e,i;console.log("[HomePage] render called");const a=document.getElementById("screenContainer");a.innerHTML=`
        <div class="screen active" id="homeScreen">
            <div class="topbar">
                <button id="backToFarms" class="back-btn" style="background:transparent; border:none; font-size:20px;">←</button>
                <div class="topbar-brand"><span style="font-weight:700;">${o.farmName}</span></div>
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
    `,setTimeout(()=>{console.log("[HomePage] Initializing canvas and sensors"),E.init("farmCanvas"),S.init(),w.init()},100),(t=document.getElementById("backToFarms"))==null||t.addEventListener("click",()=>l("farmlist")),(e=document.getElementById("addPlantTopBtn"))==null||e.addEventListener("click",g),(i=document.getElementById("fabPlant"))==null||i.addEventListener("click",g),document.querySelectorAll(".feat-card").forEach(s=>{s.addEventListener("click",()=>{const n=s.getAttribute("data-feature");n==="community"?l("community"):l("feature",{feature:n})})}),document.querySelectorAll(".bottom-nav .nav-item").forEach(s=>{s.addEventListener("click",()=>{const n=s.getAttribute("data-screen");n==="profile"?(o.profileFrom="home",l("profile")):n==="home"&&l("home")})})}export{A as render};
