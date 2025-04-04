import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import axios from 'axios';

// Load Stripe with publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ orderId, amount }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);

  // Create Payment Intent
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure you have a valid token
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/payments/process`,
          {
            orderId,
            paymentMethod: 'stripe',
            amount,
            currency: 'usd',
            customerName: 'Test Customer', // Replace with actual customer name
            customerEmail: 'test@example.com' // Replace with actual email
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setClientSecret(response.data.data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment');
        console.error(err);
      }
    };

    createPaymentIntent();
  }, [orderId, amount]);

  return (
    <div className="payment-container">
      {error && <div className="payment-error">{error}</div>}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm 
            orderId={orderId} 
            clientSecret={clientSecret} 
            amount={amount}
          />
        </Elements>
      )}
    </div>
  );
};

const CheckoutForm = ({ orderId, clientSecret, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    // Get card element
    const cardElement = elements.getElement(CardElement);

    // Confirm card payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Test Customer', // Replace with actual customer name
          email: 'test@example.com' // Replace with actual email
        }
      }
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Verify payment with backend
      try {
        const token = localStorage.getItem('token');
        const verifyResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/payments/verify/${paymentIntent.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setSuccess(true);
        setProcessing(false);
        console.log('Payment Verification:', verifyResponse.data);
      } catch (verifyError) {
        setError('Payment verification failed');
        setProcessing(false);
        console.error(verifyError);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
        <label>Card Details</label>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && <div className="payment-error">{error}</div>}

      <button 
        type="submit" 
        disabled={!stripe || processing || success}
        className="payment-button"
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>

      {success && <div className="payment-success">Payment Successful!</div>}
    </form>
  );
};

export default PaymentForm;