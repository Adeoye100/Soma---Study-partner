import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

interface LandingNavProps {
  onScrollToSection: (id: string) => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartPracticing = () => {
    setMobileMenuOpen(false);
    navigate('/login', { state: { showSignup: true } });
  };

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  const navItems = [
    { label: 'How it works', id: 'how-it-works' },
    { label: 'Features', id: 'features' },
    { label: 'Demo', id: 'demo-preview' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <>
      {/* Floating Glass Pill Navigation Container */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 flex justify-center pointer-events-none">
        <nav
          className="pointer-events-auto w-full rounded-full backdrop-blur-md bg-surface-1/80 border border-border px-6 py-3 flex items-center justify-between gap-6 shadow-xl shadow-black/25 transition-all duration-300"
          aria-label="Main navigation"
        >
          {/* Logo Mark */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full px-1 py-0.5 text-text-1 group"
          >
            <div className="flex items-center justify-center size-7 rounded-full bg-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-200">
              <Sparkles className="size-3.5" aria-hidden="true" />
            </div>
            <span className="font-sans font-bold text-base tracking-tight text-text-1">
              Soma
            </span>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-text-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="hover:text-text-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full px-2 py-1"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              type="button"
              onClick={handleStartPracticing}
              className="hidden sm:inline-flex items-center gap-1.5 bg-accent hover:opacity-90 active:scale-[0.98] text-white rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-sm"
            >
              <span>Start practicing</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>

            {/* Mobile Hamburger Morph Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center size-9 rounded-full border border-border text-text-2 hover:text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative size-4">
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-300 ease-spring ${
                    mobileMenuOpen ? 'top-2 rotate-45 translate-y-[0px]' : 'top-1'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-300 ease-spring ${
                    mobileMenuOpen ? 'opacity-0' : 'top-2'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-300 ease-spring ${
                    mobileMenuOpen ? 'top-2 -rotate-45 -translate-y-[0px]' : 'top-3'
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Full-Screen Staggered Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 backdrop-blur-3xl bg-base/90 z-40 flex flex-col justify-center items-center px-6 py-12 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 w-full max-w-sm text-center">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  onClick={() => handleNavClick(item.id)}
                  className="text-2xl font-bold text-text-1 hover:text-accent transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{
                  duration: 0.4,
                  delay: navItems.length * 0.06,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="w-full pt-6 border-t border-border flex flex-col gap-3"
              >
                <button
                  type="button"
                  onClick={handleStartPracticing}
                  className="w-full bg-accent hover:opacity-90 active:scale-[0.98] text-white rounded-full py-3.5 text-base font-semibold transition-all shadow-lg"
                >
                  Start practicing →
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNav;
