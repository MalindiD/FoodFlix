const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/restaurant/adminController");
const { protect, authorize } = require("../../middleware/jwtMiddleware");

// Apply `protect` and restrict access to admin users only
router.use(protect);
router.use(authorize("admin"));

// User account management
router.get("/users", adminController.getAllUsers);
router.patch("/users/:userId/verify", adminController.updateVerification);

//Restaurants
router.get(
  "/restaurants",
  protect,
  authorize("admin"),
  adminController.getAllRestaurants
);
router.patch(
  "/restaurants/:restaurantId/verify",
  protect,
  authorize("admin"),
  adminController.toggleRestaurantVerification
);

// Financial transactions
router.get("/payments", adminController.getAllPayments);
router.get("/payments/summary", adminController.getPaymentSummary);

module.exports = router;
