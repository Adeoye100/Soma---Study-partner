import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does Somma prevent hallucinated or irrelevant questions?',
    answer:
      'Somma grounds every item in your uploaded documents. It parses definitions, formulas, and mechanisms in your lecture slides. If a concept is not in your coursework, it will not appear as an answer key.',
  },
  {
    question: 'What document formats are supported?',
    answer:
      'PDF lecture decks, PowerPoint PPTX files, DOCX notes, plain text, and scanned handwritten pages. Somma uses both text extraction and structure from slide hierarchy.',
  },
  {
    question: 'Is my uploaded coursework private?',
    answer:
      'Yes. Notes, presentations, and exam history stay inside your authenticated account. Coursework is never shared publicly or sold.',
  },
  {
    question: 'Is there a free tier, and do I need a card?',
    answer:
      'You can register and generate practice tests on the free tier with no credit card. Core timers, diagnostics, and rationales are available without payment friction.',
  },
  {
    question: 'How fast does Somma generate a practice exam?',
    answer:
      'A 30 to 60 slide lecture deck typically becomes a formatted 15 to 25 question mock exam with explanations in under thirty seconds.',
  },
  {
    question: 'Can I track scores and review past sessions?',
    answer:
      'Yes. Every completed session is saved. You can review pacing, missed distractors, and retention across later attempts.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 border-t border-border bg-muted/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2 flex items-center justify-center gap-1.5">
            <HelpCircle className="size-3.5" />
            <span>COMMON QUESTIONS</span>
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-foreground [text-wrap:balance]">
            Questions before you start
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground [text-wrap:pretty]">
            Accuracy, formats, privacy, and free access.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:border-primary/40 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-heading font-semibold text-base sm:text-lg text-foreground hover:bg-muted/20 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-expanded={isOpen}
                >
                  <span className="[text-wrap:balance]">{faq.question}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <div className="px-6 pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border pt-4 [text-wrap:pretty]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
