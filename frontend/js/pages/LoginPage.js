import { showScreen } from '../utils/navigation.js';
import { showToast }  from '../utils/toast.js';
import { AppState }   from '../store.js';

/* ── GUEST DEMO ACCOUNT (real backend account) ── */
const GUEST_EMAIL    = 'demo@seeddown.com';
const GUEST_PASSWORD = 'seeddown2026';

// 动态解析后端 API 地址
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

export function render() {
    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="loginScreen" style="
            background: linear-gradient(160deg, #ecfeff 0%, #f8fffe 100%);
            display:flex; flex-direction:column; justify-content:center;
            min-height:100vh; padding:0;
        ">
            <div style="flex:1; padding:36px 24px; display:flex; flex-direction:column; justify-content:center; max-width:420px; margin:0 auto; width:100%;">

                <div style="text-align:center; margin-bottom:36px;">
                    <div style="font-size:3rem; margin-bottom:8px;">🌿</div>
                    <div style="font-size:1.6rem; font-weight:800; color:#1a2b3c; letter-spacing:-0.5px;">SeedDown</div>
                    <div style="font-size:0.75rem; color:#64748b; margin-top:4px; letter-spacing:0.05em;">SMART FARM MANAGEMENT</div>
                </div>

                <div style="margin-bottom:24px;">
                    <div style="font-size:0.65rem; font-weight:700; color:#64748b; letter-spacing:0.1em; margin-bottom:10px;">SELECT FARMING MODE</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div id="modeBeginner" style="
                            background:white; border:2px solid #0f766e;
                            border-radius:14px; padding:14px 12px; cursor:pointer;
                            box-shadow:0 2px 12px rgba(15,118,110,0.12);
                            transition:all 0.2s;
                        ">
                            <span style="font-size:24px;">🌱</span>
                            <div style="font-weight:700; font-size:0.85rem; margin-top:6px; color:#1a2b3c;">Beginner</div>
                            <div style="font-size:0.65rem; color:#64748b; margin-top:2px;">Guided experience</div>
                        </div>
                        <div id="modeCommercial" style="
                            background:white; border:2px solid #e2e8f0;
                            border-radius:14px; padding:14px 12px; cursor:pointer;
                            transition:all 0.2s;
                        ">
                            <span style="font-size:24px;">🏭</span>
                            <div style="font-weight:700; font-size:0.85rem; margin-top:6px; color:#1a2b3c;">Commercial</div>
                            <div style="font-size:0.65rem; color:#64748b; margin-top:2px;">Pro data dashboard</div>
                        </div>
                    </div>
                </div>

                <div style="background:white; border-radius:20px; padding:24px; box-shadow:0 4px 24px rgba(0,0,0,0.07); border:1px solid #e2e8f0;">

                    <div style="display:flex; background:#f1f5f9; border-radius:10px; padding:3px; margin-bottom:20px;">
                        <button id="tabLogin" style="
                            flex:1; padding:8px; border:none; border-radius:8px;
                            background:white; font-weight:700; font-size:0.8rem;
                            color:#1a2b3c; cursor:pointer;
                            box-shadow:0 1px 4px rgba(0,0,0,0.08); transition:all 0.2s;
                        ">Sign In</button>
                        <button id="tabRegister" style="
                            flex:1; padding:8px; border:none; border-radius:8px;
                            background:transparent; font-weight:600; font-size:0.8rem;
                            color:#64748b; cursor:pointer; transition:all 0.2s;
                        ">Register</button>
                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="font-size:0.7rem; font-weight:700; color:#374151; display:block; margin-bottom:6px;">Email</label>
                        <input type="email" id="loginEmail" placeholder="farmer@email.com" style="
                            width:100%; padding:11px 14px; border-radius:10px;
                            border:1.5px solid #e2e8f0; font-size:0.85rem;
                            outline:none; font-family:inherit; color:#1a2b3c;
                            box-sizing:border-box; transition:border-color 0.15s;
                        " onfocus="this.style.borderColor='#0f766e'" onblur="this.style.borderColor='#e2e8f0'">
                    </div>

                    <div style="margin-bottom:8px; position:relative;">
                        <label style="font-size:0.7rem; font-weight:700; color:#374151; display:block; margin-bottom:6px;">Password</label>
                        <input type="password" id="loginPassword" placeholder="••••••••" style="
                            width:100%; padding:11px 40px 11px 14px; border-radius:10px;
                            border:1.5px solid #e2e8f0; font-size:0.85rem;
                            outline:none; font-family:inherit; color:#1a2b3c;
                            box-sizing:border-box; transition:border-color 0.15s;
                        " onfocus="this.style.borderColor='#0f766e'" onblur="this.style.borderColor='#e2e8f0'">
                        <button id="togglePw" style="
                            position:absolute; right:12px; bottom:11px;
                            background:none; border:none; cursor:pointer;
                            font-size:0.85rem; color:#94a3b8;
                        ">👁</button>
                    </div>

                    <div id="forgotRow" style="text-align:right; margin-bottom:16px;">
                        <button id="forgotBtn" style="
                            background:none; border:none; font-size:0.7rem;
                            color:#0f766e; cursor:pointer; font-weight:600;
                        ">Forgot password?</button>
                    </div>

                    <div id="confirmRow" style="display:none; margin-bottom:16px;">
                        <div style="margin-bottom:12px;">
                            <label style="font-size:0.7rem; font-weight:700; color:#374151; display:block; margin-bottom:6px;">Confirm Password</label>
                            <input type="password" id="loginConfirm" placeholder="••••••••" style="
                                width:100%; padding:11px 14px; border-radius:10px;
                                border:1.5px solid #e2e8f0; font-size:0.85rem;
                                outline:none; font-family:inherit; color:#1a2b3c;
                                box-sizing:border-box; transition:border-color 0.15s;
                            " onfocus="this.style.borderColor='#0f766e'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
                        
                        <div style="display:flex; align-items:flex-start; gap:8px; margin-top:14px; padding:8px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                            <input type="checkbox" id="tncCheckbox" style="margin-top:2px; accent-color:#0f766e; cursor:pointer;">
                            <label for="tncCheckbox" style="font-size:0.7rem; color:#475569; line-height:1.4; cursor:pointer;">
                                I agree to the <span style="color:#0f766e; font-weight:600; text-decoration:underline;">Terms & Conditions</span> and <span style="color:#0f766e; font-weight:600; text-decoration:underline;">Privacy Policy</span>. I consent to the collection and use of my farm data for AI analysis.
                            </label>
                        </div>
                    </div>

                    <div id="loginError" style="
                        display:none; background:#fef2f2; border:1px solid #fecaca;
                        border-radius:8px; padding:10px 12px; margin-bottom:12px;
                        font-size:0.75rem; color:#dc2626;
                    "></div>

                    <button id="loginBtn" style="
                        width:100%; padding:13px; border:none; border-radius:12px;
                        background:linear-gradient(135deg, #0f766e, #14b8a6);
                        color:white; font-weight:700; font-size:0.9rem; cursor:pointer;
                        box-shadow:0 4px 12px rgba(37,99,235,0.3);
                        transition:opacity 0.2s; margin-bottom:12px;
                    ">Sign In →</button>

                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                        <div style="flex:1; height:1px; background:#e2e8f0;"></div>
                        <span style="font-size:0.7rem; color:#94a3b8;">or</span>
                        <div style="flex:1; height:1px; background:#e2e8f0;"></div>
                    </div>

                    <button id="guestBtn" style="
                        width:100%; padding:11px; border:1.5px dashed #cbd5e1;
                        border-radius:12px; background:transparent; cursor:pointer;
                        font-weight:600; font-size:0.82rem; color:#64748b;
                        transition:all 0.2s;
                    ">👀 View as Guest (Demo)</button>

                </div>

                <div style="text-align:center; margin-top:20px; font-size:0.65rem; color:#94a3b8;">
                    Powered by PERSAKA <span style="color:#ef4444;">UTM</span>
                </div>
            </div>
        </div>
    `;

    _bindEvents();
}

function _bindEvents() {
    let selectedMode = 'beginner';
    let isRegister   = false;

    const modeBeginner   = document.getElementById('modeBeginner');
    const modeCommercial = document.getElementById('modeCommercial');

    modeBeginner.addEventListener('click', () => {
        selectedMode = 'beginner';
        modeBeginner.style.borderColor   = '#0f766e';
        modeBeginner.style.boxShadow     = '0 2px 12px rgba(15,118,110,0.12)';
        modeCommercial.style.borderColor = '#e2e8f0';
        modeCommercial.style.boxShadow   = 'none';
    });
    modeCommercial.addEventListener('click', () => {
        selectedMode = 'commercial';
        modeCommercial.style.borderColor = '#0f766e';
        modeCommercial.style.boxShadow   = '0 2px 12px rgba(15,118,110,0.12)';
        modeBeginner.style.borderColor   = '#e2e8f0';
        modeBeginner.style.boxShadow     = 'none';
    });

    document.getElementById('tabLogin').addEventListener('click', () => {
        isRegister = false;
        document.getElementById('tabLogin').style.background    = 'white';
        document.getElementById('tabLogin').style.color         = '#1a2b3c';
        document.getElementById('tabLogin').style.boxShadow     = '0 1px 4px rgba(0,0,0,0.08)';
        document.getElementById('tabRegister').style.background = 'transparent';
        document.getElementById('tabRegister').style.color      = '#64748b';
        document.getElementById('tabRegister').style.boxShadow  = 'none';
        document.getElementById('loginBtn').textContent         = 'Sign In →';
        document.getElementById('forgotRow').style.display      = 'block';
        document.getElementById('confirmRow').style.display     = 'none';
        _clearError();
    });

    document.getElementById('tabRegister').addEventListener('click', () => {
        isRegister = true;
        document.getElementById('tabRegister').style.background = 'white';
        document.getElementById('tabRegister').style.color      = '#1a2b3c';
        document.getElementById('tabRegister').style.boxShadow  = '0 1px 4px rgba(0,0,0,0.08)';
        document.getElementById('tabLogin').style.background    = 'transparent';
        document.getElementById('tabLogin').style.color         = '#64748b';
        document.getElementById('tabLogin').style.boxShadow     = 'none';
        document.getElementById('loginBtn').textContent         = 'Create Account →';
        document.getElementById('forgotRow').style.display      = 'none';
        document.getElementById('confirmRow').style.display     = 'block';
        _clearError();
    });

    document.getElementById('togglePw').addEventListener('click', () => {
        const pw = document.getElementById('loginPassword');
        pw.type = pw.type === 'password' ? 'text' : 'password';
    });

    // 忘记密码逻辑 -> 改为对接自建后端
    document.getElementById('forgotBtn').addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value.trim();
        if (!email) { _showError('Enter your email first.'); return; }
        try {
            const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            showToast('success', '📧 Reset link request processed. Check your inbox if registered.');
        } catch (err) {
            _showError('Unable to send reset request.');
        }
    });

    // 登录 / 注册核心逻辑 -> 全盘接上自建 Node.js JWT 后端
    document.getElementById('loginBtn').addEventListener('click', async () => {
        const email    = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const confirm  = document.getElementById('loginConfirm')?.value;
        const tncCheck = document.getElementById('tncCheckbox')?.checked;

        if (!email || !password)               { _showError('Please fill in all fields.'); return; }
        
        if (isRegister) {
            if (password !== confirm)          { _showError('Passwords do not match.'); return; }
            if (password.length < 6)           { _showError('Password must be at least 6 characters.'); return; }
            if (!tncCheck)                     { _showError('You must agree to the Terms & Conditions.'); return; }
        }

        _setLoading(true);
        _clearError();

        try {
            if (isRegister) {
                // 1. 调用后端注册接口
                const res = await fetch(`${API_BASE}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, mode: selectedMode })
                });
                const data = await res.json();
                if (!res.ok || data.ok === false) throw new Error(data.error || 'Registration failed');
                
                showToast('success', '🎉 Account created! Please sign in.');
                document.getElementById('tabLogin').click(); // 自动跳回 Sign In 选项卡
            } else {
                // 2. 调用后端登录接口
                const res = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (!res.ok || data.ok === false) throw new Error(data.error || 'Invalid email or password');

                // 保存后端下发的 JWT Token
                localStorage.setItem('token', data.token);
                
                // 模拟一个合规的 User 结构传给 _onLoginSuccess
                const mockFirebaseUser = { uid: data.user.email, email: data.user.email };
                await _onLoginSuccess(data.user.mode, mockFirebaseUser, false);
            }
        } catch (err) {
            _showError(err.message || 'Something went wrong. Please try again.');
        } finally {
            _setLoading(false);
        }
    });

