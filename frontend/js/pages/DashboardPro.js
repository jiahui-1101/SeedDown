import { API_BASE } from '../utils/apiBase.js';
// frontend/js/pages/DashboardPro.js
import { showScreen } from '../utils/navigation.js';

// 1. 只提供你的 Dashboard HTML (没有 Header 和 Back 按钮)
export function getDashboardHTML() {
    return `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
            <div style="background:#161B2D; border-radius:16px; padding:16px; border:1px solid #232D45;">
                <div style="color:#4A6A9A; font-size:0.75rem; font-weight:bold;">EST. PROFIT</div>
                <div id="pro-profit" style="font-size:1.6rem; color:#00FF88; font-weight:bold;">RM 0.00</div>
            </div>
            <div style="background:#161B2D; border-radius:16px; padding:16px; border:1px solid #232D45;">
                <div style="color:#4A6A9A; font-size:0.75rem; font-weight:bold;">ENERGY COST</div>
                <div id="pro-energy" style="font-size:1.6rem; color:#FFD966; font-weight:bold;">0 kWh</div>
            </div>
        </div>

        <div style="color:#60A5FA; font-size:0.8rem; font-weight:bold; margin-bottom:10px;">LIVE TELEMETRY</div>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
            <div class="pro-sensor" data-type="temperature" style="background:#161B2D; padding:16px; border-radius:16px; text-align:center; border:1px solid #232D45; cursor:pointer;">
                <div style="font-size:0.7rem; color:#4A6A9A;">TEMP</div><div id="pro-temp" style="color:#EF4444; font-weight:bold; font-size:1.2rem;">--</div>
            </div>
            <div class="pro-sensor" data-type="humidity" style="background:#161B2D; padding:16px; border-radius:16px; text-align:center; border:1px solid #232D45; cursor:pointer;">
                <div style="font-size:0.7rem; color:#4A6A9A;">HUMID</div><div id="pro-humid" style="color:#60A5FA; font-weight:bold; font-size:1.2rem;">--</div>
            </div>
            <div class="pro-sensor" data-type="light" style="background:#161B2D; padding:16px; border-radius:16px; text-align:center; border:1px solid #232D45; cursor:pointer;">
                <div style="font-size:0.7rem; color:#4A6A9A;">LIGHT</div><div id="pro-light" style="color:#FBBF24; font-weight:bold; font-size:1.2rem;">--</div>
            </div>
            <div class="pro-sensor" data-type="ph" style="background:#161B2D; padding:16px; border-radius:16px; text-align:center; border:1px solid #232D45; cursor:pointer;">
                <div style="font-size:0.7rem; color:#4A6A9A;">PH</div><div id="pro-ph" style="color:#34D399; font-weight:bold; font-size:1.2rem;">--</div>
            </div>
            <div class="pro-sensor" data-type="waterLevel" style="background:#161B2D; padding:16px; border-radius:16px; text-align:center; border:1px solid #232D45; cursor:pointer;">
                <div style="font-size:0.7rem; color:#4A6A9A;">WATER</div><div id="pro-water" style="color:#818CF8; font-weight:bold; font-size:1.2rem;">--</div>
            </div>
            <div class="pro-sensor" data-type="gasValue" style="background:#161B2D; padding:16px; border-radius:16px; text-align:center; border:1px solid #232D45; cursor:pointer;">
                <div style="font-size:0.7rem; color:#4A6A9A;">GAS</div><div id="pro-gas" style="color:#A78BFA; font-weight:bold; font-size:1.2rem;">--</div>
            </div>
        </div>
    `;
}

// 2. 只管你自己的 Firebase 逻辑
export function initDashboardLogic() {


    document.querySelectorAll('.pro-sensor').forEach(card => {
        card.onclick = () => showScreen('sensor-detail', { sensor: card.getAttribute('data-type') });
    });

    const syncData = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/sensors/latest?deviceId=farm_001`);
            const { reading: r } = await res.json();
            if (!r) return;
            
            document.getElementById('pro-profit').innerText = `RM ${(r.light * 3.5).toFixed(2)}`;
            document.getElementById('pro-energy').innerText = `${(r.temperature * 0.9).toFixed(1)} kWh`;
            document.getElementById('pro-temp').innerText = `${r.temperature}°C`;
            document.getElementById('pro-humid').innerText = `${r.humidity}%`;
            document.getElementById('pro-light').innerText = `${r.light}%`;
            document.getElementById('pro-ph').innerText = r.ph;
            document.getElementById('pro-water').innerText = `${r.waterLevel}cm`;
            document.getElementById('pro-gas').innerText = r.gasValue;
        } catch (e) { console.error("Sync Failed", e); }
    };

    syncData();
    window.proInterval = setInterval(syncData, 3000); 
}
