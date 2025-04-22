import React, { useRef, useEffect } from "react";
import { X, Plus, Minus} from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link,useNavigate  } from "react-router-dom";

export default function CartPopup() {
  const { cart, increase, decrease, removeItem, subtotal, isOpen, setIsOpen } = useCart();
  const ref = useRef();
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handle = (e) => {
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const restaurantName = cart[0]?.restaurantName || "Your Cart";
  const itemCount = cart.reduce((a, b) => a + b.quantity, 0);

  const handleBrowseClick = () => {
    setIsOpen(false); // Close the popup
    navigate('/dashboard'); // Redirect to dashboard
  };
  

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-end overflow-hidden">
      <div
        ref={ref}
        className="w-full max-w-md bg-white shadow-xl flex flex-col h-screen pt-4"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button
            className="rounded-full p-2 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <X size={28} />
          </button>
          <div className="text-2xl font-bold text-center flex-1">
            {restaurantName}
          </div>
        </div>
        <div className="flex items-center gap-2 px-6 py-3">
          <button className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium flex items-center gap-1"
          onClick={() => setIsOpen(false)}
          >
            <Plus size={16} /> Add items
          </button>
          <div className="ml-auto text-gray-600 text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </div>
          <div className="ml-2 font-semibold">
            Subtotal: <span className="font-bold">LKR {subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              Add items from restaurants to start an order
              <button
                onClick={handleBrowseClick}
                className="block mx-auto mt-4 bg-black text-white rounded px-4 py-2"
                >
                Browse Restaurants
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 border-b"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-full">
                    <button
                      className="p-1 px-2 hover:bg-gray-100"
                      onClick={() => decrease(item.id)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      className="p-1 px-2 hover:bg-gray-100"
                      onClick={() => increase(item.id)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="ml-3 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-3">
                    LKR {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}
                  </span>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-6 py-4 border-t">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 mb-3"
            placeholder="Add an order note"
          />
          <div className="flex justify-between mb-4">
            <span className="font-medium">Subtotal</span>
            <span className="font-bold">
              LKR {subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}
            </span>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-black text-white text-center py-3 rounded font-semibold text-lg"
          >
            Go to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
