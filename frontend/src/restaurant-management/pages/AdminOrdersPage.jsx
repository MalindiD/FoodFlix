import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/Admin/AdminLayout";

const AdminOrdersPage = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3003/api/restaurants/${id}/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  //  Helper function to render colorful status badge
  const renderStatusBadge = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-semibold capitalize";

    if (status.toLowerCase() === "completed") {
      return (
        <span className={`${baseClass} bg-green-100 text-green-700`}>
          {status}
        </span>
      );
    } else if (status.toLowerCase() === "processing") {
      return (
        <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>
          {status}
        </span>
      );
    } else {
      return (
        <span className={`${baseClass} bg-red-100 text-red-700`}>{status}</span>
      );
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Top header with back button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Restaurant Orders
          </h1>
          <Link
            to="/admin/manage-restaurants"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Restaurants
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-gray-500">Loading orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No orders found for this restaurant.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left font-semibold">Order ID</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Items</th>
                  <th className="p-4 text-left font-semibold">Total</th>
                  <th className="p-4 text-left font-semibold">Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t hover:bg-gray-50 transition-all cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4 font-mono text-xs text-gray-600">
                      {order._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="p-4">{renderStatusBadge(order.status)}</td>

                    <td className="p-4">
                      {order.items.map((item) => item.name).join(", ")}
                    </td>

                    <td className="p-4 font-medium">
                      Rs. {(order.totalPrice || 0).toFixed(2)}
                    </td>

                    <td className="p-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Order Details
              </h2>

              <div className="space-y-2">
                <p>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {renderStatusBadge(selectedOrder.status)}
                </p>
                <p>
                  <strong>Total Price:</strong> Rs.{" "}
                  {(selectedOrder.totalPrice || 0).toFixed(2)}
                </p>
                <p>
                  <strong>Special Instructions:</strong>{" "}
                  {selectedOrder.specialInstructions || "None"}
                </p>
                <p>
                  <strong>Items:</strong>{" "}
                  {selectedOrder.items.map((item) => item.name).join(", ")}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>

                <div>
                  <strong>Status History:</strong>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {selectedOrder.statusHistory?.length > 0 ? (
                      selectedOrder.statusHistory.map((history, index) => (
                        <li key={index} className="flex gap-2 items-center">
                          {/* Colored status text */}
                          <span
                            className={`text-xs font-semibold capitalize ${
                              history.status.toLowerCase() === "completed"
                                ? "text-green-600"
                                : history.status.toLowerCase() === "processing"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {history.status}
                          </span>
                          {/* Timestamp */}
                          <span className="text-gray-500">
                            ({new Date(history.timestamp).toLocaleString()})
                          </span>
                        </li>
                      ))
                    ) : (
                      <li>No status history available</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
