// BarterTab.js — Responsive grid layout for the Barter Board
import { showToast } from '../../utils/toast.js';

const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000' : window.location.origin;

const CATEGORY_IMAGES = {
    tomato:  'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&q=80',
    chilli:  'https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=300&q=80',
    mint:    'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=300&q=80',
    basil:   'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=300&q=80',
    spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80',
    compost: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=300&q=80',
    veggie:  'https://images.unsplash.com/photo-1566842600175-97dca3b105e4?w=300&q=80',
    seed:    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80',
    default: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80',
};
function getItemImage(item) {
    if (item.image) return item.image;
    const t = (item.title || '').toLowerCase();
    for (const [k, url] of Object.entries(CATEGORY_IMAGES)) { if (t.includes(k)) return url; }
    return CATEGORY_IMAGES.default;
}

let currentBarterView = 'pasar';
let allBarterItems    = [];
const currentUser     = 'MyFarm';

const BARTER_STYLE = `
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
</style>`;

export async function renderBarterTab(containerId) {
    const area = document.getElementById(containerId);
    if (!document.getElementById('barterTabStyle')) area.insertAdjacentHTML('beforebegin', BARTER_STYLE);

    area.innerHTML = `
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
        </div>`;

    bindBarterLogic();
    loadItems();
}

function bindBarterLogic() {
    const fab       = document.getElementById('fabAddBarter');
    const searchBar = document.getElementById('pasarSearchBar');
    const modal     = document.getElementById('barterPostModal');
    let base64Img   = null;

    // View toggle
    document.getElementById('btnViewPasar').addEventListener('click', e => {
        currentBarterView = 'pasar';
        e.target.style.background = '#D1FAE5'; e.target.style.color = '#065F46';
        document.getElementById('btnViewMyShop').style.background = 'transparent';
        document.getElementById('btnViewMyShop').style.color = 'gray';
        fab.style.display = 'none'; searchBar.style.display = 'flex'; renderList();
    });
    document.getElementById('btnViewMyShop').addEventListener('click', e => {
        currentBarterView = 'myshop';
        e.target.style.background = '#FEF3C7'; e.target.style.color = '#D97706';
        document.getElementById('btnViewPasar').style.background = 'transparent';
        document.getElementById('btnViewPasar').style.color = 'gray';
        fab.style.display = 'flex'; searchBar.style.display = 'none'; renderList();
    });

    // Image upload
    document.getElementById('barterImageUpload').addEventListener('change', function() {
        if (!this.files[0]) return;
        const r = new FileReader();
        r.onload = e => { base64Img = e.target.result; document.getElementById('barterImagePreview').innerHTML = `<img src="${base64Img}" style="width:100%;object-fit:cover;">`; };
        r.readAsDataURL(this.files[0]);
    });

    fab.addEventListener('click', () => modal.style.display = 'flex');
    document.getElementById('btnCancelBarter').addEventListener('click', () => modal.style.display = 'none');

    document.getElementById('btnSubmitBarter').addEventListener('click', async () => {
        const title = document.getElementById('postTitle').value;
        const type  = document.getElementById('postTradeType').value;
        if (!title) return showToast('warning', 'Item name is required!');
        try {
            const res  = await fetch(`${API}/api/community/barter`, {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ title, tradeType:type, author:currentUser, image:base64Img,
                    priceCoins: document.getElementById('postCoins').value,
                    lookingFor: document.getElementById('postLookingFor').value,
                    location:   document.getElementById('postLocation').value }),
            });
            const data = await res.json();
            modal.style.display = 'none';
            showToast('success', 'Listed on Pasar!');
            loadItems();
            if (data.matchFound) {
                document.getElementById('matchText').innerText = `Farmer ${data.matchFound.author} has "${data.matchFound.title}" and wants a trade!`;
                document.getElementById('magicMatchModal').style.display = 'flex';
            }
        } catch (_) { showToast('error', 'Failed to post'); }
    });

    document.getElementById('btnSearch').addEventListener('click', () => {
        loadItems(document.getElementById('searchInput').value);
    });
    document.getElementById('searchInput').addEventListener('keydown', e => {
        if (e.key === 'Enter') loadItems(e.target.value);
    });
}

