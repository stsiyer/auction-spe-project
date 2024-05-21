const express = require('express');
const { bidProduct } = require('../controllers/biddingController.js');
const validateToken = require('../middleware/validateTokenHandler.js');
const router = express.Router();

// Call back function.
router.post('/bidProduct', validateToken,bidProduct);
module.exports=router;