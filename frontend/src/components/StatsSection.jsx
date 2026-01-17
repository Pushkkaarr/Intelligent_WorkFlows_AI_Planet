import React from 'react';

const stats = [
  { value: '10M+', label: 'API Calls Daily' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '150ms', label: 'Avg Response Time' },
  { value: '50+', label: 'Integrations' },
];

export const StatsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="gradient-hero rounded-3xl p-12 md:p-16 shadow-elevated">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
