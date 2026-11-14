import React, { useState, useEffect } from 'react';
import {
  FileUp,
  Brain,
  Timer,
  LineChart as LineChartIcon,
  ShieldCheck,
  Check,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const RETENTION_DATA = [
  { session: 'Session 1', score: 61 },
  { session: 'Session 2', score: 74 },
  { session: 'Session 3', score: 89 },
];

export const BentoFeatureGrid: React.FC = () => {
  const [activeFileFormat, setActiveFileFormat] = useState('PPTX');
  const [isQuestionFlagged, setIsQuestionFlagged] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(72);
  const [dropProgress, setDropProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 90));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateDrop = (fmt: string) => {
    setActiveFileFormat(fmt);
    setDropProgress(0);
    setTimeout(() => setDropProgress(45), 200);
    setTimeout(() => setDropProgress(85), 450);
    setTimeout(() => setDropProgress(100), 700);
  };

  return (
    <section id="features" className="py-24 sm:py-32 border-t border-border bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-mute text-accent text-xs font-semibold px-3 py-1 mb-3">
            <span>Core Mechanisms</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-display text-text-1 [text-wrap:balance]">
            Built for the way hard courses actually test you
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-2 [text-wrap:pretty]">
            Every feature exposes the underlying mechanism of active recall, distractor detection, and exam pacing.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 — Document Intake (Tall Left) */}
          <div className="rounded-2xl border border-border bg-surface-1 p-6 flex flex-col justify-between transition-all duration-300 ease-spring hover:scale-[1.02] hover:border-accent/40 active:scale-[0.98] shadow-lg shadow-black/20 md:row-span-2">
            <div>
              <div className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-4">
                <FileUp className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-text-1 mb-2">
                Document intake
              </h3>
              <p className="text-sm text-text-2 leading-relaxed [text-wrap:pretty]">
                Drop a 50-slide PowerPoint or a scanned lab manual. Soma indexes structure, diagrams, and definitions in one pass.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex flex-wrap gap-2">
                {['PPTX', 'PDF', 'DOCX', 'Scanned Notes'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleSimulateDrop(fmt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      activeFileFormat === fmt
                        ? 'bg-accent text-white border-accent'
                        : 'bg-surface-2 text-text-2 border-border hover:text-text-1'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Animated Dropzone Widget */}
              <div className="p-4 rounded-xl border border-border bg-surface-2/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-text-1 font-medium truncate max-w-[180px]">
                    Cell_Bio_Lecture_04.{activeFileFormat === 'Scanned Notes' ? 'png' : activeFileFormat.toLowerCase()}
                  </span>
                  <span className="text-accent font-mono font-semibold">
                    {dropProgress === 100 ? '127 concepts indexed' : `${dropProgress}%`}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${dropProgress}%` }}
                  />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-text-3 font-mono pt-1">
                  <Sparkles className="size-3 text-accent" />
                  <span>Structure, definitions, and equations mapped</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Distractor Intelligence (Tall Left) */}
          <div className="rounded-2xl border border-border bg-surface-1 p-6 flex flex-col justify-between transition-all duration-300 ease-spring hover:scale-[1.02] hover:border-accent/40 active:scale-[0.98] shadow-lg shadow-black/20 md:row-span-2">
            <div>
              <div className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-4">
                <Brain className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-text-1 mb-2">
                Distractor intelligence
              </h3>
              <p className="text-sm text-text-2 leading-relaxed [text-wrap:pretty]">
                Don't memorise letters. Understand the trap built into every wrong answer.
              </p>
            </div>

            <div className="mt-8 space-y-2.5">
              <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs">
                <div className="flex items-center gap-2 font-semibold text-text-1 mb-1">
                  <div className="size-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    <Check className="size-3" />
                  </div>
                  <span>Phosphofructokinase-1</span>
                </div>
                <p className="text-text-2 text-[11px] pl-6">
                  Committed rate-limiting step with irreversible flux control.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 text-xs relative group">
                <div className="flex items-center justify-between text-text-1 font-semibold mb-1">
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">
                      ✕
                    </div>
                    <span>Hexokinase</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                    Trap
                  </span>
                </div>
                <p className="text-text-2 text-[11px] pl-6">
                  This is the first step, not the committed step.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 — Timed Exam Simulation */}
          <div className="rounded-2xl border border-border bg-surface-1 p-6 flex flex-col justify-between transition-all duration-300 ease-spring hover:scale-[1.02] hover:border-accent/40 active:scale-[0.98] shadow-lg shadow-black/20">
            <div>
              <div className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-4">
                <Timer className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-text-1 mb-2">
                Timed exam simulation
              </h3>
              <p className="text-sm text-text-2 leading-relaxed [text-wrap:pretty]">
                Set question count, difficulty, and time limit. Practice under real exam room conditions.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl border border-border bg-surface-2/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-text-2">Progress: 14 / 20</span>
                <span className="font-mono text-accent font-semibold">
                  00:{timerSeconds.toString().padStart(2, '0')}
                </span>
              </div>

              <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full w-[70%]" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-text-3 font-mono">Difficulty: High</span>
                <button
                  type="button"
                  onClick={() => setIsQuestionFlagged(!isQuestionFlagged)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                    isQuestionFlagged
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-surface-3 text-text-2 border-border hover:text-text-1'
                  }`}
                >
                  <BookmarkCheck className="size-3" />
                  <span>{isQuestionFlagged ? 'Flagged for review' : 'Flag for review'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 4 — Retention Analytics */}
          <div className="rounded-2xl border border-border bg-surface-1 p-6 flex flex-col justify-between transition-all duration-300 ease-spring hover:scale-[1.02] hover:border-accent/40 active:scale-[0.98] shadow-lg shadow-black/20">
            <div>
              <div className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-4">
                <LineChartIcon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-text-1 mb-2">
                Retention analytics
              </h3>
              <p className="text-sm text-text-2 leading-relaxed [text-wrap:pretty]">
                Spot knowledge gaps before the exam. Track topic-by-topic retention across every drill.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl border border-border bg-surface-2/60">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-text-1">Spaced Recall Progression</span>
                <span className="text-emerald-400 font-mono">61% → 74% → 89%</span>
              </div>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={RETENTION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="session" stroke="#55555F" fontSize={10} tickLine={false} />
                    <YAxis domain={[50, 100]} stroke="#55555F" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#131316',
                        borderColor: '#2A2A32',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#F2F2F5',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#695CFF"
                      strokeWidth={2.5}
                      dot={{ fill: '#695CFF', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Card 5 — Focus Guard */}
          <div className="rounded-2xl border border-border bg-surface-1 p-6 flex flex-col justify-between transition-all duration-300 ease-spring hover:scale-[1.02] hover:border-accent/40 active:scale-[0.98] shadow-lg shadow-black/20">
            <div>
              <div className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-4">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-text-1 mb-2">
                Focus guard
              </h3>
              <p className="text-sm text-text-2 leading-relaxed [text-wrap:pretty]">
                Self-study discipline, enforced. Soma flags tab switches and focus breaks so sessions stay honest.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl border border-border bg-surface-2/60 space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-3 border border-border text-xs font-mono text-text-1">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>● Focus active — 0 interruptions</span>
              </div>
              <p className="text-[11px] text-text-3 font-mono">
                Tab blur & window switch telemetry active
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoFeatureGrid;
