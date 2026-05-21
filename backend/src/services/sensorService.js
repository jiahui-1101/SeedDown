const FirestoreModel = require('../models/firestoreModel');
const { getDb } = require('../config/db');
const deviceService = require('./deviceService');

// Firestore collections
const SensorReadingModel = new FirestoreModel('sensorReadings', {
  defaults: (data) => ({
    createdAt: new Date(),
    deviceId: 'farm_001',
    ...data,
  }),
});

const DeviceCommandModel = new FirestoreModel('deviceCommands', {
  defaults: (data) => ({
    createdAt: new Date(),
    executed: false,
    ...data,
  }),
});

const UserPreferenceModel = new FirestoreModel('userPreferences', {
  idField: 'deviceId',
});

const defaultPreferences = {
  sensorIntervalSeconds: 3600,
  soilDryThreshold: 1800,
  gasDangerThreshold: 3000,
  darkThreshold: 1500,
  tempMin: 18,
  tempMax: 35,
  humidityMin: 35,
  humidityMax: 80,
  phMin: 5.5,
  phMax: 6.8,
  ecMin: 1.2,
  ecMax: 2.0,
  co2MinPpm: 800,
  co2MaxPpm: 1500,
  waterLowCm: 20,
  waterCriticalCm: 35,
  energyDailyLimitKwh: 10,
  wateringDurationSeconds: 10,
  fanDurationSeconds: 10,
  mainFanDurationSeconds: 20,
  emergencyBuzzerSeconds: 10,
  waterFlowMinLpm: 0.5,
  growLightDurationSeconds: 30,
  zoneFanDurationSeconds: 15,
  activeBuzzerSeconds: 5,
  cameraScanIntervalMinutes: 60,
  diseaseConfidenceMin: 70,
  packageLevel: 'standard',
  goalPriority: ['beginner_safe'],
  farmId: null,
  fieldId: null,
  zoneId: null,
  thresholdSource: 'default',
  thresholdNotes: '',
};

const allowedCommands = new Set([
  'NO_ACTION',
  'WATER_ON',
  'LIGHT_ON',
  'FAN_ON',
  'BUZZER_ON',
  'PH_WARNING',
  'FERT_ALERT',
  'CO2_LOW',
  'GAS_ALERT',
]);

function numberOrUndefined(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeGoalPriority(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).slice(0, 3);
  if (typeof value === 'string') return value.split(',').map(item => item.trim()).filter(Boolean).slice(0, 3);
  return defaultPreferences.goalPriority;
}

function normalizeReading(body = {}, deviceContext = {}) {
  const assignedZone = deviceContext.active === false || deviceContext.status === 'replaced'
    ? null
    : (deviceContext.targetId && deviceContext.targetId !== 'farm_master' ? deviceContext.targetId : deviceContext.zoneId);
  return {
    deviceId: body.deviceId || deviceContext.deviceId || 'farm_001',
    farmId: deviceContext.farmId || body.farmId || null,
    fieldId: deviceContext.fieldId || body.fieldId || null,
    zoneId: assignedZone || body.zoneId || null,
    packageLevel: body.packageLevel || deviceContext.packageLevel || null,
    temperature: numberOrUndefined(body.temperature ?? body.temp),
    humidity: numberOrUndefined(body.humidity ?? body.humid ?? body.hum),
    gasRaw: numberOrUndefined(body.gasRaw),
    soilRaw: numberOrUndefined(body.soilRaw),
    ph: numberOrUndefined(body.ph),
    phRaw: numberOrUndefined(body.phRaw),
    lightRaw: numberOrUndefined(body.lightRaw),
    waterDistanceCm: numberOrUndefined(body.waterDistanceCm),
    waterFlowRaw: numberOrUndefined(body.waterFlowRaw),
    waterFlowLpm: numberOrUndefined(body.waterFlowLpm),
    ecRaw: numberOrUndefined(body.ecRaw),
    ec: numberOrUndefined(body.ec),
    co2Raw: numberOrUndefined(body.co2Raw),
    co2Ppm: numberOrUndefined(body.co2Ppm),
    energyKwh: numberOrUndefined(body.energyKwh ?? body.powerKwh),
    intervalSeconds: numberOrUndefined(body.intervalSeconds),
  };
}

async function resolveDeviceContext({ token, bodyDeviceId } = {}) {
  if (!token) return { deviceId: bodyDeviceId || 'farm_001', isLegacyDemo: true };

  const device = await deviceService.getDeviceByTokenOrThrow(token);
  if (bodyDeviceId && bodyDeviceId !== device.deviceId) {
    throw new Error('Device token does not match payload deviceId');
  }

  return {
    ...device,
    isLegacyDemo: false,
  };
}

