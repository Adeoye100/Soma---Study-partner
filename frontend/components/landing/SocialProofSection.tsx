import React from 'react';
import { GraduationCap } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Chidera Okafor',
    role: '3rd Year, Pharmacology, University of Lagos',
    quote:
      'Raised my pharmacology quiz average from 68% to 91% in four weeks. The distractor explanations are what made the difference.',
  },
  {
    name: 'Priya Venkataraman',
    role: 'Pre-Med, Johns Hopkins',
    quote:
      'I used to read my notes three times and still blank on exam day. Soma\'s timed drills fixed that in the first week.',
  },
  {
    name: 'Marcus Delacroix',
    role: 'CFA Level I candidate, Paris',
    quote:
      'The fixed-income questions Soma generates from my curriculum notes are harder than the actual past papers. That\'s a good thing.',
  },
];

const COURSES = [
  'Organic Chemistry II',
  'Corporate Finance 320',
  'Anatomy & Physiology',
  'Linear Algebra',
  'Constitutional Law',
  'Biochemistry I',
  'Macroeconomics',
  'Pharmacology',
  'Neuroscience',
  'AP Physics C',
  'Molecular Biology',
  'International Relations',
  'MCAT Prep',
];

export const SocialProofSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 border-t border-border bg-base overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 7.3 — Stats Strip */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-6 py-3 rounded-full border border-border bg-surface-1 text-sm text-text-2 font-mono">
            <span>14,218 questions generated</span>
            <span className="text-text-3">·</span>
            <span>89.4% avg retention</span>
            <span className="text-text-3">·</span>
            <span>340+ courses</span>
            <span className="text-text-3">·</span>
            <span className="text-accent font-semibold">Free to start</span>
          </div>
        </div>

        {/* 7.1 — Course Marquee */}
        <div className="mb-20">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-text-3 text-center mb-6">
            Course materials tested across disciplines
          </p>

          <div className="relative w-full overflow-hidden mask-gradient">
            <div className="flex gap-3 animate-[marquee_35s_linear_infinite] whitespace-nowrap w-max hover:[animation-play-state:paused]">
              {[...COURSES, ...COURSES].map((course, idx) => (
                <span
                  key={`${course}-${idx}`}
                  className="rounded-full bg-surface-2 border border-border text-sm px-4 py-1.5 text-text-2 cursor-default hover:text-text-1 hover:border-accent/40 transition-colors"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 7.2 — Testimonials Header */}
        <div className="max-w-2xl mb-12 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-mute text-accent text-xs font-semibold px-3 py-1 mb-3">
            <span>Student Outcomes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-display text-text-1 [text-wrap:balance]">
            Tested on real coursework
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all duration-300 ease-spring hover:scale-[1.02] hover:border-accent/40 active:scale-[0.98] shadow-lg shadow-black/20"
            >
              <blockquote className="text-sm sm:text-base text-text-1 leading-relaxed [text-wrap:pretty]">
                "{t.quote}"
              </blockquote>

              <figcaption className="pt-4 border-t border-border">
                <p className="font-bold text-base text-text-1">{t.name}</p>
                <p className="text-xs text-text-2 mt-1 flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-accent shrink-0" aria-hidden="true" />
                  <span>{t.role}</span>
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
