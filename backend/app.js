const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB only needed for sensor data now
connectDB();

// Routes
app.use('/api/sensors', require('./src/routes/sensorRoutes'));
app.use('/api/iot', require('./src/routes/sensorRoutes'));
app.use('/api/recipes', require('./src/routes/sensorRoutes'));

app.use('/api/whatif', require('./src/routes/whatIfRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/crops', require('./src/routes/cropRoutes'));
<<<<<<< HEAD
=======
app.use('/api/community', require('./src/routes/communityRoutes'));
>>>>>>> 5ce9b3812d4f85453baecc9c4e0358f6096f9942

app.get('/', (req, res) =>
  res.json({ status: 'NextLevelFarm API running' })
);

module.exports = app;