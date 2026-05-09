const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');
const db = getDb();

// 1. 获取所有商品清单
router.get('/products', async (req, res) => {
    try {
        const productsSnapshot = await db.collection('products').get();
        let products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 初始化 10 个预设商品 (如果数据库是空的)
        if (products.length === 0) {
            const initialProducts = [
                { name: 'Tomato Seeds', price: 50, category: 'Seed', icon: '🍅' },
                { name: 'Lettuce Seeds', price: 30, category: 'Seed', icon: '🥬' },
                { name: 'Chili Seeds', price: 45, category: 'Seed', icon: '🌶️' },
                { name: 'Smart Shovel', price: 120, category: 'Tool', icon: '🔧' },
                { name: 'Watering Can', price: 150, category: 'Tool', icon: '🚿' },
                { name: 'Pruning Shears', price: 100, category: 'Tool', icon: '✂️' },
                { name: 'Soil Moisture Sensor', price: 500, category: 'Sensor', icon: '📟' },
                { name: 'pH Tester', price: 450, category: 'Sensor', icon: '🧪' },
                { name: 'Temp/Humidity Sensor', price: 380, category: 'Sensor', icon: '🌡️' },
                { name: 'NPK Sensor', price: 750, category: 'Sensor', icon: '📊' }
            ];
            for (const p of initialProducts) {
                await db.collection('products').add(p);
            }
            products = initialProducts;
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. 提交订单 (扣除绿叶币并记录地址)
router.post('/order', async (req, res) => {
    try {
        const { items, address, totalPrice } = req.body;
        const userRef = db.collection('users').doc('my_account');
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        if (userData.coins < totalPrice) {
            return res.status(400).json({ success: false, message: 'Insufficient coins!' });
        }

        // 扣款
        await userRef.update({
            coins: userData.coins - totalPrice
        });

        // 存订单
        await db.collection('orders').add({
            userId: 'my_account',
            items, // 现在是一个包含 quantity 的数组
            address,
            totalPrice,
            status: 'Pending',
            createdAt: new Date()
        });

        res.json({ success: true, message: 'Ordered!', newBalance: userData.coins - totalPrice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;