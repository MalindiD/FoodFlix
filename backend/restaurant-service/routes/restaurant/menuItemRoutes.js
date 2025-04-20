const express = require("express");
const router = express.Router({ mergeParams: true });
const menuItemController = require("../../controllers/restaurant/menuItemController");

// ✅ Import multer middleware
const upload = require("../../middleware/multerConfig");

// ✅ Enable image upload
router.post("/", upload.single("image"), menuItemController.createMenuItem);

router.get("/", menuItemController.getMenuItems);
router.get("/:id", menuItemController.getMenuItemById);
router.patch("/:id", upload.single("image"), menuItemController.updateMenuItem);

router.patch("/:id", upload.single("image"), menuItemController.updateMenuItem);

router.delete("/:id", menuItemController.deleteMenuItem);
router.patch(
  "/:id/availability",
  menuItemController.updateMenuItemAvailability
);

module.exports = router;
