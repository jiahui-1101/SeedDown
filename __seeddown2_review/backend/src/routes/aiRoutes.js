const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const ai = require('../services/aiService');

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
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;