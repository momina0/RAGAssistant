/**
 * API Service - Backend communication
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Health check
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Ingest text
export const ingestText = async (text) => {
  const response = await api.post('/ingest', { text });
  return response.data;
};

// Ingest file
export const ingestFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/ingest', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Ask question with SSE streaming
export const askQuestion = (question, onToken, onComplete, onError) => {
  const url = `${API_URL}/ask?question=${encodeURIComponent(question)}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    if (event.data === '[DONE]') {
      eventSource.close();
      onComplete();
    } else {
      onToken(event.data);
    }
  };

  eventSource.onerror = () => {
    eventSource.close();
    onError(new Error('Connection failed'));
  };

  return eventSource;
};
