const ChartPeriodSelector = ({ activePeriod, onChange }) => {
  const periods = ["Daily", "Weekly", "Monthly", "Yearly"];

  return (
    <div className="flex space-x-2 mb-4">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period.toLowerCase())}
          className={`px-4 py-2 rounded-lg ${
            activePeriod === period.toLowerCase()
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          } transition-colors duration-200`}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default ChartPeriodSelector;
