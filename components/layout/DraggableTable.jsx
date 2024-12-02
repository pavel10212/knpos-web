const DraggableTable = ({ table, onDragStart, onRotate, onRemove }) => {
  return (
    <div
      className={`absolute flex flex-col items-center justify-center border-2 ${
        table.status === "occupied"
          ? "border-red-400 bg-red-50"
          : table.status === "reserved"
          ? "border-yellow-400 bg-yellow-50"
          : "border-gray-400 bg-white"
      } cursor-move hover:border-blue-600 hover:shadow-lg transition-all ${
        table.type === "2-seater"
          ? "rounded-full w-24 h-24"
          : table.type === "6-seater"
          ? "rounded-lg w-48 h-32"
          : "rounded-lg w-32 h-32"
      }`}
      style={{
        left: `${table.x}px`,
        top: `${table.y}px`,
        transform: `rotate(${table.rotation}deg)`,
      }}
      draggable
      onDragStart={(e) => onDragStart(e, table.id, false)}
    >
      <span className="text-center text-base font-semibold whitespace-pre text-gray-800">
        {table.label}
      </span>
      <div className="absolute top-1 right-1 flex space-x-1">
        <button
          onClick={() => onRotate(table.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          ⟳
        </button>
        <button
          onClick={() => onRemove(table.id)}
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default DraggableTable;
