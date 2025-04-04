const express = require("express");
const router = express.Router({ mergeParams: true });
const menuItemController = require("../controllers/menuItemController");

// Menu item routes
router.get("/", menuItemController.getMenuItems);
router.get("/:id", menuItemController.getMenuItemById);
router.post("/", menuItemController.createMenuItem);
router.put("/:id", menuItemController.updateMenuItem);
router.delete("/:id", menuItemController.deleteMenuItem);
router.patch(
  "/:id/availability",
  menuItemController.updateMenuItemAvailability
);

module.exports = router;
