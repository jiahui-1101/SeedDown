import { AppState } from '../store.js';

export const SensorStrip = {
    container: null,
    
    init() {
        this.container = document.getElementById('dashStrip');
        if (!this.container) return;
        AppState.subscribe(() => this.render());
        this.render();
    },
    
    render() {
        if (!this.container) return;
        const items = [
            { icon: '🌡️', key: 'temp', label: 'Temp' },
            { icon: '💧', key: 'humid', label: 'Humid' },
            { icon: '☀️', key: 'light', label: 'Light' },
            { icon: '🧪', key: 'ph', label: 'pH' },
            { icon: '🪣', key: 'water', label: 'Water' },
            { icon: '🧬', key: 'nutrient', label: 'Nutri' }
        ];
        this.container.innerHTML = items.map(item => {
            const s = AppState.sensors[item.key];
            const cls = s.status === 'ok' ? 'ok' : s.status === 'warning' ? 'warn' : 'bad';
            return `<div class="sensor-tile ${cls}">
                        <span class="sensor-icon">${item.icon}</span>
                        <span class="sensor-val">${s.val}${s.unit}</span>
                        <span class="sensor-lbl">${item.label}</span>
                    </div>`;
        }).join('');
    }
};