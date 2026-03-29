/**
 * ChatMessage Component
 * Displays individual chat messages with Ghibli styling
 */

import React from 'react';
import '../styles/ghibli.css';

const ChatMessage = ({ role, content, isStreaming = false }) => {
  const isUser = role === 'user';
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-4 ${
        isUser ? 'message-user' : 'message-ai'
      }`}
    >
      <div 
        className={`max-w-[80%] md:max-w-[70%] ${
          isUser 
            ? 'bg-gradient-to-br from-ghibli-sky to-ghibli-sky/80 text-gray-800' 
            : 'bg-gradient-to-br from-ghibli-mint to-ghibli-mint/80 text-gray-800 cat-ear'
        } rounded-3xl px-5 py-3 shadow-lg relative`}
        style={{
          color: isUser ? 'inherit' : '#2d4a2b',
        }}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block ml-1 w-2 h-5 bg-current animate-pulse"></span>
          )}
        </div>
        
        {/* Timestamp (optional) */}
        <div className="text-xs opacity-60 mt-1">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-2xl ${
        isUser ? 'ml-3 bg-ghibli-lavender/30' : 'mr-3 bg-ghibli-peach/30'
      }`}>
        {isUser ? '👤' : '🐱'}
      </div>
    </div>
  );
};

export default ChatMessage;
