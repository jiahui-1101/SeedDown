require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');


const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/sensors', require('./src/routes/sensorRoutes'));
app.use('/api/iot', require('./src/routes/sensorRoutes'));
app.use('/api/whatif', require('./src/routes/whatIfRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/crops', require('./src/routes/cropRoutes'));
app.use('/api/community', require('./src/routes/communityRoutes'));

app.get('/', (req, res) =>
  res.json({ status: 'NextLevelFarm API running' })
);

module.exports = app;