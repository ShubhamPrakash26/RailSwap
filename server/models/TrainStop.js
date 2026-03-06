const mongoose = require("mongoose");

const trainStopSchema = new mongoose.Schema({

  trainNumber: String,

  stationCode: String,

  arrivalTime: String,

  departureTime: String,

  stopNumber: Number,

  distance: Number

});

// Indexes to speed up queries
trainStopSchema.index({ stationCode: 1 });
trainStopSchema.index({ trainNumber: 1 });

module.exports = mongoose.model("TrainStop", trainStopSchema);
