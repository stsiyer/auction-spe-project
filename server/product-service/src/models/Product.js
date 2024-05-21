const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  timeToEnd: {
    type: Date,
    required: true
  },
  listedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  minBid:{
    type:Number,
    required:true
  },
  currHighestBid:{
    type:Number,
    required:false,
    default:0
  },
  timeStarted:{
    type:Date,
    required:false,
    default:Date.now
  },
  highestBidder:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('Product', productSchema);