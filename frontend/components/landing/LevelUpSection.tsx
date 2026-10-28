import React from 'react';
import { ArrowRight, BookOpen, Brain, ShieldCheck } from 'lucide-react';

interface LevelUpSectionProps {
  onScrollToSection: (id: string) => void;
}

export const LevelUpSection: React.FC<LevelUpSectionProps> = ({ onScrollToSection }) => {
  const cards = [
    {
      badge: 'Fast File Parser',
      title: 'Turn heavy slide decks into study outlines',
      description:
        'Upload 80-slide decks, reading lists, or textbook chapters. Somma extracts definitions, formulas, and diagrams so you can practice questions right away.',
      icon: BookOpen,
      actionId: 'how-it-works',
      actionText: 'See how uploads work',
    },
    {
      badge: 'Practice Drills',
      title: 'Spot tricky wrong answers before test day',
      description:
        'Real exams test edge cases. Somma writes realistic multiple-choice questions with convincing distractors and explains why each wrong option fails.',
      icon: Brain,
      actionId: 'features',
      actionText: 'See question generator',
    },
    {
      badge: 'Focus Training',
      title: 'Practice under timed, closed-book pressure',
      description:
        'Taking untimed tests with Google open builds false confidence. Practice with realistic timers and focus checks to build actual stamina for exam day.',
      icon: ShieldCheck,
      actionId: 'demo-preview',
      actionText: 'Try the sample question',
    },
  ];

  return (
    <section className="py-20 border-t border-border bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
            HOW SOMMA HELPS
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-foreground">
            Study active recall, not passive highlighting
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Three ways Somma prepares you for actual exams instead of just rereading your notes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => onScrollToSection(card.actionId)}
                className="group relative rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {card.badge}
                    </span>
                    <div className="size-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{card.actionText}</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LevelUpSection;
