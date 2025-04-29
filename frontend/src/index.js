import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// ✅ Your Stripe publishable key (not the secret)
const stripePromise = loadStripe("pk_test_51Q9OSlAkr5cb74dkseYL6K6usmrc6cCqBwny4pG8qh7Hbj6H7qYhrX1wu8D7DtVi8oRMKbtYOueVxDwWnzawcxQF00WsKDX5Yh"); // replace with your actual key


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </AuthProvider>
  </Router>
);
