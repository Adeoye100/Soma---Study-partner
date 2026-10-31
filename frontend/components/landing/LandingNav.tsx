import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, ChevronDown } from 'lucide-react';
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
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className="flex items-center justify-between h-16"
            aria-label="Main navigation"
          >
            {/* Logo Brand Lockup */}
            <div className="flex items-center gap-6">
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
                <div className="flex items-center gap-2">
                  <span className="font-brand font-semibold text-lg tracking-tight text-foreground">
                    Somma
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    <Sparkles className="size-2.5" />
                    Atlas
                  </span>
                </div>
              </div>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center gap-1 text-sm font-medium text-muted-foreground ml-4">
                <button
                  type="button"
                  onClick={() => handleNavClick('platform-workloads')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted/40 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span>Platform</span>
                  <ChevronDown className="size-3.5 opacity-60" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('features')}
                  className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted/40 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Features
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('how-it-works')}
                  className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted/40 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  How It Works
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('demo-preview')}
                  className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted/40 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Live Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('integrations')}
                  className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted/40 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Integrations
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('faq')}
                  className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted/40 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  FAQ
                </button>
              </div>
            </div>

            {/* Actions & Theme Controls */}
            <div className="flex items-center gap-2.5">
              <ThemeToggle />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogin}
                className="text-sm font-semibold hidden sm:inline-flex h-9 px-3.5 text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>

              <Button
                size="sm"
                onClick={handleSignUp}
                className="text-sm font-semibold h-9 px-4 rounded-lg shadow-sm active:scale-[0.98] transition-all"
              >
                Try Free
              </Button>

              {/* Mobile Hamburger Morph Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center size-9 rounded-lg border border-border text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
        </div>
      </header>

      {/* Full-Screen Glass Mobile Modal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-background/98 border-b border-border backdrop-blur-3xl px-6 py-8 lg:hidden shadow-2xl"
          >
            <div className="space-y-4 text-base font-semibold">
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                onClick={() => handleNavClick('platform-workloads')}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors border-b border-border/40"
              >
                Platform Capabilities
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => handleNavClick('features')}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors border-b border-border/40"
              >
                Features
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                onClick={() => handleNavClick('how-it-works')}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors border-b border-border/40"
              >
                How It Works
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => handleNavClick('demo-preview')}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors border-b border-border/40"
              >
                Live Demo
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                onClick={() => handleNavClick('integrations')}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors border-b border-border/40"
              >
                Integrations
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => handleNavClick('faq')}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
              >
                FAQ
              </motion.button>

              <div className="pt-4 border-t border-border flex flex-col gap-2.5">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLogin}
                  className="w-full text-sm font-semibold"
                >
                  Sign In
                </Button>
                <Button
                  size="lg"
                  onClick={handleSignUp}
                  className="w-full text-sm font-semibold"
                >
                  Try Free
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
