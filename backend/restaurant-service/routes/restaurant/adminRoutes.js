const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/restaurant/adminController");
const { protect, authorize } = require("../../middleware/jwtMiddleware");

// Apply per route
router.get("/users", protect, authorize("admin"), adminController.getAllUsers);
router.patch(
  "/users/:userId/verify",
  protect,
  authorize("admin"),
  adminController.updateVerification
);

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

router.get(
  "/payments",
  protect,
  authorize("admin"),
  adminController.getAllPayments
);
router.get(
  "/payments/summary",
  protect,
  authorize("admin"),
  adminController.getPaymentSummary
);

module.exports = router;
