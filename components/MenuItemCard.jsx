import Image from "next/image";

export default function MenuItemCard({ menu_item_name, price, menu_item_image, onClick, onAddToCart }) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-50 rounded-xl shadow-custom overflow-hidden cursor-pointer 
                 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="relative">
        <Image
          width={400}
          height={300}
          quality={95}
          src={menu_item_image}
          alt={menu_item_name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full">
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{menu_item_name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold text-lg">{price} THB</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const item = {
                menu_item_name,
                price,
                menu_item_image,
                description: "" // Include this to match modal structure
              };
              onAddToCart(item, 1, "");
            }}
            className="w-8 h-8 text-xl font-bold text-white bg-customYellow rounded-full 
                     hover:bg-yellow-600 transition-colors flex items-center justify-center">
            +
          </button>
        </div>
      </div>
    </div>
  );
}
