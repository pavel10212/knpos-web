import React, { useState, useEffect } from 'react';

/**
 * ChartWrapper component isolates chart instances to prevent React key conflicts
 * by fully unmounting and remounting the chart on specific dependency changes.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The chart component to render
 * @param {Array} props.dependencies - Array of dependencies that should trigger chart remount
 */
const ChartWrapper = ({ children, dependencies = [] }) => {
  const [key, setKey] = useState(Date.now());
  
  // Reset the key whenever dependencies change, forcing a full remount
  useEffect(() => {
    setKey(Date.now());
  }, dependencies);
  
  return (
    <div key={key} className="chart-wrapper">
      {children}
    </div>
  );
};

export default ChartWrapper;