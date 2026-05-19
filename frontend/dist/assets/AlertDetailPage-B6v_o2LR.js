import{s as i}from"./index-ChKLPXxY.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";function r(e={}){return`
        <div style="background:#f8f9f5; min-height:100vh; font-family: sans-serif; color:#1a3c34;">
            <div style="display:flex; align-items:center; padding:16px 20px; background:white; border-bottom:1px solid #edf2f0;">
                <button id="backBtn" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:#064E3B;">←</button>
                <div style="font-weight:800; font-size:1.1rem; margin-left:12px;">Detailed Analysis</div>
            </div>

            <div style="padding:24px;">
                <div style="background:white; border-radius:32px; padding:28px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border:1px solid #edf2f0; margin-bottom: 24px;">
                    <span style="color:#40916c; font-size:0.75rem; font-weight:800;">PREDICTED PEAK</span>
                    <div style="font-size:3.5rem; font-weight:900; color:#1b4332; margin:8px 0;">34.2<small style="font-size:1.5rem; color:#95adbe;">°C</small></div>
                    <p style="color:#64748B; line-height:1.6; font-size:0.95rem;">Gemini predicted this spike based on the last 10 Firebase entries.</p>
                </div>
                
                <div style="background:white; border-radius:32px; padding:24px; border:1px solid #edf2f0;">
                    <span style="color:#40916c; font-size:0.75rem; font-weight:800; display:block; margin-bottom:16px;">TEMPERATURE TREND (SVG)</span>
                    <svg viewBox="0 0 200 100" style="width:100%; height:160px; overflow:visible;">
                        <polyline points="0,80 40,75 80,72 120,60 160,35 200,10" fill="none" stroke="#EF4444" stroke-width="3" />
                        <circle cx="200" cy="10" r="4" fill="#EF4444" />
                    </svg>
                </div>
            </div>
        </div>
    `}function s(){setTimeout(()=>{const e=document.getElementById("backBtn");e?e.onclick=()=>i("alert"):console.error("Back button still null!")},50)}export{s as init,r as render};
