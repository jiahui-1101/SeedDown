export function conciseAIText(text, maxLength = 180) {
    const cleaned = cleanAIText(text);
    if (!cleaned) return '';
    return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1).trim()}...` : cleaned;
}

export function aiAdvisorHTML(text) {
    const frame = aiFrameParts(text);
    return `
        <div class="ai-frame-mini">
            <div class="ai-frame-mini-title">${escapeHTML(frame.title)}</div>
            <div class="ai-frame-mini-body">${escapeHTML(frame.summary)}</div>
        </div>
    `;
}

export function aiChatHTML(text) {
    const frame = aiFrameParts(text);
    return `
        <div class="ai-frame">
            <div class="ai-frame-head">
                <strong>${escapeHTML(frame.title)}</strong>
                <span>${escapeHTML(frame.status)}</span>
            </div>
            ${frame.metrics.length ? `<div class="ai-frame-metrics">${frame.metrics.map(metric => `
                <div><b>${escapeHTML(metric.label)}</b><span>${escapeHTML(metric.value)}</span></div>
            `).join('')}</div>` : ''}
            <ul>${frame.bullets.map(line => `<li>${escapeHTML(line)}</li>`).join('')}</ul>
        </div>
    `;
}

function aiFrameParts(text) {
    const rawLines = String(text || '')
        .replace(/\r/g, '')
        .split(/\n|(?=\*\*[^*]+\*\*)/g)
        .map(cleanAIText)
        .filter(Boolean);
    const compact = rawLines.length ? rawLines : [cleanAIText(text)];
    const first = compact[0] || 'SeedDown AI';
    const statusLine = compact.find(line => /status|healthy|warning|critical|risk|offline|waiting/i.test(line)) || 'Current status: Review';
    const metrics = extractMetrics(compact.join(' ')).slice(0, 6);
    const usedMetricLabels = new Set(metrics.map(metric => metric.label.toLowerCase()));
    const bullets = compact
        .flatMap(line => splitSentences(line))
        .map(line => line.replace(/^[-:•\s]+/, '').trim())
        .filter(line => line && !usedMetricLabels.has(line.split(':')[0]?.toLowerCase()))
        .filter(line => !/^zone .*analysis$/i.test(line))
        .slice(0, 3)
        .map(line => conciseAIText(line, 120));

    return {
        title: titleFromLine(first),
        status: statusFromLine(statusLine),
        summary: conciseAIText(bullets[0] || first, 150),
        metrics,
        bullets: bullets.length ? bullets : ['Waiting for clearer live data before recommending action.'],
    };
}

function extractMetrics(text) {
    const metrics = [];
    const pattern = /\b(temperature|temp|humidity|humid|light raw|light|soil raw|soil|ph|pH|water distance|water|ec|co2|gas)\s*[:=-]\s*([^,;|\n-]+)/gi;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        const label = normalizeMetricLabel(match[1]);
        const value = cleanAIText(match[2]).slice(0, 24);
        if (!value || metrics.some(metric => metric.label === label)) continue;
        metrics.push({ label, value });
    }
    return metrics;
}

function splitSentences(line) {
    return String(line || '')
        .split(/(?<=[.!?])\s+|;\s+|\s+-\s+/g)
        .map(part => part.trim())
        .filter(Boolean);
}

function statusFromLine(line) {
    const cleaned = cleanAIText(line).replace(/^current status\s*[:=-]\s*/i, '');
    if (/critical|danger|urgent/i.test(cleaned)) return 'Critical';
    if (/warning|risk|check/i.test(cleaned)) return 'Check';
    if (/offline|waiting|unavailable/i.test(cleaned)) return 'Waiting';
    if (/healthy|normal|safe|good/i.test(cleaned)) return 'Healthy';
    return conciseAIText(cleaned || 'Review', 24);
}

function titleFromLine(line) {
    const cleaned = cleanAIText(line)
        .replace(/^#+\s*/, '')
        .replace(/analysis\s*$/i, 'Analysis')
        .trim();
    return conciseAIText(cleaned || 'SeedDown AI', 46);
}

function normalizeMetricLabel(label) {
    const key = String(label || '').toLowerCase();
    if (key === 'temp') return 'Temperature';
    if (key === 'humid') return 'Humidity';
    if (key === 'ph') return 'pH';
    if (key === 'co2') return 'CO2';
    return key.replace(/\b\w/g, letter => letter.toUpperCase());
}

function cleanAIText(text) {
    return String(text || '')
        .replace(/\*\*/g, '')
        .replace(/[`#>]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
