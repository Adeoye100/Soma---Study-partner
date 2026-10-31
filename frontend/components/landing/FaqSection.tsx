import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does Somma make sure questions match my class materials?',
    answer:
      'Somma builds questions directly from the files you upload. It extracts the definitions, formulas, and diagrams from your lecture slides. If a concept is not in your coursework, Somma will not test you on it.',
  },
  {
    question: 'What file formats can I upload?',
    answer:
      'You can upload PDF slides, PowerPoint PPTX decks, Word documents, text notes, or exported handwritten PDF notes.',
  },
  {
    question: 'Is my coursework private?',
    answer:
      'Yes. Your files and quiz history are saved only inside your personal account. We do not sell your data or share your notes publicly.',
  },
  {
    question: 'Is there a free plan, and do I need a credit card?',
    answer:
      'You can sign up and start generating mock exams without entering a credit card. Core features, timed tests, and answer explanations are available for free.',
  },
  {
    question: 'How fast does Somma generate an exam?',
    answer:
      'A typical 40 to 60 slide lecture deck turns into a timed 15 to 25 question mock exam with full explanations in about thirty seconds.',
  },
  {
    question: 'Can I review past tests and track my progress?',
    answer:
      'Yes. Every completed practice exam is saved in your history so you can see where you improved and which topics to review before test day.',
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
            Everything you need to know about question accuracy, supported files, and privacy.
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