function analyzeSensorData(reading, preferences) {
  const commands = [];
  const reasons = [];
  let durationSeconds = 0;

  const addCommand = (command, reason, duration = 0) => {
    if (!commands.includes(command)) commands.push(command);
    if (reason) reasons.push(reason);
    durationSeconds = Math.max(durationSeconds, duration || 0);
  };

  if (reading.gasRaw !== undefined && reading.gasRaw > preferences.gasDangerThreshold) {
    addCommand('GAS_ALERT', 'Gas level is above the danger threshold');
    addCommand('BUZZER_ON', 'Emergency buzzer triggered for dangerous gas');
    addCommand('FAN_ON', 'Ventilation fan should activate for gas safety', preferences.fanDurationSeconds);
  }

  if (reading.temperature !== undefined && reading.temperature < preferences.tempMin) {
    addCommand('BUZZER_ON', `Temperature is below the preferred range (${preferences.tempMin}-${preferences.tempMax}C)`);
  }

  if (reading.temperature !== undefined && reading.temperature > preferences.tempMax) {
    addCommand('FAN_ON', `Temperature is above the preferred range (${preferences.tempMin}-${preferences.tempMax}C)`, preferences.fanDurationSeconds);
    addCommand('BUZZER_ON', 'Temperature safety alert triggered');
  }

  if (reading.humidity !== undefined && reading.humidity < preferences.humidityMin) {
    addCommand('WATER_ON', `Humidity is below the preferred range (${preferences.humidityMin}-${preferences.humidityMax}%)`, preferences.wateringDurationSeconds);
  }

  if (reading.humidity !== undefined && reading.humidity > preferences.humidityMax) {
    addCommand('FAN_ON', `Humidity is above the preferred range (${preferences.humidityMin}-${preferences.humidityMax}%)`, preferences.fanDurationSeconds);
  }

  if (reading.soilRaw !== undefined && reading.soilRaw < preferences.soilDryThreshold) {
    addCommand('WATER_ON', 'Soil moisture is below the dry threshold', preferences.wateringDurationSeconds);
  }

  if (reading.lightRaw !== undefined && reading.lightRaw < preferences.darkThreshold) {
    addCommand('LIGHT_ON', 'Ambient light is below the dark threshold');
  }

  if (reading.ph !== undefined && (reading.ph < preferences.phMin || reading.ph > preferences.phMax)) {
    addCommand('PH_WARNING', 'Water pH is outside the preferred range');
  }

  if (reading.ec !== undefined && (reading.ec < preferences.ecMin || reading.ec > preferences.ecMax)) {
    addCommand('FERT_ALERT', 'EC nutrient level is outside the preferred range');
  }

  if (reading.co2Ppm !== undefined && reading.co2Ppm < preferences.co2MinPpm) {
    addCommand('CO2_LOW', 'CO2 level is below the preferred range');
  }

  if (reading.waterDistanceCm !== undefined && reading.waterDistanceCm > preferences.waterLowCm) {
    addCommand('BUZZER_ON', 'Water reservoir level is low');
  }

  if (reading.waterFlowLpm !== undefined && reading.waterFlowLpm < preferences.waterFlowMinLpm) {
    addCommand('WATER_ON', 'Water flow is below the minimum irrigation flow threshold', preferences.wateringDurationSeconds);
  }

  if (!commands.length) {
    return { command: 'NO_ACTION', reason: 'Sensor values are within preferred range', durationSeconds: 0 };
  }

  return { command: commands.join(','), reason: reasons.join('; '), durationSeconds };
}

function buildReadingFilters(input = {}) {
  return ['deviceId', 'fieldId', 'zoneId', 'farmId']
    .reduce((filters, key) => {
      if (input[key]) filters[key] = input[key];
      return filters;
    }, {});
}

async function firestoreQuery(collectionName, filters = {}, hoursBack = null, limitCount = 20) {
  const db = getDb();
  let ref = db.collection(collectionName);

  Object.entries(buildReadingFilters(filters)).forEach(([key, value]) => {
    ref = ref.where(key, '==', value);
  });

  if (hoursBack) {
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    ref = ref.where('createdAt', '>=', since);
  }

  ref = ref.orderBy('createdAt', 'desc').limit(limitCount);
  const snap = await ref.get();
  return snap.docs.map(doc => {
    const d = doc.data();
    if (d.createdAt?.toDate) d.createdAt = d.createdAt.toDate();
    return { _id: doc.id, id: doc.id, ...d };
  });
}

async function fallbackReadingQuery(filters = {}, limitCount = 50) {
  const db = getDb();
  let ref = db.collection('sensorReadings');
  Object.entries(buildReadingFilters(filters)).forEach(([key, value]) => {
    ref = ref.where(key, '==', value);
  });
  const snap = await ref.limit(limitCount).get();
  const docs = snap.docs.map(doc => {
    const data = doc.data();
    if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate();
    return { _id: doc.id, id: doc.id, ...data };
  });
  docs.sort((a, b) => {
    const tDiff = new Date(b.createdAt) - new Date(a.createdAt);
    if (tDiff !== 0) return tDiff;
    const numA = parseInt((a.id || '').replace(/\D/g, '')) || 0;
    const numB = parseInt((b.id || '').replace(/\D/g, '')) || 0;
    return numA - numB;
});
return docs.slice(0, limitCount);
}

