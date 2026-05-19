const jwt = require('jsonwebtoken');

// 记得在 .env 设置这个密码，或者暂时先用这个
const JWT_SECRET = process.env.JWT_SECRET || 'seeddown_super_secret_2026';

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // 取得 "Bearer <token>" 后面的 token
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ ok: false, error: "Access Denied. No token provided." });
    }

    try {
        // 解密 Token
        const verified = jwt.verify(token, JWT_SECRET);
        
        // 【关键】把解密出来的 user 资料挂在 req 上，这样你的 Controller 就能用了
        req.user = verified; 
        
        next(); // 通关，前往你的 Controller
    } catch (err) {
        res.status(403).json({ ok: false, error: "Invalid or expired token" });
    }
}

module.exports = verifyToken;