export const AppState = {
    mode: 'beginner',
    currentScreen: 'splash',
    farmName: 'My Farm',
    currentFarmId: null,
    tiles: [],
    sensors: {
        temp: { val: 34.2, unit: '°C', status: 'danger' },
        humid: { val: 68, unit: '%', status: 'ok' },
        light: { val: 82, unit: '%', status: 'ok' },
        ph: { val: 6.2, unit: 'pH', status: 'ok' },
        water: { val: 22, unit: '%', status: 'warning' },
        nutrient: { val: 78, unit: '%', status: 'ok' }
    },
    addPlant: { selectedCropIndex: null, selectedTileId: null },
    visitTarget: null,
    chatMessages: [],
    listeners: new Set(),

    subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
    notify() { this.listeners.forEach(fn => fn(this)); },
    
    updateSensors(key, value, status) {
        if (this.sensors[key]) {
            this.sensors[key] = { ...this.sensors[key], val: value, status };
            this.notify();
        }
    }
};

export function initTiles() {
    return Array(12).fill().map((_, i) => ({
        id: i,
        plant: i < 6 ? ['🥬','🌿','🌱','🍅','🌿','🌶️'][i] : null,
        name: i < 6 ? ['Lettuce','Spinach','Basil','Tomato','Mint','Chili'][i] : null,
        status: i === 1 ? 'warning' : i === 3 ? 'danger' : i < 6 ? 'healthy' : 'empty',
        growth: [78,55,100,40,62,33,0,0,0,0,0,0][i],
        days: [7,12,0,20,9,18,0,0,0,0,0,0][i]
    }));
}