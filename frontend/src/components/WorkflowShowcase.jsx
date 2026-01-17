import React from 'react';
import { MessageSquare, FileText, Search, Lightbulb, ArrowRight, Check } from 'lucide-react';

const stacks = [
  {
    icon: MessageSquare,
    title: 'Chat With AI',
    description: 'Build conversational AI assistants with memory and context awareness.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: FileText,
    title: 'Content Writer',
    description: 'Generate blog posts, marketing copy, and documentation at scale.',
    gradient: 'from-accent to-primary',
  },
  {
    icon: Search,
    title: 'Information Finder',
    description: 'Create intelligent search systems with semantic understanding.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: Lightbulb,
    title: 'Content Summarizer',
    description: 'Distill long documents into actionable insights automatically.',
    gradient: 'from-accent to-primary',
  },
];

export const WorkflowShowcase = () => {
  return (
    <section id="workflows" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
              Pre-built Stacks
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Start with templates,
              <br />
              <span className="gradient-text">customize everything</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Get started in seconds with battle-tested workflow templates. Each stack is fully customizable and ready for production use.
            </p>
            <button className="group bg-gradient-hero hover:shadow-lg text-primary-foreground px-6 py-3 rounded-lg font-medium transition inline-flex items-center gap-2">
              Explore All Templates
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stacks.map((stack, index) => (
              <div
                key={index}
                className="group relative p-6 bg-card rounded-2xl border border-border hover-lift overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stack.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center mb-4 shadow-soft">
                    <stack.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {stack.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stack.description}
                  </p>
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-1 text-primary font-medium text-sm"
                  >
                    Use Template <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
