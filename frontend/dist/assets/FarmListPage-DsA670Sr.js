import{A as r,s as m,a as h}from"./index-CsAh1mPh.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const g="user_farms",u=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function f(){return{"Content-Type":"application/json",Authorization:`Bearer ${localStorage.getItem("token")}`}}function k(){console.log("[FarmListPage] render called");const e=document.getElementById("screenContainer");let t=S();if(t.length===0){const a={id:`farm_${Date.now()}`,name:"Farm 1 - Rack Alpha",plants:6,plantSlots:6,zone:"A",location:"Zone A",targetPlant:"Lettuce",rackLabel:"3-Tier Vertical Rack",createdAt:new Date().toISOString()};t=[a],y(t),localStorage.getItem("token")&&fetch(`${u}/api/farms/create`,{method:"POST",headers:f(),body:JSON.stringify(a)}).catch(s=>console.warn("[FarmListPage] Dummy farm sync skipped:",s.message))}const n=r.mode==="commercial";e.innerHTML=`
        <div class="screen active" id="farmlistScreen">
            <div class="topbar">
                <div class="topbar-brand">
                    <span style="font-size:24px;">🌿</span>
                    <span style="font-weight:700;">SeedDown</span>
                    <span style="margin-left:8px; color:var(--muted);">${n?"Commercial":"Beginner"}</span>
                </div>
                <div style="flex:1"></div>
            </div>

            <div style="padding:16px; flex:1; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="font-size:0.7rem; font-weight:700; color:var(--sub);">SELECT FIELD (${t.length})</div>
                    <button id="buildFarmBtn" class="btn-outline" style="padding:6px 12px;">${n?"+ New Farm":"+ New Field"}</button>
                </div>

                <div id="farmList" style="display:flex; flex-direction:column; gap:10px;">
                    ${t.map(F).join("")}
                </div>
            </div>

            <div class="bottom-nav">
                <div class="nav-item active" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `,w(t)}function w(e){document.querySelectorAll(".farm-card").forEach(t=>{t.addEventListener("click",()=>{const n=e.find(a=>a.id===t.dataset.farmId);n&&v(n)})}),document.querySelectorAll(".farm-details-btn").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const a=e.find(o=>o.id===t.dataset.farmId);a&&$(a)})}),document.querySelectorAll(".farm-delete-btn").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const a=e.find(o=>o.id===t.dataset.farmId);a&&E(a,e)})}),document.getElementById("buildFarmBtn").onclick=()=>{m("buildfarm")},document.querySelectorAll(".bottom-nav .nav-item").forEach(t=>{t.onclick=()=>{t.dataset.screen==="profile"&&(r.profileFrom="farmlist",m("profile"))}})}function F(e){return`
        <div class="farm-card" data-farm-id="${p(e.id)}" style="background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:14px; display:flex; align-items:center; gap:12px; cursor:pointer;">
            <div style="width:44px; height:44px; background:var(--accent-l); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px;">🏗️</div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i(e.name)}</div>
                <div style="font-size:0.7rem; color:var(--muted);">${L(e)}</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
                <button class="farm-details-btn" data-farm-id="${p(e.id)}" title="Field details" aria-label="View field details"
                    style="width:32px;height:32px;border:1px solid var(--border);background:var(--surface2);color:var(--accent);border-radius:10px;font-size:15px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;">i</button>
                <button class="farm-delete-btn" data-farm-id="${p(e.id)}" title="Delete field" aria-label="Delete field"
                    style="width:32px;height:32px;border:1px solid rgba(220,38,38,.24);background:rgba(220,38,38,.08);color:var(--danger);border-radius:10px;font-size:15px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
            </div>
        </div>
    `}function $(e){const t=document.getElementById("modalContainer");t&&(t.innerHTML=`
        <div class="modal-overlay open" id="farmDetailsModal">
            <div class="modal-sheet">
                <div style="padding:18px;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px;">
                        <div>
                            <div style="font-size:11px;font-weight:800;color:var(--muted);letter-spacing:.08em;">FIELD DETAILS</div>
                            <div style="font-size:18px;font-weight:900;margin-top:2px;">${i(e.name)}</div>
                        </div>
                        <button id="closeFarmDetails" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text);">×</button>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
                        ${l("Created",A(e.createdAt))}
                        ${l("Location",e.location||e.zone||"Not set")}
                        ${l("Rack",e.rackLabel||e.rackType||e.rackTypeId||"3-tier")}
                        ${l("Plants",`${b(e)} plants`)}
                        ${l("Slots",`${x(e)} slots`)}
                        ${l("Goal",e.analysisGoal||"Not set")}
                    </div>

                    <div style="font-size:11px;font-weight:800;color:var(--muted);letter-spacing:.08em;margin-bottom:8px;">PLANT MAP</div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">${D(e)}</div>

                    <button id="detailsEnterFarm" class="btn-primary" style="width:100%;">Open Field</button>
                </div>
            </div>
        </div>
    `,document.getElementById("closeFarmDetails").onclick=d,document.getElementById("farmDetailsModal").addEventListener("click",n=>{n.target.id==="farmDetailsModal"&&d()}),document.getElementById("detailsEnterFarm").onclick=()=>{d(),v(e)})}function E(e,t){const n=document.getElementById("modalContainer");n&&(n.innerHTML=`
        <div class="modal-overlay open" id="deleteFarmModal">
            <div class="modal-sheet">
                <div style="padding:18px;">
                    <div style="font-size:18px;font-weight:900;margin-bottom:6px;">Delete field?</div>
                    <div style="font-size:13px;color:var(--sub);line-height:1.45;margin-bottom:14px;">${i(e.name)} will be removed from this device. This cannot be undone.</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <button id="cancelDeleteFarm" style="padding:13px;border:1px solid var(--border);border-radius:12px;background:var(--surface2);font-weight:800;cursor:pointer;color:var(--text);">Cancel</button>
                        <button id="confirmDeleteFarm" style="padding:13px;border:none;border-radius:12px;background:var(--danger);font-weight:800;cursor:pointer;color:#fff;">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `,document.getElementById("cancelDeleteFarm").onclick=d,document.getElementById("deleteFarmModal").addEventListener("click",a=>{a.target.id==="deleteFarmModal"&&d()}),document.getElementById("confirmDeleteFarm").onclick=()=>I(e.id,t))}async function I(e,t){var o,s;const n=t.filter(c=>c.id!==e);if(y(n),localStorage.getItem("token"))try{await fetch(`${u}/api/farms/${e}`,{method:"DELETE",headers:f()})}catch(c){console.warn("[FarmListPage] Backend delete request failed:",c.message)}r.currentFarmId===e&&(r.currentFarmId=((o=n[0])==null?void 0:o.id)||null,r.currentFarm=n[0]||null,r.farmName=((s=n[0])==null?void 0:s.name)||"My Farm"),d(),h("success","Field deleted"),k()}function v(e){r.currentFarmId=e.id,r.currentFarm=e,r.farmName=e.name,r.mode==="commercial"?(r.packageLevel=e.packageLevel||"farm_master",r.zoneIds=e.zoneIds||[1,2,3]):r.packageLevel=e.packageLevel||"pro",localStorage.setItem("seeddown_package",r.packageLevel),console.log(`[FarmListPage] Entering Farm ID: ${e.id}`);const t=r.mode==="beginner"?"home":"dash-c";m(t)}function y(e){localStorage.setItem(g,JSON.stringify(e))}function S(){try{return JSON.parse(localStorage.getItem(g))||[]}catch{return[]}}function d(){const e=document.getElementById("modalContainer");e&&(e.innerHTML="")}function L(e){const t=e.targetPlant?`${i(e.targetPlant)} · `:"",n=e.rackLabel||e.rackType||e.rackTypeId||"Rack";return`${t}${x(e)} slots · ${i(n)}`}function l(e,t){return`
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase;">${i(e)}</div>
            <div style="font-size:13px;font-weight:800;color:var(--text);margin-top:3px;word-break:break-word;">${i(t)}</div>
        </div>
    `}function D(e){const t=Array.isArray(e.plants)?e.plants:[];if(!t.length){const n=e.targetPlant||"Plant";return`<span style="padding:7px 10px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:12px;font-weight:800;">${i(n)}</span>`}return t.map(n=>{const a=n.tier&&n.position?` · T${n.tier} S${n.position}`:"";return`<span style="padding:7px 10px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:12px;font-weight:800;">${i(n.emoji||"🌱")} ${i(n.name||n.species||"Plant")}${a}</span>`}).join("")}function b(e){return Array.isArray(e.plants)?e.plants.length:Number.parseInt(e.plants,10)||Number.parseInt(e.plantSlots,10)||0}function x(e){return Number.parseInt(e.plantSlots,10)||b(e)}function A(e){if(!e)return"Not set";const t=new Date(e);return Number.isNaN(t.getTime())?String(e):t.toLocaleString([],{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function i(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function p(e){return i(e).replace(/`/g,"&#096;")}export{k as render};
