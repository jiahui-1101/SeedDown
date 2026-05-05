/* ============================================================
   MODULE: FEATURE - ALERTS
   PLACEHOLDER: Predictive alert (CHRIST)
   ============================================================ */

Features.alerts = function() {
  return `
    <div class="alert-card critical">
      <div class="alert-top"><div class="alert-level level-critical">CRITICAL</div><div class="alert-title">🌡️ Temp Spike — Tomato D1</div></div>
      <div class="alert-npc">
        <div class="alert-npc-face">🧙‍♀️</div>
        <div class="alert-npc-text"><strong style="color:var(--sun);font-size:16px;">ELDER WITCH:</strong><br><span class="bad">Tomato D1 is at 34.2°C!</span> Estimated crop loss: <span class="hl">RM 120</span> in 2 hours if ignored.<br>Activating the cooling fan costs only <span class="hl">RM 1.80</span>.</div>
      </div>
      <div class="alert-actions">
        <button class="alert-act-btn fix" onclick="Features._fixAlert('temp')">🌀 Activate Fan</button>
        <button class="alert-act-btn dismiss" onclick="Features._dismiss(this)">✓ Dismiss</button>
      </div>
    </div>
    <div class="alert-card warning">
      <div class="alert-top"><div class="alert-level level-warning">WARNING</div><div class="alert-title">💧 Low Moisture — Spinach B2</div></div>
      <div class="alert-npc">
        <div class="alert-npc-face">👩‍🔬</div>
        <div class="alert-npc-text"><strong style="color:var(--sun);font-size:16px;">DR. LEAF:</strong><br>Soil moisture at <span class="bad">22%</span> — critical threshold is 30%. Watering now will prevent stunted growth.</div>
      </div>
      <div class="alert-actions">
        <button class="alert-act-btn fix" onclick="Features._fixAlert('water')">💧 Water Now</button>
        <button class="alert-act-btn dismiss" onclick="Features._dismiss(this)">✓ Dismiss</button>
      </div>
    </div>
    <div class="alert-card info">
      <div class="alert-top"><div class="alert-level level-info">READY</div><div class="alert-title">✨ Harvest Ready — Basil C3</div></div>
      <div class="alert-npc">
        <div class="alert-npc-face">🧓</div>
        <div class="alert-npc-text"><strong style="color:var(--sun);font-size:16px;">OLD TRADER:</strong><br>Basil C3 is at peak quality! Harvest today for <span class="hl">RM 28.50</span>. Waiting 2 more days may reduce value by 15%.</div>
      </div>
      <div class="alert-actions">
        <button class="alert-act-btn fix" onclick="Features._fixAlert('harvest')">✨ Harvest Now</button>
        <button class="alert-act-btn dismiss" onclick="Features._dismiss(this)">Later</button>
      </div>
    </div>
    <div style="height:100px;"></div>
  `;
};

Features._fixAlert = function(type) {
  const actions = {
    temp:    ()=>{ STATE.sensors.temp = {val:28.1, unit:'°C', status:'ok'}; Dashboard.update('temp',28.1,'ok'); NPC.triggerPlantAction('Tomato D1','cool'); },
    water:   ()=>{ STATE.sensors.water= {val:65,   unit:'%',  status:'ok'}; Dashboard.update('water',65,'ok'); NPC.triggerPlantAction('Spinach B2','water'); },
    harvest: ()=>{ NPC.triggerPlantAction('Basil C3','harvest'); },
  };
  actions[type]?.();
  UI.showToast('success', type==='temp'?'🌀 Fan activated!':type==='water'?'💧 Watering started!':'✨ Harvest confirmed!');
  UI.showScreen('s-home');
};

Features._dismiss = function(btn) { 
  btn.closest('.alert-card').style.opacity='0.3'; 
  btn.closest('.alert-card').style.pointerEvents='none'; 
};