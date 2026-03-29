/**
 * ChatInterface Component
 * Main chat UI with streaming responses and typing effect
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { askQuestion, checkHealth } from '../services/api';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';
import '../styles/ghibli.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasContent, setHasContent] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const eventSourceRef = useRef(null);
  const currentStreamRef = useRef('');

  // Check if content has been uploaded
  useEffect(() => {
    const checkContentStatus = async () => {
      try {
        const health = await checkHealth();
        setHasContent(health.vector_store_initialized);
      } catch (err) {
        console.error('Health check failed:', err);
      }
    };
    checkContentStatus();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    const question = inputValue.trim();
    
    if (!question) return;
    
    // Check if content has been uploaded
    if (!hasContent) {
      setError('Please upload content first before asking questions');
      return;
    }

    // Add user message
    const userMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setError('');
    setIsLoading(true);
    setIsStreaming(true);
    currentStreamRef.current = '';

    // Add placeholder AI message
    const aiMessageIndex = messages.length + 1;

    try {
      // Start SSE streaming
      eventSourceRef.current = askQuestion(
        question,
        // onToken callback
        (token) => {
          currentStreamRef.current += token;
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[aiMessageIndex];
            
            if (lastMessage && lastMessage.role === 'ai') {
              // Update existing AI message
              newMessages[aiMessageIndex] = {
                ...lastMessage,
                content: currentStreamRef.current,
              };
            } else {
              // Add new AI message
              newMessages.push({
                role: 'ai',
                content: currentStreamRef.current,
              });
            }
            
            return newMessages;
          });
          
          setIsLoading(false);
        },
        // onComplete callback
        () => {
          setIsStreaming(false);
          currentStreamRef.current = '';
        },
        // onError callback
        (err) => {
          setIsLoading(false);
          setIsStreaming(false);
          setError(err.message || 'Failed to get response');
          
          // Remove placeholder AI message if error occurred before streaming
          if (currentStreamRef.current === '') {
            setMessages(prev => prev.filter((_, idx) => idx !== aiMessageIndex));
          }
          
          currentStreamRef.current = '';
        }
      );
    } catch (err) {
      setIsLoading(false);
      setIsStreaming(false);
      setError(err.message || 'Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      setError('');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // Empty state when no content uploaded
  if (!hasContent) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="watercolor-section card p-12 text-center soft-shadow">
          <div className="text-8xl mb-6 float-animation">📚</div>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            No Content Uploaded Yet
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Please upload some content first so I can answer your questions!
          </p>
          <Link to="/" className="btn-primary text-lg inline-block">
            <span className="paw-print"></span>
            Upload Content
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl h-[calc(100vh-120px)] flex flex-col">
      {/* Chat Header */}
      <div className="card p-4 mb-4 flex items-center justify-between soft-shadow">
        <div>
          <h2 className="text-2xl font-bold ghibli-gradient-text flex items-center gap-2">
            <span>💬</span> Chat with AI
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Ask questions about your uploaded content
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="btn-secondary text-sm"
            disabled={isStreaming}
          >
            🗑️ Clear
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 card p-4 mb-4 overflow-y-auto watercolor-section">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-7xl mb-4 float-animation">🐱</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Hello! I'm your AI assistant
            </h3>
            <p className="text-gray-600 max-w-md">
              Ask me anything about the content you've uploaded. 
              I'll only answer based on what you've provided!
            </p>
            <div className="mt-6 text-left max-w-md">
              <p className="font-semibold text-gray-700 mb-2">Try asking:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-ghibli-forest">•</span>
                  <span>"What is this document about?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ghibli-forest">•</span>
                  <span>"Summarize the main points"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ghibli-forest">•</span>
                  <span>"Find information about [topic]"</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
                isStreaming={isStreaming && index === messages.length - 1}
              />
            ))}
            
            {/* Loading indicator */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start mb-4 px-4">
                <div className="bg-ghibli-mint/80 rounded-3xl px-5 py-3 shadow-lg">
                  <div className="typing-indicator text-ghibli-forest">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border-2 border-red-300 rounded-2xl text-red-800 fade-in">
          <p className="font-semibold">⚠️ {error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="card p-4 soft-shadow">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={isStreaming}
            className="input-field flex-1"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isStreaming}
            className="btn-primary px-8"
          >
            {isStreaming ? (
              <span className="inline-block animate-spin">⚙️</span>
            ) : (
              '📤 Send'
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
