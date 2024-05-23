const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
const userRoutes = require('./routes/usersRoute.js');
const walletRoutes = require('./routes/walletRoute.js');
const productRoutes = require('./routes/productRoute.js');
const bidderRoutes = require('./routes/bidderRoute.js');
const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port
const connectDb = require("./config/dbConnection.js");
connectDb();

// CORS configuration
// CORS configuration
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Include OPTIONS method
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  

// Parse incoming request bodies
app.use(bodyParser.json());

// Routes
app.use('/user', userRoutes);
app.use('/wallet', walletRoutes);
app.use('/product', productRoutes);
app.use('/bidder', bidderRoutes); // Fix the endpoint for bidderRoutes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`Server listening on port ${port} rolling update test`));
