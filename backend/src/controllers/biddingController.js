require("dotenv").config();
const BidderMoney = require("../models/BidderMoney");
const Product = require("../models/Product");
const User = require("../models/User");
const logger = require('../config/logger'); // Import the logger

// Post bid on product
const bidProduct = async (req, res) => {
  const { productId, bidPrice } = req.body;
  try {
    logger.info(`Received bid request: productId=${productId}, bidPrice=${bidPrice}`);
    
    const product = await Product.findById(productId);
    logger.info(`Product found: ${product}`);
    
    const user = await User.findById(req.user);
    logger.info(`User found: ${user}`);
    
    if (!user) {
      logger.warn("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!product) {
      logger.warn("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (bidPrice > user.wallet) {
      logger.warn("User balance is too low");
      return res.status(200).json({ message: "Balance is low" });
    }
    
    if (product.currHighestBid >= bidPrice) {
      logger.warn("Bid price is not higher than the current highest bid");
      return res.status(200).json({ message: "Someone bidded higher" });
    }
    
    user.wallet -= bidPrice;
    
    const updatedBid = await BidderMoney.findOneAndUpdate(
      { username: user.username, productId: product._id },
      { $inc: { amount: bidPrice } }, // Increment amount by bidPrice
    );
    
    if (!updatedBid) {
      const newBid = new BidderMoney({
        username: user.username,
        productId: product._id,
        endTime: product.timeToEnd,
        amount: bidPrice
      });
      await newBid.save();
      logger.info("New bid saved:", newBid);
    } else {
      logger.info("Bid updated:", updatedBid);
    }
    
    product.highestBidder = user._id;
    product.currHighestBid = bidPrice;
    logger.info("Product updated with new highest bid");
    
    await product.save()
      .then(product => {
        logger.info('Product updated successfully:', product);
        // Perform additional actions after successful update (e.g., notify users)
      })
      .catch(err => logger.error('Error updating product:', err));
    
    await user.save()
      .then(user => {
        logger.info('User updated successfully:', user);
        // Perform additional actions after successful update (e.g., notify users)
      })
      .catch(err => logger.error('Error updating user:', err));
    
    res.status(200).json(product);
  } catch (err) {
    logger.error("Server error during bid process:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { bidProduct };
