import React from 'react';
import { Upload, Settings, Timer, CheckSquare } from 'lucide-react';
import { useAnimeEntrance } from './useAnimeEntrance';
import { useTactile3DTilt } from '../../utils/animeMotion';

const STEPS = [
  {
    number: 1,
    icon: Upload,
    title: 'Drop in your course files.',
    body: 'Upload PDFs, photos of handwritten notes or whiteboard slides, plain text, or markdown files. Somma parses the text, runs OCR on images, and organizes everything into a structured topic outline.',
  },
  {
    number: 2,
    icon: Settings,
    title: 'Configure your practice exam.',
    body: 'Pick the topics you want to cover, choose a difficulty level (Foundation, Standard, or Rigorous), set the mix of multiple-choice and written questions, and set your timer.',
  },
  {
    number: 3,
    icon: Timer,
    title: 'Sit the timed session.',
    body: 'Work through your questions with a live countdown timer. Your draft answers sync in real time, so if your connection drops or you accidentally close the tab, your session picks up right where you left it.',
  },
  {
    number: 4,
    icon: CheckSquare,
    title: 'Review mistakes and follow your study plan.',
    body: 'See your score immediately. Walk through every question with explanations tied directly to excerpts from your notes, and get a prioritized revision list based on the topics that gave you trouble.',
  },
];

function StepCard({ step }: { step: (typeof STEPS)[number] }) {
  const cardRef = useTactile3DTilt<HTMLDivElement>({ maxTilt: 3, scale: 1.01 });
  const Icon = step.icon;

  return (
    <div
      ref={cardRef}
      data-anime
      className="rounded-none border border-border bg-surface-1/80 backdrop-blur-sm p-6 flex flex-col gap-4 transition-all duration-300 hover:border-zinc-500 hover:shadow-md"
    >
      {/* Step number + icon */}
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-none border border-border bg-surface-2 flex items-center justify-center">
          <Icon className="size-4 text-white" aria-hidden="true" />
        </div>
        <span className="font-mono text-xs font-bold text-white" aria-label={`Step ${step.number}`}>
          {step.number}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-base font-heading font-bold text-text-1 mb-2">
          {step.title}
        </h3>
        <p className="text-sm text-text-2 leading-relaxed">{step.body}</p>
      </div>
    </div>
  );
}

export const HowItWorksTimeline: React.FC = () => {
  const sectionRef = useAnimeEntrance<HTMLDivElement>('[data-anime]', {
    translateY: 30,
    duration: 580,
    stagger: 90,
  });

  return (
    <section id="how-it-works" className="py-24 sm:py-32 border-t border-border">
      <div ref={sectionRef} className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div data-anime className="max-w-xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-1">
            From raw files to an adaptive study plan in four steps.
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {STEPS.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksTimeline;
