const PlantedCrop = require('../models/plantedCropModel');
const { chatWithAdvisor } = require('../services/aiService');

// POST /api/chat
exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Build garden context from DB (or AppState tiles if no DB entries)
    const planted = await PlantedCrop.find({ status: 'growing' }).lean();
    const gardenState = planted.length > 0
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

    const messages = [...history, { role: 'user', content: message }];
    const reply = await chatWithAdvisor(messages, gardenState);

    res.json({ reply, role: 'assistant' });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
};