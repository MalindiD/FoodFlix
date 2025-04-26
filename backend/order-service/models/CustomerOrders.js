// models/CustomerOrder.js
const mongoose = require('mongoose');

const CustomerOrderSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true
  },
  restaurantId: {
    type: String,
    required: true
  },
  items: [{
    menuItemId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt field
CustomerOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CustomerOrder', CustomerOrderSchema);