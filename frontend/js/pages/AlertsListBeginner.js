// frontend/js/pages/AlertsListBeginner.js
// ─────────────────────────────────────────────────────────────────
//  SeedDown — Beginner Predictive Alert Page
//  Supports: starter | standard | pro package levels
//  Calls: POST /api/alerts/predict-beginner
//  Real sensor data from Firebase — no mock data
// ─────────────────────────────────────────────────────────────────
import { showScreen } from '../utils/navigation.js';
import { showToast }  from '../utils/toast.js';
import { AppState }   from '../store.js';
import { API_BASE as API } from '../utils/apiBase.js';

let predictMinutes = 45;
let isLoading      = false;

// ── Severity config ───────────────────────────────────────────────
const SEV = {
    critical: { bg: '#FEF2F2', border: '#FECACA', badge: '#EF4444', badgeTxt: '#fff', label: 'CRITICAL' },
    warning:  { bg: '#FFFBEB', border: '#FDE68A', badge: '#F59E0B', badgeTxt: '#fff', label: 'WARNING'  },
    info:     { bg: '#ECFEFF', border: '#99F6E4', badge: '#14B8A6', badgeTxt: '#fff', label: 'INFO'     },
    stable:   { bg: '#F0FDF4', border: '#BBF7D0', badge: '#22C55E', badgeTxt: '#fff', label: 'STABLE'   },
};

// ── Action button config per risk type ────────────────────────────
const RISK_ACTIONS = {
    heat_stress:        { btnText: '❄️ Pre-cool System',    color: '#EF4444' },
    wilting:            { btnText: '💧 Boost Irrigation',    color: '#F59E0B' },
    pump_cavitation:    { btnText: '🚰 Refill Water Tank',   color: '#F59E0B' },
    nutrient_burn:      { btnText: '🧪 Dilute Nutrient Mix', color: '#8B5CF6' },
    nutrient_deficient: { btnText: '🌿 Boost Nutrient Mix',  color: '#8B5CF6' },
    co2_crisis:         { btnText: '💨 Adjust Ventilation',  color: '#06B6D4' },
    stable:             { btnText: '✅ All Good',             color: '#22C55E' },
    default:            { btnText: '⚡ Take Action',          color: '#064E3B' },
};

// ═════════════════════════════════════════════════════════════════
//  render()
// ═════════════════════════════════════════════════════════════════
export function render() {
    const pkgLevel = AppState.packageLevel || AppState.mode || 'pro';
    const pkgLabel = { starter: '🌱 Starter', standard: '🌿 Standard', pro: '⚡ Pro' }[pkgLevel] || pkgLevel;

    const container = document.getElementById('screenContainer');
    if (container) {
        container.innerHTML = `<div class="screen active" id="alertBeginnerScreen">${_buildHTML(pkgLevel, pkgLabel)}</div>`;
    }
    return '';
}

function _buildHTML(pkgLevel, pkgLabel) {
    return `
    <div style="padding:20px; background:#F9FBF9; min-height:100vh; font-family:sans-serif;">

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
            <button id="alertBeginnerBack" style="background:#F0FDF4; border:none; border-radius:12px; padding:10px 14px; cursor:pointer; font-size:1.1rem; color:#064E3B;">←</button>
            <div>
                <div style="font-weight:800; font-size:1.15rem; color:#064E3B;">🛰️ Predictive Alerts</div>
                <div style="font-size:0.75rem; color:#6B7280;">Package: <b style="color:#064E3B;">${pkgLabel}</b> · AI Risk Monitor</div>
            </div>
        </div>

        <div style="background:#fff; border-radius:20px; padding:14px 18px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; border:1px solid #EDF2F0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
            <div>
                <div style="font-size:0.78rem; font-weight:700; color:#064E3B;">Predict Window</div>
                <div style="font-size:0.7rem; color:#9CA3AF;">How far ahead to forecast</div>
            </div>
            <select id="beginnerPredictSelect" style="border:none; background:#F0FDF4; color:#065F46; padding:8px 14px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                <option value="30">30 Mins</option>
                <option value="45" ${predictMinutes === 45 ? 'selected' : ''}>45 Mins</option>
                <option value="60">60 Mins</option>
            </select>
        </div>

        <div style="background:#ECFEFF; border:1px solid #99F6E4; border-radius:14px; padding:10px 16px; margin-bottom:18px; font-size:0.8rem; color:#0f766e; line-height:1.5;">
            <b>🤖 How this works:</b> SeedDown AI reads your live sensor history from Firebase, calculates the trend slope, and predicts what will happen in the next <b id="pillMinutes">${predictMinutes} minutes</b> — so you can act before a crisis hits.
        </div>

        <div id="beginnerAlertsList">
            ${renderLoadingSkeleton()}
        </div>

        <div id="aiProvenancePanel" style="display:none; background:#fff; border:1px solid #EDF2F0; border-radius:16px; padding:14px 16px; margin-top:12px; box-shadow:0 1px 4px rgba(0,0,0,0.04);">
        </div>
    </div>`;
}

