import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const InventoryTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-300">
          <tr>
            <th className="px-6 py-3">Product ID</th>
            <th className="px-6 py-3">Product</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Sales Channel</th>
            <th className="px-6 py-3">Stock Level</th>
            <th className="px-6 py-3">Max Capacity</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-black">{item.id}</td>
              <td className="px-6 py-4 text-black">{item.product}</td>
              <td className="px-6 py-4 text-black">{item.category}</td>
              <td className="px-6 py-4 text-black">{item.channel}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.stock <= 50
                      ? "bg-red-100 text-red-800"
                      : item.stock <= 100
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.stock} items
                </span>
              </td>
              <td className="px-6 py-4 text-black">{item.maxCapacity} items</td>
              <td className="px-6 py-4 flex space-x-3">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
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
