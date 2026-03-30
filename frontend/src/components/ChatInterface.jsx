/**
 * ChatInterface Component
 * Main chat UI with streaming responses and typing effect
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { askQuestion, checkHealth } from '../services/api';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';

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

    try {
      // Start SSE streaming
      eventSourceRef.current = askQuestion(
        question,
        // onToken callback
        (token) => {
          currentStreamRef.current += token;
          
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            
            if (lastMessage && lastMessage.role === 'ai') {
              // Update existing AI message
              newMessages[newMessages.length - 1] = {
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
            setMessages(prev => {
              const filtered = prev.filter((msg, idx) => 
                !(idx === prev.length - 1 && msg.role === 'ai')
              );
              return filtered;
            });
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

  // Book icon SVG
  const BookIcon = () => (
    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  // Chat icon SVG
  const ChatIcon = () => (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );

  // Send icon SVG
  const SendIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );

  // Trash icon SVG
  const TrashIcon = () => (
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  // Warning icon SVG
  const WarningIcon = () => (
    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  // Empty state when no content uploaded
  if (!hasContent) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-6">
            <BookIcon />
          </div>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            No Content Uploaded Yet
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Please upload some content first so I can answer your questions!
          </p>
          <Link to="/" className="btn-primary text-lg inline-block">
            Upload Content
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl h-[calc(100vh-120px)] flex flex-col">
      {/* Chat Header */}
      <div className="card p-4 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Chat with AI
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Ask questions about your uploaded content
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="btn-secondary text-sm flex items-center"
            disabled={isStreaming}
          >
            <TrashIcon />
            Clear
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 card p-4 mb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="mb-4">
              <ChatIcon />
            </div>
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
                  <span className="text-mint-600">•</span>
                  <span>"What is this document about?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mint-600">•</span>
                  <span>"Summarize the main points"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mint-600">•</span>
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
                <div className="bg-mint-100 rounded-3xl px-5 py-3 shadow-lg">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
        <div className="mb-4 p-3 bg-red-100 border-2 border-red-300 rounded-2xl text-red-800 flex items-center">
          <WarningIcon />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="card p-4">
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
            className="btn-primary px-6 flex items-center gap-2"
          >
            {isStreaming ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <SendIcon />
                Send
              </>
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
