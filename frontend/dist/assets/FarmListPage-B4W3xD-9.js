import{A as o,s as m,a as p}from"./index-iCFplLzP.js";import{saveFarmsToFirestore as k}from"./firebase-BieXTIEc.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const g="user_farms",f="commercial_account",v="commercial_terms_accepted";function u(){console.log("[FarmListPage] render called");const e=document.getElementById("screenContainer");let t=L();t.length===0&&(t=[{id:`farm_${Date.now()}`,name:"Farm 1 - Rack Alpha",plants:6,plantSlots:6,zone:"A",location:"Zone A",targetPlant:"Lettuce",rackLabel:"3-Tier Vertical Rack",createdAt:new Date().toISOString()}],x(t));const r=b()==="commercial";o.mode=r?"commercial":"beginner",e.innerHTML=`
        <div class="screen active" id="farmlistScreen">
            <div class="topbar">
                <div class="topbar-brand">
                    <span style="font-size:24px;">🌿</span>
                    <span style="font-weight:700;">SeedDown</span>
                    <span style="margin-left:8px; color:var(--muted);">Farms</span>
                </div>
                <div style="flex:1"></div>
                <div id="switchModeBtn" style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <span style="font-size:0.72rem; font-weight:700; color:${r?"var(--muted)":"var(--accent)"};">🌱</span>
                    <div style="position:relative; width:48px; height:26px; background:${r?"var(--accent)":"var(--border)"}; border-radius:100px; transition:background 0.25s;">
                        <div style="position:absolute; top:3px; left:${r?"25px":"3px"}; width:20px; height:20px; border-radius:50%; background:white; box-shadow:0 1px 4px rgba(0,0,0,0.25); transition:left 0.25s;"></div>
                    </div>
                    <span style="font-size:0.72rem; font-weight:700; color:${r?"var(--accent)":"var(--muted)"};">🏭</span>
                </div>
            </div>

            <div style="padding:16px; flex:1; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="font-size:0.7rem; font-weight:700; color:var(--sub);">SELECT FIELD (${t.length})</div>
                    <button id="buildFarmBtn" class="btn-outline" style="padding:6px 12px;">${r?"+ New Farm":"+ New Field"}</button>
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
    `,E(t)}function E(e){document.querySelectorAll(".farm-card").forEach(t=>{t.addEventListener("click",()=>{const r=e.find(a=>a.id===t.dataset.farmId);r&&y(r)})}),document.querySelectorAll(".farm-details-btn").forEach(t=>{t.addEventListener("click",r=>{r.stopPropagation();const a=e.find(n=>n.id===t.dataset.farmId);a&&$(a)})}),document.querySelectorAll(".farm-delete-btn").forEach(t=>{t.addEventListener("click",r=>{r.stopPropagation();const a=e.find(n=>n.id===t.dataset.farmId);a&&A(a,e)})}),document.getElementById("buildFarmBtn").onclick=()=>{const t=b();o.mode=t,localStorage.setItem("seeddown_mode",t),localStorage.setItem("seeddown_build_flow",t),m("buildfarm")},document.getElementById("switchModeBtn").onclick=()=>{if(o.mode==="beginner"){I();return}o.mode="beginner",localStorage.setItem("seeddown_mode","beginner"),o.isGuest=!0,p("info","Switched to 🌱 Beginner mode"),u()},document.querySelectorAll(".bottom-nav .nav-item").forEach(t=>{t.onclick=()=>{t.dataset.screen==="profile"&&(o.profileFrom="farmlist",m("profile"))}})}function b(){try{return localStorage.getItem("seeddown_mode")==="commercial"?"commercial":"beginner"}catch{return o.mode==="commercial"?"commercial":"beginner"}}function I(){const e=document.getElementById("modalContainer");if(!e)return;const t=C(),r=!!(t!=null&&t.password);e.innerHTML=`
        <div class="modal-overlay open" id="commercialGateModal">
            <div class="modal-sheet">
                <div style="padding:18px;">
                    <div style="font-size:11px;font-weight:800;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px;">Commercial Access</div>
                    <div style="font-size:18px;font-weight:900;margin-bottom:6px;">Switch to Commercial mode</div>
                    <div style="font-size:13px;color:var(--sub);line-height:1.45;margin-bottom:14px;">
                        ${r?"Enter the same password/key used during Commercial Register.":"Create a commercial password/key for this device before entering Commercial mode."}
                    </div>

                    <label style="display:block;font-size:0.7rem;font-weight:800;margin-bottom:6px;">Password / Access Key</label>
                    <input id="commercialGatePassword" type="password" placeholder="Minimum 6 characters" style="width:100%;box-sizing:border-box;padding:12px;border-radius:12px;border:1px solid var(--border);margin-bottom:12px;">

                    <label style="display:flex;gap:10px;align-items:flex-start;font-size:0.76rem;color:var(--muted);line-height:1.4;margin-bottom:12px;">
                        <input id="commercialGateTerms" type="checkbox" style="margin-top:2px;">
                        <span>I agree to the Commercial Terms & Conditions and understand this mode can affect automation controls.</span>
                    </label>

                    <div id="commercialGateError" style="display:none;color:var(--danger);font-size:0.76rem;margin-bottom:12px;"></div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <button id="cancelCommercialGate" style="padding:13px;border:1px solid var(--border);border-radius:12px;background:var(--surface2);font-weight:800;cursor:pointer;color:var(--text);">Cancel</button>
                        <button id="confirmCommercialGate" class="btn-primary" style="padding:13px;">Enter</button>
                    </div>
                </div>
            </div>
        </div>
    `;const a=n=>{const l=document.getElementById("commercialGateError");l.textContent=n,l.style.display=n?"block":"none"};document.getElementById("cancelCommercialGate").onclick=d,document.getElementById("commercialGateModal").addEventListener("click",n=>{n.target.id==="commercialGateModal"&&d()}),document.getElementById("confirmCommercialGate").onclick=()=>{const n=document.getElementById("commercialGatePassword").value,l=document.getElementById("commercialGateTerms").checked;if(n.length<6){a("Password/key must be at least 6 characters.");return}if(!l){a("Please tick the Commercial Terms & Conditions first.");return}if(r&&n!==t.password){a("Wrong commercial password/key. Use the same one from Commercial Register.");return}r?localStorage.setItem(v,"true"):S({email:o.userEmail||"commercial@seeddown.local",password:n,createdAt:new Date().toISOString()}),o.mode="commercial",localStorage.setItem("seeddown_mode","commercial"),o.isGuest=!1,d(),p("success","Switched to 🏭 Commercial mode"),u()}}function C(){try{return JSON.parse(localStorage.getItem(f))||null}catch{return null}}function S(e){localStorage.setItem(f,JSON.stringify(e)),localStorage.setItem(v,"true")}function F(e){return`
        <div class="farm-card" data-farm-id="${c(e.id)}" style="background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:14px; display:flex; align-items:center; gap:12px; cursor:pointer;">
            <div style="width:44px; height:44px; background:var(--accent-l); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px;">🏗️</div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${i(e.name)}</div>
                <div style="font-size:0.7rem; color:var(--muted);">${z(e)}</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
                <button class="farm-details-btn" data-farm-id="${c(e.id)}" title="Field details" aria-label="View field details"
                    style="width:32px;height:32px;border:1px solid var(--border);background:var(--surface2);color:var(--accent);border-radius:10px;font-size:15px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center;">i</button>
                <button class="farm-delete-btn" data-farm-id="${c(e.id)}" title="Delete field" aria-label="Delete field"
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
                        ${s("Created",T(e.createdAt))}
                        ${s("Location",e.location||e.zone||"Not set")}
                        ${s("Rack",e.rackLabel||e.rackType||e.rackTypeId||"3-tier")}
                        ${s("Plants",`${h(e)} plants`)}
                        ${s("Slots",`${w(e)} slots`)}
                        ${s("Goal",e.analysisGoal||"Not set")}
                    </div>

                    <div style="font-size:11px;font-weight:800;color:var(--muted);letter-spacing:.08em;margin-bottom:8px;">PLANT MAP</div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;">${B(e)}</div>

                    <button id="detailsEnterFarm" class="btn-primary" style="width:100%;">Open Field</button>
                </div>
            </div>
        </div>
    `,document.getElementById("closeFarmDetails").onclick=d,document.getElementById("farmDetailsModal").addEventListener("click",r=>{r.target.id==="farmDetailsModal"&&d()}),document.getElementById("detailsEnterFarm").onclick=()=>{d(),y(e)})}function A(e,t){const r=document.getElementById("modalContainer");r&&(r.innerHTML=`
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
    `,document.getElementById("cancelDeleteFarm").onclick=d,document.getElementById("deleteFarmModal").addEventListener("click",a=>{a.target.id==="deleteFarmModal"&&d()}),document.getElementById("confirmDeleteFarm").onclick=()=>M(e.id,t))}function M(e,t){var a,n;const r=t.filter(l=>l.id!==e);x(r),o.currentFarmId===e&&(o.currentFarmId=((a=r[0])==null?void 0:a.id)||null,o.currentFarm=r[0]||null,o.farmName=((n=r[0])==null?void 0:n.name)||"My Farm"),d(),p("success","Field deleted"),u()}function y(e){o.currentFarmId=e.id,o.currentFarm=e,o.farmName=e.name,console.log(`[FarmListPage] Entering Farm ID: ${e.id}`);const t=o.mode==="beginner"?"home":"dash-c";m(t)}function x(e){localStorage.setItem(g,JSON.stringify(e)),o.uid&&k(o.uid,e)}function L(){try{return JSON.parse(localStorage.getItem(g))||[]}catch{return[]}}function d(){const e=document.getElementById("modalContainer");e&&(e.innerHTML="")}function z(e){const t=e.targetPlant?`${i(e.targetPlant)} · `:"",r=e.rackLabel||e.rackType||e.rackTypeId||"Rack";return`${t}${w(e)} slots · ${i(r)}`}function s(e,t){return`
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:10px;font-weight:800;color:var(--muted);text-transform:uppercase;">${i(e)}</div>
            <div style="font-size:13px;font-weight:800;color:var(--text);margin-top:3px;word-break:break-word;">${i(t)}</div>
        </div>
    `}function B(e){const t=Array.isArray(e.plants)?e.plants:[];if(!t.length){const r=e.targetPlant||"Plant";return`<span style="padding:7px 10px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:12px;font-weight:800;">${i(r)}</span>`}return t.map(r=>{const a=r.tier&&r.position?` · T${r.tier} S${r.position}`:"";return`<span style="padding:7px 10px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:12px;font-weight:800;">${i(r.emoji||"🌱")} ${i(r.name||r.species||"Plant")}${a}</span>`}).join("")}function h(e){return Array.isArray(e.plants)?e.plants.length:Number.parseInt(e.plants,10)||Number.parseInt(e.plantSlots,10)||0}function w(e){return Number.parseInt(e.plantSlots,10)||h(e)}function T(e){if(!e)return"Not set";const t=new Date(e);return Number.isNaN(t.getTime())?String(e):t.toLocaleString([],{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function i(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function c(e){return i(e).replace(/`/g,"&#096;")}export{u as render};
