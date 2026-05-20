const crypto = require('crypto');
const FirestoreModel = require('../models/firestoreModel');

const DeviceModel = new FirestoreModel('devices', {
  idField: 'deviceId',
  defaults: data => ({
    createdAt: new Date(),
    updatedAt: new Date(),
    isOnline: false,
    ...data,
  }),
});

const SERIAL_RULES = [
  { prefix: 'SD-BGN-STR', deviceType: 'beginner', packageLevel: 'starter', accountTypes: ['beginner', 'beginner_starter'] },
  { prefix: 'SD-BGN-STD', deviceType: 'beginner', packageLevel: 'standard', accountTypes: ['beginner', 'beginner_standard'] },
  { prefix: 'SD-BGN-PRO', deviceType: 'beginner', packageLevel: 'pro', accountTypes: ['beginner', 'beginner_pro'] },
  { prefix: 'SD-COM-FRM', deviceType: 'commercial', packageLevel: 'farm_master', accountTypes: ['commercial', 'commercial_master', 'commercial_farm_master'] },
  { prefix: 'SD-COM-FZK', deviceType: 'commercial', packageLevel: 'farm_zone', accountTypes: ['commercial', 'commercial_farm_zone'] },
  { prefix: 'SD-COM-ZON', deviceType: 'commercial', packageLevel: 'zone_node', accountTypes: ['commercial', 'commercial_zone'] },
  { prefix: 'SD-COM-ZNB', deviceType: 'commercial', packageLevel: 'zone_basic', accountTypes: ['commercial', 'commercial_zone_basic'] },
  { prefix: 'SD-COM-ZNP', deviceType: 'commercial', packageLevel: 'zone_pro', accountTypes: ['commercial', 'commercial_zone_pro'] },
  { prefix: 'SD-COM-MST', deviceType: 'commercial', packageLevel: 'farm_master', accountTypes: ['commercial', 'commercial_master'] },
];

const DEMO_DEVICE_BY_SERIAL = {
  'SD-BGN-STR-00123': { deviceId: 'beginner_starter', deviceToken: 'sd_demo_beginner_starter', fieldId: 'field_beginner_starter' },
  'SD-BGN-STD-00456': { deviceId: 'beginner_standard', deviceToken: 'sd_demo_beginner_standard', fieldId: 'field_beginner_standard' },
  'SD-BGN-PRO-00789': { deviceId: 'beginner_pro', deviceToken: 'sd_demo_beginner_pro', fieldId: 'field_beginner_pro' },
  'SD-COM-FRM-03001': { deviceId: 'commercial-farm-master-1', deviceToken: 'sd_demo_commercial_farm_master_1', farmId: 'farm_commercial_demo_001', zoneId: 'farm_master' },
  'SD-COM-MST-03001': { deviceId: 'commercial-farm-master-1', deviceToken: 'sd_demo_commercial_farm_master_1', farmId: 'farm_commercial_demo_001', zoneId: 'farm_master' },
  'SD-COM-ZON-01001': { deviceId: 'commercial-zone-node-1', deviceToken: 'sd_demo_commercial_zone_node_1', farmId: 'farm_commercial_demo_001', zoneId: 'zone_A' },
  'SD-COM-ZON-01002': { deviceId: 'commercial-zone-node-2', deviceToken: 'sd_demo_commercial_zone_node_2', farmId: 'farm_commercial_demo_001', zoneId: 'zone_B' },
  'SD-COM-ZON-01003': { deviceId: 'commercial-zone-node-3', deviceToken: 'sd_demo_commercial_zone_node_3', farmId: 'farm_commercial_demo_001', zoneId: 'zone_C' },
};


const DEMO_DEVICE_BY_TOKEN = Object.entries(DEMO_DEVICE_BY_SERIAL).reduce((acc, [serial, device]) => {
  acc[device.deviceToken] = { serial, ...device };
  return acc;
}, {});

function demoDeviceFromToken(token) {
  const demo = DEMO_DEVICE_BY_TOKEN[String(token || '').trim()];
  if (!demo) return null;
  const parsed = parseSerial(demo.serial);
  return {
    deviceId: demo.deviceId,
    serial: demo.serial,
    deviceType: parsed.deviceType,
    packageLevel: parsed.packageLevel,
    deviceToken: demo.deviceToken,
    userId: null,
    farmId: demo.farmId || (parsed.deviceType === 'commercial' ? 'farm_commercial_demo_001' : null),
    fieldId: demo.fieldId || null,
    zoneId: demo.zoneId || null,
    nodeType: parsed.packageLevel,
    status: 'assigned',
    isOnline: true,
    lastSeen: new Date(),
  };
}
function normalizeSerial(serial = '') {
  return String(serial).trim().toUpperCase();
}

function parseSerial(serial) {
  const normalized = normalizeSerial(serial);
  const rule = SERIAL_RULES.find(item => normalized.startsWith(item.prefix));
  if (!rule) throw new Error(`Invalid SeedDown device serial: ${serial || 'empty'}`);
  return { serial: normalized, ...rule };
}

function validateAccountType(parsed, accountType = '') {
  const normalized = String(accountType || '').trim().toLowerCase();
  if (!normalized) return;
  if (parsed.deviceType === 'commercial' && normalized.startsWith('commercial')) return;
  if (parsed.deviceType === 'beginner' && normalized.startsWith('beginner')) return;
  if (!parsed.accountTypes.includes(normalized)) {
    throw new Error(`Serial ${parsed.serial} is for ${parsed.deviceType}/${parsed.packageLevel}, not ${accountType}`);
  }
}

