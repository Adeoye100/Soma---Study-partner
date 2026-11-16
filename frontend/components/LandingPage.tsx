import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNav from './landing/LandingNav';
import HeroSection from './landing/HeroSection';
import HowItWorksTimeline from './landing/HowItWorksTimeline';
import BentoFeatureGrid from './landing/BentoFeatureGrid';
import UseCaseColumnsSection from './landing/UseCaseColumnsSection';
import FaqSection from './landing/FaqSection';
import LandingFooter from './landing/LandingFooter';
import VideoBackground from './landing/VideoBackground';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-base text-text-1 selection:bg-cobalt/20 selection:text-text-1 transition-colors duration-200">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cobalt focus:text-white focus:rounded-none focus:outline-none text-xs font-semibold"
      >
        Skip to content
      </a>

      {/* Full-bleed video background — fixed, z-0, behind everything */}
      <VideoBackground />

      {/* Nav sits above the video */}
      <LandingNav onScrollToSection={scrollToSection} />

      {/* All page content sits above the video via z-1 (landing-content class) */}
      <main id="main-content" className="landing-content">
        <HeroSection onScrollToDemo={() => scrollToSection('demo-preview')} />
        <HowItWorksTimeline />
        <BentoFeatureGrid />
        <UseCaseColumnsSection />
        <FaqSection />
        <LandingFooter onScrollToSection={scrollToSection} />
      </main>
    </div>
  );
};

export default LandingPage;
