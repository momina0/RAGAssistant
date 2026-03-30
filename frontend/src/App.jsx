/**
 * Main App Component
 * React Router setup and application structure
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import KnowledgeInput from './components/KnowledgeInput';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-mint">
        <Navigation />
        
        <main className="pb-8">
          <Routes>
            <Route path="/" element={<KnowledgeInput />} />
            <Route path="/chat" element={<ChatInterface />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="py-6 text-center text-gray-600 text-sm">
          <p>Made with React, FastAPI, LangChain and Groq</p>
          <p className="mt-1 text-xs">
            Powered by <span className="font-semibold">llama-3.3-70b-versatile</span>
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
