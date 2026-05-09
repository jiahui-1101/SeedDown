import { AppState } from '../store.js';

const messages = {
    idle: ['Your farm looks healthy! Keep it up.', 'Monitor temperature closely today.'],
    warning: ['Spinach B2 needs water!', 'Humidity is dropping.'],
    danger: ['Critical temperature! Activate cooling now.'],
    ready: ['Basil is ready to harvest!']
};

export const NpcAdvisor = {
    currentMsg: '',

    init() {
        this.updateMessage();
        AppState.subscribe(() => this.updateMessage());
    },
    updateMessage() {
        const hasDanger = Object.values(AppState.sensors).some(s => s.status === 'danger');
        const hasWarn = Object.values(AppState.sensors).some(s => s.status === 'warning');
        let type = 'idle';
        if (hasDanger) type = 'danger';
        else if (hasWarn) type = 'warning';
        else if (AppState.tiles.some(t => t.status === 'ready')) type = 'ready';
        this.currentMsg = messages[type][Math.floor(Math.random() * messages[type].length)];
        this.render();
    },
    render() { /* 更新DOM */ }
};