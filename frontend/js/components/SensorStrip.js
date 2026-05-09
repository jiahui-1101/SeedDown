import { AppState } from '../store.js';
import { showScreen } from '../utils/navigation.js';

export const SensorStrip = {
    container: null,
    init() {
        this.container = document.getElementById('dashStrip');
        if (!this.container) return;
        this.container.className = ''; 
        this.container.style.display = 'block';
        this.container.style.width = '100%';
        AppState.subscribe(() => this.render());
        this.render();
    },
    render() {
        if (!this.container) return;
        const s = AppState.sensors;
        const items = [
            { icon: '🌡️', key: 'temp', label: 'Temp', unit: '°C' },
            { icon: '💧', key: 'humid', label: 'Humid', unit: '%rh' },
            { icon: '☀️', key: 'light', label: 'Light', unit: '%' },
            { icon: '🧪', key: 'ph', label: 'pH', unit: 'pH' },
            { icon: '💦', key: 'water', label: 'Water', unit: '%' },
            { icon: '🧬', key: 'nutrient', label: 'Nutrient', unit: '%' }
        ];
        this.container.innerHTML = `
            <div style="background: #FFFFFF; border-radius: 24px; padding: 20px 16px; margin: 0 16px 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div style="width: 4px; height: 16px; background: #059669; border-radius: 4px; margin-right: 8px;"></div>
                    <div style="font-size: 1.05rem; font-weight: 700; color: #1A1A1A;">Live Data</div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 10px;">
                    ${items.map(item => this.createGridCard(item, s[item.key])).join('')}
                </div>
            </div>
        `;
        this.container.querySelectorAll('.sensor-click-card').forEach(card => {
            card.addEventListener('click', () => {
                const sk = card.getAttribute('data-key');
                const sl = card.getAttribute('data-label');
                showScreen('sensor-detail', { key: sk, name: sl });
            });
        });
    },
    createGridCard(item, sensorData) {
        let valColor = sensorData.status === 'danger' ? '#DC2626' : (sensorData.status === 'warning' ? '#D97706' : '#059669');
        let currentBg = sensorData.status === 'danger' ? '#FEE2E2' : (sensorData.status === 'warning' ? '#FFFBEB' : '#ECFDF5');
        return `
            <div class="sensor-click-card" data-key="${item.key}" data-label="${item.label}" style="cursor:pointer; background: ${currentBg}; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; min-height: 90px; position: relative; overflow: hidden; transition: all 0.2s ease;">
                <div style="position: absolute; top: -5px; right: -5px; font-size: 36px; opacity: 0.1;">${item.icon}</div>
                <div style="font-size: 14px; opacity: 0.7; margin-bottom: auto;">${item.icon}</div>
                <div style="margin-top: 12px;">
                    <div style="display: flex; align-items: baseline; gap: 2px;">
                        <span style="font-size: 1.15rem; font-weight: 700; color: ${valColor};">${sensorData.val}</span>
                        <span style="font-size: 0.6rem; color: #64748B;">${item.unit}</span>
                    </div>
                    <div style="font-size: 0.6rem; font-weight: 600; color: #9AA5B8; margin-top: 2px;">${item.label}</div>
                </div>
            </div>
        `;
    }
};