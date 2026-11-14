import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FileText,
  Clock,
  Check,
  XCircle,
  RotateCcw,
} from 'lucide-react';

interface Option {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

const SAMPLE_OPTIONS: Option[] = [
  {
    id: 'opt-a',
    label: 'A',
    text: 'Hexokinase',
    isCorrect: false,
    explanation:
      'Hexokinase catalyses the first step, not the committed step. PFK-1 is the key regulatory point.',
  },
  {
    id: 'opt-b',
    label: 'B',
    text: 'Phosphofructokinase-1',
    isCorrect: true,
    explanation:
      'PFK-1 irreversibly converts Fructose 6 Phosphate to Fructose 1,6 Bisphosphate and is the master rate-limiting pacemaker.',
  },
  {
    id: 'opt-c',
    label: 'C',
    text: 'Pyruvate kinase',
    isCorrect: false,
    explanation:
      'Pyruvate kinase catalyzes the final substrate-level phosphorylation step, functioning as a downstream feed-forward target rather than the committed pacemaker.',
  },
  {
    id: 'opt-d',
    label: 'D',
    text: 'Phosphoglucose isomerase',
    isCorrect: false,
    explanation:
      'Phosphoglucose isomerase is a freely reversible equilibrium step with near-zero delta G, exerting minimal flux control.',
  },
];

export const InteractiveExamPreview: React.FC = () => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(45);
  const [shakingOptionId, setShakingOptionId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 45));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (option: Option) => {
    setSelectedOptionId(option.id);
    setIsAnswerRevealed(true);
    if (!option.isCorrect) {
      setShakingOptionId(option.id);
      setTimeout(() => setShakingOptionId(null), 350);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsAnswerRevealed(false);
    setShakingOptionId(null);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto text-left">
      <div className="rounded-2xl border border-border bg-surface-1 shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header bar */}
        <div className="px-5 py-3.5 border-b border-border bg-surface-2/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-6 rounded-md bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <FileText className="size-3.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-text-1 truncate text-xs">
                Biochemistry Lecture 08 · Glycolysis
              </p>
              <p className="text-text-3 text-[11px]">
                Slide 18 of 54 indexed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-3 text-text-1 font-mono text-xs border border-border">
              <Clock className="size-3 text-accent" aria-hidden="true" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
            <div className="px-2 py-1 rounded-md bg-accent/15 text-accent font-semibold text-xs border border-accent/20">
              7 / 20
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <p className="text-xs text-text-3 uppercase tracking-wider font-semibold mb-1.5">
              Cellular Energetics · Multiple Choice
            </p>
            <h3 className="text-base sm:text-lg font-bold text-text-1 leading-snug [text-wrap:balance]">
              Which enzyme catalyzes the committed, primary rate limiting step of glycolysis?
            </h3>
          </div>

          <div className="space-y-2.5" role="radiogroup" aria-label="Sample interactive question choices">
            {SAMPLE_OPTIONS.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const showFeedback = isAnswerRevealed && isSelected;
              const isCorrect = option.isCorrect;
              const isShaking = shakingOptionId === option.id;

              let cardStyle =
                'border-border bg-surface-2/40 hover:bg-surface-2 hover:border-accent/40 text-text-1';
              if (isSelected) {
                cardStyle = isCorrect
                  ? 'border-emerald-500/80 bg-emerald-500/10 text-text-1'
                  : 'border-red-500/80 bg-red-500/10 text-text-1';
              }

              return (
                <motion.button
                  key={option.id}
                  type="button"
                  animate={isShaking ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 ease-spring flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98] ${cardStyle}`}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div
                    className={`flex items-center justify-center size-6 rounded-md text-xs font-bold shrink-0 transition-colors duration-200 ${
                      isSelected && isCorrect
                        ? 'bg-emerald-500 text-white'
                        : isSelected && !isCorrect
                          ? 'bg-red-500 text-white'
                          : 'bg-surface-3 text-text-2'
                    }`}
                  >
                    {isSelected && isCorrect ? (
                      <Check className="size-3.5" />
                    ) : isSelected && !isCorrect ? (
                      <XCircle className="size-3.5" />
                    ) : (
                      option.label
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-relaxed [text-wrap:pretty]">
                      {option.text}
                    </p>
                    <AnimatePresence initial={false}>
                      {showFeedback && (
                        <motion.p
                          key={option.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                          className="mt-2 text-xs text-text-2 leading-relaxed [text-wrap:pretty]"
                        >
                          <span className={isCorrect ? 'font-bold text-emerald-400' : 'font-bold text-red-400'}>
                            {isCorrect ? 'Correct. ' : 'Common trap. '}
                          </span>
                          {option.explanation}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-text-3">
            <span>
              {selectedOptionId
                ? 'Select another choice to inspect distractor rationales'
                : 'Click an option to test active recall'}
            </span>
            {selectedOptionId && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-text-2 hover:text-text-1 font-semibold px-2 py-1 rounded bg-surface-3 border border-border hover:border-accent/40 transition-colors"
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveExamPreview;
