// Customer-facing API calls

export const fetchCustomerOrders = async (table_token) => {
  try {
    const response = await fetch(
      `/api/orders-for-table/get?table_token=${table_token}`,
      {
        headers: {
          "table-token": table_token,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch orders");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }
};

export const createOrder = async (orderDetails, token) => {
  try {
    const response = await fetch("/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDetails),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Admin-facing API calls
export const fetchInventoryItem = async () => {
  try {
    const response = await fetch("/api/inventory/get");
    if (!response.ok) throw new Error("Failed to fetch inventory");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createInventoryItem = async (newProduct) => {
  try {
    const response = await fetch("/api/inventory/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    if (!response.ok) throw new Error("Failed to create inventory item");
    return await response.json();
  } catch (error) {
    console.error("Error creating inventory item:", error);
    throw error;
  }
};

export const updateInventoryItem = async (editStock, itemId) => {
  try {
    const response = await fetch("/api/inventory/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editStock,
        inventory_item_id: itemId,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "Failed to update inventory item");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
};

export const deleteInventoryItem = async (itemId) => {
  try {
    const response = await fetch("/api/inventory/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: itemId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "Failed to delete inventory item");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    throw error;
  }
};

export const fetchMenuData = async (token) => {
  try {
    const response = await fetch("/api/menu-items/get", {
      headers: {
        "table-token": token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch menu data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching menu data:", error);
    throw error;
  }
};

export const fetchTableData = async () => {
  try {
    const response = await fetch("/api/tables/get");
    return await response.json();
  } catch (error) {
    console.error("Error loading tables:", error);
    return [];
  }
};

export const fetchCategoryData = async () => {
  try {
    const response = await fetch("/api/categories/get");
    return await response.json();
  } catch (error) {
    console.error("Error fetching category data:", error);
    return [];
  }
};

export const insertCategory = async (category_name) => {
  try {
    const response = await fetch("/api/categories/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "Failed to insert category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error inserting category:", error);
    throw error;
  }
};

export const deleteCategory = async (category_id) => {
  try {
    const response = await fetch("/api/categories/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_id }),
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || "Failed to delete category");
      }
      return data;
    } else {
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      return true;
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const fetchInventoryData = async () => {
  try {
    const response = await fetch("/api/inventory/get");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return [];
  }
};

export const fetchOrderData = async () => {
  try {
    const response = await fetch("/api/orders/get");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders data:", error);
    return [];
  }
};

export const saveTableLayout = async (tables) => {
  try {
    const tablesToSave = tables.map((table) => ({
      table_num: parseInt(table.id),
      status: "Available",
      capacity: parseInt(table.type[0]),
      location: { x: parseInt(table.x), y: parseInt(table.y) },
      rotation: parseInt(table.rotation),
    }));

    const response = await fetch("/api/tables/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tablesToSave),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "Failed to save tables");
    }

    return tablesToSave;
  } catch (error) {
    console.error("Error saving table layout:", error);
    throw error;
  }
};

export const deleteTable = async (table_num) => {
  try {
    const response = await fetch("/api/tables/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_num }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "Failed to delete table");
    }

    return true;
  } catch (error) {
    console.error("Error deleting table:", error);
    throw error;
  }
};

export const insertMenuItem = async (menuItem) => {
  try {
    const response = await fetch("/api/menu-items/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menu_item_name: menuItem.title,
        price: parseFloat(menuItem.price),
        description: menuItem.description,
        category_id: parseInt(menuItem.category),
        menu_item_image: menuItem.imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save menu item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error inserting menu item:", error);
    throw error;
  }
};

export const updateMenuItem = async (menuItem) => {
  try {
    const response = await fetch("/api/menu-items/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menu_item_id: menuItem.id,
        menu_item_name: menuItem.title,
        price: parseFloat(menuItem.price),
        description: menuItem.description,
        category_id: parseInt(menuItem.category),
        menu_item_image: menuItem.imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update menu item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
};

export const deleteMenuItem = async (itemId) => {
  try {
    const response = await fetch("/api/menu-items/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "Delete failed");
    }

    return true;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
};