// ═════════════════════════════════════════════════════════════════
//  init()
// ═════════════════════════════════════════════════════════════════
export async function init() {
    setTimeout(() => {
        const backBtn = document.getElementById('alertBeginnerBack');
        if (backBtn) backBtn.onclick = () => showScreen('home');

        const sel = document.getElementById('beginnerPredictSelect');
        if (sel) {
            sel.value = String(predictMinutes);
            sel.onchange = e => {
                predictMinutes = parseInt(e.target.value);
                const pill = document.getElementById('pillMinutes');
                if (pill) pill.textContent = `${predictMinutes} minutes`;
                showToast('success', `AI recalibrating for ${predictMinutes} min window…`);
                loadBeginnerAlerts();
            };
        }
        loadBeginnerAlerts();
    }, 50);
}

// ═════════════════════════════════════════════════════════════════
//  Core data + AI logic
// ═════════════════════════════════════════════════════════════════
function resolveBeginnerDeviceId(farm) {
    const pkg = farm?.packageLevel || AppState.packageLevel || 'standard';
    const map = {
        'starter':  'beginner_starter',
        'standard': 'beginner_standard',
        'pro':      'beginner_pro',
    };
    return map[pkg] || 'beginner_standard';
}

async function loadBeginnerAlerts() {
    if (isLoading) return;
    isLoading = true;

    const container = document.getElementById('beginnerAlertsList');
    if (!container) { isLoading = false; return; }
    container.innerHTML = renderLoadingSkeleton();

    // Hide provenance panel while loading
    const provPanel = document.getElementById('aiProvenancePanel');
    if (provPanel) provPanel.style.display = 'none';

    try {
        const deviceId = resolveBeginnerDeviceId(AppState.currentFarm);  // ← 这里用
        const pkgLevel  = AppState.packageLevel || 'pro';

        // 1. Fetch real Firebase sensor data in parallel
        const [latestRes, historyRes] = await Promise.all([
            fetch(`${API}/api/sensors/latest?deviceId=${deviceId}`),
            fetch(`${API}/api/sensors/history?deviceId=${deviceId}&limit=10`),
        ]);

        const latestData   = await latestRes.json();
        const historyData  = await historyRes.json();
        console.log('[Debug] deviceId used:', deviceId);
        console.log('[Debug] latestReading:', latestData.reading);
        console.log('[Debug] historyReadings count:', historyData.readings?.length);
        console.log('[Debug] historyReadings[0]:', historyData.readings?.[0]);
        console.log('[Debug] currentFarm:', AppState.currentFarm);
        console.log('[Debug] currentFarm.deviceId:', AppState.currentFarm?.deviceId);  // ← 加这行
        console.log('[Debug] deviceId used:', deviceId);
        const latestReading   = latestData.reading   || {};
        const historyReadings = historyData.readings  || [];

        // Warn if no data came back
        if (historyReadings.length === 0) {
            console.warn(`[AlertsListBeginner] Firebase returned 0 readings for deviceId="${deviceId}". Sensor may be offline.`);
        }

        // 2. Call AI endpoint with real Firebase data
        const aiRes = await fetch(`${API}/api/alerts/predict-beginner`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                deviceId,
                packageLevel: pkgLevel,
                predictMinutes,
                latestReading,
                historyReadings,
            }),
        });

        const aiData = await aiRes.json();
        const alerts = Array.isArray(aiData.alerts) ? aiData.alerts : [];
        const aiMeta = aiData.aiMeta || null;

        // Show AI provenance panel
        if (aiMeta && provPanel) {
            provPanel.style.display = 'block';
            provPanel.innerHTML = renderAiProvenancePanel(aiMeta, pkgLevel);
        }

        // If Firebase returned no data, show offline card — don't trust AI output
        if (aiMeta && !aiMeta.hasRealData) {
            container.innerHTML = renderOfflineCard(deviceId);
        } else if (alerts.length === 0) {
            container.innerHTML = renderStableCard(historyReadings.length);
        } else {
            renderBeginnerAlerts(container, alerts, pkgLevel, false, historyReadings);
        }

    } catch (err) {
        console.error('[AlertsListBeginner] Error:', err.message);
        container.innerHTML = renderErrorCard(err.message);
    } finally {
        isLoading = false;
    }
}

