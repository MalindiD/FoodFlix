import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Increase item quantity
  const increaseQuantity = (itemId) => {
    setCart(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease item quantity
  const decreaseQuantity = (itemId) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      if (existingItem.quantity > 1) {
        return prev.map(item => 
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter(item => item.id !== itemId);
      }
    });
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate delivery fee
  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    return subtotal > 1500 ? 0 : 150; // Free delivery for orders above Rs 1500
  };

  // Calculate total
  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!address) {
      alert('Please enter your delivery address');
      return;
    }

    setLoading(true);
    
    try {
      // Create order object
      const order = {
        items: cart,
        subtotal: getSubtotal(),
        deliveryFee: getDeliveryFee(),
        total: getTotal(),
        paymentMethod,
        deliveryAddress: address
      };

      // TODO: Make API call to create order
      // const response = await orderService.createOrder(order);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart
      setCart([]);
      localStorage.removeItem('cart');
      
      // Navigate to success page or order confirmation
      navigate('/order-success');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f1f5]">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Link to="/dashboard" className="flex items-center text-[#ec5834] mb-6">
          <ArrowLeft className="mr-2" size={20} />
          Back to restaurants
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items from restaurants to start an order</p>
            <Link 
              to="/dashboard" 
              className="bg-[#ec5834] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#d94c2d] transition"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                  
                  <div className="divide-y">
                    {cart.map((item) => (
                      <div key={item.id} className="py-4 flex justify-between">
                        <div className="flex items-start">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                            <img 
                              src={item.imageUrl || '/images/food-placeholder.jpg'} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = '/images/food-placeholder.jpg';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            <p className="text-gray-500 text-sm">{item.description}</p>
                            <p className="mt-1 text-gray-800 font-medium">Rs. {item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 mb-2"
                          >
                            <Trash2 size={18} />
                          </button>
                          
                          <div className="flex items-center mt-1">
                            <button 
                              onClick={() => decreaseQuantity(item.id)}
                              className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="mx-3 w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => increaseQuantity(item.id)}
                              className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-4">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">Rs. {getSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">
                        {getDeliveryFee() === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `Rs. ${getDeliveryFee().toFixed(2)}`
                        )}
                      </span>
                    </div>
                    
                    <div className="border-t pt-4 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg">Rs. {getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Delivery Address</h3>
                    <textarea
                      className="w-full border rounded-lg p-2 text-sm"
                      rows="3"
                      placeholder="Enter your delivery address here..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="card"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="mr-2"
                        />
                        <label htmlFor="card" className="flex items-center">
                          <CreditCard size={18} className="mr-2 text-blue-500" />
                          Card Payment
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="cod"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mr-2"
                        />
                        <label htmlFor="cod">Cash on Delivery</label>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                    className="w-full bg-[#ec5834] text-white font-semibold py-3 rounded-xl mt-6 hover:bg-[#d94c2d] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}