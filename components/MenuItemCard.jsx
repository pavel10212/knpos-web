import Image from "next/image";

export default function MenuItemCard({ menu_item_name, price, menu_item_image, onClick }) {
  return (
    <div
      onClick={onClick}
>
      <div className="relative">
        <Image
          width={400}
          height={300}
          quality={95}
          src={menu_item_image}
          alt={menu_item_name} className="w-full h-48 object-cover rounded-md" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{menu_item_name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold text-lg">฿{price}</span>
        </div>
      </div>
    </div>
  );
}
