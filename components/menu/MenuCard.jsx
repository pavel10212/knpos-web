import { TrashIcon } from "@heroicons/react/24/outline";

const MenuCard = ({ item, onDelete }) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
        <p className="text-gray-600 text-sm mt-1 mb-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-green-600 font-bold">{item.price}</span>
          <button
            className="text-red-600 hover:text-red-800"
            title="Remove"
            onClick={() => onDelete(item.id)}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
