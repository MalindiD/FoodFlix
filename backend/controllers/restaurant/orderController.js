const Order = require("../../models/Order");
const Restaurant = require("../../models/restaurant/Restaurant");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    // Get restaurantId from URL params or request body
    const restaurantId = req.params.restaurantId || req.body.restaurantId;
    const { customerId, items, specialInstructions } = req.body;

    // Validate restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Calculate total price
    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create order
    const order = new Order({
      restaurantId,
      customerId,
      items,
      totalPrice,
      status: "Pending",
      specialInstructions
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      message: "Error creating order",
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.params.restaurantId;

    // Include restaurantId in query if it's available in params
    const query = { _id: id };
    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    const order = await Order.findOne(query)
      .populate("restaurantId", "name")
      .populate("items.menuItemId", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order",
      error: error.message
    });
  }
};

// Update order status (for restaurant)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.params.restaurantId;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Out for Delivery",
      "Completed",
      "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    // Include restaurantId in query if it's available in params
    const query = { _id: id };
    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    const order = await Order.findOneAndUpdate(
      query,
      {
        status,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date()
          }
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({
      message: "Error updating order status",
      error: error.message
    });
  }
};

// Get orders for a specific restaurant
exports.getRestaurantOrders = async (req, res) => {
  try {
    console.log("Request params:", req.params);
    const { restaurantId } = req.params;
    const { status } = req.query;

    console.log("Restaurant ID:", restaurantId);
    console.log("Status filter:", status);

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    console.log("Attempting to find orders with query:", {
      restaurantId,
      status
    });

    try {
      const orders = await Order.find({ restaurant: restaurantId });

      console.log("Query result:", orders);

      res.status(200).json(orders);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({
        message: "Database error when fetching orders",
        error: dbError.message
      });
    }
  } catch (error) {
    console.error("Error in getRestaurantOrders:", error);
    res.status(500).json({
      message: "Error fetching restaurant orders",
      error: error.message
    });
  }
};