function generateDeviceId(parsed) {
  if (DEMO_DEVICE_BY_SERIAL[parsed.serial]?.deviceId) return DEMO_DEVICE_BY_SERIAL[parsed.serial].deviceId;
  const suffix = parsed.serial.split('-').slice(-1)[0] || crypto.randomBytes(3).toString('hex');
  return `dev_${parsed.deviceType}_${parsed.packageLevel}_${suffix}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
}

function generateToken() {
  return `sd_${crypto.randomBytes(24).toString('hex')}`;
}

function publicDevice(device, includeToken = true) {
  if (!device) return null;
  const payload = { ...device };
  if (!includeToken) delete payload.deviceToken;
  return payload;
}

async function registerDevice(input = {}) {
  const parsed = parseSerial(input.serial);
  validateAccountType(parsed, input.accountType);
  const demoDevice = DEMO_DEVICE_BY_SERIAL[parsed.serial] || null;

  if (demoDevice) {
    const existingDemo = await DeviceModel.findOne({ deviceId: demoDevice.deviceId }).lean();
    if (existingDemo) {
      const updated = await DeviceModel.findOneAndUpdate(
        { deviceId: demoDevice.deviceId },
        { $set: {
          serial: parsed.serial,
          deviceType: parsed.deviceType,
          packageLevel: parsed.packageLevel,
          deviceToken: demoDevice.deviceToken,
          userId: input.userId || existingDemo.userId || null,
          farmId: input.farmId || existingDemo.farmId || null,
          fieldId: input.fieldId || existingDemo.fieldId || null,
          zoneId: input.zoneId || existingDemo.zoneId || null,
          wifiSsid: input.wifi_ssid || input.wifiSsid || existingDemo.wifiSsid || '',
          status: 'assigned',
          updatedAt: new Date(),
        }},
        { new: true, upsert: true }
      ).lean();
      return { device: publicDevice(updated), existing: true };
    }
  }

  const existingBySerial = await DeviceModel.findOne({ serial: parsed.serial }).lean();
  if (existingBySerial) {
    const updated = await DeviceModel.findOneAndUpdate(
      { deviceId: existingBySerial.deviceId },
      { $set: {
        userId: input.userId || existingBySerial.userId || null,
        farmId: input.farmId || existingBySerial.farmId || null,
        fieldId: input.fieldId || existingBySerial.fieldId || null,
        zoneId: input.zoneId || existingBySerial.zoneId || null,
        wifiSsid: input.wifi_ssid || input.wifiSsid || existingBySerial.wifiSsid || '',
        status: 'assigned',
        updatedAt: new Date(),
      }},
      { new: true, upsert: true }
    ).lean();
    return { device: publicDevice(updated), existing: true };
  }

  const deviceId = input.deviceId || generateDeviceId(parsed);
  const device = await DeviceModel.create({
    deviceId,
    serial: parsed.serial,
    deviceType: parsed.deviceType,
    packageLevel: parsed.packageLevel,
    deviceToken: demoDevice?.deviceToken || generateToken(),
    userId: input.userId || null,
    farmId: input.farmId || null,
    fieldId: input.fieldId || null,
    zoneId: input.zoneId || null,
    nodeType: parsed.packageLevel,
    wifiSsid: input.wifi_ssid || input.wifiSsid || '',
    status: 'assigned',
    isOnline: false,
    lastSeen: null,
  });

  return { device: publicDevice(device), existing: false };
}

async function getDevice(deviceId) {
  return DeviceModel.findOne({ deviceId }).lean();
}

async function getDeviceByToken(token) {
  if (!token) return null;
  const normalized = String(token).trim();
  const stored = await DeviceModel.findOne({ deviceToken: normalized }).lean();
  return stored || demoDeviceFromToken(normalized);
}

async function getDeviceByTokenOrThrow(token) {
  const device = await getDeviceByToken(token);
  if (!device) throw new Error('Invalid or unknown device token');
  return device;
}

async function heartbeat(input = {}, patch = {}) {
  const byDeviceId = typeof input === 'string';
  const token = byDeviceId ? null : input.deviceToken || input.token;
  const device = byDeviceId
    ? await getDevice(input)
    : await getDeviceByTokenOrThrow(token);

  if (!device) throw new Error('Device not found');
  const next = byDeviceId ? patch : input;

  const updated = await DeviceModel.findOneAndUpdate(
    { deviceId: device.deviceId },
    { $set: {
      isOnline: true,
      lastSeen: new Date(),
      firmwareVersion: next.firmwareVersion || device.firmwareVersion || null,
      ipAddress: next.ipAddress || device.ipAddress || null,
      farmId: next.farmId || device.farmId || null,
      fieldId: next.fieldId || device.fieldId || null,
      zoneId: next.zoneId || device.zoneId || null,
      packageLevel: next.packageLevel || device.packageLevel || null,
      lastReadingAt: next.lastReadingAt || device.lastReadingAt || null,
      updatedAt: new Date(),
    }},
    { new: true, upsert: true }
  ).lean();
  return publicDevice(updated, false);
}

module.exports = {
  registerDevice,
  getDevice,
  getDeviceByToken,
  getDeviceByTokenOrThrow,
  heartbeat,
  parseSerial,
  publicDevice,
};
