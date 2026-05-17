const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/FarmListPage-DvljYx5N.js","assets/index-D5jvxCsW.js","assets/index-7FoRf0sk.css","assets/firebase-CFo32-pk.js"])))=>i.map(i=>d[i]);
import{a as S,_ as Ce,A as z}from"./index-D5jvxCsW.js";import{s as Te}from"./firebaseAiLogic-BjKxIkAD.js";import*as d from"https://esm.sh/three@0.160.0";import{OrbitControls as Le}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const pe="user_farms",fe=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let y=1,c=null,r="realistic",F=null,D=!1,l={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},f=[];const W=[{id:"2-tier",label:"2-Tier Starter Rack",icon:"II",tiers:2,slotsPerTier:3,total:6,shape:"rack",desc:"compact shelf for desk or balcony trials"},{id:"3-tier",label:"3-Tier Vertical Rack",icon:"III",tiers:3,slotsPerTier:3,total:9,shape:"rack",desc:"balanced demo rack with 9 plant slots"},{id:"4-tier",label:"4-Tier Grow Shelf",icon:"IV",tiers:4,slotsPerTier:4,total:16,shape:"rack",desc:"larger home rack for mixed greens"},{id:"5-tier",label:"5-Tier Tower Rack",icon:"V",tiers:5,slotsPerTier:4,total:20,shape:"tower",desc:"tall structure with dense stacking"},{id:"wall",label:"Wall Panel Grid",icon:"GRID",tiers:4,slotsPerTier:5,total:20,shape:"wall",desc:"flat wall-mounted grow panel"},{id:"a-frame",label:"A-Frame Pyramid",icon:"A",tiers:4,slotsPerTier:4,total:16,shape:"aframe",desc:"slanted frame for two-sided access"},{id:"nft-channel",label:"NFT Channel Rows",icon:"NFT",tiers:3,slotsPerTier:6,total:18,shape:"channel",desc:"hydroponic channel layout for leafy crops"},{id:"hanging",label:"Hanging Column Farm",icon:"COL",tiers:5,slotsPerTier:3,total:15,shape:"column",desc:"vertical column pots for herbs and vines"}],ue=[{id:"yield",label:"Yield"},{id:"health",label:"Health"},{id:"space",label:"Space fit"}],B={lettuce:"🥬",spinach:"🌿",basil:"🌿",tomato:"🍅",carrot:"🥕",cabbage:"🥬",eggplant:"🍆",mint:"🌿",kale:"🥬",cucumber:"🥒",pepper:"🌶️",chili:"🌶️",strawberry:"🍓",bean:"🫘",pea:"🟢",chard:"🥬",arugula:"🌿",radish:"🌱",cilantro:"🌿",parsley:"🌿"};function Je(){y=1,c=null,r="realistic",D=!1,l={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},f=[],R();const e=document.getElementById("screenContainer");e.innerHTML=`
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
    `,document.getElementById("bfBack").addEventListener("click",_e),document.getElementById("bfCancel").addEventListener("click",be),document.getElementById("bfNext").addEventListener("click",je),N()}function N(){Ae();const e=document.getElementById("bfContent"),t=document.getElementById("bfCancel"),a=document.getElementById("bfNext");e.innerHTML="",R(),y===1&&(H(e),t.textContent="Cancel",a.textContent="Next: Add Photo"),y===2&&(me(e),t.textContent="Exit",a.textContent="Generate 3D Preview"),y===3&&(ve(e),t.textContent="Preview Only",a.textContent="Create Field")}function Ae(){const e=["Plant","Photo","3D"];document.getElementById("bfSteps").innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-bottom:10px;">
            ${e.map((t,a)=>{const i=a+1<=y;return`
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${i?"var(--accent)":"var(--border)"};
                                    color:${i?"#fff":"var(--muted)"};
                                    font-size:11px;font-weight:800;flex-shrink:0;">
                            ${a+1<y?"✓":a+1}
                        </div>
                        <div style="font-size:11px;font-weight:800;color:${a+1===y?"var(--accent)":"var(--muted)"};">
                            ${t}
                        </div>
                    </div>
                `}).join("")}
        </div>
    `}function H(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">FIELD SETUP</div>
                ${j("fieldNameInput","Field name","e.g. Balcony Mint Trial",l.name)}
                ${j("fieldLocationInput","Location / zone","e.g. Rack A, balcony, lab corner",l.location)}
                ${j("targetPlantInput","Plants for analysis","e.g. basil, lettuce, tomato",l.targetPlant)}
                ${Ee()}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS GOAL</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${ue.map(t=>`
                        <button class="analysis-goal" data-id="${t.id}"
                            style="padding:10px 8px;border-radius:10px;border:1.5px solid ${l.analysisGoal===t.id?"var(--accent)":"var(--border)"};
                                   background:${l.analysisGoal===t.id?"var(--accent-l)":"var(--surface2)"};
                                   color:${l.analysisGoal===t.id?"var(--accent)":"var(--text)"};
                                   font-size:12px;font-weight:800;cursor:pointer;">
                            ${t.label}
                        </button>
                    `).join("")}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">VERTICAL STRUCTURE</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${W.map(t=>Be(t)).join("")}
                </div>
            </section>
        </div>
    `,_("fieldNameInput",t=>{l.name=t}),_("fieldLocationInput",t=>{l.location=t}),_("targetPlantInput",t=>{l.targetPlant=t,U(t),ze()}),document.querySelectorAll(".analysis-goal").forEach(t=>{t.addEventListener("click",()=>{l.analysisGoal=t.dataset.id,H(e)})}),document.querySelectorAll(".rack-opt").forEach(t=>{t.addEventListener("click",()=>{l.rackType=t.dataset.id,H(e)})})}function j(e,t,a,i){return`
        <label style="display:block;margin-bottom:10px;">
            <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">${t}</span>
            <input id="${e}" type="text" value="${T(i)}" placeholder="${a}"
                style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;
                       background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
        </label>
    `}function ge(){const e=q(l.targetPlant);return e.length?e.map(t=>`
        <span style="display:inline-flex;align-items:center;gap:5px;padding:6px 9px;border-radius:999px;background:var(--accent-l);color:var(--accent);font-size:11px;font-weight:800;">
            <span>${T(Y(t))}</span>${T(t)}
        </span>
    `).join(""):'<div style="font-size:11px;color:var(--muted);line-height:1.4;">Add one or many plants. Use commas, semicolons, or new lines.</div>'}function Ee(){return`
        <div id="targetPlantChips" style="display:flex;flex-wrap:wrap;gap:6px;margin:-2px 0 10px;">
            ${ge()}
        </div>
    `}function ze(){const e=document.getElementById("targetPlantChips");e&&(e.innerHTML=ge())}function Be(e){const t=l.rackType===e.id;return`
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
                <span style="display:block;font-size:10px;color:var(--sub);margin-top:3px;line-height:1.25;">${T(e.desc||"")}</span>
            </span>
            <span style="font-size:18px;color:${t?"var(--accent)":"var(--muted)"};">${t?"✓":"+"}</span>
        </button>
    `}function me(e){e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FIELD PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture the vertical setup so the preview can match the real field.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${c?"READY":"NEEDED"}</div>
                </div>

                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${c?"var(--accent)":"var(--border)"};
                            background:${c?`url(${c.dataUrl}) center/cover`:"var(--surface2)"};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${c?`
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
                        <div id="scanStatus" style="font-size:11px;color:var(--muted);margin-top:3px;">${c?"Ready to scan or edit manually":"Add a photo, or continue with manual plants"}</div>
                    </div>
                    <button id="scanBtn" ${c?"":"disabled"}
                        style="padding:7px 10px;border-radius:20px;border:1px solid ${c?"var(--accent)":"var(--border)"};
                               background:${c?"var(--accent-l)":"var(--surface2)"};
                               color:${c?"var(--accent)":"var(--muted)"};
                               font-size:11px;font-weight:800;cursor:${c?"pointer":"not-allowed"};">
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
    `,O(),Ge(e),document.getElementById("scanBtn").addEventListener("click",re),document.getElementById("manualAddBtn").addEventListener("click",ce),document.getElementById("manualPlantInput").addEventListener("keypress",t=>{t.key==="Enter"&&ce()}),c&&!D&&(D=!0,re())}function Ge(e){const t=document.getElementById("photoInput");document.getElementById("photoPreview").addEventListener("click",()=>t.click()),document.getElementById("cameraBtn").addEventListener("click",()=>{t.setAttribute("capture","environment"),t.click()}),document.getElementById("galleryBtn").addEventListener("click",()=>{t.removeAttribute("capture"),t.click()}),t.addEventListener("change",a=>{const i=a.target.files[0];if(!i)return;const n=new FileReader;n.onload=o=>{var w;const g=o.target.result,[p,s]=g.split(","),x=((w=p.match(/:(.*?);/))==null?void 0:w[1])||"image/jpeg";c={base64:s,mediaType:x,dataUrl:g},D=!1,me(e)},n.readAsDataURL(i)})}function O(){const e=document.getElementById("plantList");if(e){if(f.length===0){e.innerHTML=`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;">
                No plants yet. Add the target plant or scan a photo.
            </div>
        `;return}e.innerHTML=f.map((t,a)=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:26px;line-height:1;flex-shrink:0;">${t.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${T(t.name)}</div>
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
    `).join(""),e.querySelectorAll("button[data-action]").forEach(t=>{t.addEventListener("click",()=>{const a=Number(t.dataset.idx),i=t.dataset.action;i==="inc"&&(f[a].slots=Math.min(40,f[a].slots+1)),i==="dec"&&(f[a].slots=Math.max(1,f[a].slots-1)),i==="remove"&&f.splice(a,1),O()})})}}async function re(){var a;if(!c){S("warning","Add a field photo first");return}const e=document.getElementById("scanBtn"),t=document.getElementById("scanStatus");e&&(e.textContent="Scanning...",e.disabled=!0),t&&(t.textContent="AI is checking the field photo...");try{let i=null;try{i=await Te({image:c.base64,mediaType:c.mediaType,targetPlant:l.targetPlant}),(a=i==null?void 0:i.plants)!=null&&a.length&&console.log("[BuildFarm] Firebase AI Logic recognized plants")}catch(o){console.warn("[BuildFarm] Firebase AI Logic unavailable:",o.message)}i||(i=await(await fetch(`${fe}/api/farms/scan-plants`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:c.base64,mediaType:c.mediaType,targetPlant:l.targetPlant})})).json());const n=Array.isArray(i.plants)?i.plants:[];n.length?(he(n),S("success",`${n.length} plant type${n.length>1?"s":""} detected`),t&&(t.textContent="Review and adjust slots before generating 3D.")):(t&&(t.textContent=i.warning||"No clear plant detected. Manual list is still usable."),S("info","No plant detected from photo yet"))}catch{t&&(t.textContent="Photo scan unavailable. Manual plant list is ready."),S("warning","AI scan unavailable, continue manually")}finally{e&&(e.textContent="Scan Photo",e.disabled=!1),O()}}function ve(e){var n;const t=Pe(),a=Se(),i=l.targetPlant.trim()||((n=f[0])==null?void 0:n.name)||"Plant";e.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px;font-weight:900;">${T(i)} Vertical 3D</div>
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
                    <canvas id="farmCanvas3D" style="width:100%;height:clamp(300px,44dvh,560px);display:block;"></canvas>
                    <div id="canvas3DOverlay"
                         style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                                background:rgba(16,20,29,.74);color:rgba(255,255,255,.78);font-size:13px;">
                        Building 3D field...
                    </div>
                    ${c?`
                        <img src="${c.dataUrl}" alt="Field source photo"
                             style="position:absolute;right:10px;bottom:10px;width:70px;height:70px;border-radius:10px;
                                    object-fit:cover;border:2px solid rgba(255,255,255,.45);box-shadow:0 8px 20px rgba(0,0,0,.22);">
                    `:""}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS SNAPSHOT</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    ${G("Target plant",i)}
                    ${G("Goal",He(l.analysisGoal))}
                    ${G("Structure",t.label)}
                    ${G("Slots",`${a}/${t.total}`,a>t.total?"var(--danger)":"var(--ok)")}
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                    ${f.map(o=>`
                        <span style="padding:5px 9px;border-radius:20px;background:var(--ok-bg);color:var(--ok);font-size:12px;font-weight:800;">
                            ${o.emoji} ${T(o.name)} ×${o.slots}
                        </span>
                    `).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".view-toggle").forEach(o=>{o.addEventListener("click",()=>{r=o.dataset.mode,ve(e)})}),setTimeout(()=>Fe(t),100)}function se(e){return["border:none","border-radius:8px","padding:7px 10px","font-size:11px","font-weight:900","cursor:pointer",`background:${e?"var(--accent)":"transparent"}`,`color:${e?"#fff":"var(--muted)"}`].join(";")}function G(e,t,a="var(--text)"){return`
        <div style="border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);min-height:62px;">
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-bottom:5px;">${e}</div>
            <div style="font-size:13px;color:${a};font-weight:900;line-height:1.25;">${T(String(t))}</div>
        </div>
    `}async function Fe(e){const t=document.getElementById("farmCanvas3D"),a=document.getElementById("canvas3DOverlay");if(!t)return;a&&(a.style.display="none");const i=()=>({width:Math.max(240,t.clientWidth||t.offsetWidth||360),height:Math.max(260,t.clientHeight||t.offsetHeight||330)}),{width:n,height:o}=i();if(!Oe()){le(t,e,n,o),S("warning","WebGL is disabled, showing 2D preview");return}const g=Math.min(window.devicePixelRatio||1,2);t.width=n*g,t.height=o*g;let p;try{p=new d.WebGLRenderer({canvas:t,antialias:!0,alpha:!1,preserveDrawingBuffer:!0})}catch(u){console.warn("[BuildFarm] WebGL unavailable, using 2D fallback:",u.message),le(t,e,n,o),S("warning","WebGL is disabled, showing 2D preview");return}p.setPixelRatio(g),p.setSize(n,o),p.shadowMap.enabled=!0,p.shadowMap.type=d.PCFShadowMap,p.outputColorSpace=d.SRGBColorSpace,p.toneMapping=d.ACESFilmicToneMapping;const s=new d.Scene;s.background=new d.Color(r==="gamified"?1581626:1053725),s.fog=new d.FogExp2(r==="gamified"?1581626:1053725,.028);const x=new d.PerspectiveCamera(46,n/o,.1,80);x.position.set(3.3,2.25,3.7),s.add(new d.AmbientLight(r==="gamified"?7902463:4346223,1.55));const w=new d.DirectionalLight(16777215,r==="gamified"?3.4:2.3);w.position.set(5,8,5),w.castShadow=!0,w.shadow.mapSize.set(1024,1024),s.add(w);const{tiers:M,slotsPerTier:$}=e,m=e.shape==="channel"?.34:e.shape==="wall"?.36:e.shape==="column"?.46:.42,v=$*m+.1,b=e.shape==="wall"?.34:e.shape==="column"?1:r==="gamified"?.72:.58,k=e.tiers>=5?.54:.66,I=M*k,A=new d.MeshStandardMaterial({color:r==="gamified"?1911634:1448740,roughness:.9,metalness:.02}),L=new d.Mesh(new d.PlaneGeometry(9,9),A);L.rotation.x=-Math.PI/2,L.receiveShadow=!0,s.add(L);const ke=new d.MeshStandardMaterial({color:r==="gamified"?5995770:5859452,roughness:.3,metalness:.75}),Me=new d.MeshStandardMaterial({color:r==="gamified"?8246268:7372944,roughness:.42,metalness:.55}),$e=new d.MeshStandardMaterial({color:r==="gamified"?16436245:10980346,emissive:r==="gamified"?8736014:5972406,emissiveIntensity:r==="gamified"?.45:.2,roughness:.5}),Ie=new d.BoxGeometry(.045,I,.045);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([u,h])=>{const C=new d.Mesh(Ie,ke);C.position.set(u*v/2,I/2,h*b/2),C.castShadow=!0,s.add(C)});const V=[];f.forEach(u=>{for(let h=0;h<u.slots;h++)V.push(u)});for(let u=0;u<M;u++){const h=u*k,C=new d.Mesh(new d.BoxGeometry(v,.035,b),Me);C.position.set(0,h+.018,0),C.castShadow=!0,C.receiveShadow=!0,s.add(C);const X=new d.Mesh(new d.BoxGeometry(v*.86,.018,.035),$e);X.position.set(0,h+k-.07,-b/2+.06),s.add(X);const Z=new d.PointLight(r==="gamified"?16436245:10980346,.75,1.4);Z.position.set(0,h+k*.7,0),s.add(Z);for(let E=0;E<$;E++){const ee=u*$+E,te=V[ee],ae=(E-($-1)/2)*m,ne=0,ie=h+.05;if(!te){const oe=new d.Mesh(new d.CylinderGeometry(.07,.07,.018,r==="gamified"?6:16),new d.MeshStandardMaterial({color:2371652,transparent:!0,opacity:.58,roughness:.9}));oe.position.set(ae,ie,ne),s.add(oe);continue}De(d,s,te,ae,ie,ne,ee)}}r==="gamified"&&Ne(d,s,v,I);const P=new Le(x,p.domElement);P.enableDamping=!0,P.dampingFactor=.07,P.target.set(0,I*.42,0),P.minDistance=1.7,P.maxDistance=8,P.maxPolarAngle=Math.PI*.82,P.autoRotate=!0,P.autoRotateSpeed=r==="gamified"?1:.55,P.addEventListener("start",()=>{P.autoRotate=!1});const J=new ResizeObserver(()=>{const{width:u,height:h}=i();x.aspect=u/h,x.updateProjectionMatrix(),p.setSize(u,h,!1)});J.observe(t);let K;const Q=()=>{K=requestAnimationFrame(Q),P.update(),p.render(s,x)};Q(),F=()=>{cancelAnimationFrame(K),J.disconnect(),P.dispose(),s.traverse(u=>{u.geometry&&u.geometry.dispose(),u.material&&(Array.isArray(u.material)?u.material.forEach(h=>h.dispose()):u.material.dispose())}),p.dispose()}}function De(e,t,a,i,n,o,g){const p=r==="gamified"?[4906624,2282478,16436245,16478597,10980346]:[2278750,1483594,6660877,1409085,8843180],s=p[g%p.length],x=new e.MeshStandardMaterial({color:r==="gamified"?16347926:8141549,roughness:.68}),w=new e.Mesh(new e.CylinderGeometry(.07,.058,.07,r==="gamified"?6:16),x);w.position.set(i,n+.035,o),w.castShadow=!0,t.add(w);const M=new e.Mesh(new e.CylinderGeometry(.008,.008,.095,8),new e.MeshStandardMaterial({color:3560212,roughness:.82}));M.position.set(i,n+.105,o),t.add(M);const $=new e.MeshStandardMaterial({color:s,roughness:r==="gamified"?.48:.86,emissive:r==="gamified"?s:0,emissiveIntensity:r==="gamified"?.12:0}),m=r==="gamified"?5:3;for(let v=0;v<m;v++){const b=new e.Mesh(new e.SphereGeometry(.085,12,8),$),k=Math.PI*2/m*v;b.scale.set(1.25,.42,.7),b.position.set(i+Math.cos(k)*.05,n+.15+v%2*.016,o+Math.sin(k)*.045),b.rotation.set(.25,k,-.25),b.castShadow=!0,t.add(b)}}function Ne(e,t,a,i){const n=new e.MeshStandardMaterial({color:16436245,emissive:8736014,emissiveIntensity:.35,roughness:.35,metalness:.35});for(let o=0;o<5;o++){const g=new e.Mesh(new e.CylinderGeometry(.055,.055,.014,18),n);g.rotation.x=Math.PI/2,g.position.set((o-2)*a/5,i+.18+o%2*.08,-.42),t.add(g)}}function Oe(){try{const e=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(e.getContext("webgl2")||e.getContext("webgl")||e.getContext("experimental-webgl")))}catch{return!1}}function le(e,t,a,i){const n=e.getContext("2d");if(!n)return;const o=Math.min(window.devicePixelRatio||1,2);e.width=Math.floor(a*o),e.height=Math.floor(i*o),n.setTransform(o,0,0,o,0,0);const g=n.createLinearGradient(0,0,a,i);g.addColorStop(0,r==="gamified"?"#18223a":"#10141d"),g.addColorStop(1,r==="gamified"?"#25345d":"#1f2937"),n.fillStyle=g,n.fillRect(0,0,a,i);const p=[];f.forEach(m=>{for(let v=0;v<m.slots;v++)p.push(m)});const s=34,x=a-s*2,M=(i-68)/t.tiers,$=x/t.slotsPerTier;n.fillStyle="rgba(255,255,255,0.1)",n.beginPath(),n.ellipse(a*.5,i-24,x*.43,16,0,0,Math.PI*2),n.fill(),n.strokeStyle=r==="gamified"?"#7dd3fc":"#64748b",n.lineWidth=6,n.lineCap="round",n.beginPath(),n.moveTo(s+8,32),n.lineTo(s+8,i-45),n.moveTo(a-s-8,32),n.lineTo(a-s-8,i-45),n.stroke();for(let m=0;m<t.tiers;m++){const v=42+m*M;n.fillStyle=r==="gamified"?"#7dd3fc":"#708090",de(n,s,v+M*.56,x,9,5),n.fill(),n.fillStyle=r==="gamified"?"#facc15":"#a78bfa",de(n,s+x*.12,v+7,x*.76,5,3),n.fill();for(let b=0;b<t.slotsPerTier;b++){const k=m*t.slotsPerTier+b,I=p[k],A=s+$*(b+.5),L=v+M*.53;n.fillStyle=I?r==="gamified"?"#f97316":"#7c3aed":"rgba(148,163,184,0.35)",n.beginPath(),n.ellipse(A,L,13,7,0,0,Math.PI*2),n.fill(),I&&Re(n,A,L,I,k)}}if(r==="gamified"){n.fillStyle="#facc15";for(let m=0;m<5;m++)n.beginPath(),n.arc(a*.26+m*34,28+m%2*9,7,0,Math.PI*2),n.fill()}n.fillStyle="rgba(255,255,255,0.86)",n.font="700 12px Inter, system-ui, sans-serif",n.fillText(`${t.tiers} tiers · ${Math.min(p.length,t.total)}/${t.total} plants`,16,i-16)}function Re(e,t,a,i,n){const o=r==="gamified"?["#4ade80","#22d3ee","#facc15","#fb7185","#a78bfa"]:["#22c55e","#16a34a","#65a30d","#15803d","#86efac"],g=i.emoji==="🍅"?"#ef4444":i.emoji==="🌶️"?"#dc2626":o[n%o.length];e.strokeStyle="#365314",e.lineWidth=2,e.beginPath(),e.moveTo(t,a-5),e.lineTo(t,a-25),e.stroke(),e.fillStyle=g;for(let p=0;p<5;p++){const s=Math.PI*2/5*p;e.save(),e.translate(t+Math.cos(s)*8,a-24+Math.sin(s)*5),e.rotate(s),e.beginPath(),e.ellipse(0,0,9,4,0,0,Math.PI*2),e.fill(),e.restore()}}function de(e,t,a,i,n,o){e.beginPath(),e.moveTo(t+o,a),e.lineTo(t+i-o,a),e.quadraticCurveTo(t+i,a,t+i,a+o),e.lineTo(t+i,a+n-o),e.quadraticCurveTo(t+i,a+n,t+i-o,a+n),e.lineTo(t+o,a+n),e.quadraticCurveTo(t,a+n,t,a+n-o),e.lineTo(t,a+o),e.quadraticCurveTo(t,a,t+o,a),e.closePath()}async function je(){if(y===1){if(!l.name.trim()){S("warning","Enter a field name");return}if(q(l.targetPlant).length===0){S("warning","Enter at least one plant for analysis");return}U(l.targetPlant),y=2,N();return}if(y===2){if(!c){S("warning","Add a field photo before generating 3D");return}f.length===0&&U(l.targetPlant||"Plant"),y=3,N();return}y===3&&await We()}function _e(){if(y===1){be();return}y-=1,N()}async function xe(e){R(),e&&S("info",e);try{(await Ce(()=>import("./FarmListPage-DvljYx5N.js"),__vite__mapDeps([0,1,2,3]))).render()}catch(t){console.error("[BuildFarm] Direct FarmList fallback failed:",t),window.location.reload()}}function be(){xe("New field creation cancelled")}async function We(){const e=document.getElementById("bfNext");e&&(e.disabled=!0,e.textContent="Creating...");const t=Pe(),a={name:l.name.trim(),location:l.location.trim(),rackType:l.rackType,targetPlant:l.targetPlant.trim(),analysisGoal:l.analysisGoal,viewMode:r,photoPreview:(c==null?void 0:c.dataUrl)||null,plants:f};try{await fetch(`${fe}/api/farms/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})}catch(o){console.warn("[BuildFarm] create field API unavailable:",o.message)}const i=Ue(),n={id:`field_${Date.now()}`,name:a.name,location:a.location,zone:l.location.trim()||String.fromCharCode(65+i.length%26),rackTypeId:l.rackType,rackType:t.label,rackLabel:t.label,targetPlant:a.targetPlant,analysisGoal:a.analysisGoal,viewMode:r,photoPreview:a.photoPreview,plants:f.map(o=>({...o})),plantSlots:Se(),createdAt:new Date().toISOString()};i.push(n),localStorage.setItem(pe,JSON.stringify(i)),z.newFarm=a,z.currentFarm=n,z.currentFarmId=n.id,z.farmName=n.name,S("success",`"${n.name}" field created`),R(),setTimeout(()=>xe(),500)}function ce(){const e=document.getElementById("manualPlantInput");if(!e)return;const t=e.value.trim();t&&(he([ye(t,3,0,"manual")]),e.value="",O(),S("success",`${t} added`))}function q(e){const t=new Set;return String(e||"").split(/[,;\n]+/).map(a=>a.trim()).filter(Boolean).filter(a=>{const i=a.toLowerCase();return t.has(i)?!1:(t.add(i),!0)})}function U(e){const t=q(e),a=new Set(t.map(i=>i.toLowerCase().replace(/\s+/g,"_")));f=f.filter(i=>i.source!=="target"||a.has(i.species)),t.slice().reverse().forEach(i=>{const n=ye(i,4,0,"target");f.find(g=>g.species===n.species)||f.unshift(n)})}function he(e){e.forEach(t=>{const a=we(t),i=f.find(n=>n.species===a.species);i?(i.slots=Math.max(i.slots,a.slots),i.confidence=Math.max(i.confidence||0,a.confidence||0),i.source=a.source||i.source):f.push(a)})}function ye(e,t=3,a=0,i="target"){const n=String(e||"").toLowerCase().trim();return we({name:n.charAt(0).toUpperCase()+n.slice(1),emoji:Y(n),species:n.replace(/\s+/g,"_"),confidence:a,slots:t,source:i})}function Y(e=""){const t=String(e).toLowerCase().replace(/_/g," ");if(B[t])return B[t];const a=Object.keys(B).find(i=>t.includes(i));return a?B[a]:"🌱"}function we(e){const t=e.name||"Plant",a=(e.species||t).toLowerCase().trim().replace(/\s+/g,"_");return{name:t,emoji:e.emoji||Y(a),species:a,confidence:Math.max(0,Math.min(1,Number(e.confidence)||0)),slots:Math.max(1,Math.min(40,Number.parseInt(e.slots,10)||3)),source:e.source||"ai"}}function Pe(){return W.find(e=>e.id===l.rackType)||W[0]}function Se(){return f.reduce((e,t)=>e+t.slots,0)}function He(e){var t;return((t=ue.find(a=>a.id===e))==null?void 0:t.label)||e}function _(e,t){const a=document.getElementById(e);a&&(a.addEventListener("input",i=>t(i.target.value)),a.addEventListener("focus",()=>{a.style.borderColor="var(--accent)"}),a.addEventListener("blur",()=>{a.style.borderColor="var(--border)"}))}function Ue(){try{return JSON.parse(localStorage.getItem(pe))||[]}catch{return[]}}function R(){F&&(F(),F=null)}function T(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{Je as render};
