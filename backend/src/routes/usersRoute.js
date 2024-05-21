const express = require('express');
const validateToken = require("../middleware/validateTokenHandler.js");
const { signin, signup,currentUser } = require('../controllers/authControllers.js');
const router = express.Router();

// Call back function.
router.post('/signin', signin);
router.post('/signup', signup);
router.get("/current",validateToken, currentUser);
module.exports=router;