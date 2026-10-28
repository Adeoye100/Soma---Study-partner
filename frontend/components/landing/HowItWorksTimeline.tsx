import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  Download,
  Sliders,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ease = [0.32, 0.72, 0, 1] as const;

export const HowItWorksTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [questionCount, setQuestionCount] = useState(20);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Standard');

  return (
    <section id="how-it-works" className="py-24 border-t border-border bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
            THREE-STEP PIPELINE
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-foreground [text-wrap:balance]">
            From dense lecture slides to scored practice
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground [text-wrap:pretty] leading-relaxed">
            Three steps. About thirty seconds from upload to a timed drill.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-10">
          {[
            { num: 1, title: 'Upload Materials' },
            { num: 2, title: 'Configure Drill' },
            { num: 3, title: 'Drill & Retain' },
          ].map((tab) => (
            <button
              key={tab.num}
              type="button"
              onClick={() => setActiveStep(tab.num)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border active:scale-[0.98] ${
                activeStep === tab.num
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/40'
              }`}
            >
              <span className="font-mono">{tab.num}.</span> {tab.title}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 lg:p-12 min-h-[400px] flex flex-col justify-between shadow-sm">
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div className="space-y-5">
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                    STEP 01
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Upload course materials</h3>
                  <p className="text-base text-muted-foreground leading-relaxed [text-wrap:pretty]">
                    Drop lecture slides, study guides, or chapter summaries. Text and diagrams are indexed into testable concepts without random web trivia.
                  </p>
                  <ul className="space-y-3 text-sm text-foreground/90 pt-1">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 text-primary shrink-0" aria-hidden="true" />
                      Supports PDF, DOCX, or PPTX files
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 text-primary shrink-0" aria-hidden="true" />
                      Extracts definitions, formulas, and key diagrams
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl border border-border bg-muted/20 space-y-4">
                  <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                        <UploadCloud className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          Biochem_402_Lipids_Metabolism.pdf
                        </p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">3.4 MB · 42 slides</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-emerald-500 shrink-0">Processed</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="text-muted-foreground font-semibold">Indexed concepts</p>
                    <div className="flex flex-wrap gap-2">
                      {['Beta oxidation pathway', 'Carnitine shuttle', 'ATP balance: 106 net'].map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg bg-card border border-border text-foreground font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div className="space-y-5">
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                    STEP 02
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Configure the drill</h3>
                  <p className="text-base text-muted-foreground leading-relaxed [text-wrap:pretty]">
                    Choose question count from 5 to 50, difficulty level, and a timer that matches your exam format.
                  </p>
                  <ul className="space-y-3 text-sm text-foreground/90 pt-1">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 text-primary shrink-0" aria-hidden="true" />
                      Timed pacing such as 90 seconds per question
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 text-primary shrink-0" aria-hidden="true" />
                      Multiple choice and short answer formats
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl border border-border bg-muted/20 space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-foreground">Question volume</span>
                      <span className="font-mono text-primary font-bold">{questionCount} questions</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      step={5}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                      aria-label="Question count"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1.5 font-mono">
                      <span>5 quick drill</span>
                      <span>50 full exam sim</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Difficulty level</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {['Core review', 'Standard', 'Rigorous'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSelectedDifficulty(level)}
                          className={`py-2 rounded-xl border text-center font-semibold transition-all duration-200 ${
                            selectedDifficulty === level
                              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                              : 'bg-card text-muted-foreground border-border hover:text-foreground'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div className="space-y-5">
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                    STEP 03
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Practice and review</h3>
                  <p className="text-base text-muted-foreground leading-relaxed [text-wrap:pretty]">
                    Finish your timed session, review why wrong choices fail, and export a quick study summary.
                  </p>
                  <ul className="space-y-3 text-sm text-foreground/90 pt-1">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 text-primary shrink-0" aria-hidden="true" />
                      Slide references on every missed item
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 text-primary shrink-0" aria-hidden="true" />
                      One-click PDF summary export
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl border border-border bg-muted/20 space-y-4">
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-emerald-500">Drill completed</p>
                      <p className="text-2xl font-bold text-foreground font-mono mt-1">92%</p>
                    </div>
                    <span className="text-xs font-mono text-foreground font-semibold px-3 py-1 rounded-lg bg-card border border-border">
                      18 / 20 correct
                    </span>
                  </div>
                  <div className="text-xs space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Time spent</span>
                      <span className="font-mono text-foreground font-semibold">16m 42s</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Weakest topic</span>
                      <span className="text-amber-500 font-semibold text-right">Allosteric PFK 1 modulators</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-sm h-9 gap-1.5 w-full font-semibold rounded-xl">
                    <Download className="size-3.5" aria-hidden="true" />
                    Export summary PDF
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono font-medium">Step {activeStep} of 3</span>
            <div className="flex gap-2.5">
              <Button
                size="sm"
                variant="ghost"
                disabled={activeStep === 1}
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                className="text-sm h-9 font-semibold rounded-xl"
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveStep((prev) => (prev < 3 ? prev + 1 : 1))}
                className="text-sm h-9 gap-1 font-semibold rounded-xl"
              >
                <span>{activeStep === 3 ? 'Back to start' : 'Next step'}</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksTimeline;
