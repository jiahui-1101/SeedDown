const express = require('express');
// 引入你的 JWT Security Guard
const verifyToken = require('../middleware/authMiddleware');
const { getFirestore } = require('firebase-admin/firestore');

const {
  scanPlants,
  analyzeDisease,
  generate3D,
  createFarm,
} = require('../controllers/farmController');

const router = express.Router();
const db = getFirestore();

// 把原本的 API 都加上 verifyToken 保护
router.post('/scan-plants', verifyToken, scanPlants);
router.post('/analyze-disease', verifyToken, analyzeDisease);
router.post('/generate-3d', verifyToken, generate3D);

// 创建农场 (现在 createFarm 里面可以直接拿 req.user.userId 了！)
router.post('/create', verifyToken, createFarm);

// ─── 新增：拉取该用户专属的农场 ───
router.get('/', verifyToken, async (req, res) => {
    try {
        const currentUserId = req.user.userId; // Middleware 帮你解密出来的
        
        // 只拿属于这个人的农场
        const snapshot = await db.collection('farms').where('ownerId', '==', currentUserId).get();
        
        const farms = [];
        snapshot.forEach(doc => farms.push({ id: doc.id, ...doc.data() }));

        res.status(200).json({ ok: true, farms });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const db = require('../config/db').getDb();
        // 確認刪除的是自己的農場
        const docRef = db.collection('farms').doc(req.params.id);
        const doc = await docRef.get();
        if (doc.exists && doc.data().ownerId === req.user.userId) {
            await docRef.delete();
        }
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false });
    }
});

module.exports = router;