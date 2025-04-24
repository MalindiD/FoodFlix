const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner'
  },
  customerLocation: {
    lat: Number,
    lng: Number
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Accepted', 'Picked Up', 'On The Way', 'Delivered'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', DeliverySchema);
