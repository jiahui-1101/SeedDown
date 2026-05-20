const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const c = require('../controllers/whatIfController');

router.get('/market-prices', c.getMarketPrices);

router.get('/recipes', (req, res) => {

  const { species } = req.query;

  if (!species) {
    return res
      .status(400)
      .json({ error: 'species param required' });
  }

  const filePath = path.join(
    __dirname,
    '../../garden_recipes.json'
  );

  const allRecipes = JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );

  const keywordMap = {

    tomato: ['tomato', 'tomatoes'],

    carrot: ['carrot', 'carrots'],

    cabbage: ['cabbage'],

    eggplant: ['eggplant', 'aubergine'],

    basil: ['basil'],

    green_onion: [
      'green onion',
      'green onions',
      'scallion'
    ],

    lettuce: ['lettuce'],

    spinach: ['spinach'],

    strawberry: [
      'strawberry',
      'strawberries'
    ],

    pepper: [
      'bell pepper',
      'green pepper',
      'capsicum'
    ],

  };

  const keywords =
    keywordMap[species.toLowerCase()]
    || [species];

  const regex = new RegExp(
    keywords.join('|'),
    'i'
  );

  const matched = allRecipes
    .filter(r =>
      r.ingredients.some(ing =>
        regex.test(ing)
      )
    )
    .slice(0, 20);

  res.json({
    species,
    count: matched.length,
    recipes: matched
  });

});

router.post('/forecast', c.getForecast);

router.post('/costsaving', c.getCostAnalysis);

router.post('/newplant', c.getNewPlantImpact);

/* ============================= */
/* NEW AI DYNAMIC PLANT ROUTE    */
/* ============================= */

router.post(
  '/newplant-ai',
  c.newPlantAiAnalysis
);

module.exports = router;
