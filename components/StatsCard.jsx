const StatsCard = ({ title, value, icon }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
    <div className="relative bg-white p-6 rounded-xl border border-gray-100 shadow-xl transform hover:scale-[1.02] transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <span className="flex items-center justify-center">{icon}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-xl"></div>
    </div>
  </div>
);

export default StatsCard;
