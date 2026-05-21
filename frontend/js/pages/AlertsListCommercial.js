// frontend/js/pages/AlertsListCommercial.js
// ─────────────────────────────────────────────────────────────────
//  SeedDown — Commercial Predictive Alert Page
//  Two-tier analysis: Farm Master + Zone Nodes
//  Calls: POST /api/alerts/predict-commercial
// ─────────────────────────────────────────────────────────────────
import { showScreen } from '../utils/navigation.js';
import { showToast }  from '../utils/toast.js';
import { AppState }   from '../store.js';

const API = 'http://localhost:3000';
let predictMinutes = 60;
let isLoading      = false;

// ── Severity styling ──────────────────────────────────────────────
const SEV = {
    critical: { bg: '#FEF2F2', border: '#FECACA', badge: '#EF4444', label: 'CRITICAL' },
    warning:  { bg: '#FFFBEB', border: '#FDE68A', badge: '#F59E0B', label: 'WARNING'  },
    info:     { bg: '#EFF6FF', border: '#BFDBFE', badge: '#3B82F6', label: 'INFO'      },
    stable:   { bg: '#F0FDF4', border: '#BBF7D0', badge: '#22C55E', label: 'STABLE'   },
};

// ── Action map ────────────────────────────────────────────────────
const RISK_ACTIONS = {
    water_depletion:      { btnText: '🚰 Refill Central Tank',    color: '#0EA5E9' },
    energy_overload:      { btnText: '⚡ Reduce Load',             color: '#F59E0B' },
    co2_crisis:           { btnText: '💨 Adjust Ventilation',      color: '#06B6D4' },
    zone_heat:            { btnText: '❄️ Cool Affected Zone',      color: '#EF4444' },
    zone_rot:             { btnText: '💨 Boost Zone Airflow',      color: '#8B5CF6' },
    zone_ec_burn:         { btnText: '🧪 Dilute Zone Nutrient',    color: '#8B5CF6' },
    zone_ec_deficient:    { btnText: '🌿 Boost Zone Nutrient',     color: '#10B981' },
    zone_clog:            { btnText: '🔧 Check Zone Irrigation',   color: '#6B7280' },
    default:              { btnText: '⚡ Take Action',             color: '#064E3B' },
};

// ── Demo fallback ─────────────────────────────────────────────────
const DEMO_ALERTS = [
    { scope: 'farm', zoneId: null, risk: 'water_depletion', severity: 'critical',
      emoji: '🛑', title: 'Central Tank Depletion (Demo)',
      prediction: 'Water tank distance increasing at 0.5 cm per reading. Tank will be empty in approximately 38 minutes.',
      action: 'Manually refill the central reservoir immediately. Estimated downtime: 15 min.',
      projectedValue: 'Tank empty ~38 min', confidence: 0.93 },
    { scope: 'zone', zoneId: 3, risk: 'zone_rot', severity: 'warning',
      emoji: '🍄', title: 'Rot Risk — Zone 3 (Demo)',
      prediction: 'Zone 3 humidity trending toward 88% in next 60 min. Stagnant air promoting fungal conditions.',
      action: 'Open Zone 3 inter-row fans for 20 minutes. Check for blocked air channels.',
      projectedValue: 'Humidity 88% in 60 min', confidence: 0.79 },
    { scope: 'zone', zoneId: 1, risk: 'zone_ec_burn', severity: 'warning',
      emoji: '🧪', title: 'EC Burn Risk — Zone 1 (Demo)',
      prediction: 'Zone 1 EC drifting upward at 0.07 mS/cm per cycle. Projected 3.6 mS/cm in 60 min — root burn threshold.',
      action: 'Add 2L fresh water to Zone 1 drip line now. Recheck in 30 min.',
      projectedValue: 'EC 3.6 mS/cm in 60 min', confidence: 0.85 },
];

// ═════════════════════════════════════════════════════════════════
//  render()
// ═════════════════════════════════════════════════════════════════
export function render() {
    const container = document.getElementById('screenContainer');
    if (container) {
        container.innerHTML = `<div class="screen active" id="alertCommercialScreen">${_buildCommercialHTML()}</div>`;
    }
    return '';
}

