import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],
  addToCart: (item, quantity = 1) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      return {
        cart: existing
          ? state.cart.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          : [...state.cart, { ...item, quantity }],
      };
    }),
  removeFromCart: (itemId) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.id !== itemId),
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      ),
    })),
  calculateTotal: () =>
    get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),

  // New saveOrder function
  saveOrder: async (cart, total) => {
    const orderDetails = {
      order_status: "Pending",
      total_amount: total,
      order_date_time: new Date().toISOString(),
      completion_date_time: null,
      order_details: {
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      },
    };

    try {
      const response = await fetch("http://44.202.118.242:3000/orders-insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to send the order");
      }

      const data = await response.json();
      console.log("Order saved successfully:", data);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  },
}));
