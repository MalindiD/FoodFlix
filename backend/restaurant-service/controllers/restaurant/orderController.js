const CustomerOrder = require("../../models/CustomerOrders");
const Restaurant = require("../../models/restaurant/Restaurant");

// Create a new order

exports.createOrder = async (req, res) => {
  try {
    const { customerId, items, totalPrice, status, specialInstructions } =
      req.body;
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res
        .status(400)
        .json({ message: "Restaurant ID is required in the URL" });
    }

    // Create the order with restaurant set from route param
    const newOrder = new CustomerOrder({
      restaurantId: restaurantId,
      customerId,
      items,
      totalPrice,
      status,
      specialInstructions
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res
      .status(400)
      .json({ message: "Error creating order", error: error.message });
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

    // const order = await CustomerOrder.findOne(query)
    //   .populate("restaurantId", "name")
    //   .populate("items.menuItemId", "name");
    const order = await CustomerOrder.findOne(query).populate(
      "items.menuItemId",
      "name"
    );

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
  console.log("📦 PATCH hit with:", req.params, req.body);

  try {
    const { orderId } = req.params;
    const restaurantId = req.params.restaurantId;
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Cooking",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const query = { _id: orderId };
    if (restaurantId) {
      query.restaurantId = restaurantId; // ✅ keep as String
    }

    const order = await CustomerOrder.findOneAndUpdate(
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
      const orders = await CustomerOrder.find({ restaurantId: restaurantId });

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
