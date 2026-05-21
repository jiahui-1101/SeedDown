import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';
import * as WhatIf from './WhatIf.js';
import * as Consumption from './ConsumptionPage.js';

export function render(params = {}) {
    const { feature, from = 'home' } = params;

    // ✅ alerts 直接跳转到 Beginner alert 页面，不走 FeaturePage 框架
    if (feature === 'alerts') {
        showScreen('alert-beginner');
        return;
    }

    const container = document.getElementById('screenContainer');
    let content = '';

    if (feature === 'whatif') {
        content = WhatIf.render();
    } else if (feature === 'consumption') {
        content = Consumption.render();
    }

    container.innerHTML = `
        <div class="screen active" id="featureScreen">
            <div class="feat-topbar" style="display:flex; align-items:center; padding:12px 16px; background:var(--surface); gap:12px;">
                <button id="featureBackBtn" class="back-btn" aria-label="Back">←</button>
                <div style="font-weight:700;">${
                    feature === 'whatif'      ? '🔮 What-If'    :
                    feature === 'consumption' ? '⚡ Eco Savings' :
                                               '🚨 AI Alerts'
                }</div>
            </div>
            <div style="flex:1; overflow-y:auto;">${content}</div>
        </div>
    `;

    document.getElementById('featureBackBtn').addEventListener('click', () => showScreen(from));

    if (feature === 'whatif') {
        WhatIf.init();
    } else if (feature === 'consumption') {
        Consumption.init();
    }
}