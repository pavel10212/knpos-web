const BASE_URL = `http://${process.env.NEXT_PUBLIC_IP}:3000`;

export const fetchMenuData = async () => {
  try {
    const cachedData = sessionStorage.getItem("menuData");
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(`${BASE_URL}/admin-menu-get`);
    const data = await response.json();

    sessionStorage.setItem("menuData", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return [];
  }
};

export const fetchTableData = async () => {
  try {
    const cachedLayout = sessionStorage.getItem("tableLayout");
    if (cachedLayout) {
      return JSON.parse(cachedLayout);
    }

    const response = await fetch(`${BASE_URL}/table-get`);
    if (!response.ok) {
      throw new Error("Failed to fetch tables");
    }
    const data = await response.json();
    sessionStorage.setItem("tableLayout", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error loading tables:", error);
    return [];
  }
};

export const fetchCategoryData = async () => {
  try {
    const cachedData = sessionStorage.getItem("categoryData");
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const response = await fetch(`${BASE_URL}/category-get`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    sessionStorage.setItem("categoryData", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching category data:", error);
    return [];
  }
};

export const insertCategory = async (category_name) => {
  try {
    const response = await fetch(`${BASE_URL}/category-insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "Failed to insert category");
    }

    // Clear cached data to force refresh
    sessionStorage.removeItem("categoryData");
    return await response.json();
  } catch (error) {
    console.error("Error inserting category:", error);
    throw error;
  }
};

export const fetchInventoryData = async () => {
  try {
    const cachedData = sessionStorage.getItem("inventoryData");
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(`${BASE_URL}/inventory-get`);
    const data = await response.json();
    sessionStorage.setItem("inventoryData", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return [];
  }
};

export const fetchOrderData = async () => {
  try {
    const cachedData = sessionStorage.getItem("orderData");
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(`${BASE_URL}/orders-get`);
    const data = await response.json();
    sessionStorage.setItem("orderData", JSON.stringify(data));
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

    const response = await fetch(`${BASE_URL}/table-insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tablesToSave),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "Failed to save tables");
    }

    sessionStorage.setItem("tableLayout", JSON.stringify(tablesToSave));
    return tablesToSave;
  } catch (error) {
    console.error("Error saving table layout:", error);
    throw error;
  }
};

export const deleteTable = async (tableId) => {
  try {
    const response = await fetch(`${BASE_URL}/table-delete/${tableId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete table");
    }

    // Clear cached layout to force refresh
    sessionStorage.removeItem("tableLayout");
    return true;
  } catch (error) {
    console.error("Error deleting table:", error);
    throw error;
  }
};

export const insertMenuItem = async (menuItem) => {
  try {
    const response = await fetch(`${BASE_URL}/menu-insert`, {
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

    // Clear cached data to force refresh
    sessionStorage.removeItem("menuData");
    return await response.json();
  } catch (error) {
    console.error("Error inserting menu item:", error);
    throw error;
  }
};

export const updateMenuItem = async (menuItem) => {
  try {
    const response = await fetch(`${BASE_URL}/menu-update`, {
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

    // Clear cached data to force refresh
    sessionStorage.removeItem("menuData");

    return await response.json();
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw error;
  }
};

export const deleteMenuItem = async (itemId) => {
  try {
    const response = await fetch(`${BASE_URL}/menu-delete/${itemId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    // Clear cached data to force refresh
    sessionStorage.removeItem("menuData");
    return true;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    throw error;
  }
};
