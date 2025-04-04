import React from 'react';
import PaymentForm from './PaymentForm';

const OrderPayment = () => {
  const orderId = 'your-order-id';
  const amount = 29.99; // Total order amount

  return (
    <div>
      <h2>Complete Payment</h2>
      <PaymentForm 
        orderId={orderId} 
        amount={amount} 
      />
    </div>
  );
};

export default OrderPayment;