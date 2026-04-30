const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // Install via: npm install express-rate-limit
const { sendOTP, verifyAndSignup, login } = require('../controllers/authController');

// 1. Rate Limiter for OTP: Limit to 3 requests per 15 minutes per IP
const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 30, 
  message: { msg: "Too many OTP requests. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Rate Limiter for Login: Prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { msg: "Too many login attempts. Please try again later." }
});

// --- ROUTES ---

// Apply limiter specifically to send-otp to protect your email quota
router.post('/send-otp', otpLimiter, sendOTP);

// Standard signup route (Verify OTP and Create Account)
router.post('/signup', verifyAndSignup);

// Apply limiter to login to prevent password guessing
router.post('/login', loginLimiter, login);

module.exports = router;