/* ============================================================
   DiseaseAnalysisPage.js — AI Disease Analysis (Optimized)
   ============================================================ */
   import { showScreen } from '../utils/navigation.js';

   const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
       ? 'http://localhost:3000' : window.location.origin;
   
   function getPlantedCrops() {
       const seen   = new Set();
       const result = [];
   
       function add(name, emoji) {
           if (!name) return;
           const key = name.toLowerCase().trim();
           if (seen.has(key)) return;
           seen.add(key);
           result.push({
               name:    name.charAt(0).toUpperCase() + name.slice(1),
               emoji:   emoji || emojiFor(name),
               species: key.replace(/\s+/g, '_'),
           });
       }
   
       try {
           const farms = JSON.parse(localStorage.getItem('user_farms') || '[]');
           const farm  = window.AppState?.currentFarm
               || farms.find(f => f.id === window.AppState?.currentFarmId)
               || farms[farms.length - 1];
   
           if (farm) {
               (farm.plants || []).forEach(p => {
                   if (typeof p === 'string') add(p);
                   else add(p.name || p.species, p.emoji);
               });
   
               (farm.zones || []).forEach(zone => {
                   (zone.plants || []).forEach(p => {
                       if (typeof p === 'string') add(p);
                       else add(p.name || p.species, p.emoji);
                   });
               });
           }
   
           (window.AppState?.tiles || []).forEach(tile => {
               if (tile.name && tile.status !== 'empty') add(tile.name, tile.plant);
           });
       } catch (_) {}
   
       return result;
   }
   
   function emojiFor(name = '') {
       const k = name.toLowerCase();
       if (k.includes('lettuce') || k.includes('cabbage') || k.includes('kale'))  return '🥬';
       if (k.includes('tomato'))   return '🍅';
       if (k.includes('chili') || k.includes('pepper') || k.includes('capsicum')) return '🌶️';
       if (k.includes('strawberry'))  return '🍓';
       if (k.includes('cucumber'))    return '🥒';
       if (k.includes('carrot'))      return '🥕';
       if (k.includes('spinach'))     return '🍃';
       if (k.includes('basil') || k.includes('mint') || k.includes('cilantro'))   return '🌿';
       if (k.includes('bean'))        return '🫘';
       return '🌱';
   }
   
   /* ── render ── */
   export function render() {
       const container = document.getElementById('screenContainer');
       const crops     = getPlantedCrops();
   
       container.innerHTML = `
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
   
             ${crops.length ? `
             <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;" id="cropChips">
               ${crops.map(p => `
                 <button class="crop-chip"
                         onclick="window._daSelectCrop('${p.name}')"
                         style="padding:7px 14px;border-radius:20px;border:1.5px solid #E5E7EB;
                                background:white;font-size:.82rem;cursor:pointer;
                                display:flex;align-items:center;gap:6px;transition:all .15s;">
                   <span>${p.emoji}</span><span>${p.name}</span>
                 </button>`).join('')}
             </div>
             <div style="font-size:.72rem;color:#9CA3AF;text-align:center;margin-bottom:10px;">— or type below —</div>
             ` : `
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
       </div>`;
   
       window.showScreen = showScreen;
       document.getElementById('photoInput').addEventListener('change', e => {
           if (e.target.files[0]) _loadFile(e.target.files[0]);
       });
   }
   
   let _b64 = null, _mime = 'image/jpeg';
   
   function _loadFile(file) {
       if (file.size > 8 * 1024 * 1024) { alert('Image too large (max 8MB)'); return; }
       _mime = file.type || 'image/jpeg';
       const r = new FileReader();
       r.onload = e => {
           _b64 = e.target.result.split(',')[1];
           document.getElementById('imgPreview').src = e.target.result;
           document.getElementById('imgPreviewWrap').style.display = 'block';
           document.getElementById('dropZone').style.display = 'none';
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
           btn.style.background    = isThis ? '#D1FAE5' : 'white';
           btn.style.borderColor   = isThis ? '#10B981' : '#E5E7EB';
           btn.style.color         = isThis ? '#065F46' : '#374151';
           btn.style.fontWeight    = isThis ? '700' : '400';
       });
   };
   
   /* ── main call ── */
   // 修改后的 DiseaseAnalysisPage.js 关键交互段落

/* ── render 函数中的上传面板部分（加一个 (Optional) 提示标签） ── */
// 您只需注意 innerHTML 里 Upload Section 的标题部分修改为：
// <div style="font-weight:700;font-size:.88rem;color:#374151;margin-bottom:12px;">📷 Upload Plant Photo <span style="font-size:0.75rem;color:#9CA3AF;font-weight:400;">(Optional)</span></div>


/* ── 修改核心的点击提交方法 _daRun ── */
window._daRun = async function(answers = {}) {
  // 🔍 删除了：if (!_b64) { alert('Please upload a plant photo first.'); return; }
  
  const plantName = document.getElementById('plantNameInput').value.trim();
  if (!plantName) { alert('Please select or type the plant name.'); return; }

  const farmContext = {
      temperature:    document.getElementById('ctxTemp')?.value  || null,
      humidity:       document.getElementById('ctxHumid')?.value || null,
      daysSincePlant: document.getElementById('ctxDays')?.value  || null,
      notes:          document.getElementById('ctxNotes')?.value || null,
  };

  // 🔍 新增安全逻辑：如果用户既没传照片，又没有写任何 Notes 描述和参数，则进行提醒，避免空数据提交
  if (!_b64 && !farmContext.notes && !farmContext.temperature && !farmContext.humidity) {
      alert('Please either upload a photo OR provide some farm context/symptoms text so the AI can diagnose.');
      return;
  }

  const btn        = document.getElementById('analyseBtn');
  const resultArea = document.getElementById('resultArea');
  btn.disabled = true; btn.style.opacity = '.65';
  btn.innerText = answers && Object.keys(answers).length ? '🔄 Re-analysing…' : '🔬 Analysing…';

  // 🔍 动态改变加载文案
  const loadingText = _b64 ? 'AI is examining your plant photo…' : 'AI is analyzing your farm context & symptoms…';
  const subLoadingText = _b64 ? 'Takes 5–10 seconds via Groq vision' : 'Processing text parameters via Groq core';

  resultArea.innerHTML = `
      <div style="background:white;border-radius:16px;padding:28px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.05);">
        <div style="font-size:2.2rem;margin-bottom:12px;">🧠</div>
        <div style="font-weight:700;color:#111;margin-bottom:6px;">
          ${Object.keys(answers).length ? 'Refining diagnosis…' : loadingText}
        </div>
        <div style="font-size:.8rem;color:#9CA3AF;">${subLoadingText}</div>
        <div id="ldots" style="margin-top:14px;font-size:1.4rem;letter-spacing:6px;color:#10B981;">· · ·</div>
      </div>`;

  const dotStates = ['· · ·','● · ·','· ● ·','· · ●'];
  let di = 0;
  const dint = setInterval(() => {
      const el = document.getElementById('ldots');
      if (el) el.innerText = dotStates[di++ % 4]; else clearInterval(dint);
  }, 380);

  try {
      const res = await fetch(`${API_BASE}/api/ai/disease-analysis`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
              image:       _b64 || null,      // 🔍 传给后端可以是 null
              mediaType:   _b64 ? _mime : null,
              plantName,
              plantSpecies: plantName.toLowerCase().replace(/\s+/g, '_'),
              farmContext,
              answers,
          }),
      });
      clearInterval(dint);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Server error'); }
      renderResult(await res.json(), plantName);
  } catch (err) {
      clearInterval(dint);
      resultArea.innerHTML = `
          <div style="background:white;border-radius:16px;padding:20px;border-left:4px solid #EF4444;box-shadow:0 2px 8px rgba(0,0,0,.05);">
            <div style="font-weight:700;color:#DC2626;margin-bottom:6px;">⚠️ Analysis failed</div>
            <div style="font-size:.84rem;color:#4B5563;">${err.message}</div>
          </div>`;
  } finally {
      btn.disabled = false; btn.style.opacity = '1'; btn.innerText = '🔬 Analyse with AI';
  }
};
   
   /* ── result card ── */
   function renderResult(data, plantName) {
       const sv = {
           low:     { color:'#059669', bg:'#D1FAE5', label:'Low Risk',   icon:'🟢' },
           medium:  { color:'#D97706', bg:'#FEF3C7', label:'Moderate',  icon:'🟡' },
           high:    { color:'#DC2626', bg:'#FEE2E2', label:'High Risk',  icon:'🔴' },
           unknown: { color:'#6B7280', bg:'#F3F4F6', label:'Unknown',   icon:'⚪' },
       }[data.severity] || { color:'#6B7280', bg:'#F3F4F6', label:'Unknown', icon:'⚪' };
   
       const pct       = Math.round((data.confidence || 0) * 100);
       // 门槛设定：低于80%显示黄色/橙色高警示样式
       const confColor = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';
   
      /* ── 升级版：现代 SaaS 风格卡片渲染器 (对应您的目标 UI) ── */
      const getTheme = (colorCode) => {
        // 为四大板块匹配不同的柔和渐变背景与边框
        const themes = {
            '#374151': { bg: '#F8FAFC', border: '#E2E8F0', check: '🔹' }, // Evidence (灰蓝主题)
            '#92400E': { bg: '#FFFBEB', border: '#FDE68A', check: '🔸' }, // Causes (琥珀主题)
            '#065F46': { bg: '#ECFDF5', border: '#A7F3D0', check: '✅' }, // Actions (翠绿主题)
            '#1E40AF': { bg: '#EFF6FF', border: '#BFDBFE', check: '💡' }  // Prevention (湛蓝主题)
        };
        return themes[colorCode] || { bg: '#F9FAFB', border: '#E5E7EB', check: '▪️' };
    };

    const section = (icon, title, items, colorCode = '#374151') => {
      if (!items || !items.length) return '';
      const theme = getTheme(colorCode);
      
      const cards = items.map(text => `
          <div style="display:flex; align-items:flex-start; gap:10px; background:white; padding:12px 14px; 
                      border-radius:10px; box-shadow:0 2px 4px rgba(0,0,0,0.02); 
                      border:1px solid ${theme.border}; margin-bottom:8px;">
              <div style="font-size:0.85rem; margin-top:2px; flex-shrink:0;">${theme.check}</div>
              <div style="font-size:0.84rem; color:#334155; line-height:1.5; font-weight:500;">${text}</div>
          </div>
      `).join('');

      // 🌟 移除了固定的 margin-top，使用 height:100% 和 flex 布局让内部自适应网格拉伸
      return `
      <div style="display:flex; flex-direction:column; height:100%; background:${theme.bg}; border-radius:16px; padding:18px; border:1px solid ${theme.border}; box-sizing:border-box;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
              <div style="background:white; width:34px; height:34px; display:flex; align-items:center; justify-content:center; 
                          border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.06); font-size:1.1rem; border:1px solid ${theme.border};">
                  ${icon}
              </div>
              <div style="font-weight:800; font-size:0.95rem; color:${colorCode}; letter-spacing:0.02em;">
                  ${title}
              </div>
          </div>
          <div style="display:flex; flex-direction:column; flex:1;">
              ${cards}
          </div>
      </div>`;
  };
   
       document.getElementById('resultArea').innerHTML = `
       <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.07);">
   
         <div style="padding:18px;background:${sv.bg};">
           <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
             <div style="flex:1;">
               <div style="font-size:.68rem;color:${sv.color};font-weight:700;letter-spacing:.08em;margin-bottom:3px;">
                 DIAGNOSIS · ${plantName.toUpperCase()}
               </div>
               <div style="font-weight:900;font-size:1.05rem;color:#111;line-height:1.3;">${data.condition}</div>
             </div>
             <div style="text-align:center;flex-shrink:0;">
               <div style="font-size:1.8rem;">${sv.icon}</div>
               <div style="font-size:.68rem;font-weight:700;color:${sv.color};margin-top:1px;">${sv.label}</div>
             </div>
           </div>
         </div>
   
         <div style="padding:14px 18px;border-bottom:1px solid #F3F4F6;">
           <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px;">
             <span style="font-size:.73rem;font-weight:700;color:#9CA3AF;">AI Confidence</span>
             <span style="font-size:.82rem;font-weight:800;color:${confColor};">${pct}%</span>
           </div>
           <div style="background:#F3F4F6;border-radius:8px;height:7px;overflow:hidden;">
             <div style="height:100%;width:${pct}%;background:${confColor};border-radius:8px;transition:width .6s;"></div>
           </div>
           ${data.confidenceExplanation ? `<div style="font-size:.71rem;color:#9CA3AF;margin-top:5px;line-height:1.4;">${data.confidenceExplanation}</div>` : ''}
         </div>
   
         <div style="margin: 16px 18px 0; padding: 12px 14px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; display:flex; align-items:center; gap:10px;">
           <span style="font-size:1.4rem;">⏳</span>
           <div>
             <div style="font-size: 0.72rem; color: #166534; font-weight:700; letter-spacing: 0.03em;">ESTIMATED TREATMENT TIME</div>
             <div style="font-weight: 800; font-size: 0.95rem; color: #14532D;">${data.treatmentDuration}</div>
           </div>
         </div>
   
         <div style="padding:16px 18px; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; align-items:stretch;">
           ${section('🔍','Evidence observed',    data.evidence,     '#374151')}
           ${section('⚠️','Likely causes',        data.likelyCauses,'#92400E')}
           ${section('💊','Recommended actions',  data.solutions,   '#065F46')}
           ${section('🛡️','Prevention tips',       data.prevention,  '#1E40AF')}
         </div>
   
         ${!data.needsMoreInfo ? `
          <div id="cameraAuthBlock" style="padding:16px 18px; background:#F8FAFC; border-top:1px solid #E2E8F0; border-bottom:1px solid #E2E8F0; margin-top:16px;">
            <div style="font-weight:700;font-size:.82rem;color:#334155;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
              <span>🤖</span> AI Continuous Track Setup
            </div>
            <div style="font-size:.76rem;color:#64748B;line-height:1.4;margin-bottom:12px;">
              Diagnosis confirmed. To ensure treatment success, would you like to allow SeedDown AI to look through the active CCTV camera at this specific zone?
            </div>
            <div style="display:grid;grid-template-columns: 1fr 1fr; gap:10px;">
              <button onclick="window._daGrantCamera('${data.treatmentDuration}')" 
                      style="padding:10px; background:#10B981; color:white; border:none; font-weight:700; font-size:.8rem; border-radius:8px; cursor:pointer; transition: all 0.2s;">
                ✅ Grant Access
              </button>
              <button onclick="window._daRefuseCamera('${data.treatmentDuration}')" 
                      style="padding:10px; background:#64748B; color:white; border:none; font-weight:700; font-size:.8rem; border-radius:8px; cursor:pointer; transition: all 0.2s;">
                ❌ Refuse
              </button>
            </div>
            <div id="cameraFeedback" style="margin-top:10px; font-size:.76rem; font-weight:600; display:none;"></div>
          </div>
          ` : ''}
   
         ${data.needsMoreInfo && data.followUpQuestions?.length ? `
          <div style="padding:16px 18px;background:#FFFBEB;border-top:1px solid #FDE68A;">
            <div style="font-weight:700;font-size:.84rem;color:#92400E;margin-bottom:10px;">
              🤔 Need more info (Confidence < 80%) — please answer:
            </div>
            
            ${data.followUpQuestions.map((q, i) => {
                // 🔍 智能检测 AI 的问题是否是在请求照片
                const isPhotoRequest = q.toLowerCase().includes('photo') || 
                                       q.toLowerCase().includes('image') || 
                                       q.toLowerCase().includes('picture') || 
                                       q.includes('照片');
 
                if (isPhotoRequest) {
                    // 📷 如果是在要照片，动态生成一个优雅的相机上传组件
                    return `
                    <div style="margin-bottom:12px;">
                      <label style="font-size:.78rem;color:#78350F;display:block;margin-bottom:6px;">${q}</label>
                      
                      <div id="fqa_photo_preview_wrap_${i}" style="display:none; margin-bottom: 8px;">
                        <img id="fqa_photo_preview_${i}" style="max-height:120px; border-radius:6px; border:1px solid #FDE68A;">
                      </div>
 
                      <button onclick="document.getElementById('fqa_file_input_${i}').click()"
                              id="fqa_upload_btn_${i}"
                              style="display:flex; align-items:center; gap:8px; padding:9px 14px; background:white; 
                                     border:1.5px dashed #F59E0B; color:#92400E; font-size:.82rem; font-weight:700; 
                                     border-radius:8px; cursor:pointer; width:100%; justify-content:center;">
                        📸 Click to Take Photo / Upload Image
                      </button>
                      <input type="file" id="fqa_file_input_${i}" accept="image/*" style="display:none;"
                             onchange="window._daHandleFollowUpPhoto(this, ${i})">
                      
                      <input type="hidden" id="fqa_${i}" value="[New Photo Attached Below]">
                    </div>`;
                } else {
                    // 📝 如果是普通的文本问题，依然保留原有的优雅文本输入框
                    return `
                    <div style="margin-bottom:10px;">
                      <label style="font-size:.78rem;color:#78350F;display:block;margin-bottom:3px;">${q}</label>
                      <input type="text" id="fqa_${i}" placeholder="Your answer…"
                             style="width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #FDE68A;
                                    font-size:.84rem;box-sizing:border-box;background:white;outline:none;">
                    </div>`;
                }
            }).join('')}
 
            <button onclick="window._daRefine(${JSON.stringify(data.followUpQuestions).replace(/"/g,'&quot;')})"
                    style="width:100%;margin-top:8px;padding:12px;border-radius:10px;border:none;
                           background:#F59E0B;color:white;font-weight:800;cursor:pointer;font-size:.88rem;
                           box-shadow: 0 2px 6px rgba(245,158,11,0.2);">
              🔄 Re-analyse with my answers
            </button>
          </div>` : ''}
   
         <div style="padding:14px 18px;border-top:1px solid #F3F4F6;">
           <button onclick="window._daClear();document.getElementById('resultArea').innerHTML='';window.scrollTo(0,0);"
                   style="width:100%;padding:11px;border-radius:10px;border:1.5px solid #E5E7EB;
                          background:white;font-weight:700;font-size:.88rem;cursor:pointer;color:#374151;">
             📷 Scan another plant
           </button>
         </div>
       </div>`;
   
       document.getElementById('resultArea').scrollIntoView({ behavior:'smooth', block:'start' });
   }
   
   /* ── NEW: Camera Permission Flow Handlers ── */
   window._daGrantCamera = function(duration) {
       const feedback = document.getElementById('cameraFeedback');
       feedback.style.display = 'block';
       feedback.style.color = '#059669';
       feedback.innerHTML = `🟢 Access Granted! AI has linked to Zone CCTV. Continuous tracking initialized for the next ${duration}.`;
       
       // 禁用选择按钮
       const buttons = document.querySelectorAll('#cameraAuthBlock button');
       buttons.forEach(b => b.disabled = true);
   };
   
   window._daRefuseCamera = function(duration) {
       const feedback = document.getElementById('cameraFeedback');
       feedback.style.display = 'block';
       feedback.style.color = '#EA580C';
       feedback.innerHTML = `⚠️ Access Refused. We respect your choice. SeedDown has scheduled an automated system notification to remind you to manually upload a validation picture in <b>${duration}</b>.`;
   
       // 模拟注册在本地系统时间到期时发送的全局通知
       console.log(`[Notification Engine] Scheduled reminder in ${duration} for manual disease health checks.`);
       
       if (window.Notification && Notification.permission === "granted") {
           setTimeout(() => {
               new Notification("SeedDown Crop Health Update", {
                   body: `Your plant's ${duration} treatment time has arrived. Please open AI Disease Analysis and snap a new picture.`,
                   icon: "🌱"
               });
           }, 5000); // 演示：5秒后模拟触发，实际可根据 duration 解析为时间戳
       }
   
       const buttons = document.querySelectorAll('#cameraAuthBlock button');
       buttons.forEach(b => b.disabled = true);
   };
   
   // 🔍 定义追问图片上传的全局缓存变量
