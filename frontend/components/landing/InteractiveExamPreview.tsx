import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FileText,
  Clock,
  Check,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    text: 'Hexokinase catalyzes the initial phosphorylation of glucose.',
    isCorrect: false,
    explanation:
      'Hexokinase traps glucose as Glucose 6 Phosphate, but that step is reversible in gluconeogenic tissues and is not the committed rate limiting pacemaker.',
  },
  {
    id: 'opt-b',
    label: 'B',
    text: 'Phosphofructokinase 1 (PFK 1) regulates the committed step.',
    isCorrect: true,
    explanation:
      'PFK 1 irreversibly converts Fructose 6 Phosphate to Fructose 1,6 Bisphosphate. ATP, AMP, and Fructose 2,6 Bisphosphate allosterically set glycolytic flux here.',
  },
  {
    id: 'opt-c',
    label: 'C',
    text: 'Pyruvate kinase mediates the final substrate level phosphorylation.',
    isCorrect: false,
    explanation:
      'Pyruvate kinase is regulated and produces ATP, but it sits downstream as a feed forward target rather than the master rate determining step.',
  },
  {
    id: 'opt-d',
    label: 'D',
    text: 'Aldolase cleaves hexose diphosphate into two triose isomers.',
    isCorrect: false,
    explanation:
      'Aldolase sits near equilibrium under physiological conditions and does not exert major flux control over glycolysis.',
  },
];

const swapText = (el: HTMLElement | null, next: string) => {
  if (!el) return;
  const durationRaw = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-swap-dur')
    .trim();
  const duration = Number.parseFloat(durationRaw) || 200;

  el.classList.add('is-exit');
  window.setTimeout(() => {
    el.textContent = next;
    el.classList.add('is-enter-start');
    el.classList.remove('is-exit');
    void el.offsetWidth;
    el.classList.remove('is-enter-start');
  }, duration);
};

export const InteractiveExamPreview: React.FC = () => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(104);
  const helperRef = useRef<HTMLSpanElement>(null);
  const prevHelper = useRef('');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 120));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const next = selectedOptionId
      ? 'Tap another choice to see how Somma explains the trap.'
      : 'Pick an answer to see instant rationale grounded in the lecture.';
    if (prevHelper.current && prevHelper.current !== next) {
      swapText(helperRef.current, next);
    } else if (helperRef.current) {
      helperRef.current.textContent = next;
    }
    prevHelper.current = next;
  }, [selectedOptionId]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (id: string) => {
    setSelectedOptionId(id);
    setIsAnswerRevealed(true);
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsAnswerRevealed(false);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto text-left">
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="px-4 sm:px-6 py-3 border-b border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileText className="size-3.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">
                Biochemistry Lecture 08 Glycolysis.pptx
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Slide 18 of 54 indexed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground font-mono text-xs border border-border">
              <Clock className="size-3 text-primary" aria-hidden="true" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-xs border border-primary/20">
              7 / 20
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Cellular energetics · Multiple choice
            </p>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground leading-snug [text-wrap:balance]">
              Which enzyme catalyzes the committed, primary rate limiting step of glycolysis?
            </h3>
          </div>

          <div className="space-y-3" role="radiogroup" aria-label="Sample interactive question choices">
            {SAMPLE_OPTIONS.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const showFeedback = isAnswerRevealed && isSelected;
              const isCorrect = option.isCorrect;

              let cardStyle =
                'border-border hover:border-primary/50 bg-background text-foreground';
              if (isSelected) {
                cardStyle = isCorrect
                  ? 'border-emerald-500/80 bg-emerald-500/10 text-foreground'
                  : 'border-destructive/80 bg-destructive/10 text-foreground';
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ease-fluid flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98] ${cardStyle}`}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div
                    className={`flex items-center justify-center size-7 rounded-lg text-xs font-bold shrink-0 transition-colors duration-200 ease-fluid ${
                      isSelected && isCorrect
                        ? 'bg-emerald-500 text-white'
                        : isSelected && !isCorrect
                          ? 'bg-destructive text-white'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isSelected && isCorrect ? (
                      <Check className="size-4" />
                    ) : isSelected && !isCorrect ? (
                      <XCircle className="size-4" />
                    ) : (
                      option.label
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium leading-relaxed [text-wrap:pretty]">
                      {option.text}
                    </p>
                    <AnimatePresence initial={false}>
                      {showFeedback && (
                        <motion.p
                          key={option.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                          className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]"
                        >
                          <span className="font-semibold text-foreground">
                            {isCorrect ? 'Correct. ' : 'Common trap. '}
                          </span>
                          {option.explanation}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <span ref={helperRef} className="t-text-swap text-muted-foreground [text-wrap:pretty]" />
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="text-sm font-semibold h-8 shrink-0"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveExamPreview;
