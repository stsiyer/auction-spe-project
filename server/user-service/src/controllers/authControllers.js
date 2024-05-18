const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For generating tokens
const asyncHandler=require("express-async-handler");
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const User = require('../models/User');
const signin=async (req, res) => {
  const { email, password } = req.body;

  // Validate user input (implement proper validation)
  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Find user by email
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password hashes
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const payload = { userId: user._id }; // Include user ID in payload
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Signup route
const signup=async (req, res) => {
    const { username, email, password } = req.body;
  
    // Validate user input (implement proper validation)
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
  
    // Check for existing user
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
  
    try {
      const savedUser = await newUser.save();
      res.json({ message: 'User created successfully', user: savedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
const currentUser=async(req,res)=>{
  const user=await User.findById(req.user);
    res.json(user);
};
module.exports={signin,signup,currentUser};