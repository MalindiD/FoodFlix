// src/restaurant-management/components/orders/renderOrdersTable.js
import React from "react";

const renderOrdersTable = (
  orderList,
  handleUpdateStatus,
  formatDate,
  getStatusColor,
  onOrderClick
) => (
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
        {orderList.map((order) => (
          <tr
            key={order._id}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => onOrderClick(order)} // ✅ Make row clickable
          >
            <td className="px-6 py-4 text-sm text-gray-500">
              {order._id.substring(0, 8)}...
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {formatDate(order.createdAt)}
            </td>
            <td className="px-6 py-4 text-sm">
              <div>{order.items?.length || 0} items</div>
              <div className="text-xs text-gray-500">
                {order.items?.slice(0, 2).map((item, index) => (
                  <span key={index} className="block truncate">
                    {item.quantity}x {item.name || "(Unnamed)"}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              ${order.totalPrice?.toFixed(2) || "0.00"}
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </td>
            <td className="px-6 py-4 text-sm font-medium">
              {order.status?.toLowerCase() === "pending" && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(order._id, "Confirmed")}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order._id, "Cancelled")}
                    className="text-red-600 hover:text-red-900"
                  >
                    Cancel
                  </button>
                </>
              )}
              {order.status?.toLowerCase() === "confirmed" && (
                <button
                  onClick={() => handleUpdateStatus(order._id, "Preparing")}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Start Preparing
                </button>
              )}
              {order.status?.toLowerCase() === "preparing" && (
                <button
                  onClick={() => handleUpdateStatus(order._id, "Ready")}
                  className="text-green-600 hover:text-green-900"
                >
                  Mark Ready
                </button>
              )}
              {order.status?.toLowerCase() === "ready" && (
                <button
                  onClick={() =>
                    handleUpdateStatus(order._id, "Out for Delivery")
                  }
                  className="text-purple-600 hover:text-purple-900"
                >
                  Send for Delivery
                </button>
              )}
              {order.status?.toLowerCase() === "out for delivery" && (
                <button
                  onClick={() => handleUpdateStatus(order._id, "Completed")}
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
);

export default renderOrdersTable;