// ═════════════════════════════════════════════════════════════════
//  UI Renderers
// ═════════════════════════════════════════════════════════════════
function renderBeginnerAlerts(container, alerts, pkgLevel, isDemo = false, historyReadings = []) {
    const demoTag = isDemo
        ? `<div style="background:#FEF9C3; border:1px solid #FDE047; border-radius:12px; padding:10px 14px; margin-bottom:14px; font-size:0.78rem; color:#854D0E;">
               ⚠️ <b>Demo mode</b> — backend offline. Showing example predictions.
           </div>`
        : '';

        container.innerHTML = demoTag + alerts.map((a, i) => renderAlertCard(a, i, historyReadings)).join('');

    container.querySelectorAll('[data-action-btn]').forEach(btn => {
        btn.onclick = () => handleAction(btn);
    });

    container.querySelectorAll('[data-detail-btn]').forEach(btn => {
        btn.onclick = () => {
            showScreen('alert-detail', {
                title:          btn.dataset.title,
                prediction:     btn.dataset.prediction,
                projectedValue: btn.dataset.projected,
                confidence:     btn.dataset.confidence,
                risk:           btn.dataset.risk,
                mode:           'beginner',
                history:        btn.dataset.history,   // ← 加这行
            });
        };
    });
}

function renderAlertCard(a, index, historyReadings = []) {
    const sev      = SEV[a.severity] || SEV.warning;
    const riskConf = RISK_ACTIONS[a.risk] || RISK_ACTIONS.default;
    const confPct  = Math.round((a.confidence || 0.8) * 100);

    return `
    <div style="background:${sev.bg}; border:1.5px solid ${sev.border}; border-radius:24px; padding:22px; margin-bottom:14px; animation: fadeSlide 0.3s ease both; animation-delay:${index * 0.08}s;">

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
            <div style="display:flex; gap:12px; align-items:center;">
                <div style="width:48px; height:48px; background:white; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                    ${a.emoji || '⚠️'}
                </div>
                <div>
                    <b style="color:#1E293B; font-size:1rem; display:block;">${a.title}</b>
                    <span style="color:#6B7280; font-size:0.72rem;">SeedDown AI · ${predictMinutes}m window · Live Firebase data</span>
                </div>
            </div>
            <div style="background:${sev.badge}; color:${sev.badgeTxt}; padding:5px 10px; border-radius:10px; font-size:0.62rem; font-weight:800; white-space:nowrap;">
                ${sev.label}
            </div>
        </div>

        <p style="color:#374151; font-size:0.88rem; line-height:1.55; margin-bottom:14px; padding:12px 14px; background:rgba(255,255,255,0.6); border-radius:12px;">
            ${a.prediction}
        </p>

        <div style="background:rgba(255,255,255,0.7); border-radius:12px; padding:10px 14px; margin-bottom:14px; border:1px solid ${sev.border};">
            <div style="font-size:0.65rem; color:#6B7280; font-weight:700; margin-bottom:3px;">🔧 RECOMMENDED ACTION</div>
            <div style="font-size:0.85rem; color:#374151;">${a.action}</div>
        </div>

        <div style="display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap;">
            <div style="background:white; border-radius:12px; padding:8px 14px; flex:1; min-width:120px; border:1px solid ${sev.border};">
                <div style="font-size:0.65rem; color:#6B7280; font-weight:700; margin-bottom:2px;">📊 PROJECTED</div>
                <div style="font-size:0.9rem; font-weight:800; color:#1E293B;">${a.projectedValue || '–'}</div>
            </div>
            <div style="background:white; border-radius:12px; padding:8px 14px; flex:1; min-width:120px; border:1px solid ${sev.border};">
                <div style="font-size:0.65rem; color:#6B7280; font-weight:700; margin-bottom:4px;">🎯 AI CONFIDENCE</div>
                <div style="height:6px; background:#E5E7EB; border-radius:4px; overflow:hidden;">
                    <div style="height:100%; width:${confPct}%; background:${sev.badge}; border-radius:4px;"></div>
                </div>
                <div style="font-size:0.75rem; font-weight:700; color:${sev.badge}; margin-top:3px;">${confPct}%</div>
            </div>
        </div>

        <div style="display:flex; gap:10px;">
            <button data-action-btn
                data-risk="${a.risk}"
                data-title="${encodeURIComponent(a.title)}"
                style="flex:1; background:${riskConf.color}; color:white; border:none; padding:14px; border-radius:16px; font-weight:700; cursor:pointer; font-size:0.9rem; transition:opacity 0.2s;">
                ${riskConf.btnText}
            </button>
            <button data-detail-btn
                data-title="${encodeURIComponent(a.title)}"
                data-prediction="${encodeURIComponent(a.prediction)}"
                data-projected="${encodeURIComponent(a.projectedValue || '')}"
                data-confidence="${a.confidence || 0.8}"
                data-risk="${a.risk}"
                data-history="${encodeURIComponent(JSON.stringify(historyReadings))}"
                style="background:white; color:#374151; border:1.5px solid ${sev.border}; padding:14px 16px; border-radius:16px; font-weight:700; cursor:pointer; font-size:0.85rem;">
                📈 Detail
            </button>
        </div>
    </div>`;
}

