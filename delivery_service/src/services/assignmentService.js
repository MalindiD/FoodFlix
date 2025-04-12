const Delivery = require('../models/Delivery');
const DeliveryPartner = require('../models/DeliveryPartner');
const mongoose = require('mongoose');

// Find and assign the best available delivery partner
exports.assignPartner = async (deliveryId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const delivery = await Delivery.findById(deliveryId).session(session);
    
    if (!delivery || delivery.status !== 'pending') {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: 'Invalid delivery or already assigned' };
    }
    
    // Find available partners within 5km of pickup location
    const availablePartners = await DeliveryPartner.find({
      status: 'available',
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: delivery.pickupLocation.coordinates
          },
          $maxDistance: 5000 // 5km in meters
        }
      }
    })
    .sort({ avgRating: -1 }) // Sort by rating
    .limit(1)
    .session(session);
    
    if (availablePartners.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: 'No available delivery partners nearby' };
    }
    
    // Select the partner
    const selectedPartner = availablePartners[0];
    
    // Update delivery with assigned partner
    delivery.partnerId = selectedPartner._id;
    delivery.status = 'assigned';
    delivery.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      notes: `Assigned to partner ${selectedPartner._id}`
    });
    await delivery.save({ session });
    
    // Update partner status
    selectedPartner.status = 'busy';
    selectedPartner.activeDeliveryId = delivery._id;
    await selectedPartner.save({ session });
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    
    // Return assignment result
    return {
      success: true,
      partnerId: selectedPartner._id,
      partnerName: selectedPartner.name
    };
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error('Error assigning partner:', error);
    throw error;
  }
};