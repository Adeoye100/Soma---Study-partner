import React, { useState } from 'react';
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

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedDemoOption, setSelectedDemoOption] = useState<number | null>(2); // Option C selected by default for preview
  const [isDemoAnswerRevealed, setIsDemoAnswerRevealed] = useState<boolean>(true);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSignUpRedirect = () => {
    navigate('/login', { state: { showSignup: true } });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  const demoOptions = [
    { label: 'A', text: 'Glycolysis', isCorrect: false, explanation: 'Yields a net of only 2 ATP per glucose molecule via substrate level phosphorylation.' },
    { label: 'B', text: 'Citric Acid Cycle', isCorrect: false, explanation: 'Produces 2 ATP or GTP molecules along with NADH and FADH2 electron carriers.' },
    { label: 'C', text: 'Oxidative Phosphorylation', isCorrect: true, explanation: 'Generates 26 to 28 ATP molecules through chemiosmosis and the mitochondrial electron transport chain.' },
    { label: 'D', text: 'Lactic Acid Fermentation', isCorrect: false, explanation: 'Occurs in anaerobic conditions and does not yield additional ATP beyond initial glycolysis.' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      {/* Floating Island Navigation */}
      <header className="fixed top-4 inset-x-0 mx-auto max-w-5xl z-50 px-4">
        <nav
          className="flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full border border-border bg-card/85 backdrop-blur-md shadow-sm transition-all duration-200"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-4" aria-hidden="true" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-foreground">
              Somma
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-foreground transition-colors duration-150"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-foreground transition-colors duration-150"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('demo-preview')}
              className="hover:text-foreground transition-colors duration-150"
            >
              Interactive demo
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="hover:text-foreground transition-colors duration-150"
            >
              FAQ
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLoginRedirect}
              className="text-sm font-medium hidden sm:inline-flex"
            >
              Log in
            </Button>
            <Button
              size="sm"
              onClick={handleSignUpRedirect}
              className="text-sm font-semibold h-9 px-4"
            >
              Start studying
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-[680px] mx-auto [text-wrap:balance]">
              Turn lecture slides and syllabus notes into exam practice
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-[620px] mx-auto leading-relaxed [text-wrap:pretty]">
              Drop course PDFs, presentations, or study guides. Somma generates custom mock exams with instant step by step rationales in thirty seconds.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={handleSignUpRedirect}
                className="w-full sm:w-auto px-7 h-12 text-base font-semibold shadow-sm gap-2"
              >
                <span>Start studying free</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('demo-preview')}
                className="w-full sm:w-auto px-7 h-12 text-base font-medium"
              >
                Explore sample exam
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span>Over 14,200 practice questions generated across university courses</span>
            </div>
          </motion.div>

          {/* Hero Interactive Workspace Preview */}
          <motion.div
            id="demo-preview"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mt-14 sm:mt-20 text-left"
          >
            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
              {/* Mock App Header */}
              <div className="px-4 sm:px-6 py-3.5 border-b border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 font-medium text-foreground">
                  <div className="p-1 rounded bg-primary/10 text-primary">
                    <FileText className="size-4" aria-hidden="true" />
                  </div>
                  <span className="truncate max-w-[220px] sm:max-w-none">
                    Bio_201_Cellular_Respiration.pdf
                  </span>
                  <span className="text-muted-foreground">• 38 slides indexed</span>
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

              {/* Mock Exam Question Body */}
              <div className="p-5 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                    <GraduationCap className="size-4" aria-hidden="true" />
                    <span>Cellular Metabolism • Multiple Choice</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground leading-snug">
                    Which metabolic stage produces the highest net yield of ATP per glucose molecule under aerobic conditions?
                  </h2>
                </div>

                {/* Options List */}
                <div className="space-y-2.5" role="radiogroup" aria-label="Demo question choices">
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
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-start gap-3 ${optionBorderClass}`}
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
                            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {option.explanation}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Learning Rationale Footer */}
                <div className="p-4 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="size-4 text-primary shrink-0" aria-hidden="true" />
                    <span>Click any answer above to test retrieval feedback with source rationales.</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedDemoOption(null);
                      setIsDemoAnswerRevealed(false);
                    }}
                    className="text-xs h-8 shrink-0"
                  >
                    <RefreshCw className="size-3.5 mr-1.5" />
                    Reset question
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Problem to Solution Comparison */}
        <section className="py-16 sm:py-24 border-t border-border bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground [text-wrap:balance]">
                Passive review versus active exam recall
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base [text-wrap:pretty]">
                Rereading lecture slides creates an illusion of understanding. Real test readiness comes from answering questions under pressure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conventional Practice */}
              <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <XCircle className="size-4 text-destructive" aria-hidden="true" />
                  <span>The conventional study trap</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Highlighting slides and rereading summaries
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold">•</span>
                    <span>Creates false confidence by recognizing text rather than retrieving it.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold">•</span>
                    <span>Wastes study hours making manual flashcards that only test trivial vocab.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-destructive font-bold">•</span>
                    <span>Leaves you unprepared for tricky distractor options on exam day.</span>
                  </li>
                </ul>
              </div>

              {/* Somma Approach */}
              <div className="p-6 sm:p-8 rounded-2xl border border-primary/30 bg-primary/5 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  <span>The Somma exam practice method</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Direct mock testing from your actual materials
                </h3>
                <ul className="space-y-3 text-sm text-foreground/90 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold">✓</span>
                    <span>Forces mental retrieval so concepts stick into permanent memory.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold">✓</span>
                    <span>Generates tailored mock exams in thirty seconds without manual setup.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary font-bold">✓</span>
                    <span>Provides diagnostic explanations for both correct and incorrect choices.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="features" className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground [text-wrap:balance]">
              Built for rapid retention before midterm and final exams
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base [text-wrap:pretty]">
              Spend your study hours solving questions and understanding misconceptions, not formatting flashcards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Instant syllabus conversion</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload raw PDF decks, lecture slides, and notes. Somma reads complex figures and key concepts directly.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <SlidersHorizontal className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Calibrated test parameters</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Configure question counts, timing intervals, and difficulty levels matching your professor's testing style.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Layers className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Deep concept rationales</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Detailed breakdowns explain why wrong answers fail and how the right answer connects to the source material.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Targeted error drill</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review past exams and isolate questions you missed so you can retake them without repeating masteries.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 sm:py-24 border-t border-border bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground [text-wrap:balance]">
                Three steps from coursework to completed exam
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base [text-wrap:pretty]">
                From your course portal downloads straight into timed practice within thirty seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-6 rounded-2xl border border-border bg-card space-y-3">
                <div className="size-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                  1
                </div>
                <h3 className="text-lg font-semibold text-foreground">Upload your materials</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Drag and drop your lecture presentation slides, study guides, or typed syllabus notes into the setup dropzone.
                </p>
              </div>

              <div className="relative p-6 rounded-2xl border border-border bg-card space-y-3">
                <div className="size-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                  2
                </div>
                <h3 className="text-lg font-semibold text-foreground">Tune your test conditions</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Choose your question count from five to thirty, set difficulty, and toggle timer pacing to match your real test.
                </p>
              </div>

              <div className="relative p-6 rounded-2xl border border-border bg-card space-y-3">
                <div className="size-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                  3
                </div>
                <h3 className="text-lg font-semibold text-foreground">Practice and master</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Answer each question, examine detailed rationales for missed answers, and save your scored summary for review.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mandatory Tagline Reveal Section (B11) */}
        <section className="py-24 sm:py-32 border-t border-border bg-card/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-foreground/95 [text-wrap:balance]">
              Passive reading leaves eighty percent forgotten within days. Active retrieval turns course materials into lasting recall.
            </p>
            <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto [text-wrap:pretty]">
              Grounded in cognitive science research on spaced testing and test enhanced learning.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 sm:py-24 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground [text-wrap:balance]">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base">
              Everything you need to know about question generation, document support, and privacy.
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
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground hover:bg-muted/30 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
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
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
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
              Ready to test your recall before exam day?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto [text-wrap:pretty]">
              Upload your coursework and start practicing questions in under thirty seconds.
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                onClick={handleSignUpRedirect}
                className="px-8 h-12 text-base font-semibold shadow-sm gap-2"
              >
                <span>Start studying free</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              No credit card required. Free tier includes all core study formats.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 bg-card text-muted-foreground text-xs sm:text-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-6 rounded bg-primary/10 text-primary">
              <BookOpen className="size-3.5" aria-hidden="true" />
            </div>
            <span className="font-semibold text-foreground">Somma</span>
            <span className="ml-2 text-xs">© 2026 Somma. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="hover:text-foreground transition-colors"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={handleSignUpRedirect}
              className="hover:text-foreground transition-colors"
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="hover:text-foreground transition-colors"
            >
              FAQ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
