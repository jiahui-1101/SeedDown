// GROQ
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`
};

async function askClaude(system, userMsg, maxTokens = 1024) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: system || 'You are a helpful agricultural AI.' },
        { role: 'user', content: userMsg }
      ]
    })
  });
  const data = await res.json();
  if (!data.choices?.[0]) {
    console.log('Groq empty response:', JSON.stringify(data));
    return 'AI insight unavailable.';
  }
  return data.choices[0].message.content;
}

async function chatWithAdvisor(messages, gardenState) {
  const system = `You are Sprout 🌱, the AI garden advisor for NextLevelFarm.
Help with crop care, harvest timing, recipes, sensor readings.
Be friendly, concise (2-3 sentences). Use plant emojis.
Current garden: ${JSON.stringify(gardenState)}`;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 512,
      messages: [
        { role: 'system', content: system },
        ...messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }))
      ]
    })
  });
  const data = await res.json();
  if (!data.choices?.[0]) throw new Error('No response from Groq');
  return data.choices[0].message.content;
}

async function forecastYieldAndRecipes(plantedCrop, cropSpec, recipes, days) {
  const prompt = `You are an agricultural AI for NextLevelFarm indoor garden.
Respond ONLY with valid JSON, no markdown.

Forecast harvest:
- Species: ${plantedCrop.species}
- Plants: ${plantedCrop.quantity}
- Forecast: ${days} days
- Growth cycle: ${cropSpec.requirements?.growthDays} days
- Yield per plant: ${cropSpec.yield?.avgGramsPerPlant}g
- Matched recipes: ${recipes.slice(0,3).map(r => r.name).join(', ')}

Return exactly:
{"summary":"2 sentences","estimatedYieldGrams":0,"harvestDate":"YYYY-MM-DD","confidence":"medium","tips":["tip1","tip2"]}`;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 512,
      messages: [
        { role: 'system', content: 'Respond only with valid JSON, no markdown.' },
        { role: 'user', content: prompt }
      ]
    })
  });
  const data = await res.json();
  if (!data.choices?.[0]) return { error: 'No AI response' };
  const text = data.choices[0].message.content;
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { error: 'Parse failed', raw: text };
  }
}

module.exports = { askClaude, forecastYieldAndRecipes, chatWithAdvisor };

// GEMINI
/* 

const fetch = require('node-fetch');
require('dotenv').config();

const GEMINI_API_KEY = process.env.ANTHROPIC_API_KEY;
// const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
function safeText(data) {
  if (!data.candidates || !data.candidates[0]) {
    console.log('Gemini empty response:', JSON.stringify(data));
    return null;
  }
  return data.candidates[0].content.parts[0].text;
}

async function askClaude(system, userMsg, maxTokens = 2048) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: (system ? system + '\n\n' : '') + userMsg }] }],
      generationConfig: { maxOutputTokens: maxTokens }
    })
  });
  const data = await res.json();
  return safeText(data) ?? 'AI insight unavailable.';
}

async function chatWithAdvisor(messages, gardenState) {
  const system = `You are Sprout 🌱, the AI garden advisor for NextLevelFarm.
Help with crop care, harvest timing, recipes, sensor readings.
Be friendly, concise (2-3 sentences). Use plant emojis.
Current garden: ${JSON.stringify(gardenState)}`;

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
  const text = safeText(data);
  if (!text) throw new Error(data.error?.message || 'No response from Gemini');
  return text;
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

Matched recipes: ${recipes.slice(0, 3).map(r => r.name).join(', ')}

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
  const text = safeText(data);
  if (!text) return { error: 'No AI response' };
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { error: 'Parse failed', raw: text };
  }
}

module.exports = { askClaude, forecastYieldAndRecipes, chatWithAdvisor };

*/