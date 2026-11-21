import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Headphones,
  Maximize2
} from 'lucide-react';

export const Page5FocusRoom: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState<string>('Binaural Focus');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [sessionGoal, setSessionGoal] = useState('');

  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto toggle mode
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const handleToggleTimer = () => {
    setIsActive(v => !v);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const handleSwitchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.round(((totalTime - timeLeft) / totalTime) * 100);

  const soundscapes = ['Binaural Focus', 'Ambient Rain', 'Library Quiet', 'Brown Noise'];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-6 px-4 sm:px-6 gap-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between p-4 bg-surface-1 border border-border">
        <div className="flex items-center gap-2">
          <Timer className="size-4 text-text-1" />
          <h2
            className="text-lg font-serif text-text-1 font-medium"
            style={{ fontFamily: "'ITC Garamond Std', Georgia, serif" }}
          >
            Deep Work Chamber
          </h2>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-surface-2 border border-border text-xs">
          <button
            type="button"
            onClick={() => handleSwitchMode('focus')}
            className={`px-3 py-1 font-medium transition-all ${
              mode === 'focus' ? 'bg-white text-black font-semibold' : 'text-text-2 hover:text-text-1'
            }`}
          >
            Deep Focus (25m)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode('break')}
            className={`px-3 py-1 font-medium transition-all ${
              mode === 'break' ? 'bg-white text-black font-semibold' : 'text-text-2 hover:text-text-1'
            }`}
          >
            Restorative Break (5m)
          </button>
        </div>
      </div>

      {/* Main Focus Clock Display */}
      <div className="w-full p-8 sm:p-12 bg-surface-1 border border-border flex flex-col items-center justify-center gap-6 relative">
        {/* Circular Progress Ring */}
        <div className="relative size-64 flex items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#27272a"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#ffffff"
              strokeWidth="3"
              fill="none"
              strokeDasharray={283}
              strokeDashoffset={283 - (283 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-text-1">
              {formattedTime}
            </span>
            <span className="font-mono text-xs text-text-3 uppercase tracking-widest mt-2">
              {mode === 'focus' ? '[Focus State]' : '[Break Interval]'}
            </span>
          </div>
        </div>

        {/* Timer Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleTimer}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold text-sm hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-sm"
          >
            {isActive ? <Pause className="size-4" /> : <Play className="size-4 fill-black" />}
            <span>{isActive ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetTimer}
            className="p-2.5 bg-surface-2 hover:bg-surface-3 text-text-2 hover:text-text-1 border border-border transition-colors"
            title="Reset timer"
            aria-label="Reset timer"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        {/* Goal / Intent Input */}
        <div className="w-full max-w-md mt-4">
          <input
            type="text"
            value={sessionGoal}
            onChange={e => setSessionGoal(e.target.value)}
            placeholder="Single cognitive goal for this focus block (e.g. Master Bayes theorem proofs)..."
            className="w-full px-3 py-2 bg-surface-2 border border-border text-xs text-center text-text-1 placeholder:text-text-3 focus:outline-none focus:border-white"
          />
        </div>
      </div>

      {/* Ambient Soundscapes Bar */}
      <div className="w-full p-4 bg-surface-1 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-text-2">
          <Headphones className="size-4 text-white" />
          <span className="font-mono uppercase text-[11px] text-text-3">Ambient Soundscape</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {soundscapes.map(sound => (
            <button
              key={sound}
              type="button"
              onClick={() => {
                setActiveSoundscape(sound);
                setSoundEnabled(true);
              }}
              className={`px-3 py-1 transition-all ${
                activeSoundscape === sound && soundEnabled
                  ? 'bg-white text-black font-semibold'
                  : 'bg-surface-2 text-text-2 border border-border hover:border-white/40'
              }`}
            >
              {sound}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setSoundEnabled(v => !v)}
            className="p-1.5 bg-surface-2 text-text-2 hover:text-text-1 border border-border"
            title={soundEnabled ? 'Mute' : 'Unmute'}
            aria-label={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="size-3.5 text-white" /> : <VolumeX className="size-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page5FocusRoom;
