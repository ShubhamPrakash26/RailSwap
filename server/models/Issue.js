const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  stationCode: { type: String, index: true },
  trainNumber: { type: String, index: true },
  category: { type: String },
  location: { type: String }, // e.g., coach/platform
  description: { type: String },
  status: { type: String, default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  resolution: { type: String },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
});

issueSchema.index({ stationCode: 1, status: 1 });

module.exports = mongoose.model('Issue', issueSchema);
