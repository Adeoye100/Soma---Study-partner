import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveExamPreview from './InteractiveExamPreview';
import { animeHeroIn } from './useAnimeEntrance';
import { useMagneticHover } from '../../utils/animeMotion';

interface HeroSectionProps {
  onScrollToDemo: () => void;
}

const HEADLINE_WORDS = [
  'Turn', 'your', 'course', 'notes', 'into',
  'practice', 'exams', 'that', 'test', 'what', 'you', 'know.'
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToDemo }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useMagneticHover<HTMLButtonElement>({ strength: 6 });
  const secondaryBtnRef = useMagneticHover<HTMLButtonElement>({ strength: 5 });

  const handleUpload = () => navigate('/login', { state: { showSignup: true } });

  useEffect(() => {
    if (!containerRef.current) return;
    // Small delay so the DOM is painted before anime reads positions
    const id = setTimeout(() => {
      animeHeroIn(containerRef.current!);
    }, 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
      <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left: copy block */}
          <div className="lg:col-span-6 space-y-6">

            {/* Headline — Preospe for display, words individually animated */}
            <h1
              className="text-5xl sm:text-6xl lg:text-[4rem] leading-[1.05] tracking-tight font-bold text-text-1"
              style={{
                fontFamily: "'Preospe', 'ITC Garamond Std', Georgia, serif",
                maxWidth: '680px',
              }}
            >
              {HEADLINE_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden"
                  style={{ marginRight: '0.28em' }}
                >
                  {/* inner span is what animejs translates — the outer clips it */}
                  <span
                    data-hero-word
                    className="inline-block text-text-1"
                    style={{ opacity: 0, transform: 'translateY(100%)' }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p
              data-hero-sub
              className="text-base sm:text-lg text-text-2 leading-relaxed"
              style={{ maxWidth: '540px', opacity: 0, transform: 'translateY(14px)' }}
            >
              Upload your lecture PDFs, slide photos, or markdown notes. Somma extracts the
              core topics, builds timed multiple-choice and written tests, grades your
              answers against your source material, and shows you what to study next.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                ref={primaryBtnRef}
                type="button"
                data-hero-cta
                onClick={handleUpload}
                className="inline-flex items-center px-5 py-2.5 rounded-md border border-white bg-white text-black text-sm font-semibold transition-all duration-200 hover:bg-zinc-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                style={{ opacity: 0, transform: 'translateY(14px)' }}
              >
                Upload study material
              </button>

              <button
                ref={secondaryBtnRef}
                type="button"
                data-hero-cta
                onClick={onScrollToDemo}
                className="inline-flex items-center px-5 py-2.5 rounded-md border border-border text-sm font-semibold text-text-1 bg-surface-1/60 backdrop-blur-sm transition-all duration-200 hover:bg-surface-2 hover:border-zinc-500 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                style={{ opacity: 0, transform: 'translateY(14px)' }}
              >
                Try a sample exam
              </button>
            </div>
          </div>

          {/* Right: 3-tab preview */}
          <div
            id="demo-preview"
            data-hero-cta
            className="lg:col-span-6 w-full"
            style={{ opacity: 0, transform: 'translateY(14px)' }}
          >
            <InteractiveExamPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
