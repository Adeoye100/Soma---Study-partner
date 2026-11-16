import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useAnimeEntrance } from './useAnimeEntrance';

// AnimatePresence stays for the accordion height animation — that's
// triggered by user action, not scroll, so Framer Motion is appropriate here.

const ease = [0.22, 1, 0.36, 1] as const;

const FAQS = [
  {
    q: 'What file types can I upload?',
    a: 'You can upload PDF documents, PNG and JPEG images (including photos of slides or handwritten pages), plain text files, and Markdown files. If you upload the same file twice, Somma recognizes it automatically and avoids creating duplicates.',
  },
  {
    q: 'How does Somma grade written answers?',
    a: 'When Somma generates a written question from your notes, it also creates a grading rubric based on the source text. When you submit your answer, it compares your response against that rubric, awards full or partial credit, and explains which key concepts you hit or missed.',
  },
  {
    q: 'What happens if my internet disconnects during a timed test?',
    a: 'Your session state and draft answers sync continuously over a live connection. If your page refreshes or your Wi-Fi drops briefly, you can rejoin the active session without losing your recorded answers. If time expires while you are away, Somma grades the answers you already completed.',
  },
  {
    q: 'Does Somma invent facts outside my course material?',
    a: 'Somma builds its topic outlines, questions, and review explanations from the chunks of text extracted from your uploaded files. Every graded question in Review Mode includes the source excerpt from your material so you can verify it yourself.',
  },
  {
    q: 'How does the study plan decide what I should review next?',
    a: 'After each exam, Somma looks at your score per topic, the difficulty of the questions you missed, and how long ago you practiced that material. Topics with low accuracy appear at the top of your plan for immediate drills, while mastered topics are scheduled for spaced recall later on.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sectionRef = useAnimeEntrance<HTMLDivElement>('[data-anime]', {
    translateY: 20,
    duration: 500,
    stagger: 70,
  });

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="py-24 sm:py-32 border-t border-border">
      <div ref={sectionRef} className="max-w-2xl mx-auto px-4 sm:px-6">
        <div data-anime className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-1">
            Common questions before you start.
          </h2>
        </div>

        <div className="space-y-3" role="list">
          {FAQS.map((item, i) => (
            <div
              key={item.q}
              data-anime
              role="listitem"
              className="rounded-none border border-border bg-surface-1/80 backdrop-blur-sm overflow-hidden"
            >
              <button
                type="button"
                id={`faq-trigger-${i}`}
                aria-expanded={openIndex === i}
                aria-controls={`faq-panel-${i}`}
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-text-1 hover:bg-surface-2/50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-inset"
              >
                <span className="leading-snug">{item.q}</span>
                <ChevronDown
                  className={`size-4 shrink-0 text-text-2 transition-transform duration-250 ${openIndex === i ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease }}
                  >
                    <p className="px-5 pb-5 pt-0 text-sm text-text-2 leading-relaxed border-t border-border">
                      <span className="block pt-4">{item.a}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
