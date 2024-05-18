const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const productRoutes =require('./routes/productRoute.js');
const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port
const connectDb = require("./config/dbConnection.js");
connectDb();
// Parse incoming request bodies
app.use(bodyParser.json());
app.use(cors());

app.use('/product', productRoutes);
app.listen(port, () => console.log(`Server listening on port ${port}`));