const fs = require('fs');
const csv = require('csv-parser');

const INPUT_FILE = 'recipes_data.csv'; 
const OUTPUT_FILE = 'garden_recipes.json';
const LIMIT = 5000; 

const GARDEN_CROPS = [
  'tomato', 'basil', 'mint', 'lettuce', 'spinach', 'carrot', 
  'zucchini', 'pepper', 'kale', 'rosemary', 'onion', 'potato',
  'cucumber', 'strawberry', 'garlic', 'thyme', 'oregano', 'parsley',
  'chili', 'ginger', 'turmeric', 'lemongrass', 'pandan', 
  'curry leaf', 'okra', 'eggplant', 'water spinach', 'bok choy', 
  'coriander', 'lime', 'long bean', 'spring onion', 'galangal',
  'sweet potato', 'bitter melon', 'papaya', 'mango', 'chive',
  'microgreen', 'sprout', 'cherry tomato', 'bell pepper', 'sweet pepper',
  'arugula', 'rocket', 'swiss chard', 'dill', 'sage', 
  'butterhead lettuce', 'romaine', 'shiso', 'perilla'
];

let count = 0;
const outputStream = fs.createWriteStream(OUTPUT_FILE);

// Start the JSON array bracket
outputStream.write('[\n');

console.log(`🚀 Starting Memory-Safe scan...`);

const stream = fs.createReadStream(INPUT_FILE)
  .pipe(csv())
  .on('data', (data) => {
    if (count >= LIMIT) {
      stream.destroy();
      return;
    }

    const title = data.title || "";
    const ingredientsString = data.ingredients || "";
    
    const isGardenFriendly = GARDEN_CROPS.some(crop => 
      ingredientsString.toLowerCase().includes(crop)
    );

    if (isGardenFriendly) {
      let ingredientsArray = [];
      try {
        const formattedString = ingredientsString.replace(/'/g, '"');
        ingredientsArray = JSON.parse(formattedString);
      } catch (e) {
        ingredientsArray = ingredientsString.split(/[,;]/).map(i => i.trim());
      }

      const recipe = {
        name: title,
        ingredients: ingredientsArray,
        instructions: data.instructions || "Instructions in full dataset.",
        source: "Kaggle Garden Dataset"
      };

      // Write to file immediately with a comma (except for the first one)
      const prefix = count === 0 ? '' : ',\n';
      outputStream.write(prefix + JSON.stringify(recipe, null, 2));

      count++;
      if (count % 500 === 0) console.log(`✅ Progress: ${count} matches...`);
    }
  })
  .on('close', () => {
    // Close the JSON array bracket
    outputStream.write('\n]');
    outputStream.end();
    console.log(`\n✨ SUCCESS! Saved ${count} recipes to ${OUTPUT_FILE}`);
  })
  .on('error', (err) => {
    if (err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      console.error('❌ Error:', err.message);
    }
  });