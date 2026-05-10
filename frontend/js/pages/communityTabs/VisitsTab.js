// 文件路径: /frontend/js/pages/communityTabs/VisitsTab.js
import { showToast } from '../../utils/toast.js';

let neighborsData = [];
let currentContainerId = '';

/* ══════════════════════════════════════════
    RENDER — Neighbor List
══════════════════════════════════════════ */
export async function renderVisitsTab(containerId) {
    currentContainerId = containerId;
    const area = document.getElementById(containerId);

    area.innerHTML = `
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
    `;

    await loadNeighbors();
}

async function loadNeighbors() {
    try {
        const res = await fetch('http://localhost:3000/api/community/visits/neighbors');
        neighborsData = await res.json();
    } catch (_) {
        neighborsData = [
            { id:'farm_01', name:'Aisha.Farm',     avatar:'👩‍🌾', plant:'Tomato', moisture:18, hasBug:true,  rack:'3-tier', tiles:mockTiles('danger')  },
            { id:'farm_02', name:'Botani_Master', avatar:'👨‍🌾', plant:'Mint',   moisture:65, hasBug:false, rack:'5-tier', tiles:mockTiles('healthy') },
            { id:'farm_03', name:'GreenThumb99',   avatar:'🧑‍🌾', plant:'Basil',  moisture:22, hasBug:false, rack:'wall',   tiles:mockTiles('warning') },
            { id:'farm_04', name:'UTM_Agri',       avatar:'🏫',   plant:'Chili',  moisture:80, hasBug:true,  rack:'3-tier', tiles:mockTiles('healthy') },
        ];
    }
    renderNeighborsList();
}

function mockTiles(status) {
    const emojis = ['🌿','🥬','🌱','🍅','🌶️'];
    return Array.from({ length:9 }, (_,i) => ({ emoji: emojis[i % emojis.length], status }));
}

function renderNeighborsList() {
    const listArea = document.getElementById('neighborsListArea');
    listArea.innerHTML = neighborsData.map(farm => {
        const isThirsty = farm.moisture < 30;
        return `
        <div class="neighbor-card" onclick="window.visitFarm('${farm.id}')">
            <div style="font-size:35px; margin-right:15px; background:#f9fafb; border-radius:50%;
                        width:60px; height:60px; display:flex; justify-content:center; align-items:center;">
                ${farm.avatar}
            </div>
            <div style="flex:1;">
                <h4 style="margin:0 0 4px 0; font-size:1.05rem;">${farm.name}</h4>
                <div style="font-size:0.8rem; color:gray;">Growing: ${farm.plant}</div>
            </div>
            <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                ${farm.hasBug ? `<div style="font-size:1rem; animation:bugWiggle 1s infinite;">🐛 Bug!</div>` : ''}
                <div class="status-badge ${isThirsty ? 'badge-thirsty' : 'badge-healthy'}">
                    ${isThirsty ? '💧 Needs Water' : '🌿 Healthy'}
                </div>
            </div>
        </div>`;
    }).join('');
}

