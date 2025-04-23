import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl p-8 shadow-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Payment Successful!</h2>
        <p className="text-gray-700 mb-6">Thank you for your order. Your payment has been received.</p>

        <button
          onClick={() => navigate('/dashboard')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
