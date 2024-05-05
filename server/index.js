const express = require('express');
const connectDB = require('./config/db');
const app = express();
var server = require('http').Server(app);
const io = require('socket.io')(server);
const { specs, swaggerUi } = require('./config/swaggerConfig'); 
// const AppError = require('./utils/appError');

const dotenv = require('dotenv').config({ path: './config.env' });

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false })); //allows us to get the data on req.body

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Define Routes
// app.use('/api/users', require('./routes/api/userRouter'));
// app.use('/api/listings', require('./routes/api/listingRouter'));
// app.use('/api/auth', require('./routes/api/authRouter'));
// app.use('/api/review', require('./routes/api/reviewRouter'));
// app.use('/api/report', require('./routes/api/reportRouter'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));


module.exports = server;
