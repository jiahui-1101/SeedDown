function savedMode() {
    try {
        return localStorage.getItem('seeddown_mode') || 'beginner';
    } catch {
        return 'beginner';
    }
}

export const AppState = {
    mode: savedMode(),
    packageLevel: localStorage.getItem('seeddown_package') || 'pro',
    currentScreen: 'splash',
    farmName: 'My Farm',
    currentFarmId: null,
    currentFarm: null,     
    tiles: [],
   sensors: {
    temp:     { val: '--', unit: '°C',    status: 'normal' },
    humid:    { val: '--', unit: '%',     status: 'normal' },
    light:    { val: '--', unit: '',      status: 'normal' },
    ph:       { val: '--', unit: 'pH',    status: 'normal' },
    water:    { val: '--', unit: 'cm',    status: 'normal' },
    nutrient: { val: '--', unit: '',      status: 'normal' },
    ec:       { val: '--', unit: 'mS/cm', status: 'normal' },
    co2:      { val: '--', unit: 'ppm',   status: 'normal' },

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
