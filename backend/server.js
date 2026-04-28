const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// Import your database connection logic
const connectDB = require("./config/db");

// Import Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
// NEW: Import the Payment Route
const paymentRoutes = require("./routes/paymentRoutes"); 

const app = express();

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(cors({
  origin: ["https://mern-ecommerce-eight-olive.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Morgan logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 3. API Routes
app.get("/", (req, res) => {
  res.send("Electronic E-commerce API is running...");
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Product Routes
app.use("/api/products", productRoutes);

// NEW: Payment Routes (Moved here so it's active before the 404 handler)
app.use('/api/payment', paymentRoutes);

console.log("Stripe Key Loaded:", process.env.STRIPE_SECRET_KEY ? "YES" : "NO");

// 4. Handle 404 (Route not found)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// 5. Global Error Handler
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
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});