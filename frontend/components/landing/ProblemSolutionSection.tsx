import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-24 border-t border-white/15 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50 mb-2">
            WHY ACTIVE RETRIEVAL WINS
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-display text-white [text-wrap:balance]">
            Reading feels like studying. Practice proves it.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 [text-wrap:pretty] leading-relaxed">
            Passive reading gives you the illusion of competence until the exam sheet lands on your desk.
            Active recall through targeted question drills forces retrieval before grade day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Way */}
          <div className="rounded-none border border-white/15 bg-black p-6 sm:p-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none text-xs font-mono uppercase tracking-wider bg-white/5 text-white/70 border border-white/20">
              <XCircle className="size-3.5 text-white/70" aria-hidden="true" />
              <span>What most students do</span>
            </div>
            <h3 className="text-2xl font-heading font-bold text-white [text-wrap:balance]">
              Highlight slides and reread summaries
            </h3>
            <ul className="space-y-4 text-sm text-white/60 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="mt-2 size-1.5 rounded-none bg-white/40 shrink-0" />
                <span>Familiarity tricks you. Your eyes recognize text without proving you can retrieve it.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 size-1.5 rounded-none bg-white/40 shrink-0" />
                <span>Hours go into flashcards that rarely match how the exam actually asks questions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 size-1.5 rounded-none bg-white/40 shrink-0" />
                <span>Plausible distractors still catch you cold when the professor uses them on test day.</span>
              </li>
            </ul>
          </div>

          {/* Somma Method */}
          <div className="rounded-none border border-white/40 bg-black p-6 sm:p-10 space-y-6 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none text-xs font-mono uppercase tracking-wider bg-white text-black border border-white font-semibold">
              <CheckCircle2 className="size-3.5 text-black" aria-hidden="true" />
              <span>What Somma does instead</span>
            </div>
            <h3 className="text-2xl font-heading font-bold text-white [text-wrap:balance]">
              Timed drills built from your notes
            </h3>
            <ul className="space-y-4 text-sm text-white/90 leading-relaxed">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-white shrink-0 mt-1" aria-hidden="true" />
                <span>Forces retrieval so definitions and mechanisms stick past the all nighter.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-white shrink-0 mt-1" aria-hidden="true" />
                <span>Builds a mock exam from your slides in about thirty seconds.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="size-4 text-white shrink-0 mt-1" aria-hidden="true" />
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