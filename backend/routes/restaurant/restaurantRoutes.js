const express = require("express");
const router = express.Router();
const restaurantController = require("../../controllers/restaurant/restaurantController");

// Restaurant routes
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.post("/", restaurantController.createRestaurant);
router.put("/:id", restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);
router.patch("/:id/availability", restaurantController.updateAvailability);

module.exports = router;