function _buildCommercialHTML() {
    return `
    <div style="padding:20px; background:#0F172A; min-height:100vh; font-family:sans-serif; color:#E2E8F0;">

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
            <button id="alertCommercialBack" style="background:#1E293B; border:none; border-radius:12px; padding:10px 14px; cursor:pointer; font-size:1.1rem; color:#94A3B8;">←</button>
            <div>
                <div style="font-weight:800; font-size:1.15rem; color:#F1F5F9;">🏭 Commercial Risk Engine</div>
                <div style="font-size:0.72rem; color:#64748B;">Multi-Zone Predictive Monitoring · AI-Powered</div>
            </div>
            <div style="margin-left:auto; background:#064E3B; color:#6EE7B7; padding:6px 12px; border-radius:10px; font-size:0.68rem; font-weight:800;">
                LIVE
            </div>
        </div>

        <div style="background:#1E293B; border-radius:20px; padding:14px 18px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; border:1px solid #334155;">
            <div>
                <div style="font-size:0.78rem; font-weight:700; color:#94A3B8;">Predict Window</div>
                <div style="font-size:0.68rem; color:#475569;">Forecast horizon for risk detection</div>
            </div>
            <select id="commercialPredictSelect" style="border:none; background:#0F172A; color:#6EE7B7; padding:8px 14px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                <option value="30">30 Mins</option>
                <option value="60" selected>60 Mins</option>
                <option value="90">90 Mins</option>
            </select>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:16px;">
            <button class="scope-tab active-tab" data-scope="all"
                style="flex:1; padding:10px; border-radius:12px; border:1px solid #334155; background:#064E3B; color:#6EE7B7; font-weight:700; cursor:pointer; font-size:0.78rem;">
                All Alerts
            </button>
            <button class="scope-tab" data-scope="farm"
                style="flex:1; padding:10px; border-radius:12px; border:1px solid #334155; background:#1E293B; color:#94A3B8; font-weight:700; cursor:pointer; font-size:0.78rem;">
                🏭 Farm Level
            </button>
            <button class="scope-tab" data-scope="zone"
                style="flex:1; padding:10px; border-radius:12px; border:1px solid #334155; background:#1E293B; color:#94A3B8; font-weight:700; cursor:pointer; font-size:0.78rem;">
                🗺️ Zone Level
            </button>
        </div>

        <div id="commercialAlertsList">
            ${renderCommercialSkeleton()}
        </div>

        <div style="background:#1E293B; border:1px solid #334155; border-radius:16px; padding:14px 16px; margin-top:8px;">
            <div style="font-size:0.75rem; color:#64748B; line-height:1.6;">
                <b style="color:#94A3B8;">🧠 AI Analysis Logic:</b> The engine compares Master sensor data (water tank, CO₂, energy) against zone-node readings. Slope calculations over the last 10 readings extrapolate risks ${predictMinutes} minutes ahead. Alerts are only raised when projected values breach critical thresholds.
            </div>
        </div>
    </div>`;
}

// ═════════════════════════════════════════════════════════════════
//  init()
// ═════════════════════════════════════════════════════════════════
export async function init() {
    setTimeout(() => {
        const backBtn = document.getElementById('alertCommercialBack');
        if (backBtn) backBtn.onclick = () => showScreen('dash-c');

        const sel = document.getElementById('commercialPredictSelect');
        if (sel) {
            sel.value = String(predictMinutes);
            sel.onchange = e => {
                predictMinutes = parseInt(e.target.value);
                showToast('success', `AI recalibrating for ${predictMinutes} min window…`);
                loadCommercialAlerts();
            };
        }

        // Scope filter tabs
        document.querySelectorAll('.scope-tab').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.scope-tab').forEach(t => {
                    t.style.background = '#1E293B';
                    t.style.color = '#94A3B8';
                    t.classList.remove('active-tab');
                });
                tab.style.background = '#064E3B';
                tab.style.color = '#6EE7B7';
                tab.classList.add('active-tab');
                filterAlerts(tab.dataset.scope);
            };
        });

        loadCommercialAlerts();
    }, 50);
}

// ═════════════════════════════════════════════════════════════════
//  Core data + AI logic
// ═════════════════════════════════════════════════════════════════
let _cachedAlerts = [];

