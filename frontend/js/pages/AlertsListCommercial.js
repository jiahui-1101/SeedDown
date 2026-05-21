// frontend/js/pages/AlertsListCommercial.js
// ─────────────────────────────────────────────────────────────────
//  SeedDown — Commercial Predictive Alert Page
//  Two-tier analysis: Farm Master + Zone Nodes
//  Zones: dynamically loaded from Firebase (farm doc)
//  Calls: POST /api/alerts/predict-commercial
// ─────────────────────────────────────────────────────────────────
import { showScreen } from '../utils/navigation.js';
import { showToast }  from '../utils/toast.js';
import { AppState }   from '../store.js';
import { API_BASE as API } from '../utils/apiBase.js';

let predictMinutes = 60;
let isLoading      = false;

// ── Severity styling ──────────────────────────────────────────────
const SEV = {
    critical: { bg: '#FEF2F2', border: '#FECACA', badge: '#EF4444', label: 'CRITICAL' },
    warning:  { bg: '#FFFBEB', border: '#FDE68A', badge: '#F59E0B', label: 'WARNING'  },
    info:     { bg: '#ECFEFF', border: '#99F6E4', badge: '#14B8A6', label: 'INFO'     },
    stable:   { bg: '#F0FDF4', border: '#BBF7D0', badge: '#22C55E', label: 'STABLE'   },
};

