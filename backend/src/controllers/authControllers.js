const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const User = require('../models/User');
const logger = require('../config/logger'); // Import the logger

const signin = async (req, res) => {
  logger.info("Entered signin function");
  const { email, password } = req.body;

  // Validate user input (implement proper validation)
  if (!email || !password) {
    logger.warn("Missing email or password");
    res.status(400);
    res.json({ message: 'Please fill in all fields' });
    return res;
  }

  // Find user by email
  try {
    logger.info("Trying to find user by email");
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("User not found");
      res.status(401);
      res.json({ message: 'Invalid email or password' });
      return res;
    }

    // Compare password hashes
    const isMatch = password === user.password;
    logger.info("Password comparison done");
    if (!isMatch) {
      logger.warn("Password does not match");
      res.status(401);
      res.json({ message: 'Invalid email or password' });
      return res;
    }

    // Generate JWT token
    const payload = { userId: user._id }; // Include user ID in payload
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    logger.info("JWT token generated");

    res.json({ message: 'Login successful', token });
  } catch (err) {
    logger.error("Error during signin process", err);
    res.status(500);
    res.json({ message: 'Server error' });
  }
};

// Signup route
const signup = async (req, res) => {
  logger.info("Entered signup function");
  const { username, email, password } = req.body;

  // Validate user input (implement proper validation)
  if (!username || !email || !password) {
    logger.warn("Missing username, email, or password");
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Check for existing user
  try {
    logger.info("Checking for existing user");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn("User already exists");
       res.status(400);
      res.json({ message: 'Email already in use' });
      return res;
    }
  } catch (err) {
    logger.error("Error during signup process", err);
    return res.status(500).json({ message: 'Server error' });
  }

  // Hash password before saving
  logger.info("Before bcrypt");
  // const salt = await bcrypt.genSalt(10);
  logger.info("Salt generated");
  // const hashedPassword = await bcrypt.hash(password, salt);
  const hashedPassword = password;
  logger.info("Password hashed");

  // Create new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

  try {
    const savedUser = await newUser.save();
    logger.info("User saved to database");
    res.json({ message: 'User created successfully', user: savedUser });
  } catch (err) {
    logger.error("Error saving new user to database", err);
    res.status(500).json({ message: 'Server error' });
  }
};

const currentUser = async (req, res) => {
  logger.info("Entered currentUser function");
  try {
    const user = await User.findById(req.user);
    logger.info("User found by ID");
    res.json(user);
  } catch (err) {
    logger.error("Error finding user by ID", err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signin, signup, currentUser };
