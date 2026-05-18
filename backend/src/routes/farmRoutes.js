const express = require('express');
const {
  scanPlants,
  analyzeDisease,
  generate3D,
  createFarm,
} = require('../controllers/farmController');

const router = express.Router();

router.post('/scan-plants', scanPlants);
router.post('/analyze-disease', analyzeDisease);
router.post('/generate-3d', generate3D);
router.post('/create', createFarm);

module.exports = router;
