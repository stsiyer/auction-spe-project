const bcrypt = require('bcrypt');
console.log("bcrypt required");
const jwt = require('jsonwebtoken');
console.log("jsonwebtoken required");
require('dotenv').config();
console.log("dotenv configured");
const jwtSecret = process.env.JWT_SECRET;
console.log("JWT secret obtained from environment variables" + jwtSecret);
const User = require('../models/User');
console.log("User model required");
const signin=async (req, res) => {
  console.log("Entered signin function");
  const { email, password } = req.body;

  // Validate user input (implement proper validation)
  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Find user by email
  try {
    console.log("Trying to find user by email");
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password hashes
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison done");
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const payload = { userId: user._id }; // Include user ID in payload
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    console.log("JWT token generated");

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Signup route
const signup=async (req, res) => {
  console.log("Entered signup function");
  const { username, email, password } = req.body;

  // Validate user input (implement proper validation)
  if (!username || !email || !password) {
    console.log("Missing username, email, or password");
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Check for existing user
  try {
    console.log("Checking for existing user");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: 'Email already in use' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }

  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  console.log("Salt generated");
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Password hashed");

  // Create new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

  try {
    const savedUser = await newUser.save();
    console.log("User saved to database");
    res.json({ message: 'User created successfully', user: savedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const currentUser=async(req,res)=>{
  console.log("Entered currentUser function");
  const user=await User.findById(req.user);
  console.log("User found by ID");
  res.json(user);
};
module.exports={signin,signup,currentUser}; 
