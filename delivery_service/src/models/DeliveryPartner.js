const mongoose = require('mongoose');

const DeliveryPartnerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'car', 'scooter'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  avgRating: {
    type: Number,
    default: 0
  },
  activeDeliveryId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
DeliveryPartnerSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('DeliveryPartner', DeliveryPartnerSchema);