// BarterTab.js — Responsive grid layout for the Barter Board
import { showToast } from '../../utils/toast.js';
import { API_BASE as API } from '../../utils/apiBase.js';

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
// Read the real logged-in username; fall back to 'MyFarm' only if nothing is stored
function getCurrentUser() {
    return (window.AppState?.currentUser?.name)
        || localStorage.getItem('username')
        || 'MyFarm';
}
// Keep a module-level alias for places that use the const directly
const currentUser = (() => getCurrentUser())(); // evaluated once per module load; refreshed on each renderBarterTab call via _currentUser below
let _currentUser = getCurrentUser();

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
    _currentUser = getCurrentUser(); // refresh on every render
    const area = document.getElementById(containerId);
    if (!document.getElementById('barterTabStyle')) area.insertAdjacentHTML('beforebegin', BARTER_STYLE);

    area.innerHTML = `
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
    const btnPasar = document.getElementById('btnViewPasar');
    const btnShop = document.getElementById('btnViewMyShop');
    const btnOrders = document.getElementById('btnViewMyOrders'); // 获取第三个按钮

    function resetTabs() {
        [btnPasar, btnShop, btnOrders].forEach(btn => {
            btn.style.background = 'transparent'; btn.style.color = 'gray';
        });
    }

    btnPasar.addEventListener('click', () => {
        currentBarterView = 'pasar';
        resetTabs();
        btnPasar.style.background = '#D1FAE5'; btnPasar.style.color = '#065F46';
        fab.style.display = 'none'; searchBar.style.display = 'flex'; renderList();
    });

    btnShop.addEventListener('click', () => {
        currentBarterView = 'myshop';
        resetTabs();
        btnShop.style.background = '#FEF3C7'; btnShop.style.color = '#D97706';
        fab.style.display = 'flex'; searchBar.style.display = 'none'; renderList();
    });

    // 补上第三个按钮的点击事件！
    btnOrders.addEventListener('click', () => {
        currentBarterView = 'myorders';
        resetTabs();
        btnOrders.style.background = '#E0F2FE'; btnOrders.style.color = '#0369A1';
        fab.style.display = 'none'; searchBar.style.display = 'none'; renderList();
    });

    // Image upload
    document.getElementById('barterImageUpload').addEventListener('change', function() {
        if (!this.files[0]) return;
        const r = new FileReader();
        r.onload = e => { base64Img = e.target.result; document.getElementById('barterImagePreview').innerHTML = `<img src="${base64Img}" style="width:100%;object-fit:cover;">`; };
        r.readAsDataURL(this.files[0]);
    });

    // 💡 Trade Type input guard: dynamically disable irrelevant field
    document.getElementById('postTradeType').addEventListener('change', (e) => {
        const val = e.target.value;
        const coinInput = document.getElementById('postCoins');
        const barterInput = document.getElementById('postLookingFor');
        if (val === 'coins') {
            coinInput.disabled = false; coinInput.style.background = 'white'; coinInput.style.opacity = '1';
            barterInput.disabled = true; barterInput.style.background = '#f3f4f6'; barterInput.style.opacity = '0.4'; barterInput.value = '';
        } else if (val === 'barter') {
            coinInput.disabled = true; coinInput.style.background = '#f3f4f6'; coinInput.style.opacity = '0.4'; coinInput.value = '';
            barterInput.disabled = false; barterInput.style.background = 'white'; barterInput.style.opacity = '1';
        } else {
            coinInput.disabled = false; coinInput.style.background = 'white'; coinInput.style.opacity = '1';
            barterInput.disabled = false; barterInput.style.background = 'white'; barterInput.style.opacity = '1';
        }
    });

    // FIX: merged into single FAB listener (was two separate listeners before — caused double-fire)
    // Also resets ALL form fields and image on open, preventing stale data from leaking into new posts
    fab.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.getElementById('postTradeType').value = 'both';
        document.getElementById('postTradeType').dispatchEvent(new Event('change'));
        ['postTitle', 'postCoins', 'postLookingFor', 'postLocation', 'postContact']
            .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        base64Img = null;
        document.getElementById('barterImagePreview').innerHTML = '';
        const imgInput = document.getElementById('barterImageUpload');
        if (imgInput) imgInput.value = '';
    });

    document.getElementById('btnCancelBarter').addEventListener('click', () => modal.style.display = 'none');

   // === 提交发布逻辑更新 (合并地点与联系方式) ===
   document.getElementById('btnSubmitBarter').addEventListener('click', async () => {
    const title = document.getElementById('postTitle').value;
    const type = document.getElementById('postTradeType').value;
    const loc = document.getElementById('postLocation').value;
    const contact = document.getElementById('postContact').value; // 获取联系方式
    
    if(!title) return showToast('warning', 'Item name is required!');
    if(!contact) return showToast('warning', 'Please provide a contact method!');

    // 🚀 核心技巧：用 " | " 把两者拼在一起存进 location 字段
    const combinedLocation = `${loc || 'Campus'} | ${contact}`;

    try {
        const res = await fetch(`${API}/api/community/barter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, tradeType: type, author: _currentUser, image: base64Img,
                priceCoins: document.getElementById('postCoins').value,
                lookingFor: document.getElementById('postLookingFor').value,
                location: combinedLocation // 👈 传给后端拼接好的字符串
            })
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
// ... 前面是你 bindBarterLogic 原本的代码 (比如 btnSearch 等) ...

    // ==========================================
    // 🌟 修复：将弹窗事件绑定移到这里，确保每次重新渲染都能绑上！
    // ==========================================
