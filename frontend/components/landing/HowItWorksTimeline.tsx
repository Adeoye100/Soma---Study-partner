import React, { useState, useEffect, useRef } from 'react';
import {
  FileUp,
  SlidersHorizontal,
  TrendingUp,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorksTimeline: React.FC = () => {
  const [questionCount, setQuestionCount] = useState(20);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Standard');
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      stepRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, y: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Animate connecting line progress on scroll
      gsap.fromTo(
        line,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.5,
          },
        }
      );

      // Stagger reveal each step
      stepRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.1,
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-24 sm:py-32 border-t border-border bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-mute text-accent text-xs font-semibold px-3 py-1 mb-3">
            <span>Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-display text-text-1 [text-wrap:balance]">
            From dense lecture slides to scored practice
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-2 [text-wrap:pretty]">
            Three steps. Thirty seconds from raw materials to a timed, diagnostic drill.
          </p>
        </div>

        {/* Timeline Connecting Line (Desktop) */}
        <div className="relative mb-8 hidden lg:block">
          <div className="h-0.5 w-full bg-border" />
          <div
            ref={lineRef}
            className="absolute top-0 left-0 h-0.5 w-full bg-accent"
          />
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step 1 — Upload */}
          <div
            ref={(el) => {
              stepRefs.current[0] = el;
            }}
            className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-spring hover:scale-[1.02] hover:border-accent/40 active:scale-[0.98] shadow-lg shadow-black/20"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <FileUp className="size-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-mono font-bold text-accent px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                  STEP 01
                </span>
              </div>

              <h3 className="text-2xl font-bold text-text-1 mb-3">
                Upload
              </h3>
              <p className="text-sm text-text-2 leading-relaxed [text-wrap:pretty]">
                Drop lecture slides, a study guide, or chapter summaries. Text and diagrams are indexed instantly — no formatting required.
              </p>
            </div>

            {/* Step 1 Visual Widget */}
            <div className="mt-8 p-4 rounded-xl border border-border bg-surface-2/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-text-1 font-semibold truncate max-w-[170px]">
                  Biochem_402_Lipids.pdf
                </span>
                <span className="text-emerald-400 font-semibold">Indexed in 3.8s</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-surface-3 border border-border text-text-2 text-[11px]">
                    Beta-oxidation
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-3 border border-border text-text-2 text-[11px]">
                    Carnitine shuttle
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-3 border border-border text-text-2 text-[11px]">
                    ATP stoichiometry
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 — Configure */}
          <div
            ref={(el) => {
              stepRefs.current[1] = el;
            }}
            className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-spring hover:scale-[1.02] hover:border-accent/40 active:scale-[0.98] shadow-lg shadow-black/20"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <SlidersHorizontal className="size-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-mono font-bold text-accent px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                  STEP 02
                </span>
              </div>

              <h3 className="text-2xl font-bold text-text-1 mb-3">
                Configure
              </h3>
              <p className="text-sm text-text-2 leading-relaxed [text-wrap:pretty]">
                Pick question count (5 to 50), difficulty level, format (multiple choice or short answer), and your time limit.
              </p>
            </div>

            {/* Step 2 Visual Widget */}
            <div className="mt-8 p-4 rounded-xl border border-border bg-surface-2/60 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-text-2">Question Volume</span>
                  <span className="font-mono text-accent">{questionCount} questions</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-accent h-1.5 bg-surface-3 rounded-lg cursor-pointer"
                  aria-label="Question count"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {['Core review', 'Standard', 'Rigorous'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedDifficulty(level)}
                    className={`py-1.5 rounded-lg border text-center font-semibold text-[11px] transition-all ${
                      selectedDifficulty === level
                        ? 'bg-accent text-white border-accent'
                        : 'bg-surface-3 text-text-2 border-border hover:text-text-1'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 — Drill and Review */}
          <div
            ref={(el) => {
              stepRefs.current[2] = el;
            }}
            className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-spring hover:scale-[1.02] hover:border-accent/40 active:scale-[0.98] shadow-lg shadow-black/20"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <TrendingUp className="size-5" aria-hidden="true" />
                </div>
                <span className="text-xs font-mono font-bold text-accent px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                  STEP 03
                </span>
              </div>

              <h3 className="text-2xl font-bold text-text-1 mb-3">
                Drill and review
              </h3>
              <p className="text-sm text-text-2 leading-relaxed [text-wrap:pretty]">
                Complete the drill. Get instant diagnostic feedback per question. Export your session summary as a PDF.
              </p>
            </div>

            {/* Step 3 Visual Widget */}
            <div className="mt-8 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-400">Drill Completed</span>
                <span className="font-mono text-text-1">18/20 · 91% · +23 pts from last session</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20 text-xs">
                <span className="text-text-3 text-[11px]">Weakest: PFK-1 modulators</span>
                <span className="inline-flex items-center gap-1 text-accent font-semibold text-[11px]">
                  <Download className="size-3" />
                  <span>PDF exported</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksTimeline;
