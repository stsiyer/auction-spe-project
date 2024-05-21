const mongoose = require('mongoose');

const bidderMoneySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
    unique:true
  },
  endTime:{
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('BidderMoney', bidderMoneySchema);