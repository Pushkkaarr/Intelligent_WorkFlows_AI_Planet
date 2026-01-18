import React from 'react';
import { LandingNavbar } from '../components/LandingNavbar';
import { HeroSection } from '../components/HeroSection';
import { LogoBar } from '../components/LogoBar';
import { FeaturesSection } from '../components/FeaturesSection';
import { ShowcaseSection } from '../components/ShowcaseSection';
import { WorkflowShowcase } from '../components/WorkflowShowcase';
import { StatsSection } from '../components/StatsSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <HeroSection />
      <LogoBar />
      <FeaturesSection />
      <ShowcaseSection />
      <WorkflowShowcase />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
};
