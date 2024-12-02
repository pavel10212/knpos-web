import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  cart: [],
  addToCart: (item, quantity = 1) => set((state) => {
    const existing = state.cart.find(i => i.id === item.id);
    return {
      cart: existing
        ? state.cart.map(i => i.id === item.id
          ? { ...i, quantity: i.quantity + quantity }
          : i)
        : [...state.cart, { ...item, quantity }]
    };
  }),
  removeFromCart: (itemId) => set(state => ({
    cart: state.cart.filter(i => i.id !== itemId)
  })),
  updateQuantity: (itemId, quantity) => set(state => ({
    cart: state.cart.map(i => i.id === itemId ? { ...i, quantity } : i)
  })),
  calculateTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
}))

