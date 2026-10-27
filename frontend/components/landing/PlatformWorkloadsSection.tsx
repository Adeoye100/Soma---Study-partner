import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Cpu,
  ShieldCheck,
  BrainCircuit,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Search,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkloadTab {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  highlights: string[];
}

const WORKLOADS: WorkloadTab[] = [
  {
    id: 'vector-rag',
    name: 'Vector Knowledge Retrieval',
    category: 'INTELLIGENT GROUNDING',
    tagline: 'Combine operational lecture data and vector search into one unified learning model.',
    description:
      'Somma indexes your uploaded decks into high-dimensional vector embeddings. When generating drills, it queries exact definitions, formulas, and slide citations directly from your coursework—eliminating hallucinations.',
    icon: Database,
    highlights: [
      'Grounded RAG retrieval maps directly to professor slide numbers',
      'Understands complex diagrams, formulas, and biochemical pathways',
      'Zero hallucinations: questions only test what is in your materials',
    ],
  },
  {
    id: 'exam-generation',
    name: 'Adaptive Mock Generation',
    category: 'ACTIVE DRILL ENGINE',
    tagline: 'Transform 80-slide lectures into scored, timed mock exams in 30 seconds.',
    description:
      'Configure test length, time limits, and difficulty modes. Somma drafts realistic multiple-choice, select-all-that-apply, and short-answer prompts tuned to your specific professor’s testing cadence.',
    icon: Cpu,
    highlights: [
      'Auto-calibrates difficulty: Standard, High-Yield, or Board Exam mode',
      'Instant timing pressure to build real exam speed and stamina',
      'Supports mixed multi-choice, clinical case studies, and quantitative drills',
    ],
  },
  {
    id: 'proctor-telemetry',
    name: 'Focus Guard & Telemetry',
    category: 'AUTHENTIC PRESSURE',
    tagline: 'Stream real-time gaze telemetry, tab switch detection, and pacing metrics.',
    description:
      'Studying with open tabs is easy; taking closed-book exams is not. Focus Guard simulates authentic exam integrity with continuous attention monitoring, tab-switch penalties, and speed diagnostics.',
    icon: ShieldCheck,
    highlights: [
      'Local webcam gaze verification without recording or storing video',
      'Immediate alert and distraction logging upon tab or window switches',
      'Time-per-question velocity telemetry highlighting hesitation points',
    ],
  },
  {
    id: 'distractor-intel',
    name: 'Distractor Intelligence',
    category: 'MISCONCEPTION TRAP ANALYSIS',
    tagline: 'Learn why tempting false options fail before exam day.',
    description:
      'True mastery comes from knowing why wrong answers look right. Somma deconstructs plausible distractors and explains the specific logical trap embedded in each alternative choice.',
    icon: BrainCircuit,
    highlights: [
      'Exposes classic exam traps: reversal errors, scope overreach, and confusable terms',
      'Immediate rationale breakdown showing correct mechanism vs distractor',
      'Reinforces deep conceptual discrimination rather than superficial recognition',
    ],
  },
  {
    id: 'spaced-mastery',
    name: 'Spaced Mastery & Diagnostics',
    category: 'LONG-TERM RETENTION',
    tagline: 'Track memory decay curves and schedule timely active recall repetitions.',
    description:
      'Never cram and forget again. Somma analyzes your error patterns across past mock exams and schedules targeted micro-drills right before forgetting curves take over.',
    icon: TrendingUp,
    highlights: [
      'Automated weak-concept diagnosis highlighting exact syllabus chapters',
      'Spaced repetition intervals optimized for midterm and final exam dates',
      'Comprehensive mastery dashboard tracking accuracy growth across attempts',
    ],
  },
  {
    id: 'multi-intake',
    name: 'Multi-Format Ingestion',
    category: 'CONTENT AGGREGATOR',
    tagline: 'Ingest PDFs, PPTX slides, Word docs, and scanned handwritten notes.',
    description:
      'Drop entire semester folders directly into Somma. Our OCR and document pipeline cleans up messy slide text, parses tables, and structure units into testable modules automatically.',
    icon: FileCheck2,
    highlights: [
      'High-throughput parsing of PowerPoint decks with slide notes and diagrams',
      'OCR engine extracts clean text from handwritten iPad and notebook scans',
      'Automatic syllabus and chapter segmentation into logical modules',
    ],
  },
];

interface PlatformWorkloadsSectionProps {
  onStartFree: () => void;
}

