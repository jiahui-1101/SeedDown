const FirestoreModel = require('./firestoreModel');

const SensorReading = new FirestoreModel('sensorReadings', {
  defaults: () => ({
    deviceId: 'farm_001',
    createdAt: new Date()
  })
});

const DeviceCommand = new FirestoreModel('deviceCommands', {
  defaults: () => ({
    deviceId: 'farm_001',
    executed: false,
    createdAt: new Date()
  })
});

const UserPreference = new FirestoreModel('userPreferences', {
  idField: 'deviceId',
  defaults: () => ({
    deviceId: 'farm_001',
    sensorIntervalSeconds: 3600,
    soilDryThreshold: 1800,
    gasDangerThreshold: 2500,
    darkThreshold: 1500,
    tempMin: 18,
    tempMax: 35,
    phMin: 5.5,
    phMax: 6.5,
    wateringDurationSeconds: 10,
    updatedAt: new Date()
  })
});

module.exports = {
  SensorReading,
  DeviceCommand,
  UserPreference
};
