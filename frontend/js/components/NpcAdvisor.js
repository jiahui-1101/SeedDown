import { AppState } from '../store.js';
import { conciseAIText } from '../utils/aiFormat.js';

const messages = {
    idle: [
        'Your farm looks healthy. Keep monitoring the live data.',
        'Conditions are stable. This is a good time to check plant growth.',
        'Farm balance looks good. No urgent action needed right now.'
    ],
    warning: [
        'One reading needs attention. Check water, pH, or humidity soon.',
        'A sensor is drifting from the ideal range. Review the live data before the next cycle.',
        'Your farm is mostly fine, but one condition may need adjustment.'
    ],
    danger: [
        'Critical reading detected. Check the highlighted sensor now.',
        'The farm needs attention. Start with temperature, gas, or water level.',
        'One condition is unsafe. Review live data and take action quickly.'
    ],
    ready: [
        'Some plants look ready to harvest. Check the plant map.',
        'Harvest timing may be close for one crop. Review your field details.'
    ]
};

const advisorMeta = {
    idle: { name: 'SEEDDOWN AI ADVISOR', avatar: '🌿', color: 'var(--accent)' },
    warning: { name: 'SEEDDOWN AI ADVISOR', avatar: '⚠️', color: 'var(--warn)' },
    danger: { name: 'SEEDDOWN AI ALERT', avatar: '🚨', color: 'var(--danger)' },
    ready: { name: 'SEEDDOWN AI TIP', avatar: '🌿', color: 'var(--ok)' },
};

export const NpcAdvisor = {
    currentMsg: '',
    currentType: 'idle',
    lastIndex: -1,
    unsubscribe: null,

    init() {
        if (this.unsubscribe) this.unsubscribe();
        this.updateMessage();
        this.bindControls();
        this.unsubscribe = AppState.subscribe(() => this.updateMessage());
    },

    updateMessage(forceNext = false) {
        const hasDanger = Object.values(AppState.sensors || {}).some(s => s.status === 'danger');
        const hasWarn = Object.values(AppState.sensors || {}).some(s => s.status === 'warning');
        let type = 'idle';

        if (hasDanger) type = 'danger';
        else if (hasWarn) type = 'warning';
        else if ((AppState.tiles || []).some(t => t.status === 'ready')) type = 'ready';

        const pool = messages[type] || messages.idle;
        let nextIndex = Math.floor(Math.random() * pool.length);
        if (forceNext && pool.length > 1 && nextIndex === this.lastIndex) {
            nextIndex = (nextIndex + 1) % pool.length;
        }

        this.currentType = type;
        this.lastIndex = nextIndex;
        this.currentMsg = pool[nextIndex];
        this.render();
    },

    bindControls() {
        const nextBtn = document.getElementById('npcNext');
        const dismissBtn = document.getElementById('npcDismiss');

        if (nextBtn) nextBtn.onclick = () => this.updateMessage(true);
        if (dismissBtn) {
            dismissBtn.onclick = () => {
                const wrap = document.querySelector('.advisor-wrap');
                if (wrap) wrap.style.display = 'none';
            };
        }
    },

    render() {
        const textEl = document.getElementById('npcText');
        const nameEl = document.getElementById('npcName');
        const avatarEl = document.getElementById('npcAvatar');
        const meta = advisorMeta[this.currentType] || advisorMeta.idle;

        if (textEl) textEl.textContent = conciseAIText(this.currentMsg || messages.idle[0], 135);
        if (nameEl) {
            nameEl.textContent = meta.name;
            nameEl.style.color = meta.color;
        }
        if (avatarEl) avatarEl.textContent = meta.avatar;
    }
};
