// MockDriver.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5003");

const MockDriver = () => {
  const { orderId, lat: startLat, lng: startLng } = useParams(); // get from URL
  const initialLat = parseFloat(startLat);
  const initialLng = parseFloat(startLng);

  useEffect(() => {
    let lat = initialLat;
    let lng = initialLng;

    const interval = setInterval(() => {
      lat += 0.0005; // simulate small movement
      socket.emit("locationUpdate", {
        orderId,
        location: { lat, lng }
      });
      console.log(`Sent location: (${lat}, ${lng}) for orderId: ${orderId}`);
    }, 3000);

    return () => clearInterval(interval); // stop interval on unmount
  }, [orderId, initialLat, initialLng]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold">🚴 Mock Driver Simulator</h2>
      <p>Sending location updates every 3s for Order ID: {orderId}</p>
    </div>
  );
};

export default MockDriver;
