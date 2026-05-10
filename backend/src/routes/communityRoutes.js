const express = require('express');
const router = express.Router();
// 确保这一行是 getDb，而不是 db
const { getDb } = require('../config/db'); 

// --- 辅助函数：获取或创建默认用户 ---
async function getOrCreateUser() {
    const db = getDb(); 
    if (!db) throw new Error("数据库连接失败，getDb() 返回了 undefined");

    const userRef = db.collection('users').doc('my_account');
    const doc = await userRef.get();
    
    if (!doc.exists) {
        const newUser = {
            userId: 'my_account',
            coins: 100,
            dailyWaterHelps: 0,
            lastWaterDate: "",
            createdAt: new Date()
        };
        await userRef.set(newUser);
        return newUser;
    }
    return doc.data();
}

// 获取当前用户信息
router.get('/me', async (req, res) => {
    try {
        const userData = await getOrCreateUser();
        res.json(userData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 一键浇水功能
router.post('/water', async (req, res) => {
    try {
        const db = getDb();
        if (!db) throw new Error("数据库连接失败");

        const userRef = db.collection('users').doc('my_account');
        const user = await getOrCreateUser();
        const today = new Date().toDateString();

        let { dailyWaterHelps, coins, lastWaterDate } = user;

        if (lastWaterDate !== today) {
            dailyWaterHelps = 0;
        }

        if (dailyWaterHelps >= 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have used up your 3 daily helps!' 
            });
        }

        const newCoins = coins + 5;
        const newHelps = dailyWaterHelps + 1;

        await userRef.update({
            dailyWaterHelps: newHelps,
            coins: newCoins,
            lastWaterDate: today
        });
        
        res.json({ 
            success: true, 
            message: 'Watered successfully! 🌿', 
            coinsEarned: 5,
            totalCoins: newCoins 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 发布一个新的 SOS 信号
router.post('/posts/sos', async (req, res) => {
    try {
        const db = getDb();
        const { author, title, content, reward, image } = req.body; // 新增 image

        const newSos = {
            type: 'sos',
            author: author || 'Anonymous',
            title: title || 'No Title',
            content: content || '',
            reward: reward || 10,
            image: image || null, // 存入图片
            comments: [], // 初始化一个空的评论数组
            status: 'active',
            createdAt: new Date()
        };

        const docRef = await db.collection('posts').add(newSos);
        res.json({ success: true, id: docRef.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/posts/:postId/comments', async (req, res) => {
    try {
        const db = getDb();
        const { postId } = req.params;
        const { text, author } = req.body;

        const postRef = db.collection('posts').doc(postId);
        
        // 使用 FieldValue.arrayUnion 优雅地往数组里追加评论，而不覆盖原有数据
        const { FieldValue } = require('firebase-admin/firestore');
        
        const newComment = {
            author: author || 'User',
            text: text,
            createdAt: new Date()
        };

        await postRef.update({
            comments: FieldValue.arrayUnion(newComment)
        });

        res.json({ success: true, message: "Comment added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 获取所有帖子列表 (这个就是你刚才报错的源头！)
// 获取所有帖子列表
router.get('/posts', async (req, res) => {
    try {
        const db = getDb();
        if (!db) {
            throw new Error("Cannot connect to database instance");
        }

        const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
        
        const posts = snapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                // 【核心修复】：如果是 Firebase 的时间戳，就把它转成标准 JS 字符串
                createdAt: (data.createdAt && data.createdAt.toDate) 
                            ? data.createdAt.toDate().toISOString() 
                            : data.createdAt
            };
        });
        
        res.json(posts);
    } catch (err) {
        console.error(">>> 读取帖子报错:", err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 新增的 SOS 高级功能接口
// ==========================================

// 1. 点绿叶 (Like)
router.post('/posts/:postId/like', async (req, res) => {
    try {
        const db = getDb();
        const postRef = db.collection('posts').doc(req.params.postId);
        const { FieldValue } = require('firebase-admin/firestore');
        
        // 让点赞数 +1 (如果没有 likes 字段，会自动创建并设为 1)
        await postRef.update({
            likes: FieldValue.increment(1)
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. 删除帖子
router.delete('/posts/:postId', async (req, res) => {
    try {
        const db = getDb();
        await db.collection('posts').doc(req.params.postId).delete();
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. 自定义金额打赏 (扣除自己的钱，这里省略了给别人加钱的逻辑，以保证简单)
router.post('/posts/:postId/reward', async (req, res) => {
    try {
        const db = getDb();
        const { amount, receiver } = req.body;
        
        // 1. 获取当前用户
        const userRef = db.collection('users').doc('my_account');
        const userDoc = await userRef.get();
        const currentCoins = userDoc.data().coins;

        // 2. 检查余额够不够
        if (currentCoins < amount) {
            return res.status(400).json({ success: false, message: 'Not enough coins!' });
        }

        // 3. 扣钱
        await userRef.update({
            coins: currentCoins - amount
        });

        res.json({ success: true, message: 'Reward sent!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// Pasar & Barter Board (以物换物/市集) 引擎
// ==========================================
// ══ Seed 7 件商品到 Firebase（仅 dev 用，调用一次即可）══
// ... 前面所有的 getOrCreateUser, router.get, router.post 等代码 ...

// 1. 定义 seedBarterDatabase 函数 (从路由逻辑中抽离)
async function seedBarterDatabase() {
    try {
        const db = getDb();
        if (!db) return; // 数据库还没准备好就跳过

        const col = db.collection('barterItems');
        const existing = await col.limit(1).get();

        if (!existing.empty) {
            console.log("ℹ️ Barter market already seeded.");
            return;
        }

        const seeds = [
            {
                title: 'Ugly Veggie Box',
                description: '5kg mixed veg, slightly crooked but tasty!',
                tradeType: 'both',
                priceCoins: 30,
                lookingFor: 'Mint',
                location: 'College Hall A',
                author: 'Aisha.Farm',
                image: null,
                status: 'available',
                buyer: null,
                createdAt: new Date().toISOString(),
            },
            {
                title: 'Fresh Mint Bundle',
                description: 'Freshly harvested spearmint, smells amazing.',
                tradeType: 'barter',
                priceCoins: 0,
                lookingFor: 'Basil',
                location: 'Library Lobby',
                author: 'Botani_Master',
                image: null,
                status: 'available',
                buyer: null,
                createdAt: new Date().toISOString(),
            },
            {
                title: 'Chili Seedlings x10',
                description: 'Pedas gila. Ready to transplant.',
                tradeType: 'coins',
                priceCoins: 20,
                lookingFor: '',
                location: 'Block N Courtyard',
                author: 'UTM_Agri',
                image: null,
                status: 'available',
                buyer: null,
                createdAt: new Date().toISOString(),
            },
            {
                title: 'Homemade Compost (2kg)',
                description: 'Rich dark compost, great for herbs.',
                tradeType: 'both',
                priceCoins: 15,
                lookingFor: 'Chili Seedlings x10',
                location: 'Dorm Block C',
                author: 'GreenThumb99',
                image: null,
                status: 'available',
                buyer: null,
                createdAt: new Date().toISOString(),
            },
            {
                title: 'Cherry Tomatoes (500g)',
                description: 'Sweet and ripe, harvested this morning.',
                tradeType: 'coins',
                priceCoins: 25,
                lookingFor: '',
                location: 'Cafeteria Side Door',
                author: 'Aisha.Farm',
                image: null,
                status: 'available',
                buyer: null,
                createdAt: new Date().toISOString(),
            },
            {
                title: 'Basil Pesto (homemade)',
                description: 'Made from my own basil patch. No preservatives.',
                tradeType: 'barter',
                priceCoins: 0,
                lookingFor: 'Fresh Mint Bundle',
                location: 'Student Union',
                author: 'GreenThumb99',
                image: null,
                status: 'available',
                buyer: null,
                createdAt: new Date().toISOString(),
            },
            {
                title: 'Watering Can (2L)',
                description: 'Spare one. Good condition, rose head nozzle.',
                tradeType: 'both',
                priceCoins: 40,
                lookingFor: 'Compost',
                location: 'Engineering Faculty Carpark',
                author: 'Botani_Master',
                image: null,
                status: 'available',
                buyer: null,
                createdAt: new Date().toISOString(),
            }
        ];

        const batch = db.batch();
        seeds.forEach(item => {
            const ref = col.doc();
            batch.set(ref, item);
        });
        await batch.commit();
        console.log(`✅ Seeded ${seeds.length} items to Barter Market.`);
    } catch (err) {
        console.error("❌ Seed error:", err.message);
    }
}

// 2. 你的路由现在可以简洁地调用这个函数
router.post('/barter/seed', async (req, res) => {
    await seedBarterDatabase();
    res.json({ success: true, message: "Seed process executed." });
});

router.get('/barter', async (req, res) => {
    try {
        const db = getDb();
        const snapshot = await db.collection('barterItems').orderBy('createdAt', 'desc').get();
        let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // 简单搜索功能
        const { search } = req.query;
        if (search) {
            const keyword = search.toLowerCase();
            items = items.filter(item => item.title.toLowerCase().includes(keyword));
        }
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. 发布物品 (包含智能匹配魔法)
router.post('/barter', async (req, res) => {
    try {
        const db = getDb();
        const { author, title, description, image, tradeType, priceCoins, lookingFor, location } = req.body;

        const newItem = {
            author: author || 'MyFarm',
            title, description, image, tradeType, priceCoins, lookingFor, location,
            status: 'available', // available, reserved, completed
            buyer: null,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('barterItems').add(newItem);

        // --- 🔮 智能撮合魔法 (Smart Matchmaking) ---
        let matchFound = null;
        if (tradeType === 'barter' || tradeType === 'both') {
            // 寻找：有没有人刚好有我想要的 (lookingFor)，并且他想要我有的 (title)
            const matchSnapshot = await db.collection('barterItems')
                .where('status', '==', 'available')
                .where('title', '==', lookingFor) // 对方有的 = 我想要的
                // .where('lookingFor', '==', title) // 理想状态要互相需要，为了MVP演示容易出效果，这里简化为单向匹配
                .limit(1).get();

            if (!matchSnapshot.empty) {
                matchFound = { id: matchSnapshot.docs[0].id, ...matchSnapshot.docs[0].data() };
            }
        }

        res.json({ success: true, id: docRef.id, matchFound });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. 买家预订物品 (Reserve - 冻结资金)
router.post('/barter/:id/reserve', async (req, res) => {
    try {
        const db = getDb();
        const itemRef = db.collection('barterItems').doc(req.params.id);
        const item = (await itemRef.get()).data();
        const buyerName = req.body.buyer || 'MyFarm';

        if (item.status !== 'available') return res.status(400).json({ message: 'Item no longer available' });

        // 如果是金币购买，在此刻扣除买家的钱（冻结在系统里）
        if (req.body.paymentMethod === 'coins') {
            const userRef = db.collection('users').doc('my_account');
            const userDoc = await userRef.get();
            if (userDoc.data().coins < item.priceCoins) {
                return res.status(400).json({ message: 'Not enough coins!' });
            }
            await userRef.update({ coins: userDoc.data().coins - item.priceCoins });
        }

        // 状态变更为已预订
        await itemRef.update({ status: 'reserved', buyer: buyerName, lockedPayment: req.body.paymentMethod });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. 买家确认收货 (Complete - 打款给卖家并评价)
router.post('/barter/:id/complete', async (req, res) => {
    try {
        const db = getDb();
        const itemRef = db.collection('barterItems').doc(req.params.id);
        const item = (await itemRef.get()).data();

        // 完成订单
        await itemRef.update({ status: 'completed' });

        // 如果是金币交易，卖家收钱！(这里省略给卖家加钱的复杂逻辑，假设系统自动处理)
        
        // 增加好评 (Trust System)
        if (req.body.rating) {
            // 这里可以给卖家的信誉加分
        }

        res.json({ success: true, message: 'Transaction Completed!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 虚拟农场访问引擎 (Farm Visits - Mock IoT)
// ==========================================

// 在内存中模拟几个邻居的农场状态
let mockNeighbors = [
    {
        id: 'farm_01', name: 'Aisha.Farm', avatar: '👩‍🌾', plant: 'Tomato',
        moisture: 18, hasBug: true,
        rack: '3-tier',
        tiles: [
            { emoji: '🍅', status: 'danger' },
            { emoji: '🍅', status: 'warning' },
            { emoji: '🌿', status: 'danger' },
            { emoji: '🍅', status: 'healthy' },
            { emoji: '🥬', status: 'warning' },
            { emoji: null },
            { emoji: '🌱', status: 'healthy' },
            { emoji: null },
            { emoji: '🌶️', status: 'danger' },
        ]
    },
    {
        id: 'farm_02', name: 'Botani_Master', avatar: '👨‍🌾', plant: 'Mint',
        moisture: 65, hasBug: false,
        rack: '5-tier',
        tiles: [
            { emoji: '🌿', status: 'healthy' }, { emoji: '🌿', status: 'healthy' },
            { emoji: '🥬', status: 'healthy' }, { emoji: '🌱', status: 'healthy' },
            { emoji: '🌿', status: 'healthy' }, { emoji: '🥬', status: 'healthy' },
            { emoji: '🌱', status: 'healthy' }, { emoji: '🌿', status: 'healthy' },
            { emoji: '🥬', status: 'healthy' }, { emoji: '🌱', status: 'healthy' },
            { emoji: '🌿', status: 'healthy' }, { emoji: null },
            { emoji: '🥬', status: 'healthy' }, { emoji: null },
            { emoji: '🌱', status: 'healthy' }, { emoji: null },
            { emoji: '🌿', status: 'healthy' }, { emoji: null },
            { emoji: '🥬', status: 'healthy' }, { emoji: null },
        ]
    },
    {
        id: 'farm_03', name: 'GreenThumb99', avatar: '🧑‍🌾', plant: 'Basil',
        moisture: 22, hasBug: false,
        rack: 'wall',
        tiles: [
            { emoji: '🥬', status: 'warning' }, { emoji: '🥬', status: 'healthy' },
            { emoji: '🌿', status: 'warning' }, { emoji: '🥬', status: 'healthy' },
            { emoji: '🌱', status: 'healthy' }, { emoji: '🌿', status: 'warning' },
            { emoji: '🥬', status: 'healthy' }, { emoji: '🌱', status: 'healthy' },
            { emoji: '🌿', status: 'healthy' }, { emoji: null },
            { emoji: '🥬', status: 'healthy' }, { emoji: null },
            { emoji: null },                     { emoji: null },
            { emoji: '🌱', status: 'healthy' }, { emoji: null },
            { emoji: '🌿', status: 'healthy' }, { emoji: null },
            { emoji: null },                     { emoji: null },
        ]
    },
    {
        id: 'farm_04', name: 'UTM_Agri', avatar: '🏫', plant: 'Chili',
        moisture: 80, hasBug: true,
        rack: '3-tier',
        tiles: [
            { emoji: '🌶️', status: 'healthy' }, { emoji: '🌶️', status: 'healthy' },
            { emoji: '🌶️', status: 'healthy' }, { emoji: '🌶️', status: 'healthy' },
            { emoji: '🌶️', status: 'healthy' }, { emoji: '🌱', status: 'healthy' },
            { emoji: '🥕', status: 'healthy' },  { emoji: '🥕', status: 'healthy' },
            { emoji: '🥕', status: 'healthy' },
        ]
    },
];

// 1. 获取邻居列表 (带着他们植物的当前状态)
router.get('/visits/neighbors', (req, res) => {
    // 每次请求时，随机让某些植物掉一点水分，增加真实感
    mockNeighbors = mockNeighbors.map(n => {
        if(n.moisture > 10) n.moisture -= Math.floor(Math.random() * 5);
        return n;
    });
    res.json(mockNeighbors);
});

// 2. 帮忙浇水 (给用户加 5 金币，植物变健康)
router.post('/visits/water/:id', async (req, res) => {
    try {
        const farmId = req.params.id;
        const farm = mockNeighbors.find(f => f.id === farmId);
        if (!farm) return res.status(404).json({ message: 'Farm not found' });
        if (farm.moisture > 50) return res.status(400).json({ message: 'Plant does not need water right now!' });

        farm.moisture = 85; // 浇水后湿度拉满

        // 给当前用户加 5 个金币
        const db = getDb();
        const userRef = db.collection('users').doc('my_account');
        const userDoc = await userRef.get();
        const currentCoins = userDoc.exists ? userDoc.data().coins : 100;
        await userRef.update({ coins: currentCoins + 5 });

        res.json({ success: true, message: 'Watered successfully', earned: 5, newTotal: currentCoins + 5 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. 帮忙抓虫 (给用户加 10 金币，虫子消失)
router.post('/visits/catch-bug/:id', async (req, res) => {
    try {
        const farmId = req.params.id;
        const farm = mockNeighbors.find(f => f.id === farmId);
        if (!farm || !farm.hasBug) return res.status(400).json({ message: 'No bugs here!' });

        farm.hasBug = false; // 虫子被抓掉了

        // 给当前用户加 10 个金币
        const db = getDb();
        const userRef = db.collection('users').doc('my_account');
        const userDoc = await userRef.get();
        const currentCoins = userDoc.exists ? userDoc.data().coins : 100;
        await userRef.update({ coins: currentCoins + 10 });

        res.json({ success: true, message: 'Bug caught!', earned: 10, newTotal: currentCoins + 10 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. 最后的导出 (现在 seedBarterDatabase 有定义了，不会报错了)
module.exports = {
    router,              
    seedBarterDatabase   
};