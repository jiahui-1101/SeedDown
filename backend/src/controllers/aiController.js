const thresholdService = require('../services/thresholdService');

exports.generateThresholds = async (req, res) => {
  try {
    const result = await thresholdService.generateThresholds(req.body || {});
    res.json({ ok: true, ...result });
  } catch (error) {
    console.error('Generate thresholds error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
};
