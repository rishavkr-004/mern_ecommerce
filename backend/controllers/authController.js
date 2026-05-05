const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Temporary storage for OTPs (In production, use Redis)
let otpStore = {}; 

// 1. Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    // Convert email to lowercase to prevent casing discrepancies
    const normalizedEmail = email.toLowerCase();
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiry
    otpStore[normalizedEmail] = { otp, expires: Date.now() + 300000 };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      }
    });

    await transporter.sendMail({
      from: '"Tech Connect" <noreply@techconnect.com>',
      to: normalizedEmail,
      subject: "Your Verification Code",
      text: `Your OTP for Tech Connect is ${otp}. It expires in 5 minutes.`
    });

    res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ msg: "Email failed to send. Check your EMAIL_PASS configuration." });
  }
};

// 2. Verify OTP & Signup
exports.verifyAndSignup = async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ msg: "Please fill in all required fields" });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if OTP exists and is correct
    const record = otpStore[normalizedEmail];
    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email: normalizedEmail, 
      phone, 
      password: hashedPassword 
    });

    await newUser.save();
    
    // Clear OTP from memory after successful signup
    delete otpStore[normalizedEmail];

    res.status(201).json({ msg: "User registered successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ msg: "Registration failed, please try again." });
  }
};

// 3. Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Server Error during login." });
  }
};