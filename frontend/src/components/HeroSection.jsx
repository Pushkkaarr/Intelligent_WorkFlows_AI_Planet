import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Bot } from 'lucide-react';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-12 bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-100/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-32 left-20 hidden lg:block animate-float">
        <div className="glass p-4 rounded-2xl shadow-card">
          <Sparkles className="w-8 h-8 text-green-600" />
        </div>
      </div>
      <div className="absolute top-48 right-32 hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
        <div className="glass p-4 rounded-2xl shadow-card">
          <Zap className="w-8 h-8 text-teal-500" />
        </div>
      </div>
      <div className="absolute bottom-48 left-32 hidden lg:block animate-float" style={{ animationDelay: '4s' }}>
        <div className="glass p-4 rounded-2xl shadow-card">
          <Bot className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Text Content */}
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Now with GPT-4o & Claude 3.5</span>
          </div>

          {/* Main Heading */}
          <h1 className="animate-fade-up-delay-1 text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
            Build AI Workflows
            <br />
            <span className="text-green-600">10x Faster</span>
          </h1>

          {/* Subheading */}
          <p className="animate-fade-up-delay-2 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create powerful generative AI applications with drag-and-drop simplicity. 
            Connect models, data sources, and outputs in minutes, not months.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/register')}
              className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg text-white px-8 py-4 rounded-lg font-medium transition inline-flex items-center gap-2"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              className="group border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg font-medium transition inline-flex items-center gap-2"
            >
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="animate-fade-up-delay-4 mt-12 flex flex-col items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm">
              <span className="font-semibold text-gray-900">2,500+</span> developers building with GenAI Stack
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="animate-fade-up-delay-4 relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-green-200 bg-white p-1">
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-teal-50 p-8 text-center">
              <div className="w-full h-96 bg-gradient-to-br from-green-100/50 to-teal-100/50 rounded-lg flex items-center justify-center">
                <div className="text-6xl font-bold text-green-600">AI Workflow</div>
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl opacity-20 blur-xl" />
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl opacity-20 blur-xl" />
        </div>
      </div>
    </section>
  );
};
