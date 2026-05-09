import{s as oe,a as y,A as z}from"./index-DYDVqnDN.js";import*as i from"https://esm.sh/three@0.160.0";import{OrbitControls as we}from"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const ie="user_farms",re=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let g=1,l=null,r="realistic",E=null,B=!1,s={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},u=[];const j=[{id:"3-tier",label:"3-Tier Vertical",icon:"III",tiers:3,slotsPerTier:3,total:9},{id:"5-tier",label:"5-Tier Tower",icon:"V",tiers:5,slotsPerTier:4,total:20},{id:"wall",label:"Wall Panel",icon:"GRID",tiers:4,slotsPerTier:5,total:20}],se=[{id:"yield",label:"Yield"},{id:"health",label:"Health"},{id:"space",label:"Space fit"}],de={lettuce:"🥬",spinach:"🌿",basil:"🌿",tomato:"🍅",carrot:"🥕",cabbage:"🥬",eggplant:"🍆",mint:"🌿",kale:"🥬",cucumber:"🥒",pepper:"🌶️",chili:"🌶️",strawberry:"🍓",bean:"🫘",pea:"🟢",chard:"🥬",arugula:"🌿",radish:"🌱",cilantro:"🌿",parsley:"🌿"};function Ge(){g=1,l=null,r="realistic",B=!1,s={name:"",location:"",targetPlant:"",analysisGoal:"yield",rackType:"3-tier"},u=[],D();const t=document.getElementById("screenContainer");t.innerHTML=`
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
    `,document.getElementById("bfBack").addEventListener("click",Le),document.getElementById("bfNext").addEventListener("click",Ae),T()}function T(){ke();const t=document.getElementById("bfContent"),e=document.getElementById("bfNext");t.innerHTML="",D(),g===1&&(R(t),e.textContent="Next: Add Photo"),g===2&&(le(t),e.textContent="Generate 3D Preview"),g===3&&(ce(t),e.textContent="Create Field")}function ke(){const t=["Plant","Photo","3D"];document.getElementById("bfSteps").innerHTML=`
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-bottom:10px;">
            ${t.map((e,a)=>{const n=a+1<=g;return`
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div style="width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                                    background:${n?"var(--accent)":"var(--border)"};
                                    color:${n?"#fff":"var(--muted)"};
                                    font-size:11px;font-weight:800;flex-shrink:0;">
                            ${a+1<g?"✓":a+1}
                        </div>
                        <div style="font-size:11px;font-weight:800;color:${a+1===g?"var(--accent)":"var(--muted)"};">
                            ${e}
                        </div>
                    </div>
                `}).join("")}
        </div>
    `}function R(t){t.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">FIELD SETUP</div>
                ${F("fieldNameInput","Field name","e.g. Balcony Mint Trial",s.name)}
                ${F("fieldLocationInput","Location / zone","e.g. Rack A, balcony, lab corner",s.location)}
                ${F("targetPlantInput","Plant for analysis","e.g. basil, lettuce, tomato",s.targetPlant)}
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS GOAL</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${se.map(e=>`
                        <button class="analysis-goal" data-id="${e.id}"
                            style="padding:10px 8px;border-radius:10px;border:1.5px solid ${s.analysisGoal===e.id?"var(--accent)":"var(--border)"};
                                   background:${s.analysisGoal===e.id?"var(--accent-l)":"var(--surface2)"};
                                   color:${s.analysisGoal===e.id?"var(--accent)":"var(--text)"};
                                   font-size:12px;font-weight:800;cursor:pointer;">
                            ${e.label}
                        </button>
                    `).join("")}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">VERTICAL STRUCTURE</div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${j.map(e=>Se(e)).join("")}
                </div>
            </section>
        </div>
    `,O("fieldNameInput",e=>{s.name=e}),O("fieldLocationInput",e=>{s.location=e}),O("targetPlantInput",e=>{s.targetPlant=e,U(e)}),document.querySelectorAll(".analysis-goal").forEach(e=>{e.addEventListener("click",()=>{s.analysisGoal=e.dataset.id,R(t)})}),document.querySelectorAll(".rack-opt").forEach(e=>{e.addEventListener("click",()=>{s.rackType=e.dataset.id,R(t)})})}function F(t,e,a,n){return`
        <label style="display:block;margin-bottom:10px;">
            <span style="display:block;font-size:11px;font-weight:800;color:var(--sub);margin-bottom:5px;">${e}</span>
            <input id="${t}" type="text" value="${I(n)}" placeholder="${a}"
                style="width:100%;padding:11px 12px;border:1.5px solid var(--border);border-radius:10px;
                       background:var(--surface2);color:var(--text);font-size:14px;outline:none;">
        </label>
    `}function Se(t){const e=s.rackType===t.id;return`
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
    `}function le(t){t.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;">FIELD PHOTO</div>
                        <div style="font-size:12px;color:var(--muted);margin-top:4px;">Capture the vertical setup so the preview can match the real field.</div>
                    </div>
                    <div style="font-size:11px;font-weight:800;color:var(--accent);white-space:nowrap;">${l?"READY":"NEEDED"}</div>
                </div>

                <div id="photoPreview"
                     style="width:100%;height:220px;border-radius:12px;border:2px dashed ${l?"var(--accent)":"var(--border)"};
                            background:${l?`url(${l.dataUrl}) center/cover`:"var(--surface2)"};
                            display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                    ${l?`
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
                        <div id="scanStatus" style="font-size:11px;color:var(--muted);margin-top:3px;">${l?"Ready to scan or edit manually":"Add a photo, or continue with manual plants"}</div>
                    </div>
                    <button id="scanBtn" ${l?"":"disabled"}
                        style="padding:7px 10px;border-radius:20px;border:1px solid ${l?"var(--accent)":"var(--border)"};
                               background:${l?"var(--accent-l)":"var(--surface2)"};
                               color:${l?"var(--accent)":"var(--muted)"};
                               font-size:11px;font-weight:800;cursor:${l?"pointer":"not-allowed"};">
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
    `,G(),$e(t),document.getElementById("scanBtn").addEventListener("click",te),document.getElementById("manualAddBtn").addEventListener("click",ne),document.getElementById("manualPlantInput").addEventListener("keypress",e=>{e.key==="Enter"&&ne()}),l&&!B&&(B=!0,te())}function $e(t){const e=document.getElementById("photoInput");document.getElementById("photoPreview").addEventListener("click",()=>e.click()),document.getElementById("cameraBtn").addEventListener("click",()=>{e.setAttribute("capture","environment"),e.click()}),document.getElementById("galleryBtn").addEventListener("click",()=>{e.removeAttribute("capture"),e.click()}),e.addEventListener("change",a=>{const n=a.target.files[0];if(!n)return;const o=new FileReader;o.onload=d=>{var h;const c=d.target.result,[p,v]=c.split(","),w=((h=p.match(/:(.*?);/))==null?void 0:h[1])||"image/jpeg";l={base64:v,mediaType:w,dataUrl:c},B=!1,le(t)},o.readAsDataURL(n)})}function G(){const t=document.getElementById("plantList");if(t){if(u.length===0){t.innerHTML=`
            <div style="padding:22px;border:1px dashed var(--border);border-radius:12px;background:var(--surface2);text-align:center;color:var(--muted);font-size:13px;">
                No plants yet. Add the target plant or scan a photo.
            </div>
        `;return}t.innerHTML=u.map((e,a)=>`
        <div style="display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px;">
            <div style="font-size:26px;line-height:1;flex-shrink:0;">${e.emoji}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${I(e.name)}</div>
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
    `).join(""),t.querySelectorAll("button[data-action]").forEach(e=>{e.addEventListener("click",()=>{const a=Number(e.dataset.idx),n=e.dataset.action;n==="inc"&&(u[a].slots=Math.min(40,u[a].slots+1)),n==="dec"&&(u[a].slots=Math.max(1,u[a].slots-1)),n==="remove"&&u.splice(a,1),G()})})}}async function te(){if(!l){y("warning","Add a field photo first");return}const t=document.getElementById("scanBtn"),e=document.getElementById("scanStatus");t&&(t.textContent="Scanning...",t.disabled=!0),e&&(e.textContent="AI is checking the field photo...");try{const n=await(await fetch(`${re}/api/farms/scan-plants`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:l.base64,mediaType:l.mediaType})})).json(),o=Array.isArray(n.plants)?n.plants:[];o.length?(pe(o),y("success",`${o.length} plant type${o.length>1?"s":""} detected`),e&&(e.textContent="Review and adjust slots before generating 3D.")):(e&&(e.textContent=n.warning||"No clear plant detected. Manual list is still usable."),y("info","No plant detected from photo yet"))}catch{e&&(e.textContent="Photo scan unavailable. Manual plant list is ready."),y("warning","AI scan unavailable, continue manually")}finally{t&&(t.textContent="Scan Photo",t.disabled=!1),G()}}function ce(t){var o;const e=ge(),a=me(),n=s.targetPlant.trim()||((o=u[0])==null?void 0:o.name)||"Plant";t.innerHTML=`
        <div style="display:flex;flex-direction:column;gap:14px;">
            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);">
                <div style="padding:12px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px;font-weight:900;">${I(n)} Vertical 3D</div>
                        <div style="font-size:11px;color:var(--muted);margin-top:2px;">Drag to orbit · Toggle for gamified view</div>
                    </div>
                    <div style="display:flex;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:3px;flex-shrink:0;">
                        <button class="view-toggle" data-mode="realistic"
                            style="${ae(r==="realistic")}">Real</button>
                        <button class="view-toggle" data-mode="gamified"
                            style="${ae(r==="gamified")}">Game</button>
                    </div>
                </div>
                <div style="position:relative;background:#10141d;">
                    <canvas id="farmCanvas3D" style="width:100%;height:330px;display:block;"></canvas>
                    <div id="canvas3DOverlay"
                         style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                                background:rgba(16,20,29,.74);color:rgba(255,255,255,.78);font-size:13px;">
                        Building 3D field...
                    </div>
                    ${l?`
                        <img src="${l.dataUrl}" alt="Field source photo"
                             style="position:absolute;right:10px;bottom:10px;width:70px;height:70px;border-radius:10px;
                                    object-fit:cover;border:2px solid rgba(255,255,255,.45);box-shadow:0 8px 20px rgba(0,0,0,.22);">
                    `:""}
                </div>
            </section>

            <section style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;box-shadow:var(--shadow-sm);">
                <div style="font-size:10px;font-weight:800;color:var(--sub);letter-spacing:.08em;margin-bottom:12px;">ANALYSIS SNAPSHOT</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    ${C("Target plant",n)}
                    ${C("Goal",Ce(s.analysisGoal))}
                    ${C("Structure",e.label)}
                    ${C("Slots",`${a}/${e.total}`,a>e.total?"var(--danger)":"var(--ok)")}
                </div>
                <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
                    ${u.map(d=>`
                        <span style="padding:5px 9px;border-radius:20px;background:var(--ok-bg);color:var(--ok);font-size:12px;font-weight:800;">
                            ${d.emoji} ${I(d.name)} ×${d.slots}
                        </span>
                    `).join("")}
                </div>
            </section>
        </div>
    `,document.querySelectorAll(".view-toggle").forEach(d=>{d.addEventListener("click",()=>{r=d.dataset.mode,ce(t)})}),setTimeout(()=>Me(e),100)}function ae(t){return["border:none","border-radius:8px","padding:7px 10px","font-size:11px","font-weight:900","cursor:pointer",`background:${t?"var(--accent)":"transparent"}`,`color:${t?"#fff":"var(--muted)"}`].join(";")}function C(t,e,a="var(--text)"){return`
        <div style="border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);min-height:62px;">
            <div style="font-size:10px;color:var(--muted);font-weight:800;margin-bottom:5px;">${t}</div>
            <div style="font-size:13px;color:${a};font-weight:900;line-height:1.25;">${I(String(e))}</div>
        </div>
    `}async function Me(t){const e=document.getElementById("farmCanvas3D"),a=document.getElementById("canvas3DOverlay");if(!e)return;a&&(a.style.display="none");const n=330,o=Math.max(320,e.offsetWidth||360),d=Math.min(window.devicePixelRatio||1,2);e.width=o*d,e.height=n*d;const c=new i.WebGLRenderer({canvas:e,antialias:!0,alpha:!1,preserveDrawingBuffer:!0});c.setPixelRatio(d),c.setSize(o,n),c.shadowMap.enabled=!0,c.shadowMap.type=i.PCFShadowMap,c.outputColorSpace=i.SRGBColorSpace,c.toneMapping=i.ACESFilmicToneMapping;const p=new i.Scene;p.background=new i.Color(r==="gamified"?1581626:1053725),p.fog=new i.FogExp2(r==="gamified"?1581626:1053725,.028);const v=new i.PerspectiveCamera(46,o/n,.1,80);v.position.set(3.3,2.25,3.7),p.add(new i.AmbientLight(r==="gamified"?7902463:4346223,1.55));const w=new i.DirectionalLight(16777215,r==="gamified"?3.4:2.3);w.position.set(5,8,5),w.castShadow=!0,w.shadow.mapSize.set(1024,1024),p.add(w);const{tiers:h,slotsPerTier:M}=t,A=.42,P=M*A+.1,k=r==="gamified"?.72:.58,b=.66,S=h*b,xe=new i.MeshStandardMaterial({color:r==="gamified"?1911634:1448740,roughness:.9,metalness:.02}),N=new i.Mesh(new i.PlaneGeometry(9,9),xe);N.rotation.x=-Math.PI/2,N.receiveShadow=!0,p.add(N);const ve=new i.MeshStandardMaterial({color:r==="gamified"?5995770:5859452,roughness:.3,metalness:.75}),be=new i.MeshStandardMaterial({color:r==="gamified"?8246268:7372944,roughness:.42,metalness:.55}),he=new i.MeshStandardMaterial({color:r==="gamified"?16436245:10980346,emissive:r==="gamified"?8736014:5972406,emissiveIntensity:r==="gamified"?.45:.2,roughness:.5}),ye=new i.BoxGeometry(.045,S,.045);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([f,x])=>{const $=new i.Mesh(ye,ve);$.position.set(f*P/2,S/2,x*k/2),$.castShadow=!0,p.add($)});const _=[];u.forEach(f=>{for(let x=0;x<f.slots;x++)_.push(f)});for(let f=0;f<h;f++){const x=f*b,$=new i.Mesh(new i.BoxGeometry(P,.035,k),be);$.position.set(0,x+.018,0),$.castShadow=!0,$.receiveShadow=!0,p.add($);const H=new i.Mesh(new i.BoxGeometry(P*.86,.018,.035),he);H.position.set(0,x+b-.07,-k/2+.06),p.add(H);const J=new i.PointLight(r==="gamified"?16436245:10980346,.75,1.4);J.position.set(0,x+b*.7,0),p.add(J);for(let L=0;L<M;L++){const V=f*M+L,K=_[V],Q=(L-(M-1)/2)*A,X=0,Z=x+.05;if(!K){const ee=new i.Mesh(new i.CylinderGeometry(.07,.07,.018,r==="gamified"?6:16),new i.MeshStandardMaterial({color:2371652,transparent:!0,opacity:.58,roughness:.9}));ee.position.set(Q,Z,X),p.add(ee);continue}Pe(i,p,K,Q,Z,X,V)}}r==="gamified"&&Ie(i,p,P,S);const m=new we(v,c.domElement);m.enableDamping=!0,m.dampingFactor=.07,m.target.set(0,S*.42,0),m.minDistance=1.7,m.maxDistance=8,m.maxPolarAngle=Math.PI*.82,m.autoRotate=!0,m.autoRotateSpeed=r==="gamified"?1:.55,m.addEventListener("start",()=>{m.autoRotate=!1});const Y=new ResizeObserver(()=>{const f=Math.max(320,e.offsetWidth||o);v.aspect=f/n,v.updateProjectionMatrix(),c.setSize(f,n)});Y.observe(e);let W;const q=()=>{W=requestAnimationFrame(q),m.update(),c.render(p,v)};q(),E=()=>{cancelAnimationFrame(W),Y.disconnect(),m.dispose(),p.traverse(f=>{f.geometry&&f.geometry.dispose(),f.material&&(Array.isArray(f.material)?f.material.forEach(x=>x.dispose()):f.material.dispose())}),c.dispose()}}function Pe(t,e,a,n,o,d,c){const p=r==="gamified"?[4906624,2282478,16436245,16478597,10980346]:[2278750,1483594,6660877,1409085,8843180],v=p[c%p.length],w=new t.MeshStandardMaterial({color:r==="gamified"?16347926:8141549,roughness:.68}),h=new t.Mesh(new t.CylinderGeometry(.07,.058,.07,r==="gamified"?6:16),w);h.position.set(n,o+.035,d),h.castShadow=!0,e.add(h);const M=new t.Mesh(new t.CylinderGeometry(.008,.008,.095,8),new t.MeshStandardMaterial({color:3560212,roughness:.82}));M.position.set(n,o+.105,d),e.add(M);const A=new t.MeshStandardMaterial({color:v,roughness:r==="gamified"?.48:.86,emissive:r==="gamified"?v:0,emissiveIntensity:r==="gamified"?.12:0}),P=r==="gamified"?5:3;for(let k=0;k<P;k++){const b=new t.Mesh(new t.SphereGeometry(.085,12,8),A),S=Math.PI*2/P*k;b.scale.set(1.25,.42,.7),b.position.set(n+Math.cos(S)*.05,o+.15+k%2*.016,d+Math.sin(S)*.045),b.rotation.set(.25,S,-.25),b.castShadow=!0,e.add(b)}}function Ie(t,e,a,n){const o=new t.MeshStandardMaterial({color:16436245,emissive:8736014,emissiveIntensity:.35,roughness:.35,metalness:.35});for(let d=0;d<5;d++){const c=new t.Mesh(new t.CylinderGeometry(.055,.055,.014,18),o);c.rotation.x=Math.PI/2,c.position.set((d-2)*a/5,n+.18+d%2*.08,-.42),e.add(c)}}async function Ae(){if(g===1){if(!s.name.trim()){y("warning","Enter a field name");return}if(!s.targetPlant.trim()){y("warning","Enter the plant for analysis");return}U(s.targetPlant),g=2,T();return}if(g===2){if(!l){y("warning","Add a field photo before generating 3D");return}u.length===0&&U(s.targetPlant||"Plant"),g=3,T();return}g===3&&await ze()}function Le(){if(g===1){D(),oe("farmlist");return}g-=1,T()}async function ze(){const t=document.getElementById("bfNext");t&&(t.disabled=!0,t.textContent="Creating...");const e=ge(),a={name:s.name.trim(),location:s.location.trim(),rackType:s.rackType,targetPlant:s.targetPlant.trim(),analysisGoal:s.analysisGoal,viewMode:r,photoPreview:(l==null?void 0:l.dataUrl)||null,plants:u};try{await fetch(`${re}/api/farms/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})}catch(d){console.warn("[BuildFarm] create field API unavailable:",d.message)}const n=Ee(),o={id:`field_${Date.now()}`,name:a.name,location:a.location,zone:s.location.trim()||String.fromCharCode(65+n.length%26),rackTypeId:s.rackType,rackType:e.label,rackLabel:e.label,targetPlant:a.targetPlant,analysisGoal:a.analysisGoal,viewMode:r,photoPreview:a.photoPreview,plants:u.map(d=>({...d})),plantSlots:me(),createdAt:new Date().toISOString()};n.push(o),localStorage.setItem(ie,JSON.stringify(n)),z.newFarm=a,z.currentFarm=o,z.currentFarmId=o.id,z.farmName=o.name,y("success",`"${o.name}" field created`),D(),setTimeout(()=>oe("farmlist"),500)}function ne(){const t=document.getElementById("manualPlantInput");if(!t)return;const e=t.value.trim();e&&(pe([fe(e,3,0)]),t.value="",G(),y("success",`${e} added`))}function U(t){const e=t.trim();e&&(u.some(a=>a.name.toLowerCase()===e.toLowerCase())||u.unshift(fe(e,4,0)))}function pe(t){t.forEach(e=>{const a=ue(e),n=u.find(o=>o.species===a.species);n?(n.slots=Math.max(n.slots,a.slots),n.confidence=Math.max(n.confidence||0,a.confidence||0)):u.push(a)})}function fe(t,e=3,a=0){const n=t.toLowerCase().trim();return ue({name:n.charAt(0).toUpperCase()+n.slice(1),emoji:de[n]||"🌱",species:n.replace(/\s+/g,"_"),confidence:a,slots:e})}function ue(t){const e=t.name||"Plant",a=(t.species||e).toLowerCase().trim().replace(/\s+/g,"_");return{name:e,emoji:t.emoji||de[a]||"🌱",species:a,confidence:Math.max(0,Math.min(1,Number(t.confidence)||0)),slots:Math.max(1,Math.min(40,Number.parseInt(t.slots,10)||3))}}function ge(){return j.find(t=>t.id===s.rackType)||j[0]}function me(){return u.reduce((t,e)=>t+e.slots,0)}function Ce(t){var e;return((e=se.find(a=>a.id===t))==null?void 0:e.label)||t}function O(t,e){const a=document.getElementById(t);a&&(a.addEventListener("input",n=>e(n.target.value)),a.addEventListener("focus",()=>{a.style.borderColor="var(--accent)"}),a.addEventListener("blur",()=>{a.style.borderColor="var(--border)"}))}function Ee(){try{return JSON.parse(localStorage.getItem(ie))||[]}catch{return[]}}function D(){E&&(E(),E=null)}function I(t){return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}export{Ge as render};
