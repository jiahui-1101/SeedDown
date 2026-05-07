require('dotenv').config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

const baseHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01'
};

// Generic Claude call
async function askClaude(system, userMsg, maxTokens = 1024) {
  const fetch = (await import('node-fetch')).default;
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userMsg }]
    })
  });
  if (!res.ok) {
    const e = await res.json();
    throw new Error(e.error?.message || 'Claude API error');
  }
  const data = await res.json();
  return data.content[0].text;
}

// 4.1 — Yield forecast + recipe suggestions
async function forecastYieldAndRecipes(plantedCrop, cropSpec, recipes, days) {
  const system = `You are an agricultural AI for NextLevelFarm indoor garden. 
Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`;

  const user = `
Forecast harvest for this indoor garden crop.

PLANTED:
- Species: ${plantedCrop.species} (${plantedCrop.commonName})
- Plants: ${plantedCrop.quantity}
- Days growing: ${Math.floor((Date.now() - new Date(plantedCrop.plantedDate)) / 86400000)}
- Forecast window: ${days} days

CROP SPEC:
- Growth cycle: ${cropSpec.requirements?.growthDays} days
- Yield per plant: ${cropSpec.yield?.avgGramsPerPlant}g
- Harvests per cycle: ${cropSpec.yield?.harvestsPerCycle}
- Peak week: ${cropSpec.yield?.peakWeek}

MATCHED RECIPES (from 75k recipe database):
${recipes.slice(0, 5).map((r, i) => `${i + 1}. "${r.name}" — uses: ${r.ingredients.slice(0, 3).join(', ')}`).join('\n')}

Return exactly this JSON:
{
  "summary": "2-sentence harvest overview",
  "estimatedYieldGrams": 0,
  "harvestDate": "YYYY-MM-DD",
  "confidence": "low|medium|high",
  "tips": ["tip1", "tip2"],
  "topRecipes": [
    { "name": "recipe name", "why": "one sentence why this crop works here", "matchScore": 85 }
  ]
}`;

  const raw = await askClaude(system, user);
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return { error: 'Parse failed', raw };
  }
}

// AI Chatbox — multi-turn with garden context
async function chatWithAdvisor(messages, gardenState) {
  const fetch = (await import('node-fetch')).default;
  const system = `You are Sprout 🌱, the AI garden advisor for NextLevelFarm indoor smart garden.
Help users with crop care, harvest timing, recipes, and sensor readings.
Be friendly, concise (2-3 sentences), practical. Use plant/food emojis occasionally.
Current garden: ${JSON.stringify(gardenState)}`;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system,
      messages
    })
  });
  const data = await res.json();
  return data.content[0].text;
}

module.exports = { askClaude, forecastYieldAndRecipes, chatWithAdvisor };