import React, { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import {
  Upload,
  FileText,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowUp,
  AlertCircle
} from 'lucide-react';
import { ExamConfig, ExamType, Difficulty, TimeIntensity, Material, Question } from '../../types';
import { generateExam } from '../../services/geminiService';
import { extractTextFromFile } from '../../utils/extractText';
import { UploadedFileRecord } from './types';
import Loader from '../Loader';

interface Page1StudioProps {
  user: User;
  onExamStart: (questions: Question[], config: ExamConfig) => void;
  onFileUploaded?: (file: UploadedFileRecord) => void;
}

// Time-based welcome message pools fitting the exam / study context strictly from the user's list:
const MORNING_MESSAGES: string[] = [
  "Good morning, {name}. Easy pace or full tilt?",
  "Morning, {name}. What’s first up?",
  "Morning, {name}. Let’s make it count.",
  "Quiet morning to think clearly, {name}.",
  "Bright and early. What are we tackling, {name}?",
  "Before the day gets loud—what’s the plan, {name}?",
  "Fresh morning, blank slate, {name}.",
  "A clean start to the day, {name}.",
  "Good morning, {name}. One thing at a time.",
  "Morning, {name}. What’s the main thing today?",
  "Clear head, open canvas, {name}.",
  "Starting fresh—where’s your head at, {name}?",
  "Good morning, {name}. Ready to sketch things out?",
  "Crisp start. What’s worth doing first, {name}?",
  "First task of the day—what is it, {name}?",
  "Let’s get the morning moving, {name}.",
  "Back at it, {name}.",
  "Welcome back to the desk, {name}.",
  "What’s the focus, {name}?",
  "Let’s make some headway, {name}."
];

const AFTERNOON_MESSAGES: string[] = [
  "Good afternoon, {name}.",
  "Midday check-in—what’s next, {name}?",
  "Keeping the momentum going, {name}.",
  "Afternoon, {name}. Ready for the next stretch?",
  "Afternoon focus. Let’s narrow it down, {name}.",
  "Second wind. What’s on the table, {name}?",
  "Good afternoon, {name}. Let’s finish strong.",
  "One good afternoon sprint—what’s the target, {name}?",
  "Good afternoon, {name}. Where are we at?",
  "Steady pace. What’s in the queue, {name}?",
  "Mid-afternoon clarity starts here, {name}.",
  "What’s the afternoon priority, {name}?",
  "Good afternoon, {name}. Let’s clear a few things off.",
  "Back from a breather? Let’s go, {name}.",
  "Picking up the pace, {name}?",
  "Floor’s yours, {name}.",
  "Let’s dig in, {name}.",
  "What are we untangling today, {name}?",
  "What needs a second pair of eyes, {name}?"
];

const EVENING_NIGHT_MESSAGES: string[] = [
  "Good evening, {name}.",
  "Quiet hours—best time to think, {name}.",
  "Evening, {name}. Winding down or just starting?",
  "Late-night clarity hits different, {name}.",
  "The world’s quiet. What are we working on, {name}?",
  "Soft lighting, sharp focus, {name}.",
  "Evening session—what’s the focus, {name}?",
  "Good evening, {name}. Slow and steady.",
  "One more pass before calling it a night, {name}?",
  "Late night, clear signal, {name}.",
  "Quiet desk, no distractions, {name}.",
  "Evening calm. Where should we look, {name}?",
  "Still awake—let’s put it to good use, {name}.",
  "Good evening, {name}. Take your time.",
  "Still thinking about it? Let’s get it down, {name}.",
  "Midnight notebook is open, {name}.",
  "Ready for round two, {name}?",
  "Think out loud—I’m listening, {name}.",
  "Point me at the hard part, {name}."
];

const getRandomWelcomeMessage = (hour: number): string => {
  let pool: string[];
  if (hour >= 5 && hour < 12) {
    pool = MORNING_MESSAGES;
  } else if (hour >= 12 && hour < 18) {
    pool = AFTERNOON_MESSAGES;
  } else {
    pool = EVENING_NIGHT_MESSAGES;
  }
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
};

export const Page1Studio: React.FC<Page1StudioProps> = ({
  user,
  onExamStart,
  onFileUploaded
}) => {
  const rawUserName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner';
  const nameParts = rawUserName.trim().split(/\s+/);
  const displayName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1][0].toUpperCase()}.` : nameParts[0];

  // Random, time-based welcome message initialized on mount/refresh/view switch
  const [welcomeTemplate, setWelcomeTemplate] = useState<string>(() => {
    return getRandomWelcomeMessage(new Date().getHours());
  });

  useEffect(() => {
    setWelcomeTemplate(getRandomWelcomeMessage(new Date().getHours()));
  }, []);

  // Exam Generation State
  const [promptText, setPromptText] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration options
  const [config, setConfig] = useState<ExamConfig>({
    title: '',
    topics: '',
    type: ExamType.OBJECTIVE,
    difficulty: Difficulty.INTERMEDIATE,
    intensity: TimeIntensity.MODERATE,
    numQuestions: 10,
  });

  const TIME_PER_INTENSITY: Record<TimeIntensity, number> = {
    [TimeIntensity.RELAXED]: 180,
    [TimeIntensity.MODERATE]: 90,
    [TimeIntensity.CHALLENGING]: 45,
  };

  const calculatedTotalSeconds = TIME_PER_INTENSITY[config.intensity] * config.numQuestions;
  const formattedDuration = `${Math.floor(calculatedTotalSeconds / 60)} min`;

  // File handling
  const handleProcessFiles = async (files: File[]) => {
    const newMaterials: Material[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (file.size > 15 * 1024 * 1024) {
        errors.push(`${file.name} exceeds the 15MB limit.`);
        continue;
      }

      try {
        const textContent = await extractTextFromFile(file);
        newMaterials.push({
          name: file.name,
          content: textContent,
          mimeType: file.type || 'text/plain'
        });

        // Record into history
        const fileRecord: UploadedFileRecord = {
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type || file.name.split('.').pop() || 'unknown',
          uploadedAt: new Date().toISOString(),
          contentSnippet: textContent.slice(0, 180).trim() + (textContent.length > 180 ? '...' : ''),
          fullContent: textContent,
          mimeType: file.type
        };

        if (onFileUploaded) {
          onFileUploaded(fileRecord);
        }

        // Save to localStorage
        try {
          const saved = localStorage.getItem('soma_uploaded_files');
          const list: UploadedFileRecord[] = saved ? JSON.parse(saved) : [];
          localStorage.setItem('soma_uploaded_files', JSON.stringify([fileRecord, ...list]));
        } catch {
          // ignore
        }
      } catch (err) {
        errors.push(`Failed to extract text from ${file.name}`);
      }
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
    } else {
      setErrorMessage(null);
    }

    setMaterials(prev => [...prev, ...newMaterials]);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleProcessFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemoveMaterial = (idx: number) => {
    setMaterials(prev => prev.filter((_, i) => i !== idx));
  };

  const handleLaunchExam = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const activeTopics = (config.topics || promptText).trim();
    if (!activeTopics && materials.length === 0) {
      setErrorMessage('Please list specific study topics or attach reference materials to randomize questions from.');
      return;
    }

    const effectiveTitle = config.title.trim() || `${activeTopics || 'Material Review'} Assessment`;

    const finalConfig: ExamConfig = {
      ...config,
      title: effectiveTitle,
      topics: activeTopics || 'Comprehensive Material Review'
    };

    setIsLoading(true);

    try {
      const generatedQuestions = await generateExam(materials, finalConfig);
      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error('No questions could be generated from the given prompt. Please refine the topics or attached materials.');
      }
      onExamStart(generatedQuestions, finalConfig);
    } catch (err: any) {
      setErrorMessage(err.message || 'Exam generation encountered an unexpected error.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader text="Synthesizing personalized exam questions from your parameters..." />
      </div>
    );
  }

  // Render title with styled underline under the user's name
  const renderWelcomeTitle = (template: string, name: string) => {
    if (!template.includes('{name}')) {
      return template;
    }
    const [before, after] = template.split('{name}');
    return (
      <>
        {before}
        <span className="relative inline-block font-normal">
          {name}
          {/* Organic underline brush curve */}
          <svg
            className="absolute -bottom-1 left-0 w-full h-2 text-white/70 dark:text-white/70 text-zinc-900/70 overflow-visible"
            viewBox="0 0 100 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 5.5C25 1.5 75 1.5 99 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {after}
      </>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-auto flex flex-col items-center justify-center py-6 px-4">
      {/* Greeting Title with Organic Underline (Shifted to center with content) */}
      <div className="text-center mb-6">
        <h1
          className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-text-1 leading-snug"
          style={{ fontFamily: "'ITC Garamond Std', Georgia, serif" }}
        >
          {renderWelcomeTitle(welcomeTemplate, displayName)}
        </h1>
      </div>

      {/* Conversational AI Prompt / Study Launcher Card */}
      <div
        className={`w-full bg-surface-1 dark:bg-[#121215] bg-[#ffffff] border transition-all duration-200 p-4 sm:p-5 shadow-sm ${
          isDragging
            ? 'border-white dark:border-white border-zinc-900 bg-surface-2 dark:bg-[#18181b] bg-[#f4f4f5]'
            : 'border-border dark:border-[#27272a] border-[#e4e4e7]'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <form onSubmit={handleLaunchExam} className="flex flex-col gap-3">
          {/* Main Search / Prompt Input */}
          <div className="relative flex items-start gap-3">
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => {
                setPromptText(e.target.value);
                setConfig(prev => ({
                  ...prev,
                  topics: e.target.value,
                  title: prev.title || `${e.target.value.slice(0, 30)} Exam`
                }));
              }}
              placeholder="List specific topics (comma-separated), or leave blank to randomize questions from your attached materials..."
              className="studio-prompt-textarea w-full bg-transparent resize-none text-sm sm:text-base font-normal leading-relaxed text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 placeholder:opacity-100 focus:outline-none py-1.5 min-h-[68px]"
            />
          </div>

          {/* Attached Files List Chips */}
          {materials.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border dark:border-[#27272a] border-[#e4e4e7]">
              {materials.map((mat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-surface-2 dark:bg-[#18181b] bg-[#f4f4f5] border border-border dark:border-[#27272a] border-[#d4d4d8] text-text-1"
                >
                  <FileText className="size-3 text-text-2 dark:text-zinc-400 text-zinc-600" />
                  <span className="truncate max-w-[180px]">{mat.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(idx)}
                    className="text-text-3 dark:text-zinc-400 text-zinc-500 hover:text-text-1 dark:hover:text-white hover:text-black ml-1"
                    title="Remove file"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Prompt Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border dark:border-[#27272a] border-[#e4e4e7] text-xs">
            {/* Left Controls: File Upload & Config toggle */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                onChange={(e) => e.target.files && handleProcessFiles(Array.from(e.target.files))}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-2 dark:bg-[#18181b] bg-[#f4f4f5] hover:bg-surface-3 dark:hover:bg-[#27272a] hover:bg-[#e4e4e7] text-text-2 dark:text-zinc-300 text-zinc-700 hover:text-text-1 dark:hover:text-white hover:text-black border border-border dark:border-[#27272a] border-[#d4d4d8] transition-colors font-medium"
                title="Attach study files (PDF, PNG, JPG, Text)"
              >
                <Upload className="size-3.5" />
                <span>Attach Files</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfig(v => !v)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 border transition-colors font-medium ${
                  showConfig
                    ? 'bg-white dark:bg-white bg-black text-black dark:text-black text-white border-white dark:border-white border-black font-semibold'
                    : 'bg-surface-2 dark:bg-[#18181b] bg-[#f4f4f5] hover:bg-surface-3 dark:hover:bg-[#27272a] hover:bg-[#e4e4e7] text-text-2 dark:text-zinc-300 text-zinc-700 hover:text-text-1 dark:hover:text-white hover:text-black border-border dark:border-[#27272a] border-[#d4d4d8]'
                }`}
              >
                <SlidersHorizontal className="size-3.5" />
                <span>Config</span>
                {showConfig ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>
            </div>

            {/* Right Controls: Model / Session indicator and Launch CTA */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-text-3 dark:text-zinc-400 text-zinc-500">
                <Clock className="size-3" />
                <span>{config.numQuestions} Qs · {formattedDuration}</span>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white bg-black text-black dark:text-black text-white text-xs sm:text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-200 hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-sm"
              >
                <span>Launch Exam</span>
                <ArrowUp className="size-3.5" />
              </button>
            </div>
          </div>
        </form>

        {/* Detailed Configuration Accordion */}
        {showConfig && (
          <div className="mt-4 pt-4 border-t border-border dark:border-[#27272a] border-[#e4e4e7] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Exam Format */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-3 dark:text-zinc-400 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                Exam Format
              </label>
              <select
                value={config.type}
                onChange={(e) => setConfig(prev => ({ ...prev, type: e.target.value as ExamType }))}
                className="bg-surface-2 dark:bg-[#18181b] bg-[#f4f4f5] border border-border dark:border-[#27272a] border-[#d4d4d8] text-text-1 dark:text-white text-black p-2 focus:outline-none focus:border-white dark:focus:border-white focus:border-black"
              >
                <option value={ExamType.OBJECTIVE}>Multiple Choice</option>
                <option value={ExamType.SHORT_ANSWER}>Short Answer</option>
                <option value={ExamType.ESSAY}>Essay / Long Form</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-3 dark:text-zinc-400 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                Difficulty
              </label>
              <select
                value={config.difficulty}
                onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))}
                className="bg-surface-2 dark:bg-[#18181b] bg-[#f4f4f5] border border-border dark:border-[#27272a] border-[#d4d4d8] text-text-1 dark:text-white text-black p-2 focus:outline-none focus:border-white dark:focus:border-white focus:border-black"
              >
                <option value={Difficulty.BEGINNER}>Beginner</option>
                <option value={Difficulty.INTERMEDIATE}>Intermediate</option>
                <option value={Difficulty.ADVANCED}>Advanced</option>
              </select>
            </div>

            {/* Question Count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-3 dark:text-zinc-400 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                Questions Count
              </label>
              <select
                value={config.numQuestions}
                onChange={(e) => setConfig(prev => ({ ...prev, numQuestions: parseInt(e.target.value, 10) }))}
                className="bg-surface-2 dark:bg-[#18181b] bg-[#f4f4f5] border border-border dark:border-[#27272a] border-[#d4d4d8] text-text-1 dark:text-white text-black p-2 focus:outline-none focus:border-white dark:focus:border-white focus:border-black"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            {/* Time Intensity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-3 dark:text-zinc-400 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
                Pacing Intensity
              </label>
              <select
                value={config.intensity}
                onChange={(e) => setConfig(prev => ({ ...prev, intensity: e.target.value as TimeIntensity }))}
                className="bg-surface-2 dark:bg-[#18181b] bg-[#f4f4f5] border border-border dark:border-[#27272a] border-[#d4d4d8] text-text-1 dark:text-white text-black p-2 focus:outline-none focus:border-white dark:focus:border-white focus:border-black"
              >
                <option value={TimeIntensity.RELAXED}>Relaxed (3 min/q)</option>
                <option value={TimeIntensity.MODERATE}>Standard (1.5 min/q)</option>
                <option value={TimeIntensity.CHALLENGING}>Sprint (45s/q)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="w-full mt-4 p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Page1Studio;