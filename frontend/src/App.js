import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Context
import AuthContext from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import CartPopup from "./components/CartPopup";

// Customer Pages
import Login from "./pages/AuthService/Login";
import Register from "./pages/AuthService/Register";
import LandingPage from "./pages/Public/LandingPage";
import CustomerDashboard from "./pages/CustomerService/CustomerDashboard";
import RestaurantDetail from "./pages/CustomerService/RestaurantDetail";
import Cart from "./pages/CustomerService/Cart";
import OrderSuccess from "./pages/CustomerService/OrderSuccess";
import CheckoutPage from "./pages/CustomerService/CheckoutPage";
import PaymentSuccess from "./pages/CustomerService/PaymentSuccess";
import DeliveryDetailsPage from "./pages/CustomerService/DeliveryDetailsPage";
import OrderTracking from "./pages/CustomerService/OrderTracking";
import CustomerOrders from "./pages/CustomerService/CustomerOrders";

// Restaurant Management Pages
import RestaurantManagementDashboard from "./restaurant-management/pages/Dashboard";
import RestaurantsPage from "./restaurant-management/pages/RestaurantsPage";
import MenuItemsPage from "./restaurant-management/pages/MenuItemsPage";
import HandlePayments from "./restaurant-management/pages/HandlePaymentsPage";
import OrderHistory from "./restaurant-management/pages/OrderHistoryPage";
import RestaurantLogin from "./restaurant-management/pages/RestaurantLogin";
import RestaurantRegister from "./restaurant-management/pages/RestaurantRegister";

// Admin Pages
import AdminDashboard from "./restaurant-management/pages/AdminDashboard";
import AdminCustomersPage from "./restaurant-management/pages/AdminCustomersPage";
import AdminDeliveriesPage from "./restaurant-management/pages/AdminDeliveriesPage";
import AdminRestaurantsPage from "./restaurant-management/pages/AdminRestaurantsPage";
import AdminMenuPage from "./restaurant-management/pages/AdminMenuPage";
import AdminOrdersPage from "./restaurant-management/pages/AdminOrdersPage";
import AdminFinancialsPage from "./restaurant-management/pages/AdminFinancialsPage";

// Delivery Partner Pages
import LoginPartner from './delivery_service/pages/loginPartner';
import PartnerDashboard from './delivery_service/pages/PartnerDashboard';
import MockDriver from './delivery_service/pages/MockDriver';
import PartnerForm from './delivery_service/pages/RegisterPartner';

function App() {
  const { user } = useContext(AuthContext);

  // Helper for role-based redirects
  const getDashboardPath = (role) => {
    switch (role) {
      case "customer":
        return "/dashboard";
      case "delivery":
        return "/partner-dashboard";
      case "restaurant":
        return "/restaurant-management/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <>
      {user?.role === "customer" && (
        <CartProvider>
          <CartPopup />
        </CartProvider>
      )}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/track/:orderId" element={<OrderTracking />} />

        {/* Customer Role Routes */}
        {user?.role === "customer" && (
          <>
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/delivery-details" element={<DeliveryDetailsPage />} />
            <Route path="/orders" element={<CustomerOrders />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}

        {/* Delivery Partner Routes */}
        {user?.role === "delivery" && (
          <>
            <Route path="/login-partner" element={<LoginPartner />} />
            <Route path="/partner-dashboard" element={<PartnerDashboard />} />
            <Route path="/mock-driver/:orderId/:lat/:lng" element={<MockDriver />} />
            <Route path="/register-partner" element={<PartnerForm />} />
            <Route path="*" element={<Navigate to="/partner-dashboard" />} />
          </>
        )}

        {/* Restaurant Role Routes */}
        {user?.role === "restaurant" && (
          <>
            <Route path="/restaurant-management/login" element={<RestaurantLogin />} />
            <Route path="/restaurant-management/register" element={<RestaurantRegister />} />
            <Route path="/restaurant-management/dashboard" element={<RestaurantManagementDashboard />} />
            <Route path="/restaurant-management/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurant-management/menu-items" element={<MenuItemsPage />} />
            <Route path="/restaurant-management/handle-payments" element={<HandlePayments />} />
            <Route path="/restaurant-management/order-history" element={<OrderHistory />} />
            <Route path="*" element={<Navigate to="/restaurant-management/dashboard" />} />
          </>
        )}

        {/* Admin Role Routes */}
        {user?.role === "admin" && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-customers" element={<AdminCustomersPage />} />
            <Route path="/admin/manage-deliveries" element={<AdminDeliveriesPage />} />
            <Route path="/admin/manage-restaurants" element={<AdminRestaurantsPage />} />
            <Route path="/admin/restaurants/:id/menu" element={<AdminMenuPage />} />
            <Route path="/admin/restaurants/:id/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/financials" element={<AdminFinancialsPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </>
        )}

        {/* Catch-all for unknown users or roles */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate to={getDashboardPath(user.role)} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
