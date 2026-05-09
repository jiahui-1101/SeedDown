import{s as de,a as P,A as E}from"./index-BM_CIG_p.js";import*as s from"https://esm.sh/three@0.160.0";import{OrbitControls as ke}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const le="user_farms",ce=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let h=1,f=null,r="realistic",G=null,D=!1,d={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},m=[];const W=[{id:"3-tier",label:"3-Tier Vertical",icon:"III",tiers:3,slotsPerTier:3,total:9},{id:"5-tier",label:"5-Tier Tower",icon:"V",tiers:5,slotsPerTier:4,total:20},{id:"wall",label:"Wall Panel",icon:"GRID",tiers:4,slotsPerTier:5,total:20}],pe=[{id:"yield",label:"Yield"},{id:"health",label:"Health"},{id:"space",label:"Space fit"}],fe={lettuce:"🥬",spinach:"🌿",basil:"🌿",tomato:"🍅",carrot:"🥕",cabbage:"🥬",eggplant:"🍆",mint:"🌿",kale:"🥬",cucumber:"🥒",pepper:"🌶️",chili:"🌶️",strawberry:"🍓",bean:"🫘",pea:"🟢",chard:"🥬",arugula:"🌿",radish:"🌱",cilantro:"🌿",parsley:"🌿"};function Oe(){h=1,f=null,r="realistic",D=!1,d={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},m=[],O();const t=document.getElementById("screenContainer");t.innerHTML=`
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
    `,document.getElementById("bfBack").addEventListener("click",Ee),document.getElementById("bfNext").addEventListener("click",ze),N()}function N(){Pe();const t=document.getElementById("bfContent"),e=document.getElementById("bfNext");t.innerHTML="",O(),h===1&&(U(t),e.textContent="Next: Add Photo"),h===2&&(ue(t),e.textContent="Generate 3D Preview"),h===3&&(ge(t),e.textContent="Create Field")}function Pe(){const t=["Plant","Photo","3D"];document.getElementById("bfSteps").innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-bottom:10px;">
            ${t.map((e,a)=>{const o=a+1<=h;return`
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${o?"var(--accent)":"var(--border)"};
                                    color:${o?"#fff":"var(--muted)"};
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
                ${j("fieldNameInput","Field name","e.g. Balcony Mint Trial",d.name)}
                ${j("fieldLocationInput","Location / zone","e.g. Rack A, balcony, lab corner",d.location)}
                ${j("targetPlantInput","Plant for analysis","e.g. basil, lettuce, tomato",d.targetPlant)}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS GOAL</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${pe.map(e=>`
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
                    ${W.map(e=>Me(e)).join("")}
                </div>
            </section>
        </div>
    `,R("fieldNameInput",e=>{d.name=e}),R("fieldLocationInput",e=>{d.location=e}),R("targetPlantInput",e=>{d.targetPlant=e,q(e)}),document.querySelectorAll(".analysis-goal").forEach(e=>{e.addEventListener("click",()=>{d.analysisGoal=e.dataset.id,U(t)})}),document.querySelectorAll(".rack-opt").forEach(e=>{e.addEventListener("click",()=>{d.rackType=e.dataset.id,U(t)})})}function j(t,e,a,o){return`
        <label style="display:block;margin-bottom:10px;">
            <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">${e}</span>
            <input id="${t}" type="text" value="${L(o)}" placeholder="${a}"
                style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;
                       background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
        </label>
    `}function Me(t){const e=d.rackType===t.id;return`
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
    `}function ue(t){t.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FIELD PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture the vertical setup so the preview can match the real field.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${f?"READY":"NEEDED"}</div>
                </div>

                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${f?"var(--accent)":"var(--border)"};
                            background:${f?`url(${f.dataUrl}) center/cover`:"var(--surface2)"};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${f?`
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
                        <div id="scanStatus" style="font-size:11px;color:var(--muted);margin-top:3px;">${f?"Ready to scan or edit manually":"Add a photo, or continue with manual plants"}</div>
                    </div>
                    <button id="scanBtn" ${f?"":"disabled"}
                        style="padding:7px 10px;border-radius:20px;border:1px solid ${f?"var(--accent)":"var(--border)"};
                               background:${f?"var(--accent-l)":"var(--surface2)"};
                               color:${f?"var(--accent)":"var(--muted)"};
                               font-size:11px;font-weight:800;cursor:${f?"pointer":"not-allowed"};">
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
    `,F(),$e(t),document.getElementById("scanBtn").addEventListener("click",ne),document.getElementById("manualAddBtn").addEventListener("click",se),document.getElementById("manualPlantInput").addEventListener("keypress",e=>{e.key==="Enter"&&se()}),f&&!D&&(D=!0,ne())}function $e(t){const e=document.getElementById("photoInput");document.getElementById("photoPreview").addEventListener("click",()=>e.click()),document.getElementById("cameraBtn").addEventListener("click",()=>{e.setAttribute("capture","environment"),e.click()}),document.getElementById("galleryBtn").addEventListener("click",()=>{e.removeAttribute("capture"),e.click()}),e.addEventListener("change",a=>{const o=a.target.files[0];if(!o)return;const n=new FileReader;n.onload=i=>{var M;const c=i.target.result,[l,p]=c.split(","),b=((M=l.match(/:(.*?);/))==null?void 0:M[1])||"image/jpeg";f={base64:p,mediaType:b,dataUrl:c},D=!1,ue(t)},n.readAsDataURL(o)})}function F(){const t=document.getElementById("plantList");if(t){if(m.length===0){t.innerHTML=`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;">
                No plants yet. Add the target plant or scan a photo.
            </div>
        `;return}t.innerHTML=m.map((e,a)=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:26px;line-height:1;flex-shrink:0;">${e.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${L(e.name)}</div>
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
    `).join(""),t.querySelectorAll("button[data-action]").forEach(e=>{e.addEventListener("click",()=>{const a=Number(e.dataset.idx),o=e.dataset.action;o==="inc"&&(m[a].slots=Math.min(40,m[a].slots+1)),o==="dec"&&(m[a].slots=Math.max(1,m[a].slots-1)),o==="remove"&&m.splice(a,1),F()})})}}async function ne(){if(!f){P("warning","Add a field photo first");return}const t=document.getElementById("scanBtn"),e=document.getElementById("scanStatus");t&&(t.textContent="Scanning...",t.disabled=!0),e&&(e.textContent="AI is checking the field photo...");try{const o=await(await fetch(`${ce}/api/farms/scan-plants`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:f.base64,mediaType:f.mediaType,targetPlant:d.targetPlant})})).json(),n=Array.isArray(o.plants)?o.plants:[];n.length?(me(n),P("success",`${n.length} plant type${n.length>1?"s":""} detected`),e&&(e.textContent="Review and adjust slots before generating 3D.")):(e&&(e.textContent=o.warning||"No clear plant detected. Manual list is still usable."),P("info","No plant detected from photo yet"))}catch{e&&(e.textContent="Photo scan unavailable. Manual plant list is ready."),P("warning","AI scan unavailable, continue manually")}finally{t&&(t.textContent="Scan Photo",t.disabled=!1),F()}}function ge(t){var n;const e=be(),a=he(),o=d.targetPlant.trim()||((n=m[0])==null?void 0:n.name)||"Plant";t.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px;font-weight:900;">${L(o)} Vertical 3D</div>
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
                    ${f?`
                        <img src="${f.dataUrl}" alt="Field source photo"
                             style="position:absolute;right:10px;bottom:10px;width:70px;height:70px;border-radius:10px;
                                    object-fit:cover;border:2px solid rgba(255,255,255,.45);box-shadow:0 8px 20px rgba(0,0,0,.22);">
                    `:""}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS SNAPSHOT</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    ${B("Target plant",o)}
                    ${B("Goal",Ge(d.analysisGoal))}
                    ${B("Structure",e.label)}
                    ${B("Slots",`${a}/${e.total}`,a>e.total?"var(--danger)":"var(--ok)")}
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                    ${m.map(i=>`
                        <span style="padding:5px 9px;border-radius:20px;background:var(--ok-bg);color:var(--ok);font-size:12px;font-weight:800;">
                            ${i.emoji} ${L(i.name)} ×${i.slots}
                        </span>
                    `).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".view-toggle").forEach(i=>{i.addEventListener("click",()=>{r=i.dataset.mode,ge(t)})}),setTimeout(()=>Ie(e),100)}function oe(t){return["border:none","border-radius:8px","padding:7px 10px","font-size:11px","font-weight:900","cursor:pointer",`background:${t?"var(--accent)":"transparent"}`,`color:${t?"#fff":"var(--muted)"}`].join(";")}function B(t,e,a="var(--text)"){return`
        <div style="border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);min-height:62px;">
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-bottom:5px;">${t}</div>
            <div style="font-size:13px;color:${a};font-weight:900;line-height:1.25;">${L(String(e))}</div>
        </div>
    `}async function Ie(t){const e=document.getElementById("farmCanvas3D"),a=document.getElementById("canvas3DOverlay");if(!e)return;a&&(a.style.display="none");const o=330,n=Math.max(320,e.offsetWidth||360);if(!Le()){ie(e,t,n,o),P("warning","WebGL is disabled, showing 2D preview");return}const i=Math.min(window.devicePixelRatio||1,2);e.width=n*i,e.height=o*i;let c;try{c=new s.WebGLRenderer({canvas:e,antialias:!0,alpha:!1,preserveDrawingBuffer:!0})}catch(u){console.warn("[BuildFarm] WebGL unavailable, using 2D fallback:",u.message),ie(e,t,n,o),P("warning","WebGL is disabled, showing 2D preview");return}c.setPixelRatio(i),c.setSize(n,o),c.shadowMap.enabled=!0,c.shadowMap.type=s.PCFShadowMap,c.outputColorSpace=s.SRGBColorSpace,c.toneMapping=s.ACESFilmicToneMapping;const l=new s.Scene;l.background=new s.Color(r==="gamified"?1581626:1053725),l.fog=new s.FogExp2(r==="gamified"?1581626:1053725,.028);const p=new s.PerspectiveCamera(46,n/o,.1,80);p.position.set(3.3,2.25,3.7),l.add(new s.AmbientLight(r==="gamified"?7902463:4346223,1.55));const b=new s.DirectionalLight(16777215,r==="gamified"?3.4:2.3);b.position.set(5,8,5),b.castShadow=!0,b.shadow.mapSize.set(1024,1024),l.add(b);const{tiers:M,slotsPerTier:w}=t,I=.42,g=w*I+.1,v=r==="gamified"?.72:.58,x=.66,S=M*x,C=new s.MeshStandardMaterial({color:r==="gamified"?1911634:1448740,roughness:.9,metalness:.02}),T=new s.Mesh(new s.PlaneGeometry(9,9),C);T.rotation.x=-Math.PI/2,T.receiveShadow=!0,l.add(T);const A=new s.MeshStandardMaterial({color:r==="gamified"?5995770:5859452,roughness:.3,metalness:.75}),ye=new s.MeshStandardMaterial({color:r==="gamified"?8246268:7372944,roughness:.42,metalness:.55}),we=new s.MeshStandardMaterial({color:r==="gamified"?16436245:10980346,emissive:r==="gamified"?8736014:5972406,emissiveIntensity:r==="gamified"?.45:.2,roughness:.5}),Se=new s.BoxGeometry(.045,S,.045);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([u,k])=>{const $=new s.Mesh(Se,A);$.position.set(u*g/2,S/2,k*v/2),$.castShadow=!0,l.add($)});const _=[];m.forEach(u=>{for(let k=0;k<u.slots;k++)_.push(u)});for(let u=0;u<M;u++){const k=u*x,$=new s.Mesh(new s.BoxGeometry(g,.035,v),ye);$.position.set(0,k+.018,0),$.castShadow=!0,$.receiveShadow=!0,l.add($);const V=new s.Mesh(new s.BoxGeometry(g*.86,.018,.035),we);V.position.set(0,k+x-.07,-v/2+.06),l.add(V);const K=new s.PointLight(r==="gamified"?16436245:10980346,.75,1.4);K.position.set(0,k+x*.7,0),l.add(K);for(let z=0;z<w;z++){const Q=u*w+z,X=_[Q],Z=(z-(w-1)/2)*I,ee=0,te=k+.05;if(!X){const ae=new s.Mesh(new s.CylinderGeometry(.07,.07,.018,r==="gamified"?6:16),new s.MeshStandardMaterial({color:2371652,transparent:!0,opacity:.58,roughness:.9}));ae.position.set(Z,te,ee),l.add(ae);continue}Te(s,l,X,Z,te,ee,Q)}}r==="gamified"&&Ce(s,l,g,S);const y=new ke(p,c.domElement);y.enableDamping=!0,y.dampingFactor=.07,y.target.set(0,S*.42,0),y.minDistance=1.7,y.maxDistance=8,y.maxPolarAngle=Math.PI*.82,y.autoRotate=!0,y.autoRotateSpeed=r==="gamified"?1:.55,y.addEventListener("start",()=>{y.autoRotate=!1});const Y=new ResizeObserver(()=>{const u=Math.max(320,e.offsetWidth||n);p.aspect=u/o,p.updateProjectionMatrix(),c.setSize(u,o)});Y.observe(e);let H;const J=()=>{H=requestAnimationFrame(J),y.update(),c.render(l,p)};J(),G=()=>{cancelAnimationFrame(H),Y.disconnect(),y.dispose(),l.traverse(u=>{u.geometry&&u.geometry.dispose(),u.material&&(Array.isArray(u.material)?u.material.forEach(k=>k.dispose()):u.material.dispose())}),c.dispose()}}function Te(t,e,a,o,n,i,c){const l=r==="gamified"?[4906624,2282478,16436245,16478597,10980346]:[2278750,1483594,6660877,1409085,8843180],p=l[c%l.length],b=new t.MeshStandardMaterial({color:r==="gamified"?16347926:8141549,roughness:.68}),M=new t.Mesh(new t.CylinderGeometry(.07,.058,.07,r==="gamified"?6:16),b);M.position.set(o,n+.035,i),M.castShadow=!0,e.add(M);const w=new t.Mesh(new t.CylinderGeometry(.008,.008,.095,8),new t.MeshStandardMaterial({color:3560212,roughness:.82}));w.position.set(o,n+.105,i),e.add(w);const I=new t.MeshStandardMaterial({color:p,roughness:r==="gamified"?.48:.86,emissive:r==="gamified"?p:0,emissiveIntensity:r==="gamified"?.12:0}),g=r==="gamified"?5:3;for(let v=0;v<g;v++){const x=new t.Mesh(new t.SphereGeometry(.085,12,8),I),S=Math.PI*2/g*v;x.scale.set(1.25,.42,.7),x.position.set(o+Math.cos(S)*.05,n+.15+v%2*.016,i+Math.sin(S)*.045),x.rotation.set(.25,S,-.25),x.castShadow=!0,e.add(x)}}function Ce(t,e,a,o){const n=new t.MeshStandardMaterial({color:16436245,emissive:8736014,emissiveIntensity:.35,roughness:.35,metalness:.35});for(let i=0;i<5;i++){const c=new t.Mesh(new t.CylinderGeometry(.055,.055,.014,18),n);c.rotation.x=Math.PI/2,c.position.set((i-2)*a/5,o+.18+i%2*.08,-.42),e.add(c)}}function Le(){try{const t=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(t.getContext("webgl2")||t.getContext("webgl")||t.getContext("experimental-webgl")))}catch{return!1}}function ie(t,e,a,o){const n=t.getContext("2d");if(!n)return;const i=Math.min(window.devicePixelRatio||1,2);t.width=Math.floor(a*i),t.height=Math.floor(o*i),n.setTransform(i,0,0,i,0,0);const c=n.createLinearGradient(0,0,a,o);c.addColorStop(0,r==="gamified"?"#18223a":"#10141d"),c.addColorStop(1,r==="gamified"?"#25345d":"#1f2937"),n.fillStyle=c,n.fillRect(0,0,a,o);const l=[];m.forEach(g=>{for(let v=0;v<g.slots;v++)l.push(g)});const p=34,b=a-p*2,w=(o-68)/e.tiers,I=b/e.slotsPerTier;n.fillStyle="rgba(255,255,255,0.1)",n.beginPath(),n.ellipse(a*.5,o-24,b*.43,16,0,0,Math.PI*2),n.fill(),n.strokeStyle=r==="gamified"?"#7dd3fc":"#64748b",n.lineWidth=6,n.lineCap="round",n.beginPath(),n.moveTo(p+8,32),n.lineTo(p+8,o-45),n.moveTo(a-p-8,32),n.lineTo(a-p-8,o-45),n.stroke();for(let g=0;g<e.tiers;g++){const v=42+g*w;n.fillStyle=r==="gamified"?"#7dd3fc":"#708090",re(n,p,v+w*.56,b,9,5),n.fill(),n.fillStyle=r==="gamified"?"#facc15":"#a78bfa",re(n,p+b*.12,v+7,b*.76,5,3),n.fill();for(let x=0;x<e.slotsPerTier;x++){const S=g*e.slotsPerTier+x,C=l[S],T=p+I*(x+.5),A=v+w*.53;n.fillStyle=C?r==="gamified"?"#f97316":"#7c3aed":"rgba(148,163,184,0.35)",n.beginPath(),n.ellipse(T,A,13,7,0,0,Math.PI*2),n.fill(),C&&Ae(n,T,A,C,S)}}if(r==="gamified"){n.fillStyle="#facc15";for(let g=0;g<5;g++)n.beginPath(),n.arc(a*.26+g*34,28+g%2*9,7,0,Math.PI*2),n.fill()}n.fillStyle="rgba(255,255,255,0.86)",n.font="700 12px Inter, system-ui, sans-serif",n.fillText(`${e.tiers} tiers · ${Math.min(l.length,e.total)}/${e.total} plants`,16,o-16)}function Ae(t,e,a,o,n){const i=r==="gamified"?["#4ade80","#22d3ee","#facc15","#fb7185","#a78bfa"]:["#22c55e","#16a34a","#65a30d","#15803d","#86efac"],c=o.emoji==="🍅"?"#ef4444":o.emoji==="🌶️"?"#dc2626":i[n%i.length];t.strokeStyle="#365314",t.lineWidth=2,t.beginPath(),t.moveTo(e,a-5),t.lineTo(e,a-25),t.stroke(),t.fillStyle=c;for(let l=0;l<5;l++){const p=Math.PI*2/5*l;t.save(),t.translate(e+Math.cos(p)*8,a-24+Math.sin(p)*5),t.rotate(p),t.beginPath(),t.ellipse(0,0,9,4,0,0,Math.PI*2),t.fill(),t.restore()}}function re(t,e,a,o,n,i){t.beginPath(),t.moveTo(e+i,a),t.lineTo(e+o-i,a),t.quadraticCurveTo(e+o,a,e+o,a+i),t.lineTo(e+o,a+n-i),t.quadraticCurveTo(e+o,a+n,e+o-i,a+n),t.lineTo(e+i,a+n),t.quadraticCurveTo(e,a+n,e,a+n-i),t.lineTo(e,a+i),t.quadraticCurveTo(e,a,e+i,a),t.closePath()}async function ze(){if(h===1){if(!d.name.trim()){P("warning","Enter a field name");return}if(!d.targetPlant.trim()){P("warning","Enter the plant for analysis");return}q(d.targetPlant),h=2,N();return}if(h===2){if(!f){P("warning","Add a field photo before generating 3D");return}m.length===0&&q(d.targetPlant||"Plant"),h=3,N();return}h===3&&await Be()}function Ee(){if(h===1){O(),de("farmlist");return}h-=1,N()}async function Be(){const t=document.getElementById("bfNext");t&&(t.disabled=!0,t.textContent="Creating...");const e=be(),a={name:d.name.trim(),location:d.location.trim(),rackType:d.rackType,targetPlant:d.targetPlant.trim(),analysisGoal:d.analysisGoal,viewMode:r,photoPreview:(f==null?void 0:f.dataUrl)||null,plants:m};try{await fetch(`${ce}/api/farms/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})}catch(i){console.warn("[BuildFarm] create field API unavailable:",i.message)}const o=De(),n={id:`field_${Date.now()}`,name:a.name,location:a.location,zone:d.location.trim()||String.fromCharCode(65+o.length%26),rackTypeId:d.rackType,rackType:e.label,rackLabel:e.label,targetPlant:a.targetPlant,analysisGoal:a.analysisGoal,viewMode:r,photoPreview:a.photoPreview,plants:m.map(i=>({...i})),plantSlots:he(),createdAt:new Date().toISOString()};o.push(n),localStorage.setItem(le,JSON.stringify(o)),E.newFarm=a,E.currentFarm=n,E.currentFarmId=n.id,E.farmName=n.name,P("success",`"${n.name}" field created`),O(),setTimeout(()=>de("farmlist"),500)}function se(){const t=document.getElementById("manualPlantInput");if(!t)return;const e=t.value.trim();e&&(me([ve(e,3,0)]),t.value="",F(),P("success",`${e} added`))}function q(t){const e=t.trim();e&&(m.some(a=>a.name.toLowerCase()===e.toLowerCase())||m.unshift(ve(e,4,0)))}function me(t){t.forEach(e=>{const a=xe(e),o=m.find(n=>n.species===a.species);o?(o.slots=Math.max(o.slots,a.slots),o.confidence=Math.max(o.confidence||0,a.confidence||0)):m.push(a)})}function ve(t,e=3,a=0){const o=t.toLowerCase().trim();return xe({name:o.charAt(0).toUpperCase()+o.slice(1),emoji:fe[o]||"🌱",species:o.replace(/\s+/g,"_"),confidence:a,slots:e})}function xe(t){const e=t.name||"Plant",a=(t.species||e).toLowerCase().trim().replace(/\s+/g,"_");return{name:e,emoji:t.emoji||fe[a]||"🌱",species:a,confidence:Math.max(0,Math.min(1,Number(t.confidence)||0)),slots:Math.max(1,Math.min(40,Number.parseInt(t.slots,10)||3))}}function be(){return W.find(t=>t.id===d.rackType)||W[0]}function he(){return m.reduce((t,e)=>t+e.slots,0)}function Ge(t){var e;return((e=pe.find(a=>a.id===t))==null?void 0:e.label)||t}function R(t,e){const a=document.getElementById(t);a&&(a.addEventListener("input",o=>e(o.target.value)),a.addEventListener("focus",()=>{a.style.borderColor="var(--accent)"}),a.addEventListener("blur",()=>{a.style.borderColor="var(--border)"}))}function De(){try{return JSON.parse(localStorage.getItem(le))||[]}catch{return[]}}function O(){G&&(G(),G=null)}function L(t){return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{Oe as render};
