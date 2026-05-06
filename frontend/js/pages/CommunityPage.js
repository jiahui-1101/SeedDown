import { showScreen } from '../utils/navigation.js';
import { Community } from '../components/Community.js';
import { showToast } from '../utils/toast.js';

export function render() {
    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="communityScreen">
            <div class="topbar">
                <button id="communityBackBtn" class="back-btn">← Back</button>
                <div>🌍 Community</div>
                <div style="flex:1"></div>
                <div class="live-pill">12 Online</div>
            </div>
            <div class="bottom-nav">
                <div class="nav-item" data-screen="home"><span class="nav-icon">🏠</span><span class="nav-lbl">Home</span></div>
                <div class="nav-item" data-screen="profile"><span class="nav-icon">👤</span><span class="nav-lbl">Profile</span></div>
            </div>
            <div style="flex:1; overflow-y:auto;">
                <div id="communityMap" style="height:180px; background:#EAF4FF; margin:12px; border-radius:24px; position:relative;"></div>
                <div style="padding:0 16px;">
                    <div style="font-size:0.7rem; font-weight:700;">NEARBY FARMERS</div>
                    <div id="communityUserList" style="margin-top:8px; display:flex; flex-direction:column; gap:8px;"></div>
                </div>
            </div>
        </div>
    `;
    
    Community.renderMap('communityMap');
    Community.renderUserList('communityUserList');
    
    document.getElementById('communityBackBtn').addEventListener('click', () => showScreen('home'));
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.getAttribute('data-screen');
            if (screen === 'profile') showToast('info', 'Profile coming soon');
            else if (screen === 'home') showScreen('home');
        });
    });
}