import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';
import * as WhatIf from './WhatIf.js';
import * as Consumption from './ConsumptionPage.js';   
import * as AlertsList from './AlertsList.js';
import * as Mall from './MallPage.js'; 

export function render(params = {}) {
    // 这里的 from 会接收到 'dash-c' (来自商用版) 或 'home' (来自普通版)
    const { feature, from = 'home' } = params; 
    const container = document.getElementById('screenContainer');
    
    container.innerHTML = `
        <div class="screen active" id="featureScreen">
            <div class="feat-topbar" style="display:flex; align-items:center; padding:12px 16px; background:var(--surface); gap:12px;">
                <!-- 这里的返回按钮必须指向传递进来的 from -->
                <button id="featureBackBtn" class="back-btn">← Back</button>
                <div style="font-weight:700;">${feature === 'mall' ? '🍃 Green Mall' : '子页面'}</div>
            </div>
            <div id="featureContentArea" style="flex:1; overflow-y:auto;"></div>
        </div>
    `;

    // 绑定返回事件：关键在于这个 from 变量
    document.getElementById('featureBackBtn').addEventListener('click', () => {
        console.log(`[FeaturePage] Back button clicked, navigating to: ${from}`);
        showScreen(from); 
    });

    // 渲染商场内容
    if (feature === 'mall') {
        const Mall = import('./MallPage.js').then(m => m.render());
    }
}