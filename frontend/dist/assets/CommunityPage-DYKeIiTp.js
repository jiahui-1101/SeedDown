import{a as c,s as D}from"./index-Bzu5BYm7.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const L=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let y=[],z="";const j=`
<style id="visitsTabStyle">
/* ── animations ── */
@keyframes bugWiggle {
    0%,100% { transform:rotate(-15deg) scale(1);   }
    50%      { transform:rotate(15deg)  scale(1.15); }
}
@keyframes dropFall {
    0%   { opacity:1; transform:translateY(0)    scaleX(1); }
    80%  { opacity:1; transform:translateY(44px) scaleX(0.9); }
    100% { opacity:0; transform:translateY(56px) scaleX(0.6); }
}
@keyframes splashRing {
    0%   { opacity:0.9; transform:scale(0.2); }
    100% { opacity:0;   transform:scale(2.2); }
}
@keyframes clampSnap {
    0%   { transform:scale(1)   rotate(0deg);  opacity:1; }
    40%  { transform:scale(1.6) rotate(-25deg);opacity:1; }
    100% { transform:scale(0)   rotate(40deg); opacity:0; }
}
@keyframes coinPop {
    0%   { opacity:1; transform:translate(-50%,-50%) scale(0.5); }
    60%  { opacity:1; transform:translate(-50%,-130%) scale(1.2); }
    100% { opacity:0; transform:translate(-50%,-180%) scale(1); }
}
@keyframes tilePulse {
    0%,100% { box-shadow:0 0 0 0 rgba(96,165,250,0.4); }
    50%      { box-shadow:0 0 0 8px rgba(96,165,250,0);  }
}
/* ── 动画：筷子命中夹死虫子 ── */
@keyframes bugDie {
    0%   { transform: scale(1) rotate(0deg); opacity: 1; }
    30%  { transform: scale(0.8) translateY(-10px) rotate(-15deg); opacity: 1; background: rgba(0,0,0,0.1); border-radius: 50%; } /* 被夹起来 */
    100% { transform: scale(0.1) translateY(-40px) rotate(90deg); opacity: 0; } /* 被夹扁带走 */
}

/* ── 动画：筷子抓空 (像手抖了一下夹空) ── */
@keyframes toolMiss {
    0%, 100% { transform: translateX(0) scale(1); }
    25% { transform: translateX(-4px) scale(0.9) rotate(-10deg); }
    50% { transform: translateX(0) scale(0.8) rotate(5deg); } /* 夹紧 */
    75% { transform: translateX(4px) scale(0.9) rotate(-5deg); }
}

/* ── 动画：筷子命中动作 ── */
@keyframes chopstickAction {
    0% { transform: scale(1) translateY(0); }
    50% { transform: scale(0.8) translateY(10px) rotate(15deg); } /* 用力戳下去夹 */
    100% { transform: scale(1) translateY(0); }
}


/* ── neighbour list ── */
.neighbor-card {
    display:flex; align-items:center; padding:14px;
    border-radius:16px; border:1px solid #f0f0f0;
    background:white; cursor:pointer;
    box-shadow:0 3px 10px rgba(0,0,0,0.04);
    transition:transform .2s, box-shadow .2s;
}
.neighbor-card:hover { transform:translateY(-2px); box-shadow:0 6px 18px rgba(0,0,0,0.08); }

