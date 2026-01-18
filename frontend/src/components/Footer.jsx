import React from 'react';
import { Layers, Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Templates', 'Pricing', 'Changelog'],
  Resources: ['Documentation', 'API Reference', 'Guides', 'Blog'],
  Company: ['About', 'Careers', 'Contact', 'Partners'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background">GenAI Stack</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed mb-6">
              Build AI applications faster with our visual workflow builder.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-background mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © 2026 GenAI Stack. All rights reserved.
          </p>
          <p className="text-background/60 text-sm">
            Made with ♥ for developers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};
