import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const exist = cart.find(i => i._id === item._id);
    if (exist) {
      setCart(cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const increaseQty = (id) => setCart(cart.map(i => i._id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const decreaseQty = (id) => setCart(cart.map(i => i._id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  const clearCart = () => setCart([]);
  
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, increaseQty, decreaseQty, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};