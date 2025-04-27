import React , { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

// Dummy data for status and map
const orderStatus = "Preparing"; // Could be: "Confirmed", "Preparing", "Cooking", "Out for Delivery", "Delivered"
const statusSteps = [
  { label: "Confirmed", icon: "🧾" },
  { label: "Preparing", icon: "🍕" },
  { label: "Cooking", icon: "🍳" },
  { label: "Out for Delivery", icon: "🛵" }
];

const OrderTracking = () => {
    const { orderId } = useParams();
  // Find the current step index
  const currentStep = statusSteps.findIndex(
    (step) => step.label === orderStatus
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-2 pt-4">
      {/* Top message */}
      <h2 className="text-orange-500 text-lg font-semibold mb-4 text-center">
        Your order is getting ready to be delivered
      </h2>

      {/* Steps */}
      <div className="flex justify-between items-center w-full max-w-md mb-4">
        {statusSteps.map((step, idx) => (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full border-2
                ${idx <= currentStep
                  ? "border-orange-500 bg-orange-100 text-orange-500"
                  : "border-gray-300 bg-gray-100 text-gray-400"}
                text-2xl mb-1`}
            >
              {step.icon}
            </div>
            <span
              className={`text-xs font-medium ${
                idx <= currentStep ? "text-orange-500" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
            {/* Connector line */}
            {idx < statusSteps.length - 1 && (
              <div
                className={`absolute top-6 left-1/2 w-full h-0.5
                  ${idx < currentStep ? "bg-orange-500" : "bg-gray-200"}
                  z-[-1]`}
                style={{ width: "100px", left: "48px" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Map area */}
      <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden shadow mb-4">
        {/* Replace below with your actual map component (e.g., Leaflet/Google Maps) */}
        <iframe
          title="Order Map"
          src="https://www.openstreetmap.org/export/embed.html?bbox=79.9,6.9,80.0,7.0&layer=mapnik"
          className="absolute inset-0 w-full h-full"
        />
        {/* Real time tracker overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-60 z-10">
          <div className="px-3 py-2 rounded-lg bg-white shadow text-center">
            <div className="font-semibold text-gray-700 flex items-center justify-center mb-1">
              <span className="mr-2">📍</span> Real Time Tracker
            </div>
            <div className="text-xs text-gray-500">
              Starts when driver collects your order
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Link (for SMS/email) */}
      <a
        href="https://tracker.dragontail.com/ORDER_ID"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-sm"
      >
        tracker.dragontail.com/ORDER_ID
      </a>
    </div>
  );
};

export default OrderTracking;
