const StatsCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-sm text-gray-800">{title}</h3>
    <div className="flex items-baseline mt-2">
      <p className="text-2xl text-gray-500">{value}</p>
    </div>
  </div>
);

export default StatsCard;
