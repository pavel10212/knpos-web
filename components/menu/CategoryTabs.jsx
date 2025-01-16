const CategoryTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex items-center">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 ${
            activeTab === tab
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-800 hover:bg-gray-200"
          } rounded-lg mr-2 last:mr-0 transition-colors duration-200`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
