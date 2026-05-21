// backend/src/routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const { predictBeginner, predictCommercial } = require('../controllers/alertController');

// POST /api/alerts/predict-beginner
// Body: { deviceId, packageLevel, predictMinutes, latestReading, historyReadings }
router.post('/predict-beginner', predictBeginner);

// POST /api/alerts/predict-commercial
// Body: { deviceId, predictMinutes, masterReading, masterHistory, zones }
router.post('/predict-commercial', predictCommercial);

module.exports = router;