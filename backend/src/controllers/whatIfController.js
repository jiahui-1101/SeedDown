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
    const prompt = `Agricultural AI for NextLevelFarm. Write exactly 2 complete sentences about ${plant} garden conditions.
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
    const { species, quantity, currentCrops, sensors } = req.body;

    const temp     = sensors?.temp     ?? 28;
    const humid    = sensors?.humid    ?? 68;
    const light    = sensors?.light    ?? 82;
    const water    = sensors?.water    ?? 45;
    const nutrient = sensors?.nutrient ?? 78;

    const scale    = quantity / 4;
    const cropSpec = findCrop(species);
    const base     = cropSpec?.impacts || { tempChange:0, humidChange:0, lightChange:0, waterChange:0, nutrientChange:0 };

    const impacts = {
      tempChange:     parseFloat(((base.tempChange     || 0) * scale).toFixed(1)),
      humidChange:    parseFloat(((base.humidChange    || 0) * scale).toFixed(1)),
      lightChange:    parseFloat(((base.lightChange    || 0) * scale).toFixed(1)),
      waterChange:    parseFloat(((base.waterChange    || 0) * scale).toFixed(1)),
      nutrientChange: parseFloat(((base.nutrientChange || 0) * scale).toFixed(1)),
    };

    const projected = {
      temp:     parseFloat((temp     + impacts.tempChange).toFixed(1)),
      humid:    parseFloat((humid    + impacts.humidChange).toFixed(1)),
      light:    parseFloat((light    + impacts.lightChange).toFixed(1)),
      water:    parseFloat((water    + impacts.waterChange).toFixed(1)),
      nutrient: parseFloat((nutrient + impacts.nutrientChange).toFixed(1)),
    };

    const warnings = [];
    if (projected.temp     > 32) warnings.push(`temperature will reach ${projected.temp}°C (danger)`);
    if (projected.humid    > 85) warnings.push(`humidity will reach ${projected.humid}% (mold risk)`);
    if (projected.water    > 80) warnings.push(`soil moisture will reach ${projected.water}% (overwatered)`);
    if (projected.nutrient > 95) warnings.push(`nutrient level will reach ${projected.nutrient}% (excess)`);

    const prompt = `Agricultural AI for NextLevelFarm indoor garden.
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