// ==========================================
    // 🌟 弹窗内的按钮与选择器逻辑绑定
    // ==========================================
    const txModal = document.getElementById('customTransactionModal');
    
    // 监听：用户在 "Both" 的情况下来回切换支付方式
    const radios = document.querySelectorAll('input[name="payMethod"]');
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (currentTransaction && currentTransaction.type === 'reserve') {
                const method = e.target.value;
                currentTransaction.selectedMethod = method; // 记录用户选的
                
                // 动态改卡片样式
                const isCoins = method === 'coins';
                document.getElementById('lblPayCoins').style.borderColor = isCoins ? '#10B981' : '#E5E7EB';
                document.getElementById('lblPayCoins').style.background = isCoins ? '#ECFDF5' : 'white';
                document.getElementById('lblPayItem').style.borderColor = !isCoins ? '#10B981' : '#E5E7EB';
                document.getElementById('lblPayItem').style.background = !isCoins ? '#ECFDF5' : 'white';

                // 动态改提示文案
                const desc = document.getElementById('txModalDesc');
                if (isCoins) {
                    desc.innerHTML = `<span style="font-weight:bold;color:#065F46;">🍃 ${currentTransaction.priceCoins} Coins</span> will be locked for this transaction.<br><br>Meet at the location to trade!`;
                } else {
                    desc.innerHTML = `Please prepare your <span style="font-weight:bold;color:#D97706;">🔄 ${currentTransaction.lookingFor}</span>.<br><br>Bring it to the meetup location to exchange!`;
                }
            }
        });
    });

    document.getElementById('btnTxCancel').addEventListener('click', () => {
        txModal.style.display = 'none';
        currentTransaction = null;
    });

    document.getElementById('btnTxConfirm').addEventListener('click', async () => {
        if (!currentTransaction) return;
        
        const confirmBtn = document.getElementById('btnTxConfirm');
        const originalText = confirmBtn.innerText;
        confirmBtn.innerText = 'Processing...';
        confirmBtn.style.opacity = '0.7';
        confirmBtn.style.pointerEvents = 'none'; 
        
        const { type, id, selectedMethod } = currentTransaction;
        
        try {
            if (type === 'reserve') {
                const res = await fetch(`${API}/api/community/barter/${id}/reserve`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ buyer: _currentUser, paymentMethod: selectedMethod })
                });
                const data = await res.json();
                
                if (res.ok) {
                    showToast('success', 'Reserved! Check My Orders.');
                    
                    // 🌟 👇 新增：把用户的支付选择死死记在本地缓存里！
                    localStorage.setItem(`payMethod_${id}`, selectedMethod);

                    if (selectedMethod === 'coins' && currentTransaction.priceCoins) {
                        updateWalletVisually(currentTransaction.priceCoins);
                    }
                    loadItems(); 
                } else {
                    showToast('warning', data.message || 'Error occurred!');
                }
            } 
            else if (type === 'complete') {
                await fetch(`${API}/api/community/barter/${id}/complete`, { 
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify({rating: 5}) 
                });
                showToast('success', 'Transaction Completed! 🌟');
                
                // 🌟 👇 新增：如果是金币交易或Both，触发右上角红色扣款特效
                if (currentTransaction.tradeType !== 'barter' && currentTransaction.priceCoins) {
                    updateWalletVisually(currentTransaction.priceCoins);
                }
                
                loadItems();
            }
        } catch (e) {
            console.error("Trade Error:", e);
            showToast('error', 'Network error. Please try again.');
        } finally {
            confirmBtn.innerText = originalText;
            confirmBtn.style.opacity = '1';
            confirmBtn.style.pointerEvents = 'auto';
            txModal.style.display = 'none';
            currentTransaction = null;
        }
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

