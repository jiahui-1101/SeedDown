import{s as h}from"./index-DZrsI_8o.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const w=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;function v(){var i,l;const t=new Set,e=[];function o(r,s){if(!r)return;const n=r.toLowerCase().trim();t.has(n)||(t.add(n),e.push({name:r.charAt(0).toUpperCase()+r.slice(1),emoji:s||E(r),species:n.replace(/\s+/g,"_")}))}try{const r=JSON.parse(localStorage.getItem("user_farms")||"[]"),s=((i=window.AppState)==null?void 0:i.currentFarm)||r.find(n=>{var d;return n.id===((d=window.AppState)==null?void 0:d.currentFarmId)})||r[r.length-1];s&&((s.plants||[]).forEach(n=>{typeof n=="string"?o(n):o(n.name||n.species,n.emoji)}),(s.zones||[]).forEach(n=>{(n.plants||[]).forEach(d=>{typeof d=="string"?o(d):o(d.name||d.species,d.emoji)})})),(((l=window.AppState)==null?void 0:l.tiles)||[]).forEach(n=>{n.name&&n.status!=="empty"&&o(n.name,n.plant)})}catch{}return e}function E(t=""){const e=t.toLowerCase();return e.includes("lettuce")||e.includes("cabbage")||e.includes("kale")?"🥬":e.includes("tomato")?"🍅":e.includes("chili")||e.includes("pepper")||e.includes("capsicum")?"🌶️":e.includes("strawberry")?"🍓":e.includes("cucumber")?"🥒":e.includes("carrot")?"🥕":e.includes("spinach")?"🍃":e.includes("basil")||e.includes("mint")||e.includes("cilantro")?"🌿":e.includes("bean")?"🫘":"🌱"}function z(){const t=document.getElementById("screenContainer"),e=v();t.innerHTML=`
       <div id="diseaseScreen" class="screen active" style="min-height:100vh;background:#f4f6f8;padding-bottom:80px;">
   
         <div style="display:flex;align-items:center;gap:12px;padding:16px 18px;
                     background:white;border-bottom:1px solid #eee;position:sticky;top:0;z-index:10;">
           <button onclick="window.showScreen('dash-c')"
                   style="background:none;border:none;font-size:1.4rem;cursor:pointer;line-height:1;padding:0;">←</button>
           <div>
             <div style="font-weight:800;font-size:1.05rem;color:#1f2937;">🧫 AI Commercial Disease Analysis</div>
             <div style="font-size:0.72rem;color:#9CA3AF;">Powered by SeedDown AI · Multi-Model Core</div>
           </div>
         </div>
   
         <div style="padding:16px;display:flex;flex-direction:column;gap:14px;">
   
           <div style="background:white;border-radius:16px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.05);">
             <div style="font-weight:700;font-size:.88rem;color:#374151;margin-bottom:12px;">📷 Upload Plant Photo</div>
   
             <div id="dropZone"
                  style="border:2px dashed #D1FAE5;border-radius:12px;padding:28px 16px;
                         text-align:center;cursor:pointer;background:#FAFFFE;transition:all .2s;"
                  onclick="document.getElementById('photoInput').click()"
                  ondragover="event.preventDefault();this.style.borderColor='#10B981';this.style.background='#F0FDF4';"
                  ondragleave="this.style.borderColor='#D1FAE5';this.style.background='#FAFFFE';"
                  ondrop="window._daDrop(event)">
               <div style="font-size:2.2rem;margin-bottom:8px;">📸</div>
               <div style="font-weight:700;color:#065F46;margin-bottom:3px;font-size:.9rem;">Tap or drag photo here</div>
               <div style="font-size:.73rem;color:#9CA3AF;">JPG · PNG · WEBP — max 8MB</div>
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
   
           <div style="background:white;border-radius:16px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.05);">
             <div style="font-weight:700;font-size:.88rem;color:#374151;margin-bottom:12px;">🌱 Which Plant?</div>
   
             ${e.length?`
             <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;" id="cropChips">
               ${e.map(o=>`
                 <button class="crop-chip"
                         onclick="window._daSelectCrop('${o.name}')"
                         style="padding:7px 14px;border-radius:20px;border:1.5px solid #E5E7EB;
                                background:white;font-size:.82rem;cursor:pointer;
                                display:flex;align-items:center;gap:6px;transition:all .15s;">
                   <span>${o.emoji}</span><span>${o.name}</span>
                 </button>`).join("")}
             </div>
             <div style="font-size:.72rem;color:#9CA3AF;text-align:center;margin-bottom:10px;">— or type below —</div>
             `:`
             <div style="font-size:.78rem;color:#9CA3AF;margin-bottom:10px;">
               No plants detected from your farm. Type the plant name below.
             </div>`}
   
             <input id="plantNameInput" type="text" placeholder="e.g. Lettuce, Basil, Tomato"
                    style="width:100%;padding:11px 14px;border-radius:10px;
                           border:1.5px solid #E5E7EB;font-size:.9rem;
                           box-sizing:border-box;outline:none;">
           </div>
   
           <details style="background:white;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,.05);">
             <summary style="padding:16px 18px;font-weight:700;font-size:.88rem;color:#374151;
                              cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;">
               ⚙️ Add Farm Context <span style="font-size:.72rem;color:#9CA3AF;font-weight:400;">(optional)</span>
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
                 <label style="font-size:.73rem;color:#9CA3AF;display:block;margin-bottom:4px;">Symptoms observed</label>
                 <textarea id="ctxNotes" placeholder="e.g. Yellow spots on leaves..."
                           style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #E5E7EB;
                                  font-size:.85rem;height:68px;resize:none;box-sizing:border-box;outline:none;"></textarea>
               </div>
             </div>
           </details>
   
           <button id="analyseBtn" onclick="window._daRun()"
                   style="width:100%;padding:15px;border-radius:14px;border:none;
                          background:linear-gradient(135deg,#10B981,#059669);color:white;
                          font-size:1rem;font-weight:800;cursor:pointer;
                          box-shadow:0 4px 14px rgba(16,185,129,.3);">
             🔬 Analyse with AI
           </button>
   
           <div id="resultArea"></div>
   
         </div>
       </div>`,window.showScreen=h,document.getElementById("photoInput").addEventListener("change",o=>{o.target.files[0]&&y(o.target.files[0])})}let c=null,x="image/jpeg";function y(t){if(t.size>8*1024*1024){alert("Image too large (max 8MB)");return}x=t.type||"image/jpeg";const e=new FileReader;e.onload=o=>{c=o.target.result.split(",")[1],document.getElementById("imgPreview").src=o.target.result,document.getElementById("imgPreviewWrap").style.display="block",document.getElementById("dropZone").style.display="none"},e.readAsDataURL(t)}window._daDrop=t=>{t.preventDefault();const e=t.dataTransfer.files[0];e!=null&&e.type.startsWith("image/")&&y(e),document.getElementById("dropZone").style.borderColor="#D1FAE5",document.getElementById("dropZone").style.background="#FAFFFE"};window._daClear=()=>{c=null,document.getElementById("photoInput").value="",document.getElementById("imgPreviewWrap").style.display="none",document.getElementById("dropZone").style.display="block"};window._daSelectCrop=t=>{document.getElementById("plantNameInput").value=t,document.querySelectorAll(".crop-chip").forEach(e=>{const o=e.innerText.includes(t);e.style.background=o?"#D1FAE5":"white",e.style.borderColor=o?"#10B981":"#E5E7EB",e.style.color=o?"#065F46":"#374151",e.style.fontWeight=o?"700":"400"})};window._daRun=async function(t={}){var u,g,m,b;const e=document.getElementById("plantNameInput").value.trim();if(!e){alert("Please select or type the plant name.");return}const o={temperature:((u=document.getElementById("ctxTemp"))==null?void 0:u.value)||null,humidity:((g=document.getElementById("ctxHumid"))==null?void 0:g.value)||null,daysSincePlant:((m=document.getElementById("ctxDays"))==null?void 0:m.value)||null,notes:((b=document.getElementById("ctxNotes"))==null?void 0:b.value)||null};if(!c&&!o.notes&&!o.temperature&&!o.humidity){alert("Please either upload a photo OR provide some farm context/symptoms text so the AI can diagnose.");return}const i=document.getElementById("analyseBtn"),l=document.getElementById("resultArea");i.disabled=!0,i.style.opacity=".65",i.innerText=t&&Object.keys(t).length?"🔄 Re-analysing…":"🔬 Analysing…";const r=c?"AI is examining your plant photo…":"AI is analyzing your farm context & symptoms…",s=c?"Takes 5–10 seconds via Groq vision":"Processing text parameters via Groq core";l.innerHTML=`
      <div style="background:white;border-radius:16px;padding:28px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.05);">
        <div style="font-size:2.2rem;margin-bottom:12px;">🧠</div>
        <div style="font-weight:700;color:#111;margin-bottom:6px;">
          ${Object.keys(t).length?"Refining diagnosis…":r}
        </div>
        <div style="font-size:.8rem;color:#9CA3AF;">${s}</div>
        <div id="ldots" style="margin-top:14px;font-size:1.4rem;letter-spacing:6px;color:#10B981;">· · ·</div>
      </div>`;const n=["· · ·","● · ·","· ● ·","· · ●"];let d=0;const a=setInterval(()=>{const p=document.getElementById("ldots");p?p.innerText=n[d++%4]:clearInterval(a)},380);try{const p=await fetch(`${w}/api/ai/disease-analysis`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:c||null,mediaType:c?x:null,plantName:e,plantSpecies:e.toLowerCase().replace(/\s+/g,"_"),farmContext:o,answers:t})});if(clearInterval(a),!p.ok){const f=await p.json();throw new Error(f.error||"Server error")}F(await p.json(),e)}catch(p){clearInterval(a),l.innerHTML=`
          <div style="background:white;border-radius:16px;padding:20px;border-left:4px solid #EF4444;box-shadow:0 2px 8px rgba(0,0,0,.05);">
            <div style="font-weight:700;color:#DC2626;margin-bottom:6px;">⚠️ Analysis failed</div>
            <div style="font-size:.84rem;color:#4B5563;">${p.message}</div>
          </div>`}finally{i.disabled=!1,i.style.opacity="1",i.innerText="🔬 Analyse with AI"}};function F(t,e){var n;const o={low:{color:"#059669",bg:"#D1FAE5",label:"Low Risk",icon:"🟢"},medium:{color:"#D97706",bg:"#FEF3C7",label:"Moderate",icon:"🟡"},high:{color:"#DC2626",bg:"#FEE2E2",label:"High Risk",icon:"🔴"},unknown:{color:"#6B7280",bg:"#F3F4F6",label:"Unknown",icon:"⚪"}}[t.severity]||{color:"#6B7280",bg:"#F3F4F6",label:"Unknown",icon:"⚪"},i=Math.round((t.confidence||0)*100),l=i>=80?"#10B981":i>=50?"#F59E0B":"#EF4444",r=d=>({"#374151":{bg:"#F8FAFC",border:"#E2E8F0",check:"🔹"},"#92400E":{bg:"#FFFBEB",border:"#FDE68A",check:"🔸"},"#065F46":{bg:"#ECFDF5",border:"#A7F3D0",check:"✅"},"#1E40AF":{bg:"#EFF6FF",border:"#BFDBFE",check:"💡"}})[d]||{bg:"#F9FAFB",border:"#E5E7EB",check:"▪️"},s=(d,a,u,g="#374151")=>{if(!u||!u.length)return"";const m=r(g),b=u.map(p=>`
          <div style="display:flex; align-items:flex-start; gap:10px; background:white; padding:12px 14px; 
                      border-radius:10px; box-shadow:0 2px 4px rgba(0,0,0,0.02); 
                      border:1px solid ${m.border}; margin-bottom:8px;">
              <div style="font-size:0.85rem; margin-top:2px; flex-shrink:0;">${m.check}</div>
              <div style="font-size:0.84rem; color:#334155; line-height:1.5; font-weight:500;">${p}</div>
          </div>
      `).join("");return`
      <div style="display:flex; flex-direction:column; height:100%; background:${m.bg}; border-radius:16px; padding:18px; border:1px solid ${m.border}; box-sizing:border-box;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
              <div style="background:white; width:34px; height:34px; display:flex; align-items:center; justify-content:center; 
                          border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.06); font-size:1.1rem; border:1px solid ${m.border};">
                  ${d}
              </div>
              <div style="font-weight:800; font-size:0.95rem; color:${g}; letter-spacing:0.02em;">
                  ${a}
              </div>
          </div>
          <div style="display:flex; flex-direction:column; flex:1;">
              ${b}
          </div>
      </div>`};document.getElementById("resultArea").innerHTML=`
       <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.07);">
   
         <div style="padding:18px;background:${o.bg};">
           <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
             <div style="flex:1;">
               <div style="font-size:.68rem;color:${o.color};font-weight:700;letter-spacing:.08em;margin-bottom:3px;">
                 DIAGNOSIS · ${e.toUpperCase()}
               </div>
               <div style="font-weight:900;font-size:1.05rem;color:#111;line-height:1.3;">${t.condition}</div>
             </div>
             <div style="text-align:center;flex-shrink:0;">
               <div style="font-size:1.8rem;">${o.icon}</div>
               <div style="font-size:.68rem;font-weight:700;color:${o.color};margin-top:1px;">${o.label}</div>
             </div>
           </div>
         </div>
   
         <div style="padding:14px 18px;border-bottom:1px solid #F3F4F6;">
           <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;">
             <span style="font-size:.73rem;font-weight:700;color:#9CA3AF;">AI Confidence</span>
             <span style="font-size:.82rem;font-weight:800;color:${l};">${i}%</span>
           </div>
           <div style="background:#F3F4F6;border-radius:8px;height:7px;overflow:hidden;">
             <div style="height:100%;width:${i}%;background:${l};border-radius:8px;transition:width .6s;"></div>
           </div>
           ${t.confidenceExplanation?`<div style="font-size:.71rem;color:#9CA3AF;margin-top:5px;line-height:1.4;">${t.confidenceExplanation}</div>`:""}
         </div>
   
         <div style="margin: 16px 18px 0; padding: 12px 14px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; display:flex; align-items:center; gap:10px;">
           <span style="font-size:1.4rem;">⏳</span>
           <div>
             <div style="font-size: 0.72rem; color: #166534; font-weight:700; letter-spacing: 0.03em;">ESTIMATED TREATMENT TIME</div>
             <div style="font-weight: 800; font-size: 0.95rem; color: #14532D;">${t.treatmentDuration}</div>
           </div>
         </div>
   
         <div style="padding:16px 18px; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; align-items:stretch;">
           ${s("🔍","Evidence observed",t.evidence,"#374151")}
           ${s("⚠️","Likely causes",t.likelyCauses,"#92400E")}
           ${s("💊","Recommended actions",t.solutions,"#065F46")}
           ${s("🛡️","Prevention tips",t.prevention,"#1E40AF")}
         </div>
   
         ${t.needsMoreInfo?"":`
          <div id="cameraAuthBlock" style="padding:16px 18px; background:#F8FAFC; border-top:1px solid #E2E8F0; border-bottom:1px solid #E2E8F0; margin-top:16px;">
            <div style="font-weight:700;font-size:.82rem;color:#334155;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
              <span>🤖</span> AI Continuous Track Setup
            </div>
            <div style="font-size:.76rem;color:#64748B;line-height:1.4;margin-bottom:12px;">
              Diagnosis confirmed. To ensure treatment success, would you like to allow SeedDown AI to look through the active CCTV camera at this specific zone?
            </div>
            <div style="display:grid;grid-template-columns: 1fr 1fr; gap:10px;">
              <button onclick="window._daGrantCamera('${t.treatmentDuration}')" 
                      style="padding:10px; background:#10B981; color:white; border:none; font-weight:700; font-size:.8rem; border-radius:8px; cursor:pointer; transition: all 0.2s;">
                ✅ Grant Access
              </button>
              <button onclick="window._daRefuseCamera('${t.treatmentDuration}')" 
                      style="padding:10px; background:#64748B; color:white; border:none; font-weight:700; font-size:.8rem; border-radius:8px; cursor:pointer; transition: all 0.2s;">
                ❌ Refuse
              </button>
            </div>
            <div id="cameraFeedback" style="margin-top:10px; font-size:.76rem; font-weight:600; display:none;"></div>
          </div>
          `}
   
         ${t.needsMoreInfo&&((n=t.followUpQuestions)!=null&&n.length)?`
          <div style="padding:16px 18px;background:#FFFBEB;border-top:1px solid #FDE68A;">
            <div style="font-weight:700;font-size:.84rem;color:#92400E;margin-bottom:10px;">
              🤔 Need more info (Confidence < 80%) — please answer:
            </div>
            
            ${t.followUpQuestions.map((d,a)=>d.toLowerCase().includes("photo")||d.toLowerCase().includes("image")||d.toLowerCase().includes("picture")||d.includes("照片")?`
                    <div style="margin-bottom:12px;">
                      <label style="font-size:.78rem;color:#78350F;display:block;margin-bottom:6px;">${d}</label>
                      
                      <div id="fqa_photo_preview_wrap_${a}" style="display:none; margin-bottom: 8px;">
                        <img id="fqa_photo_preview_${a}" style="max-height:120px; border-radius:6px; border:1px solid #FDE68A;">
                      </div>
 
                      <button onclick="document.getElementById('fqa_file_input_${a}').click()"
                              id="fqa_upload_btn_${a}"
                              style="display:flex; align-items:center; gap:8px; padding:9px 14px; background:white; 
                                     border:1.5px dashed #F59E0B; color:#92400E; font-size:.82rem; font-weight:700; 
                                     border-radius:8px; cursor:pointer; width:100%; justify-content:center;">
                        📸 Click to Take Photo / Upload Image
                      </button>
                      <input type="file" id="fqa_file_input_${a}" accept="image/*" style="display:none;"
                             onchange="window._daHandleFollowUpPhoto(this, ${a})">
                      
                      <input type="hidden" id="fqa_${a}" value="[New Photo Attached Below]">
                    </div>`:`
                    <div style="margin-bottom:10px;">
                      <label style="font-size:.78rem;color:#78350F;display:block;margin-bottom:3px;">${d}</label>
                      <input type="text" id="fqa_${a}" placeholder="Your answer…"
                             style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #FDE68A;
                                    font-size:.84rem;box-sizing:border-box;background:white;outline:none;">
                    </div>`).join("")}
 
            <button onclick="window._daRefine(${JSON.stringify(t.followUpQuestions).replace(/"/g,"&quot;")})"
                    style="width:100%;margin-top:8px;padding:12px;border-radius:10px;border:none;
                           background:#F59E0B;color:white;font-weight:800;cursor:pointer;font-size:.88rem;
                           box-shadow: 0 2px 6px rgba(245,158,11,0.2);">
              🔄 Re-analyse with my answers
            </button>
          </div>`:""}
   
         <div style="padding:14px 18px;border-top:1px solid #F3F4F6;">
           <button onclick="window._daClear();document.getElementById('resultArea').innerHTML='';window.scrollTo(0,0);"
                   style="width:100%;padding:11px;border-radius:10px;border:1.5px solid #E5E7EB;
                          background:white;font-weight:700;font-size:.88rem;cursor:pointer;color:#374151;">
             📷 Scan another plant
           </button>
         </div>
       </div>`,document.getElementById("resultArea").scrollIntoView({behavior:"smooth",block:"start"})}window._daGrantCamera=function(t){const e=document.getElementById("cameraFeedback");e.style.display="block",e.style.color="#059669",e.innerHTML=`🟢 Access Granted! AI has linked to Zone CCTV. Continuous tracking initialized for the next ${t}.`,document.querySelectorAll("#cameraAuthBlock button").forEach(i=>i.disabled=!0)};window._daRefuseCamera=function(t){const e=document.getElementById("cameraFeedback");e.style.display="block",e.style.color="#EA580C",e.innerHTML=`⚠️ Access Refused. We respect your choice. SeedDown has scheduled an automated system notification to remind you to manually upload a validation picture in <b>${t}</b>.`,console.log(`[Notification Engine] Scheduled reminder in ${t} for manual disease health checks.`),window.Notification&&Notification.permission==="granted"&&setTimeout(()=>{new Notification("SeedDown Crop Health Update",{body:`Your plant's ${t} treatment time has arrived. Please open AI Disease Analysis and snap a new picture.`,icon:"🌱"})},5e3),document.querySelectorAll("#cameraAuthBlock button").forEach(i=>i.disabled=!0)};window._daNewUploadB64=null;window._daNewUploadMime="image/jpeg";window._daHandleFollowUpPhoto=function(t,e){const o=t.files[0];if(!o)return;window._daNewUploadMime=o.type||"image/jpeg";const i=new FileReader;i.onload=function(l){window._daNewUploadB64=l.target.result.split(",")[1],document.getElementById(`fqa_photo_preview_${e}`).src=l.target.result,document.getElementById(`fqa_photo_preview_wrap_${e}`).style.display="block";const r=document.getElementById(`fqa_upload_btn_${e}`);r.innerHTML=`✅ Photo Attached (${(o.size/1024).toFixed(1)} KB) - Tap to change`,r.style.background="#FEF3C7",r.style.borderStyle="solid"},i.readAsDataURL(o)};window._daRefine=function(t){const e={};if(t.forEach((o,i)=>{var r,s;const l=(s=(r=document.getElementById(`fqa_${i}`))==null?void 0:r.value)==null?void 0:s.trim();l&&(e[o]=l)}),!Object.keys(e).length&&!window._daNewUploadB64){alert("Please answer at least one question or upload a photo.");return}if(window._daNewUploadB64){c=window._daNewUploadB64,x=window._daNewUploadMime;const o=document.getElementById("imgPreview");o&&(o.src=`data:${x};base64,${c}`);const i=document.getElementById("imgPreviewWrap");i&&(i.style.display="block");const l=document.getElementById("dropZone");l&&(l.style.display="none"),window._daNewUploadB64=null}window._daRun(e)};export{z as render};
