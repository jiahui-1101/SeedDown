const express = require('express');
const router = express.Router();
const controller = require('../controllers/deviceController');

router.post('/register', controller.registerDevice);
router.post('/reassign', controller.reassignDevice);
router.get('/by-token', controller.getDeviceByToken);
router.post('/heartbeat', controller.heartbeat);
router.get('/:deviceId', controller.getDevice);

module.exports = router;
