/* ============================================================
   BOOT & INITIALIZATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  // Generate Stars
  const starsEl = document.getElementById('stars');
  if(starsEl) {
    for(let i=0; i<20; i++){
      const s = document.createElement('div');
      s.className = 'star';
      s.style.cssText = 'left:' + (Math.random()*100) + '%;top:' + (Math.random()*60) + '%;animation-delay:' + (Math.random()*2) + 's';
      starsEl.appendChild(s);
    }
  }

  // Init Modules
  FarmCanvas.init();
  Dashboard.init();
  NPC.init();
  Farm.init();
  Community.init();

  /*
    ============================================================
    PLACEHOLDER: Solution - IoT (JIAHUI)
    Sensor: Temperature+Humidity(DHT22/DHT11), Smoke+Gas(MQ-2),
            Soil Moisture, PH+Nutrient/EC(potentiometer),
            Water Level(HC-SR04), Ambient Light(LDR).
    Output: LED, Watering, Buzzer for Muzic
    ============================================================
  */
  // Simulate Live Sensor Updates
  setInterval(()=>{
    if(STATE.currentScreen === 's-home' || STATE.currentScreen === 's-dash-c') {
      const temp = STATE.sensors.temp;
      const newTemp = Math.max(22, Math.min(38, temp.val + (Math.random()-0.5)*0.3));
      const status = newTemp > 32 ? 'danger' : newTemp > 28 ? 'warning' : 'ok';
      STATE.sensors.temp = {val: parseFloat(newTemp.toFixed(1)), unit:'°C', status};
      Dashboard.render();
    }
  }, 5000);
});