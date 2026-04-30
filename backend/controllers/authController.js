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
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiry
    otpStore[email] = { otp, expires: Date.now() + 300000 };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      }
    });

    await transporter.sendMail({
      from: '"Tech Connect" <noreply@techconnect.com>',
      to: email,
      subject: "Your Verification Code",
      text: `Your OTP for Tech Connect is ${otp}. It expires in 5 minutes.`
    });

    res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ msg: "Email failed to send. Check your EMAIL_PASS." });
  }
};

// 2. Verify OTP & Signup
exports.verifyAndSignup = async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    // Check if OTP exists and is correct
    const record = otpStore[email];
    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User already exists" });

    // CRITICAL: Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email, 
      phone, 
      password: hashedPassword 
    });

    await newUser.save();
    
    // Clear OTP from memory
    delete otpStore[email];

    res.status(201).json({ msg: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 3. Login (Needed to prevent the 'handler must be a function' error)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};