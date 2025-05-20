import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

let socket = null;

if (process.env.REACT_APP_ENABLE_DELIVERY_SOCKET === "true") {
  socket = io("http://localhost:5003");

  socket.on("connect", () => {
    console.log("Connected to delivery socket");
  });
}

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
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const mapRef = useRef();

  // Fetch public order status
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/orders/tracking/public/${orderId}`
        );
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

  // Fetch delivery details
  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5003/api/delivery/public/${orderId}`
        );
        setDeliveryDetails(res.data);
        setDriverLocation(res.data.deliveryPartner?.currentLocation);
      } catch (err) {
        console.error("Failed to fetch delivery details", err);
      }
    };

    fetchDeliveryDetails();
  }, [orderId]);

  // Listen for live location updates
  useEffect(() => {
    socket.on("locationUpdate", (data) => {
      if (data.orderId === orderId) {
        setDriverLocation(data.location);
        if (mapRef.current) {
          mapRef.current.setView([data.location.lat, data.location.lng]);
        }
      }
    });

    return () => socket.off("locationUpdate");
  }, [orderId]);

  const currentStep = statusSteps.findIndex(
    (step) => step.label === orderStatus
  );

  if (loading || !deliveryDetails) {
    return (
      <p className="text-gray-500 text-lg mt-20 text-center">
        Loading delivery information...
      </p>
    );
  }

  const { customerLocation, deliveryPartner } = deliveryDetails;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-2 pt-6">
      <h2 className="text-orange-500 text-2xl font-semibold mb-8 text-center">
        Your order is getting ready to be delivered
      </h2>

      {/* Steps */}
      <div className="flex justify-between items-center w-full max-w-2xl mb-8">
        {statusSteps.map((step, idx) => (
          <div
            key={step.label}
            className="flex-1 flex flex-col items-center relative"
          >
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-full border-2
                ${
                  idx <= currentStep
                    ? "border-orange-500 bg-orange-100 text-orange-500"
                    : "border-gray-300 bg-gray-100 text-gray-400"
                }
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

      {/* Map */}
      <div className="relative w-full max-w-2xl h-80 rounded-xl overflow-hidden shadow mb-8">
        <MapContainer
          center={[customerLocation.lat, customerLocation.lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />
          <Marker position={[customerLocation.lat, customerLocation.lng]}>
            <Popup>📍 Customer Location</Popup>
          </Marker>
          {driverLocation && (
            <Marker position={[driverLocation.lat, driverLocation.lng]}>
              <Popup>🚴 {deliveryPartner.name} (Delivery Partner)</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* 📦 Order + 👤 Delivery Partner Details */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mb-8 text-left">
        <h3 className="text-xl font-bold text-orange-500 mb-4">
          Order Details
        </h3>
        <div className="text-gray-700 mb-4">
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
          <p>
            <strong>Status:</strong> {orderStatus}
          </p>
        </div>

        <h3 className="text-xl font-bold text-orange-500 mb-4 mt-6">
          Delivery Partner
        </h3>
        <div className="flex items-center gap-4">
          <img
            src={
              deliveryPartner?.profileImage || "https://via.placeholder.com/80"
            }
            alt="Partner Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-orange-400"
          />
          <div className="text-gray-700">
            <p>
              <strong>Name:</strong> {deliveryPartner?.name}
            </p>
            <p>
              <strong>Phone:</strong> {deliveryPartner?.phone}
            </p>
            {driverLocation && (
              <p>
                <strong>Current Location:</strong>{" "}
                {driverLocation.lat.toFixed(5)}, {driverLocation.lng.toFixed(5)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Open Mock Driver Button */}
      <a
        href={`/mock-driver/${orderId}/${driverLocation?.lat || 6.9157}/${
          driverLocation?.lng || 79.863
        }`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition mb-6"
      >
        🚴 Simulate Driver Movement
      </a>

      {/* External Tracker Link */}
      <a
        href={`https://tracker.dragontail.com/${orderId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-md mb-8"
      >
        tracker.dragontail.com/{orderId}
      </a>
    </div>
  );
};

export default OrderTracking;
