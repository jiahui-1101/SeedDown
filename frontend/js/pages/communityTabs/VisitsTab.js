// VisitsTab.js — 2D PvZ-style farm visits with close-loop + water-drop drag animation
import { showToast } from '../../utils/toast.js';
import { API_BASE as API } from '../../utils/apiBase.js';

let neighborsData     = [];
let currentContainerId = '';

/* ══════════════════════════════════════════
   STYLES (injected once)
══════════════════════════════════════════ */
const STYLE = `
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
</style>`;

/* ══════════════════════════════════════════
   RENDER — neighbour list
══════════════════════════════════════════ */
// 📑 修改后的 renderVisitsTab 函数
export async function renderVisitsTab(containerId, skipFetch = false) {
    currentContainerId = containerId;
    const area = document.getElementById(containerId);

    if (!document.getElementById('visitsTabStyle')) {
        area.insertAdjacentHTML('beforebegin', STYLE);
    }

    area.innerHTML = `
        <div style="position: sticky; top: 0; z-index: 100; background: #eff6ff; padding: 15px 0; margin-top: -15px; margin-bottom: 10px;">
            <h3 style="margin:0 0 4px; color:#1f2937;">🏡 Neighborhood Farms</h3>
            <p style="margin:0; font-size:.78rem; color:gray;">
                Drag 🪣 to water thirsty plants · drag 🥢 to catch bugs · earn 🍃 coins!
            </p>
        </div>
        <div id="neighborsListArea" style="display:flex;flex-direction:column;gap:12px;">
            <div style="text-align:center;padding:24px;color:gray;">Scouting neighborhood…</div>
        </div>`;

    // 👇 【核心修改】：如果是返回上级，并且本地已经有数据了，直接渲染，不重新 Fetch
    if (skipFetch && neighborsData.length > 0) {
        renderNeighborsList();
    } else {
        await loadNeighbors();
    }
}

async function loadNeighbors() {
    try {
        const res   = await fetch(`${API}/api/community/visits/neighbors`);
        neighborsData = await res.json();
    } catch (_) {
        neighborsData = getFallbackNeighbors();
    }
    renderNeighborsList();
}

function getFallbackNeighbors() {
    const layouts = [
        ['🍅','🍅','🌿',null,'🌿',null,'🌱',null,'🌶️'],
        ['🌿','🌿',null,'🥬','🌱',null,null,'🌿',null],
        [null,'🥬',null,'🌿',null,'🌱',null,null,'🌿'],
        ['🌶️','🌶️','🌶️',null,'🌱',null,'🥕',null,'🥕'],
        ['🍅','🥬','🌶️',null,null,null,'🌿','🌱',null],
    ];
    const names   = ['Aisha.Farm','Botani_Master','GreenThumb99','UTM_Agri','CityPlanter'];
    const avatars = ['👩‍🌾','👨‍🌾','🧑‍🌾','🏫','🏙️'];
    return names.map((name,i) => {
        const h = Math.floor(Math.random() * 23);
        return {
            id:`npc_${i}`, name, avatar:avatars[i],
            farmLayout:layouts[i], isNPC:true,
            isThirsty:h>=5, bugCount:h>=18?2:h>=16?1:0, hoursOffline:h,
        };
    });
}

function renderNeighborsList() {
    const area = document.getElementById('neighborsListArea');

    if (!neighborsData.length) {
        area.innerHTML = `
            <div class="empty-farm-state">
                <div style="font-size:3rem;margin-bottom:10px;">🌱</div>
                <h4 style="margin:0 0 6px;color:#1f2937;">No farms yet!</h4>
                <p style="font-size:.82rem;color:gray;margin:0;">
                    Create your farm first, then your neighbors will appear here.
                </p>
            </div>`;
        return;
    }

    area.innerHTML = neighborsData.map(farm => {
        const alerts = [];
        if (farm.isThirsty) alerts.push(`<span class="status-badge badge-thirsty">💧 Thirsty</span>`);
        if (farm.bugCount)  alerts.push(`<span class="status-badge badge-bugged">🐛 ${farm.bugCount} Bug${farm.bugCount>1?'s':''}</span>`);
        if (!alerts.length) alerts.push(`<span class="status-badge badge-healthy">🌿 Healthy</span>`);

        const miniTiles = (farm.farmLayout||Array(9).fill(null))
            .slice(0,9)
            .map(e => `<div style="width:22px;height:22px;background:${e?'#7B4A23':'#5C3317'};border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:13px;">${e||''}</div>`)
            .join('');

        return `
        <div class="neighbor-card" onclick="window.visitFarm('${farm.id}')">
            <div style="font-size:32px;margin-right:12px;background:#f9fafb;border-radius:50%;
                        width:56px;height:56px;display:flex;justify-content:center;align-items:center;">
                ${farm.avatar}
            </div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:800;font-size:1rem;margin-bottom:4px;">${farm.name}</div>
                <div style="display:grid;grid-template-columns:repeat(3,22px);gap:3px;margin-bottom:6px;">
                    ${miniTiles}
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">${alerts.join('')}</div>
            </div>
            <div style="font-size:1.4rem;color:#d1d5db;margin-left:8px;">›</div>
        </div>`;
    }).join('');
}

