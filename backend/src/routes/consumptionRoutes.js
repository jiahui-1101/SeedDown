/* ============================================================
   backend/src/routes/consumptionRoutes.js  — FINAL FIXED v3
   POST /api/consumption/analysis

   Fixed:
   - Correct Groq API key env variable
   - Fixed 0-value fallback bug using ??
   - Added traditionalEnergyPerDay response
   - Consistent daily-unit comparisons
   ============================================================ */

const express = require('express');
const router = express.Router();

/* ══════════════════════════════════════════════════════════════
   AGRICULTURAL RESEARCH BENCHMARKS
   ══════════════════════════════════════════════════════════════ */

const CROP_BENCHMARKS = {
  lettuce: {
    name: 'Lettuce',
    emoji: '🥬',
    traditional: {
      waterPerDayL: 45,
      energyKwhPerDay: 1.6,
      energyKwhPerKg: 0.5,
      co2KgPerDay: 0.8,
      landM2PerKg: 1.8,
      growDays: 60,
    },
    vertical: {
      waterPerDayL: 2.0,
      energyKwhPerDay: 0.27,
      energyKwhPerKg: 3.5,
      landM2PerKg: 0.09,
      growDays: 30,
    },
    idealZone: { waterLevelMin: 65, waterLevelMax: 80 },
    fun_fact:
      'Lettuce is 95% water by weight — vertical hydroponic delivery loses almost zero water to evaporation.',
  },

  spinach: {
    name: 'Spinach',
    emoji: '🥬',
    traditional: {
      waterPerDayL: 50,
      energyKwhPerDay: 1.8,
      energyKwhPerKg: 0.6,
      co2KgPerDay: 0.9,
      landM2PerKg: 2.0,
      growDays: 50,
    },
    vertical: {
      waterPerDayL: 2.2,
      energyKwhPerDay: 0.225,
      energyKwhPerKg: 3.2,
      landM2PerKg: 0.1,
      growDays: 25,
    },
    idealZone: { waterLevelMin: 60, waterLevelMax: 78 },
    fun_fact:
      'Spinach outdoors can require over 280L water/kg — hydroponics dramatically reduces this.',
  },

  tomato: {
    name: 'Tomato',
    emoji: '🍅',
    traditional: {
      waterPerDayL: 60,
      energyKwhPerDay: 2.5,
      energyKwhPerKg: 0.8,
      co2KgPerDay: 1.4,
      landM2PerKg: 3.0,
      growDays: 80,
    },
    vertical: {
      waterPerDayL: 3.5,
      energyKwhPerDay: 0.36,
      energyKwhPerKg: 5.0,
      landM2PerKg: 0.15,
      growDays: 55,
    },
    idealZone: { waterLevelMin: 70, waterLevelMax: 85 },
    fun_fact:
      'Vertical tomatoes can mature faster under optimized LED spectrums.',
  },

  default: {
    name: 'Mixed Crops',
    emoji: '🌱',
    traditional: {
      waterPerDayL: 55,
      energyKwhPerDay: 2.0,
      energyKwhPerKg: 0.6,
      co2KgPerDay: 1.0,
      landM2PerKg: 2.5,
      growDays: 65,
    },
    vertical: {
      waterPerDayL: 2.5,
      energyKwhPerDay: 0.27,
      energyKwhPerKg: 3.8,
      landM2PerKg: 0.12,
      growDays: 35,
    },
    idealZone: { waterLevelMin: 65, waterLevelMax: 80 },
    fun_fact:
      'Vertical farming can reduce water usage by up to 95% compared to traditional farming.',
  },
};

/* ══════════════════════════════════════════════════════════════
   GROQ AI
   ══════════════════════════════════════════════════════════════ */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroq(systemPrompt, userPrompt, maxTokens = 350) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',

      // ✅ FIXED
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },

    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: maxTokens,
      temperature: 0.65,

      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  const data = await res.json();

  if (!data?.choices?.[0]?.message?.content) {
    console.warn(
      '[consumptionRoutes] Groq empty response:',
      JSON.stringify(data).slice(0, 200)
    );

    return null;
  }

  return data.choices[0].message.content.trim();
}

/* ══════════════════════════════════════════════════════════════
   POST /api/consumption/analysis
   ══════════════════════════════════════════════════════════════ */