async function getPreferences(deviceId = 'farm_001') {
  const prefs = await UserPreferenceModel.findOne({ deviceId }).lean();
  return { ...defaultPreferences, ...(prefs || {}), deviceId };
}

async function saveReadingAndCreateCommand(body = {}, options = {}) {
  const deviceContext = await resolveDeviceContext({ token: options.deviceToken, bodyDeviceId: body.deviceId });
  const reading = normalizeReading(body, deviceContext);
  const savedReading = await SensorReadingModel.create(reading);

  const preferences = await getPreferences(reading.deviceId);
  const decision = analyzeSensorData(reading, preferences);

  const commandPayload = {
    deviceId: reading.deviceId,
    farmId: reading.farmId,
    fieldId: reading.fieldId,
    zoneId: reading.zoneId,
    packageLevel: reading.packageLevel,
    readingId: savedReading._id || savedReading.id || null,
    command: decision.command,
    reason: decision.reason,
    durationSeconds: decision.durationSeconds,
    source: 'auto',
  };

  const command = await DeviceCommandModel.create(commandPayload);

  if (!deviceContext.isLegacyDemo && deviceContext.deviceId) {
    await deviceService.heartbeat(deviceContext.deviceId, {
      lastReadingAt: savedReading.createdAt,
      farmId: reading.farmId,
      fieldId: reading.fieldId,
      zoneId: reading.zoneId,
      packageLevel: reading.packageLevel,
    });
  }

  return { reading: savedReading, preferences, decision, command, device: deviceContext };
}

async function getLatestReading(filters = 'farm_001') {
  const queryFilters = typeof filters === 'string' ? { deviceId: filters } : buildReadingFilters(filters);
  if (!Object.keys(queryFilters).length) queryFilters.deviceId = 'farm_001';

  try {
    const results = await firestoreQuery('sensorReadings', queryFilters, null, 1);
    return results[0] || null;
  } catch (err) {
    console.warn('getLatestReading fallback:', err.message);
    const results = await fallbackReadingQuery(queryFilters, 50);
    return results[0] || null;
  }
}

async function getReadings(filters = 'farm_001', limit = 20) {
  const queryFilters = typeof filters === 'string' ? { deviceId: filters } : buildReadingFilters(filters);
  if (!Object.keys(queryFilters).length) queryFilters.deviceId = 'farm_001';
  const cap = Math.min(Number(limit) || 20, 500);
  try {
    return await firestoreQuery('sensorReadings', queryFilters, null, cap);
  } catch (err) {
    console.warn('getReadings fallback:', err.message);
    return fallbackReadingQuery(queryFilters, cap);
  }
}

async function getReadingsByHours(filters = 'farm_001', hours = 168) {
  const queryFilters = typeof filters === 'string' ? { deviceId: filters } : buildReadingFilters(filters);
  try {
    return await firestoreQuery('sensorReadings', queryFilters, hours, 2000);
  } catch (err) {
    console.warn('getReadingsByHours falling back (index missing?):', err.message);
    return getReadings(queryFilters, 500);
  }
}

async function deviceIdFromTokenOrFallback(token, fallbackDeviceId = 'farm_001') {
  if (!token) return fallbackDeviceId || 'farm_001';
  const device = await deviceService.getDeviceByTokenOrThrow(token);
  return device.deviceId;
}

async function getPendingCommand(deviceId = 'farm_001') {
  const command = await DeviceCommandModel
    .findOne({ deviceId, executed: false })
    .sort({ createdAt: -1 })
    .lean();

  return command || {
    deviceId,
    command: 'NO_ACTION',
    reason: 'No pending command',
    durationSeconds: 0,
  };
}

async function getPendingCommandForRequest({ token, deviceId } = {}) {
  const resolvedDeviceId = await deviceIdFromTokenOrFallback(token, deviceId || 'farm_001');
  return getPendingCommand(resolvedDeviceId);
}

async function markCommandExecuted(commandId, deviceId = 'farm_001') {
  if (!commandId) return null;
  return DeviceCommandModel.findOneAndUpdate(
    { _id: commandId, deviceId },
    { $set: { executed: true, executedAt: new Date() } },
    { new: true }
  ).lean();
}

