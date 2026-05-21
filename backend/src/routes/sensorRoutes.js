const express = require('express');
const router = express.Router();
const {
  createSensorReading,
  getLatestSensorReading,
  getSensorReadings,
  getDeviceCommand,
  createManualCommand,
  markCommandExecuted,
  getPreferences,
  updatePreferences
} = require('../controllers/sensorController');

router.get('/', (req, res) => {
  res.json({
    message: 'SeedDown IoT sensor route working',
    endpoints: [
      'POST /api/sensors + optional x-device-token',
      'GET /api/sensors/latest?deviceId=... | fieldId=... | zoneId=... | farmId=...',
      'GET /api/sensors/history?deviceId=...&limit=20',
      'GET /api/sensors/command?deviceId=...&format=text + optional x-device-token',
      'POST /api/sensors/command',
      'POST /api/sensors/command-result',
      'GET /api/sensors/preferences?deviceId=farm_001',
      'PUT /api/sensors/preferences'
    ]
  });
});

router.post('/', createSensorReading);
router.post('/data', createSensorReading);
router.get('/latest', getLatestSensorReading);
router.get('/history', getSensorReadings);
router.get('/command', getDeviceCommand);
router.post('/command', createManualCommand);
router.post('/command-result', markCommandExecuted);
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);


module.exports = router;




// Zone discovery — returns unique zoneIds found in sensor readings for a deviceId
// GET /api/sensors/zones?deviceId=...
router.get('/zones', async (req, res) => {
  try {
    const { deviceId = 'farm_001' } = req.query;
    const { getDb } = require('../config/db');
    const db = getDb();

    // Query sensorReadings for distinct zoneIds for this device
    const snap = await db.collection('sensorReadings')
      .where('deviceId', '==', deviceId)
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    const zoneSet = new Set();
    snap.forEach(doc => {
      const data = doc.data();
      if (data.zoneId !== undefined && data.zoneId !== null) {
        zoneSet.add(data.zoneId);
      }
    });

    const zoneIds = Array.from(zoneSet).sort((a, b) => {
      const na = Number(a), nb = Number(b);
      return !isNaN(na) && !isNaN(nb) ? na - nb : String(a).localeCompare(String(b));
    });

    res.json({ ok: true, deviceId, zoneIds });
  } catch (err) {
    console.error('[zones endpoint]', err);
    res.status(500).json({ ok: false, error: err.message, zoneIds: [] });
  }
});
