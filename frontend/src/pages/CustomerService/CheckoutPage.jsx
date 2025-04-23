import React, { useState } from 'react';
import axios from 'axios';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const cartSubtotal = Number(localStorage.getItem('cartSubtotal')) || 0;
  
  const [zipCode, setZipCode] = useState('');

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#a0aec0',
        },
      },
      invalid: {
        color: '#e53e3e',
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!stripe || !elements) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('Authentication token missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      await axios.get('http://localhost:3002/api/payments/health', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axios.post(
        'http://localhost:3002/api/payments/process',
        {
          orderId: '6603f9a68b1a5a6c3218c4f1',
          paymentMethod: 'stripe',
          amount: cartSubtotal,
          currency: 'usd', // Your logs show you're using 'usd'
          customerName: 'Test User',
          customerEmail: 'testuser@example.com',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { clientSecret } = response.data.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            address: {
              postal_code: zipCode,
            },
          },
        },
      });

      if (result.error) {
        setErrorMsg(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccessMsg('✅ Payment successful!');
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data?.error || `Error ${error.response.status}`);
      } else {
        setErrorMsg('Connection error: ' + error.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b text-center">
          <h2 className="text-2xl font-bold text-gray-900">Add credit or debit card</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <div className="p-3 border rounded-md">
              <CardNumberElement options={cardStyle} />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Exp. Date</label>
              <div className="p-3 border rounded-md">
                <CardExpiryElement options={cardStyle} />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Security Code</label>
              <div className="p-3 border rounded-md">
                <CardCvcElement options={cardStyle} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP or postal code"
              className="w-full border p-3 rounded-md"
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          {successMsg ? (
            <div className="text-center">
              <p className="text-green-500 text-sm mb-3">{successMsg}</p>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold hover:bg-orange-600 transition"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
              disabled={!stripe || loading}
            >
              {loading ? 'Processing...' : `Pay Rs. ${cartSubtotal}`}
            </button>
          )}
        </form>

        <div className="text-center text-sm text-gray-500 py-4 border-t cursor-pointer hover:text-black transition">
          Cancel
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
