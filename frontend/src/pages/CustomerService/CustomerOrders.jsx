import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Clock, XCircle } from "lucide-react";
import Navbar from '../../components/Shared/Navbar';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);



  // Status badge colors
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Preparing: "bg-indigo-100 text-indigo-800",
    Cooking: "bg-purple-100 text-purple-800",
    "Out for Delivery": "bg-orange-100 text-orange-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  // Fetch customer orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await axios.get(
          `${process.env.REACT_APP_ORDER_SERVICE_URL || "http://localhost:4000/api/orders"}/my-orders`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Filter only active orders (not delivered or cancelled)
        const activeOrders = response.data.filter(
          order => order.status !== "Delivered" && order.status !== "Cancelled"
        );
        
        setOrders(activeOrders);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
        setLoading(false);
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.patch(
        `${process.env.REACT_APP_ORDER_SERVICE_URL || "http://localhost:4000/api/orders"}/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update local state after cancellation
      setOrders(orders.filter(order => order._id !== orderId));

      setOrders(orders.filter(order => order._id !== orderId));
      setSuccessMsg('Order cancelled successfully!');
      setTimeout(() => setSuccessMsg(''), 3000); // Hide after 3s      
    } catch (err) {
      setError("Failed to cancel order. Please try again.");
      console.error("Error cancelling order:", err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Check if order can be cancelled (only Pending or Confirmed)
  const canCancel = (status) => ['Pending', 'Confirmed'].includes(status);
  
  // Navigate to order tracking page
  const goToTracking = (orderId) => {
    navigate(`/track/${orderId}`);
  };

  const handleRowClick = async (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  
    // Fetch restaurant info if not already loaded
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/orders/${order.restaurantId}`
      );
      setRestaurantInfo(res.data.data);
    } catch (err) {
      setRestaurantInfo({ name: "Unknown Restaurant" });
    }
  };
  

  return (
    <div className="min-h-screen bg-[#f0f1f5]">
        <Navbar />
    <div className="max-w-4xl mx-auto px-4 py-8">
        
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">My Active Orders</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Clock className="animate-spin h-8 w-8 text-orange-500" />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-700">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10">
          <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No active orders</h3>
          <p className="text-gray-500 mt-2">You don't have any active orders at the moment.</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Order Now
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(order)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rs. {order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={e => { e.stopPropagation(); goToTracking(order._id);}}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Track
                        </button>
                        {canCancel(order.status) && (
                          <button
                            onClick={e => { e.stopPropagation(); setOrderToCancel(order._id);
                                setShowConfirm(true);}}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowOrderDetails(false)}
            >
                ×
            </button>
            <h2 className="text-xl font-bold mb-2 text-gray-800">
                Order Details
            </h2>
            <div className="mb-2 text-gray-600">
                <span className="font-semibold">Order ID:</span> #{selectedOrder._id.substring(0, 8)}
            </div>
            {/* <div className="mb-2 text-gray-600">
                <span className="font-semibold">Restaurant:</span> {restaurantInfo?.name || "Loading..."}
            </div> */}
            <div className="mb-4 text-gray-600">
                <span className="font-semibold">Status:</span> {selectedOrder.status}
            </div>
            <div>
                <table className="w-full text-left">
                <thead>
                    <tr>
                    {/* <th className="py-2 text-xs text-gray-500">Image</th> */}
                    <th className="py-2 text-xs text-gray-500">Item</th>
                    <th className="py-2 text-xs text-gray-500">Qty</th>
                    <th className="py-2 text-xs text-gray-500">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                        {/* <td className="py-2">
                        <img
                            src={item.image || "/images/food-placeholder.jpg"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={e => (e.target.src = "/images/food-placeholder.jpg")}
                        />
                        </td> */}
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">Rs. {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
                <div className="mt-4 text-right font-bold text-lg">
                Total: Rs. {selectedOrder.totalPrice?.toFixed(2) || "0.00"}
                </div>
            </div>
            </div>
        </div>
        )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Cancel Order</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end space-x-3">
                <button
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => setShowConfirm(false)}
                >
                No
                </button>
                <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={async () => {
                    setShowConfirm(false);
                    await handleCancelOrder(orderToCancel);
                }}
                >
                Yes, Cancel
                </button>
            </div>
            </div>
        </div>
        )}

        {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-center font-semibold">
            {successMsg}
        </div>
        )}

    </div>
    </div>
  );
};

export default CustomerOrders;
