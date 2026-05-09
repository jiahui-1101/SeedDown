import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';
import * as WhatIf from './WhatIf.js';
import * as Consumption from './ConsumptionPage.js';   

export function render(params = {}) {
    const { feature } = params;
    const container = document.getElementById('screenContainer');
    let content = '';

    if (feature === 'whatif') {
        content = WhatIf.render();

    } else if (feature === 'consumption') {
        content = Consumption.render();

    } else if (feature === 'alerts') {
        content = `
            <div style="padding:16px;">
                <div class="alert-card" style="border-left:3px solid var(--danger); background:var(--surface); padding:16px; border-radius:16px; margin-bottom:12px;">
                    <div>🌡️ Temp Spike — Tomato D1</div>
                    <div style="font-size:0.8rem; margin-top:8px;">Critical temperature 34.2°C. Activate cooling now.</div>
                    <button id="fixTempBtn" class="btn-outline" style="margin-top:12px;">🌀 Activate Fan</button>
                </div>
                <div class="alert-card" style="border-left:3px solid var(--warn); background:var(--surface); padding:16px; border-radius:16px;">
                    <div>💧 Low Moisture — Spinach B2</div>
                    <div style="font-size:0.8rem; margin-top:8px;">Soil moisture 22% - water immediately.</div>
                    <button id="fixWaterBtn" class="btn-outline" style="margin-top:12px;">💧 Water Now</button>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="screen active" id="featureScreen">
            <div class="feat-topbar" style="display:flex; align-items:center; padding:12px 16px; background:var(--surface); gap:12px;">
                <button id="featureBackBtn" class="back-btn">← Back</button>
                <div style="font-weight:700;">${
                    feature === 'whatif'      ? '🔮 What-If'    :
                    feature === 'consumption' ? '⚡ Eco Savings' :
                                               '🚨 AI Alerts'
                }</div>
            </div>
            <div style="flex:1; overflow-y:auto;">${content}</div>
        </div>
    `;

    document.getElementById('featureBackBtn').addEventListener('click', () => showScreen('home'));

    if (feature === 'whatif') {
        WhatIf.init();

     } else if (feature === 'consumption') {
       Consumption.init();   // ← triggers API fetch + chart render
   }
     else if (feature === 'alerts') {
        document.getElementById('fixTempBtn')?.addEventListener('click', () => {
            AppState.updateSensors('temp', 28, 'ok');
            showToast('success', '🌀 Cooling fan activated');
            showScreen('home');
        });
        document.getElementById('fixWaterBtn')?.addEventListener('click', () => {
            AppState.updateSensors('water', 65, 'ok');
            showToast('success', '💧 Watering started');
            showScreen('home');
        });
    }
}