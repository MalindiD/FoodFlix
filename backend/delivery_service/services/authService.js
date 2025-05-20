const authService = require('../services/authService');

// Fetch available partners
exports.getAvailablePartners = async (req, res, next) => {
  try {
    const { longitude, latitude } = req.query; // Coordinates for filtering
    const token = req.headers.authorization.split(' ')[1]; // Get JWT token from headers

    if (!longitude || !latitude) {
      return res.status(400).json({ success: false, message: 'Coordinates are required for filtering' });
    }

    // Fetch user info from the auth-service using the token
    const userInfo = await authService.getUser(req.user.id, token);

    console.log('User Info from Auth Service:', userInfo);

    // Continue with your logic to find available partners within the coordinates
    const partners = await DeliveryPartner.find({
      status: 'available',
      currentLocation: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: 5000 // 5km
        }
      }
    });

    res.status(200).json({ success: true, data: partners });
  } catch (error) {
    console.error('Error fetching available partners:', error);
    res.status(500).json({ success: false, message: 'Error fetching partners' });
  }
};
