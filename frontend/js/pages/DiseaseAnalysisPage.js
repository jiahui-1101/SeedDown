import { API_BASE } from '../utils/apiBase.js';
/* ============================================================
   DiseaseAnalysisPage.js — AI Disease Analysis (v4 — New UX)
   Confidence tiers:
     ≥ 80%  → Confirmed   → Green  → IoT block shown
     60–79% → Uncertain   → Yellow → Q&A follow-up shown
     < 60%  → Low         → Red    → Q&A follow-up shown
   No-image first pass: backend caps ≤ 69% (always triggers Q&A)
   Refine pass: +18% bonus → almost always crosses 80%

   Changes v4:
   - getPlantedCrops() reads ALL farms + BASE_CROPS fallback
   - Removed 69%-cap warning banner from UI
   - Brain loading animation → results rendered in a NEW screen
   - Follow-up Q&A always shown unless confidence ≥ 90%
   ============================================================ */
   import { showScreen } from '../utils/navigation.js';

   
   /* ── BASE_CROPS fallback (mirrors AddPlantModal.js) ── */
   const BASE_CROPS = [
     { emoji:'🥬', name:'Lettuce',  species:'lettuce'  },
     { emoji:'🌿', name:'Spinach',  species:'spinach'  },
     { emoji:'🌱', name:'Basil',    species:'basil'    },
     { emoji:'🍅', name:'Tomato',   species:'tomato'   },
     { emoji:'🥒', name:'Cucumber', species:'cucumber' },
     { emoji:'🥕', name:'Carrot',   species:'carrot'   },
     { emoji:'🥬', name:'Cabbage',  species:'cabbage'  },
     { emoji:'🍆', name:'Eggplant', species:'eggplant' },
   ];
   
   /* ── Helpers ── */
   function getPlantedCrops() {
     const seen = new Set(), result = [];
   
     function add(name, emoji) {
       if (!name) return;
       const key = name.toLowerCase().trim();
       if (seen.has(key)) return;
       seen.add(key);
       result.push({
         name: name.charAt(0).toUpperCase() + name.slice(1),
         emoji: emoji || emojiFor(name),
         species: key.replace(/\s+/g, '_'),
       });
     }
   
     try {
       // Read ALL farms, not just current
       const farms = JSON.parse(localStorage.getItem('user_farms') || '[]');
       farms.forEach(farm => {
         (farm.plants || []).forEach(p =>
           typeof p === 'string' ? add(p) : add(p.name || p.species, p.emoji)
         );
         (farm.zones || []).forEach(z =>
           (z.plants || []).forEach(p =>
             typeof p === 'string' ? add(p) : add(p.name || p.species, p.emoji)
           )
         );
       });
   
       // AppState tiles (beginner mode)
       (window.AppState?.tiles || []).forEach(t => {
         if (t.name && t.status !== 'empty') add(t.name, t.plant);
       });
     } catch (_) {}
   
     // If nothing found from user farms, fall back to BASE_CROPS
     if (!result.length) {
       BASE_CROPS.forEach(c => add(c.name, c.emoji));
     }
   
     return result;
   }
   
   function emojiFor(name = '') {
     const k = name.toLowerCase();
     if (k.includes('lettuce') || k.includes('cabbage') || k.includes('kale')) return '🥬';
     if (k.includes('tomato'))    return '🍅';
     if (k.includes('chili') || k.includes('pepper') || k.includes('capsicum')) return '🌶️';
     if (k.includes('strawberry')) return '🍓';
     if (k.includes('cucumber'))   return '🥒';
     if (k.includes('carrot'))     return '🥕';
     if (k.includes('spinach'))    return '🍃';
     if (k.includes('basil') || k.includes('mint') || k.includes('cilantro')) return '🌿';
     if (k.includes('bean'))       return '🫘';
     if (k.includes('eggplant'))   return '🍆';
     return '🌱';
   }
   
   /* ── Confidence tier helper ── */
   function confTier(pct) {
     if (pct >= 80) return { label: 'Confirmed',    color: '#10B981', bg: '#D1FAE5', bar: '#10B981', icon: '✅' };
     if (pct >= 60) return { label: 'Uncertain',    color: '#F59E0B', bg: '#FEF3C7', bar: '#F59E0B', icon: '🔶' };
     return              { label: 'Low Confidence', color: '#EF4444', bg: '#FEE2E2', bar: '#EF4444', icon: '🔴' };
   }
   
   /* ══════════════════════════════════════════
      SCREEN 1: Input form
   ══════════════════════════════════════════ */
   export function render() {
     const container = document.getElementById('screenContainer');
     const crops      = getPlantedCrops();
   
     container.innerHTML = `
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
             ${crops.map(p => `
               <button class="crop-chip" onclick="window._daSelectCrop('${p.name}')"
                       style="padding:7px 14px;border-radius:20px;border:1.5px solid #E5E7EB;
                              background:white;font-size:.82rem;cursor:pointer;
                              display:flex;align-items:center;gap:6px;transition:all .15s;">
                 <span>${p.emoji}</span><span>${p.name}</span>
               </button>`).join('')}
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
     </div>`;
   
     window.showScreen = showScreen;
     // FIX: use .onchange instead of addEventListener to prevent listener accumulation
     // on repeated render() calls (e.g. every 'Analyse another plant' click)
     document.getElementById('photoInput').onchange = e => {
       if (e.target.files[0]) _loadFile(e.target.files[0]);
     };
     document.getElementById('photoCameraInput').onchange = e => {
       if (e.target.files[0]) _loadFile(e.target.files[0]);
     };
   }
   
   /* ── Persistent state across screens ── */
   let _b64 = null, _mime = 'image/jpeg';
   let _cachedPlantName = '';
   let _cachedFarmContext = {};
   
   function _loadFile(file) {
     if (file.size > 8 * 1024 * 1024) { alert('Image too large (max 8 MB)'); return; }
     _mime = file.type || 'image/jpeg';
     const r = new FileReader();
     r.onload = e => {
       _b64 = e.target.result.split(',')[1];
       document.getElementById('imgPreview').src    = e.target.result;
       document.getElementById('imgPreviewWrap').style.display = 'block';
       document.getElementById('dropZone').style.display       = 'none';
     };
     r.readAsDataURL(file);
   }
   
   window._daDrop = e => {
     e.preventDefault();
     const f = e.dataTransfer.files[0];
     if (f?.type.startsWith('image/')) _loadFile(f);
     document.getElementById('dropZone').style.borderColor = '#D1FAE5';
     document.getElementById('dropZone').style.background  = '#FAFFFE';
   };
   
   window._daClear = () => {
     _b64 = null;
     document.getElementById('photoInput').value = '';
     document.getElementById('imgPreviewWrap').style.display = 'none';
     document.getElementById('dropZone').style.display       = 'block';
   };
   
   window._daSelectCrop = name => {
     document.getElementById('plantNameInput').value = name;
     document.querySelectorAll('.crop-chip').forEach(btn => {
       const isThis = btn.innerText.includes(name);
       btn.style.background  = isThis ? '#D1FAE5' : 'white';
       btn.style.borderColor = isThis ? '#10B981' : '#E5E7EB';
       btn.style.color       = isThis ? '#065F46' : '#374151';
       btn.style.fontWeight  = isThis ? '700' : '400';
     });
   };
   
   /* ── Temp photo cache for follow-up uploads ── */
   window._daNewUploadB64  = null;
   window._daNewUploadMime = 'image/jpeg';
   
   /* ══════════════════════════════════════════
      SCREEN 2: Brain loading animation
   ══════════════════════════════════════════ */
   function showBrainLoading(isRefine) {
     const container = document.getElementById('screenContainer');
     container.innerHTML = `
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
           ${isRefine ? 'Refining diagnosis…' : 'Analysing your plant…'}
         </div>
         <div style="font-size:.84rem;color:#059669;margin-bottom:24px;">
           ${isRefine ? 'Incorporating your answers into the model' : 'SeedDown AI is reading symptoms & patterns'}
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
     </div>`;
   }
   
   /* ══════════════════════════════════════════
      CORE: Submit for analysis
   ══════════════════════════════════════════ */
   window._daRun = async function (answers = {}) {
     // Read from DOM if on the form screen; otherwise use cached values from first run
     const plantNameEl = document.getElementById('plantNameInput');
     if (plantNameEl) {
       _cachedPlantName = plantNameEl.value.trim();
       _cachedFarmContext = {
         temperature:    document.getElementById('ctxTemp')?.value  || null,
         humidity:       document.getElementById('ctxHumid')?.value || null,
         daysSincePlant: document.getElementById('ctxDays')?.value  || null,
         notes:          document.getElementById('ctxNotes')?.value || null,
       };
     }
   
     const plantName   = _cachedPlantName;
     const farmContext = _cachedFarmContext;
   
     if (!plantName) { alert('Please select or type the plant name.'); return; }
   
     const hasContext = farmContext.notes || farmContext.temperature || farmContext.humidity;
     const isRefine = Object.keys(answers).length > 0;
     if (!_b64 && !hasContext && !isRefine) {
       alert('Please either upload a plant photo OR describe symptoms in Farm Context — the AI needs something to work with.');
       return;
     }
   
     // Switch to brain loading screen
     showBrainLoading(isRefine);
   
     try {
       const res = await fetch(`${API_BASE}/api/ai/disease-analysis`, {
         method:  'POST',
         headers: { 'Content-Type': 'application/json' },
         body:    JSON.stringify({
           image:        _b64 || null,
           mediaType:    _b64 ? _mime : null,
           plantName,
           plantSpecies: plantName.toLowerCase().replace(/\s+/g, '_'),
           farmContext,
           answers,
         }),
       });
   
       if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Server error'); }
       renderResult(await res.json(), plantName);
     } catch (err) {
       renderError(err.message, plantName);
     }
   };
   
   /* ── Error screen ── */
   function renderError(message) {
     const container = document.getElementById('screenContainer');
     container.innerHTML = `
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
           <div style="font-size:.85rem;color:#4B5563;margin-bottom:20px;">${message}</div>
           <button onclick="window._daBackToForm()"
                   style="width:100%;padding:12px;border-radius:10px;border:1.5px solid #E5E7EB;
                          background:white;font-weight:700;font-size:.88rem;cursor:pointer;color:#374151;">
             ← Try again
           </button>
         </div>
       </div>
     </div>`;
   }
   
   /* ── Back to form ── */
   window._daBackToForm = function () {
     // FIX: clear all cached state before re-rendering the form,
     // so the next analysis starts completely fresh
     _b64  = null;
     _mime = 'image/jpeg';
     _cachedPlantName  = '';
     _cachedFarmContext = {};
     window._daNewUploadB64  = null;
     window._daNewUploadMime = 'image/jpeg';
     render();
   };
   
   /* ══════════════════════════════════════════
      SCREEN 3: Results page
   ══════════════════════════════════════════ */
   function renderResult(data, plantName) {
     const pct  = Math.round((data.confidence || 0) * 100);
     const tier = confTier(pct);
   
     const sv = {
       low:     { color: '#059669', bg: '#D1FAE5', label: 'Low Risk',  icon: '🟢' },
       medium:  { color: '#D97706', bg: '#FEF3C7', label: 'Moderate',  icon: '🟡' },
       high:    { color: '#DC2626', bg: '#FEE2E2', label: 'High Risk', icon: '🔴' },
       unknown: { color: '#6B7280', bg: '#F3F4F6', label: 'Unknown',   icon: '⚪' },
     }[data.severity] || { color: '#6B7280', bg: '#F3F4F6', label: 'Unknown', icon: '⚪' };
   
     const THEMES = {
       evidence:   { bg: '#F8FAFC', border: '#E2E8F0', icon: '🔍', label: 'Evidence observed',  col: '#374151', check: '🔹' },
       causes:     { bg: '#FFFBEB', border: '#FDE68A', icon: '⚠️', label: 'Likely causes',       col: '#92400E', check: '🔸' },
       solutions:  { bg: '#ECFDF5', border: '#A7F3D0', icon: '💊', label: 'Recommended actions', col: '#065F46', check: '✅' },
       prevention: { bg: '#EFF6FF', border: '#BFDBFE', icon: '🛡️', label: 'Prevention tips',     col: '#1E40AF', check: '💡' },
     };
   
     function section(key, items) {
       if (!items?.length) return '';
       const t = THEMES[key];
       const cards = items.map(txt => `
         <div style="display:flex;align-items:flex-start;gap:10px;background:white;padding:12px 14px;
                     border-radius:10px;box-shadow:0 2px 4px rgba(0,0,0,.02);
                     border:1px solid ${t.border};margin-bottom:8px;">
           <div style="font-size:.85rem;margin-top:2px;flex-shrink:0;">${t.check}</div>
           <div style="font-size:.84rem;color:#334155;line-height:1.5;font-weight:500;">${txt}</div>
         </div>`).join('');
   
       return `
       <div style="display:flex;flex-direction:column;height:100%;background:${t.bg};
                   border-radius:16px;padding:18px;border:1px solid ${t.border};box-sizing:border-box;">
         <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
           <div style="background:white;width:34px;height:34px;display:flex;align-items:center;
                       justify-content:center;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.06);
                       font-size:1.1rem;border:1px solid ${t.border};">${t.icon}</div>
           <div style="font-weight:800;font-size:.95rem;color:${t.col};letter-spacing:.02em;">${t.label}</div>
         </div>
         <div style="flex:1;">${cards}</div>
       </div>`;
     }
   
     const confidenceBadgeHtml = `
       <div style="display:inline-flex;align-items:center;gap:6px;background:${tier.bg};
                   border:1px solid ${tier.color}33;border-radius:20px;padding:4px 12px;">
         <span style="font-size:.9rem;">${tier.icon}</span>
         <span style="font-weight:800;font-size:.8rem;color:${tier.color};">${tier.label}</span>
       </div>`;
   
     // IoT block (only when confirmed ≥ 80%)
     const iotBlock = !data.needsMoreInfo ? `
       <div id="cameraAuthBlock"
            style="padding:16px 18px;background:linear-gradient(135deg,#F0FDF4,#ECFDF5);
                   border-top:1px solid #A7F3D0;border-bottom:1px solid #A7F3D0;margin-top:4px;">
         <div style="font-weight:800;font-size:.88rem;color:#065F46;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
           <span>🤖</span> AI Continuous Monitoring Setup
         </div>
         <div style="font-size:.76rem;color:#047857;line-height:1.5;margin-bottom:12px;">
           Diagnosis confirmed at <strong>${pct}%</strong> confidence. Would you like SeedDown AI to monitor this zone via CCTV for the next <strong>${data.treatmentDuration}</strong>?
         </div>
         <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
           <button onclick="window._daGrantCamera('${data.treatmentDuration}')"
                   style="padding:11px;background:#10B981;color:white;border:none;font-weight:700;
                          font-size:.82rem;border-radius:10px;cursor:pointer;">
             ✅ Grant Access
           </button>
           <button onclick="window._daRefuseCamera('${data.treatmentDuration}')"
                   style="padding:11px;background:#64748B;color:white;border:none;font-weight:700;
                          font-size:.82rem;border-radius:10px;cursor:pointer;">
             ❌ Refuse
           </button>
         </div>
         <div id="cameraFeedback" style="margin-top:10px;font-size:.76rem;font-weight:600;display:none;"></div>
       </div>` : '';
   
     // Follow-up Q&A: always shown UNLESS confidence ≥ 90%
     // If backend didn't return questions (e.g. it was "confirmed" at 80-89%), generate defaults
     const defaultFollowUps = [
       `Have you noticed any changes in the affected area over the past few days (spreading, shrinking, colour shift)?`,
       `What are the current temperature and humidity conditions in the growing zone?`,
       `Are other plants nearby showing similar symptoms?`,
     ];
     const followUpQs = (data.followUpQuestions?.length ? data.followUpQuestions : defaultFollowUps);
     const showQA = pct < 90;
     const qaBlock = showQA ? `
       <div id="qaBlock" style="padding:16px 18px;background:#FFFBEB;border-top:1px solid #FDE68A;">
         <div style="font-weight:700;font-size:.84rem;color:#92400E;margin-bottom:6px;">
           🤔 Help us refine — confidence is ${pct}%
         </div>
         <div style="font-size:.75rem;color:#78350F;margin-bottom:12px;line-height:1.4;">
           Answer the questions below to sharpen the AI diagnosis.
         </div>
   
         ${followUpQs.map((q, i) => {
          const isPhotoQ = /photo|image|picture|照片/i.test(q);
          if (isPhotoQ) {
            return `
            <div style="margin-bottom:14px;">
              <label style="font-size:.78rem;color:#78350F;display:block;margin-bottom:6px;font-weight:600;">${q}</label>
              <div id="fqa_photo_preview_wrap_${i}" style="display:none;margin-bottom:8px;">
                <img id="fqa_photo_preview_${i}" style="max-height:120px;border-radius:6px;border:1px solid #FDE68A;">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <button onclick="document.getElementById('fqa_camera_input_${i}').click()"
                        id="fqa_camera_btn_${i}"
                        style="padding:10px 12px;background:#D97706;color:white;font-size:.82rem;font-weight:800;border:none;border-radius:8px;cursor:pointer;">
                  Take Photo
                </button>
                <button onclick="document.getElementById('fqa_file_input_${i}').click()"
                        id="fqa_upload_btn_${i}"
                        style="padding:10px 12px;background:white;border:1.5px dashed #F59E0B;color:#92400E;font-size:.82rem;font-weight:800;border-radius:8px;cursor:pointer;">
                  Upload Photo
                </button>
              </div>
              <input type="file" id="fqa_camera_input_${i}" accept="image/*" capture="environment" style="display:none;"
                     onchange="window._daHandleFollowUpPhoto(this,${i})">
              <input type="file" id="fqa_file_input_${i}" accept="image/*" style="display:none;"
                     onchange="window._daHandleFollowUpPhoto(this,${i})">
              <input type="hidden" id="fqa_${i}" value="">
            </div>`;
          }
          // Bug 修复分支：彻底纠正了原代码中标签闭合混乱、残缺样式属性错位的隐患
          return `
          <div style="margin-bottom:10px;">
            <label style="font-size:.78rem;color:#78350F;display:block;margin-bottom:3px;font-weight:600;">${q}</label>
            <textarea id="fqa_${i}" placeholder="Your answer…" rows="3"
                      style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #FDE68A;
                             font-size:.84rem;box-sizing:border-box;background:white;outline:none;
                             resize:vertical;line-height:1.5;font-family:inherit;"></textarea>
          </div>`;
        }).join('')}
      
        <button onclick="window._daRefine(${JSON.stringify(followUpQs).replace(/"/g,'&quot;')})"
                style="width:100%;margin-top:8px;padding:13px;border-radius:10px;border:none;
                       background:linear-gradient(135deg,#F59E0B,#D97706);color:white;font-weight:800;
                       cursor:pointer;font-size:.9rem;box-shadow:0 3px 8px rgba(245,158,11,.25);">
          🔄 Re-analyse with my answers
        </button>
      </div>` : '';
   
     const container = document.getElementById('screenContainer');
     container.innerHTML = `
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
           <div style="padding:18px;background:${sv.bg};">
             <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
               <div style="flex:1;">
                 <div style="font-size:.68rem;color:${sv.color};font-weight:700;letter-spacing:.08em;margin-bottom:3px;">
                   DIAGNOSIS · ${plantName.toUpperCase()}
                 </div>
                 <div style="font-weight:900;font-size:1.05rem;color:#111;line-height:1.3;">${data.condition}</div>
                 <div style="margin-top:8px;">${confidenceBadgeHtml}</div>
               </div>
               <div style="text-align:center;flex-shrink:0;">
                 <div style="font-size:1.8rem;">${sv.icon}</div>
                 <div style="font-size:.68rem;font-weight:700;color:${sv.color};margin-top:1px;">${sv.label}</div>
               </div>
             </div>
           </div>
   
           <!-- Confidence bar -->
           <div style="padding:14px 18px;border-bottom:1px solid #F3F4F6;">
             <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;">
               <span style="font-size:.73rem;font-weight:700;color:#9CA3AF;">AI Confidence</span>
               <span style="font-size:.82rem;font-weight:800;color:${tier.color};">${pct}%</span>
             </div>
             <div style="background:#F3F4F6;border-radius:8px;height:8px;overflow:hidden;">
               <div style="height:100%;width:${pct}%;background:${tier.bar};border-radius:8px;transition:width .7s ease;"></div>
             </div>
             ${data.confidenceExplanation ? `<div style="font-size:.71rem;color:#9CA3AF;margin-top:5px;line-height:1.4;">${data.confidenceExplanation}</div>` : ''}
           </div>
   
           <!-- Treatment time -->
           <div style="margin:14px 18px 0;padding:12px 14px;background:#F0FDF4;border:1px solid #BBF7D0;
                       border-radius:10px;display:flex;align-items:center;gap:10px;">
             <span style="font-size:1.4rem;">⏳</span>
             <div>
               <div style="font-size:.72rem;color:#166534;font-weight:700;letter-spacing:.03em;">ESTIMATED TREATMENT TIME</div>
               <div style="font-weight:800;font-size:.95rem;color:#14532D;">${data.treatmentDuration}</div>
             </div>
           </div>
   
           <!-- 4-quadrant grid -->
           <div style="padding:16px 18px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;align-items:stretch;">
             ${section('evidence',   data.evidence)}
             ${section('causes',     data.likelyCauses)}
             ${section('solutions',  data.solutions)}
             ${section('prevention', data.prevention)}
           </div>
   
           ${iotBlock}
           ${qaBlock}
   
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
     </div>`;
   
     window.scrollTo(0, 0);
   }
   
   /* ── IoT permission handlers ── */
   window._daGrantCamera = function (duration) {
     const fb = document.getElementById('cameraFeedback');
     fb.style.display = 'block';
     fb.style.color   = '#059669';
     fb.innerHTML     = `🟢 Access granted. AI has linked to Zone CCTV. Continuous tracking initialised for <strong>${duration}</strong>.`;
     document.querySelectorAll('#cameraAuthBlock button').forEach(b => b.disabled = true);
   };
   
   window._daRefuseCamera = function (duration) {
     const fb = document.getElementById('cameraFeedback');
     fb.style.display = 'block';
     fb.style.color   = '#EA580C';
     fb.innerHTML     = `⚠️ Access refused. SeedDown has scheduled an automated reminder in <strong>${duration}</strong> to manually upload a validation photo.`;
     document.querySelectorAll('#cameraAuthBlock button').forEach(b => b.disabled = true);
     console.log(`[Notification Engine] Scheduled reminder in ${duration} for manual disease health checks.`);
     if (window.Notification && Notification.permission === 'granted') {
       setTimeout(() => new Notification('SeedDown Crop Health Update', {
         body: `Your plant's ${duration} treatment window has passed. Please open AI Disease Analysis and take a new photo.`,
         icon: '🌱',
       }), 5000);
     }
   };
   
   /* ── Follow-up photo upload ── */
   window._daHandleFollowUpPhoto = function (inputEl, index) {
     const file = inputEl.files[0];
     if (!file) return;
     window._daNewUploadMime = file.type || 'image/jpeg';
     const reader = new FileReader();
     reader.onload = e => {
       window._daNewUploadB64 = e.target.result.split(',')[1];
       document.getElementById(`fqa_photo_preview_${index}`).src = e.target.result;
       document.getElementById(`fqa_photo_preview_wrap_${index}`).style.display = 'block';
       const btn = document.getElementById(`fqa_upload_btn_${index}`);
       btn.innerHTML         = `✅ Photo attached (${(file.size / 1024).toFixed(1)} KB) — tap to change`;
       btn.style.background  = '#FEF3C7';
       btn.style.borderStyle = 'solid';
       const cameraBtn = document.getElementById(`fqa_camera_btn_${index}`);
       if (cameraBtn) cameraBtn.textContent = 'Retake Photo';
       const hidden = document.getElementById(`fqa_${index}`);
       if (hidden) hidden.value = '[New Photo Attached]';
     };
     reader.readAsDataURL(file);
   };
   
   /* ── Refine / second-pass submission ── */
   window._daRefine = function (questions) {
     const answers = {};
     questions.forEach((q, i) => {
       const v = document.getElementById(`fqa_${i}`)?.value?.trim();
       if (v) answers[q] = v;
     });
   
     if (!Object.keys(answers).length && !window._daNewUploadB64) {
       alert('Please answer at least one question or upload a photo before re-analysing.');
       return;
     }
   
     // Promote the follow-up photo to the main image slot
     if (window._daNewUploadB64) {
       _b64  = window._daNewUploadB64;
       _mime = window._daNewUploadMime;
       window._daNewUploadB64 = null;
     }
   
     window._daRun(answers);
   };
   
