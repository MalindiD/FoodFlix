import React from "react";
import { FaCreditCard, FaShoppingCart } from "react-icons/fa";

const PaymentDetailsModal = ({ order, payment, onClose }) => {
  if (!order || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-3xl shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Payment & Order Details
        </h2>

        {/* Payment Section */}
        <div className="mb-8">
          <h3 className="flex items-center text-xl font-semibold mb-4 space-x-2">
            <FaCreditCard className="text-orange-500" />
            <span>Payment Information</span>
          </h3>
          <div className="space-y-2">
            <p>
              <strong>Order ID:</strong> {payment.order}
            </p>
            <p>
              <strong>Amount:</strong>{" "}
              {payment.amount !== undefined
                ? `$${payment.amount.toFixed(2)}`
                : "-"}
            </p>
            <p>
              <strong>Method:</strong> {payment.paymentMethod}
            </p>
            <p>
              <strong>Status:</strong> {payment.status}
            </p>
            <p>
              <strong>Transaction ID:</strong> {payment.transactionId || "-"}
            </p>
          </div>
        </div>

        {/* Order Section */}
        <div>
          <h3 className="flex items-center text-xl font-semibold mb-4 space-x-2">
            <FaShoppingCart className="text-orange-500" />
            <span>Order Information</span>
          </h3>

          <div className="space-y-2">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Restaurant ID:</strong> {order.restaurant}
            </p>
            <p>
              <strong>Customer ID:</strong> {order.customerId}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total Price:</strong>{" "}
              {order.totalPrice !== undefined
                ? `$${order.totalPrice.toFixed(2)}`
                : "-"}
            </p>
            {order.specialInstructions && (
              <p>
                <strong>Special Instructions:</strong>{" "}
                {order.specialInstructions}
              </p>
            )}
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Order Items */}
          {order.items && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-lg">Items:</h4>
              <ul className="list-disc ml-6 space-y-1">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} — {item.quantity} × $
                    {item.price?.toFixed(2) || "0.00"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-lg">Status History:</h4>
              <ul className="list-disc ml-6 space-y-1 text-gray-700 text-sm">
                {order.statusHistory.map((history, index) => (
                  <li key={index}>
                    {history.status} at{" "}
                    {new Date(history.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Close button */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={onClose}
            className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
