const MenuItem = require("../../models/restaurant/MenuItem");

// Get all menu items for a restaurant
exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({
      restaurantId: req.params.restaurantId
    });
    res.status(200).json(menuItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching menu items", error: error.message });
  }
};

// Get menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching menu item", error: error.message });
  }
};

// Create menu item
exports.createMenuItem = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const imageFromFile = req.file ? req.file.path : "";
  const imageFromUrl = req.body.imageUrl || "";

  try {
    const menuItem = new MenuItem({
      ...req.body,
      restaurantId: req.params.restaurantId,
      image: imageFromFile || imageFromUrl // ✅ store whichever is provided
    });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating menu item", error: error.message });
  }
};

// Update menu item
// Update menu item
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;

  const imageFromFile = req.file ? req.file.path : "";
  const imageFromUrl = req.body.imageUrl || "";
  const existingImage = req.body.existingImage || "";

  const finalImage = imageFromFile || imageFromUrl || existingImage; // ✅ fallback logic

  try {
    const updated = await MenuItem.findByIdAndUpdate(
      id,
      {
        ...req.body,
        image: finalImage
      },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Menu item not found" });

    res.status(200).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating menu item", error: error.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndDelete({
      _id: req.params.id,
      restaurantId: req.params.restaurantId
    });
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting menu item", error: error.message });
  }
};

// Update menu item availability
exports.updateMenuItemAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.params.restaurantId },
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating availability", error: error.message });
  }
};
