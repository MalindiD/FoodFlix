const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
    default: null
  },
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  dropoffLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'failed'],
    default: 'pending'
  },
  estimatedPickupTime: Date,
  actualPickupTime: Date,
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'failed']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', DeliverySchema);