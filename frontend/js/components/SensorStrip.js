import { AppState } from '../store.js';

export const SensorStrip = {
    container: null,
    
    init() {
        this.container = document.getElementById('dashStrip');
        if (!this.container) return;
        
     
        this.container.className = ''; 
        this.container.style.display = 'block';
        this.container.style.width = '100%';
        this.container.style.boxSizing = 'border-box';

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
    },

    createGridCard(item, sensorData) {
        let currentBg = '#ECFDF5';       
        let valColor = '#059669';         
        let borderStr = 'border: 1px solid #A7F3D0;'; 


        if (sensorData.status === 'danger') {
            currentBg = '#FEE2E2';        
            valColor = '#DC2626';         
            borderStr = 'border: 1px solid #FCA5A5;';
        } else if (sensorData.status === 'warning') {
            currentBg = '#FFFBEB';    
            valColor = '#D97706';        
            borderStr = 'border: 1px solid #FDE68A;';
        }

        return `
            <div style="background: ${currentBg}; ${borderStr} border-radius: 12px; padding: 12px; display: flex; flex-direction: column; min-height: 90px; position: relative; overflow: hidden; transition: all 0.3s ease;">
                
                <div style="position: absolute; top: -5px; right: -5px; font-size: 36px; opacity: 0.1;">
                    ${item.icon}
                </div>

                <div style="font-size: 14px; opacity: 0.7; margin-bottom: auto;">
                    ${item.icon}
                </div>

                <div style="margin-top: 12px;">
                    <div style="display: flex; align-items: baseline; gap: 2px; white-space: nowrap;">
                        <span style="font-size: 1.15rem; font-weight: 700; color: ${valColor};">${sensorData.val}</span>
                        <span style="font-size: 0.6rem; color: #64748B;">${item.unit}</span>
                    </div>
                    <div style="font-size: 0.6rem; font-weight: 600; color: #9AA5B8; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${item.label}
                    </div>
                </div>
            </div>
        `;
    }
};