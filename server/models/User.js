const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, sparse: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
});

module.exports = mongoose.model("User", userSchema);