import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LINE_ONE = ['Passive', 'reading', 'gives', 'you', 'the', 'illusion', 'of', 'knowledge.'];
const LINE_TWO = ['Active', 'recall', 'is', 'how', 'you', 'actually', 'keep', 'it.'];

export const TaglineRevealSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set(words, { color: 'var(--color-text-1)' });
      return;
    }

    gsap.set(words, { color: 'var(--color-text-3)' });

    const ctx = gsap.context(() => {
      words.forEach((word, i) => {
        ScrollTrigger.create({
          trigger: word,
          start: 'top 75%',
          onEnter: () =>
            gsap.to(word, {
              color: 'var(--color-text-1)',
              duration: 0.5,
              ease: 'power2.out',
              delay: i * 0.03,
            }),
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  let wordIndex = 0;

  const renderLine = (line: string[]) => (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
      {line.map((word) => {
        const index = wordIndex;
        wordIndex += 1;
        return (
          <span
            key={`${word}-${index}`}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className="inline-block transition-colors duration-200"
          >
            {word}
          </span>
        );
      })}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 border-y border-white/15 bg-black"
      aria-label="Core active recall principle"
    >
      <div className="max-w-[720px] mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-display leading-tight text-white [text-wrap:balance] space-y-3">
          {renderLine(LINE_ONE)}
          {renderLine(LINE_TWO)}
        </h2>
      </div>
    </section>
  );
};

export default TaglineRevealSection;
