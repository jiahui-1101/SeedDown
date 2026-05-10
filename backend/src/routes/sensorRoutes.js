const express = require('express');
const router = express.Router();
const {
  createSensorReading,
  getLatestSensorReading,
  getSensorReadings,
  getDeviceCommand,
  markCommandExecuted,
  getPreferences,
  updatePreferences
} = require('../controllers/sensorController');

router.get('/', (req, res) => {
  res.json({
    message: 'NextLevelFarm IoT sensor route working',
    endpoints: [
      'POST /api/sensors',
      'GET /api/sensors/latest?deviceId=farm_001',
      'GET /api/sensors/history?deviceId=farm_001&limit=20',
      'GET /api/sensors/command?deviceId=farm_001',
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
router.post('/command-result', markCommandExecuted);
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);


module.exports = router;