require("dotenv").config();
const User = require("../models/User");
const Product = require("../models/Product");
//Get All Products
const allProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
};
//Get Product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//Add a Product
const addProduct = async (req, res) => {
  console.log(req.body);
  const { productName, description, image, timeToEnd, minBid } =req.body;
  console.log(req.body);
  // Validate user input (implement proper validation)
  if (!productName || !description || !image || !timeToEnd || !minBid ) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  console.log(Date.now());
  const currentTime=Date.now();
  if(new Date(timeToEnd).getTime() < currentTime){
    return res.status(400).json({ message: "Please fill valid Time to End the Auction!" });
  }
  const newProduct=new Product({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { allProducts , addProduct, getProduct};
