/* ============================================================
   MODULE: COMMUNITY
   PLACEHOLDER: Community (买卖/exchange && 交流 && gamified 参观) (SUTING)
   ============================================================ */
const COMMUNITY_USERS = [
  {id:1, avatar:'👩‍🌾', name:'Aisha.Farm', farmName:'Rooftop Garden', plants:'🥬🌿🍅', online:true,  location:[0,0], crops:5, rating:'★4.8'},
  {id:2, avatar:'👨‍🌾', name:'TanFarm88',  farmName:'Balcony Greens',  plants:'🌱🌶️🥦', online:true,  location:[1,0], crops:3, rating:'★4.5'},
  {id:3, avatar:'🧑‍🌾', name:'GreenKL',    farmName:'Urban Sprouts',   plants:'🥬🧅🫑', online:false, location:[2,0], crops:8, rating:'★4.9'},
  {id:4, avatar:'👩‍🌾', name:'FarmMama',   farmName:'Kitchen Farm',    plants:'🌿🌱🍅', online:true,  location:[0,1], crops:4, rating:'★4.2'},
  {id:5, avatar:'🧑',   name:'UrbanEco',   farmName:'Tower Greens',    plants:'🥬🥦🌿', online:false, location:[1,1], crops:6, rating:'★4.6'},
];

