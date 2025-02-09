const BASE_URL = `http://${process.env.NEXT_PUBLIC_IP}:3000`;

export const fetchMenuData = async () => {
  try {
    const cachedData = sessionStorage.getItem("menuData");
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(`${BASE_URL}/admin-menu-get`);
    const data = await response.json();
    
    // Group items by category
    const groupedData = data.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    sessionStorage.setItem("menuData", JSON.stringify(groupedData));
    return groupedData;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return {};
  }
};

export const fetchTableData = async () => {
  try {
    const cachedLayout = sessionStorage.getItem('tableLayout');
    if (cachedLayout) {
      return JSON.parse(cachedLayout);
    }

    const response = await fetch(`${BASE_URL}/table-get`);
    if (!response.ok) {
      throw new Error('Failed to fetch tables');
    }
    const data = await response.json();
    sessionStorage.setItem('tableLayout', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error loading tables:', error);
    return [];
  }
};

export const fetchInventoryData = async () => {
  try {
    const cachedData = sessionStorage.getItem('inventoryData');
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(`${BASE_URL}/inventory-get`);
    const data = await response.json();
    sessionStorage.setItem('inventoryData', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return [];
  }
};

export const fetchOrderData = async () => {
  try {
    const cachedData = sessionStorage.getItem('orderData');
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(`${BASE_URL}/orders-get`);
    const data = await response.json();
    sessionStorage.setItem('orderData', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching orders data:", error);
    return [];
  }
};
