import React from 'react';

function MenuItemCard({ item, addToCart }) {
  return React.createElement(
    'div',
    { className: 'bg-white rounded-xl shadow p-4 hover:shadow-lg transition' },
    React.createElement('h2', { className: 'text-xl font-bold text-dark' }, item.name),
    React.createElement('p', { className: 'text-sm text-gray-500 mb-2' }, item.description),
    React.createElement('p', { className: 'text-lg font-semibold text-primary' }, 'Rs. ' + item.price),
    React.createElement(
      'button',
      {
        className: 'mt-2 px-4 py-1 bg-primary text-white rounded hover:bg-orange-600',
        onClick: function () { addToCart(item); }
      },
      'Add to Cart'
    )
  );
}

export default MenuItemCard;