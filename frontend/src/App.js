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
import HandlePayments from "./restaurant-management/pages/HandlePaymentsPage";
import OrderHistory from "./restaurant-management/pages/OrderHistoryPage";
import RestaurantLogin from "./restaurant-management/pages/RestaurantLogin";
import RestaurantRegister from "./restaurant-management/pages/RestaurantRegister";

import AdminDashboard from "./restaurant-management/pages/AdminDashboard";
import AdminCustomersPage from "./restaurant-management/pages/AdminCustomersPage";
import AdminDeliveriesPage from "./restaurant-management/pages/AdminDeliveriesPage";
import AdminRestaurantsPage from "./restaurant-management/pages/AdminRestaurantsPage";
import AdminMenuPage from "./restaurant-management/pages/AdminMenuPage";
import AdminOrdersPage from "./restaurant-management/pages/AdminOrdersPage";

import AdminFinancialsPage from "./restaurant-management/pages/AdminFinancialsPage";

import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/restaurant-management/login" replace />}
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
            path="/admin/restaurants/:id/menu"
            element={<AdminMenuPage />}
          />
          <Route
            path="/admin/restaurants/:id/orders"
            element={<AdminOrdersPage />}
          />

          <Route
            path="/restaurant-management/handle-payments"
            element={<HandlePayments />}
          />
          <Route
            path="/restaurant-management/order-history"
            element={<OrderHistory />}
          />
          <Route
            path="/restaurant-management/menu-items"
            element={<MenuItemsPage />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/manage-customers"
            element={<AdminCustomersPage />}
          />
          <Route
            path="/admin/manage-deliveries"
            element={<AdminDeliveriesPage />}
          />
          <Route
            path="/admin/manage-restaurants"
            element={<AdminRestaurantsPage />}
          />
          <Route path="/admin/financials" element={<AdminFinancialsPage />} />

          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
