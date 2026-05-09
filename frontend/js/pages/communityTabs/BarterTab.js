// 文件路径: /frontend/js/pages/communityTabs/BarterTab.js
import { showToast } from '../../utils/toast.js';

let currentBarterView = 'pasar'; // 'pasar' 或 'myshop'
let allBarterItems = [];
const currentUser = 'MyFarm';

export async function renderBarterTab(containerId) {
    const area = document.getElementById(containerId);
    
    area.innerHTML = `
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
    `;

    bindLogic();
    loadItems();
}

function bindLogic() {
    const fab = document.getElementById('fabAddBarter');
    const searchBar = document.getElementById('pasarSearchBar');

    // Tab 切换
    document.getElementById('btnViewPasar').addEventListener('click', (e) => {
        currentBarterView = 'pasar';
        e.target.style.background = '#D1FAE5'; e.target.style.color = '#065F46';
        document.getElementById('btnViewMyShop').style.background = 'transparent'; document.getElementById('btnViewMyShop').style.color = 'gray';
        fab.style.display = 'none';
        searchBar.style.display = 'flex';
        renderList();
    });

    document.getElementById('btnViewMyShop').addEventListener('click', (e) => {
        currentBarterView = 'myshop';
        e.target.style.background = '#FEF3C7'; e.target.style.color = '#D97706';
        document.getElementById('btnViewPasar').style.background = 'transparent'; document.getElementById('btnViewPasar').style.color = 'gray';
        fab.style.display = 'flex';
        searchBar.style.display = 'none';
        renderList();
    });

    // 发帖与图片逻辑
    const modal = document.getElementById('barterPostModal');
    let base64Img = null;
    
    document.getElementById('barterImageUpload').addEventListener('change', function() {
        if(this.files[0]){
            const reader = new FileReader();
            reader.onload = e => { base64Img = e.target.result; document.getElementById('barterImagePreview').innerHTML = `<img src="${base64Img}" style="width:100%; object-fit:cover;">`; }
            reader.readAsDataURL(this.files[0]);
        }
    });

    fab.addEventListener('click', () => modal.style.display = 'flex');
    document.getElementById('btnCancelBarter').addEventListener('click', () => modal.style.display = 'none');

    // 提交发布
    document.getElementById('btnSubmitBarter').addEventListener('click', async () => {
        const title = document.getElementById('postTitle').value;
        const type = document.getElementById('postTradeType').value;
        if(!title) return showToast('warning', 'Item name is required!');

        try {
            const res = await fetch('http://localhost:3000/api/community/barter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title, tradeType: type, author: currentUser, image: base64Img,
                    priceCoins: document.getElementById('postCoins').value,
                    lookingFor: document.getElementById('postLookingFor').value,
                    location: document.getElementById('postLocation').value
                })
            });
            const data = await res.json();
            modal.style.display = 'none';
            showToast('success', 'Listed on Pasar!');
            loadItems();
            
            // 触发魔法撮合弹窗
            if(data.matchFound) {
                document.getElementById('matchText').innerText = `Farmer ${data.matchFound.author} has "${data.matchFound.title}" and is waiting for a trade!`;
                document.getElementById('magicMatchModal').style.display = 'flex';
            }
        } catch(e) { showToast('error', 'Failed to post'); }
    });

    // 搜索功能
    document.getElementById('btnSearch').addEventListener('click', () => {
        const q = document.getElementById('searchInput').value;
        loadItems(q);
    });
}

async function loadItems(query = '') {
    try {
        const url = `http://localhost:3000/api/community/barter${query ? '?search='+query : ''}`;
        const res = await fetch(url);
        allBarterItems = await res.json(); // 这里的 allBarterItems 现在来自 Firebase
        renderList();
    } catch (err) {
        console.error("Market Load Error:", err);
        document.getElementById('barterFeedList').innerHTML = 'Market is currently closed.';
    }
}

