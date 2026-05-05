/* ============================================================
   MODULE: FEATURES CORE (Router)
   ============================================================ */
const Features = {
  render(type){
    const body = document.getElementById('featBody');
    const title = document.getElementById('featTitle');
    switch(type){
      case 'whatif':      title.textContent='🔮 WHAT-IF';      body.innerHTML = this.whatif(); break;
      case 'consumption': title.textContent='⚡ ECO SAVINGS';  body.innerHTML = this.consumption(); break;
      case 'alerts':      title.textContent='🚨 AI ALERTS';    body.innerHTML = this.alerts(); break;
      default: body.innerHTML = '<div style="color:var(--wood-lt);font-family:VT323,monospace;font-size:24px;">Feature loading...</div>';
    }
  }
};