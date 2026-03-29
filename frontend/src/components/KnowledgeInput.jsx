/**
 * KnowledgeInput Component
 * Page for uploading/pasting content to ingest
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ingestText, ingestFile } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import '../styles/ghibli.css';

const KnowledgeInput = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleTextChange = (e) => {
    setText(e.target.value);
    setMessage({ type: '', content: '' });
  };

  const handleFileSelect = (selectedFile) => {
    // Validate file type
    if (!selectedFile.name.endsWith('.txt')) {
      setMessage({ type: 'error', content: 'Only .txt files are supported' });
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', content: 'File size exceeds 5MB limit' });
      return;
    }

    setFile(selectedFile);
    setText(''); // Clear text if file is selected
    setMessage({ type: '', content: '' });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = async () => {
    // Validate input
    if (!text.trim() && !file) {
      setMessage({ type: 'error', content: 'Please provide text or upload a file' });
      return;
    }

    setIsProcessing(true);
    setMessage({ type: '', content: '' });

    try {
      let result;
      
      if (file) {
        result = await ingestFile(file);
      } else {
        result = await ingestText(text);
      }

      setMessage({ 
        type: 'success', 
        content: `✓ ${result.message} (${result.chunks_created} chunks created)` 
      });
      
      // Clear inputs after successful processing
      setText('');
      setFile(null);
      
      // Show success message for 2 seconds then allow navigation
      setTimeout(() => {
        setMessage(prev => ({ 
          ...prev, 
          content: prev.content + ' Ready to chat!' 
        }));
      }, 1000);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: error.message || 'Failed to process content' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNavigateToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="watercolor-section card p-8 soft-shadow-hover">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold ghibli-gradient-text mb-3">
            Upload Knowledge 📚
          </h2>
          <p className="text-gray-600 text-lg">
            Paste text or upload a .txt file to get started
          </p>
        </div>

        {/* Text Input Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Paste Your Content
          </label>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Paste your text here... (e.g., documentation, articles, notes)"
            disabled={isProcessing || file !== null}
            className="textarea-field min-h-[200px] max-h-[400px]"
            rows="8"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ghibli-sage/30 to-transparent"></div>
          <span className="text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ghibli-sage/30 to-transparent"></div>
        </div>

        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Upload a File
          </label>
          <div
            className={`border-3 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-ghibli-forest bg-ghibli-mint/20 scale-[1.02]' 
                : 'border-ghibli-sage/40 bg-ghibli-cream/30'
            } ${isProcessing || text ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-ghibli-mint/10'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isProcessing && !text && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              disabled={isProcessing || text !== ''}
              className="hidden"
            />
            
            <div className="text-6xl mb-3 float-animation">📄</div>
            {file ? (
              <div>
                <p className="text-ghibli-forest font-semibold text-lg mb-2">
                  Selected: {file.name}
                </p>
                <p className="text-gray-600 text-sm">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="mt-3 text-red-500 hover:text-red-700 font-medium"
                  disabled={isProcessing}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 font-semibold text-lg mb-2">
                  Drag & drop your .txt file here
                </p>
                <p className="text-gray-500 text-sm">
                  or click to browse (max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message.content && (
          <div 
            className={`mb-6 p-4 rounded-2xl fade-in ${
              message.type === 'success' 
                ? 'bg-ghibli-mint/50 text-green-800 border-2 border-ghibli-forest/30' 
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}
          >
            <p className="font-semibold">{message.content}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleProcess}
            disabled={isProcessing || (!text.trim() && !file)}
            className="btn-primary text-lg flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="inline-block animate-spin">⚙️</span>
                Processing...
              </>
            ) : (
              <>
                <span className="paw-print"></span>
                Process Content
              </>
            )}
          </button>
          
          {message.type === 'success' && (
            <button
              onClick={handleNavigateToChat}
              className="btn-primary bg-ghibli-sky hover:bg-ghibli-sky/80 text-lg"
            >
              Go to Chat 💬
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {isProcessing && (
          <div className="mt-8">
            <LoadingSpinner message="Processing your content..." />
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 card p-6 bg-gradient-to-br from-ghibli-lavender/20 to-ghibli-peach/20">
        <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span>💡</span> Tips for Best Results
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-ghibli-forest mt-1">•</span>
            <span>Provide clear, well-structured content for better answers</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ghibli-forest mt-1">•</span>
            <span>The AI will ONLY answer from your uploaded content</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-ghibli-forest mt-1">•</span>
            <span>Upload documentation, articles, notes, or any text-based knowledge</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KnowledgeInput;
