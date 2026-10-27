import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '../ThemeToggle';

interface LandingFooterProps {
  onScrollToSection: (id: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  useEffect(() => {
    if (!legalModal) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLegalModal(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [legalModal]);

  const handleSignUp = () => {
    navigate('/login', { state: { showSignup: true } });
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <section className="py-20 sm:py-28 border-t border-border bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-14">
            <div className="space-y-6 max-w-[680px] mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
                Ready for your next exam? Generate your first practice test now.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground [text-wrap:pretty]">
                Turn tonight's lecture deck into a timed drill before the coffee cools.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={handleSignUp}
                  className="w-full sm:w-auto px-3 py-2 h-auto min-h-10 text-base font-semibold gap-2"
                >
                  <span>Start practicing free</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required. Works on desktop, tablet, and phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-4 sm:px-6 bg-card text-muted-foreground text-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-7 rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-3.5" aria-hidden="true" />
            </div>
            <span className="font-brand font-semibold text-foreground">Soma</span>
            <span className="text-xs">© 2026 Soma. Built for hard courses.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm">
            <button type="button" onClick={handleLogin} className="hover:text-foreground transition-colors duration-200 ease-fluid focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
              Log in
            </button>
            <button type="button" onClick={handleSignUp} className="hover:text-foreground transition-colors duration-200 ease-fluid focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
              Sign up
            </button>
            <button type="button" onClick={() => onScrollToSection('features')} className="hover:text-foreground transition-colors duration-200 ease-fluid focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
              Features
            </button>
            <button type="button" onClick={() => onScrollToSection('faq')} className="hover:text-foreground transition-colors duration-200 ease-fluid focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
              FAQ
            </button>
            <button type="button" onClick={() => setLegalModal('privacy')} className="hover:text-foreground transition-colors duration-200 ease-fluid focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
              Privacy
            </button>
            <button type="button" onClick={() => setLegalModal('terms')} className="hover:text-foreground transition-colors duration-200 ease-fluid focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
              Terms
            </button>
            <ThemeToggle />
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {legalModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="footer-legal-title"
            onClick={() => setLegalModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="t-modal w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 id="footer-legal-title" className="text-lg font-semibold text-foreground">
                  {legalModal === 'privacy' ? 'Privacy notice' : 'Terms of service'}
                </h3>
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Close legal dialog"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="text-sm text-muted-foreground space-y-3 leading-relaxed [text-wrap:pretty]">
                {legalModal === 'privacy' ? (
                  <>
                    <p>
                      Your academic files belong to you. Uploaded presentations, syllabi, and notes are processed only to build your mock exams and rationales.
                    </p>
                    <p>
                      We do not sell or distribute your coursework or study history. Sessions and mastery stats stay private to your account.
                    </p>
                    <p>
                      You can delete uploaded documents or your account at any time.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      By using Soma you agree to use the platform for personal study and educational practice.
                    </p>
                    <p>
                      You confirm you have the right to study the documents you upload. Soma supports retention through retrieval practice.
                    </p>
                    <p>
                      Attempts to disrupt service, scrape content, or automate unauthorized requests are not allowed.
                    </p>
                  </>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={() => setLegalModal(null)} className="text-sm font-semibold px-3">
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingFooter;
