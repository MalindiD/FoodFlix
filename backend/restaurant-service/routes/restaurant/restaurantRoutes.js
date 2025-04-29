const express = require("express");
const router = express.Router();
const restaurantController = require("../../controllers/restaurant/restaurantController");
const menuItemRoutes = require("./menuItemRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoutes");
const upload = require("../../middleware/multerConfig");

// Static & Specific routes FIRST
router.get("/", restaurantController.getAllRestaurants);
router.get("/filter", restaurantController.filterByCategoryOrTag);
router.get("/search", restaurantController.searchRestaurants);
router.post("/", restaurantController.createRestaurant);
router.patch("/:id/verify", restaurantController.verifyRestaurant);

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
// ✅ Check restaurant availability by ID
router.get("/:id/status", async (req, res) => {
  try {
    const Restaurant = require("../../models/restaurant/Restaurant"); // ✅ Correct path
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ isAvailable: restaurant.isAvailable });
  } catch (err) {
    console.error("Error checking restaurant availability:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Nested routes
router.use("/:restaurantId/menu-items", menuItemRoutes);
router.use("/:restaurantId/orders", orderRoutes);
router.patch(
  "/:restaurantId/orders/:orderId/pay",
  restaurantController.markOrderAsPaid
);
router.use("/:restaurantId/payments", paymentRoutes);
module.exports = router;
