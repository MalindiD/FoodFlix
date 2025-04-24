import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";

// ✅ Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ✅ Connect to socket server
const socket = io("http://localhost:5003");

const DeliveryDetails = () => {
  const { orderId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const mapRef = useRef();

  // 🔐 Secure Fetch with Auth Header
  useEffect(() => {
    const fetchDelivery = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.warn("❌ No token found in sessionStorage.");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5003/api/delivery/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDelivery(res.data);
        setDriverLocation(res.data.deliveryPartner?.currentLocation);
      } catch (err) {
        console.error("❌ Fetch error:", err.response?.data || err.message);
      }
    };

    fetchDelivery();
  }, [orderId]);

  // 🟢 Listen for live location updates
  useEffect(() => {
    socket.on("locationUpdate", (data) => {
      if (data.orderId === delivery?.orderId) {
        setDriverLocation(data.location);
        if (mapRef.current) {
          mapRef.current.setView([data.location.lat, data.location.lng]);
        }
      }
    });

    return () => socket.off("locationUpdate");
  }, [delivery]);

  if (!delivery) return <p className="text-center p-4">Loading delivery details...</p>;

  const { deliveryPartner, customerLocation, deliveryStatus } = delivery;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#fff9e6] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">🚚 Delivery Information</h2>
      <p><strong>Status:</strong> {deliveryStatus}</p>
      <p><strong>Order ID:</strong> {delivery.orderId}</p>

      <h3 className="text-lg font-semibold mt-6">📍 Customer Location</h3>
      <p>Latitude: {customerLocation.lat}</p>
      <p>Longitude: {customerLocation.lng}</p>

      <div className="mt-4 mb-6">
        <MapContainer
          center={[customerLocation.lat, customerLocation.lng]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "300px", width: "100%", borderRadius: "8px" }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />

          {/* Customer marker */}
          <Marker position={[customerLocation.lat, customerLocation.lng]}>
            <Popup>📍 Customer Location</Popup>
          </Marker>

          {/* Live driver marker */}
          {driverLocation && (
            <Marker position={[driverLocation.lat, driverLocation.lng]}>
              <Popup>🚴 Delivery Partner: {deliveryPartner.name}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <h3 className="text-lg font-semibold mt-6">👤 Delivery Partner</h3>
      <div className="flex gap-4 items-center mt-2">
        <img
          src={deliveryPartner?.profileImage || "https://via.placeholder.com/80"}
          alt="Profile"
          className="w-24 h-24 rounded object-cover border-2 border-black shadow-lg"
        />
        <div className="text-black text-sm leading-6">
          <p><strong>Name:</strong> {deliveryPartner.name}</p>
          <p><strong>Phone:</strong> {deliveryPartner.phone}</p>
          <p><strong>Current Location:</strong><br />
            {driverLocation?.lat}, {driverLocation?.lng}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
