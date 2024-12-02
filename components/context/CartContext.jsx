"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Initialize the context with default values
const CartContext = createContext({
  cart: [],
  setCart: () => {},
  addToCart: () => {},
  orders: [],
  saveOrder: () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Initialize cart and orders from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setCart(savedCart);
    setOrders(savedOrders);
  }, []);

  // Sync cart and orders to localStorage whenever they update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [cart, orders]);

  // Ensure addToCart is properly defined
  const addToCart = (item, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  const saveOrder = (orderItems, total) => {
    const newOrder = {
      id: Date.now(),
      items: orderItems,
      total: total,
      date: new Date().toISOString(),
      status: 'completed'
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  // Provide all values in the context
  const value = {
    cart,
    setCart,
    addToCart,
    orders,
    saveOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
