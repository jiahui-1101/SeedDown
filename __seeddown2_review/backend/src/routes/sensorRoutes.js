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



