const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },

  name: String,

  state: String,

  zone: String,

  latitude: Number,

  longitude: Number

});

module.exports = mongoose.model("Station", stationSchema);
