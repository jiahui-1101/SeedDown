const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/CommercialFarmCanvas-CRjbCp7r.js","assets/index-CIzUcNGo.js","assets/index-7FoRf0sk.css"])))=>i.map(i=>d[i]);
import{a as b,A as m,_ as q,F as M}from"./index-CIzUcNGo.js";const R="user_farms",U=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,f={"2-tier":{id:"2-tier",label:"2-Tier Starter Rack",tiers:2,slotsPerTier:3,total:6},"3-tier":{id:"3-tier",label:"3-Tier Vertical Rack",tiers:3,slotsPerTier:3,total:9},"4-tier":{id:"4-tier",label:"4-Tier Grow Shelf",tiers:4,slotsPerTier:4,total:16},"5-tier":{id:"5-tier",label:"5-Tier Tower Rack",tiers:5,slotsPerTier:4,total:20},wall:{id:"wall",label:"Wall Panel Grid",tiers:4,slotsPerTier:5,total:20},"a-frame":{id:"a-frame",label:"A-Frame Pyramid",tiers:4,slotsPerTier:4,total:16},"nft-channel":{id:"nft-channel",label:"NFT Channel Rows",tiers:3,slotsPerTier:6,total:18},hanging:{id:"hanging",label:"Hanging Column Farm",tiers:5,slotsPerTier:3,total:15}},h=[{emoji:"🥬",name:"Lettuce",species:"lettuce",days:45,price:"RM 1.20"},{emoji:"🌿",name:"Spinach",species:"spinach",days:40,price:"RM 0.90"},{emoji:"🌱",name:"Basil",species:"basil",days:30,price:"RM 2.50"},{emoji:"🍅",name:"Tomato",species:"tomato",days:70,price:"RM 3.00"},{emoji:"🥒",name:"Cucumber",species:"cucumber",days:55,price:"RM 2.10"},{emoji:"🥕",name:"Carrot",species:"carrot",days:75,price:"RM 1.50"},{emoji:"🥬",name:"Cabbage",species:"cabbage",days:90,price:"RM 1.80"},{emoji:"🍆",name:"Eggplant",species:"eggplant",days:80,price:"RM 2.20"}];let u=null,c=null,$=null,P=[],T=!1;function oe(){const e=document.getElementById("modalContainer");if(!e)return;const t=V(),r=Y(t),o=W(t,r),n=w();re(),$=r,P=o,e.innerHTML=`
    <div class="modal-overlay ${n?"commercial-plant-overlay":""}" id="addPlantModalOverlay">
      <div class="modal-sheet ${n?"commercial-plant-sheet":""}">
        <div style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <div style="font-size:${n?"10px":"13px"};font-weight:900;letter-spacing:${n?".16em":"0"};text-transform:${n?"uppercase":"none"};color:${n?"#a3e635":"var(--text,#111)"};">${n?"Production Slot Manager":"🌱 Manage Plants"}</div>
              ${n?'<div style="font-size:11px;color:rgba(255,255,255,.42);font-weight:700;margin-top:3px;">Assign crop species to rack zones and production slots</div>':""}
            </div>
            <button id="closeAddPlantModal" class="${n?"commercial-plant-close":""}" style="background:none;border:none;font-size:20px;cursor:pointer;" aria-label="Close plant manager">✕</button>
          </div>

          <div style="margin-bottom:12px;">
            <div style="font-size:0.7rem;color:${n?"rgba(255,255,255,.42)":"var(--text-secondary,#666)"};margin-bottom:6px;font-weight:800;letter-spacing:.08em;">SEARCH OR ADD CUSTOM SPECIES</div>
            <div style="display:flex;gap:8px;">
              <input id="speciesSearchInput" type="text" placeholder="e.g. kale, mint, cucumber..."
                style="flex:1;padding:10px 12px;border:1px solid ${n?"rgba(163,230,53,.18)":"var(--border-color,#ddd)"};border-radius:10px;font-size:13px;background:${n?"rgba(255,255,255,.045)":"var(--bg-secondary,#f5f5f5)"};color:${n?"#fff":"inherit"};">
              <button id="speciesSearchBtn" class="${n?"commercial-plant-action":""}" style="background:var(--accent,#639922);color:white;border:none;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:900;cursor:pointer;">
                ${n?"ADD":"🔍 Add"}
              </button>
            </div>
            <div id="speciesSearchStatus" style="font-size:11px;color:${n?"rgba(255,255,255,.42)":"var(--text-secondary,#666)"};margin-top:4px;min-height:16px;"></div>
          </div>

          <div style="font-size:0.7rem;color:${n?"rgba(255,255,255,.42)":"var(--text-secondary,#666)"};margin-bottom:6px;font-weight:800;letter-spacing:.08em;">${n?"SPECIES CATALOG":"SELECT CROP"}</div>
          <div id="cropGrid" class="${n?"commercial-crop-grid":""}" style="display:grid;grid-template-columns:repeat(${n?2:4},1fr);gap:8px;margin-bottom:16px;max-height:${n?"220px":"200px"};overflow-y:auto;"></div>

          <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:6px;gap:8px;">
            <div>
              <div style="font-size:0.7rem;color:${n?"rgba(255,255,255,.42)":"var(--text-secondary,#666)"};font-weight:800;letter-spacing:.08em;">${n?"ZONE / SLOT ASSIGNMENT":"SELECT POSITION"}</div>
              <div style="font-size:11px;color:${n?"rgba(255,255,255,.36)":"var(--text-secondary,#666)"};">${r.label} · select a slot to add, change, or remove</div>
            </div>
            <div id="positionStatus" style="font-size:11px;color:${n?"#a3e635":"var(--accent,#639922)"};font-weight:800;"></div>
          </div>
          <div id="slotGrid" class="${n?"commercial-slot-grid":""}" style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px;"></div>
          <div id="slotActionPanel" class="${n?"commercial-slot-panel":""}" style="border:1px solid ${n?"rgba(163,230,53,.14)":"var(--border-color,#e7e7e7)"};border-radius:12px;padding:10px;margin-bottom:12px;background:${n?"rgba(255,255,255,.04)":"var(--bg-secondary,#f7f7f7)"};font-size:12px;color:${n?"rgba(255,255,255,.55)":"var(--text-secondary,#666)"};"></div>

          <div style="display:grid;grid-template-columns:0.9fr 1.1fr;gap:8px;">
            <button id="removePlantBtn" class="${n?"commercial-remove-btn":""}" style="width:100%;border:1px solid #efb2b2;background:#fff5f5;color:#c83a3a;border-radius:10px;padding:11px 8px;font-weight:800;cursor:pointer;">${n?"CLEAR SLOT":"Remove"}</button>
            <button id="confirmPlantBtn" class="btn-primary ${n?"commercial-confirm-btn":""}" style="width:100%;">${n?"ASSIGN CROP":"Plant Now →"}</button>
          </div>
        </div>
      </div>
    </div>`;const i=document.getElementById("addPlantModalOverlay");i.classList.add("open"),_(h),G(r,o),A(r,o),B(r,o),document.getElementById("closeAddPlantModal").addEventListener("click",S),i.addEventListener("click",a=>{a.target===i&&S()}),document.getElementById("speciesSearchBtn").addEventListener("click",j),document.getElementById("speciesSearchInput").addEventListener("keypress",a=>{a.key==="Enter"&&j()}),document.getElementById("removePlantBtn").addEventListener("click",()=>{if(c===null){b("warning","Select a planted slot first");return}const a=o[c];if(!a){b("warning","That slot is already empty");return}Z(c,r),b("success",`${a.emoji} ${a.name} removed from ${y(c,r)}`),S(),z()}),document.getElementById("confirmPlantBtn").addEventListener("click",()=>{if(!u){b("warning","Select a crop first");return}if(c===null){b("warning","Select a rack position");return}const a=o[c];J(u),K(u,c,r);const s=a?"changed to":"planted at";b("success",`${u.emoji} ${u.name} ${s} ${y(c,r)}`),S(),z()})}async function j(){var n;if(T)return;const e=document.getElementById("speciesSearchInput"),t=document.getElementById("speciesSearchStatus"),r=e.value.trim().toLowerCase();if(!r){b("warning","Enter a species name");return}const o=h.find(i=>i.species===r||i.name.toLowerCase()===r);if(o){L(o),t.textContent=`✅ ${o.name} is already in your crop list — selected!`,e.value="";return}T=!0,t.textContent="🤖 Looking up species data...",document.getElementById("speciesSearchBtn").textContent="...";try{const a=await(await fetch(`${U}/api/crops/species/${encodeURIComponent(r)}`)).json();if(a.error)throw new Error(a.error);const s={emoji:a.crop.emoji||E(r),name:a.crop.commonName||H(r),species:a.crop.species||C(r),days:((n=a.crop.requirements)==null?void 0:n.growthDays)||30,price:"Custom"};N(s),t.textContent=a.crop.aiGenerated?`✨ AI estimated data for "${s.name}" and saved to database!`:`✅ Found "${s.name}" in database — selected!`,e.value=""}catch(i){const a=ee(r);N(a),t.textContent=`✅ Added "${a.name}" locally — choose position and Plant Now`,e.value="",console.warn("Species search fallback:",i.message)}finally{T=!1,document.getElementById("speciesSearchBtn").textContent="🔍 Add"}}function N(e){h.find(t=>t.species===e.species)||(h.push(e),_(h)),L(e)}function K(e,t,r){var v;const o=Math.floor(t/r.slotsPerTier)+1,n=t%r.slotsPerTier+1,i={name:e.name,emoji:e.emoji,species:e.species,slots:1,slotIndex:t,tier:o,position:n,status:"healthy",source:"manual"},a=k(),s=m.currentFarmId||((v=m.currentFarm)==null?void 0:v.id),d=a.findIndex(x=>x.id===s),p=d>=0?a[d]:m.currentFarm;if(!p)return;const l=F(p,r).filter(x=>Number(x.slotIndex)!==t);l.push(i),l.sort((x,D)=>Number(x.slotIndex??9999)-Number(D.slotIndex??9999)),O(p,l,d,a,e.name)}function Z(e,t){var s,d;const r=k(),o=m.currentFarmId||((s=m.currentFarm)==null?void 0:s.id),n=r.findIndex(p=>p.id===o),i=n>=0?r[n]:m.currentFarm;if(!i)return;const a=F(i,t).filter(p=>Number(p.slotIndex)!==e).sort((p,l)=>Number(p.slotIndex??9999)-Number(l.slotIndex??9999));O(i,a,n,r,((d=a[0])==null?void 0:d.name)||i.targetPlant||"Plant")}function O(e,t,r,o,n){var a;const i={...e,plants:t,plantSlots:t.length,targetPlant:((a=t[0])==null?void 0:a.name)||n};r>=0&&(o[r]=i,localStorage.setItem(R,JSON.stringify(o))),m.currentFarm=i,m.currentFarmId=i.id||m.currentFarmId}function _(e){const t=document.getElementById("cropGrid");if(!t)return;const r=w();t.innerHTML=e.map(o=>r?`
    <div class="crop-option commercial-crop-option" data-species="${o.species}">
      <div class="commercial-crop-code">${te(o.name)}</div>
      <div style="min-width:0;">
        <div class="commercial-crop-name">${g(o.name)}</div>
        <div class="commercial-crop-meta">${g(o.species)} · ${o.days}d cycle</div>
      </div>
    </div>`:`
    <div class="crop-option" data-species="${o.species}"
      style="background:var(--surface,#fff);border-radius:12px;padding:8px;text-align:center;cursor:pointer;border:2px solid transparent;transition:border .15s;">
      <div style="font-size:28px;">${o.emoji}</div>
      <div style="font-weight:600;font-size:11px;">${o.name}</div>
      <div style="font-size:10px;color:#999;">${o.days}d</div>
    </div>`).join(""),document.querySelectorAll(".crop-option").forEach(o=>{o.addEventListener("click",()=>{const n=e.find(i=>i.species===o.dataset.species);n&&L(n)})})}function G(e,t){const r=document.getElementById("slotGrid");if(!r)return;const o=w();r.innerHTML=Array.from({length:e.tiers},(n,i)=>{const a=Array.from({length:e.slotsPerTier},(s,d)=>{const p=i*e.slotsPerTier+d,l=t[p],v=c===p;return o?`
          <button class="slot-option commercial-slot-option ${v?"selected":""} ${l?"filled":"empty"}" data-slot-index="${p}"
            aria-label="${l?`Change or remove ${g(l.name)}`:`Plant slot ${d+1}`}">
            <span class="commercial-slot-id">S${String(d+1).padStart(2,"0")}</span>
            <span class="commercial-slot-name">${l?g(l.name):"Available"}</span>
            <span class="commercial-slot-state">${l?g(l.status||"healthy"):"empty"}</span>
          </button>`:`
        <button class="slot-option" data-slot-index="${p}"
          aria-label="${l?`Change or remove ${g(l.name)}`:`Plant slot ${d+1}`}"
          style="min-height:54px;border-radius:12px;border:2px solid ${v?"var(--accent,#639922)":"var(--border-color,#ddd)"};background:${v?"var(--accent-l,#eef8e7)":"var(--surface,#fff)"};cursor:pointer;padding:6px;text-align:center;">
          <div style="font-size:20px;line-height:1;">${(l==null?void 0:l.emoji)||"◻️"}</div>
          <div style="font-size:10px;font-weight:800;margin-top:4px;color:${l?"var(--text,#111)":"var(--text-secondary,#666)"};">${l?g(l.name):`Slot ${d+1}`}</div>
        </button>`}).join("");return`
      <div>
        <div style="font-size:11px;font-weight:800;color:${o?"rgba(255,255,255,.42)":"var(--text-secondary,#666)"};margin-bottom:5px;">${o?`Zone ${String.fromCharCode(65+i)} · Tier ${i+1}`:`Tier ${i+1}`}</div>
        <div style="display:grid;grid-template-columns:repeat(${e.slotsPerTier},minmax(44px,1fr));gap:6px;">${a}</div>
      </div>`}).join(""),r.querySelectorAll(".slot-option").forEach(n=>{n.addEventListener("click",()=>{c=Number(n.dataset.slotIndex);const i=t[c];document.getElementById("positionStatus").textContent=i?`${y(c,e)} · ${i.name}`:y(c,e),G(e,t),A(e,t),B(e,t)})})}function A(e,t){const r=document.getElementById("slotActionPanel");if(!r)return;if(c===null){r.innerHTML="Choose a slot first. Empty slots can be planted; occupied slots can be changed or removed.";return}const o=t[c],n=u?`${u.emoji} ${u.name}`:"a crop";if(o){r.innerHTML=`
      <div style="font-weight:800;color:var(--text,#111);margin-bottom:4px;">${y(c,e)}</div>
      <div>Current: <strong>${o.emoji} ${g(o.name)}</strong></div>
      <div style="margin-top:3px;">Select ${g(n)} and press Change, or remove this plant.</div>`;return}r.innerHTML=`
    <div style="font-weight:800;color:var(--text,#111);margin-bottom:4px;">${y(c,e)}</div>
    <div>Empty slot. Select ${g(n)} and press Plant Now.</div>`}function B(e,t){const r=document.getElementById("confirmPlantBtn"),o=document.getElementById("removePlantBtn");if(!r||!o)return;const n=c===null?null:t[c],i=w();r.textContent=n?i?"UPDATE SLOT":"Change Plant →":i?"ASSIGN CROP":"Plant Now →",r.disabled=c===null||!u,r.style.opacity=r.disabled?"0.55":"1",r.style.cursor=r.disabled?"not-allowed":"pointer",o.disabled=!n,o.style.opacity=n?"1":"0.45",o.style.cursor=n?"pointer":"not-allowed"}function L(e){u=e;const t=w();document.querySelectorAll(".crop-option").forEach(r=>{t?r.classList.toggle("selected",r.dataset.species===e.species):r.style.border=r.dataset.species===e.species?"2px solid var(--accent,#639922)":"2px solid transparent"}),$&&(A($,P),B($,P))}function J(e){const t=m.tiles.find(r=>r.status==="empty"||!r.plant);t&&(t.plant=e.emoji,t.name=e.name,t.status="healthy",t.growth=0,t.days=e.days,t.species=e.species)}function z(){if(m.notify(),document.getElementById("commercialFarmCanvas")){q(async()=>{const{CommercialFarmCanvas:e}=await import("./CommercialFarmCanvas-CRjbCp7r.js");return{CommercialFarmCanvas:e}},__vite__mapDeps([0,1,2])).then(({CommercialFarmCanvas:e})=>e.init("commercialFarmCanvas")).catch(()=>M.init("commercialFarmCanvas"));return}document.getElementById("farmCanvas")&&M.init("farmCanvas")}function V(){const e=k();return m.currentFarm||e.find(t=>t.id===m.currentFarmId)||m.newFarm||e[e.length-1]||null}function Y(e){const t=String((e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackType)||(e==null?void 0:e.rackLabel)||"").toLowerCase();return t.includes("2")?f["2-tier"]:t.includes("4")?f["4-tier"]:t.includes("5")?f["5-tier"]:t.includes("wall")||t.includes("grid")?f.wall:t.includes("frame")?f["a-frame"]:t.includes("nft")||t.includes("channel")?f["nft-channel"]:t.includes("hanging")||t.includes("column")?f.hanging:f["3-tier"]}function W(e,t){const r=Array(t.total).fill(null);return F(e,t).forEach(o=>{const n=Number(o.slotIndex);Number.isInteger(n)&&n>=0&&n<t.total&&(r[n]=o)}),r}function F(e,t){const r=Array.isArray(e==null?void 0:e.plants)?e.plants:X(e,t),o=[],n=new Set;return r.forEach(i=>{if(i.slotIndex!==void 0&&i.slotIndex!==null){const s=Number(i.slotIndex);Number.isInteger(s)&&s>=0&&s<t.total&&!n.has(s)&&(o.push(I(i,s,t)),n.add(s));return}const a=Math.max(1,Number.parseInt(i.slots||i.count||1,10)||1);for(let s=0;s<a;s++){const d=Q(n,t.total);if(d===-1)return;o.push(I(i,d,t)),n.add(d)}}),o}function I(e,t,r){return{name:e.name||"Plant",emoji:e.emoji||E(e.name||e.species),species:e.species||C(e.name),slots:1,slotIndex:t,tier:Math.floor(t/r.slotsPerTier)+1,position:t%r.slotsPerTier+1,status:e.status||"healthy",source:e.source||"existing"}}function Q(e,t){for(let r=0;r<t;r++)if(!e.has(r))return r;return-1}function X(e,t){const r=Math.max(0,Math.min(t.total,Number.parseInt((e==null?void 0:e.plantSlots)||(e==null?void 0:e.plants)||0,10)||0)),o=(e==null?void 0:e.targetPlant)||"Plant";return Array.from({length:r},(n,i)=>I({name:o,emoji:E(o),species:C(o),status:"healthy"},i,t))}function k(){try{return JSON.parse(localStorage.getItem(R))||[]}catch{return[]}}function ee(e){return{emoji:E(e),name:H(e),species:C(e),days:30,price:"Custom"}}function w(){return m.mode==="commercial"||!!document.getElementById("commercialFarmCanvas")}function te(e=""){const t=String(e||"Plant").trim().replace(/[^a-zA-Z0-9 ]/g,""),r=t.split(/\s+/).filter(Boolean);return(r.length>1?r.map(n=>n[0]).join(""):t.slice(0,3)).toUpperCase()||"PL"}function re(){if(document.getElementById("commercial-plant-modal-style"))return;const e=document.createElement("style");e.id="commercial-plant-modal-style",e.textContent=`
    .commercial-plant-overlay {
      background: rgba(2, 6, 23, .72) !important;
      backdrop-filter: blur(12px);
    }
    .commercial-plant-sheet {
      background: #08110c !important;
      color: #fff !important;
      border: 1px solid rgba(163,230,53,.16) !important;
      box-shadow: 0 28px 80px rgba(0,0,0,.45) !important;
    }
    .commercial-plant-close {
      color: rgba(255,255,255,.62) !important;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,.08) !important;
      background: rgba(255,255,255,.04) !important;
    }
    .commercial-plant-action,
    .commercial-confirm-btn {
      background: rgba(163,230,53,.14) !important;
      border: 1px solid rgba(163,230,53,.26) !important;
      color: #a3e635 !important;
      letter-spacing: .08em;
    }
    .commercial-remove-btn {
      background: rgba(239,68,68,.08) !important;
      border-color: rgba(239,68,68,.24) !important;
      color: #f87171 !important;
      letter-spacing: .06em;
    }
    .commercial-crop-grid::-webkit-scrollbar,
    .commercial-slot-grid::-webkit-scrollbar { width: 5px; }
    .commercial-crop-grid::-webkit-scrollbar-thumb,
    .commercial-slot-grid::-webkit-scrollbar-thumb { background: rgba(163,230,53,.18); border-radius: 999px; }
    .commercial-crop-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 13px;
      border: 1px solid rgba(255,255,255,.07);
      background: rgba(255,255,255,.035);
      cursor: pointer;
      min-width: 0;
      transition: border .18s, background .18s, transform .18s;
    }
    .commercial-crop-option:hover,
    .commercial-crop-option.selected {
      border-color: rgba(163,230,53,.34);
      background: rgba(163,230,53,.08);
      transform: translateY(-1px);
    }
    .commercial-crop-code {
      width: 38px;
      height: 38px;
      border-radius: 11px;
      background: rgba(163,230,53,.12);
      color: #a3e635;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .06em;
      flex-shrink: 0;
    }
    .commercial-crop-name {
      color: #fff;
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .commercial-crop-meta {
      margin-top: 3px;
      color: rgba(255,255,255,.36);
      font-size: 10px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .commercial-slot-option {
      min-height: 52px;
      border-radius: 11px;
      border: 1px solid rgba(255,255,255,.07);
      background: rgba(255,255,255,.035);
      color: rgba(255,255,255,.68);
      cursor: pointer;
      padding: 7px;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 2px;
      transition: border .18s, background .18s;
    }
    .commercial-slot-option.filled {
      border-color: rgba(163,230,53,.18);
    }
    .commercial-slot-option.selected {
      border-color: rgba(56,189,248,.58);
      background: rgba(56,189,248,.09);
    }
    .commercial-slot-id {
      color: #a3e635;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .08em;
    }
    .commercial-slot-name {
      color: #fff;
      font-size: 10px;
      font-weight: 900;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .commercial-slot-state {
      color: rgba(255,255,255,.36);
      font-size: 8px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .commercial-slot-panel strong,
    .commercial-slot-panel b {
      color: #fff;
    }
  `,document.head.appendChild(e)}function y(e,t){return`Tier ${Math.floor(e/t.slotsPerTier)+1} · Slot ${e%t.slotsPerTier+1}`}function H(e){const t=String(e||"Plant").trim();return t.charAt(0).toUpperCase()+t.slice(1)}function C(e){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")}function E(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("cabbage")||t.includes("kale")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("strawberry")?"🍓":t.includes("cucumber")?"🥒":t.includes("carrot")?"🥕":t.includes("eggplant")||t.includes("aubergine")||t.includes("brinjal")?"🍆":t.includes("basil")||t.includes("mint")||t.includes("spinach")||t.includes("cilantro")||t.includes("parsley")?"🌿":"🌱"}function g(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function S(){u=null,c=null,$=null,P=[];const e=document.getElementById("addPlantModalOverlay");e&&e.remove()}export{oe as o};
