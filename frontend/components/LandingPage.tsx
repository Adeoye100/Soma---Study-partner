import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Check,
  ChevronDown,
  ShieldCheck,
  Layers,
  GraduationCap,
  Sparkles,
  XCircle,
  SlidersHorizontal,
  RefreshCw,
  Menu,
  X,
  Brain,
  Timer,
  BarChart3,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does Somma prevent hallucinated or irrelevant questions?',
    answer:
      'Questions are grounded directly in the concepts, definitions, and formulas contained within your uploaded document. Somma indexes the core structure of your course materials rather than generating generic web trivia.',
  },
  {
    question: 'What document formats can I upload for exam creation?',
    answer:
      'You can upload PDF lecture presentations, syllabus outlines, textbook chapter summaries, and DOCX notes. The parser extracts both text and structural hierarchy to identify key testable areas.',
  },
  {
    question: 'Is Somma free to use, and do I need to add payment details?',
    answer:
      'You can sign up and start generating mock exams completely free with no credit card required. The core study flow and practice features are accessible immediately upon account creation.',
  },
  {
    question: 'How quickly does it generate a full practice exam?',
    answer:
      'Most standard lecture decks of thirty to fifty slides generate a complete, formatted fifteen question exam with step by step answer rationales in under thirty seconds.',
  },
  {
    question: 'Can I track my score progress and review past exam attempts?',
    answer:
      'Yes. Every completed mock session is preserved in your exam history dashboard. You can review time spent per question, review detailed rationales for missed answers, and track your retention over time.',
  },
  {
    question: 'Is my uploaded coursework private and secure?',
    answer:
      'Yes. Your uploaded notes, slides, and exam attempts remain private to your authenticated account. Your study materials are never shared publicly or exposed to other students.',
  },
  {
    question: 'Does Somma work smoothly on mobile phones and tablets?',
    answer:
      'Yes. The entire study experience is fully responsive. You can generate exams on your laptop and complete quick ten minute practice drills on your phone between classes.',
  },
];

const SOCIAL_STATS = [
  { value: '14,280+', label: 'Questions generated' },
  { value: '89.4%', label: 'Exam retention rate' },
  { value: '340+', label: 'University courses' },
  { value: '4.9 / 5', label: 'Average student rating' },
];

