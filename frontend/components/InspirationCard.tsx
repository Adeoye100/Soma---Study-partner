import React, { useState, useEffect } from 'react';
import { Sparkles, Quote, BookOpen, Brain, Zap, Target } from 'lucide-react';

interface StudyPrompt {
  quote: string;
  author: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}

const studyPrompts: StudyPrompt[] = [
  {
    quote: "Testing yourself isn't just a way to measure what you know — it's one of the strongest ways to build memory.",
    author: "Make It Stick: The Science of Successful Learning",
    tag: "Active Recall",
    icon: Brain,
  },
  {
    quote: "The ultimate test of your knowledge is your ability to convey it clearly and simply to another person.",
    author: "Richard Feynman",
    tag: "Feynman Technique",
    icon: Sparkles,
  },
  {
    quote: "Retrieval practice produces durable, flexible learning that stands up under exam pressure.",
    author: "Cognitive Psychology Principle",
    tag: "Exam Readiness",
    icon: Target,
  },
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant (on Aristotle)",
    tag: "Daily Mastery",
    icon: Zap,
  },
  {
    quote: "While we teach, we learn. Break down complex chapters into questions and test your understanding early.",
    author: "Seneca",
    tag: "Study Method",
    icon: BookOpen,
  },
  {
    quote: "Spacing out your practice sessions turns short-term effort into permanent mastery.",
    author: "Spaced Repetition Science",
    tag: "Retention",
    icon: Brain,
  },
];

const InspirationCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % studyPrompts.length);
        setFade(true);
      }, 250);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const current = studyPrompts[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="w-full relative rounded-none border border-border bg-card/80 dark:bg-card/60 backdrop-blur-md p-6 sm:p-7 shadow-sm transition-all duration-300 overflow-hidden group">
      {/* Subtle ambient monochrome glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-none blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-zinc-500/10 rounded-none blur-2xl pointer-events-none" />

      {/* Header with pill tag */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
          <IconComponent className="w-3.5 h-3.5" />
          <span>{current.tag}</span>
        </div>
        <Quote className="w-5 h-5 text-muted-foreground/40" />
      </div>

      {/* Quote content */}
      <div className="min-h-[110px] sm:min-h-[120px] flex flex-col justify-between relative z-10">
        <p
          className={`font-heading text-base sm:text-lg text-foreground font-medium leading-snug tracking-normal transition-all duration-300 ${
            fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        >
          "{current.quote}"
        </p>

        <p
          className={`text-xs sm:text-sm text-muted-foreground font-sans mt-3 transition-all duration-300 ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          — {current.author}
        </p>
      </div>

      {/* Carousel dots */}
      <div className="flex items-center gap-1.5 mt-5 relative z-10">
        {studyPrompts.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrentIndex(i);
                setFade(true);
              }, 200);
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full border border-border transition-all duration-300 ${
              i === currentIndex
                ? 'w-6 bg-white border-white'
                : 'w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/50 border-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InspirationCard;
