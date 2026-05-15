const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register (Direct Signup - No OTP)
exports.register = async (req, res) => {
  try {
    // Destructure data from request body
    const { name, email, phone, password } = req.body;

    // PROFESSIONAL FIX: Added phone to the validation check 
    // and used .trim() to ensure users didn't just enter spaces
    if (!name?.trim() || !email?.trim() || !password || !phone?.trim()) {
      return res.status(400).json({ msg: "Please fill in all required fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ msg: "An account with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and Save User
    const newUser = new User({ 
      name: name.trim(), 
      email: normalizedEmail, 
      phone: phone.trim(), 
      password: hashedPassword 
    });

    await newUser.save();

    // Success response
    res.status(201).json({ 
      success: true,
      msg: "Registration Successful! You can now login." 
    });

  } catch (error) {
    console.error("Registration Error Details:", error); // Log full error for debugging
    res.status(500).json({ msg: "Server error during registration. Please try again." });
  }
};

// 2. Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Find user and include sensitive data for comparison
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ msg: "Invalid Credentials" }); // Generic message for security
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Create Token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret', // Always use env in production
      { expiresIn: '7d' } // Increased to 7 days for better UX
    );

    res.status(200).json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        phone: user.phone 
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};