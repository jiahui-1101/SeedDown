const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  instructions: String,
  source: String
}, { collection: 'kaggle_recipe' });

// Text index for keyword search
recipeSchema.index({ name: 'text', ingredients: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);