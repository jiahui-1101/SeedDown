// 文件路径: /backend/src/routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const { db } = require('../config/db'); // 确保你之前按我说的配置了 Firebase db

// --- 辅助函数：获取或创建默认用户 (Firebase 版) ---
async function getOrCreateUser() {
    const userRef = db.collection('users').doc('my_account');
    const doc = await userRef.get();
    
    if (!doc.exists) {
        const newUser = {
            userId: 'my_account',
            coins: 100,
            dailyWaterHelps: 0,
            lastWaterDate: null,
            createdAt: new Date()
        };
        await userRef.set(newUser);
        return newUser;
    }
    return doc.data();
}

// 1. 获取当前用户信息 (查询金币)
router.get('/me', async (req, res) => {
    try {
        const userData = await getOrCreateUser();
        res.json(userData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. 互动农场：一键浇水功能
router.post('/water', async (req, res) => {
    try {
        const userRef = db.collection('users').doc('my_account');
        const user = await getOrCreateUser();
        const today = new Date().toDateString();

        let { dailyWaterHelps, coins, lastWaterDate } = user;

        // 每天重置防刷机制
        if (lastWaterDate !== today) {
            dailyWaterHelps = 0;
            lastWaterDate = today;
        }

        // 检查是否超过3次
        if (dailyWaterHelps >= 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have used up your 3 daily helps! Come back tomorrow~' 
            });
        }

        // 更新本地变量
        const newCoins = coins + 5;
        const newHelps = dailyWaterHelps + 1;

        // 保存回 Firebase
        await userRef.update({
            dailyWaterHelps: newHelps,
            coins: newCoins,
            lastWaterDate: today
        });
        
        res.json({ 
            success: true, 
            message: 'Watered successfully! Plant is healthy again 🌿', 
            coinsEarned: 5,
            totalCoins: newCoins 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. 获取所有帖子 (SOS/盲盒)
router.get('/posts', async (req, res) => {
    try {
        const postsSnapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
        let posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 如果是空的，初始化点假数据演示
        if (posts.length === 0) {
            const samplePosts = [
                { type: 'sos', author: 'GreenKL', title: 'Tomato leaves turning yellow!', createdAt: new Date() },
                { type: 'mystery_box', author: 'Aisha.Farm', title: 'Ugly Veggie Box', price: 150, createdAt: new Date() },
                { type: 'match', author: 'TanFarm88', title: 'I have Mint, want to trade for Basil', createdAt: new Date() }
            ];
            for (const p of samplePosts) {
                await db.collection('posts').add(p);
            }
            posts = samplePosts;
        }
        
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;