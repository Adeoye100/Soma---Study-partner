import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

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
      'I stopped spending three hours handwriting flashcards. Somma turned my professor 48 slide deck into a 20 question timed drill in thirty seconds. I scored a 94.',
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
    <section className="py-24 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metric Impact Cards in MongoDB Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {[
            { value: '14,280+', label: 'Questions generated' },
            { value: '89.4%', label: 'Avg retention after drills' },
            { value: '340+', label: 'Courses practiced' },
            { value: '0', label: 'Credit card required' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 sm:p-8 rounded-3xl border border-border bg-card text-center hover:border-primary/40 hover:shadow-sm transition-all duration-200">
              <div className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-foreground font-mono">
                {stat.value}
              </div>
              <div className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium [text-wrap:pretty]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* MongoDB Style Course / Ecosystem Badge Bar */}
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-5 flex items-center justify-center gap-2">
            <Sparkles className="size-3.5 text-primary" />
            <span>Students practice with materials from courses like</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {COURSE_PILLS.map((pill) => (
              <span
                key={pill}
                className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground/90 hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-default"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
            STUDENT EXPERIENCES
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-foreground [text-wrap:balance]">
            How students use Somma for tough classes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground [text-wrap:pretty] leading-relaxed">
            Feedback from students who switched from rereading slides to timed practice exams.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-primary/40 hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {t.metric}
                </span>
                <blockquote className="text-sm text-foreground/90 leading-relaxed [text-wrap:pretty]">
                  "{t.quote}"
                </blockquote>
              </div>
              <figcaption className="pt-5 border-t border-border">
                <p className="font-heading font-semibold text-base text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.major}</p>
                <p className="text-xs font-medium text-primary mt-1.5 flex items-center gap-1.5">
                  <GraduationCap className="size-3.5" aria-hidden="true" />
                  <span>{t.school}</span>
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
