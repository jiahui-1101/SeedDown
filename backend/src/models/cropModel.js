const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  species:    { type: String, required: true, unique: true },
  commonName: String,
  emoji:      String,
  requirements: {
    tempMin: Number, tempMax: Number,
    humidityMin: Number, humidityMax: Number,
    lightHours: Number,
    waterPerDay: Number,      // mL/day per plant
    fertilizerPerWeek: Number, // g/week per plant
    growthDays: Number
  },
  yield: {
    avgGramsPerPlant: Number,
    harvestsPerCycle: Number,
    peakWeek: Number
  },
  cost: {
    mktPricePerKg: Number,    // RM market price
    waterSavePerRow: Number,
    energySavePerRow: Number,
    fertilizerPerRow: Number,
    note: String
  },
  recipeKeywords: [String]
});

module.exports = mongoose.model('Crop', cropSchema);