/* ══════════════════════════════════════════
   VISIT FARM VIEW
══════════════════════════════════════════ */
window.visitFarm = function(farmId) {
    // 重置缩放比例，确保每次进入别人农场时都是默认大小
window.currentZoomLevel = 1;

    const farm    = neighborsData.find(f => f.id === farmId);
    if (!farm) return;
    const area    = document.getElementById(currentContainerId);
    const canWater = farm.isThirsty;
    const canCatch = farm.bugCount > 0;

    // Build 3x3 grid tiles
    const tilesHTML = (farm.farmLayout || Array(9).fill(null)).slice(0,9).map((emoji, i) => {
        const hasBug = (farm.bugCount >= 1 && i === 2) || (farm.bugCount >= 2 && i === 6);
        return `
        <div class="farm-tile ${farm.isThirsty ? 'dry' : ''}" id="tile_${i}">
            ${emoji ? `<span>${emoji}</span>` : ''}
            ${hasBug ? `<div class="bug-icon" id="bugOn_${farmId}_${i}">🐛</div>` : ''}
        </div>`;
    }).join('');

    area.innerHTML = `
        <div style="position: sticky; top: 0; z-index: 100; background: var(--bg, #f4f6f8); padding: 15px 0; margin-top: -15px; margin-bottom: 5px;">
            <button style="color:#2563EB;background:none;border:none;font-size:1rem;cursor:pointer;font-weight:700;"
                    onclick="window.backToNeighbors()">← Back</button>
        </div>

        <div style="border-radius:18px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.09);background:white;">

            <!-- Header -->
            <div style="padding:16px;display:flex;align-items:center;gap:12px;">
                <div style="font-size:34px;">${farm.avatar}</div>
                <div style="flex:1;">
                    <div style="font-weight:900;font-size:1.05rem;">${farm.name}</div>
                    <div style="font-size:.75rem;color:gray;">
                        ${farm.isNPC ? '🤖 NPC Farm' : '👥 Real Farm'} ·
                        Offline ${farm.hoursOffline}h
                    </div>
                </div>
                <div id="farmStatusBadge" class="status-badge ${farm.isThirsty ? 'badge-thirsty' : farm.bugCount ? 'badge-bugged' : 'badge-healthy'}">
                    ${farm.isThirsty ? '💧 Thirsty' : farm.bugCount ? `🐛 ${farm.bugCount} Bug${farm.bugCount>1?'s':''}` : '🌿 Healthy'}
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
                        ${tilesHTML}
                    </div>
                </div>
            </div>

            <!-- Toolbar -->
            <div style="padding:16px;border-top:1px solid #f3f4f6;">
                <div style="display:flex;justify-content:center;gap:48px;">

                    <!-- Bucket -->
                    <div style="text-align:center;">
                        <div id="toolBucket" class="drag-tool"
                             style="${!canWater ? 'opacity:.3;cursor:not-allowed;' : ''}">🪣</div>
                        <div id="bucketLabel" style="font-size:.7rem;color:#6B7280;margin-top:6px;">
                            ${canWater ? '💧 Water (+5 🍃)' : 'Not thirsty'}
                        </div>
                    </div>

                    <!-- Clamp -->
                    <div style="text-align:center;">
                        <div id="toolClamp" class="drag-tool"
                             style="${!canCatch ? 'opacity:.3;cursor:not-allowed;' : ''}">🥢</div>
                        <div id="clampLabel" style="font-size:.7rem;color:#6B7280;margin-top:6px;">
                            ${canCatch ? `🐛 Catch Bug (+10 🍃)` : 'No bugs'}
                        </div>
                    </div>

                </div>
            </div>
        </div>`;

    const dropZone = document.getElementById('canvasDropZone');
    const bucket   = document.getElementById('toolBucket');
    const clamp    = document.getElementById('toolClamp');

    if (canWater && bucket) makeDraggable(bucket, dropZone, () => doWater(farmId));
    if (canCatch && clamp)  makeDraggable(clamp,  dropZone, (cx, cy) => doCatch(farmId, cx, cy));
};

