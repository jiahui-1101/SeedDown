import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';

// 负责生成漂亮的 HTML
export function render() {
    return `
        <div style="padding:20px; background:#f8f9f5; min-height:100%;">
            <div style="margin-bottom:24px;">
                <h2 style="color:#1b4332; margin:0; font-size:1.5rem; font-weight:800;">Plant Health</h2>
                <p style="color:#40916c; font-size:0.85rem; margin-top:4px;">AI real-time monitoring & predictions</p>
            </div>

            <div id="goDetailBtn" style="background:white; border-radius:28px; padding:20px; margin-bottom:16px; border:1px solid #edf2f0; cursor:pointer; box-shadow: 0 8px 20px rgba(45, 106, 79, 0.03);">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <div style="display:flex; gap:12px;">
                        <div style="width:48px; height:48px; background:#fff1f0; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">🌡️</div>
                        <div>
                            <div style="font-weight:800; color:#1b4332; font-size:1.05rem;">Temp Spike</div>
                            <div style="color:#52796f; font-size:0.8rem; margin-top:2px;">Tomato — Rack Alpha</div>
                        </div>
                    </div>
                    <span style="background:#fff1f0; color:#ff4d4f; padding:4px 10px; border-radius:10px; font-size:0.65rem; font-weight:800; letter-spacing:0.5px;">CRITICAL</span>
                </div>
                <div style="margin-top:16px; color:#52796f; font-size:0.85rem; line-height:1.4;">
                    AI predicts heat stress in 45m. Click for diagnostic report.
                </div>
                <div style="margin-top:16px; display:flex; gap:10px;">
                    <button id="fixTempBtn" style="flex:1; background:#1b4332; color:white; border:none; padding:12px; border-radius:16px; font-size:0.85rem; font-weight:700; cursor:pointer;">Activate Fan</button>
                    <div style="width:44px; height:44px; border:1.5px solid #edf2f0; border-radius:16px; display:flex; align-items:center; justify-content:center; color:#1b4332;">→</div>
                </div>
            </div>

            <div style="background:white; border-radius:28px; padding:20px; border:1px solid #edf2f0;">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <div style="display:flex; gap:12px;">
                        <div style="width:48px; height:48px; background:#e6f7ff; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">💧</div>
                        <div><div style="font-weight:800; color:#1b4332;">Low Moisture</div></div>
                    </div>
                </div>
                <button id="fixWaterBtn" style="width:100%; margin-top:16px; background:white; color:#1b4332; border:1.5px solid #1b4332; padding:12px; border-radius:16px; font-weight:700; cursor:pointer;">Water Now</button>
            </div>
        </div>
    `;
}

// 负责处理点击事件
export function init() {
    // 1. 点击卡片跳转详情
    document.getElementById('goDetailBtn')?.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return; // 如果点到按钮就不跳转
        showScreen('alert-detail');
    });

    // 2. 修复按钮逻辑
    document.getElementById('fixTempBtn')?.addEventListener('click', () => {
        AppState.updateSensors('temp', 28, 'ok');
        showToast('success', 'Smart Cooling Activated 🌀');
        showScreen('home');
    });

    document.getElementById('fixWaterBtn')?.addEventListener('click', () => {
        AppState.updateSensors('water', 65, 'ok');
        showToast('success', 'Watering... 💧');
        showScreen('home');
    });
}