// MockDriver.jsx
import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5003");

const MockDriver = () => {
  useEffect(() => {
    let lat = 6.9157;
    let lng =  79.863;
    
    const interval = setInterval(() => {
      lat += 0.0005; // simulate visible movement
      socket.emit("locationUpdate", {
        orderId: "6804ce9e73fc6495389ee139", // must match the real orderId
        location: { lat, lng }
      });
      console.log("Sent new location:", lat, lng);
    }, 3000);

    return () => clearInterval(interval); // ✅ fixes reference error
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl font-bold">🚴 Simulated Driver Location</h2>
      <p>Sending live updates every 3s...</p>
    </div>
  );
};

export default MockDriver;
