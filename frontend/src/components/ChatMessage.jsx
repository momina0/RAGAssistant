/**
 * ChatMessage Component
 * Displays individual chat messages with clean styling
 */

import React from 'react';

const ChatMessage = ({ role, content, isStreaming = false }) => {
  const isUser = role === 'user';

  // User icon SVG
  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  // AI/Bot icon SVG
  const BotIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-4`}
    >
      {/* Avatar for AI (left side) */}
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-mint-200 text-gray-600">
          <BotIcon />
        </div>
      )}

      <div 
        className={`max-w-[80%] md:max-w-[70%] ${
          isUser 
            ? 'bg-blue-100 text-gray-800' 
            : 'bg-mint-100 text-gray-800'
        } rounded-3xl px-5 py-3 shadow-lg`}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block ml-1 w-2 h-5 bg-current animate-pulse"></span>
          )}
        </div>
        
        {/* Timestamp */}
        <div className="text-xs opacity-60 mt-1">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Avatar for User (right side) */}
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ml-3 bg-blue-200 text-gray-600">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
