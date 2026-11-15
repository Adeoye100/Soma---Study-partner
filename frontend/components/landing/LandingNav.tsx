import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';

interface LandingNavProps {
  onScrollToSection: (id: string) => void;
}

const NAV_ITEMS = [
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Features', id: 'features' },
  { label: 'Exam modes', id: 'exam-modes' },
  { label: 'FAQ', id: 'faq' },
];

export const LandingNav: React.FC<LandingNavProps> = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleOpenWorkspace = () => {
    setMobileOpen(false);
    navigate('/login', { state: { showSignup: true } });
  };

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    onScrollToSection(id);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-base/90 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent backdrop-blur-sm'
        }`}
      >
        <nav
          className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6"
          aria-label="Main navigation"
        >
          {/* Brand */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-heading font-bold text-lg text-text-1 tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt rounded"
          >
            Soma
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className="px-3 py-2 rounded text-sm text-text-2 hover:text-text-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleOpenWorkspace}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-md bg-cobalt text-white text-sm font-semibold transition-all duration-200 hover:bg-cobalt-mid active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-base"
            >
              Open workspace
            </button>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center size-9 rounded text-text-2 hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <div className="relative size-4">
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mobileOpen ? 'top-2 rotate-45' : 'top-1'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-200 ${
                    mobileOpen ? 'opacity-0 scale-x-0' : 'top-2 opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    mobileOpen ? 'top-2 -rotate-45' : 'top-3'
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-base/95 backdrop-blur-xl flex flex-col pt-20 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className="text-left text-2xl font-heading font-bold text-text-1 py-3 border-b border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt rounded"
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.35,
                  delay: NAV_ITEMS.length * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="pt-6"
              >
                <button
                  type="button"
                  onClick={handleOpenWorkspace}
                  className="w-full py-3.5 rounded-md bg-cobalt text-white font-semibold text-base active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                >
                  Open workspace
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNav;
