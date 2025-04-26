const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DeliveryPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ✅ new field
  vehicleType: { type: String, enum: ['Bike', 'Car', 'Scooter'], required: true },
  address: { type: String, required: true },
  profileImage: { type: String },
  isAvailable: { type: Boolean, default: true },
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  role: { type: String, default: 'delivery' }
}, { timestamps: true });

// ✅ Hash password before saving
DeliveryPartnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('DeliveryPartner', DeliveryPartnerSchema);
