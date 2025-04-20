const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

// Route files
const paymentRoutes = require('./routes/payment');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable CORS
app.use(cors({
  origin: true, // Reflect request origin - accepts requests from any origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Raw body for Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook/stripe') {
    // Need raw body for Stripe signature verification
    req.rawBody = '';
    req.on('data', (chunk) => {
      req.rawBody += chunk.toString();
    });
    req.on('end', () => {
      next();
    });
  } else {
    // Skip for regular routes to ensure express.json() middleware processes the body
    next();
  }
});

// Mount routers
app.use('/api/payments', paymentRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Add this to server.js or app.js in BOTH services
console.log('JWT Secret first 5 chars:', process.env.JWT_SECRET.substring(0, 5));
console.log('[PAYMENT SERVICE] JWT_SECRET first 5:', process.env.JWT_SECRET?.substring(0, 5));
