// Customer-facing API calls
// Add a utility function to handle fetch requests with timeouts
const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};

// Helper function to add cache-busting timestamp
const addCacheBusting = (url) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
};

export const fetchCustomerOrders = async (table_token) => {
  try {
    const response = await fetchWithTimeout(
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

export const callWaiter = async (table_token) => {
  try {
    const response = await fetchWithTimeout("/api/table-call-waiter/get", {
      headers: {
        "Content-Type": "application/json",
        "table-token": table_token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to call waiter");
    }
  } catch (error) {
    console.error("Error calling waiter:", error);
    throw error;
  }
};

export const callWaiterForBill = async (table_token) => {
  try {
    const response = await fetchWithTimeout("/api/table-call-waiter-for-bill/get", {
      headers: {
        "Content-Type": "application/json",
        "table-token": table_token,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to call waiter for bill");
    }
  } catch (error) {
    console.error("Error calling waiter for bill:", error);
    throw error;
  }
};


export const createInventoryItem = async (newProduct) => {
  try {
    const response = await fetchWithTimeout("/api/inventory/create", {
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
    const response = await fetchWithTimeout("/api/inventory/update", {
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
    const response = await fetchWithTimeout("/api/inventory/delete", {
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

export const addInventoryStock = async (itemId, quantityToAdd) => {
  try {
    const response = await fetchWithTimeout("/api/inventory/add-stock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inventory_item_id: itemId,
        quantity_to_add: quantityToAdd
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || "Failed to add stock");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding inventory stock:", error);
    throw error;
  }
};

export const fetchAdminMenuData = async () => {
  try {
    const cachebustedUrl = addCacheBusting("/api/admin-menu/get");
    const response = await fetchWithTimeout(cachebustedUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch admin menu data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching admin menu data:", error);
    throw error;
  }
};

export const fetchMenuData = async (token) => {
  try {
    const cachebustedUrl = addCacheBusting("/api/menu-items/get");
    const response = await fetchWithTimeout(cachebustedUrl, {
      headers: {
        "table-token": token,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
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
    const response = await fetchWithTimeout("/api/tables/get");
    const data = await response.json();
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading tables:", error);
    return [];
  }
};

export const fetchCategoryData = async () => {
  try {
    const cachebustedUrl = addCacheBusting("/api/categories/get");
    const response = await fetchWithTimeout(cachebustedUrl, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    const data = await response.json();
    return JSON.parse(data);
  } catch (error) {
    console.error("Error fetching category data:", error);
    return [];
  }
};

export const insertCategory = async (category_name) => {
  try {
    const response = await fetchWithTimeout("/api/categories/create", {
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
    const response = await fetchWithTimeout("/api/categories/delete", {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
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
    const response = await fetchWithTimeout("/api/inventory/get");
    const data = await response.json();
    return JSON.parse(data);
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return [];
  }
};

export const fetchOrderData = async () => {
  try {
    const response = await fetchWithTimeout("/api/orders/get");
    const data = await response.json();

    return JSON.parse(data);
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

    const response = await fetchWithTimeout("/api/tables/create", {
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
    const response = await fetchWithTimeout("/api/tables/delete", {
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
    const response = await fetchWithTimeout("/api/menu-items/create", {
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
    const response = await fetchWithTimeout("/api/menu-items/update", {
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
    const response = await fetchWithTimeout("/api/menu-items/delete", {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
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

export const fetchAdminSettings = async () => {
  try {
    const response = await fetchWithTimeout("/api/admin-settings/get");
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch admin settings");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    throw error;
  }
};

export const updateAdminSettings = async (settings) => {
  try {
    const response = await fetchWithTimeout("/api/admin-settings/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error("Failed to update admin settings");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating admin settings:", error);
    throw error;
  }
};

export const createAdminSettings = async (settings) => {
  try {
    const response = await fetchWithTimeout("/api/admin-settings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error("Failed to create admin settings");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating admin settings:", error);
    throw error;
  }
};

export const verifyAdminPassword = async (password) => {
  try {
    const response = await fetchWithTimeout("/api/admin-settings/get");
    if (!response.ok) {
      throw new Error("Failed to verify admin password");
    }
    const settings = await response.json();
    
    // Find the admin_password setting
    const passwordSetting = settings.find(setting => setting.setting_key === 'admin_password');
    
    if (!passwordSetting) {
      return false;
    }
    
    return password === passwordSetting.setting_value;
  } catch (error) {
    console.error("Error verifying admin password:", error);
    return false;
  }
};
