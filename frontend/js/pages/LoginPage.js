import { showScreen } from '../utils/navigation.js';
import { showToast }  from '../utils/toast.js';
import { AppState }   from '../store.js';
import { initFirebase, getAuth, loadUserData } from '../utils/firebase.js';

/* ── GUEST DEMO ACCOUNT (real Firebase account) ── */
const GUEST_EMAIL    = 'demo@seeddown.com';
const GUEST_PASSWORD = '666666';

async function _initFirebase() {
    await initFirebase();
    return getAuth();
}

export function render() {
    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="loginScreen" style="
            background: linear-gradient(160deg, #f0fdf4 0%, #eff6ff 100%);
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
                            background:white; border:2px solid #2563eb;
                            border-radius:14px; padding:14px 12px; cursor:pointer;
                            box-shadow:0 2px 12px rgba(37,99,235,0.12);
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
                        " onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'">
                    </div>

                    <div style="margin-bottom:8px; position:relative;">
                        <label style="font-size:0.7rem; font-weight:700; color:#374151; display:block; margin-bottom:6px;">Password</label>
                        <input type="password" id="loginPassword" placeholder="••••••••" style="
                            width:100%; padding:11px 40px 11px 14px; border-radius:10px;
                            border:1.5px solid #e2e8f0; font-size:0.85rem;
                            outline:none; font-family:inherit; color:#1a2b3c;
                            box-sizing:border-box; transition:border-color 0.15s;
                        " onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'">
                        <button id="togglePw" style="
                            position:absolute; right:12px; bottom:11px;
                            background:none; border:none; cursor:pointer;
                            font-size:0.85rem; color:#94a3b8;
                        ">👁</button>
                    </div>

                    <div id="forgotRow" style="text-align:right; margin-bottom:16px;">
                        <button id="forgotBtn" style="
                            background:none; border:none; font-size:0.7rem;
                            color:#2563eb; cursor:pointer; font-weight:600;
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
                            " onfocus="this.style.borderColor='#2563eb'" onblur="this.style.borderColor='#e2e8f0'">
                        </div>
                        
                        <div style="display:flex; align-items:flex-start; gap:8px; margin-top:14px; padding:8px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0;">
                            <input type="checkbox" id="tncCheckbox" style="margin-top:2px; accent-color:#2563eb; cursor:pointer;">
                            <label for="tncCheckbox" style="font-size:0.7rem; color:#475569; line-height:1.4; cursor:pointer;">
                                I agree to the <span style="color:#2563eb; font-weight:600; text-decoration:underline;">Terms & Conditions</span> and <span style="color:#2563eb; font-weight:600; text-decoration:underline;">Privacy Policy</span>. I consent to the collection and use of my farm data for AI analysis.
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
                        background:linear-gradient(135deg, #2563eb, #1d4ed8);
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
        modeBeginner.style.borderColor   = '#2563eb';
        modeBeginner.style.boxShadow     = '0 2px 12px rgba(37,99,235,0.12)';
        modeCommercial.style.borderColor = '#e2e8f0';
        modeCommercial.style.boxShadow   = 'none';
    });
    modeCommercial.addEventListener('click', () => {
        selectedMode = 'commercial';
        modeCommercial.style.borderColor = '#2563eb';
        modeCommercial.style.boxShadow   = '0 2px 12px rgba(37,99,235,0.12)';
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

    document.getElementById('forgotBtn').addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value.trim();
        if (!email) { _showError('Enter your email first.'); return; }
        try {
            const auth = await _initFirebase();
            await auth.sendPasswordResetEmail(email);
            showToast('success', '📧 Reset email sent! Check your inbox.');
        } catch (err) {
            _showError(_friendlyError(err.code));
        }
    });

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
            const auth = await _initFirebase();
            if (isRegister) {
                await auth.createUserWithEmailAndPassword(email, password);
                showToast('success', '🎉 Account created!');
            } else {
                await auth.signInWithEmailAndPassword(email, password);
            }
            await _onLoginSuccess(selectedMode, auth.currentUser, false);
        } catch (err) {
            _showError(_friendlyError(err.code));
        } finally {
            _setLoading(false);
        }
    });

    /* ── Guest — prompts for password, then silently signs into demo@seeddown.com ── */
    document.getElementById('guestBtn').addEventListener('click', async () => {
        _clearError();
        
        const guestInput = prompt('Enter Demo Access Code to continue as Guest:');
        
        // Check if user clicked Cancel or left it blank
        if (guestInput === null) return; 
        
        if (guestInput !== GUEST_PASSWORD) {
            _showError('Incorrect Demo Access Code.');
            return;
        }

        _setLoading(true);
        
        try {
            const auth = await _initFirebase();
            await auth.signInWithEmailAndPassword(GUEST_EMAIL, GUEST_PASSWORD);
            await _onLoginSuccess(selectedMode, auth.currentUser, true);
        } catch (err) {
            // If demo account doesn't exist yet, create it
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                try {
                    const auth2 = await _initFirebase();
                    await auth2.createUserWithEmailAndPassword(GUEST_EMAIL, GUEST_PASSWORD);
                    await _onLoginSuccess(selectedMode, auth2.currentUser, true);
                } catch (createErr) {
                    console.warn('[LoginPage] Guest account creation failed:', createErr);
                    showToast('error', 'Demo mode unavailable. Please sign in.');
                }
            } else {
                showToast('error', 'Could not load demo. Please try again.');
                console.warn('[LoginPage] Guest login error:', err);
            }
        } finally {
            _setLoading(false);
        }
    });
}

/* ── ON LOGIN SUCCESS — load Firestore data into localStorage ── */
async function _onLoginSuccess(mode, user, isGuest) {
    AppState.mode      = mode;
    AppState.isGuest   = isGuest;
    AppState.uid       = user.uid;
    AppState.userEmail = user.email || '';
    AppState.userName  = isGuest
        ? 'Guest'
        : (user.displayName || user.email?.split('@')[0] || 'Farmer');
    localStorage.setItem('seeddown_mode', mode);

    // Load all user data from Firestore → write into localStorage
    try {
        const { loadUserData } = await import('../utils/firebase.js');
        const data = await loadUserData(user.uid);
        if (data) {
            if (data.farms?.length) {
                localStorage.setItem('user_farms', JSON.stringify(data.farms));
            }
            if (data.globalProfile) {
                localStorage.setItem('farm_profile', JSON.stringify(data.globalProfile));
            }
            if (data.farmProfiles) {
                Object.entries(data.farmProfiles).forEach(([farmId, profile]) => {
                    localStorage.setItem(`farm_profile_${farmId}`, JSON.stringify(profile));
                });
            }
        }
    } catch (e) {
        console.warn('[LoginPage] Could not load Firestore data:', e);
    }

    const greeting = isGuest ? '👀 Welcome, Guest!' : `👋 Welcome, ${AppState.userName}!`;
    showToast('success', greeting);
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

function _friendlyError(code) {
    const map = {
        'auth/user-not-found':         'No account found with this email.',
        'auth/wrong-password':         'Incorrect password. Try again.',
        'auth/email-already-in-use':   'This email is already registered.',
        'auth/invalid-email':          'Please enter a valid email address.',
        'auth/weak-password':          'Password must be at least 6 characters.',
        'auth/too-many-requests':      'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/invalid-credential':     'Invalid email or password.',
    };
    return map[code] || 'Something went wrong. Please try again.';
}
