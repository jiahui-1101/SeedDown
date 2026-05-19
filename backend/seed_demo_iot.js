require('dotenv').config();

const { getDb } = require('./src/config/db');

const FARM_ID = 'farm_commercial_demo_001';

const devices = [
  {
    deviceId: 'commercial-farm-master-1',
    serial: 'SD-COM-FRM-03001',
    deviceType: 'commercial',
    packageLevel: 'farm_master',
    nodeType: 'farm_master',
    deviceToken: 'sd_demo_commercial_farm_master_1',
    farmId: FARM_ID,
    fieldId: null,
    zoneId: null,
    label: 'Commercial Farm Master 1',
  },
  {
    deviceId: 'commercial-zone-node-1',
    serial: 'SD-COM-ZON-01001',
    deviceType: 'commercial',
    packageLevel: 'zone_node',
    nodeType: 'zone_node',
    deviceToken: 'sd_demo_commercial_zone_node_1',
    farmId: FARM_ID,
    fieldId: null,
    zoneId: 'zone_A',
    label: 'Commercial Zone Node 1',
  },
  {
    deviceId: 'commercial-zone-node-2',
    serial: 'SD-COM-ZON-01002',
    deviceType: 'commercial',
    packageLevel: 'zone_node',
    nodeType: 'zone_node',
    deviceToken: 'sd_demo_commercial_zone_node_2',
    farmId: FARM_ID,
    fieldId: null,
    zoneId: 'zone_B',
    label: 'Commercial Zone Node 2',
  },
  {
    deviceId: 'commercial-zone-node-3',
    serial: 'SD-COM-ZON-01003',
    deviceType: 'commercial',
    packageLevel: 'zone_node',
    nodeType: 'zone_node',
    deviceToken: 'sd_demo_commercial_zone_node_3',
    farmId: FARM_ID,
    fieldId: null,
    zoneId: 'zone_C',
    label: 'Commercial Zone Node 3',
  },
  {
    deviceId: 'beginner_starter',
    serial: 'SD-BGN-STR-00123',
    deviceType: 'beginner',
    packageLevel: 'starter',
    nodeType: 'starter',
    deviceToken: 'sd_demo_beginner_starter',
    farmId: 'farm_beginner_demo_001',
    fieldId: 'field_beginner_starter',
    zoneId: null,
    label: 'Beginner Starter',
  },
  {
    deviceId: 'beginner_standard',
    serial: 'SD-BGN-STD-00456',
    deviceType: 'beginner',
    packageLevel: 'standard',
    nodeType: 'standard',
    deviceToken: 'sd_demo_beginner_standard',
    farmId: 'farm_beginner_demo_001',
    fieldId: 'field_beginner_standard',
    zoneId: null,
    label: 'Beginner Standard',
  },
  {
    deviceId: 'beginner_pro',
    serial: 'SD-BGN-PRO-00789',
    deviceType: 'beginner',
    packageLevel: 'pro',
    nodeType: 'pro',
    deviceToken: 'sd_demo_beginner_pro',
    farmId: 'farm_beginner_demo_001',
    fieldId: 'field_beginner_pro',
    zoneId: null,
    label: 'Beginner Pro',
  },
];

const baseThresholds = {
  sensorIntervalSeconds: 5,
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
  wateringDurationSeconds: 10,
  fanDurationSeconds: 10,
  thresholdSource: 'demo_seed',
};

