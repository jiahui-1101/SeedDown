const GEMINI_API_KEY = process.env.ANTHROPIC_API_KEY; // reuse same .env var

async function askClaude(system, userMsg, maxTokens = 1024) {
  const fetch = (await import('node-fetch')).default;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: system + '\n\n' + userMsg }] }],
        generationConfig: { maxOutputTokens: maxTokens }
      })
    }
  );
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function chatWithAdvisor(messages, gardenState) {
  const fetch = (await import('node-fetch')).default;
  const system = `You are Sprout 🌱, the AI garden advisor for NextLevelFarm.
Help with crop care, harvest timing, recipes, sensor readings.
Be friendly, concise (2-3 sentences). Use plant emojis.
Current garden: ${JSON.stringify(gardenState)}`;

  // Convert message history to Gemini format
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  // Prepend system as first user message if history empty
  if (contents.length === 1) {
    contents.unshift({ role: 'user', parts: [{ text: system }] });
    contents.unshift({ role: 'model', parts: [{ text: 'Understood! I am Sprout 🌱, ready to help.' }] });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    }
  );
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}