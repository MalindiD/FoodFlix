// src/restaurant-management/components/orders/renderOrdersTable.js
import React from "react";

const renderOrdersTable = (
  orderList,
  handleUpdateStatus,
  formatDate,
  getStatusColor,
  onOrderClick,
  markAsPaid
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
            Payment
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
            onClick={() => onOrderClick(order)}
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
              Rs.{order.totalPrice?.toFixed(2) || "0.00"}
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
            <td className="px-6 py-4 text-sm">
              <div>
                <span
                  className={`font-semibold ${
                    order.paymentStatus === "Paid"
                      ? "text-green-600"
                      : order.paymentStatus === "Failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus || "Pending"}
                </span>
              </div>

              {order.paymentStatus === "Pending" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent row click
                    markAsPaid(order._id);
                  }}
                  className="mt-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                >
                  Mark as Paid
                </button>
              )}
            </td>

            <td className="px-6 py-4 text-sm font-medium space-y-1">
              {order.status?.toLowerCase() === "pending" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(order._id, "Confirmed");
                    }}
                    className="text-blue-600 hover:text-blue-900 block"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(order._id, "Cancelled");
                    }}
                    className="text-red-600 hover:text-red-900 block"
                  >
                    Cancel
                  </button>
                </>
              )}

              {order.status?.toLowerCase() === "confirmed" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateStatus(order._id, "Preparing");
                  }}
                  className="text-indigo-600 hover:text-indigo-900 block"
                >
                  Start Preparing
                </button>
              )}

              {order.status?.toLowerCase() === "preparing" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateStatus(order._id, "Cooking");
                  }}
                  className="text-green-600 hover:text-green-900 block"
                >
                  Start Cooking
                </button>
              )}

              {order.status?.toLowerCase() === "cooking" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateStatus(order._id, "Out for Delivery");
                  }}
                  className="text-purple-600 hover:text-purple-900 block"
                >
                  Send for Delivery
                </button>
              )}

              {order.status?.toLowerCase() === "out for delivery" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateStatus(order._id, "Delivered");
                  }}
                  className="text-gray-600 hover:text-gray-900 block"
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
