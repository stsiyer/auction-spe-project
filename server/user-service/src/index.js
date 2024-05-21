const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const userRoutes =require('./routes/usersRoute.js');
const walletRoutes =require('./routes/walletRoute.js');
const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port
const connectDb = require("./config/dbConnection.js");
connectDb();
// Parse incoming request bodies
app.use(bodyParser.json());
app.use(cors());

app.use('/user', userRoutes);
app.use('/wallet', walletRoutes);
app.listen(port, () => console.log(`Server listening on port ${port}`));