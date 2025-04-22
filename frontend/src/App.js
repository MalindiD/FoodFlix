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
import RestaurantLogin from "./restaurant-management/pages/RestaurantLogin";
import RestaurantRegister from "./restaurant-management/pages/RestaurantRegister";

import PaymentPage from "./pages/PaymentPage";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";


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
            path="/restaurant-management/login"
            element={<RestaurantLogin />}
          />
          <Route
            path="/restaurant-management/register"
            element={<RestaurantRegister />}
          />
          <Route
            path="/restaurant-management/dashboard"
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
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