function readingFor(device, offsetMinutes = 0) {
  const createdAt = new Date(Date.now() - offsetMinutes * 60 * 1000);
  const common = {
    deviceId: device.deviceId,
    farmId: device.farmId,
    fieldId: device.fieldId,
    zoneId: device.zoneId,
    packageLevel: device.packageLevel,
    createdAt,
    intervalSeconds: 5,
  };

  if (device.packageLevel === 'farm_master') {
    return {
      ...common,
      gasRaw: 920 + offsetMinutes * 8,
      waterDistanceCm: 12 + offsetMinutes * 0.2,
      co2Raw: 650,
      co2Ppm: 940 - offsetMinutes * 6,
      energyKwh: 3.4 + offsetMinutes * 0.03,
    };
  }

  const zoneShift = device.zoneId === 'zone_B' ? 2 : device.zoneId === 'zone_C' ? -1 : 0;
  return {
    ...common,
    temperature: 24 + zoneShift + offsetMinutes * 0.12,
    humidity: 62 - zoneShift - offsetMinutes * 0.2,
    gasRaw: 980 + offsetMinutes * 14,
    soilRaw: 2200 - offsetMinutes * 35,
    ph: 6.1 + zoneShift * 0.08,
    phRaw: 1760 + zoneShift * 25,
    lightRaw: 2100 - offsetMinutes * 20,
    waterDistanceCm: 10 + offsetMinutes * 0.25,
    ecRaw: 1320 + zoneShift * 45,
    ec: 1.55 + zoneShift * 0.12,
    co2Raw: 720 + zoneShift * 20,
    co2Ppm: 930 + zoneShift * 35,
  };
}

function commandFor(device) {
  if (device.deviceId === 'commercial-zone-node-2') {
    return {
      command: 'WATER_ON',
      reason: 'Demo seed: Zone B soil moisture is approaching the dry threshold',
      durationSeconds: 10,
    };
  }
  if (device.deviceId === 'commercial-farm-master-1') {
    return {
      command: 'NO_ACTION',
      reason: 'Demo seed: farm-level gas, CO2, water reservoir and power readings are stable',
      durationSeconds: 0,
    };
  }
  return {
    command: 'NO_ACTION',
    reason: 'Demo seed: sensor values are within preferred range',
    durationSeconds: 0,
  };
}

async function seed() {
  const db = getDb();
  const batch = db.batch();
  const now = new Date();

  devices.forEach((device) => {
    const deviceRef = db.collection('devices').doc(device.deviceId);
    batch.set(deviceRef, {
      ...device,
      isOnline: true,
      status: 'assigned',
      lastSeen: now,
      createdAt: now,
      updatedAt: now,
      firmwareVersion: 'demo-seed-1.0.0',
    }, { merge: true });

    const prefRef = db.collection('userPreferences').doc(device.deviceId);
    batch.set(prefRef, {
      ...baseThresholds,
      deviceId: device.deviceId,
      farmId: device.farmId,
      fieldId: device.fieldId,
      zoneId: device.zoneId,
      packageLevel: device.packageLevel,
      goalPriority: device.deviceType === 'commercial'
        ? ['maximum_yield', 'resource_efficiency']
        : ['beginner_safe', 'eco_save'],
      thresholdNotes: device.deviceType === 'commercial'
        ? 'Demo commercial thresholds for farm master / zone-node digital twin testing.'
        : 'Demo beginner thresholds for Wokwi package testing.',
      updatedAt: now,
    }, { merge: true });

    for (let i = 0; i < 6; i += 1) {
      const reading = readingFor(device, i);
      const readingRef = db.collection('sensorReadings').doc(`${device.deviceId}_demo_${i}`);
      batch.set(readingRef, reading, { merge: true });
    }

    const action = commandFor(device);
    const commandRef = db.collection('deviceCommands').doc(`${device.deviceId}_demo_command`);
    batch.set(commandRef, {
      deviceId: device.deviceId,
      farmId: device.farmId,
      fieldId: device.fieldId,
      zoneId: device.zoneId,
      packageLevel: device.packageLevel,
      command: action.command,
      reason: action.reason,
      durationSeconds: action.durationSeconds,
      source: 'demo_seed',
      executed: true,
      createdAt: now,
      executedAt: now,
    }, { merge: true });
  });

  await batch.commit();
  console.log(`Seeded ${devices.length} SeedDown demo devices and sample readings.`);
  devices.forEach((device) => {
    console.log(`${device.deviceId} -> token ${device.deviceToken}`);
  });
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Demo IoT seed failed:', error);
    process.exit(1);
  });
