const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

// Import database connection
const connectDB = require("./config/db");

// Import Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); 

const app = express();

// 1. Trust Proxy
app.set("trust proxy", 1);

// 2. Connect to Database
connectDB();

// 3. Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Set to false if you experience issues with external images/scripts
}));

// Robust CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://mern-ecommerce-eight-olive.vercel.app",
      "https://mern-ecommerce-eight.vercel.app",
      "http://localhost:3000"
    ];
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 4. API Routes
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Tech Connect API is online." });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payment", paymentRoutes);

// 5. Handle 404
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? "🥞" : err.stack,
  });
});

// 7. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("Stripe Key Status:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "Missing");
  console.log("SendGrid Key Status:", process.env.EMAIL_PASS ? "Loaded" : "Missing");
});