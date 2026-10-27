import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-[680px] mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
            Reading feels like studying. Practice proves it.
          </h2>
          <p className="mt-4 text-base text-muted-foreground [text-wrap:pretty]">
            Passive reading gives you the illusion of competence until the exam sheet lands on your desk.
            Active recall through targeted question drills forces retrieval before grade day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <XCircle className="size-4" aria-hidden="true" />
              <span>What most students do</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground [text-wrap:balance]">
              Highlight slides and reread summaries
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 size-1.5 rounded-full bg-destructive shrink-0" />
                <span>Familiarity tricks you. Your eyes recognize text without proving you can retrieve it.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 size-1.5 rounded-full bg-destructive shrink-0" />
                <span>Hours go into flashcards that rarely match how the exam actually asks questions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 size-1.5 rounded-full bg-destructive shrink-0" />
                <span>Plausible distractors still catch you cold when the professor uses them on test day.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/40 bg-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              <span>What Soma does instead</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground [text-wrap:balance]">
              Timed drills built from your notes
            </h3>
            <ul className="space-y-3 text-sm text-foreground/90 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>Forces retrieval so definitions and mechanisms stick past the all nighter.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>Builds a mock exam from your slides in about thirty seconds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>Shows why each wrong option fails, not just which letter was right.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
