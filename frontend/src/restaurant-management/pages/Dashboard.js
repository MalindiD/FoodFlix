import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import renderOrdersTable from "../components/orders/renderOrdersTable";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import RestaurantLayout from "../components/Layout/RestaurantLayout";
import axios from "axios";
import { FaClock, FaTools, FaBoxOpen } from "react-icons/fa";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const storedRestaurant = sessionStorage.getItem("restaurant");
  const restaurantId = storedRestaurant
    ? JSON.parse(storedRestaurant).id
    : null;

  useEffect(() => {
    if (!restaurantId) {
      navigate("/restaurant-management/login");
    }
  }, [restaurantId, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/restaurants/${restaurantId}/orders`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const orderData = await response.json();
      setOrders(orderData);
      setError(null);

      const paymentStatuses = {};
      for (const order of orderData) {
        try {
          const paymentRes = await axios.get(
            `http://localhost:5000/api/restaurants/${restaurantId}/payments/${order._id}`
          );
          paymentStatuses[order._id] = paymentRes.data.status || "processing";
        } catch (err) {
          console.warn("No payment found for order:", order._id);
          paymentStatuses[order._id] = "processing";
        }
      }
      setPayments(paymentStatuses);
    } catch (err) {
      setError("Failed to fetch orders: " + err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 30000);
    return () => clearInterval(intervalId);
  }, [restaurantId]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = sessionStorage.getItem("token");
      const storedRestaurant = sessionStorage.getItem("restaurant");
      const restaurantId = storedRestaurant
        ? JSON.parse(storedRestaurant).id
        : null;

      if (!restaurantId) {
        console.error("Restaurant ID missing!");
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/api/restaurants/${restaurantId}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        console.log("Order status updated successfully");
        // Optionally, refetch orders
        fetchOrders();
      }
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response?.data || error.message
      );
      alert("Failed to update order status.");
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

  const pendingOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "pending"
  );
  const activeOrders = orders.filter(
    (order) => order.status?.toLowerCase() !== "pending"
  );
  const completedOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "completed"
  );
  const cancelledOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "cancelled"
  );

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <RestaurantLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Manage Orders</h1>

        {/* Top Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Orders
            </h2>
            <p className="text-2xl font-bold mt-2">{orders.length}</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-700">
              Pending Orders
            </h2>
            <p className="text-2xl font-bold mt-2">{pendingOrders.length}</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-700">
              Completed Orders
            </h2>
            <p className="text-2xl font-bold mt-2">{completedOrders.length}</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-700">
              Cancelled Orders
            </h2>
            <p className="text-2xl font-bold mt-2">{cancelledOrders.length}</p>
          </div>
        </div>

        {/* Manage Orders */}
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
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="flex items-center text-xl font-bold mb-2 space-x-2">
                <FaClock /> <span>Pending Orders ({pendingOrders.length})</span>
              </h3>
              {renderOrdersTable(
                pendingOrders.map((order) => ({
                  ...order,
                  paymentStatus: payments[order._id] || "processing"
                })),
                handleUpdateStatus,
                formatDate,
                getStatusColor,
                setSelectedOrder
              )}
            </div>

            <div>
              <h3 className="flex items-center text-xl font-bold mb-2 space-x-2">
                <FaTools /> <span>Active Orders ({activeOrders.length})</span>
              </h3>
              {renderOrdersTable(
                activeOrders.map((order) => ({
                  ...order,
                  paymentStatus: payments[order._id] || "processing"
                })),
                handleUpdateStatus,
                formatDate,
                getStatusColor,
                setSelectedOrder
              )}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="mt-10">
          <h3 className="flex items-center text-xl font-bold mb-4 space-x-2">
            <FaBoxOpen /> <span>Recent Orders</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{order._id.slice(0, 8)}...</td>
                    <td className="p-3">
                      {order.totalPrice !== undefined
                        ? `Rs.${order.totalPrice.toFixed(2)}`
                        : "-"}
                    </td>
                    <td className="p-3 capitalize">{order.status}</td>
                    <td className="p-3">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </RestaurantLayout>
  );
}

export default Dashboard;
