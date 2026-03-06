const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  journey: { type: mongoose.Schema.Types.ObjectId, ref: 'Journey', required: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  trainNumber: { type: String, required: true, index: true },
  coach: { type: String },
  seat: { type: String },
  seatType: { type: String },
  desiredSeatType: { type: String },
  desiredCoach: { type: String },
  status: { type: String, enum: ['open','paired','accepted','rejected','cancelled'], default: 'open' },
  pairedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest' }],
  createdAt: { type: Date, default: Date.now }
});

// When two RACs are grouped into a confirmed allocation, mark confirmed
swapRequestSchema.add({ confirmed: { type: Boolean, default: false }, confirmationNote: String });

swapRequestSchema.index({ trainNumber: 1, seatType: 1, status: 1 });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
