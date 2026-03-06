const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
  pnr: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  trainNumber: { type: String, required: true, index: true },
  coach: { type: String },
  seat: { type: String },
  seatType: { type: String }, // e.g., Lower, Upper, RAC
  travelDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journey', journeySchema);
