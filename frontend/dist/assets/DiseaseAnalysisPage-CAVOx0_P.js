import{s as v}from"./index-Ds7gPiVF.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const E=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function F(){var r,d;const o=new Set,e=[];function t(i,l){if(!i)return;const n=i.toLowerCase().trim();o.has(n)||(o.add(n),e.push({name:i.charAt(0).toUpperCase()+i.slice(1),emoji:l||k(i),species:n.replace(/\s+/g,"_")}))}try{const i=JSON.parse(localStorage.getItem("user_farms")||"[]"),l=((r=window.AppState)==null?void 0:r.currentFarm)||i.find(n=>{var s;return n.id===((s=window.AppState)==null?void 0:s.currentFarmId)})||i[i.length-1];l&&((l.plants||[]).forEach(n=>typeof n=="string"?t(n):t(n.name||n.species,n.emoji)),(l.zones||[]).forEach(n=>(n.plants||[]).forEach(s=>typeof s=="string"?t(s):t(s.name||s.species,s.emoji)))),(((d=window.AppState)==null?void 0:d.tiles)||[]).forEach(n=>{n.name&&n.status!=="empty"&&t(n.name,n.plant)})}catch{}return e}function k(o=""){const e=o.toLowerCase();return e.includes("lettuce")||e.includes("cabbage")||e.includes("kale")?"🥬":e.includes("tomato")?"🍅":e.includes("chili")||e.includes("pepper")||e.includes("capsicum")?"🌶️":e.includes("strawberry")?"🍓":e.includes("cucumber")?"🥒":e.includes("carrot")?"🥕":e.includes("spinach")?"🍃":e.includes("basil")||e.includes("mint")||e.includes("cilantro")?"🌿":e.includes("bean")?"🫘":"🌱"}function A(o){return o>=80?{label:"Confirmed",color:"#10B981",bg:"#D1FAE5",bar:"#10B981",icon:"✅"}:o>=60?{label:"Uncertain",color:"#F59E0B",bg:"#FEF3C7",bar:"#F59E0B",icon:"🔶"}:{label:"Low Confidence",color:"#EF4444",bg:"#FEE2E2",bar:"#EF4444",icon:"🔴"}}function _(){const o=document.getElementById("screenContainer"),e=F();o.innerHTML=`
     <div id="diseaseScreen" class="screen active" style="min-height:100vh;background:#f4f6f8;padding-bottom:90px;">
   
       <!-- Header -->
       <div style="display:flex;align-items:center;gap:12px;padding:16px 18px;
                   background:white;border-bottom:1px solid #eee;position:sticky;top:0;z-index:10;
                   box-shadow:0 2px 8px rgba(0,0,0,.04);">
         <button onclick="window.showScreen('dash-c')"
                 style="background:none;border:none;font-size:1.4rem;cursor:pointer;line-height:1;padding:0;color:#374151;">←</button>
         <div>
           <div style="font-weight:800;font-size:1.05rem;color:#1f2937;">🧫 AI Disease Analysis</div>
           <div style="font-size:0.72rem;color:#9CA3AF;">SeedDown AI · Hybrid Confidence Engine</div>
         </div>
       </div>
   
       <div style="padding:16px;display:flex;flex-direction:column;gap:14px;">
   
         <!-- Photo upload -->
         <div style="background:white;border-radius:16px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.05);">
           <div style="font-weight:700;font-size:.88rem;color:#374151;margin-bottom:4px;">
             📷 Upload Plant Photo
             <span style="font-size:.72rem;color:#9CA3AF;font-weight:400;"> (Optional — raises confidence)</span>
           </div>
           <div style="font-size:.72rem;color:#F59E0B;background:#FFFBEB;border:1px solid #FDE68A;
                       border-radius:8px;padding:7px 10px;margin-bottom:12px;line-height:1.4;">
             ⚠️ Without a photo, AI confidence is capped at <strong>69%</strong> and follow-up questions will be required.
           </div>
   
           <div id="dropZone"
                style="border:2px dashed #D1FAE5;border-radius:12px;padding:28px 16px;
                       text-align:center;cursor:pointer;background:#FAFFFE;transition:all .2s;"
                onclick="document.getElementById('photoInput').click()"
                ondragover="event.preventDefault();this.style.borderColor='#10B981';this.style.background='#F0FDF4';"
                ondragleave="this.style.borderColor='#D1FAE5';this.style.background='#FAFFFE';"
                ondrop="window._daDrop(event)">
             <div style="font-size:2.2rem;margin-bottom:8px;">📸</div>
             <div style="font-weight:700;color:#065F46;margin-bottom:3px;font-size:.9rem;">Tap or drag photo here</div>
             <div style="font-size:.73rem;color:#9CA3AF;">JPG · PNG · WEBP — max 8 MB</div>
           </div>
           <input type="file" id="photoInput" accept="image/*" style="display:none;">
   
           <div id="imgPreviewWrap" style="display:none;margin-top:12px;position:relative;">
             <img id="imgPreview" style="width:100%;max-height:240px;object-fit:contain;border-radius:10px;
                                          border:1px solid #eee;display:block;">
             <button onclick="window._daClear()"
                     style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.6);color:white;
                            border:none;border-radius:50%;width:28px;height:28px;font-size:.9rem;
                            cursor:pointer;line-height:1;">✕</button>
           </div>
         </div>
   
         <!-- Plant selector -->
         <div style="background:white;border-radius:16px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.05);">
           <div style="font-weight:700;font-size:.88rem;color:#374151;margin-bottom:12px;">🌱 Which Plant? <span style="color:#EF4444;">*</span></div>
   
           ${e.length?`
           <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;" id="cropChips">
             ${e.map(t=>`
               <button class="crop-chip" onclick="window._daSelectCrop('${t.name}')"
                       style="padding:7px 14px;border-radius:20px;border:1.5px solid #E5E7EB;
                              background:white;font-size:.82rem;cursor:pointer;
                              display:flex;align-items:center;gap:6px;transition:all .15s;">
                 <span>${t.emoji}</span><span>${t.name}</span>
               </button>`).join("")}
           </div>
           <div style="font-size:.72rem;color:#9CA3AF;text-align:center;margin-bottom:10px;">— or type below —</div>
           `:'<div style="font-size:.78rem;color:#9CA3AF;margin-bottom:10px;">No plants detected from your farm. Type the plant name below.</div>'}
   
           <input id="plantNameInput" type="text" placeholder="e.g. Lettuce, Basil, Tomato"
                  style="width:100%;padding:11px 14px;border-radius:10px;
                         border:1.5px solid #E5E7EB;font-size:.9rem;
                         box-sizing:border-box;outline:none;">
         </div>
   
         <!-- Farm context -->
         <details style="background:white;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.05);">
           <summary style="padding:16px 18px;font-weight:700;font-size:.88rem;color:#374151;
                            cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;">
             ⚙️ Add Farm Context <span style="font-size:.72rem;color:#9CA3AF;font-weight:400;">(optional — improves text-only diagnosis)</span>
           </summary>
           <div style="padding:0 18px 18px;display:flex;flex-direction:column;gap:10px;">
             <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
               <div>
                 <label style="font-size:.73rem;color:#9CA3AF;display:block;margin-bottom:4px;">Temp (°C)</label>
                 <input id="ctxTemp" type="number" placeholder="28"
                        style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #E5E7EB;font-size:.85rem;box-sizing:border-box;outline:none;">
               </div>
               <div>
                 <label style="font-size:.73rem;color:#9CA3AF;display:block;margin-bottom:4px;">Humidity (%)</label>
                 <input id="ctxHumid" type="number" placeholder="65"
                        style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #E5E7EB;font-size:.85rem;box-sizing:border-box;outline:none;">
               </div>
             </div>
             <div>
               <label style="font-size:.73rem;color:#9CA3AF;display:block;margin-bottom:4px;">Days since planting</label>
               <input id="ctxDays" type="number" placeholder="14"
                      style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #E5E7EB;font-size:.85rem;box-sizing:border-box;outline:none;">
             </div>
             <div>
               <label style="font-size:.73rem;color:#9CA3AF;display:block;margin-bottom:4px;">Symptoms observed <span style="color:#374151;font-weight:600;">(describe in detail)</span></label>
               <textarea id="ctxNotes" placeholder="e.g. Yellow circular spots on lower leaves, slight wilting in afternoon, no visible mould…"
                         style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #E5E7EB;
                                font-size:.85rem;height:80px;resize:none;box-sizing:border-box;outline:none;"></textarea>
             </div>
           </div>
         </details>
   
         <!-- Analyse button -->
         <button id="analyseBtn" onclick="window._daRun()"
                 style="width:100%;padding:15px;border-radius:14px;border:none;
                        background:linear-gradient(135deg,#10B981,#059669);color:white;
                        font-size:1rem;font-weight:800;cursor:pointer;
                        box-shadow:0 4px 14px rgba(16,185,129,.3);">
           🔬 Analyse with AI
         </button>
   
         <div id="resultArea"></div>
       </div>
     </div>`,window.showScreen=v,document.getElementById("photoInput").addEventListener("change",t=>{t.target.files[0]&&h(t.target.files[0])})}let g=null,y="image/jpeg";function h(o){if(o.size>8*1024*1024){alert("Image too large (max 8 MB)");return}y=o.type||"image/jpeg";const e=new FileReader;e.onload=t=>{g=t.target.result.split(",")[1],document.getElementById("imgPreview").src=t.target.result,document.getElementById("imgPreviewWrap").style.display="block",document.getElementById("dropZone").style.display="none"},e.readAsDataURL(o)}window._daDrop=o=>{o.preventDefault();const e=o.dataTransfer.files[0];e!=null&&e.type.startsWith("image/")&&h(e),document.getElementById("dropZone").style.borderColor="#D1FAE5",document.getElementById("dropZone").style.background="#FAFFFE"};window._daClear=()=>{g=null,document.getElementById("photoInput").value="",document.getElementById("imgPreviewWrap").style.display="none",document.getElementById("dropZone").style.display="block"};window._daSelectCrop=o=>{document.getElementById("plantNameInput").value=o,document.querySelectorAll(".crop-chip").forEach(e=>{const t=e.innerText.includes(o);e.style.background=t?"#D1FAE5":"white",e.style.borderColor=t?"#10B981":"#E5E7EB",e.style.color=t?"#065F46":"#374151",e.style.fontWeight=t?"700":"400"})};window._daNewUploadB64=null;window._daNewUploadMime="image/jpeg";window._daRun=async function(o={}){var m,a,p,x;const e=document.getElementById("plantNameInput").value.trim();if(!e){alert("Please select or type the plant name.");return}const t={temperature:((m=document.getElementById("ctxTemp"))==null?void 0:m.value)||null,humidity:((a=document.getElementById("ctxHumid"))==null?void 0:a.value)||null,daysSincePlant:((p=document.getElementById("ctxDays"))==null?void 0:p.value)||null,notes:((x=document.getElementById("ctxNotes"))==null?void 0:x.value)||null},r=t.notes||t.temperature||t.humidity;if(!g&&!r){alert("Please either upload a plant photo OR describe symptoms in Farm Context — the AI needs something to work with.");return}const d=Object.keys(o).length>0,i=document.getElementById("analyseBtn"),l=document.getElementById("resultArea");i.disabled=!0,i.style.opacity=".65",i.innerText=d?"🔄 Re-analysing…":"🔬 Analysing…";const n=g?"AI is examining your plant photo…":"AI is analysing your symptoms & farm context…",s=g?"Vision model active — takes 5–10 seconds":"Text model active · confidence will be capped at 69% without a photo";l.innerHTML=`
       <div style="background:white;border-radius:16px;padding:28px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.05);">
         <div style="font-size:2.2rem;margin-bottom:12px;">🧠</div>
         <div style="font-weight:700;color:#111;margin-bottom:6px;">${d?"Refining diagnosis with your answers…":n}</div>
         <div style="font-size:.8rem;color:#9CA3AF;">${s}</div>
         <div id="ldots" style="margin-top:14px;font-size:1.4rem;letter-spacing:6px;color:#10B981;">· · ·</div>
       </div>`;const f=["· · ·","● · ·","· ● ·","· · ●"];let b=0;const u=setInterval(()=>{const c=document.getElementById("ldots");c?c.innerText=f[b++%4]:clearInterval(u)},380);try{const c=await fetch(`${E}/api/ai/disease-analysis`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:g||null,mediaType:g?y:null,plantName:e,plantSpecies:e.toLowerCase().replace(/\s+/g,"_"),farmContext:t,answers:o})});if(clearInterval(u),!c.ok){const w=await c.json();throw new Error(w.error||"Server error")}B(await c.json(),e)}catch(c){clearInterval(u),l.innerHTML=`
         <div style="background:white;border-radius:16px;padding:20px;border-left:4px solid #EF4444;box-shadow:0 2px 8px rgba(0,0,0,.05);">
           <div style="font-weight:700;color:#DC2626;margin-bottom:6px;">⚠️ Analysis failed</div>
           <div style="font-size:.84rem;color:#4B5563;">${c.message}</div>
         </div>`}finally{i.disabled=!1,i.style.opacity="1",i.innerText="🔬 Analyse with AI"}};function B(o,e){var b,u;const t=Math.round((o.confidence||0)*100),r=A(t),d={low:{color:"#059669",bg:"#D1FAE5",label:"Low Risk",icon:"🟢"},medium:{color:"#D97706",bg:"#FEF3C7",label:"Moderate",icon:"🟡"},high:{color:"#DC2626",bg:"#FEE2E2",label:"High Risk",icon:"🔴"},unknown:{color:"#6B7280",bg:"#F3F4F6",label:"Unknown",icon:"⚪"}}[o.severity]||{color:"#6B7280",bg:"#F3F4F6",label:"Unknown",icon:"⚪"},i={evidence:{bg:"#F8FAFC",border:"#E2E8F0",icon:"🔍",label:"Evidence observed",col:"#374151",check:"🔹"},causes:{bg:"#FFFBEB",border:"#FDE68A",icon:"⚠️",label:"Likely causes",col:"#92400E",check:"🔸"},solutions:{bg:"#ECFDF5",border:"#A7F3D0",icon:"💊",label:"Recommended actions",col:"#065F46",check:"✅"},prevention:{bg:"#EFF6FF",border:"#BFDBFE",icon:"🛡️",label:"Prevention tips",col:"#1E40AF",check:"💡"}};function l(m,a){if(!(a!=null&&a.length))return"";const p=i[m],x=a.map(c=>`
         <div style="display:flex;align-items:flex-start;gap:10px;background:white;padding:12px 14px;
                     border-radius:10px;box-shadow:0 2px 4px rgba(0,0,0,.02);
                     border:1px solid ${p.border};margin-bottom:8px;">
           <div style="font-size:.85rem;margin-top:2px;flex-shrink:0;">${p.check}</div>
           <div style="font-size:.84rem;color:#334155;line-height:1.5;font-weight:500;">${c}</div>
         </div>`).join("");return`
       <div style="display:flex;flex-direction:column;height:100%;background:${p.bg};
                   border-radius:16px;padding:18px;border:1px solid ${p.border};box-sizing:border-box;">
         <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
           <div style="background:white;width:34px;height:34px;display:flex;align-items:center;
                       justify-content:center;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.06);
                       font-size:1.1rem;border:1px solid ${p.border};">${p.icon}</div>
           <div style="font-weight:800;font-size:.95rem;color:${p.col};letter-spacing:.02em;">${p.label}</div>
         </div>
         <div style="flex:1;">${x}</div>
       </div>`}const n=`
       <div style="display:inline-flex;align-items:center;gap:6px;background:${r.bg};
                   border:1px solid ${r.color}33;border-radius:20px;padding:4px 12px;">
         <span style="font-size:.9rem;">${r.icon}</span>
         <span style="font-weight:800;font-size:.8rem;color:${r.color};">${r.label}</span>
       </div>`,s=o.needsMoreInfo?"":`
       <div id="cameraAuthBlock"
            style="padding:16px 18px;background:linear-gradient(135deg,#F0FDF4,#ECFDF5);
                   border-top:1px solid #A7F3D0;border-bottom:1px solid #A7F3D0;margin-top:4px;">
         <div style="font-weight:800;font-size:.88rem;color:#065F46;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
           <span>🤖</span> AI Continuous Monitoring Setup
         </div>
         <div style="font-size:.76rem;color:#047857;line-height:1.5;margin-bottom:12px;">
           Diagnosis confirmed at <strong>${t}%</strong> confidence. Would you like SeedDown AI to monitor this zone via CCTV for the next <strong>${o.treatmentDuration}</strong>?
         </div>
         <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
           <button onclick="window._daGrantCamera('${o.treatmentDuration}')"
                   style="padding:11px;background:#10B981;color:white;border:none;font-weight:700;
                          font-size:.82rem;border-radius:10px;cursor:pointer;">
             ✅ Grant Access
           </button>
           <button onclick="window._daRefuseCamera('${o.treatmentDuration}')"
                   style="padding:11px;background:#64748B;color:white;border:none;font-weight:700;
                          font-size:.82rem;border-radius:10px;cursor:pointer;">
             ❌ Refuse
           </button>
         </div>
         <div id="cameraFeedback" style="margin-top:10px;font-size:.76rem;font-weight:600;display:none;"></div>
       </div>`,f=o.needsMoreInfo&&((b=o.followUpQuestions)!=null&&b.length)?`
       <div id="qaBlock" style="padding:16px 18px;background:#FFFBEB;border-top:1px solid #FDE68A;">
         <div style="font-weight:700;font-size:.84rem;color:#92400E;margin-bottom:6px;">
           🤔 More info needed — confidence is ${t}% (threshold: 80%)
         </div>
         <div style="font-size:.75rem;color:#78350F;margin-bottom:12px;line-height:1.4;">
           ${(u=o._meta)!=null&&u.isNoImage?"No photo was provided. Answering these questions (or uploading a photo) will allow the AI to refine the diagnosis and potentially confirm it.":"Image symptoms were ambiguous. Your answers will sharpen the diagnosis."}
         </div>
   
         ${o.followUpQuestions.map((m,a)=>/photo|image|picture|照片/i.test(m)?`
             <div style="margin-bottom:14px;">
               <label style="font-size:.78rem;color:#78350F;display:block;margin-bottom:6px;font-weight:600;">${m}</label>
               <div id="fqa_photo_preview_wrap_${a}" style="display:none;margin-bottom:8px;">
                 <img id="fqa_photo_preview_${a}" style="max-height:120px;border-radius:6px;border:1px solid #FDE68A;">
               </div>
               <button onclick="document.getElementById('fqa_file_input_${a}').click()"
                       id="fqa_upload_btn_${a}"
                       style="display:flex;align-items:center;gap:8px;padding:10px 14px;background:white;
                              border:1.5px dashed #F59E0B;color:#92400E;font-size:.82rem;font-weight:700;
                              border-radius:8px;cursor:pointer;width:100%;justify-content:center;box-sizing:border-box;">
                 📸 Tap to take / upload a photo
               </button>
               <input type="file" id="fqa_file_input_${a}" accept="image/*" style="display:none;"
                      onchange="window._daHandleFollowUpPhoto(this,${a})">
               <input type="hidden" id="fqa_${a}" value="">
             </div>`:`
           <div style="margin-bottom:10px;">
             <label style="font-size:.78rem;color:#78350F;display:block;margin-bottom:3px;font-weight:600;">${m}</label>
             <input type="text" id="fqa_${a}" placeholder="Your answer…"
                    style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #FDE68A;
                           font-size:.84rem;box-sizing:border-box;background:white;outline:none;">
           </div>`).join("")}
   
         <button onclick="window._daRefine(${JSON.stringify(o.followUpQuestions).replace(/"/g,"&quot;")})"
                 style="width:100%;margin-top:8px;padding:13px;border-radius:10px;border:none;
                        background:linear-gradient(135deg,#F59E0B,#D97706);color:white;font-weight:800;
                        cursor:pointer;font-size:.9rem;box-shadow:0 3px 8px rgba(245,158,11,.25);">
           🔄 Re-analyse with my answers
         </button>
       </div>`:"";document.getElementById("resultArea").innerHTML=`
     <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.07);">
   
       <!-- Severity header -->
       <div style="padding:18px;background:${d.bg};">
         <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
           <div style="flex:1;">
             <div style="font-size:.68rem;color:${d.color};font-weight:700;letter-spacing:.08em;margin-bottom:3px;">
               DIAGNOSIS · ${e.toUpperCase()}
             </div>
             <div style="font-weight:900;font-size:1.05rem;color:#111;line-height:1.3;">${o.condition}</div>
             <div style="margin-top:8px;">${n}</div>
           </div>
           <div style="text-align:center;flex-shrink:0;">
             <div style="font-size:1.8rem;">${d.icon}</div>
             <div style="font-size:.68rem;font-weight:700;color:${d.color};margin-top:1px;">${d.label}</div>
           </div>
         </div>
       </div>
   
       <!-- Confidence bar -->
       <div style="padding:14px 18px;border-bottom:1px solid #F3F4F6;">
         <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;">
           <span style="font-size:.73rem;font-weight:700;color:#9CA3AF;">AI Confidence</span>
           <span style="font-size:.82rem;font-weight:800;color:${r.color};">${t}%</span>
         </div>
         <div style="background:#F3F4F6;border-radius:8px;height:8px;overflow:hidden;">
           <div style="height:100%;width:${t}%;background:${r.bar};border-radius:8px;transition:width .7s ease;"></div>
         </div>
         ${o.confidenceExplanation?`<div style="font-size:.71rem;color:#9CA3AF;margin-top:5px;line-height:1.4;">${o.confidenceExplanation}</div>`:""}
       </div>
   
       <!-- Treatment time -->
       <div style="margin:14px 18px 0;padding:12px 14px;background:#F0FDF4;border:1px solid #BBF7D0;
                   border-radius:10px;display:flex;align-items:center;gap:10px;">
         <span style="font-size:1.4rem;">⏳</span>
         <div>
           <div style="font-size:.72rem;color:#166534;font-weight:700;letter-spacing:.03em;">ESTIMATED TREATMENT TIME</div>
           <div style="font-weight:800;font-size:.95rem;color:#14532D;">${o.treatmentDuration}</div>
         </div>
       </div>
   
       <!-- 4-quadrant grid -->
       <div style="padding:16px 18px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;align-items:stretch;">
         ${l("evidence",o.evidence)}
         ${l("causes",o.likelyCauses)}
         ${l("solutions",o.solutions)}
         ${l("prevention",o.prevention)}
       </div>
   
       ${s}
       ${f}
   
       <!-- Scan again -->
       <div style="padding:14px 18px;border-top:1px solid #F3F4F6;">
         <button onclick="window._daClear();document.getElementById('resultArea').innerHTML='';window.scrollTo(0,0);"
                 style="width:100%;padding:11px;border-radius:10px;border:1.5px solid #E5E7EB;
                        background:white;font-weight:700;font-size:.88rem;cursor:pointer;color:#374151;">
           📷 Scan another plant
         </button>
       </div>
     </div>`,document.getElementById("resultArea").scrollIntoView({behavior:"smooth",block:"start"})}window._daGrantCamera=function(o){const e=document.getElementById("cameraFeedback");e.style.display="block",e.style.color="#059669",e.innerHTML=`🟢 Access granted. AI has linked to Zone CCTV. Continuous tracking initialised for <strong>${o}</strong>.`,document.querySelectorAll("#cameraAuthBlock button").forEach(t=>t.disabled=!0)};window._daRefuseCamera=function(o){const e=document.getElementById("cameraFeedback");e.style.display="block",e.style.color="#EA580C",e.innerHTML=`⚠️ Access refused. SeedDown has scheduled an automated reminder in <strong>${o}</strong> to manually upload a validation photo.`,document.querySelectorAll("#cameraAuthBlock button").forEach(t=>t.disabled=!0),console.log(`[Notification Engine] Scheduled reminder in ${o} for manual disease health checks.`),window.Notification&&Notification.permission==="granted"&&setTimeout(()=>new Notification("SeedDown Crop Health Update",{body:`Your plant's ${o} treatment window has passed. Please open AI Disease Analysis and take a new photo.`,icon:"🌱"}),5e3)};window._daHandleFollowUpPhoto=function(o,e){const t=o.files[0];if(!t)return;window._daNewUploadMime=t.type||"image/jpeg";const r=new FileReader;r.onload=d=>{window._daNewUploadB64=d.target.result.split(",")[1],document.getElementById(`fqa_photo_preview_${e}`).src=d.target.result,document.getElementById(`fqa_photo_preview_wrap_${e}`).style.display="block";const i=document.getElementById(`fqa_upload_btn_${e}`);i.innerHTML=`✅ Photo attached (${(t.size/1024).toFixed(1)} KB) — tap to change`,i.style.background="#FEF3C7",i.style.borderStyle="solid";const l=document.getElementById(`fqa_${e}`);l&&(l.value="[New Photo Attached]")},r.readAsDataURL(t)};window._daRefine=function(o){const e={};if(o.forEach((t,r)=>{var i,l;const d=(l=(i=document.getElementById(`fqa_${r}`))==null?void 0:i.value)==null?void 0:l.trim();d&&(e[t]=d)}),!Object.keys(e).length&&!window._daNewUploadB64){alert("Please answer at least one question or upload a photo before re-analysing.");return}if(window._daNewUploadB64){g=window._daNewUploadB64,y=window._daNewUploadMime;const t=document.getElementById("imgPreview");t&&(t.src=`data:${y};base64,${g}`);const r=document.getElementById("imgPreviewWrap");r&&(r.style.display="block");const d=document.getElementById("dropZone");d&&(d.style.display="none"),window._daNewUploadB64=null}window._daRun(e)};export{_ as render};
