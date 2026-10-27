import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '../ThemeToggle';

interface LandingNavProps {
  onScrollToSection: (id: string) => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleSignUp = () => {
    setMobileMenuOpen(false);
    navigate('/login', { state: { showSignup: true } });
  };

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  return (
    <>
      <header className="fixed top-5 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-5xl z-50">
        <nav
          className="flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full border border-border/80 bg-card/80 backdrop-blur-xl shadow-sm transition-all duration-300 ease-fluid"
          aria-label="Main navigation"
        >
          {/* Logo Brand Lockup */}
          <div
            className="flex items-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1 group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
              <BookOpen className="size-4" aria-hidden="true" />
            </div>
            <span className="font-brand font-semibold text-base sm:text-lg tracking-tight text-foreground">
              Soma
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <button
              type="button"
              onClick={() => handleNavClick('features')}
              className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('how-it-works')}
              className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('demo-preview')}
              className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5"
            >
              Live Demo
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5"
            >
              FAQ
            </button>
          </div>

          {/* Actions & Theme Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogin}
              className="text-sm font-semibold hidden sm:inline-flex h-8 px-3 text-muted-foreground hover:text-foreground"
            >
              Log in
            </Button>

            <Button
              size="sm"
              onClick={handleSignUp}
              className="text-sm font-semibold h-8 px-3.5 shadow-sm active:scale-[0.98] transition-all"
            >
              Start Practicing
            </Button>

            {/* Mobile Hamburger Morph Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative size-4">
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-300 ease-fluid ${
                    mobileMenuOpen ? 'top-2 rotate-45' : 'top-1'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-300 ease-fluid ${
                    mobileMenuOpen ? 'opacity-0' : 'top-2'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-300 ease-fluid ${
                    mobileMenuOpen ? 'top-2 -rotate-45' : 'top-3'
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Screen Glass Mobile Modal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl flex flex-col justify-center px-8 md:hidden"
          >
            <div className="space-y-6 text-xl font-semibold">
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                onClick={() => handleNavClick('features')}
                className="block text-left text-foreground hover:text-primary transition-colors"
              >
                Features
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                onClick={() => handleNavClick('how-it-works')}
                className="block text-left text-foreground hover:text-primary transition-colors"
              >
                How It Works
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                onClick={() => handleNavClick('demo-preview')}
                className="block text-left text-foreground hover:text-primary transition-colors"
              >
                Live Demo
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                onClick={() => handleNavClick('faq')}
                className="block text-left text-foreground hover:text-primary transition-colors"
              >
                FAQ
              </motion.button>

              <div className="pt-6 border-t border-border flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLogin}
                  className="w-full text-base font-semibold"
                >
                  Log in
                </Button>
                <Button
                  size="lg"
                  onClick={handleSignUp}
                  className="w-full text-base font-semibold"
                >
                  Start Practicing
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNav;
