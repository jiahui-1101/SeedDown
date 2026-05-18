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
  { prefix: 'SD-COM-ZNB', deviceType: 'commercial', packageLevel: 'zone_basic', accountTypes: ['commercial', 'commercial_zone_basic'] },
  { prefix: 'SD-COM-ZNP', deviceType: 'commercial', packageLevel: 'zone_pro', accountTypes: ['commercial', 'commercial_zone_pro'] },
  { prefix: 'SD-COM-MST', deviceType: 'commercial', packageLevel: 'farm_master', accountTypes: ['commercial', 'commercial_master'] },
];

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
  if (!parsed.accountTypes.includes(normalized)) {
    throw new Error(`Serial ${parsed.serial} is for ${parsed.deviceType}/${parsed.packageLevel}, not ${accountType}`);
  }
}

function generateDeviceId(parsed) {
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
    deviceToken: generateToken(),
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
  return DeviceModel.findOne({ deviceToken: String(token).trim() }).lean();
}

async function getDeviceByTokenOrThrow(token) {
  const device = await getDeviceByToken(token);
  if (!device) throw new Error('Invalid or unknown device token');
  return device;
}

async function heartbeat(input = {}) {
  const token = input.deviceToken || input.token;
  const device = await getDeviceByTokenOrThrow(token);
  const updated = await DeviceModel.findOneAndUpdate(
    { deviceId: device.deviceId },
    { $set: {
      isOnline: true,
      lastSeen: new Date(),
      firmwareVersion: input.firmwareVersion || device.firmwareVersion || null,
      ipAddress: input.ipAddress || device.ipAddress || null,
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
