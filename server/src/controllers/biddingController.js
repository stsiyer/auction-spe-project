require("dotenv").config();
const BidderMoney = require("../models/BidderMoney");
const Product = require("../models/Product");
const User = require("../models/User");
//Post bid on product
const bidProduct = async (req, res) => {
  const { productId, bidPrice } = req.body;
  try {
    const product=await Product.findById(productId);
    console.log(product);
    const user = await User.findById(req.user);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
    if (bidPrice > user.wallet) {
      return res.status(404).json({ message: "Balance is low" });
    }
    if (product.currHighestBid >= bidPrice) {
      return res.status(404).json({ message: "Someone bidded higher" });
    }
    user.wallet -= bidPrice;
    const updatedBid = await BidderMoney.findOneAndUpdate(
        { username: user.username, productId: product._id },
        { $inc: { amount: bidPrice } }, // Increment amount by bidPrice
      );
      if(!updatedBid){
        const newBid=new BidderMoney({
            username:user.username,
            productId:product._id,
            endTime:product.timeToEnd,
            amount:bidPrice
        });
        await newBid.save();
      }
    product.highestBidder = user._id;
    product.currHighestBid = bidPrice;
    console.log(product);
    await product.save()
    .then(product => {
      console.log('Product updated successfully:', product);
      // Perform additional actions after successful update (e.g., notify users)
    })
    .catch(err => console.error('Error updating product:', err));
    await user.save()
    .then(user => {
        console.log('User updated successfully:', user);
        // Perform additional actions after successful update (e.g., notify users)
      })
      .catch(err => console.error('Error updating user:', err));
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports = { bidProduct };
