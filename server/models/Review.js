const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  journey: { type: mongoose.Schema.Types.ObjectId, ref: 'Journey', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  text: { type: String },
  keywords: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
