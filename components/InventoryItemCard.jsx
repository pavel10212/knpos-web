import React from 'react';

const InventoryItemCard = ({ name, price, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-50 rounded-xl shadow-custom overflow-hidden cursor-pointer 
                 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold text-lg">฿{price}</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemCard;