// 渲染瀑布流 / 我的店铺 / 我的订单
function renderList() {
    const list = document.getElementById('barterFeedList');
    
    let displayItems = [];

    // ==========================================
    // 1. 数据过滤 (3个 Tab 完美分离)
    // ==========================================
    if (currentBarterView === 'pasar') {
        // 逛市集：别人卖的、还没卖出去的
        displayItems = allBarterItems.filter(i => i.status === 'available' && i.author !== _currentUser);
    } 
    else if (currentBarterView === 'myshop') {
        // 我的店铺：我发布的所有商品
        displayItems = allBarterItems.filter(i => i.author === _currentUser);
    } 
    else if (currentBarterView === 'myorders') {
        // 我的订单：我买的东西 (正在进行的排前面，已完成的排后面)
        const myPurchases = allBarterItems.filter(i => i.buyer === _currentUser);
        displayItems = myPurchases.sort((a, b) => {
            if (a.status === 'reserved' && b.status === 'completed') return -1;
            if (a.status === 'completed' && b.status === 'reserved') return 1;
            return 0;
        });
    }

    // ==========================================
    // 2. 判空状态
    // ==========================================
    if (!displayItems.length) {
        list.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:gray;">
            <div style="font-size:42px;margin-bottom:10px;">🛒</div>
            <div style="font-weight:700;">Nothing here yet.</div>
            <div style="font-size:.82rem;margin-top:4px;">${currentBarterView==='myshop'?'Tap + to list your first item!':'Come back soon!'}</div>
        </div>`;
        return;
    }

    // ==========================================
    // 3. 渲染卡片
    // ==========================================
    list.innerHTML = displayItems.map(item => {
        const isMine   = item.author === _currentUser;
        const amIBuyer = item.buyer  === _currentUser;

        // 拆解后端的 location 字段 (提取出地点和隐藏的盲盒联系方式)
        const locString = item.location || '';
        const locParts = locString.split(' | ');
        const realLocation = locParts[0] || 'Campus';
        const realContact = locParts[1] || 'Hidden';

        let priceTag = '';
        
        // 🌟 尝试读取后端的 paymentMethod，如果后端没存，就读取我们存在本地的记忆！
        const finalMethod = item.paymentMethod || localStorage.getItem(`payMethod_${item.id}`);

        if ((item.status === 'reserved' || item.status === 'completed') && finalMethod) {
            if (finalMethod === 'coins') {
                priceTag = `🍃 ${item.priceCoins}`;
            } else if (finalMethod === 'barter') {
                priceTag = `🔄 ${item.lookingFor}`;
            }
        } 
        else {
            if(item.tradeType === 'coins') priceTag = `🍃 ${item.priceCoins}`;
            else if(item.tradeType === 'barter') priceTag = `🔄 ${item.lookingFor}`;
            else priceTag = `🍃 ${item.priceCoins} <span style="color:#94A3B8;font-size:0.75rem;margin:0 2px;">or</span> 🔄 ${item.lookingFor}`;
        }

        // 根据不同 Tab 身份，决定按钮和盲盒状态
        let actionBtn = '';
        if (currentBarterView === 'pasar') {
            // 逛街模式：只能预订，盲盒是盖着的
            actionBtn = `<button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; background:#10B981; border:none;" onclick="window.reserveItem('${item.id}')">Reserve Now</button>`;
        } 
        else if (currentBarterView === 'myshop') {
            // 卖家模式：查看售卖状态
            if (item.status === 'available') {
                actionBtn = `<div style="text-align:center; font-size:0.8rem; color:gray; padding:8px; border:1px dashed #ccc; border-radius:8px;">Waiting for buyer...</div>`;
            } else if (item.status === 'reserved') {
                actionBtn = `<div style="text-align:center; font-size:0.8rem; color:#D97706; padding:8px; background:#FEF3C7; border-radius:8px; font-weight:bold;">Reserved by ${item.buyer}</div>`;
            } else {
                actionBtn = `<div style="text-align:center; font-size:0.8rem; color:#065F46; padding:8px; background:#D1FAE5; border-radius:8px; font-weight:bold;">Sold out 🎉</div>`;
            }
        }
        else if (currentBarterView === 'myorders') {
            // 买家模式：开盲盒！
            if (item.status === 'reserved') {
                actionBtn = `
                    <div style="margin-bottom:8px; padding:10px; background:#E0F2FE; border:1px solid #BAE6FD; border-radius:8px; text-align:center;">
                        <div style="font-size:0.75rem; color:#0369A1; margin-bottom:4px;">💬 Contact Seller via:</div>
                        <div style="font-weight:900; color:#0284C7; font-size:0.95rem; letter-spacing:0.5px;">${realContact}</div>
                    </div>
                    <button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; background:#EAB308; border:none; box-shadow:0 3px 8px rgba(234,179,8,0.3);" onclick="window.completeItem('${item.id}')">📦 Confirm Receipt</button>
                `;
            } else {
                actionBtn = `<div style="text-align:center; font-size:0.8rem; color:gray; padding:8px; background:#F3F4F6; border-radius:8px;">Order Completed</div>`;
            }
        }

        return `
        <div class="barter-card" style="${item.status === 'completed' ? 'opacity:0.7;' : ''}">
            <div class="status-badge status-${item.status}">${item.status.toUpperCase()}</div>
            
           <img src="${getItemImage(item)}" class="barter-img"
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80'">
            
            <div style="padding:10px; display:flex; flex-direction:column; flex:1;">
                <h4 style="margin:0 0 5px 0; font-size:0.95rem;">${item.title}</h4>
                <div style="font-size:0.7rem; color:gray; margin-bottom:5px;">By: ${item.author} <span class="trust-badge">★ Trusted</span></div>
                
                <div style="font-size:0.75rem; color:#4B5563; margin-bottom:10px; display:flex; align-items:center; gap:4px;">
                    <span>📍</span> <span style="font-weight:600;">${realLocation}</span>
                </div>
                
                <div style="color:#059669; font-weight:bold; font-size:0.85rem; margin-top:auto; margin-bottom:10px;">
                    ${priceTag}
                </div>
                
                ${actionBtn}
            </div>
        </div>
        `;
    }).join(''); // 👈 注意这里！这是非常关键的 join('')
}

