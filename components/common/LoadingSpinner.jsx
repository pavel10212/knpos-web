const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
    <span className="ml-4 text-xl text-gray-700">Loading...</span>
  </div>
);

export default LoadingSpinner;
