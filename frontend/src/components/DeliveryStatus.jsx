import React from 'react';
import './DeliveryStatus.css';

const DeliveryStatus = ({ orderStatus, deliveryStatus }) => {
  // Generate human-readable status message
  const getStatusMessage = () => {
    if (orderStatus === 'Pending') {
      return 'Your order is being processed';
    }
    
    if (orderStatus === 'Confirmed') {
      return 'Your order has been confirmed';
    }
    
    if (orderStatus === 'Preparing') {
      return 'Restaurant is preparing your food';
    }
    
    if (orderStatus === 'Out for Delivery') {
      if (deliveryStatus === 'Picked Up') {
        return 'Driver has picked up your order';
      }
      if (deliveryStatus === 'On The Way') {
        return 'Driver is on the way to your location';
      }
      return 'Your order is out for delivery';
    }
    
    if (orderStatus === 'Delivered') {
      return 'Your order has been delivered. Enjoy your meal!';
    }
    
    if (orderStatus === 'Cancelled') {
      return 'Your order has been cancelled';
    }
    
    return 'Tracking your order...';
  };

  return (
    <div className="delivery-status">
      <h2>{getStatusMessage()}</h2>
      
      {deliveryStatus === 'On The Way' && (
        <div className="estimated-time">
          <span className="icon">⏱️</span>
          <span>Estimated arrival: 15-20 minutes</span>
        </div>
      )}
    </div>
  );
};

export default DeliveryStatus;
