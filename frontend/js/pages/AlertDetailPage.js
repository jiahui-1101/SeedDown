// frontend/js/pages/AlertDetailPage.js
// ─────────────────────────────────────────────────────────────────
//  SeedDown — Alert Detail Page
//  Receives params from AlertsListBeginner / AlertsListCommercial
//  Params: { title, prediction, projectedValue, confidence,
//            risk, mode, scope, zoneId }
// ─────────────────────────────────────────────────────────────────
import { showScreen } from '../utils/navigation.js';

// ── Risk → chart colour + unit + icon map ─────────────────────────
const RISK_META = {
    heat_stress:        { color: '#EF4444', unit: '°C',    icon: '🌡️', label: 'Temperature' },
    wilting:            { color: '#F59E0B', unit: '%',     icon: '🍂', label: 'Soil Moisture' },
    pump_cavitation:    { color: '#3B82F6', unit: 'cm',   icon: '💧', label: 'Water Clearance' },
    nutrient_burn:      { color: '#8B5CF6', unit: 'mS/cm',icon: '🧪', label: 'EC Level' },
    nutrient_deficient: { color: '#10B981', unit: 'mS/cm',icon: '🌿', label: 'EC Level' },
    co2_crisis:         { color: '#06B6D4', unit: 'ppm',  icon: '💨', label: 'CO₂' },
    water_depletion:    { color: '#3B82F6', unit: 'cm',   icon: '🚰', label: 'Water Clearance' },
    zone_heat:          { color: '#EF4444', unit: '°C',   icon: '🌡️', label: 'Zone Temperature' },
    zone_rot:           { color: '#8B5CF6', unit: '%',    icon: '🍄', label: 'Zone Humidity' },
    zone_ec_burn:       { color: '#8B5CF6', unit: 'mS/cm',icon: '🧪', label: 'Zone EC' },
    zone_ec_deficient:  { color: '#10B981', unit: 'mS/cm',icon: '🌿', label: 'Zone EC' },
    zone_clog:          { color: '#6B7280', unit: '',     icon: '🔧', label: 'Irrigation' },
    energy_overload:    { color: '#F59E0B', unit: 'kWh',  icon: '⚡', label: 'Energy Draw' },
    co2_crisis_comm:    { color: '#06B6D4', unit: 'ppm',  icon: '💨', label: 'CO₂' },
};

const SEV_COLOR = {
    critical: '#EF4444',
    warning:  '#F59E0B',
    info:     '#3B82F6',
    stable:   '#22C55E',
};

