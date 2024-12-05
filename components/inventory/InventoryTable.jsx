import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const InventoryTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-300">
          <tr>
            <th className="px-6 py-3">Product ID</th>
            <th className="px-6 py-3">Product</th>
            <th className="px-6 py-3">Price Per Product</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Sales Channel</th>
            <th className="px-6 py-3">Stock Level</th>
            <th className="px-6 py-3">Max Capacity</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.inventory_item_id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-black">{item.inventory_item_id}</td>
              <td className="px-6 py-4 text-black">{item.inventory_item_name}</td>
              <td className="px-6 py-4 text-black">{item.cost_per_unit}</td>
              <td className="px-6 py-4 text-black">{item.category}</td>
              <td className="px-6 py-4 text-black">{item.sales_channel}</td>
              <td className="px-6 py-4 text-black">{item.quantity} {item.unit}</td>
              <td className="px-6 py-4 text-black">{item.max_quantity} {item.unit}</td>
              <td className="px-6 py-4 flex space-x-3">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(item.inventory_item_id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
