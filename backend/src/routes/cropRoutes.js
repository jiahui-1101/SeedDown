const express = require('express');
const router  = express.Router();
const path    = require('path');
const fs      = require('fs');
const { askText } = require('../services/aiService');

const CROPS_FILE = path.join(__dirname, '../../crops_data.json');

function loadCrops() {
  return JSON.parse(fs.readFileSync(CROPS_FILE, 'utf8'));
}

router.get('/all', (req, res) => {
  try { res.json(loadCrops()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/species/:name', async (req, res) => {
  try {
    const name  = req.params.name.toLowerCase().trim();
    const crops = loadCrops();
    let crop    = crops.find(c => c.species === name);
    let aiGenerated = false;

    if (!crop) {
      const prompt = `Agricultural expert. Estimate indoor garden data for "${name}".
Return single-line JSON only, no markdown:
{"species":"${name}","commonName":"${name}","emoji":"🌱","requirements":{"tempMin":18,"tempMax":28,"humidityMin":50,"humidityMax":75,"lightHours":6,"waterPerDay":150,"fertilizerPerWeek":3,"growthDays":45},"yield":{"avgGramsPerPlant":200,"harvestsPerCycle":3,"peakWeek":6},"impacts":{"tempChange":0.5,"humidChange":3,"lightChange":0,"waterChange":6,"nutrientChange":5},"recipeKeywords":["${name}"]}`;

      const raw       = await askText('', prompt, 400);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI could not estimate species data');
      crop        = JSON.parse(jsonMatch[0]);
      aiGenerated = true;
      crops.push(crop);
      fs.writeFileSync(CROPS_FILE, JSON.stringify(crops, null, 2));
    }

    res.json({ found: true, crop, aiGenerated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;