const Order = require("../models/Order");
const Restaurant = require("../models/restaurant/Restaurant");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, customerId, items, specialInstructions } = req.body;

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
    const order = await Order.findById(req.params.id)
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

    const order = await Order.findByIdAndUpdate(
      id,
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
    const { restaurantId } = req.params;
    const { status } = req.query;

    const query = { restaurantId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("customerId", "name")
      .populate("items.menuItemId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching restaurant orders",
      error: error.message
    });
  }
};
