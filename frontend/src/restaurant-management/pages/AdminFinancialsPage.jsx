import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/Admin/AdminLayout";
import AdminPaymentDetailsModal from "../components/Admin/AdminPaymentDetailsModal";

const AdminFinancialsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3003/api/admin/payments",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPayments();
  }, []);

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((payment) => payment.status === filter);

  const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const transactionCount = filteredPayments.length;

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Financial Summary
        </h1>

        <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
          {/* Revenue Card */}
          <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2">
            <p className="text-gray-500 text-sm mb-2">Total Revenue</p>
            <p className="text-2xl font-semibold text-green-600">
              Rs.{totalRevenue.toFixed(2)}
            </p>
          </div>

          {/* Transaction Count Card */}
          <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/2">
            <p className="text-gray-500 text-sm mb-2">Transaction Count</p>
            <p className="text-2xl font-semibold text-blue-600">
              {transactionCount}
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex items-center gap-4">
          <label className="font-medium text-gray-700">Filter by Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Table Section */}
        {loading ? (
          <p className="text-center text-gray-500">Loading payments...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left font-semibold">Order ID</th>
                  <th className="p-4 text-left font-semibold">Amount</th>
                  <th className="p-4 text-left font-semibold">Method</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    onClick={() => {
                      setSelectedPayment(payment);
                      setModalOpen(true);
                    }}
                    className="border-t hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    {/* Restaurant (Order ID shortened) */}
                    <td className="p-4">
                      {payment.order
                        ? typeof payment.order === "object"
                          ? payment.order._id?.slice(-6).toUpperCase()
                          : payment.order.slice(-6).toUpperCase()
                        : "N/A"}
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-medium">
                      Rs.{payment.amount?.toFixed(2) || "0.00"}
                    </td>

                    {/* Payment Method */}
                    <td className="p-4 capitalize">
                      {payment.paymentMethod || "N/A"}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    {/* Transaction ID */}
                    <td className="p-4">{payment.transactionId || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {modalOpen && selectedPayment && (
              <AdminPaymentDetailsModal
                payment={selectedPayment}
                onClose={() => {
                  setModalOpen(false);
                  setSelectedPayment(null);
                }}
              />
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFinancialsPage;