function renderAiProvenancePanel(meta, pkgLevel) {
    const time = meta.generatedAt ? new Date(meta.generatedAt).toLocaleTimeString() : '–';
    const slopes = meta.slopeSummary || {};
    const dataStatus = meta.hasRealData
        ? `<span style="color:#166534; font-weight:700;">✅ ${meta.readingCount} real readings from Firebase</span>`
        : `<span style="color:#B45309; font-weight:700;">⚠️ No sensor data — device may be offline</span>`;

    return `
    <div style="font-size:0.75rem; color:#6B7280; line-height:1.7;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <div style="width:8px; height:8px; background:#22C55E; border-radius:50%; animation:pulse 2s infinite;"></div>
            <b style="color:#064E3B; font-size:0.82rem;">🧠 AI Response — Live, Not Hardcoded</b>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px;">
            <div style="background:#F0FDF4; border-radius:8px; padding:7px 10px; border:1px solid #BBF7D0;">
                <div style="color:#6B7280; font-size:0.62rem; font-weight:700; margin-bottom:2px;">⏰ Generated At</div>
                <div style="color:#064E3B; font-weight:700;">${time}</div>
            </div>
            <div style="background:#F0FDF4; border-radius:8px; padding:7px 10px; border:1px solid #BBF7D0;">
                <div style="color:#6B7280; font-size:0.62rem; font-weight:700; margin-bottom:2px;">🔑 Prompt Hash</div>
                <div style="color:#064E3B; font-weight:700; font-family:monospace;">#${meta.promptHash || '–'}</div>
            </div>
        </div>
        <div style="background:#F0FDF4; border-radius:8px; padding:7px 10px; border:1px solid #BBF7D0; margin-bottom:6px;">
            <div style="color:#6B7280; font-size:0.62rem; font-weight:700; margin-bottom:2px;">📡 Firebase Data Source</div>
            ${dataStatus}
        </div>
        <div style="background:#F0FDF4; border-radius:8px; padding:7px 10px; border:1px solid #BBF7D0;">
            <div style="color:#6B7280; font-size:0.62rem; font-weight:700; margin-bottom:3px;">📊 Sensor Trends (slope per reading, sent to AI)</div>
            <div style="color:#374151;">
                Temp: <b>${slopes.temp ?? '–'}</b> · Soil: <b>${slopes.soil ?? '–'}</b>
                ${pkgLevel !== 'starter' ? ` · Water: <b>${slopes.water ?? '–'}</b>` : ''}
                ${pkgLevel === 'pro' ? ` · EC: <b>${slopes.ec ?? '–'}</b> · CO₂: <b>${slopes.co2 ?? '–'}</b>` : ''}
            </div>
        </div>
        <div style="margin-top:6px; font-size:0.68rem; color:#9CA3AF; text-align:center;">
            Every analysis is unique — compare the prompt hash across runs to confirm AI is re-generating
        </div>
    </div>`;
}

function renderStableCard(readingCount) {
    return `
    <div style="background:#F0FDF4; border:1.5px solid #BBF7D0; border-radius:24px; padding:36px 24px; text-align:center;">
        <div style="font-size:3rem; margin-bottom:12px;">✅</div>
        <b style="font-size:1.1rem; color:#064E3B; display:block; margin-bottom:8px;">All Systems Stable</b>
        <p style="color:#6B7280; font-size:0.88rem; line-height:1.5;">
            AI analyzed ${readingCount > 0 ? `your last ${readingCount} real Firebase readings` : 'your sensor data'} for the next ${predictMinutes} minutes.<br>
            No risks detected. Keep monitoring!
        </p>
        <button onclick="window._reloadBeginnerAlerts?.()"
            style="margin-top:16px; background:#064E3B; color:white; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Re-analyze
        </button>
    </div>`;
}

