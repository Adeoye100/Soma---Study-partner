import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
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
      {/* MongoDB START TODAY Mega CTA Banner */}
      <section className="py-24 border-t border-border bg-background relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.08) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-14 lg:p-16 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="size-3.5" />
                <span>START TODAY • ZERO FRICTION</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-foreground [text-wrap:balance]">
                Ready for your next exam? Generate your first practice test now.
              </h2>

              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed [text-wrap:pretty]">
                Turn tonight's lecture deck into a timed drill before the coffee cools.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Button
                  size="lg"
                  onClick={handleSignUp}
                  className="w-full sm:w-auto px-8 py-3.5 h-auto text-base font-semibold gap-2 rounded-xl shadow-md shadow-primary/15"
                >
                  <span>Start practicing free</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLogin}
                  className="w-full sm:w-auto px-6 py-3.5 h-auto text-base font-semibold rounded-xl"
                >
                  Sign In
                </Button>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  Instant document ingestion
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  Works on desktop, tablet, and phone
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MongoDB Multi-Column Footer */}
      <footer className="border-t border-border pt-16 pb-12 bg-card text-muted-foreground text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-border">
            {/* Brand Column */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="size-4" aria-hidden="true" />
                </div>
                <span className="font-brand font-bold text-xl text-foreground">Somma</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                The intelligent study and exam preparation platform built for hard courses. Transforming passive reading into verified active retrieval.
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>

            {/* Column 1: Platform */}
            <div className="space-y-3">
              <p className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider font-mono">
                Platform
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <button type="button" onClick={() => onScrollToSection('platform-workloads')} className="hover:text-foreground transition-colors">
                    Vector Knowledge RAG
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onScrollToSection('platform-workloads')} className="hover:text-foreground transition-colors">
                    Focus Guard Telemetry
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onScrollToSection('features')} className="hover:text-foreground transition-colors">
                    Distractor Intelligence
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onScrollToSection('features')} className="hover:text-foreground transition-colors">
                    Multi-Format Ingestion
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-3">
              <p className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider font-mono">
                Resources
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <button type="button" onClick={() => onScrollToSection('how-it-works')} className="hover:text-foreground transition-colors">
                    How It Works
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onScrollToSection('demo-preview')} className="hover:text-foreground transition-colors">
                    Interactive Exam Demo
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onScrollToSection('integrations')} className="hover:text-foreground transition-colors">
                    Integrations
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => onScrollToSection('faq')} className="hover:text-foreground transition-colors">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Account */}
            <div className="space-y-3">
              <p className="font-heading font-semibold text-foreground text-xs uppercase tracking-wider font-mono">
                Account & Legal
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <button type="button" onClick={handleLogin} className="hover:text-foreground transition-colors">
                    Sign In
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleSignUp} className="hover:text-foreground transition-colors">
                    Start Free
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setLegalModal('privacy')} className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setLegalModal('terms')} className="hover:text-foreground transition-colors">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 Somma Technologies, Inc. All rights reserved. Built for hard courses.</p>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setLegalModal('privacy')} className="hover:text-foreground transition-colors">
                Privacy
              </button>
              <button type="button" onClick={() => setLegalModal('terms')} className="hover:text-foreground transition-colors">
                Terms
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
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
              className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 id="footer-legal-title" className="text-lg font-heading font-semibold text-foreground">
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
                      By using Somma you agree to use the platform for personal study and educational practice.
                    </p>
                    <p>
                      You confirm you have the right to study the documents you upload. Somma supports retention through retrieval practice.
                    </p>
                    <p>
                      Attempts to disrupt service, scrape content, or automate unauthorized requests are not allowed.
                    </p>
                  </>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={() => setLegalModal(null)} className="text-sm font-semibold px-4 rounded-lg">
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
