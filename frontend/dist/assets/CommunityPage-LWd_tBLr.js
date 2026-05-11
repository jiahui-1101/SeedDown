const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CDbG3aFg.js","assets/index-CusVGyOO.css"])))=>i.map(i=>d[i]);
import{_ as L,a as s,s as P}from"./index-CDbG3aFg.js";import"https://esm.sh/three@0.160.0";let g=[],I="";async function C(t){I=t;const e=document.getElementById(t);e.innerHTML=`
        <style>
            @keyframes bugWiggle {
                0%,100% { transform: rotate(-10deg) translateX(0); }
                50%      { transform: rotate(10deg) translateX(4px); }
            }
            @keyframes bucketPour {
                0%   { transform: rotate(0deg); }
                35%  { transform: rotate(-120deg); }
                65%  { transform: rotate(-120deg); }
                100% { transform: rotate(0deg); }
            }
            @keyframes clampSnap {
                0%   { transform: scale(1) rotate(0deg); opacity:1; }
                30%  { transform: scale(1.5) rotate(-25deg); opacity:1; }
                60%  { transform: scale(0.5) rotate(20deg); opacity:0.6; }
                100% { transform: scale(0) rotate(40deg); opacity:0; }
            }
            .neighbor-card {
                display:flex; align-items:center; padding:15px;
                border-radius:16px; border:1px solid #f0f0f0;
                box-shadow:0 4px 10px rgba(0,0,0,0.03);
                cursor:pointer; transition:transform 0.2s, box-shadow 0.2s;
                background:white;
            }
            .neighbor-card:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(0,0,0,0.08); }
            .drag-tool {
                font-size:2.6rem; cursor:grab; user-select:none;
                display:inline-block; transition:transform 0.15s;
                touch-action:none;
            }
            .drag-tool:active { cursor:grabbing; }
            .drag-clone {
                position:fixed; pointer-events:none; z-index:9999;
                font-size:2.8rem;
                filter:drop-shadow(0 8px 20px rgba(0,0,0,0.45));
            }
            .drop-zone.drag-over { outline: 3px dashed #60A5FA; background: rgba(96,165,250,0.06); }
            .status-badge {
                padding:4px 12px; border-radius:12px;
                font-size:0.75rem; font-weight:bold;
                transition: all 0.5s ease;
            }
            .badge-thirsty { background:#FEF08A; color:#854D0E; }
            .badge-healthy { background:#D1FAE5; color:#065F46; }
        </style>

        <div style="margin-top:15px; margin-bottom:15px;">
            <h3 style="margin:0 0 4px 0; color:#1f2937;">🏡 Neighborhood Farms</h3>
            <p style="margin:0; font-size:0.8rem; color:gray;">
                Visit neighbors · drag 🪣 to water · drag 🦾 to catch bugs!
            </p>
        </div>

        <div id="neighborsListArea" style="display:flex; flex-direction:column; gap:12px;">
            <div style="text-align:center; padding:20px; color:gray;">Scouting neighborhood...</div>
        </div>
    `,await D()}async function D(){try{g=await(await fetch("http://localhost:3000/api/community/visits/neighbors")).json()}catch{g=[{id:"farm_01",name:"Aisha.Farm",avatar:"👩‍🌾",plant:"Tomato",moisture:18,hasBug:!0,rack:"3-tier",tiles:x("danger")},{id:"farm_02",name:"Botani_Master",avatar:"👨‍🌾",plant:"Mint",moisture:65,hasBug:!1,rack:"5-tier",tiles:x("healthy")},{id:"farm_03",name:"GreenThumb99",avatar:"🧑‍🌾",plant:"Basil",moisture:22,hasBug:!1,rack:"wall",tiles:x("warning")},{id:"farm_04",name:"UTM_Agri",avatar:"🏫",plant:"Chili",moisture:80,hasBug:!0,rack:"3-tier",tiles:x("healthy")}]}O()}function x(t){const e=["🌿","🥬","🌱","🍅","🌶️"];return Array.from({length:9},(o,n)=>({emoji:e[n%e.length],status:t}))}function O(){const t=document.getElementById("neighborsListArea");t.innerHTML=g.map(e=>{const o=e.moisture<30;return`
        <div class="neighbor-card" onclick="window.visitFarm('${e.id}')">
            <div style="font-size:35px; margin-right:15px; background:#f9fafb; border-radius:50%;
                        width:60px; height:60px; display:flex; justify-content:center; align-items:center;">
                ${e.avatar}
            </div>
            <div style="flex:1;">
                <h4 style="margin:0 0 4px 0; font-size:1.05rem;">${e.name}</h4>
                <div style="font-size:0.8rem; color:gray;">Growing: ${e.plant}</div>
            </div>
            <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                ${e.hasBug?'<div style="font-size:1rem; animation:bugWiggle 1s infinite;">🐛 Bug!</div>':""}
                <div class="status-badge ${o?"badge-thirsty":"badge-healthy"}">
                    ${o?"💧 Needs Water":"🌿 Healthy"}
                </div>
            </div>
        </div>`}).join("")}window.visitFarm=function(t){const e=g.find(c=>c.id===t),o=document.getElementById(I),n=e.moisture<30;o.innerHTML=`
        <button class="btn-outline"
            style="margin:15px 0; border:none; padding:0; color:#2563EB; font-weight:bold; cursor:pointer;"
            onclick="window.backToNeighbors()">← Back to Neighborhood</button>

        <div class="card" style="padding:0; overflow:hidden; border-radius:16px; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

            <!-- Farm header -->
            <div style="padding:16px; display:flex; align-items:center; gap:12px; background:white;">
                <div style="font-size:35px;">${e.avatar}</div>
                <div style="flex:1;">
                    <div style="font-weight:900; font-size:1.1rem;">${e.name}</div>
                    <div style="font-size:0.75rem; color:gray;">
                        Soil Moisture: <span id="uiMoisture">${e.moisture}</span>%
                    </div>
                </div>
                <div id="statusBadge" class="status-badge ${n?"badge-thirsty":"badge-healthy"}">
                    ${n?"💧 Thirsty":"🌿 Healthy"}
                </div>
            </div>

            <!-- 3D canvas -->
            <div id="canvasDropZone" class="drop-zone" style="position:relative; background:#eaf4ff;">
                <canvas id="visitFarmCanvas" style="width:100%; height:260px; display:block;"></canvas>

                <!-- Bug sitting on canvas -->
                ${e.hasBug?`
                <div id="bugOverlay"
                    style="position:absolute; top:16px; right:26px; text-align:center; z-index:10;
                           animation:bugWiggle 1.1s infinite;">
                    <div style="font-size:2.2rem; filter:drop-shadow(0 3px 6px rgba(0,0,0,0.25));">🐛</div>
                    <div style="font-size:0.6rem; background:#FEF08A; color:#854D0E;
                                border-radius:8px; padding:2px 7px; font-weight:bold; margin-top:2px;">drag clamp!</div>
                </div>`:""}
            </div>

            <!-- Toolbar -->
            <div style="padding:16px; background:white; border-top:1px solid #f3f4f6;">
                <div style="font-size:0.65rem; font-weight:700; color:#9CA3AF;
                            letter-spacing:0.08em; margin-bottom:12px; text-align:center;">
                    ↑ DRAG A TOOL ONTO THE FARM ABOVE ↑
                </div>
                <div style="display:flex; justify-content:center; gap:40px;">

                    <!-- Bucket -->
                    <div style="text-align:center;">
                        <div id="toolBucket" class="drag-tool"
                            style="${n?"":"opacity:0.3; cursor:not-allowed;"}">🪣</div>
                        <div id="bucketLabel" style="font-size:0.7rem; color:#6B7280; margin-top:6px;">
                            ${n?"💧 Water (+5 🍃)":"Not thirsty"}
                        </div>
                    </div>

                    <!-- Clamp -->
                    <div style="text-align:center;">
                        <div id="toolClamp" class="drag-tool"
                            style="${e.hasBug?"":"opacity:0.3; cursor:not-allowed;"}">🦾</div>
                        <div id="clampLabel" style="font-size:0.7rem; color:#6B7280; margin-top:6px;">
                            ${e.hasBug?"🐛 Catch bug (+8 🍃)":"No bugs"}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `,j(e);const i=document.getElementById("canvasDropZone"),r=document.getElementById("toolBucket"),a=document.getElementById("toolClamp");n&&r&&$(r,i,()=>N(e.id)),e.hasBug&&a&&$(a,i,()=>_(e.id))};function j(t){L(async()=>{const{FarmCanvas:e}=await import("./index-CDbG3aFg.js").then(o=>o.c);return{FarmCanvas:e}},__vite__mapDeps([0,1])).then(({FarmCanvas:e})=>{L(async()=>{const{AppState:o}=await import("./index-CDbG3aFg.js").then(n=>n.b);return{AppState:o}},__vite__mapDeps([0,1])).then(({AppState:o})=>{const n=JSON.parse(localStorage.getItem("user_farms")||"[]"),i=o.currentFarmId,r={id:t.id,name:t.name,rack:t.rack||"3-tier",zone:"A",tiles:(t.tiles||[]).map((a,c)=>({id:c,emoji:a.emoji||null,status:a.status||"healthy"}))};localStorage.setItem("user_farms",JSON.stringify([...n,r])),o.currentFarmId=t.id,e.init("visitFarmCanvas"),localStorage.setItem("user_farms",JSON.stringify(n)),o.currentFarmId=i})}).catch(()=>{})}function $(t,e,o){let n=null,i=!1,r=0,a=0;function c(d,l){n=document.createElement("div"),n.className="drag-clone",n.innerText=t.innerText,n.style.left=d-r+"px",n.style.top=l-a+"px",document.body.appendChild(n)}function h(d,l){n&&(n.style.left=d-r+"px",n.style.top=l-a+"px",i=A(d,l,e),e.classList.toggle("drag-over",i))}function T(){e.classList.remove("drag-over"),n==null||n.remove(),n=null,i&&(i=!1,o())}function A(d,l,p){const m=p.getBoundingClientRect();return d>=m.left&&d<=m.right&&l>=m.top&&l<=m.bottom}t.addEventListener("mousedown",d=>{d.preventDefault();const l=t.getBoundingClientRect();r=d.clientX-l.left,a=d.clientY-l.top,c(d.clientX,d.clientY);const p=F=>h(F.clientX,F.clientY),m=()=>{T(),window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",m)};window.addEventListener("mousemove",p),window.addEventListener("mouseup",m)}),t.addEventListener("touchstart",d=>{d.preventDefault();const l=d.touches[0],p=t.getBoundingClientRect();r=l.clientX-p.left,a=l.clientY-p.top,c(l.clientX,l.clientY)},{passive:!1}),t.addEventListener("touchmove",d=>{d.preventDefault();const l=d.touches[0];h(l.clientX,l.clientY)},{passive:!1}),t.addEventListener("touchend",d=>{d.preventDefault(),T()},{passive:!1})}async function N(t){const e=g.find(n=>n.id===t);if(!e||e.moisture>=30)return;const o=document.getElementById("toolBucket");o&&(o.style.transformOrigin="bottom right",o.style.animation="bucketPour 0.8s ease forwards",setTimeout(()=>{o&&(o.style.animation="",o.style.opacity="0.3",o.style.cursor="not-allowed")},800));try{const i=await(await fetch(`http://localhost:3000/api/community/visits/water/${t}`,{method:"POST"})).json();S(e,i)}catch{S(e,{earned:5})}}function S(t,e){t.moisture=85;const o=document.getElementById("uiMoisture");o&&(o.innerText="85");const n=document.getElementById("statusBadge");n&&(n.className="status-badge badge-healthy",n.innerText="🌿 Healthy");const i=document.getElementById("bucketLabel");i&&(i.innerText="✅ Watered!"),s("success",`💧 Watered! +${(e==null?void 0:e.earned)??5} 🍃`),z(e==null?void 0:e.newTotal)}async function _(t){const e=g.find(r=>r.id===t);if(!e||!e.hasBug)return;const o=document.getElementById("bugOverlay");o&&(o.style.animation="clampSnap 0.5s ease forwards",setTimeout(()=>o==null?void 0:o.remove(),500));const n=document.getElementById("toolClamp");n&&(n.style.opacity="0.3",n.style.cursor="not-allowed");const i=document.getElementById("clampLabel");i&&(i.innerText="✅ Bug caught!"),e.hasBug=!1;try{const a=await(await fetch(`http://localhost:3000/api/community/visits/catch-bug/${t}`,{method:"POST"})).json();s("success",`💥 Bug squished! +${(a==null?void 0:a.earned)??8} 🍃`),z(a==null?void 0:a.newTotal)}catch{s("success","💥 Bug squished! +8 🍃")}}window.backToNeighbors=function(){C(I)};function z(t){if(!t)return;const e=document.getElementById("myCoinsDisplay");e&&(e.innerText=`🍃 ${t} Coins`)}const M={tomato:"https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&q=80",chilli:"https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=300&q=80",mint:"https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=300&q=80",basil:"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=300&q=80",spinach:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80",compost:"https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=300&q=80",veggie:"https://images.unsplash.com/photo-1566842600175-97dca3b105e4?w=300&q=80",seed:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80",default:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80"},V=M.default;function H(t){if(t.image)return t.image;const e=(t.title||"").toLowerCase();for(const[o,n]of Object.entries(M))if(e.includes(o))return n;return V}let f="pasar",v=[];const u="MyFarm";async function U(t){const e=document.getElementById(t);e.innerHTML=`
        <!-- 顶部视图切换 -->
        <div style="display:flex; gap:10px; margin-top:15px; margin-bottom:10px; background: white; padding: 5px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <button id="btnViewPasar" style="flex:1; padding:10px; border-radius:8px; border:none; background:#D1FAE5; color:#065F46; font-weight:bold; cursor:pointer; transition:0.3s;">🛍️ Pasar</button>
            <button id="btnViewMyShop" style="flex:1; padding:10px; border-radius:8px; border:none; background:transparent; color:gray; font-weight:bold; cursor:pointer; transition:0.3s;">🏪 My Shop</button>
        </div>

        <!-- 搜索栏 (类似购物车界面) -->
        <div id="pasarSearchBar" style="display:flex; gap:8px; margin-bottom:15px;">
            <input type="text" id="searchInput" placeholder="Search vegetables, seeds, tools..." style="flex:1; padding:10px 15px; border-radius:20px; border:1px solid #ddd; background:#fff; outline:none;">
            <button class="btn-primary" id="btnSearch" style="border-radius:20px; padding:0 20px;">🔍</button>
        </div>

        <!-- 瀑布流内容区 -->
        <div id="barterFeedList" class="pasar-grid">
            <div style="grid-column: span 2; text-align:center; padding:20px; color:gray;">Loading market...</div>
        </div>

        <!-- 发帖悬浮按钮 (仅在 My Shop 显示) -->
        <button id="fabAddBarter" style="
            display:none; position: fixed; bottom: 90px; right: 20px; 
            width: 56px; height: 56px; border-radius: 50%; 
            background: #10B981; color: white; border: none; 
            font-size: 28px; box-shadow: 0 4px 10px rgba(16,185,129,0.4);
            cursor: pointer; z-index: 100; justify-content: center; align-items: center;
        ">+</button>

        <!-- 1. 发布物品弹窗 -->
        <div id="barterPostModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:999; justify-content:center; align-items:center; backdrop-filter:blur(4px);">
            <div style="background:white; width:90%; max-width:400px; border-radius:16px; padding:20px; max-height:80vh; overflow-y:auto;">
                <h3 style="margin-top:0;">📦 Post Item to Pasar</h3>
                <input id="postTitle" type="text" placeholder="Item Name (e.g. Ugly Veggie Box)" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #ddd; box-sizing:border-box;">
                
                <div style="margin-bottom:10px;">
                    <label style="font-size:0.8rem; font-weight:bold;">Trade Type:</label>
                    <select id="postTradeType" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; margin-top:5px;">
                        <option value="both">Coins OR Barter (Both)</option>
                        <option value="coins">Sell for Coins only</option>
                        <option value="barter">Barter (Item exchange) only</option>
                    </select>
                </div>

                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <div style="flex:1;"><input id="postCoins" type="number" placeholder="🍃 Coins Price" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; box-sizing:border-box;"></div>
                    <div style="flex:1;"><input id="postLookingFor" type="text" placeholder="🔄 Want (e.g. Mint)" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; box-sizing:border-box;"></div>
                </div>

                <input id="postLocation" type="text" placeholder="📍 Meetup Location (e.g. College Hall)" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #ddd; box-sizing:border-box;">
                
                <!-- 上传图片 -->
                <div style="margin-bottom:15px; text-align:center;">
                    <label for="barterImageUpload" style="display:inline-block; padding:8px 12px; background:#f0f0f0; border-radius:8px; cursor:pointer; font-size:0.8rem; font-weight:bold;">📷 Upload Photo</label>
                    <input type="file" id="barterImageUpload" accept="image/*" style="display:none;">
                    <div id="barterImagePreview" style="margin-top:10px; max-height:120px; overflow:hidden; border-radius:8px;"></div>
                </div>

                <div style="display:flex; gap:10px;">
                    <button id="btnCancelBarter" class="btn-outline" style="flex:1;">Cancel</button>
                    <button id="btnSubmitBarter" class="btn-primary" style="flex:1; background:#10B981; border:none;">List Item</button>
                </div>
            </div>
        </div>

        <!-- 2. Magic Match 魔法撮合弹窗 -->
        <div id="magicMatchModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); z-index:1000; justify-content:center; align-items:center;">
            <div style="background:linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%); padding:25px; border-radius:20px; width:80%; max-width:320px; text-align:center; box-shadow: 0 15px 30px rgba(0,0,0,0.3);">
                <div style="font-size: 50px; margin-bottom: 10px; animation: bounce 1s infinite;">🎉</div>
                <h3 style="margin:0 0 10px 0; color:#065F46;">Perfect Match Found!</h3>
                <p id="matchText" style="font-size:0.9rem; color:#4B5563; margin-bottom:20px;">Someone has what you want!</p>
                <button class="btn-primary" onclick="document.getElementById('magicMatchModal').style.display='none'" style="width:100%; border-radius:20px;">Awesome!</button>
            </div>
        </div>
    `,R(),y()}function R(){const t=document.getElementById("fabAddBarter"),e=document.getElementById("pasarSearchBar");document.getElementById("btnViewPasar").addEventListener("click",i=>{f="pasar",i.target.style.background="#D1FAE5",i.target.style.color="#065F46",document.getElementById("btnViewMyShop").style.background="transparent",document.getElementById("btnViewMyShop").style.color="gray",t.style.display="none",e.style.display="flex",w()}),document.getElementById("btnViewMyShop").addEventListener("click",i=>{f="myshop",i.target.style.background="#FEF3C7",i.target.style.color="#D97706",document.getElementById("btnViewPasar").style.background="transparent",document.getElementById("btnViewPasar").style.color="gray",t.style.display="flex",e.style.display="none",w()});const o=document.getElementById("barterPostModal");let n=null;document.getElementById("barterImageUpload").addEventListener("change",function(){if(this.files[0]){const i=new FileReader;i.onload=r=>{n=r.target.result,document.getElementById("barterImagePreview").innerHTML=`<img src="${n}" style="width:100%; object-fit:cover;">`},i.readAsDataURL(this.files[0])}}),t.addEventListener("click",()=>o.style.display="flex"),document.getElementById("btnCancelBarter").addEventListener("click",()=>o.style.display="none"),document.getElementById("btnSubmitBarter").addEventListener("click",async()=>{const i=document.getElementById("postTitle").value,r=document.getElementById("postTradeType").value;if(!i)return s("warning","Item name is required!");try{const c=await(await fetch("http://localhost:3000/api/community/barter",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:i,tradeType:r,author:u,image:n,priceCoins:document.getElementById("postCoins").value,lookingFor:document.getElementById("postLookingFor").value,location:document.getElementById("postLocation").value})})).json();o.style.display="none",s("success","Listed on Pasar!"),y(),c.matchFound&&(document.getElementById("matchText").innerText=`Farmer ${c.matchFound.author} has "${c.matchFound.title}" and is waiting for a trade!`,document.getElementById("magicMatchModal").style.display="flex")}catch{s("error","Failed to post")}}),document.getElementById("btnSearch").addEventListener("click",()=>{const i=document.getElementById("searchInput").value;y(i)})}async function y(t=""){try{const e=`http://localhost:3000/api/community/barter${t?"?search="+t:""}`;v=await(await fetch(e)).json(),w()}catch(e){console.error("Market Load Error:",e),document.getElementById("barterFeedList").innerHTML="Market is currently closed."}}function w(){const t=document.getElementById("barterFeedList"),e=f==="pasar"?v.filter(o=>o.status==="available"):v.filter(o=>o.author===u||o.buyer===u);if(e.length===0){t.innerHTML=`<div style="grid-column: span 2; text-align:center; padding:40px 20px; color:gray;">
            <div style="font-size:40px; margin-bottom:10px;">🛒</div>Nothing here yet.</div>`;return}t.innerHTML=e.map(o=>{o.author;const n=o.buyer===u;let i="";o.tradeType==="coins"?i=`🍃 ${o.priceCoins}`:o.tradeType==="barter"?i=`🔄 ${o.lookingFor}`:i=`🍃 ${o.priceCoins} or 🔄 ${o.lookingFor}`;let r="";return f==="pasar"&&o.status==="available"?o.author===u?r=`<button class="btn-outline" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; color:#10B981; border:1px solid #10B981; cursor:default;">It's your item</button>`:r=`<button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; background:#10B981; border:none;" onclick="window.reserveItem('${o.id}')">Reserve Now</button>`:n&&o.status==="reserved"&&(r=`<button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; background:#EAB308; border:none;" onclick="window.completeItem('${o.id}')">📦 Confirm Receipt</button>`),`
        <div class="barter-card">
            <!-- 状态标签 -->
            <div class="status-badge status-${o.status}">${o.status.toUpperCase()}</div>
            
           <img src="${H(o)}" class="barter-img"
     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80'">
            
            <div style="padding:10px; display:flex; flex-direction:column; flex:1;">
                <h4 style="margin:0 0 5px 0; font-size:0.95rem;">${o.title}</h4>
                <div style="font-size:0.7rem; color:gray; margin-bottom:5px;">By: ${o.author} <span class="trust-badge">★ Trusted</span></div>
                <div style="font-size:0.75rem; color:#4B5563; margin-bottom:10px;">📍 ${o.location||"College Hall"}</div>
                
                <div style="color:#059669; font-weight:bold; font-size:0.85rem; margin-top:auto; margin-bottom:10px;">
                    ${i}
                </div>
                
                ${r}
            </div>
        </div>
        `}).join("")}window.reserveItem=async function(t){if(confirm("Reserve this item? Coins will be locked."))try{const e=await fetch(`http://localhost:3000/api/community/barter/${t}/reserve`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({buyer:u,paymentMethod:"coins"})}),o=await e.json();e.ok?(s("success","Reserved! Meet at the location."),y()):s("warning",o.message)}catch{s("error","Error reserving")}};window.completeItem=async function(t){if(confirm("Did you receive the item? Funds will be released to seller."))try{await fetch(`http://localhost:3000/api/community/barter/${t}/complete`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rating:5})}),s("success","Transaction Completed! Seller gets +1 Trust."),y()}catch{s("error","Error")}};let B="all",E=[];async function q(t){const e=document.getElementById(t);e.innerHTML=`
        <!-- 顶部视图切换按钮 -->
        <div style="display:flex; gap:10px; margin-top:15px; margin-bottom:15px; background: white; padding: 5px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <button id="btnViewAll" style="flex:1; padding:10px; border-radius:8px; border:none; background:#E0F2FE; color:#0369A1; font-weight:bold; cursor:pointer; transition:0.3s;">🌍 Community</button>
            <button id="btnViewMine" style="flex:1; padding:10px; border-radius:8px; border:none; background:transparent; color:gray; font-weight:bold; cursor:pointer; transition:0.3s;">👤 My Beacons</button>
        </div>

        <!-- 帖子列表 -->
        <div id="sosFeedList" style="display: flex; flex-direction: column; gap: 15px;">
            <div style="text-align:center; padding:20px; color:gray;">Loading posts...</div>
        </div>

        <!-- 右下角悬浮发帖按钮 -->
        <button id="fabAddSos" style="
            position: fixed; bottom: 90px; right: 20px; 
            width: 56px; height: 56px; border-radius: 50%; 
            background: #DC2626; color: white; border: none; 
            font-size: 28px; box-shadow: 0 4px 10px rgba(220,38,38,0.4);
            cursor: pointer; z-index: 100; display: flex; justify-content: center; align-items: center; transition: transform 0.2s;
        ">+</button>

        <!-- 1. 发帖弹窗 (Modal) -->
        <div id="sosPostModal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 999; justify-content: center; align-items: center; backdrop-filter: blur(4px);">
            <div style="background: white; width: 90%; max-width: 400px; border-radius: 16px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <h3 style="margin-top:0;">🚨 New SOS Beacon</h3>
                <input id="sosInputTitle" type="text" placeholder="Problem title (e.g. Yellow Leaves)" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #ddd; box-sizing:border-box;">
                <textarea id="sosInputContent" placeholder="Describe the symptoms..." style="width:100%; padding:10px; height:80px; margin-bottom:10px; border-radius:8px; border:1px solid #ddd; box-sizing:border-box;"></textarea>
                
                <!-- 上传图片按钮 -->
                <div style="margin-bottom: 15px;">
                    <label for="sosImageUpload" style="display:inline-block; padding:8px 12px; background:#f0f0f0; border-radius:8px; cursor:pointer; font-size:0.8rem; font-weight:bold;">
                        📷 Upload Photo
                    </label>
                    <input type="file" id="sosImageUpload" accept="image/*" style="display:none;">
                    <div id="imagePreview" style="margin-top:10px; max-height:150px; overflow:hidden; border-radius:8px; text-align:center;"></div>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button id="btnCancelSos" class="btn-outline" style="flex:1;">Cancel</button>
                    <button id="btnSubmitSos" class="btn-primary" style="flex:1; background:#DC2626; border:none;">Broadcast</button>
                </div>
            </div>
        </div>

        <!-- 2. 自定义确认删除弹窗 (替代丑陋的 confirm) -->
        <div id="customConfirmModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center; backdrop-filter: blur(4px);">
            <div style="background:white; padding:20px; border-radius:16px; width:80%; max-width:300px; text-align:center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <div style="font-size: 40px; margin-bottom: 10px;">🗑️</div>
                <h4 style="margin:0 0 10px 0;">Delete Beacon?</h4>
                <p style="font-size:0.85rem; color:gray; line-height:1.4;">This action cannot be undone. Are you sure you want to remove this post?</p>
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button id="btnConfirmCancel" class="btn-outline" style="flex:1;">Keep it</button>
                    <button id="btnConfirmOk" class="btn-primary" style="flex:1; background:#DC2626; border:none;">Delete</button>
                </div>
            </div>
        </div>

        <!-- 3. 自定义打赏弹窗 (替代丑陋的 prompt) -->
        <div id="customPromptModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center; backdrop-filter: blur(4px);">
            <div style="background:white; padding:20px; border-radius:16px; width:80%; max-width:300px; text-align:center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <div style="font-size: 40px; margin-bottom: 10px;">🎁</div>
                <h4 style="margin:0 0 5px 0;">Reward Neighbor</h4>
                <p id="promptMsg" style="font-size:0.85rem; color:gray; margin-bottom:15px;">How many coins to send?</p>
                <input type="number" id="promptInput" value="10" style="width:100%; padding:12px; border-radius:8px; border:2px solid #FDE047; margin-bottom:20px; box-sizing:border-box; text-align:center; font-weight:bold; font-size:1.1rem; outline:none;">
                <div style="display:flex; gap:10px;">
                    <button id="btnPromptCancel" class="btn-outline" style="flex:1;">Cancel</button>
                    <button id="btnPromptOk" class="btn-primary" style="flex:1; background:#EAB308; color:white; border:none;">Send Coins</button>
                </div>
            </div>
        </div>
    `,Y(),b()}function Y(){document.getElementById("btnViewAll").addEventListener("click",i=>{B="all",i.target.style.background="#E0F2FE",i.target.style.color="#0369A1",document.getElementById("btnViewMine").style.background="transparent",document.getElementById("btnViewMine").style.color="gray",k()}),document.getElementById("btnViewMine").addEventListener("click",i=>{B="mine",i.target.style.background="#FEE2E2",i.target.style.color="#DC2626",document.getElementById("btnViewAll").style.background="transparent",document.getElementById("btnViewAll").style.color="gray",k()});const t=document.getElementById("sosPostModal"),e=document.getElementById("sosImageUpload"),o=document.getElementById("imagePreview");let n=null;document.getElementById("fabAddSos").addEventListener("click",()=>t.style.display="flex"),document.getElementById("btnCancelSos").addEventListener("click",()=>t.style.display="none"),e.addEventListener("change",function(){const i=this.files[0];if(i){const r=new FileReader;r.onload=function(a){n=a.target.result,o.innerHTML=`<img src="${n}" style="max-width:100%; max-height:150px; border-radius:8px; object-fit:contain;">`},r.readAsDataURL(i)}}),document.getElementById("btnSubmitSos").addEventListener("click",async()=>{const i=document.getElementById("sosInputTitle").value,r=document.getElementById("sosInputContent").value,a=document.getElementById("btnSubmitSos");if(!i||!r)return s("warning","Please fill in both title and description!");a.disabled=!0,a.innerText="Broadcasting...";try{await fetch("http://localhost:3000/api/community/posts/sos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:i,content:r,author:"MyFarm",image:n})}),t.style.display="none",document.getElementById("sosInputTitle").value="",document.getElementById("sosInputContent").value="",o.innerHTML="",n=null,s("success","SOS broadcasted successfully!"),b()}catch{s("error","Network error")}finally{a.disabled=!1,a.innerText="Broadcast"}})}async function b(){try{E=await(await fetch("http://localhost:3000/api/community/posts")).json(),k()}catch{document.getElementById("sosFeedList").innerHTML='<div style="color:red; text-align:center;">Failed to load posts.</div>'}}function k(){const t=document.getElementById("sosFeedList"),e="MyFarm",o=B==="all"?E:E.filter(n=>n.author===e);if(o.length===0){t.innerHTML=`<div style="text-align:center; color:gray; padding:40px 20px;">
            <div style="font-size:40px; margin-bottom:10px;">🍃</div>
            No beacons found here.<br>You are all good!
        </div>`;return}t.innerHTML=o.map(n=>{const i=n.author===e,r=n.likes||0;return`
        <div class="card" style="border-radius:16px; padding: 18px; border: 1px solid #f0f0f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); background: white;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:36px; height:36px; background:${i?"#FEE2E2":"#E0E7FF"}; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px;">${i?"👤":"👩‍🌾"}</div>
                    <span style="font-weight:bold; font-size:0.95rem; color:#1f2937;">${n.author}</span>
                </div>
                <span style="color:#9CA3AF; font-size:0.75rem;">${n.createdAt?new Date(n.createdAt).toLocaleDateString():"Just now"}</span>
            </div>
            
            <h4 style="margin: 0 0 6px 0; color:#111827; font-size:1.05rem;">${n.title}</h4>
            <p style="font-size:0.9rem; color:#4B5563; line-height:1.5; margin-bottom:12px;">${n.content}</p>
            
            <!-- 如果有图片，渲染图片 -->
            ${n.image?`<img src="${n.image}" style="width:100%; border-radius:12px; margin-bottom:12px; object-fit:cover;">`:""}
            
            <!-- 帖子操作区 -->
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <button class="btn-outline" style="padding:6px 12px; font-size:0.8rem; border-color:#10B981; color:#10B981; border-radius:20px; display:flex; align-items:center; gap:5px;" onclick="window.likePost('${n.id}')">
                    🍃 <span style="font-weight:bold;">${r}</span>
                </button>
                <!-- 重点：只有是自己的帖子，才显示删除按钮 -->
                ${i?`<button class="btn-outline" style="padding:6px 12px; font-size:0.8rem; border-color:#FCA5A5; color:#DC2626; border-radius:20px; display:flex; align-items:center; gap:5px;" onclick="window.deletePost('${n.id}')">🗑️ Delete</button>`:""}
            </div>

            <!-- 评论区 -->
            <div style="background:#F9FAFB; padding:12px; border-radius:12px; margin-bottom:12px;">
                <div style="font-size:0.75rem; font-weight:bold; margin-bottom:8px; color:#6B7280; letter-spacing:0.5px;">SUGGESTIONS (${n.comments?n.comments.length:0})</div>
                ${(n.comments||[]).map(a=>`
                    <div style="font-size:0.85rem; margin-bottom:8px; display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 1px solid #F3F4F6; padding-bottom:8px;">
                        <div style="line-height:1.4;"><b style="color:#374151;">${a.author}:</b> <span style="color:#4B5563;">${a.text}</span></div>
                        <!-- 如果是我的帖子，且评论不是我发的，可以打赏 -->
                        ${i&&a.author!==e?`
                            <button style="background:#FEF08A; color:#854D0E; border:none; padding:4px 10px; border-radius:12px; font-size:0.75rem; cursor:pointer; font-weight:bold;" onclick="window.rewardComment('${n.id}', '${a.author}')">
                                🎁 Tip
                            </button>
                        `:""}
                    </div>
                `).join("")}
            </div>

            <!-- 发表评论 -->
            <div style="display:flex; gap:8px;">
                <input type="text" id="commentInput_${n.id}" placeholder="Type your suggestion..." style="flex:1; border-radius:20px; border:1px solid #E5E7EB; padding:8px 15px; font-size:0.85rem; outline:none; background:#F9FAFB;">
                <button class="btn-primary" style="padding:8px 18px; border-radius:20px; font-size:0.85rem;" onclick="window.submitComment('${n.id}')">Send</button>
            </div>
        </div>
    `}).join("")}window.submitComment=async function(t){const e=document.getElementById(`commentInput_${t}`);if(!e.value)return s("warning","Comment cannot be empty!");try{await fetch(`http://localhost:3000/api/community/posts/${t}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:e.value,author:"HelpfulNeighbor"})}),s("success","Suggestion added!"),b()}catch{s("error","Failed to send comment")}};window.deletePost=function(t){const e=document.getElementById("customConfirmModal");e.style.display="flex",document.getElementById("btnConfirmCancel").onclick=()=>{e.style.display="none"},document.getElementById("btnConfirmOk").onclick=async()=>{e.style.display="none";try{await fetch(`http://localhost:3000/api/community/posts/${t}`,{method:"DELETE"}),s("success","Beacon removed from community"),b()}catch{s("error","Error deleting beacon")}}};window.likePost=async function(t){try{await fetch(`http://localhost:3000/api/community/posts/${t}/like`,{method:"POST"}),b()}catch{s("error","Network error")}};window.rewardComment=function(t,e){const o=document.getElementById("customPromptModal");document.getElementById("promptMsg").innerText=`Send coins to ${e} as a thank you!`,document.getElementById("promptInput").value="10",o.style.display="flex",document.getElementById("btnPromptCancel").onclick=()=>{o.style.display="none"},document.getElementById("btnPromptOk").onclick=async()=>{const n=document.getElementById("promptInput").value,i=Number(n);if(o.style.display="none",!i||isNaN(i)||i<=0)return s("warning","Invalid coin amount!");try{const r=await fetch(`http://localhost:3000/api/community/posts/${t}/reward`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:i,receiver:e})}),a=await r.json();if(r.ok){s("success",`Awesome! Sent ${i} 🍃 to ${e}!`);const c=document.getElementById("myCoinsDisplay").innerText,h=parseInt(c.replace(/[^0-9]/g,""));document.getElementById("myCoinsDisplay").innerText=`🍃 ${h-i} Coins`}else s("warning",a.message)}catch{s("error","Failed to send reward")}}};function Z(){const t=document.getElementById("screenContainer");t.innerHTML=`
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

        </div>
    `,document.getElementById("communityBackBtn").addEventListener("click",()=>P("home")),J(),C("commContentArea"),W()}function J(){const t=document.querySelectorAll(".comm-circle-btn");t.forEach(e=>{e.addEventListener("click",()=>{t.forEach(n=>n.classList.remove("active")),e.classList.add("active");const o=e.getAttribute("data-tab");o==="visits"?C("commContentArea"):o==="barter"?U("commContentArea"):o==="sos"&&q("commContentArea")})})}async function W(){try{const e=await(await fetch("http://localhost:3000/api/community/me")).json();document.getElementById("myCoinsDisplay").innerText=`🍃 ${e.coins} Coins`}catch{console.warn("Backend not detected, using static UI state.")}}export{Z as render};
