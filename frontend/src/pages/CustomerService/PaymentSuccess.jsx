import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  // Get the orderId (maybe saved in sessionStorage after checkout)
  const orderId = sessionStorage.getItem("orderId"); // fetch it from storage

  useEffect(() => {
    // Optional: Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      if (orderId) {
        navigate(`/order-tracking/${orderId}`);
      } else {
        navigate("/dashboard"); // fallback if no orderId found
      }
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigate, orderId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl p-8 shadow-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          ✅ Payment Successful!
        </h2>
        <p className="text-gray-700 mb-6">
          Thank you for your order. Redirecting to track your order...
        </p>

        <button
          onClick={() => {
            if (orderId) {
              navigate(`/order-tracking/${orderId}`);
            } else {
              navigate("/dashboard");
            }
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold"
        >
          Go to Tracking Now
        </button>
      </div>
    </div>
  );
}