.status-badge {
    padding:4px 11px; border-radius:12px;
    font-size:.72rem; font-weight:700;
}
.badge-thirsty { background:#FEF08A; color:#854D0E; }
.badge-healthy { background:#D1FAE5; color:#065F46; }
.badge-bugged  { background:#FEE2E2; color:#991B1B; }

/* ── 2D farm grid ── */
.farm-viewport {
    width: 100%;
    height: 380px; /* 固定的展示区高度 */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto; /* 如果放得太大，允许滑动查看 */
    position: relative;
}

.farm-grid {
    display: grid;
    /* 将 1fr 改为固定的像素值，比如 85px */
    grid-template-columns: repeat(3, 85px);
    grid-template-rows: repeat(3, 85px);
    gap: 8px; 
    background: #5C3317;
    padding: 12px; 
    border-radius: 14px;
    box-shadow: inset 0 4px 10px rgba(0,0,0,0.35), 0 10px 20px rgba(0,0,0,0.15);
    /* 加入平滑的缩放动画 */
    transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    transform-origin: center center;
}

.farm-tile {
    width: 100%;
    height: 100%;
    background: #7B4A23;
    border-radius: 9px; 
    border: 2px solid #4A2C11;
    display: flex; 
    justify-content: center; 
    align-items: center;
    font-size: 2.2rem; 
    position: relative;
    transition: background 0.4s;
}
.farm-tile.dry   { background:#C19A6B; border-color:#A07850; }
.farm-tile.watered { animation:tilePulse .6s ease; }

.bug-icon {
    position:absolute; top:-7px; right:-7px;
    font-size:1.4rem; z-index:10;
    animation:bugWiggle .5s infinite alternate;
    filter:drop-shadow(0 2px 4px rgba(0,0,0,.3));
    cursor:default;
}

/* ── drag tool ── */
.drag-tool {
    font-size:2.6rem; cursor:grab; user-select:none;
    display:inline-block; touch-action:none;
    transition:transform .15s;
}
.drag-tool:active { cursor:grabbing; transform:scale(1.1); }
.drag-clone {
    position:fixed; pointer-events:none; z-index:9999;
    font-size:2.8rem; filter:drop-shadow(0 8px 20px rgba(0,0,0,.4));
}
.drop-zone.drag-over { outline:3px dashed #60A5FA; background:rgba(96,165,250,.06); }

/* ── water drops ── */
.water-drop {
    position:absolute; pointer-events:none; z-index:30;
    width:10px; height:14px;
    border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;
    background:#3B82F6;
    animation:dropFall .55s ease-in forwards;
}
.water-splash {
    position:absolute; pointer-events:none; z-index:29;
    width:30px; height:30px; border-radius:50%;
    border:3px solid rgba(96,165,250,.7);
    animation:splashRing .45s ease-out forwards;
}
.coin-pop {
    position:absolute; pointer-events:none; z-index:40;
    font-size:1.1rem; font-weight:800; color:#F59E0B;
    white-space:nowrap;
    animation:coinPop .9s ease forwards;
}

/* ── empty-state ── */
.empty-farm-state {
    text-align:center; padding:40px 20px;
    background:white; border-radius:16px;
    border:2px dashed #D1FAE5;
}
</style>`;async function S(t){z=t;const e=document.getElementById(t);document.getElementById("visitsTabStyle")||e.insertAdjacentHTML("beforebegin",j),e.innerHTML=`
        <div style="position: sticky; top: 0; z-index: 100; background: var(--bg, #f4f6f8); padding: 15px 0; margin-top: -15px; margin-bottom: 10px;">
            <h3 style="margin:0 0 4px; color:#1f2937;">🏡 Neighborhood Farms</h3>
            <p style="margin:0; font-size:.78rem; color:gray;">
                Drag 🪣 to water thirsty plants · drag 🦾 to catch bugs · earn 🍃 coins!
            </p>
        </div>
        
        <div id="neighborsListArea" style="display:flex;flex-direction:column;gap:12px;">
            <div style="text-align:center;padding:24px;color:gray;">Scouting neighborhood…</div>
        </div>`,await O()}async function O(){try{y=await(await fetch(`${L}/api/community/visits/neighbors`)).json()}catch{y=N()}H()}function N(){const t=[["🍅","🍅","🌿",null,"🌿",null,"🌱",null,"🌶️"],["🌿","🌿",null,"🥬","🌱",null,null,"🌿",null],[null,"🥬",null,"🌿",null,"🌱",null,null,"🌿"],["🌶️","🌶️","🌶️",null,"🌱",null,"🥕",null,"🥕"],["🍅","🥬","🌶️",null,null,null,"🌿","🌱",null]],e=["Aisha.Farm","Botani_Master","GreenThumb99","UTM_Agri","CityPlanter"],o=["👩‍🌾","👨‍🌾","🧑‍🌾","🏫","🏙️"];return e.map((n,i)=>{const r=Math.floor(Math.random()*23);return{id:`npc_${i}`,name:n,avatar:o[i],farmLayout:t[i],isNPC:!0,isThirsty:r>=5,bugCount:r>=18?2:r>=16?1:0,hoursOffline:r}})}function H(){const t=document.getElementById("neighborsListArea");if(!y.length){t.innerHTML=`
            <div class="empty-farm-state">
                <div style="font-size:3rem;margin-bottom:10px;">🌱</div>
                <h4 style="margin:0 0 6px;color:#1f2937;">No farms yet!</h4>
                <p style="font-size:.82rem;color:gray;margin:0;">
                    Create your farm first, then your neighbors will appear here.
                </p>
            </div>`;return}t.innerHTML=y.map(e=>{const o=[];e.isThirsty&&o.push('<span class="status-badge badge-thirsty">💧 Thirsty</span>'),e.bugCount&&o.push(`<span class="status-badge badge-bugged">🐛 ${e.bugCount} Bug${e.bugCount>1?"s":""}</span>`),o.length||o.push('<span class="status-badge badge-healthy">🌿 Healthy</span>');const n=(e.farmLayout||Array(9).fill(null)).slice(0,9).map(i=>`<div style="width:22px;height:22px;background:${i?"#7B4A23":"#5C3317"};border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:13px;">${i||""}</div>`).join("");return`
        <div class="neighbor-card" onclick="window.visitFarm('${e.id}')">
            <div style="font-size:32px;margin-right:12px;background:#f9fafb;border-radius:50%;
                        width:56px;height:56px;display:flex;justify-content:center;align-items:center;">
                ${e.avatar}
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:800;font-size:1rem;margin-bottom:4px;">${e.name}</div>
                <div style="display:grid;grid-template-columns:repeat(3,22px);gap:3px;margin-bottom:6px;">
                    ${n}
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">${o.join("")}</div>
            </div>
            <div style="font-size:1.4rem;color:#d1d5db;margin-left:8px;">›</div>
        </div>`}).join("")}window.visitFarm=function(t){window.currentZoomLevel=1;const e=y.find(p=>p.id===t);if(!e)return;const o=document.getElementById(z),n=e.isThirsty,i=e.bugCount>0,r=(e.farmLayout||Array(9).fill(null)).slice(0,9).map((p,u)=>{const s=e.bugCount>=1&&u===2||e.bugCount>=2&&u===6;return`
        <div class="farm-tile ${e.isThirsty?"dry":""}" id="tile_${u}">
            ${p?`<span>${p}</span>`:""}
            ${s?`<div class="bug-icon" id="bugOn_${t}_${u}">🐛</div>`:""}
        </div>`}).join("");o.innerHTML=`
        <div style="position: sticky; top: 0; z-index: 100; background: var(--bg, #f4f6f8); padding: 15px 0; margin-top: -15px; margin-bottom: 5px;">
            <button style="color:#2563EB;background:none;border:none;font-size:1rem;cursor:pointer;font-weight:700;"
                    onclick="window.backToNeighbors()">← Back</button>
        </div>

        <div style="border-radius:18px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.09);background:white;">

            <!-- Header -->
            <div style="padding:16px;display:flex;align-items:center;gap:12px;">
                <div style="font-size:34px;">${e.avatar}</div>
                <div style="flex:1;">
                    <div style="font-weight:900;font-size:1.05rem;">${e.name}</div>
                    <div style="font-size:.75rem;color:gray;">
                        ${e.isNPC?"🤖 NPC Farm":"👥 Real Farm"} ·
                        Offline ${e.hoursOffline}h
                    </div>
                </div>
                <div id="farmStatusBadge" class="status-badge ${e.isThirsty?"badge-thirsty":e.bugCount?"badge-bugged":"badge-healthy"}">
                    ${e.isThirsty?"💧 Thirsty":e.bugCount?`🐛 ${e.bugCount} Bug${e.bugCount>1?"s":""}`:"🌿 Healthy"}
                </div>
            </div>

            <!-- 2D Farm Grid -->
            <div id="canvasDropZone" class="drop-zone"
                 style="position:relative; 
                        background: radial-gradient(circle at 50% 0%, #FEF9C3 0%, #E0F2FE 40%, #DCFCE7 100%);
                        padding:16px; overflow:hidden;">
                
                <div style="position: absolute; top: 15px; right: 15px; display: flex; flex-direction: column; gap: 8px; z-index: 50;">
                    <button onclick="window.zoomFarm(0.2)" style="width:40px; height:40px; border-radius:50%; border:none; background:white; box-shadow:0 4px 10px rgba(0,0,0,0.15); cursor:pointer; font-size:1.2rem; transition:transform 0.1s;">➕</button>
                    <button onclick="window.zoomFarm(-0.2)" style="width:40px; height:40px; border-radius:50%; border:none; background:white; box-shadow:0 4px 10px rgba(0,0,0,0.15); cursor:pointer; font-size:1.2rem; transition:transform 0.1s;">➖</button>
                </div>

                <div style="font-size:.65rem;font-weight:800;color:#64748B;
                            letter-spacing:.08em;text-align:center;margin-bottom:5px;">
                    ↓ DRAG TOOLS ONTO THE FARM ↓
                </div>
                
                <div class="farm-viewport">
                    <div class="farm-grid" id="farmGridEl">
                        ${r}
                    </div>
                </div>
            </div>

            <!-- Toolbar -->
            <div style="padding:16px;border-top:1px solid #f3f4f6;">
                <div style="display:flex;justify-content:center;gap:48px;">

                    <!-- Bucket -->
                    <div style="text-align:center;">
                        <div id="toolBucket" class="drag-tool"
                             style="${n?"":"opacity:.3;cursor:not-allowed;"}">🪣</div>
                        <div id="bucketLabel" style="font-size:.7rem;color:#6B7280;margin-top:6px;">
                            ${n?"💧 Water (+5 🍃)":"Not thirsty"}
                        </div>
                    </div>

                    <!-- Clamp -->
                    <div style="text-align:center;">
                        <div id="toolClamp" class="drag-tool"
                             style="${i?"":"opacity:.3;cursor:not-allowed;"}">🥢</div>
                        <div id="clampLabel" style="font-size:.7rem;color:#6B7280;margin-top:6px;">
                            ${i?"🐛 Catch Bug (+10 🍃)":"No bugs"}
                        </div>
                    </div>

                </div>
            </div>
        </div>`;const a=document.getElementById("canvasDropZone"),l=document.getElementById("toolBucket"),m=document.getElementById("toolClamp");n&&l&&M(l,a,()=>_(t)),i&&m&&M(m,a,(p,u)=>Y(t,p,u))};function M(t,e,o){let n=null,i=!1,r=0,a=0;function l(s,d){n=document.createElement("div"),n.className="drag-clone",n.innerText=t.innerText,Object.assign(n.style,{left:s-r+"px",top:d-a+"px"}),document.body.appendChild(n)}function m(s,d){n&&(n.style.left=s-r+"px",n.style.top=d-a+"px",i=u(s,d,e),e.classList.toggle("drag-over",i))}function p(s,d){e.classList.remove("drag-over"),n==null||n.remove(),n=null,i&&(i=!1,o(s,d))}function u(s,d,g){const b=g.getBoundingClientRect();return s>=b.left&&s<=b.right&&d>=b.top&&d<=b.bottom}t.addEventListener("mousedown",s=>{s.preventDefault();const d=t.getBoundingClientRect();r=s.clientX-d.left,a=s.clientY-d.top,l(s.clientX,s.clientY);const g=v=>m(v.clientX,v.clientY),b=v=>{p(v.clientX,v.clientY),window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",b)};window.addEventListener("mousemove",g),window.addEventListener("mouseup",b)}),t.addEventListener("touchstart",s=>{s.preventDefault();const d=s.touches[0],g=t.getBoundingClientRect();r=d.clientX-g.left,a=d.clientY-g.top,l(d.clientX,d.clientY)},{passive:!1}),t.addEventListener("touchmove",s=>{s.preventDefault();const d=s.touches[0];m(d.clientX,d.clientY)},{passive:!1}),t.addEventListener("touchend",s=>{s.preventDefault();const d=s.changedTouches[0];p(d.clientX,d.clientY)},{passive:!1})}function R(t){const e=document.getElementById("farmGridEl");if(!e)return;const o=e.getBoundingClientRect(),n=t.getBoundingClientRect(),i=24;for(let r=0;r<i;r++)setTimeout(()=>{const a=document.createElement("div");a.className="water-drop";const l=o.left-n.left+Math.random()*o.width,m=o.top-n.top+Math.random()*(o.height-40);a.style.left=l+"px",a.style.top=m+"px",t.appendChild(a),setTimeout(()=>{const p=document.createElement("div");p.className="water-splash",p.style.left=l-10+"px",p.style.top=m+40+"px",t.appendChild(p),setTimeout(()=>{a.remove(),p.remove()},500)},450)},r*40)}async function _(t){const e=y.find(l=>l.id===t);if(!e||!e.isThirsty)return;const o=document.getElementById("canvasDropZone");R(o);const n=document.getElementById("toolBucket");n&&(n.style.opacity=".3",n.style.cursor="not-allowed"),document.querySelectorAll(".farm-tile").forEach(l=>{l.classList.remove("dry"),l.classList.add("watered"),setTimeout(()=>l.classList.remove("watered"),700)});let i=5;try{const m=await(await fetch(`${L}/api/community/visits/interact/${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"water"})})).json();i=m.earned||5,P(m.newTotal)}catch{}e.isThirsty=!1;const r=document.getElementById("farmStatusBadge");r&&(r.className="status-badge badge-healthy",r.innerText="🌿 Healthy");const a=document.getElementById("bucketLabel");a&&(a.innerText="✅ Watered!"),A(o,`+${i} 🍃`),c("success",`💧 Watered! +${i} 🍃`)}async function Y(t,e,o){const n=y.find(s=>s.id===t);if(!n||n.bugCount<=0)return;const i=document.querySelectorAll(`[id^="bugOn_${t}_"]`);let r=null;i.forEach(s=>{const d=s.getBoundingClientRect(),g=25;e>=d.left-g&&e<=d.right+g&&o>=d.top-g&&o<=d.bottom+g&&(r=s)});const a=document.getElementById("toolClamp");if(!r){a&&(a.style.animation="toolMiss 0.4s ease",setTimeout(()=>a.style.animation="",400)),c("warning","Missed! Use the chopsticks 🥢 directly on the bug! 🎯");return}a&&(a.style.animation="chopstickAction 0.5s ease",setTimeout(()=>a.style.animation="",500)),r.style.animation="bugDie 0.5s forwards",r.removeAttribute("id"),setTimeout(()=>r.remove(),500),n.bugCount-=1;const l=document.getElementById("farmStatusBadge");l&&(n.bugCount>0?l.innerText=`🐛 ${n.bugCount} Bug${n.bugCount>1?"s":""}`:(l.className="status-badge badge-healthy",l.innerText="🌿 Healthy"));const m=document.getElementById("clampLabel");m&&(m.innerText=n.bugCount>0?`🐛 ${n.bugCount} left!`:"✅ All bugs cleared!"),n.bugCount===0&&a&&(a.style.opacity=".3",a.style.cursor="not-allowed");let p=10;try{const d=await(await fetch(`${L}/api/community/visits/interact/${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"catch_bug"})})).json();p=d.earned||10,P(d.newTotal)}catch{}const u=document.getElementById("canvasDropZone");A(u,`+${p} 🍃`),c("success",`Gotcha! +${p} 🍃`)}function A(t,e){const o=document.createElement("div");o.className="coin-pop",o.innerText=e,o.style.left="50%",o.style.top="50%",t.appendChild(o),setTimeout(()=>o.remove(),950)}window.zoomFarm=function(t){window.currentZoomLevel+=t,window.currentZoomLevel<.6&&(window.currentZoomLevel=.6),window.currentZoomLevel>2.5&&(window.currentZoomLevel=2.5);const e=document.getElementById("farmGridEl");e&&(e.style.transform=`scale(${window.currentZoomLevel})`)};window.backToNeighbors=function(){S(z)};function P(t){if(!t)return;const e=document.getElementById("myCoinsDisplay");e&&(e.innerText=`🍃 ${t} Coins`)}const k=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,B={tomato:"https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&q=80",chilli:"https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=300&q=80",mint:"https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=300&q=80",basil:"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=300&q=80",spinach:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80",compost:"https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=300&q=80",veggie:"https://images.unsplash.com/photo-1566842600175-97dca3b105e4?w=300&q=80",seed:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80",default:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80"};function V(t){if(t.image)return t.image;const e=(t.title||"").toLowerCase();for(const[o,n]of Object.entries(B))if(e.includes(o))return n;return B.default}let w="pasar",C=[];const x="MyFarm",U=`
<style id="barterTabStyle">
.barter-grid {
    display:grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap:12px;
}
.barter-card {
    background:white; border-radius:14px; overflow:hidden;
    box-shadow:0 3px 12px rgba(0,0,0,0.07);
    border:1px solid #f0f0f0;
    display:flex; flex-direction:column;
    transition:transform .2s, box-shadow .2s;
}
.barter-card:hover { transform:translateY(-3px); box-shadow:0 8px 20px rgba(0,0,0,0.1); }
.barter-card-img {
    width:100%; aspect-ratio:4/3;
    object-fit:cover; display:block;
    background:#f3f4f6;
}
.barter-card-body { padding:10px; flex:1; display:flex; flex-direction:column; }
.barter-card-title { font-weight:700; font-size:.87rem; margin:0 0 4px; color:#111827; line-height:1.3; }
.barter-card-meta  { font-size:.7rem; color:gray; margin-bottom:6px; }
.barter-card-price { font-weight:800; font-size:.85rem; color:#059669; margin-top:auto; margin-bottom:8px; }
.barter-card-btn   { width:100%; padding:7px; border-radius:8px; font-size:.78rem;
                     font-weight:700; border:none; cursor:pointer; transition:opacity .15s; }
.barter-card-btn:hover { opacity:.85; }
.item-tag {
    display:inline-block; padding:2px 8px; border-radius:8px;
    font-size:.65rem; font-weight:700; margin-bottom:6px;
}
.tag-available { background:#D1FAE5; color:#065F46; }
.tag-reserved  { background:#FEF3C7; color:#92400E; }
.tag-completed { background:#E5E7EB; color:#374151; }
.trust-badge   { background:#DBEAFE; color:#1E40AF; border-radius:6px; padding:1px 6px; font-size:.65rem; font-weight:700; margin-left:4px; }

/* view toggle pills */
.view-toggle { display:flex; gap:8px; background:white; padding:5px; border-radius:12px; box-shadow:0 2px 5px rgba(0,0,0,.06); }
.view-pill { flex:1; padding:10px; border-radius:8px; border:none; font-weight:700; font-size:.85rem; cursor:pointer; transition:all .2s; }
</style>`;async function X(t){const e=document.getElementById(t);document.getElementById("barterTabStyle")||e.insertAdjacentHTML("beforebegin",U),e.innerHTML=`
        <!-- view toggle -->
        <div class="view-toggle" style="margin-top:15px;margin-bottom:12px;">
            <button id="btnViewPasar"  class="view-pill" style="background:#D1FAE5;color:#065F46;">🛍️ Pasar</button>
            <button id="btnViewMyShop" class="view-pill" style="background:transparent;color:gray;">🏪 My Shop</button>
        </div>

        <!-- search bar (pasar only) -->
        <div id="pasarSearchBar" style="display:flex;gap:8px;margin-bottom:14px;">
            <input type="text" id="searchInput" placeholder="Search veg, seeds, tools…"
                   style="flex:1;padding:10px 15px;border-radius:20px;border:1px solid #ddd;outline:none;font-size:.9rem;">
            <button id="btnSearch" style="border-radius:20px;padding:0 18px;background:#10B981;color:white;border:none;font-weight:700;cursor:pointer;">🔍</button>
        </div>

        <!-- grid -->
        <div id="barterFeedList" class="barter-grid"></div>

        <!-- FAB -->
        <button id="fabAddBarter" style="display:none;position:fixed;bottom:90px;right:20px;
            width:56px;height:56px;border-radius:50%;background:#10B981;color:white;border:none;
            font-size:28px;box-shadow:0 4px 10px rgba(16,185,129,.4);cursor:pointer;z-index:100;
            align-items:center;justify-content:center;">+</button>

        <!-- Post Modal -->
        <div id="barterPostModal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;
             background:rgba(0,0,0,.5);z-index:999;justify-content:center;align-items:center;backdrop-filter:blur(4px);">
            <div style="background:white;width:90%;max-width:400px;border-radius:16px;padding:20px;max-height:80vh;overflow-y:auto;">
                <h3 style="margin-top:0;">📦 Post Item to Pasar</h3>
                <input id="postTitle" type="text" placeholder="Item Name (e.g. Ugly Veggie Box)"
                       style="width:100%;padding:10px;margin-bottom:10px;border-radius:8px;border:1px solid #ddd;box-sizing:border-box;">
                <div style="margin-bottom:10px;">
                    <label style="font-size:.8rem;font-weight:700;">Trade Type:</label>
                    <select id="postTradeType" style="width:100%;padding:10px;border-radius:8px;border:1px solid #ddd;margin-top:5px;">
                        <option value="both">🔄 Coins OR Barter</option>
                        <option value="coins">🍃 Sell for Coins only</option>
                        <option value="barter">🤝 Barter only</option>
                    </select>
                </div>
                <div style="display:flex;gap:10px;margin-bottom:10px;">
                    <input id="postCoins" type="number" placeholder="🍃 Price" style="flex:1;padding:10px;border-radius:8px;border:1px solid #ddd;">
                    <input id="postLookingFor" type="text" placeholder="🔄 Want" style="flex:1;padding:10px;border-radius:8px;border:1px solid #ddd;">
                </div>
                <input id="postLocation" type="text" placeholder="📍 Meetup Location"
                       style="width:100%;padding:10px;margin-bottom:10px;border-radius:8px;border:1px solid #ddd;box-sizing:border-box;">
                <div style="margin-bottom:14px;text-align:center;">
                    <label for="barterImageUpload" style="display:inline-block;padding:8px 14px;background:#f0f0f0;border-radius:8px;cursor:pointer;font-size:.8rem;font-weight:700;">📷 Upload Photo</label>
                    <input type="file" id="barterImageUpload" accept="image/*" style="display:none;">
                    <div id="barterImagePreview" style="margin-top:8px;max-height:110px;overflow:hidden;border-radius:8px;"></div>
                </div>
                <div style="display:flex;gap:10px;">
                    <button id="btnCancelBarter" style="flex:1;padding:11px;border-radius:10px;border:1px solid #ddd;background:white;cursor:pointer;font-weight:700;">Cancel</button>
                    <button id="btnSubmitBarter" style="flex:1;padding:11px;border-radius:10px;border:none;background:#10B981;color:white;cursor:pointer;font-weight:700;">List Item</button>
                </div>
            </div>
        </div>

        <!-- Magic Match Modal -->
        <div id="magicMatchModal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;
             background:rgba(0,0,0,.7);z-index:1000;justify-content:center;align-items:center;">
            <div style="background:linear-gradient(135deg,#FFDEE9,#B5FFFC);padding:28px;border-radius:20px;
                        width:80%;max-width:320px;text-align:center;box-shadow:0 15px 30px rgba(0,0,0,.3);">
                <div style="font-size:50px;margin-bottom:10px;">🎉</div>
                <h3 style="margin:0 0 8px;color:#065F46;">Perfect Match Found!</h3>
                <p id="matchText" style="font-size:.88rem;color:#4B5563;margin-bottom:20px;">Someone has what you want!</p>
                <button style="width:100%;padding:12px;border-radius:20px;background:#10B981;color:white;border:none;font-weight:700;cursor:pointer;"
                        onclick="document.getElementById('magicMatchModal').style.display='none'">Awesome! 🙌</button>
            </div>
        </div>`,q(),f()}function q(){const t=document.getElementById("fabAddBarter"),e=document.getElementById("pasarSearchBar"),o=document.getElementById("barterPostModal");let n=null;document.getElementById("btnViewPasar").addEventListener("click",i=>{w="pasar",i.target.style.background="#D1FAE5",i.target.style.color="#065F46",document.getElementById("btnViewMyShop").style.background="transparent",document.getElementById("btnViewMyShop").style.color="gray",t.style.display="none",e.style.display="flex",T()}),document.getElementById("btnViewMyShop").addEventListener("click",i=>{w="myshop",i.target.style.background="#FEF3C7",i.target.style.color="#D97706",document.getElementById("btnViewPasar").style.background="transparent",document.getElementById("btnViewPasar").style.color="gray",t.style.display="flex",e.style.display="none",T()}),document.getElementById("barterImageUpload").addEventListener("change",function(){if(!this.files[0])return;const i=new FileReader;i.onload=r=>{n=r.target.result,document.getElementById("barterImagePreview").innerHTML=`<img src="${n}" style="width:100%;object-fit:cover;">`},i.readAsDataURL(this.files[0])}),t.addEventListener("click",()=>o.style.display="flex"),document.getElementById("btnCancelBarter").addEventListener("click",()=>o.style.display="none"),document.getElementById("btnSubmitBarter").addEventListener("click",async()=>{const i=document.getElementById("postTitle").value,r=document.getElementById("postTradeType").value;if(!i)return c("warning","Item name is required!");try{const l=await(await fetch(`${k}/api/community/barter`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:i,tradeType:r,author:x,image:n,priceCoins:document.getElementById("postCoins").value,lookingFor:document.getElementById("postLookingFor").value,location:document.getElementById("postLocation").value})})).json();o.style.display="none",c("success","Listed on Pasar!"),f(),l.matchFound&&(document.getElementById("matchText").innerText=`Farmer ${l.matchFound.author} has "${l.matchFound.title}" and wants a trade!`,document.getElementById("magicMatchModal").style.display="flex")}catch{c("error","Failed to post")}}),document.getElementById("btnSearch").addEventListener("click",()=>{f(document.getElementById("searchInput").value)}),document.getElementById("searchInput").addEventListener("keydown",i=>{i.key==="Enter"&&f(i.target.value)})}async function f(t=""){document.getElementById("barterFeedList").innerHTML='<div style="grid-column:1/-1;text-align:center;padding:30px;color:gray;">Loading market…</div>';try{const e=`${k}/api/community/barter${t?"?search="+encodeURIComponent(t):""}`;C=await(await fetch(e)).json(),T()}catch{document.getElementById("barterFeedList").innerHTML='<div style="grid-column:1/-1;text-align:center;padding:30px;color:#DC2626;">Market is currently closed.</div>'}}function T(){const t=document.getElementById("barterFeedList"),e=w==="pasar"?C.filter(o=>o.status==="available"):C.filter(o=>o.author===x||o.buyer===x);if(!e.length){t.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:gray;">
            <div style="font-size:42px;margin-bottom:10px;">🛒</div>
            <div style="font-weight:700;">Nothing here yet.</div>
            <div style="font-size:.82rem;margin-top:4px;">${w==="myshop"?"Tap + to list your first item!":"Come back soon!"}</div>
        </div>`;return}t.innerHTML=e.map(o=>{const n=o.author===x,i=o.buyer===x;let r="";o.tradeType==="coins"?r=`🍃 ${o.priceCoins} coins`:o.tradeType==="barter"?r=`🔄 ${o.lookingFor}`:r=`🍃 ${o.priceCoins} · 🔄 ${o.lookingFor}`;let a="";w==="pasar"&&o.status==="available"?a=n?'<button class="barter-card-btn" style="background:#F3F4F6;color:#6B7280;cursor:default;">Your item</button>':`<button class="barter-card-btn" style="background:#10B981;color:white;" onclick="window.reserveItem('${o.id}')">Reserve Now</button>`:i&&o.status==="reserved"&&(a=`<button class="barter-card-btn" style="background:#EAB308;color:white;" onclick="window.completeItem('${o.id}')">📦 Confirm Receipt</button>`);const l={available:"tag-available",reserved:"tag-reserved",completed:"tag-completed"}[o.status]||"tag-available";return`
        <div class="barter-card">
            <img src="${V(o)}" class="barter-card-img"
                 onerror="this.src='${B.default}'" loading="lazy">
            <div class="barter-card-body">
                <span class="item-tag ${l}">${o.status.toUpperCase()}</span>
                <div class="barter-card-title">${o.title}</div>
                <div class="barter-card-meta">
                    By: ${o.author}<span class="trust-badge">★</span><br>
                    📍 ${o.location||"College Hall"}
                </div>
                <div class="barter-card-price">${r}</div>
                ${a}
            </div>
        </div>`}).join("")}window.reserveItem=async function(t){if(confirm("Reserve this item? Coins will be locked."))try{const e=await fetch(`${k}/api/community/barter/${t}/reserve`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({buyer:x,paymentMethod:"coins"})}),o=await e.json();e.ok?(c("success","Reserved! Meet at the location."),f()):c("warning",o.message)}catch{c("error","Error reserving")}};window.completeItem=async function(t){if(confirm("Did you receive the item?"))try{await fetch(`${k}/api/community/barter/${t}/complete`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rating:5})}),c("success","Transaction Completed! Seller gets +1 Trust. 🌿"),f()}catch{c("error","Error")}};const h=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let I="all",$=[];const G=`
<style id="sosTabStyle">
.sos-grid {
    display:grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap:14px;
}
.sos-card {
    background:white; border-radius:16px; padding:16px;
    border:1px solid #f0f0f0;
    box-shadow:0 3px 12px rgba(0,0,0,.05);
    display:flex; flex-direction:column;
    transition:box-shadow .2s;
}
.sos-card:hover { box-shadow:0 6px 20px rgba(0,0,0,.09); }
.sos-card-header { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.sos-avatar { width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px; }
.sos-author { font-weight:700; font-size:.95rem; color:#1f2937; }
.sos-date   { font-size:.72rem; color:#9CA3AF; margin-left:auto; }
.sos-title  { font-weight:800; font-size:1rem; margin:0 0 6px; color:#111827; }
.sos-body   { font-size:.87rem; color:#4B5563; line-height:1.5; margin:0 0 10px; }
.sos-image  { width:100%;border-radius:10px;object-fit:cover;margin-bottom:10px;max-height:160px; }
.sos-actions { display:flex;gap:8px;margin-bottom:12px; }
.sos-action-btn {
    padding:6px 14px; border-radius:20px; font-size:.78rem; font-weight:700;
    border:1.5px solid; cursor:pointer; display:flex;align-items:center;gap:5px;
    transition:all .15s;
}
.sos-action-btn:hover { transform:scale(1.03); }
.btn-like   { border-color:#10B981;color:#10B981;background:white; }
.btn-delete { border-color:#FCA5A5;color:#DC2626;background:white; }
.sos-comments-box { background:#F9FAFB;padding:10px;border-radius:10px;margin-bottom:10px;flex:1; }
.sos-comment-label { font-size:.68rem;font-weight:700;color:#6B7280;letter-spacing:.06em;margin-bottom:8px; }
.sos-comment-item { font-size:.82rem;margin-bottom:7px;padding-bottom:7px;border-bottom:1px solid #F3F4F6;display:flex;justify-content:space-between;align-items:flex-start; }
.sos-comment-item:last-child { border-bottom:none;margin-bottom:0;padding-bottom:0; }
.tip-btn { background:#FEF08A;color:#854D0E;border:none;padding:3px 9px;border-radius:10px;font-size:.7rem;cursor:pointer;font-weight:700; }
.sos-comment-input-row { display:flex;gap:8px; }
.sos-comment-input { flex:1;border-radius:20px;border:1px solid #E5E7EB;padding:8px 14px;font-size:.83rem;outline:none;background:#F9FAFB; }
.sos-send-btn { padding:8px 16px;border-radius:20px;background:#DC2626;color:white;border:none;font-size:.82rem;cursor:pointer;font-weight:700; }
</style>`;async function Z(t){const e=document.getElementById(t);document.getElementById("sosTabStyle")||e.insertAdjacentHTML("beforebegin",G),e.innerHTML=`
        <!-- view toggle -->
        <div style="display:flex;gap:10px;margin-top:15px;margin-bottom:15px;background:white;padding:5px;border-radius:12px;box-shadow:0 2px 5px rgba(0,0,0,.06);">
            <button id="btnViewAll"  style="flex:1;padding:10px;border-radius:8px;border:none;background:#E0F2FE;color:#0369A1;font-weight:700;cursor:pointer;">🌍 Community</button>
            <button id="btnViewMine" style="flex:1;padding:10px;border-radius:8px;border:none;background:transparent;color:gray;font-weight:700;cursor:pointer;">👤 My Beacons</button>
        </div>

        <div id="sosFeedList" class="sos-grid"></div>

        <!-- FAB -->
        <button id="fabAddSos" style="position:fixed;bottom:90px;right:20px;
            width:56px;height:56px;border-radius:50%;background:#DC2626;color:white;border:none;
            font-size:28px;box-shadow:0 4px 10px rgba(220,38,38,.4);cursor:pointer;z-index:100;
            display:flex;align-items:center;justify-content:center;">+</button>

        <!-- Post Modal -->
        <div id="sosPostModal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;
             background:rgba(0,0,0,.5);z-index:999;justify-content:center;align-items:center;backdrop-filter:blur(4px);">
            <div style="background:white;width:90%;max-width:400px;border-radius:16px;padding:20px;box-shadow:0 10px 25px rgba(0,0,0,.2);">
                <h3 style="margin-top:0;">🚨 New SOS Beacon</h3>
                <input id="sosInputTitle" type="text" placeholder="Problem title (e.g. Yellow Leaves)"
                       style="width:100%;padding:10px;margin-bottom:10px;border-radius:8px;border:1px solid #ddd;box-sizing:border-box;">
                <textarea id="sosInputContent" placeholder="Describe the symptoms…"
                          style="width:100%;padding:10px;height:80px;margin-bottom:10px;border-radius:8px;border:1px solid #ddd;box-sizing:border-box;resize:none;"></textarea>
                <div style="margin-bottom:14px;">
                    <label for="sosImageUpload" style="display:inline-block;padding:8px 13px;background:#f0f0f0;border-radius:8px;cursor:pointer;font-size:.8rem;font-weight:700;">📷 Upload Photo</label>
                    <input type="file" id="sosImageUpload" accept="image/*" style="display:none;">
                    <div id="imagePreview" style="margin-top:8px;max-height:130px;overflow:hidden;border-radius:8px;text-align:center;"></div>
                </div>
                <div style="display:flex;gap:10px;">
                    <button id="btnCancelSos" style="flex:1;padding:11px;border-radius:10px;border:1px solid #ddd;background:white;cursor:pointer;font-weight:700;">Cancel</button>
                    <button id="btnSubmitSos" style="flex:1;padding:11px;border-radius:10px;border:none;background:#DC2626;color:white;cursor:pointer;font-weight:700;">Broadcast</button>
                </div>
            </div>
        </div>

        <!-- Custom confirm modal -->
        <div id="customConfirmModal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;
             background:rgba(0,0,0,.5);z-index:1000;justify-content:center;align-items:center;backdrop-filter:blur(4px);">
            <div style="background:white;padding:22px;border-radius:16px;width:80%;max-width:300px;text-align:center;">
                <div style="font-size:40px;margin-bottom:10px;">🗑️</div>
                <h4 style="margin:0 0 8px;">Delete Beacon?</h4>
                <p style="font-size:.83rem;color:gray;margin-bottom:18px;">This cannot be undone.</p>
                <div style="display:flex;gap:10px;">
                    <button id="btnConfirmCancel" style="flex:1;padding:11px;border-radius:10px;border:1px solid #ddd;background:white;cursor:pointer;font-weight:700;">Keep it</button>
                    <button id="btnConfirmOk" style="flex:1;padding:11px;border-radius:10px;border:none;background:#DC2626;color:white;cursor:pointer;font-weight:700;">Delete</button>
                </div>
            </div>
        </div>

        <!-- Custom tip prompt -->
        <div id="customPromptModal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;
             background:rgba(0,0,0,.5);z-index:1000;justify-content:center;align-items:center;backdrop-filter:blur(4px);">
            <div style="background:white;padding:22px;border-radius:16px;width:80%;max-width:300px;text-align:center;">
                <div style="font-size:40px;margin-bottom:10px;">🎁</div>
                <h4 style="margin:0 0 5px;">Reward Neighbor</h4>
                <p id="promptMsg" style="font-size:.83rem;color:gray;margin-bottom:14px;">How many coins to send?</p>
                <input type="number" id="promptInput" value="10"
                       style="width:100%;padding:12px;border-radius:8px;border:2px solid #FDE047;margin-bottom:18px;
                              box-sizing:border-box;text-align:center;font-weight:700;font-size:1.1rem;outline:none;">
                <div style="display:flex;gap:10px;">
                    <button id="btnPromptCancel" style="flex:1;padding:11px;border-radius:10px;border:1px solid #ddd;background:white;cursor:pointer;font-weight:700;">Cancel</button>
                    <button id="btnPromptOk" style="flex:1;padding:11px;border-radius:10px;border:none;background:#EAB308;color:white;cursor:pointer;font-weight:700;">Send Coins</button>
                </div>
            </div>
        </div>`,J(),E()}function J(){document.getElementById("btnViewAll").addEventListener("click",i=>{I="all",i.target.style.background="#E0F2FE",i.target.style.color="#0369A1",document.getElementById("btnViewMine").style.background="transparent",document.getElementById("btnViewMine").style.color="gray",F()}),document.getElementById("btnViewMine").addEventListener("click",i=>{I="mine",i.target.style.background="#FEE2E2",i.target.style.color="#DC2626",document.getElementById("btnViewAll").style.background="transparent",document.getElementById("btnViewAll").style.color="gray",F()});const t=document.getElementById("sosPostModal"),e=document.getElementById("sosImageUpload"),o=document.getElementById("imagePreview");let n=null;document.getElementById("fabAddSos").addEventListener("click",()=>t.style.display="flex"),document.getElementById("btnCancelSos").addEventListener("click",()=>t.style.display="none"),e.addEventListener("change",function(){const i=this.files[0];if(!i)return;const r=new FileReader;r.onload=a=>{n=a.target.result,o.innerHTML=`<img src="${n}" style="max-width:100%;max-height:130px;border-radius:8px;object-fit:contain;">`},r.readAsDataURL(i)}),document.getElementById("btnSubmitSos").addEventListener("click",async()=>{const i=document.getElementById("sosInputTitle").value,r=document.getElementById("sosInputContent").value,a=document.getElementById("btnSubmitSos");if(!i||!r)return c("warning","Please fill in both fields!");a.disabled=!0,a.innerText="Broadcasting…";try{await fetch(`${h}/api/community/posts/sos`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:i,content:r,author:"MyFarm",image:n})}),t.style.display="none",document.getElementById("sosInputTitle").value="",document.getElementById("sosInputContent").value="",o.innerHTML="",n=null,c("success","SOS broadcasted!"),E()}catch{c("error","Network error")}finally{a.disabled=!1,a.innerText="Broadcast"}})}async function E(){document.getElementById("sosFeedList").innerHTML='<div style="grid-column:1/-1;text-align:center;padding:28px;color:gray;">Loading beacons…</div>';try{$=await(await fetch(`${h}/api/community/posts`)).json(),F()}catch{document.getElementById("sosFeedList").innerHTML='<div style="grid-column:1/-1;color:#DC2626;text-align:center;padding:20px;">Failed to load posts.</div>'}}function F(){const t=document.getElementById("sosFeedList"),e="MyFarm",o=I==="all"?$:$.filter(n=>n.author===e);if(!o.length){t.innerHTML=`<div style="grid-column:1/-1;text-align:center;color:gray;padding:48px 20px;">
            <div style="font-size:40px;margin-bottom:10px;">🍃</div>
            <div style="font-weight:700;">No beacons found.</div>
            <div style="font-size:.82rem;margin-top:4px;">Everything looks green!</div>
        </div>`;return}t.innerHTML=o.map(n=>{const i=n.author===e;return`
        <div class="sos-card">
            <div class="sos-card-header">
                <div class="sos-avatar" style="background:${i?"#FEE2E2":"#E0E7FF"};">${i?"👤":"👩‍🌾"}</div>
                <span class="sos-author">${n.author}</span>
                <span class="sos-date">${n.createdAt?new Date(n.createdAt).toLocaleDateString():"Just now"}</span>
            </div>
            <h4 class="sos-title">${n.title}</h4>
            <p class="sos-body">${n.content}</p>
            ${n.image?`<img src="${n.image}" class="sos-image">`:""}
            <div class="sos-actions">
                <button class="sos-action-btn btn-like" onclick="window.likePost('${n.id}')">
                    🍃 <span>${n.likes||0}</span>
                </button>
                ${i?`<button class="sos-action-btn btn-delete" onclick="window.deletePost('${n.id}')">🗑️ Delete</button>`:""}
            </div>
            <div class="sos-comments-box">
                <div class="sos-comment-label">SUGGESTIONS (${(n.comments||[]).length})</div>
                ${(n.comments||[]).map(r=>`
                    <div class="sos-comment-item">
                        <div style="line-height:1.4;"><b style="color:#374151;">${r.author}:</b> <span style="color:#4B5563;">${r.text}</span></div>
                        ${i&&r.author!==e?`<button class="tip-btn" onclick="window.rewardComment('${n.id}','${r.author}')">🎁 Tip</button>`:""}
                    </div>`).join("")}
            </div>
            <div class="sos-comment-input-row">
                <input type="text" id="commentInput_${n.id}" class="sos-comment-input" placeholder="Type your suggestion…">
                <button class="sos-send-btn" onclick="window.submitComment('${n.id}')">Send</button>
            </div>
        </div>`}).join("")}window.submitComment=async function(t){const e=document.getElementById(`commentInput_${t}`);if(!(e!=null&&e.value))return c("warning","Comment cannot be empty!");try{await fetch(`${h}/api/community/posts/${t}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:e.value,author:"HelpfulNeighbor"})}),c("success","Suggestion added!"),E()}catch{c("error","Failed to send")}};window.deletePost=function(t){const e=document.getElementById("customConfirmModal");e.style.display="flex",document.getElementById("btnConfirmCancel").onclick=()=>e.style.display="none",document.getElementById("btnConfirmOk").onclick=async()=>{e.style.display="none";try{await fetch(`${h}/api/community/posts/${t}`,{method:"DELETE"}),c("success","Beacon removed."),E()}catch{c("error","Error deleting")}}};window.likePost=async function(t){try{await fetch(`${h}/api/community/posts/${t}/like`,{method:"POST"}),E()}catch{c("error","Network error")}};window.rewardComment=function(t,e){const o=document.getElementById("customPromptModal");document.getElementById("promptMsg").innerText=`Send coins to ${e} as a thank you!`,document.getElementById("promptInput").value="10",o.style.display="flex",document.getElementById("btnPromptCancel").onclick=()=>o.style.display="none",document.getElementById("btnPromptOk").onclick=async()=>{const n=Number(document.getElementById("promptInput").value);if(o.style.display="none",!n||n<=0)return c("warning","Invalid amount!");try{const i=await fetch(`${h}/api/community/posts/${t}/reward`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:n,receiver:e})}),r=await i.json();if(i.ok){c("success",`Sent ${n} 🍃 to ${e}!`);const a=document.getElementById("myCoinsDisplay");if(a){const l=parseInt(a.innerText.replace(/\D/g,""));a.innerText=`🍃 ${l-n} Coins`}}else c("warning",r.message)}catch{c("error","Failed to send reward")}}};function oe(){const t=document.getElementById("screenContainer");t.innerHTML=`
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
    `,document.getElementById("communityBackBtn").addEventListener("click",()=>D("home")),W(),S("commContentArea"),K()}function W(){const t=document.querySelectorAll(".comm-circle-btn");t.forEach(e=>{e.addEventListener("click",()=>{t.forEach(n=>n.classList.remove("active")),e.classList.add("active");const o=e.getAttribute("data-tab");o==="visits"?S("commContentArea"):o==="barter"?X("commContentArea"):o==="sos"&&Z("commContentArea")})})}async function K(){try{const e=await(await fetch("http://localhost:3000/api/community/me")).json();document.getElementById("myCoinsDisplay").innerText=`🍃 ${e.coins} Coins`}catch{console.warn("Backend not detected, using static UI state.")}}export{oe as render};
