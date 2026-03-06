const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");
const routeRoutes = require("./routes/routes");
const communityRoutes = require("./routes/community");

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use("/api/data", dataRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/community", communityRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});