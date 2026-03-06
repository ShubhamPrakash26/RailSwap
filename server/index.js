const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Passport configuration
require("./passport")(passport);

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});