import{A as i,s as c,a as p}from"./index-CdCCAZ2S.js";import{s as y}from"./firebase-CFo32-pk.js";import"https://esm.sh/three@0.160.0";const m="user_farms";function u(){console.log("[FarmListPage] render called");const e=document.getElementById("screenContainer");let t=E();t.length===0&&(t=[{id:`farm_${Date.now()}`,name:"Farm 1 - Rack Alpha",plants:6,plantSlots:6,zone:"A",location:"Zone A",targetPlant:"Lettuce",rackLabel:"3-Tier Vertical Rack",createdAt:new Date().toISOString()}],v(t));const n=i.mode==="commercial";e.innerHTML=`
        <div class="screen active" id="farmlistScreen">
            <div class="topbar">
                <div class="topbar-brand">
                    <span style="font-size:24px;">🌿</span>
                    <span style="font-weight:700;">SeedDown</span>
                    <span style="margin-left:8px; color:var(--muted);">Farms</span>
                </div>
                <div style="flex:1"></div>
                <div id="switchModeBtn" style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <span style="font-size:0.72rem; font-weight:700; color:${n?"var(--muted)":"var(--accent)"};">🌱</span>
                    <div style="position:relative; width:48px; height:26px; background:${n?"var(--accent)":"var(--border)"}; border-radius:100px; transition:background 0.25s;">
                        <div style="position:absolute; top:3px; left:${n?"25px":"3px"}; width:20px; height:20px; border-radius:50%; background:white; box-shadow:0 1px 4px rgba(0,0,0,0.25); transition:left 0.25s;"></div>
                    </div>
                    <span style="font-size:0.72rem; font-weight:700; color:${n?"var(--accent)":"var(--muted)"};">🏭</span>
                </div>
            </div>

            <div style="padding:16px; flex:1; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="font-size:0.7rem; font-weight:700; color:var(--sub);">SELECT FIELD (${t.length})</div>
                    <button id="buildFarmBtn" class="btn-outline" style="padding:6px 12px;">+ New Field</button>
                </div>

                <div id="farmList" style="display:flex; flex-direction:column; gap:10px;">
                    ${t.map(w).join("")}
                </div>
            </div>

            <div class="bottom-nav">
                <div class="nav-item active" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `,h(t)}function h(e){document.querySelectorAll(".farm-card").forEach(t=>{t.addEventListener("click",()=>{const n=e.find(r=>r.id===t.dataset.farmId);n&&g(n)})}),document.querySelectorAll(".farm-details-btn").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const r=e.find(o=>o.id===t.dataset.farmId);r&&F(r)})}),document.querySelectorAll(".farm-delete-btn").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const r=e.find(o=>o.id===t.dataset.farmId);r&&k(r,e)})}),document.getElementById("buildFarmBtn").onclick=()=>c("buildfarm"),document.getElementById("switchModeBtn").onclick=()=>{i.mode=i.mode==="beginner"?"commercial":"beginner",p("info",`Switched to ${i.mode==="commercial"?"🏭 Commercial":"🌱 Beginner"} mode`),u()},document.querySelectorAll(".bottom-nav .nav-item").forEach(t=>{t.onclick=()=>{t.dataset.screen==="profile"&&(i.profileFrom="farmlist",c("profile"))}})}function w(e){return`
        <div class="farm-card" data-farm-id="${s(e.id)}" style="background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:14px; display:flex; align-items:center; gap:12px; cursor:pointer;">
            <div style="width:44px; height:44px; background:var(--accent-l); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px;">🏗️</div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a(e.name)}</div>
                <div style="font-size:0.7rem; color:var(--muted);">${I(e)}</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
                <button class="farm-details-btn" data-farm-id="${s(e.id)}" title="Field details" aria-label="View field details"
                    style="width:32px;height:32px;border:1px solid var(--border);background:var(--surface2);color:var(--accent);border-radius:10px;font-size:15px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;">i</button>
                <button class="farm-delete-btn" data-farm-id="${s(e.id)}" title="Delete field" aria-label="Delete field"
                    style="width:32px;height:32px;border:1px solid rgba(220,38,38,.24);background:rgba(220,38,38,.08);color:var(--danger);border-radius:10px;font-size:15px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
            </div>
        </div>
    `}function F(e){const t=document.getElementById("modalContainer");t&&(t.innerHTML=`
        <div class="modal-overlay open" id="farmDetailsModal">
            <div class="modal-sheet">
                <div style="padding:18px;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px;">
                        <div>
                            <div style="font-size:11px;font-weight:800;color:var(--muted);letter-spacing:.08em;">FIELD DETAILS</div>
                            <div style="font-size:18px;font-weight:900;margin-top:2px;">${a(e.name)}</div>
                        </div>
                        <button id="closeFarmDetails" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text);">×</button>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
                        ${d("Created",D(e.createdAt))}
                        ${d("Location",e.location||e.zone||"Not set")}
                        ${d("Rack",e.rackLabel||e.rackType||e.rackTypeId||"3-tier")}
                        ${d("Plants",`${f(e)} plants`)}
                        ${d("Slots",`${x(e)} slots`)}
                        ${d("Goal",e.analysisGoal||"Not set")}
                    </div>

                    <div style="font-size:11px;font-weight:800;color:var(--muted);letter-spacing:.08em;margin-bottom:8px;">PLANT MAP</div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">${S(e)}</div>

                    <button id="detailsEnterFarm" class="btn-primary" style="width:100%;">Open Field</button>
                </div>
            </div>
        </div>
    `,document.getElementById("closeFarmDetails").onclick=l,document.getElementById("farmDetailsModal").addEventListener("click",n=>{n.target.id==="farmDetailsModal"&&l()}),document.getElementById("detailsEnterFarm").onclick=()=>{l(),g(e)})}function k(e,t){const n=document.getElementById("modalContainer");n&&(n.innerHTML=`
        <div class="modal-overlay open" id="deleteFarmModal">
            <div class="modal-sheet">
                <div style="padding:18px;">
                    <div style="font-size:18px;font-weight:900;margin-bottom:6px;">Delete field?</div>
                    <div style="font-size:13px;color:var(--sub);line-height:1.45;margin-bottom:14px;">${a(e.name)} will be removed from this device. This cannot be undone.</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <button id="cancelDeleteFarm" style="padding:13px;border:1px solid var(--border);border-radius:12px;background:var(--surface2);font-weight:800;cursor:pointer;color:var(--text);">Cancel</button>
                        <button id="confirmDeleteFarm" style="padding:13px;border:none;border-radius:12px;background:var(--danger);font-weight:800;cursor:pointer;color:#fff;">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `,document.getElementById("cancelDeleteFarm").onclick=l,document.getElementById("deleteFarmModal").addEventListener("click",r=>{r.target.id==="deleteFarmModal"&&l()}),document.getElementById("confirmDeleteFarm").onclick=()=>$(e.id,t))}function $(e,t){var r,o;const n=t.filter(b=>b.id!==e);v(n),i.currentFarmId===e&&(i.currentFarmId=((r=n[0])==null?void 0:r.id)||null,i.currentFarm=n[0]||null,i.farmName=((o=n[0])==null?void 0:o.name)||"My Farm"),l(),p("success","Field deleted"),u()}function g(e){i.currentFarmId=e.id,i.currentFarm=e,i.farmName=e.name,console.log(`[FarmListPage] Entering Farm ID: ${e.id}`);const t=i.mode==="beginner"?"home":"dash-c";c(t)}function v(e){localStorage.setItem(m,JSON.stringify(e)),i.uid&&y(i.uid,e)}function E(){try{return JSON.parse(localStorage.getItem(m))||[]}catch{return[]}}function l(){const e=document.getElementById("modalContainer");e&&(e.innerHTML="")}function I(e){const t=e.targetPlant?`${a(e.targetPlant)} · `:"",n=e.rackLabel||e.rackType||e.rackTypeId||"Rack";return`${t}${x(e)} slots · ${a(n)}`}function d(e,t){return`
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase;">${a(e)}</div>
            <div style="font-size:13px;font-weight:800;color:var(--text);margin-top:3px;word-break:break-word;">${a(t)}</div>
        </div>
    `}function S(e){const t=Array.isArray(e.plants)?e.plants:[];if(!t.length){const n=e.targetPlant||"Plant";return`<span style="padding:7px 10px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:12px;font-weight:800;">${a(n)}</span>`}return t.map(n=>{const r=n.tier&&n.position?` · T${n.tier} S${n.position}`:"";return`<span style="padding:7px 10px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:12px;font-weight:800;">${a(n.emoji||"🌱")} ${a(n.name||n.species||"Plant")}${r}</span>`}).join("")}function f(e){return Array.isArray(e.plants)?e.plants.length:Number.parseInt(e.plants,10)||Number.parseInt(e.plantSlots,10)||0}function x(e){return Number.parseInt(e.plantSlots,10)||f(e)}function D(e){if(!e)return"Not set";const t=new Date(e);return Number.isNaN(t.getTime())?String(e):t.toLocaleString([],{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function a(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function s(e){return a(e).replace(/`/g,"&#096;")}export{u as render};
