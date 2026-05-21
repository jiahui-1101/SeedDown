const localHosts = new Set(['localhost', '127.0.0.1']);

const configuredBase = typeof import.meta !== 'undefined'
    ? import.meta.env?.VITE_API_BASE
    : '';

export const API_BASE = (configuredBase && String(configuredBase).replace(/\/+$/, ''))
    || (localHosts.has(window.location.hostname) ? 'http://localhost:3000' : window.location.origin);

export function apiUrl(path = '') {
    const suffix = String(path).startsWith('/') ? path : `/${path}`;
    return `${API_BASE}${suffix}`;
}
