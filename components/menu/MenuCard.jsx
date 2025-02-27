import React from "react";
import Image from "next/image";

const MenuCard = ({ item, onDelete, onEdit }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 transition-all duration-200">
      <div className="relative h-48">
        {item.menu_item_image ? (
          <Image
            src={item.menu_item_image}
            alt={item.menu_item_name}
            className="w-full h-full object-cover rounded-lg"
            width={1920}
            height={1080}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {item.menu_item_name}
        </h2>
        <p className="text-gray-600 text-sm mt-1 mb-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-green-600 font-bold">฿{item.price}</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-2.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-colors duration-200 border-2 border-blue-600"
              title="Edit item"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="p-2.5 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors duration-200 border-2 border-red-600"
              title="Delete item"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
