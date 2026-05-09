import{s as e,a as o,A as n}from"./index-D2LiWf5T.js";function a(i={}){const t=document.getElementById("screenContainer");t.innerHTML=`
        <div class="screen active" style="background:#f8f9f5; color:#1a3c34; display:flex; flex-direction:column; font-family: 'Inter', sans-serif;">
            
            <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; background:white;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <button id="alertBackBtn" style="background:none; border:none; font-size:1.5rem; color:#1a3c34; cursor:pointer;">←</button>
                    <div style="font-weight:800; font-size:1.2rem; color:#1a3c34;">Temp Analysis</div>
                </div>
                <button style="background:#e8f5e9; border:none; color:#2d6a4f; padding:8px 16px; border-radius:20px; font-size:0.8rem; font-weight:600; display:flex; align-items:center; gap:4px;">
                    ⚙️ Set Preference
                </button>
            </div>

            <div style="flex:1; overflow-y:auto; padding:20px;">
                
                <div style="background:white; border-radius:32px; padding:24px; margin-bottom:20px; box-shadow: 0 10px 30px rgba(45, 106, 79, 0.05); border: 1px solid #edf2f0;">
                    <div style="color:#40916c; font-size:0.75rem; font-weight:800; letter-spacing:1px; margin-bottom:16px;">CURRENT READING</div>
                    <div style="display:flex; align-items:baseline; gap:8px;">
                        <span style="font-size:4rem; font-weight:900; color:#1b4332;">34.2</span>
                        <span style="font-size:1.5rem; color:#95adbe; font-weight:600;">°C</span>
                    </div>
                </div>

                <div style="background:white; border-radius:32px; padding:24px; margin-bottom:20px; box-shadow: 0 10px 30px rgba(45, 106, 79, 0.05); border: 1px solid #edf2f0;">
                    <div style="color:#40916c; font-size:0.75rem; font-weight:800; letter-spacing:1px; margin-bottom:16px;">24-HOUR TREND</div>
                    <div style="height:120px; width:100%; margin-top:10px;">
                        <svg viewBox="0 0 100 40" style="width:100%; height:100%;">
                            <path d="M0,35 Q20,30 40,25 T80,10 T100,5" fill="none" stroke="#52b788" stroke-width="2" />
                            <circle cx="40" cy="25" r="2" fill="#52b788" />
                            <circle cx="80" cy="10" r="2" fill="#52b788" />
                            <circle cx="100" cy="5" r="2" fill="#52b788" />
                        </svg>
                    </div>
                </div>

                <div style="background:white; border-radius:32px; padding:24px; box-shadow: 0 10px 30px rgba(45, 106, 79, 0.05); border: 1px solid #edf2f0; margin-bottom:100px;">
                    <div style="color:#40916c; font-size:0.75rem; font-weight:800; letter-spacing:1px; margin-bottom:20px;">HISTORICAL RECORDS</div>
                    
                    <div style="display:flex; justify-content:space-between; color:#95adbe; font-size:0.75rem; font-weight:700; margin-bottom:15px; padding:0 4px;">
                        <span>TIME</span><span>READING</span><span>STATUS</span>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:20px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#52796f; font-weight:600;">16:00</span>
                            <span style="font-weight:800; color:#1b4332;">34.2 <small style="color:#95adbe;">°C</small></span>
                            <span style="background:#fff1f0; color:#ff4d4f; padding:4px 12px; border-radius:12px; font-size:0.7rem; font-weight:700;">Danger</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#52796f; font-weight:600;">15:55</span>
                            <span style="font-weight:800; color:#1b4332;">33.8 <small style="color:#95adbe;">°C</small></span>
                            <span style="background:#fffbe6; color:#faad14; padding:4px 12px; border-radius:12px; font-size:0.7rem; font-weight:700;">Warning</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#52796f; font-weight:600;">15:50</span>
                            <span style="font-weight:800; color:#1b4332;">31.5 <small style="color:#95adbe;">°C</small></span>
                            <span style="background:#f6ffed; color:#52c41a; padding:4px 12px; border-radius:12px; font-size:0.7rem; font-weight:700;">● Normal</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style="position:fixed; bottom:0; left:0; right:0; padding:20px 24px 34px; background:linear-gradient(to top, white 80%, transparent);">
                <button id="executeActionBtn" style="width:100%; padding:18px; background:#1b4332; color:white; border:none; border-radius:24px; font-weight:700; font-size:1rem; cursor:pointer; box-shadow: 0 10px 25px rgba(27, 67, 50, 0.2);">
                    EXECUTE COOLING NOW
                </button>
            </div>
        </div>
    `,document.getElementById("alertBackBtn").onclick=()=>e("feature",{feature:"alerts"}),document.getElementById("executeActionBtn").onclick=()=>{o("success","Smart Cooling System Activated 🌀"),n.updateSensors("temp",26,"ok"),e("home")}}export{a as render};