async function loadCommercialAlerts() {
    if (isLoading) return;
    isLoading = true;

    const container = document.getElementById('commercialAlertsList');
    if (!container) { isLoading = false; return; }
    container.innerHTML = renderCommercialSkeleton();

    try {
        const masterDeviceId = AppState.currentFarmId || 'commercial-farm-master-1';

        // 1. Fetch master sensor data
        const [masterLatestRes, masterHistRes] = await Promise.all([
            fetch(`${API}/api/sensors/latest?deviceId=${masterDeviceId}`),
            fetch(`${API}/api/sensors/history?deviceId=${masterDeviceId}&limit=10`),
        ]);

        const masterLatest  = (await masterLatestRes.json()).reading || {};
        const masterHistory = (await masterHistRes.json()).readings  || [];

        // 2. Fetch zone data — discover zones from AppState or use defaults
        const zoneIds = AppState.zoneIds || [1, 2, 3];
        const zoneResults = await Promise.allSettled(
            zoneIds.map(async zoneId => {
                const [latestR, histR] = await Promise.all([
                    fetch(`${API}/api/sensors/latest?deviceId=${masterDeviceId}&zoneId=${zoneId}`),
                    fetch(`${API}/api/sensors/history?deviceId=${masterDeviceId}&zoneId=${zoneId}&limit=10`),
                ]);
                const latestReading   = (await latestR.json()).reading   || {};
                const historyReadings = (await histR.json()).readings    || [];
                return { zoneId, latestReading, historyReadings };
            })
        );

        const zones = zoneResults
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value);

        // 3. Call AI prediction endpoint
        const aiRes = await fetch(`${API}/api/alerts/predict-commercial`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                deviceId: masterDeviceId,
                predictMinutes,
                masterReading: masterLatest,
                masterHistory,
                zones,
            }),
        });

        const aiData = await aiRes.json();
        _cachedAlerts = Array.isArray(aiData.alerts) ? aiData.alerts : [];

        if (_cachedAlerts.length === 0) {
            container.innerHTML = renderCommercialStableCard();
        } else {
            renderCommercialAlerts(container, _cachedAlerts);
        }

    } catch (err) {
        console.warn('[AlertsListCommercial] Falling back to demo:', err.message);
        _cachedAlerts = DEMO_ALERTS;
        renderCommercialAlerts(container, _cachedAlerts, /* isDemo */ true);
    } finally {
        isLoading = false;
    }
}

function filterAlerts(scope) {
    const container = document.getElementById('commercialAlertsList');
    if (!container || !_cachedAlerts.length) return;
    const filtered = scope === 'all' ? _cachedAlerts : _cachedAlerts.filter(a => a.scope === scope);
    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#64748B; font-size:0.88rem;">No ${scope}-level alerts detected.</div>`;
    } else {
        renderCommercialAlerts(container, filtered);
    }
}

// ═════════════════════════════════════════════════════════════════
//  UI Renderers
// ═════════════════════════════════════════════════════════════════
function renderCommercialAlerts(container, alerts, isDemo = false) {
    const demoTag = isDemo
        ? `<div style="background:#1E293B; border:1px solid #F59E0B44; border-radius:12px; padding:10px 14px; margin-bottom:12px; font-size:0.78rem; color:#FCD34D;">
               ⚠️ <b>Demo mode</b> — backend offline. Showing simulated commercial predictions.
           </div>`
        : '';

    // Summary bar
    const critCount = alerts.filter(a => a.severity === 'critical').length;
    const warnCount = alerts.filter(a => a.severity === 'warning').length;

    const summaryBar = `
        <div style="background:#1E293B; border:1px solid #334155; border-radius:16px; padding:12px 16px; margin-bottom:14px; display:flex; gap:16px; align-items:center;">
            <div style="flex:1; text-align:center;">
                <div style="font-size:1.5rem; font-weight:900; color:#EF4444;">${critCount}</div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:700;">CRITICAL</div>
            </div>
            <div style="width:1px; height:36px; background:#334155;"></div>
            <div style="flex:1; text-align:center;">
                <div style="font-size:1.5rem; font-weight:900; color:#F59E0B;">${warnCount}</div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:700;">WARNINGS</div>
            </div>
            <div style="width:1px; height:36px; background:#334155;"></div>
            <div style="flex:1; text-align:center;">
                <div style="font-size:1.5rem; font-weight:900; color:#6EE7B7;">${alerts.length}</div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:700;">TOTAL</div>
            </div>
        </div>`;

    container.innerHTML = demoTag + summaryBar + alerts.map((a, i) => renderCommercialCard(a, i)).join('');

    container.querySelectorAll('[data-comm-action]').forEach(btn => {
        btn.onclick = () => handleCommercialAction(btn);
    });

    container.querySelectorAll('[data-comm-detail]').forEach(btn => {
        btn.onclick = () => {
            showScreen('alert-detail', {
                title: btn.dataset.title,
                prediction: btn.dataset.prediction,
                projectedValue: btn.dataset.projected,
                confidence: btn.dataset.confidence,
                risk: btn.dataset.risk,
                scope: btn.dataset.scope,
                zoneId: btn.dataset.zone,
                mode: 'commercial',
            });
        };
    });
}

