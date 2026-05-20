const PlantedCrop = require('../models/plantedCropModel');
const { chatWithAdvisor } = require('../services/aiService');
const sensorService = require('../services/sensorService');

function sensorFilterCandidates(body = {}, clientState = {}) {
  const seen = new Set();
  const candidates = [];
  const push = (filters) => {
    const clean = Object.entries(filters || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') acc[key] = value;
      return acc;
    }, {});
    if (!Object.keys(clean).length) return;
    const sig = JSON.stringify(clean);
    if (seen.has(sig)) return;
    seen.add(sig);
    candidates.push(clean);
  };

  push({ deviceId: body.deviceId });
  push({ deviceId: clientState.deviceId });
  push({ deviceId: clientState.farm?.deviceId });
  push({ deviceId: clientState.farmMaster?.deviceId });
  push({ deviceId: clientState.sensors?.deviceId });
  push({ zoneId: body.zoneId || clientState.zoneId || clientState.currentZoneId });
  push({ farmId: body.farmId || clientState.farmId || clientState.farm?.id || clientState.id });
  push({ fieldId: body.fieldId || clientState.fieldId || clientState.farm?.fieldId });

  return candidates;
}

async function fetchFirebaseSensorContext(body = {}, clientState = {}) {
  for (const filters of sensorFilterCandidates(body, clientState)) {
    const latest = await sensorService.getLatestReading(filters);
    if (!latest) continue;
    const history = await sensorService.getReadings(filters, 80);
    return {
      latest,
      history,
      source: `Firebase sensorReadings (${Object.entries(filters).map(([k, v]) => `${k}=${v}`).join(', ')})`,
    };
  }
  return {
    latest: null,
    history: [],
    source: 'Firebase sensorReadings (no matching readings found)',
  };
}

// POST /api/chat
exports.chat = async (req, res) => {
  try {
    const { message, history = [], gardenState: clientState, mode = 'beginner' } = req.body;

    const firebaseSensors = await fetchFirebaseSensorContext(req.body, clientState || {});

    // Commercial mode: keep frontend farm/zone metadata, but replace all sensor
    // values with exact Firebase readings before passing context to AI.
    // Beginner mode: build context from DB planted crops so Sprout knows what's growing.
    let gardenState = clientState;
    if (gardenState && mode === 'commercial') {
      const { sensors, ...metadataOnly } = gardenState;
      gardenState = {
        ...metadataOnly,
        firebaseSensors,
        sensorInstruction: 'Use only firebaseSensors.latest/history for sensor analysis. Ignore client-provided sensor fields.',
      };
    } else {
      const planted = await PlantedCrop.find({ status: 'growing' }).lean();
      gardenState = planted.length > 0
        ? planted.map(c => ({
            species: c.species,
            qty: c.quantity,
            daysGrowing: Math.floor((Date.now() - new Date(c.plantedDate)) / 86400000)
          }))
        : [
            { species: 'lettuce', qty: 1, daysGrowing: 7 },
            { species: 'spinach', qty: 1, daysGrowing: 12 },
            { species: 'basil',   qty: 1, daysGrowing: 0  },
            { species: 'tomato',  qty: 1, daysGrowing: 20 }
          ];
      gardenState = {
        crops: gardenState,
        firebaseSensors,
        sensorInstruction: 'Use only firebaseSensors.latest/history for sensor analysis. Do not invent missing sensor readings.',
      };
    }

    const messages = [...history, { role: 'user', content: message }];
    const reply = await chatWithAdvisor(messages, gardenState, mode);

    res.json({ reply, role: 'assistant' });
  } catch (err) {
    console.error('Chat error:', err);
    const fallback = req.body?.mode === 'commercial'
      ? 'AI Advisor is temporarily offline. Sensor monitoring still works: review abnormal zones, keep gas and temperature alerts active, and avoid changing thresholds beyond safety limits.'
      : 'Sprout is temporarily offline, but your live sensor monitoring still works. Check any warning cards first, then water or ventilate only if the dashboard recommends it.';
    res.json({ reply: fallback, role: 'assistant', fallback: true, error: err.message });
  }
};
