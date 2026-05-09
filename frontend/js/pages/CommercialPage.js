// 文件路径: /frontend/js/pages/CommunityPage.js
import { showScreen } from '../utils/navigation.js';
// 引入我们拆分出去的三个模块
import { renderVisitsTab } from './communityTabs/VisitsTab.js';
import { renderBarterTab } from './communityTabs/BarterTab.js';
import { renderSosTab } from './communityTabs/SosTab.js';

export function render() {
    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="communityScreen" style="background: var(--bg);">
            
            <!-- 顶部导航栏 -->
            <div class="topbar">
                <button id="communityBackBtn" class="back-btn" style="background:none;border:none;font-size:20px;">←</button>
                <div style="font-weight:700;">🌍 Community</div>
                <div style="flex:1"></div>
                <div class="live-pill" id="myCoinsDisplay" style="background:var(--green-50); color:var(--green-800); border:1px solid var(--green-200);">
                    🍃 -- Coins
                </div>
            </div>

            <!-- 横向滚动菜单 -->
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

            <!-- 动态内容区 (子文件会把内容画在这里) -->
            <div id="commContentArea" style="padding: 0 20px; padding-bottom: 80px; overflow-y: auto; height: calc(100vh - 160px); position: relative;">
            </div>

            <!-- 底部导航 -->
            <div class="bottom-nav" style="position:absolute; bottom:0; width:100%;">
                <div class="nav-item" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item active"><span class="nav-icon">🌍</span><span class="nav-lbl">Community</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `;

    // 绑定返回主页
    document.getElementById('communityBackBtn').addEventListener('click', () => showScreen('home'));
    
    // 初始化 Tab 切换
    const btns = document.querySelectorAll('.comm-circle-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tabName = btn.getAttribute('data-tab');
            // 根据点击的 Tab，调用对应的子文件函数
            if (tabName === 'visits') renderVisitsTab('commContentArea');
            if (tabName === 'barter') renderBarterTab('commContentArea');
            if (tabName === 'sos') renderSosTab('commContentArea');
        });
    });

    // Bottom nav
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.getAttribute('data-screen');
             if (screen === 'profile') showScreen('profile');
            else if (screen === 'home') showScreen('dash-c');
        });
    });
}

async function fetchMyCoins() {
    try {
        const res = await fetch('http://localhost:3000/api/community/me');
        const data = await res.json();
        document.getElementById('myCoinsDisplay').innerText = `🍃 ${data.coins} Coins`;
    } catch (e) {
        console.warn("未获取到金币余额");
    }
}