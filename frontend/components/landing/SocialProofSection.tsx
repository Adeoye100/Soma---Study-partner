import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useTactile3DTilt } from '../../utils/animeMotion';

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
      'I used to read my notes three times and still blank on exam day. Somma\'s timed drills fixed that in the first week.',
  },
  {
    name: 'Marcus Delacroix',
    role: 'CFA Level I candidate, Paris',
    quote:
      'The fixed-income questions Somma generates from my curriculum notes are harder than the actual past papers. That\'s a good thing.',
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

function TestimonialCard({ t }: { t: Testimonial }) {
  const cardRef = useTactile3DTilt<HTMLElement>({ maxTilt: 3.5, scale: 1.015 });

  return (
    <figure
      ref={cardRef}
      className="rounded-xl border border-white/20 bg-zinc-950 p-6 sm:p-8 flex flex-col justify-between gap-6 transition-all duration-300 ease-spring hover:border-white/50 hover:shadow-lg"
    >
      <blockquote className="text-sm sm:text-base text-white/80 leading-relaxed [text-wrap:pretty]">
        "{t.quote}"
      </blockquote>

      <figcaption className="pt-4 border-t border-white/15">
        <p className="font-heading font-bold text-base text-white">{t.name}</p>
        <p className="text-xs text-white/50 mt-1 flex items-center gap-1.5">
          <GraduationCap className="size-3.5 text-white shrink-0" aria-hidden="true" />
          <span>{t.role}</span>
        </p>
      </figcaption>
    </figure>
  );
}

export const SocialProofSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 border-t border-white/15 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Strip */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-6 py-3 rounded-md border border-white/20 bg-white/5 text-xs sm:text-sm text-white/70 font-mono">
            <span>14,218 questions generated</span>
            <span className="text-white/30">/</span>
            <span>89.4% avg retention</span>
            <span className="text-white/30">/</span>
            <span>340+ courses</span>
            <span className="text-white/30">/</span>
            <span className="text-white font-semibold uppercase tracking-wider">Free to start</span>
          </div>
        </div>

        {/* Course Marquee */}
        <div className="mb-20">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-white/40 text-center mb-6">
            Course materials tested across disciplines
          </p>

          <div className="relative w-full overflow-hidden mask-gradient">
            <div className="flex gap-2.5 animate-[marquee_35s_linear_infinite] whitespace-nowrap w-max hover:[animation-play-state:paused]">
              {[...COURSES, ...COURSES].map((course, idx) => (
                <span
                  key={`${course}-${idx}`}
                  className="rounded-md bg-white/5 border border-white/15 text-xs font-mono px-3.5 py-1.5 text-white/70 cursor-default hover:text-white hover:border-white/40 transition-colors"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="max-w-2xl mb-12 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/5 text-white/70 text-xs font-mono font-semibold uppercase tracking-wider px-3 py-1 mb-3">
            <span>Student Outcomes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-display text-white [text-wrap:balance]">
            Tested on real coursework
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;