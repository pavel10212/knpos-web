import Image from "next/image";

export default function MenuItemCard({ name, price, rating, image, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-300 rounded-xl shadow-custom overflow-hidden cursor-pointer 
                 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="relative">
        <Image
          width={70}
          height={70}
          src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full">
          <div className="flex items-center text-sm">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
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
}
