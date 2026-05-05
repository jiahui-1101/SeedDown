/* ============================================================
   MODULE: UI (Screen management)
   ============================================================ */
const UI = {
  showScreen(id){
    STATE.prevScreen = STATE.currentScreen;
    STATE.currentScreen = id;
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
    
    if(id === 's-home') setTimeout(() => FarmCanvas.resize(), 50);

    // AI Chatbox Visibility Logic
    const aiChat = document.getElementById('globalAiChat');
    if(aiChat) {
      if(id === 's-splash' || id === 's-login') {
        aiChat.style.display = 'none';
      } else {
        aiChat.style.display = 'flex';
      }
    }
  },
  showFeature(type){
    STATE.prevScreen = STATE.currentScreen;
    STATE.currentScreen = 's-feature';
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    
    const featScreen = document.getElementById('s-feature');
    featScreen.classList.add('active');

    const isC = STATE.mode === 'commercial';
    featScreen.className = 'screen active ' + (isC ? 'commercial-feat' : 'beginner-feat');
    document.getElementById('feat-header').className = 'feat-header ' + (isC ? 'com-h' : '');
    document.getElementById('featTitle').className = 'feat-screen-title ' + (isC ? 'c-title' : 'b-title');
    
    // Fix for alert normalisation
    let baseType = type.replace('-c', '');
    if(baseType === 'alert') baseType = 'alerts';
    
    Features.render(baseType);
  },
  goBack(){ this.showScreen(STATE.prevScreen); },
  openAddPlant(){ Farm._renderTilePicker(); document.getElementById('addPlantModal').classList.add('open'); },
  closeAddPlant(e){ if(e && e.target!==document.getElementById('addPlantModal')) return; document.getElementById('addPlantModal').classList.remove('open'); },
  closeVisit(){ document.getElementById('visitOverlay').classList.remove('open'); },
  closeTrade(){ document.getElementById('tradeModal').classList.remove('open'); },
  closeChat(){ document.getElementById('chatOverlay').classList.remove('open'); },
  showToast(type, text){
    const container = document.getElementById('toastContainer');
    const icons = {success:'✅', warning:'⚠️', error:'❌', info:'ℹ️'};
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ️'}</span><span class="toast-text">${text}</span>`;
    container.appendChild(toast);
    setTimeout(()=>toast.remove(), 3100);
  },
};