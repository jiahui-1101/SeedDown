import{a as w,s as pe,A as z}from"./index-CLrg-MS-.js";import{s as Ie}from"./firebaseAiLogic-DyUdSZb8.js";import*as d from"https://esm.sh/three@0.160.0";import{OrbitControls as Ce}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const fe="user_farms",ue=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let h=1,p=null,r="realistic",F=null,D=!1,s={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},u=[];const U=[{id:"2-tier",label:"2-Tier Starter Rack",icon:"II",tiers:2,slotsPerTier:3,total:6,shape:"rack",desc:"compact shelf for desk or balcony trials"},{id:"3-tier",label:"3-Tier Vertical Rack",icon:"III",tiers:3,slotsPerTier:3,total:9,shape:"rack",desc:"balanced demo rack with 9 plant slots"},{id:"4-tier",label:"4-Tier Grow Shelf",icon:"IV",tiers:4,slotsPerTier:4,total:16,shape:"rack",desc:"larger home rack for mixed greens"},{id:"5-tier",label:"5-Tier Tower Rack",icon:"V",tiers:5,slotsPerTier:4,total:20,shape:"tower",desc:"tall structure with dense stacking"},{id:"wall",label:"Wall Panel Grid",icon:"GRID",tiers:4,slotsPerTier:5,total:20,shape:"wall",desc:"flat wall-mounted grow panel"},{id:"a-frame",label:"A-Frame Pyramid",icon:"A",tiers:4,slotsPerTier:4,total:16,shape:"aframe",desc:"slanted frame for two-sided access"},{id:"nft-channel",label:"NFT Channel Rows",icon:"NFT",tiers:3,slotsPerTier:6,total:18,shape:"channel",desc:"hydroponic channel layout for leafy crops"},{id:"hanging",label:"Hanging Column Farm",icon:"COL",tiers:5,slotsPerTier:3,total:15,shape:"column",desc:"vertical column pots for herbs and vines"}],ge=[{id:"yield",label:"Yield"},{id:"health",label:"Health"},{id:"space",label:"Space fit"}],B={lettuce:"🥬",spinach:"🌿",basil:"🌿",tomato:"🍅",carrot:"🥕",cabbage:"🥬",eggplant:"🍆",mint:"🌿",kale:"🥬",cucumber:"🥒",pepper:"🌶️",chili:"🌶️",strawberry:"🍓",bean:"🫘",pea:"🟢",chard:"🥬",arugula:"🌿",radish:"🌱",cilantro:"🌿",parsley:"🌿"};function Ye(){h=1,p=null,r="realistic",D=!1,s={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},u=[],R();const e=document.getElementById("screenContainer");e.innerHTML=`
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
    `,document.getElementById("bfBack").addEventListener("click",Re),document.getElementById("bfCancel").addEventListener("click",be),document.getElementById("bfNext").addEventListener("click",Oe),N()}function N(){Te();const e=document.getElementById("bfContent"),t=document.getElementById("bfCancel"),a=document.getElementById("bfNext");e.innerHTML="",R(),h===1&&(_(e),t.textContent="Cancel",a.textContent="Next: Add Photo"),h===2&&(ve(e),t.textContent="Exit",a.textContent="Generate 3D Preview"),h===3&&(xe(e),t.textContent="Preview Only",a.textContent="Create Field")}function Te(){const e=["Plant","Photo","3D"];document.getElementById("bfSteps").innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-bottom:10px;">
            ${e.map((t,a)=>{const n=a+1<=h;return`
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${n?"var(--accent)":"var(--border)"};
                                    color:${n?"#fff":"var(--muted)"};
                                    font-size:11px;font-weight:800;flex-shrink:0;">
                            ${a+1<h?"✓":a+1}
                        </div>
                        <div style="font-size:11px;font-weight:800;color:${a+1===h?"var(--accent)":"var(--muted)"};">
                            ${t}
                        </div>
                    </div>
                `}).join("")}
        </div>
    `}function _(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">FIELD SETUP</div>
                ${j("fieldNameInput","Field name","e.g. Balcony Mint Trial",s.name)}
                ${j("fieldLocationInput","Location / zone","e.g. Rack A, balcony, lab corner",s.location)}
                ${j("targetPlantInput","Plants for analysis","e.g. basil, lettuce, tomato",s.targetPlant)}
                ${Le()}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS GOAL</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${ge.map(t=>`
                        <button class="analysis-goal" data-id="${t.id}"
                            style="padding:10px 8px;border-radius:10px;border:1.5px solid ${s.analysisGoal===t.id?"var(--accent)":"var(--border)"};
                                   background:${s.analysisGoal===t.id?"var(--accent-l)":"var(--surface2)"};
                                   color:${s.analysisGoal===t.id?"var(--accent)":"var(--text)"};
                                   font-size:12px;font-weight:800;cursor:pointer;">
                            ${t.label}
                        </button>
                    `).join("")}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">VERTICAL STRUCTURE</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${U.map(t=>Ee(t)).join("")}
                </div>
            </section>
        </div>
    `,W("fieldNameInput",t=>{s.name=t}),W("fieldLocationInput",t=>{s.location=t}),W("targetPlantInput",t=>{s.targetPlant=t,q(t),Ae()}),document.querySelectorAll(".analysis-goal").forEach(t=>{t.addEventListener("click",()=>{s.analysisGoal=t.dataset.id,_(e)})}),document.querySelectorAll(".rack-opt").forEach(t=>{t.addEventListener("click",()=>{s.rackType=t.dataset.id,_(e)})})}function j(e,t,a,n){return`
        <label style="display:block;margin-bottom:10px;">
            <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">${t}</span>
            <input id="${e}" type="text" value="${I(n)}" placeholder="${a}"
                style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;
                       background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
        </label>
    `}function me(){const e=H(s.targetPlant);return e.length?e.map(t=>`
        <span style="display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:11px;font-weight:800;">
            <span>${I(Y(t))}</span>${I(t)}
        </span>
    `).join(""):'<div style="font-size:11px;color:var(--muted);line-height:1.4;">Add one or many plants. Use commas, semicolons, or new lines.</div>'}function Le(){return`
        <div id="targetPlantChips" style="display:flex;flex-wrap:wrap;gap:6px;margin:-2px 0 10px;">
            ${me()}
        </div>
    `}function Ae(){const e=document.getElementById("targetPlantChips");e&&(e.innerHTML=me())}function Ee(e){const t=s.rackType===e.id;return`
        <button class="rack-opt" data-id="${e.id}"
            style="width:100%;display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;cursor:pointer;
                   text-align:left;border:1.5px solid ${t?"var(--accent)":"var(--border)"};
                   background:${t?"var(--accent-l)":"var(--surface2)"};color:var(--text);">
            <span style="width:42px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;
                         background:${t?"var(--accent)":"var(--surface)"};color:${t?"#fff":"var(--sub)"};
                         font-size:10px;font-weight:900;letter-spacing:.03em;flex-shrink:0;">${e.icon}</span>
            <span style="flex:1;">
                <span style="display:block;font-size:13px;font-weight:800;">${e.label}</span>
                <span style="display:block;font-size:11px;color:var(--muted);margin-top:2px;">${e.tiers} tiers · ${e.total} plant slots</span>
                <span style="display:block;font-size:10px;color:var(--sub);margin-top:3px;line-height:1.25;">${I(e.desc||"")}</span>
            </span>
            <span style="font-size:18px;color:${t?"var(--accent)":"var(--muted)"};">${t?"✓":"+"}</span>
        </button>
    `}function ve(e){e.innerHTML=`
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
    `,O(),ze(e),document.getElementById("scanBtn").addEventListener("click",re),document.getElementById("manualAddBtn").addEventListener("click",ce),document.getElementById("manualPlantInput").addEventListener("keypress",t=>{t.key==="Enter"&&ce()}),p&&!D&&(D=!0,re())}function ze(e){const t=document.getElementById("photoInput");document.getElementById("photoPreview").addEventListener("click",()=>t.click()),document.getElementById("cameraBtn").addEventListener("click",()=>{t.setAttribute("capture","environment"),t.click()}),document.getElementById("galleryBtn").addEventListener("click",()=>{t.removeAttribute("capture"),t.click()}),t.addEventListener("change",a=>{const n=a.target.files[0];if(!n)return;const i=new FileReader;i.onload=o=>{var M;const l=o.target.result,[c,f]=l.split(","),b=((M=c.match(/:(.*?);/))==null?void 0:M[1])||"image/jpeg";p={base64:f,mediaType:b,dataUrl:l},D=!1,ve(e)},i.readAsDataURL(n)})}function O(){const e=document.getElementById("plantList");if(e){if(u.length===0){e.innerHTML=`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;">
                No plants yet. Add the target plant or scan a photo.
            </div>
        `;return}e.innerHTML=u.map((t,a)=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:26px;line-height:1;flex-shrink:0;">${t.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${I(t.name)}</div>
                <div style="font-size:10px;color:var(--muted);margin-top:3px;">
                    ${t.confidence?`${Math.round(t.confidence*100)}% photo match · `:""}${t.species}
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:5px;">
                <button data-action="dec" data-idx="${a}" style="width:26px;height:26px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;">−</button>
                <span style="font-size:13px;font-weight:900;min-width:22px;text-align:center;">${t.slots}</span>
                <button data-action="inc" data-idx="${a}" style="width:26px;height:26px;border-radius:8px;border:1px solid var(--border);background:var(--surface);cursor:pointer;">+</button>
            </div>
            <button data-action="remove" data-idx="${a}" aria-label="Remove plant"
                style="border:none;background:transparent;color:var(--muted);font-size:18px;cursor:pointer;padding:2px 4px;">×</button>
        </div>
    `).join(""),e.querySelectorAll("button[data-action]").forEach(t=>{t.addEventListener("click",()=>{const a=Number(t.dataset.idx),n=t.dataset.action;n==="inc"&&(u[a].slots=Math.min(40,u[a].slots+1)),n==="dec"&&(u[a].slots=Math.max(1,u[a].slots-1)),n==="remove"&&u.splice(a,1),O()})})}}async function re(){var a;if(!p){w("warning","Add a field photo first");return}const e=document.getElementById("scanBtn"),t=document.getElementById("scanStatus");e&&(e.textContent="Scanning...",e.disabled=!0),t&&(t.textContent="AI is checking the field photo...");try{let n=null;try{n=await Ie({image:p.base64,mediaType:p.mediaType,targetPlant:s.targetPlant}),(a=n==null?void 0:n.plants)!=null&&a.length&&console.log("[BuildFarm] Firebase AI Logic recognized plants")}catch(o){console.warn("[BuildFarm] Firebase AI Logic unavailable:",o.message)}n||(n=await(await fetch(`${ue}/api/farms/scan-plants`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:p.base64,mediaType:p.mediaType,targetPlant:s.targetPlant})})).json());const i=Array.isArray(n.plants)?n.plants:[];i.length?(he(i),w("success",`${i.length} plant type${i.length>1?"s":""} detected`),t&&(t.textContent="Review and adjust slots before generating 3D.")):(t&&(t.textContent=n.warning||"No clear plant detected. Manual list is still usable."),w("info","No plant detected from photo yet"))}catch{t&&(t.textContent="Photo scan unavailable. Manual plant list is ready."),w("warning","AI scan unavailable, continue manually")}finally{e&&(e.textContent="Scan Photo",e.disabled=!1),O()}}function xe(e){var i;const t=Pe(),a=Se(),n=s.targetPlant.trim()||((i=u[0])==null?void 0:i.name)||"Plant";e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px;font-weight:900;">${I(n)} Vertical 3D</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:2px;">Drag to orbit · Toggle for gamified view</div>
                    </div>
                    <div style="display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:3px;flex-shrink:0;">
                        <button class="view-toggle" data-mode="realistic"
                            style="${se(r==="realistic")}">Real</button>
                        <button class="view-toggle" data-mode="gamified"
                            style="${se(r==="gamified")}">Game</button>
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
                    ${G("Target plant",n)}
                    ${G("Goal",We(s.analysisGoal))}
                    ${G("Structure",t.label)}
                    ${G("Slots",`${a}/${t.total}`,a>t.total?"var(--danger)":"var(--ok)")}
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                    ${u.map(o=>`
                        <span style="padding:5px 9px;border-radius:20px;background:var(--ok-bg);color:var(--ok);font-size:12px;font-weight:800;">
                            ${o.emoji} ${I(o.name)} ×${o.slots}
                        </span>
                    `).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".view-toggle").forEach(o=>{o.addEventListener("click",()=>{r=o.dataset.mode,xe(e)})}),setTimeout(()=>Be(t),100)}function se(e){return["border:none","border-radius:8px","padding:7px 10px","font-size:11px","font-weight:900","cursor:pointer",`background:${e?"var(--accent)":"transparent"}`,`color:${e?"#fff":"var(--muted)"}`].join(";")}function G(e,t,a="var(--text)"){return`
        <div style="border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);min-height:62px;">
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-bottom:5px;">${e}</div>
            <div style="font-size:13px;color:${a};font-weight:900;line-height:1.25;">${I(String(t))}</div>
        </div>
    `}async function Be(e){const t=document.getElementById("farmCanvas3D"),a=document.getElementById("canvas3DOverlay");if(!t)return;a&&(a.style.display="none");const n=330,i=Math.max(320,t.offsetWidth||360);if(!De()){le(t,e,i,n),w("warning","WebGL is disabled, showing 2D preview");return}const o=Math.min(window.devicePixelRatio||1,2);t.width=i*o,t.height=n*o;let l;try{l=new d.WebGLRenderer({canvas:t,antialias:!0,alpha:!1,preserveDrawingBuffer:!0})}catch(g){console.warn("[BuildFarm] WebGL unavailable, using 2D fallback:",g.message),le(t,e,i,n),w("warning","WebGL is disabled, showing 2D preview");return}l.setPixelRatio(o),l.setSize(i,n),l.shadowMap.enabled=!0,l.shadowMap.type=d.PCFShadowMap,l.outputColorSpace=d.SRGBColorSpace,l.toneMapping=d.ACESFilmicToneMapping;const c=new d.Scene;c.background=new d.Color(r==="gamified"?1581626:1053725),c.fog=new d.FogExp2(r==="gamified"?1581626:1053725,.028);const f=new d.PerspectiveCamera(46,i/n,.1,80);f.position.set(3.3,2.25,3.7),c.add(new d.AmbientLight(r==="gamified"?7902463:4346223,1.55));const b=new d.DirectionalLight(16777215,r==="gamified"?3.4:2.3);b.position.set(5,8,5),b.castShadow=!0,b.shadow.mapSize.set(1024,1024),c.add(b);const{tiers:M,slotsPerTier:P}=e,C=e.shape==="channel"?.34:e.shape==="wall"?.36:e.shape==="column"?.46:.42,m=P*C+.1,v=e.shape==="wall"?.34:e.shape==="column"?1:r==="gamified"?.72:.58,x=e.tiers>=5?.54:.66,S=M*x,L=new d.MeshStandardMaterial({color:r==="gamified"?1911634:1448740,roughness:.9,metalness:.02}),T=new d.Mesh(new d.PlaneGeometry(9,9),L);T.rotation.x=-Math.PI/2,T.receiveShadow=!0,c.add(T);const A=new d.MeshStandardMaterial({color:r==="gamified"?5995770:5859452,roughness:.3,metalness:.75}),ke=new d.MeshStandardMaterial({color:r==="gamified"?8246268:7372944,roughness:.42,metalness:.55}),Me=new d.MeshStandardMaterial({color:r==="gamified"?16436245:10980346,emissive:r==="gamified"?8736014:5972406,emissiveIntensity:r==="gamified"?.45:.2,roughness:.5}),$e=new d.BoxGeometry(.045,S,.045);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([g,k])=>{const $=new d.Mesh($e,A);$.position.set(g*m/2,S/2,k*v/2),$.castShadow=!0,c.add($)});const J=[];u.forEach(g=>{for(let k=0;k<g.slots;k++)J.push(g)});for(let g=0;g<M;g++){const k=g*x,$=new d.Mesh(new d.BoxGeometry(m,.035,v),ke);$.position.set(0,k+.018,0),$.castShadow=!0,$.receiveShadow=!0,c.add($);const X=new d.Mesh(new d.BoxGeometry(m*.86,.018,.035),Me);X.position.set(0,k+x-.07,-v/2+.06),c.add(X);const Z=new d.PointLight(r==="gamified"?16436245:10980346,.75,1.4);Z.position.set(0,k+x*.7,0),c.add(Z);for(let E=0;E<P;E++){const ee=g*P+E,te=J[ee],ae=(E-(P-1)/2)*C,ne=0,ie=k+.05;if(!te){const oe=new d.Mesh(new d.CylinderGeometry(.07,.07,.018,r==="gamified"?6:16),new d.MeshStandardMaterial({color:2371652,transparent:!0,opacity:.58,roughness:.9}));oe.position.set(ae,ie,ne),c.add(oe);continue}Ge(d,c,te,ae,ie,ne,ee)}}r==="gamified"&&Fe(d,c,m,S);const y=new Ce(f,l.domElement);y.enableDamping=!0,y.dampingFactor=.07,y.target.set(0,S*.42,0),y.minDistance=1.7,y.maxDistance=8,y.maxPolarAngle=Math.PI*.82,y.autoRotate=!0,y.autoRotateSpeed=r==="gamified"?1:.55,y.addEventListener("start",()=>{y.autoRotate=!1});const V=new ResizeObserver(()=>{const g=Math.max(320,t.offsetWidth||i);f.aspect=g/n,f.updateProjectionMatrix(),l.setSize(g,n)});V.observe(t);let K;const Q=()=>{K=requestAnimationFrame(Q),y.update(),l.render(c,f)};Q(),F=()=>{cancelAnimationFrame(K),V.disconnect(),y.dispose(),c.traverse(g=>{g.geometry&&g.geometry.dispose(),g.material&&(Array.isArray(g.material)?g.material.forEach(k=>k.dispose()):g.material.dispose())}),l.dispose()}}function Ge(e,t,a,n,i,o,l){const c=r==="gamified"?[4906624,2282478,16436245,16478597,10980346]:[2278750,1483594,6660877,1409085,8843180],f=c[l%c.length],b=new e.MeshStandardMaterial({color:r==="gamified"?16347926:8141549,roughness:.68}),M=new e.Mesh(new e.CylinderGeometry(.07,.058,.07,r==="gamified"?6:16),b);M.position.set(n,i+.035,o),M.castShadow=!0,t.add(M);const P=new e.Mesh(new e.CylinderGeometry(.008,.008,.095,8),new e.MeshStandardMaterial({color:3560212,roughness:.82}));P.position.set(n,i+.105,o),t.add(P);const C=new e.MeshStandardMaterial({color:f,roughness:r==="gamified"?.48:.86,emissive:r==="gamified"?f:0,emissiveIntensity:r==="gamified"?.12:0}),m=r==="gamified"?5:3;for(let v=0;v<m;v++){const x=new e.Mesh(new e.SphereGeometry(.085,12,8),C),S=Math.PI*2/m*v;x.scale.set(1.25,.42,.7),x.position.set(n+Math.cos(S)*.05,i+.15+v%2*.016,o+Math.sin(S)*.045),x.rotation.set(.25,S,-.25),x.castShadow=!0,t.add(x)}}function Fe(e,t,a,n){const i=new e.MeshStandardMaterial({color:16436245,emissive:8736014,emissiveIntensity:.35,roughness:.35,metalness:.35});for(let o=0;o<5;o++){const l=new e.Mesh(new e.CylinderGeometry(.055,.055,.014,18),i);l.rotation.x=Math.PI/2,l.position.set((o-2)*a/5,n+.18+o%2*.08,-.42),t.add(l)}}function De(){try{const e=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(e.getContext("webgl2")||e.getContext("webgl")||e.getContext("experimental-webgl")))}catch{return!1}}function le(e,t,a,n){const i=e.getContext("2d");if(!i)return;const o=Math.min(window.devicePixelRatio||1,2);e.width=Math.floor(a*o),e.height=Math.floor(n*o),i.setTransform(o,0,0,o,0,0);const l=i.createLinearGradient(0,0,a,n);l.addColorStop(0,r==="gamified"?"#18223a":"#10141d"),l.addColorStop(1,r==="gamified"?"#25345d":"#1f2937"),i.fillStyle=l,i.fillRect(0,0,a,n);const c=[];u.forEach(m=>{for(let v=0;v<m.slots;v++)c.push(m)});const f=34,b=a-f*2,P=(n-68)/t.tiers,C=b/t.slotsPerTier;i.fillStyle="rgba(255,255,255,0.1)",i.beginPath(),i.ellipse(a*.5,n-24,b*.43,16,0,0,Math.PI*2),i.fill(),i.strokeStyle=r==="gamified"?"#7dd3fc":"#64748b",i.lineWidth=6,i.lineCap="round",i.beginPath(),i.moveTo(f+8,32),i.lineTo(f+8,n-45),i.moveTo(a-f-8,32),i.lineTo(a-f-8,n-45),i.stroke();for(let m=0;m<t.tiers;m++){const v=42+m*P;i.fillStyle=r==="gamified"?"#7dd3fc":"#708090",de(i,f,v+P*.56,b,9,5),i.fill(),i.fillStyle=r==="gamified"?"#facc15":"#a78bfa",de(i,f+b*.12,v+7,b*.76,5,3),i.fill();for(let x=0;x<t.slotsPerTier;x++){const S=m*t.slotsPerTier+x,L=c[S],T=f+C*(x+.5),A=v+P*.53;i.fillStyle=L?r==="gamified"?"#f97316":"#7c3aed":"rgba(148,163,184,0.35)",i.beginPath(),i.ellipse(T,A,13,7,0,0,Math.PI*2),i.fill(),L&&Ne(i,T,A,L,S)}}if(r==="gamified"){i.fillStyle="#facc15";for(let m=0;m<5;m++)i.beginPath(),i.arc(a*.26+m*34,28+m%2*9,7,0,Math.PI*2),i.fill()}i.fillStyle="rgba(255,255,255,0.86)",i.font="700 12px Inter, system-ui, sans-serif",i.fillText(`${t.tiers} tiers · ${Math.min(c.length,t.total)}/${t.total} plants`,16,n-16)}function Ne(e,t,a,n,i){const o=r==="gamified"?["#4ade80","#22d3ee","#facc15","#fb7185","#a78bfa"]:["#22c55e","#16a34a","#65a30d","#15803d","#86efac"],l=n.emoji==="🍅"?"#ef4444":n.emoji==="🌶️"?"#dc2626":o[i%o.length];e.strokeStyle="#365314",e.lineWidth=2,e.beginPath(),e.moveTo(t,a-5),e.lineTo(t,a-25),e.stroke(),e.fillStyle=l;for(let c=0;c<5;c++){const f=Math.PI*2/5*c;e.save(),e.translate(t+Math.cos(f)*8,a-24+Math.sin(f)*5),e.rotate(f),e.beginPath(),e.ellipse(0,0,9,4,0,0,Math.PI*2),e.fill(),e.restore()}}function de(e,t,a,n,i,o){e.beginPath(),e.moveTo(t+o,a),e.lineTo(t+n-o,a),e.quadraticCurveTo(t+n,a,t+n,a+o),e.lineTo(t+n,a+i-o),e.quadraticCurveTo(t+n,a+i,t+n-o,a+i),e.lineTo(t+o,a+i),e.quadraticCurveTo(t,a+i,t,a+i-o),e.lineTo(t,a+o),e.quadraticCurveTo(t,a,t+o,a),e.closePath()}async function Oe(){if(h===1){if(!s.name.trim()){w("warning","Enter a field name");return}if(H(s.targetPlant).length===0){w("warning","Enter at least one plant for analysis");return}q(s.targetPlant),h=2,N();return}if(h===2){if(!p){w("warning","Add a field photo before generating 3D");return}u.length===0&&q(s.targetPlant||"Plant"),h=3,N();return}h===3&&await je()}function Re(){if(h===1){be();return}h-=1,N()}function be(){R(),w("info","New field creation cancelled"),pe("farmlist")}async function je(){const e=document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Creating...");const t=Pe(),a={name:s.name.trim(),location:s.location.trim(),rackType:s.rackType,targetPlant:s.targetPlant.trim(),analysisGoal:s.analysisGoal,viewMode:r,photoPreview:(p==null?void 0:p.dataUrl)||null,plants:u};try{await fetch(`${ue}/api/farms/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})}catch(o){console.warn("[BuildFarm] create field API unavailable:",o.message)}const n=Ue(),i={id:`field_${Date.now()}`,name:a.name,location:a.location,zone:s.location.trim()||String.fromCharCode(65+n.length%26),rackTypeId:s.rackType,rackType:t.label,rackLabel:t.label,targetPlant:a.targetPlant,analysisGoal:a.analysisGoal,viewMode:r,photoPreview:a.photoPreview,plants:u.map(o=>({...o})),plantSlots:Se(),createdAt:new Date().toISOString()};n.push(i),localStorage.setItem(fe,JSON.stringify(n)),z.newFarm=a,z.currentFarm=i,z.currentFarmId=i.id,z.farmName=i.name,w("success",`"${i.name}" field created`),R(),setTimeout(()=>pe("farmlist"),500)}function ce(){const e=document.getElementById("manualPlantInput");if(!e)return;const t=e.value.trim();t&&(he([ye(t,3,0,"manual")]),e.value="",O(),w("success",`${t} added`))}function H(e){const t=new Set;return String(e||"").split(/[,;\n]+/).map(a=>a.trim()).filter(Boolean).filter(a=>{const n=a.toLowerCase();return t.has(n)?!1:(t.add(n),!0)})}function q(e){const t=H(e),a=new Set(t.map(n=>n.toLowerCase().replace(/\s+/g,"_")));u=u.filter(n=>n.source!=="target"||a.has(n.species)),t.slice().reverse().forEach(n=>{const i=ye(n,4,0,"target");u.find(l=>l.species===i.species)||u.unshift(i)})}function he(e){e.forEach(t=>{const a=we(t),n=u.find(i=>i.species===a.species);n?(n.slots=Math.max(n.slots,a.slots),n.confidence=Math.max(n.confidence||0,a.confidence||0),n.source=a.source||n.source):u.push(a)})}function ye(e,t=3,a=0,n="target"){const i=String(e||"").toLowerCase().trim();return we({name:i.charAt(0).toUpperCase()+i.slice(1),emoji:Y(i),species:i.replace(/\s+/g,"_"),confidence:a,slots:t,source:n})}function Y(e=""){const t=String(e).toLowerCase().replace(/_/g," ");if(B[t])return B[t];const a=Object.keys(B).find(n=>t.includes(n));return a?B[a]:"🌱"}function we(e){const t=e.name||"Plant",a=(e.species||t).toLowerCase().trim().replace(/\s+/g,"_");return{name:t,emoji:e.emoji||Y(a),species:a,confidence:Math.max(0,Math.min(1,Number(e.confidence)||0)),slots:Math.max(1,Math.min(40,Number.parseInt(e.slots,10)||3)),source:e.source||"ai"}}function Pe(){return U.find(e=>e.id===s.rackType)||U[0]}function Se(){return u.reduce((e,t)=>e+t.slots,0)}function We(e){var t;return((t=ge.find(a=>a.id===e))==null?void 0:t.label)||e}function W(e,t){const a=document.getElementById(e);a&&(a.addEventListener("input",n=>t(n.target.value)),a.addEventListener("focus",()=>{a.style.borderColor="var(--accent)"}),a.addEventListener("blur",()=>{a.style.borderColor="var(--border)"}))}function Ue(){try{return JSON.parse(localStorage.getItem(fe))||[]}catch{return[]}}function R(){F&&(F(),F=null)}function I(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{Ye as render};
