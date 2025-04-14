import React from 'react';
import OrderPayment from '../components/Payment/OrderPayment';

const PaymentPage = () => {
  // You might get these from context, props, or state
  const orderId = 'your-order-id';
  const amount = 29.99;

  return (
    <div className="payment-page">
      <h1>Complete Your Payment</h1>
      <OrderPayment 
        orderId={orderId} 
        amount={amount} 
      />
    </div>
  );
};

export default PaymentPage;