// ═════════════════════════════════════════════════════════════════
//  render() — writes directly to DOM (fixes the blank screen bug)
// ═════════════════════════════════════════════════════════════════
export function render(params = {}) {
    const container = document.getElementById('screenContainer');
    if (!container) return '';

    // Decode params (they come URL-encoded from data attributes)
    const title          = safeDecodeURI(params.title)          || 'Alert Detail';
    const prediction     = safeDecodeURI(params.prediction)     || 'No prediction data available.';
    const projectedValue = safeDecodeURI(params.projectedValue) || '–';
    const confidence     = parseFloat(params.confidence)        || 0.8;
    const risk           = params.risk    || 'default';
    const mode           = params.mode    || 'beginner';
    const scope          = params.scope   || 'farm';
    const zoneId         = params.zoneId  || null;

    const meta     = RISK_META[risk] || { color: '#064E3B', unit: '', icon: '⚠️', label: 'Sensor' };
    const confPct  = Math.round(confidence * 100);
    const sevColor = SEV_COLOR[params.severity] || meta.color;

    // Parse the numeric projected value from projectedValue string
    // e.g. "19.5 cm in 45 min" → extract 19.5
    const projNum = parseFloat(projectedValue.match(/[\d.]+/)?.[0] || '0');

    // Build a simple illustrative trend line in SVG
    // Slope direction based on risk type
    let historyReadings = [];
try {
    historyReadings = JSON.parse(decodeURIComponent(params.history || '[]'));
} catch { historyReadings = []; }

const trendSvg = buildTrendSvg(risk, projNum, meta.color, historyReadings);

    // Scope tag for commercial
    const scopeTag = mode === 'commercial'
        ? `<span style="background:#EFF6FF; color:#1D4ED8; padding:4px 10px; border-radius:8px; font-size:0.72rem; font-weight:800; border:1px solid #BFDBFE; margin-right:8px;">
               ${scope === 'zone' ? `🗺️ Zone ${zoneId || ''}` : '🏭 Farm Level'}
           </span>`
        : '';

    container.innerHTML = `<div class="screen active" id="alert-detailScreen">
    <div style="background:#F9FBF9; min-height:100vh; font-family:sans-serif; color:#1E293B;">

        <!-- Header -->
        <div style="display:flex; align-items:center; padding:16px 20px; background:#fff; border-bottom:1px solid #EDF2F0; position:sticky; top:0; z-index:10;">
            <button id="alertDetailBack" style="background:#F0FDF4; border:none; border-radius:12px; width:40px; height:40px; cursor:pointer; font-size:1.2rem; color:#064E3B; display:flex; align-items:center; justify-content:center;">←</button>
            <div style="margin-left:12px; flex:1;">
                <div style="font-weight:800; font-size:1rem; color:#0F172A;">Detailed Analysis</div>
                <div style="font-size:0.7rem; color:#94A3B8;">SeedDown AI · ${mode === 'commercial' ? 'Commercial' : 'Home'} Risk Engine</div>
            </div>
            <div style="background:${meta.color}22; color:${meta.color}; padding:6px 12px; border-radius:10px; font-size:0.72rem; font-weight:800; border:1px solid ${meta.color}44;">
                ${meta.icon} ${meta.label}
            </div>
        </div>

        <div style="padding:20px;">

            <!-- Projected value hero card -->
            <div style="background:#fff; border-radius:24px; padding:24px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow:0 4px 20px rgba(0,0,0,0.04); text-align:center;">
                ${scopeTag ? `<div style="margin-bottom:10px;">${scopeTag}</div>` : ''}
                <div style="font-size:0.72rem; font-weight:800; color:#94A3B8; letter-spacing:1px; margin-bottom:6px;">PROJECTED RISK VALUE</div>
                <div style="font-size:3rem; font-weight:900; color:${meta.color}; line-height:1.1;">${projectedValue || '–'}</div>
                <div style="font-size:0.82rem; color:#6B7280; margin-top:8px;">AI-calculated from your live Firebase sensor trend</div>
            </div>

            <!-- Trend chart -->
            <div style="background:#fff; border-radius:24px; padding:20px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <div style="font-size:0.72rem; font-weight:800; color:#94A3B8; letter-spacing:1px; margin-bottom:14px;">📈 TREND PROJECTION</div>
                ${trendSvg}
                <div style="display:flex; justify-content:space-between; font-size:0.68rem; color:#CBD5E1; margin-top:6px;">
                    <span>10 readings ago</span>
                    <span>Now</span>
                    <span>+${projectedValue.match(/\d+ min/)?.[0] || '45 min'}</span>
                </div>
            </div>

            <!-- AI Confidence -->
            <div style="background:#fff; border-radius:20px; padding:18px 20px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <div style="font-size:0.72rem; font-weight:800; color:#94A3B8; letter-spacing:1px; margin-bottom:10px;">🎯 AI CONFIDENCE SCORE</div>
                <div style="display:flex; align-items:center; gap:14px;">
                    <div style="flex:1; height:10px; background:#F1F5F9; border-radius:6px; overflow:hidden;">
                        <div style="height:100%; width:${confPct}%; background:linear-gradient(90deg, ${meta.color}88, ${meta.color}); border-radius:6px; transition:width 0.6s ease;"></div>
                    </div>
                    <div style="font-size:1.4rem; font-weight:900; color:${meta.color}; min-width:48px;">${confPct}%</div>
                </div>
                <div style="font-size:0.75rem; color:#94A3B8; margin-top:8px;">
                    ${confPct >= 85 ? '🔴 High confidence — act now' : confPct >= 70 ? '🟡 Moderate confidence — monitor closely' : '🟢 Lower confidence — keep an eye on it'}
                </div>
            </div>

            <!-- AI Prediction text -->
            <div style="background:#fff; border-radius:20px; padding:18px 20px; margin-bottom:16px; border:1px solid #EDF2F0; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <div style="font-size:0.72rem; font-weight:800; color:#94A3B8; letter-spacing:1px; margin-bottom:10px;">🧠 AI PREDICTION</div>
                <p style="color:#334155; font-size:0.9rem; line-height:1.65; margin:0;">${prediction}</p>
            </div>

            <!-- Title / alert context -->
            <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:20px; padding:16px 20px; margin-bottom:20px;">
                <div style="font-size:0.72rem; font-weight:800; color:#166534; letter-spacing:1px; margin-bottom:6px;">📋 ALERT CONTEXT</div>
                <div style="font-size:0.9rem; color:#064E3B; font-weight:700;">${title}</div>
                <div style="font-size:0.75rem; color:#6B7280; margin-top:4px;">
                    Mode: ${mode === 'commercial' ? '🏭 Commercial Grid' : '🌱 Home Grower'} · Risk type: <code style="background:#E2E8F0; padding:2px 6px; border-radius:4px;">${risk}</code>
                </div>
            </div>

            <!-- Back button -->
            <button id="alertDetailBackBottom"
                style="width:100%; background:#064E3B; color:#fff; border:none; padding:16px; border-radius:18px; font-weight:800; cursor:pointer; font-size:1rem;">
                ← Back to Alerts
            </button>

        </div>
    </div>
    </div>`;

    return '';
}

