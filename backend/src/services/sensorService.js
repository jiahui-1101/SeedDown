const {
  SensorReading,
  DeviceCommand,
  UserPreference,
} = require("../models/sensorModel");

const defaultPreferences = {
  sensorIntervalSeconds: 3600,
  soilDryThreshold: 1800,
  gasDangerThreshold: 2500,
  darkThreshold: 1500,
  phMin: 5.5,
  phMax: 6.5,
  wateringDurationSeconds: 10,
};

const memory = {
  readings: [],
  commands: [],
  preferences: new Map(),
};

function isMongoReady() {
  return SensorReading.db.readyState === 1;
}

function numberOrUndefined(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function normalizeReading(body) {
  return {
    deviceId: body.deviceId || "farm_001",
    temperature: numberOrUndefined(body.temperature),
    humidity: numberOrUndefined(body.humidity),
    gasRaw: numberOrUndefined(body.gasRaw),
    soilRaw: numberOrUndefined(body.soilRaw),
    ph: numberOrUndefined(body.ph),
    phRaw: numberOrUndefined(body.phRaw),
    lightRaw: numberOrUndefined(body.lightRaw),
    waterDistanceCm: numberOrUndefined(body.waterDistanceCm),
    intervalSeconds: numberOrUndefined(body.intervalSeconds),
  };
}

async function getPreferences(deviceId = "farm_001") {
  if (!isMongoReady()) {
    return (
      memory.preferences.get(deviceId) || { ...defaultPreferences, deviceId }
    );
  }

  const preferences = await UserPreference.findOne({ deviceId }).lean();
  return { ...defaultPreferences, ...(preferences || {}), deviceId };
}

function analyzeSensorData(reading, preferences) {
  if (
    reading.gasRaw !== undefined &&
    reading.gasRaw > preferences.gasDangerThreshold
  ) {
    return {
      command: "BUZZER_ON",
      reason: "Gas level is above the danger threshold",
      durationSeconds: 0,
    };
  }

  if (
    reading.soilRaw !== undefined &&
    reading.soilRaw < preferences.soilDryThreshold
  ) {
    return {
      command: "WATER_ON",
      reason: "Soil moisture is below the dry threshold",
      durationSeconds: preferences.wateringDurationSeconds,
    };
  }

  if (
    reading.lightRaw !== undefined &&
    reading.lightRaw < preferences.darkThreshold
  ) {
    return {
      command: "LIGHT_ON",
      reason: "Ambient light is below the dark threshold",
      durationSeconds: 0,
    };
  }

  if (
    reading.ph !== undefined &&
    (reading.ph < preferences.phMin || reading.ph > preferences.phMax)
  ) {
    return {
      command: "PH_WARNING",
      reason: "Water pH is outside the preferred range",
      durationSeconds: 0,
    };
  }

  return {
    command: "NO_ACTION",
    reason: "Sensor values are within preferred range",
    durationSeconds: 0,
  };
}

async function saveReadingAndCreateCommand(body) {
  const reading = normalizeReading(body);
  let savedReading;
  if (isMongoReady()) {
    savedReading = await SensorReading.create(reading);
  } else {
    savedReading = {
      ...reading,
      _id: `memory_reading_${Date.now()}`,
      createdAt: new Date(),
    };
    memory.readings.push(savedReading);
  }

  const preferences = await getPreferences(reading.deviceId);
  const decision = analyzeSensorData(reading, preferences);

  const commandPayload = {
    deviceId: reading.deviceId,
    command: decision.command,
    reason: decision.reason,
    durationSeconds: decision.durationSeconds,
  };

  let command;
  if (isMongoReady()) {
    command = await DeviceCommand.create(commandPayload);
  } else {
    command = {
      ...commandPayload,
      _id: `memory_command_${Date.now()}`,
      executed: false,
      createdAt: new Date(),
    };
    memory.commands.push(command);
  }

  return { reading: savedReading, preferences, decision, command };
}

async function getLatestReading(deviceId = "farm_001") {
  if (!isMongoReady()) {
    return (
      [...memory.readings]
        .reverse()
        .find((reading) => reading.deviceId === deviceId) || null
    );
  }

  return SensorReading.findOne({ deviceId }).sort({ createdAt: -1 }).lean();
}

async function getReadings(deviceId = "farm_001", limit = 20) {
  if (!isMongoReady()) {
    const count = Math.min(Number(limit) || 20, 100);
    return memory.readings
      .filter((reading) => reading.deviceId === deviceId)
      .slice(-count)
      .reverse();
  }

  return SensorReading.find({ deviceId })
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 20, 100))
    .lean();
}

async function getPendingCommand(deviceId = "farm_001") {
  if (!isMongoReady()) {
    return (
      [...memory.commands]
        .reverse()
        .find(
          (command) => command.deviceId === deviceId && !command.executed,
        ) || {
        deviceId,
        command: "NO_ACTION",
        reason: "No pending command",
        durationSeconds: 0,
      }
    );
  }

  const command = await DeviceCommand.findOne({ deviceId, executed: false })
    .sort({ createdAt: -1 })
    .lean();

  return (
    command || {
      deviceId,
      command: "NO_ACTION",
      reason: "No pending command",
      durationSeconds: 0,
    }
  );
}

async function markCommandExecuted(commandId, deviceId = "farm_001") {
  if (!commandId) return null;

  if (!isMongoReady()) {
    const command = memory.commands.find(
      (item) => item._id === commandId && item.deviceId === deviceId,
    );
    if (!command) return null;
    command.executed = true;
    command.executedAt = new Date();
    return command;
  }

  return DeviceCommand.findOneAndUpdate(
    { _id: commandId, deviceId },
    { executed: true, executedAt: new Date() },
    { new: true },
  ).lean();
}

async function updatePreferences(deviceId = "farm_001", body = {}) {
  const update = {
    sensorIntervalSeconds:
      numberOrUndefined(body.sensorIntervalSeconds) ??
      defaultPreferences.sensorIntervalSeconds,
    soilDryThreshold:
      numberOrUndefined(body.soilDryThreshold) ??
      defaultPreferences.soilDryThreshold,
    gasDangerThreshold:
      numberOrUndefined(body.gasDangerThreshold) ??
      defaultPreferences.gasDangerThreshold,
    darkThreshold:
      numberOrUndefined(body.darkThreshold) ?? defaultPreferences.darkThreshold,
    phMin: numberOrUndefined(body.phMin) ?? defaultPreferences.phMin,
    phMax: numberOrUndefined(body.phMax) ?? defaultPreferences.phMax,
    wateringDurationSeconds:
      numberOrUndefined(body.wateringDurationSeconds) ??
      defaultPreferences.wateringDurationSeconds,
    updatedAt: new Date(),
  };

  if (!isMongoReady()) {
    const preferences = { ...update, deviceId };
    memory.preferences.set(deviceId, preferences);
    return preferences;
  }

  return UserPreference.findOneAndUpdate(
    { deviceId },
    { $set: update },
    { new: true, upsert: true },
  ).lean();
}

module.exports = {
  saveReadingAndCreateCommand,
  getLatestReading,
  getReadings,
  getPendingCommand,
  markCommandExecuted,
  getPreferences,
  updatePreferences,
};
