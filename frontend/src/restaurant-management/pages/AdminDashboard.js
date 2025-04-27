import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminLayout from "../components/Admin/AdminLayout";
import AdminPaymentDetailsModal from "../components/Admin/AdminPaymentDetailsModal";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Truck,
  Building2,
  ReceiptText,
  Wallet
} from "lucide-react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const AdminDashboard = () => {
  const [totals, setTotals] = useState({
    customers: 0,
    deliveries: 0,
    restaurants: 0,
    totalRevenue: 0,
    transactions: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchOverviewData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const [customersRes, deliveriesRes, restaurantsRes, paymentsRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/admin/users?role=customer", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admin/users?role=delivery", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admin/restaurants", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admin/payments", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

      const payments = paymentsRes.data || [];

      setTotals({
        customers: customersRes.data.length,
        deliveries: deliveriesRes.data.length,
        restaurants: restaurantsRes.data.length,
        totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        transactions: payments.length
      });

      const sortedPayments = payments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentPayments(sortedPayments);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const previousWeekTotals = {
    customers: 80,
    deliveries: 50,
    restaurants: 28,
    totalRevenue: 4000,
    transactions: 85
  };

  const renderTrend = (current, previous) => {
    if (current > previous) {
      return <ArrowUpRight className="text-green-600 inline ml-1" size={18} />;
    } else if (current < previous) {
      return <ArrowDownRight className="text-red-600 inline ml-1" size={18} />;
    } else {
      return null;
    }
  };

  const handleDownloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Amount,Status,Transaction ID\n";
    recentPayments.forEach((payment) => {
      const row = [
        payment.order?._id || payment.order || "N/A",
        payment.amount || 0,
        payment.status || "unknown",
        payment.transactionId || "-"
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payments_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  const kpiCard = (label, value, icon, color, trend) => (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between gap-4 hover:shadow-lg transition">
      <div>
        <h2 className="text-md font-medium text-gray-500">{label}</h2>
        <p className={`text-3xl font-bold ${color}`}>
          {value}
          {trend}
        </p>
      </div>
      <div className="text-gray-300">{icon}</div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {kpiCard(
                "Total Customers",
                totals.customers,
                <Users size={40} />,
                "text-blue-600",
                renderTrend(totals.customers, previousWeekTotals.customers)
              )}
              {kpiCard(
                "Delivery Personnel",
                totals.deliveries,
                <Truck size={40} />,
                "text-green-600",
                renderTrend(totals.deliveries, previousWeekTotals.deliveries)
              )}
              {kpiCard(
                "Restaurants",
                totals.restaurants,
                <Building2 size={40} />,
                "text-purple-600",
                renderTrend(totals.restaurants, previousWeekTotals.restaurants)
              )}
              {kpiCard(
                "Total Revenue",
                `$${totals.totalRevenue.toFixed(2)}`,
                <Wallet size={40} />,
                "text-yellow-600",
                renderTrend(
                  totals.totalRevenue,
                  previousWeekTotals.totalRevenue
                )
              )}
              {kpiCard(
                "Transactions",
                totals.transactions,
                <ReceiptText size={40} />,
                "text-indigo-600",
                renderTrend(
                  totals.transactions,
                  previousWeekTotals.transactions
                )
              )}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-10">
              <h2 className="text-xl font-bold mb-4">Revenue Over Time</h2>
              <Line
                data={{
                  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                  datasets: [
                    {
                      label: "Revenue",
                      data: [1000, 2000, 3000, totals.totalRevenue],
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      borderColor: "rgba(99, 102, 241, 1)",
                      borderWidth: 2,
                      fill: true,
                      tension: 0.3,
                      pointBackgroundColor: "white",
                      pointBorderColor: "rgba(99, 102, 241, 1)"
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } }
                }}
              />
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
                <button
                  onClick={handleDownloadCSV}
                  className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition"
                >
                  Download CSV
                </button>
              </div>

              {recentPayments.length === 0 ? (
                <p>No payments found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border rounded-lg text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left px-4 py-2">Order ID</th>
                        <th className="text-left px-4 py-2">Amount</th>
                        <th className="text-left px-4 py-2">Status</th>
                        <th className="text-left px-4 py-2">Transaction ID</th>
                        <th className="text-left px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.slice(0, 5).map((p) => (
                        <tr
                          key={p._id}
                          onClick={() => {
                            setSelectedPayment(p);
                            setModalOpen(true);
                          }}
                          className="border-t hover:bg-gray-50 cursor-pointer transition"
                        >
                          <td className="px-4 py-2">
                            {p.order
                              ? typeof p.order === "string"
                                ? p.order.slice(-6).toUpperCase()
                                : p.order._id
                                ? p.order._id.slice(-6).toUpperCase()
                                : "N/A"
                              : "N/A"}
                          </td>

                          <td className="px-4 py-2">
                            {p.currency || "LKR"} {p.amount.toFixed(2)}
                          </td>

                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                p.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : p.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>

                          <td className="px-4 py-2">
                            {p.transactionId || "-"}
                          </td>

                          <td className="px-4 py-2">
                            {p.createdAt
                              ? new Date(p.createdAt).toLocaleDateString()
                              : "-"}
                          </td>
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
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
