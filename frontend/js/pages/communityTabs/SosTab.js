// SosTab.js — SOS Beacon with responsive grid layout
import { showToast } from '../../utils/toast.js';

const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000' : window.location.origin;

let currentView = 'all';
let allPosts    = [];

const SOS_STYLE = `
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
</style>`;

export async function renderSosTab(containerId) {
    const area = document.getElementById(containerId);
    if (!document.getElementById('sosTabStyle')) area.insertAdjacentHTML('beforebegin', SOS_STYLE);

    area.innerHTML = `
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
        </div>`;

    bindSosLogic();
    loadFeed();
}

function bindSosLogic() {
    // View toggle
    document.getElementById('btnViewAll').addEventListener('click', e => {
        currentView = 'all';
        e.target.style.background = '#E0F2FE'; e.target.style.color = '#0369A1';
        document.getElementById('btnViewMine').style.background = 'transparent'; document.getElementById('btnViewMine').style.color = 'gray';
        renderList();
    });
    document.getElementById('btnViewMine').addEventListener('click', e => {
        currentView = 'mine';
        e.target.style.background = '#FEE2E2'; e.target.style.color = '#DC2626';
        document.getElementById('btnViewAll').style.background = 'transparent'; document.getElementById('btnViewAll').style.color = 'gray';
        renderList();
    });

    const modal    = document.getElementById('sosPostModal');
    const imgUpload = document.getElementById('sosImageUpload');
    const preview  = document.getElementById('imagePreview');
    let base64Image = null;

    document.getElementById('fabAddSos').addEventListener('click', () => modal.style.display = 'flex');
    document.getElementById('btnCancelSos').addEventListener('click', () => modal.style.display = 'none');

    imgUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        const r = new FileReader();
        r.onload = e => { base64Image = e.target.result; preview.innerHTML = `<img src="${base64Image}" style="max-width:100%;max-height:130px;border-radius:8px;object-fit:contain;">`; };
        r.readAsDataURL(file);
    });

    document.getElementById('btnSubmitSos').addEventListener('click', async () => {
        const title = document.getElementById('sosInputTitle').value;
        const content = document.getElementById('sosInputContent').value;
        const btn = document.getElementById('btnSubmitSos');
        if (!title || !content) return showToast('warning', 'Please fill in both fields!');
        btn.disabled = true; btn.innerText = 'Broadcasting…';
        try {
            await fetch(`${API}/api/community/posts/sos`, {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ title, content, author:'MyFarm', image:base64Image }),
            });
            modal.style.display = 'none';
            document.getElementById('sosInputTitle').value = '';
            document.getElementById('sosInputContent').value = '';
            preview.innerHTML = ''; base64Image = null;
            showToast('success', 'SOS broadcasted!');
            loadFeed();
        } catch (_) {
            showToast('error', 'Network error');
        } finally {
            btn.disabled = false; btn.innerText = 'Broadcast';
        }
    });
}

async function loadFeed() {
    document.getElementById('sosFeedList').innerHTML =
        `<div style="grid-column:1/-1;text-align:center;padding:28px;color:gray;">Loading beacons…</div>`;
    try {
        const res = await fetch(`${API}/api/community/posts`);
        allPosts  = await res.json();
        renderList();
    } catch (_) {
        document.getElementById('sosFeedList').innerHTML =
            `<div style="grid-column:1/-1;color:#DC2626;text-align:center;padding:20px;">Failed to load posts.</div>`;
    }
}

