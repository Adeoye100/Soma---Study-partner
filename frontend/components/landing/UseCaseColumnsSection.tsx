import React from 'react';
import { CalendarDays, BookMarked, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAnimeEntrance } from './useAnimeEntrance';

interface ColData {
  icon: LucideIcon;
  title: string;
  body: string;
}

const COLUMNS: ColData[] = [
  {
    icon: CalendarDays,
    title: 'Weekly lecture review',
    body: "Upload each week's slides after class and run a ten-minute foundation quiz to make sure you understood the main definitions before the next lecture builds on them.",
  },
  {
    icon: BookMarked,
    title: 'Midterm and final prep',
    body: 'Combine an entire semester of PDFs and markdown notes into one corpus. Run full-length, rigorous timed exams that mix multiple-choice recall with written problem solving.',
  },
  {
    icon: Target,
    title: 'Targeted weakness drills',
    body: 'Short on time before a test? Check your Mastery Loop dashboard and generate a focused five-question drill covering only the topics you missed in previous sessions.',
  },
];

export const UseCaseColumnsSection: React.FC = () => {
  const sectionRef = useAnimeEntrance<HTMLDivElement>('[data-anime]', {
    translateY: 28,
    duration: 580,
    stagger: 90,
  });

  return (
    <section id="exam-modes" className="py-24 sm:py-32 border-t border-border">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6">
        <div data-anime className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-1">
            How students use Soma through the semester.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {COLUMNS.map((col) => {
            const Icon = col.icon;
            return (
              <div
                key={col.title}
                data-anime
                className="flex flex-col gap-4 p-6 rounded-xl border border-border bg-surface-1/80 backdrop-blur-sm"
              >
                <div className="size-9 rounded-md border border-border bg-surface-2 flex items-center justify-center shrink-0">
                  <Icon className="size-4 text-cobalt" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-text-1 mb-2">
                    {col.title}
                  </h3>
                  <p className="text-sm text-text-2 leading-relaxed">{col.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCaseColumnsSection;
