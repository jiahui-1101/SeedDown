/* ============================================================
   MODULE: FEATURE - CONSUMPTION
   PLACEHOLDER: Consumption 省了多少 vs traditional - resource (historical) (MEISHUET)
   ============================================================ */

Features.consumption = function() {
  return `
    <div class="eco-hero"><div class="eco-score">A+</div><div class="eco-score-lbl">Your farm's eco rating</div><div style="font-family:'Press Start 2P',monospace;font-size:8px;color:var(--grass-lt);margin-top:10px;line-height:1.4">Saving more than 78% of nearby farms!</div></div>
    <div class="eco-grid">
      <div class="eco-card water"><span class="eco-card-icon">💧</span><div class="eco-card-val">12.4L</div><div class="eco-card-lbl">Water today</div><div class="eco-card-trend trend-dn">▼ -65% vs trad.</div></div>
      <div class="eco-card energy"><span class="eco-card-icon">⚡</span><div class="eco-card-val">8.2 kWh</div><div class="eco-card-lbl">Energy cons.</div><div class="eco-card-trend trend-dn">▼ -42% vs week</div></div>
      <div class="eco-card co2"><span class="eco-card-icon">🌱</span><div class="eco-card-val">2.1 kg</div><div class="eco-card-lbl">CO₂ saved</div><div class="eco-card-trend trend-dn">▼ Carbon offset</div></div>
      <div class="eco-card cost"><span class="eco-card-icon">💰</span><div class="eco-card-val">RM 3.40</div><div class="eco-card-lbl">Running cost</div><div class="eco-card-trend trend-dn">▼ -30% opt.</div></div>
    </div>
    <div class="panel">
      <div class="panel-title">🤖 AI OPTIMIZATION TIPS</div>
      <div style="font-family:'VT323',monospace;font-size:22px;color:var(--wood-pl);line-height:1.6">
        • Reduce light cycle by 2h at night → save <span style="color:var(--sun)">RM 0.80/day</span><br>
        • Batch watering at dawn → save <span style="color:var(--sun)">1.2L water/day</span><br>
        • Fan pre-cooling prevents emergency spikes → save <span style="color:var(--sun)">35% energy</span>
      </div>
    </div>
    <div style="height:100px;"></div>
  `;
};