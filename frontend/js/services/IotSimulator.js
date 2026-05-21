import { AppState } from '../store.js';
import { toFiniteNumber } from '../utils/sensorReading.js';

export const IotSimulator = {
    interval: null,
    
    start(delayMs = 5000) {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            // 模拟温度波动
            const currentTemp = toFiniteNumber(AppState.sensors.temp?.val) ?? 24;
            const newTemp = Math.min(40, Math.max(18, currentTemp + (Math.random() - 0.5) * 0.4));
            const status = newTemp > 32 ? 'danger' : newTemp > 28 ? 'warning' : 'ok';
            AppState.updateSensors('temp', parseFloat(newTemp.toFixed(1)), status);
            
            // 模拟湿度缓慢变化
            const currentHumid = toFiniteNumber(AppState.sensors.humid?.val) ?? 65;
            const newHumid = Math.min(85, Math.max(45, currentHumid + (Math.random() - 0.5) * 0.8));
            const humidStatus = newHumid < 50 ? 'warning' : newHumid > 80 ? 'danger' : 'ok';
            AppState.updateSensors('humid', Math.floor(newHumid), humidStatus);
            
            // 触发UI更新事件
            window.dispatchEvent(new CustomEvent('sensor-update'));
        }, delayMs);
    },
    
    stop() {
        if (this.interval) clearInterval(this.interval);
    }
};
