import { create } from "zustand";

const fetchTableNumber = async (token) => {
  const cachedTableNum = sessionStorage.getItem("table_num");
  if (cachedTableNum) return cachedTableNum;

  try {
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_IP}:3000/find-table?token=${token}`
    );
    if (!response.ok) throw new Error("Failed to fetch table number");

    const data = await response.json();
    const tableNum = data[0].table_num;
    sessionStorage.setItem("table_num", tableNum);
    return tableNum;
  } catch (error) {
    console.error("Error fetching table number:", error);
    throw error;
  }
};

export const useUserStore = create((set) => ({
  userToken: null,
  setUserToken: (token) => set({ userToken: token }),
}));

export const useCartStore = create((set, get) => ({
  cart: [],
  setCart: (cart) => set({ cart }),
  addToCart: (item, quantity = 1) =>
    set((state) => {
      const existing = state.cart.find(
        (i) => i.menu_item_id === item.menu_item_id
      );
      return {
        cart: existing
          ? state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
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
      cart: state.cart.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
    })),
  calculateTotal: () =>
    get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),

  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ 
    orders: [...state.orders, order] 
  })),
  saveOrder: async (cart, total, token) => {
    try {
      const tableNum = await fetchTableNumber(token);

      const orderDetails = {
        table_num: tableNum,
        order_status: "Pending",
        total_amount: total,
        order_date_time: new Date().toISOString(),
        completion_date_time: null,
        order_details: {
          items: cart.map(({ id: menu_item_id, quantity }) => ({
            menu_item_id,
            quantity,
          })),
        },
      };

      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:3000/orders-insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderDetails),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to send order: ${response.statusText}`);
      }

      const savedOrder = await response.json();
      set((state) => ({ 
        orders: [...state.orders, savedOrder[0]],
      }));
      
      return savedOrder;
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  },
}));
