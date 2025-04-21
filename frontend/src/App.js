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

import AuthContext from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Customer Routes */}
      {user?.role === 'customer' && (
        <>
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </>
      )}
      
      {/* Delivery Role Routes */}
      {user?.role === 'delivery' && (
        <>
          <Route path="/delivery-dashboard" element={<Navigate to="/dashboard" />} />
          {/* Add more delivery routes as needed */}
        </>
      )}
      
      {/* Restaurant Role Routes */}
      {user?.role === 'restaurant' && (
        <>
          <Route path="/restaurant-dashboard" element={<Navigate to="/dashboard" />} />
          {/* Add more restaurant routes as needed */}
        </>
      )}
      
      {/* Admin Role Routes */}
      {user?.role === 'admin' && (
        <>
          <Route path="/admin" element={<Navigate to="/dashboard" />} />
          {/* Add more admin routes as needed */}
        </>
      )}
      
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