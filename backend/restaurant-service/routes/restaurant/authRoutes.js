const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multerConfig");
const {
  registerRestaurant,
  loginRestaurant
} = require("../../controllers/restaurant/restaurantAuthController");

console.log(" authRoutes file loaded");

router.get("/ping", (req, res) => {
  res.send(" Pong");
});

router.post(
  "/restaurantregister",
  upload.single("profileImage"),
  registerRestaurant
);
router.post("/restaurantlogin", loginRestaurant);

module.exports = router;
