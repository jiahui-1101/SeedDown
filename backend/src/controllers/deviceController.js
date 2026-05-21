const deviceService = require('../services/deviceService');

exports.registerDevice = async (req, res) => {
  try {
    const result = await deviceService.registerDevice(req.body || {});
    res.status(result.existing ? 200 : 201).json({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

exports.reassignDevice = async (req, res) => {
  try {
    const result = await deviceService.reassignDevice(req.body || {});
    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

exports.getDevice = async (req, res) => {
  try {
    const device = await deviceService.getDevice(req.params.deviceId);
    if (!device) return res.status(404).json({ ok: false, error: 'Device not found' });
    res.json({ ok: true, device: deviceService.publicDevice(device, false) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getDeviceByToken = async (req, res) => {
  try {
    const token = req.get('x-device-token') || req.query.token;
    const device = await deviceService.getDeviceByToken(token);
    if (!device) return res.status(404).json({ ok: false, error: 'Device not found for token' });
    res.json({ ok: true, device: deviceService.publicDevice(device, false) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.heartbeat = async (req, res) => {
  try {
    const token = req.get('x-device-token') || req.body.deviceToken || req.body.token;
    const device = await deviceService.heartbeat({ ...req.body, deviceToken: token, ipAddress: req.ip });
    res.json({ ok: true, device });
  } catch (err) {
    res.status(401).json({ ok: false, error: err.message });
  }
};
