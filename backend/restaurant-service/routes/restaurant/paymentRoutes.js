const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/restaurant/paymentController");

// Get ALL payments for a restaurant
router.get(
  "/:restaurantId/payments",
  paymentController.getAllPaymentsByRestaurant
);

// Get payment for a specific order
router.get(
  "/:restaurantId/payments/:orderId",
  paymentController.getPaymentByOrderId
);

module.exports = router;
