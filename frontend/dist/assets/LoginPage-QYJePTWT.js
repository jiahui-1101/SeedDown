import{A as t,a as d,s as n}from"./index-Cd0pKV2D.js";import"https://esm.sh/three@0.160.0";function l(){const i=document.getElementById("screenContainer");i.innerHTML=`
        <div class="screen active" id="loginScreen">
            <div style="flex:1; padding:32px 24px; display:flex; flex-direction:column; justify-content:center;">
                <div style="margin-bottom:32px;">
                    <div style="font-size:0.6rem; color:var(--accent); letter-spacing:0.2em;">Welcome Back</div>
                    <h2 style="font-size:1.6rem; margin:8px 0;">Choose farming mode</h2>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px;">
                    <div id="modeBeginner" class="mode-card" style="background:var(--surface); border:2px solid var(--border); border-radius:16px; padding:16px; cursor:pointer;">
                        <span style="font-size:28px;">🌱</span>
                        <div style="font-weight:700; margin-top:8px;">Beginner</div>
                        <div style="font-size:0.7rem; color:var(--muted);">Gamified, guided experience</div>
                    </div>
                    <div id="modeCommercial" class="mode-card" style="background:var(--surface); border:2px solid var(--border); border-radius:16px; padding:16px; cursor:pointer;">
                        <span style="font-size:28px;">🏭</span>
                        <div style="font-weight:700; margin-top:8px;">Commercial</div>
                        <div style="font-size:0.7rem; color:var(--muted);">Pro data dashboard</div>
                    </div>
                </div>
                <div style="margin-bottom:20px;">
                    <label style="font-size:0.7rem; font-weight:700;">Email</label>
                    <input type="email" id="loginEmail" class="form-input" placeholder="farmer@email.com" value="farmer@seeddown.com" style="width:100%; padding:12px; margin-top:6px; border-radius:12px; border:1px solid var(--border);">
                </div>
                <button class="btn-primary" id="loginBtn">Enter Farm →</button>
                <div style="text-align:center; margin-top:24px; font-size:0.65rem; color:var(--muted);">Powered by PERSAKA <span style="color:var(--danger);">UTM</span></div>
            </div>
        </div>
    `;const e=document.getElementById("modeBeginner"),o=document.getElementById("modeCommercial");let r="beginner";e.classList.add("sel"),e.style.borderColor="var(--accent)",e.addEventListener("click",()=>{r="beginner",e.style.borderColor="var(--accent)",o.style.borderColor="var(--border)"}),o.addEventListener("click",()=>{r="commercial",o.style.borderColor="var(--accent)",e.style.borderColor="var(--border)"}),document.getElementById("loginBtn").addEventListener("click",()=>{t.mode=r,d("success",`Logged in as ${r==="beginner"?"🌱 Beginner":"🏭 Commercial"} farmer`),n("farmlist")})}export{l as render};
