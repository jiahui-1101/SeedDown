const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '12mb' }));
app.use(cors());

connectDB();

const sensorRoutes = require('./src/routes/sensorRoutes');
const {
  createSensorReading,
  getDeviceCommand
} = require('./src/controllers/sensorController');

function getLegacyDeviceCommand(req, res) {
  if (!req.query.format) req.query.format = 'text';
  return getDeviceCommand(req, res);
}

app.use('/api/sensors', sensorRoutes);
app.use('/api/iot', sensorRoutes);
app.post('/api/sensor-data', createSensorReading);
app.get('/api/device-command', getLegacyDeviceCommand);
app.use('/api/farms', require('./src/routes/farmRoutes'));
app.use('/api/whatif', require('./src/routes/whatIfRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/crops', require('./src/routes/cropRoutes'));
app.use('/api/community', require('./src/routes/communityRoutes'));

app.get('/', (req, res) =>
  res.json({ status: 'NextLevelFarm API running' })
);

module.exports = app;
