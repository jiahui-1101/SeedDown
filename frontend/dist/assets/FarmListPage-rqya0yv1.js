import{A as i,s as r,a as c}from"./index-DP6f9CQz.js";import"https://esm.sh/three@0.160.0";const s="user_farms";function m(){console.log("[FarmListPage] render called");const t=document.getElementById("screenContainer");let e=[];try{e=JSON.parse(localStorage.getItem(s))||[]}catch{e=[]}e.length===0&&(e=[{id:"farm_"+Date.now(),name:"Farm 1 — Rack Alpha",plants:6,plantSlots:6,zone:"A",targetPlant:"Lettuce"}],localStorage.setItem(s,JSON.stringify(e)));const a=i.mode==="commercial";t.innerHTML=`
        <div class="screen active" id="farmlistScreen">
            <div class="topbar">
                <div class="topbar-brand">
                    <span style="font-size:24px;">🌿</span>
                    <span style="font-weight:700;">SeedDown</span>
                    <span style="margin-left:8px; color:var(--muted);">Farms</span>
                </div>
                <div style="flex:1"></div>
                <div id="switchModeBtn" style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <span style="font-size:0.72rem; font-weight:700; color:${a?"var(--muted)":"var(--accent)"};">🌱</span>
                    <div style="
                        position:relative; width:48px; height:26px;
                        background:${a?"var(--accent)":"var(--border)"};
                        border-radius:100px; transition:background 0.25s;
                    ">
                        <div style="
                            position:absolute; top:3px;
                            left:${a?"25px":"3px"};
                            width:20px; height:20px; border-radius:50%;
                            background:white; box-shadow:0 1px 4px rgba(0,0,0,0.25);
                            transition:left 0.25s;
                        "></div>
                    </div>
                    <span style="font-size:0.72rem; font-weight:700; color:${a?"var(--accent)":"var(--muted)"};">🏭</span>
                </div>
            </div>

            <div style="padding:16px; flex:1; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="font-size:0.7rem; font-weight:700; color:var(--sub);">SELECT FIELD (${e.length})</div>
                    <button id="buildFarmBtn" class="btn-outline" style="padding:6px 12px;">+ New Field</button>
                </div>
                
                <div id="farmList" style="display:flex; flex-direction:column; gap:10px;">
                    ${e.map(n=>`
                        <div class="farm-card" data-farm-id="${n.id}" data-farm-name="${n.name}" style="background:var(--surface); border-radius:16px; padding:14px; display:flex; align-items:center; gap:12px; cursor:pointer;">
                            <div style="width:44px; height:44px; background:var(--accent-l); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px;">🏗️</div>
                            <div style="flex:1;">
                                <div style="font-weight:700;">${n.name}</div>
                                <div style="font-size:0.7rem; color:var(--muted);">${v(n)}</div>
                            </div>
                            <div style="color:var(--accent);">→</div>
                        </div>
                    `).join("")}
                </div>
            </div>

            <div class="bottom-nav">
                <div class="nav-item active" data-screen="farmlist"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `,p(e)}function p(t){document.querySelectorAll(".farm-card").forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-farm-id"),n=e.getAttribute("data-farm-name"),o=t.find(d=>d.id===a)||null;i.currentFarmId=a,i.currentFarm=o,i.farmName=n,console.log(`[FarmListPage] Entering Farm ID: ${a}`);const l=i.mode==="beginner"?"home":"dash-c";r(l)})}),document.getElementById("buildFarmBtn").onclick=()=>{r("buildfarm")},document.getElementById("switchModeBtn").onclick=()=>{i.mode=i.mode==="beginner"?"commercial":"beginner",c("info",`Switched to ${i.mode==="commercial"?"🏭 Commercial":"🌱 Beginner"} mode`),m()},document.querySelectorAll(".bottom-nav .nav-item").forEach(e=>{e.onclick=()=>{e.dataset.screen==="profile"&&(i.profileFrom="farmlist",r("profile"))}})}function v(t){const e=typeof t.plants=="number"?t.plants:Array.isArray(t.plants)?t.plants.length:0,a=t.targetPlant?`${t.targetPlant} · `:"",n=t.plantSlots?`${t.plantSlots} slots`:`${e} plants`;return`${a}${n} · Zone ${t.zone||"A"}`}export{m as render};
