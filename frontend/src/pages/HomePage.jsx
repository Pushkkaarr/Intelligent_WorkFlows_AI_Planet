import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Code, Layers } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Workflow Builder</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-gray-900"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-4">Build Intelligent Workflows Visually</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create powerful AI-driven workflows without writing code. Drag and drop components to build intelligent systems.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg inline-flex items-center gap-2"
        >
          Get Started
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Zap size={48} className="mx-auto mb-4 text-blue-500" />
              <h4 className="text-xl font-bold mb-2">No-Code Builder</h4>
              <p className="text-gray-600">Drag and drop interface to create workflows without coding.</p>
            </div>
            <div className="text-center">
              <Code size={48} className="mx-auto mb-4 text-purple-500" />
              <h4 className="text-xl font-bold mb-2">AI Powered</h4>
              <p className="text-gray-600">Integrate with Gemini LLM and embeddings for intelligent responses.</p>
            </div>
            <div className="text-center">
              <Layers size={48} className="mx-auto mb-4 text-green-500" />
              <h4 className="text-xl font-bold mb-2">Smart Components</h4>
              <p className="text-gray-600">Reusable components for queries, documents, LLM, and output.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">Ready to Build?</h3>
          <p className="text-lg mb-8">Join thousands of users creating powerful workflows today.</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
