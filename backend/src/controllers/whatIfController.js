const path = require('path');
const fs = require('fs');
const { forecastYieldAndRecipes, askClaude } = require('../services/aiService');

// ── Data helpers (JSON files only — no MongoDB) ──────────────────────────────

const CROPS_FILE   = path.join(__dirname, '../../crops_data.json');
const RECIPES_FILE = path.join(__dirname, '../../garden_recipes.json');

function loadCrops() {
  return JSON.parse(fs.readFileSync(CROPS_FILE, 'utf8'));
}

function findCrop(species) {
  return loadCrops().find(c => c.species === species.toLowerCase()) || null;
}

function findRecipes(keywords, limit = 10) {
  const allRecipes = JSON.parse(fs.readFileSync(RECIPES_FILE, 'utf8'));
  const regex = new RegExp(keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
  return allRecipes
    .filter(r => r.ingredients.some(ing => regex.test(ing)))
    .slice(0, limit);
}

// ── POST /api/whatif/forecast ────────────────────────────────────────────────

exports.getForecast = async (req, res) => {
  try {
    const { species, quantity = 1, days = 30, plantedDate } = req.body;

    const cropSpec = findCrop(species);
    if (!cropSpec) return res.status(404).json({ error: `Species "${species}" not found` });

    const keywords = cropSpec.recipeKeywords || [species];
    const recipes  = findRecipes(keywords, 10);

    const virtualCrop = {
      species,
      commonName:  cropSpec.commonName,
      quantity:    parseInt(quantity),
      plantedDate: plantedDate || new Date()
    };

    const analysis = await forecastYieldAndRecipes(virtualCrop, cropSpec, recipes, days);

    res.json({
      cropSpec,
      matchedRecipes: recipes.slice(0, 5).map(r => ({
        name:        r.name,
        ingredients: r.ingredients.slice(0, 4)
      })),
      aiAnalysis: analysis
    });

  } catch (err) {
    console.error('Forecast error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/whatif/recipes?species=tomato ───────────────────────────────────

exports.getRecipesBySpecies = async (req, res) => {
  try {
    const { species } = req.query;
    if (!species) return res.status(400).json({ error: 'species param required' });

    const cropSpec = findCrop(species);
    const keywords = cropSpec?.recipeKeywords || [species];
    const recipes  = findRecipes(keywords, 20);

    res.json({ species, count: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/whatif/costsaving ──────────────────────────────────────────────

exports.getCostAnalysis = async (req, res) => {
  try {
    const { plant, units, weeks, sensors } = req.body;

    const temp     = sensors?.temp     ?? 28;
    const humid    = sensors?.humid    ?? 68;
    const light    = sensors?.light    ?? 82;
    const water    = sensors?.water    ?? 45;
    const nutrient = sensors?.nutrient ?? 78;

    // Condition score (calculated, not AI)
    const tempScore     = temp >= 18 && temp <= 28 ? 100 : temp < 18 ? (temp / 18) * 100 : ((40 - temp) / 12) * 100;
    const humidScore    = humid >= 50 && humid <= 80 ? 100 : humid < 50 ? (humid / 50) * 100 : ((100 - humid) / 20) * 100;
    const moistureScore = water >= 40 && water <= 70 ? 100 : water < 40 ? (water / 40) * 100 : 80;
    const nutrientScore = nutrient >= 60 ? 100 : (nutrient / 60) * 100;
    const conditionScore = Math.round((tempScore + humidScore + moistureScore + nutrientScore) / 4);
    const conditionLabel = conditionScore >= 85 ? 'Optimal' : conditionScore >= 70 ? 'Good' : conditionScore >= 50 ? 'Fair' : 'Poor';

    // Water savings (calculated, not AI)
    const manualWaterPerPlantPerWeek = 3.5;
    const autoWaterPerPlantPerWeek   = water < 40 ? 2.5 : water > 70 ? 0.8 : 1.5;
    const manualWaterLiters = parseFloat((manualWaterPerPlantPerWeek * units * weeks).toFixed(1));
    const autoWaterLiters   = parseFloat((autoWaterPerPlantPerWeek   * units * weeks).toFixed(1));
    const waterSavedLiters  = parseFloat((manualWaterLiters - autoWaterLiters).toFixed(1));
    const waterCostSaved    = parseFloat((waterSavedLiters * 0.042).toFixed(2));

    // Energy savings (calculated, not AI)
    const manualLightHrs  = 12;
    const autoLightHrs    = light > 70 ? 6 : light > 40 ? 8 : 10;
    const energySavedkWh  = parseFloat(((manualLightHrs - autoLightHrs) * 0.04 * weeks * 7).toFixed(2));
    const energyCostSaved = parseFloat((energySavedkWh * 1.10).toFixed(2));
    const totalSavedRM    = parseFloat((waterCostSaved + energyCostSaved).toFixed(2));

    // AI writes insight only
    const prompt = `Agricultural AI for SeedDown. Write exactly 2 complete sentences about ${plant} garden conditions.
Temp ${temp}°C ${temp > 30 ? '(too hot)' : temp < 18 ? '(too cold)' : '(optimal)'}, Humidity ${humid}% ${humid < 50 ? '(too dry)' : humid > 80 ? '(too humid)' : '(good)'}, Moisture ${water}% ${water < 40 ? '(needs watering)' : '(good)'}, Nutrients ${nutrient}% ${nutrient < 60 ? '(low)' : '(ok)'}.
Condition: ${conditionScore}/100 (${conditionLabel}). Automation saved ${waterSavedLiters}L water + ${energySavedkWh}kWh energy = RM ${totalSavedRM}.
Sentence 1: describe current ${plant} conditions. Sentence 2: mention RM ${totalSavedRM} saved by automation.`;

    const raw     = await askClaude('', prompt, 200);
    const insight = raw.replace(/```/g, '').trim();

    res.json({
      conditionScore, conditionLabel,
      manualWaterLiters, autoWaterLiters, waterSavedLiters,
      manualEnergykWh: parseFloat((manualLightHrs * 0.04 * weeks * 7).toFixed(2)),
      autoEnergykWh:   parseFloat((autoLightHrs   * 0.04 * weeks * 7).toFixed(2)),
      energySavedkWh, waterCostSaved, energyCostSaved, totalSavedRM, insight
    });

  } catch (err) {
    console.error('Cost analysis error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/whatif/newplant ────────────────────────────────────────────────

exports.getNewPlantImpact = async (req, res) => {
  try {
    // ✅ FIX: destructure FIRST before using any variables
    const { species, quantity, currentCrops, sensors } = req.body;

    const temp     = sensors?.temp     ?? 28;
    const humid    = sensors?.humid    ?? 68;
    const light    = sensors?.light    ?? 82;
    const water    = sensors?.water    ?? 45;
    const nutrient = sensors?.nutrient ?? 78;

    // ✅ FIX: guard against missing species
    if (!species) {
      return res.status(400).json({ error: 'species is required' });
    }

    // ✅ FIX: unsuitablePlants check is now INSIDE try, after destructuring
    const unsuitablePlants = ['mango', 'oak', 'pine', 'apple', 'orange', 'banana', 'coconut', 'tree', 'palm', 'bamboo', 'sugarcane'];
    const isUnsuitable = unsuitablePlants.some(u => species.toLowerCase().includes(u));

    if (isUnsuitable) {
      const prompt = `You are an indoor vertical farming expert for SeedDown.
A user wants to add "${species}" to their indoor vertical farm.
Explain in exactly 2 sentences why this is not suitable for indoor vertical farming.
Be specific about why ${species} cannot grow in a rack/shelf system indoors.`;

      const raw = await askClaude('', prompt, 150);
      return res.json({
        unsuitable: true,
        impacts: { tempChange:0, humidChange:0, lightChange:0, waterChange:0, nutrientChange:0 },
        projected: { temp, humid, light, water, nutrient },
        warnings: [`"${species}" is not suitable for indoor vertical farming`],
        insight: raw.replace(/```/g, '').trim()
      });
    }

    const scale    = (quantity || 1) / 4;
    const cropSpec = findCrop(species);
    const base     = cropSpec?.impacts || { tempChange:0, humidChange:0, lightChange:0, waterChange:0, nutrientChange:0 };

    const impacts = {
      tempChange:     parseFloat(Math.min((base.tempChange     || 0) * scale,  8).toFixed(1)),
      humidChange:    parseFloat(Math.min((base.humidChange    || 0) * scale, 30).toFixed(1)),
      lightChange:    parseFloat(((base.lightChange    || 0) * scale).toFixed(1)),
      waterChange:    parseFloat(Math.min((base.waterChange    || 0) * scale, 40).toFixed(1)),
      nutrientChange: parseFloat(Math.min((base.nutrientChange || 0) * scale, 30).toFixed(1)),
    };

    const projected = {
      temp:     parseFloat((temp     + impacts.tempChange).toFixed(1)),
      humid:    parseFloat((humid    + impacts.humidChange).toFixed(1)),
      light:    parseFloat((light    + impacts.lightChange).toFixed(1)),
      water:    parseFloat((water    + impacts.waterChange).toFixed(1)),
      nutrient: parseFloat((nutrient + impacts.nutrientChange).toFixed(1)),
    };

    const warnings = [];
    //if (projected.temp     > 32) warnings.push(`temperature will reach ${projected.temp}°C (danger)`);
    if (projected.humid    > 85) warnings.push(`humidity will reach ${projected.humid}% (mold risk)`);
    if (projected.water    > 80) warnings.push(`soil moisture will reach ${projected.water}% (overwatered)`);
    // nutrientChange is in % points added, not absolute — only warn if change is very large
    if (impacts.nutrientChange > 20) warnings.push(`nutrient demand increases significantly (+${impacts.nutrientChange}%)`);

    const prompt = `Agricultural AI for SeedDown indoor garden.
Current crops: ${currentCrops?.join(', ') || 'mixed vegetables'}
Adding: ${quantity} ${species} plants
Current: Temp ${temp}°C, Humidity ${humid}%, Moisture ${water}%, Nutrients ${nutrient}%
Projected: Temp ${projected.temp}°C, Humidity ${projected.humid}%, Moisture ${projected.water}%, Nutrients ${projected.nutrient}%
${warnings.length ? 'Warnings: ' + warnings.join('; ') : 'All projected values within safe range.'}
Write exactly 2 sentences: is it safe to add ${quantity} ${species}? What one action should user take?`;

    const raw     = await askClaude('', prompt, 200);
    const insight = raw.replace(/```/g, '').trim();

    res.json({ impacts, projected, warnings, insight });

  } catch (err) {
    console.error('New plant impact error:', err);
    res.status(500).json({ error: err.message });
  }
};
// ── POST /api/whatif/newplant-ai ─────────────────────────────────────────────

exports.newPlantAiAnalysis = async (req, res) => {
  try {
    const { species, quantity, currentCrops, sensors } = req.body;

    if (!species) {
      return res.status(400).json({ error: 'species is required' });
    }

    const temp     = sensors?.temp     ?? 28;
    const humid    = sensors?.humid    ?? 68;
    const light    = sensors?.light    ?? 82;
    const water    = sensors?.water    ?? 45;
    const nutrient = sensors?.nutrient ?? 78;

    const cropSpec = findCrop(species);

    const prompt = `You are an agricultural AI expert for SeedDown indoor vertical farm.
Species requested: ${species} (${quantity || 1} plants)
Current crops in farm: ${currentCrops?.join(', ') || 'mixed vegetables'}
Current sensors: Humidity ${humid}%, Light ${light}%, Moisture ${water}%, Nutrients ${nutrient}%
Projected after adding: Humidity ${projected.humid}%, Moisture ${projected.water}%, Nutrients ${projected.nutrient}%
${cropSpec ? `Known crop data: growth days ${cropSpec.growthDays}, water needs ${cropSpec.waterNeeds}, light needs ${cropSpec.lightNeeds}` : `No crop data found for "${species}" in database — use general knowledge.`}

Respond in valid JSON only. No markdown, no explanation outside the JSON.
{
  "suitable": true or false,
  "compatibilityScore": 0-100,
  "reason": "one sentence why suitable or not",
  "careAdvice": "one sentence on how to care for this plant in this environment",
  "warnings": ["array of warning strings, empty array if none"],
  "estimatedHarvestDays": number or null
}`;

    const raw = await askClaude('', prompt, 300);

    let parsed;
    try {
      const clean = raw.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw });
    }

    res.json({
      species,
      quantity: quantity || 1,
      cropSpec: cropSpec || null,
      analysis: parsed
    });

  } catch (err) {
    console.error('New plant AI analysis error:', err);
    res.status(500).json({ error: err.message });
  }
};
