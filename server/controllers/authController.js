const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.sendCode = async (req, res) => {
  const { email } = req.body;

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  let user = await User.findOne({ email });
  if (!user) user = new User({ email });

  user.verificationCode = code;
  await user.save();

  await sendEmail(email, code);

  res.json({ message: "Verification code sent" });
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.verificationCode !== code)
    return res.status(400).json({ message: "Invalid code" });

  user.isVerified = true;
  user.verificationCode = null;
  await user.save();

  res.json({ message: "Verified successfully" });
};

exports.completeSignup = async (req, res) => {
  const { email, username, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.isVerified)
    return res.status(400).json({ message: "Email not verified" });

  const existingUsername = await User.findOne({ username });
  if (existingUsername)
    return res.status(400).json({ message: "Username taken" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.username = username;

  await user.save();

  res.json({ message: "Signup complete" });
};

exports.login = (req, res) => {
  if (!req.user) {
    return res.status(400).json({
      message: "No user exists, please sign up"
    });
  }

  const token = jwt.sign(
    { id: req.user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
    },
  });
};