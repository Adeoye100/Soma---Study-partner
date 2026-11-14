import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import InteractiveExamPreview from './InteractiveExamPreview';

interface HeroSectionProps {
  onScrollToDemo: () => void;
}

const ease = [0.32, 0.72, 0, 1] as const;

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToDemo }) => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/login', { state: { showSignup: true } });
  };

  const headlineLine1 = ['Turn', '80', 'slides', 'into', 'a', 'timed', 'practice', 'exam'];
  const headlineLine2 = ['in', '30', 'seconds.'];

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy Block */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* 3.1 — Kicker pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-mute text-accent text-xs font-semibold px-3 py-1"
            >
              <span>✦</span>
              <span>AI Exam Engine · Built for rigorous coursework</span>
            </motion.div>

            {/* 3.2 — Headline (GSAP / Stagger entrance) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-display text-text-1 leading-[1.08]">
              <div className="overflow-hidden flex flex-wrap gap-x-2.5 sm:gap-x-3">
                {headlineLine1.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
              <div className="overflow-hidden flex flex-wrap gap-x-2.5 sm:gap-x-3 mt-1 sm:mt-2 text-accent">
                {headlineLine2.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: (headlineLine1.length + i) * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </h1>

            {/* 3.3 — Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
              className="text-lg text-text-2 max-w-[560px] leading-relaxed [text-wrap:pretty]"
            >
              Upload your lecture notes, syllabus, or textbook chapters. Soma extracts the testable concepts, drafts realistic distractors, and explains exactly why the wrong answers fail.
            </motion.p>

            {/* 3.4 — CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                type="button"
                onClick={handleStartFree}
                className="bg-accent hover:opacity-90 active:scale-[0.98] text-white rounded-full px-6 py-3.5 text-base font-semibold transition-all duration-200 shadow-lg shadow-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center gap-2"
              >
                <span>Create your first exam — free</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onScrollToDemo}
                className="rounded-full border border-border bg-surface-2/60 hover:bg-surface-2 text-text-1 hover:text-accent px-5 py-3.5 text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent flex items-center gap-2 active:scale-[0.98]"
              >
                <span>Try interactive demo</span>
                <ArrowDown className="size-4" aria-hidden="true" />
              </button>
            </motion.div>

            {/* 3.5 — Proof ribbon */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="text-sm text-text-3 pt-2"
            >
              Used in 340+ courses: Organic Chemistry II · Corporate Finance · Neurobiology · Constitutional Law
            </motion.p>
          </div>

          {/* Right Column: 3.6 — Interactive Exam Preview Card */}
          <motion.div
            id="demo-preview"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="lg:col-span-5 w-full"
          >
            <InteractiveExamPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
