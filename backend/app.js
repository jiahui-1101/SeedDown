// backend/app.js 
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '12mb' }));
app.use(cors());

// 建立数据库安全连接
connectDB();

const sensorRoutes = require('./src/routes/sensorRoutes');
const {
  createSensorReading,
  getDeviceCommand
} = require('./src/controllers/sensorController');

const { router: communityRouter, seedBarterDatabase } = require('./src/routes/communityRoutes');

// 触发异步社区大集市测试数据初始化填充
seedBarterDatabase().catch(err => console.error("Seed Error:", err));

function getLegacyDeviceCommand(req, res) {
  if (!req.query.format) req.query.format = 'text';
  return getDeviceCommand(req, res);
}

// ─── 核心应用路由注册树 ───
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/sensors', sensorRoutes);
app.use('/api/iot', sensorRoutes);

app.post('/api/sensor-data', createSensorReading);
app.get('/api/device-command', getLegacyDeviceCommand);

app.use('/api/farms', require('./src/routes/farmRoutes'));
app.use('/api/devices', require('./src/routes/deviceRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));
app.use('/api/whatif', require('./src/routes/whatIfRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/crops', require('./src/routes/cropRoutes'));
app.use('/api/community', communityRouter);
app.use('/api/consumption', require('./src/routes/consumptionRoutes'));

// 🛰️ 【新增核心：成功挂载全新预测性警报模块路由】
app.use('/api/alerts', require('./src/routes/alertRoutes'));

// 根路由状态检查健康码
app.get('/', (req, res) =>
  res.json({ status: 'SeedDown API running' })
);

module.exports = app;