/* ══════════════════════════════════════════
   DRAG ENGINE
══════════════════════════════════════════ */
function makeDraggable(tool, dropZone, onDrop) {
    let clone = null, overZone = false, offX = 0, offY = 0;

    function spawnClone(cx, cy) {
        clone = document.createElement('div');
        clone.className = 'drag-clone';
        clone.innerText = tool.innerText;
        Object.assign(clone.style, { left: cx - offX + 'px', top: cy - offY + 'px' });
        document.body.appendChild(clone);
    }
    function moveClone(cx, cy) {
        if (!clone) return;
        clone.style.left = cx - offX + 'px';
        clone.style.top  = cy - offY + 'px';
        overZone = isOver(cx, cy, dropZone);
        dropZone.classList.toggle('drag-over', overZone);
    }
    function endDrag(cx, cy) {
        dropZone.classList.remove('drag-over');
        clone?.remove(); clone = null;
        if (overZone) { 
            overZone = false; 
            onDrop(cx, cy); // 必须把 cx, cy 传出去！
        }
    }
    function isOver(x, y, el) {
        const r = el.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }

    tool.addEventListener('mousedown', e => {
        e.preventDefault();
        const r = tool.getBoundingClientRect();
        offX = e.clientX - r.left; offY = e.clientY - r.top;
        spawnClone(e.clientX, e.clientY);
        const mm = ev => moveClone(ev.clientX, ev.clientY);
        const mu = ev => { endDrag(ev.clientX, ev.clientY); window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
        window.addEventListener('mousemove', mm);
        window.addEventListener('mouseup',   mu);
    });
    tool.addEventListener('touchstart', e => {
        e.preventDefault();
        const t = e.touches[0];
        const r = tool.getBoundingClientRect();
        offX = t.clientX - r.left; offY = t.clientY - r.top;
        spawnClone(t.clientX, t.clientY);
    }, { passive:false });
    tool.addEventListener('touchmove', e => {
        e.preventDefault();
        const t = e.touches[0]; moveClone(t.clientX, t.clientY);
    }, { passive:false });
    tool.addEventListener('touchend', e => {
        e.preventDefault();
        const t = e.changedTouches[0]; endDrag(t.clientX, t.clientY);
    }, { passive:false });
}

/* ══════════════════════════════════════════
   WATER DROP ANIMATION
   Spawns multiple falling drops + splash rings
   over random tiles in the farm grid.
══════════════════════════════════════════ */
function spawnWaterAnimation(dropZone) {
    const grid = document.getElementById('farmGridEl');
    if (!grid) return;
    const gridRect = grid.getBoundingClientRect();
    const zoneRect = dropZone.getBoundingClientRect();

    // 1. 增加水滴数量到 24 滴，确保足够覆盖整个 9 宫格
    const dropsCount = 24;

    for (let i = 0; i < dropsCount; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.className = 'water-drop';
            
            // 2. 【核心修复】：随机 X 轴覆盖整个宽度，随机 Y 轴覆盖整个高度
            const rx = gridRect.left - zoneRect.left + (Math.random() * gridRect.width);
            // Y轴减去 40px 是为了防止最底部的水滴落到网格外面去
            const ry = gridRect.top - zoneRect.top + (Math.random() * (gridRect.height - 40)); 
            
            drop.style.left = rx + 'px';
            drop.style.top  = ry + 'px';
            dropZone.appendChild(drop);

            // Splash at landing (水花四溅效果)
            setTimeout(() => {
                const splash = document.createElement('div');
                splash.className = 'water-splash';
                
                // 调整水花涟漪的坐标，使其完美对齐水滴坠落(translateY)的终点
                splash.style.left = rx - 10 + 'px'; 
                splash.style.top  = ry + 40 + 'px'; 
                dropZone.appendChild(splash);
                
                setTimeout(() => { drop.remove(); splash.remove(); }, 500);
            }, 450); // 与 CSS 里的 dropFall 动画时长相匹配
            
        }, i * 40); // 缩短生成间隔 (40ms)，让雨下得更连贯
    }
}

/* ══════════════════════════════════════════
   ACTIONS
══════════════════════════════════════════ */
async function doWater(farmId) {
    const farm = neighborsData.find(f => f.id === farmId);
    if (!farm || !farm.isThirsty) return;

    const dropZone = document.getElementById('canvasDropZone');
    spawnWaterAnimation(dropZone);

    // Grey out bucket
    const bucket = document.getElementById('toolBucket');
    if (bucket) { bucket.style.opacity = '.3'; bucket.style.cursor = 'not-allowed'; }

    // Update tiles to un-dry
    document.querySelectorAll('.farm-tile').forEach(t => {
        t.classList.remove('dry');
        t.classList.add('watered');
        setTimeout(() => t.classList.remove('watered'), 700);
    });

    let earned = 5;
    // FIX: skip backend call for NPC farms to avoid polluting coin ledger
    if (!farm.isNPC) {
        try {
            const res  = await fetch(`${API}/api/community/visits/interact/${farmId}`, {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ action:'water' }),
            });
            const data = await res.json();
            earned     = data.earned || 5;
            updateTopNavCoins(data.newTotal);
        } catch (_) {}
    }

    farm.isThirsty = false;
    const badge = document.getElementById('farmStatusBadge');
    if (badge) { badge.className = 'status-badge badge-healthy'; badge.innerText = '🌿 Healthy'; }
    const lbl = document.getElementById('bucketLabel');
    if (lbl) lbl.innerText = '✅ Watered!';

    // Coin pop
    spawnCoinPop(dropZone, `+${earned} 🍃`);
    showToast('success', `💧 Watered! +${earned} 🍃`);
}