function renderList() {
    const list        = document.getElementById('sosFeedList');
    const currentUser = 'MyFarm';
    const displayPosts = currentView === 'all' ? allPosts : allPosts.filter(p => p.author === currentUser);

    if (!displayPosts.length) {
        list.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:gray;padding:48px 20px;">
            <div style="font-size:40px;margin-bottom:10px;">🍃</div>
            <div style="font-weight:700;">No beacons found.</div>
            <div style="font-size:.82rem;margin-top:4px;">Everything looks green!</div>
        </div>`;
        return;
    }

    list.innerHTML = displayPosts.map(post => {
        const isMine = post.author === currentUser;
        return `
        <div class="sos-card">
            <div class="sos-card-header">
                <div class="sos-avatar" style="background:${isMine?'#FEE2E2':'#E0E7FF'};">${isMine?'👤':'👩‍🌾'}</div>
                <span class="sos-author">${post.author}</span>
                <span class="sos-date">${post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}</span>
            </div>
            <h4 class="sos-title">${post.title}</h4>
            <p class="sos-body">${post.content}</p>
            ${post.image ? `<img src="${post.image}" class="sos-image">` : ''}
            <div class="sos-actions">
                <button class="sos-action-btn btn-like" onclick="window.likePost('${post.id}')">
                    🍃 <span>${post.likes || 0}</span>
                </button>
                ${isMine ? `<button class="sos-action-btn btn-delete" onclick="window.deletePost('${post.id}')">🗑️ Delete</button>` : ''}
            </div>
            <div class="sos-comments-box">
                <div class="sos-comment-label">SUGGESTIONS (${(post.comments||[]).length})</div>
                ${(post.comments||[]).map(c => `
                    <div class="sos-comment-item">
                        <div style="line-height:1.4;"><b style="color:#374151;">${c.author}:</b> <span style="color:#4B5563;">${c.text}</span></div>
                        ${isMine && c.author !== currentUser ? `<button class="tip-btn" onclick="window.rewardComment('${post.id}','${c.author}')">🎁 Tip</button>` : ''}
                    </div>`).join('')}
            </div>
            <div class="sos-comment-input-row">
                <input type="text" id="commentInput_${post.id}" class="sos-comment-input" placeholder="Type your suggestion…">
                <button class="sos-send-btn" onclick="window.submitComment('${post.id}')">Send</button>
            </div>
        </div>`;
    }).join('');
}

// ── Global Actions ──────────────────────────────────────
window.submitComment = async function(postId) {
    const input = document.getElementById(`commentInput_${postId}`);
    if (!input?.value) return showToast('warning', 'Comment cannot be empty!');
    try {
        await fetch(`${API}/api/community/posts/${postId}/comments`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ text:input.value, author:'HelpfulNeighbor' }),
        });
        showToast('success', 'Suggestion added!');
        loadFeed();
    } catch (_) { showToast('error', 'Failed to send'); }
};

window.deletePost = function(postId) {
    const modal = document.getElementById('customConfirmModal');
    modal.style.display = 'flex';
    document.getElementById('btnConfirmCancel').onclick = () => modal.style.display = 'none';
    document.getElementById('btnConfirmOk').onclick = async () => {
        modal.style.display = 'none';
        try {
            await fetch(`${API}/api/community/posts/${postId}`, { method:'DELETE' });
            showToast('success', 'Beacon removed.');
            loadFeed();
        } catch (_) { showToast('error', 'Error deleting'); }
    };
};

window.likePost = async function(postId) {
    try {
        await fetch(`${API}/api/community/posts/${postId}/like`, { method:'POST' });
        loadFeed();
    } catch (_) { showToast('error', 'Network error'); }
};

window.rewardComment = function(postId, receiverName) {
    const modal = document.getElementById('customPromptModal');
    document.getElementById('promptMsg').innerText = `Send coins to ${receiverName} as a thank you!`;
    document.getElementById('promptInput').value = '10';
    modal.style.display = 'flex';
    document.getElementById('btnPromptCancel').onclick = () => modal.style.display = 'none';
    document.getElementById('btnPromptOk').onclick = async () => {
        const amount = Number(document.getElementById('promptInput').value);
        modal.style.display = 'none';
        if (!amount || amount <= 0) return showToast('warning', 'Invalid amount!');
        try {
            const res  = await fetch(`${API}/api/community/posts/${postId}/reward`, {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ amount, receiver:receiverName }),
            });
            const data = await res.json();
            if (res.ok) {
                showToast('success', `Sent ${amount} 🍃 to ${receiverName}!`);
                const el = document.getElementById('myCoinsDisplay');
                if (el) { const c = parseInt(el.innerText.replace(/\D/g,'')); el.innerText = `🍃 ${c-amount} Coins`; }
            } else showToast('warning', data.message);
        } catch (_) { showToast('error', 'Failed to send reward'); }
    };
};