// 全局记录交易状态
let currentTransaction = null;

// ==========================================
// 1. 预订物品 (Reserve - 智能感知支付方式)
// ==========================================
window.reserveItem = function(id) {
    // 根据 ID 找到正在点的商品
    const item = allBarterItems.find(i => i.id === id);
    if (!item) return;

    currentTransaction = { 
        type: 'reserve', id: id, 
        tradeType: item.tradeType, priceCoins: item.priceCoins, lookingFor: item.lookingFor, 
        selectedMethod: item.tradeType === 'barter' ? 'barter' : 'coins' 
    };
    
    document.getElementById('txModalIcon').innerText = '🤝';
    document.getElementById('txModalTitle').innerText = 'Reserve Item?';
    document.getElementById('btnTxConfirm').style.background = '#10B981';
    document.getElementById('btnTxConfirm').style.boxShadow = '0 4px 10px rgba(16,185,129,0.3)';
    
    const paymentSelection = document.getElementById('txPaymentSelection');
    const modalDesc = document.getElementById('txModalDesc');

    // 辅助函数：更新文字提示
    const updateDesc = (method) => {
        if (method === 'coins') {
            modalDesc.innerHTML = `<span style="font-weight:bold;color:#065F46;">🍃 ${item.priceCoins} Coins</span> will be locked for this transaction.<br><br>Meet at the location to trade!`;
        } else {
            modalDesc.innerHTML = `Please prepare your <span style="font-weight:bold;color:#D97706;">🔄 ${item.lookingFor}</span>.<br><br>Bring it to the meetup location to exchange!`;
        }
    };

    if (item.tradeType === 'both') {
        // 如果都可以选，显示选择框，并默认重置为 Coins
        paymentSelection.style.display = 'block';
        document.querySelector('input[name="payMethod"][value="coins"]').checked = true;
        document.getElementById('lblPayCoins').style.borderColor = '#10B981';
        document.getElementById('lblPayCoins').style.background = '#ECFDF5';
        document.getElementById('lblPayItem').style.borderColor = '#E5E7EB';
        document.getElementById('lblPayItem').style.background = 'white';
        updateDesc('coins');
    } else {
        // 只能用一种方式，隐藏选择框，直接显示那一种的文案
        paymentSelection.style.display = 'none';
        updateDesc(item.tradeType);
    }
    
    document.getElementById('customTransactionModal').style.display = 'flex';
};

