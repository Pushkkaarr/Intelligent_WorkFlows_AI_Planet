import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

const features = [
  'Visual drag-and-drop builder',
  'Real-time collaboration',
  'Version control built-in',
  'One-click deployment',
];

export const ShowcaseSection = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-green-200 bg-white">
              <img 
                src="https://www.finereport.com/en/wp-content/uploads/2021/07/marketing.png" 
                alt="Dashboard Analytics" 
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 glass p-4 rounded-xl shadow-card hidden md:block animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Workflow Deployed</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
            </div>
            {/* Decorative */}
            <div className="absolute -top-4 -left-4 w-24 h-24 gradient-hero rounded-2xl opacity-15 blur-xl" />
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              Powerful Dashboard
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Monitor everything
              <br />
              <span className="gradient-text">in real-time</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Get complete visibility into your AI workflows with comprehensive analytics, 
              cost tracking, and performance monitoring—all from a single dashboard.
            </p>

            {/* Feature List */}
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 gradient-hero rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="group bg-gradient-hero hover:shadow-lg text-primary-foreground px-6 py-3 rounded-lg font-medium transition inline-flex items-center gap-2">
              Explore Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
