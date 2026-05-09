<<<<<<< HEAD
const sensorService = require('../services/sensorService');
=======
const sensorService = require("../services/sensorService");
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942

exports.createSensorReading = async (req, res) => {
  try {
    const result = await sensorService.saveReadingAndCreateCommand(req.body);

    res.status(201).json({
      ok: true,
<<<<<<< HEAD
      message: 'Sensor data received',
      reading: result.reading,
      aiDecision: result.decision,
      command: result.command
    });
  } catch (err) {
    console.error('Create sensor reading error:', err);
=======
      message: "Sensor data received",
      reading: result.reading,
      aiDecision: result.decision,
      command: result.command,
    });
  } catch (err) {
    console.error("Create sensor reading error:", err);
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getLatestSensorReading = async (req, res) => {
  try {
<<<<<<< HEAD
    const deviceId = req.query.deviceId || 'farm_001';
    const reading = await sensorService.getLatestReading(deviceId);
    res.json({ deviceId, reading });
  } catch (err) {
    console.error('Get latest sensor reading error:', err);
=======
    const deviceId = req.query.deviceId || "farm_001";
    const reading = await sensorService.getLatestReading(deviceId);
    res.json({ deviceId, reading });
  } catch (err) {
    console.error("Get latest sensor reading error:", err);
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getSensorReadings = async (req, res) => {
  try {
<<<<<<< HEAD
    const deviceId = req.query.deviceId || 'farm_001';
    const readings = await sensorService.getReadings(deviceId, req.query.limit);
    res.json({ deviceId, readings });
  } catch (err) {
    console.error('Get sensor readings error:', err);
=======
    const deviceId = req.query.deviceId || "farm_001";
    const readings = await sensorService.getReadings(deviceId, req.query.limit);
    res.json({ deviceId, readings });
  } catch (err) {
    console.error("Get sensor readings error:", err);
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getDeviceCommand = async (req, res) => {
  try {
<<<<<<< HEAD
    const deviceId = req.query.deviceId || 'farm_001';
    const command = await sensorService.getPendingCommand(deviceId);

    if (req.query.format === 'text') {
      return res.type('text/plain').send(command.command);
=======
    const deviceId = req.query.deviceId || "farm_001";
    const command = await sensorService.getPendingCommand(deviceId);

    if (req.query.format === "text") {
      const preferences = await sensorService.getPreferences(deviceId);
      const intervalSeconds = preferences.sensorIntervalSeconds || 3600;
      // 格式: "WATER_ON|10" 或 "NO_ACTION|3600"
      return res
        .type("text/plain")
        .send(`${command.command}|${intervalSeconds}`);
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
    }

    res.json(command);
  } catch (err) {
<<<<<<< HEAD
    console.error('Get device command error:', err);
=======
    console.error("Get device command error:", err);
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.markCommandExecuted = async (req, res) => {
  try {
<<<<<<< HEAD
    const deviceId = req.body.deviceId || 'farm_001';
    const commandId = req.body.commandId || req.body.id;
    const command = await sensorService.markCommandExecuted(commandId, deviceId);
    res.json({ ok: true, command });
  } catch (err) {
    console.error('Mark command executed error:', err);
=======
    const deviceId = req.body.deviceId || "farm_001";
    const commandId = req.body.commandId || req.body.id;
    const command = await sensorService.markCommandExecuted(
      commandId,
      deviceId,
    );
    res.json({ ok: true, command });
  } catch (err) {
    console.error("Mark command executed error:", err);
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getPreferences = async (req, res) => {
  try {
<<<<<<< HEAD
    const deviceId = req.query.deviceId || 'farm_001';
    const preferences = await sensorService.getPreferences(deviceId);
    res.json(preferences);
  } catch (err) {
    console.error('Get preferences error:', err);
=======
    const deviceId = req.query.deviceId || "farm_001";
    const preferences = await sensorService.getPreferences(deviceId);
    res.json(preferences);
  } catch (err) {
    console.error("Get preferences error:", err);
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
<<<<<<< HEAD
    const deviceId = req.body.deviceId || req.query.deviceId || 'farm_001';
    const preferences = await sensorService.updatePreferences(deviceId, req.body);
    res.json({ ok: true, preferences });
  } catch (err) {
    console.error('Update preferences error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
=======
    const deviceId = req.body.deviceId || req.query.deviceId || "farm_001";
    const preferences = await sensorService.updatePreferences(
      deviceId,
      req.body,
    );
    res.json({ ok: true, preferences });
  } catch (err) {
    console.error("Update preferences error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942
