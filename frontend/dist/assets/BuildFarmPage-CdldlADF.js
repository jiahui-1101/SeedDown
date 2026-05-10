import{a as w,s as ue,A as B}from"./index-2pdwoC3-.js";import*as c from"https://esm.sh/three@0.160.0";import{OrbitControls as Te}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const fe="12.12.0",Ae=`https://www.gstatic.com/firebasejs/${fe}/firebase-app.js`,Le=`https://www.gstatic.com/firebasejs/${fe}/firebase-ai.js`;let z=null;async function Ee({image:t,mediaType:e,targetPlant:a}){var s;if(!Be())return null;const n=await(await ze()).generateContent([{inlineData:{data:t,mimeType:e||"image/jpeg"}},{text:Fe(a)}]),o=typeof((s=n.response)==null?void 0:s.text)=="function"?n.response.text():Ge(n.response);return Ne(o)}function Be(){return!1}async function ze(){return z||(z=(async()=>{const[{initializeApp:t,getApps:e},{getAI:a,getGenerativeModel:i,GoogleAIBackend:n}]=await Promise.all([import(Ae),import(Le)]),o={apiKey:void 0,authDomain:void 0,projectId:void 0,appId:void 0,storageBucket:void 0,messagingSenderId:void 0},s=e().length?e()[0]:t(o),d=a(s,{backend:new n});return i(d,{model:"gemini-2.0-flash",generationConfig:{temperature:.2,maxOutputTokens:900,responseMimeType:"application/json"}})})(),z)}function Fe(t){return`
You are a vertical farm expert. Analyse this indoor/vertical farm photo.${t?`
User says the intended plant is: ${t}. Use this as a hint, but only return it if it matches the photo or the photo is unclear.`:""}

Identify every plant species you can see and estimate how many slots/pots each occupies.

Return ONLY valid JSON, no markdown fences, no preamble:

{
  "plants": [
    {
      "name": "Common Name",
      "emoji": "🥬",
      "species": "species_slug",
      "confidence": 0.92,
      "slots": 4
    }
  ]
}

Rules:
- confidence: 0.0-1.0
- slots: integer, estimated pot/slot count for this species visible
- species: lowercase, underscores for spaces
- use realistic vegetable / herb emojis
- if photo is unclear but the target plant hint is useful, return one plant using the hint with lower confidence
- if no plants are visible and no hint is useful, return {"plants":[]}
- do NOT wrap in markdown
- return raw JSON only
`}function Ge(t){var e,a,i,n;return((n=(i=(a=(e=t==null?void 0:t.candidates)==null?void 0:e[0])==null?void 0:a.content)==null?void 0:i.parts)==null?void 0:n.map(o=>o.text||"").join(`
`))||'{"plants":[]}'}function Ne(t){const e=String(t||'{"plants":[]}').replace(/```json/g,"").replace(/```/g,"").trim(),a=e.indexOf("{"),i=e.lastIndexOf("}"),n=a>=0&&i>=a?e.slice(a,i+1):'{"plants":[]}',o=JSON.parse(n);return o.plants=je(o.plants||[]),o}function je(t){return t.map(e=>({name:e.name||"Unknown Plant",emoji:e.emoji||De(e.name),species:(e.species||e.name||"unknown").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,""),confidence:Math.min(1,Math.max(0,parseFloat(e.confidence)||0)),slots:Math.max(1,Math.min(50,parseInt(e.slots,10)||3))}))}function De(t=""){const e=String(t).toLowerCase();return e.includes("lettuce")||e.includes("cabbage")||e.includes("kale")?"🥬":e.includes("tomato")?"🍅":e.includes("chili")||e.includes("pepper")?"🌶️":e.includes("strawberry")?"🍓":e.includes("cucumber")?"🥒":e.includes("carrot")?"🥕":e.includes("bean")?"🫘":e.includes("pea")?"🟢":e.includes("basil")||e.includes("mint")||e.includes("spinach")||e.includes("cilantro")||e.includes("parsley")?"🌿":"🌱"}const ge="user_farms",me=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let x=1,p=null,r="realistic",N=null,j=!1,l={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},f=[];const U=[{id:"2-tier",label:"2-Tier Starter Rack",icon:"II",tiers:2,slotsPerTier:3,total:6,shape:"rack",desc:"compact shelf for desk or balcony trials"},{id:"3-tier",label:"3-Tier Vertical Rack",icon:"III",tiers:3,slotsPerTier:3,total:9,shape:"rack",desc:"balanced demo rack with 9 plant slots"},{id:"4-tier",label:"4-Tier Grow Shelf",icon:"IV",tiers:4,slotsPerTier:4,total:16,shape:"rack",desc:"larger home rack for mixed greens"},{id:"5-tier",label:"5-Tier Tower Rack",icon:"V",tiers:5,slotsPerTier:4,total:20,shape:"tower",desc:"tall structure with dense stacking"},{id:"wall",label:"Wall Panel Grid",icon:"GRID",tiers:4,slotsPerTier:5,total:20,shape:"wall",desc:"flat wall-mounted grow panel"},{id:"a-frame",label:"A-Frame Pyramid",icon:"A",tiers:4,slotsPerTier:4,total:16,shape:"aframe",desc:"slanted frame for two-sided access"},{id:"nft-channel",label:"NFT Channel Rows",icon:"NFT",tiers:3,slotsPerTier:6,total:18,shape:"channel",desc:"hydroponic channel layout for leafy crops"},{id:"hanging",label:"Hanging Column Farm",icon:"COL",tiers:5,slotsPerTier:3,total:15,shape:"column",desc:"vertical column pots for herbs and vines"}],he=[{id:"yield",label:"Yield"},{id:"health",label:"Health"},{id:"space",label:"Space fit"}],F={lettuce:"🥬",spinach:"🌿",basil:"🌿",tomato:"🍅",carrot:"🥕",cabbage:"🥬",eggplant:"🍆",mint:"🌿",kale:"🥬",cucumber:"🥒",pepper:"🌶️",chili:"🌶️",strawberry:"🍓",bean:"🫘",pea:"🟢",chard:"🥬",arugula:"🌿",radish:"🌱",cilantro:"🌿",parsley:"🌿"};function nt(){x=1,p=null,r="realistic",j=!1,l={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},f=[],R();const t=document.getElementById("screenContainer");t.innerHTML=`
        <div class="screen active" id="buildFarmScreen"
             style="display:flex;flex-direction:column;height:100vh;overflow:hidden;background:var(--bg);">
            <div class="topbar" style="flex-shrink:0;">
                <button id="bfBack" aria-label="Back"
                    style="background:none;border:none;font-size:22px;cursor:pointer;padding:4px 8px;color:var(--text);line-height:1;">←</button>
                <div>
                    <div style="font-weight:800;font-size:16px;">New Field</div>
                    <div style="font-size:11px;color:var(--muted);margin-top:1px;">analysis photo to 3D vertical preview</div>
                </div>
                <div style="width:40px;"></div>
            </div>

            <div id="bfSteps" style="flex-shrink:0;padding:12px 20px 0;"></div>
            <div id="bfContent" style="flex:1;overflow-y:auto;padding:16px;-webkit-overflow-scrolling:touch;"></div>
                        <div style="flex-shrink:0;padding:12px 16px 32px;background:var(--bg);border-top:1px solid var(--border);display:grid;grid-template-columns:0.82fr 1.18fr;gap:10px;">
                <button id="bfCancel"
                    style="padding:15px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface2);color:var(--text);font-size:14px;font-weight:800;cursor:pointer;">
                    Cancel
                </button>
                <button id="bfNext"
                    style="padding:15px;border:none;border-radius:12px;background:var(--accent);color:#fff;font-size:15px;font-weight:800;cursor:pointer;">
                    Continue
                </button>
            </div>
        </div>
    `,document.getElementById("bfBack").addEventListener("click",Qe),document.getElementById("bfCancel").addEventListener("click",ye),document.getElementById("bfNext").addEventListener("click",Ke),D()}function D(){Oe();const t=document.getElementById("bfContent"),e=document.getElementById("bfCancel"),a=document.getElementById("bfNext");t.innerHTML="",R(),x===1&&(Y(t),e.textContent="Cancel",a.textContent="Next: Add Photo"),x===2&&(ve(t),e.textContent="Exit",a.textContent="Generate 3D Preview"),x===3&&(xe(t),e.textContent="Preview Only",a.textContent="Create Field")}function Oe(){const t=["Plant","Photo","3D"];document.getElementById("bfSteps").innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-bottom:10px;">
            ${t.map((e,a)=>{const i=a+1<=x;return`
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${i?"var(--accent)":"var(--border)"};
                                    color:${i?"#fff":"var(--muted)"};
                                    font-size:11px;font-weight:800;flex-shrink:0;">
                            ${a+1<x?"✓":a+1}
                        </div>
                        <div style="font-size:11px;font-weight:800;color:${a+1===x?"var(--accent)":"var(--muted)"};">
                            ${e}
                        </div>
                    </div>
                `}).join("")}
        </div>
    `}function Y(t){t.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">FIELD SETUP</div>
                ${_("fieldNameInput","Field name","e.g. Balcony Mint Trial",l.name)}
                ${_("fieldLocationInput","Location / zone","e.g. Rack A, balcony, lab corner",l.location)}
                ${_("targetPlantInput","Plants for analysis","e.g. basil, lettuce, tomato",l.targetPlant)}
                ${Re()}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS GOAL</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${he.map(e=>`
                        <button class="analysis-goal" data-id="${e.id}"
                            style="padding:10px 8px;border-radius:10px;border:1.5px solid ${l.analysisGoal===e.id?"var(--accent)":"var(--border)"};
                                   background:${l.analysisGoal===e.id?"var(--accent-l)":"var(--surface2)"};
                                   color:${l.analysisGoal===e.id?"var(--accent)":"var(--text)"};
                                   font-size:12px;font-weight:800;cursor:pointer;">
                            ${e.label}
                        </button>
                    `).join("")}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">VERTICAL STRUCTURE</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${U.map(e=>We(e)).join("")}
                </div>
            </section>
        </div>
    `,W("fieldNameInput",e=>{l.name=e}),W("fieldLocationInput",e=>{l.location=e}),W("targetPlantInput",e=>{l.targetPlant=e,q(e),_e()}),document.querySelectorAll(".analysis-goal").forEach(e=>{e.addEventListener("click",()=>{l.analysisGoal=e.dataset.id,Y(t)})}),document.querySelectorAll(".rack-opt").forEach(e=>{e.addEventListener("click",()=>{l.rackType=e.dataset.id,Y(t)})})}function _(t,e,a,i){return`
        <label style="display:block;margin-bottom:10px;">
            <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">${e}</span>
            <input id="${t}" type="text" value="${$(i)}" placeholder="${a}"
                style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;
                       background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
        </label>
    `}function be(){const t=H(l.targetPlant);return t.length?t.map(e=>`
        <span style="display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:11px;font-weight:800;">
            <span>${$(J(e))}</span>${$(e)}
        </span>
    `).join(""):'<div style="font-size:11px;color:var(--muted);line-height:1.4;">Add one or many plants. Use commas, semicolons, or new lines.</div>'}function Re(){return`
        <div id="targetPlantChips" style="display:flex;flex-wrap:wrap;gap:6px;margin:-2px 0 10px;">
            ${be()}
        </div>
    `}function _e(){const t=document.getElementById("targetPlantChips");t&&(t.innerHTML=be())}function We(t){const e=l.rackType===t.id;return`
        <button class="rack-opt" data-id="${t.id}"
            style="width:100%;display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;cursor:pointer;
                   text-align:left;border:1.5px solid ${e?"var(--accent)":"var(--border)"};
                   background:${e?"var(--accent-l)":"var(--surface2)"};color:var(--text);">
            <span style="width:42px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;
                         background:${e?"var(--accent)":"var(--surface)"};color:${e?"#fff":"var(--sub)"};
                         font-size:10px;font-weight:900;letter-spacing:.03em;flex-shrink:0;">${t.icon}</span>
            <span style="flex:1;">
                <span style="display:block;font-size:13px;font-weight:800;">${t.label}</span>
                <span style="display:block;font-size:11px;color:var(--muted);margin-top:2px;">${t.tiers} tiers · ${t.total} plant slots</span>
                <span style="display:block;font-size:10px;color:var(--sub);margin-top:3px;line-height:1.25;">${$(t.desc||"")}</span>
            </span>
            <span style="font-size:18px;color:${e?"var(--accent)":"var(--muted)"};">${e?"✓":"+"}</span>
        </button>
    `}function ve(t){t.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FIELD PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture the vertical setup so the preview can match the real field.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${p?"READY":"NEEDED"}</div>
                </div>

                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${p?"var(--accent)":"var(--border)"};
                            background:${p?`url(${p.dataUrl}) center/cover`:"var(--surface2)"};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${p?`
                        <div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.58);color:white;
                                    padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;">Photo loaded</div>
                    `:`
                        <div style="text-align:center;color:var(--muted);">
                            <div style="font-size:36px;margin-bottom:8px;">▣</div>
                            <div style="font-size:13px;font-weight:800;">Tap to add field photo</div>
                            <div style="font-size:11px;margin-top:4px;">front-facing rack photo works best</div>
                        </div>
                    `}
                </div>
                <input type="file" id="photoInput" accept="image/*" style="display:none;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
                    <button id="cameraBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);font-weight:800;color:var(--text);cursor:pointer;">Camera</button>
                    <button id="galleryBtn" style="padding:11px;border:1px solid var(--border);border-radius:10px;background:var(--surface2);font-weight:800;color:var(--text);cursor:pointer;">Gallery</button>
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">PLANTS FOR ANALYSIS</div>
                        <div id="scanStatus" style="font-size:11px;color:var(--muted);margin-top:3px;">${p?"Ready to scan or edit manually":"Add a photo, or continue with manual plants"}</div>
                    </div>
                    <button id="scanBtn" ${p?"":"disabled"}
                        style="padding:7px 10px;border-radius:20px;border:1px solid ${p?"var(--accent)":"var(--border)"};
                               background:${p?"var(--accent-l)":"var(--surface2)"};
                               color:${p?"var(--accent)":"var(--muted)"};
                               font-size:11px;font-weight:800;cursor:${p?"pointer":"not-allowed"};">
                        Scan Photo
                    </button>
                </div>
                <div id="plantList" style="display:flex;flex-direction:column;gap:8px;"></div>
                <div style="display:flex;gap:8px;margin-top:12px;">
                    <input id="manualPlantInput" type="text" placeholder="Add plant, e.g. kale"
                        style="flex:1;padding:10px 12px;border:1.5px solid var(--border);border-radius:10px;background:var(--surface2);color:var(--text);font-size:13px;outline:none;">
                    <button id="manualAddBtn" style="padding:10px 14px;border:none;border-radius:10px;background:var(--accent);color:white;font-weight:800;cursor:pointer;">Add</button>
                </div>
            </section>
        </div>
    `,O(),Ue(t),document.getElementById("scanBtn").addEventListener("click",se),document.getElementById("manualAddBtn").addEventListener("click",pe),document.getElementById("manualPlantInput").addEventListener("keypress",e=>{e.key==="Enter"&&pe()}),p&&!j&&(j=!0,se())}function Ue(t){const e=document.getElementById("photoInput");document.getElementById("photoPreview").addEventListener("click",()=>e.click()),document.getElementById("cameraBtn").addEventListener("click",()=>{e.setAttribute("capture","environment"),e.click()}),document.getElementById("galleryBtn").addEventListener("click",()=>{e.removeAttribute("capture"),e.click()}),e.addEventListener("change",a=>{const i=a.target.files[0];if(!i)return;const n=new FileReader;n.onload=o=>{var I;const s=o.target.result,[d,u]=s.split(","),v=((I=d.match(/:(.*?);/))==null?void 0:I[1])||"image/jpeg";p={base64:u,mediaType:v,dataUrl:s},j=!1,ve(t)},n.readAsDataURL(i)})}function O(){const t=document.getElementById("plantList");if(t){if(f.length===0){t.innerHTML=`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;">
                No plants yet. Add the target plant or scan a photo.
            </div>
        `;return}t.innerHTML=f.map((e,a)=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:26px;line-height:1;flex-shrink:0;">${e.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${$(e.name)}</div>
                <div style="font-size:10px;color:var(--muted);margin-top:3px;">
                    ${e.confidence?`${Math.round(e.confidence*100)}% photo match · `:""}${e.species}
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:5px;">
                <button data-action="dec" data-idx="${a}" style="width:26px;height:26px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;">−</button>
                <span style="font-size:13px;font-weight:900;min-width:22px;text-align:center;">${e.slots}</span>
                <button data-action="inc" data-idx="${a}" style="width:26px;height:26px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;">+</button>
            </div>
            <button data-action="remove" data-idx="${a}" aria-label="Remove plant"
                style="border:none;background:transparent;color:var(--muted);font-size:18px;cursor:pointer;padding:2px 4px;">×</button>
        </div>
    `).join(""),t.querySelectorAll("button[data-action]").forEach(e=>{e.addEventListener("click",()=>{const a=Number(e.dataset.idx),i=e.dataset.action;i==="inc"&&(f[a].slots=Math.min(40,f[a].slots+1)),i==="dec"&&(f[a].slots=Math.max(1,f[a].slots-1)),i==="remove"&&f.splice(a,1),O()})})}}async function se(){var a;if(!p){w("warning","Add a field photo first");return}const t=document.getElementById("scanBtn"),e=document.getElementById("scanStatus");t&&(t.textContent="Scanning...",t.disabled=!0),e&&(e.textContent="AI is checking the field photo...");try{let i=null;try{i=await Ee({image:p.base64,mediaType:p.mediaType,targetPlant:l.targetPlant}),(a=i==null?void 0:i.plants)!=null&&a.length&&console.log("[BuildFarm] Firebase AI Logic recognized plants")}catch(o){console.warn("[BuildFarm] Firebase AI Logic unavailable:",o.message)}i||(i=await(await fetch(`${me}/api/farms/scan-plants`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:p.base64,mediaType:p.mediaType,targetPlant:l.targetPlant})})).json());const n=Array.isArray(i.plants)?i.plants:[];n.length?(we(n),w("success",`${n.length} plant type${n.length>1?"s":""} detected`),e&&(e.textContent="Review and adjust slots before generating 3D.")):(e&&(e.textContent=i.warning||"No clear plant detected. Manual list is still usable."),w("info","No plant detected from photo yet"))}catch{e&&(e.textContent="Photo scan unavailable. Manual plant list is ready."),w("warning","AI scan unavailable, continue manually")}finally{t&&(t.textContent="Scan Photo",t.disabled=!1),O()}}function xe(t){var n;const e=ke(),a=Ie(),i=l.targetPlant.trim()||((n=f[0])==null?void 0:n.name)||"Plant";t.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px;font-weight:900;">${$(i)} Vertical 3D</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:2px;">Drag to orbit · Toggle for gamified view</div>
                    </div>
                    <div style="display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:3px;flex-shrink:0;">
                        <button class="view-toggle" data-mode="realistic"
                            style="${le(r==="realistic")}">Real</button>
                        <button class="view-toggle" data-mode="gamified"
                            style="${le(r==="gamified")}">Game</button>
                    </div>
                </div>
                <div style="position:relative;background:#10141d;">
                    <canvas id="farmCanvas3D" style="width:100%;height:330px;display:block;"></canvas>
                    <div id="canvas3DOverlay"
                         style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                                background:rgba(16,20,29,.74);color:rgba(255,255,255,.78);font-size:13px;">
                        Building 3D field...
                    </div>
                    ${p?`
                        <img src="${p.dataUrl}" alt="Field source photo"
                             style="position:absolute;right:10px;bottom:10px;width:70px;height:70px;border-radius:10px;
                                    object-fit:cover;border:2px solid rgba(255,255,255,.45);box-shadow:0 8px 20px rgba(0,0,0,.22);">
                    `:""}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS SNAPSHOT</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    ${G("Target plant",i)}
                    ${G("Goal",Ze(l.analysisGoal))}
                    ${G("Structure",e.label)}
                    ${G("Slots",`${a}/${e.total}`,a>e.total?"var(--danger)":"var(--ok)")}
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                    ${f.map(o=>`
                        <span style="padding:5px 9px;border-radius:20px;background:var(--ok-bg);color:var(--ok);font-size:12px;font-weight:800;">
                            ${o.emoji} ${$(o.name)} ×${o.slots}
                        </span>
                    `).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".view-toggle").forEach(o=>{o.addEventListener("click",()=>{r=o.dataset.mode,xe(t)})}),setTimeout(()=>Ye(e),100)}function le(t){return["border:none","border-radius:8px","padding:7px 10px","font-size:11px","font-weight:900","cursor:pointer",`background:${t?"var(--accent)":"transparent"}`,`color:${t?"#fff":"var(--muted)"}`].join(";")}function G(t,e,a="var(--text)"){return`
        <div style="border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);min-height:62px;">
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-bottom:5px;">${t}</div>
            <div style="font-size:13px;color:${a};font-weight:900;line-height:1.25;">${$(String(e))}</div>
        </div>
    `}async function Ye(t){const e=document.getElementById("farmCanvas3D"),a=document.getElementById("canvas3DOverlay");if(!e)return;a&&(a.style.display="none");const i=330,n=Math.max(320,e.offsetWidth||360);if(!Je()){de(e,t,n,i),w("warning","WebGL is disabled, showing 2D preview");return}const o=Math.min(window.devicePixelRatio||1,2);e.width=n*o,e.height=i*o;let s;try{s=new c.WebGLRenderer({canvas:e,antialias:!0,alpha:!1,preserveDrawingBuffer:!0})}catch(g){console.warn("[BuildFarm] WebGL unavailable, using 2D fallback:",g.message),de(e,t,n,i),w("warning","WebGL is disabled, showing 2D preview");return}s.setPixelRatio(o),s.setSize(n,i),s.shadowMap.enabled=!0,s.shadowMap.type=c.PCFShadowMap,s.outputColorSpace=c.SRGBColorSpace,s.toneMapping=c.ACESFilmicToneMapping;const d=new c.Scene;d.background=new c.Color(r==="gamified"?1581626:1053725),d.fog=new c.FogExp2(r==="gamified"?1581626:1053725,.028);const u=new c.PerspectiveCamera(46,n/i,.1,80);u.position.set(3.3,2.25,3.7),d.add(new c.AmbientLight(r==="gamified"?7902463:4346223,1.55));const v=new c.DirectionalLight(16777215,r==="gamified"?3.4:2.3);v.position.set(5,8,5),v.castShadow=!0,v.shadow.mapSize.set(1024,1024),d.add(v);const{tiers:I,slotsPerTier:P}=t,C=t.shape==="channel"?.34:t.shape==="wall"?.36:t.shape==="column"?.46:.42,m=P*C+.1,h=t.shape==="wall"?.34:t.shape==="column"?1:r==="gamified"?.72:.58,b=t.tiers>=5?.54:.66,S=I*b,A=new c.MeshStandardMaterial({color:r==="gamified"?1911634:1448740,roughness:.9,metalness:.02}),T=new c.Mesh(new c.PlaneGeometry(9,9),A);T.rotation.x=-Math.PI/2,T.receiveShadow=!0,d.add(T);const L=new c.MeshStandardMaterial({color:r==="gamified"?5995770:5859452,roughness:.3,metalness:.75}),Me=new c.MeshStandardMaterial({color:r==="gamified"?8246268:7372944,roughness:.42,metalness:.55}),$e=new c.MeshStandardMaterial({color:r==="gamified"?16436245:10980346,emissive:r==="gamified"?8736014:5972406,emissiveIntensity:r==="gamified"?.45:.2,roughness:.5}),Ce=new c.BoxGeometry(.045,S,.045);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([g,k])=>{const M=new c.Mesh(Ce,L);M.position.set(g*m/2,S/2,k*h/2),M.castShadow=!0,d.add(M)});const V=[];f.forEach(g=>{for(let k=0;k<g.slots;k++)V.push(g)});for(let g=0;g<I;g++){const k=g*b,M=new c.Mesh(new c.BoxGeometry(m,.035,h),Me);M.position.set(0,k+.018,0),M.castShadow=!0,M.receiveShadow=!0,d.add(M);const Z=new c.Mesh(new c.BoxGeometry(m*.86,.018,.035),$e);Z.position.set(0,k+b-.07,-h/2+.06),d.add(Z);const ee=new c.PointLight(r==="gamified"?16436245:10980346,.75,1.4);ee.position.set(0,k+b*.7,0),d.add(ee);for(let E=0;E<P;E++){const te=g*P+E,ae=V[te],ne=(E-(P-1)/2)*C,ie=0,oe=k+.05;if(!ae){const re=new c.Mesh(new c.CylinderGeometry(.07,.07,.018,r==="gamified"?6:16),new c.MeshStandardMaterial({color:2371652,transparent:!0,opacity:.58,roughness:.9}));re.position.set(ne,oe,ie),d.add(re);continue}qe(c,d,ae,ne,oe,ie,te)}}r==="gamified"&&He(c,d,m,S);const y=new Te(u,s.domElement);y.enableDamping=!0,y.dampingFactor=.07,y.target.set(0,S*.42,0),y.minDistance=1.7,y.maxDistance=8,y.maxPolarAngle=Math.PI*.82,y.autoRotate=!0,y.autoRotateSpeed=r==="gamified"?1:.55,y.addEventListener("start",()=>{y.autoRotate=!1});const K=new ResizeObserver(()=>{const g=Math.max(320,e.offsetWidth||n);u.aspect=g/i,u.updateProjectionMatrix(),s.setSize(g,i)});K.observe(e);let Q;const X=()=>{Q=requestAnimationFrame(X),y.update(),s.render(d,u)};X(),N=()=>{cancelAnimationFrame(Q),K.disconnect(),y.dispose(),d.traverse(g=>{g.geometry&&g.geometry.dispose(),g.material&&(Array.isArray(g.material)?g.material.forEach(k=>k.dispose()):g.material.dispose())}),s.dispose()}}function qe(t,e,a,i,n,o,s){const d=r==="gamified"?[4906624,2282478,16436245,16478597,10980346]:[2278750,1483594,6660877,1409085,8843180],u=d[s%d.length],v=new t.MeshStandardMaterial({color:r==="gamified"?16347926:8141549,roughness:.68}),I=new t.Mesh(new t.CylinderGeometry(.07,.058,.07,r==="gamified"?6:16),v);I.position.set(i,n+.035,o),I.castShadow=!0,e.add(I);const P=new t.Mesh(new t.CylinderGeometry(.008,.008,.095,8),new t.MeshStandardMaterial({color:3560212,roughness:.82}));P.position.set(i,n+.105,o),e.add(P);const C=new t.MeshStandardMaterial({color:u,roughness:r==="gamified"?.48:.86,emissive:r==="gamified"?u:0,emissiveIntensity:r==="gamified"?.12:0}),m=r==="gamified"?5:3;for(let h=0;h<m;h++){const b=new t.Mesh(new t.SphereGeometry(.085,12,8),C),S=Math.PI*2/m*h;b.scale.set(1.25,.42,.7),b.position.set(i+Math.cos(S)*.05,n+.15+h%2*.016,o+Math.sin(S)*.045),b.rotation.set(.25,S,-.25),b.castShadow=!0,e.add(b)}}function He(t,e,a,i){const n=new t.MeshStandardMaterial({color:16436245,emissive:8736014,emissiveIntensity:.35,roughness:.35,metalness:.35});for(let o=0;o<5;o++){const s=new t.Mesh(new t.CylinderGeometry(.055,.055,.014,18),n);s.rotation.x=Math.PI/2,s.position.set((o-2)*a/5,i+.18+o%2*.08,-.42),e.add(s)}}function Je(){try{const t=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(t.getContext("webgl2")||t.getContext("webgl")||t.getContext("experimental-webgl")))}catch{return!1}}function de(t,e,a,i){const n=t.getContext("2d");if(!n)return;const o=Math.min(window.devicePixelRatio||1,2);t.width=Math.floor(a*o),t.height=Math.floor(i*o),n.setTransform(o,0,0,o,0,0);const s=n.createLinearGradient(0,0,a,i);s.addColorStop(0,r==="gamified"?"#18223a":"#10141d"),s.addColorStop(1,r==="gamified"?"#25345d":"#1f2937"),n.fillStyle=s,n.fillRect(0,0,a,i);const d=[];f.forEach(m=>{for(let h=0;h<m.slots;h++)d.push(m)});const u=34,v=a-u*2,P=(i-68)/e.tiers,C=v/e.slotsPerTier;n.fillStyle="rgba(255,255,255,0.1)",n.beginPath(),n.ellipse(a*.5,i-24,v*.43,16,0,0,Math.PI*2),n.fill(),n.strokeStyle=r==="gamified"?"#7dd3fc":"#64748b",n.lineWidth=6,n.lineCap="round",n.beginPath(),n.moveTo(u+8,32),n.lineTo(u+8,i-45),n.moveTo(a-u-8,32),n.lineTo(a-u-8,i-45),n.stroke();for(let m=0;m<e.tiers;m++){const h=42+m*P;n.fillStyle=r==="gamified"?"#7dd3fc":"#708090",ce(n,u,h+P*.56,v,9,5),n.fill(),n.fillStyle=r==="gamified"?"#facc15":"#a78bfa",ce(n,u+v*.12,h+7,v*.76,5,3),n.fill();for(let b=0;b<e.slotsPerTier;b++){const S=m*e.slotsPerTier+b,A=d[S],T=u+C*(b+.5),L=h+P*.53;n.fillStyle=A?r==="gamified"?"#f97316":"#7c3aed":"rgba(148,163,184,0.35)",n.beginPath(),n.ellipse(T,L,13,7,0,0,Math.PI*2),n.fill(),A&&Ve(n,T,L,A,S)}}if(r==="gamified"){n.fillStyle="#facc15";for(let m=0;m<5;m++)n.beginPath(),n.arc(a*.26+m*34,28+m%2*9,7,0,Math.PI*2),n.fill()}n.fillStyle="rgba(255,255,255,0.86)",n.font="700 12px Inter, system-ui, sans-serif",n.fillText(`${e.tiers} tiers · ${Math.min(d.length,e.total)}/${e.total} plants`,16,i-16)}function Ve(t,e,a,i,n){const o=r==="gamified"?["#4ade80","#22d3ee","#facc15","#fb7185","#a78bfa"]:["#22c55e","#16a34a","#65a30d","#15803d","#86efac"],s=i.emoji==="🍅"?"#ef4444":i.emoji==="🌶️"?"#dc2626":o[n%o.length];t.strokeStyle="#365314",t.lineWidth=2,t.beginPath(),t.moveTo(e,a-5),t.lineTo(e,a-25),t.stroke(),t.fillStyle=s;for(let d=0;d<5;d++){const u=Math.PI*2/5*d;t.save(),t.translate(e+Math.cos(u)*8,a-24+Math.sin(u)*5),t.rotate(u),t.beginPath(),t.ellipse(0,0,9,4,0,0,Math.PI*2),t.fill(),t.restore()}}function ce(t,e,a,i,n,o){t.beginPath(),t.moveTo(e+o,a),t.lineTo(e+i-o,a),t.quadraticCurveTo(e+i,a,e+i,a+o),t.lineTo(e+i,a+n-o),t.quadraticCurveTo(e+i,a+n,e+i-o,a+n),t.lineTo(e+o,a+n),t.quadraticCurveTo(e,a+n,e,a+n-o),t.lineTo(e,a+o),t.quadraticCurveTo(e,a,e+o,a),t.closePath()}async function Ke(){if(x===1){if(!l.name.trim()){w("warning","Enter a field name");return}if(H(l.targetPlant).length===0){w("warning","Enter at least one plant for analysis");return}q(l.targetPlant),x=2,D();return}if(x===2){if(!p){w("warning","Add a field photo before generating 3D");return}f.length===0&&q(l.targetPlant||"Plant"),x=3,D();return}x===3&&await Xe()}function Qe(){if(x===1){ye();return}x-=1,D()}function ye(){R(),w("info","New field creation cancelled"),ue("farmlist")}async function Xe(){const t=document.getElementById("bfNext");t&&(t.disabled=!0,t.textContent="Creating...");const e=ke(),a={name:l.name.trim(),location:l.location.trim(),rackType:l.rackType,targetPlant:l.targetPlant.trim(),analysisGoal:l.analysisGoal,viewMode:r,photoPreview:(p==null?void 0:p.dataUrl)||null,plants:f};try{await fetch(`${me}/api/farms/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})}catch(o){console.warn("[BuildFarm] create field API unavailable:",o.message)}const i=et(),n={id:`field_${Date.now()}`,name:a.name,location:a.location,zone:l.location.trim()||String.fromCharCode(65+i.length%26),rackTypeId:l.rackType,rackType:e.label,rackLabel:e.label,targetPlant:a.targetPlant,analysisGoal:a.analysisGoal,viewMode:r,photoPreview:a.photoPreview,plants:f.map(o=>({...o})),plantSlots:Ie(),createdAt:new Date().toISOString()};i.push(n),localStorage.setItem(ge,JSON.stringify(i)),B.newFarm=a,B.currentFarm=n,B.currentFarmId=n.id,B.farmName=n.name,w("success",`"${n.name}" field created`),R(),setTimeout(()=>ue("farmlist"),500)}function pe(){const t=document.getElementById("manualPlantInput");if(!t)return;const e=t.value.trim();e&&(we([Pe(e,3,0,"manual")]),t.value="",O(),w("success",`${e} added`))}function H(t){const e=new Set;return String(t||"").split(/[,;\n]+/).map(a=>a.trim()).filter(Boolean).filter(a=>{const i=a.toLowerCase();return e.has(i)?!1:(e.add(i),!0)})}function q(t){const e=H(t),a=new Set(e.map(i=>i.toLowerCase().replace(/\s+/g,"_")));f=f.filter(i=>i.source!=="target"||a.has(i.species)),e.slice().reverse().forEach(i=>{const n=Pe(i,4,0,"target");f.find(s=>s.species===n.species)||f.unshift(n)})}function we(t){t.forEach(e=>{const a=Se(e),i=f.find(n=>n.species===a.species);i?(i.slots=Math.max(i.slots,a.slots),i.confidence=Math.max(i.confidence||0,a.confidence||0),i.source=a.source||i.source):f.push(a)})}function Pe(t,e=3,a=0,i="target"){const n=String(t||"").toLowerCase().trim();return Se({name:n.charAt(0).toUpperCase()+n.slice(1),emoji:J(n),species:n.replace(/\s+/g,"_"),confidence:a,slots:e,source:i})}function J(t=""){const e=String(t).toLowerCase().replace(/_/g," ");if(F[e])return F[e];const a=Object.keys(F).find(i=>e.includes(i));return a?F[a]:"🌱"}function Se(t){const e=t.name||"Plant",a=(t.species||e).toLowerCase().trim().replace(/\s+/g,"_");return{name:e,emoji:t.emoji||J(a),species:a,confidence:Math.max(0,Math.min(1,Number(t.confidence)||0)),slots:Math.max(1,Math.min(40,Number.parseInt(t.slots,10)||3)),source:t.source||"ai"}}function ke(){return U.find(t=>t.id===l.rackType)||U[0]}function Ie(){return f.reduce((t,e)=>t+e.slots,0)}function Ze(t){var e;return((e=he.find(a=>a.id===t))==null?void 0:e.label)||t}function W(t,e){const a=document.getElementById(t);a&&(a.addEventListener("input",i=>e(i.target.value)),a.addEventListener("focus",()=>{a.style.borderColor="var(--accent)"}),a.addEventListener("blur",()=>{a.style.borderColor="var(--border)"}))}function et(){try{return JSON.parse(localStorage.getItem(ge))||[]}catch{return[]}}function R(){N&&(N(),N=null)}function $(t){return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{nt as render};
