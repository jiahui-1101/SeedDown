export const CROP_LIST = [
    { id: 'lettuce', name: 'Lettuce', daysToHarvest: 7, waterPerDay: 0.5, energyPerDay: 0.2 },
    { id: 'basil', name: 'Basil', daysToHarvest: 10, waterPerDay: 0.6, energyPerDay: 0.25 }
];

export const SENSOR_THRESHOLDS = {
    temp: { min: 18, max: 28, criticalMax: 32 },
    humid: { min: 50, max: 80, criticalMin: 40 }
};