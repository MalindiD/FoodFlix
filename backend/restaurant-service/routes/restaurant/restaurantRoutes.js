const express = require("express");
const router = express.Router();
const restaurantController = require("../../controllers/restaurant/restaurantController");
const menuItemRoutes = require("./menuItemRoutes");
const orderRoutes = require("./orderRoutes");
const upload = require("../../middleware/multerConfig");

// Static & Specific routes FIRST
router.get("/", restaurantController.getAllRestaurants);
router.get("/filter", restaurantController.filterByCategoryOrTag);
router.get("/search", restaurantController.searchRestaurants);
router.post("/", restaurantController.createRestaurant);

// CRUD routes using :id NEXT
router.put(
  "/:id",
  upload.single("profileImage"),
  restaurantController.updateRestaurant
);
router.delete("/:id", restaurantController.deleteRestaurant);
router.patch("/:id/availability", restaurantController.updateAvailability);
router.get("/:id", restaurantController.getRestaurantById);

// Nested routes LAST
router.use("/menu-items", menuItemRoutes); 
router.use("/:restaurantId/menu-items", menuItemRoutes);
router.use("/:restaurantId/orders", orderRoutes);

module.exports = router;
