import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import restaurantService from '../../api/restaurantService';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch restaurant details and menu items
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        // Fetch restaurant details
        const restaurantData = await restaurantService.getRestaurantById(id);
        setRestaurant(restaurantData.data);
        
        // Fetch menu items
        const menuData = await restaurantService.getMenuItems(id);
        setMenuItems(menuData.data || []);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch restaurant data:', err);
        setError('Failed to load restaurant details. Please try again later.');
        // Set demo data if API fails
        setRestaurant(demoRestaurant);
        setMenuItems(demoMenuItems);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantData();
  }, [id]);

  // Get unique menu categories
  const getMenuCategories = () => {
    if (!menuItems || menuItems.length === 0) return [];
    
    const categoriesSet = new Set(menuItems.map(item => item.category));
    return ['all', ...Array.from(categoriesSet)];
  };

  // Filter menu items by category
  const getFilteredMenuItems = () => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  };

  // Add item to cart
  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item => 
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter(item => item.id !== itemId);
      }
    });
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Demo data for fallback
  const demoRestaurant = {
    id: 'demo-restaurant',
    name: 'Demo Restaurant',
    description: 'This is a demo restaurant with sample menu items.',
    address: '123 Main St, Colombo',
    openingHours: '9:00 AM - 10:00 PM',
    rating: 4.5,
    reviews: '1000+',
    imageUrl: '/images/restaurant-placeholder.jpg',
    deliveryTime: '30-45 min',
    deliveryFee: 'Rs. 150'
  };

  const demoMenuItems = [
    {
      id: 'item1',
      name: 'Chicken Burger',
      description: 'Juicy chicken patty with fresh vegetables and special sauce',
      price: 650,
      category: 'Burgers',
      imageUrl: '/images/chicken-burger.jpg'
    },
    {
      id: 'item2',
      name: 'Cheese Pizza',
      description: 'Classic cheese pizza with a blend of mozzarella and cheddar',
      price: 1200,
      category: 'Pizza',
      imageUrl: '/images/cheese-pizza.jpg'
    },
    {
      id: 'item3',
      name: 'French Fries',
      description: 'Crispy golden french fries with seasoning',
      price: 350,
      category: 'Sides',
      imageUrl: '/images/french-fries.jpg'
    },
    {
      id: 'item4',
      name: 'Chocolate Milkshake',
      description: 'Rich and creamy chocolate milkshake',
      price: 450,
      category: 'Beverages',
      imageUrl: '/images/chocolate-milkshake.jpg'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f1f5]">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec5834]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f1f5]">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Link to="/dashboard" className="flex items-center text-[#ec5834] mb-6">
            <ArrowLeft className="mr-2" size={20} />
            Back to restaurants
          </Link>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f1f5]">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Link to="/dashboard" className="flex items-center text-[#ec5834] mb-6">
          <ArrowLeft className="mr-2" size={20} />
          Back to restaurants
        </Link>

        {/* Restaurant Header */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md mb-6">
          <div className="h-48 w-full relative">
            <img 
              src={restaurant?.imageUrl || '/images/restaurant-placeholder.jpg'} 
              alt={restaurant?.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/images/restaurant-placeholder.jpg';
              }}
            />
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">{restaurant?.name}</h1>
            <p className="text-gray-600 mt-1">{restaurant?.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center">
                <span className="font-semibold">⭐ {restaurant?.rating}</span>
                <span className="text-gray-500 ml-1">({restaurant?.reviews})</span>
              </div>
              <div className="text-gray-500">•</div>
              <div className="text-gray-600">{restaurant?.deliveryTime}</div>
              <div className="text-gray-500">•</div>
              <div className="text-gray-600">{restaurant?.deliveryFee}</div>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="mb-6 overflow-x-auto whitespace-nowrap pb-2">
          <div className="flex space-x-4">
            {getMenuCategories().map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === category 
                    ? 'bg-[#ec5834] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {getFilteredMenuItems().map((item) => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
              <div className="h-40 w-full relative">
                <img 
                  src={item.imageUrl || '/images/food-placeholder.jpg'} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/images/food-placeholder.jpg';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1 h-10 overflow-hidden">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-gray-800">Rs. {item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-[#ec5834] text-white p-2 rounded-full hover:bg-[#d94c2d] transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Panel (Fixed at bottom) */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl z-10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ShoppingCart className="text-[#ec5834] mr-2" />
                  <span className="font-semibold">{cart.reduce((total, item) => total + item.quantity, 0)} items</span>
                </div>
                <div className="font-bold text-lg">Rs. {getCartTotal().toFixed(2)}</div>
              </div>
              <div className="mt-3 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-t">
                    <div className="flex items-center">
                      <div className="mr-2">{item.quantity}x</div>
                      <div>{item.name}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 font-medium">Rs. {(item.price * item.quantity).toFixed(2)}</div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 transition"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="mx-2">{item.quantity}</div>
                        <button 
                          onClick={() => addToCart(item)}
                          className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full bg-[#ec5834] text-white font-semibold py-3 rounded-xl mt-4 hover:bg-[#d94c2d] transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}