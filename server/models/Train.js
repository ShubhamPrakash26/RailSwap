const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema({

  number: {
    type: String,
    required: true,
    unique: true
  },

  name: String,

  type: String,

  runningDays: [String]

});

module.exports = mongoose.model("Train", trainSchema);
