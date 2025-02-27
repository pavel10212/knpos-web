import React from "react";

const ChartPeriodSelector = ({ activePeriod, onChange }) => {
  const periods = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
  ];

  return (
    <div className="flex flex-wrap gap-1 md:gap-2">
      {periods.map((period) => (
        <button
          key={period.id}
          className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-full transition-colors ${
            activePeriod === period.id
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => onChange(period.id)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default ChartPeriodSelector;
