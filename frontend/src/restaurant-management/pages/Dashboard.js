import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import renderOrdersTable from "../components/orders/renderOrdersTable";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const restaurantId = "67e5a6f867431037543a038b";

  const pendingOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "pending"
  );
  const activeOrders = orders.filter(
    (order) => order.status?.toLowerCase() !== "pending"
  );

  useEffect(() => {
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
    const intervalId = setInterval(fetchOrders, 30000);
    return () => clearInterval(intervalId);
  }, [restaurantId]);

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
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-indigo-100 text-indigo-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "out for delivery":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

      <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">🟡 Pending Orders</h3>
            {pendingOrders.length === 0 ? (
              <div className="text-gray-500">No pending orders</div>
            ) : (
              renderOrdersTable(
                pendingOrders,
                handleUpdateStatus,
                formatDate,
                getStatusColor,
                setSelectedOrder
              )
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">🛠️ Active Orders</h3>
            {activeOrders.length === 0 ? (
              <div className="text-gray-500">No active/accepted orders</div>
            ) : (
              renderOrdersTable(
                activeOrders,
                handleUpdateStatus,
                formatDate,
                getStatusColor,
                setSelectedOrder
              )
            )}
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
