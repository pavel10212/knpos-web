const CategoryTabs = ({ tabs, activeTab, setActiveTab, onAddCategory }) => {
  return (
    <div className="flex space-x-4 mb-6">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`${
            activeTab === tab ? "bg-blue-500" : "bg-blue-300"
          } text-white py-2 px-4 rounded-md shadow-md focus:outline-none`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
      <button
        className="bg-gray-200 text-black py-2 px-4 rounded-md shadow-md focus:outline-none"
        onClick={onAddCategory}
      >
        +
      </button>
    </div>
  );
};

export default CategoryTabs;
