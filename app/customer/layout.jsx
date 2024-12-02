"use client";

import { CartProvider } from "@/components/context/CartContext";

export default function CustomerLayout({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}