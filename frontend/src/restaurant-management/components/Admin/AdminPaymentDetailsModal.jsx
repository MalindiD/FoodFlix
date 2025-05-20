import React from "react";
import { FaCreditCard } from "react-icons/fa";

const AdminPaymentDetailsModal = ({ payment, onClose }) => {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Transaction Details
        </h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-semibold">
            <FaCreditCard className="text-orange-500" />
            <span>Payment Info</span>
          </div>

          <p>
            <strong>Order ID:</strong>{" "}
            {typeof payment.order === "object"
              ? payment.order._id
              : payment.order || "N/A"}
          </p>
          <p>
            <strong>Amount:</strong> {payment.currency || "USD"}{" "}
            {payment.amount?.toFixed(2)}
          </p>
          <p>
            <strong>Payment Method:</strong> {payment.paymentMethod || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {payment.status || "N/A"}
          </p>
          <p>
            <strong>Transaction ID:</strong> {payment.transactionId || "-"}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {payment.createdAt
              ? new Date(payment.createdAt).toLocaleString()
              : "-"}
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-8 flex justify-end">
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

export default AdminPaymentDetailsModal;
