import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTactile3DTilt } from '../../utils/animeMotion';

type TabId = 'source' | 'session' | 'review';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'source', label: 'Source material' },
  { id: 'session', label: 'Live session' },
  { id: 'review', label: 'Graded review' },
];

const SOURCE_CHUNKS = [
  {
    index: '01',
    title: 'Normalisation overview',
    body: 'Database normalisation organises columns and tables to minimise redundancy. The process moves a schema through First, Second, and Third Normal Form (1NF, 2NF, 3NF).',
  },
  {
    index: '02',
    title: 'B-Tree indexing',
    body: 'A B-Tree index stores keys in a balanced tree so lookups, insertions, and deletions all run in O(log n) time. PostgreSQL uses B-Trees for primary key constraints by default.',
  },
  {
    index: '03',
    title: 'Third Normal Form (3NF)',
    body: 'A relation is in 3NF if every non-key attribute is non-transitively dependent on the primary key. Violations create update anomalies when a derived attribute changes.',
  },
];

const MCQ_OPTIONS = [
  { id: 'a', text: 'O(1) constant time regardless of table size', correct: false },
  { id: 'b', text: 'O(log n) proportional to tree height', correct: true },
  { id: 'c', text: 'O(n) full sequential scan', correct: false },
  { id: 'd', text: 'O(n log n) same as sort complexity', correct: false },
];

