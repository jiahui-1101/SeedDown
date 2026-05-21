import{s as B}from"./index-Bza452zz.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const A=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,_=[{emoji:"🥬",name:"Lettuce",species:"lettuce"},{emoji:"🌿",name:"Spinach",species:"spinach"},{emoji:"🌱",name:"Basil",species:"basil"},{emoji:"🍅",name:"Tomato",species:"tomato"},{emoji:"🥒",name:"Cucumber",species:"cucumber"},{emoji:"🥕",name:"Carrot",species:"carrot"},{emoji:"🥬",name:"Cabbage",species:"cabbage"},{emoji:"🍆",name:"Eggplant",species:"eggplant"}];function z(){var a;const t=new Set,e=[];function o(n,r){if(!n)return;const i=n.toLowerCase().trim();t.has(i)||(t.add(i),e.push({name:n.charAt(0).toUpperCase()+n.slice(1),emoji:r||$(n),species:i.replace(/\s+/g,"_")}))}try{JSON.parse(localStorage.getItem("user_farms")||"[]").forEach(r=>{(r.plants||[]).forEach(i=>typeof i=="string"?o(i):o(i.name||i.species,i.emoji)),(r.zones||[]).forEach(i=>(i.plants||[]).forEach(s=>typeof s=="string"?o(s):o(s.name||s.species,s.emoji)))}),(((a=window.AppState)==null?void 0:a.tiles)||[]).forEach(r=>{r.name&&r.status!=="empty"&&o(r.name,r.plant)})}catch{}return e.length||_.forEach(n=>o(n.name,n.emoji)),e}function $(t=""){const e=t.toLowerCase();return e.includes("lettuce")||e.includes("cabbage")||e.includes("kale")?"🥬":e.includes("tomato")?"🍅":e.includes("chili")||e.includes("pepper")||e.includes("capsicum")?"🌶️":e.includes("strawberry")?"🍓":e.includes("cucumber")?"🥒":e.includes("carrot")?"🥕":e.includes("spinach")?"🍃":e.includes("basil")||e.includes("mint")||e.includes("cilantro")?"🌿":e.includes("bean")?"🫘":e.includes("eggplant")?"🍆":"🌱"}function C(t){return t>=80?{label:"Confirmed",color:"#10B981",bg:"#D1FAE5",bar:"#10B981",icon:"✅"}:t>=60?{label:"Uncertain",color:"#F59E0B",bg:"#FEF3C7",bar:"#F59E0B",icon:"🔶"}:{label:"Low Confidence",color:"#EF4444",bg:"#FEE2E2",bar:"#EF4444",icon:"🔴"}}function I(){const t=document.getElementById("screenContainer"),e=z();t.innerHTML=`
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
           <div style="font-weight:700;font-size:.88rem;color:#374151;margin-bottom:12px;">
             📷 Upload Plant Photo
             <span style="font-size:.72rem;color:#9CA3AF;font-weight:400;"> (Optional — raises confidence)</span>
           </div>
   
           <div id="dropZone"
                style="border:2px dashed #D1FAE5;border-radius:12px;padding:28px 16px;
                       text-align:center;cursor:pointer;background:#FAFFFE;transition:all .2s;"
                ondragover="event.preventDefault();this.style.borderColor='#10B981';this.style.background='#F0FDF4';"
                ondragleave="this.style.borderColor='#D1FAE5';this.style.background='#FAFFFE';"
                ondrop="window._daDrop(event)">
             <div style="font-size:2.2rem;margin-bottom:8px;">📸</div>
             <div style="font-weight:700;color:#065F46;margin-bottom:3px;font-size:.9rem;">Take or upload plant photo</div>
             <div style="font-size:.73rem;color:#9CA3AF;">JPG · PNG · WEBP — max 8 MB</div>
             <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px;">
               <button type="button" onclick="event.stopPropagation();document.getElementById('photoCameraInput').click()"
                       style="padding:10px;border:none;border-radius:10px;background:#059669;color:white;font-weight:800;cursor:pointer;">Take Photo</button>
               <button type="button" onclick="event.stopPropagation();document.getElementById('photoInput').click()"
                       style="padding:10px;border:1.5px solid #A7F3D0;border-radius:10px;background:white;color:#065F46;font-weight:800;cursor:pointer;">Upload Photo</button>
             </div>
           </div>
           <input type="file" id="photoInput" accept="image/*" style="display:none;">
           <input type="file" id="photoCameraInput" accept="image/*" capture="environment" style="display:none;">
   
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
   
           <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;" id="cropChips">
             ${e.map(o=>`
               <button class="crop-chip" onclick="window._daSelectCrop('${o.name}')"
                       style="padding:7px 14px;border-radius:20px;border:1.5px solid #E5E7EB;
                              background:white;font-size:.82rem;cursor:pointer;
                              display:flex;align-items:center;gap:6px;transition:all .15s;">
                 <span>${o.emoji}</span><span>${o.name}</span>
               </button>`).join("")}
           </div>
           <div style="font-size:.72rem;color:#9CA3AF;text-align:center;margin-bottom:10px;">— or type below —</div>
   
           <input id="plantNameInput" type="text" placeholder="e.g. Lettuce, Basil, Tomato"
                  style="width:100%;padding:11px 14px;border-radius:10px;
                         border:1.5px solid #E5E7EB;font-size:.9rem;
                         box-sizing:border-box;outline:none;">
         </div>
   
         <!-- Farm context -->
         <details style="background:white;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.05);">
           <summary style="padding:16px 18px;font-weight:700;font-size:.88rem;color:#374151;
                            cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;">
             ⚙️ Add Farm Context <span style="font-size:.72rem;color:#9CA3AF;font-weight:400;">(optional — improves diagnosis)</span>
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
       </div>
     </div>`,window.showScreen=B,document.getElementById("photoInput").onchange=o=>{o.target.files[0]&&h(o.target.files[0])},document.getElementById("photoCameraInput").onchange=o=>{o.target.files[0]&&h(o.target.files[0])}}let c=null,b="image/jpeg",f="",x={};function h(t){if(t.size>8*1024*1024){alert("Image too large (max 8 MB)");return}b=t.type||"image/jpeg";const e=new FileReader;e.onload=o=>{c=o.target.result.split(",")[1],document.getElementById("imgPreview").src=o.target.result,document.getElementById("imgPreviewWrap").style.display="block",document.getElementById("dropZone").style.display="none"},e.readAsDataURL(t)}window._daDrop=t=>{t.preventDefault();const e=t.dataTransfer.files[0];e!=null&&e.type.startsWith("image/")&&h(e),document.getElementById("dropZone").style.borderColor="#D1FAE5",document.getElementById("dropZone").style.background="#FAFFFE"};window._daClear=()=>{c=null,document.getElementById("photoInput").value="",document.getElementById("imgPreviewWrap").style.display="none",document.getElementById("dropZone").style.display="block"};window._daSelectCrop=t=>{document.getElementById("plantNameInput").value=t,document.querySelectorAll(".crop-chip").forEach(e=>{const o=e.innerText.includes(t);e.style.background=o?"#D1FAE5":"white",e.style.borderColor=o?"#10B981":"#E5E7EB",e.style.color=o?"#065F46":"#374151",e.style.fontWeight=o?"700":"400"})};window._daNewUploadB64=null;window._daNewUploadMime="image/jpeg";function D(t){const e=document.getElementById("screenContainer");e.innerHTML=`
     <div id="brainLoadScreen" class="screen active"
          style="min-height:100vh;background:#f4f6f8;display:flex;flex-direction:column;
                 align-items:center;justify-content:center;padding:40px 24px;text-align:center;">
   
       <style>
         @keyframes brainPulse {
           0%,100% { transform: scale(1);   filter: drop-shadow(0 0 18px #10B981aa); }
           50%      { transform: scale(1.1); filter: drop-shadow(0 0 36px #10B981ff); }
         }
         @keyframes orbit1 {
           from { transform: rotate(0deg)   translateX(60px) rotate(0deg);   }
           to   { transform: rotate(360deg) translateX(60px) rotate(-360deg);}
         }
         @keyframes orbit2 {
           from { transform: rotate(120deg)  translateX(80px) rotate(-120deg); }
           to   { transform: rotate(480deg)  translateX(80px) rotate(-480deg); }
         }
         @keyframes orbit3 {
           from { transform: rotate(240deg)  translateX(50px) rotate(-240deg); }
           to   { transform: rotate(600deg)  translateX(50px) rotate(-600deg); }
         }
         @keyframes fadeInUp {
           from { opacity:0; transform:translateY(20px); }
           to   { opacity:1; transform:translateY(0);    }
         }
         @keyframes dotBlink {
           0%,100% { opacity:.2; } 50% { opacity:1; }
         }
         .brain-dot-1 { animation: dotBlink 1.2s ease-in-out 0s   infinite; }
         .brain-dot-2 { animation: dotBlink 1.2s ease-in-out .4s  infinite; }
         .brain-dot-3 { animation: dotBlink 1.2s ease-in-out .8s  infinite; }
       </style>
   
       <!-- Orbital animation wrapper -->
       <div style="position:relative;width:200px;height:200px;margin-bottom:36px;">
   
         <!-- Orbiting particles -->
         <div style="position:absolute;top:50%;left:50%;width:0;height:0;">
           <div style="animation:orbit1 2.4s linear infinite;position:absolute;">
             <div style="width:10px;height:10px;background:#10B981;border-radius:50%;
                         box-shadow:0 0 12px #10B981;"></div>
           </div>
         </div>
         <div style="position:absolute;top:50%;left:50%;width:0;height:0;">
           <div style="animation:orbit2 3.2s linear infinite;position:absolute;">
             <div style="width:7px;height:7px;background:#34D399;border-radius:50%;
                         box-shadow:0 0 8px #34D399;"></div>
           </div>
         </div>
         <div style="position:absolute;top:50%;left:50%;width:0;height:0;">
           <div style="animation:orbit3 1.8s linear infinite;position:absolute;">
             <div style="width:6px;height:6px;background:#6EE7B7;border-radius:50%;
                         box-shadow:0 0 6px #6EE7B7;"></div>
           </div>
         </div>
   
         <!-- Brain emoji, centred and pulsing -->
         <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                     font-size:5rem;line-height:1;
                     animation:brainPulse 2s ease-in-out infinite;">🧠</div>
       </div>
   
       <!-- Text -->
       <div style="animation:fadeInUp .6s ease both;">
         <div style="font-size:1.25rem;font-weight:800;color:#1f2937;margin-bottom:8px;letter-spacing:.01em;">
           ${t?"Refining diagnosis…":"Analysing your plant…"}
         </div>
         <div style="font-size:.84rem;color:#059669;margin-bottom:24px;">
           ${t?"Incorporating your answers into the model":"SeedDown AI is reading symptoms & patterns"}
         </div>
         <div style="display:flex;gap:8px;justify-content:center;align-items:center;">
           <div class="brain-dot-1" style="width:10px;height:10px;background:#10B981;border-radius:50%;"></div>
           <div class="brain-dot-2" style="width:10px;height:10px;background:#10B981;border-radius:50%;"></div>
           <div class="brain-dot-3" style="width:10px;height:10px;background:#10B981;border-radius:50%;"></div>
         </div>
       </div>
   
       <div style="margin-top:48px;font-size:.72rem;color:#9CA3AF;animation:fadeInUp .6s ease .4s both;">
         This usually takes 5–10 seconds
       </div>
     </div>`}window._daRun=async function(t={}){var i,s,m,u;const e=document.getElementById("plantNameInput");e&&(f=e.value.trim(),x={temperature:((i=document.getElementById("ctxTemp"))==null?void 0:i.value)||null,humidity:((s=document.getElementById("ctxHumid"))==null?void 0:s.value)||null,daysSincePlant:((m=document.getElementById("ctxDays"))==null?void 0:m.value)||null,notes:((u=document.getElementById("ctxNotes"))==null?void 0:u.value)||null});const o=f,a=x;if(!o){alert("Please select or type the plant name.");return}const n=a.notes||a.temperature||a.humidity,r=Object.keys(t).length>0;if(!c&&!n&&!r){alert("Please either upload a plant photo OR describe symptoms in Farm Context — the AI needs something to work with.");return}D(r);try{const p=await fetch(`${A}/api/ai/disease-analysis`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:c||null,mediaType:c?b:null,plantName:o,plantSpecies:o.toLowerCase().replace(/\s+/g,"_"),farmContext:a,answers:t})});if(!p.ok){const y=await p.json();throw new Error(y.error||"Server error")}P(await p.json(),o)}catch(p){T(p.message)}};function T(t){const e=document.getElementById("screenContainer");e.innerHTML=`
     <div class="screen active" style="min-height:100vh;background:#f4f6f8;padding-bottom:90px;">
       <div style="display:flex;align-items:center;gap:12px;padding:16px 18px;
                   background:white;border-bottom:1px solid #eee;position:sticky;top:0;z-index:10;
                   box-shadow:0 2px 8px rgba(0,0,0,.04);">
         <button onclick="window._daBackToForm()"
                 style="background:none;border:none;font-size:1.4rem;cursor:pointer;padding:0;color:#374151;">←</button>
         <div style="font-weight:800;font-size:1.05rem;color:#1f2937;">🧫 AI Disease Analysis</div>
       </div>
       <div style="padding:24px 16px;">
         <div style="background:white;border-radius:16px;padding:24px;border-left:4px solid #EF4444;
                     box-shadow:0 2px 8px rgba(0,0,0,.05);">
           <div style="font-weight:800;font-size:1rem;color:#DC2626;margin-bottom:8px;">⚠️ Analysis failed</div>
           <div style="font-size:.85rem;color:#4B5563;margin-bottom:20px;">${t}</div>
           <button onclick="window._daBackToForm()"
                   style="width:100%;padding:12px;border-radius:10px;border:1.5px solid #E5E7EB;
                          background:white;font-weight:700;font-size:.88rem;cursor:pointer;color:#374151;">
             ← Try again
           </button>
         </div>
       </div>
     </div>`}window._daBackToForm=function(){c=null,b="image/jpeg",f="",x={},window._daNewUploadB64=null,window._daNewUploadMime="image/jpeg",I()};function P(t,e){var w;const o=Math.round((t.confidence||0)*100),a=C(o),n={low:{color:"#059669",bg:"#D1FAE5",label:"Low Risk",icon:"🟢"},medium:{color:"#D97706",bg:"#FEF3C7",label:"Moderate",icon:"🟡"},high:{color:"#DC2626",bg:"#FEE2E2",label:"High Risk",icon:"🔴"},unknown:{color:"#6B7280",bg:"#F3F4F6",label:"Unknown",icon:"⚪"}}[t.severity]||{color:"#6B7280",bg:"#F3F4F6",label:"Unknown",icon:"⚪"},r={evidence:{bg:"#F8FAFC",border:"#E2E8F0",icon:"🔍",label:"Evidence observed",col:"#374151",check:"🔹"},causes:{bg:"#FFFBEB",border:"#FDE68A",icon:"⚠️",label:"Likely causes",col:"#92400E",check:"🔸"},solutions:{bg:"#ECFDF5",border:"#A7F3D0",icon:"💊",label:"Recommended actions",col:"#065F46",check:"✅"},prevention:{bg:"#EFF6FF",border:"#BFDBFE",icon:"🛡️",label:"Prevention tips",col:"#1E40AF",check:"💡"}};function i(g,d){if(!(d!=null&&d.length))return"";const l=r[g],E=d.map(F=>`
         <div style="display:flex;align-items:flex-start;gap:10px;background:white;padding:12px 14px;
                     border-radius:10px;box-shadow:0 2px 4px rgba(0,0,0,.02);
                     border:1px solid ${l.border};margin-bottom:8px;">
           <div style="font-size:.85rem;margin-top:2px;flex-shrink:0;">${l.check}</div>
           <div style="font-size:.84rem;color:#334155;line-height:1.5;font-weight:500;">${F}</div>
         </div>`).join("");return`
       <div style="display:flex;flex-direction:column;height:100%;background:${l.bg};
                   border-radius:16px;padding:18px;border:1px solid ${l.border};box-sizing:border-box;">
         <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
           <div style="background:white;width:34px;height:34px;display:flex;align-items:center;
                       justify-content:center;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.06);
                       font-size:1.1rem;border:1px solid ${l.border};">${l.icon}</div>
           <div style="font-weight:800;font-size:.95rem;color:${l.col};letter-spacing:.02em;">${l.label}</div>
         </div>
         <div style="flex:1;">${E}</div>
       </div>`}const s=`
       <div style="display:inline-flex;align-items:center;gap:6px;background:${a.bg};
                   border:1px solid ${a.color}33;border-radius:20px;padding:4px 12px;">
         <span style="font-size:.9rem;">${a.icon}</span>
         <span style="font-weight:800;font-size:.8rem;color:${a.color};">${a.label}</span>
       </div>`,m=t.needsMoreInfo?"":`
       <div id="cameraAuthBlock"
            style="padding:16px 18px;background:linear-gradient(135deg,#F0FDF4,#ECFDF5);
                   border-top:1px solid #A7F3D0;border-bottom:1px solid #A7F3D0;margin-top:4px;">
         <div style="font-weight:800;font-size:.88rem;color:#065F46;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
           <span>🤖</span> AI Continuous Monitoring Setup
         </div>
         <div style="font-size:.76rem;color:#047857;line-height:1.5;margin-bottom:12px;">
           Diagnosis confirmed at <strong>${o}%</strong> confidence. Would you like SeedDown AI to monitor this zone via CCTV for the next <strong>${t.treatmentDuration}</strong>?
         </div>
         <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
           <button onclick="window._daGrantCamera('${t.treatmentDuration}')"
                   style="padding:11px;background:#10B981;color:white;border:none;font-weight:700;
                          font-size:.82rem;border-radius:10px;cursor:pointer;">
             ✅ Grant Access
           </button>
           <button onclick="window._daRefuseCamera('${t.treatmentDuration}')"
                   style="padding:11px;background:#64748B;color:white;border:none;font-weight:700;
                          font-size:.82rem;border-radius:10px;cursor:pointer;">
             ❌ Refuse
           </button>
         </div>
         <div id="cameraFeedback" style="margin-top:10px;font-size:.76rem;font-weight:600;display:none;"></div>
       </div>`,u=["Have you noticed any changes in the affected area over the past few days (spreading, shrinking, colour shift)?","What are the current temperature and humidity conditions in the growing zone?","Are other plants nearby showing similar symptoms?"],p=(w=t.followUpQuestions)!=null&&w.length?t.followUpQuestions:u,v=o<90?`
       <div id="qaBlock" style="padding:16px 18px;background:#FFFBEB;border-top:1px solid #FDE68A;">
         <div style="font-weight:700;font-size:.84rem;color:#92400E;margin-bottom:6px;">
           🤔 Help us refine — confidence is ${o}%
         </div>
         <div style="font-size:.75rem;color:#78350F;margin-bottom:12px;line-height:1.4;">
           Answer the questions below to sharpen the AI diagnosis.
         </div>
   
         ${p.map((g,d)=>/photo|image|picture|照片/i.test(g)?`
            <div style="margin-bottom:14px;">
              <label style="font-size:.78rem;color:#78350F;display:block;margin-bottom:6px;font-weight:600;">${g}</label>
              <div id="fqa_photo_preview_wrap_${d}" style="display:none;margin-bottom:8px;">
                <img id="fqa_photo_preview_${d}" style="max-height:120px;border-radius:6px;border:1px solid #FDE68A;">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <button onclick="document.getElementById('fqa_camera_input_${d}').click()"
                        id="fqa_camera_btn_${d}"
                        style="padding:10px 12px;background:#D97706;color:white;font-size:.82rem;font-weight:800;border:none;border-radius:8px;cursor:pointer;">
                  Take Photo
                </button>
                <button onclick="document.getElementById('fqa_file_input_${d}').click()"
                        id="fqa_upload_btn_${d}"
                        style="padding:10px 12px;background:white;border:1.5px dashed #F59E0B;color:#92400E;font-size:.82rem;font-weight:800;border-radius:8px;cursor:pointer;">
                  Upload Photo
                </button>
              </div>
              <input type="file" id="fqa_camera_input_${d}" accept="image/*" capture="environment" style="display:none;"
                     onchange="window._daHandleFollowUpPhoto(this,${d})">
              <input type="file" id="fqa_file_input_${d}" accept="image/*" style="display:none;"
                     onchange="window._daHandleFollowUpPhoto(this,${d})">
              <input type="hidden" id="fqa_${d}" value="">
            </div>`:`
          <div style="margin-bottom:10px;">
            <label style="font-size:.78rem;color:#78350F;display:block;margin-bottom:3px;font-weight:600;">${g}</label>
            <textarea id="fqa_${d}" placeholder="Your answer…" rows="3"
                      style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #FDE68A;
                             font-size:.84rem;box-sizing:border-box;background:white;outline:none;
                             resize:vertical;line-height:1.5;font-family:inherit;"></textarea>
          </div>`).join("")}
      
        <button onclick="window._daRefine(${JSON.stringify(p).replace(/"/g,"&quot;")})"
                style="width:100%;margin-top:8px;padding:13px;border-radius:10px;border:none;
                       background:linear-gradient(135deg,#F59E0B,#D97706);color:white;font-weight:800;
                       cursor:pointer;font-size:.9rem;box-shadow:0 3px 8px rgba(245,158,11,.25);">
          🔄 Re-analyse with my answers
        </button>
      </div>`:"",k=document.getElementById("screenContainer");k.innerHTML=`
     <div class="screen active" style="min-height:100vh;background:#f4f6f8;padding-bottom:90px;">
   
       <!-- Header -->
       <div style="display:flex;align-items:center;gap:12px;padding:16px 18px;
                   background:white;border-bottom:1px solid #eee;position:sticky;top:0;z-index:10;
                   box-shadow:0 2px 8px rgba(0,0,0,.04);">
         <button onclick="window._daBackToForm()"
                 style="background:none;border:none;font-size:1.4rem;cursor:pointer;line-height:1;padding:0;color:#374151;">←</button>
         <div>
           <div style="font-weight:800;font-size:1.05rem;color:#1f2937;">🧫 Diagnosis Results</div>
           <div style="font-size:0.72rem;color:#9CA3AF;">SeedDown AI · Hybrid Confidence Engine</div>
         </div>
       </div>
   
       <div style="padding:16px;display:flex;flex-direction:column;gap:14px;">
         <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.07);">
   
           <!-- Severity header -->
           <div style="padding:18px;background:${n.bg};">
             <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
               <div style="flex:1;">
                 <div style="font-size:.68rem;color:${n.color};font-weight:700;letter-spacing:.08em;margin-bottom:3px;">
                   DIAGNOSIS · ${e.toUpperCase()}
                 </div>
                 <div style="font-weight:900;font-size:1.05rem;color:#111;line-height:1.3;">${t.condition}</div>
                 <div style="margin-top:8px;">${s}</div>
               </div>
               <div style="text-align:center;flex-shrink:0;">
                 <div style="font-size:1.8rem;">${n.icon}</div>
                 <div style="font-size:.68rem;font-weight:700;color:${n.color};margin-top:1px;">${n.label}</div>
               </div>
             </div>
           </div>
   
           <!-- Confidence bar -->
           <div style="padding:14px 18px;border-bottom:1px solid #F3F4F6;">
             <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;">
               <span style="font-size:.73rem;font-weight:700;color:#9CA3AF;">AI Confidence</span>
               <span style="font-size:.82rem;font-weight:800;color:${a.color};">${o}%</span>
             </div>
             <div style="background:#F3F4F6;border-radius:8px;height:8px;overflow:hidden;">
               <div style="height:100%;width:${o}%;background:${a.bar};border-radius:8px;transition:width .7s ease;"></div>
             </div>
             ${t.confidenceExplanation?`<div style="font-size:.71rem;color:#9CA3AF;margin-top:5px;line-height:1.4;">${t.confidenceExplanation}</div>`:""}
           </div>
   
           <!-- Treatment time -->
           <div style="margin:14px 18px 0;padding:12px 14px;background:#F0FDF4;border:1px solid #BBF7D0;
                       border-radius:10px;display:flex;align-items:center;gap:10px;">
             <span style="font-size:1.4rem;">⏳</span>
             <div>
               <div style="font-size:.72rem;color:#166534;font-weight:700;letter-spacing:.03em;">ESTIMATED TREATMENT TIME</div>
               <div style="font-weight:800;font-size:.95rem;color:#14532D;">${t.treatmentDuration}</div>
             </div>
           </div>
   
           <!-- 4-quadrant grid -->
           <div style="padding:16px 18px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;align-items:stretch;">
             ${i("evidence",t.evidence)}
             ${i("causes",t.likelyCauses)}
             ${i("solutions",t.solutions)}
             ${i("prevention",t.prevention)}
           </div>
   
           ${m}
           ${v}
   
           <!-- Analyse another -->
           <div style="padding:14px 18px;border-top:1px solid #F3F4F6;">
             <button onclick="window._daBackToForm()"
                     style="width:100%;padding:11px;border-radius:10px;border:1.5px solid #E5E7EB;
                            background:white;font-weight:700;font-size:.88rem;cursor:pointer;color:#374151;">
               📷 Analyse another plant
             </button>
           </div>
         </div>
       </div>
     </div>`,window.scrollTo(0,0)}window._daGrantCamera=function(t){const e=document.getElementById("cameraFeedback");e.style.display="block",e.style.color="#059669",e.innerHTML=`🟢 Access granted. AI has linked to Zone CCTV. Continuous tracking initialised for <strong>${t}</strong>.`,document.querySelectorAll("#cameraAuthBlock button").forEach(o=>o.disabled=!0)};window._daRefuseCamera=function(t){const e=document.getElementById("cameraFeedback");e.style.display="block",e.style.color="#EA580C",e.innerHTML=`⚠️ Access refused. SeedDown has scheduled an automated reminder in <strong>${t}</strong> to manually upload a validation photo.`,document.querySelectorAll("#cameraAuthBlock button").forEach(o=>o.disabled=!0),console.log(`[Notification Engine] Scheduled reminder in ${t} for manual disease health checks.`),window.Notification&&Notification.permission==="granted"&&setTimeout(()=>new Notification("SeedDown Crop Health Update",{body:`Your plant's ${t} treatment window has passed. Please open AI Disease Analysis and take a new photo.`,icon:"🌱"}),5e3)};window._daHandleFollowUpPhoto=function(t,e){const o=t.files[0];if(!o)return;window._daNewUploadMime=o.type||"image/jpeg";const a=new FileReader;a.onload=n=>{window._daNewUploadB64=n.target.result.split(",")[1],document.getElementById(`fqa_photo_preview_${e}`).src=n.target.result,document.getElementById(`fqa_photo_preview_wrap_${e}`).style.display="block";const r=document.getElementById(`fqa_upload_btn_${e}`);r.innerHTML=`✅ Photo attached (${(o.size/1024).toFixed(1)} KB) — tap to change`,r.style.background="#FEF3C7",r.style.borderStyle="solid";const i=document.getElementById(`fqa_camera_btn_${e}`);i&&(i.textContent="Retake Photo");const s=document.getElementById(`fqa_${e}`);s&&(s.value="[New Photo Attached]")},a.readAsDataURL(o)};window._daRefine=function(t){const e={};if(t.forEach((o,a)=>{var r,i;const n=(i=(r=document.getElementById(`fqa_${a}`))==null?void 0:r.value)==null?void 0:i.trim();n&&(e[o]=n)}),!Object.keys(e).length&&!window._daNewUploadB64){alert("Please answer at least one question or upload a photo before re-analysing.");return}window._daNewUploadB64&&(c=window._daNewUploadB64,b=window._daNewUploadMime,window._daNewUploadB64=null),window._daRun(e)};export{I as render};
