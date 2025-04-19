const Delivery = require('../models/Delivery');
const DeliveryPartner = require('../models/DeliveryPartner');
const calculateDistance = require('../utils/distanceCalculator');

exports.assignDeliveryPartner = async (orderId, customerLocation) => {
  const partners = await DeliveryPartner.find({ isAvailable: true });

  if (partners.length === 0) {
    throw new Error('No available delivery partners');
  }

  // Find closest partner
  let closestPartner = null;
  let minDistance = Infinity;

  for (let partner of partners) {
    const { lat, lng } = partner.currentLocation;
    const dist = calculateDistance(
      customerLocation.lat,
      customerLocation.lng,
      lat,
      lng
    );

    if (dist < minDistance) {
      minDistance = dist;
      closestPartner = partner;
    }
  }

  if (!closestPartner) {
    throw new Error('Could not find a suitable delivery partner');
  }

  // Create delivery
  const newDelivery = await Delivery.create({
    orderId,
    deliveryPartner: closestPartner._id,
    customerLocation,
    deliveryStatus: 'Pending'
  });

  // Mark partner as unavailable
  closestPartner.isAvailable = false;
  await closestPartner.save();

  return newDelivery;
};
