const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const ai = require('../services/aiService');
const sensorService = require('../services/sensorService');

router.post('/generate-thresholds', aiController.generateThresholds);

// 修改后的 backend/src/routes/aiRoutes.js

router.post('/disease-analysis', async (req, res) => {
  try {
    const { image, mediaType, plantName, plantSpecies, farmContext, answers } = req.body;
    
    // 🔍 移除对 image 的强制检查，允许无图提交
    if (!plantName) {
      return res.status(400).json({ error: 'Plant name is required for analysis.' });
    }

    const result = await ai.analyzePlantDisease({
      image, 
      mediaType, 
      plantName, 
      plantSpecies, 
      farmContext, 
      answers
    });
    res.json(result);
  } catch (err) {
    res.json({
      text: JSON.stringify({
        error: true,
        confidence: 'low',
        insight: `Resource prediction could not run: ${err.message}`,
        source: 'Firebase/AI resource route error',
      }),
    });
  }
});

router.post('/predict-resources', async (req, res) => {
  try {
    const { prompt, sensorFilters = {} } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt string required' });
    }
    const candidates = [
      sensorFilters.deviceId ? { deviceId: sensorFilters.deviceId } : null,
      sensorFilters.zoneId ? { zoneId: sensorFilters.zoneId } : null,
      sensorFilters.farmId ? { farmId: sensorFilters.farmId } : null,
      sensorFilters.fieldId ? { fieldId: sensorFilters.fieldId } : null,
    ].filter(Boolean);

    if (!candidates.length) {
      return res.json({
        text: JSON.stringify({
          error: true,
          confidence: 'low',
          insight: 'Select a farm with a real device id before running AI resource prediction.',
          source: 'No Firebase sensor identifier supplied',
        }),
      });
    }

    let latest = null;
    let history = [];
    let usedFilters = null;
    for (const filters of candidates) {
      latest = await sensorService.getLatestReading(filters);
      if (!latest) continue;
      history = await sensorService.getReadings(filters, 200);
      usedFilters = filters;
      break;
    }

    if (!latest || !history.length) {
      return res.json({
        text: JSON.stringify({
          error: true,
          confidence: 'low',
          insight: 'No Firebase sensor readings were found for the selected farm/device.',
          source: 'Firebase sensorReadings unavailable',
        }),
      });
    }

    const firebasePrompt = [
      'Use ONLY the exact Firebase sensorReadings below for sensor analysis.',
      'Do not invent or estimate missing sensor fields. If a field is missing, say data is unavailable.',
      `Firebase query filters: ${JSON.stringify(usedFilters)}`,
      `Latest Firebase reading: ${JSON.stringify(latest)}`,
      `Firebase history (${history.length} readings): ${JSON.stringify(history)}`,
      '',
      prompt,
    ].join('\n');

    let result;
    try {
      result = await ai.predictResources(firebasePrompt);
    } catch (aiErr) {
      return res.json({
        text: JSON.stringify({
          error: true,
          confidence: 'low',
          insight: `Firebase readings loaded, but AI resource prediction failed: ${aiErr.message}`,
          source: `Firebase sensorReadings ${JSON.stringify(usedFilters)} (${history.length} readings)`,
        }),
      });
    }
    // Return as { text: "...json..." } — WhatIfPro.js expects this shape
    res.json({ text: JSON.stringify(result) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
