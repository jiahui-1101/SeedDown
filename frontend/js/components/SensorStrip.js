import { API_BASE } from '../utils/apiBase.js';
import { AppState } from '../store.js';
import { showScreen } from '../utils/navigation.js';
import { hasRealSensorData, normalizeSensorReading, sensorStatusRange, toFiniteNumber } from '../utils/sensorReading.js';


const PACKAGE_SENSOR_KEYS = {
    starter: ['temp', 'humid', 'light'],
    standard: ['temp', 'humid', 'light', 'ph', 'water', 'nutrient'],
    pro: ['temp', 'humid', 'light', 'ph', 'water', 'nutrient', 'ec', 'co2'],
};
const BEGINNER_LIVE_CACHE_KEY = 'seeddown_beginner_live_cache';

export const SensorStrip = {
    container: null,
    refreshInterval: null,
    lastReading: null,
    lastQuery: null,

    async init() {
        this.container = document.getElementById('dashStrip');
        if (!this.container) return;

        this.container.className = '';
        this.container.style.display = 'block';
        this.container.style.width = '100%';

        AppState.subscribe(() => this.render());
        await this.fetchLatestData();

        if (this.refreshInterval) clearInterval(this.refreshInterval);
        this.refreshInterval = setInterval(() => this.fetchLatestData(), 10000);
    },

   async fetchLatestData() {
    try {
        const query = buildSensorQuery();
        this.lastQuery = query;
        const response = await fetch(`${API_BASE}/api/sensors/latest?${query.toString()}`);
        const data = await response.json();
        const reading = data?.readings?.[0] || data?.reading || null;
        const cached = getCachedReading(query);

        if (isReliableReading(reading) && isNewerReading(reading, cached)) {
            const stableReading = rememberReading(query, reading);
            this.applyReading(stableReading);
        } else if (cached && !this.lastReading) {
            this.applyReading({ ...cached, _stale: true });
        }
    } catch (err) {
        console.error('Dashboard cannot fetch latest sensor data:', err);
        const cached = getCachedReading(this.lastQuery || buildSensorQuery());
        if (cached && !this.lastReading) this.applyReading({ ...cached, _stale: true });
    }
},

    applyReading(reading) {
        const normalized = normalizeSensorReading(reading);
        this.lastReading = normalized;
        AppState.latestReading = normalized;
        AppState.sensors = mapReadingToSensors(normalized, getCurrentFarm()?.thresholds || {});
        AppState.notify();
    },

    render() {
    if (!this.container) return;
    const s = AppState.sensors || {};
    const hasData = Object.values(s).some(v => v.val !== '--');
    if (!hasData && this.lastReading) return; // don't re-render blank over real data
    const farm = getCurrentFarm();
    const reading = this.lastReading || AppState.latestReading || {};
        const updatedText = formatReadingTime(reading);
        const metadata = [
            reading.deviceId || resolveBeginnnerDeviceId(farm),
            reading.fieldId || farm?.id,
            reading.zoneId || farm?.zone,
            reading.packageLevel || farm?.packageLevel,
            updatedText,
        ].filter(Boolean);
        const stateLabel = reading.deviceId ? (reading._stale ? 'CACHED' : 'LIVE') : 'NO DATA';
        const stateOk = reading.deviceId && !reading._stale;

        const allItems = [
            { icon: '🌡️', key: 'temp', label: 'Temp', unit: '°C' },
            { icon: '💧', key: 'humid', label: 'Humid', unit: '%rh' },
            { icon: '☀️', key: 'light', label: 'Light', unit: '' },
            { icon: '🧪', key: 'ph', label: 'pH', unit: 'pH' },
            { icon: '💦', key: 'water', label: 'Water', unit: 'cm' },
            { icon: '🧬', key: 'nutrient', label: 'Gas', unit: '' },
            { icon: '🧫', key: 'ec', label: 'EC', unit: 'mS/cm' },
            { icon: '🌬️', key: 'co2', label: 'CO2', unit: 'ppm' },
        ];
        const enabledKeys = sensorKeysForPackage(farm, reading);
        const items = allItems.filter(item => enabledKeys.includes(item.key));
        const columns = items.length <= 3 ? 3 : items.length <= 6 ? 3 : 4;

        this.container.innerHTML = `
            <div style="background:#FFFFFF;border-radius:24px;padding:20px 16px;margin:0 16px 16px 16px;box-shadow:0 4px 20px rgba(0,0,0,0.03);">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:16px;">
                    <div style="display:flex;align-items:center;min-width:0;">
                        <div style="width:4px;height:16px;background:#059669;border-radius:4px;margin-right:8px;"></div>
                        <div>
                            <div style="font-size:1.05rem;font-weight:700;color:#1A1A1A;">Live Data</div>
                            <div style="font-size:0.62rem;color:#64748B;font-weight:700;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;">
                                ${escapeHTML(metadata.join(' · ') || 'Waiting for device data')}
                            </div>
                        </div>
                    </div>
                    <span style="font-size:0.62rem;font-weight:900;color:${stateOk ? '#059669' : '#D97706'};background:${stateOk ? '#ECFDF5' : '#FFFBEB'};padding:6px 8px;border-radius:999px;white-space:nowrap;">
                        ${stateLabel}
                    </span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(${columns},minmax(0,1fr));grid-auto-rows:1fr;gap:10px;">
                    ${items.map(item => this.createGridCard(item, s[item.key] || { val: '--', status: 'normal', note: '' })).join('')}
                </div>
                ${thresholdSummaryHtml(s)}
            </div>
        `;

        this.container.querySelectorAll('.sensor-click-card').forEach(card => {
            card.addEventListener('click', () => {
                const deviceId = resolveBeginnnerDeviceId(farm);
                showScreen('sensor-detail', {
                    key: card.getAttribute('data-key'),
                    name: card.getAttribute('data-label'),
                    deviceId,
                    from: 'home',
                });
            });
        });
    },

    createGridCard(item, sensorData) {
        const isDanger  = sensorData.status === 'danger';
        const isWarning = sensorData.status === 'warning';
        const valColor  = isDanger ? '#DC2626' : isWarning ? '#D97706' : '#059669';
        const currentBg = isDanger ? '#FEE2E2' : isWarning ? '#FFFBEB' : '#ECFDF5';
        const statusLabel = isDanger ? 'Check Now' : isWarning ? 'Warning' : 'Normal';
        const statusColor = isDanger ? '#DC2626' : isWarning ? '#D97706' : '#059669';
        const statusBg    = isDanger ? '#FEE2E2' : isWarning ? '#FEF3C7' : '#D1FAE5';

        return `
            <div class="sensor-click-card" data-key="${item.key}" data-label="${item.label}" style="cursor:pointer;background:${currentBg};border-radius:12px;padding:12px;display:flex;flex-direction:column;min-height:90px;position:relative;overflow:hidden;transition:all .2s ease;">
                <div style="position:absolute;top:-5px;right:-5px;font-size:36px;opacity:.1;">${item.icon}</div>
                <div style="font-size:14px;opacity:.7;margin-bottom:auto;">${item.icon}</div>
                <div style="margin-top:12px;">
                    <div style="display:flex;align-items:baseline;gap:2px;min-width:0;">
                        <span style="font-size:1.05rem;font-weight:800;color:${valColor};word-break:break-word;">${escapeHTML(sensorData.val)}</span>
                        <span style="font-size:.55rem;color:#64748B;">${item.unit}</span>
                    </div>
                    <div style="font-size:.6rem;font-weight:700;color:#9AA5B8;margin-top:2px;">${item.label}</div>
                    <div style="margin-top:5px;display:inline-flex;align-items:center;gap:3px;background:${statusBg};border-radius:999px;padding:2px 6px;">
                        <span style="width:5px;height:5px;border-radius:50%;background:${statusColor};flex-shrink:0;display:inline-block;"></span>
                        <span style="font-size:.55rem;font-weight:900;color:${statusColor};">${statusLabel}</span>
                    </div>
                </div>
            </div>
        `;
    },
};

