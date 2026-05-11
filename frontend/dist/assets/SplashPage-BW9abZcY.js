import{s as t}from"./index-CDbG3aFg.js";import"https://esm.sh/three@0.160.0";function i(){var e;const r=document.getElementById("screenContainer");r.innerHTML=`
        <div class="screen active" id="splashScreen">
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px;">
                <div class="splash-badge" style="font-size:0.6rem; background:var(--accent-l); padding:6px 14px; border-radius:30px;">Smart Vertical Farm</div>
                <div style="font-size:80px; margin:24px 0;">🌿</div>
                <h1 style="font-size:2rem; letter-spacing:-0.02em;">SeedDown</h1>
                <p style="color:var(--sub); text-align:center; margin:16px 0 32px;">AI-powered farming intelligence for urban vertical farms</p>
                <button class="btn-primary" id="getStartedBtn">Get Started →</button>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; width:100%; margin-top:32px;">
                    <div style="background:var(--surface); padding:12px; border-radius:16px;"><span>📡</span> Live IoT</div>
                    <div style="background:var(--surface); padding:12px; border-radius:16px;"><span>🤖</span> AI Predict</div>
                    <div style="background:var(--surface); padding:12px; border-radius:16px;"><span>🌱</span> Smart Alerts</div>
                    <div style="background:var(--surface); padding:12px; border-radius:16px;"><span>🏘️</span> Community</div>
                </div>
            </div>
        </div>
    `,(e=document.getElementById("getStartedBtn"))==null||e.addEventListener("click",()=>t("login"))}export{i as render};
