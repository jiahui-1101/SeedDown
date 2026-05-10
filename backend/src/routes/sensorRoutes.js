const express = require('express');
const router  = express.Router();
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
      'GET /api/sensors/weekly-avg?deviceId=farm_001',
      'GET /api/sensors/command?deviceId=farm_001',
      'POST /api/sensors/command-result',
      'GET /api/sensors/preferences?deviceId=farm_001',
      'PUT /api/sensors/preferences'
    ]
  });
});

router.post('/',    createSensorReading);
router.post('/data', createSensorReading);
router.get('/latest', getLatestSensorReading);

// ── GET /api/sensors/weekly-avg ──────────────────────────────────────────────
router.get('/weekly-avg', async (req, res) => {
  try {
    const deviceId     = req.query.deviceId || 'farm_001';
    const sensorService = require('../services/sensorService');

    // Try time-based 7-day window first (requires Firestore composite index)
    // Falls back automatically to plain limit query inside getReadingsByHours()
    const readings = await sensorService.getReadingsByHours(deviceId, 168);

    if (!readings || readings.length === 0) {
      // No history at all — serve latest single reading as avg
      const latest = await sensorService.getLatestReading(deviceId);
      const r = latest || {};
      return res.json({
        avg: {
          temperature:  r.temperature  ?? 28,
          humidity:     r.humidity     ?? 68,
          light:        r.lightRaw     ?? 82,
          soilMoisture: r.soilRaw      ?? 45,
          nutrient:     r.ph           ?? 6.5,
        },
        count: 0,
        days:   0,
        source: 'latest',
      });
    }

    const n   = readings.length;
    const sum = (key, fallback) => readings.reduce((s, r) => s + (r[key] ?? fallback), 0);

    const avg = {
      temperature:  parseFloat((sum('temperature',  28)  / n).toFixed(1)),
      humidity:     parseFloat((sum('humidity',     68)  / n).toFixed(1)),
      light:        parseFloat((sum('lightRaw',     82)  / n).toFixed(1)),
      soilMoisture: parseFloat((sum('soilRaw',      45)  / n).toFixed(1)),
      nutrient:     parseFloat((sum('ph',            6.5) / n).toFixed(2)),
    };

    // Estimate day span from oldest → newest timestamp
    const timestamps = readings.map(r => new Date(r.createdAt).getTime()).filter(Boolean);
    const spanMs     = timestamps.length > 1
      ? Math.max(...timestamps) - Math.min(...timestamps)
      : 0;
    const days = spanMs > 0 ? Math.max(1, Math.round(spanMs / 86400000)) : 1;

    res.json({ avg, count: n, days, source: 'history' });

  } catch (err) {
    console.warn('weekly-avg fallback:', err.message);
    res.json({
      avg: { temperature: 28, humidity: 68, light: 82, soilMoisture: 45, nutrient: 6.5 },
      count: 0,
      days:   0,
      source: 'fallback',
    });
  }
});

router.get('/history',        getSensorReadings);
router.get('/command',        getDeviceCommand);
router.post('/command-result', markCommandExecuted);
router.get('/preferences',    getPreferences);
router.put('/preferences',    updatePreferences);

module.exports = router;