const DEMO_BEGINNER_DEVICES = {
    starter:          'beginner_starter',
    beginner_starter: 'beginner_starter',
    standard:         'beginner_standard',
    beginner_standard:'beginner_standard',
    pro:              'beginner_pro',
    beginner_pro:     'beginner_pro',
};

function resolveBeginnnerDeviceId(farm) {
    // If stored deviceId looks like a real demo device, use it
    const stored = farm?.deviceId;
    if (stored && stored !== 'farm_001' && !String(stored).startsWith('dev_')) return stored;
    // Derive from packageLevel
    const level = String(farm?.packageLevel || '').toLowerCase();
    return DEMO_BEGINNER_DEVICES[level] || 'beginner_standard';
}

function buildSensorQuery() {
    const farm = getCurrentFarm();
    const query = new URLSearchParams();
    const deviceId = resolveBeginnnerDeviceId(farm);
    query.set('deviceId', deviceId);
    return query;
}

function mapReadingToSensors(reading, thresholds = {}) {
    return {
        temp: sensorValue(reading.temperature, sensorStatusRange(reading.temperature, thresholds.tempMin ?? 18, thresholds.tempMax ?? 35)),
        humid: sensorValue(reading.humidity, sensorStatusRange(reading.humidity, thresholds.humidityMin ?? 35, thresholds.humidityMax ?? 80)),
        light: sensorValue(reading.lightRaw, toFiniteNumber(reading.lightRaw) !== null && reading.lightRaw < (thresholds.darkThreshold ?? 1500) ? 'warning' : 'normal'),
        ph: sensorValue(reading.ph, sensorStatusRange(reading.ph, thresholds.phMin ?? 5.5, thresholds.phMax ?? 6.8)),
        water: sensorValue(reading.waterDistanceCm, toFiniteNumber(reading.waterDistanceCm) !== null && reading.waterDistanceCm > (thresholds.waterLowCm ?? 20) ? 'warning' : 'normal'),
        nutrient: sensorValue(reading.gasRaw, toFiniteNumber(reading.gasRaw) !== null && reading.gasRaw > (thresholds.gasDangerThreshold ?? 3000) ? 'danger' : 'normal'),
        ec: sensorValue(reading.ec, sensorStatusRange(reading.ec, thresholds.ecMin ?? 1.2, thresholds.ecMax ?? 2.0)),
        co2: sensorValue(reading.co2Ppm, toFiniteNumber(reading.co2Ppm) !== null && reading.co2Ppm < (thresholds.co2MinPpm ?? 800) ? 'warning' : 'normal'),
    };
}

