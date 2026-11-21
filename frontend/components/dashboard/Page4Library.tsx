import React, { useState } from 'react';
import {
  Layers,
  RotateCw,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Search,
  Filter,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { Flashcard } from './types';

const INITIAL_CARDS: Flashcard[] = [
  {
    id: 'c1',
    front: 'What distinguishes Dynamic Programming from standard Divide and Conquer?',
    back: 'Dynamic Programming addresses overlapping subproblems and optimal substructure by memoizing or tabulating subproblem results to prevent redundant recalculation, whereas Divide and Conquer solves independent subproblems.',
    category: 'Algorithms',
    difficulty: 'Intermediate'
  },
  {
    id: 'c2',
    front: 'Explain the mechanism of Long-Term Potentiation (LTP) in synaptic plasticity.',
    back: 'LTP is the persistent strengthening of synapses based on recent patterns of activity. High-frequency stimulation causes glutamate release that activates NMDA receptors, allowing Ca2+ influx that triggers insertion of additional AMPA receptors into the postsynaptic membrane.',
    category: 'Neuroscience',
    difficulty: 'Advanced'
  },
  {
    id: 'c3',
    front: 'What is the Commerce Clause doctrine established in Wickard v. Filburn (1942)?',
    back: 'The aggregation doctrine: Even if an individual activity is local and non-commercial in isolation, Congress may regulate it under the Commerce Clause if the cumulative economic effect across all individuals exerts a substantial impact on interstate commerce.',
    category: 'Constitutional Law',
    difficulty: 'Advanced'
  },
  {
    id: 'c4',
    front: 'Define Opportunity Cost and its distinction from Sunk Cost.',
    back: 'Opportunity cost represents the forgone benefit of the next best alternative given up when making a choice. Sunk cost is an expense that has already occurred and cannot be recovered, which should rationally be ignored in prospective decision-making.',
    category: 'Economics',
    difficulty: 'Beginner'
  },
  {
    id: 'c5',
    front: 'How does the CAP theorem apply to distributed data stores?',
    back: 'Under a network partition (P), a distributed system can guarantee either Consistency (all nodes see the exact same data simultaneously) or Availability (every request receives a non-error response), but cannot guarantee both simultaneously.',
    category: 'Systems',
    difficulty: 'Intermediate'
  }
];

export const Page4Library: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>(INITIAL_CARDS);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['All', 'Algorithms', 'Neuroscience', 'Constitutional Law', 'Economics', 'Systems'];

  const filteredCards = cards.filter(card => {
    const matchesCat = selectedCategory === 'All' || card.category === selectedCategory;
    const matchesSearch =
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-4 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-surface-1 border border-border">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono text-text-3 uppercase tracking-wider">
            <Layers className="size-3.5 text-text-1" />
            <span>Curated Knowledge Vault</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-medium tracking-tight text-text-1 font-serif"
            style={{ fontFamily: "'ITC Garamond Std', Georgia, serif" }}
          >
            Study Decks & Concepts
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-text-2 bg-surface-2 px-3 py-1.5 border border-border">
          <BrainCircuit className="size-4 text-white" />
          <span>{filteredCards.length} Concept Cards</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-semibold'
                  : 'bg-surface-1 text-text-2 border border-border hover:border-white/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search concepts..."
            className="w-full pl-8 pr-3 py-1.5 bg-surface-1 border border-border text-xs text-text-1 placeholder:text-text-3 focus:outline-none focus:border-white"
          />
        </div>
      </div>

      {/* Flashcard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCards.map(card => {
          const isFlipped = Boolean(flippedCards[card.id]);

          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="group cursor-pointer min-h-[220px] p-5 bg-surface-1 border border-border hover:border-white/60 transition-all duration-200 flex flex-col justify-between select-none relative"
            >
              <div className="flex items-center justify-between text-xs font-mono text-text-3 mb-2">
                <span className="uppercase text-[10px] px-1.5 py-0.5 bg-surface-2 border border-border text-text-2">
                  {card.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-text-2">
                  <RotateCw className="size-3 group-hover:rotate-180 transition-transform duration-300" />
                  {isFlipped ? 'Answer' : 'Prompt'}
                </span>
              </div>

              <div className="my-auto py-2">
                {!isFlipped ? (
                  <p className="text-sm sm:text-base font-semibold text-text-1 leading-relaxed">
                    {card.front}
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-text-2 leading-relaxed">
                    {card.back}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-text-3 pt-3 border-t border-border/50">
                <span>Difficulty: {card.difficulty}</span>
                <span className="text-text-2 group-hover:text-white transition-colors">
                  {isFlipped ? 'Click to show prompt' : 'Click to reveal answer'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page4Library;
