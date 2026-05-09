const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, index: true, default: 'farm_001' },
  temperature: Number,
  humidity: Number,
  gasRaw: Number,
  soilRaw: Number,
  ph: Number,
  phRaw: Number,
  lightRaw: Number,
  waterDistanceCm: Number,
  intervalSeconds: Number,
  createdAt: { type: Date, default: Date.now, index: true }
});

const deviceCommandSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, index: true, default: 'farm_001' },
  command: {
    type: String,
    enum: ['WATER_ON', 'LIGHT_ON', 'BUZZER_ON', 'PH_WARNING', 'NO_ACTION'],
    required: true
  },
  reason: String,
  durationSeconds: { type: Number, default: 0 },
  executed: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
  executedAt: Date
});

const userPreferenceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true, index: true, default: 'farm_001' },
  sensorIntervalSeconds: { type: Number, default: 3600 },
  soilDryThreshold: { type: Number, default: 1800 },
  gasDangerThreshold: { type: Number, default: 2500 },
  darkThreshold: { type: Number, default: 1500 },
  phMin: { type: Number, default: 5.5 },
  phMax: { type: Number, default: 6.5 },
  wateringDurationSeconds: { type: Number, default: 10 },
  updatedAt: { type: Date, default: Date.now }
});

const SensorReading = mongoose.model('SensorReading', sensorReadingSchema);
const DeviceCommand = mongoose.model('DeviceCommand', deviceCommandSchema);
const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

module.exports = {
  SensorReading,
  DeviceCommand,
  UserPreference
};