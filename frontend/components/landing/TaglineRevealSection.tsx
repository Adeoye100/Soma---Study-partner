import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LINE_ONE = ['Passive', 'reading', 'feels', 'productive', 'until', 'the', 'exam', 'starts.'];
const LINE_TWO = [
  'Active',
  'recall',
  'from',
  'your',
  'own',
  'slides',
  'builds',
  'memory',
  'that',
  'holds',
  'under',
  'pressure.',
];

export const TaglineRevealSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set(words, { opacity: 1, color: 'hsl(var(--foreground))' });
      return;
    }

    gsap.set(words, { opacity: 0.28 });

    const ctx = gsap.context(() => {
      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'center 40%',
          scrub: 0.6,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  let wordIndex = 0;

  const renderLine = (line: string[]) => (
    <p className="flex flex-wrap justify-center gap-x-2.5 gap-y-2">
      {line.map((word) => {
        const index = wordIndex;
        wordIndex += 1;
        return (
          <span
            key={`${word}-${index}`}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className="inline-block text-foreground will-change-[opacity]"
          >
            {word}
          </span>
        );
      })}
    </p>
  );

  return (
    <section
      ref={sectionRef}
      className="py-24 sm:py-32 border-y border-border bg-card"
      aria-label="Core study principle"
    >
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 text-center">
        <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-snug [text-wrap:balance] space-y-3">
          {renderLine(LINE_ONE)}
          {renderLine(LINE_TWO)}
        </div>
        <p className="mt-8 text-base text-muted-foreground max-w-lg mx-auto [text-wrap:pretty]">
          Built on the testing effect: retrieving knowledge beats rereading it.
        </p>
      </div>
    </section>
  );
};

export default TaglineRevealSection;
