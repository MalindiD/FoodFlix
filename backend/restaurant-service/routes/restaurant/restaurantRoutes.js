const express = require("express");
const router = express.Router();
const restaurantController = require("../../controllers/restaurant/restaurantController");
const menuItemRoutes = require("./menuItemRoutes");
const orderRoutes = require("./orderRoutes");
const upload = require("../../middleware/multerConfig");

// Restaurant routes
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.post("/", restaurantController.createRestaurant);
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

module.exports = router;
