import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">⚙️</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">GenAI Stack</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4 text-gray-900">My Stacks</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Build generative AI applications with our essential tools and frameworks
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium inline-flex items-center gap-2 transition"
          >
            + New Stack
          </button>
        </div>

        {/* Stacks Grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stack Card 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chat With AI</h3>
                <p className="text-sm text-gray-600 mt-1">Chat with a smart AI</p>
              </div>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                Edit Stack <ArrowRight size={14} />
              </a>
            </div>

            {/* Stack Card 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Content Writer</h3>
                <p className="text-sm text-gray-600 mt-1">Helps you write content</p>
              </div>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                Edit Stack <ArrowRight size={14} />
              </a>
            </div>

            {/* Stack Card 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Content Summarizer</h3>
                <p className="text-sm text-gray-600 mt-1">Helps you summarize content</p>
              </div>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                Edit Stack <ArrowRight size={14} />
              </a>
            </div>

            {/* Stack Card 4 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Information Finder</h3>
                <p className="text-sm text-gray-600 mt-1">Helps you find relevant information</p>
              </div>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                Edit Stack <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
