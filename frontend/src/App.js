import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import RestaurantManagementDashboard from "./restaurant-management/pages/Dashboard";
import RestaurantsPage from "./restaurant-management/pages/RestaurantsPage";
import MenuItemsPage from "./restaurant-management/pages/MenuItemsPage";
import PaymentPage from "./pages/PaymentPage"; // ✅ from the first version

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/restaurant-management" replace />}
          />
          <Route
            path="/restaurant-management"
            element={<RestaurantManagementDashboard />}
          />
          <Route
            path="/restaurant-management/restaurants"
            element={<RestaurantsPage />}
          />
          <Route
            path="/restaurant-management/menu-items"
            element={<MenuItemsPage />}
          />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
