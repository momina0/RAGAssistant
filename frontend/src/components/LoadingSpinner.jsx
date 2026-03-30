/**
 * LoadingSpinner - Simple loading indicator
 */
import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-teal-600 rounded-full animate-spin"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
