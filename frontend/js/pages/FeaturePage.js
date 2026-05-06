import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';

export function render(params = {}) {
    const { feature } = params;
    const container = document.getElementById('screenContainer');
    let content = '';
    
    if (feature === 'whatif') {
        content = `
            <div style="padding:16px;">
                <div class="card" style="margin-bottom:16px;">AI predicts harvest in <strong>7 days</strong>. Adjust conditions below.</div>
                <div class="card">
                    <div class="sim-row" style="display:flex; gap:12px; align-items:center; margin-bottom:12px;"><span>🌡️</span><span>Temp</span><input type="range" id="simTemp" min="18" max="40" value="26"><span id="simTempVal">26°C</span></div>
                    <div class="sim-row" style="display:flex; gap:12px; align-items:center; margin-bottom:12px;"><span>💧</span><span>Water</span><input type="range" id="simWater" min="1" max="5" value="3"><span id="simWaterVal">3×/day</span></div>
                    <div class="sim-row" style="display:flex; gap:12px; align-items:center;"><span>☀️</span><span>Light</span><input type="range" id="simLight" min="8" max="18" value="14"><span id="simLightVal">14h</span></div>
                    <div id="simResult" style="margin-top:16px; background:var(--ok-bg); padding:12px; border-radius:12px;">Predicted yield: <strong>340g</strong> · Profit: <strong>RM 28.50</strong></div>
                </div>
            </div>
        `;
    } else if (feature === 'consumption') {
        content = `
            <div style="padding:16px;">
                <div class="eco-hero" style="background:var(--ok-bg); border-radius:24px; padding:24px; text-align:center; margin-bottom:16px;"><div style="font-size:2.5rem;">A+</div><div>Eco Rating</div></div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div class="card"><span>💧</span><div>12.4L</div><div>Water today</div><div style="color:var(--ok);">↓ 65%</div></div>
                    <div class="card"><span>⚡</span><div>8.2 kWh</div><div>Energy</div><div style="color:var(--ok);">↓ 42%</div></div>
                    <div class="card"><span>🌱</span><div>2.1 kg</div><div>CO₂ saved</div></div>
                    <div class="card"><span>💰</span><div>RM 3.40</div><div>Cost today</div></div>
                </div>
                <div class="card" style="margin-top:16px;"><div>💡 AI Tips</div><ul><li>Reduce light by 2h → save RM0.80/day</li><li>Batch watering → save 1.2L water</li></ul></div>
            </div>
        `;
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
                <div style="font-weight:700;">${feature === 'whatif' ? '🔮 What-If' : feature === 'consumption' ? '⚡ Eco Savings' : '🚨 AI Alerts'}</div>
            </div>
            <div style="flex:1; overflow-y:auto;">${content}</div>
        </div>
    `;
    
    document.getElementById('featureBackBtn').addEventListener('click', () => showScreen('home'));
    if (feature === 'alerts') {
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
    } else if (feature === 'whatif') {
        const updateSim = () => {
            const t = parseInt(document.getElementById('simTemp').value);
            const w = parseInt(document.getElementById('simWater').value);
            const l = parseInt(document.getElementById('simLight').value);
            document.getElementById('simTempVal').innerText = t+'°C';
            document.getElementById('simWaterVal').innerText = w+'×/day';
            document.getElementById('simLightVal').innerText = l+'h';
            const yieldEst = Math.round(200 + (1 - Math.abs(t-24)/20) * 200);
            const profit = (yieldEst * 0.085).toFixed(2);
            document.getElementById('simResult').innerHTML = `Predicted yield: <strong>${yieldEst}g</strong> · Profit: <strong>RM ${profit}</strong>`;
        };
        const simTemp = document.getElementById('simTemp');
        const simWater = document.getElementById('simWater');
        const simLight = document.getElementById('simLight');
        if (simTemp) simTemp.addEventListener('input', updateSim);
        if (simWater) simWater.addEventListener('input', updateSim);
        if (simLight) simLight.addEventListener('input', updateSim);
        updateSim();
    }
}