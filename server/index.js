const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");
const routeRoutes = require("./routes/routes");
const communityRoutes = require("./routes/community");
const swapRoutes = require('./routes/swap');
const faqRoutes = require('./routes/faq');
const updatesRoutes = require('./routes/updates');
const reviewRoutes = require('./routes/review');
const adminRoutes = require('./routes/admin');

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
app.use('/api/swap', swapRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/updates', updatesRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});