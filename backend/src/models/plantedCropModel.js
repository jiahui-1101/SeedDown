const mongoose = require('mongoose');

const plantedCropSchema = new mongoose.Schema({
  userId:      { type: String, default: 'default-user' },
  species:     { type: String, required: true },
  commonName:  String,
  emoji:       String,
  quantity:    { type: Number, default: 1 },
  plantedDate: { type: Date, default: Date.now },
  status:      { type: String, enum: ['growing','harvested','failed'], default: 'growing' },
  location:    String,
  notes:       String
});

module.exports = mongoose.model('PlantedCrop', plantedCropSchema);