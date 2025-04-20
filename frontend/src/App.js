import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/AuthService/Login';
import Register from './pages/AuthService/Register';
import LandingPage from './pages/Public/LandingPage';
import CheckoutPage from './pages/CustomerService/CheckoutPage';
import CustomerDashboard from './pages/CustomerService/CustomerDashboard';
// import DeliveryDashboard from './pages/DeliveryService/DeliveryDashboard';
// import RestaurantDashboard from './pages/RestaurantService/RestaurantDashboard';
// import AdminDashboard from './pages/AdminService/AdminDashboard';

import AuthContext from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Role-Based Routes */}
      {user?.role === 'customer' && (
        <>
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </>
      )}

      {/* {user?.role === 'delivery' && (
        <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
      )}

      {user?.role === 'restaurant' && (
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
      )}

      {user?.role === 'admin' && (
        <Route path="/admin" element={<AdminDashboard />} />
      )} */}

      {/* Catch-all Route */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate
              to={
                user.role === 'customer' ? '/dashboard' :
                user.role === 'delivery' ? '/delivery-dashboard' :
                user.role === 'restaurant' ? '/restaurant-dashboard' :
                user.role === 'admin' ? '/admin' :
                '/'
              }
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
