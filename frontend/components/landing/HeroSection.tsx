import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-50"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.06) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="font-brand text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground [text-wrap:balance]"
        >
          Soma
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold tracking-tight max-w-[680px] mx-auto [text-wrap:balance] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 to-neutral-500 dark:from-white dark:to-neutral-400"
        >
          Turn 80 slide lecture decks
          <br className="hidden sm:block" />
          into realistic mock exams in 30 seconds.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease }}
          className="mt-6 text-base sm:text-lg text-muted-foreground max-w-[680px] mx-auto leading-relaxed [text-wrap:pretty]"
        >
          Upload your syllabus, lecture notes, or textbook chapters. Soma extracts core concepts,
          drafts timed practice drills, and explains exactly why distractor choices fail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            size="lg"
            onClick={handleStartFree}
            className="w-full sm:w-auto px-3 py-2 h-auto min-h-10 text-base font-semibold gap-2"
          >
            <span>Create your first exam free</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>

          <button
            type="button"
            onClick={onScrollToDemo}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 ease-fluid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-2"
          >
            Try the sample question
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          No credit card required. Used across 340 courses from organic chemistry to corporate finance.
        </motion.p>

        <motion.div
          id="demo-preview"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease }}
          className="mt-12 sm:mt-16"
        >
          <InteractiveExamPreview />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
