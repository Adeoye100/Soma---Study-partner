import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAnimeEntrance } from './useAnimeEntrance';
import { useMagneticHover } from '../../utils/animeMotion';

interface LandingFooterProps {
  onScrollToSection: (id: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const startBtnRef = useMagneticHover<HTMLButtonElement>({ strength: 6 });

  const ctaRef = useAnimeEntrance<HTMLDivElement>('[data-anime]', {
    translateY: 24,
    duration: 600,
    stagger: 80,
  });

  useEffect(() => {
    if (!legalModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLegalModal(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [legalModal]);

  const handleStart = () => navigate('/login', { state: { showSignup: true } });

  return (
    <>
      {/* Bottom CTA */}
      <section className="py-24 sm:py-32 border-t border-border">
        <div ref={ctaRef} className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center space-y-5">
            <h2 data-anime className="text-3xl sm:text-4xl font-heading font-bold text-text-1">
              Ready to test yourself on your own notes?
            </h2>
            <p data-anime className="text-base text-text-2 leading-relaxed">
              Upload your first document and generate a practice quiz in under a minute.
            </p>
            <div data-anime className="flex justify-center pt-2">
              <button
                ref={startBtnRef}
                type="button"
                onClick={handleStart}
                className="inline-flex items-center px-6 py-3 rounded-none border border-white bg-white text-black text-sm font-semibold transition-all duration-200 hover:bg-zinc-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-base"
              >
                Start studying with Somma
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-border">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <p className="font-['Preospe'] font-bold text-lg text-text-1" style={{ fontFamily: "'Preospe', sans-serif" }}>Somma</p>
              <p className="text-xs text-text-2 leading-relaxed max-w-[200px]">
                Somma Study Partner. Built for focused revision and exam preparation.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-text-1">Product</p>
              <ul className="space-y-2 text-xs text-text-2">
                <li>
                  <button
                    type="button"
                    onClick={() => onScrollToSection('how-it-works')}
                    className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-none"
                  >
                    How it works
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onScrollToSection('features')}
                    className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-none"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onScrollToSection('exam-modes')}
                    className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-none"
                  >
                    Exam modes
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onScrollToSection('faq')}
                    className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-none"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-text-1">Account</p>
              <ul className="space-y-2 text-xs text-text-2">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-none"
                  >
                    Sign in
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleStart}
                    className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-none"
                  >
                    Create account
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-text-1">Legal</p>
              <ul className="space-y-2 text-xs text-text-2">
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('privacy')}
                    className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-none"
                  >
                    Privacy policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('terms')}
                    className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-none"
                  >
                    Terms of service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 text-xs text-text-3">
            <p>Copyright 2026 Somma Study Partner. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Legal modal */}
      <AnimatePresence>
        {legalModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            onClick={() => setLegalModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-none border border-border bg-surface-1 p-6 space-y-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3">
                <h3
                  id="legal-modal-title"
                  className="text-base font-heading font-bold text-text-1"
                >
                  {legalModal === 'privacy' ? 'Privacy policy' : 'Terms of service'}
                </h3>
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="rounded-none p-1 text-text-2 hover:text-text-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white border border-transparent"
                  aria-label="Close"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="text-sm text-text-2 space-y-3 leading-relaxed">
                {legalModal === 'privacy' ? (
                  <>
                    <p>
                      Your academic files belong to you. Uploaded presentations, syllabi, and
                      notes are processed only to build your practice exams and review
                      explanations.
                    </p>
                    <p>
                      We do not sell or distribute your coursework or study history. Sessions
                      and mastery stats stay private to your account.
                    </p>
                    <p>
                      You can delete uploaded documents or your account at any time.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      By using Somma you agree to use the platform for personal study and
                      educational practice.
                    </p>
                    <p>
                      You confirm you have the right to study the documents you upload. Somma
                      supports retention through retrieval practice.
                    </p>
                    <p>
                      Attempts to disrupt service, scrape content, or automate unauthorized
                      requests are not permitted.
                    </p>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="px-4 py-2 rounded-none bg-cobalt text-white text-sm font-semibold hover:bg-cobalt-mid transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingFooter;
