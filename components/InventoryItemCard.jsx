import React from 'react';

const InventoryItemCard = ({ name, price, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-gray-300 rounded-xl shadow-custom overflow-hidden cursor-pointer 
                 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold text-lg">{price} THB</span>
          <button className="text-sm text-white bg-customYellow px-3 py-1 rounded-full 
                           hover:bg-yellow-600 transition-colors">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemCard;
