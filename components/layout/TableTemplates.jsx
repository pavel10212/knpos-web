const TableTemplates = ({ predefinedTables, onDragStart }) => {
  return (
    <div className="p-4 border-gray-300 bg-white rounded-2xl">
      <h2 className="text-black text-lg font-bold mb-4">Table Templates</h2>
      <div className="flex space-x-4">
        {predefinedTables.map((table, index) => (
          <div
            key={index}
            className={`flex items-center justify-center border-2 border-gray-400 bg-white cursor-move 
              hover:border-blue-600 hover:shadow-lg hover:bg-blue-50 transition-all ${
                table.shape === "circle" ? "rounded-full" : "rounded-lg"
              } ${table.size}`}
            draggable
            onDragStart={(e) => onDragStart(e, table.type, true)}
          >
            <span className="text-center text-base font-semibold text-gray-800">
              {table.type === "2-seater"
                ? "2"
                : table.type === "6-seater"
                ? "6"
                : "4"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableTemplates;
