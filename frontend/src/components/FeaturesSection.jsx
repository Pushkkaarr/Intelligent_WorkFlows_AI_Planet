import React from 'react';
import { 
  Workflow, 
  Cpu, 
  Database, 
  Lock, 
  Gauge, 
  Puzzle,
  ArrowRight 
} from 'lucide-react';

const features = [
  {
    icon: Workflow,
    title: 'Visual Workflow Builder',
    description: 'Drag-and-drop interface to design complex AI pipelines without writing code.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Cpu,
    title: 'Multi-Model Support',
    description: 'Connect to OpenAI, Anthropic, Cohere, and open-source models all in one place.',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    icon: Database,
    title: 'Data Connectors',
    description: 'Seamlessly integrate with databases, APIs, and file storage for your workflows.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with end-to-end encryption, audit logs, and access control.',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    icon: Gauge,
    title: 'Real-time Monitoring',
    description: 'Track performance, costs, and usage with detailed analytics and alerts.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Puzzle,
    title: 'Extensible Plugins',
    description: 'Extend functionality with custom nodes, integrations, and community components.',
    color: 'bg-teal-100 text-teal-600',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-600 text-sm font-semibold rounded-full mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Everything you need to build
            <br />
            <span className="text-green-600">production-ready AI</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From prototyping to production, GenAI Stack provides the tools you need to ship AI applications faster.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-green-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
