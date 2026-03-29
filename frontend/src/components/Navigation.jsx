/**
 * Navigation Component
 * Header navigation bar with Ghibli theme
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-ghibli-sage/20 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl transition-transform group-hover:scale-110">🐱</span>
            <h1 className="text-2xl font-bold ghibli-gradient-text">
              Smart AI Assistant
            </h1>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex gap-4">
            <Link
              to="/"
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-ghibli-sage text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-ghibli-cream shadow-md'
              }`}
            >
              📚 Upload
            </Link>
            <Link
              to="/chat"
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                isActive('/chat') 
                  ? 'bg-ghibli-sage text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-ghibli-cream shadow-md'
              }`}
            >
              💬 Chat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
