import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const benefits = [
  'Free tier with 10,000 API calls/month',
  'No credit card required to start',
  'Deploy in under 5 minutes',
];

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Ready to build the future?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of developers shipping AI-powered applications with GenAI Stack. Start building today.
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-foreground">
              <div className="w-5 h-5 gradient-hero rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
              {benefit}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/register')}
            className="group bg-gradient-hero hover:shadow-lg text-primary-foreground px-8 py-4 rounded-lg font-medium transition inline-flex items-center gap-2 justify-center"
          >
            Start Building Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            className="group border border-border hover:border-primary text-foreground px-8 py-4 rounded-lg font-medium transition"
          >
            Talk to Sales
          </button>
        </div>
      </div>
    </section>
  );
};
