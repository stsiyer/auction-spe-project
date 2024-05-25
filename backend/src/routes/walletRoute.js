const express = require('express');
const validateToken = require("../middleware/validateTokenHandler.js");
const { addToWallet } = require('../controllers/walletController.js');
const router = express.Router();

// Call back function.
router.post("/addToWallet",validateToken, addToWallet);
module.exports=router;