import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItemCard from '../components/MenuItemCard';
import CartSidebar from '../components/CartSidebar';
import { useNavigate } from 'react-router-dom';

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(function () {
    axios.get('http://localhost:4001/api/restaurants/67e5a6f867431037543a038b/menu-items')
      .then(function (res) { setMenuItems(res.data); })
      .catch(function (err) { console.error('Error fetching menu:', err); });
  }, []);

  function addToCart(item) {
    var existing = cart.find(function (i) { return i.menuItemId === item._id; });
    if (existing) {
      setCart(cart.map(function (i) {
        return i.menuItemId === item._id ? Object.assign({}, i, { quantity: i.quantity + 1 }) : i;
      }));
    } else {
      setCart(cart.concat(Object.assign({}, item, { menuItemId: item._id, quantity: 1 })));
    }
  }

  function removeFromCart(item) {
    setCart(cart.filter(function (i) { return i.menuItemId !== item.menuItemId; }));
  }

  return React.createElement(
    'div',
    { className: 'flex flex-col md:flex-row min-h-screen bg-gray-50' },
    React.createElement(
      'div',
      { className: 'flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },
      menuItems.map(function (item) {
        return React.createElement(MenuItemCard, { key: item._id, item: item, addToCart: addToCart });
      })
    ),
    React.createElement(CartSidebar, { cart: cart, removeFromCart: removeFromCart }),
    React.createElement(
      'div',
      { className: 'fixed bottom-4 right-4' },
      React.createElement(
        'button',
        {
          className: 'bg-primary text-white px-6 py-2 rounded-lg shadow-lg hover:bg-orange-600',
          onClick: function () { navigate('/checkout', { state: { cart: cart } }); }
        },
        'Checkout'
      )
    )
  );
}

export default MenuPage;
