/* ============================================================
   MODULE: FEATURE - WHAT IF
   PLACEHOLDER: What-if
   - ZIQI: production & number/ menu
   - JIAHUI:  (cost saving)
   - CHRIST: new plant / resource / suggestion
   ============================================================ */

Features.whatif = function() {
  return `
    <div class="panel">
      <div class="panel-title">📅 HARVEST TIMELINE</div>
      <div class="whatif-intro">AI predicts harvest in <span>7 days</span>. Simulate below.</div>
    </div>
    <div class="panel">
      <div class="panel-title">🔬 SIMULATE CONDITIONS</div>
      <div class="sim-card">
        <div class="sim-row"><span class="sim-icon">🌡️</span><span class="sim-lbl">TEMP</span><input class="sim-slider" type="range" min="18" max="40" value="26" id="sim-temp" oninput="Features._updateSim()"><span class="sim-val" id="sim-temp-val">26°C</span></div>
        <div class="sim-row"><span class="sim-icon">💧</span><span class="sim-lbl">WATER</span><input class="sim-slider" type="range" min="1" max="5" value="3" id="sim-water" oninput="Features._updateSim()"><span class="sim-val" id="sim-water-val">3x/day</span></div>
        <div class="sim-row"><span class="sim-icon">☀️</span><span class="sim-lbl">LIGHT</span><input class="sim-slider" type="range" min="8" max="18" value="14" id="sim-light" oninput="Features._updateSim()"><span class="sim-val" id="sim-light-val">14h</span></div>
        <div class="sim-result" id="simResult">Predicted yield: <span>340g</span> in <span>7 days</span><br>Profit: <span>RM 28.50</span></div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-title">💧 RESOURCE FORECAST</div>
      <div class="res-bars">
        <div class="res-bar-row"><span class="res-bar-icon">💧</span><span class="res-bar-lbl">Water</span><div class="res-bar-track"><div class="res-bar-fill water" style="width:65%"></div></div><span class="res-bar-val">12.4L</span></div>
        <div class="res-bar-row"><span class="res-bar-icon">⚡</span><span class="res-bar-lbl">Energy</span><div class="res-bar-track"><div class="res-bar-fill energy" style="width:48%"></div></div><span class="res-bar-val">8.2kWh</span></div>
        <div class="res-bar-row"><span class="res-bar-icon">🧬</span><span class="res-bar-lbl">Nutrient</span><div class="res-bar-track"><div class="res-bar-fill" style="width:78%"></div></div><span class="res-bar-val">78%</span></div>
      </div>
    </div>
    <div style="height:100px;"></div>
  `;
};

Features._updateSim = function() {
  const t = document.getElementById('sim-temp')?.value, w = document.getElementById('sim-water')?.value, l = document.getElementById('sim-light')?.value;
  if(t) document.getElementById('sim-temp-val').textContent = t+'°C';
  if(w) document.getElementById('sim-water-val').textContent = w+'x/day';
  if(l) document.getElementById('sim-light-val').textContent = l+'h';
  const score = (1 - Math.abs(t-24)/20) * (1 - Math.abs(w-3)/4) * (1 - Math.abs(l-14)/10);
  const y = Math.round(200 + score * 300), d = Math.round(5 + (1-score)*10), p = (y*0.085).toFixed(2);
  document.getElementById('simResult').innerHTML = `Predicted yield: <span>${y}g</span> in <span>${d} days</span><br>Profit: <span>RM ${p}</span>`;
};