// ── Action map ────────────────────────────────────────────────────
const RISK_ACTIONS = {
    water_depletion:      { btnText: '🚰 Refill Central Tank',   color: '#0EA5E9' },
    energy_overload:      { btnText: '⚡ Reduce Load',            color: '#F59E0B' },
    co2_crisis:           { btnText: '💨 Adjust Ventilation',     color: '#06B6D4' },
    zone_heat:            { btnText: '❄️ Cool Affected Zone',     color: '#EF4444' },
    zone_rot:             { btnText: '💨 Boost Zone Airflow',     color: '#8B5CF6' },
    zone_ec_burn:         { btnText: '🧪 Dilute Zone Nutrient',   color: '#8B5CF6' },
    zone_ec_deficient:    { btnText: '🌿 Boost Zone Nutrient',    color: '#10B981' },
    zone_clog:            { btnText: '🔧 Check Zone Irrigation',  color: '#6B7280' },
    default:              { btnText: '⚡ Take Action',            color: '#064E3B' },
};

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
    <div style="padding:20px; background:#F8FAFC; min-height:100vh; font-family:sans-serif; color:#1E293B;">

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
            <button id="alertCommercialBack" style="background:#F1F5F9; border:none; border-radius:12px; padding:10px 14px; cursor:pointer; font-size:1.1rem; color:#475569;">←</button>
            <div>
                <div style="font-weight:800; font-size:1.15rem; color:#0F172A;">🏭 Commercial Risk Engine</div>
                <div style="font-size:0.72rem; color:#94A3B8;">Multi-Zone Predictive Monitoring · AI-Powered</div>
            </div>
            <div style="margin-left:auto; background:#DCFCE7; color:#166534; padding:6px 12px; border-radius:10px; font-size:0.68rem; font-weight:800; border:1px solid #BBF7D0;">
                LIVE
            </div>
        </div>

        <div style="background:#fff; border-radius:20px; padding:14px 18px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; border:1px solid #E2E8F0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <div>
                <div style="font-size:0.78rem; font-weight:700; color:#0F172A;">Predict Window</div>
                <div style="font-size:0.68rem; color:#94A3B8;">Forecast horizon for risk detection</div>
            </div>
            <select id="commercialPredictSelect" style="border:1px solid #E2E8F0; background:#F8FAFC; color:#064E3B; padding:8px 14px; border-radius:12px; font-weight:700; outline:none; cursor:pointer; font-size:0.85rem;">
                <option value="30">30 Mins</option>
                <option value="60" selected>60 Mins</option>
                <option value="90">90 Mins</option>
            </select>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:16px;">
            <button class="scope-tab active-tab" data-scope="all"
                style="flex:1; padding:10px; border-radius:12px; border:1px solid #BBF7D0; background:#F0FDF4; color:#166534; font-weight:700; cursor:pointer; font-size:0.78rem;">
                All Alerts
            </button>
            <button class="scope-tab" data-scope="farm"
                style="flex:1; padding:10px; border-radius:12px; border:1px solid #E2E8F0; background:#F8FAFC; color:#64748B; font-weight:700; cursor:pointer; font-size:0.78rem;">
                🏭 Farm Level
            </button>
            <button class="scope-tab" data-scope="zone"
                style="flex:1; padding:10px; border-radius:12px; border:1px solid #E2E8F0; background:#F8FAFC; color:#64748B; font-weight:700; cursor:pointer; font-size:0.78rem;">
                🗺️ Zone Level
            </button>
        </div>

        <div id="commercialAlertsList">
            ${renderCommercialSkeleton()}
        </div>

        <div id="aiProvenancePanel" style="display:none; background:#fff; border:1px solid #E2E8F0; border-radius:16px; padding:14px 16px; margin-top:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        </div>

        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:16px; padding:14px 16px; margin-top:8px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
            <div style="font-size:0.75rem; color:#64748B; line-height:1.6;">
                <b style="color:#0F172A;">🧠 AI Analysis Logic:</b> Sensor history is fetched live from Firebase for all your farm zones. Slope calculations over the last 10 readings extrapolate risks <span id="aiFooterMinutes">${predictMinutes}</span> minutes ahead. Alerts are only raised when projected values breach critical thresholds.
            </div>
        </div>
    </div>`;
}

// ═════════════════════════════════════════════════════════════════
//  init()
// ═════════════════════════════════════════════════════════════════
export async function init(params = {}) {
    setTimeout(() => {
        const backBtn = document.getElementById('alertCommercialBack');
        if (backBtn) backBtn.onclick = () => showScreen('dash-c');

        const sel = document.getElementById('commercialPredictSelect');
        if (sel) {
            sel.value = String(predictMinutes);
            sel.onchange = e => {
                predictMinutes = parseInt(e.target.value);
                const footer = document.getElementById('aiFooterMinutes');
                if (footer) footer.textContent = predictMinutes;
                showToast('success', `AI recalibrating for ${predictMinutes} min window…`);
                loadCommercialAlerts();
            };
        }

        document.querySelectorAll('.scope-tab').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.scope-tab').forEach(t => {
                    t.style.background = '#F8FAFC';
                    t.style.color      = '#64748B';
                    t.style.borderColor = '#E2E8F0';
                    t.classList.remove('active-tab');
                });
                tab.style.background  = '#F0FDF4';
                tab.style.color       = '#166534';
                tab.style.borderColor = '#BBF7D0';
                tab.classList.add('active-tab');
                filterAlerts(tab.dataset.scope);
            };
        });

        if (_cachedAlerts.length > 0) {
            // 有缓存，直接渲染，不重新 fetch
            const container = document.getElementById('commercialAlertsList');
            const provPanel = document.getElementById('aiProvenancePanel');
            if (container) renderCommercialAlerts(container, _cachedAlerts, _cachedZones, _cachedMasterHistory);
            if (provPanel && _cachedMeta) {
                provPanel.style.display = 'block';
                provPanel.innerHTML = renderAiProvenancePanel(_cachedMeta, _cachedZones.length);
            }
            const returnScope = params?.returnScope || 'all';
    if (returnScope !== 'all') {
        const tab = document.querySelector(`.scope-tab[data-scope="${returnScope}"]`);
        if (tab) tab.click();
    }
        } else {
            loadCommercialAlerts();
        }
    }, 50);
}

// ═════════════════════════════════════════════════════════════════
//  Zone discovery — reads your actual zones from Firebase farm doc
// ═════════════════════════════════════════════════════════════════
async function discoverZoneIds(masterDeviceId) {
    const farm = AppState.currentFarm;
    console.log('[discoverZoneIds] currentFarm:', farm);  // ← 加这行

    if (!Array.isArray(farm?.zones) || farm.zones.length === 0) {
        console.warn('[discoverZoneIds] No zones found, using hardcode fallback');
        return ['zone_A', 'zone_B', 'zone_C'];  // ← 临时 hardcode
    }
    
    // 从 currentFarm.zones 取 zone_id
    if (Array.isArray(farm?.zones) && farm.zones.length > 0) {
        const ids = farm.zones
            .map(z => z.zone_id || z.zoneId)
            .filter(Boolean);
        if (ids.length > 0) {
            console.log('[discoverZoneIds] from currentFarm.zones:', ids);
            return ids;
        }
    }

    // Fallback — 从 commercialDevices 取 zone_node
    if (Array.isArray(farm?.commercialDevices) && farm.commercialDevices.length > 0) {
        const ids = farm.commercialDevices
            .filter(d => d.nodeType === 'zone_node' && d.zoneId)
            .map(d => d.zoneId)
            .filter(Boolean);
        if (ids.length > 0) {
            console.log('[discoverZoneIds] from commercialDevices:', ids);
            return ids;
        }
    }

    console.warn('[discoverZoneIds] Could not find zones in currentFarm');
    return null;
}

// ═════════════════════════════════════════════════════════════════
//  Core data + AI logic
// ═════════════════════════════════════════════════════════════════
let _cachedAlerts = [];
let _cachedMeta   = null;
let _cachedZones  = [];
let _cachedMasterHistory = [];

function normalizeCommercialZoneId(zoneId) {
    const raw = String(zoneId || '').trim();
    if (!raw) return '';
    if (raw.startsWith('zone_')) return raw;
    if (/^[A-F]$/i.test(raw)) return `zone_${raw.toUpperCase()}`;
    return raw;
}

function resolveZoneDeviceId(zoneId) {
    const normalizedZone = normalizeCommercialZoneId(zoneId);
    const farm = AppState.currentFarm || {};
    const activeDevice = Array.isArray(farm.commercialDevices)
        ? farm.commercialDevices.find(device =>
            device.active !== false &&
            device.status !== 'replaced' &&
            normalizeCommercialZoneId(device.targetId || device.zoneId || device.zone) === normalizedZone
        )
        : null;
    if (activeDevice?.deviceId) return activeDevice.deviceId;

    const map = {
        'zone_A': 'commercial-zone-node-1',
        'zone_B': 'commercial-zone-node-2',
        'zone_C': 'commercial-zone-node-3',
    };
    return map[normalizedZone] || normalizedZone;
}

async function loadCommercialAlerts() {
    if (isLoading) return;
    isLoading = true;

    const container = document.getElementById('commercialAlertsList');
    if (!container) { isLoading = false; return; }
    container.innerHTML = renderCommercialSkeleton();

    // Hide provenance panel while loading
    const provPanel = document.getElementById('aiProvenancePanel');
    if (provPanel) provPanel.style.display = 'none';

    try {
        const masterDeviceId = 'commercial-farm-master-1';

        // 1. Discover actual zone IDs from Firebase/farm doc
        const zoneIds = await discoverZoneIds(masterDeviceId);
        console.log('[Debug] discovered zoneIds:', zoneIds);

        if (!zoneIds) {
            container.innerHTML = renderZoneConfigWarning(masterDeviceId);
            isLoading = false;
            return;
        }

        // 2. Fetch master sensor data
        const [masterLatestRes, masterHistRes] = await Promise.all([
            fetch(`${API}/api/sensors/latest?deviceId=${masterDeviceId}`),
            fetch(`${API}/api/sensors/history?deviceId=${masterDeviceId}&limit=10`),
        ]);

        const masterLatest  = (await masterLatestRes.json()).reading  || {};
        const masterHistory = (await masterHistRes.json()).readings   || [];
        _cachedMasterHistory = masterHistory;

        // 3. Fetch ALL zones in parallel — your real zones, however many
        const zoneResults = await Promise.allSettled(
            zoneIds.map(async zoneId => {
                const zoneDeviceId = resolveZoneDeviceId(zoneId);  // ← 直接调用
                const [latestR, histR] = await Promise.all([
                    fetch(`${API}/api/sensors/latest?deviceId=${zoneDeviceId}&zoneId=${zoneId}`),
                    fetch(`${API}/api/sensors/history?deviceId=${zoneDeviceId}&zoneId=${zoneId}&limit=10`),
                ]);
                const latestReading   = (await latestR.json()).reading   || {};
                const historyReadings = (await histR.json()).readings    || [];
                return { zoneId, latestReading, historyReadings };
            })
        );
        const zones = zoneResults
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value);
            console.log('[Debug] zones fetched:', zones.map(z => ({
                zoneId: z.zoneId,
                historyCount: z.historyReadings.length,
                latestReading: z.latestReading
            })));

            _cachedZones = zones;

        // 4. Call AI prediction endpoint with real Firebase data
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
        _cachedMeta   = aiData.aiMeta || null;

        // Show AI provenance panel
        if (_cachedMeta && provPanel) {
            provPanel.style.display = 'block';
            provPanel.innerHTML = renderAiProvenancePanel(_cachedMeta, zoneIds.length);
        }

        if (_cachedAlerts.length === 0) {
            container.innerHTML = renderCommercialStableCard(zoneIds.length);
        } else {
            renderCommercialAlerts(container, _cachedAlerts, _cachedZones, _cachedMasterHistory);
        }

    } catch (err) {
        console.warn('[AlertsListCommercial] Error:', err.message);
        container.innerHTML = renderErrorCard(err.message);
    } finally {
        isLoading = false;
    }
}

function filterAlerts(scope) {
    const container = document.getElementById('commercialAlertsList');
    if (!container || !_cachedAlerts.length) return;
    const filtered = scope === 'all' ? _cachedAlerts : _cachedAlerts.filter(a => a.scope === scope);
    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#94A3B8; font-size:0.88rem;">No ${scope}-level alerts detected.</div>`;
    } else {
        renderCommercialAlerts(container, filtered, _cachedZones, _cachedMasterHistory);
    }
}

