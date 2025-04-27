import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const statusSteps = [
  { label: "Confirmed", icon: "🧾" },
  { label: "Preparing", icon: "🍕" },
  { label: "Cooking", icon: "🍳" },
  { label: "Out for Delivery", icon: "🛵" }
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const [orderStatus, setOrderStatus] = useState("Confirmed");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/tracking/public/${orderId}`);
        if (response.data && response.data.orderStatus) {
          setOrderStatus(response.data.orderStatus);
        }
      } catch (error) {
        console.error("Error fetching order status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
    const intervalId = setInterval(fetchOrderStatus, 30000);
    return () => clearInterval(intervalId);
  }, [orderId]);

  const currentStep = statusSteps.findIndex(
    (step) => step.label === orderStatus
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-2 pt-6">
      {loading ? (
        <p className="text-gray-500 text-lg mt-20">Loading order status...</p>
      ) : (
        <>
          {/* Top message */}
          <h2 className="text-orange-500 text-2xl font-semibold mb-8 text-center">
            Your order is getting ready to be delivered
          </h2>

          {/* Steps */}
          <div className="flex justify-between items-center w-full max-w-2xl mb-8">
            {statusSteps.map((step, idx) => (
              <div key={step.label} className="flex-1 flex flex-col items-center relative">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full border-2
                    ${idx <= currentStep
                      ? "border-orange-500 bg-orange-100 text-orange-500"
                      : "border-gray-300 bg-gray-100 text-gray-400"}
                    text-3xl mb-2`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-sm font-medium ${
                    idx <= currentStep ? "text-orange-500" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
                {/* Connector line */}
                {idx < statusSteps.length - 1 && (
                  <div
                    className={`absolute top-8 left-1/2 w-full h-0.5
                      ${idx < currentStep ? "bg-orange-500" : "bg-gray-200"}
                      z-[-1]`}
                    style={{ width: "120px", left: "64px" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Map area */}
          <div className="relative w-full max-w-2xl h-80 rounded-xl overflow-hidden shadow mb-8">
            {/* Replace below with your actual map component (e.g., Leaflet/Google Maps) */}
            <iframe
              title="Order Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=79.9,6.9,80.0,7.0&layer=mapnik"
              className="absolute inset-0 w-full h-full"
            />
            {/* Real time tracker overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-60 z-10">
              <div className="px-4 py-3 rounded-lg bg-white shadow text-center">
                <div className="font-semibold text-gray-700 flex items-center justify-center mb-1 text-lg">
                  <span className="mr-2">📍</span> Real Time Tracker
                </div>
                <div className="text-sm text-gray-500">
                  Starts when driver collects your order
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Link (for SMS/email) */}
          <a
            href={`https://tracker.dragontail.com/${orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-md"
          >
            tracker.dragontail.com/{orderId}
          </a>
        </>
      )}
    </div>
  );
};

export default OrderTracking;
