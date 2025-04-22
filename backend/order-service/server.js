// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config/db');
const { connectQueue, consumeFromQueue } = require('./utils/messageQueue');
require('dotenv').config();


// Connect to Database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', require('./routes/order-routes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Connect to message queue and listen for messages
const setupMessageConsumers = async () => {
  try {
    await connectQueue();
    
    // Listen for payment notifications
    consumeFromQueue('payment_notifications', async (message) => {
      const { type, orderId, status } = message;
      
      if (type === 'PAYMENT_UPDATED') {
        try {
          const Order = require('./models/CustomerOrder');
          const order = await Order.findById(orderId);
          
          if (order) {
            // order.paymentStatus = status;
            
            // If payment completed, update order status to Confirmed
            if (status === 'Completed' && order.status === 'Pending') {
              order.status = 'Confirmed';
            }
            
            await order.save();
            console.log(`Updated payment status for order ${orderId} to ${status}`);
          }
        } catch (error) {
          console.error(`Error processing payment notification for order ${orderId}:`, error);
        }
      }
    });
    
    // Listen for delivery status updates
    consumeFromQueue('delivery_notifications', async (message) => {
      const { type, orderId, status } = message;
      
      if (type === 'DELIVERY_STATUS_UPDATED') {
        try {
          const Order = require('./models/CustomerOrder');
          const order = await Order.findById(orderId);
          
          if (order) {
            if (status === 'PICKED_UP') {
              order.status = 'Out for Delivery';
            } else if (status === 'DELIVERED') {
              order.status = 'Delivered';
            }
            
            await order.save();
            console.log(`Updated order status for ${orderId} based on delivery status: ${status}`);
          }
        } catch (error) {
          console.error(`Error processing delivery notification for order ${orderId}:`, error);
        }
      }
    });
    
  } catch (error) {
    console.error('Error setting up message consumers:', error);
  }
};

// Start the server
// const PORT = config.PORT;
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Order Management Service running on port ${PORT}`);
  // setupMessageConsumers();
});