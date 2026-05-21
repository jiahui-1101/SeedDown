// 文件路径: src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');
const verifyToken = require('../middleware/authMiddleware'); // 新增引入 middleware

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'seeddown_super_secret_2026';

// 1. 注册 API
router.post('/register', async (req, res) => {
    try {
        const { email, password, mode } = req.body;
        const db = getDb();
        
        // 检查 Email 是否已经被注册
        const userRef = db.collection('users').doc(email);
        const doc = await userRef.get();
        if (doc.exists) {
            return res.status(400).json({ ok: false, error: "Email already exists" });
        }

        // 把密码 Hash 加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 存进 Database
        await userRef.set({
            email,
            password: hashedPassword,
            mode: mode || 'beginner',
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ ok: true, message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// 2. 登入 API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDb();

        const userRef = db.collection('users').doc(email);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).json({ ok: false, error: "User not found" });
        }

        const user = doc.data();

        // 验证密码是否正确
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ ok: false, error: "Wrong password" });
        }

        // 制造 JWT Token (把 email 作为 userId 塞进去)
        const token = jwt.sign(
            { userId: email, mode: user.mode }, 
            JWT_SECRET, 
            { expiresIn: '7d' } 
        );

        res.json({ ok: true, token, user: { email: user.email, mode: user.mode } });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!email) {
            return res.status(400).json({ ok: false, error: 'Email is required' });
        }

        const db = getDb();
        const doc = await db.collection('users').doc(email).get();
        if (doc.exists) {
            await db.collection('passwordResetRequests').add({
                email,
                status: 'requested',
                createdAt: new Date().toISOString(),
            });
        }

        res.json({
            ok: true,
            message: 'If this email is registered, a reset request has been recorded.',
        });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// ─── 3. 获取个人资料 API (新增) ───
router.get('/me', verifyToken, async (req, res) => {
    try {
        const db = getDb();
        const userRef = db.collection('users').doc(req.user.userId);
        const doc = await userRef.get();
        
        if (!doc.exists) {
            return res.status(404).json({ ok: false, error: "User not found" });
        }
        
        const userData = doc.data();
        delete userData.password; // 移除密码后再返回给前端
        
        res.json({ ok: true, user: userData });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// ─── 4. 更新个人资料 API (新增) ───
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const db = getDb();
        
        // 更新用户的 name
        await db.collection('users').doc(req.user.userId).update({ 
            name: name || ''
        });
        
        res.json({ ok: true, message: "Profile updated" });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

module.exports = router;