/* ══════════════════════════════════════════
   PRECISION BUG CATCHING (Chopsticks 🥢)
══════════════════════════════════════════ */
async function doCatch(farmId, dropX, dropY) {
    const farm = neighborsData.find(f => f.id === farmId);
    if (!farm || farm.bugCount <= 0) return;

    // 1. 获取所有活着的虫子
    const bugs = document.querySelectorAll(`[id^="bugOn_${farmId}_"]`);
    let hitBug = null;

    // 2. 命中判定 (25px 的容错范围)
    bugs.forEach(bug => {
        const rect = bug.getBoundingClientRect();
        const padding = 25; 
        if (dropX >= rect.left - padding && dropX <= rect.right + padding &&
            dropY >= rect.top - padding && dropY <= rect.bottom + padding) {
            hitBug = bug;
        }
    });

    const clampTool = document.getElementById('toolClamp');

    // 3. 【失败】：夹空了
    if (!hitBug) {
        if (clampTool) {
            clampTool.style.animation = 'toolMiss 0.4s ease';
            setTimeout(() => clampTool.style.animation = '', 400);
        }
        showToast('warning', 'Missed! Use the chopsticks 🥢 directly on the bug! 🎯');
        return;
    }

    // 4. 【成功】：夹到了！
    if (clampTool) {
        clampTool.style.animation = 'chopstickAction 0.5s ease';
        setTimeout(() => clampTool.style.animation = '', 500);
    }

    // 播放虫子被夹走死亡的动画
    hitBug.style.animation = 'bugDie 0.5s forwards';
    hitBug.removeAttribute('id'); // 移除 ID 防止被重复抓取
    setTimeout(() => hitBug.remove(), 500);

    farm.bugCount -= 1;

    // 更新界面状态文字
    const badge = document.getElementById('farmStatusBadge');
    if (badge) {
        if (farm.bugCount > 0) {
            badge.innerText = `🐛 ${farm.bugCount} Bug${farm.bugCount > 1 ? 's' : ''}`;
        } else {
            badge.className = 'status-badge badge-healthy'; 
            badge.innerText = '🌿 Healthy';
        }
    }

    const lbl = document.getElementById('clampLabel');
    if (lbl) {
        lbl.innerText = farm.bugCount > 0 ? `🐛 ${farm.bugCount} left!` : '✅ All bugs cleared!';
    }
    
    // 全抓完了，工具变灰
    if (farm.bugCount === 0 && clampTool) {
        clampTool.style.opacity = '.3'; 
        clampTool.style.cursor = 'not-allowed';
    }

    // 5. 后端 API 奖励 (FIX: skip for NPC farms)
    let earned = 10;
    if (!farm.isNPC) {
        try {
            const res  = await fetch(`${API}/api/community/visits/interact/${farmId}`, {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ action:'catch_bug' }),
            });
            const data = await res.json();
            earned     = data.earned || 10;
            updateTopNavCoins(data.newTotal);
        } catch (_) {}
    }

    const dropZone = document.getElementById('canvasDropZone');
    spawnCoinPop(dropZone, `+${earned} 🍃`);
    showToast('success', `Gotcha! +${earned} 🍃`);
}

function spawnCoinPop(container, text) {
    const el = document.createElement('div');
    el.className = 'coin-pop';
    el.innerText = text;
    el.style.left = '50%';
    el.style.top  = '50%';
    container.appendChild(el);
    setTimeout(() => el.remove(), 950);
}
window.zoomFarm = function(delta) {
    window.currentZoomLevel += delta;
    
    // 限制最大和最小的缩放范围，防止缩小到看不见或放大到破音
    if (window.currentZoomLevel < 0.6) window.currentZoomLevel = 0.6;
    if (window.currentZoomLevel > 2.5) window.currentZoomLevel = 2.5;
    
    const gridEl = document.getElementById('farmGridEl');
    if (gridEl) {
        gridEl.style.transform = `scale(${window.currentZoomLevel})`;
    }
};

/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */
window.backToNeighbors = function() { 
    renderVisitsTab(currentContainerId, true); 
};

function updateTopNavCoins(newAmount) {
    if (!newAmount) return;
    const el = document.getElementById('myCoinsDisplay');
    if (el) el.innerText = `🍃 ${newAmount} Coins`;
}
