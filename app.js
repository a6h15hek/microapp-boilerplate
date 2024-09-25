var path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, `.env.${process.env.NODE_ENV.trim()}`);
console.info('Configuring to .env file: '+ envPath);
dotenv.config({ path: envPath });


const { authenticationCheck } = require('@services/authentication');
const { morganLogStream } = require('@root/console');
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moment = require('moment');
var cors = require('cors');


// Customizing Morgan formatter to include timestamp, method, url, status, content-length, and response time
logger.token('timestamp', () => moment().format('YYYY-MM-DD HH:mm:ss'));
logger.format('myFormat', ':method :url :status :res[content-length] - :response-time ms');

// Define routers for different paths
var actuatorRouter = require('@routes/actuator');
var helloRouter = require('@routes/hello');
var authenticationRouter = require('@routes/authentication');

var app = express();

// Log requests with Morgan using custom format
console.log("Setting up logger");
app.use(logger('myFormat', { stream: morganLogStream }));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(","), // replace with your actual origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // include all methods your client might use
  allowedHeaders: ['Content-Type'], // allow any headers your client might send
  credentials: true // include if you use cookies
}));

// Parse request bodies and cookies
console.log("Setting up request body and cookie parsers");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from 'public' directory
console.log("Setting up static file server");
app.use(express.static(path.join(__dirname, 'views/build')));

// Use defined routers
console.info("Setting up actuatorRouter for the '/actuator' path");
app.use('/actuator', actuatorRouter);
console.info("Setting up authenticationRouter for the '/auth' path");
app.use('/auth', authenticationRouter);
console.info("Setting up helloRouter for the '/hello' path with authentication");
app.use('/hello', authenticationCheck , helloRouter);


// Error handling: forward 404 errors to error handler
console.log("Setting up 404 error forwarder");
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler: define responses for different types of errors
console.log("Setting up error handler");
app.use(function(err, req, res, next) {
  // Provide detailed error in development environment
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render error page with appropriate status
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message
  });
});

console.log("Express server setup finished");

module.exports = app; // Export app for use in server.js
