import { useMemo } from "react";

const PopularItems = ({ orders, menuItems }) => {
  const popularItems = useMemo(() => {
    const itemStats = orders.reduce((acc, order) => {
      order.order_details.forEach((detail) => {
        if (detail.type === "menu") {
          if (!acc[detail.menu_item_id]) {
            acc[detail.menu_item_id] = { orders: 0, revenue: 0 };
          }
          acc[detail.menu_item_id].orders += detail.quantity;
        }
      });
      return acc;
    }, {});

    const flatMenuItems = Object.values(menuItems).flat();

    return Object.entries(itemStats)
      .map(([itemId, stats]) => {
        const menuItem = flatMenuItems.find(
          (item) =>
            item.id === parseInt(itemId) ||
            item.menu_item_id === parseInt(itemId)
        );
        const price = menuItem ? parseFloat(menuItem.price) : 0;
        return {
          name: menuItem?.menu_item_name || `Unknown Item ${itemId}`,
          orders: stats.orders,
          revenue: price * stats.orders,
        };
      })
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 4);
  }, [orders, menuItems]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Popular Items
      </h2>
      <div className="space-y-4">
        {popularItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-black">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.orders} orders</p>
            </div>
            <span className="font-medium text-black">
              ฿{item.revenue.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularItems;