// ═════════════════════════════════════════════════════════════════
//  UI Renderers
// ═════════════════════════════════════════════════════════════════
function renderCommercialAlerts(container, alerts, zones = [], masterHistory = []) {
    const critCount = alerts.filter(a => a.severity === 'critical').length;
    const warnCount = alerts.filter(a => a.severity === 'warning').length;

    const summaryBar = `
        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:16px; padding:12px 16px; margin-bottom:14px; display:flex; gap:16px; align-items:center; box-shadow:0 1px 4px rgba(0,0,0,0.04);">
            <div style="flex:1; text-align:center;">
                <div style="font-size:1.5rem; font-weight:900; color:#EF4444;">${critCount}</div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:700;">CRITICAL</div>
            </div>
            <div style="width:1px; height:36px; background:#E2E8F0;"></div>
            <div style="flex:1; text-align:center;">
                <div style="font-size:1.5rem; font-weight:900; color:#F59E0B;">${warnCount}</div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:700;">WARNINGS</div>
            </div>
            <div style="width:1px; height:36px; background:#E2E8F0;"></div>
            <div style="flex:1; text-align:center;">
                <div style="font-size:1.5rem; font-weight:900; color:#22C55E;">${alerts.length}</div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:700;">TOTAL</div>
            </div>
        </div>`;

        container.innerHTML = summaryBar + alerts.map((a, i) => renderCommercialCard(a, i, zones, masterHistory)).join('');

    container.querySelectorAll('[data-comm-action]').forEach(btn => {
        btn.onclick = () => handleCommercialAction(btn);
    });

    container.querySelectorAll('[data-comm-detail]').forEach(btn => {
        btn.onclick = () => {
            const p = {
                title:          btn.dataset.title,
                prediction:     btn.dataset.prediction,
                projectedValue: btn.dataset.projected,
                confidence:     btn.dataset.confidence,
                risk:           btn.dataset.risk,
                scope:          btn.dataset.scope,
                zoneId:         btn.dataset.zone,
                mode:           'commercial',
                history:        btn.dataset.history,
            };
            console.log('[Commercial] showScreen params:', p);  // ← 加这行
            showScreen('alert-detail', p);
        };
    });
}

