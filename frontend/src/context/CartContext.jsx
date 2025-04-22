import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Calculate subtotal from cart
  const subtotal = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);

  // Save subtotal to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartSubtotal', subtotal);
  }, [subtotal]);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find(
        (x) => x.id === item.id && x.restaurantId === item.restaurantId
      );
      if (found) {
        return prev.map((x) =>
          x.id === item.id && x.restaurantId === item.restaurantId
            ? { ...x, quantity: x.quantity + 1 }
            : x
        );
      } else {
        // Only allow one restaurant at a time
        if (
          prev.length > 0 &&
          prev[0].restaurantId !== item.restaurantId
        ) {
          if (
            !window.confirm(
              "Adding items from a different restaurant will clear your cart. Continue?"
            )
          )
            return prev;
          return [{ ...item, quantity: 1 }];
        }
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    setIsOpen(true);
  };

  const increase = (id) => {
    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, quantity: x.quantity + 1 } : x))
    );
  };

  const decrease = (id) => {
    setCart((prev) =>
      prev
        .map((x) =>
          x.id === id ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x
        )
        .filter((x) => x.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increase,
        decrease,
        removeItem,
        subtotal,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