const Community = {
  init(){ this._renderMap(); this._renderUsers(); },
  _renderMap(){
    const grid = document.getElementById('communityMapGrid');
    if(!grid) return;
    const plots = [
      {owner:'YOU', emoji:'🏠', type:'mine'}, {owner:'Aisha', emoji:'🌿', type:'friend'}, {owner:'Tan88', emoji:'🥬', type:'friend'}, {owner:'GreenKL', emoji:'🌱', type:'friend'},
      {owner:'', emoji:'', type:'empty'}, {owner:'Mama', emoji:'🍅', type:'friend'}, {owner:'UrbanEco', emoji:'🥦', type:'friend'}, {owner:'', emoji:'', type:'empty'},
      {owner:'', emoji:'', type:'empty'}, {owner:'', emoji:'', type:'empty'}, {owner:'', emoji:'', type:'empty'}, {owner:'New?', emoji:'➕', type:'empty'},
      {owner:'', emoji:'', type:'empty'}, {owner:'', emoji:'', type:'empty'}, {owner:'', emoji:'', type:'empty'},
    ];
    grid.innerHTML = plots.map((p,i)=>{
      const online = COMMUNITY_USERS.find(u=>u.name.startsWith(p.owner))?.online;
      return `<div class="community-plot ${p.type}" onclick="Community._plotClick(${i})">${p.emoji}
                ${p.owner ? `<div class="plot-owner">${p.owner}</div>` : ''}
                ${p.owner && p.type !== 'mine' ? `<div class="plot-badge ${online?'plot-online':'plot-offline'}"></div>` : ''}
              </div>`;
    }).join('');
  },
  _plotClick(i){ if(COMMUNITY_USERS[i]) this.visitFarm(COMMUNITY_USERS[i].id); },
  _renderUsers(){
    const container = document.getElementById('communityUsers');
    if(!container) return;
    container.innerHTML = COMMUNITY_USERS.map(u=>`
      <div class="community-user-card" onclick="Community.visitFarm(${u.id})">
        <div class="user-avatar-frame">${u.avatar}</div>
        <div class="user-info">
          <div class="user-name">${u.name}</div>
          <div class="user-farm">${u.farmName} · ${u.plants}</div>
          <div class="user-stats"><span class="user-stat">${u.crops} crops</span><span class="user-stat">${u.rating}</span></div>
        </div>
        <div class="user-online-dot ${u.online?'online':'offline'}"></div>
        <div class="user-actions">
          <button class="user-act-btn btn-visit" onclick="event.stopPropagation();Community.visitFarm(${u.id})">👁 VISIT</button>
          <button class="user-act-btn btn-chat"  onclick="event.stopPropagation();Community.startChat(${u.id})">💬 CHAT</button>
          <button class="user-act-btn btn-trade" onclick="event.stopPropagation();Community.openTradeWith(${u.id})">💱 TRADE</button>
        </div>
      </div>
    `).join('');
  },
  visitFarm(id){
    const user = COMMUNITY_USERS.find(u=>u.id===id);
    if(!user) return;
    STATE.visitTarget = user;
    document.getElementById('visitFarmName').textContent = user.farmName;
    document.getElementById('visitOwner').textContent = 'Owner: ' + user.name;
    document.getElementById('visitScene').innerHTML = `
      <div style="font-size:64px">${user.plants}</div>
      <div style="font-size:48px">${user.avatar}</div>
      <div style="font-family:'VT323',monospace;font-size:24px;color:var(--grass-md);text-align:center;">[${user.farmName} — 3D View Placeholder]</div>
      <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:var(--wood-lt);text-align:center;padding:0 30px;line-height:1.4">Full isometric farm rendering coming in next update</div>
    `;
    document.getElementById('visitOverlay').classList.add('open');
  },
  openTrade(){ this.openTradeWith(STATE.visitTarget?.id); },
  openTradeWith(id){
    const user = COMMUNITY_USERS.find(u=>u.id===id) || STATE.visitTarget;
    if(!user) return;
    const myItems = [{emoji:'🥬', name:'Lettuce', price:'RM 2.80'}, {emoji:'🌿', name:'Basil', price:'RM 8.50'}, {emoji:'🌶️', name:'Chili', price:'RM 5.20'}];
    const theirItems = [{emoji:'🥦', name:'Broccoli', price:'RM 6.00'}, {emoji:'🧅', name:'Onion', price:'RM 1.80'}, {emoji:'🫑', name:'Pepper', price:'RM 4.50'}];
    document.getElementById('tradeMyItems').innerHTML = myItems.map(item=>`<div class="trade-item" onclick="this.classList.toggle('selected')"><span class="trade-item-emoji">${item.emoji}</span><div class="trade-item-name">${item.name}</div><div class="trade-item-price">${item.price}</div></div>`).join('');
    document.getElementById('tradeBuyItems').innerHTML = theirItems.map(item=>`<div class="trade-item" onclick="this.classList.toggle('selected')"><span class="trade-item-emoji">${item.emoji}</span><div class="trade-item-name">${item.name}</div><div class="trade-item-price">${item.price}</div></div>`).join('');
    document.getElementById('tradeModal').classList.add('open');
  },
  confirmTrade(){ document.getElementById('tradeModal').classList.remove('open'); UI.showToast('success','💱 Trade offer sent!'); },
  startChat(id){
    const user = COMMUNITY_USERS.find(u=>u.id===id);
    if(!user) return;
    STATE.visitTarget = user;
    this.openChat();
  },
  openChat(){
    const user = STATE.visitTarget;
    if(!user) return;
    document.getElementById('chatPartnerAvatar').textContent = user.avatar;
    document.getElementById('chatPartnerName').textContent = user.name;
    STATE.chatMessages = [
      {mine:false, text:`Hey! Nice farm you have there 🌿`, name:user.name},
      {mine:true,  text:`Thanks! Love your Broccoli setup!`, name:'You'},
      {mine:false, text:`Want to do a trade? I need some Basil 😊`, name:user.name},
    ];
    this._renderChat();
    document.getElementById('chatOverlay').classList.add('open');
  },
  _renderChat(){
    const el = document.getElementById('chatMessages');
    el.innerHTML = STATE.chatMessages.map(m=>`<div class="chat-bubble ${m.mine?'mine':'theirs'}"><div class="chat-bubble-name">${m.name}</div>${m.text}</div>`).join('');
    el.scrollTop = el.scrollHeight;
  },
  sendChat(){
    const inp = document.getElementById('chatInput');
    if(!inp.value.trim()) return;
    const el = document.getElementById('chatMessages');
    STATE.chatMessages.push({mine:true, text:inp.value, name:'You'});
    this._renderChat();
    inp.value = '';
    setTimeout(()=>{
      const replies = [`Sounds great! When can you harvest?`, `I'll check my stock and get back to you!`, `Deal! Send me a trade offer 👍`];
      STATE.chatMessages.push({mine:false, text: replies[Math.floor(Math.random()*replies.length)], name: STATE.visitTarget.name});
      this._renderChat();
    }, 1000);
  }
};