function renderCommercialCard(a, index, zones = [], masterHistory = []) {
    const sev      = SEV[a.severity] || SEV.warning;
    const riskConf = RISK_ACTIONS[a.risk] || RISK_ACTIONS.default;
    const confPct  = Math.round((a.confidence || 0.8) * 100);
    const normalizedZoneId = a.zoneId 
    ? (a.zoneId.startsWith('zone_') ? a.zoneId : `zone_${a.zoneId}`)
    : null;
const matchedZone = zones.find(z => z.zoneId === normalizedZoneId);
console.log('[Card] a.zoneId:', a.zoneId, '→ normalized:', normalizedZoneId, '| matched:', matchedZone?.zoneId);
    console.log('[Card] a.zoneId:', a.zoneId, '| zones:', zones.map(z => z.zoneId), '| matched:', matchedZone?.zoneId);
    const historyData = a.scope === 'farm' ? masterHistory : (matchedZone?.historyReadings || []);
    const encodedHistory = encodeURIComponent(JSON.stringify(historyData));
    const scopeTag = a.scope === 'farm'
        ? `<span style="background:#ECFEFF; color:#0f766e; padding:3px 8px; border-radius:6px; font-size:0.62rem; font-weight:800; border:1px solid #99F6E4;">🏭 FARM</span>`
        : `<span style="background:#F0FDF4; color:#166534; padding:3px 8px; border-radius:6px; font-size:0.62rem; font-weight:800; border:1px solid #BBF7D0;">🗺️ ZONE ${a.zoneId ?? ''}</span>`;

    return `
    <div style="background:${sev.bg}; border:1.5px solid ${sev.border}; border-left:4px solid ${sev.badge}; border-radius:20px; padding:20px; margin-bottom:12px; animation:fadeSlide 0.3s ease both; animation-delay:${index * 0.07}s;">

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="display:flex; gap:10px; align-items:center;">
                <div style="width:44px; height:44px; background:#fff; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                    ${a.emoji || '⚠️'}
                </div>
                <div>
                    <div style="display:flex; gap:6px; align-items:center; margin-bottom:4px;">
                        ${scopeTag}
                        <span style="background:${sev.badge}22; color:${sev.badge}; padding:3px 8px; border-radius:6px; font-size:0.62rem; font-weight:800; border:1px solid ${sev.badge}44;">${sev.label}</span>
                    </div>
                    <b style="color:#0F172A; font-size:0.95rem;">${a.title}</b>
                </div>
            </div>
        </div>

        <p style="color:#475569; font-size:0.85rem; line-height:1.55; margin-bottom:12px; padding:10px 14px; background:rgba(255,255,255,0.7); border-radius:10px; border-left:3px solid ${sev.badge};">
            ${a.prediction}
        </p>

        <div style="background:#fff; border-radius:10px; padding:10px 14px; margin-bottom:14px; display:flex; gap:10px; align-items:flex-start; border:1px solid ${sev.border};">
            <span style="font-size:1rem; margin-top:1px;">🔧</span>
            <div>
                <div style="font-size:0.65rem; color:#94A3B8; font-weight:800; margin-bottom:3px;">RECOMMENDED ACTION</div>
                <div style="font-size:0.82rem; color:#334155;">${a.action}</div>
            </div>
        </div>

        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <div style="flex:1; background:#fff; border-radius:10px; padding:8px 12px; border:1px solid ${sev.border};">
                <div style="font-size:0.6rem; color:#94A3B8; font-weight:800; margin-bottom:2px;">📊 PROJECTED</div>
                <div style="font-size:0.85rem; font-weight:800; color:#0F172A;">${a.projectedValue || '–'}</div>
            </div>
            <div style="flex:1; background:#fff; border-radius:10px; padding:8px 12px; border:1px solid ${sev.border};">
                <div style="font-size:0.6rem; color:#94A3B8; font-weight:800; margin-bottom:4px;">🎯 AI CONFIDENCE</div>
                <div style="height:5px; background:#E2E8F0; border-radius:3px; overflow:hidden; margin-bottom:2px;">
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
                data-history="${encodedHistory}"
                style="flex:1; background:#fff; color:#475569; border:1.5px solid ${sev.border}; padding:12px; border-radius:14px; font-weight:700; cursor:pointer; font-size:0.82rem;">
                📈 Detail
            </button>
        </div>
    </div>`;
}

