import React from 'react';
import { useLocation } from 'react-router-dom';

function CheckoutPage() {
  var state = useLocation().state;
  var cart = state && state.cart ? state.cart : [];
  var total = cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  return React.createElement(
    'div',
    { className: 'p-6 bg-white shadow-md max-w-2xl mx-auto mt-10 rounded-lg' },
    React.createElement('h2', { className: 'text-2xl font-bold text-dark mb-4' }, 'Checkout'),
    React.createElement(
      'ul',
      { className: 'mb-4' },
      cart.map(function (item, idx) {
        return React.createElement(
          'li',
          { key: idx, className: 'flex justify-between border-b py-2' },
          React.createElement('span', null, item.name + ' x ' + item.quantity),
          React.createElement('span', null, 'Rs. ' + item.price * item.quantity)
        );
      })
    ),
    React.createElement('div', { className: 'text-lg font-bold' }, 'Total: Rs. ' + total),
    React.createElement(
      'button',
      { className: 'mt-4 bg-primary text-white px-6 py-2 rounded hover:bg-orange-600' },
      'Confirm & Pay'
    )
  );
}

export default CheckoutPage;
