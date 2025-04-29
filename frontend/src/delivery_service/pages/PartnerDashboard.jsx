import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PartnerNavbar from "../../components/Shared/PartnerNavbar";
import Footer from "../../components/Shared/Footer";
import './style.css';

// Fix Leaflet icons issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const PartnerDashboard = () => {
  const [partner, setPartner] = useState(null);
  const [currentDelivery, setCurrentDelivery] = useState(null);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get("http://localhost:5003/api/partners/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPartner(res.data);
      } catch (err) {
        console.error("Error fetching partner details:", err);
      }
    };

    const fetchCurrentDelivery = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get("http://localhost:5003/api/delivery/assigned", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentDelivery(res.data);
      } catch (err) {
        console.error("Error fetching current delivery:", err);
      }
    };

    fetchPartnerData();
    fetchCurrentDelivery();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f1f5]">
      <PartnerNavbar />

      <main className="flex-grow p-6 mt-10 flex flex-col items-center">
        <div className="w-full max-w-6xl bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-semibold text-[#ec5834] mb-6 border-b pb-2">
            Delivery Partner Dashboard
          </h1>

          {/* 🚴 Partner Profile */}
          {partner && (
            <div className="flex items-center mb-8">
              <img
                src={partner.profileImage || "https://via.placeholder.com/100"}
                alt="Partner"
                className="w-24 h-24 rounded-full border-2 border-orange-400 mr-6"
              />
              <div>
                <h2 className="text-2xl font-bold">{partner.name}</h2>
                <p className="text-gray-600">Phone: {partner.phone}</p>
                <p className="text-gray-600">Email: {partner.email}</p>
                <p className="text-gray-600">Vehicle: {partner.vehicleType}</p>
              </div>
            </div>
          )}

          {/* {/* 📦 Current Assigned Order */}
<div className="bg-orange-50 p-4 rounded-lg shadow mb-6">
  {currentDelivery ? (
    <>
      <h3 className="text-xl font-semibold mb-2 text-[#ec5834]">🚚 Active Delivery Assigned</h3>
      <p><strong>Order ID:</strong> {currentDelivery.orderId}</p>
      <p><strong>Status:</strong> {currentDelivery.deliveryStatus}</p>

      {/* 🗺️ Customer Location Map */}
      <div className="mt-4">
        <MapContainer
          center={[
            currentDelivery.customerLocation.lat,
            currentDelivery.customerLocation.lng
          ]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker
            position={[
              currentDelivery.customerLocation.lat,
              currentDelivery.customerLocation.lng
            ]}
          >
            <Popup>📍 Customer Location</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* ✅ Accept / Reject Buttons moved here */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={async () => {
            try {
              const token = sessionStorage.getItem('token');
              await axios.put(
                `http://localhost:5003/api/partners/${partner._id}/availability`,
                { isAvailable: true },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              alert('✅ Accepted! You are now available for deliveries.');
            } catch (err) {
              console.error(err);
              alert('❌ Failed to accept delivery.');
            }
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
        >
          Accept
        </button>

        <button
          onClick={async () => {
            try {
              const token = sessionStorage.getItem('token');
              await axios.put(
                `http://localhost:5003/api/partners/${partner._id}/availability`,
                { isAvailable: false },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              alert('❌ Rejected! You are now marked unavailable.');
            } catch (err) {
              console.error(err);
              alert('❌ Failed to reject delivery.');
            }
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
        >
          Reject
        </button>
      </div>
    </>
  ) : (
    <div className="text-gray-500 text-lg text-center">
      ❌ No active deliveries assigned yet.
    </div>
  )}
</div>
      </div>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerDashboard;
