const Restaurant = require("../../models/restaurant/Restaurant");

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching restaurants", error: error.message });
  }
};

// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching restaurant", error: error.message });
  }
};

// Create restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating restaurant", error: error.message });
  }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  try {
    const imageFromFile = req.file ? req.file.path : "";
    const imageFromUrl = req.body.imageUrl || "";
    const existingImage = req.body.existingImage || "";

    const finalImage = imageFromFile || imageFromUrl || existingImage;

    const updateData = {
      ...req.body,
      profileImage: finalImage
    };

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({
      message: "Error updating restaurant",
      error: error.message
    });
  }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting restaurant", error: error.message });
  }
};

// Update restaurant availability
exports.updateAvailability = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating availability", error: error.message });
  }
};