const COURSE_TAGS = [
  'Cellular Biology 201',
  'Corporate Finance 320',
  'Organic Chemistry II',
  'Macroeconomic Theory',
  'Cognitive Neuroscience',
  'Linear Algebra 210',
];

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  badge: string;
  metric: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote:
      'I stopped spending three hours handwriting flashcards before my midterm. Somma turned my professor 48 slide presentation into a 20 question timed drill in thirty seconds. Scored a 94 percent.',
    author: 'Elena Rostova',
    role: 'Biochemistry Sophomore',
    badge: 'University of Washington',
    metric: '94% on Midterm Exam',
  },
  {
    quote:
      'The step by step explanations for distractor options are what make this different. You immediately learn why the plausible wrong answer failed instead of just memorizing letters.',
    author: 'Marcus Vance',
    role: 'Economics Junior',
    badge: 'University of Michigan',
    metric: 'Cut study hours in half',
  },
  {
    quote:
      'Running timed drills on my phone between laboratory sections helped me retain difficult metabolic pathways far better than passively rereading the slides five times.',
    author: 'Priya Patel',
    role: 'Neuroscience Senior',
    badge: 'Emory University',
    metric: 'Jumped from 78% to 91%',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedDemoOption, setSelectedDemoOption] = useState<number | null>(2);
  const [isDemoAnswerRevealed, setIsDemoAnswerRevealed] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [legalModalContent, setLegalModalContent] = useState<'privacy' | 'terms' | null>(null);

  // Tagline word reveal scroll observation state
  const taglineRef = useRef<HTMLDivElement>(null);
  const [taglineProgress, setTaglineProgress] = useState<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger progressive word illumination
            let step = 0;
            const interval = setInterval(() => {
              step += 1;
              setTaglineProgress(step);
              if (step >= 24) {
                clearInterval(interval);
              }
            }, 60);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (taglineRef.current) {
      observer.observe(taglineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSignUpRedirect = () => {
    navigate('/login', { state: { showSignup: true } });
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const demoOptions = [
    {
      label: 'A',
      text: 'Glycolysis',
      isCorrect: false,
      explanation:
        'Yields a net of only 2 ATP per glucose molecule through substrate level phosphorylation in the cytosol.',
    },
    {
      label: 'B',
      text: 'Citric Acid Cycle',
      isCorrect: false,
      explanation:
        'Produces 2 ATP or GTP molecules alongside NADH and FADH2 electron carriers inside the mitochondrial matrix.',
    },
    {
      label: 'C',
      text: 'Oxidative Phosphorylation',
      isCorrect: true,
      explanation:
        'Generates 26 to 28 ATP molecules through chemiosmosis and the mitochondrial electron transport chain.',
    },
    {
      label: 'D',
      text: 'Lactic Acid Fermentation',
      isCorrect: false,
      explanation:
        'Occurs under anaerobic conditions and regenerates NAD+ without yielding additional ATP beyond glycolysis.',
    },
  ];

  const taglineWords = [
    'Passive',
    'reading',
    'leaves',
    'eighty',
    'percent',
    'forgotten',
    'within',
    'days.',
    'Active',
    'retrieval',
    'practice',
    'transforms',
    'raw',
    'coursework',
    'into',
    'permanent',
    'recall',
    'under',
    'exam',
    'conditions.',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      {/* Skip to Content for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-md focus:outline-none"
      >
        Skip to content
      </a>

      {/* Floating Island Navigation (B7) */}
      <header className="fixed top-6 inset-x-0 mx-auto w-[calc(100%-2rem)] max-w-4xl z-50">
        <nav
          className="flex items-center justify-between px-4 sm:px-6 py-2 rounded-full border border-border bg-card/85 backdrop-blur-xl shadow-sm transition-all duration-700 ease-fluid"
          aria-label="Main navigation"
        >
          <div
            className="flex items-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-4" aria-hidden="true" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-foreground">
              Somma
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5"
            >
              Benefits
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('demo-preview')}
              className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5"
            >
              Sample drill
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('proof')}
              className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5"
            >
              Reviews
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-0.5"
            >
              FAQ
            </button>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoginRedirect}
              className="text-sm font-semibold hidden sm:inline-flex h-8 px-3"
            >
              Log in
            </Button>

            <Button
              size="sm"
              onClick={handleSignUpRedirect}
              className="text-sm font-semibold h-8 px-3 active:scale-[0.98] transition-transform"
            >
              Start studying
            </Button>

            {/* Mobile Menu Hamburger Morph */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative size-4">
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-300 ease-fluid ${
                    mobileMenuOpen ? 'top-2 rotate-45' : 'top-1'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-300 ease-fluid ${
                    mobileMenuOpen ? 'opacity-0' : 'top-2.5'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-4 bg-current transition-all duration-300 ease-fluid ${
                    mobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Screen Filling Mobile Nav Modal (B7) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl flex flex-col justify-center px-8 md:hidden"
          >
            <div className="space-y-6 text-xl font-semibold">
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                onClick={() => scrollToSection('features')}
                className="block text-left text-foreground hover:text-primary transition-colors"
              >
                Benefits
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                onClick={() => scrollToSection('how-it-works')}
                className="block text-left text-foreground hover:text-primary transition-colors"
              >
                How it works
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                onClick={() => scrollToSection('demo-preview')}
                className="block text-left text-foreground hover:text-primary transition-colors"
              >
                Sample drill
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                onClick={() => scrollToSection('proof')}
                className="block text-left text-foreground hover:text-primary transition-colors"
              >
                Student reviews
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                onClick={() => scrollToSection('faq')}
                className="block text-left text-foreground hover:text-primary transition-colors"
              >
                FAQ
              </motion.button>

              <div className="pt-6 border-t border-border flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLoginRedirect}
                  className="w-full text-base font-semibold"
                >
                  Log in
                </Button>
                <Button
                  size="lg"
                  onClick={handleSignUpRedirect}
                  className="w-full text-base font-semibold"
                >
                  Start studying free
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content">
        {/* Hero Section (B5) */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Dark & Light Theme Heading Gradient per B5 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 to-neutral-500 dark:from-white dark:to-neutral-400 max-w-[680px] mx-auto [text-wrap:balance] leading-[1.12]">
              Turn lecture slides and syllabus notes into active exam practice
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-[680px] mx-auto leading-relaxed [text-wrap:pretty]">
              Upload course slide decks, chapter summaries, or lecture notes. Somma indexes the core concepts and creates realistic mock exams with step by step rationales in thirty seconds.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={handleSignUpRedirect}
                className="w-full sm:w-auto px-6 h-11 text-base font-semibold shadow-sm gap-2 active:scale-[0.98] transition-all"
              >
                <span>Start studying free</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('demo-preview')}
                className="w-full sm:w-auto px-6 h-11 text-base font-medium active:scale-[0.98] transition-all"
              >
                Try sample question
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span>Over 14,280 exam questions generated across 340 university courses</span>
            </div>
          </motion.div>

          {/* Hero Interactive Workspace Preview Widget */}
          <motion.div
            id="demo-preview"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="mt-12 sm:mt-16 text-left"
          >
            {/* Outer card: rounded-2xl (16px) */}
            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
              {/* Card Header Bar */}
              <div className="px-4 sm:px-6 py-3 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 font-medium text-foreground">
                  <div className="p-1 rounded-md bg-primary/10 text-primary">
                    <FileText className="size-4" aria-hidden="true" />
                  </div>
                  <span className="truncate max-w-[240px] sm:max-w-none font-semibold">
                    Bio 201 Cellular Respiration.pdf
                  </span>
                  <span className="text-muted-foreground hidden sm:inline">• Slide 24 of 42 indexed</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
                    <Clock className="size-3.5 text-primary" aria-hidden="true" />
                    <span>01:42 remaining</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary font-semibold">
                    <span>Question 4 of 15</span>
                  </div>
                </div>
              </div>

              {/* Exam Question Body: padding 24px (p-6) */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                    <GraduationCap className="size-4" aria-hidden="true" />
                    <span>Cellular Metabolism • Multiple Choice</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground leading-snug [text-wrap:balance]">
                    Which metabolic stage produces the highest net yield of ATP per glucose molecule under aerobic conditions?
                  </h2>
                </div>

                {/* Options List */}
                <div className="space-y-3" role="radiogroup" aria-label="Sample exam question choices">
                  {demoOptions.map((option, idx) => {
                    const isSelected = selectedDemoOption === idx;
                    const showFeedback = isDemoAnswerRevealed && isSelected;
                    const isCorrect = option.isCorrect;

                    let optionBorderClass = 'border-border hover:border-primary/50 bg-card';
                    if (isSelected) {
                      if (isCorrect) {
                        optionBorderClass = 'border-emerald-500 bg-emerald-500/5 text-foreground';
                      } else {
                        optionBorderClass = 'border-destructive bg-destructive/5 text-foreground';
                      }
                    }

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => {
                          setSelectedDemoOption(idx);
                          setIsDemoAnswerRevealed(true);
                        }}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${optionBorderClass}`}
                      >
                        <div
                          className={`flex items-center justify-center size-7 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                            isSelected && isCorrect
                              ? 'bg-emerald-500 text-white'
                              : isSelected && !isCorrect
                              ? 'bg-destructive text-white'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isSelected && isCorrect ? (
                            <Check className="size-4" />
                          ) : isSelected && !isCorrect ? (
                            <XCircle className="size-4" />
                          ) : (
                            option.label
                          )}
                        </div>
                        <div className="flex-1 text-sm sm:text-base font-medium">
                          <p>{option.text}</p>
                          {showFeedback && (
                            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                              {option.explanation}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Question Grounding & Rationale Footer: padding 16px (p-4), rounded-xl */}
                <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="size-4 text-primary shrink-0" aria-hidden="true" />
                    <span>Click any choice to test instant retrieval feedback and source grounding.</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedDemoOption(null);
                      setIsDemoAnswerRevealed(false);
                    }}
                    className="text-xs h-8 shrink-0 active:scale-[0.98]"
                  >
                    <RefreshCw className="size-3.5 mr-1.5" />
                    Reset question
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Social Proof Strip & Course Categories */}
        <section className="py-12 border-t border-border bg-muted/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {SOCIAL_STATS.map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground mr-2 font-medium">
                Tested across coursework:
              </span>
              {COURSE_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Problem to Solution Comparison */}
        <section className="py-16 sm:py-24 border-t border-border bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground [text-wrap:balance]">
                Passive reading versus active recall practice
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base [text-wrap:pretty]">
                Rereading lecture slides creates a false feeling of mastery. Genuine exam readiness requires retrieving answers under timed conditions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conventional Practice Trap */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <XCircle className="size-4 text-destructive" aria-hidden="true" />
                  <span>The conventional cramming trap</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Highlighting slide summaries and rereading notes
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold">•</span>
                    <span>Builds false confidence through recognition instead of cognitive retrieval.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold">•</span>
                    <span>Consumes valuable study hours drafting basic cards that test only shallow trivia.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold">•</span>
                    <span>Leaves you vulnerable to subtle distractor choices on the actual exam.</span>
                  </li>
                </ul>
              </div>

              {/* Somma Active Retrieval Method */}
              <div className="p-6 sm:p-8 rounded-2xl border border-primary/40 bg-card space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  <span>The Somma exam simulation method</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Direct mock testing from your course slides
                </h3>
                <ul className="space-y-3 text-sm text-foreground/90 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold">✓</span>
                    <span>Forces mental retrieval so concepts lock into long term memory.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold">✓</span>
                    <span>Builds customized mock exams in thirty seconds without manual card writing.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold">✓</span>
                    <span>Delivers clear diagnostic explanations for both correct and distractor options.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="features" className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground [text-wrap:balance]">
              Built for high retention before midterm and final exams
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base [text-wrap:pretty]">
              Spend your preparation hours answering challenging questions and diagnosing errors rather than formatting notes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Direct syllabus indexing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                Upload PDF presentation decks, syllabus topics, and notes. Somma extracts key relationships and definitions without hallucinating.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <SlidersHorizontal className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Configurable exam timing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                Adjust question volume from five to thirty, set strict countdown timers, and choose difficulty levels matching your professor.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Layers className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Thorough source rationales</h3>
              <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                Detailed explanations pinpoint why distractor choices fall short and cite exact concepts from your coursework.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Targeted error drills</h3>
              <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                Review completed mock exams and isolate questions you missed so you can retake them without redoing mastered concepts.
              </p>
            </div>
          </div>
        </section>

        {/* Mandatory Tagline Reveal Section (B11) */}
        <section className="py-24 sm:py-32 border-t border-border bg-card">
          <div ref={taglineRef} className="max-w-[680px] mx-auto px-4 sm:px-6 text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-snug [text-wrap:balance]">
              {taglineWords.map((word, index) => {
                const isIlluminated = index < taglineProgress;
                return (
                  <span
                    key={`${word}-${index}`}
                    className={`inline-block mr-2.5 transition-all duration-700 ease-fluid ${
                      isIlluminated
                        ? 'text-foreground opacity-100'
                        : 'text-muted-foreground opacity-30'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
            <p className="mt-6 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto [text-wrap:pretty]">
              Rooted in published cognitive psychology research on the testing effect and spaced recall.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 sm:py-24 border-t border-border bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground [text-wrap:balance]">
                Three steps from lecture slides to completed exam
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base [text-wrap:pretty]">
                From your course portal download directly into a timed mock exam within thirty seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
                <div className="size-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center font-mono">
                  1
                </div>
                <h3 className="text-lg font-semibold text-foreground">Upload your materials</h3>
                <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                  Drag lecture slides, textbook chapter summaries, or typed notes into the upload dropzone.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
                <div className="size-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center font-mono">
                  2
                </div>
                <h3 className="text-lg font-semibold text-foreground">Select exam parameters</h3>
                <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                  Pick your question volume from five to thirty, set test difficulty, and choose timer pacing.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
                <div className="size-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center font-mono">
                  3
                </div>
                <h3 className="text-lg font-semibold text-foreground">Solve and master recall</h3>
                <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                  Answer questions under exam pressure, study diagnostic feedback, and track your retention score.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real Student Proof / Testimonials */}
        <section id="proof" className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground [text-wrap:balance]">
              Trusted by students preparing for demanding university exams
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base [text-wrap:pretty]">
              Hear how students replace passive cramming with active retrieval across STEM, business, and humanities courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.author}
                className="p-6 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="inline-block px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
                    {item.metric}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed [text-wrap:pretty]">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-border/60">
                  <div className="font-semibold text-sm text-foreground">{item.author}</div>
                  <div className="text-xs text-muted-foreground">{item.role}</div>
                  <div className="text-xs text-primary font-medium mt-0.5">{item.badge}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 sm:py-24 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground [text-wrap:balance]">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base [text-wrap:pretty]">
              Straightforward answers about question quality, document formats, security, and pricing.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={item.question}
                  className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-expanded={isOpen}
                  >
                    <span className="[text-wrap:balance]">{item.question}</span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-fluid ${
                        isOpen ? 'rotate-180 text-foreground' : ''
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
                        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3 [text-wrap:pretty]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final Conversion & Risk Reversal */}
        <section className="py-16 sm:py-24 border-t border-border bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground [text-wrap:balance]">
              Ready to verify your retention before exam day?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto [text-wrap:pretty]">
              Drop your course slides and start answering practice questions in under thirty seconds.
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                onClick={handleSignUpRedirect}
                className="px-8 h-11 text-base font-semibold shadow-sm gap-2 active:scale-[0.98] transition-all"
              >
                <span>Start studying free</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              No credit card required. Free tier includes all core mock testing features.
            </p>
          </div>
        </section>
      </main>

      {/* Footer (B10 Ship Requirements) */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 bg-card text-muted-foreground text-xs sm:text-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-6 rounded bg-primary/10 text-primary">
              <BookOpen className="size-3.5" aria-hidden="true" />
            </div>
            <span className="font-semibold text-foreground">Somma</span>
            <span className="text-xs">© 2026 Somma. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={handleSignUpRedirect}
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={() => setLegalModalContent('privacy')}
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModalContent('terms')}
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {/* Privacy Policy & Terms Modal Dialog */}
      <AnimatePresence>
        {legalModalContent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 id="legal-modal-title" className="text-lg font-bold text-foreground">
                  {legalModalContent === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </h3>
                <button
                  type="button"
                  onClick={() => setLegalModalContent(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Close dialog"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="text-xs sm:text-sm text-muted-foreground space-y-3 leading-relaxed [text-wrap:pretty]">
                {legalModalContent === 'privacy' ? (
                  <>
                    <p>
                      Your coursework and study files belong to you. When you upload PDFs, slides, or documents to Somma, they are processed solely to generate your requested practice exams and diagnostic rationales.
                    </p>
                    <p>
                      We do not sell, rent, or distribute your course materials or study records to third parties or advertising brokers. All exam attempts, answer histories, and retention summaries are kept private to your authenticated user account.
                    </p>
                    <p>
                      You may request the permanent removal of your account and associated document data at any time through your account settings or support channels.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      By using Somma, you agree to access our exam practice generation platform for academic and educational preparation purposes.
                    </p>
                    <p>
                      You confirm that you hold the right to review and upload course documents for personal study. Somma is intended as a study aid to reinforce retention and understanding through active recall.
                    </p>
                    <p>
                      We reserve the right to suspend accounts that attempt to bypass rate limits, automate unauthorized scraping, or compromise platform integrity.
                    </p>
                  </>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setLegalModalContent(null)}
                  className="text-xs font-semibold px-4"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