export const PlatformWorkloadsSection: React.FC<PlatformWorkloadsSectionProps> = ({ onStartFree }) => {
  const [activeTabId, setActiveTabId] = useState<string>('vector-rag');

  const activeWorkload = WORKLOADS.find((w) => w.id === activeTabId) || WORKLOADS[0];

  return (
    <section id="platform-workloads" className="py-24 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
            SOMMA PLATFORM ARCHITECTURE
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-foreground">
            The Intelligent Study Platform for High-Performance Students
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Every coursework format. Any difficult subject. One intelligent platform designed from the ground up for active recall.
          </p>
        </div>

        {/* MongoDB Style Horizontal Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-border/80">
          {WORKLOADS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* MongoDB Style Tab Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTabId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-border bg-card p-6 sm:p-10 lg:p-12 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Details & Value Proposition */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {activeWorkload.category}
                  </span>
                  <h3 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-foreground">
                    {activeWorkload.tagline}
                  </h3>
                </div>

                <p className="text-base text-muted-foreground leading-relaxed">
                  {activeWorkload.description}
                </p>

                <div className="space-y-3 pt-2">
                  {activeWorkload.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-1" />
                      <span className="text-sm font-medium text-foreground/90">{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Button
                    onClick={onStartFree}
                    className="font-semibold text-sm h-10 px-5 gap-2 rounded-xl"
                  >
                    <span>Start free with {activeWorkload.name.split(' ')[0]}</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Interactive Live Simulation Widget */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 shadow-inner font-mono text-xs">
                  {/* Vector RAG Widget */}
                  {activeTabId === 'vector-rag' && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl border border-border bg-card flex items-center gap-2.5 text-muted-foreground">
                        <Search className="size-4 text-primary shrink-0" />
                        <span className="text-foreground truncate font-sans text-xs">
                          "allosteric regulation of phosphofructokinase 1"
                        </span>
                        <span className="ml-auto text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono font-semibold">
                          Cosine: 0.942
                        </span>
                      </div>

                      <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                        <div className="flex items-center justify-between text-[11px] pb-2 border-b border-border text-muted-foreground">
                          <span className="text-primary font-semibold">Matched Source Chunk</span>
                          <span>Lec_04_Glycolysis.pdf (Slide 18)</span>
                        </div>
                        <p className="font-sans text-xs text-foreground/90 leading-relaxed bg-muted/20 p-2.5 rounded border border-border">
                          "...PFK-1 is the key pacemaker of glycolysis. It is allosterically inhibited by high levels of ATP and citrate, and stimulated by AMP and Fructose-2,6-bisphosphate."
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-emerald-500">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <CheckCircle2 className="size-3.5" />
                            Grounded verified
                          </span>
                          <span className="text-muted-foreground">Retrieval latency: 12ms</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-border/80 bg-background/60 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Vector database index:</span>
                        <span className="text-foreground font-semibold">1,420 chunks embedded</span>
                      </div>
                    </div>
                  )}

                  {/* Adaptive Exam Generation Widget */}
                  {activeTabId === 'exam-generation' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
                          <span className="flex items-center gap-2">
                            <Sliders className="size-3.5 text-primary" />
                            Exam Drill Configuration
                          </span>
                          <span className="text-primary">Custom Profile</span>
                        </div>

                        <div className="space-y-2 font-sans text-xs">
                          <div className="flex justify-between items-center py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Question Count:</span>
                            <span className="font-semibold text-foreground">20 items</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Time Per Item:</span>
                            <span className="font-semibold text-foreground">45 seconds</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-muted-foreground">Target Difficulty:</span>
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              Clinical Vignette (Hard)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                          <Sparkles className="size-4" />
                          <span>Generated 20 Realistic Test Items</span>
                        </div>
                        <span className="text-muted-foreground">Ready in 4.8s</span>
                      </div>
                    </div>
                  )}

                  {/* Focus Guard Widget */}
                  {activeTabId === 'proctor-telemetry' && (
                    <div className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Focus Score</p>
                          <p className="text-2xl font-bold text-emerald-500">98.8%</p>
                          <p className="text-[10px] text-muted-foreground">Gaze: Centered</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border bg-card text-center space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Tab Violations</p>
                          <p className="text-2xl font-bold text-foreground">0</p>
                          <p className="text-[10px] text-emerald-500 font-semibold">Integrity Verified</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Pacing Velocity:</span>
                          <span className="text-foreground font-semibold">28.4s / question (Optimal)</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-[85%]" />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-right pt-0.5">38% faster than class average</p>
                      </div>
                    </div>
                  )}

                  {/* Distractor Intelligence Widget */}
                  {activeTabId === 'distractor-intel' && (
                    <div className="space-y-3 font-sans">
                      <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1 text-xs">
                        <p className="font-semibold text-emerald-500 flex items-center gap-1.5 font-mono text-[11px]">
                          <CheckCircle2 className="size-3.5" />
                          KEY: Phosphofructokinase-1 (PFK-1)
                        </p>
                        <p className="text-foreground/90 text-[11px] leading-relaxed">
                          Irreversible, committed regulatory control point of glycolytic flux.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 space-y-1 text-xs">
                        <p className="font-semibold text-destructive flex items-center gap-1.5 font-mono text-[11px]">
                          <span>TRAP CHOICE: Hexokinase</span>
                        </p>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          Misconception trap: While Hexokinase is the first step, G6P can enter glycogen synthesis or PPP, making it non-committed.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Spaced Mastery Widget */}
                  {activeTabId === 'spaced-mastery' && (
                    <div className="space-y-3 font-sans">
                      <div className="p-4 rounded-xl border border-border bg-card space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-foreground">Retention Decay Forecast</span>
                          <span className="text-primary font-mono">92% Recall</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                          <span>Day 1: 100%</span>
                          <span>Day 4: 92%</span>
                          <span>Next Review: Day 7</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-foreground">Priority Weak-Spot</p>
                          <p className="text-[11px] text-muted-foreground">Lipid Beta-Oxidation ATP Yield</p>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-primary text-primary-foreground text-[10px] font-semibold">
                          Drill 5 Items
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Multi-Format Ingestion Widget */}
                  {activeTabId === 'multi-intake' && (
                    <div className="space-y-3">
                      {[
                        { name: 'Organic_Chem_Mechanisms.pptx', size: '14.2 MB', slides: '84 slides', status: 'Indexed' },
                        { name: 'Cardiology_Pathology_Notes.pdf', size: '6.1 MB', slides: '32 pages', status: 'Indexed' },
                        { name: 'Neuro_Synapse_Diagram.jpg', size: '2.8 MB', slides: 'OCR Clean', status: 'Indexed' },
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                          <div className="min-w-0 font-sans">
                            <p className="font-semibold text-foreground truncate">{item.name}</p>
                            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{item.size} • {item.slides}</p>
                          </div>
                          <span className="text-emerald-500 font-semibold font-mono text-[11px] shrink-0">
                            ✓ {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PlatformWorkloadsSection;
