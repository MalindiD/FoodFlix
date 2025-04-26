const express = require("express");
const router = express.Router();
const restaurantController = require("../../controllers/restaurant/restaurantController");
const menuItemRoutes = require("./menuItemRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoutes");
const upload = require("../../middleware/multerConfig");

// Restaurant routes
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.post("/", restaurantController.createRestaurant);
router.patch("/:id/verify", restaurantController.verifyRestaurant);

router.put(
  "/:id",
  upload.single("profileImage"),
  restaurantController.updateRestaurant
);
router.delete("/:id", restaurantController.deleteRestaurant);
router.patch("/:id/availability", restaurantController.updateAvailability);

// Nested routes
router.use("/:restaurantId/menu-items", menuItemRoutes);
router.use("/:restaurantId/orders", orderRoutes);
router.patch(
  "/:restaurantId/orders/:orderId/pay",
  restaurantController.markOrderAsPaid
);
router.use("/:restaurantId/payments", paymentRoutes);
module.exports = router;
