/**
 * API Service for Smart AI Assistant
 * Handles all backend communication
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Health check to verify backend is running
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Backend service is unavailable');
  }
};

/**
 * Ingest text content to the backend
 * @param {string} text - Text content to ingest
 * @returns {Promise<Object>} Ingestion result
 */
export const ingestText = async (text) => {
  try {
    const response = await apiClient.post('/ingest', { text });
    return response.data;
  } catch (error) {
    console.error('Ingest text failed:', error);
    const message = error.response?.data?.detail || 'Failed to process content';
    throw new Error(message);
  }
};

/**
 * Upload and ingest a file
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Ingestion result
 */
export const ingestFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/ingest', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Ingest file failed:', error);
    const message = error.response?.data?.detail || 'Failed to upload file';
    throw new Error(message);
  }
};

/**
 * Ask a question with Server-Sent Events (SSE) streaming
 * @param {string} question - Question to ask
 * @param {Function} onToken - Callback for each token received
 * @param {Function} onComplete - Callback when streaming completes
 * @param {Function} onError - Callback for errors
 * @returns {EventSource} EventSource instance (for cleanup)
 */
export const askQuestion = (question, onToken, onComplete, onError) => {
  const encodedQuestion = encodeURIComponent(question);
  const url = `${API_BASE_URL}/ask?question=${encodedQuestion}`;
  
  const eventSource = new EventSource(url);
  
  eventSource.onmessage = (event) => {
    const data = event.data;
    
    if (data === '[DONE]') {
      eventSource.close();
      onComplete();
    } else {
      onToken(data);
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    eventSource.close();
    
    // Check if this is a "no content" error
    if (error.target.readyState === EventSource.CLOSED) {
      onError(new Error('Connection closed. Please try again.'));
    } else {
      onError(new Error('Failed to get response from AI'));
    }
  };
  
  // Return the EventSource so it can be closed if needed
  return eventSource;
};

/**
 * Clear the vector store (optional utility)
 * @returns {Promise<Object>} Clear result
 */
export const clearVectorStore = async () => {
  try {
    const response = await apiClient.post('/clear');
    return response.data;
  } catch (error) {
    console.error('Clear vector store failed:', error);
    const message = error.response?.data?.detail || 'Failed to clear vector store';
    throw new Error(message);
  }
};

export default {
  checkHealth,
  ingestText,
  ingestFile,
  askQuestion,
  clearVectorStore,
};
