import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPartner from "./pages/RegisterPartner";
import PartnerDashboard from "./pages/PartnerDashboard";
import DeliveryDetails from "./pages/DeliveryDetails";
import OrderConfirmation from "./pages/orderConfirmationPage";
import MockDriver from "./pages/MockDriver";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-black text-white p-4 flex justify-between">
          <div className="font-bold text-lg">🚚 Delivery Dashboard</div>
          <div className="space-x-4">
            <Link to="/register" className="text-yellow-400 hover:underline">Register</Link>
            <Link to="/partners" className="text-yellow-400 hover:underline">View All</Link>
            <Link to="/details/661fa5489dd95c378cbf03d7" className="text-yellow-400 hover:underline">Details</Link>
            <Link to="/mock-driver" className="text-yellow-400 hover:underline">Mock Driver</Link>
          </div>
        </nav>

        {/* ✅ All Routes go inside a single <Routes> wrapper */}
        <Routes>
          <Route path="/register" element={<RegisterPartner />} />
          <Route path="/partners" element={<PartnerDashboard />} />
          <Route path="/details/:orderId" element={<DeliveryDetails />} />
          <Route path="/order" element={<OrderConfirmation />} />
          <Route path="/mock-driver" element={<MockDriver />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
