const express = require('express');
const { addProduct, allProducts,getProduct } = require('../controllers/productControllers.js');
const validateToken = require('../../../user-service/src/middleware/validateTokenHandler.js');
const router = express.Router();

// Call back function.
router.post('/addProduct', validateToken,addProduct,);
router.get('/allProducts',allProducts);
router.get("/:id",getProduct);
module.exports=router;