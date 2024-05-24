require("dotenv").config();
const User = require("../models/User");
const Product = require("../models/Product");
const logger = require('../config/logger'); // Import the logger

// Get All Products
const allProducts = async (req, res) => {
  try {
    logger.info("Fetching all products");
    const products = await Product.find({});
    res.status(200).json(products);
    logger.info("All products fetched successfully");
  } catch (err) {
    logger.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Product
const getProduct = async (req, res) => {
  try {
    logger.info(`Fetching product with ID: ${req.params.id}`);
    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.warn(`Product not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
    logger.info(`Product fetched successfully with ID: ${req.params.id}`);
  } catch (err) {
    logger.error("Error fetching product:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add a Product
const addProduct = async (req, res) => {
  logger.info("Entered addProduct function");
  const { productName, description, image, timeToEnd, minBid } = req.body;
  logger.info("Product details received:", { productName, description, image, timeToEnd, minBid });

  // Validate user input (implement proper validation)
  if (!productName || !description || !image || !timeToEnd || !minBid) {
    logger.warn("Missing fields in product details");
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const currentTime = Date.now();
  if (new Date(timeToEnd).getTime() < currentTime) {
    logger.warn("Invalid time to end the auction");
    return res.status(400).json({ message: "Please fill valid Time to End the Auction!" });
  }

  const newProduct = new Product({
    productName,
    description,
    image,
    timeToEnd,
    minBid,
    listedBy: req.user
  });

  try {
    const savedProduct = await newProduct.save();
    res.json({ message: "Product added successfully", product: savedProduct });
    logger.info("Product added successfully:", savedProduct);
  } catch (err) {
    logger.error("Error adding product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { allProducts, addProduct, getProduct };
