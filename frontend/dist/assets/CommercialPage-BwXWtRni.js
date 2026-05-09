import{s as a}from"./index-D2LiWf5T.js";import{r as n,a as o,b as r}from"./SosTab-DYiWTU-0.js";function v(){const c=document.getElementById("screenContainer");c.innerHTML=`
        <div class="screen active" id="communityScreen" style="background: var(--bg);">
            
            <!-- 顶部导航栏 -->
            <div class="topbar">
                <button id="communityBackBtn" class="back-btn" style="background:none;border:none;font-size:20px;">←</button>
                <div style="font-weight:700;">🌍 Community</div>
                <div style="flex:1"></div>
                <div class="live-pill" id="myCoinsDisplay" style="background:var(--green-50); color:var(--green-800); border:1px solid var(--green-200);">
                    🍃 -- Coins
                </div>
            </div>

            <!-- 横向滚动菜单 -->
            <div class="comm-menu-scroll">
                <div class="comm-circle-btn active" data-tab="visits">
                    <div class="comm-circle-icon">🏡</div>
                    <div class="comm-circle-lbl">Farm Visits</div>
                </div>
                <div class="comm-circle-btn" data-tab="barter">
                    <div class="comm-circle-icon">📦</div>
                    <div class="comm-circle-lbl">Barter Board</div>
                </div>
                <div class="comm-circle-btn" data-tab="sos">
                    <div class="comm-circle-icon">🚨</div>
                    <div class="comm-circle-lbl">SOS Beacon</div>
                </div>
            </div>

            <!-- 动态内容区 (子文件会把内容画在这里) -->
            <div id="commContentArea" style="padding: 0 20px; padding-bottom: 80px; overflow-y: auto; height: calc(100vh - 160px); position: relative;">
            </div>

            <!-- 底部导航 -->
            <div class="bottom-nav" style="position:absolute; bottom:0; width:100%;">
                <div class="nav-item" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item active"><span class="nav-icon">🌍</span><span class="nav-lbl">Community</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `,document.getElementById("communityBackBtn").addEventListener("click",()=>a("home"));const s=document.querySelectorAll(".comm-circle-btn");s.forEach(e=>{e.addEventListener("click",()=>{s.forEach(t=>t.classList.remove("active")),e.classList.add("active");const i=e.getAttribute("data-tab");i==="visits"&&n("commContentArea"),i==="barter"&&o("commContentArea"),i==="sos"&&r("commContentArea")})}),document.querySelectorAll(".bottom-nav .nav-item").forEach(e=>{e.addEventListener("click",()=>{const i=e.getAttribute("data-screen");i==="profile"?a("profile"):i==="home"&&a("dash-c")})})}export{v as render};
