const User = require("../models/User");
const logger = require('../config/logger'); // Import the logger

const addToWallet = async (req, res) => {
  const { money } = req.body;
  logger.info(`Received add to wallet request: userId=${req.user}, amount=${money}`);
  
  if (money < 1) {
    logger.warn("Attempt to add less than Rs 1 to wallet");
    return res.status(404).json({ message: "Money should be above Rs 1" });
  }
  
  try {
    const user = await User.findById(req.user);
    if (!user) {
      logger.warn(`User not found: userId=${req.user}`);
      return res.status(404).json({ message: "User not found" });
    }
    
    user.wallet += money;
    await user.save();
    logger.info(`User wallet updated successfully: userId=${req.user}, newBalance=${user.wallet}`);
    
    res.status(200).json(user);
  } catch (err) {
    logger.error("Server error during add to wallet process:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { addToWallet };
