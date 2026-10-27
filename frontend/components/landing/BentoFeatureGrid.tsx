import React, { useState } from 'react';
import {
  FileUp,
  Brain,
  Timer,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  BookmarkCheck,
  Eye,
} from 'lucide-react';

export const BentoFeatureGrid: React.FC = () => {
  const [activeFormat, setActiveFormat] = useState('PDF');
  const [isQuestionFlagged, setIsQuestionFlagged] = useState(false);

  return (
    <section id="features" className="py-24 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
            INTELLIGENT STUDY ARCHITECTURE
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-foreground [text-wrap:balance]">
            Built for the way hard courses actually test you
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground [text-wrap:pretty] leading-relaxed">
            Document intake, distractor analysis, timed pressure, and retention signals in one unified study loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="md:col-span-4 rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between group hover:border-primary/40 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <FileUp className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground">Multi format document intake</h3>
              <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                No manual flashcard formatting. Drop your 80 slide PowerPoint, syllabus PDF, or chapter notes and get a question bank.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {['PDF', 'PPTX', 'DOCX', 'Handwritten notes'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setActiveFormat(fmt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                      activeFormat === fmt
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-muted/50 text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                  <span className="font-mono text-foreground font-medium truncate">
                    Neuro_301_Synaptic_Transmission.{activeFormat === 'Handwritten notes' ? 'jpg' : activeFormat.toLowerCase()}
                  </span>
                </div>
                <span className="text-primary font-mono font-semibold shrink-0">Indexed in 4.2s</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between group hover:border-primary/40 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Eye className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground">Focus Guard</h3>
              <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                Keep solo sessions honest with focus tracking and tab switch detection.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-xl border border-border bg-muted/30 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Camera connected
                </span>
                <span className="text-foreground">98% focus</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[98%]" />
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Tab switches: 0</span>
                <span>Gaze: center</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between group hover:border-primary/40 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Brain className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground">Distractor intelligence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                Do not memorize letters. Learn the trap inside every false option before your professor writes it.
              </p>
            </div>

            <div className="mt-8 space-y-2.5">
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <span className="font-semibold text-foreground">Option B correct. </span>
                  <span className="text-muted-foreground">Supported by Slide 14 reaction mechanism.</span>
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 text-xs flex items-start gap-2.5">
                <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <span className="font-semibold text-foreground">Option D trap. </span>
                  <span className="text-muted-foreground">Only true under anaerobic conditions.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between group hover:border-primary/40 hover:shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Timer className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground">Exam room timing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                Replicate testing pressure with countdown pacing and question review flags.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-xl border border-border bg-muted/30 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-foreground">Session pacing</p>
                <p className="text-muted-foreground font-mono mt-1">01:30 per question</p>
              </div>
              <button
                type="button"
                onClick={() => setIsQuestionFlagged((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200 ease-fluid ${
                  isQuestionFlagged
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                <BookmarkCheck className="size-3.5" aria-hidden="true" />
                {isQuestionFlagged ? 'Flagged' : 'Flag question'}
              </button>
            </div>
          </div>

          <div className="md:col-span-6 rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-primary/40 hover:shadow-md transition-all duration-300">
            <div className="space-y-2.5 max-w-md">
              <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <TrendingUp className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground">Retention before exam week</h3>
              <p className="text-sm text-muted-foreground leading-relaxed [text-wrap:pretty]">
                Spot weak topics early. Track how recall holds after spaced practice, not after one lucky pass.
              </p>
            </div>

            <div className="w-full md:w-auto p-5 rounded-2xl border border-border bg-muted/20 min-w-[300px]">
              <div className="flex items-center justify-between text-xs font-semibold mb-3">
                <span className="text-foreground">Recall after practice</span>
                <span className="text-emerald-500 font-mono">+34% vs reread</span>
              </div>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: 'Day 1 drill', value: '94%', width: 'w-[94%]', color: 'bg-primary' },
                  { label: 'Day 7 spaced recall', value: '89%', width: 'w-[89%]', color: 'bg-emerald-500' },
                  { label: 'Passive reread only', value: '23%', width: 'w-[23%]', color: 'bg-destructive/60' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-muted-foreground mb-1">
                      <span>{row.label}</span>
                      <span className="font-mono text-foreground font-semibold">{row.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${row.color} ${row.width}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoFeatureGrid;
