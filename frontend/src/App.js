import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/AuthService/Login';
import Register from './pages/AuthService/Register';
import LandingPage from './pages/Public/LandingPage';
import CustomerDashboard from './pages/CustomerService/CustomerDashboard';
import RestaurantDetail from './pages/CustomerService/RestaurantDetail';
import Cart from './pages/CustomerService/Cart';
import OrderSuccess from './pages/CustomerService/OrderSuccess';
import CheckoutPage from './pages/CustomerService/CheckoutPage';
import PaymentSuccess from './pages/CustomerService/PaymentSuccess';
import OrderTracking from './pages/CustomerService/OrderTracking';

import DeliveryDetailsPage from './pages/CustomerService/DeliveryDetailsPage';
import LoginPartner from './delivery_service/pages/loginPartner';
import PartnerDashboard from './delivery_service/pages/PartnerDashboard';
import MockDriver from './delivery_service/pages/MockDriver';

import AuthContext from './context/AuthContext';
import { CartProvider } from "./context/CartContext";
import CartPopup from "./components/CartPopup";

import PartnerForm from './delivery_service/pages/RegisterPartner';

function App() {
  const { user } = useContext(AuthContext);

  if (user?.role === 'customer') {
    return (
      <CartProvider>
        <CartPopup />
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} /> {/* ✅ Added */}
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/delivery-details" element={<DeliveryDetailsPage />} />
          <Route path="/partnerform" element={<PartnerForm />} />
          <Route path="/mock-driver/:orderId/:lat/:lng" element={<MockDriver />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />

          {/* Catch-all for customers */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </CartProvider>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/login-partner" element={<LoginPartner />} />
      <Route path="/mock-driver/:orderId/:lat/:lng" element={<MockDriver />} />
      <Route path="/order-tracking/:orderId" element={<OrderTracking />} />

      {/* Delivery Partner Routes */}
      {user?.role === 'delivery' && (
        <>
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="*" element={<Navigate to="/partner-dashboard" />} />
        </>
      )}

      {/* Restaurant Role Routes */}
      {user?.role === 'restaurant' && (
        <>
          <Route path="/restaurant-dashboard" element={<Navigate to="/dashboard" />} />
          {/* More restaurant routes if needed */}
        </>
      )}

      {/* Admin Role Routes */}
      {user?.role === 'admin' && (
        <>
          <Route path="/admin" element={<Navigate to="/dashboard" />} />
          {/* More admin routes if needed */}
        </>
      )}

      {/* Catch-all for unknown users */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate
              to={
                user.role === 'customer' ? '/dashboard' :
                user.role === 'delivery' ? '/partner-dashboard' :
                user.role === 'restaurant' ? '/restaurant-dashboard' :
                user.role === 'admin' ? '/admin' :
                '/'
              }
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;