async function loadItems(query = '') {
    document.getElementById('barterFeedList').innerHTML =
        `<div style="grid-column:1/-1;text-align:center;padding:30px;color:gray;">Loading market…</div>`;
    try {
        const url = `${API}/api/community/barter${query ? '?search=' + encodeURIComponent(query) : ''}`;
        const res = await fetch(url);
        allBarterItems = await res.json();
        renderList();
    } catch (_) {
        document.getElementById('barterFeedList').innerHTML =
            `<div style="grid-column:1/-1;text-align:center;padding:30px;color:#DC2626;">Market is currently closed.</div>`;
    }
}

function renderList() {
    const list = document.getElementById('barterFeedList');
    const displayItems = currentBarterView === 'pasar'
        ? allBarterItems.filter(i => i.status === 'available')
        : allBarterItems.filter(i => i.author === currentUser || i.buyer === currentUser);

    if (!displayItems.length) {
        list.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:gray;">
            <div style="font-size:42px;margin-bottom:10px;">🛒</div>
            <div style="font-weight:700;">Nothing here yet.</div>
            <div style="font-size:.82rem;margin-top:4px;">${currentBarterView==='myshop'?'Tap + to list your first item!':'Come back soon!'}</div>
        </div>`;
        return;
    }

    list.innerHTML = displayItems.map(item => {
        const isMine   = item.author === currentUser;
        const amIBuyer = item.buyer  === currentUser;

        let priceTag = '';
        if (item.tradeType==='coins')  priceTag = `🍃 ${item.priceCoins} coins`;
        else if (item.tradeType==='barter') priceTag = `🔄 ${item.lookingFor}`;
        else priceTag = `🍃 ${item.priceCoins} · 🔄 ${item.lookingFor}`;

        let actionBtn = '';
        if (currentBarterView==='pasar' && item.status==='available') {
            actionBtn = isMine
                ? `<button class="barter-card-btn" style="background:#F3F4F6;color:#6B7280;cursor:default;">Your item</button>`
                : `<button class="barter-card-btn" style="background:#10B981;color:white;" onclick="window.reserveItem('${item.id}')">Reserve Now</button>`;
        } else if (amIBuyer && item.status==='reserved') {
            actionBtn = `<button class="barter-card-btn" style="background:#EAB308;color:white;" onclick="window.completeItem('${item.id}')">📦 Confirm Receipt</button>`;
        }

        const tagClass = { available:'tag-available', reserved:'tag-reserved', completed:'tag-completed' }[item.status] || 'tag-available';

        return `
        <div class="barter-card">
            <img src="${getItemImage(item)}" class="barter-card-img"
                 onerror="this.src='${CATEGORY_IMAGES.default}'" loading="lazy">
            <div class="barter-card-body">
                <span class="item-tag ${tagClass}">${item.status.toUpperCase()}</span>
                <div class="barter-card-title">${item.title}</div>
                <div class="barter-card-meta">
                    By: ${item.author}<span class="trust-badge">★</span><br>
                    📍 ${item.location || 'College Hall'}
                </div>
                <div class="barter-card-price">${priceTag}</div>
                ${actionBtn}
            </div>
        </div>`;
    }).join('');
}

window.reserveItem = async function(id) {
    if (!confirm('Reserve this item? Coins will be locked.')) return;
    try {
        const res  = await fetch(`${API}/api/community/barter/${id}/reserve`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ buyer:currentUser, paymentMethod:'coins' }),
        });
        const data = await res.json();
        if (res.ok) { showToast('success', 'Reserved! Meet at the location.'); loadItems(); }
        else showToast('warning', data.message);
    } catch (_) { showToast('error', 'Error reserving'); }
};

window.completeItem = async function(id) {
    if (!confirm('Did you receive the item?')) return;
    try {
        await fetch(`${API}/api/community/barter/${id}/complete`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ rating:5 }) });
        showToast('success', 'Transaction Completed! Seller gets +1 Trust. 🌿');
        loadItems();
    } catch (_) { showToast('error', 'Error'); }
};
