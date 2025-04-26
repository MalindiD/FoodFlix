const Payment = require("../../models/restaurant/Payment");
const Order = require("../../models/Order");

exports.getAllPaymentsByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const payments = await Payment.find({ restaurant: restaurantId }).populate(
      "order"
    );
    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching all payments for restaurant:", err);
    res.status(500).json({ message: "Failed to fetch payment records" });
  }
};

exports.getPaymentByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const payment = await Payment.findOne({ order: orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching payment", error: err.message });
  }
};
