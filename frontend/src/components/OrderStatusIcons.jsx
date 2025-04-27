import React from 'react';
import './OrderStatusIcons.css';

const OrderStatusIcons = ({ activeStep }) => {
  const steps = [
    { icon: '🧾', label: 'Confirmed' },
    { icon: '🍕', label: 'Preparing' },
    { icon: '🍳', label: 'Cooking' },
    { icon: '🛵', label: 'Delivery' },
  ];

  return (
    <div className="status-icons-container">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`status-step ${index <= activeStep - 1 ? 'active' : ''}`}
        >
          <div className="icon-container">{step.icon}</div>
          <span className="step-label">{step.label}</span>
          {index < steps.length - 1 && <div className="step-connector"></div>}
        </div>
      ))}
    </div>
  );
};

export default OrderStatusIcons;
