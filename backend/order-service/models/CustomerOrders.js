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
  totalPrice: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Cooking', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  statusHistory: [
    {
      status: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  specialInstructions: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },
  paidAt: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ["stripe", "paypal"],
    default: "stripe"
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
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CustomerOrder', CustomerOrderSchema);