const axios = require('axios');
const Delivery = require('../models/Delivery');
const { assignDeliveryPartner } = require('../services/assignmentService');

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:4000';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5001';

// ✅ Assign a delivery partner and create delivery
// ✅ Assign a delivery partner and create delivery
exports.createAssignment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    // 1. ✅ Check if delivery already exists
    const existingDelivery = await Delivery.findOne({ orderId }).populate('deliveryPartner');
    if (existingDelivery) {
      console.log('⚠️ Delivery already exists, sending reminder notification...');

      // 2. ✅ Send reminder notification
      try {
        await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
          userId: existingDelivery.deliveryPartner._id,
          type: 'both',
          channel: 'delivery',
          title: 'Reminder: Order Assigned',
          message: `You have been assigned to deliver Order #${orderId}.
Location: Latitude ${customerLocation.lat}, Longitude ${customerLocation.lng}.
Please check your dashboard for full delivery instructions.`,
          metadata: {
            email: existingDelivery.deliveryPartner.email,
            phone: existingDelivery.deliveryPartner.phone,
            orderId
          }

        }, {
          headers: {
            Authorization: req.headers.authorization // ✅ Pass along the customer's token
          }

        });
        console.log('✅ Reminder notification sent.');
      } catch (notifErr) {
        console.warn('⚠️ Failed to send reminder notification:', notifErr.message);
      }

      return res.status(200).json({
        message: 'Delivery already existed. Reminder notification sent.',
        delivery: existingDelivery
      });
    }

    // 3. 🔗 Get order details from order-service
    const orderRes = await axios.get(`${ORDER_SERVICE_URL}/api/orders/${orderId}`, {
      headers: { Authorization: req.headers.authorization }
    });

    const order = orderRes.data;

    if (!order || !order.deliveryAddress) {
      return res.status(404).json({ error: 'Order not found or missing delivery address' });
    }

    const customerLocation = order.deliveryAddress;

    // 4. ✅ Assign new delivery partner
    const assignedPartner = await assignDeliveryPartner(orderId, customerLocation);

    // 5. ✅ Create new delivery
    const newDelivery = new Delivery({
      orderId,
      deliveryPartner: assignedPartner._id,
      customerLocation,
      deliveryStatus: 'Pending'
    });

    try {
      await newDelivery.save();
    } catch (saveErr) {
      if (saveErr.code === 11000) {
        console.warn('⚠️ Delivery already created (duplicate detected). Fetching existing one...');
        const alreadySavedDelivery = await Delivery.findOne({ orderId }).populate('deliveryPartner');

        // Send reminder instead
        await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
          userId: alreadySavedDelivery.deliveryPartner._id,
          type: 'both',
          channel: 'delivery',
          title: 'Reminder: Order Assigned',
          message: `Reminder: You are assigned to Order #${orderId}.`,
          metadata: {
            email: alreadySavedDelivery.deliveryPartner.email,
            phone: alreadySavedDelivery.deliveryPartner.phone,
            orderId
          }

        }, {
          headers: {
            Authorization: req.headers.authorization // ✅ Forward the original token
          }
        });

        return res.status(200).json({
          message: 'Delivery already existed (parallel save). Reminder notification sent.',
          delivery: alreadySavedDelivery
        });
      } else {
        throw saveErr; // other errors, crash
      }
    }

    // 6. ✅ Real-time socket notification
    const io = req.app.get('io');
    if (io) {
      io.to(assignedPartner._id.toString()).emit('orderAssigned', {
        message: `🚚 You've been assigned to Order #${orderId}`,
        orderId
      });
      console.log(`📡 Real-time notification sent to partner: ${assignedPartner._id}`);
    }

    // 7. ✅ Send Email + SMS Notification
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
        userId: assignedPartner._id,
        type: 'both',
        channel: 'delivery',
        title: 'New Order Assigned',
        message: `You have been assigned to Order #${orderId}. Please check your dashboard.`,
        metadata: {
          email: assignedPartner.email,
          phone: assignedPartner.phone,
          orderId
        }
      });
      console.log('✅ Email/SMS notification sent.');
    } catch (notifErr) {
      console.warn('⚠️ Failed to send notification:', notifErr.message);
    }

    res.status(201).json({
      message: 'Delivery assigned and partner notified successfully',
      delivery: newDelivery
    });

  } catch (err) {
    console.error('❌ Error in createAssignment:', err.message);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};


// ✅ Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const cleanedStatus = status.trim();

    const delivery = await Delivery.findOneAndUpdate(
      { orderId: req.params.orderId },
      { deliveryStatus: cleanedStatus },
      { new: true }
    ).populate('deliveryPartner');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get delivery details
exports.getDeliveryDetails = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId }).populate('deliveryPartner');
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    res.status(200).json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get tracking status
exports.getDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId }).populate('deliveryPartner');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Manual notification resend
exports.resendNotification = async (req, res) => {
  const { orderId } = req.body;

  try {
    const delivery = await Delivery.findOne({ orderId }).populate('deliveryPartner');

    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications`, {
      userId: delivery.deliveryPartner._id,
      type: 'both',
      channel: 'delivery',
      title: 'Delivery Reminder',
      message: `Reminder: You are assigned to Order #${orderId}`,
      metadata: {
        email: delivery.deliveryPartner.email,
        phone: delivery.deliveryPartner.phone,
        orderId
      }
    });

    res.status(200).json({ message: 'Reminder notification sent successfully' });
  } catch (err) {
    console.error('❌ Error in resendNotification:', err.message);
    res.status(500).json({ error: err.message });
  }
};
