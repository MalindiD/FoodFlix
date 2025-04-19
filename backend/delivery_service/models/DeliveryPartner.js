const mongoose = require('mongoose');

const DeliveryPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  vehicleType: { type: String, enum: ['Bike', 'Car', 'Scooter'], required: true },
  address: { type: String, required: true },
  profileImage: { type: String }, 
  isAvailable: { type: Boolean, default: true },
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPartner', DeliveryPartnerSchema);