router.post('/analysis', async (req, res) => {
  try {
    const { plants = [], metrics = {} } = req.body;

    /* ─────────────────────────────────────────────
       Match crops
       ───────────────────────────────────────────── */

    const plantKeys = (plants.length > 0 ? plants : ['lettuce'])
      .slice(0, 4)
      .map((p) => p.toLowerCase().trim());

    const plantData = plantKeys.map((key) => {
      const b = CROP_BENCHMARKS[key] || CROP_BENCHMARKS.default;

      const waterSavePct = Math.round(
        ((b.traditional.waterPerDayL - b.vertical.waterPerDayL) /
          b.traditional.waterPerDayL) *
          100
      );

      const energySavePct = Math.round(
        ((b.traditional.energyKwhPerDay -
          b.vertical.energyKwhPerDay) /
          b.traditional.energyKwhPerDay) *
          100
      );

      const growDaysFaster =
        b.traditional.growDays - b.vertical.growDays;

      const landReductionPct = Math.round(
        (1 -
          b.vertical.landM2PerKg /
            b.traditional.landM2PerKg) *
          100
      );

      return {
        key,

        name: b.name,
        emoji: b.emoji,
        fun_fact: b.fun_fact,

        traditional: b.traditional,
        vertical: b.vertical,

        idealZone: b.idealZone,

        waterSavePct,
        energySavePct,

        waterSavedLPerDay: +(
          b.traditional.waterPerDayL -
          b.vertical.waterPerDayL
        ).toFixed(1),

        energySavedKwhPerDay: +(
          b.traditional.energyKwhPerDay -
          b.vertical.energyKwhPerDay
        ).toFixed(3),

        growDaysFaster: Math.max(0, growDaysFaster),

        landReductionPct: Math.min(
          99,
          Math.max(0, landReductionPct)
        ),
      };
    });

    /* ─────────────────────────────────────────────
       Ideal zone
       ───────────────────────────────────────────── */

    const avgIdealMin = Math.round(
      plantData.reduce(
        (s, p) => s + p.idealZone.waterLevelMin,
        0
      ) / plantData.length
    );

    const avgIdealMax = Math.round(
      plantData.reduce(
        (s, p) => s + p.idealZone.waterLevelMax,
        0
      ) / plantData.length
    );

    /* ─────────────────────────────────────────────
       Metrics
       ───────────────────────────────────────────── */

    const primary = plantData[0];

    const tradWater =
      primary.traditional.waterPerDayL;

    const tradEnergyPerDay =
      primary.traditional.energyKwhPerDay;

    const RM_PER_KWH = 0.218;
    const RM_PER_LITRE = 0.002;

    // ✅ FIXED (supports real 0)
    const waterUsed = metrics.waterLiters ?? 0.5;
    const energyUsed = metrics.energyKwh ?? 0.1;

    const vertCostToday =
      waterUsed * RM_PER_LITRE +
      energyUsed * RM_PER_KWH;

    const tradCostToday =
      tradWater * RM_PER_LITRE +
      tradEnergyPerDay * RM_PER_KWH;

    const dailySavingsRm = Math.max(
      0,
      tradCostToday - vertCostToday
    );

    const monthlySavingsRm = +(
      dailySavingsRm * 30
    ).toFixed(2);

    const yearlySavingsRm = +(
      dailySavingsRm * 365
    ).toFixed(2);

    const waterSavedToday = Math.max(
      0,
      tradWater - waterUsed
    );

    const waterSavePct = Math.round(
      (waterSavedToday / tradWater) * 100
    );

    const ruleBasedSummary = {
      waterStatus:
        waterUsed < tradWater * 0.3
          ? 'excellent'
          : waterUsed < tradWater * 0.5
          ? 'good'
          : waterUsed < tradWater * 0.8
          ? 'average'
          : 'above_target',

      waterSavedL: +waterSavedToday.toFixed(1),

      waterSavePct,

      monthlySavingsL: Math.round(
        waterSavedToday * 30
      ),

      yearlyWaterSavedL: Math.round(
        waterSavedToday * 365
      ),

      dailySavingsRm: +dailySavingsRm.toFixed(2),

      monthlySavingsRm,

      yearlySavingsRm,

      todayTradCost: +tradCostToday.toFixed(2),

      todayVertCost: +vertCostToday.toFixed(2),
    };

    /* ─────────────────────────────────────────────
       AI Narrative
       ───────────────────────────────────────────── */

    let aiNarrative = null;

    try {
      const cropSummary = plantData
        .map(
          (p) =>
            `${p.name}: ${p.waterSavePct}% less water, ${p.energySavePct}% less energy`
        )
        .join('; ');

      const systemPrompt = `
You are an agricultural sustainability analyst.
Keep response under 90 words.
Use exact figures.
Plain prose only.
`;

      const userPrompt = `
${cropSummary}

Today's usage:
Water: ${waterUsed}L
Energy: ${energyUsed}kWh

Monthly water savings:
${ruleBasedSummary.monthlySavingsL}L

Monthly cost savings:
RM${monthlySavingsRm}
`;

      aiNarrative = await callGroq(
        systemPrompt,
        userPrompt
      );
    } catch (e) {
      console.warn(
        '[consumptionRoutes] Groq failed:',
        e.message
      );
    }

    /* ─────────────────────────────────────────────
       Fallback AI
       ───────────────────────────────────────────── */

    if (!aiNarrative) {
      aiNarrative = `Your vertical ${primary.name.toLowerCase()} farm used only ${waterUsed.toFixed(
        1
      )}L today compared to ${tradWater}L required outdoors, saving ${waterSavePct}% water. Monthly savings of ${
        ruleBasedSummary.monthlySavingsL
      }L significantly reduce environmental strain while improving long-term farming efficiency.`;
    }

    /* ─────────────────────────────────────────────
       RESPONSE
       ───────────────────────────────────────────── */

    res.json({
      plantData,

      aiNarrative,

      ruleBasedSummary,

      idealWaterZone: {
        min: avgIdealMin,
        max: avgIdealMax,
        mid: Math.round(
          (avgIdealMin + avgIdealMax) / 2
        ),
      },

      // ✅ IMPORTANT FOR FRONTEND CHART
      traditionalEnergyPerDay:
        tradEnergyPerDay,
    });
  } catch (err) {
    console.error(
      '[consumptionRoutes] Error:',
      err
    );

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;