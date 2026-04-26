const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json()); // Essential for reading JSON from frontend requests

// 2. Import Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes"); // New Auth Routes

// 3. Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// 4. API Routes
app.get("/", (req, res) => {
  res.send("CampusShop API is running...");
});

// Authentication Routes (Login/Signup)
app.use("/api/auth", authRoutes);

// Product Routes
app.use("/api/products", productRoutes);

// 5. Global Error Handler (Optional but recommended)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 6. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});