async function createManualCommand(body = {}) {
  const deviceId = body.deviceId || 'farm_001';
  const commands = String(body.command || '')
    .split(',')
    .map(command => command.trim().toUpperCase())
    .filter(Boolean);

  if (!commands.length) throw new Error('Unsupported command: empty');
  commands.forEach(command => {
    if (!allowedCommands.has(command)) throw new Error(`Unsupported command: ${command}`);
  });

  return DeviceCommandModel.create({
    deviceId,
    farmId: body.farmId || null,
    fieldId: body.fieldId || null,
    zoneId: body.zoneId || null,
    command: commands.join(','),
    reason: body.reason || 'Manual command from dashboard',
    durationSeconds: numberOrUndefined(body.durationSeconds) || 0,
    source: 'manual',
  });
}

async function updatePreferences(deviceId = 'farm_001', body = {}) {
  const current = await getPreferences(deviceId);
  const update = {
    sensorIntervalSeconds: numberOrUndefined(body.sensorIntervalSeconds) ?? current.sensorIntervalSeconds,
    soilDryThreshold: numberOrUndefined(body.soilDryThreshold) ?? current.soilDryThreshold,
    gasDangerThreshold: numberOrUndefined(body.gasDangerThreshold) ?? current.gasDangerThreshold,
    darkThreshold: numberOrUndefined(body.darkThreshold) ?? current.darkThreshold,
    tempMin: numberOrUndefined(body.tempMin) ?? current.tempMin,
    tempMax: numberOrUndefined(body.tempMax) ?? current.tempMax,
    humidityMin: numberOrUndefined(body.humidityMin) ?? current.humidityMin,
    humidityMax: numberOrUndefined(body.humidityMax) ?? current.humidityMax,
    phMin: numberOrUndefined(body.phMin) ?? current.phMin,
    phMax: numberOrUndefined(body.phMax) ?? current.phMax,
    ecMin: numberOrUndefined(body.ecMin) ?? current.ecMin,
    ecMax: numberOrUndefined(body.ecMax) ?? current.ecMax,
    co2MinPpm: numberOrUndefined(body.co2MinPpm) ?? current.co2MinPpm,
    co2MaxPpm: numberOrUndefined(body.co2MaxPpm) ?? current.co2MaxPpm,
    waterLowCm: numberOrUndefined(body.waterLowCm) ?? current.waterLowCm,
    waterCriticalCm: numberOrUndefined(body.waterCriticalCm) ?? current.waterCriticalCm,
    energyDailyLimitKwh: numberOrUndefined(body.energyDailyLimitKwh) ?? current.energyDailyLimitKwh,
    wateringDurationSeconds: numberOrUndefined(body.wateringDurationSeconds) ?? current.wateringDurationSeconds,
    fanDurationSeconds: numberOrUndefined(body.fanDurationSeconds) ?? current.fanDurationSeconds,
    mainFanDurationSeconds: numberOrUndefined(body.mainFanDurationSeconds) ?? current.mainFanDurationSeconds,
    emergencyBuzzerSeconds: numberOrUndefined(body.emergencyBuzzerSeconds) ?? current.emergencyBuzzerSeconds,
    waterFlowMinLpm: numberOrUndefined(body.waterFlowMinLpm) ?? current.waterFlowMinLpm,
    growLightDurationSeconds: numberOrUndefined(body.growLightDurationSeconds) ?? current.growLightDurationSeconds,
    zoneFanDurationSeconds: numberOrUndefined(body.zoneFanDurationSeconds) ?? current.zoneFanDurationSeconds,
    activeBuzzerSeconds: numberOrUndefined(body.activeBuzzerSeconds) ?? current.activeBuzzerSeconds,
    cameraScanIntervalMinutes: numberOrUndefined(body.cameraScanIntervalMinutes) ?? current.cameraScanIntervalMinutes,
    diseaseConfidenceMin: numberOrUndefined(body.diseaseConfidenceMin) ?? current.diseaseConfidenceMin,
    packageLevel: body.packageLevel || current.packageLevel,
    goalPriority: normalizeGoalPriority(body.goalPriority || body.goal_priority || current.goalPriority),
    farmId: body.farmId ?? current.farmId ?? null,
    fieldId: body.fieldId ?? current.fieldId ?? null,
    zoneId: body.zoneId ?? current.zoneId ?? null,
    thresholdSource: body.thresholdSource || current.thresholdSource || 'manual',
    thresholdNotes: body.thresholdNotes || current.thresholdNotes || '',
    updatedAt: new Date(),
  };

  return UserPreferenceModel.findOneAndUpdate(
    { deviceId },
    { $set: update },
    { new: true, upsert: true }
  ).lean();
}

module.exports = {
  defaultPreferences,
  allowedCommands,
  saveReadingAndCreateCommand,
  getLatestReading,
  getReadings,
  getReadingsByHours,
  getPendingCommand,
  getPendingCommandForRequest,
  markCommandExecuted,
  createManualCommand,
  getPreferences,
  updatePreferences,
  deviceIdFromTokenOrFallback,
};
