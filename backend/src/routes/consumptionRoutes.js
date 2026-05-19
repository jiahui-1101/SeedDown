/* ============================================================
   backend/src/routes/consumptionRoutes.js  — FIXED v2
   POST /api/consumption/analysis

   Fixed:
   - Added energyKwhPerDay to every crop benchmark (was missing)
   - Returns traditionalEnergyPerDay so frontend chart units match
   - Fixed waterPerDayL values to be realistic per-day figures
   ============================================================ */

const express = require('express');
const router  = express.Router();

/* ══════════════════════════════════════════════════════════════
   AGRICULTURAL RESEARCH BENCHMARKS
   Sources:
   • FAO AQUASTAT (2020) — water footprint per crop
   • Barbosa et al. (2015) — vertical vs conventional lettuce
   • USDA ERS — field energy & transport benchmarks
   • Malaysia DOA (2021) — local outdoor farm water data

   energyKwhPerDay = daily electricity for irrigation pumps +
                     transport to Klang Valley market (avg 80km)
   waterPerDayL    = litres/day for a 1m² comparable outdoor plot
   ══════════════════════════════════════════════════════════════ */
const CROP_BENCHMARKS = {
  lettuce: {
    name: 'Lettuce', emoji: '🥬',
    traditional: {
      waterPerDayL:    45,    // L/day per 1m² outdoor bed (FAO)
      energyKwhPerDay: 1.6,   // kWh/day: irrigation pump + transport
      energyKwhPerKg:  0.5,   // kWh per kg yield
      co2KgPerDay:     0.8,   // kg CO₂/day
      landM2PerKg:     1.8,   // m² needed per kg
      growDays:        60,
    },
    vertical: {
      waterPerDayL:    2.0,   // Barbosa 2015: 96% less water
      energyKwhPerDay: 0.27,  // kWh/day: 6hr LED×45W + fan + pump
      energyKwhPerKg:  3.5,
      landM2PerKg:     0.09,
      growDays:        30,
    },
    idealZone: { waterLevelMin: 65, waterLevelMax: 80 },
    fun_fact: 'Lettuce is 95% water by weight — vertical hydroponic delivery loses almost zero water to soil absorption or evaporation.',
  },
  spinach: {
    name: 'Spinach', emoji: '🥬',
    traditional: {
      waterPerDayL: 50, energyKwhPerDay: 1.8, energyKwhPerKg: 0.6,
      co2KgPerDay: 0.9, landM2PerKg: 2.0, growDays: 50,
    },
    vertical: {
      waterPerDayL: 2.2, energyKwhPerDay: 0.225, energyKwhPerKg: 3.2, landM2PerKg: 0.1, growDays: 25,
    },
    idealZone: { waterLevelMin: 60, waterLevelMax: 78 },
    fun_fact: 'Spinach requires 280L of water per kg outdoors — vertical farms cut this to ~15L through closed-loop hydroponics.',
  },
  basil: {
    name: 'Basil', emoji: '🌿',
    traditional: {
      waterPerDayL: 55, energyKwhPerDay: 1.9, energyKwhPerKg: 0.7,
      co2KgPerDay: 1.0, landM2PerKg: 2.5, growDays: 45,
    },
    vertical: {
      waterPerDayL: 2.5, energyKwhPerDay: 0.27, energyKwhPerKg: 4.0, landM2PerKg: 0.12, growDays: 22,
    },
    idealZone: { waterLevelMin: 60, waterLevelMax: 75 },
    fun_fact: 'Basil precision delivery in vertical farms increases essential oil content by up to 20% vs field-grown.',
  },
  tomato: {
    name: 'Tomato', emoji: '🍅',
    traditional: {
      waterPerDayL: 60, energyKwhPerDay: 2.5, energyKwhPerKg: 0.8,
      co2KgPerDay: 1.4, landM2PerKg: 3.0, growDays: 80,
    },
    vertical: {
      waterPerDayL: 3.5, energyKwhPerDay: 0.36, energyKwhPerKg: 5.0, landM2PerKg: 0.15, growDays: 55,
    },
    idealZone: { waterLevelMin: 70, waterLevelMax: 85 },
    fun_fact: 'Tomatoes grown vertically yield up to 3× more per m² and mature 25 days faster under optimised LED spectrums.',
  },
  carrot: {
    name: 'Carrot', emoji: '🥕',
    traditional: {
      waterPerDayL: 52, energyKwhPerDay: 1.9, energyKwhPerKg: 0.55,
      co2KgPerDay: 0.9, landM2PerKg: 2.0, growDays: 80,
    },
    vertical: {
      waterPerDayL: 2.4, energyKwhPerDay: 0.27, energyKwhPerKg: 3.3, landM2PerKg: 0.1, growDays: 50,
    },
    idealZone: { waterLevelMin: 62, waterLevelMax: 78 },
    fun_fact: 'Vertical farming allows year-round carrot production in Malaysia — eliminating the seasonal water stress that reduces outdoor yield by up to 40%.',
  },
  cucumber: {
    name: 'Cucumber', emoji: '🥒',
    traditional: {
      waterPerDayL: 70, energyKwhPerDay: 2.8, energyKwhPerKg: 0.9,
      co2KgPerDay: 1.6, landM2PerKg: 3.5, growDays: 65,
    },
    vertical: {
      waterPerDayL: 4.0, energyKwhPerDay: 0.315, energyKwhPerKg: 5.5, landM2PerKg: 0.18, growDays: 40,
    },
    idealZone: { waterLevelMin: 72, waterLevelMax: 88 },
    fun_fact: 'Cucumbers are 96% water — vertical hydroponic systems deliver water directly to roots, eliminating the 70% evaporation loss of outdoor irrigation.',
  },
  mint: {
    name: 'Mint', emoji: '🌿',
    traditional: {
      waterPerDayL: 48, energyKwhPerDay: 1.6, energyKwhPerKg: 0.5,
      co2KgPerDay: 0.7, landM2PerKg: 2.2, growDays: 40,
    },
    vertical: {
      waterPerDayL: 2.0, energyKwhPerDay: 0.225, energyKwhPerKg: 3.0, landM2PerKg: 0.11, growDays: 20,
    },
    idealZone: { waterLevelMin: 65, waterLevelMax: 80 },
    fun_fact: 'Mint has a high transpiration rate — vertical systems recirculate ~85% of water that outdoor plots lose to the soil.',
  },
  chili: {
    name: 'Chili', emoji: '🌶️',
    traditional: {
      waterPerDayL: 65, energyKwhPerDay: 2.4, energyKwhPerKg: 0.9,
      co2KgPerDay: 1.3, landM2PerKg: 3.5, growDays: 90,
    },
    vertical: {
      waterPerDayL: 3.0, energyKwhPerDay: 0.36, energyKwhPerKg: 4.5, landM2PerKg: 0.18, growDays: 60,
    },
    idealZone: { waterLevelMin: 65, waterLevelMax: 82 },
    fun_fact: 'Controlled LED spectrums in vertical farms increase capsaicin production — producing hotter, more consistent chili year-round.',
  },
  pepper: {
    name: 'Pepper', emoji: '🫑',
    traditional: {
      waterPerDayL: 62, energyKwhPerDay: 2.3, energyKwhPerKg: 0.85,
      co2KgPerDay: 1.2, landM2PerKg: 2.8, growDays: 85,
    },
    vertical: {
      waterPerDayL: 3.2, energyKwhPerDay: 0.36, energyKwhPerKg: 4.8, landM2PerKg: 0.16, growDays: 58,
    },
    idealZone: { waterLevelMin: 68, waterLevelMax: 83 },
    fun_fact: 'Bell peppers grown vertically have 27 days shorter cycles compared to outdoor Malaysian farms.',
  },
  strawberry: {
    name: 'Strawberry', emoji: '🍓',
    traditional: {
      waterPerDayL: 58, energyKwhPerDay: 2.2, energyKwhPerKg: 0.85,
      co2KgPerDay: 1.2, landM2PerKg: 2.6, growDays: 90,
    },
    vertical: {
      waterPerDayL: 3.0, energyKwhPerDay: 0.36, energyKwhPerKg: 5.2, landM2PerKg: 0.14, growDays: 60,
    },
    idealZone: { waterLevelMin: 65, waterLevelMax: 80 },
    fun_fact: 'Vertical strawberry farms produce fruit 30 days faster and use 95% less pesticide than outdoor Malaysian plots.',
  },
  cabbage: {
    name: 'Cabbage', emoji: '🥬',
    traditional: {
      waterPerDayL: 55, energyKwhPerDay: 2.0, energyKwhPerKg: 0.65,
      co2KgPerDay: 1.0, landM2PerKg: 2.2, growDays: 90,
    },
    vertical: {
      waterPerDayL: 2.8, energyKwhPerDay: 0.27, energyKwhPerKg: 3.8, landM2PerKg: 0.12, growDays: 60,
    },
    idealZone: { waterLevelMin: 65, waterLevelMax: 80 },
    fun_fact: 'Cabbage needs large amounts of water during head formation — vertical controlled delivery prevents the common tip-burn seen in outdoor Malaysian heat.',
  },
  eggplant: {
    name: 'Eggplant', emoji: '🍆',
    traditional: {
      waterPerDayL: 58, energyKwhPerDay: 2.3, energyKwhPerKg: 0.8,
      co2KgPerDay: 1.2, landM2PerKg: 2.8, growDays: 80,
    },
    vertical: {
      waterPerDayL: 3.0, energyKwhPerDay: 0.36, energyKwhPerKg: 4.5, landM2PerKg: 0.15, growDays: 55,
    },
    idealZone: { waterLevelMin: 68, waterLevelMax: 83 },
    fun_fact: 'Eggplant is highly sensitive to water stress — vertical precision delivery eliminates the 40% yield loss common in Malaysian dry seasons.',
  },
  default: {
    name: 'Mixed Crops', emoji: '🌱',
    traditional: {
      waterPerDayL: 55, energyKwhPerDay: 2.0, energyKwhPerKg: 0.6,
      co2KgPerDay: 1.0, landM2PerKg: 2.5, growDays: 65,
    },
    vertical: {
      waterPerDayL: 2.5, energyKwhPerDay: 0.27, energyKwhPerKg: 3.8, landM2PerKg: 0.12, growDays: 35,
    },
    idealZone: { waterLevelMin: 65, waterLevelMax: 80 },
    fun_fact: 'On average, vertical farming uses 95% less water and 99% less land than traditional agriculture, producing year-round regardless of Malaysian weather.',
  },
};

