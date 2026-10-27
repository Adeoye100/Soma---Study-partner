import React from 'react';
import { GraduationCap } from 'lucide-react';

interface Testimonial {
  name: string;
  major: string;
  school: string;
  metric: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Elena Rostova',
    major: 'Biochemistry sophomore',
    school: 'University of Washington',
    metric: '94% on midterm',
    quote:
      'I stopped spending three hours handwriting flashcards. Soma turned my professor 48 slide deck into a 20 question timed drill in thirty seconds. I scored a 94.',
  },
  {
    name: 'Marcus Vance',
    major: 'Economics junior',
    school: 'University of Michigan',
    metric: 'Study time cut in half',
    quote:
      'The distractor explanations are the difference. You learn why the plausible wrong answer fails instead of memorizing letters.',
  },
  {
    name: 'Priya Patel',
    major: 'Neuroscience senior',
    school: 'Emory University',
    metric: '78% to 91%',
    quote:
      'Timed drills between lab sections stuck metabolic pathways better than rereading the slides five times.',
  },
];

const COURSE_PILLS = [
  'Organic Chemistry II',
  'Corporate Finance 320',
  'Anatomy & Physiology',
  'Linear Algebra',
  'Constitutional Law',
  'Cellular Biology 201',
  'Macroeconomic Theory',
  'Cognitive Psychology',
  'Pharmacology 410',
  'Discrete Mathematics',
];

export const SocialProofSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
        {[
          { value: '14,280+', label: 'Questions generated' },
          { value: '89.4%', label: 'Avg retention after drills' },
          { value: '340+', label: 'Courses practiced' },
          { value: '0', label: 'Credit card required' },
        ].map((stat) => (
          <div key={stat.label} className="p-5 sm:p-6 rounded-2xl border border-border bg-card text-center">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground font-mono">
              {stat.value}
            </div>
            <div className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium [text-wrap:pretty]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-16 text-center">
        <p className="text-sm text-muted-foreground font-medium mb-4">
          Students practice with materials from courses like
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {COURSE_PILLS.map((pill) => (
            <span
              key={pill}
              className="px-3.5 py-1.5 rounded-full border border-border bg-card text-xs font-semibold text-foreground/90 hover:border-primary/40 transition-colors duration-200 ease-fluid"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[680px] mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Results where the grade is on the line
        </h2>
        <p className="mt-4 text-base text-muted-foreground [text-wrap:pretty]">
          Specific outcomes from students who replaced rereading with timed retrieval.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-primary/30 transition-colors duration-300 ease-fluid"
          >
            <div className="space-y-4">
              <p className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {t.metric}
              </p>
              <blockquote className="text-sm text-foreground/90 leading-relaxed [text-wrap:pretty]">
                “{t.quote}”
              </blockquote>
            </div>
            <figcaption className="pt-4 border-t border-border">
              <p className="font-semibold text-sm text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.major}</p>
              <p className="text-xs font-medium text-primary mt-1 flex items-center gap-1">
                <GraduationCap className="size-3.5" aria-hidden="true" />
                {t.school}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default SocialProofSection;
