require('dotenv').config();
const { connectDB } = require('./src/config/db');
const Crop = require('./src/models/cropModel');

connectDB();

async function seed() {
  await Crop.deleteMany({});

  await Crop.insertMany([
    {
      species: 'tomato',
      commonName: 'Cherry Tomato',
      emoji: '🍅',
      requirements: { tempMin: 18, tempMax: 27, humidityMin: 60, humidityMax: 80, lightHours: 8, waterPerDay: 250, fertilizerPerWeek: 5, growthDays: 70 },
      yield: { avgGramsPerPlant: 500, harvestsPerCycle: 8, peakWeek: 10 },
      cost: { mktPricePerKg: 7.2, waterSavePerRow: 2.1, energySavePerRow: 0.9, fertilizerPerRow: 1.1, note: 'Tomatoes fetched RM 7.20/kg at Pasar Borong this week.' },
      recipeKeywords: ['tomato', 'tomatoes', 'cherry tomato']
    },
    {
      species: 'lettuce',
      commonName: 'Butter Lettuce',
      emoji: '🥬',
      requirements: { tempMin: 15, tempMax: 22, humidityMin: 50, humidityMax: 70, lightHours: 6, waterPerDay: 150, fertilizerPerWeek: 3, growthDays: 45 },
      yield: { avgGramsPerPlant: 200, harvestsPerCycle: 3, peakWeek: 6 },
      cost: { mktPricePerKg: 4.8, waterSavePerRow: 3.2, energySavePerRow: 1.1, fertilizerPerRow: 0.8, note: 'Lettuce grows fast — your rows beat supermarket prices by 2× this month.' },
      recipeKeywords: ['lettuce', 'salad', 'greens']
    },
    {
      species: 'carrot',
      commonName: 'Carrot',
      emoji: '🥕',
      requirements: { tempMin: 15, tempMax: 24, humidityMin: 50, humidityMax: 70, lightHours: 6, waterPerDay: 180, fertilizerPerWeek: 3, growthDays: 75 },
      yield: { avgGramsPerPlant: 300, harvestsPerCycle: 2, peakWeek: 11 },
      cost: { mktPricePerKg: 3.5, waterSavePerRow: 1.8, energySavePerRow: 0.7, fertilizerPerRow: 0.6, note: 'Carrots are low-maintenance and high-value for home growing.' },
      recipeKeywords: ['carrot', 'carrots']
    },
    {
      species: 'basil',
      commonName: 'Sweet Basil',
      emoji: '🌿',
      requirements: { tempMin: 18, tempMax: 30, humidityMin: 40, humidityMax: 60, lightHours: 6, waterPerDay: 100, fertilizerPerWeek: 2, growthDays: 30 },
      yield: { avgGramsPerPlant: 80, harvestsPerCycle: 10, peakWeek: 5 },
      cost: { mktPricePerKg: 12.0, waterSavePerRow: 0.9, energySavePerRow: 0.5, fertilizerPerRow: 0.4, note: 'Fresh basil at supermarkets is expensive. Your rows are a gold mine.' },
      recipeKeywords: ['basil', 'herb', 'pesto']
    },
    {
      species: 'cabbage',
      commonName: 'Green Cabbage',
      emoji: '🥬',
      requirements: { tempMin: 10, tempMax: 20, humidityMin: 60, humidityMax: 80, lightHours: 6, waterPerDay: 200, fertilizerPerWeek: 4, growthDays: 90 },
      yield: { avgGramsPerPlant: 1200, harvestsPerCycle: 1, peakWeek: 13 },
      cost: { mktPricePerKg: 3.2, waterSavePerRow: 2.5, energySavePerRow: 0.8, fertilizerPerRow: 0.7, note: 'Cabbage is a bulk producer — great for soups and stir-fries.' },
      recipeKeywords: ['cabbage', 'coleslaw', 'slaw']
    },
    {
      species: 'eggplant',
      commonName: 'Eggplant',
      emoji: '🍆',
      requirements: { tempMin: 20, tempMax: 30, humidityMin: 60, humidityMax: 75, lightHours: 8, waterPerDay: 220, fertilizerPerWeek: 5, growthDays: 80 },
      yield: { avgGramsPerPlant: 400, harvestsPerCycle: 6, peakWeek: 12 },
      cost: { mktPricePerKg: 5.5, waterSavePerRow: 2.4, energySavePerRow: 1.3, fertilizerPerRow: 0.9, note: 'Eggplant uses more water but market price makes it worthwhile.' },
      recipeKeywords: ['eggplant', 'aubergine', 'brinjal']
    },
    {
      species: 'spinach',
      commonName: 'Baby Spinach',
      emoji: '🥬',
      requirements: { tempMin: 10, tempMax: 20, humidityMin: 50, humidityMax: 70, lightHours: 5, waterPerDay: 120, fertilizerPerWeek: 3, growthDays: 40 },
      yield: { avgGramsPerPlant: 150, harvestsPerCycle: 4, peakWeek: 5 },
      cost: { mktPricePerKg: 6.0, waterSavePerRow: 2.0, energySavePerRow: 0.6, fertilizerPerRow: 0.5, note: 'Spinach is fast and nutritious — a great starter crop.' },
      recipeKeywords: ['spinach', 'greens', 'leafy green']
    }
  ]);

  console.log('Crop species seeded to Firebase Firestore');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