// 渲染瀑布流 / 我的订单卡片
function renderList() {
    const list = document.getElementById('barterFeedList');
    
    // Pasar只显示 Available 的，My Shop 显示我发布的 + 我买的
    // 在 BarterTab.js 的 renderList 函数中修改：

const displayItems = currentBarterView === 'pasar'
? allBarterItems.filter(i => i.status === 'available') // 删掉了作者过滤，现在能看到所有人的东西
: allBarterItems.filter(i => i.author === currentUser || i.buyer === currentUser);

    if (displayItems.length === 0) {
        list.innerHTML = `<div style="grid-column: span 2; text-align:center; padding:40px 20px; color:gray;">
            <div style="font-size:40px; margin-bottom:10px;">🛒</div>Nothing here yet.</div>`;
        return;
    }

    list.innerHTML = displayItems.map(item => {
        const isMine = item.author === currentUser;
        const amIBuyer = item.buyer === currentUser;
        
        let priceTag = '';
        if(item.tradeType === 'coins') priceTag = `🍃 ${item.priceCoins}`;
        else if(item.tradeType === 'barter') priceTag = `🔄 ${item.lookingFor}`;
        else priceTag = `🍃 ${item.priceCoins} or 🔄 ${item.lookingFor}`;

        // 决定卡片底部的操作按钮
        // 找到 renderList 里定义 actionBtn 的地方
let actionBtn = '';

if (currentBarterView === 'pasar' && item.status === 'available') {
    if (item.author === currentUser) {
        // 如果是自己的商品，显示“管理”或“我的发布”
        actionBtn = `<button class="btn-outline" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; color:#10B981; border:1px solid #10B981; cursor:default;">It's your item</button>`;
    } else {
        // 如果是别人的商品，才显示购买按钮
        actionBtn = `<button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; background:#10B981; border:none;" onclick="window.reserveItem('${item.id}')">Reserve Now</button>`;
    }
} else if (amIBuyer && item.status === 'reserved') {
    actionBtn = `<button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.8rem; background:#EAB308; border:none;" onclick="window.completeItem('${item.id}')">📦 Confirm Receipt</button>`;
}

        return `
        <div class="barter-card">
            <!-- 状态标签 -->
            <div class="status-badge status-${item.status}">${item.status.toUpperCase()}</div>
            
            <img src="${item.image || 'https://via.placeholder.com/150?text=No+Photo'}" class="barter-img">
            
            <div style="padding:10px; display:flex; flex-direction:column; flex:1;">
                <h4 style="margin:0 0 5px 0; font-size:0.95rem;">${item.title}</h4>
                <div style="font-size:0.7rem; color:gray; margin-bottom:5px;">By: ${item.author} <span class="trust-badge">★ Trusted</span></div>
                <div style="font-size:0.75rem; color:#4B5563; margin-bottom:10px;">📍 ${item.location || 'College Hall'}</div>
                
                <div style="color:#059669; font-weight:bold; font-size:0.85rem; margin-top:auto; margin-bottom:10px;">
                    ${priceTag}
                </div>
                
                ${actionBtn}
            </div>
        </div>
        `;
    }).join('');
}

// 预订物品
window.reserveItem = async function(id) {
    if(!confirm("Reserve this item? Coins will be locked.")) return;
    try {
        const res = await fetch(`http://localhost:3000/api/community/barter/${id}/reserve`, {
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ buyer: currentUser, paymentMethod: 'coins' })
        });
        const data = await res.json();
        if(res.ok){
            showToast('success', 'Reserved! Meet at the location.');
            loadItems();
        } else showToast('warning', data.message);
    } catch(e) { showToast('error', 'Error reserving'); }
}

// 确认收货 (仅买家可用)
window.completeItem = async function(id) {
    if(!confirm("Did you receive the item? Funds will be released to seller.")) return;
    try {
        await fetch(`http://localhost:3000/api/community/barter/${id}/complete`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({rating: 5}) });
        showToast('success', 'Transaction Completed! Seller gets +1 Trust.');
        loadItems();
    } catch(e) { showToast('error', 'Error'); }
}