// 文件路径: /frontend/js/pages/MallPage.js
import { showToast } from '../utils/toast.js';

let products = [];
let shoppingCart = []; // 存储格式: { id, name, price, quantity, icon }

export async function render() {
    const area = document.getElementById('featureContentArea') || document.getElementById('screenContainer');
    if (!area) return;

    area.innerHTML = `
        <div class="mall-container" style="display:flex; flex-direction:column; height:100%; background:#F8FAFC;">
            <!-- 顶部余额 -->
            <div style="padding: 12px 16px; display:flex; justify-content:flex-end; background:white; border-bottom:1px solid #F1F5F9;">
                <div id="mallCoinsDisplay" class="live-pill" style="font-weight:700; color:var(--green-700); background:var(--green-50);">
                    🍃 Loading...
                </div>
            </div>

            <!-- 商品网格 -->
            <div id="productGrid" style="flex:1; overflow-y:auto; padding:16px; display:grid; grid-template-columns:1fr 1fr; gap:12px; padding-bottom:100px;">
                <!-- 商品卡片 -->
            </div>

            <!-- 底部结算悬浮栏 -->
            <div id="cartBar" style="position:fixed; bottom:0; left:0; right:0; background:white; padding:16px; border-top:1px solid #E2E8F0; display:none; z-index:99; box-shadow:0 -5px 15px rgba(0,0,0,0.05);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div>
                        <span style="font-size:0.75rem; color:#64748B;">Total Items: </span>
                        <span id="cartCount" style="font-weight:700;">0</span>
                    </div>
                    <div>
                        <span style="font-size:0.75rem; color:#64748B;">Total: </span>
                        <span id="cartTotal" style="font-weight:800; color:var(--accent); font-size:1.2rem;">🍃 0</span>
                    </div>
                </div>
                <button id="btnCheckOut" class="btn-primary" style="width:100%; height:48px; border-radius:12px; font-weight:700;">
                    Check Out List
                </button>
            </div>

            <!-- 结算清单 Modal (默认隐藏) -->
            <div id="checkoutModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center; padding:20px;">
                <div style="background:white; width:100%; max-width:400px; border-radius:24px; padding:24px; max-height:80vh; display:flex; flex-direction:column;">
                    <h3 style="margin-top:0;">📋 Order Summary</h3>
                    <div id="orderList" style="flex:1; overflow-y:auto; margin:16px 0;">
                        <!-- 清单内容 -->
                    </div>
                    <div style="border-top:1px solid #EEE; padding-top:16px;">
                        <input type="text" id="deliveryAddress" placeholder="Enter delivery address..." 
                               style="width:100%; padding:12px; border:1px solid #DDD; border-radius:12px; margin-bottom:16px;">
                        <div style="display:flex; gap:10px;">
                            <button id="btnCancelModal" class="btn-outline" style="flex:1;">Cancel</button>
                            <button id="btnFinalPay" class="btn-primary" style="flex:2;">Confirm & Pay</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    initEventListeners();
    await fetchProducts();
    await updateUserCoins();
}

// 渲染商品列表
async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:3000/api/mall/products');
        products = await res.json();
        const grid = document.getElementById('productGrid');
        
        grid.innerHTML = products.map(p => `
            <div class="card" style="background:white; border-radius:16px; padding:12px; border:1px solid #E2E8F0; text-align:center;">
                <div style="font-size:36px;">${p.icon || '📦'}</div>
                <div style="font-weight:700; font-size:0.85rem; margin-top:8px;">${p.name}</div>
                <div style="color:var(--accent); font-weight:700; margin:4px 0;">🍃 ${p.price}</div>
                <button class="btn-outline" style="padding:4px 12px; font-size:0.75rem;" onclick="window.addToCart('${p.id}')">
                    + Add to Cart
                </button>
            </div>
        `).join('');
    } catch (e) {
        showToast('error', 'Failed to fetch products');
    }
}

// 购物车逻辑
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const existing = shoppingCart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        shoppingCart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    showToast('success', `Added ${product.name} to cart`);
};

function updateCartUI() {
    const cartBar = document.getElementById('cartBar');
    const total = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);

    if (count > 0) {
        cartBar.style.display = 'block';
        document.getElementById('cartCount').innerText = count;
        document.getElementById('cartTotal').innerText = `🍃 ${total}`;
    } else {
        cartBar.style.display = 'none';
    }
}

// 初始化事件监听
function initEventListeners() {
    // 打开结算清单
    document.getElementById('btnCheckOut').addEventListener('click', () => {
        const modal = document.getElementById('checkoutModal');
        const orderList = document.getElementById('orderList');
        modal.style.display = 'flex';

        orderList.innerHTML = shoppingCart.map((item, index) => `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; background:#F8FAFC; padding:10px; border-radius:12px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:20px;">${item.icon}</span>
                    <div>
                        <div style="font-weight:700; font-size:0.8rem;">${item.name}</div>
                        <div style="font-size:0.7rem; color:#64748B;">🍃 ${item.price} each</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button onclick="window.changeQty(${index}, -1)" style="width:24px; height:24px; border-radius:6px; border:1px solid #DDD;">-</button>
                    <span style="font-weight:700; min-width:20px; text-align:center;">${item.quantity}</span>
                    <button onclick="window.changeQty(${index}, 1)" style="width:24px; height:24px; border-radius:6px; border:1px solid #DDD;">+</button>
                </div>
            </div>
        `).join('');
    });

    // 取消 Modal
    document.getElementById('btnCancelModal').addEventListener('click', () => {
        document.getElementById('checkoutModal').style.display = 'none';
    });

    // 最终支付
    document.getElementById('btnFinalPay').addEventListener('click', processPayment);
}

// 动态修改清单内的数量
window.changeQty = (index, delta) => {
    shoppingCart[index].quantity += delta;
    if (shoppingCart[index].quantity <= 0) {
        shoppingCart.splice(index, 1);
    }
    // 重新触发结算清单渲染
    document.getElementById('btnCheckOut').click();
    updateCartUI();
    if (shoppingCart.length === 0) {
        document.getElementById('checkoutModal').style.display = 'none';
    }
};

async function processPayment() {
    const address = document.getElementById('deliveryAddress').value.trim();
    if (!address) return showToast('warning', 'Please enter address');

    const totalPrice = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        const res = await fetch('http://localhost:3000/api/mall/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                items: shoppingCart, 
                address, 
                totalPrice 
            })
        });
        const result = await res.json();
        if (result.success) {
            showToast('success', 'Purchase successful! Items are on the way.');
            shoppingCart = [];
            updateCartUI();
            document.getElementById('checkoutModal').style.display = 'none';
            updateUserCoins();
        } else {
            showToast('error', result.message);
        }
    } catch (e) {
        showToast('error', 'Payment failed');
    }
}

async function updateUserCoins() {
    const res = await fetch('http://localhost:3000/api/community/me');
    const data = await res.json();
    const display = document.getElementById('mallCoinsDisplay');
    if (display) display.innerText = `🍃 ${data.coins} Coins`;
}