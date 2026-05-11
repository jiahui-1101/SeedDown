const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 SeedDown backend → http://localhost:${PORT}`));

/*
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/seeddown')
  .then(() => console.log('✅ Connected to MongoDB (SeedDown)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 2. Define Schema - POINTING EXACTLY TO kaggle_recipe
const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  instructions: String,
  source: String
}, { collection: 'kaggle_recipe' }); // Must match the name in your Compass screenshot

const Recipe = mongoose.model('Recipe', recipeSchema);

// --- ROUTES ---

// Route A: Home test (Go to http://localhost:3000/ to see this)
app.get('/', (req, res) => {
    res.send('<h1>Server is Live!</h1><p>Try <a href="/api/recipes">/api/recipes</a> to see data.</p>');
});

// Route B: The Data Route
app.get('/api/recipes', async (req, res) => {
    try {
        console.log('Fetching recipes from kaggle_recipe collection...');
        const recipes = await Recipe.find().limit(100); 
        console.log(`Found ${recipes.length} recipes.`);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/sensors', (req, res) => {
    console.log('Sensor data received:', req.body);
    res.json({ status: 'ok' });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
*/
