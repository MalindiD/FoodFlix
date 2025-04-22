import React from 'react';

function CartSidebar({ cart, removeFromCart }) {
  var total = cart.reduce(function (sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  return React.createElement(
    'div',
    { className: 'w-full md:w-1/4 bg-dark text-white p-4' },
    React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'Your Cart'),
    cart.length === 0
      ? React.createElement('p', null, 'No items in cart.')
      : React.createElement(
          'ul',
          null,
          cart.map(function (item, index) {
            return React.createElement(
              'li',
              { key: index, className: 'mb-2 border-b border-gray-700 pb-2' },
              React.createElement('p', null, item.name + ' x ' + item.quantity),
              React.createElement('p', null, 'Rs. ' + item.price * item.quantity),
              React.createElement(
                'button',
                {
                  onClick: function () { removeFromCart(item); },
                  className: 'text-sm text-red-400'
                },
                'Remove'
              )
            );
          })
        ),
    React.createElement('div', { className: 'mt-4 font-bold' }, 'Total: Rs. ' + total)
  );
}

export default CartSidebar;
