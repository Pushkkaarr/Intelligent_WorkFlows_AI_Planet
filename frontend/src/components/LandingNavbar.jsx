import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Layers } from 'lucide-react';

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">GenAI Stack</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Features
          </a>
          <a href="#workflows" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Workflows
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Pricing
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => navigate('/login')}
            className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-4 py-2"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 mt-0 animate-fade-up">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
            <a href="#features" className="block text-gray-900 font-medium py-2 hover:text-green-600">Features</a>
            <a href="#workflows" className="block text-gray-900 font-medium py-2 hover:text-green-600">Workflows</a>
            <a href="#pricing" className="block text-gray-900 font-medium py-2 hover:text-green-600">Pricing</a>
            <hr className="border-gray-200" />
            <button 
              onClick={() => navigate('/login')}
              className="w-full text-gray-900 hover:text-green-600 transition-colors font-medium text-left py-2"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
