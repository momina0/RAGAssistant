/**
 * Navigation Component
 * Header navigation bar
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center gap-2 group">
            <h1 className="text-2xl font-bold text-teal-700">
              Smart AI Assistant
            </h1>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex gap-4">
            <Link
              to="/"
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-teal-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
              }`}
            >
              Upload
            </Link>
            <Link
              to="/chat"
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                isActive('/chat') 
                  ? 'bg-teal-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200'
              }`}
            >
              Chat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
