import{s as i}from"./index-D2LiWf5T.js";import{r as n,a as s,b as o}from"./SosTab-DYiWTU-0.js";function v(){const t=document.getElementById("screenContainer");t.innerHTML=`
        <div class="screen active" id="communityScreen" style="background: var(--bg);">
            
            <!-- Top Navigation Bar -->
            <div class="topbar">
                <button id="communityBackBtn" class="back-btn" style="background:none;border:none;font-size:20px;">←</button>
                <div style="font-weight:700;">🌍 Community</div>
                <div style="flex:1"></div>
                <div class="live-pill" id="myCoinsDisplay" style="background:var(--green-50); color:var(--green-800); border:1px solid var(--green-200);">
                    🍃 -- Coins
                </div>
            </div>

            <!-- Horizontal Scroll Menu -->
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

            <!-- Main Content Area (子文件会把内容画在这个 div 里面) -->
            <div id="commContentArea" style="padding: 0 20px; padding-bottom: 80px; overflow-y: auto; height: calc(100vh - 160px); position: relative;">
            </div>

            <!-- Bottom Navigation -->
            <div class="bottom-nav" style="position:absolute; bottom:0; width:100%;">
                <div class="nav-item" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item active"><span class="nav-icon">🌍</span><span class="nav-lbl">Community</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `,document.getElementById("communityBackBtn").addEventListener("click",()=>i("home")),document.querySelectorAll(".bottom-nav .nav-item").forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-screen");a&&i(a)})}),r(),n("commContentArea"),l()}function r(){const t=document.querySelectorAll(".comm-circle-btn");t.forEach(e=>{e.addEventListener("click",()=>{t.forEach(c=>c.classList.remove("active")),e.classList.add("active");const a=e.getAttribute("data-tab");a==="visits"?n("commContentArea"):a==="barter"?s("commContentArea"):a==="sos"&&o("commContentArea")})})}async function l(){try{const e=await(await fetch("http://localhost:3000/api/community/me")).json();document.getElementById("myCoinsDisplay").innerText=`🍃 ${e.coins} Coins`}catch{console.warn("Backend not detected, using static UI state.")}}export{v as render};
