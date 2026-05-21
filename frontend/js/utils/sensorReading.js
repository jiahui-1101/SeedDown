export const SENSOR_ALIASES = {
    temperature: ['temperature', 'temp'],
    humidity: ['humidity', 'humid', 'hum'],
    lightRaw: ['lightRaw', 'light_raw', 'light', 'lux'],
    soilRaw: ['soilRaw', 'soil_raw', 'soilMoistureRaw'],
    ph: ['ph', 'pH'],
    waterDistanceCm: ['waterDistanceCm', 'water_distance_cm', 'waterLevel', 'water'],
    gasRaw: ['gasRaw', 'gas_raw', 'gasValue', 'gas'],
    ec: ['ec', 'nutrientEc'],
    co2Ppm: ['co2Ppm', 'co2_ppm', 'co2'],
    waterFlowLpm: ['waterFlowLpm', 'water_flow_lpm', 'flow'],
    energyKwh: ['energyKwh', 'energyKWh', 'powerKwh', 'powerKWh'],
};

export function toFiniteNumber(value) {
    const raw = value && typeof value === 'object' && 'val' in value ? value.val : value;
    if (raw === undefined || raw === null) return null;
    if (typeof raw === 'string' && raw.trim() === '') return null;
    const numeric = Number(raw);
    return Number.isFinite(numeric) ? numeric : null;
}

export function readMetric(reading = {}, aliases = []) {
    const keys = Array.isArray(aliases) ? aliases : [aliases];
    for (const key of keys) {
        if (!key) continue;
        const value = toFiniteNumber(reading[key]);
        if (value !== null) return value;
    }
    return null;
}

export function normalizeSensorReading(reading = {}) {
    const source = reading || {};
    return {
        ...source,
        temperature: readMetric(source, SENSOR_ALIASES.temperature),
        humidity: readMetric(source, SENSOR_ALIASES.humidity),
        lightRaw: readMetric(source, SENSOR_ALIASES.lightRaw),
        soilRaw: readMetric(source, SENSOR_ALIASES.soilRaw),
        ph: readMetric(source, SENSOR_ALIASES.ph),
        waterDistanceCm: readMetric(source, SENSOR_ALIASES.waterDistanceCm),
        gasRaw: readMetric(source, SENSOR_ALIASES.gasRaw),
        ec: readMetric(source, SENSOR_ALIASES.ec),
        co2Ppm: readMetric(source, SENSOR_ALIASES.co2Ppm),
        waterFlowLpm: readMetric(source, SENSOR_ALIASES.waterFlowLpm),
        energyKwh: readMetric(source, SENSOR_ALIASES.energyKwh),
    };
}

export function hasRealSensorData(reading = {}) {
    const normalized = normalizeSensorReading(reading);
    return Object.keys(SENSOR_ALIASES).some(key => normalized[key] !== null);
}

export function formatMetric(value, unit = '', decimals = 0) {
    const numeric = toFiniteNumber(value);
    if (numeric === null) return '--';
    const places = Number.isInteger(decimals) ? Math.max(0, decimals) : 0;
    const rounded = places ? numeric.toFixed(places) : Math.round(numeric).toString();
    const clean = rounded.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
    return `${clean}${unit}`;
}

export function sensorStatusRange(value, min, max) {
    const numeric = toFiniteNumber(value);
    if (numeric === null) return 'normal';
    if (numeric < min || numeric > max) return 'warning';
    return 'normal';
}
