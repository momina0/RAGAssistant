/**
 * ChatInterface - Main chat UI with streaming responses
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { askQuestion, checkHealth } from '../services/api';
import ChatMessage from './ChatMessage';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasContent, setHasContent] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const streamRef = useRef('');

  // Check if content exists on mount
  useEffect(() => {
    checkHealth()
      .then(health => setHasContent(health.vector_store_initialized))
      .catch(() => {});
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    if (!hasContent) {
      setError('Please upload content first');
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setInput('');
    setError('');
    setIsLoading(true);
    streamRef.current = '';

    askQuestion(
      question,
      // On each token
      (token) => {
        streamRef.current += token;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'ai') {
            return [...prev.slice(0, -1), { role: 'ai', content: streamRef.current }];
          }
          return [...prev, { role: 'ai', content: streamRef.current }];
        });
      },
      // On complete
      () => {
        setIsLoading(false);
        streamRef.current = '';
      },
      // On error
      (err) => {
        setIsLoading(false);
        setError(err.message || 'Failed to get response');
        streamRef.current = '';
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (window.confirm('Clear chat history?')) {
      setMessages([]);
      setError('');
    }
  };

  // No content uploaded yet
  if (!hasContent) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No Content Yet</h2>
          <p className="text-gray-600 mb-6">Upload some content first to start chatting.</p>
          <Link to="/" className="btn-primary">Upload Content</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="card p-4 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Chat</h2>
          <p className="text-gray-500 text-sm">Ask questions about your content</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="btn-secondary text-sm" disabled={isLoading}>
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 card p-4 mb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Ask a question to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="text-gray-500 text-sm">Thinking...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="card p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="input-field flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="btn-primary px-6"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