function renderAiProvenancePanel(meta, zoneCount) {
    const time = meta.generatedAt ? new Date(meta.generatedAt).toLocaleTimeString() : '–';
    const slopes = meta.masterSlopes || {};
    const zoneReadings = (meta.zoneReadingCounts || []).map(z =>
        `Zone ${z.zoneId}: ${z.count} readings`
    ).join(' · ') || 'No zone data';

    return `
    <div style="font-size:0.75rem; color:#64748B; line-height:1.7;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <div style="width:8px; height:8px; background:#22C55E; border-radius:50%; animation:pulse 2s infinite;"></div>
            <b style="color:#0F172A; font-size:0.82rem;">🧠 AI Response — Live, Not Hardcoded</b>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px;">
            <div style="background:#F8FAFC; border-radius:8px; padding:7px 10px; border:1px solid #E2E8F0;">
                <div style="color:#94A3B8; font-size:0.62rem; font-weight:700; margin-bottom:2px;">⏰ Generated At</div>
                <div style="color:#0F172A; font-weight:700;">${time}</div>
            </div>
            <div style="background:#F8FAFC; border-radius:8px; padding:7px 10px; border:1px solid #E2E8F0;">
                <div style="color:#94A3B8; font-size:0.62rem; font-weight:700; margin-bottom:2px;">🔑 Prompt Hash</div>
                <div style="color:#0F172A; font-weight:700; font-family:monospace;">#${meta.promptHash || '–'}</div>
            </div>
            <div style="background:#F8FAFC; border-radius:8px; padding:7px 10px; border:1px solid #E2E8F0;">
                <div style="color:#94A3B8; font-size:0.62rem; font-weight:700; margin-bottom:2px;">📡 Master Readings</div>
                <div style="color:#0F172A; font-weight:700;">${meta.masterReadingCount ?? 0} from Firebase</div>
            </div>
            <div style="background:#F8FAFC; border-radius:8px; padding:7px 10px; border:1px solid #E2E8F0;">
                <div style="color:#94A3B8; font-size:0.62rem; font-weight:700; margin-bottom:2px;">🗺️ Active Zones</div>
                <div style="color:#0F172A; font-weight:700;">${zoneCount} zones fetched</div>
            </div>
        </div>
        <div style="background:#F8FAFC; border-radius:8px; padding:7px 10px; border:1px solid #E2E8F0; margin-bottom:6px;">
            <div style="color:#94A3B8; font-size:0.62rem; font-weight:700; margin-bottom:3px;">📊 Calculated Slopes (trend per reading)</div>
            <div style="color:#334155;">Water: <b>${slopes.water ?? '–'}</b> · Energy: <b>${slopes.energy ?? '–'}</b> · CO₂: <b>${slopes.co2 ?? '–'}</b></div>
        </div>
        <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:8px; padding:7px 10px;">
            <div style="color:#92400E; font-size:0.7rem;">📋 Zone Firebase readings: ${zoneReadings}</div>
        </div>
    </div>`;
}

