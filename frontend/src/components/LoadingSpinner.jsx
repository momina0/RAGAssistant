/**
 * LoadingSpinner Component
 * Cute Ghibli-themed loading animation with soot sprite
 */

import React from 'react';
import '../styles/ghibli.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="soot-sprite"></div>
      <p className="text-gray-600 font-medium animate-pulse-soft">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