function renderErrorCard(msg) {
    return `
    <div style="background:#FEF2F2; border:1.5px solid #FECACA; border-radius:24px; padding:28px 24px; text-align:center;">
        <div style="font-size:2.5rem; margin-bottom:12px;">❌</div>
        <b style="font-size:1rem; color:#991B1B; display:block; margin-bottom:8px;">Connection Error</b>
        <p style="color:#6B7280; font-size:0.82rem; line-height:1.5; margin-bottom:16px;">${msg}</p>
        <button onclick="window._reloadBeginnerAlerts?.()"
            style="background:#EF4444; color:#fff; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Retry
        </button>
    </div>`;
}

function renderLoadingSkeleton() {
    return [1, 2].map(i => `
        <div style="background:#fff; border:1px solid #EDF2F0; border-radius:24px; padding:22px; margin-bottom:14px; opacity:${1 - i * 0.2};">
            <div style="display:flex; gap:12px; align-items:center; margin-bottom:14px;">
                <div style="width:48px; height:48px; background:#F3F4F6; border-radius:14px;"></div>
                <div>
                    <div style="width:140px; height:14px; background:#F3F4F6; border-radius:6px; margin-bottom:6px;"></div>
                    <div style="width:100px; height:10px; background:#F3F4F6; border-radius:4px;"></div>
                </div>
            </div>
            <div style="height:50px; background:#F9FAFB; border-radius:12px; margin-bottom:14px;"></div>
            <div style="height:44px; background:#F3F4F6; border-radius:16px;"></div>
        </div>`
    ).join('') + `
    <div style="text-align:center; padding:20px; color:#9CA3AF; font-size:0.82rem;">
        🛰️ Fetching your Firebase sensor data…
    </div>`;
}

// ── Action handler ────────────────────────────────────────────────
function handleAction(btn) {
    const risk  = btn.dataset.risk;
    const title = decodeURIComponent(btn.dataset.title || 'Alert');

    btn.style.opacity = '0.6';
    btn.textContent   = '⏳ Sending…';
    btn.disabled      = true;

    fetch(`${API}/api/sensors/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            deviceId: AppState.currentFarmId || 'farm_001',
            command:  riskToCommand(risk),
            source:   'predictive_alert',
            note:     `AI-triggered action: ${title}`,
        }),
    }).catch(() => {});

    setTimeout(() => {
        btn.style.background = '#064E3B';
        btn.style.opacity    = '1';
        btn.textContent      = '✅ Action Sent';
        btn.disabled         = false;
        showToast('success', `✅ ${title} — intervention triggered!`);
    }, 800);
}

function riskToCommand(risk) {
    const map = {
        heat_stress:        'COOLING_ON',
        wilting:            'PUMP_ON',
        pump_cavitation:    'PUMP_PAUSE',
        nutrient_burn:      'DILUTE_EC',
        nutrient_deficient: 'BOOST_EC',
        co2_crisis:         'FAN_ON',
    };
    return map[risk] || 'ALERT_ACK';
}


function renderOfflineCard(deviceId) {
    return `
    <div style="background:#FFFBEB; border:1.5px solid #FDE68A; border-radius:24px; padding:32px 24px; text-align:center;">
        <div style="font-size:3rem; margin-bottom:12px;">📡</div>
        <b style="font-size:1.1rem; color:#92400E; display:block; margin-bottom:10px;">No Sensor Data from Firebase</b>
        <p style="color:#6B7280; font-size:0.85rem; line-height:1.6; margin-bottom:16px;">
            Your device <code style="background:#FEF3C7; padding:2px 6px; border-radius:4px; font-size:0.8rem;">${deviceId}</code>
            hasn't sent any readings yet.<br><br>
            This usually means:<br>
            • The sensor device is offline or unpowered<br>
            • The deviceId in your farm settings doesn't match the device<br>
            • The device hasn't sent its first reading yet
        </p>
        <button onclick="window._reloadBeginnerAlerts?.()"
            style="background:#D97706; color:#fff; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Check Again
        </button>
    </div>`;
}

window._reloadBeginnerAlerts = loadBeginnerAlerts;

if (!document.getElementById('alertAnimStyle')) {
    const style = document.createElement('style');
    style.id = 'alertAnimStyle';
    style.textContent = `
        @keyframes fadeSlide {
            from { opacity:0; transform:translateY(12px); }
            to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
            0%, 100% { opacity:1; }
            50% { opacity:0.4; }
        }`;
    document.head.appendChild(style);
}

export const AlertsListBeginner = { render, init };
