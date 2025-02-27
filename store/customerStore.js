import {create} from "zustand";

const fetchTableNumber = async (token) => {
    if (typeof window !== "undefined") {
        const cachedTableNum = sessionStorage.getItem("table_num");
        if (cachedTableNum) return cachedTableNum;
    }

    try {
        const response = await fetch(`/api/find-table?token=${token}`);
        if (!response.ok) throw new Error("Failed to fetch table number");

        const data = await response.json();
        const tableNum = data[0].table_num;
        if (typeof window !== "undefined") {
            sessionStorage.setItem("table_num", tableNum);
        }
        return tableNum;
    } catch (error) {
        console.error("Error fetching table number:", error);
        throw error;
    }
};

export const useDataStore = create((set, get) => ({
    menuItems:
        typeof window !== "undefined"
            ? JSON.parse(sessionStorage.getItem("menuItems") || "[]")
            : [],
    setMenuItems: (menuItems) => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("menuItems", JSON.stringify(menuItems));
        }
        set({menuItems});
    },

    inventoryItems:
        typeof window !== "undefined"
            ? JSON.parse(sessionStorage.getItem("inventoryItems") || "[]")
            : [],
    setInventoryItems: (inventoryItems) => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("inventoryItems", JSON.stringify(inventoryItems));
        }
        set({inventoryItems});
    },

    categories:
        typeof window !== "undefined"
            ? JSON.parse(sessionStorage.getItem("categories") || "[]")
            : [],
    setCategoryItems: (categories) => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("categories", JSON.stringify(categories));
        }
        set({categories});
    },
}));

export const useCartStore = create((set, get) => ({
    cart: [],
    setCart: (cart) => set({cart}),

    addToCart: (item, quantity = 1, request) =>
        set((state) => {
            const isInventoryItem = item.menu_item_id?.toString().startsWith('inventory-');
            const newItems = Array(quantity)
                .fill(null)
                .map(() => ({
                    ...item,
                    type: isInventoryItem ? "inventory" : "menu",
                    inventory_item_id: isInventoryItem ? item.menu_item_id.split('-')[1] : undefined,
                    menu_item_id: isInventoryItem ? undefined : item.menu_item_id,
                    request,
                    cartItemId: Math.random().toString(36).substr(2, 9),
                    isInventoryItem,
                }));
            return {cart: [...state.cart, ...newItems]};
        }),

    updateRequest: (cartItemId, newRequest) =>
        set((state) => ({
            cart: state.cart.map((item) =>
                item.cartItemId === cartItemId ? {...item, request: newRequest} : item
            ),
        })),

    removeFromCart: (cartItemId) =>
        set((state) => ({
            cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
        })),

    calculateTotal: () =>
        get().cart.reduce(
            (sum, item) =>
                sum + (item.type === "inventory" ? item.price : item.price),
            0
        ),

    orders: [],
    setOrders: (orders) => set({orders}),
    addOrder: (order) =>
        set((state) => ({
            orders: [...state.orders, order],
        })),

    saveOrder: async (cart, total, token) => {
        try {
            const tableNum = await fetchTableNumber(token);
            const calculatedTotal = get().calculateTotal(); // Ensure we have a valid total

            const orderDetails = {
                table_num: tableNum.toString(),
                order_status: "Pending",
                total_amount: calculatedTotal, // Use calculated total
                order_date_time: new Date().toISOString(),
                completion_date_time: null,
                order_details: JSON.stringify(
                    cart.map((item) => ({
                        type: item.type,
                        status: "pending",
                        cartItemId: item.cartItemId,
                        quantity: 1,
                        request: item.request,
                        ...(item.type === "inventory"
                                ? {inventory_item_id: parseInt(item.inventory_item_id)}
                                : {menu_item_id: item.menu_item_id}
                        ),
                    }))
                ),
            };

            const response = await fetch("/api/orders/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
                    "table-token": token,
                },
                body: JSON.stringify(orderDetails),
            });

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