/* ── Groq AI call ── */
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
async function callGroq(systemPrompt, userPrompt, maxTokens = 350) {
  const res = await fetch(GROQ_URL, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
    },
    body: JSON.stringify({
      model:       'llama-3.1-8b-instant',
      max_tokens:  maxTokens,
      temperature: 0.65,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
    }),
  });
  const data = await res.json();
  if (!data.choices?.[0]?.message?.content) {
    console.warn('[consumptionRoutes] Groq empty response:', JSON.stringify(data).slice(0, 200));
    return null;
  }
  return data.choices[0].message.content.trim();
}

/* ══════════════════════════════════════════════
   POST /api/consumption/analysis
══════════════════════════════════════════════ */
router.post('/analysis', async (req, res) => {
  try {
    const { plants = [], metrics = {} } = req.body;

    /* ── 1. Match plants to benchmark data ── */
    const plantKeys = (plants.length > 0 ? plants : ['lettuce'])
      .slice(0, 4)
      .map(p => p.toLowerCase().trim());

    const plantData = plantKeys.map(key => {
      const b = CROP_BENCHMARKS[key] || CROP_BENCHMARKS.default;
      const waterSavePct = Math.round(
        ((b.traditional.waterPerDayL - b.vertical.waterPerDayL) / b.traditional.waterPerDayL) * 100
      );
      const energySavePct = Math.round(
        ((b.traditional.energyKwhPerDay - b.vertical.energyKwhPerDay) / b.traditional.energyKwhPerDay) * 100
      );
      const growDaysFaster = b.traditional.growDays - b.vertical.growDays;
      const landReductionPct = Math.round(
        (1 - b.vertical.landM2PerKg / b.traditional.landM2PerKg) * 100
      );

      return {
        key,
        name:           b.name,
        emoji:          b.emoji,
        fun_fact:       b.fun_fact,
        traditional:    b.traditional,
        vertical:       b.vertical,
        idealZone:      b.idealZone,
        waterSavePct,
        energySavePct,
        waterSavedLPerDay:    +(b.traditional.waterPerDayL - b.vertical.waterPerDayL).toFixed(1),
        energySavedKwhPerDay: +(b.traditional.energyKwhPerDay - b.vertical.energyKwhPerDay).toFixed(3),
        growDaysFaster:       Math.max(0, growDaysFaster),
        landReductionPct:     Math.min(99, Math.max(0, landReductionPct)),
      };
    });

    /* ── 2. Ideal water zone (average across all plants) ── */
    const avgIdealMin = Math.round(
      plantData.reduce((s, p) => s + p.idealZone.waterLevelMin, 0) / plantData.length
    );
    const avgIdealMax = Math.round(
      plantData.reduce((s, p) => s + p.idealZone.waterLevelMax, 0) / plantData.length
    );

    /* ── 3. Cost savings calculation ── */
    const primary          = plantData[0];
    const tradWater        = primary.traditional.waterPerDayL;
    const tradEnergyPerDay = primary.traditional.energyKwhPerDay;
    const RM_PER_KWH       = 0.218;
    const RM_PER_LITRE     = 0.002;

    const waterUsed     = metrics.waterLiters || 0.5;
    const energyUsed    = metrics.energyKwh   || 0.1;
    const vertCostToday = (waterUsed * RM_PER_LITRE) + (energyUsed * RM_PER_KWH);
    const tradCostToday = (tradWater * RM_PER_LITRE) + (tradEnergyPerDay * RM_PER_KWH);
    const dailySavingsRm   = Math.max(0, tradCostToday - vertCostToday);
    const monthlySavingsRm = +(dailySavingsRm * 30).toFixed(2);
    const yearlySavingsRm  = +(dailySavingsRm * 365).toFixed(2);

    const waterSavedToday  = Math.max(0, tradWater - waterUsed);
    const waterSavePct     = Math.round((waterSavedToday / tradWater) * 100);

    const ruleBasedSummary = {
      waterStatus: waterUsed < tradWater * 0.3 ? 'excellent'
                 : waterUsed < tradWater * 0.5 ? 'good'
                 : waterUsed < tradWater * 0.8 ? 'average'
                 : 'above_target',
      waterSavedL:        +waterSavedToday.toFixed(1),
      waterSavePct,
      monthlySavingsL:    Math.round(waterSavedToday * 30),
      yearlyWaterSavedL:  Math.round(waterSavedToday * 365),
      dailySavingsRm:     +dailySavingsRm.toFixed(2),
      monthlySavingsRm,
      yearlySavingsRm,
      todayTradCost:      +tradCostToday.toFixed(2),
      todayVertCost:      +vertCostToday.toFixed(2),
    };

    /* ── 4. Groq AI narrative (real API call) ── */
    const cropSummary = plantData.map(p =>
      `${p.name}: traditional ${p.traditional.waterPerDayL}L/day water & ${p.traditional.energyKwhPerDay}kWh/day energy → ` +
      `vertical ${p.vertical.waterPerDayL}L/day & ${p.vertical.energyKwhPerDay}kWh/day ` +
      `(${p.waterSavePct}% water saved, ${p.energySavePct}% energy saved, grows ${p.growDaysFaster} days faster)`
    ).join('; ');

    const systemPrompt = `You are an agricultural sustainability analyst for SeedDown vertical farm in Malaysia.
You compare vertical farming data to FAO/USDA traditional outdoor farming benchmarks.
Be data-driven, cite exact numbers, use Malaysian context. Max 90 words. Plain prose, no bullet points.`;

    const userPrompt =
`Crops: ${plantKeys.join(', ')}

FAO benchmark vs vertical system:
${cropSummary}

Today's sensor data:
- Water used: ${waterUsed.toFixed(1)}L (traditional: ${tradWater}L → saved ${ruleBasedSummary.waterSavedL}L = ${waterSavePct}%)
- Energy used: ${energyUsed.toFixed(3)}kWh (traditional: ${tradEnergyPerDay}kWh)
- Cost today: RM${vertCostToday.toFixed(2)} vs traditional RM${tradCostToday.toFixed(2)} → saved RM${dailySavingsRm.toFixed(2)}
- Monthly projection: RM${monthlySavingsRm} saved, ${ruleBasedSummary.monthlySavingsL}L water conserved

Write 2-3 sentences:
1. Name crops with exact savings % from the data above
2. Put the monthly water saving in a relatable Malaysian context (household usage, swimming pool, etc.)
3. One forward-looking insight about scaling or environmental impact

Plain prose only, no bullets, no markdown.`;

    let aiNarrative = null;
    try {
      aiNarrative = await callGroq(systemPrompt, userPrompt);
    } catch (e) {
      console.warn('[consumptionRoutes] Groq failed:', e.message);
    }

    /* ── 5. Fallback if Groq unavailable ── */
    if (!aiNarrative) {
      aiNarrative = `Your vertical ${primary.name.toLowerCase()} farm used only ${waterUsed.toFixed(1)}L today compared to ${tradWater}L required outdoors — a ${waterSavePct}% saving backed by FAO AQUASTAT data. That ${ruleBasedSummary.monthlySavingsL}L monthly saving equals roughly ${Math.round(ruleBasedSummary.monthlySavingsL / 200)} days of an average Malaysian household's water supply. At RM${monthlySavingsRm}/month in combined utility savings, your farm becomes more cost-competitive with every additional rack you add.`;
    }

    res.json({
      plantData,
      aiNarrative,
      ruleBasedSummary,
      idealWaterZone:          { min: avgIdealMin, max: avgIdealMax, mid: Math.round((avgIdealMin + avgIdealMax) / 2) },
      traditionalEnergyPerDay: tradEnergyPerDay,  // ← used by frontend energy chart reference line
    });

  } catch (err) {
    console.error('[consumptionRoutes] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;