import{A as c,s as T,a as m}from"./index-D5jvxCsW.js";import{a as R}from"./firebaseAiLogic-BjKxIkAD.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const H="user_farms",E="seeddown_disease_reports";let v=null,f="image/jpeg",s=null,d=null,l=null;function V(){d=F();const e=K(d);s=_(e),v=null,f="image/jpeg",l=null;const t=document.getElementById("screenContainer");t.innerHTML=`
        <div class="screen active" id="diseaseScreen" style="background:var(--bg);display:flex;flex-direction:column;height:100vh;color:var(--text);">
            <div class="topbar">
                <button id="diseaseBackBtn" class="back-btn" style="background:transparent;border:none;font-size:20px;cursor:pointer;color:var(--text);">←</button>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Plant Disease Analysis</div>
                    <div style="font-size:10px;color:var(--muted);font-weight:900;text-transform:uppercase;letter-spacing:.06em;">${o((d==null?void 0:d.name)||c.farmName||"Commercial Farm")}</div>
                </div>
                <button id="diseaseHistoryBtn" style="border:1px solid var(--border);background:var(--surface);color:var(--accent);border-radius:10px;padding:8px 11px;font-size:11px;font-weight:900;cursor:pointer;">History</button>
            </div>

            <div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px;">
                <section class="disease-hero">
                    <div class="disease-hero-icon">AI</div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.08em;">Known plant + new photo</div>
                        <div style="font-size:20px;font-weight:950;line-height:1.1;margin-top:3px;">Diagnose suspected plant disease</div>
                        <div style="font-size:13px;color:var(--sub);line-height:1.4;margin-top:6px;">SeedDown uses the plant remembered during field creation, checks the new photo, then explains likely cause, confidence, and treatment steps.</div>
                    </div>
                </section>

                <section class="disease-card">
                    <div class="disease-section-title">1. Select suspected plant</div>
                    <div id="plantSelector" class="plant-selector">
                        ${U(e)}
                    </div>
                    <div id="plantContext" class="plant-context">${A(s)}</div>
                </section>

                <section class="disease-card">
                    <div class="disease-section-title">2. Capture or upload symptom photo</div>
                    <label class="photo-drop" for="diseasePhotoInput">
                        <div id="photoPreview" class="photo-preview-empty">
                            <span style="font-size:26px;">📷</span>
                            <strong>Add leaf / stem / fruit photo</strong>
                            <small>Use a close-up photo with clear lighting</small>
                        </div>
                    </label>
                    <input id="diseasePhotoInput" type="file" accept="image/*" capture="environment" style="display:none;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">
                        <button id="choosePhotoBtn" class="disease-secondary-btn">Choose Photo</button>
                        <button id="runDiseaseBtn" class="disease-primary-btn">Run Analysis</button>
                    </div>
                </section>

                <section id="analysisState" class="disease-card disease-muted-card">
                    <div style="display:flex;gap:10px;align-items:flex-start;">
                        <div class="disease-mini-icon">?</div>
                        <div>
                            <div style="font-size:14px;font-weight:900;">Waiting for plant photo</div>
                            <div style="font-size:12px;color:var(--sub);line-height:1.4;margin-top:3px;">Choose the plant and upload a symptom photo. If confidence is low, SeedDown will ask extra questions before making a final recommendation.</div>
                        </div>
                    </div>
                </section>

                <section id="analysisResult" style="display:none;"></section>

                <div style="height:10px;"></div>
            </div>
        </div>
    `,Q(),M(e)}function M(e){var t,n,i,a,p;(t=document.getElementById("diseaseBackBtn"))==null||t.addEventListener("click",()=>T("dash-c")),(n=document.getElementById("diseaseHistoryBtn"))==null||n.addEventListener("click",j),(i=document.getElementById("choosePhotoBtn"))==null||i.addEventListener("click",()=>{var r;return(r=document.getElementById("diseasePhotoInput"))==null?void 0:r.click()}),(a=document.getElementById("diseasePhotoInput"))==null||a.addEventListener("change",D),(p=document.getElementById("runDiseaseBtn"))==null||p.addEventListener("click",()=>C()),document.querySelectorAll(".plant-choice").forEach(r=>{r.addEventListener("click",()=>{const h=Number(r.dataset.index);s=e[h]||s,document.querySelectorAll(".plant-choice").forEach(z=>z.classList.remove("selected")),r.classList.add("selected");const g=document.getElementById("plantContext");g&&(g.innerHTML=A(s))})})}async function D(e){var a;const t=(a=e.target.files)==null?void 0:a[0];if(!t)return;f=t.type||"image/jpeg";const n=await q(t);v=n.split(",")[1]||"";const i=document.getElementById("photoPreview");i&&(i.className="photo-preview-filled",i.innerHTML=`<img src="${n}" alt="Selected plant symptom photo"><div><strong>${o(t.name||"Plant photo")}</strong><small>${Math.round(t.size/1024)} KB - ready for analysis</small></div>`)}async function C(e={}){if(!s){m("warning","Select a plant first");return}if(!v){m("warning","Upload or capture a plant photo first");return}b(!0);try{const t=w(d,s),n=await R({image:v,mediaType:f,plantName:s.name,plantSpecies:s.species,farmContext:t,answers:e});l=I(n||k(s,t),s),S(l,s,d),x(l),m(n?"success":"warning",n?"AI disease analysis completed":"AI unavailable, using safe fallback analysis")}catch(t){console.warn("[DiseaseAnalysis] AI failed, using fallback:",t);const n=w(d,s);l=I(k(s,n,!0),s),S(l,s,d),x(l),m("warning","AI unavailable. Showing cautious fallback analysis.")}finally{b(!1)}}function x(e){var a,p;const t=document.getElementById("analysisState"),n=document.getElementById("analysisResult");if(t&&(t.style.display="none"),!n)return;const i=Math.round((e.confidence||0)*100);n.style.display="block",n.innerHTML=`
        <section class="disease-result-card severity-${o(e.severity)}">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                <div>
                    <div style="font-size:11px;font-weight:900;color:var(--accent);text-transform:uppercase;letter-spacing:.08em;">Most likely diagnosis</div>
                    <div style="font-size:22px;font-weight:950;line-height:1.15;margin-top:5px;">${o(e.condition)}</div>
                    <div style="font-size:13px;color:var(--sub);margin-top:5px;">${o(e.plant)} - Severity: ${o(e.severity)}</div>
                </div>
                <button id="confidenceToggle" class="confidence-pill" type="button">
                    <span>${i}%</span>
                    <small>confidence</small>
                </button>
            </div>
            <div id="confidenceExplain" class="confidence-explain" style="display:none;">${o(e.confidenceExplanation)}</div>
        </section>

        ${e.needsMoreInfo?N(e.followUpQuestions):""}

        <section class="disease-grid">
            ${y("Evidence",e.evidence,"Observed clues from photo/context")}
            ${y("Likely Causes",e.likelyCauses,"What may be triggering it")}
            ${y("Solution",e.solutions,"Action steps for the grower")}
            ${y("Prevention",e.prevention,"Avoid recurrence")}
        </section>
    `,(a=document.getElementById("confidenceToggle"))==null||a.addEventListener("click",()=>{const r=document.getElementById("confidenceExplain");r&&(r.style.display=r.style.display==="none"?"block":"none")}),(p=document.getElementById("submitFollowUpBtn"))==null||p.addEventListener("click",()=>{const r={};document.querySelectorAll(".follow-answer").forEach((h,g)=>{r[`answer_${g+1}`]=h.value.trim()}),C(r)})}function N(e){return`
        <section class="disease-card follow-card">
            <div class="disease-section-title">Need more context</div>
            <div style="font-size:13px;color:var(--sub);line-height:1.4;margin-bottom:10px;">Confidence is low, so SeedDown asks follow-up questions before making a stronger recommendation.</div>
            ${(e.length?e:["Are the spots powdery, watery, or dry?","Which plant part changed first: older leaves, new leaves, stem, or fruit?","Did humidity, watering, or airflow change recently?"]).map((n,i)=>`
                <label style="display:block;margin-top:10px;">
                    <span style="display:block;font-size:12px;font-weight:900;margin-bottom:5px;">${o(n)}</span>
                    <textarea class="follow-answer" rows="2" placeholder="Type answer ${i+1}" style="width:100%;resize:vertical;border:1px solid var(--border);border-radius:12px;padding:10px;background:var(--surface2);color:var(--text);outline:none;"></textarea>
                </label>
            `).join("")}
            <button id="submitFollowUpBtn" class="disease-primary-btn" style="margin-top:12px;width:100%;">Refine Analysis</button>
        </section>
    `}function y(e,t,n){const i=t!=null&&t.length?t:[n];return`
        <section class="disease-card small">
            <div class="disease-section-title">${o(e)}</div>
            <ul style="margin:10px 0 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;">
                ${i.map(a=>`<li class="disease-list-item">${o(a)}</li>`).join("")}
            </ul>
        </section>
    `}function b(e){const t=document.getElementById("runDiseaseBtn");t&&(t.disabled=e,t.textContent=e?"Analysing...":"Run Analysis")}function j(){const e=B().slice(0,5),t=document.getElementById("analysisState"),n=document.getElementById("analysisResult");t&&(t.style.display="none"),n&&(n.style.display="block",n.innerHTML=`
        <section class="disease-card">
            <div class="disease-section-title">Recent disease reports</div>
            ${e.length?e.map(i=>`
                <div class="history-row">
                    <div>
                        <strong>${o(i.plantName)}</strong>
                        <small>${o(i.condition)} - ${Math.round((i.confidence||0)*100)}% confidence</small>
                    </div>
                    <span>${o(new Date(i.createdAt).toLocaleDateString())}</span>
                </div>
            `).join(""):'<div style="font-size:13px;color:var(--sub);">No disease reports yet.</div>'}
        </section>
    `)}function U(e){return e.length?e.map((t,n)=>`
        <button class="plant-choice ${t===s?"selected":""}" data-index="${n}" type="button">
            <span>${o(t.emoji||"🌱")}</span>
            <strong>${o(t.name||"Plant")}</strong>
            <small>${o(L(t))}</small>
        </button>
    `).join(""):'<button class="plant-choice selected" data-index="0"><span>🌱</span><strong>Unknown Plant</strong><small>Add plants first</small></button>'}function A(e){return`
        <div><strong>Plant</strong><span>${o((e==null?void 0:e.name)||"Unknown Plant")}</span></div>
        <div><strong>Species</strong><span>${o((e==null?void 0:e.species)||"unknown")}</span></div>
        <div><strong>Status</strong><span>${o((e==null?void 0:e.status)||"suspected")}</span></div>
        <div><strong>Location</strong><span>${o(L(e))}</span></div>
    `}function F(){const e=O();return c.currentFarm||e.find(t=>t.id===c.currentFarmId)||e[e.length-1]||null}function K(e){const t=Array.isArray(e==null?void 0:e.plants)?e.plants:[];return t.length?t.map((n,i)=>({name:n.name||n.species||(e==null?void 0:e.targetPlant)||"Plant",species:n.species||P(n.name||(e==null?void 0:e.targetPlant)),emoji:n.emoji||$(n.name||(e==null?void 0:e.targetPlant)),status:n.status||"healthy",tier:n.tier,position:n.position,slotIndex:n.slotIndex??i})):[{name:(e==null?void 0:e.targetPlant)||"Unknown Plant",species:P((e==null?void 0:e.targetPlant)||"unknown"),emoji:$(e==null?void 0:e.targetPlant),status:"suspected",tier:(e==null?void 0:e.rackType)||"unknown",position:1,slotIndex:0}]}function _(e){return e.find(t=>["warning","critical","danger","suspected"].includes(String(t.status).toLowerCase()))||e[0]||null}function w(e,t){return{farmName:(e==null?void 0:e.name)||c.farmName||"Commercial Farm",location:(e==null?void 0:e.location)||"not provided",targetPlant:(e==null?void 0:e.targetPlant)||(t==null?void 0:t.name)||"Plant",rackType:(e==null?void 0:e.rackType)||(e==null?void 0:e.rackTypeId)||(e==null?void 0:e.rackLabel)||"vertical rack",analysisGoal:(e==null?void 0:e.analysisGoal)||(e==null?void 0:e.goal)||"plant health",selectedPlant:t,latestSensors:c.sensors||{}}}function k(e,t,n=!1){const i=String((e==null?void 0:e.species)||(e==null?void 0:e.name)||"").toLowerCase(),a={plant:(e==null?void 0:e.name)||"Plant",severity:n?"unknown":"medium",confidence:n?.48:.58,confidenceExplanation:n?"AI vision was unavailable, so this is a cautious rule-based estimate using plant type and farm context only.":"Confidence is moderate because the system has plant context, but the fallback cannot inspect symptoms as deeply as vision AI.",needsMoreInfo:!0,followUpQuestions:["Are the marks powdery, watery, dry, or yellow?","Did symptoms start on older leaves, new leaves, stem, or fruit?","Has humidity, airflow, watering, or nutrient mix changed recently?"]};return i.includes("tomato")||i.includes("chili")||i.includes("pepper")?{...a,condition:"Possible leaf spot or early blight stress",evidence:["Fruiting crops commonly show spots under high humidity or poor airflow","Known crop context points to tomato or pepper disease family"],likelyCauses:["High humidity with weak ventilation","Water splashing on leaves","Nutrient imbalance or infected older foliage"],solutions:["Remove heavily affected leaves","Improve airflow around the rack","Avoid wetting leaves during watering","Isolate the plant if spots spread quickly"],prevention:["Keep foliage dry","Space plants better","Check pH and nutrient EC regularly"]}:i.includes("lettuce")||i.includes("kale")||i.includes("spinach")?{...a,condition:"Possible tip burn, nutrient stress, or downy mildew",evidence:["Leafy greens are sensitive to airflow, calcium movement, and humidity","Vertical farms can trap moisture between leaves"],likelyCauses:["Poor airflow","High humidity","Nutrient or pH imbalance"],solutions:["Check pH and nutrient concentration","Increase air circulation","Remove damaged outer leaves","Reduce leaf wetness"],prevention:["Maintain stable pH","Avoid overcrowding","Keep air moving between tiers"]}:i.includes("cucumber")?{...a,condition:"Possible powdery mildew or water stress",evidence:["Cucumber is prone to mildew under humid indoor conditions","Symptoms often need close photo confirmation"],likelyCauses:["High humidity","Low airflow","Irregular watering"],solutions:["Improve ventilation","Remove infected leaves","Keep leaves dry","Monitor spread daily"],prevention:["Avoid crowding vines","Use consistent irrigation","Inspect leaves weekly"]}:{...a,condition:"Possible environmental stress, disease not confirmed",evidence:["The plant type is known, but symptoms need clearer confirmation"],likelyCauses:["Watering inconsistency","pH or nutrient imbalance","Low airflow or lighting stress"],solutions:["Take a closer photo of affected leaves","Check pH, moisture, and light readings","Compare new and old leaves"],prevention:["Record symptoms daily","Keep sensor thresholds within crop range","Avoid sudden changes in irrigation or light"]}}function I(e,t){const n=Math.min(1,Math.max(0,Number(e==null?void 0:e.confidence)||0));return{plant:(e==null?void 0:e.plant)||(t==null?void 0:t.name)||"Plant",condition:(e==null?void 0:e.condition)||"Unable to confirm disease",severity:["low","medium","high","unknown"].includes(e==null?void 0:e.severity)?e.severity:"unknown",confidence:n,confidenceExplanation:(e==null?void 0:e.confidenceExplanation)||"Confidence is based on visible symptoms, image clarity, and known plant context.",evidence:u(e==null?void 0:e.evidence),likelyCauses:u(e==null?void 0:e.likelyCauses),solutions:u(e==null?void 0:e.solutions),prevention:u(e==null?void 0:e.prevention),needsMoreInfo:!!(e!=null&&e.needsMoreInfo)||n<.55,followUpQuestions:u(e==null?void 0:e.followUpQuestions).slice(0,4)}}function S(e,t,n){const i=B();i.unshift({id:`disease_${Date.now()}`,createdAt:new Date().toISOString(),farmId:(n==null?void 0:n.id)||c.currentFarmId||null,farmName:(n==null?void 0:n.name)||c.farmName||"Commercial Farm",plantName:(t==null?void 0:t.name)||e.plant,condition:e.condition,confidence:e.confidence,severity:e.severity}),localStorage.setItem(E,JSON.stringify(i.slice(0,20)))}function B(){try{return JSON.parse(localStorage.getItem(E))||[]}catch{return[]}}function O(){try{return JSON.parse(localStorage.getItem(H))||[]}catch{return[]}}function q(e){return new Promise((t,n)=>{const i=new FileReader;i.onload=()=>t(String(i.result||"")),i.onerror=n,i.readAsDataURL(e)})}function u(e){return Array.isArray(e)?e.map(t=>String(t||"").trim()).filter(Boolean):[]}function L(e){return e?e.tier&&e.position?`Tier ${e.tier} - Slot ${e.position}`:e.slotIndex!==void 0?`Slot ${Number(e.slotIndex)+1}`:"Farm slot":"Unknown slot"}function P(e=""){return String(e||"plant").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")||"plant"}function $(e=""){const t=String(e).toLowerCase();return t.includes("lettuce")||t.includes("kale")||t.includes("cabbage")?"🥬":t.includes("tomato")?"🍅":t.includes("chili")||t.includes("pepper")?"🌶️":t.includes("cucumber")?"🥒":t.includes("basil")||t.includes("mint")||t.includes("spinach")?"🌿":"🌱"}function o(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function Q(){if(document.getElementById("disease-analysis-style"))return;const e=document.createElement("style");e.id="disease-analysis-style",e.textContent=`
        .disease-hero,
        .disease-card,
        .disease-result-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            box-shadow: var(--shadow-sm);
        }
        .disease-hero { display:flex; gap:14px; align-items:flex-start; padding:16px; }
        .disease-hero-icon,
        .disease-mini-icon {
            width:44px; height:44px; border-radius:15px; background:var(--accent-l); color:var(--accent);
            display:flex; align-items:center; justify-content:center; font-weight:950; flex-shrink:0;
        }
        .disease-mini-icon { width:34px; height:34px; border-radius:12px; }
        .disease-card { padding:16px; }
        .disease-card.small { min-height:150px; }
        .disease-muted-card { background:#f8fafc; }
        .disease-section-title { font-size:11px; color:var(--muted); font-weight:950; text-transform:uppercase; letter-spacing:.08em; }
        .plant-selector { display:grid; grid-template-columns:repeat(auto-fit,minmax(118px,1fr)); gap:10px; margin-top:12px; }
        .plant-choice { border:1px solid var(--border); background:var(--surface2); border-radius:16px; padding:12px; text-align:left; color:var(--text); cursor:pointer; }
        .plant-choice.selected { border-color:var(--accent); background:var(--accent-l); box-shadow:0 0 0 2px rgba(16,185,129,.08); }
        .plant-choice span { display:block; font-size:24px; line-height:1; }
        .plant-choice strong { display:block; margin-top:8px; font-size:13px; }
        .plant-choice small { display:block; margin-top:3px; color:var(--muted); font-size:10px; font-weight:800; }
        .plant-context { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-top:12px; }
        .plant-context div { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:10px; }
        .plant-context strong { display:block; font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; }
        .plant-context span { display:block; font-size:13px; font-weight:850; margin-top:3px; }
        .photo-drop { display:block; margin-top:12px; border:1px dashed rgba(16,185,129,.45); border-radius:18px; background:linear-gradient(135deg, rgba(236,253,245,.9), rgba(255,255,255,.8)); cursor:pointer; overflow:hidden; }
        .photo-preview-empty { min-height:150px; display:flex; flex-direction:column; gap:6px; align-items:center; justify-content:center; color:var(--sub); text-align:center; padding:16px; }
        .photo-preview-empty strong { color:var(--text); }
        .photo-preview-empty small { color:var(--muted); font-weight:700; }
        .photo-preview-filled { display:flex; gap:12px; align-items:center; padding:10px; }
        .photo-preview-filled img { width:96px; height:96px; border-radius:14px; object-fit:cover; border:1px solid var(--border); }
        .photo-preview-filled strong { display:block; font-size:13px; }
        .photo-preview-filled small { display:block; color:var(--muted); margin-top:4px; }
        .disease-primary-btn,
        .disease-secondary-btn { border:none; border-radius:14px; padding:13px 12px; font-weight:950; cursor:pointer; }
        .disease-primary-btn { background:var(--accent); color:white; }
        .disease-primary-btn:disabled { opacity:.55; cursor:wait; }
        .disease-secondary-btn { background:var(--surface2); border:1px solid var(--border); color:var(--accent); }
        .disease-result-card { padding:16px; border-left:5px solid var(--accent); }
        .severity-high { border-left-color:var(--danger); }
        .severity-medium { border-left-color:var(--warn); }
        .severity-low { border-left-color:var(--ok); }
        .confidence-pill { width:76px; height:62px; border:1px solid var(--border); border-radius:18px; background:var(--surface2); color:var(--text); cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; }
        .confidence-pill span { font-size:20px; font-weight:950; color:var(--accent); }
        .confidence-pill small { font-size:9px; color:var(--muted); font-weight:900; text-transform:uppercase; }
        .confidence-explain { margin-top:12px; padding:12px; border-radius:14px; background:var(--surface2); color:var(--sub); font-size:13px; line-height:1.45; }
        .disease-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-top:12px; }
        .disease-list-item { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:9px 10px; font-size:13px; color:var(--sub); line-height:1.35; }
        .follow-card { margin-top:12px; border-color:rgba(245,158,11,.35); background:#fffbeb; }
        .history-row { display:flex; justify-content:space-between; gap:10px; align-items:center; border:1px solid var(--border); border-radius:14px; padding:11px; margin-top:10px; background:var(--surface2); }
        .history-row strong, .history-row small { display:block; }
        .history-row small { color:var(--muted); margin-top:3px; }
        .history-row span { font-size:11px; color:var(--muted); font-weight:800; }
        @media (max-width: 620px) {
            .disease-grid { grid-template-columns:1fr; }
            .plant-context { grid-template-columns:1fr; }
        }
    `,document.head.appendChild(e)}export{V as render};
