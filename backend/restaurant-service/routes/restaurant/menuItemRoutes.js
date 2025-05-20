const express = require("express");
const router = express.Router({ mergeParams: true });
const menuItemController = require("../../controllers/restaurant/menuItemController");
const upload = require("../../middleware/multerConfig");

// Create
router.post("/", upload.single("image"), menuItemController.createMenuItem);

// Read
router.get("/", menuItemController.getMenuItems);
router.get("/:id", menuItemController.getMenuItemById);

// Update
router.patch("/:id", upload.single("image"), menuItemController.updateMenuItem);

// Delete
router.delete("/:id", menuItemController.deleteMenuItem);

// Update availability
router.patch(
  "/:id/availability",
  menuItemController.updateMenuItemAvailability
);

module.exports = router;