window._daNewUploadB64 = null;
window._daNewUploadMime = 'image/jpeg';

/* ── NEW FUNCTION: 处理追问框里的拍照/图片选取预览 ── */
window._daHandleFollowUpPhoto = function(inputEl, index) {
    const file = inputEl.files[0];
    if (!file) return;

    window._daNewUploadMime = file.type || 'image/jpeg';
    const reader = new FileReader();
    reader.onload = function(e) {
        // 将新照片的数据转化为 base64 存入全局
        window._daNewUploadB64 = e.target.result.split(',')[1];
        
        // 在追问区域显示预览图
        document.getElementById(`fqa_photo_preview_${index}`).src = e.target.result;
        document.getElementById(`fqa_photo_preview_wrap_${index}`).style.display = 'block';
        
        // 变更按钮样式与文字提示
        const btn = document.getElementById(`fqa_upload_btn_${index}`);
        btn.innerHTML = `✅ Photo Attached (${(file.size/1024).toFixed(1)} KB) - Tap to change`;
        btn.style.background = '#FEF3C7';
        btn.style.borderStyle = 'solid';
    };
    reader.readAsDataURL(file);
};

/* ── 优化后的二次重分析核心逻辑 ── */
window._daRefine = function(questions) {
    const answers = {};
    questions.forEach((q, i) => {
        const v = document.getElementById(`fqa_${i}`)?.value?.trim();
        if (v) answers[q] = v;
    });

    // 如果用户既没填文字也没传新照片，进行阻断提醒
    if (!Object.keys(answers).length && !window._daNewUploadB64) { 
        alert('Please answer at least one question or upload a photo.'); 
        return; 
    }

    // 🔍 核心转换机制：如果检测到用户补传了新照片，自动把它“提拔”复写到系统的主图缓存变量中
    if (window._daNewUploadB64) {
        _b64 = window._daNewUploadB64;
        _mime = window._daNewUploadMime;

        // 同步更新主页面的顶部图片预览框，让用户有即时视觉反馈
        const mainPreview = document.getElementById('imgPreview');
        if (mainPreview) mainPreview.src = `data:${_mime};base64,${_b64}`;
        const mainPreviewWrap = document.getElementById('imgPreviewWrap');
        if (mainPreviewWrap) mainPreviewWrap.style.display = 'block';
        const dropZone = document.getElementById('dropZone');
        if (dropZone) dropZone.style.display = 'none';
        
        // 清空临时缓存，防止下次误触
        window._daNewUploadB64 = null;
    }

    // 调用最核心的分析请求，将 answers 数据 POST 传给后端
    window._daRun(answers);
};