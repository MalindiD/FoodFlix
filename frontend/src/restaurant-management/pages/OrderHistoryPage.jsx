import React, { useEffect, useState } from "react";
import axios from "axios";
import RestaurantLayout from "../components/Layout/RestaurantLayout";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const storedRestaurant = sessionStorage.getItem("restaurant");
  const restaurantId = storedRestaurant
    ? JSON.parse(storedRestaurant).id
    : null;

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const RESTAURANT_API =
          process.env.REACT_APP_RESTAURANT_API || "http://localhost:3003/api";

        const res = await axios.get(
          `${RESTAURANT_API}/restaurants/${restaurantId}/orders`
        );

        const completed = res.data.filter((order) =>
          ["completed", "cancelled"].includes(order.status?.toLowerCase())
        );
        setOrders(completed);
        setFilteredOrders(completed); // initial display = all
      } catch (err) {
        console.error("Failed to fetch order history", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchCompletedOrders();
    }
  }, [restaurantId]);

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilter(selected);

    if (selected === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status?.toLowerCase() === selected)
      );
    }
  };

  return (
    <RestaurantLayout>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Order History</h1>

          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
          >
            <option value="all">All Orders</option>
            <option value="completed">Completed Orders</option>
            <option value="cancelled">Cancelled Orders</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg">
            No {filter !== "all" ? filter : "completed or cancelled"} orders
            found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">
                    Order ID
                  </th>
                  <th className="p-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-semibold">Total</th>
                  <th className="p-4 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t hover:bg-gray-50 transition-all"
                  >
                    <td className="p-4 text-gray-700">
                      {order._id.slice(0, 8)}...
                    </td>
                    <td className="p-4 capitalize font-medium text-gray-700">
                      {order.status}
                    </td>
                    <td className="p-4 font-bold text-green-600">
                      ${order.totalPrice?.toFixed(2) || "-"}
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
      </div>
    </RestaurantLayout>
  );
};

export default OrderHistoryPage;
