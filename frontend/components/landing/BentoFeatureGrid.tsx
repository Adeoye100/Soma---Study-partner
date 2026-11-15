import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, PenLine, Clock, BarChart2 } from 'lucide-react';
import { useAnimeEntrance } from './useAnimeEntrance';

const ease = [0.22, 1, 0.36, 1] as const;

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function BentoCard({ children, className = '' }: Omit<CardProps, 'delay'>) {
  return (
    <div
      data-anime
      className={`group rounded-xl border border-border bg-surface-1 overflow-hidden transition-shadow duration-300 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

function SyllabusCard() {
  const [hoveredChunk, setHoveredChunk] = useState<number | null>(null);
  const chunks = [
    { label: 'Normalisation', topic: 'SEN 203 · p.4' },
    { label: 'B-Tree indexing', topic: 'SEN 203 · p.12' },
    { label: 'Transaction isolation', topic: 'SEN 203 · p.19' },
  ];

  return (
    <div className="p-6 h-full flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-md border border-border bg-surface-2 flex items-center justify-center shrink-0">
          <BookOpen className="size-4 text-cobalt" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-heading font-bold text-text-1">
            Grounded in your syllabus
          </h3>
          <p className="mt-1 text-sm text-text-2 leading-relaxed">
            Questions come straight from the documents you upload. When you review a missed
            question, Soma shows you the exact excerpt from your notes that holds the answer.
          </p>
        </div>
      </div>

      <div className="mt-auto space-y-1.5" role="list" aria-label="Sample source chunks">
        {chunks.map((chunk, i) => (
          <div
            key={i}
            role="listitem"
            onMouseEnter={() => setHoveredChunk(i)}
            onMouseLeave={() => setHoveredChunk(null)}
            onFocus={() => setHoveredChunk(i)}
            onBlur={() => setHoveredChunk(null)}
            tabIndex={0}
            className="flex items-center justify-between px-3 py-2 rounded-md border border-border bg-surface-2 cursor-default transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
            style={{
              borderColor: hoveredChunk === i ? 'var(--color-cobalt)' : undefined,
              background: hoveredChunk === i ? 'var(--color-cobalt-mute)' : undefined,
            }}
          >
            <span className="text-xs font-medium text-text-1">{chunk.label}</span>
            <span className="text-[11px] font-mono text-text-3">{chunk.topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GradingCard() {
  const [score, setScore] = useState(0);
  const mounted = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView || mounted.current) return;
    mounted.current = true;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setScore(78);
      return;
    }
    let frame: number;
    let start: number | null = null;
    const target = 78;
    const duration = 900;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setScore(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <div ref={ref} className="p-6 h-full flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-md border border-border bg-surface-2 flex items-center justify-center shrink-0">
          <PenLine className="size-4 text-cobalt" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-heading font-bold text-text-1">
            Objective and written grading
          </h3>
          <p className="mt-1 text-sm text-text-2 leading-relaxed">
            Multiple-choice questions grade instantly. Written responses are evaluated against
            a rubric derived from your course material, with partial credit and specific
            feedback on what to add.
          </p>
        </div>
      </div>

      <div className="mt-auto rounded-md border border-border bg-surface-2 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-2">Written response score</span>
          <span
            className="font-mono text-sm font-bold text-emerald tabular-nums"
            aria-label={`Score: ${score} out of 100`}
          >
            {score}
            <span className="text-text-3 font-normal">/100</span>
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full rounded-full bg-emerald transition-all duration-700"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-[11px] text-text-3">
          Partial credit awarded. Missing: example of write-ahead logging.
        </p>
      </div>
    </div>
  );
}

function TimerCard() {
  const [seconds, setSeconds] = useState(14 * 60 + 22);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 14 * 60 + 22));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="p-6 h-full flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-md border border-border bg-surface-2 flex items-center justify-center shrink-0">
          <Clock className="size-4 text-cobalt" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-heading font-bold text-text-1">
            Resilient exam timer
          </h3>
          <p className="mt-1 text-sm text-text-2 leading-relaxed">
            Practice under real time pressure. If your timer runs out, Soma automatically
            submits and grades the answers you have recorded so far.
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-center rounded-md border border-border bg-surface-2 py-5">
        <div
          className="font-mono text-4xl font-bold tabular-nums text-emerald tracking-tight"
          style={{ fontVariantNumeric: 'tabular-nums' }}
          aria-label={`${mins} minutes ${secs} seconds remaining`}
          aria-live="off"
        >
          {String(mins).padStart(2, '0')}
          <span className="text-text-3 mx-0.5">:</span>
          {String(secs).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

type MasteryLevel = 'Weak' | 'Developing' | 'Mastered';

const MASTERY_TOPICS: { label: string; level: MasteryLevel; pct: number }[] = [
  { label: 'B-Tree indexing', level: 'Mastered', pct: 92 },
  { label: 'Normalisation (1NF-3NF)', level: 'Developing', pct: 61 },
  { label: 'Transaction isolation', level: 'Weak', pct: 34 },
  { label: 'Query optimisation', level: 'Developing', pct: 55 },
];

const LEVEL_COLOR: Record<MasteryLevel, string> = {
  Mastered: 'var(--color-emerald)',
  Developing: 'var(--color-cobalt)',
  Weak: 'var(--color-amber)',
};

function MasteryCard() {
  return (
    <div className="p-6 h-full flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-md border border-border bg-surface-2 flex items-center justify-center shrink-0">
          <BarChart2 className="size-4 text-cobalt" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-heading font-bold text-text-1">
            Topic mastery tracking
          </h3>
          <p className="mt-1 text-sm text-text-2 leading-relaxed">
            Soma tracks your accuracy across sessions and ranks every topic in your syllabus
            as Weak, Developing, or Mastered, so you spend your time on the chapters that
            need work.
          </p>
        </div>
      </div>

      <div className="mt-auto space-y-2" role="list" aria-label="Topic mastery levels">
        {MASTERY_TOPICS.map((topic) => (
          <div key={topic.label} role="listitem" className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-1">{topic.label}</span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: LEVEL_COLOR[topic.level] }}
              >
                {topic.level}
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-surface-3 overflow-hidden" role="progressbar" aria-valuenow={topic.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${topic.label}: ${topic.pct}%`}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${topic.pct}%`,
                  background: LEVEL_COLOR[topic.level],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const BentoFeatureGrid: React.FC = () => {
  const sectionRef = useAnimeEntrance<HTMLDivElement>('[data-anime]', {
    translateY: 28,
    duration: 600,
    stagger: 80,
  });

  return (
    <section id="features" className="py-24 sm:py-32 border-t border-border">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <div data-anime className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-1">
            Built for how exams actually work.
          </h2>
          <p className="mt-3 text-base text-text-2 leading-relaxed">
            Every feature maps directly to a step in the study-to-exam loop.
          </p>
        </div>

        {/* Asymmetric 2x2 bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BentoCard>
            <SyllabusCard />
          </BentoCard>

          <BentoCard>
            <GradingCard />
          </BentoCard>

          <BentoCard>
            <TimerCard />
          </BentoCard>

          <BentoCard>
            <MasteryCard />
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

export default BentoFeatureGrid;
