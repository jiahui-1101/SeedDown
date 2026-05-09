import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';

export function render(params = {}) {
    // 💡 关键：在这里直接把 HTML 塞进容器
    const container = document.getElementById('screenContainer');
    if (!container) return;

    container.innerHTML = `
        <div style="background:#f8f9f5; min-height:100vh; font-family: sans-serif; color:#1a3c34;">
            <div style="display:flex; align-items:center; justify-content:space-between; padding:16px 20px; background:white; border-bottom:1px solid #edf2f0;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <button id="detailBackBtn" style="background:none; border:none; font-size:1.5rem; color:#1a3c34; cursor:pointer;">←</button>
                    <div style="font-weight:800; font-size:1.1rem;">Temp Analysis</div>
                </div>
            </div>

            <div style="padding:20px;">
                <div style="background:white; border-radius:32px; padding:24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #edf2f0;">
                    <div style="color:#40916c; font-size:0.7rem; font-weight:800; margin-bottom:12px;">CURRENT PREDICTION</div>
                    <div style="display:flex; align-items:baseline; gap:8px;">
                        <span style="font-size:3.5rem; font-weight:900; color:#1b4332;">34.2</span>
                        <span style="font-size:1.2rem; color:#95adbe;">°C</span>
                    </div>
                </div>
            </div>

            <div style="position:fixed; bottom:0; left:0; right:0; padding:20px 24px 34px;">
                <button id="detailExecuteBtn" style="width:100%; padding:18px; background:#1b4332; color:white; border:none; border-radius:24px; font-weight:700; cursor:pointer;">
                    EXECUTE COOLING NOW
                </button>
            </div>
        </div>
    `;
}

export function init() {
    // 💡 这里的 ID 必须和上面 render 里的 id="detailBackBtn" 一模一样
    const backBtn = document.getElementById('detailBackBtn');
    if (backBtn) {
        backBtn.onclick = () => showScreen('feature', { feature: 'alerts' });
    }

    const execBtn = document.getElementById('detailExecuteBtn');
    if (execBtn) {
        execBtn.onclick = () => {
            showToast('success', 'Cooling System Started!');
            showScreen('home');
        };
    }
}