import React from "react";

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const calculateSubtotal = (item) => (item.price || 0) * (item.quantity || 0);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">🧾 Order Details</h2>

        <div className="mb-4 space-y-1 text-sm">
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Created At:</strong> {formatDate(order.createdAt)}
          </p>
          {order.specialInstructions && (
            <p>
              <strong>Notes:</strong> {order.specialInstructions}
            </p>
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">📦 Items</h3>
          <ul className="space-y-3 text-sm">
            {order.items?.map((item, index) => (
              <li key={index} className="border-b pb-2">
                <div>
                  <strong>{item.name || "Unnamed Item"}</strong>
                </div>
                <div>Quantity: {item.quantity || 0}</div>
                <div>Price: ${item.price?.toFixed(2) || "0.00"}</div>
                <div>Subtotal: ${calculateSubtotal(item).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-right text-base font-bold">
          Total: ${order.totalPrice?.toFixed(2) || "0.00"}
        </div>

        {order.statusHistory?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-sm">📜 Status History</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              {order.statusHistory.map((entry, idx) => (
                <li key={idx}>
                  • {entry.status} — {formatDate(entry.timestamp)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
