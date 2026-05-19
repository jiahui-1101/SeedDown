const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/CommercialFarmCanvas-O4pnxs2O.js","assets/index-B0Gd1vZv.js","assets/index-7FoRf0sk.css"])))=>i.map(i=>d[i]);
import{a as b,A as m,_ as q,F as M}from"./index-B0Gd1vZv.js";const R="user_farms",U=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,g={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},w=[{emoji:"🥬",name:"Lettuce",species:"lettuce",days:45,price:"RM 1.20"},{emoji:"🌿",name:"Spinach",species:"spinach",days:40,price:"RM 0.90"},{emoji:"🌱",name:"Basil",species:"basil",days:30,price:"RM 2.50"},{emoji:"🍅",name:"Tomato",species:"tomato",days:70,price:"RM 3.00"},{emoji:"🥒",name:"Cucumber",species:"cucumber",days:55,price:"RM 2.10"},{emoji:"🥕",name:"Carrot",species:"carrot",days:75,price:"RM 1.50"},{emoji:"🥬",name:"Cabbage",species:"cabbage",days:90,price:"RM 1.80"},{emoji:"🍆",name:"Eggplant",species:"eggplant",days:80,price:"RM 2.20"}];let u=null,c=null,$=null,P=[],T=!1;function re(){const e=document.getElementById("modalContainer");if(!e)return;const t=V(),o=Y(t),r=W(t,o),n=y();oe(),$=o,P=r,e.innerHTML=`
    <div class="modal-overlay ${n?"commercial-plant-overlay":""}" id="addPlantModalOverlay">
      <div class="modal-sheet ${n?"commercial-plant-sheet":""}">
        <div style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <div style="font-size:${n?"10px":"13px"};font-weight:900;letter-spacing:${n?".16em":"0"};text-transform:${n?"uppercase":"none"};color:${n?"#047857":"var(--text,#111)"};">${n?"Production Slot Manager":"🌱 Manage Plants"}</div>
              ${n?'<div style="font-size:11px;color:#64748b;font-weight:700;margin-top:3px;">Assign crop species to rack zones and production slots</div>':""}
            </div>
            <button id="closeAddPlantModal" class="${n?"commercial-plant-close":""}" style="background:none;border:none;font-size:20px;cursor:pointer;" aria-label="Close plant manager">✕</button>
          </div>

          <div style="margin-bottom:12px;">
            <div style="font-size:0.7rem;color:${n?"#64748b":"var(--text-secondary,#666)"};margin-bottom:6px;font-weight:800;letter-spacing:.08em;">SEARCH OR ADD CUSTOM SPECIES</div>
            <div style="display:flex;gap:8px;">
              <input id="speciesSearchInput" type="text" placeholder="e.g. kale, mint, cucumber..."
                style="flex:1;padding:10px 12px;border:1px solid ${n?"#dbe7dc":"var(--border-color,#ddd)"};border-radius:10px;font-size:13px;background:${n?"#f8fafc":"var(--bg-secondary,#f5f5f5)"};color:${n?"#17231b":"inherit"};">
              <button id="speciesSearchBtn" class="${n?"commercial-plant-action":""}" style="background:var(--accent,#639922);color:white;border:none;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:900;cursor:pointer;">
                ${n?"ADD":"🔍 Add"}
              </button>
            </div>
            <div id="speciesSearchStatus" style="font-size:11px;color:${n?"#64748b":"var(--text-secondary,#666)"};margin-top:4px;min-height:16px;"></div>
          </div>

          <div style="font-size:0.7rem;color:${n?"#64748b":"var(--text-secondary,#666)"};margin-bottom:6px;font-weight:800;letter-spacing:.08em;">${n?"SPECIES CATALOG":"SELECT CROP"}</div>
          <div id="cropGrid" class="${n?"commercial-crop-grid":""}" style="display:grid;grid-template-columns:repeat(${n?2:4},1fr);gap:8px;margin-bottom:16px;max-height:${n?"220px":"200px"};overflow-y:auto;"></div>

          <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:6px;gap:8px;">
            <div>
              <div style="font-size:0.7rem;color:${n?"#64748b":"var(--text-secondary,#666)"};font-weight:800;letter-spacing:.08em;">${n?"ZONE / SLOT ASSIGNMENT":"SELECT POSITION"}</div>
              <div style="font-size:11px;color:${n?"#94a3b8":"var(--text-secondary,#666)"};">${o.label} · select a slot to add, change, or remove</div>
            </div>
            <div id="positionStatus" style="font-size:11px;color:${n?"#047857":"var(--accent,#639922)"};font-weight:800;"></div>
          </div>
          <div id="slotGrid" class="${n?"commercial-slot-grid":""}" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;"></div>
          <div id="slotActionPanel" class="${n?"commercial-slot-panel":""}" style="border:1px solid ${n?"#e5e7eb":"var(--border-color,#e7e7e7)"};border-radius:12px;padding:10px;margin-bottom:12px;background:${n?"#f8fafc":"var(--bg-secondary,#f7f7f7)"};font-size:12px;color:${n?"#475569":"var(--text-secondary,#666)"};"></div>

          <div style="display:grid;grid-template-columns:0.9fr 1.1fr;gap:8px;">
            <button id="removePlantBtn" class="${n?"commercial-remove-btn":""}" style="width:100%;border:1px solid #efb2b2;background:#fff5f5;color:#c83a3a;border-radius:10px;padding:11px 8px;font-weight:800;cursor:pointer;">${n?"CLEAR SLOT":"Remove"}</button>
            <button id="confirmPlantBtn" class="btn-primary ${n?"commercial-confirm-btn":""}" style="width:100%;">${n?"ASSIGN CROP":"Plant Now →"}</button>
          </div>
        </div>
      </div>
    </div>`;const i=document.getElementById("addPlantModalOverlay");i.classList.add("open"),_(w),G(o,r),A(o,r),B(o,r),document.getElementById("closeAddPlantModal").addEventListener("click",S),i.addEventListener("click",a=>{a.target===i&&S()}),document.getElementById("speciesSearchBtn").addEventListener("click",j),document.getElementById("speciesSearchInput").addEventListener("keypress",a=>{a.key==="Enter"&&j()}),document.getElementById("removePlantBtn").addEventListener("click",()=>{if(c===null){b("warning","Select a planted slot first");return}const a=r[c];if(!a){b("warning","That slot is already empty");return}Z(c,o),b("success",`${a.emoji} ${a.name} removed from ${v(c,o)}`),S(),z()}),document.getElementById("confirmPlantBtn").addEventListener("click",()=>{if(!u){b("warning","Select a crop first");return}if(c===null){b("warning","Select a rack position");return}const a=r[c];J(u),K(u,c,o);const s=a?"changed to":"planted at";b("success",`${u.emoji} ${u.name} ${s} ${v(c,o)}`),S(),z()})}async function j(){var n;if(T)return;const e=document.getElementById("speciesSearchInput"),t=document.getElementById("speciesSearchStatus"),o=e.value.trim().toLowerCase();if(!o){b("warning","Enter a species name");return}const r=w.find(i=>i.species===o||i.name.toLowerCase()===o);if(r){k(r),t.textContent=`✅ ${r.name} is already in your crop list — selected!`,e.value="";return}T=!0,t.textContent="🤖 Looking up species data...",document.getElementById("speciesSearchBtn").textContent="...";try{const a=await(await fetch(`${U}/api/crops/species/${encodeURIComponent(o)}`)).json();if(a.error)throw new Error(a.error);const s={emoji:a.crop.emoji||E(o),name:a.crop.commonName||H(o),species:a.crop.species||C(o),days:((n=a.crop.requirements)==null?void 0:n.growthDays)||30,price:"Custom"};N(s),t.textContent=a.crop.aiGenerated?`✨ AI estimated data for "${s.name}" and saved to database!`:`✅ Found "${s.name}" in database — selected!`,e.value=""}catch(i){const a=ee(o);N(a),t.textContent=`✅ Added "${a.name}" locally — choose position and Plant Now`,e.value="",console.warn("Species search fallback:",i.message)}finally{T=!1,document.getElementById("speciesSearchBtn").textContent=y()?"ADD":"🔍 Add"}}function N(e){w.find(t=>t.species===e.species)||(w.push(e),_(w)),k(e)}function K(e,t,o){var x;const r=Math.floor(t/o.slotsPerTier)+1,n=t%o.slotsPerTier+1,i={name:e.name,emoji:e.emoji,species:e.species,slots:1,slotIndex:t,tier:r,position:n,status:"healthy",source:"manual"},a=F(),s=m.currentFarmId||((x=m.currentFarm)==null?void 0:x.id),d=a.findIndex(h=>h.id===s),p=d>=0?a[d]:m.currentFarm;if(!p)return;const l=L(p,o).filter(h=>Number(h.slotIndex)!==t);l.push(i),l.sort((h,D)=>Number(h.slotIndex??9999)-Number(D.slotIndex??9999)),O(p,l,d,a,e.name)}function Z(e,t){var s,d;const o=F(),r=m.currentFarmId||((s=m.currentFarm)==null?void 0:s.id),n=o.findIndex(p=>p.id===r),i=n>=0?o[n]:m.currentFarm;if(!i)return;const a=L(i,t).filter(p=>Number(p.slotIndex)!==e).sort((p,l)=>Number(p.slotIndex??9999)-Number(l.slotIndex??9999));O(i,a,n,o,((d=a[0])==null?void 0:d.name)||i.targetPlant||"Plant")}function O(e,t,o,r,n){var a;const i={...e,plants:t,plantSlots:t.length,targetPlant:((a=t[0])==null?void 0:a.name)||n};o>=0&&(r[o]=i,localStorage.setItem(R,JSON.stringify(r))),m.currentFarm=i,m.currentFarmId=i.id||m.currentFarmId}function _(e){const t=document.getElementById("cropGrid");if(!t)return;const o=y();t.innerHTML=e.map(r=>o?`
    <div class="crop-option commercial-crop-option" data-species="${r.species}">
      <div class="commercial-crop-code">${te(r.name)}</div>
      <div style="min-width:0;">
        <div class="commercial-crop-name">${f(r.name)}</div>
        <div class="commercial-crop-meta">${f(r.species)} · ${r.days}d cycle</div>
      </div>
    </div>`:`
    <div class="crop-option" data-species="${r.species}"
      style="background:var(--surface,#fff);border-radius:12px;padding:8px;text-align:center;cursor:pointer;border:2px solid transparent;transition:border .15s;">
      <div style="font-size:28px;">${r.emoji}</div>
      <div style="font-weight:600;font-size:11px;">${r.name}</div>
      <div style="font-size:10px;color:#999;">${r.days}d</div>
    </div>`).join(""),document.querySelectorAll(".crop-option").forEach(r=>{r.addEventListener("click",()=>{const n=e.find(i=>i.species===r.dataset.species);n&&k(n)})})}function G(e,t){const o=document.getElementById("slotGrid");if(!o)return;const r=y();o.innerHTML=Array.from({length:e.tiers},(n,i)=>{const a=Array.from({length:e.slotsPerTier},(s,d)=>{const p=i*e.slotsPerTier+d,l=t[p],x=c===p;return r?`
          <button class="slot-option commercial-slot-option ${x?"selected":""} ${l?"filled":"empty"}" data-slot-index="${p}"
            aria-label="${l?`Change or remove ${f(l.name)}`:`Plant slot ${d+1}`}">
            <span class="commercial-slot-id">S${String(d+1).padStart(2,"0")}</span>
            <span class="commercial-slot-name">${l?f(l.name):"Available"}</span>
            <span class="commercial-slot-state">${l?f(l.status||"healthy"):"empty"}</span>
          </button>`:`
        <button class="slot-option" data-slot-index="${p}"
          aria-label="${l?`Change or remove ${f(l.name)}`:`Plant slot ${d+1}`}"
          style="min-height:54px;border-radius:12px;border:2px solid ${x?"var(--accent,#639922)":"var(--border-color,#ddd)"};background:${x?"var(--accent-l,#eef8e7)":"var(--surface,#fff)"};cursor:pointer;padding:6px;text-align:center;">
          <div style="font-size:20px;line-height:1;">${(l==null?void 0:l.emoji)||"◻️"}</div>
          <div style="font-size:10px;font-weight:800;margin-top:4px;color:${l?"var(--text,#111)":"var(--text-secondary,#666)"};">${l?f(l.name):`Slot ${d+1}`}</div>
        </button>`}).join("");return`
      <div>
        <div style="font-size:11px;font-weight:800;color:${r?"#64748b":"var(--text-secondary,#666)"};margin-bottom:5px;">${r?`Zone ${String.fromCharCode(65+i)} · Tier ${i+1}`:`Tier ${i+1}`}</div>
        <div style="display:grid;grid-template-columns:repeat(${e.slotsPerTier},minmax(44px,1fr));gap:6px;">${a}</div>
      </div>`}).join(""),o.querySelectorAll(".slot-option").forEach(n=>{n.addEventListener("click",()=>{c=Number(n.dataset.slotIndex);const i=t[c];document.getElementById("positionStatus").textContent=i?`${v(c,e)} · ${i.name}`:v(c,e),G(e,t),A(e,t),B(e,t)})})}function A(e,t){const o=document.getElementById("slotActionPanel");if(!o)return;if(c===null){o.innerHTML="Choose a slot first. Empty slots can be planted; occupied slots can be changed or removed.";return}const r=t[c],n=u?`${u.emoji} ${u.name}`:"a crop";if(r){o.innerHTML=`
      <div style="font-weight:800;color:var(--text,#111);margin-bottom:4px;">${v(c,e)}</div>
      <div>Current: <strong>${r.emoji} ${f(r.name)}</strong></div>
      <div style="margin-top:3px;">Select ${f(n)} and press Change, or remove this plant.</div>`;return}o.innerHTML=`
    <div style="font-weight:800;color:var(--text,#111);margin-bottom:4px;">${v(c,e)}</div>
    <div>Empty slot. Select ${f(n)} and press Plant Now.</div>`}function B(e,t){const o=document.getElementById("confirmPlantBtn"),r=document.getElementById("removePlantBtn");if(!o||!r)return;const n=c===null?null:t[c],i=y();o.textContent=n?i?"UPDATE SLOT":"Change Plant →":i?"ASSIGN CROP":"Plant Now →",o.disabled=c===null||!u,o.style.opacity=o.disabled?"0.55":"1",o.style.cursor=o.disabled?"not-allowed":"pointer",r.disabled=!n,r.style.opacity=n?"1":"0.45",r.style.cursor=n?"pointer":"not-allowed"}function k(e){u=e;const t=y();document.querySelectorAll(".crop-option").forEach(o=>{t?o.classList.toggle("selected",o.dataset.species===e.species):o.style.border=o.dataset.species===e.species?"2px solid var(--accent,#639922)":"2px solid transparent"}),$&&(A($,P),B($,P))}function J(e){const t=m.tiles.find(o=>o.status==="empty"||!o.plant);t&&(t.plant=e.emoji,t.name=e.name,t.status="healthy",t.growth=0,t.days=e.days,t.species=e.species)}function z(){if(m.notify(),document.getElementById("commercialFarmCanvas")){q(async()=>{const{CommercialFarmCanvas:e}=await import("./CommercialFarmCanvas-O4pnxs2O.js");return{CommercialFarmCanvas:e}},__vite__mapDeps([0,1,2])).then(({CommercialFarmCanvas:e})=>e.init("commercialFarmCanvas")).catch(()=>M.init("commercialFarmCanvas"));return}document.getElementById("farmCanvas")&&M.init("farmCanvas")}function V(){const e=F();return m.currentFarm||e.find(t=>t.id===m.currentFarmId)||m.newFarm||e[e.length-1]||null}function Y(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?g["2-tier"]:t.includes("4")?g["4-tier"]:t.includes("5")?g["5-tier"]:t.includes("wall")||t.includes("grid")?g.wall:t.includes("frame")?g["a-frame"]:t.includes("nft")||t.includes("channel")?g["nft-channel"]:t.includes("hanging")||t.includes("column")?g.hanging:g["3-tier"]}function W(e,t){const o=Array(t.total).fill(null);return L(e,t).forEach(r=>{const n=Number(r.slotIndex);Number.isInteger(n)&&n>=0&&n<t.total&&(o[n]=r)}),o}function L(e,t){const o=Array.isArray(e==null?void 0:e.plants)?e.plants:X(e,t),r=[],n=new Set;return o.forEach(i=>{if(i.slotIndex!==void 0&&i.slotIndex!==null){const s=Number(i.slotIndex);Number.isInteger(s)&&s>=0&&s<t.total&&!n.has(s)&&(r.push(I(i,s,t)),n.add(s));return}const a=Math.max(1,Number.parseInt(i.slots||i.count||1,10)||1);for(let s=0;s<a;s++){const d=Q(n,t.total);if(d===-1)return;r.push(I(i,d,t)),n.add(d)}}),r}function I(e,t,o){return{name:e.name||"Plant",emoji:e.emoji||E(e.name||e.species),species:e.species||C(e.name),slots:1,slotIndex:t,tier:Math.floor(t/o.slotsPerTier)+1,position:t%o.slotsPerTier+1,status:e.status||"healthy",source:e.source||"existing"}}function Q(e,t){for(let o=0;o<t;o++)if(!e.has(o))return o;return-1}function X(e,t){const o=Math.max(0,Math.min(t.total,Number.parseInt((e==null?void 0:e.plantSlots)||(e==null?void 0:e.plants)||0,10)||0)),r=(e==null?void 0:e.targetPlant)||"Plant";return Array.from({length:o},(n,i)=>I({name:r,emoji:E(r),species:C(r),status:"healthy"},i,t))}function F(){try{return JSON.parse(localStorage.getItem(R))||[]}catch{return[]}}function ee(e){return{emoji:E(e),name:H(e),species:C(e),days:30,price:"Custom"}}function y(){return m.mode==="commercial"||!!document.getElementById("commercialFarmCanvas")}function te(e=""){const t=String(e||"Plant").trim().replace(/[^a-zA-Z0-9 ]/g,""),o=t.split(/\s+/).filter(Boolean);return(o.length>1?o.map(n=>n[0]).join(""):t.slice(0,3)).toUpperCase()||"PL"}function oe(){if(document.getElementById("commercial-plant-modal-style"))return;const e=document.createElement("style");e.id="commercial-plant-modal-style",e.textContent=`
    .commercial-plant-overlay {
      background: rgba(15, 23, 42, .22) !important;
      backdrop-filter: blur(10px);
    }
    .commercial-plant-sheet {
      background: rgba(255,255,255,.97) !important;
      color: #17231b !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 26px !important;
      box-shadow: 0 24px 70px rgba(15,23,42,.18) !important;
      backdrop-filter: blur(18px) !important;
    }
    .commercial-plant-sheet input::placeholder { color: #94a3b8 !important; }
    .commercial-plant-close {
      color: #64748b !important;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1px solid #e5e7eb !important;
      background: #f8fafc !important;
    }
    .commercial-plant-close:hover { background: #ecfdf5 !important; color: #047857 !important; }
    .commercial-plant-action,
    .commercial-confirm-btn {
      background: #166534 !important;
      border: 1px solid #166534 !important;
      color: #ffffff !important;
      border-radius: 12px !important;
      letter-spacing: .08em;
      box-shadow: 0 10px 26px rgba(22,101,52,.16) !important;
    }
    .commercial-remove-btn {
      background: #fef2f2 !important;
      border-color: #fecaca !important;
      color: #dc2626 !important;
      border-radius: 12px !important;
      letter-spacing: .06em;
    }
    .commercial-crop-grid::-webkit-scrollbar,
    .commercial-slot-grid::-webkit-scrollbar { width: 5px; }
    .commercial-crop-grid::-webkit-scrollbar-thumb,
    .commercial-slot-grid::-webkit-scrollbar-thumb { background: #bbf7d0; border-radius: 999px; }
    .commercial-crop-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      cursor: pointer;
      min-width: 0;
      transition: border .18s, background .18s, transform .18s, box-shadow .18s;
    }
    .commercial-crop-option:hover,
    .commercial-crop-option.selected {
      border-color: #86efac;
      background: #ecfdf5;
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(22,101,52,.08);
    }
    .commercial-crop-code {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: #dcfce7;
      color: #047857;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 950;
      letter-spacing: .06em;
      flex-shrink: 0;
    }
    .commercial-crop-name {
      color: #17231b;
      font-size: 12px;
      font-weight: 950;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .commercial-crop-meta {
      margin-top: 3px;
      color: #64748b;
      font-size: 10px;
      font-weight: 750;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .commercial-slot-option {
      min-height: 52px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
      color: #475569;
      cursor: pointer;
      padding: 8px;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 2px;
      transition: border .18s, background .18s, box-shadow .18s;
    }
    .commercial-slot-option.filled { border-color: #bbf7d0; background: #f0fdf4; }
    .commercial-slot-option:hover { border-color: #86efac; }
    .commercial-slot-option.selected {
      border-color: #0ea5e9;
      background: #eff6ff;
      box-shadow: 0 8px 20px rgba(14,165,233,.12);
    }
    .commercial-slot-id {
      color: #047857;
      font-size: 9px;
      font-weight: 950;
      letter-spacing: .08em;
    }
    .commercial-slot-name {
      color: #17231b;
      font-size: 10px;
      font-weight: 950;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .commercial-slot-state {
      color: #64748b;
      font-size: 8px;
      font-weight: 950;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .commercial-slot-panel { color: #475569 !important; }
    .commercial-slot-panel strong,
    .commercial-slot-panel b { color: #17231b !important; }
  `,document.head.appendChild(e)}function v(e,t){return`Tier ${Math.floor(e/t.slotsPerTier)+1} · Slot ${e%t.slotsPerTier+1}`}function H(e){const t=String(e||"Plant").trim();return t.charAt(0).toUpperCase()+t.slice(1)}function C(e){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function E(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("cabbage")||t.includes("kale")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("strawberry")?"🍓":t.includes("cucumber")?"🥒":t.includes("carrot")?"🥕":t.includes("eggplant")||t.includes("aubergine")||t.includes("brinjal")?"🍆":t.includes("basil")||t.includes("mint")||t.includes("spinach")||t.includes("cilantro")||t.includes("parsley")?"🌿":"🌱"}function f(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function S(){u=null,c=null,$=null,P=[];const e=document.getElementById("addPlantModalOverlay");e&&e.remove()}export{re as o};
