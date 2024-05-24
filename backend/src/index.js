const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/usersRoute.js');
const walletRoutes = require('./routes/walletRoute.js');
const productRoutes = require('./routes/productRoute.js');
const bidderRoutes = require('./routes/bidderRoute.js');
const logger = require('./config/logger'); // Import the logger
const app = express();
const port = process.env.PORT || 5000;
const connectDb = require('./config/dbConnection.js');
connectDb();

// CORS configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Parse incoming request bodies
app.use(bodyParser.json());

// Log incoming requests
app.use((req, res, next) => {
  logger.info(`HTTP ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/user', userRoutes);
app.use('/wallet', walletRoutes);
app.use('/product', productRoutes);
app.use('/bidder', bidderRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check accessed');
  res.status(200).send('OK');
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  logger.info(`Server listening on port ${port} rolling update test`);
});