function sensorKeysForPackage(farm, reading) {
    const level = String(farm?.packageLevel || reading?.packageLevel || 'standard').toLowerCase();
    if (level.includes('starter')) return PACKAGE_SENSOR_KEYS.starter;
    if (level.includes('pro')) return PACKAGE_SENSOR_KEYS.pro;
    return PACKAGE_SENSOR_KEYS.standard;
}

function sensorValue(value, status) {
    const numeric = toFiniteNumber(value);
    const val = Number.isFinite(numeric) ? Number(numeric.toFixed(2)).toString() : '--';
    return { val, status };
}

function isReliableReading(reading) {
    return hasRealSensorData(reading);
}

function isNewerReading(reading, cached) {
    if (!cached) return true;
    const incomingDate = parseReadingDate(reading);
    const cachedDate = parseReadingDate(cached);
    if (!incomingDate) return false;
    if (!cachedDate) return true;
    return incomingDate.getTime() > cachedDate.getTime();
}

function rememberReading(query, reading) {
    const enriched = {
        ...reading,
        deviceId: reading.deviceId || query?.get?.('deviceId') || resolveBeginnnerDeviceId(getCurrentFarm()),
        _fetchedAt: new Date().toISOString(),
        _stale: false,
    };
    try {
        const cache = readLiveCache();
        cache[cacheScope(query)] = enriched;
        localStorage.setItem(BEGINNER_LIVE_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.warn('[SensorStrip] could not cache beginner reading:', error.message);
    }
    return enriched;
}

function getCachedReading(query) {
    const cache = readLiveCache();
    const reading = cache[cacheScope(query)];
    return reading ? { ...reading, _stale: true } : null;
}

function readLiveCache() {
    try {
        return JSON.parse(localStorage.getItem(BEGINNER_LIVE_CACHE_KEY)) || {};
    } catch {
        return {};
    }
}

function cacheScope(query) {
    const farm = getCurrentFarm();
    const deviceId = query?.get?.('deviceId') || resolveBeginnnerDeviceId(farm);
    const level = String(farm?.packageLevel || 'standard').toLowerCase();
    return `${farm?.id || AppState.currentFarmId || 'beginner_demo'}:${deviceId}:${level}`;
}

function parseReadingDate(reading) {
    const raw = reading?._fetchedAt || reading?.createdAt || reading?.updatedAt || reading?.timestamp;
    if (!raw) return null;
    if (raw instanceof Date) return raw;
    if (typeof raw === 'object') {
        if (typeof raw.toDate === 'function') return raw.toDate();
        if (raw._seconds) return new Date(raw._seconds * 1000);
        if (raw.seconds) return new Date(raw.seconds * 1000);
    }
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatReadingTime(reading) {
    const date = parseReadingDate(reading);
    if (!date) return reading?._stale ? 'Last updated cached' : '';
    return `Last updated ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function thresholdSummaryHtml(sensors = {}) {
    const dangers  = Object.entries(sensors).filter(([, s]) => s.status === 'danger');
    const warnings = Object.entries(sensors).filter(([, s]) => s.status === 'warning');
    const ok = dangers.length === 0 && warnings.length === 0;

    if (ok) return `
        <div style="margin-top:12px;padding:10px 14px;border-radius:14px;background:#ECFDF5;border:1px solid #A7F3D0;display:flex;align-items:center;gap:8px;">
            <span style="font-size:16px;">✅</span>
            <span style="font-size:.72rem;font-weight:800;color:#047857;">All sensors normal — your farm is healthy.</span>
        </div>`;

    const dangerNames  = dangers.map(([k]) => labelForKey(k));
    const warningNames = warnings.map(([k]) => labelForKey(k));
    return `
        <div style="margin-top:12px;padding:10px 14px;border-radius:14px;background:${dangers.length ? '#FEE2E2' : '#FFFBEB'};border:1px solid ${dangers.length ? '#FCA5A5' : '#FDE68A'};display:flex;align-items:flex-start;gap:8px;">
            <span style="font-size:16px;flex-shrink:0;">${dangers.length ? '🚨' : '⚠️'}</span>
            <div>
                ${dangerNames.length  ? `<div style="font-size:.72rem;font-weight:900;color:#DC2626;">Check now: ${escapeHTML(dangerNames.join(', '))}</div>` : ''}
                ${warningNames.length ? `<div style="font-size:.72rem;font-weight:800;color:#B45309;margin-top:2px;">Out of range: ${escapeHTML(warningNames.join(', '))}</div>` : ''}
            </div>
        </div>`;
}

function labelForKey(key) {
    return ({ temp: 'Temp', humid: 'Humidity', light: 'Light', ph: 'pH', water: 'Water', nutrient: 'Gas', ec: 'EC', co2: 'CO2' })[key] || key;
}

function getCurrentFarm() {
    if (AppState.currentFarm) return AppState.currentFarm;
    try {
        const farms = JSON.parse(localStorage.getItem('user_farms')) || [];
        return farms.find(farm => farm.id === AppState.currentFarmId) || farms[farms.length - 1] || null;
    } catch {
        return null;
    }
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
