import { showToast } from '../utils/toast.js';

const mockUsers = [
    { id:1, name:'Aisha.Farm', farm:'Rooftop Garden', avatar:'👩‍🌾', online:true, plants:'🥬🌿🍅' },
    { id:2, name:'TanFarm88', farm:'Balcony Greens', avatar:'👨‍🌾', online:true, plants:'🌱🌶️🥦' },
    { id:3, name:'GreenKL', farm:'Urban Sprouts', avatar:'🧑‍🌾', online:false, plants:'🥬🧅🫑' }
];

export const Community = {
    renderMap(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%;">🗺️ Interactive Map (Coming Soon)</div>`;
    },
    renderUserList(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = mockUsers.map(u => `
            <div class="user-card" style="background:var(--surface); border-radius:16px; padding:12px; display:flex; align-items:center; gap:12px;">
                <div style="font-size:36px;">${u.avatar}</div>
                <div style="flex:1;"><div style="font-weight:700;">${u.name}</div><div style="font-size:0.7rem;">${u.farm} · ${u.plants}</div></div>
                <div style="width:8px; height:8px; border-radius:50%; background:${u.online ? 'var(--ok)' : 'var(--muted)'};"></div>
                <button class="visit-btn" data-id="${u.id}" style="background:transparent; border:1px solid var(--accent); border-radius:20px; padding:4px 10px;">Visit</button>
            </div>
        `).join('');
        document.querySelectorAll('.visit-btn').forEach(btn => {
            btn.addEventListener('click', () => showToast('info', 'Farm visit feature coming soon'));
        });
    },
    init() {
        // 预留初始化
    }
};