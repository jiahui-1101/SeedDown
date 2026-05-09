const express = require('express');
const {
  scanPlants,
  generate3D,
  createFarm,
} = require('../controllers/farmController');

const router = express.Router();

router.post('/scan-plants', scanPlants);
router.post('/generate-3d', generate3D);
router.post('/create', createFarm);

module.exports = router;