/* ── Guest 模式 ── */
    document.getElementById('guestBtn').addEventListener('click', async () => {
        _clearError();

        _setLoading(true);
        
        try {
            // 1. 先尝试直接登录 Demo 账号
            let res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: GUEST_EMAIL, password: GUEST_PASSWORD })
            });
            let data = await res.json();

            // 2. 如果后端说 "User not found" (代表新数据库还没这个账号)，就自动帮它注册！
            if (!res.ok && data.error === "User not found") {
                console.log('[LoginPage] Demo account missing. Auto-creating...');
                const regRes = await fetch(`${API_BASE}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: GUEST_EMAIL, password: GUEST_PASSWORD, mode: selectedMode })
                });
                
                if (!regRes.ok) throw new Error('Failed to auto-create demo account');

                // 创建成功后，再次尝试 Login
                res = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: GUEST_EMAIL, password: GUEST_PASSWORD })
                });
                data = await res.json();
            }

            // 3. 最后检查登入结果
            if (!res.ok || data.ok === false) {
                throw new Error(data.error || 'Guest login failed');
            }

            localStorage.setItem('token', data.token);
            
            const mockFirebaseUser = { uid: data.user.email, email: data.user.email };
            await _onLoginSuccess(selectedMode, mockFirebaseUser, true);
            
        } catch (err) {
            showToast('error', 'Demo mode unavailable. Please sign in or register.');
            console.warn('[LoginPage] Guest login error:', err);
        } finally {
            _setLoading(false);
        }
    });
}

/* ── ON LOGIN SUCCESS — 改成去你的 Node.js 后端拉取用户专属农场数据 ── */
async function _onLoginSuccess(mode, user, isGuest) {
    // 每次登入强制洗空旧缓存，完美防污染
    localStorage.removeItem('user_farms');
    localStorage.removeItem('farm_profile');
    
    AppState.mode      = mode;
    AppState.isGuest   = isGuest;
    AppState.uid       = user.uid;
    AppState.userEmail = user.email || '';
    AppState.userName  = isGuest
        ? 'Guest'
        : (user.displayName || user.email?.split('@')[0] || 'Farmer');
    localStorage.setItem('seeddown_mode', mode);

    // 从你的自建 Node.js 后端抓取 ownerId 属于当前用户的专属 Farms 列表
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/farms`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` } // 附带刚拿到的 Bearer Token
        });
        const data = await res.json();
        
        if (data.ok && data.farms?.length) {
            localStorage.setItem('user_farms', JSON.stringify(data.farms));
        } else {
            localStorage.setItem('user_farms', JSON.stringify([]));
        }
    } catch (e) {
        console.warn('[LoginPage] Could not load backend data, fallback to empty:', e);
        localStorage.setItem('user_farms', JSON.stringify([]));
    }

    const greeting = isGuest ? '👀 Welcome, Guest!' : `👋 Welcome, ${AppState.userName}!`;
    showToast('success', greeting);
    // 👉 加上這行，確保全域狀態更新
    AppState.notify();
    showScreen('farmlist');
}

function _setLoading(on) {
    const btn  = document.getElementById('loginBtn');
    const gBtn = document.getElementById('guestBtn');
    if (!btn) return;
    btn.disabled       = on;
    gBtn.disabled      = on;
    btn.style.opacity  = on ? '0.6' : '1';
    gBtn.style.opacity = on ? '0.4' : '1';
    if (on) btn.textContent = 'Please wait…';
}

function _showError(msg) {
    const el = document.getElementById('loginError');
    if (!el) return;
    el.textContent   = msg;
    el.style.display = 'block';
}

function _clearError() {
    const el = document.getElementById('loginError');
    if (el) el.style.display = 'none';
}
