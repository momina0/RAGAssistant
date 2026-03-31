/**
 * Navigation - Header with nav links
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold font-bubble text-teal-700">
          RAG Assistant
        </Link>

        <div className="flex gap-3">
          <Link
            to="/"
            className={`px-5 py-2 rounded-full font-medium transition-colors ${
              isActive('/') ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upload
          </Link>
          <Link
            to="/chat"
            className={`px-5 py-2 rounded-full font-medium transition-colors ${
              isActive('/chat') ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Chat
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
