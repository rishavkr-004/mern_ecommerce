const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/authController');

// 1. Rate Limiter for Signup: Prevent bot spam (5 accounts per hour per IP)
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, 
  message: { msg: "Too many accounts created from this IP. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Rate Limiter for Login: Prevent brute-force (10 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { msg: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- ROUTES ---

// Direct Signup Route (Replaces send-otp and verifyAndSignup)
router.post('/signup', signupLimiter, register);

// Login Route
router.post('/login', loginLimiter, login);

module.exports = router;