/* ══════════════════════════════════════════
    VISIT FARM VIEW
══════════════════════════════════════════ */
window.visitFarm = function(farmId) {
    const farm = neighborsData.find(f => f.id === farmId);
    const area = document.getElementById(currentContainerId);
    const isThirsty = farm.moisture < 30;

    area.innerHTML = `
        <button class="btn-outline"
            style="margin:15px 0; border:none; padding:0; color:#2563EB; font-weight:bold; cursor:pointer;"
            onclick="window.backToNeighbors()">← Back to Neighborhood</button>

        <div class="card" style="padding:0; overflow:hidden; border-radius:16px; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

            <!-- Farm header -->
            <div style="padding:16px; display:flex; align-items:center; gap:12px; background:white;">
                <div style="font-size:35px;">${farm.avatar}</div>
                <div style="flex:1;">
                    <div style="font-weight:900; font-size:1.1rem;">${farm.name}</div>
                    <div style="font-size:0.75rem; color:gray;">
                        Soil Moisture: <span id="uiMoisture">${farm.moisture}</span>%
                    </div>
                </div>
                <div id="statusBadge" class="status-badge ${isThirsty ? 'badge-thirsty' : 'badge-healthy'}">
                    ${isThirsty ? '💧 Thirsty' : '🌿 Healthy'}
                </div>
            </div>

            <!-- 3D canvas -->
            <div id="canvasDropZone" class="drop-zone" style="position:relative; background:#eaf4ff;">
                <canvas id="visitFarmCanvas" style="width:100%; height:260px; display:block;"></canvas>

                <!-- Bug sitting on canvas -->
                ${farm.hasBug ? `
                <div id="bugOverlay"
                    style="position:absolute; top:16px; right:26px; text-align:center; z-index:10;
                           animation:bugWiggle 1.1s infinite;">
                    <div style="font-size:2.2rem; filter:drop-shadow(0 3px 6px rgba(0,0,0,0.25));">🐛</div>
                    <div style="font-size:0.6rem; background:#FEF08A; color:#854D0E;
                                border-radius:8px; padding:2px 7px; font-weight:bold; margin-top:2px;">drag clamp!</div>
                </div>` : ''}
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
                            style="${!isThirsty ? 'opacity:0.3; cursor:not-allowed;' : ''}">🪣</div>
                        <div id="bucketLabel" style="font-size:0.7rem; color:#6B7280; margin-top:6px;">
                            ${isThirsty ? '💧 Water (+5 🍃)' : 'Not thirsty'}
                        </div>
                    </div>

                    <!-- Clamp -->
                    <div style="text-align:center;">
                        <div id="toolClamp" class="drag-tool"
                            style="${!farm.hasBug ? 'opacity:0.3; cursor:not-allowed;' : ''}">🦾</div>
                        <div id="clampLabel" style="font-size:0.7rem; color:#6B7280; margin-top:6px;">
                            ${farm.hasBug ? '🐛 Catch bug (+8 🍃)' : 'No bugs'}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;

    initVisitCanvas(farm);

    const dropZone = document.getElementById('canvasDropZone');
    const bucket   = document.getElementById('toolBucket');
    const clamp    = document.getElementById('toolClamp');

    if (isThirsty  && bucket) makeDraggable(bucket, dropZone, () => doWater(farm.id));
    if (farm.hasBug && clamp) makeDraggable(clamp,  dropZone, () => doCatch(farm.id));
};

/* ── 3D Canvas bootstrap ── */
function initVisitCanvas(farm) {
    import('../../components/FarmCanvas.js').then(({ FarmCanvas }) => {
        import('../../store.js').then(({ AppState }) => {
            const saved      = JSON.parse(localStorage.getItem('user_farms') || '[]');
            const originalId = AppState.currentFarmId;
            const tempFarm   = {
                id: farm.id, name: farm.name,
                rack: farm.rack || '3-tier', zone: 'A',
                tiles: (farm.tiles || []).map((t,i) => ({
                    id: i, emoji: t.emoji || null, status: t.status || 'healthy'
                }))
            };
            localStorage.setItem('user_farms', JSON.stringify([...saved, tempFarm]));
            AppState.currentFarmId = farm.id;
            FarmCanvas.init('visitFarmCanvas');
            localStorage.setItem('user_farms', JSON.stringify(saved));
            AppState.currentFarmId = originalId;
        });
    }).catch(() => {});
}

/* ══════════════════════════════════════════
    DRAG ENGINE
══════════════════════════════════════════ */
function makeDraggable(tool, dropZone, onDrop) {
    let clone = null, overZone = false, offX = 0, offY = 0;

    function spawnClone(cx, cy) {
        clone = document.createElement('div');
        clone.className = 'drag-clone';
        clone.innerText = tool.innerText;
        clone.style.left = cx - offX + 'px';
        clone.style.top  = cy - offY + 'px';
        document.body.appendChild(clone);
    }
    function moveClone(cx, cy) {
        if (!clone) return;
        clone.style.left = cx - offX + 'px';
        clone.style.top  = cy - offY + 'px';
        overZone = isOver(cx, cy, dropZone);
        dropZone.classList.toggle('drag-over', overZone);
    }
    function endDrag() {
        dropZone.classList.remove('drag-over');
        clone?.remove(); clone = null;
        if (overZone) { overZone = false; onDrop(); }
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
        const mu = ()  => { endDrag(); window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };
        window.addEventListener('mousemove', mm);
        window.addEventListener('mouseup',   mu);
    });

    tool.addEventListener('touchstart', e => {
        e.preventDefault();
        const t = e.touches[0];
        const r = tool.getBoundingClientRect();
        offX = t.clientX - r.left; offY = t.clientY - r.top;
        spawnClone(t.clientX, t.clientY);
    }, { passive: false });
    tool.addEventListener('touchmove', e => {
        e.preventDefault();
        const t = e.touches[0];
        moveClone(t.clientX, t.clientY);
    }, { passive: false });
    tool.addEventListener('touchend', e => {
        e.preventDefault();
        endDrag();
    }, { passive: false });
}

/* ══════════════════════════════════════════
    ACTIONS
══════════════════════════════════════════ */
async function doWater(farmId) {
    const farm = neighborsData.find(f => f.id === farmId);
    if (!farm || farm.moisture >= 30) return;

    const bucket = document.getElementById('toolBucket');
    if (bucket) {
        bucket.style.transformOrigin = 'bottom right';
        bucket.style.animation = 'bucketPour 0.8s ease forwards';
        setTimeout(() => {
            if (bucket) { bucket.style.animation = ''; bucket.style.opacity = '0.3'; bucket.style.cursor = 'not-allowed'; }
        }, 800);
    }

    try {
        const res  = await fetch(`http://localhost:3000/api/community/visits/water/${farmId}`, { method: 'POST' });
        const data = await res.json();
        applyWaterUI(farm, data);
    } catch (_) {
        applyWaterUI(farm, { earned: 5 });
    }
}

