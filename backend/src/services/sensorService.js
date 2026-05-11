const FirestoreModel = require('../models/firestoreModel');
const { getDb } = require('../config/db');

// ── Firestore collections ────────────────────────────────────────────────────

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

// ── Defaults ─────────────────────────────────────────────────────────────────

const defaultPreferences = {
  sensorIntervalSeconds:   3600,
  soilDryThreshold:        1800,
  gasDangerThreshold:      2500,
  darkThreshold:           1500,
  tempMin:                 18,
  tempMax:                 35,
  phMin:                   5.5,
  phMax:                   6.5,
  wateringDurationSeconds: 10,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function numberOrUndefined(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeReading(body) {
  return {
    deviceId:        body.deviceId        || 'farm_001',
    temperature:     numberOrUndefined(body.temperature),
    humidity:        numberOrUndefined(body.humidity),
    gasRaw:          numberOrUndefined(body.gasRaw),
    soilRaw:         numberOrUndefined(body.soilRaw),
    ph:              numberOrUndefined(body.ph),
    phRaw:           numberOrUndefined(body.phRaw),
    lightRaw:        numberOrUndefined(body.lightRaw),
    waterDistanceCm: numberOrUndefined(body.waterDistanceCm),
    intervalSeconds: numberOrUndefined(body.intervalSeconds),
  };
}

// ── Sensor analysis (unchanged logic) ────────────────────────────────────────

function analyzeSensorData(reading, preferences) {
  const commands = [];
  const reasons  = [];
  let durationSeconds = 0;

  const addCommand = (command, reason, duration = 0) => {
    if (!commands.includes(command)) commands.push(command);
    reasons.push(reason);
    durationSeconds = Math.max(durationSeconds, duration);
  };

  if (reading.gasRaw !== undefined && reading.gasRaw > preferences.gasDangerThreshold)
    addCommand('BUZZER_ON', 'Gas level is above the danger threshold');

  if (reading.temperature !== undefined &&
      (reading.temperature < preferences.tempMin || reading.temperature > preferences.tempMax))
    addCommand('BUZZER_ON', `Temperature is outside the preferred range (${preferences.tempMin}-${preferences.tempMax}C)`);

  if (reading.soilRaw !== undefined && reading.soilRaw < preferences.soilDryThreshold)
    addCommand('WATER_ON', 'Soil moisture is below the dry threshold', preferences.wateringDurationSeconds);

  if (reading.lightRaw !== undefined && reading.lightRaw < preferences.darkThreshold)
    addCommand('LIGHT_ON', 'Ambient light is below the dark threshold');

  if (reading.ph !== undefined && (reading.ph < preferences.phMin || reading.ph > preferences.phMax))
    addCommand('PH_WARNING', 'Water pH is outside the preferred range');

  if (commands.length === 0)
    return { command: 'NO_ACTION', reason: 'Sensor values are within preferred range', durationSeconds: 0 };

  return { command: commands.join(','), reason: reasons.join('; '), durationSeconds };
}

// ── Firestore native query helpers ───────────────────────────────────────────
// firestoreModel._all() fetches every doc (fine for commands/preferences).
// For sensorReadings we use the Firestore SDK directly so we can filter
// by createdAt and avoid downloading the entire collection.

async function firestoreQuery(collectionName, deviceId, hoursBack = null, limitCount = 20) {
  const db = getDb();
  let ref = db.collection(collectionName)
               .where('deviceId', '==', deviceId)
               .orderBy('createdAt', 'desc');

  if (hoursBack) {
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    ref = ref.where('createdAt', '>=', since);
  }

  ref = ref.limit(limitCount);
  const snap = await ref.get();
  return snap.docs.map(doc => {
    const d = doc.data();
    // convert Firestore Timestamps → JS Date
    if (d.createdAt?.toDate) d.createdAt = d.createdAt.toDate();
    return { _id: doc.id, id: doc.id, ...d };
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

async function getPreferences(deviceId = 'farm_001') {
  const prefs = await UserPreferenceModel.findOne({ deviceId }).lean();
  return { ...defaultPreferences, ...(prefs || {}), deviceId };
}

async function saveReadingAndCreateCommand(body) {
  const reading = normalizeReading(body);

  // Save to Firestore sensorReadings
  const savedReading = await SensorReadingModel.create(reading);

  const preferences = await getPreferences(reading.deviceId);
  const decision    = analyzeSensorData(reading, preferences);

  const commandPayload = {
    deviceId:        reading.deviceId,
    command:         decision.command,
    reason:          decision.reason,
    durationSeconds: decision.durationSeconds,
  };

  const command = await DeviceCommandModel.create(commandPayload);

  return { reading: savedReading, preferences, decision, command };
}

async function getLatestReading(deviceId = 'farm_001') {
  try {
    const results = await firestoreQuery('sensorReadings', deviceId, null, 1);
    return results[0] || null;
  } catch (err) {
    // Index not ready yet — fetch all and sort in memory
    console.warn('getLatestReading fallback:', err.message);
    const db = getDb();
    const snap = await db.collection('sensorReadings')
      .where('deviceId', '==', deviceId)
      .limit(50)
      .get();
    const docs = snap.docs.map(d => {
      const data = d.data();
      if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate();
      return { _id: d.id, ...data };
    });
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return docs[0] || null;
  }
}

async function getReadings(deviceId = 'farm_001', limit = 20) {
  // limit=168 → last 168 readings (used by weekly-avg)
  // We also cap at 500 to avoid runaway reads
  const cap = Math.min(Number(limit) || 20, 500);
  return firestoreQuery('sensorReadings', deviceId, null, cap);
}

/**
 * Get readings from the last N hours — used for true time-based weekly avg.
 * Falls back to getReadings() if Firestore index isn't set up yet.
 */
async function getReadingsByHours(deviceId = 'farm_001', hours = 168) {
  try {
    // 168 hours = 7 days; cap at 2000 docs
    return await firestoreQuery('sensorReadings', deviceId, hours, 2000);
  } catch (err) {
    // Composite index not created yet → fall back to plain limit query
    console.warn('getReadingsByHours falling back (index missing?):', err.message);
    return getReadings(deviceId, 500);
  }
}

async function getPendingCommand(deviceId = 'farm_001') {
  // Use firestoreModel QueryBuilder (small collection, OK to fetch all)
  const command = await DeviceCommandModel
    .findOne({ deviceId, executed: false })
    .sort({ createdAt: -1 })
    .lean();

  return command || {
    deviceId,
    command:         'NO_ACTION',
    reason:          'No pending command',
    durationSeconds: 0,
  };
}

async function markCommandExecuted(commandId, deviceId = 'farm_001') {
  if (!commandId) return null;
  return DeviceCommandModel.findOneAndUpdate(
    { _id: commandId, deviceId },
    { $set: { executed: true, executedAt: new Date() } },
    { new: true }
  ).lean();
}

async function updatePreferences(deviceId = 'farm_001', body = {}) {
  const update = {
    sensorIntervalSeconds:   numberOrUndefined(body.sensorIntervalSeconds)   ?? defaultPreferences.sensorIntervalSeconds,
    soilDryThreshold:        numberOrUndefined(body.soilDryThreshold)        ?? defaultPreferences.soilDryThreshold,
    gasDangerThreshold:      numberOrUndefined(body.gasDangerThreshold)      ?? defaultPreferences.gasDangerThreshold,
    darkThreshold:           numberOrUndefined(body.darkThreshold)           ?? defaultPreferences.darkThreshold,
    tempMin:                 numberOrUndefined(body.tempMin)                 ?? defaultPreferences.tempMin,
    tempMax:                 numberOrUndefined(body.tempMax)                 ?? defaultPreferences.tempMax,
    phMin:                   numberOrUndefined(body.phMin)                   ?? defaultPreferences.phMin,
    phMax:                   numberOrUndefined(body.phMax)                   ?? defaultPreferences.phMax,
    wateringDurationSeconds: numberOrUndefined(body.wateringDurationSeconds) ?? defaultPreferences.wateringDurationSeconds,
    updatedAt:               new Date(),
  };

  return UserPreferenceModel.findOneAndUpdate(
    { deviceId },
    { $set: update },
    { new: true, upsert: true }
  ).lean();
}

module.exports = {
  saveReadingAndCreateCommand,
  getLatestReading,
  getReadings,
  getReadingsByHours,
  getPendingCommand,
  markCommandExecuted,
  getPreferences,
  updatePreferences,
};