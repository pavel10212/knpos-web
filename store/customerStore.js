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

  addToCart: (item, quantity = 1, request) =>
    set((state) => {
      const itemId = item.isInventoryItem
        ? item.inventory_item_id
        : item.menu_item_id;
      const existing = state.cart.find(
        (i) =>
          (i.isInventoryItem ? i.inventory_item_id : i.menu_item_id) ===
            itemId && i.request === request
      );

      if (existing) {
        return {
          cart: state.cart.map((i) =>
            (i.isInventoryItem ? i.inventory_item_id : i.menu_item_id) ===
            itemId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        cart: [...state.cart, { ...item, quantity, request }],
      };
    }),

  removeFromCart: (itemId) =>
    set((state) => ({
      cart: state.cart.filter(
        (i) =>
          (i.isInventoryItem ? i.inventory_item_id : i.menu_item_id) !== itemId
      ),
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        (i.isInventoryItem ? i.inventory_item_id : i.menu_item_id) === itemId
          ? { ...i, quantity }
          : i
      ),
    })),

  calculateTotal: () =>
    get().cart.reduce(
      (sum, item) =>
        sum +
        (item.isInventoryItem ? item.cost_per_unit : item.price) *
          item.quantity,
      0
    ),

  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
  saveOrder: async (cart, total, token) => {
    try {
      const tableNum = await fetchTableNumber(token);

      const orderDetails = {
        table_num: tableNum.toString(),
        order_status: "Pending",
        total_amount: total,
        order_date_time: new Date().toISOString(),
        completion_date_time: null,
        order_details: JSON.stringify(
          cart.map((item) => {
            if (item.isInventoryItem) {
              return {
                inventory_item_id: item.inventory_item_id,
                type: "inventory",
                status: "pending",
                quantity: item.quantity,
                request: item.request,
                unit_price: item.cost_per_unit,
              };
            }
            return {
              menu_item_id: item.menu_item_id,
              type: "menu",
              status: "pending",
              quantity: item.quantity,
              request: item.request,
              unit_price: item.price,
            };
          })
        ),
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
