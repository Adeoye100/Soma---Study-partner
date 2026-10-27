import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNav from './landing/LandingNav';
import HeroSection from './landing/HeroSection';
import SocialProofSection from './landing/SocialProofSection';
import LevelUpSection from './landing/LevelUpSection';
import TaglineRevealSection from './landing/TaglineRevealSection';
import PlatformWorkloadsSection from './landing/PlatformWorkloadsSection';
import BentoFeatureGrid from './landing/BentoFeatureGrid';
import ProblemSolutionSection from './landing/ProblemSolutionSection';
import HowItWorksTimeline from './landing/HowItWorksTimeline';
import TechStackSection from './landing/TechStackSection';
import FaqSection from './landing/FaqSection';
import LandingFooter from './landing/LandingFooter';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartFree = () => {
    navigate('/login', { state: { showSignup: true } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-md focus:outline-none"
      >
        Skip to content
      </a>

      <LandingNav onScrollToSection={scrollToSection} />

      <main id="main-content">
        <HeroSection onScrollToDemo={() => scrollToSection('demo-preview')} />
        <SocialProofSection />
        <LevelUpSection onScrollToSection={scrollToSection} />
        <TaglineRevealSection />
        <PlatformWorkloadsSection onStartFree={handleStartFree} />
        <BentoFeatureGrid />
        <ProblemSolutionSection />
        <HowItWorksTimeline />
        <TechStackSection />
        <FaqSection />
        <LandingFooter onScrollToSection={scrollToSection} />
      </main>
    </div>
  );
};

export default LandingPage;
