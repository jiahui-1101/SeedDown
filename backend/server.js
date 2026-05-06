// 简单的 Express 服务器示例 (示意)
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/sensors', (req, res) => {
    console.log('Sensor data received:', req.body);
    res.json({ status: 'ok' });
});

app.get('/api/farms/:id', (req, res) => {
    res.json({ id: req.params.id, name: 'Farm 1' });
});

app.listen(3000, () => console.log('Backend running on port 3000'));