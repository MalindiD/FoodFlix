const User = require("../../models/restaurant/User");
const Payment = require("../../models/restaurant/Payment");
const Restaurant = require("../../models/restaurant/Restaurant");

// Get all users (optional role filter)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};
//deactivate user by admin
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const updated = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deactivated successfully", user: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Deactivation failed", error: err.message });
  }
};

//get Restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch restaurants", error: error.message });
  }
};
//toggle Restaurant Verification
exports.toggleRestaurantVerification = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.isVerified = !restaurant.isVerified;
    await restaurant.save();

    res.json({
      message: "Restaurant verification updated successfully",
      restaurant
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update verification", error: error.message });
  }
};

// Toggle verification for delivery/restaurant users
exports.updateVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user || !["restaurant", "delivery"].includes(user.role)) {
      return res
        .status(404)
        .json({ message: "User not found or invalid role" });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({ message: "Verification status updated", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating verification", error: error.message });
  }
};

// Get all payments (optional filter by status)
exports.getAllPayments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const payments = await Payment.find(filter).populate("order user");
    res.json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch payments", error: error.message });
  }
};

// Get summary of payments
exports.getPaymentSummary = async (req, res) => {
  try {
    const summary = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);
    const overall = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    res.json({
      summary,
      overall: overall[0] || { totalRevenue: 0, totalTransactions: 0 }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch summary", error: error.message });
  }
};
