const fetch = require('node-fetch');
require('dotenv').config();

const GEMINI_API_KEY = process.env.ANTHROPIC_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function askClaude(system, userMsg, maxTokens = 1024) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: system + '\n\n' + userMsg }] }],
      generationConfig: { maxOutputTokens: maxTokens }
    })
  });
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function chatWithAdvisor(messages, gardenState) {
  const system = `You are Sprout 🌱, the AI garden advisor for NextLevelFarm.
Help with crop care, harvest timing, recipes, sensor readings.
Be friendly, concise (2-3 sentences). Use plant emojis.
Current garden: ${JSON.stringify(gardenState)}`;

  // Build contents array — Gemini needs alternating user/model roles
  const contents = [
    { role: 'user',  parts: [{ text: system }] },
    { role: 'model', parts: [{ text: 'Understood! I am Sprout 🌱, ready to help.' }] },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  ];

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });
  const data = await res.json();
console.log('Gemini response:', JSON.stringify(data, null, 2));
if (!data.candidates) throw new Error(data.error?.message || 'No candidates in response');
return data.candidates[0].content.parts[0].text;
}

async function forecastYieldAndRecipes(plantedCrop, cropSpec, recipes, days) {
  const prompt = `You are an agricultural AI for NextLevelFarm indoor garden.
Respond ONLY with valid JSON, no markdown.

Forecast harvest for this crop:
- Species: ${plantedCrop.species}
- Plants: ${plantedCrop.quantity}
- Forecast window: ${days} days
- Growth cycle: ${cropSpec.requirements?.growthDays} days
- Yield per plant: ${cropSpec.yield?.avgGramsPerPlant}g

Matched recipes: ${recipes.slice(0,3).map(r => r.name).join(', ')}

Return exactly:
{"summary":"2 sentences","estimatedYieldGrams":0,"harvestDate":"YYYY-MM-DD","confidence":"medium","tips":["tip1","tip2"]}`;

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 512 }
    })
  });
  const data = await res.json();
  const raw = data.candidates[0].content.parts[0].text;
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return { error: 'Parse failed', raw };
  }
}

module.exports = { askClaude, forecastYieldAndRecipes, chatWithAdvisor };