import{a as u,s as R}from"./index-Bs4kLmpj.js";import"https://esm.sh/three@0.160.0";import"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";const z=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let v=[],S="";const U=`
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
</style>`;async function M(n,e=!1){S=n;const t=document.getElementById(n);document.getElementById("visitsTabStyle")||t.insertAdjacentHTML("beforebegin",U),t.innerHTML=`
        <div style="position: sticky; top: 0; z-index: 100; background: #eff6ff; padding: 15px 0; margin-top: -15px; margin-bottom: 10px;">
            <h3 style="margin:0 0 4px; color:#1f2937;">🏡 Neighborhood Farms</h3>
            <p style="margin:0; font-size:.78rem; color:gray;">
                Drag 🪣 to water thirsty plants · drag 🥢 to catch bugs · earn 🍃 coins!
            </p>
        </div>
        <div id="neighborsListArea" style="display:flex;flex-direction:column;gap:12px;">
            <div style="text-align:center;padding:24px;color:gray;">Scouting neighborhood…</div>
        </div>`,e&&v.length>0?j():await Y()}async function Y(){try{v=await(await fetch(`${z}/api/community/visits/neighbors`)).json()}catch{v=V()}j()}function V(){const n=[["🍅","🍅","🌿",null,"🌿",null,"🌱",null,"🌶️"],["🌿","🌿",null,"🥬","🌱",null,null,"🌿",null],[null,"🥬",null,"🌿",null,"🌱",null,null,"🌿"],["🌶️","🌶️","🌶️",null,"🌱",null,"🥕",null,"🥕"],["🍅","🥬","🌶️",null,null,null,"🌿","🌱",null]],e=["Aisha.Farm","Botani_Master","GreenThumb99","UTM_Agri","CityPlanter"],t=["👩‍🌾","👨‍🌾","🧑‍🌾","🏫","🏙️"];return e.map((o,i)=>{const a=Math.floor(Math.random()*23);return{id:`npc_${i}`,name:o,avatar:t[i],farmLayout:n[i],isNPC:!0,isThirsty:a>=5,bugCount:a>=18?2:a>=16?1:0,hoursOffline:a}})}function j(){const n=document.getElementById("neighborsListArea");if(!v.length){n.innerHTML=`
            <div class="empty-farm-state">
                <div style="font-size:3rem;margin-bottom:10px;">🌱</div>
                <h4 style="margin:0 0 6px;color:#1f2937;">No farms yet!</h4>
                <p style="font-size:.82rem;color:gray;margin:0;">
                    Create your farm first, then your neighbors will appear here.
                </p>
            </div>`;return}n.innerHTML=v.map(e=>{const t=[];e.isThirsty&&t.push('<span class="status-badge badge-thirsty">💧 Thirsty</span>'),e.bugCount&&t.push(`<span class="status-badge badge-bugged">🐛 ${e.bugCount} Bug${e.bugCount>1?"s":""}</span>`),t.length||t.push('<span class="status-badge badge-healthy">🌿 Healthy</span>');const o=(e.farmLayout||Array(9).fill(null)).slice(0,9).map(i=>`<div style="width:22px;height:22px;background:${i?"#7B4A23":"#5C3317"};border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:13px;">${i||""}</div>`).join("");return`
        <div class="neighbor-card" onclick="window.visitFarm('${e.id}')">
            <div style="font-size:32px;margin-right:12px;background:#f9fafb;border-radius:50%;
                        width:56px;height:56px;display:flex;justify-content:center;align-items:center;">
                ${e.avatar}
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:800;font-size:1rem;margin-bottom:4px;">${e.name}</div>
                <div style="display:grid;grid-template-columns:repeat(3,22px);gap:3px;margin-bottom:6px;">
                    ${o}
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">${t.join("")}</div>
            </div>
            <div style="font-size:1.4rem;color:#d1d5db;margin-left:8px;">›</div>
        </div>`}).join("")}window.visitFarm=function(n){window.currentZoomLevel=1;const e=v.find(m=>m.id===n);if(!e)return;const t=document.getElementById(S),o=e.isThirsty,i=e.bugCount>0,a=(e.farmLayout||Array(9).fill(null)).slice(0,9).map((m,c)=>{const d=e.bugCount>=1&&c===2||e.bugCount>=2&&c===6;return`
        <div class="farm-tile ${e.isThirsty?"dry":""}" id="tile_${c}">
            ${m?`<span>${m}</span>`:""}
            ${d?`<div class="bug-icon" id="bugOn_${n}_${c}">🐛</div>`:""}
        </div>`}).join("");t.innerHTML=`
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
                        ${a}
                    </div>
                </div>
            </div>

            <!-- Toolbar -->
            <div style="padding:16px;border-top:1px solid #f3f4f6;">
                <div style="display:flex;justify-content:center;gap:48px;">

                    <!-- Bucket -->
                    <div style="text-align:center;">
                        <div id="toolBucket" class="drag-tool"
                             style="${o?"":"opacity:.3;cursor:not-allowed;"}">🪣</div>
                        <div id="bucketLabel" style="font-size:.7rem;color:#6B7280;margin-top:6px;">
                            ${o?"💧 Water (+5 🍃)":"Not thirsty"}
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
        </div>`;const s=document.getElementById("canvasDropZone"),l=document.getElementById("toolBucket"),g=document.getElementById("toolClamp");o&&l&&P(l,s,()=>X(n)),i&&g&&P(g,s,(m,c)=>G(n,m,c))};function P(n,e,t){let o=null,i=!1,a=0,s=0;function l(d,r){o=document.createElement("div"),o.className="drag-clone",o.innerText=n.innerText,Object.assign(o.style,{left:d-a+"px",top:r-s+"px"}),document.body.appendChild(o)}function g(d,r){o&&(o.style.left=d-a+"px",o.style.top=r-s+"px",i=c(d,r,e),e.classList.toggle("drag-over",i))}function m(d,r){e.classList.remove("drag-over"),o==null||o.remove(),o=null,i&&(i=!1,t(d,r))}function c(d,r,p){const b=p.getBoundingClientRect();return d>=b.left&&d<=b.right&&r>=b.top&&r<=b.bottom}n.addEventListener("mousedown",d=>{d.preventDefault();const r=n.getBoundingClientRect();a=d.clientX-r.left,s=d.clientY-r.top,l(d.clientX,d.clientY);const p=x=>g(x.clientX,x.clientY),b=x=>{m(x.clientX,x.clientY),window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",b)};window.addEventListener("mousemove",p),window.addEventListener("mouseup",b)}),n.addEventListener("touchstart",d=>{d.preventDefault();const r=d.touches[0],p=n.getBoundingClientRect();a=r.clientX-p.left,s=r.clientY-p.top,l(r.clientX,r.clientY)},{passive:!1}),n.addEventListener("touchmove",d=>{d.preventDefault();const r=d.touches[0];g(r.clientX,r.clientY)},{passive:!1}),n.addEventListener("touchend",d=>{d.preventDefault();const r=d.changedTouches[0];m(r.clientX,r.clientY)},{passive:!1})}function q(n){const e=document.getElementById("farmGridEl");if(!e)return;const t=e.getBoundingClientRect(),o=n.getBoundingClientRect(),i=24;for(let a=0;a<i;a++)setTimeout(()=>{const s=document.createElement("div");s.className="water-drop";const l=t.left-o.left+Math.random()*t.width,g=t.top-o.top+Math.random()*(t.height-40);s.style.left=l+"px",s.style.top=g+"px",n.appendChild(s),setTimeout(()=>{const m=document.createElement("div");m.className="water-splash",m.style.left=l-10+"px",m.style.top=g+40+"px",n.appendChild(m),setTimeout(()=>{s.remove(),m.remove()},500)},450)},a*40)}async function X(n){const e=v.find(l=>l.id===n);if(!e||!e.isThirsty)return;const t=document.getElementById("canvasDropZone");q(t);const o=document.getElementById("toolBucket");o&&(o.style.opacity=".3",o.style.cursor="not-allowed"),document.querySelectorAll(".farm-tile").forEach(l=>{l.classList.remove("dry"),l.classList.add("watered"),setTimeout(()=>l.classList.remove("watered"),700)});let i=5;if(!e.isNPC)try{const g=await(await fetch(`${z}/api/community/visits/interact/${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"water"})})).json();i=g.earned||5,H(g.newTotal)}catch{}e.isThirsty=!1;const a=document.getElementById("farmStatusBadge");a&&(a.className="status-badge badge-healthy",a.innerText="🌿 Healthy");const s=document.getElementById("bucketLabel");s&&(s.innerText="✅ Watered!"),N(t,`+${i} 🍃`),u("success",`💧 Watered! +${i} 🍃`)}async function G(n,e,t){const o=v.find(d=>d.id===n);if(!o||o.bugCount<=0)return;const i=document.querySelectorAll(`[id^="bugOn_${n}_"]`);let a=null;i.forEach(d=>{const r=d.getBoundingClientRect(),p=25;e>=r.left-p&&e<=r.right+p&&t>=r.top-p&&t<=r.bottom+p&&(a=d)});const s=document.getElementById("toolClamp");if(!a){s&&(s.style.animation="toolMiss 0.4s ease",setTimeout(()=>s.style.animation="",400)),u("warning","Missed! Use the chopsticks 🥢 directly on the bug! 🎯");return}s&&(s.style.animation="chopstickAction 0.5s ease",setTimeout(()=>s.style.animation="",500)),a.style.animation="bugDie 0.5s forwards",a.removeAttribute("id"),setTimeout(()=>a.remove(),500),o.bugCount-=1;const l=document.getElementById("farmStatusBadge");l&&(o.bugCount>0?l.innerText=`🐛 ${o.bugCount} Bug${o.bugCount>1?"s":""}`:(l.className="status-badge badge-healthy",l.innerText="🌿 Healthy"));const g=document.getElementById("clampLabel");g&&(g.innerText=o.bugCount>0?`🐛 ${o.bugCount} left!`:"✅ All bugs cleared!"),o.bugCount===0&&s&&(s.style.opacity=".3",s.style.cursor="not-allowed");let m=10;if(!o.isNPC)try{const r=await(await fetch(`${z}/api/community/visits/interact/${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"catch_bug"})})).json();m=r.earned||10,H(r.newTotal)}catch{}const c=document.getElementById("canvasDropZone");N(c,`+${m} 🍃`),u("success",`Gotcha! +${m} 🍃`)}function N(n,e){const t=document.createElement("div");t.className="coin-pop",t.innerText=e,t.style.left="50%",t.style.top="50%",n.appendChild(t),setTimeout(()=>t.remove(),950)}window.zoomFarm=function(n){window.currentZoomLevel+=n,window.currentZoomLevel<.6&&(window.currentZoomLevel=.6),window.currentZoomLevel>2.5&&(window.currentZoomLevel=2.5);const e=document.getElementById("farmGridEl");e&&(e.style.transform=`scale(${window.currentZoomLevel})`)};window.backToNeighbors=function(){M(S,!0)};function H(n){if(!n)return;const e=document.getElementById("myCoinsDisplay");e&&(e.innerText=`🍃 ${n} Coins`)}const I=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin,D={tomato:"https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&q=80",chilli:"https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=300&q=80",mint:"https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=300&q=80",basil:"https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=300&q=80",spinach:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80",compost:"https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=300&q=80",veggie:"https://images.unsplash.com/photo-1566842600175-97dca3b105e4?w=300&q=80",seed:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80",default:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80"};function W(n){if(n.image)return n.image;const e=(n.title||"").toLowerCase();for(const[t,o]of Object.entries(D))if(e.includes(t))return o;return D.default}let f="pasar",B=[];function A(){var n,e;return((e=(n=window.AppState)==null?void 0:n.currentUser)==null?void 0:e.name)||localStorage.getItem("username")||"MyFarm"}A();let h=A();const Z=`
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
</style>`;async function J(n){h=A();const e=document.getElementById(n);document.getElementById("barterTabStyle")||e.insertAdjacentHTML("beforebegin",Z),e.innerHTML=`
        <!-- view toggle -->
      <div style="position: sticky; top: -1px; z-index: 100; background: #f4f6f8; padding: 15px 0 15px 0; margin-top: -15px; margin-bottom: 15px;">
            
            <div class="view-toggle" style="margin: 0 0 10px 0;">
                <button id="btnViewPasar"  class="view-pill" style="background:#D1FAE5;color:#065F46;">🛍️ Pasar</button>
                <button id="btnViewMyShop" class="view-pill" style="background:transparent;color:gray;">🏪 My Shop</button>
                <button id="btnViewMyOrders" class="view-pill" style="background:transparent;color:gray;">🛒 My Orders</button>
            </div>

            <div id="pasarSearchBar" style="display:flex; gap:8px;">
                <input type="text" id="searchInput" placeholder="Search veg, seeds, tools…"
                       style="flex:1; padding:10px 15px; border-radius:20px; border:1px solid #ddd; outline:none; font-size:.9rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <button id="btnSearch" style="border-radius:20px; padding:0 18px; background:#10B981; color:white; border:none; font-weight:700; cursor:pointer; box-shadow: 0 2px 4px rgba(16,185,129,0.2);">🔍</button>
            </div>
            
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
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <div style="flex:1;">
                        <input id="postLocation" type="text" placeholder="📍 Location (e.g. Hall A)" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; box-sizing:border-box;">
                    </div>
                    <div style="flex:1;">
                        <input id="postContact" type="text" placeholder="📱 Telegram / WhatsApp" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; box-sizing:border-box;">
                    </div>
                </div>
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
        </div>
        <div id="customTransactionModal" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center; backdrop-filter: blur(4px);">
            <div style="background:white; padding:25px; border-radius:20px; width:80%; max-width:320px; text-align:center; box-shadow: 0 15px 35px rgba(0,0,0,0.2); transform: translateY(-20px); transition: all 0.3s ease;">
                
                <div id="txModalIcon" style="font-size: 50px; margin-bottom: 10px;">🤝</div>
                <h3 id="txModalTitle" style="margin:0 0 10px 0; color:#1f2937;">Reserve Item?</h3>
                
                <div id="txPaymentSelection" style="display:none; margin: 15px 0; text-align: left;">
                    <label style="font-size: 0.75rem; font-weight: 700; color: #6B7280; margin-bottom:8px; display:block; text-align:center;">Choose Payment Method:</label>
                    <div style="display: flex; gap: 10px;">
                        <label id="lblPayCoins" style="flex: 1; padding: 12px; border: 2px solid #10B981; border-radius: 12px; cursor: pointer; text-align: center; background: #ECFDF5; transition: 0.2s;">
                            <input type="radio" name="payMethod" value="coins" style="display: none;" checked>
                            <div style="font-size: 1.5rem; margin-bottom: 4px;">🍃</div>
                            <div style="font-size: 0.75rem; font-weight: 700; color:#065F46;">Coins</div>
                        </label>
                        <label id="lblPayItem" style="flex: 1; padding: 12px; border: 2px solid #E5E7EB; border-radius: 12px; cursor: pointer; text-align: center; background: white; transition: 0.2s;">
                            <input type="radio" name="payMethod" value="barter" style="display: none;">
                            <div style="font-size: 1.5rem; margin-bottom: 4px;">🔄</div>
                            <div style="font-size: 0.75rem; font-weight: 700; color:#374151;">Item</div>
                        </label>
                    </div>
                </div>

                <p id="txModalDesc" style="font-size:0.85rem; color:#4B5563; line-height:1.5; margin-bottom:20px; background:#F3F4F6; padding:10px; border-radius:8px;">Description goes here.</p>
                
                <div style="display:flex; gap:12px;">
                    <button id="btnTxCancel" style="flex:1; padding:10px; border-radius:12px; border:1px solid #E5E7EB; background:white; color:#4B5563; font-weight:bold; cursor:pointer;">Cancel</button>
                    <button id="btnTxConfirm" style="flex:1; padding:10px; border-radius:12px; border:none; background:#10B981; color:white; font-weight:bold; cursor:pointer; box-shadow:0 4px 10px rgba(16,185,129,0.3);">Confirm</button>
                </div>
            </div>
        </div>`,K(),E()}function K(){const n=document.getElementById("fabAddBarter"),e=document.getElementById("pasarSearchBar"),t=document.getElementById("barterPostModal");let o=null;const i=document.getElementById("btnViewPasar"),a=document.getElementById("btnViewMyShop"),s=document.getElementById("btnViewMyOrders");function l(){[i,a,s].forEach(c=>{c.style.background="transparent",c.style.color="gray"})}i.addEventListener("click",()=>{f="pasar",l(),i.style.background="#D1FAE5",i.style.color="#065F46",n.style.display="none",e.style.display="flex",F()}),a.addEventListener("click",()=>{f="myshop",l(),a.style.background="#FEF3C7",a.style.color="#D97706",n.style.display="flex",e.style.display="none",F()}),s.addEventListener("click",()=>{f="myorders",l(),s.style.background="#E0F2FE",s.style.color="#0369A1",n.style.display="none",e.style.display="none",F()}),document.getElementById("barterImageUpload").addEventListener("change",function(){if(!this.files[0])return;const c=new FileReader;c.onload=d=>{o=d.target.result,document.getElementById("barterImagePreview").innerHTML=`<img src="${o}" style="width:100%;object-fit:cover;">`},c.readAsDataURL(this.files[0])}),document.getElementById("postTradeType").addEventListener("change",c=>{const d=c.target.value,r=document.getElementById("postCoins"),p=document.getElementById("postLookingFor");d==="coins"?(r.disabled=!1,r.style.background="white",r.style.opacity="1",p.disabled=!0,p.style.background="#f3f4f6",p.style.opacity="0.4",p.value=""):d==="barter"?(r.disabled=!0,r.style.background="#f3f4f6",r.style.opacity="0.4",r.value="",p.disabled=!1,p.style.background="white",p.style.opacity="1"):(r.disabled=!1,r.style.background="white",r.style.opacity="1",p.disabled=!1,p.style.background="white",p.style.opacity="1")}),n.addEventListener("click",()=>{t.style.display="flex",document.getElementById("postTradeType").value="both",document.getElementById("postTradeType").dispatchEvent(new Event("change")),["postTitle","postCoins","postLookingFor","postLocation","postContact"].forEach(d=>{const r=document.getElementById(d);r&&(r.value="")}),o=null,document.getElementById("barterImagePreview").innerHTML="";const c=document.getElementById("barterImageUpload");c&&(c.value="")}),document.getElementById("btnCancelBarter").addEventListener("click",()=>t.style.display="none"),document.getElementById("btnSubmitBarter").addEventListener("click",async()=>{const c=document.getElementById("postTitle").value,d=document.getElementById("postTradeType").value,r=document.getElementById("postLocation").value,p=document.getElementById("postContact").value;if(!c)return u("warning","Item name is required!");if(!p)return u("warning","Please provide a contact method!");const b=`${r||"Campus"} | ${p}`;try{const C=await(await fetch(`${I}/api/community/barter`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:c,tradeType:d,author:h,image:o,priceCoins:document.getElementById("postCoins").value,lookingFor:document.getElementById("postLookingFor").value,location:b})})).json();t.style.display="none",u("success","Listed on Pasar!"),E(),C.matchFound&&(document.getElementById("matchText").innerText=`Farmer ${C.matchFound.author} has "${C.matchFound.title}" and wants a trade!`,document.getElementById("magicMatchModal").style.display="flex")}catch{u("error","Failed to post")}}),document.getElementById("btnSearch").addEventListener("click",()=>{E(document.getElementById("searchInput").value)}),document.getElementById("searchInput").addEventListener("keydown",c=>{c.key==="Enter"&&E(c.target.value)});const g=document.getElementById("customTransactionModal");document.querySelectorAll('input[name="payMethod"]').forEach(c=>{c.addEventListener("change",d=>{if(y&&y.type==="reserve"){const r=d.target.value;y.selectedMethod=r;const p=r==="coins";document.getElementById("lblPayCoins").style.borderColor=p?"#10B981":"#E5E7EB",document.getElementById("lblPayCoins").style.background=p?"#ECFDF5":"white",document.getElementById("lblPayItem").style.borderColor=p?"#E5E7EB":"#10B981",document.getElementById("lblPayItem").style.background=p?"white":"#ECFDF5";const b=document.getElementById("txModalDesc");p?b.innerHTML=`<span style="font-weight:bold;color:#065F46;">🍃 ${y.priceCoins} Coins</span> will be locked for this transaction.<br><br>Meet at the location to trade!`:b.innerHTML=`Please prepare your <span style="font-weight:bold;color:#D97706;">🔄 ${y.lookingFor}</span>.<br><br>Bring it to the meetup location to exchange!`}})}),document.getElementById("btnTxCancel").addEventListener("click",()=>{g.style.display="none",y=null}),document.getElementById("btnTxConfirm").addEventListener("click",async()=>{if(!y)return;const c=document.getElementById("btnTxConfirm"),d=c.innerText;c.innerText="Processing...",c.style.opacity="0.7",c.style.pointerEvents="none";const{type:r,id:p,selectedMethod:b}=y;try{if(r==="reserve"){const x=await fetch(`${I}/api/community/barter/${p}/reserve`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({buyer:h,paymentMethod:b})}),C=await x.json();x.ok?(u("success","Reserved! Check My Orders."),localStorage.setItem(`payMethod_${p}`,b),b==="coins"&&y.priceCoins&&O(y.priceCoins),E()):u("warning",C.message||"Error occurred!")}else r==="complete"&&(await fetch(`${I}/api/community/barter/${p}/complete`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rating:5})}),u("success","Transaction Completed! 🌟"),y.tradeType!=="barter"&&y.priceCoins&&O(y.priceCoins),E())}catch(x){console.error("Trade Error:",x),u("error","Network error. Please try again.")}finally{c.innerText=d,c.style.opacity="1",c.style.pointerEvents="auto",g.style.display="none",y=null}})}async function E(n=""){document.getElementById("barterFeedList").innerHTML='<div style="grid-column:1/-1;text-align:center;padding:30px;color:gray;">Loading market…</div>';try{const e=`${I}/api/community/barter${n?"?search="+encodeURIComponent(n):""}`;B=await(await fetch(e)).json(),F()}catch{document.getElementById("barterFeedList").innerHTML='<div style="grid-column:1/-1;text-align:center;padding:30px;color:#DC2626;">Market is currently closed.</div>'}}function F(){const n=document.getElementById("barterFeedList");let e=[];if(f==="pasar"?e=B.filter(t=>t.status==="available"&&t.author!==h):f==="myshop"?e=B.filter(t=>t.author===h):f==="myorders"&&(e=B.filter(o=>o.buyer===h).sort((o,i)=>o.status==="reserved"&&i.status==="completed"?-1:o.status==="completed"&&i.status==="reserved"?1:0)),!e.length){n.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:gray;">
            <div style="font-size:42px;margin-bottom:10px;">🛒</div>
            <div style="font-weight:700;">Nothing here yet.</div>
            <div style="font-size:.82rem;margin-top:4px;">${f==="myshop"?"Tap + to list your first item!":"Come back soon!"}</div>
        </div>`;return}n.innerHTML=e.map(t=>{t.author,t.buyer;const i=(t.location||"").split(" | "),a=i[0]||"Campus",s=i[1]||"Hidden";let l="";const g=t.paymentMethod||localStorage.getItem(`payMethod_${t.id}`);(t.status==="reserved"||t.status==="completed")&&g?g==="coins"?l=`🍃 ${t.priceCoins}`:g==="barter"&&(l=`🔄 ${t.lookingFor}`):t.tradeType==="coins"?l=`🍃 ${t.priceCoins}`:t.tradeType==="barter"?l=`🔄 ${t.lookingFor}`:l=`🍃 ${t.priceCoins} <span style="color:#94A3B8;font-size:0.75rem;margin:0 2px;">or</span> 🔄 ${t.lookingFor}`;let m="";return f==="pasar"?m=`<button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; background:#10B981; border:none;" onclick="window.reserveItem('${t.id}')">Reserve Now</button>`:f==="myshop"?t.status==="available"?m='<div style="text-align:center; font-size:0.8rem; color:gray; padding:8px; border:1px dashed #ccc; border-radius:8px;">Waiting for buyer...</div>':t.status==="reserved"?m=`<div style="text-align:center; font-size:0.8rem; color:#D97706; padding:8px; background:#FEF3C7; border-radius:8px; font-weight:bold;">Reserved by ${t.buyer}</div>`:m='<div style="text-align:center; font-size:0.8rem; color:#065F46; padding:8px; background:#D1FAE5; border-radius:8px; font-weight:bold;">Sold out 🎉</div>':f==="myorders"&&(t.status==="reserved"?m=`
                    <div style="margin-bottom:8px; padding:10px; background:#E0F2FE; border:1px solid #BAE6FD; border-radius:8px; text-align:center;">
                        <div style="font-size:0.75rem; color:#0369A1; margin-bottom:4px;">💬 Contact Seller via:</div>
                        <div style="font-weight:900; color:#0284C7; font-size:0.95rem; letter-spacing:0.5px;">${s}</div>
                    </div>
                    <button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; background:#EAB308; border:none; box-shadow:0 3px 8px rgba(234,179,8,0.3);" onclick="window.completeItem('${t.id}')">📦 Confirm Receipt</button>
                `:m='<div style="text-align:center; font-size:0.8rem; color:gray; padding:8px; background:#F3F4F6; border-radius:8px;">Order Completed</div>'),`
        <div class="barter-card" style="${t.status==="completed"?"opacity:0.7;":""}">
            <div class="status-badge status-${t.status}">${t.status.toUpperCase()}</div>
            
           <img src="${W(t)}" class="barter-img"
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80'">
            
            <div style="padding:10px; display:flex; flex-direction:column; flex:1;">
                <h4 style="margin:0 0 5px 0; font-size:0.95rem;">${t.title}</h4>
                <div style="font-size:0.7rem; color:gray; margin-bottom:5px;">By: ${t.author} <span class="trust-badge">★ Trusted</span></div>
                
                <div style="font-size:0.75rem; color:#4B5563; margin-bottom:10px; display:flex; align-items:center; gap:4px;">
                    <span>📍</span> <span style="font-weight:600;">${a}</span>
                </div>
                
                <div style="color:#059669; font-weight:bold; font-size:0.85rem; margin-top:auto; margin-bottom:10px;">
                    ${l}
                </div>
                
                ${m}
            </div>
        </div>
        `}).join("")}let y=null;window.reserveItem=function(n){const e=B.find(a=>a.id===n);if(!e)return;y={type:"reserve",id:n,tradeType:e.tradeType,priceCoins:e.priceCoins,lookingFor:e.lookingFor,selectedMethod:e.tradeType==="barter"?"barter":"coins"},document.getElementById("txModalIcon").innerText="🤝",document.getElementById("txModalTitle").innerText="Reserve Item?",document.getElementById("btnTxConfirm").style.background="#10B981",document.getElementById("btnTxConfirm").style.boxShadow="0 4px 10px rgba(16,185,129,0.3)";const t=document.getElementById("txPaymentSelection"),o=document.getElementById("txModalDesc"),i=a=>{a==="coins"?o.innerHTML=`<span style="font-weight:bold;color:#065F46;">🍃 ${e.priceCoins} Coins</span> will be locked for this transaction.<br><br>Meet at the location to trade!`:o.innerHTML=`Please prepare your <span style="font-weight:bold;color:#D97706;">🔄 ${e.lookingFor}</span>.<br><br>Bring it to the meetup location to exchange!`};e.tradeType==="both"?(t.style.display="block",document.querySelector('input[name="payMethod"][value="coins"]').checked=!0,document.getElementById("lblPayCoins").style.borderColor="#10B981",document.getElementById("lblPayCoins").style.background="#ECFDF5",document.getElementById("lblPayItem").style.borderColor="#E5E7EB",document.getElementById("lblPayItem").style.background="white",i("coins")):(t.style.display="none",i(e.tradeType)),document.getElementById("customTransactionModal").style.display="flex"};window.completeItem=function(n){const e=B.find(t=>t.id===n);e&&(y={type:"complete",id:n,priceCoins:e.priceCoins,tradeType:e.tradeType},document.getElementById("txPaymentSelection").style.display="none",document.getElementById("txModalIcon").innerText="📦",document.getElementById("txModalTitle").innerText="Confirm Receipt?",document.getElementById("txModalDesc").innerText="Did you receive the item? Funds will be released to the seller.",document.getElementById("btnTxConfirm").style.background="#F59E0B",document.getElementById("btnTxConfirm").style.boxShadow="0 4px 10px rgba(245,158,11,0.3)",document.getElementById("customTransactionModal").style.display="flex")};function O(n){const e=document.getElementById("myCoinsDisplay");if(!e)return;let t=e.innerText,o=parseInt(t.replace(/[^0-9]/g,""));if(!isNaN(o)){let i=o-parseInt(n);e.style.transition="all 0.3s ease",e.innerText=`🍃 ${i} Coins`,e.style.color="#EF4444",e.style.background="#FEE2E2",e.style.borderColor="#FCA5A5",e.style.transform="scale(1.15)",setTimeout(()=>{e.style.color="var(--green-800)",e.style.background="var(--green-50)",e.style.borderColor="var(--green-200)",e.style.transform="scale(1)"},400)}}const k=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;let T="all",w=[];function $(){var n,e;return((e=(n=window.AppState)==null?void 0:n.currentUser)==null?void 0:e.name)||localStorage.getItem("username")||"MyFarm"}const Q=`
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
</style>`;async function ee(n){const e=document.getElementById(n);document.getElementById("sosTabStyle")||e.insertAdjacentHTML("beforebegin",Q),e.innerHTML=`
        <!-- view toggle -->
       <div style="position: sticky; top: -1px; z-index: 100; background: #f4f6f8; padding: 15px 0 15px 0; margin-top: -15px; margin-bottom: 15px;">
            
            <div class="view-toggle" style="display: flex; gap: 8px; background: white; padding: 6px; border-radius: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin: 0;">
                <button id="btnViewAll" class="view-pill" style="flex: 1; padding: 12px; border-radius: 10px; border: none; font-weight: 700; font-size: 0.9rem; cursor: pointer; background: #FEE2E2; color: #991B1B; transition: all 0.2s;">🚨 Neighborhood SOS</button>
                
                <button id="btnViewMine" class="view-pill" style="flex: 1; padding: 12px; border-radius: 10px; border: none; font-weight: 700; font-size: 0.9rem; cursor: pointer; background: transparent; color: gray; transition: all 0.2s;">🙋‍♂️ My Beacons</button>
            </div>
            
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
        </div>`,te(),_()}function te(){document.getElementById("btnViewAll").addEventListener("click",i=>{T="all",i.target.style.background="#FEE2E2",i.target.style.color="#991B1B",document.getElementById("btnViewMine").style.background="transparent",document.getElementById("btnViewMine").style.color="gray",L()}),document.getElementById("btnViewMine").addEventListener("click",i=>{T="mine",i.target.style.background="#E0F2FE",i.target.style.color="#0369A1",document.getElementById("btnViewAll").style.background="transparent",document.getElementById("btnViewAll").style.color="gray",L()});const n=document.getElementById("sosPostModal"),e=document.getElementById("sosImageUpload"),t=document.getElementById("imagePreview");let o=null;document.getElementById("fabAddSos").addEventListener("click",()=>n.style.display="flex"),document.getElementById("btnCancelSos").addEventListener("click",()=>n.style.display="none"),e.addEventListener("change",function(){const i=this.files[0];if(!i)return;const a=new FileReader;a.onload=s=>{o=s.target.result,t.innerHTML=`<img src="${o}" style="max-width:100%;max-height:130px;border-radius:8px;object-fit:contain;">`},a.readAsDataURL(i)}),document.getElementById("btnSubmitSos").addEventListener("click",async()=>{const i=document.getElementById("sosInputTitle").value,a=document.getElementById("sosInputContent").value,s=document.getElementById("btnSubmitSos");if(!i||!a)return u("warning","Please fill in both fields!");s.disabled=!0,s.innerText="Broadcasting…";try{await fetch(`${k}/api/community/posts/sos`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:i,content:a,author:$(),image:o})}),n.style.display="none",document.getElementById("sosInputTitle").value="",document.getElementById("sosInputContent").value="",t.innerHTML="",o=null,u("success","SOS broadcasted!"),_()}catch{u("error","Network error")}finally{s.disabled=!1,s.innerText="Broadcast"}})}async function _(){const n=document.getElementById("sosFeedList");n.innerHTML='<div style="text-align:center;padding:30px;color:gray;">Loading beacons...</div>';try{w=await(await fetch(`${k}/api/community/posts`)).json(),L()}catch{n.innerHTML='<div style="text-align:center;padding:30px;color:#DC2626;">Failed to load beacons</div>'}}function L(){const n=document.getElementById("sosFeedList"),e=$();let t=[];if(T==="all"?t=w.filter(o=>o.author!==e):t=w.filter(o=>o.author===e),!t.length){n.innerHTML=`<div style="grid-column:1/-1;text-align:center;color:gray;padding:48px 20px;">
            <div style="font-size:42px;margin-bottom:10px;">📭</div>
            <div style="font-weight:700;">No beacons found.</div>
            <div style="font-size:.82rem;margin-top:4px;">${T==="mine"?"You have no active SOS.":"Everything is peaceful!"}</div>
        </div>`;return}n.innerHTML=t.map(o=>{const i=o.author===e;return`
        <div class="sos-card">
            <div class="sos-card-header">
                <div class="sos-avatar" style="background:${i?"#FEE2E2":"#E0E7FF"};">${i?"👤":"👩‍🌾"}</div>
                <span class="sos-author">${o.author}</span>
                <span class="sos-date">${o.createdAt?new Date(o.createdAt).toLocaleDateString():"Just now"}</span>
            </div>
            <h4 class="sos-title">${o.title}</h4>
            <p class="sos-body">${o.content}</p>
            ${o.image?`<img src="${o.image}" class="sos-image">`:""}
            
            <div style="display: flex; gap: 10px; margin: 12px 0; align-items: center;">
                <button onclick="window.likePost('${o.id}')" 
        style="padding: 6px 14px; border-radius: 20px; border: 1px solid #E5E7EB; background: white; color: #4B5563; font-weight: 600; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: 0.2s;">
    💡 Helpful <span id="likeCount_${o.id}" style="background: #F3F4F6; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">${o.likes||0}</span>
</button>
                
                ${i?`
                <button onclick="window.deletePost('${o.id}')" 
                        style="padding: 6px 14px; border-radius: 20px; border: 1px solid #FECACA; background: #FEF2F2; color: #DC2626; font-weight: 600; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s;">
                    🗑️ Delete
                </button>
                `:""}
                
                ${o.bounty&&o.bounty>0?`
                <div style="margin-left: auto; padding: 6px 12px; background: #ECFDF5; color: #059669; border-radius: 20px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 4px;">
                    Bounty: 🍃 ${o.bounty}
                </div>
                `:""}
            </div>
           <div class="sos-comments-box">
                <div class="sos-comment-label" id="commentLabel_${o.id}">SUGGESTIONS (${(o.comments||[]).length})</div>
                
                <div id="commentList_${o.id}">
                    ${(o.comments||[]).map(a=>`
                        <div class="sos-comment-item">
                            <div style="line-height:1.4;"><b style="color:#374151;">${a.author}:</b> <span style="color:#4B5563;">${a.text}</span></div>
                            ${i&&a.author!==e?`<button class="tip-btn" onclick="window.rewardComment('${o.id}','${a.author}')">🎁 Tip</button>`:""}
                        </div>`).join("")}
                </div>
            </div>
            
            ${i?`
            <div style="text-align: center; padding: 8px; font-size: 0.78rem; color: #9CA3AF; background: #F9FAFB; border-radius: 20px; border: 1px dashed #E5E7EB; margin-top: 5px;">
                📢 Waiting for neighbors to provide suggestions...
            </div>
            `:`
            <div class="sos-comment-input-row">
                <input type="text" id="commentInput_${o.id}" class="sos-comment-input" placeholder="Type your suggestion…">
                <button class="sos-send-btn" onclick="window.submitComment('${o.id}')">Send</button>
            </div>
            `}
            
        </div>`}).join("")}window.submitComment=async function(n){var i;const e=document.getElementById(`commentInput_${n}`),t=(i=e==null?void 0:e.value)==null?void 0:i.trim();if(!t)return u("warning","Comment cannot be empty!");$();const o=$();try{if((await fetch(`${k}/api/community/posts/${n}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:t,author:o})})).ok){const s=w.find(m=>m.id===n);s&&(s.comments||(s.comments=[]),s.comments.push({author:o,text:t}));const l=document.getElementById(`commentList_${n}`);if(l){const m=`
                    <div class="sos-comment-item" style="animation: fadeIn 0.3s ease;">
                        <div style="line-height:1.4;"><b style="color:#374151;">${o}:</b> <span style="color:#4B5563;">${t}</span></div>
                    </div>
                `;l.insertAdjacentHTML("beforeend",m)}const g=document.getElementById(`commentLabel_${n}`);g&&s&&(g.innerText=`SUGGESTIONS (${s.comments.length})`),e.value="",u("success","Suggestion added!")}}catch{u("error","Failed to send")}};window.deletePost=function(n){const e=document.getElementById("customConfirmModal");e.style.display="flex",document.getElementById("btnConfirmCancel").onclick=()=>e.style.display="none",document.getElementById("btnConfirmOk").onclick=async()=>{e.style.display="none",w=w.filter(i=>i.id!==n);const t=document.getElementById(`likeCount_${n}`),o=t?t.closest(".sos-card"):null;o&&(o.style.transition="all 0.35s ease",o.style.transform="scale(0.85)",o.style.opacity="0",setTimeout(()=>{o.remove();const i=document.getElementById("sosFeedList");i&&i.children.length===0&&(i.innerHTML=`<div style="grid-column:1/-1;text-align:center;color:gray;padding:48px 20px;">
                        <div style="font-size:42px;margin-bottom:10px;">📭</div>
                        <div style="font-weight:700;">No beacons found.</div>
                        <div style="font-size:.82rem;margin-top:4px;">${T==="mine"?"You have no active SOS.":"Everything is peaceful!"}</div>
                    </div>`)},350)),u("success","Beacon removed.");try{await fetch(`${k}/api/community/posts/${n}`,{method:"DELETE"})}catch{u("error","Error deleting from server")}}};window.likePost=async function(n){const e=w.find(o=>o.id===n);e&&(e.likes=(e.likes||0)+1);const t=document.getElementById(`likeCount_${n}`);t&&(t.innerText=e?e.likes:parseInt(t.innerText)+1,t.style.transition="transform 0.15s ease",t.style.transform="scale(1.3)",t.style.color="#EF4444",setTimeout(()=>{t.style.transform="scale(1)",t.style.color=""},150));try{await fetch(`${k}/api/community/posts/${n}/like`,{method:"POST"})}catch{u("error","Network error")}};window.rewardComment=function(n,e){const t=document.getElementById("customPromptModal");document.getElementById("promptMsg").innerText=`Send coins to ${e} as a thank you!`,document.getElementById("promptInput").value="10",t.style.display="flex",document.getElementById("btnPromptCancel").onclick=()=>t.style.display="none",document.getElementById("btnPromptOk").onclick=async()=>{const o=Number(document.getElementById("promptInput").value);if(t.style.display="none",!o||o<=0)return u("warning","Invalid amount!");try{const i=await fetch(`${k}/api/community/posts/${n}/reward`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:o,receiver:e})}),a=await i.json();if(i.ok){u("success",`Sent ${o} 🍃 to ${e}!`);const s=document.getElementById("myCoinsDisplay");if(s){const l=parseInt(s.innerText.replace(/\D/g,""));s.innerText=`🍃 ${l-o} Coins`}}else u("warning",a.message)}catch{u("error","Failed to send reward")}}};function se(){const n=document.getElementById("screenContainer");n.innerHTML=`
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
    `,document.getElementById("communityBackBtn").addEventListener("click",()=>R("home")),oe(),M("commContentArea"),ne()}function oe(){const n=document.querySelectorAll(".comm-circle-btn");n.forEach(e=>{e.addEventListener("click",()=>{n.forEach(o=>o.classList.remove("active")),e.classList.add("active");const t=e.getAttribute("data-tab");t==="visits"?M("commContentArea"):t==="barter"?J("commContentArea"):t==="sos"&&ee("commContentArea")})})}async function ne(){const n=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000":window.location.origin;try{const t=await(await fetch(`${n}/api/community/me`)).json();document.getElementById("myCoinsDisplay").innerText=`🍃 ${t.coins} Coins`}catch{console.warn("Backend not detected, using static UI state.")}}export{se as render};
