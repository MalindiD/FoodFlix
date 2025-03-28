const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/restaurant/orderController");

// Order routes for restaurants
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", orderController.updateOrderStatus);
router.get("/restaurant/:restaurantId", orderController.getRestaurantOrders);

module.exports = router;