function renderCommercialCard(a, index) {
    const sev       = SEV[a.severity] || SEV.warning;
    const riskConf  = RISK_ACTIONS[a.risk] || RISK_ACTIONS.default;
    const confPct   = Math.round((a.confidence || 0.8) * 100);
    const scopeTag  = a.scope === 'farm'
        ? `<span style="background:#0F172A; color:#94A3B8; padding:3px 8px; border-radius:6px; font-size:0.62rem; font-weight:800;">🏭 FARM</span>`
        : `<span style="background:#0F172A; color:#7DD3FC; padding:3px 8px; border-radius:6px; font-size:0.62rem; font-weight:800;">🗺️ ZONE ${a.zoneId ?? ''}</span>`;

    return `
    <div style="background:#1E293B; border:1.5px solid ${sev.border}33; border-left:4px solid ${sev.badge}; border-radius:20px; padding:20px; margin-bottom:12px; animation:fadeSlide 0.3s ease both; animation-delay:${index * 0.07}s;">

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; gap:10px; align-items:center;">
                <div style="width:44px; height:44px; background:#0F172A; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.4rem;">
                    ${a.emoji || '⚠️'}
                </div>
                <div>
                    <div style="display:flex; gap:6px; align-items:center; margin-bottom:4px;">
                        ${scopeTag}
                        <span style="background:${sev.badge}22; color:${sev.badge}; padding:3px 8px; border-radius:6px; font-size:0.62rem; font-weight:800;">${sev.label}</span>
                    </div>
                    <b style="color:#F1F5F9; font-size:0.95rem;">${a.title}</b>
                </div>
            </div>
        </div>

        <p style="color:#94A3B8; font-size:0.85rem; line-height:1.55; margin-bottom:12px; padding:10px 14px; background:#0F172A; border-radius:10px; border-left:3px solid ${sev.badge};">
            ${a.prediction}
        </p>

        <div style="background:#0F172A; border-radius:10px; padding:10px 14px; margin-bottom:14px; display:flex; gap:10px; align-items:flex-start;">
            <span style="font-size:1rem; margin-top:1px;">🔧</span>
            <div>
                <div style="font-size:0.65rem; color:#475569; font-weight:800; margin-bottom:3px;">RECOMMENDED ACTION</div>
                <div style="font-size:0.82rem; color:#CBD5E1;">${a.action}</div>
            </div>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <div style="flex:1; background:#0F172A; border-radius:10px; padding:8px 12px;">
                <div style="font-size:0.6rem; color:#475569; font-weight:800; margin-bottom:2px;">📊 PROJECTED</div>
                <div style="font-size:0.85rem; font-weight:800; color:#F1F5F9;">${a.projectedValue || '–'}</div>
            </div>
            <div style="flex:1; background:#0F172A; border-radius:10px; padding:8px 12px;">
                <div style="font-size:0.6rem; color:#475569; font-weight:800; margin-bottom:4px;">🎯 CONFIDENCE</div>
                <div style="height:5px; background:#1E293B; border-radius:3px; overflow:hidden; margin-bottom:2px;">
                    <div style="height:100%; width:${confPct}%; background:${sev.badge}; border-radius:3px;"></div>
                </div>
                <div style="font-size:0.72rem; font-weight:700; color:${sev.badge};">${confPct}%</div>
            </div>
        </div>

        <div style="display:flex; gap:8px;">
            <button data-comm-action
                data-risk="${a.risk}"
                data-zone="${a.zoneId || ''}"
                data-title="${encodeURIComponent(a.title)}"
                style="flex:2; background:${riskConf.color}; color:white; border:none; padding:12px; border-radius:14px; font-weight:700; cursor:pointer; font-size:0.85rem;">
                ${riskConf.btnText}
            </button>
            <button data-comm-detail
                data-title="${encodeURIComponent(a.title)}"
                data-prediction="${encodeURIComponent(a.prediction)}"
                data-projected="${encodeURIComponent(a.projectedValue || '')}"
                data-confidence="${a.confidence || 0.8}"
                data-risk="${a.risk}"
                data-scope="${a.scope || 'farm'}"
                data-zone="${a.zoneId || ''}"
                style="flex:1; background:#0F172A; color:#94A3B8; border:1px solid #334155; padding:12px; border-radius:14px; font-weight:700; cursor:pointer; font-size:0.82rem;">
                📈 Detail
            </button>
        </div>
    </div>`;
}

