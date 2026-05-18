const sensorService = require('../services/sensorService');

function deviceToken(req) {
  return req.get('x-device-token') || req.query.deviceToken || req.query.token || null;
}

function readingFilters(req) {
  return {
    deviceId: req.query.deviceId || undefined,
    farmId: req.query.farmId || undefined,
    fieldId: req.query.fieldId || undefined,
    zoneId: req.query.zoneId || undefined,
  };
}

exports.createSensorReading = async (req, res) => {
  try {
    const result = await sensorService.saveReadingAndCreateCommand(req.body, {
      deviceToken: deviceToken(req),
    });

    res.status(201).json({
      ok: true,
      message: 'Sensor data received',
      reading: result.reading,
      aiDecision: result.decision,
      command: result.command,
    });
  } catch (err) {
    console.error('Create sensor reading error:', err);
    const status = /token|credential|unauthorized/i.test(err.message) ? 401 : 500;
    res.status(status).json({ ok: false, error: err.message });
  }
};

exports.getLatestSensorReading = async (req, res) => {
  try {
    const filters = readingFilters(req);
    if (!filters.deviceId && !filters.fieldId && !filters.zoneId && !filters.farmId) filters.deviceId = 'farm_001';
    const reading = await sensorService.getLatestReading(filters);
    res.json({ ...filters, reading });
  } catch (err) {
    console.error('Get latest sensor reading error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getSensorReadings = async (req, res) => {
  try {
    const filters = readingFilters(req);
    if (!filters.deviceId && !filters.fieldId && !filters.zoneId && !filters.farmId) filters.deviceId = 'farm_001';
    const readings = await sensorService.getReadings(filters, req.query.limit);
    res.json({ ...filters, readings });
  } catch (err) {
    console.error('Get sensor readings error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getDeviceCommand = async (req, res) => {
  try {
    const command = await sensorService.getPendingCommandForRequest({
      token: deviceToken(req),
      deviceId: req.query.deviceId || 'farm_001',
    });

    if (req.query.format === 'text') {
      const preferences = await sensorService.getPreferences(command.deviceId || req.query.deviceId || 'farm_001');
      const intervalSeconds = preferences.sensorIntervalSeconds || 3600;
      const commandId = command._id || command.id || '';
      return res.type('text/plain').send(`${command.command}|${intervalSeconds}|${commandId}`);
    }

    res.json(command);
  } catch (err) {
    console.error('Get device command error:', err);
    const status = /token|credential|unauthorized/i.test(err.message) ? 401 : 500;
    res.status(status).json({ ok: false, error: err.message });
  }
};

exports.markCommandExecuted = async (req, res) => {
  try {
    const deviceId = await sensorService.deviceIdFromTokenOrFallback(deviceToken(req), req.body.deviceId || 'farm_001');
    const commandId = req.body.commandId || req.body.id;
    const command = await sensorService.markCommandExecuted(commandId, deviceId);
    res.json({ ok: true, command });
  } catch (err) {
    console.error('Mark command executed error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.createManualCommand = async (req, res) => {
  try {
    const command = await sensorService.createManualCommand(req.body);
    res.status(201).json({ ok: true, command });
  } catch (err) {
    console.error('Create manual command error:', err);
    res.status(400).json({ ok: false, error: err.message });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const deviceId = await sensorService.deviceIdFromTokenOrFallback(deviceToken(req), req.query.deviceId || 'farm_001');
    const preferences = await sensorService.getPreferences(deviceId);
    res.json(preferences);
  } catch (err) {
    console.error('Get preferences error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const deviceId = await sensorService.deviceIdFromTokenOrFallback(
      deviceToken(req),
      req.body.deviceId || req.query.deviceId || 'farm_001'
    );
    const preferences = await sensorService.updatePreferences(deviceId, req.body);
    res.json({ ok: true, preferences });
  } catch (err) {
    console.error('Update preferences error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.analyzeFarmData = async (req, res) => {
  try {
    const { type, data } = req.body;
    const insight = await sensorService.analyzeWithAI(type, data);
    res.json({ ok: true, insight });
  } catch (err) {
    console.error('AI Analysis error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