function applyWaterUI(farm, data) {
    farm.moisture = 85;
    const moistEl = document.getElementById('uiMoisture');
    if (moistEl) moistEl.innerText = '85';
    const badge = document.getElementById('statusBadge');
    if (badge) {
        badge.className = 'status-badge badge-healthy';
        badge.innerText = '🌿 Healthy';
    }
    const lbl = document.getElementById('bucketLabel');
    if (lbl) lbl.innerText = '✅ Watered!';
    showToast('success', `💧 Watered! +${data?.earned ?? 5} 🍃`);
    updateTopNavCoins(data?.newTotal);
}

async function doCatch(farmId) {
    const farm = neighborsData.find(f => f.id === farmId);
    if (!farm || !farm.hasBug) return;

    const bugEl = document.getElementById('bugOverlay');
    if (bugEl) {
        bugEl.style.animation = 'clampSnap 0.5s ease forwards';
        setTimeout(() => bugEl?.remove(), 500);
    }

    const clamp = document.getElementById('toolClamp');
    if (clamp) { clamp.style.opacity = '0.3'; clamp.style.cursor = 'not-allowed'; }
    const lbl = document.getElementById('clampLabel');
    if (lbl) lbl.innerText = '✅ Bug caught!';

    farm.hasBug = false;

    try {
        const res  = await fetch(`http://localhost:3000/api/community/visits/catch-bug/${farmId}`, { method: 'POST' });
        const data = await res.json();
        showToast('success', `💥 Bug squished! +${data?.earned ?? 8} 🍃`);
        updateTopNavCoins(data?.newTotal);
    } catch (_) {
        showToast('success', '💥 Bug squished! +8 🍃');
    }
}

/* ══════════════════════════════════════════
    UTILS
══════════════════════════════════════════ */
window.backToNeighbors = function() { renderVisitsTab(currentContainerId); };

function updateTopNavCoins(newAmount) {
    if (!newAmount) return;
    const el = document.getElementById('myCoinsDisplay');
    if (el) el.innerText = `🍃 ${newAmount} Coins`;
}