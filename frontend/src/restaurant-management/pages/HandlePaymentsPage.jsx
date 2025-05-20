import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RestaurantLayout from "../components/Layout/RestaurantLayout";
import PaymentDetailsModal from "../components/payments/PaymentDetailsModal";

const HandlePaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ordersMap, setOrdersMap] = useState({});

  const storedRestaurant = sessionStorage.getItem("restaurant");
  const restaurantId = storedRestaurant
    ? JSON.parse(storedRestaurant).id
    : null;

  useEffect(() => {
    const fetchOrdersAndMockPayments = async () => {
      try {
        const RESTAURANT_API =
          process.env.REACT_APP_RESTAURANT_API || "http://localhost:3003/api";
        const orderRes = await fetch(
          `${RESTAURANT_API}/restaurants/${restaurantId}/orders`
        );

        const orders = await orderRes.json();
        const ordersMapping = {};
        const mockPayments = [];

        orders.forEach((order) => {
          ordersMapping[order._id] = order;

          // Mock payment object
          mockPayments.push({
            _id: "mock-" + order._id, // Use a fake id or the order id itself
            order: order._id,
            amount: order.totalPrice ?? 0,
            paymentMethod: "Strip",
            status: "completed",
            transactionId: "TXN" + order._id.slice(-6),
            createdAt: order.createdAt
          });
        });

        // Sort by most recent
        mockPayments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrdersMap(ordersMapping);
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) fetchOrdersAndMockPayments();
  }, [restaurantId]);

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setStatusFilter(selected);

    if (selected === "all") {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(
        payments.filter((payment) => payment.status?.toLowerCase() === selected)
      );
    }
  };

  const handlePaymentClick = (payment) => {
    const matchingOrder = ordersMap[payment.order];
    if (!matchingOrder) {
      console.error("Order not found locally for payment:", payment.order);
      return;
    }
    setSelectedOrder(matchingOrder);
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  return (
    <RestaurantLayout>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
          >
            <option value="all">All Payments</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg">
            No {statusFilter !== "all" ? statusFilter : "payment"} records
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
                    Amount
                  </th>
                  <th className="p-4 text-left text-sm font-semibold">
                    Method
                  </th>
                  <th className="p-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-semibold">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment._id}
                    onClick={() => handlePaymentClick(payment)}
                    className="border-t hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <td className="p-4 text-gray-700">
                      {payment.order?.slice(0, 8)}...
                    </td>
                    <td className="p-4 font-bold text-green-600">
                      Rs.{payment.amount?.toFixed(2) || "-"}
                    </td>
                    <td className="p-4 capitalize text-gray-700">
                      {payment.paymentMethod}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700`}
                      >
                        completed
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {payment.transactionId || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modalOpen && selectedOrder && selectedPayment && (
          <PaymentDetailsModal
            order={selectedOrder}
            payment={selectedPayment}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </RestaurantLayout>
  );
};

export default HandlePaymentsPage;
