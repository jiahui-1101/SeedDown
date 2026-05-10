import{s as de,a as P,A as B}from"./index-Cd0pKV2D.js";import*as c from"https://esm.sh/three@0.160.0";import{OrbitControls as Me}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const ce="12.12.0",Ie=`https://www.gstatic.com/firebasejs/${ce}/firebase-app.js`,$e=`https://www.gstatic.com/firebasejs/${ce}/firebase-ai.js`;let z=null;async function Ce({image:t,mediaType:e,targetPlant:a}){var s;if(!Te())return null;const n=await(await Ae()).generateContent([{inlineData:{data:t,mimeType:e||"image/jpeg"}},{text:Le(a)}]),o=typeof((s=n.response)==null?void 0:s.text)=="function"?n.response.text():Ee(n.response);return Be(o)}function Te(){return!1}async function Ae(){return z||(z=(async()=>{const[{initializeApp:t,getApps:e},{getAI:a,getGenerativeModel:i,GoogleAIBackend:n}]=await Promise.all([import(Ie),import($e)]),o={apiKey:void 0,authDomain:void 0,projectId:void 0,appId:void 0,storageBucket:void 0,messagingSenderId:void 0},s=e().length?e()[0]:t(o),l=a(s,{backend:new n});return i(l,{model:"gemini-2.0-flash",generationConfig:{temperature:.2,maxOutputTokens:900,responseMimeType:"application/json"}})})(),z)}function Le(t){return`
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
`}function Ee(t){var e,a,i,n;return((n=(i=(a=(e=t==null?void 0:t.candidates)==null?void 0:e[0])==null?void 0:a.content)==null?void 0:i.parts)==null?void 0:n.map(o=>o.text||"").join(`
`))||'{"plants":[]}'}function Be(t){const e=String(t||'{"plants":[]}').replace(/```json/g,"").replace(/```/g,"").trim(),a=e.indexOf("{"),i=e.lastIndexOf("}"),n=a>=0&&i>=a?e.slice(a,i+1):'{"plants":[]}',o=JSON.parse(n);return o.plants=ze(o.plants||[]),o}function ze(t){return t.map(e=>({name:e.name||"Unknown Plant",emoji:e.emoji||Ge(e.name),species:(e.species||e.name||"unknown").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,""),confidence:Math.min(1,Math.max(0,parseFloat(e.confidence)||0)),slots:Math.max(1,Math.min(50,parseInt(e.slots,10)||3))}))}function Ge(t=""){const e=String(t).toLowerCase();return e.includes("lettuce")||e.includes("cabbage")||e.includes("kale")?"🥬":e.includes("tomato")?"🍅":e.includes("chili")||e.includes("pepper")?"🌶️":e.includes("strawberry")?"🍓":e.includes("cucumber")?"🥒":e.includes("carrot")?"🥕":e.includes("bean")?"🫘":e.includes("pea")?"🟢":e.includes("basil")||e.includes("mint")||e.includes("spinach")||e.includes("cilantro")||e.includes("parsley")?"🌿":"🌱"}const pe="user_farms",ue=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let h=1,p=null,r="realistic",F=null,N=!1,d={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},m=[];const W=[{id:"3-tier",label:"3-Tier Vertical",icon:"III",tiers:3,slotsPerTier:3,total:9},{id:"5-tier",label:"5-Tier Tower",icon:"V",tiers:5,slotsPerTier:4,total:20},{id:"wall",label:"Wall Panel",icon:"GRID",tiers:4,slotsPerTier:5,total:20}],fe=[{id:"yield",label:"Yield"},{id:"health",label:"Health"},{id:"space",label:"Space fit"}],ge={lettuce:"🥬",spinach:"🌿",basil:"🌿",tomato:"🍅",carrot:"🥕",cabbage:"🥬",eggplant:"🍆",mint:"🌿",kale:"🥬",cucumber:"🥒",pepper:"🌶️",chili:"🌶️",strawberry:"🍓",bean:"🫘",pea:"🟢",chard:"🥬",arugula:"🌿",radish:"🌱",cilantro:"🌿",parsley:"🌿"};function Qe(){h=1,p=null,r="realistic",N=!1,d={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},m=[],O();const t=document.getElementById("screenContainer");t.innerHTML=`
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
            <div style="flex-shrink:0;padding:12px 16px 32px;background:var(--bg);border-top:1px solid var(--border);">
                <button id="bfNext"
                    style="width:100%;padding:15px;border:none;border-radius:12px;background:var(--accent);color:#fff;font-size:15px;font-weight:800;cursor:pointer;">
                    Continue
                </button>
            </div>
        </div>
    `,document.getElementById("bfBack").addEventListener("click",Ye),document.getElementById("bfNext").addEventListener("click",Ue),j()}function j(){Fe();const t=document.getElementById("bfContent"),e=document.getElementById("bfNext");t.innerHTML="",O(),h===1&&(U(t),e.textContent="Next: Add Photo"),h===2&&(me(t),e.textContent="Generate 3D Preview"),h===3&&(ve(t),e.textContent="Create Field")}function Fe(){const t=["Plant","Photo","3D"];document.getElementById("bfSteps").innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-bottom:10px;">
            ${t.map((e,a)=>{const i=a+1<=h;return`
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${i?"var(--accent)":"var(--border)"};
                                    color:${i?"#fff":"var(--muted)"};
                                    font-size:11px;font-weight:800;flex-shrink:0;">
                            ${a+1<h?"✓":a+1}
                        </div>
                        <div style="font-size:11px;font-weight:800;color:${a+1===h?"var(--accent)":"var(--muted)"};">
                            ${e}
                        </div>
                    </div>
                `}).join("")}
        </div>
    `}function U(t){t.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">FIELD SETUP</div>
                ${R("fieldNameInput","Field name","e.g. Balcony Mint Trial",d.name)}
                ${R("fieldLocationInput","Location / zone","e.g. Rack A, balcony, lab corner",d.location)}
                ${R("targetPlantInput","Plant for analysis","e.g. basil, lettuce, tomato",d.targetPlant)}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS GOAL</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${fe.map(e=>`
                        <button class="analysis-goal" data-id="${e.id}"
                            style="padding:10px 8px;border-radius:10px;border:1.5px solid ${d.analysisGoal===e.id?"var(--accent)":"var(--border)"};
                                   background:${d.analysisGoal===e.id?"var(--accent-l)":"var(--surface2)"};
                                   color:${d.analysisGoal===e.id?"var(--accent)":"var(--text)"};
                                   font-size:12px;font-weight:800;cursor:pointer;">
                            ${e.label}
                        </button>
                    `).join("")}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">VERTICAL STRUCTURE</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${W.map(e=>Ne(e)).join("")}
                </div>
            </section>
        </div>
    `,_("fieldNameInput",e=>{d.name=e}),_("fieldLocationInput",e=>{d.location=e}),_("targetPlantInput",e=>{d.targetPlant=e,Y(e)}),document.querySelectorAll(".analysis-goal").forEach(e=>{e.addEventListener("click",()=>{d.analysisGoal=e.dataset.id,U(t)})}),document.querySelectorAll(".rack-opt").forEach(e=>{e.addEventListener("click",()=>{d.rackType=e.dataset.id,U(t)})})}function R(t,e,a,i){return`
        <label style="display:block;margin-bottom:10px;">
            <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">${e}</span>
            <input id="${t}" type="text" value="${A(i)}" placeholder="${a}"
                style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;
                       background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
        </label>
    `}function Ne(t){const e=d.rackType===t.id;return`
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
            </span>
            <span style="font-size:18px;color:${e?"var(--accent)":"var(--muted)"};">${e?"✓":"+"}</span>
        </button>
    `}function me(t){t.innerHTML=`
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
    `,D(),je(t),document.getElementById("scanBtn").addEventListener("click",ie),document.getElementById("manualAddBtn").addEventListener("click",le),document.getElementById("manualPlantInput").addEventListener("keypress",e=>{e.key==="Enter"&&le()}),p&&!N&&(N=!0,ie())}function je(t){const e=document.getElementById("photoInput");document.getElementById("photoPreview").addEventListener("click",()=>e.click()),document.getElementById("cameraBtn").addEventListener("click",()=>{e.setAttribute("capture","environment"),e.click()}),document.getElementById("galleryBtn").addEventListener("click",()=>{e.removeAttribute("capture"),e.click()}),e.addEventListener("change",a=>{const i=a.target.files[0];if(!i)return;const n=new FileReader;n.onload=o=>{var M;const s=o.target.result,[l,u]=s.split(","),x=((M=l.match(/:(.*?);/))==null?void 0:M[1])||"image/jpeg";p={base64:u,mediaType:x,dataUrl:s},N=!1,me(t)},n.readAsDataURL(i)})}function D(){const t=document.getElementById("plantList");if(t){if(m.length===0){t.innerHTML=`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;">
                No plants yet. Add the target plant or scan a photo.
            </div>
        `;return}t.innerHTML=m.map((e,a)=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:26px;line-height:1;flex-shrink:0;">${e.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${A(e.name)}</div>
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
    `).join(""),t.querySelectorAll("button[data-action]").forEach(e=>{e.addEventListener("click",()=>{const a=Number(e.dataset.idx),i=e.dataset.action;i==="inc"&&(m[a].slots=Math.min(40,m[a].slots+1)),i==="dec"&&(m[a].slots=Math.max(1,m[a].slots-1)),i==="remove"&&m.splice(a,1),D()})})}}async function ie(){var a;if(!p){P("warning","Add a field photo first");return}const t=document.getElementById("scanBtn"),e=document.getElementById("scanStatus");t&&(t.textContent="Scanning...",t.disabled=!0),e&&(e.textContent="AI is checking the field photo...");try{let i=null;try{i=await Ce({image:p.base64,mediaType:p.mediaType,targetPlant:d.targetPlant}),(a=i==null?void 0:i.plants)!=null&&a.length&&console.log("[BuildFarm] Firebase AI Logic recognized plants")}catch(o){console.warn("[BuildFarm] Firebase AI Logic unavailable:",o.message)}i||(i=await(await fetch(`${ue}/api/farms/scan-plants`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:p.base64,mediaType:p.mediaType,targetPlant:d.targetPlant})})).json());const n=Array.isArray(i.plants)?i.plants:[];n.length?(be(n),P("success",`${n.length} plant type${n.length>1?"s":""} detected`),e&&(e.textContent="Review and adjust slots before generating 3D.")):(e&&(e.textContent=i.warning||"No clear plant detected. Manual list is still usable."),P("info","No plant detected from photo yet"))}catch{e&&(e.textContent="Photo scan unavailable. Manual plant list is ready."),P("warning","AI scan unavailable, continue manually")}finally{t&&(t.textContent="Scan Photo",t.disabled=!1),D()}}function ve(t){var n;const e=ye(),a=we(),i=d.targetPlant.trim()||((n=m[0])==null?void 0:n.name)||"Plant";t.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px;font-weight:900;">${A(i)} Vertical 3D</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:2px;">Drag to orbit · Toggle for gamified view</div>
                    </div>
                    <div style="display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:3px;flex-shrink:0;">
                        <button class="view-toggle" data-mode="realistic"
                            style="${oe(r==="realistic")}">Real</button>
                        <button class="view-toggle" data-mode="gamified"
                            style="${oe(r==="gamified")}">Game</button>
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
                    ${G("Goal",Je(d.analysisGoal))}
                    ${G("Structure",e.label)}
                    ${G("Slots",`${a}/${e.total}`,a>e.total?"var(--danger)":"var(--ok)")}
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                    ${m.map(o=>`
                        <span style="padding:5px 9px;border-radius:20px;background:var(--ok-bg);color:var(--ok);font-size:12px;font-weight:800;">
                            ${o.emoji} ${A(o.name)} ×${o.slots}
                        </span>
                    `).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".view-toggle").forEach(o=>{o.addEventListener("click",()=>{r=o.dataset.mode,ve(t)})}),setTimeout(()=>De(e),100)}function oe(t){return["border:none","border-radius:8px","padding:7px 10px","font-size:11px","font-weight:900","cursor:pointer",`background:${t?"var(--accent)":"transparent"}`,`color:${t?"#fff":"var(--muted)"}`].join(";")}function G(t,e,a="var(--text)"){return`
        <div style="border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);min-height:62px;">
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-bottom:5px;">${t}</div>
            <div style="font-size:13px;color:${a};font-weight:900;line-height:1.25;">${A(String(e))}</div>
        </div>
    `}async function De(t){const e=document.getElementById("farmCanvas3D"),a=document.getElementById("canvas3DOverlay");if(!e)return;a&&(a.style.display="none");const i=330,n=Math.max(320,e.offsetWidth||360);if(!_e()){re(e,t,n,i),P("warning","WebGL is disabled, showing 2D preview");return}const o=Math.min(window.devicePixelRatio||1,2);e.width=n*o,e.height=i*o;let s;try{s=new c.WebGLRenderer({canvas:e,antialias:!0,alpha:!1,preserveDrawingBuffer:!0})}catch(f){console.warn("[BuildFarm] WebGL unavailable, using 2D fallback:",f.message),re(e,t,n,i),P("warning","WebGL is disabled, showing 2D preview");return}s.setPixelRatio(o),s.setSize(n,i),s.shadowMap.enabled=!0,s.shadowMap.type=c.PCFShadowMap,s.outputColorSpace=c.SRGBColorSpace,s.toneMapping=c.ACESFilmicToneMapping;const l=new c.Scene;l.background=new c.Color(r==="gamified"?1581626:1053725),l.fog=new c.FogExp2(r==="gamified"?1581626:1053725,.028);const u=new c.PerspectiveCamera(46,n/i,.1,80);u.position.set(3.3,2.25,3.7),l.add(new c.AmbientLight(r==="gamified"?7902463:4346223,1.55));const x=new c.DirectionalLight(16777215,r==="gamified"?3.4:2.3);x.position.set(5,8,5),x.castShadow=!0,x.shadow.mapSize.set(1024,1024),l.add(x);const{tiers:M,slotsPerTier:w}=t,$=.42,g=w*$+.1,v=r==="gamified"?.72:.58,b=.66,S=M*b,T=new c.MeshStandardMaterial({color:r==="gamified"?1911634:1448740,roughness:.9,metalness:.02}),C=new c.Mesh(new c.PlaneGeometry(9,9),T);C.rotation.x=-Math.PI/2,C.receiveShadow=!0,l.add(C);const L=new c.MeshStandardMaterial({color:r==="gamified"?5995770:5859452,roughness:.3,metalness:.75}),Se=new c.MeshStandardMaterial({color:r==="gamified"?8246268:7372944,roughness:.42,metalness:.55}),ke=new c.MeshStandardMaterial({color:r==="gamified"?16436245:10980346,emissive:r==="gamified"?8736014:5972406,emissiveIntensity:r==="gamified"?.45:.2,roughness:.5}),Pe=new c.BoxGeometry(.045,S,.045);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([f,k])=>{const I=new c.Mesh(Pe,L);I.position.set(f*g/2,S/2,k*v/2),I.castShadow=!0,l.add(I)});const q=[];m.forEach(f=>{for(let k=0;k<f.slots;k++)q.push(f)});for(let f=0;f<M;f++){const k=f*b,I=new c.Mesh(new c.BoxGeometry(g,.035,v),Se);I.position.set(0,k+.018,0),I.castShadow=!0,I.receiveShadow=!0,l.add(I);const K=new c.Mesh(new c.BoxGeometry(g*.86,.018,.035),ke);K.position.set(0,k+b-.07,-v/2+.06),l.add(K);const Q=new c.PointLight(r==="gamified"?16436245:10980346,.75,1.4);Q.position.set(0,k+b*.7,0),l.add(Q);for(let E=0;E<w;E++){const X=f*w+E,Z=q[X],ee=(E-(w-1)/2)*$,te=0,ae=k+.05;if(!Z){const ne=new c.Mesh(new c.CylinderGeometry(.07,.07,.018,r==="gamified"?6:16),new c.MeshStandardMaterial({color:2371652,transparent:!0,opacity:.58,roughness:.9}));ne.position.set(ee,ae,te),l.add(ne);continue}Oe(c,l,Z,ee,ae,te,X)}}r==="gamified"&&Re(c,l,g,S);const y=new Me(u,s.domElement);y.enableDamping=!0,y.dampingFactor=.07,y.target.set(0,S*.42,0),y.minDistance=1.7,y.maxDistance=8,y.maxPolarAngle=Math.PI*.82,y.autoRotate=!0,y.autoRotateSpeed=r==="gamified"?1:.55,y.addEventListener("start",()=>{y.autoRotate=!1});const J=new ResizeObserver(()=>{const f=Math.max(320,e.offsetWidth||n);u.aspect=f/i,u.updateProjectionMatrix(),s.setSize(f,i)});J.observe(e);let H;const V=()=>{H=requestAnimationFrame(V),y.update(),s.render(l,u)};V(),F=()=>{cancelAnimationFrame(H),J.disconnect(),y.dispose(),l.traverse(f=>{f.geometry&&f.geometry.dispose(),f.material&&(Array.isArray(f.material)?f.material.forEach(k=>k.dispose()):f.material.dispose())}),s.dispose()}}function Oe(t,e,a,i,n,o,s){const l=r==="gamified"?[4906624,2282478,16436245,16478597,10980346]:[2278750,1483594,6660877,1409085,8843180],u=l[s%l.length],x=new t.MeshStandardMaterial({color:r==="gamified"?16347926:8141549,roughness:.68}),M=new t.Mesh(new t.CylinderGeometry(.07,.058,.07,r==="gamified"?6:16),x);M.position.set(i,n+.035,o),M.castShadow=!0,e.add(M);const w=new t.Mesh(new t.CylinderGeometry(.008,.008,.095,8),new t.MeshStandardMaterial({color:3560212,roughness:.82}));w.position.set(i,n+.105,o),e.add(w);const $=new t.MeshStandardMaterial({color:u,roughness:r==="gamified"?.48:.86,emissive:r==="gamified"?u:0,emissiveIntensity:r==="gamified"?.12:0}),g=r==="gamified"?5:3;for(let v=0;v<g;v++){const b=new t.Mesh(new t.SphereGeometry(.085,12,8),$),S=Math.PI*2/g*v;b.scale.set(1.25,.42,.7),b.position.set(i+Math.cos(S)*.05,n+.15+v%2*.016,o+Math.sin(S)*.045),b.rotation.set(.25,S,-.25),b.castShadow=!0,e.add(b)}}function Re(t,e,a,i){const n=new t.MeshStandardMaterial({color:16436245,emissive:8736014,emissiveIntensity:.35,roughness:.35,metalness:.35});for(let o=0;o<5;o++){const s=new t.Mesh(new t.CylinderGeometry(.055,.055,.014,18),n);s.rotation.x=Math.PI/2,s.position.set((o-2)*a/5,i+.18+o%2*.08,-.42),e.add(s)}}function _e(){try{const t=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(t.getContext("webgl2")||t.getContext("webgl")||t.getContext("experimental-webgl")))}catch{return!1}}function re(t,e,a,i){const n=t.getContext("2d");if(!n)return;const o=Math.min(window.devicePixelRatio||1,2);t.width=Math.floor(a*o),t.height=Math.floor(i*o),n.setTransform(o,0,0,o,0,0);const s=n.createLinearGradient(0,0,a,i);s.addColorStop(0,r==="gamified"?"#18223a":"#10141d"),s.addColorStop(1,r==="gamified"?"#25345d":"#1f2937"),n.fillStyle=s,n.fillRect(0,0,a,i);const l=[];m.forEach(g=>{for(let v=0;v<g.slots;v++)l.push(g)});const u=34,x=a-u*2,w=(i-68)/e.tiers,$=x/e.slotsPerTier;n.fillStyle="rgba(255,255,255,0.1)",n.beginPath(),n.ellipse(a*.5,i-24,x*.43,16,0,0,Math.PI*2),n.fill(),n.strokeStyle=r==="gamified"?"#7dd3fc":"#64748b",n.lineWidth=6,n.lineCap="round",n.beginPath(),n.moveTo(u+8,32),n.lineTo(u+8,i-45),n.moveTo(a-u-8,32),n.lineTo(a-u-8,i-45),n.stroke();for(let g=0;g<e.tiers;g++){const v=42+g*w;n.fillStyle=r==="gamified"?"#7dd3fc":"#708090",se(n,u,v+w*.56,x,9,5),n.fill(),n.fillStyle=r==="gamified"?"#facc15":"#a78bfa",se(n,u+x*.12,v+7,x*.76,5,3),n.fill();for(let b=0;b<e.slotsPerTier;b++){const S=g*e.slotsPerTier+b,T=l[S],C=u+$*(b+.5),L=v+w*.53;n.fillStyle=T?r==="gamified"?"#f97316":"#7c3aed":"rgba(148,163,184,0.35)",n.beginPath(),n.ellipse(C,L,13,7,0,0,Math.PI*2),n.fill(),T&&We(n,C,L,T,S)}}if(r==="gamified"){n.fillStyle="#facc15";for(let g=0;g<5;g++)n.beginPath(),n.arc(a*.26+g*34,28+g%2*9,7,0,Math.PI*2),n.fill()}n.fillStyle="rgba(255,255,255,0.86)",n.font="700 12px Inter, system-ui, sans-serif",n.fillText(`${e.tiers} tiers · ${Math.min(l.length,e.total)}/${e.total} plants`,16,i-16)}function We(t,e,a,i,n){const o=r==="gamified"?["#4ade80","#22d3ee","#facc15","#fb7185","#a78bfa"]:["#22c55e","#16a34a","#65a30d","#15803d","#86efac"],s=i.emoji==="🍅"?"#ef4444":i.emoji==="🌶️"?"#dc2626":o[n%o.length];t.strokeStyle="#365314",t.lineWidth=2,t.beginPath(),t.moveTo(e,a-5),t.lineTo(e,a-25),t.stroke(),t.fillStyle=s;for(let l=0;l<5;l++){const u=Math.PI*2/5*l;t.save(),t.translate(e+Math.cos(u)*8,a-24+Math.sin(u)*5),t.rotate(u),t.beginPath(),t.ellipse(0,0,9,4,0,0,Math.PI*2),t.fill(),t.restore()}}function se(t,e,a,i,n,o){t.beginPath(),t.moveTo(e+o,a),t.lineTo(e+i-o,a),t.quadraticCurveTo(e+i,a,e+i,a+o),t.lineTo(e+i,a+n-o),t.quadraticCurveTo(e+i,a+n,e+i-o,a+n),t.lineTo(e+o,a+n),t.quadraticCurveTo(e,a+n,e,a+n-o),t.lineTo(e,a+o),t.quadraticCurveTo(e,a,e+o,a),t.closePath()}async function Ue(){if(h===1){if(!d.name.trim()){P("warning","Enter a field name");return}if(!d.targetPlant.trim()){P("warning","Enter the plant for analysis");return}Y(d.targetPlant),h=2,j();return}if(h===2){if(!p){P("warning","Add a field photo before generating 3D");return}m.length===0&&Y(d.targetPlant||"Plant"),h=3,j();return}h===3&&await qe()}function Ye(){if(h===1){O(),de("farmlist");return}h-=1,j()}async function qe(){const t=document.getElementById("bfNext");t&&(t.disabled=!0,t.textContent="Creating...");const e=ye(),a={name:d.name.trim(),location:d.location.trim(),rackType:d.rackType,targetPlant:d.targetPlant.trim(),analysisGoal:d.analysisGoal,viewMode:r,photoPreview:(p==null?void 0:p.dataUrl)||null,plants:m};try{await fetch(`${ue}/api/farms/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})}catch(o){console.warn("[BuildFarm] create field API unavailable:",o.message)}const i=He(),n={id:`field_${Date.now()}`,name:a.name,location:a.location,zone:d.location.trim()||String.fromCharCode(65+i.length%26),rackTypeId:d.rackType,rackType:e.label,rackLabel:e.label,targetPlant:a.targetPlant,analysisGoal:a.analysisGoal,viewMode:r,photoPreview:a.photoPreview,plants:m.map(o=>({...o})),plantSlots:we(),createdAt:new Date().toISOString()};i.push(n),localStorage.setItem(pe,JSON.stringify(i)),B.newFarm=a,B.currentFarm=n,B.currentFarmId=n.id,B.farmName=n.name,P("success",`"${n.name}" field created`),O(),setTimeout(()=>de("farmlist"),500)}function le(){const t=document.getElementById("manualPlantInput");if(!t)return;const e=t.value.trim();e&&(be([xe(e,3,0)]),t.value="",D(),P("success",`${e} added`))}function Y(t){const e=t.trim();e&&(m.some(a=>a.name.toLowerCase()===e.toLowerCase())||m.unshift(xe(e,4,0)))}function be(t){t.forEach(e=>{const a=he(e),i=m.find(n=>n.species===a.species);i?(i.slots=Math.max(i.slots,a.slots),i.confidence=Math.max(i.confidence||0,a.confidence||0)):m.push(a)})}function xe(t,e=3,a=0){const i=t.toLowerCase().trim();return he({name:i.charAt(0).toUpperCase()+i.slice(1),emoji:ge[i]||"🌱",species:i.replace(/\s+/g,"_"),confidence:a,slots:e})}function he(t){const e=t.name||"Plant",a=(t.species||e).toLowerCase().trim().replace(/\s+/g,"_");return{name:e,emoji:t.emoji||ge[a]||"🌱",species:a,confidence:Math.max(0,Math.min(1,Number(t.confidence)||0)),slots:Math.max(1,Math.min(40,Number.parseInt(t.slots,10)||3))}}function ye(){return W.find(t=>t.id===d.rackType)||W[0]}function we(){return m.reduce((t,e)=>t+e.slots,0)}function Je(t){var e;return((e=fe.find(a=>a.id===t))==null?void 0:e.label)||t}function _(t,e){const a=document.getElementById(t);a&&(a.addEventListener("input",i=>e(i.target.value)),a.addEventListener("focus",()=>{a.style.borderColor="var(--accent)"}),a.addEventListener("blur",()=>{a.style.borderColor="var(--border)"}))}function He(){try{return JSON.parse(localStorage.getItem(pe))||[]}catch{return[]}}function O(){F&&(F(),F=null)}function A(t){return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{Qe as render};
