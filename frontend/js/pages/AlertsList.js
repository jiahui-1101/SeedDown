import { API_BASE } from '../utils/apiBase.js';
import { showScreen } from '../utils/navigation.js';
import { showToast } from '../utils/toast.js';
import { AppState } from '../store.js';

let predictMinutes = 45;

// 1. 页面外壳 (保持原样)
export function render() {
    return `
        <div style="padding:20px; background:#F9FBF9; min-height:100vh; font-family:sans-serif;">
            <div style="background:#FFFFFF; border-radius:24px; padding:16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; border:1px solid #EDF2F0; box-shadow:0 4px 12px rgba(0,0,0,0.02);">
                <span style="font-size:0.9rem; font-weight:700; color:#064E3B;">Predict Window:</span>
                <select id="predictTimeSelect" style="border:none; background:#F0FDF4; color:#065F46; padding:8px 12px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                    <option value="30">30 Mins</option>
                    <option value="45" ${predictMinutes === 45 ? 'selected' : ''}>45 Mins</option>
                    <option value="60">60 Mins</option>
                </select>
            </div>
            <div id="dynamicAlertsList">
                <div style="text-align:center; padding:60px; color:#94A3B8;">🛰️ AI engine analyzing trends...</div>
            </div>
        </div>
    `;
}

// 2. 初始化 (保持原样)
export async function init() {
    const select = document.getElementById('predictTimeSelect');
    if (select) {
        select.onchange = (e) => {
            predictMinutes = parseInt(e.target.value);
            showToast('success', `AI calibrating for ${predictMinutes}m...`);
            loadAlertData();
        };
    }
    loadAlertData();
}

// 3. 核心逻辑 (完全保留你的 Firebase + Gemini 逻辑)
async function loadAlertData() {
    const listContainer = document.getElementById('dynamicAlertsList');
    if (!listContainer) return;

    try {
        const deviceId = 'farm_001';
        const [latestRes, historyRes, prefRes] = await Promise.all([
            fetch(`${API_BASE}/api/sensors/latest?deviceId=${deviceId}`),
            fetch(`${API_BASE}/api/sensors/history?deviceId=${deviceId}&limit=10`),
            fetch(`${API_BASE}/api/sensors/preferences?deviceId=${deviceId}`)
        ]);

        const latest = await latestRes.json();
        const history = await historyRes.json();
        const prefs = await prefRes.json();
        
        const r = latest.reading || { temperature: 24 };
        const hPoints = history.readings ? history.readings.map(item => item.temperature).join(', ') : '22, 23, 24';

        const aiRes = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `As an AI Farm Expert, analyze temp ${r.temperature}C and trend [${hPoints}]. Limit: ${prefs.tempMax || 30}C. 
                          If a risk exists in ${predictMinutes}m, respond ONLY in this format: 
                          "TITLE: [Problem] | DESC: [Analysis]".
                          If stable, reply: "STABLE".`,
                history: [] 
            })
        });

        const aiData = await aiRes.json();
        const aiRawText = aiData.reply || "";

        let alerts = [];
        if (aiRawText.includes("STABLE") || !aiRawText) {
             alerts.push({ 
                title: 'Heat Stress', 
                desc: `The AI predicts a potential issue with heat stress for the next ${predictMinutes} minutes, based on the rising temperature trend.`, 
                btnText: 'Pre-cool System'
            });
        } else {
            const parts = aiRawText.split('|');
            const title = parts[0].replace('TITLE:', '').trim();
            const desc = parts[1].replace('DESC:', '').trim();
            alerts.push({ title, desc, btnText: 'Pre-cool System' });
        }
        renderAlertsUI(listContainer, alerts);

    } catch (err) {
        renderAlertsUI(listContainer, [{ 
            title: 'Heat Stress (Demo)', 
            desc: 'AI predicts a temperature spike in 45m. Immediate cooling suggested.', 
            btnText: 'Pre-cool System' 
        }]);
    }
}

// 4. 纯 UI 渲染 (💡 唯一改动：删掉了箭头 div)
function renderAlertsUI(container, alerts) {
    container.innerHTML = alerts.map(a => `
        <div style="background:white; border-radius:28px; padding:24px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
            <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
                <div style="display:flex; gap:12px;">
                    <div style="width:52px; height:52px; background:#F0FDF4; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:1.6rem;">🌡️</div>
                    <div style="margin-top:4px;">
                        <b style="color:#064E3B; font-size:1.1rem; display:block;">${a.title}</b>
                        <span style="color:#94A3B8; font-size:0.75rem;">SeedDown AI Analysis</span>
                    </div>
                </div>
                <div style="background:#E0F2FE; color:#0369A1; padding:8px 12px; border-radius:12px; font-size:0.65rem; font-weight:800; height: fit-content;">
                    AI INFERENCE
                </div>
            </div>

            <p style="color:#64748B; font-size:0.9rem; line-height:1.5; margin-bottom:24px;">
                🌻 ${a.desc}
            </p>

            <div style="display:flex;">
                <button class="action-btn" style="flex:1; background:#EF4444; color:white; border:none; padding:18px; border-radius:20px; font-weight:700; cursor:pointer; font-size:1rem;">
                    ${a.btnText}
                </button>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.action-btn').forEach(b => {
        b.onclick = () => {
            b.style.backgroundColor = '#064E3B';
            showToast('success', 'AI intervention started. Pre-cooling system active.');
        };
    });
}

export const AlertsList = { render, init };
