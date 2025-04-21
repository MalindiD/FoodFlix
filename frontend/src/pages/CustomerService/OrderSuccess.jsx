import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';

export default function OrderSuccess() {
  // Generate a random order number
  const orderNumber = React.useMemo(() => {
    return 'FD' + Math.floor(100000 + Math.random() * 900000);
  }, []);
  
  // Estimated delivery time (random between 30-60 minutes)
  const estimatedTime = React.useMemo(() => {
    return Math.floor(30 + Math.random() * 30);
  }, []);

  // Clear cart on successful order
  useEffect(() => {
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f1f5]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">Your order has been received and is being processed.</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold">{orderNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-semibold">{estimatedTime} minutes</span>
              </div>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-600 text-sm">
                We've sent a confirmation email with all the details of your order.
                You can track your order status in the app.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link 
                to="/orders" 
                className="inline-flex items-center justify-center bg-[#ec5834] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#d94c2d] transition"
              >
                Track My Order
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}