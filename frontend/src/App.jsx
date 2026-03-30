/**
 * Main App Component
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
      </div>
    </BrowserRouter>
  );
}

export default App;
