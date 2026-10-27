import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import InteractiveExamPreview from './InteractiveExamPreview';

interface HeroSectionProps {
  onScrollToDemo: () => void;
}

const ease = [0.32, 0.72, 0, 1] as const;

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToDemo }) => {
  const navigate = useNavigate();
  const [activeStudioTab, setActiveStudioTab] = useState<'drill' | 'pipeline' | 'telemetry'>('drill');

  const handleStartFree = () => {
    navigate('/login', { state: { showSignup: true } });
  };

  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
      {/* MongoDB Subtle Background Grid & Gradients */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.07) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[420px] bg-primary/10 blur-[130px] rounded-full -z-10"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow & Headline in MongoDB Center-Hero Layout */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6 hover:bg-primary/15 transition-colors cursor-pointer"
            onClick={onScrollToDemo}
          >
            <Sparkles className="size-3.5" />
            <span className="font-mono uppercase tracking-wider text-[11px]">SOMMA ATLAS</span>
            <span className="text-muted-foreground/60">•</span>
            <span>Intelligent Study Platform for Hard Courses</span>
            <ArrowRight className="size-3" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="font-brand text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground [text-wrap:balance]"
          >
            Somma
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight [text-wrap:balance] leading-[1.12] text-foreground"
          >
            Turn 80 slide lecture decks
            <br className="hidden sm:block" />
            into realistic mock exams in 30 seconds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]"
          >
            Combine slide parsing, vector knowledge retrieval, distractor intelligence, and exam-grade proctoring in a single intelligent learning platform built for active recall.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Button
              size="lg"
              onClick={handleStartFree}
              className="w-full sm:w-auto px-6 py-3.5 h-auto text-base font-semibold gap-2 rounded-xl shadow-md shadow-primary/10 hover:shadow-lg transition-all"
            >
              <span>Create your first exam free</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>

            <button
              type="button"
              onClick={onScrollToDemo}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-border bg-card/60 hover:bg-card text-sm font-semibold text-foreground hover:text-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center gap-2"
            >
              <Terminal className="size-4 text-primary" />
              <span>Try the sample question</span>
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-4 text-xs sm:text-sm text-muted-foreground"
          >
            No credit card required. Used across 340 courses from organic chemistry to corporate finance.
          </motion.p>
        </div>

        {/* MongoDB Atlas Style Interactive Developer Studio Window */}
        <motion.div
          id="demo-preview"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="mt-14 sm:mt-18 max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden transition-all duration-300">
            {/* MongoDB Header Bar */}
            <div className="px-4 py-3 border-b border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-muted-foreground bg-background/80 px-2.5 py-1 rounded-md border border-border">
                  <FileCode2 className="size-3.5 text-primary" />
                  <span>somma-exam-runner // bio301-glycolysis</span>
                </div>
              </div>

              {/* Studio Tabs */}
              <div className="flex items-center gap-1 bg-background/60 p-1 rounded-lg border border-border text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('drill')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                    activeStudioTab === 'drill'
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Cpu className="size-3.5" />
                  <span>Interactive Exam</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('pipeline')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                    activeStudioTab === 'pipeline'
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Layers className="size-3.5" />
                  <span>Vector Grounding</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStudioTab('telemetry')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                    activeStudioTab === 'telemetry'
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ShieldCheck className="size-3.5" />
                  <span>Proctor Guard</span>
                </button>
              </div>
            </div>

            {/* Studio Body Content */}
            <div className="p-4 sm:p-8 bg-card/60">
              {activeStudioTab === 'drill' && (
                <div>
                  <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-mono">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE RETRIEVAL ENGINE ACTIVE
                    </span>
                    <span className="font-mono">Course: Biochemistry 301</span>
                  </div>
                  <InteractiveExamPreview />
                </div>
              )}

              {activeStudioTab === 'pipeline' && (
                <div className="space-y-4 py-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
                    <span className="font-mono text-primary font-semibold">RAG Retrieval Pipeline: Bio301_Glycolysis.pdf</span>
                    <span className="font-mono">Match confidence: 99.4%</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-background/50 font-mono text-xs space-y-2">
                      <p className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Extracted Slide Text Chunk #14</p>
                      <p className="text-foreground/90 leading-relaxed bg-muted/20 p-2.5 rounded border border-border">
                        "Phosphofructokinase-1 (PFK-1) catalyzes the committed rate-limiting step of glycolysis: converting Fructose-6-P to Fructose-1,6-bisphosphate. Allosterically inhibited by ATP."
                      </p>
                      <div className="flex items-center gap-2 text-emerald-500 text-[11px] pt-1">
                        <CheckCircle2 className="size-3.5" />
                        <span>Semantic Vector Embedding: 1536 dim [0.892, -0.421, 0.771...]</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background/50 font-mono text-xs space-y-2">
                      <p className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Synthesized Distractor Matrix</p>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="p-1.5 rounded bg-muted/30 border border-border text-foreground/80">
                          <span className="text-primary font-bold">Trap A:</span> Hexokinase (Misconception: first step vs committed pacemaker)
                        </div>
                        <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-semibold">
                          <span className="font-bold">Key B:</span> PFK-1 (Accurate committed irreversible regulatory step)
                        </div>
                        <div className="p-1.5 rounded bg-muted/30 border border-border text-foreground/80">
                          <span className="text-primary font-bold">Trap C:</span> Pyruvate Kinase (Downstream feedforward target)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStudioTab === 'telemetry' && (
                <div className="space-y-4 py-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border">
                    <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      Proctor Telemetry Stream: Connected
                    </span>
                    <span>Session ID: #exam-8842-active</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl border border-border bg-background/50 space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Gaze & Attention</p>
                      <p className="text-lg font-bold text-foreground">98.6%</p>
                      <p className="text-[11px] text-emerald-500">Center alignment verified</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background/50 space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Tab Switch Events</p>
                      <p className="text-lg font-bold text-foreground">0 Defections</p>
                      <p className="text-[11px] text-muted-foreground">Fullscreen locked</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-background/50 space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Time Per Question</p>
                      <p className="text-lg font-bold text-foreground">22.4 sec</p>
                      <p className="text-[11px] text-primary">Target: &lt; 45 sec pace</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