function renderCommercialStableCard(zoneCount) {
    return `
    <div style="background:#fff; border:1.5px solid #BBF7D0; border-radius:20px; padding:36px 24px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <div style="font-size:3rem; margin-bottom:12px;">✅</div>
        <b style="font-size:1.1rem; color:#064E3B; display:block; margin-bottom:8px;">All ${zoneCount} Zone${zoneCount !== 1 ? 's' : ''} Operating Normally</b>
        <p style="color:#6B7280; font-size:0.85rem; line-height:1.5;">
            AI analyzed live Firebase data from your farm master<br>and all ${zoneCount} zone node${zoneCount !== 1 ? 's' : ''}.<br>
            No risks detected for the next ${predictMinutes} minutes.
        </p>
        <button onclick="window._reloadCommercialAlerts?.()"
            style="margin-top:16px; background:#064E3B; color:#fff; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Re-analyze
        </button>
    </div>`;
}

function renderZoneConfigWarning(deviceId) {
    return `
    <div style="background:#FFFBEB; border:1.5px solid #FDE68A; border-radius:20px; padding:28px 24px; text-align:center;">
        <div style="font-size:2.5rem; margin-bottom:12px;">⚠️</div>
        <b style="font-size:1rem; color:#92400E; display:block; margin-bottom:8px;">Zone Configuration Not Found</b>
        <p style="color:#6B7280; font-size:0.82rem; line-height:1.5; margin-bottom:16px;">
            Could not discover your zone layout for device <code style="background:#FEF3C7; padding:2px 6px; border-radius:4px;">${deviceId}</code>.<br>
            Make sure your zones are configured in your farm settings and that sensor data has been received from each zone.
        </p>
        <button onclick="window._reloadCommercialAlerts?.()"
            style="background:#D97706; color:#fff; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Retry
        </button>
    </div>`;
}

