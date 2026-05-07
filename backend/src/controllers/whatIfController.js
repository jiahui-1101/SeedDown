const Crop = require('../models/cropModel');
const PlantedCrop = require('../models/plantedCropModel');
const Recipe = require('../models/recipeModel');
const { forecastYieldAndRecipes } = require('../services/aiService');

// POST /api/whatif/forecast
exports.getForecast = async (req, res) => {
  try {
    const { species, quantity = 1, days = 30, plantedDate } = req.body;

    const cropSpec = await Crop.findOne({ species: species.toLowerCase() });
    if (!cropSpec) return res.status(404).json({ error: `Species "${species}" not in database` });

    // Search recipes by keyword
    const keywords = cropSpec.recipeKeywords || [species];
    const regexPattern = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const recipes = await Recipe.find({
      ingredients: { $regex: regexPattern, $options: 'i' }
    }).limit(10);

    // Build a virtual planted crop object (don't need DB for this)
    const virtualCrop = {
      species,
      commonName: cropSpec.commonName,
      quantity: parseInt(quantity),
      plantedDate: plantedDate || new Date()
    };

    const analysis = await forecastYieldAndRecipes(virtualCrop, cropSpec, recipes, days);

    res.json({
      cropSpec,
      matchedRecipes: recipes.slice(0, 5).map(r => ({
        name: r.name,
        ingredients: r.ingredients.slice(0, 4)
      })),
      aiAnalysis: analysis
    });

  } catch (err) {
    console.error('Forecast error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/whatif/recipes?species=tomato
exports.getRecipesBySpecies = async (req, res) => {
  try {
    const { species } = req.query;
    if (!species) return res.status(400).json({ error: 'species param required' });

    const cropSpec = await Crop.findOne({ species: species.toLowerCase() });
    const keywords = cropSpec?.recipeKeywords || [species];
    const regexPattern = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

    const recipes = await Recipe.find({
      ingredients: { $regex: regexPattern, $options: 'i' }
    }).limit(20);

    res.json({ species, count: recipes.length, recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};