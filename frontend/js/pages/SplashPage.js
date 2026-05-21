import { showScreen } from '../utils/navigation.js';

export function render() {
    const container = document.getElementById('screenContainer');
    container.innerHTML = `
        <div class="screen active" id="splashScreen">
            <div class="splash-inner" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px;">
                <div class="splash-badge" style="font-size:0.72rem; background:var(--accent-l); padding:8px 16px; border-radius:30px;">Smart Vertical Farm</div>

                <div class="splash-visual" style="margin:24px 0 18px;">
                    <div class="splash-plant-icon">🌿</div>
                    <span class="water-drop d1"></span>
                    <span class="water-drop d2"></span>
                    <span class="water-drop d3"></span>
                </div>

                <h1 style="font-size:2.35rem;">SeedDown</h1>
                <p style="color:var(--sub); text-align:center; margin:18px 0 24px;">AI-powered farming intelligence for urban vertical farms</p>

                <button class="btn-primary" id="getStartedBtn" style="margin-top:24px;">Get Started →</button>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; width:100%; margin-top:30px;">
                    <div class="splash-feature" style="background:var(--surface); padding:16px; border-radius:18px;"><span>📡</span> Live IoT</div>
                    <div class="splash-feature" style="background:var(--surface); padding:16px; border-radius:18px;"><span>🌱</span> Smart Alerts</div>
                    <div class="splash-feature" style="background:var(--surface); padding:16px; border-radius:18px;"><span>🏘️</span> Community</div>
                    <div class="splash-feature" style="background:var(--surface); padding:16px; border-radius:18px;"><span>📦</span> Package Guide</div>
                </div>

                <div class="splash-package-card">
                    <div class="package-title">IoT Package</div>
                    <div class="package-grid">
                        ${packageItem('Beginner · 3', 'Starter · Standard · Pro')}
                        ${packageItem('Commercial · 3', 'Farm Master · Zone Node · Legacy Pro')}
                    </div>
                </div>
            </div>
        </div>
    `;
    ensureSplashStyles();
    document.getElementById('getStartedBtn')?.addEventListener('click', () => showScreen('login'));
}

function packageItem(name, detail) {
    return `
        <div class="package-item">
            <strong>${name}</strong>
            <span>${detail}</span>
        </div>
    `;
}

function ensureSplashStyles() {
    if (document.getElementById('splash-polish-style')) return;
    const style = document.createElement('style');
    style.id = 'splash-polish-style';
    style.textContent = `
        #splashScreen {
            background: #ffffff !important;
            color: #12312f;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        #splashScreen *,
        #splashScreen *::before,
        #splashScreen *::after {
            box-sizing: border-box;
        }
        #splashScreen .splash-inner {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
        }
        #splashScreen .splash-badge {
            color: #0f766e;
            border: 1.5px solid #0f766e;
            font-weight: 800;
            letter-spacing: .04em;
        }
        #splashScreen h1 {
            margin: 0;
            color: #12312f;
            font-weight: 800;
            letter-spacing: 0;
            line-height: 1.05;
        }
        #splashScreen p {
            max-width: 390px;
            font-size: 16px;
            line-height: 1.55;
        }
        .splash-visual {
            position: relative;
            width: 136px;
            height: 136px;
            display: grid;
            place-items: center;
            border-radius: 30px;
            background: rgba(255, 255, 255, .84);
            border: 1.5px solid #0f766e;
            box-shadow: 0 14px 34px rgba(15, 118, 110, .14);
            overflow: hidden;
        }
        .splash-plant-icon {
            position: relative;
            z-index: 2;
            font-size: 82px;
            line-height: 1;
            filter: drop-shadow(0 10px 16px rgba(15, 118, 110, .18));
            animation: plantBreath 2.8s ease-in-out infinite;
        }
        .splash-visual:after {
            content: "";
            position: absolute;
            left: 22px;
            right: 22px;
            bottom: 18px;
            height: 12px;
            border-radius: 999px;
            background: rgba(15, 118, 110, .12);
        }
        .water-drop {
            position: absolute;
            top: 16px;
            width: 9px;
            height: 16px;
            border-radius: 999px 999px 999px 2px;
            background: #22d3ee;
            transform: rotate(35deg);
            opacity: 0;
            animation: cleanDrop 1.45s ease-in-out infinite;
        }
        .water-drop.d1 { left: 36px; animation-delay: 0s; }
        .water-drop.d2 { left: 62px; animation-delay: .22s; }
        .water-drop.d3 { left: 88px; animation-delay: .44s; }
        .splash-package-card {
            width: 100%;
            margin-top: 18px;
            padding: 16px;
            border-radius: 20px;
            background: rgba(255, 255, 255, .86);
            border: 1.5px solid #0f766e;
            box-shadow: 0 10px 26px rgba(15, 118, 110, .08);
        }
        .package-title {
            margin-bottom: 12px;
            color: #0f766e;
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: .04em;
        }
        .package-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        .package-item {
            min-height: 94px;
            border-radius: 16px;
            padding: 15px;
            background: #f7fffd;
            border: 1.5px solid #115e59;
            animation: packageFloat 3s ease-in-out infinite;
        }
        .package-item:nth-child(2) { animation-delay: .18s; }
        .package-item:nth-child(3) { animation-delay: .36s; }
        .package-item strong {
            display: block;
            color: #12312f;
            font-size: 16px;
            font-weight: 800;
        }
        .package-item span {
            display: block;
            margin-top: 10px;
            color: #64748b;
            font-size: 13px;
            line-height: 1.4;
            font-weight: 600;
        }
        .splash-feature {
            border: 1.5px solid #115e59;
            box-shadow: 0 8px 22px rgba(15, 118, 110, .07);
            color: #12312f;
            min-height: 58px;
            display: flex;
            align-items: center;
            font-size: 15px;
            font-weight: 750;
        }
        .splash-feature span {
            display: inline-block;
            margin-right: 8px;
            font-size: 20px;
        }
        #splashScreen .btn-primary {
            min-height: 50px;
            padding: 0 24px;
            border-radius: 16px;
            font-size: 15px;
            font-weight: 800;
        }
        @keyframes plantBreath {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-2px) scale(1.035); }
        }
        @keyframes cleanDrop {
            0% { opacity: 0; transform: translateY(-10px) rotate(35deg) scale(.86); }
            22% { opacity: 1; }
            100% { opacity: 0; transform: translateY(78px) rotate(35deg) scale(1); }
        }
        @keyframes packageFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
        }
        @media (max-width: 380px) {
            .package-grid {
                grid-template-columns: 1fr;
            }
        }
        @media (max-width: 430px) {
            #splashScreen .splash-inner {
                max-width: 100%;
                padding-left: 18px !important;
                padding-right: 18px !important;
            }
            .package-grid {
                grid-template-columns: 1fr;
            }
            .splash-feature {
                font-size: 14px;
            }
        }
    `;
    document.head.appendChild(style);
}
