import React from "react";

const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex flex-col justify-center items-center h-screen">
    <div className="relative">
      {/* Main spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>

      {/* Colored spinner overlay */}
      <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-r-transparent border-b-transparent border-l-transparent"></div>
    </div>

    {/* Loading text with pulse animation */}
    <div className="mt-6 flex items-center">
      <span className="text-xl font-medium text-gray-700 animate-pulse">
        {text}
      </span>
      <span className="ml-1 animate-bounce inline-flex">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mx-0.5 inline-block"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mx-0.5 inline-block animate-bounce delay-75"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mx-0.5 inline-block animate-bounce delay-150"></span>
      </span>
    </div>
  </div>
);

export default LoadingSpinner;
