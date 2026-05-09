import{a as r,s as E}from"./index-DYDVqnDN.js";import"https://esm.sh/three@0.160.0";let f=[],v="";async function w(n){v=n;const e=document.getElementById(n);e.innerHTML=`
        <div style="margin-top:15px; margin-bottom:15px;">
            <h3 style="margin:0 0 5px 0; color:#1f2937;">🏡 Neighborhood Farms</h3>
            <p style="margin:0; font-size:0.8rem; color:gray;">Visit neighbors, help out, and earn coins!</p>
        </div>
        
        <!-- 列表容器 -->
        <div id="neighborsListArea" style="display:flex; flex-direction:column; gap:12px;">
            <div style="text-align:center; padding:20px; color:gray;">Scouting neighborhood...</div>
        </div>
    `,await I()}async function I(){try{f=await(await fetch("http://localhost:3000/api/community/visits/neighbors")).json(),T()}catch{document.getElementById("neighborsListArea").innerHTML='<div style="color:red; text-align:center;">Failed to connect to neighborhood.</div>'}}function T(){const n=document.getElementById("neighborsListArea");n.innerHTML=f.map(e=>{const t=e.moisture<30;return`
        <div class="card" style="display:flex; align-items:center; padding:15px; border-radius:16px; border: 1px solid #f0f0f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); cursor:pointer; transition: transform 0.2s;" onclick="window.visitFarm('${e.id}')">
            <div style="font-size:35px; margin-right:15px; background:#f9fafb; border-radius:50%; width:60px; height:60px; display:flex; justify-content:center; align-items:center;">
                ${e.avatar}
            </div>
            
            <div style="flex:1;">
                <h4 style="margin:0 0 4px 0; font-size:1.05rem;">${e.name}</h4>
                <div style="font-size:0.8rem; color:gray;">Growing: ${e.plant}</div>
            </div>
            
            <!-- 状态图标 -->
            <div style="text-align:right;">
                ${e.hasBug?'<div style="font-size:1.2rem; animation: wiggle 1s infinite;">🐛</div>':""}
                ${t?'<div style="background:#FEF08A; color:#854D0E; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:bold; margin-top:5px;">💧 Needs Water</div>':'<div style="background:#D1FAE5; color:#065F46; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:bold; margin-top:5px;">🌿 Healthy</div>'}
            </div>
        </div>
    `}).join("")}window.visitFarm=function(n){const e=f.find(k=>k.id===n),t=document.getElementById(v),o=e.moisture<30,i=o?"#FCEBEB":"#EAF3DE",a=o?"🥀":"🌿",d=o?"filter: grayscale(60%) sepia(40%); transform: rotate(10deg);":"",s=o?"Plant is thirsty!":"Healthy & Happy!",g=o?"#DC2626":"#059669";t.innerHTML=`
        <!-- 返回按钮 -->
        <button class="btn-outline" style="margin-bottom:15px; border:none; padding:0; color:#2563EB; font-weight:bold; cursor:pointer;" onclick="window.backToNeighbors()">
            ← Back to Neighborhood
        </button>

        <div class="card" style="padding:0; overflow:hidden; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
            <!-- 农场主信息 -->
            <div style="padding: 16px; display:flex; align-items:center; gap:12px; background:white;">
                <div style="font-size:35px;">${e.avatar}</div>
                <div>
                    <div style="font-weight:900; font-size:1.1rem;">${e.name}</div>
                    <div style="font-size:0.75rem; color:gray;">Sensor: Soil Moisture <span id="uiMoisture">${e.moisture}</span>%</div>
                </div>
            </div>
            
            <!-- 数字孪生模型展示区 -->
            <div id="twinModel" style="height:250px; background:${i}; display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative; transition: background-color 0.8s ease;">
                
                <!-- 随机生成的虫子 (如果有) -->
                ${e.hasBug?`<div id="uiBug" class="bug-emoji" style="top:40px; right:60px;" onclick="window.catchBug('${e.id}')">🐛</div>`:""}

                <div id="plantEmoji" style="font-size:100px; ${d} transition: all 0.8s ease;">${a}</div>
                <div id="plantStatus" style="color:${g}; font-weight:900; margin-top:15px; font-size:1.1rem; transition: color 0.8s ease;">${s}</div>
            </div>

            <!-- 互动按钮 -->
            <div style="padding:20px; display:flex; gap:12px; background:white;">
                <button id="btnWater" class="btn-primary" style="flex:1; display:flex; justify-content:center; align-items:center; gap:8px; font-size:1rem; padding:12px; background:#3B82F6;" onclick="window.helpWater('${e.id}')" ${o?"":"disabled"}>
                    ${o?"<span>💧</span> Water Plant (+5 🍃)":"✅ Fully Watered"}
                </button>
            </div>
        </div>
    `};window.backToNeighbors=function(){w(v)};window.helpWater=async function(n){const e=document.getElementById("btnWater");e.disabled=!0,e.innerHTML="Watering...",C();try{const t=await fetch(`http://localhost:3000/api/community/visits/water/${n}`,{method:"POST"}),o=await t.json();if(t.ok){document.getElementById("twinModel").style.background="#EAF3DE";const i=document.getElementById("plantEmoji");i.innerText="🌿",i.style.filter="none",i.style.transform="rotate(0deg)";const a=document.getElementById("plantStatus");a.innerText="Healthy & Happy!",a.style.color="#059669",document.getElementById("uiMoisture").innerText="85",e.innerHTML="✅ Fully Watered",e.style.background="#9CA3AF",r("success",`Thanks for helping! (+${o.earned} 🍃)`),B(o.newTotal)}else r("warning",o.message),e.disabled=!1}catch{r("error","Network error."),e.disabled=!1}};window.catchBug=async function(n){try{const e=await fetch(`http://localhost:3000/api/community/visits/catch-bug/${n}`,{method:"POST"}),t=await e.json();if(e.ok){const o=document.getElementById("uiBug");o.style.transform="scale(0)",o.style.opacity="0",setTimeout(()=>o.remove(),300),r("success",`Gotcha! Bug caught. (+${t.earned} 🍃)`),B(t.newTotal)}}catch{r("error","The bug escaped!")}};function C(){const n=document.getElementById("twinModel");for(let e=0;e<15;e++)setTimeout(()=>{const t=document.createElement("div");t.innerText="💧",t.className="rain-drop",t.style.left=Math.random()*80+10+"%",t.style.fontSize=Math.random()*10+10+"px",n.appendChild(t),setTimeout(()=>t.remove(),800)},e*50)}function B(n){const e=document.getElementById("myCoinsDisplay");e&&(e.innerText=`🍃 ${n} Coins`)}let m="pasar",u=[];const l="MyFarm";async function $(n){const e=document.getElementById(n);e.innerHTML=`
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
    `,F(),c()}function F(){const n=document.getElementById("fabAddBarter"),e=document.getElementById("pasarSearchBar");document.getElementById("btnViewPasar").addEventListener("click",i=>{m="pasar",i.target.style.background="#D1FAE5",i.target.style.color="#065F46",document.getElementById("btnViewMyShop").style.background="transparent",document.getElementById("btnViewMyShop").style.color="gray",n.style.display="none",e.style.display="flex",y()}),document.getElementById("btnViewMyShop").addEventListener("click",i=>{m="myshop",i.target.style.background="#FEF3C7",i.target.style.color="#D97706",document.getElementById("btnViewPasar").style.background="transparent",document.getElementById("btnViewPasar").style.color="gray",n.style.display="flex",e.style.display="none",y()});const t=document.getElementById("barterPostModal");let o=null;document.getElementById("barterImageUpload").addEventListener("change",function(){if(this.files[0]){const i=new FileReader;i.onload=a=>{o=a.target.result,document.getElementById("barterImagePreview").innerHTML=`<img src="${o}" style="width:100%; object-fit:cover;">`},i.readAsDataURL(this.files[0])}}),n.addEventListener("click",()=>t.style.display="flex"),document.getElementById("btnCancelBarter").addEventListener("click",()=>t.style.display="none"),document.getElementById("btnSubmitBarter").addEventListener("click",async()=>{const i=document.getElementById("postTitle").value,a=document.getElementById("postTradeType").value;if(!i)return r("warning","Item name is required!");try{const s=await(await fetch("http://localhost:3000/api/community/barter",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:i,tradeType:a,author:l,image:o,priceCoins:document.getElementById("postCoins").value,lookingFor:document.getElementById("postLookingFor").value,location:document.getElementById("postLocation").value})})).json();t.style.display="none",r("success","Listed on Pasar!"),c(),s.matchFound&&(document.getElementById("matchText").innerText=`Farmer ${s.matchFound.author} has "${s.matchFound.title}" and is waiting for a trade!`,document.getElementById("magicMatchModal").style.display="flex")}catch{r("error","Failed to post")}}),document.getElementById("btnSearch").addEventListener("click",()=>{const i=document.getElementById("searchInput").value;c(i)})}async function c(n=""){try{u=await(await fetch(`http://localhost:3000/api/community/barter${n?"?search="+n:""}`)).json(),y()}catch{document.getElementById("barterFeedList").innerHTML="Error loading."}}function y(){const n=document.getElementById("barterFeedList"),e=m==="pasar"?u.filter(t=>t.status==="available"&&t.author!==l):u.filter(t=>t.author===l||t.buyer===l);if(e.length===0){n.innerHTML=`<div style="grid-column: span 2; text-align:center; padding:40px 20px; color:gray;">
            <div style="font-size:40px; margin-bottom:10px;">🛒</div>Nothing here yet.</div>`;return}n.innerHTML=e.map(t=>{t.author;const o=t.buyer===l;let i="";t.tradeType==="coins"?i=`🍃 ${t.priceCoins}`:t.tradeType==="barter"?i=`🔄 ${t.lookingFor}`:i=`🍃 ${t.priceCoins} or 🔄 ${t.lookingFor}`;let a="";return m==="pasar"&&t.status==="available"?a=`<button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; background:#10B981; border:none;" onclick="window.reserveItem('${t.id}')">Reserve Now</button>`:o&&t.status==="reserved"&&(a=`<button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; background:#EAB308; border:none;" onclick="window.completeItem('${t.id}')">📦 Confirm Receipt</button>`),`
        <div class="barter-card">
            <!-- 状态标签 -->
            <div class="status-badge status-${t.status}">${t.status.toUpperCase()}</div>
            
            <img src="${t.image||"https://via.placeholder.com/150?text=No+Photo"}" class="barter-img">
            
            <div style="padding:10px; display:flex; flex-direction:column; flex:1;">
                <h4 style="margin:0 0 5px 0; font-size:0.95rem;">${t.title}</h4>
                <div style="font-size:0.7rem; color:gray; margin-bottom:5px;">By: ${t.author} <span class="trust-badge">★ Trusted</span></div>
                <div style="font-size:0.75rem; color:#4B5563; margin-bottom:10px;">📍 ${t.location||"College Hall"}</div>
                
                <div style="color:#059669; font-weight:bold; font-size:0.85rem; margin-top:auto; margin-bottom:10px;">
                    ${i}
                </div>
                
                ${a}
            </div>
        </div>
        `}).join("")}window.reserveItem=async function(n){if(confirm("Reserve this item? Coins will be locked."))try{const e=await fetch(`http://localhost:3000/api/community/barter/${n}/reserve`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({buyer:l,paymentMethod:"coins"})}),t=await e.json();e.ok?(r("success","Reserved! Meet at the location."),c()):r("warning",t.message)}catch{r("error","Error reserving")}};window.completeItem=async function(n){if(confirm("Did you receive the item? Funds will be released to seller."))try{await fetch(`http://localhost:3000/api/community/barter/${n}/complete`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rating:5})}),r("success","Transaction Completed! Seller gets +1 Trust."),c()}catch{r("error","Error")}};let b="all",x=[];async function S(n){const e=document.getElementById(n);e.innerHTML=`
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
    `,M(),p()}function M(){document.getElementById("btnViewAll").addEventListener("click",i=>{b="all",i.target.style.background="#E0F2FE",i.target.style.color="#0369A1",document.getElementById("btnViewMine").style.background="transparent",document.getElementById("btnViewMine").style.color="gray",h()}),document.getElementById("btnViewMine").addEventListener("click",i=>{b="mine",i.target.style.background="#FEE2E2",i.target.style.color="#DC2626",document.getElementById("btnViewAll").style.background="transparent",document.getElementById("btnViewAll").style.color="gray",h()});const n=document.getElementById("sosPostModal"),e=document.getElementById("sosImageUpload"),t=document.getElementById("imagePreview");let o=null;document.getElementById("fabAddSos").addEventListener("click",()=>n.style.display="flex"),document.getElementById("btnCancelSos").addEventListener("click",()=>n.style.display="none"),e.addEventListener("change",function(){const i=this.files[0];if(i){const a=new FileReader;a.onload=function(d){o=d.target.result,t.innerHTML=`<img src="${o}" style="max-width:100%; max-height:150px; border-radius:8px; object-fit:contain;">`},a.readAsDataURL(i)}}),document.getElementById("btnSubmitSos").addEventListener("click",async()=>{const i=document.getElementById("sosInputTitle").value,a=document.getElementById("sosInputContent").value,d=document.getElementById("btnSubmitSos");if(!i||!a)return r("warning","Please fill in both title and description!");d.disabled=!0,d.innerText="Broadcasting...";try{await fetch("http://localhost:3000/api/community/posts/sos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:i,content:a,author:"MyFarm",image:o})}),n.style.display="none",document.getElementById("sosInputTitle").value="",document.getElementById("sosInputContent").value="",t.innerHTML="",o=null,r("success","SOS broadcasted successfully!"),p()}catch{r("error","Network error")}finally{d.disabled=!1,d.innerText="Broadcast"}})}async function p(){try{x=await(await fetch("http://localhost:3000/api/community/posts")).json(),h()}catch{document.getElementById("sosFeedList").innerHTML='<div style="color:red; text-align:center;">Failed to load posts.</div>'}}function h(){const n=document.getElementById("sosFeedList"),e="MyFarm",t=b==="all"?x:x.filter(o=>o.author===e);if(t.length===0){n.innerHTML=`<div style="text-align:center; color:gray; padding:40px 20px;">
            <div style="font-size:40px; margin-bottom:10px;">🍃</div>
            No beacons found here.<br>You are all good!
        </div>`;return}n.innerHTML=t.map(o=>{const i=o.author===e,a=o.likes||0;return`
        <div class="card" style="border-radius:16px; padding: 18px; border: 1px solid #f0f0f0; box-shadow: 0 4px 10px rgba(0,0,0,0.03); background: white;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:36px; height:36px; background:${i?"#FEE2E2":"#E0E7FF"}; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px;">${i?"👤":"👩‍🌾"}</div>
                    <span style="font-weight:bold; font-size:0.95rem; color:#1f2937;">${o.author}</span>
                </div>
                <span style="color:#9CA3AF; font-size:0.75rem;">${o.createdAt?new Date(o.createdAt).toLocaleDateString():"Just now"}</span>
            </div>
            
            <h4 style="margin: 0 0 6px 0; color:#111827; font-size:1.05rem;">${o.title}</h4>
            <p style="font-size:0.9rem; color:#4B5563; line-height:1.5; margin-bottom:12px;">${o.content}</p>
            
            <!-- 如果有图片，渲染图片 -->
            ${o.image?`<img src="${o.image}" style="width:100%; border-radius:12px; margin-bottom:12px; object-fit:cover;">`:""}
            
            <!-- 帖子操作区 -->
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <button class="btn-outline" style="padding:6px 12px; font-size:0.8rem; border-color:#10B981; color:#10B981; border-radius:20px; display:flex; align-items:center; gap:5px;" onclick="window.likePost('${o.id}')">
                    🍃 <span style="font-weight:bold;">${a}</span>
                </button>
                <!-- 重点：只有是自己的帖子，才显示删除按钮 -->
                ${i?`<button class="btn-outline" style="padding:6px 12px; font-size:0.8rem; border-color:#FCA5A5; color:#DC2626; border-radius:20px; display:flex; align-items:center; gap:5px;" onclick="window.deletePost('${o.id}')">🗑️ Delete</button>`:""}
            </div>

            <!-- 评论区 -->
            <div style="background:#F9FAFB; padding:12px; border-radius:12px; margin-bottom:12px;">
                <div style="font-size:0.75rem; font-weight:bold; margin-bottom:8px; color:#6B7280; letter-spacing:0.5px;">SUGGESTIONS (${o.comments?o.comments.length:0})</div>
                ${(o.comments||[]).map(d=>`
                    <div style="font-size:0.85rem; margin-bottom:8px; display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 1px solid #F3F4F6; padding-bottom:8px;">
                        <div style="line-height:1.4;"><b style="color:#374151;">${d.author}:</b> <span style="color:#4B5563;">${d.text}</span></div>
                        <!-- 如果是我的帖子，且评论不是我发的，可以打赏 -->
                        ${i&&d.author!==e?`
                            <button style="background:#FEF08A; color:#854D0E; border:none; padding:4px 10px; border-radius:12px; font-size:0.75rem; cursor:pointer; font-weight:bold;" onclick="window.rewardComment('${o.id}', '${d.author}')">
                                🎁 Tip
                            </button>
                        `:""}
                    </div>
                `).join("")}
            </div>

            <!-- 发表评论 -->
            <div style="display:flex; gap:8px;">
                <input type="text" id="commentInput_${o.id}" placeholder="Type your suggestion..." style="flex:1; border-radius:20px; border:1px solid #E5E7EB; padding:8px 15px; font-size:0.85rem; outline:none; background:#F9FAFB;">
                <button class="btn-primary" style="padding:8px 18px; border-radius:20px; font-size:0.85rem;" onclick="window.submitComment('${o.id}')">Send</button>
            </div>
        </div>
    `}).join("")}window.submitComment=async function(n){const e=document.getElementById(`commentInput_${n}`);if(!e.value)return r("warning","Comment cannot be empty!");try{await fetch(`http://localhost:3000/api/community/posts/${n}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:e.value,author:"HelpfulNeighbor"})}),r("success","Suggestion added!"),p()}catch{r("error","Failed to send comment")}};window.deletePost=function(n){const e=document.getElementById("customConfirmModal");e.style.display="flex",document.getElementById("btnConfirmCancel").onclick=()=>{e.style.display="none"},document.getElementById("btnConfirmOk").onclick=async()=>{e.style.display="none";try{await fetch(`http://localhost:3000/api/community/posts/${n}`,{method:"DELETE"}),r("success","Beacon removed from community"),p()}catch{r("error","Error deleting beacon")}}};window.likePost=async function(n){try{await fetch(`http://localhost:3000/api/community/posts/${n}/like`,{method:"POST"}),p()}catch{r("error","Network error")}};window.rewardComment=function(n,e){const t=document.getElementById("customPromptModal");document.getElementById("promptMsg").innerText=`Send coins to ${e} as a thank you!`,document.getElementById("promptInput").value="10",t.style.display="flex",document.getElementById("btnPromptCancel").onclick=()=>{t.style.display="none"},document.getElementById("btnPromptOk").onclick=async()=>{const o=document.getElementById("promptInput").value,i=Number(o);if(t.style.display="none",!i||isNaN(i)||i<=0)return r("warning","Invalid coin amount!");try{const a=await fetch(`http://localhost:3000/api/community/posts/${n}/reward`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:i,receiver:e})}),d=await a.json();if(a.ok){r("success",`Awesome! Sent ${i} 🍃 to ${e}!`);const s=document.getElementById("myCoinsDisplay").innerText,g=parseInt(s.replace(/[^0-9]/g,""));document.getElementById("myCoinsDisplay").innerText=`🍃 ${g-i} Coins`}else r("warning",d.message)}catch{r("error","Failed to send reward")}}};function j(){const n=document.getElementById("screenContainer");n.innerHTML=`
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
    `,document.getElementById("communityBackBtn").addEventListener("click",()=>E("home")),document.querySelectorAll(".bottom-nav .nav-item").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-screen");t&&E(t)})}),L(),w("commContentArea"),z()}function L(){const n=document.querySelectorAll(".comm-circle-btn");n.forEach(e=>{e.addEventListener("click",()=>{n.forEach(o=>o.classList.remove("active")),e.classList.add("active");const t=e.getAttribute("data-tab");t==="visits"?w("commContentArea"):t==="barter"?$("commContentArea"):t==="sos"&&S("commContentArea")})})}async function z(){try{const e=await(await fetch("http://localhost:3000/api/community/me")).json();document.getElementById("myCoinsDisplay").innerText=`🍃 ${e.coins} Coins`}catch{console.warn("Backend not detected, using static UI state.")}}export{j as render};
