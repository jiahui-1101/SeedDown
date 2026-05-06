// 模拟 IoT 设备发送数据
setInterval(() => {
    const mockData = {
        temp: 25 + Math.random() * 5,
        humid: 60 + Math.random() * 20,
        timestamp: Date.now()
    };
    console.log('Sending IoT data:', mockData);
    // 实际发送到后端: fetch('http://localhost:3000/api/sensors', { method: 'POST', body: JSON.stringify(mockData) })
}, 5000);