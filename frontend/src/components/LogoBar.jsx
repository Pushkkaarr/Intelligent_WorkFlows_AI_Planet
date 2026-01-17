import React from 'react';
import { Building2, Briefcase, Landmark, Rocket, Globe, Shield } from 'lucide-react';

const logos = [
  { icon: Building2, name: 'TechCorp' },
  { icon: Briefcase, name: 'StartupX' },
  { icon: Landmark, name: 'Enterprise' },
  { icon: Rocket, name: 'Innovation' },
  { icon: Globe, name: 'GlobalAI' },
  { icon: Shield, name: 'SecureStack' },
];

export const LogoBar = () => {
  return (
    <section className="py-16 border-y border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-widest font-medium">
          Trusted by innovative teams worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <logo.icon className="w-6 h-6" />
              <span className="font-semibold text-lg">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