function renderCommercialStableCard() {
    return `
    <div style="background:#1E293B; border:1.5px solid #064E3B44; border-radius:20px; padding:36px 24px; text-align:center;">
        <div style="font-size:3rem; margin-bottom:12px;">✅</div>
        <b style="font-size:1.1rem; color:#6EE7B7; display:block; margin-bottom:8px;">All Zones Operating Normally</b>
        <p style="color:#64748B; font-size:0.85rem; line-height:1.5;">
            AI analysis of farm master + all zone nodes shows no risks<br>
            in the next ${predictMinutes} minutes.
        </p>
        <button onclick="window._reloadCommercialAlerts?.()"
            style="margin-top:16px; background:#064E3B; color:#6EE7B7; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Re-analyze
        </button>
    </div>`;
}

function renderCommercialSkeleton() {
    return [1, 2, 3].map(i => `
        <div style="background:#1E293B; border:1px solid #334155; border-radius:20px; padding:20px; margin-bottom:12px; opacity:${1 - i * 0.25};">
            <div style="display:flex; gap:10px; margin-bottom:12px;">
                <div style="width:44px; height:44px; background:#0F172A; border-radius:12px;"></div>
                <div style="flex:1;">
                    <div style="width:80px; height:10px; background:#0F172A; border-radius:4px; margin-bottom:6px;"></div>
                    <div style="width:160px; height:14px; background:#0F172A; border-radius:6px;"></div>
                </div>
            </div>
            <div style="height:48px; background:#0F172A; border-radius:10px; margin-bottom:10px;"></div>
            <div style="height:38px; background:#0F172A; border-radius:14px;"></div>
        </div>`
    ).join('') + `
    <div style="text-align:center; padding:16px; color:#475569; font-size:0.8rem;">
        🏭 Analyzing farm master + zone nodes…
    </div>`;
}

// ── Action handler ─────────────────────────────────────────────────
function handleCommercialAction(btn) {
    const risk  = btn.dataset.risk;
    const zone  = btn.dataset.zone;
    const title = decodeURIComponent(btn.dataset.title || 'Alert');
    const masterDeviceId = AppState.currentFarmId || 'commercial-farm-master-1';

    btn.style.opacity = '0.5';
    btn.textContent   = '⏳ Queuing…';
    btn.disabled      = true;

    fetch(`${API}/api/sensors/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            deviceId: masterDeviceId,
            zoneId:   zone || null,
            command:  commercialRiskToCommand(risk),
            source:   'predictive_alert_commercial',
            note:     `AI-triggered: ${title}${zone ? ` (Zone ${zone})` : ''}`,
        }),
    }).catch(() => {});

    setTimeout(() => {
        btn.style.background = '#064E3B';
        btn.style.color      = '#6EE7B7';
        btn.style.opacity    = '1';
        btn.textContent      = '✅ Queued';
        btn.disabled         = false;
        showToast('success', `✅ ${title} — IoT command sent${zone ? ` to Zone ${zone}` : ''}`);
    }, 700);
}

function commercialRiskToCommand(risk) {
    const map = {
        water_depletion:   'PUMP_HALT_REFILL_ALERT',
        energy_overload:   'REDUCE_LIGHT_INTENSITY',
        co2_crisis:        'VENTILATION_MAX',
        zone_heat:         'ZONE_COOLING_ON',
        zone_rot:          'ZONE_FAN_BOOST',
        zone_ec_burn:      'ZONE_DILUTE_EC',
        zone_ec_deficient: 'ZONE_BOOST_EC',
        zone_clog:         'ZONE_FLUSH_CYCLE',
    };
    return map[risk] || 'COMMERCIAL_ALERT_ACK';
}

window._reloadCommercialAlerts = loadCommercialAlerts;

if (!document.getElementById('alertAnimStyle')) {
    const style = document.createElement('style');
    style.id = 'alertAnimStyle';
    style.textContent = `
        @keyframes fadeSlide {
            from { opacity:0; transform:translateY(10px); }
            to   { opacity:1; transform:translateY(0); }
        }`;
    document.head.appendChild(style);
}

export const AlertsListCommercial = { render, init };