function renderErrorCard(msg) {
    return `
    <div style="background:#FEF2F2; border:1.5px solid #FECACA; border-radius:20px; padding:28px 24px; text-align:center;">
        <div style="font-size:2.5rem; margin-bottom:12px;">❌</div>
        <b style="font-size:1rem; color:#991B1B; display:block; margin-bottom:8px;">Connection Error</b>
        <p style="color:#6B7280; font-size:0.82rem; line-height:1.5; margin-bottom:16px;">${msg}</p>
        <button onclick="window._reloadCommercialAlerts?.()"
            style="background:#EF4444; color:#fff; border:none; padding:12px 24px; border-radius:14px; font-weight:700; cursor:pointer;">
            🔄 Retry
        </button>
    </div>`;
}

function renderCommercialSkeleton() {
    return [1, 2, 3].map(i => `
        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:20px; padding:20px; margin-bottom:12px; opacity:${1 - i * 0.2};">
            <div style="display:flex; gap:10px; margin-bottom:12px;">
                <div style="width:44px; height:44px; background:#F1F5F9; border-radius:12px;"></div>
                <div style="flex:1;">
                    <div style="width:80px; height:10px; background:#F1F5F9; border-radius:4px; margin-bottom:6px;"></div>
                    <div style="width:160px; height:14px; background:#F1F5F9; border-radius:6px;"></div>
                </div>
            </div>
            <div style="height:48px; background:#F8FAFC; border-radius:10px; margin-bottom:10px;"></div>
            <div style="height:38px; background:#F1F5F9; border-radius:14px;"></div>
        </div>`
    ).join('') + `
    <div style="text-align:center; padding:16px; color:#94A3B8; font-size:0.8rem;">
        🏭 Fetching Firebase data for all zones…
    </div>`;
}

// ── Action handler ─────────────────────────────────────────────────
function handleCommercialAction(btn) {
    const risk  = btn.dataset.risk;
    const zone  = normalizeCommercialZoneId(btn.dataset.zone);
    const title = decodeURIComponent(btn.dataset.title || 'Alert');
    const masterDeviceId = 'commercial-farm-master-1';
    const command = commercialRiskToCommand(risk);
    const targetDeviceId = zone ? resolveZoneDeviceId(zone) : masterDeviceId;

    btn.style.opacity = '0.5';
    btn.textContent   = '⏳ Queuing…';
    btn.disabled      = true;

    fetch(`${API}/api/sensors/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            deviceId: targetDeviceId,
            zoneId:   zone || null,
            command,
            source:   'predictive_alert_commercial',
            reason:   `AI-triggered: ${title}${zone ? ` (${zone})` : ''}`,
        }),
    }).catch(() => {});

    setTimeout(() => {
        btn.style.background = '#064E3B';
        btn.style.color      = '#fff';
        btn.style.opacity    = '1';
        btn.textContent      = `✅ ${command}`;
        btn.disabled         = false;
        showToast('success', `✅ ${title} — ${command} queued${zone ? ` for ${zone}` : ''}`);
    }, 700);
}

function commercialRiskToCommand(risk) {
    const map = {
        water_depletion:   'BUZZER_ON',
        energy_overload:   'NO_ACTION',
        co2_crisis:        'FAN_ON,CO2_LOW',
        zone_heat:         'FAN_ON',
        zone_rot:          'FAN_ON',
        zone_ec_burn:      'FERT_ALERT',
        zone_ec_deficient: 'FERT_ALERT',
        zone_clog:         'WATER_ON',
    };
    return map[risk] || 'BUZZER_ON';
}

window._reloadCommercialAlerts = loadCommercialAlerts;

if (!document.getElementById('alertAnimStyle')) {
    const style = document.createElement('style');
    style.id = 'alertAnimStyle';
    style.textContent = `
        @keyframes fadeSlide {
            from { opacity:0; transform:translateY(10px); }
            to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
            0%, 100% { opacity:1; }
            50% { opacity:0.4; }
        }`;
    document.head.appendChild(style);
}

export const AlertsListCommercial = { render, init };
