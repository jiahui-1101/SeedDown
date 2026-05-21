import{A as d,F as r,S as o,N as l,s as i}from"./index-CsAh1mPh.js";import{o as c}from"./AddPlantModal-1CThvP5l.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";function u(){var t,s;console.log("[HomePage] render called");const n=document.getElementById("screenContainer");n.innerHTML=`
        <div class="screen active" id="homeScreen">
            <div class="topbar">
                <button id="backToFarms" class="back-btn" style="background:transparent; border:none; font-size:20px;">←</button>
                <div class="topbar-brand"><span style="font-weight:700;">${d.farmName}</span></div>
                <div style="flex:1"></div>
                <div id="topbarPill"></div>

            </div>
            <div class="bottom-nav">
                <div class="nav-item active" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
            <div style="flex:1; overflow-y:auto;">
                <div class="farm-stage-wrap" style="margin:12px 16px; position:relative;">
                    <canvas id="farmCanvas" style="width:100%; height:clamp(280px, 40dvh, 520px); border-radius:24px; background:#EAF4FF; display:block;"></canvas>
                    <button id="fabPlant" style="position:absolute; bottom:12px; right:12px; background:var(--accent); border:none; width:44px; height:44px; border-radius:14px; color:white; font-size:24px;">+</button>
                </div>
                <div id="dashStrip" class="sensor-strip"></div>
                <div class="advisor-wrap" style="margin:12px 16px;">
                    <div class="advisor-card" style="background:var(--surface); border-radius:20px; padding:14px; display:flex; gap:12px;">
                        <div id="npcAvatar" style="font-size:36px;">🧑‍🌾</div>
                        <div style="flex:1;">
                            <div id="npcName" style="font-weight:700; color:var(--accent);">FARM ADVISOR</div>
                            <div id="npcText" style="font-size:0.8rem; color:var(--sub);">Loading insights...</div>
                            <div style="display:flex; gap:8px; margin-top:8px;">
                                <button id="npcNext" class="advisor-btn primary">Next →</button>
                                <button id="npcDismiss" class="advisor-btn">Dismiss</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin:12px 16px;">
                    <div style="font-size:0.6rem; font-weight:700; color:var(--muted);">FEATURES</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
                        <div class="feat-card" data-feature="whatif" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">🔮</span><div>What-If</div><div style="font-size:0.7rem;">Simulate yield</div></div>
                        <div class="feat-card" data-feature="consumption" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">⚡</span><div>Eco Save</div><div style="font-size:0.7rem;">Track savings</div></div>
                        <div class="feat-card" data-feature="alerts" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">🚨</span><div>AI Alerts</div><div style="font-size:0.7rem;">Predict issues</div></div>
                        <div class="feat-card" data-feature="community" style="background:var(--surface); border-radius:16px; padding:16px;"><span style="font-size:28px;">🏘️</span><div>Community</div><div style="font-size:0.7rem;">Trade & chat</div></div>
                    </div>
                </div>
            </div>
        </div>
    `,setTimeout(()=>{console.log("[HomePage] Initializing canvas and sensors"),r.init("farmCanvas"),o.init(),l.init()},100),(t=document.getElementById("backToFarms"))==null||t.addEventListener("click",()=>i("farmlist")),(s=document.getElementById("fabPlant"))==null||s.addEventListener("click",c),document.querySelectorAll(".feat-card").forEach(a=>{a.addEventListener("click",()=>{const e=a.getAttribute("data-feature");e==="community"?i("community"):i("feature",{feature:e})})}),document.querySelectorAll(".bottom-nav .nav-item").forEach(a=>{a.addEventListener("click",()=>{const e=a.getAttribute("data-screen");e==="profile"?(d.profileFrom="home",i("profile")):e==="home"&&i("home")})})}export{u as render};
