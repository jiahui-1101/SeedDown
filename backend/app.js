const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// Existing recipe route (keep working)
app.use('/api/recipes', require('./src/routes/sensorRoutes'));

// New routes
app.use('/api/whatif', require('./src/routes/whatIfRoutes'));
app.use('/api/chat',   require('./src/routes/chatRoutes'));

app.get('/', (req, res) => res.json({ status: '✅ NextLevelFarm API running' }));

module.exports = app;