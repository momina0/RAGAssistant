/**
 * KnowledgeInput - Upload content page
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ingestText, ingestFile } from '../services/api';

const KnowledgeInput = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.txt')) {
      setMessage({ type: 'error', content: 'Only .txt files are supported' });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', content: 'File size exceeds 5MB limit' });
      return;
    }

    setFile(selectedFile);
    setText('');
    setMessage({ type: '', content: '' });
  };

  const handleProcess = async () => {
    if (!text.trim() && !file) {
      setMessage({ type: 'error', content: 'Please provide text or upload a file' });
      return;
    }

    setIsProcessing(true);
    setMessage({ type: '', content: '' });

    try {
      const result = file ? await ingestFile(file) : await ingestText(text);
      setMessage({
        type: 'success',
        content: `${result.message} (${result.chunks_created} chunks created)`
      });
      setText('');
      setFile(null);
    } catch (error) {
      setMessage({ type: 'error', content: error.message || 'Failed to process content' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-teal-700 mb-2">Upload Knowledge</h2>
          <p className="text-gray-600">Paste text or upload a .txt file</p>
        </div>

        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Paste Content</label>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setMessage({ type: '', content: '' }); }}
            placeholder="Paste your text here..."
            disabled={isProcessing || file !== null}
            className="textarea-field min-h-[180px]"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Upload File</label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              ${file ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:bg-gray-50'}
              ${isProcessing || text ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            {file ? (
              <div>
                <p className="text-teal-700 font-medium">{file.name}</p>
                <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-2 text-red-500 text-sm hover:underline"
                  disabled={isProcessing}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-700">Click to select a .txt file</p>
                <p className="text-gray-500 text-sm mt-1">Max 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {message.content && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message.content}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleProcess}
            disabled={isProcessing || (!text.trim() && !file)}
            className="btn-primary"
          >
            {isProcessing ? 'Processing...' : 'Process Content'}
          </button>

          {message.type === 'success' && (
            <button onClick={() => navigate('/chat')} className="btn-secondary">
              Go to Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeInput;