// ==========================================
// 2. 确认收货 (Complete - 隐藏支付选项)
// ==========================================
// ==========================================
// 2. 确认收货 (Complete)
// ==========================================
window.completeItem = function(id) {
    // 🌟 新增：找到当前商品，获取它的价格和交易类型
    const item = allBarterItems.find(i => i.id === id);
    if (!item) return;

    currentTransaction = { 
        type: 'complete', 
        id: id,
        priceCoins: item.priceCoins, // 记录价格
        tradeType: item.tradeType    // 记录类型
    };
    
    document.getElementById('txPaymentSelection').style.display = 'none'; // 隐藏支付选择
    document.getElementById('txModalIcon').innerText = '📦';
    document.getElementById('txModalTitle').innerText = 'Confirm Receipt?';
    document.getElementById('txModalDesc').innerText = 'Did you receive the item? Funds will be released to the seller.';
    document.getElementById('btnTxConfirm').style.background = '#F59E0B'; 
    document.getElementById('btnTxConfirm').style.boxShadow = '0 4px 10px rgba(245,158,11,0.3)';
    
    document.getElementById('customTransactionModal').style.display = 'flex';
};

// ==========================================
// 💰 前端钱包 UI 视觉扣款特效
// ==========================================
function updateWalletVisually(amountToDeduct) {
    const coinDisplay = document.getElementById('myCoinsDisplay'); // 👈 使用你真实的 ID
    if (!coinDisplay) return;

    // 获取当前文字并提取数字 (处理从 "--" 到真实数字的过渡)
    let currentText = coinDisplay.innerText;
    let currentCoins = parseInt(currentText.replace(/[^0-9]/g, ''));
    
    if (!isNaN(currentCoins)) {
        let newBalance = currentCoins - parseInt(amountToDeduct);
        
        // 加上过渡动画，防止显得生硬
        coinDisplay.style.transition = 'all 0.3s ease';
        
        // 1. 瞬间更新文字并变红放大 (警告色)
        coinDisplay.innerText = `🍃 ${newBalance} Coins`;
        coinDisplay.style.color = '#EF4444'; // 红色文字
        coinDisplay.style.background = '#FEE2E2'; // 浅红背景
        coinDisplay.style.borderColor = '#FCA5A5'; // 红色边框
        coinDisplay.style.transform = 'scale(1.15)'; // 放大
        
        // 2. 400毫秒后，恢复成你原本的绿色主题！
        setTimeout(() => {
            coinDisplay.style.color = 'var(--green-800)'; 
            coinDisplay.style.background = 'var(--green-50)';
            coinDisplay.style.borderColor = 'var(--green-200)';
            coinDisplay.style.transform = 'scale(1)';
        }, 400);
    }
}
