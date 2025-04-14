const express = require("express");
const router = express.Router({ mergeParams: true }); // Important for accessing params from parent router
const orderController = require("../../controllers/restaurant/orderController");

// Order routes for a specific restaurant
router.get("/", orderController.getRestaurantOrders); // Get all orders for this restaurant
router.post("/", orderController.createOrder); // Create a new order for this restaurant
router.get("/:id", orderController.getOrderById); // Get specific order
router.patch("/:id/status", orderController.updateOrderStatus); // Update order status
router.get("/test", (req, res) => {
  res.json({
    message: "Order routes working",
    restaurantId: req.params.restaurantId
  });
});
module.exports = router;
