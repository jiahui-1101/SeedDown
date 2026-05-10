const sensorService = require('../services/sensorService');

exports.createSensorReading = async (req, res) => {
  try {
    const result = await sensorService.saveReadingAndCreateCommand(req.body);
    res.status(201).json({
      ok: true,
      message: 'Sensor data received',
      reading: result.reading,
      aiDecision: result.decision,
      command: result.command
    });
  } catch (err) {
    console.error('Create sensor reading error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getLatestSensorReading = async (req, res) => {
  try {
    const deviceId = req.query.deviceId || 'farm_001';
    const reading = await sensorService.getLatestReading(deviceId);
    res.json({ deviceId, reading });
  } catch (err) {
    console.error('Get latest sensor reading error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getSensorReadings = async (req, res) => {
  try {
    const deviceId = req.query.deviceId || 'farm_001';
    const readings = await sensorService.getReadings(deviceId, req.query.limit);
    res.json({ deviceId, readings });
  } catch (err) {
    console.error('Get sensor readings error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getDeviceCommand = async (req, res) => {
  try {
    const deviceId = req.query.deviceId || 'farm_001';
    const command = await sensorService.getPendingCommand(deviceId);

    if (req.query.format === 'text') {
      const preferences = await sensorService.getPreferences(deviceId);
      const intervalSeconds = preferences.sensorIntervalSeconds || 3600;
      return res.type('text/plain').send(`${command.command}|${intervalSeconds}`);
    }

    res.json(command);
  } catch (err) {
    console.error('Get device command error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.markCommandExecuted = async (req, res) => {
  try {
    const deviceId = req.body.deviceId || 'farm_001';
    const commandId = req.body.commandId || req.body.id;
    const command = await sensorService.markCommandExecuted(commandId, deviceId);
    res.json({ ok: true, command });
  } catch (err) {
    console.error('Mark command executed error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const deviceId = req.query.deviceId || 'farm_001';
    const preferences = await sensorService.getPreferences(deviceId);
    res.json(preferences);
  } catch (err) {
    console.error('Get preferences error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const deviceId = req.body.deviceId || req.query.deviceId || 'farm_001';
    const preferences = await sensorService.updatePreferences(deviceId, req.body);
    res.json({ ok: true, preferences });
  } catch (err) {
    console.error('Update preferences error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

// --- 放在 sensorController.js 最下面 ---

exports.analyzeFarmData = async (req, res) => {
  try {
    const { type, data } = req.body; // type 是 'profit' 或 'energy'
    // 呼叫 service 层的 AI 分析功能
    const insight = await sensorService.analyzeWithAI(type, data);
    res.json({ ok: true, insight });
  } catch (err) {
    console.error('AI Analysis error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

