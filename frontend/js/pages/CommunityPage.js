import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';

export function render() {
    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="communityScreen" style="background: var(--bg);">
            <div class="topbar">
                <button id="communityBackBtn" class="back-btn" style="background:none;border:none;font-size:20px;">←</button>
                <div style="font-weight:700;">🌍 Community</div>
                <div style="flex:1"></div>
                <div class="live-pill" id="myCoinsDisplay" style="background:var(--green-50); color:var(--green-800); border:1px solid var(--green-200);">
                    🍃 100 Coins
                </div>
            </div>

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

            <div id="commContentArea" style="padding: 0 20px; padding-bottom: 80px; overflow-y: auto; flex: 1;"></div>

            <div class="bottom-nav" style="position:absolute; bottom:0; width:100%;">
                <div class="nav-item" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item active"><span class="nav-icon">🌍</span><span class="nav-lbl">Community</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
        </div>
    `;

    document.getElementById('communityBackBtn').addEventListener('click', () => showScreen('home'));
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.getAttribute('data-screen');
            if (screen) showScreen(screen);
        });
    });

    initTabs();
    renderVisitsTab();
    fetchMyCoins();
}

function initTabs() {
    const btns = document.querySelectorAll('.comm-circle-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tabName = btn.getAttribute('data-tab');
            if (tabName === 'visits') renderVisitsTab();
            if (tabName === 'barter') renderBarterTab();
            if (tabName === 'sos') renderSosTab();
        });
    });
}

function renderVisitsTab() {
    const area = document.getElementById('commContentArea');
    area.innerHTML = `
        <div class="card" style="padding:0; overflow:hidden;">
            <div style="padding: 16px; display:flex; align-items:center; gap:12px;">
                <div style="font-size:30px;">👩‍🌾</div>
                <div>
                    <div style="font-weight:700;">Aisha.Farm</div>
                    <div style="font-size:0.7rem; color:var(--muted);">Sensor: Soil Moisture 18% (Critical)</div>
                </div>
            </div>
            <div id="twinModel" style="height:180px; background:#FCEBEB; display:flex; flex-direction:column; justify-content:center; align-items:center; transition:0.5s;">
                <div id="plantEmoji" style="font-size:70px; filter: grayscale(80%) sepia(50%); transform: rotate(15deg); transition:0.5s;">🥀</div>
                <div id="plantStatus" style="color:#DC2626; font-weight:700; margin-top:10px;">Plant is thirsty!</div>
            </div>
            <div style="padding:16px; display:flex; gap:12px;">
                <button id="btnWater" class="btn-primary" style="flex:2; display:flex; justify-content:center; gap:8px;">
                    <span>💧</span> Water Plant (Earn 5 Coins)
                </button>
                <button id="btnLike" class="btn-outline" style="flex:1;">💚 Like</button>
            </div>
        </div>
    `;

    document.getElementById('btnWater').addEventListener('click', async () => {
        try {
            const res = await fetch('http://localhost:3000/api/community/water', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                document.getElementById('twinModel').style.background = '#EAF3DE';
                document.getElementById('plantEmoji').innerText = '🌿';
                document.getElementById('plantEmoji').style.filter = 'none';
                document.getElementById('plantEmoji').style.transform = 'rotate(0deg)';
                document.getElementById('plantStatus').innerText = 'Healthy & Happy!';
                document.getElementById('plantStatus').style.color = '#3B6D11';
                document.getElementById('btnWater').disabled = true;
                document.getElementById('btnWater').innerHTML = '✅ Watered';
                document.getElementById('btnWater').style.background = '#9AA5B8';
                showToast('success', `${data.message} (+${data.coinsEarned} 🍃)`);
                document.getElementById('myCoinsDisplay').innerText = `🍃 ${data.totalCoins} Coins`;
            } else {
                showToast('warning', data.message);
            }
        } catch (err) {
            showToast('error', 'Network error. Make sure backend is running.');
        }
    });

    document.getElementById('btnLike').addEventListener('click', () => {
        showToast('success', 'Liked successfully! Leaderboard points +1 🌱');
    });
}

function renderBarterTab() {
    const area = document.getElementById('commContentArea');
    area.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div style="font-weight:700; font-size:0.8rem; color:var(--sub);">AVAILABLE IN YOUR AREA</div>
            <button class="btn-outline" style="padding:4px 10px; font-size:0.7rem;">+ Post Item</button>
        </div>
        <div class="card" style="margin-bottom:12px; display:flex; align-items:center; gap:12px; border-left:4px solid var(--warn);">
            <div style="font-size:40px;">📦</div>
            <div style="flex:1;">
                <div style="font-weight:700;">Ugly Veggie Mystery Box</div>
                <div style="font-size:0.7rem; color:var(--muted);">By Aisha.Farm · 1.5kg mixed veg</div>
                <div style="color:var(--accent); font-weight:700; font-size:0.8rem; margin-top:4px;">🍃 150 Coins</div>
            </div>
            <button class="btn-primary" style="padding:8px 12px; font-size:0.8rem;" onclick="showToast('info', 'Meet at College Hall. Scan QR to complete.')">Buy</button>
        </div>
        <div class="card" style="display:flex; align-items:center; gap:12px; border-left:4px solid var(--ok);">
            <div style="font-size:40px;">🔄</div>
            <div style="flex:1;">
                <div style="font-weight:700;">[Match] Basil for Mint</div>
                <div style="font-size:0.7rem; color:var(--muted);">System found a perfect match!</div>
            </div>
            <button class="btn-primary" style="padding:8px 12px; font-size:0.8rem; background:var(--ok);" onclick="showToast('success', 'Trade accepted!')">Trade</button>
        </div>
    `;
}

function renderSosTab() {
    const area = document.getElementById('commContentArea');
    area.innerHTML = `
        <div class="card" style="border: 1px solid var(--danger);">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                <div style="background:#FEE2E2; color:#DC2626; padding:4px 8px; border-radius:8px; font-weight:700; font-size:0.7rem;">SOS</div>
                <div style="font-weight:700; font-size:0.8rem;">GreenKL</div>
                <div style="font-size:0.7rem; color:var(--muted); margin-left:auto;">10 mins ago</div>
            </div>
            <div style="font-weight:700; margin-bottom:8px;">Tomato leaves turning yellow! 🍅</div>
            <div style="font-size:0.85rem; color:var(--sub); line-height:1.4; margin-bottom:12px;">
                My sensor shows pH is 7.2. The lower leaves are dying. What should I do?
            </div>
            <div style="background:var(--surface2); border-radius:12px; padding:12px; margin-bottom:12px;">
                <div style="font-size:0.75rem; font-weight:700; color:var(--accent);">ProFarmer (Expert)</div>
                <div style="font-size:0.8rem; margin-top:4px;">Your pH is too high! Tomatoes need 6.0-6.5. Add some pH Down solution to your water tank immediately.</div>
            </div>
            <button class="btn-outline" style="width:100%; border-color:var(--accent); color:var(--accent);" onclick="showToast('success', 'Sent 10 🍃 to ProFarmer!')">
                💸 Reward Expert (Tip 10 Coins)
            </button>
        </div>
    `;
}

async function fetchMyCoins() {
    try {
        const res = await fetch('http://localhost:3000/api/community/me');
        const data = await res.json();
        document.getElementById('myCoinsDisplay').innerText = `🍃 ${data.coins} Coins`;
    } catch (e) {
        console.log('Backend not running, using mock display');
    }
}