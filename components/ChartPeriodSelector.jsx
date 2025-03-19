const ChartPeriodSelector = ({ activePeriod, onChange }) => {
  const periods = ["Daily", "Weekly", "Monthly", "Yearly"];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period.toLowerCase())}
          className={`px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg ${
            activePeriod === period.toLowerCase()
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          } transition-colors duration-200 flex-grow sm:flex-grow-0`}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default ChartPeriodSelector;