// ═════════════════════════════════════════════════════════════════
//  init() — bind back buttons
// ═════════════════════════════════════════════════════════════════
export function init(params = {}) {
    setTimeout(() => {
        console.log('[AlertDetail] params:', params);  // ← 加这行
        const mode = params?.mode || 'beginner';
        const backTarget = mode === 'commercial' ? 'alert-commercial' : 'alert-beginner';

        const backTop = document.getElementById('alertDetailBack');
        const backBot = document.getElementById('alertDetailBackBottom');

        const goBack = () => {
            if (mode === 'commercial') {
                showScreen('alert-commercial', { returnScope: params.scope || 'all' });
            } else {
                showScreen('alert-beginner');
            }
        };

        if (backTop) backTop.onclick = goBack;
        if (backBot) backBot.onclick = goBack;
    }, 50);
}

// ═════════════════════════════════════════════════════════════════
//  Helpers
// ═════════════════════════════════════════════════════════════════
function safeDecodeURI(val) {
    if (!val) return '';
    try { return decodeURIComponent(val); } catch { return val; }
}

/**
 * Build an SVG trend line that visually represents the risk direction.
 * Since we don't have raw history points here, we draw a plausible
 * curve: stable → then trending toward the projected threshold.
 */
function buildTrendSvg(risk, projNum, color, historyReadings = []) {
    const W = 300, H = 100;

    // 根据 risk 类型决定用哪个 field
    const fieldMap = {
        heat_stress:        'temperature',
        zone_heat:          'temperature',
        wilting:            'waterDistanceCm',   // soilRaw 是原始值，用水位更准确
        pump_cavitation:    'waterDistanceCm',
        water_depletion:    'waterDistanceCm',
        nutrient_burn:      'ph',
        nutrient_deficient: 'ph',
        co2_crisis:         'gasRaw',
        zone_rot:           'humidity',    // ← 加这行
    zone_ec_burn:       'ec',          // ← 加这行
    zone_ec_deficient:  'ec',          // ← 加这行
    zone_clog:          'waterDistanceCm', // ← 
    };
    const field = fieldMap[risk] || 'temperature';

    // 取真实数据点
    const rawPoints = historyReadings
        .map(r => parseFloat(r[field]))
        .filter(v => !isNaN(v))
        .slice(-10); // 最多用 10 个点

    // 如果没有真实数据，fallback 到原来的假数据
    const goesUp = ['heat_stress', 'zone_heat', 'nutrient_burn', 'energy_overload'].includes(risk);
    const goesDown = ['wilting', 'pump_cavitation', 'water_depletion', 'nutrient_deficient', 'co2_crisis'].includes(risk);

    let points = [];

    if (rawPoints.length >= 2) {
        // 用真实数据
        const min = Math.min(...rawPoints) * 0.95;
        const max = Math.max(...rawPoints) * 1.05;
        const range = max - min || 1;

        points = rawPoints.map((val, i) => {
            const x = (i / (rawPoints.length - 1)) * W;
            const y = H - ((val - min) / range) * H * 0.8 - H * 0.1;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        });
    } else {
        // Fallback 假数据
        for (let i = 0; i < 12; i++) {
            const x = (i / 11) * W;
            let y;
            if (i < 7) {
                y = H * 0.5 + (Math.sin(i * 1.3) * 6);
            } else {
                const t = (i - 7) / 4;
                if (goesUp)        y = H * 0.5 - t * H * 0.38;
                else if (goesDown) y = H * 0.5 + t * H * 0.38;
                else               y = H * 0.5 + (Math.sin(i * 1.3) * 6);
            }
            points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
    }

    const polylinePoints = points.join(' ');
    const lastPt = points[points.length - 1].split(',');
    const threshY = goesUp ? H * 0.12 : goesDown ? H * 0.88 : null;

    return `
    <svg viewBox="0 0 300 100" style="width:100%; height:130px; overflow:visible;">
        <line x1="0" y1="25" x2="300" y2="25" stroke="#F1F5F9" stroke-width="1"/>
        <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" stroke-width="1"/>
        <line x1="0" y1="75" x2="300" y2="75" stroke="#F1F5F9" stroke-width="1"/>
        ${threshY != null ? `
        <line x1="0" y1="${threshY}" x2="300" y2="${threshY}"
              stroke="${color}" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.5"/>
        <text x="302" y="${threshY + 4}" font-size="9" fill="${color}" opacity="0.8">threshold</text>
        ` : ''}
        <polyline points="${polylinePoints}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="5" fill="${color}" opacity="0.9"/>
        <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="9" fill="${color}" opacity="0.15"/>
        <text x="4" y="12" font-size="9" fill="#94A3B8">HISTORY (${rawPoints.length > 0 ? 'live' : 'demo'})</text>
        <text x="${parseFloat(lastPt[0]) - 10}" y="12" font-size="9" fill="${color}">NOW</text>
    </svg>`;
}