function DigitRoll({ value, padded = 2 }: { value: number; padded?: number }) {
  const str = value.toString().padStart(padded, '0');
  return (
    <span
      className="inline-flex font-mono tabular-nums"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {str.split('').map((digit, i) => (
        <span key={i} className="relative overflow-hidden inline-block w-[0.6em]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={digit}
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block leading-none"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

function SourceTab() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <FileText className="size-3.5 text-zinc-300 shrink-0" aria-hidden="true" />
        <span className="text-xs font-medium text-text-1">
          SEN 203: Database Management Systems
        </span>
        <span className="ml-auto text-xs text-text-2">Normalization and Indexing</span>
      </div>
      {SOURCE_CHUNKS.map((chunk) => (
        <div
          key={chunk.index}
          className="rounded-none border border-border bg-surface-2 p-3 transition-colors duration-200 hover:border-zinc-500"
        >
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-[10px] text-zinc-400 font-semibold shrink-0 mt-0.5 w-6">
              {chunk.index}
            </span>
            <div>
              <p className="text-xs font-semibold text-text-1 mb-1">{chunk.title}</p>
              <p className="text-xs text-text-2 leading-relaxed">{chunk.body}</p>
            </div>
          </div>
        </div>
      ))}
      <p className="text-[11px] text-text-3 text-center pt-1">
        127 concepts indexed from 48 pages
      </p>
    </div>
  );
}

function SessionTab() {
  const [secondsRemaining, setSecondsRemaining] = useState(14 * 60 + 22);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [shakingId, setShakingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 14 * 60 + 22));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;

  const handleSelect = (opt: (typeof MCQ_OPTIONS)[number]) => {
    if (revealed) return;
    setSelectedId(opt.id);
    setRevealed(true);
    if (!opt.correct) {
      setShakingId(opt.id);
      setTimeout(() => setShakingId(null), 350);
    }
  };

  const handleReset = () => {
    setSelectedId(null);
    setRevealed(false);
  };

  return (
    <div className="space-y-3">
      {/* Timer + progress bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-text-2">
          <Clock className="size-3.5 shrink-0" aria-hidden="true" />
          <span>Question 7 of 20</span>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-none bg-surface-2 border border-border text-xs font-semibold text-white"
          aria-label="Time remaining"
          aria-live="off"
        >
          <DigitRoll value={mins} />
          <span className="text-text-2">:</span>
          <DigitRoll value={secs} />
        </div>
      </div>

      <div className="h-1 w-full rounded-none bg-surface-3 overflow-hidden border border-border">
        <div
          className="h-full rounded-none bg-white transition-all duration-700"
          style={{ width: '35%' }}
        />
      </div>

      {/* Question */}
      <div className="pt-1">
        <p className="text-xs font-semibold text-text-1 leading-snug mb-3">
          What is the time complexity of a lookup on a B-Tree index with n leaf nodes?
        </p>
        <div
          className="space-y-2"
          role="radiogroup"
          aria-label="Multiple choice options"
        >
          {MCQ_OPTIONS.map((opt) => {
            const isSelected = selectedId === opt.id;
            const showResult = revealed && isSelected;
            const isShaking = shakingId === opt.id;

            let ring = 'border-border bg-surface-2 hover:border-zinc-500';
            if (isSelected && opt.correct) ring = 'border-white bg-zinc-800 text-white shadow-sm';
            if (isSelected && !opt.correct) ring = 'border-zinc-500 bg-zinc-900 text-zinc-300';

            return (
              <motion.button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(opt)}
                animate={isShaking ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full text-left rounded-none border px-3 py-2.5 text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-base active:scale-[0.99] ${ring}`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-[10px] text-text-3 uppercase font-semibold w-3 mt-0.5 shrink-0">
                    {opt.id}
                  </span>
                  <span className="text-text-1 flex-1">{opt.text}</span>
                  {showResult && (
                    <span className="shrink-0 mt-0.5">
                      {opt.correct ? (
                        <CheckCircle className="size-3.5 text-white" aria-label="Correct" />
                      ) : (
                        <XCircle className="size-3.5 text-zinc-400" aria-label="Incorrect" />
                      )}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {revealed && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-text-2 hover:text-white underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-none border border-transparent px-2 py-0.5"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewTab() {
  return (
    <div className="space-y-3">
      {/* Score header */}
      <div className="rounded-none border border-border bg-surface-2 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-text-1">Written response score</span>
          <span className="font-mono text-sm font-bold text-white tabular-nums">0.85 / 1.0</span>
        </div>
        <div className="h-1.5 w-full rounded-none bg-surface-3 overflow-hidden border border-border">
          <div className="h-full rounded-none bg-white" style={{ width: '85%' }} />
        </div>
      </div>

      {/* Student answer */}
      <div className="rounded-none border border-border bg-surface-2 p-3 space-y-1.5">
        <p className="text-[10px] font-semibold text-text-3 uppercase tracking-wide">Your answer</p>
        <p className="text-xs text-text-1 leading-relaxed">
          A B-Tree index enables O(log n) lookups by keeping keys sorted in a balanced tree.
          Each node stores pointers to child nodes, so the search descends at most h levels
          where h is the tree height.
        </p>
      </div>

      {/* Canonical answer */}
      <div className="rounded-none border border-zinc-600 bg-zinc-900/90 p-3 space-y-1.5">
        <p className="text-[10px] font-semibold text-zinc-300 uppercase tracking-wide">Model answer</p>
        <p className="text-xs text-text-1 leading-relaxed">
          A B-Tree index achieves O(log n) lookup complexity. The tree is kept balanced across
          insertions and deletions, so height grows logarithmically with n. Missing from your
          answer: PostgreSQL uses B-Trees for primary key constraints by default.
        </p>
      </div>

      {/* Source excerpt */}
      <div className="rounded-none border border-border bg-surface-2 p-3 space-y-1.5">
        <p className="text-[10px] font-semibold text-text-3 uppercase tracking-wide">
          Source excerpt (page 12)
        </p>
        <blockquote className="text-xs text-text-2 leading-relaxed border-l-2 border-white pl-2.5">
          "A B-Tree index stores keys in a balanced tree so lookups, insertions, and deletions
          all run in O(log n) time. PostgreSQL uses B-Trees for primary key constraints by
          default."
        </blockquote>
      </div>
    </div>
  );
}

export const InteractiveExamPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('source');
  const cardRef = useTactile3DTilt<HTMLDivElement>({ maxTilt: 3.5, scale: 1.01 });

  return (
    <div
      ref={cardRef}
      className="w-full max-w-md mx-auto rounded-none border border-zinc-700/80 bg-surface-1 overflow-hidden shadow-lg transition-all duration-300 hover:border-zinc-500"
      aria-label="Interactive product preview"
    >
      {/* Tab bar */}
      <div
        className="flex border-b border-border bg-surface-2"
        role="tablist"
        aria-label="Preview tabs"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-white border-b-2 border-t-0 border-l-0 border-r-0 ${
              activeTab === tab.id
                ? 'border-b-white text-white font-semibold bg-surface-1'
                : 'border-b-transparent text-text-2 hover:text-text-1 hover:bg-surface-1/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            id={`tab-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'source' && <SourceTab />}
            {activeTab === 'session' && <SessionTab />}
            {activeTab === 'review' && <ReviewTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveExamPreview;
