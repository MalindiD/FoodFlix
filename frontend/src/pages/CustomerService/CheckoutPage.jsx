import React, { useState } from 'react';
import axios from 'axios';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!stripe || !elements) return;
    
    // Get token and check if it exists
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('Authentication token missing. Please log in again.');
      setLoading(false);
      return;
    }
    
    // Log token details for debugging
    console.log('🧪 Token available:', true);
    console.log('🧪 Token first 20 chars:', token.substring(0, 20));
    
    // Test authentication first with a simple endpoint
    try {
      const authTestUrl = 'http://localhost:3002/api/payments/health';
      console.log('🔗 Testing auth with:', authTestUrl);
      
      // Try a simple authenticated request first
      await axios.get(authTestUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Authentication test passed');
      
      // Now proceed with payment processing
      const apiUrl = 'http://localhost:3002/api/payments/process';
      console.log('🔗 Payment API URL:', apiUrl);
      
      const response = await axios.post(
        apiUrl,
        {
          // Use a valid MongoDB ObjectId format (24 hex characters)
          orderId: '6603f9a68b1a5a6c3218c4f1', // This is a valid format from your logs
          paymentMethod: 'stripe',
          amount: 2297,
          currency: 'usd', // Your logs show you're using 'usd'
          customerName: 'Test User',
          customerEmail: 'testuser@example.com',
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      const { clientSecret } = response.data.data;
      
      // Confirm the card payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      
      if (result.error) {
        setErrorMsg(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccessMsg('✅ Payment successful!');
      }
      
    } catch (error) {
      console.error('❌ Error details:', error);
      if (error.response) {
        console.error('❌ Status:', error.response.status);
        console.error('❌ Data:', error.response.data);
        setErrorMsg(error.response.data?.error || `Error ${error.response.status}`);
      } else {
        console.error('❌ Message:', error.message);
        setErrorMsg('Connection error: ' + error.message);
      }
    }
    
    setLoading(false);
  };
  
  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 shadow-xl rounded-xl">
        <h2 className="text-xl font-bold text-center mb-6 text-orange-600">Checkout</h2>

        <CardElement className="p-4 border rounded mb-4" />

        {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 mb-2">{successMsg}</p>}

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : 'Pay Rs. 2297'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;