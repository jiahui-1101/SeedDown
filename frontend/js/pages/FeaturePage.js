import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';
import * as WhatIf from './WhatIf.js';
import * as Consumption from './ConsumptionPage.js';   
import * as AlertsList from './AlertsList.js';

export function render(params = {}) {
    const { feature } = params;
    const container = document.getElementById('screenContainer');
    let content = '';

    if (feature === 'whatif') {
        content = WhatIf.render();

    } else if (feature === 'consumption') {
        content = Consumption.render();

    } else if (feature === 'alerts') {
        content = AlertsList.render();
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
        AlertsList.init();
    }
}