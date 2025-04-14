import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Replace this with the actual restaurant ID from authentication/context
  const restaurantId = "67e5a6f867431037543a038b"; // Example restaurant ID

  useEffect(() => {
    // Fetch orders for this restaurant
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/restaurants/${restaurantId}/orders`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch orders: " + err.message);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up polling to refresh orders every 30 seconds
    const intervalId = setInterval(fetchOrders, 30000);

    return () => clearInterval(intervalId);
  }, [restaurantId]);

  // Function to handle order status updates
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/restaurants/${restaurantId}/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();

      // Update the local state to reflect the change
      setOrders(
        orders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Function to get appropriate status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Preparing":
        return "bg-indigo-100 text-indigo-800";
      case "Ready":
        return "bg-green-100 text-green-800";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Restaurant Management Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/restaurant-management/restaurants"
          className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <h2 className="text-xl font-semibold">Restaurant Profile</h2>
          <p>View and edit restaurant details</p>
        </Link>

        <Link
          to="/restaurant-management/menu-items"
          className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <p>Manage your restaurant's menu</p>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items.length} items
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items.slice(0, 2).map((item, index) => (
                          <span key={index} className="block truncate">
                            {item.quantity}x {item.name || "(Unnamed item)"}
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-gray-400">
                            + {order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, "Confirmed")
                            }
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, "Cancelled")
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === "Confirmed" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(order._id, "Preparing")
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === "Preparing" && (
                        <button
                          onClick={() => handleUpdateStatus(order._id, "Ready")}
                          className="text-green-600 hover:text-green-900"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === "Ready" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(order._id, "Out for Delivery")
                          }
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Send for Delivery
                        </button>
                      )}
                      {order.status === "Out for Delivery" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(order._id, "Completed")
                          }
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Complete Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
