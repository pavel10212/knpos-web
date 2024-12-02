const FloorTabs = ({
  floors,
  activeFloor,
  setActiveFloor,
  onAddFloor,
  onSave,
}) => {
  return (
    <div className="flex space-x-2 mb-6">
      {floors.map((floor) => (
        <button
          key={floor.id}
          className={`${
            activeFloor === floor.id ? "bg-blue-500" : "bg-blue-300"
          } text-white py-2 px-4 rounded-md shadow-md focus:outline-none`}
          onClick={() => setActiveFloor(floor.id)}
        >
          Floor {floor.id}
        </button>
      ))}
      <button
        onClick={onAddFloor}
        className="bg-gray-200 text-black py-2 px-4 rounded-md shadow-md focus:outline-none"
      >
        +
      </button>
      <button
        onClick={onSave}
        className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md focus:outline-none"
      >
        Save Layout
      </button>
    </div>
  );
};

export default FloorTabs;
